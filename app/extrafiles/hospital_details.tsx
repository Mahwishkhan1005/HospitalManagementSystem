import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
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

export default function HospitalDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const hospital = HOSPITALS_DATA.find((h) => h.id === id);

  if (!hospital) return <Text>Hospital not found</Text>;

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/extrafiles/hospitals",
              params: { id: hospital.id, name: hospital.name },
            })
          }
          className=""
        >
          <View className="m-4 flex-row">
            <FontAwesome
              className="m-2"
              name="chevron-left"
              size={18}
              color="#334155"
            />

            <Text className="text-xl font-bold text-[#334155]">Back</Text>
          </View>
        </TouchableOpacity>
        <View className="items-center w-full mt-4 mb-4 h-[300px]">
          <Image
            source={{ uri: hospital.picture }}
            className="w-1/2 h-full"
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
                <Text className="text-slate-500 ml-2">{hospital.address}</Text>
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
              value={hospital.noofdoctors}
              color="bg-blue-50"
              iconColor="#2563eb"
            />
            <InfoCard
              icon="bed"
              label="Beds"
              value={hospital.noofbeds}
              color="bg-green-50"
              iconColor="#10b981"
            />
            <InfoCard
              icon="phone"
              label="Contact"
              value="Call"
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
            multiple departments including
            {hospital.departments.join(", ")}. Our mission is to provide
            compassionate care with modern technology.
          </Text>

          <View className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
            <ContactItem icon="envelope" text={hospital.email} />
            <ContactItem icon="phone" text={hospital.contact} />
            <ContactItem icon="clock-o" text="Open 24/7" />
          </View>
          <LinearGradient
            colors={["rgba(177, 235, 252, 0.86)", "rgba(90, 250, 215, 0.86)"]}
            locations={[0.36, 1.0]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="flex-1"
          >
            <TouchableOpacity
              className=" py-5 rounded-2xl flex-row justify-center items-center shadow-lg shadow-teal-700/30"
              key={hospital.id}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/extrafiles/doctors_details",
                  params: { id: hospital.id, name: hospital.name },
                })
              }
            >
              <FontAwesome6 name="user-doctor" size={20} color="#000" />
              <Text className="text-slate-700 text-lg font-bold ml-3">
                Available Doctors
              </Text>
              <FontAwesome
                name="arrow-right"
                size={16}
                color="#000"
                className="ml-4"
              />
            </TouchableOpacity>
          </LinearGradient>
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
