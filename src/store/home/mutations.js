import { groupProjectArray } from "@/utils";
import { GET_PROJECT_SHOP_INFO, GET_MOVIE_LIST, GET_BANNER_LIST, GET_ACTIVITY_INFO } from "./actionType";

export default {
    // 更新地图加载完成状态
    updateMapInitCompletedStatus(state, status) {
        state.isMapInitCompleted = status;
    },
    [GET_PROJECT_SHOP_INFO](state, list) {
        state.shopInfo = list;
    },
    [GET_MOVIE_LIST](state, list) {
        state.movieList = list;
    },
    [GET_BANNER_LIST](state, list) {
        state.adsList = list;
    },
    //更新活动列表数据(未分组)
    [GET_ACTIVITY_INFO](state, list) {
        state.activeList = list;
    },
}