import request from '@/utils/request'

const api_name = '/api/job/resume'


export default{


    getResumeById(id){
        return request({
            url:`${api_name}/${id}`,
            method:'get'
        })
    },
    getResumeByUserId(id){
        return request({
            url:`${api_name}/user/${id}`,
            method:'get'
        })
    },
    updateResumeInfo(data){
        return request({
            url:`${api_name}/update`,
            method:'put',
            data:data
        })
    },
    addResumeInfo(data){
        return request({
            url:`${api_name}/add`,
            method:'post',
            data:data
        })
    }

}