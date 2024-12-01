<template>
  <div class="flex justify-center items-center space-x-1 mt-4">
    <button
      @click="$emit('change', currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      ←
    </button>

    <button
      :class="[
        'px-3 py-1 rounded-md',
        currentPage === 1 ? 'bg-primary text-white' : 'hover:bg-gray-100',
      ]"
      @click="$emit('change', 1)"
    >
      1
    </button>

    <span v-if="startPage > 2" class="px-2">...</span>

    <button
      v-for="page in pageNumbers"
      :key="page"
      :class="[
        'px-3 py-1 rounded-md',
        currentPage === page ? 'bg-primary text-white' : 'hover:bg-gray-100',
      ]"
      @click="$emit('change', page)"
    >
      {{ page }}
    </button>

    <span v-if="endPage < totalPages - 1" class="px-2">...</span>

    <button
      v-if="totalPages > 1"
      :class="[
        'px-3 py-1 rounded-md',
        currentPage === totalPages ? 'bg-primary text-white' : 'hover:bg-gray-100',
      ]"
      @click="$emit('change', totalPages)"
    >
      {{ totalPages }}
    </button>

    <button
      :disabled="currentPage === totalPages"
      class="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="$emit('change', currentPage + 1)"
    >
      →
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5,
});

const startPage = computed(() => {
  if (props.currentPage <= Math.floor(props.maxVisiblePages / 2)) {
    return 2;
  }

  if (props.currentPage > props.totalPages - Math.floor(props.maxVisiblePages / 2)) {
    return Math.max(2, props.totalPages - props.maxVisiblePages + 1);
  }

  return props.currentPage - Math.floor(props.maxVisiblePages / 2);
});

const endPage = computed(() =>
  Math.min(startPage.value + props.maxVisiblePages - 1, props.totalPages - 1),
);

const pageNumbers = computed(() => {
  const pages = [];

  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i);
  }

  return pages;
});

defineEmits(['change']);
</script>
