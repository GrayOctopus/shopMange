<template>
  <div>
    <!--   面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片区域-->
    <el-card>
      <!--      搜索框-->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--      表格区域-->
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddressDialog = true"></el-button>
            <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showProgess"></el-button>
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

    <!--    修改地址对话框-->
    <el-dialog
        title="修改地址"
        :visible.sync="editAddressDialog"
        width="50%" @close="editAddressDialogClosed">
      <!--      验证表单-->
      <el-form ref="editAddressRef" :model="editAddress" label-width="100px" :rules="editAddressRules">
        <el-form-item label="省市区/县" prop="address1">
          <!--         级联选择器-->
          <el-cascader
              v-model="editAddress.address1"
              :options="cityData"
              :props="cascaderProps"
              @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddress.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editAddressDialog = false">取 消</el-button>
    <el-button type="primary" @click="editAddressDialog = false">确 定</el-button>
  </span>
    </el-dialog>

    <!--    展示物流信息的对话框-->
    <el-dialog
        title="物流信息"
        :visible.sync="progessDialog"
        width="50%">
<!--      时间线-->
<!--      <el-timeline :reverse="reverse">-->
<!--        <el-timeline-item-->
<!--            v-for="(activity, index) in activities"-->
<!--            :key="index"-->
<!--            :timestamp="activity.timestamp">-->
<!--          {{activity.content}}-->
<!--        </el-timeline-item>-->
<!--      </el-timeline>-->
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'

export default {
  name: "Order",
  created() {
    this.getOrderList()
  },
  data() {
    return {
      //  请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //  订单数据
      ordersList: [],
      //  总订单数
      total: 0,
      //  城市
      cityData,
      editAddressDialog: false,
      //  表单双向绑定数据
      editAddress: {
        address1: [],
        address2: ''
      },
      //  表单验证规则
      editAddressRules: {
        address1: [
          {required: true, message: '请输入省市区/县', trigger: 'blur'},
        ],
        address2: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
        ],
      },
      //  级联选择器的配置
      cascaderProps: {
        expandTrigger: 'hover',
      },
      progessDialog: false,
      progessData: []

    }
  },
  methods: {
    async getOrderList() {
      const {data: res} = await this.$http.get(`orders`, {params: this.queryInfo})
      if (res.meta.status !== 200) return
      this.ordersList = res.data.goods
      this.total = res.data.total

    },
    handleSizeChange(newpage) {
      this.queryInfo.pagesize = newpage
      this.getOrderList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    handleChange(index) {
      console.log(index);
    },
    editAddressDialogClosed() {
      this.$refs.editAddressRef.resetFields()
    },
    async showProgess() {
      const {data:res} = await this.$http.get(`/kuaidi/1106975712662`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败!')
      }
      this.$message.success('获取物流信息成功!')
      this.progessData = res.data
      console.log(this.progessData);
      this.progessDialog = true
    }
  },

}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>