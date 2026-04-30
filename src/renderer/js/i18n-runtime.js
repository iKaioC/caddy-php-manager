window.I18nRuntime = (() => {
    const STORAGE_KEY = 'caddyPhpManager.language';
    const listeners = new Set();

    let currentLanguage = localStorage.getItem(STORAGE_KEY) || window.I18N.defaultLanguage;

    function get(key) {
        const fallbackLanguage = window.I18N.defaultLanguage;
        const dictionary = window.I18N.messages[currentLanguage] || window.I18N.messages[fallbackLanguage];

        return dictionary[key] || window.I18N.messages[fallbackLanguage][key] || key;
    }

    function render() {
        document.querySelectorAll('[data-i18n]').forEach((node) => {
            const key = node.getAttribute('data-i18n');
            node.textContent = get(key);
        });

        listeners.forEach((listener) => listener(currentLanguage));
    }

    function setLanguage(language) {
        currentLanguage = window.I18N.messages[language] ? language : window.I18N.defaultLanguage;

        localStorage.setItem(STORAGE_KEY, currentLanguage);
        document.documentElement.lang = currentLanguage;

        if (window.AppDom.languageSelect) {
            window.AppDom.languageSelect.value = currentLanguage;
        }

        render();
    }

    function onChange(listener) {
        listeners.add(listener);

        return () => listeners.delete(listener);
    }

    return {
        get,
        render,
        setLanguage,
        onChange,
        get currentLanguage() {
            return currentLanguage;
        }
    };
})();
