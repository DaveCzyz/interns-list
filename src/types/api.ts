import { type Ref } from 'vue';

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface ApiResponse<T> {
  call: (params?: Record<string, string | number>, payload?: Record<string, any>) => Promise<T>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  data: Ref<T | null>;
  endpoint: ApiEndpoint;
}

export interface PaginatedResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}
