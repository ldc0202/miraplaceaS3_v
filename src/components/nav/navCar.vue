<template>
  <!-- 寻车在地图页抬头 指引-->
  <div id="navCar">
    <div class="newHand">
      <span class="newHandItem" :class="{ newHandOpacity: newHandFlag == 0 }">
        <span class="newHandFlag">①</span>
        <span class="newHandText">输入车位号</span>
        <span class="newHandArrow">→</span>
      </span>
      <span class="newHandItem2" :class="{ newHandOpacity: newHandFlag == 1 }">
        <span class="newHandFlag">②</span>
        <span class="newHandText">线路指引</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newHandFlag: 1, //车位寻车步骤，默认从0开始
    };
  },
  directives: {},
  methods: {},
  components: {},
};
</script>

<style scoped lang='less'>
@media screen and (min-width: 2161px) {
  #navCar {
    width: 970px;
    height: 42px;
    display: flex;
    justify-content: center;
    .newHand {
      margin-left: 36px;
      width: 100%;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      .newHandItem {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
      }
      .newHandItem2 {
        margin-left: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
      }
      .newHandFlag {
        width: 52px;
        height: 37px;
        font-size: 32px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 37px;
        color: #e66579;
        margin-top: -5px;
      }
      .newHandText {
        width: 188px;
        height: 37px;
        font-size: 28px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 37px;
        color: #e66579;
      }
      .newHandArrow {
        width: 58px;
        height: 37px;
        font-size: 38px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 37px;
        color: #e66579;
      }
      .newHandOpacity {
        opacity: 1;
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  #navCar {
    width: 970px;
    height: 42px;
    display: flex;
    justify-content: center;
    .newHand {
      margin-left: 120px;
      width: 582px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      .newHandItem {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
      }
      .newHandItem2 {
        margin-left: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
      }
      .newHandFlag {
        width: 52px;
        height: 37px;
        font-size: 32px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 37px;
        color: #e66579;
        margin-top: -5px;
      }
      .newHandText {
        width: 188px;
        height: 37px;
        font-size: 28px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 37px;
        color: #e66579;
      }
      .newHandArrow {
        width: 58px;
        height: 50px;
        font-size: 38px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 50px;
        color: #e66579;
      }
      .newHandOpacity {
        opacity: 1;
      }
    }
  }
}
</style>