import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { IconButton } from '@mui/material';
import React, { memo } from 'react';

type Props = {
    pause: boolean;
    togglePause: () => void;
    size?: number;
    color?: string;
};

const Play = ({ pause, togglePause, size, color }: Props) => {
    const style = {
        fontSize: size ? size : 'inherit',
        color: color ? color : 'inherit',
    };

    const Button = (pause: boolean) => {
        return pause ? <PlayArrowRoundedIcon style={style} /> : <PauseRoundedIcon style={style} />;
    };

    const handleClick = () => togglePause();

    return (
        <IconButton aria-label='toggle pause' onClick={handleClick}>
            {Button(pause)}
        </IconButton>
    );
};

export default memo(Play);
