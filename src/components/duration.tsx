import React, { memo } from 'react';

type Props = {
    seconds: number;
    color?: string;
};

const humanTimePos = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8).replace('00:', '');
};

const Duration = ({ seconds, color }: Props) => {
    return <div style={{ color: color ? color : 'inherit' }}>{humanTimePos(seconds)}</div>;
};

export default memo(Duration);
