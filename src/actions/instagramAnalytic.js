import axios from "axios";
import {
  GET_INSTAGRAM_ANALYTIC,
  GET_INSTAGRAM_PAGINATION,
  FILTER_INSTAGRAM_ANALYTIC,
} from "./type";
import config from "../config";

export const getInstagramAnalytic =
  (url, next_media, limit) => async (dispatch, getState) => {
    // if (getState().instagramAnalytic.success || url) {
    const res = await axios.post(
      `${config.baseURLApi}/graph/ig/analytics/media`,
      {
        url: url,
        next_media: next_media,
        limit: limit ? limit : undefined,
      }
    );
    if (url) {
      dispatch({
        type: GET_INSTAGRAM_PAGINATION,
        payload: res.data,
      });
    } else {
      dispatch({
        type: GET_INSTAGRAM_ANALYTIC,
        payload: res.data,
      });
    }
    // }
  };
export const filterInstagramAnalytic = (data) => async (dispatch) => {
  dispatch({
    type: FILTER_INSTAGRAM_ANALYTIC,
    payload: data,
  });
};
