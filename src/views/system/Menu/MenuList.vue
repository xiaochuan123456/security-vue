<template>
  <el-main>
    <!--搜索框-->
    <el-form
      size="mini"
      :model="searchForm"
      ref="searchForm"
      label-width="80px"
    >
      <el-row>
        <el-col :span="4">
          <el-form-item label="名称">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-button
          size="mini"
          style="margin-left:20px;"
          icon="el-icon-search"
          type="primary"
          @click="searchMenu"
          >搜索</el-button
        >
        <el-button
          size="mini"
          icon="el-icon-plus"
          type="primary"
          @click="addMenu"
          >新增</el-button
        >
      </el-row>
    </el-form>
    <!--数据表格-->
    <el-table
      size="mini"
      :data="menuList"
      style="width: 100%;"
      row-key="id"
      border
      :height="tableHeight"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column
        prop="label"
        label="名称"
        sortable
        width="180"
      ></el-table-column>
      <el-table-column prop="icon" label="图标" sortable width="180">
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '0'" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === '1'" size="small" type="success"
            >菜单</el-tag
          >
          <el-tag v-else-if="scope.row.type === '2'" size="small" type="info"
            >按钮</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="url" label="菜单URL"></el-table-column>
      <el-table-column prop="path" label="路由地址"></el-table-column>
      <el-table-column prop="code" label="权限标识"></el-table-column>
      <el-table-column prop="orderNum" label="序号"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            @clickt="editPermission(scope.row)"
            type="primary"
            size="mini"
            >编辑
          </el-button>
          <el-button
            @click="deletePermission(scope.row)"
            type="danger"
            size="mini"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增权限弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="35%">
      <el-form
        :inline="true"
        size="mini"
        :model="addForm"
        ref="addForm"
        label-width="80px"
        :rules="MenuValdate"
      >
        <el-form-item label="上级菜单">
          <el-input
            readonly
            @click.native="selectMenu()"
            v-model="addForm.parentName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="label" label="权限名称">
          <el-input v-model="addForm.label"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="type" label="权限类型">
              <el-radio-group v-model="addForm.type">
                <el-radio :label="'0'">目录</el-radio>
                <el-radio :label="'1'">菜单</el-radio>
                <el-radio :label="'2'">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="icon" v-if="addForm.type != '2'" label="菜单图标">
          <el-input v-model="addForm.icon"></el-input>
        </el-form-item>
        <el-form-item prop="name" v-if="addForm.type == '1'" label="路由名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="path" v-if="addForm.type != '2'" label="路由地址">
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
        <el-form-item prop="url" v-if="addForm.type == '1'" label="组件路径">
          <el-input v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="权限标识">
          <el-input v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="显示序号">
          <el-input-number v-model="addForm.orderNum"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
    <!--上级菜单弹框-->
    <el-dialog
      title="选择上级菜单"
      :visible.sync="parentDialogVisible"
      width="30%"
    >
      <!--上级菜单树-->
      <tree
        @onCreated="parentCreated"
        :nodes="parentNodes"
        :setting="parentSetting"
      ></tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="parentDialogVisible = false">取 消</el-button>
        <el-button @click="parentDialogVisible = false" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-main>
</template>

<script>
import tree from "vue-giant-tree";
export default {
  components: {
    tree
  },
  created() {
    this.getMenuList();
    this.getParentTree();
  },
  methods: {
    //新增或编辑提交
    submit() {
      let _this = this;
      _this.$refs.addForm.validate(async valid => {
        if (valid) {
          let url = "";
          if (_this.editTag == "0") {
            //新增
            url = "/api/permission/addPermission";
          } else {
            //编辑
            url = "/api/permission/editPermission";
          }
          let parm = _this.addForm;
          let { data: res } = await _this.$http.post(url, parm);
          if (res.code == 200) {
            //关闭弹框
            _this.dialogVisible = false;
            _this.getMenuList();
            _this.getParentTree();
            _this.$message({
              message: res.msg,
              type: "success"
            });
          } else {
            _this.$message({
              message: res.msg,
              type: "error"
            });
          }
        }
      });
    },
    //获取表格数据
    async getMenuList() {
      let { data: res } = await this.$http.post("/api/permission/getMenuList");
      if (res.code == 200) {
        this.menuList = res.data;
      }
    },
    addMenu() {
      this.dialogTitle = "新增权限";
      this.dialogVisible = true;
      //新增时清空数据
      this.resetForm("addForm");
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    searchMenu() {},
    // 获取上级菜单树数据
    async getParentTree() {
      let { data: res } = await this.$http.post("api/permission/getParentTree");

      this.parentNodes = res.data;
    },
    editPermission(row) {
      //设置标志设为1
      this.editTag = "1";
      this.dialogTitle = "编辑权限";
      this.dialogVisible = true;
      this.resetForm("addForm");
      //回显编辑的数据
      this.getPermissionById(row.id);
    },
    async getPermissionById(id) {
      let parm = {
        id: id
      };
      let { data: res } = await this.$http.post(
        "/api/permission/getPermissionById",
        parm
      );
      if (res.code == 200) {
        this.addForm.id = res.data.id;
        this.addForm.code = res.data.code;
        this.addForm.icon = res.data.icon;
        this.addForm.label = res.data.label;
        this.addForm.name = res.data.name;
        this.addForm.orderNum = res.data.orderNum;
        this.addForm.parentId = res.data.parentId;
        this.addForm.parentName = res.data.parentName;
        this.addForm.path = res.data.path;
        this.addForm.type = res.data.type;
        this.addForm.url = res.data.url;
      }
    },
    async deletePermission(row) {
      let _this = this;
      this.$confirm("确定删除吗 ?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async() => {
        let parm = {
          id: row.id
        };
        let { data: res } = await this.$http.post(
          "/api/permission/deleteById",
          parm
        );
        if (res.code == 200) {
          _this.getMenuList();
          _this.getParentTree();
          _this.$message({
            message: res.msg,
            type: "success"
          });
        } else {
          _this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //选择上级菜单
    selectMenu() {
      this.parentDialogVisible = true;
    },
    //上级菜单树点击事件
    ztreeParentOnClick(evt, treeId, treeNode) {
      this.addForm.parentName = treeNode.name;
      this.addForm.parentId = treeNode.id;
      console.log(evt);
      console.log(treeId);
      console.log(treeNode);
    }
  },
  //计算表格高度
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 330; //后面的130：根据需求空出的高度，自行调整
    });
  },
  data() {
    return {
      MenuValdate: {
        label: [
          { required: true, trigger: "change", message: "请填写权限名称" }
        ],
        type: [
          { required: true, trigger: "change", message: "请选择权限类型" }
        ],
        parentName: [
          { required: true, trigger: "change", message: "请选择上级菜单" }
        ],
        name: [
          { required: true, trigger: "change", message: "请填写路由名称" }
        ],
        path: [
          { required: true, trigger: "change", message: "请填写路由地址" }
        ],
        url: [{ required: true, trigger: "change", message: "请填写组件路径" }],
        code: [{ required: true, trigger: "change", message: "请填写权限标识" }]
      },
      //0新增 1编辑
      editTag: "0",
      //新增或修改弹框标题
      dialogTitle: "",
      dialogVisible: false,
      //表格高度
      tableHeight: 0,
      searchForm: {
        name: ""
      },
      //上级菜单弹框显示或隐藏
      parentDialogVisible: false,
      //上级菜单树
      parentZtreeObj: null,
      parentNodes: [], //上级菜单树数据
      //上级菜单树配置
      parentSetting: {
        view: {
          showLine: true,
          showIcon: false,
          fontCss: { "font-size": "12px", color: "#333" }
        },
        //设置这里会显示复选框
        // check: {
        //   enable: true
        // },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pid",
            rootPId: "0"
          }
        },
        callback: {
          onClick: this.ztreeParentOnClick
        }
      },
      addForm: {
        id: "", //编辑id
        label: "",
        name: "",
        type: 0,
        parentId: "",
        orderNum: "",
        parentName: "",
        path: "",
        code: "",
        icon: ""
      },
      menuList: [
        {
          id: 17,
          parentId: 0,
          parentName: "顶级菜单",
          label: "系统管理",
          code: "sys:manage",
          path: "/system",
          name: null,
          url: null,
          orderNum: 1,
          type: "0",
          icon: "el-icon-document",
          remark: null,
          createTime: "2023-08-08T03:11:11.000+0000",
          updateTime: "2023-08-09T07:26:28.000+0000",
          isHome: 0,
          children: [
            {
              id: 33,
              parentId: 17,
              parentName: "系统管理",
              label: "机构管理",
              code: "sys:dept",
              path: "/departmentList",
              name: "departmentList",
              url: "/system/Department/DepartmentList",
              orderNum: 2,
              type: "1",
              icon: "el-icon-copy-document",
              remark: "机构管理",
              createTime: "2020-04-12T14:58:29.000+0000",
              updateTime: "2020-04-08T09:12:19.000+0000",
              isHome: 0,
              children: [
                {
                  id: 46,
                  parentId: 33,
                  parentName: null,
                  label: "新增",
                  code: "sys:addDepartment",
                  path: "",
                  name: "",
                  url: null,
                  orderNum: 0,
                  type: "2",
                  icon: "",
                  remark: null,
                  createTime: "2020-04-12T11:58:48.000+0000",
                  updateTime: "2020-04-12T11:58:48.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 76,
                  parentId: 33,
                  parentName: null,
                  label: "编辑",
                  code: "sys:editDept",
                  path: "",
                  name: "",
                  url: null,
                  orderNum: 1,
                  type: "2",
                  icon: "",
                  remark: null,
                  createTime: "2020-04-12T12:42:20.000+0000",
                  updateTime: "2020-04-12T12:42:20.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 78,
                  parentId: 33,
                  parentName: "机构管理",
                  label: "删除",
                  code: "sys:deleteDept",
                  path: "",
                  name: "",
                  url: "",
                  orderNum: 3,
                  type: "2",
                  icon: "",
                  remark: null,
                  createTime: "2020-04-18T02:25:55.000+0000",
                  updateTime: "2020-04-18T02:25:55.000+0000",
                  isHome: 0,
                  children: []
                }
              ]
            },
            {
              id: 18,
              parentId: 17,
              parentName: null,
              label: "用户管理",
              code: "sys:user",
              path: "/userList",
              name: "userList",
              url: "/system/User/UserList",
              orderNum: 3,
              type: "1",
              icon: "el-icon-s-custom",
              remark: null,
              createTime: "2023-08-08T03:11:11.000+0000",
              updateTime: "2023-08-09T07:26:28.000+0000",
              isHome: 0,
              children: [
                {
                  id: 20,
                  parentId: 18,
                  parentName: null,
                  label: "新增",
                  code: "sys:user:add",
                  path: null,
                  name: null,
                  url: "",
                  orderNum: null,
                  type: "2",
                  icon: "",
                  remark: "新增用户",
                  createTime: "2023-08-08T03:11:11.000+0000",
                  updateTime: "2023-08-09T07:26:28.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 21,
                  parentId: 18,
                  parentName: null,
                  label: "修改",
                  code: "sys:user:edit",
                  path: null,
                  name: null,
                  url: "",
                  orderNum: null,
                  type: "2",
                  icon: "",
                  remark: "修改用户",
                  createTime: "2023-08-08T03:11:11.000+0000",
                  updateTime: "2023-08-09T07:26:28.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 22,
                  parentId: 18,
                  parentName: null,
                  label: "删除",
                  code: "sys:user:delete",
                  path: null,
                  name: null,
                  url: "",
                  orderNum: null,
                  type: "2",
                  icon: "",
                  remark: "删除用户",
                  createTime: "2023-08-08T03:11:11.000+0000",
                  updateTime: "2023-08-09T07:26:28.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 80,
                  parentId: 18,
                  parentName: "用户管理",
                  label: "分配角色",
                  code: "sys:user:assign",
                  path: "",
                  name: "",
                  url: "",
                  orderNum: 0,
                  type: "2",
                  icon: "",
                  remark: null,
                  createTime: "2020-04-18T02:50:14.000+0000",
                  updateTime: "2020-04-18T02:50:14.000+0000",
                  isHome: 0,
                  children: []
                }
              ]
            },
            {
              id: 23,
              parentId: 17,
              parentName: null,
              label: "角色管理",
              code: "sys:role",
              path: "/roleList",
              name: "roleList",
              url: "/system/Role/RoleList",
              orderNum: 4,
              type: "1",
              icon: "el-icon-rank",
              remark: null,
              createTime: "2023-08-08T03:11:11.000+0000",
              updateTime: "2023-08-09T07:26:28.000+0000",
              isHome: 0,
              children: [
                {
                  id: 25,
                  parentId: 23,
                  parentName: null,
                  label: "新增",
                  code: "sys:role:add",
                  path: null,
                  name: null,
                  url: "",
                  orderNum: null,
                  type: "2",
                  icon: "",
                  remark: "新增角色",
                  createTime: "2023-08-08T03:11:11.000+0000",
                  updateTime: "2023-08-09T07:26:28.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 26,
                  parentId: 23,
                  parentName: null,
                  label: "修改",
                  code: "sys:role:edit",
                  path: null,
                  name: null,
                  url: "",
                  orderNum: null,
                  type: "2",
                  icon: "",
                  remark: "修改角色",
                  createTime: "2023-08-08T03:11:11.000+0000",
                  updateTime: "2023-08-09T07:26:28.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 27,
                  parentId: 23,
                  parentName: null,
                  label: "删除",
                  code: "sys:role:delete",
                  path: null,
                  name: null,
                  url: "",
                  orderNum: null,
                  type: "2",
                  icon: "",
                  remark: "删除角色",
                  createTime: "2023-08-08T03:11:11.000+0000",
                  updateTime: "2023-08-09T07:26:28.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 79,
                  parentId: 23,
                  parentName: "角色管理",
                  label: "分配权限",
                  code: "sys:role:assign",
                  path: "",
                  name: "",
                  url: "",
                  orderNum: 0,
                  type: "2",
                  icon: "",
                  remark: null,
                  createTime: "2020-04-18T02:31:05.000+0000",
                  updateTime: "2020-04-18T02:31:05.000+0000",
                  isHome: 0,
                  children: []
                }
              ]
            },
            {
              id: 28,
              parentId: 17,
              parentName: null,
              label: "权限管理",
              code: "sys:menu",
              path: "/menuList",
              name: "menuList",
              url: "/system/Menu/MenuList",
              orderNum: 5,
              type: "1",
              icon: "el-icon-menu",
              remark: null,
              createTime: "2023-08-08T03:11:11.000+0000",
              updateTime: "2023-08-09T07:26:28.000+0000",
              isHome: 0,
              children: [
                {
                  id: 30,
                  parentId: 28,
                  parentName: null,
                  label: "新增",
                  code: "sys:menu:add",
                  path: null,
                  name: null,
                  url: "",
                  orderNum: null,
                  type: "2",
                  icon: null,
                  remark: "新增权限",
                  createTime: "2023-08-08T03:11:11.000+0000",
                  updateTime: "2023-08-09T07:26:28.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 31,
                  parentId: 28,
                  parentName: null,
                  label: "修改",
                  code: "sys:menu:edit",
                  path: null,
                  name: null,
                  url: "",
                  orderNum: null,
                  type: "2",
                  icon: null,
                  remark: "修改权限",
                  createTime: "2023-08-08T03:11:11.000+0000",
                  updateTime: "2023-08-09T07:26:28.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 32,
                  parentId: 28,
                  parentName: null,
                  label: "删除",
                  code: "sys:menu:delete",
                  path: null,
                  name: null,
                  url: "",
                  orderNum: null,
                  type: "2",
                  icon: "",
                  remark: "删除权限",
                  createTime: "2023-08-08T03:11:11.000+0000",
                  updateTime: "2023-08-09T07:26:28.000+0000",
                  isHome: 0,
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: 34,
          parentId: 0,
          parentName: "顶级菜单",
          label: "商品管理",
          code: "sys:goods",
          path: "/goods",
          name: "",
          url: null,
          orderNum: 2,
          type: "0",
          icon: "el-icon-picture",
          remark: null,
          createTime: "2020-04-12T14:49:47.000+0000",
          updateTime: "2020-04-12T09:22:03.000+0000",
          isHome: 0,
          children: [
            {
              id: 36,
              parentId: 34,
              parentName: "商品管理",
              label: "分类管理",
              code: "sys:goodsCategory",
              path: "/goodCategory",
              name: "goodCategory",
              url: "/goods/goodsCategory/goodsCategoryList",
              orderNum: 1,
              type: "1",
              icon: "el-icon-s-data",
              remark: null,
              createTime: "2020-04-12T14:54:32.000+0000",
              updateTime: "2020-04-12T09:26:30.000+0000",
              isHome: 0,
              children: [
                {
                  id: 38,
                  parentId: 36,
                  parentName: null,
                  label: "新增",
                  code: "sys:addGoodsCategory",
                  path: "",
                  name: "",
                  url: null,
                  orderNum: 0,
                  type: "2",
                  icon: "",
                  remark: null,
                  createTime: "2020-04-12T09:33:58.000+0000",
                  updateTime: "2020-04-12T09:33:58.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 39,
                  parentId: 36,
                  parentName: null,
                  label: "编辑",
                  code: "sys:editGoodsCategory",
                  path: "",
                  name: "",
                  url: null,
                  orderNum: 1,
                  type: "2",
                  icon: "",
                  remark: null,
                  createTime: "2020-04-12T09:35:30.000+0000",
                  updateTime: "2020-04-12T09:35:30.000+0000",
                  isHome: 0,
                  children: []
                }
              ]
            },
            {
              id: 37,
              parentId: 34,
              parentName: null,
              label: "品牌管理",
              code: "sys:goodsBrand",
              path: "/goodsBrand",
              name: "goodsBrand",
              url: "/goods/goodsBrand/goodsBrandList",
              orderNum: 2,
              type: "1",
              icon: "el-icon-tickets",
              remark: null,
              createTime: "2020-04-12T09:32:04.000+0000",
              updateTime: "2020-04-12T09:32:04.000+0000",
              isHome: 0,
              children: [
                {
                  id: 40,
                  parentId: 37,
                  parentName: null,
                  label: "新增",
                  code: "sys:addGoodsBrand",
                  path: "",
                  name: "",
                  url: null,
                  orderNum: 0,
                  type: "2",
                  icon: "",
                  remark: null,
                  createTime: "2020-04-12T09:36:14.000+0000",
                  updateTime: "2020-04-12T09:36:14.000+0000",
                  isHome: 0,
                  children: []
                },
                {
                  id: 41,
                  parentId: 37,
                  parentName: null,
                  label: "编辑",
                  code: "sys:editGoodsBrand",
                  path: "",
                  name: "",
                  url: null,
                  orderNum: 1,
                  type: "2",
                  icon: "",
                  remark: null,
                  createTime: "2020-04-12T09:36:46.000+0000",
                  updateTime: "2020-04-12T09:36:46.000+0000",
                  isHome: 0,
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: 42,
          parentId: 0,
          parentName: "顶级菜单",
          label: "系统工具",
          code: "sys:systenConfig",
          path: "/systenConfig",
          name: "",
          url: null,
          orderNum: 3,
          type: "0",
          icon: "el-icon-receiving",
          remark: null,
          createTime: "2020-04-12T14:50:03.000+0000",
          updateTime: "2020-04-12T09:40:41.000+0000",
          isHome: 0,
          children: [
            {
              id: 43,
              parentId: 42,
              parentName: "系统工具",
              label: "代码生成",
              code: "sys:systemCode",
              path: "/systemCode",
              name: "systemCode",
              url: "/system/config/code",
              orderNum: 0,
              type: "1",
              icon: "el-icon-files",
              remark: null,
              createTime: "2020-04-16T04:44:42.000+0000",
              updateTime: "2020-04-12T09:44:06.000+0000",
              isHome: 0,
              children: []
            },
            {
              id: 77,
              parentId: 42,
              parentName: "系统工具",
              label: "接口文档",
              code: "sys:document",
              path: "/document",
              name: "document",
              url: "/system/config/systemDocument",
              orderNum: 0,
              type: "1",
              icon: "el-icon-s-operation",
              remark: null,
              createTime: "2020-04-13T03:31:45.000+0000",
              updateTime: "2020-04-13T03:31:45.000+0000",
              isHome: 0,
              children: []
            }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>