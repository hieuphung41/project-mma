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
  console.log('====================================');
  console.log(data);
  console.log('====================================');

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
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading profile</Text>
      </View>
    );
  }
const navigateToCart = () => {
  router.push("/cart");
}
const navigateToUserDetail =()=>{
  router.push('/user')
}
const navigateToOrder =()=>{
  router.push('/order')
}
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
           <TouchableOpacity onPress={()=>router.navigate('/cart')}>
                          <Image source={icons.cart} className="size-6" />
                        </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={avatar}
              className="size-44 relative rounded-full"
            />
            <TouchableOpacity className="absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9" />
            </TouchableOpacity>

            <Text className="text-2xl font-rubik-bold mt-2">
              {user?.name || "Unknown User"}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          {/* <SettingsItem icon={icons.cart} title="My Cart" onPress={navigateToCart}/> */}
          <SettingsItem icon={icons.bell} title="Notifications" onPress={()=>{}}/>
          <SettingsItem icon={icons.calendar} title="My Orders" onPress={navigateToOrder} />
          <SettingsItem icon={icons.wallet} title="Payments" />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">

          <SettingsItem icon={icons.person} title="Profile" onPress={navigateToUserDetail}/>
          <SettingsItem icon={icons.language} title="Language" />
          <SettingsItem icon={icons.info} title="Help Center" />

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
