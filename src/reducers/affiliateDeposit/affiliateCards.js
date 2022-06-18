import { GET_AFFILIATE_CARDS } from "../../actions/type";
const initialState = { message: [] };

export default function affiliateCards(state = initialState, action) {
  switch (action.type) {
    case GET_AFFILIATE_CARDS:
      return action.payload;

    default:
      return state;
  }
}
