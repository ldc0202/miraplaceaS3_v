<template>
  <div class="contact">
    <swiper class="swiper" :options="swiperOption">
      <swiper-slide v-for="(item, i) in contactData" :key="i" class="busItem">
        <div class="Content">
          <div class="titleBox">
            <img :src="item.icon" alt="" class="icon" />
            <div class="name">{{ item.name }}</div>
          </div>
          <div class="childBox">
            <div
              class="childItem"
              v-for="(el, j) in item.child"
              :key="j"
              :class="{ oneItem: item.child.length < 2 }"
            >
             <p v-html="el.name"></p> 
            </div>
          </div>
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
        allowSlideNext : false, //是否允许向前切换
        allowSlidePrev : false,//是否允许向后切换
      },
      contactData: [
        {
          name: "地址",
          icon: require("../../assets/images/more/positionIcon.png"),
          child: [
            {
              name: "广州市中山三路33号(近烈士陵园)",
            },
          ],
        },
        {
          name: "电话",
          icon: require("../../assets/images/more/phone.png"),
          child: [
            {
              name: "服务热线：020-83739099（仲量联行）<br> 招商热线：020-83739831（广州新星）<br> 活动合作：020-83739803（广州新星）",
            },
          ],
        },
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
@media screen and (min-width: 2161px){
  .contact {
  width: 1275px;
  height: 100%;
  padding-top: 230px;
  padding-left: 96px;
  .contactContent {
    position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    .contactItem {
      display: flex;
      margin-bottom: 50px;
      justify-content: center;
      .icon {
        width: 28px;
        height: 28px;
        margin-right: 20px;
      }
      .name {
        height: 28px;
        line-height: 28px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        color: #e85400;
      }
    }
  }
  .busItem {
    margin-bottom: 91px;
  }
  .swiper {
    width: 100%;
    height: 100%;
  }
  .titleBox {
    height: 58px;
    line-height: 58px;
    margin-bottom: 18px;
    display: flex;
    .icon {
      width: 58px;
      height: 58px;
      margin-right: 12px;
    }
    .name {
      height: 60px;
      line-height: 60px;
      font-size: 28px;
      color: #000000;
      font-weight: bold;
    }
  }
  .childBox {
    width: 1275px;
    box-sizing: border-box;
    border-top: 1px solid #E66579;
    .childItem {
      color: #000000;
      font-size: 26px;
      font-weight: 400;
      line-height: 60px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
}
@media screen and (max-width: 2160px){
  .contact {
  width: 100%;
  height: 100%;
  padding-top: 88px;
  .contactContent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .contactItem {
      display: flex;
      margin-bottom: 50px;
      justify-content: center;
      .icon {
        width: 28px;
        height: 28px;
        margin-right: 20px;
      }
      .name {
        height: 28px;
        line-height: 28px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        color: #e85400;
      }
    }
  }
  .busItem {
    margin-bottom: 91px;
  }
  .swiper {
    width: 100%;
    height: 100%;
  }
  .titleBox {
    height: 58px;
    line-height: 58px;
    margin-bottom: 18px;
    display: flex;
    .icon {
      width: 58px;
      height: 58px;
      margin-right: 12px;
    }
    .name {
      height: 60px;
      line-height: 60px;
      font-size: 28px;
      color: #000000;
      font-weight: bold;
    }
  }
  .childBox {
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid #E66579;
    // padding-top: 28px;
    .childItem {
      color: #000000;
      font-size: 26px;
      font-weight: 400;
      line-height: 60px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
}

</style>
