import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  contactExtension: string;
}
const DEPARTMENT_ICONS: Record<string, string> = {
  Cardiology: "heart-pulse",
  Neurology: "brain",
  Pediatrics: "baby",
  Orthopedics: "bone",
  Dermatology: "hand-dots",
  Radiology: "x-ray",
  Emergency: "truck-medical",
  "General Medicine": "stethoscope",
  default: "hospital",
};
export default function DepartmentDetails() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://192.168.0.126:8080/api/departments/hospital/${id}`
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDepartments();
  }, [id]);
  const getDepartmentIcon = (deptName: string) => {
    return DEPARTMENT_ICONS[deptName] || DEPARTMENT_ICONS.default;
  };
  const renderDepartmentCard = ({ item }: { item: Department }) => {
    const iconName = getDepartmentIcon(item.name);

    return (
      <View
        className={`${
          isWeb
            ? "bg-[white] w-1/4 p-4 flex-row rounded-3xl mb-2 border border-slate-300 shadow-lg"
            : "bg-white p-5 border flex-row border-slate-300 rounded-2xl mb-4"
        }`}
      >
        <View className={`${isWeb ? "bg-[white] w-1/2 p-4" : "bg-white "}`}>
          <View className="flex-row items-center mb-3">
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-800">
                {item.name}
              </Text>
            </View>
          </View>

          <Text className="text-slate-600 leading-5 mb-4">
            {item.description ||
              "Providing specialized medical care and advanced treatment options."}
          </Text>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => {
              router.push({
                pathname: "/extrafiles/doctors_details",
                params: { id: item.id, name: item.name },
              });
            }}
          >
            <View
              className={`${
                isWeb
                  ? "bg-[#2eb8b8] px-4 py-2 rounded-xl flex-row items-center justify-between"
                  : "bg-[#2eb8b8] px-4 py-2 rounded-xl flex-row items-center justify-center self-start"
              }`}
            >
              <Text className="text-white font-semibold mr-2">
                View Doctors
              </Text>
              <FontAwesome name="chevron-right" size={12} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        <View
          className={`${
            isWeb ? "bg-[white] w-1/2 p-8" : "bg-white w-1/2 p-5 "
          }`}
        >
          <View className="bg-slate-100 items-center p-8 rounded-full">
            <FontAwesome6 name={iconName} size={45} color="#2eb8b8" />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className={`px-6 bg-white pb-4 ${isWeb ? "pt-5" : "p-12"}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className={`${
            isWeb
              ? "flex-row items-center mb-4"
              : "flex-row items-center mt-12 m-2"
          }`}
        >
          <FontAwesome name="chevron-left" size={16} color="#334155" />

          <View className="ml-4 items-center justify-center flex-row">
            <Text className="text-2xl font-black text-slate-800">
              Departments in
            </Text>
            <Text className="text-2xl font-black text-[#2eb8b8]"> {name}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2eb8b8" />
        </View>
      ) : (
        <FlatList
          data={departments}
          keyExtractor={(item) => item.id}
          renderItem={renderDepartmentCard}
          contentContainerStyle={{ padding: 24 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <FontAwesome6 name="folder-open" size={50} color="#cbd5e1" />
              <Text className="text-slate-400 mt-4 text-lg">
                No departments found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
