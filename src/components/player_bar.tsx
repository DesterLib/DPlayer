import React from "react";
import { Paper } from "@mui/material";
import Player from "./player";
import { atom, useRecoilValue } from "recoil";

export type PlayerState = {
  url: string;
  title: string;
  subTitle: string;
  fullscreen: boolean;
  id: string;
  timePos: number;
  size: number;
};

export const playerState = atom({
  key: "playerState",
  default: {
    url: "https://dl5.webmfiles.org/video-h265.mkv",
    title: "Test",
    subTitle: "Test",
    fullscreen: false,
    id: "",
    timePos: 0,
    size: 0,
  },
});

export default function PlayerBar() {
  const state = useRecoilValue<PlayerState | null>(playerState);

  return (
    <div>
      {state && (
        <Paper elevation={0}>
          <Player
            url={state.url}
            title={state.title}
            subTitle={state.subTitle}
            fullscreen={state.fullscreen}
            id={state.id}
            timePos={state.timePos}
            size={state.size}
          />
        </Paper>
      )}
    </div>
  );
}
