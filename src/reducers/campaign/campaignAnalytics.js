import { GET_CAMPAIGN_ANALYTICS } from "../../actions/type";
const initialState = { loading: false, campaign_analytic: [] };
export default function campaign(state = initialState, action) {
  switch (action.type) {
    case GET_CAMPAIGN_ANALYTICS:
      return {
        campaign_analytic: action.payload,
        loading: true,
      };

    default:
      return state;
  }
}
