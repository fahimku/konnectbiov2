import {
  GET_AFFILIATE_SALES,
  GET_AFFILIATE_SALES_PAGINATION,
} from "../../actions/type";
//const initialState = { message: [], pagination: {} };

export default function affiliateSales(state = [], action) {
  // console.log(action)
  switch (action.type) {
    case GET_AFFILIATE_SALES:
      return action.payload;
    case GET_AFFILIATE_SALES_PAGINATION:
      return {
        ...action.payload,
        message: [...state.message, ...action.payload.message],
      };

    default:
      return state;
  }
}
