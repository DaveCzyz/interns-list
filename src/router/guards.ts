import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export function updateDocumentMeta(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const title = to.meta.title;
  if (title) {
    document.title = `${title}`;
  }
  next();
}
