import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { ref, type Ref } from 'vue';

const API_URL = 'https://reqres.in/api';

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support?: {
    url: string;
    text: string;
  }
}

export interface UserResponse {
  data: User;
  support?: {
    url: string;
    text: string;
  }
}

// @TODO uzupełnić o nowy enum poniżej wszystkie funkcje
export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

interface ApiResponse<T> {
  call: (params?: Record<string, string | number>, payload?: Record<string, any>) => Promise<T>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  data: Ref<T | null>;
  endpoint: ApiEndpoint;
}

export const endpoints = {
  users: {
    list: {
      path: '/users',
      method: HTTP_METHOD.GET,
    },
    single: {
      path: '/users/:id',
      method: HTTP_METHOD.GET,
    },
    create: {
      path: '/users',
      method: HTTP_METHOD.POST,
    },
    update: {
      path: '/users/:id',
      method: HTTP_METHOD.PUT,
    },
    delete: {
      path: '/users/:id',
      method: HTTP_METHOD.DELETE,
    }
  }
} as const;

export const useEndpoint = <T>(endpoint: ApiEndpoint): ApiResponse<T> => {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<T | null>(null);

  const apiCall = async (params: Record<string, string | number> = {}, payload: Record<string, any> = {}): Promise<T> => {
    isLoading.value = true;
    error.value = null;

    try {
      let url = `${API_URL}${endpoint.path}`;

      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
      });

      const response: AxiosResponse<T> = await axios({
        url,
        method: endpoint.method,
        data: endpoint.method !== 'GET' ? payload : undefined,
        params: endpoint.method === 'GET' ? payload : undefined,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      data.value = response.data;
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 404) {
          data.value = null;
          return {} as T;
        }
        error.value = axiosError;
      } else {
        error.value = new Error('An unknown error occurred');
      }

      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    call: apiCall,
    isLoading,
    error,
    data,
    endpoint
  };
};
