import { Image } from "expo-image";
import { Alert, View } from "react-native";
import IconButton from "./IconButton";
import { shareAsync } from "expo-sharing";
import { saveToLibraryAsync } from "expo-media-library";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}
export default function PictureView({ picture, setPicture }: PictureViewProps) {
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <View
        style={{
          position: "absolute",
          right: 6,
          zIndex: 1,
          paddingTop: 50,
          gap: 16,
        }}
      >
        <IconButton
          onPress={async () => {
            saveToLibraryAsync(picture);
            Alert.alert("✅ Picture saved!");
          }}
          iosName={"arrow.down"}
          androidName="close"
        />
        <IconButton
          onPress={() => setPicture("")}
          iosName={"square.dashed"}
          androidName="close"
        />
        <IconButton
          onPress={() => setPicture("")}
          iosName={"circle.dashed"}
          androidName="close"
        />
        <IconButton
          onPress={() => setPicture("")}
          iosName={"triangle"}
          androidName="close"
        />
        <IconButton
          onPress={async () => await shareAsync(picture)}
          iosName={"square.and.arrow.up"}
          androidName="close"
        />
      </View>

      <View
        style={{
          position: "absolute",
          zIndex: 1,
          paddingTop: 50,
          left: 6,
        }}
      >
        <IconButton
          onPress={() => setPicture("")}
          iosName={"xmark"}
          androidName="close"
        />
      </View>
      <Image
        source={picture}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 5,
        }}
      />
    </Animated.View>
  );
}
