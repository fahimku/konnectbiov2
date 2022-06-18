import axios from "axios";
import { GET_MARKETPLACE_APPROVAL } from "./type";
import config from "../config";

export const getMarketplaceApproval =
  (status = "", page, limit) =>
  async (dispatch) => {
    axios
      .post(
        `${config.hostApi}/v1/users/marketPlace/allrequests?status=${status}&page=${page}&limit=${limit}`
      )
      .then((res) => {
        dispatch({
          type: GET_MARKETPLACE_APPROVAL,
          payload: res.data,
        });
      })
      .catch(() => {
        dispatch({
          type: GET_MARKETPLACE_APPROVAL,
          payload: [],
        });
      });
  };
