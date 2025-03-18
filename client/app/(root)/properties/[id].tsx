import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { useGetProductQuery } from "@/redux/api/productApiSlice";
import { useAddToCartMutation } from "@/redux/api/cartApiSlice"; // sử dụng hook addToCart
import { addToCartState } from "@/redux/features/cart/cartSlice";
import { AppDispatch } from "@/redux/store";

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // Lưu số lượng người dùng chọn
  const dispatch = useDispatch<AppDispatch>();

  const windowHeight = Dimensions.get("window").height;

  // Gọi API lấy chi tiết sản phẩm
  const { data, isLoading, error } = useGetProductQuery(id || "");
  const product = data?.data.product;

  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation(); // sử dụng hook addToCart

  // const handleAddToCart = async () => {
  //   if (!selectedSize || !selectedColor) {
  //     Alert.alert("Please select both size and color");
  //     return;
  //   }

  //   const selectedVariant = product?.variants.find(
  //     (variant) =>
  //       variant.size === selectedSize && variant.color === selectedColor
  //   );

  //   if (selectedVariant) {
  //     // Gọi API add to cart
  //     await addToCart({
  //       productId: product._id,
  //       size: selectedSize,
  //       color: selectedColor,
  //       quantity: quantity, // Gửi số lượng vào API
  //     });
  //     Alert.alert("Added to cart");
  //   } else {
  //     Alert.alert("Variant not available");
  //   }
  // };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert("Please select both size and color");
      return;
    }

    const selectedVariant = product?.variants.find(
      (variant) =>
        variant.size === selectedSize && variant.color === selectedColor
    );

    if (selectedVariant) {
      // Cấu trúc sản phẩm
      const cartItem: CartItem = {
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: selectedVariant.price,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
      };

      try {
        // Gọi API add to cart
        await addToCart({
          productId: product._id,
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
        }).unwrap();

        // Dispatch vào Redux store
        dispatch(addToCartState(cartItem));

        Alert.alert("Added to cart");
      } catch (error) {
        Alert.alert("Failed to add to cart");
      }
    } else {
      Alert.alert("Variant not available");
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert("Please select both size and color");
      return;
    }

    const selectedVariant = product?.variants.find(
      (variant) =>
        variant.size === selectedSize && variant.color === selectedColor
    );

    if (selectedVariant) {
      const orderItems = [
        {
          product: product._id,
          name: product.name,
          image: product.images[0],
          price: selectedVariant.price,
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
        },
      ];

      // Chuyển hướng đến trang CheckoutNow và truyền orderItems
      router.push({
        pathname: "/checkout-now",
        params: { orderItems: JSON.stringify(orderItems) },
      });
    } else {
      Alert.alert("Variant not available");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading product</Text>
      </View>
    );
  }


  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: product?.images?.[0] || images.onboarding }}
            className="size-full"
            style={{ height: 450 }}
            resizeMode="cover"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{ top: Platform.OS === "ios" ? 70 : 20 }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
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
            </View>
          </View>
        </View>



        <View className="px-5 mt-2 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">{product?.name}</Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {product?.collections || "Unknown Collection"}
              </Text>
            </View>
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {product?.category?.name || "No category"}
              </Text>
            </View>
          </View>

          {/* Render color options from variants */}
          {/* Render color options from variants */}
          <View className="mt-5">
            <Text className="text-black-300 text-sm font-rubik-bold">
              Colors
            </Text>
            <View className="flex flex-row gap-3 mt-2">
              {[
                ...new Set(product?.variants?.map((variant) => variant.color)),
              ].map((color, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedColor(color)}
                  style={{
                    borderWidth: selectedColor === color ? 2 : 1,
                    borderColor: selectedColor === color ? "#0061ff" : "#ddd",
                    padding: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text className="text-black-300">{color}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Render size options from variants */}
          <View className="mt-5">
            <Text className="text-black-300 text-sm font-rubik-bold">
              Sizes
            </Text>
            <View className="flex flex-row gap-3 mt-2">
              {[
                ...new Set(product?.variants?.map((variant) => variant.size)),
              ].map((size, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedSize(size)}
                  style={{
                    borderWidth: selectedSize === size ? 2 : 1,
                    borderColor: selectedSize === size ? "#0061ff" : "#ddd",
                    padding: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text className="text-black-300">{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lựa chọn số lượng */}
          <View className="mt-5">
            <Text className="text-black-300 text-sm font-rubik-bold">
              Quantity
            </Text>
            <View className="flex flex-row items-center mt-2 gap-3">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderColor: "#ddd",
                  borderRadius: 5,
                }}
              >
                <Text className="text-lg font-rubik-bold">-</Text>
              </TouchableOpacity>

              <Text className="text-xl font-rubik-medium">{quantity}</Text>

              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderColor: "#ddd",
                  borderRadius: 5,
                }}
              >
                <Text className="text-lg font-rubik-bold">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              {product?.description || "No description available."}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              ${product?.variants[0]?.price || "N/A"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
          >
            <Text className="text-white text-lg text-center font-rubik-bold">
              Add to Cart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleBuyNow}
            className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
          >
            <Text className="text-white text-lg text-center font-rubik-bold">
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Property;
