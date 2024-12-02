import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { ref, type Ref } from 'vue';
import type { User } from '@/types/user.ts';

/*
  To można do .env
 */
const API_URL = 'https://reqres.in/api';

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support?: {
    url: string;
    text: string;
  };
}

export interface UserResponse {
  data: User;
  support?: {
    url: string;
    text: string;
  };
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface ApiEndpoint {
  path: string;
  method: HttpMethod;
}

interface ApiResponse<T> {
  call: (params?: Record<string, string | number>, payload?: Record<string, unknown>) => Promise<T>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  data: Ref<T | null>;
  endpoint: ApiEndpoint;
}

export const endpoints = {
  users: {
    list: {
      path: '/users',
      method: HttpMethod.GET,
    },
    single: {
      path: '/users/:id',
      method: HttpMethod.GET,
    },
    create: {
      path: '/users',
      method: HttpMethod.POST,
    },
    update: {
      path: '/users/:id',
      method: HttpMethod.PUT,
    },
    delete: {
      path: '/users/:id',
      method: HttpMethod.DELETE,
    },
  },
} as const;

export const useEndpoint = <T extends Record<string, any>>(endpoint: ApiEndpoint): ApiResponse<T> => {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<T | null>(null) as Ref<T | null>;

  const call = async (params: Record<string, string | number> = {}, payload: Record<string, any> = {}): Promise<T> => {
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
        headers: { 'Content-Type': 'application/json' },
        ...(endpoint.method === HttpMethod.GET ? { params: payload } : { data: payload }),
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
    call,
    isLoading,
    error,
    data,
    endpoint,
  };
};
