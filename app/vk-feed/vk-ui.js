/**
 * ВКонтактеUI...
 * ...ВКонтакте...
 */
class VkFeedUI {
  constructor() {
    this.currentPage = 'hot'; // ...：hot, ranking, user
    this.currentPostId = null;
    this.clickHandler = null;
    this.likeClickHandler = null;
    // Лайк - : { postId: { likes: number, isLiked: boolean }, ... }
    this.likesData = {};
    // КомментарийЛайк - : { commentId: { likes: number, isLiked: boolean }, ... }
    this.commentLikesData = {};

    // Аватар
    this.avatarColors = [
      'var(--avatar-gradient-1)', // ...
      'var(--avatar-color-1)', // #b28cb9
      'var(--avatar-color-2)', // #e2b3d4
      'var(--avatar-color-3)', // #f7d1e6
      'var(--avatar-color-4)', // #d49ec2
      'var(--avatar-color-5)', // #f3c6d7
      'var(--avatar-color-6)', // #ec97b7
      'var(--avatar-color-7)', // #d66a88
      'var(--avatar-color-8)', // #b74d66
      'var(--avatar-color-9)', // #e3d6a7
      'var(--avatar-color-10)', // #c8ac6d
      'var(--avatar-color-11)', // #a0d8e1
      'var(--avatar-color-12)', // #2e8b9b
      'var(--avatar-color-13)', // #1a6369
      'var(--avatar-color-14)', // #0e3d45
      'var(--avatar-color-15)', // #6ba1e1
      'var(--avatar-color-16)', // #1f5e8d
      'var(--avatar-color-17)', // #b7d3a8
      'var(--avatar-color-18)', // #3e7b41
      'var(--avatar-color-19)', // #f9e79f
      'var(--avatar-color-20)', // #a3b4e2
    ];

    // 5：
    this.lastDataFingerprints = {
      hotSearches: null,
      rankings: null,
      rankingPosts: null,
      userStats: null,
      lastUpdateTime: 0,
    };
    this.persistentData = {
      hotSearches: [],
      rankings: [],
      rankingPosts: [], // ...
      userStats: null,
    };

    this.init();
  }

  init() {
    console.log('[VkFeed UI] ВКонтактеUI...');

    // 🔥 ：Комментарий
    this.startCommentLayoutMonitor();
  }

  /**
   * 🔥 Комментарий... - ...CSS...
   */
  startCommentLayoutMonitor() {
    // MutationObserverDOM
    const observer = new MutationObserver(mutations => {
      let needsLayoutFix = false;

      mutations.forEach(mutation => {
        // Комментарий
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList?.contains('comment-item') || node.querySelector?.('.comment-item')) {
                needsLayoutFix = true;
              }
            }
          });
        }

        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'style' || mutation.attributeName === 'class')
        ) {
          const target = mutation.target;
          if (target.classList?.contains('comment-author') || target.classList?.contains('comment-info')) {
            needsLayoutFix = true;
          }
        }
      });

      if (needsLayoutFix) {
        // ，
        clearTimeout(this.layoutFixTimeout);
        this.layoutFixTimeout = setTimeout(() => {
          this.fixCommentLayout();
        }, 100);
      }
    });

    // ВКонтакте/* Приложение */
    const vk_feedApp = document.querySelector('.vk_feed-app');
    if (vk_feedApp) {
      observer.observe(vk_feedApp, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });

      console.log('[VkFeed UI] 🔥 Комментарий...');
    }

    this.fixCommentLayout();
  }

  /**
   * 🔥 ...Комментарий... - .../* Приложение */...CSS...
   */
  fixCommentLayout() {
    const commentItems = document.querySelectorAll('.vk_feed-app .comment-item');
    let fixedCount = 0;

    commentItems.forEach(commentItem => {
      const commentAuthor = commentItem.querySelector('.comment-author');
      const commentInfo = commentItem.querySelector('.comment-info');
      const commentContent = commentItem.querySelector('.comment-content');
      const commentActions = commentItem.querySelector('.comment-actions');

      if (commentAuthor) {
        // НастройкиКомментарий
        const authorStyle = commentAuthor.style;
        const authorComputed = window.getComputedStyle(commentAuthor);

        if (authorComputed.flexDirection !== 'row' || authorComputed.display !== 'flex') {
          authorStyle.setProperty('display', 'flex', 'important');
          authorStyle.setProperty('flex-direction', 'row', 'important');
          authorStyle.setProperty('align-items', 'center', 'important');
          authorStyle.setProperty('flex-wrap', 'nowrap', 'important');
          authorStyle.setProperty('gap', '8px', 'important');
          fixedCount++;
        }
      }

      if (commentInfo) {
        // НастройкиКомментарий
        const infoStyle = commentInfo.style;
        const infoComputed = window.getComputedStyle(commentInfo);

        if (infoComputed.flexDirection !== 'column' || infoComputed.display !== 'flex') {
          infoStyle.setProperty('display', 'flex', 'important');
          infoStyle.setProperty('flex-direction', 'column', 'important');
          infoStyle.setProperty('flex', '1', 'important');
          infoStyle.setProperty('min-width', '0', 'important');
          fixedCount++;
        }
      }

      if (commentContent) {
        // Комментарий
        const contentStyle = commentContent.style;
        contentStyle.setProperty('display', 'block', 'important');
        contentStyle.setProperty('width', '100%', 'important');
        contentStyle.setProperty('margin-bottom', '8px', 'important');
      }

      if (commentActions) {
        // Комментарий
        const actionsStyle = commentActions.style;
        const actionsComputed = window.getComputedStyle(commentActions);

        if (actionsComputed.flexDirection !== 'row' || actionsComputed.display !== 'flex') {
          actionsStyle.setProperty('display', 'flex', 'important');
          actionsStyle.setProperty('flex-direction', 'row', 'important');
          actionsStyle.setProperty('align-items', 'center', 'important');
          actionsStyle.setProperty('justify-content', 'center', 'important');
          actionsStyle.setProperty('gap', '20px', 'important');
        }
      }
    });

    if (fixedCount > 0) {
      console.log(`[VkFeed UI] 🔧 ... ${fixedCount} ...Комментарий...`);
    }
  }

  /**
   * 🔥 ...Комментарий... - ...Пользователь...
   */
  static manualFixCommentLayout() {
    console.log('[VkFeed UI] 🔧 ...Комментарий......');

    const commentItems = document.querySelectorAll('.vk_feed-app .comment-item');
    let fixedCount = 0;

    commentItems.forEach((commentItem, index) => {
      console.log(`[VkFeed UI] ...Комментарий ${index + 1}/${commentItems.length}`);

      const commentAuthor = commentItem.querySelector('.comment-author');
      const commentInfo = commentItem.querySelector('.comment-info');
      const commentContent = commentItem.querySelector('.comment-content');
      const commentActions = commentItem.querySelector('.comment-actions');

      // Комментарий
      commentItem.style.setProperty('display', 'block', 'important');
      commentItem.style.setProperty('width', '100%', 'important');

      if (commentAuthor) {
        console.log(`[VkFeed UI] ...Комментарий... ${index + 1}`);
        const authorStyle = commentAuthor.style;

        authorStyle.removeProperty('flex-direction');
        authorStyle.removeProperty('display');

        // /* Приложение */
        authorStyle.setProperty('display', 'flex', 'important');
        authorStyle.setProperty('flex-direction', 'row', 'important');
        authorStyle.setProperty('align-items', 'center', 'important');
        authorStyle.setProperty('flex-wrap', 'nowrap', 'important');
        authorStyle.setProperty('gap', '8px', 'important');
        authorStyle.setProperty('margin-bottom', '8px', 'important');
        authorStyle.setProperty('width', '100%', 'important');
        fixedCount++;
      }

      if (commentInfo) {
        console.log(`[VkFeed UI] ...Комментарий... ${index + 1}`);
        const infoStyle = commentInfo.style;

        infoStyle.removeProperty('flex-direction');
        infoStyle.removeProperty('display');

        // /* Приложение */
        infoStyle.setProperty('display', 'flex', 'important');
        infoStyle.setProperty('flex-direction', 'column', 'important');
        infoStyle.setProperty('flex', '1', 'important');
        infoStyle.setProperty('min-width', '0', 'important');
        infoStyle.setProperty('overflow', 'hidden', 'important');
        fixedCount++;
      }

      if (commentContent) {
        const contentStyle = commentContent.style;
        contentStyle.setProperty('display', 'block', 'important');
        contentStyle.setProperty('width', '100%', 'important');
        contentStyle.setProperty('margin-bottom', '8px', 'important');
      }

      if (commentActions) {
        const actionsStyle = commentActions.style;
        actionsStyle.setProperty('display', 'flex', 'important');
        actionsStyle.setProperty('flex-direction', 'row', 'important');
        actionsStyle.setProperty('align-items', 'center', 'important');
        actionsStyle.setProperty('justify-content', 'center', 'important');
        actionsStyle.setProperty('gap', '20px', 'important');
        actionsStyle.setProperty('margin-top', '8px', 'important');
        actionsStyle.setProperty('width', '100%', 'important');
      }
    });

    console.log(`[VkFeed UI] ✅ ...，... ${commentItems.length} ...Комментарий...，... ${fixedCount} ...`);
    return { total: commentItems.length, fixed: fixedCount };
  }

  /**
   * ...（...）
   */
  calculateDataFingerprint(data, type) {
    if (!data) return null;

    let content = '';
    switch (type) {
      case 'hotSearches':
        content = data.map(item => `${item.rank}:${item.title}:${item.heat}`).join('|');
        break;
      case 'rankings':
        content = data
          .map(
            ranking =>
              `${ranking.title}:${ranking.type}:${ranking.items
                .map(item => `${item.rank}:${item.name}:${item.heat}`)
                .join(',')}`,
          )
          .join('|');
        break;
      case 'rankingPosts':
        content = data.map(post => `${post.id}:${post.author}:${post.content.substring(0, 50)}`).join('|');
        break;
      case 'userStats':
        content = data ? `${data.fans}:${data.following}:${data.posts}` : '';
        break;
      default:
        content = JSON.stringify(data);
    }

    // （）
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // ...32...
    }
    return hash.toString();
  }

  /**
   * ...
   */
  detectDataChanges(newContent) {
    const currentTime = Date.now();
    const changes = {
      hotSearches: false,
      rankings: false,
      rankingPosts: false,
      userStats: false,
      hasAnyChange: false,
    };

    const hasHotSearchPattern = /\[...\|/.test(newContent);
    const hasRankingPattern = /\[...\|/.test(newContent) || /\[...\|/.test(newContent);
    const hasRankingPostPattern = /\[...\|[^|]+\|r\d+\|/.test(newContent); // ...ID...r...
    const hasUserStatsPattern = /\[Подписчики...\|/.test(newContent);

    console.log('[VkFeed UI] 🔍 ...:', {
      hasHotSearchPattern,
      hasRankingPattern,
      hasRankingPostPattern,
      hasUserStatsPattern,
    });

    // ，
    if (hasHotSearchPattern) {
      changes.hotSearches = true;
      changes.hasAnyChange = true;
      console.log('[VkFeed UI] ✅ ...');
    }

    if (hasRankingPattern) {
      changes.rankings = true;
      changes.hasAnyChange = true;
      console.log('[VkFeed UI] ✅ ...');
    }

    if (hasRankingPostPattern) {
      changes.rankingPosts = true;
      changes.hasAnyChange = true;
      console.log('[VkFeed UI] ✅ ...');
    }

    if (hasUserStatsPattern) {
      changes.userStats = true;
      changes.hasAnyChange = true;
      console.log('[VkFeed UI] ✅ ...Подписчики...');
    }

    // Время
    if (changes.hasAnyChange) {
      this.lastDataFingerprints.lastUpdateTime = currentTime;
    }

    return changes;
  }

  /**
   * ...Пользователь...
   */
  hashUsername(username) {
    let hash = 0;
    if (username.length === 0) return hash;

    for (let i = 0; i < username.length; i++) {
      const char = username.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // ...32...
    }

    return Math.abs(hash);
  }

  /**
   * ...Пользователь...Аватар...
   */
  getAvatarColor(username) {
    // Пользователь（）
    let currentUsername = this.getCurrentUsername();
    if (currentUsername === '{{user}}') {
      currentUsername = this.getRealUsername();
    }
    const isMainAccount = window.vk_feedManager ? window.vk_feedManager.currentAccount.isMainAccount : true;

    // Пользователь（Пользователь）
    if (
      username === currentUsername ||
      username === '{{user}}' ||
      (username === 'User' && currentUsername === 'User')
    ) {
      // ЕслиПользователь，Назад
      return isMainAccount ? '#C4B7D6' : '#A37070';
    }

    // Пользователь
    const hash = this.hashUsername(username);
    const colorIndex = hash % this.avatarColors.length;
    return this.avatarColors[colorIndex];
  }

  /**
   * ...АватарHTML
   */
  generateAvatarHTML(username, size = '') {
    const color = this.getAvatarColor(username);
    const sizeClass = size ? ` ${size}` : '';
    const initial = username[0] || '?';

    return `<div class="author-avatar${sizeClass}" style="background: ${color}">${initial}</div>`;
  }

  /**
   * ...Сообщения...ВКонтакте...（...5：...）
   */
  parseVkFeedContent(content) {
    // ВКонтакте
    const vk_feedRegex = /<!-- WEIBO_CONTENT_START -->([\s\S]*?)<!-- WEIBO_CONTENT_END -->/;
    const match = content.match(vk_feedRegex);

    if (!match) {
      console.log('[VkFeed UI] ...ВКонтакте...');
      return {
        posts: [],
        comments: {},
        hotSearches: this.persistentData.hotSearches,
        rankings: this.persistentData.rankings,
        rankingPosts: this.persistentData.rankingPosts,
        userStats: this.persistentData.userStats,
      };
    }

    const vk_feedContent = match[1];
    console.log('[VkFeed UI] 🔍 ...ВКонтакте...，...');

    const changes = this.detectDataChanges(vk_feedContent);

    const posts = [];
    const comments = {};
    let hotSearches = this.persistentData.hotSearches; // ...
    let rankings = this.persistentData.rankings;
    let rankingPosts = this.persistentData.rankingPosts;
    let userStats = this.persistentData.userStats;

    // : [|Никнейм|id|]
    const postRegex = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
    let postMatch;
    const newRankingPosts = []; // ...

    while ((postMatch = postRegex.exec(vk_feedContent)) !== null) {
      const postId = postMatch[2];
      const post = {
        id: postId,
        author: postMatch[1],
        content: postMatch[3],
        timestamp: new Date().toLocaleString(),
        likes: Math.floor(Math.random() * 1000) + 10, // ...Лайк...
        comments: Math.floor(Math.random() * 100) + 5, // ...Комментарий...
        shares: Math.floor(Math.random() * 50) + 1, // ...Репост...
        // IDОК
        type: postId.startsWith('h') ? 'hot' : postId.startsWith('r') ? 'ranking' : 'user',
      };

      if (postId.startsWith('r')) {
        newRankingPosts.push(post);
        console.log('[VkFeed UI] 📊 ...:', postId);
      } else {
        posts.push(post);
      }
      comments[post.id] = [];
    }

    // Если，
    if (changes.rankingPosts && newRankingPosts.length > 0) {
      rankingPosts = newRankingPosts;
      this.persistentData.rankingPosts = rankingPosts;
      console.log('[VkFeed UI] ✅ ...，...:', rankingPosts.length, '...');
    }

    // Комментарий: [Комментарий|КомментарийНикнейм|id|Комментарий]
    const commentRegex = /\[Комментарий\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
    let commentMatch;
    while ((commentMatch = commentRegex.exec(vk_feedContent)) !== null) {
      const comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        postId: commentMatch[2],
        author: commentMatch[1],
        content: commentMatch[3],
        timestamp: new Date().toLocaleString(),
        likes: Math.floor(Math.random() * 50) + 1,
      };

      if (comments[comment.postId]) {
        comments[comment.postId].push(comment);
      }
    }

    // Ответить: [Ответ|ОтветитьНикнейм|id|Ответить]
    const replyRegex = /\[Ответить\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
    let replyMatch;
    while ((replyMatch = replyRegex.exec(vk_feedContent)) !== null) {
      const reply = {
        id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        postId: replyMatch[2],
        author: replyMatch[1],
        content: replyMatch[3],
        timestamp: new Date().toLocaleString(),
        likes: Math.floor(Math.random() * 20) + 1,
        isReply: true,
      };

      if (comments[reply.postId]) {
        comments[reply.postId].push(reply);
      }
    }

    // : [|||] -
    if (changes.hotSearches) {
      const newHotSearches = [];
      const hotSearchRegex = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
      let hotSearchMatch;
      while ((hotSearchMatch = hotSearchRegex.exec(vk_feedContent)) !== null) {
        const hotSearch = {
          rank: parseInt(hotSearchMatch[1]),
          title: hotSearchMatch[2],
          heat: hotSearchMatch[3],
          icon: this.getHotSearchIcon(parseInt(hotSearchMatch[1])),
        };
        newHotSearches.push(hotSearch);
      }

      if (newHotSearches.length > 0) {
        hotSearches = newHotSearches;
        this.persistentData.hotSearches = hotSearches;
        console.log('[VkFeed UI] ✅ ...，...:', hotSearches.length, '...');
      }
    }

    // : [||] [|||] -
    if (changes.rankings) {
      const newRankings = [];
      const rankingTitleRegex = /\[...\|([^|]+)\|([^\]]+)\]/g;
      const rankingItemRegex = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;

      let rankingTitleMatch;
      while ((rankingTitleMatch = rankingTitleRegex.exec(vk_feedContent)) !== null) {
        newRankings.push({
          title: rankingTitleMatch[1],
          type: rankingTitleMatch[2],
          items: [],
        });
      }

      let rankingItemMatch;
      while ((rankingItemMatch = rankingItemRegex.exec(vk_feedContent)) !== null) {
        const item = {
          rank: parseInt(rankingItemMatch[1]),
          name: rankingItemMatch[2],
          heat: rankingItemMatch[3],
        };

        if (newRankings.length > 0) {
          newRankings[newRankings.length - 1].items.push(item);
        }
      }

      if (newRankings.length > 0) {
        rankings = newRankings;
        this.persistentData.rankings = rankings;
        console.log('[VkFeed UI] ✅ ...，...:', rankings.length, '...');
      }
    }

    // Подписчики: [Подписчики|Подписчики|Подписчики] -
    if (changes.userStats) {
      const fansRegex = /\[Подписчики...\|([^|]+)\|([^\]]+)\]/g;
      let fansMatch;
      while ((fansMatch = fansRegex.exec(vk_feedContent)) !== null) {
        const newUserStats = {
          mainAccountFans: fansMatch[1], // ...Подписчики...
          aliasAccountFans: fansMatch[2], // ...Подписчики...
          following: '100', // ...Подписаться...
          posts: posts.filter(p => p.author === this.getCurrentUsername()).length,
        };

        userStats = newUserStats;
        this.persistentData.userStats = userStats;
        console.log(
          '[VkFeed UI] ✅ Подписчики... - ...:',
          userStats.mainAccountFans,
          '...:',
          userStats.aliasAccountFans,
        );
        break; // ...Подписчики...
      }
    }

    console.log('[VkFeed UI] 📊 ...（...）:', {
      posts: posts.length,
      comments: Object.keys(comments).length,
      hotSearches: hotSearches.length,
      rankings: rankings.length,
      rankingPosts: rankingPosts.length,
      userStats: userStats ? `...Подписчики${userStats.mainAccountFans} ...Подписчики${userStats.aliasAccountFans}` : '...',
      changes: changes,
    });

    return { posts, comments, hotSearches, rankings, rankingPosts, userStats };
  }

  /**
   * ...
   */
  getHotSearchIcon(rank) {
    if (rank <= 3) {
      return '<i class="fas fa-fire" style="color: #ff8500;"></i>';
    } else if (rank <= 10) {
      return '<i class="fas fa-arrow-up" style="color: #ff9500;"></i>';
    } else {
      return '<i class="fas fa-circle" style="color: #999;"></i>';
    }
  }

  /**
   * ...Пользователь...
   */
  getCurrentUsername() {
    if (window.vk_feedManager && window.vk_feedManager.getCurrentUsername) {
      const username = window.vk_feedManager.getCurrentUsername();
      // Если{{user}}，SillyTavernПользователь
      if (username === '{{user}}') {
        return this.getRealUsername();
      }
      return username;
    }
    return this.getRealUsername();
  }

  /**
   * ...Пользователь...（...SillyTavern）
   */
  getRealUsername() {
    try {
      console.log('[VkFeed UI] ...Пользователь......');

      // 1: SillyTavern
      if (typeof window.name1 !== 'undefined' && window.name1 && window.name1.trim() && window.name1 !== '{{user}}') {
        console.log('[VkFeed UI] ...name1...Пользователь...:', window.name1);
        return window.name1.trim();
      }

      // 2: power_user
      if (
        window.power_user &&
        window.power_user.name &&
        window.power_user.name.trim() &&
        window.power_user.name !== '{{user}}'
      ) {
        console.log('[VkFeed UI] ...power_user...Пользователь...:', window.power_user.name);
        return window.power_user.name.trim();
      }

      // 3: getContext
      if (window.getContext) {
        const context = window.getContext();
        if (context && context.name1 && context.name1.trim() && context.name1 !== '{{user}}') {
          console.log('[VkFeed UI] ...context...Пользователь...:', context.name1);
          return context.name1.trim();
        }
      }

      // 4: localStorage
      const storedName = localStorage.getItem('name1');
      if (storedName && storedName.trim() && storedName !== '{{user}}') {
        console.log('[VkFeed UI] ...localStorage...Пользователь...:', storedName);
        return storedName.trim();
      }

      // 5: SillyTavern
      if (
        typeof window.user_name !== 'undefined' &&
        window.user_name &&
        window.user_name.trim() &&
        window.user_name !== '{{user}}'
      ) {
        console.log('[VkFeed UI] ...user_name...Пользователь...:', window.user_name);
        return window.user_name.trim();
      }

      // 6: НовоеПользовательСообщения
      if (window.mobileContextEditor) {
        const chatData = window.mobileContextEditor.getCurrentChatData();
        if (chatData && chatData.messages) {
          // ПользовательСообщения
          for (let i = chatData.messages.length - 1; i >= 0; i--) {
            const msg = chatData.messages[i];
            if (msg.is_user && msg.name && msg.name.trim() && msg.name !== '{{user}}' && msg.name !== 'User') {
              console.log('[VkFeed UI] ...Пользователь...:', msg.name);
              return msg.name.trim();
            }
          }
        }
      }

      // 7: DOMПользователь/* Поле ввода */
      const userNameInput = document.querySelector('#user_name, input[name="user_name"], .user-name-input');
      if (userNameInput && userNameInput.value && userNameInput.value.trim() && userNameInput.value !== '{{user}}') {
        console.log('[VkFeed UI] ...Пользователь.../* Поле ввода */...Пользователь...:', userNameInput.value);
        return userNameInput.value.trim();
      }

      console.log('[VkFeed UI] ...Пользователь...，......');
      console.log('[VkFeed UI] window.name1:', window.name1);
      console.log('[VkFeed UI] window.power_user:', window.power_user);
      console.log('[VkFeed UI] window.user_name:', window.user_name);
    } catch (error) {
      console.warn('[VkFeed UI] errorПользовательerror:', error);
    }

    console.log('[VkFeed UI] ...Пользователь...: User');
    return 'User';
  }

  /**
   * ...
   */
  getCurrentAccountType() {
    if (window.vk_feedManager && window.vk_feedManager.currentAccount) {
      return window.vk_feedManager.currentAccount.isMainAccount ? '...' : '...';
    }
    return '...';
  }

  /**
   * ...
   */
  renderHotPage(data) {
    const { posts, comments, hotSearches } = data;
    // （IDh）
    const hotPosts = posts.filter(post => post.type === 'hot');

    let html = `
      <div class="vk_feed-page hot-page">
        <!-- .../* Список */ -->
        <div class="hot-search-section">
          <div class="section-header">
            <i class="fas fa-fire"></i>
            <span>ВКонтакте...</span>
          </div>
          <div class="hot-search-list">
    `;

    hotSearches.forEach(search => {
      html += `
        <div class="hot-search-item" data-rank="${search.rank}">
          <div class="search-rank">${search.rank}</div>
          <div class="search-content">
            <div class="search-title">${search.title}</div>
            <div class="search-heat">${search.heat}</div>
          </div>
          <div class="search-icon">${search.icon}</div>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <!-- ... -->
        <div class="posts-section">
          <div class="section-header">
            <i class="fas fa-comments"></i>
            <span>...</span>
          </div>
          <div class="posts-list">
    `;

    // Время（）
    hotPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    hotPosts.forEach(post => {
      const postComments = comments[post.id] || [];
      html += this.renderPost(post, postComments, true); // ...Ответить
    });

    html += `
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * ...
   */
  renderRankingPage(data) {
    const { posts, comments, rankings, rankingPosts } = data;
    // （5）
    const actualRankingPosts = rankingPosts || posts.filter(post => post.type === 'ranking');
    console.log('[VkFeed UI] 📊 ...:', actualRankingPosts.length, '...');

    let html = `
      <div class="vk_feed-page ranking-page">
        <!-- .../* Список */ -->
        <div class="ranking-section">
    `;

    rankings.forEach(ranking => {
      html += `
        <div class="ranking-container">
          <div class="section-header">
            <i class="fas fa-trophy"></i>
            <span>${ranking.title}</span>
            <span class="ranking-type">${ranking.type}</span>
          </div>
          <div class="ranking-list">
      `;

      ranking.items.forEach(item => {
        const rankClass = item.rank <= 3 ? 'top-rank' : '';
        html += `
          <div class="ranking-item ${rankClass}" data-rank="${item.rank}">
            <div class="item-rank">${item.rank}</div>
            <div class="item-content">
              <div class="item-name">${item.name}</div>
              <div class="item-heat">${item.heat}</div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
        </div>

        <!-- ... -->
        <div class="posts-section">
          <div class="section-header">
            <i class="fas fa-comments"></i>
            <span>...</span>
          </div>
          <div class="posts-list">
    `;

    // Время（）
    actualRankingPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // （ЛайкОтветить）
    actualRankingPosts.forEach(post => {
      const postComments = comments[post.id] || [];
      html += this.renderPost(post, postComments, false); // ...Ответить
    });

    html += `
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * ...Пользователь...
   */
  renderUserPage(data) {
    const { posts, comments, userStats } = data;
    // ВКонтактеПользователь，
    let currentUsername = this.getCurrentUsername();
    console.log('[VkFeed UI] Пользователь...Пользователь...:', currentUsername);

    // ЕслиПользователь 'User' ，
    if (!currentUsername || currentUsername === 'User' || currentUsername === '{{user}}') {
      console.log('[VkFeed UI] ...Пользователь...，......');

      // SillyTavernПользователь
      const realUsername = this.getRealUsername();
      if (realUsername && realUsername !== 'User' && realUsername !== '{{user}}') {
        currentUsername = realUsername;
        console.log('[VkFeed UI] ...SillyTavern...Пользователь...:', currentUsername);
      }

      // Если，DOMНастройкиПользователь
      if (!currentUsername || currentUsername === 'User' || currentUsername === '{{user}}') {
        const profileNameElement = document.querySelector('.profile-name');
        if (
          profileNameElement &&
          profileNameElement.textContent &&
          profileNameElement.textContent !== 'User' &&
          profileNameElement.textContent !== '{{user}}'
        ) {
          currentUsername = profileNameElement.textContent;
          console.log('[VkFeed UI] ...DOM...Пользователь...:', currentUsername);
        }
      }
    }

    const accountType = this.getCurrentAccountType();
    // Пользователь（IDu）
    const userPosts = posts.filter(post => post.type === 'user');

    // Подписчики
    const isMainAccount = this.getCurrentAccountType() === '...';
    const currentFans = userStats ? (isMainAccount ? userStats.mainAccountFans : userStats.aliasAccountFans) : '0';

    // ЕслиПользователь，
    const stats = {
      fans: currentFans || '0',
      following: '100',
      posts: posts.filter(p => p.author === currentUsername).length,
    };

    console.log('[VkFeed UI] Пользователь...:', {
      isMainAccount,
      currentFans,
      userStats: userStats
        ? {
            mainAccountFans: userStats.mainAccountFans,
            aliasAccountFans: userStats.aliasAccountFans,
          }
        : null,
    });

    let html = `
      <div class="vk_feed-page user-page">
        <!-- Пользователь... -->
        <div class="user-info-section">
          <div class="user-header">
            <div class="user-avatar-large">
              ${this.generateAvatarHTML(currentUsername, 'large')}
            </div>
            <div class="user-details">
              <div class="user-name-container">
                <div class="profile-name">${currentUsername}</div>
                <button class="edit-name-btn" title="РедактироватьПользователь...">
                  <i class="fas fa-edit"></i>
                </button>
              </div>
              <div class="account-type">${accountType}</div>
            </div>
          </div>

          <!-- ... -->
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-number">${stats.posts}</div>
              <div class="stat-label">ВКонтакте</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${stats.following}</div>
              <div class="stat-label">Подписаться</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${stats.fans}</div>
              <div class="stat-label">Подписчики</div>
            </div>
          </div>
        </div>

        <!-- Пользователь... -->
        <div class="posts-section">
          <div class="section-header">
            <i class="fas fa-user"></i>
            <span>...ВКонтакте</span>
          </div>
          <div class="posts-list">
    `;

    // Пользователь（Время，Новое）
    // Пользователь/* Список */
    const possibleUsernames = [currentUsername, this.getRealUsername(), '{{user}}', 'User'].filter(
      name => name && name.trim(),
    ); // ...

    // ПользовательПользователь
    console.log('[VkFeed UI] Пользователь...:', {
      possibleUsernames,
      userPostsAuthors: userPosts.map(p => p.author),
      userPostsCount: userPosts.length,
    });

    const currentUserPosts = userPosts.filter(post => {
      // Пользователь
      const isMatch = possibleUsernames.some(
        username => post.author === username || post.author.toLowerCase() === username.toLowerCase(),
      );
      if (isMatch) {
        console.log('[VkFeed UI] ...Пользователь...:', post.author, post.content);
      }
      return isMatch;
    });

    // Если，Пользователь（）
    const postsToShow = currentUserPosts.length > 0 ? currentUserPosts : userPosts;

    // Время（）
    postsToShow.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    postsToShow.forEach(post => {
      const postComments = comments[post.id] || [];
      html += this.renderPost(post, postComments, true); // Пользователь...Ответить
    });

    // Если，
    if (userPosts.length === 0) {
      html += `
        <div class="empty-posts">
          <i class="fas fa-edit"></i>
          <p>...Опубликовать...ВКонтакте</p>
          <p>..."..."...Поделиться...！</p>
        </div>
      `;
    }

    html += `
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * ...
   */
  renderPost(post, postComments, canReply = true) {
    const likeData = this.likesData[post.id] || { likes: post.likes, isLiked: false };
    const likeClass = likeData.isLiked ? 'liked' : '';

    let html = `
      <div class="vk_feed-post" data-post-id="${post.id}">
        <div class="post-header">
          <div class="post-author">
            ${this.generateAvatarHTML(post.author)}
            <div class="author-info">
              <div class="author-name">${post.author}</div>
              <div class="post-time">${post.timestamp}</div>
            </div>
          </div>
          <button class="delete-btn vk_feed-delete-btn" data-post-id="${post.id}" title="УдалитьВКонтакте">Удалить</button>
        </div>

        <div class="post-content">
          ${this.formatPostContent(post.content)}
        </div>

        <div class="post-actions">
          <button class="action-btn like-btn ${likeClass}" data-post-id="${post.id}">
            <i class="fas fa-heart"></i>
            <span>${likeData.likes}</span>
          </button>
          ${
            canReply
              ? `
          <button class="action-btn comment-btn" data-post-id="${post.id}">
            <i class="fas fa-comment"></i>
            <span>${postComments.length}</span>
          </button>
          `
              : `
          <span class="action-info">
            <i class="fas fa-comment"></i>
            <span>${postComments.length}</span>
          </span>
          `
          }
          <button class="action-btn share-btn" data-post-id="${post.id}">
            <i class="fas fa-share"></i>
            <span>${post.shares || 0}</span>
          </button>
        </div>
    `;

    // Комментарий
    if (postComments.length > 0) {
      html += `
        <div class="post-comments">
          <div class="comments-header">
            <span>Комментарий ${postComments.length}</span>
          </div>
          <div class="comments-list">
      `;

      postComments.forEach(comment => {
        const commentLikeData = this.commentLikesData[comment.id] || { likes: comment.likes, isLiked: false };
        const commentLikeClass = commentLikeData.isLiked ? 'liked' : '';

        html += `
          <div class="comment-item" data-comment-id="${comment.id}">
            <div class="comment-author">
              ${this.generateAvatarHTML(comment.author, 'small')}
              <div class="comment-info">
                <div class="comment-author-name">${comment.author}</div>
                <div class="comment-time">${comment.timestamp}</div>
              </div>
            </div>
            <div class="comment-content">
              ${this.formatCommentContent(comment.content)}
            </div>
            <div class="comment-actions">
              <button class="action-btn comment-like-btn ${commentLikeClass}" data-comment-id="${comment.id}">
                <i class="fas fa-heart"></i>
                <span>${commentLikeData.likes}</span>
              </button>
              ${
                canReply
                  ? `
              <button class="action-btn reply-btn" data-comment-id="${comment.id}" data-post-id="${post.id}">
                <i class="fas fa-reply"></i>
                Ответить
              </button>
              `
                  : ''
              }
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    // ЕслиОтветить，Ответить/* Поле ввода */
    if (canReply) {
      html += `
        <div class="reply-input-container" style="display: none;">
          <div class="reply-input">
            <textarea placeholder="...Комментарий..." maxlength="140"></textarea>
            <div class="reply-actions">
              <button class="cancel-reply-btn">Отменить</button>
              <button class="send-reply-btn">...</button>
            </div>
          </div>
        </div>
      `;
    }

    html += `
      </div>
    `;

    return html;
  }

  /**
   * ...
   */
  formatPostContent(content) {
    content = content.replace(/#([^#\s]+)#/g, '<span class="topic-tag">#$1#</span>');

    // @Пользователь
    content = content.replace(/@([^\s@]+)/g, '<span class="mention-user">@$1</span>');

    content = content.replace(/\n/g, '<br>');

    return content;
  }

  /**
   * ...Комментарий...
   */
  formatCommentContent(content) {
    // Ответить：Ответить：
    content = content.replace(/Ответить([^：]+)：/g, '<span class="reply-to">Ответить$1：</span>');

    content = content.replace(/#([^#\s]+)#/g, '<span class="topic-tag">#$1#</span>');

    // @Пользователь
    content = content.replace(/@([^\s@]+)/g, '<span class="mention-user">@$1</span>');

    content = content.replace(/\n/g, '<br>');

    return content;
  }

  /**
   * ОбновитьВКонтакте/* Список */
   */
  async refreshVkFeedList() {
    try {
      console.log('[VkFeed UI] ...ОбновитьВКонтакте/* Список */...');

      const chatData = await this.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        console.log('[VkFeed UI] ...，...Статус');
        this.showEmptyState();
        return;
      }

      // ВКонтакте
      const firstMessage = chatData.messages[0];
      const vk_feedData = this.parseVkFeedContent(firstMessage.mes || '');

      let content = '';
      switch (this.currentPage) {
        case 'hot':
          content = this.renderHotPage(vk_feedData);
          break;
        case 'ranking':
          content = this.renderRankingPage(vk_feedData);
          break;
        case 'user':
          content = this.renderUserPage(vk_feedData);
          break;
        default:
          content = this.renderHotPage(vk_feedData);
      }

      const contentContainer = document.getElementById('vk_feed-content');
      if (contentContainer) {
        contentContainer.innerHTML = content;
        this.bindPostEvents();

        // ，ПользовательНовое
        this.scrollToTop();

        console.log('[VkFeed UI] ✅ ВКонтакте/* Список */Обновить...');
      }
    } catch (error) {
      console.error('[VkFeed UI] ОбновитьВКонтакте/* Список */error:', error);
      this.showErrorState(error.message);
    }
  }

  /**
   * ...
   */
  scrollToTop() {
    try {
      const contentContainer = document.getElementById('vk_feed-content');
      if (contentContainer) {
        contentContainer.scrollTo({
          top: 0,
          behavior: 'smooth', // ...
        });
        console.log('[VkFeed UI] 📜 ...');
      }
    } catch (error) {
      console.warn('[VkFeed UI] error:', error);
    }
  }

  /**
   * ...
   */
  async getCurrentChatData() {
    if (window.mobileContextEditor) {
      return window.mobileContextEditor.getCurrentChatData();
    } else if (window.MobileContext) {
      return await window.MobileContext.loadChatToEditor();
    } else {
      throw new Error('errorРедактироватьerror');
    }
  }

  /**
   * ...Статус
   */
  showEmptyState() {
    const contentContainer = document.getElementById('vk_feed-content');
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-comments"></i>
          <h3>...ВКонтакте...</h3>
          <p>..."..."...ВКонтакте...</p>
        </div>
      `;
    }
  }

  /**
   * .../* Состояние ошибки */
   */
  showErrorState(message) {
    const contentContainer = document.getElementById('vk_feed-content');
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>...</h3>
          <p>${message}</p>
          <button onclick="window.vk_feedUI.refreshVkFeedList()" class="retry-btn">...</button>
        </div>
      `;
    }
  }

  /**
   * ...
   */
  bindPostEvents() {
    // Удалить
    document.querySelectorAll('.vk_feed-delete-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const postId = btn.dataset.postId;
        if (postId) {
          this.deletePost(postId);
        }
      });
    });

    // Лайк
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const postId = btn.dataset.postId;
        this.togglePostLike(postId);
      });
    });

    // КомментарийЛайк
    document.querySelectorAll('.comment-like-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const commentId = btn.dataset.commentId;
        this.toggleCommentLike(commentId);
      });
    });

    // Комментарий
    document.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const postId = btn.dataset.postId;
        this.showReplyInput(postId);
      });
    });

    // Ответить
    document.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const commentId = btn.dataset.commentId;
        const postId = btn.dataset.postId;
        this.showReplyInput(postId, commentId);
      });
    });

    // Ответить
    document.querySelectorAll('.send-reply-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.sendReply(btn);
      });
    });

    // ОтменитьОтветить
    document.querySelectorAll('.cancel-reply-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.hideReplyInput(btn);
      });
    });

    // РедактироватьПользователь
    document.querySelectorAll('.edit-name-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.showEditNameDialog();
      });
    });
  }

  /**
   * ...Лайк
   */
  togglePostLike(postId) {
    // ЕслиЛайк，UIЛайк
    if (!this.likesData[postId]) {
      const likeBtn = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
      const originalLikes = likeBtn ? parseInt(likeBtn.querySelector('span').textContent) || 0 : 0;
      this.likesData[postId] = { likes: originalLikes, isLiked: false };
    }

    const likeData = this.likesData[postId];

    if (likeData.isLiked) {
      likeData.likes = Math.max(0, likeData.likes - 1);
      likeData.isLiked = false;
    } else {
      likeData.likes += 1;
      likeData.isLiked = true;
    }

    // UI
    const likeBtn = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
    if (likeBtn) {
      likeBtn.classList.toggle('liked', likeData.isLiked);
      likeBtn.querySelector('span').textContent = likeData.likes;
    }

    console.log(`[VkFeed UI] ... ${postId} ЛайкСтатус: ${likeData.isLiked}, Лайк...: ${likeData.likes}`);
  }

  /**
   * ...КомментарийЛайк
   */
  toggleCommentLike(commentId) {
    // ЕслиЛайк，UIЛайк
    if (!this.commentLikesData[commentId]) {
      const likeBtn = document.querySelector(`.comment-like-btn[data-comment-id="${commentId}"]`);
      const originalLikes = likeBtn ? parseInt(likeBtn.querySelector('span').textContent) || 0 : 0;
      this.commentLikesData[commentId] = { likes: originalLikes, isLiked: false };
    }

    const likeData = this.commentLikesData[commentId];

    if (likeData.isLiked) {
      likeData.likes = Math.max(0, likeData.likes - 1);
      likeData.isLiked = false;
    } else {
      likeData.likes += 1;
      likeData.isLiked = true;
    }

    // UI
    const likeBtn = document.querySelector(`.comment-like-btn[data-comment-id="${commentId}"]`);
    if (likeBtn) {
      likeBtn.classList.toggle('liked', likeData.isLiked);
      likeBtn.querySelector('span').textContent = likeData.likes;
    }

    console.log(`[VkFeed UI] Комментарий ${commentId} ЛайкСтатус: ${likeData.isLiked}, Лайк...: ${likeData.likes}`);
  }

  /**
   * ...Ответить/* Поле ввода */
   */
  showReplyInput(postId, commentId = null) {
    // Ответить/* Поле ввода */
    document.querySelectorAll('.reply-input-container').forEach(container => {
      container.style.display = 'none';
    });

    // Ответить/* Поле ввода */
    const postElement = document.querySelector(`.vk_feed-post[data-post-id="${postId}"]`);
    if (postElement) {
      const replyContainer = postElement.querySelector('.reply-input-container');
      if (replyContainer) {
        replyContainer.style.display = 'block';
        const textarea = replyContainer.querySelector('textarea');

        // ЕслиОтветитьКомментарий，Настройки
        if (commentId) {
          const commentElement = document.querySelector(`.comment-item[data-comment-id="${commentId}"]`);
          if (commentElement) {
            const authorName = commentElement.querySelector('.comment-author-name').textContent;
            textarea.placeholder = `Ответить ${authorName}...`;
            textarea.dataset.replyTo = authorName;
            textarea.dataset.commentId = commentId;
          }
        } else {
          textarea.placeholder = '...Комментарий...';
          delete textarea.dataset.replyTo;
          delete textarea.dataset.commentId;
        }

        textarea.focus();
      }
    }
  }

  /**
   * ...Ответить/* Поле ввода */
   */
  hideReplyInput(btn) {
    const replyContainer = btn.closest('.reply-input-container');
    if (replyContainer) {
      replyContainer.style.display = 'none';
      const textarea = replyContainer.querySelector('textarea');
      textarea.value = '';
      textarea.placeholder = '...Комментарий...';
      delete textarea.dataset.replyTo;
      delete textarea.dataset.commentId;
    }
  }

  /**
   * ...Ответить
   */
  async sendReply(btn) {
    const replyContainer = btn.closest('.reply-input-container');
    const postElement = btn.closest('.vk_feed-post');

    if (!replyContainer || !postElement) return;

    const textarea = replyContainer.querySelector('textarea');
    const content = textarea.value.trim();

    if (!content) {
      this.showNotification('...Ответить...', 'error');
      return;
    }

    const postId = postElement.dataset.postId;
    const replyTo = textarea.dataset.replyTo;
    const commentId = textarea.dataset.commentId;

    // /* Поле ввода */，
    const originalContent = content; // Сохранить...
    textarea.value = '';
    this.hideReplyInput(btn);

    // Уведомление
    this.showNotification('...Ответить...', 'loading');

    try {
      // Ответить
      let replyFormat;
      if (replyTo && commentId) {
        // ОтветитьКомментарий
        replyFormat = `[Ответ|${this.getCurrentUsername()}|${postId}|Ответить${replyTo}：${originalContent}]`;
      } else {
        // Ответить
        replyFormat = `[Комментарий|${this.getCurrentUsername()}|${postId}|${originalContent}]`;
      }

      console.log('[VkFeed UI] ...Ответить:', replyFormat);

      // ВКонтактеОтветить
      if (window.vk_feedManager && window.vk_feedManager.sendReplyToAPI) {
        await window.vk_feedManager.sendReplyToAPI(replyFormat);

        // Уведомление
        this.showNotification('Ответить...', 'success');

        // ОбновитьВКонтакте/* Список */
        setTimeout(() => {
          this.refreshVkFeedList();
        }, 1000);
      } else {
        console.error('[VkFeed UI] ВКонтактеerror');
        this.showNotification('Ответить...：ВКонтакте...', 'error');
        this.restoreReplyInput(postId, originalContent, replyTo, commentId);
      }
    } catch (error) {
      console.error('[VkFeed UI] errorОтветитьerror:', error);
      this.showNotification('Ответить...：' + error.message, 'error');
      this.restoreReplyInput(postId, originalContent, replyTo, commentId);
    }
  }

  /**
   * ...Ответить/* Поле ввода */...（...）
   */
  restoreReplyInput(postId, content, replyTo = null, commentId = null) {
    const postElement = document.querySelector(`.vk_feed-post[data-post-id="${postId}"]`);
    if (postElement) {
      const replyContainer = postElement.querySelector('.reply-input-container');
      if (replyContainer) {
        replyContainer.style.display = 'block';
        const textarea = replyContainer.querySelector('textarea');
        textarea.value = content;

        if (replyTo && commentId) {
          textarea.placeholder = `Ответить ${replyTo}...`;
          textarea.dataset.replyTo = replyTo;
          textarea.dataset.commentId = commentId;
        } else {
          textarea.placeholder = '...Комментарий...';
          delete textarea.dataset.replyTo;
          delete textarea.dataset.commentId;
        }

        textarea.focus();
      }
    }
  }

  /**
   * ...Уведомление
   */
  showNotification(message, type = 'success') {
    // Уведомление
    const existingNotification = document.querySelector('.reply-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Уведомление
    const notification = document.createElement('div');
    notification.className = `reply-notification ${type}`;

    // Настройки
    let icon = '';
    switch (type) {
      case 'success':
        icon = '<i class="fas fa-check-circle"></i>';
        break;
      case 'error':
        icon = '<i class="fas fa-exclamation-circle"></i>';
        break;
      case 'loading':
        icon = '<i class="fas fa-spinner fa-spin"></i>';
        break;
      default:
        icon = '<i class="fas fa-info-circle"></i>';
    }

    notification.innerHTML = `${icon}${message}`;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // （loading）
    if (type !== 'loading') {
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }, 3000);
    }
  }

  /**
   * ...Пользователь...（...）
   */
  updateUsernameDisplay() {
    // ПользовательПользователь
    const profileNameElement = document.querySelector('.profile-name');
    if (profileNameElement) {
      const newUsername = this.getCurrentUsername();
      profileNameElement.textContent = newUsername;
      console.log('[VkFeed UI] Пользователь...:', newUsername);

      // Аватар
      const userAvatarLarge = document.querySelector('.user-avatar-large');
      if (userAvatarLarge) {
        userAvatarLarge.innerHTML = this.generateAvatarHTML(newUsername, 'large');
      }

      const accountTypeElement = document.querySelector('.account-type');
      if (accountTypeElement && window.vk_feedManager) {
        const accountType = window.vk_feedManager.currentAccount.isMainAccount ? '...' : '...';
        accountTypeElement.textContent = accountType;
      }

      // Подписчики（Пользователь）
      this.updateFansDisplay();
    }
  }

  /**
   * ...Подписчики...（...）
   */
  updateFansDisplay() {
    const fansNumberElement = document.querySelector('.stat-item .stat-number');
    if (fansNumberElement && this.persistentData.userStats) {
      const isMainAccount = this.getCurrentAccountType() === '...';
      const currentFans = isMainAccount
        ? this.persistentData.userStats.mainAccountFans
        : this.persistentData.userStats.aliasAccountFans;

      if (currentFans) {
        fansNumberElement.textContent = currentFans;
        console.log('[VkFeed UI] Подписчики...:', currentFans, '(', isMainAccount ? '...' : '...', ')');
      }
    }
  }

  /**
   * ...РедактироватьПользователь.../* Диалог */
   */
  showEditNameDialog() {
    const currentName = this.getCurrentUsername();
    const accountType = this.getCurrentAccountType();

    const newName = prompt(`Редактировать${accountType}Пользователь...:`, currentName);
    if (newName && newName.trim() && newName.trim() !== currentName) {
      this.updateUsername(newName.trim());
    }
  }

  /**
   * ...Пользователь...
   */
  updateUsername(newName) {
    try {
      if (window.vk_feedManager && window.vk_feedManager.setUsername) {
        window.vk_feedManager.setUsername(newName);

        // DOMПользователь
        const profileNameElement = document.querySelector('.profile-name');
        if (profileNameElement) {
          profileNameElement.textContent = newName;
        }

        // Аватар
        const userAvatarElements = document.querySelectorAll('.user-avatar-large .author-avatar');
        userAvatarElements.forEach(avatar => {
          avatar.textContent = newName[0] || '?';
          avatar.style.background = this.getAvatarColor(newName);
        });

        // ОбновитьПользователь
        if (this.currentPage === 'user') {
          this.refreshVkFeedList();
        }

        console.log('[VkFeed UI] Пользователь...:', newName);
      } else {
        throw new Error('ВКонтактеerror');
      }
    } catch (error) {
      console.error('[VkFeed UI] errorПользовательerror:', error);
      alert(`...Пользователь...: ${error.message}`);
    }
  }

  /**
   * Настройки...
   */
  setCurrentPage(page) {
    if (['hot', 'ranking', 'user'].includes(page)) {
      this.currentPage = page;

      // ВКонтакте
      if (window.vk_feedManager && window.vk_feedManager.setCurrentPage) {
        window.vk_feedManager.setCurrentPage(page);
      }

      console.log('[VkFeed UI] ...Настройки:', page);
    }
  }

  /**
   * УдалитьВКонтакте...Комментарий...Ответить
   */
  async deletePost(postId) {
    console.log('[VkFeed UI] ...УдалитьВКонтакте:', postId);

    try {
      // Подтвердить/* Диалог */
      if (!confirm(`ОК...УдалитьВКонтакте ID: ${postId} ...Комментарий...？...。`)) {
        return;
      }

      const chatData = await this.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        throw new Error('error');
      }

      // Сообщения（ВКонтакте）
      const firstMessage = chatData.messages[0];
      if (!firstMessage || !firstMessage.mes) {
        throw new Error('errorВКонтактеerror');
      }

      let content = firstMessage.mes;

      // ВКонтакте
      const vk_feedRegex = /<!-- WEIBO_CONTENT_START -->([\s\S]*?)<!-- WEIBO_CONTENT_END -->/;
      const match = content.match(vk_feedRegex);

      if (!match) {
        throw new Error('errorВКонтактеerror');
      }

      let vk_feedContent = match[1];

      // УдалитьВКонтактеID
      // Удалить: [|Никнейм|id|]
      const postRegex = new RegExp(`\\[...\\|[^|]+\\|${postId}\\|[^\\]]+\\]`, 'g');
      vk_feedContent = vk_feedContent.replace(postRegex, '');

      // УдалитьКомментарий: [Комментарий|КомментарийНикнейм|id|Комментарий]
      const commentRegex = new RegExp(`\\[Комментарий\\|[^|]+\\|${postId}\\|[^\\]]+\\]`, 'g');
      vk_feedContent = vk_feedContent.replace(commentRegex, '');

      // УдалитьОтветить: [Ответ|ОтветитьНикнейм|id|Ответить]
      const replyRegex = new RegExp(`\\[Ответить\\|[^|]+\\|${postId}\\|[^\\]]+\\]`, 'g');
      vk_feedContent = vk_feedContent.replace(replyRegex, '');

      vk_feedContent = vk_feedContent.replace(/\n{3,}/g, '\n\n');

      // Сообщения
      const newContent = content.replace(
        /<!-- WEIBO_CONTENT_START -->[\s\S]*?<!-- WEIBO_CONTENT_END -->/,
        `<!-- WEIBO_CONTENT_START -->${vk_feedContent}<!-- WEIBO_CONTENT_END -->`
      );

      // Сообщения
      await window.mobileContextEditor.modifyMessage(0, newContent);

      console.log('[VkFeed UI] ✅ ВКонтактеУдалить...:', postId);

      this.showNotification('🗑️ ВКонтакте...Удалить', 'success');

      // ОбновитьВКонтакте
      setTimeout(() => {
        this.refreshVkFeedList();
      }, 500);

    } catch (error) {
      console.error('[VkFeed UI] УдалитьВКонтактеerror:', error);
      this.showNotification('❌ Удалить...: ' + error.message, 'error');
    }
  }
}

if (typeof window !== 'undefined') {
  window.vk_feedUI = new VkFeedUI();
  console.log('[VkFeed UI] ✅ ВКонтактеUI...');
}

/**
 * ...ВКонтакте/* Приложение */...（...）
 */
function getVkFeedAppContent() {
  try {
    console.log('[VkFeed UI] ...ВКонтакте/* Приложение */......');

    return `
      <div class="vk_feed-app">
        <!-- ... -->
        <div class="vk_feed-tabs">
          <div class="tab-item active" data-page="hot">
            <i class="fas fa-fire"></i>
            <span>...</span>
          </div>
          <div class="tab-item" data-page="ranking">
            <i class="fas fa-trophy"></i>
            <span>...</span>
          </div>
          <div class="tab-item" data-page="user">
            <i class="fas fa-user"></i>
            <span>Пользователь</span>
          </div>
        </div>

        <!-- ВКонтакте... -->
        <div class="vk_feed-content" id="vk_feed-content">
          <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>...ВКонтакте......</p>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('[VkFeed UI] errorВКонтакте/* Приложение */error:', error);
    return `
      <div class="error-placeholder">
        <div class="error-icon">❌</div>
        <div class="error-text">ВКонтакте/* Приложение */...</div>
        <div class="error-detail">${error.message}</div>
        <button onclick="window.mobilePhone.handleVkFeedApp()" class="retry-button">...</button>
      </div>
    `;
  }
}

/**
 * ...ВКонтакте...（...）
 */
function bindVkFeedEvents() {
  try {
    console.log('[VkFeed UI] ...ВКонтакте......');

    document.querySelectorAll('.vk_feed-tabs .tab-item').forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        const page = tab.dataset.page;

        // Статус
        document.querySelectorAll('.vk_feed-tabs .tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (window.vk_feedUI) {
          window.vk_feedUI.setCurrentPage(page);
          window.vk_feedUI.refreshVkFeedList();
        }

        console.log('[VkFeed UI] ...:', page);
      });
    });

    // ВКонтакте
    if (window.vk_feedUI) {
      // Настройки
      window.vk_feedUI.setCurrentPage('hot');

      // ，DOM
      setTimeout(() => {
        window.vk_feedUI.refreshVkFeedList();
      }, 100);
    }

    console.log('[VkFeed UI] ✅ ВКонтакте...');
  } catch (error) {
    console.error('[VkFeed UI] errorВКонтактеerror:', error);
  }
}

if (typeof window !== 'undefined') {
  window.getVkFeedAppContent = getVkFeedAppContent;
  window.bindVkFeedEvents = bindVkFeedEvents;

  // 🔥 Комментарий
  window.fixVkFeedCommentLayout = function () {
    console.log('🔧 [...] ...ВКонтактеКомментарий......');
    if (window.VkFeedUI && window.VkFeedUI.manualFixCommentLayout) {
      return window.VkFeedUI.manualFixCommentLayout();
    } else {
      console.error('❌ VkFeedUI error，error');
      return { total: 0, fixed: 0 };
    }
  };

  // 🔥 Комментарий
  window.checkVkFeedCommentLayout = function () {
    console.log('🔍 [...] ...ВКонтактеКомментарий...Статус...');
    const commentItems = document.querySelectorAll('.vk_feed-app .comment-item');
    let issues = [];

    commentItems.forEach((item, index) => {
      const author = item.querySelector('.comment-author');
      const info = item.querySelector('.comment-info');

      if (author) {
        const authorComputed = window.getComputedStyle(author);
        if (authorComputed.flexDirection !== 'row' || authorComputed.display !== 'flex') {
          issues.push(
            `Комментарий ${index + 1}: ... (display: ${authorComputed.display}, flex-direction: ${
              authorComputed.flexDirection
            })`,
          );
        }
      }

      if (info) {
        const infoComputed = window.getComputedStyle(info);
        if (infoComputed.flexDirection !== 'column' || infoComputed.display !== 'flex') {
          issues.push(
            `Комментарий ${index + 1}: ... (display: ${infoComputed.display}, flex-direction: ${
              infoComputed.flexDirection
            })`,
          );
        }
      }
    });

    console.log(`📊 ...: ... ${commentItems.length} ...Комментарий，... ${issues.length} ...`);
    if (issues.length > 0) {
      console.warn('⚠️ error:');
      issues.forEach(issue => console.warn(`  - ${issue}`));
      console.log('💡 ...: fixVkFeedCommentLayout() ...');
    } else {
      console.log('✅ ...Комментарий...');
    }

    return { total: commentItems.length, issues: issues.length, details: issues };
  };

  console.log('🔧 [VkFeed UI] Комментарий...');
  console.log('💡 ...:');
  console.log('  - fixVkFeedCommentLayout() : ...Комментарий...');
  console.log('  - checkVkFeedCommentLayout() : ...Комментарий...Статус');
}
