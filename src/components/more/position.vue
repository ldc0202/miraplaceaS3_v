<template>
  <div class="position">
    <div class="horizontalPos" v-if="currentScreenType == 0">
      <div
        v-for="(item, i) in tData"
        :key="i"
        class="route"
        @click="onRoute(i)"
      >
        <div class="horizontalIconName">
          <img :src="item.icon" alt="" class="icon" />
          <div class="name">{{ item.name }}</div>
        </div>
        <div class="horizontalItem" v-if="item.child.length < 3">
          <div
            class="childItem"
            v-for="(el, j) in item.child"
            :key="j"
            :class="{ oneItem: item.child.length < 2 }"
          >
            <div class="site">
              <span v-if="el.flag">{{ el.flag }} </span>
              <span>{{ el.name }} </span>
            </div>
            <span v-if="el.info">{{ el.info }} </span>
          </div>
        </div>
        <div class="horizontalItemMax" v-else>
          <div class="horizontalItemTwo">
            <div class="childItem">
              <div class="site">
                <span v-if="item.child[0].flag">{{ item.child[0].flag }} </span>
                <span>{{ item.child[0].name }} </span>
              </div>
              <span v-if="item.child[0].info">{{ item.child[0].info }} </span>
            </div>
            <div class="childItem">
              <div class="site">
                <span v-if="item.child[1].flag">{{ item.child[1].flag }} </span>
                <span>{{ item.child[1].name }} </span>
              </div>
              <span v-if="item.child[1].info">{{ item.child[1].info }} </span>
            </div>
          </div>
          <div class="horizontalItemTwo">
            <div class="childItem">
              <div class="site">
                <span v-if="item.child[2].flag">{{ item.child[2].flag }} </span>
                <span>{{ item.child[2].name }} </span>
              </div>
              <span v-if="item.child[2].info">{{ item.child[2].info }} </span>
            </div>
            <div class="childItem">
              <div class="site">
                <span v-if="item.child[3].flag">{{ item.child[3].flag }} </span>
                <span>{{ item.child[3].name }} </span>
              </div>
              <span v-if="item.child[3].info">{{ item.child[3].info }} </span>
            </div>
          </div>
        </div>
        <div class="position_circle" :class="{ 'position_circle_active': selectIndex==i, }"
        v-if="item.name != '打车路线'">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="verticalPos" v-if="currentScreenType == 1">
      <div
        v-for="(item, i) in tData"
        :key="i"
        class="route"
        @click="onRoute(i)"
      >
        <img :src="item.icon" alt="" class="icon" />
        <div class="name">{{ item.name }}</div>
        <div
          class="childItem"
          v-for="(el, j) in item.child"
          :key="j"
          :class="{ oneItem: item.child.length < 2 }"
        >
          <div class="site">
            <span v-if="el.flag">{{ el.flag }} </span>
            <span>{{ el.name }} </span>
          </div>
          <span v-if="el.info">{{ el.info }} </span>
        </div>
        <div class="position_circle" :class="{ 'position_circle_active': selectIndex==i, }"
        v-if="item.name != '打车路线'">
          <p>{{ item.name }}</p>
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
      currentScreenType: 0, //当前是横版还是竖版
      selectIndex:-1,//当前选中的路线
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
      tData: [
        {
          name: "地铁路线",
          icon: require("../../assets/images/more/subway.png"),
          child: [
            {
              name: "地铁1号线-烈士陵园站",
            },
          ],
        },
        {
          name: "打车路线",
          icon: require("../../assets/images/more/taxi.png"),
          child: [
            {
              flag: "①",
              name: "广州火车站",
              info: "16分钟   4.5公里   打车约18元",
            },
            {
              flag: "②",
              name: "广州东站",
              info: "24分钟   7.7公里   打车约33元",
            },
            {
              flag: "③",
              name: "广州南站",
              info: "33分钟   22.5公里   打车约67元",
            },
            {
              flag: "④",
              name: "广州白云国际机场",
              info: "45分钟   34.1公里   打车约103元",
            },
          ],
        },
        {
          name: "公交路线",
          icon: require("../../assets/images/more/bus.png"),
          child: [
            {
              flag: "①",
              name: "较场西路",
              info: "183路;B8路;夜36路",
            },
            {
              flag: "②",
              name: "大东门(中山三路)",
              info: "1路;76路;93路;102路;107路等",
            },
          ],
        },
      ],
    };
  },
  computed: {},
  created() {
    this.currentScreenType = MAP_CONFIG.SCREEN_TYPE;
  },
  mounted() {},
  watch: {},
  methods: {
    onRoute(index) {
      // console.log("index=",index);
      this.selectIndex = index;
      this.$EventBus.$emit("currentRoute", index);
    },
  },
  components: {},
  destroyed() {
    
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .position {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    .horizontalPos {
      display: flex;
      flex-flow: column;
      .route {
        width: 1465px;
        height: 335px;
        background: #ffffff;
        // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        border-radius: 20px;
        .horizontalIconName {
          display: flex;
          flex-flow: column;
          align-items: center;
          margin-left: 105px;
          .icon {
            width: 59px;
            height: 59px;
          }
          .name {
            width: 144px;
            height: 47px;
            font-size: 36px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 42px;
            color: #000000;
            margin-top: 31px;
          }
        }
        .horizontalItem {
          width: 790px;
          height: 206px;
          display: flex;
          flex-flow: column;
          margin-left: 198px;
        }
        .horizontalItemMax {
          width: 790px;
          height: 206px;
          display: flex;
          align-items: center;
          margin-left: 198px;
          .horizontalItemTwo {
            width: 368px;
            height: 206px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-flow: column;
          }
        }
        .childItem {
          width: 368px;
          height: 206px;
          font-size: 25px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 42px;
          color: #000000;
          .site {
            font-size: 29px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 42px;
            color: #000000;
          }
        }
        .oneItem {
          width: 368px;
          height: 335px;
          font-size: 29px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 42px;
          color: #000000;
          text-align: center;
          display: flex;
          align-items: center;
        }
        .position_circle {
          position: fixed;
          margin-left: 1263px;
          width: 106px;
          height: 106px;
          border: 2px solid #e66579;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          p {
            width: 54px;
            height: 71px;
            font-size: 27px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 35px;
            color: #000000;
          }
        }
        .position_circle_active{
          // background: #e66579;
          background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
          border-radius: 50%;
          p {
            color: #fff;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 2160px) {
  .position {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .verticalPos {
      display: flex;
      width: 100%;
      height: 100%;
      // margin-top: 5px;
      .route {
        width: 465px;
        height: 766px;
        background: #ffffff;
        box-shadow: 0px -1PX 19PX 3px rgba(230, 101, 121, 0.18);
        margin-right: 33px;
        display: flex;
        flex-flow: column;
        align-items: center;
        border-radius: 20px;
        margin-top: 20px;
        margin-left: 20px;
        .icon {
          width: 59px;
          height: 59px;
          margin: 31px auto;
        }
        .name {
          width: 144px;
          height: 47px;
          font-size: 36px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 42px;
          color: #000000;
          margin-bottom: 91px;
        }
        .childItem {
          width: 368px;
          height: 405px;
          font-size: 25px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 42px;
          color: #000000;
          .site {
            font-size: 29px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 42px;
            color: #000000;
          }
        }
        .oneItem {
          width: 368px;
          height: 465px;
          font-size: 29px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 42px;
          color: #000000;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -91px;
        }
        .position_circle {
          width: 106px;
          height: 106px;
          border: 2px solid #e66579;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 57px;
          p {
            width: 54px;
            height: 71px;
            font-size: 27px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 35px;
            color: #000000;
          }
        }
        .position_circle_active{
          // background: #e66579;
          background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
          border-radius: 50%;
          p {
            color: #fff;
          }
        }
      }
    }

    // .swiper {
    //   width: 100%;
    //   height: 100%;
    // }
    // .busItem {
    //   margin-bottom: 91px;
    // }
    // .titleBox {
    //   height: 56px;
    //   line-height: 56px;
    //   margin-bottom: 18px;
    //   display: flex;
    //   .icon {
    //     width: 56px;
    //     height: 56px;
    //     margin-right: 12px;
    //   }
    //   .name {
    //     height: 60px;
    //     line-height: 60px;
    //     font-size: 28px;
    //     color: #000000;
    //     font-weight: bold;
    //   }
    // }
    // .childBox {
    //   width: 100%;
    //   box-sizing: border-box;
    //   border-top: 1px solid #000000;
    //   padding-top: 28px;
    //   .childItem {
    //     color: #000000;
    //     font-size: 26px;
    //     &:last-of-type {
    //       margin-bottom: 0;
    //     }
    //   }
    // }
  }
}
</style>
