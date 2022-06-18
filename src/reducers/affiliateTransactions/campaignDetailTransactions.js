import {
  GET_CAMPAIGN_DETAIL_TRANSACTIONS,
  GET_CAMPAIGN_DETAIL_PAGINATION,
} from "../../actions/type";
const initialState = { message: [], pagination: {} };

export default function campaignDetailTransactions(
  state = initialState,
  action
) {
  switch (action.type) {
    case GET_CAMPAIGN_DETAIL_TRANSACTIONS:
      return action.payload;
    case GET_CAMPAIGN_DETAIL_PAGINATION:
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
