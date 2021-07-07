<template>
  <div class="topBannerContainer" >
    <Swiper :pagination="false" :swiperLists="adsList" :swiperStyle="swiperStyle" :type="type" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Swiper from "@/components/swiper/swiper";
export default {
  props: {
    type: {
      type: String,
      default: "banner",
    },
  },
  data() {
    return {
      swiperStyle: {
        width: "100%",
        height: "100%",
      },
    };
  },
  computed: {
    ...mapState("home", {
      adsList: (state) => state.adsList,
    }),
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: { Swiper },
};
</script>

<style lang='less'>
.topBannerContainer {
  width: 1750px;
  height: 690px;
  background-color: #ffffff;
  //   border: 1px solid #707070;
  border-radius: 60px;
}
</style>
