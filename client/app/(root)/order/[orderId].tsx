import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useGetOrderByIdQuery } from "@/redux/api/orderApiSlice"; // Hook lấy thông tin đơn hàng
import { useLocalSearchParams, useRouter } from "expo-router"; // Dùng router từ expo-router thay vì navigation của react-navigation
import images from "@/constants/images";
import icons from "@/constants/icons";

const OrderDetail = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>(); // Lấy orderId từ query params

  // Kiểm tra nếu không có orderId, return loading state hoặc lỗi
  if (!orderId) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-4 py-6">
        <Text className="text-red-500 text-center">
          Order ID is missing. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  // Hook lấy thông tin đơn hàng từ API
  const { data, isLoading, error } = useGetOrderByIdQuery(orderId);
  const order = data?.data?.order;

  // Render một item trong danh sách orderItems
  const renderOrderItem = ({ item }: { item: any }) => (
    <View className="flex flex-row items-center mt-3">
      <Image
        source={{ uri: item.image || images.avatar }}
        className="w-12 h-12 rounded-md"
      />
      <View className="ml-3 flex-1">
        <Text className="text-sm font-medium">{item.name}</Text>
        <Text className="text-sm text-gray-500">
          {item.size} | {item.color}
        </Text>
        <Text className="text-sm font-semibold">
          {item.quantity} x ${item.price}
        </Text>
      </View>
    </View>
  );

  // Xử lý trạng thái loading và error
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-4 py-6">
        <ActivityIndicator size="large" color="#0061ff" />
        <Text className="text-gray-500 mt-3">Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-4 py-6">
        <Text className="text-red-500 text-center">
          Error loading order details. Please try again.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-5 py-6">
      {/* Header with back button and title */}
      <View className="bg-white border-b border-gray-300 py-4 px-5 flex flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.push("/order")} // Quay lại trang trước
          className="flex flex-row items-center justify-center"
        >
          <Image source={icons.backArrow} className="size-5" />
        </TouchableOpacity>
        <Text className="text-xl font-rubik-extrabold text-center flex-1">
          Order History
        </Text>
        {/* Tạo một View rỗng để căn chỉnh cho nút back và tiêu đề */}
        <View className="w-5" />
      </View>

      {/* Order Status and Total Price */}
      <View className="flex flex-row justify-between items-center m-4">
        <Text className="text-xl font-semibold">{order?.status}</Text>
        <Text className="text-lg text-primary-300">
          ${order?.priceAfterDiscount}
        </Text>
      </View>

      {/* Thông tin người mua */}
      <View className="m-4">
        <Text className="text-sm text-gray-600">Name: {order?.user.name}</Text>
        <Text className="text-sm text-gray-600">
          Email: {order?.user.email}
        </Text>
        <Text className="text-sm text-gray-600">
          Phone: {order?.user.phone}
        </Text>
      </View>

      {/* Thông tin địa chỉ */}
      <View className="m-4">
        <Text className="text-sm text-gray-600">
          Address: {order?.address?.location}
        </Text>
        <Text className="text-sm text-gray-600">
          City: {order?.address?.city}
        </Text>
        <Text className="text-sm text-gray-600">
          Country: {order?.address?.country}
        </Text>
      </View>

      {/* Phương thức thanh toán */}
      <View className="m-4">
        <Text className="text-sm text-gray-600">
          Payment Method: {order?.paymentMethod}
        </Text>
        <Text className="text-sm text-gray-600">
          Price After Discount: ${order?.priceAfterDiscount}
        </Text>
      </View>

      {/* Thông tin khuyến mãi */}
      <View className="m-4">
        <Text className="text-sm text-gray-600">
          Discount: {order?.coupon?.name || "N/A"} (Expires:{" "}
          {order?.coupon?.expiry})
        </Text>
      </View>

      {/* Danh sách sản phẩm trong đơn hàng */}
      <View className="m-4">
        <FlatList
          data={order?.orderItems}
          keyExtractor={(orderItem) => orderItem._id}
          renderItem={renderOrderItem}
        />
      </View>

      {/* Trạng thái thanh toán và giao hàng */}
      <View className="m-4">
        <Text className="text-lg font-medium">Payment Status</Text>
        <Text className="text-sm text-gray-600">
          {order?.isPaid
            ? "Paid at: " + new Date(order?.paidAt).toLocaleString()
            : "Not Paid"}
        </Text>
        <Text className="text-sm text-gray-600">
          {order?.isDelivered
            ? "Delivered at: " + new Date(order?.deliveredAt).toLocaleString()
            : "Not Delivered"}
        </Text>
      </View>

      {/* Nút quay lại trang danh sách đơn hàng */}
      <TouchableOpacity
        className="m-4 bg-primary-300 py-2 px-4 rounded-full"
        onPress={() => router.push("/order")} // Điều hướng về trang MyOrders
      >
        <Text className="text-white text-center">Back to My Orders</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OrderDetail;
