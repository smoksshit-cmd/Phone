/**
 * RU Mobile Phone — Ядро интерфейса телефона
 * Управляет домашним экраном, переключением приложений, статус-баром
 */

// @ts-nocheck
if (typeof window.RuMobilePhone === 'undefined') {

  // ── i18n ─────────────────────────────────────────────────────────────────
  const I18N = {
    ru: {
      openPhone: '📱 Телефон',
      telegram: 'Telegram',
      vk: 'ВКонтакте',
      tiktok: 'TikTok',
      avito: 'Авито',
      twitch: 'Twitch',
      reddit: 'Reddit',
      dvach: '2ch',
      backpack: 'Рюкзак',
      diary: 'Дневник',
      settings: 'Настройки',
      close: 'Закрыть',
      back: '←',
      send: 'Отправить',
      search: 'Поиск',
      online: 'онлайн',
      typing: 'печатает...',
      noMessages: 'Сообщений нет',
      writeMes: 'Сообщение...',
      today: 'Сегодня',
      yesterday: 'Вчера',
      langSaved: 'Язык: Русский',
      dataCleared: 'Данные очищены',
      sent: 'Отправлено ✓',
    },
    en: {
      openPhone: '📱 Phone',
      telegram: 'Telegram',
      vk: 'VKontakte',
      tiktok: 'TikTok',
      avito: 'Avito',
      twitch: 'Twitch',
      reddit: 'Reddit',
      dvach: '2ch',
      backpack: 'Backpack',
      diary: 'Diary',
      settings: 'Settings',
      close: 'Close',
      back: '←',
      send: 'Send',
      search: 'Search',
      online: 'online',
      typing: 'typing...',
      noMessages: 'No messages',
      writeMes: 'Message...',
      today: 'Today',
      yesterday: 'Yesterday',
      langSaved: 'Language: English',
      dataCleared: 'Data cleared',
      sent: 'Sent ✓',
    },
  };

  window.RuMobileLang = localStorage.getItem('ruMobileLang') || 'ru';
  window.RuMobileT = (key) => (I18N[window.RuMobileLang]?.[key]) || I18N.ru[key] || key;
  window.RuMobileData = window.RuMobileData || {};

  // ── App manifest ──────────────────────────────────────────────────────────
  const APPS_MANIFEST = [
    { id: 'telegram', emoji: '✈️', bg: 'linear-gradient(145deg,#1a6fa8,#2aabee)', dock: true },
    { id: 'vk',       emoji: '💙', bg: 'linear-gradient(145deg,#1557a0,#2787f5)', dock: true },
    { id: 'tiktok',   emoji: '🎵', bg: 'linear-gradient(145deg,#111,#2a2a2a)' },
    { id: 'avito',    emoji: '🏷️', bg: 'linear-gradient(145deg,#006b2e,#00a046)', dock: true },
    { id: 'twitch',   emoji: '🎮', bg: 'linear-gradient(145deg,#4b1d87,#9147ff)' },
    { id: 'reddit',   emoji: '👽', bg: 'linear-gradient(145deg,#c23b00,#ff4500)' },
    { id: 'dvach',    emoji: '💬', bg: 'linear-gradient(145deg,#222,#444)' },
    { id: 'backpack', emoji: '🎒', bg: 'linear-gradient(145deg,#7c5c1e,#c9943a)' },
    { id: 'diary',    emoji: '📖', bg: 'linear-gradient(145deg,#1d3a2e,#2e7d5a)' },
    { id: 'settings', emoji: '⚙️', bg: 'linear-gradient(145deg,#2a2a2a,#555)', dock: true },
  ];

  // ── Inject HTML ───────────────────────────────────────────────────────────
  function buildPhoneHTML() {
    const t = window.RuMobileT;

    // Open button
    const btn = document.createElement('div');
    btn.id = 'ru-phone-open-btn';
    btn.innerHTML = `<span id="ru-phone-btn-label">${t('openPhone')}</span><span class="notif-dot"></span>`;
    document.body.appendChild(btn);

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'ru-phone-overlay';

    // App screens HTML
    const appScreensHTML = APPS_MANIFEST.map(a =>
      `<div id="rm-app-${a.id}" class="rm-app-screen"></div>`
    ).join('');

    // Dock items
    const dockItems = APPS_MANIFEST.filter(a => a.dock).map(a =>
      `<div class="rm-dock-item" data-app="${a.id}" style="background:${a.bg}" title="${t(a.id)}">${a.emoji}</div>`
    ).join('');

    overlay.innerHTML = `
      <div id="ru-phone-shell">
        <!-- Статус бар -->
        <div class="rm-status-bar">
          <div class="rm-status-time" id="rm-clock">12:00</div>
          <div class="rm-status-notch"></div>
          <div class="rm-status-icons">
            <div class="rm-signal-bars">
              <div class="rm-bar"></div><div class="rm-bar"></div>
              <div class="rm-bar"></div><div class="rm-bar"></div>
            </div>
            <span class="rm-wifi">📶</span>
            <div class="rm-battery"><div class="rm-battery-fill"></div></div>
          </div>
        </div>

        <!-- Экран -->
        <div id="rm-screen">
          <!-- Домашний экран -->
          <div id="rm-home"></div>
          <!-- Экраны приложений -->
          ${appScreensHTML}
        </div>

        <!-- Dock -->
        <div class="rm-dock">${dockItems}</div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // ── Home Screen ───────────────────────────────────────────────────────────
  function buildHomeScreen() {
    const home = document.getElementById('rm-home');
    if (!home) return;
    const t = window.RuMobileT;
    home.innerHTML = '';
    APPS_MANIFEST.forEach(app => {
      const el = document.createElement('div');
      el.className = 'app-icon';
      el.dataset.app = app.id;
      el.innerHTML = `
        <div class="app-icon-wrap" style="background:${app.bg}" id="rm-badge-wrap-${app.id}">
          ${app.emoji}
        </div>
        <div class="app-icon-label" id="rm-label-${app.id}">${t(app.id)}</div>
      `;
      el.addEventListener('click', () => openApp(app.id));
      home.appendChild(el);
    });
  }

  // ── App navigation ────────────────────────────────────────────────────────
  function openApp(name) {
    document.querySelectorAll('.rm-app-screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(`rm-app-${name}`);
    if (!screen) return;
    screen.classList.add('active');

    // Lazy init
    if (!screen.dataset.loaded) {
      screen.dataset.loaded = '1';
      const AppClass = window[`RuApp_${name}`];
      if (AppClass) {
        try { new AppClass(screen); }
        catch (e) { console.error(`[RU Mobile] Ошибка в ${name}:`, e); }
      } else {
        screen.innerHTML = `
          <div class="rm-app-header">
            <button class="rm-back-btn" onclick="window.RuMobilePhone.closeApp()">←</button>
            <span class="rm-header-title">${window.RuMobileT(name)}</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;flex:1;flex-direction:column;gap:12px;color:var(--rm-text3)">
            <div style="font-size:48px">${APPS_MANIFEST.find(a=>a.id===name)?.emoji||'📱'}</div>
            <div style="font-size:15px">${window.RuMobileT(name)}</div>
            <div style="font-size:13px">Загрузка...</div>
          </div>
        `;
      }
    }
  }

  function closeApp() {
    document.querySelectorAll('.rm-app-screen').forEach(s => s.classList.remove('active'));
  }

  function openPhone() {
    const overlay = document.getElementById('ru-phone-overlay');
    if (overlay) overlay.classList.add('open');
    closeApp();
    updateClock();
  }

  function closePhone() {
    const overlay = document.getElementById('ru-phone-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  function showToast(msg) {
    const shell = document.getElementById('ru-phone-shell');
    if (!shell) return;
    const old = shell.querySelector('.rm-toast');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'rm-toast';
    el.textContent = msg;
    shell.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  // ── Badge ─────────────────────────────────────────────────────────────────
  const _badges = {};
  function setBadge(appId, count) {
    _badges[appId] = count;
    const wrap = document.getElementById(`rm-badge-wrap-${appId}`);
    if (!wrap) return;
    let badge = wrap.querySelector('.app-badge');
    if (count > 0) {
      if (!badge) { badge = document.createElement('div'); badge.className = 'app-badge'; wrap.appendChild(badge); }
      badge.textContent = count > 99 ? '99+' : count;
    } else {
      badge?.remove();
    }
    // Show dot on open button
    const total = Object.values(_badges).reduce((a, b) => a + b, 0);
    document.getElementById('ru-phone-open-btn')?.classList.toggle('has-notif', total > 0);
  }

  // ── Clock ─────────────────────────────────────────────────────────────────
  function updateClock() {
    const el = document.getElementById('rm-clock');
    if (!el) return;
    const now = new Date();
    el.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  }
  setInterval(updateClock, 30000);

  // ── Language switch ───────────────────────────────────────────────────────
  function setLang(l) {
    window.RuMobileLang = l;
    window.RuMobileT = (key) => (I18N[l]?.[key]) || I18N.ru[key] || key;
    localStorage.setItem('ruMobileLang', l);
    // Refresh labels
    APPS_MANIFEST.forEach(app => {
      const el = document.getElementById(`rm-label-${app.id}`);
      if (el) el.textContent = window.RuMobileT(app.id);
    });
    const btnLabel = document.getElementById('ru-phone-btn-label');
    if (btnLabel) btnLabel.textContent = window.RuMobileT('openPhone');
    // Reset loaded apps so they reinit with new language
    document.querySelectorAll('.rm-app-screen').forEach(s => {
      delete s.dataset.loaded;
      s.innerHTML = '';
      s.classList.remove('active');
    });
  }

  // ── SillyTavern data parsing ──────────────────────────────────────────────
  function parseAIMessage(text) {
    if (!text) return;
    let hasNew = false;

    // [Telegram|Имя|Текст]
    const tgRe = /\[Telegram\|([^\|]+)\|([^\]]+)\]/g;
    let m;
    while ((m = tgRe.exec(text)) !== null) {
      const [, name, msg] = m;
      const data = window.RuMobileData;
      if (!data.telegramChats) data.telegramChats = [];
      let chat = data.telegramChats.find(c => c.name === name);
      const time = new Date().toLocaleTimeString('ru', {hour:'2-digit',minute:'2-digit'});
      if (!chat) {
        chat = { id: `tg_${Date.now()}`, name, emoji: '👤', preview: '', time, unread: 0, online: true, messages: [] };
        data.telegramChats.unshift(chat);
      }
      chat.messages.push({ from: 'them', text: msg, time });
      chat.preview = msg; chat.time = time;
      chat.unread = (chat.unread || 0) + 1;
      setBadge('telegram', data.telegramChats.reduce((a,c) => a + (c.unread||0), 0));
      hasNew = true;
    }

    // [ВКонтакте|Автор|Текст]
    const vkRe = /\[ВКонтакте\|([^\|]+)\|([^\]]+)\]/g;
    while ((m = vkRe.exec(text)) !== null) {
      const [, author, postText] = m;
      if (!window.RuMobileData.vkPosts) window.RuMobileData.vkPosts = [];
      window.RuMobileData.vkPosts.unshift({ id:`vk_${Date.now()}`, author, avatar:'👤', time:'только что', text:postText, likes:0, comments:0, reposts:0, liked:false, emoji:'📝' });
      setBadge('vk', 1); hasNew = true;
    }

    // [Авито|Название|Цена|Описание|Город]
    const avRe = /\[Авито\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\]]+)\]/g;
    while ((m = avRe.exec(text)) !== null) {
      if (!window.RuMobileData.avitoListings) window.RuMobileData.avitoListings = [];
      window.RuMobileData.avitoListings.unshift({ title:m[1], price:m[2], desc:m[3], location:m[4], emoji:'🏷️' });
      hasNew = true;
    }

    // [Рюкзак|Название|Тип|Описание|Количество]
    const bpRe = /\[Рюкзак\|([^\|]+)\|([^\|]+)\|([^\|]+)\|(\d+)\]/g;
    while ((m = bpRe.exec(text)) !== null) {
      if (!window.RuMobileData.backpackItems) window.RuMobileData.backpackItems = [];
      const existing = window.RuMobileData.backpackItems.find(i => i.name === m[1]);
      if (existing) existing.qty += parseInt(m[4]);
      else window.RuMobileData.backpackItems.push({ name:m[1], type:m[2], desc:m[3], qty:parseInt(m[4]), emoji:'📦' });
      setBadge('backpack', 1); hasNew = true;
    }

    // [Использовать|Название|Количество]
    const useRe = /\[Использовать\|([^\|]+)\|(\d+)\]/g;
    while ((m = useRe.exec(text)) !== null) {
      const items = window.RuMobileData.backpackItems || [];
      const item = items.find(i => i.name === m[1]);
      if (item) { item.qty -= parseInt(m[2]||1); if (item.qty <= 0) window.RuMobileData.backpackItems = items.filter(i => i !== item); }
    }

    // [Дневник|Текст]
    const drRe = /\[Дневник\|([^\]]+)\]/g;
    while ((m = drRe.exec(text)) !== null) {
      if (!window.RuMobileData.diaryEntries) window.RuMobileData.diaryEntries = [];
      window.RuMobileData.diaryEntries.unshift({ date: new Date().toLocaleDateString('ru'), text: m[1], mood: '📝' });
      setBadge('diary', 1); hasNew = true;
    }

    // [Twitch|Название|Стример|Категория|Зрители]
    const twRe = /\[Twitch\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\]]+)\]/g;
    while ((m = twRe.exec(text)) !== null) {
      if (!window.RuMobileData.twitchStreams) window.RuMobileData.twitchStreams = [];
      window.RuMobileData.twitchStreams.unshift({ title:m[1], streamer:m[2], category:m[3], viewers:m[4], emoji:'🎮' });
      hasNew = true;
    }

    // [Reddit|Сабреддит|Заголовок|Теги]
    const rdRe = /\[Reddit\|([^\|]+)\|([^\|]+)\|([^\]]+)\]/g;
    while ((m = rdRe.exec(text)) !== null) {
      if (!window.RuMobileData.redditPosts) window.RuMobileData.redditPosts = [];
      window.RuMobileData.redditPosts.unshift({ sub:`r/${m[1]}`, title:m[2], upvotes:'0', comments:0, tags:m[3].split(',') });
      hasNew = true;
    }

    return hasNew;
  }

  // ── Hook SillyTavern ──────────────────────────────────────────────────────
  function hookSillyTavern() {
    try {
      // Method 1: SillyTavern.getContext()
      if (window.SillyTavern?.getContext) {
        const ctx = window.SillyTavern.getContext();
        if (ctx?.eventSource && ctx.event_types) {
          ctx.eventSource.on(ctx.event_types.MESSAGE_RECEIVED, (data) => {
            const text = data?.message?.mes || data?.mes || '';
            parseAIMessage(text);
          });
          console.log('[RU Mobile] ✅ Подключено: SillyTavern.getContext().eventSource');
          return true;
        }
      }
      // Method 2: global eventSource
      if (window.eventSource && window.event_types) {
        window.eventSource.on(window.event_types.MESSAGE_RECEIVED, (data) => {
          parseAIMessage(data?.message?.mes || data?.mes || '');
        });
        console.log('[RU Mobile] ✅ Подключено: window.eventSource');
        return true;
      }
      // Method 3: global eventOn
      if (typeof eventOn === 'function' && typeof tavern_events !== 'undefined') {
        eventOn(tavern_events.MESSAGE_RECEIVED, (data) => {
          parseAIMessage(data?.message?.mes || data?.mes || '');
        });
        console.log('[RU Mobile] ✅ Подключено: eventOn');
        return true;
      }
    } catch (e) {
      console.warn('[RU Mobile] hookSillyTavern error:', e);
    }
    // Method 4: DOM observer fallback
    const chatEl = document.querySelector('#chat');
    if (chatEl) {
      let lastMes = null;
      new MutationObserver(() => {
        const last = chatEl.querySelector('.mes:last-child .mes_text');
        if (last && last !== lastMes) { lastMes = last; parseAIMessage(last.textContent); }
      }).observe(chatEl, { childList: true, subtree: true });
      console.log('[RU Mobile] ✅ Подключено: DOM observer');
      return true;
    }
    return false;
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    buildPhoneHTML();
    buildHomeScreen();
    updateClock();

    const btn = document.getElementById('ru-phone-open-btn');
    const overlay = document.getElementById('ru-phone-overlay');

    btn?.addEventListener('click', openPhone);
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) closePhone(); });
    document.querySelectorAll('.rm-dock-item').forEach(d => {
      d.addEventListener('click', () => openApp(d.dataset.app));
    });

    // Drag support
    if (window.DragHelper) {
      const dragger = new window.DragHelper();
      const shell = document.getElementById('ru-phone-shell');
      const statusBar = shell?.querySelector('.rm-status-bar');
      if (shell && statusBar) {
        shell.style.position = 'relative';
        dragger.bind(statusBar, shell);
      }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('ru-phone-overlay')?.classList.contains('open')) return;
      if (e.key === 'Escape') {
        if (document.querySelector('.rm-app-screen.active')) closeApp();
        else closePhone();
      }
    });

    // Hook ST
    if (!hookSillyTavern()) {
      let tries = 0;
      const iv = setInterval(() => { if (hookSillyTavern() || ++tries > 30) clearInterval(iv); }, 1000);
    }

    console.log('[RU Mobile] 📱 Телефон инициализирован');
  }

  // Public API
  window.RuMobilePhone = {
    open: openPhone,
    close: closePhone,
    openApp,
    closeApp,
    showToast,
    setBadge,
    parseAIMessage,
    setLang,
    buildHomeScreen,
    APPS_MANIFEST,
  };

  // Run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
