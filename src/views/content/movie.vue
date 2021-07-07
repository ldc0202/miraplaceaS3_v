<template>
  <div class="movie">
    <!-- movie banner -->
    <Swiper
      :swiperLists="adsList"
      type="movie"
      :style="{ width: '1750px', height: '690px' }"
    />
    <div class="move-menu-button-group animated fadeInDown">
      <span
        :class="[
          {
            'move-menu-button-active': item.isActive,
          },
        ]"
        v-for="(item, index) in menuList"
        :key="index"
        @click="changeMenu(item)"
        >{{ item.name }}</span
      >
    </div>
    <MovieListShow v-if="menuActive === '正在热映'" />
    <MovieIntroduceContainer
      v-show="menuActive === '影院介绍'"
      :checkImg="checkImg"
      :checkName="checkName"
    >
      <div class="MovieIntroduce animated fadeIn">
        CGV是国际化的专业连锁影院运营商及高端影院品牌
        。自从1998年第一家多厅影城开业以来 ， CGV 目前在中国大
        陆、中国香港、韩国、越南、美国、印度尼西亚、土耳其等国家和地区拥有几百家家高端影城
        。其优雅的形象和细
        致的服务赢得了越来越多的城市白领和年轻家庭的喜爱和赞誉。
        <br />
        CJ CGV 将复合文化空间 Cultureplex
        推广到全球的市场，其中在中国的发展速度最快 。自2006年进入中国市场后
        在50多个城市开设了100多家高端影院。在美国，2010年开业的CGV
        LA作为传播电影艺术的渠道，为顾客提供高端
        服务，受到了瞩目，2011年收购越南电影市场第一的企业“MEGASTAR”，开启了CJ
        CGV东南亚时代，未来计划将向 印度尼西亚缅甸土耳其俄罗斯印度等国家进军。
        <br />
        设计理念：CGV东莞店作为在东莞国贸店的首家旗舰店，包含12个影厅，近2024个座位、6款特效厅。IMAX巨幕厅
        让你体会到身临其境的观影享受； 4DX厅带来超越3D的生动五感体验；Screen
        X通过270度多面投影将荧幕扩展至
        两侧墙面实现多屏放映，为观众提供最大程度的投入感；GOLD
        CLASS厅引入飞机头等舱的设计概念，内设有舒适
        的席位和小桌，体现处处不在的细致服务
        。BUSINESS厅面向商务精英，不但保证舒适的观影体验 ，更为顾客提供
        高端私密的商务交流空间。更有为家庭观影用户打造的亲子观影空间CINE
        KIDS-星趣厅。
      </div>
    </MovieIntroduceContainer>
    <div class="goCinema" v-if="menuActive === '影院介绍'" @click="go2cinema">
      前往观影 <span></span>
    </div>
  </div>
</template>

<script>
import Swiper from "@/components/swiper/swiper";
import { mapState, mapActions } from "vuex";
import { GET_MOVIE_LIST } from "@/store/home/actionType";
import MovieListShow from "@/components/movie/movieListShow";
import MovieIntroduceContainer from "@/components/more/container";
import { sendStatistics } from "@/server/other";
export default {
  data() {
    return {
      menuList: [
        {
          name: "正在热映",
          isActive: true,
        },
        {
          name: "影院介绍",
          isActive: false,
        },
      ],
      menuActive: "正在热映",
      checkImg: "",
      checkName: "",
    };
  },
  async created() {
    await this.GET_MOVIE_LIST();
  },
  computed: {
    ...mapState("home", {
      adsList: (state) => state.adsList,
    }),
  },
  methods: {
    ...mapActions("home", [GET_MOVIE_LIST]),
    changeMenu(item) {
      if (item.isActive) return;
      sendStatistics(item.name=="正在热映"?"_film_showing_btn":"_film_presentation_btn");
      this.menuActive = item.name;
      this.menuList.forEach((menu) => {
        menu.isActive = false;
        if (menu.name === item.name) {
          menu.isActive = true;
        }
      });

      if (this.menuActive === "影院介绍") {
        this.checkName = "CGV影城";
        // this.checkImg = require("../../assets/images/movie/cinema.png");
      } else {
        this.checkName = "";
        this.checkImg = "";
      }
    },
    // 前往电影院
    go2cinema() {
      this.$EventBus.$emit("searchEvent", {
        AreaName: "L5008",
        Name: "CGV",
        PointID: "438291",
      });
      sendStatistics("_film_list_film_map_btn");
    },
  },
  components: {
    Swiper,
    MovieListShow,
    MovieIntroduceContainer,
  },
};
</script>

<style lang='less'>
@media screen and (min-width: 2161px){}
@media screen and (max-width: 2160px) {}
.movie {
  position: relative;
  width: calc(100% -230px);
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

  .banner-top-swiper {
    margin-top: 320px;
  }

  .move-menu-button-group {
    width: 560px;
    height: 87px;
    border-radius: 44px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    box-shadow: 0px 0px 46px rgba(0, 0, 0, 0.1);
    z-index: 9;
    margin-top: 50px;
    span {
      display: block;
      color: #42210b;
      font-size: 32px;
      font-weight: normal;
      text-align: center;
      width: 280px;
      height: 87px;
      line-height: 87px;
      background-color: #fff;
      border-radius: 44px;
      &.move-menu-button-active {
        color: #fff;
        background-color: #e6d1b1;
        color: #42210b;
        font-weight: bold;
      }
    }
  }

  .container {
    margin-top: 52px !important;
    color: #222321;
    font-size: 26px;
    line-height: 50px;
    letter-spacing: 5px;
  }
  .moreContainerBox .container .textContainer .checkName {
    margin-top: 115px;
  }
  .moreContainerBox .container .textContainer .contentImg {
    top: 250px;
  }
  .moreContainerBox {
    width: 100%;
    margin-left: 0;
  }
  .moreContainerBox .container {
    width: 1580px;
    .textContainer {
      width: 1580px;
    }
  }
  .moreContainerBox .container .imgContainer {
    width: 1580px;
  }
  .MovieIntroduce {
    font-size: 26px;
    color: #000000;
    font-weight: lighter;
    line-height: 58px;
    letter-spacing: -1.5px;
  }
  .goCinema {
    width: 220px;
    height: 50px;
    line-height: 50px;
    background-color: #ffffff;
    border: 1px solid #aa8d17;
    font-size: 32px;
    font-weight: 400;
    color: #b78931;
    border-radius: 25px;
    text-align: center;
    position: absolute;
    bottom: 390px;
    left: 50%;
    transform: translateX(-50%);
    span {
      display: inline-block;
      width: 13px;
      height: 17px;
      background: url("../../assets/images/movie/go2cinema.png") no-repeat
        center;
      background-size: cover;
      margin-left: 8px;
    }
    &:active {
      color: #ffffff;
      background: #aa8d17;
      span {
        background: url("../../assets/images/movie/go2cinemaDown.png") no-repeat
          center;
      }
    }
  }
}
</style>
