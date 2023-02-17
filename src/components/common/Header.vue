<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
               
                <!-- 用户头像 -->
                <div class="user-avator">
                    <el-image :src="userInfo.avatar" alt class="img"></el-image>
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ userInfo.nickname }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="changepwd">修改密码</el-dropdown-item>

                        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>


                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="旧密码" prop="oldPwd">
                    <el-input type="password" v-model="ruleForm.oldPwd" autocomplete="off"></el-input>
                  </el-form-item>
                <el-form-item label="新密码" prop="pass">
                  <el-input type="password" v-model="ruleForm.newPwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                  <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-button type="primary" @click="changePwd('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import bus from '../common/bus';
import api from '@/api/login/login'
export default {
    data() {
        var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
        return {
            collapse: false,
            fullscreen: false,
            dialogVisible:false,
            message: 2,
            userInfo: {},
            ruleForm: {
                id:'',
                newPwd: '',
                checkPass: '',
                oldPwd: ''
            },
            rules: {
                oldPwd: [
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                ],
                newPwd: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
            }
        }
    },

    // 监听器
    computed: {

    },
    created() {

        this.getUserInfo()

    },
    methods: {


        changePwd(formName) {
            this.$refs[formName].validate((valid) => {
          if (valid) {

            const param = {}
            param.oldPwd = this.ruleForm.oldPwd
            param.newPwd = this.ruleForm.newPwd
            console.log(param)
            api.updateUserPwd(this.userInfo.id,param).then((result) => {
                if (result.success){
                    this.$message.success(result.msg)
                    setTimeout(() => {
                        localStorage.clear()
                        this.$router.push('/login')
	                }, 1000);
                } else {
                    this.$message.error(result.msg)
                }
                this.dialogVisible = false
            }).catch((err) => {
                
            });
          } 
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
        getUserInfo() {
            let str = localStorage.getItem('userInfo')
            let data = JSON.parse(str)
            this.userInfo = data
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                localStorage.removeItem("token")
                this.$router.push('/login');
            }
            if (command == 'changepwd'){
                this.dialogVisible = true
                this.ruleForm = {}
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },

    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}

.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}

.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}

.header-right {
    float: right;
    padding-right: 50px;
}

.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}

.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}

.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}

.btn-bell .el-icon-bell {
    color: #fff;
}

.user-name {
    margin-left: 10px;
}

.user-avator {
    margin-left: 20px;
}

.user-avator .img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}

.el-dropdown-menu__item {
    text-align: center;
}
</style>
