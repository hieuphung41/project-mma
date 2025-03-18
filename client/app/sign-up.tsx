import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSignUpMutation, useVerifyEmailMutation } from "@/redux/api/authApiSlice";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const router = useRouter();

  // API calls
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();

  // Handle sign-up process
  const handleSignUp = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await signUp({ name, email, password, phone }).unwrap();
      Alert.alert("Success", response.message, [
        { text: "OK", onPress: () => setShowVerify(true) },
      ]);
    } catch (err) {
      Alert.alert("Sign Up Failed", err?.data?.message || "Something went wrong.");
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }
  
    try {
      await verifyEmail({ email, verificationCode, password }).unwrap();
  
      // 🔥 Reset toàn bộ form sau khi xác thực thành công
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setVerificationCode("");
      setShowVerify(false);
  
      Alert.alert("Success", "Your email has been verified!", [
        { text: "OK", onPress: () => router.push("/sign-in") },
      ]);
    } catch (err) {
      Alert.alert("Verification Failed", err?.data?.message || "Verification failed. Please try again.");
    }
  };
  

  return (
        <SafeAreaView className="h-full bg-white">
    
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-center text-gray-900 mb-6">Create an Account</Text>

      {/* Full Name Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Full Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Enter your full name"
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
          placeholder="Enter your email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Enter your password"
          placeholderTextColor="gray"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Phone Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Phone Number</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Enter your phone number"
          placeholderTextColor="gray"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity onPress={handleSignUp} className="bg-primary-300 rounded-md py-3 mt-4">
        {isSigningUp ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-medium">Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Verify Email Section - Hiển thị sau khi đăng ký thành công */}
      {showVerify && (
        <View className="mt-6">
          <Text className="text-lg font-bold text-center text-gray-900">Verify Your Email</Text>
          <Text className="text-sm text-center text-gray-600 mb-3">
            Enter the verification code sent to your email.
          </Text>

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4"
            placeholder="Enter verification code"
            placeholderTextColor="gray"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />

          <TouchableOpacity onPress={handleVerify} className="bg-green-500 rounded-md py-3">
            {isVerifying ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-white font-medium">Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Redirect to Sign In */}
      <TouchableOpacity onPress={() => router.push("/sign-in")} className="mt-4">
        <Text className="text-center text-primary-300">Already have an account? Sign In</Text>
      </TouchableOpacity>
    </ScrollView></SafeAreaView>
  );
};

export default SignUp;
