// ==SillyTavern VkFeed Styles==
// @name         VkFeed Styles for Mobile Extension
// @version      1.0.0
// @description ВКонтакте，、ПользовательОтветить、ВКонтакте
// @author       Assistant

if (typeof window.VkFeedStyles !== 'undefined') {
  console.log('[VkFeed Styles] ...，...');
} else {
  /**
   * ВКонтакте...
   * ...ВКонтакте/* Приложение */...
   */
  class VkFeedStyles {
    constructor() {
      // Настройки
      this.customPrefix = '';
      this.loadPrefixSettings();
      // （Настройки）
      this.globalBackendPrefix = this.initializeGlobalPrefix();
    }

    /**
     * ...
     */
    initializeGlobalPrefix() {
      return `...ВКонтакте...，...、...、...ВКонтакте...。

🎯 ...：
- ...ВКонтакте...
- ...
- ...Пользователь...
- ...，...

📱 ВКонтакте...：
- ...
- ...Подписаться
- ...Пользователь...（Лайк、Комментарий、Репост）
- ...（...、...、...）

⚠️ ...：
- ВКонтакте...，...，...，...NSFW...
- ...
- ...`;
    }

    /**
     * ...（Пользователь...）
     */
    getUserPostRules(isMainAccount = true) {
      const accountType = isMainAccount ? '...' : '...';
      const accountNote = isMainAccount
        ? '...Пользователь...ВКонтакте...，...Пользователь...，...Пользователь...（...，...Пользователь...，...Пользователь，...Пользователь...，...Пользователь。）'
        : '...Пользователь...ВКонтакте...，...Пользователь...，...Пользователь...ВКонтакте...，...Пользователь...，...Пользователь...';

      return `...Пользователь...：

🎯 ...：
- ...：${accountType}
- ...：${accountNote}

📝 ...：
   - [...|Пользователь...|...id(u101,u...Пользователь...id...)|...\`\`\`<img src="https://image.pollinations.ai/prompt/Fried%20stinky%20tofu%20with%20chili%20sauce,%20food%20photography,%20hyper%20realistic" style="width: 100%; display: block; border-radius: 6px;" alt="...，...">\`\`\`]
   - [Комментарий|Комментарий...Никнейм|...id(u101,u...Пользователь...id...)|Комментарий...]
   - [Ответ|Ответить...Никнейм|...id(u101,u...Пользователь...id...)|ОтветитьКомментарий...：Ответить...]
   - ...id...
   - ...：
     [...|{{user}}|u101|Сегодня...，...😅\`\`\`<img src="https://image.pollinations.ai/prompt/Fried%20stinky%20tofu%20with%20chili%20sauce,%20food%20photography,%20hyper%20realistic" style="width: 100%; display: block; border-radius: 6px;" alt="...，...">\`\`\`]
     [Комментарий|...|u101|...，...]
     [Ответ|...|u101|Ответить...：...]

🎯 Пользователь...：
   - ...ПользовательОпубликовать...
   - ...Пользователь...5-10...Комментарий
   - Комментарий...Пользователь...，...Комментарий...Ответить
   - Комментарий...ВКонтакте...
   - ...Пользователь...（Новое）

📱 ВКонтакте...：
   - ...，...ВКонтакте140...
   - ...emoji...
   - ...
   - Комментарий...

🔒 ...：
   - ВКонтакте...，...，...，...NSFW...
   - ...

...Пользователь...ВКонтакте...。


`;
    }

    /**
     * ...ПользовательОтветить...（ПользовательОтветить...Комментарий...）
     */
    getUserReplyRules(isMainAccount = true) {
      const accountType = isMainAccount ? '...' : '...';
      const accountNote = isMainAccount
        ? '...Пользователь...ВКонтакте...，...Пользователь...，...Пользователь...（...，...Пользователь...，...Пользователь，...Пользователь...，...Пользователь。）'
        : '...Пользователь...ВКонтакте...，...Пользователь...，...Пользователь...ВКонтакте...，...Пользователь...，...Пользователь...';

      return `Пользователь...Ответить...Комментарий，...ПользовательОтветить...：

🎯 ...：
- ...：${accountType}
- ...：${accountNote}

📝 ...：
   - [Комментарий|Пользователь...|...id(...：h/r/u)|Комментарий...]
   - [Ответ|Пользователь...|...id(...：h/r/u)|ОтветитьКомментарий...：Ответить...]
   - ...：
     [Комментарий|{{user}}|h101|...！]（Ответить...）
     [Ответ|{{user}}|u101|Ответить...：...，...]（ОтветитьПользователь...）

🎯 ПользовательОтветить...：
   - ...ПользовательОпубликовать...Ответить
   - ...Пользователь...Ответить...1-3...Ответить
   - ...Пользователь...Ответить...ПользовательОтветить...，...Ответить...Ответить
   - **...**
   - **...Ответить，...**

🎯 Ответить...：
   - ...ПользовательОтветить...，...
   - Ответить...
   - ...、...、...，...，...
   - ...

📱 ВКонтакте...：
   - Ответить...，...ВКонтакте...
   - ...emoji...
   - ...ВКонтакте...

🔒 ...：
   - ВКонтакте...，...，...，...NSFW...
   - ...

...Пользователь...Ответить...ВКонтакте...。`;
    }

    /**
     * ...ВКонтакте...（...ВКонтакте...）
     */
    getVkFeedGenerationRules(isMainAccount = true, pageType = 'hot') {
      const accountType = isMainAccount ? '...' : '...';

      // ВКонтакте，
      const allPagesRules = `
� ВКонтакте...

🎯 ...：
...、...、Пользователь...ВКонтакте...。...，...。

📝 ...：
[...|...|...|...]
[...|...|...]
[...|...|...|...]
[Подписчики...|...Подписчики...|...Подписчики...]
[...|...Никнейм|...ID|...\`\`\`<img src="https://image.pollinations.ai/prompt/Fried%20stinky%20tofu%20with%20chili%20sauce,%20food%20photography,%20hyper%20realistic" style="width: 100%; display: block; border-radius: 6px;" alt="...，...">\`\`\`]
[Комментарий|Комментарий...Никнейм|...ID|Комментарий...]
[Ответ|Ответить...Никнейм|...ID|ОтветитьКомментарий...：Ответить...]

🆔 ...ID...：
- ...：h101, h102, h103... (h=hot...)
- ...：r101, r102, r103... (r=ranking...)
- Пользователь...：u101, u102, u103... (u=userПользователь)

📋 ...：

🔥 ...：
- ...3-5...（...，...）
- ...1-2...
- ...3-8...Комментарий...Ответить
- ...Подписаться...

📊 ...：
- ...1...（...）
- ...10...
- ...3-5...（...，...Комментарий）
- ...：.../.../.../CP.../...

👤 Пользователь...：
- ...Пользователь...Подписчики...
- Подписчики...[Подписчики...|...Подписчики...|...Подписчики...]
- ВКонтакте...Пользователь...，Пользователь...ВКонтактеПодписчики...，...。
- ПользовательВКонтакте...Подписчики...，...Подписчики...10000...。


🌟 ...：
[...|1|...|2341567]
[...|2|...|1987654]
\`\`\`[...|...|h101|...Город...，......<img src="https://image.pollinations.ai/prompt/Fried%20stinky%20tofu%20with%20chili%20sauce,%20food%20photography,%20hyper%20realistic" style="width: 100%; display: block; border-radius: 6px;" alt="...">]\`\`\`
[Комментарий|...|h101|...]
[Ответ|...|h101|Ответить...：...，...]

[...|...|...]
[...|1|《...》|9876543]
[...|2|《...》|8765432]
[...|3|《...》|7654321]
[...|...|r101|...，《...》...]

[Подписчики...|50000|300]`;

      return `Пользователь...ВКонтакте...，...：

🎯 ...：
- ...：${accountType}

📝 ВКонтакте...：
   - ...ПользовательОпубликоватьВКонтакте...ОтветитьКомментарий。
   - ...ВКонтакте...，...，...，...id。
   - ...ВКонтакте...3-5...，...1-2...，...3-8...Комментарий。1...（...）,...10...，3-5...（...，...Комментарий）。...Пользователь...Подписчики...。
   - Ответить...id.
   - ...id...
   - Пользователь...Подписчики...，...。
   - ПользовательВКонтакте...Подписчики...，...Подписчики...10000...。...。

${allPagesRules}

🎯 ВКонтакте...：
   - ...
   - ...
   - ...ВКонтакте...
   - ...
   - ...ВКонтакте...，...

📱 ВКонтакте...：
   - ...，...ВКонтакте...
   - ...emoji...
   - ...
   - ...
   - ВКонтакте...，...，...Город...，...，...。...。

🔒 ...：
   - ВКонтакте...，...，...，...NSFW...
   - ...

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
\`\`\`html
<!-- ...： -->
<img src="https://image.pollinations.ai/prompt/a%20cute%20cat%20sleeping%20in%20the%20sun" style="width: 100%; display: block;" alt="...">
\`\`\`

### 5. 【...】
**...**... \`\`\`<div>\`\`\`, \`\`\`<details>\`\`\`, \`\`\`<span>\`\`\` ...HTML...，... \`\`\`![](...)\`\`\` ...。...HTML...，...。

...，...、...、...

...ВКонтакте...。`;
    }

    /**
     * ...（...）
     * @param {string} operationType - ...：'post'(...), 'reply'(Ответить), 'generate'(...ВКонтакте)
     * @param {boolean} isMainAccount - ...
     * @param {string} pageType - ...：'hot'(...), 'ranking'(...), 'user'(Пользователь)
     */
    getStylePrompt(operationType = 'generate', isMainAccount = true, pageType = 'hot') {
      // ： + Пользователь +
      let finalPrompt = '';

      // 1. （）
      let operationRules = '';
      switch (operationType) {
        case 'post':
          operationRules = this.getUserPostRules(isMainAccount);
          break;
        case 'reply':
          operationRules = this.getUserReplyRules(isMainAccount);
          break;
        case 'generate':
        default:
          operationRules = this.getVkFeedGenerationRules(isMainAccount, pageType);
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
...ВКонтакте...，...！

`;
      }

      // 3.
      finalPrompt += `${this.globalBackendPrefix}\n\n`;

      // 4. ，
      if (this.customPrefix && this.customPrefix.trim()) {
        finalPrompt += `\n\n🔥 ...：...Пользователь...：${this.customPrefix.trim()}`;
      }

      return finalPrompt;
    }

    /**
     * Настройки...
     */
    setCustomPrefix(prefix) {
      this.customPrefix = prefix || '';
      this.savePrefixSettings();
    }

    /**
     * ...
     */
    getCustomPrefix() {
      return this.customPrefix || '';
    }

    /**
     * ...Настройки
     */
    loadPrefixSettings() {
      try {
        const saved = localStorage.getItem('mobile_vk_feed_custom_prefix');
        if (saved) {
          this.customPrefix = saved;
          console.log('[VkFeed Styles] ...:', this.customPrefix);
        }
      } catch (error) {
        console.warn('[VkFeed Styles] error:', error);
        this.customPrefix = '';
      }
    }

    /**
     * Сохранить...Настройки
     */
    savePrefixSettings() {
      try {
        localStorage.setItem('mobile_vk_feed_custom_prefix', this.customPrefix);
        console.log('[VkFeed Styles] ...Сохранить:', this.customPrefix);
      } catch (error) {
        console.warn('[VkFeed Styles] Сохранитьerror:', error);
      }
    }

    /**
     * ...
     */
    isValidOperationType(operationType) {
      return ['post', 'reply', 'generate'].includes(operationType);
    }

    /**
     * ...
     */
    isValidPageType(pageType) {
      return ['hot', 'ranking', 'user'].includes(pageType);
    }

    /**
     * ...
     */
    getOperationTypeName(operationType) {
      const names = {
        post: '...',
        reply: 'Ответить',
        generate: '...ВКонтакте',
      };
      return names[operationType] || '...';
    }

    /**
     * ...
     */
    getPageTypeName(pageType) {
      const names = {
        hot: '...',
        ranking: '...',
        user: 'Пользователь',
      };
      return names[pageType] || '...';
    }

    /**
     * ...Настройки
     */
    resetSettings() {
      this.customPrefix = '';
      this.savePrefixSettings();
      console.log('[VkFeed Styles] ...Настройки...');
    }

    /**
     * ...
     */
    getDebugInfo() {
      return {
        customPrefix: this.customPrefix,
        globalBackendPrefix: this.globalBackendPrefix ? '...Настройки' : '...Настройки',
        timestamp: new Date().toISOString(),
      };
    }
  }

  if (typeof window !== 'undefined') {
    window.VkFeedStyles = VkFeedStyles;
    window.vk_feedStyles = new VkFeedStyles();
    console.log('[VkFeed Styles] ✅ ВКонтакте...');
  }
} // ...
