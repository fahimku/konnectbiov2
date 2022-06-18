import axios from "axios";
import { GET_AFFILIATE_SALES_INF } from "./type";
import config from "../config";



export const getAffiliateSalesByInfluencer =
  (group_by = "", page, limit, startDate, endDate) =>
  async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
      .post(
      `${config.hostApi}/v1/users/marketPlace/getearning?group_by=${group_by}&page=${page}&limit=${limit}&from_date=${startDate}&to_date=${endDate}`
    )
        .then((res) => {
          dispatch({
            type: GET_AFFILIATE_SALES_INF,
            payload: res.data,
          });
          resolve("success");
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  };
  