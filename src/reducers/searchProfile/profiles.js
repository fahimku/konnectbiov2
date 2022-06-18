import { FILTER_PROFILE_MEDIA, SEARCH_PROFILE } from "../../actions/type";
const initialState = {};

export default function profiles(state = initialState, action) {
  switch (action.type) {
    case SEARCH_PROFILE:
      return {
        ...action.payload,
        media: {
          ...action.payload.media,
          data: [...action.payload.media.data].slice(0, 50),
        },
        store: [...action.payload.media?.data],
      };
    case FILTER_PROFILE_MEDIA:
      if (action.payload) {
        return {
          ...state,
          media: {
            data: [...state.store]
              .sort((a, b) => {
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
              })
              .slice(0, 50),
          },
        };
      } else {
        return {
          ...state,
          media: {
            data: [...state.store],
          },
        };
      }
    case "clearProfile":
      return { message: [] };
    default:
      return state;
  }
}
