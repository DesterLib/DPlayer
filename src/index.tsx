import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
const { getPluginEntry } = require("@desterlib/mpv");
import Player from "./components/player";
import "./styles/index.css";
import "./styles/animation.css";
import "./styles/nprogress.css";
import "./styles/seekbar.css";
import "./styles/utils.css";

type Props = {
  url: string;
  title?: string;
  subTitle?: string;
  id?: string;
  fullscreen?: boolean;
  timePos?: number;
  size?: number;
};

const DPlayer = ({
  url,
  title,
  subTitle,
  id,
  fullscreen,
  timePos,
  size,
}: Props) => {
  return (
    <RecoilRoot>
      <Player
        url={url}
        title={title || ""}
        subTitle={subTitle || ""}
        id={id || ""}
        fullscreen={fullscreen || false}
        timePos={timePos || 0}
        size={size || 0}
      />
    </RecoilRoot>
  );
};

if (process.env.REACT_APP_ENVIRONMENT === "electron") {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <DPlayer url="https://dl5.webmfiles.org/video-h265.mkv" title="Test" subTitle="Test2" id={""} fullscreen={false} />
  );
}

export { getPluginEntry };

export default DPlayer;
