import Axios from "axios";

export const API_URL = "http://localhost:1337";

export const axios = Axios.create({
  baseURL: API_URL,
});

const token = localStorage.getItem("jwt");

export const authedAxios = Axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
