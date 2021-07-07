<template>
  <div class="parkingPage">
    <!-- <topBannerContent class="topBanner" :type="'car'" /> -->
    <!-- <transition name="el-fade-in">
      <div class="navBtnContainer" v-if="isInHome && hasPage">
        <div
          v-for="item in navData"
          :key="item.type"
          class="navBtnItem"
          @click="chickNav(item)"
        >
          <img
            src="../../assets/images/animat/rabbit1.png"
            alt=""
            class="hide-left-rabbit-animation"
            v-if="item.type == 'pay'"
          />
          <div class="navBtnItemContent">
            <img
              :src="item.isActive ? item.logoDown : item.logo"
              alt=""
              class="bgImg"
            />
            <img :src="item.icon" alt="" class="iconImg" />
            <div class="title" :class="[{ hasActived: item.isActive }]">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </transition> -->
    <!-- <transition name="el-fade-in">
      <nopage class="nopage" :tipText="'敬请期待'" v-if="!hasPage"/>
    </transition> -->
    <transition name="el-fade-in">
      <div class="vipPageContainer" v-if="!isInHome">
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
        <license v-if="checkType == 'license'" />
        <pay
          v-if="checkType == 'pay'"
          :class="['animated', { zoomIn: checkType == 'pay' }]"
        />
        <parking v-if="checkType == 'parking'" />
        <!-- <carFoot :class="['animated', 'zoomInDown']"/> -->
      </div>
    </transition>
    <div class="carImg animated bounceInRight" v-if="hasPage">
      <!-- <img src="../../assets/images/car/carImg.png" alt="" /> -->
    </div>
  </div>
</template>

<script>
import license from "@/components/carComponents/license";
import pay from "@/components/carComponents/pay";
import parking from "@/components/carComponents/parking";
// import carFoot from "@/components/carComponents/carFoot";
// import { getPjVipActivities } from "@/server/vip";
// import topBannerContent from "@/components/topBanner/topBanner";
// import nopage from "@/components/basePage/noPage";

export default {
  props: {},
  data() {
    return {
      navData: [
        // {
        //   name: "车牌寻车",
        //   type: "license",
        //   isActive: true,
        // },
        {
          name: "车位寻车",
          type: "parking",
          // logo: require("../../assets/images/car/parking.png"),
          // logoDown: require("../../assets/images/car/parking.png"),
          // icon: require("../../assets/images/car/parkingIcon.png"),
          isActive: true,
        },
        {
          name: "停车缴费",
          type: "pay",
          // logo: require("../../assets/images/car/pay.png"),
          // logoDown: require("../../assets/images/car/pay.png"),
          // icon: require("../../assets/images/car/payIcon.png"),
          isActive: false,
        },
      ],
      isInHome: false,
      hasPage: MAP_CONFIG.SEARCH_CARS_ONOFF, //是否隐藏敬请期待
      checkType: "", //选择的类型
    };
  },
  computed: {},
  created() {
   
  },
  mounted() {
    // this.isInHome = !this.$route.query.menuThree;
    if (!this.$route.query.menuTwo) {
      this.navData.forEach((item, index) => {
        item.isActive = false;
        if (index == 0) {
          item.isActive = true;
          this.checkType = item.type;
        }
      });
      return;
    }
    this.navData.forEach((item) => {
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
      // if (!this.$route.query.menuTwo) {
      //   this.navData.forEach((item, index) => {
      //     item.isActive = false;
          // if (index == 0) {
          //   item.isActive = true;
          // }
      //   });
      //   return;
      // }
      this.navData.forEach((item) => {
        item.isActive = false;
        if (item.type == this.$route.query.menuTwo) {
          item.isActive = true;
          this.checkType = item.type;
        }
      });
    },
  },
  methods: {
    chickNav(item) {
      if (!item.isActive) {
        item.isActive = true;
        this.checkType = item.type;
        setTimeout(() => {
          this.$router.push({
            path: this.$route.path,
            query: { menuTwo: item.type, menuThree: item.type },
          });
        }, 100);
      } else {
        if (this.isInHome) {
          this.navData.forEach((item, index) => {
            item.isActive = false;
            if (index == 0) {
              item.isActive = true;
              this.checkType = item.type;
              setTimeout(() => {
                this.$router.push({
                  path: this.$route.path,
                  query: { menuTwo: item.type, menuThree: item.type },
                });
              }, 100);
            }
          });
        }
      }
    },
    selectactiveInfo(item) {
      this.selectActiveId = item.EventsID;
      this.activeInfoMsg = item;
      this.isShowActiveInfoMsg = true;
    },
   
  },
  components: {
    license,
    pay,
    parking,
    // carFoot,
    // topBannerContent,
    // nopage
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px){
.parkingPage {
  width: 100%;
  height: 100%;
  position: absolute;
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
      width: 700px;//1050px;
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
  .carImg {
    width: 100%;
    height: 353px;
    position: absolute;
    bottom: 305px;
    text-align: center;
    img {
      height: 100%;
    }
  }
}
}
@media screen and (max-width: 2160px){
.parkingPage {
  width: 100%;
  height: 100%;
  position: absolute;
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
      width: 700px;//1050px;
      height: 96px;
      background: #ffffff;
      // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 48px;
      display: flex;
      justify-content: center;
      margin: 254px auto;
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
  .carImg {
    width: 100%;
    height: 353px;
    position: absolute;
    bottom: 305px;
    text-align: center;
    img {
      height: 100%;
    }
  }
}
}

</style>
