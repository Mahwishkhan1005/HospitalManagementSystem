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
  Modal,
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

const API_BASE_URL = "http://192.168.0.246:8080/api/auth";

export default function Index() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1);
  const [resetData, setResetData] = useState({
    otp: "",
    newPassword: "",
  });
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const isWeb = Platform.OS === "web";

  useEffect(() => {
    checkLoginStatus();
  }, []);

const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("AccessToken");

      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);

        // PERSIST ROLE: This makes it visible in browser inspect/application tab
        await AsyncStorage.setItem("userRole", decoded.role);

        redirectUser(decoded.role);
      }
    } catch (e) {
      console.log("Error checking login status", e);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUser = (role: string) => {
    // const normalizedRole = role?.toUpperCase();
    if (role === "USER") router.replace("/(patients)/patienthome");
    else if (role === "ADMIN") router.replace("/(superAdmin)/adminhome");
    else router.replace('/receptionist');
  };

 const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        const token = response.data.accessToken;
        const decoded = jwtDecode<DecodedToken>(token);

        // PERSIST BOTH TOKEN AND ROLE
        await AsyncStorage.setItem("AccessToken", token);
        await AsyncStorage.setItem("userRole", decoded.role); // Key used: userRole

        redirectUser(decoded.role);
      }
    } catch (error: any) {
      const msg = "Invalid credentials";
      isWeb ? window.alert(msg) : Alert.alert("Login Failed", msg);
    }
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password) {
      const msg = "Please fill required fields";
      return isWeb ? window.alert(msg) : Alert.alert("Error", msg);
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201 || response.status === 200) {
        const msg = "Registration successful! Please login.";
        isWeb ? window.alert(msg) : Alert.alert("Success", msg);
        setIsRegistering(false);
      }
    } catch (error: any) {
      const msg = "Registration failed";
      isWeb ? window.alert(msg) : Alert.alert("Error", msg);
    }
  };

  const handleForgotPasswordRequest = async () => {
    if (!forgotEmail) return Alert.alert("Error", "Enter your email");
    try {
      const response = await axios.post(`http://192.168.0.236:8080/auth/forgot-password?email=${forgotEmail}`);
      if (response.status === 200) setForgotStep(2);
    } catch (error: any) {
      Alert.alert("Error", "Action failed");
    }
  };

  const handleResetPasswordSubmit = async () => {
    const BASE_URL = "http://192.168.0.236:8080";
    try {
      if (!isOtpVerified) {
        const response = await axios.post(`${BASE_URL}/api/auth/verify-otp?otp=${resetData.otp}`, {
          email: forgotEmail,
          otp: resetData.otp,
        });
        if (response.status === 200) setIsOtpVerified(true);
        return;
      }

      const url = `${BASE_URL}/auth/reset-password?email=${encodeURIComponent(forgotEmail)}&newPassword=${encodeURIComponent(resetData.newPassword)}`;
      const response = await axios.post(url);
      if (response.status === 200) {
        Alert.alert("Success", "Password reset successfully!");
        setShowForgotModal(false);
        setForgotStep(1);
        setIsOtpVerified(false);
      }
    } catch (error: any) {
      Alert.alert("Error", "Reset failed");
    }
  };

  if (isLoading) return null;

  return (
    <LinearGradient colors={["#b1ebfc", "#5afad7"]} className="flex-1 items-center justify-center">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 items-center justify-center p-4">
        <View className={`${isWeb ? "bg-white w-[1000px] min-h-[550px] flex-row rounded-2xl" : "w-full bg-white rounded-xl p-5"}`}>
          
          <View className={`${isWeb ? "h-[500px] w-[500px] p-8 ml-8" : "h-[150px] w-full items-center mb-5"}`}>
            <ImageBackground
              source={{ uri: "https://vedantahealthcare.com/wp-content/uploads/2024/06/meet-our-doctors-heading-image.jpg" }}
              resizeMode="cover"
              className="flex-1 rounded-2xl overflow-hidden"
              style={!isWeb ? { width: 200 } : {}}
            />
          </View>

          <View className={`${isWeb ? "w-1/2 flex-1 justify-center items-center" : "items-center"}`}>
            <View className={`${isWeb ? "w-[350px] p-8 border border-black/10 rounded-[30px] shadow-lg" : "w-full"}`}>
              <Text className="text-2xl italic font-bold mb-6 text-center uppercase tracking-widest text-gray-800">
                {isRegistering ? "Register" : "Login"}
              </Text>
              
              <ScrollView showsVerticalScrollIndicator={false}>
                <InputField
                  icon="envelope"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(t: string) => setFormData({ ...formData, email: t })}
                  keyboardType="email-address"
                />
                
                <InputField
                  icon="lock"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(t: string) => setFormData({ ...formData, password: t })}
                  secure
                />

                <TouchableOpacity
                  onPress={isRegistering ? handleRegister : handleLogin}
                  className="bg-[#2eb8b8] p-4 rounded-xl items-center mt-4 shadow-sm"
                >
                  <Text className="text-white font-bold text-lg">
                    {isRegistering ? "SIGN UP" : "LOGIN"}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-between mt-6 px-2">
                  {!isRegistering && (
                    <TouchableOpacity onPress={() => setShowForgotModal(true)}>
                      <Text className="text-xs text-sky-600 font-medium">Forgot Password?</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                    <Text className="text-xs font-bold text-gray-600">
                      {isRegistering ? "Already have an account? Login" : "New here? Register Now"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showForgotModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-3xl w-[90%] max-w-[400px]">
            {forgotStep === 1 ? (
              <>
                <Text className="text-xl font-bold mb-4">Reset Password</Text>
                <InputField icon="envelope" placeholder="Email Address" value={forgotEmail} onChange={setForgotEmail} />
                <TouchableOpacity onPress={handleForgotPasswordRequest} className="bg-[#2eb8b8] p-3 rounded-xl items-center">
                  <Text className="text-white font-bold">SEND OTP</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text className="text-xl font-bold mb-2">{isOtpVerified ? "Create New Password" : "Enter Reset OTP"}</Text>
                {!isOtpVerified ? (
                  <InputField icon="lock" placeholder="6-digit OTP" value={resetData.otp} onChange={(t: string) => setResetData({ ...resetData, otp: t })} />
                ) : (
                  <InputField icon="key" placeholder="New Password" secure value={resetData.newPassword} onChange={(t: string) => setResetData({ ...resetData, newPassword: t })} />
                )}
                <TouchableOpacity onPress={handleResetPasswordSubmit} className="bg-[#2eb8b8] p-3 rounded-xl items-center mt-4">
                  <Text className="text-white font-bold">{isOtpVerified ? "UPDATE" : "VERIFY"}</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={() => { setShowForgotModal(false); setForgotStep(1); setIsOtpVerified(false); }} className="mt-4 items-center">
              <Text className="text-gray-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const InputField = ({ icon, placeholder, value, onChange, secure, keyboardType }: any) => (
  <View className="mb-4 flex-row items-center bg-gray-100 rounded-xl px-3 border border-gray-200">
    <FontAwesome name={icon} size={18} color="#666" />
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      secureTextEntry={secure}
      keyboardType={keyboardType}
      className="flex-1 p-3 ml-2"
      autoCapitalize="none"
    />
  </View>
);