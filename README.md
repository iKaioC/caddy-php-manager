# Caddy PHP Manager

A desktop manager for running and controlling **Caddy** with **PHP-CGI/FastCGI** in local development environments.

> Status: **Alpha / Development Preview**

Caddy PHP Manager is designed to make it easier to run a local PHP development environment using Caddy and PHP-CGI from a simple desktop interface.

Created by **Kaio**.

## Features

The current alpha version includes:

* Desktop interface built with Electron
* English and Portuguese Brazil language support
* Settings screen
* PHP-CGI executable path configuration
* Caddy executable path configuration
* Caddy working directory configuration
* Auto detection for common executable paths
* File and folder picker for paths
* Local settings saved using Electron's user data directory
* Start, stop and restart services
* Runtime status display
* Detection of occupied PHP and Caddy ports
* Detection of services already running outside the app
* Live console logs
* Open local URL action
* Open Caddy folder action
* Open settings folder action
* Open Caddyfile action
* Caddyfile validation using `caddy validate`
* Caddyfile formatting using `caddy fmt --overwrite`
* Caddy reload support

## Requirements

To run the project locally, you need:

* Node.js
* Caddy
* PHP with `php-cgi.exe`

This project is currently focused on Windows local development environments.

## Installation

Clone the repository:

```bash
git clone https://github.com/iKaioC/caddy-php-manager.git
cd caddy-php-manager
```

Install dependencies:

```bash
npm install
```

## Usage

Run the app in development mode:

```bash
npm run dev
```

After opening the app:

1. Go to **Settings**.
2. Configure the PHP-CGI executable path.
3. Configure the Caddy executable path.
4. Select the Caddy working directory.
5. Make sure the selected directory contains a `Caddyfile`.
6. Configure the PHP host, PHP port and local URL.
7. Save the settings.
8. Start the services from the dashboard.

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

## Caddy tools

The app includes basic Caddy helper actions:

* Validate the selected `Caddyfile`
* Format the selected `Caddyfile`
* Reload Caddy using the selected configuration

These actions use the configured `caddy.exe` path and the selected Caddy working directory.

## Security

This application starts local executables selected by the user.

Only configure trusted binaries, especially:

* `php-cgi.exe`
* `caddy.exe`

Do not select executables from unknown or untrusted sources.

Caddy PHP Manager is intended for local development environments. It should not be treated as a production process manager.

## Roadmap

Planned improvements are tracked in [ROADMAP.md](ROADMAP.md).

Some planned areas include:

* Better Caddy log formatting
* Log copy and export options
* System tray support
* Startup behavior options
* Better Settings organization
* Improved documentation
* Windows portable build
* Windows installer in the future

## Development

Run the project locally:

```bash
npm run dev
```

The app entry point is:

```txt
src/main.js
```

The Electron renderer files are located in:

```txt
src/renderer/
```

## Credits

Created by **Kaio**.

Built with:

* Electron
* Node.js
* Caddy
* PHP-CGI/FastCGI

## License

This project is licensed under the [MIT License](LICENSE).
