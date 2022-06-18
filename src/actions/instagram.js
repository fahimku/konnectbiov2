import axios from "axios";
import { GET_INSTAGRAM_URL } from "./type";
import config from "../config";

export const getInstagramURL = () => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/social/ig/url/instagram`)
      .then((response) => {
        dispatch({
          type: GET_INSTAGRAM_URL,
          payload: response.data,
        });
        resolve("success");
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};
