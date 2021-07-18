
<template>
    <div
        style="background-color:cornflowerblue; height:100%; display:flex; justify-content:center; align-items:center;"
    >
        <el-card
            style="height: 800px; width: 500px; display:flex; justify-content:center; align-items:center;"
        >
        <v-alert type="success" :value="instrAlertVisible" >
            Your information has been received. You'll receive an email if approved.
        </v-alert>
        <v-alert type="success" :value="studentAlertVisible" >
            Account successfully created!
        </v-alert>
        <v-alert type="warning" dismissible :value="invalidEmailAlertVisible" >
            That email address is already taken. Try another.
        </v-alert>

            <h1 id="title">Create Account for Hop Calendar</h1>
            <el-form>
                <el-form-item>
                    <el-radio v-model="role" label="student" id="student"
                        >Student</el-radio
                    >
                    <el-radio v-model="role" label="instructor" id="instructor"
                        >Instructor</el-radio
                    >
                </el-form-item>
                <el-form-item label="Your JHED Email Address (@jh.edu or @jhu.edu)">
                    <el-input v-model="email" id="input_email"></el-input>
                </el-form-item>
                <el-form-item label="HopCal Password (length of 8 or longer)">
                    <el-input v-model="password" id="input_pw"></el-input>
                </el-form-item>
                <el-form-item label="Name">
                    <el-input v-model="name" id="input_name"></el-input>
                </el-form-item>
                <el-form-item style="padding-right:80px" v-if="role == 'instructor'" label="Course ID(s) (if entering multiple courses, please separate with commas like this: 500132,500133)">
                    <el-input v-model="courseNumbers" id="input_course"></el-input>
                </el-form-item>
            </el-form>

            <span style="padding-left:350px">
                <el-button id="validation" @click="validation" style="background-color:deepskyblue; color:white; font-size:18px">
                    Submit
                </el-button>
            </span>
            <br><br>

            <span style="padding-left:290px">
                <el-button id="gotologin" @click="pushLogin">
                    Back to Login Page
                </el-button>
            </span>

            <el-dialog
                title="We have emailed you a code. Please enter it below."
                :visible.sync="dialogCodeVisible"
                width="30%"
            >
                <el-form>
                    <el-input
                        placeholder="Code"
                        v-model="inputCode"
                    ></el-input>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogCodeVisible = false"
                        >Cancel</el-button
                    >
                    <el-button
                        type="primary"
                        @click="
                            dialogCodeVisible = false
                            verifyCode(inputCode)
                        "
                        >Enter</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script >
import axios from 'axios'
import {BASE_URL} from '../api.js'
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            role: 'student',
            password: '',
            name: '',
            email: '',
            courseNumbers: '',
            dialogCodeVisible: false,
            instrAlertVisible: false,
            studentAlertVisible: false,
            invalidEmailAlertVisible: false,
            validInput: false,
            validJHEDEmail: false,
            validPassword: false,
            noFieldsEmpty: true,
            inputCode: '',
            code: '',
            courseIDs: '',
            
        }
    },
    methods: {
        ...mapActions(['setUser']),
       async createStudentAccount() {
            try {
                const response = await axios.post(
                    `${BASE_URL}/create_account`,
                    {
                        email: this.email,
                        password: this.password,
                        role: this.role,
                        name: this.name,
                    }
                )
                this.studentAlertVisible = true
                var r = this.$router
                setTimeout(function(){ r.push('/') }, 2000);
            } catch (err) {
                this.$message({
                    message: 'Existing email',
                    type: 'warning',
                })
            }
        },
        async createPotentialInstrAccount() {
            try {
                const response = await axios.post(
                    `${BASE_URL}/createpotentialinstructor`,
                    {
                        password: this.password,
                        name: this.name,
                        email: this.email,
                        courses: this.courseIDs,
                        courseNumbers: this.courseNumbers
                    }
                )
                this.instrAlertVisible = true
                var r = this.$router
                setTimeout(function(){ r.push('/') }, 4000);
            } catch (err) {
                this.$message({
                    message: 'Existing email',
                    type: 'warning',
                })
            }
        },
        pushLogin() {
            this.$router.push('/')
        },

        async checkJHEDEmail() {
            try {
                this.validJHEDEmail = false
                const inputEmail = this.email
                // equality comparison (==) does not work if JSON.stringify used, need to use toString() here for some reason
                const emailDomain = inputEmail.split('@', 2)[1].toString()

                if (emailDomain == 'jhu.edu' || emailDomain == 'jh.edu'
                    || emailDomain == "jhu.edu" || emailDomain == "jh.edu") {
                    this.validJHEDEmail = true
                }
                if (this.validJHEDEmail == false) {
                    this.$message({
                        message: 'Not a JHED email. Please enter a valid JHED email.',
                        type: 'warning',
                    })
                }
            } catch (err) {
                this.$message({
                    message: 'Please enter a valid JHED email',
                    type: 'warning',
                })
            }
        },

        async checkValidPassword() {
            this.validPassword = false
            const inputPassword = this.password.toString()
            const passwordLength = inputPassword.length

            if (passwordLength < 8) {
                this.$message({
                    message: 'Please enter a valid password. Passwords need to be of length 8 or longer.',
                    type: 'warning',
                })
            } else {
                this.validPassword = true
            }
        },

        // check if there is already a student/instructor with an account under this email
        async checkExistingEmail() {
            var r = this.$router
            this.invalidEmailAlertVisible = false
            this.validInput = false
            const response = await axios.post(
                `${BASE_URL}/getEmailAddress`,
                {
                    role: this.role,
                    email: this.email
                }
            )
            if (response.data == false) {
                this.validInput = false
            } else {
                this.validInput = true
            }
            if (this.validInput == false) {
                //r.push('/#/createaccount')
                
                this.$message({
                    message: 'An account already exists under this email',
                    type: 'warning',
                })
            }
        },
        checkEmptyFields() {
            if (this.email == '' || this.password == '' || this.name == '') {
                this.noFieldsEmpty = false
            }
            if (this.role == 'instructor') {
                if (this.courseNumbers == '') {
                    this.noFieldsEmpty = false
                }
            }
            if (!this.noFieldsEmpty) {
                this.$message({
                    message: 'Please fill out all fields.'
                });
            }
        },
        async validation() {
            await this.checkEmptyFields()
            if (this.noFieldsEmpty) {
                await this.checkJHEDEmail()
                await this.checkExistingEmail()
                await this.checkValidPassword()

                if (this.validJHEDEmail && this.validInput && this.validPassword) {
                    this.code = Math.floor(Math.random() * 90000) + 10000

                    // email this number to the user
                    /* SmtpJS.com - v3.0.0 */
                    var Email = { send: function (a) { 
                        return new Promise(function (n, e) { 
                            a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; 
                            var t = JSON.stringify(a); 
                            Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { 
                                n(e) 
                                }) 
                            }) 
                        }, ajaxPost: function (e, n, t) { 
                                var a = Email.createCORSRequest("POST", e); 
                                a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { 
                                    var e = a.responseText; 
                                    null != t && t(e) 
                                }, 
                                a.send(n) 
                        }, ajax: function (e, n) { 
                                var t = Email.createCORSRequest("GET", e); 
                                t.onload = function () { 
                                    var e = t.responseText; 
                                    null != n && n(e) 
                                }, 
                                t.send() 
                        }, createCORSRequest: function (e, n) { 
                                var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t 
                        } 
                    };
                
                    Email.send({
                        Host : "smtp.gmail.com",
                        Username : "fantasticsniffle@gmail.com",
                        Password : "fan12345!",
                        To : this.email,
                        From : "fantasticsniffle@gmail.com",
                        Subject : "HopCalendar: Here's Your Code to Finish Setting Up Your Account",
                        Body : this.code
                    }).then(
                        //show dialog box to have user enter code
                        this.dialogCodeVisible = true
                    );
                } /*else {
                    this.$message({
                        message: 'Please fill out all fields',
                        type: 'warning'
                    });
                }*/
            }
        },
        async getCourseIDs() {
            const response = await axios.post(
                `${BASE_URL}/getcourseids`,
                {
                    courseNumbers: this.courseNumbers
                }
            )
            this.courseIDs = response.data
        },
        async verifyCode(inputCode) {
            if (this.code == inputCode) {
                if (this.role == 'student') {
                    await this.createStudentAccount()
                } else {
                    await this.getCourseIDs()
                    await this.createPotentialInstrAccount()
                }
            }  else {
                    alert("Invalid code")
            }
        },
    },
}
</script>

<style scoped>
</style>
