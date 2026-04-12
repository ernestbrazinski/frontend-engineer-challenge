<script lang="ts">
  import { onMount } from "svelte";
  import { beforeNavigate } from "$app/navigation";

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

  type ViewState =
    | { type: "request" }
    | { type: "sent" }
    | { type: "reset"; token: string }
    | { type: "success" }
    | { type: "error" };

  function viewFromUrl(): ViewState {
    const token = (page.url.searchParams.get("token") ?? "").trim();
    if (token) return { type: "reset", token };
    return { type: "request" };
  }

  let view = $state<ViewState>(viewFromUrl());

  let email = $state("");
  let formErrors = $state<PasswordRecoveryFormErrors>({});

  let newPassword = $state("");
  let passwordConfirm = $state("");
  let completeFormErrors = $state<PasswordResetCompleteFormErrors>({});

  function syncViewWithUrl() {
    const urlToken = (page.url.searchParams.get("token") ?? "").trim();

    if (urlToken) {
      view = { type: "reset", token: urlToken };
    } else if (view.type === "reset") {
      view = { type: "request" };
    }

    completeFormErrors = {};
  }

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
      view = { type: "sent" };
    } catch (err) {
      formErrors = mapPasswordRecoveryServerError(err);
    } finally {
      finishAuthOperation();
    }
  }

  async function onCompleteSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (view.type !== "reset") return;
    const token = view.token;

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
        view = { type: "error" };
        return;
      }
      clearSession();
      newPassword = "";
      passwordConfirm = "";
      completeFormErrors = {};
      view = { type: "success" };
    } catch (err) {
      completeFormErrors = mapPasswordResetCompleteServerError(err);
    } finally {
      finishAuthOperation();
    }
  }

  function tryPasswordRecoveryAgain() {
    view = { type: "request" };
    void goto(ROUTES.passwordRecovery, { replaceState: true });
  }

  beforeNavigate(() => {
    view = { type: "request" };
  });

  onMount(() => {
    syncViewWithUrl();
  });
</script>

<svelte:head>
  <title>Orbitto | Восстановление пароля</title>
</svelte:head>

<main class="password-recovery">
  <a href={ROUTES.signin} class="signin__logo">
    <img src="icons/logo.svg" alt="orbitto" />
  </a>

  {#if view.type === "success"}
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
  {:else if view.type === "error"}
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
            tryPasswordRecoveryAgain();
          }}>Попробовать заново</a
        >
      </div>
    </div>
  {:else if view.type === "reset"}
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
          >Напишите новый пароль, который будете использовать для входа</span
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
  {:else if view.type === "sent"}
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
