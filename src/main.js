const { app } = require('electron');

const { createMainWindow } = require('./main/appWindow');
const { registerIpcHandlers } = require('./main/ipcHandlers');
const { ServiceManager } = require('./main/serviceManager');

let mainWindow = null;

const serviceManager = new ServiceManager();

app.whenReady().then(() => {
    mainWindow = createMainWindow();

    registerIpcHandlers({
        app,
        getMainWindow: () => mainWindow,
        serviceManager
    });

    serviceManager.on('log', (message) => {
        if (!mainWindow || mainWindow.isDestroyed()) {
            return;
        }

        mainWindow.webContents.send('runtime:log', message);
    });

    serviceManager.on('status', (status) => {
        if (!mainWindow || mainWindow.isDestroyed()) {
            return;
        }

        mainWindow.webContents.send('runtime:status', status);
    });

    app.on('activate', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            return;
        }

        mainWindow = createMainWindow();
    });
});

app.on('before-quit', () => {
    serviceManager.stopAll({ silent: true });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
