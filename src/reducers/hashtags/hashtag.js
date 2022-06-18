import { GET_HASHTAG, HASH_PAGINATION } from "../../actions/type";

const initialState = { message: [], pagination: {} };

export default function hashtag(state = initialState, action) {
  switch (action.type) {
    case GET_HASHTAG:
      return action.payload;
    case HASH_PAGINATION:
      return {
        ...action.payload,
        message: [...state.message, ...action.payload.message],
      };
    case "clearHashtag":
      return { message: [], pagination: {} };
    default:
      return state;
  }
}
