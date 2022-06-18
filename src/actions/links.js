import axios from "axios";
import { GET_LINK } from "./type";
import config from "../config";

export const getLinks =
  (page, id, clr, limit = 15) =>
  async (dispatch) => {
    try {
      const res = await axios.get(
        `${config.hostApi}/v1/users/receive/links`,
        {}
      );

      dispatch({
        type: GET_LINK,
        payload: res.data?.message,
      });
    } catch (err) {
      console.log(err);
    }
  };
