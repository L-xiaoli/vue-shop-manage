import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
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
      children: [{ path: '/welcome', component: Welcome }]
    }
  ]
})
// const router = new VueRouter({
//   routes
// })
//挂载路由导航守卫  to：去哪里，form ：从哪里来，next放行函数
//挂载路由导航守卫  to：去哪里，form ：从哪里来，next放行函数
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
