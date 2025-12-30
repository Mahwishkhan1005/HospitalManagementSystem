import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import {
    Alert,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AboutPage = () => {
  const isWeb = Platform.OS === "web";

  const features = [
    "Seamless Care",
    "Warm and Welcoming Environment",
    "Comprehensive Care",
    "Expert Doctors",
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("AccessToken");
      isWeb
        ? alert("Logged out successfully")
        : Alert.alert("Logout", "You have been logged out.");
      router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
   <SafeAreaView className={`flex-1 bg-white }`}>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/free-photo/blurred-abstract-background-interior-view-looking-out-toward-empty-hospital-corridor_1339-6364.jpg",
        }}
        resizeMode="cover"
        imageStyle={{ opacity: 0.8 }}
        className="flex-1"
      >
        {/* Logout Button */}
        <View className={`absolute z-10 ${isWeb ? "top-10 right-10" : "top-5 right-5"}`}>
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-white/90 px-4 py-2 rounded-full border border-teal-200 shadow-sm"
          >
            <FontAwesome name="sign-out" size={16} color="#0d9488" />
            <Text className="ml-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            className={`flex-1 ${
              isWeb ? "flex-row p-20" : "flex-col p-6"
            } items-center justify-center`}
          >
            {/* LEFT SECTION */}
            <View className={`${isWeb ? "w-1/3" : "w-full mb-10"}`}>
              <Text className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-4"> 
                About WECARE
              </Text>

              <Text className="text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                We Provide Finest Patient’s{" "}
                <Text className="text-teal-600">Care & Amenities</Text>
              </Text>

              <Text className="text-gray-500 leading-6 mb-8 text-base">
                Experience comprehensive healthcare where your well-being comes first.
                WECARE is dedicated to delivering personalized, compassionate, and
                reliable medical services.
              </Text>

              {/* BUTTONS */}
              <View className="flex-row items-center gap-4 flex-wrap">
                {/* View Appointments */}
                <TouchableOpacity
                  onPress={() =>
                    router.replace("/(receptionist)/receptionisthome")
                  }
                  className="flex-row items-center bg-teal-500 px-6 py-3 rounded-full shadow-lg"
                >
                  <Ionicons name="calendar-outline" size={18} color="#fff" />
                  <Text className="ml-3 text-white font-bold">
                    View Appointments
                  </Text>
                </TouchableOpacity>

                {/* Show Doctors */}
                <TouchableOpacity
                  onPress={() => router.push("/(receptionist)/receptionDoctor")}
                  className="flex-row items-center border-2 border-teal-600 px-6 py-3 rounded-full"
                >
                  <Ionicons name="medical-outline" size={18} color="#0d9488" />
                  <Text className="ml-3 text-teal-600 font-bold">
                    Show Doctors
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* MIDDLE IMAGE */}
            <View className={`${isWeb ? "w-1/3 px-10" : "w-full mb-10"} items-center relative`}>
              <View className="rounded-t-full rounded-b-3xl overflow-hidden border-8 border-white shadow-2xl">
                <Image
                  source={{
                    uri: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1150-12882.jpg",
                  }}
                  style={{ width: isWeb ? 350 : 300, height: 500 }}
                  resizeMode="cover"
                />
              </View>

              <View className="absolute bottom-5 left-5 bg-emerald-50 p-6 rounded-2xl shadow-xl">
                <Text className="text-3xl font-black text-slate-800">5K+</Text>
                <Text className="text-[10px] text-gray-500 font-bold uppercase">
                  Patient{"\n"}Reviews
                </Text>
              </View>
            </View>

            {/* RIGHT SECTION */}
            <View className={`${isWeb ? "w-1/4" : "w-full"}`}>
              <View className="rounded-3xl overflow-hidden mb-8 shadow-md">
                <Image
                  source={{
                    uri: "https://img.freepik.com/free-photo/surgeons-performing-surgery-operation-theater_107420-64893.jpg",
                  }}
                  style={{ width: "100%", height: 200 }}
                  resizeMode="cover"
                />
              </View>

              <Text className="text-xl font-bold text-slate-900 mb-6">
                Why Choose Us
              </Text>

              {features.map((feature, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <FontAwesome name="check-circle" size={16} color="#22c55e" />
                  <Text className="ml-3 text-slate-700 font-medium">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AboutPage;
