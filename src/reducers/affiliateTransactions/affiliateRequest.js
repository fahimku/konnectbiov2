import {
  GET_AFFILIATE_REQUEST,
  GET_AFFILIATE_REQUEST_PAGINATION,
  // ADD_AFFILIATE_REQUEST,
} from "../../actions/type";
//const initialState = { message: [], pagination: {} };

export default function affiliateRequest(state = [], action) {
  // console.log(action)
  switch (action.type) {
    case GET_AFFILIATE_REQUEST:
      return action.payload;

    case GET_AFFILIATE_REQUEST_PAGINATION:
      return {
        ...action.payload,
        message: [...state.message, ...action.payload.message],
      };
    // case "clearAffiliateTransactions":
    //   return { message: [], pagination: {} };
    default:
      return state;
  }
}
