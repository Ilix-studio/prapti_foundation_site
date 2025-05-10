import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// import { RootState } from "../redux-store/store";

// Create a mutex instance

export const API_CONFIG = {
  BASE_URL: "https://prapti-foundation-be.onrender.com/api",
};

export const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    // const token = (getState() as RootState).instituteAuth.token;
    // Debug logging
    // console.log("Token from Redux state:", token);

    // if (token) {
    //   headers.set("Authorization", `Bearer ${token}`);
    // } else {
    //   console.warn("No token found in Redux state");
    // }

    return headers;
  },
});
