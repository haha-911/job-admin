import request from '@/utils/request'

const api_name = '/api/job/log'

export default{
    getLoginLog(data){
        return request({
            url:`${api_name}/login`,
            method:'post',
            data: data
        })
    },
    getOperLog(data){
        return request({
            url:`${api_name}/oper`,
            method:'post',
            data: data
        })
    },
    delOperlog(data){
        return request({
            url:`${api_name}/del/oper`,
            method:'delete',
            data: data
        })
    },
    delLoginlog(data){
        return request({
            url:`${api_name}/del/login`,
            method:'delete',
            data: data
        })
    }
}