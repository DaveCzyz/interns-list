import { ref } from 'vue';

export enum ToastStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

type ToastType = `${ToastStatus}`;

interface Toast {
  id: number,
  message: string,
  type: ToastType,
  timeout?: number,
}

const toasts = ref<Toast[]>([]);

export const useToast = () => {
  const addToast = (message: string, type: ToastType = ToastStatus.SUCCESS, timeout: number = 3000) => {
    const id = Date.now();

    toasts.value.push({
      id,
      message,
      type,
      timeout
    });

    if (timeout) {
      setTimeout(() => {
        removeToast(id);
      }, timeout);
    }
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    toasts,
    addToast,
    removeToast,
  }
};
