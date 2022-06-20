import { GET_USER_INFO } from "../../actions/type";

const initialState = {};

export default function userInfo(state = initialState, action) {
  switch (action.type) {
    case GET_USER_INFO:
      return action.payload;
    default:
      return state;
  }
}
