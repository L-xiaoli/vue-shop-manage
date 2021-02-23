import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')

const Usres = () => import(/* webpackChunkName:"Users_Right_Roles" */ '../components/user/Users')
const Rights = () => import(/* webpackChunkName:"Users_Right_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName:"Users_Right_Roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName:"GoodsList_Add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName:"GoodsList_Add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName:"Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName:"Order_Report" */ '../components/report/Report.vue')
//注册路由组件
Vue.use(VueRouter)

// const routes = []

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    // { path: '/home', component: Home },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Usres },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods/', component: GoodsList },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// const router = new VueRouter({
//   routes
// })
//挂载路由导航守卫  to：去哪里，form ：从哪里来，next放行函数
router.beforeEach((to, from, next) => {
  const hrefStr = to.path
  // console.log(hrefStr)
  if (hrefStr === '/welcome') {
    // hrefStr = ''
    window.sessionStorage.setItem('activePath', '')
  } else {
    window.sessionStorage.setItem('activePath', hrefStr)
  }
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
