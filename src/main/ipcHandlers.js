const { ipcMain, dialog } = require('electron');

const { SettingsStore } = require('./settingsStore');
const { validateSettings } = require('./settingsValidator');
const { detectDefaultSettings } = require('./pathDetector');

function registerIpcHandlers({ app, getMainWindow, serviceManager }) {
    const settingsStore = new SettingsStore(app);

    ipcMain.handle('settings:load', async () => {
        return settingsStore.load();
    });

    ipcMain.handle('settings:save', async (_event, settings) => {
        const validation = validateSettings(settings);

        if (!validation.valid) {
            return {
                ok: false,
                message: '[settings] Could not save settings. Please check the fields.',
                errors: validation.errors
            };
        }

        const result = settingsStore.save(settings);

        return {
            ok: true,
            message: `[settings] Settings saved at ${result.settingsPath}`,
            ...result
        };
    });

    ipcMain.handle('settings:test', async (_event, settings) => {
        const validation = validateSettings(settings);

        return {
            ok: validation.valid,
            message: validation.valid
                ? '[settings] All paths are valid.'
                : `[settings] ${validation.errors.join(' ')}`,
            errors: validation.errors
        };
    });

    ipcMain.handle('settings:detect', async () => {
        return {
            ok: true,
            settings: detectDefaultSettings()
        };
    });

    ipcMain.handle('settings:browseFile', async (_event, options = {}) => {
        const result = await dialog.showOpenDialog(getMainWindow(), {
            title: options.title || 'Select executable',
            properties: ['openFile'],
            filters: [
                { name: 'Executable files', extensions: ['exe'] },
                { name: 'All files', extensions: ['*'] }
            ]
        });

        if (result.canceled || !result.filePaths.length) {
            return {
                ok: false,
                path: ''
            };
        }

        return {
            ok: true,
            path: result.filePaths[0]
        };
    });

    ipcMain.handle('settings:browseDirectory', async (_event, options = {}) => {
        const result = await dialog.showOpenDialog(getMainWindow(), {
            title: options.title || 'Select directory',
            properties: ['openDirectory']
        });

        if (result.canceled || !result.filePaths.length) {
            return {
                ok: false,
                path: ''
            };
        }

        return {
            ok: true,
            path: result.filePaths[0]
        };
    });

    ipcMain.handle('services:status', async () => {
        const loaded = settingsStore.load();

        return serviceManager.getStatus(
            loaded.hasSavedSettings ? loaded.settings : null
        );
    });

    ipcMain.handle('services:start', async () => {
        const loaded = settingsStore.load();

        if (!loaded.hasSavedSettings) {
            return {
                ok: false,
                message: '[services] Cannot start. Save your settings first.',
                status: await serviceManager.getStatus()
            };
        }

        const validation = validateSettings(loaded.settings);

        if (!validation.valid) {
            return {
                ok: false,
                message: '[services] Cannot start. Settings are missing or invalid.',
                errors: validation.errors,
                status: await serviceManager.getStatus(loaded.settings)
            };
        }

        return serviceManager.start(loaded.settings);
    });

    ipcMain.handle('services:stop', async () => {
        return serviceManager.stopAll();
    });

    ipcMain.handle('services:restart', async () => {
        const loaded = settingsStore.load();

        if (!loaded.hasSavedSettings) {
            return {
                ok: false,
                message: '[services] Cannot restart. Save your settings first.',
                status: await serviceManager.getStatus()
            };
        }

        const validation = validateSettings(loaded.settings);

        if (!validation.valid) {
            return {
                ok: false,
                message: '[services] Cannot restart. Settings are missing or invalid.',
                errors: validation.errors,
                status: await serviceManager.getStatus(loaded.settings)
            };
        }

        return serviceManager.restart(loaded.settings);
    });
}

module.exports = {
    registerIpcHandlers
};
