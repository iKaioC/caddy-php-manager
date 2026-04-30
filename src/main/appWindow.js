const { BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow() {
    const window = new BrowserWindow({
        width: 1080,
        height: 720,
        minWidth: 920,
        minHeight: 620,
        backgroundColor: '#eceff3',
        title: 'Caddy PHP Manager',
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    window.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

    return window;
}

module.exports = {
    createMainWindow
};
