<template>
  <div class="banner-today-food animated fadeIn">
    <div class="banner-today-food-content">
      <div class="banner-today-food-content-title">
        <span></span>
        今日美食
      </div>
      <Swiper :options="swiperOption">
        <SwiperSlide
          v-for="(slide, index) in hotFoodList"
          :key="index"
          :index="index"
        >
          <div class="banner-today-food-item" @click="go2brand(slide)">
            <el-image :src="slide.image" fit="cover">
              <div slot="error" class="image-slot"></div>
            </el-image>
            <el-image
              class="banner-today-food-item-detail"
              fit="cover"
              :src="slide.Logo"
            >
              <div slot="error" class="image-slot"></div>
            </el-image>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Image } from "element-ui";
import { useDeepCopy } from '@/utils';
import compareTime from "@/mixins/compareTime";
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { sendStatistics } from '@/server/other';
export default {
  props: {
    data: Array
  },
  mixins: [compareTime],
  data() {
    return {
      hotFoodList: [],
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
  computed: {
    ...mapState("home", {
      shopInfo: state => state.shopInfo,
      activeList: state => state.activeList,
    })
  },
  watch: {
    activeList(newList) {
      this.hotFoodList = useDeepCopy(newList).reduce((previousValue, currentValue) => {
        const result = this.shopInfo.find(shop => shop.ShopID == currentValue.BrandID);
        if (currentValue.EventsType === "hotFood" && this.compareTime(currentValue) && result && result?.Logo && result?.image) {
          previousValue.push({
            ...currentValue,
            ...result,
            Logo: `${MAP_CONFIG.BASE_URL}map/${result?.Logo}`,
            image: `${MAP_CONFIG.BASE_URL}map/${result?.image}`,
          })
        }
        return previousValue;
      }, []);
    }
  },
  methods: {
    go2brand(brand) {
      const endBrand = brand;
      endBrand.Logo = `..${endBrand.Logo.split("..")[1]}`;
      endBrand.image = `..${endBrand.image.split("..")[1]}`;
      this.$EventBus.$emit("searchEvent", endBrand);
       //埋点
      sendStatistics("_dine_bestshop_shop",endBrand.BrandID)
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    [Image.name]: Image,
  },
};
</script>

<style scoped lang='less'>
.banner-today-food {
  margin-top: 30px;
  width: 100%;
  height: 550px;
  background: #e6d1b1;
  border-radius: 60px;
  position: relative;
  .banner-today-food-content {
    width: 100%;
    height: 100%;
    background: #e6d1b1;
    border-radius: 60px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;

    .banner-today-food-content-title {
      width: 1645px;
      margin: 50px 0 30px 0;
      font-size: 36px;
      font-weight: bold;
      line-height: 47px;
      color: #42210b;
      display: flex;
      align-items: center;

      span {
        width: 40px;
        height: 40px;
        // background: url("../../assets/images/home/hot_food.png") no-repeat
        //   center;
        // background-size: cover;
        margin-right: 10px;
      }
    }

    .swiper-container {
      width: 1645px;
      height: 365px;

      .swiper-slide {
        width: 365px;
        height: 365px;
        border-radius: 24px;
        overflow: hidden;

        .banner-today-food-item,
        .el-image {
          position: relative;
          width: 100%;
          height: 100%;
          border: none;
        }

        .banner-today-food-item-detail {
          position: absolute;
          width: 120px;
          height: 150px;
          background: #ffffff;
          top: 0;
          left: 40px;
          border-radius: 0px 0px 10px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        & + .swiper-slide {
          margin-left: 60px;
        }
      }
    }
  }
}
</style>
