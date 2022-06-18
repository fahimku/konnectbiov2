import { ADD_AFFILIATE_REQUEST } from "../../actions/type";
//const initialState = { message: [], pagination: {} };

export default function addAffiliateRequest(state = [], action) {
  // console.log(action)
  switch (action.type) {
    case ADD_AFFILIATE_REQUEST:
      return action.payload;

    // case AFFILIATE_PAGINATION:
    //   return {
    //     ...action.payload,
    //     message: [...state.message, ...action.payload.message],
    //   };
    // case "clearAffiliateTransactions":
    //   return { message: [], pagination: {} };
    default:
      return state;
  }
}
