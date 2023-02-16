import request from '@/utils/request.js'

const api_name = '/api/job/application'

export default{

    getApplyList(data){
        return request({
            url:`${api_name}/page`,
            method:'post',
            data:data
        })
    },
    delApplyById(id){
        return request({
            url:`${api_name}/del/${id}`,
            method:'delete',
        })
    },
    batchDelApply(ids){
        return request({
            url:`${api_name}/batchDel`,
            method:'delete',
            data:ids
        })
    },
    batchPass(data){
        return request({
            url:`${api_name}/pass`,
            method:'post',
            data:data
        })
    },
    batchRefuse(data){
        return request({
            url:`${api_name}/refuse`,
            method:'post',
            data:data
        })
    }
}