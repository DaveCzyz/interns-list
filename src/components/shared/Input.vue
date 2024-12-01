<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full px-3 py-2 rounded-md shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
          error
            ? 'border border-red-500 focus:ring-red-500'
            : 'border border-gray-300 focus:border-primary',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
       />
    </div>

    <p
      v-if="error"
      class="mt-1 text-sm text-red-500"
    >
      {{ error }}
    </p>

    <p
      v-else-if="hint"
      class="mt-1 text-sm text-gray-500"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  id?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
});

defineEmits(['update:modelValue']);
</script>
