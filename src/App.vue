<template>
  <Toast />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Toast from '@/components/ToastComponent.vue';
</script>
