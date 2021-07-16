import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './libs/flexible';
import { getMapConfigJSon } from './utils';
// swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
// local plugins
import plugins from './plugins';
// import style
import 'swiper/css/swiper.css'
import './assets/css/common.less';
import './assets/css/animate.css';

//引入过渡动画 fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
import "@/libs/keyboard/keyboard.min.css";
import Keyboard from "@/libs/keyboard/keyboard.min.js";
import VueI18n from "vue-i18n";

getMapConfigJSon(() => {
  Vue.use(VueAwesomeSwiper)
  Vue.use(plugins);
  Vue.use(VueI18n)
  Vue.use(Keyboard);

  Vue.prototype.$EventBus = new Vue();

  const i18n = new VueI18n({
    locale: "zh", // 语言标识
    messages: {
      zh: require("./assets/language/zh"),
      en: require("./assets/language/en"),
    },
  });

  Vue.config.productionTip = false;
  new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
  }).$mount('#app');
});
/*封装tap*/
function tap(dom, callback) {
  /*
   * 要求  没有触发 touchmove 事件
   *       并且响应速度要比click快
   */
  if (dom && typeof dom == "object") {
    var isMove = false;
    var startTime = 0;
    var startEvt = "mousedown";
    var moveEvt = "mousemove";
    var endEvt = "mouseup";
    if("ontouchend" in document){
      startEvt = "touchstart";
      moveEvt = "touchmove";
      endEvt = "touchend";
    }
    dom.addEventListener(startEvt, function(e) {
      //console.log('touchstart');
      //console.time('tap');/*记录tap这个参数现在的时间*/
      startTime = Date.now();
    });
    dom.addEventListener(moveEvt, function(e) {
      //console.log('touchmove');
      isMove = true;
    });
    dom.addEventListener(endEvt, function(e) {
      //console.log('touchend');
      //console.timeEnd('tap')/*打印tap这个参数距离上一次记录的时候的时间*/
      /*判读  是否满足tap 的要求  一般要求tap的响应时间150*/
      if (!isMove && Date.now() - startTime < 160) {
        /*调用 callback*/
        // callback && callback(e);
        callback.call(callback.data);
      }
      /*重置 参数*/
      isMove = false;
      startTime = 0;
    });
  }
}
Vue.directive("tap", {
  bind: function(el, binding) {
    tap(el, binding.value);
  },
});