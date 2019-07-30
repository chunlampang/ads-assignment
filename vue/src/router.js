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
      path: '/offers',
      name: 'offers',
      component: () => import('@/components/pages/Courses')
    },
    {
      path: '/courses-info',
      name: 'coursesInfo',
      component: () => import('@/components/pages/CoursesInfo')
    },
    {
      path: '/courses-popular',
      name: 'coursePopular',
      component: () => import('@/components/pages/CoursePopular')
    },
    {
      path: '/enrolled-students',
      name: 'enrolledStudents',
      component: () => import('@/components/pages/EnrolledStudents')
    },
  ]
});