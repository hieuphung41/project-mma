import { WishlistItem } from "@/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  products: WishlistItem[];
}

const initialState: WishlistState = {
  products: [],
};

const wishlistSlice = createSlice({
  name: "Wishlist",
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ hàng
    addToWishlistState: (state, action: PayloadAction<WishlistItem>) => {
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
      const existingProductIndex = state.products.findIndex(
        (item) =>
          item.product === action.payload.product &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      if (existingProductIndex !== -1) {
        return;
      }
      state.products.push(action.payload);
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromWishlistState: (
      state,
      action: PayloadAction<{ productId: string; size: string; color: string }>
    ) => {
      const { productId, size, color } = action.payload;
      state.products = state.products.filter(
        (item) =>
          item.product !== productId ||
          item.size !== size ||
          item.color !== color
      );
    },

    setWishlist: (
      state,
      action: PayloadAction<{ products: WishlistItem[] }>
    ) => {
      state.products = action.payload.products;
    },

    // Xóa toàn bộ giỏ hàng
    clearWishlistState: (state) => {
      state.products = [];
    },
  },
});

export const {
  addToWishlistState,
  removeFromWishlistState,
  clearWishlistState,
  setWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
