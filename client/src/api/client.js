import axios from "axios";
import { apiBasePath } from "../config/apiBase.js";

/** Shared axios instance; `AuthProvider` sets the Bearer token via `setAuthToken`. */
const api = axios.create({
  baseURL: apiBasePath(),
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
