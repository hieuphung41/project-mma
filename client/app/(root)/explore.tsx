import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/Cards";
import NoResults from "@/components/NoResults";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import { useGetProductsQuery } from "@/redux/api/productApiSlice";

const Explore = () => {
  const params = useLocalSearchParams<{
    query?: string;
    filter?: string;
    size?: string;
    color?: string;
    gender?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();

  // State chứa các bộ lọc (search, category, and additional filters)
  const [filters, setFilters] = useState({
    search: params.query || "",
    category: params.filter || "",
    size: params.size || "",
    color: params.color || "",
    gender: params.gender || "",
    minPrice: params.minPrice || "",
    maxPrice: params.maxPrice || "",
  });

  // Gọi API lấy danh sách sản phẩm
  const { data, isLoading, error, refetch } = useGetProductsQuery(filters);

  useEffect(() => {
    // Khi `params` thay đổi, cập nhật bộ lọc và refetch dữ liệu
    setFilters({
      search: params.query || "",
      category: params.filter || "",
      size: params.size || "",
      color: params.color || "",
      gender: params.gender || "",
      minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "",
    });
    refetch();
  }, [
    params.query,
    params.filter,
    params.size,
    params.color,
    params.gender,
    params.minPrice,
    params.maxPrice,
  ]);

  const products = data?.data.products || [];
  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item._id)} />
        )}
        keyExtractor={(item) => item._id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="bg-white border-b border-gray-300 py-4 px-5 flex flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <Text className="text-xl font-rubik-extrabold text-center flex-1">
                Search for Shoes
              </Text>
              <View className="w-5" />
            </View>

            <Search />

            <View className="mt-5">
              <Filters onFilterChange={setFilters} />

              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {products.length} results
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Explore;
