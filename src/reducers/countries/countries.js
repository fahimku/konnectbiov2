import { GET_COUNTRIES } from "../../actions/type";

const initialState = []

export default function countries(state = initialState, action) {
  switch (action.type) {
    case GET_COUNTRIES:
      return action.payload.map(({ name, code1 }) => {
        return { value: code1, label: name };
      });
    default:
      return state;
  }
}
