import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useDebouncedCallback } from "use-debounce";
import { useGetCategoriesQuery } from "@/redux/api/categoryApiSlice";

const Filters = ({ onFilterChange }: { onFilterChange: (filters: { search: string; category: string }) => void }) => {
  const params = useLocalSearchParams<{ search?: string; category?: string }>();

  const [selectedCategory, setSelectedCategory] = useState(params.category || "");
  const [search, setSearch] = useState(params.search || "");

  // Sử dụng Redux Toolkit Query để lấy danh mục
  const { data: categoryData, isLoading, error } = useGetCategoriesQuery();
  const categories = categoryData?.data.categories || [];

  // Gửi category mới đến `index.tsx`
  const debouncedCategory = useDebouncedCallback((category: string) => {
    router.setParams({ search, category });
    setSelectedCategory(category);
    onFilterChange({ search, category });
  }, 500);

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) return;
    debouncedCategory(category);
  };

  if (isLoading) {
    return <Text className="text-center text-gray-500">Loading categories...</Text>;
  }

  if (error) {
    return <Text className="text-center text-red-500">Error loading categories</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 mb-2">
      {categories.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleCategoryPress(item.name)}
          key={index}
          className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${
            selectedCategory === item.name
              ? "bg-primary-300"
              : "bg-primary-100 border border-primary-200"
          }`}
        >
          <Text
            className={`text-sm ${
              selectedCategory === item.name
                ? "text-white font-rubik-bold mt-0.5"
                : "text-black-300 font-rubik"
            }`}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filters;
