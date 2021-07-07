<template>
  <div class="movie-buy-dialog">
    <div class="movie-discription">
      <el-image :src="data.image" class="animated fadeIn">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="movie-discription-info">
        <p class="animated fadeIn">{{ data.MovieName }}</p>
        <p class="animated fadeIn">上映时间: {{ data.Playtime }}</p>
        <p class="animated fadeIn">导演: {{ data.Director }}</p>
        <p class="animated fadeIn">主演: {{ data.Actor }}</p>
        <p class="animated fadeIn">类型: {{ data.Type }}</p>
        <p class="animated fadeIn">语言: {{ data.Lan }}</p>
        <p class="animated fadeIn">片长: {{ data.Runtime }} 分钟</p>
        <p>剧情介绍:</p>
        <swiper
          :class="['animated', 'fadeIn', 'movie-summary']"
          :options="swiperOption"
        >
          <swiper-slide style="height: auto">
            {{ data.Remark }}
          </swiper-slide>
          <div class="swiper-scrollbar" slot="scrollbar"></div>
        </swiper>
        <!-- <img
          src="../../assets/images/animat/rabbit2.png"
          class="pop-ups-movie-animation"
        /> -->
        <button class="go-cinema" @click="go2cinema">
          前往影院 <span></span>
        </button>
      </div>
    </div>
    <div class="buy-ticket-part">
      <Menu
        default-active="0"
        class="buy-ticket-menu"
        mode="horizontal"
        @select="menuSelect"
      >
        <MenuItem
          :index="index.toString()"
          v-for="(date, index) in menuList"
          :key="index"
        >
          <p>{{ date.day }}</p>
          <p>{{ date.date }}</p>
        </MenuItem>
      </Menu>
      <swiper
        :class="['animated', 'fadeIn', 'movie-ticket-info-list']"
        :options="swiperOption"
      >
        <swiper-slide style="height: auto" v-if="movieTicketList.length > 0">
          <div
            class="movie-ticket-info-item"
            v-for="(ticket, index) in movieTicketList"
            :key="index"
            @click="buyTicket(ticket)"
          >
            <span>
              <span>{{ ticket.time }}</span>
              <span>{{ ticket.endtime }}散场</span>
            </span>
            <span>
              <span>{{ ticket.version }}</span>
              <span>{{ ticket.Hall_name }}</span>
            </span>
            <span>￥{{ ticket.Price }}元</span>
            <button>购票</button>
          </div>
        </swiper-slide>
        <div class="movie-ticket-info-empty" v-else>暂无数据</div>
        <div class="swiper-scrollbar" slot="scrollbar"></div>
      </swiper>
    </div>
    <span class="close-dialog" @click="$emit('close');setSendStatistics('movie')"></span>
    <!-- 购票弹窗 -->
    <Dialog
      append-to-body
      :visible.sync="dialogVisible"
      custom-class="buy-ticket-dialog"
      :show-close="false"
      destroy-on-close
      top="0"
    >
      <div class="ticket-arcode-part">
        <div class="ticket-qrCode">
          <qrcode :value="buyTicketLink" :options="qrcodeOption" />
        </div>
        <p>请用支付宝，口碑扫码购票</p>
        <!-- <p>
          备注：如扫码出现账号出小差情况，请先登录支付宝“淘票票电影”小程序，再重新扫码购买，谢谢！
        </p> -->
        <span class="close-dialog" @click="dialogVisible = false;setSendStatistics('qrCode')"></span>
      </div>
    </Dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { Menu, Image, MenuItem, Dialog } from "element-ui";
import { sendStatistics } from "@/server/other";
export default {
  props: {
    data: Object
  },
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
        roundLengths: true, //防止文字模糊
      },
      menuList: [],
      movieTicketList: [],
      dialogVisible: false,
      qrcodeOption: {
        color: {
          dark: "#000",
          light: "#fff",
        },
      },
      buyTicketLink: "",
      buyTicketData:{}
    };
  },
  created() {
    this.getDateList()
  },
  methods: {
    // 获取近一个星期日期
    getDateList() {
      this.menuList = Array.from({
        length: 7
      }, () => 1).reduce((previousValue, currentValue, currentIndex) => {
        const cnDate = `${dayjs().add(currentIndex, "day").format("M")}月${dayjs().add(currentIndex, "day").format("D")}日`
        if (this.data.Schedules.find(schedule => schedule.date === cnDate)) {
          previousValue.push({
            day: currentIndex === 0 ? "今天" : currentIndex === 1 ? "明天" : dayjs().add(currentIndex, "day").format("dddd"),
            date: dayjs().add(currentIndex, "day").format("MM-DD"),
            cnDate
          })
          return previousValue;
        }
        return previousValue;
      }, [])
      this.getMovieTicketList(0);

    },
    // 获取所取日期电影票信息
    getMovieTicketList(index) {
      this.movieTicketList = this.data.Schedules.filter(schedule => {
        return schedule.date === this.menuList[index].cnDate
      });
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
    // 菜单日期选择
    menuSelect(index) {
      this.getMovieTicketList(index);
    },
    // 购票
    buyTicket(ticket) {
      this.dialogVisible = true;
      // console.log('ticket', ticket)
      this.buyTicketLink = ticket.TicketsQRImage;
      sendStatistics("_film_list_film_detail_ticket",this.data.MovieName,ticket.date,ticket.time);
      this.buyTicketData = ticket;
    },
    //设置埋点
    setSendStatistics(type){
      if (type=="qrCode") {
        sendStatistics("_film_list_film_detail_ticket_close_btn",this.data.MovieName,this.buyTicketData.Playtime,this.buyTicketData.time)
      }else{
        sendStatistics("_film_list_film_detail_close_btn",this.data.MovieName,this.data.Playtime)
      }
    }
  },
  destroyed() {
    this.dialogVisible = false;
  },
  components: {
    Menu,
    Dialog,
    MenuItem,
    [Image.name]: Image,
    [VueQrcode.name]: VueQrcode
  },
};
</script>

<style lang='less'>
.movie-buy-dialog {
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .movie-discription {
    width: 1365px;
    height: 465px;
    margin: 30px 0 50px 0;
    display: flex;
    align-items: center;

    .el-image {
      width: 325px;
      height: 465px;
      display: flex;
      border-radius: 12px;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .movie-discription-info {
      position: relative;
      flex: 1;
      height: 465px;
      margin-left: 75px;
      p {
        margin: 0;
        max-width: 920px;
        margin-top: 7px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 22px;
        font-weight: 400;
        color: #3f3a39;
        &:nth-child(1) {
          margin-top: 0px;
          height: 70px;
          line-height: 70px;
          font-size: 36px;
          font-weight: bold;
          color: #3f3a39;
        }
      }

      .movie-summary {
        margin-top: 7px;
        width: 960px;
        height: 135px;
        font-size: 22px;
        font-weight: 400;
        line-height: 32px;
        color: #3f3a39;

        .swiper-wrapper {
          margin: 0;
          width: 96%;
        }

        .swiper-scrollbar {
          top: 3% !important;
        }
      }

      .go-cinema {
        position: absolute;
        width: 218px;
        height: 48px;
        background: #ffffff;
        border: 1px solid #aa8d17;
        border-radius: 60px;
        right: 38px;
        top: 230px;
        font-size: 32px;
        font-weight: 400;
        line-height: 48px;
        color: #b78931;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        outline: none;
        transition: all 0.15s;

        &:active {
          color: #ffffff;
          background: #aa8d17;

          span {
            background-image: url("../../assets/images/active_button/go_cinema.png");
          }
        }

        span {
          width: 13px;
          height: 17px;
          background: url("../../assets/images/movie/go2cinema.png") no-repeat
            center;
          background-size: cover;
          margin-left: 8px;
        }
      }

      .pop-ups-movie-animation {
        position: absolute;
        width: 160px;
        height: 275px;
        right: -190px;
        top: 100px;
        z-index: 10;
        animation: pop-ups-movie-animation 5s infinite
          cubic-bezier(0.43, -0.04, 0.53, 1.03);
      }
    }
  }

  .buy-ticket-part {
    width: 1365px;
    height: 770px;
    display: flex;
    flex-direction: column;

    .buy-ticket-menu {
      width: 100%;
      display: flex;
      align-items: center;
      border: none;

      .el-menu-item {
        flex: 0 0 80px;
        height: 90px;
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 0;
        padding: 0;
        cursor: auto;
        
        & + .el-menu-item {
          margin-left: 129px;
        }

        p {
          width: 100%;
          margin: 0;
          text-align: left;
          font-size: 24px;
          font-weight: bold;
          color: #3f3a39;
          height: 31px;
          line-height: 31px;
          transition: all 0.35s;

          &:nth-child(2) {
            margin-top: 5px;
          }
        }

        &.is-active {
          border-bottom: 5px solid #b78931;
          p {
            color: #b78931;
          }
        }
      }
    }

    .movie-ticket-info-list {
      margin-top: 20px;
      width: 100%;
      flex: 1;

      .swiper-wrapper {
        width: 97%;
        margin: 0;
      }

      .swiper-scrollbar {
        height: 95%;
      }

      .movie-ticket-info-item {
        width: 100%;
        height: 89px;
        border-top: 1px solid #f2f2f2;
        display: flex;
        align-items: center;
        position: relative;

        &:last-child {
          border-bottom: 1px solid #f2f2f2;
          margin-bottom: 30px;
        }

        & > span {
          &:nth-child(1) {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-left: 5px;
            margin-right: 190px;
            span {
              &:nth-child(1) {
                font-size: 32px;
                font-weight: 400;
                color: #3f3a39;
              }
              &:nth-child(2) {
                font-size: 22px;
                font-weight: 400;
                color: #3f3a39;
              }
            }
          }

          &:nth-child(2) {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: left;
            justify-content: center;
            margin-right: 450px;
            span {
              &:nth-child(1) {
                font-size: 22px;
                font-weight: 400;
                color: #3f3a39;
              }
              &:nth-child(2) {
                font-size: 22px;
                font-weight: 400;
                color: #3f3a39;
              }
            }
          }

          &:nth-child(3) {
            position: absolute;
            right: 285px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 26px;
            font-weight: 400;
            color: #3f3a39;
          }
        }

        button {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 93px;
          height: 43px;
          background: #fff;
          border: 1px solid #aa8d17;
          border-radius: 100px;
          line-height: 43px;
          text-align: center;
          font-size: 24px;
          font-weight: 400;
          color: #b78931;
          outline: none;
          transition: all 0.15s;

          &:active {
            color: #ffffff;
            background: #aa8d17;
          }
        }
      }

      .movie-ticket-info-empty {
        width: 100%;
        height: 100%;
        font-size: 28px;
        font-weight: bold;
        color: #42210b;
        text-align: center;
        line-height: 660px;
      }
    }
  }
}

.close-dialog {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -150px;
  width: 88px;
  height: 88px;
  background: url("../../assets/images/movie/close.png") no-repeat center;
  background-size: cover;
  box-shadow: 0px 3px 60px rgba(203, 201, 201, 0.16);
}

.buy-ticket-dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 555px;
  box-shadow: none;
  margin: 0;

  background: transparent;

  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    width: 100%;
    height: 100%;
    padding: 0;
    background: transparent;
  }

  .ticket-arcode-part {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .ticket-qrCode {
      width: 315px;
      height: 385px;
      background: url("../../assets/images/movie/ticketCode.png") no-repeat
        center;
      background-size: contain;
      display: flex;
      justify-content: center;

      canvas {
        margin-top: 40px;
        width: 245px !important;
        height: 245px !important;
      }
    }

    p {
      margin: 0;
      margin-top: 20px;
      font-size: 26px;
      font-weight: 400;
      color: #ffffff;

      &:nth-child(3) {
        font-size: 22px;
        font-weight: 400;
        color: #dedcd8;
        text-align: center;
      }
    }
  }
}

@keyframes pop-ups-movie-animation {
  0% {
    transform: translateY(0px) rotate(8deg);
  }
  25% {
    transform: translateY(250px) rotate(0deg);
  }
  50% {
    transform: translateY(0px) rotate(8deg);
  }
  75% {
    transform: translateY(250px) rotate(0deg);
  }
  100% {
    transform: translateY(0px) rotate(8deg);
  }
}
</style>
