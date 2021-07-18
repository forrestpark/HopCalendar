
<template>
    <div style="background-color:cornflowerblue; height : 100%; display:flex; justify-content:center; align-items:center;">
        <el-card v-loading="loading" style="height: 500px; width: 500px; display:flex; justify-content:center; align-items:center;">
            <h1>Update Tasks</h1>
            <el-form>
                <el-form-item>
                    <el-radio v-model="type" label="gradescope" id="gradescope">Gradescope</el-radio>
                    <el-radio v-model="type" label="blackboard" id="blackboard">Blackboard</el-radio>
                </el-form-item>
                <el-form-item label="JHED Email">
                    <el-input v-model="email" id="input_email"></el-input>
                </el-form-item>
                <el-form-item label="JHED Password">
                    <el-input v-model="password" id="input_pw" type="password"></el-input>
                </el-form-item>
            </el-form>
            <span style="padding-left:200px">
            <el-button id="update" @click="checkJHEDEmail()" style="background-color:deepskyblue; color:white; font-size:18px">
                Update
            </el-button>
            </span>
        </el-card>
    </div>
</template>

<script>
    import axios from 'axios'
    import {BASE_URL} from '../api.js'
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                type: "gradescope",
                email: 'tchung17@jh.edu',
                password: '@kA<sKLmYj2!&9_',
                loading: false,
            }
        },
        methods: {
            ...mapActions([
                'setUser'
            ]),
            async checkJHEDEmail() {
                this.validJHEDEmail = false
                const inputEmail = this.email
                // equality comparison (==) does not work if JSON.stringify used, need to use toString() here for some reason
                const emailDomain = inputEmail.split('@', 2)[1].toString()

                if (emailDomain == 'jh.edu' || emailDomain == 'jh.edu'
                    || emailDomain == "jh.edu" || emailDomain == "jh.edu") {
                    this.validJHEDEmail = true
                }
                if (!this.validJHEDEmail) {
                    this.$message({
                        message: 'Not a JHED email. Please enter a valid JHED email.',
                        type: 'warning',
                    })
                } else {
                    await this.update()
                }
            },
            async update() {
                try {
                    this.loading = true;
                    const response = await axios.post(`${BASE_URL}/gradescope_scraper`,
                    {
                        username: this.email,
                        password: this.password,
                        type: this.type
                    });
                    this.loading = false;
                    this.$message({
                        message: 'Successfully updated courses.',
                        type: 'success'
                    });
                } catch (err) {
                    this.loading = false;
                    this.$message({
                        message: 'There was an issue updating courses.',
                        type: 'warning'
                    });
                }
                //this.$router.push('/home')
            },
        },
    }
</script>

<style scoped>

</style>
