import axios from "axios";
import { GET_USER_BRANDS, GET_BRANDS_CATEGORY, GET_CAT_BRAND } from "./type";
import config from "../config";

export const getBrands = () => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/users/marketPlace/userSelectedBrands`)
      .then((res) => {
        dispatch({
          type: GET_USER_BRANDS,
          payload: res.data?.message,
        });
        resolve(res.data?.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};

export const getBrandsCategory = (brandId) => async (dispatch) => {
  let promise = new Promise((resolve, reject) => {
    axios
      .post(`${config.baseURLApi}/users/marketPlace/brandcategories`, {
        brand_id: brandId,
      })
      .then((res) => {
        dispatch({
          type: GET_BRANDS_CATEGORY,
          payload: res.data?.message,
        });
        resolve(res.data?.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};

// export const getCatbrands = (categoryId) => async (dispatch) => {
//   try {
//       const res = await konnect.post(`/v1/mobile/category/campainWiseBrand`,{categoryId})
//       dispatch({
//           type: GET_CAT_BRAND,
//           payload: res.data.data
//       })
//   } catch (err) {
//       console.log(err)
//   }
// }

export const getCatbrands =
  (categoryId, status = "all", minCommission = "10", maxCommission = "50") =>
  async (dispatch) => {
    let promise = new Promise((resolve, reject) => {
      axios
        .post(`${config.baseURLApi}/mobile/category/campainWiseBrand`, {
          categoryId,
          status: status,
          minCommission: minCommission === "" ? "10" : minCommission,
          maxCommission: maxCommission === "" ? "50" : maxCommission,
        })
        .then((res) => {
          dispatch({
            type: GET_CAT_BRAND,
            payload: res.data?.data,
          });
          resolve(res.data?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  };
