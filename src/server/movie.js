import { GET } from "@/helper/axios";

/**
 * @description IDS获取电影票信息
 */
export const getFilmService = async () => await GET("ids/FilmService");