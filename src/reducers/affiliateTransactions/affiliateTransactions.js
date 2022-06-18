import { GET_AFFILIATE_TRANSACTIONS, AFFILIATE_PAGINATION } from "../../actions/type";
const initialState = { message: [], pagination: {} };

export default function affiliateTransactions(state = initialState, action) {
  switch (action.type) {
    case GET_AFFILIATE_TRANSACTIONS:
      return action.payload;
    case AFFILIATE_PAGINATION:
      return {
        ...action.payload,
        message: [...state.message, ...action.payload.message],
      };
    case "clearAffiliateTransactions":
      return { message: [], pagination: {} };
    default:
      return state;
  }
}