import axios from "axios";
import { GET_MEDIA_SUMMARY } from "./type";
import config from "../config";

export const getMediaSummary = (fromDate, toDate) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/library/dashboard/summary`, {
        from_date: fromDate,
        to_date: toDate,
      })
      .then((res) => {
        dispatch({
          type: GET_MEDIA_SUMMARY,
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
