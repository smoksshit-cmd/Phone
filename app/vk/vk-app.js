/**
 * RuApp_vk — ВКонтакте приложение
 */
// @ts-nocheck
if (typeof window.RuApp_vk === 'undefined') {
  class RuApp_vk {
    constructor(screen) {
      this.screen = screen;
      this.currentTab = 'feed';
      this.render();
    }

    get posts() {
      if (!window.RuMobileData.vkPosts) {
        window.RuMobileData.vkPosts = [
          { id:'v1', author:'Алиса Петрова', avatar:'👩', time:'2 часа назад', text:'Отличный день! ☀️ Гуляла в парке, встретила старых друзей. Жизнь прекрасна!', likes:47, comments:8, reposts:3, liked:false, emoji:'🌳' },
          { id:'v2', author:'Макс Иванов', avatar:'👨', time:'5 часов назад', text:'Новый рекорд на тренировке 💪 Не сдавайтесь, ребята — результаты придут!', likes:123, comments:15, reposts:7, liked:false, emoji:'🏋️' },
          { id:'v3', author:'Ольга Сидорова', avatar:'👩‍🦰', time:'вчера', text:'Только что посмотрела новый сезон любимого сериала. БРАВО сценаристам! 👏', likes:89, comments:22, reposts:4, liked:true, emoji:'📺' },
          { id:'v4', author:'Дмитрий Козлов', avatar:'🧔', time:'3 дня назад', text:'Рецепт борща от бабушки наконец-то опробован. Получилось идеально 🍲❤️', likes:215, comments:41, reposts:19, liked:false, emoji:'🍲' },
          { id:'v5', author:'Катя Морозова', avatar:'👱‍♀️', time:'неделю назад', text:'Поездка в Питер была незабываемой! Белые ночи — это что-то волшебное ✨', likes:304, comments:56, reposts:28, liked:false, emoji:'🏛️' },
        ];
      }
      return window.RuMobileData.vkPosts;
    }

    render() {
      this.screen.innerHTML = `
        <div class="rm-app-header" style="background:linear-gradient(145deg,#1557a0,#2787f5)">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.15)" onclick="window.RuMobilePhone.closeApp()">←</button>
          <span class="rm-header-icon">💙</span>
          <span class="rm-header-title" style="color:#fff">ВКонтакте</span>
          <button class="rm-header-btn" style="color:rgba(255,255,255,0.8)" onclick="window.RuMobilePhone.showToast('Поиск')">🔍</button>
        </div>
        <div class="rm-tabs">
          <div class="rm-tab ${this.currentTab==='feed'?'active':''}" data-tab="feed" style="${this.currentTab==='feed'?'color:var(--vk);border-bottom-color:var(--vk)':''}">Новости</div>
          <div class="rm-tab ${this.currentTab==='friends'?'active':''}" data-tab="friends">Друзья</div>
          <div class="rm-tab ${this.currentTab==='messages'?'active':''}" data-tab="messages">Сообщения</div>
          <div class="rm-tab ${this.currentTab==='groups'?'active':''}" data-tab="groups">Группы</div>
        </div>
        <div class="rm-app-content" id="vk-content"></div>
      `;
      this.screen.querySelectorAll('.rm-tab').forEach(tab => {
        tab.onclick = () => { this.currentTab = tab.dataset.tab; this.render(); };
      });
      this.renderTab();
    }

    renderTab() {
      const content = this.screen.querySelector('#vk-content');
      if (!content) return;
      switch (this.currentTab) {
        case 'feed': content.innerHTML = this.posts.map(p => this.postHTML(p)).join(''); this.bindPostActions(); break;
        case 'friends': content.innerHTML = this.friendsHTML(); break;
        case 'messages': content.innerHTML = this.messagesHTML(); break;
        case 'groups': content.innerHTML = this.groupsHTML(); break;
      }
    }

    postHTML(p) {
      return `
        <div class="rm-post-card" data-id="${p.id}">
          <div class="rm-post-header">
            <div class="rm-post-avatar">${p.avatar}</div>
            <div><div class="rm-post-author">${p.author}</div><div class="rm-post-time">${p.time}</div></div>
            <button style="background:none;border:none;color:var(--rm-text3);font-size:18px;cursor:pointer;margin-left:auto">⋮</button>
          </div>
          <div class="rm-post-media">${p.emoji}</div>
          <div class="rm-post-text">${p.text}</div>
          <div class="rm-post-actions">
            <button class="rm-post-action ${p.liked?'liked':''}" data-action="like" data-id="${p.id}">❤️ ${p.likes}</button>
            <button class="rm-post-action" data-action="comment" data-id="${p.id}">💬 ${p.comments}</button>
            <button class="rm-post-action" data-action="repost" data-id="${p.id}">🔁 ${p.reposts}</button>
            <button class="rm-post-action" data-action="share" data-id="${p.id}">↗️</button>
          </div>
        </div>
      `;
    }

    bindPostActions() {
      this.screen.querySelectorAll('[data-action="like"]').forEach(btn => {
        btn.onclick = () => {
          const post = this.posts.find(p => p.id === btn.dataset.id);
          if (!post) return;
          post.liked = !post.liked;
          post.likes += post.liked ? 1 : -1;
          btn.classList.toggle('liked', post.liked);
          btn.textContent = `❤️ ${post.likes}`;
        };
      });
      this.screen.querySelectorAll('[data-action="comment"]').forEach(btn => {
        btn.onclick = () => window.RuMobilePhone.showToast('Комментарии');
      });
      this.screen.querySelectorAll('[data-action="repost"]').forEach(btn => {
        btn.onclick = () => {
          const post = this.posts.find(p => p.id === btn.dataset.id);
          if (post) { post.reposts++; btn.textContent = `🔁 ${post.reposts}`; window.RuMobilePhone.showToast('Репост опубликован'); }
        };
      });
    }

    friendsHTML() {
      const friends = [
        { name:'Алиса Петрова', emoji:'👩', status:'онлайн', mutual:12 },
        { name:'Макс Иванов', emoji:'👨', status:'30 мин назад', mutual:7 },
        { name:'Ольга Сидорова', emoji:'👩‍🦰', status:'вчера', mutual:5 },
        { name:'Дмитрий Козлов', emoji:'🧔', status:'онлайн', mutual:3 },
        { name:'Катя Морозова', emoji:'👱‍♀️', status:'2 часа назад', mutual:9 },
      ];
      return friends.map(f => `
        <div class="rm-chat-item">
          <div class="rm-avatar ${f.status==='онлайн'?'online':''}">${f.emoji}</div>
          <div class="rm-chat-info">
            <div class="rm-chat-name">${f.name}</div>
            <div class="rm-chat-preview">${f.status} · ${f.mutual} общих</div>
          </div>
          <button style="background:var(--vk);border:none;color:#fff;padding:6px 14px;border-radius:9px;font-size:13px;cursor:pointer;font-family:inherit">Написать</button>
        </div>
      `).join('');
    }

    messagesHTML() {
      return `<div style="text-align:center;color:var(--rm-text3);padding:60px 20px;font-size:14px">Нет новых сообщений</div>`;
    }

    groupsHTML() {
      const groups = [
        { name:'Программисты РФ', emoji:'💻', members:'248K' },
        { name:'Рецепты от бабушки', emoji:'🍳', members:'1.2M' },
        { name:'Природа России', emoji:'🌲', members:'567K' },
        { name:'Мемы для своих', emoji:'😂', members:'3.4M' },
      ];
      return groups.map(g => `
        <div class="rm-chat-item">
          <div class="rm-avatar" style="border-radius:10px">${g.emoji}</div>
          <div class="rm-chat-info">
            <div class="rm-chat-name">${g.name}</div>
            <div class="rm-chat-preview">${g.members} участников</div>
          </div>
        </div>
      `).join('');
    }
  }

  window.RuApp_vk = RuApp_vk;
  console.log('[RU Mobile] ✅ VK app loaded');
}
