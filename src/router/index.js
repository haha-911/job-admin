import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import('@/components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import('@/view/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/user',
                    component: () => import('@/view/user/user.vue'),
                    meta: { title: '求职者' }
                },
                {
                    path: '/hr',
                    component: () => import('@/view/user/hr.vue'),
                    meta: { title: 'HR' }
                },
                {
                    path: '/admin',
                    component: () => import('@/view/user/admin.vue'),
                    meta: { title: '管理员' }
                },
                {
                    path: '/company',
                    component: () => import('@/view/company/companyList.vue'),
                    meta: { title: '公司列表' }
                },
                {
                    path: '/addCompany',
                    name: 'addCompany',
                    component: () => import('@/view/company/addCompany.vue'),
                    meta: { title: '添加公司' }
                },
                {
                    path: '/updateCompany',
                    name: 'updateCompany',
                    component: () => import('@/view/company/addCompany.vue'),
                    meta: { title: '修改公司' }
                },
                {
                    path: '/category',
                    component: () => import('@/view/position/category.vue'),
                    meta: { title: '职位分类' }
                },
                {
                    path: '/position',
                    component: () => import('@/view/position/positionlist.vue'),
                    meta: { title: '职位列表' }
                },
                {
                    path: '/toexamine',
                    component: () => import('@/view/position/toexamine.vue'),
                    meta: { title: '待审核职位' }
                },
                
                {
                    path:'/company',
                    component: () => import('@/view/company/companyList.vue'),
                    meta: { title: '公司列表' }
                },
                {
                    path:'/apply',
                    component: () => import('@/view/recruit/apply.vue'),
                    meta: { title: '申请表单' }
                },
                {
                    path:'/interview',
                    component: () => import('@/view/recruit/interview.vue'),
                    meta: { title: '面试表单' }
                },
                {
                    path:'/notify',
                    component: () => import('@/view/notify/notify.vue'),
                    meta: { title: '通知表单' }
                },
                {
                    path:'/operlog',
                    component: () => import('@/view/log/operlog.vue'),
                    meta: { title: '操作日志' }
                },
                {
                    path:'/loginlog',
                    component: () => import('@/view/log/loginlog.vue'),
                    meta: { title: '登录日志' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import('@/view/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
