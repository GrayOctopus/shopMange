import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('components/login.vue')

Vue.use(VueRouter)

const routes = [
]

const router = new VueRouter({
  routes
})

export default router
