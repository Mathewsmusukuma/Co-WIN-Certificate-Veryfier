import envConfigs from "../utils/env.config.js";
import axios from "axios";

export const axiosInstance = () => {  
  return axios.create({
    baseURL: envConfigs[process.env.APP_ENV || "development"].apiBaseUrl,
    headers: {
      "content-type": "application/json",
    },
  });
};