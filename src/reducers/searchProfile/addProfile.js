import { GET_PROFILES, DELETE_PROFILES } from "../../actions/type";
const initialState = { message: [] };
export default function profile(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILES:
      return action.payload;
    case DELETE_PROFILES:
      const Data = [...state.Data].filter(
        (item) => item._id !== action.payload
      );
      return { ...state, Data };
    default:
      return state;
  }
}
