import { CATEGORY_URL } from "../constant";
import { apiSlice } from "./apiSlice";

interface Category {
  _id: string;
  name: string;
}

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<{ data: Category[] }, void>({
      query: () => `${CATEGORY_URL}`,
    }),
    getCategory: builder.query<{ data: Category }, string>({
      query: (id) => `${CATEGORY_URL}/${id}`,
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryQuery } = categoryApiSlice;
