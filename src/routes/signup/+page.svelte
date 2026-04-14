<script lang="ts">
  import { goto } from "$app/navigation";
  import { ROUTES } from "$lib/constants";
  import { Input, Button } from "$lib/components";
  import { isValidEmailFormat, minLengthError } from "$helpers";
  import {
    mapSignUpServerError,
    type SignUpFormErrors,
  } from "$lib/form-errors";
  import { authService } from "$lib/services/authService";
  import {
    auth,
    clearSessionError,
    commitAuthPayload,
    finishAuthOperation,
    startAuthOperation,
  } from "$lib/stores/auth";

  type SignUpFormState = {
    email: string;
    password: string;
    passwordConfirm: string;
  };

  let signUpForm = $state<SignUpFormState>({
    email: "",
    password: "",
    passwordConfirm: "",
  });

  let signUpFormErrors = $state<SignUpFormErrors>({});

  async function onsubmit(e: SubmitEvent) {
    e.preventDefault();
    clearSessionError();

    const errors: SignUpFormErrors = {};

    const email = signUpForm.email.trim();

    if (!email) {
      errors.email = "Введите e-mail";
    } else if (!isValidEmailFormat(email)) {
      errors.email = "Недопустимый адрес почты";
    }

    const passwordMin = 8;
    const passwordError = minLengthError(signUpForm.password, passwordMin, {
      empty: "Введите пароль",
      tooShort: `Минимум ${passwordMin} символов`,
    });

    if (passwordError) {
      errors.password = passwordError;
    }

    if (
      signUpForm.password &&
      signUpForm.password !== signUpForm.passwordConfirm
    ) {
      errors.passwordConfirm = "Пароли не совпадают";
    }

    signUpFormErrors = errors;

    if (Object.keys(errors).length > 0) return;

    startAuthOperation("register");
    try {
      const res = await authService.register({
        email,
        password: signUpForm.password,
      });
      if (!res.ok) {
        signUpFormErrors = mapSignUpServerError(res.cause ?? res.error);
        return;
      }
      commitAuthPayload(res.data);
      await goto(ROUTES.home);
    } catch (err) {
      signUpFormErrors = mapSignUpServerError(err);
    } finally {
      finishAuthOperation();
    }
  }
</script>

<svelte:head>
  <title>Orbitto | Регистрация в системе</title>
</svelte:head>

<main class="signin">
  <div class="signin__container">
    <a href={ROUTES.signin} class="signin__logo">
      <img src="icons/logo.svg" alt="orbitto" />
    </a>

    <form class="signin__form" {onsubmit} novalidate>
      <h1 class="h1 mb-24">Регистрация в системе</h1>
      <Input
        label="Введите e-mail"
        labelFloatedText="E-mail"
        class="mb-24"
        type="email"
        name="email"
        autocomplete="email"
        disabled={$auth.busy}
        error={signUpFormErrors.email}
        bind:value={signUpForm.email}
      />
      <Input
        label="Введите пароль"
        labelFloatedText="Пароль"
        class="mb-24"
        type="password"
        name="password"
        autocomplete="new-password"
        disabled={$auth.busy}
        error={signUpFormErrors.password}
        bind:value={signUpForm.password}
      />
      <Input
        label="Повторите пароль"
        labelFloatedText="Повторите пароль"
        class="mb-32"
        type="password"
        name="passwordConfirm"
        autocomplete="new-password"
        disabled={$auth.busy}
        error={signUpFormErrors.passwordConfirm}
        bind:value={signUpForm.passwordConfirm}
      />
      <Button fullWidth type="submit" disabled={$auth.busy}>
        Зарегистрироваться
      </Button>
      <div class="signin__terms-text fz-12 lh-14 tc mt-32">
        Зарегистрировавшись пользователь принимает условия <a
          href={ROUTES.terms}>договора оферты</a
        >
        и <a href={ROUTES.privacy}>политики конфиденциальности</a>
      </div>
    </form>

    <div class="signin__footer fz-14 fw-500">
      У вас есть аккаунт? <a href={ROUTES.signin}>Войти</a>
    </div>
  </div>
  <img class="signin__bg" src="images/signin_bg.png" alt="" />
</main>
