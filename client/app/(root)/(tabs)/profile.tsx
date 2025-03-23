import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import { useRouter } from "expo-router";
import avatar from "@/assets/images/avatar.jpg";
import { useGetUserQuery } from "@/redux/api/userApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSignOutMutation } from "@/redux/api/authApiSlice";

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

const Profile = () => {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.auth.user);

  const userId = userInfo?.user?._id;

  // Gọi API lấy thông tin người dùng
  const { data, isLoading, error } = useGetUserQuery(userId);
  const user = data?.user;

  // API logout
  const [logout] = useSignOutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("Logout Failed");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Loading user profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading profile</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image source={avatar} className="size-44 relative rounded-full" />
            <Text className="text-2xl font-rubik-bold mt-2">
              {user?.name || "Unknown User"}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem
            title={`Name: ${user?.name || "Unknown"}`}
            icon={icons.bell}
            onPress={() => {}}
          />
          <SettingsItem
            title={`Email: ${user?.email || "Unknown"}`}
            icon={icons.bell}
            onPress={() => {}}
          />
          <SettingsItem
            title={`Phone: ${user?.phone || "Unknown"}`}
            icon={icons.bell}
            onPress={() => {}}
          />
        </View>

        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
