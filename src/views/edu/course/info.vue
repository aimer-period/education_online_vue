<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select v-model="courseInfo.subjectParentId" placeholder="请选择" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课时 -->
      <el-form-item label="总课时">
        <el-input-number
          v-model="courseInfo.lessonNum"
          :min="0"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>
      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce v-model="courseInfo.description" :height="300"/>
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/edu/oss/file/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" style="width:700px;height:500px">
        </el-upload>
      </el-form-item>
      <!--  课程价格-->
      <el-form-item label="课程价格">
        <el-input-number
          v-model="courseInfo.price"
          :min="0"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import teacher from '@/api/edu/teacher'
import Tinymce from '@/components/Tinymce/index'

export default {
  components: { Tinymce },
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API, // 接口API地址
      OSS_PATH: 'http://cdn.aimersin.top/',
      courseInfo: {
        title: '',
        subjectId: '',
        subjectParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'http://cdn.aimersin.top/img/Still%20you%20remember.png',
        price: 0
      },
      courseId: '',
      teacherList: [], // 讲师列表
      subjectNestedList: [], // 一级分类列表
      subSubjectList: [], // 二级分类列表
      saveBtnDisabled: false// 保存按钮是否禁用

    }
  },
  created() {
    this.init()
    console.log(this.OSS_PATH)
    console.log('info created')
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getInfo()
      } else {
        // this.courseInfo = { ...defaultForm }
        this.initSubjectList()
        this.initTeacherList()
      }
    },
    // 根据课程id查询
    getInfo() {
      course.getCourseInfo(this.courseId)
        .then(res => {
          this.courseInfo = res.data.info
          // 查询所有的分类
          subject.getNestedTreeList()
            .then(res => {
              // 获得所有的一级分类
              this.subjectNestedList = res.data.data
              // 把一级分类进行循环
              for (let i = 0; i < this.subjectNestedList.length; i++) {
                const oneSubject = this.subjectNestedList[i]
                if (this.courseInfo.subjectParentId === oneSubject.id) {
                  // 获取一级分类所有的二级分类
                  this.subSubjectList = oneSubject.children
                  console.log(this.subSubjectList)
                }
              }
            })
          // 初始化所有的教师
          this.initTeacherList()
        })
    },
    // 上传管理
    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data.path
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    next() {
      console.log('next')
      this.saveBtnDisabled = true
      if (!this.$route.params.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 初始化讲师列表
    initTeacherList() {
      teacher.getList().then(response => {
        this.teacherList = response.data.items
      })
    },
    // 初始化一级类型选择
    initSubjectList() {
      subject.getNestedTreeList().then(response => {
        this.subjectNestedList = response.data.data
      })
    },
    // 一级目录改变
    subjectLevelOneChanged(value) {
      console.log(value)
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children
          this.courseInfo.subjectId = ''
        }
      }
    },
    // 保存
    saveData() {
      course.saveCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ path: '/edu/course/chapter/' + response.data.courseId })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
        // 取消保存按钮的禁用
        this.saveBtnDisabled = false
      })
    },
    // 修改课程信息
    updateData() {
      course.updateCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '修改课程信息成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ path: '/edu/course/chapter/' + this.courseId })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
        // 取消保存按钮的禁用
        this.saveBtnDisabled = false
      })
    }
  }
}
</script>
