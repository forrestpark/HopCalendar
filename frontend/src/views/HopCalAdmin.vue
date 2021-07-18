<template>
    <div style="background-color:cornflowerblue; height:100%">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Walter Turncoat">
        <h1 class="heading" style="padding-left: 500px; padding-top: 20px; padding-bottom: 20px">Welcome, Admin</h1>
        <div v-if="potentialInstructors.length == 0">
            <h2 style="padding-left: 500px">There are 0 pending instructors.</h2>
        </div>
        <div v-if="potentialInstructors.length != 0" >
        <div class="div" v-for="potentialI in potentialInstructors" v-bind:key="potentialI.id" style="padding-left:500px">
            <el-card class="card" style="width:50%">
                <div
                    class="body"
                    style="height: 100%; display: flex; align-items: center; "
                >
                    <span class="name" >
                        <strong>Pending Instructor</strong><br>Name: {{ potentialI.name }}<br>Email: {{ potentialI.email }}<br>Course(s): {{ potentialI.courseNumbers }} 
                    </span>
                    <span style="padding-left:30px">
                    <el-button
                        style="background-color:#008CBA; color:white;"
                        @click="validate(potentialI)"
                    >
                        Validate
                    </el-button>
                    <el-button
                        style="background-color:#008CBA; color:white"
                        @click="removePotentialInstructor(potentialI.email)"
                    >
                        Reject
                    </el-button>
                    </span>
                    
                </div>
            </el-card>
        </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {BASE_URL} from '../api.js'
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                potentialInstructors: []
            }
        },
        async mounted() {
            this.getPotentialInstructors()
        },
        methods: {
            async getPotentialInstructors() {
                const res = await axios.post(
                    `${BASE_URL}/getpotentialinstructors`
                )
                this.potentialInstructors = res.data
            },
            async removePotentialInstructor(email) {
                const response = await axios.post(
                    `${BASE_URL}/removepotentialinstructor`, {
                        email: email,
                    }
                )
                this.getPotentialInstructors()
            },

            // send email to validated instructor saying their account has been made successfully
            sendConfirmationEmail(potentialI) {
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
                    To : potentialI.email,
                    From : "fantasticsniffle@gmail.com",
                    Subject : "Thank you for joining HopCalendar!",
                    Body : "Congratulations! Your HopCalendar instructor account has been successfully created."
                });
            },

            // validate the given potential instructor by creating an instructor account for them
            async validate(potentialI) {
                const res = await axios.post(
                    `${BASE_URL}/create_account`, {
                        name: potentialI.name,
                        password: potentialI.password,
                        role: "potentialinstructor",
                        email: potentialI.email,
                        courses: potentialI.courses,
                    }
                )
                this.sendConfirmationEmail(potentialI)
                this.removePotentialInstructor(potentialI.email)
                alert(potentialI.name + " has successfully been validated!")
            }
        },
    }
</script>

<style scoped>
.heading {
    font-family: 'Walter Turncoat', sans-serif;
    font-size: 70px
}
</style>
