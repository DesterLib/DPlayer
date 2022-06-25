import React from 'react';

const PLUGIN_MIME_TYPE = 'application/x-mpvjs';

type Props = {
    className?: string;
    style?: object;
    onReady?: (mpv: any) => void;
    onPropertyChange?: (name: string, value: any) => void;
    onMouseDown?: () => void;
};

class MPV extends React.PureComponent<Props> {
    command(cmd, ...args) {
        args = args.map((arg) => arg.toString());
        this._postData('command', [cmd].concat(args));
    }

    property(name, value) {
        const data = { name, value };
        this._postData('set_property', data);
    }

    observe(name) {
        this._postData('observe_property', name);
    }

    keypress({ key, shiftKey, ctrlKey, altKey }) {
        if (['Escape', 'Shift', 'Control', 'Alt', 'Compose', 'CapsLock', 'Meta'].includes(key))
            return;

        if (key.startsWith('Arrow')) {
            key = key.slice(5).toUpperCase();
            if (shiftKey) {
                key = `Shift+${key}`;
            }
        }
        if (ctrlKey) {
            key = `Ctrl+${key}`;
        }
        if (altKey) {
            key = `Alt+${key}`;
        }

        if (
            [
                'q',
                'Q',
                'ESC',
                'POWER',
                'STOP',
                'CLOSE_WIN',
                'CLOSE_WIN',
                'Ctrl+c',
                'AR_PLAY_HOLD',
                'AR_CENTER_HOLD',
            ].includes(key)
        )
            return;

        this.command('keypress', key);
    }

    fullscreen() {
        this.node().webkitRequestFullscreen();
    }

    destroy() {
        this.node().remove();
    }

    node() {
        return this.plugin;
    }

    plugin: any;
    mpv: any;

    constructor(props) {
        super(props);
        this.plugin = null;
    }
    _postData(type, data) {
        const msg = { type, data };
        this.node().postMessage(msg);
    }
    _handleMessage(e) {
        const msg = e.data;
        const { type, data } = msg;
        if (type === 'property_change' && this.props.onPropertyChange) {
            const { name, value } = data;
            this.props.onPropertyChange(name, value);
        } else if (type === 'ready' && this.props.onReady) {
            this.props.onReady(this);
        }
    }
    componentDidMount() {
        this.node().addEventListener('message', this._handleMessage.bind(this));
    }
    render() {
        const defaultStyle = { display: 'block', width: '100%', height: '100%' };
        const props = Object.assign({}, this.props, {
            ref: (el) => {
                this.plugin = el;
            },
            type: PLUGIN_MIME_TYPE,
            style: Object.assign(defaultStyle, this.props.style),
        });
        // eslint-disable-next-line
        const { onReady, onPropertyChange, ...newProps } = props;
        return React.createElement('embed', newProps);
    }
}

export default MPV;
