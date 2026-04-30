window.StatusView = (() => {
    const dom = window.AppDom;

    const state = {
        configReady: false,
        runtime: {
            php: false,
            caddy: false
        }
    };

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
        renderSidebarStatus(dom.phpSidebarStatus, state.runtime.php);
        renderSidebarStatus(dom.caddySidebarStatus, state.runtime.caddy);

        renderServiceStatus(dom.phpServiceStatus, state.runtime.php);
        renderServiceStatus(dom.caddyServiceStatus, state.runtime.caddy);
    }

    function renderSidebarStatus(target, isOnline) {
        const i18n = window.I18nRuntime;

        target.classList.toggle('success', isOnline);
        target.classList.toggle('danger', !isOnline);
        target.textContent = isOnline
            ? i18n.get('status.online')
            : i18n.get('status.offline');
    }

    function renderServiceStatus(target, isOnline) {
        const i18n = window.I18nRuntime;

        target.classList.toggle('success', isOnline);
        target.classList.toggle('muted', !isOnline);
        target.innerHTML = isOnline
            ? `<span class="dot dot-success"></span><span>${i18n.get('status.online')}</span>`
            : `<span class="dot dot-danger"></span><span>${i18n.get('status.offline')}</span>`;
    }

    function setConfigReady(isReady) {
        state.configReady = Boolean(isReady);
        renderConfig();
    }

    function setRuntimeStatus(status) {
        state.runtime = {
            php: Boolean(status?.php),
            caddy: Boolean(status?.caddy)
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
