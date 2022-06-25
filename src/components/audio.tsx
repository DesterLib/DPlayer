import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded';
import { IconButton } from '@mui/material';
import React, { memo } from 'react';

type Props = {
    cycleAudioTrack: () => void;
    color?: string;
};

function Audio({ cycleAudioTrack, color }: Props) {
    const handleClick = () => cycleAudioTrack();

    return (
        <IconButton aria-label='cycle audio track' onClick={handleClick}>
            <AudiotrackRoundedIcon style={{ color: color ? color : 'inherit' }} />
        </IconButton>
    );
}

export default memo(Audio);
