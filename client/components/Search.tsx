import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const params = useLocalSearchParams<{ search?: string }>();
  const [search, setSearch] = useState(params.search || "");
  const [modalVisible, setModalVisible] = useState(false);

  // Filter states
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Hàm debounce tìm kiếm
  const debouncedSearch = useDebouncedCallback((text: string) => {
    router.setParams({ search: text });
  }, 2000);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  // Hiển thị Modal
  const handleFilterPress = () => {
    setModalVisible(true);
  };

  // Đóng Modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Xử lý áp dụng bộ lọc
  const handleApplyFilters = () => {
    setModalVisible(false); // Đóng modal khi áp dụng bộ lọc
    router.setParams({ size: selectedSize });
    router.setParams({ color: selectedColor });
    router.setParams({ gender: selectedGender });
    router.setParams({ minPrice: minPrice, maxPrice: maxPrice });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
        <View className="flex-1 flex flex-row items-center justify-start z-50">
          <Image source={icons.search} className="size-5" />
          <TextInput
            value={search}
            onChangeText={handleSearch}
            placeholder="Search for anything"
            className="text-sm font-rubik text-black-300 ml-2 flex-1"
          />
        </View>

        <TouchableOpacity onPress={handleFilterPress}>
          <Image source={icons.filter} className="size-5" />
        </TouchableOpacity>

        {/* Modal cho Filter */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View className="flex-1 justify-end items-center bg-opacity-50 ">
              <TouchableWithoutFeedback>
                <View
                  className="bg-white w-full p-6 rounded-t-xl shadow-lg"
                  style={{ maxHeight: "60%" }}
                >
                  {/* <Text className="text-2xl font-rubik-bold text-black mb-6">Filter Options</Text> */}

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Size Filter */}
                    <View className="mb-6">
                      <Text className="text-black text-lg font-rubik-semibold mb-2">
                        Size
                      </Text>
                      <View className="flex-row flex-wrap">
                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                          <TouchableOpacity
                            key={size}
                            onPress={() => setSelectedSize(size)}
                            style={{
                              backgroundColor:
                                selectedSize === size ? "#d1d1d1" : "#f2f2f2",
                              paddingVertical: 8,
                              paddingHorizontal: 15,
                              margin: 6,
                              borderRadius: 25,
                              borderWidth: 1,
                              borderColor:
                                selectedSize === size ? "#BDBDBD" : "#E0E0E0",
                              alignItems: "center",
                            }}
                          >
                            <Text className="text-base font-rubik-medium">
                              {size}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Color Filter */}
                    <View className="mb-6">
                      <Text className="text-black text-lg font-rubik-semibold mb-2">
                        Color
                      </Text>
                      <View className="flex-row flex-wrap">
                        {["Black", "Red", "Blue", "Golden"].map((color) => (
                          <TouchableOpacity
                            key={color}
                            onPress={() => setSelectedColor(color)}
                            style={{
                              backgroundColor:
                                selectedColor === color ? "#d1d1d1" : "#f2f2f2",
                              paddingVertical: 8,
                              paddingHorizontal: 15,
                              margin: 6,
                              borderRadius: 25,
                              borderWidth: 1,
                              borderColor:
                                selectedColor === color ? "#BDBDBD" : "#E0E0E0",
                              alignItems: "center",
                            }}
                          >
                            <Text className="text-base font-rubik-medium">
                              {color}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Gender Filter */}
                    <View className="mb-6">
                      <Text className="text-black text-lg font-rubik-semibold mb-2">
                        Gender
                      </Text>
                      <View className="flex-row flex-wrap">
                        {["Men", "Woman", "Unisex"].map((gender) => (
                          <TouchableOpacity
                            key={gender}
                            onPress={() => setSelectedGender(gender)}
                            style={{
                              backgroundColor:
                                selectedGender === gender
                                  ? "#d1d1d1"
                                  : "#f2f2f2",
                              paddingVertical: 8,
                              paddingHorizontal: 15,
                              margin: 6,
                              borderRadius: 25,
                              borderWidth: 1,
                              borderColor:
                                selectedGender === gender
                                  ? "#BDBDBD"
                                  : "#E0E0E0",
                              alignItems: "center",
                            }}
                          >
                            <Text className="text-base font-rubik-medium">
                              {gender}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Price Range Filter */}
                    <View className="mb-6">
                      <Text className="text-black text-lg font-rubik-semibold mb-2">
                        Price Range
                      </Text>
                      <TextInput
                        placeholder="Min Price"
                        placeholderTextColor={"gray"}
                        value={minPrice}
                        onChangeText={setMinPrice}
                        className="border border-primary-200 p-3 rounded-md mb-4"
                        style={{ fontSize: 16 }}
                      />
                      <TextInput
                        placeholder="Max Price"
                        placeholderTextColor={"gray"}
                        value={maxPrice}
                        onChangeText={setMaxPrice}
                        className="border border-primary-200 p-3 rounded-md"
                        style={{ fontSize: 16 }}
                      />
                    </View>

                    {/* Buttons */}
                    <View className="flex-row justify-between">
                      <TouchableOpacity
                        className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full "
                        onPress={handleApplyFilters}
                      >
                        <Text className="text-white text-lg text-center font-rubik-bold">
                          Apply Now
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 flex flex-row items-center justify-center bg-red-500 py-3 rounded-full "
                        onPress={handleCloseModal}
                      >
                        <Text className="text-white text-lg text-center font-rubik-bold">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Search;
