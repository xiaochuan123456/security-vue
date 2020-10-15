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
    ]
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
      sessionStorage.setItem('tabList', JSON.stringify(state.tabs));
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
    }
  },
  actions: {

  },
};
