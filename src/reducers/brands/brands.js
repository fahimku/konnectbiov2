import { GET_USER_BRANDS } from "../../actions/type";
const initialState = [];
export default function brands(state = initialState, action) {
    switch (action.type) {
        case GET_USER_BRANDS:
            return [{ value: "all", label: "ALL" }, ...action.payload.map(({ brand_id, brand_name }) => {
                return {
                    value: brand_id, label: brand_name
                };
            })]
        default:
            return state
    }
}