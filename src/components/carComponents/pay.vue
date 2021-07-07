<template>
  <div class="payContainer">
    <div class="payBG">
      <div class="payRedBG"></div>
      <div class="payWhiteBG">
        <div class="vipLogoin">
          <div class="title">扫码缴费</div>
          <div class="qrcodeContainer">
            <div class="qrcodeImg">
              <img
                src="../../assets/images/car/car_pay.jpg"
                class="qrcode"
                alt=""
              />
            </div>
            <div class="text"><span></span>手机扫码进行缴费</div>
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
      introductionText: ["首30分钟内免费。 第一小时内5元。"],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {},
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .payContainer {
    position: absolute;
    width: 938px;
    height: 736px;
    top: 475px;
    left: 1254px;
    .payBG {
      width: 100%;
      height: 100%;
      .payRedBG {
        width: 912px;
        height: 706px;
        // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
        // box-shadow: 0px 60px 50px #f3c7c4;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        opacity: 0.5;
        border-radius: 30px;
        margin-left: 26px;
      }
      .payWhiteBG {
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
          .title {
            width: 100%;
            height: 55px;
            font-size: 42px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            line-height: 33px;
            color: #e66579;
            text-align: center;
          }
          .qrcodeContainer {
            margin: 85px auto;
            height: 300px;
            .qrcodeImg {
              width: 219px;
              height: 219px;
              margin: 20px auto;
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
@media screen and (max-width: 2160px) {
  .payContainer {
    // width: 1281px;
    // height: 1050px;
    // position: absolute;
    // top: 0;
    // left: 0;
    position: absolute;
    width: 938px;
    height: 736px;
    top: 1058px;
    left: 50%;
    transform: translateX(-50%);

    .payBG {
      width: 100%;
      height: 100%;
      .payRedBG {
        width: 912px;
        height: 706px;
        // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
        // box-shadow: 0px 60px 50px #f3c7c4;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        opacity: 0.5;
        border-radius: 30px;
        margin-left: 26px;
      }
      .payWhiteBG {
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
          .title {
            width: 100%;
            height: 55px;
            font-size: 42px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            line-height: 33px;
            color: #e66579;
            text-align: center;
          }
          .qrcodeContainer {
            margin: 85px auto;
            height: 300px;
            .qrcodeImg {
              width: 219px;
              height: 219px;
              margin: 20px auto;
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

// .pay {
//   position: absolute;
//   top: 511px;
//   left: 50%;
//   transform: translateX(-50%);
//   width: 1281px;
//   height: 1050px;
//   background: #f8f1e7;
//   border: 1px solid #d5c9bd;
//   opacity: 1;
//   border-radius: 60px;
//   .title {
//     color: #3f3a39;
//     text-align: center;
//     font-size: 36px;
//     font-weight: bold;
//     margin: 0 auto;
//     margin-top: 87px;
//   }
//   .qrcodeContainer {
//     position: absolute;
//     top: 212px;
//     left: 50%;
//     transform: translateX(-50%);
//     border-radius: 26px;
//     .qrcodeImg {
//       width: 205px;
//       height: 205px;
//       margin: 0 auto;
//       margin-bottom: 13px;
//       border: 5px solid #e6d1b1;
//       border-radius: 5px;
//       position: relative;
//       .qrcode {
//         width: 195px;
//         width: 195px;
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//       }
//     }
//     .text {
//       color: #7f7673;
//       text-align: center;
//       font-size: 24px;
//       font-weight: regular;
//     }
//   }
//   .introduction {
//     width: 100%;
//     height: 500px;
//     background: #ffffff;
//     opacity: 1;
//     border-radius: 60px;
//     position: absolute;
//     bottom: -1px;
//     left: 0;
//     display: flex;
//     .lineImg {
//       width: 1px;
//       height: 500px;
//       position: absolute;
//       top: 0;
//       left: 570px;
//     }

//     .imgContainer {
//       width: 570px;
//       height: 500px;
//       position: relative;
//       text-align: center;
//       img {
//         width: 421px;
//         height: 390px;
//         margin-top: 55px;
//       }
//     }
//     .textContainer {
//       flex: 1;
//       padding-top: 58px;
//       padding-left: 52px;
//       .textItem {
//         display: flex;
//         .indexNum {
//           width: 34px;
//           height: 34px;
//           border-radius: 18px;
//           text-align: center;
//           line-height: 34px;
//           background-color: #e6d1b1;
//           font-weight: 400;
//           color: #000000;
//           font-size: 26px;
//           margin-right: 10px;
//           margin-bottom: 24px;
//         }
//         .textContent{
//           height: 34px;
//           text-align: center;
//           line-height: 34px;
//           font-weight: 400;
//           color: #000000;
//           font-size: 26px;
//         }
//       }
//     }
//   }
// }
</style>
