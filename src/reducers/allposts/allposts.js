import { GET_BIO_SHOP, DELETE_SINGLE_BIO_SHOP, CLEAR_BIO_SHOP } from "../../actions/type";

const initialState = {
    data: [],
    next: {},
};

export default function bioshop(state = initialState, action) {
    switch (action.type) {
        case GET_BIO_SHOP:
            return {
                ...action.payload,
                data: [...state.data, ...action.payload.data],
            };
        case CLEAR_BIO_SHOP:
            return action.payload;
        case DELETE_SINGLE_BIO_SHOP:
            const data = [...state.data].filter((item) => {
                return item.post_id !== action.payload.post_id
            });
            return { ...state, data: data };

        default:
            return state;
    }
}