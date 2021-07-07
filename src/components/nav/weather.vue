<template>
  <div class="weather">
    <div
      class="weather-icon"
      :style="{ backgroundImage: `url(${logo})` }"
    ></div>
    <div class="weather-info">{{ weatherTemperature }}</div>
  </div>
</template>

<script>
import { getWeather } from "@/server/other";
export default {
  data() {
    return {
      weatherTemperature: "",
      logo: ""
    }
  },
  created() {
    this.getWeather();
  },
  methods: {
    async getWeather() {
      const weatherData = await getWeather()
      if (!weatherData) return;
      const { CurrentTemperature, weatherImg } = weatherData;
      this.weatherTemperature = CurrentTemperature;
      this.logo = `${MAP_CONFIG.LINE_URL}map/${weatherImg}`;

      setTimeout(() => {
        this.getWeather();
      }, 60000*MAP_CONFIG.WEATHER_UPDATE_TIME);//10分钟刷新一次天气数据
    }
  }
};
</script>

<style scoped lang='less'>
.weather {
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  padding-right: 10px;
  height: 51px;
  border-right: 4px solid #FFFFFF;
  .weather-icon {
    width: 60px;
    height: 50px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-right: 10px;
  }
  .weather-info {
    font-size: 40px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 50px;
    color: #FFFFFF;
    padding-right: 10px;
  }
}
</style>
