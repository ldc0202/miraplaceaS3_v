import { GET } from "@/helper/axios";
// const appInterface = require("os").networkInterfaces();
// var localURlData = appInterface ? appInterface["以太网"] || appInterface["本地连接"] : "";
// for (const key in appInterface) {
//     if (key.indexOf("本地连接")!=-1 || key.indexOf("以太网")!=-1) {
//       localURlData = appInterface[key];
//     }
// }
// const localMacID = localURlData ? localURlData[0].mac : "";

// 旧的储存信息
let OLD_STATISTICS, OLD_PARAMETER1, OLD_PARAMETER2, OLD_PARAMETER3;

/**
 * @description IDS获取天气信息
 * @returns
 */
export const getWeather = async () => await GET(`${window.MAP_CONFIG.LINE_URL}ids/getWeather`, {
    skin: "white128",
    from: "hk",
    lineState:true
});

//埋点请求 ids/sendStatisticshttp
export const sendStatistics = async (clickMark, parameter1, parameter2, parameter3) => {
    if (OLD_STATISTICS && OLD_STATISTICS !== clickMark) {
        await GET("ids/sendStatisticshttp", {
            param: {
                parameter:
                {
                    ClickMark: `${MAP_CONFIG.LAN}${OLD_STATISTICS}`,//之前进行的操作指令
                    networkMAC: MAP_CONFIG.NETWORK_MAC,//获取设备机器的mac地址
                    lan: MAP_CONFIG.LAN,//当前语言
                    projectId: MAP_CONFIG.PID,
                    BrandID: OLD_PARAMETER1,
                    FloorID: OLD_PARAMETER1,
                    AreaID: OLD_PARAMETER1,
                    pointId: OLD_PARAMETER1,
                    eventId: OLD_PARAMETER1,
                    letter: OLD_PARAMETER1,
                    phoneNum: OLD_PARAMETER1,
                    brandTypeName: OLD_PARAMETER1,
                    carNo: OLD_PARAMETER1,
                    lotNo: OLD_PARAMETER1,
                    filmName: OLD_PARAMETER1,
                    filmDate: OLD_PARAMETER2,
                    filmShowTime: OLD_PARAMETER3,
                    authNo: OLD_PARAMETER2,
                    faceId: MAP_CONFIG.FACE_ID,
                    sex: MAP_CONFIG.SEX || "",
                    age: MAP_CONFIG.AGE || "",
                    lastPhone: OLD_PARAMETER2,
                },
                pid: MAP_CONFIG.PID,
                poi: window.MAP_CONFIG.POSITION_NODEID,//当前设备点位id
                type: "Departure",//上一次的点击被退出  
            }
        }, true)
    }

    if (OLD_STATISTICS !== clickMark) {
        OLD_STATISTICS = clickMark;
        OLD_PARAMETER1 = parameter1;
        OLD_PARAMETER2 = parameter2;
        OLD_PARAMETER3 = parameter3;
    }
    await GET("ids/sendStatisticshttp", {
        param: {
            parameter:
            {
                ClickMark: `${MAP_CONFIG.LAN}${clickMark}`,//之前进行的操作指令
                networkMAC: MAP_CONFIG.NETWORK_MAC,//获取设备机器的mac地址
                lan: MAP_CONFIG.LAN,//当前语言
                projectId: MAP_CONFIG.PID,
                BrandID: parameter1,
                FloorID: parameter1,
                AreaID: parameter1,
                pointId: parameter1,
                eventId: parameter1,
                letter: parameter1,
                phoneNum: parameter1,
                brandTypeName: parameter1,
                carNo: parameter1,
                lotNo: parameter1,
                filmName: parameter1,
                filmDate: parameter2,
                filmShowTime: parameter3,
                authNo: parameter2,
                faceId: MAP_CONFIG.FACE_ID,
                sex: MAP_CONFIG.SEX || "",
                age: MAP_CONFIG.AGE || "",
                lastPhone: parameter2,
            },
            pid: MAP_CONFIG.PID,
            poi: window.MAP_CONFIG.POSITION_NODEID,//当前设备点位id
            type: "Click",//上一次的点击被退出  
        }
    }, true)
}

//IDS导航统计次数加一 ids/mapIdsNav
export const getMapIdsNav = async () => await GET(MAP_CONFIG.LINE_URL + "ids/mapIdsNav", { lineState: true });