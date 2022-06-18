import { GET_LINK } from "../../actions/type";

const initialState = [];

export default function links(state = initialState, action) {
  switch (action.type) {
    case GET_LINK:
      return action.payload;

    default:
      return state;
  }
}
