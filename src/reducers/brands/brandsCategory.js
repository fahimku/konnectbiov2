import { GET_BRANDS_CATEGORY } from "../../actions/type";
const initialState = [];
export default function brands(state = initialState, action) {
    switch (action.type) {
        case GET_BRANDS_CATEGORY:
            return [{ value: "all", label: "ALL" }, ...action.payload.map(({ category_id, category_name }) => {
                return {
                    value: category_id, label: category_name
                };
            })]
        default:
            return state
    }
}