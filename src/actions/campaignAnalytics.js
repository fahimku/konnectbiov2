import axios from "axios";
import { GET_CAMPAIGN_ANALYTICS } from "./type";
import config from "../config";

export const getCampaignAnalytics = (id) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/campaigns/summary/${id}`)
      .then((res) => {
        dispatch({
          type: GET_CAMPAIGN_ANALYTICS,
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
