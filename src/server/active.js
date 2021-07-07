import { GET } from "@/helper/axios";

/**
 * @description 获取项目活动信息
 */
export const getPjIdsActivities = async () => await GET("ids/getPjIdsActivities", {
    lan: "sc",
})