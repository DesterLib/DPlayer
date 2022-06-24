import React from "react";
import { Paper } from "@mui/material";
import Player from "./player";
import { atom, useRecoilValue } from "recoil";

export type PlayerState = {
  showTitle: string;
  episodeTitle: string;
  fullscreen: boolean;
  episodeId: string;
  timePos: number;
  episodeSize: number;
};

export const playerState = atom({
  key: "playerState",
  default: {
    showTitle: "Test",
    episodeTitle: "Test",
    fullscreen: false,
    episodeId: "",
    timePos: 0,
    episodeSize: 0,
  },
});

export default function PlayerBar() {
  const state = useRecoilValue<PlayerState | null>(playerState);

  return (
    <div>
      {state && (
        <Paper elevation={0}>
          <Player
            showTitle={state.showTitle}
            episodeTitle={state.episodeTitle}
            fullscreen={state.fullscreen}
            episodeId={state.episodeId}
            timePos={state.timePos}
            episodeSize={state.episodeSize}
          />
        </Paper>
      )}
    </div>
  );
}
