import axios from "axios";
import { GET_CAMPAIGN, DELETE_CAMPAIGN } from "./type";
import config from "../config";

export const getCampaign = (id) => async (dispatch) => {
  try {
    const res = await axios.get(
      `${config.baseURLApi}/campaigns/retrieve/${id}`
    );
    dispatch({
      type: GET_CAMPAIGN,
      payload: res.data.message,
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteCampaign = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${config.baseURLApi}/campaigns/remove/${id}`);
    dispatch({
      type: DELETE_CAMPAIGN,
      payload: res.data.message,
    });
  } catch (err) {
    console.log(err);
  }
};
