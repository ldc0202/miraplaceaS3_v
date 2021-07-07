<template>
  <div id="map" @click="mapClick">
    <div ref="container" id="mapContainer">
      <!-- 区块标识 -->
      <transition name="el-zoom-in-top">
        <MapTooltip
          v-if="areaInfo"
          :visible="mapToopTipVisible"
          :isFacitityNavigate="isFacitityNavigate"
          :areaInfo="areaInfo"
          :movePos="movePos"
          :addDis="addDis"
        />
      </transition>
    </div>
    <!-- 搜索栏 -->
    <Search
      class="map_search_bar"
      ref="searchRef"
      :noAnimate="false"
      type="map"
    />
    <!-- 寻车在地图页抬头 指引-->
    <NavCar
      class="map_car_bar"
      v-show="areaInfo && areaInfo.code == 'carport'"
    />
    <!-- 楼层切换部分 -->
    <FloorChange
      ref="floorBar"
      v-if="floorData.length > 0"
      :floorData="floorData"
      :pathData="pathData"
      @floorChange="floorChange"
    />
    <!-- 底部搜索最近设施等工具按钮 -->
    <MapTool
      ref="mapToolRef"
      :facilityList="facilityList"
      @navigate="isFacitityNavigate = true"
    />
    <!-- 导航信息展示部分 -->
    <NavigateBar
      ref="navigateBarRef"
      :isFacitityNavigate="isFacitityNavigate"
      :areaInfo="areaInfo"
      :pathData="pathData"
      :navigateWalkData="navigateWalkData"
    />
    <transition name="el-fade-in">
      <ActiveInfo
        v-if="currentActive"
        :activeInfoMsg="currentActive"
        @closeInfo="currentActive = null"
      />
    </transition>
  </div>
</template>

<script>
let endModel;
// let markers = [];
let mapData;
let ipcRenderer;
if (process.env.NODE_ENV != "development") {
  ipcRenderer = require("electron").ipcRenderer;
}
import { Message ,MessageBox} from "element-ui";
import { config } from "@/config/appConfig";
import { mapMutations, mapState } from "vuex";
import compareTime from "@/mixins/compareTime";
import Search from "@/components/search/search";
import NavCar from "@/components/nav/navCar";
import { getMallFunctioninfo } from "@/server/map";
import MapTool from "@/components/mapTool/mapTool";
import { debounce, useDeepCopy } from "@/utils";
import MapTooltip from "@/components/mapTool/mapTooltip";
import FloorChange from "@/components/mapTool/floorChange";
import NavigateBar from "@/components/mapTool/navigateBar";
import ActiveInfo from "@/components/activeInfo/activeInfo";
import { sendStatistics } from "@/server/other";
export default {
  mixins: [compareTime],
  data() {
    return {
      // 地图初始化配置
      config: {
        enabledControl: true, //是否启用手势操作
        container: "", //包装的div
        initFloorID: "", //初始楼层
        labelScale: 1.5, //文本缩放值
        isVue: true, //框架下需要填true
        embedTextTip: false,
        compassOffset: [10, 10, 0, 40], //指南针的位置和角度
        pathfinderWorkerURL: "static/js/pathfinderWorker.js",//配置寻路组件
        localResourcesPath:"static/OfflineData",

        accessToken: "BAF3CB32-E8F2-40A6-AE1A-A5BFE2CB6E14", //key 暂时不需要配置
        cloudID: "142D0800-9622-4A0B-BCA6-80673095FF5B",
        themeID: "1003", //地图主题文件夹ID号 String类型
        initCompleted: this.initCompleted, //初始化完成之后的调用函数
        onSelected: this.onSelected, //当区块被选中时触发
        isJavaServer: MAP_CONFIG.IS_JAVA_SERVE,
        debug: MAP_CONFIG.DEBUG_SWITCH,
        backgroundColor: MAP_CONFIG.MAP_BACKGROUND, //地图背景颜色
        showLabelType: MAP_CONFIG.SHOW_LABEL_TYPE, //默认显示店铺号，可以选
        crossBuild: MAP_CONFIG.CROSS_BUILDING, //是否跨建筑
        projectID: MAP_CONFIG.PID,
        buildingID: MAP_CONFIG.BUILDING_ID,
        backgroundAlpha: MAP_CONFIG.BACKGROUND_ALPHA, //地图背景色透明
        logoFiled: MAP_CONFIG.LOGO_FILED,
        preCreation: MAP_CONFIG.PRE_CREATION, //是否后台静默渲染 默认为true
        opacity: MAP_CONFIG.OPACITY, //块的透明度
        groundLayer: MAP_CONFIG.GROUND_LAYER, //是否设置地图底图 布尔值
        bgisSvg: MAP_CONFIG.GROUND_IS_SVG, // 底图是否是svg 布尔值
        showLabelLength: MAP_CONFIG.SHOW_LABEL_LENGTH, //显示文字的半径
        showImageLength: MAP_CONFIG.SHOW_IMAGE_LENGTH, //显示公共设施的半径
        server: `${MAP_CONFIG.BASE_URL}map/`, //接口服务地址
        showIDSDevice: true,// MAP_CONFIG.SHOW_IDS_DEVICE, //显示ids设备点位
        focusSelect: MAP_CONFIG.FOCUS_CENTER, //点击不剧中
        simulateRotate: MAP_CONFIG.SIMULATE_ROTATE,
        embedRobot: MAP_CONFIG.USE_MODEL,
        multiFloorView: MAP_CONFIG.MULTI_FLOOR_VIEW,
        simulateMove: MAP_CONFIG.SIMULATE_VIEW_MOVE,
        antialias: MAP_CONFIG.ANTIALIAS, // 关闭抗锯齿
        floor2Gap: MAP_CONFIG.FLOOR_2_GAP, //两层楼层间距
        floorMultiGap: MAP_CONFIG.FLOOR_MULTI_GAP, //多层楼层间距
        embedTextIcon: MAP_CONFIG.EmbedTextIcon, //地图icon
        oneStepLoad: true,//MAP_CONFIG.ONE_STEP_LOAD,//是否加载所有楼层
        localServer: !window.lineState, //true离线
        onWebglcontextlost:this.onWebglcontextlost, //捕获webgl丢失 通知保护程序
      },
      currentActive: null,
      // 品牌活动列表
      // brandActiveList: [],
      // 地图加载完毕
      isMapInit: false,
      // 路径下载完毕
      isPathDownInit: false,
      // 搜索结果数组
      searchResult: [],
      // 楼层数组
      floorData: [],
      // 当前楼层
      currentFloor: "",
      // 是否显示toopTip
      mapToopTipVisible: false,
      // 店铺信息
      shopInfo: {},
      // 是否显示店铺详情方块
      isShowShopInfo: false,
      // 店铺详情方块信息
      areaInfo: null,
      // 移动的区块3D转2D标记的标识
      moveID: "",
      // 移动距离
      movePos: null,
      // 路径数据
      pathData: null,
      //全程距离
      addDis:null,
      // 跨层寻路楼层列表
      crossFloorsList: [],
      // 是否设施导航
      isFacitityNavigate: false,
      // 是否寻车导航
      isCarNavigate: false,
      // 导航行径信息
      navigateWalkData: "",
      // 公共设施接口获取列表
      facilityList: [],
      // 保存数据
      saveData: {},
      // 保存移动数据
      saveMoveData: {},
      // 多层寻路信息
      multiData: {},
      devicePoint: {
        POSITION_NODEID: "",
        POSITION_FLOOR: "",
      },
    };
  },
  computed: {
    // 监听路由参数中的nodeID变化
    updateRouteNodeId() {
      return this.$route.params.nodeId;
    },
    // 监听路由名变化
    updateRouteName() {
      return this.$route.name;
    },
    ...mapState("home", {
      shopList: (state) => state.shopInfo,
      activeList: (state) => state.activeList,
    }),
    // 地图加载完成
    mapInit() {
      return {
        isMapInit: this.isMapInit,
        isPathDownInit: this.isPathDownInit,
      };
    },
  },
  mounted() {
    if (!window.lineState) {
      MapConfigX.getAreaTypeURL =
        "static/OfflineData/data/map_getAreaType.data";
      MapConfigX.getMapBuildingURL =
        "static/OfflineData/data/map_GetMapBuildingInfo.data";
      MapConfigX.getAreaURL = "static/OfflineData/data/map_getAreaInfo.data";
      MapConfigX.getPointURL = "static/OfflineData/data/map_getPointInfo.data";
    }
    MapConfigX.naviTipTypes = ["shop", "escalator", "lifts"]; //定义经过路线中的店铺、手扶梯、直梯。只有这里定义了 pathData
    // 初始化地图
    this.initMap();

    // 搜索框搜索结果点击寻路
    this.$EventBus.$on("searchEvent", async (data) => {
      endModel && endModel.recover();
      this.isFacitityNavigate = false;
      this.$router.push({ name: "Map" });
      // console.log("data.PointID=",data);
      this.serachPath(data);
      // map.selectByID(data.PointID || data.nodeId, true);
    });

    // 开启屏保 重置地图
    // this.$EventBus.$on("openScreenProtector", () => {
    //   this.resetMap();
    //   map.cleanSelectUnit3D();
    // });

    // 回到首页需要reset地图
    this.$EventBus.$on("gohome", () => {
      this.resetMap();
      map.cleanSelectUnit3D();
    });

    // 关闭地图块弹窗需要reset地图
    this.$EventBus.$on("resetMap", () => {
      this.resetMap();
      map.cleanSelectUnit3D();
    });

    //保存所有默认单楼层静态角度和单楼层寻路角度
    this.$EventBus.$on("sendDefaultFloorMessage", () => {
      const mapData = {
        CAMERA_RADIUS: map.cameraRadius,
        AZIMUTH_ANGLE: map.getAzimuthalAngle(),
        POLAR_ANGLE: map.getPolarAngle(),
        CENTER_POINT: map.getMapPosition(),
      };
      this.saveData["default"] = JSON.parse(JSON.stringify(mapData));
      Message.success({ message: "保存成功", offset: 1000 });
    });

    //保存单楼层静态角度和单楼层寻路角度
    this.$EventBus.$on("sendFloorMessage", () => {
      const mapData = {
        CAMERA_RADIUS: map.cameraRadius,
        AZIMUTH_ANGLE: map.getAzimuthalAngle(),
        POLAR_ANGLE: map.getPolarAngle(),
        CENTER_POINT: map.getMapPosition(),
      };
      if (this.pathData) {
        this.saveMoveData[`${this.currentFloor}move`] = JSON.parse(
          JSON.stringify(mapData)
        );
      } else {
        this.saveData[this.currentFloor] = JSON.parse(JSON.stringify(mapData));
      }
      Message.success({ message: "保存成功", offset: 1000 });
    });

    //保存多楼层数据
    this.$EventBus.$on("multiDataSave", () => {
      // 多层
      if (this.pathData && this.crossFloorsList.length > 1) {
        this.multiData.MORE_FLOOR_NAVIGATE_POLAR_ANGLE = `${map.getPolarAngle()}`;
        this.multiData.MORE_CAMERA_RADIUS = `${map.cameraRadius}`;
        this.multiData.MORE_AZIMUTH_ANGLE = `${map.getAzimuthalAngle()}`;
        this.multiData.MORE_CENTER_POINT = JSON.parse(
          JSON.stringify(map.getMapPosition())
        );
        Message.success({ message: "保存成功", offset: 1000 });
      }
    });
    // 保存当前数据
    this.$EventBus.$on("exportSaveFile", () => {
      let infomation = {};
      Object.assign(
        infomation,
        this.saveData,
        this.saveMoveData,
        this.multiData,
        this.devicePoint.POSITION_NODEID ? this.devicePoint : {}
      );
      ipcRenderer && ipcRenderer.send("exportSaveFile", infomation);
    });

    window.addEventListener("resize", () => {
      map.setSize(config.width, config.height);
    });
  },
  watch: {
    // 跳转路由nodeID存在的情况直接地图选中该区块
    updateRouteNodeId(nodeID) {
      nodeID &&
        map.selectByID(
          String(nodeID),
          true,
          String(this.$route.params.floorId)
        );
    },
    // 跳转路由不是Map路由的情况下直接重置地图
    updateRouteName: {
      handler: function (newRoute) {
        if (newRoute !== "Map") {
          this.resetMap();
          window.map && window.map.stopRender();
        } else {
          window.map && window.map.startRender();
          this.getfacilityList();
        }
      },
      immediate: true,
    },
    // 活动列表
    // activeList: {
    //   handler: function (list) {
    //     this.brandActiveList = useDeepCopy(list).reduce((previousValue, currentValue) => {
    //       const result = this.shopList.find(shop => shop.ShopID == currentValue.BrandID);
    //       if (currentValue.EventsType === "Brand" && result && currentValue.Poster && this.compareTime(currentValue)) {
    //         previousValue.push({
    //           ...currentValue,
    //           ...result,
    //           image: `${MAP_CONFIG.BASE_URL}map/${currentValue?.Poster}`
    //         })
    //       }
    //       return previousValue;
    //     }, []);
    //      this.addActiveMarkerInMap(this.brandActiveList);
    //   },
    //   immediate: true
    // },
    // 地图完成加载完毕
    mapInit({ isMapInit, isPathDownInit }) {
      if (isMapInit && isPathDownInit) {
        this.mapInitCompleted(mapData);
        // this.addActiveMarkerInMap(this.brandActiveList);
      }
    },
  },
  methods: {
    ...mapMutations("home", ["updateMapInitCompletedStatus"]),
    async getfacilityList() {
      const result = await getMallFunctioninfo();
      if (result) {
        this.facilityList = result.FunctionInfo.filter(
          (li) => li.Name != "楼梯"
        ).map((item) => ({
          ...item,
          Order: item.Name == "您在此" ? "0" : item.Order,
        }));
      }
    },
    // 初始化地图
    initMap() {
      this.config.container = this.$refs.container;
      window.map = new GIM.Map3D(this.config); // 初始化地图
      map.showCompass(false);
      // map.cameraRadius = _MAP_CONGIG_.CAMERA_RADIUS;
      // map.defaultCenterPoint = {
      //   x: Math.abs(_MAP_CONGIG_.CENTER_POINT.x),
      //   y: -Math.abs(_MAP_CONGIG_.CENTER_POINT.y)
      // };
      // map.setAzimuthalAngle(_MAP_CONGIG_.AZIMUTH_ANGLE);
      // map.setPolarAngle(_MAP_CONGIG_.POLAR_ANGLE);
      map.pathColor = MAP_CONFIG.PATH_COLOR;
      map.pathThickness = MAP_CONFIG.PATH_THICKNESS;
      map.maxCameraRadius = MAP_CONFIG.MAX_CAMERA_RADIUS;
      map.minCameraRadius = MAP_CONFIG.MIN_CAMERA_RADIUS;
      map.selectedColor = MAP_CONFIG.SELECT_NODE_COLOR;
      map.facilityScale = MAP_CONFIG.FACILITY_SCALE; //设施大小
      map.labelScale = MAP_CONFIG.LABEL_SCALE; //文字大小
      map.markerScale = MAP_CONFIG.MARKER_SCALE; //marker大小
      map.sysScale = MAP_CONFIG.SYS_SCALE; //终点起点标注大小
      map.locationMarkScale = MAP_CONFIG.LOCATION_MARKER_SCALE; //定位market大小
      map.setSize(config.width, config.height);
      map.pixelPerMeter = MAP_CONFIG.PIXEL_PERMETER;
      map.setViewMode(MAP_CONFIG.VIEW_MODE); //2D/3D显示模式
      map.simulateMoveSpeed = MAP_CONFIG.SIMULATE_MOVE_SPEED; //模拟导航速度值
      map.areaClickEmbed = MAP_CONFIG.AREA_CLICK_EMBED; //地图可否点击

      // 路径下载完成回调
      map.regPathDownloaded(() => {
        this.isPathDownInit = true;
      });
    },
    // 地图加载完成回调函数
    initCompleted(data) {
      this.isMapInit = true;
      mapData = data;
      map.hideTypeIcon("your location", true);
    },
    //捕获webgl丢失 通知保护程序
    onWebglcontextlost(){
      console.log("WebGL上下文丢失");
      // ipcRenderer &&
      // ipcRenderer.send("sendErrMessage", {
      //   type: "严重错误",
      //   message: "WebGL上下文丢失，强制关闭软件",
      // });
         ipcRenderer && ipcRenderer.send("onRelaunch");
    },
    // 地图加载完成事件
    mapInitCompleted(mapData) {
      // 地图初始化完成
      this.updateMapInitCompletedStatus(true);

      map.startPID = MAP_CONFIG.POSITION_NODEID;
      map.addMarkToPoint(MAP_CONFIG.POSITION_NODEID, "start", false);

      window.mapConfig = {
        // 楼层数据
        floorData: [],
        // 楼层ID与楼层名映射数组
        allFloorName: new Map(),
        // 楼层名与楼层order映射数组
        floorOrder: new Map(),
        // 起点楼层
        startFloorID: GIM.Points[MAP_CONFIG.POSITION_NODEID].FloorID,
      };

      // 拿到初始楼层
      this.currentFloor = window.mapConfig.startFloorID;

      this.moveMap();
      // 初始楼层
      map.showFloors([window.mapConfig.startFloorID]);

      // 拿到映射对象
      mapData.forEach((data) => {
        window.mapConfig.allFloorName.set(data.FloorID, data.Name);
        window.mapConfig.floorOrder.set(data.Name, data.Order);
      });

      mapData.forEach((floor) => {
        // 筛选楼层信息数组
        this.floorData.push({
          floorID: floor.FloorID,
          name: floor.Name,
          order: floor.Order,
          isActive: false,
          isPositionFloor: floor.FloorID == window.mapConfig.startFloorID,
        });
      });

      // 楼层信息数组翻转（看项目是否必须）
      window.mapConfig.floorData = this.floorData = this.floorData.reverse();

      map.regMarkerLocate((pinLocate) => {
        this.movePos = pinLocate[this.moveID];
      });

      // 静止暂停导航
      map.regNavigationPause(() => {
        map.toggleSimulate(true);
      });

      // 获取二维码
      this.$refs.navigateBarRef.getQrCodeUrl();

      // 模拟导航行动事件
      map.regNavigationWalk(({ textTipCount, pathFloorIndex }) => {
        this.navigateWalkData = `${textTipCount}-${pathFloorIndex}`;
      });

      // 模拟导航结束事件
      map.regNavigationComplete((msg) => {
        if (!MAP_CONFIG.SIMULATE_LOOP) return;
        setTimeout(() => {
          map.simulate();
          this.simulate();
        }, 1500);
      });
      setTimeout(() => {
        map.isCalcRenderSize = MAP_CONFIG.IS_CALCRENDER_SIZE; //是否不允许地图拖拽出去
      }, 3000);
    },
    // 地图点击事件
    onSelected(selArea) {
      // console.log(selArea);
        if (selArea.code.toLowerCase() == "your location") {
        // MessageBox.confirm("设置此点位为设备点位?, 是否继续?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning",
        // })
        //   .then(() => {})
        //   .catch(() => {});

        MessageBox.alert("是否将将此点位设置为设备点位?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",

          callback: (action) => {
            if (action == "confirm") {
              this.devicePoint = {
                POSITION_NODEID: selArea.nodeId,
                POSITION_FLOOR: selArea.floorID,
              };
              Message.success({
                message: "保存本地成功，还需点击保存数据自动重启",
                offset: 1000,
              });
            } else {
              this.devicePoint = {
                POSITION_NODEID: "",
                POSITION_FLOOR: "",
              };
            }
          },
        });
        return;
      }
      //防抖函数
      debounce(() => {
        // 点击活动
        // console.log("selArea.length=",selArea.length)
        if (selArea.length === 8) {
          const activeData = selArea[7];
          delete activeData.PointID;
          this.currentActive = activeData;
          return;
        }
        // 公共设施寻路
        if (
          this.facilityList.find(
            (facility) => facility.Name == selArea.areaTypeName
          )
        ) {
          this.isFacitityNavigate = true;
          sendStatistics("_map_clickarea", selArea.nodeId); //埋点
        } else {
          this.isFacitityNavigate = false;
          sendStatistics("_map_clickarea_shop", selArea.nodeId);
        }
        // 如果设施寻路不需要重置
        if (!this.isFacitityNavigate) {
          this.resetMap();
        } else {
          // this.moveMap();
          endModel && endModel.recover();
           this.resetMap();
        }
        this.serachPath(selArea);
      }, 0)();
    },
    // 重置地图
    resetMap(floorID) {
      // 重置楼层按钮
      this.$refs.floorBar?.resetFloorStyle();
      // 重置设施状态
      this.$refs.mapToolRef?.resetToolList();
      // 获取二维码
      this.$refs.navigateBarRef?.getQrCodeUrl();
      this.isShowShopInfo = false;
      this.isFacitityNavigate = false;
      this.areaInfo = null;
      this.mapToopTipVisible = false;
      this.isCarNavigate = false;
      let temp = []; //一个临时数组用来存储不重复的店铺
      if (this.pathData) {
        for (const key in this.pathData) {
          const path = this.pathData[key];
          path.routeDscription.forEach((route, index) => {
            //去除重复店铺名称
            if (temp.indexOf(route.nearPoi.PointID) == -1) {
              if (route.nearPoi) {
                //判断是直梯或者手扶梯 就闪烁图标
                if (
                  route.nearPoi.Code == "escalator" ||
                  route.nearPoi.Code == "lifts"
                ) {
                  //闪烁公共设施 开始或者停止
                  map.flickerTypeIcon(
                    route.nearPoi.PointID,
                    route.nearPoi.FloorID,
                    false
                  );
                } else if (route.nearPoi.Code == "shop") {
                  let model = map.getModelByID(route.nearPoi.PointID);
                  if (model && model.data) {
                    model.recover(); //恢复颜色
                  }
                  temp.push(route.nearPoi.PointID);
                }
              }
            }
          });
        }
        this.pathData = null;
      }
      this.crossFloorsList = [];
      map.restoreFacilityType();
      map.clearPath();
      map.clearEndArea();
      map.startPID = MAP_CONFIG.POSITION_NODEID;
      map.addMarkToPoint(MAP_CONFIG.POSITION_NODEID, "start", false);
      window.mapConfig &&
        map.showFloors([floorID || window.mapConfig.startFloorID]);
      this.navigateWalkData = "";
      this.currentFloor = floorID || window.mapConfig.startFloorID;
      // this.addActiveMarkerInMap(this.brandActiveList);
      endModel && endModel.recover();
      // setTimeout(() => {
      //   this.moveMap();
      // }, 500);
      if (!window.MAP_CONFIG.showDebug) {
        map.hideTypeIcon("your location", true);
      }
    },
    // 寻路
    serachPath(data) {
      // 非点击区块寻路 - 其他方式寻路
      if (data.PointID) {
        const nodeInfo = GIM.Points[data.PointID];
        if (!nodeInfo) return;
        // map.endNode.pointID = data.PointID;
        map.endPID = data.PointID;
        this.areaInfo = data;
        // map.addMarkToPoint(data.PointID, "end", false);
        this.moveID = data.PointID;
        map.regMarker(
          data.PointID,
          nodeInfo.FloorID,
          nodeInfo.x,
          nodeInfo.y,
          0
        );
        // 延时因为切换楼层是个异步操作 需要加一个定时器做异步处理来取到当前的model
        setTimeout(() => {
          endModel = map.getModelByID(data.PointID);
          endModel && endModel.setColor(MAP_CONFIG.SELECT_NODE_COLOR);
        }, 1000);
      } else if (data.nodeId) {
        // 点击区块寻路
        map.endPID = data.nodeId;
        this.areaInfo = data;
        // map.addMarkToPoint(data.nodeId, "end", false);
        // map.setEndArea(data.nodeId);
        this.moveID = data.nodeId;
        map.regMarker(
          data.nodeId,
          data.nodePosition.FloorID,
          data.nodePosition.x,
          -data.nodePosition.y,
          0
        );
        // 直接点击可以直接设置颜色
        endModel = map.getModelByID(data.nodeId);
        endModel && endModel.setColor(MAP_CONFIG.SELECT_NODE_COLOR);
      }
      //GIM.normalFirst="normal",GIM.liftFirst="liftsFirst",GIM.stairFirst="stairsFirst",GIM.escalatorFirst="escalatorsFirst",GIM.pathPriority=GIM.liftFirst
      let pathType = GIM.normalFirst;
      let startPos = map.getPositionByID(map.startPID);
      let endPos = map.getPositionByID(map.endPID);
      if (startPos && endPos ) 
      {
        let startFloor = map.getFloorByID(startPos.floorID); 
        let endFloor = map.getFloorByID(endPos.floorID); 
        let distance = Math.abs(startFloor.order - endFloor.order);//楼层间距
        if (distance == 1) {
          pathType = GIM.escalatorFirst;//1层 手扶梯优先  	
        }
        else if (distance >1) {
          pathType = GIM.liftFirst;//超过1层 电梯优先  	
        }
      }
      //重置按钮跳动
      if (this.areaInfo && this.areaInfo.code == "shop") {
        map.restoreFacilityType(); //停止跳动
        if (!window.MAP_CONFIG.showDebug) {
          map.hideTypeIcon("your location", true);
        }
      }
      let _data = data;
      map.searchPath((msg) => {
        if (msg.type == "done") {
          map.simulate();
          this.addDis = msg.dis;//全程距离
          this.pathData = msg.stepDetails;
          this.crossFloorsList = msg.floorIDs;
          // this.areaInfo = data;
          let tipVisible = true;
          let toolListNames =
            "楼梯 手扶梯 直梯 电梯 洗手间 无障碍洗手间 育婴室 客服中心"; //包含此 地图块类型的不需要显示地图落标弹窗
          tipVisible = toolListNames.indexOf(_data.areaTypeName) == -1;
          this.mapToopTipVisible = tipVisible;
          setTimeout(() => {
            this.simulate();
          }, 200);
        } else {
          // Message.error("寻路失败！");
          // console.log("寻路失败！");
          this.resetMap();
        }
      },pathType);
    },
    // 关闭search输入框pop
    mapClick() {
      // 键盘存在时不允许关闭
      if (document.querySelector(".key-board")) return;
      this.$refs.searchRef.closePop();
    },
    // 楼层改变
    floorChange(floorID) {
      if (floorID == this.currentFloor) {
        return;
      }
      this.currentFloor = floorID;
      // this.addActiveMarkerInMap(this.brandActiveList);
      // 切换楼层时如果不是起点终点楼层则隐藏块
      this.mapToopTipVisible = Boolean(
        this.crossFloorsList.find((floor) => floor == floorID)
      );
      sendStatistics("_map_changefloor", floorID); //埋点
    },
    // 模拟导航
    simulate() {
      if (this.crossFloorsList.length > 1) {
        //多楼层设置保存信息
        map.setPolarAngle(_MAP_CONGIG_.MORE_FLOOR_NAVIGATE_POLAR_ANGLE);
        map.setAzimuthalAngle(_MAP_CONGIG_.MORE_AZIMUTH_ANGLE);
        map.cameraRadius = _MAP_CONGIG_.MORE_CAMERA_RADIUS; //值越大地图就越小
        map.move2Point({
          x: Math.abs(_MAP_CONGIG_.MORE_CENTER_POINT.x),
          y: -Math.abs(_MAP_CONGIG_.MORE_CENTER_POINT.y),
        });
      } else {
        //单楼层设置
        this.pathMoveMap();
      }
    },
    // 活动marker置于地图
    // addActiveMarkerInMap(brandActiveList) {
    //   this.clearMarkers();
    //   if (brandActiveList.length === 0 || !this.isMapInit || !this.isPathDownInit) return;
    //   brandActiveList.forEach((item) => {
    //     this.addMarker(item);
    //   })
    // },
    // 新增标记
    // addMarker(data) {
    //   if (this.currentFloor != data.floor_id) return;
    //   const layer = map.getMarkerLayer(this.currentFloor);
    //   const marker = new GIM.ImageMarker(
    //     require("@/assets/images/home/brandActive.png"),
    //     GIM.Points[data.PointID].x,
    //     -GIM.Points[data.PointID].y,
    //     100,
    //     "",
    //     () => { },
    //     "",
    //     {
    //       ...data,
    //     }
    //   )

    //   layer.add(marker);
    //   markers.push(marker);
    // },
    // 清除标记
    // clearMarkers() {
    //   markers.forEach((marker) => {
    //     marker.dispose();
    //   });
    //   markers = [];
    // },
    // 移动地图
    moveMap() {
      if (!map) return;
      map.cameraRadius = _MAP_CONGIG_[this.currentFloor]
        ? _MAP_CONGIG_[this.currentFloor].CAMERA_RADIUS
        : _MAP_CONGIG_["default"].CAMERA_RADIUS;
      let tempPoints = {
        x: Math.abs(
          _MAP_CONGIG_[this.currentFloor]
            ? _MAP_CONGIG_[this.currentFloor].CENTER_POINT.x
            : _MAP_CONGIG_["default"].CENTER_POINT.x
        ),
        y: -Math.abs(
          _MAP_CONGIG_[this.currentFloor]
            ? _MAP_CONGIG_[this.currentFloor].CENTER_POINT.y
            : _MAP_CONGIG_["default"].CENTER_POINT.y
        ),
      };
      map.move2Point(tempPoints);
      map.setAzimuthalAngle(
        _MAP_CONGIG_[this.currentFloor]
          ? _MAP_CONGIG_[this.currentFloor].AZIMUTH_ANGLE
          : _MAP_CONGIG_["default"].AZIMUTH_ANGLE
      );
      map.setPolarAngle(
        _MAP_CONGIG_[this.currentFloor]
          ? _MAP_CONGIG_[this.currentFloor].POLAR_ANGLE
          : _MAP_CONGIG_["default"].POLAR_ANGLE
      );
    },
    // path多楼层移动
    pathMoveMap() {
      map.cameraRadius = _MAP_CONGIG_[`${this.currentFloor}move`]
        ? _MAP_CONGIG_[`${this.currentFloor}move`].CAMERA_RADIUS
        : _MAP_CONGIG_["default"].CAMERA_RADIUS;
      let move2Points = {
        x: Math.abs(
          _MAP_CONGIG_[`${this.currentFloor}move`]
            ? _MAP_CONGIG_[`${this.currentFloor}move`].CENTER_POINT.x
            : _MAP_CONGIG_["default"].CENTER_POINT.x
        ),
        y: -Math.abs(
          _MAP_CONGIG_[`${this.currentFloor}move`]
            ? _MAP_CONGIG_[`${this.currentFloor}move`].CENTER_POINT.y
            : _MAP_CONGIG_["default"].CENTER_POINT.y
        ),
      };
      map.move2Point(move2Points);
      map.setAzimuthalAngle(
        _MAP_CONGIG_[`${this.currentFloor}move`]
          ? _MAP_CONGIG_[`${this.currentFloor}move`].AZIMUTH_ANGLE
          : _MAP_CONGIG_["default"].AZIMUTH_ANGLE
      );
      map.setPolarAngle(
        _MAP_CONGIG_[`${this.currentFloor}move`]
          ? _MAP_CONGIG_[`${this.currentFloor}move`].POLAR_ANGLE
          : _MAP_CONGIG_["default"].POLAR_ANGLE
      );
    },
  },
  activated() {
    // console.log("调用了设置地图宽高");
    map.setSize(
      document.getElementById("mapContainer").offsetWidth,
      document.getElementById("mapContainer").offsetHeight
    );
  },
  components: {
    Search,
    MapTool,
    ActiveInfo,
    MapTooltip,
    NavigateBar,
    FloorChange,
    NavCar,
  },
  destroyed() {},
};
</script>

<style scoped lang="less">
@media screen and (min-width: 2161px) {
  #map {
    position: relative;
    width: 100%;
    height: 100%;
    #mapContainer {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .map_search_bar {
      position: absolute;
      // width: 972px;
      // height: 280px;
      top: 70px; //409px;
      left: 687px;
    }
    .map_car_bar {
      position: absolute;
      top: 320px;
      left: 2px;
    }
  }
}
@media screen and (max-width: 2160px) {
  #map {
    position: relative;
    width: 100%;
    height: 100%;
    #mapContainer {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;

      // left: 339px;
      // top: 297px;
      // width: 1751px;
      // height: 3340px;
      display: flex;
      flex-direction: column;
      align-items: center;
      // background-color: rgba(255, 255, 255, 0.7);
      // border-radius: 75px;
    }
    .map_search_bar {
      position: absolute;
      // width: 972px;
      // height: 280px;
      top: 70px; //409px;
      left: 687px;
    }
    .map_car_bar {
      position: absolute;
      top: 188px;
      left: 388px;
    }
  }
}
</style>
<style>
#mapContainer canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>