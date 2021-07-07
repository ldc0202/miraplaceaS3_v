// electron窗口配置
export const config = {
    width:2160, //3840,//2160, //TODO:改横竖版本此处必须改 窗口宽度,单位像素. 默认是 800.
    height:3840, //2160,//3840, //TODO:改横竖版本此处必须改 窗口高度,单位像素. 默认是 800.
    movable: true, // 窗口是否可以拖动. 在 Linux 上无效. 默认为 true.
    fullscreen: true, //是否全屏
    resizable: false, //是否可以改变窗口size，默认为 true
    fullscreenable: true, //在 OS X 上，全屏化按钮是否可用，默认为 true.
    skipTaskbar: false, // 是否在人物栏中显示窗口. 默认是false.
    icon: '', // 如果不设置，窗口将使用可用的默认图标.
    frame: true, // 指定 false 来创建一个 Frameless Window. 默认为 true.
    titleBarStyle: 'hidden', //隐藏标题栏，内容充满整个窗口, 然后它依然在左上角，仍然受标准窗口控制.
    webPreferences: {
        nodeIntegration: true, //是否完整支持node. 默认为 false
        defaultFontFamily: 'Microsoft YaHei', //默认字体
        defaultFontSize: 12,//字号
        minimumFontSize: 0, // 最小字号默认为 0.
        webgl: true, //是否完整支持webgl. 默认为 false
    }
}