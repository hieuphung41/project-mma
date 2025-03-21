import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/redux/api/wishlistApiSlice";
import { useAddToCartMutation } from "@/redux/api/cartApiSlice"; // Sử dụng hook addToCart
import icons from "@/constants/icons";
import { router, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  removeFromWishlistState,
  setWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { addToCartState } from "@/redux/features/cart/cartSlice";
import { WishlistItem } from "@/interface";

const Wishlist = () => {
  const wishlistState = useSelector((state: RootState) => state.wishlist); // Lấy từ Redux
  const { data, isLoading, error, refetch } = useGetWishlistQuery(); // Lấy từ API
  const wishlist = data?.data.wishlist;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation(); // sử dụng hook addToCart
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation(); // sử dụng hook removeFromWishlist

  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    if (data?.data?.wishlist && data.data.wishlist.products) {
      dispatch(setWishlist(data.data.wishlist)); // Gán API vào Redux store
    }
  }, [data, dispatch]);

  useEffect(() => {
    refetch(); // Gọi lại API khi Redux store thay đổi
  }, [wishlistState, refetch]);

  // Hàm thêm sản phẩm vào giỏ hàng và xóa khỏi wishlist
  const handleAddToCartAndRemoveFromWishlist = async (item: WishlistItem) => {
    try {
      // Thêm sản phẩm vào giỏ hàng
      await addToCart({
        productId: item.product,
        size: item.size,
        color: item.color,
        quantity: 1,
      }).unwrap();

      // Cập nhật Redux Store (giỏ hàng)
      const cartItem = {
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: 1,
      };
      dispatch(addToCartState(cartItem));

      // Xóa sản phẩm khỏi wishlist
      await removeFromWishlist({
        productId: item.product,
        size: item.size,
        color: item.color,
      }).unwrap();
      dispatch(
        removeFromWishlistState({
          productId: item.product,
          size: item.size,
          color: item.color,
        })
      );

      // Làm mới lại dữ liệu wishlist
      refetch();
      Alert.alert("Added to cart and removed from wishlist");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to add item to cart and remove from wishlist"
      );
    }
  };

  // Function to remove item from Wishlist
  const handleRemoveItem = async (
    productId: string,
    size: string,
    color: string
  ) => {
    try {
      await removeFromWishlist({ productId, size, color }).unwrap();
      refetch(); // Refresh Wishlist
      dispatch(removeFromWishlistState({ productId, size, color }));
    } catch (err) {
      Alert.alert("Error", "Failed to remove item from Wishlist");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Failed to load Wishlist</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-white border-b border-gray-300 py-4 px-5 flex flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex flex-row items-center justify-center"
        >
          <Image source={icons.backArrow} className="size-5" />
        </TouchableOpacity>
        <Text className="text-xl font-rubik-extrabold text-center flex-1">
          Wishlist
        </Text>
        <View className="w-5" />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-lg font-rubik-medium text-gray-500">
              Your wishlist is empty
            </Text>
          </View>
        }
        data={wishlist?.products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="flex flex-row items-center justify-between my-2 mx-4 border-b border-gray-300 pb-2">
            <Image
              source={{ uri: item.image }}
              className="w-16 h-16 rounded-md"
            />
            <View className="flex-1 ml-4">
              <Text className="text-lg font-rubik-medium">{item.name}</Text>
              <Text className="text-sm text-gray-500">
                Size: {item.size} | Color: {item.color}
              </Text>
              <Text className="text-primary-300 font-rubik-bold">
                ${item.price}
              </Text>
            </View>

            {/* Add to Cart and Remove from Wishlist */}
            <TouchableOpacity
              onPress={() => handleAddToCartAndRemoveFromWishlist(item)}
              className="ml-3"
            >
              <Image source={icons.cart} className="w-6 h-6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleRemoveItem(item.product, item.size, item.color)
              }
              className="ml-3"
            >
              <Image source={icons.trash} className="w-6 h-6" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Wishlist;
