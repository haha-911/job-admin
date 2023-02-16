import request from '@/utils/request'

const api_name = '/api/job/category'

export default {
    // 分页获取列表
    getCategoryList(param) {
        return request({
            url: `${api_name}/page`,
            method: 'post',
            data:param
        })
    },
    // 获取所有
    getAll() {
        return request({
            url: `${api_name}/all`,
            method: 'get'
        })
    },
    // 更新
    updateCategory(data) {
        return request({
            url: `${api_name}/update`,
            method:'put',
            data:data
        })
    },
    // 添加
    addCategory(data) {
        return request({
            url: `${api_name}/add`,
            method:'post',
            data:data
        })
    },
    // 通过ID获得
    getCategoryById(id) {
        return request({
            url: `${api_name}/${id}`,
            method:'get'
        })
    },
    // 通过ID删除
    delCategoryById(id) {
        return request({
            url: `${api_name}/del/${id}`,
            method:'delete'
        })
    },
    // 通过ID批量删除
    delCategoryByIdList(data) {
        return request({
            url: `${api_name}/bathdel`,
            method:'delete',
            data:data
        })
    }
}