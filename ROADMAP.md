# Roadmap

Caddy PHP Manager is currently in alpha development.

This roadmap tracks planned improvements before the first public alpha release.

## v0.1.0-alpha.1

### Logs

- [ ] Improve Caddy log formatting, avoiding raw JSON when possible
- [ ] Add option to switch between formatted logs and raw logs
- [ ] Add copy logs button
- [ ] Add save/export logs button
- [ ] Add automatic local log file saving

### Interface

- [ ] Add About page or section
- [ ] Show clear credits: Created by Kaio
- [ ] Show technologies used: Electron, Node.js, Caddy, PHP-CGI/FastCGI
- [ ] Improve Settings page visual organization
- [ ] Split Settings into sections: Executables, Caddy, PHP FastCGI, Browser
- [ ] Improve error messages for regular users
- [ ] Improve Portuguese and English translations
- [ ] Review all interface texts to make them more natural

### Security

- [ ] Add warnings about running only trusted binaries
- [ ] Prevent multiple app instances from running at the same time

### System tray and startup

- [ ] Add system tray icon with quick actions
- [ ] Add option to start services automatically when opening the app
- [ ] Add option to minimize to the system tray

### Project metadata

- [ ] Improve package.json with author, keywords, repository and alpha version
- [ ] Change initial version to 0.1.0-alpha.1
- [ ] Review .gitignore

### Documentation

- [ ] Create a professional README
- [ ] Add screenshot to README
- [ ] Add requirements section to README
- [ ] Add installation section to README
- [ ] Add usage section to README
- [ ] Add security section to README
- [ ] Add roadmap section to README
- [ ] Add MIT license correctly

### GitHub

- [ ] Create GitHub issue templates
- [ ] Create bug report template
- [ ] Create feature request template

### Build and release

- [ ] Add build support with electron-builder
- [ ] Generate portable Windows build
- [ ] Generate Windows installer in the future
- [ ] Publish on GitHub as alpha/dev preview
- [ ] Create release v0.1.0-alpha.1 when stable enough

### Manual testing

- [ ] Test opening the app without settings.json
- [ ] Test auto detect
- [ ] Test saving settings
- [ ] Test invalid paths
- [ ] Test start, stop and restart
- [ ] Test occupied port 9000
- [ ] Test occupied port 80
- [ ] Test missing Caddyfile
- [ ] Test Caddy already running outside the app
- [ ] Test language switching
- [ ] Test closing the app while services are running