<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效列 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color: green"
            v-if="scope.row.cat_deleted == false"
            class="el-icon-success"
          ></i>
          <i style="color: red" v-else class="el-icon-error"></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页器区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKeys"
            :options="ParentCateList"
            :props="cascaderProps"
            expand-trigger="hover"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        label-width="100px"
        ref="editFormRef"
        :rules="editFormRules"
      >
        <el-form-item label="分类名称:">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //商品分类的列表
      cateList: [],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //将当前列定义为模版列
          type: "template",
          // 表示当前列使用的模版名称
          template: "isok",
        },
        {
          label: "排序",
          //将当前列定义为模版列
          type: "template",
          // 表示当前列使用的模版名称
          template: "order",
        },
        {
          label: "操作",
          //将当前列定义为模版列
          type: "template",
          // 表示当前列使用的模版名称
          template: "opt",
        },
      ],
      //控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据
      addCateForm: {
        //将要添加的分类名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        //分类等级，默认是一级
        cat_level: 0,
      },
      //添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类的列表
      ParentCateList: [],
      //指定级联选择器
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //选中的父级分类的id数组
      selectedKeys: [],
      //控制修改分类对话框的显示与隐藏
      editCateDialogVisible: false,
      //查询到的分类信息对象
      editForm: {},
      //修改分类的规则
      editFormRules: {
        cat_name: {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
      },
    };
  },
  methods: {
    // 获取商品数据
    async getCateList() {
      let { data: res } = await this.axios.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status == 200) {
        //把数据列表赋值给cateList
        this.cateList = res.data.result;
        this.total = res.data.total;
      } else {
        this.$message.error("商品列表获取失败!");
      }
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum的改变
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    //点击弹出添加分类对话框
    showAddDialogVisible() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //获取父级分类的数据列表 getParentCateList
    async getParentCateList() {
      let { data: res } = await this.axios.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status == 200) {
        this.ParentCateList = res.data;
      } else {
        this.$message.error("获取父级分类失败!");
      }
    },
    // 选择项发生变化触发这个函数
    parentCateChange() {
      //selectedKeys中的length大于0就说明选中了父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        //父级分类的id
        this.addCateForm.cat_pid = 0;
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (valid) {
          let { data: res } = await this.axios.post(
            "categories",
            this.addCateForm
          );
          if (res.meta.status == 201) {
            this.$message.success("添加分类成功");
            this.getCateList();
            this.addCateDialogVisible = false;
          } else {
            this.$message.error("添加分类失败!");
          }
        } else {
        }
      });
    },
    // 监听添加分类对话框关闭事件
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    //关闭修改分类对话框后重置内容
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //展示编辑角色的对话框
    async showEditDialog(id) {
      let { data: res } = await this.axios.get("categories/" + id);
      if (res.meta.status == 200) {
        this.editForm = res.data;
      } else {
        this.$message.error("查询分类信息失败!");
      }
      this.editCateDialogVisible = true;
    },
    //修改分类并提交
    editCateInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          let { data: res } = await this.axios.put(
            "categories/" + this.editForm.cat_id,
            { cat_name: this.editForm.cat_name }
          );
          if (res.meta.status == 200) {
            this.$message.success("分类信息更新成功!");
            this.getCateList();
          } else {
            this.$message.error("分类信息更新失败!");
          }
          this.editCateDialogVisible = false;
        } else {
          return;
        }
      });
    },
    //根据cate_id删除对应的分类信息
    async removeCateById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.axios.delete("categories/" + id);
      if (res.meta.status == 200) {
        this.$message.success("删除分类成功");
        this.getCateList();
      } else {
        this.$message.error("删除分类失败");
      }
    },
  },
  components: {},
  mounted() {
    this.getCateList();
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
.el-row {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
