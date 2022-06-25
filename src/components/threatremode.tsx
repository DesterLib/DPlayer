import AspectRatioRoundedIcon from '@mui/icons-material/AspectRatioRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import { IconButton } from '@mui/material';
import React, { memo } from 'react';

type Props = {
    threatreMode: boolean;
    toggleThreatreMode: () => void;
    color?: string;
};

function ThreatreMode({ threatreMode, toggleThreatreMode, color }: Props) {
    const handleClick = () => toggleThreatreMode();

    const style = { color: color ? color : 'inherit' };

    const Button = (threatreMode: boolean) => {
        return threatreMode ? (
            <FullscreenExitRoundedIcon style={style} />
        ) : (
            <AspectRatioRoundedIcon style={style} />
        );
    };

    return (
        <div>
            <IconButton aria-label='toggle threatre mode' onClick={handleClick}>
                {Button(threatreMode)}
            </IconButton>
        </div>
    );
}

export default memo(ThreatreMode);
