import request from "@/utils/request";
const api_name = "/eduservice/teacher/";
export default {
  //1 讲师列表（条件查询分页）
  // cur 代表当前页
  // limit 代表每页记录数
  // teacher Query条件对象
  getTeacherListPage(cur, limit, teacherQuery) {
    return request({
      url: `/eduservice/teacher/pageTeacherCondition/${cur}/${limit}`,
      method: "post",
      //teacherQuery条件对象，后端使用RequestBody获取数据
      //data标识把对象转换为JSON进行传递到接口
      data: teacherQuery,
    });
  },
  deletedTeacherById(id) {
    return request({
      url: `/eduservice/teacher/${id}`,
      method: "delete",
    });
  },
  save(data) {
    return request({
      url: `/eduservice/teacher/addTeacher/`,
      method: "post",
      data: data,
    });
  },
  getTeacherInfo(id) {
    return request({
      url: `/eduservice/teacher/getTeacher/${id}`,
      method: "get",
    });
  },
  updateTeacher(data) {
    return request({
      url: `/eduservice/teacher/updateTeacher`,
      method: "put",
      data: data,
    });
  },
  // 获得全部老师
  getList() {
    return request({
      url: api_name,
      method: "get",
    });
  },
};
