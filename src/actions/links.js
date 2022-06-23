import axios from "axios";
import { GET_LINK } from "./type";
import config from "../config";

export const getLinks = (username) => async (dispatch) => {
  try {
    const res = await axios.get(
      `${config.hostApi}/v1/profile/posts/${username}`,
      {
        params: {
          post_type: "link",
        },
      }
    );

    dispatch({
      type: GET_LINK,
      payload: res.data?.message.result.data,
    });
  } catch (err) {
    console.log(err);
  }
};
