<template>
 <div>
<!--   面包屑-->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>用户管理</el-breadcrumb-item>
     <el-breadcrumb-item>用户列表</el-breadcrumb-item>
   </el-breadcrumb>
<!--   卡片-->
   <el-card class="box-card">
<!--     搜索与添加区域-->
     <el-row :gutter="20">
       <el-col :span="7">
         <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
           <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
         </el-input>
       </el-col>
       <el-col :span="4">
         <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
       </el-col>
     </el-row>
<!--     用户列表区域-->
     <el-table :data="userList" style="width: 100%" border stripe>
       <el-table-column type="index" label="#"></el-table-column>
       <el-table-column prop="username" label="姓名" ></el-table-column>
       <el-table-column prop="email" label="邮箱" ></el-table-column>
       <el-table-column prop="mobile" label="电话"></el-table-column>
       <el-table-column prop="role_name" label="角色"></el-table-column>
       <el-table-column  label="状态">
         <template slot-scope="scope">
           <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
         </template>
       </el-table-column>
       <el-table-column  label="操作" width="180px">
         <template slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
           <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)" ></el-button>
           <el-tooltip effect="dark" content="修改用户" placement="top" :enterable="false">
             <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="setRole(scope.row)"></el-button>
           </el-tooltip>
         </template>
       </el-table-column>
     </el-table>
<!--     分页-->
     <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="queryInfo.pagenum"
         :page-sizes="[1, 2, 5, 10]"
         :page-size="queryInfo.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
     </el-pagination>
   </el-card>

<!--   对话框-->
   <el-dialog
       title="添加用户"
       :visible.sync="addDialogVisible"
       width="30%" @close="addDialogClosed">
<!--     主体区域-->
<!--     验证表单-->
     <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
       <el-form-item label="用户名" prop="username">
         <el-input v-model="addForm.username"></el-input>
       </el-form-item>
       <el-form-item label="密码" prop="password">
         <el-input v-model="addForm.password"></el-input>
       </el-form-item>
       <el-form-item label="邮箱" prop="email">
         <el-input v-model="addForm.email"></el-input>
       </el-form-item>
       <el-form-item label="手机" prop="mobile">
         <el-input v-model="addForm.mobile"></el-input>
       </el-form-item>
     </el-form>
<!--     底部区域-->
     <span slot="footer" class="dialog-footer">
<!--       按钮-->
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
   </el-dialog>
<!--   展示修改用户信息的对话框-->
   <el-dialog
       title="修改用户"
       :visible.sync="editDialogVisible"
       width="30%" @close="eidtDialogClosed">
     <!--     主体区域-->
     <!--     验证表单-->
     <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
       <el-form-item label="用户名">
         <el-input v-model="editForm.username" disabled></el-input>
       </el-form-item>
       <el-form-item label="邮箱" prop="email">
         <el-input v-model="editForm.email"></el-input>
       </el-form-item>
       <el-form-item label="手机" prop="mobile">
         <el-input v-model="editForm.mobile"></el-input>
       </el-form-item>
     </el-form>
     <!--     底部区域-->
     <span slot="footer" class="dialog-footer">
<!--       按钮-->
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
   </el-dialog>

<!--   分配权限的对话框-->
   <el-dialog
       title="分配权限"
       :visible.sync="setRoleDialogVisible"
       width="50%" @close="setRoleDialogClose">
     <div>
       <p>当前用户:{{userInfo.username}}</p>
       <p>当前角色:{{userInfo.role_name}}</p>
       <p>分配新角色:
         <el-select v-model="selectedRoleId" placeholder="请选择">
         <el-option
             v-for="item in rolesList"
             :key="item.id"
             :label="item.roleName"
             :value="item.id">
         </el-option>
       </el-select></p>
     </div>
     <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmUserRole">确 定</el-button>
  </span>
   </el-dialog>

 </div>
</template>

<script>
import {getUserList} from "network/users";

export default {
  name: "Users",
  data() {
    //验证邮箱规则
    let checkEmail = (rule,value,callback) => {
      const regEmail = /^([a-zA-z0-9_-])+@([a-zA-z0-9_-])+([\.a-zA-z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'));
    }
    //验证手机号的规则
    let checkMobile = (rule,value,callback) => {
      const regEmail = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'));
    }
    return {
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //一页显示几条数据
        pagesize: 5
      },
      userList: [],
      total: 0,
      addDialogVisible:false,
      //添加表单的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加表单的验证规则
      addFormRules: {
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
    //  修改表单是否可见
      editDialogVisible: false,
    //  修改表单数据
      editForm: {},
    //  修改表单数据规则
      editFormRules: {
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
    //  分配权限的对话框是否可见
      setRoleDialogVisible: false,
    //  用户的信息
      userInfo: {},
    //  为用户分配角色的数据
      rolesList: [],
    //  下拉菜单中选中的值
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      getUserList(this.queryInfo.query,this.queryInfo.pagenum,this.queryInfo.pagesize).then( res => {
        if(res.meta.status !== 200) {
          this.$message.error('请求用户列表失败!')
        }
        this.total = res.data.total
        this.userList = res.data.users
        // console.log(res);
      })
    },
    //监听pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //监听对话框的关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //监听修改对话框的关闭
    eidtDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //改变用户状态
    async userStateChange(userinfo) {
      console.log(userinfo);
      // put(`http://timemeetyou.com:8889/api/private/v1/users/${userinfo.id}/state/${userinfo.mg_state}`).then( res => {
      //   // console.log(res);
      //   if(res.status !== 200) {
      //     userinfo.mg_state = !userinfo.mg_state
      //     return this.$message.error('更新用户状态失败!')
      //   }
      //     this.$message.success('更新用户状态成功!')
      //   }
      // )

      const  {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败!')
      }
      this.$message.success('更新用户状态成功!')

    },
    //点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        //发起添加用户的网络请求
        const {data: res} = await this.$http.post(`users`,this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        console.log(res);
        this.$message.success('添加用户成功!')
        //隐藏对话框
        this.addDialogVisible = false
        //刷新列表数据
        this.getUserList()
      })
    },
    //点击按钮弹出对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const {data:res} = await this.$http.get('users/'+id)
      if (res.meta.status !== 200) {
        this.$message.error('获取用户信息失败!')
      }
      this.editForm = res.data
      // this.editDialogVisible = false
    },
    //点击确定按钮，修改用户
    editUserInfo() {
      this.$refs.editFormRef.validate( async valid => {
        if(!valid) return
        const {data: res} = await this.$http.put('users/'+ this.editForm.id,
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile})
        if(res.meta.status !== 200) {
          this.$message.error('更新用户信息失败!')
        }
        //  关闭窗口
        this.editDialogVisible = false
        //  刷新列表
        this.getUserList()
        //  提示成功
        this.$message.success('更新用户信息成功!')
        }
      )

    },
  //  删除用户
    async removeUserById(id) {
     const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== "confirm") {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.delete('users/' + id)
      if(res.meta.status !== 200) {
        this.$message.error('删除用户信息失败!')
      }
      this.$message.success('删除用户信息成功!')
      this.getUserList()
    },
  //  分配角色
    async setRole(userInfo) {

      this.userInfo = userInfo
      const {data:res} = await this.$http.get('roles')
      if ( res.meta.status !== 200 ) {
        return this.$message.error('获取用户角色失败!')
      }
      this.rolesList = res.data
      console.log(this.rolesList);
      this.setRoleDialogVisible = true
    },
  //  确定分配角色
    async confirmUserRole() {
      if(!this.selectedRoleId) {
        return this.$message.error('请选择需要分配的角色')
      }

     const {data:res} =  await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      console.log(this.userInfo);
      if(res.meta.status !== 200) {
        return this.$message.error('分配角色失败!')
      }

      this.$message.success('分配角色成功!')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    //监听分配权限的对话框关闭
    setRoleDialogClose () {
      this.userInfo = {}
      this.selectedRoleId = ''

    }
  }
}
</script>

<style scoped>
</style>