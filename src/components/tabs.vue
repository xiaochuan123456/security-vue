<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    closable
    @tab-click="tabClick"
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<script>
//import {mapState} from 'vuex'
export default {
  computed: {
    //   ...mapState({
    //     //tabs选项卡数据
    //     editableTabs: state => state.MenuStore.tabs,
    //     //当前激活的选项卡
    //     editableTabsValue: state => state.MenuStore.editableTabsValue
    //   }),
    editableTabsValue: {
      get() {
        return this.$store.state.MenuStore.editableTabsValue;
      },
      set(val) {
        return (this.$store.state.MenuStore.editableTabsValue = val);
      }
    },
    editableTabs: {
      get() {
        return this.$store.state.MenuStore.tabs;
      },
      set(val) {
        this.$store.state.MenuStore.tabs = val;
      }
    }
  },
  data() {
    return {
      // editableTabsValue: "2",
      // editableTabs: [
      //   {
      //     title: "Tab 1",
      //     name: "1",
      //     content: "Tab 1 content"
      //   },
      //   {
      //     title: "Tab 2",
      //     name: "2",
      //     content: "Tab 2 content"
      //   }
      // ],
      // tabIndex: 2
    };
  },
  methods: {
    tabClick(tab) {
      var obj = {};
      if (this.editableTabsValue === "desktop") {
        obj.label = "首页";
      } else {
        obj.label = tab.label;
      }
      obj.name = this.editableTabsValue;
      //显示路由，激活对应的左侧菜单项
      this.$router.push({ name: this.editableTabsValue });
      //设置tabs数据
      this.$store.commit("selectMenu", obj);
    },

    removeTab(targetName) {
      if (targetName === "desktop") {
        return;
      }
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      //当前激活的选项卡
      this.editableTabsValue = activeName;
      //路由跳到当前激活的选项卡
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>