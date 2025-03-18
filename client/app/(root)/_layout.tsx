import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function AppLayout() {
  const { loading, user } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}
