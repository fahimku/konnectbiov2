import axios from "axios";
import {
  GET_AFFILIATE_TRANSACTIONS,
  GET_AFFILIATE_CAMPAIGNS,
  GET_AFFILIATE_INFLUENCER,
  GET_CAMPAIGN_DETAIL_TRANSACTIONS,
  GET_INFLUENCER_DETAIL_TRANSACTIONS,
} from "./type";
import config from "../config";

export const getAffiliateTransactions =
  (status = "active", campaignId = "", page = 1, limit = 25) =>
  async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
        .get(
          `${config.hostApi}/v1/affiliate/getsummarylogs?status=${status}&campaign_id=${campaignId}&page=${page}&limit=${limit}`
        )
        .then((res) => {
          resolve("success");
          dispatch({
            type: GET_AFFILIATE_TRANSACTIONS,
            payload: res.data,
          });
        })
        .catch(() => {
          dispatch({
            type: GET_AFFILIATE_TRANSACTIONS,
            payload: [],
          });
          reject("error");
        });
    });
    return promise;
  };

export const getAffiliateActiveCampaign = (status) => async (dispatch) => {
  axios
    .get(`${config.hostApi}/v1/affiliate/getallcampaigns?status=${status}`)
    .then((res) => {
      dispatch({
        type: GET_AFFILIATE_CAMPAIGNS,
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: GET_AFFILIATE_CAMPAIGNS,
        payload: [],
      });
    });
};

export const getActiveInfluencer = (campaignId) => async (dispatch) => {
  axios
    .get(
      `${config.hostApi}/v1/affiliate/getinfluencers?campaign_id=${campaignId}`
    )
    .then((res) => {
      dispatch({
        type: GET_AFFILIATE_INFLUENCER,
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: GET_AFFILIATE_INFLUENCER,
        payload: [],
      });
    });
};

export const getCampaignDetailTransactions =
  (campaignId = "", page = 1, limit = 12) =>
  async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
        .get(
          `${config.hostApi}/v1/affiliate/getdetaillogs?campaign_id=${campaignId}&page=${page}&limit=${limit}`
        )
        .then((res) => {
          resolve("success");
          dispatch({
            type: GET_CAMPAIGN_DETAIL_TRANSACTIONS,
            payload: res.data,
          });
        })
        .catch(() => {
          dispatch({
            type: GET_CAMPAIGN_DETAIL_TRANSACTIONS,
            payload: [],
          });
          reject("error");
        });
    });
    return promise;
  };

export const getInfluencerDetailTransactions =
  (
    influencerId = "",
    campaignId = "",
    transactionType = "",
    page = 1,
    limit = 12
  ) =>
  async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
        .get(
          `${config.hostApi}/v1/affiliate/getlogs?influencer_id=${influencerId}&campaign_id=${campaignId}&transaction_type=${transactionType}&page=${page}&limit=${limit}`
        )
        .then((res) => {
          resolve("success");
          dispatch({
            type: GET_INFLUENCER_DETAIL_TRANSACTIONS,
            payload: res.data,
          });
        })
        .catch(() => {
          dispatch({
            type: GET_INFLUENCER_DETAIL_TRANSACTIONS,
            payload: [],
          });
          reject("error");
        });
    });
    return promise;
  };
