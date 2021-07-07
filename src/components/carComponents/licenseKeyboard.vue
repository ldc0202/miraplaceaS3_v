<template>
  <div class="licenseKeyboard">
    <div
      class="inputKeyboard"
      :class="['animated', showKeyType == 'numberKey' ? 'fadeIn' : '']"
      v-if="showKeyType == 'numberKey'"
    >
      <div class="letter">
        <div
          class="keyItem"
          v-for="item in letterData"
          :key="item.key"
          @click="numberKeydown(item)"
          :style="btnStyle"
        >
          {{ item.key }}
        </div>
      </div>
      <div class="number">
        <div
          class="keyItem"
          v-for="item in numData"
          :key="item.key"
          @click="numberKeydown(item)"
          :style="btnStyle"
        >
          {{ item.key }}
        </div>
      </div>
    </div>

    <div
      class="letterKeyboard"
      :class="['animated', { zoomIn: showKeyType == 'letterKey' }]"
      v-if="showKeyType == 'letterKey'"
    >
      <div class="letter">
        <div
          class="keyItem"
          v-for="item in letterData"
          :key="item.key"
          @click="letterKeydown(item)"
          :style="btnStyle"
        >
          {{ item.key }}
        </div>
      </div>
    </div>

    <div v-if="showKeyType == 'provinceKey'">
      <div
        class="provinceKeyboard"
        :class="['animated', { zoomIn: provinceType == 'province' }]"
        v-if="provinceType == 'province'"
      >
        <div
          class="keyItem"
          v-for="item in provinceData"
          :key="item.key"
          :class="[{ switchBtn: item.isSwitch }]"
          @click="provinceKeydown(item)"
          :style="btnStyle"
        >
          {{ item.key }}
        </div>
      </div>

      <div
        class="otherProvince"
        :class="['animated', { zoomIn: !provinceType }]"
        v-if="!provinceType"
      >
        <div
          class="keyItem"
          v-for="item in otherProvince"
          :key="item.key"
          :class="[{ switchBtn: item.isSwitch }]"
          @click="provinceKeydown(item)"
          :style="btnStyle"
        >
          {{ item.key }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showKeyType: String,
    textColor: {
      type: String,
      // 可选字段，有默认值
      default: "",
    },
    BtnBgColor: {
      type: String,
      // 可选字段，有默认值
      default: "",
    },
  },
  data() {
    return {
      provinceData: [
        {
          key: "鲁",
        },
        {
          key: "川",
        },
        {
          key: "鄂",
        },
        {
          key: "甘",
        },
        {
          key: "赣",
        },
        {
          key: "贵",
        },
        {
          key: "桂",
        },
        {
          key: "黑",
        },
        {
          key: "沪",
        },
        {
          key: "吉",
        },
        {
          key: "冀",
        },
        {
          key: "津",
        },
        {
          key: "晋",
        },
        {
          key: "京",
        },
        {
          key: "辽",
        },
        {
          key: "蒙",
        },
        {
          key: "闽",
        },
        {
          key: "宁",
        },
        {
          key: "青",
        },
        {
          key: "琼",
        },
        {
          key: "陕",
        },
        {
          key: "苏",
        },
        {
          key: "皖",
        },
        {
          key: "湘",
        },
        {
          key: "新",
        },
        {
          key: "渝",
        },
        {
          key: "豫",
        },
        {
          key: "粤",
        },
        {
          key: "云",
        },
        {
          key: "浙",
        },
        {
          key: "藏",
        },
        {
          key: "港",
        },
        {
          key: "澳",
        },
        {
          key: "台",
        },
        {
          key: "其他",
          isSwitch: true,
        },
      ],
      otherProvince: [
        {
          key: "WJ",
        },
        {
          key: "北",
        },
        {
          key: "边",
        },
        {
          key: "丙",
        },
        {
          key: "辰",
        },
        {
          key: "成",
        },
        {
          key: "电",
        },
        {
          key: "东",
        },
        {
          key: "庚",
        },
        {
          key: "公",
        },
        {
          key: "挂",
        },
        {
          key: "广",
        },
        {
          key: "海",
        },
        {
          key: "航",
        },
        {
          key: "已",
        },
        {
          key: "济",
        },
        {
          key: "甲",
        },
        {
          key: "金",
        },
        {
          key: "警",
        },
        {
          key: "军",
        },
        {
          key: "空",
        },
        {
          key: "兰",
        },
        {
          key: "民",
        },
        {
          key: "南",
        },
        {
          key: "黔",
        },
        {
          key: "壬",
        },
        {
          key: "森",
        },
        {
          key: "沈",
        },
        {
          key: "通",
        },
        {
          key: "未",
        },
        {
          key: "午",
        },
        {
          key: "消",
        },
        {
          key: "辛",
        },
        {
          key: "戌",
        },
        {
          key: "学",
        },
        {
          key: "乙",
        },
        {
          key: "寅",
        },
        {
          key: "民航",
        },
        {
          key: "其他",
          isSwitch: true,
        },
      ],
      letterData: [
        {
          key: "A",
        },
        {
          key: "B",
        },
        {
          key: "C",
        },
        {
          key: "D",
        },
        {
          key: "E",
        },
        {
          key: "F",
        },
        {
          key: "G",
        },
        {
          key: "H",
        },
        // {
        //   key: "I",
        // },
        {
          key: "J",
        },
        {
          key: "K ",
        },
        {
          key: "L",
        },
        {
          key: "M",
        },
        {
          key: "N",
        },
        // {
        //   key: "O",
        // },
        {
          key: "P",
        },
        {
          key: "Q",
        },
        {
          key: "R",
        },
        {
          key: "S",
        },
        {
          key: "T",
        },
        {
          key: "U",
        },
        {
          key: "V",
        },
        {
          key: "W",
        },
        {
          key: "X",
        },
        {
          key: "Y",
        },
        {
          key: "Z",
        },
      ],
      numData: [
        {
          key: "1",
        },
        {
          key: "2",
        },
        {
          key: "3",
        },
        {
          key: "4",
        },
        {
          key: "5",
        },
        {
          key: "6",
        },
        {
          key: "7",
        },
        {
          key: "8",
        },
        {
          key: "9",
        },
        {
          key: "港",
        },
        {
          key: "0",
        },
        {
          key: "澳",
        },
      ],

      provinceType: "province",
      btnStyle: "",
    };
  },
  computed: {},
  created() {},
  mounted() {
    if (this.textColor) {
      this.btnStyle = `color:${this.textColor};`;
    }
    if (this.BtnBgColor) {
      this.btnStyle = `background-color:${this.BtnBgColor};${this.btnStyle}`;
    }
  },
  watch: {},
  methods: {
    /**
     * 省份键盘按钮点击事件
     */
    provinceKeydown(item) {
      if (item.isSwitch) {
        this.provinceType = this.provinceType ? "" : "province";
      } else {
        this.$emit("provinceKeydown", item);
      }
    },
    /**
     * 字母键盘按钮点击事件
     */
    letterKeydown(item) {
      this.$emit("letterKeydown", item);
    },
    /**
     * 数字键盘按钮点击事件
     */
    numberKeydown(item) {
      this.$emit("numberKeydown", item);
    },
  },
  components: {},
};
</script>

<style lang='less'>
.licenseKeyboard {
  width: 100%;
  height: 100%;//546px;
  background-color: #fff;
  border-radius: 30px;
  .inputKeyboard { //主键盘 字母+数字
    // width: 1087px;
    width: 100%;
    height: 100%;//546px;
    background-color: #fff; 
    border-radius: 30px;
    box-sizing: border-box;
    padding: 80px;
    display: flex;
    justify-content:space-between;
    .letter {
      width: 895px;//615px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      // margin-right: 50px;
      .keyItem {
        &:nth-of-type(6n) {
          margin-right: 0;
        }
      }
    }
    .number {
      width: 441px;//293px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .keyItem {
        &:nth-of-type(3n) {
          margin-right: 0;
        }
      }
    }
  }
  .letterKeyboard {//省份输完后的 字母键盘
    width: 1390px;//1087px;
    height: 100%;//546px;
    background-color: #fff;
    border-radius: 30px;
    box-sizing: border-box;
    padding: 80px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    .letter {
      width: 895px;//615px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .keyItem {
        &:nth-of-type(6n) {
          margin-right: 0;
        }
      }
    }
  }
  .keyItem {
    width: 124px;//76px;
    height: 124px;//76px;
    background-color: #f0f0f0;
    border-radius: 50%;
    text-align: center;
    line-height: 124px;//76px;
    color: #000000;//#003e92;
    font-size: 50px;//32px;
    margin-right: 27px;
    margin-bottom: 27px;
  }
  .provinceKeyboard { //省份键盘
    width: 1390px;//1087px;
    height: 100%;
    border-radius: 30px;
    box-sizing: border-box;
    // padding: 80px;
    padding-top: 70px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0 auto;
    .keyItem {
      &:nth-of-type(9n) {
        margin-right: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .otherProvince { //其他键盘 特殊省份 WJ 民航
    width: 1500px;//1087px;
    height: 100%;
    border-radius: 30px;
    box-sizing: border-box;
    // padding: 80px 0;
     padding-top: 70px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0 auto;
    .keyItem {
      &:nth-of-type(10n) {
        margin-right: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .switchBtn {
    width: 270px;//179px;
    border-radius: 72px;//38px;
  }
}
</style>
