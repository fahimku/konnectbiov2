// Araj PC
// const hostApi =
//   process.env.NODE_ENV === "development"
//     ? "http://172.16.1.85:9090"
//     : "https://apiv2.konnect.bio";

// const hostApi = "https://kbserverdev.herokuapp.com";
const hostApi = "https://apiv2.konnect.bio";
// const pixelApi = "https://api.roiswitch.com";
///const pixelApi = "http://172.16.1.86:3000";
const portApi = process.env.NODE_ENV === "development" ? "" : "";
const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}/v1`;
const baseURLApiToken = `${hostApi}${portApi ? `:${portApi}` : ``}`;
const redirectURL =
  process.env.NODE_ENV === "development"
    ? "https://apiv2.konnect.bio"
    : "https://apiv2.konnect.bio";
const visitorURL =
  process.env.NODE_ENV === "development"
    ? "https://www.kbshop.com/bioshop"
    : "https://www.kbshop.com/bioshop";
// const visitorURL =
//   process.env.NODE_ENV === "development"
//     ? "https://konnect.bio"
//     : "https://konnect.bio";

export default {
  redirectURL,
  hostApi,
  portApi,
  baseURLApi,
  baseURLApiToken,
  visitorURL,
  remote: "https://apiv2.konnect.bio",
  isBackend: process.env.REACT_APP_BACKEND,
  auth: {
    email: "roi@admdenim.com",
    password: "123",
  },
  endPoint: {
    global: {
      countries: "common/receive/countries",
      connect: "social/ig/url/instagram",
    },
    auth: {
      login: "signin/user",
      register: "signup/user",
      forgotPassword: "",
    },
    posts: {
      create: "",
      update: "",
      delete: "",
      getAll: "",
    },
    analytics: {
      profileViews: "",
      postClicks: "",
    },
    getAllCountries: "common/receive/countries",
    getAllCategories: "common/receive/categories",
    getAllBrands: "brands/receive",
  },
  app: {
    colors: {
      dark: "#010b40",
      light: "#FFFFFF",
      sea: "#004472",
      sky: "#E9EBEF",
      wave: "#D1E7F6",
      rain: "#CCDDE9",
      middle: "#D7DFE6",
      black: "#13191D",
      salat: "#21AE8C",
    },
  },
};
