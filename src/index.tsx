import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import PlayerBar from "./components/player_bar";
import "./styles/index.css";
import "./styles/animation.css";
import "./styles/nprogress.css";
import "./styles/seekbar.css";
import "./styles/utils.css";

const isDev: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const DMPV = () => {
  return (
    <RecoilRoot>
      <PlayerBar />
    </RecoilRoot>
  );
};

if (isDev) {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <DMPV />
  );
}

export default DMPV;
