/**
 * App Loader - /* Приложение */...
 * .../* Приложение */...
 */

class AppLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingModules = new Set();
        this.moduleLoadQueue = [];

        console.log('[App Loader] /* Приложение */...');
    }

    async loadModule(moduleName, moduleUrl, dependencies = []) {
        try {
            console.log(`[App Loader] ...: ${moduleName}`);

            // Если，Назад
            if (this.loadedModules.has(moduleName)) {
                console.log(`[App Loader] ... ${moduleName} ...`);
                return true;
            }

            // Если，
            if (this.loadingModules.has(moduleName)) {
                console.log(`[App Loader] ... ${moduleName} ...，......`);
                return await this.waitForModule(moduleName);
            }

            this.loadingModules.add(moduleName);

            for (const dep of dependencies) {
                if (!this.loadedModules.has(dep)) {
                    console.log(`[App Loader] ... ${moduleName} ... ${dep}，...`);
                    await this.loadModule(dep, this.getModuleUrl(dep));
                }
            }

            await this.loadScript(moduleUrl);

            // Отмечаем как загруженный
            this.loadedModules.add(moduleName);
            this.loadingModules.delete(moduleName);

            console.log(`[App Loader] ✅ ... ${moduleName} ...`);
            return true;

        } catch (error) {
            console.error(`[App Loader] error ${moduleName} error:`, error);
            this.loadingModules.delete(moduleName);
            return false;
        }
    }

    async waitForModule(moduleName, timeout = 10000) {
        const startTime = Date.now();

        while (this.loadingModules.has(moduleName)) {
            if (Date.now() - startTime > timeout) {
                throw new Error(`error ${moduleName} error`);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return this.loadedModules.has(moduleName);
    }

    async loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // URL
    getModuleUrl(moduleName) {
        const baseUrl = 'scripts/extensions/third-party/mobile/app/';
        const moduleUrls = {
            'context-monitor': baseUrl + 'context-monitor.js',
            'friend-renderer': baseUrl + 'friend-renderer.js',
            'message-sender': baseUrl + 'message-sender.js',
            'message-app': baseUrl + 'message-app.js',
            'real-time-sync': baseUrl + 'real-time-sync.js'
        };

        return moduleUrls[moduleName] || `${baseUrl}${moduleName}.js`;
    }

    async loadModules(modules) {
        const results = [];

        for (const module of modules) {
            const result = await this.loadModule(
                module.name,
                module.url || this.getModuleUrl(module.name),
                module.dependencies || []
            );
            results.push({ name: module.name, success: result });
        }

        return results;
    }

    // Статус
    getLoadStatus() {
        return {
            loadedModules: Array.from(this.loadedModules),
            loadingModules: Array.from(this.loadingModules),
            totalLoaded: this.loadedModules.size,
            totalLoading: this.loadingModules.size
        };
    }
}

if (typeof window.appLoader === 'undefined') {
    window.appLoader = new AppLoader();
}

// /* Приложение */
async function loadMobileAppModules() {
    try {
        console.log('[App Loader] 🚀 .../* Приложение */...');

        const modules = [
            {
                name: 'context-monitor',
                dependencies: []
            },
            {
                name: 'friend-renderer',
                dependencies: ['context-monitor']
            },
            {
                name: 'message-sender',
                dependencies: ['context-monitor']
            },
            {
                name: 'message-app',
                dependencies: ['context-monitor', 'friend-renderer', 'message-sender']
            },
            {
                name: 'real-time-sync',
                dependencies: ['context-monitor', 'friend-renderer', 'message-app']
            }
        ];

        const results = await window.appLoader.loadModules(modules);

        // Проверка результата загрузки
        const failed = results.filter(r => !r.success);
        if (failed.length > 0) {
            console.error('[App Loader] error:', failed);
        }

        const succeeded = results.filter(r => r.success);
        console.log(`[App Loader] ✅ ... ${succeeded.length}/${results.length} ...`);

        setTimeout(() => {
            if (window.realTimeSync && !window.realTimeSync.isRunning) {
                console.log('[App Loader] 🔄 ...');
                window.realTimeSync.start();
            }
        }, 1000);

    } catch (error) {
        console.error('[App Loader] error/* Приложение */error:', error);
    }
}

function isMobileEnvironment() {
    return window.location.pathname.includes('mobile') ||
           document.querySelector('[data-app]') !== null ||
           window.mobilePhone !== undefined;
}

setTimeout(() => {
    if (isMobileEnvironment()) {
        loadMobileAppModules();
    }
}, 1000);

console.log('[App Loader] /* Приложение */...');
