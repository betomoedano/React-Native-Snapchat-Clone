import { useEffect, useRef, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { Alert, Button, View } from "react-native";
import IconButton from "./IconButton";
import { shareAsync } from "expo-sharing";
import { saveToLibraryAsync } from "expo-media-library";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

interface VideoViewProps {
  video: string;
  setVideo: React.Dispatch<React.SetStateAction<string>>;
}
export default function VideoViewComponent({
  video,
  setVideo,
}: VideoViewProps) {
  const ref = useRef<VideoView>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

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
          paddingTop: 100,
          gap: 16,
        }}
      >
        <IconButton
          onPress={() => setVideo("")}
          iosName={"xmark"}
          androidName="close"
        />
        <IconButton
          onPress={async () => {
            saveToLibraryAsync(video);
            Alert.alert("✅ video saved!");
          }}
          iosName={"arrow.down"}
          androidName="close"
        />
        <IconButton
          onPress={async () => await shareAsync(video)}
          iosName={"square.and.arrow.up"}
          androidName="close"
        />
        <IconButton
          iosName={isPlaying ? "pause" : "play"}
          androidName={isPlaying ? "pause" : "play"}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
            setIsPlaying(!isPlaying);
          }}
        />
      </View>
      <VideoView
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
        }}
        player={player}
        allowsFullscreen
        nativeControls={true}
      />
    </Animated.View>
  );
}
