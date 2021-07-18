import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import DropCourses from '../views/DropCourses.vue'
import AllCourses from '../views/AllCourses.vue'
import MyCourses from '../views/MyCourses.vue'
import CreateAccount from '../views/CreateAccount.vue'
import InstructorCourses from '../views/InstructorCourses.vue'
import GradescopeScraper from '../views/GradescopeScraper.vue'
import HopCalAdmin from '../views/HopCalAdmin.vue'
import state from '../store/index.js'
Vue.use(VueRouter)

const routes = [
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
    },
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/dropcourses',
        name: 'DropCourses',
        component: DropCourses,
        meta: { requiresAuth: true }
    },
    {
        path: '/allcourses',
        name: 'AllCourses',
        component: AllCourses,
        meta: { requiresAuth: true }
    },
    {
        path: '/mycourses',
        name: 'MyCourses',
        component: MyCourses,
        meta: { requiresAuth: true }
    },
    {
        path: '/instructorcourses',
        name: 'InstructorCourses',
        component: InstructorCourses,
        meta: { requiresAuth: true }
    },
    {
        path: '/gradescopescraper',
        name: 'GradescopeScraper',
        component: GradescopeScraper,
        meta: { requiresAuth: true }
    },
    {
        path: '/createaccount',
        name: 'CreateAccount',
        component: CreateAccount,
        meta: { requiresAuth: false }
    },
    {
        path: '/hopcaladmin',
        name: 'HopCalAdmin',
        component: HopCalAdmin,
        meta: { requiresAuth: true }
    },
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        console.log("here " + state.getters.getAuthUser)
        if (!state.getters.getAuthUser) {
            next({
                name: 'Login',
            })
        } else {
            next()
        }
    } else {
        next();
    }
})

export default router
