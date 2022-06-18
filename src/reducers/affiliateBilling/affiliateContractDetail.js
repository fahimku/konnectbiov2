import { GET_AFFILIATE_CONTRACT_DETAIL } from "../../actions/type";
const initialState = { message: {}, success: false };

export default function affiliateContractDetail(state = initialState, action) {
  switch (action.type) {
    case GET_AFFILIATE_CONTRACT_DETAIL:
      return action.payload;
    default:
      return state;
  }
}
