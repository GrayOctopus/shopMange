<template>
  <div>
    <!--   面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片区域-->
    <el-card>
<!--      警告提示-->
        <el-alert
            title="注意：只允许为第三级分类设置相关参数"
            type="warning" :closable="false" show-icon>
        </el-alert>
      <el-row class="select-opt">
       <el-col >
         <span>选择商品分类：</span>
         <el-cascader
             v-model="selectCateKeys"
             :options="cateList"
             :props="cateListProps"
             @change="handleSelectChange"></el-cascader>
       </el-col>
      </el-row>
<!--      标签页-->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled='btnIsDisabled' @click="addParamsDialogVisiable = true">添加参数</el-button>
<!--          动态参数表格-->
          <el-table :data="manyTableData" border stripe>
<!--            展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--                循环渲染的标签数据-->
                <el-tag type="primary" v-for="(item,i) in scope.row.attr_vals"
                        :key="i" closable @close="removeTag(i,scope.row)">{{item}}</el-tag>
                <!--                添加标签-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--                按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
<!--            索引列-->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEidtDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled='btnIsDisabled' @click="addParamsDialogVisiable = true">添加属性</el-button>
          <!--          静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <!--            展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--                循环渲染的标签数据-->
                <el-tag type="primary" v-for="(item,i) in scope.row.attr_vals"
                        :key="i" closable @close="removeTag(i,scope.row)" class="tagData">{{item}}</el-tag>
                <!--                添加标签-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--                按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--            索引列-->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEidtDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

<!--    添加参数的对话框-->
    <el-dialog
        :title="'添加' + this.titleText"
        :visible.sync="addParamsDialogVisiable"
        width="50%" @close="addParamsDialogClosed">
<!--     验证表单-->
      <el-form :model="addParamsForm"
               :rules="addParamsRules"
               ref="addParamsrRef"
               label-width="100px">
        <el-form-item :label="this.titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>


    <!--    修改参数的对话框-->
    <el-dialog
        :title="'修改' + this.titleText"
        :visible.sync="editParamsDialogVisiable"
        width="50%" @close="editParamsDialogClosed">
      <!--     验证表单-->
      <el-form :model="editParamsForm"
               :rules="editParamsRules"
               ref="editParamsrRef"
               label-width="100px">
        <el-form-item :label="this.titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editParams">修 改</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Params",
  created() {
    this.getCateList()
  },
  data() {
    return {
    //  选择的商品分类
      selectCateKeys: [],
    //  请求到的商品分类数据
      cateList: [],
    //  级联选择器的配置
      cateListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
    //  标签页的激活项
      activeName: 'many',
      //动态参数的数据
      manyTableData: [],
    //  静态参数的数据
      onlyTableData: [],
    //添加参数的对话框是否可见
      addParamsDialogVisiable: false,
    //  添加参数表单双向绑定数据
      addParamsForm: {},
    //  添加参数表单验证规则
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入相关参数!', trigger: 'blur' },
        ],
      },
    //  修改参数的对话框是否可见
      editParamsDialogVisiable: false,
    //  修改参数表单双向绑定数据
      editParamsForm: {},
    //  修改参数表单的验证规则
      editParamsRules: {
        attr_name: [
          { required: true, message: '请输入相关参数!', trigger: 'blur' },
        ],
      },
    //添加标签输入框是否可见
      inputVisible: false,
    //  添加标签输入框双向绑定的值
      inputValue: '',

    }
  },
  methods: {
  //  请求商品分类的数据
    async getCateList() {
      const {data:res} = await this.$http.get('categories',{params:{type:3}})
      if (res.meta.status !== 200) return
      this.cateList = res.data
    },
  //  监听选择商品分类的改变
    handleSelectChange() {
      this.getParamsData()
    },
  //  监听标签页的改变
    handleTabsClick() {
      this.getParamsData()
      console.log(this.activeName)
    },
    //获取参数的列表数据
    async getParamsData() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
      if (res.meta.status !== 200) {
        this.$message.error('获取参数列表失败!')
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data);

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
  //  监听添加参数对话框关闭
    addParamsDialogClosed() {
      this.$refs.addParamsrRef.resetFields()
    },
  //  确认添加参数
    async addParams() {
      const {data:res} =  await this.$http.post(`categories/${this.cateId}/attributes`,
          {attr_name: this.addParamsForm.attr_name,
                attr_sel: this.activeName})
      if (res.meta.status !== 201) {
        return this.$message.error('添加参数失败!')
      }
      this.$message.success('添加参数成功!')
      this.getParamsData()
      this.addParamsDialogVisiable = false
    },
  //  点击编辑按钮出现编辑框
    async showEidtDialog(attr_id) {
      this.editParamsDialogVisiable = true
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
          {params:{attr_sel:this.activeName}})
      if (res.meta.status !== 200) {
        return this.$message.error('请求参数失败！')
      }
      this.editParamsForm = res.data
    },
  //  监听修改参数对话框关闭
    editParamsDialogClosed() {
      this.$refs.editParamsrRef.resetFields()
    },
  //  确认修改参数
    editParams() {
      this.$refs.editParamsrRef.validate(async valid => {
        if (!valid) return
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
            {attr_name: this.editParamsForm.attr_name,
                  attr_sel: this.activeName})
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editParamsDialogVisiable = false
      })
    },
  //  删除当前参数
    async removeParams(attr_id) {
      const confirmRs =  await this.$confirm(
          '此操作将永久删除该参数, 是否继续?',
          '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRs !== 'confirm') {
        return this.$message.info('你取消了删除！')
      }

      const {data:res} =  await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败!')
      }
      this.$message.success('删除参数成功!')
      this.getParamsData()
    },
  //  input框的事件
    handleInputConfirm(row) {
      console.log('ok');
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
    //  如果没有输入空格则进行后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
    //  将数据发送到数据库
      this.saveAttrVals(row)
    },
  //  点击按钮显示出input框
    showInput(row) {
      row.inputVisible = true
      //文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  //删除参数下的可选项
    removeTag(i,row) {
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    },
    //封装向服务器发送改变的数据
    async saveAttrVals(row) {
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    }
  },
  computed: {
    btnIsDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectCateKeys.length == 3) {
        return this.selectCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }

}
</script>

<style scoped>
.select-opt {
  margin: 15px 0;
}

.el-tag {
  margin: 0 15px;
}

.input-new-tag {
  width: 120px;
  margin: 0 15px;
}
.button-new-tag {
  margin: 0 15px;
}

.el-tag {
  margin: 10px 15px;
}
</style>