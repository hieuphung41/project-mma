import { CartItem } from "@/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  products: CartItem[];
  totalPrice: number;
}

const initialState: CartState = {
  products: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ hàng
    addToCartState: (state, action: PayloadAction<CartItem>) => {
      const existingProductIndex = state.products.findIndex(
        (item) =>
          item.product === action.payload.product &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      
      if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
        state.products[existingProductIndex].quantity += action.payload.quantity;
      } else {
        // Nếu sản phẩm chưa có trong giỏ, thêm mới
        state.products.push(action.payload);
      }

      // Tính lại tổng giá trị của giỏ hàng
      state.totalPrice = state.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartState: (
      state,
      action: PayloadAction<{ productId: string; size: string; color: string; quantity: number }>
    ) => {
      const { productId, size, color, quantity } = action.payload;
      const productIndex = state.products.findIndex(
        (item) => item.product === productId && item.size === size && item.color === color
      );

      if (productIndex !== -1 && quantity > 0) {
        state.products[productIndex].quantity = quantity;
        // Tính lại tổng giá trị của giỏ hàng
        state.totalPrice = state.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
      }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCartState: (
      state,
      action: PayloadAction<{ productId: string; size: string; color: string }>
    ) => {
      const { productId, size, color } = action.payload;
      state.products = state.products.filter(
        (item) => item.product !== productId || item.size !== size || item.color !== color
      );
      // Tính lại tổng giá trị của giỏ hàng
      state.totalPrice = state.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    },

    setCart: (state, action: PayloadAction<{ products: CartItem[]; totalPrice: number }>) => {
      state.products = action.payload.products;
      state.totalPrice = action.payload.totalPrice;
    },

    // Xóa toàn bộ giỏ hàng
    clearCartState: (state) => {
      state.products = [];
      state.totalPrice = 0;
    },
  },
});

export const { addToCartState, updateCartState, removeFromCartState, clearCartState , setCart} = cartSlice.actions;

export default cartSlice.reducer;
