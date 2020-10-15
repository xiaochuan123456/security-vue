import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui"; //引入element组件库
import "element-ui/lib/theme-chalk/index.css"; //引入element样式文件
//引入弹性盒子布局样式
import './assets/css/flex.css'
import axios from 'axios';
//使用element
Vue.use(ElementUI); 
//使用axios
Vue.prototype.$http = axios;
axios.interceptors.request.use(config => { 
  //解决spring security 不能获取到用户名和密码，验证码的问题，由于Spring Security采用form形式接收参数，我们axios提交数据,后台获取不到，那么在axios请求之前做
  //处理
  if (config.url.indexOf("/api/user/login") != -1) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

//进入路由之前进行
router.beforeEach((to,from,next) => {
	//to 即将进入的路由
	//from  即将离开的路由
    //获取当前打开的选项卡
    store.commit('getTabs');
    //设置当前激活的选项卡
    store.commit('setActiveTabs',to.name);
    next(); //继续往下执行
})
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
