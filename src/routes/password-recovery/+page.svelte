<script lang="ts">
  // Components
  import { Input, Button, BackButton } from "$lib/components";
</script>

<svelte:head>
  <title>Orbitto | Восстановление пароля</title>
</svelte:head>

<main class="password-recovery">
  <div class="signin__logo">
    <img src="icons/logo.svg" alt="orbitto" />
  </div>

  <div class="password-recovery__container">
    <div class="d-flex aic gap-08 mb-24">
      <BackButton href="/signin" />
      <h1 class="h1">Восстановление пароля</h1>
    </div>
    <Input label="Введите e-mail" labelFocusText="E-mail" class="mb-24" />
    <Button variant="secondary" fullWidth>Восстановить пароль</Button>
  </div>

  <!-- <div class="password-recovery__container">
    <h1 class="h1 mb-24">Проверьте свою почту</h1>
    <span class="fz-14 lh-16 text-color-secondary mb-32"
      >Мы отправили на почту письмо с ссылкой для восстановления пароля</span
    >
    <Button variant="secondary" fullWidth>Назад в авторизацию</Button>
  </div> -->

  <!-- <div class="password-recovery__container">
    <h1 class="h1 mb-24">Задайте пароль</h1>
    <span class="fz-14 lh-16 text-color-secondary mb-24"
      >Напишите новый пароль, который будете использовать для входа</span
    >
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
    <Button variant="primary" fullWidth>Изменить пароль</Button>
  </div> -->

  <!-- <div class="password-recovery__container">
    <h1 class="h1 mb-24">Пароль был восстановлен</h1>
    <span class="fz-14 lh-16 text-color-secondary mb-32"
      >Перейдите на страницу авторизации, чтобы войти в систему с новым паролем</span
    >
    <Button variant="secondary" fullWidth>Назад в авторизацию</Button>
  </div> -->

  <!-- <div class="password-recovery__container">
    <h1 class="h1 mb-24">Пароль не был восстановлен</h1>
    <span class="fz-14 lh-16 text-color-secondary mb-32"
      >По каким-то причинам мы не смогли изменить ваш пароль. Попробуйте ещё раз
      через некоторое время.</span
    >
    <Button variant="secondary" fullWidth>Назад в авторизацию</Button>
    <div class="tc mt-32">
      <a href="/password-recovery">Попробовать заново</a>
    </div>
  </div> -->
</main>
