import QS from 'qs';
import axios from 'axios';
import { Message } from 'element-ui';
// 超时时间
const TIMEOUT = 15000;

axios.defaults.baseURL = MAP_CONFIG.BASE_URL;
axios.defaults.timeout = TIMEOUT;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
let ipcRenderer;
if (process.env.NODE_ENV != "development") {
    ipcRenderer = require("electron").ipcRenderer;
}
/**
 * @description 打印错误日志
 * @param {*} response
 */
 function sendErrorInfo(response) {
    ipcRenderer && ipcRenderer.send("sendErrMessage", {
        type: "接口错误",
        interface: response.config.url,
        status: response.status,
        statusText: response.statusText
    });
}

// 请求拦截器
axios.interceptors.request.use(
    config => {

        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
        // 否则的话抛出错误
        if (response?.status === 200) {
            if (response?.data?.c === 200 || response?.data?.code === 200 || response?.data?.length) {
                return Promise.resolve(response);
            } else {
                // Message.warning(response?.data?.msg || "数据请求错误")
                // console.log(response?.data?.msg || "数据请求错误");
                sendErrorInfo(response);
                return Promise.reject(response);
            }
        } else {
            // console.log(response?.data?.msg || "数据请求错误");
            // Message.warning(response?.data?.msg || "数据请求错误")
            sendErrorInfo(response);
            return Promise.reject(response);
        }
    },
    error => {
        // console.log("数据请求失败！");
        // Message.error("数据请求失败！");
        sendErrorInfo(response);
        return Promise.reject(error);
    }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {IDictionary<any>} params [请求时携带的参数]
 */
export const GET = async (url, params = {}, lineSearch) => {
    if (!params.lineState && !lineSearch) {
        if (!window.lineState) {
            url = 'data/' + url.split("/")[0] + "_" + url.split("/")[1] + ".data";
        }
    }
    if (lineSearch) {
        url = `${MAP_CONFIG.LINE_URL}${url}`
    }
    const result = await axios.get(url, {
        params: {
            pid: MAP_CONFIG.PID,
            projectId: MAP_CONFIG.PID,
            buildingID: MAP_CONFIG.BUILDING_ID,
            secretKey: "sk8whhan6tc985rh211jk",
            ...params,
        }
    })

    return result?.data?.v;
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {IDictionary<any>} params [请求时携带的参数]
 */
export const POST = async (url, params = {}, lineSearch) => {
    if (!params.lineState && !lineSearch) {
        if (!window.lineState) {
            url = 'data/' + url.split("/")[0] + "_" + url.split("/")[1] + ".data";
        }
    }
    if (lineSearch) {
        url = `${MAP_CONFIG.LINE_URL}${url}`
    }
    const result = await axios.post(url, QS.stringify({
        pid: MAP_CONFIG.PID,
        projectId: MAP_CONFIG.PID,
        buildingID: MAP_CONFIG.BUILDING_ID,
        secretKey: "sk8whhan6tc985rh211jk",
        ...params,
    }))

    return result?.data?.v;
}