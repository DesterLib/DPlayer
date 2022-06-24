import React, { memo } from "react";

type Props = {
  seconds: number;
  color?: string;
};

function Timer({ seconds, color }: Props) {
  return (
    <div
      style={{
        color: color ? color : "inherit",
      }}
    >
      {seconds}
    </div>
  );
}

export default memo(Timer);
