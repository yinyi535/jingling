<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <el-card>
      <!-- 头部警告区 -->
      <el-alert
        :closable="false"
        title="注意！只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :props="cateProps"
            :options="cateList"
            class="span"
            expand-trigger="hover"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环展示tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
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
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环展示tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
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
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数和添加属性的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <!-- 内容区域 -->
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <!-- 内容区域 -->
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //商品分类列表
      cateList: [],
      //级联选择框配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择框双向绑定的数组
      selectedCateKeys: [],
      //被激活的页签的名称
      activeName: "many",
      //动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      //控制添加参数和属性的对话框显示与隐藏
      addDialogVisible: false,
      // 添加参数的数据对象
      addForm: {},
      //添加对话框的验证规则
      addFormRules: {
        attr_name: {
          required: true,
          message: `请输入参数名称`,
          trigger: "blur",
        },
      },
      //控制修改对话框的显示与隐藏
      editDialogVisible: false,
      //修改的表单数据
      editForm: {},
      //修改对话框的验证规则
      editFormRules: {
        attr_name: {
          required: true,
          message: `请输入参数名称`,
          trigger: "blur",
        },
      },
      //控制文本框和按钮的显示与隐藏
      inputVisible: false,
      //文本框中输入的内容
      inputValue: "",
    };
  },
  methods: {
    //获取所有的商品分类
    async getCateList() {
      let { data: res } = await this.axios.get("categories");
      if (res.meta.status == 200) {
        this.cateList = res.data;
      } else {
        this.$message.error("获取商品分类失败!");
      }
    },
    //级联选择框选中项变化时触发
    handleChange() {
      this.getParamsData();
    },
    //tab页签点击事件处理函数
    handleTabClick() {
      this.getParamsData();
    },
    //获取参数的列表数据
    async getParamsData() {
      //证明选中的数组不是三级分类
      if (this.selectedCateKeys.length != 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      //根据所选分类的id和当前所处的面板，获取对应的参数
      let { data: res } = await this.axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status == 200) {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split("，") : [];
          //控制文本框的显示与隐藏
          item.inputVisible = false;
          //文本框中输入的值
          item.inputValue = "";
        });
        if (this.activeName == "many") {
          this.manyTableData = res.data;
        } else {
          this.onlyTableData = res.data;
        }
      } else {
        this.$message.error("获取参数列表失败");
      }
    },
    // 添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击确定提交参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        let { data: res } = await this.axios.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status == 201) {
          this.$message.success("添加参数成功!");
          this.getParamsData();
          this.addDialogVisible = false;
        } else {
          this.$message.error("添加参数失败!");
        }
      });
    },
    //点击按钮展示修改的对话框
    async showEditDialog(id) {
      //查询当前参数的信息
      let { data: res } = await this.axios.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status == 200) {
        this.editForm = res.data;
        this.editDialogVisible = true;
      } else {
        this.$message.error("获取参数信息失败!");
      }
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定,提交修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        let { data: res } = await this.axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status == 200) {
          this.$message.success("修改参数成功!");
          this.getParamsData();
        } else {
          this.$message.error("修改参数失败!");
        }
      });
      this.editDialogVisible = false;
    },
    //根据id删除对应的参数
    async removeParams(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
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
      let { data: res } = await this.axios.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status == 200) {
        this.$message.success("参数删除成功!");
        this.getParamsData();
      } else {
        this.$message.error("参数删除失败!");
      }
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //如果没有return则说明输入的内容需要做后续的处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //发起请求保存这次的操作
      let { data: res } = await this.axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join("，"),
        }
      );
      if (res.meta.status == 200) {
        this.$message.success("修改参数项成功！");
      } else {
        this.$message.error("修改参数项失败！");
      }
    },
    //文本框与按钮切换
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获得焦点
      //nextTick的作用，当页面元素重新渲染后才会执行回调函数中的内容
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
      this.saveAttrVals(row);
    },
    //将attr_vals的操作保存到数据库
    async saveAttrVals(row) {
      let { data: res } = await this.axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join("，"),
        }
      );
      if (res.meta.status == 200) {
        this.$message.success("修改参数项成功！");
      } else {
        this.$message.error("修改参数项失败！");
      }
    },
    //文本框与按钮切换
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获得焦点
      //nextTick的作用，当页面元素重新渲染后才会执行回调函数中的内容
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
  },
  components: {},
  mounted() {
    this.getCateList();
  },
  computed: {
    // 如果按钮需要被禁用,就返回true,否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length != 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    //添加按钮标题
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
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
.cat_opt {
  margin-top: 15px;
  .span {
    width: 250px;
    margin-left: 10px;
  }
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 5px 20px;
}
.input-new-tag {
  width: 120px;
}
</style>