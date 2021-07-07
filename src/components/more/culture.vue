<template>
  <div class="cultureBox">
    <div class="culture" v-if="activeData.length > 0 || hasLoading">
      <swiper
        class="swiper"
        :options="swiperOption"
      >
        <swiper-slide class="swiperSlide">
          <div
            v-for="item in activeData"
            :key="item.id"
            class="cultureItem busItem animated fadeIn"
          >
            <div
              class="imgBox"
              :style="{
                backgroundImage: `url(${imgServe}${item.Poster})`,
              }"
              v-if="item.Poster"
            ></div>
            <div class="imgBox image-slot" v-else></div>
            <div class="name">{{ item.Title }}</div>
            <div class="contactText">
              <swiper class="swiperContactText" :options="contactTextOption">
                <swiper-slide>
                  <div class="ContactTextInfo">
                    {{ item.Content }}
                  </div>
                </swiper-slide>
                <div class="contactText-scrollbar" slot="scrollbar"></div>
              </swiper>
            </div>
            <div class="qrcodeBox" v-if="item.ArticleHtmlUrl">
              <div class="qrcodeContainer">
                <qrcode
                  :value="item.ArticleHtmlUrl"
                  :options="qrcodeOption"
                  class="qrcodeImg"
                />
              </div>
              <div class="text">了解更多</div>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-scrollbar scrollbar" slot="scrollbar"></div>
      </swiper>
      <!-- <div class="shop-brand-show-empty" v-else>暂无数据</div> -->
    </div>
    <nopage class="nopage" :tipText="'暂无数据'" v-else />
  </div>
</template>

<script>
import { getPjIdsActivities } from "@/server/active";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import dayjs from "dayjs";
import nopage from "@/components/basePage/noPage";
export default {
  props: {},
  data() {
    return {
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true,
        },
        mousewheel: true,
        autoHeight: true,
        roundLengths: true, //防止文字模糊
      },
      contactTextOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
          el: ".contactText-scrollbar",
          hide: true,
        },
        mousewheel: true,
        autoHeight: true,
        roundLengths: true, //防止文字模糊
      },
      imgServe: `${MAP_CONFIG.BASE_URL}map/`,
      activeData: [],
      qrcodeOption: {
        color: {
          dark: "#000",
          light: "#fff",
        },
      },
      typeSelect: "Culture", //筛选用的活动类型
      hasLoading: true,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getData();
  },
  watch: {},
  methods: {
    async getData() {
      const result = await getPjIdsActivities();
      this.hasLoading = false;
      let selectData = [];
      result.forEach((element) => {
        if (this.compareDate(element)) {
          if (element.EventsType && this.typeSelect) {
            if (
              this.typeSelect.toLowerCase() == element.EventsType.toLowerCase()
            ) {
              selectData.push(element);
            }
          }
        }
      });
      this.activeData = selectData;
    },
    //判断当前日期是否在限定日期内
    compareDate(data) {
      const currentDate = ~~dayjs().format("YYYYMMDD");
      return (
        currentDate >= ~~data.PublishStartDate.replace(/-/g, "") &&
        currentDate <= ~~data.PublishOverDate.replace(/-/g, "")
      );
    },
  },
  components: { [VueQrcode.name]: VueQrcode, nopage },
};
</script>

<style lang='less'>
.cultureBox{
   .nopage{
    margin-top: 517px;
  }
  .culture {
  width: 1580px;
  height: 2334px;
  background: #f8f1e7;
  opacity: 1;
  border-radius: 60px;
  margin: 229px auto 0;
  padding: 70px;
  padding-bottom: 0;
  padding-right: 26px;
  box-sizing: border-box;
  .swiper {
    padding-right: 35px;
    height: 2266px;
  }
  .swiperSlide {
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
  }
  .busItem {
    width: 686px;
    box-sizing: border-box;
    margin-right: 68px;
    margin-bottom: 70px;
    &:nth-of-type(2n) {
      margin-right: 0px;
    }
    &.cultureItem {
      width: 686px;
      height: 890px;
      background: #ffffff;
      opacity: 1;
      border-radius: 30px;
      box-sizing: border-box;
      padding: 28px;
      padding-bottom: 0;
      position: relative;
      .imgBox {
        width: 630px;
        height: 430px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 24px;
        // border: 1px #e6d1b1 solid;
        box-sizing: border-box;
      }
      .image-slot{
          background-size: contain;
          background-image: url("../../assets/images/active/noImg.png");
        }
      .name {
        font-size: 30px;
        font-weight: bold;
        color: #7f7673;
        opacity: 1;
        margin-top: 21px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      .contactText {
        margin-top: 10px;
        height: 122px;
        font-size: 20px;
        font-weight: 300;
        line-height: 26px;
        color: #7f7673;
        opacity: 1;
        .ContactTextInfo {
          font-size: 20px;
          font-weight: 300;
          line-height: 26px;
          color: #7f7673;
        }
      }
      .qrcodeBox {
        width: 160px;
        position: absolute;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);
        .qrcodeContainer {
          width: 160px;
          height: 160px;
          box-sizing: border-box;
          border: 5px solid #e6d1b1;
          border-radius: 5px;
          .qrcodeImg {
            display: block;
            width: 100% !important;
            height: 100% !important;
          }
        }
        .text {
          margin-top: 13px;
          text-align: center;
          font-size: 20px;
          font-weight: 300;
          line-height: 26px;
          color: #7f7673;
        }
      }
    }
  }
  .swiper-scrollbar {
    width: 10px;
    background-color: transparent;
  }
  .shop-brand-show-empty {
    width: 100%;
    height: 100%;
    line-height: 900px;
    text-align: center;
    font-size: 36px;
    color: #42210b;
  }
}
}

</style>
