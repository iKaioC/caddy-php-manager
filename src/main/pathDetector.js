const fs = require('fs');
const path = require('path');

function fileExists(filePath) {
    if (!filePath) {
        return false;
    }

    try {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch {
        return false;
    }
}

function directoryExists(directoryPath) {
    if (!directoryPath) {
        return false;
    }

    try {
        return fs.existsSync(directoryPath) && fs.statSync(directoryPath).isDirectory();
    } catch {
        return false;
    }
}

function findExecutableInPath(executableName) {
    const pathEnv = process.env.PATH || '';
    const folders = pathEnv.split(path.delimiter).filter(Boolean);

    for (const folder of folders) {
        const candidate = path.join(folder, executableName);

        if (fileExists(candidate)) {
            return candidate;
        }
    }

    return '';
}

function findPhpCgi() {
    const candidates = [
        'C:\\Program Files\\PHP\\php-8.3.30-nts-Win32-vs16-x64\\php-cgi.exe',
        'C:\\Program Files\\PHP\\php-cgi.exe',
        'C:\\php\\php-cgi.exe',
        findExecutableInPath('php-cgi.exe')
    ];

    for (const candidate of candidates) {
        if (fileExists(candidate)) {
            return candidate;
        }
    }

    const phpRoot = 'C:\\Program Files\\PHP';

    if (!directoryExists(phpRoot)) {
        return '';
    }

    try {
        const folders = fs.readdirSync(phpRoot, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.join(phpRoot, entry.name));

        for (const folder of folders) {
            const candidate = path.join(folder, 'php-cgi.exe');

            if (fileExists(candidate)) {
                return candidate;
            }
        }
    } catch {
        return '';
    }

    return '';
}

function findCaddy() {
    const candidates = [
        'C:\\caddy\\caddy.exe',
        'C:\\Program Files\\Caddy\\caddy.exe',
        findExecutableInPath('caddy.exe')
    ];

    for (const candidate of candidates) {
        if (fileExists(candidate)) {
            return candidate;
        }
    }

    return '';
}

function detectDefaultSettings() {
    const phpPath = findPhpCgi();
    const caddyPath = findCaddy();

    return {
        phpPath,
        caddyPath,
        caddyWorkingDirectory: caddyPath ? path.dirname(caddyPath) : '',
        phpHost: '127.0.0.1',
        phpPort: '9000',
        localUrl: 'http://localhost'
    };
}

module.exports = {
    fileExists,
    directoryExists,
    detectDefaultSettings
};
