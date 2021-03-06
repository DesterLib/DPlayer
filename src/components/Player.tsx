import Grid from '@mui/material/Grid';
import React from 'react';

import Audio from './Audio';
import Duration from './Duration';
import Fullscreen from './Fullscreen';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import MPV from './MPV';
import Play from './Play';
import { VideoSeekSlider } from './Seekbar';
import Subtitle from './Subtitle';
import Timer from './Timer';
import Volume from './Volume';

type Props = {
    url: string;
    title: string;
    subTitle: string;
    id: string;
    fullscreen: boolean;
    timePos: number;
    size: number;
    style?: object;
    className?: string;
};

type State = {
    pause: boolean;
    'time-pos': number;
    duration: number;
    fullscreen: boolean;
    volume: number;
    active: boolean;
};

class Player extends React.Component<Props, State> {
    mpv: any;
    playerContainerEl: React.RefObject<HTMLDivElement>;
    window: any;
    _isMounted: boolean;
    idleTimer: any;
    constructor(props: Props) {
        super(props);
        this.mpv = null;
        this.idleTimer = null;
        this.state = {
            pause: true,
            'time-pos': this.props.timePos,
            duration: 100,
            fullscreen: this.props.fullscreen,
            volume: 100,
            active: true,
        };
        this.playerContainerEl = React.createRef();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.window = window.electron ? window.remote.getCurrentWindow() : window;
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    shouldComponentUpdate(nextProps: Props) {
        if (this.props.id !== nextProps.id) {
            this.mpv.command('loadfile', this.props.url);
        }
        return true;
    }

    togglePause = () => {
        if (!this.mpv) return;
        this.setState({ pause: !this.state.pause });
        this.mpv.property('pause', !this.state.pause);
    };

    handleMPVReady = (mpv: any) => {
        this.mpv = mpv;
        const observe = mpv.observe.bind(mpv);
        ['pause', 'time-pos', 'duration', 'eof-reached'].forEach(observe);
        this.mpv.property('hwdec', 'auto');
        this.mpv.command('set', 'ao-volume', this.state.volume);
        this.handleEpisodeChange(this.props.id, this.props.subTitle, this.state['time-pos']);
    };

    handlePropertyChange = (name: string, value: any) => {
        switch (name) {
            case 'time-pos':
                this.setState({ 'time-pos': value });
                break;
            case 'pause':
                this.setState({ pause: value });
                break;
            case 'duration':
                this.setState({
                    duration: value,
                });
                if (this.props.timePos) {
                    this.setState({ 'time-pos': this.props.timePos });
                    this.mpv.property('time-pos', this.props.timePos);
                    this.setState({ pause: false });
                    this.mpv.property('pause', false);
                } else {
                    this.setState({ pause: false });
                    this.mpv.property('pause', false);
                }
                break;
            default:
                break;
        }
    };

    toggleFullscreen = () => {
        const node = this.playerContainerEl.current;
        if (!node) return;
        if (this.state.fullscreen) {
            node.className = 'player';
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } else {
            node.className = 'webfullscreen';
            var elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
        }
        this.setState({ fullscreen: !this.state.fullscreen });
    };

    toggleThreatreMode = () => {
        const node = this.playerContainerEl.current;
        if (!node) return;
        if (this.state.fullscreen) {
            node.className = 'player';
        } else {
            node.className = 'webfullscreen';
        }
    };

    handleSeek = (newValue: number) => {
        if (!this.mpv) return;
        const timePos = newValue;
        this.setState({ 'time-pos': timePos });
        this.mpv.property('time-pos', timePos);
    };

    handleEpisodeChange = (id: string, name: string, timePos = 0) => {
        if (!this.mpv) return;
        this.mpv.command('loadfile', this.props.url);
        this.mpv.property('time-pos', timePos);
    };

    handleVolumeChange = (nv: number) => {
        if (!this.mpv) return;
        this.setState({ volume: nv });
        this.mpv.command('set', 'ao-volume', nv);
    };

    cycleSubtitleTrack = () => {
        if (!this.mpv) return;
        this.mpv.command('keypress', 'j');
    };

    cycleAudioTrack = () => {
        if (!this.mpv) return;
        this.mpv.command('keypress', '#');
    };

    handleOnActive = () => {
        this.setState({ active: true });
    };

    handleOnIdle = () => {
        this.setState({ active: false });
    };

    MPVPlayer = () => (
        <div
            style={{
                ...this.props.style,
                width: '100%',
            }}
            className={this.props.className}
        >
            <div
                ref={this.playerContainerEl}
                className='player'
                style={{ cursor: this.state.active ? 'default' : 'none' }}
            >
                <div className='mpv-player'>
                    <MPV
                        style={{
                            width: '100%',
                            aspectRatio: '21/9',
                        }}
                        onReady={this.handleMPVReady}
                        onPropertyChange={this.handlePropertyChange}
                        onMouseDown={this.togglePause}
                    />
                    {this.state.fullscreen && (
                        <div
                            className='controls'
                            style={{
                                opacity: this.state.active || this.state.pause ? 1 : 0,
                            }}
                        >
                            <div className='absolute-center'>
                                <Play
                                    pause={this.state.pause}
                                    togglePause={this.togglePause}
                                    size={100}
                                />
                            </div>
                            <div className='controls-bot-container'>
                                <div className='controls-bot'>
                                    <div>
                                        <Grid
                                            container
                                            direction='row'
                                            sx={{ justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <Volume
                                                value={this.state.volume}
                                                setVolume={this.handleVolumeChange}
                                                color='white'
                                            />
                                            <div
                                                style={{
                                                    margin: '0 auto',
                                                    fontWeight: 'bold',
                                                    width: '70%',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Timer
                                                    seconds={this.state['time-pos']}
                                                    color='white'
                                                />
                                                <div style={{ width: '85%', margin: '0 auto' }}>
                                                    <VideoSeekSlider
                                                        max={this.state.duration}
                                                        currentTime={this.state['time-pos']}
                                                        progress={this.state['time-pos'] + 300}
                                                        onChange={this.handleSeek}
                                                        offset={0}
                                                        secondsPrefix='00:00:'
                                                        minutesPrefix='00:'
                                                        thumbnailURL='.'
                                                    />
                                                </div>
                                                <Duration
                                                    seconds={this.state.duration}
                                                    color='white'
                                                />
                                            </div>
                                            <Audio
                                                cycleAudioTrack={this.cycleAudioTrack}
                                                color='white'
                                            />
                                            <Subtitle
                                                cycleSubtitleTrack={this.cycleSubtitleTrack}
                                                color='white'
                                            />
                                            <Fullscreen
                                                fullscreen={this.state.fullscreen}
                                                toggleFullscreen={this.toggleFullscreen}
                                                color='white'
                                            />
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {!this.state.fullscreen && (
                <div
                    style={{
                        width: '100%',
                        height: 90,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Play pause={this.state.pause} togglePause={this.togglePause} />
                    <Volume value={this.state.volume} setVolume={this.handleVolumeChange} />
                    <div
                        style={{
                            margin: '0 auto',
                            fontWeight: 'bold',
                            width: '70%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Timer seconds={this.state['time-pos']} />
                        <div style={{ width: '85%', margin: '0 auto', textAlign: 'center' }}>
                            <p style={{ margin: 0 }}>{this.props.subTitle}</p>
                            <VideoSeekSlider
                                max={this.state.duration}
                                currentTime={this.state['time-pos']}
                                progress={this.state['time-pos'] + 300}
                                onChange={this.handleSeek}
                                offset={0}
                                secondsPrefix='00:00:'
                                minutesPrefix='00:'
                                thumbnailURL={'.'}
                            />
                            <p style={{ margin: 0 }}>{this.props.title}</p>
                        </div>
                        <Duration seconds={this.state.duration} />
                    </div>
                    <Audio cycleAudioTrack={this.cycleAudioTrack} />
                    <Subtitle cycleSubtitleTrack={this.cycleSubtitleTrack} />
                    <Fullscreen
                        fullscreen={this.state.fullscreen}
                        toggleFullscreen={this.toggleFullscreen}
                    />
                </div>
            )}
        </div>
    );

    render() {
        return this.MPVPlayer();
    }
}

export default Player;
