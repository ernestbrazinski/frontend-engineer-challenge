<script lang="ts">
  // Components
  import { Input, Button } from "$lib/components";
</script>

<svelte:head>
  <title>Orbitto | Войти в систему</title>
</svelte:head>

<main class="signin">
  <div class="signin__container">
    <div class="signin__logo">
      <img src="icons/logo.svg" alt="orbitto" />
    </div>

    <form class="signin__form">
      <h1 class="h1 mb-24">Войти в систему</h1>
      <Input label="Введите e-mail" labelFocusText="E-mail" class="mb-24" />
      <Input
        label="Введите пароль"
        labelFocusText="Пароль"
        class="mb-32"
        type="password"
      />
      <Button fullWidth>Войти</Button>
      <div class="tc mt-32">
        <a href="/password-recovery">Забыли пароль?</a>
      </div>
    </form>

    <div class="signin__footer fz-14 fw-500">
      Еще не зарегистрированы? <a href="/signup">Регистрация</a>
    </div>
  </div>
  <img class="signin__bg" src="images/signin_bg.png" alt="" />
</main>
