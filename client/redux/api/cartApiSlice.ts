import { CartItem } from "@/interface";
import { CART_URL } from "../constant";
import { apiSlice } from "./apiSlice";



export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<
      { data: { cart: { _id: string; user: string; products: CartItem[] } } },
      void
    >({
      query: () => ({ url: `${CART_URL}`, credentials: "include" }),
    }),
    addToCart: builder.mutation<void, { productId: string; quantity: number }>({
      query: (data) => ({
        url: `${CART_URL}/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    updateCart: builder.mutation<void, { productId: string; quantity: number }>(
      {
        query: (data) => ({
          url: `${CART_URL}/update`,
          method: "PUT",
          body: data,
          credentials: "include",
        }),
      }
    ),
    removeFromCart: builder.mutation<void, { productId: string }>({
      query: (data) => ({
        url: `${CART_URL}/remove`,
        method: "DELETE",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
} = cartApiSlice;
