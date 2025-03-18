import { apiSlice } from "./apiSlice";
import { CHECKOUT_URL } from "../constant";

interface PaymentResponse {
  paymentUrl: string;
}

interface VnpayReturnResponse {
  success: boolean;
  message: string;
  code: string;
}

export const checkoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint tạo URL thanh toán
    createPaymentUrl: builder.mutation<
      PaymentResponse,
      { amount: number; bankCode: string | null; language: string | null }
    >({
      query: ({ amount, bankCode, language }) => ({
        url: `${CHECKOUT_URL}/create_payment_url`,
        method: "POST",
        body: { amount, bankCode, language },
        credentials: "include",
      }),
    }),

    // Endpoint xử lý trả về từ VNPay
    vnpayReturn: builder.query<
      VnpayReturnResponse,
      { vnp_Params: Record<string, string> }
    >({
      query: ({ vnp_Params }) => ({
        url: `${CHECKOUT_URL}/vnpay_return`,
        method: "GET",
        params: vnp_Params,
        credentials: "include",
      }),
    }),
  }),
});

export const { useCreatePaymentUrlMutation, useVnpayReturnQuery } =
  checkoutApiSlice;
