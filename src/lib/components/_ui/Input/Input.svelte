<script module>
  let idCounter = 0;
</script>

<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  // Icons
  import { IconEye, IconEyeCrossed } from "$lib/components/Icons";

  type Props = Omit<HTMLInputAttributes, "children"> & {
    error?: boolean | string;
    label?: string;
    labelFocusText?: string;
  };

  let focused = $state(false);

  let {
    class: className,
    error = false,
    id,
    label,
    labelFocusText,
    type = "text",
    disabled = false,
    value = $bindable(),
    placeholder: _placeholder,
    "aria-describedby": ariaDescribedBy,
    ...rest
  }: Props = $props();

  let showPassword = $state(false);

  const fallbackId = `ui-input-${++idCounter}`;
  const inputId = $derived(id ?? fallbackId);
  const messageId = $derived(`${inputId}-message`);

  const invalid = $derived(!!error);
  const message = $derived(typeof error === "string" ? error : "");

  const describedBy = $derived(
    [ariaDescribedBy, message ? messageId : ""].filter(Boolean).join(" ") ||
      undefined,
  );

  const isPassword = $derived(type === "password");
  const inputType = $derived(isPassword && showPassword ? "text" : type);

  const hasValue = $derived(
    value !== null && value !== undefined && String(value) !== "",
  );
</script>

<div class="ui-input {className}" data-invalid={invalid}>
  <div
    class="ui-input__field"
    class:ui-input__field--password={isPassword}
    data-filled={hasValue}
  >
    <input
      {...rest}
      {disabled}
      type={inputType}
      bind:value
      id={inputId}
      class={["ui-input__control", className]}
      aria-invalid={invalid ? "true" : undefined}
      aria-errormessage={message ? messageId : undefined}
      aria-describedby={describedBy}
      onfocus={() => (focused = true)}
      onblur={() => (focused = false)}
    />
    {#if label}
      <label class="ui-input__label" for={inputId}
        >{focused ? labelFocusText : label}</label
      >
    {/if}
    {#if isPassword && value}
      <button
        type="button"
        class="ui-input__toggle"
        {disabled}
        aria-pressed={showPassword}
        aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
        onclick={() => (showPassword = !showPassword)}
      >
        {#if showPassword}
          <IconEyeCrossed />
        {:else}
          <IconEye />
        {/if}
      </button>
    {/if}
  </div>
  {#if message}
    <p id={messageId} class="ui-input__message" role="alert">{message}</p>
  {/if}
</div>

<style lang="scss">
  .ui-input {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .ui-input__field {
    position: relative;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-text-primary-opacity-08);
    transition: border-color 0.15s ease;
  }

  .ui-input[data-invalid="true"] .ui-input__field {
    border-bottom-color: var(--color-invalid);
  }

  .ui-input:not([data-invalid="true"]) .ui-input__field:focus-within {
    border-bottom-color: var(--color-primary);
  }

  .ui-input[data-invalid="true"] .ui-input__field:focus-within {
    border-bottom-color: #c9343a;
  }

  .ui-input__control {
    flex: 1;
    min-width: 0;
    margin: 0;
    padding: calc(var(--base-size) * 1.6) 0;
    border: none;
    border-radius: 0;
    font: inherit;
    font-size: calc(var(--base-size) * 1.6);
    font-weight: 400;
    line-height: 1.35;
    color: #0f172a;
    background: transparent;
    outline: none;
    box-shadow: none;
  }

  .ui-input__control::placeholder {
    color: transparent;
    opacity: 0;
  }

  .ui-input__label {
    position: absolute;
    left: 0;
    top: calc(var(--base-size) * 1.6);
    max-width: calc(100% - var(--base-size) * 4);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: calc(var(--base-size) * 1.6);
    font-weight: 400;
    line-height: 1.35;
    color: var(--color-secondary);
    pointer-events: none;
    transform-origin: left top;
    transition:
      transform 0.2s ease,
      font-size 0.2s ease,
      color 0.2s ease,
      top 0.2s ease;
  }

  .ui-input__field--password .ui-input__label {
    max-width: calc(100% - var(--base-size) * 6);
  }

  .ui-input__field:focus-within .ui-input__label,
  .ui-input__field[data-filled="true"] .ui-input__label {
    top: 0;
    font-size: calc(var(--base-size) * 1.2);
    font-weight: 500;
    color: var(--color-secondary);
    transform: scale(0.92);
  }

  .ui-input__toggle {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--color-tertiary);
    line-height: 0;
    transition: opacity 0.15s ease;

    &:hover {
      color: var(--color-primary);
    }
  }
</style>
