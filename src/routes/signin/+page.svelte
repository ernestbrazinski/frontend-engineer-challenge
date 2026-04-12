<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import { ROUTES } from "$lib/constants";
  import { Input, Button } from "$lib/components";
  import { isValidEmailFormat, minLengthError } from "$helpers";
  import {
    mapSignInServerError,
    type SignInFormErrors,
  } from "$lib/form-errors";
  import { getGraphQLRequestClient } from "$lib/graphql/graphql-request-client";
  import { LOGIN_MUTATION } from "$lib/graphql/operations/auth";
  import type { AuthPayloadGql } from "$lib/graphql/types";
  import {
    abortHydrateAuth,
    auth,
    clearSessionError,
    commitAuthPayload,
    finishAuthOperation,
    logout,
    startAuthOperation,
  } from "$lib/stores/auth";

  afterNavigate(({ to }) => {
    if (to?.url.pathname !== ROUTES.signin) return;
    abortHydrateAuth();
    clearSessionError();
    void logout();
  });

  type SignInFormState = {
    email: string;
    password: string;
  };

  let signInForm = $state<SignInFormState>({
    email: "test4@test.test",
    password: "Test!123",
  });

  let signInFormErrors = $state<SignInFormErrors>({});

  async function onsubmit(e: SubmitEvent) {
    e.preventDefault();
    clearSessionError();

    const errors: SignInFormErrors = {};
    const email = signInForm.email.trim();

    if (!email) {
      errors.email = "Введите e-mail";
    } else if (!isValidEmailFormat(email)) {
      errors.email = "Недопустимый адрес почты";
    }

    const passwordError = minLengthError(signInForm.password, 1, {
      empty: "Введите пароль",
    });
    if (passwordError) {
      errors.password = passwordError;
    }

    signInFormErrors = errors;
    if (Object.keys(errors).length > 0) return;

    startAuthOperation("login");
    try {
      const client = getGraphQLRequestClient();
      const data = await client.request<{ login: AuthPayloadGql }>(
        LOGIN_MUTATION,
        { input: { email, password: signInForm.password } },
      );
      if (!data.login) {
        signInFormErrors = { password: "Введены неверные данные" };
        return;
      }
      commitAuthPayload(data.login);
      await goto(ROUTES.home);
    } catch (err) {
      signInFormErrors = mapSignInServerError(err);
    } finally {
      finishAuthOperation();
    }
  }
</script>

<svelte:head>
  <title>Orbitto | Войти в систему</title>
</svelte:head>

<main class="signin">
  <div class="signin__container">
    <a href={ROUTES.signin} class="signin__logo">
      <img src="icons/logo.svg" alt="orbitto" />
    </a>

    <form class="signin__form" {onsubmit} novalidate>
      <h1 class="h1 mb-24">Войти в систему</h1>
      <Input
        label="Введите e-mail"
        labelFloatedText="E-mail"
        class="mb-24"
        type="email"
        name="email"
        autocomplete="email"
        disabled={$auth.busy}
        error={signInFormErrors.email}
        bind:value={signInForm.email}
      />
      <Input
        label="Введите пароль"
        labelFloatedText="Пароль"
        class="mb-32"
        type="password"
        name="password"
        autocomplete="current-password"
        disabled={$auth.busy}
        error={signInFormErrors.password}
        bind:value={signInForm.password}
      />
      <Button fullWidth type="submit" disabled={$auth.busy}>Войти</Button>
      <div class="tc mt-32">
        <a href={ROUTES.passwordRecovery}>Забыли пароль?</a>
      </div>
    </form>

    <div class="signin__footer fz-14 fw-500">
      Еще не зарегистрированы? <a href={ROUTES.signup}>Регистрация</a>
    </div>
  </div>
  <img class="signin__bg" src="images/signin_bg.png" alt="" />
</main>
