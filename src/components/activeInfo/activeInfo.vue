<template>
  <div class="activeInfo" @click.self="closeInfo">
    <div class="infoContainer">
      <div
        class="imgBox"
        :style="{
          backgroundImage: `url(${imgServe}${activeInfoMsg.Poster})`,
        }"
        v-if="activeInfoMsg.Poster"
      ></div>
      <div class="imgBox image-slot" v-else></div>
      <div class="actName">{{ activeInfoMsg.Title }}</div>
      <div class="actInfo">
        <!-- <div class="title">活动日期</div>
        <div class="Content">
          {{ activeInfoMsg.StartDate }}-{{ activeInfoMsg.OverDate }}
        </div> -->

        <!-- <div class="title">活动时间</div>
        <div class="Content">
          {{ activeInfoMsg.StartTime }}-{{ activeInfoMsg.OverTime }}
        </div> -->

        <!-- <div class="title">活动说明</div> -->
        <div class="Content">
          <swiper
            class="swiper"
            :options="swiperOption"
            :class="{
              swiperMini: activeInfoMsg.EventsType.toLowerCase() == 'brand',
            }"
          >
            <swiper-slide>
              {{ activeInfoMsg.Content }}
            </swiper-slide>
            <div class="swiper-scrollbar" slot="scrollbar"></div>
          </swiper>
        </div>
      </div>
      <div class="dateDiv">
        <img src="../../assets/images/active/time.png" alt="" />
        <span
          >{{ dateToChineseStr(activeInfoMsg.StartDate) }} -
          {{ dateToChineseStr(activeInfoMsg.OverDate) }}</span
        >
      </div>
      <div class="qrcodeInfoBox">
        <!-- <div class="qrcodeContainer" v-if="activeInfoMsg.ArticleHtmlUrl">
          <qrcode
            :value="activeInfoMsg.ArticleHtmlUrl"
            :options="qrcodeOption"
            class="qrcodeImg"
          />
        </div>
        <div class="text" v-if="activeInfoMsg.ArticleHtmlUrl">扫码获取详情</div> -->
        <div
          class="gomap"
          @click="goMap"
          v-if="
            activeInfoMsg.EventsType.toLowerCase() == 'brand' &&
            activeInfoMsg.PointID
          "
        >
          <span>获取路线</span>
        </div>
      </div>

      <!-- <img
        src="../../assets/images/animat/rabbit2.png"
        alt=""
        class="pop-ups-info-animation"
      /> -->
    </div>
    <div class="closeBtn" @click="closeInfo">
      <!-- <i class="el-icon-circle-plus-outline"></i> -->
      <img src="../../assets/images/close.png" alt="" />
    </div>
  </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { dateToChinese } from "@/utils";
import { sendStatistics } from "@/server/other";
export default {
  props: {
    activeInfoMsg: Object,
  },
  data() {
    return {
      imgServe: `${MAP_CONFIG.BASE_URL}map/`,
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
      isShowQrcodeBox: false, //是否显示活动报名板块
      qrcodeOption: {
        color: {
          dark: "#000",
          light: "#fff",
        },
      },
    };
  },
  computed: {},
  created() {
    console.log();
  },
  mounted() {},
  watch: {},
  methods: {
    closeInfo() {
      this.$emit("closeInfo");
    },
    showQrcodeBox() {
      this.isShowQrcodeBox = true;
    },
    goMap() {
      this.$EventBus.$emit("searchEvent", this.activeInfoMsg.shopInfo);
      sendStatistics("_event_brand_list_map_btn");
    },
    /**
     * 返回日期转换成中文显示
     */
    dateToChineseStr(str) {
      return dateToChinese(str);
    },
  },
  components: { [VueQrcode.name]: VueQrcode },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .activeInfo {
    position: fixed !important;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(64, 64, 64, 0.68);
    z-index: 3001;
    .infoContainer {
      width: 1570px;
      height: 1684px;
      background: #ffffff;
      border-radius: 20px;
      position: absolute;
      top: 238px;
      left: 1135px;
      box-sizing: border-box;
      .imgBox {
        width: 1528px;
        height: 688px;
        margin: 54px auto;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        img {
          width: 100%;
          height: 100%;
        }
        &.image-slot {
          background-image: url("../../assets/images/active/noImg.png");
        }
      }
      .image-slot {
        background-size: contain;
        background-image: url("../../assets/images/active/noImg.png");
      }
      .actName {
        width: 1390px;
        height: 55px;
        font-size: 42px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 55px;
        color: #000000;
        margin: 73px auto;
        text-align: center;
      }
      .actInfo {
        width: 100%;
        height: 550px;
        .swiper {
          width: 1394px;
          height: 550px;
        }
        .swiperMini {
          height: 550px;
        }
        .Content {
          width: 1394px;
          height: 550px;
          font-size: 29px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 60px;
          color: #000000;
          margin: 0 auto;
          // margin-bottom: 24px;
          // padding: 0 20px;
        }
      }
      .dateDiv {
        width: 500px;
        height: 26px;
        margin: 2px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          // display: inline-block;
          color: #000000;
          font-size: 20px;
          font-family: Microsoft YaHei;
        }
        img {
          width: 23px;
          height: 23px;
          margin-right: 6px;
        }
      }
      .qrcodeInfoBox {
        width: 220px;
        position: absolute;
        bottom: 67px;
        left: 643px;
        .gomap {
          width: 284px;
          height: 75px;
          background: #ffffff;
          border-radius: 50px;
          border: 1px solid #e66579;
          box-shadow: 0px 20px 20px rgba(230, 101, 121, 0.16);
          opacity: 0.9;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            width: 124px;
            height: 41px;
            font-size: 31px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 41px;
            color: #e66579;
            opacity: 1;
          }
        }
      }
       // .qrcodeInfoBox {
      //   width: 220px;
      //   position: absolute;
      //   bottom: 68px;
      //   left: 50%;
      //   transform: translateX(-50%);
      //   .qrcodeContainer {
      //     width: 160px;
      //     height: 160px;
      //     box-sizing: border-box;
      //     border: 5px solid #e6d1b1;
      //     border-radius: 5px;
      //     margin: 0 auto;
      //     .qrcodeImg {
      //       display: block;
      //       width: 100% !important;
      //       height: 100% !important;
      //     }
      //   }
      //   .text {
      //     margin-top: 13px;
      //     text-align: center;
      //     font-size: 20px;
      //     font-weight: 300;
      //     line-height: 26px;
      //     color: #7f7673;
      //   }
      //   .gomap {
      //     width: 220px;
      //     height: 50px;
      //     background: #ffffff;
      //     border: 1px solid #aa8d17;
      //     font-size: 32px;
      //     font-weight: 400;
      //     line-height: 50px;
      //     color: #b78931;
      //     text-align: center;
      //     margin-top: 46px;
      //     border-radius: 26px;
      //     span {
      //       display: inline-block;
      //       width: 13px;
      //       height: 17px;
      //       background: url("../../assets/images/movie/go2cinema.png") no-repeat
      //         center;
      //       background-size: cover;
      //       margin-left: 8px;
      //     }
      //     &:active {
      //       color: #ffffff;
      //       background: #aa8d17;
      //       span {
      //         background: url("../../assets/images/movie/go2cinemaDown.png")
      //           no-repeat center;
      //       }
      //     }
      //   }
      // }
      // .enterBtn {
      //   width: 224px;
      //   height: 93px;
      //   color: #fff;
      //   font-size: 26px;
      //   line-height: 93px;
      //   text-align: center;
      //   position: absolute;
      //   left: 50%;
      //   bottom: 63px;
      //   transform: translateX(-50%);
      //   background: linear-gradient(57deg, #f09962, #e85400);
      //   border-radius: 47px;
      //   z-index: 1;
      // }
      // .enterBtnBefore {
      //   width: 224px;
      //   height: 93px;
      //   position: absolute;
      //   border: #d75e27 2px solid;
      //   left: calc(50% + 11px);
      //   bottom: 68px;
      //   transform: translateX(-50%);
      //   background-color: #fff;
      //   border-radius: 47px;
      //   z-index: 0;
      //   box-shadow: 0 28px 56px rgba(232, 84, 0, 0.3);
      // }
    }
    .closeBtn {
      position: absolute;
      top: 196px;
      left: 2663px;
      width: 84px;
      height: 84px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  .activeInfo {
    position: fixed !important;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(64, 64, 64, 0.68);
    z-index: 3001;
    .infoContainer {
      width: 1570px;
      height: 1684px;
      background: #ffffff;
      // border: 1px solid #707070;
      border-radius: 20px;
      position: absolute;
      top: 1078px;
      left: 50%;
      transform: translateX(-50%);
      // padding: 30px;
      box-sizing: border-box;
      .imgBox {
        width: 1528px;
        height: 688px;
        margin: 54px auto;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        img {
          width: 100%;
          height: 100%;
        }
        &.image-slot {
          background-image: url("../../assets/images/active/noImg.png");
        }
      }
      .image-slot {
        background-size: contain;
        background-image: url("../../assets/images/active/noImg.png");
      }
      .actName {
        width: 1390px;
        height: 55px;
        font-size: 42px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 55px;
        color: #000000;
        margin: 73px auto;
        text-align: center;
      }
      .actInfo {
        width: 100%;
        height: 550px;
        // margin-top: 40px;
        .swiper {
          width: 1394px;
          height: 550px;
        }
        .swiperMini {
          height: 550px;
        }
        // .title {
        //   color: #3f3a39;
        //   font-size: 24px;
        //   font-weight: bold;
        //   padding: 0 20px;
        // }
        .Content {
          width: 1394px;
          height: 550px;
          font-size: 29px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 60px;
          color: #000000;
          margin: 0 auto;
          // margin-bottom: 24px;
          // padding: 0 20px;
        }
      }
      .dateDiv {
        width: 500px;
        height: 26px;
        margin: 2px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          // display: inline-block;
          color: #000000;
          font-size: 20px;
          font-family: Microsoft YaHei;
        }
        img {
          width: 23px;
          height: 23px;
          margin-right: 6px;
        }
      }
      .qrcodeInfoBox {
        width: 220px;
        position: absolute;
        bottom: 67px;
        left: 643px;
        // transform: translateX(-50%);
        // .qrcodeContainer {
        //   width: 160px;
        //   height: 160px;
        //   box-sizing: border-box;
        //   border: 5px solid #e6d1b1;
        //   border-radius: 5px;
        //   margin: 0 auto;
        //   .qrcodeImg {
        //     display: block;
        //     width: 100% !important;
        //     height: 100% !important;
        //   }
        // }
        // .text {
        //   margin-top: 13px;
        //   text-align: center;
        //   font-size: 20px;
        //   font-weight: 300;
        //   line-height: 26px;
        //   color: #7f7673;
        // }
        .gomap {
          width: 284px;
          height: 75px;
          background: #ffffff;
          border-radius: 50px;
          border: 1px solid #e66579;
          box-shadow: 0px 20px 20px rgba(230, 101, 121, 0.16);
          opacity: 0.9;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            width: 124px;
            height: 41px;
            font-size: 31px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 41px;
            color: #e66579;
            opacity: 1;
          }
        }
      }
      // .enterBtn {
      //   width: 224px;
      //   height: 93px;
      //   color: #fff;
      //   font-size: 26px;
      //   line-height: 93px;
      //   text-align: center;
      //   position: absolute;
      //   left: 50%;
      //   bottom: 63px;
      //   transform: translateX(-50%);
      //   background: linear-gradient(57deg, #f09962, #e85400);
      //   border-radius: 47px;
      //   z-index: 1;
      // }
      // .enterBtnBefore {
      //   width: 224px;
      //   height: 93px;
      //   position: absolute;
      //   border: #d75e27 2px solid;
      //   left: calc(50% + 11px);
      //   bottom: 68px;
      //   transform: translateX(-50%);
      //   background-color: #fff;
      //   border-radius: 47px;
      //   z-index: 0;
      //   box-shadow: 0 28px 56px rgba(232, 84, 0, 0.3);
      // }
    }
    .closeBtn {
      position: absolute;
      top: 1037px;
      left: 1824px; //50%;
      // transform: translateX(-50%);
      width: 84px;
      height: 84px;
      // cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
      // .el-icon-circle-plus-outline {
      //   color: #fff;
      //   font-size: 88px;
      //   transform: rotateZ(45deg);
      // }
    }
    // .qrcodeBox {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   background-color: rgba(64, 64, 64, 0.68);
    //   z-index: 9;
    //   .qrcodeContainer {
    //     width: 671px;
    //     height: 671px;
    //     position: absolute;
    //     top: 671px;
    //     left: 50%;
    //     transform: translateX(-50%);
    //     background-color: #fff;
    //     border-radius: 26px;
    //     .qrcodeImg {
    //       width: 148px;
    //       height: 148px;
    //       margin: 0 auto;
    //       margin-top: 68px;
    //       margin-bottom: 20px;
    //       background: url("../../assets/images/active/qrcodeBg.png") center center
    //         no-repeat;
    //       background-size: 100% 100%;
    //       position: relative;
    //       .qrcode {
    //         width: 125px;
    //         width: 125px;
    //         position: absolute;
    //         top: 50%;
    //         left: 50%;
    //         transform: translate(-50%, -50%);
    //       }
    //     }
    //     .explain {
    //       color: #e85400;
    //       font-size: 22px;
    //       text-align: center;
    //     }
    //     .qrcodeImgContent {
    //       width: 230px;
    //       height: calc(365px - 47px);
    //       position: absolute;
    //       top: 353px;
    //       left: 50%;
    //       transform: translateX(-50%);
    //       img {
    //         width: 100%;
    //         height: 100%;
    //       }
    //     }
    //   }
    //   .closeBtn {
    //     position: absolute;
    //     top: 1402px;
    //     left: 50%;
    //     transform: translateX(-50%);
    //     width: 88px;
    //     height: 88px;
    //     // cursor: pointer;
    //     .el-icon-circle-plus-outline {
    //       color: #fff;
    //       font-size: 88px;
    //       transform: rotateZ(45deg);
    //     }
    //   }
    // }
  }
}
</style>
