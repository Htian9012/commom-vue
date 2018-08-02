<template>
  <div class="app-container">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index + 1 + (pageData.currentPage - 1 )* pageData.resultNum }}
        </template>
      </el-table-column>
      <el-table-column label="帐号" width="90">
        <template slot-scope="scope">
          {{scope.row.username}}
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" width="90" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.status == 1 ? '正常' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="primary" size="small" @click="updateUser(scope.row, 1)" >启用</el-button>
          <el-button v-else type="danger" size="small" @click="updateUser(scope.row, 0)" >禁止</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页内容 -->
    <div class="pagination-container text-right">
      <el-pagination
        background
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :current-page="pageData.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageData.resultNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import UserApi from '@/api/user'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      pageData: {
        currentPage: 1, // 当前页
        resultNum: 10, // 每页条数
        total: 0 // 总条数
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = {
        pageSize: this.pageData.resultNum, // 每页显示多少条记录
        pageNum: this.pageData.currentPage// 页数
      }
      UserApi.getList(params).then(response => {
        this.list = response.list
        this.pageData.resultNum = response.pageSize
        this.pageData.currentPage = response.pageNum
        this.pageData.total = response.total
        this.listLoading = false
      })
    },
    // 切换每页显示条数
    onSizeChange(val) {
      this.pageData.resultNum = val
      this.fetchData()
    },
    // 切换当前页
    onCurrentChange(val) {
      this.pageData.currentPage = val
      this.fetchData()
    }
  }
}
</script>
