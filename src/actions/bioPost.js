import axios from "axios";
import { CLEAR_NEW_BIO_POSTS, GET_NEW_BIO_POST } from "./type";
import config from "../config";

export const getNewBioPost =
  (page, id, clr, limit = 18, username) =>
  async (dispatch) => {
    try {
      if (id) {
        const res = await axios.get(
          `${config.hostApi}/v1/profile/filter/${username}`,
          {
            params: {
              limit: limit,
              page,
              post_type: "image,campaign,video",
              id,
            },
          }
        );
        if (clr) clr();
        dispatch({
          type: GET_NEW_BIO_POST,
          payload: res.data?.message?.result,
        });
      } else {
        const res = await axios.get(
          `${config.hostApi}/v1/profile/posts/${username}`,
          {
            params: {
              limit: limit,
              page,
              post_type: "image,campaign,video",
            },
          }
        );
        if (clr) clr();
        dispatch({
          type: GET_NEW_BIO_POST,
          payload: res.data?.message?.result,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const clearNewBioPost = () => async (dispatch) => {
  dispatch({
    type: CLEAR_NEW_BIO_POSTS,
    payload: {
      data: [],
      next: {},
    },
  });
};
