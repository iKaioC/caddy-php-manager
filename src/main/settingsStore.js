const fs = require('fs');
const path = require('path');

const { directoryExists, fileExists, detectDefaultSettings } = require('./pathDetector');

class SettingsStore {
    constructor(app) {
        this.app = app;
    }

    getSettingsPath() {
        return path.join(this.app.getPath('userData'), 'settings.json');
    }

    load() {
        const settingsPath = this.getSettingsPath();
        const detectedSettings = detectDefaultSettings();

        if (!fileExists(settingsPath)) {
            return {
                hasSavedSettings: false,
                settings: detectedSettings,
                settingsPath
            };
        }

        try {
            const savedSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

            return {
                hasSavedSettings: true,
                settings: {
                    ...detectedSettings,
                    ...savedSettings
                },
                settingsPath
            };
        } catch {
            return {
                hasSavedSettings: false,
                settings: detectedSettings,
                settingsPath
            };
        }
    }

    save(settings) {
        const settingsPath = this.getSettingsPath();
        const directory = path.dirname(settingsPath);

        if (!directoryExists(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4), 'utf8');

        return {
            hasSavedSettings: true,
            settings,
            settingsPath
        };
    }
}

module.exports = {
    SettingsStore
};
