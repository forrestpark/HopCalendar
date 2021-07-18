
<template>
    <div style="background-color:cornflowerblue; height:100%; display:flex; justify-content:center; align-items:center;">
        <el-card style="height: 500px; width: 500px; display:flex; justify-content:center; align-items:center;">
            <!-- <h1>Hop Calendar</h1> -->
            <img :src="logo" alt="HopCalendar"
                height="40px"
                width="380px">
            <el-form>
                <el-form-item>
                    <el-radio v-model="role" label="student" id="student">Student</el-radio>
                    <el-radio v-model="role" label="instructor" id="instructor">Instructor</el-radio>
                    <el-radio v-model="role" label="admin" id="admin">Admin</el-radio>
                </el-form-item>
                <el-form-item label="Email">
                    <el-input v-model="email" id="input_email"></el-input>
                </el-form-item>
                <el-form-item label="HopCal Password">
                    <el-input v-model="password" id="input_pw" type="password"></el-input>
                </el-form-item>
            </el-form>
            <span style="padding-left:350px">
                <el-button id="login" @click="login()" style="background-color:deepskyblue; color:white; font-size:18px">
                    Login
                </el-button>
            </span>
            
            <br><br>
            <!-- create button redirects to create account view -->
            <span style="padding-left:300px">
                <el-button id="create" @click="create()">
                    Create Account
                </el-button>
            </span>
        </el-card>
    </div>
</template>

<script>
    import state from '../store/index.js'
    import axios from 'axios'
    import {BASE_URL} from '../api.js'
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                role: 'student',
                email: 'janedoe@jhu.edu',
                password: 'hellokitty',
                logo: require("../../HopCalendarLogoWhite.png")
            }
        },
        watch: {
            role(newValue, oldValue) {
                if (newValue == 'instructor') {
                    this.email = 'darvish@jhu.edu'
                    this.password = 'computer'
                }
                else if (newValue == 'student') {
                    this.email = 'janedoe@jhu.edu'
                    this.password = 'hellokitty'
                }
                else {
                    this.email = 'fantasticsniffle@gmail.com'
                    this.password = 'abc'
                }
            }
        },
        methods: {
            ...mapActions([
                'setUser',
                'setAuthUser'
            ]),
            async login() {
                //FOR INSTRUCTOR
                //DEFAULT LOGIN is 'janedoe@jhu.edu', 'hellokitty', student role.
                //If "Instructor" is selected, 'darvish@jhu.edu' and 'computer' are the default email and password
                //these are the only registered users in the database.

                // abc is admin's email and password
                if (this.email == '' || this.password == '') {
                    this.$message({
                        message: 'Please enter both an email and password',
                        type: 'warning'
                    });
                } else {
                    // admin login
                    if (this.role == "admin") {
                        if (this.email == "fantasticsniffle@gmail.com" && this.password == "abc") {
                            this.setAuthUser(true)
                            this.$router.push('/HopCalAdmin')
                            const object = {name: "Admin", role: "admin"}
                            this.setUser(JSON.stringify(object));
                        } else {
                            this.$message({
                                message: 'Incorrect email or password.',
                                type: 'warning'
                            });
                        }
                    } else {
                        // non-admin login
                        try {
                            const response = await axios.post(`${BASE_URL}/login`,
                            {
                                email: this.email,
                                password: this.password,
                                role: this.role
                            });

                            // go to user's homepage
                            if (this.role == 'student' || this.role == 'Student') {
                                this.setAuthUser(true)
                                this.$router.push('/home')
                            } else {
                                this.setAuthUser(true)
                                this.$router.push('/InstructorCourses')
                            }
                            
                            const user = response.data
                            const object = { id: user.id, name: user.name, courses: user.courses, role: this.role}
                            this.setUser(JSON.stringify(object));
                        } catch (err) {
                            this.$message({
                                message: 'Incorrect email or password.',
                                type: 'warning'
                            });
                        }

                    }
                }
            },
            async create() {
                // go to Create Account page 
                this.$router.push('/createaccount')
            },
        },
    }
</script>

<style scoped>

</style>
