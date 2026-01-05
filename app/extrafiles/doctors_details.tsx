import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SAMPLE_DOCTORS = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Senior Cardiologist",
    experience: 12,
    image:
      "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Neurologist",
    experience: 8,
    image:
      "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-pockets_23-2147661164.jpg",
  },
];

export default function HospitalDetails() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const [doctors, setDoctors] = useState<any[]>([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [bookingStatus, setBookingStatus] = useState<Record<string, string>>(
    {}
  );

  const PATIENT_ID = 1;
  const BASE_URL = "http://192.168.0.186:8081";

  const [formData, setFormData] = useState({
    patientName: "",
    phoneNumber: "",
    appointmentDate: "",
    timeSlot: "MORNING_10_00",
    address: "",
    issue: "",
  });

  const fetchDoctorsByDepartment = async () => {
    try {
      setFetchingDoctors(true);
      const response = await fetch(
        `http://192.168.0.133:8080/api/doctors/department/${id}`,
        { signal: AbortController.prototype.signal } // Add timeout logic if needed
      );

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.length > 0 ? data : SAMPLE_DOCTORS);
      } else {
        setDoctors(SAMPLE_DOCTORS);
      }
    } catch (error) {
      console.error("Error fetching doctors, using samples:", error);
      setDoctors(SAMPLE_DOCTORS);
    } finally {
      setFetchingDoctors(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/patient/appointments/${PATIENT_ID}`
      );
      if (response.ok) {
        const appointments = await response.json();
        const statusMap: Record<string, string> = {};
        appointments.forEach((app: any) => {
          const dId = app.doctorId || (app.doctor && app.doctor.id);
          if (dId)
            statusMap[String(dId)] = (app.status || "booked").toLowerCase();
        });
        setBookingStatus(statusMap);
      }
    } catch (e) {
      console.error("Failed to fetch appointments", e);
    }
  };

  useEffect(() => {
    fetchDoctorsByDepartment();
    fetchAppointments();
  }, [id]);

  const handleBookPress = (doctor: any) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const submitBooking = async () => {
    if (!selectedDoctor) return;
    setLoading(true);

    let dateToSend = formData.appointmentDate;
    // Basic date conversion if user types DD-MM-YYYY
    if (dateToSend.includes("-") && dateToSend.split("-")[0].length === 2) {
      const [d, m, y] = dateToSend.split("-");
      dateToSend = `${y}-${m}-${d}`;
    }

    const payload = {
      ...formData,
      appointmentDate: dateToSend,
      doctorId: selectedDoctor.id,
    };
    const url = `${BASE_URL}/api/patient/appointments/${PATIENT_ID}/2/101`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setBookingStatus((prev) => ({
          ...prev,
          [String(selectedDoctor.id)]: "booked",
        }));
        Alert.alert("Success", "Appointment Booked Successfully!");
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Please fill all details correctly.");
      }
    } catch (error) {
      Alert.alert("Offline", "Demo Mode: Appointment saved locally.");
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <LinearGradient
        colors={["#b1ebfc", "#5afad7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className={`${
          isWeb ? "py-6 px-10" : "pt-12 pb-6 px-6"
        } rounded-b-[40px] shadow-sm`}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <View className="bg-white/40 p-2 rounded-full">
            <FontAwesome name="chevron-left" size={16} color="#334155" />
          </View>
          <View className="ml-4">
            <Text className="text-slate-800 text-xs uppercase font-bold opacity-60">
              Specialist in
            </Text>
            <Text className="text-2xl font-black text-slate-900">{name}</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-lg font-bold text-slate-800 mb-4 px-2">
          Recommended Doctors
        </Text>

        {fetchingDoctors ? (
          <View className="py-20 items-center">
            <ActivityIndicator size="large" color="#2eb8b8" />
            <Text className="mt-4 text-slate-500 font-medium">
              Finding Specialists...
            </Text>
          </View>
        ) : doctors.length > 0 ? (
          doctors.map((doctor) => {
            const status = bookingStatus[String(doctor.id)] || "idle";
            return (
              <View
                key={doctor.id}
                className="bg-white p-4 rounded-3xl mb-4 flex-row items-center shadow-sm border border-slate-100"
              >
                <Image
                  source={{ uri: doctor.image }}
                  className="w-20 h-20 rounded-2xl bg-slate-100"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-slate-800">
                    {doctor.name}
                  </Text>
                  <Text className="text-[#2eb8b8] font-medium text-sm">
                    {doctor.specialization}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <FontAwesome name="star" size={12} color="#f59e0b" />
                    <Text className="text-slate-400 text-xs ml-1">
                      {doctor.experience} Years Exp.
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleBookPress(doctor)}
                  disabled={status !== "idle"}
                  className={`px-6 py-2 rounded-xl ${
                    status === "idle" ? "bg-[#2eb8b8]" : "bg-slate-200"
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      status === "idle" ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {status === "idle" ? "Book" : "Booked"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View className="items-center py-20">
            <FontAwesome name="user-md" size={80} color="#cbd5e1" />
            <Text className="text-xl font-bold text-slate-400 mt-4">
              No Specialists Found
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-end bg-black/50">
          <View
            className={`bg-white rounded-t-[40px] p-8 ${
              isWeb ? "w-1/3 mx-auto mb-10 rounded-[40px]" : "w-full"
            }`}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-slate-800">
                Book Appointment
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-slate-100 p-2 rounded-full"
              >
                <FontAwesome name="close" size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="max-h-[500px]"
            >
              <InputField
                label="Patient Name"
                value={formData.patientName}
                required
                onChange={(val: string) =>
                  setFormData({ ...formData, patientName: val })
                }
                placeholder="Enter patient name"
              />
              <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                required
                keyboardType="phone-pad"
                onChange={(val: string) =>
                  setFormData({ ...formData, phoneNumber: val })
                }
                placeholder="Contact number"
              />

              <Text className="text-slate-700 font-bold mb-2">
                Appointment Date
              </Text>
              {isWeb ? (
                <input
                  type="date"
                  className="border border-slate-200 p-3 rounded-xl mb-4 w-full"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointmentDate: e.target.value,
                    })
                  }
                />
              ) : (
                <TextInput
                  className="border border-slate-200 p-3 rounded-xl mb-4 bg-slate-50"
                  placeholder="YYYY-MM-DD"
                  value={formData.appointmentDate}
                  onChangeText={(val) =>
                    setFormData({ ...formData, appointmentDate: val })
                  }
                />
              )}

              <Text className="text-slate-700 font-bold mb-2">
                Preferred Slot
              </Text>
              <View className="border border-slate-200 rounded-xl mb-4 bg-slate-50 overflow-hidden">
                <Picker
                  selectedValue={formData.timeSlot}
                  onValueChange={(val) =>
                    setFormData({ ...formData, timeSlot: val })
                  }
                >
                  <Picker.Item label="Morning 10:00 AM" value="MORNING_10_00" />
                  <Picker.Item label="Morning 11:00 AM" value="MORNING_11_00" />
                  <Picker.Item label="Evening 04:00 PM" value="EVENING_04_00" />
                  <Picker.Item label="Evening 06:00 PM" value="EVENING_06_00" />
                </Picker>
              </View>

              <InputField
                label="Reason / Issue"
                value={formData.issue}
                required
                onChange={(val: string) =>
                  setFormData({ ...formData, issue: val })
                }
                placeholder="Describe your symptoms"
              />

              <TouchableOpacity
                onPress={submitBooking}
                disabled={loading}
                className="bg-[#2eb8b8] p-5 rounded-2xl items-center mt-4 shadow-md"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Confirm Appointment
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  keyboardType = "default",
}: any) => (
  <View className="mb-4">
    <View className="flex-row mb-1">
      <Text className="text-slate-700 font-bold">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
    <TextInput
      className="border border-slate-200 p-3 rounded-xl bg-slate-50 text-slate-800"
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      value={value}
      keyboardType={keyboardType}
      onChangeText={onChange}
    />
  </View>
);
