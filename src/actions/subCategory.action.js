import axios from "axios";
import config from "../config";
import {
  GET_SUB_CATEGORIES,
} from "./type";

export const getSubCategories = (categoryId) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(`${config.baseURLApi}/users/receive/subcategory?category_id=${categoryId}`)
      .then((res) => {
        dispatch({
          type: GET_SUB_CATEGORIES,
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


