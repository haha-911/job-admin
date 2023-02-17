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
                <el-button type="primary" size="mini" icon="el-icon-friendadd" class="handle-del mr10"
                    @click="addPosition">添加职位</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" class="handle-del mr10"
                    @click="delAllSelection">批量删除</el-button>
                <el-input v-model="query.city" placeholder="城市" class="handle-input mr10"></el-input>
                <el-input v-model="query.minSalary" placeholder="最少薪资" prop="minsalary"
                    class="handle-input mr10"></el-input>
                <el-input v-model="query.maxSalary" placeholder="最多薪资" class="handle-input mr10"></el-input>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handRefresh">重置</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="招聘人数">
                                <span>{{ props.row.quantity }}</span>
                            </el-form-item>
                            <el-form-item label="薪资范围">
                                <span>{{ props.row.salaryDown }}-{{ props.row.salaryUp }}</span>
                            </el-form-item>
                            <el-form-item label="发布日期">
                                <span>{{ props.row.releaseDate }}</span>
                            </el-form-item>
                            <el-form-item label="职位要求">
                                <span>{{ props.row.requirement }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="职位名称"></el-table-column>
                <!-- <el-table-column prop="requirement" label="招聘需求"></el-table-column> -->
                <el-table-column prop="quantity" label="招聘人数"></el-table-column>
                <el-table-column prop="city" label="工作城市"></el-table-column>
                <!-- <el-table-column prop="releaseDate" label="发布日期"></el-table-column> -->
                <el-table-column label="职位状态">
                    <template slot-scope="scope">
                        <el-switch v-if="scope.row.state != 2" v-model="scope.row.state === 1" active-color="#13ce66"
                            inactive-color="#ff4949" @change="changeStatus(scope.row)">
                        </el-switch>
                        <el-tag v-else>待审核</el-tag>
                    </template>

                </el-table-column>
                <el-table-column prop="hits" label="职位浏览量"></el-table-column>
                <el-table-column prop="categoryName" label="分类名称"></el-table-column>
                <el-table-column prop="hrName" label="HR"></el-table-column>
                <el-table-column prop="companyName" label="公司名称"></el-table-column>
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
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="职位名称" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="招聘人数" prop="quantity">
                    <el-input v-model="form.quantity"></el-input>
                </el-form-item>
                <el-form-item label="浏览量" prop="hits" v-if="!isAdd">
                    <el-input v-model="form.hits"></el-input>
                </el-form-item>
                <el-form-item label="工作城市" prop="city">
                    <el-input v-model="form.city"></el-input>
                </el-form-item>
                <el-form-item label="薪资范围" prop="salaryUp">
                    <el-col :span="11"> <el-input v-model="form.salaryDown" style="width:150px"></el-input></el-col>
                    <el-col class="line" :span="1">-</el-col>
                    <el-col :span="11"><el-input v-model="form.salaryUp" style="width:150px"></el-input></el-col>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-radio-group v-model="form.state">
                        <el-radio :label="0">下架</el-radio>
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="2">待审核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="职位分类" prop="category">
                    <el-select v-model="form.categoryId" placeholder="请选择分类">
                        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司名称" prop="company" v-if="isAdd">
                    <el-select v-model="form.companyId" @change="getHRByCompanyId" placeholder="请选择公司">
                        <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-else label="公司名称">
                    <el-input v-model="form.companyName" disabled></el-input>
                </el-form-item>
                <el-form-item label="HR" prop="hr" v-if="isAdd">
                    <el-select v-model="form.hrId" placeholder="请选择HR">
                        <el-option v-for="item in hrList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-else label="HR">
                    <el-input v-model="form.hrName" disabled></el-input>
                </el-form-item>
                <el-form-item label="招聘需求" prop="requirement">
                    <el-input type="textarea" v-model="form.requirement"></el-input>
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
import api from '@/api/position/position';
import category from '@/api/category/category'
import company from '@/api/company/company'
import hrcompany from '@/api/hrcompany/hrcompany'
export default {
    name: 'basetable',
    data() {
        return {
            tableData: {},
            categoryList: [],
            hrList: [],
            companyList: [],
            query: {
                page: 1,
                pageSize: 5,
                city: '',
                minSalary: '',
                maxSalary: ''
            },
            multipleSelection: [],
            editVisible: false,
            isAdd: false,
            visibleTitle: '',
            pageTotal: 0,
            form: {},
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 3, max: 7, message: '长度在 3 到 7个字符', trigger: 'blur' }
                ],
                minsalary: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 7, message: '长度在 3 到 7个字符', trigger: 'blur' }
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
            api.getPositionList(this.query).then((result) => {
                this.tableData = result.data.records
                this.pageTotal = result.data.total
            });
        },
        getHRByCompanyId(companyId) {
            console.log(companyId);
            hrcompany.getAll(companyId).then((result) => {
                this.hrList = result.data
                if (this.hrList.length <= 0) {
                    this.$message.warning("该公司下暂无HR")
                }
            })

        },


        // 重置查询表单
        handRefresh() {
            this.query.city = ''
            this.query.minSalary = ''
            this.query.maxSalary = ''
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
                api.delPositionById(row.id).then((result) => {
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
                api.delPositionByIdList(ids).then((result) => {
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
        changeStatus(val) {
            console.log(val);
            api.changeState(val.id, val.state).then((result) => {
                this.$message.success(result.msg)
                this.getData()
            })
        },
        resetForm() {
            this.form = {}
        },

        // 获取职位分类列表
        getCategoryList() {
            category.getAll().then((result) => {
                this.categoryList = result.data
            })

        },
        // 获取公司分类列表
        getCompanyList() {
            company.getAll().then((result) => {
                this.companyList = result.data
            })
        },
        // 添加操作
        addPosition() {
            this.visibleTitle = "添加"
            this.form = {}
            if (this.categoryList.length <= 0) {
                this.getCategoryList()
            }
            if (this.companyList.length === 0) {
                this.getCompanyList()
            }

            this.editVisible = true
            this.isAdd = true
        },
        // 编辑操作
        handleEdit(row) {
            this.isAdd = false
            if (this.categoryList === null) {
                this.getCategoryList()
            }
            api.getPositionById(row.id).then((result) => {
                if (result.success == true) {
                    this.form = result.data
                } else {
                    this.$message.error(result.msg)
                }
            })
            this.visibleTitle = "编辑"
            this.editVisible = true;
        },
        // 保存编辑/添加
        saveEdit(form) {

            this.$refs[form].validate((valid) => {
                if (valid) {
                    if (!this.isAdd) {
                        api.updatePosition(this.form).then((result) => {
                            if (result.success == true) {
                                this.$message.success(result.msg);
                                this.getData()
                            } else {
                                this.$message.error(result.msg);
                            }
                        })
                    }
                    if (this.isAdd) {
                        api.addPosition(this.form).then((result) => {
                            if (result.success == true) {
                                this.$message.success(result.msg);
                                this.isAdd = false
                            } else {
                                this.$message.error(result.msg);
                            }
                        })
                        console.log(this.form);
                        this.getData()
                    }

                } else {
                    return;
                }
                this.editVisible = false;
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
