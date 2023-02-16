<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-people"></i> 职位分类
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-friendadd"
                    class="handle-del mr10"
                    @click="handleAdd"
                >添加职位</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="职位名称" class="handle-input mr10"></el-input>                
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
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
            <el-form ref="form" :model="form" :rules="rules" label-width="70px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input type="textarea"  v-model="form.description"></el-input>
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
import api from '@/api/category/category';
export default {
    name: 'category',
    data() {
        return {
            tableData: {},
            query:{            
                page: 1,
                pageSize: 5,
                name: ""
            },
            multipleSelection: [],
            editVisible: false,
            isAdd: false,
            visibleTitle:'',
            pageTotal: 0,
            form: {},
            rules:{
                name:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                description:[
                    { required: true, message: '请输入描述', trigger: 'blur' },
                ]
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 用户列表
        getData() {
            api.getCategoryList(this.query).then((result) => {
                this.tableData = result.data.records
                this.pageTotal = result.data.total
            });
        },
        // 重置查询表单
        handRefresh(){
            this.query.name = ''
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
                api.delCategoryById(val.id).then((result)=>{
                    if(result.success){
                        this.$message.success(result.msg);
                        this.getData()
                    }else{
                         this.$message.error(result.msg);
                    }
                })   
            }).catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(val);
        },
        // 批量删除
        delAllSelection() {
            if(this.multipleSelection.length ==0){
                this.$message.error("未选中数据")
                return 
            }
            const ids = []
        this.multipleSelection.map((item)=>{
            const cat = {}
            cat.id = item.id
            cat.name = item.name
            ids.push(cat)
        })
           console.log(ids);
           this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
           }).then(()=>{
              api.delCategoryByIdList(ids).then((result)=>{
            if(result.success){

                this.$message.success("删除成功！")
               
                this.getData()
                setTimeout(()=>{
                    if(result.msg != ""){
                    this.$message.info(result.msg+"有正在招聘的职位，暂不能删除！")
                    } 
                },1)
                
            }else{
                this.$message.error(result.msg)
            }
           }).catch(()=>{})
           })
            this.multipleSelection = [];
        },
        // 添加操作
        handleAdd(){
           this.visibleTitle = "添加"
            this.form = {}
            this.editVisible = true
            this.isAdd = true
        },
        // 编辑操作
        handleEdit(row) {
           api.getCategoryById(row.id).then((result) =>{
            if(result.success == true){
                this.form = result.data
            }else{
                this.$message.error(result.msg)
            }
           })
               this.visibleTitle = "编辑"
               this.editVisible = true
        },
        resetForm(){
            this.form = {}
        },
        // 保存编辑/添加
        saveEdit(form) {
          this.$refs[form].validate((valid) => {
          if (valid) {
            if(!this.isAdd){
                api.updateCategory(this.form).then((result) =>{ 
                if(result.success == true){
                        this.$message.success(result.msg);
                        this.getData()
                    }else{
                         this.$message.error(result.msg);
                    }
           })
           }
           if(this.isAdd){
            api.addCategory(this.form).then((result)=>{
                if(result.success == true){
                        this.$message.success(result.msg);
                        this.isAdd = false
                    }else{
                         this.$message.error(result.msg);
                    }
            })
            this.getData()
           }
           this.editVisible = false
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
