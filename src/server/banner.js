import { GET } from "@/helper/axios";

/**
 * @description 获取首页轮波图
 */
export const findIdsAdvByPid = async () => await GET("ids/findIdsAdvByPid")