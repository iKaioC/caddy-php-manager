const { ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');

const { SettingsStore } = require('./settingsStore');
const { validateSettings } = require('./settingsValidator');
const { detectDefaultSettings, directoryExists, fileExists } = require('./pathDetector');
const { validateCaddyfile, formatCaddyfile, reloadCaddy } = require('./caddyTools');

function isValidUrl(url) {
    try {
        const parsedUrl = new URL(url);

        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
        return false;
    }
}

function getCaddyfilePath(settings) {
    return path.join(settings.caddyWorkingDirectory || '', 'Caddyfile');
}

function ensureDirectory(directoryPath) {
    if (!directoryExists(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function validateCaddyActionSettings(settings) {
    const validation = validateSettings(settings);

    if (!validation.valid) {
        return {
            ok: false,
            message: '[caddy] Cannot run action. Settings are missing or invalid.',
            errors: validation.errors
        };
    }

    return {
        ok: true
    };
}

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

    ipcMain.handle('resources:openLocalUrl', async (_event, settings) => {
        if (!isValidUrl(settings.localUrl)) {
            return {
                ok: false,
                message: '[resources] Local URL is invalid.',
                errors: ['Local URL must start with http:// or https://.']
            };
        }

        await shell.openExternal(settings.localUrl);

        return {
            ok: true,
            message: `[resources] Opened local URL: ${settings.localUrl}`
        };
    });

    ipcMain.handle('resources:openCaddyFolder', async (_event, settings) => {
        if (!directoryExists(settings.caddyWorkingDirectory)) {
            return {
                ok: false,
                message: '[resources] Caddy folder was not found.',
                errors: ['Caddy working directory does not exist.']
            };
        }

        const result = await shell.openPath(settings.caddyWorkingDirectory);

        return {
            ok: !result,
            message: result || '[resources] Caddy folder opened.'
        };
    });

    ipcMain.handle('resources:openSettingsFolder', async () => {
        const settingsPath = settingsStore.getSettingsPath();
        const settingsDirectory = path.dirname(settingsPath);

        ensureDirectory(settingsDirectory);

        const result = await shell.openPath(settingsDirectory);

        return {
            ok: !result,
            message: result || '[resources] Settings folder opened.'
        };
    });

    ipcMain.handle('resources:openCaddyfile', async (_event, settings) => {
        const caddyfilePath = getCaddyfilePath(settings);

        if (!fileExists(caddyfilePath)) {
            return {
                ok: false,
                message: '[resources] Caddyfile was not found.',
                errors: ['Caddyfile was not found in the selected Caddy working directory.']
            };
        }

        const result = await shell.openPath(caddyfilePath);

        return {
            ok: !result,
            message: result || '[resources] Caddyfile opened.'
        };
    });

    ipcMain.handle('caddy:validate', async (_event, settings) => {
        const validation = validateCaddyActionSettings(settings);

        if (!validation.ok) {
            return validation;
        }

        return validateCaddyfile(settings);
    });

    ipcMain.handle('caddy:format', async (_event, settings) => {
        const validation = validateCaddyActionSettings(settings);

        if (!validation.ok) {
            return validation;
        }

        return formatCaddyfile(settings);
    });

    ipcMain.handle('caddy:reload', async (_event, settings) => {
        const validation = validateCaddyActionSettings(settings);

        if (!validation.ok) {
            return validation;
        }

        return reloadCaddy(settings);
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
