<template>
    <div style="background-color:cornflowerblue; height:100%">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Walter Turncoat">
        <h1 id="title" class="heading" style="padding-left:520px; padding-top:40px; padding-bottom:40px; font-size:70px">My Courses</h1>
        <div class="div" v-for="course in courses" v-bind:key="course.id" style="padding-left:500px; padding-bottom:20px">
            <el-card class="card" style="width:40%;">
                <div
                    class="body"
                    style="height: 100%; display: flex; justify-content: space-between; align-items: center;"
                >
                    <span class="name">
                        {{ course.name }}
                    </span>
                    <el-button :id="'courseID' + course.id"
                        style="background-color:#008CBA; color:white"
                        @click="view(course)"
                    >View Tasks</el-button>
                </div>
            </el-card>
            <div class="task" v-for="task in course.taskObjs" v-bind:key="'taskID' + task.id">
                <el-card class="card2" :id="task.id" style="display:none; width:70%">
                    <div
                        class="body"
                        style="height: 100%; display: flex; justify-content: space-between; align-items: center;"
                    >
                        <span class="type">
                            {{ task.type }}
                        </span>
                        <span class="deadline">
                            Due: {{ task.deadline }}
                        </span>
                        <span class="info">
                            Instructions: {{ task.info }}
                        </span>
                        <span class="completed">
                            {{ task.completed }}
                        </span>
                        
                        <toggle-button :value="checkIfCompleted(task.id)" :height="35" :width="120" :font-size="15"
                            color="#08c708" :labels="{checked: 'Complete', unchecked: 'Incomplete'}" @change="toggle($event, task.id, course.id, course)"/>

                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {BASE_URL} from '../api.js'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { ToggleButton } from 'vue-js-toggle-button'
Vue.component('ToggleButton', ToggleButton)

export default {
    data() {
        return {
            courses: [],
            tasks: [],
            completedT: [],
            selected: 0,
        }
    },
    computed: {
        ...mapGetters(['getUser']),
    },
    methods: {
        // if taskID is in the student's string of completed task IDs, set toggle button's value to true
        checkIfCompleted(taskID) {
            for (let i = 0; i < this.completedT.length; i++) {
                if (this.completedT[i] == taskID) {
                    return true
                }
            }
            return false
        },
        async toggle(event, taskID, courseID, course) {

            // if value of toggle button is true, add task's ID to student's string of completed task IDs
           const user = JSON.parse(this.getUser)
            if (event.value == true) {
                const res = await axios.post(
                    `${BASE_URL}/mark_complete`,
                    {
                        taskId: taskID,
                        studentId: user.id
                    }
                )
            }
            else {
                /* toggle button's value is false, so task is incomplete. Remove task ID from student's string
                of completed task IDs */
                const response = await axios.post(
                    `${BASE_URL}/mark_incomplete`,
                    {
                        taskId: taskID,
                        studentId: user.id
                    }
                )
            }
        },

        // display or hide all tasks for the given course
        async view(course) {
            if (document.getElementById('courseID' + course.id).innerText == "View Tasks") {
                for (let t of course.taskObjs) {
                    document.getElementById(t.id).style.display = ""
                }
                document.getElementById('courseID' + course.id).innerText = "Hide Tasks"
            } else {
                for (let t of course.taskObjs) {
                    document.getElementById(t.id).style.display = "none"
                }
                document.getElementById('courseID' + course.id).innerText = "View Tasks"
            }
        },
        async getCompletedTasks() {
            const user = JSON.parse(this.getUser)
            const res = await axios.post(
                `${BASE_URL}/getcompletedtasks`,
                {
                    id: parseInt(user.id),
                }
            )
            this.completedT = res.data.array
        },
        
        // for each course in student's course array, create array of its task objects
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
            const res = await axios.post(
                `${BASE_URL}/getcourses`,
                {
                    id: parseInt(user.id),
                    role: user.role,
                }
            )
            this.courses = res.data.courseArray
            console.log(courses)
            this.tasks = res.data.taskArray
            this.createTaskObjArr()

        },
    },
    async mounted() {
        this.getCourses()
        this.getCompletedTasks()
    },
}
</script>

<style scoped>
.card {
    height: 100px;
    width: 1000px;
    margin: 20px;
}
.card2 {
    height: 100px;
    width: 1000px;
    margin: 20px;
    color: crimson;
}
.heading {
    font-family: 'Walter Turncoat', sans-serif;
}
</style>
