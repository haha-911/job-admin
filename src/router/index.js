import Vue from 'vue';
import Router from 'vue-router';

// // 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
 
// // push
// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
 
 
 
// // replace
// const originalReplace = Router.prototype.replace
// Router.prototype.replace= function replace(location) {
//   return originalReplace.call(this, location).catch(err => err)
// }

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
                },
                {
                    path: '/icon',
                    component: () => import( '@/components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '@/components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '@/components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '@/components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '@/components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '@/components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '@/components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '@/components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '@/components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '@/components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '@/components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '@/components/page/404.vue'),
                    meta: { title: '404' }                               
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/403.vue'),
                    meta: { title: '403' }
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
