async function boot() {
    window.I18nRuntime.setLanguage(window.I18nRuntime.currentLanguage);

    window.LogsView.initialize();
    window.StatusView.bind();
    window.Navigation.bind();
    window.SettingsPage.bind();
    window.ServicesPage.bind();

    await window.SettingsPage.load();
    await window.ServicesPage.loadRuntimeStatus();
}

boot();
