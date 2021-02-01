<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <!-- :closable="false" ：不可关闭 ；  show-icon ：显示图标-->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="opt_params">
        <el-col>选择商品的分类:</el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'params',

  data() {
    return {}
  },

  methods: {}
}
</script>

<style lang="less" scoped>
.opt_params {
  margin: 15px 0;
}
</style>
