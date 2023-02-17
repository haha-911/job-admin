<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{
                                    threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title
                            }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
</div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-user',
                    index: 'user',
                    title: '用户管理',
                    subs: [
                        {
                            index: 'user',
                            title: '求职者'
                        },
                        {
                            index: 'hr',
                            title: '招聘者'
                        },
                        {
                            index: 'admin',
                            title: '管理员'
                        },
                    ]
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: 'company',
                    title: '公司管理',
                    subs: [
                        {
                            index: 'company',
                            title: '公司列表'
                        },
                    ]
                },
                {
                    icon: 'el-icon-suitcase-1',
                    index: 'position',
                    title: '职位管理',
                    subs: [
                        {
                            index: 'category',
                            title: '职位分类'
                        },
                        {
                            index: 'position',
                            title: '职位列表'
                        },
                        {
                            index: 'toexamine',
                            title: '审核职位'
                        },
                    ]
                },
                {
                    icon: 'el-icon-s-finance',
                    index: 'recruit',
                    title: '招聘管理',
                    subs: [
                        {
                            index: 'apply',
                            title: '申请表单'
                        },
                        {
                            index: 'interview',
                            title: '面试表单'
                        }
                    ]
                },
                {
                    icon: 'el-icon-message-solid',
                    index: 'notify',
                    title: '通知管理',
                    subs: [
                        {
                            index: 'notify',
                            title: '通知表单'
                        },
                    ]
                },

                {
                    icon: 'el-icon-pie-chart',
                    index: 'log',
                    title: '日志管理',
                    subs: [
                        {
                            index: 'operlog',
                            title: '操作日志'
                        },
                        {
                            index: 'loginlog',
                            title: '登录日志'
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 220px;
}

.sidebar>ul {
    height: 100%;
}
</style>
