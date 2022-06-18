import {
  GET_AFFILIATE_SALES_INF,
  GET_AFFILIATE_SALES_INF_PAGINATION,
} from "../../actions/type";
const initialState = { message: [] };

export default function affiliateSalesInf(state = initialState, action) {
  // console.log(action)
  switch (action.type) {
    case GET_AFFILIATE_SALES_INF:
      return action.payload;
    case GET_AFFILIATE_SALES_INF_PAGINATION:
      return {
        ...action.payload,
        message: [...state.message, ...action.payload.message],
      };

    default:
      return state;
  }
}
