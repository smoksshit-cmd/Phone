/**
 * Style Config Manager - ...
 * ...SillyTavern...Data Bank API...global...
 */

// /* Импорт */SillyTavernData Bank API
let getDataBankAttachmentsForSource, getFileAttachment, uploadFileAttachmentToServer, deleteAttachment;
let sillyTavernCoreImported = false;

// （Data Bank）
const STYLE_CONFIG_FILE_NAME = 'ru_mobile_style_config.json';

const DEFAULT_STYLE_CONFIG = {
  homeScreen: {
    backgroundImage: '',
    backgroundImageUrl: '',
    description: '...',
  },
  messageDetailApp: {
    backgroundImage: '',
    backgroundImageUrl: '',
    description: 'Сообщения.../* Приложение */...',
  },
  messagesApp: {
    backgroundImage: '',
    backgroundImageUrl: '',
    backgroundPosition: 'center center',
    description: 'Сообщения/* Приложение */...',
  },
  messageSentAvatar: {
    backgroundImage: '',
    backgroundImageUrl: '',
    backgroundPosition: 'center center',
    rotation: '0',
    scale: '1',
    description: '...СообщенияАватар...',
  },
  messageReceivedAvatars: [
    {
      id: 'default',
      backgroundImage: '',
      backgroundImageUrl: '',
      backgroundPosition: 'center center',
      rotation: '0',
      scale: '1',
      friendId: '',
      name: '...ДрузьяАватар',
      description: '...СообщенияАватар...',
    },
  ],
  // ：Друзья
  friendBackgrounds: [
    {
      id: 'default',
      friendId: '',
      name: '...Друзья...',
      backgroundImage: '',
      backgroundImageUrl: '',
      backgroundPosition: 'center center',
      rotation: '0',
      scale: '1',
      description: 'Друзья...',
    },
  ],
  customStyles: {
    cssText: '',
    description: '...CSS...',
  },
};

// @ts-ignore - StyleConfigManager
if (typeof window.StyleConfigManager === 'undefined') {
  class StyleConfigManager {
    constructor() {
      this.currentConfig = { ...DEFAULT_STYLE_CONFIG };
      this.configLoaded = false;
      this.styleElement = null;
      this.isReady = false;

      console.log('[Style Config Manager] ...');

      this.init();
    }

    async init() {
      try {
        // /* Импорт */SillyTavern
        await this.importSillyTavernCore();

        this.createStyleElement();

        await this.cleanupDuplicateDefaultConfigs();

        await this.loadConfig();

        // /* Приложение */
        this.applyStyles();

        this.isReady = true;
        console.log('[Style Config Manager] ✅ ...');

        this.dispatchReadyEvent();

        // @ts-ignore - Window global property
        window.styleConfigManager = this;
      } catch (error) {
        console.error('[Style Config Manager] error:', error);
      }
    }

    // /* Импорт */SillyTavern
    async importSillyTavernCore() {
      if (sillyTavernCoreImported) {
        return;
      }

      try {
        console.log('[Style Config Manager] 🔍 /* Импорт */SillyTavern Data Bank API...');

        // /* Импорт */chats.js
        const chatsModule = await import('../../../../chats.js');

        getDataBankAttachmentsForSource = chatsModule.getDataBankAttachmentsForSource;
        getFileAttachment = chatsModule.getFileAttachment;
        uploadFileAttachmentToServer = chatsModule.uploadFileAttachmentToServer;
        deleteAttachment = chatsModule.deleteAttachment;

        sillyTavernCoreImported = true;
        console.log('[Style Config Manager] ✅ SillyTavern Data Bank API/* Импорт */...');
      } catch (error) {
        console.warn('[Style Config Manager] ⚠️ /* Импорт */SillyTavernerror，errorlocalStorageerror:', error);
        // Если/* Импорт */，localStorage
      }
    }

    createStyleElement() {
      const oldStyleElement = document.getElementById('mobile-style-config');
      if (oldStyleElement) {
        oldStyleElement.remove();
      }

      this.styleElement = document.createElement('style');
      this.styleElement.id = 'mobile-style-config';
      this.styleElement.type = 'text/css';
      document.head.appendChild(this.styleElement);

      console.log('[Style Config Manager] ...');
    }

    async cleanupDuplicateDefaultConfigs() {
      try {
        if (!sillyTavernCoreImported) {
          console.log('[Style Config Manager] SillyTavern.../* Импорт */，...');
          return;
        }

        console.log('[Style Config Manager] 🧹 ......');

        const globalAttachments = getDataBankAttachmentsForSource('global', true);
        const defaultConfigs = globalAttachments.filter(att => att.name === STYLE_CONFIG_FILE_NAME);

        if (defaultConfigs.length > 1) {
          console.log(`[Style Config Manager] ... ${defaultConfigs.length} ...，......`);

          // ，Удалить
          for (let i = 1; i < defaultConfigs.length; i++) {
            try {
              console.log(`[Style Config Manager] ...Удалить...: ${defaultConfigs[i].name}`);
              await deleteAttachment(defaultConfigs[i], 'global', () => {}, false);
              console.log(`[Style Config Manager] ✅ ...Удалить...: ${defaultConfigs[i].name}`);
            } catch (error) {
              console.warn(`[Style Config Manager] Удалитьerror: ${defaultConfigs[i].name}`, error);
            }
          }

          console.log('[Style Config Manager] ✅ ...');
        } else {
          console.log('[Style Config Manager] ...');
        }
      } catch (error) {
        console.warn('[Style Config Manager] error:', error);
      }
    }

    // （Время）
    async cleanupOldDefaultConfigs() {
      try {
        if (!sillyTavernCoreImported) {
          console.log('[Style Config Manager] SillyTavern.../* Импорт */，...');
          return;
        }

        console.log('[Style Config Manager] 🧹 ......');

        const globalAttachments = getDataBankAttachmentsForSource('global', true);

        const defaultRelatedConfigs = globalAttachments.filter(
          att =>
            att.name === STYLE_CONFIG_FILE_NAME ||
            (att.name.startsWith('mobile_config_') && att.name.includes('_ru_mobile_style_config.json')),
        );

        if (defaultRelatedConfigs.length > 0) {
          console.log(`[Style Config Manager] ... ${defaultRelatedConfigs.length} ...，......`);

          // Удалить
          for (const config of defaultRelatedConfigs) {
            try {
              console.log(`[Style Config Manager] ...Удалить...: ${config.name}`);
              await deleteAttachment(config, 'global', () => {}, false);
              console.log(`[Style Config Manager] ✅ ...Удалить...: ${config.name}`);
            } catch (error) {
              console.warn(`[Style Config Manager] Удалитьerror: ${config.name}`, error);
            }
          }

          console.log('[Style Config Manager] ✅ ...');
        } else {
          console.log('[Style Config Manager] ...');
        }
      } catch (error) {
        console.warn('[Style Config Manager] error:', error);
      }
    }

    // Data Bank
    async loadConfig() {
      try {
        console.log('[Style Config Manager] 🔄 ...Data Bank......');

        if (sillyTavernCoreImported && getDataBankAttachmentsForSource && getFileAttachment) {
          // SillyTavernAPI
          const result = await this.loadConfigFromDataBank();
          if (result) {
            this.configLoaded = true;
            return;
          }
        }

        // ：localStorage
        await this.loadConfigFromLocalStorage();
        this.configLoaded = true;
      } catch (error) {
        console.warn('[Style Config Manager] error，error:', error);
        this.configLoaded = true;
      }
    }

    // Data Bank
    async loadConfigFromDataBank() {
      try {
        console.log('[Style Config Manager] 🔍 ...Data Bank......');

        // /* Список */
        const globalAttachments = getDataBankAttachmentsForSource('global', true);
        console.log('[Style Config Manager] ...:', globalAttachments.length);

        // ，，ВремяJSON
        let configAttachment = globalAttachments.find(att => att.name === STYLE_CONFIG_FILE_NAME);

        if (!configAttachment) {
          console.log('[Style Config Manager] ...，...Время......');
          // Новоеmobile_config_JSON
          const mobileConfigs = globalAttachments
            .filter(att => att.name.startsWith('mobile_config_') && att.name.endsWith('.json'))
            .sort((a, b) => {
              // Время，Новое
              const timeA = parseInt(a.name.match(/mobile_config_(\d+)_/)?.[1] || '0');
              const timeB = parseInt(b.name.match(/mobile_config_(\d+)_/)?.[1] || '0');
              return timeB - timeA;
            });

          console.log(
            '[Style Config Manager] ...Время...:',
            mobileConfigs.map(c => c.name),
          );

          if (mobileConfigs.length > 0) {
            configAttachment = mobileConfigs[0]; // ...Новое...
            console.log('[Style Config Manager] ...Новое...:', configAttachment.name);
          }
        }

        if (configAttachment) {
          console.log('[Style Config Manager] 📁 ...:', configAttachment.name);
          console.log('[Style Config Manager] ...URL:', configAttachment.url);

          // URL
          if (configAttachment.url.endsWith('.txt')) {
            console.error('[Style Config Manager] ❌ errorСохранитьerrorTXTerror，error');
            return false;
          }

          // Скачать
          console.log('[Style Config Manager] 🔄 Скачать......');
          const configContent = await getFileAttachment(configAttachment.url);
          console.log('[Style Config Manager] Скачать...:', configContent ? configContent.length : 0);

          if (configContent && configContent.trim()) {
            try {
              const parsedConfig = JSON.parse(configContent);
              console.log('[Style Config Manager] ✅ JSON...');

              // （，）
              this.currentConfig = this.mergeConfigs(DEFAULT_STYLE_CONFIG, parsedConfig);

              console.log('[Style Config Manager] ✅ ...Data Bank...:', this.currentConfig);
              return true;
            } catch (parseError) {
              console.error('[Style Config Manager] ❌ JSONerror:', parseError);
              console.log('[Style Config Manager] ...JSON...:', configContent.substring(0, 200));
              return false;
            }
          }
        }

        console.log('[Style Config Manager] 📄 Data Bank...，...');
        return false;
      } catch (error) {
        console.error('[Style Config Manager] ❌ errorData Bankerror:', error);
        return false;
      }
    }

    // localStorage
    async loadConfigFromLocalStorage() {
      try {
        const storageKey = `sillytavern_mobile_${STYLE_CONFIG_FILE_NAME}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
          const parsedConfig = JSON.parse(stored);
          this.currentConfig = this.mergeConfigs(DEFAULT_STYLE_CONFIG, parsedConfig);
          console.log('[Style Config Manager] ✅ ...localStorage...');
        } else {
          console.log('[Style Config Manager] 📄 localStorage...，...');
        }
      } catch (error) {
        console.warn('[Style Config Manager] errorlocalStorageerror:', error);
      }
    }

    // СохранитьData Bank
    async saveConfig() {
      try {
        console.log('[Style Config Manager] 💾 Сохранить......');
        console.log('[Style Config Manager] sillyTavernCoreImported:', sillyTavernCoreImported);
        console.log('[Style Config Manager] uploadFileAttachmentToServer:', !!uploadFileAttachmentToServer);

        if (sillyTavernCoreImported && uploadFileAttachmentToServer) {
          console.log('[Style Config Manager] 🔄 ...Сохранить...Data Bank...');
          // SillyTavernAPI
          const success = await this.saveConfigToDataBank();
          console.log('[Style Config Manager] Data BankСохранить...:', success);

          if (success) {
            console.log('[Style Config Manager] ✅ Data BankСохранить...，...Сохранить...localStorage...');
            // СохранитьlocalStorage
            await this.saveConfigToLocalStorage();
            this.applyStyles();
            return true;
          } else {
            console.warn('[Style Config Manager] ⚠️ Data BankСохранитьerror，errorlocalStorageerror');
          }
        } else {
          console.log('[Style Config Manager] ⚠️ SillyTavern API...，...localStorage');
        }

        // ：СохранитьlocalStorage
        console.log('[Style Config Manager] 🔄 Сохранить...localStorage...');
        await this.saveConfigToLocalStorage();
        this.applyStyles();
        console.log('[Style Config Manager] ✅ localStorageСохранить...');
        return true;
      } catch (error) {
        console.error('[Style Config Manager] ❌ Сохранитьerror:', error);
        return false;
      }
    }

    // СохранитьData Bank
    async saveConfigToDataBank() {
      try {
        console.log('[Style Config Manager] 🔄 ...Сохранить...Data Bank...');
        console.log('[Style Config Manager] ...:', STYLE_CONFIG_FILE_NAME);

        const configJson = JSON.stringify(this.currentConfig, null, 2);
        console.log('[Style Config Manager] ...JSON...:', configJson.length);

        await this.cleanupOldDefaultConfigs();

        // ，Время
        const safeFileName = STYLE_CONFIG_FILE_NAME;
        console.log('[Style Config Manager] ...:', safeFileName);

        const file = new File([configJson], safeFileName, { type: 'application/json' });
        console.log('[Style Config Manager] ...:', {
          name: file.name,
          type: file.type,
          size: file.size,
        });

        // ЗагрузитьData Bank
        console.log('[Style Config Manager] 🔄 ...uploadFileAttachmentToServer...');
        const fileUrl = await uploadFileAttachmentToServer(file, 'global');
        console.log('[Style Config Manager] ЗагрузитьНазадURL:', fileUrl);

        // НазадURLJSON
        const isValidJsonUrl =
          fileUrl && (fileUrl.endsWith('.json') || fileUrl.includes(safeFileName.replace('.json', '')));

        if (fileUrl && isValidJsonUrl) {
          console.log('[Style Config Manager] ✅ ...Сохранить...Data Bank (JSON...):', fileUrl);

          // Сохранить
          console.log('[Style Config Manager] 🔍 ...Сохранить......');
          setTimeout(async () => {
            try {
              const globalAttachments = getDataBankAttachmentsForSource('global', true);
              const savedConfig = globalAttachments.find(att => att.name === STYLE_CONFIG_FILE_NAME);
              console.log('[Style Config Manager] ... - ...Сохранить:', !!savedConfig);
              if (savedConfig) {
                console.log('[Style Config Manager] Сохранить...:', savedConfig);
              }
            } catch (verifyError) {
              console.warn('[Style Config Manager] errorСохранитьerror:', verifyError);
            }
          }, 500);

          return true;
        } else if (fileUrl && fileUrl.endsWith('.txt')) {
          console.error('[Style Config Manager] ❌ errorСохранитьerrorTXTerror:', fileUrl);
          console.error(
            '[Style Config Manager] SillyTavern...uploadFileAttachmentToServer...，JSON...Сохранить...TXT',
          );
          return false;
        }

        console.warn('[Style Config Manager] ⚠️ uploadFileAttachmentToServerНазадerrorURLerror');
        return false;
      } catch (error) {
        console.error('[Style Config Manager] ❌ СохранитьerrorData Bankerror:', error);
        return false;
      }
    }

    // СохранитьlocalStorage
    async saveConfigToLocalStorage() {
      try {
        const storageKey = `sillytavern_mobile_${STYLE_CONFIG_FILE_NAME}`;
        const configJson = JSON.stringify(this.currentConfig, null, 2);
        localStorage.setItem(storageKey, configJson);
        console.log('[Style Config Manager] ✅ ...Сохранить...localStorage');
      } catch (error) {
        console.warn('[Style Config Manager] СохранитьerrorlocalStorageerror:', error);
      }
    }

    // /* Приложение */
    applyStyles() {
      if (!this.styleElement) {
        console.warn('[Style Config Manager] error');
        return;
      }

      const css = this.generateCSS();
      this.styleElement.textContent = css;

      console.log('[Style Config Manager] ✅ .../* Приложение */');
      console.log('[Style Config Manager] ...:', JSON.stringify(this.currentConfig, null, 2));

      // URL
      Object.keys(this.currentConfig).forEach(key => {
        const config = this.currentConfig[key];
        if (config && config.backgroundImage) {
          console.log(`[Style Config Manager] ${key} ...URL:`, config.backgroundImage);

          // Еслиhttp/https URL，
          if (config.backgroundImage.startsWith('http')) {
            const img = new Image();
            img.onload = () => console.log(`[Style Config Manager] ✅ ${key} ...`);
            img.onerror = () => console.warn(`[Style Config Manager] ❌ ${key} error:`, config.backgroundImage);
            img.src = config.backgroundImage;
          }
        }
      });

      // /* Приложение */
      this.dispatchStyleAppliedEvent();
    }

    // CSS
    generateCSS() {
      const config = this.currentConfig;

      // URL，
      const formatImageUrl = url => {
        if (!url) return '';

        // Еслиbase64，Назад
        if (url.startsWith('data:')) {
          return url;
        }

        // URL，Назад（.txt，）
        // ЕслиURL，
        if (!url.startsWith('"') && !url.startsWith("'")) {
          return `"${url}"`;
        }

        return url;
      };

      // АватарCSS
      const generateAvatarCSS = (avatarConfig, selector) => {
        if (!avatarConfig || typeof avatarConfig === 'string') {
          // configKey
          const oldConfig = config[avatarConfig];
          if (!oldConfig) return '';

          const backgroundImage = oldConfig.backgroundImage || oldConfig.backgroundImageUrl;
          if (!backgroundImage) return '';

          const rotation = parseFloat(oldConfig.rotation) || 0;
          const scale = parseFloat(oldConfig.scale) || 1;
          const backgroundPosition = oldConfig.backgroundPosition || 'center center';

          return `
${selector} {
    background-image: url(${formatImageUrl(backgroundImage)}) !important;
    background-size: ${scale * 100}% !important;
    background-position: ${backgroundPosition} !important;
    background-repeat: no-repeat !important;
    transform: rotate(${rotation}deg) !important;
    transform-origin: center center !important;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    max-width: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;
}`;
        }

        // avatar
        const backgroundImage = avatarConfig.backgroundImage || avatarConfig.backgroundImageUrl;
        if (!backgroundImage) return '';

        const rotation = parseFloat(avatarConfig.rotation) || 0;
        const scale = parseFloat(avatarConfig.scale) || 1;
        const backgroundPosition = avatarConfig.backgroundPosition || 'center center';

        return `
${selector} {
    background-image: url(${formatImageUrl(backgroundImage)}) !important;
    background-size: ${scale * 100}% !important;
    background-position: ${backgroundPosition} !important;
    background-repeat: no-repeat !important;
    transform: rotate(${rotation}deg) !important;
    transform-origin: center center !important;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    max-width: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;
}`;
      };

      let css = `
/* - StyleConfigManager */
.home-screen {
    ${
      config.homeScreen.backgroundImage
        ? `background-image: url(${formatImageUrl(config.homeScreen.backgroundImage)}) !important;
         background-size: cover !important;
         background-position: center !important;
         background-repeat: no-repeat !important;`
        : config.homeScreen.backgroundImageUrl
        ? `background-image: url(${formatImageUrl(config.homeScreen.backgroundImageUrl)}) !important;
         background-size: cover !important;
         background-position: center !important;
         background-repeat: no-repeat !important;`
        : `background: `
    }
}

.message-detail-app {
    ${
      config.messageDetailApp.backgroundImage
        ? `background-image: url(${formatImageUrl(config.messageDetailApp.backgroundImage)}) !important;
         background-size: cover !important;
         background-position: center !important;
         background-repeat: no-repeat !important;`
        : config.messageDetailApp.backgroundImageUrl
        ? `background-image: url(${formatImageUrl(config.messageDetailApp.backgroundImageUrl)}) !important;
         background-size: cover !important;
         background-position: center !important;
         background-repeat: no-repeat !important;`
        : `background: #;`
    }
}

.messages-app {
    ${
      config.messagesApp.backgroundImage
        ? `background-image: url(${formatImageUrl(config.messagesApp.backgroundImage)}) !important;
         background-size: cover !important;
         background-position: ${config.messagesApp.backgroundPosition || 'center center'} !important;
         background-repeat: no-repeat !important;`
        : config.messagesApp.backgroundImageUrl
        ? `background-image: url(${formatImageUrl(config.messagesApp.backgroundImageUrl)}) !important;
         background-size: cover !important;
         background-position: ${config.messagesApp.backgroundPosition || 'center center'} !important;
         background-repeat: no-repeat !important;`
        : `background: #;`
    }
}

/* СообщенияАватар， */
.message-avatar {
    font-size: 0 !important;
    color: transparent !important;
    text-indent: -9999px !important;
    overflow: hidden !important;
}

/* Аватар */
${(() => {
  const sentAvatarCSS = generateAvatarCSS(config.messageSentAvatar, '.message-sent > .message-avatar');
  console.log(`[Style Config Manager] ...Аватар...:`, config.messageSentAvatar);
  console.log(`[Style Config Manager] ...АватарCSS:`, sentAvatarCSS);
  return sentAvatarCSS;
})()}
${
  config.messageReceivedAvatars
    ? config.messageReceivedAvatars
        .map((avatar, index) => {
          if (avatar.friendId && avatar.friendId.trim()) {
            console.log(
              `[Style Config Manager] ✅ ...АватарCSS: ${avatar.name || `Аватар${index + 1}`} (ID: ${
                avatar.friendId
              })`,
            );
            console.log(`[Style Config Manager] Аватар...:`, avatar);
            // CSS/* Структура */
            const css1 = generateAvatarCSS(
              avatar,
              `.message-item[data-friend-id="${avatar.friendId}"] .message-avatar`,
            );
            const css2 = generateAvatarCSS(avatar, `.message-received #message-avatar-${avatar.friendId}`);
            console.log(`[Style Config Manager] ...CSS1:`, css1);
            console.log(`[Style Config Manager] ...CSS2:`, css2);
            return css1 + '\n' + css2;
          } else {
            console.warn(
              `[Style Config Manager] ⚠️ ...Аватар...: ${avatar.name || `Аватар${index + 1}`} - ...ДрузьяID`,
            );
            return '';
          }
        })
        .join('\n')
    : ''
}
        `.trim();

      // ДрузьяCSS
      if (config.friendBackgrounds && config.friendBackgrounds.length > 0) {
        css += '\n\n/* Друзья... */\n';
        config.friendBackgrounds.forEach(friendBg => {
          if (friendBg.friendId && friendBg.friendId.trim()) {
            const backgroundImage = friendBg.backgroundImage || friendBg.backgroundImageUrl;
            if (backgroundImage) {
              const backgroundPosition = friendBg.backgroundPosition || 'center center';
              const rotation = parseFloat(friendBg.rotation) || 0;
              const scale = parseFloat(friendBg.scale) || 1;

              css += `
.message-detail-content[data-background-id="${friendBg.friendId}"] {
    background-image: url(${formatImageUrl(backgroundImage)}) !important;
    background-size: cover !important;
    background-position: ${backgroundPosition} !important;
    background-repeat: no-repeat !important;
    transform: rotate(${rotation}deg) scale(${scale}) !important;
    transform-origin: center center !important;
}
`;
              console.log(`[Style Config Manager] ✅ ...Друзья...CSS: ${friendBg.name || friendBg.friendId}`);
            }
          }
        });
      }

      // CSS
      if (config.customStyles && config.customStyles.cssText) {
        css += '\n\n/* Пользователь...CSS... */\n' + config.customStyles.cssText;
      }

      console.log('[Style Config Manager] ...CSS:', css);
      return css;
    }

    getConfig() {
      return JSON.parse(JSON.stringify(this.currentConfig));
    }

    updateConfig(key, property, value) {
      // （messageReceivedAvatars、friendBackgrounds）
      if ((key === 'messageReceivedAvatars' || key === 'friendBackgrounds') && property === null) {
        this.currentConfig[key] = value;
        console.log(`[Style Config Manager] ...: ${key} = `, value);
        return true;
      }

      if (this.currentConfig[key] && this.currentConfig[key].hasOwnProperty(property)) {
        this.currentConfig[key][property] = value;
        console.log(`[Style Config Manager] ...: ${key}.${property} = ${value}`);
        return true;
      }

      console.warn(`[Style Config Manager] error: ${key}.${property}`);
      return false;
    }

    updateMultipleConfigs(updates) {
      let hasChanges = false;

      for (const update of updates) {
        if (this.updateConfig(update.key, update.property, update.value)) {
          hasChanges = true;
        }
      }

      return hasChanges;
    }

    mergeConfigs(defaultConfig, userConfig) {
      const merged = JSON.parse(JSON.stringify(defaultConfig));

      for (const key in userConfig) {
        if (userConfig.hasOwnProperty(key) && merged.hasOwnProperty(key)) {
          // （messageReceivedAvatars）
          if (Array.isArray(userConfig[key])) {
            merged[key] = userConfig[key];
          } else if (typeof userConfig[key] === 'object' && userConfig[key] !== null) {
            merged[key] = { ...merged[key], ...userConfig[key] };
          } else {
            merged[key] = userConfig[key];
          }
        }
      }

      // ：messageReceivedAvatar
      if (userConfig.messageReceivedAvatar && !userConfig.messageReceivedAvatars) {
        console.log('[Style Config Manager] ...Аватар...，......');
        merged.messageReceivedAvatars = [
          {
            id: 'migrated_default',
            ...userConfig.messageReceivedAvatar,
            name: '...ДрузьяАватар',
            description: '...СообщенияАватар...',
          },
        ];
      }

      return merged;
    }

    async getAllStyleConfigs() {
      try {
        if (sillyTavernCoreImported && getDataBankAttachmentsForSource) {
          // Data Bank/* Список */
          const globalAttachments = getDataBankAttachmentsForSource('global', true);
          const styleConfigs = globalAttachments.filter(att => att.name.endsWith('_style_config.json'));

          // Время
          const validConfigs = styleConfigs.filter(att => {
            if (att.name === STYLE_CONFIG_FILE_NAME) {
              return true;
            }
            // Время
            if (att.name.startsWith('mobile_config_') && att.name.includes('_ru_mobile_style_config.json')) {
              console.log('[Style Config Manager] ...Время...:', att.name);
              return false;
            }
            // Пользователь
            return true;
          });

          // ，
          const defaultConfigs = validConfigs.filter(att => att.name === STYLE_CONFIG_FILE_NAME);
          const userConfigs = validConfigs.filter(att => att.name !== STYLE_CONFIG_FILE_NAME);

          // Если，
          const finalConfigs = [];
          if (defaultConfigs.length > 0) {
            finalConfigs.push(defaultConfigs[0]); // ...
          }
          finalConfigs.push(...userConfigs);

          console.log(
            '[Style Config Manager] ...:',
            finalConfigs.map(c => c.name),
          );
          return finalConfigs;
        }

        // ：localStorage
        const configs = [];
        const configKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sillytavern_mobile_') && key.endsWith('_style_config.json')) {
            configKeys.push(key);
          }
        }

        const defaultKey = `sillytavern_mobile_${STYLE_CONFIG_FILE_NAME}`;
        const userKeys = configKeys.filter(key => key !== defaultKey);

        if (configKeys.includes(defaultKey)) {
          configs.push({
            name: STYLE_CONFIG_FILE_NAME,
            url: `localStorage://${defaultKey}`,
            source: 'localStorage',
            created: Date.now(),
          });
        }

        // Пользователь
        userKeys.forEach(key => {
          const fileName = key.replace('sillytavern_mobile_', '');
          configs.push({
            name: fileName,
            url: `localStorage://${key}`,
            source: 'localStorage',
            created: Date.now(),
          });
        });

        return configs;
      } catch (error) {
        console.warn('[Style Config Manager] error/* Список */error:', error);
        return [];
      }
    }

    async loadConfigFromFile(fileName) {
      try {
        if (sillyTavernCoreImported && getDataBankAttachmentsForSource && getFileAttachment) {
          // Data Bank
          const globalAttachments = getDataBankAttachmentsForSource('global', true);
          const configAttachment = globalAttachments.find(att => att.name === fileName);

          if (configAttachment) {
            const configContent = await getFileAttachment(configAttachment.url);
            if (configContent && configContent.trim()) {
              const parsedConfig = JSON.parse(configContent);
              this.currentConfig = this.mergeConfigs(DEFAULT_STYLE_CONFIG, parsedConfig);
              this.applyStyles();
              console.log('[Style Config Manager] ✅ ...:', fileName);
              return true;
            }
          }
        }

        // ：localStorage
        const storageKey = `sillytavern_mobile_${fileName}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedConfig = JSON.parse(stored);
          this.currentConfig = this.mergeConfigs(DEFAULT_STYLE_CONFIG, parsedConfig);
          this.applyStyles();
          console.log('[Style Config Manager] ✅ ...localStorage...:', fileName);
          return true;
        }

        return false;
      } catch (error) {
        console.error('[Style Config Manager] error:', error);
        return false;
      }
    }

    // Сохранить
    async saveConfigWithName(configName) {
      try {
        if (!configName || configName.trim() === '') {
          throw new Error('error');
        }

        const cleanName = configName.trim();
        if (cleanName === 'mobile' || cleanName === 'default' || cleanName === '...') {
          throw new Error('error "mobile"、"default" error "error" error，error');
        }

        const fileName = cleanName.endsWith('.json') ? cleanName : `${cleanName}_style_config.json`;

        if (fileName === STYLE_CONFIG_FILE_NAME) {
          throw new Error('error，error');
        }

        if (sillyTavernCoreImported && uploadFileAttachmentToServer) {
          // СохранитьData Bank
          const configJson = JSON.stringify(this.currentConfig, null, 2);
          const file = new File([configJson], fileName, { type: 'application/json' });

          const fileUrl = await uploadFileAttachmentToServer(file, 'global');
          if (fileUrl) {
            console.log('[Style Config Manager] ✅ ...Сохранить...:', fileName);

            // СохранитьlocalStorage
            const storageKey = `sillytavern_mobile_${fileName}`;
            localStorage.setItem(storageKey, configJson);

            return true;
          }
        }

        // ：СохранитьlocalStorage
        const storageKey = `sillytavern_mobile_${fileName}`;
        const configJson = JSON.stringify(this.currentConfig, null, 2);
        localStorage.setItem(storageKey, configJson);
        console.log('[Style Config Manager] ✅ ...Сохранить...localStorage:', fileName);
        return true;
      } catch (error) {
        console.error('[Style Config Manager] Сохранитьerror:', error);
        throw error; // error，error
      }
    }

    // Удалить
    async deleteConfigFile(fileName) {
      try {
        if (sillyTavernCoreImported && getDataBankAttachmentsForSource && deleteAttachment) {
          // Data BankУдалить
          const globalAttachments = getDataBankAttachmentsForSource('global', true);
          const configAttachment = globalAttachments.find(att => att.name === fileName);

          if (configAttachment) {
            console.log('[Style Config Manager] 🗑️ ...Data BankУдалить...:', fileName);
            // SillyTaverndeleteAttachment，confirmfalse
            await deleteAttachment(configAttachment, 'global', () => {}, false);
            console.log('[Style Config Manager] ✅ ...Data BankУдалить...:', fileName);
          }
        }

        // localStorageУдалить
        const storageKey = `sillytavern_mobile_${fileName}`;
        localStorage.removeItem(storageKey);
        console.log('[Style Config Manager] ✅ ...localStorageУдалить...:', fileName);
        return true;
      } catch (error) {
        console.error('[Style Config Manager] Удалитьerror:', error);
        return false;
      }
    }

    // /* Список */HTML
    async generateConfigListSection() {
      const configs = await this.getAllStyleConfigs();

      let configListHTML = '';

      if (configs.length === 0) {
        configListHTML = `
                <div class="no-configs">
                    <p>...Сохранить...</p>
                    <small>Сохранить...</small>
                </div>
            `;
      } else {
        configListHTML = configs
          .map(config => {
            let displayName;
            const isDefault = config.name === STYLE_CONFIG_FILE_NAME;

            if (isDefault) {
              displayName = '...';
            } else if (config.name.startsWith('mobile_config_') && config.name.includes('_ru_mobile_style_config.json')) {
              // Время：mobile_config_timestamp_ru_mobile_style_config.json
              const match = config.name.match(/mobile_config_(\d+)_mobile_style_config\.json/);
              if (match) {
                const timestamp = match[1];
                const date = new Date(parseInt(timestamp));
                displayName = `... (${date.toLocaleString()})`;
              } else {
                displayName = config.name.replace('_style_config.json', '');
              }
            } else {
              // Пользователь
              displayName = config.name.replace('_style_config.json', '');
            }

            const createTime = config.created ? new Date(config.created).toLocaleString() : '...';

            return `
                    <div class="config-item" data-config-file="${config.name}">
                        <div class="config-info">
                            <div class="config-name">
                                ${isDefault ? '🏠' : '📄'} ${displayName}
                                ${isDefault ? '<span class="default-badge">...</span>' : ''}
                            </div>
                            <div class="config-meta">
                                <small>...Время: ${createTime}</small>
                                ${config.source ? `<small>...: ${config.source}</small>` : ''}
                            </div>
                        </div>
                        <div class="config-actions">
                            <button class="config-action-btn load-config" data-config-file="${
                              config.name
                            }" title="...">
                                📥 ...
                            </button>
                            ${
                              !isDefault
                                ? `
                                <button class="config-action-btn delete-config" data-config-file="${config.name}" title="Удалить...">
                                    🗑️ Удалить
                                </button>
                            `
                                : ''
                            }
                        </div>
                    </div>
                `;
          })
          .join('');
      }

      return `
            <div class="config-list-section">
                <div class="section-header">
                    <h3>📋 ...Сохранить...</h3>
                    <p>...Сохранить...</p>
                </div>

                <div class="save-new-config">
                    <div class="save-config-input">
                        <input type="text" id="new-config-name" placeholder="......" maxlength="50">
                        <button id="save-new-config-btn" class="config-btn save-btn">
                            <span class="btn-icon">💾</span>
                            <span>...</span>
                        </button>
                    </div>
                </div>

                <div class="config-list">
                    ${configListHTML}
                </div>

                <div class="config-list-actions">
                    <button id="refresh-config-list" class="config-btn">
                        <span class="btn-icon">🔄</span>
                        <span>Обновить/* Список */</span>
                    </button>
                </div>
            </div>
        `;
    }

    resetToDefault() {
      this.currentConfig = JSON.parse(JSON.stringify(DEFAULT_STYLE_CONFIG));
      console.log('[Style Config Manager] ...');
    }

    // Настройки/* Приложение */HTML
    getSettingsAppContent() {
      const config = this.getConfig(); // ...getConfig()...Новое...

      return `
            <div class="style-config-app">
                <div class="style-config-header">
                    <h2>🎨 ...Настройки</h2>
                    <p>...，...Сохранить...Data Bank</p>
                </div>

                <div class="style-config-tabs">
                    <div class="tab-headers">
                        <button class="tab-header active" data-tab="editor">
                            ✏️ ...Редактировать...
                        </button>
                        <button class="tab-header" data-tab="manager">
                            📋 ...
                        </button>
                    </div>

                    <div class="m-tab-content">
                        <div class="tab-panel active" data-tab="editor">
                <div class="style-config-settings">
                    <div class="image-upload-settings">
                        <h4>🔧 ...ЗагрузитьНастройки</h4>
                        <div class="setting-item">
                            <label>
                                <input type="radio" name="imageUploadMode" value="auto" checked>
                                <span>...</span>
                                <small>...Data Bank，...base64</small>
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="radio" name="imageUploadMode" value="base64">
                                <span>Base64...</span>
                                <small>...base64，...</small>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="style-config-content">
                    ${this.generateConfigSection('homeScreen', '...', config.homeScreen)}
                    ${this.generateFriendBackgroundsSection(config.friendBackgrounds || [])}
                    ${this.generateConfigSection('messagesApp', 'Сообщения/* Приложение */...', config.messagesApp)}
                                ${this.generateAvatarConfigSection(
                                  'messageSentAvatar',
                                  '...СообщенияАватар...',
                                  config.messageSentAvatar,
                                )}
            ${this.generateReceivedAvatarsSection(config.messageReceivedAvatars)}
                    ${this.generateCustomStylesSection('customStyles', '...CSS...', config.customStyles)}
                            </div>
                        </div>

                        <div class="tab-panel" data-tab="manager">
                            <div class="config-list-section">
                                <div class="section-header">
                                    <h3>📋 ...Сохранить...</h3>
                                    <p>...Сохранить...，...Редактировать..."..."...</p>
                                </div>



                                <div class="config-list" id="config-list-container">
                                    <div class="loading-configs">
                                        <div class="loading-icon">⏳</div>
                                        <div class="loading-text">.../* Список */...</div>
                                    </div>
                                </div>

                                <div class="config-list-actions">
                                    <button id="refresh-config-list" class="config-btn">
                                        <span>Обновить</span>
                                    </button>
                                    <button id="export-config" class="config-btn preview-btn">
                                        <span>...</span>
                                    </button>
                                    <button id="import-config" class="config-btn save-btn">
                                        <span>/* Импорт */</span>
                                    </button>
                                </div>

                                <input type="file" id="config-import-input" accept=".json" style="display: none;">
                            </div>
                        </div>


                    </div>
                </div>

                <div class="style-config-footer">
                    <div class="config-actions">
                        <button class="config-btn preview-btn" id="preview-styles">
                            <span>...</span>
                        </button>
                        <button class="config-btn save-btn" id="save-new-config-btn">
                            <span>...</span>
                        </button>
                        <button class="config-btn reset-btn" id="reset-styles">
                            <span>...</span>
                        </button>
                    </div>

                    <div class="config-status" id="config-status">
                        <span class="status-icon">ℹ️</span>
                        <span class="status-text">...</span>
                    </div>
                </div>

                <style>
                /* data-app="settings" */
                [data-app="settings"] {
                    padding: 0 !important;
                    margin: 0 !important;
                    max-height: 100vh !important;
                }

                [data-app="settings"] .style-config-app {
                    margin: 0 !important;
                    padding: 0 !important;
                    max-width: 100% !important;
                    background: transparent !important;
                }

                /* /* Приложение */ */
                .style-config-app {
                    max-width: 1200px;
                    margin: 0 auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    border-radius: 12px;
                }

                /* data-app="settings" */
                [data-app="settings"] .style-config-header {
                    margin-bottom: 12px !important;
                    padding: 12px 16px !important;
                    border-radius: 8px !important;
                }

                [data-app="settings"] .style-config-header h2 {
                    font-size: 16px !important;
                    margin: 0 0 4px 0 !important;
                }

                [data-app="settings"] .style-config-header p {
                    font-size: 12px !important;
                    margin: 0 !important;
                }

                .style-config-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                }

                .style-config-header h2 {
                    margin: 0 0 10px 0;
                    color: #2d3748;
                    font-size: 17px;
                    font-weight: 600;
                }

                .style-config-header p {
                    margin: 0;
                    color: #718096;
                    font-size: 14px;
                }

                /* data-app="settings" */
                [data-app="settings"] .style-config-tabs {
                    border-radius: 8px !important;
                }

                [data-app="settings"] .tab-header {
                    padding: 10px 16px !important;
                    font-size: 14px !important;
                    border-bottom: 2px solid transparent !important;
                }

                [data-app="settings"] .m-tab-content {
                    min-height: auto !important;
                    padding: 0 !important;
                }

                .style-config-tabs {
                    border-radius: 12px;
                    overflow: hidden;
                }

                .tab-headers {
                    display: flex;
                    background: #f7fafc;
                    border-bottom: 1px solid #e2e8f0;
                }

                .tab-header {
                    flex: 1;
                    padding: 16px 24px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    color: #718096;
                    transition: all 0.3s ease;
                    border-bottom: 3px solid transparent;
                }

                .tab-header:hover {
                    background: #edf2f7;
                    color: #4a5568;
                }

                .tab-header.active {
                    background: white;
                    color: #3182ce;
                    border-bottom-color: #3182ce;
                }

                .m-tab-content {
                    min-height: 500px;
                }

                .tab-panel {
                    display: none;
                    animation: fadeIn 0.3s ease;
                }

                .tab-panel.active {
                    display: block;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* data-app="settings" Настройки */
                [data-app="settings"] .style-config-settings {
                    margin-bottom: 16px !important;
                }

                [data-app="settings"] .image-upload-settings {
                    padding: 12px !important;
                    margin-bottom: 12px !important;
                    border-radius: 8px !important;
                }

                [data-app="settings"] .image-upload-settings h4 {
                    font-size: 14px !important;
                    margin: 0 0 8px 0 !important;
                }

                /* Настройки */
                .style-config-settings {
                    margin-bottom: 30px;
                }

                .image-upload-settings {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                }

                .image-upload-settings h4 {
                    margin: 0 0 16px 0;
                    color: #856404;
                    font-size: 16px;
                    font-weight: 600;
                }

                .setting-item {
                    margin-bottom: 12px;
                }

                .setting-item label {
                    display: flex;
                    align-items: flex-start;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: background-color 0.2s;
                }

                .setting-item label:hover {
                    background: rgba(133, 100, 4, 0.1);
                }

                .setting-item input[type="radio"] {
                    margin-right: 12px;
                    margin-top: 2px;
                }

                .setting-item span {
                    font-weight: 500;
                    color: #856404;
                    margin-bottom: 4px;
                }

                .setting-item small {
                    display: block;
                    color: #6c757d;
                    font-size: 13px;
                    line-height: 1.4;
                }

                /* data-app="settings" */
                [data-app="settings"] .config-section {
                    margin-bottom: 12px !important;
                    border-radius: 8px !important;
                    padding: 0 !important;
                }

                [data-app="settings"] .section-header {
                    padding: 12px 16px !important;
                }

                [data-app="settings"] .section-header h3 {
                    font-size: 16px !important;
                    margin: 0 0 4px 0 !important;
                }

                [data-app="settings"] .section-header p {
                    font-size: 12px !important;
                    margin: 0 0 8px 0 !important;
                }

                [data-app="settings"] .section-fields {
                    padding: 12px 16px !important;
                }

                .config-section {
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 0;
                    margin-bottom: 24px;
                    border: 1px solid #e2e8f0;
                }

                .section-header h3 {
                    margin: 0 0 8px 0;
                    color: #2d3748;
                    font-size: 20px;
                    font-weight: 600;
                }

                .section-header p {
                    margin: 0 0 20px 0;
                    color: #718096;
                    font-size: 14px;
                }

                /* data-app="settings" Загрузить */
                [data-app="settings"] .image-upload-field {
                    margin-bottom: 16px !important;
                }

                [data-app="settings"] .image-upload-field label {
                    margin-bottom: 8px !important;
                    font-size: 13px !important;
                }

                [data-app="settings"] .image-upload-container {
                    padding: 12px !important;
                    border-radius: 8px !important;
                }

                [data-app="settings"] .image-preview {
                    min-height: 80px !important;
                    margin-bottom: 8px !important;
                }

                [data-app="settings"] .image-preview img {
                    max-height: 80px !important;
                }

                [data-app="settings"] .upload-btn,
                [data-app="settings"] .remove-btn {
                    padding: 6px 12px !important;
                    font-size: 12px !important;
                }

                /* Загрузить */
                .image-upload-field {
                    margin-bottom: 24px;
                }

                .image-upload-field label {
                    display: block;
                    margin-bottom: 12px;
                    font-weight: 600;
                    color: #4a5568;
                }

                .image-upload-container {
                    border: 2px dashed #cbd5e0;
                    border-radius: 12px;
                    padding: 20px;
                    background: white;
                    transition: all 0.3s ease;
                }

                .image-upload-container:hover {
                    border-color: #3182ce;
                    background: #f7fafc;
                }

                .image-preview {
                    margin-bottom: 16px;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #f7fafc;
                    min-height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .image-preview img {
                    max-width: 100%;
                    max-height: 120px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .no-image {
                    color: #a0aec0;
                    font-size: 18px;
                    padding: 40px;
                    text-align: center;
                }

                .image-upload-controls {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .upload-btn, .remove-btn {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .upload-btn {
                    background: #3182ce;
                    color: white;
                }

                .upload-btn:hover {
                    background: #2c5aa0;
                    transform: translateY(-1px);
                }

                .remove-btn {
                    background: #e53e3e;
                    color: white;
                }

                .remove-btn:hover {
                    background: #c53030;
                    transform: translateY(-1px);
                }

                /* CSS */
                .custom-css-field {
                    margin-bottom: 24px;
                }

                .custom-css-container {
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                    background: white;
                }

                .custom-css-textarea {
                    width: 100%;
                    padding: 16px;
                    border: none;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    background: #1a202c;
                    color: #e2e8f0;
                    resize: vertical;
                    min-height: 200px;
                    border-radius: 0;
                    outline: none;
                }

                .custom-css-textarea:focus {
                    background: #2d3748;
                    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
                }

                .css-help {
                    padding: 12px 16px;
                    background: #f7fafc;
                    border-top: 1px solid #e2e8f0;
                    color: #4a5568;
                }

                /* data-app="settings" */
                [data-app="settings"] .config-btn {
                    padding: 8px 16px !important;
                    font-size: 12px !important;
                    margin-right: 8px !important;
                    border-radius: 6px !important;
                }

                [data-app="settings"] .style-config-footer {
                    padding: 12px 16px !important;
                    position: static !important;
                }

                [data-app="settings"] .config-actions {
                    margin-bottom: 8px !important;
                    gap: 0 !important;
                }

                [data-app="settings"] .config-status {
                    padding: 8px 12px !important;
                    font-size: 12px !important;
                    margin-top: 8px !important;
                }

                .config-btn {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    margin-right: 12px;
                }

                .config-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .save-btn {
                    background: #38a169;
                    color: white;
                }

                .save-btn:hover {
                    background: #2f855a;
                }

                .preview-btn {
                    background: #3182ce;
                    color: white;
                }

                .preview-btn:hover {
                    background: #2c5aa0;
                }

                .reset-btn {
                    background: #ed8936;
                    color: white;
                }

                .reset-btn:hover {
                    background: #dd6b20;
                }

                .danger-btn {
                    background: #e53e3e;
                    color: white;
                }

                .danger-btn:hover {
                    background: #c53030;
                }

                /* /* Отображение статуса */ */
                .config-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    margin-top: 16px;
                }

                .config-status.info {
                    background: #bee3f8;
                    color: #2c5aa0;
                    border: 1px solid #90cdf4;
                }

                .config-status.success {
                    background: #c6f6d5;
                    color: #2f855a;
                    border: 1px solid #9ae6b4;
                }

                .config-status.error {
                    background: #fed7d7;
                    color: #c53030;
                    border: 1px solid #feb2b2;
                }

                .config-status.loading {
                    background: #fefcbf;
                    color: #d69e2e;
                    border: 1px solid #faf089;
                }

                /* /* Список */ */
                .config-item {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                }

                .no-configs {
                    text-align: center;
                    padding: 40px;
                    color: #718096;
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }

                .config-item:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transform: translateY(-1px);
                }

                .config-name {
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 4px;
                    word-break: break-all;
                }

                .default-badge {
                    background: #3182ce;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    margin-left: 8px;
                }

                .config-actions {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                    margin-top:20px
                }

                .config-action-btn {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .config-action-btn.load-config {
                    background: #3182ce;
                    color: white;
                }

                .config-action-btn.delete-config {
                    background: #e53e3e;
                    color: white;
                }

                .config-action-btn:hover {
                    transform: translateY(-1px);
                }

                /* /* Анимация загрузки */ */
                .loading-configs {
                    text-align: center;
                    padding: 40px;
                    color: #718096;
                }

                .loading-icon {
                    font-size: 24px;
                    margin-bottom: 12px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* data-app="settings" Аватар */
                [data-app="settings"] .avatar-config-section {
                    border-left: 3px solid #8b5cf6 !important;
                }

                [data-app="settings"] .avatar-control-field {
                    margin-bottom: 12px !important;
                }

                [data-app="settings"] .avatar-card {
                    margin-bottom: 12px !important;
                }

                [data-app="settings"] .avatar-card-header {
                    padding: 12px 16px !important;
                }

                [data-app="settings"] .avatar-card-content {
                    padding: 12px 16px !important;
                    gap: 12px !important;
                }

                [data-app="settings"] .avatar-preview-circle {
                    width: 32px !important;
                    height: 32px !important;
                }

                [data-app="settings"] .avatar-input,
                [data-app="settings"] .avatar-number {
                    padding: 6px 8px !important;
                    font-size: 12px !important;
                }

                [data-app="settings"] .add-avatar-btn {
                    padding: 8px 16px !important;
                    font-size: 12px !important;
                }

                /* Аватар */
                .avatar-config-section {
                    border-left: 4px solid #8b5cf6;
                    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                }

                .avatar-control-field {
                    margin-bottom: 20px;
                }

                .control-input-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 8px;
                }

                .control-range {
                    flex: 1;
                    height: 6px;
                    border-radius: 3px;
                    background: #e2e8f0;
                    outline: none;
                    cursor: pointer;
                }

                .control-range::-webkit-slider-thumb {
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .control-range::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .control-number {
                    width: 80px;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    text-align: center;
                    font-weight: 500;
                }

                .avatar-preview-field {
                    background: #ffffff;
                    border: 2px dashed #8b5cf6;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    margin-top: 20px;
                }

                .avatar-preview-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                .avatar-preview {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    background: #f8fafc;
                    border-radius: 50%;
                    border: 2px solid #e2e8f0;
                    overflow: hidden;
                    position: relative;
                }

                .avatar-preview-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #f0f0f0;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    transition: all 0.3s ease;
                    border: 1px solid #d1d5db;
                }

                .preview-info {
                    color: #6b7280;
                    font-size: 12px;
                    margin-top: 8px;
                }

                /* Аватар */
                .avatars-section {
                    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
                    border: 2px solid #7c3aed;
                }

                .avatars-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .avatar-card {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .avatar-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
                }

                .avatar-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    border-bottom: 1px solid #e2e8f0;
                }

                .avatar-card-title {
                    flex: 1;
                    margin-right: 12px;
                }

                .avatar-name-input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    background: white;
                    transition: border-color 0.2s;
                }

                .avatar-name-input:focus {
                    outline: none;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
                }

                .avatar-card-actions {
                    display: flex;
                    gap: 8px;
                }

                .avatar-action-btn {
                    padding: 6px 8px;
                    border: none;
                    border-radius: 6px;
                    background: #f3f4f6;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .avatar-action-btn:hover {
                    background: #e5e7eb;
                    transform: scale(1.05);
                }

                .avatar-action-btn.delete-btn:hover {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .avatar-card-content {
                    padding: 20px;
                    display: flex;
                    gap: 20px;
                }

                .avatar-preview-section {
                    flex-shrink: 0;
                    text-align: center;
                }

                .avatar-preview {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .avatar-preview-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #f0f0f0;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    border: 2px solid #e2e8f0;
                    transition: all 0.3s ease;
                }

                .avatar-preview-label {
                    font-size: 12px;
                    color: #6b7280;
                    font-weight: 500;
                }

                .avatar-fields {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* Друзья */
                .friend-backgrounds-section {
                    border-left: 4px solid #10b981;
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                }

                .backgrounds-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .background-card {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .background-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
                }

                .background-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                    border-bottom: 1px solid #e2e8f0;
                }

                .background-card-title {
                    flex: 1;
                    margin-right: 12px;
                }

                .background-name-input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .background-name-input:focus {
                    outline: none;
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                }

                .background-card-actions {
                    display: flex;
                    gap: 8px;
                }

                .background-action-btn {
                    padding: 6px 8px;
                    border: none;
                    border-radius: 6px;
                    background: #f3f4f6;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .background-action-btn:hover {
                    background: #e5e7eb;
                }

                .background-action-btn.delete-btn:hover {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .background-card-content {
                    padding: 20px;
                    display: flex;
                    gap: 20px;
                }

                .background-preview-section {
                    flex-shrink: 0;
                    text-align: center;
                }

                .background-preview {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .background-preview-rect {
                    width: 80px;
                    height: 60px;
                    border-radius: 8px;
                    background: #f0f0f0;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    border: 2px solid #e2e8f0;
                    transition: all 0.3s ease;
                }

                .background-preview-label {
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 4px;
                }

                .background-fields {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .background-input, .background-range, .background-number {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .background-input:focus, .background-number:focus {
                    outline: none;
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                }

                .background-range {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 3px;
                    outline: none;
                }

                .background-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: #10b981;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .background-range::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    background: #10b981;
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .background-file-input {
                    display: none;
                }

                .background-remove-btn {
                    padding: 6px 8px;
                    background: #fee2e2;
                    color: #dc2626;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                }

                .background-remove-btn:hover {
                    background: #fecaca;
                }

                .background-actions {
                    text-align: center;
                    margin-top: 20px;
                }

                .add-background-btn {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .add-background-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                }

                .empty-backgrounds {
                    text-align: center;
                    padding: 40px 20px;
                    color: #6b7280;
                }

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .empty-text {
                    font-size: 16px;
                    font-weight: 500;
                    margin-bottom: 8px;
                }

                .empty-hint {
                    font-size: 14px;
                    opacity: 0.8;
                }

                .avatar-input, .avatar-range, .avatar-number {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .avatar-input:focus, .avatar-number:focus {
                    outline: none;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
                }

                .avatar-range {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 3px;
                    outline: none;
                }

                .avatar-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: #8b5cf6;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .avatar-range::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    background: #8b5cf6;
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .avatar-file-input {
                    display: none;
                }

                .avatar-remove-btn {
                    padding: 6px 8px;
                    border: none;
                    border-radius: 4px;
                    background: #fee2e2;
                    color: #dc2626;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background-color 0.2s;
                }

                .avatar-remove-btn:hover {
                    background: #fecaca;
                }

                .avatar-actions {
                    margin-top: 20px;
                    text-align: center;
                }

                .add-avatar-btn {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .add-avatar-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                }

                /* Статус */
                .field-status {
                    display: block;
                    margin-top: 4px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 500;
                }

                .field-status.valid {
                    background: #d1fae5;
                    color: #065f46;
                    border: 1px solid #10b981;
                }

                .field-status.invalid {
                    background: #fee2e2;
                    color: #991b1b;
                    border: 1px solid #ef4444;
                }

                .config-field input[required]:invalid {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2);
                }

                .config-field input[required]:valid {
                    border-color: #10b981;
                    box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.2);
                }

                /* data-app="settings" */
                [data-app="settings"] .config-field {
                    margin-bottom: 12px !important;
                }

                [data-app="settings"] .config-field label {
                    margin-bottom: 6px !important;
                    font-size: 13px !important;
                }

                [data-app="settings"] .config-input {
                    padding: 8px 12px !important;
                    font-size: 13px !important;
                    border-radius: 6px !important;
                }

                [data-app="settings"] .custom-css-textarea {
                    min-height: 120px !important;
                    padding: 12px !important;
                    font-size: 12px !important;
                }

                [data-app="settings"] .css-help {
                    padding: 8px 12px !important;
                    font-size: 11px !important;
                }

                [data-app="settings"] .config-item {
                    padding: 12px !important;
                    margin-bottom: 8px !important;
                }

                [data-app="settings"] .config-name {
                    font-size: 13px !important;
                    margin-bottom: 2px !important;
                }

                [data-app="settings"] .config-action-btn {
                    padding: 4px 8px !important;
                    font-size: 11px !important;
                }

                /* /* Адаптивный дизайн */ */
                @media (max-width: 768px) {
                    .style-config-app {
                        margin: 10px;
                    }

                    /* data-app="settings" */
                    [data-app="settings"] .style-config-app {
                        margin: 0 !important;
                    }

                    [data-app="settings"] .tab-headers {
                        flex-direction: row !important;
                    }

                    [data-app="settings"] .tab-header {
                        padding: 8px 12px !important;
                        font-size: 12px !important;
                    }

                    [data-app="settings"] .config-actions {
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                    }

                    [data-app="settings"] .config-btn {
                        flex: 1 1 auto !important;
                        min-width: 80px !important;
                        margin-right: 0 !important;
                    }

                    .tab-headers {
                        flex-direction: column;
                    }

                    .config-actions {
                        flex-direction: column;
                        gap: 12px;
                    }

                    .config-btn {
                        width: 100%;
                        justify-content: center;
                        margin-right: 0;
                        margin-bottom: 10px;
                    }

                    .control-input-container {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .control-number {
                        width: 100%;
                    }

                    .avatar-card-content {
                        flex-direction: column;
                        gap: 16px;
                    }

                    .avatar-preview-section {
                        align-self: center;
                    }

                    .avatar-card-header {
                        flex-direction: column;
                        gap: 12px;
                        align-items: stretch;
                    }

                    .avatar-card-actions {
                        justify-content: center;
                    }

                    .background-card-content {
                        flex-direction: column;
                        gap: 16px;
                    }

                    .background-preview-section {
                        align-self: center;
                    }

                    .background-card-header {
                        flex-direction: column;
                        gap: 12px;
                        align-items: stretch;
                    }

                    .background-card-actions {
                        justify-content: center;
                    }
                }

                /* data-app="settings" */
                [data-app="settings"]::-webkit-scrollbar {
                    width: 6px !important;
                }

                [data-app="settings"]::-webkit-scrollbar-track {
                    background: #f1f1f1 !important;
                    border-radius: 3px !important;
                }

                [data-app="settings"]::-webkit-scrollbar-thumb {
                    background: #c1c1c1 !important;
                    border-radius: 3px !important;
                }

                [data-app="settings"]::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8 !important;
                }

                /* Настройки */
                [data-app="settings"] * {
                    box-sizing: border-box !important;
                }

                [data-app="settings"] .style-config-app * {
                    word-wrap: break-word !important;
                    overflow-wrap: break-word !important;
                    max-width:100%
                }
                    .config-list-actions button{margin-bottom:10px}
                </style>
            </div>
        `;
    }

    // /* Список */
    async loadConfigListContent() {
      try {
        const configListContainer = document.getElementById('config-list-container');
        if (!configListContainer) return;

        const configs = await this.getAllStyleConfigs();

        let configListHTML = '';

        if (configs.length === 0) {
          configListHTML = `
                    <div class="no-configs">
                        <p>...Сохранить...</p>
                        <small>Сохранить...</small>
                    </div>
                `;
        } else {
          configListHTML = configs
            .map(config => {
              let displayName;
              const isDefault = config.name === STYLE_CONFIG_FILE_NAME;

              if (isDefault) {
                displayName = '...';
              } else if (
                config.name.startsWith('mobile_config_') &&
                config.name.includes('_ru_mobile_style_config.json')
              ) {
                // Время：mobile_config_timestamp_ru_mobile_style_config.json
                const match = config.name.match(/mobile_config_(\d+)_mobile_style_config\.json/);
                if (match) {
                  const timestamp = match[1];
                  const date = new Date(parseInt(timestamp));
                  displayName = `... (${date.toLocaleString()})`;
                } else {
                  displayName = config.name.replace('_style_config.json', '');
                }
              } else {
                // Пользователь
                displayName = config.name.replace('_style_config.json', '');
              }

              const createTime = config.created ? new Date(config.created).toLocaleString() : '...';

              return `
                        <div class="config-item" data-config-file="${config.name}">
                            <div class="config-info">
                                <div class="config-name">
                                    ${isDefault ? '🏠' : '📄'} ${displayName}
                                    ${isDefault ? '<span class="default-badge">...</span>' : ''}
                                </div>
                                <div class="config-meta">
                                    <small>...Время: ${createTime}</small>
                                    ${config.source ? `<small>...: ${config.source}</small>` : ''}
                                </div>
                            </div>
                            <div class="config-actions">
                                <button class="config-action-btn load-config" data-config-file="${
                                  config.name
                                }" title="...">
                                    📥 ...
                                </button>
                                ${
                                  !isDefault
                                    ? `
                                    <button class="config-action-btn delete-config" data-config-file="${config.name}" title="Удалить...">
                                        🗑️ Удалить
                                    </button>
                                `
                                    : ''
                                }
                            </div>
                        </div>
                    `;
            })
            .join('');
        }

        configListContainer.innerHTML = configListHTML;

        // /* Список */
        this.bindConfigListEvents();

        console.log('[Style Config Manager] .../* Список */...');
      } catch (error) {
        console.error('[Style Config Manager] error/* Список */error:', error);
        const configListContainer = document.getElementById('config-list-container');
        if (configListContainer) {
          configListContainer.innerHTML = `
                    <div class="error-configs">
                        <p>❌ .../* Список */...</p>
                        <small>...Обновить...</small>
                    </div>
                `;
        }
      }
    }

    // HTML
    generateConfigSection(key, title, configObject) {
      let fieldsHTML = '';

      for (const property in configObject) {
        if (property === 'description') continue;

        const value = configObject[property];
        const fieldId = `${key}_${property}`;
        const fieldTitle = this.getFieldTitle(property);

        if (property === 'backgroundImage') {
          // Загрузить
          fieldsHTML += `
                    <div class="config-field image-upload-field">
                        <label for="${fieldId}">${fieldTitle}:</label>
                        <div class="image-upload-container">
                            <div class="image-preview" data-field-id="${fieldId}">
                                ${
                                  value
                                    ? `<img src="${value}" alt="..." />`
                                    : '<div class="no-image">📷 ...</div>'
                                }
                            </div>
                            <div class="image-upload-controls">
                                <input type="file" id="${fieldId}_file" class="image-file-input" accept="image/*" data-target="${fieldId}" style="display: none;">
                                <button type="button" class="upload-btn" onclick="document.getElementById('${fieldId}_file').click()">
                                    📤 ...
                                </button>
                                ${
                                  value
                                    ? `<button type="button" class="remove-btn" data-target="${fieldId}">🗑️ ...</button>`
                                    : ''
                                }
                            </div>
                            <input
                                type="hidden"
                                id="${fieldId}"
                                class="config-input"
                                value="${value}"
                                data-config-key="${key}"
                                data-config-property="${property}"
                            >
                        </div>
                    </div>
                `;
        } else if (property === 'backgroundImageUrl') {
          fieldsHTML += `
                    <div class="config-field">
                        <label for="${fieldId}">${fieldTitle}:</label>
                        <input
                            type="url"
                            id="${fieldId}"
                            class="config-input"
                            value="${value}"
                            data-config-key="${key}"
                            data-config-property="${property}"
                            placeholder="...Адрес..."
                        >
                    </div>
                `;
        } else {
          fieldsHTML += `
                    <div class="config-field">
                        <label for="${fieldId}">${fieldTitle}:</label>
                        <input
                            type="text"
                            id="${fieldId}"
                            class="config-input"
                            value="${value}"
                            data-config-key="${key}"
                            data-config-property="${property}"
                            placeholder="...${fieldTitle}......"
                        >
                    </div>
                `;
        }
      }

      return `
            <div class="config-section">
                <div class="section-header">
                    <h3>${title}</h3>
                    <p>${configObject.description || ''}</p>
                </div>
                <div class="section-fields">
                    ${fieldsHTML}
                </div>
            </div>
        `;
    }

    // АватарHTML
    generateAvatarConfigSection(key, title, configObject) {
      let fieldsHTML = '';

      for (const property in configObject) {
        if (property === 'description') continue;

        const value = configObject[property];
        const fieldId = `${key}_${property}`;
        const fieldTitle = this.getFieldTitle(property);

        if (property === 'backgroundImage') {
          // Загрузить
          fieldsHTML += `
                    <div class="config-field image-upload-field">
                        <label for="${fieldId}">${fieldTitle}:</label>
                        <div class="image-upload-container">
                            <div class="image-preview" data-field-id="${fieldId}">
                                ${
                                  value
                                    ? `<img src="${value}" alt="..." />`
                                    : '<div class="no-image">📷 ...</div>'
                                }
                            </div>
                            <div class="image-upload-controls">
                                <input type="file" id="${fieldId}_file" class="image-file-input" accept="image/*" data-target="${fieldId}" style="display: none;">
                                <button type="button" class="upload-btn" onclick="document.getElementById('${fieldId}_file').click()">
                                    📤 ...
                                </button>
                                ${
                                  value
                                    ? `<button type="button" class="remove-btn" data-target="${fieldId}">🗑️ ...</button>`
                                    : ''
                                }
                            </div>
                            <input
                                type="hidden"
                                id="${fieldId}"
                                class="config-input"
                                value="${value}"
                                data-config-key="${key}"
                                data-config-property="${property}"
                            >
                        </div>
                    </div>
                `;
        } else if (property === 'backgroundImageUrl') {
          fieldsHTML += `
                    <div class="config-field">
                        <label for="${fieldId}">${fieldTitle}:</label>
                        <input
                            type="url"
                            id="${fieldId}"
                            class="config-input"
                            value="${value}"
                            data-config-key="${key}"
                            data-config-property="${property}"
                            placeholder="...Адрес..."
                        >
                    </div>
                `;
        } else if (property === 'rotation') {
          fieldsHTML += `
                    <div class="config-field avatar-control-field">
                        <label for="${fieldId}">${fieldTitle} (...):</label>
                        <div class="control-input-container">
                            <input
                                type="range"
                                id="${fieldId}_range"
                                min="0"
                                max="360"
                                step="1"
                                value="${value}"
                                class="control-range"
                                oninput="document.getElementById('${fieldId}').value = this.value; document.getElementById('${fieldId}').dispatchEvent(new Event('input'));"
                            >
                            <input
                                type="number"
                                id="${fieldId}"
                                class="config-input control-number"
                                value="${value}"
                                data-config-key="${key}"
                                data-config-property="${property}"
                                min="0"
                                max="360"
                                step="1"
                                oninput="document.getElementById('${fieldId}_range').value = this.value;"
                            >
                        </div>
                    </div>
                `;
        } else if (property === 'scale') {
          fieldsHTML += `
                    <div class="config-field avatar-control-field">
                        <label for="${fieldId}">${fieldTitle}:</label>
                        <div class="control-input-container">
                            <input
                                type="range"
                                id="${fieldId}_range"
                                min="0.1"
                                max="3"
                                step="0.1"
                                value="${value}"
                                class="control-range"
                                oninput="document.getElementById('${fieldId}').value = this.value; document.getElementById('${fieldId}').dispatchEvent(new Event('input'));"
                            >
                            <input
                                type="number"
                                id="${fieldId}"
                                class="config-input control-number"
                                value="${value}"
                                data-config-key="${key}"
                                data-config-property="${property}"
                                min="0.1"
                                max="3"
                                step="0.1"
                                oninput="document.getElementById('${fieldId}_range').value = this.value;"
                            >
                        </div>
                    </div>
                `;
        } else if (property === 'friendId') {
          // ДрузьяID
          fieldsHTML += `
                    <div class="config-field">
                        <label for="${fieldId}">${fieldTitle}:</label>
                        <input
                            type="text"
                            id="${fieldId}"
                            class="config-input"
                            value="${value}"
                            data-config-key="${key}"
                            data-config-property="${property}"
                            placeholder="...ДрузьяID（...：22333）"
                        >
                        <small>💡 ...ID...CSS...：.message-received > .message-avatar#message-avatar-{ID}</small>
                    </div>
                `;
        } else {
          fieldsHTML += `
                    <div class="config-field">
                        <label for="${fieldId}">${fieldTitle}:</label>
                        <input
                            type="text"
                            id="${fieldId}"
                            class="config-input"
                            value="${value}"
                            data-config-key="${key}"
                            data-config-property="${property}"
                            placeholder="...${fieldTitle}......"
                        >
                    </div>
                `;
        }
      }

      const previewHTML = `
            <div class="config-field avatar-preview-field">
                <label>...:</label>
                <div class="avatar-preview-container">
                    <div class="avatar-preview" id="${key}_preview">
                        <div class="avatar-preview-circle"></div>
                    </div>
                    <div class="preview-info">
                        <small>40px × 40px ...</small>
                    </div>
                </div>
            </div>
        `;

      return `
            <div class="config-section avatar-config-section">
                <div class="section-header">
                    <h3>${title}</h3>
                    <p>${configObject.description || ''}</p>
                </div>
                <div class="section-fields">
                    ${fieldsHTML}
                    ${previewHTML}
                </div>
            </div>
        `;
    }

    // ДрузьяHTML
    generateFriendBackgroundsSection(backgroundsArray) {
      if (!backgroundsArray || !Array.isArray(backgroundsArray)) {
        backgroundsArray = [];
      }

      const backgroundCards = backgroundsArray
        .map((background, index) => {
          return this.generateSingleBackgroundCard(background, index, backgroundsArray.length);
        })
        .join('');

      return `
            <div class="config-section friend-backgrounds-section">
                <div class="section-header">
                    <h3>🎨 Друзья...</h3>
                    <p>...ДрузьяНастройки...，...data-background-id...</p>
                </div>

                <div class="backgrounds-container">
                    ${backgroundCards}
                    ${
                      backgroundsArray.length === 0
                        ? `
                        <div class="empty-backgrounds">
                            <div class="empty-icon">🖼️</div>
                            <div class="empty-text">...Друзья...</div>
                            <div class="empty-hint">...Друзья...Настройки...</div>
                        </div>
                    `
                        : ''
                    }
                </div>

                <div class="background-actions">
                    <button class="config-btn add-background-btn" onclick="window.styleConfigManager.addNewFriendBackground()">
                        <span class="btn-icon">➕</span>
                        <span>...</span>
                    </button>
                </div>
            </div>
        `;
    }

    // СообщенияАватарHTML（Аватар）
    generateReceivedAvatarsSection(avatarsArray) {
      if (!avatarsArray || !Array.isArray(avatarsArray)) {
        return '';
      }

      const avatarCards = avatarsArray
        .map((avatar, index) => {
          return this.generateSingleAvatarCard(avatar, index, avatarsArray.length);
        })
        .join('');

      return `
            <div class="config-section avatars-section">
                <div class="section-header">
                    <h3>🎭 ...СообщенияАватар...</h3>
                    <p>...Друзья...АватарНастройки...</p>
                </div>

                <div class="avatars-container">
                    ${avatarCards}
                </div>

                <div class="avatar-actions">
                    <button class="config-btn add-avatar-btn" onclick="window.styleConfigManager.addNewAvatar()">
                        <span class="btn-icon">➕</span>
                        <span>...Аватар</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Друзья
    generateSingleBackgroundCard(background, index, backgroundsLength) {
      const friendId = background.friendId || '';
      const name = background.name || `Друзья... ${index + 1}`;
      const backgroundImage = background.backgroundImage || background.backgroundImageUrl || '';
      const rotation = background.rotation || '0';
      const scale = background.scale || '1';
      const backgroundPosition = background.backgroundPosition || 'center center';

      const previewImageUrl = backgroundImage ? `url(${backgroundImage})` : 'none';
      const previewTransform = `rotate(${rotation}deg) scale(${scale})`;

      return `
            <div class="background-card" data-background-index="${index}">
                <div class="background-card-header">
                    <div class="background-card-title">
                        <input type="text" class="background-name-input"
                               data-background-index="${index}"
                               data-property="name"
                               value="${name}"
                               placeholder="...">
                    </div>
                    <div class="background-card-actions">
                        <button class="background-action-btn collapse-btn" onclick="window.styleConfigManager.toggleBackgroundCard(${index})" title=".../...">
                            <span>📁</span>
                        </button>
                        ${
                          backgroundsLength > 1
                            ? `
                        <button class="background-action-btn delete-btn" onclick="window.styleConfigManager.deleteFriendBackground(${index})" title="Удалить">
                            <span>🗑️</span>
                        </button>
                        `
                            : ''
                        }
                    </div>
                </div>

                <div class="background-card-content">
                    <div class="background-preview-section">
                        <div class="background-preview" data-background-index="${index}">
                            <div class="background-preview-rect"
                                 style="background-image: ${previewImageUrl}; background-position: ${backgroundPosition}; transform: ${previewTransform};">
                            </div>
                        </div>
                        <div class="background-preview-label">...</div>
                    </div>

                    <div class="background-fields">
                        <div class="config-field">
                            <label>ДрузьяID (...):</label>
                            <input type="text"
                                   class="config-input background-input"
                                   data-background-index="${index}"
                                   data-property="friendId"
                                   value="${friendId}"
                                   placeholder="558778"
                                   required>
                            <small>⚠️ <strong>...ДрузьяID...</strong> - ...data-background-id...</small>
                            ${
                              friendId
                                ? `<small class="field-status valid">✅ ... - CSS...: .message-detail-content[data-background-id="${friendId}"]</small>`
                                : `<small class="field-status invalid">❌ ... - ...ДрузьяID</small>`
                            }
                        </div>

                        <div class="config-field">
                            <label>...:</label>
                            <div class="image-input-container">
                                <input type="file"
                                       class="image-file-input background-file-input"
                                       data-background-index="${index}"
                                       data-property="backgroundImage"
                                       accept="image/*">
                                <button class="upload-btn" onclick="this.previousElementSibling.click()">
                                    <span>📁</span>
                                    <span>...</span>
                                </button>
                                ${
                                  backgroundImage
                                    ? `
                                <button class="remove-btn background-remove-btn"
                                        data-background-index="${index}"
                                        data-property="backgroundImage">
                                    <span>🗑️</span>
                                </button>
                                `
                                    : ''
                                }
                            </div>
                        </div>

                        <div class="config-field">
                            <label>...:</label>
                            <input type="text"
                                   class="config-input background-input"
                                   data-background-index="${index}"
                                   data-property="backgroundImageUrl"
                                   value="${background.backgroundImageUrl || ''}"
                                   placeholder="https://example.com/image.jpg">
                        </div>

                        <div class="config-field">
                            <label>...:</label>
                            <input type="text"
                                   class="config-input background-input"
                                   data-background-index="${index}"
                                   data-property="backgroundPosition"
                                   value="${backgroundPosition}"
                                   placeholder="center center">
                            <small>...: center center, top left, 50% 25%</small>
                        </div>

                        <div class="config-field range-field">
                            <label>...: <span class="range-value">${rotation}°</span></label>
                            <div class="range-container">
                                <input type="range"
                                       class="config-range background-range"
                                       data-background-index="${index}"
                                       data-property="rotation"
                                       min="0" max="360" step="1" value="${rotation}">
                                <input type="number"
                                       class="range-number background-number"
                                       data-background-index="${index}"
                                       data-property="rotation"
                                       min="0" max="360" step="1" value="${rotation}">
                            </div>
                        </div>

                        <div class="config-field range-field">
                            <label>...: <span class="range-value">${scale}x</span></label>
                            <div class="range-container">
                                <input type="range"
                                       class="config-range background-range"
                                       data-background-index="${index}"
                                       data-property="scale"
                                       min="0.1" max="3" step="0.1" value="${scale}">
                                <input type="number"
                                       class="range-number background-number"
                                       data-background-index="${index}"
                                       data-property="scale"
                                       min="0.1" max="3" step="0.1" value="${scale}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Аватар
    generateSingleAvatarCard(avatar, index, avatarsLength) {
      const friendId = avatar.friendId || '';
      const name = avatar.name || `ДрузьяАватар ${index + 1}`;
      const backgroundImage = avatar.backgroundImage || avatar.backgroundImageUrl || '';
      const rotation = avatar.rotation || '0';
      const scale = avatar.scale || '1';

      const previewImageUrl = backgroundImage ? `url(${backgroundImage})` : 'none';
      const previewTransform = `rotate(${rotation}deg) scale(${scale})`;

      return `
            <div class="avatar-card" data-avatar-index="${index}">
                <div class="avatar-card-header">
                    <div class="avatar-card-title">
                        <input type="text" class="avatar-name-input"
                               data-avatar-index="${index}"
                               data-property="name"
                               value="${name}"
                               placeholder="Аватар...">
                    </div>
                    <div class="avatar-card-actions">
                        <button class="avatar-action-btn collapse-btn" onclick="window.styleConfigManager.toggleAvatarCard(${index})" title=".../...">
                            <span>📁</span>
                        </button>
                        ${
                          avatarsLength > 1
                            ? `
                        <button class="avatar-action-btn delete-btn" onclick="window.styleConfigManager.deleteAvatar(${index})" title="Удалить">
                            <span>🗑️</span>
                        </button>
                        `
                            : ''
                        }
                    </div>
                </div>

                <div class="avatar-card-content">
                    <div class="avatar-preview-section">
                        <div class="avatar-preview" data-avatar-index="${index}">
                            <div class="avatar-preview-circle"
                                 style="background-image: ${previewImageUrl}; transform: ${previewTransform};">
                            </div>
                        </div>
                        <div class="avatar-preview-label">40×40px ...</div>
                    </div>

                    <div class="avatar-fields">
                        <div class="config-field">
                            <label>ДрузьяID (...):</label>
                            <input type="text"
                                   class="config-input avatar-input"
                                   data-avatar-index="${index}"
                                   data-property="friendId"
                                   value="${friendId}"
                                   placeholder="558778"
                                   required>
                            <small>⚠️ <strong>...ДрузьяID...</strong> - ...Друзья...Аватар...</small>
                                                         ${
                                                           friendId
                                                             ? `<small class="field-status valid">✅ ... - CSS...: [data-friend-id="${friendId}"] ... #message-avatar-${friendId}</small>`
                                                             : `<small class="field-status invalid">❌ ... - ...ДрузьяID</small>`
                                                         }
                        </div>

                        <div class="config-field">
                            <label>...:</label>
                            <div class="image-input-container">
                                <input type="file"
                                       class="image-file-input avatar-file-input"
                                       data-avatar-index="${index}"
                                       data-property="backgroundImage"
                                       accept="image/*">
                                <button class="upload-btn" onclick="this.previousElementSibling.click()">
                                    <span>📁</span>
                                    <span>...</span>
                                </button>
                                ${
                                  backgroundImage
                                    ? `
                                <button class="remove-btn avatar-remove-btn"
                                        data-avatar-index="${index}"
                                        data-property="backgroundImage">
                                    <span>🗑️</span>
                                </button>
                                `
                                    : ''
                                }
                            </div>
                        </div>

                        <div class="config-field">
                            <label>...:</label>
                            <input type="text"
                                   class="config-input avatar-input"
                                   data-avatar-index="${index}"
                                   data-property="backgroundImageUrl"
                                   value="${avatar.backgroundImageUrl || ''}"
                                   placeholder="https://example.com/image.jpg">
                        </div>

                        <div class="config-field range-field">
                            <label>...: <span class="range-value">${rotation}°</span></label>
                            <div class="range-container">
                                <input type="range"
                                       class="config-range avatar-range"
                                       data-avatar-index="${index}"
                                       data-property="rotation"
                                       min="0" max="360" step="1" value="${rotation}">
                                <input type="number"
                                       class="range-number avatar-number"
                                       data-avatar-index="${index}"
                                       data-property="rotation"
                                       min="0" max="360" step="1" value="${rotation}">
                            </div>
                        </div>

                        <div class="config-field range-field">
                            <label>...: <span class="range-value">${scale}x</span></label>
                            <div class="range-container">
                                <input type="range"
                                       class="config-range avatar-range"
                                       data-avatar-index="${index}"
                                       data-property="scale"
                                       min="0.1" max="3" step="0.1" value="${scale}">
                                <input type="number"
                                       class="range-number avatar-number"
                                       data-avatar-index="${index}"
                                       data-property="scale"
                                       min="0.1" max="3" step="0.1" value="${scale}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // HTML
    generateCustomStylesSection(key, title, configObject) {
      const value = configObject.cssText || '';
      const fieldId = `${key}_cssText`;

      return `
            <div class="config-section">
                <div class="section-header">
                    <h3>${title}</h3>
                    <p>${configObject.description || ''}</p>
                </div>
                <div class="section-fields">
                    <div class="config-field custom-css-field">
                        <label for="${fieldId}">...CSS...:</label>
                        <div class="custom-css-container">
                            <textarea
                                id="${fieldId}"
                                class="config-input custom-css-textarea"
                                data-config-key="${key}"
                                data-config-property="cssText"
                                placeholder="/* ...CSS... */&#10;.your-custom-class {&#10;    /* ... */&#10;}"
                                rows="8"
                            >${value}</textarea>
                            <div class="css-help">
                                <small>💡 ...：...CSS...Сохранить，.../* Приложение */...</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Аватар
    addNewAvatar() {
      const config = this.getConfig();
      if (!config.messageReceivedAvatars) {
        config.messageReceivedAvatars = [];
      }

      const newAvatar = {
        id: 'avatar_' + Date.now(),
        backgroundImage: '',
        backgroundImageUrl: '',
        rotation: '0',
        scale: '1',
        friendId: '',
        name: `ДрузьяАватар ${config.messageReceivedAvatars.length + 1}`,
        description: '...СообщенияАватар...',
      };

      config.messageReceivedAvatars.push(newAvatar);
      this.updateConfig('messageReceivedAvatars', null, config.messageReceivedAvatars);

      this.refreshEditorInterface();
      this.updateStatus('...Аватар...，...Сохранить...', 'info');
    }

    // УдалитьАватар
    deleteAvatar(index) {
      const config = this.getConfig();
      if (!config.messageReceivedAvatars || config.messageReceivedAvatars.length <= 1) {
        this.updateStatus('...Аватар...', 'warning');
        return;
      }

      if (confirm('ОК...Удалить...Аватар...？')) {
        config.messageReceivedAvatars.splice(index, 1);
        this.updateConfig('messageReceivedAvatars', null, config.messageReceivedAvatars);

        this.refreshEditorInterface();
        this.updateStatus('УдалитьАватар...，...Сохранить...', 'info');
      }
    }

    // Друзья
    addNewFriendBackground() {
      const config = this.getConfig();
      if (!config.friendBackgrounds) {
        config.friendBackgrounds = [];
      }

      const newBackground = {
        id: 'friend_bg_' + Date.now(),
        friendId: '',
        name: `Друзья... ${config.friendBackgrounds.length + 1}`,
        backgroundImage: '',
        backgroundImageUrl: '',
        backgroundPosition: 'center center',
        rotation: '0',
        scale: '1',
        description: 'Друзья...',
      };

      config.friendBackgrounds.push(newBackground);
      this.updateConfig('friendBackgrounds', null, config.friendBackgrounds);

      this.refreshEditorInterface();
      this.updateStatus('...Друзья...，...Сохранить...', 'info');
    }

    // УдалитьДрузья
    deleteFriendBackground(index) {
      const config = this.getConfig();
      if (!config.friendBackgrounds || config.friendBackgrounds.length === 0) {
        this.updateStatus('...Удалить...', 'warning');
        return;
      }

      if (confirm('ОК...Удалить...Друзья...？')) {
        config.friendBackgrounds.splice(index, 1);
        this.updateConfig('friendBackgrounds', null, config.friendBackgrounds);

        this.refreshEditorInterface();
        this.updateStatus('УдалитьДрузья...，...Сохранить...', 'info');
      }
    }

    // Друзья/Статус
    toggleBackgroundCard(index) {
      const card = document.querySelector(`[data-background-index="${index}"]`);
      if (card) {
        const content = card.querySelector('.background-card-content');
        const button = card.querySelector('.collapse-btn span');

        if (content.style.display === 'none') {
          content.style.display = 'block';
          button.textContent = '📁';
        } else {
          content.style.display = 'none';
          button.textContent = '📂';
        }
      }
    }

    // /Аватар
    toggleAvatarCard(index) {
      const card = document.querySelector(`[data-avatar-index="${index}"]`);
      if (card) {
        // @ts-ignore - HTMLElement style access
        const content = card.querySelector('.avatar-card-content');
        const btn = card.querySelector('.collapse-btn span');

        if (content && btn) {
          // @ts-ignore - HTMLElement style access
          if (content.style.display === 'none') {
            // @ts-ignore - HTMLElement style access
            content.style.display = 'block';
            btn.textContent = '📁';
          } else {
            // @ts-ignore - HTMLElement style access
            content.style.display = 'none';
            btn.textContent = '📂';
          }
        }
      }
    }

    getFieldTitle(property) {
      const titleMap = {
        background: '...',
        backgroundImage: '...',
        backgroundImageUrl: '...',
        borderRadius: '...',
        color: '...',
        fontSize: '...',
        padding: '...',
        margin: '...',
        rotation: '...',
        scale: '...',
        friendId: 'ДрузьяID',
      };

      return titleMap[property] || property;
    }

    // Настройки/* Приложение */
    bindSettingsEvents() {
      document.querySelectorAll('.tab-header').forEach(tab => {
        tab.addEventListener('click', e => {
          this.handleTabSwitch(e.target);
        });
      });

      // /* Поле ввода */
      document.querySelectorAll('.config-input').forEach(input => {
        input.addEventListener('input', e => {
          this.handleInputChange(e.target);
        });
      });

      // Загрузить
      document.querySelectorAll('.image-file-input').forEach(input => {
        input.addEventListener('change', e => {
          this.handleImageUpload(e.target);
        });
      });

      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          this.handleImageRemove(e.target);
        });
      });

      const previewBtn = document.getElementById('preview-styles');
      if (previewBtn) {
        previewBtn.addEventListener('click', () => {
          this.previewStyles();
        });
      }

      // （Сохранить）
      const saveNewBtn = document.getElementById('save-new-config-btn');
      if (saveNewBtn) {
        saveNewBtn.addEventListener('click', async () => {
          await this.handleSaveNewConfigWithPrompt();
        });
      }

      const resetBtn = document.getElementById('reset-styles');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.resetStyles();
        });
      }

      // ：，

      // Обновить/* Список */
      const refreshBtn = document.getElementById('refresh-config-list');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
          await this.handleRefreshConfigList();
        });
      }

      const exportBtn = document.getElementById('export-config');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          this.handleExportConfig();
        });
      }

      // /* Импорт */
      const importBtn = document.getElementById('import-config');
      const importInput = document.getElementById('config-import-input');
      if (importBtn && importInput) {
        importBtn.addEventListener('click', () => {
          importInput.click();
        });

        importInput.addEventListener('change', e => {
          this.handleImportConfig(e.target);
        });
      }

      // ：/* Поле ввода */

      // /* Список */（）
      this.bindConfigListEvents();

      // CSS textarea
      document.querySelectorAll('.custom-css-textarea').forEach(textarea => {
        textarea.addEventListener('input', e => {
          this.handleInputChange(e.target);
        });
      });

      // Аватар
      this.bindAvatarPreviewEvents();

      // /* Список */（，DOM）
      setTimeout(() => {
        this.loadConfigListContent();
        this.updateAllAvatarPreviews(); // ...Аватар...
      }, 100);
    }

    handleTabSwitch(tabHeader) {
      // @ts-ignore - EventTarget getAttribute
      const targetTab = tabHeader.getAttribute('data-tab');

      // Статус
      document.querySelectorAll('.tab-header').forEach(header => {
        header.classList.remove('active');
      });
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
      });

      tabHeader.classList.add('active');
      document.querySelector(`[data-tab="${targetTab}"].tab-panel`).classList.add('active');

      // Если，/* Список */
      if (targetTab === 'manager') {
        this.loadConfigListContent();
      }
    }

    // Сохранить（）
    async handleSaveNewConfigWithPrompt() {
      const configName = prompt('...：', '');

      if (!configName) {
        this.updateStatus('...ОтменитьСохранить', 'info');
        return;
      }

      const trimmedName = configName.trim();

      if (!trimmedName) {
        this.updateStatus('...', 'error');
        return;
      }

      if (trimmedName.length > 50) {
        this.updateStatus('...（...50...）', 'error');
        return;
      }

      this.updateStatus('...Сохранить......', 'loading');

      try {
        const success = await this.saveConfigWithName(trimmedName);
        if (success) {
          this.updateStatus('...Сохранить...！', 'success');
          // Если，Обновить/* Список */
          const activeTab = document.querySelector('.tab-header.active');
          if (activeTab && activeTab.getAttribute('data-tab') === 'manager') {
            await this.handleRefreshConfigList();
          }
        }
      } catch (error) {
        console.error('[Style Config Manager] Сохранитьerror:', error);
        this.updateStatus(`Сохранить...：${error.message}`, 'error');
      }
    }

    async handleLoadConfig(fileName) {
      if (!fileName) return;

      this.updateStatus('......', 'loading');

      const success = await this.loadConfigFromFile(fileName);
      if (success) {
        // ОбновитьРедактировать
        await this.refreshEditorInterface();

        const isDefaultConfig = fileName === STYLE_CONFIG_FILE_NAME;

        if (isDefaultConfig) {
          this.updateStatus('...！', 'success');
        } else {
          // ，Пользователь
          const loadChoice = await this.showLoadOptionsDialog(fileName);

          if (loadChoice === 'setDefault') {
            this.updateStatus('......', 'loading');

            console.log('[Style Config Manager] 🔄 ...Сохранить...');
            console.log('[Style Config Manager] ...:', JSON.stringify(this.currentConfig, null, 2));

            // Сохранить
            const saveSuccess = await this.saveConfig();

            console.log('[Style Config Manager] Сохранить...:', saveSuccess);

            if (saveSuccess) {
              this.updateStatus('...！Обновить...', 'success');
              console.log('[Style Config Manager] ✅ ...Сохранить...');

              // Сохранить
              console.log('[Style Config Manager] 🔍 ...Сохранить......');
              if (sillyTavernCoreImported && getDataBankAttachmentsForSource) {
                const globalAttachments = getDataBankAttachmentsForSource('global', true);
                const defaultConfig = globalAttachments.find(att => att.name === 'ru_mobile_style_config.json');
                console.log('[Style Config Manager] ...:', !!defaultConfig);
                if (defaultConfig) {
                  console.log('[Style Config Manager] ...:', defaultConfig);
                }
              }
            } else {
              this.updateStatus('...，...', 'error');
              console.error('[Style Config Manager] ❌ Сохранитьerror');
            }
          } else {
            this.updateStatus('...！...，Обновить...', 'success');
          }
        }
      } else {
        this.updateStatus('...', 'error');
      }
    }

    // Удалить
    async handleDeleteConfig(fileName) {
      if (!fileName) return;

      if (!confirm(`ОК...Удалить..."${fileName}"...？...。`)) {
        return;
      }

      this.updateStatus('...Удалить......', 'loading');

      const success = await this.deleteConfigFile(fileName);
      if (success) {
        this.updateStatus('...Удалить...！', 'success');
        // Обновить/* Список */
        await this.handleRefreshConfigList();
      } else {
        this.updateStatus('Удалить...', 'error');
      }
    }

    // Обновить/* Список */
    async handleRefreshConfigList() {
      await this.loadConfigListContent();
      console.log('[Style Config Manager] .../* Список */...Обновить');
    }

    handleExportConfig() {
      try {
        const configData = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          config: this.currentConfig,
          description: '...',
        };

        const configJson = JSON.stringify(configData, null, 2);
        const blob = new Blob([configJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Скачать
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `mobile-style-config-${new Date().toISOString().split('T')[0]}.json`;
        downloadLink.style.display = 'none';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // URL
        URL.revokeObjectURL(url);

        this.updateStatus('...！', 'success');
        console.log('[Style Config Manager] ...:', configData);
      } catch (error) {
        console.error('[Style Config Manager] error:', error);
        this.updateStatus('...', 'error');
      }
    }

    // /* Импорт */
    async handleImportConfig(fileInput) {
      try {
        // @ts-ignore - HTMLInputElement files property
        const file = fileInput.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
          this.updateStatus('...JSON...', 'error');
          return;
        }

        this.updateStatus('.../* Импорт */......', 'loading');

        const fileContent = await this.fileToText(file);
        const importData = JSON.parse(fileContent);

        if (!importData.config) {
          // Еслиconfig，
          if (typeof importData === 'object' && importData.mobilePhoneFrame) {
            this.currentConfig = this.mergeConfigs(DEFAULT_STYLE_CONFIG, importData);
          } else {
            throw new Error('error');
          }
        } else {
          this.currentConfig = this.mergeConfigs(DEFAULT_STYLE_CONFIG, importData.config);
        }

        // /* Приложение */
        this.applyStyles();

        // ОбновитьРедактировать
        await this.refreshEditorInterface();

        // Пользователь/* Импорт */
        const importChoice = await this.showImportOptionsDialog();

        if (importChoice === 'default') {
          this.updateStatus('...Сохранить......', 'loading');

          // Сохранить
          const saveSuccess = await this.saveConfig();

          if (saveSuccess) {
            this.updateStatus('.../* Импорт */...！Обновить...', 'success');
            console.log('[Style Config Manager] .../* Импорт */...Сохранить...');
          } else {
            this.updateStatus('.../* Импорт */...，...Сохранить...', 'error');
          }
        } else if (importChoice === 'named') {
          // Сохранить
          const configName = prompt('...：', '/* Импорт */...');
          if (configName && configName.trim()) {
            this.updateStatus('...Сохранить......', 'loading');

            try {
              const saveSuccess = await this.saveConfigWithName(configName.trim());

              if (saveSuccess) {
                this.updateStatus(`...Сохранить..."${configName.trim()}"，...`, 'success');
                // Обновить/* Список */
                setTimeout(() => {
                  this.loadConfigListContent();
                }, 1000);
              }
            } catch (error) {
              this.updateStatus(`Сохранить...：${error.message}`, 'error');
            }
          } else {
            this.updateStatus('.../* Импорт */...！...', 'success');
          }
        } else {
          this.updateStatus('.../* Импорт */...！...，Обновить...', 'success');
        }

        console.log('[Style Config Manager] .../* Импорт */:', this.currentConfig);

        // @ts-ignore - HTMLInputElement value property
        fileInput.value = '';
      } catch (error) {
        console.error('[Style Config Manager] /* Импорт */error:', error);
        this.updateStatus('/* Импорт */...：' + error.message, 'error');

        // @ts-ignore - HTMLInputElement value property
        fileInput.value = '';
      }
    }

    fileToText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }

    // /* Диалог */
    async showLoadOptionsDialog(fileName) {
      const displayName = fileName.replace('_style_config.json', '');

      return new Promise(resolve => {
        // /* Диалог */HTML
        const dialogHtml = `
                <div class="load-options-dialog" id="load-options-dialog">
                    <div class="load-options-overlay"></div>
                    <div class="load-options-content">
                        <div class="load-options-header">
                            <h3>📥 ...</h3>
                            <p>...："${displayName}"</p>
                            <p style="color: #f59e0b; font-size: 13px; margin-top: 8px;">💡 ...Сохранить...</p>
                        </div>
                        <div class="load-options-body">
                            <div class="load-option recommended" data-choice="setDefault">
                                <div class="option-icon">🏠</div>
                                <div class="option-content">
                                    <div class="option-title">... <span class="recommended-badge">Рекомендации</span></div>
                                    <div class="option-desc">...，<strong>Обновить...</strong></div>
                                </div>
                            </div>
                            <div class="load-option" data-choice="temp">
                                <div class="option-icon">⚡</div>
                                <div class="option-content">
                                    <div class="option-title">.../* Приложение */</div>
                                    <div class="option-desc">...，<strong style="color: #dc2626;">Обновить...</strong></div>
                                </div>
                            </div>
                        </div>
                        <div class="load-options-footer">
                            <button class="load-cancel-btn" data-choice="temp">...</button>
                        </div>
                    </div>
                </div>
                <style>
                .load-options-dialog {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .load-options-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    cursor: pointer;
                }
                .load-options-content {
                    position: relative;
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    max-width: 480px;
                    width: 90%;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    animation: dialogSlideIn 0.3s ease-out;
                }
                .load-options-header {
                    text-align: center;
                    margin-bottom: 24px;
                }
                .load-options-header h3 {
                    margin: 0 0 8px 0;
                    color: #1f2937;
                    font-size: 20px;
                    font-weight: 600;
                }
                .load-options-header p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }
                .load-options-body {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .load-option {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: white;
                }
                .load-option:hover {
                    border-color: #3b82f6;
                    background: #f8fafc;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
                }
                .load-option.recommended {
                    border-color: #10b981;
                    background: linear-gradient(135deg, #f0fff4 0%, #ecfdf5 100%);
                }
                .load-option.recommended:hover {
                    border-color: #059669;
                    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
                }
                .recommended-badge {
                    background: #10b981;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                    margin-left: 8px;
                }
                .option-icon {
                    font-size: 24px;
                    margin-right: 16px;
                    flex-shrink: 0;
                }
                .option-content {
                    flex: 1;
                }
                .option-title {
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 4px;
                }
                .option-desc {
                    font-size: 13px;
                    color: #6b7280;
                    line-height: 1.4;
                }
                .load-options-footer {
                    margin-top: 24px;
                    text-align: center;
                }
                .load-cancel-btn {
                    padding: 8px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background: white;
                    color: #6b7280;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                .load-cancel-btn:hover {
                    background: #f9fafb;
                    border-color: #9ca3af;
                }
                </style>
            `;

        // /* Диалог */
        document.body.insertAdjacentHTML('beforeend', dialogHtml);

        // DOM
        setTimeout(() => {
          const dialog = document.getElementById('load-options-dialog');
          console.log('[Load Dialog] /* Диалог */...:', dialog);

          if (!dialog) {
            console.error('[Load Dialog] error/* Диалог */error');
            resolve('temp');
            return;
          }

          // Закрыть
          const closeDialog = choice => {
            console.log('[Load Dialog] Закрыть/* Диалог */，...:', choice);
            if (dialog && dialog.parentNode) {
              dialog.remove();
            }
            resolve(choice);
          };

          // Закрыть
          const overlay = dialog.querySelector('.load-options-overlay');
          console.log('[Load Dialog] ...:', overlay);
          if (overlay) {
            overlay.addEventListener('click', e => {
              console.log('[Load Dialog] ...');
              e.preventDefault();
              e.stopPropagation();
              closeDialog('temp');
            });
          } else {
            console.error('[Load Dialog] error');
          }

          const options = dialog.querySelectorAll('.load-option');
          console.log('[Load Dialog] ...:', options.length);
          options.forEach((option, index) => {
            const choice = option.getAttribute('data-choice');
            console.log(`[Load Dialog] ... ${index}:`, choice);
            option.addEventListener('click', e => {
              console.log('[Load Dialog] ...:', choice);
              e.preventDefault();
              e.stopPropagation();
              if (choice) {
                closeDialog(choice);
              }
            });
          });

          // Отменить
          const cancelBtn = dialog.querySelector('.load-cancel-btn');
          console.log('[Load Dialog] Отменить...:', cancelBtn);
          if (cancelBtn) {
            const choice = cancelBtn.getAttribute('data-choice') || 'temp';
            console.log('[Load Dialog] Отменить...:', choice);
            cancelBtn.addEventListener('click', e => {
              console.log('[Load Dialog] ...Отменить...');
              e.preventDefault();
              e.stopPropagation();
              closeDialog(choice);
            });
          } else {
            console.error('[Load Dialog] errorОтменитьerror');
          }

          // /* Диалог */
          const content = dialog.querySelector('.load-options-content');
          if (content) {
            content.addEventListener('click', e => {
              e.stopPropagation();
            });
          }

          console.log('[Load Dialog] ...');
        }, 100);
      });
    }

    // /* Импорт *//* Диалог */
    async showImportOptionsDialog() {
      return new Promise(resolve => {
        // /* Диалог */HTML
        const dialogHtml = `
                <div class="import-options-dialog" id="import-options-dialog">
                    <div class="import-options-overlay"></div>
                    <div class="import-options-content">
                        <div class="import-options-header">
                            <h3>📥 .../* Импорт */...</h3>
                            <p>...：</p>
                        </div>
                        <div class="import-options-body">
                            <div class="import-option" data-choice="default">
                                <div class="option-icon">🏠</div>
                                <div class="option-content">
                                    <div class="option-title">...</div>
                                    <div class="option-desc">...，Обновить...</div>
                                </div>
                            </div>
                            <div class="import-option" data-choice="named">
                                <div class="option-icon">📄</div>
                                <div class="option-content">
                                    <div class="option-title">Сохранить...</div>
                                    <div class="option-desc">Сохранить...，...</div>
                                </div>
                            </div>
                            <div class="import-option" data-choice="temp">
                                <div class="option-icon">⚡</div>
                                <div class="option-content">
                                    <div class="option-title">.../* Приложение */</div>
                                    <div class="option-desc">...，Обновить...</div>
                                </div>
                            </div>
                        </div>
                        <div class="import-options-footer">
                            <button class="import-cancel-btn" data-choice="cancel">Отменить</button>
                        </div>
                    </div>
                </div>
                <style>
                .import-options-dialog {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .import-options-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    cursor: pointer;
                }
                .import-options-content {
                    position: relative;
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    max-width: 480px;
                    width: 90%;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    animation: dialogSlideIn 0.3s ease-out;
                }
                @keyframes dialogSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .import-options-header {
                    text-align: center;
                    margin-bottom: 24px;
                }
                .import-options-header h3 {
                    margin: 0 0 8px 0;
                    color: #1f2937;
                    font-size: 20px;
                    font-weight: 600;
                }
                .import-options-header p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }
                .import-options-body {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .import-option {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: white;
                }
                .import-option:hover {
                    border-color: #3b82f6;
                    background: #f8fafc;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
                }
                .option-icon {
                    font-size: 24px;
                    margin-right: 16px;
                    flex-shrink: 0;
                }
                .option-content {
                    flex: 1;
                }
                .option-title {
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 4px;
                }
                .option-desc {
                    font-size: 13px;
                    color: #6b7280;
                    line-height: 1.4;
                }
                .import-options-footer {
                    margin-top: 24px;
                    text-align: center;
                }
                .import-cancel-btn {
                    padding: 8px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background: white;
                    color: #6b7280;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                .import-cancel-btn:hover {
                    background: #f9fafb;
                    border-color: #9ca3af;
                }
                </style>
            `;

        // /* Диалог */
        document.body.insertAdjacentHTML('beforeend', dialogHtml);

        // DOM
        setTimeout(() => {
          const dialog = document.getElementById('import-options-dialog');
          console.log('[Import Dialog] /* Диалог */...:', dialog);

          if (!dialog) {
            console.error('[Import Dialog] error/* Диалог */error');
            resolve('cancel');
            return;
          }

          // Закрыть
          const closeDialog = choice => {
            console.log('[Import Dialog] Закрыть/* Диалог */，...:', choice);
            if (dialog && dialog.parentNode) {
              dialog.remove();
            }
            resolve(choice);
          };

          // Закрыть
          const overlay = dialog.querySelector('.import-options-overlay');
          console.log('[Import Dialog] ...:', overlay);
          if (overlay) {
            overlay.addEventListener('click', e => {
              console.log('[Import Dialog] ...');
              e.preventDefault();
              e.stopPropagation();
              closeDialog('cancel');
            });
          } else {
            console.error('[Import Dialog] error');
          }

          const options = dialog.querySelectorAll('.import-option');
          console.log('[Import Dialog] ...:', options.length);
          options.forEach((option, index) => {
            const choice = option.getAttribute('data-choice');
            console.log(`[Import Dialog] ... ${index}:`, choice);
            option.addEventListener('click', e => {
              console.log('[Import Dialog] ...:', choice);
              e.preventDefault();
              e.stopPropagation();
              if (choice) {
                closeDialog(choice);
              }
            });
          });

          // Отменить
          const cancelBtn = dialog.querySelector('.import-cancel-btn');
          console.log('[Import Dialog] Отменить...:', cancelBtn);
          if (cancelBtn) {
            const choice = cancelBtn.getAttribute('data-choice') || 'cancel';
            console.log('[Import Dialog] Отменить...:', choice);
            cancelBtn.addEventListener('click', e => {
              console.log('[Import Dialog] ...Отменить...');
              e.preventDefault();
              e.stopPropagation();
              closeDialog(choice);
            });
          } else {
            console.error('[Import Dialog] errorОтменитьerror');
          }

          // /* Диалог */
          const content = dialog.querySelector('.import-options-content');
          if (content) {
            content.addEventListener('click', e => {
              e.stopPropagation();
            });
          }

          console.log('[Import Dialog] ...');
        }, 100);
      });
    }

    // /* Список */
    bindConfigListEvents() {
      document.querySelectorAll('.load-config').forEach(btn => {
        // （）
        btn.removeEventListener('click', this.loadConfigHandler);
        this.loadConfigHandler = async e => {
          // @ts-ignore - EventTarget getAttribute
          const fileName = e.target.getAttribute('data-config-file');
          await this.handleLoadConfig(fileName);
        };
        btn.addEventListener('click', this.loadConfigHandler);
      });

      // Удалить
      document.querySelectorAll('.delete-config').forEach(btn => {
        // （）
        btn.removeEventListener('click', this.deleteConfigHandler);
        this.deleteConfigHandler = async e => {
          // @ts-ignore - EventTarget getAttribute
          const fileName = e.target.getAttribute('data-config-file');
          await this.handleDeleteConfig(fileName);
        };
        btn.addEventListener('click', this.deleteConfigHandler);
      });
    }

    // ОбновитьРедактировать
    async refreshEditorInterface() {
      try {
        const container = document.querySelector('.style-config-app');
        if (container) {
          container.innerHTML = this.getSettingsAppContent();

          this.bindSettingsEvents();
          return;
        }
        // /* Поле ввода */（textarea）
        document.querySelectorAll('.config-input').forEach(input => {
          const key = input.getAttribute('data-config-key');
          const property = input.getAttribute('data-config-property');

          if (key && property && this.currentConfig[key]) {
            // @ts-ignore - HTMLInputElement value property
            input.value = this.currentConfig[key][property] || '';

            // （）
            const rangeId = `${key}_${property}_range`;
            const rangeInput = document.getElementById(rangeId);
            if (rangeInput) {
              // @ts-ignore - HTMLInputElement value property
              rangeInput.value = this.currentConfig[key][property] || '';
            }
          }
        });

        // СообщенияАватар/* Поле ввода */
        document.querySelectorAll('.avatar-input, .avatar-range, .avatar-number, .avatar-name-input').forEach(input => {
          // @ts-ignore - Event target
          const avatarIndex = input.getAttribute('data-avatar-index');
          // @ts-ignore - Event target
          const property = input.getAttribute('data-property');

          if (avatarIndex !== null && property && this.currentConfig.messageReceivedAvatars) {
            const avatar = this.currentConfig.messageReceivedAvatars[parseInt(avatarIndex)];
            if (avatar) {
              // @ts-ignore - HTMLInputElement value property
              input.value = avatar[property] || '';
            }
          }
        });

        Object.keys(this.currentConfig).forEach(key => {
          const config = this.currentConfig[key];
          if (config && config.backgroundImage) {
            const fieldId = `${key}_backgroundImage`;
            this.updateImagePreview(fieldId, config.backgroundImage);
          }
        });

        // Аватар
        this.updateAllAvatarPreviews();

        // Аватар
        this.bindAvatarPreviewEvents();

        console.log('[Style Config Manager] Редактировать...Обновить');
      } catch (error) {
        console.error('[Style Config Manager] ОбновитьРедактироватьerror:', error);
      }
    }

    // /* Поле ввода */
    handleInputChange(input) {
      const key = input.getAttribute('data-config-key');
      const property = input.getAttribute('data-config-property');
      const value = input.value;

      if (key && property) {
        this.updateConfig(key, property, value);
        this.updateStatus('...，...Сохранить...', 'info');

        // ЕслиАватар，
        if (key === 'messageSentAvatar' || key === 'messageReceivedAvatar') {
          this.updateAvatarPreview(key);
        }
      }
    }

    // Аватар
    bindAvatarPreviewEvents() {
      // СообщенияАватар
      document.querySelectorAll('[data-config-key="messageSentAvatar"]').forEach(input => {
        input.addEventListener('input', () => {
          this.updateAvatarPreview('messageSentAvatar');
        });
      });

      // СообщенияАватар（）
      document.querySelectorAll('.avatar-input, .avatar-range, .avatar-number').forEach(input => {
        input.addEventListener('input', e => {
          // @ts-ignore - Event target
          const avatarIndex = e.target.getAttribute('data-avatar-index');
          // @ts-ignore - Event target
          const property = e.target.getAttribute('data-property');
          // @ts-ignore - Event target
          const value = e.target.value;

          if (avatarIndex !== null && property) {
            this.updateAvatarProperty(parseInt(avatarIndex), property, value);

            if (property === 'rotation' || property === 'scale') {
              const relatedInputs = document.querySelectorAll(
                `[data-avatar-index="${avatarIndex}"][data-property="${property}"]`,
              );
              relatedInputs.forEach(relatedInput => {
                // @ts-ignore - HTMLElement value property
                if (relatedInput !== e.target) {
                  // @ts-ignore - HTMLElement value property
                  relatedInput.value = value;
                }
              });

              const label = document.querySelector(`[data-avatar-index="${avatarIndex}"] .range-value`);
              if (label && (property === 'rotation' || property === 'scale')) {
                const unit = property === 'rotation' ? '°' : 'x';
                label.textContent = `${value}${unit}`;
              }
            }
          }
        });
      });

      // Аватар
      document.querySelectorAll('.avatar-name-input').forEach(input => {
        input.addEventListener('input', e => {
          // @ts-ignore - Event target
          const avatarIndex = e.target.getAttribute('data-avatar-index');
          // @ts-ignore - Event target
          const property = e.target.getAttribute('data-property');
          // @ts-ignore - Event target
          const value = e.target.value;

          if (avatarIndex !== null && property) {
            this.updateAvatarProperty(parseInt(avatarIndex), property, value);
          }
        });
      });

      // АватарЗагрузить
      document.querySelectorAll('.avatar-file-input').forEach(input => {
        input.addEventListener('change', e => {
          this.handleAvatarFileUpload(e.target);
        });
      });

      // Аватар
      document.querySelectorAll('.avatar-remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          this.handleAvatarImageRemove(e.target);
        });
      });

      // Друзья（）
      document.querySelectorAll('.background-input, .background-range, .background-number').forEach(input => {
        input.addEventListener('input', e => {
          // @ts-ignore - Event target
          const backgroundIndex = e.target.getAttribute('data-background-index');
          // @ts-ignore - Event target
          const property = e.target.getAttribute('data-property');
          // @ts-ignore - Event target
          const value = e.target.value;

          if (backgroundIndex !== null && property) {
            this.updateBackgroundProperty(parseInt(backgroundIndex), property, value);

            if (property === 'rotation' || property === 'scale') {
              const relatedInputs = document.querySelectorAll(
                `[data-background-index="${backgroundIndex}"][data-property="${property}"]`,
              );
              relatedInputs.forEach(relatedInput => {
                // @ts-ignore - HTMLInputElement value property
                if (relatedInput !== e.target) relatedInput.value = value;
              });

              const rangeValueSpan = document.querySelector(
                `[data-background-index="${backgroundIndex}"] .range-value`,
              );
              if (rangeValueSpan && property === 'rotation') {
                rangeValueSpan.textContent = `${value}°`;
              } else if (rangeValueSpan && property === 'scale') {
                rangeValueSpan.textContent = `${value}x`;
              }
            }

            this.updateBackgroundPreview(parseInt(backgroundIndex));
          }
        });
      });

      // Друзья
      document.querySelectorAll('.background-name-input').forEach(input => {
        input.addEventListener('input', e => {
          // @ts-ignore - Event target
          const backgroundIndex = e.target.getAttribute('data-background-index');
          // @ts-ignore - Event target
          const property = e.target.getAttribute('data-property');
          // @ts-ignore - Event target
          const value = e.target.value;

          if (backgroundIndex !== null && property) {
            this.updateBackgroundProperty(parseInt(backgroundIndex), property, value);
          }
        });
      });

      // ДрузьяЗагрузить
      document.querySelectorAll('.background-file-input').forEach(input => {
        input.addEventListener('change', e => {
          this.handleBackgroundFileUpload(e.target);
        });
      });

      // Друзья
      document.querySelectorAll('.background-remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          this.handleBackgroundImageRemove(e.target);
        });
      });
    }

    // Аватар
    updateAllAvatarPreviews() {
      this.updateAvatarPreview('messageSentAvatar');

      // СообщенияАватар
      const config = this.getConfig();
      if (config.messageReceivedAvatars) {
        config.messageReceivedAvatars.forEach((_, index) => {
          this.updateReceivedAvatarPreview(index);
        });
      }
    }

    // Аватар
    updateAvatarPreview(configKey) {
      const config = this.currentConfig[configKey];
      if (!config) return;

      const previewElement = document.getElementById(`${configKey}_preview`);
      if (!previewElement) return;

      const circle = previewElement.querySelector('.avatar-preview-circle');
      if (!circle) return;

      const backgroundImage = config.backgroundImage || config.backgroundImageUrl;

      const rotation = parseFloat(config.rotation) || 0;
      const scale = parseFloat(config.scale) || 1;

      // /* Приложение */
      if (backgroundImage) {
        // @ts-ignore - HTMLElement style property
        circle.style.backgroundImage = `url(${backgroundImage})`;
        // @ts-ignore - HTMLElement style property
        circle.style.backgroundSize = 'cover';
        // @ts-ignore - HTMLElement style property
        circle.style.backgroundPosition = 'center';
        // @ts-ignore - HTMLElement style property
        circle.style.backgroundRepeat = 'no-repeat';
      } else {
        // @ts-ignore - HTMLElement style property
        circle.style.backgroundImage = '';
        // @ts-ignore - HTMLElement style property
        circle.style.background = '#f0f0f0';
      }

      // /* Приложение */
      // @ts-ignore - HTMLElement style property
      circle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      // @ts-ignore - HTMLElement style property
      circle.style.transformOrigin = 'center center';
    }

    // СообщенияАватар
    updateReceivedAvatarPreview(avatarIndex) {
      const config = this.getConfig();
      if (!config.messageReceivedAvatars || !config.messageReceivedAvatars[avatarIndex]) {
        console.warn(`[Avatar Preview] Аватарerror: index=${avatarIndex}`);
        return;
      }

      const avatar = config.messageReceivedAvatars[avatarIndex];
      const previewElement = document.querySelector(`[data-avatar-index="${avatarIndex}"] .avatar-preview-circle`);
      if (!previewElement) {
        console.warn(`[Avatar Preview] error: [data-avatar-index="${avatarIndex}"] .avatar-preview-circle`);
        return;
      }

      // URL（generateCSS）
      const formatImageUrl = url => {
        if (!url) return '';
        if (url.startsWith('data:')) return url;
        return url; // ...НазадURL，...（CSS...，...style...）
      };

      const backgroundImage = avatar.backgroundImage || avatar.backgroundImageUrl;
      const formattedUrl = formatImageUrl(backgroundImage);

      console.log(`[Avatar Preview] ...Аватар... ${avatarIndex}:`, {
        name: avatar.name,
        originalUrl: backgroundImage,
        formattedUrl: formattedUrl,
        rotation: avatar.rotation,
        scale: avatar.scale,
      });

      const rotation = parseFloat(avatar.rotation) || 0;
      const scale = parseFloat(avatar.scale) || 1;

      // /* Приложение */
      if (formattedUrl) {
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundImage = `url(${formattedUrl})`;
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundSize = 'cover';
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundPosition = 'center';
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundRepeat = 'no-repeat';
      } else {
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundImage = '';
        // @ts-ignore - HTMLElement style property
        previewElement.style.background = '#f0f0f0';
      }

      // /* Приложение */
      // @ts-ignore - HTMLElement style property
      previewElement.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      // @ts-ignore - HTMLElement style property
      previewElement.style.transformOrigin = 'center center';
    }

    // Аватар
    updateAvatarProperty(avatarIndex, property, value) {
      const config = this.getConfig();
      if (!config.messageReceivedAvatars || !config.messageReceivedAvatars[avatarIndex]) return;

      config.messageReceivedAvatars[avatarIndex][property] = value;
      this.updateConfig('messageReceivedAvatars', null, config.messageReceivedAvatars);

      if (
        property === 'backgroundImage' ||
        property === 'backgroundImageUrl' ||
        property === 'rotation' ||
        property === 'scale'
      ) {
        this.updateReceivedAvatarPreview(avatarIndex);
      }

      // ЕслиДрузьяID，Статус
      if (property === 'friendId') {
        this.updateAvatarStatusIndicator(avatarIndex, value);
      }

      // ПользовательСохранить
      this.updateStatus('...，...Сохранить...', 'info');
    }

    // АватарСтатус
    updateAvatarStatusIndicator(avatarIndex, friendId) {
      const statusElement = document.querySelector(`[data-avatar-index="${avatarIndex}"] .field-status`);
      if (statusElement) {
        if (friendId && friendId.trim()) {
          statusElement.className = 'field-status valid';
          statusElement.innerHTML = `✅ ... - CSS...: [data-friend-id="${friendId}"] ... #message-avatar-${friendId}`;
        } else {
          statusElement.className = 'field-status invalid';
          statusElement.innerHTML = `❌ ... - ...ДрузьяID`;
        }
      }
    }

    // Друзья
    updateBackgroundProperty(backgroundIndex, property, value) {
      const config = this.getConfig();
      if (!config.friendBackgrounds || !config.friendBackgrounds[backgroundIndex]) return;

      config.friendBackgrounds[backgroundIndex][property] = value;
      this.updateConfig('friendBackgrounds', null, config.friendBackgrounds);

      if (
        property === 'backgroundImage' ||
        property === 'backgroundImageUrl' ||
        property === 'rotation' ||
        property === 'scale' ||
        property === 'backgroundPosition'
      ) {
        this.updateBackgroundPreview(backgroundIndex);
      }

      // ЕслиДрузьяID，Статус
      if (property === 'friendId') {
        this.updateBackgroundStatusIndicator(backgroundIndex, value);
      }

      // ПользовательСохранить
      this.updateStatus('...，...Сохранить...', 'info');
    }

    // ДрузьяСтатус
    updateBackgroundStatusIndicator(backgroundIndex, friendId) {
      const statusElement = document.querySelector(`[data-background-index="${backgroundIndex}"] .field-status`);
      if (statusElement) {
        if (friendId && friendId.trim()) {
          statusElement.className = 'field-status valid';
          statusElement.innerHTML = `✅ ... - CSS...: .message-detail-content[data-background-id="${friendId}"]`;
        } else {
          statusElement.className = 'field-status invalid';
          statusElement.innerHTML = `❌ ... - ...ДрузьяID`;
        }
      }
    }

    // Друзья
    updateBackgroundPreview(backgroundIndex) {
      const config = this.getConfig();
      if (!config.friendBackgrounds || !config.friendBackgrounds[backgroundIndex]) return;

      const background = config.friendBackgrounds[backgroundIndex];
      const previewElement = document.querySelector(
        `[data-background-index="${backgroundIndex}"] .background-preview-rect`,
      );

      if (!previewElement) return;

      const backgroundImage = background.backgroundImage || background.backgroundImageUrl || '';
      const formattedUrl = formatImageUrl(backgroundImage);

      console.log(`[Background Preview] ...Друзья... ${backgroundIndex}:`, {
        name: background.name,
        originalUrl: backgroundImage,
        formattedUrl: formattedUrl,
        rotation: background.rotation,
        scale: background.scale,
        position: background.backgroundPosition,
      });

      const rotation = parseFloat(background.rotation) || 0;
      const scale = parseFloat(background.scale) || 1;
      const backgroundPosition = background.backgroundPosition || 'center center';

      // /* Приложение */
      if (formattedUrl) {
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundImage = `url(${formattedUrl})`;
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundSize = 'cover';
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundPosition = backgroundPosition;
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundRepeat = 'no-repeat';
      } else {
        // @ts-ignore - HTMLElement style property
        previewElement.style.backgroundImage = '';
        // @ts-ignore - HTMLElement style property
        previewElement.style.background = '#f0f0f0';
      }

      // /* Приложение */
      // @ts-ignore - HTMLElement style property
      previewElement.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      // @ts-ignore - HTMLElement style property
      previewElement.style.transformOrigin = 'center center';
    }

    // АватарЗагрузить
    async handleAvatarFileUpload(fileInput) {
      const file = fileInput.files[0];
      if (!file) return;

      // @ts-ignore - Event target
      const avatarIndex = parseInt(fileInput.getAttribute('data-avatar-index'));
      const property = fileInput.getAttribute('data-property');

      if (avatarIndex === null || property === null) return;

      console.log('[Style Config Manager] ...Аватар...Загрузить:', {
        name: file.name,
        type: file.type,
        size: file.size,
        avatarIndex: avatarIndex,
        property: property,
      });

      if (!file.type.startsWith('image/')) {
        this.updateStatus('...', 'error');
        console.warn('[Style Config Manager] error:', file.type);
        return;
      }

      // （5MB）
      if (file.size > 5 * 1024 * 1024) {
        this.updateStatus('Аватар...，...5MB...', 'error');
        return;
      }

      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!validImageExtensions.includes(fileExtension)) {
        this.updateStatus('...Аватар...，... JPG、PNG、GIF、WebP ...', 'error');
        return;
      }

      try {
        this.updateStatus('...ЗагрузитьАватар......', 'loading');

        let imageUrl;
        if (sillyTavernCoreImported && uploadFileAttachmentToServer) {
          try {
            let fileName = file.name;

            // Если，MIME
            if (!fileName.includes('.')) {
              const mimeToExt = {
                'image/jpeg': '.jpg',
                'image/jpg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
                'image/webp': '.webp',
                'image/bmp': '.bmp',
                'image/svg+xml': '.svg',
              };
              const extension = mimeToExt[file.type] || '.jpg';
              fileName = `${fileName}${extension}`;
            }

            // Время
            const timestamp = Date.now();
            const safeName = `avatar_${timestamp}_${fileName}`;

            console.log('[Style Config Manager] ...ЗагрузитьАватар...:', {
              originalName: file.name,
              processedName: safeName,
              type: file.type,
              size: file.size,
            });

            // File，
            const imageFile = new File([file], safeName, {
              type: file.type,
              lastModified: file.lastModified,
            });

            // ЗагрузитьSillyTavern Data Bank
            imageUrl = await uploadFileAttachmentToServer(imageFile, 'global');

            console.log('[Style Config Manager] Data BankНазадАватарURL:', imageUrl);

            // НазадURL -
            const isValidImageUrl =
              imageUrl &&
              (imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ||
                imageUrl.includes(safeName.replace(/\.[^.]+$/, ''))); // ...

            if (!isValidImageUrl) {
              console.warn('[Style Config Manager] ❌ Data BankНазадerrorАватарURLerror，errortxterror:', imageUrl);
              console.warn('[Style Config Manager] error:', safeName);
              // base64
              imageUrl = null;
            } else {
              console.log('[Style Config Manager] ✅ Data BankАватарЗагрузить...，URL...');
            }
          } catch (uploadError) {
            console.warn('[Style Config Manager] АватарerrorЗагрузитьerrorData Bankerror，errorbase64:', uploadError);
            imageUrl = null;
          }
        }

        if (!imageUrl) {
          console.log('[Style Config Manager] ...base64...Аватар...');
          imageUrl = await this.fileToBase64(file);
        }

        // Аватар
        this.updateAvatarProperty(avatarIndex, property, imageUrl);
        this.updateStatus('Аватар...Загрузить...，...Сохранить...', 'info');
      } catch (error) {
        console.error('[Style Config Manager] АватарerrorЗагрузитьerror:', error);
        this.updateStatus('Аватар...Загрузить...', 'error');
      }
    }

    // Аватар
    handleAvatarImageRemove(removeBtn) {
      // @ts-ignore - Event target
      const avatarIndex = parseInt(removeBtn.getAttribute('data-avatar-index'));
      const property = removeBtn.getAttribute('data-property');

      if (avatarIndex !== null && property) {
        this.updateAvatarProperty(avatarIndex, property, '');
        this.updateStatus('Аватар...，...Сохранить...', 'info');

        // Статус
        this.refreshEditorInterface();
      }
    }

    // ДрузьяЗагрузить
    async handleBackgroundFileUpload(fileInput) {
      const file = fileInput.files[0];
      if (!file) return;

      // @ts-ignore - Event target
      const backgroundIndex = parseInt(fileInput.getAttribute('data-background-index'));
      const property = fileInput.getAttribute('data-property');

      if (backgroundIndex === null || !property) return;

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.updateStatus('...，... JPG、PNG、GIF、WebP ...', 'error');
        return;
      }

      try {
        this.updateStatus('...ЗагрузитьДрузья......', 'loading');

        let imageUrl;
        // Base64
        console.log('[Style Config Manager] ...base64...Друзья...');
        imageUrl = await this.fileToBase64(file);

        this.updateBackgroundProperty(backgroundIndex, property, imageUrl);
        this.updateStatus('Друзья...Загрузить...，...Сохранить...', 'info');
      } catch (error) {
        console.error('[Style Config Manager] ДрузьяerrorЗагрузитьerror:', error);
        this.updateStatus('Друзья...Загрузить...', 'error');
      }
    }

    // Друзья
    handleBackgroundImageRemove(removeBtn) {
      // @ts-ignore - Event target
      const backgroundIndex = parseInt(removeBtn.getAttribute('data-background-index'));
      const property = removeBtn.getAttribute('data-property');

      if (backgroundIndex !== null && property) {
        this.updateBackgroundProperty(backgroundIndex, property, '');
        this.updateStatus('Друзья...，...Сохранить...', 'info');

        // Статус
        this.refreshEditorInterface();
      }
    }

    // Загрузить
    async handleImageUpload(fileInput) {
      const file = fileInput.files[0];
      if (!file) return;

      console.log('[Style Config Manager] ...Загрузить:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (!file.type.startsWith('image/')) {
        this.updateStatus('...', 'error');
        console.warn('[Style Config Manager] error:', file.type);
        return;
      }

      // （5MB）
      if (file.size > 5 * 1024 * 1024) {
        this.updateStatus('...，...5MB...', 'error');
        return;
      }

      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!validImageExtensions.includes(fileExtension)) {
        this.updateStatus('...，... JPG、PNG、GIF、WebP ...', 'error');
        return;
      }

      try {
        this.updateStatus('...Загрузить......', 'loading');

        let imageUrl;

        // ПользовательЗагрузить
        const uploadModeInput = document.querySelector('input[name="imageUploadMode"]:checked');
        // @ts-ignore - HTMLInputElement value property
        const uploadMode = uploadModeInput ? uploadModeInput.value : 'auto';

        console.log('[Style Config Manager] Пользователь...Загрузить...:', uploadMode);

        if (uploadMode === 'auto' && sillyTavernCoreImported && uploadFileAttachmentToServer) {
          try {
            let fileName = file.name;

            // Если，MIME
            if (!fileName.includes('.')) {
              const mimeToExt = {
                'image/jpeg': '.jpg',
                'image/jpg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
                'image/webp': '.webp',
                'image/bmp': '.bmp',
                'image/svg+xml': '.svg',
              };
              const extension = mimeToExt[file.type] || '.jpg';
              fileName = `${fileName}${extension}`;
            }

            // Время
            const timestamp = Date.now();
            const safeName = `mobile_bg_${timestamp}_${fileName}`;

            console.log('[Style Config Manager] ...Загрузить...:', {
              originalName: file.name,
              processedName: safeName,
              type: file.type,
              size: file.size,
            });

            // File，
            const imageFile = new File([file], safeName, {
              type: file.type,
              lastModified: file.lastModified,
            });

            // ЗагрузитьSillyTavern Data Bank
            imageUrl = await uploadFileAttachmentToServer(imageFile, 'global');

            console.log('[Style Config Manager] Data BankНазадURL:', imageUrl);

            // НазадURL -
            const isValidImageUrl =
              imageUrl &&
              (imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ||
                imageUrl.includes(safeName.replace(/\.[^.]+$/, ''))); // ...

            if (!isValidImageUrl) {
              console.warn('[Style Config Manager] ❌ Data BankНазадerrorURLerror，errortxterror:', imageUrl);
              console.warn('[Style Config Manager] error:', safeName);
              // base64
              imageUrl = null;
            } else {
              console.log('[Style Config Manager] ✅ Data BankЗагрузить...，URL...');
            }
          } catch (uploadError) {
            console.warn('[Style Config Manager] Data BankЗагрузитьerror:', uploadError);
            imageUrl = null;
          }
        }

        if (!imageUrl) {
          // Пользователь：base64
          if (uploadMode === 'base64') {
            console.log('[Style Config Manager] Пользователь...base64...，...');
          } else {
            console.log('[Style Config Manager] Data BankЗагрузить...，...base64...');
          }
          imageUrl = await this.fileToBase64(file);
          console.log('[Style Config Manager] base64...，...:', imageUrl.length);
        }

        const targetFieldId = fileInput.getAttribute('data-target');
        const targetInput = document.getElementById(targetFieldId);

        if (targetInput && imageUrl) {
          // URL
          const isFinalValidUrl =
            imageUrl.startsWith('data:') || // base64...
            imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) || // ...
            (imageUrl.startsWith('/user/files/') && !imageUrl.endsWith('.txt')); // ...txt...

          if (!isFinalValidUrl) {
            console.error('[Style Config Manager] ❌ errorURLerror，errorСохранить:', imageUrl);
            this.updateStatus('...URL...，...', 'error');
            return;
          }

          // @ts-ignore - HTMLInputElement value property
          targetInput.value = imageUrl;

          const key = targetInput.getAttribute('data-config-key');
          const property = targetInput.getAttribute('data-config-property');

          if (key && property) {
            this.updateConfig(key, property, imageUrl);
            this.updateImagePreview(targetFieldId, imageUrl);

            if (imageUrl.startsWith('data:')) {
              this.updateStatus('...base64...Сохранить', 'success');
              console.log('[Style Config Manager] ✅ ...base64...Сохранить...');
            } else {
              this.updateStatus('...Загрузить...！', 'success');
              console.log('[Style Config Manager] ✅ ...URLСохранить...:', imageUrl);
            }
          }
        }
      } catch (error) {
        console.error('[Style Config Manager] errorЗагрузитьerror:', error);
        this.updateStatus('...Загрузить...', 'error');
      }
    }

    handleImageRemove(removeBtn) {
      const targetFieldId = removeBtn.getAttribute('data-target');
      const targetInput = document.getElementById(targetFieldId);

      if (targetInput) {
        // @ts-ignore - HTMLInputElement value property
        targetInput.value = '';

        const key = targetInput.getAttribute('data-config-key');
        const property = targetInput.getAttribute('data-config-property');

        if (key && property) {
          this.updateConfig(key, property, '');
          this.updateImagePreview(targetFieldId, '');
          this.updateStatus('...', 'info');
        }
      }
    }

    // base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    updateImagePreview(fieldId, imageUrl) {
      const previewContainer = document.querySelector(`[data-field-id="${fieldId}"]`);
      if (previewContainer) {
        if (imageUrl) {
          previewContainer.innerHTML = `<img src="${imageUrl}" alt="..." />`;

          const controlsContainer = previewContainer.nextElementSibling;
          if (controlsContainer && !controlsContainer.querySelector('.remove-btn')) {
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '🗑️ ...';
            removeBtn.setAttribute('data-target', fieldId);
            removeBtn.addEventListener('click', e => {
              this.handleImageRemove(e.target);
            });
            controlsContainer.appendChild(removeBtn);
          }
        } else {
          previewContainer.innerHTML = '<div class="no-image">📷 ...</div>';

          const controlsContainer = previewContainer.nextElementSibling;
          if (controlsContainer) {
            const removeBtn = controlsContainer.querySelector('.remove-btn');
            if (removeBtn) {
              removeBtn.remove();
            }
          }
        }
      }
    }

    previewStyles() {
      this.applyStyles();
      this.updateStatus('.../* Приложение */，...Сохранить...Сохранить...', 'success');
    }

    resetStyles() {
      if (confirm('ОК...？...。')) {
        this.resetToDefault();

        // /* Поле ввода */
        document.querySelectorAll('.config-input').forEach(input => {
          const key = input.getAttribute('data-config-key');
          const property = input.getAttribute('data-config-property');

          if (key && property && this.currentConfig[key]) {
            // @ts-ignore - HTMLInputElement value property
            input.value = this.currentConfig[key][property] || '';
          }
        });

        this.applyStyles();
        this.updateStatus('...', 'info');
      }
    }

    // /* Отображение статуса */
    updateStatus(message, type = 'info') {
      const statusElement = document.getElementById('config-status');
      if (!statusElement) return;

      const iconMap = {
        info: 'ℹ️',
        success: '✅',
        error: '❌',
        loading: '⏳',
      };

      const statusIcon = statusElement.querySelector('.status-icon');
      const statusText = statusElement.querySelector('.status-text');

      if (statusIcon) statusIcon.textContent = iconMap[type] || 'ℹ️';
      if (statusText) statusText.textContent = message;

      statusElement.className = `config-status ${type}`;

      // /* Состояние ошибки */
      if (type === 'success' || type === 'error') {
        setTimeout(() => {
          this.updateStatus('...', 'info');
        }, 3000);
      }
    }

    dispatchReadyEvent() {
      const event = new CustomEvent('styleConfigManagerReady', {
        detail: {
          manager: this,
          config: this.currentConfig,
        },
      });
      window.dispatchEvent(event);
    }

    // /* Приложение */
    dispatchStyleAppliedEvent() {
      const event = new CustomEvent('mobileStylesApplied', {
        detail: {
          config: this.currentConfig,
          timestamp: Date.now(),
        },
      });
      window.dispatchEvent(event);
    }

    // CSS
    getStyleSheet() {
      return this.generateCSS();
    }

    isConfigReady() {
      return this.isReady && this.configLoaded;
    }

    async waitForReady() {
      if (this.isConfigReady()) {
        return;
      }

      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (this.isConfigReady()) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }
  }

  // @ts-ignore -
  window.StyleConfigManager = StyleConfigManager;

  // settings/* Приложение */
  // @ts-ignore -
  window.getStyleConfigAppContent = function () {
    console.log('[Style Config Manager] .../* Приложение */...');

    // @ts-ignore -
    if (!window.styleConfigManager) {
      console.log('[Style Config Manager] ...');
      // @ts-ignore -
      window.styleConfigManager = new StyleConfigManager();
    }

    // Назад，Статус
    // @ts-ignore -
    return window.styleConfigManager.getSettingsAppContent();
  };

  // @ts-ignore -
  window.bindStyleConfigEvents = function () {
    console.log('[Style Config Manager] ...');

    // @ts-ignore -
    if (!window.styleConfigManager) {
      console.log('[Style Config Manager] ...');
      // @ts-ignore -
      window.styleConfigManager = new StyleConfigManager();
    }

    // ，
    // @ts-ignore -
    window.styleConfigManager.bindSettingsEvents();
    console.log('[Style Config Manager] ...');

    // Если，
    // @ts-ignore -
    if (!window.styleConfigManager.isConfigReady()) {
      console.log('[Style Config Manager] ...，......');
      // @ts-ignore -
      window.styleConfigManager
        .waitForReady()
        .then(() => {
          console.log('[Style Config Manager] ...，...');
          // @ts-ignore -
          window.styleConfigManager.bindSettingsEvents();
        })
        .catch(error => {
          console.error('[Style Config Manager] error:', error);
        });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // @ts-ignore -
      window.styleConfigManager = new StyleConfigManager();
    });
  } else {
    // DOM
    setTimeout(() => {
      // @ts-ignore -
      if (!window.styleConfigManager) {
        // @ts-ignore -
        window.styleConfigManager = new StyleConfigManager();
      }
    }, 1000);
  }

  console.log('[Style Config Manager] ...');
} // ... if (typeof window.StyleConfigManager === 'undefined') ...
