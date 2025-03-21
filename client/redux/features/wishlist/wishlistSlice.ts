import { WishlistItem } from "@/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addToCartState } from "../cart/cartSlice";
import { AppDispatch } from "@/redux/store";

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

    // Chuyển sản phẩm từ wishlist sang cart
    moveToCartState: (
      state,
      action: PayloadAction<{ productId: string; size: string; color: string }>
    ) => {
      const { productId, size, color } = action.payload;

      // Tìm sản phẩm trong wishlist
      const productIndex = state.products.findIndex(
        (item) =>
          item.product === productId &&
          item.size === size &&
          item.color === color
      );

      if (productIndex !== -1) {
        // Lấy sản phẩm từ wishlist
        const productToMove = state.products.splice(productIndex, 1)[0]; // Xóa sản phẩm khỏi wishlist

        // Đảm bảo sản phẩm được thêm vào cart với số lượng mặc định là 1
        const cartProduct = {
          ...productToMove,
          quantity: 1, // Số lượng mặc định là 1 khi chuyển sang cart
        };

        // Thêm sản phẩm vào cart
        return (dispatch: AppDispatch) => {
          dispatch(addToCartState(cartProduct)); // Dispatch hành động addToCartState từ cartSlice
        };
      }
    },

    setWishlist: (
      state,
      action: PayloadAction<{ products: WishlistItem[]; totalPrice: number }>
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
  moveToCartState,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
