import { GET_CAMPAIGN_SUMMARY } from "../../actions/type";
const initialState = { loading: false, campaign_summary: [] };
export default function campaign(state = initialState, action) {
  switch (action.type) {
    case GET_CAMPAIGN_SUMMARY:
      // return action.payload;
      return {
        campaign_summary: action.payload,
        loading: true,
      };

    default:
      return state;
  }
}
