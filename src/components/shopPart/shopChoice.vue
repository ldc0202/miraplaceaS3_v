<template>
  <div class="shop-choice-search" @click="closeSearchPop">
    <!-- 搜索页banner -->
    <!-- <div class="shop-part-banner">
      <Banner-Swiper
        :swiperLists="adsList"
        :type="formatType == '购物' ? 'shopping' : 'food'"
        :style="{ width: '1750px', height: '690px' }"
      />
    </div>  -->
    <!-- 搜索栏 -->
    <div class="shop-choice-search-bar">
      <Search ref="searchRef" :noAnimate="false" :type="formatType" />
      <div class="shop-choice-menu-bar animated fadeInDown">
        <span
          v-for="(menu, index) in secondNavList"
          :key="index"
          :class="{
            'shop-choice-menu-bar-active': menu.isActive,
          }"
          @click="toggleSecondMenu(menu)"
          >{{ menu.name }}
          </span>
      </div>
    </div>
    <!-- 二级菜单选择 -->
    <div class="shop-choice-second-menu-container" 
          :class="{
              'swiper-no-swiping' : !isNeedSlideH
            }"
     v-if="currentScreenType==0">
      <Swiper
        ref="mySwiper"
        :class="[
          'shop-choice-second-menu',
          {
            'shop-choice-second-menu-short':
              renderMenuList.length <= rowTwoMenuNum,
          },
         
        ]"
        :options="swiperOption"
      >
        <SwiperSlide
          :class="{
            'shop-choice-second-menu-active': item.isActive,
          }"
          v-for="(item, index) in renderMenuList"
          :key="index"
        >
          <div
            class="ItemLamp"
            @click="formatMenuToggle(item)"
            v-if="item.name.length > 6"
          >
            <span class="ItemName">{{ item.name }}</span>
          </div>
          <div @click="formatMenuToggle(item)" v-else>
            {{ item.name }}
          </div>
        </SwiperSlide>
      </Swiper>
      <div
        v-if="renderMenuList.length > rowTwoMenuNum"
        class="button-prev"
        @click="slidePrev"
      ></div>
      <div
        v-if="renderMenuList.length > rowTwoMenuNum"
        class="button-next"
        @click="slideNext"
      ></div>
    </div>

    <div class="shop-choice-second-menu-container" v-if="currentScreenType==1">
      <div
          :class="[
           'shop-choice-second-menu',
          {
            'shop-choice-second-menu-active': item.isActive,
          }]"
          v-for="(item, index) in renderMenuList"
          :key="index"
        >
          <div
            class="ItemLamp"
            @click="formatMenuToggle(item)"
            v-if="item.name.length > 6"
          >
            <span class="ItemName">{{ item.name }}</span>
          </div>
          <div @click="formatMenuToggle(item)" v-else>
            {{ item.name }}
          </div>
        </div>
    </div>
    <!-- 店铺详情显示 -->
    <ShopShow
      v-if="formatsList.length > 0"
      :formatType="formatType"
      :activeTwoMenu="activeTwoMenu"
      :activeThreeMenu="activeThreeMenu"
      :formatTypeParentRaw="formatTypeParentRaw"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getMapBrandType } from "@/server/shop";
import Search from "@/components/search/search";
// import BannerSwiper from "@/components/swiper/swiper";
import ShopShow from "@/components/shopPart/shopShow";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { GET_PROJECT_SHOP_INFO } from "@/store/home/actionType";
import { sendStatistics } from "@/server/other";
export default {
  props: {
    formatType: String,
  },
  data() {
    let _this = this;
    return {
      isNeedSlideH:false, //是否支持二级业态左右滑动
      currentScreenType: 1, //当前是竖版还是横版 默认1竖版
      rowTwoMenuNum: 6, //一行显示多少个二级菜单按钮(由设计决定)
      // 二级菜单
      secondNavList: [
        {
          name: "业态",
          isActive: true,
        },
        {
          name: "楼层",
          isActive: false,
        },
        {
          name: "字母",
          isActive: false,
        },
      ],
      // 业态分类
      formatsList: [],
      // 楼层分类
      floorsList: [],
      // 字母分类
      wordsList: [
        {
          name: "全部",
          isActive: true,
        },
        {
          name: "ABCDE",
          isActive: false,
        },
        {
          name: "FGHIJ",
          isActive: false,
        },
        {
          name: "KLMNO",
          isActive: false,
        },
        {
          name: "PQRST",
          isActive: false,
        },
        {
          name: "UVWXYZ",
          isActive: false,
        },
      ],
      // 需要渲染的菜单
      renderMenuList: [],
      // 选中的二级菜单
      activeTwoMenu: "业态",
      // 选中的三级菜单
      activeThreeMenu: "全部",
      // 业态父级哈希表
      formatTypeParentRaw: new Map(),
      // swiper 参数
      swiperOption: {
        // width: 240,
        slidesPerView: "auto",
        centeredSlidesBounds: true,
        freeMode: true,
        roundLengths: true, //防止文字模糊
        on: {
          slideChange: function () {
            const buttonNext = document.querySelector(".button-next");
            const buttonPrev = document.querySelector(".button-prev");
            if (buttonNext && buttonPrev) {
              buttonNext.style.backgroundImage =
                this.activeIndex == this.slides.length - _this.rowTwoMenuNum
                  ? `url(${require("../../assets/images/vip/next.png")})`
                  : `url(${require("../../assets/images/vip/next_active.png")})`;
              buttonPrev.style.backgroundImage =
                this.activeIndex == 0
                  ? `url(${require("../../assets/images/vip/prev.png")})`
                  : `url(${require("../../assets/images/vip/prev_active.png")})`;
            }
          },
        },
      },
    };
  },
  computed: {
    ...mapState("home", {
      formatInfo: (state) => state.formatInfo,
      isMapInitCompleted: (state) => state.isMapInitCompleted,
      adsList: (state) => state.adsList,
    }),
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  created() {
    // 每次进都重新拉取一次商铺数据
    this.getShopInfo();
    this.currentScreenType = MAP_CONFIG.SCREEN_TYPE;
    this.isNeedSlideH = MAP_CONFIG.IS_NEED_SLIDE_H;
     if (MAP_CONFIG.SCREEN_TYPE == "0") {
       this.rowTwoMenuNum = 12;
    }
  },
  watch: {
    $route() {
      if (!this.$route.query.menuTwo) {
        this.secondNavList.forEach((item, index) => {
          item.isActive = false;
          if (index == 0) {
            item.isActive = true;
          }
        });
        return;
      }
      this.secondNavStyleUpdate(this.$route.query.menuTwo);
    },
    // 是否地图加载完成 取楼层信息
    isMapInitCompleted: {
      handler: function (status) {
        if (status) {
          this.floorsList = [
            {
              name: "全部",
              isActive: true,
            },
            ...mapConfig.floorData
              .reduce((previousValue, currentValue) => {
                if (
                  MAP_CONFIG.HIDE_SHOP_FLOOR_LIST.find(
                    (floor) => floor == currentValue.name
                  )
                )
                  return previousValue;
                previousValue.push({
                  ...currentValue,
                  isActive: false,
                });
                return previousValue;
              }, [])
              .reverse(),
          ];
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions("home", [GET_PROJECT_SHOP_INFO]),
    // 获取商铺数据
    async getShopInfo() {
      this.GET_PROJECT_SHOP_INFO();
      const formatList = await getMapBrandType();
      this.renderMenuList = this.formatsList = [
        {
          name: "全部",
          icon: "",
          isActive: true,
        },
        ...formatList
          .map((format) => ({
            ...format,
            isActive: false,
            logo: format.logo ? `${MAP_CONFIG.BASE_URL}map/${format.logo}` : "",
          }))
          .filter((format) => {
            if (format.classify == this.formatType) {
              this.formatTypeParentRaw.set(format.name, format.classify);
              return true;
            }
            return false;
          }),
      ];
    },
    // 关闭search输入框pop
    closeSearchPop() {
      // 键盘存在时不允许关闭
      if (document.querySelector(".key-board")) return;
      this.$refs.searchRef?.closePop();
    },
    // 切换二级菜单
    toggleSecondMenu(data) {
      if (data.isActive) return;
      // 每次切换重新退回第一个
      if(this.currentScreenType == 0)
      {
        this.swiper.slideTo(0, 1000, false);
      }
      this.$router.push({
        path: this.$route.path,
        query: { menuTwo: data.name },
      });
      this.secondNavStyleUpdate(data.name);
      // 每次切换二级菜单就重置三级菜单
      this.formatMenuToggle({
        name: "全部",
        isActive: false,
      });
      this.renderMenuList =
        this.activeTwoMenu == "业态"
          ? this.formatsList
          : this.activeTwoMenu == "楼层"
          ? this.floorsList
          : this.wordsList;
      let clickMarks = {
        业态:
          this.formatType == "购物"
            ? "_shopping_brandType_btn"
            : "_dine_brandType_btn",
        楼层:
          this.formatType == "购物" ? "_shopping_floor_btn" : "_dine_floor_btn",
        字母:
          this.formatType == "购物"
            ? "_shopping_letter_btn"
            : "_dine_letter_btn",
      };
      sendStatistics(clickMarks[data.name]);
    },
    // 二级菜单样式修改
    secondNavStyleUpdate(name) {
      this.activeTwoMenu = name;
      this.secondNavList.forEach((item) => {
        item.isActive = false;
        if (item.name == name) {
          item.isActive = true;
        }
      });
    },
    // 业态选择
    formatMenuToggle(data) {
      if (data.isActive) return;
      this.activeThreeMenu = data.name;
      switch (this.activeTwoMenu) {
        case "业态":
          this.formatsList.forEach((item) => {
            item.isActive = false;
            if (item.name == data.name) {
              item.isActive = true;
            }
          });
          sendStatistics(
            this.formatType == "购物"
              ? "_shopping_brandType_detail"
              : "_dine_brandtype_detail",
            data.name
          );
          break;
        case "楼层":
          this.floorsList.forEach((item) => {
            item.isActive = false;
            if (item.name == data.name) {
              item.isActive = true;
            }
          });
          sendStatistics(
            this.formatType == "购物"
              ? "_shopping_floor_detail"
              : "_dine_floor_detail",
            data.floorID
          );
          break;
        case "字母":
          this.wordsList.forEach((item) => {
            item.isActive = false;
            if (item.name == data.name) {
              item.isActive = true;
            }
          });
          sendStatistics(
            this.formatType == "购物"
              ? "_shopping_letter_detail"
              : "_dine_letter_detail",
            data.name
          );
          break;
      }
    },
    // 下一页
    slideNext() {
      this.swiper.slideNext();
      if (this.formatType == "购物") {
        sendStatistics("_shopping_brandType_rightpage");
      }
    },
    // 上一页
    slidePrev() {
      this.swiper.slidePrev();
      if (this.formatType == "购物") {
        sendStatistics("_shopping_brandType_leftpage");
      }
    },
  },
  destroyed() {
    this.formatTypeParentRaw = new Map();
  },
  components: {
    Search,
    Swiper,
    ShopShow,
    SwiperSlide,
    // BannerSwiper,
  },
};
</script>

<style scoped lang="less">
@media screen and (min-width: 2161px) {
  .shop-choice-search {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    .shop-choice-search-bar {
      position: relative;
      width: 972px;
      height: 248px;//280px;
      .shop-choice-menu-bar {
        position: absolute;
        top: 76px;
        left: 96px;
        width: 780px;
        height: 96px;
        background: #ffffff;
        // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        border-radius: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        opacity: 0.9;
        span {
          width: 260px;
          height: 96px;
          border-radius: 48px;
          font-size: 40px;
          font-weight: 400;
          line-height: 96px;
          color: #000000;
          text-align: center;
          transition: all 0.35s;
          &.shop-choice-menu-bar-active {
            color: #ffffff;
          }
          &.shop-choice-menu-bar-active:after {
            content: "";
            display: block;
            width: 260px;
            height: 96px;
            position: absolute;
            top: 0;
            bottom: 0;
            z-index: -1;
            border-radius: 48px;
            // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
            // box-shadow: 0px 25px 50px #f3c7c4;
             background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
            box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
          }
        }
      }
      .search-input {
        position: absolute;
        top: 0px;
        left: 687px;
        transform: translateX(0);
      }
    }
    .shop-choice-second-menu-container {
      position: relative;
      .shop-choice-second-menu {
        width: 3150px;//1560px; //1580px
        margin-top: -20px;
        height: 135px; //75px;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        .swiper-slide {
          width: 247px !important;
          height: 75px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50px;
          font-size: 31px;
          font-weight: 400;
          line-height: 75px;
          color: #000000;
          text-align: center;
          transition: all 0.35s;
          // box-shadow: 0px 10px 25px rgba(230, 101, 121, 0.16);
          box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
          div {
            width: 100%;
            height: 100%;
          }
          & + .swiper-slide {
            margin-left: 18px;
          }
          &.shop-choice-second-menu-active {
            color: #ffffff;
            width: 246px;
            height: 75px;
            // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
            // box-shadow: 0px 12px 25px #f3c7c4;
            background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
            box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
          }
          .ItemLamp {
            width: 236px;
            height: 75px;
            overflow: hidden;
            display: inline-block;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            .ItemName {
              width: 200px;
              height: 75px;
              white-space: nowrap; /* 文字不折行 */
              box-sizing: border-box;
              word-break: break-all;
              display: inline-block;
              padding-right: 0%; /* 从右至左开始滚动 */
              animation: marqyeeTransform 10s linear infinite;
              -moz-animation: marqyeeTransform 10s linear infinite; /* Firefox */
              -webkit-animation: marqyeeTransform 10s linear infinite; /* Safari and Chrome */
              -o-animation: marqyeeTransform 10s linear infinite; /* Opera */
            }
          }
        }
        &.shop-choice-second-menu-short {
          // width: 1560px;//1580px
          justify-content: center;
          min-width: 247px;
          width: auto;
        }
      }
      .button-prev {
        position: absolute;
        bottom: 77px; //17px;
        left: -62px;
        width: 42px;
        height: 42px;
        background: url("../../assets/images/vip/prev.png") no-repeat center;
        background-size: contain;
      }
      .button-next {
        width: 42px;
        height: 42px;
        position: absolute;
        right: -62px;
        bottom: 77px; //17px;
        background: url("../../assets/images/vip/next_active.png") no-repeat
          center;
        background-size: contain;
      }
    }
    @keyframes marqyeeTransform {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(-50%, 0);
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  .shop-choice-search {
    width: 100%;
    height: 100%;
    position: absolute;
    // margin-top: 339px;
    // margin-left: 297px;
    // width: 1751px;
    // height: 3340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // background-color: rgba(255, 255, 255, 0.7);
    // border-radius: 75px;
    // .shop-part-banner {
    //   width: 100%;
    //   height: 690px;
    // }

    .shop-choice-search-bar {
      position: relative;
      width: 972px;
      height: 280px;
      margin-top: 70px;
      // border-bottom: 1px solid #707070;
      .shop-choice-menu-bar {
        position: absolute;
        top: 160px;
        left: 96px;
        width: 780px;
        height: 96px;
        background: #ffffff;
        // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        border-radius: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        opacity: 0.9;
        span {
          width: 260px;
          height: 96px;
          border-radius: 48px;
          font-size: 40px;
          font-weight: 400;
          line-height: 96px;
          color: #000000;
          text-align: center;
          transition: all 0.35s;
          &.shop-choice-menu-bar-active {
            color: #ffffff;
          }
          &.shop-choice-menu-bar-active:after {
            content: "";
            display: block;
            width: 260px;
            height: 96px;
            position: absolute;
            top: 0;
            bottom: 0;
            z-index: -1;
            border-radius: 48px;
            // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
            background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
            box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
            // box-shadow: 0px 25px 50px #f3c7c4;
          }
        }
      }
      .search-input {
        position: absolute;
        top: 0px;
        left: 687px;
        transform: translateX(0);
      }
    }

    .shop-choice-second-menu-container {
      position: relative;
        width: 1750px;
        margin-top: 40px;
        height: 190px;//77px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        
        // padding-left: 20px;
        // padding-right: 20px;
      .shop-choice-second-menu {
        flex-shrink: 0;
        // .swiper-slide {
          width: 247px;
          height: 75px;
          background: rgba(255, 255, 255, 0.9); //#ffffff;
          border-radius: 50px;
          font-size: 31px;
          font-weight: 400;
          line-height: 75px;
          color: #000000;
          text-align: center;
          transition: all 0.35s;
          // box-shadow: 0px 10px 25px rgba(230, 101, 121, 0.16);
          box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
          margin-right: 18px;
          margin-bottom: 18px;

          &.shop-choice-second-menu-active {
            color: #ffffff;
            width: 246px;
            height: 75px;
            // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
            // box-shadow: 0px 12px 25px #f3c7c4;
            background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
            box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
          }
         .ItemLamp {
            width: 236px;
            height: 75px;
            overflow: hidden;
            display: inline-block;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            .ItemName {
              width: 200px;
              height: 75px;
              white-space: nowrap; /* 文字不折行 */
              box-sizing: border-box;
              word-break: break-all;
              display: inline-block;
              padding-right: 0%; /* 从右至左开始滚动 */
              animation: marqyeeTransform 10s linear infinite;
              -moz-animation: marqyeeTransform 10s linear infinite; /* Firefox */
              -webkit-animation: marqyeeTransform 10s linear infinite; /* Safari and Chrome */
              -o-animation: marqyeeTransform 10s linear infinite; /* Opera */
            }
          }
        // }
        // &.shop-choice-second-menu-short {
        //   justify-content: center;
        //   min-width: 247px;
        //   width: auto;
        // }
        //  .shop-choice-second-menu {
        // width: 1580px;
        // margin-top: 97px;
        // height: 135px;//77px;
        // padding-left: 20px;
        // padding-right: 20px;
        // .swiper-slide {
        //   width: 247px !important;
        //   height: 75px;
        //   background: rgba(255, 255, 255, 0.9); //#ffffff;
        //   border-radius: 50px;
        //   font-size: 31px;
        //   font-weight: 400;
        //   line-height: 75px;
        //   color: #000000;
        //   text-align: center;
        //   transition: all 0.35s;
        //   box-shadow: 0px 10px 25px rgba(230, 101, 121, 0.16);
        //   // opacity: 0.9;
        //   div {
        //     width: 100%;
        //     height: 100%;
        //   }

        //   & + .swiper-slide {
        //     margin-left: 18px;
        //   }

        //   &.shop-choice-second-menu-active {
        //     color: #ffffff;
        //     width: 246px;
        //     height: 75px;
        //     // border: 1px solid rgba(0, 0, 0, 0);
        //     background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
        //     box-shadow: 0px 12px 25px #f3c7c4;
        //   }
        //     .ItemLamp {
        //     width: 240px;
        //     height: 75px;
        //     overflow: hidden;
        //     display: inline-block;
        //     box-sizing: border-box;
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        //     .ItemName {
        //       width: 200px;
        //       height: 75px;
        //       white-space: nowrap; /* 文字不折行 */
        //       box-sizing: border-box;
        //       word-break: break-all;
        //       display: inline-block;
        //       padding-right: 0%; /* 从右至左开始滚动 */
        //       animation: marqyeeTransform 10s linear infinite;
        //       -moz-animation: marqyeeTransform 10s linear infinite; /* Firefox */
        //       -webkit-animation: marqyeeTransform 10s linear infinite; /* Safari and Chrome */
        //       -o-animation: marqyeeTransform 10s linear infinite; /* Opera */
        //     }
        //   }
        // }
        // &.shop-choice-second-menu-short {
        //   // width: 1580px;
        //   justify-content: center;
        //   min-width: 247px;
        //   width: auto;
        // }
      }

      .button-prev {
        position: absolute;
        bottom: 77px;//17px;
        left: -62px;
        width: 42px;
        height: 42px;
        // border-radius: 100px;
        background: url("../../assets/images/vip/prev.png") no-repeat center;
        background-size: contain;
      }

      .button-next {
        width: 42px;
        height: 42px;
        // border-radius: 100px;
        position: absolute;
        right: -62px;
        bottom: 77px;//17px;
        background: url("../../assets/images/vip/next_active.png") no-repeat
          center;
        background-size: contain;
      }
    }
     @keyframes marqyeeTransform {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(-50%, 0);
      }
    }
  }
}
</style>