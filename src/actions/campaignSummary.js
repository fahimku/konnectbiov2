import axios from "axios";
import { GET_CAMPAIGN_SUMMARY } from "./type";
import config from "../config";

export const getCampaignSummary = (fromDate, toDate) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/campaigns/summary`, {
        from_date: fromDate,
        to_date: toDate,
      })
      .then((res) => {
        dispatch({
          type: GET_CAMPAIGN_SUMMARY,
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
