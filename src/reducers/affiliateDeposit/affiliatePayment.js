import { GET_PAYMENT_METHOD } from "../../actions/type";
const initialState = { message: [] };

export default function affiliatePayment(state = initialState, action) {
  switch (action.type) {
      
      case GET_PAYMENT_METHOD:
      return action.payload;

    default:
      return state;
  }
}
