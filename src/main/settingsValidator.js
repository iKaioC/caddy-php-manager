const { fileExists, directoryExists } = require('./pathDetector');

function validateSettings(settings) {
    const errors = [];

    if (!fileExists(settings.phpPath)) {
        errors.push('PHP-CGI executable was not found.');
    }

    if (!fileExists(settings.caddyPath)) {
        errors.push('Caddy executable was not found.');
    }

    if (!directoryExists(settings.caddyWorkingDirectory)) {
        errors.push('Caddy working directory was not found.');
    }

    if (!settings.phpHost) {
        errors.push('PHP host is required.');
    }

    if (!settings.phpPort) {
        errors.push('PHP port is required.');
    }

    if (!settings.localUrl) {
        errors.push('Local URL is required.');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateSettings
};
