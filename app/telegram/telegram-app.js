/**
 * RuApp_telegram — Telegram приложение
 */
// @ts-nocheck
if (typeof window.RuApp_telegram === 'undefined') {
  class RuApp_telegram {
    constructor(screen) {
      this.screen = screen;
      this.currentChat = null;
      this.render();
    }

    get chats() {
      if (!window.RuMobileData.telegramChats) {
        window.RuMobileData.telegramChats = [
          { id:'tg1', name:'Алиса', emoji:'👩', preview:'Привет! Как дела?', time:'14:32', unread:2, online:true, messages:[
            { from:'them', text:'Привет!', time:'14:30' },
            { from:'them', text:'Как дела?', time:'14:32' },
          ]},
          { id:'tg2', name:'Макс', emoji:'👨', preview:'Увидимся вечером?', time:'13:10', unread:0, online:false, messages:[
            { from:'me', text:'Привет, Макс', time:'13:05' },
            { from:'them', text:'Увидимся вечером?', time:'13:10' },
          ]},
          { id:'tg3', name:'Группа "Команда"', emoji:'💼', preview:'Сергей: Отчёт готов', time:'10:00', unread:5, isGroup:true, messages:[
            { from:'Сергей', text:'Отчёт готов', time:'10:00' },
            { from:'Ольга', text:'Отлично! Посмотрю', time:'10:05' },
          ]},
          { id:'tg4', name:'Новости RU', emoji:'📰', preview:'Последние обновления...', time:'вчера', unread:0, isChannel:true, messages:[] },
        ];
      }
      return window.RuMobileData.telegramChats;
    }

    t(key) { return window.RuMobileT ? window.RuMobileT(key) : key; }

    render() {
      if (this.currentChat) this.renderChat(this.currentChat);
      else this.renderList();
    }

    renderList() {
      const t = (k) => this.t(k);
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#1a6fa8,#2079b5)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" onclick="window.RuMobilePhone.closeApp()">←</button>
          <span class="rm-header-icon">✈️</span>
          <span class="rm-header-title" style="color:#fff">Telegram</span>
          <button class="rm-header-btn" style="color:rgba(255,255,255,0.8)" onclick="window.RuMobilePhone.showToast('Поиск')">🔍</button>
        </div>
        <div class="rm-search-wrap" style="background:#1a6fa8;border:none">
          <div class="rm-search-inner">
            <input class="rm-search-input" placeholder="${t('search')}..." style="background:rgba(255,255,255,0.18);color:#fff" id="tg-search">
          </div>
        </div>
        <div class="rm-app-content" id="tg-chat-list">
          ${this.chats.map(c => this.chatItemHTML(c)).join('')}
        </div>
      `;
      this.screen.querySelectorAll('.rm-chat-item').forEach(el => {
        el.addEventListener('click', () => {
          const chat = this.chats.find(c => c.id === el.dataset.id);
          if (chat) { chat.unread = 0; window.RuMobilePhone.setBadge('telegram', this.chats.reduce((a,c)=>a+(c.unread||0),0)); this.currentChat = chat; this.renderChat(chat); }
        });
      });
      // Search
      this.screen.querySelector('#tg-search')?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        this.screen.querySelectorAll('.rm-chat-item').forEach(el => {
          el.style.display = el.querySelector('.rm-chat-name').textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }

    chatItemHTML(c) {
      return `
        <div class="rm-chat-item" data-id="${c.id}">
          <div class="rm-avatar ${c.online ? 'online' : ''}">${c.emoji}</div>
          <div class="rm-chat-info">
            <div class="rm-chat-name">${c.name}${c.isChannel ? ' 📢' : c.isGroup ? ' 👥' : ''}</div>
            <div class="rm-chat-preview">${c.preview || ''}</div>
          </div>
          <div class="rm-chat-meta">
            <div class="rm-chat-time">${c.time}</div>
            ${c.unread ? `<div class="rm-unread">${c.unread}</div>` : ''}
          </div>
        </div>
      `;
    }

    renderChat(chat) {
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#1a6fa8,#2079b5)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" id="tg-back">←</button>
          <div class="rm-avatar" style="width:36px;height:36px;font-size:16px">${chat.emoji}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:15px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${chat.name}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.65)">${chat.online ? this.t('online') : chat.isGroup ? `${chat.messages.length} сообщений` : ''}</div>
          </div>
          <button class="rm-header-btn" style="color:rgba(255,255,255,0.8)">⋮</button>
        </div>
        <div class="rm-messages-list rm-messages-bg" id="tg-msgs">
          ${chat.messages.length ? chat.messages.map(m => this.bubbleHTML(m)).join('') : `<div style="text-align:center;color:var(--rm-text3);margin-top:40px;font-size:14px">${this.t('noMessages')}</div>`}
        </div>
        <div class="rm-msg-input-row">
          <button class="rm-msg-attach-btn">📎</button>
          <textarea class="rm-msg-input" id="tg-input" rows="1" placeholder="${this.t('writeMes')}"></textarea>
          <button class="rm-send-btn" id="tg-send">➤</button>
        </div>
      `;
      this.screen.querySelector('#tg-back').onclick = () => { this.currentChat = null; this.renderList(); };
      const input = this.screen.querySelector('#tg-input');
      const send = this.screen.querySelector('#tg-send');
      send.onclick = () => this.sendMsg(chat, input);
      input.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMsg(chat, input); } };
      input.oninput = () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 100) + 'px'; };
      // Scroll to bottom
      const msgs = this.screen.querySelector('#tg-msgs');
      if (msgs) setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 50);
    }

    bubbleHTML(m) {
      const isMe = m.from === 'me';
      const isSystem = !isMe && m.from !== 'them';
      return `
        <div class="rm-msg-group ${isMe ? 'sent' : 'received'}">
          ${isSystem ? `<div class="rm-msg-sender-name">${m.from}</div>` : ''}
          <div class="rm-bubble ${isMe ? 'sent' : 'received'}">${m.text}<div class="rm-msg-time">${m.time}${isMe ? ' ✓✓' : ''}</div></div>
        </div>
      `;
    }

    sendMsg(chat, input) {
      const text = input.value.trim();
      if (!text) return;
      const time = new Date().toLocaleTimeString('ru', {hour:'2-digit',minute:'2-digit'});
      chat.messages.push({ from: 'me', text, time });
      chat.preview = text; chat.time = time;
      input.value = '';
      input.style.height = '';
      // Forward to SillyTavern
      const stInput = document.querySelector('#send_textarea');
      if (stInput) {
        const cur = stInput.value;
        stInput.value = (cur ? cur + '\n' : '') + `[Telegram|${chat.name}|${text}]`;
      }
      window.RuMobilePhone.showToast(this.t('sent'));
      this.renderChat(chat);
    }
  }

  window.RuApp_telegram = RuApp_telegram;
  console.log('[RU Mobile] ✅ Telegram app loaded');
}
