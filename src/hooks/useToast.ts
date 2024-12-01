import { ref } from 'vue';

export enum TOAST_STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
}

type ToastType = `${TOAST_STATUS}`;

interface Toast {
  id: number,
  message: string,
  type: ToastType,
  timeout?: number,
}

const toasts = ref<Toast[]>([]);

export const useToast = () => {
  const addToast = (message: string, type: ToastType = TOAST_STATUS.SUCCESS, timeout: number = 3000) => {
    const id = Date.now();

    toasts.value.push({
      id,
      message,
      type,
      timeout
    });

    if (timeout) {
      setTimeout(() => {
        removeToast(id)
      }, timeout)
    }
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    toasts,
    addToast,
    removeToast
  }
};
