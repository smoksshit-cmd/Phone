/**
 * ФорумUI...
 * ...Форум...
 */
class ForumUI {
  constructor() {
    this.currentThreadId = null;
    this.clickHandler = null;
    this.subReplyEventsbound = false;
    this.likeClickHandler = null;
    // Лайк - : { threadId: { likes: number, isLiked: boolean }, ... }
    this.likesData = {};
    // ОтветитьЛайк - : { replyId: { likes: number, isLiked: boolean }, ... }
    this.replyLikesData = {};

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

    this.init();
  }

  init() {
    console.log('[Reddit/Forum UI] ФорумUI...');
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
   * ...Сообщения...Форум...
   */
  parseForumContent(content) {
    // Форум
    const forumRegex = /<!-- FORUM_CONTENT_START -->([\s\S]*?)<!-- FORUM_CONTENT_END -->/;
    const match = content.match(forumRegex);

    if (!match) {
      console.log('[Reddit/Forum UI] ...Форум...');
      return { threads: [], replies: {} };
    }

    const forumContent = match[1];
    const threads = [];
    const replies = {};

    // : [|Написать постНикнейм|Постid||Пост]
    const titleRegex = /\[...\|([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
    // Ответить: [Ответ|Никнейм|Постid|Ответить]
    const replyRegex = /\[Ответить\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
    // : [|Никнейм|Постid||Ответить]
    const subReplyRegex = /\[...\|([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;

    let match_title;
    let match_reply;
    let match_subreply;

    while ((match_title = titleRegex.exec(forumContent)) !== null) {
      const thread = {
        id: match_title[2],
        author: match_title[1],
        title: match_title[3],
        content: match_title[4],
        replies: [],
        timestamp: new Date().toLocaleString(),
      };

      threads.push(thread);
      replies[thread.id] = [];
    }

    // Ответить
    while ((match_reply = replyRegex.exec(forumContent)) !== null) {
      const reply = {
        id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        threadId: match_reply[2],
        author: match_reply[1],
        content: match_reply[3],
        timestamp: new Date().toLocaleString(),
        type: 'reply',
        subReplies: [],
      };

      if (!replies[reply.threadId]) {
        replies[reply.threadId] = [];
      }
      replies[reply.threadId].push(reply);
    }

    while ((match_subreply = subReplyRegex.exec(forumContent)) !== null) {
      const subReply = {
        id: `subreply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        threadId: match_subreply[2],
        author: match_subreply[1],
        parentFloor: match_subreply[3],
        content: match_subreply[4],
        timestamp: new Date().toLocaleString(),
        type: 'subreply',
      };

      if (!replies[subReply.threadId]) {
        replies[subReply.threadId] = [];
      }

      // subReplies
      const parentReply = replies[subReply.threadId].find(
        r =>
          r.author === subReply.parentFloor ||
          r.id === subReply.parentFloor ||
          replies[subReply.threadId].indexOf(r) + 2 === parseInt(subReply.parentFloor),
      );

      if (parentReply) {
        if (!parentReply.subReplies) {
          parentReply.subReplies = [];
        }
        parentReply.subReplies.push(subReply);
      } else {
        // Если，Ответить
        subReply.type = 'reply';
        subReply.subReplies = [];
        replies[subReply.threadId].push(subReply);
      }
    }

    // ПостОтветить
    threads.forEach(thread => {
      if (replies[thread.id]) {
        thread.replies = replies[thread.id];
      }
    });

    console.log('[Reddit/Forum UI] ...，Пост...:', threads.length);
    return { threads, replies };
  }

  /**
   * ...Форум...HTML
   */
  getForumMainHTML() {
    return `
            <div class="forum-app">
                <!-- Форум... -->
                <div class="forum-content" id="forum-content">
                    ${this.getThreadListHTML()}
                </div>

                <!-- Написать пост/* Диалог */ -->
                <div class="post-dialog" id="post-dialog" style="display: none;">
                    <div class="dialog-overlay" id="dialog-overlay"></div>
                    <div class="dialog-content">
                        <div class="dialog-header">
                            <h3>...</h3>
                            <button class="close-btn" id="close-dialog-btn">×</button>
                        </div>
                        <div class="dialog-body">
                            <input type="text" class="post-title-input" id="post-title" placeholder="...Пост......">
                            <textarea class="post-content-input" id="post-content" placeholder="Поделиться......"></textarea>
                        </div>
                        <div class="dialog-footer">
                            <button class="cancel-btn" id="cancel-post-btn">Отменить</button>
                            <button class="submit-btn" id="submit-post-btn">✈</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * ...Пост/* Список */HTML
   */
  getThreadListHTML() {
    // СообщенияФорум
    const forumData = this.getCurrentForumData();

    if (forumData.threads.length === 0) {
      return `
                <div class="empty-state">
                    <div class="empty-icon">💬</div>
                    <div class="empty-text">...Пост</div>
                    <div class="empty-hint">...Написать пост...～</div>
                </div>
            `;
    }

    // НовоеВремяПост（Новое）
    const sortedThreads = forumData.threads.slice().sort((a, b) => {
      // ПостНовоеВремя
      const getLatestActivityTime = thread => {
        let latestTime = new Date(thread.timestamp || Date.now());

        if (thread.replies && thread.replies.length > 0) {
          thread.replies.forEach(reply => {
            const replyTime = new Date(reply.timestamp || Date.now());
            if (replyTime > latestTime) {
              latestTime = replyTime;
            }

            // Ответить
            if (reply.subReplies && reply.subReplies.length > 0) {
              reply.subReplies.forEach(subReply => {
                const subReplyTime = new Date(subReply.timestamp || Date.now());
                if (subReplyTime > latestTime) {
                  latestTime = subReplyTime;
                }
              });
            }
          });
        }

        return latestTime;
      };

      const aLatest = getLatestActivityTime(a);
      const bLatest = getLatestActivityTime(b);

      return bLatest - aLatest; // ...，Новое...
    });

    return sortedThreads
      .map(
        thread => `
            <div class="thread-item" data-thread-id="${thread.id}">
                <div class="thread-header">
                    ${this.generateAvatarHTML(thread.author)}
                    <div class="thread-author">
                        <div class="author-name">${thread.author}</div>
                    </div>
                    <div class="thread-id">ID: t${thread.id}</div>
                    <button class="delete-btn forum-delete-btn" data-thread-id="${thread.id}" title="УдалитьПост">Удалить</button>
                </div>
                <div class="post-content">
                    <h2 class="thread-title">${thread.title}</h2>
                    <div class="thread-content">${this.formatContent(thread.content)}</div>
                </div>
                <div class="thread-stats">
                    <div class="thread-actions">
                        <button class="action-btn like-btn" data-thread-id="${thread.id}">
                            <i class="${this.getLikeIconClass(thread.id)} fa-heart"></i> ${this.getLikeCount(thread.id)}
                        </button>
                        <button class="action-btn"><i class="far fa-comment-dots"></i> ${thread.replies.length}</button>
                    </div>
                </div>
            </div>
        `,
      )
      .join('');
  }

  /**
   * ...Сообщения...Форум...
   */
  getCurrentForumData() {
    try {
      if (window.mobileContextEditor) {
        const chatData = window.mobileContextEditor.getCurrentChatData();
        if (chatData && chatData.messages && chatData.messages.length > 0) {
          // СообщенияФорум
          const firstMessage = chatData.messages[0];
          if (firstMessage && firstMessage.mes) {
            return this.parseForumContent(firstMessage.mes);
          }
        }
      }
    } catch (error) {
      console.warn('[Reddit/Forum UI] errorФорумerror:', error);
    }

    return { threads: [], replies: {} };
  }

  /**
   * ...Пост...HTML
   */
  getThreadDetailHTML(threadId) {
    // СообщенияФорум
    const forumData = this.getCurrentForumData();
    const thread = forumData.threads.find(t => t.id === threadId);
    if (!thread) return '<div class="error">Пост...</div>';

    const replies = forumData.replies[threadId] || [];

    return `
            <div class="thread-detail">
                <!-- ... -->
                <div class="main-post">
                    <div class="post-header">
                        ${this.generateAvatarHTML(thread.author, 'large')}
                        <div class="author-info">
                            <span class="author-name">${thread.author}</span>
                        </div>
                    </div>
                    <h2 class="post-title">${thread.title}</h2>
                    <div class="post-meta">
                        <span class="thread-id">ID: t${thread.id}</span>
                    </div>
                    <div class="post-full-content">${this.formatContent(thread.content)}</div>
                    <div class="post-actions">
                        <button class="action-btn like-btn" data-thread-id="${thread.id}">
                            <i class="${this.getLikeIconClass(thread.id)} fa-heart"></i> ${this.getLikeCount(thread.id)}
                        </button>
                        <button class="action-btn"><i class="far fa-comment-dots"></i> ${replies.length}</button>
                    </div>
                </div>

                <!-- Ответить/* Список */ -->
                <div class="reply-list">
                    <div class="reply-header">
                        <h4>ВсеОтветить (${replies.length})</h4>
                    </div>
                    ${this.getRepliesHTML(replies)}
                </div>

                <!-- Ответить/* Поле ввода */ -->
                <div class="comment-input-bar">
                    <input type="text" class="reply-input" id="reply-input" placeholder="...">
                    <button class="action-btn submit-reply-btn" id="submit-reply-btn" style="color: var(--accent-pink); font-size: 16px;"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
  }

  /**
   * ...Ответить/* Список */HTML
   */
  getRepliesHTML(replies) {
    if (replies.length === 0) {
      return `
                <div class="no-replies">
                    <div class="no-replies-icon">💭</div>
                    <div class="no-replies-text">...Ответить，...～</div>
                </div>
            `;
    }

    return replies
      .map((reply, index) => {
        const floorNumber = index + 2;
        return `
                <div class="reply-item" data-floor="${floorNumber}" data-reply-id="${reply.id}">
                    <div class="reply-header">
                        <div class="reply-author">
                            ${this.generateAvatarHTML(reply.author)}
                            <div class="author-info">
                                <span class="author-name">${reply.author}</span>
                                <span class="reply-time">${reply.timestamp}</span>
                            </div>
                        </div>
                        <div class="reply-meta">
                            <span class="floor-number">${floorNumber}...</span>
                        </div>
                    </div>
                    <div class="reply-content">${this.formatContent(reply.content)}</div>
                    <div class="reply-actions">
                        <button class="action-btn like-reply" data-reply-id="${reply.id}">
                            <i class="${this.getReplyLikeIconClass(reply.id)} fa-heart"></i> ${this.getReplyLikeCount(
          reply.id,
        )}
                        </button>
                        <button class="action-btn reply-to-reply" data-reply-to="${
                          reply.author
                        }" data-floor="${floorNumber}" data-reply-id="${
          reply.id
        }"><i class="fas fa-reply"></i> Ответить</button>
                    </div>

                    <!-- ...Ответить -->
                    ${this.getSubRepliesHTML(reply.subReplies || [], floorNumber)}

                    <!-- ...Ответить/* Поле ввода */ -->
                    <div class="sub-reply-input-container" id="sub-reply-input-${reply.id}" style="display: none;">
                        <div class="sub-reply-input-box">
                            <div class="sub-reply-target">Ответить ${reply.author}:</div>
                            <textarea class="sub-reply-input" placeholder="...Ответить..." rows="2"></textarea>
                            <div class="sub-reply-actions">
                                <button class="cancel-sub-reply-btn" data-reply-id="${reply.id}">Отменить</button>
                                <button class="submit-sub-reply-btn" data-reply-id="${
                                  reply.id
                                }" data-parent-floor="${floorNumber}" data-parent-author="${reply.author}">✈</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      })
      .join('');
  }

  /**
   * ...ОтветитьHTML
   */
  getSubRepliesHTML(subReplies, parentFloor) {
    if (!subReplies || subReplies.length === 0) {
      return '';
    }

    return `
            <div class="sub-replies-container">
                <div class="sub-replies-header">
                    <span class="sub-replies-count">${subReplies.length} ...Ответить</span>
                </div>
                <div class="sub-replies-list">
                    ${subReplies
                      .map(
                        subReply => `
                        <div class="sub-reply-item" data-sub-reply-id="${subReply.id}">
                            <div class="sub-reply-author">
                                ${this.generateAvatarHTML(subReply.author, 'small')}
                                <span class="author-name">${subReply.author}</span>
                                <span class="sub-reply-time">${subReply.timestamp}</span>
                            </div>
                            <div class="sub-reply-content">${this.formatContent(subReply.content)}</div>
                            <div class="sub-reply-actions">
                                <button class="action-btn like-sub-reply">👍 ${Math.floor(Math.random() * 5)}</button>
                                <button class="action-btn reply-to-sub-reply" data-reply-to="${
                                  subReply.author
                                }" data-parent-floor="${parentFloor}">Ответить</button>
                            </div>
                        </div>
                    `,
                      )
                      .join('')}
                </div>
            </div>
        `;
  }

  /**
   * ...（...）
   */
  formatContent(content) {
    let formatted = content.replace(/...:\s*([^,\s]+)/g, '<span class="emoji-placeholder">[$1]</span>');



    // @Пользователь（）
    formatted = formatted.replace(/@([^\s]+)/g, '<span class="mention">@$1</span>');

    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  }

  /**
   * ...
   */
  bindEvents() {
    // （）
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
    }

    // Пост
    this.clickHandler = e => {
      // Форум
      const forumContent = document.getElementById('forum-content');
      if (!forumContent || !forumContent.contains(e.target)) {
        return;
      }

      // Удалить
      if (e.target.closest('.forum-delete-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const deleteBtn = e.target.closest('.forum-delete-btn');
        const threadId = deleteBtn.dataset.threadId;
        if (threadId) {
          this.deleteThread(threadId);
        }
        return;
      }

      if (e.target.closest('.thread-item')) {
        const threadItem = e.target.closest('.thread-item');
        const threadId = threadItem.dataset.threadId;
        this.showThreadDetail(threadId);
      }
    };

    document.addEventListener('click', this.clickHandler);

    // Написать пост
    const newPostBtn = document.getElementById('new-post-btn');
    if (newPostBtn) {
      newPostBtn.addEventListener('click', () => this.showPostDialog());
    }

    // Обновить
    const refreshBtn = document.getElementById('refresh-forum-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshForum());
    }

    // ФорумНастройки
    const forumControlBtn = document.getElementById('forum-control-btn');
    if (forumControlBtn) {
      forumControlBtn.addEventListener('click', () => this.showForumControl());
    }

    const generateBtn = document.getElementById('generate-demo-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateDemoContent());
    }

    // /* Диалог */
    this.bindDialogEvents();

    this.bindSubReplyEvents();

    // Ответить
    this.bindMainReplyEvents();

    // Лайк
    this.bindLikeEvents();
  }

  /**
   * .../* Диалог */...
   */
  bindDialogEvents() {
    // Закрыть/* Диалог */
    const closeBtn = document.getElementById('close-dialog-btn');
    const cancelBtn = document.getElementById('cancel-post-btn');
    const overlay = document.getElementById('dialog-overlay');

    [closeBtn, cancelBtn, overlay].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => this.hidePostDialog());
      }
    });

    // Написать пост
    const submitBtn = document.getElementById('submit-post-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitNewPost());
    }
  }

  /**
   * ...Пост...
   */
  showThreadDetail(threadId) {
    this.currentThreadId = threadId;

    // Статус/* Приложение */（Статус）
    if (window.mobilePhone) {
      const currentState = window.mobilePhone.currentAppState;
      const shouldPushState =
        !currentState ||
        currentState.app !== 'forum' ||
        currentState.view !== 'threadDetail' ||
        currentState.threadId !== threadId;

      if (shouldPushState) {
        const state = {
          app: 'forum',
          title: 'Пост...',
          view: 'threadDetail',
          threadId: threadId,
        };
        window.mobilePhone.pushAppState(state);
        console.log('[Reddit/Forum UI] ...Пост...Статус:', state);
      }
    }

    const forumContent = document.getElementById('forum-content');
    if (forumContent) {
      forumContent.innerHTML = this.getThreadDetailHTML(threadId);
    } else {
      console.error('[Reddit/Forum UI] errorforum-contenterror');
    }

    // Ответить
    this.bindReplyEvents();
  }

  /**
   * ...Ответить...
   */
  bindReplyEvents() {
    // ， bindMainReplyEvents()
    // submit-reply-btn bindMainReplyEvents()
    // bindEvents() ，
    // this.bindSubReplyEvents();
  }

  /**
   * ...Лайк...
   */
  bindLikeEvents() {
    // （）
    if (this.likeClickHandler) {
      document.removeEventListener('click', this.likeClickHandler);
    }

    this.likeClickHandler = e => {
      // ПостЛайк
      if (e.target.closest('.like-btn[data-thread-id]')) {
        e.preventDefault();
        e.stopPropagation();

        const button = e.target.closest('.like-btn[data-thread-id]');
        const threadId = button.dataset.threadId;

        if (threadId) {
          this.toggleThreadLike(threadId);
        }
      }

      // ОтветитьЛайк
      if (e.target.closest('.like-reply[data-reply-id]')) {
        e.preventDefault();
        e.stopPropagation();

        const button = e.target.closest('.like-reply[data-reply-id]');
        const replyId = button.dataset.replyId;

        if (replyId) {
          this.toggleReplyLike(replyId);
        }
      }
    };

    document.addEventListener('click', this.likeClickHandler);
  }

  /**
   * ...Ответить...
   */
  bindMainReplyEvents() {
    // （）
    if (this.mainReplyClickHandler) {
      document.removeEventListener('click', this.mainReplyClickHandler);
    }

    this.mainReplyClickHandler = e => {
      // Ответить
      if (e.target.closest('.action-btn') && e.target.closest('.action-btn').querySelector('i.fa-comment-dots')) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleCommentInput();
      }

      // Ответить
      if (e.target.closest('#submit-reply-btn')) {
        e.preventDefault();
        e.stopPropagation();
        this.submitMainReply();
      }
    };

    document.addEventListener('click', this.mainReplyClickHandler);
  }

  /**
   * ...Комментарий/* Поле ввода */...Статус
   */
  toggleCommentInput() {
    const inputBar = document.querySelector('.comment-input-bar');
    if (inputBar) {
      inputBar.classList.toggle('show');
      if (inputBar.classList.contains('show')) {
        // /* Поле ввода */
        const input = inputBar.querySelector('input');
        if (input) {
          setTimeout(() => input.focus(), 100);
        }
      }
    }
  }

  /**
   * ...Ответить
   */
  submitMainReply() {
    const input = document.querySelector('.comment-input-bar input');
    if (!input) return;

    const content = input.value.trim();
    if (!content) {
      alert('...Ответить...');
      return;
    }

    // Пост
    const forumData = this.getCurrentForumData();
    const currentThread = forumData.threads.find(t => t.id === this.currentThreadId);

    if (!currentThread) {
      alert('...Пост...');
      return;
    }

    // Ответить：ОтветитьПост'|Постid|Пост'
    const threadPrefix = `...ОтветитьПост'${currentThread.author}|${currentThread.id}|${currentThread.title}'`;

    // Ответить
    const replyFormat = `[Ответ|...|${this.currentThreadId}|${content}]`;

    // Ответить，Подтвердить
    // /* Поле ввода */
    input.value = '';
    const inputBar = document.querySelector('.comment-input-bar');
    if (inputBar) {
      inputBar.classList.remove('show');
    }

    if (window.showMobileToast) {
      window.showMobileToast('📤 Ответить...', 'success');
    } else {
      // Еслиtoast，alert
      setTimeout(() => {
        alert('Ответить...');
      }, 100);
    }

    // ОтветитьAI
    if (window.forumManager.sendReplyToAPI) {
      const fullReply = `${threadPrefix}\n${replyFormat}`;
      console.log('[Reddit/Forum UI] ...Ответить...AI:', fullReply);

      window.forumManager
        .sendReplyToAPI(fullReply)
        .then(() => {
          console.log('[Reddit/Forum UI] Ответить...API...，Форум...');
          // ОбновитьФорум
          setTimeout(() => {
            this.refreshThreadList();
          }, 500);
        })
        .catch(error => {
          console.error('[Reddit/Forum UI] APIerrorОтветитьerror:', error);
          if (window.showMobileToast) {
            window.showMobileToast('❌ ...Ответить...，...', 'error');
          } else {
            alert('...Ответить...，...');
          }
        });
    } else {
      if (window.showMobileToast) {
        window.showMobileToast('❌ Ответить...', 'error');
      } else {
        alert('Ответить...，...Форум...');
      }
    }
  }

  /**
   * ...Ответить...
   */
  bindSubReplyEvents() {
    if (this.subReplyEventsbound) {
      return;
    }
    this.subReplyEventsbound = true;

    // Ответить
    this.subReplyClickHandler = e => {
      if (e.target.classList.contains('reply-to-reply')) {
        const replyId = e.target.dataset.replyId;
        this.showSubReplyInput(replyId);
      }

      if (e.target.classList.contains('cancel-sub-reply-btn')) {
        const replyId = e.target.dataset.replyId;
        this.hideSubReplyInput(replyId);
      }

      if (e.target.classList.contains('submit-sub-reply-btn')) {
        const replyId = e.target.dataset.replyId;
        const parentFloor = e.target.dataset.parentFloor;
        const parentAuthor = e.target.dataset.parentAuthor;
        this.submitSubReply(replyId, parentFloor, parentAuthor);
      }
    };

    document.addEventListener('click', this.subReplyClickHandler);
  }

  /**
   * ...Ответить/* Поле ввода */
   */
  showSubReplyInput(replyId) {
    // Ответить/* Поле ввода */
    document.querySelectorAll('.sub-reply-input-container').forEach(container => {
      container.style.display = 'none';
    });

    // Ответить/* Поле ввода */
    const container = document.getElementById(`sub-reply-input-${replyId}`);
    if (container) {
      container.style.display = 'block';
      // /* Поле ввода */
      const textarea = container.querySelector('.sub-reply-input');
      if (textarea) {
        textarea.focus();
      }
    }
  }

  /**
   * ...Ответить/* Поле ввода */
   */
  hideSubReplyInput(replyId) {
    const container = document.getElementById(`sub-reply-input-${replyId}`);
    if (container) {
      container.style.display = 'none';
      // /* Поле ввода */
      const textarea = container.querySelector('.sub-reply-input');
      if (textarea) {
        textarea.value = '';
      }
    }
  }

  /**
   * ...Ответить
   */
  submitSubReply(replyId, parentFloor, parentAuthor) {
    const container = document.getElementById(`sub-reply-input-${replyId}`);
    if (!container) return;

    const textarea = container.querySelector('.sub-reply-input');
    if (!textarea) return;

    const content = textarea.value.trim();
    if (!content) {
      alert('...Ответить...');
      return;
    }

    // Форум，ОтветитьКомментарий
    const forumData = this.getCurrentForumData();
    const currentReplies = forumData.replies[this.currentThreadId] || [];

    // ОтветитьКомментарий
    let parentReply = null;
    for (const reply of currentReplies) {
      if (reply.id === replyId || reply.author === parentAuthor) {
        parentReply = reply;
        break;
      }
    }

    if (!parentReply) {
      alert('...Ответить...Комментарий...');
      return;
    }

    // Комментарий：ОтветитьКомментарий'|Постid|Комментарий'
    const commentPrefix = `...ОтветитьКомментарий'${parentReply.author}|${this.currentThreadId}|${parentReply.content}'`;

    // Ответить：[Ответ||Постid|Ответить：Ответить]
    const replyFormat = `[Ответ|...|${this.currentThreadId}|Ответить${parentReply.author}：${content}]`;

    const subReplyData = {
      type: 'subreply',
      threadId: this.currentThreadId,
      parentFloor: parentFloor,
      parentAuthor: parentAuthor,
      content: content,
      prefix: commentPrefix,
      replyFormat: replyFormat,
    };

    // ФорумОтветить
    this.sendReplyToForum(subReplyData);

    // /* Поле ввода */
    this.hideSubReplyInput(replyId);
  }

  /**
   * ...Написать пост/* Диалог */
   */
  showPostDialog() {
    const dialog = document.getElementById('post-dialog');
    if (dialog) {
      dialog.style.display = 'flex';
      // /* Поле ввода */
      document.getElementById('post-title').value = '';
      document.getElementById('post-content').value = '';
    }
  }

  /**
   * ...Написать пост/* Диалог */
   */
  hidePostDialog() {
    const dialog = document.getElementById('post-dialog');
    if (dialog) {
      dialog.style.display = 'none';
    }
  }

  /**
   * ...
   */
  submitNewPost() {
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();

    if (!title || !content) {
      alert('...');
      return;
    }

    // /* Диалог */
    this.hidePostDialog();

    if (!window.forumManager) {
      alert('Форум...，...');
      return;
    }

    // Написать пост：[||Постid||Пост]
    // Постid，
    const postFormat = `[...|...|Пост|${title}|${content}]`;

    console.log('[Reddit/Forum UI] ПользовательНаписать пост:', { title, content, postFormat });

    // ОпубликоватьПост，Подтвердить
    // Опубликовать
    if (window.showMobileToast) {
      window.showMobileToast('📝 Пост...Опубликовать', 'success');
    } else {
      // Еслиtoast，alert
      setTimeout(() => {
        alert('Пост...Опубликовать');
      }, 100);
    }

    // ФорумНаписать постAPI
    if (window.forumManager.sendPostToAPI) {
      window.forumManager
        .sendPostToAPI(postFormat)
        .then(() => {
          console.log('[Reddit/Forum UI] Пост...Опубликовать');
          // ОбновитьФорум
          setTimeout(() => {
            this.refreshThreadList();
          }, 1000);
        })
        .catch(error => {
          console.error('[Reddit/Forum UI] Написать постerror:', error);
          if (window.showMobileToast) {
            window.showMobileToast('❌ Написать пост...，...', 'error');
          } else {
            alert('Написать пост...，...');
          }
        });
    } else {
      if (window.showMobileToast) {
        window.showMobileToast('❌ Написать пост...', 'error');
      } else {
        alert('Написать пост...，...Форум...');
      }
      console.error('[Reddit/Forum UI] sendPostToAPIerror');
    }
  }

  /**
   * ...Ответить
   */
  submitReply() {
    if (!this.currentThreadId) return;

    const content = document.getElementById('reply-input').value.trim();
    if (!content) {
      alert('...Ответить...');
      return;
    }

    // /* Поле ввода */
    document.getElementById('reply-input').value = '';

    // Пост
    const forumData = this.getCurrentForumData();
    const currentThread = forumData.threads.find(t => t.id === this.currentThreadId);

    if (!currentThread) {
      alert('...Пост...');
      return;
    }

    // Ответить：ОтветитьПост'|Постid|Пост'
    const threadPrefix = `...ОтветитьПост'${currentThread.author}|${currentThread.id}|${currentThread.title}'`;

    // Ответить：[Ответ||Постid|Ответить]
    const replyFormat = `[Ответ|...|${this.currentThreadId}|${content}]`;

    const replyData = {
      type: 'reply',
      threadId: this.currentThreadId,
      content: content,
      prefix: threadPrefix,
      replyFormat: replyFormat,
    };

    // ФорумОтветить
    this.sendReplyToForum(replyData);
  }

  /**
   * ...Ответить...Форум...
   */
  sendReplyToForum(replyData) {
    if (!window.forumManager) {
      alert('Форум...，...');
      return;
    }

    console.log('[Reddit/Forum UI] ...Ответить...Форум...:', replyData);

    // Ответить，Подтвердить
    if (window.showMobileToast) {
      window.showMobileToast('📤 Ответить...', 'success');
    } else {
      // Еслиtoast，alert
      setTimeout(() => {
        alert('Ответить...');
      }, 100);
    }

    // APIОтветить，AIПользовательОтветитьФорум
    if (window.forumManager.sendReplyToAPI) {
      const fullReply = `${replyData.prefix}\n${replyData.replyFormat}`;
      console.log('[Reddit/Forum UI] ...Ответить...AI...Форум...:', fullReply);

      window.forumManager
        .sendReplyToAPI(fullReply)
        .then(() => {
          console.log('[Reddit/Forum UI] Ответить...API...，Форум...');

          // ОбновитьФорум
          setTimeout(() => {
            this.refreshThreadList();
          }, 500);
        })
        .catch(error => {
          console.error('[Reddit/Forum UI] APIerrorОтветитьerror:', error);
          if (window.showMobileToast) {
            window.showMobileToast('❌ ...Ответить...，...', 'error');
          } else {
            alert('...Ответить...，...');
          }
        });
    } else {
      // ЕслиAPI，
      console.warn('[Reddit/Forum UI] APIerror，error');
      if (window.forumManager.insertReplyToFirstLayer) {
        window.forumManager
          .insertReplyToFirstLayer(replyData.prefix, replyData.replyFormat)
          .then(() => {
            console.log('[Reddit/Forum UI] Ответить...');
            // ОбновитьФорум
            setTimeout(() => {
              this.refreshThreadList();
            }, 500);
          })
          .catch(error => {
            console.error('[Reddit/Forum UI] errorОтветитьerror:', error);
            if (window.showMobileToast) {
              window.showMobileToast('❌ ...Ответить...，...', 'error');
            } else {
              alert('...Ответить...，...');
            }
          });
      } else {
        if (window.showMobileToast) {
          window.showMobileToast('❌ Ответить...', 'error');
        } else {
          alert('Ответить...Форум...Форум...。...Форум...。');
        }
        console.log('[Reddit/Forum UI] Пользователь...Ответить:', replyData);
      }
    }
  }

  /**
   * ОбновитьФорум
   */
  refreshForum() {
    console.log('[Reddit/Forum UI] ОбновитьФорум...');
    this.refreshThreadList();
  }

  /**
   * ОбновитьПост/* Список */
   */
  refreshThreadList() {
    const content = document.getElementById('forum-content');
    if (content) {
      content.innerHTML = this.getThreadListHTML();
    }
  }

  /**
   * ...
   */
  generateDemoContent() {
    if (window.forumManager) {
      console.log('[Reddit/Forum UI] ...Форум...');
      window.forumManager.generateForumContent().then(() => {
        // Обновить
        setTimeout(() => {
          this.refreshThreadList();
        }, 1000);
      });
    } else {
      console.warn('[Reddit/Forum UI] Форумerror');
      alert('Форум...，...');
    }
  }

  /**
   * Назад.../* Список */
   */
  showMainList() {
    this.currentThreadId = null;

    // СтатусФорум/* Список */
    if (window.mobilePhone) {
      const currentState = window.mobilePhone.currentAppState;
      if (currentState && currentState.app === 'forum' && currentState.view !== 'main') {
        const mainState = {
          app: 'forum',
          title: 'Форум',
          view: 'main',
        };
        // СтатусСтатус
        window.mobilePhone.currentAppState = mainState;
        window.mobilePhone.updateAppHeader(mainState);
        console.log('[Reddit/Forum UI] ...Статус...Форум.../* Список */:', mainState);
      }
    }

    const forumContent = document.getElementById('forum-content');
    if (forumContent) {
      forumContent.innerHTML = this.getThreadListHTML();
      // /* Список */
      if (window.bindForumEvents) {
        window.bindForumEvents();
      }
    }
  }

  /**
   * ...Форум...
   */
  showForumControl() {
    // Статус/* Приложение */，Форум
    if (window.mobilePhone) {
      const state = {
        app: 'forum',
        title: 'ФорумНастройки',
        view: 'forumControl',
      };
      window.mobilePhone.pushAppState(state);
    }

    // Если，
    if (!window.mobilePhone && window.forumManager) {
      window.forumManager.showForumPanel();
    }
  }

  // ФорумUIСтатус
  resetState() {
    console.log('[Reddit/Forum UI] ...ФорумUIСтатус');
    this.currentThreadId = null;
    this.currentView = 'main';

    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
    if (this.likeClickHandler) {
      document.removeEventListener('click', this.likeClickHandler);
      this.likeClickHandler = null;
    }
    if (this.mainReplyClickHandler) {
      document.removeEventListener('click', this.mainReplyClickHandler);
      this.mainReplyClickHandler = null;
    }

    // /* Список */
    this.showMainList();

    console.log('[Reddit/Forum UI] ФорумUIСтатус...');
  }

  /**
   * ...ПостЛайк...
   */
  initThreadLikeData(threadId) {
    if (!this.likesData[threadId]) {
      this.likesData[threadId] = {
        likes: Math.floor(Math.random() * 50) + 10, // ...Лайк...
        isLiked: false,
      };
    }
  }

  /**
   * ...ОтветитьЛайк...
   */
  initReplyLikeData(replyId) {
    if (!this.replyLikesData[replyId]) {
      this.replyLikesData[replyId] = {
        likes: Math.floor(Math.random() * 10) + 1, // ...Лайк...
        isLiked: false,
      };
    }
  }

  /**
   * ...ПостЛайк...
   */
  getLikeCount(threadId) {
    this.initThreadLikeData(threadId);
    return this.likesData[threadId].likes;
  }

  /**
   * ...ПостЛайк...
   */
  getLikeIconClass(threadId) {
    this.initThreadLikeData(threadId);
    return this.likesData[threadId].isLiked ? 'fas' : 'far';
  }

  /**
   * ...ОтветитьЛайк...
   */
  getReplyLikeCount(replyId) {
    this.initReplyLikeData(replyId);
    return this.replyLikesData[replyId].likes;
  }

  /**
   * ...ОтветитьЛайк...
   */
  getReplyLikeIconClass(replyId) {
    this.initReplyLikeData(replyId);
    return this.replyLikesData[replyId].isLiked ? 'fas' : 'far';
  }

  /**
   * ...ПостЛайкСтатус
   */
  toggleThreadLike(threadId) {
    this.initThreadLikeData(threadId);
    const likeData = this.likesData[threadId];

    if (likeData.isLiked) {
      // ОтменаЛайк
      likeData.likes--;
      likeData.isLiked = false;
    } else {
      // Лайк
      likeData.likes++;
      likeData.isLiked = true;
    }

    // Лайк
    this.updateAllThreadLikeButtons(threadId);

    return likeData;
  }

  /**
   * ...ОтветитьЛайкСтатус
   */
  toggleReplyLike(replyId) {
    this.initReplyLikeData(replyId);
    const likeData = this.replyLikesData[replyId];

    if (likeData.isLiked) {
      // ОтменаЛайк
      likeData.likes--;
      likeData.isLiked = false;
    } else {
      // Лайк
      likeData.likes++;
      likeData.isLiked = true;
    }

    // Лайк
    this.updateAllReplyLikeButtons(replyId);

    return likeData;
  }

  /**
   * ...ПостЛайк...
   */
  updateAllThreadLikeButtons(threadId) {
    const buttons = document.querySelectorAll(`.like-btn[data-thread-id="${threadId}"]`);
    const likeData = this.likesData[threadId];

    buttons.forEach(button => {
      const icon = button.querySelector('i');
      const textNode = button.childNodes[button.childNodes.length - 1];

      if (icon) {
        icon.className = likeData.isLiked ? 'fas fa-heart' : 'far fa-heart';
        icon.style.color = likeData.isLiked ? '#e74c3c' : '';
      }

      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = ` ${likeData.likes}`;
      }

      // Лайк/* Анимации */
      if (likeData.isLiked) {
        button.classList.add('liked');
        this.addLikeAnimation(button);
      } else {
        button.classList.remove('liked');
      }
    });
  }

  /**
   * ...ОтветитьЛайк...
   */
  updateAllReplyLikeButtons(replyId) {
    const buttons = document.querySelectorAll(`.like-reply[data-reply-id="${replyId}"]`);
    const likeData = this.replyLikesData[replyId];

    buttons.forEach(button => {
      const icon = button.querySelector('i');
      const textNode = button.childNodes[button.childNodes.length - 1];

      if (icon) {
        icon.className = likeData.isLiked ? 'fas fa-heart' : 'far fa-heart';
        icon.style.color = likeData.isLiked ? '#e74c3c' : '';
      }

      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = ` ${likeData.likes}`;
      }

      // Лайк/* Анимации */
      if (likeData.isLiked) {
        button.classList.add('liked');
        this.addLikeAnimation(button);
      } else {
        button.classList.remove('liked');
      }
    });
  }

  /**
   * ...Лайк/* Анимации */
   */
  addLikeAnimation(button) {
    button.style.transform = 'scale(1.2)';
    button.style.transition = 'transform 0.2s ease';

    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 200);

    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.cssText = `
      position: absolute;
      pointer-events: none;
      font-size: 16px;
      z-index: 1000;
      animation: heartFloat 1s ease-out forwards;
    `;

    const rect = button.getBoundingClientRect();
    const phoneContainer = document.querySelector('.mobile-phone-container');
    const phoneRect = phoneContainer ? phoneContainer.getBoundingClientRect() : { left: 0, top: 0 };

    heart.style.left = rect.left - phoneRect.left + rect.width / 2 + 'px';
    heart.style.top = rect.top - phoneRect.top + 'px';

    // body
    if (phoneContainer) {
      phoneContainer.appendChild(heart);
    } else {
      document.body.appendChild(heart);
    }

    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }, 1000);
  }

  /**
   * УдалитьФорумПост...Ответить
   */
  async deleteThread(threadId) {
    console.log('[Reddit/Forum UI] ...УдалитьПост:', threadId);

    try {
      // Подтвердить/* Диалог */
      if (!confirm(`ОК...УдалитьПост ID: t${threadId} ...Ответить...？...。`)) {
        return;
      }

      if (!window.mobileContextEditor) {
        throw new Error('errorРедактироватьerror');
      }

      const chatData = window.mobileContextEditor.getCurrentChatData();
      if (!chatData || !chatData.messages || chatData.messages.length === 0) {
        throw new Error('error');
      }

      // Сообщения（Форум）
      const firstMessage = chatData.messages[0];
      if (!firstMessage || !firstMessage.mes) {
        throw new Error('errorФорумerror');
      }

      let content = firstMessage.mes;

      // Форум
      const forumRegex = /<!-- FORUM_CONTENT_START -->([\s\S]*?)<!-- FORUM_CONTENT_END -->/;
      const match = content.match(forumRegex);

      if (!match) {
        throw new Error('errorФорумerror');
      }

      let forumContent = match[1];

      // УдалитьПостID
      // Удалить: [|Написать постНикнейм|Постid||Пост]
      const titleRegex = new RegExp(`\\[...\\|[^|]+\\|${threadId}\\|[^|]+\\|[^\\]]+\\]`, 'g');
      forumContent = forumContent.replace(titleRegex, '');

      // УдалитьОтветить: [Ответ|Никнейм|Постid|Ответить]
      const replyRegex = new RegExp(`\\[Ответить\\|[^|]+\\|${threadId}\\|[^\\]]+\\]`, 'g');
      forumContent = forumContent.replace(replyRegex, '');

      // УдалитьОтветить: [|Никнейм|Постid||Ответить]
      const subReplyRegex = new RegExp(`\\[...\\|[^|]+\\|${threadId}\\|[^|]+\\|[^\\]]+\\]`, 'g');
      forumContent = forumContent.replace(subReplyRegex, '');

      forumContent = forumContent.replace(/\n{3,}/g, '\n\n');

      // Сообщения
      const newContent = content.replace(
        /<!-- FORUM_CONTENT_START -->[\s\S]*?<!-- FORUM_CONTENT_END -->/,
        `<!-- FORUM_CONTENT_START -->${forumContent}<!-- FORUM_CONTENT_END -->`
      );

      // Сообщения
      await window.mobileContextEditor.modifyMessage(0, newContent);

      console.log('[Reddit/Forum UI] ✅ ПостУдалить...:', threadId);

      if (window.showMobileToast) {
        window.showMobileToast('🗑️ Пост...Удалить', 'success');
      } else {
        alert('Пост...Удалить');
      }

      // ОбновитьФорум
      setTimeout(() => {
        this.refreshThreadList();
      }, 500);

    } catch (error) {
      console.error('[Reddit/Forum UI] УдалитьПостerror:', error);
      if (window.showMobileToast) {
        window.showMobileToast('❌ Удалить...: ' + error.message, 'error');
      } else {
        alert('Удалить...: ' + error.message);
      }
    }
  }
}

window.ForumUI = ForumUI;
window.forumUI = new ForumUI();

// Форум/* Приложение */
window.getForumAppContent = function () {
  return window.forumUI.getForumMainHTML();
};

// Форум/* Приложение */
window.bindForumEvents = function () {
  if (window.forumUI) {
    window.forumUI.bindEvents();
    console.log('[Reddit/Forum UI] ...');
  }
};

console.log('[Reddit/Forum UI] ФорумUI...');
