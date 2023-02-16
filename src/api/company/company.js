import request from '@/utils/request'

const api_name = '/api/job/company'

export default {

    getAll() {
        return request({
            url:`${api_name}/all`,
            method:'get'
        })
    },
    getCompanyById(id){
        return request({
            url:`${api_name}/get/${id}`,
            method:'get'
        })
    },
    getCompanyList(data) {
        return request({
            url:`${api_name}/page`,
            method:'post',
            data:data
        })
    }, 
    batchChangeStatus(ids){
        return request({
            url:`${api_name}/batchState`,
            method:'post',
            data:ids
        })
    },
    changeState(id,state){
        return request({
            url:`${api_name}/${id}/${state}`,
            method:'post'
        })
    },
    delCompanyById(id){
        return request({
            url:`${api_name}/del/${id}`,
            method:'delete'
        })
    },
    batchDelCompany(ids){
        return request({
            url:`${api_name}/batchDel`,
            method:'delete',
            data:ids
        })
    },
    addCompany(data){
        return request({
            url:`${api_name}/add`,
            method:'post',
            data:data 
        })
    },
    updateCompany(data){
        return request({
            url:`${api_name}/update`,
            method:'put',
            data:data 
        })
    }
}