import * as React from "react";
import { SafeAreaView, View } from "react-native";

import {
  BarcodeScanningResult,
  CameraMode,
  CameraView,
  FlashMode,
} from "expo-camera";
import BottomRowTools from "@/components/BottomRowTools";
import MainRowActions from "@/components/MainRowActions";
import PictureView from "@/components/PictureView";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import CameraTools from "@/components/CameraTools";
import * as WebBrowser from "expo-web-browser";
import QRCodeButton from "@/components/QRCodeButton";
import VideoViewComponent from "@/components/VideoView";

export default function HomeScreen() {
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = React.useState<CameraMode>("picture");
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = React.useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">(
    "back"
  );
  const [cameraZoom, setCameraZoom] = React.useState<number>(0);
  const [picture, setPicture] = React.useState<string>(""); // "https://picsum.photos/seed/696/3000/2000"
  const [video, setVideo] = React.useState<string>(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  ); //  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  const [isBrowsing, setIsBrowsing] = React.useState<boolean>(false);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [qrCodeDetected, setQrCodeDetected] = React.useState<string>("");
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({});
    setPicture(response!.uri);
  }

  async function toggleRecord() {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const response = await cameraRef.current?.recordAsync();
      setVideo(response!.uri);
    }
  }

  async function handleOpenQRCode() {
    setIsBrowsing(true);
    const browserResult = await WebBrowser.openBrowserAsync(qrCodeDetected, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
    });
    if (browserResult.type === "cancel") {
      setIsBrowsing(false);
    }
  }

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (result.data) {
      setQrCodeDetected(result.data);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setQrCodeDetected("");
      }, 1000);
    }
  };

  if (isBrowsing) return <></>;
  if (picture) return <PictureView picture={picture} setPicture={setPicture} />;
  if (video) return <VideoViewComponent video={video} setVideo={setVideo} />;
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={{ flex: 1 }}
    >
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={cameraFacing}
        mode={cameraMode}
        zoom={cameraZoom}
        enableTorch={cameraTorch}
        flash={cameraFlash}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
        onCameraReady={() => console.log("camera is ready")}
      >
        <SafeAreaView style={{ flex: 1, paddingTop: 40 }}>
          <View style={{ flex: 1, padding: 6 }}>
            {qrCodeDetected ? (
              <QRCodeButton handleOpenQRCode={handleOpenQRCode} />
            ) : null}
            <CameraTools
              cameraZoom={cameraZoom}
              cameraFlash={cameraFlash}
              cameraTorch={cameraTorch}
              setCameraZoom={setCameraZoom}
              setCameraFacing={setCameraFacing}
              setCameraTorch={setCameraTorch}
              setCameraFlash={setCameraFlash}
            />
            <MainRowActions
              isRecording={isRecording}
              handleTakePicture={
                cameraMode === "picture" ? handleTakePicture : toggleRecord
              }
              cameraMode={cameraMode}
            />
            <BottomRowTools
              cameraMode={cameraMode}
              setCameraMode={setCameraMode}
            />
          </View>
        </SafeAreaView>
      </CameraView>
    </Animated.View>
  );
}
