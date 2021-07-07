import Vue from 'vue'
import VueRouter from 'vue-router'

const Details = () => import('../views/details.vue');

const Map = () => import('../views/content/map.vue');
const Shopping = () => import('../views/content/shopping.vue');
const Food = () => import('../views/content/food.vue');
const Movie = () => import('../views/content/movie.vue');
const Active = () => import('../views/content/active.vue');
const Vip = () => import('../views/content/vip.vue');
const Car = () => import('../views/content/car.vue');
const More = () => import('../views/content/more.vue');

// 兼容路由多次跳转
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

// 扩展Router
VueRouter.prototype.goBack = function () {
  this.isBack = true;
  this.go(-1);
}

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/details'
  },
  {
    path: '/details',
    name: 'Details',
    component: Details,
    children: [
      {
        path: '/map',
        name: 'Map',
        component: Map,
        meta: {
          keepAlive: true // 需要被缓存
        }
      },
      {
        path: '/shopping',
        name: 'Shopping',
        component: Shopping,
      },
      {
        path: '/food',
        name: 'Food',
        component: Food,
      },
      {
        path: '/movie',
        name: 'Movie',
        component: Movie,
      },
      {
        path: '/active',
        name: 'Active',
        component: Active,
      },
      {
        path: '/vip',
        name: 'Vip',
        component: Vip,
      },
      {
        path: '/car',
        name: 'Car',
        component: Car,
      },
      {
        path: '/more',
        name: 'More',
        component: More,
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
