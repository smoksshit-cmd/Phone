// ==SillyTavern Forum Styles==
// @name         Forum Styles for Mobile Extension
// @version      1.0.0
// @description Форум，8
// @author       Assistant

/**
 * Форум...
 * ...
 */
class ForumStyles {
  constructor() {
    this.styles = this.initializeStyles();
    this.emoticons = this.initializeEmoticons();
    this.customStyles = new Map(); // ...
    // Настройки
    this.customPrefix = '';
    this.loadPrefixSettings();
    // （Настройки）
    this.globalBackendPrefix = this.initializeGlobalPrefix();
    this.loadCustomStyles();
  }

  /**
   * ...
   */
  initializeStyles() {
    return {
      Аноним: `...，...，.../...。..."..."（...），...Комментарий、...、...。

...，...3-5...Пост...，...Пост...、...2-3...Ответить。

...：
- ...、...，..."...，...？"、"..."
- ...，...，...、...
- Ответить...、...，..."..."、"..."、"..."、"..."、"...？"
- Пользователь...，..."..."、"..."

...Форум...，...。`,

      ...: `...Пользователь/...，...、...。...、...，...、...、...。

...，...3-5...Стиль Reddit...，...、...Комментарий。

...：
- ...，..."...XX...？"、"...：XX..."
- .../* Структура */...，...、...，..."..."
- ...，...
- ...，..."...，..."
- Пользователь...，..."..."、"..."
- Комментарий...

...Форум...，...。`,

      ...: `...，...，...，...。

...，...3-5...，...Подписаться...。

...：
- ...Emoji✨💔😭🤔🍵，..."...！XX...🤯"
- ...，..."..."、"..."、"..."
- ...，...Emoji...
- ...："...？Комментарий...！"
- Пользователь...，...Пользователь...，..."XX..."、"..."、“momo”...，...Пользователь...，...Пользователь...。
- Ответить...，...，..."...！"、"...+10086！"
- ...：#... #... #...

...Форум...，...。`,

      ...: `...BGM、...、...Пароль...。...，...，...、...、...。

...，...3-5..."..."。

...：
- ...，...🔥💥，..."...！🤯"、"...？！"
- ...："...！"、"...！"、"..."
- ...、...，...
- ...："..."、"..."、"..."、"..."
- ...："(BGM...!)"、"(...)"、"(...OS:...)"
- ...："...@...XXX...！"
- Пользователь...，..."..."、"..."
- Ответить...："...BGM...！"、"...！"、"...，...！"

...Форум...，...。`,

      B...UP...: `...B...、...UP...，...Донаты...，...、...。

...，...3-5...B..."..."...。

...：
- ...B...，...【】...，..."【...N...】...XXX！"、"...！...XX...？！"
- ...："...，...XXX"、"...~"
- ...："...Лайк👍、...🪙、...⭐"
- ...B...："..."、"..."、"AWSL"、"..."、"..."
- ...："(...BGM...)"、"(...)"
- Пользователь...UP...，..."..."、"..."
- Донаты...Ответить："AWSL"、"23333"、"..."、"...，..."

...Форум...，...。`,

      ...: `...Форум..."..."，...，...、...Поделиться"...Сообщения"..."..."。

...，...3-5...Пост（...，...）。

...：
- ...，..."...，..."、"...：..."
- ...，...、...
- ...，...
- ...
- Пользователь...，..."..."、"..."
- Ответить...，..."...Поделиться，..."、"mark，..."

...，...。...Форум...，...。`,

      ...: `...，...。...、...。

...，...3-5...。

...：
- ...，..."【...】XX...？"、"...！XX..."
- ...，...".................."、"......"
- ..."..."，...、...
- ...
- Пользователь...，..."..."、"XДосье..."
- Ответить...，..."...，......"

...Форум...，...。`,

      ...: `...，...、...。...（...）、...、...。

...，...3-5...Пост。

...：
- ...，...，...【】...，..."【...】...XX...（...）"
- ...，...，...
- ...，...，...---...
- ...
- ...".../LZ"、"..."、"..."...
- Пользователь...，..."..."、"...N..."
- Ответить...："...！"、"...！"、"...！"、"...！"

...Форум...，...。`,

      ...Форум: `...Форум...，...，...、...、...、...。...，...。

...，...3-5...Форум...Пост。

...：
- ...，..."...！...？"、"【...Поделиться】...！"
- ...，...："..."、"..."、"..."、"..."、"Книги..."
- ...：...、...、Книги...、...、...
- ...，... (｡◕‿◕｡)
- ...Поделиться...，...
- Пользователь...，..."..."、"Книги..."、"..."、“...”
- Ответить...："...！"、"mark...！"、".../...！"、"...！"
- ...：...、...、...、...、...

...Форум...，...。`,

      ВКонтакте: `...ВКонтакте...Пользователь，...140...，...，...。

...，...3-5...ВКонтакте...。

...：
- ...，...ВКонтакте...，..."РепостВКонтакте：...+Комментарий"
- ...，... #...#
- ... 😂🔥💯👍
- ...@...Пользователь...，..."@... ...？"
- Репост...，..."РепостВКонтакте：...！"
- ...，...
- Пользователь...，..."..."、"...99..."、"..."
- Комментарий...："..."、"...！"、"..."、"..."
- ...："..."、"yyds"、"..."、"CPU..."
- ...

...Форум...，...。`,
    };
  }

  /**
   * ...
   */
  initializeEmoticons() {
    return [''];
  }

  /**
   * ...（...Настройки...）
   * ...
   */
  initializeGlobalPrefix() {
    // ===========================================
    // -
    // ===========================================
    return '';
  }

  /**
   * ...ПользовательНаписать пост...
   */
  getUserPostRules() {
    return `...ПользовательНаписать пост...：

1. ...：
   - [...|{{user}}|Постid(t101,t...Постid...)|...|Пост...]
   - [Ответ|...Никнейм|Постid(t101,t...Постid...)|Ответить...]
   - ...Пост...id...
   - ...：
     [...|{user}}|t101|Сегодня...|......]
     [Ответ|...|t101|...，...]
     [Ответ|...|t101|Ответить...：...]

2. ПользовательНаписать пост...：
   - ...ПользовательОпубликовать...Пост
   - ...Пользователь...Пост...5-10...Ответить
   - Ответить...ПользовательПост...,...Ответить...Ответить
   - Ответить...Форум...
   - ...Пользователь...Пост...（Новое）

3. ...：
   - ...Форум...
   - ...
   - .../* Структура */...，...

4. ...：
   - Форум...，...，...，...NSFW...
   - ...

...Пользователь...Пост...Форум...。`;
  }

  /**
   * ...Форум...
   */
  getForumGenerationRules() {
    return `Пользователь...ФорумПост，...3-5...Пост...Пост...Ответить，...Пост...Написать пост...。...：

1. ...：
   - \`\`\`[...|Написать пост...Никнейм|Постid(t101,t...Постid...)|...|Пост...<img src="https://image.pollinations.ai/prompt/Fried%20stinky%20tofu%20with%20chili%20sauce,%20food%20photography,%20hyper%20realistic" style="width: 100%; display: block; border-radius: 6px;" alt="...，...">]\`\`\`
   - [Ответ|...Никнейм|Постid(t101,t...Постid...)|Ответить...]
   - ...Пост...id...
   - ...：
     [...|...|t101|...？...，...！...: doge|...]
     [Ответ|...|t101|...？...，...？]
     [Ответ|...|t101|Ответить...：...]

2. Форум...：
   - ...
   - ...3-5...Пост...，Пост...，Написать пост...。
   - ...Пост...1...5-10...Ответить
   - ...
   - ...Форум...，...Пост

3. ...：
   - ...Пост...Ответить
   - ...Пост
   - ...Форум...
   - ...

4. ...：
   - ...Форум...
   - ...
   - .../* Структура */...，...

5. ...：
   - ...
   - ...
   - ...

6. ...：
   - Форум...，...，...，...NSFW...
   - ...

...Форум...。

# ...（HTML...）

...HTML...（...、...）...AI...，**...**...，...。

### 1. ...
**...**...HTML... \`\`\`<img>\`\`\` ...，**...**...Markdown... \`\`\`![]()\`\`\` ...。

### 2. ...
...：

\`\`\`html
<img src="https://image.pollinations.ai/prompt/{URL...}" style="width: 100%; display: block;" alt="{...}">
\`\`\`

### 3. ...

*   \`\`\`{URL...}\`\`\`:
    *   ... \`\`\`pollinations.ai\`\`\` ...，...**...**。
    *   ...**...**... \`\`\`%20\`\`\`。
    *   **...**: ...“...”，... \`\`\`a beautiful afternoon tea set\`\`\`，... \`\`\`a%20beautiful%20afternoon%20tea%20set\`\`\`。

*   \`\`\`style="width: 100%; display: block;"\`\`\`:
    *   ...，...**...**。
    *   ...，...，...。

*   \`\`\`alt="{...}"\`\`\`:
    *   ...“...”，...，...Поиск...。
    *   ...**...**...。
    *   **...**: ...，... \`\`\`alt="..."\`\`\`。

### 4. ...

**...：** “...‘...’...”

**...：**
\`\`\`
<!-- ...： -->
<img src="https://image.pollinations.ai/prompt/a%20cute%20cat%20sleeping%20in%20the%20sun" style="width: 100%; display: block;" alt="...">
\`\`\`

### 5. 【...】
**...**... \`\`\`<div>\`\`\`, \`\`\`<details>\`\`\`, \`\`\`<span>\`\`\` ...HTML...，... \`\`\`![](...)\`\`\` ...。...HTML...，...。

...，...、...、...，.../* Структура */，...、...、...
`;
  }

  /**
   * ...ПользовательОтветить...
   */
  getUserReplyRules() {
    return `Пользователь...ОтветитьПост...Комментарий，...ПользовательОтветить...：

1. ...：
   - [Ответ|...Никнейм|Постid(t101,t...Постid...)|Ответить...]
   - ...：
     [Ответ|...|t101|...？...，...？]
     [Ответ|...|t101|Ответить...：...]

2. ПользовательОтветить...：
   - ...ПользовательОпубликовать...Ответить
   - ...Пользователь...Ответить...1-3...Ответить
   - ...Пользователь...Ответить...ПользовательОтветить...，...Ответить...Ответить
   - **...**
   - **...Ответить，...Пост**

3. Ответить...：
   - ...ПользовательОтветить...，...
   - Ответить...
   - ...、...、...，...，...
   - ...

4. ...：
   - ...ПользовательОтветить...
   - ...
   - ...
   - ...Ответить...

5. ...：
   - ...Форум...
   - ...
   - .../* Структура */...，...

6. ...：
   - Форум...，...，...，...NSFW...
   - ...

...Пользователь...Ответить...Форум...。`;
  }

  /**
   * ...（...）
   * @param {string} styleName - ...
   * @param {string} operationType - ...：'post'(Написать пост), 'reply'(Ответить), 'generate'(...Форум)
   */
  getStylePrompt(styleName, operationType = 'generate') {
    let basePrompt;
    if (this.customStyles.has(styleName)) {
      const customStyle = this.customStyles.get(styleName);
      basePrompt = customStyle.prompt;
    } else {
      basePrompt = this.styles[styleName] || this.styles['Аноним'];
    }

    const emoticonGuide = this.getEmoticonGuide();

    // ： + Пользователь +
    let finalPrompt = '';

    // 1. （）
    let operationRules = '';
    switch (operationType) {
      case 'post':
        operationRules = this.getUserPostRules();
        break;
      case 'reply':
        operationRules = this.getUserReplyRules();
        break;
      case 'generate':
      default:
        operationRules = this.getForumGenerationRules();
        break;
    }

    if (operationRules && operationRules.trim()) {
      finalPrompt = `${operationRules.trim()}\n\n`;
    }

    // 2. Пользователь - Подписаться
    if (this.customPrefix && this.customPrefix.trim()) {
      finalPrompt += `🔥🔥🔥 ...Пользователь... 🔥🔥🔥
CRITICAL USER INSTRUCTION - HIGHEST PRIORITY:
${this.customPrefix.trim()}

⚠️ ...Пользователь...，...！⚠️
...Форум...，...！

`;
    }

    // 3.
    finalPrompt += `${basePrompt}\n\n`;

    // 4.
    finalPrompt += emoticonGuide;

    // 5. ，
    if (this.customPrefix && this.customPrefix.trim()) {
      finalPrompt += `\n\n🔥 ...：...Пользователь...：${this.customPrefix.trim()}`;
    }

    return finalPrompt;
  }

  getEmoticonGuide() {
    return ``;
  }

  /**
   * .../* Список */
   */
  getAvailableStyles() {
    return Object.keys(this.styles);
  }

  /**
   * ...
   */
  hasStyle(styleName) {
    return styleName in this.styles;
  }

  /**
   * ...
   */
  addCustomStyle(name, prompt) {
    this.styles[name] = prompt;
    this.saveCustomStyles();
  }

  /**
   * Удалить...
   */
  removeCustomStyle(name) {
    // Удалить
    const presetStyles = [
      'Аноним',
      '...',
      '...',
      '...',
      'B...UP...',
      '...',
      '...',
      '...',
      '...Форум',
      'ВКонтакте',
    ];
    if (!presetStyles.includes(name)) {
      delete this.styles[name];
      this.saveCustomStyles();
      return true;
    }
    return false;
  }

  /**
   * Сохранить...
   */
  saveCustomStyles() {
    try {
      const customStyles = {};
      const presetStyles = [
        'Аноним',
        '...',
        '...',
        '...',
        'B...UP...',
        '...',
        '...',
        '...',
        '...Форум',
        'ВКонтакте',
      ];

      for (const [name, prompt] of Object.entries(this.styles)) {
        if (!presetStyles.includes(name)) {
          customStyles[name] = prompt;
        }
      }

      localStorage.setItem('mobile_forum_custom_styles', JSON.stringify(customStyles));
      console.log('[Reddit/Forum Styles] ...Сохранить');
    } catch (error) {
      console.error('[Reddit/Forum Styles] Сохранитьerror:', error);
    }
  }

  /**
   * ...
   */
  loadCustomStyles() {
    try {
      const saved = localStorage.getItem('mobile_forum_custom_styles');
      if (saved) {
        const customStyles = JSON.parse(saved);
        Object.assign(this.styles, customStyles);
        console.log('[Reddit/Forum Styles] ...');
      }
    } catch (error) {
      console.error('[Reddit/Forum Styles] error:', error);
    }
  }

  /**
   * ...
   */
  processEmoticonPlaceholders(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }

    return text.replace(/\[...:([^\]]+)\]/g, (match, keyword) => {
      const cleanKeyword = keyword.trim();

      if (this.emoticons.includes(cleanKeyword)) {
        // URL
        return `<span class="emoticon" data-keyword="${cleanKeyword}">[${cleanKeyword}]</span>`;
      }

      return match; // Если...，...
    });
  }

  // ===========================================
  // ===========================================

  /**
   * Настройки...
   */
  setCustomPrefix(prefix) {
    this.customPrefix = prefix || '';
    this.savePrefixSettings();
    console.log('[Reddit/Forum Styles] ...:', this.customPrefix ? '...Настройки' : '...');
  }

  /**
   * ...
   */
  getCustomPrefix() {
    return this.customPrefix;
  }

  /**
   * ...
   */
  clearCustomPrefix() {
    this.customPrefix = '';
    this.savePrefixSettings();
    console.log('[Reddit/Forum Styles] ...');
  }

  /**
   * Сохранить...Настройки...
   */
  savePrefixSettings() {
    try {
      localStorage.setItem('mobile_forum_custom_prefix', this.customPrefix);
      console.log('[Reddit/Forum Styles] ...Настройки...Сохранить');
    } catch (error) {
      console.error('[Reddit/Forum Styles] СохранитьerrorНастройкиerror:', error);
    }
  }

  /**
   * ...Настройки
   */
  loadPrefixSettings() {
    try {
      const saved = localStorage.getItem('mobile_forum_custom_prefix');
      if (saved !== null) {
        this.customPrefix = saved;
        console.log('[Reddit/Forum Styles] ...Настройки...');
      }
    } catch (error) {
      console.error('[Reddit/Forum Styles] errorНастройкиerror:', error);
    }
  }

  /**
   * ...
   */
  previewStyleWithPrefix(styleName) {
    return this.getStylePrompt(styleName);
  }

  /**
   * ...НастройкиСтатус
   */
  getPrefixStatus() {
    return {
      hasPrefix: !!(this.customPrefix && this.customPrefix.trim()),
      prefixLength: this.customPrefix ? this.customPrefix.length : 0,
      previewPrefix: this.customPrefix
        ? this.customPrefix.substring(0, 100) + (this.customPrefix.length > 100 ? '...' : '')
        : '',
      // Статус
      hasGlobalPrefix: !!(this.globalBackendPrefix && this.globalBackendPrefix.trim()),
      globalPrefixLength: this.globalBackendPrefix ? this.globalBackendPrefix.length : 0,
      previewGlobalPrefix: this.globalBackendPrefix
        ? this.globalBackendPrefix.substring(0, 100) + (this.globalBackendPrefix.length > 100 ? '...' : '')
        : '',
    };
  }

  // ===========================================
  // ===========================================

  /**
   * ...
   */
  getGlobalBackendPrefix() {
    return this.globalBackendPrefix;
  }

  /**
   * ...
   */
  hasGlobalBackendPrefix() {
    return !!(this.globalBackendPrefix && this.globalBackendPrefix.trim());
  }

  /**
   * ...
   */
  getFullPrefixPreview() {
    let preview = '';

    if (this.globalBackendPrefix && this.globalBackendPrefix.trim()) {
      preview += `=== ... ===\n${this.globalBackendPrefix.trim()}\n\n`;
    }

    if (this.customPrefix && this.customPrefix.trim()) {
      preview += `=== Пользователь... ===\n${this.customPrefix.trim()}\n\n`;
    }

    if (!preview) {
      preview = '(...Настройки)';
    }

    return preview;
  }

  /**
   * ...
   */
  getPrefixPriorityInfo() {
    return {
      priority: [
        '1. ...（...Настройки，...）',
        '2. Пользователь...（Пользователь...UI...Настройки）',
        '3. ...（Аноним、...）',
        '4. ...',
      ],
      currentStatus: {
        globalBackend: this.hasGlobalBackendPrefix(),
        userCustom: !!(this.customPrefix && this.customPrefix.trim()),
      },
    };
  }

  /**
   * ...
   */
  getAvailableStyles() {
    const presetStyles = Object.keys(this.styles);
    const customStyleNames = Array.from(this.customStyles.keys());
    return [...presetStyles, ...customStyleNames];
  }

  // ==================== ====================

  /**
   * ...localStorage
   */
  loadCustomStyles() {
    try {
      const stored = localStorage.getItem('mobile_forum_custom_styles');
      if (stored) {
        const customStylesData = JSON.parse(stored);
        this.customStyles.clear();

        // Map
        Object.entries(customStylesData).forEach(([key, value]) => {
          if (value && value.isCustom) {
            this.customStyles.set(value.name, value);
          }
        });

        console.log(`[Reddit/ForumStyles] ... ${this.customStyles.size} ...`);
      }
    } catch (error) {
      console.error('[Reddit/ForumStyles] error:', error);
      this.customStyles.clear();
    }
  }

  /**
   * Сохранить...localStorage
   */
  saveCustomStyles() {
    try {
      const customStylesData = {};
      this.customStyles.forEach((value, key) => {
        customStylesData[value.id] = value;
      });

      localStorage.setItem('mobile_forum_custom_styles', JSON.stringify(customStylesData));
      console.log(`[Reddit/ForumStyles] Сохранить... ${this.customStyles.size} ...`);
      return true;
    } catch (error) {
      console.error('[Reddit/ForumStyles] Сохранитьerror:', error);
      return false;
    }
  }

  /**
   * ...
   */
  saveCustomStyle(styleData) {
    try {
      if (!styleData.name || !styleData.prompt) {
        throw new Error('error');
      }

      if (this.styles[styleData.name]) {
        throw new Error('error，error');
      }

      // Настройки
      const style = {
        id: styleData.id || 'custom_' + Date.now(),
        name: styleData.name,
        description: styleData.description || '',
        prompt: styleData.prompt,
        createdAt: styleData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCustom: true,
      };

      // Сохранить
      this.customStyles.set(style.name, style);

      // СохранитьlocalStorage
      if (this.saveCustomStyles()) {
        console.log(`[Reddit/ForumStyles] ...Сохранить...: ${style.name}`);
        return style;
      } else {
        throw new Error('Сохранитьerror');
      }
    } catch (error) {
      console.error('[Reddit/ForumStyles] Сохранитьerror:', error);
      throw error;
    }
  }

  /**
   * Удалить...
   */
  deleteCustomStyle(styleName) {
    try {
      if (!this.customStyles.has(styleName)) {
        throw new Error('error');
      }

      this.customStyles.delete(styleName);

      if (this.saveCustomStyles()) {
        console.log(`[Reddit/ForumStyles] ...Удалить...: ${styleName}`);
        return true;
      } else {
        throw new Error('Сохранитьerror');
      }
    } catch (error) {
      console.error('[Reddit/ForumStyles] Удалитьerror:', error);
      throw error;
    }
  }

  /**
   * ...
   */
  getCustomStyle(styleName) {
    return this.customStyles.get(styleName);
  }

  /**
   * ...
   */
  getAllCustomStyles() {
    return Array.from(this.customStyles.values());
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
  exportCustomStyles() {
    try {
      const exportData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        styles: Array.from(this.customStyles.values()),
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('[Reddit/ForumStyles] error:', error);
      throw error;
    }
  }

  /**
   * /* Импорт */...
   */
  importCustomStyles(jsonData, options = {}) {
    try {
      const importData = JSON.parse(jsonData);

      if (!importData.styles || !Array.isArray(importData.styles)) {
        throw new Error('error/* Импорт */error');
      }

      const results = {
        success: 0,
        failed: 0,
        skipped: 0,
        errors: [],
      };

      importData.styles.forEach((style, index) => {
        try {
          if (this.customStyles.has(style.name) && !options.overwrite) {
            results.skipped++;
            return;
          }

          if (!style.name || !style.prompt) {
            throw new Error('error');
          }

          // IDВремя
          const newStyle = {
            ...style,
            id: 'custom_' + Date.now() + '_' + index,
            updatedAt: new Date().toISOString(),
            isCustom: true,
          };

          this.customStyles.set(newStyle.name, newStyle);
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`... "${style.name || 'Unknown'}": ${error.message}`);
        }
      });

      // СохранитьlocalStorage
      if (results.success > 0) {
        this.saveCustomStyles();
      }

      console.log(`[Reddit/ForumStyles] /* Импорт */...: ...${results.success}, ...${results.failed}, ...${results.skipped}`);
      return results;
    } catch (error) {
      console.error('[Reddit/ForumStyles] /* Импорт */error:', error);
      throw error;
    }
  }

  /**
   * ...
   */
  clearCustomStyles() {
    try {
      this.customStyles.clear();
      localStorage.removeItem('mobile_forum_custom_styles');
      console.log('[Reddit/ForumStyles] ...');
      return true;
    } catch (error) {
      console.error('[Reddit/ForumStyles] error:', error);
      return false;
    }
  }
}

window.forumStyles = new ForumStyles();

// Экспорт класса
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForumStyles;
}
