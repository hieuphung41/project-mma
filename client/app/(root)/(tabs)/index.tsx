import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useGetProductsQuery } from "@/redux/api/productApiSlice";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import avatar from "@/assets/images/avatar.jpg";
import { RootState } from "@/redux/store";

const Home = () => {
  const params = useLocalSearchParams<{
    search?: string;
    category?: string;
    size?: string;
    color?: string;
    gender?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();
  const handleCardPress = (id: string) => router.push(`/properties/${id}`);
  const handleSeeAll = () => router.push("/explore");

  const user = useSelector((state: RootState) => state.auth.user);

  // Lưu trạng thái search & category để truyền vào API
  const [filters, setFilters] = useState({
    search: params.search || "",
    category: params.category || "",
    size: params.size || "",
    color: params.color || "",
    gender: params.gender || "",
    minPrice: params.minPrice || "",
    maxPrice: params.maxPrice || "",
  });

  // Gọi API sản phẩm dựa vào `filters`
  const { data, isLoading, error, refetch } = useGetProductsQuery(filters);

  // Cập nhật `filters` khi params thay đổi
  useEffect(() => {
    setFilters({
      search: params.search || "",
      category: params.category || "",
      size: params.size || "",
      color: params.color || "",
      gender: params.gender || "",
      minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "",
    });
    refetch(); // Load lại sản phẩm mỗi khi params thay đổi
  }, [
    params.search,
    params.category,
    params.size,
    params.color,
    params.gender,
    params.minPrice,
    params.maxPrice,
  ]);

  const products = data?.data.products || [];

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    let greetingMessage = "Good Morning";

    if (currentHour >= 12 && currentHour < 18) {
      greetingMessage = "Good Afternoon";
    } else if (currentHour >= 18 && currentHour < 22) {
      greetingMessage = "Good Evening";
    } else if (currentHour >= 22 || currentHour < 6) {
      greetingMessage = "Good Night";
    }

    setGreeting(greetingMessage);
  }, []);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item._id)} />
        )}
        keyExtractor={(item) => item._id.toString()}
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
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image
                  source={avatar}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                  }}
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    {greeting}
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {user?.user.name}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.navigate("/cart")}>
                <Image source={icons.cart} className="size-6" />
              </TouchableOpacity>
            </View>

            <Search />

            <View className="mt-5">
              <Filters onFilterChange={setFilters} />
            </View>

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Hot Search
                </Text>
                <TouchableOpacity>
                  <Text
                    className="text-base font-rubik-bold text-primary-300"
                    onPress={handleSeeAll}
                  >
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : products.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={products}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item._id)}
                    />
                  )}
                  keyExtractor={(item) => item._id}
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}

              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                All Products
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
