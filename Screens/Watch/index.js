import React from "react";
import Watch from "./Watch";

import VideoProvider from "../../Components/Video/Store";

export default function (props) {
  return (
    <VideoProvider>
      <Watch {...props} />
    </VideoProvider>
  );
}
