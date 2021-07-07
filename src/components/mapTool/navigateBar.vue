<template>
  <div
    class="map-navigate-bar animated fadeInDown"
    v-show="areaInfo && !isFacitityNavigate"
  >
    <!-- <div class="map-navigate-bar animated fadeInDown"> -->
    <!-- 无导航时提示 -->
    <!-- <div class="map-navigate-bar-tip" v-if="!areaInfo || isFacitityNavigate">
      <div class="map-navigate-bar-tip-image">
        <span></span>
        <p>您可以点击下方的地图进行寻路指引</p>
      </div>
      <QrCode :shareLink="shareLink" />
    </div> -->
    <!-- 车位寻车时提示 -->
    <div
      class="map_parking_navigate_bar_info"
      v-if="areaInfo && areaInfo.code == 'carport'"
    >
      <span class="parking_number">车位号：{{ areaInfo.name }}</span>
      <QrCode :shareLink="shareLink" />
      <div class="closeBtn" @click="closeInfo">
        <img src="../../assets/images/close.png" alt="" />
      </div>
    </div>
    <!-- 车牌寻车时提示 -->
    <div
      class="map_plate_navigate_bar_info"
      v-if="areaInfo && areaInfo.code == 'plate'"
    >
      <el-image class="plate_car_image" :src="areaInfo.logo">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="plate_text_group">
        <span class="plate_number">{{ areaInfo.plateNumber }}</span>
        <span class="plate_text">楼层：{{ areaInfo.floor }}</span>
        <span class="plate_text">分区：{{ areaInfo.partition || "--" }}</span>
        <span class="plate_text">车位号：{{ areaInfo.parkingNumber }}</span>
        <span class="plate_text">停放时长：{{ areaInfo.times || "--" }}</span>
      </div>
      <QrCode :shareLink="shareLink" />
    </div>
    <!-- 有导航时提示 -->
    <!-- <div class="map-navigate-bar-info" v-else> -->
    <div
      class="map-navigate-bar-info"
      v-if="areaInfo && areaInfo.code !='carport' && areaInfo.code != 'plate'"
    >
      <div class="map-navigate-end-info">
        <div
          id="closeBtn"
          @click="closeInfo"
          v-if="areaInfo && areaInfo.code != 'carport'"
        >
          <!-- <i class="el-icon-circle-plus-outline"></i> -->
          <img src="../../assets/images/close.png" alt="" />
        </div>
        <!-- 上部信息以及图片 -->
        <div class="map-navigate-end-info-show">
          <span
            class="map-navigate-end-image-preview"
            v-if="!endPointData.image.includes('undefined')"
          ></span>
          <ImagePreview
            class="map-navigate-end-image"
            :src="endPointData.image"
            :preview-src-list="[endPointData.image]"
            fit="cover"
          >
            <div slot="error" class="image-slot-item-brand"></div>
          </ImagePreview>
          <div class="map-navigate-end-data">
            <el-image :src="endPointData.logo">
              <div slot="error" class="image-slot"></div>
            </el-image>
            <div class="map-navigate-end-label">
              <p>{{ endPointData.shopName }}</p>
              <p class="ShopNo">
                <span></span><label>{{ endPointData.shopNo }}</label>
              </p>
            </div>
          </div>
        </div>
        <!-- 描述 -->
        <swiper
          :class="[
            'map-navigate-end-discription',
            {
              'map-navigate-end-discription-empty':
                endPointData.discription === '暂无数据',
            },
          ]"
          :options="swiperOption"
        >
          <swiper-slide style="height: auto">
            {{ endPointData.discription }}
          </swiper-slide>
          <div class="swiper-scrollbar" slot="scrollbar"></div>
        </swiper>
      </div>
      <!-- 二维码显示 -->
      <div class="map-navigate-info">
        <div class="face2ScreenLogo">
          <span></span>
          面向屏幕
        </div>
        <div class="map-navigate-details-list">
          <swiper
            ref="swiperRef"
            class="map-navigate-details"
            :options="swiperOption"
          >
            <swiper-slide class="map-navigate-details-list-container">
              <Steps direction="vertical" :active="activeRouteIndex">
                <Step
                  :title="path"
                  v-for="(path, index) in pathInfoList"
                  :key="index"
                  :class="[
                    {
                      'step-current': index === activeRouteIndex - 1,
                    },
                  ]"
                ></Step>
              </Steps>
            </swiper-slide>
            <div class="swiper-scrollbar" slot="scrollbar"></div>
          </swiper>
        </div>
        <QrCode :shareLink="shareLink" />
      </div>
    </div>
  </div>
</template>

<script>
import QrCode from "./qrCode";
import { mapState } from "vuex";
import { Step, Steps, Image } from "element-ui";
import ImagePreview from "@/extends/imagePreview/imagePreview";
export default {
  props: {
    areaInfo: Object,
    pathData: Object,
    navigateWalkData: String,
    isFacitityNavigate: Boolean,
  },
  data() {
    return {
      endPointData: {},
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true,
        },
        mousewheel: true,
        roundLengths: true, //防止文字模糊
      },
      pathInfoList: [],
      shareLink: "",
      activeRouteIndex: 1,
    };
  },
  computed: {
    ...mapState("home", {
      shopInfo: (state) => state.shopInfo,
    }),
  },
  watch: {
    areaInfo: {
      handler: function () {
        if (!this.areaInfo) return;
        const info = this.shopInfo.find(
          (shop) => shop.PointID == this.areaInfo.nodeId
        );
        const endPointData = info || this.areaInfo;
        // console.log("endPointData.image=", endPointData.image);
        let temp_image = String(endPointData.image);
        if(!window.lineState)//只有离线模式 才需要使用离线文件夹路径
        {
          if (temp_image.indexOf("static/OfflineData/map/") == -1) {
              temp_image = `${MAP_CONFIG.BASE_URL}map/${endPointData.image}`;
            }
        }
      
        if (temp_image === "static/OfflineData/map/") {
          temp_image = "undefined";
        }
        this.endPointData = {
          shopName:
            endPointData.shopName ||
            endPointData.Name ||
            endPointData.areaTypeName ||
            "暂无数据",
          shopNo:
            endPointData.name ||
            endPointData.AreaName ||
            mapConfig.allFloorName.get(endPointData.floorID) ||
            "暂无数据",
          phone: endPointData.contactNumber || "暂无数据",
          discription: endPointData.Introduction || "暂无数据",
          logo: `${MAP_CONFIG.BASE_URL}map/${
            endPointData.Logo || endPointData.logo
          }`,
          image: `${temp_image}`,
        };
        // console.log("this.endPointData=", this.endPointData);
      },
      immediate: true,
      deep: true,
    },
    pathData: {
      handler: function (newPath) {
        this.pathInfoList = ["从您的位置出发"];
        // const direction = newPath
        //   ? newPath[0].deviceFace.turn == "backward"
        //     ? "向后走"
        //     : "向前走"
        //   : "";
        var temp = []; //一个临时数组用来存储不重复的店铺
        if (newPath) {
          // console.log("newPath=",newPath);
          for (const key in newPath) {
            const path = newPath[key];
            path.routeDscription.forEach((route, index) => {
              let pathDis = "";
              const trans = this.transform(route.turn.toLowerCase());
              if (route.nearPoi) {
                // console.log("route.nearPoi=", JSON.stringify(route.nearPoi));
                if (temp.indexOf(route.nearPoi.PointID) == -1) {
                  //去除重复店铺名称
                  // if (route.nearPoi ) {
                  let model = map.getModelByID(route.nearPoi.PointID);
                  if (model && model.data) {
                    if (route.turn.toLowerCase() == "end") {
                      pathDis = `到达${
                        model.data.shopName || model.data.areaTypeName
                      }`;
                    }
                    else if(route.turn.toLowerCase() == "escalator" || route.turn.toLowerCase() == "lifts") 
                    {
                      pathDis = `乘坐${ model.data.areaTypeName}`;
                    }
                    else 
                    {
                      pathDis =
                        index == 0
                          ? `经过${
                              model.data.shopName || model.data.areaTypeName
                            }`
                          : `经过${
                              model.data.shopName || model.data.areaTypeName
                            }`;
                    }
                  }
                  temp.push(route.nearPoi.PointID);
                  // }
                  // else
                  // {
                  //   pathDis =
                  //     index == 0
                  //       ? `${direction}${~~route.distance + 1}米`
                  //       : `${trans}${~~route.distance + 1}米`;
                  // }
                  this.pathInfoList.push(pathDis);
                  //  console.log("this.pathInfoList0000=",this.pathInfoList);
                  //判断是直梯或者手扶梯 就闪烁图标
                  if (
                    route.nearPoi.Code == "escalator" ||
                    route.nearPoi.Code == "lifts"
                  ) {
                    map.flickerTypeIcon(
                      route.nearPoi.PointID,
                      route.nearPoi.FloorID,
                      true
                    );
                  }
                }
              }
            });
          }
        }
         if (this.pathInfoList) {
              let path_info = this.pathInfoList[this.pathInfoList.length - 1];
              if (path_info) {
                if(path_info.indexOf(this.endPointData.shopName) != -1)
                {
                  this.pathInfoList[this.pathInfoList.length - 1] = path_info.replace("经过", "到达");
                }
                else
                {
                  this.pathInfoList[this.pathInfoList.length - 1] = "到达"+this.endPointData.shopName;
                }
              }
            }
          // console.log("this.pathInfoList11111111111=",this.pathInfoList);
        this.getQrCodeUrl();
      },
      immediate: true,
    },
    navigateWalkData: {
      handler: function (newData) {
        if (!newData) return;
        // 路书自动切换
        const textTipCount = ~~newData.split("-")[0];
        const pathFloorIndex = ~~newData.split("-")[1];
        let lastFloorStep = 0;
        if (pathFloorIndex > 0) {
          Array.from({ length: pathFloorIndex }, () => 1).forEach(
            (item, index) => {
              if (index !== pathFloorIndex) {
                lastFloorStep += this.pathData[index].routeDscription.length;
              }
            }
          );
        }
        this.activeRouteIndex = textTipCount + lastFloorStep + 1;
        let route = this.pathData[0];
        if (route && route.routeDscription) {
          let rd = route.routeDscription[this.activeRouteIndex - 1];
          if (rd && rd.nearPoi && rd.nearPoi.Code == "shop") {
            let model = map.getModelByID(rd.nearPoi.PointID);
            if (model && model.data) {
              if (rd.turn.toLowerCase() != "end") {
                model.setColor(MAP_CONFIG.PASS_NODE_COLOR); //设置经过颜色
              }
            }
          }
        }
        // 自动滚动
        if (document.querySelector(".el-step")) {
          const stepHeight = window.getComputedStyle(
            document.querySelector(".el-step")
          ).height;
          this.$refs.swiperRef?.$swiper.translateTo(
            -(parseInt(stepHeight, 10) * (this.activeRouteIndex - 1)),
            300,
            true,
            false
          );
        }
      },
    },
  },
  methods: {
    transform(turn) {
      let title = "";
      if (turn === "right") {
        title = "向右转";
      } else if (turn === "left") {
        title = "向左走";
      } else if (turn === "straight") {
        title = "向前走";
      } else if (turn === "leftfront") {
        title = "向左前方前进";
      } else if (turn === "rightfront") {
        title = "向右前方前进";
      } else if (turn === "lifts" || turn === "escalator" || turn === "stair") {
        if (turn === "lifts") {
          title = "乘直梯";
        } else if (turn === "escalator") {
          title = "乘扶梯";
        } else if (turn === "stair") {
          title = "走楼梯";
        }
      } else if (turn === "end") {
        title = "到达终点";
      }
      return title;
    },
    getQrCodeUrl() {
      if (this.pathData === null) {
        this.shareLink = `${MAP_CONFIG.MOBILE_MAP_SERVER}?pid=${MAP_CONFIG.PID}&flag=lineId&server=${MAP_CONFIG.MOBILE_SERVER}map/`;
      } else {
        this.shareLink = `${MAP_CONFIG.MOBILE_MAP_SERVER}?pid=${MAP_CONFIG.PID}&flag=lineId&server=${MAP_CONFIG.MOBILE_SERVER}map/&s1=${window.map?.startPID}&s2=您的位置&e1=${window.map?.endPID}&e2=${this.endPointData?.shopName}`;
      }
    },
    closeInfo() {
      this.$EventBus.$emit("resetMap");
    },
  },
  components: {
    Step,
    Steps,
    QrCode,
    ImagePreview,
    [Image.name]: Image,
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .map-navigate-bar {
    position: absolute;
    width: 727px;
    height: 1580px;
    top: 53px;
    left: 48px;
    display: flex;
    box-sizing: border-box;
    z-index: 2001;
    .map_parking_navigate_bar_info {
      position: absolute;
      top: 335px;
      background: rgba(255, 255, 255, 0.9);
      // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 20px;
      width: 695px;
      height: 714px;
      padding: 70px;
      display: flex;
      flex-flow: column;
      .parking_number {
        margin-top: 200px;
        height: 55px;
        font-size: 42px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 35px;
        color: #e66579;
        text-align: center;
      }
      .map-navigate-bar-tip-qrcode {
        height: 230px;
        margin-top: -100px;
      }
      .closeBtn {
        position: absolute;
        top: -42px;
        right: -42px; //50%;
        width: 84px;
        height: 84px;
        z-index: 2;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .map_plate_navigate_bar_info {
      width: 100%;
      height: 100%;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .plate_car_image {
        width: 746px;
        height: 418px;
        margin-right: 105px;
        margin-top: -40px;
      }
      .plate_text_group {
        width: 390px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .plate_number {
          width: 390px;
          height: 55px;
          font-size: 42px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 35px;
          color: #e66579;
          text-align: left;
          margin-bottom: 20px;
        }
        .plate_text {
          width: 390px;
          height: 37px;
          font-size: 28px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 26px;
          color: #000000;
          text-align: left;
          margin-bottom: 10px;
        }
      }
    }
    .map-navigate-bar-tip {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
      background: #ffffff;
      border-radius: 50px;
    }
    .map-navigate-bar-info {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
      background: #ffffff;
      // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 20px;
      .map-navigate-end-info {
        width: 690px;
        height: 818px;
        border-bottom: 1px dashed #d4d4d4;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 43px auto 10px;
        .map-navigate-end-info-show {
          width: 100%;
          height: 599px;
          .map-navigate-end-image-preview {
            position: absolute;
            width: 30px;
            height: 30px;
            background: url("../../assets/images/home/imae_preview.png")
              no-repeat center;
            background-size: contain;
            border-radius: 4px;
            top: 522px;
            right: 27px;
            z-index: 2;
            background-color: rgba(255, 255, 255, 0.5);
          }
          .map-navigate-end-image {
            width: 690px;
            height: 519px;
          }
          .map-navigate-end-data {
            position: absolute;
            width: 655px;
            height: 161px;
            top: 481px;
            left: 52px;
            display: flex;
            .el-image {
              width: 161px;
              height: 161px;
              background: #ffffff;
              box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.18);
              // display: flex;
              justify-content: center;
              align-items: center;
              border: none;
            }

            .map-navigate-end-label {
              position: absolute;
              left: 188px;
              top: 97px;
              width: 467px;
              height: 66px;
              display: flex;
              p {
                height: 37px;
                font-size: 28px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #000000;
                max-width: 320px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .ShopNo {
                margin-left: 34px;
                display: flex;
                align-items: center;
                span {
                  width: 22px;
                  height: 26px;
                  background: url("../../assets/images/home/toolList/hot_search_locate.png")
                    no-repeat center;
                  background-size: cover;
                  margin-right: 4px;
                  margin-top: 5px;
                }
                label {
                  font-weight: 400;
                  color: #3f3a39;
                  font-size: 25px;
                  font-family: Microsoft YaHei;
                  line-height: 33px;
                  max-width: 300px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin-top: 6px;
                }
              }
            }
          }
        }
        .map-navigate-end-discription {
          margin-top: 29px;
          width: 661px; //681px
          height: 171px;
          font-size: 24px;
          font-weight: 400;
          line-height: 44px;
          color: #000000;
          .swiper-wrapper {
            margin: 0;
            width: 96%;
          }
          .swiper-scrollbar {
            top: 4% !important;
          }
          &.map-navigate-end-discription-empty {
            line-height: 175px;
            text-align: center;
          }
        }
      }
      .map-navigate-info {
        position: relative;
        width: 100%;
        height: 720px;
        .face2ScreenLogo {
          position: absolute;
          left: 100px;
          width: 225px;
          height: 386px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 400;
          color: #000000;
          span {
            width: 116px;
            height: 211px;
            background: url("../../assets/images/home/toolList/face2screen.png")
              no-repeat center;
            background-size: cover;
            margin-bottom: 10px;
          }
        }
        .map-navigate-details-list {
          position: absolute;
          left: 328px;
          width: 340px;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          .map-navigate-details {
            width: 100%;
            height: 400px;
            .map-navigate-details-list-container {
              margin-left: 20px;
              margin-top: 10px;
              width: auto;
              height: auto;
              .el-step {
                flex-basis: 75px !important;
                .el-step__head {
                  width: 35px;
                  .el-step__line {
                    left: 15px;
                    height: 100%;
                    background-color: transparent;
                    &::after {
                      position: absolute;
                      left: 1px;
                      top: 0;
                      content: "";
                      width: 0;
                      height: 75px;
                      border-left: 1px dashed #d5d5d5;
                      z-index: -2;
                    }
                  }
                  .el-step__icon {
                    width: 34px;
                    height: 34px;
                    font-weight: 400;
                    line-height: 35px;
                    background: #d5d5d5;
                    font-size: 20px;
                    font-weight: 400;
                    color: #ffffff;
                    border-radius: 50%;
                    // transform: translateX(0px);
                    border: none;
                  }
                  &.is-finish {
                    color: #000000;
                    border-color: #e66579;
                    .el-step__icon {
                      width: 34px;
                      height: 34px;
                      font-weight: 400;
                      line-height: 35px;
                      background: linear-gradient(
                        180deg,
                        #eaba87 0%,
                        #e65277 100%
                      );
                      font-size: 20px;
                      font-weight: 400;
                      color: #ffffff;
                      border-radius: 50%;
                      // transform: translateX(0px);
                      border: none;
                    }
                  }
                }
                .el-step__main {
                  padding-left: 13px;
                  .el-step__title {
                    width: 200px;
                    line-height: 28px;
                    margin-top: 5px;
                    font-size: 20px;
                    font-weight: 400;
                    color: #9a9aa2;
                    &.is-finish {
                      color: #000000;
                    }
                  }
                }
                &:first-child {
                  .el-step__icon {
                    position: relative;
                    &::before {
                      content: "起";
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      font-size: 20px;
                      font-weight: 400;
                      color: #ffffff;
                    }
                    .el-step__icon-inner {
                      display: none;
                    }
                  }
                }
                &:last-child {
                  .el-step__icon {
                    position: relative;
                    &::before {
                      content: "终";
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      font-size: 20px;
                      font-weight: 400;
                      color: #ffffff;
                    }
                    .el-step__icon-inner {
                      display: none;
                    }
                  }
                }
              }
              .step-current {
                &::before {
                  content: "";
                  position: absolute;
                  width: 283px;
                  height: 39px;
                  left: -15px;
                  top: -2.5px;
                  // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
                   background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
                  border-radius: 20px;
                  z-index: -1;
                }

                .el-step__icon-inner {
                  display: none;
                }
                .el-step__title {
                  color: #ffffff !important;
                  margin-top: 2.5px !important;
                }
                .el-step__icon {
                  position: relative;
                  background: rgba(255, 255, 255, 0.3) !important;

                  &::before {
                    content: "" !important;
                    position: absolute !important;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    width: 25px !important;
                    height: 25px !important;
                    border-radius: 50% !important;
                    background: rgba(255, 255, 255, 0.9) !important;
                  }

                  &::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 11px !important;
                    height: 11px !important;
                    background: #ffffff;
                    border-radius: 50%;
                  }
                }
              }
            }

            .swiper-scrollbar {
              top: 10px !important;
              right: 15px;
            }
          }
        }
        .map-navigate-bar-tip-qrcode {
          position: absolute;
          top: 410px;
          border-top: 1px dashed #d4d4d4;
          width: 100%;
          height: 326px;
        }
      }
    }
    #closeBtn {
      position: absolute;
      top: -42px;
      right: -42px; //50%;
      width: 84px;
      height: 84px;
      z-index: 2;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  .map-navigate-bar {
    position: absolute;
    width: 1586px;
    height: 458px;
    top: 253px; //593px;
    right: 88px; //200px;
    display: flex;
    box-sizing: border-box;
    z-index: 2001;
    .map_parking_navigate_bar_info {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 20px;
      padding: 70px;
      display: flex;
      flex-flow: column;
      .parking_number {
        height: 55px;
        font-size: 42px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 35px;
        color: #e66579;
        text-align: center;
      }
      .map-navigate-bar-tip-qrcode {
        height: 230px;
        margin-top: -100px;
      }
      .closeBtn {
        position: absolute;
        top: -42px;
        right: -42px; //50%;
        width: 84px;
        height: 84px;
        z-index: 2;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .map_plate_navigate_bar_info {
      width: 100%;
      height: 100%;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border-radius: 20px;
      // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      .plate_car_image {
        width: 746px;
        height: 418px;
        margin-right: 105px;
        margin-top: -40px;
      }
      .plate_text_group {
        width: 390px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .plate_number {
          width: 390px;
          height: 55px;
          font-size: 42px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 35px;
          color: #e66579;
          text-align: left;
          margin-bottom: 20px;
        }
        .plate_text {
          width: 390px;
          height: 37px;
          font-size: 28px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 26px;
          color: #000000;
          text-align: left;
          margin-bottom: 10px;
        }
      }
    }
    .map-navigate-bar-tip {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
      background: #ffffff;
      border-radius: 20px;
      // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);

      //   .map-navigate-bar-tip-image {
      //     width: 1350px;
      //     height: 100%;
      //     border-right: 1px dashed #ddbd77;
      //     display: flex;
      //     flex-direction: column;
      //     align-items: center;
      //     span {
      //       width: 245px;
      //       height: 190px;
      //       margin-top: 120px;
      //       margin-bottom: 15px;
      //       background: url("../../assets/images/details/navigateTip.png") no-repeat
      //         center;
      //       background-size: cover;
      //     }
      //     p {
      //       margin: 0;
      //       font-size: 38px;
      //       font-weight: 400;
      //       line-height: 48px;
      //       color: #42210b;
      //     }
      //   }
    }

    .map-navigate-bar-info {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 2;
      background: #ffffff;
      border-radius: 20px;
      // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      .map-navigate-end-info {
        width: 700px;
        height: 424px;
        border-right: 1px dashed #d4d4d4;
        display: flex;
        flex-direction: column;
        align-items: center;

        .map-navigate-end-info-show {
          margin-top: 0px;
          width: 100%;
          height: 205px;
          display: flex;

          .map-navigate-end-image-preview {
            position: absolute;
            width: 30px;
            height: 30px;
            background: url("../../assets/images/home/imae_preview.png")
              no-repeat center;
            background-size: contain;
            border-radius: 4px;
            top: 207px;
            left: 285px;
            z-index: 2;
            background-color: rgba(255, 255, 255, 0.5);
          }

          .map-navigate-end-image {
            width: 307px;
            height: 230px;
            margin-left: 18px;
          }

          .map-navigate-end-data {
            height: 232px;
            margin-left: 22px;
            .el-image {
              width: 113px;
              height: 113px;
              // justify-content: center;
              // align-items: center;
              box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.18);
              border: none;
            }
            .map-navigate-end-label {
              margin-top: 20px;
              flex: 1;
              p {
                margin-top: 8px;
                height: 37px;
                font-size: 28px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #000000;
                max-width: 320px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .ShopNo {
                display: flex;
                align-items: center;
                span {
                  width: 22px;
                  height: 26px;
                  background: url("../../assets/images/home/toolList/hot_search_locate.png")
                    no-repeat center;
                  background-size: cover;
                  margin-right: 4px;
                }
                label {
                  font-weight: 400;
                  color: #3f3a39;
                  font-size: 25px;
                  font-family: Microsoft YaHei;
                  line-height: 33px;
                  max-width: 300px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
              // p {
              //   margin-top: 8px;
              //   &:nth-child(1) {
              //     font-size: 28px;
              //     font-weight: bold;
              //     color: #000000;
              //     max-width: 320px;
              //     white-space: nowrap;
              //     overflow: hidden;
              //     text-overflow: ellipsis;
              //   }
              //   &:nth-child(2) {
              //     color: #000000;
              //     max-width: 320px;
              //     font-size: 25px;
              //     font-weight: 400;
              //   }
              // }
            }
          }
        }

        .map-navigate-end-discription {
          margin-top: 29px;
          width: 90%; //681px
          height: 170px;
          font-size: 24px;
          font-weight: 400;
          line-height: 44px;
          color: #000000;

          .swiper-wrapper {
            margin: 0;
            width: 96%;
          }

          .swiper-scrollbar {
            top: 4% !important;
          }

          &.map-navigate-end-discription-empty {
            line-height: 175px;
            text-align: center;
          }
        }
      }

      .map-navigate-info {
        position: relative;
        width: 100%;
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        .face2ScreenLogo {
          height: 100%;
          width: 225px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 400;
          color: #000000;
          span {
            width: 116px;
            height: 211px;
            background: url("../../assets/images/home/toolList/face2screen.png")
              no-repeat center;
            background-size: cover;
            margin-bottom: 18px;
          }
        }
        .map-navigate-details-list {
          margin: 0;
          width: 340px;
          height: 424px; //100%;
          border-right: 1px dashed #d4d4d4;
          display: flex;
          align-items: center;
          justify-content: center;

          .map-navigate-details {
            width: 100%;
            height: 400px;
            .map-navigate-details-list-container {
              margin-left: 20px;
              margin-top: 10px;
              width: auto;
              height: auto;
              .el-step {
                flex-basis: 75px !important;
                .el-step__head {
                  width: 35px;
                  .el-step__line {
                    left: 15px;
                    height: 100%;
                    background-color: transparent;
                    &::after {
                      position: absolute;
                      left: 1px;
                      top: 0;
                      content: "";
                      width: 0;
                      height: 75px;
                      border-left: 1px dashed #000000;
                      z-index: -2;
                    }
                  }
                  .el-step__icon {
                    width: 34px;
                    height: 34px;
                    font-weight: 400;
                    line-height: 35px;
                    background: #d5d5d5;
                    font-size: 20px;
                    font-weight: 400;
                    color: #ffffff;
                    border-radius: 50%;
                    // transform: translateX(0px);
                    border: none;
                  }
                  &.is-finish {
                    color: #000000;
                    border-color: #e66579;
                    .el-step__icon {
                      width: 34px;
                      height: 34px;
                      font-weight: 400;
                      line-height: 35px;
                      background: linear-gradient(
                        180deg,
                        #eaba87 0%,
                        #e65277 100%
                      );
                      font-size: 20px;
                      font-weight: 400;
                      color: #ffffff;
                      border-radius: 50%;
                      // transform: translateX(0px);
                      border: none;
                    }
                  }
                }
                .el-step__main {
                  padding-left: 13px;
                  .el-step__title {
                    width: 200px;
                    line-height: 28px;
                    margin-top: 5px;
                    font-size: 20px;
                    font-weight: 400;
                    color: #9a9aa2;
                    &.is-finish {
                      color: #000000;
                    }
                  }
                }
                &:first-child {
                  .el-step__icon {
                    position: relative;
                    &::before {
                      content: "起";
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      font-size: 20px;
                      font-weight: 400;
                      color: #ffffff;
                    }
                    .el-step__icon-inner {
                      display: none;
                    }
                  }
                }
                &:last-child {
                  .el-step__icon {
                    position: relative;
                    &::before {
                      content: "终";
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      font-size: 20px;
                      font-weight: 400;
                      color: #ffffff;
                    }
                    .el-step__icon-inner {
                      display: none;
                    }
                  }
                }
              }
              .step-current {
                &::before {
                  content: "";
                  position: absolute;
                  width: 283px;
                  height: 39px;
                  left: -15px;
                  top: -2.5px;
                  // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
                   background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
                  // box-shadow: 0px 0px 6px#e2c478;
                  border-radius: 20px;
                  z-index: -1;
                }

                .el-step__icon-inner {
                  display: none;
                }
                .el-step__title {
                  color: #ffffff !important;
                  margin-top: 2.5px !important;
                }
                .el-step__icon {
                  position: relative;
                  background: rgba(255, 255, 255, 0.3) !important;

                  &::before {
                    content: "" !important;
                    position: absolute !important;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    width: 25px !important;
                    height: 25px !important;
                    border-radius: 50% !important;
                    background: rgba(255, 255, 255, 0.9) !important;
                  }

                  &::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 11px !important;
                    height: 11px !important;
                    background: #ffffff;
                    border-radius: 50%;
                  }
                }
              }
            }

            .swiper-scrollbar {
              top: 10px !important;
              right: 15px;
            }
          }
        }

        .map-navigate-bar-tip-qrcode {
          height: 100%;
        }
      }
    }
    #closeBtn {
      position: absolute;
      top: -42px;
      right: -42px; //50%;
      width: 84px;
      height: 84px;
      z-index: 2;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>