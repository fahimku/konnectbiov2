import { GET_CAMPAIGN, DELETE_CAMPAIGN } from "../../actions/type";
const initialState = {};
export default function campaign(state = initialState, action) {
  switch (action.type) {
    case GET_CAMPAIGN:
      return action.payload;
    case DELETE_CAMPAIGN:
      return action.payload;
    default:
      return state;
  }
}
