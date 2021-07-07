<!-- 屏幕保护倒计时界面-->
<template>
  <div id="screenCountDown" class="animated jackInTheBox" @click="onClick">
    <div id="count_down_img">
      <div class="count_down_label">
        <p>
          {{ countDownTime }} <span class="second_word">{{ second }}</span>
        </p>
        <p class="pReturn">{{ returnToAdv }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      countDownTime: MAP_CONFIG.COUNT_DOWN_TIME,
    };
  },
  computed: {
    //将返回到屏保
    returnToAdv() {
      return "将返回到屏保";
    },
    //秒
    second() {
      return "秒";
    },
  },
  mounted() {},
  methods: {
    updateCountDownTime(time) {
      this.countDownTime = time;
    },
    // 点击按钮
    onClick() {
      screenProtect_VNode.hideCountDown();
    },
  },
  components: {},
};
</script>

<style lang='less'>
#screenCountDown {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  // background-color: rgba(64, 64, 64, 0.68);
  #count_down_img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 703px;
    height: 703px;
    background: url("../../../assets/images/screenProtect/surplusTimeBg.png")
      no-repeat center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .count_down_label {
      font-size: 100px;
      font-family: Microsoft YaHei;
      text-align: center;
      font-weight: bold;
      line-height: 110px;
      color: #000000;
      .second_word {
        font-size: 50px;
        color: #b1a60a;
         line-height: 50px;
      }
      .pReturn {
        font-size: 50px;
        color: #b1a60a;
         line-height: 50px;
      }
    }
  }
}
</style>
