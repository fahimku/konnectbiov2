import { GET_MARKETPLACE_BRAND } from "../../actions/type";
const initialState = { message: [], pagination: {} };
export default function marketplaceBrands(state = initialState, action) {
  switch (action.type) {
    case GET_MARKETPLACE_BRAND:
      return [
        { value: "", label: "ALL" },
        ...action.payload.message.map(({ brand_id, brand_name }) => {
          return {
            value: brand_id,
            label: brand_name,
          };
        }),
      ];
    default:
      return state;
  }
}
