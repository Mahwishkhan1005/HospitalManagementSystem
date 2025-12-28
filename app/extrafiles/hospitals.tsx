import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HOSPITALS_DATA = [
  {
    id: "1",
    name: "City General Hospital",
    address: "Downtown, Metro City",
    city: "Metro City",
    departments: ["Cardiology", "Neurology", "Pediatrics"],
    noofdoctors: 45,
    noofbeds: 150,
    contact: "908070897",
    email: "CityGeneralHospital@gmail.com",

    rating: "4.5",
    picture:
      "https://www.irishexaminer.com/cms_media/module_img/5198/2599373_10_articlemedium_Screenshot_202021-08-03_20at_2012.36.48.jpg",
  },
  {
    id: "2",
    name: "St. Mary's Medical Center",
    address: "North Side, Metro City",
    city: "Metro City",
    departments: ["Orthopedics", "Emergency", "Oncology"],
    noofdoctors: 32,
    noofbeds: 100,
    contact: "908070897",
    email: "StMaryMedicalCenter@gmail.com",
    rating: "4.5",
    picture:
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=1000",
  },
  {
    id: "3",
    name: "Wellness Community Clinic",
    address: "East View Park",
    city: "NY city",
    departments: ["General Medicine", "Dental", "Dermatology"],
    noofdoctors: 12,
    noofbeds: 110,
    contact: "908070897",
    rating: "4.5",
    email: "WellnessCommunityClinic@gmail.com",
    picture:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000",
  },
];

export default function choosecareHome() {
  const isWeb = Platform.OS === "web";
  const [showHospitals, setShowHospitals] = useState(false); // Toggle view
  const hospitallistclose = () => {
    router.push("/patienthome");
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
      <ScrollView className=" bg-slate-50">
        <LinearGradient
          colors={["rgba(177, 235, 252, 0.86)", "rgba(90, 250, 215, 0.86)"]}
          locations={[0.36, 1.0]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="flex-1"
        >
          <View className="flex-row h-[60px] justify-between items-center">
            <View className="flex-row">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(patients)/patienthome",
                  })
                }
                className="m-4"
              >
                <FontAwesome name="chevron-left" size={20} color="#334155" />
              </TouchableOpacity>
              <Text className="text-3xl p-1 mb-1 font-bold text-[#334155]">
                Available Hospitals
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-[#2eb8b8] px-4 py-2 rounded-xl mr-4 shadow-white shadow-xl "
            >
              <Text className="text-white font-bold">Logout</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View
          className={`flex-row flex-wrap ${
            isWeb ? "justify-start" : "justify-center"
          }`}
        >
          {HOSPITALS_DATA.map((hospital) => (
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
                isWeb ? "w-[450px] h-[300px]  m-4" : "w-full mb-6"
              } h-[250px] rounded-3xl overflow-hidden shadow-xl`}
            >
              <ImageBackground
                source={{ uri: hospital.picture }}
                className="flex-1 justify-end"
                resizeMode="cover"
              >
                <View className="absolute inset-0 bg-black/40" />

                <View className="p-6">
                  <Text className="text-white text-2xl font-bold mb-1">
                    {hospital.name}
                  </Text>

                  <View className="flex-row items-center mb-2">
                    <FontAwesome name="map-marker" size={14} color="#38bdf8" />
                    <Text className="text-sky-300 ml-2 font-medium">
                      {hospital.address}
                    </Text>
                  </View>

                  <View className="flex-row flex-wrap mb-3">
                    {hospital.departments.map((dept, index) => (
                      <View
                        key={index}
                        className="bg-white/20 px-2 py-1 rounded-md mr-2 mt-1"
                      >
                        <Text className="text-white text-[10px] font-bold uppercase">
                          {dept}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View className="flex-row justify-between items-center border-t border-white/20 pt-3">
                    <Text className="text-white/80 italic">
                      {hospital.noofdoctors} Doctors Available
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
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
