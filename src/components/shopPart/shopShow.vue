<template>
  <div>
    <div v-if="currentScreenType == 0">
      <swiper
        :class="['shop-brand-show-swiper']"
        :options="swiperOption"
        ref="mySwiper"
        v-if="horizontalItems.length > 0"
      >
        <swiper-slide
          class="shop-brand-show-slide"
          v-for="(item, index) in horizontalItems"
          :key="index"
        >
          <BrandItem
            v-for="(brand, index1) in item"
            :key="index1"
            :brandData="brand"
            @trigger="goMap"
          />
        </swiper-slide>
        <!--分页器。如果放置在swiper-container外面，需要自定义样式。-->
        <div class="swiper-pagination" slot="pagination" />
      </swiper>
      <div class="shop-brand-show-empty" v-else>暂无数据</div>
      <div
        class="show_button_prev" v-show="horizontalItems.length>1"
        @click="slidePrev"
      ></div>
      <div
        class="show_button_next" v-show="horizontalItems.length>1"
        @click="slideNext"
      ></div>
    </div>
    <div v-if="currentScreenType == 1">
      <swiper
        :class="['animated', 'fadeInUp', 'shop-brand-show-swiper']"
        :options="swiperOption"
      >
        <swiper-slide
          class="shop-brand-show-slide"
          ref="mySwiper"
          v-if="renderBrands.length > 0"
        >
          <BrandItem
            v-for="(brand, index) in renderBrands"
            :key="index"
            :brandData="brand"
            @trigger="goMap"
          />
        </swiper-slide>
        <div class="shop-brand-show-empty"  v-else>暂无数据</div>
        <div class="swiper-scrollbar" slot="scrollbar" />
      </swiper>
    </div>
    <div class="selMoreS animated fadeIn" v-if="details.moreStore">
      <div class="selMoreC">
        <div class="close" @click="details = {}">
          <img src="static/images/shop/close.png" alt="" />
        </div>
        <div class="leftC">
          <div class="brand-show-item">
            <el-image :src="details.image">
              <div slot="error" class="image-slot-item-brand"></div>
            </el-image>
            <div class="brand-show-item-info">
              <div class="brand_show_item_name">
                <el-image :src="details.logo" >
                  <div slot="error" class="image-slot"></div>
                </el-image>
                <p class="pName">{{ details.Name }}</p>
              </div>
              <p class="pAreaName">
                <span></span><label>{{ details.AreaName }}</label>
              </p>
            </div>
          </div>
        </div>
        <div class="rightC">
          <div class="sel">请选择您要去的位置</div>
          <div
            class="selU"
            v-for="(item, index) in details.moreStore"
            :key="index"
            @click="goMap1(item)"
          >
           <img src="static/images/shop/more_shop_locate.png" alt="" />
           {{item.AreaName}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cnchar from "cnchar";
import { mapState } from "vuex";
import { useDeepCopy } from "@/utils";
import BrandItem from "@/components/shopPart/brandItem";
import { sendStatistics } from "@/server/other";
import { Image } from "element-ui";
export default {
  props: {
    formatType: String,
    activeThreeMenu: String,
    activeTwoMenu: String,
    formatTypeParentRaw: Map,
  },
  data() {
    return {
      currentScreenType: 1, //当前是竖版还是横版 默认1竖版
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: false, //false表示不会自动隐藏
        },
        mousewheel: true,
        autoHeight: true,
        roundLengths: true, //防止文字模糊
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        // preloadImages:true,
        // updateOnImagesReady:true,
        on: {
          slideChange: function () {
            const buttonNext = document.querySelector(".show_button_next");
            const buttonPrev = document.querySelector(".show_button_prev");
            if (buttonNext && buttonPrev) {
              buttonNext.style.backgroundImage =
                this.activeIndex == this.slides.length-1
                  ? `url(${require("../../assets/images/shop/next.png")})`
                  : `url(${require("../../assets/images/shop/next_active.png")})`;
              buttonPrev.style.backgroundImage =
                this.activeIndex == 0
                  ? `url(${require("../../assets/images/shop/prev.png")})`
                  : `url(${require("../../assets/images/shop/prev_active.png")})`;
            }
          },
          //点击触发swiper更新机制 主要用来解决竖版不能上下滑动问题
          touchStart: function(event){
            this.update();
          },
        },
      },
      renderBrands: [],
      horizontalItems: [], //横版 10个一组数据
      rowNumber: 10, //一行显示多少个(由设计决定)
      details: {},
    };
  },
  computed: {
    ...mapState("home", {
      shopInfo: function (state) {
        // console.log("this.formatType =", this.formatType);
        return useDeepCopy(state.shopInfo)
          .map((shop) => ({
            ...shop,
            logo: `${MAP_CONFIG.BASE_URL}map/${shop.Logo}`,
          }))
          .filter(
            (shop) =>{
              if( this.formatTypeParentRaw.get(shop.brandTypeName) == this.formatType
              && shop.AreaID 
              && String(shop.AreaID).length > 0)
              {  //添加未绑定店铺不需要显示
                return true;
              }
              return false;
            }
             
          );
      },
    }),
    watchMenuChoice() {
      return {
        activeTwoMenu: this.activeTwoMenu,
        activeThreeMenu: this.activeThreeMenu,
      };
    },
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  created() {
    this.currentScreenType = MAP_CONFIG.SCREEN_TYPE;
    if (MAP_CONFIG.SCREEN_TYPE == "0") {
      this.swiperOption.direction = "horizontal";
      this.swiperOption.slidesPerColumnFill = "column";
      this.swiperOption.autoHeight = false;
      this.swiperOption.centeredSlidesBounds = true;
    }
  },
  watch: {
    watchMenuChoice: {
      handler: function () {
        this.filterBrandList();
      },
      immediate: true,
    },
  },
  methods: {
    filterBrandList() {
      // console.log("this.shopInfo =", this.shopInfo);
      if (this.activeThreeMenu == "全部") {
        this.renderBrands = this.shopInfo;
      } else {
        switch (this.activeTwoMenu) {
          case "业态":
            {
              this.renderBrands = this.shopInfo.filter(
                (shop) => shop.brandTypeName == this.activeThreeMenu
              );
            }
            break;
          case "楼层":
            {
              this.renderBrands = this.shopInfo.filter(
                (shop) => shop.floor_name == this.activeThreeMenu
              );
            }
            break;
          case "字母":
            {
              this.renderBrands = this.shopInfo.filter((shop) =>
                this.activeThreeMenu
                  .split("")
                  .find(
                    (word) =>
                      cnchar.spell(shop.Name, "up").split("")[0] == word
                  )
              );
            }
            break;
        }
      }
      this.renderBrands = this.renderBrands.map((item) => ({
        ...item,
        image: `${MAP_CONFIG.BASE_URL}map/${item.image}`,
      }));
      if (MAP_CONFIG.SCREEN_TYPE == "0") {
        this.horizontalItems = this.spliceArr(
          this.renderBrands,
          this.rowNumber
        );
         if (this.horizontalItems.length > 8) {
          if(!this.swiperOption.pagination)
          {
            this.swiperOption.pagination = {
              el: ".swiper-pagination", //分页指示器
              clickable: true,
            };
          }
        }
        // console.log("this.horizontalItems=", this.horizontalItems);
      }
      this.resetSwiper();
    },
    goMap(item) {
      // console.log("222=", item);
      if (item.PointID && String(item.PointID).split("||").length > 1) {
        let arr = [];
        this.details = item;
        String(item.PointID)
          .split("||")
          .forEach((po, index) => {
            arr[index] = Object.assign(
              { ...item },
              {
                PointID: po,
                AreaName: String(item.AreaName).split("||")[index],
              }
            );
          });
          // console.log("this.details.image=",this.details.image);
          //  console.log("this.details.logo=",this.details.logo);
        this.details.moreStore = [...arr];
        // console.log("this.details.moreStore=",this.details.moreStore);
      } 
      else 
      {
        this.$EventBus.$emit("searchEvent", item);
        sendStatistics(
          this.formatType == "购物" ? "_shopping_list_shop" : "_dine_list_shop",
          item.ShopID
        );
      }
    },
    goMap1(item) {
      for (const key in GIM.Points) {
        if (GIM.Points[key].Name == item.AreaName) {
          item.PointID = GIM.Points[key].PointID;
        }
      }
      this.$EventBus.$emit("searchEvent", item);
      sendStatistics(
        this.formatType == "购物" ? "_shopping_list_shop" : "_dine_list_shop",
        item.ShopID
      );
    },
    brandSelect(shop) {
      this.$EventBus.$emit("searchEvent", shop);
      sendStatistics(
        this.formatType == "购物" ? "_shopping_list_shop" : "_dine_list_shop",
        shop.ShopID
      );
    },
    //将数组切割成多少个
    spliceArr(arr, num) {
      let newArr = [];
      for (let i = 0, len = arr.length; i < len; i += num) {
        newArr.push(arr.slice(i, i + num));
      }
      return newArr;
    },
    //切换到第一个slide，速度为0秒
    resetSwiper() {
      let tempSwiper = this.$refs.mySwiper?.swiperInstance;
      /**
       * Swiper切换到指定slide。
       * index:必选，num，指定将要切换到的slide的索引。
       * speed:可选，num(单位毫秒)，切换速度
       * runCallbacks:可选，boolean，设置为false时不会触发onSlideChange回调函数。
       */
      if (tempSwiper) {
        tempSwiper.slideTo(0, 0, false);
      }
    },
    /**
     * 下一个
     */
    slideNext() {
      this.swiper.slideNext();
    },
    /**
     * 上一个
     */
    slidePrev() {
      this.swiper.slidePrev();
    },
    /**
     * 刷新整个slide
     */
    slideUpdate(){
      this.swiper.update();
    }
  },
  components: {
    BrandItem,
    [Image.name]: Image,
  },
  mounted() {},
};
</script>

<style lang="less">
@media screen and (min-width: 2161px) {
  .shop-brand-show-empty {
    position: relative;
    width: 1580px;
    height: 1132px;
    font-size: 32px;
    font-weight: 400;
    color: #42210b;
    text-align: center;
    line-height: 1132px;
  }
  .shop-brand-show-swiper {
    margin-top: 15px;//45px; //75px;
    width: 2686px;
    height: 1182px;
    box-sizing: border-box;
    .shop-brand-show-slide {
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 10px;
      width: 100%;
      height: 1082px;
      display: flex;
      box-sizing: border-box;
      flex-wrap: wrap;
    }
  }
  .show_button_prev {
    position: absolute;
    top: 950px;
    left: 100px;
    width: 72px;
    height: 72px;
    background: url("../../assets/images/shop/prev.png") no-repeat center;
    background-size: contain;
  }
  .show_button_next {
    position: absolute;
    top: 950px;
    right: 100px;
    width: 72px;
    height: 72px;
    background: url("../../assets/images/shop/next_active.png") no-repeat center;
    background-size: contain;
  }
  .selMoreS {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      .selMoreC {
        width: 1350px;
        height: 734px;
        display: flex;
        align-items: center;
        background: #fff;
        padding: 82px;
        box-sizing: border-box;
        position: relative;
        border-radius: 30px;
        .close {
          position: absolute;
          width: 82px;
          height: 82px;
          right: -41px;
          top: -41px;
          img {
            width: 100%;
            height: auto;
          }
        }
        .leftC {
          .brand-show-item {
            position: relative;
            width: 506px;
            height: 498px;
            background-color: rgb(255, 255, 255, 0.9);
            border-radius: 30px;
            margin-bottom: 34px;
            box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
            display: flex;
            align-items: center;
            flex-direction: column;
            box-sizing: border-box;
            .el-image {
              width: 466px;
              height: 350px;
              background: #ffffff;
              display: flex;
              margin-top: 20px;
              border: none;
              justify-content: center;
              align-items: center;
            }
            .brand-show-item-info {
              position: absolute;
              left: 46px;
              bottom: 41px;
              display: flex;
              flex-direction: column;
              height: 162px;
              .brand_show_item_name {
                display: flex;
                align-items: center;
                .el-image {
                  width: 111px;
                  height: 111px;
                  background: #ffffff;
                  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.18);
                  justify-content: center;
                  align-items: center;
                  border: none;
                }
                .pName {
                  margin-left: 25px;
                  width: 176px;
                  transform: translateY(50px);
                  font-size: 27px;
                  font-family: Microsoft YaHei;
                  font-weight: bold;
                  color: #000000;
                }
              }
              .pAreaName {
                margin-top: 20px;
                font-weight: 400;
                color: #3f3a39;
                display: flex;
                align-items: center;
                font-size: 25px;
                font-family: Microsoft YaHei;
                line-height: 33px;
                color: #000000;
                span {
                  width: 22px;
                  height: 26px;
                  background: url("../../assets/images/home/toolList/hot_search_locate.png")
                    no-repeat center;
                  background-size: contain;
                  margin-right: 4px;
                }
                label {
                  max-width: 280px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
        .rightC {
          flex: 1;
          width: 450px;
          height: 100%;
          margin-left: 60px;
          // overflow-y: scroll;
          .sel {
            margin-top: 30px;
            font-size: 42px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            text-align: center;
            color: #E66579;
          }
          .selU {
            // width: 400px;
            // height: 84px;
            // background: #ffffff;
            // border: 2px solid #000000;
            margin-left: 150px;
            margin-top: 58px;
            font-size: 31px;
            font-family: Noto Sans SC;
            font-weight: 400;
            color: #E66579;
            text-align: center;
            line-height: 41px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            width: 294px;
            height: 75px;
            border-radius: 50px;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            // background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
            box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
             img {
              width: 27px;
              height: 33px;
              margin-top: 5px;
              margin-right: 5px;
            }
          }
        }
      }
    }
}
@media screen and (max-width: 2160px) {
  .shop-brand-show-empty {
    width: 1580px;
    height: 2636px;
    font-size: 32px;
    font-weight: 400;
    color: #42210b;
    text-align: center;
    line-height: 2636px;
  }
  .shop-brand-show-swiper {
    margin-top: 45px;//96px;
    width: 1636px;
    height: 2636px;
    .shop-brand-show-slide {
      
      display: flex;
      flex-wrap: wrap;
      // align-content: flex-start;
      box-sizing: border-box;
    }
  }
   .selMoreS {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      .selMoreC {
        width: 1350px;
        height: 734px;
        display: flex;
        align-items: center;
        background: #fff;
        padding: 82px;
        box-sizing: border-box;
        position: relative;
        border-radius: 30px;
        .close {
          position: absolute;
          width: 82px;
          height: 82px;
          right: -41px;
          top: -41px;
          img {
            width: 100%;
            height: auto;
          }
        }
        .leftC {
          .brand-show-item {
            position: relative;
            width: 506px;
            height: 498px;
            background-color: rgb(255, 255, 255, 0.9);
            border-radius: 30px;
            margin-bottom: 34px;
            box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
            display: flex;
            align-items: center;
            flex-direction: column;
            box-sizing: border-box;
            .el-image {
              width: 466px;
              height: 350px;
              background: #ffffff;
              display: flex;
              margin-top: 20px;
              border: none;
              justify-content: center;
              align-items: center;
            }
            .brand-show-item-info {
              position: absolute;
              left: 46px;
              bottom: 41px;
              display: flex;
              flex-direction: column;
              height: 162px;
              .brand_show_item_name {
                display: flex;
                align-items: center;
                .el-image {
                  width: 111px;
                  height: 111px;
                  background: #ffffff;
                  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.18);
                  justify-content: center;
                  align-items: center;
                  border: none;
                }
                .pName {
                  margin-left: 25px;
                  width: 176px;
                  transform: translateY(50px);
                  font-size: 27px;
                  font-family: Microsoft YaHei;
                  font-weight: bold;
                  color: #000000;
                }
              }
              .pAreaName {
                margin-top: 20px;
                font-weight: 400;
                color: #3f3a39;
                display: flex;
                align-items: center;
                font-size: 25px;
                font-family: Microsoft YaHei;
                line-height: 33px;
                color: #000000;
                span {
                  width: 22px;
                  height: 26px;
                  background: url("../../assets/images/home/toolList/hot_search_locate.png")
                    no-repeat center;
                  background-size: contain;
                  margin-right: 4px;
                }
                label {
                  max-width: 280px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
        .rightC {
          flex: 1;
          width: 450px;
          height: 100%;
          margin-left: 60px;
          // overflow-y: scroll;
          .sel {
            margin-top: 30px;
            font-size: 42px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            text-align: center;
            color: #E66579;
          }
          .selU {
            // width: 400px;
            // height: 84px;
            // background: #ffffff;
            // border: 2px solid #000000;
            margin-left: 150px;
            margin-top: 58px;
            font-size: 31px;
            font-family: Noto Sans SC;
            font-weight: 400;
            color: #E66579;
            text-align: center;
            line-height: 41px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            width: 294px;
            height: 75px;
            border-radius: 50px;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            // background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
            box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
             img {
              width: 27px;
              height: 33px;
              margin-top: 5px;
              margin-right: 5px;
            }
          }
        }
      }
    }
}
</style>
