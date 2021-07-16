/** 
 * 在线 - true 
 * 离线 - false 
 * */
window.lineState = true;

window.MAP_CONFIG = {
    APP_VERSION: "v1.0.0",

    isShowLan: true, //是否显示英文按钮

    /** --------------------------------------- 基础设置 --------------------------------------- */

    /** TODO:改横竖版本此处必须改 横版 - 0 竖版 - 1 */
    SCREEN_TYPE: 1,
    
    /** 开启debug模式填的密码 */
    debug_password:'111111',

    /** 接口 根据是否是离线版本决定采用哪个链接 */
    BASE_URL: lineState ? 'https://openapi.onemap.top/ids/' : 'static/OfflineData/',

    /** 有些接口必须调线上地址用这个url */
    LINE_URL: 'https://openapi.onemap.top/ids/',

     /** 手机地图调用服务器地址 */
    MOBILE_SERVER:'https://openapi.onemap.top/ids/',

    /** 手机地图链接  */
    MOBILE_MAP_SERVER: 'https://www.onemap.top/m/#/',

    /** 热门搜索展示条数  */
    HOT_SEARCH_NUMBER: 10,

    /** 项目id  */
    PID: 239,
    // PID: 179,

    /** 建筑ID  */
    BUILDING_ID: 237,

    /** 间隔多少秒时间未操作进入屏保页  */
    RESET_TIME: 120,

    /** 倒计时剩余显示时间  */
    COUNT_DOWN_TIME: 5,

    /** 是否开启寻车功能  */
    SEARCH_CARS_ONOFF: false,

    /** 需要隐藏的设施  */
    HIDE_FACILITY_LIST: ["出入口"],

    /** 美食购物页面屏蔽楼层  */
    HIDE_SHOP_FLOOR_LIST: ["B2","B3", "B4"],

    /** 连续点击多少次触发地图配置文件覆盖指令  */
    OPEN_DEBUG_DIRECTIVE: "debug",

    /** 是否一步加载所有楼层  */
    ONE_STEP_LOAD: true,

    /** 人脸ID  */
    FACE_ID: "",

     /** 用户性别 */
    SEX: "",
    /** 用户年龄 */
    AGE: "",

    /** 设备mac地址 */
    NETWORK_MAC: "",

    /**语言 */
    LAN:"sc",
 
    /** 需要循环模拟导航 */
    SIMULATE_LOOP: true,

    /** 是否需要使用服务端的超级搜索 */
    IS_SUPER_SEARCH: true,

    /** 是否支持横版购物和美食二级业态左右滑动 */
    IS_NEED_SLIDE_H: false,

    /** 天气更新时间 单位(分钟) */
    WEATHER_UPDATE_TIME:10,

    /**停车位 标签 */
    CAR_PORT:"carport",

    /**临时关闭警告弹窗 需要点击的次数 5 表示需要点击5下才关闭弹窗 */
    CLICK_COUNT_NUM_TEMP:5,
    /**临时关闭警告弹窗 之后弹窗再次出现的时间  5 表示过5分钟后弹窗还会再次出现 */
    CLOSE_POPUP_TIME_TEMP:5,
    /** --------------------------------------- 地图相关设置 --------------------------------------- */

    /** 地图是否可点击 */
    AREA_CLICK_EMBED: true,

    /** 比例尺 */
    PIXEL_PERMETER: 30,

    /** 是否java服务器 */
    IS_JAVA_SERVE: true,

    /** 地图debug模式开关 */
    DEBUG_SWITCH: false,

    /** 地图背景颜色 */
    MAP_BACKGROUND: 0xffffff,

    /** 地图背景是否透明 */
    BACKGROUND_ALPHA: true,

    /** 显示logo类型 */
    LOGO_FILED: "Logo",

    /** 区块透明度 */
    OPACITY: 1,

    /** 是否设置地图底图  布尔值 */
    GROUND_LAYER: true,

    /** 底图是否是svg 布尔值 */
    GROUND_IS_SVG: false,

    /** 是否后台静默渲染 IDS 默认打开 全部楼层渲染出来*/
    PRE_CREATION: true,

    /** 店铺文本显示模式 */
    SHOW_LABEL_TYPE: "shopName",

    /** 是否跨建筑 */
    CROSS_BUILDING: false,

    /** 导航路线的颜色 */
    PATH_COLOR: 0xD04141,

    /** 导航路线的粗细 */
    PATH_THICKNESS: 5,

    /** 显示文字的半径 */
    SHOW_LABEL_LENGTH: 15000,

    /** 显示公共设施的半径 */
    SHOW_IMAGE_LENGTH: 15000,

    /** 显示ids设备点位 */
    SHOW_IDS_DEVICE: false,

    /** 点击是否居中 */
    FOCUS_CENTER: false,

    /** 模拟导航是否自动旋转 */
    SIMULATE_ROTATE: false,

    /** 模拟导航的时候是否开启模型 是否显示小人 机器人 */
    USE_MODEL: true,

    /** 模拟导航的时候是否多层导视 */
    MULTI_FLOOR_VIEW: true,

    /** 模拟导航的时候是否视角移动 */
    SIMULATE_VIEW_MOVE: false,

    /** 是否开启抗锯齿 */
    ANTIALIAS: true,

    /** TODO:地图最小显示值 改横竖版本此处必须改*/
    MAX_CAMERA_RADIUS: 15000,//横版 6000,//竖版 15000,

    /** TODO:地图最大显示值 改横竖版本此处必须改*/
    MIN_CAMERA_RADIUS: 5000,//横版 3000,//竖版 5000,

    /** 地图选中区块色值 */
    SELECT_NODE_COLOR: 0xD9A076,

    /** 地图寻路经过区块色值 */
    PASS_NODE_COLOR: 0xE66579,

    /** 设施大小 */
    FACILITY_SCALE: 0.8,

    /** 文字大小 */
    LABEL_SCALE: 1.5,

    /** marker大小 */
    MARKER_SCALE: 0.4,

    /** 终点起点标注大小 */
    SYS_SCALE: 0.4,

    /** 定位market大小 */
    LOCATION_MARKER_SCALE: 0.3,

    /** 两层楼层间距 */
    FLOOR_2_GAP: 1800,//1500,

    /** 多层楼层间距 */
    floorMultiGap: 1000,

    /** 是否不允许地图拖拽出限制 */
    IS_CALCRENDER_SIZE: true,

    /** 2D/3D显示模式 */
    VIEW_MODE: "3D",

   /** 模拟导航速度 */
   SIMULATE_MOVE_SPEED: 3,
   
    /** 地图icon */
    EmbedTextIcon: false,
}
