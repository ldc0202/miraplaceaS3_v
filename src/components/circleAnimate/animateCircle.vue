<template>
  <div class="animate-circle-group">
    <span :class="['circle1', direction]"></span>
    <span :class="['circle2', direction]"></span>
    <span :class="['circle2', direction]"></span>
  </div>
</template>

<script>
export default {
  props: {
    direction: String
  },
};
</script>

<style scoped lang='less'>
.animate-circle-group {
  span {
    position: absolute;
    border-radius: 50%;
    z-index: -1;
    background: transparent;
    &:nth-child(1) {
      left: 15px;
      top: 1250px;
      width: 351px;
      height: 351px;
      border: 11px solid rgba(0, 62, 146, 0.1);
      animation: circle1 4500ms alternate infinite linear;
      &.vertical {
        top: -175px;
        left: 1850px;
      }
    }

    &:nth-child(2) {
      top: 1380px;
      left: -360px;
      width: 720px;
      height: 720px;
      border: 16px solid rgba(232, 84, 0, 0.1);
      animation: circle2 4500ms alternate infinite linear;
      &.vertical {
        top: -360px;
        left: 2030px;
      }
    }

    &:nth-child(3) {
      top: 1130px;
      right: -210px;
      width: 420px;
      height: 420px;
      border: 18px solid rgba(0, 62, 146, 0.1);
      animation: circle3 4500ms alternate infinite linear;
      &.vertical {
        top: 2010px;
        right: 2385px;
      }
    }
  }
}

@keyframes circle1 {
  0% {
    transform: translate(0px, 0px);
  }

  20% {
    transform: translate(25px, -38px);
  }

  40% {
    transform: translate(-8px, 35px);
  }

  60% {
    transform: translate(18px, -5px);
  }

  80% {
    transform: translate(6px, -8px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes circle2 {
  0% {
    transform: translate(0px, 0px);
  }

  20% {
    transform: translate(-35px, 25px);
  }

  40% {
    transform: translate(12px, 8px);
  }

  60% {
    transform: translate(-6px, 24px);
  }

  80% {
    transform: translate(-6px, -8px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes circle3 {
  0% {
    transform: translate(0px, 0px);
  }

  20% {
    transform: translate(12px, 26px);
  }

  40% {
    transform: translate(-29px, -18px);
  }

  60% {
    transform: translate(8px, 5px);
  }

  80% {
    transform: translate(26px, -12px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}
</style>
