import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. https://oakadmin... from env file
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // set to true if using cookies
});

export default API;
