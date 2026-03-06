// ====
// @name         Parallel Events Styles
// @version      1.0.0
// @description ，
// @author       Assistant

/**
 * ...
 * ...
 */
class ParallelEventsStyles {
    constructor() {
        this.styles = this.initializeStyles();
        this.customStyles = new Map(); // ...
        this.customPrefix = '';
        this.loadPrefixSettings();
        this.loadCustomStyles();

        console.log('[Parallel Events Styles] ...');
    }

    /**
     * ...
     */
    initializeStyles() {
        return {
            '...ntr': `...。...，...。

...：
- ...
- ...
- ...
- ...1000-1400...

...，...。`,

            '...Задание': `...。...，...Задание...。

...：
- ...
- ...
- ...
- ...1000-1400...

...：
- ...Задание...

...，...。`,

            '...Сообщения': `...Пользователь...AI...。

## ...、...

1.  **...**
    *   ...Пользователь...Пользователь...，AI...。
    *   ...**...**...。
2.  **...**
    *   AI...**...Пользователь...**...ОтветитьСообщения。
3.  **...**
    *   **...**... Пользователь...Пользователь...Сообщения。**...**...Пользователь...
    *   **...**...Сообщения...，...、...、Время...、...、...、...、...。
    *   **...**...。
    * *   **...**...Друзья...id。
    *   **...**...。**...**..."[...{{...}}...]"...。
    *   ...**...**...**...**...Сообщения。

## ...、Сообщения...
### 1. ...
...Сообщения，...，.../* Структура */：
[...{char}...]
{{Сообщения...}}

### 2. {{Сообщения...}}...：
[...Сообщения|{{...}}|{{...Друзьяid}}|{{Сообщения...}}|{{Сообщения...}}]

## ...、...Сообщения...

### 1. ...Сообщения (Text)
*   **...**: ...
*   **...**: ...。
*   **...**:
[...Сообщения|...|500002|...|...，...，...]

### 2. ...Сообщения (Red Packet)
*   **...**: ...
*   **...**: ...（...）。
*   **...**:
    [...Сообщения|...|400003|...|52000]

### 3. ...Сообщения (Voice)
*   **...**: ...
*   **...**: ...Сообщения...。
*   **...**:
    [...Сообщения|...|300004|...|...，...]



## ...、...

*   **...Ответить**：...Ответить...Сообщения...（...、...）... **1 ... 7 ...**...。**...**...Ответить...Сообщения。
*   **...**：Сообщения...Время...，...。
*   **...**：Ответить...、...、...Пользователь...。
## ...、Сообщения...
...8-10...Сообщения
`,

            '...': `...。...，...npc...。

...：
- ...
- ...
- ...600-800...


...，...。`,


            '...': `...。...，...#...#...。

...：
- ...
- ...
- ...600-800...

...，...。`,

            '...': `...。...，...。

...：
- ...
- ...600-800...
- ...、...、...、...、...、...、...、...、...、...、...、...，...

...，...。`,

            '...': `...。...Пользователь...，...。

...：
- ...
- ...、...
- ...
- ...100-200...
- ...

...Пользователь...。...，...。

...，...。`
        };
    }

    /**
     * ...
     */
    getStylePrompt(styleName) {
        if (this.customStyles.has(styleName)) {
            return this.customStyles.get(styleName);
        }
        return this.styles[styleName] || this.styles['...'];
    }

    /**
     * ...
     */
    getAvailableStyles() {
        const builtinStyles = Object.keys(this.styles);
        const customStyleNames = Array.from(this.customStyles.keys());
        return [...builtinStyles, ...customStyleNames];
    }

    /**
     * ...
     */
    addCustomStyle(name, prompt) {
        this.customStyles.set(name, prompt);
        this.saveCustomStyles();
        console.log('[Parallel Events Styles] ...:', name);
    }

    /**
     * Удалить...
     */
    removeCustomStyle(name) {
        if (this.customStyles.has(name)) {
            this.customStyles.delete(name);
            this.saveCustomStyles();
            console.log('[Parallel Events Styles] Удалить...:', name);
            return true;
        }
        return false;
    }

    /**
     * ...
     */
    isCustomStyle(styleName) {
        return this.customStyles.has(styleName);
    }

    /**
     * ...
     */
    getCustomPrefix() {
        return this.customPrefix;
    }

    /**
     * Настройки...
     */
    setCustomPrefix(prefix) {
        this.customPrefix = prefix;
        this.savePrefixSettings();
        console.log('[Parallel Events Styles] ...');
    }

    /**
     * ...
     */
    buildFullPrompt(styleName, customPrefix = '') {
        let basePrompt = this.getStylePrompt(styleName);

        if (customPrefix) {
            basePrompt += `\n\n...：${customPrefix}`;
        }

        if (this.customPrefix) {
            basePrompt += `\n\n...：${this.customPrefix}`;
        }

        return basePrompt;
    }

    /**
     * ...Настройки
     */
    loadPrefixSettings() {
        try {
            const saved = localStorage.getItem('parallelEventsCustomPrefix');
            if (saved) {
                this.customPrefix = saved;
            }
        } catch (error) {
            console.error('[Parallel Events Styles] errorНастройкиerror:', error);
        }
    }

    /**
     * Сохранить...Настройки
     */
    savePrefixSettings() {
        try {
            localStorage.setItem('parallelEventsCustomPrefix', this.customPrefix);
        } catch (error) {
            console.error('[Parallel Events Styles] СохранитьerrorНастройкиerror:', error);
        }
    }

    /**
     * ...
     */
    loadCustomStyles() {
        try {
            const saved = localStorage.getItem('parallelEventsCustomStyles');
            if (saved) {
                const customStylesData = JSON.parse(saved);
                this.customStyles = new Map(Object.entries(customStylesData));
                console.log('[Parallel Events Styles] ...:', this.customStyles.size, '...');
            }
        } catch (error) {
            console.error('[Parallel Events Styles] error:', error);
        }
    }

    /**
     * Сохранить...
     */
    saveCustomStyles() {
        try {
            const customStylesData = Object.fromEntries(this.customStyles);
            localStorage.setItem('parallelEventsCustomStyles', JSON.stringify(customStylesData));
        } catch (error) {
            console.error('[Parallel Events Styles] Сохранитьerror:', error);
        }
    }

    /**
     * ...
     */
    exportCustomStyles() {
        const exportData = {
            customStyles: Object.fromEntries(this.customStyles),
            customPrefix: this.customPrefix,
            exportTime: new Date().toISOString(),
            version: '1.0.0'
        };
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * /* Импорт */...
     */
    importCustomStyles(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (data.customStyles) {
                Object.entries(data.customStyles).forEach(([name, prompt]) => {
                    this.customStyles.set(name, prompt);
                });
                this.saveCustomStyles();
            }

            if (data.customPrefix) {
                this.customPrefix = data.customPrefix;
                this.savePrefixSettings();
            }

            console.log('[Parallel Events Styles] /* Импорт */...');
            return true;
        } catch (error) {
            console.error('[Parallel Events Styles] /* Импорт */error:', error);
            return false;
        }
    }

    /**
     * ...Настройки
     */
    reset() {
        this.customStyles.clear();
        this.customPrefix = '';
        this.saveCustomStyles();
        this.savePrefixSettings();
        console.log('[Parallel Events Styles] Настройки...');
    }
}

window.parallelEventsStyles = new ParallelEventsStyles();

console.log('[Parallel Events Styles] ✅ ...');
