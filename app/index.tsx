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
  ScrollView,
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false); // Toggle state
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
    if (role === "USER") router.replace("/(patients)/patienthome");
    else if (role === "ADMIN") router.replace("/(superAdmin)/adminhome");
    else if (role === "ROLE_RECEPTIONIST")
      router.replace("/(receptionist)/receptionisthome");
    else router.replace("/(hospital)/hospitalhome");
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.229:8080/api/auth/login",
        { email: formData.email, password: formData.password }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("AccessToken", response.data.token);
        const decoded = jwtDecode<DecodedToken>(response.data.token);
        redirectUser(decoded.role);
      }
    } catch (error: any) {
      isWeb
        ? window.alert("Login Failed")
        : Alert.alert("Login Failed", "Check credentials");
    }
  };

  const handleRegister = async () => {
    // 1. Validation for empty fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.number ||
      !formData.password
    ) {
      const msg = "Please fill in all fields";
      isWeb ? window.alert(msg) : Alert.alert("Error", msg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const msg = "Passwords do not match";
      isWeb ? window.alert(msg) : Alert.alert("Error", msg);
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.0.229:8080/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.number,
          password: formData.password,
          role: "USER",
        }
      );

      if (response.status === 201 || response.status === 200) {
        const successMsg = "Account created successfully! Please login.";
        isWeb ? window.alert(successMsg) : Alert.alert("Success", successMsg);

        setIsRegistering(false);

        setFormData({
          ...formData,
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      console.error("Registration Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Registration Failed. Email might already exist.";
      isWeb
        ? window.alert(errorMsg)
        : Alert.alert("Registration Failed", errorMsg);
    }
  };

  if (isLoading) return null;

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
        <View
          className={`${
            isWeb
              ? "bg-white w-[1000px] min-h-[550px] flex-row rounded-2xl"
              : "w-full bg-white rounded-xl p-5"
          }`}
        >
          <View
            className={`${
              isWeb
                ? "h-[500px] w-[500px] p-8 ml-8"
                : "h-[200px] w-full m-5 bg-white rounded-t-2xl items-center"
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
                  : "h-full w-[200px] p-2 rounded-2xl"
              }`}
            />
          </View>

          <View
            className={`${
              isWeb
                ? "w-1/2 flex-1 justify-center items-center"
                : "bg-white rounded-b-2xl items-center"
            }`}
          >
            <View
              className={`${
                isWeb
                  ? "w-[350px] p-8 m-8 border border-black/10 rounded-[30px] shadow-lg"
                  : "w-[90%] p-2 mb-4 border border-black/10 rounded-2xl"
              }`}
            >
              <Text
                className={`${
                  isWeb
                    ? "text-2xl italic font-bold mb-6 text-center uppercase tracking-widest"
                    : "text-xl italic font-bold mb-4 text-center uppercase tracking-widest"
                }`}
              >
                {isRegistering ? "Register" : "Login"}
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {isRegistering && (
                  <>
                    <InputField
                      icon="user"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(t: any) =>
                        setFormData({ ...formData, name: t })
                      }
                    />
                    <InputField
                      icon="phone"
                      placeholder="Mobile Number"
                      value={formData.number}
                      onChange={(t: any) =>
                        setFormData({ ...formData, number: t })
                      }
                      keyboardType="phone-pad"
                    />
                  </>
                )}

                <InputField
                  icon="envelope"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(t: any) => setFormData({ ...formData, email: t })}
                  keyboardType="email-address"
                />

                <InputField
                  icon="lock"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(t: any) =>
                    setFormData({ ...formData, password: t })
                  }
                  secure
                />

                {isRegistering && (
                  <InputField
                    icon="lock"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(t: any) =>
                      setFormData({ ...formData, confirmPassword: t })
                    }
                    secure
                  />
                )}

                <TouchableOpacity
                  onPress={isRegistering ? handleRegister : handleLogin}
                  activeOpacity={0.9}
                  className={`${
                    isWeb
                      ? "bg-[#2eb8b8] p-3 rounded-2xl items-center mb-4 mt-2"
                      : "bg-[#2eb8b8] p-2 rounded-2xl items-center mb-4"
                  }`}
                >
                  <Text className="text-white font-semibold text-lg uppercase">
                    {isRegistering ? "Sign Up" : "Login"}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-between px-2">
                  {!isRegistering && (
                    <TouchableOpacity>
                      <Text className="text-xs font-medium">
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => setIsRegistering(!isRegistering)}
                  >
                    <Text className="text-xs font-semibold ">
                      {isRegistering ? "Back to Login" : "Register Now"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
const isWeb = Platform.OS === "web";
const InputField = ({
  icon,
  placeholder,
  value,
  onChange,
  secure = false,
  keyboardType = "default",
}: any) => (
  <View className={`${isWeb ? "mb-4" : "mb-4"}`}>
    <View
      className={`${
        isWeb
          ? "flex-row items-center bg-white/10 rounded-2xl px-4 border border-black/20"
          : "flex-row items-center bg-white/10 rounded-2xl px-2 border border-black/20"
      }`}
    >
      <FontAwesome name={icon} size={18} color="black" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize="none"
        className={`${isWeb ? "flex-1 px-3 py-3" : ""}`}
      />
    </View>
  </View>
);
