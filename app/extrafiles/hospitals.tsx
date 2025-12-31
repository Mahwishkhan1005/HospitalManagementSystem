import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  departments: string[];
  numberOfDoctors: number;
  numberOfBeds: number;
  contactNumber: string;
  email: string;
  rating: string;
  picture: string;
}

export default function ChooseCareHome() {
  const isWeb = Platform.OS === "web";
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://192.168.0.133:8080/api/hospitals/all"
      );
      setHospitals(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      const errorMsg = "Could not load hospitals. Please try again later.";
      isWeb ? window.alert(errorMsg) : Alert.alert("Error", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await AsyncStorage.clear();
        router.replace("/");
      } catch (error) {
        console.error("Logout Error:", error);
      }
    };

    if (isWeb) {
      if (window.confirm("Are you sure you want to log out?")) performLogout();
    } else {
      Alert.alert("Logout", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: performLogout },
      ]);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="bg-slate-50">
        <LinearGradient
          colors={["rgba(177, 235, 252, 0.86)", "rgba(90, 250, 215, 0.86)"]}
          locations={[0.36, 1.0]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <View
            className={`${
              isWeb
                ? "flex-row h-[60px] justify-between items-center"
                : "flex-row h-[80px] justify-between items-center pt-8"
            }`}
          >
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.push("/(patients)/patienthome")}
                className={`${isWeb ? "m-4" : "m-2 mt-3"}`}
              >
                <FontAwesome name="chevron-left" size={20} color="#334155" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-[#334155]">
                Available Hospitals
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-[#2eb8b8] px-4 py-2 rounded-xl mr-4"
            >
              <Text className="text-white font-bold">Logout</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className={`${isWeb ? "p-4" : "mb-8"}`}>
          {isLoading ? (
            <View className="w-full py-20 items-center">
              <ActivityIndicator size="large" color="#2eb8b8" />
              <Text className="mt-4 text-slate-500">Loading Hospitals...</Text>
            </View>
          ) : (
            hospitals.map((hospital) => (
              <View
                className={`${
                  isWeb
                    ? "w-full mt-8 flex-row h-[340px]"
                    : "w-[330px] h-[170px] mt-6 mx-4"
                } rounded-3xl overflow-hidden shadow-xl`}
              >
                <View className="w-1/3">
                  <ImageBackground
                    source={{
                      uri:
                        hospital.picture ||
                        "https://www.carehospitals.com/assets/images/main/malpet-new-inner.webp",
                    }}
                    className="flex-1"
                    resizeMode="cover"
                  />
                </View>

                <View className="flex-1 px-5 py-4">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-slate-900">
                        {hospital.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <FontAwesome
                          name="map-marker"
                          size={14}
                          color="#2eb8b8"
                        />
                        <Text className="text-slate-500 ml-2 text-sm">
                          {hospital.address}, {hospital.city}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-yellow-50 px-3 py-1 rounded-lg flex-row items-center">
                      <FontAwesome name="star" size={14} color="#f59e0b" />
                      <Text className="ml-1 font-bold text-yellow-700">
                        {hospital.rating}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row mr-8">
                    <InfoCard
                      icon="user-md"
                      label="Doctors"
                      value={hospital.numberOfDoctors}
                      color="bg-blue-100"
                      bgColor="#d6e0f5"
                      iconColor="#2563eb"
                    />
                    <InfoCard
                      icon="bed"
                      label="Beds"
                      value={hospital.numberOfBeds}
                      bgColor="#ffcce6"
                      iconColor="#e60073"
                    />
                    <InfoCard
                      icon="phone"
                      label="Contact"
                      value={hospital.contactNumber}
                      color="bg-purple-50"
                      bgColor="#e6ccff"
                      iconColor="#8b5cf6"
                    />
                    <InfoCard
                      icon="envelope"
                      label="email"
                      value={hospital.email || "@gmail.com"}
                      color="bg-red-100"
                      bgColor="#ffcccc"
                      iconColor="#ff0000"
                    />
                    <InfoCard
                      icon="clock-o"
                      label="timing"
                      value="Open 24/7"
                      color="bg-pink-100"
                      bgColor="#ccffcc"
                      iconColor="#10b981"
                    />
                  </View>

                  <View>
                    <Text className="text-xl font-bold text-slate-900 mb-2">
                      About Hospital
                    </Text>
                    <Text className="text-slate-600 leading-6 pb-8">
                      {hospital.name} is a premier healthcare facility located
                      in {hospital.city}. We provide world-class medical
                      services across multiple departments Ourmission is to
                      provide compassionate care with modern technology.
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      router.push({
                        pathname: "/extrafiles/department_details",
                        params: { id: hospital.id, name: hospital.name },
                      })
                    }
                    className="w-1/3 mt-4 mb-2"
                  >
                    <LinearGradient
                      colors={[
                        "rgba(177, 235, 252, 0.86)",
                        "rgba(90, 250, 215, 0.86)",
                      ]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      className="py-2 rounded-2xl flex-row justify-center items-center"
                    >
                      <FontAwesome6
                        name="user-doctor"
                        size={20}
                        color="#334155"
                      />
                      <Text className="text-slate-700 text-sm  font-bold ml-3">
                        Available Departments
                      </Text>
                      <FontAwesome
                        name="arrow-right"
                        size={15}
                        color="#334155"
                        className={`${isWeb ? "ml-4" : ""}`}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
const isWeb = Platform.OS === "web";
const InfoCard = ({ icon, label, value, color, iconColor, bgColor }: any) => (
  <View
    style={{ backgroundColor: bgColor }}
    className={`${
      isWeb
        ? "flex-1 py-4 m-4 rounded-2xl items-center border  border-white/50"
        : "flex-1 py-4 m-4 rounded-2xl items-center border  border-white/50"
    }`}
  >
    <FontAwesome name={icon} size={20} color={iconColor} />
    <Text className="text-slate-900 font-bold mt-2">{value}</Text>
    <Text className="text-slate-500 text-[10px] uppercase font-semibold">
      {label}
    </Text>
  </View>
);

const ContactItem = ({ icon, text }: any) => (
  <View className="flex-row items-center mb-4">
    <View className="w-8">
      <FontAwesome name={icon} size={16} color="#64748b" />
    </View>
    <Text className="text-slate-700 font-medium">{text}</Text>
  </View>
);
