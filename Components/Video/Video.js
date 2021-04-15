import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import tailwind from "tailwind-rn";
import Slider from "@react-native-community/slider";

import { millisToMinutesAndSeconds } from "../../utils";

import Description from "./Description";

import {
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { isEmpty } from "../../utils";

export default function VideoComponent(props) {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [timeoutLeave, setTimeoutLeave] = useState(false);
  const [orientationIsLandscape, setOrientationIsLandscape] = useState(false);

  useEffect(() => {
    const getStatus = async () => {
      const status = await video.current.getStatusAsync();

      setStatus(status);
    };

    getStatus();
  }, []);

  const handleScreenTouch = () => {
    setShowControls(!showControls);

    // If there is timeout, clear it
    if (timeoutLeave) {
      clearTimeout(timeoutLeave);
    }

    // If user don't click the screen ever again, then hide controls
    setTimeoutLeave(
      setTimeout(() => {
        setShowControls(false);
      }, 3000)
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPressIn={handleScreenTouch}>
        <View
          style={tailwind("relative h-60 w-full justify-center items-center")}
        >
          <Video
            shouldPlay
            ref={video}
            style={tailwind("h-full w-full")}
            usePoster
            source={{
              uri: props.source,
              overrideFileExtensionAndroid: "m3u8",
            }}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            onFullscreenUpdate={async (_) => {
              await ScreenOrientation.lockAsync(
                orientationIsLandscape
                  ? ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
                  : ScreenOrientation.OrientationLock.PORTRAIT
              );

              setOrientationIsLandscape(!orientationIsLandscape);
            }}
            onPlaybackStatusUpdate={(status) => {
              setStatus(() => status);
            }}
          />

          {!isEmpty(status) && showControls && !isLocked && (
            <>
              <VideoComponent.OverlayBar status={status} video={video} />
              <VideoComponent.ControlBar
                status={status}
                video={video}
                isLocked={isLocked}
                setIsLocked={setIsLocked}
                orientationIsLandscape={orientationIsLandscape}
                setOrientationIsLandscape={setOrientationIsLandscape}
              />
            </>
          )}

          {isLocked && (
            <View
              style={[
                styles.controlsContainer,
                { justifyContent: "flex-start" },
              ]}
            >
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

VideoComponent.OverlayBar = (props) => {
  const { status, video } = props;

  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity>
        <MaterialCommunityIcons name="rewind" size={40} color="white" />
      </TouchableOpacity>

      <TouchableOpacity>
        <MaterialIcons name="replay" size={40} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          status.isPlaying
            ? video.current.pauseAsync()
            : video.current.playAsync()
        }
      >
        <MaterialIcons
          name={status.isPlaying ? "pause" : "play-arrow"}
          size={40}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <MaterialIcons
          name="replay"
          size={40}
          color="white"
          style={{ transform: [{ rotateY: "180deg" }] }}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Entypo name="controller-fast-forward" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

VideoComponent.ControlBar = (props) => {
  const {
    status,
    video,
    isLocked,
    setIsLocked,
    orientationIsLandscape,
    setOrientationIsLandscape,
  } = props;

  const handleSlideDrag = async (value) => {
    await video.current.setPositionAsync(value);
    video.current.playAsync();
  };

  return (
    <View style={styles.controlBar}>
      <TouchableOpacity onPress={(_) => setIsLocked(!isLocked)}>
        <Entypo
          name={isLocked ? "lock-open" : "lock"}
          size={20}
          color="white"
          style={tailwind("ml-2")}
        />
      </TouchableOpacity>

      <Text style={tailwind("text-white")}>
        {millisToMinutesAndSeconds(status.positionMillis)}
      </Text>

      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={status.durationMillis}
        value={status.positionMillis}
        minimumTrackTintColor="#FF6500"
        maximumTrackTintColor="#fff"
        thumbTintColor="#FF6500"
        onValueChange={handleSlideDrag}
      />

      <Text style={tailwind("text-white")}>
        {millisToMinutesAndSeconds(
          status.durationMillis - status.positionMillis
        )}
      </Text>

      <TouchableOpacity
        onPress={async () => {
          if (orientationIsLandscape) {
            await video.current.dismissFullscreenPlayer();
          } else {
            await video.current.presentFullscreenPlayer();
          }
        }}
      >
        <MaterialCommunityIcons name="fullscreen" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

VideoComponent.Description = Description;

const styles = StyleSheet.create({
  container: {
    // ...tailwind("h-full w-full"),
    backgroundColor: "#18191A",
    // flex: 1,
  },
  controlsContainer: {
    ...tailwind("w-full"),
    flexDirection: "row",
    justifyContent: "space-evenly",
    position: "absolute",
    alignItems: "center",
  },

  controlBar: {
    ...tailwind("w-full bottom-0"),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    position: "absolute",
  },
});
