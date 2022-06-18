import axios from "axios";
import { GET_SHOPIFY_TRACKER } from "./type";
import config from "../config";

export const getShopifyTracker = () =>
  async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
        .post(
          `${config.hostApi}/v1/shopify`
        )
        .then((res) => {
          dispatch({
            type: GET_SHOPIFY_TRACKER,
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
