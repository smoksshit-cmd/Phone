/**
 * RuApp_backpack — Рюкзак / Инвентарь
 */
// @ts-nocheck
if (typeof window.RuApp_backpack === 'undefined') {
  class RuApp_backpack {
    constructor(screen) {
      this.screen = screen;
      this.filterType = 'all';
      this.searchQuery = '';
      this.setupEventListeners();
      this.render();
    }

    get items() {
      if (!window.RuMobileData.backpackItems) {
        window.RuMobileData.backpackItems = [
          { name:'Меч стальной',      type:'Оружие',    qty:1,  emoji:'⚔️',  desc:'Длинный меч хорошей ковки' },
          { name:'Зелье здоровья',    type:'Расходники', qty:5,  emoji:'🧪',  desc:'Восстанавливает 50 HP' },
          { name:'Кожаная броня',     type:'Броня',     qty:1,  emoji:'🛡️',  desc:'Лёгкая защита' },
          { name:'Карта мира',        type:'Предметы',  qty:1,  emoji:'🗺️',  desc:'Подробная карта региона' },
          { name:'Золотые монеты',    type:'Валюта',    qty:342, emoji:'💰', desc:'Местная валюта' },
          { name:'Факел',             type:'Расходники', qty:8,  emoji:'🔦',  desc:'Горит 2 часа' },
          { name:'Верёвка 10м',       type:'Предметы',  qty:2,  emoji:'🪢',  desc:'Прочная верёвка' },
          { name:'Лук деревянный',    type:'Оружие',    qty:1,  emoji:'🏹',  desc:'Дальнобойное оружие' },
          { name:'Стрелы',            type:'Расходники', qty:24, emoji:'🏹', desc:'Обычные стрелы' },
          { name:'Хлеб ржаной',       type:'Еда',       qty:3,  emoji:'🍞',  desc:'+10 насыщения' },
        ];
      }
      return window.RuMobileData.backpackItems;
    }

    get categories() {
      const types = ['all', ...new Set(this.items.map(i => i.type))];
      return types;
    }

    setupEventListeners() {
      if (window._backpackListenerSetup) return;
      window._backpackListenerSetup = true;
      const listen = (eventSource, eventTypes) => {
        if (!eventSource || !eventTypes) return;
        eventSource.on(eventTypes.MESSAGE_RECEIVED, () => {
          if (this.screen.classList.contains('active')) this.render();
        });
      };
      try {
        const ctx = window.SillyTavern?.getContext?.();
        if (ctx?.eventSource) listen(ctx.eventSource, ctx.event_types);
        else listen(window.eventSource, window.event_types);
      } catch {}
    }

    get filteredItems() {
      return this.items.filter(item => {
        const matchType = this.filterType === 'all' || item.type === this.filterType;
        const matchQ = !this.searchQuery || item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchType && matchQ;
      });
    }

    get totalWeight() { return this.items.reduce((a, i) => a + i.qty, 0); }
    get totalValue() {
      const coins = this.items.find(i => i.name === 'Золотые монеты');
      return coins ? coins.qty : 0;
    }

    render() {
      const t = (k) => window.RuMobileT ? window.RuMobileT(k) : k;
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#7c5c1e,#c9943a)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" onclick="window.RuMobilePhone.closeApp()">←</button>
          <span class="rm-header-icon">🎒</span>
          <span class="rm-header-title" style="color:#fff">${t('backpack')}</span>
          <span style="color:rgba(255,255,255,0.8);font-size:13px">${this.items.reduce((a,i)=>a+i.qty,0)} предм.</span>
        </div>
        <!-- Stats bar -->
        <div style="background:rgba(201,148,58,0.15);padding:10px 16px;display:flex;gap:20px;flex-shrink:0;border-bottom:1px solid var(--rm-sep)">
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
            <div style="font-size:18px;font-weight:700;color:#c9943a">${this.items.length}</div>
            <div style="font-size:11px;color:var(--rm-text3)">Видов</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
            <div style="font-size:18px;font-weight:700;color:#c9943a">${this.totalWeight}</div>
            <div style="font-size:11px;color:var(--rm-text3)">Всего</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
            <div style="font-size:18px;font-weight:700;color:#ffd700">💰 ${this.totalValue}</div>
            <div style="font-size:11px;color:var(--rm-text3)">Монет</div>
          </div>
        </div>
        <!-- Search -->
        <div class="rm-search-wrap">
          <div class="rm-search-inner">
            <input class="rm-search-input" placeholder="Поиск предмета..." id="bp-search" value="${this.searchQuery}">
          </div>
        </div>
        <!-- Category filter chips -->
        <div style="display:flex;gap:8px;padding:8px 14px;overflow-x:auto;flex-shrink:0;scrollbar-width:none">
          ${this.categories.map(cat => `
            <div data-cat="${cat}" style="padding:5px 14px;border-radius:14px;font-size:13px;font-weight:500;white-space:nowrap;cursor:pointer;flex-shrink:0;background:${this.filterType===cat?'#c9943a':'var(--rm-card2)'};color:${this.filterType===cat?'#fff':'var(--rm-text2)'}">${cat === 'all' ? 'Всё' : cat}</div>
          `).join('')}
        </div>
        <!-- Items list -->
        <div class="rm-app-content" id="bp-items">
          ${this.filteredItems.length ? this.filteredItems.map(item => this.itemHTML(item)).join('') : `<div style="text-align:center;color:var(--rm-text3);padding:60px 20px;font-size:14px">Ничего не найдено</div>`}
        </div>
      `;

      // Search
      const searchInput = this.screen.querySelector('#bp-search');
      searchInput?.addEventListener('input', (e) => { this.searchQuery = e.target.value; this.renderItems(); });

      // Category chips
      this.screen.querySelectorAll('[data-cat]').forEach(el => {
        el.onclick = () => { this.filterType = el.dataset.cat; this.render(); };
      });

      // Item actions
      this.screen.querySelectorAll('[data-use]').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); this.useItem(btn.dataset.use); };
      });
      this.screen.querySelectorAll('[data-drop]').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); this.dropItem(btn.dataset.drop); };
      });
    }

    renderItems() {
      const container = this.screen.querySelector('#bp-items');
      if (!container) return;
      container.innerHTML = this.filteredItems.length
        ? this.filteredItems.map(item => this.itemHTML(item)).join('')
        : `<div style="text-align:center;color:var(--rm-text3);padding:60px 20px">Ничего не найдено</div>`;
      this.screen.querySelectorAll('[data-use]').forEach(btn => { btn.onclick = (e) => { e.stopPropagation(); this.useItem(btn.dataset.use); }; });
      this.screen.querySelectorAll('[data-drop]').forEach(btn => { btn.onclick = (e) => { e.stopPropagation(); this.dropItem(btn.dataset.drop); }; });
    }

    itemHTML(item) {
      return `
        <div class="rm-inv-item">
          <div class="rm-inv-icon">${item.emoji}</div>
          <div class="rm-inv-info">
            <div class="rm-inv-name">${item.name}</div>
            <div class="rm-inv-desc">${item.desc || item.type}</div>
          </div>
          <div class="rm-inv-qty">×${item.qty}</div>
          <button class="rm-use-btn" data-use="${item.name}">Исп.</button>
        </div>
      `;
    }

    useItem(name) {
      const item = this.items.find(i => i.name === name);
      if (!item) return;
      const isConsumable = item.type === 'Расходники' || item.type === 'Еда';
      if (isConsumable) {
        item.qty--;
        if (item.qty <= 0) window.RuMobileData.backpackItems = this.items.filter(i => i !== item);
        window.RuMobilePhone.showToast(`Использован: ${name}`);
        window.RuMobilePhone.setBadge('backpack', 0);
      } else {
        window.RuMobilePhone.showToast(`${name} экипирован/снят`);
      }
      // Forward to SillyTavern
      const stInput = document.querySelector('#send_textarea');
      if (stInput) stInput.value += `\n[Использовать|${name}|1]`;
      this.render();
    }

    dropItem(name) {
      window.RuMobileData.backpackItems = this.items.filter(i => i.name !== name);
      window.RuMobilePhone.showToast(`${name} выброшен`);
      this.render();
    }
  }

  window.RuApp_backpack = RuApp_backpack;
  console.log('[RU Mobile] ✅ Backpack app loaded');
}
