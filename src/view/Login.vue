<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">合马管理系统登录</div>
            <el-form :model="param" :rules="rules" ref="login" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="param.password"
                        @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
</div>
</template>

<script>
import api from '@/api/login/login';

export default {
    data: function () {
        return {
            param: {
                username: ''
            },
            userInfo: {},
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.param.username = this.param.username.trim()
            this.$refs.login.validate(valid => {
                if (valid) {
                    api.login(this.param).then((result) => {
                        if (result.success) {
                            const token = result.data
                            localStorage.setItem('token', token)
                            this.$message.success(result.msg);
                            this.getUserInfo()
                        } else {
                            this.$message.error(result.msg)
                        }

                    })

                } else {
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        },
        getUserInfo() {
            api.getUserInfo().then((result) => {
                this.userInfo = result.data
                sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
                this.$router.push("/dashboard")
            })
        }
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/bg.png);
    background-size: 100%;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

.ms-content {
    padding: 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>