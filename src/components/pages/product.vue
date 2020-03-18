<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础数据</el-breadcrumb-item>
      <el-breadcrumb-item>产品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getProductList">
            <el-button slot="append" icon="el-icon-search" @click="getProductList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加产品</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="productList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="产品号" width="100" prop="productNum"></el-table-column>
        <el-table-column label="产品名" width="100" prop="productName"></el-table-column>
        <el-table-column label="出发地" width="100" prop="cityName"></el-table-column>
        <el-table-column label="出发时间" width="150" prop="departureTime"></el-table-column>
        <el-table-column label="产品价格" width="100" prop="productPrice"></el-table-column>
        <el-table-column label="产品描述" prop="productDesc"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.productStatus" :disabled="disableChangeStatus" @change="statusChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button> 
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      total: 0,
      productList: [],
      addDialogVisible: false,
      disableChangeStatus: true,
    };
  },
  created() {
    this.getProductList();
    this.enableChangeStatus();
  },
  methods: {
    async getProductList() {
      const { data: res } = await this.$http.get("/product", {
        params: {
          query: this.queryInfo.query,
          page: this.queryInfo.pagenum,
          rows: this.queryInfo.pagesize
        }
      });
      //console.log(res);
      if (res.code !== 200) return this.$message.error("找不到匹配的产品！");
      this.productList = res.items;
      this.total = res.total;
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getProductList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage;
      this.getProductList();
    },
    async statusChanged(productInfo) {
      //console.log(productInfo);
      const {data:res} = await this.$http.get('/product/changeStatus',{params: {id: productInfo.id, status: productInfo.productStatus}})
      //console.log(res);
    },
    //查找该用户是否有修改产品状态的权限
    enableChangeStatus(){
      const permissionList = window.localStorage.getItem('permissionList')
      const permissionStr = JSON.stringify(permissionList)
      if(permissionStr.indexOf('changeStatus') > -1){
        this.disableChangeStatus = false
      }
      console.log(this.disableChangeStatus);
    }
  }
};
</script>

<style scoped>
</style>
