import { createRouter, createWebHistory } from 'vue-router'
import LotteryView from '../views/Lottery/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'lottery',
      component: LotteryView
    },
    {
      path: '/admin',
      name: 'admin',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Admin/index.vue')
    }
  ]
})

export default router
