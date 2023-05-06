import request from '@/utils/request'

export default{
    login(data){
        return request({
            url:'/api/login',
            method:'post',
            data:data
        })
    },
    getUserInfo(){
        return request({
            url:'/api/getUser',
            method:'post'
        })
    },
    getPrevLogin(id){
        return request({
            url:`/api/prev/${id}`,
            method:'get'
        })
    },
    updateUserPwd(data){
        return request({
            url:`/api/job/user/changePwd`,
            method:'put',
            data:data
        })
    },
    getCount(){
        return request({
            url:`/api/getCount`,
            method:'get',
        })
    }
}