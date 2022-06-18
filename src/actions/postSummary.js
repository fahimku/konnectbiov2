import axios from "axios";
import { GET_POST_SUMMARY } from "./type";
import config from "../config";

export const getPostSummary =
  (username, fromDate, toDate, limit, page) => async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
        .post(`${config.baseURLApi}/analytics/receive/analyseSummary`, {
          username: username,
          from_date: fromDate,
          to_date: toDate,
          limit: limit,
          page: page,
          post_type: "image",
        })
        .then((res) => {
          dispatch({
            type: GET_POST_SUMMARY,
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
