<template>
<div>
  <template v-for="menu in menuList">
  <el-submenu v-if='menu.children.length > 0' :index="menu.path" :key="menu.path">
    <template slot="title">
      <i :class="menu.icon"></i>
      <span style=" font-size: 15px;font-weight: 600;" slot="title">{{menu.label}}</span>
    </template>
    <menu-item :menuList="menu.children"></menu-item> 
   </el-submenu>
   <el-menu-item v-else :index="menu.path" :key="menu.path">
     <i :class="menu.icon"></i>
      <span slot="title">{{menu.label}}</span>
   </el-menu-item>
  </template>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'
export default {
  name: 'MenuItem',
  props: ['menuList'],
  components:{
      MenuItem
  }
};
</script>

<style lang="scss" scoped>
</style>