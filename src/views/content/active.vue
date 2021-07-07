<template>
  <div class="activePage">
    <!-- <topBannerContent class="topBanner" :type="'activity'" /> -->
    <div class="navBtn">
      <div
        class="typeItem"
        :class="[{ isActiveTypeItem: typeSelect == item.name }]"
        @click="toggleNav(item)"
        v-for="(item, index) in navType"
        :key="index"
      >
        {{ item.title }}
      </div>
    </div>
    <activContainer
      :renderBrands="renderBrands"
      :hasLoading="hasLoading"
      @selectactiveInfo="selectactiveInfo"
    />
    <transition name="el-fade-in">
      <activeInfo
        v-if="isShowActiveInfoMsg"
        :activeInfoMsg="activeInfoMsg"
        @closeInfo="isShowActiveInfoMsg = false;setSendStatistics()"
      />
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import activeInfo from "@/components/activeInfo/activeInfo";
import activContainer from "@/components/activeInfo/activeList";
import { getPjIdsActivities } from "@/server/active";
import { GET_ACTIVITY_INFO } from "@/store/home/actionType";
import dayjs from "dayjs";
import { sendStatistics } from "@/server/other";
// import topBannerContent from "@/components/topBanner/topBanner";
export default {
  props: {},
  data() {
    return {
      currentScreenType: 1, //当前是竖版还是横版 默认1竖版
      renderBrands: [], //筛选后的活动数据
      activeData: [], //活动信息数据
      typeSelect: "mall", //选中的筛选类型
      navType: [
        {
          title: "商场活动",
          name: "mall",
          isActive: true,
        },
        {
          title: "品牌活动",
          name: "brand",
          isActive: false,
        },
      ],
      activeInfoMsg: {}, //活动信息详情
      isShowActiveInfoMsg: false, //是否显示活动详情
      hasLoading: true,
    };
  },
  computed: {
    ...mapState("home", {
      activeList: (state) => state.activeList,
      shopInfo: (state) => state.shopInfo,
    }),
  },
  async created() {
    this.currentScreenType = MAP_CONFIG.SCREEN_TYPE;
    this.hasLoading = true;
    this.activeData = [];
    this.renderBrands = [];
    await this.GET_ACTIVITY_INFO();
  },
  mounted() {
    if (!this.$route.query.menuTwo) {
      this.navType.forEach((item, index) => {
        item.isActive = false;
        if (index == 0) {//默认 切换到 商场活动
          item.isActive = true;
          this.typeSelect = item.name;
        }
      });
    }
     this.getData();
  },
  watch: {
    typeSelect: function (val) {
      this.renderBrands = [];
      let selectData = [];
      //console.log("watch this.activeData=", this.activeData);
      this.activeData.forEach((element) => {
        if (element.EventsType && (this.typeSelect || val)) {
          if (
            this.typeSelect.toLowerCase() == element.EventsType.toLowerCase()
          ) {
            selectData.push(element);
          }
        }
      });
      //console.log("selectData111=", selectData);
      let cuttingLength = selectData.length;
      if(this.currentScreenType == 0)
      {
        cuttingLength = 8;//根据UI設計橫版最多顯示8個item
      }
      this.renderBrands = this.spliceArr(selectData, cuttingLength);
      //console.log("this.renderBrands111=", this.renderBrands);
    },
    $route(to, from) {
      // if (!this.$route.query.menuTwo) {
      //   this.navType.forEach((item, index) => {
      //     item.isActive = false;
      //     if (index == 0) {
      //       item.isActive = true;
      //       this.typeSelect = item.name;
      //     }
      //   });
        // return;
      // }
      this.navType.forEach((item) => {
        item.isActive = false;
        if (item.name == this.$route.query.menuTwo) {
          item.isActive = true;
          this.typeSelect = item.name;
        }
      });
    },
  },
  methods: {
    ...mapActions("home", [GET_ACTIVITY_INFO]),
    selectactiveInfo(item) {
      this.selectActiveId = item.EventsID;
      this.activeInfoMsg = item;
      this.isShowActiveInfoMsg = true;
      sendStatistics(this.typeSelect == "mall" ?"_event_mall_list_event" :"_event_brand_list_event",item.EventsID);
    },
    setSendStatistics(){
      //设置关闭埋点
      sendStatistics(this.typeSelect == "mall" ?"_event_mall_list_event_close_btn" :"_event_brand_list_event_close_btn")
    },
    async getData() {
      const result = await getPjIdsActivities();
      this.hasLoading = false;
      this.activeData = [];
      let selectData = [];
      this.shopInfo.forEach((shopItem) => {
        result.forEach((activeItem) => {
          if (activeItem.BrandID == shopItem.ShopID) {
            activeItem.PointID = shopItem.PointID;
            activeItem.shopInfo = shopItem;
          }
        });
      });
      result.forEach((element) => {
        if (this.compareDate(element)) {
          if (element.StartTime && element.OverTime) {
            if (this.compareTime(element)) {
              this.activeData.push(element);
              if (element.EventsType && this.typeSelect) {
                if (
                  this.typeSelect.toLowerCase() ==
                  element.EventsType.toLowerCase()
                ) {
                  selectData.push(element);
                }
              }
            }
          } else {
            this.activeData.push(element);
            if (element.EventsType && this.typeSelect) {
              if (
                this.typeSelect.toLowerCase() ==
                element.EventsType.toLowerCase()
              ) {
                selectData.push(element);
              }
            }
          }
        }
      });
      // console.log("getData this.activeData=", this.activeData);
      // console.log("getData selectData=", selectData);
      let cuttingLength = selectData.length;
      if(this.currentScreenType == 0)
      {
        cuttingLength = 8;//根据UI設計橫版最多顯示8個item
      }
      this.renderBrands = this.spliceArr(selectData, cuttingLength);
      //console.log("getData this.renderBrands=", this.renderBrands);
    },
    //将数组切割成多少个
    spliceArr(arr, num) {
      let newArr = [];
      for (let i = 0, len = arr.length; i < len; i += num) {
        newArr.push(arr.slice(i, i + num));
      }
      return newArr;
    },
    //判断当前时间是否在限定时间内
    compareTime(data) {
      const currentTime = ~~dayjs().format("HHmm");
      return (
        currentTime >= ~~data.StartTime.replace(":", "") &&
        currentTime <= ~~data.OverTime.replace(":", "")
      );
    },
    //判断当前日期是否在限定日期内
    compareDate(data) {
      const currentDate = ~~dayjs().format("YYYYMMDD");
      return (
        currentDate >= ~~data.PublishStartDate.replace(/-/g, "") &&
        currentDate <= ~~data.PublishOverDate.replace(/-/g, "")
      );
    },
    toggleNav(item) {
      if (!item.isActive) {
        this.typeSelect = item.name;
        this.$router.push({
          path: this.$route.path,
          query: { menuTwo: item.name },
        });
        sendStatistics(item.name == "mall" ?"_event_mall_btn" :"_event_brand_btn");
      }
    },
  },
  beforeDestroy() {
    this.hasLoading = true;
    this.activeData = [];
    this.renderBrands = [];
  },
  components: {
    activeInfo,
    activContainer,
    // topBannerContent,
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px) {
  .activePage {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    .navBtn {
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
@media screen and (max-width: 2160px) {
  .activePage {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    // .topBanner {
    //   margin: 322px auto 0;
    // }
    .navBtn {
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
        // font-weight: Bold;
      }
    }
  }
}
</style>
