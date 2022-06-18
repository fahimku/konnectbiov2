import { CLEAR_POST, GET_POST, UPDATE_POST } from "../../actions/type";

const initialState = {
  data: [],
  next: {},
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POST:
      return {
        ...action.payload,
        data: [...state.data, ...action.payload.data],
      };
    case CLEAR_POST:
      return action.payload;
    case UPDATE_POST:
      const data = [...state.data].map((item) => {
        if (item.post_id === action.payload.post_id) {
          return {
            ...item,
            linked: true,
          };
        }
        return item;
      });
      return { ...state, data: data };
    default:
      return state;
  }
}
