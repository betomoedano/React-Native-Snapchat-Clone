import * as React from "react";
import { SymbolView } from "expo-symbols";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Asset, getAlbumsAsync, getAssetsAsync } from "expo-media-library";
import { Image } from "expo-image";
import { CameraMode } from "expo-camera";
import { Colors } from "@/constants/Colors";

interface MainRowActionsProps {
  handleTakePicture: () => void;
  cameraMode: CameraMode;
  isRecording: boolean;
}
export default function MainRowActions({
  cameraMode,
  handleTakePicture,
  isRecording,
}: MainRowActionsProps) {
  const [assets, setAssets] = React.useState<Asset[]>([]);

  React.useEffect(() => {
    getAlbums();
  }, []);

  async function getAlbums() {
    const fetchedAlbums = await getAlbumsAsync();

    // Recents album
    const albumAssets = await getAssetsAsync({
      album: fetchedAlbums.find((album) => album.title === "Recentsd"),
      mediaType: "photo",
      sortBy: "creationTime",
      first: 4,
    });
    setAssets(albumAssets.assets);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={assets}
        inverted
        renderItem={({ item }) => (
          <Image
            key={item.id}
            source={item.uri}
            style={{
              height: 40,
              width: 40,
              borderRadius: 5,
            }}
          />
        )}
        horizontal
        contentContainerStyle={{ gap: 6 }}
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity onPress={handleTakePicture}>
        <SymbolView
          name={
            cameraMode === "picture"
              ? "circle"
              : isRecording
              ? "record.circle"
              : "circle.circle"
          }
          size={90}
          type="hierarchical"
          tintColor={isRecording ? Colors.light.snapPrimary : "white"}
          animationSpec={{
            effect: {
              type: isRecording ? "pulse" : "bounce",
            },
            repeating: isRecording,
          }}
          fallback={
            <TouchableOpacity
              onPress={handleTakePicture}
              style={{
                width: 90,
                height: 90,
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 45,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{cameraMode === "picture" ? "📷" : "🎥"}</Text>
            </TouchableOpacity>
          }
        />
      </TouchableOpacity>
      <ScrollView
        horizontal
        contentContainerStyle={{ gap: 2 }}
        showsHorizontalScrollIndicator={false}
      >
        {[0, 1, 2, 4].map((item) => (
          <SymbolView
            key={item}
            name="face.dashed"
            size={40}
            type="hierarchical"
            tintColor={"white"}
            // fallback={} TODO: Add a fallback for android
          />
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    position: "absolute",
    bottom: 45,
  },
});
