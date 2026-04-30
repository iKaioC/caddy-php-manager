const { EventEmitter } = require('events');
const { spawn } = require('child_process');

class ServiceManager extends EventEmitter {
    constructor() {
        super();

        this.phpProcess = null;
        this.caddyProcess = null;
    }

    getStatus() {
        return {
            php: Boolean(this.phpProcess),
            caddy: Boolean(this.caddyProcess)
        };
    }

    emitStatus() {
        this.emit('status', this.getStatus());
    }

    emitLog(message) {
        this.emit('log', message);
    }

    start(settings) {
        this.startPhp(settings);
        this.startCaddy(settings);

        this.emitStatus();

        return {
            ok: true,
            message: '[services] Services started.',
            status: this.getStatus()
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

        this.emitStatus();

        return {
            ok: true,
            message: '[services] Services stopped.',
            status: this.getStatus()
        };
    }

    async restart(settings) {
        this.stopAll();

        await new Promise((resolve) => setTimeout(resolve, 800));

        const result = this.start(settings);

        return {
            ...result,
            message: '[services] Services restarted.'
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
