/*
* 项目基础路径
* */

const baseUrl = '/fsrcs'
/*
* 登录
* */
export const loginApi = baseUrl + '/login'

/*
* 修改个人信息
* */
export const personInfoApi = baseUrl + '/user/update'

export const dynamicApi = baseUrl + '/dynamic/delete'

/**
 * 偏方管理/动态管理
 * @type {string}
 */
export const dynamicApiQuery = baseUrl + '/dynamic/select'
export const dynamicApiQueryAll = baseUrl + '/dynamic/query'
export const dynamicApiCreate = baseUrl + '/dynamic/create'
export const dynamicApiUpdate = baseUrl + '/dynamic/update'
export const dynamicApiDelete = baseUrl + '/dynamic/delete'

export const queryAllUserApi = baseUrl + '/user'

export const queryAllRole = baseUrl + '/role/queryAll'

export const updateRole = baseUrl + '/role/update'

export const createComment = baseUrl + '/comment/insert'
