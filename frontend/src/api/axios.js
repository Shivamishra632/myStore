import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-548h.onrender.com",
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const parsed = JSON.parse(userInfo);

    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }

  return config;
});

export default API;
