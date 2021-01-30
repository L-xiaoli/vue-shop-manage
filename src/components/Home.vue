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
        <el-aside :width="isCollpase ? '64px' : '200px'">
          <div @click="toggleCollapse" class="toggle-button ">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409Eff" unique-opened :collapse="isCollpase" :collapse-transition="false" router :default-active="activePath">
            <!-- 一级菜单 -->
            <!-- 需要指定唯一的 index 属性，只接受字符串 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单模板 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级子菜单   @click="saveNavState('/' + subItem.path)"-->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
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
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
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
      },
      //是否折叠
      isCollpase: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    // 在 created 阶段请求左侧菜单数据
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
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
    },
    toggleCollapse() {
      //点击切换
      this.isCollpase = !this.isCollpase
    }
  },
  watch: {
    $route(to, from) {
      this.activePath = window.sessionStorage.getItem('activePath')
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
    .iconfont {
      margin-right: 10px;
    }
  }
}
.el-main {
  background-color: #ccc;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
