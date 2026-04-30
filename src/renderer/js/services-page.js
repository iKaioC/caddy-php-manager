window.ServicesPage = (() => {
    const dom = window.AppDom;

    async function run(action, fallbackLogKey) {
        try {
            const response = await action();

            window.LogsView.append(response?.message || window.I18nRuntime.get(fallbackLogKey));

            if (response?.status) {
                window.StatusView.setRuntimeStatus(response.status);
            }
        } catch (error) {
            window.LogsView.append(`[error] ${error.message}`);
        }
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
                () => window.manager.startServices(),
                'log.startFallback'
            );
        });

        dom.stopServices.addEventListener('click', () => {
            run(
                () => window.manager.stopServices(),
                'log.stopFallback'
            );
        });

        dom.restartServices.addEventListener('click', () => {
            run(
                () => window.manager.restartServices(),
                'log.restartFallback'
            );
        });

        dom.refreshStatus.addEventListener('click', () => {
            loadRuntimeStatus({ log: true });
        });
    }

    return {
        bind,
        loadRuntimeStatus
    };
})();
