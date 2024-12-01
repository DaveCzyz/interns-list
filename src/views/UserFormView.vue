<template>
  <div class="container mx-auto px-4 py-6 max-w-2xl">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">
          {{ isEditMode ? 'Edytuj' : 'Dodaj' }} użytkownika
        </h1>
      </div>

      <form
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <div class="grid grid-cols-2 gap-6">
          <Input
            v-model="form.first_name"
            label="Imię"
            :error="errors.first_name"
            required
          />
          <Input
            v-model="form.last_name"
            label="Nazwisko"
            :error="errors.last_name"
            required
          />
        </div>

        <Input
          v-model="form.avatar"
          label="Avatar URL"
          :error="errors.avatar"
          placeholder="https://example.com/avatar.jpg"
        />

        <div v-if="form.avatar" class="flex justify-center">
          <div class="relative">
            <img
              :src="form.avatar"
              alt="Avatar preview"
              class="w-32 h-32 rounded-full object-cover"
              @error="handleImageError"
            />
            <button
              type="button"
              @click="form.avatar = ''"
              class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <Button
            type="button"
            variant="danger"
            @click="$router.push(ROUTE.home)"
          >
            Powrót
          </Button>
          <Button
            type="submit"
            :loading="isLoading"
          >
            {{ isEditMode ? 'Aktualizuj' : 'Dodaj' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useEndpoint, endpoints, type UserResponse } from '@/services/api';
import { ToastStatus, useToast } from '@/hooks/useToast.ts';
import type { User } from '@/types/user';
import Button from '@/components/shared/Button.vue';
import Input from '@/components/shared/Input.vue';
import { ROUTE } from '@/router';

const route = useRoute();
const { addToast } = useToast();

const isEditMode = computed(() => !!route.params.id)

const form = ref<Omit<User, 'id' | 'email'>>({
  first_name: '',
  last_name: '',
  avatar: ''
});

const errors = ref<Record<string, string>>({});

const {
  call: createUser,
  isLoading: isCreating,
} = useEndpoint<User>(endpoints.users.create);

const {
  call: updateUser,
  isLoading: isUpdating,
} = useEndpoint<User>(endpoints.users.update);

const {
  call: fetchUser,
  isLoading: isFetching,
} = useEndpoint<UserResponse>(endpoints.users.single);

const isLoading = computed(() => isCreating.value || isUpdating.value || isFetching.value);

const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.first_name.trim()) {
    errors.value.first_name = 'First name is required';
  }

  if (!form.value.last_name.trim()) {
    errors.value.last_name = 'Last name is required';
  }

  if (form.value.avatar && !isValidUrl(form.value.avatar)) {
    errors.value.avatar = 'Invalid URL format';
  }

  return Object.keys(errors.value).length === 0;
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    if (isEditMode.value) {
      await updateUser({ id: route.params.id }, form.value)
        .then(() => addToast('Użytkownik został zaktualizowany'));
    } else {
      await createUser({}, form.value)
        .then(() => addToast('Dodano nowego użytkownika'));
    }
  } catch (err) {
    addToast('Wystąpił błąd. Spróbuj ponownie', ToastStatus.ERROR);
    console.error(err);
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = '/placeholder-avatar.png' // Zastąp domyślnym avatarem @TODO
  errors.value.avatar = 'Failed to load image'
}

// Helpers @TODO
const isValidUrl = (string: string): boolean => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await fetchUser({ id: route.params.id as string });
      const user = response.data;

      form.value = {
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
      };

    } catch (err) {
      addToast('Nie udało się pobrać użytkownika', ToastStatus.ERROR);
      console.error(err);
    }
  }
});
</script>
