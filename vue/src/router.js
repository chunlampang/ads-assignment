import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/components/pages/HelloWorld')
    },
    {
      path: ':path*',
      component: () => import('@/components/pages/Error'),
      props: { code: 404 }
    }
  ]
})
