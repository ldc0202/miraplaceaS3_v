<template>
  <div class="map-tools-list">
    <div
      :class="[
        'facility-button',
        {
          'facility-button-seting': facility.name === '重置',
        },
      ]"
      v-for="(facility, index) in toolList"
      :key="index"
      @click="onQuick(facility)"
    >
      <el-image
        class="facility-logo"
        :src="facility.isActive ? facility.activeImage : facility.image"
        ><div slot="error" class="image-slot"></div>
      </el-image>
      <span>{{ facility.name }}</span>
    </div>
  </div>
</template>

<script>
import { Image } from "element-ui";
import { sendStatistics } from "@/server/other";
export default {
  props: {
    facilityList: Array
  },
  data() {
    return {
      toolList: []
    };
  },
  watch: {
    facilityList: {
      handler: function (list) {
        if (list.length === 0) return;
        this.getFacilityList(list)
      },
      immediate: true
    }
  },
  methods: {
    getFacilityList(list) {
      this.toolList = [...list].sort((item1, item2) => item1.Order - item2.Order).reduce((previousValue, currentValue) => {
        // 隐藏出入口
        if (MAP_CONFIG.HIDE_FACILITY_LIST.find(facility => facility === currentValue.Name)) return previousValue;

        previousValue.push({
          name: currentValue.Name,
          image: `${MAP_CONFIG.BASE_URL}map/${currentValue.data[0].downLogo}`,
          activeImage: `${MAP_CONFIG.BASE_URL}map/${currentValue.data[0].upLogo}`,
          data: currentValue.data,
          isActive: false
        })

        return previousValue;
      }, [])
      this.toolList.push({
        name: "重置",
        image: require("@/assets/images/home/toolList/reset.png"),
        data: [],
        isActive: false
      })
    },
    onQuick(item) {
      let toolListNames = {
        直梯: "_map_facility_lifts_btn",
        手扶梯: "_map_facility_escalator_btn",
        洗手间: "_map_facility_toilets_btn",
        您在此: "_map_facility_Yourlocation_btn",
        重置: "_map_reset_btn",
      };
      if (toolListNames[item.name]) {
        //埋点
        sendStatistics(toolListNames[item.name]);
      }
      if (item.name === '您在此' || item.name === '重置') {
        this.$parent.resetMap();
        this.$parent.moveMap();
        return;
      }
      this.setStyle(item);
      const toolListData = [...item.data];
      const nodePosition = map.getPositionByID(MAP_CONFIG.POSITION_NODEID); //我的位置获取x.y和floorID
      toolListData.forEach(data => {
        const fAdress = map.getPositionByID(data.PI);
        const a = nodePosition.x - fAdress.x;
        const b = nodePosition.y - fAdress.y;
        data.distance = Math.sqrt(a * a + b * b);
        data.addF = Math.abs(
          Number(fAdress.floorID) - Number(nodePosition.floorID)
        );
      });

      toolListData
        .sort((a, b) => a.distance - b.distance)
        .sort((a, b) => a.addF - b.addF);

      let tempPI = toolListData[0].PI;
      let mode = map.getModelByID(tempPI);
      let tempData = mode.data;
      let tempCode = tempData.code;
      map.flickerFacilityType(tempCode, () => {
          map.restoreFacilityType();
          if (!window.MAP_CONFIG.showDebug) {
            map.hideTypeIcon("your location", true);
          }
        });
      this.$emit("navigate");
      map.selectByID(toolListData[0].PI, true);
    },
    setStyle(item) {
      this.toolList.forEach(tool => {
        tool.isActive = false;
        if (tool.name === item.name) {
          tool.isActive = true;
        }
      })
    },
    resetToolList() {
      this.toolList.forEach(tool => {
        tool.isActive = false;
      })
    }
  },
  components: {
    [Image.name]: Image
  },
};
</script>

<style scoped lang='less'>
@media screen and (min-width: 2161px){
  .map-tools-list {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 83px;
  display: flex;
  align-items: center;
  justify-content: center;

  .facility-button {
    // cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 50px;
    background-color: transparent;
    border: none;
    &.facility-button-seting {
      margin-left: 125px;
    }

    .facility-logo {
      width: 80px;
      height: 80px;
      border: none;
    }

    & > span {
      white-space: nowrap;
      margin-top: 30px;
      font-size: 26px;
      font-weight: 300;
      line-height: 30px;
      color: #000000;
    }
  }
}
}
@media screen and (max-width: 2160px){
.map-tools-list {
  position: absolute;
  left: 56.5%;
  transform: translateX(-50%);
  bottom: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  .facility-button {
    // cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 50px;
    background-color: transparent;
    border: none;

    &.facility-button-seting {
      margin-left: 125px;
    }

    .facility-logo {
      width: 80px;
      height: 80px;
      border: none;
    }

    & > span {
      white-space: nowrap;
      margin-top: 30px;
      font-size: 26px;
      font-weight: 300;
      line-height: 30px;
      color: #000000;
    }
  }
}
}

</style>


