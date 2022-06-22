import { CLEAR_NEW_BIO_POSTS, GET_NEW_BIO_POST } from "../../actions/type";

const initialState = {
  data: [],
  next: {},
};

export default function bioPosts(state = initialState, action) {
  switch (action.type) {
    case GET_NEW_BIO_POST:
      return {
        ...action.payload,
        data: [...state.data, ...action.payload.data],
      };
    case CLEAR_NEW_BIO_POSTS:
      return action.payload;

    default:
      return state;
  }
}
