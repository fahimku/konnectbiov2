import axios from "axios";
import { GET_DASHBOARD_DATA } from "./type";
import config from "../config";

export const getDashboard = (postType,token) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/userdashboard/receive/${token}`, {
        post_type:postType
      })
      .then((response) => {
        dispatch({
          type: GET_DASHBOARD_DATA,
          payload: response.data.message,
        });
        resolve("success");
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};