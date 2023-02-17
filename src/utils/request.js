import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router/index';

const service = axios.create({
    timeout: 5000
});

service.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');
        if (token != null) {
            config.headers.token = token;
        }
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res.success) {
            return res;
        }
        if (res.code == 208) {
            Message.error(res.msg);
            router.push('/login');
        }
        if (!res.success) {
            Message.error(res.msg);
        }
    },
    (error) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
