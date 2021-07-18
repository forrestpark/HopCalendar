<template>
    <div style="background-color:cornflowerblue; height:100%">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Walter Turncoat">
        <h1 class="heading" style="padding-left: 500px; padding-bottom:20px;">My Courses</h1>
        <div class="div" v-for="course in courses" v-bind:key="course.id" style="padding-left:500px">
            <el-card style="width: 600px;">
                <strong>{{ course.name }}</strong>
                <div
                    class="div"
                    v-for="task in course.taskObjs"
                    v-bind:key="task.id"
                >
                    <br>
                    <span style="padding-right: 30px; display:block"><strong>Date: </strong> {{ task.deadline }}<br><strong>Title: </strong>{{ task.type }}<br><strong>Details: </strong>{{ task.info }}</span>

                    <!-- Edit Task form -->
                    <!--<el-dialog
                        title="Edit Task"
                        :visible.sync="dialogVisible"
                        width="30%"
                        @open="
                            newType = task.type
                            newDeadline = task.deadline
                            newInfo = task.info
                        "
                    >-->
                        <!-- Edit task form -->
                        <el-form style="display:none;" :id="task.id">
                            <br>
                            <el-input style="width:70%; padding-bottom:5px"
                                placeholder="Title"
                                v-model="updatedType"
                            ></el-input>
                            <el-input style="width:70%; padding-bottom:5px"
                                placeholder="Date"
                                v-model="updatedDeadline"
                            ></el-input>
                            <el-input style="width:70%; padding-bottom:10px"
                                placeholder="Details"
                                v-model="updatedInfo"
                            ></el-input>
                            
                            <span style="padding-left:210px;">
                            <el-button style="background-color:deepskyblue; color:white" @click="editTask(task.id, task)">
                                Update
                            </el-button>
                            <el-button style="background-color:red; color:white" @click="hideEditTaskForm(task.id)">
                                Cancel
                            </el-button>
                            <br><br>
                            </span>
                        </el-form>
                        <!--<span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">Cancel</el-button>
                            <el-button
                                type="primary"
                                @click="
                                    dialogVisible = false
                                    editTask(prevTask.id)
                                ">Confirm</el-button>
                        </span>-->
                    <!--</el-dialog>-->

                    <el-button
                        style="background-color:#008CBA; color:white"
                        @click="
                            showEditForm(task.id)
                            updatedType = task.type
                            updatedDeadline = task.deadline
                            updatedInfo = task.info
                        "
                    >
                        Edit task</el-button
                    >

                    <el-button
                        style="background-color:red; color:white"
                        @click="deleteTask(course.id, task.id)"
                    >
                        Delete task
                    </el-button>
                </div>

                <!-- Add Task form -->
                <el-dialog
                    title="Add Task"
                    :visible.sync="dialogAddVisible"
                    width="30%"
                >
                    <el-form>
                        <el-input
                            placeholder="Title"
                            v-model="newT"
                        ></el-input>
                        <el-input
                            placeholder="Date"
                            v-model="newD"
                        ></el-input>
                        <el-input
                            placeholder="Details"
                            v-model="newI"
                        ></el-input>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogAddVisible = false"
                            >Cancel</el-button
                        >
                        <el-button
                            type="primary"
                            @click="
                                dialogAddVisible = false
                                addTask(prevCourse.id)
                            "
                            >Confirm</el-button
                        >
                    </span>
                </el-dialog>
                <br>
                <el-button
                    style="background-color:#1dbf04; color:white"
                    @click="
                        dialogAddVisible = true
                        prevCourse = course
                    "
                >
                    Add task
                </el-button>
            </el-card>
            <br>
        </div>

        <p style="padding-left: 960px; padding-bottom:10px">
            <el-button
                style="background-color:#008CBA; color:white"
                @click="dropCourse"
                >Drop course</el-button
            >
            <el-button
                style="background-color:#008CBA; color:white"
                @click="addCourse"
                >Add course</el-button
            >
        </p>
    </div>
</template>

<script>
import axios from 'axios'
import {BASE_URL} from '../api.js'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            courses: [],
            tasks: [],
            dialogVisible: false,
            dialogAddVisible: false,
            updatedType: '',
            updatedDeadline: '',
            updatedInfo: '',
            newT: '',
            newD: '',
            newI: ''
        }
    },
    computed: {
        ...mapGetters(['getUser']),
    },
    async mounted() {
        this.getCourses()
    },
    methods: {
        // go to Drop Courses page
        dropCourse() {
            this.$router.push('DropCourses')
        },

        // go to All Courses page
        addCourse() {
            this.$router.push('AllCourses')
        },

        // add task to course
        async addTask(courseID) {
            const res = await axios.post(
                `${BASE_URL}/add_task`,
                {
                    courseId: courseID,
                    type: this.newT,
                    deadline: this.newD,
                    info: this.newI,
                }
            )
            this.getCourses()
        },

        // delete task from course
        async deleteTask(courseID, taskID) {
            const user = JSON.parse(this.getUser)
            const response = await axios.post(
                `${BASE_URL}/delete_task`,
                {
                    courseId: courseID,
                    taskId: taskID,
                }
            )
            this.getCourses()
        },

        showEditForm(taskID) {
            document.getElementById(taskID).style.display = ''
        },
        hideEditTaskForm(taskID) {
            document.getElementById(taskID).style.display = 'none'
        },
        // update task
        async editTask(taskID, task) {
            this.hideEditTaskForm(taskID)
            const res = await axios.post(`${BASE_URL}/edit_task`, {
                taskId: taskID,
                type: this.updatedType,
                deadline: this.updatedDeadline,
                info: this.updatedInfo,
            })
            this.getCourses()
        },

        // for each course in instructor's course array, create array of its task objects
        createTaskObjArr() {
            this.courses.forEach(course => {
                course.taskObjs = []
                let taskIds = course.tasks.split(',') //ids stored in the course obj
                taskIds.forEach(id => {
                    //1, 2
                    this.tasks.forEach(task => {
                        //looping through all tasks objs from backend
                        //if we find id we are looking for, add it to the taskObjs array.
                        if (parseInt(id) === task.id) {
                            course.taskObjs.push(task)
                        }
                    })
                })
            })
        },
        async getCourses() {
            const user = JSON.parse(this.getUser)
            const res = await axios.post(`${BASE_URL}/getcourses`, {
                id: parseInt(user.id),
                role: 'instructor',
            })
            this.courses = res.data.courseArray
            this.tasks = res.data.taskArray
            this.createTaskObjArr()
        },
    },
}
</script>

<style scoped>
.heading {
    font-family: 'Walter Turncoat', sans-serif;
    font-size: 70px
}
</style>
