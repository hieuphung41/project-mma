import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../constant";
import { create } from "react-test-renderer";

interface Order {
  _id: string;
  user: string;
  orderItems: {
    product: string;
    name: string;
    image: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
  }[];
  addressId: string;
  fullName: string;
  phone: string;
  location: string;
  city: string;
  country: string;
  paymentMethod: string;
  totalPrice: number;
  coupon: string;
  priceAfterDiscount: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  status: string;
}

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<{ data: { orders: Order[] } }, void>({
      query: () => ({ url: `${ORDER_URL}`, credentials: "include" }),
    }),
    getOrdersByUserId: builder.query<
      {
        data: {
          orders: Order[];
          totalPages: number;
          currentPage: number;
          totalOrders: number;
        };
      },
      { userId: string; page?: number; limit?: number }
    >({
      query: ({ userId, page = 1, limit = 5 }) => ({
        url: `${ORDER_URL}/user/${userId}`,
        credentials: "include",
        params: { page, limit },
      }),
    }),
    getOrderById: builder.query<{ data: Order }, string>({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}`,
        credentials: "include",
      }),
    }),
    createOrder: builder.mutation<{ data: Order }, Order>({
      query: (order) => ({ url: `${ORDER_URL}`, method: "POST", body: order }),
    }),
    createOrderNow: builder.mutation<{ data: Order }, Order>({
      query: (order) => ({ url: `${ORDER_URL}/now`, method: "POST", body: order }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrdersByUserIdQuery,
  useCreateOrderMutation,
  useCreateOrderNowMutation,
} = orderApiSlice;
