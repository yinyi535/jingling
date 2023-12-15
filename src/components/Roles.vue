<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', 'aligncenter', i1 == 0 ? 'bdtop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['bdtop', 'aligncenter', i2 == 0 ? 'bdnone' : '']"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      @close="addDialogClosed"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <!-- 主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      width="50%"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightDialogVisable"
      width="50%"
      @close="SetRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      rolesList: [],
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改角色对话框的显示与隐藏
      editDialogVisible: false,
      //控制分配权限对话框的显示与隐藏
      SetRightDialogVisable: false,
      //添加角色的表单数据
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      //添加角色的规则
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      //修改角色的表单数据
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      //所有权限的数据
      rightsList: [],
      //树形控件的属性绑定
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中的id值数组
      defKeys: [],
      //当前即将分配权限的角色id
      roleId: "",
    };
  },
  methods: {
    //获取所有角色的列表
    async getRolesList() {
      let { data: res } = await this.axios.get("roles");
      if (res.meta.status == 200) {
        this.rolesList = res.data;
      } else {
        this.$message.error("获取角色列表失败!");
      }
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 提示是否要删除权限;
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("取消了删除");
      }
      let { data: res } = await this.axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status == 200) {
        // this.getRolesList();
        role.children = res.data;
      } else {
        this.$message.error("删除权限失败!");
      }
    },
    //修改角色信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          //发起修改用户信息的请求
          let { data: res } = await this.axios.put(
            "roles/" + (this.editForm.roleId - 0),
            {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc,
            }
          );
          if (res.meta.status == 200) {
            this.$message.success("更新角色信息成功");
            //重新获取用户数据
            this.getRolesList();
          } else {
            return this.$message.error("更新角色信息失败!");
          }
          this.editDialogVisible = false;
        } else {
          return;
        }
      });
    },
    // 修改角色对话框关闭后重置内容
    editDialogClosed(id) {
      this.$refs.editFormRef.resetFields();
    },
    // 点击修改弹出对话框
    async showEditDialog(id) {
      let { data: res } = await this.axios.get("roles/" + id);
      if (res.meta.status == 200) {
        this.editForm = res.data;
      } else {
        this.$message.error("查询角色信息失败!");
      }
      this.editDialogVisible = true;
    },
    //根据id删除对应的角色信息
    async removeRolesById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: res } = await this.axios.delete("roles/" + id);
      if (res.meta.status == 200) {
        this.$message.success("删除角色成功");
        this.getRolesList();
      } else {
        this.$message.error("删除角色失败");
      }
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      let { data: res } = await this.axios.get("rights/tree");
      if (res.meta.status == 200) {
        this.rightsList = res.data;
      } else {
        this.$message.error("获取角色权限失败!");
      }
      this.getLeafKeys(role, this.defKeys);
      this.SetRightDialogVisable = true;
    },
    //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    //监听分配权限对话框的关闭事件
    SetRightDialogClosed() {
      this.defKeys = [];
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      let { data: res } = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: idStr,
      });
      if (res.meta.status == 200) {
        this.$message.success("分配角色权限成功");
        this.getRolesList();
        this.SetRightDialogVisable = false;
      } else {
        this.$message.error("分配角色权限失败");
      }
    },
    //监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击确定，添加新角色
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          let { data: res } = await this.axios.post("roles", this.addForm);
          if (res.meta.status == 201) {
            this.$message.success("添加用户成功!");
            console.log(this.addForm);
            //重新获取角色数据
            this.getRolesList();
          } else {
            this.$message.error("添加角色失败!");
          }
          // console.log(res.status);

          this.addDialogVisible = false;
        } else {
          return;
        }
      });
    },
  },
  components: {},
  mounted() {
    this.getRolesList();
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
    .el-tag {
      margin: 7px;
    }
  }
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdnone {
  border: none !important;
}
.aligncenter {
  display: flex;
  align-items: center;
}
</style>
