window.SettingsPage = (() => {
    const dom = window.AppDom;

    function getFormSettings() {
        return {
            phpPath: dom.fields.phpPath.value.trim(),
            caddyPath: dom.fields.caddyPath.value.trim(),
            caddyWorkingDirectory: dom.fields.caddyWorkingDirectory.value.trim(),
            phpHost: dom.fields.phpHost.value.trim(),
            phpPort: dom.fields.phpPort.value.trim(),
            localUrl: dom.fields.localUrl.value.trim()
        };
    }

    function setFormSettings(settings) {
        dom.fields.phpPath.value = settings.phpPath || '';
        dom.fields.caddyPath.value = settings.caddyPath || '';
        dom.fields.caddyWorkingDirectory.value = settings.caddyWorkingDirectory || '';
        dom.fields.phpHost.value = settings.phpHost || '127.0.0.1';
        dom.fields.phpPort.value = settings.phpPort || '9000';
        dom.fields.localUrl.value = settings.localUrl || 'http://localhost';

        updateDashboardValues(settings);
    }

    function updateDashboardValues(settings) {
        const phpHost = settings.phpHost || '127.0.0.1';
        const phpPort = settings.phpPort || '9000';

        dom.phpEndpoint.textContent = `${phpHost}:${phpPort}`;
        dom.caddyEndpoint.textContent = settings.caddyWorkingDirectory || 'Caddyfile';
        dom.localUrlDisplay.textContent = settings.localUrl || 'http://localhost';
    }

    function setFeedback(type, title, message, details = []) {
        dom.settingsFeedback.classList.remove('hidden', 'success', 'error', 'warning');
        dom.settingsFeedback.classList.add(type);

        dom.settingsFeedbackTitle.textContent = title;
        dom.settingsFeedbackMessage.innerHTML = '';

        if (message) {
            const paragraph = document.createElement('p');
            paragraph.textContent = message;
            dom.settingsFeedbackMessage.appendChild(paragraph);
        }

        if (Array.isArray(details) && details.length > 0) {
            const list = document.createElement('ul');

            details.forEach((detail) => {
                const item = document.createElement('li');
                item.textContent = detail;
                list.appendChild(item);
            });

            dom.settingsFeedbackMessage.appendChild(list);
        }
    }

    function clearFeedback() {
        dom.settingsFeedback.classList.add('hidden');
        dom.settingsFeedback.classList.remove('success', 'error', 'warning');
        dom.settingsFeedbackTitle.textContent = '';
        dom.settingsFeedbackMessage.innerHTML = '';
    }

    function showResult(result, successTitleKey = 'settingsFeedback.successTitle') {
        const details = [];

        if (Array.isArray(result.errors)) {
            details.push(...result.errors);
        }

        if (result.output) {
            details.push(result.output);
        }

        setFeedback(
            result.ok ? 'success' : 'error',
            result.ok
                ? window.I18nRuntime.get(successTitleKey)
                : window.I18nRuntime.get('settingsFeedback.errorTitle'),
            result.message,
            details
        );
    }

    async function load() {
        const result = await window.manager.loadSettings();

        setFormSettings(result.settings);
        window.StatusView.setConfigReady(result.hasSavedSettings);
        window.LogsView.append(window.I18nRuntime.get('log.settingsLoaded'));
    }

    async function browseFile(field, titleKey) {
        const result = await window.manager.browseFile({
            title: window.I18nRuntime.get(titleKey)
        });

        if (!result.ok || !result.path) {
            return;
        }

        field.value = result.path;
        updateDashboardValues(getFormSettings());
        clearFeedback();
    }

    async function browseDirectory(field, titleKey) {
        const result = await window.manager.browseDirectory({
            title: window.I18nRuntime.get(titleKey)
        });

        if (!result.ok || !result.path) {
            return;
        }

        field.value = result.path;
        updateDashboardValues(getFormSettings());
        clearFeedback();
    }

    async function runSettingsAction(button, loadingKey, action, successTitleKey = 'settingsFeedback.successTitle') {
        const result = await window.ButtonState.run(button, loadingKey, action);

        showResult(result, successTitleKey);

        return result;
    }

    function bind() {
        dom.detectSettings.addEventListener('click', async () => {
            await window.ButtonState.run(dom.detectSettings, 'settings.detecting', async () => {
                const result = await window.manager.detectSettings();

                if (!result.ok) {
                    return;
                }

                setFormSettings(result.settings);

                setFeedback(
                    'warning',
                    window.I18nRuntime.get('settingsFeedback.detectedTitle'),
                    window.I18nRuntime.get('settingsFeedback.detectedMessage')
                );

                window.LogsView.append(window.I18nRuntime.get('log.detectFinished'));
            });
        });

        dom.testSettings.addEventListener('click', async () => {
            const result = await window.ButtonState.run(
                dom.testSettings,
                'settings.testing',
                () => window.manager.testSettings(getFormSettings())
            );

            setFeedback(
                result.ok ? 'success' : 'error',
                result.ok
                    ? window.I18nRuntime.get('settingsFeedback.successTitle')
                    : window.I18nRuntime.get('settingsFeedback.errorTitle'),
                result.ok ? result.message : '',
                result.ok ? [] : result.errors
            );
        });

        dom.saveSettings.addEventListener('click', async () => {
            const result = await window.ButtonState.run(
                dom.saveSettings,
                'settings.saving',
                () => window.manager.saveSettings(getFormSettings())
            );

            setFeedback(
                result.ok ? 'success' : 'error',
                result.ok
                    ? window.I18nRuntime.get('settingsFeedback.savedTitle')
                    : window.I18nRuntime.get('settingsFeedback.errorTitle'),
                result.ok ? result.message : '',
                result.ok ? [] : result.errors
            );

            if (!result.ok) {
                return;
            }

            window.StatusView.setConfigReady(true);
            updateDashboardValues(result.settings);
        });

        dom.openCaddyFolder.addEventListener('click', () => {
            runSettingsAction(
                dom.openCaddyFolder,
                'settings.opening',
                () => window.manager.openCaddyFolder(getFormSettings())
            );
        });

        dom.openSettingsFolder.addEventListener('click', () => {
            runSettingsAction(
                dom.openSettingsFolder,
                'settings.opening',
                () => window.manager.openSettingsFolder()
            );
        });

        dom.openCaddyfile.addEventListener('click', () => {
            runSettingsAction(
                dom.openCaddyfile,
                'settings.opening',
                () => window.manager.openCaddyfile(getFormSettings())
            );
        });

        dom.validateCaddyfile.addEventListener('click', () => {
            runSettingsAction(
                dom.validateCaddyfile,
                'settings.validating',
                () => window.manager.validateCaddyfile(getFormSettings()),
                'settingsFeedback.caddyValidatedTitle'
            );
        });

        dom.formatCaddyfile.addEventListener('click', () => {
            runSettingsAction(
                dom.formatCaddyfile,
                'settings.formatting',
                () => window.manager.formatCaddyfile(getFormSettings()),
                'settingsFeedback.caddyFormattedTitle'
            );
        });

        dom.reloadCaddy.addEventListener('click', () => {
            runSettingsAction(
                dom.reloadCaddy,
                'settings.reloading',
                () => window.manager.reloadCaddy(getFormSettings()),
                'settingsFeedback.caddyReloadedTitle'
            );
        });

        dom.browsePhpPath.addEventListener('click', () => {
            browseFile(dom.fields.phpPath, 'dialog.phpPath');
        });

        dom.browseCaddyPath.addEventListener('click', () => {
            browseFile(dom.fields.caddyPath, 'dialog.caddyPath');
        });

        dom.browseCaddyWorkingDirectory.addEventListener('click', () => {
            browseDirectory(dom.fields.caddyWorkingDirectory, 'dialog.caddyWorkingDirectory');
        });

        Object.values(dom.fields).forEach((field) => {
            field.addEventListener('input', () => {
                updateDashboardValues(getFormSettings());
                clearFeedback();
            });
        });
    }

    return {
        bind,
        load,
        getFormSettings,
        setFormSettings
    };
})();
