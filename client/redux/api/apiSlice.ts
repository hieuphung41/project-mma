import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: [
    "Product",
    "Order",
    "User",
    "Category",
    "Cart",
    "Coupon",
    "Address",
  ],
  endpoints: () => ({}),
});
