import React from 'react';
import ReactDOM from 'react-dom/client';

import Player from './components/Player';
import './styles/animation.css';
import './styles/index.css';
import './styles/nprogress.css';
import './styles/seekbar.css';
import './styles/utils.css';

type Props = {
    url: string;
    title?: string;
    subTitle?: string;
    id?: string;
    fullscreen?: boolean;
    timePos?: number;
    size?: number;
    style?: object;
    className?: string;
};

const DPlayer = ({
    url,
    title,
    subTitle,
    id,
    fullscreen,
    timePos,
    size,
    style,
    className,
}: Props) => {
    return (
        <Player
            url={url}
            title={title || ''}
            subTitle={subTitle || ''}
            id={id || ''}
            fullscreen={fullscreen || false}
            timePos={timePos || 0}
            size={size || 0}
            style={style}
            className={className}
        />
    );
};

if (process.env.REACT_APP_ENVIRONMENT === 'electron') {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <DPlayer
            url='https://dl5.webmfiles.org/video-h265.mkv'
            title='Test'
            subTitle='Test2'
            id={''}
            fullscreen={false}
        />,
    );
}

export default DPlayer;
