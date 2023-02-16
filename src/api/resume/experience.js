import request from '@/utils/request'

const api_name = '/api/job/exper'

export default{

    delExperienceById(id){
        return request({
            url:`${api_name}/del/${id}`,
            method:'delete'
        })
    }
}