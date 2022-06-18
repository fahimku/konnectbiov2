import axios from "axios";
import {DISCONNECT_FB} from "./type";

export const disconnectFb = () => async (dispatch) => {
  dispatch({
    type: DISCONNECT_FB,
    payload: 1,
  });
};
