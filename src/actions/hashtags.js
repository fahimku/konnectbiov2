import axios from "axios";
import { GET_HASHTAGS, GET_HASHTAG, HASH_PAGINATION } from "./type";
import config from "../config";

export const getHashtags = () => async (dispatch) => {
  axios
    .post(`${config.hostApi}/v1/graph/hash/getall`)
    .then((res) => {
      dispatch({
        type: GET_HASHTAGS,
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: GET_HASHTAGS,
        payload: [],
      });
    });
};

export const createHashtag = (hashtag) => async (dispatch) => {
  const res = axios.post(`${config.hostApi}/v1/graph/hash/create`, {
    hashtag: hashtag.toLocaleLowerCase(),
  });
  return res;
};

export const deleteHash = (hashtag_id) => async (dispatch) => {
  return axios.post(`${config.hostApi}/v1/graph/hash/delete`, {
    hashtag_id,
  });
};

export const clearHashtag = () => async (dispatch) => {
  dispatch({
    type: "clearHashtag",
  });
};

export const getHashtag = (data, page, pagination) => async (dispatch) => {
  const res = await axios.post(`${config.hostApi}/v1/graph/hash/getone`, data, {
    params: {
      limit: 50,
      page,
    },
  });
  if (pagination) {
    dispatch({
      type: HASH_PAGINATION,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_HASHTAG,
      payload: res.data,
    });
  }
};
