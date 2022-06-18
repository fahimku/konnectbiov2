import axios from "axios";
import { GET_MOBILE_DROPDOWN } from "./type";
import config from "../config";


export const getMobileDropdown = (v) => async (dispatch) => {
    dispatch({
        type:GET_MOBILE_DROPDOWN,
        payload:v
    })
};
