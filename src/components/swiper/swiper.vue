<template>
  <Swiper
    ref="mySwiper"
    class="banner-top-swiper animated fadeIn"
    :style="swiperStyle"
    :options="swiperOption"
  >
    <SwiperSlide
      v-for="(slide, index) in bannerShowImages"
      :key="index"
      :index="index"
    >
      <div
        class="banner-top-slide-image"
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
    <div v-if="pagination" class="swiper-pagination" slot="pagination"></div>
  </Swiper>
</template>

<script>
import { compareTime, useDeepCopy } from "@/utils";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
export default {
  props: {
    swiperStyle: {
      type: Object,
      default: () => ({
        width: "1750px",
        height: "2170px",
      }),
    },
    type: {
      type: String,
      default: "banner",
    },
    pagination: Boolean,
    swiperLists: Array,
  },
  data() {
    return {
      // swiper事件
      swiperOption: {
        loop: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        roundLengths: true, //防止文字模糊
        autoplay: {
          delay: 10000,
          disableOnInteraction: false,
        },
        // pagination: {
        //   el: ".swiper-pagination",
        // },
        on: {
          slideChangeTransitionEnd: () => {
            this.playSwiperVideo();
          },
        },
      },
      // banner 图片
      bannerImages: [
        {
          Path: require("@/assets/images/home/banner1.jpeg"),
        },
      ],
      // banner展示
      bannerShowImages: [],
    };
  },
  watch: {
    swiperLists: {
      handler: function (list) {
        this.filterSwiperLists(list);
      },
      immediate: true,
    },
    type: function (type) {
      this.filterSwiperLists();
    },
  },
  mounted() {
    this.playSwiperVideo(true);
  },
  methods: {
    filterSwiperLists(list) {
      const bannerList = useDeepCopy(list || this.swiperLists)
        .filter(
          (li) =>
            compareTime(li) &&
            li.ScreenType === MAP_CONFIG.SCREEN_TYPE &&
            li.AdvertisingType === this.type &&
            li.Path
        )
        .map((item) => ({
          ...item,
          Path: `${MAP_CONFIG.BASE_URL}map/${item.Path}`,
        }));

      if (bannerList.length === 0) {
        this.bannerShowImages = this.bannerImages;
        if (this.type == "banner") {
          this.bannerShowImages = [
            {
              Path: require("@/assets/images/home/homeBannerV.png"),
            },
          ];
        }
      } else {
        this.bannerShowImages = bannerList;
        this.swiperOption.autoplay.delay = ~~bannerList[0].PlayTime * 1000;
      }

      this.playSwiperVideo(true);
    },
    playSwiperVideo(isDelay) {
      if (!this.$refs.mySwiper?.$swiper) return;
      if (isDelay) {
        setTimeout(() => {
          const activeVideo = document.querySelector(
            ".swiper-slide-active video"
          );
          this.controlSwiper(activeVideo);
        }, 1500);
      } else {
        const activeVideo = document.querySelector(
          ".swiper-slide-active video"
        );
        this.controlSwiper(activeVideo);
      }
    },
    controlSwiper(activeVideo) {
      if (activeVideo) {
        activeVideo.play();
        this.$refs.mySwiper?.$swiper.autoplay.stop();
        activeVideo.addEventListener("ended", () => {
          this.$refs.mySwiper?.$swiper.autoplay.start();
          this.$refs.mySwiper?.$swiper.slideNext();
        });
      } else {
        this.$refs.mySwiper?.$swiper.autoplay.start();
      }
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
};
</script>

<style lang='less'>
.banner-top-swiper {
  border-radius: 60px;
  .swiper-slide {
    width: 100% !important;
    height: 100% !important;
    border-radius: 60px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    .banner-top-slide-image {
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

.swiper-pagination {
  position: absolute !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  bottom: 65px !important;

  .swiper-pagination-bullet {
    width: 156px !important;
    height: 6px !important;
    background: #ffffff !important;
    border-radius: 3px !important;
    margin-right: 5px !important;

    &.swiper-pagination-bullet-active {
      background: #aa8d17 !important;
    }
  }
}
</style>
