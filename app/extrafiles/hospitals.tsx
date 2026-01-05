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

const SAMPLE_HOSPITALS: Hospital[] = [
  {
    id: "1",
    name: "City General Hospital",
    address: "123 Healthcare Ave",
    city: "Metropolis",
    departments: ["Cardiology", "Neurology", "Pediatrics"],
    numberOfDoctors: 45,
    numberOfBeds: 200,
    contactNumber: "+1 555-0123",
    email: "info@citygeneral.com",
    rating: "4.8",
    picture:
      "https://www.carehospitals.com/assets/images/main/malpet-new-inner.webp",
  },
  {
    id: "2",
    name: "St. Mary's Medical Center",
    address: "456 Wellness Blvd",
    city: "Gotham",
    departments: ["Orthopedics", "Emergency", "Oncology"],
    numberOfDoctors: 32,
    numberOfBeds: 150,
    contactNumber: "+1 555-0456",
    email: "contact@stmarys.org",
    rating: "4.5",
    picture:
      "https://www.carehospitals.com/assets/images/main/hitech-city-inner.webp",
  },
];

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
        "http://192.168.0.133:8080/api/hospitals/all",
        { timeout: 5000 }
      );
      setHospitals(response.data);
    } catch (error) {
      console.error("Error fetching hospitals, loading sample data:", error);

      setHospitals(SAMPLE_HOSPITALS);

      const errorMsg = "Backend unreachable. Loading demo data for testing.";
      isWeb ? console.warn(errorMsg) : Alert.alert("Demo Mode", errorMsg);
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
                ? "flex-row h-[60px] justify-between items-center px-4"
                : "flex-row h-[100px] justify-between items-center pt-8 px-4"
            }`}
          >
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.push("/(patients)/patienthome")}
                className="mr-4"
              >
                <FontAwesome name="chevron-left" size={20} color="#334155" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-[#334155]">
                Available Hospitals
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-[#2eb8b8] px-4 py-2 rounded-xl"
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
                key={hospital.id}
                className={`${
                  isWeb
                    ? "w-full mt-8 flex-row min-h-[300px]"
                    : "w-[90%] mt-6 mx-auto min-h-[450px]"
                } bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100`}
              >
                {/* Image Section */}
                <View className={`${isWeb ? "w-1/3" : "w-full h-48"}`}>
                  <ImageBackground
                    source={{
                      uri:
                        hospital.picture || "https://via.placeholder.com/400",
                    }}
                    className="flex-1"
                    resizeMode="cover"
                  />
                </View>

                {/* Content Section */}
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

                  <View className="flex-row flex-wrap mb-4">
                    <InfoCard
                      icon="user-md"
                      label="Doctors"
                      value={hospital.numberOfDoctors}
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
                      bgColor="#e6ccff"
                      iconColor="#8b5cf6"
                    />
                    <InfoCard
                      icon="envelope"
                      label="Email"
                      value={hospital.email}
                      bgColor="#b3ffe0"
                      iconColor="#00804d"
                    />
                  </View>

                  <View>
                    <Text className="text-lg font-bold text-slate-900 mb-1">
                      About Hospital
                    </Text>
                    <Text className="text-slate-600 leading-5 mb-4">
                      {hospital.name} is a premier healthcare facility located
                      in {hospital.city}. We provide world-class medical
                      services across multiple departments.
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
                    className={`${isWeb ? "w-1/2" : "w-full"} mt-auto`}
                  >
                    <LinearGradient
                      colors={["#b1ebfc", "#5afad7"]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      className="py-3 rounded-2xl flex-row justify-center items-center"
                    >
                      <FontAwesome6
                        name="user-doctor"
                        size={18}
                        color="#334155"
                      />
                      <Text className="text-slate-700 font-bold ml-3">
                        View Departments
                      </Text>
                      <FontAwesome
                        name="arrow-right"
                        size={14}
                        color="#334155"
                        style={{ marginLeft: 10 }}
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

const InfoCard = ({ icon, label, value, iconColor, bgColor }: any) => {
  const isWeb = Platform.OS === "web";
  return (
    <View
      style={{ backgroundColor: bgColor }}
      className={`flex-1 min-w-[80px] py-3 m-1 rounded-2xl items-center border border-white/50`}
    >
      <FontAwesome name={icon} size={16} color={iconColor} />
      <Text
        className="text-slate-900 font-bold mt-1 text-xs text-center"
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text className="text-slate-500 text-[8px] uppercase font-semibold">
        {label}
      </Text>
    </View>
  );
};
