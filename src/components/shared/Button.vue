// src/components/shared/Button.vue
<template>
  <button
      :type="type"
      :disabled="disabled || loading"
      :class="[
      'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
      {
        'bg-primary hover:bg-primary-dark text-white disabled:bg-primary/50 focus:ring-primary/50': variant === 'primary',
        'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-500/50 focus:ring-red-500/50': variant === 'danger',
        'opacity-75 cursor-not-allowed': loading || disabled,
        'w-full': fullWidth
      }
    ]"
  >
    <!-- Loading spinner -->
    <svg
        v-if="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'danger'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  loading: false,
  disabled: false,
  fullWidth: false,
})
</script>
