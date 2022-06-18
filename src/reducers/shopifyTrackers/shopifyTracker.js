import {
    GET_SHOPIFY_TRACKER,
  } from "../../actions/type";
  //const initialState = { message: [], pagination: {} };
  
  export default function shopifyTracker(state = [], action) {
    // console.log(action)
    switch (action.type) {
        
      case GET_SHOPIFY_TRACKER:
        console.log(action.payload)  
      return action.payload;
     
      default:
        return state;
    }
  }
  