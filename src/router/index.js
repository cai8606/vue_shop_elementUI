import Vue from 'vue'
import VueRouter from 'vue-router'

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'

const Home = () => import('../components/Home.vue')
const Login = () => import('../components/Login.vue')
const User = () => import('../components/pages/User.vue')
const Role = () => import('../components/pages/Role.vue')
const Perms = () => import('../components/pages/Perms.vue')
const UserDetail = () => import('../components/pages/UserDetail.vue')
const Menu = () => import('../components/pages/menu.vue')
const Product = () => import('../components/pages/product.vue')
const NoPerms = () => import('../components/NoPerms.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home ,
    children: [
      { path: '/noPerms', component: NoPerms },
      {path: '/user', component: User},
      {path: '/role', component: Role},
      {path: '/perms', component: Perms},
      {path: '/userDetail', component: UserDetail},
      {path: '/menu', component: Menu},
      {path: '/product', component: Product},
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   //to 将要访问的路径
//   //from 从哪个路径跳转而来
//   //next 是一个函数, 表示放行
//   //  next() 放行  next('/login')  强制跳转
//   if(to.path === '/login') return next();
//   const tokenStr = window.sessionStorage.getItem('token');
//   if(!tokenStr) return next('/login');
//   next();
// })

export default router
