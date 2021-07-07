<template>
  <div class="search-part">
    <div class="search-input">
      <!-- <img
        v-if="noAnimate"
        src="../../assets/images/animat/rabbit3.png"
        alt=""
        class="hide-top-rabbit-animation"
      /> -->
      <div class="inputContent">
        <Popover
          trigger="manual"
          v-model="popShow"
          placement="bottom"
          :visible-arrow="false"
          popper-class="search-popper"
        >
          <swiper class="search-result-list-container" :options="swiperOption">
            <swiper-slide
              class="search-result-list-slide"
              v-if="searchResults.length > 0"
              style="height: auto"
            >
              <div
                class="search-result-list-item"
                v-for="(item, index) in searchResults"
                :key="index"
                @click="goNavigate(item)"
              >
                <span>{{ item.Name }}</span> <span>{{ item.floor_name }}</span>
              </div>
            </swiper-slide>
            <div v-else class="search-result-list-item">
              抱歉，没有搜索到您想要查找的品牌...
            </div>
            <div class="swiper-scrollbar" slot="scrollbar"></div>
          </swiper>
          <!-- data-mode="en" 默认使用英文键盘 -->
          <input
            data-mode="en"
            slot="reference"
            ref="searchInputRef"
            class="search-input-inner"
            @focus="focus"
            @blur="blur"
            type="text"
            readonly
            placeholder="请输入关键字或品牌名称"
            v-model="searchVal"
          />
        </Popover>
        <span class="search-icon"></span>
      </div>
    </div>
    <Key-Board
      modal
      ref="keyBoardRef"
      color="#E66579"
      :blurHide="false"
      @close="closePop"
      @keyChange="keyChange"
      @change="change"
      :handApi="
        isOnLine
          ? 'https://service.chaunve.com/HandWriteRecognizerService.asmx/Command'
          : ''
      "
    />
  </div>
</template>

<script>
import Fuse from "fuse.js";
import { mapState } from "vuex";
import { Popover } from "element-ui";
import { serachShopServer } from "@/server/shop";
import { convertMultipleArea, debounce } from "@/utils";
import { sendStatistics } from "@/server/other";
// import cnchar from "cnchar";
export default {
  props: {
    noAnimate: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "map",
    },
  },
  data() {
    return {
      fuse: null,
      searchVal: "",
      searchResults: [],
      popShow: false,
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true,
        },
        mousewheel: true,
        roundLengths: true, //防止文字模糊
      },
      isOnLine: navigator.onLine,
    };
  },
  mounted() {
    //console.log("this.searchDatas=",this.searchDatas);
    this.fuse = new Fuse(this.searchDatas, {
      keys: ["Name", "brandCnName", "brandEnName", "PinYin", "FirstLetter"],
    });
    this.$EventBus.$on("openScreenProtector", () => {
      this.$refs.keyBoardRef?.hideKeyBoard();
    });
  },
  computed: {
    ...mapState("home", {
      searchDatas: (state) => state.shopInfo.filter((shop) =>{
        if(shop.floor_id != undefined
        && shop.AreaID 
        && String(shop.AreaID).length > 0)
        { //添加未绑定店铺不需要显示
          return true;
        }
        return false;
      } ),
    }),  //排除没有楼层的商铺
  },
  watch: {
    // searchDatas: {
    //   handler: function () {
    //     fuse = new Fuse(this.searchDatas, {
    //       keys: [
    //         "Name",
    //         "brandCnName",
    //         "brandEnName",
    //         "PinYin",
    //         "FirstLetter"
    //       ]
    //     });
    //   },
    //   immediate: true
    // },
    searchVal(queryString) {
      if (queryString == window.MAP_CONFIG.debug_password) {
        this.$EventBus.$emit("openDebug");
      }
      debounce(async () => {
        console.log("queryString=",queryString);
        this.searchResults = queryString
          ? this.fuse.search(queryString).map((result) => result.item)
          : this.searchDatas;
          console.log("this.searchResults=",this.searchResults);
      }, 400)();
      return;
    },
  },
  methods: {
    change(queryString) {
      // 开启debug模式
      if (queryString === MAP_CONFIG.OPEN_DEBUG_DIRECTIVE) {
        this.$EventBus.$emit("openDebug");
        return;
      }
      this.searchVal = queryString;
      // 数据筛选
      debounce(() => {
        let searchResults;
        let lineSearch = true;
        if (!queryString) {
          this.searchResults = convertMultipleArea(this.searchDatas);
        } else {
          setTimeout(() => {
            // 两秒之后如果在线搜索接口还是没有返回搜索结果此时采用离线搜索
            if (!searchResults) {
              lineSearch = false;
              searchResults = this.filterShop(queryString.toLowerCase());
              this.searchResults = convertMultipleArea(searchResults);
              console.log("离线搜索=",this.searchResults);
            }
          }, 2000);
          if(MAP_CONFIG.IS_SUPER_SEARCH)
          {
            serachShopServer(queryString)
            .then((searchResult) => {
              // 当两秒以内搜索结果能够返回的情况才允许赋值
              if (lineSearch) {
                searchResults = searchResult;
                this.searchResults = convertMultipleArea(searchResults);
                console.log("在线搜索=",this.searchResults);
              }
            })
            .catch(() => {
              // 搜索失败的情况用离线搜索
              searchResults = this.filterShop(queryString.toLowerCase());
              this.searchResults = convertMultipleArea(searchResults);
              console.log("在线搜索失败=",this.searchResults);
            });
          }
         
        }
      }, 200)();
    },
    // 离线本地筛选
    filterShop(searchLetter) {
      this.fuse = new Fuse(this.searchDatas, {
        keys: ["Name", "brandCnName", "brandEnName", "PinYin", "FirstLetter"],
      });
      return this.fuse.search(searchLetter).map((result) => result.item);
    },
    // 输入框focus事件
    focus() {
      this.searchResults = this.searchDatas;
      setTimeout(() => {
        this.popShow = true;
      }, 100);
      map.stopRender();
      if (document.querySelector(".map-navigate-bar")) {
        document.querySelector(".map-navigate-bar").style.zIndex = 1999;
      }
      let typeClickmark = {
        map: "_map_search",
        购物: "_shopping_search",
        美食: "_dine_search",
      };
      sendStatistics(typeClickmark[this.type]);
    },
    // 输入框blur事件
    blur() {
      map.startRender();
      let typeClickmark = {
        map: "_map_searchpage_close",
        购物: "_shopping_searchpage_close",
        美食: "_dine_searchpage_close",
      };
      sendStatistics(typeClickmark[this.type]);
    },
    // 关闭弹窗
    closePop() {
      this.popShow = false;
      this.searchVal = "";
      setTimeout(() => {
        if (document.querySelector(".map-navigate-bar")) {
          document.querySelector(".map-navigate-bar").style.zIndex = 2001;
        }
      }, 500);
    },
    // 导航
    goNavigate(shop) {
      this.$EventBus.$emit("searchEvent", shop);
      this.$refs.keyBoardRef?.hideKeyBoard();
      let typeClickmark = {
        map: "_map_searcharea_shop",
        购物: "_shopping_searcharea_shop",
        美食: "_dine_searcharea_shop",
      };
      sendStatistics(typeClickmark[this.type], shop.ShopID);
    },
    // 按键盘屏保事件重置
    keyChange() {
      screenProtect_VNode.reLoadScreenProtector();
    },
  },
  components: {
    Popover,
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .search-part {
    border-radius: 44px;
    .search-input {
      position: fixed;
      top: 238px;
      right: 1326px;
      width: 972px;
      height: 88px;
      z-index: 2000;
      .inputContent {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        border-radius: 44px;
        border: 1px solid #e66579;
        // box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.16);
        // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        z-index: 2;
        background: #ffffff;
      }
      .search-input-inner {
        padding: 0;
        width: 970px;
        height: 88px;
        background: #ffffff;
        font-weight: 400;
        outline: none;
        text-indent: 95px;
        border: none;
        font-size: 32px;
        line-height: 88px;
        color: #000000; //rgba(66, 33, 11, 0.59);

        &::placeholder {
          font-size: 32px;
          font-weight: 400;
          color: #8b8b8b; //rgba(66, 33, 11, 0.59);
        }
      }
      .search-icon {
        position: absolute;
        top: 50%;
        left: 35px;
        transform: translateY(-50%);
        width: 43px;
        height: 43px;
        background: url("../../assets/images/details/search_icon_d.png")
          no-repeat center;
        background-size: cover;
      }
    }
  }

  .search-popper {
    width: 870px;
    max-height: 700px;
    background: #ffffff;
    top: 317px !important;
    left: 20px;
    // border: 1px solid #ddbc77;
    // box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.16);
    border-radius: 0 0 45px 45px;
    .search-result-list-container {
      width: 100%;
      max-height: 300px;
      .search-result-list-item {
        width: 768px;
        height: 45px;
        border-radius: 23px;
        margin: 10px auto;
        font-size: 23px;
        font-weight: 400;
        line-height: 45px;
        color: #000000; //rgba(66, 33, 11, 0.59);
        display: flex;
        justify-content: space-between;
        outline: none;
        border: none;
        span {
          &:nth-child(1) {
            max-width: 600px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .key-board {
    position: fixed;
    left: 52.8%;
  }
}
@media screen and (max-width: 2160px) {
  .search-part {
    border-radius: 44px;
    .search-input {
      position: fixed;
      right: 480px;
      width: 972px;
      height: 88px;
      z-index: 2000;
      .inputContent {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        border-radius: 44px;
        border: 1px solid #e66579;
        // box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.16);
        // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        z-index: 2;
        background: #ffffff;
      }
      .search-input-inner {
        padding: 0;
        width: 970px;
        height: 88px;
        background: #ffffff;
        font-weight: 400;
        outline: none;
        text-indent: 95px;
        border: none;
        font-size: 32px;
        line-height: 88px;
        color: #000000; //rgba(66, 33, 11, 0.59);
        &::placeholder {
          font-size: 32px;
          font-weight: 400;
          color: #8b8b8b; //rgba(66, 33, 11, 0.59);
        }
      }
      .search-icon {
        position: absolute;
        top: 50%;
        left: 35px;
        transform: translateY(-50%);
        width: 43px;
        height: 43px;
        background: url("../../assets/images/details/search_icon_d.png")
          no-repeat center;
        background-size: cover;
      }
    }
  }

  .search-popper {
    width: 870px;
    max-height: 700px;
    background: #ffffff;
    top: 487px !important;
    left: 20px;
    // border: 1px solid #ddbc77;
    // box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.16);
    border-radius: 0 0 45px 45px;
    .search-result-list-container {
      width: 100%;
      max-height: 700px;
      .search-result-list-item {
        width: 768px;
        height: 45px;
        border-radius: 23px;
        margin: 10px auto;
        font-size: 23px;
        font-weight: 400;
        line-height: 45px;
        color: #000000; //rgba(66, 33, 11, 0.59);
        display: flex;
        justify-content: space-between;
        outline: none;
        border: none;
        span {
          &:nth-child(1) {
            max-width: 600px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .key-board {
    position: fixed;
    left: 55%;
  }
}

.key-board-modal {
  z-index: 1999;
}
</style>
