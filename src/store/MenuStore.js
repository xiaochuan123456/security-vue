import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default {
  //state相当于一个内存，存储数据的，但是不能直接操作state里面的数据
  //需要mutations 来操作state里面存储的数据
  state: {
    editableTabsValue:'desktop',
    tabs:[
      {
        title:'首页',
        name:'desktop'
      }
    ],
    menu_data:[]
  },
  mutations: {
    //菜单点击时调用
    selectMenu(state, val) {
      //1.把当前点击的菜单对象的name和store的tabs比较
      let res = state.tabs.findIndex(item => item.name === val.name)
      //2.判断name是否存在，不存在才加入tabs
      if(res === -1) {
        let obj = {};
        obj.title = val.label;
        obj.name = val.name;
        state.tabs.push(obj);

      }
      //3.设置当前选中的对象
      state.editableTabsValue = val.name;
      //4.设置当前打开的所有选项卡到sessionStorage
      sessionStorage.setItem('tabsList', JSON.stringify(state.tabs));
    },
    //刷新浏览器，进入路由时调用，获取tabs数据
    getTabs(state){
      let tabs = sessionStorage.getItem('tabsList');
      if(tabs){
          let currentTabsList = JSON.parse(tabs);
          state.tabs = currentTabsList;
      }
    },
      //用于设置当前激活的选项卡
      setActiveTabs(state, current){
        state.editableTabsValue = current;
    },

    //获取动态的菜单数据和生成路由
    getMenuList(state, router){
      //1.取出菜单数据
      let menuList = sessionStorage.getItem('menuList');


      //2.设置菜单数据
      if(menuList){
        state.menu_data = JSON.parse(menuList);

      }
      //3.取出后台传递过来的路由数据
      let oldRouterList = sessionStorage.getItem('routerList');
      let routerList = [];
      if(oldRouterList){
        routerList = JSON.parse(oldRouterList);
      }
      //4.动态生成路由
      //4.1获取原来的路由
      let oldRouter = router.options.routes;
      //4.2遍历后台返回的路由数据，动态生成路由
      routerList.forEach(item => {
          //生成 component: () => import('@/views/Login.vue')
          item.component = () => import(`@/views${item.url}.vue`);
          //oldRouter[1] 表示获取到home路由,把后台返回的路由添加到该路由的子路由
          oldRouter[1].children.push(item);
      });
      
      //5.添加到现有的路由里面
      router.addRoutes(oldRouter);
    }
  },
  actions: {

  }
};
