import axios from "axios";
import { GET_COUNTRIES } from "./type";
import config from "../config";

export const getCountries = () => async (dispatch) => {
  try {
    const res = await axios.get(`${config.baseURLApi}/campaigns/countries`);
    dispatch({
      type: GET_COUNTRIES,
      payload: res.data.message,
    });
  } catch (err) {
    console.log(err);
  }
};
