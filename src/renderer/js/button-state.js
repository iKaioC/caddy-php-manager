window.ButtonState = (() => {
    async function run(button, loadingKey, callback) {
        const originalKey = button.getAttribute('data-i18n');
        const originalText = button.textContent;

        button.disabled = true;
        button.textContent = window.I18nRuntime.get(loadingKey);

        try {
            return await callback();
        } finally {
            button.disabled = false;

            button.textContent = originalKey
                ? window.I18nRuntime.get(originalKey)
                : originalText;
        }
    }

    return {
        run
    };
})();
