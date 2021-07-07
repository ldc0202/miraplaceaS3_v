<template>
  <!-- @touchstart="goMapTStart($event)" @touchend="goMapTEnd($event)" v-tap="{call: trigger}" -->
  <div class="brand-show-item animated fadeIn" @click="trigger"  v-if="isImageFlag">
    <el-image :src="brandData.image">
      <div slot="error" class="image-slot-item-brand"></div>
    </el-image>
    <div class="brand-show-item-info">
      <div class="brand_show_item_name">
        <el-image :src="brandData.logo" >
          <div slot="error" class="image-slot"></div>
        </el-image>
        <p class="pName">{{ brandData.Name | ellipsis }}</p>
      </div>
      <p class="pAreaName">
        <span></span><label>{{ brandData.AreaName }}</label>
      </p>
    </div>
    <div class="brand-show-item-navigate">
      <span></span>
    </div>
  </div>
</template>

<script>
import { Image } from "element-ui";
export default {
  props: {
    brandData: Object,
  },
  data() {
    return {
      tStartTime: 0, //记录之前触摸开始的时间
      isImageFlag:false,
    };
  },
  mounted(){
    setTimeout(()=>{
      this.isImageFlag = true;
    },600)
  },
  methods: {
    trigger() {
      this.$emit("trigger", this.brandData);
    },
    goMapTStart(event) {
      const date = new Date();
      this.tStartTime = date.getTime();
    },
    goMapTEnd(event) {
      const date = new Date();
      let disTime = date.getTime() - this.tStartTime;
      console.log("disTime=", disTime);
      if (disTime < 160) {
        this.trigger();
      }
    },
  },
  components: {
    [Image.name]: Image,
  },
  filters: {
    //定义过滤器  如果字符都是字母超过20 用...代替
    ellipsis(value) {
      if (!value) return "";
      var Regx = /^[A-Za-z0-9]*$/; //正则判断字符串是否为字母或数字
      var isletter = Regx.test(value);
      // console.log('isletter=',isletter);
      if (isletter) {
        if (value.length > 20) {
          return value.slice(0, 20) + "...";
        }
      } else {
        if (value.length > 11) {
          return value.slice(0, 11) + "...";
        }
      }
      return value;
    },
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px){
.brand-show-item {
  position: relative;
  // flex: 0 0 500px;
  // border: 1px solid #d5c9bd;
  width: 506px;
  height: 498px;
  background-color: rgb(255, 255, 255, 0.9);
  border-radius: 30px;//20px;
  margin-right: 34px;
  margin-bottom: 34px;
  // box-shadow: 0px 1px 20px rgba(230, 101, 121, 0.18);
  box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  &:nth-of-type(5n) {
    margin-right: 0;
  }
  .el-image {
    width: 466px;
    height: 350px;
    background: #ffffff;
    // box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.18);
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

  .brand-show-item-navigate {
    position: absolute;
    left: 380px;
    bottom: 25px;
    width: 82px;
    height: 82px;
    box-shadow: 0px 0px 50px #f3c7c4;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      width: 84px;
      height: 84px;
      background: url("../../assets/images/shop/shop_item_how_go.png") no-repeat
        center;
      background-size: cover;
    }
  }
}
}
@media screen and (max-width: 2160px){
  .brand-show-item {
  position: relative;
  // flex: 0 0 500px;
  // border: 1px solid #d5c9bd;
  width: 506px;
  height: 498px;
  background-color: rgb(255, 255, 255, 0.9);
  border-radius: 30px;//20px;
  margin-right: 34px;
  margin-bottom: 34px;
  // box-shadow: 0px 1px 20px rgba(230, 101, 121, 0.18);
  box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  // &:nth-of-type(5n) {
  //   margin-right: 0;
  // }
  .el-image {
    width: 466px;
    height: 350px;
    background: #ffffff;
    // box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.18);
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

  .brand-show-item-navigate {
    position: absolute;
    left: 380px;
    bottom: 25px;
    width: 82px;
    height: 82px;
    box-shadow: 0px 0px 50px #f3c7c4;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      width: 84px;
      height: 84px;
      background: url("../../assets/images/shop/shop_item_how_go.png") no-repeat
        center;
      background-size: cover;
    }
  }
}
}

</style>
