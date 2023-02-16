<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-people"></i> 日志管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                     登录日志
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="handleDelete()"
                >批量删除</el-button>
                <el-select v-model="query.state" @change="loginStatus" placeholder="全部日志" label="状态"
                        class="handle-select mr10">
                        <el-option key="0" label="登录成功" value="1" ></el-option>
                        <el-option key="1" label="登录异常" value="0" ></el-option>
                    </el-select>              
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handRefresh">重置</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" width="120px" align="center"></el-table-column>
                <el-table-column prop="ip" label="IP"></el-table-column>
                <el-table-column prop="isp" label="网络"></el-table-column>
                <el-table-column  label="地址"  align="center">
                    <template slot-scope="scope">
                       {{ scope.row.region }}省{{ scope.row.city }}市{{ scope.row.district }}
                    </template>
                </el-table-column>
                <el-table-column prop="msg" label="信息"></el-table-column>
                <el-table-column  label="登录时间" prop="createTime"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
           <!-- 分页组件 -->
            <div class="block" style="margin-top:50px;float:right">
            <el-pagination
            :current-page="query.page"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
        </div>
        </div>

        <!-- 编辑弹出框 --> 
        <el-dialog :title="visibleTitle"  :visible.sync="editVisible" width="30%">
           
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/log/log.js';
export default {
    name: 'category',
    data() {
        return {
            tableData: [],
            query:{            
                page: 1,
                pageSize: 5,
                state: "1"
            },
            multipleSelection: [],
            editVisible: false,
            visibleTitle:'',
            pageTotal: 0,
            form: {},
            rules:{}
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取日志列表
        getData() {
            api.getLoginLog(this.query).then((result) => {
                this.tableData = result.data.records
                this.pageTotal = result.data.total
            });
        },
        // 根据条件获取通知
        loginStatus(val){
            this.query.state = val
            this.getData()
        },
       
        // 重置查询表单
        handRefresh(){
            this.query.state = '1'
            this.query.page = 1
            this.getData()
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        // 删除操作
        handleDelete(val) {
            if(val){
                this.multipleSelection = []
                this.multipleSelection.push(val)
            }
            if(this.multipleSelection.length === 0){
                this.$message.error("未选中数据")
                return 
            }
            const ids = []

            this.multipleSelection.map((item)=>{
                ids.push(item.id)
            })
            console.log(ids)
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                api.delLoginlog(ids).then((result)=>{
                    if(result.success){
                        this.$message.success(result.msg);
                        this.getData()
                    }
                })   
            }).catch(() => {});
            this.multipleSelection = []
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(val);
        },
        // 添加操作
        handleAdd(){
           
        },
        // 编辑操作
        handleEdit(row) {
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
