const { execFile } = require('child_process');
const path = require('path');

function runCaddyCommand(settings, args, options = {}) {
    const timeout = options.timeout || 15000;
    const caddyfilePath = path.join(settings.caddyWorkingDirectory, 'Caddyfile');

    return new Promise((resolve) => {
        execFile(
            settings.caddyPath,
            args,
            {
                cwd: settings.caddyWorkingDirectory,
                timeout,
                windowsHide: true
            },
            (error, stdout, stderr) => {
                const output = [stdout, stderr]
                    .filter(Boolean)
                    .join('\n')
                    .trim();

                if (error) {
                    resolve({
                        ok: false,
                        message: options.errorMessage || '[caddy] Command failed.',
                        errors: [output || error.message],
                        output,
                        caddyfilePath
                    });

                    return;
                }

                resolve({
                    ok: true,
                    message: options.successMessage || '[caddy] Command completed successfully.',
                    output,
                    caddyfilePath
                });
            }
        );
    });
}

function validateCaddyfile(settings) {
    const caddyfilePath = path.join(settings.caddyWorkingDirectory, 'Caddyfile');

    return runCaddyCommand(
        settings,
        ['validate', '--config', caddyfilePath],
        {
            successMessage: '[caddy] Caddyfile is valid.',
            errorMessage: '[caddy] Caddyfile validation failed.'
        }
    );
}

function formatCaddyfile(settings) {
    const caddyfilePath = path.join(settings.caddyWorkingDirectory, 'Caddyfile');

    return runCaddyCommand(
        settings,
        ['fmt', '--overwrite', caddyfilePath],
        {
            successMessage: '[caddy] Caddyfile formatted successfully.',
            errorMessage: '[caddy] Caddyfile formatting failed.'
        }
    );
}

function reloadCaddy(settings) {
    const caddyfilePath = path.join(settings.caddyWorkingDirectory, 'Caddyfile');

    return runCaddyCommand(
        settings,
        ['reload', '--config', caddyfilePath],
        {
            successMessage: '[caddy] Caddy reloaded successfully.',
            errorMessage: '[caddy] Caddy reload failed.'
        }
    );
}

module.exports = {
    validateCaddyfile,
    formatCaddyfile,
    reloadCaddy
};
