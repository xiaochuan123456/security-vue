import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue")
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    children: [
      {
        path: '/',
        name: 'desktop',
        component: () => import('../views/Desktop.vue')
      }
      // {
      //   path: '/departmentList',
      //   name: 'departmentList',
      //   component: () => import("../views/system/Department/DepartmentList.vue")
      // },
      // {
      //   path: '/userList',
      //   name: 'userList',
      //   component: () => import('@/views/system/User/UserList.vue')
      // },
      // {
      //   path: '/roleList',
      //   name: 'roleList',
      //   component: () => import('@/views/system/Role/RoleList.vue')
      // },
      // {
      //   path: '/menuList',
      //   name: 'menuList',
      //   component: () => import('@/views/system/Menu/MenuList.vue')
      // }
    ]

  }

];

const router = new VueRouter({
  routes
});

export default router;
