import ClosedCaptionRoundedIcon from '@mui/icons-material/ClosedCaptionRounded';
import { IconButton } from '@mui/material';
import React, { memo } from 'react';

type Props = {
    cycleSubtitleTrack: () => void;
    color?: string;
};

const Subtitle = ({ cycleSubtitleTrack, color }: Props) => {
    const handleClick = () => cycleSubtitleTrack();

    return (
        <IconButton aria-label='cycle subtitle track' onClick={handleClick}>
            <ClosedCaptionRoundedIcon style={{ color: color ? color : 'inherit' }} />
        </IconButton>
    );
};

export default memo(Subtitle);
