import { ACTIVATE_DEACTIVATE_CAMPAIGN } from "../../actions/type";
const initialState = {};
export default function addCampaignToShop(state = initialState, action) {
    switch (action.type) {
        case ACTIVATE_DEACTIVATE_CAMPAIGN:
            return action.payload;
        default:
            return state
    }
}