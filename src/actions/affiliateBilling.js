import axios from "axios";
import {
  GET_AFFILIATE_BILLING_DETAIL,
  GET_AFFILIATE_CONTRACT_DETAIL,
} from "./type";
import config from "../config";

export const getAffiliateBillingDetail = () => async (dispatch) => {
  axios.get(`${config.hostApi}/v1/affiliate/getbilling`).then((res) => {
    dispatch({
      type: GET_AFFILIATE_BILLING_DETAIL,
      payload: res.data,
    });
  });
};

export const getAffiliateContractDetail = () => async (dispatch) => {
  axios.get(`${config.hostApi}/v1/affiliate/getcontract`).then((res) => {
    dispatch({
      type: GET_AFFILIATE_CONTRACT_DETAIL,
      payload: res.data,
    });
  });
};
