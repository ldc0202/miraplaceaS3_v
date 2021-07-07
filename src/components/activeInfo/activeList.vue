<template>
  <div class="activContainer">
    <!-- <div class="animationBox"> class="listItem animated" -->
    <swiper
      :class="['list']"
      :options="swiperOption"
      v-if="renderBrands.length > 0 || hasLoading"
    >
      <swiper-slide
        class="active_swiper_slide"
        v-for="(shops, i) in renderBrands"
        :key="i"
      >
        <div
          class="listItem"
          :class="{
            fadeInUp: renderBrandsChanged,
            transparentItem: !renderBrandsChanged,
          }"
          v-for="(shop, index) in shops"
          :key="index"
          @click="selectactiveInfo(shop)"
        >
          <div
            class="item_logo"
            :style="{
              backgroundImage: `url(${imgServe}${shop.Poster})`,
            }"
            v-if="shop.Poster"
          ></div>
          <div class="item_logo image-slot" v-else></div>
          <div class="shop_info">
            <div class="name">{{ shop.Title }}</div>
            <div class="time">
              <img src="../../assets/images/active/time.png" alt="" />
              <span
                >{{ dateToChineseStr(shop.StartDate) }} -
                {{ dateToChineseStr(shop.OverDate) }}</span
              >
            </div>
          </div>
          <div class="searchBtn" @click.self="selectactiveInfo(shop)">
            <span></span>
          </div>
        </div>
      </swiper-slide>
      <div
        class="swiper-scrollbar"
        slot="scrollbar"
        v-if="currentScreenType == 1"
      />
      <!--分页器。如果放置在swiper-container外面，需要自定义样式。-->
      <div
        class="swiper-pagination"
        slot="pagination"
        v-if="currentScreenType == 0 && renderBrands.length > 8"
      />
    </swiper>
    <nopage class="nopage" :tipText="'暂无数据'" v-else />
    <!-- </div> -->
  </div>
</template>

<script>
import nopage from "@/components/basePage/noPage";
import { dateToChinese } from "@/utils";
export default {
  props: {
    renderBrands: Array,
    hasLoading: {
      type: Boolean,
      // 可选字段，有默认值
      default: true,
    },
  },
  data() {
    return {
      isFirstLoad: false,
      currentScreenType: 1, //当前是竖版还是横版 默认1竖版
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        mousewheel: true,
        autoHeight: true,
        roundLengths: true, //防止文字模糊
      },
      selectActiveId: "",
      imgServe: `${MAP_CONFIG.BASE_URL}map/`,
      renderBrandsChanged: false,
    };
  },
  computed: {},
  created() {
    console.log("created renderBrands.length=", this.renderBrands.length);
    this.currentScreenType = MAP_CONFIG.SCREEN_TYPE;
    if (MAP_CONFIG.SCREEN_TYPE == "0") {
      this.swiperOption.direction = "horizontal";
      this.swiperOption.slidesPerColumnFill = "column";
      this.swiperOption.autoHeight = false;
      this.swiperOption.centeredSlidesBounds = true;
    }
    else
    {
      this.swiperOption.scrollbar = {
          el: ".swiper-scrollbar", //scrollbar容器的css选择器或HTML元素。类型：string/HTML Element，默认：.swiper-scrollbar。
          hide: false, //false表示不会自动隐藏
      };
    }
  },
  mounted() {
  },
  watch: {
    renderBrands: function (newVal, oldVal) {
      if (newVal.length > 8) {
        if(!this.swiperOption.pagination)
        {
          this.swiperOption.pagination = {
            el: ".swiper-pagination", //分页指示器
            clickable: true,
          };
        }
      }
      this.renderBrandsChanged = false;
      let timer = setTimeout(() => {
        this.renderBrandsChanged = true;
        clearTimeout(timer);
      }, 10);
    },
  },
  methods: {
    selectactiveInfo(item) {
      this.selectActiveId = item.EventsID;
      this.$emit("selectactiveInfo", item);
    },
    /**
     * 返回日期转换成中文显示
     */
    dateToChineseStr(str) {
      return dateToChinese(str);
    },
  },
  components: {
    nopage,
  },
  destroyed() {},
};
</script>

<style scoped lang='less'>
@media screen and (min-width: 2161px) {
  .activContainer {
    position: absolute;
    top: 397px;
    width: 3226px;
    height: 1148px;
    .nopage {
      margin-top: 150px;
    }
    .list {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding-left: 20px;
      padding-top: 20px;
      .active_swiper_slide {
        width: 100%;
        height: 498px;
        display: flex;
        box-sizing: border-box;
        flex-wrap: wrap;
        &:last-of-type {
          //CSS伪类:last-of-type代表在一群兄弟元素中的最后一个指定类型的元素。这里表示最后一个元素外边距右边为0
          margin-right: 0;
        }
        .listItem {
          width: 786px;
          height: 498px;
          background-color: rgba(255, 255, 255, 0.9);
          // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
          box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
          border-radius: 20px;
          position: relative;
          margin-bottom: 18px; //50px;
          margin-right: 24px; //50px;
          box-sizing: border-box;
          display: flex;
          flex-flow: column;
          &:nth-of-type(4n) {
            margin-right: 0px;
          }
          .item_logo {
            display: block;
            width: 746px;
            height: 335px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 26px;
            margin: 26px auto;
          }
          .image-slot {
            background-size: contain;
            background-image: url("../../assets/images/active/noImg.png");
          }
          .shop_info {
            position: relative;
            margin-top: 10px;
            margin-left: 62px;
            .name {
              width: 590px;
              box-sizing: border-box;
              font-size: 28px;
              line-height: 28px;
              height: 28px;
              color: #000000;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            }
            .time {
              margin-top: 22px;
              display: flex;
              align-items: center;
              span {
                display: inline-block;
                color: #000000;
                font-size: 20px;
              }
              img {
                width: 23px;
                height: 23px;
                margin-right: 6px;
              }
            }
          }
          .searchBtn {
            width: 82px;
            height: 82px;
            position: absolute;
            bottom: 26px;
            right: 48px;
            box-shadow: 0px 0px 50px #f3c7c4;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              width: 84px;
              height: 84px;
              background: url("../../assets/images/active/search.png") no-repeat
                center;
              background-size: cover;
            }
            &:active {
              span {
                width: 84px;
                height: 84px;
                background: url("../../assets/images/active/search.png")
                  no-repeat center;
                background-size: cover;
              }
            }
          }
        }
        .transparentItem {
          opacity: 0;
        }
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  .activContainer {
    position: absolute;
    // left: 50%;
    top: 446px;
    // transform: translateX(-50%);
    width: 1656px;
    height: 2800px;
    .nopage {
      margin-top: 708px;
    }
    // .animationBox {
    //   width: 100%;
    //   height: 100%;
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   padding-right: 84px;
    //   box-sizing: border-box;
    // }
    .list {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding-top: 20px;
      padding-left: 20px;
      .active_swiper_slide {
        // width: 100%;
        // height: 100%;//498px;
        display: flex;
        box-sizing: border-box;
        flex-wrap: wrap;
        &:last-of-type {
          //CSS伪类:last-of-type代表在一群兄弟元素中的最后一个指定类型的元素。这里表示最后一个元素外边距右边为0
          margin-right: 0;
        }
        .listItem {
          width: 786px;
          height: 498px;
          background-color: rgba(255, 255, 255, 0.9);
          // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
          box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
          border-radius: 20px;
          position: relative;
          margin-bottom: 18px; //50px;
          margin-right: 24px; //50px;
          box-sizing: border-box;
          display: flex;
          flex-flow: column;
          // align-items: center;
          &:nth-of-type(4n) {
            margin-right: 0px;
          }
          .item_logo {
            display: block;
            width: 746px;
            height: 335px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 26px;
            margin: 26px auto;
          }
          .image-slot {
            background-size: contain;
            background-image: url("../../assets/images/active/noImg.png");
          }
          .shop_info {
            position: relative;
            margin-top: 10px;
            margin-left: 62px;
            .name {
              width: 590px;
              box-sizing: border-box;
              font-size: 28px;
              line-height: 28px;
              height: 28px;
              color: #000000;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            }
            .time {
              margin-top: 22px;
              display: flex;
              align-items: center;
              span {
                display: inline-block;
                color: #000000;
                font-size: 20px;
              }
              img {
                width: 23px;
                height: 23px;
                margin-right: 6px;
              }
            }
          }
          .searchBtn {
            width: 82px;
            height: 82px;
            position: absolute;
            bottom: 26px;
            right: 48px;
            box-shadow: 0px 0px 50px #f3c7c4;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              width: 84px;
              height: 84px;
              background: url("../../assets/images/active/search.png") no-repeat
                center;
              background-size: cover;
            }
            &:active {
              span {
                width: 84px;
                height: 84px;
                background: url("../../assets/images/active/search.png")
                  no-repeat center;
                background-size: cover;
              }
            }
          }
        }
        .transparentItem {
          opacity: 0;
        }
      }
    }
  }
}
</style>