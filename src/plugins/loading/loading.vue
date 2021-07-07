<template>
  <div class="myLoading" v-show="showLoading">
    <div id="loading">
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
    </div>
    <div class="loadingLab">{{textLoading}}</div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      showLoading: false,
      textLoading:"loading..."
    };
  },
  computed: {},
  watch: {},
  methods: {
    show() {
      this.showLoading = true;
    },
    close() {
      this.showLoading = false;
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {}, //生命周期 - 销毁之前
};
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.myLoading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.75);
  
  @-moz-keyframes fade {
    from {
      background: #333;
    }
  }

  @-webkit-keyframes fade {
    from {
      background: #333;
    }
  }

  body {
    background: #FFF;
  }

  #loading {
    background: rgba(255,255,255,0);
    border-radius: 30px;
    height: 90px;
    margin: -45px 0 0 -45px;
    position: fixed;
    left: 50%;
    top: 50%;
    width: 90px;
  }

  .loadingLab{
    color:#000;
    font-size: 32px;
    font-weight: 300;
    line-height: 100px;
    left: 50%;
    transform: translateX(-50%);
    top: 50%;

    margin: 24px auto -50px;
    position: fixed;
  }

  .bubble {
    border-radius: 2px;
    height: 12px;
    margin: -6px 0 0 -2px;
    position: absolute;
    width: 4px;
    -moz-animation-name: fade;
    -moz-animation-duration: 1.2s;
    -moz-animation-iteration-count: infinite;
    -moz-animation-timing-function: linear;
    -webkit-animation-name: fade;
    -webkit-animation-duration: 1.2s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
  }

  // @for $i from 1 through 12 {
  //   .bubble:nth-of-type(#{$i + 1}) {
  //     -moz-transform: rotate(30deg * $i);
  //     -moz-animation-delay: 0.1s * $i;
  //     -webkit-transform: rotate(30deg * $i);
  //     -webkit-animation-delay: 0.1s * $i;
  //   }
  // }
  .xkd(@n, @i: 1) when (@i =< @n) {
    .bubble:nth-of-type(@{i}) {
      -moz-transform: rotate(30deg * @i - 30deg);
      -moz-animation-delay: 0.1s * @i;
      -webkit-transform: rotate(30deg * @i - 30deg);
      -webkit-animation-delay: 0.1s * @i;
    }
    .xkd(@n, (@i + 1));
  }

  .xkd(12);

  .bubble:nth-of-type(1) {
    left: 50%;
    top: 30%;
  }

  .bubble:nth-of-type(2) {
    left: 60%;
    top: 33%;
  }

  .bubble:nth-of-type(3) {
    left: 67%;
    top: 40%;
  }

  .bubble:nth-of-type(4) {
    left: 70%;
    top: 50%;
  }

  .bubble:nth-of-type(5) {
    left: 67%;
    top: 60%;
  }

  .bubble:nth-of-type(6) {
    left: 60%;
    top: 67%;
  }

  .bubble:nth-of-type(7) {
    left: 50%;
    top: 70%;
  }

  .bubble:nth-of-type(8) {
    left: 40%;
    top: 67%;
  }

  .bubble:nth-of-type(9) {
    left: 33%;
    top: 60%;
  }

  .bubble:nth-of-type(10) {
    left: 30%;
    top: 50%;
  }

  .bubble:nth-of-type(11) {
    left: 33%;
    top: 40%;
  }

  .bubble:nth-of-type(12) {
    left: 40%;
    top: 33%;
  }
}
</style>