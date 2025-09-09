import React, { useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Camera, RefreshCcw, Save, Sun, Zap, Repeat } from "lucide-react-native";

export default function App() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [torchOn, setTorchOn] = useState(false);
  const [flashMode, setFlashMode] = useState("off");
  const [photo, setPhoto] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const onToggleFacing = () => setFacing((prev) => (prev === "back" ? "front" : "back"));
  const onToggleTorch = () => setTorchOn((prev) => !prev);
  const cycleFlashMode = () => {
    if (flashMode === "off") setFlashMode("on");
    else if (flashMode === "on") setFlashMode("auto");
    else setFlashMode("off");
  };

  const onTakePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      const result = await cameraRef.current.takePictureAsync();
      setPhoto(result.uri);
    }
  };

  const onSavePhoto = async () => {
    if (photo) {
      await MediaLibrary.saveToLibraryAsync(photo);
      alert("📸 บันทึกลงอัลบั้มแล้ว");
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permissionText}>⚠️ ต้องการสิทธิ์ใช้กล้อง</Text>
        <TouchableOpacity style={styles.allowBtn} onPress={requestPermission}>
          <Text style={styles.allowText}>อนุญาต</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!photo ? (
        <CameraView
          ref={cameraRef}
          style={styles.preview}
          facing={facing}
          enableTorch={torchOn}
          flash={flashMode}
          onCameraReady={() => setIsCameraReady(true)}
        />
      ) : (
        <Image source={{ uri: photo }} style={styles.captured} />
      )}

      {/* ปุ่มควบคุม */}
      {!photo && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={onToggleFacing}>
          <Repeat color="#fff" size={24} />
          </TouchableOpacity>


          <TouchableOpacity
            style={[styles.ctrlBtn, facing !== "back" && styles.disabled]}
            onPress={onToggleTorch}
            disabled={facing !== "back"}
          >
            <Sun color={torchOn ? "#FFD700" : "#fff"} size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.ctrlBtn} onPress={cycleFlashMode}>
            <Zap color={flashMode === "off" ? "#aaa" : "#FFD700"} size={24} />
          </TouchableOpacity>
        </View>
      )}

      {/* ปุ่มถ่ายรูป / ถ่ายใหม่ / บันทึก */}
      <View style={styles.shutterBar}>
        {!photo ? (
          <TouchableOpacity style={styles.shutter} onPress={onTakePicture}>
            <Camera color="#fff" size={36} />
          </TouchableOpacity>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setPhoto(null)}>
              <RefreshCcw color="#fff" size={24} />
              <Text style={styles.btnText}>ถ่ายใหม่</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.btnPrimary]} onPress={onSavePhoto}>
              <Save color="#fff" size={24} />
              <Text style={styles.btnText}>บันทึก</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  permissionText: { fontSize: 16, color: "#fff", marginBottom: 12 },
  allowBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1e90ff",
    borderRadius: 12,
  },
  allowText: { color: "#fff", fontWeight: "600" },

  preview: { flex: 1, borderRadius: 16, overflow: "hidden" },
  captured: { flex: 1, width: "100%" },

  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  ctrlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },

  shutterBar: { padding: 20, alignItems: "center", justifyContent: "center" },
  shutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ff1e35ff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#c6ccd1ff",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#444",
  },
  btnPrimary: { backgroundColor: "#e13358ff" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 6 },
});
