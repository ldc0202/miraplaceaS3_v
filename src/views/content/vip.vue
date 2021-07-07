<template>
  <div class="vipPage">
    <!-- <transition name="el-fade-in">
      <div class="navBtnContainer" v-if="isInHome">
        <div
          v-for="item in navData"
          :key="item.type"
          class="navBtnItem"
          @click="chickNav(item)"
        >
          <img
            :src="item.isActive ? item.logoDown : item.logo"
            alt=""
            class="bgImg"
          />
          <div class="title" :class="[{ hasActived: item.isActive }]">
            {{ item.name }}
          </div>
        </div>
      </div>
    </transition> -->
    <!-- <transition name="el-fade-in"> -->
      <div class="vipPageContainer" v-if="!isInHome">
        <!-- <topBannerContent class="topBanner" :type="'vip'"/> -->
        <div class="navBtn">
          <div
            class="typeItem"
            :class="[{ isActiveTypeItem: item.isActive }]"
            @click="chickNav(item)"
            v-for="(item, index) in navData"
            :key="index"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="vipActiveContainer" v-if="checkType == 'activ'">
          <div class="animated fadeIn">
            <activContainer
              :renderBrands="renderBrands"
              @selectactiveInfo="selectactiveInfo"
            />
          </div>
          <transition name="el-fade-in">
            <activeInfo
              v-if="isShowActiveInfoMsg"
              :activeInfoMsg="activeInfoMsg"
              @closeInfo="isShowActiveInfoMsg = false"
            />
          </transition>
        </div>
        <vipLogoin
          v-if="checkType == 'logoin'"
          class="animated"
          :class="{ fadeIn: checkType == 'logoin' }"
        />
        <vipBanner v-if="checkType == 'vip'" />
      </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import activeInfo from "@/components/activeInfo/activeInfo";
import activContainer from "@/components/activeInfo/activeList";
import vipLogoin from "@/components/vipComponents/vipLogoin";
import vipBanner from "@/components/vipComponents/vipBanner";
import { getPjVipActivities } from "@/server/vip";
import { sendStatistics } from "@/server/other";
// import topBannerContent from "@/components/topBanner/topBanner";
export default {
  props: {},
  data() {
    return {
      navData: [
        {
          name: "登入会员",
          type: "logoin",
          // logo: require("../../assets/images/vip/logoin.png"),
          // logoDown: require("../../assets/images/vip/logoin_down.png"),
          isActive: true
        },
        {
          name: "会员权益",
          type: "vip",
          // logo: require("../../assets/images/vip/vip.png"),
          // logoDown: require("../../assets/images/vip/vip_down.png"),
          isActive: false
        }
      ],
      isInHome: false,
      checkType: "", //选择的类型
      renderBrands: [], //筛选后的活动数据
      activeData: [], //会员活动信息数据
      activeInfoMsg: {}, //活动信息详情
      isShowActiveInfoMsg: false //是否显示活动详情
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getData();
    // this.isInHome = !this.$route.query.menuThree;

    if (!this.$route.query.menuTwo) {
      this.navData.forEach((item, index) => {
        item.isActive = false;
        if (index == 0) {
          item.isActive = true;
          this.checkType = item.type;
          // this.isInHome = false;
        }
      });
      return;
    }
    this.navData.forEach(item => {
      item.isActive = false;
      if (item.type == this.$route.query.menuTwo) {
        item.isActive = true;
        this.checkType = item.type;
      }
    });
  },
  watch: {
    $route(to, from) {
      // this.isInHome = !this.$route.query.menuThree;
      if (!this.$route.query.menuTwo) {
        this.navData.forEach((item, index) => {
          item.isActive = false;
          if (index == 0) {
            item.isActive = true;
            this.checkType = item.type;
            // this.isInHome = false;
          }
        });
        return;
      }
      this.navData.forEach(item => {
        item.isActive = false;
        if (item.type == this.$route.query.menuTwo) {
          item.isActive = true;
          this.checkType = item.type;
        }
      });
    }
  },
  methods: {
    chickNav(item) {
      if (!item.isActive) {
        item.isActive = true;
        this.checkType = item.type;
        let clickMark = {
          logoin:"_member_register_btn",
          vip:"_member_equity_btn"
        }
        setTimeout(() => {
          this.$router.push({
            path: this.$route.path,
            query: { menuTwo: item.type, menuThree: item.type }
          });
        }, 100);
        if (item.type) {
          sendStatistics(clickMark[item.type])
        }
      } else {
        // if (this.isInHome) {
        //   this.navData.forEach((item, index) => {
        //     item.isActive = false;
        //     if (index == 0) {
        //       item.isActive = true;
        //       this.checkType = item.type;
        //       setTimeout(() => {
        //         this.$router.push({
        //           path: this.$route.path,
        //           query: { menuTwo: item.type, menuThree: item.type }
        //         });
        //       }, 100);
        //     }
        //   });
        // }
      }
    },
    selectactiveInfo(item) {
      this.selectActiveId = item.EventsID;
      this.activeInfoMsg = item;
      this.isShowActiveInfoMsg = true;
    },
    async getData() {
      this.renderBrands = [];
      const result = await getPjVipActivities();
      this.activeData = result;
      let selectData = [];
      selectData = result;
      this.renderBrands = this.spliceArr(selectData, 3);
    },
    //将数组切割成多少个
    spliceArr(arr, num) {
      let newArr = [];
      for (let i = 0, len = arr.length; i < len; i += num) {
        newArr.push(arr.slice(i, i + num));
      }
      return newArr;
    }
  },
  components: {
    activeInfo,
    activContainer,
    vipLogoin,
    vipBanner
    // topBannerContent,
  }
};
</script>

<style  lang='less'>
@media screen and (min-width: 2161px){
.vipPage {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .vipPageContainer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .navBtn {
      z-index: 9;
      width: 700px;
      height: 96px;
      background: #ffffff;
      // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 48px;
      display: flex;
      justify-content: center;
      margin: 76px auto;
      .typeItem {
        width: 350px;
        color: #000000;
        font-size: 40px;
        font-weight: normal;
        height: 96px;
        line-height: 96px;
        text-align: center;
        border-radius: 48px;
      }
      .isActiveTypeItem {
        width: 350px;
        height: 96px;
        // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
        // box-shadow: 0px 25px 50px #f3c7c4;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        border-radius: 48px;
        color: #ffffff;
      }
    }
  }
}
}
@media screen and (max-width: 2160px) {
.vipPage {
  width: 100%;
  height: 100%;
  // position: absolute;
  // top: 0;
  // left: 230px;
  // width: calc(100% - 230px);

  position: relative;
  // margin-top: 339px;
  // margin-left: 297px;
  // width: 1751px;
  // height: 3340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  // background-color: rgba(255, 255, 255, 0.7);
  // border-radius: 75px;

  // .navBtnContainer {
  //   display: flex;
  //   justify-content: center;
  //   margin-top: 575px;
  //   .navBtnItem {
  //     width: 381px;
  //     height: 480px;
  //     position: relative;
  //     margin: 0 140px;
  //     .bgImg {
  //       width: 515px;
  //       height: 648px;
  //       position: absolute;
  //       top: 50%;
  //       left: 50%;
  //       transform: translate(-50%, -50%);
  //       z-index: 0;
  //     }
  //     .title {
  //       position: absolute;
  //       top: 358px;
  //       left: 50%;
  //       transform: translateX(-50%);
  //       color: #003e92;
  //       font-size: 40px;
  //     }
  //     .hasActived {
  //       color: #fff;
  //       font-weight: bold;
  //     }
  //   }
  // }
  .vipPageContainer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // .topBanner {
    //   margin: 322px auto 0;
    // }
    .navBtn {
      // width: 560px;
      // height: 87px;
      // border-radius: 44px;
      // display: flex;
      // justify-content: center;
      // margin: 50px auto 0;
      // position: relative;
      // background-color: #fff;
      // box-shadow: 0px 0px 46px rgba(0, 0, 0, 0.1);
      z-index: 9;

      width: 700px;
      height: 96px;
      background: #ffffff;
      // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 48px;
      display: flex;
      justify-content: center;
      margin: 254px auto;
      .typeItem {
        // color: #42210b;
        // font-size: 32px;
        // font-weight: normal;
        // text-align: center;
        // width: 280px;
        // height: 87px;
        // line-height: 87px;
        // background-color: #fff;
        // border-radius: 44px;

        width: 350px;
        color: #000000;
        font-size: 40px;
        font-weight: normal;
        height: 96px;
        line-height: 96px;
        text-align: center;
        border-radius: 48px;
      }
      .isActiveTypeItem {
        // color: #fff;
        // background-color: #e6d1b1;
        // color: #42210b;
        // font-weight: bold;
        width: 350px;
        height: 96px;
        // background: linear-gradient(180deg, #eaba87 0%, #e65277 100%);
        // box-shadow: 0px 25px 50px #f3c7c4;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
        box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
        border-radius: 48px;
        color: #ffffff;
      }
    }
  }
}
}

</style>
