<template>
  <div id="app">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div class="logo">
          <img src="../assets/heima.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <!-- 侧边栏菜单区域 -->
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409Eff" unique-opened>
            <!-- 一级菜单 -->
            <!-- 需要指定唯一的 index 属性，只接受字符串 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单模板 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>

                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级子菜单 -->
              <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                <!-- 二级菜单模板 -->
                <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体区域 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: '',
      iconsObj: {
        125: 'iconfont  icon-user',
        103: 'iconfont  icon-lock_fill',
        101: 'iconfont  icon-shangpin',
        102: 'iconfont  icon-danju',
        145: 'iconfont  icon-baobiao'
      }
    }
  },
  created() {
    // 在 created 阶段请求左侧菜单数据
    this.getMenuList()
  },
  methods: {
    logout() {
      //   console.log(1)
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  background-color: #373d41;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #ccc;
}
</style>
