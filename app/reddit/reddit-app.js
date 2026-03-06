/**
 * RuApp_reddit — Reddit приложение
 */
// @ts-nocheck
if (typeof window.RuApp_reddit === 'undefined') {
  class RuApp_reddit {
    constructor(screen) {
      this.screen = screen;
      this.tab = 'best';
      this.render();
    }

    get posts() {
      if (!window.RuMobileData.redditPosts) {
        window.RuMobileData.redditPosts = [
          { id:'r1', sub:'r/Russia', title:'Что думаете о погоде этой зимой? В Москве рекордные морозы!', upvotes:'3.2K', comments:284, tags:['Погода', 'Москва'], body:'Вчера было -28, это нормально для января?', time:'2 часа' },
          { id:'r2', sub:'r/gaming', title:'Лучшие RPG последних 5 лет — составляем окончательный список', upvotes:'8.7K', comments:612, tags:['ТОП', 'RPG', 'Обсуждение'], body:'Мой топ: Elden Ring, BG3, Disco Elysium, Pathfinder', time:'4 часа' },
          { id:'r3', sub:'r/programming', title:'Rust vs Go vs Python в 2025 — что выбрать для нового проекта?', upvotes:'5.1K', comments:891, tags:['Backend', 'Выбор', 'Помогите'], body:'Пишу микросервис, команда маленькая, нужна быстрая разработка', time:'6 часов' },
          { id:'r4', sub:'r/AskReddit_RU', title:'Какой момент в вашей жизни буквально изменил всё?', upvotes:'12.4K', comments:2100, tags:['АскРеддит', 'Личное'], body:'Интересно послушать ваши истории', time:'вчера' },
          { id:'r5', sub:'r/мемы', title:'Понедельник снова пришёл и никто не звал [OC]', upvotes:'45K', comments:430, tags:['Мем', 'OC', '18+'], body:'Сделал сам, не бейте', time:'вчера' },
          { id:'r6', sub:'r/science', title:'Учёные открыли новый вид антибиотиков из морских организмов', upvotes:'28K', comments:1200, tags:['Наука', 'Медицина'], body:'Исследование опубликовано в Nature', time:'2 дня' },
        ];
      }
      return window.RuMobileData.redditPosts;
    }

    render() {
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#c23b00,#ff4500)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" onclick="window.RuMobilePhone.closeApp()">←</button>
          <span class="rm-header-icon">👽</span>
          <span class="rm-header-title" style="color:#fff">Reddit</span>
          <button class="rm-header-btn" style="color:rgba(255,255,255,0.8)" onclick="window.RuMobilePhone.showToast('Поиск')">🔍</button>
        </div>
        <div class="rm-tabs">
          <div class="rm-tab ${this.tab==='best'?'active':''}" data-tab="best" style="${this.tab==='best'?'color:var(--reddit);border-bottom-color:var(--reddit)':''}">🏆 Лучшее</div>
          <div class="rm-tab ${this.tab==='hot'?'active':''}" data-tab="hot">🔥 Горячее</div>
          <div class="rm-tab ${this.tab==='new'?'active':''}" data-tab="new">✨ Новое</div>
          <div class="rm-tab ${this.tab==='subs'?'active':''}" data-tab="subs">📋 Мои</div>
        </div>
        <div class="rm-app-content" id="rd-content"></div>
      `;
      this.screen.querySelectorAll('.rm-tab').forEach(t => {
        t.onclick = () => { this.tab = t.dataset.tab; this.render(); };
      });
      this.renderContent();
    }

    renderContent() {
      const content = this.screen.querySelector('#rd-content');
      if (!content) return;
      if (this.tab === 'subs') { content.innerHTML = this.subsHTML(); return; }
      const sorted = [...this.posts];
      if (this.tab === 'hot') sorted.sort((a, b) => parseInt(b.comments) - parseInt(a.comments));
      if (this.tab === 'new') sorted.reverse();
      content.innerHTML = sorted.map(p => this.postHTML(p)).join('');
      content.querySelectorAll('.rd-post').forEach(el => {
        el.onclick = () => this.openPost(this.posts.find(p => p.id === el.dataset.id));
      });
    }

    postHTML(p) {
      return `
        <div class="rm-thread-item rd-post" data-id="${p.id}">
          <div class="rm-thread-sub">${p.sub}</div>
          <div class="rm-thread-title">${p.title}</div>
          <div class="rm-thread-tags">${(p.tags||[]).map(tag=>`<span class="rm-tag">${tag}</span>`).join('')}</div>
          <div class="rm-thread-meta">
            <span>⬆️ ${p.upvotes}</span>
            <span>💬 ${p.comments} комментариев</span>
            <span>🕐 ${p.time} назад</span>
          </div>
        </div>
      `;
    }

    openPost(p) {
      const content = this.screen.querySelector('#rd-content');
      const savedHTML = content.innerHTML;
      content.innerHTML = `
        <div style="padding:16px">
          <div style="font-size:11px;color:var(--reddit);font-weight:600;margin-bottom:8px">${p.sub} · ${p.time} назад</div>
          <div style="font-size:16px;font-weight:700;color:var(--rm-text);line-height:1.4;margin-bottom:12px">${p.title}</div>
          <div style="font-size:15px;color:var(--rm-text2);line-height:1.5;margin-bottom:16px">${p.body}</div>
          <div style="display:flex;gap:16px;margin-bottom:20px">
            <button onclick="window.RuMobilePhone.showToast('⬆️ Голос учтён!')" style="background:var(--rm-card2);border:none;color:var(--rm-text2);padding:8px 16px;border-radius:20px;font-size:14px;cursor:pointer;font-family:inherit">⬆️ ${p.upvotes}</button>
            <button onclick="window.RuMobilePhone.showToast('⬇️ Голос учтён!')" style="background:var(--rm-card2);border:none;color:var(--rm-text2);padding:8px 16px;border-radius:20px;font-size:14px;cursor:pointer;font-family:inherit">⬇️</button>
            <button onclick="window.RuMobilePhone.showToast('Поделиться')" style="background:var(--rm-card2);border:none;color:var(--rm-text2);padding:8px 16px;border-radius:20px;font-size:14px;cursor:pointer;font-family:inherit">↗️</button>
          </div>
          <div style="font-size:14px;font-weight:600;color:var(--rm-text);margin-bottom:12px">💬 ${p.comments} комментариев</div>
          ${['Отличный пост!', 'Согласен на 100%', 'Интересная точка зрения'].map((c, i) => `
            <div style="padding:12px;background:var(--rm-card);border-radius:10px;margin-bottom:8px">
              <div style="font-size:12px;color:var(--reddit);font-weight:600;margin-bottom:4px">User_${i+1}</div>
              <div style="font-size:14px;color:var(--rm-text2)">${c}</div>
              <div style="font-size:12px;color:var(--rm-text3);margin-top:6px">⬆️ ${Math.floor(Math.random()*100)+1}</div>
            </div>
          `).join('')}
          <div style="display:flex;gap:8px;margin-top:12px">
            <input id="rd-comment-input" style="flex:1;background:var(--rm-card2);border:none;border-radius:10px;padding:10px 14px;color:var(--rm-text);font-size:14px;font-family:inherit;outline:none" placeholder="Написать комментарий...">
            <button id="rd-comment-send" style="background:var(--reddit);border:none;color:#fff;padding:10px 14px;border-radius:10px;font-size:14px;cursor:pointer;font-family:inherit">↑</button>
          </div>
        </div>
      `;
      const header = this.screen.querySelector('.rm-app-header .rm-back-btn');
      const prev = header.onclick;
      header.onclick = () => { content.innerHTML = savedHTML; content.querySelectorAll('.rd-post').forEach(el => { el.onclick = () => this.openPost(this.posts.find(pp=>pp.id===el.dataset.id)); }); header.onclick = prev; };
      content.querySelector('#rd-comment-send').onclick = () => {
        const v = content.querySelector('#rd-comment-input').value.trim();
        if (v) { window.RuMobilePhone.showToast('Комментарий опубликован'); content.querySelector('#rd-comment-input').value = ''; }
      };
    }

    subsHTML() {
      const subs = ['r/Russia','r/programming','r/gaming','r/мемы','r/science','r/AskReddit_RU'];
      return subs.map(s => `
        <div class="rm-thread-item" style="cursor:pointer">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--reddit);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff">${s[2].toUpperCase()}</div>
            <div>
              <div style="font-size:15px;font-weight:600;color:var(--rm-text)">${s}</div>
              <div style="font-size:12px;color:var(--rm-text3)">Подписан</div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  window.RuApp_reddit = RuApp_reddit;
  console.log('[RU Mobile] ✅ Reddit app loaded');
}
