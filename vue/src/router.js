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
      component: () => import('@/components/pages/Index')
    },
    {
      path: '/courses',
      name: 'courses',
      meta: {
        menu: { title: "Courses", icon: "book" }
      },
      component: () => import('@/components/pages/Courses')
    },
    {
      path: '/courses-info',
      name: 'coursesInfo',
      meta: {
        menu: { title: "Courses Info", icon: "book" }
      },
      component: () => import('@/components/pages/CoursesInfo')
    },
    {
      path: '/courses-popular',
      name: 'coursePopular',
      meta: {
        menu: { title: "Popular Courses", icon: "grade" }
      },
      component: () => import('@/components/pages/CoursePopular')
    },
    {
      path: '/enrolled-students',
      name: 'enrolledStudents',
      meta: {
        menu: { title: "Enrolled Students", icon: "people" }
      },
      component: () => import('@/components/pages/EnrolledStudents')
    },
    {
      path: '/:path*',
      component: () => import('@/components/pages/Error'),
      props: { code: 404 }
    }
  ]
})
