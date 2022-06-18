import { GET_INSTA_POST } from "../../actions/type";

const initialState = []

export default function gallery(state = initialState, action) {
  switch (action.type) {
    case GET_INSTA_POST:
        return action.payload
    default:
      return state;
  }
}
