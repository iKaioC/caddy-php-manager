const { EventEmitter } = require('events');
const { spawn } = require('child_process');

const { isPortOpen, detectCaddyPorts, findOpenPorts } = require('./portUtils');

class ServiceManager extends EventEmitter {
    constructor() {
        super();

        this.phpProcess = null;
        this.caddyProcess = null;

        this.phpState = 'offline';
        this.caddyState = 'offline';
    }

    getInternalStatus() {
        return {
            php: Boolean(this.phpProcess),
            caddy: Boolean(this.caddyProcess),
            phpState: this.phpState,
            caddyState: this.caddyState
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

    setPhpState(state) {
        this.phpState = state;
        this.emitStatus();
    }

    setCaddyState(state) {
        this.caddyState = state;
        this.emitStatus();
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

        return {
            ok: true,
            message: '[services] Services started.',
            status: this.getInternalStatus()
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

        this.setPhpState('starting');

        try {
            this.phpProcess = spawn(settings.phpPath, ['-b', endpoint], {
                windowsHide: true
            });
        } catch (error) {
            this.phpProcess = null;
            this.setPhpState('error');
            this.emitLog(`[php:error] ${error.message}`);
            return;
        }

        this.phpProcess.stdout.on('data', (data) => {
            this.forwardProcessOutput('php', data);
        });

        this.phpProcess.stderr.on('data', (data) => {
            this.forwardProcessOutput('php:error', data);
        });

        this.phpProcess.once('error', (error) => {
            this.emitLog(`[php:error] ${error.message}`);
            this.phpProcess = null;
            this.setPhpState('error');
        });

        this.phpProcess.once('exit', (code) => {
            const wasStopping = this.phpState === 'stopping' || this.phpState === 'restarting';

            this.emitLog(`[php] PHP-CGI stopped with code ${code}.`);
            this.phpProcess = null;
            this.setPhpState(wasStopping ? 'offline' : 'error');
        });

        this.emitLog(`[php] PHP-CGI started on ${endpoint}.`);
        this.setPhpState('online');
    }

    startCaddy(settings) {
        if (this.caddyProcess) {
            this.emitLog('[caddy] Caddy is already running.');
            return;
        }

        this.setCaddyState('starting');

        try {
            this.caddyProcess = spawn(settings.caddyPath, ['run'], {
                cwd: settings.caddyWorkingDirectory,
                windowsHide: true
            });
        } catch (error) {
            this.caddyProcess = null;
            this.setCaddyState('error');
            this.emitLog(`[caddy:error] ${error.message}`);
            return;
        }

        this.caddyProcess.stdout.on('data', (data) => {
            this.forwardProcessOutput('caddy', data);
        });

        this.caddyProcess.stderr.on('data', (data) => {
            this.forwardProcessOutput('caddy', data);
        });

        this.caddyProcess.once('error', (error) => {
            this.emitLog(`[caddy:error] ${error.message}`);
            this.caddyProcess = null;
            this.setCaddyState('error');
        });

        this.caddyProcess.once('exit', (code) => {
            const wasStopping = this.caddyState === 'stopping' || this.caddyState === 'restarting';

            this.emitLog(`[caddy] Caddy stopped with code ${code}.`);
            this.caddyProcess = null;
            this.setCaddyState(wasStopping ? 'offline' : 'error');
        });

        this.emitLog('[caddy] Caddy started.');
        this.setCaddyState('online');
    }

    async stopAll(options = {}) {
        const silent = Boolean(options.silent);
        const restarting = Boolean(options.restarting);

        const stopTasks = [];

        if (this.phpProcess) {
            this.setPhpState(restarting ? 'restarting' : 'stopping');

            if (!silent) {
                this.emitLog(restarting ? '[php] Restart requested.' : '[php] Stop requested.');
            }

            stopTasks.push(this.stopProcess('php'));
        }

        if (this.caddyProcess) {
            this.setCaddyState(restarting ? 'restarting' : 'stopping');

            if (!silent) {
                this.emitLog(restarting ? '[caddy] Restart requested.' : '[caddy] Stop requested.');
            }

            stopTasks.push(this.stopProcess('caddy'));
        }

        if (stopTasks.length === 0) {
            this.emitStatus();

            return {
                ok: true,
                message: '[services] Services already stopped.',
                status: this.getInternalStatus()
            };
        }

        await Promise.all(stopTasks);

        return {
            ok: true,
            message: '[services] Services stopped.',
            status: this.getInternalStatus()
        };
    }

    stopProcess(serviceName) {
        const processRef = serviceName === 'php'
            ? this.phpProcess
            : this.caddyProcess;

        if (!processRef) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            let resolved = false;

            const finish = () => {
                if (resolved) {
                    return;
                }

                resolved = true;
                resolve();
            };

            processRef.once('exit', finish);

            try {
                processRef.kill();
            } catch {
                finish();
            }

            setTimeout(finish, 3000);
        });
    }

    async restart(settings) {
        await this.stopAll({ restarting: true });

        await new Promise((resolve) => setTimeout(resolve, 500));

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
