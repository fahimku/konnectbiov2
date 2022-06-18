import axios from "axios";
import { CLEAR_POST, GET_POST, UPDATE_POST } from "./type";
import config from "../config";

export const configSubs = () => async (dispatch) => {
  const res = await axios.post(`${config.hostApi}/v1/subscribe/config`);
  return res.data;
};

export const makePayment = (data) => async (dispatch) => {
  const res = await axios.post(`${config.hostApi}/v1/subscribe/checkout`, data);
  return res.data.message;
};

export const updateSubscription = (data) => async (dispatch) => {
  const res = await axios.post(`${config.hostApi}/v1/subscribe/upgrade`, data);
  return res.data;
};


export const subscribeServices = (val,priceId,module,interval,package_id) => async (dispatch) => {
  const res = await axios.post(`${config.hostApi}/v1/subscribe/addon`, {
    package_id:package_id,
    recurring_payment_type:interval,
    addon:module,
    quantity:val,
    price_id:priceId
  });
  return res.data;
};