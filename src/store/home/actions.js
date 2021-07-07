import { convertMultipleArea } from "@/utils";
import { getShopServer } from "@/server/shop";
import { getFilmService } from "@/server/movie";
import { findIdsAdvByPid } from "@/server/banner";
import { getPjIdsActivities } from "@/server/active";
import { GET_PROJECT_SHOP_INFO, GET_MOVIE_LIST, GET_BANNER_LIST, GET_ACTIVITY_INFO } from "./actionType"

export default {
    async [GET_PROJECT_SHOP_INFO]({ commit }) {
        const result = await getShopServer();
        commit(GET_PROJECT_SHOP_INFO, convertMultipleArea(result));
    },
    async [GET_MOVIE_LIST]({ commit }) {
        const result = await getFilmService();
        commit(GET_MOVIE_LIST, result?.map(movie => ({
            ...movie,
            image: `${MAP_CONFIG.BASE_URL}map/${movie.Post}`
        })) || []);
    },
    async [GET_BANNER_LIST]({ commit }) {
        const result = await findIdsAdvByPid();
        commit(GET_BANNER_LIST, result || []);
    },
    async [GET_ACTIVITY_INFO]({ commit }) {
        const result = await getPjIdsActivities();
        commit(GET_ACTIVITY_INFO, result || []);
    },
}
