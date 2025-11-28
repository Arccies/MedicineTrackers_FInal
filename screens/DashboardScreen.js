import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { FontAwesome5 } from '@expo/vector-icons';
import ExpirationModal from "../screens/ExpirationModal"; // import modal

export default function DashboardScreen({ navigation, route }) {
  const jumpAnim = useRef(new Animated.Value(0)).current;

  const [partnerName, setPartnerName] = useState("Your Partner");
  const [partnerImage, setPartnerImage] = useState(require("../assets/cute-cat.png"));
  const [tutorialStep, setTutorialStep] = useState(0);

  const [expiringItems, setExpiringItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fullName = route.params?.user?.fullName || "User";
  const userId = route.params?.user?._id;
  const API_BASE = "http://192.168.68.110:5000/api";

  // Load expiring vitamins & medications
  useEffect(() => {
    if (userId) checkExpiringItems();
  }, [userId]);

  const checkExpiringItems = async () => {
    try {
      const [vitRes, medRes] = await Promise.all([
        axios.get(`${API_BASE}/vitamins/${userId}`),
        axios.get(`${API_BASE}/medications/user/${userId}`),
      ]);

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const items = [];

      const checkItem = (item, type) => {
        if (!item.expirationDate) return;
        const expDate = new Date(item.expirationDate);
        const expString = expDate.toDateString();
        const todayString = today.toDateString();
        const tomorrowString = tomorrow.toDateString();

        if (expString === todayString)
          items.push({ _id: item._id, name: item.selectedName || item.name, type, when: "today" });
        else if (expString === tomorrowString)
          items.push({ _id: item._id, name: item.selectedName || item.name, type, when: "tomorrow" });
      };

      vitRes.data.forEach((v) => checkItem(v, "Vitamin"));
      medRes.data.forEach((m) => checkItem(m, "Medication"));

      setExpiringItems(items);
    } catch (err) {
      console.log("❌ Error checking expiring items:", err.message);
    }
  };

  // Partner info
  useEffect(() => {
    if (route.params?.user) {
      const user = route.params.user;
      setPartnerName(user.partner?.name || "Your Partner");
      setPartnerImage(
        user.partner?.image
          ? user.partner.image.uri
            ? { uri: user.partner.image.uri }
            : user.partner.image
          : require("../assets/cute-cat.png")
      );
    }
  }, [route.params?.user]);

  // Cat jump animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(jumpAnim, { toValue: -15, duration: 500, useNativeDriver: true }),
        Animated.timing(jumpAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Delete locally after modal delete
  const handleDeletedLocal = (id) => {
    setExpiringItems(prev => prev.filter(item => item._id !== id));
  };

  // Tutorial data
  const tutorialData = [
    {}, // step 0: no tutorial
    { text: `🐱 Hi, I'm your partner ${partnerName} and I will guide you through the app today! I will show you how to use all the main features so you can easily manage your medications, vitamins, health products, pharmacies, and track expiring items.` },
    { text: `🐱 This is your Medication section. Here you can view, add, and track all your medications. You can also see which medications are expiring soon and get reminders to take them on time.`, highlight: "medication" },
    { text: `🐱 This is your Vitamins section. You can manage your vitamins intake, check for expiration, and keep a record of your daily supplement routine.`, highlight: "vitamins" },
    { text: "🐱 Here are your Health Products. You can add health products, check their details, and monitor their availability.", highlight: "health" },
    { text: "🐱 The Calendar helps you keep track of all your medications, vitamins, and health product schedules. Plan your intake and never miss a dose!", highlight: "calendar" },
    { text: "🐱 The Pharmacy button lets you explore nearby pharmacies, check availability, and read pharmacy descriptions for easy access to your medicine needs.", highlight: "pharmacy" },
    { text: "🐱 The Expiration button (list icon) shows you all your items that are about to expire today or tomorrow. Quickly check and manage expiring medications, vitamins, or health products to stay safe and organized.", highlight: "expiration" },
    { text: "🐱 Tap the profile icon to open Settings. Here you can manage your account, partner info, and app preferences.", highlight: "profile" },
  ];
  const currentHighlight = tutorialData[tutorialStep]?.highlight;

  const startTutorial = () => setTutorialStep(tutorialStep === 0 ? 1 : 0);
  const nextStep = () => setTutorialStep(tutorialStep < tutorialData.length - 1 ? tutorialStep + 1 : 0);
  const previousStep = () => setTutorialStep(tutorialStep > 1 ? tutorialStep - 1 : 0);

  return (
    <LinearGradient colors={["#f9b3b3", "#e36b6b"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* HEADER */}
        <View style={styles.header}>
          {/* Open Expiration Modal */}
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons
              name="list"
              size={30}
              color={currentHighlight === "expiration" ? "#ffde59" : "#fff"}
              style={{ opacity: tutorialStep > 0 && currentHighlight !== "expiration" ? 0.3 : 1 }}
            />
          </TouchableOpacity>

          <Text style={styles.welcomeText}>Welcome, {fullName}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileAndSettings", { user: route.params.user })}
          >
            <Ionicons
              name="person-circle-outline"
              size={42}
              color={currentHighlight === "profile" ? "#ffde59" : "#fff"}
              style={{ opacity: tutorialStep > 0 && currentHighlight !== "profile" ? 0.3 : 1 }}
            />
          </TouchableOpacity>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentHighlight === "medication" ? "#fff" : "#b3f1f1",
              opacity: tutorialStep > 0 && currentHighlight !== "medication" ? 0.3 : 1 }]}
            onPress={() => navigation.navigate("Medication", { user: route.params.user })}
          >
            <Ionicons name="medkit-outline" size={28} color="#000" />
            <Text style={styles.buttonText}>MEDICATIONS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentHighlight === "vitamins" ? "#fff" : "#b3f1f1",
              opacity: tutorialStep > 0 && currentHighlight !== "vitamins" ? 0.3 : 1 }]}
            onPress={() => navigation.navigate("Vitamins", { user: route.params.user })}
          >
            <Ionicons name="fitness-outline" size={28} color="#000" />
            <Text style={styles.buttonText}>VITAMINS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentHighlight === "health" ? "#fff" : "#b3f1f1",
              opacity: tutorialStep > 0 && currentHighlight !== "health" ? 0.3 : 1 }]}
            onPress={() => navigation.navigate("HealthProducts", { user: route.params.user })}
          >
            <Ionicons name="heart-outline" size={28} color="#000" />
            <Text style={styles.buttonText}>HEALTH PRODUCTS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentHighlight === "calendar" ? "#fff" : "#b3f1f1",
              opacity: tutorialStep > 0 && currentHighlight !== "calendar" ? 0.3 : 1 }]}
            onPress={() => navigation.navigate("Calendar", { user: route.params.user })}
          >
            <Ionicons name="calendar-outline" size={28} color="#000" />
            <Text style={styles.buttonText}>CALENDAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentHighlight === "pharmacy" ? "#fff" : "#b3f1f1",
              opacity: tutorialStep > 0 && currentHighlight !== "pharmacy" ? 0.3 : 1 }]}
            onPress={() => navigation.navigate("Pharmacy", { user: route.params.user })}
          >
            <FontAwesome5 name="prescription-bottle" size={26} color="#000" />
            <Text style={styles.buttonText}>PHARMACY</Text>
          </TouchableOpacity>
        </View>

        {/* CAT + DIALOG */}
        <Animated.View style={[styles.catContainer, { transform: [{ translateY: jumpAnim }] }]}>
          <TouchableOpacity onPress={startTutorial}>
            <Image source={partnerImage} style={styles.catImage} resizeMode="contain" />
          </TouchableOpacity>

          {tutorialStep > 0 && (
            <View style={styles.dialogBubble}>
              <Text style={styles.dialogText}>{tutorialData[tutorialStep].text}</Text>

              <View style={styles.dialogButtonsContainer}>
                {tutorialStep > 1 && (
                  <TouchableOpacity onPress={previousStep} style={[styles.nextButton, styles.previousButton]}>
                    <Text style={styles.nextText}>Previous</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
                  <Text style={styles.nextText}>{tutorialStep < tutorialData.length - 1 ? "Next" : "Finish"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>

        {/* EXPIRATION MODAL */}
        <ExpirationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          items={expiringItems}
          apiBase={API_BASE}
          onDeletedLocal={handleDeletedLocal}
        />

      </SafeAreaView>
    </LinearGradient>
  );
}

/* ------------ STYLES ------------ */
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30 },
  safeArea: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#fff" },

  buttonContainer: { alignItems: "center" },
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: 280, height: 75, borderRadius: 15, marginBottom: 20, elevation: 5 },
  buttonText: { fontSize: 19, fontWeight: "bold", marginLeft: 12, color: "#000" },

  catContainer: { position: "absolute", bottom: 20, right: 20, alignItems: "center" },
  catImage: { width: 150, height: 150 },

  dialogBubble: { position: "absolute", bottom: 160, right: 0, backgroundColor: "#fff", borderRadius: 28, padding: 20, width: 320, borderWidth: 3, borderColor: "#ffb3b3" },
  dialogText: { fontSize: 16, color: "#000" },
  dialogButtonsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  nextButton: { backgroundColor: "#e36b6b", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 14 },
  previousButton: { backgroundColor: "#f3a43f" },
  nextText: { color: "#fff", fontWeight: "bold" },
});
