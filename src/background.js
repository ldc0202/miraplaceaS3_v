"use strict";

import fs from "fs";
import path from "path";
import { config } from "./config/appConfig";
import { app, protocol, BrowserWindow, Menu, ipcMain, dialog } from "electron";
import {
  createProtocol,
  /* installVueDevtools */
} from "vue-cli-plugin-electron-builder/lib";
import { exportSaveFile } from './appOper/exportMapData';
import { exportErrorLogFile } from './appOper/exportErrLog';

const isDevelopment = process.env.NODE_ENV !== "production";

import dayjs from "dayjs";

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
export let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // 创建浏览器窗口。
  win = new BrowserWindow(config);

  // 隐藏菜单
  Menu.setApplicationMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // 如果开发环境加载WEBPACK_DEV_SERVER的地址
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools(); //开发环境打开chrome调试窗口
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    exportSaveFile();
    exportErrorLogFile();

    // 打开调试工具
    ipcMain.on('openDevTool', () => {
      win.webContents.openDevTools()
    })
  }
  // 当 window 被关闭，这个事件会被发出
  win.on("closed", () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 但这次不是。
    win = null;
  });
}

// 让electron打包应用具有触摸点击功能
app.commandLine.appendSwitch("touch-events", "enabled");

// 当所有窗口被关闭了，退出。
app.on("window-all-closed", () => {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// 保存地图此刻配置参数
// ipcMain.on("exportSaveFile", (event, info) => {
//   convertConfigFile(info, (convertFile) => {
//     fs.writeFile(
//       path.join(__dirname, "static/config.json"),
//       JSON.stringify(convertFile),
//       function(err) {
//         if (err) {
//           dialog.showErrorBox(
//             "保存失败",
//             `地图相关配置数据保存失败，请重试 \n ${err}`
//           );
//         } else {
//           dialog.showMessageBox({
//             type: "info",
//             title: "保存成功",
//             message: "地图相关配置数据重置成功,3秒后将自动关闭软件",
//           });

//           setTimeout(() => {
//             app.quit();
//             //app.relaunch();
//           }, 3000);
//         }

//         // 向渲染进程回调
//         win.webContents.send("exportFileEnd");
//       }
//     );
//   });
// });

// function convertConfigFile(info, cb) {
//   fs.readFile(path.join(__dirname, "static/config.json"), "utf8", function(
//     err,
//     data
//   ) {
//     if (err) {
//       dialog.showErrorBox("读取失败", `配置文件读取失败，请重试 \n ${err}`);
//       // 向渲染进程回调
//       win.webContents.send("exportFileEnd");
//       return;
//     }

//     const configData = Object.assign(JSON.parse(data), info);


//     cb(configData);
//   });
// }
// 存储错误日志
ipcMain.on("sendErrMessage", (event, info) => {
  let errorMessage;

  switch (info.type) {
    case "接口错误":
      errorMessage = `${dayjs().format(
        "YYYY/MM/DD HH:mm:ss"
      )} -> 类型:接口错误 错误接口:${info.interface} 状态码:${
        info.status
      } 状态文:${info.statusText}`;
      break;
    case "代码错误":
      errorMessage = `${dayjs().format(
        "YYYY/MM/DD HH:mm:ss"
      )} -> 类型:代码错误 错误内容:${info.message}`;
      break;
  }

  fs.readFile(
    path.join(
      __dirname,
      `static/errorlog/错误日志${dayjs().format("YYYY_MM_DD")}.txt`
    ),
    function(err, data) {
      // 没有文件直接生成
      if (err) {
        geneErrorLogFile(errorMessage);
        return;
      }

      // 有内容追加错误内容再覆盖
      if (data) {
        errorMessage = `${errorMessage} \n ${data}`;
        geneErrorLogFile(errorMessage);
      }
    }
  );
});

function geneErrorLogFile(convertFile) {
  fs.writeFile(
    path.join(__dirname, `static/errorlog/错误日志${dayjs().format("YYYY_MM_DD")}.txt`),
    convertFile,
    "utf8",
    (err, data) => {}
  );
}

//打开测试F12
ipcMain.on("open-devtools", (event, arg) => {
  win.openDevTools();
});
//重启软件
ipcMain.on("onRelaunch", (event, arg) => {
  app.relaunch();
  app.exit(0);
});
//关闭软件
ipcMain.on("onQuit", (event, arg) => {
  app.quit();
});
//是否只实例化了一个
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}