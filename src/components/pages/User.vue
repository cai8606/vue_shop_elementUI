<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserListByCriteria">
            <el-button slot="append" icon="el-icon-search" @click="getUserListByCriteria"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
              <el-tag v-for="role in scope.row.roles" :key="role.id">{{role.roleName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" width="130" prop="username"></el-table-column>
        <el-table-column label="电话" width="150" prop="phone"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="260"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="primary" size="mini" @click="toUserDetail">详情</el-button>
            <el-button type="primary" size="mini" @click="showAddRoleDialog(scope.row.id)" >添加角色</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
          </template>
				</el-table-column>
      </el-table>
			<!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
				:current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 5]" :page-size="queryInfo.pagesize" 
				layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="roleDialogVisible" width="50%" :close-on-click-modal = false>
      <h3>所有角色</h3>
        <ul>
          <div v-for='(role,index) in roleList' :key='index'>
            <li v-if="!role.check">
              <el-checkbox v-model="role.check"/>>{{role.roleName}}
            </li>
          </div>
        </ul>
        <el-divider></el-divider>
        <h3>已选角色</h3>
        <ul>
          <div v-for='(role,index) in roleList' :key='index'>
            <li  v-if="role.check">
              <el-checkbox type='checkbox' v-model="role.check"></el-checkbox>{{role.roleName}}
            </li>
          </div>
       </ul>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoles">确 定</el-button>
      </span>
    </el-dialog>

		<!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal = false>
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证手机号的规则
    var checkPhone = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[5678]|18[0-9]|14[57])[0-9]{8}$/

      if (regPhone.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      userlist: [],
      total: 0,
      //角色集合
      roleList: [],
      //选中的用户id
      checkUserId: 0,
      // 控制添加角色对话框的显示与隐藏
      roleDialogVisible: false,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        phone: '',
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,max: 10,message: '用户名的长度在2~10个字符之间',trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '密码的长度在3~15个字符之间',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2,max: 10,message: '用户名的长度在2~10个字符之间',trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res }  = await this.$http.get('/user/page', {
				params: {
					query: this.queryInfo.query,
					page: this.queryInfo.pagenum,
					rows: this.queryInfo.pagesize	
				  }
			  }
		  )
      if (res.code !== 200) {
        return this.$message.error('找不到匹配的用户！')
      }
      this.userlist = res.items
      this.total = res.total
      //console.log(res)
    },
    getUserListByCriteria() {
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = 5
      this.getUserList()
    },
		// 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
		},
		// 监听添加用户对话框的关闭事件
		addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //展示添加角色的对话框
    async showAddRoleDialog(id){
      this.checkUserId = id
      const {data: res} = await this.$http.get('/user/queryRoleList?id='+id)
      if(res.statusCode!==200) return this.$message.error('获取该用户信息失败!')
      //console.log(res);
      this.roleList = res.data
      this.roleDialogVisible = true
    },
    //保存用户角色
    async saveRoles() {
      var roleIdsArr = [];
      for (var i in this.roleList) {
        if (this.roleList[i].check) {
          roleIdsArr.push(this.roleList[i].roleId)
        }
      }

      if(roleIdsArr==''||roleIdsArr.length==0){
    		return this.$message.error('请选择角色')
      }
      //console.log(" roleIds:"+roleIdsArr.join(','));
      const {data: res} = await this.$http.post('/user/saveUserRoles',this.$qs.stringify({userId: this.checkUserId, roleIds: roleIdsArr.join(',')}))
      //console.log(res);
      if(res.statusCode!==200) return this.$message.error('添加角色失败!')
      this.getUserList()
      this.$message.success('添加角色成功!')
      this.roleDialogVisible = false
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const {data: res} = await this.$http.post('/user/addUser', this.addForm)
        console.log(res);
        
        if (res.statusCode !== 201) {
          this.$message.error('添加用户失败！')
        }

        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const {data: res} = await this.$http.get('/user/queryById?id='+id)
      //console.log(res);
      if(res.statusCode !== 200) this.$message.error('查询用户信息失败!')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.post('/user/updateUser',this.editForm)
        //console.log(res);
        if(res.statusCode !== 200) this.$message.error('更新失败')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新成功')
      })
    },
    //根据id删除对用的用户信息
    removeUserById(id) {
      //弹框询问是否删除
      this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
          const {data: res} = await this.$http.get('/user/delUser?id='+id)
          //console.log(res);
          if(res.statusCode !== 200) return this.$message.error('删除失败')
          this.getUserList()
          this.$message({ 
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });       
    },
    //跳转到用户详情界面
    toUserDetail() {
      this.$router.push('/userDetail')
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-right: 17px;
}
</style>
