import axios from "axios";



// @ts-ignore
export const backend = import.meta.env.MODE === "development"
  ? "http://localhost:8080"
  : "https://dev-story-api.netlify.app/.netlify/functions/api"


export const baseBackend = import.meta.env.MODE === "development"
  ? "http://localhost:8080"
  : "https://dev-story-api.netlify.app/.netlify/functions/api"



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
