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
                <el-button type="primary" size="mini" icon="el-icon-lx-roundcheck" class="handle-del mr10"
                    @click="batchPass()">批量通过</el-button>
                <el-button type="danger" size="mini" icon="el-icon-lx-roundclose" class="handle-del mr10"
                    @click="refuseExarm()">批量拒绝</el-button>

            </div>
            <el-form :inline="true" :model="query" class="demo-form-inline">
                <el-form-item label="城市"><el-input v-model="query.city" placeholder="城市"
                        class="handle-input"></el-input></el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="query.state" @change="examineState" placeholder="待审核" class="handle-input">
                        <el-option key="0" label="待审核" value="0"></el-option>
                        <el-option key="1" label="已拒绝" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="query.categoryId" @focus="getCategoryList" placeholder="请选择分类"
                        style="width:150px">
                        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司">
                    <el-select v-model="query.companyId" @focus="getCompanyList" placeholder="请选择公司"
                        style="width:150px">
                        <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="薪资"><el-input v-model="query.minSalary" placeholder="最少薪资" prop="minsalary"
                        class="handle-input"></el-input></el-form-item>
                <el-form-item><el-input v-model="query.maxSalary" placeholder="最多薪资"
                        class="handle-input"></el-input></el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handRefresh">重置</el-button>

            </el-form>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="职位名称"></el-table-column>
                <el-table-column prop="requirement" label="招聘需求"></el-table-column>
                <el-table-column prop="quantity" label="招聘人数"></el-table-column>
                <el-table-column prop="city" label="工作城市"></el-table-column>
                <el-table-column label="薪资">
                    <template slot-scope="scope">
                        {{ scope.row.salaryDown }}-{{ scope.row.salaryUp }}
                    </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="分类名称"></el-table-column>
                <el-table-column prop="companyName" label="公司名称"></el-table-column>
                <el-table-column prop="releaseDate" label="发布日期"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-lx-roundcheck"
                            @click="batchPass(scope.row)">通过</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-lx-roundclose"
                            @click="refuseExarm(scope.row)">拒绝</el-button>
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
        <el-dialog title="理由" :visible.sync="editVisible" width="30%">
            <el-form ref="notify" :model="notify" :rules="rules" label-width="100px">
                <el-form-item label="驳回理由" prop="content">
                    <el-input type="textarea" v-model="notify.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/position/position';
import category from '@/api/category/category'
import company from '@/api/company/company'
export default {
    name: 'basetable',
    data() {
        return {
            tableData: {},
            categoryList: {},
            companyList: {},
            notify: {},
            handelObject: [],
            query: {
                page: 1,
                pageSize: 5,
                state: '0',
                city: '',
                minSalary: '',
                maxSalary: ''
            },
            multipleSelection: [],
            editVisible: false,
            isBatch: false,
            pageTotal: 0,
            rules: {
                content: [
                    { required: true, message: '理由', trigger: 'blur' }
                ],
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取审核列表
        getData() {
            api.getAllExarmPosition(this.query).then((result) => {
                this.tableData = result.data.records
                this.pageTotal = result.data.total
            });
        },
        // 获取分类列表
        getCategoryList() {
            category.getAll().then((result) => {
                this.categoryList = result.data
            })
        },
        // 获取公司列表
        getCompanyList() {
            company.getAll().then((result) => {
                this.companyList = result.data
            })
        },
        // 由状态获取审核列表
        examineState(val) {
            this.query.state = val
            this.getData()
        },
        // 重置查询表单
        handRefresh() {
            this.query = {}
            this.query.page = 1
            this.query.pageSize = 5
            this.query.state = '0'
            this.getData()
        },
        // 通过
        batchPass(val) {
            this.handelObject = []
            if (val) {
                this.handelObject.push(val)
            }

            if(!val){

                if (this.multipleSelection.length == 0) {
                    this.$message.error("未选中数据")
                    return
                }
                this.handelObject = this.multipleSelection
            }
            const param = []
            this.handelObject.map( (item)=> {
                const notify = {}
                notify.id = item.id
                notify.userId = item.hrId
                notify.title = item.title 
                param.push(notify)
            })
             console.log(param);
            this.$confirm('是否继续操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.toExaminePosition(param).then((result) => {
                    if (result.success == true) {
                        this.$message.success(result.msg)
                        this.getData()
                    } else {
                        this.$message.error(result.msg)
                    }
                }).catch(() => { })
            })
        },
        // 拒绝申请
        refuseExarm(val) {
            this.notify = {}
            this.handelObject = []

            if (val) {
               this.handelObject.push(val)
            }

            if(!val){
            
                if (this.multipleSelection.length == 0) {
                    this.$message.error("未选中数据")
                    return
                }
                this.handelObject = this.multipleSelection
            }
                this.editVisible = true

        },
        // 保存信息
        saveEdit() {
            this.editVisible = false
            const param = []
            this.multipleSelection.map( (item)=> {
                const notify = {}
                notify.id = item.id
                notify.userId = item.hrId
                notify.title = item.title
                notify.content = this.notify.content
                param.push(notify)
            })
            console.log(param);
                api.refusePosition(param).then((result) => {
                    this.$message.success(result.msg)
                    this.getData()
                })
            this.notify = {}
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
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
                api.delPositionByIdList(ids).then((result) => {
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
    width: 100px;
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
