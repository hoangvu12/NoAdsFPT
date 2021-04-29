import React from "react";
import RBSheet from "reanimated-bottom-sheet";

import styles from "../../styles";

export const BS = React.forwardRef((props, ref) => {
  return <RBSheet ref={ref} {...props} />;
});

export default BS;
