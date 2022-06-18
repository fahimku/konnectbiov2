import { GET_AFFILIATE_CAMPAIGNS } from "../../actions/type";
const initialState = { message: [], pagination: {} };
export default function affiliateCampaigns(state = initialState, action) {
    switch (action.type) {
        case GET_AFFILIATE_CAMPAIGNS:
            return [{ value: "", label: "ALL" }, ...action.payload.message.map(({ campaign_id, campaign_name }) => {
                return {
                    value: campaign_id, label: campaign_name
                };
            })]

        default:
            return state;
    }
}