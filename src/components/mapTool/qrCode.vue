<template>
  <div class="map-navigate-bar-tip-qrcode">
    <!-- <div class="map-navigate-bar-tip-qrcode-tip">
      <span></span>
    </div> -->
    <div class="map-navigate-bar-tip-qrcode-show">
      <qrcode :value="shareLink" :options="qrcodeOption" />
      <p>获取路线至手机</p>
    </div>
  </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
export default {
  props: {
    shareLink: String,
  },
  data() {
    return {
      qrcodeOption: {
        color: {
          dark: "#000",
          light: "#fff",
        },
      },
    };
  },
  components: {
    [VueQrcode.name]: VueQrcode,
  },
};
</script>

<style scoped lang='less'>
.map-navigate-bar-tip-qrcode {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // .map-navigate-bar-tip-qrcode-tip {
  //   // margin-top: 95px;
  //   height: 50px;
  //   font-size: 26px;
  //   font-weight: bold;
  //   line-height: 50px;
  //   color: #000000;
  //   display: flex;
  //   align-items: center;

  //   span {
  //     width: 33px;
  //     height: 53px;
  //     // background: url("../../assets/images/details/qrcode.png") no-repeat center;
  //     background-size: cover;
  //     margin-right: 15px;
  //   }
  // }

  .map-navigate-bar-tip-qrcode-show {
    // margin-top: 45px;
    display: flex;
    flex-direction: column;
    align-items: center;

    canvas {
      // border-radius: 5px;
      width: 160px !important;
      height: 160px !important;
      // border: 5px solid #d5af65;
    }

    p {
      padding: 0;
      margin: 0;
      width: 320px;
      font-size: 24px;
      font-weight: 400;
      line-height: 31px;
      color: #000000;
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>
