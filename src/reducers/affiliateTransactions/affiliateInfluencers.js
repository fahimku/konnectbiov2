import { GET_AFFILIATE_INFLUENCER } from "../../actions/type";
const initialState = { message: [], pagination: {} };
export default function affiliateInfluencers(state = initialState, action) {
    switch (action.type) {
        case GET_AFFILIATE_INFLUENCER:
            return [{ value: "", label: "ALL" }, ...action.payload.message.map(({ influencer_id, instagram_username }) => {
                return {
                    value: influencer_id, label: instagram_username
                };
            })]
        default:
            return state;
    }
}