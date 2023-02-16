<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-people"></i> 招聘管理 </el-breadcrumb-item>
                <el-breadcrumb-item>申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- 查询条件 -->
            <div class="handle-box">
                <el-button type="primary" v-if="query.state === '2'" size="mini" icon="el-icon-circle-check"
                    class="handle-del mr10" @click="batchPass()">批量通过</el-button>
                <el-button type="danger" v-else size="mini" icon="el-icon-delete" class="handle-del mr10"
                    @click="batchDelApply()">
                    批量删除
                </el-button>
                <el-button type="danger" v-if="query.state === '2'" size="mini" icon="el-icon-delete"
                    class="handle-del mr10" @click="batchRefuse()">
                    批量驳回
                </el-button>
            </div>
            <el-form :inline="true" :model="query" class="demo-form-inline">
                <el-form-item label="申请状态">
                    <el-select v-model="query.state" @change="applySatate" placeholder="全部申请" label="状态"
                        class="handle-select mr10">
                        <el-option key="0" label="已拒绝" value="0"></el-option>
                        <el-option key="1" label="申请成功" value="1"></el-option>
                        <el-option key="2" label="申请中" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司名称">
                    <el-select v-model="query.companyId" placeholder="请选择公司" @focus="getCompanyList">
                        <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间">
                    <el-date-picker v-model="query.applyTimeStart" type="date" placeholder="开始日期"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy:MM:dd" class="handle-input mr10">
                    </el-date-picker>
                    <el-date-picker v-model="query.applyTimeEnd" type="date" placeholder="结束日期"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy:MM:dd" class="handle-input mr10">
                    </el-date-picker>
                </el-form-item>

                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handRefresh">重置</el-button>
            </el-form>
            <!-- 表单数据 -->
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="职位名称"></el-table-column>
                <el-table-column prop="userName" label="用户名称"></el-table-column>
                <el-table-column prop="hrname" label="HR姓名" align="center"></el-table-column>
                <el-table-column prop="companyName" label="公司名称" align="center"></el-table-column>
                <el-table-column label="申请状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.state === 1" type="success">申请成功</el-tag>
                        <el-tag v-if="scope.row.state === 2">申请中</el-tag>
                        <el-tag v-if="scope.row.state === 0" type="danger">已拒绝</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="applyTime" label="申请时间"></el-table-column>
                <el-table-column label="操作" width="280px" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.state === 2" type="primary" size="mini" icon="el-icon-edit"
                            @click="batchPass(scope.row)">通过</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-s-custom"
                            @click="getResumeInfo(scope.row)">简历</el-button>
                        <el-button v-if="scope.row.state === 2" type="danger" size="mini" icon="el-icon-circle-close"
                            @click="batchRefuse(scope.row)">拒绝</el-button>
                        <el-button v-else type="danger" size="mini" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分页组件 -->
            <div class="block" style="margin-top: 50px; float: right">
                <el-pagination :current-page="query.page" :page-sizes="[5, 10, 15, 20]" :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="pageTotal" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="理由" :visible.sync="editVisible" width="30%">
            <el-form ref="notify" :model="applyMap" :rules="rules" label-width="100px">
                <el-form-item label="面试地点" prop="address" v-if="!isRefuse">
                    <el-input v-model="applyMap.address"></el-input>
                </el-form-item>
                <el-form-item label="面试备注" prop="memo" v-if="!isRefuse">
                    <el-input type="textarea" v-model="applyMap.memo"></el-input>
                </el-form-item>
                <el-form-item label="操作理由" prop="content">
                    <el-input type="textarea" v-model="applyMap.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit('notify')" size="mini">确 定</el-button>
                <el-button type="info" @click="restNotify" size="mini">重置</el-button>
                <el-button @click="editVisible = false" size="mini">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 简历弹出框 -->
        <el-dialog :title="resumeTitle" :visible.sync="resumeVisible" width="60%">
            <el-descriptions class="margin-top" title="个人基本信息" :column="3" size="medium" border
                label-class-name="my-label">
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

            <el-descriptions class="margin-top" title="教育经历" style="margin-top:20px" :column="3" border size="medium"
                v-for="(item, index) in education" v-bind:key="index" label-class-name="my-label">
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

            <el-descriptions class="margin-top" title="工作经历" style="margin-top:20px" :column="3"
                label-class-name="my-label" border size="medium" v-for="(item, index) in experience" v-bind:key="index">
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

            <el-descriptions class="margin-top" title="项目经历" style="margin-top:20px" :column="1"
                label-class-name="my-label" border size="medium" v-for="(item, index) in project" v-bind:key="index">
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
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/recruit/apply';
import resume from '@/api/resume/resume'
import company from '@/api/company/company';


export default {
    name: 'basetable',
    data() {
        return {
            tableData: {},
            companyList: [],
            resumeInfo: {},
            education: [],
            experience: [],
            project: [],
            notify: {},
            query: {
                page: 1,
                pageSize: 5,
                state: "1"
            },
            multipleSelection: [],
            editVisible: false,
            resumeVisible: false,
            isRefuse: false,
            resumeTitle: "",
            pageTotal: 0,
            form: {},
            applyMap:{},
            handelObject:[],
            rules: {
                address: [
                    { required: true, message: '请输入面试地址', trigger: 'blur' },
                ],               
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取申请列表
        getData() {
            api.getApplyList(this.query).then((result) => {
                this.tableData = result.data.records;
                this.pageTotal = result.data.total;
            });
        },
        // 获取公司列表
        getCompanyList() {
            company.getAll().then((result) => {
                this.companyList = result.data;
            });
        },
        // 获取简历信息
        getResumeInfo(val) {
            this.resumeVisible = true
            this.resumeTitle = val.userName + "简历信息"
            resume.getResumeById(val.userId).then((result) => {
                if (result.success) {
                    this.resumeInfo = result.data
                    this.education = result.data.education
                    this.experience = result.data.experience
                    this.project = result.data.project
                }
            })
        },
        // 由申请状态获取列表
        applySatate(val) {
            this.query.state = val;
            this.getData();
        },
        // 重置查询表单
        handRefresh() {
            this.query = {}
            this.query.page = 1
            this.query.pageSize = 5
            this.query.state = "1"
            this.getData()
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        // 单个删除操作
        handleDelete(val) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    api.delApplyById(val.id).then((result) => {
                        if (result.success == true) {
                            this.$message.success('删除成功');
                            this.getData();
                        } else {
                            this.$message.error(result.msg);
                        }
                    });
                })
                .catch(() => { });
        },
        // 重置消息
        restNotify(){
            this.applyMap.content = ""
            this.applyMap.memo = ""
            this.applyMap.address = ""
        },
        // 保存消息
        saveEdit(notify) {
            console.log(this.applyMap);
            this.$refs[notify].validate((valid) => {
                if(valid){
                    if(!this.isRefuse){
                            api.batchPass(this.applyMap)
                            .then((result) => {
                                if (result.success == true) {
                                    this.$message.success(result.msg);
                                    this.getData()
                                } else {
                                    this.$message.error(result.msg);
                                }
                            })
                            .catch(() => { });
                        }

                    if(this.isRefuse){
                        api.batchRefuse(this.applyMap).then((result) => {
                            if (result.success == true) {
                                this.$message.success(result.msg);
                                this.getData()
                            } else {
                                this.$message.error(result.msg);
                            }
                            })
                            .catch(() => { });
                    }
                this.editVisible = false
                
                }
            })
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val);
        },
        // 批量删除
        batchDelApply() {
            if (this.multipleSelection.length == 0) {
                this.$message.error('未选中数据');
                return;
            }
            const ids = [];
            this.multipleSelection.map((item) => {
                ids.push(item.id);
            });
            console.log(ids);
            this.$confirm('选中数据将删除，是否继续操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (ids.length <= 0) {
                    return;
                }
                api.batchDelApply(ids)
                    .then((result) => {
                        if (result.success) {
                            this.$message.success(result.msg);
                            this.getData();
                        } else {
                            this.$message.error(result.msg);
                        }
                    })
                    .catch(() => { });
            });
            this.multipleSelection = [];
        },

        // 通过申请
        batchPass(val) {
            this.applyMap = {}
            this.isRefuse = false

            if(val){
                const data = [val]
                this.applyMap.data = data
            }

            if(!val){
                if (this.multipleSelection.length == 0) {
                    this.$message.error('未选中数据');
                    return;
                }
            this.applyMap.data = this.multipleSelection
            }
            console.log(this.applyMap);
            this.editVisible = true
        },
        // 拒绝申请
        batchRefuse(val) {
            this.applyMap = {}
            this.isRefuse = true

            if(val){
                const data = [val]
                this.applyMap.data = data
            }
            if(!val){
                if (this.multipleSelection.length == 0) {
                    this.$message.error('未选中数据');
                    return;
                }
                this.applyMap.data = this.multipleSelection
            }
            console.log(this.applyMap);
            this.editVisible = true

        },
        // 改变当前页
        handleCurrentChange(val) {
            this.query.page = val;
            this.getData();
        },
        // 改变每页展示的条数
        handleSizeChange(val) {
            this.query.pageSize = val;
            this.getData();
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

.mr10 {
    margin-right: 10px;
}

.demo-table-expand {
    font-size: 10px;
}

.demo-table-expand .el-form-item {
    margin-left: 100px;
    margin-bottom: 0;
    font-weight: bold;
    width: 40%;
}

.demo-table-expand span {
    font-weight: normal;
    color: black;
}
</style>
