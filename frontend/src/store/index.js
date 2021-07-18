import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
const vuexPersist = new VuexPersist({
    key: 'my-app',
    storage: window.localStorage,
})
Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [vuexPersist.plugin],
    state: {
        user: "",
        mode: "month",
        authenticatedUser: false
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getMode(state) {
            return state.mode
        },
        getAuthUser(state) {
            return state.authenticatedUser
        }
    },
    mutations: {
        setUser(state, params) {
            state.user = params
        },
        setMode(state, params) {
            state.mode = params
        },
        setAuthUser(state, params) {
            state.authenticatedUser = params
        }
    },
    actions: {
        setUser({ commit }, params) {
            commit('setUser', params)
        },
        setMode({ commit }, params) {
            commit('setMode', params)
        },
        setAuthUser({ commit }, params) {
            commit('setAuthUser', params)
        }
    },
})
