# Caddy PHP Manager

A desktop manager for running and controlling Caddy with PHP-CGI/FastCGI in local development environments.

Created by Kaio.

## Status

This project is currently in early development/alpha.

The current version already includes:

* Desktop interface built with Electron
* English and Portuguese Brazil language support
* Settings screen
* PHP-CGI and Caddy path configuration
* Auto detection for common executable paths
* File and folder picker for paths
* Settings saved locally
* Start, stop and restart services
* Runtime status display
* Live console logs

## Requirements

* Node.js
* Caddy
* PHP with `php-cgi.exe`

## Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

## Configuration

The app stores its settings locally using Electron's user data directory.

On Windows, this is usually something like:

```txt
C:\Users\YourUser\AppData\Roaming\caddy-php-manager\settings.json
```

The settings screen currently supports:

* PHP-CGI executable path
* Caddy executable path
* Caddy working directory
* PHP host
* PHP port
* Local URL

## Security note

This application starts local executables selected by the user.

Only configure trusted binaries, especially:

* `php-cgi.exe`
* `caddy.exe`

Do not select executables from unknown or untrusted sources.

## Roadmap

Planned improvements:

* Validate executable names
* Validate `Caddyfile` presence
* Detect occupied ports
* Detect services already running outside the app
* Improve Caddy log formatting
* Add an Open Local URL button
* Add Caddyfile validation using `caddy validate`
* Add Caddyfile formatting using `caddy fmt --overwrite`
* Add Caddy reload support
* Add log copy/export options
* Add Windows build support
* Add issue templates
* Add screenshots

## Credits

Created by Kaio.

Built with:

* Electron
* Node.js
* Caddy
* PHP-CGI/FastCGI

## License

MIT
