<template>
<!-- :class="getClass" -->
  <div id="move_dot" :class="getClass" ref="move_dot" @click="onClick">
    <div class="svgBtn">
      <ReturnSVG/>
    </div>
    <div class="label">{{ label }}</div>

  </div>
</template>

<script>
import ReturnSVG from "@/components/svgBtn/returnBtn"
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
  },
  computed: {
    getClass() {
      return MAP_CONFIG.SCREEN_TYPE === 1 ? "move-dot-vertical" : "move-dot-horizontal"
    }
  },
  data() {
    return {
      x: 600, //初始化x坐标
      y: 500, //初始化y坐标
    };
  },
  methods: {
    onClick(event) {
      this.$emit("click", event);
    }
  },
  components:{
    ReturnSVG,
  }
};
</script>

<style scoped lang='less'>
#move_dot {
  position: absolute;
  width: 540px;
  height: 540px;
  /* background: url("../../../assets/images/screenProtect/com_noData_bg.png")
    no-repeat center; */
  background-size: cover;
  // animation: dotMove 16000ms infinite linear;
  z-index: 20;

  &.move-dot-horizontal {
    animation: dotMoveHorizontal 16000ms infinite linear;
  }

  &.move-dot-vertical {
    animation: dotMoveVertical 16000ms infinite linear;
  }

  // &::before {
  //   opacity: 1;
  //   border: none;
  //   width: 300px;
  //   height: 300px;
  //   position: absolute;
  //   left: 50%;
  //   top: 50%;
  //   transform: translate(-50%, -50%);
  //   background-color: rgba(66, 33, 11, 0.26);
  //   border-radius: 50%;
  //   z-index: -1;
  //   animation: w1 1s infinite;
  // }
  // &::after {
  //   content: "";
  //   width: 320px;
  //   height: 320px;
  //   position: absolute;
  //   left: 50%;
  //   top: 50%;
  //   transform: translate(-50%, -50%);
  //   border-radius: 50%;
  //   background-color: rgba(66, 33, 11, 0.13);
  //   z-index: -2;
  //   animation: w2 1s infinite;
  // }
  .label {
    width: 540px;
    height: 540px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0);
    z-index: -10;
   // animation: w2 1s infinite;
  }
}

@keyframes dotMoveHorizontal {
  0% {
    transform: translate(1720px, 0px);
  }

  25% {
    transform: translate(0, 880px);
  }

  50% {
    transform: translate(1720px, 1760px);
  }

  75% {
    transform: translate(3440px, 880px);
  }

  100% {
    transform: translate(1720px, 0px);
  }
}

@keyframes dotMoveVertical {
  0% {
    transform: translate(880px, 0px);
  }

  25% {
    transform: translate(0, 1720px);
  }

  50% {
    transform: translate(880px, 3440px);
  }

  75% {
    transform: translate(1760px, 1720px);
  }

  100% {
    transform: translate(880px, 0px);
  }
}

// @keyframes w1 {
//   0% {
//     width: 300px;
//     height: 300px;
//   }

//   100% {
//     width: 320px;
//     height: 320px;
//   }
// }

@keyframes w2 {
  0% {
    width: 540px;
    height: 540px;
  }

  100% {
    width: 600px;
    height: 600px;
  }
}
</style>