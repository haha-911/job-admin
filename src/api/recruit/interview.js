import request from '@/utils/request.js'

const api_name = '/api/job/interview'

export default{
    getInterviewList(data){
        return request({
            url:`${api_name}/page`,
            method:"post",
            data:data
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
    },
    delInterview(data){
        return request({
            url:`${api_name}/del`,
            method:'delete',
            data:data
        })
    },

}
