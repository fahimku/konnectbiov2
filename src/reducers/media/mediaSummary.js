import { GET_MEDIA_SUMMARY } from "../../actions/type";
const initialState = { loading: false, media_summary: [] };
export default function campaign(state = initialState, action) {
  switch (action.type) {
    case GET_MEDIA_SUMMARY:
      // return action.payload;
      return {
        media_summary: action.payload,
        loading: true,
      };

    default:
      return state;
  }
}
