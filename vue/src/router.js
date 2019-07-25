import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Department from '@/models/Department';
import Student from '@/models/Student';
import Course from '@/models/Course';

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
      path: '/departments',
      name: Department.plural,
      meta: {
        menu: { title: Department.plural, icon: "build" }
      },
      component: () => import('@/components/maint/List'),
      props: { value: Department }
    },
    {
      path: '/departments/:id',
      name: Department.singular,
      component: () => import('@/components/maint/Edit'),
      props: { value: Department }
    },
    {
      path: '/students',
      name: Student.plural,
      meta: {
        menu: { title: Student.plural, icon: "build" }
      },
      component: () => import('@/components/maint/List'),
      props: { value: Student }
    },
    {
      path: '/students/:id',
      name: Student.singular,
      component: () => import('@/components/maint/Edit'),
      props: { value: Student }
    },
    {
      path: '/courses',
      name: Course.plural,
      meta: {
        menu: { title: Course.plural, icon: "build" }
      },
      component: () => import('@/components/maint/List'),
      props: { value: Course }
    },
    {
      path: '/courses/:id',
      name: Course.singular,
      component: () => import('@/components/maint/Edit'),
      props: { value: Course }
    },
    {
      path: '/offers',
      name: 'offers',
      meta: {
        menu: { title: "Offers", icon: "book" }
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
