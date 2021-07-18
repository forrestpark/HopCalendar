<template>
    <v-app>
        <v-main>
            <el-menu
                v-if="$route.name != 'Login' && $route.name != 'CreateAccount'"
                class="el-menu-demo"
                mode="horizontal"
                style="display: flex; justify-content: space-between; align-items: center;"
            >
                <el-menu-item index="1" @click="pushHome">
                    <i class="el-icon-s-home"></i>
                    <span>Home</span>
                </el-menu-item>
                <el-radio-group v-model="view" v-if="$route.name == 'Home'">
                    <el-radio-button label="day">Daily</el-radio-button>
                    <el-radio-button label="week">Weekly</el-radio-button>
                    <el-radio-button label="month">Monthly</el-radio-button>
                </el-radio-group>
                <el-menu-item index="4" @click="pushLogin"
                    ><i class="el-icon-user"></i>
                    <span>Log Out</span></el-menu-item
                >
            </el-menu>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import state from './store/index.js'
export default {
    
    name: 'App',
    data() {
        return {
            view: 'month',
        }
    },
    watch: {
        view(val) {
            this.setMode(val)
        },
    },
    computed: {
        ...mapGetters(['getUser']),
    },
    methods: {
        ...mapActions([
            'setMode',
            'setAuthUser'
        ]),
        pushLogin() {
            this.setAuthUser(false)
            this.$router.push('/')
        },
        pushHome() {
            const user = JSON.parse(this.getUser)
            if (user.role == "student" || user.role == "Student") {
                    this.$router.push('/home')
            } else if (user.role == "instructor") {
                this.$router.push('/InstructorCourses')
            } else {
                this.$router.push('/HopCalAdmin')
            }
        },
    },
}
</script>