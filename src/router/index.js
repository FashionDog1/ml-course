import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/chapters',
    name: 'Chapters',
    component: () => import('../views/Chapters.vue')
  },
  {
    path: '/chapters/:id/:subId?',
    name: 'Chapter',
    component: () => import('../views/Chapter.vue')
  },
  {
    path: '/assignments',
    name: 'Assignment',
    component: () => import('../views/Assignment.vue')
  },
  {
    path: '/github-assignments',
    name: 'GitHubAssignments',
    component: () => import('../views/GitHubAssignments.vue'),
  },
  {
    path: '/github-assignment/:id',
    name: 'GitHubAssignmentDetail',
    component: () => import('../views/GitHubAssignmentDetail.vue'),
    props: true
  },
  {
    path: '/my-submissions',
    name: 'MySubmissions',
    component: () => import('../views/MySubmissions1.vue'),
  },
  {
    path: '/teacher-materials',
    name: 'TeacherMaterials',
    component: () => import('../views/TeacherMaterials.vue'),
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