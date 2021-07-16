<template>
  <div id="details" @click="delayScreenProtect" @touchend="delayScreenProtect">
    <!-- <ballAnimation /> -->
    <!-- banner -->
    <Banner
      v-show="isShowBanner"
      :visible="isShowBanner"
      @route2="bannerRoute"
    />
    <!-- nav -->
    <Nav />
    <!-- 中间路由 -->
    <div class="content">
      <!-- 缓存判断 -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <transition name="fade">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </transition>
    </div>
    <!-- 路由按钮组 -->
    <div class="route-button-container">
      <div class="route-button-group">
        <div class="route-button">
          <div
            :class="['route', route.isActive && 'route_active']"
            v-for="(route, index) in routeBtns"
            :key="index"
            @click="go2route(route)"
          >
            <span
              :style="{
                backgroundImage: route.isActive
                  ? `url(${route.image_down})`
                  : `url(${route.image})`,
              }"
            ></span>
            <span
              :style="{
                color: route.isActive ? `#ffffff` : `#9A9AA2`,
              }"
              >{{ route.CN }}</span
            >
          </div>
        </div>
      </div>
      <!-- <span class="giraffe" :style="giraffeStyle"></span> -->
    </div>

    <div class="language" v-if="isShowLan">
        <div
          :class="['zh', language == 'zh' ? 'sel' : '']"
          @click="toggleLang('zh')"
        >
          中
        </div>
        <div
          :class="['en', language == 'en' ? 'sel' : '']"
          @click="toggleLang('en')"
        >
          EN
        </div>
    </div>
    <div>{{$t("wearthe.outdoor")}}</div>
    <!-- 主要功能按钮组 -->
    <!-- <div class="main-button">
      <div class="goBack" @click="goBack"></div>
      <div class="goHome" @click="goHome"></div>
    </div> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Nav from "@/components/nav/nav";
import Banner from "@/components/banner/banner";
import { GET_ACTIVITY_INFO, GET_BANNER_LIST } from "@/store/home/actionType";
import { sendStatistics } from '@/server/other';
import { debounce } from "@/utils";
// import ballAnimation from "@/components/basePage/ballAnimation";
export default {
  data() {
    return {
      isShowLan: window.MAP_CONFIG.isShowLan,
      // 是否显示banner
      isShowBanner: true,
      // 激活路由index
      activeRouteIndex: 0,
      //路由按钮
      routeBtns: [
        {
          name: "Home",
          CN: "首页",
          EN: "Home",
          isActive: true,
          image: require("@/assets/images/home/home_navigation_home.png"),
          image_down: require("@/assets/images/home/home_navigation_home_d.png"),
        },
        {
          name: "Map",
          CN: "楼层",
          EN: "Floor",
          isActive: false,
          image: require("@/assets/images/home/home_navigation_floor.png"),
          image_down: require("@/assets/images/home/home_navigation_floor_d.png"),
        },
        {
          name: "Shopping",
          CN: "购物",
          EN: "Shopping",
          isActive: false,
          image: require("@/assets/images/home/home_navigation_shopping.png"),
          image_down: require("@/assets/images/home/home_navigation_shopping_d.png"),
        },
        {
          name: "Food",
          CN: "美食",
          EN: "Dining",
          isActive: false,
          image: require("@/assets/images/home/home_navigation_dining.png"),
          image_down: require("@/assets/images/home/home_navigation_dining_d.png"),
        },
        // {
        //   name: "Movie",
        //   CN: "电影",
        //   EN: "Movie",
        //   isActive: false,
        //   image: require("@/assets/images/home/home_navigation_movie.png"),
        // },
        {
          name: "Active",
          CN: "活动",
          EN: "Activity",
          isActive: false,
          image: require("@/assets/images/home/home_navigation_activity.png"),
          image_down: require("@/assets/images/home/home_navigation_activity_d.png"),
        },
        {
          name: "Vip",
          CN: "会员",
          EN: "VIP",
          isActive: false,
          image: require("@/assets/images/home/home_navigation_vip.png"),
          image_down: require("@/assets/images/home/home_navigation_vip_d.png"),
        },
        {
          name: "Car",
          CN: "寻车",
          EN: "Search Car",
          isActive: false,
          image: require("@/assets/images/home/home_navigation_car.png"),
          image_down: require("@/assets/images/home/home_navigation_car_d.png"),
        },
        {
          name: "More",
          CN: "更多",
          EN: "More",
          isActive: false,
          image: require("@/assets/images/home/home_navigation_more.png"),
          image_down: require("@/assets/images/home/home_navigation_more_d.png"),
        },
      ],
      // 历史记录堆栈 方便对后退功能进行判断
      historyStack: [],
      language: "zh",
    };
  },
  computed: {
    updateRouteName() {
      return this.$route.name;
    },
    // giraffeStyle() {
    //   if (this.activeRouteIndex > 4) {
    //     return {
    //       top: "570px"
    //     }
    //   } else {
    //     return {
    //       top: "2255px"
    //     }
    //   }
    // }
  },
  async created() {
    // 获取banner列表
    await this.GET_BANNER_LIST();

    if (this.$route.query.type) {
      this.updateRouteStyle(this.$route.query.type);
    }

    // 初始化直接加载地图子路由
    this.$router.push({ name: "Map" });
    // 做路由回退判断
    this.$router.afterEach((to) => {
      if (this.$router.isBack) {
        this.historyStack.pop();
        this.$router.isBack = false;
      } else {
        this.historyStack.push(to.path);
      }
    });

    // 开启屏保 进入banner页
    this.$EventBus.$on("openScreenProtector", () => {
      this.updateRouteStyle("Home");
      this.goHome();
    });
    this.$EventBus.$on("searchEvent", () => {
      this.bannerRoute("Map");
    });
  },
  watch: {
    // updateRouteName(newRoute) {
    //   // 更新路由按钮样式
    //   this.updateRouteStyle(newRoute);
    // },
  },
  methods: {
     toggleLang(lang) {
      if (lang == "zh") {
        localStorage.setItem("language", "zh");
        this.$i18n.locale = localStorage.getItem("language");
      } else if (lang == "en") {
        localStorage.setItem("language", "en");
        this.$i18n.locale = localStorage.getItem("language");
      }
      this.language = lang;
      this.updateRouteStyle(this.btnName);
    },
    ...mapActions("home", [GET_BANNER_LIST, GET_ACTIVITY_INFO]),
    // 更新路由按钮样式
    updateRouteStyle(name) {
      this.routeBtns.forEach((item, index) => {
        item.isActive = false;
        if (item.name === name) {
          this.activeRouteIndex = index + 1;
          item.isActive = true;
        }
      });
    },
    // 回退
    // goBack() {
    //   if (this.historyStack.length === 0) return;
    //   this.$router.goBack();
      //埋点
      // sendStatistics("_menu_back_home")
    // },
    // 回到首页
    async goHome() {
      // 获取广告列表
      await this.GET_BANNER_LIST();
      // 重新拉活动列表
      // await this.GET_ACTIVITY_INFO();
      this.historyStack = [];
      this.isShowBanner = true;
      this.$router.push({ name: "Map" });
      this.$EventBus.$emit("gohome");
      // this.activeRouteIndex = 0;//激活路由index
      // this.updateRouteStyle("Home");
      sendStatistics("_screen_btn_home");//埋点
    },
    // 跳转特定路由
    go2route(route) {
      //加入防抖函数
      debounce(() => {  
        if (route.isActive) return;
        map && map.cleanSelectUnit3D();
        this.updateRouteStyle(route.name);
        if (route.name == "Home") {
          this.goHome();
        } else {
          this.isShowBanner = false;
          this.$router.push({ name: route.name });
        }
        let routeNameScreenBtn={
          Map:"_menu_floor",
          Shopping:"_menu_shopping",
          Food:"_menu_dine",
          Movie:"_menu_cinema",
          Active:"_menu_event",
          Vip:"_menu_vip",
          Car:"_menu_car",
          More:"_menu_more"
        }
        sendStatistics(routeNameScreenBtn[route.name]); //埋点
      }, 100)();
     
    },
    // banner页跳转路由
    bannerRoute(type) {
      this.isShowBanner = false;
      this.$router.push({ name: type });
      this.updateRouteStyle(type);
      let routeNameScreenBtn={
        Map:"_menu_floor",
        Shopping:"_menu_shopping",
        Food:"_menu_dine",
        Movie:"_menu_cinema",
        Active:"_menu_event",
        Vip:"_menu_vip",
        Car:"_menu_car",
        More:"_menu_more"
      }
      sendStatistics(routeNameScreenBtn[type]); //埋点
    },
    // 有点击事件延迟屏保重新计算
    delayScreenProtect() {
      screenProtect_VNode.reLoadScreenProtector();
    },
  },
  components: {
    Nav,
    Banner,
    // ballAnimation
  },
};
</script>


<style scoped lang="less">
@media screen and (min-width: 2161px) {
  #details {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: url("../assets/images/home/bannerBg_h.png") no-repeat center;
    background-size: cover;
    .content {
      position: absolute;
      top: 396px;
      left: 306px;
      width: 3444px;
      height: 1685px;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.7);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 80px;
    }
   .route-button-container {
      position: absolute;
      left: 0;
      top: 396px;
      width: 216px;
      height: 1685px;
      .route-button-group {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        border-radius: 0px 80px 80px 0px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        //transition: all 0.15s;
        z-index: 2;
        .route-button {
          width: 216px;
          height: 1475px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .route {
            position: relative;
            width: 178px;
            height: 178px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            //transition: all 0.15s;
            margin-top: 54px;
            &.route_active:after {
              content: "";
              display: block;
              width: 178px;
              height: 178px;
              position: absolute;
              z-index: -1;
              // background: url("../assets/images/home/home_navigation_select_item.png")
              //   no-repeat center;
              // background-size: cover;
              // background: linear-gradient(180deg, #EABA87 0%, #E65277 100%);
              // box-shadow: 0px 60px 50px #F3C7C4;
              background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
              box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
              border-radius: 30px;
              animation: ripple 0.1s 1 forwards;
              -webkit-animation: ripple 0.1s 1 forwards;
            }
            span {
              font-size: 34px;
              font-weight: 400;
              color: #9a9aa2;
              z-index: 2;
              transition: all 0.35s;
              &:nth-child(1) {
                margin-bottom: 22px;
                width: 70px;
                height: 70px;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
              }
            }
            &:nth-child(1) {
              margin-top: 15px;
            }
          }
        }
      }
    }
    .main-button {
      position: absolute;
      width: 230px;
      height: 400px;
      background: #e6d1b1;
      left: 0;
      top: 320px;
      border-radius: 0 60px 60px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      div {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        margin-top: 40px;
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  #details {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: url("../assets/images/home/bannerBg.png") no-repeat center;
    background-size: cover;
    // .topZindex {
    //   z-index: 1001;
    //   bottom: -220px;
    // }
    .content {
      position: absolute;
      top: 339px;
      left: 297px; //0;
      // bottom: 0;
      width: 1751px; //100%;
      height: 3340px; //100%;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.7);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 80px;//75px;
    }
    
    .language {
        position: absolute;
        bottom: 251px;
        div {
          width: 72px;
          height: 84px;

          border-radius: 16px;
          font-size: 44px;
          font-family: Noto Sans SC;
          font-weight: 400;
          line-height: 84px;
          color: #ad8249;
          text-align: center;
          &.en {
            margin-top: 38px;
          }
          &.sel {
            background: #e6dbce;
          }
        }
      }
      
    .route-button-container {
      position: absolute;
      left: 0;
      top: 863px;
      width: 243px;
      height: 2113px;
      .route-button-group {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        border-radius: 0px 80px 80px 0px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        //transition: all 0.15s;
        z-index: 2;
        .route-button {
          width: 243px;
          height: 2113px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .route {
            position: relative;
            width: 178px;
            height: 178px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            //transition: all 0.15s;
            margin-top: 64px;
            &.route_active:after {
              content: "";
              display: block;
              width: 178px;
              height: 178px;
              position: absolute;
              top: 0;
              bottom: 0;
              z-index: -1;
              // background: url("../assets/images/home/home_navigation_select_item.png")
              //   no-repeat center;
              // background-size: cover;
              // background: linear-gradient(180deg, #EABA87 0%, #E65277 100%);
              // box-shadow: 0px 60px 50px #F3C7C4;
              background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
              box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
              border-radius: 30px;
              animation: ripple 0.1s 1 forwards;
              -webkit-animation: ripple 0.1s 1 forwards;
            }
            span {
              font-size: 34px;
              font-weight: 400;
              color: #9a9aa2;
              z-index: 2;
              transition: all 0.35s;
              &:nth-child(1) {
                margin-bottom: 22px;
                width: 70px;
                height: 70px;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
              }
            }
            &:nth-child(1) {
              margin-top: 15px;
            }
          }
        }
      }

      // .giraffe {
      //   position: absolute;
      //   width: 310px;
      //   height: 410px;
      //   transition: all 0.35s;
      //   left: 130px;
      //   background: url("../assets/images/home/giraffe.png") no-repeat center;
      //   background-size: contain;
      //   z-index: 1;
      //   animation: hide-left-giraffe-animation 5s infinite;
      // }
    }

    .main-button {
      position: absolute;
      width: 230px;
      height: 400px;
      background: #e6d1b1;
      left: 0;
      top: 320px;
      border-radius: 0 60px 60px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      div {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        margin-top: 40px;
      }
      // .goBack {
      //   background-image: url("../assets/images/details/navigation_back_d.png");
      // }
      // .goHome {
      //   background-image: url("../assets/images/details/navigation_home_d.png");
      // }
    }
  }
}

// @keyframes hide-left-giraffe-animation {
//   0% {
//     transform: translateX(0px);
//   }
//   25% {
//     transform: translateX(-20%);
//   }
//   50% {
//     transform: translateX(0);
//   }
//   75% {
//     transform: translateX(-20%);
//   }
//   100% {
//     transform: translateX(0);
//   }
// }
@keyframes ripple {
  0% {
    // opacity: 0.3;
    transform: scale(1.2);
  }
  100% {
    // opacity: 1;
    transform: scale(1);
  }
}
</style>
