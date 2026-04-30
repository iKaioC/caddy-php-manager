const fs = require('fs');
const net = require('net');
const path = require('path');

function normalizeHost(host) {
    if (!host || host === '0.0.0.0') {
        return '127.0.0.1';
    }

    return host;
}

function isValidPort(port) {
    const value = Number(port);

    return Number.isInteger(value) && value >= 1 && value <= 65535;
}

function isPortOpen(host, port, timeout = 450) {
    return new Promise((resolve) => {
        if (!isValidPort(port)) {
            resolve(false);
            return;
        }

        const socket = new net.Socket();
        let settled = false;

        const finish = (isOpen) => {
            if (settled) {
                return;
            }

            settled = true;
            socket.destroy();
            resolve(isOpen);
        };

        socket.setTimeout(timeout);
        socket.once('connect', () => finish(true));
        socket.once('timeout', () => finish(false));
        socket.once('error', () => finish(false));

        socket.connect(Number(port), normalizeHost(host));
    });
}

function readCaddyfile(workingDirectory) {
    if (!workingDirectory) {
        return '';
    }

    const caddyfilePath = path.join(workingDirectory, 'Caddyfile');

    try {
        return fs.readFileSync(caddyfilePath, 'utf8');
    } catch {
        return '';
    }
}

function stripCaddyfileComments(content) {
    return content
        .split('\n')
        .map((line) => {
            const commentIndex = line.indexOf('#');

            if (commentIndex === -1) {
                return line;
            }

            return line.slice(0, commentIndex);
        })
        .join('\n');
}

function addPort(ports, port) {
    const value = Number(port);

    if (isValidPort(value)) {
        ports.add(value);
    }
}

function detectCaddyPorts(workingDirectory) {
    const rawContent = readCaddyfile(workingDirectory);

    if (!rawContent) {
        return [];
    }

    const content = stripCaddyfileComments(rawContent);
    const ports = new Set();

    const urlMatches = content.matchAll(/\b(https?):\/\/[^\s,{]+/gi);

    for (const match of urlMatches) {
        try {
            const url = new URL(match[0]);

            if (url.port) {
                addPort(ports, url.port);
                continue;
            }

            addPort(ports, url.protocol === 'https:' ? 443 : 80);
        } catch {
            // Ignore invalid Caddyfile tokens.
        }
    }

    const hostPortMatches = content.matchAll(/(?:^|[\s,{])(?:\*|[a-zA-Z0-9.-]+):(\d{1,5})(?=$|[\s,{])/gm);

    for (const match of hostPortMatches) {
        addPort(ports, match[1]);
    }

    const plainPortMatches = content.matchAll(/(?:^|[\s,{]):(\d{1,5})(?=$|[\s,{])/gm);

    for (const match of plainPortMatches) {
        addPort(ports, match[1]);
    }

    return [...ports];
}

async function findOpenPorts(host, ports) {
    const openPorts = [];

    for (const port of ports) {
        const isOpen = await isPortOpen(host, port);

        if (isOpen) {
            openPorts.push(port);
        }
    }

    return openPorts;
}

module.exports = {
    isPortOpen,
    detectCaddyPorts,
    findOpenPorts
};
