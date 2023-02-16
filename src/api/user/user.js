import request from '@/utils/request'

const api_name = '/api/job/user'

export default {
    // 获取列表
    getUserList(param) {
        return request({
            url: `${api_name}/page`,
            method: 'post',
            data:param
        })
    },
    // 更新
    updateUser(data) {
        return request({
            url: `${api_name}/update`,
            method:'put',
            data:data
        })
    },
    // 添加
    addUser(data) {
        return request({
            url: `${api_name}/add`,
            method:'post',
            data:data
        })
    },
    // 通过ID获得
    getUserById(id) {
        return request({
            url: `${api_name}/${id}`,
            method:'get'
        })
    },
    // 通过ID删除
    delUserById(id) {
        return request({
            url: `${api_name}/del/${id}`,
            method:'delete'
        })
    },
    // 通过ID批量删除
    delUserByIdList(data) {
        return request({
            url: `${api_name}/bathdel`,
            method:'delete',
            data:data
        })
    }
}