<template>
  <div class="parkingKeyboard">
    <div class="keyContainer" >
      <div
        class="keyItem"
        v-for="item in keys"
        :key="item.key"
        :ref="`refkeyContainer${item.key}`"
        :class="[{ delKey: item.isDel }]"
        @click="keyClick(item)"
        :style="btnStyle"
      >
        <span v-if="!item.isDel">{{ item.key }}</span>
        <img :src="item.icon" alt="" v-else />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
      keys: [
        {
          key: "B2",
        },
        {
          key: "B3",
        },
        {
          key: "B4",
        },
        {
          key: "删除",
          isDel: true,
          icon: require("../../assets/images/car/delet.png"),
        },
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
          key: "0",
        },
       
      ],
      btnStyle: "",
      btnOpacity:1,
    };
  },
  computed: {},
  created() {
    this.setDelStyle();
  },
  mounted() {
    this.setDelStyle();
  },
  watch: {
    
  },
  methods: {
    keyClick(key) {
      this.$emit("keyClick", key);
    },
    setDelStyle(){
      if (this.textColor) {
        this.btnStyle = `color:${this.textColor};`;
      }
      if (this.BtnBgColor) {
        this.btnStyle = `background-color:${this.BtnBgColor};${this.btnStyle}`;
      }
    },
    //灰色样式
    setDisStyle(key){
      let keyItem = this.$refs[ `refkeyContainer${key}`];
      if(keyItem[0] )
      {
       keyItem[0].style = `background-color:#DCDCDC;color:#808080;pointer-events:none;`
      }
    },
    //正常可点击样式
    setNorStyle(key){
     let keyItem = this.$refs[ `refkeyContainer${key}`];
      if(keyItem[0] )
      {
       keyItem[0].style = `background-color:#F0F0F0;color:#000000;pointer-events:auto;`
      }
    }
  },
  components: {},
};
</script>

<style lang='less'>
.parkingKeyboard {
  width: 100%;//965px;
  height: 100%;//472px;
  background-color: #fff;
  border-radius: 20px;//45px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .keyContainer {
    width: 970px;//1100px;//970px;//650px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    .keyItem {
      height: 124px;//82px;
      width: 124px;//82px;
      background-color: #f0f0f0;
      color: #000000;//#003e92;
      font-size: 50px;//32px;
      text-align: center;
      line-height: 124px;//82px;
      margin: 26px 29px;
      border-radius: 50%;//50px;
    }
    .delKey {
      width: 300px;//124px;//300px;//211px;
      border-radius: 60px;//50%;//72px;
      img{
          width: 60px;
          height: 43px;
          margin-bottom: -3px;
      }
    }
  }
}
</style>
