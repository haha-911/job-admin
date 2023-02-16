<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-people"></i> 求职者
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" icon="el-icon-friendadd" class="handle-del mr10"
                    @click="addUser">添加用户</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" class="handle-del mr10"
                    @click="delAllSelection">批量删除</el-button>
                <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-date-picker v-model="query.startTime" type="date" placeholder="开始日期" format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy:MM:dd" class="handle-input mr10">
                </el-date-picker>
                <el-date-picker v-model="query.endTime" type="date" placeholder="结束日期" format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy:MM:dd" class="handle-input mr10">
                </el-date-picker>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handRefresh">重置</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.avatar"
                            :preview-src-list="[scope.row.avatar]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="tel" label="电话"></el-table-column>
                <el-table-column prop="createTime" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <div class="block" style="margin-top:50px;float:right">
                <el-pagination :current-page="query.page" :page-sizes="[5, 10, 15, 20]" :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="pageTotal" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="visibleTitle" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="avatar-uploader" action="/api/file/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess">
                        <img v-if="form.avatar" :src="form.avatar" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="saveEdit('form')">确 定</el-button>
                    <el-button size="mini" type="info" @click="resetForm()">重置</el-button>
                    <el-button @click="editVisible = false" size="mini">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/user/user';
export default {
    name: 'basetable',
    data() {
        return {
            tableData: {},
            query: {
                email: "",
                endTime: "",
                page: 1,
                pageSize: 5,
                startTime: "",
                type: 1,
                username: ""
            },
            multipleSelection: [],
            editVisible: false,
            isAdd: false,
            visibleTitle: '',
            pageTotal: 0,
            form: {},
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 7个字符', trigger: 'blur' }
                ],
                nickname: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '请输入Email', trigger: 'blur' },
                    { type: "email", message: 'Email格式错误', trigger: 'blur' }
                ],
                tel: [
                    { required: true, message: '请输入电话号码', trigger: 'blur' },
                ],
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 用户列表
        getData() {
            api.getUserList(this.query).then((result) => {
                console.log(result);
                this.tableData = result.data.records
                this.pageTotal = result.data.total
            });
        },
        // 重置查询表单
        handRefresh() {
            this.query.username = ''
            this.query.startTime = ''
            this.query.email = ''
            this.query.endTime = ''

        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        // 单个删除操作
        handleDelete(row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                api.delUserById(row.id).then((result) => {
                    if (result.success == true) {
                        this.$message.success('删除成功');
                        this.getData()
                    } else {
                        this.$message.success('删除失败');
                    }
                })
            }).catch(() => { });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(val);
        },
        // 批量删除
        delAllSelection() {
            if (this.multipleSelection.length == 0) {
                this.$message.error("未选中数据")
                return
            }
            const ids = []
            this.multipleSelection.forEach(function (item, index) {
                ids[index] = item.id
            })
            console.log(ids);
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.delUserByIdList(ids).then((result) => {
                    if (result.success == true) {
                        this.$message.success(result.msg)
                        this.getData()
                    } else {
                        this.$message.error(result.msg)
                    }
                }).catch(() => { })
            })
            this.multipleSelection = [];
        },
        // 添加操作
        addUser() {
            this.visibleTitle = "添加"
            this.resetForm()
            this.editVisible = true
            this.isAdd = true
        },
        // 编辑操作
        handleEdit(row) {
            console.log(row);
            api.getUserById(row.id).then((result) => {
                if (result.success == true) {
                    this.form = result.data
                } else {
                    this.$message.error(result.msg)
                }
            })
            this.visibleTitle = "编辑"
            this.editVisible = true;
        },
        resetForm() {
            this.form = {}
        },
        // 保存编辑/添加
        saveEdit(form) {
            this.form.type = 1
            this.$refs[form].validate((valid) => {
                if (valid) {
                    if (!this.isAdd) {
                        api.updateUser(this.form).then((result) => {
                            if (result.success == true) {
                                this.$message.success(result.msg);
                                this.getData()
                            } else {
                                this.$message.error(result.msg);
                            }
                        })
                    }
                    if (this.isAdd) {
                        api.addUser(this.form).then((result) => {
                            if (result.success == true) {
                                this.$message.success(result.msg);
                                this.isAdd = false
                            } else {
                                this.$message.error(result.msg);
                            }
                        })
                        this.getData()
                    }
                } else {
                    return;
                }
                this.editVisible = false;
            })
        },
        // 上传头像
        handleAvatarSuccess(response) {
            if (response.success == true) {
                this.form.avatar = response.msg
                console.log(response.msg);
            } else {
                this.$message.error(response.msg + "请重新上传！")
            }


        },
        // 改变当前页
        handleCurrentChange(val) {
            this.query.page = val
            this.getData();
        },
        // 改变每页展示的条数
        handleSizeChange(val) {
            this.query.pageSize = val
            this.getData()
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
