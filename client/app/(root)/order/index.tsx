import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { useGetOrdersByUserIdQuery } from "@/redux/api/orderApiSlice";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "@/redux/store";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { useRouter } from "expo-router";

const MyOrders = () => {
  const navigation = useNavigation();
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const userId = userInfo?.user?._id;

  // Thiết lập trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái cho trang hiện tại
  const [ordersPerPage] = useState(5); // Mỗi trang sẽ có 5 đơn hàng

  const { data, isLoading, error } = useGetOrdersByUserIdQuery({
    userId,
    page: currentPage,
    limit: ordersPerPage,
  });

  const orders = data?.data.orders;
  const totalPages = data?.data.totalPages; // Số trang
  const totalOrders = data?.data.totalOrders; // Tổng số đơn hàng

  const router = useRouter();

  const handleOrderDetailPress = (id: string) => {
    router.push(`/order/${id}`); // Điều hướng đến OrderDetail với orderId
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="border-b border-gray-300 p-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-semibold">{item.status}</Text>
        <Text className="text-lg text-primary-300">
          ${item.priceAfterDiscount}
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-sm text-gray-600">
          Payment Method: {item.paymentMethod}
        </Text>
        {/* Hiển thị chi tiết địa chỉ */}
        <Text className="text-sm text-gray-600">
          Address: {item.address.fullName}, {item.address.location},{" "}
          {item.address.city}, {item.address.country}
        </Text>
        {/* Kiểm tra xem có coupon không, nếu có thì hiển thị tên coupon và giá trị giảm giá */}
        <Text className="text-sm text-gray-600">
          Discount:{" "}
          {item.coupon
            ? item.coupon.name + " - " + item.coupon.discount + "%"
            : "N/A"}
        </Text>
      </View>
      <FlatList
        data={item.orderItems}
        keyExtractor={(orderItem, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="flex flex-row items-center mt-2">
            <Image
              source={{ uri: item.image || images.avatar }}
              className="w-12 h-12 rounded-md"
            />
            <View className="ml-3">
              <Text className="text-sm font-medium">{item.name}</Text>
              <Text className="text-sm text-gray-500">
                {item.size} | {item.color}
              </Text>
              <Text className="text-sm font-semibold">
                {item.quantity} x ${item.price}
              </Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        className="mt-3 bg-primary-300 py-2 px-4 rounded-full"
        onPress={() => handleOrderDetailPress(item._id)}
      >
        <Text className="text-white text-center">View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0061ff" />
        <Text className="text-gray-500 mt-3">Loading your orders...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-red-500">
          Error loading orders. Please try again.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button and title */}
      <View className="bg-white border-b border-gray-300 py-4 px-5 flex flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.push("/profile")} // Quay lại trang trước
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
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">You have no orders yet.</Text>
          </View>
        }
      />
      {/* Pagination Controls */}
      <View className="flex-row justify-between items-center py-3 px-5">
        <TouchableOpacity
          onPress={handlePreviousPage}
          className="bg-primary-300 py-2 px-4 rounded-full"
        >
          <Text className="text-white">Previous</Text>
        </TouchableOpacity>
        <Text className="text-sm">
          Page {currentPage} of {totalPages}
        </Text>
        <TouchableOpacity
          onPress={handleNextPage}
          className="bg-primary-300 py-2 px-4 rounded-full"
        >
          <Text className="text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyOrders;
