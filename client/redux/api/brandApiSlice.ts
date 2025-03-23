import { BRAND_URL } from "../constant";
import { apiSlice } from "./apiSlice";

interface Brand {
  _id: string;
  name: string;
}

export const brandApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<{ data: Brand[] }, void>({
      query: () => `${BRAND_URL}`,
    }),
    getBrand: builder.query<{ data: Brand }, string>({
      query: (id) => `${BRAND_URL}/${id}`,
    }),
  }),
});

export const { useGetBrandsQuery, useGetBrandQuery } = brandApiSlice;
