import axios from "axios";
import { GET_AFFILIATE_CARDS,GET_PAYMENT_METHOD,GET_BALANCE_REQUEST } from "./type";
import config from "../config";

export const getAffiliateCards = () => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.hostApi}/v1/deposit/paymentmethods`)
      .then((res) => {
        resolve("success");
        dispatch({
          type: GET_AFFILIATE_CARDS,
          payload: res.data,
        });
      })
      .catch(() => {
        dispatch({
          type: GET_AFFILIATE_CARDS,
          payload: [],
        });
        reject("error");
      });
  });
  return promise;
};


export const makePayment = () => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.hostApi}/v1/deposit/makepaymentmethod`)
      .then((res) => {
        resolve("success");
        dispatch({
          type: GET_PAYMENT_METHOD,
          payload: res.data,
        });
      })
      .catch(() => {
        dispatch({
          type: GET_PAYMENT_METHOD,
          payload: [],
        });
        reject("error");
      });
  });
  return promise;
};

export const showBalance = () => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.hostApi}/v1/deposit/getbalance`)
      .then((res) => {
        resolve("success");
        dispatch({
          type: GET_BALANCE_REQUEST,
          payload: res.data,
        });
      })
      .catch(() => {
        dispatch({
          type: GET_BALANCE_REQUEST,
          payload: [],
        });
        reject("error");
      });
  });
  return promise;
};
