import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DecodedToken {
  role: string;
  [key: string]: any;
}

export default function Index() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("AccessToken");
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);

        redirectUser(decoded.role);
      }
    } catch (e) {
      console.log("Error checking login status", e);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUser = (role: string) => {
    if (role === "ROLE_PATIENT") {
      router.replace("/(patients)/patienthome");
    } else if (role === "ROLE_HOSPITAL") {
      router.replace("/(hospital)/hospitalhome");
    } else if (role === "ROLE_RECEPTIONIST") {
      router.replace("/(receptionist)/receptionisthome");
    } else {
      router.replace("/(superAdmin)/adminhome");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.225:8083/api/auth/login",
        { email: formData.email, password: formData.password }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("AccessToken", response.data.accessToken);
        const decoded = jwtDecode<DecodedToken>(response.data.accessToken);
        redirectUser(decoded.role);
      }
    } catch (error: any) {
      if (isWeb) {
        window.alert("Login Failed: Please check your credentials.");
      } else {
        Alert.alert("Login Failed", "Please check your credentials.");
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <LinearGradient
      colors={["rgba(177, 235, 252, 0.86)", "rgba(90, 250, 215, 0.86)"]}
      locations={[0.36, 1.0]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      className="flex-1 items-center justify-center"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 items-center justify-center p-4"
      >
        {/* <BlurView intensity={50} tint="dark"></BlurView> */}
        <View
          className={`${
            isWeb
              ? "bg-white w-[1000px] h-[500px] flex-row rounded-2xl"
              : "w-ful bg-white rounded-xl"
          }`}
        >
          <View
            className={`${
              isWeb
                ? " w-1/2 h-full rounded-2xl p-8 ml-8"
                : "h-[200px] w-[230px] ml-6 bg-white rounded-2xl"
            }`}
          >
            <ImageBackground
              source={{
                uri: "https://vedantahealthcare.com/wp-content/uploads/2024/06/meet-our-doctors-heading-image.jpg",
              }}
              resizeMode="cover"
              className={`${
                isWeb
                  ? "flex-1 rounded-2xl"
                  : "flex-1 w-[200px] m-5 rounded-2xl"
              }`}
            ></ImageBackground>
          </View>

          <View
            className={`${
              isWeb
                ? " w-1/2 h-full rounded-xl flex-1 justify-center items-center"
                : " bg-white rounded-2xl justify-center items-center"
            }`}
          >
            <View
              className={`${
                isWeb
                  ? "w-[350px] overflow-hidden rounded-[30px] border border-white/20 shadow-slate-300  shadow-lg"
                  : "w-[250px] p-4 m-4 border border-black/10 rounded-2xl "
              } `}
            >
              <View className={`${isWeb ? "p-8" : ""}`}>
                <Text
                  className={`${
                    isWeb
                      ? "text-3xl italic font-bold mb-8 text-center uppercase tracking-widest"
                      : "text-xl italic font-bold mb-5 text-center uppercase tracking-widest"
                  }`}
                >
                  Login
                </Text>
                <TouchableOpacity className="bg-slate-600" onPress={router.replace('/(receptionist)/receptionisthome')}><Text>receptionist</Text></TouchableOpacity>
                

                <View className={`${isWeb ? "mb-5" : "mb-4"}`}>
                  <View className="flex-row items-center bg-white/10 rounded-2xl px-4 border border-black/20">
                    <FontAwesome name="user" size={18} color="" />
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="black"
                      value={formData.email}
                      onChangeText={(text) =>
                        setFormData({ ...formData, email: text })
                      }
                      className={`flex-1 px-3 py-4 ${
                        isWeb ? "outline-none" : ""
                      }`}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View className="mb-8">
                  <View className="flex-row items-center bg-white/10 rounded-2xl px-4 border border-black/20">
                    <FontAwesome name="lock" size={18} color="black" />
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor="black"
                      secureTextEntry
                      value={formData.password}
                      onChangeText={(text) =>
                        setFormData({ ...formData, password: text })
                      }
                      className={`flex-1  px-3 py-4 ${
                        isWeb ? "outline-none" : ""
                      }`}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleLogin}
                  activeOpacity={0.9}
                  className={`${
                    isWeb
                      ? "w-2/3 bg-[#2eb8b8] p-3 ml-12 rounded-2xl items-center mb-4"
                      : "w-2/3 bg-[#2eb8b8] p-2 ml-12 rounded-2xl items-center mb-4"
                  }`}
                >
                  <Text className="text-white font-semibold text-lg uppercase">
                    Login
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-between px-2">
                  <TouchableOpacity>
                    <Text className=" text-xs font-medium">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text className=" text-xs font-medium">Register Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
