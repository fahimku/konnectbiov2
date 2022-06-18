import axios from "axios";
import { GET_MARKET_PLACE, ADD_CAMPAIGN_TO_SHOP, ACTIVATE_DEACTIVATE_CAMPAIGN } from "./type";
import config from "../config";

export const addCampaignToShop = (campaignId, categoryId, advertiserId) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/users/marketPlace/campaignPost`, {
        campaign_id: campaignId,
        category_id: categoryId,
        advertiser_id: advertiserId,
      })
      .then((response) => {
        dispatch({
          type: ADD_CAMPAIGN_TO_SHOP,
          payload: response?.data?.message
        })
        resolve("success");
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};


export const activateDeactivateCampaign = (campaignId, status) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/users/marketPlace/pauseAndResumeCampaignPost`, {
        is_active: !status,
        campaign_id: campaignId
      })
      .then((response) => {
        dispatch({
          type: ACTIVATE_DEACTIVATE_CAMPAIGN,
          payload: response?.data?.message
        })
        resolve(response?.data?.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};

export const getMarketPlace = (page, limit, categoryId, sortBy, orderBy, startDate, endDate, type, brandId, endPoint) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(
        `${config.baseURLApi}/${endPoint}?limit=${limit}&page=${page}`,
        {
          start_date: startDate,
          end_date: endDate,
          category_id: categoryId,
          sort_by: sortBy,
          order_by: orderBy,
          key: type,
          brand_id: brandId
        }).then((res) => {
          dispatch({
            type: GET_MARKET_PLACE,
            payload: res.data
          })
          resolve('success');
        }).catch((error) => {
          reject(error)
        })
  });
  return promise;
};