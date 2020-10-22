import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//引入element组件库
import ElementUI from "element-ui";
//引入element样式文件
import "element-ui/lib/theme-chalk/index.css";
//引入弹性盒子布局样式
import './assets/css/flex.css'
//使用element
Vue.use(ElementUI);

import axios from 'axios';
Vue.prototype.$http = axios;
//axios拦截器，发送请求之前操作
axios.interceptors.request.use(config => {
  //解决spring security 不能获取到用户名和密码，验证码的问题，由于Spring Security采用form形式接收参数，我们axios提交数据,后台获取不到，那么在axios请求之前做
  //处理
  if (config.url.indexOf("/api/user/login") != -1) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  // 为请求头添加token字段
  config.headers.token = sessionStorage.getItem('token')
  return config;
});
// 接口数据返回时，如果后台返回token过期，那么需要重新登录 
// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
    // 否则的话抛出错误
    if (response.status === 200) {
      //600token过期或者token认证失败
      if (response.data.code == 600) {
        // sessionStorage.clear();
        // window.location.href = '/login';
        return response;
      } else {
        return Promise.resolve(response);
      }

    } else {
      return Promise.reject(response);
    }
  },
  // error => {
  //   if (error.response.status) {
  //     switch (error.response.status) {
  //       // 401: 未登录
  //       // 未登录则跳转登录页面，并携带当前页面的路径
  //       // 在登录成功后返回当前页面，这一步需要在登录页操作。                
  //       case 401:
  //         router.replace({
  //           path: '/login',
  //           query: {
  //             redirect: router.currentRoute.fullPath
  //           }
  //         });
  //         break;

  //       // 600 token过期
  //       // 登录过期对用户进行提示
  //       // 清除本地token和清空vuex中token对象
  //       // 跳转登录页面                
  //       case 405:
  //         ElementUI.Message({
  //           message: '请求方式错误',
  //           type: 'error'
  //         });
  //         break;
  //       // 404请求不存在
  //       case 404:
  //         ElementUI.Message({
  //           message: '网络请求不存在',
  //           type: 'error'
  //         });
  //         break;
  //       // 其他错误，直接抛出错误提示
  //       default:
  //         ElementUI.Message({
  //           message: error.response.data.msg,
  //           type: 'error'
  //         });
  //       if (error.response.data.code == 600) {
  //         sessionStorage.clear();
  //         window.location.href = '/login';
  //       }
  //     }
  //     return Promise.reject(error.response);
  //   }
  // }
  error => {
    if (error.response.status) {
      ElementUI.Message({
        message: error.response.data.msg,
        type: 'error'
      })
      if (error.response.data.code == 600) {
        // sessionStorage.clear();
        // window.location.href = "/login";
      }
      return Promise.reject(error.response);
    }
  }

);

//进入路由之前进行
router.beforeEach((to, from, next) => {
  //to 即将进入的路由
  //from  即将离开的路由
  //next   让路由继续执行

  //获取当前打开的选项卡
  store.commit('getTabs');
  //设置当前激活的选项卡
  store.commit('setActiveTabs', to.name);

  let token = sessionStorage.getItem('token');
  //let menuData = sessionStorage.getItem('menuList');
  if (to.path === '/login') {
    if (token) {
      next({ path: '/home' })
    } else {
      next()
    }
  } else {
    //如果不从登录页来的
    if (!token && to.name !== 'login') {
      next({ path: 'login' })
    } else {
      //如果store中的菜单数据menu_data被刷新了，那么重新加载
      if (store.state.MenuStore.menu_data.length == 0) {
        store.commit('getMenuList', router);
        if (to.path == "/") {
          next({ path: '/home' })
        } else {
          next({ path: to.path })
        }
      } else {
        next(); //继续往下执行
      }
    }

  }

})
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
