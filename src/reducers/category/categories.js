import { GET_CATEGORIES, GET_USER_CATEGORIES,GET_USER_CATEGORIES2 } from "../../actions/type";
const initialState = [];
export default function categories(state = initialState, action) {
    switch (action.type) {
        case GET_CATEGORIES:
            return action.payload;
        case GET_USER_CATEGORIES2:
            return action.payload;
        case GET_USER_CATEGORIES:
            return [{ value: "all", label: "ALL" }, ...action.payload.map(({ category_id, category_name }) => {
                return {
                    value: category_id, label: category_name
                };
            })]
        default:
            return state
    }
}