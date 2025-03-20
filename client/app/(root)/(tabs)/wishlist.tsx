import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/redux/api/wishlistApiSlice";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { router, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  removeFromWishlistState,
  setWishlist,
} from "@/redux/features/wishlist/wishlistSlice";

const Wishlist = () => {
  // Fetch Wishlist Data
  // const { data, isLoading, error, refetch } = useGetWishlistQuery();
  const wishlistState = useSelector((state: RootState) => state.wishlist); // Lấy từ Redux
  const { data, isLoading, error, refetch } = useGetWishlistQuery(); // Lấy từ API
  const wishlist = data?.data.wishlist;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    if (data?.data?.wishlist && data.data.wishlist.products) {
      dispatch(setWishlist(data.data.wishlist)); // Gán API vào Redux store
    }
  }, [data, dispatch]);

  useEffect(() => {
    refetch(); // Gọi lại API khi Redux store thay đổi
  }, [wishlistState, refetch]);
  // const wishlist = data?.data.wishlist;
  const windowHeight = Dimensions.get("window").height;
  // Mutations
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

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
