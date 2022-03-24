import Vue from 'vue'
import VueRouter from 'vue-router'
import User from '../components/User'
import Wall from '../components/Wall'
import Admin from '../components/Admin'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'User',
    component: User,
  },
 
  {
    path: '/feed',
    name: 'Wall',
    component: Wall,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    },
];



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const Access = ["/"]
  const pagesVerif = !Access.includes(to.path)
  const loggedIn = localStorage.getItem("userId")
  const isAdmin = localStorage.getItem("isAdmin")
  const localToken = localStorage.getItem("token")
  if (pagesVerif && !loggedIn && !localToken) {
      return next("/")
  }
  if (to.fullPath === '/admin') {
    if (isAdmin != "true") {
      next('/feed')
    }
  }
  next()
})

export default router
