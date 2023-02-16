<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-people"></i> 职位列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" class="handle-del mr10"
                    @click="addCompany">添加公司</el-button>
                <el-select v-model="query.state" @change="companySatate" placeholder="全部公司" class="handle-select mr10">
                    <el-option key="0" label="下架" value="0"></el-option>
                    <el-option key="1" label="正常" value="1"></el-option>
                    <el-option key="2" label="待审核" value="2"></el-option>
                </el-select>
                <el-button v-if="batchPass" type="primary" size="mini" icon="el-icon-circle-check"
                    class="handle-del mr10" @click="changeStatus()">批量通过</el-button>
                <el-button type="danger" size="mini" icon="el-icon-circle-close" class="handle-del mr10"
                    @click="delAllSelection">{{ this.delOrRefuse }}</el-button>
                <el-input v-model="query.name" placeholder="公司名称" class="handle-input mr10"></el-input>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handRefresh">重置</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="公司使命">
                                <span>{{ props.row.mission }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{ props.row.createTime }}</span>
                            </el-form-item>
                            <el-form-item label="公司简介">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="公司名称"></el-table-column>
                <el-table-column prop="foreignName" label="公司外文名"></el-table-column>
                <el-table-column label="LOGO(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.logo"
                            :preview-src-list="[scope.row.avatar]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="city" label="公司注册地"></el-table-column>
                <el-table-column label="招聘职位" prop="positionCount" align="center">
                </el-table-column>
                <el-table-column prop="hrCount" label="HR数量" align="center"></el-table-column>
                <el-table-column label="公司状态" align="center">
                    <template slot-scope="scope">
                        <el-switch v-if="scope.row.state != 2" v-model="scope.row.state === 1" active-color="#13ce66"
                            inactive-color="#ff4949" @change="changeStatus(scope.row)">
                        </el-switch>
                        <el-tag v-else>待审核</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.state === 2" type="primary" size="mini" icon="el-icon-edit"
                            @click="changeStatus(scope.row)">通过</el-button>
                        <el-button v-else type="primary" size="mini" icon="el-icon-edit"
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-if="scope.row.state != 2" type="warning" size="mini" icon="el-icon-s-operation"
                            @click="getPostionList(scope.row)">职位</el-button>
                        <el-button v-if="scope.row.state === 2" type="danger" size="mini" icon="el-icon-circle-close"
                            @click="handleDelete(scope.row)">驳回</el-button>
                        <el-button v-else type="danger" size="mini" icon="el-icon-delete"
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
        <el-dialog title="职位列表" :visible.sync="positionVisible" width="60%">
            <el-table :data="positionList" border class="table" ref="multipleTable"
                header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="职位名称"></el-table-column>
                <el-table-column prop="quantity" label="招聘人数"></el-table-column>
                <el-table-column prop="city" label="工作城市"></el-table-column>
                <el-form-item label="薪资范围">
                    <template slot-scope="scope">
                        <span>{{ scope.row.salaryDown }}-{{ scope.row.salaryUp }}</span></template>
                </el-form-item>
                <el-table-column prop="releaseDate" label="发布日期"></el-table-column>
                <el-table-column label="职位状态">
                    <template slot-scope="scope">
                        <el-switch v-if="scope.row.state != 2" v-model="scope.row.state === 1" active-color="#13ce66"
                            inactive-color="#ff4949" @change="changePositionStatus(scope.row)">
                        </el-switch>
                        <el-tag v-else>待审核职位</el-tag>
                    </template>

                </el-table-column>
                <el-table-column prop="hits" label="职位浏览量"></el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.state != 2" type="danger" size="mini" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">删除</el-button>
                        <el-button v-else type="primary" size="mini" icon="el-icon-delete"
                            @click="toExaminePosition(scope.row)">通过</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/company/company'
import position from '@/api/position/position'
export default {
    name: 'basetable',
    data() {
        return {
            tableData: {},
            positionList: {},
            comapny: {},
            query: {
                page: 1,
                pageSize: 5,
                name: '',
            },
            multipleSelection: [],
            positionVisible: false,
            pageTotal: 0,
            delOrRefuse: '批量删除',
            batchPass: false,
            form: {},
        }
    },
    created() {
        this.getData();

    },
    methods: {
        // 获取 用户列表
        getData() {
            api.getCompanyList(this.query).then((result) => {
                this.tableData = result.data.records
                this.pageTotal = result.data.total
            });
        },
        getPostionList(val) {
            this.positionVisible = true
            this.company = val
            position.getPositionByCompanyId(val.id).then((result) => {
                this.positionList = result.data
            })
        },
        companySatate(val) {
            console.log(val);
            if (val == 2) {
                this.delOrRefuse = '批量驳回'
                this.batchPass = true
            } else {
                this.delOrRefuse = '批量删除'
                this.batchPass = false
            }
            this.query.state = val
            this.getData()
        },
        // 重置查询表单
        handRefresh() {
            this.query.name = ''
            this.query.state = ''
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
            }).then(() => {
                if (val.positionCount > 0) {
                    this.$message.error("该公司有正在招聘的职位，暂时不能删除！");
                    return
                } else {
                    api.delCompanyById(val.id).then((result) => {
                        if (result.success == true) {
                            this.$message.success('删除成功');
                            this.getData()
                        } else {
                            this.$message.error(result.msg);
                        }
                    })
                }

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
            var info = ""
            this.multipleSelection.forEach(function (item, index) {

                if (item.positionCount > 0) {
                    info = info + item.name + "、"
                } else {
                    ids.push(item.id)
                }
            })
            console.log(ids);
            console.log(info);
            if (info != "") {
                info += "有正在招聘的职位，暂时不能删除!"
            }

            this.$confirm(info + '是否继续操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (ids.length <= 0) {
                    return
                }
                api.batchDelCompany(ids).then((result) => {
                    if (result.success == true) {
                        this.$message.success(result.msg)
                        this.getData()
                    } else {
                        this.$message.error(result.msg)
                    }
                }).catch(() => { })
            })
        },
        // 修改职位状态
        changePositionStatus(val) {
            console.log(val);
            position.changeState(val.id, val.state).then((result) => {
                this.$message.success(result.msg)
                this.getPostionList(this.company)
            })
        },
        // 审核职位
        toExaminePosition(val) {
            position.toExaminePosition(val.id).then((result) => {
                if (result.success) {
                    this.$message.success(result.msg)
                    this.getPostionList(this.company)
                }
            })
        },
        // 修改状态
        changeStatus(val) {
            if (val) {
                api.changeState(val.id, val.state).then((result) => {
                    this.$message.success(result.msg)
                    this.getData()
                })
            } else {
                if (this.multipleSelection.length == 0) {
                    this.$message.error("未选中数据")
                    return;
                }
                const ids = []
                this.multipleSelection.forEach(function (item, index) {
                    ids[index] = item.id
                })

                console.log(ids)
                this.$confirm('是否继续操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.batchChangeStatus(ids).then((result) => {
                        if (result.success == true) {
                            this.$message.success(result.msg)
                            this.getData()
                        } else {
                            this.$message.error(result.msg)
                        }
                    }).catch(() => { })
                })
                this.multipleSelection = [];

            }

        },
        // 添加操作
        addCompany() {
            this.$router.push({ name: 'addCompany' })
        },
        // 编辑操作
        handleEdit(val) {
            api.getCompanyById(val.id).then((result) => {
                if (result.success) {
                    const data = result.data
                    this.$router.push({ name: 'updateCompany', params: { company: data } })
                } else {
                    this.$message.error("请求超时！")
                }
            })

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
    color: black
}
</style>
