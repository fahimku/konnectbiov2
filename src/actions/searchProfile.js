import axios from "axios";
import {
  FILTER_PROFILE_MEDIA,
  SEARCH_PROFILE,
  GET_PROFILES,
  DELETE_PROFILES,
} from "./type";
import config from "../config";
/* Add Profile**/

export const getProfiles = () => async (dispatch) => {
  const res = await axios.post(
    `${config.hostApi}/v1/graph/monitorProfile/getProfileList`
  );
  dispatch({
    type: GET_PROFILES,
    payload: res.data,
  });
};

export const createProfile = (profileName) => async (dispatch) => {
  const res = axios.post(
    `${config.hostApi}/v1/graph/monitorProfile/addProfileToList`,
    {
      profile_name: profileName.toLocaleLowerCase(),
    }
  );
  return res;
};

export const deleteProfile = (_id) => async (dispatch) => {
  axios.post(
    `${config.hostApi}/v1/graph/monitorProfile/removeProfileFromList`,
    {
      _id,
    }
  );

  dispatch({
    type: DELETE_PROFILES,
    payload: _id,
  });
};

export const clearProfile = () => async (dispatch) => {
  dispatch({
    type: "clearProfile",
  });
};

export const searchProfileAc = (userName, check) => async (dispatch) => {
  const { fb_token, instagram_id } = JSON.parse(
    localStorage.getItem("userInfo")
  );
  const res = await axios.get(
    `https://graph.facebook.com/${instagram_id}?fields=business_discovery.username(${userName}){followers_count,media_count,profile_picture_url,biography,name,username,website,follows_count,media.limit(300){comments_count,caption,like_count,media_url,permalink,media_type,timestamp,children{id,media_url,media_type}}}&access_token=${fb_token}`
  );
  if (!check)
    dispatch({
      type: SEARCH_PROFILE,
      payload: res.data.business_discovery,
    });
};

export const filterProfileMedia = (data) => async (dispatch) => {
  dispatch({
    type: FILTER_PROFILE_MEDIA,
    payload: data,
  });
};
