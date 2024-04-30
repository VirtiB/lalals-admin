import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

const get = async (url: string, config = {}) => axiosInstance.get(url, config);
const post = async (url: string, body: any, config = {}) =>
  axiosInstance.post(url, body, config);
const put = async (url: string, body: Object, config = {}) =>
  axiosInstance.put(url, body, config);
const deleted = async (url: string, config = {}) =>
  axiosInstance.delete(url, config);
const patch = async (url: string, body: any, config = {}) =>
  axiosInstance.patch(url, body, config);
export { get, post, put, deleted, patch };
