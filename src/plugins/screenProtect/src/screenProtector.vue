<!-- 屏幕保护-->
<template>
  <div
    id="screenProtector"
    class="animated jackInTheBox"
    v-if="isShowScreenProtector"
    @click="dotClick"
  >
    <!-- 点 -->
    <MoveDot @click="dotClick" v-if="isShowImageDot"/>
    <!-- 轮播 -->
    <Swiper 
    ref="mySwiper" 
    :options="swiperOption"    
    @click="dotClick"
    v-if="isShowImageDot">
      <SwiperSlide v-for="(slide, index) in list" :key="index" :index="index">
        <div
          class="screen-protector-ad"
          :style="{
            backgroundImage: `url(${slide.Path})`,
          }"
          v-if="slide.Path.includes('png') || slide.Path.includes('jpg') || slide.Path.includes('jpeg')"
        ></div>
        <video
          v-else
          muted
          ref="video"
          :src="slide.Path"
          class="banner-top-slide-video"
        ></video>
      </SwiperSlide>
    </Swiper>
     <!-- 倒计时页面 -->
    <ScreenCountDown v-if="isShowCountDown" ref="screenCountDownRef" />
  </div>
</template>

<script>
import MoveDot from "./moveDot";
import ScreenCountDown from "./screenCountDown";
import { compareTime, getUUID, useDeepCopy,getRandomRange } from '@/utils';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { sendStatistics } from '@/server/other';
export default {
  props: {
    screenProtectTime: {
      type: Number,
      default: MAP_CONFIG.RESET_TIME 
    }
  },
  data() {
    return {
      isShowScreenProtector: false, //整个页面
      isShowImageDot: false, //图片和移动的圆圈
      isShowCountDown: false, //倒计时页面
      timer: null,
      list: [],
      count: MAP_CONFIG.RESET_TIME,
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 10000,
          disableOnInteraction: false,//禁用交互
        },
        on: { 
          slideChangeTransitionEnd: () => {
            this.playSwiperVideo()
          },
        },
      }
    };
  },
  mounted() {
    this.playSwiperVideo(true)
  },
  methods: {
     // 初始化屏幕保护
    initScreenProtector() {
      this.clearTimer();
      this.count = this.screenProtectTime;
      this.timer = setInterval(() => {
        this.count--;
        if (this.count <= 0) {
          this.clearTimer();
          this.$EventBus.$emit("openScreenProtector");
          this.isShowImageDot = true;
          this.isShowScreenProtector = true;
          this.isShowCountDown = false;
        } else if (this.count < MAP_CONFIG.COUNT_DOWN_TIME + 1) {
          // console.log("count=", this.count);
          this.isShowCountDown = true;
          this.isShowScreenProtector = true;
          let screenCountDownRef = this.$refs.screenCountDownRef;
          screenCountDownRef?.updateCountDownTime(this.count);
        }
      }, 1000);
    },
     //释放timer
    clearTimer() {
      this.timer && clearInterval(this.timer);
      this.timer = null;
    },
    // 重新计算屏幕保护时间
    reLoadScreenProtector() {
      if (this.timer) {
        this.initScreenProtector();
      }
    },
    //不显示倒计时页面
    hideCountDown() {
      this.reLoadScreenProtector();
      this.isShowCountDown = false;
      this.isShowScreenProtector = false;
    },
    // 点击按钮
    dotClick() {
      this.isShowImageDot = false;
      this.isShowScreenProtector = false;
      this.initScreenProtector();
      this.setBuriedPoint(); // 发送埋点
    },
    // 更新屏保内容
    updateAdsList(adslist) {
      this.list = useDeepCopy(adslist).filter(li => compareTime(li) && li.ScreenType === MAP_CONFIG.SCREEN_TYPE && li.AdvertisingType === "screen").map(item => ({
        ...item,
        Path: `${MAP_CONFIG.BASE_URL}map/${item.Path}`
      }));

      if (this.list.length === 0) {
        this.list = [{
          Path: require("@/assets/images/screenProtect/screenProtector_H.png"),
          PlayTime: 10
        }]
        this.swiperOption.autoplay = false;
      } else {
        this.swiperOption.autoplay.delay = ~~this.list[0].PlayTime * 1000;
      }
    },
    playSwiperVideo(isDelay) {
      if (!this.$refs.mySwiper?.$swiper) return;
      if (isDelay) {
        setTimeout(() => {
          const activeVideo = document.querySelector(".swiper-slide-active video");
          this.controlSwiper(activeVideo);
        }, 2000);
      } else {
        const activeVideo = document.querySelector(".swiper-slide-active video");
        this.controlSwiper(activeVideo);
      }
    },
    controlSwiper(activeVideo) {
      if (activeVideo) {
        activeVideo.play();
        this.$refs.mySwiper.$swiper.autoplay.stop();
        activeVideo.addEventListener("ended", () => {
          this.$refs.mySwiper.$swiper.autoplay.start();
          this.$refs.mySwiper.$swiper.slideNext();
        })
      } else {
        this.$refs.mySwiper.$swiper.autoplay.start();
      }
    },
    // 生成faceID 发送埋点
    setBuriedPoint(){
      MAP_CONFIG.FACE_ID = getUUID();
        let tempSex = "M";
        if((Math.random()*100)>50)
        {
          tempSex = "F";
        }
        window.MAP_CONFIG.SEX = tempSex;//随机性别
        window.MAP_CONFIG.AGE = getRandomRange(18, 50);//随机年龄
      sendStatistics("_screen_home");
    }
  },
  components: {
    Swiper,
    MoveDot,
    ScreenCountDown,
    SwiperSlide,
  }
};
</script>

<style lang='less'>
#screenProtector {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100000;
  .swiper-container {
    width: 100%;
    height: 100%;
    .screen-protector-ad {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
