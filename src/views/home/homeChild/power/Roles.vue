<template>
  <div>
    <!--   面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图-->
    <el-card>
      <!--      添加角色按钮-->
      <el-row>
       <el-col>
         <el-button type="primary">添加角色</el-button>
       </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
<!--        展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
                v-for="(item1,i1) in scope.row.children"
                :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']">
<!--              渲染一级权限-->
             <el-col :span="5">
               <el-tag closable
                       @close="removeRolesById(scope.row,item1.id)">{{item1.authName}}</el-tag>
               <i class="el-icon-caret-right"></i>
             </el-col>
<!--              渲染二级和三级权限-->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children"
                        :key="item2.id"
                        :class="[i2 === 0 ? '' : 'bdtop','vcenter']">
                 <el-col :span="6" >
                   <el-tag type="success" closable
                           @close="removeRolesById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                   <i class="el-icon-caret-right"></i>
                 </el-col>
                 <el-col :span="18">
                   <el-tag type="warning "
                           v-for="item3 in item2.children"
                           :key="item3.id" closable @close="removeRolesById(scope.row,item3.id)">
                     {{item3.authName}}
                   </el-tag>
                 </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>
              {{scope.row}}
            </pre>
          </template>
        </el-table-column>
<!--        索引列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" ></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

<!--    分配权限的对话框-->
    <el-dialog
        title="分配权限"
        :visible.sync="rightDialogVisible"
        width="50%" @close="setRightDialogClosed">
<!--      树形结构-->
      <el-tree :data="rightList"
               :props="treeProps"
               node-key="id"
               :default-checked-keys="defKeys"
               ref="treeRef"
               default-expand-all show-checkbox></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      roleList: [],
      //分配权限的对话框是否可见
      rightDialogVisible: false,
      //所有权限设置
      rightList:[],
    //  树形控件属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
    // 默认选中的复复选框
      defKeys: [],
    //  当前即将分配权限的用户id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
       return  this.$message.error('获取角色列表失败!')
      }
      this.roleList = res.data
    },
    async removeRolesById(role,rightID) {
      const confirmRs =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch( error => error)

      if (confirmRs !== 'confirm') {
        return this.$message.info('你已经取消了删除')
      }

      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightID}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除权限失败!')
      }

      role.children = res.data
    },
    async showRightDialog(role) {
      this.roleId = role.id
      const{data:res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限失败!')
      }
      this.rightList = res.data
      //获取三级权限的id
      this.getLeafKeys(role,this.defKeys)
      this.rightDialogVisible = true
    },
    //通过递归方式获取三级权限下的id，并保存到数组中
    getLeafKeys(node,arr) {
    //  如果不存在子节点
      if(!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      })
    },
  //  分配权限对话框关闭刷新默认选中数组
    setRightDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data:res} =  await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status !== 200) {
        return this.$message.error('更新权限失败!')
      }
      this.$message.success('更新权限成功!')
      this.getRolesList()
      this.rightDialogVisible = false
    }
  }
}
</script>

<style scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>