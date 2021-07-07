<template>
  <div id="home" @click="delayScreenProtect">
    <!-- nav栏 -->
    <Nav />
    <!-- 主体展示 -->
    <div class="home_container">
      <!-- banner 轮播大图 -->
      <div class="banner">
        <!-- 顶部banner -->
        <div class="banner_top">
          <carousel-3d
            class="bannerBig"
            :autoplay="true"
            :autoplayTimeout="bannerAutoplayTimeout"
            :perspective="1"
            :display="3"
            :animationSpeed="1000"
            :width="bannerOneWidth"
            :height="bannerOneHeight"
            :controlsHeight="60"
            @after-slide-change="onSlideStatusChange"
            inverseScaling="600"
            v-if="bannerShowImages.length > 0"
            ref="Carousel3d"
          >
            <slide
              v-for="(item, index) in bannerShowImages"
              :key="index"
              :index="index"
            >
              <div class="imgC">
                <img :src="item.Path" alt="" />
              </div>
            </slide>
          </carousel-3d>
        </div>
      </div>
    </div>
    <!-- <ballAnimation /> -->
    <!-- 按钮组 -->
    <div class="route_jump_group" v-if="currentScreenType == 0">
      <div class="route_jump_mid">
        <div
          :class="['route_jump_button', item.isActive && 'route_active']"
          v-for="(item, index) in routeList"
          :key="index"
          @click="route2(item.name)"
        >
          <span
            :style="{
              backgroundImage: item.isActive
                ? `url(${item.image_down})`
                : `url(${item.image})`,
            }"
          ></span>
          <span
            :style="{
              color: item.isActive ? `#ffffff` : `#9A9AA2`,
            }"
            >{{ item.CN }}</span
          >
        </div>
      </div>
    </div>
    <div class="route_jump_group" v-if="currentScreenType == 1">
      <div class="route_jump_mid">
        <div
          :class="['route_jump_button', item.isActive && 'route_active']"
          v-for="(item, index) in routeList"
          :key="index"
          @click="route2(item.name)"
        >
          <span
            :style="{
              backgroundImage: item.isActive
                ? `url(${item.image_down})`
                : `url(${item.image})`,
            }"
          ></span>
          <span
            :style="{
              color: item.isActive ? `#ffffff` : `#9A9AA2`,
            }"
            >{{ item.CN }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { compareTime, useDeepCopy } from "@/utils";
import Nav from "@/components/nav/nav";
// import TodayFood from './todayFood.vue';
// import HotActivity from './hotActivity';
import { mapState, mapMutations } from "vuex";
import { Carousel3d, Slide } from "vue-carousel-3d";

// import Swiper from "@/components/swiper/swiper";
// import ballAnimation from "@/components/basePage/ballAnimation";
export default {
  props: {
    visible: Boolean,
  },
  data() {
    return {
      currentScreenType: 0, //当前是横版还是竖版
      bannerOneWidth: 1347, //单个banner宽度
      bannerOneHeight: 2962, //单个banner高度
      bannerAutoplayTimeout:10000,  //页面展示时间(毫秒)
      // 功能按钮
      routeList: [
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
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        roundLengths: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true,
        },
        mousewheel: true,
      },
      // banner 竖版默认图片
      bannerImages: [
        {
          Path: require("@/assets/images/home/banner1.jpeg"),
        },
      ],
       // banner 横版默认图片
      bannerImagesH: [
        {
          Path: require("@/assets/images/home/banner0.png"),
        },
      ],
      // banner图片展示
      bannerShowImages: [],
      currentIndex: 1,
    };
  },

  computed: {
    ...mapState("home", {
      adsList: (state) => state.adsList,
    }),
  },
  created() {
    this.currentScreenType = MAP_CONFIG.SCREEN_TYPE;
    //数据加载完成，还没创建dom 设置单个banner宽高
    if (MAP_CONFIG.SCREEN_TYPE == 0) {
      //横版
      this.bannerOneWidth = 2962;
      this.bannerOneHeight = 1347;
    }
  },
  watch: {
    adsList(list) {
      // 筛选屏保广告数据
      screenProtect_VNode.updateAdsList(list);
      //刷新首页数据
      this.filterSwiperLists(list);
    },
  },
  mounted() {
    // 创建屏保
    this.$screenProtect().then((constructor) => {
      // 屏保生成成功后的VNode
      window.screenProtect_VNode = constructor;
    });
  },
  methods: {
    // 调用home内方法
    ...mapMutations("home", ["genScreenProtectVNode"]),
    // 有点击事件延迟屏保重新计算
    delayScreenProtect() {
      screenProtect_VNode.reLoadScreenProtector();
    },
    // 跳转details路由页
    route2(type) {
      if(type != "Home")
      {
        this.$emit("route2", type);
      }
    },
    //切换
    onSlideStatusChange(status) {
      this.currentIndex = status;
      // console.log('this.currentIndex=', this.currentIndex);
      this.bannerAutoplayTimeout = this.bannerShowImages[status] && this.bannerShowImages[status].PlayTime ? this.bannerShowImages[status].PlayTime * 1000  : 6000;
      // console.log('bannerAutoplayTimeout=', this.bannerAutoplayTimeout);
    },
    //处理数据
    filterSwiperLists(list) {
      // console.log('list=', list);
      let type = "home";
      //useDeepCopy 深度拷贝，拷贝之后跟原数组没有关系了
      //filter 过滤条件
      //map 遍历对象 ...展开对象添加新的元素Path
      const bannerList = useDeepCopy(list)
        .filter(
          (li) =>
            compareTime(li) &&
            li.ScreenType === MAP_CONFIG.SCREEN_TYPE &&
            li.AdvertisingType === type &&
            li.Path
        )
        .map((item) => ({
          ...item,
          Path: `${MAP_CONFIG.BASE_URL}map/${item.Path}`,
        }));

      // console.log("bannerList=", bannerList);
      if (bannerList.length === 0) {
        if(MAP_CONFIG.SCREEN_TYPE == "0")
        {
          this.bannerShowImages = this.bannerImagesH;
        }
        else
        {
          this.bannerShowImages = this.bannerImages;
        }
        
        // if (type == "banner") {
        //   this.bannerShowImages = [
        //     {
        //       Path: require("@/assets/images/home/homeBannerV.png"),
        //     },
        //   ];
        // }
      } else {
        this.bannerShowImages = bannerList;
        // this.swiperOption.autoplay.delay = ~~bannerList[0].PlayTime * 1000;
      }
      // console.log('bannerShowImages=', this.bannerShowImages);
    },
  },
  components: {
    Nav,
    // Swiper,
    // HotActivity,
    // TodayFood,
    // ballAnimation,
    Carousel3d,
    Slide,
  },
};
</script>

<style scoped lang='less'>
@media screen and (min-width: 2161px) {
  #home {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url("../../assets/images/home/bannerBg_h.png") no-repeat center;
    background-size: cover;
    z-index: 2999;
    display: flex;
    .home_container {
      width: 3666px;
      height: 1347px;
      left: 85px;
      top: 363px;
      position: absolute;
      .banner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        .banner_top {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .bannerBig {
            margin: 0 auto !important;
            width: 100% !important;
            height: 100% !important;
            .carousel-3d-slider {
              width: 100% !important;
              height: 100% !important;
              .carousel-3d-slide {
                border: none !important;
                border-radius: 76px !important;
                width: 100% !important;
                height: 100% !important;
                .imgC {
                  width: 100%;
                  height: 100%;
                  img {
                    width: 2962px;
                    height: 1347px;
                  }
                }
                &.right-1 {
                  right: 400px !important;
                  opacity: 0.9 !important;
                  border: none !important;
                  border-radius: 76px !important;
                }
                &.left-1 {
                  left: 400px !important;
                  opacity: 0.9 !important;
                  border: none !important;
                  border-radius: 76px !important;
                }
              }
            }
          }
        }
      }
    }
    .route_jump_group {
      position: absolute;
      right: 863px;
      bottom: 0px;
      width: 2113px;
      height: 287px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 80px 80px 0px 0px;
      // box-shadow: 0px 0px 50px #f3c7c4;
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      .route_jump_mid {
        width: 1903px;
        height: 287px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .route_jump_button {
          position: relative;
          width: 178px;
          height: 178px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          // transition: all 0.3s;
          &.route_active:after {
            content: "";
            display: block;
            width: 178px;
            height: 178px;
            position: absolute;
            // background: url("../../assets/images/home/home_navigation_select_item.png")
            //   no-repeat center;
            // background-size: cover;
            // background: linear-gradient(180deg, #EABA87 0%, #E65277 100%);
            background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
            box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
            // box-shadow: 0px 60px 50px #F3C7C4;
            border-radius: 30px;
            // animation: ripple 0.1s 1 forwards;
            // -webkit-animation: ripple 0.1s 1 forwards;
          }
          span {
            font-size: 34px;
            font-weight: 400;
            color: #9a9aa2;
            z-index: 2;
            // transition: all 0.35s;
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
            margin-right: 15px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  #home {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url("../../assets/images/home/bannerBg.png") no-repeat center;
    background-size: cover;
    z-index: 2999;
    display: flex;

    .home_container {
      margin-top: 439px;
      width: 2070px;
      height: 3385px;
      display: flex;
      flex-direction: column;

      .banner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        .banner_top {
          margin-left: 300px;//383px;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .bannerBig {
            margin: 0 auto !important;
            height: 100% !important;
            .carousel-3d-slider {
              .carousel-3d-slide {
                border: none !important;
                border-radius: 76px !important;
                .imgC {
                  width: 100%;
                  height: 100%;
                  img {
                    width: 1347px;
                    height: 2962px;
                  }
                }
                &.right-1 {
                  right: 160px !important;
                  opacity: 0.9 !important;
                  border: none !important;
                  border-radius: 76px !important;
                }
                &.left-1 {
                  left: 160px !important;
                  opacity: 0.9 !important;
                  border: none !important;
                  border-radius: 76px !important;
                }
              }
            }
          }
        }
      }
      // .HotActivity {
      //   z-index: 2;
      // }
    }
    .route_jump_group {
      position: absolute;
      left: 0;
      top: 863px;
      width: 243px;
      height: 2113px;
      .route_jump_mid {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #ffffff;
        border-radius: 0px 80px 80px 0px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        //transition: all 0.3s;
        z-index: 2;
        .route_jump_button {
           position: relative;
            width: 178px;
            height: 178px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            //transition: all 0.3s;
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
            // background: url("../../assets/images/home/home_navigation_select_item.png")
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
    // .top-ball-animation {
    //   z-index: 3;
    //   animation: bottom-ball-animation 15s infinite linear alternate;
    // }
  }
  @keyframes ripple {
    0% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>