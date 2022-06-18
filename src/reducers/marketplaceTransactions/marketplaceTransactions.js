import {
  GET_MARKETPLACE_TRANSACTIONS,
  MARKETPLACE_PAGINATION,
} from "../../actions/type";
// const initialState = { message: [], pagination: {} };

export default function marketplaceTransactions(state = [], action) {
  switch (action.type) {
    case GET_MARKETPLACE_TRANSACTIONS:
      return action.payload;
    case MARKETPLACE_PAGINATION:
      return {
        ...action.payload,
        message: [...state.message, ...action.payload.message],
      };
    case "clearMarketplaceTransactions":
      return { message: [], pagination: {} };
    default:
      return state;
  }
}
