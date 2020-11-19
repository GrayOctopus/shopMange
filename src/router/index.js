import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('views/login/Login.vue')
const Home = () => import('views/home/Home.vue')
const Welcome = () => import('views/home/homeChild/Welcome.vue')
const Users = () => import('views/home/homeChild/user/Users.vue')
const Rights = () => import('views/home/homeChild/power/Rights.vue')
const Roles = () => import('views/home/homeChild/power/Roles.vue')
const Cate = () => import('views/home/homeChild/goods/Category.vue')
const Params = () => import('views/home/homeChild/goods/Params.vue')
const List = () => import('views/home/homeChild/goods/List.vue')
const Add = () => import('views/home/homeChild/goods/Add.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
    if (to.path === '/login')
      return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr){
      return next('/login')
    }

    next()
  }
)

export default router
