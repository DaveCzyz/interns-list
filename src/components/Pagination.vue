<template>
  <div class="flex justify-center items-center space-x-1 mt-4">
    <button
        @click="$emit('change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      ←
    </button>

    <!-- First page -->
    <button
        @click="$emit('change', 1)"
        :class="[
        'px-3 py-1 rounded-md',
        currentPage === 1 ? 'bg-primary text-white' : 'hover:bg-gray-100'
      ]"
    >
      1
    </button>

    <!-- Left ellipsis -->
    <span v-if="startPage > 2" class="px-2">...</span>

    <!-- Page numbers -->
    <button
        v-for="page in pageNumbers"
        :key="page"
        @click="$emit('change', page)"
        :class="[
        'px-3 py-1 rounded-md',
        currentPage === page ? 'bg-primary text-white' : 'hover:bg-gray-100'
      ]"
    >
      {{ page }}
    </button>

    <!-- Right ellipsis -->
    <span v-if="endPage < totalPages - 1" class="px-2">...</span>

    <!-- Last page -->
    <button
        v-if="totalPages > 1"
        @click="$emit('change', totalPages)"
        :class="[
        'px-3 py-1 rounded-md',
        currentPage === totalPages ? 'bg-primary text-white' : 'hover:bg-gray-100'
      ]"
    >
      {{ totalPages }}
    </button>

    <button
        @click="$emit('change', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      →
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5
});

const startPage = computed(() => {
  if (props.currentPage <= Math.floor(props.maxVisiblePages / 2)) {
    return 2
  }
  if (props.currentPage > props.totalPages - Math.floor(props.maxVisiblePages / 2)) {
    return Math.max(2, props.totalPages - props.maxVisiblePages + 1)
  }
  return props.currentPage - Math.floor(props.maxVisiblePages / 2)
});

const endPage = computed(() => {
  return Math.min(startPage.value + props.maxVisiblePages - 1, props.totalPages - 1)
});

const pageNumbers = computed(() => {
  const pages = []
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i)
  }
  return pages
});

defineEmits(['change']);
</script>
