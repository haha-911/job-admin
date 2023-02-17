import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import 'babel-polyfill';

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数添加主题
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 求职招聘后台管理`;
    next()
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
