/**
 * Friend Renderer - Друзья...
 * ...Друзья...Сообщения/* Список */
 */

if (typeof window.FriendRenderer === 'undefined') {
  class FriendRenderer {
    constructor() {
      this.contextMonitor =
        window['contextMonitor'] || (window['ContextMonitor'] ? new window['ContextMonitor']() : null);
      if (!this.contextMonitor) {
        console.warn('[Friend Renderer] error，error');
        this.friendPattern = /\[Друзьяid\|([^|]+)\|(\d+)\]/g;
      } else {
        this.friendPattern = this.contextMonitor.getRegexForFormat('friend');
      }
      this.extractedFriends = [];
      this.lastChatRecord = '';
      this.init();
    }

    init() {
      console.log('[Friend Renderer] Друзья...');
    }

    /**
     * ...Друзья...
     */
    extractFriendsFromContext() {
      this.extractedFriends = [];

      // Редактировать
      if (!window.mobileContextEditor) {
        console.warn('[Friend Renderer] errorРедактироватьerror');
        return [];
      }

      // SillyTavern
      if (!window.mobileContextEditor.isSillyTavernReady()) {
        console.warn('[Friend Renderer] SillyTavernerror');
        return [];
      }

      try {
        const context = window.SillyTavern.getContext();
        if (!context || !context.chat || !Array.isArray(context.chat)) {
          console.warn('[Friend Renderer] error');
          return [];
        }

        // Сообщения，Друзья
        const friendsMap = new Map();
        const groupsMap = new Map();

        const friendPattern = /\[Друзьяid\|([^|]+)\|(\d+)\]/g;
        const groupPattern = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;

        // ：Сообщения
        const groupMessagePattern = /\[...Сообщения\|([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;
        // ：Сообщения
        const myGroupMessagePattern = /\[...Сообщения\|...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;

        context.chat.forEach((message, index) => {
          if (message.mes && typeof message.mes === 'string') {
            // thinking，thinking
            const messageForMatching = this.removeThinkingTags(message.mes);

            // Друзья
            const friendMatches = [...messageForMatching.matchAll(friendPattern)];
            friendMatches.forEach(match => {
              const friendName = match[1];
              const friendNumber = match[2];
              const friendKey = `friend_${friendName}_${friendNumber}`;

              if (!friendsMap.has(friendKey) || friendsMap.get(friendKey).messageIndex < index) {
                friendsMap.set(friendKey, {
                  type: 'friend',
                  name: friendName,
                  number: friendNumber,
                  messageIndex: index,
                  addTime: message.send_date || Date.now(),
                  isGroup: false,
                });
              }
            });

            // （）
            const groupMatches = [...messageForMatching.matchAll(groupPattern)];
            groupMatches.forEach(match => {
              const groupName = match[1];
              const groupId = match[2];
              const groupMembers = match[3];
              const groupKey = `group_${groupId}`; // ...ID...key

              if (!groupsMap.has(groupKey) || groupsMap.get(groupKey).messageIndex < index) {
                groupsMap.set(groupKey, {
                  type: 'group',
                  name: groupName,
                  number: groupId,
                  members: groupMembers,
                  messageIndex: index,
                  addTime: message.send_date || Date.now(),
                  isGroup: true,
                });
              }
            });

            // Сообщения
            const groupMessageMatches = [...messageForMatching.matchAll(groupMessagePattern)];
            groupMessageMatches.forEach(match => {
              const groupId = match[1];
              const senderName = match[2];
              const messageType = match[3];
              const messageContent = match[4];

              const groupKey = `group_${groupId}`; // ...ID...key

              if (!groupsMap.has(groupKey)) {
                // Если，Сообщения
                groupsMap.set(groupKey, {
                  type: 'group',
                  name: `...${groupId}`,
                  number: groupId,
                  members: senderName,
                  messageIndex: index,
                  addTime: message.send_date || Date.now(),
                  isGroup: true,
                });
              } else {
                // Если，/* Список */НовоеСообщения
                const existingGroup = groupsMap.get(groupKey);
                if (existingGroup.members && !existingGroup.members.includes(senderName)) {
                  existingGroup.members += `、${senderName}`;
                }
                if (existingGroup.messageIndex < index) {
                  existingGroup.messageIndex = index;
                  existingGroup.addTime = message.send_date || Date.now();
                }
              }
            });

            // Сообщения
            const myGroupMessageMatches = [...messageForMatching.matchAll(myGroupMessagePattern)];
            myGroupMessageMatches.forEach(match => {
              const groupId = match[1];
              const messageType = match[2];
              const messageContent = match[3];

              const groupKey = `group_${groupId}`; // ...ID...key

              if (!groupsMap.has(groupKey)) {
                // Если，Сообщения
                groupsMap.set(groupKey, {
                  type: 'group',
                  name: `...${groupId}`,
                  number: groupId,
                  members: '...',
                  messageIndex: index,
                  addTime: message.send_date || Date.now(),
                  isGroup: true,
                });
              } else {
                // Если，НовоеСообщения
                const existingGroup = groupsMap.get(groupKey);
                if (!existingGroup.members.includes('...')) {
                  existingGroup.members += '、...';
                }
                if (existingGroup.messageIndex < index) {
                  existingGroup.messageIndex = index;
                  existingGroup.addTime = message.send_date || Date.now();
                }
              }
            });
          }
        });

        // Друзья，Время
        const allContacts = [...Array.from(friendsMap.values()), ...Array.from(groupsMap.values())].sort(
          (a, b) => b.addTime - a.addTime,
        );

        // Сообщения
        this.extractedFriends = allContacts.map(contact => {
          const lastMessage = this.getLastMessageForContact(context.chat, contact);
          return {
            ...contact,
            lastMessage: lastMessage,
          };
        });

        // ，
        if (!this.lastContactCount || this.lastContactCount !== this.extractedFriends.length) {
          console.log(`[Friend Renderer] ... ${this.extractedFriends.length} ... (Друзья+...)`);
          this.lastContactCount = this.extractedFriends.length;
        }

        return this.extractedFriends;
      } catch (error) {
        console.error('[Friend Renderer] error:', error);
        return [];
      }
    }

    /**
     * ...Сообщения
     */
    getLastMessageForContact(chatMessages, contact) {
      if (!chatMessages || chatMessages.length === 0) {
        return '...';
      }

      let messagePatterns = [];

      if (contact.isGroup) {
        // Сообщения
        messagePatterns = [
          // Сообщения：[Сообщения||ID|Сообщения|Сообщения]
          new RegExp(`\\[...Сообщения\\|...\\|${this.escapeRegex(contact.number)}\\|[^|]+\\|([^\\]]+)\\]`, 'g'),
          // Сообщения：[Сообщения|ID||Сообщения|Сообщения]
          new RegExp(`\\[...Сообщения\\|${this.escapeRegex(contact.number)}\\|[^|]+\\|[^|]+\\|([^\\]]+)\\]`, 'g'),
          // （）
          new RegExp(
            `\\[...Сообщения\\|${this.escapeRegex(contact.name)}\\|${this.escapeRegex(
              contact.number,
            )}\\|[^|]+\\|([^|]+)\\|[^\\]]+\\]`,
            'g',
          ),
          new RegExp(
            `\\[...Сообщения\\|${this.escapeRegex(contact.name)}\\|${this.escapeRegex(
              contact.number,
            )}\\|[^|]+\\|[^|]+\\|([^\\]]+)\\]`,
            'g',
          ),
        ];
      } else {
        // Сообщения
        messagePatterns = [
          // Сообщения：[Сообщения||Друзья|Сообщения|Время]
          new RegExp(`\\[...Сообщения\\|...\\|${this.escapeRegex(contact.number)}\\|([^|]+)\\|[^\\]]+\\]`, 'g'),
          // Сообщения：[Сообщения|Друзья|Друзья|Сообщения|Сообщения]
          new RegExp(
            `\\[...Сообщения\\|${this.escapeRegex(contact.name)}\\|${this.escapeRegex(
              contact.number,
            )}\\|[^|]+\\|([^\\]]+)\\]`,
            'g',
          ),
        ];
      }

      // Ищем с последнего сообщения
      for (let i = chatMessages.length - 1; i >= 0; i--) {
        const message = chatMessages[i];
        if (message.mes && typeof message.mes === 'string') {
          for (const pattern of messagePatterns) {
            const matches = [...message.mes.matchAll(pattern)];
            if (matches.length > 0) {
              // Сообщения，
              const lastMatch = matches[matches.length - 1];
              if (lastMatch[1]) {
                const content = lastMatch[1].trim();
                return content.length > 50 ? content.substring(0, 50) + '...' : content;
              }
            }
            pattern.lastIndex = 0; // ...
          }
        }
      }

      return contact.isGroup ? '...' : '...';
    }

    /**
     * ...
     */
    escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * ...（...）
     */
    getLastChatRecord(chatMessages) {
      if (!chatMessages || chatMessages.length === 0) {
        return '...';
      }

      // Ищем с последнего сообщения，Друзья/Сообщения
      for (let i = chatMessages.length - 1; i >= 0; i--) {
        const message = chatMessages[i];
        if (message.mes && typeof message.mes === 'string') {
          // ЕслиДрузьяСообщения，
          const friendPattern = /\[Друзьяid\|[^|]+\|\d+\]/;
          const groupPattern = /\[...\|[^|]+\|[^|]+\|[^\]]+\]/;

          if (!friendPattern.test(message.mes) && !groupPattern.test(message.mes)) {
            // Сообщения
            const actualContent = this.extractActualMessageContent(message.mes);
            return actualContent.length > 50 ? actualContent.substring(0, 50) + '...' : actualContent;
          }
        }
      }

      return '...';
    }

    /**
     * ...Сообщения...（...，...QQ...Сообщения）
     */
    extractActualMessageContent(messageText) {
      try {
        // 1. <thinking>
        let cleanedText = messageText.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');

        // 2. QQСообщения
        const qqMessagePatterns = [
          // Сообщения：[Сообщения|Друзья|Друзья|Сообщения|Время]
          /\[...Сообщения\|[^|]+\|[^|]+\|([^|]+)\|[^\]]+\]/g,
          // Сообщения：[Сообщения||||Сообщения|Время]
          /\[...Сообщения\|[^|]+\|[^|]+\|[^|]+\|([^|]+)\|[^\]]+\]/g,
          // Сообщения：[Сообщения||id|Сообщения|Сообщения]
          /\[...Сообщения\|[^|]+\|[^|]+\|[^|]+\|([^\]]+)\]/g,
          // Сообщения：[Сообщения||||Сообщения|Сообщения]
          /\[...Сообщения\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|([^\]]+)\]/g,
          // ：Сообщения：[Сообщения|ID||Сообщения|Сообщения]
          /\[...Сообщения\|[^|]+\|[^|]+\|[^|]+\|([^\]]+)\]/g,
          // ：[||]
          /\[...\|[^|]+\|[^\]]+\]/g,
          // ：[||]
          /\[...\|[^|]+\|([^\]]+)\]/g,
          // ：[||]
          /\[...\|([^|]+)\|[^\]]+\]/g,
        ];

        // Сообщения
        const extractedMessages = [];

        for (const pattern of qqMessagePatterns) {
          let match;
          while ((match = pattern.exec(cleanedText)) !== null) {
            if (match[1]) {
              let content = match[1];

              // HTML
              if (content.includes('<img')) {
                content = '[...]';
              } else if (content.includes('<video')) {
                content = '[...]';
              } else if (content.includes('<audio')) {
                content = '[...]';
              } else if (/<[^>]+>/.test(content)) {
                // HTML，
                content = content.replace(/<[^>]*>/g, '').trim();
                if (!content) {
                  content = '[...Сообщения]';
                }
              }

              // ， "："
              if (pattern.source.includes('...')) {
                extractedMessages.push(`...：${content}`);
              } else if (pattern.source.includes('...')) {
                extractedMessages.push('...');
              } else if (pattern.source.includes('...')) {
                extractedMessages.push(`...：${content}`);
              } else {
                extractedMessages.push(content);
              }
            } else if (match[0]) {
              // ，
              if (pattern.source.includes('...')) {
                extractedMessages.push('...');
              }
            }
          }
          pattern.lastIndex = 0; // ...
        }

        // ЕслиСообщения，Назад
        if (extractedMessages.length > 0) {
          return extractedMessages[extractedMessages.length - 1];
        }

        // 3. QQ，
        cleanedText = cleanedText.trim();

        cleanedText = cleanedText.replace(/\n\s*\n/g, '\n');

        // Если，
        if (cleanedText.length > 50) {
          const firstLine = cleanedText.split('\n')[0];
          return firstLine || 'Сообщения...';
        }

        return cleanedText || 'Сообщения...';
      } catch (error) {
        console.error('[Friend Renderer] errorОтменитьerror:', error);
        return 'Сообщения...';
      }
    }

    /**
     * HTML...
     */
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    /**
     * ...Друзья.../* Список */HTML
     */
    renderFriendsHTML() {
      // Друзья
      const contacts = this.extractFriendsFromContext();

      if (contacts.length === 0) {
        return `
                <div class="empty-state">
                    <div class="empty-icon">💬</div>
                    <div class="empty-text">...</div>
                    <div class="empty-hint">..."..."...Друзья...</div>
                </div>
            `;
      }

      // /* Список */
      const contactsHTML = contacts
        .map(contact => {
          const lastMessage = this.escapeHtml(contact.lastMessage || '...Сообщения');

          if (contact.isGroup) {
            return `
                    <div class="message-item group-item" data-friend-id="${contact.number}" data-is-group="true">
                        <div class="message-avatar group-avatar"></div>
                        <div class="message-content">
                            <div class="message-name">
                                ${contact.name}
                                <span class="group-badge">...</span>
                            </div>
                            <div class="message-text">${lastMessage}</div>
                        </div>
                        <div class="group-members-info">
                            <span class="member-count">${this.getMemberCount(contact.members)}</span>
                        </div>
                    </div>
                `;
          } else {
            // Друзья
            const avatar = this.getRandomAvatar();
            return `
                    <div class="message-item friend-item" data-friend-id="${contact.number}" data-is-group="false">
                        <div class="message-avatar">${avatar}</div>
                        <div class="message-content">
                            <div class="message-name">${contact.name}</div>
                            <div class="message-text">${lastMessage}</div>
                        </div>
                    </div>
                `;
          }
        })
        .join('');

      return contactsHTML;
    }

    /**
     * ...
     */
    getMemberCount(membersString) {
      if (!membersString) return 0;
      // ：、、、
      const members = membersString.split('、').filter(m => m.trim());
      return members.length;
    }

    /**
     * ...Аватар
     */
    getRandomAvatar() {
      // Назад，，
      return '';
    }

    /**
     * ...Время
     */
    formatTime(timestamp) {
      // Время
      let date;

      if (!timestamp) {
        // ЕслиВремя，Время
        date = new Date();
      } else if (typeof timestamp === 'string') {
        // Если，
        date = new Date(timestamp);
        // Если，Время
        if (isNaN(date.getTime())) {
          date = new Date();
        }
      } else if (typeof timestamp === 'number') {
        // Если，
        date = new Date(timestamp);
        // Время
        if (isNaN(date.getTime())) {
          date = new Date();
        }
      } else {
        // Время
        date = new Date();
      }

      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      // ЕслиВремя（1），Время，
      if (Math.abs(diffDays) > 365) {
        return date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
        });
      }

      if (diffMins < 1) {
        return 'только что';
      } else if (diffMins < 60) {
        return `${diffMins}мин. назад`;
      } else if (diffHours < 24) {
        return `${diffHours}ч. назад`;
      } else if (diffDays < 7) {
        return `${diffDays}...`;
      } else {
        return date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
        });
      }
    }

    /**
     * ...Друзья...
     */
    getFriendCount() {
      return this.extractedFriends.length;
    }

    /**
     * ...ID...Друзья...
     */
    getFriendById(friendId) {
      return this.extractedFriends.find(friend => friend.number === friendId);
    }

    /**
     * ОбновитьДрузья/* Список */
     */
    refresh() {
      this.extractFriendsFromContext();
      console.log('[Friend Renderer] Друзья/* Список */...Обновить');
    }

    /**
     * ...Друзья...（...）
     */
    extractFriends() {
      return this.extractFriendsFromContext();
    }

    /**
     * ...thinking...
     */
    removeThinkingTags(text) {
      if (!text || typeof text !== 'string') {
        return text;
      }

      // <think>...</think> <thinking>...</thinking>
      const thinkingTagRegex = /<think>[\s\S]*?<\/think>|<thinking>[\s\S]*?<\/thinking>/gi;
      return text.replace(thinkingTagRegex, '');
    }

    /**
     * ...thinking...
     */
    isPatternInsideThinkingTags(text, patternStart, patternEnd) {
      if (!text || typeof text !== 'string') {
        return false;
      }

      const thinkingTagRegex = /<think>[\s\S]*?<\/think>|<thinking>[\s\S]*?<\/thinking>/gi;
      let match;

      while ((match = thinkingTagRegex.exec(text)) !== null) {
        const thinkStart = match.index;
        const thinkEnd = match.index + match[0].length;

        // thinking
        if (patternStart >= thinkStart && patternEnd <= thinkEnd) {
          return true;
        }
      }

      return false;
    }

    /**
     * ...thinking...
     */
    removePatternOutsideThinkingTags(text, pattern) {
      if (!text || typeof text !== 'string') {
        return text;
      }

      // ，lastIndex
      const newPattern = new RegExp(pattern.source, pattern.flags);
      let result = text;
      const replacements = [];
      let match;

      while ((match = newPattern.exec(text)) !== null) {
        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;

        // thinking
        if (!this.isPatternInsideThinkingTags(text, matchStart, matchEnd)) {
          replacements.push({
            start: matchStart,
            end: matchEnd,
            text: match[0],
          });
        }
      }

      // ，
      replacements.reverse().forEach(replacement => {
        result = result.substring(0, replacement.start) + result.substring(replacement.end);
      });

      return result;
    }

    /**
     * ...
     */
    debug() {
      // ：
      if (window.DEBUG_FRIEND_RENDERER) {
        console.group('[Friend Renderer] ...');
        console.log('...Друзья...:', this.extractedFriends.length);
        console.log('Друзья/* Список */:', this.extractedFriends);
        console.log('...:', this.lastChatRecord);
        console.log('...:', this.friendPattern);
        console.groupEnd();
      }
    }
  }

  window.FriendRenderer = FriendRenderer;
  window.friendRenderer = new FriendRenderer();

  // message-app
  window.renderFriendsFromContext = function () {
    return window.friendRenderer.renderFriendsHTML();
  };

  window.refreshFriendsList = function () {
    window.friendRenderer.refresh();
  };

  console.log('[Friend Renderer] Друзья...');
} // ... if (typeof window.FriendRenderer === 'undefined') ...
