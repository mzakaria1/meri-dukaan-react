import Axios from "axios";

export const API_URL = "https://meridukan-api.herokuapp.com";

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
