window.StatusView = (() => {
    const dom = window.AppDom;

    const state = {
        configReady: false,
        runtime: {
            phpState: 'offline',
            caddyState: 'offline'
        }
    };

    function isOnline(status) {
        return status === 'online';
    }

    function isExternal(status) {
        return status === 'external';
    }

    function isBusy(status) {
        return status === 'starting' || status === 'stopping' || status === 'restarting';
    }

    function hasExternalService() {
        return isExternal(state.runtime.phpState) || isExternal(state.runtime.caddyState);
    }

    function hasBusyService() {
        return isBusy(state.runtime.phpState) || isBusy(state.runtime.caddyState);
    }

    function hasManagedServiceOnline() {
        return isOnline(state.runtime.phpState) || isOnline(state.runtime.caddyState);
    }

    function allServicesOffline() {
        return state.runtime.phpState === 'offline' && state.runtime.caddyState === 'offline';
    }

    function renderConfig() {
        const i18n = window.I18nRuntime;

        dom.setupNotice.classList.toggle('hidden', state.configReady);

        dom.configSidebarStatus.classList.toggle('success', state.configReady);
        dom.configSidebarStatus.classList.toggle('warning', !state.configReady);
        dom.configSidebarStatus.textContent = state.configReady
            ? i18n.get('status.ready')
            : i18n.get('status.missing');

        dom.localUrlStatus.classList.toggle('success', state.configReady);
        dom.localUrlStatus.classList.toggle('muted', !state.configReady);
        dom.localUrlStatus.innerHTML = state.configReady
            ? `<span class="dot dot-success"></span><span>${i18n.get('status.ready')}</span>`
            : `<span class="dot dot-muted"></span><span>${i18n.get('status.notReady')}</span>`;
    }

    function renderRuntime() {
        renderSidebarStatus(dom.phpSidebarStatus, state.runtime.phpState);
        renderSidebarStatus(dom.caddySidebarStatus, state.runtime.caddyState);

        renderServiceStatus(dom.phpServiceStatus, state.runtime.phpState);
        renderServiceStatus(dom.caddyServiceStatus, state.runtime.caddyState);

        renderExternalNotice();
        renderControls();
    }

    function renderExternalNotice() {
        dom.externalNotice.classList.toggle('hidden', !hasExternalService());
    }

    function renderControls() {
        const externalDetected = hasExternalService();
        const busy = hasBusyService();
        const managedOnline = hasManagedServiceOnline();
        const offline = allServicesOffline();

        dom.startServices.disabled = externalDetected || busy || !state.configReady || !offline;
        dom.stopServices.disabled = externalDetected || busy || !managedOnline;
        dom.restartServices.disabled = externalDetected || busy || !managedOnline;
        dom.refreshStatus.disabled = busy;

        if (externalDetected) {
            dom.controlsDescription.textContent = window.I18nRuntime.get('controls.externalDescription');
            return;
        }

        if (busy) {
            dom.controlsDescription.textContent = window.I18nRuntime.get('controls.busyDescription');
            return;
        }

        dom.controlsDescription.textContent = window.I18nRuntime.get('controls.description');
    }

    function getStatusViewModel(status) {
        const i18n = window.I18nRuntime;

        const statusMap = {
            online: {
                className: 'success',
                dotClass: 'dot-success',
                label: i18n.get('status.online')
            },
            starting: {
                className: 'warning',
                dotClass: 'dot-warning',
                label: i18n.get('status.starting')
            },
            stopping: {
                className: 'warning',
                dotClass: 'dot-warning',
                label: i18n.get('status.stopping')
            },
            restarting: {
                className: 'warning',
                dotClass: 'dot-warning',
                label: i18n.get('status.restarting')
            },
            external: {
                className: 'warning',
                dotClass: 'dot-warning',
                label: i18n.get('status.external')
            },
            error: {
                className: 'danger',
                dotClass: 'dot-danger',
                label: i18n.get('status.error')
            }
        };

        return statusMap[status] || {
            className: 'danger',
            dotClass: 'dot-danger',
            label: i18n.get('status.offline')
        };
    }

    function renderSidebarStatus(target, status) {
        const view = getStatusViewModel(status);

        target.classList.remove('success', 'warning', 'danger');
        target.classList.add(view.className);
        target.textContent = view.label;
    }

    function renderServiceStatus(target, status) {
        const view = getStatusViewModel(status);

        target.classList.remove('success', 'warning', 'muted', 'danger');
        target.classList.add(view.className);
        target.innerHTML = `<span class="dot ${view.dotClass}"></span><span>${view.label}</span>`;
    }

    function setConfigReady(isReady) {
        state.configReady = Boolean(isReady);
        renderConfig();
        renderControls();
    }

    function setRuntimeStatus(status) {
        state.runtime = {
            phpState: status?.phpState || (status?.php ? 'online' : 'offline'),
            caddyState: status?.caddyState || (status?.caddy ? 'online' : 'offline')
        };

        renderRuntime();
    }

    function refresh() {
        renderConfig();
        renderRuntime();
    }

    function bind() {
        window.manager.onRuntimeStatus((status) => {
            setRuntimeStatus(status);
        });

        window.I18nRuntime.onChange(refresh);
    }

    return {
        bind,
        refresh,
        setConfigReady,
        setRuntimeStatus
    };
})();
