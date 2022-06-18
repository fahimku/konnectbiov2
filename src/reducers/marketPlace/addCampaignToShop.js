import { ADD_CAMPAIGN_TO_SHOP } from "../../actions/type";
const initialState = {};
export default function addCampaignToShop(state = initialState, action) {
    switch (action.type) {
        case ADD_CAMPAIGN_TO_SHOP:
            return action.payload;
        default:
            return state
    }
}