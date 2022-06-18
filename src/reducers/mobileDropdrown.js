import {GET_MOBILE_DROPDOWN} from "../actions/type";

const initialState = "instagram"

export default function mobileDropdown(state = initialState, action) {
  switch (action.type) {
    case GET_MOBILE_DROPDOWN:
      return action.payload
    default:
      return state;
  }
}
