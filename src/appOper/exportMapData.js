import fs from 'fs'
import path from "path";
import { app, ipcMain, dialog } from 'electron';

/**
 * @description 保存地图此刻配置参数
 */
export function exportSaveFile() {
    ipcMain.on('exportSaveFile', (event, info) => {
        convertConfigFile(info, (convertFile) => {
            fs.writeFile(path.join(__dirname, 'static/config.json'), JSON.stringify(convertFile), function (err) {
                if (err) {
                    dialog.showErrorBox("保存失败", `地图相关配置数据保存失败，请重试 \n ${err}`);
                } else {
                    dialog.showMessageBox({
                        type: 'info',
                        title: '保存成功',
                        message: "地图相关配置数据重置成功,3秒后将自动重启软件",
                    })
                    setTimeout(() => {
                        //app.quit();//关闭软件
                        app.relaunch();//重启软件
                        app.exit(0);
                    }, 3000);
                }
            });
        });
    })
}



function convertConfigFile(info, cb) {
    fs.readFile(path.join(__dirname, "static/config.json"), "utf8", function (
        err,
        data
    ) {
        if (err) {
            dialog.showErrorBox("读取失败", `配置文件读取失败，请重试 \n ${err}`);
            return;
        }

        const configData = Object.assign(JSON.parse(data), info);
        cb(configData);
    });
}