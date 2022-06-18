import { GET_BIOSHOP_SUMMARY } from "../../actions/type";
const initialState = { loading: false, bioshop_summary: [] };
export default function campaign(state = initialState, action) {
  switch (action.type) {
    case GET_BIOSHOP_SUMMARY:
      // return action.payload;
      return {
        bioshop_summary: action.payload,
        loading: true,
      };

    default:
      return state;
  }
}
