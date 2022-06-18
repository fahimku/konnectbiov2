import axios from "axios";
import { GET_SCHEDULE_POST } from "./type";
import config from "../config";

export const schedulePost = (data) => async (dispatch) => {
    const res= axios.post(`${config.hostApi}/v1/graph/ig/publishmedia/create`,data)
    return res
};

export const getSchedulePosts = () => async (dispatch) => {
    const res= await axios.post(`${config.hostApi}/v1/graph/ig/publishmedia/getall`)
    dispatch({
        type:GET_SCHEDULE_POST,
        payload:res.data
    })
};

// export const getSchedulePost = (media_id) => async (dispatch) => {
//     const res= axios.post(`${config.hostApi}/v1/graph/ig/publishmedia/getone`,{media_id})
//     return res
// };


export const deleteSchedulePost = (media_id) => async (dispatch) => {
    const res= axios.post(`${config.hostApi}/v1/graph/ig/publishmedia/delete`,{media_id})
    return res
};

export const updateSchedulePost = (data) => async (dispatch) => {
    const res= axios.post(`${config.hostApi}/v1/graph/ig/publishmedia/update`,data)
    return res
};

export const directPublish = (data) => async (dispatch) => {
    const res= axios.post(`${config.hostApi}/v1/graph/ig/publishmedia/publish`,data)
    return res
};