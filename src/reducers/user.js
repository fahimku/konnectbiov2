const defaultState = {
  user: [],
};

export default function userReducer(state = defaultState, action) {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        user: [...state.user, action.payload],
      };
    case "DELETE_USER":
      return {
        ...state,
        ...state.user.filter((user) => user !== action.payload),
      };
    default:
      return state;
  }
}