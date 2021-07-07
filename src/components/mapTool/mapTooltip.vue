<template>
  <div class="map-top-tip" ref="areaTip" v-show="visible">
    <!-- <div
      :class="[
        'map-top-tip-name',
        {
          'map-top-tip-name-hidden-floor': isFacitityNavigate,
        },
      ]"
    >
      {{ msg }}
    </div>
    <div class="map-top-tip-floor" v-if="!isFacitityNavigate">
      <span></span>
      <span>{{ areaFloor }}</span>
    </div> -->
    <div class="disT">
      全程 <span>{{ (addDis+0).toFixed(0) }}米  约{{timeTo(addDis)}}</span>分钟
    </div>
    <el-image class="logo" :src="logoUrl">
      <div slot="error" class="image-slot"></div>
    </el-image>
    <div class="label">
      <div>
        {{ areaName }}
      </div>
      <div>
        <img src="static/images/shop/hot_search_locate.png" alt="" />{{
          areaFloor
        }}
      </div>
    </div>
  </div>
</template>

<script>
import { Image } from "element-ui";
let timer;
export default {
  props: {
    areaInfo: Object,
    movePos: Object,
    visible: Boolean,
    // toolList: Array,
    addDis: [String, Number],
    isFacitityNavigate: Boolean
  },
  computed: {
    logoUrl() {
      return `${MAP_CONFIG.BASE_URL}map/${this.areaInfo.Logo || this.areaInfo.logo}`
    },
    areaFloor() {
      return this.areaInfo.name || this.areaInfo.AreaName || mapConfig.allFloorName.get(this.areaInfo.floorID) || "暂无数据"
    },
    areaName() {
      return (
        this.areaInfo.shopName ||
        this.areaInfo.areaTypeName ||
        this.areaInfo.Name ||
        "暂无数据"
      );
    },
  },
  mounted() {
    // console.log("this.addDis=",this.addDis);
  },
  data() {
    return {
      msg: ""
    }
  },
  watch: {
    areaInfo: {
      handler: function (info) {
        // console.log("info=",info);
        this.msg = info.shopName ||
          info.areaTypeName ||
          info.Name ||
          "暂无数据";

        timer && clearInterval(timer);
        if (this.msg.length > 22) {
          this.move()
        }
      },
      immediate: true,
      deep: true
    },
    // 根据传入的pos位置坐标移动
    movePos(newPos) {
      if (this.$refs.areaTip) {
        let tipWidth = 400;//parseInt(window.getComputedStyle(document.querySelector(".map-top-tip"))?.width);
        if(document.querySelector(".map-top-tip"))
        {
          if(window.getComputedStyle(document.querySelector(".map-top-tip")))
          {
            tipWidth = parseInt(window.getComputedStyle(document.querySelector(".map-top-tip")).width,10);
          }
        }
        // const tipHeight = parseInt(window.getComputedStyle(document.querySelector(".map-top-tip"))?.height);
        this.$refs.areaTip.style.left = `${newPos.x -
          10 / window.devicePixelRatio - tipWidth*0.5}px`;
        this.$refs.areaTip.style.top = `${newPos.y -
          180 / window.devicePixelRatio }px`;
      }
    }
  },
  methods: {
     timeTo(time) {
      var result = parseInt(time);
      let m =
        Math.ceil((result / 60) % 60) < 10
          ?  Math.ceil((result / 60) % 60)
          : Math.ceil((result / 60) % 60);
      let res = "";
      res += `${m}`;
      return res;
    },
    move() {
      // 箭头函数解决 this 指向问题
      timer = setInterval(() => {
        const start = this.msg.slice(0, 1);
        const end = this.msg.slice(1);
        this.msg = end + start;
      }, 400)
    }
  },
  beforeDestroy() {
    timer && clearInterval(timer);
  },
  components: { [Image.name]: Image },
};
</script>

<style lang='less'>
.map-top-tip {
  position: absolute;
  // padding: 0 25px;
  max-width: 800px;
  min-width: 350px;//225px;
  height: 140px;//105px;
  background: rgba(255,255,255, 0.9);
  box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
  // box-shadow: 0px 6px 12px rgba(232, 84, 0, 0.3);
  // border-radius: 20px;//14px;
  border-radius: 0px 0px 16px 16px;
  display: flex;
  // flex-direction: column;
  align-items: center;
  // justify-content: center;
  .disT {
    width: 100%;
    height: 51px;
    background: #E66579;
    position: absolute;
    top: -51px;
    left: 0;
    border-radius: 16px 16px 0px 0px;
    text-align: center;
    line-height: 51px;
    padding: 0 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 28px;
    box-sizing: border-box;
    font-family: PingFang SC;
    font-weight: 600;
    color: #ffffff;
    span {
      letter-spacing: 5px;
      color: #ffffff;
    }
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-width: 15px;
    border-style: solid;
    border-color: rgba(255,255,255, 0.9) transparent transparent transparent;
  }
  .logo {
    margin-left: 17px;
    width: 115px;
    height: 115px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
  }
  .label {
    div {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 15px;
      &:nth-child(1) {
        font-size: 28px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #000000;
      }
      &:nth-child(2) {
        margin-top: 15px;
        max-width: 170px;
        font-size: 25px;
        font-family: Microsoft YaHei UI;
        font-weight: 400;
        color: #000000;
        // display: flex;
        align-items: center;
        text-overflow: ellipsis;
        img {
          width: 20px;
          height: 25px;
          margin-top: 5px;
          margin-right: 5px;
        }
      }
    }
  }
  // div {
  //   white-space: nowrap;
  //   font-weight: 400;
  //   text-align: center;
  //   &:nth-child(1) {
  //     max-width: 400px;
  //     font-size: 30px;
  //     font-weight: bold;
  //     line-height: 40px;
  //     color: #000000;
  //     overflow: hidden;
  //     white-space: nowrap;
  //   }
  //   &:nth-child(2) {
  //     margin-top: 5px;
  //     font-size: 26px;
  //     font-weight: 400;
  //     color: #000000;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     span {
  //       &:nth-child(1) {
  //         width: 15px;
  //         height: 18px;
  //         margin-top: 2px;
  //         border-radius: 50%;
  //         background: url("../../assets/images/home/toolList/hot_search_locate.png")
  //           no-repeat center;
  //         background-size: contain;
  //       }
  //       &:nth-child(2) {
  //         margin-left: 5px;
  //         white-space: nowrap;
  //       }
  //     }
  //   }
  // }
}
</style>

