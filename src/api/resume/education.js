import request from '@/utils/request'

const api_name = '/api/job/edu'

export default{

    delEducationById(id){
        return request({
            url:`${api_name}/del/${id}`,
            method:'delete'
        })
    }
}