<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- ！搜索与添加区域 -->
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表(表格)区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="120px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="添加时间" prop="add_time" width="170px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="ShowEditDialog(scope.row.goods_id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

      <!-- 修改的对话框 -->

      <el-dialog title="修改商品信息" :visible.sync="editDialogVisible" width="70%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="auto">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input type="textarea" v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item :label="item.attr_name" :key="item.id" v-for="item in editForm.attrs">
            <el-input v-model="item.attr_value"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button @click="editGood" type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Lists',

  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0,
      editDialogVisible: false,
      editForm: {
        goods_id: 0,
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        attrs: []
      },
      editFormRules: {
        goods_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请选择活动区域', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败！')
      }

      this.$message.success('获取商品列表数据成功！')
      this.goodsList = res.data.goods
      this.total = res.data.total
      this.pagenum = res.data.pagenum
    },
    handleSizeChange(newSize) {
      //当页号发生改变时，更改pagesize，重新请求
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      //当页码发生改变时，更改pagesize，重新请求
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async ShowEditDialog(id) {
      const { data: res } = await this.$http.get(`goods/${id}`)
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('修改商品失败')
      }
      console.log(res)
      this.$message.success('修改商品成功')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    async editGood() {
      const { data: res } = await this.$http.put('goods/' + this.editForm.goods_id, this.editForm)
      this.editDialogVisible = false
      this.getGoodsList()
    },
    async removeGoodsById(id) {
      const confirmResult = await this.$confirm('请问是否要永久删除该用户', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        //(confirm)取消删除
        return this.$message.error('取消删除操作')
      }
      //确认删除：进行删除操作
      const { data: res } = await this.$http.delete('goods/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除商品失败！')
      }
      this.$message.success('删除用户成功')
      //TODO:  解决BUG:最后页码的最后一页
      if (document.querySelectorAll('.el-card tbody tr').length === 1) {
        this.queryInfo.pagenum = this.queryInfo.pagenum > 1 ? this.queryInfo.pagenum - 1 : 1
      }
      //重新请求最新的数据
      this.getGoodsList()
    },
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
