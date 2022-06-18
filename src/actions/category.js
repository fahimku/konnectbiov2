import axios from "axios";
import config from "../config";
import {
  GET_CATEGORIES,
  GET_USER_CATEGORIES,
  GET_USER_CATEGORIES2,
} from "./type";

export const getCategories = () => async (dispatch) => {
  try {
    const res = await axios.get(`${config.baseURLApi}/usercategory/receive`);
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data?.message,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getUserCategories = () => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(`${config.baseURLApi}/users/receive/categories`)
      .then((res) => {
        dispatch({
          type: GET_USER_CATEGORIES,
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

export const getUserCategories2 = (userId) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .get(`${config.baseURLApi}/users/receive/categories?id=${userId}`)
      .then((res) => {
        dispatch({
          type: GET_USER_CATEGORIES2,
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
