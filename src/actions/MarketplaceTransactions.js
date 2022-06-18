import axios from "axios";
import {
  GET_MARKETPLACE_TRANSACTIONS,
  GET_MARKETPLACE_CAMPAIGNS,
  GET_MARKETPLACE_BRAND,
  GET_MARKETPLACE_DETAIL_TRANSACTIONS,
} from "./type";
import config from "../config";

export const getMarketplaceTransactions =
  (
    // brand_status = "active",
    // influencer_status = "active",
    // campaignId = "",
    // influencerId = "",
    // transactionType = "",
    // groupBy = "",
    brandId = "",
    brand_status = "",
    influencer_status = "",
    campaignId = "",
    page = 1,
    limit = 25
  ) =>
  async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
        // .post(
        //   `${config.hostApi}/v1/users/marketPlace/getsummarylogs?brand_status=${brand_status}&influencer_status=${influencer_status}&campaign_id=${campaignId}&brand_id=${influencerId}&transaction_type=${transactionType}&group_by=${groupBy}&page=${page}&limit=${limit}`
        // )
        .post(
          `${config.hostApi}/v1/users/marketPlace/getsummarylogs?brand_id=${brandId}&brand_status=${brand_status}&influencer_status=${influencer_status}&campaign_id=${campaignId}&page=${page}&limit=${limit}`
        )
        .then((res) => {
          resolve("success");
          dispatch({
            type: GET_MARKETPLACE_TRANSACTIONS,
            payload: res.data,
          });
        })
        .catch(() => {
          dispatch({
            type: GET_MARKETPLACE_TRANSACTIONS,
            payload: [],
          });
          reject("error");
        });
    });
    return promise;
  };

export const getMarketplaceActiveCampaign =
  (brand_status, influencer_status, brand_id) => async (dispatch) => {
    axios
      .post(
        // `${config.hostApi}/v1/users/marketPlace/getallcampaigns?brand_status=${brand_status}&influencer_status=${influencer_status}&brand_id=${brand_id}`
        `${config.hostApi}/v1/users/marketPlace/getallcampaigns?brand_status=${brand_status}&influencer_status=${influencer_status}`
      )
      .then((res) => {
        dispatch({
          type: GET_MARKETPLACE_CAMPAIGNS,
          payload: res.data,
        });
      })
      .catch(() => {
        dispatch({
          type: GET_MARKETPLACE_CAMPAIGNS,
          payload: [],
        });
      });
  };

export const getMarketplaceBrand = (campaignId) => async (dispatch) => {
  axios
    .post(`${config.hostApi}/v1/users/marketPlace/getuserownbrands`)
    .then((res) => {
      dispatch({
        type: GET_MARKETPLACE_BRAND,
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: GET_MARKETPLACE_BRAND,
        payload: [],
      });
    });
};

export const getMarketplaceDetailTransactions =
  (campaignId = "", transactionType = "", page = 1, limit = 12) =>
  async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
        .post(
          `${config.hostApi}/v1/users/marketPlace/getlogs?campaign_id=${campaignId}&transaction_type=${transactionType}&page=${page}&limit=${limit}`
        )
        .then((res) => {
          resolve("success");
          dispatch({
            type: GET_MARKETPLACE_DETAIL_TRANSACTIONS,
            payload: res.data,
          });
        })
        .catch(() => {
          dispatch({
            type: GET_MARKETPLACE_DETAIL_TRANSACTIONS,
            payload: [],
          });
          reject("error");
        });
    });
    return promise;
  };
