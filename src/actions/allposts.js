import axios from "axios";
import {GET_BIO_POST,GET_SINGLE_BIO_POST,DELETE_SINGLE_BIO_POST,CLEAR_BIO_POST,CLEAR_SINGLE_BIO_POST} from "./type";
import config from "../config";

export const getBioPosts = (page, clear) => async (dispatch) => {
  try {
    const res = await axios.get(`${config.hostApi}/v1/shop/posts`, {
      params: {
        limit: 15,
        page,
        post_type: "image,campaign",
      },
    });
    if (clear) clear();
    dispatch({
      type: GET_BIO_POST,
      payload: res.data?.message?.result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getSingleBioPost = (mediaId, clear) => async (dispatch) => {
  try {
    if (clear) {
      clear();
    } else {
      const res = await axios.get(
        `${config.hostApi}/v1/posts/retrieve/${mediaId}`
      );
      dispatch({
        type: GET_SINGLE_BIO_POST,
        payload: res.data?.message,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteSingleBioPost= (post_id) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `${config.hostApi}/v1/posts/remove/${post_id}`
    );
    dispatch({
      type: DELETE_SINGLE_BIO_POST,
      payload: { post_id },
    });
  } catch (err) {
    console.log(err);
  }
};

export const clearBioPost = () => async (dispatch) => {
  dispatch({
    type: CLEAR_BIO_POST,
    payload: {
      data: [],
      next: {},
    },
  });
};

export const clearSingleBioPost    = () => async (dispatch) => {
  dispatch({
    type: CLEAR_SINGLE_BIO_POST,
    payload: { data: [] },
  });
};