import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from '@/redux/api/userApiSlice';
import { RootState } from '@/redux/store';
import { SafeAreaView } from 'react-native-safe-area-context';

const User = () => {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const userId = userInfo?.user?._id;

  // Lấy dữ liệu user từ API
  const { data, isLoading, error } = useGetUserQuery(userId);
  const user = data?.data;

  // State để chỉnh sửa thông tin user
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Mutation để cập nhật user
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Cập nhật thông tin khi có dữ liệu từ API
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  // Xử lý lưu thông tin
  const handleSave = async () => {
    try {
      const updates = { name, email, phone };
      await updateUser({ id: userId!, updates }).unwrap();
      Alert.alert('Success', 'User details updated successfully!', [
        { text: 'OK', onPress: () => router.replace('/profile') },
      ]);
    } catch (error) {
      Alert.alert('Failed', 'Failed to update user details.');
    }
  };

  // Hủy thay đổi
  const handleCancel = () => {
    router.replace('/profile');
  };

  // Nếu đang tải dữ liệu
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // Nếu có lỗi khi tải dữ liệu
  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading user details</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white">

    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-center text-gray-900 mb-6">
        User Details
      </Text>

      {/* Name Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Enter name"
          placeholderTextColor="gray"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Enter email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Phone Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Phone</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Enter phone number"
          placeholderTextColor="gray"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={isUpdating}
        className="bg-primary-300 rounded-md py-3 mt-4"
      >
        {isUpdating ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-medium">Save</Text>
        )}
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        onPress={handleCancel}
        className="bg-red-500 rounded-md py-3 mt-4"
      >
        <Text className="text-center text-white font-medium">Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

export default User;
