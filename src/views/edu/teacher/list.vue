<template>
    <div>
        <!--查询表单-->
        <el-form :inline="true" class="demo-form-inline" style="margin-top: 10px; text-align: center;">
            <el-form-item>
                <el-input v-model="teacherQuery.name" placeholder="讲师名" />
            </el-form-item>
            <el-form-item>
                <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
                    <el-option :value="1" label="高级讲师" />
                    <el-option :value="2" label="首席讲师" />
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间">
                <el-date-picker v-model="teacherQuery.begin" type="datetime" placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="teacherQuery.end" type="datetime" placeholder="选择截止时间"
                    value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
            <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>
        <!-- 表格 -->
        <el-table v-loading="listLoading" :data="list" element-loading-text="数据加载中" border fit highlight-current-row>
            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="80" />
            <el-table-column label="头衔" width="80">
                <template slot-scope="scope">
                    {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
                </template>
            </el-table-column>
            <el-table-column prop="intro" label="资历" />
            <el-table-column :formatter="timestampToTime" prop="gmtCreate" label="添加时间" width="160" />
            <el-table-column prop="sort" label="排序" width="60" />
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/teacher/save/' + scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination backgruod @size-change="handleSizeChange" @current-change="getList" :current-page.sync="page"
            :page-size="limit" layout="total, prev, pager, next, jumper" :total="total"
            style="padding: 30px 0; text-align: center;">
        </el-pagination>
    </div>
</template>
<script >
import teacher from '@/api/edu/teacher';
export default {
    data() {
        return {
            list: null, //查询之后接口返回值
            page: 1,//当前页
            limit: 10,//每页的记录数
            total: 0,//总记录数
            teacherQuery: {},//查询条件
            listLoading: true, //加载动画
        }
    },
    methods: {
        getList(page = 1) {
            this.page = page
            teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
                .then(res => {
                    console.log(res);
                    this.list = res.data.rows
                    this.total = res.data.total
                    this.listLoading = false
                })
                .catch(err => {
                    console.log(err);
                })
        },
        // 查询
        fetchData() {

        },
        // 清空
        resetData() {
            this.teacherQuery = {}
            this.getList()
        },
        //删除
        removeDataById(id) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return teacher.removeById(id)
            }).then(() => {
                this.fetchData()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
            })
        },
        // 转换时间戳变为格式化日期
        timestampToTime(row, column) {
            var date = new Date(row.gmtCreate) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() + ' '
            var h = date.getHours() + ':'
            var m = date.getMinutes() + ':'
            var s = date.getSeconds()
            return Y + M + D + h + m + s
        },
    },
    created() {
        // 调用获取数据
        this.getList()
    },
    mounted() {
    },
}
</script>