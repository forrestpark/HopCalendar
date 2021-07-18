home.vue
<template>
    <div class="home" style="padding-top:20px; background-color:cornflowerblue; height:100%">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lobster&effect=3d-float">
        <v-toolbar-title class="font-effect-3d-float" v-if="$refs.calendar" style="padding-bottom: 20px; text-align:center; font-size:50px">
            {{ $refs.calendar.title }}
        </v-toolbar-title>
        <div class="content" style="display:flex; align-items: center;">
            <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-sheet height="600" style="width: 100%">
                <v-calendar
                    ref="calendar"
                    v-model="focus"
                    :weekdays="weekday"
                    :type="getMode"
                    :events="events"
                    @click:event="showEvent"
                    @click:more="viewDay"
                    @click:date="viewDay"
                    :event-overlap-mode="mode"
                    :event-overlap-threshold="30"
                    :event-color="getEventColor"
                    @change="getEvents"
                ></v-calendar>
            </v-sheet>
            <v-btn icon class="ma-2" @click="$refs.calendar.next()">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </div>
        <el-dialog :title="dialogName" :visible.sync="showDialog" width="30%">
            {{ dialogInfo }}
        </el-dialog>
        <div
            class="buttons"
            style="display: flex; justify-content: flex-end; margin-top: 20px; margin-right: 50px;"
        >
            <el-button type="primary" @click="pushMyCourse" style="background-color:white; color:darkblue">My Courses</el-button>
            <el-button type="primary" @click="pushAddCourse" style="background-color:white; color:darkblue">Add Course</el-button>
            <el-button type="primary" @click="pushDropCourse" style="background-color:white; color:darkblue">Drop Course</el-button>
            <el-button type="primary" @click="pushGradescope" style="background-color:white; color:darkblue">Update Tasks</el-button>
        </div>
    </div>
</template>



<script>
import axios from 'axios'
import {BASE_URL} from '../api.js'
import { mapActions, mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUserSecret)
export default {
    data: () => ({
        focus: '',
        type: 'month',
        mode: 'stack',
        modes: ['stack', 'column'],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        courses: [],
        tasks: [],
        value: '',
        events: [],
        colors: [
            'blue',
            'indigo',
            'deep-purple',
            'cyan',
            'green',
            'orange',
            'grey darken-1',
        ],
        names: [
            'Meeting',
            'Holiday',
            'PTO',
            'Travel',
            'Event',
            'Birthday',
            'Conference',
            'Party',
        ],
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        showDialog: false,
        dialogName: '',
        dialogInfo: '',
    }),
    computed: {
        ...mapGetters(['getUser', 'getMode']),
    },
    methods: {
        ...mapActions([
            'setMode'
        ]),
        // go to All Courses page
        pushAddCourse() {
            this.$router.push('AllCourses')
        },
        // go to Drop Courses page
        pushDropCourse() {
            this.$router.push('DropCourses')
        },
        // go to My Courses page
        pushMyCourse() {
            this.$router.push('MyCourses')
        },
        // go to page where you can update tasks from gradescope/blackboard 
        pushGradescope() {
            this.$router.push('GradescopeScraper')
        },
        viewDay ({ date }) {
            this.focus= date
            this.type = 'day'
            this.setMode("day")
        },
        getEvents({ start, end }) {
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

            const events = []
            for (let course of this.courses) {
                for (let task of course.taskObjs) {
                    events.push({
                        name: course.name + ': ' + task.type,
                        info: task.info,
                        start: new Date(Date.parse(task.deadline)),
                        end: new Date(Date.parse(task.deadline)),
                        color: this.colors[this.rnd(0, this.colors.length - 1)],
                        timed: false,
                    })
                }
            }
            this.events = events
        },
        getEventColor(event) {
            return event.color
        },
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        showEvent({ nativeEvent, event }) {
            this.showDialog = true
            this.dialogName = event.name
            this.dialogInfo = event.info
        },
    },
    async mounted() {
        const user = JSON.parse(this.getUser)
        const res = await axios.post(
            `${BASE_URL}/getcourses`,
            {
                id: parseInt(user.id),
                role: 'student',
            }
        )
        this.courses = res.data.courseArray
        this.tasks = res.data.taskArray

        // create array of task objects for each course
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

        // create calendar events out of all of the tasks
        const events = []
        for (let course of this.courses) {
            for (let task of course.taskObjs) {
                events.push({
                    name: course.name + ':' + task.type + ":" + task.info,
                    start: new Date(Date.parse(task.deadline)),
                    end: new Date(Date.parse(task.deadline)),
                    color: this.colors[this.rnd(0, this.colors.length - 1)],
                    timed: false,
                })
            }
        }
        this.events = events
        console.log(this.events)
    },
}
</script>

<style scoped>
.font-effect-3d-float {
    font-family: 'Lobster', sans-serif;
    color: black;
}
</style>
