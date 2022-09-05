import request from '@/utils/request'
const api_name = '/eduservice/video'
export default {
  saveVideoInfo(videoInfo) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: videoInfo
    })
  },
  getVideoInfoById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  updateVideoInfoById(videoInfo) {
    return request({
      url: `${api_name}`,
      method: 'put',
      data: videoInfo
    })
  },
  // 删除小节
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  // 删除视频
  removeVideoById(id) {
    return request({
      url: `/edu/oss/file/remove`,
      method: 'delete',
      data: {
        fileName: id
      }
    })
  }
}
