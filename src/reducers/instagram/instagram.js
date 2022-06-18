import { GET_INSTAGRAM_URL } from "../../actions/type";
const initialState = {}
export default function instagram(state = initialState, action) {
  switch (action.type) {
    case GET_INSTAGRAM_URL:
      return action.payload
    default:
      return state;
  }
}