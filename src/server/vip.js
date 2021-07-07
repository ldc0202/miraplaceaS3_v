import { GET } from "@/helper/axios";

/**
 * @description 获取会员活动信息
 */
export const getPjVipActivities = async () => await GET("ids/getPjIdsActivities", {
    lan: "sc"
})