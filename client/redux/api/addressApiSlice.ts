import { apiSlice } from "./apiSlice";
import { ADDRESS_URL } from "../constant";

interface Address {
  _id: string;
  user: string;
  fullName: string;
  phone: string;
  location: string;
  city: string;
  country: string;
  isDefault: boolean;
}

//addressRouter.get("/",authenticate, getAddressList);
export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddressList: builder.query<{ data: { addresses: Address[] } }, void>({
      query: () => ({ url: `${ADDRESS_URL}`, credentials: "include" }),
    }),
  }),
});


export const { useGetAddressListQuery } = addressApiSlice;