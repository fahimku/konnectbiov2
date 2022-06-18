import axios from "axios";
import { GET_BIOSHOP_SUMMARY } from "./type";
import config from "../config";

export const getBioShopSummary =(username, fromDate, toDate, limit, page) => async (dispatch) => {
        let promise = new Promise((resolve, reject) => {
            axios
                .post(`${config.baseURLApi}/analytics/receive/getBioShopSummary`, {
                    username: username,
                    from_date: fromDate,
                    to_date: toDate,
                    limit: limit,
                    page: page,
                    post_type: "",
                })
                .then((res) => {
                    dispatch({
                        type: GET_BIOSHOP_SUMMARY,
                        payload: res.data.message,
                    });
                    resolve("success");
                })
                .catch((error) => {
                    reject(error);
                });
        });
        return promise;
    };
