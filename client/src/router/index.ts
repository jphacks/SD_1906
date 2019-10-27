import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/daily',
  },
  {
    path: '/daily',
    name: 'daily',
    component: () => import('../views/Daily.vue'),
  },
  {
    path: '/lifespan',
    name: 'lifespan',
    component: () => import('../views/Lifespan.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
