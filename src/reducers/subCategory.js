import { GET_SUB_CATEGORIES } from "../actions/type";
const initialState = [];
export default function subcategories(state = initialState, action) {
    switch (action.type) {
        case GET_SUB_CATEGORIES:
            return [{ value: "all", label: "ALL" }, ...action.payload.map(({ sub_category_id, sub_category_name }) => {
                return {
                    value: sub_category_id, label: sub_category_name
                };
            })]
        default:
            return state
    }
}