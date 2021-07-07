<template>
  <div class="floor-change-bar animated fadeInRight">
    <div
      :class="[
        'floor-button',
        {
          'is-active': floor.isActive,
          'is-end': floor.isEnd,
          'is-position-floor': floor.isPositionFloor,
        },
      ]"
      v-for="(floor, index) in floorData"
      :key="index"
      @click="changeFloor(floor)"
    >
      <div class="floor-name">{{ floor.name }}</div>
      <div class="floor-label" v-if="floor.isPositionFloor || floor.isEnd">
        {{ floor.isPositionFloor ? "您所在楼层" : "终点楼层" }}
      </div>
       <img
            class="CurrentFloorIcon"  v-if="floor.isPositionFloor"
            src="static/images/map/currentFloorIcon.png"
            alt=""
          />
      <img
            class="EndFloorIcon"  v-if="floor.isEnd"
            src="static/images/map/endFloorIcon .png"
            alt=""
          />  
    </div>
  </div>
</template>

<script>
export default {
  props: {
    floorData: {
      type: Array,
      required: true
    },
    pathData: Object
  },
  watch: {
    pathData(newPath) {
      if (!newPath || Object.keys(newPath).length === 0) {
        this.resetFloorStyle()
        return
      }
      const pathArray = Object.keys(newPath);
      if (pathArray.length > 1) {
        const endPath = newPath[pathArray[pathArray.length - 1]].floorID;
        this.floorData.forEach(item => {
          item.isEnd = false;
          if (item.floorID === endPath) {
            item.isEnd = true;
          }
        });
      }
    }
  },
  mounted() {
    if (map) {
      map.regFloorChange(floorIDs => {
        this.updateFloorStyle(floorIDs[0]);
      });
    }
  },
  methods: {
    // 切换楼层
    changeFloor(floor) {
      // 点击当前楼层和终点楼层不用处理
      if (floor.isActive || floor.isEnd) return;

      // 如果多层寻路的话直接重置地图
      if (this.pathData && Object.keys(this.pathData).length > 0) {
        this.$parent.resetMap(floor.floorID);
      } else {
        map.showFloors([floor.floorID]);
      }

      this.updateFloorStyle(floor.floorID);
      this.$emit("floorChange", floor.floorID);

      setTimeout(() => {
       this.$parent.moveMap();
      }, 500);
    },
    // 更新楼层按钮显示样式
    updateFloorStyle(floorID) {
      this.floorData.forEach(item => {
        item.isActive = false;
        if (item.floorID === floorID) {
          item.isActive = true;
        }
      });
    },
    resetFloorStyle() {
      this.floorData.forEach(item => {
        item.isEnd = false;
      });
    }
  },
};
</script>

<style scoped lang='less'>
@media screen and (min-width: 2161px){
.floor-change-bar {
  position: fixed;
  right: 0px;
  bottom: 180px;
  width: 110px;//120px;
  background:rgba(255, 255, 255, 0.9);
  box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
  border-radius: 60px 0 0 60px;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  .floor-button {
    width: 100%;
    display: flex;
    height: 107px;//100px;//120px;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    .floor-name {
      width: 75px;
      height: 107px;//75px;
      // border-radius: 50%;
      font-size: 38px;
      font-weight: 400;
      line-height: 107px;//75px;
      color: #000000;
      text-align: center;
      transition: all 0.5s;
    }
    .floor-label {
      margin-top: -31px;//10px;
      width: 100%;
      text-align: center;
      letter-spacing: 1px;
      transition: all 0.3s;
      color: #FFFFFF;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
    .CurrentFloorIcon{
      position: relative;
      top: -21px;
      left: -55px;
      width: 20px;
      height: 20px;
    }
    .EndFloorIcon{
      position: relative;
      top: -20px;
      left: -50px;
       width: 20px;
      height: 20px;
    }
    &.is-active {
      .floor-name {
        width: 139px;
        border-radius: 30px 0px 0px 30px;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
        color: #fff;
      }
    }
    &.is-end {
      .floor-name {
        width: 139px;
        border-radius: 30px 0px 0px 30px;
        color: #fff;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
      }
    }
    &.is-position-floor {
      .floor-name {
        width: 139px;
        border-radius: 30px 0px 0px 30px;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
        color: #fff;
      }
    }
  }
}
}
@media screen and (max-width: 2160px){
.floor-change-bar {
  position: fixed;
  right: 0px;
  bottom: 1000px;
  // transform:translateY(-50%);
  width: 112px;//120px;
  background:rgba(255, 255, 255, 0.9);
  // box-shadow: 0px 60px 50px #F3C7C4;
  box-shadow: 0px 2px 20px rgba(57, 6, 2, 0.3);
  border-radius: 60px 0 0 60px;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  .floor-button {
    width: 100%;
    display: flex;
    height: 107px;//120px;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    .floor-name {
      width: 75px;
      height: 107px;//75px;
      // border-radius: 50%;
      font-size: 38px;
      font-weight: 400;
      line-height: 107px;//75px;
      color: #000000;
      text-align: center;
      transition: all 0.5s;
    }
    .floor-label {
      margin-top: -31px;//10px;
      width: 100%;
      text-align: center;
      letter-spacing: 1px;
      transition: all 0.3s;
      color: #FFFFFF;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }
    .CurrentFloorIcon{
      position: relative;
      top: -20px;
      left: -55px;
      width: 20px;
      height: 20px;
    }
    .EndFloorIcon{
      position: relative;
      top: -20px;
      left: -50px;
      width: 20px;
      height: 20px;
    }
    &.is-active {
      .floor-name {
        width: 139px;
        border-radius: 30px 0px 0px 30px;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
        color: #fff;
      }
    }
    &.is-end {
      .floor-name {
        width: 139px;
        border-radius: 30px 0px 0px 30px;
        color: #fff;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
      }
    }
    &.is-position-floor {
      .floor-name {
        width: 139px;
        border-radius: 30px 0px 0px 30px;
        background: linear-gradient(180deg, #B795FC 0%, #F6406C 100%);
        color: #fff;
      }
    }
  }
}
}
</style>
