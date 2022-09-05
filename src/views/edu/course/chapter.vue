<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-button type="text" @click="dialogChapterFormVisible = true">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chapterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id"
      >
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id"
          >
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="0">免费</el-radio>
            <el-radio :label="1">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频" ref="uploadForm">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="'/api/edu/oss/file/upload/video'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </div>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import teacher from '@/api/edu/teacher'
import video from '@/api/edu/video'

export default {
  data() {
    return {
      courseId: '',
      // 章节信息
      chapterVideoList: [],
      saveBtnDisabled: false, // 保存按钮是否禁用
      dialogChapterFormVisible: false, // 是否显示章节表单
      chapter: { // 章节对象
        title: '',
        sort: 0
      },
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的章节id
      video: {// 课时对象
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: '',
        videoOriginalName: '', // 视频的原名称
      },
      fileList: [],//上传文件列表
      OSS_PATH: process.env.OSS_PATH // 接口API地址
    }
  },
  created() {
    console.log('chapter created')
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getChapter(this.courseId)
    }
  },
  methods: {

    //=====================关于小节的方法=========================
    openVideo(chapterId){
      // 弹框
      this.dialogVideoFormVisible = true
      this.chapterId = chapterId
      // 清空
      this.video = {}
    },
    //视频上传成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.path
      this.video.videoOriginalName = file.name
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    // 删除视频之前获取ID
    beforeVodRemove(file, fileList){
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 删除视频
    handleVodRemove(file, fileList){
      // console.log(fileList)
      video.removeVideoById(this.video.videoSourceId).then(response=>{
        this.$message({
          type: 'success',
          message: response.message
        })
        // 将文件列表清空
        this.fileList = []
        // 重置视频资源id
        this.video.videoSourceId = ''
        // 重置视频名称
        this.video.videoOriginalName = ''
      })
    },
    saveOrUpdateVideo() {
      this.saveVideoBtnDisabled = true
      if (!this.video.id) {
        this.saveDataVideo()
      } else {
        this.updateDataVideo()
      }
    },
    // 保存小节信息
    saveDataVideo() {
      this.video.courseId = this.courseId
      this.video.chapterId = this.chapterId
      video.saveVideoInfo(this.video).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.helpSaveVideo()
      })
    },
    // 修改小节信息
    updateDataVideo(videoId) {
      //TODO 清空上传视频的记录
      this.saveVideoBtnDisabled = false
      video.updateVideoInfoById(this.video).then(response => {
        if(response.code == '20000'){
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.dialogVideoFormVisible = false
          this.helpSaveVideo()
          this.$refs.uploadForm.resetFields()
        }else{
          this.$message({
            type: 'success',
            message: response.message
          })
        }

      })
    },
    // 编辑小节信息，打开窗口
    editVideo(videoId){
      video.getVideoInfoById(videoId).then(res=>{
        this.video = res.data.item
      })
      this.fileList = [{'name': this.video.videoOriginalName}]
      this.dialogVideoFormVisible = true
    },
    removeVideo(videoId){
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return video.removeById(videoId)
      }).then(() => {
        this.getChapter(this.courseId)// 刷新列表
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },
    helpSaveVideo() {
      this.dialogVideoFormVisible = false// 如果保存成功则关闭对话框
      this.getChapter(this.courseId)// 刷新列表
      this.video.title = ''// 重置章节标题
      this.video.sort = 0// 重置章节标题
      this.video.videoSourceId = ''// 重置视频资源id
      this.fileList = [] // 重置上传列表
      this.saveVideoBtnDisabled = false
    },

    //=====================关于章节的方法=========================
    // 删除章节
    removeChapter(chapterId){
      this.$confirm('确定要删除该章节吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapter.removeById(chapterId)
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getChapter(this.courseId)
      })
    },
    // 修改章节信息的回显方法
    openEditChapter(id) {
      this.dialogChapterFormVisible = true
      chapter.getById(id).then(res => {
        this.chapter = res.data.item
      })
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (!this.chapter.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    saveData() {
      this.chapter.courseId = this.courseId
      chapter.save(this.chapter).then(response => {
        if(response.code=='20000'){
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.helpSave()
        }else{
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    updateData() {
      chapter.updateById(this.chapter).then(res => {
        // 关闭弹窗
        this.dialogChapterFormVisible = false
        // 提示
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        // 刷新页面
        this.helpSave()
      })
    },
    helpSave() {
      this.dialogChapterFormVisible = false// 如果保存成功则关闭对话框
      this.getChapter(this.courseId)
      this.chapter.title = ''// 重置章节标题
      this.chapter.sort = 0// 重置章节标题
      this.saveBtnDisabled = false
    },
    // 根据课程id获取章节信息
    getChapter(id) {
      chapter.getAllChapterVideo(id).then(res => {
        this.chapterVideoList = res.data.item
      })
    },
    previous() {
      console.log('previous')
      this.$router.push({ path: '/edu/course/info/' + this.courseId })
    },
    next() {
      console.log('next')
      this.$router.push({ path: '/edu/course/publish/' + this.courseId })
    },
  }
}
</script>
<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chapterList li {
  position: relative;
}

.chapterList p {
  /*float: left;*/
  font-size: 20px;
  margin: 10px 0;
  padding: 10px ;
  height: 70px;
  line-height: 50px;
  /*width: 100%;*/
  border: 1px solid #DDD;
}

.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

/*.videoList p {*/
/*  float: left;*/
/*  font-size: 14px;*/
/*  margin: 10px 0;*/
/*  padding: 10px;*/
/*  height: 50px;*/
/*  line-height: 30px;*/
/*  width: 100%;*/
/*  border: 1px dotted #DDD;*/
/*}*/
</style>
