import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export default function useOrientation() {
  const [orientation, setOrientation] = useState("PORTRAIT");

  Dimensions.addEventListener("change", ({ window: { width, height } }) => {
    if (width < height) {
      setOrientation("PORTRAIT");
    } else {
      setOrientation("LANDSCAPE");
    }
  });

  return orientation;
}
