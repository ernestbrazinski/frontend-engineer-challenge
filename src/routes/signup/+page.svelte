<script lang="ts">
  // Components
  import { Input, Button } from "$lib/components";
</script>

<svelte:head>
  <title>Orbitto | Регистрация в системе</title>
</svelte:head>

<main class="signin">
  <div class="signin__container">
    <div class="signin__logo">
      <img src="icons/logo.svg" alt="orbitto" />
    </div>

    <form class="signin__form">
      <h1 class="h1 mb-24">Регистрация в системе</h1>
      <Input label="Введите e-mail" labelFocusText="E-mail" class="mb-24" />
      <Input
        label="Введите пароль"
        labelFocusText="Пароль"
        class="mb-24"
        type="password"
      />
      <Input
        label="Повторите пароль"
        labelFocusText="Повторите пароль"
        class="mb-32"
        type="password"
      />
      <Button fullWidth>Войти</Button>
      <div class="signin__terms-text fz-12 lh-14 tc mt-32">
        Зарегистрировавшись пользователь принимает условия <a href="/terms"
          >договора оферты</a
        >
        и <a href="/privacy">политики конфиденциальности</a>
      </div>
    </form>

    <div class="signin__footer fz-14 fw-500">
      У вас есть аккаунт? <a href="/signin">Войти</a>
    </div>
  </div>
  <img class="signin__bg" src="images/signin_bg.png" alt="" />
</main>
