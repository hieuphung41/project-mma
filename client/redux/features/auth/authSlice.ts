import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  accessToken:null
};

// Hàm load dữ liệu từ AsyncStorage
const loadUserInfo = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem("userInfo");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error loading user info:", error);
    return null;
  }
};

// Tạo Slice Redux
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload)).catch((err) =>
        console.error("Error saving user info:", err)
      );
    },
    refreshAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      AsyncStorage.removeItem("userInfo").catch((err) =>
        console.error("Error clearing user info:", err)
      );
    },
  },
});

export const { setCredentials,refreshAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
