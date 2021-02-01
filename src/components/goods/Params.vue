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
        <el-col>
          <span>选择商品的分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader v-model="selectedCateKeys" :props="cateProps" :options="cateList" @change="handleChange" props.expandTrigger="hover"></el-cascader>
        </el-col>
      </el-row>
      <!-- Tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="first">动态参数</el-tab-pane>
        <el-tab-pane label="静态属性" name="second">静态属性</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'params',

  data() {
    return {
      cateList: [], //商品分类列表，
      selectedCateKeys: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //Tab页签打开的名称（默认打开first）
      activeName: 'first'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data
    },
    //级联选择框中项变化，会触发
    handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        //   选中的不是三级
        this.selectedCateKeys = []
        return
      }
      this.$message.info('三级的选项')
      console.log(this.selectedCateKeys)
    },
    handleTabClick() {
      console.log(this.activeName)
    }
  }
}
</script>

<style lang="less" scoped>
.opt_params {
  margin: 15px 0;
}
.el-cascader {
  margin-left: 20px;
  width: 250px;
}
</style>
