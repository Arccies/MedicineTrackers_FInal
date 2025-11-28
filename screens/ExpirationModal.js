// components/ExpirationModal.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

/**
 * Props:
 * - visible (bool)
 * - onClose (fn)
 * - items (array) each item: { _id, name, type, when }
 * - apiBase (string)
 * - onDeletedLocal (fn) callback to remove deleted item locally
 */
export default function ExpirationModal({ visible, onClose, items = [], apiBase, onDeletedLocal }) {
  const slideX = useRef(new Animated.Value(-1)).current; // -1 = offscreen left
  const [isProcessing, setIsProcessing] = useState(null);

  // Animate panel in/out
  useEffect(() => {
    Animated.timing(slideX, {
      toValue: visible ? 0 : -1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // TranslateX for left-side drawer
  const translateX = slideX.interpolate({
    inputRange: [-1, 0],
    outputRange: [-400, 0], // offscreen left to onscreen
  });

  // Delete logic
  const handleDelete = (item) => {
    Alert.alert(
      "Delete Item",
      `Delete ${item.type} "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => confirmDelete(item) },
      ],
      { cancelable: true }
    );
  };

  const confirmDelete = async (item) => {
    if (!apiBase) return;

    const route = item.type.toLowerCase().includes("med") ? "medications" : "vitamins";
    const url = `${apiBase}/${route}/${item._id}`;

    try {
      setIsProcessing(item._id);
      await axios.delete(url);
      setIsProcessing(null);
      onDeletedLocal?.(item._id); // remove from parent state
    } catch (err) {
      setIsProcessing(null);
      console.log("Delete error:", err?.response?.data || err.message);
      Alert.alert("Error", err?.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        {/* LEFT PANEL */}
        <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Expiring Items</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 30 }}>
            {items.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No expiring items found.</Text>
              </View>
            ) : (
              items.map((it) => (
                <View key={it._id} style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemName}>{it.name}</Text>
                    <Text style={styles.itemMeta}>
                      {it.type} • {it.when}
                    </Text>
                  </View>

                  <View style={styles.itemRight}>
                    {isProcessing === it._id ? (
                      <ActivityIndicator />
                    ) : (
                      <TouchableOpacity onPress={() => handleDelete(it)} style={styles.delBtn}>
                        <Ionicons name="trash-outline" size={20} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </Animated.View>

        {/* RIGHT SCRIM (click to close) */}
        <TouchableOpacity style={styles.overlayTouchable} activeOpacity={1} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row", // left panel + right scrim
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  overlayTouchable: {
    flex: 0.3, // right scrim to close
  },
  panel: {
    flex: 0.7, // left drawer width
    backgroundColor: "#fff",
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  panelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  panelTitle: { fontSize: 20, fontWeight: "700", color: "#e36b6b" },
  list: { marginTop: 6 },
  emptyBox: { paddingVertical: 30, alignItems: "center" },
  emptyText: { color: "#666", fontSize: 15 },
  itemRow: { flexDirection: "row", backgroundColor: "#fff6f6", borderRadius: 12, padding: 12, marginBottom: 10, alignItems: "center", justifyContent: "space-between" },
  itemLeft: { flex: 1, paddingRight: 8 },
  itemName: { fontSize: 16, fontWeight: "700", color: "#333" },
  itemMeta: { fontSize: 13, color: "#666", marginTop: 6 },
  itemRight: { width: 44, alignItems: "center", justifyContent: "center" },
  delBtn: { backgroundColor: "#e36b6b", padding: 8, borderRadius: 8 },
});
