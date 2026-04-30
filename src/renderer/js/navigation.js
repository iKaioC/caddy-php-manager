window.Navigation = (() => {
    const dom = window.AppDom;

    function setActivePage(pageName) {
        Object.entries(dom.pages).forEach(([name, page]) => {
            page.classList.toggle('active', name === pageName);
        });

        document.querySelectorAll('.menu-item').forEach((button) => {
            button.classList.toggle('active', button.dataset.pageTarget === pageName);
        });
    }

    function bind() {
        dom.navigationButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const pageName = button.dataset.pageTarget;

                if (!dom.pages[pageName]) {
                    return;
                }

                setActivePage(pageName);
            });
        });

        dom.openSettingsFromNotice.addEventListener('click', () => {
            setActivePage('settings');
            window.LogsView.append(window.I18nRuntime.get('log.settingsOpened'));
        });
    }

    return {
        bind,
        setActivePage
    };
})();
