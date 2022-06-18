import axios from "axios";
import { GET_PROMO_REQUEST } from "./type";
import config from "../config";

export const getPromoRequest = () => async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
        .get(`${config.hostApi}/v1/campaigns/receive/getpromocodes`)
        .then((res) => {
          dispatch({
            type: GET_PROMO_REQUEST,
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