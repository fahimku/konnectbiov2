export const ADD_USER_INFO = "ADD_USER_INFO";
export const DELETE_USER_INFO = "DELETE_USER_INFO";

export const addUserInfo = (payload) => {
  return {
    type: ADD_USER_INFO,
    payload,
  };
};

export const deleteUserInfo = (payload) => {
  return {
    type: DELETE_USER_INFO,
    payload,
  };
};
