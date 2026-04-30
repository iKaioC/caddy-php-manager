window.ServicesPage = (() => {
    const dom = window.AppDom;

    async function run(button, loadingKey, action, fallbackLogKey) {
        await window.ButtonState.run(button, loadingKey, async () => {
            try {
                const response = await action();

                window.LogsView.append(response?.message || window.I18nRuntime.get(fallbackLogKey));

                if (response?.status) {
                    window.StatusView.setRuntimeStatus(response.status);
                }
            } catch (error) {
                window.LogsView.append(`[error] ${error.message}`);
            }
        });

        window.StatusView.refresh();
    }

    async function loadRuntimeStatus(options = {}) {
        const status = await window.manager.getServiceStatus();

        window.StatusView.setRuntimeStatus(status);

        if (options.log) {
            window.LogsView.append(window.I18nRuntime.get('log.statusRefreshed'));
        }
    }

    function bind() {
        dom.startServices.addEventListener('click', () => {
            run(
                dom.startServices,
                'controls.starting',
                () => window.manager.startServices(),
                'log.startFallback'
            );
        });

        dom.stopServices.addEventListener('click', () => {
            run(
                dom.stopServices,
                'controls.stopping',
                () => window.manager.stopServices(),
                'log.stopFallback'
            );
        });

        dom.restartServices.addEventListener('click', () => {
            run(
                dom.restartServices,
                'controls.restarting',
                () => window.manager.restartServices(),
                'log.restartFallback'
            );
        });

        dom.refreshStatus.addEventListener('click', () => {
            run(
                dom.refreshStatus,
                'controls.refreshing',
                () => loadRuntimeStatus({ log: true }),
                'log.statusRefreshed'
            );
        });

        dom.openLocalUrl.addEventListener('click', () => {
            run(
                dom.openLocalUrl,
                'controls.opening',
                () => window.manager.openLocalUrl(window.SettingsPage.getFormSettings()),
                'log.openLocalUrlFallback'
            );
        });
    }

    return {
        bind,
        loadRuntimeStatus
    };
})();
