<script lang="ts">
  import { onMount } from "svelte";
  import "../app.scss";
  import { hydrateAuth } from "$lib/stores/auth";

  let { children } = $props();

  onMount(() => {
    void hydrateAuth();
  });
</script>

{@render children()}
