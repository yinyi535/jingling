import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/components/Welcome.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/components/Users.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/components/Roles.vue')
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('@/components/Rights.vue')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/components/Goods.vue')
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('@/components/Params.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/components/Categories.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/components/Orders.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/components/Reports.vue')
      }, {
        path: 'add',
        name: 'add',
        component: () => import('@/components/Add.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    let token = sessionStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
export default router
