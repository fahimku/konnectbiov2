import axios from "axios";
import config from "../config";
import { GET_USER_INFO } from "./type";

export const getUserInfo = () => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(`${config.baseURLApi}/users/receive/userinfo`)
      .then((res) => {
        dispatch({
          type: GET_USER_INFO,
          payload: res.data?.message,
        });
        resolve(res.data?.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};
