import { GET_SHOPIFY_DETAIL } from "../../actions/type";
const initialState = { message: {}, success: false };

export default function shopifyDetail(state = initialState, action) {
  switch (action.type) {
    case GET_SHOPIFY_DETAIL:
      return action.payload;
    default:
      return state;
  }
}
