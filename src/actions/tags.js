import axios from "axios";
import { GET_TAGS, GET_TAGS_PAGINATION } from "./type";
import config from "../config";

export const getTags = (data, page, pagination) => async (dispatch) => {
  const res = await axios.post(`${config.hostApi}/v1/graph/tag/getall`, data, {
    params: {
      limit: 50,
      page,
    },
  });
  if (pagination) {
    dispatch({
      type: GET_TAGS_PAGINATION,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_TAGS,
      payload: res.data,
    });
  }
};

export const createTags = () => async (dispatch) => {
  const res = axios.post(`${config.hostApi}/v1/graph/tag/create`);
  return res;
};

export const refreshTags = () => async (dispatch) => {
  const res = axios.post(`${config.hostApi}/v1/graph/tag/refresh`);
  return res;
};
