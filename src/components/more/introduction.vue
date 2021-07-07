<template>
  <div class="introduction">
    <swiper class="swiper" :options="swiperOption">
      <swiper-slide>
        <div class="Content swiperContent" v-html="Content"></div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: false,
        mousewheel: true,
        autoHeight: true,
        roundLengths: true, //防止文字模糊

        allowSlideNext: false, //是否允许向前切换
        allowSlidePrev: false, //是否允许向后切换
      },
      Content: `中华广场（ China Plaza）是由香港昌盛集团有限公司和广州新星投资发展有限公司联手打造的大型综合购物中心和甲级写字楼
                为一体的商业大厦。地拥3.5万平方米，其中，商场建筑面积17万平方米，写字楼建筑面积12万平方米，它雄踞于广州市越秀区
                中心地段 —— 中山三路33号，地处优越。大厦北面与广州著名公园“烈士陵园”相对，东面与大型休闲广场 —— 英雄广场为
                邻，并与地铁一号线的烈士陵园站相连，多路公交车路经此地，交通网络四通八达。<br>
                2000年，大厦一期大型综合性购物商场隆重开业。负一层至十层的购物中心集购物、饮食、娱乐于一体，楼层功能明晰、商品
                结构齐全、名牌产品云集 ，为顾客提供一站式的多元化购物服务。负二层至负四层为自动化室内停车场，可提供1000多个机动
                车停车位，全电脑化的车场管理系统与之相配套。<br>
                2007年 ，二期中华国际中心（China International Center）一座5A智能型国际化标准甲级写字楼正式投入使用。楼高268米，
                由南、北两幢塔楼构成，北塔楼为26层，南塔楼为62层，是广州市越秀区标志性建筑。<br>
                2020年，广州新星投资发展有限公司斥巨资对中华广场进行升级改造 ，以“华丽的钻石”为设计理念，围绕打造“新形象、新
                品牌、新业态、新服务”，构筑“老城区新中心”的综合消费娱乐中心形象，让中华广场焕发新生，再创辉煌。<br>
                在未来的岁月里，中华广场将不断地完善自我 、超越自我，致力于为广大消费者和客户营造更加舒适休闲的购物体验空间和更
                加优质的商务工作环境！`,
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
  .introduction {
    width: 100%;
    height: 100%;
    .swiper {
      width: 100%;
      height: 100%;
    }
    .Content {
      color: #000000;
      font-size: 26px;
      line-height: 60px;
      font-weight: 400;
      width: 1372px;
      margin: 0 auto;
    }
  }
}
@media screen and (max-width: 2160px) {
  .introduction {
    width: 100%;
    height: 100%;
    .swiper {
      width: 100%;
      height: 100%;
    }
    .Content {
      color: #000000;
      font-size: 26px;
      line-height: 60px;
      font-weight: 400;
      // letter-spacing: 0px;
    }
  }
}
</style>
