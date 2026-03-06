/**
 * RuApp_settings — Настройки
 */
// @ts-nocheck
if (typeof window.RuApp_settings === 'undefined') {
  class RuApp_settings {
    constructor(screen) {
      this.screen = screen;
      this.render();
    }

    t(key) { return window.RuMobileT ? window.RuMobileT(key) : key; }

    render() {
      const t = (k) => this.t(k);
      const lang = window.RuMobileLang || 'ru';
      this.screen.innerHTML = `
        <div class="rm-app-header">
          <button class="rm-back-btn" onclick="window.RuMobilePhone.closeApp()">←</button>
          <span class="rm-header-title">${t('settings')}</span>
        </div>
        <div class="rm-app-content">
          <!-- Language -->
          <div class="rm-section-header">Язык / Language</div>
          <div style="padding:8px 16px 16px">
            <div class="rm-lang-toggle">
              <button class="rm-lang-btn ${lang==='ru'?'active':''}" id="settings-lang-ru">🇷🇺 Русский</button>
              <button class="rm-lang-btn ${lang==='en'?'active':''}" id="settings-lang-en">🇬🇧 English</button>
            </div>
          </div>

          <!-- Interface -->
          <div class="rm-section-header">Интерфейс</div>
          <div class="rm-settings-item">
            <div class="rm-settings-icon">🌙</div>
            <div class="rm-settings-label">Тема</div>
            <div class="rm-settings-value">Тёмная</div>
            <div class="rm-settings-arrow">›</div>
          </div>
          <div class="rm-settings-item" id="settings-notif">
            <div class="rm-settings-icon">🔔</div>
            <div class="rm-settings-label">Уведомления</div>
            <div class="rm-settings-value" id="notif-status">Вкл</div>
            <div class="rm-settings-arrow">›</div>
          </div>

          <!-- Apps -->
          <div class="rm-section-header">Приложения</div>
          ${window.RuMobilePhone?.APPS_MANIFEST?.map(app => `
            <div class="rm-settings-item">
              <div class="rm-settings-icon">${app.emoji}</div>
              <div class="rm-settings-label">${window.RuMobileT ? window.RuMobileT(app.id) : app.id}</div>
              <div class="rm-settings-arrow">›</div>
            </div>
          `).join('') || ''}

          <!-- Data -->
          <div class="rm-section-header">Данные</div>
          <div class="rm-settings-item" id="settings-clear">
            <div class="rm-settings-icon">🗑️</div>
            <div class="rm-settings-label">Очистить все данные</div>
            <div class="rm-settings-value" style="color:var(--rm-red)">Сбросить</div>
          </div>

          <!-- About -->
          <div class="rm-section-header">О плагине</div>
          <div class="rm-settings-item">
            <div class="rm-settings-icon">📱</div>
            <div class="rm-settings-label">RU Mobile Phone</div>
            <div class="rm-settings-value">v1.0.0</div>
          </div>
          <div class="rm-settings-item">
            <div class="rm-settings-icon">🌍</div>
            <div class="rm-settings-label">Русские сервисы для SillyTavern</div>
          </div>

          <!-- Data formats -->
          <div class="rm-section-header">Форматы данных для ИИ</div>
          <div style="padding:12px 16px;font-size:12px;color:var(--rm-text3);font-family:var(--mono);background:var(--rm-card);margin:0 14px 14px;border-radius:12px;line-height:1.8">
            [Telegram|Имя|Сообщение]<br>
            [ВКонтакте|Автор|Текст]<br>
            [Рюкзак|Название|Тип|Описание|Кол-во]<br>
            [Авито|Название|Цена|Описание|Город]<br>
            [Дневник|Текст]<br>
            [Twitch|Название|Стример|Категория|Зрители]<br>
            [Reddit|Сабреддит|Заголовок|Теги]
          </div>
        </div>
      `;

      // Lang buttons
      this.screen.querySelector('#settings-lang-ru').onclick = () => {
        window.RuMobilePhone.setLang('ru');
        window.RuMobilePhone.showToast('Язык: Русский 🇷🇺');
        this.render();
      };
      this.screen.querySelector('#settings-lang-en').onclick = () => {
        window.RuMobilePhone.setLang('en');
        window.RuMobilePhone.showToast('Language: English 🇬🇧');
        this.render();
      };

      // Notifications toggle
      let notifOn = true;
      this.screen.querySelector('#settings-notif').onclick = () => {
        notifOn = !notifOn;
        this.screen.querySelector('#notif-status').textContent = notifOn ? 'Вкл' : 'Выкл';
        window.RuMobilePhone.showToast(notifOn ? 'Уведомления включены' : 'Уведомления выключены');
      };

      // Clear data
      this.screen.querySelector('#settings-clear').onclick = () => {
        if (confirm('Очистить все данные плагина?')) {
          window.RuMobileData = {};
          // Reset all loaded apps
          document.querySelectorAll('.rm-app-screen').forEach(s => {
            delete s.dataset.loaded;
            s.innerHTML = '';
            s.classList.remove('active');
          });
          window.RuMobilePhone.showToast(t('dataCleared'));
        }
      };
    }
  }

  window.RuApp_settings = RuApp_settings;
  console.log('[RU Mobile] ✅ Settings app loaded');
}
