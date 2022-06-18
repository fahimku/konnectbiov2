import { GET_BALANCE_REQUEST } from "../../actions/type";
const initialState = { message: [] };

export default function affiliateBalance(state = initialState, action) {
  switch (action.type) {
    case GET_BALANCE_REQUEST:
      return action.payload;

    default:
      return state;
  }
}
