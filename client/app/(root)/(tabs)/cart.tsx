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
  useGetCartQuery,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
} from "@/redux/api/cartApiSlice";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { router, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  removeFromCartState,
  setCart,
  updateCartState,
} from "@/redux/features/cart/cartSlice";

const Cart = () => {
  // Fetch Cart Data
  // const { data, isLoading, error, refetch } = useGetCartQuery();
  const cartState = useSelector((state: RootState) => state.cart); // Lấy từ Redux
  const { data, isLoading, error, refetch } = useGetCartQuery(); // Lấy từ API
  const cart = data?.data.cart;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    if (data?.data?.cart && data.data.cart.products) {
      dispatch(setCart(data.data.cart)); // Gán API vào Redux store
    }
  }, [data, dispatch]);

  useEffect(() => {
    refetch(); // Gọi lại API khi Redux store thay đổi
  }, [cartState, refetch]);
  // const cart = data?.data.cart;
  const windowHeight = Dimensions.get("window").height;
  // Mutations
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [removeFromCart, { isLoading: isRemoving }] =
    useRemoveFromCartMutation();

  // Function to update quantity
  const handleUpdateQuantity = async (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) return; // Prevent quantity from going below 1
    try {
      await updateCart({ productId, size, color, quantity }).unwrap();
      refetch(); // Refresh cart
      dispatch(updateCartState({ productId, size, color, quantity }));
    } catch (err) {
      Alert.alert("Error", "Failed to update cart");
    }
  };

  // Function to remove item from cart
  const handleRemoveItem = async (
    productId: string,
    size: string,
    color: string
  ) => {
    try {
      await removeFromCart({ productId, size, color }).unwrap();
      refetch(); // Refresh cart
      dispatch(removeFromCartState({ productId, size, color }));
    } catch (err) {
      Alert.alert("Error", "Failed to remove item from cart");
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
        <Text className="text-red-500">Failed to load cart</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white "
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={images.onboarding}
            className="size-full"
            style={{ height: 450 }}
            resizeMode="cover"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{ top: Platform.OS === "ios" ? 70 : 20 }}
          >
            {/* <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.replace("/profile")}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.heart}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View> */}
          </View>
        </View>
        <View className=" px-4">
          <Text className="text-2xl font-rubik-bold my-5">Shopping Cart</Text>

          {cart?.products.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg font-rubik-medium text-gray-500">
                Your cart is empty
              </Text>
            </View>
          ) : (
            <FlatList
              data={cart?.products}
              keyExtractor={(item) => item.product}
              renderItem={({ item }) => (
                <View className="flex flex-row items-center justify-between mb-4 border-b border-gray-300 pb-2">
                  <Image
                    source={{ uri: item.image }}
                    className="w-16 h-16 rounded-md"
                  />

                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-rubik-medium">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Size: {item.size} | Color: {item.color}
                    </Text>
                    <Text className="text-primary-300 font-rubik-bold">
                      ${item.price}
                    </Text>
                  </View>

                  <View className="flex flex-row items-center">
                    <TouchableOpacity
                      onPress={() =>
                        handleUpdateQuantity(
                          item.product,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      className="px-3 py-2 bg-gray-200 rounded-md"
                    >
                      <Text className="text-lg">-</Text>
                    </TouchableOpacity>

                    <Text className="px-3">{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() =>
                        handleUpdateQuantity(
                          item.product,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-2 bg-gray-200 rounded-md"
                    >
                      <Text className="text-lg">+</Text>
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
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-20 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              $
              {cart?.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )}{" "}
            </Text>
          </View>

          <TouchableOpacity className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400">
            <Text
              className="text-white text-lg text-center font-rubik-bold"
              onPress={() => router.replace("/checkout")}
            >
              Checkout Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Cart;
