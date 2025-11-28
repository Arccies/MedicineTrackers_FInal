// screens/Calendar.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

export default function CalendarScreen({ navigation, route }) {
  const userId = route.params?.user?._id;
  const API_BASE = "http://192.168.68.110:5000/api";

  const [items, setItems] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (userId) fetchItems();
  }, [userId]);

  const fetchItems = async () => {
    try {
      const [vitRes, medRes] = await Promise.all([
        axios.get(`${API_BASE}/vitamins/${userId}`),
        axios.get(`${API_BASE}/medications/user/${userId}`),
      ]);

      const allItems = [];

      vitRes.data.forEach((v) => {
        if (v.expirationDate) allItems.push({ ...v, type: "Vitamin", name: v.selectedName || v.name });
      });

      medRes.data.forEach((m) => {
        if (m.expirationDate) allItems.push({ ...m, type: "Medication", name: m.selectedName || m.name });
      });

      setItems(allItems);

      const dots = {};
      const formatDate = (iso) => {
        const date = new Date(iso);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };

      allItems.forEach((item) => {
        const date = formatDate(item.expirationDate);
        if (!dots[date]) dots[date] = { dots: [] };
        dots[date].dots.push({
          color: item.type === "Vitamin" ? "#e36b6b" : "#3b82f6",
        });
      });

      setMarkedDates(dots);
    } catch (err) {
      console.log("Error fetching items:", err.message);
    }
  };

  const itemsForSelectedDate = () => {
    if (!selectedDate) return [];
    return items.filter(
      (item) =>
        new Date(item.expirationDate).toDateString() ===
        new Date(selectedDate).toDateString()
    );
  };

  return (
    <LinearGradient colors={["#f9b3b3", "#e36b6b"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Calendar</Text>
          <View style={{ width: 28 }} /> {/* placeholder */}
        </View>

        {/* Calendar container */}
        <View style={styles.calendarContainer}>
          <Calendar
            markingType={"multi-dot"}
            markedDates={{
              ...markedDates,
              [new Date().toISOString().split("T")[0]]: {
                ...(markedDates[new Date().toISOString().split("T")[0]] || {}),
                selected: true,
                selectedColor: "#f9b3b3",
              },
            }}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              calendarBackground: "#fff",
              todayTextColor: "#e36b6b",
              dayTextColor: "#333",
              selectedDayBackgroundColor: "#e36b6b",
              selectedDayTextColor: "#fff",
              dotColor: "#e36b6b",
              selectedDotColor: "#fff",
              arrowColor: "#e36b6b",
              monthTextColor: "#333",
              textDisabledColor: "#999",
            }}
          />
        </View>

        {/* Items List */}
        <View style={styles.listContainer}>
          {selectedDate && itemsForSelectedDate().length > 0 ? (
            <FlatList
              data={itemsForSelectedDate()}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: item.type === "Vitamin" ? "#e36b6b" : "#3b82f6" },
                    ]}
                  />
                  <Text style={styles.itemText}>
                    {item.name} ({item.type})
                  </Text>
                </View>
              )}
            />
          ) : selectedDate ? (
            <Text style={styles.noItemText}>No items expire on this date.</Text>
          ) : (
            <Text style={styles.noItemText}>Select a date to see items.</Text>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 15,
    padding: 10,
    elevation: 5,
  },
  listContainer: { flex: 1, marginTop: 15, paddingHorizontal: 15 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  itemText: { fontSize: 16, fontWeight: "600", color: "#333" },
  noItemText: { fontSize: 16, fontStyle: "italic", color: "#555", textAlign: "center", marginTop: 20 },
});
