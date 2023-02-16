import request from '@/utils/request'

const api_name = '/api/job/hrCompany'

export default {

    getAll(id) {
        return request({
            url:`${api_name}/all/${id}`,
            method:'get'
        })
    }
}