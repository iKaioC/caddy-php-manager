const path = require('path');

const { fileExists, directoryExists } = require('./pathDetector');

function isExpectedExecutable(filePath, expectedFileName) {
    if (!filePath) {
        return false;
    }

    return path.basename(filePath).toLowerCase() === expectedFileName.toLowerCase();
}

function isValidPort(port) {
    const normalizedPort = Number(port);

    return Number.isInteger(normalizedPort)
        && normalizedPort >= 1
        && normalizedPort <= 65535;
}

function isValidLocalUrl(url) {
    if (!url) {
        return false;
    }

    try {
        const parsedUrl = new URL(url);

        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
        return false;
    }
}

function hasCaddyfile(directoryPath) {
    if (!directoryExists(directoryPath)) {
        return false;
    }

    return fileExists(path.join(directoryPath, 'Caddyfile'));
}

function validateSettings(settings) {
    const errors = [];

    if (!settings.phpPath) {
        errors.push('PHP-CGI executable path is required.');
    } else if (!fileExists(settings.phpPath)) {
        errors.push('PHP-CGI executable was not found.');
    } else if (!isExpectedExecutable(settings.phpPath, 'php-cgi.exe')) {
        errors.push('PHP-CGI executable must be named php-cgi.exe.');
    }

    if (!settings.caddyPath) {
        errors.push('Caddy executable path is required.');
    } else if (!fileExists(settings.caddyPath)) {
        errors.push('Caddy executable was not found.');
    } else if (!isExpectedExecutable(settings.caddyPath, 'caddy.exe')) {
        errors.push('Caddy executable must be named caddy.exe.');
    }

    if (!settings.caddyWorkingDirectory) {
        errors.push('Caddy working directory is required.');
    } else if (!directoryExists(settings.caddyWorkingDirectory)) {
        errors.push('Caddy working directory was not found.');
    } else if (!hasCaddyfile(settings.caddyWorkingDirectory)) {
        errors.push('Caddyfile was not found in the selected Caddy working directory.');
    }

    if (!settings.phpHost) {
        errors.push('PHP host is required.');
    }

    if (!settings.phpPort) {
        errors.push('PHP port is required.');
    } else if (!isValidPort(settings.phpPort)) {
        errors.push('PHP port must be a number between 1 and 65535.');
    }

    if (!settings.localUrl) {
        errors.push('Local URL is required.');
    } else if (!isValidLocalUrl(settings.localUrl)) {
        errors.push('Local URL must start with http:// or https://.');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateSettings
};
