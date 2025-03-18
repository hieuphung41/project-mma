import { apiSlice } from "./apiSlice";
import { COUPON_URL } from "../constant";

interface Coupon {
  _id: string;
  name: string;
  expiry: Date;
  discount: number;
}

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<{ data: { coupons: Coupon[] } }, void>({
      query: () => ({ url: `${COUPON_URL}`, credentials: "include" }),
    }),
    getCouponById: builder.query<{ data: Coupon }, string>({
      query: (couponId) => ({
        url: `${COUPON_URL}/${couponId}`,
        credentials: "include",
      }),
    }),
    getCouponByName: builder.query<{ data: Coupon }, string>({
      query: (couponName) => ({ url: `${COUPON_URL}/name/${couponName}` }),
    }),
  }),
});

export const { useGetCouponsQuery, useGetCouponByIdQuery, useGetCouponByNameQuery } = couponApiSlice;
