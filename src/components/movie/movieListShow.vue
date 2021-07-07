<template>
  <div class="movie-list-show">
    <swiper
      :class="['animated', 'fadeInUp', 'movie-list-show-swiper']"
      :options="swiperOption"
    >
      <swiper-slide class="movie-list-show-slide" v-if="movieList.length > 0">
        <MovieItem
          v-for="(movie, index) in movieList"
          :key="index"
          :movieData="movie"
          @trigger="movieSelect"
        />
      </swiper-slide>
      <div class="movie-list-show-empty" v-else>暂无数据</div>
      <div class="swiper-scrollbar" slot="scrollbar"></div>
    </swiper>
    <Dialog
      append-to-body
      :visible.sync="dialogVisible"
      custom-class="movie-buy-type-show"
      :show-close="false"
      close-on-click-modal
      destroy-on-close
    >
      <MovieBuyPart
        v-if="dialogVisible"
        :data="buyMovieData"
        @close="dialogVisible = false"
      />
    </Dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Dialog } from "element-ui";
import MovieItem from "./movieItem";
import MovieBuyPart from "./movieBuyPart";
import { sendStatistics } from "@/server/other";
export default {
  data() {
    return {
      swiperOption: {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true
        },
        mousewheel: true,
        autoHeight: true,
        roundLengths: true, //防止文字模糊
      },
      // 弹窗显隐控制
      dialogVisible: false,
      // 需要购票的电影的信息
      buyMovieData: ""
    };
  },
  computed: {
    ...mapState("home", {
      movieList: state => state.movieList
    }),
  },
  methods: {
    movieSelect(movie) {
       sendStatistics("_film_list_film",movie.MovieName);
      this.dialogVisible = true;
      this.buyMovieData = movie;
    }
  },
  destroyed() {
    this.dialogVisible = false;
  },
  components: {
    Dialog,
    MovieItem,
    MovieBuyPart
  },
};
</script>

<style lang='less'>
.movie-list-show {
  margin-top: 50px;
  height: 2335px;
  width: 1615px;

  .movie-list-show-swiper {
    width: 100%;
    height: 100%;

    .movie-list-show-slide {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
    }
  }

  .movie-list-show-empty {
    width: 100%;
    height: 100%;
    font-size: 32px;
    font-weight: 400;
    color: #42210b;
    text-align: center;
    line-height: 565px;
  }
}

.movie-buy-type-show {
  width: 1495px;
  height: 1315px;
  margin-top: 1230px !important;
  background: #ffffff;
  border: 1px solid #707070;
  opacity: 1;
  border-radius: 12px;

  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
