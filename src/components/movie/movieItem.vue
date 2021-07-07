<template>
  <div class="movie-list-show-item" @click="buyMovieTicket">
    <el-image :src="movieData.image" fit="cover">
      <div slot="error" class="image-slot"></div>
    </el-image>
    <p class="movie-list-show-item-name">{{ movieData.MovieName }}</p>
    <button class="buy-movie-ticket-button"><span></span>购票</button>
  </div>
</template>

<script>
import { Image } from "element-ui";
export default {
  props: {
    movieData: Object
  },
  methods: {
    buyMovieTicket() {
      this.$emit("trigger", this.movieData)
    }
  },
  components: {
    [Image.name]: Image,
  },
};
</script>

<style scoped lang='less'>
.movie-list-show-item {
  flex: 0 0 470px;
  height: 790px;
  background: #f8f1e7;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 65px;
  margin-bottom: 65px;
  border: 1px solid #d5c9bd;
  overflow: hidden;

  &:nth-child(3) {
    margin-right: 0px;
  }

  .el-image {
    width: 100%;
    height: 670px;
    display: flex;
    border-radius: 12px 12px 0 0;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border: none;
  }

  .movie-list-show-item-name {
    margin: 13px 0 14px 0;
    font-size: 26px;
    font-weight: 400;
    color: #3f3a39;
    text-align: center;
  }

  .buy-movie-ticket-button {
    width: 160px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #aa8d17;
    border-radius: 60px;
    font-size: 22px;
    font-weight: 400;
    line-height: 38px;
    color: #b78931;
    display: flex;
    justify-content: center;
    transition: all 0.15s;

    &:active {
      color: #ffffff;
      background: #aa8d17;

      span{
        background-image: url("../../assets/images/active_button/buy_ticket.png");
      }
    }

    span {
      width: 27px;
      height: 22px;
      background: url("../../assets/images/movie/buyTicket.png") no-repeat
        center;
      background-size: contain;
      margin-right: 13px;
      margin-top: 7px;
    }
  }
}
</style>
