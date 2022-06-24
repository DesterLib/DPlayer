import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
const { getPluginEntry } = require("@desterlib/mpv");
import PlayerBar from "./components/player_bar";
import "./styles/index.css";
import "./styles/animation.css";
import "./styles/nprogress.css";
import "./styles/seekbar.css";
import "./styles/utils.css";

const isDev: boolean = process.env.REACT_APP_ENVIRONMENT === "electron";

const DPlayer = () => {
  return (
    <RecoilRoot>
      <PlayerBar />
    </RecoilRoot>
  );
};

if (isDev) {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <DPlayer />
  );
}

export { getPluginEntry };

export default DPlayer;
