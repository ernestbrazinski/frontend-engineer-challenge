<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { ROUTES } from "$lib/constants";
  import { Input, Button, BackButton } from "$lib/components";
  import { isValidEmailFormat, newPasswordResetPolicyError } from "$helpers";
  import {
    mapPasswordRecoveryServerError,
    mapPasswordResetCompleteServerError,
    type PasswordRecoveryFormErrors,
    type PasswordResetCompleteFormErrors,
  } from "$lib/form-errors";
  import { getGraphQLRequestClient } from "$lib/graphql/graphql-request-client";
  import {
    COMPLETE_PASSWORD_RESET_MUTATION,
    REQUEST_PASSWORD_RESET_MUTATION,
  } from "$lib/graphql/operations/auth";
  import {
    auth,
    clearSession,
    finishAuthOperation,
    startAuthOperation,
  } from "$lib/stores/auth";

  type EmailStep = "form" | "sent";

  const resetToken = $derived(
    (page.url.searchParams.get("token") ?? "").trim(),
  );

  let emailStep = $state<EmailStep>("form");
  let showCompleteSuccess = $state(false);
  let showCompleteFailure = $state(false);

  let email = $state("");
  let formErrors = $state<PasswordRecoveryFormErrors>({});

  let newPassword = $state("");
  let passwordConfirm = $state("");
  let completeFormErrors = $state<PasswordResetCompleteFormErrors>({});

  async function onRequestSubmit(e: SubmitEvent) {
    e.preventDefault();

    const errors: PasswordRecoveryFormErrors = {};
    const trimmed = email.trim();

    if (!trimmed) {
      errors.email = "Введите e-mail";
    } else if (!isValidEmailFormat(trimmed)) {
      errors.email = "Недопустимый адрес почты";
    }

    formErrors = errors;
    if (Object.keys(errors).length > 0) return;

    startAuthOperation("requestPasswordReset");
    try {
      const client = getGraphQLRequestClient();
      const data = await client.request<{ requestPasswordReset: boolean }>(
        REQUEST_PASSWORD_RESET_MUTATION,
        { input: { email: trimmed } },
      );
      if (typeof data.requestPasswordReset !== "boolean") {
        formErrors = { email: "Пустой ответ сервера" };
        return;
      }
      // For a syntactically valid email the API always returns true (no user enumeration).
      emailStep = "sent";
    } catch (err) {
      formErrors = mapPasswordRecoveryServerError(err);
    } finally {
      finishAuthOperation();
    }
  }

  async function onCompleteSubmit(e: SubmitEvent) {
    e.preventDefault();
    const token = resetToken;
    if (!token) return;

    const errors: PasswordResetCompleteFormErrors = {};
    const pwdToSend = newPassword.trim();
    const policy = newPasswordResetPolicyError(newPassword);
    if (policy) errors.newPassword = policy;
    if (pwdToSend && passwordConfirm && pwdToSend !== passwordConfirm.trim()) {
      errors.passwordConfirm = "Пароли не совпадают";
    }

    completeFormErrors = errors;
    if (Object.keys(errors).length > 0) return;

    startAuthOperation("completePasswordReset");
    try {
      const client = getGraphQLRequestClient();
      const data = await client.request<{ completePasswordReset: boolean }>(
        COMPLETE_PASSWORD_RESET_MUTATION,
        { input: { token, newPassword: pwdToSend } },
      );
      if (typeof data.completePasswordReset !== "boolean") {
        completeFormErrors = { form: "Пустой ответ сервера" };
        return;
      }
      if (!data.completePasswordReset) {
        showCompleteFailure = true;
        await goto(ROUTES.passwordRecovery, { replaceState: true });
        return;
      }
      clearSession();
      showCompleteSuccess = true;
      newPassword = "";
      passwordConfirm = "";
      completeFormErrors = {};
      await goto(ROUTES.passwordRecovery, { replaceState: true });
    } catch (err) {
      completeFormErrors = mapPasswordResetCompleteServerError(err);
    } finally {
      finishAuthOperation();
    }
  }
</script>

<svelte:head>
  <title>Orbitto | Восстановление пароля</title>
</svelte:head>

<main class="password-recovery">
  <a href={ROUTES.signin} class="signin__logo">
    <img src="icons/logo.svg" alt="orbitto" />
  </a>

  {#if showCompleteSuccess}
    <div class="password-recovery__container">
      <h1 class="h1 mb-24">Пароль был восстановлен</h1>
      <span class="fz-14 lh-16 text-color-secondary mb-32"
        >Перейдите на страницу авторизации, чтобы войти в систему с новым
        паролем</span
      >
      <Button
        variant="secondary"
        fullWidth
        type="button"
        onclick={() => goto(ROUTES.signin)}
      >
        Назад в авторизацию
      </Button>
    </div>
  {:else if showCompleteFailure}
    <div class="password-recovery__container">
      <h1 class="h1 mb-24">Пароль не был восстановлен</h1>
      <span class="fz-14 lh-16 text-color-secondary mb-32"
        >По каким-то причинам мы не смогли изменить ваш пароль. Попробуйте ещё
        раз через некоторое время.</span
      >
      <Button
        variant="secondary"
        fullWidth
        type="button"
        onclick={() => goto(ROUTES.signin)}
      >
        Назад в авторизацию
      </Button>
      <div class="tc mt-32">
        <a
          href={ROUTES.passwordRecovery}
          onclick={(e) => {
            e.preventDefault();
            showCompleteFailure = false;
            void goto(ROUTES.passwordRecovery, { replaceState: true });
          }}>Попробовать заново</a
        >
      </div>
    </div>
  {:else if resetToken}
    <div class="password-recovery__container">
      <form
        class="password-recovery__form"
        onsubmit={onCompleteSubmit}
        novalidate
      >
        <div class="d-flex aic gap-08 mb-24">
          <BackButton href={ROUTES.passwordRecovery} />
          <h1 class="h1">Задайте пароль</h1>
        </div>
        <span class="fz-14 lh-16 text-color-secondary mb-24"
          >Напишите новый пароль, который будете использовать для входа (не
          менее 8 символов, буква и цифра)</span
        >
        <Input
          label="Введите пароль"
          labelFloatedText="Пароль"
          class="mb-24"
          type="password"
          name="newPassword"
          autocomplete="new-password"
          disabled={$auth.busy}
          error={completeFormErrors.newPassword}
          bind:value={newPassword}
        />
        <Input
          label="Повторите пароль"
          labelFloatedText="Повторите пароль"
          class="mb-32"
          type="password"
          name="passwordConfirm"
          autocomplete="new-password"
          disabled={$auth.busy}
          error={completeFormErrors.passwordConfirm ?? completeFormErrors.form}
          bind:value={passwordConfirm}
        />
        <Button variant="primary" fullWidth type="submit" disabled={$auth.busy}>
          Изменить пароль
        </Button>
      </form>
    </div>
  {:else if emailStep === "sent"}
    <div class="password-recovery__container">
      <h1 class="h1 mb-24">Проверьте свою почту</h1>
      <span class="fz-14 lh-16 text-color-secondary mb-32"
        >Мы отправили на почту письмо с ссылкой для восстановления пароля</span
      >
      <Button
        variant="secondary"
        fullWidth
        type="button"
        onclick={() => goto(ROUTES.signin)}
      >
        Назад в авторизацию
      </Button>
    </div>
  {:else}
    <div class="password-recovery__container">
      <form
        class="password-recovery__form"
        onsubmit={onRequestSubmit}
        novalidate
      >
        <div class="d-flex aic gap-08 mb-24">
          <BackButton href={ROUTES.signin} />
          <h1 class="h1">Восстановление пароля</h1>
        </div>
        <Input
          label="Введите e-mail"
          labelFloatedText="E-mail"
          class="mb-24"
          type="email"
          name="email"
          autocomplete="email"
          disabled={$auth.busy}
          error={formErrors.email}
          bind:value={email}
        />
        <Button
          variant="secondary"
          fullWidth
          type="submit"
          disabled={$auth.busy}
        >
          Восстановить пароль
        </Button>
      </form>
    </div>
  {/if}
</main>
