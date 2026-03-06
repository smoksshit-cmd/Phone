/**
 * RuApp_tiktok — TikTok приложение
 */
// @ts-nocheck
if (typeof window.RuApp_tiktok === 'undefined') {
  class RuApp_tiktok {
    constructor(screen) {
      this.screen = screen;
      this.current = 0;
      this.tab = 'foryou';
      this.render();
    }

    get videos() {
      if (!window.RuMobileData.tiktokVideos) {
        window.RuMobileData.tiktokVideos = [
          { user:'@dance_queen_ru', caption:'Новый тренд танца 💃 #тренд #танцы #reels', likes:'124K', comments:'2.1K', saves:'18K', bg:'linear-gradient(160deg,#1a0533,#6b21a8)', emoji:'💃' },
          { user:'@foodblog_russia', caption:'Рецепт блинов за 60 секунд 🥞 #еда #рецепты #кулинария', likes:'89K', comments:'1.4K', saves:'34K', bg:'linear-gradient(160deg,#3b1500,#c2410c)', emoji:'🥞' },
          { user:'@tech_news_ru', caption:'Топ гаджетов 2025 года 📱 #технологии #гаджеты #обзор', likes:'67K', comments:'890', saves:'12K', bg:'linear-gradient(160deg,#0c1a33,#1d4ed8)', emoji:'📱' },
          { user:'@nature_russia', caption:'Красота Байкала зимой ❄️ #природа #россия #байкал', likes:'312K', comments:'4.2K', saves:'67K', bg:'linear-gradient(160deg,#0c2340,#0e7490)', emoji:'❄️' },
          { user:'@sports_motivation', caption:'Не сдавайся! 💪 Каждый день — новый рекорд #спорт #мотивация', likes:'445K', comments:'8.9K', saves:'92K', bg:'linear-gradient(160deg,#1a1a00,#854d0e)', emoji:'💪' },
        ];
      }
      return window.RuMobileData.tiktokVideos;
    }

    render() {
      this.screen.innerHTML = `
        <div style="position:relative;background:#000;height:56px;display:flex;align-items:center;padding:0 14px;flex-shrink:0;z-index:5">
          <button class="rm-back-btn" style="color:#fff;background:rgba(255,255,255,0.1);flex-shrink:0" onclick="window.RuMobilePhone.closeApp()">←</button>
          <div style="flex:1;display:flex;justify-content:center;gap:28px">
            <div style="font-size:16px;font-weight:700;color:${this.tab==='following'?'#fff':'rgba(255,255,255,0.5)'};cursor:pointer;border-bottom:${this.tab==='following'?'2px solid #fff':'2px solid transparent'};padding-bottom:4px" id="tt-tab-following">Подписки</div>
            <div style="font-size:16px;font-weight:700;color:${this.tab==='foryou'?'#fff':'rgba(255,255,255,0.5)'};cursor:pointer;border-bottom:${this.tab==='foryou'?'2px solid #fff':'2px solid transparent'};padding-bottom:4px" id="tt-tab-foryou">Рекомендации</div>
          </div>
          <button class="rm-header-btn" style="color:#fff">🔍</button>
        </div>
        <div id="tt-video-container" style="flex:1;overflow:hidden;position:relative"></div>
      `;
      this.screen.querySelector('#tt-tab-following').onclick = () => { this.tab = 'following'; this.render(); };
      this.screen.querySelector('#tt-tab-foryou').onclick = () => { this.tab = 'foryou'; this.render(); };
      this.renderVideo();
    }

    renderVideo() {
      const container = this.screen.querySelector('#tt-video-container');
      if (!container) return;
      const v = this.videos[this.current];
      container.innerHTML = `
        <div id="tt-card" style="width:100%;height:100%;background:${v.bg};position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden">
          <!-- Background emoji -->
          <div style="font-size:120px;opacity:0.15;position:absolute;top:50%;left:50%;transform:translate(-50%,-60%)">${v.emoji}</div>
          <!-- Play icon -->
          <div id="tt-play-icon" style="font-size:56px;opacity:0.6;transition:opacity 0.2s">▶️</div>
          <!-- Top gradient -->
          <div style="position:absolute;top:0;left:0;right:0;height:80px;background:linear-gradient(rgba(0,0,0,0.4),transparent)"></div>
          <!-- Bottom info -->
          <div style="position:absolute;bottom:0;left:0;right:0;padding:20px 14px 20px;background:linear-gradient(transparent,rgba(0,0,0,0.9))">
            <div style="font-size:15px;font-weight:700;color:#fff">${v.user}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:5px;line-height:1.4">${v.caption}</div>
            <div style="display:flex;align-items:center;gap:8px;margin-top:12px">
              <span style="font-size:12px;color:rgba(255,255,255,0.6)">🎵 Оригинальный звук</span>
            </div>
          </div>
          <!-- Right actions -->
          <div style="position:absolute;right:12px;bottom:80px;display:flex;flex-direction:column;gap:18px;align-items:center" id="tt-actions">
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer" id="tt-like">
              <div style="font-size:32px">❤️</div>
              <div style="font-size:11px;color:#fff;font-weight:500">${v.likes}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer">
              <div style="font-size:32px">💬</div>
              <div style="font-size:11px;color:#fff;font-weight:500">${v.comments}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer">
              <div style="font-size:32px">⭐</div>
              <div style="font-size:11px;color:#fff;font-weight:500">${v.saves}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer">
              <div style="font-size:32px">↗️</div>
              <div style="font-size:11px;color:#fff;font-weight:500">Поделиться</div>
            </div>
          </div>
          <!-- Progress dots -->
          <div style="position:absolute;top:60px;right:14px;display:flex;flex-direction:column;gap:4px">
            ${this.videos.map((_,i) => `<div style="width:4px;height:${i===this.current?16:6}px;border-radius:2px;background:${i===this.current?'#fff':'rgba(255,255,255,0.3)'}"></div>`).join('')}
          </div>
        </div>
      `;

      const card = container.querySelector('#tt-card');
      const playIcon = container.querySelector('#tt-play-icon');

      // Play/pause toggle
      card.addEventListener('click', (e) => {
        if (e.target.closest('#tt-actions')) return;
        playIcon.style.opacity = playIcon.style.opacity === '0' ? '0.6' : '0';
      });

      // Like button
      container.querySelector('#tt-like').addEventListener('click', () => {
        window.RuMobilePhone.showToast('❤️ Лайк!');
      });

      // Swipe
      let touchY = 0;
      card.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
      card.addEventListener('touchend', (e) => {
        const dy = e.changedTouches[0].clientY - touchY;
        this.swipe(dy);
      });
      card.addEventListener('wheel', (e) => { this.swipe(-e.deltaY); }, { passive: true });
    }

    swipe(dy) {
      if (dy < -40 && this.current < this.videos.length - 1) { this.current++; this.renderVideo(); }
      if (dy > 40 && this.current > 0) { this.current--; this.renderVideo(); }
    }
  }

  window.RuApp_tiktok = RuApp_tiktok;
  console.log('[RU Mobile] ✅ TikTok app loaded');
}
