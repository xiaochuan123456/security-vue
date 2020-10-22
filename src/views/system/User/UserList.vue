<template>
  <el-container>
    <el-aside width="200px">
      <div style="padding-top:5px;padding-left:5px;">
        <i class="el-icon-s-grid"></i>
        <span style="padding-left:3px;">组织机构</span>
      </div>
      <!--树-->
      <tree
        style="padding-left: 0px;padding-top: 10px;"
        :nodes="nodes"
        :setting="setting"
        @onCreated="handleCreated"
      />
    </el-aside>
    <el-main>
      <!--搜索栏-->
      <el-form size="mini" :model="searchForm" ref="form" label-width="80px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="电话">
              <el-input v-model="searchForm.deptPhone"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="5">
            <el-form-item label="邮箱">
              <el-input v-model="searchForm.deptEmail"></el-input>
            </el-form-item>
          </el-col>
          <el-button
            style="margin-left:20px;"
            size="mini"
            type="primary"
            icon="el-icon-search"
            >查询</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="addUser"
            >新增</el-button
          >
        </el-row>
      </el-form>
      <el-table
        size="mini"
        :data="tableData"
        :height="tableHeight"
        border
        style="width: 100%"
      >
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button @click="editUser(scope.row)" type="primary" size="mini"
              >编辑
            </el-button>
            <el-button @click="assignRole(scope.row)" type="success " size="mini"
              >分配角色
            </el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" size="mini"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
        
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
      <!--新增用户弹框-->
      <el-dialog
        :title="userDialogTitle"
        :visible.sync="dialogVisible"
        width="35%"
      >
        <el-form inline size="mini" :model="userForm" ref="userForm" label-width="80px">
          <el-form-item prop="deptName" label="部门名称">
          <el-input @click.native="selectDept" v-model="userForm.deptName"></el-input>
        </el-form-item>
        <el-form-item prop="loginName" label="姓名">
          <el-input v-model="userForm.loginName"></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="userForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="mobile" label="电话">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="username" label="登录名">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="edieTag == '0'" label="密码">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUser()">确 定</el-button>
        </span>
      </el-dialog>
      <!--用户所属部门弹框-->
      <el-dialog
        title="选择用户所属部门"
        :visible.sync="parentDeptDialogVisible"
        width="30%"
      >
        <!--用户所属部门树-->
        <tree
          @onCreated="parentCreated"
          :nodes="parentNodes"
          :setting="parentSetting"
        ></tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="parentDeptDialogVisible = false">取 消</el-button>
          <el-button @click="parentDeptDialogVisible = false" type="primary"
            >确 定</el-button
          >
        </span>
      </el-dialog>

       <!--分配角色弹框-->
      <el-dialog
        title="分配角色"
        :visible.sync="roleDialogVisible"
        width="30%"
        class="roleClass"
      >
      <el-table
        size="mini"
        :data="roleTableData"
        style="width: 100%"
        highlight-current-row
        @current-change="selectRoleRow"
      >
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
      </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取 消</el-button>
          <el-button @click="roleDialogVisible = false" type="primary"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import tree from "vue-giant-tree";
export default {
  components: {
    tree
  },
  created(){
    //加载左侧部门树
    this.getLeftTree();
  },
  //计算表格高度
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 330; //后面的130：根据需求空出的高度，自行调整
    });
  },
  data() {
    return {
      //左侧部门树id
      leftDeptId:"",
      editTag:"0",
      //分配角色弹框显示或隐藏
      roleDialogVisible: false,
      //角色列表数据
      roleTableData:[],
      //用户所属部门弹框显示或隐藏
      parentDeptDialogVisible: false,
      //新增或修改用户弹框标题
      userDialogTitle: "",
      dialogVisible: false,
      //当前页
      currentPage: 1,
      pageSize: 10,
      total: 0,
      //用户所属部门树对象
      parentZtreeObj: null,
      //用户所属部门树数据
      parentNodes: [],
      //用户所属部门树配置
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

      //部门数据绑定
      userForm: {
        username: "",
        sex: "",
        email:"",
        mobile:"",
        loginName: "",
        password: "",
        deptId: "",
        deptName: ""
      },
      //左侧部门树对象
      ztreeObj: null,
      //左侧部门树的绑定后台数据
      nodes: [],
      //左侧部门树插件配置
      setting: {
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
        //回调函数
        callback: {
          //相当于配置树的点击事件
          onClick: this.ztreeOnClick
        }
      },

      //表格高度
      tableHeight: 0,
      //搜索数据
      searchForm: {
        userName: "",
        userPhone: "",
        userEmail: ""
      },
      tableData: []
    };
  },
  methods: {
    submitUser(){
       let _this = this;
      //1.验证表单
      _this.$refs.userForm.validate(async valid => {
        if (valid) {
          let url = "";
          if (_this.editTag == "0") {
            url = "/api/user/addUser";
          } else {
            url = "/api/user/updateSaveUser";
          }
          let parm = _this.userForm;
          let { data: res } = await _this.$http.post(url, parm);
          if (res.code == 200) {
            //取消全部选中
            _this.ztreeObj.checkAllNodes(false);
            _this.ztreeObj.cancelSelectedNode();
            //设置添加时选中的节点
            var node = this.ztreeObj.getNodeByParam("id", _this.leftDeptId);
            if (node) {
              _this.ztreeObj.selectNode(node, true);
              _this.setting.callback.onClick(null, node.id, node);
            }
            //刷新表格数据
            _this.getUserListByDeptId();
            //关闭弹框
            _this.dialogVisible = false;
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
    //左侧部门树创建成功之后调用
    handleCreated: function(ztreeObj) {
      this.ztreeObj = ztreeObj;
      let firstTree = this.ztreeObj.getNodes()[0];
      //默认选中第一个
      this.ztreeObj.selectNode(firstTree);
      //设置节点全部展开
      ztreeObj.expandAll(true);
      //加载完自动点击第一个，加载右边表格
      if (firstTree) {
        //此处需要判断，否则会报错
        this.setting.callback.onClick(null, firstTree.id, firstTree);
      }
    },
    // 左侧部门树点击事件,evt
    ztreeOnClick: function(evt, treeId, treeNode) {
      this.leftDeptId = treeNode.id
      //此处根据点中部门树id查询用户
      this.getUserListByDeptId();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //用户所属部门树创建成功之后调用
    parentCreated: function(parentZtreeObj) {
      this.parentZtreeObj = parentZtreeObj;
      //设置节点全部展开
      parentZtreeObj.expandAll(true);
    },
    //弹框中用户所属部门树点击事件
    ztreeParentOnClick(evt, treeId, treeNode) {
      console.log(treeNode.name);
      this.userForm.deptName = treeNode.name;
      this.userForm.deptId = treeNode.id;
      console.log(evt, treeId, treeNode);
    },
    //弹框中选择用户所属部门
    selectDept() {
      this.getSelectDeptTree();
      this.parentDeptDialogVisible = true;
    },
    //删除按钮
    deleteDept(row) {
      let _this = this;
      _this.$confirm("确定删除吗 ?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let parm = {
          id: row.id
        };
        let { data: res } = await _this.$http.delete(
          "/api/user/deleteUserById",
          parm
        );
        if (res.code == 200) {
          
          //刷新表格数据
          _this.getUserListByDeptId();
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
    //编辑按钮
    editUser(row) {
      let _this = this;
      _this.editTag = "1";
      //显示弹框
      _this.dialogVisible = true;
      //清空表单数据
      _this.resetForm("userForm");
      //查询要编辑的用户信息
      _this.getUserById(row.id);
    },
    //根据id查询用户信息
    async getUserById(userId) {
      let _this = this;
      let parm = {
        id: userId
      };
      let { data: res } = await _this.$http.post("/api/user/getUserById", parm);
      if (res.code == 200) {
        _this.userForm = res.data;
        _this.leftDeptId = res.data.deptId;
      }
    },
    addUser() {
      //清空表单数据
      this.resetForm("userForm");
      this.deptDialogTitle = "新增用户";
      this.dialogVisible = true;
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    //分配角色
    assignRole(row) {
      console.log(row);
      this.roleTableData =[
        {id:'1',roleName:'超级管理员'},
        {id:'2',roleName:'系统管理员'},
        {id:'3',roleName:'财务管理员'}
      ]
      this.roleDialogVisible = true;
    },
    //选中角色
    selectRoleRow(row){
      console.log(row)
    },
    //获取左侧组织树
    async getLeftTree() {
      let _this = this;
      let { data: res } = await _this.$http.post("/api/department/getLeftDeptTree");
      if (res.code == 200) {
        _this.nodes = res.data;
      }
    },
    //根据部门id查询用户列表
    async getUserListByDeptId() {
      let parm = {
        deptId: this.leftDeptId,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        userName: this.searchForm.userName,
        userPhone:this.searchForm.userPhone,
        userEmail:this.searchForm.userEmail 
      };
      let { data: res } = await this.$http.post("/api/user/getUserList", parm);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.currentPage = res.data.current;
        this.total = res.data.total;
      }
    },
    //获取新增弹框部门树
    async getSelectDeptTree() {
      let _this = this;
      let { data: res } = await _this.$http.post("/api/department/getLeftDeptTree");
      if (res.code == 200) {
        _this.parentNodes = res.data;
      }
    },

  }
};
</script>

<style lang="scss" scoped>
// .roleClass /deep/ .el-table__body tr.current-row > td {
//   background: #409eff !important;
//   color: #fff;
// }
</style>