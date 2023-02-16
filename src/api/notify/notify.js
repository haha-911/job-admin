import request from '@/utils/request.js'

const api_name = '/api/job/notify'

export default{
    addNotify(data){
        return request({
            url:`${api_name}/add`,
            method:'post',
            data:data
        })
    },
    getNotifyList(data){
        return request({
            url:`${api_name}/page`,
            method:'post',
            data:data
        })
    },
    updateIsRead(data){
        return request({
            url:`${api_name}/read`,
            method:'put',
            data:data
        })
    },
    delNotify(data){
        return request({
            url:`${api_name}/del`,
            method:'delete',
            data:data
        })
    },
    getNotifyById(id){
        return request({
            url:`${api_name}/${id}`,
            method:'get'
        })
    },
    updateNotify(data){
        return request({
            url:`${api_name}/update`,
            method:'put',
            data:data
        })
    },
}