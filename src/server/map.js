import { GET } from "@/helper/axios";

/**
 * @description 获取公共设施
 */
export const getMallFunctioninfo = async () => await GET("map/GetMallFunctioninfo");

/**
 * @description 获取地图数据
 */
 export const getAreaInfo = async () => await GET("map/getAreaInfo");