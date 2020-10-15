import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: '/departmentList',
        name: 'departmentList',
        component: () => import("../views/system/Department/DepartmentList.vue")
      },
      {
        path: '/userList',
        name: 'userList',
        component: () => import('@/views/system/User/UserList.vue')
      },
      {
        path: '/roleList',
        name: 'roleList',
        component: () => import('@/views/system/Role/RoleList.vue')
      },
      {
        path: '/menuList',
        name: 'menuList',
        component: () => import('@/views/system/Menu/MenuList.vue')
      }
    ]

  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue")
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
