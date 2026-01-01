import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import '../globals.css';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// const isTablet = SCREEN_WIDTH >= 768;
// const isPhone = SCREEN_WIDTH < 768;


// API Configuration
const API_BASE_URL = 'http://192.168.0.246:8080/api';
const HOSPITAL_API = `${API_BASE_URL}/hospitals`;
const DEPARTMENT_API = `${API_BASE_URL}/departments`;
const DOCTOR_API = `${API_BASE_URL}/doctors`;
const SIGNUP_API = 'http://192.168.0.231:8080/admin/signup';

/* -------------------- HOSPITAL CARD -------------------- */

const HospitalCard = ({ item, onPress, onEdit, onDelete }) => {
  return (
    <View className="w-1/3 px-1.5 mb-4">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          className="rounded-3xl p-4 h-full"
          style={{
            borderWidth: 1,
            borderColor: '#e2e8f0',
          }}
        >
          {/* Action Buttons */}
          <View className="absolute top-3 right-3 flex-row space-x-2 z-10">
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="bg-blue-500 w-8 h-8 rounded-full items-center justify-center shadow-sm"
              style={{
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
              }}
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="bg-red-500 w-8 h-8 rounded-full items-center justify-center shadow-sm"
              style={{
                shadowColor: '#ef4444',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
              }}
            >
              <Ionicons name="trash" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* Avatar/Image */}
          <View className="items-center mt-2">
            <View className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md">
              {item.picture ? (
                <Image
                  source={{ uri: item.picture }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <Ionicons name="hospital" size={36} color="#4f46e5" />
                </View>
              )}
            </View>

            <Text className="text-lg font-bold text-gray-900 mt-4 text-center" numberOfLines={1}>
              {item.name}
            </Text>

            <View className="flex-row items-center mt-1">
              <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded-full">
                <Ionicons name="location" size={12} color="#3b82f6" />
                <Text className="text-blue-600 text-xs ml-1">{item.city}</Text>
              </View>
              <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-full ml-2">
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Text className="text-amber-600 text-xs ml-1">{item.rating} ⭐</Text>
              </View>
            </View>
          </View>

          {/* Info */}
          <View className="mt-4 space-y-2">
            <View className="flex-row items-center bg-white p-2 rounded-xl border border-gray-100">
              <Ionicons
                name="location-outline"
                size={16}
                color="#6366f1"
                style={{ marginRight: 8 }}
              />
              <Text className="text-gray-700 text-xs flex-1" numberOfLines={2}>
                {item.address}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <View className="bg-emerald-50 px-3 py-1.5 rounded-full">
                <View className="flex-row items-center">
                  <Ionicons name="people" size={12} color="#10b981" />
                  <Text className="text-emerald-700 text-xs ml-1">{item.numberOfDoctors}</Text>
                </View>
              </View>
              <View className="bg-purple-50 px-3 py-1.5 rounded-full">
                <View className="flex-row items-center">
                  <Ionicons name="bed" size={12} color="#8b5cf6" />
                  <Text className="text-purple-700 text-xs ml-1">{item.numberOfBeds}</Text>
                </View>
              </View>
              <View className="bg-orange-50 px-3 py-1.5 rounded-full">
                <View className="flex-row items-center">
                  <Ionicons name="time" size={12} color="#f97316" />
                  <Text className="text-orange-700 text-xs ml-1">{item.ageOfHospital}y</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

/* -------------------- ADD HOSPITAL CARD -------------------- */

const AddHospitalCard = ({ onPress }) => {
  return (
    <View className="w-1/3 px-1.5 mb-4">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          shadowColor: '#89b3f6ff',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={['#eff6ff', '#cadbf2ff']}
          className="rounded-3xl p-4 border-2 border-dashed border-blue-300 h-full items-center justify-center"
        >
          <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-sky-100 items-center justify-center mb-3 shadow-sm">
            <Ionicons name="add-circle" size={32} color="#3b82f6" />
          </View>

          <Text className="text-base font-bold text-gray-900 text-center">
            Add New Hospital
          </Text>

          <Text className="text-blue-600 text-xs mt-1 text-center">
            Click to add hospital
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

/* -------------------- DOCTOR CARD (GRID VIEW - 3 PER ROW) -------------------- */

const DoctorCard = ({ item, onPress, onEdit, onDelete }) => (
  <View className="w-40 px-2 mb-4">
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="bg-white rounded-2xl p-3 border border-gray-100">
        {/* Action buttons */}
        <View className="absolute top-2 right-2 flex-row space-x-1 z-10">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onEdit && onEdit(item);
            }}
            className="bg-blue-500 w-6 h-6 rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="pencil" size={12} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete && onDelete(item);
            }}
            className="bg-red-500 w-6 h-6 rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="trash" size={12} color="white" />
          </TouchableOpacity>
        </View>
        
        <View className="w-full h-28 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden mb-3 shadow-sm">
          {item.picture ? (
            <Image
              source={{ uri: item.picture }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
              <Ionicons name="person" size={40} color="#4f46e5" />
            </View>
          )}
        </View>
        
        <Text className="font-bold text-sm text-gray-900 mb-1" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-blue-600 text-xs mb-1 font-medium" numberOfLines={1}>
          {item.specialization}
        </Text>
        <Text className="text-gray-500 text-xs mb-1 flex-row items-center">
          <Ionicons name="briefcase" size={10} color="#6b7280" style={{ marginRight: 4 }} />
          Exp: {item.experience} yrs
        </Text>
        <Text className="text-emerald-600 text-xs font-semibold mb-2">
          <Ionicons name="cash" size={10} color="#10b981" style={{ marginRight: 4 }} />
          ₹{item.fee}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);

/* -------------------- DOCTOR PROFILE MODAL -------------------- */

const DoctorProfileModal = ({ visible, doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white w-[90%] rounded-3xl overflow-hidden max-h-[80%]">
          {/* Header */}
          <LinearGradient
            colors={['#1addddff', '#97dce4ff']}
            className="px-6 py-4"
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-xl font-bold">
                Doctor Profile
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {/* Doctor Image and Basic Info */}
            <View className="items-center mb-6">
              <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {doctor.picture ? (
                  <Image
                    source={{ uri: doctor.picture }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                    <Ionicons name="person" size={48} color="#4f46e5" />
                  </View>
                )}
              </View>
              
              <Text className="text-2xl font-bold text-gray-900 mt-4">{doctor.name}</Text>
              <Text className="text-blue-600 text-lg font-medium mt-1">{doctor.specialization}</Text>
              
              <View className="flex-row items-center mt-2">
                <View className="bg-amber-50 px-3 py-1 rounded-full mr-2">
                  <Text className="text-amber-700 text-sm">⭐ {doctor.rating || 'N/A'}</Text>
                </View>
                <View className="bg-emerald-50 px-3 py-1 rounded-full">
                  <Text className="text-emerald-700 text-sm">₹{doctor.fee} Consultation</Text>
                </View>
              </View>
            </View>

            {/* Details Grid */}
            <View className="space-y-4">
              {/* Experience & Education */}
              <View className="flex-row -mx-2">
                <View className="w-1/2 px-2">
                  <View className="bg-blue-50 rounded-xl p-4">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="briefcase" size={20} color="#3b82f6" />
                      <Text className="text-blue-700 font-bold ml-2">Experience</Text>
                    </View>
                    <Text className="text-gray-800 text-lg font-semibold">
                      {doctor.experience} years
                    </Text>
                  </View>
                </View>
                
                <View className="w-1/2 px-2">
                  <View className="bg-purple-50 rounded-xl p-4">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="school" size={20} color="#8b5cf6" />
                      <Text className="text-purple-700 font-bold ml-2">Education</Text>
                    </View>
                    <Text className="text-gray-800 text-sm" numberOfLines={2}>
                      {doctor.education || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Contact Information */}
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-gray-900 font-bold text-lg mb-3">Contact Information</Text>
                
                <View className="space-y-3">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                      <Ionicons name="call" size={16} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-600 text-xs">Phone</Text>
                      <Text className="text-gray-900 font-medium">{doctor.phone}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                      <Ionicons name="mail" size={16} color="#10b981" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-600 text-xs">Email</Text>
                      <Text className="text-gray-900 font-medium">{doctor.mail || 'N/A'}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-indigo-100 rounded-full items-center justify-center mr-3">
                      <Ionicons name="business" size={16} color="#6366f1" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-600 text-xs">Cabin Number</Text>
                      <Text className="text-gray-900 font-medium">{doctor.cabinNumber || 'N/A'}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Additional Information */}
              <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <Text className="text-gray-900 font-bold text-lg mb-3">Additional Information</Text>
                
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Department</Text>
                    <Text className="text-gray-900 font-medium">{doctor.departmentName || 'N/A'}</Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Available Since</Text>
                    <Text className="text-gray-900 font-medium">{doctor.joiningDate || 'N/A'}</Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Consultation Hours</Text>
                    <Text className="text-gray-900 font-medium">9 AM - 5 PM</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row mt-8 mb-4">
              <TouchableOpacity 
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 items-center mr-2"
                onPress={() => Alert.alert('Book Appointment', `Appointment booking for Dr. ${doctor.name} would open here.`)}
              >
                <Text className="text-white font-bold">Book Appointment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-4 items-center ml-2"
                onPress={() => Alert.alert('Contact', `Would call ${doctor.phone}`)}
              >
                <Text className="text-white font-bold">Call Now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* -------------------- AVAILABLE DOCTORS MODAL -------------------- */

const AvailableDoctorsModal = ({ 
  visible, 
  doctors, 
  hospitalName, 
  departmentName,
  onClose,
  onAddDoctor,
  onEditDoctor,
  onDeleteDoctor,
  loadingDoctors
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);

  const openDoctorProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorProfile(true);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide">
        <SafeAreaView className="flex-1 bg-gray-50">
          {/* Header */}
          <LinearGradient
            colors={['#4f46e5', '#7577eaff']}
            className="px-6 pt-4 pb-6"
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <TouchableOpacity onPress={onClose} className="self-start mb-3">
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                
                <Text className="text-white text-2xl font-bold">
                  {departmentName ? `${departmentName} Doctors` : 'Available Doctors'}
                </Text>
                <Text className="text-indigo-100 text-sm mt-1">
                  {hospitalName}
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={onAddDoctor}
                className="bg-white/20 w-12 h-12 rounded-full items-center justify-center"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center">
              <View className="bg-white/20 rounded-full p-3 mr-3">
                <Ionicons name="people" size={24} color="white" />
              </View>
              <View>
                <Text className="text-white text-lg font-bold">
                  {doctors.length} Doctors Available
                </Text>
                <Text className="text-indigo-100 text-sm">
                  Tap on a doctor to view profile
                </Text>
              </View>
            </View>
          </LinearGradient>

          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {loadingDoctors ? (
              <View className="py-20 items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="text-gray-600 mt-4">Loading doctors...</Text>
              </View>
            ) : doctors.length === 0 ? (
              <View className="py-20 items-center">
                <View className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full items-center justify-center mb-4">
                  <Ionicons name="person-outline" size={40} color="#9ca3af" />
                </View>
                <Text className="text-gray-500 text-lg font-medium mb-2">
                  No Doctors Available
                </Text>
                <Text className="text-gray-400 text-center mb-6">
                  {departmentName 
                    ? `No doctors have been added to ${departmentName} yet.`
                    : 'No doctors have been added to this hospital yet.'}
                </Text>
                <TouchableOpacity
                  onPress={onAddDoctor}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-bold">+ Add First Doctor</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-4">
                {/* Statistics Cards */}
                <View className="flex-row -mx-2 mb-4">
                  <View className="w-1/3 px-2">
                    <View className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                      <Text className="text-blue-800 text-xs font-medium">Specializations</Text>
                      <Text className="text-blue-900 text-lg font-bold">
                        {new Set(doctors.map(d => d.specialization)).size}
                      </Text>
                    </View>
                  </View>
                  <View className="w-1/3 px-2">
                    <View className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3">
                      <Text className="text-emerald-800 text-xs font-medium">Avg. Experience</Text>
                      <Text className="text-emerald-900 text-lg font-bold">
                        {Math.round(doctors.reduce((sum, d) => sum + (parseInt(d.experience) || 0), 0) / doctors.length)} yrs
                      </Text>
                    </View>
                  </View>
                  <View className="w-1/3 px-2">
                    <View className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3">
                      <Text className="text-amber-800 text-xs font-medium">Avg. Fee</Text>
                      <Text className="text-amber-900 text-lg font-bold">
                        ₹{Math.round(doctors.reduce((sum, d) => sum + (parseFloat(d.fee) || 0), 0) / doctors.length)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Doctors Grid */}
                <Text className="text-gray-900 font-bold text-lg mb-3">All Doctors ({doctors.length})</Text>
                
                <View className="flex-row flex-wrap -mx-2">
                  {doctors.map((doctor) => (
                    <View key={doctor.id} className="w-1/2 px-2 mb-4">
                      <TouchableOpacity
                        onPress={() => openDoctorProfile(doctor)}
                        activeOpacity={0.9}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                      >
                        {/* Doctor Image */}
                        <View className="w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                          {doctor.picture ? (
                            <Image
                              source={{ uri: doctor.picture }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="w-full h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                              <Ionicons name="person" size={48} color="#4f46e5" />
                            </View>
                          )}
                        </View>
                        
                        {/* Doctor Info */}
                        <View className="p-3">
                          <View className="flex-row justify-between items-start mb-2">
                            <Text className="font-bold text-gray-900 flex-1 mr-2" numberOfLines={1}>
                              {doctor.name}
                            </Text>
                            <View className="flex-row space-x-1">
                              <TouchableOpacity
                                onPress={(e) => {
                                  e.stopPropagation();
                                  onEditDoctor(doctor);
                                }}
                                className="bg-blue-100 w-6 h-6 rounded-full items-center justify-center"
                              >
                                <Ionicons name="pencil" size={12} color="#3b82f6" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={(e) => {
                                  e.stopPropagation();
                                  onDeleteDoctor(doctor);
                                }}
                                className="bg-red-100 w-6 h-6 rounded-full items-center justify-center"
                              >
                                <Ionicons name="trash" size={12} color="#ef4444" />
                              </TouchableOpacity>
                            </View>
                          </View>
                          
                          <Text className="text-blue-600 text-xs font-medium mb-1" numberOfLines={1}>
                            {doctor.specialization}
                          </Text>
                          
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                              <Ionicons name="briefcase" size={10} color="#6b7280" />
                              <Text className="text-gray-500 text-xs ml-1">{doctor.experience} yrs</Text>
                            </View>
                            <Text className="text-emerald-600 text-xs font-semibold">
                              ₹{doctor.fee}
                            </Text>
                          </View>
                          
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              openDoctorProfile(doctor);
                            }}
                            className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg py-1.5 items-center"
                          >
                            <Text className="text-blue-600 text-xs font-medium">View Profile</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        visible={showDoctorProfile}
        doctor={selectedDoctor}
        onClose={() => setShowDoctorProfile(false)}
      />
    </>
  );
};

/* -------------------- SIGNUP COMPONENT -------------------- */

const SignupComponent = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('receiptionist');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email,
        password,
        role,
      };

      const res = await axios.post(SIGNUP_API, payload);

      setSuccessMessage(
        res.data?.message || `${role} registered successfully`
      );
      setSuccessModalVisible(true);
      
      // Reset form
      setEmail('');
      setPassword('');
      setRole('receiptionist');
    } catch (error) {
      Alert.alert(
        'Signup Failed',
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center bg-black/40">
          {/* 🌈 BACKGROUND 3D GRADIENT */}
          <LinearGradient
            colors={['#c7d2fe', '#e9d5ff', '#fae8ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0"
          />

          {/* 📦 CARD */}
          <View
            style={{
              transform: [{ scale: 0.92 }],
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 25,
              shadowOffset: { width: 0, height: 15 },
              elevation: 15,
            }}
            className="w-full max-w-md rounded-3xl overflow-hidden"
          >
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              className="p-6"
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-3xl font-bold text-gray-800">
                  Create Account
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={28} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* EMAIL */}
              <View className="mb-4">
                <Text className="text-sm mb-1 text-gray-600">Email</Text>
                <TextInput
                  className="border rounded-xl p-3 bg-white"
                  placeholder="doctor123@gmail.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* PASSWORD */}
              <View className="mb-4">
                <Text className="text-sm mb-1 text-gray-600">Password</Text>
                <View className="border rounded-xl p-3 flex-row items-center bg-white">
                  <TextInput
                    className="flex-1"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ROLE DROPDOWN */}
              <View className="mb-6">
                <Text className="text-sm mb-1 text-gray-600">Role</Text>

                <TouchableOpacity
                  onPress={() => setShowRoleDropdown(v => !v)}
                  className="border rounded-xl p-3 bg-white flex-row justify-between items-center"
                >
                  <Text className="text-gray-800 capitalize">
                    {role}
                  </Text>
                  <Ionicons
                    name={showRoleDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                  />
                </TouchableOpacity>

                {showRoleDropdown && (
                  <View className="mt-2 border rounded-xl overflow-hidden bg-white">
                    {['receiptionist', 'doctor'].map(item => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setRole(item);
                          setShowRoleDropdown(false);
                        }}
                        className="p-3 border-b last:border-b-0"
                      >
                        <Text className="capitalize text-gray-700">
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* REGISTER BUTTON */}
              <TouchableOpacity disabled={loading} onPress={handleRegister}>
                <LinearGradient
                  colors={['rgba(177,235,252,0.86)', 'rgba(90,250,215,0.86)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-xl p-4"
                >
                  <Text className="text-white text-center font-bold text-lg">
                    {loading ? 'Please wait...' : 'Register'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* SUCCESS MODAL */}
          <Modal visible={successModalVisible} transparent animationType="fade">
            <View className="flex-1 items-center justify-center bg-black/40">
              <View className="bg-white rounded-3xl p-6 w-[90%] max-w-sm">
                <Text className="text-xl font-bold mb-3 text-green-600">
                  Success 🎉
                </Text>

                <Text className="text-gray-700 mb-6">
                  {successMessage}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setSuccessModalVisible(false);
                    onClose();
                  }}
                  className="bg-indigo-600 rounded-xl py-3"
                >
                  <Text className="text-white text-center font-bold">
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

/* -------------------- MAIN APP COMPONENT -------------------- */

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [addHospitalModalVisible, setAddHospitalModalVisible] = useState(false);
  const [editHospitalModalVisible, setEditHospitalModalVisible] = useState(false);
  const [viewDepartmentsModalVisible, setViewDepartmentsModalVisible] = useState(false);
  const [addDepartmentModalVisible, setAddDepartmentModalVisible] = useState(false);
  const [editDepartmentModalVisible, setEditDepartmentModalVisible] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hospitalStep, setHospitalStep] = useState(1);
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [activeTab, setActiveTab] = useState('hospitals');

  // New state variables
  const [searchDepartment, setSearchDepartment] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [signupModalVisible, setSignupModalVisible] = useState(false);

  // Doctor management states
  const [addDoctorModalVisible, setAddDoctorModalVisible] = useState(false);
  const [editDoctorModalVisible, setEditDoctorModalVisible] = useState(false);
  const [viewDoctorsModalVisible, setViewDoctorsModalVisible] = useState(false);
  const [viewDoctorsDepartmentId, setViewDoctorsDepartmentId] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDepartmentForDoctors, setSelectedDepartmentForDoctors] = useState(null);
  const [uploadingDoctorImage, setUploadingDoctorImage] = useState(false);

  // New hospital form state
  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    city: '',
    numberOfDoctors: '',
    numberOfBeds: '',
    ageOfHospital: '',
    rating: '',
    about: '',
    contactNumber: '',
    picture: null,
    localImage: null,
  });

  // Edit hospital state
  const [editHospital, setEditHospital] = useState({
    id: '',
    name: '',
    address: '',
    city: '',
    numberOfDoctors: '',
    numberOfBeds: '',
    ageOfHospital: '',
    rating: '',
    about: '',
    contactNumber: '',
    picture: null,
    localImage: null,
  });

  // Department form states
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
  });

  const [editDepartment, setEditDepartment] = useState({
    id: '',
    name: '',
    description: '',
    hospitalId: '',
  });

  // Doctor form states
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    phone: '',
    mail: '',
    specialization: '',
    experience: '',
    fee: '',
    education: '',
    departmentId: '',
    cabinNumber: '',
    picture: null,
    localImage: null,
  });

  const [editDoctor, setEditDoctor] = useState({
    id: '',
    name: '',
    phone: '',
    mail: '',
    specialization: '',
    experience: '',
    fee: '',
    education: '',
    departmentId: '',
    cabinNumber: '',
    picture: null,
    localImage: null,
  });

  // Helper functions for 3D effects
  const getDepartmentColors = (index) => {
    const colorSchemes = [
      ['#667eea', '#764ba2'], // Blue-Purple
      ['#f093fb', '#f5576c'], // Pink-Red
      ['#4facfe', '#00f2fe'], // Blue-Cyan
      ['#43e97b', '#38f9d7'], // Green-Turquoise
      ['#fa709a', '#fee140'], // Pink-Yellow
      ['#a8edea', '#fed6e3'], // Pastel Blue-Pink
      ['#ffecd2', '#fcb69f'], // Peach
      ['#89f7fe', '#66a6ff'], // Sky Blue
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  const getShadowColor = (index) => {
    const colors = [
      '#764ba2', '#f5576c', '#00f2fe', '#38f9d7', 
      '#fee140', '#fed6e3', '#fcb69f', '#66a6ff'
    ];
    return colors[index % colors.length];
  };

  // Load hospitals from API with proper image handling
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${HOSPITAL_API}/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched hospitals:', data);
      
      // For each hospital, check AsyncStorage for persisted image
      const normalizedHospitals = await Promise.all(
        data.map(async (h) => {
          try {
            const key = `hospital:${h.id}:picture`;
            const savedPicture = await AsyncStorage.getItem(key);
            
            // Use server picture first, then saved picture, then null
            const picture = h.picture || savedPicture || null;
            
            // If server returned picture but different from saved one, update storage
            if (h.picture && h.picture !== savedPicture) {
              await AsyncStorage.setItem(key, h.picture);
            }
            
            return { ...h, picture };
          } catch (e) {
            console.log('Error reading picture from storage for hospital:', h.id, e);
            return { ...h, picture: h.picture || null };
          }
        })
      );

      setHospitals(normalizedHospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      Alert.alert('Error', 'Failed to fetch hospitals. Please check your connection.');
      setHospitals([]);
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
      
      // Normalize doctors with persisted images
      const normalized = await Promise.all(
        data.map(async (d) => {
          try {
            const key = `doctor:${d.id}:picture`;
            const savedPicture = await AsyncStorage.getItem(key);
            
            // Use server picture first, then saved picture, then null
            const picture = d.picture || savedPicture || null;
            
            // If server returned picture but different from saved one, update storage
            if (d.picture && d.picture !== savedPicture) {
              await AsyncStorage.setItem(key, d.picture);
            }
            
            return { ...d, picture };
          } catch (e) {
            console.log('Error reading doctor picture from storage', e);
            return { ...d, picture: d.picture || null };
          }
        })
      );
      
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
          allDoctors.push(...doctors);
        }
      }

      // Normalize and load persisted pictures
      const normalized = await Promise.all(
        allDoctors.map(async (d) => {
          try {
            const key = `doctor:${d.id}:picture`;
            const savedPicture = await AsyncStorage.getItem(key);
            
            // Use server picture first, then saved picture, then null
            const picture = d.picture || savedPicture || null;
            
            // If server returned picture but different from saved one, update storage
            if (d.picture && d.picture !== savedPicture) {
              await AsyncStorage.setItem(key, d.picture);
            }
            
            return { ...d, picture };
          } catch (e) {
            console.log('Error reading doctor picture from storage', e);
            return { ...d, picture: d.picture || null };
          }
        })
      );

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
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital?.id && viewDepartmentsModalVisible) {
      fetchDepartments(selectedHospital.id);
    }
  }, [selectedHospital, viewDepartmentsModalVisible]);

  // useEffect for filtering departments
  useEffect(() => {
    if (departments.length > 0) {
      const filtered = departments.filter(dept => 
        dept.name.toLowerCase().includes(searchDepartment.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchDepartment.toLowerCase())
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  }, [searchDepartment, departments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHospitals();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('AccessToken');
      router.replace('/');
    } catch (e) {
      console.log('Logout failed', e);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const filteredHospitals = useMemo(() => {
    const q = (search || '').toLowerCase();
    return hospitals.filter(h => {
      const name = (h?.name || '').toString().toLowerCase();
      const city = (h?.city || '').toString().toLowerCase();
      const address = (h?.address || '').toString().toLowerCase();
      return name.includes(q) || city.includes(q) || address.includes(q);
    });
  }, [search, hospitals]);

  // Image Picker Function with better error handling
  const pickImage = async (isEdit = false, isDoctor = false) => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        
        // For new hospital/doctor, store in state
        if (isDoctor) {
          if (isEdit) {
            setEditDoctor(prev => ({
              ...prev,
              localImage: imageUri
            }));
          } else {
            setNewDoctor(prev => ({
              ...prev,
              localImage: imageUri
            }));
          }
        } else {
          if (isEdit) {
            setEditHospital(prev => ({
              ...prev,
              localImage: imageUri
            }));
          } else {
            setNewHospital(prev => ({
              ...prev,
              localImage: imageUri
            }));
          }
        }
        
        Alert.alert('Success', 'Image selected successfully. It will be uploaded when you save.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Load any unsaved images on component mount
  useEffect(() => {
    const loadUnsavedImages = async () => {
      try {
        // Load unsaved new hospital image
        const hospitalUri = await AsyncStorage.getItem('unsaved:newHospital:picture');
        if (hospitalUri) {
          setNewHospital(prev => ({ ...prev, localImage: hospitalUri }));
        }
        
        // Load unsaved new doctor image
        const doctorUri = await AsyncStorage.getItem('unsaved:newDoctor:picture');
        if (doctorUri) {
          setNewDoctor(prev => ({ ...prev, localImage: doctorUri }));
        }
      } catch (e) {
        console.log('Error loading unsaved images', e);
      }
    };
    loadUnsavedImages();
  }, []);

  // Add new hospital with proper image persistence
  const handleAddHospital = async () => {
    if (!newHospital.name.trim() || !newHospital.address.trim() || !newHospital.city.trim()) {
      Alert.alert('Error', 'Please fill required fields (Name, Address, City)');
      return;
    }

    if (isAddingHospital) return;

    try {
      setIsAddingHospital(true);
      setUploadingImage(true);

      const hospitalData = {
        name: newHospital.name,
        address: newHospital.address,
        city: newHospital.city,
        numberOfDoctors: parseInt(newHospital.numberOfDoctors) || 0,
        numberOfBeds: parseInt(newHospital.numberOfBeds) || 0,
        ageOfHospital: parseInt(newHospital.ageOfHospital) || 0,
        rating: parseFloat(newHospital.rating) || 0,
        about: newHospital.about || '',
        contactNumber: newHospital.contactNumber || '',
      };

      const formData = new FormData();
      formData.append(
        'hospital',
        new Blob([JSON.stringify(hospitalData)], {
          type: 'application/json',
        })
      );

      // ✅ IMAGE PART (OPTIONAL)
      if (newHospital.localImage) {
        const uri = newHospital.localImage;
        const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('picture', {
          uri,
          name: filename,
          type,
        });
      }

      const res = await axios.post(`${HOSPITAL_API}/add`, formData);
      
      // Extract the response properly
      const savedHospital = res.data || {};
      console.log('Hospital add response:', savedHospital);
      
      // Get the picture URL from response - try multiple possible fields
      const pictureUrl = savedHospital.picture || 
                        savedHospital.image || 
                        (savedHospital.hospital && savedHospital.hospital.picture) || 
                        null;

      // Create the hospital object with proper picture
      const hospitalWithPicture = {
        ...savedHospital,
        picture: pictureUrl,
      };

      // Update state
      setHospitals(prev => [hospitalWithPicture, ...prev]);
      
      // Persist picture in AsyncStorage if we have an ID and picture URL
      if (hospitalWithPicture.id && hospitalWithPicture.picture) {
        try {
          await AsyncStorage.setItem(`hospital:${hospitalWithPicture.id}:picture`, hospitalWithPicture.picture);
        } catch (e) {
          console.log('Error saving hospital picture to storage', e);
        }
      }
      
      // Clean up unsaved image
      try {
        await AsyncStorage.removeItem('unsaved:newHospital:picture');
      } catch (e) {
        console.log('Failed removing unsaved image after save', e);
      }

      // Reset form
      setNewHospital({
        name: '',
        address: '',
        city: '',
        numberOfDoctors: '',
        numberOfBeds: '',
        ageOfHospital: '',
        rating: '',
        about: '',
        contactNumber: '',
        picture: null,
        localImage: null,
      });

      setHospitalStep(1);
      setAddHospitalModalVisible(false);
      
      // If we have the hospital data, set it as selected
      if (hospitalWithPicture.id) {
        setSelectedHospital(hospitalWithPicture);
      }

      Alert.alert('Success ✅', 'Hospital added successfully!');

    } catch (error) {
      console.error('Add hospital failed:', error?.response?.data || error.message || error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to add hospital. Please try again.'
      );
    } finally {
      setIsAddingHospital(false);
      setUploadingImage(false);
    }
  };

  // Update hospital with proper image persistence
  const handleEditHospital = async () => {
    if (!editHospital.id) return;

    try {
      setUploadingImage(true);

      const hospitalInfoPayload = {
        name: editHospital.name,
        address: editHospital.address,
        city: editHospital.city,
        numberOfDoctors: parseInt(editHospital.numberOfDoctors) || 0,
        numberOfBeds: parseInt(editHospital.numberOfBeds) || 0,
        ageOfHospital: parseInt(editHospital.ageOfHospital) || 0,
        rating: parseFloat(editHospital.rating) || 0,
        about: editHospital.about || '',
        contactNumber: editHospital.contactNumber || '',
      };

      const formData = new FormData();
      formData.append(
        'hospital',
        new Blob([JSON.stringify(hospitalInfoPayload)], {
          type: 'application/json',
        })
      );

      // ✅ IMAGE PART
      if (editHospital.localImage) {
        const uri = editHospital.localImage;
        const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('picture', {
          uri,
          name: filename,
          type,
        });
      }

      const res = await axios.put(
        `${HOSPITAL_API}/update/${editHospital.id}`,
        formData
      );

      // Extract the response properly
      const updatedData = res.data || {};
      console.log('Hospital update response:', updatedData);
      
      // Get the picture URL from response - try multiple possible fields
      const pictureUrl = updatedData.picture || 
                        updatedData.image || 
                        (updatedData.hospital && updatedData.hospital.picture) ||
                        editHospital.localImage ||
                        editHospital.picture ||
                        null;

      const updatedHospital = {
        ...updatedData,
        picture: pictureUrl,
      };

      // Update hospitals list
      setHospitals(prev =>
        prev.map(h =>
          h.id === editHospital.id ? updatedHospital : h
        )
      );

      // Persist updated picture in AsyncStorage
      if (updatedHospital.id && updatedHospital.picture) {
        try {
          await AsyncStorage.setItem(`hospital:${updatedHospital.id}:picture`, updatedHospital.picture);
        } catch (e) {
          console.log('Error saving updated hospital picture to storage', e);
        }
      }

      // Update selected hospital if it's the same one
      setSelectedHospital(prev =>
        prev?.id === updatedHospital.id ? updatedHospital : prev
      );

      setEditHospitalModalVisible(false);

      Alert.alert('Success ✅', 'Hospital updated successfully!');

    } catch (error) {
      console.error('Update hospital failed:', error?.response?.data || error.message || error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to update hospital. Please try again.'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // DELETE HOSPITAL
  const handleDeleteHospital = async (hospital) => {
    const id = hospital?.id;
    if (!id) return;

    try {
      await axios.delete(`${HOSPITAL_API}/delete/${id}`);

      setHospitals(prev => prev.filter(h => h.id !== id));

      // Remove persisted picture for deleted hospital
      try {
        await AsyncStorage.removeItem(`hospital:${id}:picture`);
      } catch (e) {
        console.log('Error removing hospital picture from storage', e);
      }

      if (selectedHospital?.id === id) {
        setSelectedHospital(null);
      }
      
      Alert.alert('Success', 'Hospital deleted successfully!');
    } catch (error) {
      console.log('Delete failed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete hospital');
    }
  };

  // Department Functions
  const handleAddDepartment = async () => {
    if (!newDepartment.name.trim() || !newDepartment.description.trim()) {
      Alert.alert('Error', 'Please fill required fields (Name and Description)');
      return;
    }

    if (!selectedHospital?.id) {
      Alert.alert('Error', 'No hospital selected');
      return;
    }

    try {
      const departmentData = {
        name: newDepartment.name,
        description: newDepartment.description,
        hospitalId: selectedHospital.id
      };

      const response = await axios.post(`${DEPARTMENT_API}/add`, departmentData);
      
      Alert.alert('Success', 'Department added successfully!');
      setNewDepartment({ name: '', description: '' });
      setAddDepartmentModalVisible(false);
      // Refresh departments list
      fetchDepartments(selectedHospital.id);
    } catch (error) {
      console.error('Add department failed:', error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to add department');
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editDepartment.id) return;

    try {
      const departmentData = {
        name: editDepartment.name,
        description: editDepartment.description,
      };

      const response = await axios.put(`${DEPARTMENT_API}/update/${editDepartment.id}`, departmentData);
      
      Alert.alert('Success', 'Department updated successfully!');
      setEditDepartmentModalVisible(false);
      // Refresh departments list
      fetchDepartments(selectedHospital.id);
    } catch (error) {
      console.error('Update department failed:', error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update department');
    }
  };

  const handleDeleteDepartment = async (department) => {
    const id = department?.id;
    if (!id) return;

    try {
      await axios.delete(`${DEPARTMENT_API}/delete/${id}`);

      // Remove department from local state
      setDepartments(prev => prev.filter(d => d.id !== id));

      // If the currently edited department is deleted, close edit modal
      if (editDepartment?.id === id) {
        setEditDepartmentModalVisible(false);
      }

      Alert.alert('Success', 'Department deleted successfully!');
    } catch (error) {
      console.log('Delete failed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete department');
    }
  };

  // Doctor Functions
  const handleAddDoctor = async () => {
    if (!newDoctor.name.trim() || !newDoctor.phone.trim() || !newDoctor.specialization.trim() || !newDoctor.departmentId) {
      Alert.alert('Error', 'Please fill required fields (Name, Phone, Specialization, and select Department)');
      return;
    }

    try {
      setUploadingDoctorImage(true);

      const doctorData = {
        name: newDoctor.name,
        phone: newDoctor.phone,
        mail: newDoctor.mail || '',
        specialization: newDoctor.specialization,
        experience: parseInt(newDoctor.experience) || 0,
        fee: parseFloat(newDoctor.fee) || 0,
        education: newDoctor.education || '',
        departmentId: newDoctor.departmentId,
        cabinNumber: newDoctor.cabinNumber || null,
      };

      const formData = new FormData();
      formData.append(
        'doctor',
        new Blob([JSON.stringify(doctorData)], {
          type: 'application/json',
        })
      );

      // ✅ IMAGE PART (OPTIONAL)
      if (newDoctor.localImage) {
        const uri = newDoctor.localImage;
        const filename = uri.split('/').pop() || `doctor_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('picture', {
          uri,
          name: filename,
          type,
        });
      }

      const res = await axios.post(`${DOCTOR_API}/add`, formData);
      const savedDoctor = res.data || {};
      console.log('Doctor add response:', savedDoctor);
      
      // Get picture URL from response
      const pictureUrl = savedDoctor.picture || 
                        savedDoctor.image || 
                        (savedDoctor.doctor && savedDoctor.doctor.picture) ||
                        newDoctor.localImage ||
                        null;

      const doctorWithPicture = {
        ...savedDoctor,
        picture: pictureUrl,
      };

      // Persist doctor picture locally
      if (doctorWithPicture.id && doctorWithPicture.picture) {
        try {
          await AsyncStorage.setItem(`doctor:${doctorWithPicture.id}:picture`, doctorWithPicture.picture);
        } catch (e) {
          console.log('Error saving doctor picture to storage', e);
        }
      }
      
      // Clean up unsaved image
      try {
        await AsyncStorage.removeItem('unsaved:newDoctor:picture');
      } catch (e) {
        console.log('Failed removing unsaved doctor image', e);
      }

      Alert.alert('Success', 'Doctor added successfully!');
      
      // Reset form
      setNewDoctor({
        name: '',
        phone: '',
        mail: '',
        specialization: '',
        experience: '',
        fee: '',
        education: '',
        departmentId: '',
        cabinNumber: '',
        picture: null,
        localImage: null,
      });
      
      setAddDoctorModalVisible(false);
      
      // Refresh doctors list if we're viewing a specific department
      if (viewDoctorsDepartmentId) {
        fetchDoctorsByDepartment(viewDoctorsDepartmentId);
      } else if (selectedHospital?.id) {
        fetchAllDoctorsForHospital();
      }

    } catch (error) {
      console.error('Add doctor failed:', error?.response?.data || error.message);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to add doctor'
      );
    } finally {
      setUploadingDoctorImage(false);
    }
  };

  const handleUpdateDoctor = async () => {
    if (!editDoctor.id) return;

    try {
      setUploadingDoctorImage(true);

      const doctorData = {
        name: editDoctor.name,
        phone: editDoctor.phone,
        mail: editDoctor.mail || '',
        specialization: editDoctor.specialization,
        experience: parseInt(editDoctor.experience) || 0,
        fee: parseFloat(editDoctor.fee) || 0,
        education: editDoctor.education || '',
        departmentId: editDoctor.departmentId,
        cabinNumber: editDoctor.cabinNumber || null,
      };

      const formData = new FormData();
      formData.append(
        'doctor',
        new Blob([JSON.stringify(doctorData)], {
          type: 'application/json',
        })
      );

      // ✅ IMAGE PART
      if (editDoctor.localImage) {
        const uri = editDoctor.localImage;
        const filename = uri.split('/').pop() || `doctor_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('picture', {
          uri,
          name: filename,
          type,
        });
      }

      const res = await axios.put(
        `${DOCTOR_API}/update/${editDoctor.id}`,
        formData
      );

      const updatedData = res.data || {};
      console.log('Doctor update response:', updatedData);
      
      // Get picture URL from response
      const pictureUrl = updatedData.picture || 
                        updatedData.image || 
                        (updatedData.doctor && updatedData.doctor.picture) ||
                        editDoctor.localImage ||
                        editDoctor.picture ||
                        null;

      const updatedDoctor = {
        ...updatedData,
        picture: pictureUrl,
      };

      // Update doctors list
      setDoctors(prev =>
        prev.map(d =>
          d.id === editDoctor.id ? updatedDoctor : d
        )
      );

      // Persist updated doctor picture locally
      if (updatedDoctor.id && updatedDoctor.picture) {
        try {
          await AsyncStorage.setItem(`doctor:${updatedDoctor.id}:picture`, updatedDoctor.picture);
        } catch (e) {
          console.log('Error saving updated doctor picture to storage', e);
        }
      }

      Alert.alert('Success', 'Doctor updated successfully!');
      setEditDoctorModalVisible(false);

    } catch (error) {
      console.error('Update doctor failed:', error?.response?.data || error.message);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to update doctor'
      );
    } finally {
      setUploadingDoctorImage(false);
    }
  };

  const handleDeleteDoctor = async (doctor) => {
    const id = doctor?.id;
    if (!id) return;

    try {
      await axios.delete(`${DOCTOR_API}/delete/${id}`);

      // Remove doctor from local state
      setDoctors(prev => prev.filter(d => d.id !== id));

      Alert.alert('Success', 'Doctor deleted successfully!');
    } catch (error) {
      console.log('Delete doctor failed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete doctor');
    }
  };

  const openEditModal = (hospital) => {
    setEditHospital({
      id: hospital.id,
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      numberOfDoctors: hospital.numberOfDoctors.toString(),
      numberOfBeds: hospital.numberOfBeds.toString(),
      ageOfHospital: hospital.ageOfHospital.toString(),
      rating: hospital.rating.toString(),
      about: hospital.about || '',
      contactNumber: hospital.contactNumber || '',
      picture: hospital.picture,
      localImage: null,
    });
    setEditHospitalModalVisible(true);
  };

  const openEditDepartmentModal = (department) => {
    setEditDepartment({
      id: department.id,
      name: department.name,
      description: department.description,
      hospitalId: department.hospitalId,
    });
    setEditDepartmentModalVisible(true);
  };

  const openAddDoctorModal = (departmentId = null) => {
    setNewDoctor({
      name: '',
      phone: '',
      mail: '',
      specialization: '',
      experience: '',
      fee: '',
      education: '',
      departmentId: departmentId || '',
      cabinNumber: '',
      picture: null,
      localImage: null,
    });
    setAddDoctorModalVisible(true);
  };

  const openEditDoctorModal = (doctor) => {
    setEditDoctor({
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,
      mail: doctor.mail || '',
      specialization: doctor.specialization,
      experience: doctor.experience.toString(),
      fee: doctor.fee.toString(),
      education: doctor.education || '',
      departmentId: doctor.departmentId,
      cabinNumber: doctor.cabinNumber || '',
      picture: doctor.picture,
      localImage: null,
    });
    setEditDoctorModalVisible(true);
  };

  const openViewDoctorsModal = (departmentId = null, departmentName = null) => {
    setViewDoctorsDepartmentId(departmentId);
    setSelectedDepartmentForDoctors(departments.find(d => d.id === departmentId) || null);
    
    if (departmentId) {
      fetchDoctorsByDepartment(departmentId);
    } else {
      fetchAllDoctorsForHospital();
    }
    
    setViewDoctorsModalVisible(true);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-50 to-indigo-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-xl font-bold text-gray-700 mt-4">Loading hospitals...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#f0f9ff', '#e0f2fe']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="#f0f9ff" />
        {activeTab === 'hospitals' ? (
          <>
            {/* Header with Gradient */}
            <LinearGradient
              colors={['#4696e5ff', '#63d5f1ff']}
              className="px-6 pt-4 pb-6 rounded-b-3xl shadow-xl"
              style={{
                shadowColor: '#4f46e5',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 20,
              }}
            >
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-2xl font-bold text-white">
                    🏥 WeCare
                  </Text>
                  <Text className="text-indigo-100 mt-1">
                    Manage hospitals and departments
                  </Text>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={onRefresh}
                    className="bg-white/20 px-4 py-2 rounded-xl"
                  >
                    <Text className="text-white text-sm font-medium">Refresh</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded-xl shadow-sm"
                    style={{
                      shadowColor: '#ef4444',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 3,
                    }}
                  >
                    <Text className="text-white text-sm font-medium">Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Search */}
              <View className="mt-4 bg-white rounded-2xl px-4 py-3 flex-row items-center shadow-lg">
                <Ionicons name="search" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                <TextInput
                  placeholder="Search hospital by name, city or address..."
                  value={search}
                  onChangeText={setSearch}
                  className="flex-1 text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>

            {/* Hospital Cards Grid */}
            <FlatList
              data={filteredHospitals}
              keyExtractor={item => item.id?.toString() || item._id?.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#4F46E5']}
                />
              }
              contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
              renderItem={({ item }) => (
                <HospitalCard
                  item={item}
                  onPress={() => {
                    setSelectedHospital(item);
                    // Fetch departments for this hospital
                    fetchDepartments(item.id);
                    // Fetch all doctors for this hospital
                    fetchAllDoctorsForHospital();
                  }}
                  onEdit={openEditModal}
                  onDelete={handleDeleteHospital}
                />
              )}
              ListFooterComponent={
                <AddHospitalCard onPress={() => setAddHospitalModalVisible(true)} />
              }
              ListEmptyComponent={
                <View className="w-full items-center py-20">
                  <View className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full items-center justify-center mb-4">
                    <Ionicons name="medical-outline" size={48} color="#9ca3af" />
                  </View>
                  <Text className="text-gray-500 text-lg font-medium mb-2">
                    No Hospitals Found
                  </Text>
                  <Text className="text-gray-400 text-center mb-6">
                    {search ? 'Try a different search term' : 'Add your first hospital to get started'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setAddHospitalModalVisible(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-xl shadow-lg"
                    style={{
                      shadowColor: '#4f46e5',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }}
                  >
                    <Text className="text-black font-bold">+ Add First Hospital</Text>
                  </TouchableOpacity>
                </View>
              }
            />

            {/* ================= HOSPITAL DETAILS MODAL ================= */}
            <Modal visible={!!selectedHospital} animationType="slide">
              <SafeAreaView className="flex-1 bg-white">
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Header with Gradient */}
                  <LinearGradient
                    colors={['rgba(177,235,252,0.86)', 'rgba(90,250,215,0.86)']}
                    className="px-6 pt-4 pb-8"
                  >
                    <View className="flex-row justify-between items-center mb-6">
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedHospital(null);
                          setSearchDepartment('');
                        }}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                      >
                        <Ionicons name="arrow-back" size={24} color="white" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => openEditModal(selectedHospital)}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                      >
                        <Ionicons name="pencil" size={20} color="white" />
                      </TouchableOpacity>
                    </View>

                    {selectedHospital && (
                      <View className="items-center">
                        <View className="w-28 h-28 bg-white/20 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                          {selectedHospital.picture ? (
                            <Image
                              source={{ uri: selectedHospital.picture }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="w-full h-full items-center justify-center">
                              <Ionicons name="hospital" size={48} color="white" />
                            </View>
                          )}
                        </View>
                        <Text className="text-2xl font-bold text-white mt-6 text-center">
                          {selectedHospital.name}
                        </Text>
                        <View className="flex-row items-center mt-3">
                          <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full mr-3">
                            <Ionicons name="location" size={14} color="white" />
                            <Text className="text-white text-sm ml-1.5">{selectedHospital.city}</Text>
                          </View>
                          <View className="flex-row items-center bg-amber-500 px-3 py-1.5 rounded-full">
                            <Ionicons name="star" size={14} color="white" />
                            <Text className="text-white text-sm ml-1.5">{selectedHospital.rating} ⭐</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </LinearGradient>

                  {selectedHospital && (
                    <View className="px-6 pb-8 -mt-4">
                      {/* About Section */}
                      <View className="bg-white rounded-3xl p-6 shadow-xl mb-6 border border-gray-100">
                        <View className="flex-row items-center mb-4">
                          <View className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl items-center justify-center mr-3">
                            <Ionicons name="information-circle" size={24} color="#4f46e5" />
                          </View>
                          <Text className="text-xl font-bold text-gray-900">
                            About Hospital
                          </Text>
                        </View>
                        <Text className="text-gray-700 leading-6">
                          {selectedHospital.about || 'No description available for this hospital.'}
                        </Text>
                      </View>

                      {/* Hospital Information Cards */}
                      <View className="mb-8">
                        <View className="flex-row justify-between items-center mb-6">
                          <Text className="text-xl font-bold text-gray-900">
                            📊 Hospital Statistics
                          </Text>
                          <TouchableOpacity
                            onPress={() => setSignupModalVisible(true)}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 rounded-xl shadow-lg"
                            style={{
                              shadowColor: '#10b981',
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: 0.3,
                              shadowRadius: 8,
                            }}
                          >
                            <Text className="text-white font-bold">+ Add Staff</Text>
                          </TouchableOpacity>
                        </View>
                        
                        <View className="flex-row flex-wrap -mx-2">
                          {/* Doctors */}
                          <View className="w-1/2 px-2 mb-4">
                            <View className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 shadow-sm border border-blue-200">
                              <View className="flex-row items-center mb-3">
                                <View className="w-12 h-12 bg-blue-500 rounded-xl items-center justify-center mr-3">
                                  <Ionicons name="people" size={24} color="white" />
                                </View>
                                <View>
                                  <Text className="text-blue-800 text-xs font-medium">TOTAL DOCTORS</Text>
                                  <Text className="text-blue-900 text-2xl font-bold">{selectedHospital.numberOfDoctors}</Text>
                                </View>
                              </View>
                              <Text className="text-blue-700 text-xs">Medical professionals</Text>
                            </View>
                          </View>

                          {/* Beds */}
                          <View className="w-1/2 px-2 mb-4">
                            <View className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 shadow-sm border border-purple-200">
                              <View className="flex-row items-center mb-3">
                                <View className="w-12 h-12 bg-purple-500 rounded-xl items-center justify-center mr-3">
                                  <Ionicons name="bed" size={24} color="white" />
                                </View>
                                <View>
                                  <Text className="text-purple-800 text-xs font-medium">TOTAL BEDS</Text>
                                  <Text className="text-purple-900 text-2xl font-bold">{selectedHospital.numberOfBeds}</Text>
                                </View>
                              </View>
                              <Text className="text-purple-700 text-xs">Patient capacity</Text>
                            </View>
                          </View>

                          {/* Age */}
                          <View className="w-1/2 px-2">
                            <View className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 shadow-sm border border-orange-200">
                              <View className="flex-row items-center mb-3">
                                <View className="w-12 h-12 bg-orange-500 rounded-xl items-center justify-center mr-3">
                                  <Ionicons name="time" size={24} color="white" />
                                </View>
                                <View>
                                  <Text className="text-orange-800 text-xs font-medium">YEARS ACTIVE</Text>
                                  <Text className="text-orange-900 text-2xl font-bold">{selectedHospital.ageOfHospital}</Text>
                                </View>
                              </View>
                              <Text className="text-orange-700 text-xs">Hospital age</Text>
                            </View>
                          </View>

                          {/* Rating */}
                          <View className="w-1/2 px-2">
                            <View className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 shadow-sm border border-amber-200">
                              <View className="flex-row items-center mb-3">
                                <View className="w-12 h-12 bg-amber-500 rounded-xl items-center justify-center mr-3">
                                  <Ionicons name="star" size={24} color="white" />
                                </View>
                                <View>
                                  <Text className="text-amber-800 text-xs font-medium">RATING</Text>
                                  <Text className="text-amber-900 text-2xl font-bold">{selectedHospital.rating}</Text>
                                </View>
                              </View>
                              <Text className="text-amber-700 text-xs">Patient satisfaction</Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Contact Information */}
                      <View className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
                        <Text className="text-xl font-bold text-gray-900 mb-4">📞 Contact Information</Text>
                        
                        <View className="space-y-4">
                          <View className="flex-row items-center">
                            <View className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl items-center justify-center mr-4">
                              <Ionicons name="call" size={24} color="white" />
                            </View>
                            <View className="flex-1">
                              <Text className="text-gray-600 text-sm">Contact Number</Text>
                              <Text className="text-gray-900 text-lg font-semibold">
                                {selectedHospital.contactNumber || 'Not available'}
                              </Text>
                            </View>
                          </View>
                          
                          <View className="flex-row items-center">
                            <View className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl items-center justify-center mr-4">
                              <Ionicons name="location" size={24} color="white" />
                            </View>
                            <View className="flex-1">
                              <Text className="text-gray-600 text-sm">Full Address</Text>
                              <Text className="text-gray-900 text-lg font-semibold">
                                {selectedHospital.address}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Available Doctors Section */}
                      <View className="mb-8">
                        <View className="flex-row justify-between items-center mb-6">
                          <View>
                            <Text className="text-xl font-bold text-gray-900">
                              👩‍⚕️ Available Doctors
                            </Text>
                            <Text className="text-gray-600 text-sm mt-1">
                              {doctors.length} doctors available
                            </Text>
                          </View>
                          <View className="flex-row space-x-2">
                            <TouchableOpacity
                              onPress={() => openViewDoctorsModal()}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 rounded-xl shadow-lg"
                              style={{
                                shadowColor: '#4f46e5',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                              }}
                            >
                              <Text className="text-white font-bold">View All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => openAddDoctorModal()}
                              className="bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 rounded-xl shadow-lg"
                              style={{
                                shadowColor: '#10b981',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                              }}
                            >
                              <Text className="text-white font-bold">+ Add</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {doctors.length === 0 ? (
                          <View className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 items-center border border-gray-200">
                            <View className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full items-center justify-center mb-4">
                              <Ionicons name="person-outline" size={36} color="#4f46e5" />
                            </View>
                            <Text className="text-gray-700 font-medium mb-2">No Doctors Added Yet</Text>
                            <Text className="text-gray-500 text-center text-sm mb-6">
                              Add doctors to provide medical services in this hospital
                            </Text>
                            <TouchableOpacity
                              onPress={() => openAddDoctorModal()}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-xl"
                            >
                              <Text className="text-white font-bold">+ Add First Doctor</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
                            <View className="flex-row px-2">
                              {doctors.slice(0, 4).map(doctor => (
                                <DoctorCard
                                  key={doctor.id}
                                  item={doctor}
                                  onPress={openEditDoctorModal}
                                  onEdit={openEditDoctorModal}
                                  onDelete={handleDeleteDoctor}
                                />
                              ))}
                            </View>
                          </ScrollView>
                        )}
                      </View>

                      {/* Departments Section */}
                      <View className="mb-8">
                        <View className="flex-row justify-between items-center mb-6">
                          <View>
                            <Text className="text-xl font-bold text-gray-900">
                              🏥 Departments
                            </Text>
                            <Text className="text-gray-600 text-sm mt-1">
                              {departments.length} departments available
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <TouchableOpacity
                              onPress={() => {
                                setViewDepartmentsModalVisible(true);
                                fetchDepartments(selectedHospital.id);
                                setSearchDepartment('');
                              }}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 rounded-xl mr-2 shadow-lg"
                              style={{
                                shadowColor: '#4f46e5',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                              }}
                            >
                              <Text className="text-white font-bold">View All</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => {
                                setNewDepartment({ name: '', description: '' });
                                setAddDepartmentModalVisible(true);
                              }}
                              className="bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 rounded-xl shadow-lg"
                              style={{
                                shadowColor: '#10b981',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                              }}
                            >
                              <Text className="text-white font-bold">+ Add</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        
                        {/* Department Search */}
                        <View className="mb-6">
                          <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center shadow-sm border border-gray-200">
                            <Ionicons name="search" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                            <TextInput
                              placeholder="Search departments..."
                              value={searchDepartment}
                              onChangeText={setSearchDepartment}
                              className="flex-1 text-gray-800"
                              placeholderTextColor="#9ca3af"
                            />
                            {searchDepartment.length > 0 && (
                              <TouchableOpacity onPress={() => setSearchDepartment('')}>
                                <Ionicons name="close-circle" size={20} color="#9ca3af" />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        
                        {/* Filtered Departments */}
                        {filteredDepartments.length === 0 ? (
                          <View className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 items-center border border-gray-200">
                            <View className="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full items-center justify-center mb-4">
                              <Ionicons name="medical" size={36} color="#8b5cf6" />
                            </View>
                            <Text className="text-gray-700 font-medium mb-2">No Departments Found</Text>
                            <Text className="text-gray-500 text-center text-sm mb-6">
                              {searchDepartment ? 'Try a different search term' : 'Add departments to organize medical services'}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setNewDepartment({ name: '', description: '' });
                                setAddDepartmentModalVisible(true);
                              }}
                              className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-xl"
                            >
                              <Text className="text-white font-bold">+ Add First Department</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View className="flex-row flex-wrap -mx-2">
                            {filteredDepartments.slice(0, 6).map((department, index) => (
                              <View key={department.id} className="w-1/2 px-2 mb-4">
                                <TouchableOpacity 
                                  activeOpacity={0.9}
                                  onPress={() => {
                                    // View doctors for this department
                                    openViewDoctorsModal(department.id, department.name);
                                  }}
                                  className="h-full"
                                >
                                  <LinearGradient
                                    colors={getDepartmentColors(index)}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="rounded-2xl p-4 shadow-lg h-full"
                                    style={{
                                      elevation: 8,
                                      shadowColor: getShadowColor(index),
                                      shadowOffset: { width: 0, height: 4 },
                                      shadowOpacity: 0.3,
                                      shadowRadius: 6,
                                    }}
                                  >
                                    <View className="flex-row items-center mb-3">
                                      <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-3">
                                        <Text className="text-white font-bold text-lg">
                                          {department.name.charAt(0)}
                                        </Text>
                                      </View>
                                      <Text className="font-bold text-white flex-1" numberOfLines={1}>
                                        {department.name}
                                      </Text>
                                    </View>
                                    <Text className="text-white/90 text-sm mb-4" numberOfLines={2}>
                                      {department.description}
                                    </Text>
                                    <View className="flex-row justify-between items-center">
                                      <View className="flex-row items-center">
                                        <Ionicons name="medical" size={14} color="white" />
                                        <Text className="text-white/80 text-xs ml-1">
                                          View Doctors
                                        </Text>
                                      </View>
                                      <TouchableOpacity
                                        onPress={(e) => {
                                          e.stopPropagation();
                                          openAddDoctorModal(department.id);
                                        }}
                                        className="bg-white/20 px-2 py-1.5 rounded-lg"
                                      >
                                        <Text className="text-white text-xs">+ Add Doctor</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </LinearGradient>
                                </TouchableOpacity>
                              </View>
                            ))}
                            
                            {filteredDepartments.length > 6 && (
                              <View className="w-full px-2">
                                <TouchableOpacity
                                  onPress={() => {
                                    setViewDepartmentsModalVisible(true);
                                    fetchDepartments(selectedHospital.id);
                                    setSearchDepartment('');
                                  }}
                                  className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 items-center shadow-sm border border-indigo-200"
                                >
                                  <Text className="text-indigo-700 font-medium">
                                    + {filteredDepartments.length - 6} more departments
                                  </Text>
                                  <Text className="text-indigo-500 text-xs mt-1">Tap to view all</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </ScrollView>
              </SafeAreaView>
            </Modal>

            {/* ================= AVAILABLE DOCTORS MODAL ================= */}
            <AvailableDoctorsModal
              visible={viewDoctorsModalVisible}
              doctors={doctors}
              hospitalName={selectedHospital?.name}
              departmentName={selectedDepartmentForDoctors?.name}
              onClose={() => {
                setViewDoctorsModalVisible(false);
                setViewDoctorsDepartmentId(null);
                setSelectedDepartmentForDoctors(null);
              }}
              onAddDoctor={() => openAddDoctorModal(viewDoctorsDepartmentId)}
              onEditDoctor={openEditDoctorModal}
              onDeleteDoctor={handleDeleteDoctor}
              loadingDoctors={loadingDoctors}
            />

            {/* ================= ADD HOSPITAL MODAL ================= */}
            <Modal 
              visible={addHospitalModalVisible} 
              animationType="slide" 
              transparent
              onRequestClose={() => {
                setHospitalStep(1);
                setAddHospitalModalVisible(false);
                setNewHospital({
                  name: '',
                  address: '',
                  city: '',
                  numberOfDoctors: '',
                  numberOfBeds: '',
                  ageOfHospital: '',
                  rating: '',
                  about: '',
                  contactNumber: '',
                  picture: null,
                  localImage: null,
                });
              }}
            >
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-3xl overflow-hidden max-h-[90%] shadow-2xl">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 py-4"
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-white text-xl font-bold">
                          Add New Hospital
                        </Text>
                        <Text className="text-indigo-100 text-sm">
                          Step {hospitalStep} of 2
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setHospitalStep(1);
                          setAddHospitalModalVisible(false);
                          setNewHospital({
                            name: '',
                            address: '',
                            city: '',
                            numberOfDoctors: '',
                            numberOfBeds: '',
                            ageOfHospital: '',
                            rating: '',
                            about: '',
                            contactNumber: '',
                            picture: null,
                            localImage: null,
                          });
                        }}
                        disabled={isAddingHospital || uploadingImage}
                      >
                        <Ionicons name="close" size={28} color="white" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-6 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    {hospitalStep === 1 ? (
                      <>
                        {/* Step 1: Basic Information with Image Upload */}
                        <View className="mb-8 items-center">
                          <TouchableOpacity
                            onPress={() => pickImage(false)}
                            disabled={isAddingHospital || uploadingImage}
                            className={`w-36 h-36 rounded-2xl ${
                              newHospital.localImage 
                                ? 'border-2 border-blue-500' 
                                : 'border-2 border-dashed border-gray-300'
                            } items-center justify-center overflow-hidden`}
                          >
                            {newHospital.localImage ? (
                              <Image
                                source={{ uri: newHospital.localImage }}
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            ) : (
                              <View className="items-center">
                                <Ionicons name="camera" size={48} color="#9CA3AF" />
                                <Text className="text-gray-500 mt-3 text-center text-sm">
                                  Upload Hospital Image
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                          {uploadingImage && (
                            <View className="mt-4 flex-row items-center">
                              <ActivityIndicator size="small" color="#4F46E5" />
                              <Text className="text-gray-600 ml-3 text-sm">Uploading image...</Text>
                            </View>
                          )}
                          <Text className="text-gray-500 text-sm mt-3">
                            Tap to upload hospital image (optional)
                          </Text>
                        </View>

                        <View className="mb-6">
                          <Text className="font-bold text-gray-900 mb-3">Hospital Name *</Text>
                          <TextInput
                            placeholder="Enter hospital name"
                            value={newHospital.name}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, name: text }))
                            }
                            className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>

                        <View className="mb-6">
                          <Text className="font-bold text-gray-900 mb-3">Address *</Text>
                          <TextInput
                            placeholder="Enter full address"
                            value={newHospital.address}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, address: text }))
                            }
                            className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>

                        <View className="mb-6">
                          <Text className="font-bold text-gray-900 mb-3">City *</Text>
                          <TextInput
                            placeholder="Enter city name"
                            value={newHospital.city}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, city: text }))
                            }
                            className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>

                        <View className="mb-6">
                          <Text className="font-bold text-gray-900 mb-3">About Hospital</Text>
                          <TextInput
                            placeholder="Describe the hospital facilities and specialties"
                            value={newHospital.about}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, about: text }))
                            }
                            multiline
                            numberOfLines={4}
                            className="border border-gray-300 rounded-xl p-4 bg-gray-50 h-32"
                            editable={!isAddingHospital && !uploadingImage}
                            textAlignVertical="top"
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        {/* Step 2: Detailed Information */}
                        <Text className="text-xl font-bold text-gray-900 mb-6">Additional Information</Text>
                        
                        <View className="grid grid-cols-2 gap-4 mb-6">
                          <View>
                            <Text className="font-bold text-gray-900 mb-3">Number of Doctors</Text>
                            <TextInput
                              placeholder="Enter number"
                              keyboardType="numeric"
                              value={newHospital.numberOfDoctors}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, numberOfDoctors: text }))
                              }
                              className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>

                          <View>
                            <Text className="font-bold text-gray-900 mb-3">Number of Beds</Text>
                            <TextInput
                              placeholder="Enter number"
                              keyboardType="numeric"
                              value={newHospital.numberOfBeds}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, numberOfBeds: text }))
                              }
                              className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>

                          <View>
                            <Text className="font-bold text-gray-900 mb-3">Age of Hospital</Text>
                            <TextInput
                              placeholder="Years"
                              keyboardType="numeric"
                              value={newHospital.ageOfHospital}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, ageOfHospital: text }))
                              }
                              className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>

                          <View>
                            <Text className="font-bold text-gray-900 mb-3">Rating</Text>
                            <TextInput
                              placeholder="0-5"
                              keyboardType="decimal-pad"
                              value={newHospital.rating}
                              onChangeText={text =>
                                setNewHospital(prev => ({ ...prev, rating: text }))
                              }
                              className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                              editable={!isAddingHospital && !uploadingImage}
                            />
                          </View>
                        </View>

                        <View className="mb-6">
                          <Text className="font-bold text-gray-900 mb-3">Contact Number</Text>
                          <TextInput
                            placeholder="+91 1234567890"
                            keyboardType="phone-pad"
                            value={newHospital.contactNumber}
                            onChangeText={text =>
                              setNewHospital(prev => ({ ...prev, contactNumber: text }))
                            }
                            className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                            editable={!isAddingHospital && !uploadingImage}
                          />
                        </View>                        
                      </>
                    )}
                  </ScrollView>
                  <View className="flex-row border-t border-gray-200 p-6">
                    {hospitalStep === 2 && (
                      <TouchableOpacity
                        onPress={() => setHospitalStep(1)}
                        className="flex-1 border border-gray-300 rounded-xl p-4 mr-3 items-center"
                        disabled={isAddingHospital || uploadingImage}
                      >
                        <Text className="font-bold text-gray-700">Back</Text>
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
                      className={`flex-1 rounded-xl p-4 items-center justify-center ${
                        isAddingHospital || uploadingImage ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}
                      disabled={isAddingHospital || uploadingImage}
                      style={{
                        shadowColor: '#4f46e5',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      {isAddingHospital || uploadingImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-black font-bold text-lg">
                          {hospitalStep === 1 ? 'Next →' : 'Add Hospital'}
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
                <View className="bg-white w-[90%] rounded-3xl overflow-hidden max-h-[90%] shadow-2xl">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 py-4"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Edit Hospital
                      </Text>
                      <TouchableOpacity
                        onPress={() => setEditHospitalModalVisible(false)}
                        disabled={uploadingImage}
                      >
                        <Ionicons name="close" size={28} color="white" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-6 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    {/* Image Upload Section */}
                    <View className="mb-8 items-center">
                      <TouchableOpacity
                        onPress={() => pickImage(true)}
                        disabled={uploadingImage}
                        className={`w-36 h-36 rounded-2xl ${
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
                            <Ionicons name="camera" size={48} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-3 text-center text-sm">
                              Upload Hospital Image
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {uploadingImage && (
                        <View className="mt-4 flex-row items-center">
                          <ActivityIndicator size="small" color="#4F46E5" />
                          <Text className="text-gray-600 ml-3 text-sm">Uploading image...</Text>
                        </View>
                      )}
                      <Text className="text-gray-500 text-sm mt-3">
                        Tap to change hospital image (optional)
                      </Text>
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Hospital Name</Text>
                      <TextInput
                        value={editHospital.name}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Address</Text>
                      <TextInput
                        value={editHospital.address}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, address: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">City</Text>
                      <TextInput
                        value={editHospital.city}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, city: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingImage}
                      />
                    </View>

                    <View className="grid grid-cols-2 gap-4 mb-6">
                      <View>
                        <Text className="font-bold text-gray-900 mb-3">Number of Doctors</Text>
                        <TextInput
                          value={editHospital.numberOfDoctors}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, numberOfDoctors: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                          editable={!uploadingImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold text-gray-900 mb-3">Number of Beds</Text>
                        <TextInput
                          value={editHospital.numberOfBeds}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, numberOfBeds: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                          editable={!uploadingImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold text-gray-900 mb-3">Age of Hospital</Text>
                        <TextInput
                          value={editHospital.ageOfHospital}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, ageOfHospital: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                          editable={!uploadingImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold text-gray-900 mb-3">Rating</Text>
                        <TextInput
                          value={editHospital.rating}
                          onChangeText={text =>
                            setEditHospital(prev => ({ ...prev, rating: text }))
                          }
                          keyboardType="decimal-pad"
                          className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                          editable={!uploadingImage}
                        />
                      </View>
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">About Hospital</Text>
                      <TextInput
                        value={editHospital.about}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, about: text }))
                        }
                        multiline
                        numberOfLines={4}
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50 h-32"
                        editable={!uploadingImage}
                        textAlignVertical="top"
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Contact Number</Text>
                      <TextInput
                        value={editHospital.contactNumber}
                        onChangeText={text =>
                          setEditHospital(prev => ({ ...prev, contactNumber: text }))
                        }
                        keyboardType="phone-pad"
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingImage}
                      />
                    </View>
                  </ScrollView>

                  <View className="flex-row border-t border-gray-200 p-6">
                    <TouchableOpacity
                      onPress={() => setEditHospitalModalVisible(false)}
                      className="flex-1 border border-gray-300 rounded-xl p-4 mr-3 items-center"
                      disabled={uploadingImage}
                    >
                      <Text className="font-bold text-gray-700">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleEditHospital}
                      className={`flex-1 rounded-xl p-4 items-center ${
                        uploadingImage ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}
                      disabled={uploadingImage}
                      style={{
                        shadowColor: '#4f46e5',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      {uploadingImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-bold text-lg">Update Hospital</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= VIEW DEPARTMENTS MODAL ================= */}
            <Modal visible={viewDepartmentsModalVisible} animationType="slide">
              <SafeAreaView className="flex-1 bg-white">
                <ScrollView showsVerticalScrollIndicator={false}>
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 pt-4 pb-8"
                  >
                    <View className="flex-row justify-between items-center mb-6">
                      <TouchableOpacity
                        onPress={() => {
                          setViewDepartmentsModalVisible(false);
                          setSearchDepartment('');
                        }}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                      >
                        <Ionicons name="arrow-back" size={24} color="white" />
                      </TouchableOpacity>
                      
                      <Text className="text-white text-xl font-bold">
                        Departments
                      </Text>
                      
                      <TouchableOpacity
                        onPress={() => setAddDepartmentModalVisible(true)}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                      >
                        <Ionicons name="add" size={24} color="white" />
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center">
                      <View className="bg-white/20 rounded-full p-3 mr-3">
                        <Ionicons name="medical" size={24} color="white" />
                      </View>
                      <View>
                        <Text className="text-white text-lg font-bold">
                          {departments.length} Departments
                        </Text>
                        <Text className="text-indigo-100 text-sm">
                          {selectedHospital?.name}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>

                  <View className="px-6 pb-8 -mt-4">
                    {loadingDepartments ? (
                      <View className="py-20 items-center">
                        <ActivityIndicator size="large" color="#4f46e5" />
                        <Text className="text-gray-600 mt-4">Loading departments...</Text>
                      </View>
                    ) : departments.length === 0 ? (
                      <View className="py-20 items-center">
                        <View className="w-24 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full items-center justify-center mb-4">
                          <Ionicons name="medical-outline" size={40} color="#8b5cf6" />
                        </View>
                        <Text className="text-gray-500 text-lg font-medium mb-2">
                          No Departments Added
                        </Text>
                        <Text className="text-gray-400 text-center mb-6">
                          Add departments to organize medical services in {selectedHospital?.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setAddDepartmentModalVisible(true)}
                          className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-xl shadow-lg"
                          style={{
                            shadowColor: '#8b5cf6',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                          }}
                        >
                          <Text className="text-white font-bold">+ Add First Department</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View className="space-y-4">
                        {/* Department Statistics */}
                        <View className="flex-row -mx-2 mb-6">
                          <View className="w-1/2 px-2">
                            <View className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                              <Text className="text-blue-800 text-xs font-medium">TOTAL DEPARTMENTS</Text>
                              <Text className="text-blue-900 text-2xl font-bold">{departments.length}</Text>
                            </View>
                          </View>
                          <View className="w-1/2 px-2">
                            <View className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
                              <Text className="text-purple-800 text-xs font-medium">AVG. DOCTORS</Text>
                              <Text className="text-purple-900 text-2xl font-bold">
                                {doctors.length > 0 ? Math.round(doctors.length / departments.length) : 0}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Departments List */}
                        <Text className="text-gray-900 font-bold text-lg mb-4">All Departments</Text>
                        
                        {departments.map((department) => (
                          <View key={department.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-4">
                            <View className="flex-row justify-between items-start">
                              <View className="flex-1 mr-3">
                                <View className="flex-row items-center mb-2">
                                  <View className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl items-center justify-center mr-3">
                                    <Ionicons name="medical" size={20} color="#4f46e5" />
                                  </View>
                                  <Text className="font-bold text-lg text-gray-900">
                                    {department.name}
                                  </Text>
                                </View>
                                <Text className="text-gray-600 mb-3">
                                  {department.description}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => openViewDoctorsModal(department.id, department.name)}
                                  className="inline-block"
                                >
                                  <Text className="text-blue-600 text-sm font-medium">View Doctors →</Text>
                                </TouchableOpacity>
                              </View>
                              <View className="flex-row space-x-2">
                                <TouchableOpacity
                                  onPress={() => openEditDepartmentModal(department)}
                                  className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center"
                                >
                                  <Ionicons name="pencil" size={18} color="#3B82F6" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleDeleteDepartment(department)}
                                  className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center"
                                >
                                  <Ionicons name="trash" size={18} color="#EF4444" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => openAddDoctorModal(department.id)}
                                  className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center"
                                >
                                  <Ionicons name="person-add" size={18} color="#10B981" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Modal>

            {/* ================= ADD DEPARTMENT MODAL ================= */}
            <Modal visible={addDepartmentModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-3xl overflow-hidden max-h-[90%] shadow-2xl">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 py-4"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Add New Department
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setAddDepartmentModalVisible(false);
                          setNewDepartment({ name: '', description: '' });
                        }}
                      >
                        <Ionicons name="close" size={28} color="white" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-6 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Department Name *</Text>
                      <TextInput
                        placeholder="Enter department name (e.g., Cardiology)"
                        value={newDepartment.name}
                        onChangeText={text =>
                          setNewDepartment(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Description *</Text>
                      <TextInput
                        placeholder="Enter department description and services offered"
                        value={newDepartment.description}
                        onChangeText={text =>
                          setNewDepartment(prev => ({ ...prev, description: text }))
                        }
                        multiline
                        numberOfLines={4}
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50 h-32"
                        textAlignVertical="top"
                      />
                    </View>

                    <Text className="text-gray-500 text-sm mb-6">
                      Department will be added to: <Text className="font-semibold">{selectedHospital?.name}</Text>
                    </Text>
                  </ScrollView>

                  <View className="flex-row border-t border-gray-200 p-6">
                    <TouchableOpacity
                      onPress={() => {
                        setAddDepartmentModalVisible(false);
                        setNewDepartment({ name: '', description: '' });
                      }}
                      className="flex-1 border border-gray-300 rounded-xl p-4 mr-3 items-center"
                    >
                      <Text className="font-bold text-gray-700">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleAddDepartment}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 items-center shadow-lg"
                      style={{
                        shadowColor: '#4f46e5',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <Text className="text-white font-bold text-lg">Add Department</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= EDIT DEPARTMENT MODAL ================= */}
            <Modal visible={editDepartmentModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-3xl overflow-hidden max-h-[90%] shadow-2xl">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 py-4"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Edit Department
                      </Text>
                      <TouchableOpacity
                        onPress={() => setEditDepartmentModalVisible(false)}
                      >
                        <Ionicons name="close" size={28} color="white" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-6 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Department Name *</Text>
                      <TextInput
                        placeholder="Enter department name"
                        value={editDepartment.name}
                        onChangeText={text =>
                          setEditDepartment(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Description *</Text>
                      <TextInput
                        placeholder="Enter department description"
                        value={editDepartment.description}
                        onChangeText={text =>
                          setEditDepartment(prev => ({ ...prev, description: text }))
                        }
                        multiline
                        numberOfLines={4}
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50 h-32"
                        textAlignVertical="top"
                      />
                    </View>
                  </ScrollView>

                  <View className="flex-row border-t border-gray-200 p-6">
                    <TouchableOpacity
                      onPress={() => setEditDepartmentModalVisible(false)}
                      className="flex-1 border border-gray-300 rounded-xl p-4 mr-3 items-center"
                    >
                      <Text className="font-bold text-gray-700">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleUpdateDepartment}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 items-center shadow-lg"
                      style={{
                        shadowColor: '#4f46e5',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <Text className="text-white font-bold text-lg">Update Department</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= ADD DOCTOR MODAL ================= */}
            <Modal visible={addDoctorModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-3xl overflow-hidden max-h-[90%] shadow-2xl">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 py-4"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Add New Doctor
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setAddDoctorModalVisible(false);
                          setNewDoctor({
                            name: '',
                            phone: '',
                            mail: '',
                            specialization: '',
                            experience: '',
                            fee: '',
                            education: '',
                            departmentId: '',
                            cabinNumber: '',
                            picture: null,
                            localImage: null,
                          });
                        }}
                        disabled={uploadingDoctorImage}
                      >
                        <Ionicons name="close" size={28} color="white" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-6 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    {/* Image Upload Section */}
                    <View className="mb-8 items-center">
                      <TouchableOpacity
                        onPress={() => pickImage(false, true)}
                        disabled={uploadingDoctorImage}
                        className={`w-36 h-36 rounded-2xl ${
                          newDoctor.localImage 
                            ? 'border-2 border-blue-500' 
                            : 'border-2 border-dashed border-gray-300'
                        } items-center justify-center overflow-hidden`}
                      >
                        {newDoctor.localImage ? (
                          <Image
                            source={{ uri: newDoctor.localImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="items-center">
                            <Ionicons name="camera" size={48} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-3 text-center text-sm">
                              Upload Doctor Image
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {uploadingDoctorImage && (
                        <View className="mt-4 flex-row items-center">
                          <ActivityIndicator size="small" color="#4F46E5" />
                          <Text className="text-gray-600 ml-3 text-sm">Uploading image...</Text>
                        </View>
                      )}
                      <Text className="text-gray-500 text-sm mt-3">
                        Tap to upload doctor image (optional)
                      </Text>
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Name *</Text>
                      <TextInput
                        placeholder="Enter doctor name"
                        value={newDoctor.name}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Phone *</Text>
                      <TextInput
                        placeholder="Enter phone number"
                        value={newDoctor.phone}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, phone: text }))
                        }
                        keyboardType="phone-pad"
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Email</Text>
                      <TextInput
                        placeholder="Enter email address"
                        value={newDoctor.mail}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, mail: text }))
                        }
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Specialization *</Text>
                      <TextInput
                        placeholder="Enter specialization (e.g., Cardiology)"
                        value={newDoctor.specialization}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, specialization: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="grid grid-cols-2 gap-4 mb-6">
                      <View>
                        <Text className="font-bold text-gray-900 mb-3">Experience</Text>
                        <TextInput
                          placeholder="Years"
                          value={newDoctor.experience}
                          onChangeText={text =>
                            setNewDoctor(prev => ({ ...prev, experience: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                          editable={!uploadingDoctorImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold text-gray-900 mb-3">Fee (₹)</Text>
                        <TextInput
                          placeholder="Amount"
                          value={newDoctor.fee}
                          onChangeText={text =>
                            setNewDoctor(prev => ({ ...prev, fee: text }))
                          }
                          keyboardType="decimal-pad"
                          className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                          editable={!uploadingDoctorImage}
                        />
                      </View>
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Education</Text>
                      <TextInput
                        placeholder="Enter education (e.g., MBBS, MD)"
                        value={newDoctor.education}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, education: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Cabin Number</Text>
                      <TextInput
                        placeholder="Enter cabin number (optional)"
                        value={newDoctor.cabinNumber}
                        onChangeText={text =>
                          setNewDoctor(prev => ({ ...prev, cabinNumber: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Department *</Text>
                      {departments.length === 0 ? (
                        <View className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 items-center border border-gray-200">
                          <Ionicons name="warning" size={32} color="#ef4444" />
                          <Text className="text-red-600 font-medium mt-3 text-center">
                            No departments available
                          </Text>
                          <Text className="text-gray-500 text-center text-sm mt-2 mb-4">
                            Please add a department first before adding doctors
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setAddDoctorModalVisible(false);
                              setAddDepartmentModalVisible(true);
                            }}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-xl"
                          >
                            <Text className="text-white font-medium">+ Add Department</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <>
                          <ScrollView className="max-h-48">
                            {departments.map(dept => (
                              <TouchableOpacity
                                key={dept.id}
                                onPress={() => setNewDoctor(prev => ({ ...prev, departmentId: dept.id }))}
                                className={`border rounded-2xl p-4 mb-3 ${
                                  newDoctor.departmentId === dept.id 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-300 bg-gray-50'
                                }`}
                              >
                                <Text className="font-medium text-gray-900">{dept.name}</Text>
                                <Text className="text-gray-500 text-sm mt-1">{dept.description}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                          {newDoctor.departmentId && (
                            <Text className="text-green-600 text-sm mt-3 font-medium">
                              Selected: {departments.find(d => d.id === newDoctor.departmentId)?.name}
                            </Text>
                          )}
                        </>
                      )}
                    </View>
                  </ScrollView>

                  <View className="flex-row border-t border-gray-200 p-6">
                    <TouchableOpacity
                      onPress={() => {
                        setAddDoctorModalVisible(false);
                        setNewDoctor({
                          name: '',
                          phone: '',
                          mail: '',
                          specialization: '',
                          experience: '',
                          fee: '',
                          education: '',
                          departmentId: '',
                          cabinNumber: '',
                          picture: null,
                          localImage: null,
                        });
                      }}
                      className="flex-1 border border-gray-300 rounded-xl p-4 mr-3 items-center"
                      disabled={uploadingDoctorImage}
                    >
                      <Text className="font-bold text-gray-700">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleAddDoctor}
                      className={`flex-1 rounded-xl p-4 items-center ${
                        uploadingDoctorImage || departments.length === 0 
                          ? 'bg-blue-400' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}
                      disabled={uploadingDoctorImage || departments.length === 0}
                      style={{
                        shadowColor: '#4f46e5',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      {uploadingDoctorImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-bold text-lg">Add Doctor</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= EDIT DOCTOR MODAL ================= */}
            <Modal visible={editDoctorModalVisible} animationType="slide" transparent>
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="bg-white w-[90%] rounded-3xl overflow-hidden max-h-[90%] shadow-2xl">
                  <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    className="px-6 py-4"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-xl font-bold">
                        Edit Doctor
                      </Text>
                      <TouchableOpacity
                        onPress={() => setEditDoctorModalVisible(false)}
                        disabled={uploadingDoctorImage}
                      >
                        <Ionicons name="close" size={28} color="white" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView className="p-6 max-h-[500px]" showsVerticalScrollIndicator={false}>
                    {/* Image Upload Section */}
                    <View className="mb-8 items-center">
                      <TouchableOpacity
                        onPress={() => pickImage(true, true)}
                        disabled={uploadingDoctorImage}
                        className={`w-36 h-36 rounded-2xl ${
                          editDoctor.localImage || editDoctor.picture
                            ? 'border-2 border-blue-500' 
                            : 'border-2 border-dashed border-gray-300'
                        } items-center justify-center overflow-hidden`}
                      >
                        {editDoctor.localImage ? (
                          <Image
                            source={{ uri: editDoctor.localImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : editDoctor.picture ? (
                          <Image
                            source={{ uri: editDoctor.picture }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="items-center">
                            <Ionicons name="camera" size={48} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-3 text-center text-sm">
                              Upload Doctor Image
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {uploadingDoctorImage && (
                        <View className="mt-4 flex-row items-center">
                          <ActivityIndicator size="small" color="#4F46E5" />
                          <Text className="text-gray-600 ml-3 text-sm">Uploading image...</Text>
                        </View>
                      )}
                      <Text className="text-gray-500 text-sm mt-3">
                        Tap to change doctor image (optional)
                      </Text>
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Name *</Text>
                      <TextInput
                        value={editDoctor.name}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, name: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Phone *</Text>
                      <TextInput
                        value={editDoctor.phone}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, phone: text }))
                        }
                        keyboardType="phone-pad"
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Email</Text>
                      <TextInput
                        value={editDoctor.mail}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, mail: text }))
                        }
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Specialization *</Text>
                      <TextInput
                        value={editDoctor.specialization}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, specialization: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="grid grid-cols-2 gap-4 mb-6">
                      <View>
                        <Text className="font-bold text-gray-900 mb-3">Experience</Text>
                        <TextInput
                          value={editDoctor.experience}
                          onChangeText={text =>
                            setEditDoctor(prev => ({ ...prev, experience: text }))
                          }
                          keyboardType="numeric"
                          className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                          editable={!uploadingDoctorImage}
                        />
                      </View>

                      <View>
                        <Text className="font-bold text-gray-900 mb-3">Fee (₹)</Text>
                        <TextInput
                          value={editDoctor.fee}
                          onChangeText={text =>
                            setEditDoctor(prev => ({ ...prev, fee: text }))
                          }
                          keyboardType="decimal-pad"
                          className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                          editable={!uploadingDoctorImage}
                        />
                      </View>
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Education</Text>
                      <TextInput
                        value={editDoctor.education}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, education: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Cabin Number</Text>
                      <TextInput
                        value={editDoctor.cabinNumber}
                        onChangeText={text =>
                          setEditDoctor(prev => ({ ...prev, cabinNumber: text }))
                        }
                        className="border border-gray-300 rounded-xl p-4 bg-gray-50"
                        editable={!uploadingDoctorImage}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="font-bold text-gray-900 mb-3">Department</Text>
                      {departments.length === 0 ? (
                        <Text className="text-red-500">No departments available</Text>
                      ) : (
                        <>
                          <ScrollView className="max-h-48">
                            {departments.map(dept => (
                              <TouchableOpacity
                                key={dept.id}
                                onPress={() => setEditDoctor(prev => ({ ...prev, departmentId: dept.id }))}
                                className={`border rounded-2xl p-4 mb-3 ${
                                  editDoctor.departmentId === dept.id 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-300 bg-gray-50'
                                }`}
                              >
                                <Text className="font-medium text-gray-900">{dept.name}</Text>
                                <Text className="text-gray-500 text-sm mt-1">{dept.description}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                          {editDoctor.departmentId && (
                            <Text className="text-green-600 text-sm mt-3 font-medium">
                              Selected: {departments.find(d => d.id === editDoctor.departmentId)?.name}
                            </Text>
                          )}
                        </>
                      )}
                    </View>
                  </ScrollView>

                  <View className="flex-row border-t border-gray-200 p-6">
                    <TouchableOpacity
                      onPress={() => setEditDoctorModalVisible(false)}
                      className="flex-1 border border-gray-300 rounded-xl p-4 mr-3 items-center"
                      disabled={uploadingDoctorImage}
                    >
                      <Text className="font-bold text-gray-700">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleUpdateDoctor}
                      className={`flex-1 rounded-xl p-4 items-center ${
                        uploadingDoctorImage ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}
                      disabled={uploadingDoctorImage}
                      style={{
                        shadowColor: '#4f46e5',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      {uploadingDoctorImage ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-bold text-lg">Update Doctor</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ================= SIGNUP MODAL ================= */}
            <SignupComponent 
              visible={signupModalVisible} 
              onClose={() => setSignupModalVisible(false)}
            />
          </>
        ) : (
          <>
            {/* SIGNUP TAB CONTENT */}
            <SignupComponent 
              visible={activeTab === 'signup'} 
              onClose={() => setActiveTab('hospitals')}
            />
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
