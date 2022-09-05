import request from '@/utils/request'

const api_name = '/eduservice/course'

export default {
  // 保存课程信息
  saveCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/save-course-info`,
      method: 'post',
      data: courseInfo
    })
  },
  // 根据id获取课程信息
  getCourseInfo(courseId) {
    return request({
      url: `${api_name}/${courseId}`,
      method: 'get'
    })
  },
  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/`,
      data: courseInfo,
      method: 'post'
    })
  },
  // 根据id获取课程发布信息
  getPublishCourseInfo(courseId) {
    return request({
      url: `${api_name}/getPublishCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  // 根据id发布课程
  publishCourse(courseId) {
    return request({
      url: `${api_name}/publish-course/${courseId}`,
      method: 'put'
    })
  },
  // 分页查询课程列表
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  // 根据ID删除课程
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete',
    })
  }
}
