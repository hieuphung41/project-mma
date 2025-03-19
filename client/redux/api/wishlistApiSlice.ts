import { WishlistItem } from "@/interface";
import { WISHLIST_URL } from "../constant";
import { apiSlice } from "./apiSlice";

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<
      {
        data: {
          wishlist: { _id: string; user: string; products: WishlistItem[] };
        };
      },
      void
    >({
      query: () => ({ url: `${WISHLIST_URL}`, credentials: "include" }),
    }),
    addToWishlist: builder.mutation<
      void,
      { productId: string; quantity: number }
    >({
      query: (data) => ({
        url: `${WISHLIST_URL}/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    removeFromWishlist: builder.mutation<void, { productId: string }>({
      query: (data) => ({
        url: `${WISHLIST_URL}/remove`,
        method: "DELETE",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;
