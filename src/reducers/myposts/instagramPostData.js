import {
  GET_INSTAGRAM_POST,
  GET_INSTAGRAM_POST_PAGINATION,
  FILTER_INSTAGRAM_POST_DATA,
} from "../../actions/type";
const initialState = {
  loading: true,
  insta_data: [],
  insta_dat2: [],
  pagination: {},
  success: true,
};
export default function instagramPostData(state = initialState, action) {
  switch (action.type) {
    case GET_INSTAGRAM_POST:
      return {
        insta_data: action.payload.message.data,
        insta_data2: action.payload.message.data,
        pagination: action.payload.message.paging,
        loading: false,
        success: false,
      };
    case GET_INSTAGRAM_POST_PAGINATION:
      return {
        insta_data: [...state.insta_data, ...action.payload.message.data],
        insta_data2: [...state.insta_data, ...action.payload.message.data],
        pagination: action.payload.message.paging,
        loading: false,
        success: false,
      };
    case FILTER_INSTAGRAM_POST_DATA:
      if (action.payload) {
        return {
          ...state,
          insta_data: [...state.insta_data].sort((a, b) => {
            if (action.payload?.order_by === "asc")
              return action.payload.sort === "timestamp"
              ? new Date(a[action.payload?.sort]) -
              new Date(b[action.payload?.sort])
          : a[action.payload?.sort] - b[action.payload?.sort];
            else
              return action.payload.sort === "timestamp"
              ? new Date(b[action.payload?.sort]) -
              new Date(a[action.payload?.sort])
          : b[action.payload?.sort] - a[action.payload?.sort];
          }),
          loading: false,
          success: false,
        };
      } else {
        return {
          ...state,
          insta_data: [...state.insta_data2],
          loading: false,
          success: false,
        };
      }
    default:
      return state;
  }
}
