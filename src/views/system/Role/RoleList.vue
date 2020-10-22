<template>
  <el-main>
    <!--搜索框-->
    <el-form :model="roleForm" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="角色名称">
            <el-input
              v-model="roleForm.roleName"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-button @click="searchRole()" class="btn-left" type="primary" icon="el-icon-search"
          >查询</el-button
        >
        <el-button type="primary" @click="addRole()" icon="el-icon-plus"
          >新增</el-button
        >
      </el-row>
    </el-form>
    <!--数据表格
     :data  绑定表格数据
     size: 表格尺寸   可选  medium / small / mini
     stripe   是否为斑马线
     height  表格高度,只要在el-table元素中定义了height属性，即可实现固定表头的表格
     prop:需要与表格数据对应
    -->
    <el-table :data="roleList" height="250" border style="width: 100%">
      <el-table-column prop="name" label="角色名称" width="180"> </el-table-column>
      <el-table-column prop="remark" label="备注" width="180"> </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button @clickt="editRole(scope.row)" type="primary" size="mini"
            >编辑
          </el-button>
          <el-button @click="assinRole(scope.row)" type="success" size="mini"
            >分配权限
          </el-button>
          <el-button @click="deleteRole(scope.row)" type="danger" size="mini"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pagesize"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <!--新增角色弹框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="addRole" :model="addRoleForm" inline>
        <el-form-item prop="name" label="角色名称">
          <el-input
            v-model="addRoleForm.name"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="角色描述">
          <el-input
            v-model="addRoleForm.remark"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBtn()">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色权限弹框-->
    <el-dialog
      class="self_dialog"
      width="25%"
      :title="autnTitle"
      :visible.sync="autnDialogVisible"
    >
      <tree
        :nodes="treeDatas"
        :setting="setting"
        @onCheck="ztreeOnCheck"
        @onCreated="handleCreated"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAssign">确 定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

 
<script>
import tree from "vue-giant-tree";
export default {
  components: {
    tree
  },
  created(){
    //查询角色列表
    this.getRoleList();
  },
  data() {
    return {
      editTag:"0",
      treedatas: [],
      //ztree对象
      ztreeObj: null,
      //ztree配置，参照官网的配置
      setting: {
        check: {
          //树是否带复选框或者单选框
          enable: true
        },
        data: {
          simpleData: {
            //是否使用简单数据模式
            enable: true,
            //树节点id,一般是数据库后台主键
            idKey: "id",
            //父级id
            pIdKey: "pid",
            rootPId: "0"
          }
        },
        //ztree回调函数
        callback: {
          //树选择事件
          onCheck: this.ztreeOnCheck
        }
      },
      //分配权限弹框标题
      autnTitle: "",
      //控制分配权限弹框显示和隐藏
      autnDialogVisible: false,
      addRoleForm: {
        id:"",
        name: "",
        remark: ""
      },
      //对话框标题
      dialogTitle: "",
      dialogVisible: false,
      //当前页
      currentPage: 1,
      pageSize: 10,
      //总条数
      total: 0,
      roleForm: {
        roleName: ""
      },
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: "请输入角色名称"
          }
        ],
        remark: [
          {
            required: true,
            trigger: "change",
            message: "请输入角色描述"
          }
        ]
      },
      roleList: [
        // {
        //   date: "2016-05-03",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // },
        // {
        //   date: "2016-05-02",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // },
        // {
        //   date: "2016-05-04",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // },
        // {
        //   date: "2016-05-01",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // },
        // {
        //   date: "2016-05-08",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // },
        // {
        //   date: "2016-05-06",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // },
        // {
        //   date: "2016-05-07",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // }
      ]
    };
  },
  methods: {
    //查询角色列表
    async getRoleList() {
      let parm = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        title: this.roleForm.roleName
      };
      let { data: res } = await this.$http.post("/api/role/getRoleList", parm);
      if (res.code == 200) {
        this.currentPage = res.data.current;
        this.pageSize = res.data.size;
        this.roleList = res.data.records;
        this.total = res.data.total;
      }
    },
    ztreeOnCheck() {
      let checked = this.ztreeObj.getCheckedNodes(true);
      this.checkPermissions = checked;
      console.log(checked);
    },
    //树创建时
    handleCreated: function(ztreeObj) {
      console.log("加载树完成");
      this.ztreeObj = ztreeObj;

      //  let firstTree = ztreeObj.getNodes()[0];
      //默认选中第一个
      // ztreeObj.selectNode(firstTree);
      //设置节点全部展开
      ztreeObj.expandAll(true);
      //加载完自动点击第一个，加载右边表格
      // this.setting.callback.onClick(null, firstTree.id, firstTree);
    },
    //确认新增或编辑
    confirmBtn() {
      let _this = this;
      _this.$refs.addRole.validate(async valid => {
        if (valid) {
          let url = "";
          if (_this.editTag == "0"){
           url = "/api/role/addRole";
          }else{
            url = "/api/role/updateById";
          }
          let {data:res} = await _this.$http.post(url, _this.addRoleForm);
          if(res.code == 200){
            //信息提示
            _this.$message({
              message:res.msg,
              type:'success'
            })
            //刷新数据
            _this.getRoleList();
          this.dialogVisible = false;
          }else{
            _this.$message({
              message:res.msg,
              type:'error'
            })
          
          }
        }
      });
    },
    //删除按钮
    deleteRole(row) {
      let _this = this;
      this.$confirm("确认删除吗？","系统提示",{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'waring'
      }).then(async () =>{
        let parm = {
          id:row.id
        }
        let {data:res} = await _this.$http.post("/api/role/deleteRole",parm);
        if(res.code == 200){
          _this.getRoleList();
          _this.$message({
          message:res.msg,
          type:'success'
        })
        }else{
        _this.$message({
          message:res.msg,
          type:'error'
        })
        }
      })
    },
    //编辑按钮
    editRole(row) {
      this.editTag = "1";
      this.resetForm("addRole");
      this.dialogTitle = "编辑角色";
      this.dialogVisible = true;
      //查询编辑的数据
      this.getRoleById(row.id);
    },
    //根据id查询编辑角色的数据
    async getRoleById(id){
      let parm = {
        id:id
      }
      let {data:res} = await this.$http.post("/api/role/getRoleById",parm);
      if(res.code == 200){
        this.addRoleForm.if = res.data.id;
        this.addRoleForm.name = res.data.name;
        this.addRoleForm.remark = res.data.remark;
      }
    },
    searchRole() {
      this.getRoleList();
    },
    //分配角色权限按钮
    assinRole(row) {
      this.autnDialogVisible = true;
      this.roldId = row.id;
      this.autnTitle = "为【" + row.name + "】分配权限";
      this.treeDatas = [
        {
          id: 17,
          pid: 0,
          name: "系统管理",
          open: null,
          checked: true
        },
        {
          id: 18,
          pid: 17,
          name: "用户管理",
          open: null,
          checked: true
        },
        {
          id: 20,
          pid: 18,
          name: "新增",
          open: null,
          checked: true
        },
        {
          id: 21,
          pid: 18,
          name: "修改",
          open: null,
          checked: true
        },
        {
          id: 22,
          pid: 18,
          name: "删除",
          open: null,
          checked: true
        },
        {
          id: 23,
          pid: 17,
          name: "角色管理",
          open: null,
          checked: true
        },
        {
          id: 25,
          pid: 23,
          name: "新增",
          open: null,
          checked: true
        },
        {
          id: 26,
          pid: 23,
          name: "修改",
          open: null,
          checked: true
        },
        {
          id: 27,
          pid: 23,
          name: "删除",
          open: null,
          checked: true
        },
        {
          id: 28,
          pid: 17,
          name: "权限管理",
          open: null,
          checked: true
        },
        {
          id: 30,
          pid: 28,
          name: "新增",
          open: null,
          checked: true
        },
        {
          id: 31,
          pid: 28,
          name: "修改",
          open: null,
          checked: true
        },
        {
          id: 32,
          pid: 28,
          name: "删除",
          open: null,
          checked: true
        },
        {
          id: 33,
          pid: 17,
          name: "机构管理",
          open: null,
          checked: true
        },
        {
          id: 34,
          pid: 0,
          name: "商品管理",
          open: null,
          checked: true
        },
        {
          id: 36,
          pid: 34,
          name: "分类管理",
          open: null,
          checked: true
        },
        {
          id: 37,
          pid: 34,
          name: "品牌管理",
          open: null,
          checked: true
        },
        {
          id: 38,
          pid: 36,
          name: "新增",
          open: null,
          checked: true
        },
        {
          id: 39,
          pid: 36,
          name: "编辑",
          open: null,
          checked: true
        },
        {
          id: 40,
          pid: 37,
          name: "新增",
          open: null,
          checked: true
        },
        {
          id: 41,
          pid: 37,
          name: "编辑",
          open: null,
          checked: true
        },
        {
          id: 42,
          pid: 0,
          name: "系统工具",
          open: null,
          checked: true
        },
        {
          id: 43,
          pid: 42,
          name: "代码生成",
          open: null,
          checked: true
        },
        {
          id: 46,
          pid: 33,
          name: "新增",
          open: null,
          checked: true
        },
        {
          id: 76,
          pid: 33,
          name: "编辑",
          open: null,
          checked: true
        },
        {
          id: 77,
          pid: 42,
          name: "接口文档",
          open: null,
          checked: true
        },
        {
          id: 78,
          pid: 33,
          name: "删除",
          open: null,
          checked: true
        },
        {
          id: 79,
          pid: 23,
          name: "分配权限",
          open: null,
          checked: true
        },
        {
          id: 80,
          pid: 18,
          name: "分配角色",
          open: null,
          checked: true
        }
      ];
    },
    //改变每页大小
    handleSizeChange() {
      this.getRoleList();
    },
    //改变当前页
    handleCurrentChange() {
      this.getRoleList();
    },
    addRole() {
      
      this.resetForm("addRoleForm");

      this.dialogVisible = true;
      this.dialogTitle = "新增";
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-left {
  margin-left: 20px;
}
.el-main {
  padding: 0px !important;
}
</style>