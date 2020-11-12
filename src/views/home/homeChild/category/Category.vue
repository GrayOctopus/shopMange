<template>
  <div>
    <!--   面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片-->
    <el-card>
      <!--    添加分类按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
<!--      商品分类表格区域-->
      <tree-table class="treetable"
                  :data="cateList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  index-text="#"
                  :show-row-hover="false"
                  show-index border>
<!--        是否有效-->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false"
             style="color: lightgreen"></i>
          <i class="el-icon-error"
             v-else
             style="color: red"></i>
        </template>
<!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
<!--        操作-->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"> 删除</el-button>
        </template>

      </tree-table>
<!--      分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cateInfo.pagenum"
          :page-sizes="[1, 5, 10, 15]"
          :page-size="cateInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

<!--    添加商品分类的对话框-->
    <el-dialog
        title="添加分类"
        :visible.sync="setAddCateDialog"
        width="50%" @close="addCateDialogClosed">
<!--      添加分类的表单-->
      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               ref="addCateFormRef" label-width="100px" >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
<!--        级联选择器-->
        <el-form-item label="父级分类:">
<!--          option指定数据源-->
<!--          props级联选择器配置-->
          <el-cascader
              v-model="selectKeys"
              :options="parentCateList"
              :props="cascaderProps" @change="parentCateChange"></el-cascader>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setAddCateDialog = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
    //  商品分类数据
      cateList: [],
    //  请求参数信息
      cateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //需要展示的总商品数
      total: 0,
    //  表格各列配置
      columns: [
        {
        label: '分类名称',
        prop	: 'cat_name'
        },
        {
          label: '是否有效',
          prop	: 'cat_deleted',
          type: 'template',
          template: 'isOk',
        },
        {
          label: '排序',
          prop	: 'cat_level',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      setAddCateDialog: false,
    //  添加分类表单的数据
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
    //  添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
    //父级商品的分类数据
      parentCateList: [],
    // 级联选择器选中的哪一项
      selectKeys: [],
    //  级联选择器的配置选项
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const {data:res} = await this.$http.get('categories', {params:this.cateInfo})
      if (res.meta.status !== 200 ) {
        return this.$message.error('获取商品分类失败!')
      }
      this.cateList = res.data.result
      //  为总数据赋值
      this.total = res.data.total
    },
  //  监听分页尺寸的切换
    handleSizeChange(newpage) {
      this.cateInfo.pagesize = newpage
      this.getCateList()
    },
    //监听当前页面
    handleCurrentChange(newpage) {
      this.cateInfo.pagenum = newpage
      this.getCateList()
    },
    showAddCateDialog() {
      //先获取父级商品分类数据
      this.getParentCateList()
      //再显示添加分类的对话框
      this.setAddCateDialog = true
    },
  //  获取父级商品分类数据
    async getParentCateList() {
      const {data:res} =  await this.$http.get('categories', {params:{type:2}})
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败!')
      }
      this.parentCateList = res.data
    },
  //  监听级联表单节点变化
    parentCateChange() {
      //如果数组长度大于0
      console.log(this.selectKeys);
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length-1]
        this.addCateForm.cat_level = this.selectKeys.length
        return
      }else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
  //  添加分类
    addCate() {
    //  预处理
      this.$refs.addCateFormRef.validate(async valid => {
        if ( !valid ) return
        const {data:res} =  await this.$http.post('categories',this.addCateForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败!')
        }
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.setAddCateDialog = false
      }
      )
    },
  //  添加分类对话框关闭时，重置对话框
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style scoped>
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>