import { GET_AFFILIATE_BILLING_DETAIL } from "../../actions/type";
const initialState = { message: {}, success: false };

export default function affiliateBillingDetail(state = initialState, action) {
  switch (action.type) {
    case GET_AFFILIATE_BILLING_DETAIL:
      return action.payload;
    default:
      return state;
  }
}
