<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Lista użytkowników</h1>
      <Button @click="router.push(ROUTE.user)">Dodaj +</Button>
    </div>

    <div class="mb-6">
      <SearchBar v-model="searchQuery" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
      <div class="flex">
        <div class="ml-3">
          <p class="text-red-700">Wystąpił błąd. Spróbuj ponownie.</p>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Użytkownik
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                E-mail
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Akcje
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img :src="user.avatar" alt="" class="h-10 w-10 rounded-full" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.first_name }} {{ user.last_name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="router.push(`/user/${user.id}`)"
                  class="text-primary hover:text-primary-dark mr-3"
                >
                  Edytuj
                </button>
                <button @click="handleDelete(user.id)" class="text-red-500 hover:text-red-700">
                  Usuń
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white px-4 py-3 border-t border-gray-200">
        <Pagination
          v-if="data?.total_pages && !searchQuery"
          :current-page="currentPage"
          :total-pages="data.total_pages"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEndpoint, endpoints } from '@/services/api';
import { useToast, ToastStatus } from '@/hooks/useToast.ts';
import type { UserListResponse } from '@/services/api';
import type { User } from '@/types/user.ts';
import Button from '@/components/shared/ButtonComponent.vue';
import SearchBar from '@/components/SearchBar.vue';
import Pagination from '@/components/PaginationComponent.vue';
import { ROUTE } from '@/router';

const route = useRoute();
const router = useRouter();
const currentPage = ref(Number(route.query.page) || 1);
const searchQuery = ref(route.query.search?.toString() || '');

const { addToast } = useToast();

watch([currentPage, searchQuery], ([newPage, newSearch]) => {
  router.push({
    query: {
      ...(newPage > 1 && { page: newPage.toString() }),
      ...(newSearch && { search: newSearch }),
    },
  });
});

const {
  call: fetchUsers,
  isLoading,
  error,
  data,
} = useEndpoint<UserListResponse>(endpoints.users.list);

const { call: deleteUser } = useEndpoint<void>(endpoints.users.delete);

const loadUsers = async () => {
  try {
    await fetchUsers({}, { page: currentPage.value });
  } catch (err) {
    addToast('Nie udało się załadować listy użytkowników', ToastStatus.ERROR);
    console.error(err);
  }
};

const handlePageChange = async (page: number) => {
  currentPage.value = page;
  await loadUsers();
};

const filteredUsers = computed(() => {
  const users = Array.isArray(data.value?.data) ? data.value.data : [];

  const query = searchQuery.value?.toLowerCase();

  if (!query) {
    return users;
  }

  return users.filter((user: User) => {
    const { first_name, last_name, email } = user;

    return (
      first_name.toLowerCase().includes(query) ||
      last_name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query)
    );
  });
});

const handleDelete = async (userId: string) => {
  if (!confirm('Czy na pewno chcesz usunąć użytkownika?')) {
    return;
  }

  try {
    await deleteUser({ id: userId }).then(() => addToast('Użytkownik został usunięty'));
    await loadUsers();
  } catch (err) {
    addToast('Coś poszło nie tak!', ToastStatus.ERROR);
    console.error(err);
  }
};

watch(
  () => route.query,
  (newQuery) => {
    const { page, search } = newQuery;

    if (page) {
      currentPage.value = Number(page);
    }

    if (search !== undefined) {
      searchQuery.value = String(search);
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await loadUsers();
});

// Page 2 -> add user -> powrtó na page 2 a nie na początek
</script>
