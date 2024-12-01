import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import UserListView from '@/views/UserListView.vue';
import { updateDocumentMeta } from '@/router/guards';

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
    meta: {
      title: 'List użytkowników',
    },
  },
  {
    path: '/user/:id?',
    name: ROUTE.user,
    component: () => import('@/views/UserFormView.vue'),
    meta: {
      title: 'Użytkownik',
    },
  },
  { path: '/:pathMatch(.*)*',
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

router.beforeEach(updateDocumentMeta);

export default router;
