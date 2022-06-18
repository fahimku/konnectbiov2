import { GET_HASHTAGS } from "../../actions/type";

const initialState = {message:[]}

export default function hashtags(state = initialState, action) {
  switch (action.type) {
    case GET_HASHTAGS:
        return action.payload
    default:
      return state;
  }
}
