<script lang="ts">
  // Icons
  import { IconChevronBack } from "$lib/components/Icons";

  type Props = {
    href: string;
  };

  let { href }: Props = $props();
</script>

<a {href} class="back-button">
  <IconChevronBack />
</a>

<style lang="scss">
  .back-button {
    display: inline-flex;
    width: calc(var(--base-size) * 2.4);
    height: calc(var(--base-size) * 2.4);
    color: var(--color-text-primary);
    transition: color 0.15s ease;

    &:hover {
      color: var(--color-primary-hover);
    }

    &:active {
      color: var(--color-primary-active);
    }

    &:disabled {
      color: var(--color-primary-disabled);
    }
  }
</style>
