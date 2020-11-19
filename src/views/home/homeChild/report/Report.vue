<template>
  <div>
    <!--   面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片-->
    <el-card class="box-card">
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>


</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
  name: "Report",
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }

    }
  },
  async mounted() {
    const {data:res } = await this.$http.get('reports/type/1')

    if (res.meta.status !== 200) {
      this.$message.error('获取数据报表失败!')
    }


    // 1.基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));

//2. 指定图表的配置项和数据
    const result = _.merge(this.options,res.data)

//3.使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  }
}
</script>

<style scoped>

</style>