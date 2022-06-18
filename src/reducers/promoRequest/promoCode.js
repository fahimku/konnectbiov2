import { GET_PROMO_REQUEST } from "../../actions/type";
//const initialState = { message: [], pagination: {} };

export default function promoRequest(state = [], action) {
  //  console.log('red',action)
  switch (action.type) {
    case GET_PROMO_REQUEST:
      return action.payload;

    default:
      return state;
  }
}
