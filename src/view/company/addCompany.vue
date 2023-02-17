<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 公司管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>添加公司</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="公司名称" prop="name">
                        <el-input v-model="form.name" width="200px"></el-input>
                    </el-form-item>
                    <el-form-item label="外文名称" prop="foreign">
                        <el-input v-model="form.foreignName"></el-input>
                    </el-form-item>
                    <el-form-item label="城市" prop="city">
                        <el-input v-model="form.city"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-radio-group v-model="form.state">
                            <el-radio :label="0">下架</el-radio>
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="2">待审核</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="公司使命">
                        <el-input type="textarea" rows="2" v-model="form.mission"></el-input>
                    </el-form-item>
                    <el-form-item label="LOGO">
                        <el-upload class="avatar-uploader" drag action="/api/file/upload" :on-success="handleAvatarSuccess" :headers="headerObject">
                            <img v-if="imgUrl" :src="imgUrl" class=avatar>
                            <img v-if="form.logo" :src="form.logo" class="avatar">
                            <div v-else>
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            </div>

                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="公司简介">
                        <el-input type="textarea" rows="5" v-model="form.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="mini" @click="addCompany">表单提交</el-button>
                        <el-button type="info" size="mini" @click="restData">重置</el-button>
                        <el-button size="mini" @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
</div>
</template>

<script>
import api from '@/api/company/company'
export default {
    name: 'addCompany',
    data() {
        return {
            form: {
                name: '',
                foreignName: '',
                city: '',
                state: '',
                mission: '',
                description: '',
                logo: ''
            },
            headerObject:{
                token:localStorage.getItem('token')
            },
            imgUrl: '',
        };
    },
    created() {
        this.updateCompany();
    },
    methods: {
        addCompany() {
            // 添加
            if (!this.form.id) {
                api.addCompany(this.form).then((result) => {
                    if (result.success) {
                        this.$message.success(result.msg)
                        this.form = {}
                        this.imgUrl = ''
                        this.$router.go(-1)
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            }

            // 更新
            if (this.form.id) {
                api.updateCompany(this.form).then((result) => {
                    if (result.success) {
                        this.$message.success(result.msg)
                        this.form = {}
                        this.imgUrl = ''
                        this.$router.go(-1)
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            }


        },
        // 接收传参
        updateCompany() {
            if (this.$route.params.company) {
                this.form = this.$route.params.company
            }
        },
        // 上传头像
        handleAvatarSuccess(response) {
            if (response.success == true) {
                this.form.logo = response.msg
                this.imgUrl = response.msg
                console.log(response.msg);
            } else {
                this.$message.error(response.msg + "请重新上传！")
            }
        },
        // 取消操作
        cancel() {
            this.$router.go(-1)
        },
        // 重置数据
        restData() {
            this.form = {}
            this.imgUrl = ""
        },
        // 保存并继续添加

    }
};
</script>

<style scoped>
.avatar {
    width: 100%;
    height: 100%;
    display: block;
}
</style>