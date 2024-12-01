import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import UserListView from '@/views/UserListView.vue'

export const ROUTE = {
  home: 'home',
  user: 'user',
  not_found: 'not_found',
} as const

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE.home,
    component: UserListView,
  },
  {
    path: '/user/:id?',
    name: ROUTE.user,
    component: () => import('@/views/UserFormView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
