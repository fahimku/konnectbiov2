import {
  GET_MARKETPLACE_APPROVAL,
  GET_MARKETPLACE_APPROVAL_PAGINATION,
} from "../../actions/type";
// const initialState = { message: [] };

export default function marketplaceApproval(state = [], action) {
  switch (action.type) {
    case GET_MARKETPLACE_APPROVAL:
      return action.payload;
    case GET_MARKETPLACE_APPROVAL_PAGINATION:
      return {
        ...action.payload,
        message: [...state.message, ...action.payload.message],
      };

    default:
      return state;
  }
}
