<template>
  <div class="time-bar" >
    <span>{{ date }}</span>
    <span>{{ time }}</span>
  </div>
</template>

<script>
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
export default {
  data() {
    return {
      time: "",
      date: "",
    };
  },
  created() {
    dayjs.locale('zh-cn');
    this.calclateTime();
  },
  methods: {
    calclateTime() {
      setInterval(() => {
        this.time = dayjs().format("HH:mm");
        this.date = dayjs().format("YYYY/MM/DD");
      }, 1000);
    },
  },
};
</script>

<style scoped lang='less'>
.time-bar {
  height: 51px;
  line-height: 50px;
  font-size: 40px;
  font-weight: 400;//bold;
  line-height: 50px;
  color: #FFFFFF;
  span {
    &:nth-child(1) {
      margin-right: 20px;
      padding-right: 23px;
      border-right: 4px solid #FFFFFF;
    }
  }
}
</style>
