window.AppDom = {
    languageSelect: document.getElementById('languageSelect'),

    pages: {
        dashboard: document.getElementById('dashboardPage'),
        settings: document.getElementById('settingsPage')
    },

    navigationButtons: document.querySelectorAll('[data-page-target]'),

    setupNotice: document.getElementById('setupNotice'),
    openSettingsFromNotice: document.getElementById('openSettingsFromNotice'),

    phpSidebarStatus: document.getElementById('phpSidebarStatus'),
    caddySidebarStatus: document.getElementById('caddySidebarStatus'),
    configSidebarStatus: document.getElementById('configSidebarStatus'),

    phpEndpoint: document.getElementById('phpEndpoint'),
    caddyEndpoint: document.getElementById('caddyEndpoint'),
    localUrlDisplay: document.getElementById('localUrlDisplay'),

    phpServiceStatus: document.getElementById('phpServiceStatus'),
    caddyServiceStatus: document.getElementById('caddyServiceStatus'),
    localUrlStatus: document.getElementById('localUrlStatus'),

    settingsFeedback: document.getElementById('settingsFeedback'),
    settingsFeedbackTitle: document.getElementById('settingsFeedbackTitle'),
    settingsFeedbackMessage: document.getElementById('settingsFeedbackMessage'),

    startServices: document.getElementById('startServices'),
    stopServices: document.getElementById('stopServices'),
    restartServices: document.getElementById('restartServices'),

    detectSettings: document.getElementById('detectSettings'),
    testSettings: document.getElementById('testSettings'),
    saveSettings: document.getElementById('saveSettings'),

    browsePhpPath: document.getElementById('browsePhpPath'),
    browseCaddyPath: document.getElementById('browseCaddyPath'),
    browseCaddyWorkingDirectory: document.getElementById('browseCaddyWorkingDirectory'),

    clearLogs: document.getElementById('clearLogs'),
    logsOutput: document.getElementById('logsOutput'),

    fields: {
        phpPath: document.getElementById('phpPath'),
        caddyPath: document.getElementById('caddyPath'),
        caddyWorkingDirectory: document.getElementById('caddyWorkingDirectory'),
        phpHost: document.getElementById('phpHost'),
        phpPort: document.getElementById('phpPort'),
        localUrl: document.getElementById('localUrl')
    }
};
