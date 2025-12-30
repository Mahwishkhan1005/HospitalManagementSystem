import { FontAwesome } from "@expo/vector-icons";
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
  noofbeds: number;
  contact: string;
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
        "http://192.168.0.126:8080/api/hospitals/all"
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
          className="flex-1"
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

        <View
          className={`flex-row flex-wrap ${
            isWeb ? "justify-start p-4" : "justify-center mb-8"
          }`}
        >
          {isLoading ? (
            <View className="w-full py-20 items-center">
              <ActivityIndicator size="large" color="#2eb8b8" />
              <Text className="mt-4 text-slate-500">Loading Hospitals...</Text>
            </View>
          ) : hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <TouchableOpacity
                key={hospital.id}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: "/extrafiles/hospital_details",
                    params: { id: hospital.id, name: hospital.name },
                  })
                }
                className={`${
                  isWeb ? "w-[400px] m-4" : "w-[330px] mt-6 mx-4"
                } h-[250px] rounded-3xl overflow-hidden shadow-xl`}
              >
                <ImageBackground
                  source={{
                    uri:
                      hospital.picture ||
                      "https://via.placeholder.com/400x250?text=No+Image",
                  }}
                  className="flex-1 justify-end"
                  resizeMode="cover"
                >
                  <View className="absolute inset-0 bg-black/40" />

                  <View className="p-6">
                    <Text className="text-white text-2xl font-bold mb-1">
                      {hospital.name}
                    </Text>

                    <View className="flex-row items-center mb-2">
                      <FontAwesome
                        name="map-marker"
                        size={14}
                        color="#38bdf8"
                      />
                      <Text className="text-sky-300 ml-2 font-medium">
                        {hospital.address}
                      </Text>
                    </View>

                    <View className="flex-row flex-wrap mb-3 ">
                      <Text className="text-white text-[10px] font-semibold bg-white/10 px-2 p-1 rounded-lg">
                        {hospital.email}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center border-t border-white/20 pt-3">
                      <Text className="text-white/80 italic">
                        {hospital.numberOfDoctors} Doctors Available
                      </Text>
                      <View className="bg-white/90 p-2 rounded-full">
                        <FontAwesome
                          name="arrow-right"
                          size={12}
                          color="#0f172a"
                        />
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))
          ) : (
            <View className="w-full py-20 items-center">
              <FontAwesome name="hospital-o" size={50} color="#cbd5e1" />
              <Text className="mt-4 text-slate-400">No hospitals found.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
