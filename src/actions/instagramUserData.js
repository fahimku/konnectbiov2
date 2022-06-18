import axios from "axios";
import { GET_INSTAGRAM_USER_DATA } from "./type";
import config from "../config";

export const getInstagramUserData = () => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/graph/ig/analytics/user`)
      .then((res) => {
        dispatch({
          type: GET_INSTAGRAM_USER_DATA,
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