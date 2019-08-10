import Vue from 'vue';
import Router from 'vue-router';
import goTo from 'vuetify/es5/services/goto';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    let scrollTo = 0;

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo, {
      duration: 300
    });
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