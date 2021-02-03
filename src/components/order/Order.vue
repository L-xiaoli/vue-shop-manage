<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 订单数据表格 -->
      <el-row>
        <el-table :data="orderList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"> </el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template slot-scope="scope">
              {{ scope.row.create_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="addAdress"></el-button>
              <!-- 定位 -->
              <el-button type="success" icon="el-icon-location" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      <!-- 修改地址的对话框 -->
      <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader v-model="addressForm.address1" :options="cityDate"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityDate from './citydata.js'

export default {
  name: 'order',

  data() {
    return {
      //获取查询订单信息的参数
      queryInfo: {
        query: '',
        pagenum: 1, //当前页
        pagesize: 10
      },
      total: 0, //数据总条数,
      orderList: [], //订单数据列表
      currentPage: 1,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县!', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址!', trigger: 'blur' }]
      },
      addressFormRef: {},
      cityDate
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获得订单数据列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败!')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    //页码大小发生变化触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 当前页生变化触发
    handleCurrentChange(newCurret) {
      this.pagenum = newCurret
      this.getOrderList()
    },
    //添加地址的对话框
    addAdress() {
      this.addressVisible = true
    },
    handleChange() {},
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
