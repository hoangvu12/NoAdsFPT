import { ToastAndroid, Platform, AlertIOS, Image } from "react-native";

export function isEmpty(data) {
  if (!data) return false;

  if (Array.isArray(data)) {
    return JSON.stringify(data) === "[]";
  }

  return JSON.stringify(data) === "{}";
}

export function notifyMessage(msg) {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    AlertIOS.alert(msg);
  }
}

export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds
  );
}

export function urlParse(url) {
  const [URL, query] = url.split("?");
  const parts = URL.split("/");

  return {
    hostname: parts[2],
    path: parts.slice(3).join("/"),
    query,
  };
}

export const getImageSize = (url) => {
  return new Promise((resolve, reject) => {
    Image.getSize(url, (width, height) => {
      resolve({ width, height });
    });
  });
};
