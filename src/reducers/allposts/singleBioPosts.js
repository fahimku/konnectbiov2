import { GET_SINGLE_BIO_SHOP, CLEAR_SINGLE_BIO_SHOP } from "../../actions/type";
const initialState = {
    data: [],
};
export default function singleBioShop(state = initialState, action) {
    switch (action.type) {
        case GET_SINGLE_BIO_SHOP:
            return {
                ...action.payload
            };
        case CLEAR_SINGLE_BIO_SHOP:
            return action.payload;
        default:
            return state;
    }
}