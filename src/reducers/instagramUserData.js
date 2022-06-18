import { GET_INSTAGRAM_USER_DATA } from "../actions/type";
const initialState = { loading: false, instagram_user: [] };
export default function instagramUserData(state = initialState, action) {
  switch (action.type) {
    case GET_INSTAGRAM_USER_DATA:
      return {
        instagram_user: action.payload,
        loading: true,
      };

    default:
      return state;
  }
}
