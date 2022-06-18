import {
  GET_INFLUENCER_DETAIL_TRANSACTIONS,
  GET_INFLUENCER_DETAIL_PAGINATION,
} from "../../actions/type";
const initialState = { message: [], pagination: {} };

export default function influencerDetailTransactions(
  state = initialState,
  action
) {
  switch (action.type) {
    case GET_INFLUENCER_DETAIL_TRANSACTIONS:
      return action.payload;
    case GET_INFLUENCER_DETAIL_PAGINATION:
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
