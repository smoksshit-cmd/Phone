/**
 * RuApp_dvach — 2ch.hk приложение
 */
// @ts-nocheck
if (typeof window.RuApp_dvach === 'undefined') {
  class RuApp_dvach {
    constructor(screen) {
      this.screen = screen;
      this.currentBoard = null;
      this.currentThread = null;
      this.render();
    }

    get boards() {
      return [
        { id:'b',  name:'/b/',  full:'Бред',           posts:1337, nsfw:true },
        { id:'v',  name:'/v/',  full:'Видеоигры',       posts:420,  nsfw:false },
        { id:'pr', name:'/pr/', full:'Программирование', posts:88,   nsfw:false },
        { id:'mu', name:'/mu/', full:'Музыка',          posts:256,  nsfw:false },
        { id:'a',  name:'/a/',  full:'Аниме',           posts:666,  nsfw:false },
        { id:'sci',name:'/sci/',full:'Наука',           posts:144,  nsfw:false },
        { id:'po', name:'/po/', full:'Политика',        posts:999,  nsfw:true },
        { id:'fiz',name:'/fiz/',full:'Физкультура',     posts:77,   nsfw:false },
      ];
    }

    get threads() {
      return {
        b: [
          { id:'b1', title:'Тред для тех, кто зашёл без цели', op:'Аноним', replies:42, images:7, bump:'14:32', text:'Всем привет. Сидите, никуда не торопитесь.', posts:[
            { num:1, author:'Аноним', text:'Всем привет. Сидите, никуда не торопитесь.', time:'14:32' },
            { num:2, author:'Аноним', text:'>>1 сам зашёл без цели', time:'14:35' },
            { num:3, author:'Аноним', text:'ОП педик', time:'14:36' },
          ]},
          { id:'b2', title:'Курица или яйцо?', op:'Аноним', replies:127, images:3, bump:'13:10', text:'Снова этот вопрос. Давайте разберёмся раз и навсегда.', posts:[
            { num:1, author:'Аноним', text:'Снова этот вопрос. Давайте разберёмся.', time:'13:10' },
            { num:2, author:'Аноним', text:'Яйцо. Эволюция объясняет.', time:'13:12' },
          ]},
        ],
        v: [
          { id:'v1', title:'Лучшая RPG всех времён?', op:'GamerАноним', replies:58, images:12, bump:'15:00', text:'Мой голос — Morrowind. Что скажете?', posts:[
            { num:1, author:'GamerАноним', text:'Мой голос — Morrowind. Что скажете?', time:'15:00' },
            { num:2, author:'Аноним', text:'Baldur\'s Gate 3, не обсуждается', time:'15:05' },
          ]},
          { id:'v2', title:'Steam vs GOG vs Pirate Bay — честное сравнение', op:'ПК-аноним', replies:89, images:5, bump:'12:00', text:'Где лучше покупать игры?', posts:[] },
        ],
        pr: [
          { id:'pr1', title:'Почему Rust лучше C++ и это не обсуждается', op:'RustАноним', replies:34, images:2, bump:'11:00', text:'Объясняю в картинках для плюсачей', posts:[] },
          { id:'pr2', title:'Python 3.13 — что нового?', op:'ПитонАноним', replies:21, images:1, bump:'10:00', text:'Вышла новая версия, обсуждаем', posts:[] },
        ],
      };
    }

    render() {
      if (this.currentThread) this.renderThread();
      else if (this.currentBoard) this.renderBoard();
      else this.renderBoards();
    }

    renderBoards() {
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:#111;border-bottom:2px solid #2a2a2a">
          <button class="rm-back-btn" style="color:#888;background:rgba(255,255,255,0.05)" onclick="window.RuMobilePhone.closeApp()">←</button>
          <span class="rm-header-icon" style="font-family:monospace;font-size:18px">2ch</span>
          <span class="rm-header-title" style="color:#ccc;font-family:var(--mono)">2ch.hk</span>
          <button class="rm-header-btn" onclick="window.RuMobilePhone.showToast('Поиск по борде')">🔍</button>
        </div>
        <div class="rm-app-content" style="background:#0d0d0d" id="dvach-boards">
          <div style="padding:10px 14px 6px;font-size:11px;color:#444;font-family:var(--mono);text-transform:uppercase;letter-spacing:1px">Доски</div>
          ${this.boards.map(b => `
            <div class="rm-thread-item" data-board="${b.id}" style="border-bottom:1px solid #1a1a1a;cursor:pointer">
              <div style="display:flex;align-items:center;gap:12px">
                <div style="width:44px;height:44px;border-radius:8px;background:#1a1a1a;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#777;font-family:var(--mono);flex-shrink:0">${b.name}</div>
                <div style="flex:1">
                  <div style="font-size:14px;font-weight:600;color:#bbb;font-family:var(--mono)">${b.name} — ${b.full}</div>
                  <div style="font-size:12px;color:#444;margin-top:3px;font-family:var(--mono)">📝 ${b.posts} тредов${b.nsfw?' · 18+':''}</div>
                </div>
                <div style="color:#444;font-size:14px">›</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      this.screen.querySelectorAll('[data-board]').forEach(el => {
        el.onclick = () => { this.currentBoard = el.dataset.board; this.render(); };
      });
    }

    renderBoard() {
      const board = this.boards.find(b => b.id === this.currentBoard);
      const threads = this.threads[this.currentBoard] || [];
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:#111;border-bottom:2px solid #2a2a2a">
          <button class="rm-back-btn" style="color:#888;background:rgba(255,255,255,0.05)" id="dvach-back-boards">←</button>
          <span class="rm-header-title" style="color:#ccc;font-family:var(--mono)">${board.name} — ${board.full}</span>
          <button class="rm-header-btn" id="dvach-new-thread" style="color:#777">✏️</button>
        </div>
        <div class="rm-app-content" style="background:#0d0d0d">
          ${threads.map(t => `
            <div class="rm-thread-item" data-thread="${t.id}" style="border-bottom:1px solid #1a1a1a;cursor:pointer">
              <div style="font-size:11px;color:#555;font-family:var(--mono);margin-bottom:5px">#${t.id} · bump ${t.bump}</div>
              <div style="font-size:14px;font-weight:600;color:#bbb;line-height:1.35">${t.title}</div>
              <div style="font-size:13px;color:#555;margin-top:6px;line-height:1.4">${t.text.slice(0,100)}${t.text.length>100?'...':''}</div>
              <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;color:#444;font-family:var(--mono)">
                <span>💬 ${t.replies}</span>
                <span>🖼 ${t.images}</span>
              </div>
            </div>
          `).join('') || `<div style="text-align:center;color:#333;padding:60px;font-family:var(--mono)">Тредов нет</div>`}
          <!-- New thread form -->
          <div style="padding:16px;border-top:1px solid #1a1a1a;margin-top:8px">
            <div style="font-size:12px;color:#444;font-family:var(--mono);margin-bottom:8px">Создать тред:</div>
            <input id="dvach-thread-title" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:10px;color:#bbb;font-size:13px;font-family:var(--mono);box-sizing:border-box;outline:none;margin-bottom:8px" placeholder="Тема треда...">
            <textarea id="dvach-thread-body" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:10px;color:#bbb;font-size:13px;font-family:var(--mono);box-sizing:border-box;outline:none;resize:none;min-height:80px" placeholder="Текст поста..."></textarea>
            <button id="dvach-thread-post" style="background:#2a2a2a;border:none;color:#888;padding:9px 20px;border-radius:8px;cursor:pointer;margin-top:8px;font-family:var(--mono);font-size:13px;transition:background 0.15s">Запостить</button>
          </div>
        </div>
      `;
      this.screen.querySelector('#dvach-back-boards').onclick = () => { this.currentBoard = null; this.render(); };
      this.screen.querySelectorAll('[data-thread]').forEach(el => {
        el.onclick = () => {
          const t = threads.find(th => th.id === el.dataset.thread);
          if (t) { this.currentThread = t; this.render(); }
        };
      });
      const postBtn = this.screen.querySelector('#dvach-thread-post');
      postBtn.onmouseenter = () => postBtn.style.background = '#333';
      postBtn.onmouseleave = () => postBtn.style.background = '#2a2a2a';
      postBtn.onclick = () => {
        const title = this.screen.querySelector('#dvach-thread-title').value.trim();
        const body = this.screen.querySelector('#dvach-thread-body').value.trim();
        if (!title || !body) { window.RuMobilePhone.showToast('Заполни тему и текст'); return; }
        if (!this.threads[this.currentBoard]) this.threads[this.currentBoard] = [];
        this.threads[this.currentBoard].unshift({ id:`new_${Date.now()}`, title, op:'Аноним', replies:0, images:0, bump: new Date().toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'}), text:body, posts:[{num:1,author:'Аноним',text:body,time:new Date().toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'})}] });
        window.RuMobilePhone.showToast('Тред создан!');
        this.render();
      };
    }

    renderThread() {
      const t = this.currentThread;
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:#111;border-bottom:2px solid #2a2a2a">
          <button class="rm-back-btn" style="color:#888;background:rgba(255,255,255,0.05)" id="dvach-back-board">←</button>
          <span class="rm-header-title" style="color:#bbb;font-family:var(--mono);font-size:13px">${t.title.slice(0,30)}${t.title.length>30?'...':''}</span>
        </div>
        <div class="rm-app-content" style="background:#0d0d0d" id="dvach-posts-container">
          ${(t.posts.length ? t.posts : [{num:1,author:'Аноним',text:t.text,time:t.bump}]).map(p => `
            <div style="padding:12px 14px;border-bottom:1px solid #1a1a1a">
              <div style="display:flex;gap:8px;margin-bottom:6px;align-items:center">
                <span style="font-size:11px;color:#555;font-family:var(--mono)">Аноним</span>
                <span style="font-size:11px;color:#333;font-family:var(--mono)">${p.time}</span>
                <span style="font-size:11px;color:#555;font-family:var(--mono)">#${p.num}</span>
              </div>
              <div style="font-size:14px;color:#bbb;line-height:1.5">${p.text}</div>
            </div>
          `).join('')}
          <!-- Reply form -->
          <div style="padding:14px">
            <textarea id="dvach-reply-input" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:10px;color:#bbb;font-size:13px;font-family:var(--mono);box-sizing:border-box;outline:none;resize:none;min-height:70px" placeholder="Написать в тред..."></textarea>
            <button id="dvach-reply-send" style="background:#2a2a2a;border:none;color:#888;padding:9px 20px;border-radius:8px;cursor:pointer;margin-top:8px;font-family:var(--mono);font-size:13px">Ответить</button>
          </div>
        </div>
      `;
      this.screen.querySelector('#dvach-back-board').onclick = () => { this.currentThread = null; this.render(); };
      const sendBtn = this.screen.querySelector('#dvach-reply-send');
      const replyInput = this.screen.querySelector('#dvach-reply-input');
      sendBtn.onclick = () => {
        const txt = replyInput.value.trim();
        if (!txt) return;
        const nextNum = (t.posts[t.posts.length-1]?.num || 0) + 1;
        const time = new Date().toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'});
        t.posts.push({ num:nextNum, author:'Аноним', text:txt, time });
        t.replies++;
        replyInput.value = '';
        window.RuMobilePhone.showToast('Пост отправлен');
        this.renderThread();
      };
    }
  }

  window.RuApp_dvach = RuApp_dvach;
  console.log('[RU Mobile] ✅ 2ch app loaded');
}
