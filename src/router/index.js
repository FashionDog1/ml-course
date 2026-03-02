import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/chapters/:id',
    name: 'Chapter',
    component: () => import('../views/Chapter.vue')
  },
  {
    path: '/assignments',
    name: 'Assignment',
    component: () => import('../views/Assignment.vue')
  },
  {
    path: '/visualization',
    name: 'Visualization',
    component: () => import('../views/Visualization.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;