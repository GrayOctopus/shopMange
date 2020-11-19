<template>
  <div>
    <!--   面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图-->
    <el-card >
      <el-row :gutter="15">
<!--        输入框-->
       <el-col :span="8">
         <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
           <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
         </el-input>
       </el-col>
<!--        添加商品按钮-->
       <el-col :span="4">
         <el-button type="primary" @click="addGoods">添加商品</el-button>
       </el-col>
      </el-row>

<!--      表格区域-->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px" ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px"></el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeListById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>

      </el-table>
<!--      分页条-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
    //  请求数据的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
    //  请求到的总数据
      total: 0,
    //  请求到的商品数据
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const {data: res} = await this.$http.get('goods',{ params:this.queryInfo})
      if (res.meta.status !== 200) {
        return this.$message.error('请求商品数据失败!')
      }
      this.total = res.data.total
      this.goodsList = res.data.goods
      console.log(this.goodsList);
    },
    //监听页面显示页数改变事件
    handleSizeChange(newpage) {
      this.queryInfo.pagesize = newpage
      this.getGoodsList()
    },
  //  监听页面切换事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
  //  点击添加商品按钮跳转页面
    addGoods() {
      this.$router.push('goods/add')
    },
  //  根据id删除商品数据
    async removeListById(id) {
      const confirmRs = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmRs !== 'confirm') {
        this.$message.info('你已取消删除！')
      }
      const {data:res} = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品数据失败！')
      }
      this.$message.success('删除商品数据成功！')
      this.getGoodsList()
    }
  }
}
</script>

<style scoped>

</style>