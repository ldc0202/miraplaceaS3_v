<template>
  <div class="image-preview">
    <div class="image-preview-modal" @click="onClose"></div>
    <Swiper class="image-preview-swiper" :options="swiperOption">
      <SwiperSlide
        v-for="(image, index) in urlList"
        :key="index"
        :index="index"
      >
        <img :src="image" />
      </SwiperSlide>
    </Swiper>
    <span class="image-preview-close" @click="onClose"></span>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
export default {
  props: {
    onClose: {
      type: Function,
      default: () => { }
    },
    urlList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      swiperOption: {
        loop: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        roundLengths: true, //防止文字模糊
      }
    };
  },
  components: {
    Swiper,
    SwiperSlide
  },
};
</script>

<style scoped lang='less'>
.image-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .image-preview-modal {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .image-preview-swiper {
    max-width: 1500px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .image-preview-close {
    margin: 0 auto;
    margin-top: 50px;
    width: 88px;
    height: 88px;
    background: url("../../assets/images/movie/close.png") no-repeat center;
    background-size: cover;
    box-shadow: 0px 3px 60px rgba(203, 201, 201, 0.16);
  }
}
</style>
