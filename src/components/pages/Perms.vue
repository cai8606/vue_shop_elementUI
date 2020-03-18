<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>资源权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getPermsList()">
            <el-button slot="append" icon="el-icon-search" @click="getPermsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加权限</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="permsList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="permissionName"></el-table-column>
        <el-table-column label="URL" prop="url"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delPerms(scope.row.id)"></el-button>
					</template>
				</el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
				:current-page="queryInfo.pagenum" :page-sizes="[1 , 3, 6]" :page-size="queryInfo.pagesize" 
				layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      permsList: [],
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 6
      },
      total: 0,
    }
  },
  created() {
    this.getPermsList()
  },
  methods: {
    async getPermsList() {
      const {data: res} = await this.$http.get('/perms',{
        params: {
          query: this.queryInfo.query,
					page: this.queryInfo.pagenum,
					rows: this.queryInfo.pagesize	
        }
      })
      //console.log(res);
      if(res.code !== 200) return this.$message.error('查询权限列表失败!')
      this.permsList = res.items
      this.total = res.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getPermsList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getPermsList()
    },
    //删除
    delPerms(id) {
      this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
          const {data: res} = await this.$http.delete('/perms/'+id)
          //console.log(res)
          if (res.statusCode !== 200) {
            this.$message.error('删除失败')
          }
          this.getPermsList()
          this.$message({ type: 'success',message: '删除成功!'});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });     
    }
  }
}
</script>

<style scoped>
</style>
