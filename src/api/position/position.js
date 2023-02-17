import request from '@/utils/request'

const api_name = '/api/job/position'

export default {
    // 获取列表
    getPositionList(param) {
        return request({
            url: `${api_name}/page`,
            method: 'post',
            data:param
        })
    },
    // 更新
    updatePosition(data) {
        return request({
            url: `${api_name}/update`,
            method:'put',
            data:data
        })
    },
    // 添加
    addPosition(data) {
        return request({
            url: `${api_name}/add`,
            method:'post',
            data:data
        })
    },
    // 通过ID获得
    getPositionById(id) {
        return request({
            url: `${api_name}/get/${id}`,
            method:'get'
        })
    },
    getPositionByCompanyId(id) {
        return request({
            url: `${api_name}/company/${id}`,
            method:'get'
        })
    },
    // 通过ID删除
    delPositionById(id) {
        return request({
            url: `${api_name}/del/${id}`,
            method:'delete'
        })
    },
    // 通过ID批量删除
    delPositionByIdList(data) {
        return request({
            url: `${api_name}/batchdel`,
            method:'delete',
            data:data
        })
    },
    changeState(id,status) {
        return request({
            url: `${api_name}/state/${id}/${status}`,
            method:'post'
        })
    },
    refusePosition(data){
        return request({
            url:`${api_name}/refuse`,
            method:'post',
            data:data
        })
    },
    toExaminePosition(data) {
        return request({
            url: `${api_name}/pass`,
            method:'post',
            data:data
        })
    },
    getAllExarmPosition(data){
        return request({
            url:`${api_name}/toExamine/all`,
            method:'post',
            data:data
        })
    }
}