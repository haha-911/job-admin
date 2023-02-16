import request from '@/utils/request'

const api_name = '/api/job/project'

export default{

    delProjectById(id){
        return request({
            url:`${api_name}/del/${id}`,
            method:'delete'
        })
    }
}