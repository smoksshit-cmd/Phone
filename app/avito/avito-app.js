/**
 * RuApp_avito — Авито приложение
 */
// @ts-nocheck
if (typeof window.RuApp_avito === 'undefined') {
  class RuApp_avito {
    constructor(screen) {
      this.screen = screen;
      this.tab = 'all';
      this.render();
    }

    get listings() {
      if (!window.RuMobileData.avitoListings) {
        window.RuMobileData.avitoListings = [
          { title:'iPhone 15 Pro', price:'89 000 ₽', location:'Москва', emoji:'📱', category:'electronics', desc:'Состояние идеал, полный комплект, гарантия.', age:'1 час' },
          { title:'Велосипед горный Trek', price:'18 500 ₽', location:'Санкт-Петербург', emoji:'🚴', category:'sport', desc:'Trek Marlin 5, 2022 год, пробег 200 км.', age:'3 часа' },
          { title:'Диван угловой серый', price:'22 000 ₽', location:'Казань', emoji:'🛋️', category:'home', desc:'Раскладной, б/у 2 года, чистый.', age:'5 часов' },
          { title:'Котёнок мейн-кун', price:'12 000 ₽', location:'Новосибирск', emoji:'🐱', category:'animals', desc:'С документами, привит, 2 месяца.', age:'вчера' },
          { title:'MacBook Air M2', price:'95 000 ₽', location:'Москва', emoji:'💻', category:'electronics', desc:'2023 год, состояние 9/10.', age:'вчера' },
          { title:'Аккордеон советский', price:'5 500 ₽', location:'Самара', emoji:'🎹', category:'hobby', desc:'Рабочий, есть следы использования.', age:'2 дня' },
          { title:'Шуба норковая', price:'35 000 ₽', location:'Екатеринбург', emoji:'👘', category:'clothes', desc:'Размер 46, б/у 1 сезон.', age:'3 дня' },
          { title:'Автомобиль ВАЗ 2107', price:'65 000 ₽', location:'Тула', emoji:'🚗', category:'auto', desc:'1998 год, на ходу, документы в порядке.', age:'неделю' },
        ];
      }
      return window.RuMobileData.avitoListings;
    }

    get categories() {
      return [
        { id:'all', label:'Все' },
        { id:'electronics', label:'Электроника' },
        { id:'auto', label:'Авто' },
        { id:'home', label:'Дом' },
        { id:'clothes', label:'Одежда' },
        { id:'sport', label:'Спорт' },
      ];
    }

    render() {
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#006b2e,#00a046)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" onclick="window.RuMobilePhone.closeApp()">←</button>
          <span class="rm-header-icon">🏷️</span>
          <span class="rm-header-title" style="color:#fff">Авито</span>
          <button class="rm-header-btn" style="color:rgba(255,255,255,0.85)" onclick="window.RuMobilePhone.showToast('Подать объявление')">✏️</button>
        </div>
        <div class="rm-search-wrap" style="background:#00a046;border:none">
          <div class="rm-search-inner">
            <input class="rm-search-input" placeholder="Поиск объявлений..." style="background:rgba(255,255,255,0.2);color:#fff" id="av-search">
          </div>
        </div>
        <!-- Category chips -->
        <div style="display:flex;gap:8px;padding:10px 14px;overflow-x:auto;flex-shrink:0;scrollbar-width:none;background:var(--rm-card)">
          ${this.categories.map(c => `
            <div data-cat="${c.id}" style="padding:6px 14px;border-radius:16px;font-size:13px;font-weight:500;white-space:nowrap;cursor:pointer;flex-shrink:0;transition:all 0.15s;background:${this.tab===c.id?'var(--avito)':'var(--rm-card2)'};color:${this.tab===c.id?'#fff':'var(--rm-text2)'}">${c.label}</div>
          `).join('')}
        </div>
        <div class="rm-app-content">
          <div class="rm-listing-grid" id="av-grid"></div>
        </div>
      `;

      this.screen.querySelectorAll('[data-cat]').forEach(el => {
        el.onclick = () => { this.tab = el.dataset.cat; this.render(); };
      });

      this.renderGrid();

      const searchInput = this.screen.querySelector('#av-search');
      searchInput?.addEventListener('input', (e) => this.renderGrid(e.target.value));
    }

    renderGrid(query = '') {
      const grid = this.screen.querySelector('#av-grid');
      if (!grid) return;
      const q = query.toLowerCase();
      const filtered = this.listings.filter(l => {
        const matchCat = this.tab === 'all' || l.category === this.tab;
        const matchQ = !q || l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q);
        return matchCat && matchQ;
      });
      grid.innerHTML = filtered.map((l, i) => `
        <div class="rm-listing-card" data-idx="${i}">
          <div class="rm-listing-img">${l.emoji}</div>
          <div class="rm-listing-info">
            <div class="rm-listing-price">${l.price}</div>
            <div class="rm-listing-name">${l.title}</div>
            <div class="rm-listing-place">📍 ${l.location} · ${l.age}</div>
          </div>
        </div>
      `).join('') || `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--rm-text3)">Ничего не найдено</div>`;

      grid.querySelectorAll('.rm-listing-card').forEach(card => {
        card.onclick = () => {
          const l = filtered[card.dataset.idx];
          if (l) this.openListing(l);
        };
      });
    }

    openListing(l) {
      const prev = this.screen.querySelector('.rm-app-content').innerHTML;
      this.screen.querySelector('.rm-app-content').innerHTML = `
        <div style="padding:16px">
          <div style="width:100%;height:200px;background:var(--rm-card2);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:80px;margin-bottom:16px">${l.emoji}</div>
          <div style="font-size:24px;font-weight:700;color:var(--rm-text);margin-bottom:4px">${l.price}</div>
          <div style="font-size:18px;color:var(--rm-text);margin-bottom:8px">${l.title}</div>
          <div style="font-size:13px;color:var(--rm-text3);margin-bottom:16px">📍 ${l.location}</div>
          <div style="font-size:15px;color:var(--rm-text2);line-height:1.5;margin-bottom:24px">${l.desc}</div>
          <button onclick="window.RuMobilePhone.showToast('Звонок...')" style="width:100%;background:var(--avito);border:none;color:#fff;padding:16px;border-radius:14px;font-size:16px;font-weight:600;cursor:pointer;font-family:inherit;margin-bottom:10px">📞 Позвонить</button>
          <button onclick="window.RuMobilePhone.showToast('Написать продавцу')" style="width:100%;background:var(--rm-card2);border:none;color:var(--rm-text);padding:16px;border-radius:14px;font-size:16px;font-weight:600;cursor:pointer;font-family:inherit">💬 Написать</button>
        </div>
      `;
      // Add back button temporarily
      const header = this.screen.querySelector('.rm-app-header');
      const backBtn = header.querySelector('.rm-back-btn');
      const originalOnclick = backBtn.getAttribute('onclick');
      backBtn.setAttribute('onclick', '');
      backBtn.onclick = () => {
        this.screen.querySelector('.rm-app-content').innerHTML = prev;
        this.renderGrid();
        backBtn.onclick = null;
        backBtn.setAttribute('onclick', originalOnclick);
      };
    }
  }

  window.RuApp_avito = RuApp_avito;
  console.log('[RU Mobile] ✅ Avito app loaded');
}
