<template>
  <div class="vipBanner">
    <div class="card" v-if="isInit">
      <carousel-3d
        :border="0"
        :space="cardSpace"
        :width="cardWidth"
        :height="cardHeight"
        :inverseScaling="cardInverseScaling"
        :perspective="0"
        :startIndex="0"
        :display="cardDisplay"
        :loop="true"
        :bias="'right'"
        @after-slide-change="pageChange"
      >
        <slide
          v-for="(slide, index) in bannerImages"
          :key="index"
          :index="index"
        >
          <div
            :style="{ backgroundImage: `url(${slide.img})` }"
            class="cardItem"
          ></div>
        </slide>
      </carousel-3d>
    </div>
    <div class="rightBox">
      <div class="rightsText">
        <span>{{ cardName }}会员享有以下权益</span>
      </div>
      <div class="rights">
         <!-- 竖版权益 -->
        <swiper
          class="swiper"
          ref="mySwiper"
          :options="swiperOption"
          v-if="currentScreenType == 1"
        >
          <swiper-slide class="swiperSlide">
            <div
              @click="showRightsInfo(item)"
              v-for="(item, index) in currentRightsData"
              :key="index"
              class="rightsItem animated bounceInUp"
            >
              <div
                :style="{ backgroundImage: `url(${item.icon})` }"
                class="rightsIcon"
              ></div>
              <div class="rightsName" v-html="item.name"></div>
            </div>
          </swiper-slide>
          <div class="swiper-scrollbar" slot="scrollbar"></div>
        </swiper>
        <!-- <div class="slideBtn slideBtnNext" @click="slideNext">
          {{ nextText }}
        </div>
        <div class="slideBtn slideBtnPrev" @click="slidePrev">
          {{ PrevText }}
        </div> -->
        <!-- 横版权益 -->
        <swiper
          class="swiper"
          ref="mySwiper"
          :class="[
            currentRightsData.length < rowNumber ? 'swiperVipShort' : '',
          ]"
          :options="swiperOption"
          v-if="currentScreenType == 0"
        >
          <swiper-slide
            class="swiperSlide"
            v-for="(item, index) in horizontalItems"
            :key="index"
          >
            <div
              class="rightsRowH"
              v-for="(brand, index1) in item"
              :key="index1"
              @click="showRightsInfo(brand)"
            >
              <div
                :style="{ backgroundImage: `url(${brand.icon})` }"
                class="rightsIcon"
              />
              <div class="rightsName" v-html="brand.name" />
            </div>
          </swiper-slide>
          <!--分页器。如果放置在swiper-container外面，需要自定义样式。-->
          <div class="swiper-pagination" slot="pagination"  v-show="horizontalItems.length > 1"/>
        </swiper>
        <div
          v-if="currentRightsData.length > rowNumber && currentScreenType == 0"
          class="vip_right_button_prev"
          @click="slidePrev"
        ></div>
        <div
          v-if="currentRightsData.length > rowNumber && currentScreenType == 0"
          class="vip_right_button_next"
          @click="slideNext"
        ></div>
      </div>
      <div class="tips">
        注：当会员生日当天遇上每月28双倍购物积分则享购物3倍积分，不再单独享积分叠加倍数权益。
      </div>
    </div>
    <vipInfo
      :cardInfo="cardInfo"
      v-show="isShowVipInfo"
      @closeCardInfo="isShowVipInfo = false"
    />
  </div>
</template>

<script>
import { Carousel3d, Slide } from "vue-carousel-3d";
import vipInfo from "@/components/vipComponents/vipInfo";
export default {
  props: {},
  data() {
    return {
      currentScreenType: 1, //当前是竖版还是横版 默认1竖版
      rowNumber: 10, //一行显示多少个(由设计决定)
      horizontalItems: [], //横版 10个一组数据
      cardSpace:210,
      cardWidth:1179,//卡片显示的宽度
      cardHeight:825,//卡片显示的高度
      cardInverseScaling:70,
      cardDisplay:4,
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        mousewheel: true,
        autoHeight: true,
        roundLengths: true, //防止文字模糊
        on: {
          slideChange: function () {
            const buttonNext = document.querySelector(".vip_right_button_next");
            const buttonPrev = document.querySelector(".vip_right_button_prev");
            if (buttonNext && buttonPrev) {
              buttonNext.style.backgroundImage =
                this.activeIndex === this.slides.length - 1
                  ? `url(${require("../../assets/images/vip/next.png")})`
                  : `url(${require("../../assets/images/vip/next_active.png")})`;
              buttonPrev.style.backgroundImage =
                this.activeIndex === 0
                  ? `url(${require("../../assets/images/vip/prev.png")})`
                  : `url(${require("../../assets/images/vip/prev_active.png")})`;
            }
          },
        },
      },
      bannerImages: [
        {
          img: require("@/assets/images/vip/car_card0.png"),
          index: "0",
          name: "i",
        },
        {
          img: require("@/assets/images/vip/car_card1.png"),
          index: "1",
          name: "金卡",
        },
        {
          img: require("@/assets/images/vip/car_card2.png"),
          index: "2",
          name: "钻石卡",
        },
        {
          img: require("@/assets/images/vip/car_card3.png"),
          index: "3",
          name: "黑卡",
        },
      ],
      //当前选中卡片的权益
      currentRightsData: [
        {
          name: "购物优惠/免费停车",
          icon: require("@/assets/images/vip/rights1.png"),
        },
        {
          name: "引荐入会<br/>（赠100积分）",
          icon: require("@/assets/images/vip/rights2.png"),
        },
        {
          name: "完善资料<br/>（赠100积分）",
          icon: require("@/assets/images/vip/rights3.png"),
        },
        {
          name: "签到积分<br/>（每日赠5积分）",
          icon: require("@/assets/images/vip/rights4.png"),
        },
        {
          name: "积分兑礼<br/>（停车券、礼品或礼券）",
          icon: require("@/assets/images/vip/rights5.png"),
        },
      ],
      //所有的权益
      allRightsData: [
        {
          name: "购物优惠/免费停车<br/>（另列）",
          icon: require("@/assets/images/vip/rights1.png"),
          cardIndexs: [0, 1, 2, 3],
          introduct: "购物优惠/免费停车（另列）",
        },
        {
          name: "引荐入会<br/>（赠100积分）",
          icon: require("@/assets/images/vip/rights2.png"),
          cardIndexs: [0, 1, 2, 3],
          introduct: "引荐入会（赠100积分）",
        },
        {
          name: "完善资料<br/>（赠100积分）",
          icon: require("@/assets/images/vip/rights3.png"),
          cardIndexs: [0, 1, 2, 3],
          introduct: "完善资料（赠100积分）",
        },
        {
          name: "签到积分<br/>（每日赠5积分）",
          icon: require("@/assets/images/vip/rights4.png"),
          cardIndexs: [0, 1, 2, 3],
          introduct: "签到积分（每日赠5积分）",
        },
        {
          name: "积分兑礼<br/>（停车券、礼品或礼券）",
          icon: require("@/assets/images/vip/rights5.png"),
          cardIndexs: [0, 1, 2, 3],
          introduct: "积分兑礼（停车券、礼品或礼券）",
        },
        {
          name: "每月28日双倍积分",
          icon: require("@/assets/images/vip/rights6.png"),
          cardIndexs: [1, 2, 3],
          introduct:
            "当会员生日当天遇上每月28双倍购物积分则享购物3倍积分，不再单独享积分叠加倍数权益。",
        },
        {
          name: "生日当天双倍积分<br/>（需会员完善生日信息）",
          icon: require("@/assets/images/vip/rights7.png"),
          cardIndexs: [1, 2, 3],
          introduct: "生日当天双倍积分（需会员完善生日信息）",
        },
        {
          name: "免费包装<br/>（黑卡限3件/日/人）",
          icon: require("@/assets/images/vip/rights8.png"),
          cardIndexs: [2, 3],
          introduct: "免费包装（黑卡限3件/日/人）（钻石卡限1件/日/人）",
        },
        {
          name: "优先参与活动<br/>（会员沙龙等）",
          icon: require("@/assets/images/vip/rights9.png"),
          cardIndexs: [2, 3],
          introduct: "优先参与活动（会员沙龙等）",
        },
        {
          name: "异业商户优惠专享",
          icon: require("@/assets/images/vip/rights10.png"),
          cardIndexs: [2, 3],
          introduct: "异业商户优惠专享",
        },
        {
          name: "免费邮寄服务<br/>（首重免费）",
          icon: require("@/assets/images/vip/rights11.png"),
          cardIndexs: [3],
          introduct: "免费邮寄服务（首重免费）",
        },
        {
          name: "专人导购",
          icon: require("@/assets/images/vip/rights12.png"),
          cardIndexs: [3],
          introduct: "专人导购",
        },
        {
          name: "预约车位",
          icon: require("@/assets/images/vip/rights13.png"),
          cardIndexs: [3],
          introduct: "预约车位",
        },
      ],
      cardName: "i",
      nextText: "",
      PrevText: "",
      cardInfo: {}, //卡片信息详情
      isShowVipInfo: false,
      isInit: false,
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  created() {
    this.currentScreenType = MAP_CONFIG.SCREEN_TYPE;
    if (MAP_CONFIG.SCREEN_TYPE == "0") {
      this.swiperOption.direction = "horizontal";
      this.swiperOption.slidesPerColumnFill = "column";
      this.swiperOption.autoHeight = false;
      this.swiperOption.centeredSlidesBounds = true;
      this.cardSpace = 800;
      this.cardWidth = 1179;
      this.cardHeight = 825;
      this.cardInverseScaling = 0;
      this.cardDisplay = 3;
    }
    else
    {
        this.swiperOption.scrollbar = {
          el: ".swiper-scrollbar",
          hide: false,
        };
    }
  },
  mounted() {
    let rightsData = [];
    this.allRightsData.forEach((item) => {
      if (item.cardIndexs.toString().indexOf("0") != -1) {
        rightsData.push(item);
      }
    });
    this.currentRightsData = rightsData;
    if (MAP_CONFIG.SCREEN_TYPE == "0") {
      this.horizontalItems = [];
      this.horizontalItems = this.spliceArr(rightsData, this.rowNumber);
      console.log("vipBanner this.horizontalItems =", this.horizontalItems);
    }
    setTimeout(() => {
      this.isInit = true;
    });
  },
  watch: {},
  methods: {
    /**
     * 会员卡切换
     */
    pageChange(e) {
      let activeIndex = e;
      let length = this.bannerImages.length;
      let bannerImages = {};
      if (activeIndex < 1) {
        //最后一张
        this.cardName = this.bannerImages[0].name;
        bannerImages = this.bannerImages[0];
      } else if (activeIndex > length) {
        //   第一张
        this.cardName = this.bannerImages[0].name;
        bannerImages = this.bannerImages[0];
      } else {
        this.cardName = this.bannerImages[activeIndex].name;
        bannerImages = this.bannerImages[activeIndex];
      }
      this.currentRightsData = [];
      let rightsData = [];
      this.allRightsData.forEach((item) => {
        if (item.cardIndexs.toString().indexOf(bannerImages.index) != -1) {
          rightsData.push(item);
        }
      });
      let Timeout = setTimeout(() => {
        this.currentRightsData = rightsData;
        if (MAP_CONFIG.SCREEN_TYPE == "0") {
          this.horizontalItems = [];
          this.horizontalItems = this.spliceArr(rightsData, this.rowNumber);
          //  console.log("会员卡切换 this.currentRightsData =", this.currentRightsData);
          //  console.log("会员卡切换 this.horizontalItems =", this.horizontalItems);
           if(rightsData.length > this.rowNumber)
           {
              this.swiperOption.pagination = {
                el: ".swiper-pagination", //分页指示器
                clickable: true,
              };
           }
        }
        clearTimeout(Timeout);
      }, 0);
    },
    //将数组切割成多少个
    spliceArr(arr, num) {
      let newArr = [];
      for (let i = 0, len = arr.length; i < len; i += num) {
        newArr.push(arr.slice(i, i + num));
      }
      return newArr;
    },
    /**
     * 查看卡片详情
     */
    showRightsInfo(item) {
      this.cardInfo = item;
      this.isShowVipInfo = true;
    },
    /**
     * 下一个
     */
    slideNext() {
      this.swiper.slideNext();
    },
    /**
     * 上一个
     */
    slidePrev() {
      this.swiper.slidePrev();
    },
  },
  components: {
    Carousel3d,
    Slide,
    vipInfo,
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .vipBanner {
    position: absolute;
    width: 100%; //1580px;
    height: 1440px; //100%; //2586px;
    box-sizing: border-box;
    .card {
      width: 100%; // 2183px;
      height: 825px;
      margin: 0 auto;
      // padding-right: 110px;
      box-sizing: border-box;
      .carousel-3d-slide {
        background-color: transparent;
      }
    }
    .cardItem {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      width: 1179px;
      height: 825px;
      color: aliceblue;
      font-size: 40px;
    }
    .rightBox {
      width: 100%;
      // margin-top: -120px;
      .rightsText {
        width: 100%;
        height: 56px;
        background: url("../../assets/images/vip/vip_mask_frame.png") no-repeat center;
        background-size: contain;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          color: #e66579;
          font-size: 42px;
          text-align: center;
          font-weight: bold;
        }
      }
      .tips {
        width: 100%; //1751px;
        height: 39px;
        font-size: 29px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 50px;
        text-align: center;
        color: #e66579;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .rights {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      width: 3194px;
      box-sizing: border-box;
      height: 246px; //674px;
      margin: 70px auto;
      position: relative;
      .swiper {
        width: 3194px;
        height: 275px;
        overflow: hidden;
      }
      .swiperVipShort {
        width: auto;
        justify-content: center;
      }
      .swiperSlide {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: auto; //100%;
        height: 100%;
        flex-direction: row;
        box-sizing: border-box;
      }
      .swiper-pagination {
        width: 100%;
      }
      .rightsRowH {
        width: 319px;
        height: 275px;
        // margin-right: 30px;
      }
      .rightsIcon {
        width: 125px;
        height: 125px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        margin: 0 auto;
      }
      .rightsName {
        text-align: center;
        color: #000000;
        font-size: 29px;
        margin-top: 20px;
        font-weight: normal;
      }
      .vip_right_button_prev {
        position: absolute;
        bottom: 110px;
        left: -62px;
        width: 42px;
        height: 42px;
        background: url("../../assets/images/vip/prev.png") no-repeat center;
        background-size: contain;
      }
      .vip_right_button_next {
        width: 42px;
        height: 42px;
        position: absolute;
        right: -62px;
        bottom: 110px;
        background: url("../../assets/images/vip/next_active.png") no-repeat
          center;
        background-size: contain;
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  .vipBanner {
    position: absolute;
    // top: 570px;//1199px;
    // left: 175px;
    // left: 50%;
    // transform: translateX(-50%);
    width: 100%; //1580px;
    height: 100%; //2586px;
    // background: #f8f1e7;
    box-sizing: border-box;
    // border: 1px solid #d5c9bd;
    // border-radius: 56px;
    .card {
      width: 1750px;
      height: 825px;
      margin: 0 auto;
      padding-right: 110px;
      box-sizing: border-box;
      .carousel-3d-slide {
        background-color: transparent;
      }
    }
    .cardItem {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      width: 1179px;
      height: 825px;
      color: aliceblue;
      font-size: 40px;
    }
    .rightBox {
      width: 1580px;
      margin-top: 150px;
      .rightsText {
        font-size: 42px;
        color: #e66579;
        text-align: center;
        font-weight: bold;
        // margin-top: 39px;
      }
      .tips {
        width: 1751px;
        height: 39px;
        font-size: 29px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 50px;
        text-align: center;
        color: #e66579;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .rights {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      width: 1300px;
      box-sizing: border-box;
      height: 1090px; //674px;
      margin: 158px auto;
      position: relative;
      .swiper {
        height: 1090px; //674px;
        overflow: hidden;
      }
      .swiperSlide {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-right: 140px;
      }
      .rightsItem {
        width: 326px;
        margin: 0 52px 138px;
      }
      .rightsIcon {
        width: 125px;
        height: 125px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        margin: 0 auto;
      }
      .rightsName {
        text-align: center;
        color: #000000;
        font-size: 29px;
        margin-top: 20px;
        font-weight: normal;
      }
    }
  }
}
</style>