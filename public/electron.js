/* eslint-disable */

const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

let os;
switch (process.platform) {
    case 'darwin':
        os = 'mac';
        break;
    case 'win32':
        os = 'win';
        break;
}

const pluginDir = path.join(path.dirname(require.resolve("@desterlib/mpv")), "dist");
if (process.platform !== 'linux') process.chdir(pluginDir);

const getPluginEntry = (pluginDir, pluginName = 'mpv.node') => {
    const containsNonASCII = (str) => {
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                return true;
            }
        }
        return false;
    };
    const PLUGIN_MIME_TYPE = 'application/x-mpv';

    const fullPluginPath = path.join(pluginDir, pluginName);
    console.log(fullPluginPath);
    let pluginPath = path.relative(process.cwd(), fullPluginPath);
    if (path.dirname(pluginPath) === '.') {
        if (process.platform === 'linux') {
            pluginPath = `.${path.sep}${pluginPath}`;
        }
    } else {
        if (process.platform === 'win32') {
            pluginPath = fullPluginPath;
        }
    }
    if (containsNonASCII(pluginPath)) {
        if (containsNonASCII(fullPluginPath)) {
            throw new Error('Non-ASCII plugin path is not supported');
        } else {
            pluginPath = fullPluginPath;
        }
    }
    return `${pluginPath};${PLUGIN_MIME_TYPE}`;
};

app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('register-pepper-plugins', getPluginEntry(pluginDir));

// Create the native browser window.
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: 'DPlayer',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true,
            plugins: true,
        },
    });

    const appURL = app.isPackaged
        ? url.format({
              pathname: path.join(__dirname, 'index.html'),
              protocol: 'file:',
              slashes: true,
          })
        : 'http://localhost:3000';
    mainWindow.loadURL(appURL);

    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }
}

function setupLocalFilesNormalizerProxy() {
    protocol.registerHttpProtocol(
        'file',
        (request, callback) => {
            const url = request.url.substr(8);
            callback({ path: path.normalize(`${__dirname}/${url}`) });
        },
        (error) => {
            if (error) console.error('Failed to register protocol');
        },
    );
}

app.whenReady().then(() => {
    createWindow();
    setupLocalFilesNormalizerProxy();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

const allowedNavigationDestinations = 'https://dester.gq';
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);

        if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
            event.preventDefault();
        }
    });
});
