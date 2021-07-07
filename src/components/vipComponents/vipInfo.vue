<template>
  <div class="vipInfo" @click="close">
    <div class="cardInfoBox">
      <div class="name animated fadeIn" v-html="cardInfo.name"></div>
      <div
        :style="{ backgroundImage: `url(${cardInfo.icon})` }"
        class="rightsIcon animated fadeIn"
      ></div>
      <div class="introduct animated fadeIn">{{ cardInfo.introduct }}</div>
    </div>
    <div class="closeBtn" @click="close">
      <i class="el-icon-circle-plus-outline"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardInfo: Object
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    close() {
      this.$emit("closeCardInfo", "");
    }
  },
  components: {}
};
</script>

<style lang='less'>
.vipInfo {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3001;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .cardInfoBox {
    width: 1006px;
    height: 618px;
    background-color: #ffffff;
    border: 1px solid #707070;
    opacity: 1;
    border-radius: 30px;
    // position: absolute;
    // top:50%;// 1521px;
    // left:50%;// 577px;
    // transform: translate(-50%,-50%);
    .rightsIcon {
      width: 125px;
      height: 125px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      margin: 66px auto;
    }
    .name {
      text-align: center;
      font-size: 36px;
      font-weight: bold;
      color: #e66579;
      margin-top: 73px;
    }
    .introduct {
      margin: 70px auto;
      width: 772px;
      font-size: 22px;
      font-weight: 400;
      line-height: 40px;
      color: #3f3a39;
      text-align: center;
    }
  }
  .closeBtn {
    position: relative;
    top: 100px;
    width: 100px;
    height: 100px;
    // cursor: pointer;
    .el-icon-circle-plus-outline {
      color: #fff;
      font-size: 100px;
      transform: rotateZ(45deg);
    }
  }
}
</style>
