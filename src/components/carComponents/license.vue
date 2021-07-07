<template>
  <div class="license">
    <!-- <div class="title">请输入您的车牌号</div> -->
    <div class="newHand">
      <span class="newHandItem" :class="{ newHandOpacity: newHandFlag == 0 }">
        <span class="newHandFlag">①</span>
        <span class="newHandText"> 输入车牌号 </span>
        <span class="newHandArrow">→</span>
      </span>
      <span class="newHandItem" :class="{ newHandOpacity: newHandFlag == 1 }">
        <span class="newHandFlag">②</span>
        <span class="newHandText">查看车辆 </span>
        <span class="newHandArrow">→</span>
      </span>
      <span class="newHandItem" :class="{ newHandOpacity: newHandFlag == 2 }">
        <span class="newHandFlag">③</span>
        <span class="newHandText">线路指引 </span>
      </span>
    </div>
    <div class="inputBox" v-show="!isCheckCar">
      <input
        type="text"
        class="input"
        v-model="searchKey"
        @click="changeShowKeyTyp('numberKey')"
        placeholder="请输入车牌号码"
        maxlength="inputMaxLength"
      />
      <div class="searchBtn" @click="onSearchBtn"></div>
      <div class="clearBtn" v-if="searchKey" @click="searchKey = ''"></div>
      <div class="province" @click.stop="changeShowKeyTyp('provinceKey')">
        <span>{{ province }}</span>
        <span>{{ letter }}</span>
        <div class="selectIcon"></div>
      </div>
    </div>
    <licenseKeyboard
      @provinceKeydown="provinceKeydown"
      @letterKeydown="letterKeydown"
      @numberKeydown="numberKeydown"
      :showKeyType="showKeyType"
      class="keyboard"
      :textColor="'#42210B'"
      :BtnBgColor="'#F0F0F0'"
      v-show="!isCheckCar"
    />
    <div class="checkCar" v-if="isCheckCar">
      <swiper class="list" :options="swiperOption" v-if="carDatas.length > 0">
        <swiper-slide
          class="active_swiper_slide"
          v-for="(carData, i) in carDatas"
          :key="i"
        >
          <div
            class="listItem animated"
            @click="selectCarInfo(carData)"
          >
            <div
              class="item_logo"
              :style="{
                backgroundImage: `url(${imgServe}${carData.Poster})`,
              }"
              v-if="carData.Poster"
            ></div>
            <div class="item_logo image-slot" v-else></div>
            <div class="car_text_group">
              <label class="car_number">{{ carData.plateNumber }}</label>
              <div class="car_text_info_group">
                <label class="car_text">楼层：{{ carData.floor }}</label>
                <label class="car_text"
                  >分区：{{ carData.partition || "--" }}</label
                >
              </div>
              <div class="car_text_info_group">
                <label class="car_text"
                  >车位号：{{ carData.parkingNumber }}</label
                >
                <label class="car_text"
                  >停放时长：{{ carData.times || "--" }}</label
                >
              </div>
            </div>
            <div class="searchBtn" @click.self="selectCarInfo(carData)"></div>
          </div>
        </swiper-slide>
        <div class="swiper-scrollbar" slot="scrollbar"></div>
      </swiper>
      <nopage class="nopage" :tipText="'暂无数据'" v-else />
    </div>
  </div>
</template>

<script>
import licenseKeyboard from "@/components/carComponents/licenseKeyboard";
import nopage from "@/components/basePage/noPage";
import { Message } from "element-ui";
export default {
  props: {},
  data() {
    return {
      newHandFlag: 0, //车牌寻车步骤，默认从0开始
      carDatas: [], //车牌寻车后的所有车辆数据
      carTest: {
        PointID: 690690,
        code: "plate",
        name: "4321", //停车车位号
        parkingNumber: "4321", //停车车位号
        plateNumber: "粤A88888888",
        floor: "B4",
        partition: "A区",
        times: "15分钟",
      }, //测试数据
      isCheckCar: false, //是否是查看车辆页面
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: false
        },
        mousewheel: true,
        autoHeight: true,
        roundLengths: true //防止文字模糊
      },
      searchKey: "",
      showKeyType: "numberKey", //显示的键盘类型 numberKey:数字键盘;letterKey:字母键盘;provinceKey:省份键盘;
      province: "粤", //省份
      letter: "A", //字母
      inputMaxLength: 10, //限制输入文字长度
    };
  },
  computed: {},
  created() {
    this.isCheckCar = false;
    this.newHandFlag = 0;
  },
  mounted() {},
  watch: {},
  methods: {
    /**
     * 省份键盘点击事件
     */
    provinceKeydown(item) {
      this.province = item.key;
      this.changeShowKeyTyp("letterKey");
      this.searchKey = "";
    },
    /**
     * 字母键盘点击事件
     */
    letterKeydown(item) {
      this.letter = item.key;
      this.changeShowKeyTyp("numberKey");
    },
    /**
     * 数字键盘点击事件
     */
    numberKeydown(item) {
      if (this.searchKey.length < this.inputMaxLength) {
        this.searchKey = this.searchKey + "" + item.key;
      }
    },
    /**
     * 选择键盘类型
     */
    changeShowKeyTyp(type) {
      this.showKeyType = type;
    },
    //点击了车牌寻车按钮
    onSearchBtn() {
      this.carDatas = [];
      var plateNum = this.province + this.letter + this.searchKey;
      if (plateNum == "粤A88888888") {
        //测试数据
        this.carDatas.push(this.carTest);
        console.log("this.carDatas=",this.carDatas)
        this.isCheckCar = true;
        this.newHandFlag = 1;
      } else {
        this.searchKey = ""; //清空输入的车位号
        Message.warning({
          message: "未搜索到车位，请重试！",
          type: "info",
          center: true,
          offset: 1000,
        });
      }
    },
    //点击了单个车辆信息
    selectCarInfo(item) {
      this.$EventBus.$emit("searchEvent", item);
      this.isCheckCar = false;
      this.newHandFlag = 2;
    },
  },
  components: {
    licenseKeyboard,
    nopage,
  },
  filters: {
    //定义过滤器  如果字符都是字母超过20 用...代替
    ellipsis(value) {
      if (!value) return "";
      var Regx = /^[A-Za-z0-9]*$/; //正则判断字符串是否为字母或数字
      var isletter = Regx.test(value);
      // console.log('isletter=',isletter);
      if (isletter) {
        if (value.length > 15) {
          return value.slice(0, 15) + "...";
        }
      } else {
        if (value.length > 11) {
          return value.slice(0, 11) + "...";
        }
      }
      return value;
    }
  }
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px){
  .license {
  position: absolute;
  top: 224px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 1538px;
  .newHand {
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
      .newHandFlag {
        width: 52px;
        height: 37px;
        font-size: 32px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 37px;
        color: #e66579;
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
    }
    .newHandOpacity {
      opacity: 1;
    }
  }
  .inputBox {
    width: 1590px;
    height: 101px;
    background: rgba(255, 255, 255, 0.9);
    // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
    box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
    border-radius: 44px;
    box-sizing: border-box;
    margin: 189px auto 108px;
    position: relative;
    .input {
      width: 1077px;
      height: 99px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      // border-radius: 44px;
      border: none;
      outline: none;
      // padding: 0 220px;
      color: #7f7673;
      // padding-right: 200px;
      box-sizing: border-box;
      background-color: transparent; //背景设置透明
      font-size: 32px;
      font-weight: 400;
      &::placeholder {
        opacity: 0.56;
      }
    }
    .province {
      //粤
      position: absolute;
      width: 190px;
      height: 100%;
      left: 0;
      top: 0;
      box-sizing: border-box;
      padding-left: 56px;
      line-height: 99px;
      color: #3f3a39;
      font-size: 32px;
      &::after {
        //黑色竖线
        content: "";
        width: 2px;
        height: 64px;
        background-color: #3f3a39;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .selectIcon {
        //倒三角
        width: 20px;
        height: 17px;
        background: url("../../assets/images/car/selectIcon.png") no-repeat
          center center;
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 140px;
        transform: translateY(-50%);
      }
    }
    .searchBtn {
      width: 250px;
      height: 101px;
      background: url("../../assets/images/car/search.png") no-repeat center
        center;
      background-size: 100% 100%;
      position: absolute;
      // top: -2px;
      right: -3px;
    }
    .clearBtn {
      width: 37px;
      height: 37px;
      background: url("../../assets/images/car/clear.png") no-repeat center
        center;
      background-size: 100% 100%;
      position: absolute;
      top: 50%;
      right: 260px;
      transform: translateY(-50%);
    }
  }
  .keyboard {
    width: 1590px; //1281px;
    height: 741px; //546px;
    background-color: rgba(255, 255, 255, 0.9);
    // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
    box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
    border-radius: 20px;
    margin: 0 auto;
  }
  .checkCar {
    position: absolute;
    top: 80px;
    left: 83px;
    width: 1656px;
    height: 2800px;
    .nopage {
      margin-top: 708px;
    }
    .list {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .active_swiper_slide {
        width: 100%;
        height: 673px;
        display: flex;
        box-sizing: border-box;
        flex-wrap: wrap;
        &:last-of-type {
          //CSS伪类:last-of-type代表在一群兄弟元素中的最后一个指定类型的元素。这里表示最后一个元素外边距右边为0
          margin-right: 0;
        }
        .listItem {
          width: 786px;
          height: 673px;
          background-color: rgba(255, 255, 255, 0.9);
          // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
          box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
          border-radius: 20px;
          position: relative;
          margin-bottom: 18px; //50px;
          margin-right: 14px; //50px;
          box-sizing: border-box;
          display: flex;
          flex-flow: column;
          // align-items: center;
          &:nth-of-type(4n) {
            margin-right: 0px;
          }
          .item_logo {
            display: block;
            width: 746px;
            height: 418px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 26px;
            margin: 20px auto;
          }
          .image-slot {
            background-size: contain;
            background-image: url("../../assets/images/active/noImg.png");
          }
          .car_text_group {
            margin-top: 7px;
            margin-left: 64px;
            width: 565px;
            height: 167px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .car_number {
              width: 565px;
              height: 55px;
              font-size: 42px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              line-height: 35px;
              color: #e66579;
              text-align: left;
              margin-bottom: 27px;
              text-overflow: ellipsis;
            }
            .car_text_info_group {
              width: 565px;
              height: 85px;
              display: flex;
              justify-content: center;
            }
            .car_text {
              width: 280px;
              height: 37px;
              font-size: 28px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 26px;
              color: #000000;
              text-align: left;
              margin-bottom: 10px;
              text-overflow: ellipsis;
            }
          }
          .searchBtn {
            width: 82px;
            height: 82px;
            position: absolute;
            bottom: 55px;
            right: 50px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100%;
            // transition: all 0.2s linear;
            // border-radius: 40px;
            background-image: url("../../assets/images/active/search.png");
            &:active {
              background-image: url("../../assets/images/active/searchSelect.png");
            }
          }
        }
        .transparentItem {
          opacity: 0;
        }
      }
    }
    .shop-brand-show-empty {
      width: 100%;
      height: 100%;
      line-height: 900px;
      text-align: center;
      font-size: 36px;
      color: #42210b;
    }
  }
}
}
@media screen and (max-width: 2160px){
  .license {
  position: absolute;
  top: 408px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 1538px;
  // background: #f8f1e7;
  // border: 1px solid #d5c9bd;
  // border-radius: 60px;
  // .title {
  //   text-align: center;
  //   color: #3f3a39;
  //   font-size: 36px;
  //   margin-top: 104px;
  //   font-weight: bold;
  // }
  .newHand {
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
      .newHandFlag {
        width: 52px;
        height: 37px;
        font-size: 32px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 37px;
        color: #e66579;
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
    }
    .newHandOpacity {
      opacity: 1;
    }
  }
  .inputBox {
    width: 1590px;
    height: 101px;
    background: rgba(255, 255, 255, 0.9);
    // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
    box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
    border-radius: 44px;
    box-sizing: border-box;
    margin: 587px auto;
    position: relative;
    .input {
      width: 1077px;
      height: 99px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      // border-radius: 44px;
      border: none;
      outline: none;
      // padding: 0 220px;
      color: #7f7673;
      // padding-right: 200px;
      box-sizing: border-box;
      background-color: transparent; //背景设置透明
      font-size: 32px;
      font-weight: 400;
      &::placeholder {
        opacity: 0.56;
      }
    }
    .province {
      //粤
      position: absolute;
      width: 190px;
      height: 100%;
      left: 0;
      top: 0;
      box-sizing: border-box;
      padding-left: 56px;
      line-height: 99px;
      color: #3f3a39;
      font-size: 32px;
      &::after {
        //黑色竖线
        content: "";
        width: 2px;
        height: 64px;
        background-color: #3f3a39;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .selectIcon {
        //倒三角
        width: 20px;
        height: 17px;
        background: url("../../assets/images/car/selectIcon.png") no-repeat
          center center;
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 140px;
        transform: translateY(-50%);
      }
    }
    .searchBtn {
      width: 250px;
      height: 101px;
      background: url("../../assets/images/car/search.png") no-repeat center
        center;
      background-size: 100% 100%;
      position: absolute;
      // top: -2px;
      right: -3px;
    }
    .clearBtn {
      width: 37px;
      height: 37px;
      background: url("../../assets/images/car/clear.png") no-repeat center
        center;
      background-size: 100% 100%;
      position: absolute;
      top: 50%;
      right: 260px;
      transform: translateY(-50%);
    }
  }
  .keyboard {
    width: 1590px; //1281px;
    height: 741px; //546px;
    background-color: rgba(255, 255, 255, 0.9);
    // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
    box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
    border-radius: 20px;
    margin: 0 auto;
  }
  .checkCar {
    position: absolute;
    top: 80px;
    left: 83px;
    width: 1656px;
    height: 2800px;
    .nopage {
      margin-top: 708px;
    }
    .list {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .active_swiper_slide {
        width: 100%;
        height: 673px;
        display: flex;
        box-sizing: border-box;
        flex-wrap: wrap;
        &:last-of-type {
          //CSS伪类:last-of-type代表在一群兄弟元素中的最后一个指定类型的元素。这里表示最后一个元素外边距右边为0
          margin-right: 0;
        }
        .listItem {
          width: 786px;
          height: 673px;
          background-color: rgba(255, 255, 255, 0.9);
          // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
          box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
          border-radius: 20px;
          position: relative;
          margin-bottom: 18px; //50px;
          margin-right: 14px; //50px;
          box-sizing: border-box;
          display: flex;
          flex-flow: column;
          // align-items: center;
          &:nth-of-type(4n) {
            margin-right: 0px;
          }
          .item_logo {
            display: block;
            width: 746px;
            height: 418px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 26px;
            margin: 20px auto;
          }
          .image-slot {
            background-size: contain;
            background-image: url("../../assets/images/active/noImg.png");
          }
          .car_text_group {
            margin-top: 7px;
            margin-left: 64px;
            width: 565px;
            height: 167px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .car_number {
              width: 565px;
              height: 55px;
              font-size: 42px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              line-height: 35px;
              color: #e66579;
              text-align: left;
              margin-bottom: 27px;
              text-overflow: ellipsis;
            }
            .car_text_info_group {
              width: 565px;
              height: 85px;
              display: flex;
              justify-content: center;
            }
            .car_text {
              width: 280px;
              height: 37px;
              font-size: 28px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 26px;
              color: #000000;
              text-align: left;
              margin-bottom: 10px;
              text-overflow: ellipsis;
            }
          }
          .searchBtn {
            width: 82px;
            height: 82px;
            position: absolute;
            bottom: 55px;
            right: 50px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100%;
            // transition: all 0.2s linear;
            // border-radius: 40px;
            background-image: url("../../assets/images/active/search.png");
            &:active {
              background-image: url("../../assets/images/active/searchSelect.png");
            }
          }
        }
        .transparentItem {
          opacity: 0;
        }
      }
    }
    .shop-brand-show-empty {
      width: 100%;
      height: 100%;
      line-height: 900px;
      text-align: center;
      font-size: 36px;
      color: #42210b;
    }
  }
}
}

</style>
