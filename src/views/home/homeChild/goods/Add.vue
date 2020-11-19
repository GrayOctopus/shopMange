<template>
  <div>
    <!--   面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图-->
    <el-card>
      <!--      消息提示-->
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>
      <!--      步骤条-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--      左侧tab栏区域-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules"
               label-width="80px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex"
                 :before-leave="beforeTabsLeave" @tab-click="activeTab">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!--              级联选择器-->
              <el-cascader
                  v-model="addForm.goods_cat"
                  :options="goodsCateList"
                  :props="cascaderProps"
                  @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--            渲染表单的item项-->
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <!--            渲染复选框-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb"
                             v-for="(cb,i) in item.attr_vals"
                             :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id"
                          :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--            图片上传-->
            <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture" :headers="headObj"
                :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--            富文本-->
            <quill-editor v-model="addForm.goods_introduce"/>
            <!--            添加商品的按钮-->
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--    图片预览的对话框-->
    <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%">
      <img :src="imgPath" alt="" class="showImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: "Add",
  created() {
    this.getCatList()
  },
  data() {
    return {
      //  步骤条激活
      activeIndex: '0',
      //  添加表单双向绑定的数据项
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品选中的分类
        goods_cat: [],
        //  商品图片
        pics: [],
        //  商品介绍
        goods_introduce: '',
        //  商品的参数
        attrs: []
      },
      //  添加表单验证规则
      addFormRules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'},
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'},
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'},
        ],
        goods_cat: [
          {required: true, message: '请选择商品分类', trigger: 'blur'},
        ],
      },
      //  商品分类数据
      goodsCateList: [],
      //  级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //  商品动态参数数据
      manyTableData: [],
      //  商品静态属性数据
      onlyTableData: [],
      //  图片上传路径
      uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
      headObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewVisible: false,
      //  图片完整路径
      imgPath: ''
    }
  },
  methods: {
    //    获取商品分类
    async getCatList() {
      const {data: res} = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return
      }
      this.goodsCateList = res.data
    },
    //  级联选择器改变
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        return this.addForm.goods_cat = []
      }

    },
    beforeTabsLeave(activeName, oldActiveName) {
      // console.log(activeName);
      // console.log(oldActiveName);
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类!')
        return false
      }
    },
    async activeTab() {
      //  如果点击的是商品动态参数的信息,则请求商品动态参数信息
      if (this.activeIndex === '1') {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'many'}})
        if (res.meta.status !== 200) {
          return this.$message.error('请求商品动态参数信息失败!')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ?
              [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        //如果点击的是商品静态属性的信息,则请求商品静态属性信息
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'only'}})
        if (res.meta.status !== 200) {
          return this.$message.error('请求商品静态属性信息失败!')
        }
        this.onlyTableData = res.data
      }
    },
    //  图片预览
    handlePreview(file) {
      console.log(file);
      this.imgPath = file.response.data.url
      this.previewVisible = true

    },
    //图片移除
    handleRemove(file) {
      //  找寻图片所在的索引值
      const i = this.addForm.pics.findIndex(x =>
          x.pic === file.response.data.tmp_path)
      //  删除数组中的图片
      this.addForm.pics.splice(i, 1)
    },
    //  图片上传成功的事件
    handleSuccess(response) {
      const picInfo = {pic: response.data.tmp_path}
      this.addForm.pics.push(picInfo)
    },
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项!')
        }
        //    执行添加的业务逻辑
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = this.addForm.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form);
        const {data: res} = await this.$http.post(`goods`, form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      })
    }

  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 15px 10px 0 !important;
}

.showImg {
  width: 100%;
}

.addBtn {
  margin-top: 15px;
}
</style>