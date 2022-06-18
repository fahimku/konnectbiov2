import { GET_TAGS, GET_TAGS_PAGINATION } from "../../actions/type";

const initialState = {message:[],pagination:{}}

export default function tags(state = initialState, action) {
  switch (action.type) {
    case GET_TAGS:
        return action.payload
    case GET_TAGS_PAGINATION:
      return {
        ...action.payload,
        message:[...state.message,...action.payload.message]
      }
    default:
      return state;
  }
}
