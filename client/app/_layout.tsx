import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import {Provider} from 'react-redux'
import store from '../redux/store'
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require(".././assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require(".././assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-SemiBold": require(".././assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-Regular": require(".././assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Medium": require(".././assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Light": require(".././assets/fonts/Rubik-Light.ttf"),
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) return null;
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
