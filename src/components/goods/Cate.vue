<template>
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Cate',

  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类列表
      catelist: [],
      //总数据条数
      total: 0
    }
  },
  created() {
    this.getCazteList()
  },

  methods: {
    async getCazteList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.$message.success('获取商品分类成功！')
      //把获取的数据列表 赋值给catelist
      this.catelist = res.data.result
      //总条数
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped></style>
