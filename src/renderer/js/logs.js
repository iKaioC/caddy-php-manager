window.LogsView = (() => {
    const dom = window.AppDom;

    function append(message) {
        dom.logsOutput.textContent += `\n${message}`;
        dom.logsOutput.scrollTop = dom.logsOutput.scrollHeight;
    }

    function reset() {
        dom.logsOutput.textContent = window.I18nRuntime.get('log.logsCleared');
    }

    function bind() {
        dom.clearLogs.addEventListener('click', reset);

        window.manager.onRuntimeLog((message) => {
            append(message);
        });
    }

    function initialize() {
        dom.logsOutput.textContent = window.I18nRuntime.get('log.appLoaded');
        bind();
    }

    return {
        append,
        reset,
        initialize
    };
})();
