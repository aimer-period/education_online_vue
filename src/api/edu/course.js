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
  }
}
