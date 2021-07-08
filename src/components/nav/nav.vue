<template>
    <div class="content">
     <div id="nav">
       <div class="nav-logo" ></div>
       <div class="nav-information">
        <Weather />
        <Time />
      </div>
    </div>
    
    
  </div>
</template>

<script>
import Time from "./time";
import Weather from "./weather";
export default {
  components: { Time, Weather },
};
</script>

<style scoped lang='less'>
@media screen and (min-width: 2161px) {
  #nav {
    position: fixed;
    width: 100%;
    top: 0px;
    display: flex;
    justify-content: space-between;
    z-index: 1;
   
    .nav-logo {
      margin-left: 85px;
      width: 288px;
      height: 279px;
      background: url("../../assets/images/nav/logo.png") no-repeat center;
      background-size: cover;
    }
    .nav-information {
      position: relative;
      margin-top: 40px;
      margin-right: 90px;
      width: auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
@media screen and (max-width: 2160px) {
   .content{
      position: fixed;
      width: 2160px;
      height: 205px;
      background: url("../../assets/images/nav/dingbubeijing.png") no-repeat center;
      background-size: cover;
      #nav {
        position: fixed;
        width: 100%;
        top: 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1;
        .nav-logo {
          margin-left: 110px;
          margin-top: 44px;
          width: 602px;
          height: 123px;
          background: url("../../assets/images/nav/logo.png") no-repeat center;
          background-size: cover;
        }
        .nav-information {
          position: relative;
          margin-top: 37px;
          margin-right: 180px;//70px;
          width: auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
     }
    }
  
}
</style>