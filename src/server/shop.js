import { GET, POST } from "@/helper/axios";

/**
 * @description 查询业态类型信息
 * @returns
 */
export const getMapBrandType = async () => await GET("mapQuery/getMapBrandType")

/**
 * @description 获取品牌数据
 * @returns
 */
export const getShopServer = async () => await GET("ids/getShops")

/**
 * @description 模糊搜索
 * @param {string} serkey 需要检索的文字
 * @returns
 */
 export const serachShopServer = async serkey => await POST("superSearch/superSearch", {
    serkey:serkey
}, true)
// export const serachShopServer = async serkey => await GET("ids/getShops", {
//     serkey
// }, true)



/**
 * @description 获取热门搜索
 * @returns
 */
export const findLyxSearch = async () => await GET("Lyx/findLyxSearch", {
    dataNumber: MAP_CONFIG.HOT_SEARCH_NUMBER, //获取的条数
    startTime: "2019-01-01 00:00:00",
    overTime: "2080-11-23 00:00:00"
})