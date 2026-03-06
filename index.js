/**
 * RU Mobile Phone — SillyTavern Extension
 * Точка входа плагина. Загружает все модули в правильном порядке.
 */

import { loadFileToDocument } from '../../../utils.js';

const BASE_URL = '/scripts/extensions/third-party/ru-mobile';

function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = url;
    s.onload = resolve;
    s.onerror = () => { console.warn('[RU Mobile] Не удалось загрузить:', url.split('/').pop()); resolve(); };
    document.head.appendChild(s);
  });
}

function loadCSS(url) {
  if (document.querySelector(`link[href="${url}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = url;
  document.head.appendChild(l);
}

const CSS_FILES = [
  `${BASE_URL}/mobile-phone.css`,
  `${BASE_URL}/context-monitor.css`,
  `${BASE_URL}/app/style-config-manager.css`,
  `${BASE_URL}/app/image-config-modal.css`,
  `${BASE_URL}/app/status-app.css`,
  `${BASE_URL}/app/task-app.css`,
  `${BASE_URL}/app/profile-app.css`,
  `${BASE_URL}/app/telegram/message-app.css`,
  `${BASE_URL}/app/telegram/message-renderer.css`,
  `${BASE_URL}/app/telegram/message-app-groups.css`,
  `${BASE_URL}/app/twitch/watch-live.css`,
  `${BASE_URL}/app/vk-feed/vk-ui.css`,
  `${BASE_URL}/app/vk-feed/vk-control-app.css`,
  `${BASE_URL}/app/vk-feed/friends-circle.css`,
  `${BASE_URL}/app/forum-app/forum-ui.css`,
  `${BASE_URL}/app/forum-app/forum-control-app.css`,
  `${BASE_URL}/app/avito/avito-shop-app.css`,
  `${BASE_URL}/app/parallel-events-app/parallel-events-app.css`,
];

const JS_MODULES = [
  // Ядро
  `${BASE_URL}/drag-helper.js`,
  // Утилиты
  `${BASE_URL}/app/real-time-sync.js`,
  `${BASE_URL}/app/incremental-renderer.js`,
  `${BASE_URL}/app/attachment-sender.js`,
  `${BASE_URL}/app/style-config-manager.js`,
  `${BASE_URL}/app/image-config-modal.js`,
  `${BASE_URL}/app/app-loader.js`,
  // Telegram
  `${BASE_URL}/app/telegram/voice-message-handler.js`,
  `${BASE_URL}/app/telegram/message-renderer.js`,
  `${BASE_URL}/app/telegram/message-sender.js`,
  `${BASE_URL}/app/telegram/friend-renderer.js`,
  `${BASE_URL}/app/telegram/message-app.js`,
  `${BASE_URL}/app/telegram/telegram-app.js`,
  // VK / Лента
  `${BASE_URL}/app/vk-feed/vk-styles.js`,
  `${BASE_URL}/app/vk-feed/vk-ui.js`,
  `${BASE_URL}/app/vk-feed/vk-manager.js`,
  `${BASE_URL}/app/vk-feed/vk-auto-listener.js`,
  `${BASE_URL}/app/vk-feed/vk-control-app.js`,
  `${BASE_URL}/app/vk-feed/friends-circle.js`,
  `${BASE_URL}/app/vk/vk-app.js`,
  // TikTok
  `${BASE_URL}/app/tiktok/tiktok-app.js`,
  // Авито
  `${BASE_URL}/app/avito/avito-shop-app.js`,
  `${BASE_URL}/app/avito/avito-app.js`,
  // Twitch
  `${BASE_URL}/app/twitch/watch-live.js`,
  `${BASE_URL}/app/twitch/twitch-app.js`,
  // Reddit/Forum
  `${BASE_URL}/app/forum-app/forum-styles.js`,
  `${BASE_URL}/app/forum-app/forum-ui.js`,
  `${BASE_URL}/app/forum-app/forum-manager.js`,
  `${BASE_URL}/app/forum-app/forum-auto-listener.js`,
  `${BASE_URL}/app/forum-app/forum-control-app.js`,
  `${BASE_URL}/app/reddit/reddit-app.js`,
  // 2ch
  `${BASE_URL}/app/dvach/dvach-app.js`,
  // Рюкзак
  `${BASE_URL}/app/backpack/backpack-app.js`,
  // Дневник
  `${BASE_URL}/app/diary/diary-app.js`,
  // Задания
  `${BASE_URL}/app/task-app.js`,
  // Статус
  `${BASE_URL}/app/status-app.js`,
  // Профиль
  `${BASE_URL}/app/profile-app.js`,
  // Параллельные события
  `${BASE_URL}/app/parallel-events-app/parallel-events-styles.js`,
  `${BASE_URL}/app/parallel-events-app/parallel-events-app.js`,
  `${BASE_URL}/app/parallel-events-app/debug-loader.js`,
  // Настройки (последний перед ядром UI)
  `${BASE_URL}/app/settings-app.js`,
  // Главный UI (всегда последним)
  `${BASE_URL}/mobile-phone.js`,
];

jQuery(async () => {
  console.log('[RU Mobile] 🚀 Загрузка плагина...');
  CSS_FILES.forEach(url => loadCSS(url));
  for (const url of JS_MODULES) {
    await loadScript(url);
  }
  console.log('[RU Mobile] 📱 Готов!');
});
