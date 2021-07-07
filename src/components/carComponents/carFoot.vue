<template>
  <div class="carFootContainer">
    <div class="carFoot">
      <div class="title">会员专享</div>
      <div class="footContainer">
        <div class="cardBox">
          <div
            class="carditem"
            v-for="(slide, i) in cardData"
            :key="i"
            :style="{ backgroundImage: `url(${slide.img})` }"
          ></div>
        </div>
        <div class="text">
          <br />
        </div>
        <div class="qrcodeBox">
          <div class="qrcode">
            <img src="../../assets/images/active/1609396453.png" alt="" />
          </div>
          <div class="name">登记会员</div>
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
      cardData: [
        // {
        //   img: require("@/assets/images/car/vip_zm_jk.png"),
        // },
        // {
        //   img: require("@/assets/images/car/vip_zm_zk.png"),
        // },
        // {
        //   img: require("@/assets/images/car/vip_zm_vk.png"),
        // },
        // {
        //   img: require("@/assets/images/car/vip_zm_zk.png"),
        // },
      ],
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
.carFootContainer {
  width: 100%;
  position: absolute;
  top: 1183px;
  left: 0;
  z-index: 0;
}
.carFoot {
  width: 2343px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  .title {
    text-align: left;
    color: #e85400;
    padding-bottom: 17px;
    font-size: 40px;
    font-weight: regular;
    border-bottom: 3px solid #e85400;
  }
  .footContainer {
    display: flex;
    justify-content: center;
    margin-top: 62px;
    .cardBox {
      display: flex;
      justify-content: center;
      .carditem {
        width: 355px;
        height: 219px;
        margin-right: 26px;
      }
    }
    .text {
      width: 363px;
      height: 219px;
      padding-top: 48px;
      box-sizing: border-box;
      color: #e85400;
      margin: 0 160px 0 133px;
      font-size: 34px;
    }
    .qrcodeBox {
      height: 219px;
      .qrcode {
        width: 190px;
        height: 190px;
        text-align: center;
        line-height: 190px;
        background: url("../../assets/images/active/qrcodeBg.png") center center
          no-repeat;
        background-size: 100% 100%;
        img {
          margin-top: 23px;
          width: 151px;
          height: 151px;
        }
      }
      .name {
        text-align: center;
        color: #222321;
        font-size: 23px;
      }
    }
  }
}
</style>
