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
                <el-table-column prop="username" label="用户名" width="100" align="center"></el-table-column>
                <el-table-column prop="nickname" label="昵称" width="100" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" width="130" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.avatar"
                            :preview-src-list="[scope.row.avatar]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="180" align="center"></el-table-column>
                <el-table-column prop="tel" label="电话" width="120" align="center"></el-table-column>
                <el-table-column prop="createTime" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-s-custom"
                            @click="getResumeInfo(scope.row)">简历</el-button>
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
                        <img v-if="imgUrl" :src="imgUrl" class="avatar">
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

        <!-- 添加简历基本信息弹出框 -->
        <el-dialog :title="visibleTitle" :visible.sync="addResumeVisible" width="30%">
            <el-form ref="resumeForm" :model="resumeForm" :rules="rules" label-width="70px">
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="resumeForm.age"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="resumeForm.sex">
                        <el-radio :label="0">男</el-radio>
                        <el-radio :label="1">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="居住地" prop="home">
                    <el-input v-model="resumeForm.home"></el-input>
                </el-form-item>
                <el-form-item label="英语等级" prop="english">
                    <el-input v-model="resumeForm.english"></el-input>
                </el-form-item>
                <el-form-item label="求职意向" prop="jobIntention">
                    <el-input v-model="resumeForm.jobIntention"></el-input>
                </el-form-item>
                <el-form-item label="基本技能" prop="ability">
                    <el-input type="textarea" v-model="resumeForm.ability"></el-input>
                </el-form-item>

                <el-form-item label="个人总结" prop="personalSummary">
                    <el-input type="textarea" v-model="resumeForm.personalSummary"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="saveResumeInfo('resumeForm')">确 定</el-button>
                    <el-button size="mini" type="info" @click="resetForm()">重置</el-button>
                    <el-button @click="addResumeVisible = false" size="mini">取 消</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>

        <!-- 简历弹出框 -->
        <el-dialog :title="resumeTitle" :visible.sync="resumeVisible" width="60%">
            <div style="margin-top:20px" v-if="resumeInfo === null">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addResumeInfo()">添加基本信息</el-button>
            </div>
            <div v-else>
                <el-descriptions class="margin-top" title="个人基本信息" :column="3" size="medium" border
                    label-class-name="my-label">
                    <template slot="extra">
                        <el-button type="primary" size="mini" icon="el-icon-edit"
                            @click="editResumeInfo(resumeInfo.id)">编辑</el-button>
                    </template>
                    <el-descriptions-item label="性别" :contentStyle="{ 'width': '180px' }" v-if="resumeInfo.sex === 0">
                        <span>男</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="性别" :contentStyle="{ 'width': '180px' }" v-else>
                        <span>女</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="年龄">
                        <span>{{ resumeInfo.age }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="居住地">
                        <span>{{ resumeInfo.home }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="备注">
                        <el-tag size="small">
                            {{ resumeInfo.english }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="求职意向" :span="2">
                        <span>{{ resumeInfo.jobIntention }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item :span="3" label="专业技能">
                        <span>{{ resumeInfo.ability }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="个人总结">
                        <span>{{ resumeInfo.personalSummary }}</span>
                    </el-descriptions-item>
                </el-descriptions>

                <div style="margin-top:20px"></div>
                <el-descriptions class="margin-top" title="教育经历" style="margin-top:20px" :column="3" border
                    size="medium" v-for="(item, index) in education" v-bind:key="index" label-class-name="my-label">
                    <template slot="extra">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="delEducation(item)">删除</el-button>
                    </template>
                    <el-descriptions-item label="学校名称">
                        {{ item.name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="专业">{{ item.major }}</el-descriptions-item>
                    <el-descriptions-item label="学历" v-if="item.diploma === 0">高中</el-descriptions-item>
                    <el-descriptions-item label="学历" v-else-if="item.diploma === 1">大学专科</el-descriptions-item>
                    <el-descriptions-item label="学历" v-else-if="item.diploma === 2">大学本科</el-descriptions-item>
                    <el-descriptions-item label="学历" v-else>大学研究生</el-descriptions-item>
                    <el-descriptions-item label="起止时间" :span="3">
                        {{ item.startTime }} ~~ {{ item.endTime }}
                    </el-descriptions-item>
                    <el-descriptions-item label="教育简述" :span="3">
                        {{ item.descriptions }}
                    </el-descriptions-item>
                </el-descriptions>

                <div style="margin-top:20px"></div>
                <el-descriptions class="margin-top" title="工作经历" style="margin-top:20px" :column="3"
                    label-class-name="my-label" border size="medium" v-for="(item, index) in experience"
                    v-bind:key="index">
                    <template slot="extra">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="delExperience(item)">删除</el-button>
                    </template>
                    <el-descriptions-item label="公司名称">
                        {{ item.name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="职位信息" :span="2">
                        {{ item.position }}
                    </el-descriptions-item>
                    <el-descriptions-item label="起止时间" :span="3">
                        {{ item.startTime }} ~~ {{ item.endTime }}
                    </el-descriptions-item>
                    <el-descriptions-item label="主要负责" :span="3">
                        {{ item.performance }}
                    </el-descriptions-item>
                </el-descriptions>

                <div style="margin-top:20px"></div>
                <el-descriptions class="margin-top" title="项目经历" style="margin-top:20px" :column="1"
                    label-class-name="my-label" border size="medium" v-for="(item, index) in project"
                    v-bind:key="index">
                    <template slot="extra">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="delProject(item)">删除</el-button>
                    </template>
                    <el-descriptions-item label="项目名称">
                        {{ item.name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="项目时间">
                        {{ item.startTime }} ~~ {{ item.endTime }}
                    </el-descriptions-item>
                    <el-descriptions-item label="工作职责">
                        {{ item.performance }}
                    </el-descriptions-item>
                    <el-descriptions-item label="项目背景">
                        {{ item.background }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import api from '@/api/user/user';
import resume from '@/api/resume/resume'
import edu from '@/api/resume/education'
import exper from '@/api/resume/experience'
import project from '@/api/resume/project'
export default {
    name: 'basetable',
    data() {
        return {
            tableData: {},
            resumeInfo: {},
            resumeForm: {},
            education: [],
            experience: [],
            project: [],
            query: {
                email: "",
                endTime: "",
                page: 1,
                pageSize: 5,
                startTime: "",
                type: 4,
                username: ""
            },
            multipleSelection: [],
            editVisible: false,
            resumeVisible: false,
            addResumeVisible: false,
            isAdd: false,
            visibleTitle: '',
            resumeTitle: '',
            imgUrl: '',
            userId: '',
            pageTotal: 0,
            form: {},
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 7个字符', trigger: 'blur' }
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
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur' },
                    // { type:"number", message: '年龄格式错误', trigger: 'blur' }
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
        // 获取简历信息
        getResumeData(id) {
            resume.getResumeById(id).then((result) => {
                if (result.success) {
                    this.resumeInfo = result.data
                    this.education = result.data.education
                    this.experience = result.data.experience
                    this.project = result.data.project
                }
            })
        },
        // 获取简历信息
        getResumeInfo(val) {
            this.resumeVisible = true
            this.resumeTitle = val.username + "简历信息"
            this.resumeInfo = {}
            this.education = []
            this.project = []
            this.experience = []
            this.userId = val.id
            this.getResumeData(val.id)
        },
        // 添加简历基本信息
        addResumeInfo() {
            this.addResumeVisible = true
            this.isAdd = true
            this.resetForm()
        },
        // 编辑简历基本信息
        editResumeInfo(val) {
            this.isAdd = false
            this.addResumeVisible = true
            resume.getResumeByUserId(val).then((result) => {
                if (result.success) {
                    this.resumeForm = result.data
                }
            })
        },
        // 保存简历基本信息
        saveResumeInfo(resumeForm) {
            if (this.isAdd) {
                this.$refs[resumeForm].validate((valid) => {
                    if (valid) {
                        this.resumeForm.userId = this.userId
                        resume.addResumeInfo(this.resumeForm).then((result) => {
                            if (result.success) {
                                this.$message.success(result.msg)
                                this.resumeInfo = this.resumeForm
                                this.resumeInfo.id = result.map.id
                            }
                        })
                        this.addResumeVisible = false
                    }
                })
            }
            else {
                resume.updateResumeInfo(this.resumeForm).then((result) => {
                    if (result.success) {
                        this.$message.success(result.msg)
                        this.resumeInfo = this.resumeForm
                        this.addResumeVisible = false
                    }
                })

            }
        },
        // 删除教育经历
        delEducation(val) {
            edu.delEducationById(val.id).then((result) => {
                this.$message.success(result.msg)
                this.getResumeData(this.userId)
            })
        },
        // 删除实习经历
        delExperience(val) {
            exper.delExperienceById(val.id).then((result) => {
                this.$message.success(result.msg)
                this.getResumeData(this.userId)
            })
        },
        // 删除项目经历
        delProject(val) {
            project.delProjectById(val.id).then((result) => {
                this.$message.success(result.msg)
                this.getResumeData(this.userId)
            })
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
            this.imgUrl = ''
            this.editVisible = true
            this.isAdd = true
        },
        // 编辑操作
        handleEdit(row) {
            this.isAdd = false
            this.editVisible = true;
            api.getUserById(row.id).then((result) => {
                if (result.success == true) {
                    this.form = result.data
                } else {
                    this.$message.error(result.msg)
                }
            })
            this.visibleTitle = "编辑"

        },
        resetForm() {
            this.form = {}
            this.resumeForm = {}
        },
        // 保存编辑/添加
        saveEdit(form) {
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
                this.imgUrl = response.msg
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

<style>
.my-label {
    width: 100px;
}

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
