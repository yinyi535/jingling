<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //权限列表
      rightsList: [],
    };
  },
  methods: {
    async getRightsList() {
      let { data: res } = await this.axios.get("rights/list");
      if (res.meta.status == 200) {
        this.rightsList = res.data;
      } else {
        this.$message.error("获取用户权限列表失败!");
      }
    },
  },
  components: {},
  mounted() {
    // 获取所有的权限
    this.getRightsList();
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
