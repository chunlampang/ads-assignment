import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition)
      return savedPosition;
    if (to.hash)
      return { selector: to.hash };
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/components/pages/Index')
    },
    {
      path: '/courses-popular',
      name: 'coursePopular',
      meta: { menu: { title: "Popular Courses", icon: "mdi-trophy" } },
      component: () => import('@/components/pages/CoursePopular')
    },
  ]
});