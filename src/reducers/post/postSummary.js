import { GET_POST_SUMMARY } from "../../actions/type";
const initialState = { loading: false, post_summary: [] };
export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POST_SUMMARY:
      return {
        post_summary: action.payload,
        loading: true,
      };

    default:
      return state;
  }
}
