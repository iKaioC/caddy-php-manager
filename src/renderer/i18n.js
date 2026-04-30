window.I18N = {
    defaultLanguage: 'en',

    languages: {
        en: 'English',
        'pt-BR': 'Português Brasil'
    },

    messages: {
        en: {
            'app.name': 'Caddy PHP Manager',
            'app.description': 'Local Caddy + PHP-CGI/FastCGI manager.',

            'language.label': 'Language',

            'nav.dashboard': 'Dashboard',
            'nav.settings': 'Settings',

            'sidebar.php': 'PHP-CGI',
            'sidebar.caddy': 'Caddy',
            'sidebar.config': 'Config',

            'credits.author': 'Created by Kaio',
            'credits.stack': 'Powered by Electron, Node.js, Caddy and PHP-CGI/FastCGI.',

            'dashboard.title': 'Service dashboard',
            'dashboard.description': 'Control your local Caddy and PHP-CGI environment from one place.',
            'dashboard.configure': 'Configure',

            'setup.title': 'Configuration required',
            'setup.description': 'Set the executable paths before starting the services.',

            'status.phpService': 'PHP-CGI service',
            'status.caddyService': 'Caddy server',
            'status.localUrl': 'Local URL',
            'status.offline': 'Offline',
            'status.online': 'Online',
            'status.missing': 'Missing',
            'status.notReady': 'Not ready',
            'status.ready': 'Ready',

            'controls.title': 'Controls',
            'controls.description': 'Start, stop or restart the configured services.',
            'controls.start': 'Start',
            'controls.stop': 'Stop',
            'controls.restart': 'Restart',

            'logs.title': 'Console',
            'logs.description': 'Live output and application events.',
            'logs.waiting': 'Waiting for services...',
            'logs.clear': 'Clear',

            'settings.title': 'Settings',
            'settings.description': 'Configure paths, ports and local server options.',
            'settings.back': 'Back to dashboard',
            'settings.sectionExecutables': 'Executables',
            'settings.sectionServer': 'Server',
            'settings.phpPath': 'PHP-CGI executable',
            'settings.caddyPath': 'Caddy executable',
            'settings.caddyWorkingDirectory': 'Caddy working directory',
            'settings.phpHost': 'PHP host',
            'settings.phpPort': 'PHP port',
            'settings.localUrl': 'Local URL',
            'settings.browse': 'Browse',
            'settings.detect': 'Auto detect',
            'settings.test': 'Test paths',
            'settings.save': 'Save settings',

            'settingsFeedback.successTitle': 'Everything looks good',
            'settingsFeedback.errorTitle': 'Action required',
            'settingsFeedback.savedTitle': 'Settings saved',
            'settingsFeedback.detectedTitle': 'Auto detection finished',
            'settingsFeedback.detectedMessage': 'Detected values were filled in the form. Review them before saving.',

            'dialog.phpPath': 'Select php-cgi.exe',
            'dialog.caddyPath': 'Select caddy.exe',
            'dialog.caddyWorkingDirectory': 'Select Caddy working directory',

            'log.appLoaded': '[system] Application loaded.',
            'log.settingsLoaded': '[settings] Settings loaded.',
            'log.detectFinished': '[settings] Auto detection finished.',
            'log.startFallback': '[system] Start services requested.',
            'log.stopFallback': '[system] Stop services requested.',
            'log.restartFallback': '[system] Restart services requested.',
            'log.settingsOpened': '[settings] Settings page opened.',
            'log.languageChanged': '[settings] Language changed to English.',
            'log.logsCleared': '[system] Logs cleared.'
        },

        'pt-BR': {
            'app.name': 'Caddy PHP Manager',
            'app.description': 'Gerenciador local para Caddy + PHP-CGI/FastCGI.',

            'language.label': 'Idioma',

            'nav.dashboard': 'Painel',
            'nav.settings': 'Configurações',

            'sidebar.php': 'PHP-CGI',
            'sidebar.caddy': 'Caddy',
            'sidebar.config': 'Configuração',

            'credits.author': 'Criado por Kaio',
            'credits.stack': 'Desenvolvido com Electron, Node.js, Caddy e PHP-CGI/FastCGI.',

            'dashboard.title': 'Painel dos serviços',
            'dashboard.description': 'Controle seu ambiente local com Caddy e PHP-CGI em um só lugar.',
            'dashboard.configure': 'Configurar',

            'setup.title': 'Configuração necessária',
            'setup.description': 'Defina os caminhos dos executáveis antes de iniciar os serviços.',

            'status.phpService': 'Serviço PHP-CGI',
            'status.caddyService': 'Servidor Caddy',
            'status.localUrl': 'URL local',
            'status.offline': 'Offline',
            'status.online': 'Online',
            'status.missing': 'Pendente',
            'status.notReady': 'Não pronto',
            'status.ready': 'Pronto',

            'controls.title': 'Controles',
            'controls.description': 'Inicie, pare ou reinicie os serviços configurados.',
            'controls.start': 'Iniciar',
            'controls.stop': 'Parar',
            'controls.restart': 'Reiniciar',

            'logs.title': 'Console',
            'logs.description': 'Saída em tempo real e eventos da aplicação.',
            'logs.waiting': 'Aguardando serviços...',
            'logs.clear': 'Limpar',

            'settings.title': 'Configurações',
            'settings.description': 'Configure caminhos, portas e opções do servidor local.',
            'settings.back': 'Voltar ao painel',
            'settings.sectionExecutables': 'Executáveis',
            'settings.sectionServer': 'Servidor',
            'settings.phpPath': 'Executável do PHP-CGI',
            'settings.caddyPath': 'Executável do Caddy',
            'settings.caddyWorkingDirectory': 'Diretório de trabalho do Caddy',
            'settings.phpHost': 'Host do PHP',
            'settings.phpPort': 'Porta do PHP',
            'settings.localUrl': 'URL local',
            'settings.browse': 'Selecionar',
            'settings.detect': 'Detectar automaticamente',
            'settings.test': 'Testar caminhos',
            'settings.save': 'Salvar configurações',

            'settingsFeedback.successTitle': 'Tudo certo',
            'settingsFeedback.errorTitle': 'Ação necessária',
            'settingsFeedback.savedTitle': 'Configurações salvas',
            'settingsFeedback.detectedTitle': 'Detecção automática finalizada',
            'settingsFeedback.detectedMessage': 'Os valores detectados foram preenchidos no formulário. Revise antes de salvar.',

            'dialog.phpPath': 'Selecione o php-cgi.exe',
            'dialog.caddyPath': 'Selecione o caddy.exe',
            'dialog.caddyWorkingDirectory': 'Selecione o diretório de trabalho do Caddy',

            'log.appLoaded': '[sistema] Aplicação carregada.',
            'log.settingsLoaded': '[configurações] Configurações carregadas.',
            'log.detectFinished': '[configurações] Detecção automática finalizada.',
            'log.startFallback': '[sistema] Início dos serviços solicitado.',
            'log.stopFallback': '[sistema] Parada dos serviços solicitada.',
            'log.restartFallback': '[sistema] Reinício dos serviços solicitado.',
            'log.settingsOpened': '[configurações] Página de configurações aberta.',
            'log.languageChanged': '[configurações] Idioma alterado para Português Brasil.',
            'log.logsCleared': '[sistema] Logs limpos.'
        }
    }
};
