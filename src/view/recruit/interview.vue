<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-people"></i> 招聘管理 </el-breadcrumb-item>
                <el-breadcrumb-item>面试管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- 查询条件 -->
            <div class="handle-box">
                <el-button type="primary" v-if="requestData.state === '2'" size="mini" icon="el-icon-circle-check"
                    class="handle-del mr10" @click="batchPass()">批量通过</el-button>
                <el-button type="danger" v-else size="mini" icon="el-icon-delete" class="handle-del mr10"
                    @click="batchDel()">
                    批量删除
                </el-button>
                <el-button type="danger" v-if="requestData.state === '2'" size="mini" icon="el-icon-delete"
                    class="handle-del mr10" @click="batchRefuse()">
                    批量驳回
                </el-button>
            </div>
            <el-form :inline="true" :model="requestData" class="demo-form-inline">
                <el-form-item label="面试状态">
                    <el-select v-model="requestData.state" @change="interviewSatate" placeholder="全部申请" label="状态"
                        class="handle-select mr10">
                        <el-option key="0" label="不合适" value="0"></el-option>
                        <el-option key="1" label="已通过" value="1"></el-option>
                        <el-option key="2" label="面试中" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司名称">
                    <el-select v-model="requestData.companyId" placeholder="请选择公司" @focus="getCompanyList">
                        <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间">
                    <el-date-picker v-model="requestData.applyTimeStart" type="date" placeholder="开始日期"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy:MM:dd" class="handle-input mr10">
                    </el-date-picker>
                    <el-date-picker v-model="requestData.applyTimeEnd" type="date" placeholder="结束日期"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy:MM:dd" class="handle-input mr10">
                    </el-date-picker>
                </el-form-item>

                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handRefresh">重置</el-button>
            </el-form>
            <!-- 表单数据 -->
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="demo-table-expand">
                       
                        <el-form-item label="用户电话">
                            <span>{{ props.row.userTel }}</span>
                          </el-form-item>
                          <el-form-item label="HR电话">
                              <span>{{ props.row.hrTel }}</span>
                            </el-form-item>
                        <el-form-item label="面试地址">
                            <span>{{ props.row.address }}</span>
                          </el-form-item>
                      <el-form-item label="面试评价" v-if="props.row.status != 2">
                        <span>{{ props.row.comments }}</span>
                      </el-form-item>
                      <el-form-item label="面试备注" >
                        <span v-if="props.row.memo">{{ props.row.memo }}</span>
                        <span v-else>无</span>
                      </el-form-item>

                  </el-form>
                    </template>
                  </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="职位名称"></el-table-column>
                <el-table-column prop="username" label="用户名称"></el-table-column>
                <el-table-column prop="hrName" label="HR姓名" align="center"></el-table-column>
                <el-table-column prop="companyName" label="公司名称" align="center"></el-table-column>
                <el-table-column label="面试状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 1" type="success">已通过</el-tag>
                        <el-tag v-if="scope.row.status === 2">面试中</el-tag>
                        <el-tag v-if="scope.row.status === 0" type="danger">不合适</el-tag>
                    </template>
                </el-table-column>
                <el-table-column v-if="requestData.state === '2'" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column v-else prop="time" label="操作时间"></el-table-column>
                <el-table-column label="操作" width="280px" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 2" type="primary" size="mini" icon="el-icon-edit"
                            @click="batchPass(scope.row)">通过</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-s-custom"
                            @click="getResumeInfo(scope.row)">简历</el-button>
                        <el-button v-if="scope.row.status === 2" type="danger" size="mini" icon="el-icon-circle-close"
                            @click="batchRefuse(scope.row)">拒绝</el-button>
                        <el-button v-else type="danger" size="mini" icon="el-icon-delete"
                            @click="batchDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分页组件 -->
            <div class="block" style="margin-top: 50px; float: right">
                <el-pagination :current-page="requestData.page" :page-sizes="[5, 10, 15, 20]" :page-size="requestData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="pageTotal" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="面试评价" :visible.sync="editVisible" width="30%">
            <el-form  :model="form" :rules="rules" label-width="100px">
                <el-form-item  prop="comments" >
                    <el-input type="textarea" v-model="comments"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit()" size="mini">确 定</el-button>
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
import api from '@/api/recruit/interview';
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
            comments: "",
            resumeTitle: "",
            requestData: {
                page: 1,
                pageSize: 5,
                state: "1"
            },
            multipleSelection: [],
            editVisible: false,
            resumeVisible: false,
            isRefuse: false,
            pageTotal: 0,
            form: {},
            handObject:[],
            rules: {}
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取申请列表
        getData() {
            api.getInterviewList(this.requestData).then((result) => {
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
        // 由面试状态获取列表
        interviewSatate(val) {
            this.requestData.state = val;
            this.getData();
        },
        // 重置查询表单
        handRefresh() {
            this.requestData = {}
            this.requestData.page = 1
            this.requestData.pageSize = 5
            this.requestData.state = "1"
            this.getData()
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        // 删除操作
        batchDel(val) {
            const ids = []
            if(val){
                ids.push(val.id)
            }
            if (!val){
                if (this.multipleSelection.length == 0) {
                    this.$message.error('未选中数据');
                    return;
                }
                this.multipleSelection.map((item)=>{
                ids.push(item.id)
            })
            }

            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                    api.delInterview(ids).then((result) => {
                        if (result.success == true) {
                            this.$message.success('删除成功');
                            this.getData();
                        } else {
                            this.$message.error(result.msg);
                        }
                    });
                })
        },
        // 重置消息
        restNotify(){
            this.comments = ""
        },
       
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;

        },
        
        // 保存消息
        saveEdit() {
            const form = []
            this.handObject.map((item)=>{
                const data = {}
                data.id = item.id
                data.status = item.status
                data.userId = item.userId
                data.comments = this.comments
                form.push(data)
            })
            console.log(form);
            if(!this.isRefuse){
                api.batchPass(form).then((result) => {
                    if (result.success == true) {
                        this.$message.success(result.msg);
                        this.getData();
                    } else {
                        this.$message.error(result.msg);
                    }
                    }).catch(() => { });
                    }

            if(this.isRefuse){
                api.batchRefuse(form).then((result) => {
                    if (result.success == true) {
                            this.$message.success(result.msg);
                            this.getData();
                    } else {
                            this.$message.error(result.msg);
                    }
                    })
                    .catch(() => { });
                }
            this.editVisible = false
        },

        // 通过申请
        batchPass(val) {
            this.comments = ""
            this.isRefuse = false
            this.handObject = []

            if(val){
                this.handObject.push(val)
            }

            if(!val){
                if (this.multipleSelection.length == 0) {
                    this.$message.error('未选中数据');
                    return;
                }
                this.handObject = this.multipleSelection
            }
            this.editVisible = true
        },
        // 拒绝申请
        batchRefuse(val) {
            this.comments = ""
            this.isRefuse = true
            this.handObject = []

            if(val){
                this.handObject.push(val)
            }
            if(!val){
                if (this.multipleSelection.length == 0) {
                    this.$message.error('未选中数据');
                    return;
                }
                this.handObject = this.multipleSelection
            }
            this.editVisible = true

        },
        // 改变当前页
        handleCurrentChange(val) {
            this.requestData.page = val;
            this.getData();
        },
        // 改变每页展示的条数
        handleSizeChange(val) {
            this.requestData.pageSize = val;
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
