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
         <el-input placeholder="请输入内容" >
           <el-button slot="append" icon="el-icon-search"></el-button>
         </el-input>
       </el-col>
       <el-col :span="4">
         <el-button type="primary">添加用户</el-button>
       </el-col>
     </el-row>
<!--     用户列表区域-->
     <el-table :data="userList" style="width: 100%" border stripe>
       <el-table-column type="index"></el-table-column>
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
         <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
         <el-tooltip effect="dark" content="修改用户" placement="top" :enterable="false">
           <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
         </el-tooltip>
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

 </div>
</template>

<script>
import {getUserList} from "network/users";
import {put} from "network/put";

export default {
  name: "Users",
  data() {
    return {
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //可以显示多少页
        pagesize: 2
      },
      userList: [],
      total: 0
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
    //改变用户状态
    userStateChange(userinfo) {
      console.log(userinfo);
      put(userinfo.id,userinfo.mg_state).then( res => {
        // console.log(res);
        if(res.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新用户状态失败!')
        }
          this.$message.success('更新用户状态成功!')
        }
      )
    }
  }
}
</script>

<style scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0,0,0,0.15);
}
.el-breadcrumb {
  margin-bottom: 10px;
  font-size: 14px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>