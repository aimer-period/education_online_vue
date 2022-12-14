import request from '@/utils/request'

const api_name = '/eduservice/chapter'

export default {
  // 获取所有的章节与小节
  getAllChapterVideo(courseId) {
    return request({
      url: `${api_name}/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  save(chapter) {
    return request({
      url: api_name,
      method: 'post',
      data: chapter
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  updateById(chapter) {
    return request({
      url: `${api_name}/${chapter.id}`,
      method: 'put',
      data: chapter
    })
  }
}
