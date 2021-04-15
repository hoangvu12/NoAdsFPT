import { ToastAndroid, Platform, AlertIOS } from "react-native";

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
