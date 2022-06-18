import {
  GET_INSTAGRAM_ANALYTIC,
  GET_INSTAGRAM_PAGINATION,
  FILTER_INSTAGRAM_ANALYTIC,
} from "../../actions/type";
const initialState = {
  loading: true,
  insta_data: [],
  insta_dat2: [],
  pagination: {},
  success: true,
};
export default function instagramAnalytic(state = initialState, action) {
  switch (action.type) {
    case GET_INSTAGRAM_ANALYTIC:
      return {
        insta_data: action.payload.message.data.slice(0, 50),
        insta_data2: action.payload.message.data,
        pagination: action.payload.message.paging,
        loading: false,
        success: false,
      };
    case GET_INSTAGRAM_PAGINATION:
      return {
        insta_data: [...state.insta_data, ...action.payload.message.data],
        insta_data2: [...state.insta_data, ...action.payload.message.data],
        pagination: action.payload.message.paging,
        loading: false,
        success: false,
      };
    case FILTER_INSTAGRAM_ANALYTIC:
      if (action.payload) {
        return {
          ...state,
          insta_data: [...state.insta_data2]
            .slice(0, action.payload.limit_by)
            .sort((a, b) => {
              if (action.payload?.order_by === "asc")
                return action.payload.sort === "timestamp"
                  ? new Date(a[action.payload?.sort]) -
                      new Date(b[action.payload?.sort])
                  : action.payload.sort === "engagement"
                  ? a.insights[0][action.payload?.sort] -
                    b.insights[0][action.payload?.sort]
                  : action.payload.sort === "impressions"
                  ? a.insights[1][action.payload?.sort] -
                    b.insights[1][action.payload?.sort]
                  : action.payload.sort === "reach"
                  ? a.insights[2][action.payload?.sort] -
                    b.insights[2][action.payload?.sort]
                  : a[action.payload?.sort] - b[action.payload?.sort];
              else
                return action.payload.sort === "timestamp"
                  ? new Date(b[action.payload?.sort]) -
                      new Date(a[action.payload?.sort])
                  : action.payload.sort === "engagement"
                  ? b.insights[0][action.payload?.sort] -
                    a.insights[0][action.payload?.sort]
                  : action.payload.sort === "impressions"
                  ? b.insights[1][action.payload?.sort] -
                    a.insights[1][action.payload?.sort]
                  : action.payload.sort === "reach"
                  ? b.insights[2][action.payload?.sort] -
                    a.insights[2][action.payload?.sort]
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
