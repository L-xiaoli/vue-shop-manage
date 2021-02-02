<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader :options="cateList" :props="cateProps" v-model="selectedCateKeys" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 标签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true" class="opt_params">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行的操作 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{ item }}</el-tag>
                <!-- 输入文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true" class="opt_params">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行的操作 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数/静态属性对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',

  data() {
    return {
      cateList: [], //商品分类列表，
      selectedCateKeys: [], // // 级联选择框双向绑定到的数组
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover', //触发形式
        checkStrictly: true //允许选择父级
      },
      //Tab页签打开的名称（默认打开many）
      activeName: 'many', // 被激活的页签的名称
      manyTableData: [], // 动态参数的数据
      onlyTableData: [], // 静态属性的数据
      addDialogVisible: false, //添加动态参数/静态属性的表单数据对象

      // 添加动态参数/静态属性的表单数据对象
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      editDialogVisible: false, //添加动态参数/静态属性的表单数据对象
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
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
    // 级联选择框选中项变化会触发
    handleChange() {
      this.getParamsData()
    },
    // Tab 页签点击时触发
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        // 证明选中的不是 3 级分类
        this.selectedCateKeys = []
        return false
      }
      // 确定了选中的是 3 级分类。根据所选分类的 ID，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      // 对参数下的可选项数据进行加工
      res.data.forEach((item) => {
        // ''.split(' ') => ['']
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        //给每一行添加的单独的inputVisible、inputValue
        item.inputVisible = false
        item.inputValue = ''
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      console.log(this.activeName)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    // 点击按钮，添加参数
    addParams() {
      // console.log(this.activeName)
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 监听添加对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，展示修改参数的对话框
    async showEditDialog(attrId) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置修改参数的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
          attr_vals: this.editForm.attr_vals // !把之前的带上，防止把之前的清空（修改名称时的一个小bug(原名称下的参数会被清空)
        })
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    // 根据 ID 删除对应的参数项
    async removeParams(attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    //点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true
      //让文本自动获取焦点
      //$nextTick作用：当页面上的元素重新渲染后，才会调用此函数
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本失去焦点或按回车会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      //赋值给attr_vals
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      this.saveAttrVals(row) //调用http请求函数
    },
    // 发起http请求保存attr_vals
    async saveAttrVals(row) {
      //发起请求，保存数据
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加参数可选项失败！')
      }
      this.$message.success('添加参数可选项成功！')
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row) //调用http请求函数
    }
  },
  computed: {
    // 函数返回值：禁用true，不禁用false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的 3 级分类的 ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        console.log(this.selectedCateKeys[2])
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
