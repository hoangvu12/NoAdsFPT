import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Video as ExpoVideo } from "expo-av";
import tailwind from "tailwind-rn";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

import { VideoContext } from "./Store";
import { isEmpty } from "../../utils";

import useOrientation from "../../hooks/useOrientation";

import ControlBar from "./ControlBar";
import TopOverlay from "./TopOverlay";
import OverlayBar from "./OverlayBar";
import Description from "./Description";

export default function Video(props) {
  const {
    episode: [episode, setEpisode],
    isLocked: [isLocked, setIsLocked],
  } = useContext(VideoContext);

  const video = useRef(null);
  const [status, setStatus] = useState({});

  const [showControls, setShowControls] = useState(true);
  const timeoutLeave = useRef(null);

  const orientation = useOrientation();

  useEffect(() => {
    if (orientation === "LANDSCAPE") {
      activateKeepAwake();
      return;
    }

    deactivateKeepAwake();
  }, [orientation]);

  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        const status = await video.current.getStatusAsync();

        setStatus(status);
      } catch (err) {}
    }, 1000);

    return () => clearInterval(interval);
  }, [episode]);

  const handleScreenTouch = useCallback(() => {
    setShowControls(!showControls);

    // If there is timeout, clear it
    if (timeoutLeave.current) {
      clearTimeout(timeoutLeave.current);
    }

    // If user don't click the screen ever again, then hide controls
    timeoutLeave.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <TouchableWithoutFeedback onPressIn={handleScreenTouch}>
        <View
          style={tailwind(
            `relative w-full justify-center items-center ${
              orientation === "LANDSCAPE" ? "h-full" : "h-60"
            }`
          )}
        >
          <ExpoVideo
            shouldPlay={false}
            ref={video}
            style={tailwind("h-full w-full")}
            usePoster
            source={{
              uri: props.source,
              overrideFileExtensionAndroid: "m3u8",
            }}
            resizeMode={ExpoVideo.RESIZE_MODE_COVER}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />

          {!isEmpty(status) && showControls && !isLocked && (
            <View style={[styles.overlay, styles.unlockedOverlay]}>
              <Video.TopOverlay />
              <Video.OverlayBar status={status} video={video} />
              <Video.ControlBar status={status} video={video} />
            </View>
          )}

          {isLocked && (
            <View style={[styles.overlay, styles.lockedOverlay]}>
              <TouchableOpacity onPress={(_) => setIsLocked(!isLocked)}>
                <Entypo
                  name={isLocked ? "lock-open" : "lock"}
                  size={20}
                  color="white"
                  style={tailwind("ml-2")}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

Video.TopOverlay = TopOverlay;
Video.OverlayBar = OverlayBar;
Video.ControlBar = ControlBar;
Video.Description = Description;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#18191A",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  lockedOverlay: {
    alignItems: "flex-start",
  },
  unlockedOverlay: {
    backgroundColor: "rgba(0,0,0,0.51)",
    alignItems: "center",
  },
});
