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
              <el-input v-model="searchForm.deptName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="电话">
              <el-input v-model="searchForm.deptPhone"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="5">
            <el-form-item label="邮箱">
              <el-input v-model="searchForm.deptPhone"></el-input>
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
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
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
        :page-size="10"
        layout="total, prev, pager, next"
        :total="100"
      ></el-pagination>
      <!--新增用户弹框-->
      <el-dialog
        :title="userDialogTitle"
        :visible.sync="dialogVisible"
        width="35%"
      >
        <el-form inline size="mini" :model="userForm" ref="userForm" label-width="80px">
          <el-form-item label="部门">
          <el-input @click.native="selectDept" v-model="userForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userForm.loginname"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
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
  //计算表格高度
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 330; //后面的130：根据需求空出的高度，自行调整
    });
  },
  data() {
    return {
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
        phone: "",
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
        userPhone: ""
      },
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },
  methods: {
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
      console.log(treeNode);
      //此处根据点中部门树id查询下级部门
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
      this.parentDeptDialogVisible = true;
      this.parentNodes = [
        {
          id: "0",
          pid: "-1",
          likeId: "0,",
          parentName: null,
          manager: null,
          name: "顶级部门",
          deptCode: null,
          deptAddress: null,
          deptPhone: null,
          orderNum: null
        },
        {
          id: "1000000362292826",
          pid: "1000001251633881",
          likeId: "0,100000177618509910000012516338811000000362292826",
          parentName: "销售部门",
          manager: null,
          name: "销售1",
          deptCode: "",
          deptAddress: "",
          deptPhone: "",
          orderNum: 0
        },
        {
          id: "1000001251633881",
          pid: "1000001776185099",
          likeId: "0,10000017761850991000001251633881",
          parentName: "秘咖科技有限公司",
          manager: null,
          name: "销售部门",
          deptCode: null,
          deptAddress: null,
          deptPhone: null,
          orderNum: null
        },
        {
          id: "1000001341234088",
          pid: "1000001776185099",
          likeId: "0,1000001776185099",
          parentName: "秘咖网络科技有限公司",
          manager: null,
          name: "人才管理部1",
          deptCode: "RCGL",
          deptAddress: "",
          deptPhone: "",
          orderNum: 0
        },
        {
          id: "1000001620535597",
          pid: "1000001776185099",
          likeId: "0,10000017761850991000001620535597",
          parentName: "秘咖网络科技有限公司",
          manager: null,
          name: "软件研发部",
          deptCode: null,
          deptAddress: null,
          deptPhone: null,
          orderNum: null
        },
        {
          id: "1000001776185099",
          pid: "0",
          likeId: "0,1000001776185099",
          parentName: "顶级部门",
          manager: null,
          name: "秘咖网络科技有限公司",
          deptCode: null,
          deptAddress: null,
          deptPhone: null,
          orderNum: null
        },
        {
          id: "1000002097176073",
          pid: "1000001776185099",
          likeId: "0,10000017761850991000002097176073",
          parentName: "秘咖网络科技有限公司",
          manager: "464156",
          name: "售后服务部",
          deptCode: "SHFWB",
          deptAddress: "昆明",
          deptPhone: "18687171906",
          orderNum: null
        }
      ];
    },
    //删除按钮
    deleteUser(row) {
      console.log(row);
    },
    //编辑按钮
    editUser(row) {
      console.log(row);
    },
    addUser() {
      this.deptDialogTitle = "新增部门";
      this.dialogVisible = true;
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
    }
  }
};
</script>

<style lang="scss" scoped>
// .roleClass /deep/ .el-table__body tr.current-row > td {
//   background: #409eff !important;
//   color: #fff;
// }
</style>