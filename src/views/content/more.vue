<template>
  <div class="more">
    <!-- <topBannerContent
      class="topBanner"
      :type="checkType == 'culture' ? 'culture' : 'more'"
    /> -->
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
    <!-- v-show="checkType != 'culture'" -->
    <container
      :checkImg="checkImg"
      :checkName="checkTitle"
      :checkType="checkType"
    >
      <div>
        <introduction
          v-if="checkType == 'introduction'"
          class="contentItemBox animated fadeIn"
        />
        <position
          v-if="checkType == 'position'"
          class="contentItemBox animated fadeIn"
        />
        <surrounding
          v-if="checkType == 'surrounding'"
          class="contentItemBox animated fadeIn"
        />
        <contact
          v-if="checkType == 'contact'"
          class="contentItemBox animated fadeIn"
        />
      </div>
    </container>
    <!-- <culture v-if="checkType == 'culture'" class="" /> -->
  </div>
</template>

<script>
import introduction from "@/components/more/introduction"; //项目介绍
import position from "@/components/more/position"; //位置交通
import surrounding from "@/components/more/surrounding"; //周边景点
import contact from "@/components/more/contact"; //联系我们
// import culture from "@/components/more/culture";
import container from "@/components/more/container"; //通用背景
import { sendStatistics } from "@/server/other";
// import topBannerContent from "@/components/topBanner/topBanner";
export default {
  props: {},
  data() {
    return {
      navData: [
        {
          name: "项目介绍",
          type: "introduction",
          isActive: true,
          img: require("../../assets/images/more/introduction.png"),
          title: "广州中华广场",
        },
        {
          name: "交通位置",
          type: "position",
          isActive: false,
          img: require("../../assets/images/more/position.png"),
          title: "",
        },
        {
          name: "周边景点",
          type: "surrounding",
          isActive: false,
          img: require("../../assets/images/more/surrounding.png"),
          title: "",
        },
        {
          name: "联系我们",
          type: "contact",
          isActive: false,
          img: require("../../assets/images/more/contact.png"),
          title: "",
        },
      ],
      checkName: "项目介绍",
      checkImg: "",
      checkType: "",
      checkTitle: "",
    };
  },
  computed: {},
  created() {},
  mounted() {
    if (!this.$route.query.menuTwo) {
      this.navData.forEach((item, index) => {
        item.isActive = false;
        if (index == 0) {
          item.isActive = true;
          this.checkType = item.type;
          this.checkName = item.name;
          this.checkImg = item.img;
          this.checkTitle = item.title;
        }
      });
      return;
    }
    this.navData.forEach((item) => {
      item.isActive = false;
      if (item.type == this.$route.query.menuTwo) {
        item.isActive = true;
        this.checkType = item.type;
        this.checkName = item.name;
        this.checkImg = item.img;
        this.checkTitle = item.title;
      }
    });
  },
  watch: {
    $route(to, from) {
      if (!this.$route.query.menuTwo) {
        this.navData.forEach((item, index) => {
          item.isActive = false;
          if (index == 0) {
            item.isActive = true;
            this.checkType = item.type;
            this.checkName = item.name;
            this.checkImg = item.img;
            this.checkTitle = item.title;
          }
        });
        return;
      }
      this.navData.forEach((item) => {
        item.isActive = false;
        if (item.type == this.$route.query.menuTwo) {
          item.isActive = true;
          this.checkType = item.type;
          this.checkName = item.name;
          this.checkImg = item.img;
          this.checkTitle = item.title;
        }
      });
    },
  },
  methods: {
    chickNav(clickNav) {
      this.checkName = clickNav.name;
      this.checkImg = clickNav.img;
      this.checkTitle = clickNav.title;
      let clickMark = {
        introduction:"_more_introduce_btn",
        position:"_more_project_btn",
        surrounding:"_more_view_btn",
        contact:"_more_traffic_btn",
        culture:"_more_curtain_btn"
      }
      if (clickNav.type) {
        sendStatistics(clickMark[clickNav.type]);
      }
      if (!clickNav.isActive) {
        this.navData.forEach((item, index) => {
          item.isActive = false;
        });
        clickNav.isActive = true;
        this.$router.push({
          path: this.$route.path,
          query: {
            menuTwo: clickNav.type,
            menuThree: clickNav.type,
            name: clickNav.name,
          },
        });
      }
    },
  },
  components: {
    introduction,
    position,
    surrounding,
    contact,
    container,
    // culture,
    // topBannerContent,
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .more {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .navBtn {
      z-index: 2;
      width: 1400px;
      height: 96px;
      background: #ffffff;
      // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 48px;
      display: flex;
      justify-content: center;
      margin: 76px auto 120px;
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
@media screen and (max-width: 2160px) {
  .more {
    // position: absolute;
    width: 100%;
    height: 100%;
    // top: 0;
    // left: 230px;
    // width: calc(100% - 230px);
    // .topBanner {
    //   margin: 322px auto 0;
    // }

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

    .navBtn {
      // width: 1395px;
      // height: 87px;
      // background-color: #ffffff;
      // box-shadow: 0px 0px 46px rgba(0, 0, 0, 0.1);
      // border-radius: 44px;
      // display: flex;
      // justify-content: center;
      // position: absolute;
      // top: 1062px;
      // left: calc(50%);
      // transform: translateX(-50%);
      z-index: 2;

      width: 1400px;
      height: 96px;
      background: #ffffff;
      // box-shadow: 0px 20px 50px rgba(230, 101, 121, 0.16);
      box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
      border-radius: 48px;
      display: flex;
      justify-content: center;
      margin: 254px auto 175px;
      .typeItem {
        // color: #42210b;
        // font-size: 32px;
        // width: 279px;
        // height: 87px;
        // text-align: center;
        // line-height: 87px;
        // background-color: #fff;
        // border-radius: 48px;
        // font-size: 32px;
        // font-weight: normal;

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
        // font-weight: bold;
        // background-color: #e6d1b1;

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
</style>
