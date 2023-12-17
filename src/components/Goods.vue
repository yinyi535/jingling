<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="110px"
        ></el-table-column>
        <el-table-column
          width="80px"
          label="商品重量"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column width="140px" label="创建时间" prop="add_time">
          <template slot-scope="scope">{{
            scope.row.add_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
    };
  },
  methods: {
    //根据分页获取对应的商品列表
    async getGoodsList() {
      let { data: res } = await this.axios.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status == 200) {
        this.$message.success("获取商品列表成功！");
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      } else {
        this.$message.error("获取商品列表失败！");
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getGoodsList();
    },
    async removeById(id) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除!");
      }
      let { data: res } = await this.axios.delete("goods/" + id);
      if (res.meta.status == 200) {
        this.$message.success("删除商品成功!");
        this.getGoodsList();
      } else {
        console.log(res.meta);
        this.$message.error("删除商品失败！");
      }
    },
    goAddPage() {
      this.$router.push("add");
    },
  },
  components: {},
  mounted() {
    this.getGoodsList();
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
.el-table {
  font-size: 12px;
  margin: 15px;
}
</style>
