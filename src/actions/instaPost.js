import axios from "axios";
import { GET_INSTA_POST } from "./type";
import config from "../config";

export const createMedia = (data) => async (dispatch) => {
  // const token = localStorage.getItem("token");
  const body = new FormData();
  body.append("title", data.title);
  body.append("image", data.image);
  const res = await axios.post(`${config.hostApi}/v1/library/reserve`, body);
  return res;
};

export const getMedia =
  (status, page = 1, limit = 8) =>
  async (dispatch) => {
    // const token = localStorage.getItem("token");

    const res = await axios.get(
      `${config.hostApi}/v1/library/receive?status=${status}&limit=${limit}&page=${page}`
    );
    dispatch({
      type: GET_INSTA_POST,
      payload: res.data.message,
    });
  };

export const deleteMedia = (id) => async (dispatch) => {
  // const token = localStorage.getItem("token");

  const res = await axios.delete(`${config.hostApi}/v1/library/remove/${id}`);
  return res;
};
