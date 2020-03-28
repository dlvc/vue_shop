<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 功能区 -->
      <el-row :gutter="40">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- table展示区 -->
      <el-row>
        <el-col>
          <el-table :data="userList" border>
            <el-table-column type="index" label="ID"></el-table-column>
            <el-table-column prop="username" label="姓名"> </el-table-column>
            <el-table-column prop="email" label="邮箱"> </el-table-column>
            <el-table-column prop="mobile" label="电话"> </el-table-column>
            <el-table-column prop="role_name" label="角色"> </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="
                    userStateChange({
                      id: scope.row.id,
                      state: scope.row.mg_state
                    })
                  "
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeUserById(scope.row.id)"
                ></el-button>
                <!-- 分配角色按钮 -->
                <el-tooltip
                  effect="light"
                  content="分配角色"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="warning"
                    icon="el-icon-setting"
                    size="mini"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 分页区域 -->
      <el-row style="margin-top: 15px;">
        <el-col>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="提价用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDiologClose"
    >
      <el-form
        :model="editForm"
        status-icon
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input
            type="text"
            v-model="editForm.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="text"
            v-model="editForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            type="text"
            v-model="editForm.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  // 定义queryInfo数据
  private queryInfo = {
    query: '',
    pagenum: 1,
    pagesize: 2
  }

  // 定义userList
  private userList = []

  // 定义total
  private total = 0

  // 控制对话框的关闭与显示
  private addDialogVisible = false

  // 控制修改用户对话框的显示与隐藏
  private editDialogVisible = false

  // 添加用户的表单数据
  private addForm = {
    username: '',
    password: '',
    email: '',
    mobile: ''
  }

  // 添加用户的验证规则对象
  private addFormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 4, max: 16, message: '用户名在4-16个字符之间', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 18, message: '用户名在6-18个字符之间', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '邮箱为空', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          // 验证邮箱的正则
          const regEamil = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
          if (regEamil.test(value)) {
            return callback && callback()
          }

          callback && callback(new Error('请输入合法的邮箱'))
        },
        trigger: 'blur'
      }
    ],
    mobile: [
      { required: true, message: '手机号为空', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          const regMobile = /^1(3|4|5|7|8)\d{9}$/
          if (regMobile.test(value)) {
            return callback && callback()
          }
          callback && callback(new Error('请输入合法的手机号'))
        },
        trigger: 'blur'
      }
    ]
  }

  // 编辑用户的信息
  private editForm = {
    id: 0,
    username: '',
    email: '',
    mobile: ''
  }

  // 编辑用户的验证规则对象
  private editFormRules = {
    email: this['addFormRules'].email,
    mobile: this['addFormRules'].mobile
  }

  // created生命周期函数
  private created() {
    this.getUserList()
  }

  // getUserList函数
  public async getUserList() {
    const { data: res } = await this['$http'].get('users', {
      params: this['queryInfo']
    })
    if (res.meta.status !== 200) return this['$message'].error(res.meta.msg)
    this['userList'] = res.data.users
    this['total'] = res.data.total
  }

  // 监听 pagesize 改变函数
  public handleSizeChange(newSize) {
    this.queryInfo.pagesize = newSize
    this.getUserList()
  }

  // 监听 pagenum 改变的函数
  public handleCurrentChange(newPage) {
    this.queryInfo.pagenum = newPage
    this.getUserList()
  }

  // 用户状态改变数据
  public async userStateChange({ id, state }) {
    const { data: res } = await this['$http'].put(`users/${id}/state/${state}`)
    if (res.meta.status !== 200) {
      // 失败时更改状态(未实现)
      state = !state
      return this['$message'].error('用户状态更新失败')
    }
    this['$message'].success('更新用户状态成功')
  }

  // 监听添加用户对话框的关闭事件
  public addDialogClose() {
    ;(this['$refs'].addFormRef as HTMLFormElement).resetFields()
  }

  // 点击按钮，添加用户
  public addUser() {
    ;(this['$refs'].addFormRef as HTMLFormElement).validate(async valid => {
      // 校验未通过
      if (!valid) return void 0
      // 校验通过
      const { data: res } = await this['$http'].post('users', this.addForm)
      if (res.meta.status !== 201) {
        return this['$message'].error('添加用户失败')
      }
      this['$message'].success('添加用户成功')
      // 添加成功后隐藏对话框
      this.addDialogVisible = false
      // 重新获取用户列表数据
      this.getUserList()
    })
  }

  // 展示编辑用户的对话框
  public async showEditDialog(id) {
    this.editDialogVisible = true
    const { data: res } = await this['$http'].get('users/' + id)

    if (res.meta.status !== 200) {
      return this['$message'].error('查询用户失败')
    }
    this.editForm = res.data
  }

  // 监听编辑用户对话框的关闭事件
  public editDiologClose() {
    ;(this['$refs'].editFormRef as HTMLFormElement).resetFields()
  }

  // 修改用户信息并提交
  public editUserInfo() {
    ;(this['$refs'].editFormRef as HTMLFormElement).validate(async valid => {
      if (!valid) return void 0
      // 发起修改用户的验证
      const { data: res } = await this['$http'].put(
        'users/' + this.editForm.id,
        {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }
      )

      if (res.meta.status !== 200) {
        return this['$message'].error(res.meta.msg)
      }

      // 关闭对话框
      this.editDialogVisible = false
      // 刷新数据列表
      this.getUserList()
      // 提示修改成功
      this['$message'].success(res.meta.msg)
    })
  }

  // 更具id删除用户
  public async removeUserById(id) {
    const confirmResult = await this['$confirm'](
      '此操作将永久删除该用户, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch(() => {
      this['$message']({
        type: 'info',
        message: '已取消删除'
      })
    })

    if (confirmResult) {
      const { data: res } = await this['$http'].delete('users/' + id)
      if (res.meta.status !== 200) {
        return this['$message'].error(res.meta.msg)
      }
      this['$message'].success(res.meta.msg)
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped></style>
