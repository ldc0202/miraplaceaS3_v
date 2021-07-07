<template>
  <div class="banner-hot-activity">
    <div class="banner-hot-activity-content-title">
      <span></span>
      热门活动
    </div>
    <Swiper class="banner-hot-activity-swiper" :options="swiperOption">
      <SwiperSlide
        v-for="(slide, index) in hotActivityList"
        :key="index"
        :index="index"
      >
        <div class="banner-hot-activity-item" @click="currentActive = slide;setSendStatistics('_event_mall_list_event',slide.EventsID)">
          <el-image :src="slide.image" fit="cover">
            <div slot="error" class="image-slot"></div>
          </el-image>
          <div class="banner-hot-activity-item-title">{{ slide.Title }}</div>
        </div>
      </SwiperSlide>
    </Swiper>

    <transition name="el-fade-in">
      <ActiveInfo
        v-if="currentActive"
        :activeInfoMsg="currentActive"
        @closeInfo="currentActive = null;setSendStatistics('_event_mall_list_event_close_btn')"
      />
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Image } from "element-ui";
import { useDeepCopy } from '@/utils';
import compareTime from "@/mixins/compareTime";
import ActiveInfo from "../activeInfo/activeInfo";
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { sendStatistics } from '@/server/other';
export default {
  data() {
    return {
      hotActivityList: [],
      currentActive: null,
      swiperOption: {
        direction: 'horizontal',
        slidesPerView: 'auto',
        freeMode: true,
        roundLengths: true, //防止文字模糊
        allowSlideNext: false, //是否允许向前切换
        allowSlidePrev: false,//是否允许向后切换
      }
    };
  },
  mixins: [compareTime],
  computed: {
    ...mapState("home", {
      activeList: state => state.activeList,
    })
  },
  watch: {
    activeList(newList) {
      this.hotActivityList = useDeepCopy(newList).reduce((previousValue, currentValue) => {
        if (currentValue.EventsType === "hotActivity" && currentValue.Poster && this.compareTime(currentValue)) {
          previousValue.push({
            ...currentValue,
            image: `${MAP_CONFIG.BASE_URL}map/${currentValue?.Poster}`
          })
        }
        return previousValue;
      }, []);
    }
  },
  methods:{
    // 埋点
    setSendStatistics(clickMark,parameter1=''){
      sendStatistics(clickMark,parameter1)
    }
  },
  components: {
    Swiper,
    ActiveInfo,
    SwiperSlide,
    [Image.name]: Image,
  },
};
</script>

<style scoped lang='less'>
.banner-hot-activity {
  width: 2070px;
  height: 585px;
  background: #e6d1b1;
  border-radius: 0px 60px 60px 0px;
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .banner-hot-activity-content-title {
    width: 1870px;
    margin: 55px 0 30px 0;
    font-size: 36px;
    font-weight: bold;
    line-height: 47px;
    color: #42210b;
    display: flex;
    align-items: center;

    span {
      width: 40px;
      height: 40px;
      // background: url("../../assets/images/home/hot_activity .png") no-repeat
      //   center;
      // background-size: cover;
      margin-right: 10px;
    }
  }

  .banner-hot-activity-swiper {
    width: 1870px;
    height: 395px;

    .swiper-slide {
      position: relative;
      width: 555px;
      height: 395px;
      border-radius: 24px;
      overflow: hidden;

      .banner-hot-activity-item,
      .el-image {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .banner-hot-activity-item-title {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 95px;
        background: rgba(63, 58, 57, 0.87);
        line-height: 95px;
        font-size: 26px;
        font-weight: 400;
        color: #ffffff;
        text-indent: 30px;
      }

      & + .swiper-slide {
        margin-left: 100px;
      }
    }
  }
}
</style>
