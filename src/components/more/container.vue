<template>
  <div class="moreContainerBox">
    <div class="container" v-show="checkImgChanged">
      <div
        class="imgContainer animated"
        :class="{ fadeIn: checkImgChanged }"
        :style="{ backgroundImage: `url(${checkImg})` }"
      >
        <div class="metro1" v-show="checkType == 'position'">
          <img
            :class="[currentRoute == 0 ? 'animationEnlarge' : '']"
            src="static/images/more/metroIcon.png"
            alt=""
            :style="{ width: `72px`, height: `79px` }"
          />
        </div>
        <div class="bus1" v-show="checkType == 'position'">
          <img
            :class="[currentRoute == 2 ? 'animationEnlarge' : '']"
            src="static/images/more/bus1Icon.png"
            alt=""
            :style="{ width: `65px`, height: `55px` }"
          />
        </div>
        <div class="bus2" v-show="checkType == 'position'">
          <img
            :class="[currentRoute == 2 ? 'animationEnlarge' : '']"
            src="static/images/more/bus2Icon.png"
            alt=""
            :style="{ width: `65px`, height: `55px` }"
          />
        </div>
      </div>
      <div
        class="textContainer"
        :class="{ surrounding: this.$route.query.menuTwo == 'surrounding' }"
      >
        <div class="checkName animated" :class="{ fadeIn: checkImgChanged }">
          {{ checkName }}
        </div>
        <div class="contentImg">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkImg: String,
    checkName: String,
    checkType: String, //项目介绍:introduction,交通位置:position,周边景点:surrounding,联系我们:contact
  },
  data() {
    return {
      checkImgChanged: false,
      currentRoute: 1, //当前选择的路线 0地铁路线 1打车路线 2公交路线
    };
  },
  computed: {},
  created() {
    let that = this;
    this.$EventBus.$on("currentRoute", (index) => {
      that.currentRoute = index;
    });
  },
  mounted() {},
  watch: {
    checkImg: function (newVal, oldVal) {
      this.checkImgChanged = false;
      let timer = setTimeout(() => {
        this.checkImgChanged = true;
        clearTimeout(timer);
      }, 10);
    },
  },
  methods: {},
  components: {},
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .moreContainerBox {
    width: 100%;
    margin: 0 auto;
    .container {
      width: 3281px;
      height: 1327px;
      background: url("../../assets/images/more/more_bg_h.png") no-repeat center
        center;
      background-size: cover;
      margin: 0 auto 0;
      display: flex;
      overflow: hidden;
      .imgContainer {
        width: 1665px;
        height: 1054px;
        margin-top: 121px;
        margin-left: 40px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        .metro1 {
          position: absolute;
          top: 930px;
          left: 1247px;
        }
        .bus1 {
          position: absolute;
          top: 1030px;
          left: 996px;
        }
        .bus2 {
          position: absolute;
          top: 890px;
          left: 735px;
        }
      }
      .textContainer {
        width: 1565px;
        height: 100%;
        position: relative;
        background: transparent; //#f8f1e7;
        // margin-left: 40px;
        .checkName {
          margin: 125px auto 95px;
          color: #e66579;
          font-size: 42px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 33px;
          letter-spacing: 20px;
          width: 1372px;
          text-align: center;
        }
        .contentImg {
          width: 1565px;
          height: 1084px;//1054px;
          position: absolute;
          box-sizing: border-box;
          padding: 0px;
          overflow: hidden;
          .contentItemBox {
            width: 100%;
            height: calc(100%);
            position: absolute;
            top: 0px;
            left: 0px;
          }
        }
      }
      .surrounding {
        .checkName {
          margin-top: 99px;
        }
        .contentImg {
          top: 229px;
        }
      }
      .animationEnlarge {
        //图片放大动画
        -webkit-animation-name: scaleDraw; /*关键帧名称*/
        -webkit-animation-timing-function: ease-in-out; /*动画的速度曲线*/
        -webkit-animation-iteration-count: infinite; /*动画播放的次数*/
        -webkit-animation-duration: 3s; /*动画所花费的时间*/
      }
      @-webkit-keyframes scaleDraw {
        /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
        0% {
          transform: scale(1); /*开始为原始大小*/
          // opacity: 0.3;
        }
        25% {
          transform: scale(1.5); /*放大1.5倍*/
          // opacity: 1;
        }
        50% {
          transform: scale(1);
          // opacity: 0.3;
        }
        75% {
          transform: scale(1.5);
          // opacity: 1;
        }
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  .moreContainerBox {
    width: 100%; // calc(100% - 230px);
    margin: 0 auto;
    .container {
      width: 1631px;
      height: 2113px;
      // border-radius: 60px;
      // border: 1px solid #d5c9bd;
      background: url("../../assets/images/more/more_bg.png") no-repeat center
        center;
      background-size: cover;
      margin: 0 auto 0; //187px auto 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .imgContainer {
        width: 1521px;
        height: 963px;
        margin: 40px 70px 0px 40px;
        // border-radius: 60px 60px 0px 0px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        .metro1 {
          position: absolute;
          top: 1000px;
          left: 1110px;
        }
        .bus1 {
          position: absolute;
          top: 1097px;
          left: 890px;
        }
        .bus2 {
          position: absolute;
          top: 970px;
          left: 649px;
        }
      }
      .textContainer {
        width: 1631px;
        height: 888px;
        position: relative;
        background: transparent; //#f8f1e7;
        // border-radius: 0px 0px 60px 60px;
        .checkName {
          // text-align: center;
          // color: #E66579;
          // font-size: 36px;
          // font-weight: bold;
          margin: 87px auto 78px;
          color: #e66579;
          font-size: 42px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 33px;
          letter-spacing: 20px;
          width: 380px;
        }
        .contentImg {
          width: 1460px;
          height: 850px;//800px;
          position: absolute;
          // top: 229px;
          left: 50%;
          transform: translateX(-50%);
          box-sizing: border-box;
          padding: 0px;
          padding-bottom: 50px;
          overflow: hidden;
          .contentItemBox {
            width: 100%;
            height: calc(100%);
            position: absolute;
            top: 0px;
            left: 0;
          }
        }
      }
      .surrounding {
        .checkName {
          margin-top: 99px;
        }
        .contentImg {
          top: 229px;
        }
      }
      .animationEnlarge {
        //图片放大动画
        -webkit-animation-name: scaleDraw; /*关键帧名称*/
        -webkit-animation-timing-function: ease-in-out; /*动画的速度曲线*/
        -webkit-animation-iteration-count: infinite; /*动画播放的次数*/
        -webkit-animation-duration: 3s; /*动画所花费的时间*/
      }
      @-webkit-keyframes scaleDraw {
        /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
        0% {
          transform: scale(1); /*开始为原始大小*/
          // opacity: 0.3;
        }
        25% {
          transform: scale(1.5); /*放大1.5倍*/
          // opacity: 1;
        }
        50% {
          transform: scale(1);
          // opacity: 0.3;
        }
        75% {
          transform: scale(1.5);
          // opacity: 1;
        }
      }
    }
  }
}
</style>
