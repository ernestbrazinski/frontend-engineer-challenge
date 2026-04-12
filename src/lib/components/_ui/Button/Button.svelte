<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  type Props = HTMLButtonAttributes & {
    variant?: "primary" | "secondary";
    fullWidth?: boolean;
    children?: Snippet;
  };

  let {
    children,
    class: className,
    variant = "primary",
    type = "button",
    fullWidth = false,
    ...rest
  }: Props = $props();
</script>

<button
  {...rest}
  {type}
  class={["ui-button", `ui-button--${variant}`, className]}
  class:ui-button--full-width={fullWidth}
>
  {@render children?.()}
</button>

<style lang="scss">
  .ui-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: calc(var(--base-size) * 1.4);
    line-height: 1;
    font-weight: 500;
    padding: calc(var(--base-size) * 1.7) calc(var(--base-size) * 3.4);
    border-radius: calc(var(--base-size) * 0.8);
    border: 1px solid transparent;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease,
      opacity 0.15s ease;
  }

  .ui-button--full-width {
    width: 100%;
  }

  // Primary
  .ui-button--primary {
    background: var(--color-primary);
    color: #fff;
  }

  .ui-button:hover {
    background: var(--color-primary-hover);
  }

  .ui-button:active {
    background: var(--color-primary-active);
  }

  // Secondary
  .ui-button--secondary {
    background: var(--color-primary-opacity-10);
    color: var(--color-primary);
  }

  .ui-button--secondary:hover {
    background: var(--color-primary-opacity-15);
  }

  .ui-button--secondary:active {
    background: var(--color-primary-opacity-20);
  }
</style>
