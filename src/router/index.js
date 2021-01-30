import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Usres from '../components/user/Users'
import Rights from '../components/power/Rights.vue'
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
        { path: '/rights', component: Rights }
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
