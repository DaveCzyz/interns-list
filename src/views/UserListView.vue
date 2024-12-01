<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Users List</h1>
      <Button @click="router.push('/user')">Add User</Button>
    </div>

    <!-- Search & Actions -->
    <div class="mb-6">
      <SearchBar v-model="searchQuery" />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
      <div class="flex">
        <div class="ml-3">
          <p class="text-red-700">Failed to load users. Please try again.</p>
        </div>
      </div>
    </div>

    <!-- Users List -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
              Edit
            </button>
            <button
                @click="handleDelete(user.id)"
                class="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="bg-white px-4 py-3 border-t border-gray-200">
        <Pagination
          v-if="data?.total_pages"
          :current-page="currentPage"
          :total-pages="data.total_pages"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEndpoint, endpoints } from '@/services/api';
import { useToast, TOAST_STATUS } from '@/hooks/useToast.ts';
import type { UserListResponse } from '@/services/api';
import Button from '@/components/shared/Button.vue';
import SearchBar from '@/components/SearchBar.vue';
import Pagination from '@/components/Pagination.vue';

const router = useRouter();
const currentPage = ref(1);
const searchQuery = ref('');

const { addToast } = useToast();

const {
  call: fetchUsers,
  isLoading,
  error,
  data,
} = useEndpoint<UserListResponse>(endpoints.users.list);

const {
  call: deleteUser,
} = useEndpoint<void>(endpoints.users.delete);

const loadUsers = async () => {
  try {
    await fetchUsers({}, { page: currentPage.value });
  } catch (err) {
    addToast('loadUsers failed,', TOAST_STATUS.ERROR);
  }
};

const handlePageChange = async (page: number) => {
  currentPage.value = page;
  await loadUsers();
};

const filteredUsers = computed(() => {
  if (!data.value?.data) {
    return [];
  }

  const users = Array.isArray(data.value.data)
    ? data.value.data
    : [];

  if (!searchQuery.value) {
    return users;
  }

  const query = searchQuery.value.toLowerCase();
  return users.filter(user =>
    user.first_name.toLowerCase().includes(query) ||
    user.last_name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  );
});

const handleDelete = async (userId: number) => {
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }

  try {
    await deleteUser({ id: userId });
    await loadUsers().then(() => addToast('User deleted successfully'));
  } catch (err) {
    addToast('Coś poszło nie tak!', TOAST_STATUS.ERROR);
  }
}

loadUsers();

// @TODO:
// Formularz dodawania/edycji użytkownika
// Potwierdzenie przed usunięciem - confirmation wrapper
// Testy
// Mobile - akcje się chowają.
</script>
