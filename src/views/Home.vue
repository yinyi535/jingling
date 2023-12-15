<template>
  <div class="homeBox">
    <el-container>
      <el-header>
        <div class="left">
          <img
            @click="goHome()"
            src="@/assets/jingling_logo.0ada255b.png"
            alt=""
          />
          <span class="title">精灵购物平台管理系统</span>
        </div>
        <div class="right">
          <el-popconfirm title="确定要退出登录?" @confirm="loginOut">
            <i class="el-icon-switch-button" slot="reference"></i>
          </el-popconfirm>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '65px' : '200px'">
          <div class="collapse" @click="changeCollapse">|||</div>
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#303641"
            text-color="#fff"
            active-text-color="rgb(52, 158, 255)"
            unique-opened
            :router="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.path"
              v-for="(item, index) in menus"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconList[index]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="childItem.path"
                v-for="childItem in item.children"
                :key="childItem.id"
                :route="{ path: '/home/' + childItem.path }"
                @click="saveNavState(childItem.path)"
              >
                <i class="el-icon-menu"></i
                ><span>{{ childItem.authName }}</span></el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      menus: [],
      // 一级菜单图标
      iconList: [
        "el-icon-s-goods",
        "el-icon-s-help",
        "el-icon-s-cooperation",
        "el-icon-s-shop",
        "el-icon-s-claim",
      ],
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  methods: {
    // 点击logo返回欢迎页
    goHome() {
      this.$router.push({ path: "/home" }).catch((erro) => "");
    },
    // 退出登录
    loginOut() {
      sessionStorage.removeItem("token");
      this.$router.push({ path: "/login" }).catch((erro) => "");
    },
    // 获取数据
    async getMenus() {
      let { data: res } = await this.axios.get("/menus");
      if (res.meta.status == 200) {
        this.menus = res.data;
      }
    },
    // 控制是否折叠
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存被激活的链接地址
    saveNavState(activePath) {
      sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
  components: {},
  mounted() {
    this.getMenus();
    this.activePath = sessionStorage.getItem("activePath");
  },
};
</script>

<style scoped lang="less">
.homeBox {
  width: 100%;
  height: 100vh;
  .el-header {
    width: 100%;
    height: 60px;
    background-color: #353c3e;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      img {
        height: 50px;
        &:hover {
          cursor: pointer;
        }
      }
      .title {
        font-size: 20px;
        letter-spacing: 5px;
        margin-left: 20px;
        font-family: "宋体";
        color: white;
      }
    }
    .right {
      .el-icon-switch-button {
        font-size: 30px;
        color: white;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .el-container {
    .el-aside {
      height: calc(100vh - 60px);
      background-color: #303641;
      .el-menu {
        border: none;
      }
      &::-webkit-scrollbar {
        // 整个滚动条
        width: 0; // 纵向滚动条的宽度
        background: rgba(213, 215, 220, 0.3);
        border: none;
      }
      &::-webkit-scrollbar-track {
        // 滚动条轨道
        border: none;
      }
      .collapse {
        text-align: center;
        color: white;
        letter-spacing: 5px;
        height: 50px;
        line-height: 50px;
        background-color: #292d34;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .el-main {
      background: url("@/assets/bj.be0436d4.jpg");
      height: calc(100vh - 60px);
    }
  }
}
</style>
