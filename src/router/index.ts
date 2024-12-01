import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

export const ROUTE = {
  home: '/',
  user: 'user',
  not_found: 'not_found',
} as const;

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE.home,
    component: () => import('@/views/UserListView.vue'),
  },
  {
    path: '/user/:id?',
    name: ROUTE.user,
    component: () => import('@/views/UserFormView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE.not_found,
    redirect: () => ({
      name: ROUTE.home,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
