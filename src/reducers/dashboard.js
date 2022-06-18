import { GET_DASHBOARD_DATA } from "../actions/type";
const initialState = {};
export default function getDashboard(state = initialState, action) {
    switch (action.type) {
        case GET_DASHBOARD_DATA:
            return action.payload;
        default:
            return state
    }
}