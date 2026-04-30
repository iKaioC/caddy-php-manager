const { EventEmitter } = require('events');
const { spawn } = require('child_process');

const { isPortOpen, detectCaddyPorts, findOpenPorts } = require('./portUtils');

class ServiceManager extends EventEmitter {
    constructor() {
        super();

        this.phpProcess = null;
        this.caddyProcess = null;
    }

    getInternalStatus() {
        return {
            php: Boolean(this.phpProcess),
            caddy: Boolean(this.caddyProcess),
            phpState: this.phpProcess ? 'online' : 'offline',
            caddyState: this.caddyProcess ? 'online' : 'offline'
        };
    }

    async getStatus(settings = null) {
        const status = this.getInternalStatus();

        if (!settings) {
            return status;
        }

        if (!this.phpProcess && await isPortOpen(settings.phpHost, settings.phpPort)) {
            status.phpState = 'external';
        }

        if (!this.caddyProcess) {
            const caddyPorts = detectCaddyPorts(settings.caddyWorkingDirectory);
            const openCaddyPorts = await findOpenPorts('127.0.0.1', caddyPorts);

            if (openCaddyPorts.length > 0) {
                status.caddyState = 'external';
            }
        }

        return status;
    }

    emitStatus(status = null) {
        this.emit('status', status || this.getInternalStatus());
    }

    emitLog(message) {
        this.emit('log', message);
    }

    async start(settings) {
        const conflict = await this.getStartupConflict(settings);

        if (conflict.hasConflict) {
            this.emitStatus(conflict.status);

            return {
                ok: false,
                message: conflict.message,
                errors: conflict.errors,
                status: conflict.status
            };
        }

        this.startPhp(settings);
        this.startCaddy(settings);

        const status = this.getInternalStatus();
        this.emitStatus(status);

        return {
            ok: true,
            message: '[services] Services started.',
            status
        };
    }

    async getStartupConflict(settings) {
        const errors = [];
        const status = this.getInternalStatus();

        if (!this.phpProcess && await isPortOpen(settings.phpHost, settings.phpPort)) {
            status.phpState = 'external';

            errors.push(`PHP-CGI port ${settings.phpPort} is already in use.`);
        }

        if (!this.caddyProcess) {
            const caddyPorts = detectCaddyPorts(settings.caddyWorkingDirectory);

            if (caddyPorts.length === 0) {
                errors.push('No Caddy ports could be detected from the selected Caddyfile.');
            } else {
                const openCaddyPorts = await findOpenPorts('127.0.0.1', caddyPorts);

                if (openCaddyPorts.length > 0) {
                    status.caddyState = 'external';

                    errors.push(`Caddy port ${openCaddyPorts.join(', ')} is already in use.`);
                }
            }
        }

        return {
            hasConflict: errors.length > 0,
            errors,
            status,
            message: errors.length > 0
                ? `[services] Cannot start. ${errors.join(' ')}`
                : ''
        };
    }

    startPhp(settings) {
        if (this.phpProcess) {
            this.emitLog('[php] PHP-CGI is already running.');
            return;
        }

        const endpoint = `${settings.phpHost}:${settings.phpPort}`;

        this.phpProcess = spawn(settings.phpPath, ['-b', endpoint], {
            windowsHide: true
        });

        this.phpProcess.stdout.on('data', (data) => {
            this.forwardProcessOutput('php', data);
        });

        this.phpProcess.stderr.on('data', (data) => {
            this.forwardProcessOutput('php:error', data);
        });

        this.phpProcess.on('exit', (code) => {
            this.emitLog(`[php] PHP-CGI stopped with code ${code}.`);
            this.phpProcess = null;
            this.emitStatus();
        });

        this.emitLog(`[php] PHP-CGI started on ${endpoint}.`);
    }

    startCaddy(settings) {
        if (this.caddyProcess) {
            this.emitLog('[caddy] Caddy is already running.');
            return;
        }

        this.caddyProcess = spawn(settings.caddyPath, ['run'], {
            cwd: settings.caddyWorkingDirectory,
            windowsHide: true
        });

        this.caddyProcess.stdout.on('data', (data) => {
            this.forwardProcessOutput('caddy', data);
        });

        this.caddyProcess.stderr.on('data', (data) => {
            this.forwardProcessOutput('caddy', data);
        });

        this.caddyProcess.on('exit', (code) => {
            this.emitLog(`[caddy] Caddy stopped with code ${code}.`);
            this.caddyProcess = null;
            this.emitStatus();
        });

        this.emitLog('[caddy] Caddy started.');
    }

    stopAll(options = {}) {
        const silent = Boolean(options.silent);

        if (this.phpProcess) {
            this.phpProcess.kill();
            this.phpProcess = null;

            if (!silent) {
                this.emitLog('[php] Stop requested.');
            }
        }

        if (this.caddyProcess) {
            this.caddyProcess.kill();
            this.caddyProcess = null;

            if (!silent) {
                this.emitLog('[caddy] Stop requested.');
            }
        }

        const status = this.getInternalStatus();
        this.emitStatus(status);

        return {
            ok: true,
            message: '[services] Services stopped.',
            status
        };
    }

    async restart(settings) {
        this.stopAll();

        await new Promise((resolve) => setTimeout(resolve, 800));

        const result = await this.start(settings);

        return {
            ...result,
            message: result.ok
                ? '[services] Services restarted.'
                : result.message
        };
    }

    forwardProcessOutput(source, data) {
        const message = data.toString().trim();

        if (!message) {
            return;
        }

        this.emitLog(`[${source}] ${message}`);
    }
}

module.exports = {
    ServiceManager
};
