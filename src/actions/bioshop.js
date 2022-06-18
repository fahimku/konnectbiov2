import axios from "axios";
import {
  GET_BIO_SHOP,
  GET_SINGLE_BIO_SHOP,
  DELETE_SINGLE_BIO_SHOP,
  CLEAR_BIO_SHOP,
  CLEAR_SINGLE_BIO_SHOP,
} from "./type";
import config from "../config";

export const getBioShop = (page, clear) => async (dispatch) => {
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
      type: GET_BIO_SHOP,
      payload: res.data?.message?.result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getSingleBioShop = (mediaId, clear) => async (dispatch) => {
  try {
    if (clear) {
      clear();
    } else {
      const res = await axios.get(
        `${config.hostApi}/v1/posts/retrieve/${mediaId}`
      );
      dispatch({
        type: GET_SINGLE_BIO_SHOP,
        payload: res.data?.message,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteSingleBioShop = (post_id) => async (dispatch) => {
  try {
    await axios.delete(`${config.hostApi}/v1/posts/remove/${post_id}`);
    dispatch({
      type: DELETE_SINGLE_BIO_SHOP,
      payload: { post_id },
    });
  } catch (err) {
    console.log(err);
  }
};

export const clearBioShop = () => async (dispatch) => {
  dispatch({
    type: CLEAR_BIO_SHOP,
    payload: {
      data: [],
      next: {},
    },
  });
};

export const clearSingleBioShop = () => async (dispatch) => {
  dispatch({
    type: CLEAR_SINGLE_BIO_SHOP,
    payload: { data: [] },
  });
};
