<template>
  <div class="vipLogoinContainer">
    <!-- <div class="TitleIcon animated fadeIn ">
      <img src="../../assets/images/vip/titleIcon.png" alt="" class="animated " :class="{rubberBand:hasAnimated}" />
    </div> -->
    <div class="loginBG">
      <div class="loginRedBG"></div>
      <div class="loginWhiteBG">
        <div class="vipLogoin">
          <div class="title">登入会员</div>
          <div class="qrcodeContainer">
            <div class="qrcodeImg">
              <img
                src="../../assets/images/vip/vipQrcode.jpg"
                class="qrcode"
                alt=""
              />
            </div>
            <div class="text"><span></span>手机扫码登录会员</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      hasAnimated: false,
      animatedInterval: {}
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.animatedInterval = setInterval(() => {
      this.hasAnimated = !this.hasAnimated;
    }, 2000);
  },
  watch: {},
  methods: {},
  beforeDestroy() {
    clearInterval(this.animatedInterval);
  },
  components: {}
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px){
.vipLogoinContainer {
  position: absolute;
  width: 938px;
  height: 736px;
  top: 475px;
  left: 50%;
  transform: translateX(-50%);
  .loginBG {
    width: 100%;
    height: 100%;
    .loginRedBG {
      width: 912px;
      height: 706px;
      background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
      box-shadow: 0px 60px 50px #f3c7c4;
      // background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
      // box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      opacity: 0.5;
      border-radius: 30px;
      margin-left: 26px;
    }
    .loginWhiteBG {
      width: 912px;
      height: 706px;
      background: #ffffff;
      border: 2px solid #e66579;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      margin-top: -736px;

      .vipLogoin {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // background: url("../../assets/images/vip/logoinBg.png") no-repeat center
        //   center;
        // background-size: 100% 100%;
        // background: #f8f1e7;
        // border: 1px solid #d5c9bd;
        // border-radius: 60px;

        .title {
          // color: #3f3a39;
          // text-align: center;
          // font-size: 36px;
          // font-weight: bold;
          // margin: 0 auto;
          // margin-top: 168px;
          width: 194px;
          height: 55px;
          font-size: 42px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 33px;
          color: #e66579;
        }
        .qrcodeContainer {
          margin: 85px auto;
          height: 300px;
          .qrcodeImg {
            width: 219px;
            height: 219px;
            margin: 20px auto;
            // margin-bottom: 13px;
            // background: url("../../assets/images/active/qrcodeBg.png") center center
            //   no-repeat;
            // background-size: 100% 100%;
            // border: 5px solid #e6d1b1;
            // border-radius: 5px;
            position: relative;
            .qrcode {
              width: 219px;
              height: 219px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .text {
            // color: #7f7673;
            // text-align: center;
            // font-size: 24px;
            // font-weight: regular;

            margin: 40px auto;
            width: 270px;
            height: 39px;
            font-size: 29px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 39px;
            color: #000000;
            display: flex;
            align-items: center;
            span {
              width: 22px;
              height: 30px;
              background: url("../../assets/images/vip/phone_code_icon.png")
                no-repeat center;
              background-size: cover;
              margin-right: 15px;
            }
          }
        }
      }
    }
  }
}
}
@media screen and (max-width: 2160px){
.vipLogoinContainer {
  position: absolute;
  width: 938px;
  height: 736px;
  top: 1058px;
  left: 50%;
  transform: translateX(-50%);

  // .TitleIcon {
  //   height: 253px;
  //   position: absolute;
  //   top: 1276px;
  //   width: 100%;
  //   text-align: center;
  //   img {
  //     height: 100%;
  //   }
  // }
  .loginBG {
    width: 100%;
    height: 100%;
    .loginRedBG {
      width: 912px;
      height: 706px;
      background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
      box-shadow: 0px 60px 50px #f3c7c4;
      // background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
      // box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      opacity: 0.5;
      border-radius: 30px;
      margin-left: 26px;
    }
    .loginWhiteBG {
      width: 912px;
      height: 706px;
      background: #ffffff;
      border: 2px solid #e66579;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      margin-top: -736px;

      .vipLogoin {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // background: url("../../assets/images/vip/logoinBg.png") no-repeat center
        //   center;
        // background-size: 100% 100%;
        // background: #f8f1e7;
        // border: 1px solid #d5c9bd;
        // border-radius: 60px;

        .title {
          // color: #3f3a39;
          // text-align: center;
          // font-size: 36px;
          // font-weight: bold;
          // margin: 0 auto;
          // margin-top: 168px;
          width: 194px;
          height: 55px;
          font-size: 42px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 33px;
          color: #e66579;
        }
        .qrcodeContainer {
          margin: 85px auto;
          height: 300px;
          .qrcodeImg {
            width: 219px;
            height: 219px;
            margin: 20px auto;
            // margin-bottom: 13px;
            // background: url("../../assets/images/active/qrcodeBg.png") center center
            //   no-repeat;
            // background-size: 100% 100%;
            // border: 5px solid #e6d1b1;
            // border-radius: 5px;
            position: relative;
            .qrcode {
              width: 219px;
              height: 219px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .text {
            // color: #7f7673;
            // text-align: center;
            // font-size: 24px;
            // font-weight: regular;

            margin: 40px auto;
            width: 270px;
            height: 39px;
            font-size: 29px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 39px;
            color: #000000;
            display: flex;
            align-items: center;
            span {
              width: 22px;
              height: 30px;
              background: url("../../assets/images/vip/phone_code_icon.png")
                no-repeat center;
              background-size: cover;
              margin-right: 15px;
            }
          }
        }
      }
    }
  }
}
}

</style>
