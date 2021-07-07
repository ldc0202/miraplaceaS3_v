<template>
  <div class="parking">
    <!-- <div class="title">请输入车位号</div> -->
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
    <div class="inputBox">
      <input
        type="text"
        class="input"
        placeholder="请输入车位号码"
        v-model="searchKey"
        maxlength="inputMaxLength"
      />
      <div class="searchBtn" @click="onSearchBtn"></div>
      <div class="clearBtn" v-if="searchKey" @click="clearSearchKey"></div>
    </div>
    <parkingKeyboard
      ref="parkingKeyBoardRef"
      class="keyboard"
      @keyClick="keyClick"
      :textColor="'#000000'"
      :BtnBgColor="'#F0F0F0'"
    />
  </div>
</template>

<script>
import parkingKeyboard from "@/components/carComponents/parkingKeyboard";
import { getAreaInfo } from "@/server/map";
import { Message } from "element-ui";
export default {
  props: {},
  created() {
    this.getAreaInfoList(); //获取所有地图数据
  },
  data() {
    return {
      newHandFlag: 0, //车位寻车步骤，默认从0开始
      searchKey: "",
      inputMaxLength: 4, //限制输入文字长度
      floorAreas: [], //所有地图块数据
    };
  },
  methods: {
    keyClick(key) {
      if (key.isDel) {
        this.searchKey = this.searchKey.substr(0, this.searchKey.length - 1);
      } else {
        if (this.searchKey.length < this.inputMaxLength) {
          let keyStr = String(key.key);
          if (keyStr.indexOf("B") != -1) {
            keyStr = keyStr.substring(keyStr.indexOf("B") + 1, keyStr.length);
          }
          this.searchKey = this.searchKey + "" + keyStr;
        }
      }
      this.searchCarPort(this.searchKey);
    },
    //清空输入框
    clearSearchKey() {
      this.searchKey = "";
      let parkingKeyBoard = this.$refs.parkingKeyBoardRef;
      if (parkingKeyBoard) {
        let numArr = [
          { name: "1", isEnable: false },
          { name: "2", isEnable: false },
          { name: "3", isEnable: false },
          { name: "4", isEnable: false },
          { name: "5", isEnable: false },
          { name: "6", isEnable: false },
          { name: "7", isEnable: false },
          { name: "8", isEnable: false },
          { name: "9", isEnable: false },
          { name: "0", isEnable: false },
        ];
        numArr.forEach((obj) => {
          parkingKeyBoard.setNorStyle(obj.name);
        });
        let floorArr = [
          { name: "B2", isEnable: false },
          { name: "B3", isEnable: false },
          { name: "B4", isEnable: false },
        ];
        floorArr.forEach((obj) => {
          parkingKeyBoard.setNorStyle(obj.name);
        });
      }
    },
    //点击了车位寻车按钮
    onSearchBtn() {
      var area = this.findArea();
      if (area && area.Code == MAP_CONFIG.CAR_PORT) {
        let parkingNum = area.Name;
        this.$EventBus.$emit("searchEvent", {
          PointID: area.PointID,
          code: MAP_CONFIG.CAR_PORT,
          name: parkingNum, //停车车位号
          areaTypeName: area.AreaTypeName, //停车位
        });
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
    //查找车位所在的地图块
    findArea() {
      let search_key = this.searchKey;
      if (this.floorAreas) {
        for (let i = 0; i < this.floorAreas.length; i++) {
          let item = this.floorAreas[i];
          if (item) {
            if (item.Name == search_key) {
              return item;
            }
          }
        }
      }
      return null;
    },
    //检索车位
    searchCarPort(key) {
      let numArr = [
        { name: "1", isEnable: false },
        { name: "2", isEnable: false },
        { name: "3", isEnable: false },
        { name: "4", isEnable: false },
        { name: "5", isEnable: false },
        { name: "6", isEnable: false },
        { name: "7", isEnable: false },
        { name: "8", isEnable: false },
        { name: "9", isEnable: false },
        { name: "0", isEnable: false },
      ];
      let floorArr = [
        { name: "B2", isEnable: false },
        { name: "B3", isEnable: false },
        { name: "B4", isEnable: false },
      ];
      let parkingKeyBoard = this.$refs.parkingKeyBoardRef;
      if (key.length == 1) {
        floorArr.forEach((obj) => {
          parkingKeyBoard.setDisStyle(obj.name);
        });
      } else if (key.length == 0) {
        floorArr.forEach((obj) => {
          parkingKeyBoard.setNorStyle(obj.name);
        });
         numArr.forEach((obj) => {
          parkingKeyBoard.setNorStyle(obj.name);
        });
      }
      if (key.length > 0) {
        for (let i = 0; i < this.floorAreas.length; i++) {
          let item = this.floorAreas[i];
          if (item) {
            let c = item.Name.substring(0, key.length);
            if (c == key) {
              let cur_name = item.Name.substring(key.length, key.length + 1);
              numArr.forEach((obj) => {
                if (obj.name == cur_name) {
                  obj.isEnable = true;
                }
              });
            }
          }
        }
        let isInputCom = true; //是否已经输入完毕车位号
        // console.log("numArr=", numArr);
        numArr.forEach((obj) => {
          if (obj.isEnable) {
            isInputCom = false;
            parkingKeyBoard.setNorStyle(obj.name);
          } else {
            parkingKeyBoard.setDisStyle(obj.name);
          }
        });
        //  console.log("isInputCom=", isInputCom);
        if (isInputCom) {
          this.onSearchBtn();
        }
      }
    },

    //获取所有地图数据
    getAreaInfoList() {
      const result = window.map?.originAreaData; //await getAreaInfo();
      if(result)
      {
        for (let i = 0; i < result.length; i++) {
          let floor = result[i];
          if (floor) {
            let areas = floor.Area;
            if (areas) {
              for (let j = 0; j < areas.length; j++) {
                let item = areas[j];
                if (item) {
                  if (item.Code == MAP_CONFIG.CAR_PORT) {
                    this.floorAreas.push(item);
                  }
                }
              }
            }
          }
        }
      }
    },
  },
  components: {
    parkingKeyboard,
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .parking {
    position: absolute;
    top: 224px;
    // left: 50%;
    // transform: translateX(-50%);
    width: 100%; //1281px;
    height: 1538px; //960px;
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
    .inputBox {
      width: 1590px; //975px;
      height: 101px; //88px;
      background: rgba(255, 255, 255, 0.9); //#ffffff;
      // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 44px;
      box-sizing: border-box;
      margin: 189px auto 108px; // 114px auto 156px;
      position: relative;
      .input {
        width: 1457px; //975px;
        height: 99px; //88px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: none;
        outline: none;
        color: #7f7673;
        box-sizing: border-box;
        background-color: transparent; //背景设置透明 #fff;
        font-size: 32px;
        font-weight: 400;
        color: #7f7673;
        &::placeholder {
          opacity: 0.56;
        }
      }
      .searchBtn {
        width: 250px; //133px;
        height: 101px; //88px;
        background: url("../../assets/images/car/search.png") no-repeat center
          center;
        background-size: 100% 100%;
        position: absolute;
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
        right: 260px; //142px;
        transform: translateY(-50%);
      }
    }
    .keyboard {
      width: 1590px; //1281px;
      height: 741px; //546px;
      background-color: rgba(255, 255, 255, 0.9); //#ffffff;
      // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 20px; //60px;
      margin: 0 auto;
    }
  }
}
@media screen and (max-width: 2160px) {
  .parking {
    position: absolute;
    top: 408px;
    // left: 50%;
    // transform: translateX(-50%);
    width: 100%; //1281px;
    height: 1538px; //960px;
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
        margin-top: -5px;
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
    .inputBox {
      width: 1590px; //975px;
      height: 101px; //88px;
      background: rgba(255, 255, 255, 0.9); //#ffffff;
      // border: 2px solid #ddbc77;
      // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 44px;
      box-sizing: border-box;
      margin: 456px auto;
      position: relative;
      .input {
        width: 1457px; //975px;
        height: 99px; //88px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        // border-radius: 44px;
        border: none;
        outline: none;
        color: #7f7673;
        // padding: 0 60px;
        // padding-right: 200px;
        box-sizing: border-box;
        background-color: transparent; //背景设置透明 #fff;
        font-size: 32px;
        font-weight: 400;
        color: #7f7673;
        &::placeholder {
          opacity: 0.56;
        }
      }
      .searchBtn {
        width: 250px; //133px;
        height: 101px; //88px;
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
        right: 260px; //142px;
        transform: translateY(-50%);
      }
    }
    .keyboard {
      width: 1590px; //1281px;
      height: 741px; //546px;
      background-color: rgba(255, 255, 255, 0.9); //#ffffff;
      // box-shadow: 0px 10px 20px rgba(230, 101, 121, 0.18);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 20px; //60px;
      margin: 0 auto;
    }
  }
}
</style>
