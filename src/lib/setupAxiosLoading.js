import axios from "axios";
import { GlobalLoading } from "./globalLoading";

// call once at app bootstrap
export function attachAxiosLoading() {
  axios.interceptors.request.use(
    (config) => { GlobalLoading.inc(); return config; },
    (error)  => { GlobalLoading.dec(); return Promise.reject(error); }
  );

  axios.interceptors.response.use(
    (response) => { GlobalLoading.dec(); return response; },
    (error)    => { GlobalLoading.dec(); return Promise.reject(error); }
  );
}
