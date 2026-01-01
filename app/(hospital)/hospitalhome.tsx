import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* -------------------- CONFIGURATION -------------------- */
// On Android Emulators, 10.0.2.2 is the alias for your computer's localhost.
// For physical Android devices, use your actual IP (192.168.0.222).
const BASE_URL = "http://192.168.0.222:8081/api/doctor/appointments";

const HospitalHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal & Update States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const isWeb = Platform.OS === "web";

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("AccessToken");
      router.replace("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  /* -------------------- FETCH API DATA -------------------- */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL, {
        timeout: 10000, // 10 seconds timeout for Android network issues
      });
      setAppointments(response.data || []);
    } catch (error: any) {
      console.error("Fetch Error:", error.message);
      // Helpful error for Android users
      if (!isWeb && error.message.includes("Network Error")) {
        Alert.alert("Network Error", "Cannot reach the server. Ensure your phone and PC are on the same Wi-Fi.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsAddingHospital(false);
    }
  };

  // Load departments for a hospital
  const fetchDepartments = async (hospitalId) => {
    if (!hospitalId) return;
    
    try {
      setLoadingDepartments(true);
      const response = await fetch(`${DEPARTMENT_API}/hospital/${hospitalId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched departments:', data);
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      Alert.alert('Error', 'Failed to fetch departments.');
      setDepartments([]);
      setFilteredDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Load doctors for a department
  const fetchDoctorsByDepartment = async (departmentId) => {
    if (!departmentId) return;
    
    try {
      setLoadingDoctors(true);
      const response = await fetch(`${DOCTOR_API}/department/${departmentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched doctors:', data);
      // Normalize doctors: if server omits picture, check AsyncStorage for a persisted local URI
      const normalized = [];
      for (const d of data) {
        let picture = d.picture || null;
        if (!picture) {
          try {
            const key = `doctor:${d.id}:picture`;
            const saved = await AsyncStorage.getItem(key);
            if (saved) picture = saved;
          } catch (e) {
            console.log('Error reading doctor picture from storage', e);
          }
        }
        normalized.push({ ...d, picture });
      }
      setDoctors(normalized);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Alert.alert('Error', 'Failed to fetch doctors.');
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Load all doctors for selected hospital (from all departments)
  const fetchAllDoctorsForHospital = async () => {
    if (!selectedHospital?.id) return;
    
    try {
      setLoadingDoctors(true);
      // Get all departments first
      const deptResponse = await fetch(`${DEPARTMENT_API}/hospital/${selectedHospital.id}`);
      if (!deptResponse.ok) {
        throw new Error(`HTTP error! status: ${deptResponse.status}`);
      }
      const departments = await deptResponse.json();
      
      // Fetch doctors for each department
      const allDoctors = [];
      for (const dept of departments) {
        const doctorResponse = await fetch(`${DOCTOR_API}/department/${dept.id}`);
        if (doctorResponse.ok) {
          const doctors = await doctorResponse.json();
          for (const d of doctors) allDoctors.push(d);
        }
      }

      // Normalize and load persisted pictures
      const normalized = [];
      for (const d of allDoctors) {
        let picture = d.picture || null;
        if (!picture) {
          try {
            const key = `doctor:${d.id}:picture`;
            const saved = await AsyncStorage.getItem(key);
            if (saved) picture = saved;
          } catch (e) {
            console.log('Error reading doctor picture from storage', e);
          }
        }
        normalized.push({ ...d, picture });
      }

      console.log('Fetched all doctors for hospital:', normalized);
      setDoctors(normalized);
    } catch (error) {
      console.error('Error fetching all doctors:', error);
      Alert.alert('Error', 'Failed to fetch doctors.');
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  /* -------------------- UPDATE LOGIC -------------------- */
  const handleOpenConsultation = (appt: any) => {
    setSelectedAppt(appt);
    setDoctorNotes(appt.doctorNotes || "");
    setModalVisible(true);
  };

  const submitConsultationUpdate = async () => {
    if (!selectedAppt) return;

    try {
      setUpdateLoading(true);
      const payload = {
        consultationStatus: "COMPLETED",
        doctorNotes: doctorNotes,
      };

      const response = await axios.put(
        `${BASE_URL}/${selectedAppt.appointmentId}/consultation`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        isWeb ? window.alert("Consultation updated!") : Alert.alert("Success", "Consultation updated!");
        setModalVisible(false);
        fetchAppointments();
      }
    } catch (error: any) {
      console.error("Update failed", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to update. Check server connection.");
    } finally {
      setUpdateLoading(false);
    }
  };

  /* -------------------- SEARCH FILTER -------------------- */
  const filteredPatients = useMemo(() => {
    return appointments.filter(
      (p) =>
        p.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.appointmentId).includes(searchQuery)
    );
  }, [searchQuery, appointments]);

  /* -------------------- CARD RENDER -------------------- */
  const renderPatientCard = ({ item }: { item: any }) => {
    const isCompleted = item.consultationStatus === "COMPLETED";

    return (
      <View className="bg-white mx-4 my-2 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <View className={`h-1 ${isCompleted ? "bg-green-500" : "bg-teal-500"}`} />
        <View className="p-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-row items-center">
              <View className={`w-12 h-12 rounded-full ${isCompleted ? 'bg-green-50' : 'bg-teal-50'} items-center justify-center`}>
                <Ionicons name="person-outline" size={24} color={isCompleted ? "#16a34a" : "#0d9488"} />
              </View>
              <View className="ml-3">
                <Text className="text-lg font-bold text-gray-800">{item.patientName}</Text>
                <Text className="text-[11px] text-gray-400 font-medium">Appointment Number : {item.appointmentId}</Text>
              </View>
            </View>
            <View className={`${isCompleted ? 'bg-green-100' : 'bg-orange-100'} px-3 py-1 rounded-full`}>
              <Text className={`text-[10px] font-bold ${isCompleted ? 'text-green-700' : 'text-orange-700'}`}>
                {item.consultationStatus?.replace(/_/g, " ") || "PENDING"}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <DetailRow icon="calendar-outline" text={`${item.appointmentDate} • ${item.timeSlot?.replace(/_/g, " ")}`} />
            <DetailRow icon="call-outline" text={item.phoneNumber} />
            <DetailRow icon="medical-outline" text={item.issue} isItalic />
          </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">Hospital Name *</Text>
                          <TextInput
                            placeholder="Enter hospital name"
                            value={newHospital.name}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, name: text }))
                            }
                            className="border border-gray-300 rounded-xl p-3"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">Address *</Text>
                          <TextInput
                            placeholder="Enter address"
                            value={newHospital.address}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, address: text }))
                            }
                            className="border border-gray-300 rounded-xl p-3"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">City *</Text>
                          <TextInput
                            placeholder="Enter city"
                            value={newHospital.city}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, city: text }))
                            }
                            className="border border-gray-300 rounded-xl p-3"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">About Hospital</Text>
                          <TextInput
                            placeholder="Describe the hospital"
                            value={newHospital.about}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, about: text }))
                            }
                            multiline
                            numberOfLines={3}
                            className="border border-gray-300 rounded-xl p-3 h-24"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        {/* Step 2: Detailed Information */}
                        <View className="grid grid-cols-2 gap-4 mb-4">
                          <View>
                            <Text className="font-bold mb-2">Number of Doctors</Text>
                            <TextInput
                              placeholder="Enter number"
                              keyboardType="numeric"
                              value={newHospital.numberOfDoctors}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, numberOfDoctors: text }))
                              }
                              className="border border-gray-300 rounded-xl p-3"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>

                          <View>
                            <Text className="font-bold mb-2">Number of Beds</Text>
                            <TextInput
                              placeholder="Enter number"
                              keyboardType="numeric"
                              value={newHospital.numberOfBeds}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, numberOfBeds: text }))
                              }
                              className="border border-gray-300 rounded-xl p-3"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>

                          <View>
                            <Text className="font-bold mb-2">Age of Hospital (years)</Text>
                            <TextInput
                              placeholder="Enter age"
                              keyboardType="numeric"
                              value={newHospital.ageOfHospital}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, ageOfHospital: text }))
                              }
                              className="border border-gray-300 rounded-xl p-3"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>

                          <View>
                            <Text className="font-bold mb-2">Rating</Text>
                            <TextInput
                              placeholder="Enter rating (0-5)"
                              keyboardType="decimal-pad"
                              value={newHospital.rating}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, rating: text }))
                              }
                              className="border border-gray-300 rounded-xl p-3"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>
                        </View>

                        <View className="mb-4">
                          <Text className="font-bold mb-2">Contact Number</Text>
                          <TextInput
                            placeholder="Enter contact number"
                            keyboardType="phone-pad"
                            value={newHospital.contactNumber}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, contactNumber: text }))
                            }
                            className="border border-gray-300 rounded-xl p-3"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>                        
                      </>
                    )}
                  </ScrollView>
                  <View className="flex-row border-t p-4">
                    {hospitalStep === 2 && (
                      <TouchableOpacity
                        onPress={() => setHospitalStep(1)}
                        className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 items-center"
                        disabled={isAddingHospital || uploadingImage}
                      >
                        <Text className="font-bold">Back</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={async () => {
                        if (hospitalStep === 1) {
                          // Validate step 1
                          if (!newHospital.name.trim() || !newHospital.address.trim() || !newHospital.city.trim()) {
                            Alert.alert('Error', 'Please fill all required fields');
                            return;
                          }
                          setHospitalStep(2);
                        } else {
                          // Step 2 - Directly call handleAddHospital which will close modal
                          await handleAddHospital();
                        }
                      }}
                      className="flex-1 bg-green-500 rounded-xl p-3 items-center justify-center"
                      disabled={isAddingHospital || uploadingImage}
                      style={{ opacity: (isAddingHospital || uploadingImage) ? 0.7 : 1 }}
                    >
                      {isAddingHospital || uploadingImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-bold">
                          {hospitalStep === 1 ? 'Next' : 'Add Hospital'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= EDIT HOSPITAL MODAL ================= */}
            <Modal visible={editHospitalModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-2xl overflow-hidden max-h-[90%]">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-4 py-3"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Edit Hospital
                      </Text>
                      <TouchableOpacity
                        onPress={() => setEditHospitalModalVisible(false)}
                        disabled={uploadingImage}
                      >
                        <Text className="text-white text-2xl">✕</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-4 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    {/* Image Upload Section */}
                    <View className="mb-6 items-center">
                      <TouchableOpacity
                        onPress={() => pickImage(true)}
                        disabled={uploadingImage}
                        className={`w-32 h-32 rounded-2xl ${
                          editHospital.localImage || editHospital.picture
                            ? 'border-2 border-blue-500' 
                            : 'border-2 border-dashed border-gray-300'
                        } items-center justify-center overflow-hidden`}
                      >
                        {editHospital.localImage ? (
                          <Image
                            source={{ uri: editHospital.localImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : editHospital.picture ? (
                          <Image
                            source={{ uri: editHospital.picture }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="items-center">
                            <Ionicons name="camera" size={40} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-2 text-center text-xs">
                              Upload Hospital Image
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {uploadingImage && (
                        <View className="mt-2 flex-row items-center">
                          <ActivityIndicator size="small" color="#4F46E5" />
                          <Text className="text-gray-600 ml-2 text-sm">Uploading image...</Text>
                        </View>
                      )}
                      <Text className="text-gray-500 text-xs mt-2">
                        Tap to change hospital image (optional)
                      </Text>
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Hospital Name</Text>
                      <TextInput
                        value={editHospital.name}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Address</Text>
                      <TextInput
                        value={editHospital.address}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, address: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">City</Text>
                      <TextInput
                        value={editHospital.city}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, city: text }))
                        }
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="grid grid-cols-2 gap-4 mb-4">
                      <View>
                        <Text className="font-bold mb-2">Number of Doctors</Text>
                        <TextInput
                          value={editHospital.numberOfDoctors}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, numberOfDoctors: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-3"
                          editable={!uploadingImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold mb-2">Number of Beds</Text>
                        <TextInput
                          value={editHospital.numberOfBeds}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, numberOfBeds: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-3"
                          editable={!uploadingImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold mb-2">Age of Hospital</Text>
                        <TextInput
                          value={editHospital.ageOfHospital}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, ageOfHospital: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-3"
                          editable={!uploadingImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold mb-2">Rating</Text>
                        <TextInput
                          value={editHospital.rating}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, rating: text }))
                          }
                          keyboardType="decimal-pad"
                          className="border border-gray-300 rounded-xl p-3"
                          editable={!uploadingImage}
                        />
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">About Hospital</Text>
                      <TextInput
                        value={editHospital.about}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, about: text }))
                        }
                        multiline
                        numberOfLines={3}
                        className="border border-gray-300 rounded-xl p-3 h-24"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="font-bold mb-2">Contact Number</Text>
                      <TextInput
                        value={editHospital.contactNumber}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, contactNumber: text }))
                        }
                        keyboardType="phone-pad"
                        className="border border-gray-300 rounded-xl p-3"
                        editable={!uploadingImage}
                      />
                    </View>
                  </ScrollView>

                  <View className="flex-row border-t p-4">
                    <TouchableOpacity
                      onPress={() => setEditHospitalModalVisible(false)}
                      className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 items-center"
                      disabled={uploadingImage}
                    >
                      <Text className="font-bold">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleEditHospital}
                      className="flex-1 bg-green-500 rounded-xl p-3 items-center"
                      disabled={uploadingImage}
                      style={{ opacity: uploadingImage ? 0.7 : 1 }}
                    >
                      {uploadingImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-bold">Update Hospital</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= HOSPITAL DETAILS MODAL ================= */}
            <Modal visible={!!selectedHospital} animationType="slide">
              <SafeAreaView className="flex-1 bg-white">
                <ScrollView>
                  <LinearGradient
                    colors={['#38bdf8', '#0ea5e9']}
                    className="px-6 pt-3 pb-3"
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedHospital(null);
                        setSearchDepartment('');
                      }}
                      className="self-end"
                    >
                      <Text className="text-white text-2xl">✕</Text>
                    </TouchableOpacity>

                    {selectedHospital && (
                      <View className="items-center mt-4">
                        {selectedHospital.picture ? (
                          <View className="w-24 h-24 bg-white/20 rounded-3xl overflow-hidden border-2 border-white">
                            <Image
                              source={{ uri: selectedHospital.picture }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          </View>
                        ) : (
                          <View className="w-24 h-24 bg-white/20 rounded-3xl items-center justify-center">
                            <Text className="text-5xl">🏥</Text>
                          </View>
                        )}
                        <Text className="text-2xl font-bold text-white mt-4 text-center">
                          {selectedHospital.name}
                        </Text>
                        <Text className="text-indigo-100 mt-1 text-center">
                          {selectedHospital.city} • {selectedHospital.rating} ⭐
                        </Text>
                      </View>
                    )}
                  </LinearGradient>

                  {selectedHospital && (
                    <View className="p-6">
                      {/* About Section */}
                      <Text className="text-gray-700 leading-7 mb-6">
                        {selectedHospital.about || 'No description available.'}
                      </Text>

                      {/* Hospital Information Card */}
                      <View className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
                        <View className="flex-row justify-between items-center mb-4">
                          <Text className="font-bold text-xl text-gray-900">
                            📋 Hospital Information
                          </Text>
                          <TouchableOpacity
                            onPress={() => setSignupModalVisible(true)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-lg shadow-sm"
                            style={{
                              elevation: 4,
                              shadowColor: '#10B981',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.3,
                              shadowRadius: 4,
                            }}
                          >
                            <Text className="text-white font-medium">+ Add Staff</Text>
                          </TouchableOpacity>
                        </View>
                        
                      <View className="flex-row flex-wrap -mx-2">
                    {/* Address */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="location" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">Address</Text>
                        <Text className="text-sm font-medium text-center text-gray-900" numberOfLines={2}>
                          {selectedHospital.address}
                        </Text>
                      </View>
                    </View>

                    {/* City */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="business" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">City</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.city}
                        </Text>
                      </View>
                    </View>

                    {/* Doctors */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="people" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">Doctors</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.numberOfDoctors}
                        </Text>
                      </View>
                    </View>

                    {/* Beds */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="bed" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">Beds</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.numberOfBeds}
                        </Text>
                      </View>
                    </View>

                    {/* Age */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="calendar" size={22} color="#4F46E5" />
                        <Text className="text-xs text-gray-500 mt-1">Age</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.ageOfHospital} yrs
                        </Text>
                      </View>
                    </View>

                    {/* Rating */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="star" size={22} color="#F59E0B" />
                        <Text className="text-xs text-gray-500 mt-1">Rating</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.rating} ⭐
                        </Text>
                      </View>
                    </View>

                    {/* Contact */}
                    <View className="w-1/3 px-2 mb-4">
                      <View className="bg-white rounded-xl p-3 items-center border border-blue-100">
                        <Ionicons name="call" size={22} color="#10B981" />
                        <Text className="text-xs text-gray-500 mt-1">Contact</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {selectedHospital.contactNumber || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

              {/* Available Doctors Section */}
                  <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="font-bold text-lg">👩‍⚕️ Available Doctors({doctors.length})</Text>
                      <View className="flex-row space-x-2">
                        <TouchableOpacity
                          onPress={() => openViewDoctorsModal()}
                          className="bg-indigo-500 px-3 py-1 rounded-lg"
                        >
                          <Text className="text-white font-medium">View All Doctors</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => openAddDoctorModal()}
                          className="bg-green-500 px-3 py-1 rounded-lg"
                        >
                          <Text className="text-white font-medium">+ Add Doctor</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

        <View className={`${isWeb ? "w-1/3" : "w-full"} flex-row items-center bg-white/80 rounded-xl px-3`}>
          <Ionicons name="search" size={16} color="#6b7280" />
          <TextInput
            placeholder="Search patients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 px-3 py-2 text-sm text-gray-800"
          />
        </View>
      </LinearGradient>

      <View className="flex-1">
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => String(item.appointmentId)}
          renderItem={renderPatientCard}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
          ListEmptyComponent={
            loading ? <ActivityIndicator size="large" color="#0d9488" className="mt-20" /> : (
              <View className="items-center mt-20">
                <Ionicons name="people-outline" size={50} color="#cbd5e1" />
                <Text className="text-gray-400 italic mt-2">No appointments found</Text>
              </View>
            )
          }
        />
      </View>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className={`bg-white rounded-[32px] overflow-hidden ${isWeb ? 'w-[500px]' : 'w-full'}`}>
            <View className="bg-teal-600 p-4 flex-row justify-between items-center">
                <Text className="text-white font-bold text-lg">Consultation Record</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-circle" size={28} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="p-6 max-h-[400px]">
              {selectedAppt && (
                <View className="space-y-4">
                  <ModalDataRow label="Patient Name" value={selectedAppt.patientName} />
                  <Text className="text-[10px] uppercase font-black text-teal-600 mt-4 mb-2">Clinical Notes</Text>
                  <TextInput
                    multiline
                    numberOfLines={5}
                    value={doctorNotes}
                    onChangeText={setDoctorNotes}
                    placeholder="Enter findings..."
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-800 h-32"
                    textAlignVertical="top"
                  />
                </View>
              )}
            </ScrollView>

            <View className="p-6 bg-gray-50 flex-row gap-3">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="flex-1 bg-white border border-gray-200 py-3 rounded-xl items-center">
                <Text className="text-gray-600 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                disabled={updateLoading}
                onPress={submitConsultationUpdate}
                className="flex-1 bg-teal-600 py-3 rounded-xl items-center justify-center"
              >
                {updateLoading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-bold">Complete</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DetailRow = ({ icon, text, isItalic }: any) => (
  <View className="flex-row items-center mb-2">
    <Ionicons name={icon} size={14} color="#6b7280" />
    <Text className={`ml-2 text-xs text-gray-600 ${isItalic ? 'text-teal-600 italic font-bold' : ''}`}>{text}</Text>
  </View>
);

const ModalDataRow = ({ label, value }: any) => (
  <View className="mb-3">
    <Text className="text-[10px] text-gray-400 uppercase font-bold">{label}</Text>
    <Text className="text-gray-800 font-medium text-base">{value}</Text>
  </View>
);

export default HospitalHome;
