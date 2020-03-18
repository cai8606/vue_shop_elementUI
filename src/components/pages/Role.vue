<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo" clearable @clear="getRoleList">
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--授权按钮 -->
            <el-button type="primary" size="mini" @click="showSetPermsDialog(scope.row.id)">授权</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRole(scope.row.id)"></el-button>
					</template>
				</el-table-column>
      </el-table>
    </el-card>

    <!-- 修改角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色授权的对话框 -->
    <el-dialog title="角色授权" :visible.sync="setPermsDialogVisible" width="50%">

      <el-tree :data="permsList" :props="defaultProps" show-checkbox node-key="id"
      :default-checked-keys="checkKeys" :default-expand-all="true" ref="treeRef"></el-tree>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="setPermsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotPerms">确 定</el-button> 
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      queryInfo: '',
      editForm: {},
      editDialogVisible: false,
      editFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2,max: 10,message: '角色名的长度在2~10个字符之间',trigger: 'blur' }
        ],
      },
      setPermsDialogVisible: false,
      permsList: [],
      defaultProps: {
          children: 'children',
          label: 'permsName'
      },
      checkKeys:[],
      checkRoleId: 0,
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const {data: res} = await this.$http.get('/role/findAll',{params: {queryInfo: this.queryInfo}})
      //console.log(res);
      if(res.statusCode !== 200) return this.$message.error('获取用户列表失败')
      this.rolelist = res.data
    },
    //删除角色
    delRole(id) {
      this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
          const res = await this.$http.delete('/role/del?id='+id)
          //console.log(res)
          this.getRoleList()
          this.$message({ type: 'success',message: '删除成功!'});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });     
    },
    //控制编辑对话框的关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //控制编辑对话框的展示
    async showEditDialog(id) {
      const {data: res} = await this.$http.get('/role/findById?id='+id)
      //console.log(res);
      if(res.statusCode !== 200) return this.$message.error('查询该用户信息失败!')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //修改角色信息
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.post('/role/update',this.editForm)
        console.log(res);
        if(res.statusCode !== 200) return this.$message.error('修改失败!')
        this.editDialogVisible = false
        this.getRoleList()
        this.$message.success('更新成功')
      })
    },
    async showSetPermsDialog(id) {
      const {data: res} = await this.$http.get('/role/perms?id='+id)
      //console.log(res);
      this.permsList = res.data.list
      this.checkKeys = res.data.checkPermsId
      //console.log(this.checkKeys)
      this.checkRoleId = id
      this.setPermsDialogVisible = true
    },
    async allotPerms() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      //console.log(keys.join(','));
      const {data: res} = await this.$http.post('/role/addPerms',this.$qs.stringify({roleId: this.checkRoleId,permsIds: keys.join(',')}))
      console.log(res);
      if(res.statusCode!==200) return this.$message.error("角色授权失败!")
      this.$message.success("角色授权成功!")
      this.setPermsDialogVisible = false
    },
  }
}
</script>

<style scoped>
</style>
