/**
 * RuApp_twitch — Twitch приложение
 */
// @ts-nocheck
if (typeof window.RuApp_twitch === 'undefined') {
  class RuApp_twitch {
    constructor(screen) {
      this.screen = screen;
      this.tab = 'live';
      this.render();
    }

    get streams() {
      if (!window.RuMobileData.twitchStreams) {
        window.RuMobileData.twitchStreams = [
          { title:'Прохожу Dark Souls 3 на пиво', streamer:'NoLifeGamer_RU', category:'Dark Souls III', viewers:'12.4K', emoji:'⚔️', bg:'linear-gradient(135deg,#1a0a0a,#7f1d1d)', tags:['RU', '18+', 'Хардкор'] },
          { title:'Чиллим, болтаем о жизни', streamer:'CozyStream_Masha', category:'Just Chatting', viewers:'3.8K', emoji:'☕', bg:'linear-gradient(135deg,#0a1a1a,#134e4a)', tags:['RU', 'Уютно'] },
          { title:'SPEEDRUN WR — мировой рекорд?', streamer:'SpeedKing_RU', category:'Minecraft', viewers:'28.1K', emoji:'⚡', bg:'linear-gradient(135deg,#0a1a0a,#14532d)', tags:['RU', 'Speedrun'] },
          { title:'Арена — ТОП 1 или слив?', streamer:'HearthLegend', category:'Hearthstone', viewers:'5.2K', emoji:'🃏', bg:'linear-gradient(135deg,#1a0a1a,#581c87)', tags:['RU', 'Карточные'] },
          { title:'Стрим с подписчиками! Играем вместе', streamer:'GamerBro_777', category:'Dota 2', viewers:'8.9K', emoji:'🏆', bg:'linear-gradient(135deg,#0a0a1a,#1e3a5f)', tags:['RU', 'Dota', 'Мультиплеер'] },
          { title:'Инди игры — нахожу жемчужины', streamer:'IndieHunter_RU', category:'Indie', viewers:'1.4K', emoji:'💎', bg:'linear-gradient(135deg,#1a0a00,#78350f)', tags:['RU', 'Инди'] },
        ];
      }
      return window.RuMobileData.twitchStreams;
    }

    render() {
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#4b1d87,#6441a4)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" onclick="window.RuMobilePhone.closeApp()">←</button>
          <span class="rm-header-icon">🎮</span>
          <span class="rm-header-title" style="color:#fff">Twitch</span>
          <button class="rm-header-btn" style="color:rgba(255,255,255,0.8)" onclick="window.RuMobilePhone.showToast('Поиск стримов')">🔍</button>
        </div>
        <div class="rm-tabs">
          <div class="rm-tab ${this.tab==='live'?'active':''}" data-tab="live" style="${this.tab==='live'?'color:var(--twitch);border-bottom-color:var(--twitch)':''}">🔴 В эфире</div>
          <div class="rm-tab ${this.tab==='following'?'active':''}" data-tab="following">Подписки</div>
          <div class="rm-tab ${this.tab==='categories'?'active':''}" data-tab="categories">Категории</div>
        </div>
        <div class="rm-app-content" id="tw-content"></div>
      `;
      this.screen.querySelectorAll('.rm-tab').forEach(t => {
        t.onclick = () => { this.tab = t.dataset.tab; this.render(); };
      });
      this.renderContent();
    }

    renderContent() {
      const content = this.screen.querySelector('#tw-content');
      if (!content) return;
      switch (this.tab) {
        case 'live': content.innerHTML = this.streams.map(s => this.streamHTML(s)).join(''); this.bindStreamClicks(); break;
        case 'following': content.innerHTML = this.followingHTML(); break;
        case 'categories': content.innerHTML = this.categoriesHTML(); break;
      }
    }

    streamHTML(s) {
      return `
        <div class="rm-stream-card" data-title="${s.title}" data-streamer="${s.streamer}">
          <div class="rm-stream-thumb" style="background:${s.bg}">
            <div style="font-size:48px">${s.emoji}</div>
            <div class="rm-live-badge">🔴 LIVE</div>
            <div class="rm-viewers-badge">👁 ${s.viewers}</div>
          </div>
          <div class="rm-stream-info">
            <div style="display:flex;align-items:flex-start;gap:10px">
              <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#9147ff,#bf80ff);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">${s.emoji}</div>
              <div style="flex:1;min-width:0">
                <div class="rm-stream-title">${s.title}</div>
                <div class="rm-stream-user">${s.streamer}</div>
                <div class="rm-stream-cat">${s.category}</div>
                <div style="margin-top:6px">${(s.tags||[]).map(tag=>`<span style="background:var(--rm-card2);color:var(--rm-text2);font-size:11px;padding:2px 8px;border-radius:6px;margin-right:4px">${tag}</span>`).join('')}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    bindStreamClicks() {
      this.screen.querySelectorAll('.rm-stream-card').forEach(card => {
        card.onclick = () => this.openStream(card.dataset.title, card.dataset.streamer);
      });
    }

    openStream(title, streamer) {
      const content = this.screen.querySelector('#tw-content');
      content.innerHTML = `
        <div style="background:#000;flex:1">
          <!-- Fake player -->
          <div style="width:100%;height:200px;background:linear-gradient(135deg,#4b1d87,#9147ff);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;position:relative">
            <div style="font-size:48px">🎮</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.7)">▶ Прямой эфир</div>
            <div style="position:absolute;top:8px;left:8px;background:var(--rm-red);color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:5px">🔴 LIVE</div>
            <button onclick="window.RuMobilePhone.showToast('Полноэкранный режим')" style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.6);border:none;color:#fff;padding:4px 8px;border-radius:6px;font-size:12px;cursor:pointer">⛶ На весь экран</button>
          </div>
          <!-- Stream info -->
          <div style="padding:12px 14px">
            <div style="font-size:15px;font-weight:600;color:var(--rm-text)">${title}</div>
            <div style="font-size:13px;color:var(--twitch);margin-top:4px">${streamer}</div>
          </div>
          <!-- Chat -->
          <div style="border-top:1px solid var(--rm-sep);padding:10px 14px">
            <div style="font-size:13px;font-weight:600;color:var(--rm-text);margin-bottom:10px">Чат стрима</div>
            <div id="tw-chat-msgs" style="height:120px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;margin-bottom:10px">
              <div style="font-size:13px"><span style="color:var(--twitch);font-weight:600">User_123:</span> <span style="color:var(--rm-text)">LETSGO!!!</span></div>
              <div style="font-size:13px"><span style="color:#ff6b6b;font-weight:600">ProGamer:</span> <span style="color:var(--rm-text)">gg ez</span></div>
              <div style="font-size:13px"><span style="color:#69db7c;font-weight:600">Frog_fan:</span> <span style="color:var(--rm-text)">Pog</span></div>
            </div>
            <div style="display:flex;gap:8px">
              <input id="tw-chat-input" style="flex:1;background:var(--rm-card2);border:none;border-radius:10px;padding:9px 14px;color:var(--rm-text);font-size:14px;font-family:inherit;outline:none" placeholder="Написать в чат...">
              <button id="tw-chat-send" style="background:var(--twitch);border:none;color:#fff;padding:9px 14px;border-radius:10px;font-size:14px;cursor:pointer;font-family:inherit;font-weight:600">Отправить</button>
            </div>
          </div>
          <button onclick="window.RuMobilePhone.showToast('Подписаться на ${streamer}')" style="margin:0 14px 14px;display:block;width:calc(100%-28px);background:var(--twitch);border:none;color:#fff;padding:12px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;text-align:center">💜 Подписаться на ${streamer}</button>
        </div>
      `;
      const chatInput = content.querySelector('#tw-chat-input');
      const chatSend = content.querySelector('#tw-chat-send');
      const chatMsgs = content.querySelector('#tw-chat-msgs');
      chatSend.onclick = () => {
        const txt = chatInput.value.trim();
        if (!txt) return;
        const div = document.createElement('div');
        div.style.fontSize = '13px';
        div.innerHTML = `<span style="color:#ffd43b;font-weight:600">Ты:</span> <span style="color:var(--rm-text)">${txt}</span>`;
        chatMsgs.appendChild(div);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
        chatInput.value = '';
      };
      chatInput.onkeydown = (e) => { if (e.key === 'Enter') chatSend.onclick(); };
    }

    followingHTML() {
      return `<div style="text-align:center;color:var(--rm-text3);padding:60px 20px;font-size:14px">Подпишитесь на каналы, чтобы видеть их здесь</div>`;
    }

    categoriesHTML() {
      const cats = [
        { name:'Just Chatting', emoji:'💬', viewers:'1.2M' },
        { name:'Dota 2', emoji:'🏆', viewers:'450K' },
        { name:'Minecraft', emoji:'⛏️', viewers:'320K' },
        { name:'Valorant', emoji:'🎯', viewers:'280K' },
        { name:'CS:GO 2', emoji:'💣', viewers:'210K' },
        { name:'League of Legends', emoji:'⚔️', viewers:'390K' },
        { name:'Indie', emoji:'💎', viewers:'89K' },
        { name:'Music', emoji:'🎵', viewers:'145K' },
      ];
      return cats.map(c => `
        <div class="rm-chat-item" style="cursor:pointer" onclick="window.RuMobilePhone.showToast('${c.name}')">
          <div class="rm-avatar" style="border-radius:10px;background:var(--rm-card2);font-size:22px">${c.emoji}</div>
          <div class="rm-chat-info">
            <div class="rm-chat-name">${c.name}</div>
            <div class="rm-chat-preview">👁 ${c.viewers} зрителей</div>
          </div>
        </div>
      `).join('');
    }
  }

  window.RuApp_twitch = RuApp_twitch;
  console.log('[RU Mobile] ✅ Twitch app loaded');
}
