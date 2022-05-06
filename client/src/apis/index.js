import axios from "axios";


// @ts-ignore
export const baseBackend = import.meta.env.MODE === "development"
  ? "http://localhost:1000"
  : "https://mwsjzaxqrt.us10.qoddiapp.com"
// export const baseBackend = "https://mwsjzaxqrt.us10.qoddiapp.com"

// @ts-ignore
export const backend = import.meta.env.MODE === "development"
  // ? "https://mwsjzaxqrt.us10.qoddiapp.com"
  ? "http://localhost:3300"
  : baseBackend





const api = axios.create({
  baseURL: backend,
  withCredentials: true, // to send cookie in server
  headers: {
    token: window.localStorage.getItem("token") || ""
  }
})

export function getApi(){
  return axios.create({
    baseURL: backend,
    withCredentials: true, // to send cookie in server
    headers: {
      token: window.localStorage.getItem("token") || "",
      // 'Content-Type': 'application/json',
      // "Access-Control-Allow-Origin": "*",
      // 'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
  })
}


export default  api
