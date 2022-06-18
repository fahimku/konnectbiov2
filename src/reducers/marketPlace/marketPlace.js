import { GET_MARKET_PLACE } from "../../actions/type";
const initialState = {};
export default function marketPlace(state = initialState, action) {
    switch (action.type) {
        case GET_MARKET_PLACE:
            return action.payload;
        default:
            return state
    }
}