import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function choosecareHome() {
  const isWeb = Platform.OS === "web";
  const [showHospitals, setShowHospitals] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [selectedInfo, setSelectedInfo] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [userQuestion, setUserQuestion] = useState("");

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
  const handlehospitallist = () => {
    router.push("/extrafiles/hospitals");
  };
  const openSocialLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };
  const faqData = [
    {
      q: "How to book online appointment?",
      a: "Login to your account, select a doctor or hospital, choose an available time slot, and click 'Confirm Booking'. You will receive an SMS confirmation.",
    },
    {
      q: "How to make payment?",
      a: "We support Credit/Debit cards, UPI, and net banking. Payments are processed securely via our integrated payment gateway at the time of booking.",
    },
    {
      q: "How to book cabin in hospital?",
      a: "Cabin availability is shown on the hospital profile page. You can select 'Cabin' under the room type section during your appointment or admission request.",
    },
    {
      q: "How much my insurance cover?",
      a: "Insurance coverage depends on your provider. You can upload your insurance card details in the 'Profile' section to see estimated coverage for specific hospitals.",
    },
  ];

  const filteredFaqs = faqData.filter((item) =>
    item.q.toLowerCase().includes(faqSearch.toLowerCase())
  );
  const handleBroadcastQuestion = () => {
    if (!userQuestion.trim()) {
      isWeb
        ? window.alert("Please enter a question.")
        : Alert.alert("Error", "Please enter a question.");
      return;
    }

    const successMsg =
      "Your question has been broadcasted to all available doctors. You will be notified when someone responds.";
    isWeb ? window.alert(successMsg) : Alert.alert("Sent", successMsg);
    setUserQuestion("");
  };
  const footerDetails: Record<string, string> = {
    Doctors:
      "Our network includes over 500+ board-certified specialists ranging from Cardiology to Pediatrics.",
    FAQs: "Have more questions? Check our detailed help center for billing, technical, and medical FAQs.",
    Team: "Meet the visionary leaders and healthcare experts dedicated to making ChooseCare the best platform for you.",
    Blog: "Stay updated with the latest health trends, nutritional advice, and medical breakthroughs from our experts.",
    Services:
      "We provide OPD consultations, emergency care, diagnostic imaging, and home-care nursing services.",

    Support:
      "Our support team is available 24/7. You can reach us via live chat or at support@choosecare.com.",
    Careers:
      "Join our medical network. We are currently looking for pediatricians and senior nurses.",
    Education:
      "We provide certified health courses, webinars with top surgeons, and daily wellness articles.",
    Appointments:
      "Bookings can be managed through your dashboard. Rescheduling is free up to 2 hours before the slot.",

    Conditions:
      "By using ChooseCare, you agree to our service guidelines, including booking and cancellation policies.",
    "Cookie Policy":
      "We use cookies to improve your browsing experience and provide personalized healthcare recommendations.",
    "Privacy Policy":
      "Your health data is encrypted and never shared with third parties without your explicit consent.",
  };
  const toggleInfo = (link: string) => {
    if (footerDetails[link]) {
      setSelectedInfo(
        selectedInfo?.title === link
          ? null
          : { title: link, content: footerDetails[link] }
      );
    }
  };
  return (
    <View className="flex-1 ">
      <View
        className={`${
          isWeb
            ? "flex-row bg-white/10 items-center justify-between px-6 py-4 border-b border-gray-100 shadow-sm"
            : "flex-row justify-between px-4"
        }`}
      >
        <View
          className={`${
            isWeb ? "flex-row items-center" : "flex-row items-center"
          }`}
        >
          <View
            className={`${
              isWeb
                ? "bg-[#2eb8b8] p-2 rounded-lg mr-2"
                : "bg-[#2eb8b8] p-2 rounded-lg mt-10 m-2"
            }`}
          >
            <FontAwesome name="plus-square" size={18} color="white" />
          </View>
          <Text
            className={`${
              isWeb
                ? "text-3xl italic text-[#2eb8b8] font-bold tracking-tighter"
                : "text-2xl italic text-[#2eb8b8] font-bold tracking-tighter mt-8"
            }`}
          >
            ChooseCare
          </Text>
        </View>

        <View
          className={`${
            isWeb
              ? "flex-row items-center space-x-8"
              : "flex-row items-center space-x-8 mt-8 m-2"
          }`}
        >
          {/* <View
            className={`${
              isWeb
                ? "flex-row items-center gap-x-2"
                : "flex-row items-center gap-x-4"
            }`}
          ></View> */}
          <TouchableOpacity
            onPress={handleLogout}
            className={`${
              isWeb
                ? "bg-[#2eb8b8] px-4 py-2 rounded-xl border border-red-100"
                : "bg-[#2eb8b8] px-2 py-2 rounded-xl border border-red-100 ml-4"
            }`}
          >
            <Text className="text-white font-bold">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="rounded-b-[40px] overflow-hidden">
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000",
            }}
            className={`${
              isWeb
                ? "flex-1 flex-row justify-center items-center px-6 py-24 "
                : "flex-1 px-6 py-20"
            }`}
            resizeMode="cover"
          >
            <View
              className={`${
                isWeb
                  ? "w-[650px] h-[300px] bg-white/50 p-10 rounded-[40px] items-center justify-center border border-white/40 shadow-2xl "
                  : "w-full bg-white/50 p-5 rounded-[40px] items-center justify-center border border-white/40 shadow-2xl mb-8 "
              }`}
              style={{ backdropFilter: isWeb ? "blur(5px)" : "none" }}
            >
              <Text
                className={`${
                  isWeb
                    ? "text-3xl font-bold text-slate-900 leading-tight mb-6"
                    : "text-xl font-bold text-slate-900 leading-tight mb-4"
                }`}
              >
                Welcome to a choosecare{"\n"}
                <Text className="text-[#2eb8b8]">
                  place where safety meets responsibility.
                </Text>
              </Text>

              <Text
                className={`${
                  isWeb
                    ? "text-lg text-slate-600 mb-8 leading-relaxed"
                    : " text-slate-600  leading-relaxed"
                }`}
              >
                Choose your doctor today,Embrace a world of comprehensive
                healthcare where your well-being takes center stage. At
                choosecare, we're dedicated to providing you with personalized
                medical services.
              </Text>
            </View>

            <View className={`${isWeb ? "flex-row" : ""}`}>
              <View
                className={` ${
                  isWeb
                    ? "w-[300px] h-[300px] m-8 bg-[#ccf2ff]/70 p-10 rounded-[40px] border border-white/40 shadow-2xl "
                    : "w-full bg-[#ccf2ff]/70 p-5 rounded-[40px] border border-white/40 shadow-2xl mb-8 "
                }`}
                style={{ backdropFilter: isWeb ? "blur(5px)" : "none" }}
              >
                <Text
                  className={`${
                    isWeb
                      ? "text-xl font-bold text-slate-900 leading-tight mb-6"
                      : " text-xl font-bold text-slate-900 leading-tight "
                  }`}
                >
                  Preserving Lives,Shaping a Safer Tomorrown{"\n"}
                </Text>
                <Text
                  className={`${
                    isWeb
                      ? "font-semibold text-slate-700 leading-tight mb-6"
                      : "font-semibold text-slate-700 leading-tight"
                  }`}
                >
                  Search for your required doctors and book appointment now
                  {"\n"}
                </Text>
                <TouchableOpacity
                  className={`${
                    isWeb
                      ? "bg-[#2eb8b8] p-2 w-2/3 rounded-lg flex-row"
                      : "bg-[#2eb8b8] p-2 w-1/2 rounded-lg flex-row"
                  }`}
                  onPress={handlehospitallist}
                >
                  <Text className="font-semibold text-white pr-2">
                    View hospitals
                  </Text>
                  <FontAwesome
                    className="pl-1"
                    name="arrow-right"
                    size={16}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              <View
                className={` ${
                  isWeb
                    ? "w-[300px] h-[300px] m-8 bg-[#fff]/70 p-4 rounded-[40px] border border-white/40 shadow-2xl "
                    : "w-full bg-[#fff]/70 p-6 rounded-[40px] border border-white/40 shadow-2xl "
                }`}
              >
                <ImageBackground
                  source={{
                    uri: "https://media.globaldev.tech/images/how_to_build_a_doctor_appointment_app_for_y.format-webp.webp",
                  }}
                  className="flex-1 justify-center px-6 py-20 rounded-lg"
                  resizeMode="cover"
                ></ImageBackground>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View className="py-24 px-12 bg-slate-50 flex-row flex-wrap justify-between">
          <View
            className={`${isWeb ? "w-1/3 justify-evenly" : "w-full mb-10"}`}
          >
            <Text className="text-[#1e9b9b] font-bold tracking-widest uppercase mb-2">
              About choosecare
            </Text>
            <Text className="text-4xl font-bold text-slate-900 mb-6">
              We Deliver Exceptional{"\n"}Patient Experiences
            </Text>
            <Text className="text-slate-600 mb-8 leading-relaxed">
              Experience a comprehensive healthcare environment where technology
              and empathy work together. Our specialists are dedicated to
              providing personalized medical solutions.
            </Text>
            <TouchableOpacity
              className="bg-[#2eb8b8] px-4 py-3 rounded-2xl self-start shadow-md"
              onPress={handlehospitallist}
            >
              <Text className="text-white font-bold italic">
                View Hospitals →
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className={`${
              isWeb ? "w-1/3" : "w-full mb-10"
            } items-center relative`}
          >
            <View className="rounded-t-[120px] rounded-b-[40px] overflow-hidden border-4 border-white ">
              <ImageBackground
                source={{
                  uri: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000",
                }}
                className="w-[320px] h-[400px]"
              />
            </View>
            <View className="absolute bottom-[-10] left-10 bg-[#d1fae5] p-6 rounded-3xl shadow-lg border-2 border-white">
              <Text className="text-3xl font-black text-slate-800">8K+</Text>
              <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
                Verified Reviews
              </Text>
            </View>
          </View>

          <View className={`${isWeb ? "w-1/4 justify-center " : "w-full"}`}>
            <Text className="text-xl font-bold text-slate-900 mb-6 italic">
              Why Trust Us?
            </Text>
            <View className="">
              <TouchableOpacity className="flex-row items-center mb-4">
                <View className="bg-blue-100 rounded-full p-2 mr-3">
                  <FontAwesome6 name="stethoscope" size={14} color="#2563eb" />
                </View>
                <Text className="text-slate-700 font-semibold">
                  Expert Medical Panel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center mb-4">
                <View className="bg-blue-100 rounded-full p-2 mr-3">
                  <FontAwesome6 name="user-doctor" size={14} color="#2563eb" />
                </View>
                <Text className="text-slate-700 font-semibold">
                  Expert Doctors
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center mb-4">
                <View className="bg-blue-100 rounded-full p-2 mr-3">
                  <FontAwesome6 name="hospital" size={14} color="#2563eb" />
                </View>
                <Text className="text-slate-700 font-semibold">
                  Multiple services
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center mb-4">
                <View className="bg-blue-100 rounded-full p-2 mr-3">
                  <FontAwesome6 name="seedling" size={14} color="#2563eb" />
                </View>
                <Text className="text-slate-700 font-semibold">
                  Welcoming Environment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="py-20 px-6 lg:px-24 bg-white">
          <View
            className={`${isWeb ? "flex-row" : "flex-col"} justify-between`}
          >
            <View className={`${isWeb ? "w-[45%]" : "w-full mb-10"}`}>
              <ImageBackground
                source={{
                  uri: "https://media.istockphoto.com/id/521849567/photo/medical-school-professor-using-model-to-teach-nursing-students.jpg?s=612x612&w=0&k=20&c=J1gGZxco8uV6MEAFEHwlbgLi3hI4bTDgnYJ-Eq6KMHM=",
                }}
                className="w-full h-[400px] rounded-[30px] mb-8"
                resizeMode="cover"
              />

              <View className="bg-slate-50 p-6 rounded-[30px] border border-slate-100 shadow-sm">
                <Text className="text-xl font-bold text-slate-800 mb-2">
                  Can't find an answer?
                </Text>
                <Text className="text-slate-500 mb-4 text-sm">
                  Ask a question directly to our medical panel.
                </Text>
                <TextInput
                  placeholder="Type your medical query here..."
                  multiline
                  numberOfLines={4}
                  value={userQuestion}
                  onChangeText={setUserQuestion}
                  className="bg-white p-4 rounded-2xl border border-slate-200 mb-4 text-slate-700 h-24"
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  onPress={handleBroadcastQuestion}
                  className="bg-[#2eb8b8] py-4 rounded-2xl items-center flex-row justify-center"
                >
                  <FontAwesome
                    name="paper-plane"
                    size={16}
                    color="white"
                    className="mr-2"
                  />
                  <Text className="text-white font-bold ml-2">
                    Send to All Doctors
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className={`${isWeb ? "w-[50%]" : "w-full"}`}>
              <View className={`${isWeb ? "w-[100%] pb-10" : "w-full"}`}>
                <Text className="text-[#2eb8b8] font-bold uppercase tracking-widest mb-2 text-xs">
                  FAQ
                </Text>
                <Text className="text-4xl font-bold text-slate-900 mb-8">
                  We Are Here{" "}
                  <Text className="font-black">To Answer Your Questions</Text>
                </Text>

                {faqData.map((item, index) => (
                  <View key={index} className="border-b border-gray-100">
                    <TouchableOpacity
                      onPress={() =>
                        setExpandedFaq(expandedFaq === index ? null : index)
                      }
                      className="py-5 flex-row justify-between items-center"
                    >
                      <Text
                        className={`text-base font-semibold ${
                          expandedFaq === index
                            ? "text-[#2eb8b8]"
                            : "text-slate-800"
                        }`}
                      >
                        {item.q}
                      </Text>
                      <FontAwesome
                        name={
                          expandedFaq === index ? "minus-circle" : "plus-circle"
                        }
                        size={20}
                        color={expandedFaq === index ? "#2eb8b8" : "#e2e8f0"}
                      />
                    </TouchableOpacity>
                    {expandedFaq === index && (
                      <View className="pb-5">
                        <Text className="text-slate-500 leading-relaxed">
                          {item.a}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
              <View className="w-full h-[290px] rounded-xl mb-8">
                <ImageBackground
                  source={{
                    uri: "https://img.freepik.com/free-photo/team-doctors-meeting-hospital_23-2148816223.jpg",
                  }}
                  className="w-full h-[290px] rounded-xl mb-8 p-4"
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        </View>

        <View className="bg-[#ccf2ff]/70 pt-10 border-t border-gray-200">
          {selectedInfo && (
            <View className="mx-10 mb-10 p-6 bg-[#e6f9f9] rounded-3xl border border-[#2eb8b8]/20 flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-[#1e9b9b] font-bold text-lg mb-1">
                  {selectedInfo.title}
                </Text>
                <Text className="text-slate-600 leading-relaxed">
                  {selectedInfo.content}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedInfo(null)}
                className="ml-4 bg-white p-2 rounded-full"
              >
                <FontAwesome name="times" size={16} color="#1e9b9b" />
              </TouchableOpacity>
            </View>
          )}
          <View
            className={` ${
              isWeb
                ? "flex-row justify-evenly flex-wrap px-10"
                : "flex-col px-4"
            }`}
          >
            <View
              className={`flex-row justify-between ${
                isWeb ? "w-3/5" : "w-full mb-10"
              }`}
            >
              <View>
                <View>
                  <Text className="font-bold text-gray-900 mb-4 mr-2 text-base">
                    Community
                  </Text>
                  {["Doctors", "FAQs", "Team", "Blog", "Services"].map(
                    (link) => (
                      <TouchableOpacity
                        key={link}
                        onPress={() => toggleInfo(link)}
                      >
                        <Text className="text-gray-600 mb-3 text-sm hover:text-[#2eb8b8]">
                          {link}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
              <View>
                <Text className="font-bold text-gray-900 mb-4 text-base">
                  About Us
                </Text>
                {["Support", "Careers", "Education", "Appointments"].map(
                  (link) => (
                    <TouchableOpacity
                      key={link}
                      onPress={() => toggleInfo(link)}
                    >
                      <Text className="text-gray-600 mb-3 text-sm hover:text-[#2eb8b8]">
                        {link}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <View className={`${isWeb ? "" : "mr-4"}`}>
                <Text className="font-bold text-gray-900 mb-4 text-base">
                  Legal
                </Text>
                {["Conditions", "Cookie Policy", "Privacy Policy"].map(
                  (link) => (
                    <TouchableOpacity
                      key={link}
                      onPress={() => toggleInfo(link)}
                    >
                      <Text className="text-gray-600 mb-3 text-sm hover:text-[#2eb8b8]">
                        {link}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <View className={`${isWeb ? "w-1/5" : "w-full"}`}>
                <Text className="font-bold text-gray-900 mb-4 text-base">
                  Social Media
                </Text>
                <View className={`${isWeb ? "flex-row gap-x-5" : "gap-4"}`}>
                  <TouchableOpacity
                    onPress={() => openSocialLink("https://linkedin.com")}
                  >
                    <FontAwesome name="linkedin" size={20} color="#1e9b9b" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => openSocialLink("https://instagram.com")}
                  >
                    <FontAwesome name="instagram" size={20} color="#1e9b9b" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => openSocialLink("https://facebook.com")}
                  >
                    <FontAwesome name="facebook" size={20} color="#1e9b9b" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => openSocialLink("https://twitter.com")}
                  >
                    <FontAwesome6 name="twitter" size={20} color="#1e9b9b" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View
            className={`${
              isWeb
                ? "mt-12 border-t bg-[#fff] border-gray-300 pt-10 pb-10 items-center"
                : "mt-12 border-t bg-[#fff] border-gray-300 p-8  items-center"
            }`}
          >
            <View className={`items-center ${isWeb ? "flex-row" : "flex-col"}`}>
              <Text className="text-xl font-bold text-gray-700 mr-8 mb-5">
                For better experience, download the app now
              </Text>
              <View className="flex-row gap-x-4">
                <TouchableOpacity
                  className="bg-black flex-row items-center px-4 py-2 rounded-xl border border-gray-700"
                  onPress={() =>
                    openSocialLink("https://apps.apple.com/in/app")
                  }
                >
                  <FontAwesome name="apple" size={24} color="white" />
                  <View className="ml-3">
                    <Text className="text-[10px] text-white uppercase">
                      Download on the
                    </Text>
                    <Text className="text-white font-bold text-base">
                      App Store
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-black flex-row items-center px-4 py-2 rounded-xl border border-gray-700"
                  onPress={() =>
                    openSocialLink(
                      "https://play.google.com/store/games?device=windows&pli=1"
                    )
                  }
                >
                  <FontAwesome name="play" size={20} color="white" />
                  <View className="ml-3">
                    <Text className="text-[10px] text-white uppercase">
                      Get it on
                    </Text>
                    <Text className="text-white font-bold text-base">
                      Google Play
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View className="h-[30px] w-full items-center justify-center">
          <Text className="text-gray-800 text-sm">
            © 2025 ChooseCare Limited
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
