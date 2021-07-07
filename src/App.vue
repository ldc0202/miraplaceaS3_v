<template>
  <div id="app">
    <!-- debug弹窗 -->
    <DebugDialog />
    <!-- 权限系统验证 -->
    <div class="no-authorization-tip" v-if="isNoAuthorization">
      <div class="no_authorization_tip_info"
        v-if="!authorizationTipHasClick" @click="authorizationTipHasClick = true"
      >
        <span>Windows  故障警告</span>
        <p>系统错误，请联系软件服务商。</p>
      </div>
    </div>
    <div class="no_author_10_waring" v-if="isNoAuth10Waring">
      <p class="no_author_10_waring_text">
          系统有故障风险，可能会影响正常使用,请联系软件服务商!
      </p>
      <span class="no_author_10_waring_close" @click="clickNoAuth10Waring">X</span>
    </div>
    <div class="tempRect" @click="clickRect()"></div>
    <!-- 路由页 -->
    <router-view />
  </div>
</template>

<script>
import { Loading } from "element-ui";
import { mapState, mapActions } from "vuex";
import { DecryptForAuthorizationCode, judgementWinSystem } from "./utils/index.js";
import { GET_PROJECT_SHOP_INFO, GET_MOVIE_LIST, GET_BANNER_LIST, GET_ACTIVITY_INFO } from './store/home/actionType';
import DebugDialog from "./components/debugDialog/index";
let ipcRenderer;
if (process.env.NODE_ENV != "development") {
  ipcRenderer = require("electron").ipcRenderer;
}

// let loadingInstance;
import dayjs from "dayjs";
export default {
  data() {
    return {
      isNoAuthorization: false,
      authorizationTipHasClick: false,
      isWin10: true,
      clickNum: 0,
      isNoAuth10Waring:false,
      noAuth10WaringClickNum:0,
    }
  },
  errorCaptured(err) {
    ipcRenderer &&
      ipcRenderer.send("sendErrMessage", {
        type: "代码错误",
        message: err.stack,
      });
  },
  components:{
    DebugDialog
  },
  async created() {
    this.isWin10 = judgementWinSystem();

    // 权限验证
    this.judgementAuthorization();

    // loadingInstance = Loading.service({
    //   text: `Loading... ${MAP_CONFIG.APP_VERSION}`,
    // });

    // this.$loading();
    this.$loading().textLoading = `Loading... ${MAP_CONFIG.APP_VERSION}`;
    // 获取商铺数据
    await this.GET_PROJECT_SHOP_INFO();
    // 获取电影列表
    await this.GET_MOVIE_LIST();
    // 获取广告列表
    await this.GET_BANNER_LIST();
    // 获取活动列表
    await this.GET_ACTIVITY_INFO();

    this.initWebSocket();
  },
  computed: {
    ...mapState("home", {
      isMapInitCompleted: state => state.isMapInitCompleted,
      shopInfo: state => state.shopInfo,
      activeList: (state) => state.activeList,
    }),
  },
  watch: {
    isMapInitCompleted(status) {
      //if (status && this.shopInfo.length > 0) {
      if (status && this.shopInfo) {
         this.$loading().close();
        // loadingInstance.close();
      }
    },
    shopInfo(list) {
      if (this.isMapInitCompleted && list.length > 0) {
         this.$loading().close();
        // loadingInstance.close();
      }
    },
  },
  methods: {
    ...mapActions("home", [GET_PROJECT_SHOP_INFO, GET_MOVIE_LIST, GET_BANNER_LIST, GET_ACTIVITY_INFO]),
   
    initWebSocket() {
      if ("WebSocket" in window) {
        //初始化weosocket
        const wsUrl = "ws://127.0.0.1:9528/Heart";
        // const wsUrl = "ws://192.168.1.99:9528/Heart";
        this.websock = new WebSocket(wsUrl);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      } else {
        console.log("浏览器不支持 WebSocket "); // 浏览器不支持 WebSocket
        this.osGetMAC();
      }
    },
    judgementAuthorization() {
      try {
        if (
          DecryptForAuthorizationCode(
            AUTHORIZATION_CODE,
            MAP_CONFIG.PID.toString()
          )
        ) {
          let code = DecryptForAuthorizationCode(
            AUTHORIZATION_CODE,
            MAP_CONFIG.PID.toString()
          ).split(";");
          console.log("code=",code);
          let overDate = code[2];
          let startDate = code[5];
          let currentDate = ~~dayjs().format("YYYYMMDD");
          let startDateNum = ~~startDate.replace(/-/g, "");
          let overDateNum = ~~overDate.replace(/-/g, "");
           //console.log("startDateNum=",startDateNum);
           //console.log("overDateNum=",overDateNum);
           //console.log("currentDate=",currentDate);
           //后10天
           let overDateAfterTenNum = ~~dayjs(overDate).add(10,'day').format("YYYYMMDD");
           //console.log("overDateAfterTenNum=",overDateAfterTenNum);
           if( currentDate >= overDateNum && currentDate <= overDateAfterTenNum)
           {
             this.isNoAuth10Waring = true;
           }
          // 当前时间不在限定时间内
          if (
            !(
              currentDate >= startDateNum &&
              currentDate <= overDateAfterTenNum
            )
          ) {
            this.isNoAuthorization = true;
            this.isNoAuth10Waring = false;
          }
        }
        else
        {
           this.isNoAuthorization = true;//解析失败 也不让点击
        }
      } catch (error) {
        this.isNoAuthorization = true;
      }
     // console.log("this.isNoAuth10Waring=",this.isNoAuth10Waring);
      //console.log("this.isNoAuthorization=",this.isNoAuthorization);
    },
    //点击五次临时授权
    clickRect() {
      this.clickNum++;
      //  console.log("clickNum =",this.clickNum);
      if (this.clickNum >= window.MAP_CONFIG.CLICK_COUNT_NUM_TEMP) {
        // document.querySelector('.no-authorization-tip').style.zIndex=-1;
        document.querySelector(".tempRect").style.opacity = 1; //设置alpha值
        this.isNoAuthorization = false;
        this.clickNum = 0;
        setTimeout(() => {
          this.isNoAuthorization = true;
          document.querySelector(".tempRect").style.opacity = 0;
        }, 1000 * 60 * window.MAP_CONFIG.CLOSE_POPUP_TIME_TEMP);
      }
    },
    //点击五次临时关闭弹窗
    clickNoAuth10Waring(){
        this.noAuth10WaringClickNum++;
       console.log("noAuth10WaringClickNum =",this.noAuth10WaringClickNum);
      if (this.noAuth10WaringClickNum >= window.MAP_CONFIG.CLICK_COUNT_NUM_TEMP) {
        this.isNoAuth10Waring = false;
        this.noAuth10WaringClickNum = 0;
        setTimeout(() => {
          this.isNoAuth10Waring = true;
        }, 1000 * 60 * window.MAP_CONFIG.CLOSE_POPUP_TIME_TEMP);
      }
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      // let actions = {"mac":""}; JSON.stringify(actions)
      this.websocketsend("MSG"); //因为第一条会收到时间，所以发了2条消息
      this.websocketsend("MAC");
      // setInterval(this.websocketSendHeart, 30000);
    },
    websocketonerror() {
      this.websock.close(); //断开websocket连接
      this.websock = null;
      this.osGetMAC();
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      window.MAP_CONFIG.NETWORK_MAC = redata.mac;
      console.log("数据接收 redata=", window.MAP_CONFIG.NETWORK_MAC);
      if (redata.mac) {
        this.websock.close(); //断开websocket连接
        this.websock = null;
      }
    },
    websocketsend(Data) {
      //数据发送
      console.log("数据发送=", Data);
      if (this.websock) {
        this.websock.send(Data);
      }
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
      this.osGetMAC();
    },
    osGetMAC() {
      //通过electron打包客户端后通信获取设备信息
      if (require("os")) {
        console.log( 'require("os").networkInterfaces()=', require("os").networkInterfaces());
        let interFaces = require("os").networkInterfaces();
        if (interFaces) {
          let localURlData = interFaces["本地连接"] || interFaces["以太网"];
          for (const key in interFaces) {
            if (key.indexOf("本地连接") != -1 || key.indexOf("以太网") != -1) {
              localURlData = interFaces[key];
            }
          }
          if (localURlData) {
            let macData = localURlData[0];
            if (macData) {
              if (window.MAP_CONFIG.NETWORK_MAC == "") {
                console.log("防止websocket没有拿到MAC=", macData.mac);
                //防止websocket没有拿到MAC
                window.MAP_CONFIG.NETWORK_MAC = macData.mac; //获取设备机器的mac地址
              }
            }
          }
        }
      }
    },
  },
};
</script>
