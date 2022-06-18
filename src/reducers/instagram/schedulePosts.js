import { GET_SCHEDULE_POST } from "../../actions/type";

const initialState = []

export default function schedulePosts(state = initialState, action) {
  switch (action.type) {
    case GET_SCHEDULE_POST:
        return action.payload.message
    default:
      return state;
  }
}
