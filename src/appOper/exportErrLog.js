import fs from 'fs'
import path from "path";
import dayjs from "dayjs";
import { app,ipcMain } from 'electron';

/**
 * @description 保存错误日志
 */
export function exportErrorLogFile() {
    ipcMain.on('sendErrMessage', (event, info) => {
        let errorMessage;
        switch (info.type) {
            case "接口错误":
                errorMessage = `${dayjs().format("YYYY/MM/DD HH:mm:ss")} -> 类型:接口错误 错误接口:${info.interface} 状态码:${info.status} 状态文:${info.statusText}`
                break;
            case "代码错误":
            case "严重错误":
                errorMessage = `${dayjs().format("YYYY/MM/DD HH:mm:ss")} -> 类型:代码错误 错误内容:${info.message}`
                break;
           
        }

        fs.readFile(path.join(__dirname, `static/errorlog/错误日志${dayjs().format("YYYY_MM_DD")}.txt`), function (err, data) {
            // 没有文件直接生成
            if (err) {
                geneErrorLogFile(errorMessage);
                return
            }
            // 有内容追加错误内容再覆盖
            if (data) {
                errorMessage = `${errorMessage} \n ${data}`;
                geneErrorLogFile(errorMessage);
                if(info.type == "严重错误")
                {
                    app.quit(); //退出软件
                }
            }
        })
    })
}

/**
 * @description 生成错误日志
 * @param {string} convertFile
 */
 function geneErrorLogFile(convertFile) {
    fs.writeFile(path.join(__dirname, `static/errorlog/错误日志${dayjs().format("YYYY_MM_DD")}.txt`), convertFile, 'utf8', (err, data) => { })
}