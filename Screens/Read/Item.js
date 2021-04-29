import React, { useRef, memo } from "react";
import { Dimensions } from "react-native";

import Image from "react-native-scalable-image";

function Item({ item }) {
  return (
    <Image
      source={{
        uri: item,
      }}
      width={Dimensions.get("window").width}
    />
  );
}

export default memo(Item);
