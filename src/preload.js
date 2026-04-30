const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('manager', {
    appName: 'Caddy PHP Manager',

    loadSettings: () => ipcRenderer.invoke('settings:load'),
    saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
    testSettings: (settings) => ipcRenderer.invoke('settings:test', settings),
    detectSettings: () => ipcRenderer.invoke('settings:detect'),

    browseFile: (options) => ipcRenderer.invoke('settings:browseFile', options),
    browseDirectory: (options) => ipcRenderer.invoke('settings:browseDirectory', options),

    openLocalUrl: (settings) => ipcRenderer.invoke('resources:openLocalUrl', settings),
    openCaddyFolder: (settings) => ipcRenderer.invoke('resources:openCaddyFolder', settings),
    openSettingsFolder: () => ipcRenderer.invoke('resources:openSettingsFolder'),
    openCaddyfile: (settings) => ipcRenderer.invoke('resources:openCaddyfile', settings),

    validateCaddyfile: (settings) => ipcRenderer.invoke('caddy:validate', settings),
    formatCaddyfile: (settings) => ipcRenderer.invoke('caddy:format', settings),
    reloadCaddy: (settings) => ipcRenderer.invoke('caddy:reload', settings),

    getServiceStatus: () => ipcRenderer.invoke('services:status'),
    startServices: () => ipcRenderer.invoke('services:start'),
    stopServices: () => ipcRenderer.invoke('services:stop'),
    restartServices: () => ipcRenderer.invoke('services:restart'),

    onRuntimeLog: (callback) => {
        ipcRenderer.on('runtime:log', (_event, message) => callback(message));
    },

    onRuntimeStatus: (callback) => {
        ipcRenderer.on('runtime:status', (_event, status) => callback(status));
    }
});
