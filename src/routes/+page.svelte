<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { ROUTES } from "$lib/constants";
  import { auth } from "$lib/stores/auth";

  $effect(() => {
    if (!browser) return;
    const { status } = $auth;
    if (status === "idle" || status === "hydrating") return;
    if (status === "anonymous") {
      void goto(ROUTES.signin);
    }
  });
</script>

<svelte:head>
  <title>Orbitto</title>
</svelte:head>

<main>
  <img src="images/main-page.png" alt="" />
</main>

<style lang="scss">
  main {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  main img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
