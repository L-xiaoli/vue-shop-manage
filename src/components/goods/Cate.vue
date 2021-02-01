<template>
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类表格  -->
      <!-- 表格区域 -->
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options；指定数据源;props:指定配置对象-->
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <span
        >6666
        <!-- 编辑分类的表单 -->
        <el-form :model="editCateForm" :rules="editCateRules" ref="editCateRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <el-cascader disabled v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
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
      cateList: [],
      //总数据条数
      total: 0,
      // 为 table 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      //控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      addCateForm: {
        cat_name: '', //分类名
        cat_pid: 0, //父级分类id
        cat_level: 0 //(默认一级)0：一级分类；1：二级分类；`:三级分类
      },
      //添加分类表单规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
          //   ,
          //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      parentCateList: [], //父级分类列表
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover', //触发形式
        checkStrictly: true //允许选择父级
      },
      //选中的父级的id的数目
      selectedKeys: [],
      selectList: [],
      editDialogVisible: false,
      //编辑分类表单
      editCateForm: {
        cat_id: 0,
        cat_name: '', //分类名
        cat_pid: 0, //父级分类id
        cat_level: 0 //(默认一级)0：一级分类；1：二级分类；:三级分类
      },
      //编辑分类表单规则
      editCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      //   this.$message.success('获取商品分类成功！')
      //把获取的数据列表 赋值给cateList
      this.cateList = res.data.result
      //总条数
      this.total = res.data.total
    },
    // 监听 pagesize 变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 变化
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current
      this.getCateList()
    },
    showAddCateDialog() {
      //先获取父级分类数据列表
      this.getParentCateList()
      //弹出对话框
      this.addDialogVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      // 存一下
      this.parentCateList = res.data
    },
    //选择项发生变化触发此函数
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        //父级id为最后一项
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        //当前等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //添加分类
    addCate() {
      //   console.log(this.addCateForm)
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    //关闭对话框
    addDialogClosed() {
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    //根据id删除分类
    async removeCate(id) {
      const confirmResult = await this.$confirm('请问是否要永久删除该分类吗', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      //   console.log(id)
      if (confirmResult !== 'confirm') {
        return this.$message.error('取消删除！')
      }
      const { data: res } = await this.$http.delete(`categories/${id}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      //TODO:  解决页码的BUG.
      if (document.querySelectorAll('.el-card tbody tr').length === 1) {
        this.queryInfo.pagenum = this.queryInfo.pagenum > 1 ? this.queryInfo.pagenum - 1 : 1
      }
      this.getCateList()
    },
    //显示编辑的对话框并渲染数据
    async showEditDialog(id) {
      this.getParentCateList()
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败！')
      }
      this.editCateForm = res.data
      this.editDialogVisible = true
      this.selectList.push(res.data.cat_pid)
      if (res.data.cat_level === 2) {
        this.getLeafCate(res.data.cat_pid)
      } else {
        this.selectedKeys = this.selectList
      }
    },
    //编辑：若点击的是三级分类，还需要继续找
    async getLeafCate(pid) {
      const { data: res } = await this.$http.get(`categories/${pid}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败！')
      }
      this.selectList.push(res.data.cat_pid)

      this.selectedKeys = this.selectList.reverse()
      console.log(this.selectedKeys)
    },

    //监听修改分类对话框的关闭事件
    editDialogClosed() {
      this.$refs.editCateRef.resetFields()
      this.selectedKeys = []
      this.selectList = []
    },
    //编辑分类
    editCate() {
      this.$refs.editCateRef.validate(async (valid) => {
        if (!valid) return
        console.log(this.editCateForm.cat_id)
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, this.editCateForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类失败！')
        }
        this.$message.success('修改分类成功！')
        this.getCateList()
        this.editDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
