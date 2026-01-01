import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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

  numberOfDoctors: number;
  numberOfBeds: number;

  contactNumber: string;
  email: string;
  rating: string;
  picture: string;
}

export default function HospitalDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://192.168.0.133:8080/api/hospitals/${id}`
        );

        if (response.data) {
          setHospital(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching hospital:", error);
        const errorMsg = "Could not load hospital details.";
        isWeb ? window.alert(errorMsg) : Alert.alert("Error", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHospitalData();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2eb8b8" />
        <Text className="mt-4 text-slate-500 font-medium">
          Loading hospital data...
        </Text>
      </View>
    );
  }

  if (!hospital) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-slate-600">Hospital not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <TouchableOpacity onPress={() => router.back()}>
          <View className={` ${isWeb ? "m-4 flex-row" : "flex-row mt-12"}`}>
            <FontAwesome
              className="m-2"
              name="chevron-left"
              size={18}
              color="#334155"
            />

            <Text
              className={` ${
                isWeb
                  ? "text-xl font-bold text-[#334155]"
                  : "text-xl font-bold text-[#334155] mt-1"
              }`}
            >
              Back
            </Text>
          </View>
        </TouchableOpacity>

        <View
          className={`${
            isWeb
              ? "items-center w-full mt-4 mb-4 h-[300px]"
              : "items-center w-full mt-4 mb-4 h-[200px]"
          }`}
        >
          <Image
            source={{
              uri: hospital.picture || "https://via.placeholder.com/400",
            }}
            className={`${isWeb ? "w-1/2" : "w-[90%]"} h-full rounded-2xl`}
            resizeMode="cover"
          />
        </View>

        <View
          className={`px-6 py-8 ${isWeb ? "max-w-4xl mx-auto w-full" : ""}`}
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-slate-900">
                {hospital.name}
              </Text>
              <View className="flex-row items-center mt-2">
                <FontAwesome name="map-marker" size={16} color="#2eb8b8" />
                <Text className="text-slate-500 ml-2">
                  {hospital.address},{hospital.city}
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

          <View className="flex-row justify-between mb-8 space-x-2">
            <InfoCard
              icon="user-md"
              label="Doctors"
              value={hospital.numberOfDoctors}
              color="bg-blue-50"
              iconColor="#2563eb"
            />
            <InfoCard
              icon="bed"
              label="Beds"
              value={hospital.numberOfBeds}
              color="bg-green-50"
              iconColor="#10b981"
            />
            <InfoCard
              icon="phone"
              label="Contact"
              value={hospital.contactNumber}
              color="bg-purple-50"
              iconColor="#8b5cf6"
            />
          </View>

          <Text className="text-xl font-bold text-slate-900 mb-4">
            About Hospital
          </Text>
          <Text className="text-slate-600 leading-6 mb-6">
            {hospital.name} is a premier healthcare facility located in{" "}
            {hospital.city}. We provide world-class medical services across
            multiple departments
            {/* {hospital.departments?.join(", ") || "General Medicine"}.*/}
            Ourmission is to provide compassionate care with modern technology.
          </Text>

          <View className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
            <ContactItem icon="envelope" text={hospital.email} />
            <ContactItem icon="phone" text={hospital.contactNumber} />
            <ContactItem icon="clock-o" text="Open 24/7" />
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/extrafiles/department_details",
                params: { id: hospital.id, name: hospital.name },
              })
            }
          >
            <LinearGradient
              colors={["rgba(177, 235, 252, 0.86)", "rgba(90, 250, 215, 0.86)"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              className="py-5 rounded-2xl flex-row justify-center items-center"
            >
              <FontAwesome6 name="user-doctor" size={20} color="#334155" />
              <Text className="text-slate-700 text-lg font-bold ml-3">
                Available Departments
              </Text>
              <FontAwesome
                name="arrow-right"
                size={16}
                color="#334155"
                className="ml-4"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const InfoCard = ({ icon, label, value, color, iconColor }: any) => (
  <View
    className={`flex-1 ${color} p-4 rounded-2xl items-center border border-white/50`}
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
