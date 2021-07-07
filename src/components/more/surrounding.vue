<template>
  <div class="surrounding">
    <swiper class="swiper" :options="swiperOption">
      <swiper-slide class="surroundingContent">
        <div v-for="(item, i) in surroundingData" :key="i">
          <div class="titleBox">
            <img :src="item.icon" alt="" class="icon" />
            <div class="name">{{ item.name }}</div>
          </div>
          <div class="contentText" v-html="item.content"></div>
        </div>
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
        allowSlidePrev: false //是否允许向后切换
      },
      surroundingData: [
        {
          name: "广州起义烈士陵园",
          icon: require("../../assets/images/more/jingdian.png"),
          content: `广州起义烈士陵园，位于广东省广州市越秀区中山二路92号，占地18万平方米，是解放后为纪念1927年12月11日中国共产党
领导的广州起义牺牲的烈士于1954年修建的纪念性公园。
陵园主体有正门、广场、陵墓大道、广州起义纪念碑和圆形的封土。现有景点和游乐场所16处，集纪念、科普于一园。墓道两
旁有20个大花坛，四季鲜花不断；墓上密铺青草，四周松柏常青；陵园东部有中朝人民血谊亭和中苏人民血谊亭。园中人工湖
还有湖心纪念亭，横匾上书 “血祭轩辕”，为董必武所题。
广州起义烈士陵园被列为全国重点烈士纪念建筑物保护单位和广东省重点文物保护单位，是广州市首批爱国主义教育基地之一。`
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {}
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px){
  .surrounding {
    position:fixed;
    margin-top:80px;
  width: 1289px;
  height: 100%;
  .swiper {
    width: 1289px;
    height: 100%;
  }
  .surroundingContent {
    width: 1289px;
    box-sizing: border-box;
    margin-bottom: 50px;
    &:last-of-type {
      margin-bottom: 0px;
    }
    .titleBox {
      height: 56px;
      line-height: 56px;
      margin-bottom: 18px;
      display: flex;
      border-bottom: 1px solid #E66579;
      padding-bottom: 18px;
    }
    .name {
      padding-bottom: 13px;
      margin-bottom: 10px;
      width: 224px;
      height: 37px;
      font-size: 28px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 60px;
      color: #000000;
    }
    .icon {
      width: 56px;
      height: 56px;
      margin-right: 12px;
    }
    .contentText {
      width: 1289px;
      height: 395px;
      font-size: 26px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 60px;
      color: #000000;
    }
  }
}
}
@media screen and (max-width: 2160px){
  .surrounding {
  width: 100%;
  height: 100%;
  .swiper {
    width: 100%;
    height: 100%;
  }
  .surroundingContent {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 50px;
    &:last-of-type {
      margin-bottom: 0px;
    }
    .titleBox {
      height: 56px;
      line-height: 56px;
      margin-bottom: 18px;
      display: flex;
      border-bottom: 1px solid #E66579;
      padding-bottom: 18px;
    }
    .name {
      // color: #42210b;
      // font-size: 28px;
      // font-weight: bold;
      padding-bottom: 13px;
      margin-bottom: 10px;

      width: 224px;
      height: 37px;
      font-size: 28px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 60px;
      color: #000000;
    }
    .icon {
      width: 56px;
      height: 56px;
      margin-right: 12px;
    }
    .contentText {
      // color: #42210b;
      // font-size: 24px;
      // line-height: 60px;
      // letter-spacing: -1px;
      // padding-right: 4px;
      // margin-bottom: 24px;

      width: 1456px;
      height: 335px;
      font-size: 26px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 60px;
      color: #000000;
    }
  }
}
}

</style>
