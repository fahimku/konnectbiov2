import {
   GET_CAT_BRAND
  } from "../../actions/type";
  //const initialState = { message: [], pagination: {} };
  
  export default function categoriesById(state = [], action) {
    switch (action.type) {
      case GET_CAT_BRAND:
        return action.payload;
      
      default:
        return state;
    }
  }
  