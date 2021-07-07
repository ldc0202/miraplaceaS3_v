<template>
  <div class="debug-part" v-handleDrag v-if="show">
    <i class="el-icon-close" @click="closeDialog"></i>
    <div class="tip">提示：重启才能保存成功</div>
    <button class="btn" @click="saveDefaultFloorMessage">保存默认所有楼层角度</button>
    <button class="btn" @click="saveFloorMessage">保存单楼层角度</button>
    <button class="btn" @click="saveFloorMessage">保存单楼层寻路角度</button>
    <button class="btn" @click="saveMoreFloorMessage">保存跨楼层寻路角度</button>
    <!-- <button class="btn" @click="savePositionID">设置点位ID</button> -->
    <button class="btn other" @click="allSave">保存数据自动重启</button>
    <button class="btn" @click="openDebug">开启debug模式</button>
    <button class="btn" @click="onQuit">关闭软件</button>
  </div>
</template>

<script>
import handleDrag from "../../directive/drag";

let ipcRenderer;
if (process.env.NODE_ENV != "development") {
  ipcRenderer = require("electron").ipcRenderer;
}

export default {
  directives: { handleDrag },
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    this.$EventBus.$on("openDebug", () => {
      map.hideTypeIcon("your location", false);
      window.MAP_CONFIG.showDebug = true;
      this.show = true;
    });
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      window.MAP_CONFIG.showDebug = false;
       map.hideTypeIcon("your location", true);
      this.show = false;
    },
     // 保存默认所有楼层角度
    saveDefaultFloorMessage(){
      this.$EventBus.$emit("sendDefaultFloorMessage");
    },
    // 保存单楼层寻路角度
    saveFloorMessage() {
      this.$EventBus.$emit("sendFloorMessage");
    },
    // 保存跨楼层寻路角度
    saveMoreFloorMessage() {
      this.$EventBus.$emit("multiDataSave");
    },
    // 全部保存
    allSave() {
      this.$EventBus.$emit("exportSaveFile");
    },
    // 打开调试模式
    openDebug() {
      ipcRenderer && ipcRenderer.send("openDevTool");
    },
    // 设置点位ID
    // savePositionID() {
    //    this.$EventBus.$emit("saveDevicePoint");
    // },
    /**关闭退出软件 */
     onQuit() {
      ipcRenderer && ipcRenderer.send("onQuit");
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.debug-part {
  position: absolute;
  left: 45%;
  top: 45%;
  width: 600px;
  height: 800px;
  background: #fff;
  box-shadow: 0 14px 28px rgba(232, 84, 0, 0.3);
  z-index: 10000;

  flex-wrap: wrap;
  border-radius: 16px;
  padding-top: 60px;
  box-sizing: border-box;
  .el-icon-close {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 100px;
  }
  .tip {
    color: red;
    font-size: 25px;
    text-align: center;
    line-height: 60px;
  }
  .btn {
    width: 300px;
    height: 60px;
    display: block;
    font-size: 25px;
    line-height: 60px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #ccc;
    margin-bottom: 30px;
    &.other {
      color: red;
    }
  }
}
</style>
