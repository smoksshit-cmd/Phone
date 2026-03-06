/**
 * RuApp_diary — Дневник
 */
// @ts-nocheck
if (typeof window.RuApp_diary === 'undefined') {
  class RuApp_diary {
    constructor(screen) {
      this.screen = screen;
      this.writing = false;
      this.currentEntry = null;
      this.setupEventListeners();
      this.render();
    }

    get entries() {
      if (!window.RuMobileData.diaryEntries) {
        window.RuMobileData.diaryEntries = [
          { id:'d1', date:new Date().toLocaleDateString('ru'), text:'Начинаю новую страницу своей истории. Много всего впереди — интересно, что принесут следующие дни...', mood:'😊', tags:['личное'] },
          { id:'d2', date:new Date(Date.now()-86400000).toLocaleDateString('ru'), text:'Встреча с новыми людьми всегда что-то меняет внутри. Надо обдумать всё произошедшее.', mood:'🤔', tags:['встреча'] },
          { id:'d3', date:new Date(Date.now()-3*86400000).toLocaleDateString('ru'), text:'Сегодня был особенно тяжёлый день. Но я справился. Главное — не останавливаться.', mood:'💪', tags:['трудности'] },
        ];
      }
      return window.RuMobileData.diaryEntries;
    }

    setupEventListeners() {
      if (window._diaryListenerSetup) return;
      window._diaryListenerSetup = true;
      try {
        const ctx = window.SillyTavern?.getContext?.();
        const source = ctx?.eventSource || window.eventSource;
        const types = ctx?.event_types || window.event_types;
        if (source && types) {
          source.on(types.MESSAGE_RECEIVED, () => {
            if (this.screen.classList.contains('active') && !this.writing) this.render();
          });
        }
      } catch {}
    }

    t(key) { return window.RuMobileT ? window.RuMobileT(key) : key; }

    render() {
      if (this.writing) { this.renderWriting(); return; }
      if (this.currentEntry) { this.renderEntry(this.currentEntry); return; }
      this.renderList();
    }

    renderList() {
      const t = (k) => this.t(k);
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#1d3a2e,#2e7d5a)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" onclick="window.RuMobilePhone.closeApp()">←</button>
          <span class="rm-header-icon">📖</span>
          <span class="rm-header-title" style="color:#fff">${t('diary')}</span>
          <button id="diary-new-btn" class="rm-header-btn" style="color:rgba(255,255,255,0.8);font-size:22px">✏️</button>
        </div>
        <!-- Stats -->
        <div style="background:rgba(46,125,90,0.15);padding:12px 16px;display:flex;gap:24px;flex-shrink:0;border-bottom:1px solid var(--rm-sep)">
          <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:#2e7d5a">${this.entries.length}</div><div style="font-size:11px;color:var(--rm-text3)">Записей</div></div>
          <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:#2e7d5a">${this.entries.length > 0 ? this.entries[0].mood : '📝'}</div><div style="font-size:11px;color:var(--rm-text3)">Последнее</div></div>
        </div>
        <div class="rm-app-content">
          ${this.entries.length ? this.entries.map(e => this.entryPreviewHTML(e)).join('') : `<div style="text-align:center;color:var(--rm-text3);padding:60px 20px;font-size:15px">Нажми ✏️ чтобы написать первую запись</div>`}
        </div>
      `;
      this.screen.querySelector('#diary-new-btn').onclick = () => { this.writing = true; this.render(); };
      this.screen.querySelectorAll('[data-entry-id]').forEach(el => {
        el.onclick = () => {
          const entry = this.entries.find(e => e.id === el.dataset.entryId);
          if (entry) { this.currentEntry = entry; this.render(); }
        };
      });
    }

    entryPreviewHTML(e) {
      return `
        <div class="rm-diary-entry" data-entry-id="${e.id}" style="cursor:pointer;transition:background 0.1s" onmouseenter="this.style.background='var(--rm-card)'" onmouseleave="this.style.background=''">
          <div class="rm-diary-entry-head">
            <div class="rm-diary-date">📅 ${e.date}</div>
            <div class="rm-diary-mood">${e.mood}</div>
          </div>
          <div class="rm-diary-text">${e.text.slice(0, 120)}${e.text.length > 120 ? '...' : ''}</div>
          ${e.tags?.length ? `<div style="margin-top:8px">${e.tags.map(tag=>`<span style="background:rgba(46,125,90,0.2);color:#2e7d5a;font-size:11px;padding:2px 8px;border-radius:6px;margin-right:4px">#${tag}</span>`).join('')}</div>` : ''}
        </div>
      `;
    }

    renderEntry(entry) {
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#1d3a2e,#2e7d5a)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" id="diary-back">←</button>
          <span class="rm-header-title" style="color:#fff">${entry.date}</span>
          <span style="font-size:22px">${entry.mood}</span>
        </div>
        <div class="rm-app-content" style="padding:20px 16px">
          <div style="font-size:16px;color:var(--rm-text);line-height:1.7">${entry.text}</div>
          ${entry.tags?.length ? `<div style="margin-top:16px">${entry.tags.map(t=>`<span style="background:rgba(46,125,90,0.2);color:#2e7d5a;font-size:12px;padding:3px 10px;border-radius:8px;margin-right:6px">#${t}</span>`).join('')}</div>` : ''}
          <button id="diary-delete-entry" style="margin-top:24px;background:rgba(255,55,95,0.15);border:1px solid var(--rm-red);color:var(--rm-red);padding:10px 20px;border-radius:10px;font-size:14px;cursor:pointer;font-family:inherit">🗑️ Удалить запись</button>
        </div>
      `;
      this.screen.querySelector('#diary-back').onclick = () => { this.currentEntry = null; this.render(); };
      this.screen.querySelector('#diary-delete-entry').onclick = () => {
        window.RuMobileData.diaryEntries = this.entries.filter(e => e.id !== entry.id);
        this.currentEntry = null;
        window.RuMobilePhone.showToast('Запись удалена');
        this.render();
      };
    }

    renderWriting() {
      const t = (k) => this.t(k);
      const moods = ['😊','😔','😡','🤔','💪','❤️','😴','🎉','😰','✨'];
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#1d3a2e,#2e7d5a)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" id="diary-cancel">✕</button>
          <span class="rm-header-title" style="color:#fff">Новая запись</span>
          <button id="diary-save" style="background:rgba(255,255,255,0.2);border:none;color:#fff;padding:6px 14px;border-radius:10px;font-size:14px;cursor:pointer;font-family:inherit;font-weight:500">Сохранить</button>
        </div>
        <div class="rm-diary-new-wrap" style="overflow-y:auto">
          <!-- Mood selector -->
          <div>
            <div style="font-size:13px;color:var(--rm-text3);margin-bottom:8px">Настроение:</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap" id="mood-selector">
              ${moods.map(m => `<div data-mood="${m}" style="font-size:24px;cursor:pointer;padding:6px;border-radius:10px;transition:background 0.1s;background:${m==='😊'?'var(--rm-card2)':'transparent'}">${m}</div>`).join('')}
            </div>
          </div>
          <!-- Date -->
          <div style="font-size:13px;color:var(--rm-text3)">📅 ${new Date().toLocaleDateString('ru', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
          <!-- Text area -->
          <textarea class="rm-diary-textarea" id="diary-input" placeholder="Что произошло сегодня? Как ты себя чувствуешь?..."></textarea>
          <!-- Tags -->
          <div>
            <input id="diary-tags-input" style="width:100%;background:var(--rm-card2);border:none;border-radius:12px;padding:10px 14px;color:var(--rm-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box" placeholder="Теги через запятую (необязательно)">
          </div>
        </div>
      `;

      let selectedMood = '😊';
      this.screen.querySelectorAll('[data-mood]').forEach(el => {
        el.onclick = () => {
          this.screen.querySelectorAll('[data-mood]').forEach(e => e.style.background = 'transparent');
          el.style.background = 'var(--rm-card2)';
          selectedMood = el.dataset.mood;
        };
      });

      this.screen.querySelector('#diary-cancel').onclick = () => { this.writing = false; this.render(); };
      this.screen.querySelector('#diary-save').onclick = () => {
        const text = this.screen.querySelector('#diary-input').value.trim();
        if (!text) { window.RuMobilePhone.showToast('Напиши что-нибудь!'); return; }
        const rawTags = this.screen.querySelector('#diary-tags-input').value.trim();
        const tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : [];
        const newEntry = {
          id: `d_${Date.now()}`,
          date: new Date().toLocaleDateString('ru'),
          text,
          mood: selectedMood,
          tags,
        };
        if (!window.RuMobileData.diaryEntries) window.RuMobileData.diaryEntries = [];
        window.RuMobileData.diaryEntries.unshift(newEntry);
        // Forward to SillyTavern
        const stInput = document.querySelector('#send_textarea');
        if (stInput) stInput.value += `\n[Дневник|${text}]`;
        this.writing = false;
        window.RuMobilePhone.setBadge('diary', 0);
        window.RuMobilePhone.showToast('Запись сохранена 📖');
        this.render();
      };
    }
  }

  window.RuApp_diary = RuApp_diary;
  console.log('[RU Mobile] ✅ Diary app loaded');
}
