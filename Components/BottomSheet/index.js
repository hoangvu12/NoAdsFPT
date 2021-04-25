import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import styles from "../../styles";

export const BS = React.forwardRef((props, ref) => {
  const screenHeight = useMemo(() => Dimensions.get("screen").height, []);

  return (
    <RBSheet
      ref={ref}
      animationType="fade"
      height={screenHeight}
      closeOnDragDown={true}
      dragFromTopOnly={true}
      closeOnPressMask={false}
      customStyles={{
        container: {
          ...styles.backgroundColor,
          borderRadius: 20,
        },
        draggableIcon: {
          backgroundColor: "gray",
        },
      }}
      {...props}
    >
      {props.children}
    </RBSheet>
  );
});

export default BS;
