<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "@/js/echarts.js";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  components: {},
  async mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    let { data: res } = await this.axios.get("reports/type/1");
    if (res.meta.status != 200) {
      return this.$message.error("获取折线图数据失败！");
    }
    // var option = {};
    const result = _.merge(res.data, this.options);
    myChart.setOption(result);
  },
};
</script>

<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
  font-size: 12px;
  span {
    color: white !important;
  }
  .is-link:hover {
    color: aqua !important;
  }
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2) !important;
  .el-table {
    margin-top: 15px;
    font-size: 12px;
    margin-bottom: 15px;
  }
}
</style>
