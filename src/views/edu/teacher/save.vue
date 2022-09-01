<template>
    <div class="app-container">
        <el-form label-width="120px">
            <el-form-item label="讲师名称">
                <el-input v-model="teacher.name" />
            </el-form-item>
            <el-form-item label="讲师排序">
                <el-input-number v-model.Number="teacher.sort" controls-position="right" :min=0 />
            </el-form-item>
            <el-form-item label="讲师头衔">
                <el-select v-model="teacher.level" clearable placeholder="请选择">
                    <!--
          数据类型一定要和取出的json中的一致，否则没法回填
          因此，这里value使用动态绑定的值，保证其数据类型是number
        -->
                    <el-option :value="1" label="高级讲师" />
                    <el-option :value="2" label="首席讲师" />
                </el-select>
            </el-form-item>
            <el-form-item label="讲师资历">
                <el-input v-model="teacher.career" />
            </el-form-item>
            <el-form-item label="讲师简介">
                <el-input v-model="teacher.intro" :rows="10" type="textarea" />
            </el-form-item>
            <!-- 讲师头像：TODO -->
            <el-form-item label="讲师头像">
                <!-- 头像缩略图 -->
                <pan-thumb :image="teacher.avatar" />
                <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload"
                    style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow = true">
                    修改头像
                </el-button>

                <image-cropper v-show="imagecropperShow" :key="imagecropperKey" :width="300" :height="300"
                    :url="'/edu/oss/file/upload'" field="file" lang-type="en" @close="close"
                    @crop-upload-success="cropSuccess" />
            </el-form-item>
            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script >
import teacher from '@/api/edu/teacher';
import ImageCropper from '@/components/ImageCropper';
import PanThumb from '@/components/PanThumb';
export default {
    components: { ImageCropper, PanThumb },
    data() {
        return {
            teacher: {
                name: '',
                sort: 0,
                level: 1,
                career: '',
                intro: '',
                avatar: '',
            },
            saveBtnDisabled: false, // 保存按钮是否禁用,
            imagecropperShow: false,
            imagecropperKey: 0,
            BASE_API: process.env.BASE_API,
        }
    },
    methods: {
        //上传图片成功
        cropSuccess(resData) {
            this.imagecropperShow = false
            this.imagecropperKey = this.imagecropperKey + 1
            console.log(resData);
            this.teacher.avatar = resData.path
        },
        // 关闭上传图片
        close() {
            this.imagecropperShow = false
        },
        saveOrUpdate() {
            this.saveBtnDisabled = true
            // 判断修改还是添加
            // 根据teacher是否有id
            if (!this.teacher.id) {
                this.saveData()
            } else {
                this.updateTeacher()
            }

        },
        // 修改讲师的方法
        updateTeacher() {
            teacher.updateTeacher(this.teacher).then(res => {
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                })
                //回到讲师列表
                this.$router.push({ path: '/teacher/index' })
                this.saveBtnDisabled = false
            })
        },
        // 保存
        saveData() {
            teacher.save(this.teacher).then(response => {
                return this.$message({
                    type: 'success',
                    message: '保存成功!'
                })
            }).then(resposne => {
                this.$router.push({ path: '/teacher/index' })
            }).catch((response) => {
                // console.log(response)
                this.$message({
                    type: 'error',
                    message: '保存失败'
                })
                this.saveBtnDisabled = false
            })
        },
        //根据讲师ID获取信息
        getTeacherInfo(id) {
            teacher.getTeacherInfo(id).then(res => {
                this.teacher = res.data.message
            })
        },
        //初始化
        init() {
            if (this.$route.params && this.$route.params.id) {
                const id = this.$route.params.id
                this.getTeacherInfo(id)
            } else {
                // 否则就是新增页面，清空表单
                this.teacher = {}
                // 默认头像
                this.teacher.avatar = 'http://cdn.aimersin.top/img/Still%20you%20remember.png'
            }
        },
    },
    created() {
        this.init()
    },
    watch: {
        $route(to, from) { // 路由发生变法
            console.log(to.path);
            this.init()
        }
    },
    mounted() {

    },
}
</script>
<style scoped>
.avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
}
</style>