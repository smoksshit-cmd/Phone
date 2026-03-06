/**
 * Message Renderer - Сообщения...
 * ...Сообщения
 * ...
 */

if (typeof window.MessageRenderer === 'undefined') {
  // @ts-ignore
  window.MessageRenderer = class MessageRenderer {
    constructor() {
      this.contextMonitor = null;
      this.currentFriendId = null;
      this.myMessages = [];
      this.otherMessages = [];
      this.groupMessages = [];
      this.allMessages = [];
      this.retryCount = 0;
      this.maxRetries = 10;

      this.virtualScrolling = {
        itemHeight: 80, // ...Сообщения...
        visibleCount: 20, // ...Сообщения...
        buffer: 10, // ...
        scrollTop: 0,
        startIndex: 0,
        endIndex: 20,
      };

      this.pagination = {
        pageSize: 50, // ...Сообщения...
        currentPage: 0,
        totalPages: 0,
        loadedMessages: [],
        isLoading: false,
      };

      this.messageCache = new Map(); // Сообщения...
      this.renderCache = new Map(); // ...

      // 🔥 ：ДрузьяID
      this.friendNameToIdMap = new Map();
      this.groupNameToIdMap = new Map();
      this.generatedUserIds = new Map(); // ...ПользовательID

      this.init();
    }

    init() {
      console.log('[Message Renderer] Сообщения... - ...');
      this.loadContextMonitor();
    }

    /**
     * 🔥 ...Сообщения（...）
     */
    parseMessagesFromRawText(rawText) {
      const messages = [];
      const messageRegex = /\[(...Сообщения|...Сообщения|...Сообщения|...Сообщения)\|([^|]*)\|([^|]*)\|([^|]*)\|([^\]]*)\]/g;

      let match;
      let position = 0;

      while ((match = messageRegex.exec(rawText)) !== null) {
        const [fullMatch, messageType, field1, field2, field3, field4] = match;

        // Сообщения
        let sender, number, msgType, content;

        if (messageType === '...Сообщения') {
          // Сообщения：[Сообщения|ID||Сообщения|Сообщения]
          sender = field2; // ...
          number = field1; // ...ID (...)
          msgType = field3; // Сообщения...
          content = field4; // Сообщения...
        } else if (messageType === '...Сообщения') {
          // Сообщения：[Сообщения||ID|Сообщения|Сообщения]
          sender = '...'; // ..."..."
          number = field2; // ...ID (...)
          msgType = field3; // Сообщения...
          content = field4; // Сообщения...
        } else {
          // Сообщения：[Сообщения||Друзья|Сообщения|Время] [Сообщения|Друзья|Друзья|Сообщения|Сообщения]
          sender = field1;
          number = field2;
          msgType = field3;
          content = field4;
        }

        messages.push({
          fullMatch: fullMatch,
          messageType: messageType,
          sender: sender,
          number: number,
          msgType: msgType,
          content: content,
          textPosition: match.index, // 🔥 ...：...
          contextOrder: position++, // 🔥 ...：...
        });
      }

      // 🔥 ：Сообщения（→Новое）
      // Сообщения：Сообщения，Сообщения
      messages.sort((a, b) => a.textPosition - b.textPosition);
      console.log('[Message Renderer] ...，...Время...');

      console.log('[Message Renderer] ...', messages.length, '...Сообщения');
      console.log(
        '[Message Renderer] ...Сообщения...:',
        messages.map((msg, i) => ({
          index: i,
          textPosition: msg.textPosition,
          content: msg.content?.substring(0, 20) + '...',
          fullMatch: msg.fullMatch?.substring(0, 40) + '...',
        })),
      );

      return messages;
    }

    /**
     * 🔥 ...Сообщения...
     */
    estimateMessagePosition(message, globalIndex) {
      // 🔥 ：Сообщения

      // 1. ，
      if (message.textPosition !== undefined) return message.textPosition;
      if (message.contextOrder !== undefined) return message.contextOrder;
      if (message.index !== undefined) return message.index;
      if (message.position !== undefined) return message.position;
      if (message.order !== undefined) return message.order;

      // 2. Сообщения
      const content = message.content || '';
      const fullMatch = message.fullMatch || '';

      // 3. Сообщения
      let estimatedPosition = globalIndex || 0;

      // ЕслиСообщения，
      if (content.includes('...') || content.includes('100')) {
        estimatedPosition = estimatedPosition - 1000;
      }

      // ЕслиСообщения，
      if (content.includes('...') || message.msgType === '...') {
        estimatedPosition = estimatedPosition + 1000;
      }

      // Если""，
      if (content.includes('...') || content.includes('...')) {
        estimatedPosition = estimatedPosition + 2000;
      }

      // Если""，
      if (content.includes('...')) {
        estimatedPosition = estimatedPosition + 500;
      }

      // Если""，
      if (content.includes('...')) {
        estimatedPosition = estimatedPosition - 500;
      }

      // 4.
      if (message._extractionOrder !== undefined) {
        estimatedPosition = estimatedPosition + message._extractionOrder * 100;
      }

      // 5.
      if (message._typeIndex !== undefined) {
        estimatedPosition = estimatedPosition + message._typeIndex;
      }

      return estimatedPosition;
    }

    /**
     * ...
     */
    simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // ...32...
      }
      return Math.abs(hash);
    }

    /**
     * 🔥 ...：...Друзья...ID...
     * ...Друзья...
     */
    buildFriendNameToIdMapping() {
      const friendMap = new Map();
      const groupMap = new Map();

      // FriendRenderer
      // @ts-ignore
      if (window.friendRenderer && window.friendRenderer.extractedFriends) {
        // @ts-ignore
        window.friendRenderer.extractedFriends.forEach(contact => {
          if (contact.isGroup) {
            // ：ID
            groupMap.set(contact.name, contact.number);
            if (window.DEBUG_MESSAGE_RENDERER) {
              console.log(`[Message Renderer] ...: ${contact.name} -> ${contact.number}`);
            }
          } else {
            // Друзья：ДрузьяДрузьяID
            friendMap.set(contact.name, contact.number);
            if (window.DEBUG_MESSAGE_RENDERER) {
              console.log(`[Message Renderer] Друзья...: ${contact.name} -> ${contact.number}`);
            }
          }
        });
      }

      // Если，
      if (friendMap.size === 0 && groupMap.size === 0) {
        console.log('[Message Renderer] ...Друзья...');
        this.parseFriendDataFromContext(friendMap, groupMap);
      }

      this.friendNameToIdMap = friendMap;
      this.groupNameToIdMap = groupMap;

      if (window.DEBUG_MESSAGE_RENDERER) {
        console.log(`[Message Renderer] ... ${friendMap.size} ...Друзья... ${groupMap.size} ...`);
      }
      return { friendMap, groupMap };
    }

    /**
     * 🔥 ...：...Друзья...
     */
    parseFriendDataFromContext(friendMap, groupMap) {
      try {
        // SillyTavern
        // @ts-ignore
        if (!window.SillyTavern || !window.SillyTavern.getContext) {
          console.warn('[Message Renderer] SillyTavernerror');
          return;
        }

        // @ts-ignore
        const context = window.SillyTavern.getContext();
        if (!context || !context.chat || !Array.isArray(context.chat)) {
          console.warn('[Message Renderer] error');
          return;
        }

        const friendPattern = /\[Друзьяid\|([^|]+)\|(\d+)\]/g;
        const groupPattern = /\[...\|([^|]+)\|([^|]+)\|([^\]]+)\]/g;

        context.chat.forEach(message => {
          if (message.mes && typeof message.mes === 'string') {
            // thinking
            const messageForMatching = this.removeThinkingTags ? this.removeThinkingTags(message.mes) : message.mes;

            // Друзья：[ДругId||555555]
            const friendMatches = [...messageForMatching.matchAll(friendPattern)];
            friendMatches.forEach(match => {
              const friendName = match[1];
              const friendId = match[2];
              friendMap.set(friendName, friendId);
            });

            // ：[||123456|、、]
            const groupMatches = [...messageForMatching.matchAll(groupPattern)];
            groupMatches.forEach(match => {
              const groupName = match[1];
              const groupId = match[2];
              const membersList = match[3];

              groupMap.set(groupName, groupId);

              // 🔥 ：/* Список */，
              if (membersList) {
                const members = membersList
                  .split(/[、,，]/)
                  .map(name => name.trim())
                  .filter(name => name);
                members.forEach(memberName => {
                  // ЕслиДрузья，ID
                  if (!friendMap.has(memberName) && memberName !== '...') {
                    const generatedId = this.generateUserIdFromName(memberName);
                    friendMap.set(memberName, generatedId);
                    console.log(`[Message Renderer] ... "${memberName}" ...: ${generatedId}`);
                  }
                });
              }
            });
          }
        });
      } catch (error) {
        console.error('[Message Renderer] errorДрузьяerror:', error);
      }
    }

    /**
     * 🔥 ...：...ID
     */
    getIdBySenderName(senderName, isGroupMessage) {
      if (!this.friendNameToIdMap || !this.groupNameToIdMap) {
        this.buildFriendNameToIdMapping();
      }

      if (isGroupMessage) {
        // Сообщения，
        // ：Сообщения，ID
        // ОКID
        return this.currentFriendId || '';
      } else {
        // Сообщения，Друзья
        return this.friendNameToIdMap.get(senderName) || '';
      }
    }

    /**
     * 🔥 ...：...thinking...（...）
     */
    removeThinkingTags(text) {
      if (!text) return '';
      // <thinking>...</thinking>
      return text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
    }

    /**
     * 🔥 ...：...Пользователь...ID
     * ...Друзья...
     */
    generateUserIdFromName(userName) {
      if (!userName) return '';

      // 1：ID
      let hash = this.simpleHash(userName);

      // ID6，ID
      let generatedId = '8' + (hash % 100000).toString().padStart(5, '0');

      console.log(`[Message Renderer] ...Пользователь "${userName}" ...ID: ${generatedId}`);

      // ID，ПользовательID
      if (!this.generatedUserIds) {
        this.generatedUserIds = new Map();
      }

      if (this.generatedUserIds.has(userName)) {
        return this.generatedUserIds.get(userName);
      } else {
        this.generatedUserIds.set(userName, generatedId);
        return generatedId;
      }
    }

    loadContextMonitor() {
      // @ts-ignore
      if (window.ContextMonitor && window.contextMonitor) {
        // @ts-ignore
        this.contextMonitor = window.contextMonitor;
        console.log('[Message Renderer] ...');
        this.retryCount = 0; // ...
      } else if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.warn(`[Message Renderer] error，error (error${this.retryCount}error)`);
        setTimeout(() => {
          this.loadContextMonitor();
        }, 1000);
      } else {
        console.error('[Message Renderer] error，error');
        this.createFallbackContextMonitor();
      }
    }

    createFallbackContextMonitor() {
      console.warn('[Message Renderer] error');
      this.contextMonitor = {
        extractFromCurrentChat: async formatName => {
          console.warn('[Message Renderer] error，Назадerror');
          return {
            formatName: formatName,
            chatId: 'fallback',
            totalMessages: 0,
            extractedCount: 0,
            extractions: [],
            extractedAt: new Date(),
          };
        },
      };
    }

    /**
     * ...Друзья...Сообщения
     * @param {string|string[]} friendId - ДрузьяID，...ID...ID...
     */
    async extractMessagesForFriend(friendId) {
      if (!this.contextMonitor) {
        throw new Error('error');
      }

      try {
        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log('[Message Renderer] 🔥 ...，...');
        }

        // 🔥 ：ОтменитьДрузья
        this.buildFriendNameToIdMapping();

        // 🔥 ：，Сообщения
        // Сообщения
        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log('[Message Renderer] ...（...）');
        }

        // universalMessageСообщения
        // Сообщения，
        const result = await this.contextMonitor.extractFromCurrentChat('universalMessage');

        if (!result || !result.extractions) {
          console.warn('[Message Renderer] error，error');
          // ：
          return this.extractMessagesWithFallback(friendId);
        }

        let allExtractions = result.extractions;

        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log(`[Message Renderer] ... ${allExtractions.length} ...Сообщения`);
        }

        // ：Сообщения
        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log('[Message Renderer] ...:');
          allExtractions.forEach((msg, index) => {
            console.log(`Сообщения${index + 1}:`, {
              content: msg.content?.substring(0, 30) + '...',
              fullMatch: msg.fullMatch?.substring(0, 50) + '...',
              index: msg.index,
              globalIndex: msg.globalIndex,
              messageIndex: msg.messageIndex,
              originalMessageIndex: msg.originalMessageIndex,
            });
          });
        }

        // ДрузьяСообщения（）
        let friendMessages = [];

        allExtractions.forEach((msg, originalIndex) => {
          let msgIdentifier;

          if (msg.fullMatch && msg.fullMatch.startsWith('[...Сообщения')) {
            // Сообщения：[Сообщения|ID||Сообщения|Сообщения]
            // universalMessage，characterID，number
            if (msg.character && msg.number) {
              // universalMessage
              msgIdentifier = String(msg.character || ''); // ...ID
              msg.sender = msg.number; // ...
              msg.number = msg.character; // ...ID
            } else {
              // groupMessage
              msgIdentifier = String(msg.number || '');
            }
          } else if (msg.fullMatch && msg.fullMatch.startsWith('[...Сообщения')) {
            // Сообщения：[Сообщения||ID|Сообщения|Сообщения]
            if (msg.character && msg.number) {
              // universalMessage
              msgIdentifier = String(msg.character || ''); // ...ID
              msg.sender = '...'; // ...
              msg.number = msg.character; // ...ID
            } else {
              // myGroupMessage
              msgIdentifier = String(msg.number || '');
            }
          } else {
            // Сообщения
            msgIdentifier = String(msg.number || '');
          }

          // ：Сообщения
          if (
            window.DEBUG_MESSAGE_RENDERER &&
            msg.fullMatch &&
            (msg.fullMatch.startsWith('[...Сообщения') || msg.fullMatch.startsWith('[...Сообщения'))
          ) {
            console.log(`[Message Renderer] ...Сообщения...:`, {
              fullMatch: msg.fullMatch?.substring(0, 50) + '...',
              number: msg.number,
              sender: msg.sender,
              msgIdentifier: msgIdentifier,
              character: msg.character,
            });
          }

          // ДрузьяIDДрузьяID
          const targetIds = Array.isArray(friendId) ? friendId.map(String) : [String(friendId)];
          const isMatch = targetIds.includes(msgIdentifier);

          if (isMatch) {
            // ：
            if (window.DEBUG_MESSAGE_RENDERER) {
              console.log(
                `[Message Renderer] ...: ${msgIdentifier} ... [${targetIds.join(', ')}] ..., ...: ${
                  msg.globalIndex
                }, Сообщения: ${msg.fullMatch?.substring(0, 50)}...`,
              );
            }

            // Сообщения
            msg.originalIndex = originalIndex;
            friendMessages.push(msg);
          }
        });

        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log('...ДрузьяСообщения...:', friendMessages.length);
          console.log(
            '...Сообщения...:',
            friendMessages.map((msg, i) => ({
              index: i,
              globalIndex: msg.globalIndex,
              content: msg.content?.substring(0, 20) + '...',
              fullMatch: msg.fullMatch?.substring(0, 40) + '...',
            })),
          );
        }

        // 🔥 ：Сообщения，
        friendMessages.sort((a, b) => {
          // 🔥 globalIndex（）-
          // globalIndex Сообщения
          if (a.globalIndex !== undefined && b.globalIndex !== undefined) {
            return a.globalIndex - b.globalIndex;
          }

          // messageIndex（Сообщения）
          if (a.messageIndex !== undefined && b.messageIndex !== undefined) {
            return a.messageIndex - b.messageIndex;
          }

          // originalIndex（ allExtractions ）
          if (a.originalIndex !== undefined && b.originalIndex !== undefined) {
            return a.originalIndex - b.originalIndex;
          }

          // Время（）
          if (a.messageTimestamp && b.messageTimestamp) {
            const timeA = new Date(a.messageTimestamp).getTime();
            const timeB = new Date(b.messageTimestamp).getTime();
            if (timeA !== timeB) {
              return timeA - timeB;
            }
          }

          return 0;
        });
        console.log('[Message Renderer] ...，...');

        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log(
            '...Сообщения...:',
            friendMessages.map((msg, i) => ({
              index: i,
              globalIndex: msg.globalIndex,
              content: msg.content?.substring(0, 20) + '...',
              fullMatch: msg.fullMatch?.substring(0, 40) + '...',
            })),
          );
        }

        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log('...ДрузьяСообщения...:', friendMessages.length);
          console.log(
            '...Сообщения...:',
            friendMessages.map((msg, index) => ({
              ...: index,
              globalIndex: msg.globalIndex,
              content: msg.content?.substring(0, 30) + '...',
              fullMatch: msg.fullMatch?.substring(0, 50) + '...',
              isMyMessage: msg.fullMatch?.startsWith('[...Сообщения'),
              isGroupMessage: msg.fullMatch?.startsWith('[...Сообщения'),
              // 🔥 nameextra，
              originalMessageName: msg.originalMessageName,
              originalMessageExtra: msg.originalMessageExtra,
              originalMessageIndex: msg.originalMessageIndex,
              ...: Object.keys(msg),
            })),
          );
        }

        // 、Сообщения
        const myMessages = friendMessages.filter(msg => msg.fullMatch && msg.fullMatch.startsWith('[...Сообщения'));
        const otherMessages = friendMessages.filter(msg => msg.fullMatch && msg.fullMatch.startsWith('[...Сообщения'));
        const groupMessages = friendMessages.filter(
          msg => msg.fullMatch && (msg.fullMatch.startsWith('[...Сообщения') || msg.fullMatch.startsWith('[...Сообщения')),
        );

        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log(
            `[Message Renderer] ...：...Сообщения ${myMessages.length} ...，...Сообщения ${otherMessages.length} ...，...Сообщения ${groupMessages.length} ...`,
          );
        }

        return {
          myMessages: myMessages,
          otherMessages: otherMessages,
          groupMessages: groupMessages,
          allMessages: friendMessages,
        };
      } catch (error) {
        console.error('[Message Renderer] errorОтменитьerror:', error);
        throw error;
      }
    }

    /**
     * ...：...
     */
    async extractMessagesWithFallback(friendId) {
      console.log('[Message Renderer] ...');

      const extractionResults = [];
      const extractionTasks = [
        { name: 'myMessage', order: 1 },
        { name: 'otherMessage', order: 2 },
        { name: 'groupMessage', order: 3 },
        { name: 'myGroupMessage', order: 4 },
      ];

      // Сообщения
      for (const task of extractionTasks) {
        try {
          const result = await this.contextMonitor.extractFromCurrentChat(task.name);
          if (result && result.extractions) {
            result.extractions.forEach((msg, index) => {
              msg._extractionType = task.name;
              msg._extractionOrder = task.order;
              msg._typeIndex = index;
              msg._estimatedPosition = msg.index || 0;
              if (msg.globalIndex !== undefined) {
                msg._globalIndex = msg.globalIndex;
              }
              extractionResults.push(msg);
            });
          }
        } catch (e) {
          console.warn(`[Message Renderer] error ${task.name} error:`, e);
        }
      }

      // index
      extractionResults.sort((a, b) => {
        const aIndex = a.index || 0;
        const bIndex = b.index || 0;
        return aIndex - bIndex;
      });

      // ДрузьяСообщения
      let friendMessages = [];
      extractionResults.forEach((msg, originalIndex) => {
        let msgIdentifier;
        if (msg.fullMatch && (msg.fullMatch.startsWith('[...Сообщения') || msg.fullMatch.startsWith('[...Сообщения'))) {
          msgIdentifier = String(msg.number || '');
        } else {
          msgIdentifier = String(msg.number || '');
        }

        const targetIds = Array.isArray(friendId) ? friendId.map(String) : [String(friendId)];
        const isMatch = targetIds.includes(msgIdentifier);

        if (isMatch) {
          msg.originalIndex = originalIndex;
          friendMessages.push(msg);
        }
      });

      friendMessages.sort((a, b) => {
        if (a.globalIndex !== undefined && b.globalIndex !== undefined) {
          return a.globalIndex - b.globalIndex;
        }
        if (a.messageIndex !== undefined && b.messageIndex !== undefined) {
          return a.messageIndex - b.messageIndex;
        }
        if (a.originalIndex !== undefined && b.originalIndex !== undefined) {
          return a.originalIndex - b.originalIndex;
        }
        return 0;
      });

      const myMessages = friendMessages.filter(msg => msg.fullMatch && msg.fullMatch.startsWith('[...Сообщения'));
      const otherMessages = friendMessages.filter(msg => msg.fullMatch && msg.fullMatch.startsWith('[...Сообщения'));
      const groupMessages = friendMessages.filter(
        msg => msg.fullMatch && (msg.fullMatch.startsWith('[...Сообщения') || msg.fullMatch.startsWith('[...Сообщения')),
      );

      return {
        myMessages: myMessages,
        otherMessages: otherMessages,
        groupMessages: groupMessages,
        allMessages: friendMessages,
      };
    }

    /**
     * ...Сообщения/* Страница деталей */ - ...
     */
    async renderMessageDetail(friendId, friendName) {
      if (window.DEBUG_MESSAGE_RENDERER) {
        console.log(`[Message Renderer] ...Сообщения... (...): ${friendId}, ${friendName}`);
      }

      if (!this.contextMonitor) {
        console.error('[Message Renderer] error');
        return this.renderErrorMessageDetail(friendId, friendName, '...');
      }

      try {
        // Статус
        this.resetPagination();

        // Отменить
        const messageData = await this.extractMessagesForFriend(friendId);

        if (!messageData || messageData.allMessages.length === 0) {
          return this.renderEmptyMessageDetail(friendId, friendName);
        }

        const totalCount = messageData.allMessages.length;
        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log(`[Message Renderer] ... ${totalCount} ...Сообщения，...`);
        }

        if (totalCount > 100) {
          this.showPerformanceIndicator(`... (${totalCount}...Сообщения)`, 3000);
        }

        // - НовоеСообщения
        this.initReversePagination(messageData.allMessages);

        // НовоеСообщения（）
        const latestMessages = this.getLatestMessages();
        if (window.DEBUG_MESSAGE_RENDERER) {
          console.log(`[Message Renderer] ... ${latestMessages.length} ...НовоеСообщения`);
        }

        // ：НовоеСообщения
        if (window.DEBUG_MESSAGE_RENDERER && latestMessages.length > 0) {
          console.log('[Message Renderer] НовоеСообщения...:');
          console.log('...Сообщения:', latestMessages[0]?.content?.substring(0, 30) + '...');
          console.log(
            '...Сообщения:',
            latestMessages[latestMessages.length - 1]?.content?.substring(0, 30) + '...',
          );
          console.log('...Новое...Сообщения...');
        }

        const messagesHtml = this.renderMessagesBatch(latestMessages);

        this._lastRenderedMessageKeys = latestMessages.map(m => this.getMessageKey(m));
        this._lastRenderedMessageHashes = latestMessages.map(m => this.getMessageRenderHash(m));

        return `
                <div class="message-detail-app">
                    <div class="message-detail-content" id="message-detail-content" data-background-id="${friendId}">
                        <div class="messages-wrapper" id="messages-wrapper">
                            ${this.renderLoadOlderButton()}
                            <div class="messages-container" id="messages-container">
                                ${messagesHtml}
                            </div>
                        </div>
                    </div>
                    <div class="message-detail-footer">
                        <div class="message-stats">
                            ...Новое ${latestMessages.length}/${totalCount} ...Сообщения
                            (...: ${messageData.myMessages.length}, ...: ${messageData.otherMessages.length}, ...: ${
          messageData.groupMessages.length
        })
                        </div>
                        <div class="message-send-area">
                            <div class="send-input-container">
                                <textarea id="message-send-input" placeholder="...Сообщения..." maxlength="1000"></textarea>
                                <div class="send-tools">
                                    <button class="send-tool-btn" id="send-emoji-btn" title="..."><i class="fas fa-smile"></i></button>
                                    <button class="send-tool-btn" id="send-sticker-btn" title="..."><i class="fas fa-image"></i></button>
                                    <button class="send-tool-btn" id="send-voice-btn" title="..."><i class="fas fa-microphone"></i></button>
                                    <button class="send-tool-btn" id="send-redpack-btn" title="..."><i class="fas fa-gift"></i></button>
                                </div>
                            </div>
                            <button class="send-message-btn" id="send-message-btn"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            `;
      } catch (error) {
        console.error('[Message Renderer] errorСообщенияerror:', error);
        return this.renderErrorMessageDetail(friendId, friendName, error.message);
      }
    }

    /**
     * ...Статус
     */
    resetPagination() {
      this.pagination = {
        pageSize: 50,
        currentPage: 0,
        totalPages: 0,
        loadedMessages: [],
        isLoading: false,
      };
      this.virtualScrolling.startIndex = 0;
      this.virtualScrolling.endIndex = this.virtualScrolling.visibleCount;
    }

    /**
     * ...
     */
    initPagination(allMessages) {
      this.pagination.totalPages = Math.ceil(allMessages.length / this.pagination.pageSize);
      this.pagination.loadedMessages = [...allMessages]; // ...Сообщения...
      console.log(`[Message Renderer] ...: ${allMessages.length} ...Сообщения, ${this.pagination.totalPages} ...`);
    }

    /**
     * ... - ...НовоеСообщения...
     */
    initReversePagination(allMessages) {
      this.pagination.totalPages = Math.ceil(allMessages.length / this.pagination.pageSize);
      this.pagination.loadedMessages = [...allMessages]; // ...Сообщения...
      // （НовоеСообщения）
      this.pagination.currentPage = this.pagination.totalPages - 1;
      this.pagination.loadedPages = 1; // ...
      if (window.DEBUG_MESSAGE_RENDERER) {
        console.log(
          `[Message Renderer] ...: ${allMessages.length} ...Сообщения, ${this.pagination.totalPages} ..., ...${
            this.pagination.currentPage + 1
          }...`,
        );
      }

      // ：СообщенияВремя
      if (window.DEBUG_MESSAGE_RENDERER && allMessages.length > 0) {
        console.log('[Message Renderer] СообщенияВремя...:');
        console.log('...Сообщения:', allMessages[0]?.content?.substring(0, 30) + '...');
        console.log('...Сообщения:', allMessages[allMessages.length - 1]?.content?.substring(0, 30) + '...');
      }
    }

    /**
     * ...Сообщения
     */
    getPageMessages(pageIndex) {
      const startIndex = pageIndex * this.pagination.pageSize;
      const endIndex = Math.min(startIndex + this.pagination.pageSize, this.pagination.loadedMessages.length);
      return this.pagination.loadedMessages.slice(startIndex, endIndex);
    }

    /**
     * ...Новое...Сообщения（...）
     */
    getLatestMessages() {
      const totalMessages = this.pagination.loadedMessages.length;
      const startIndex = Math.max(0, totalMessages - this.pagination.pageSize);
      const latestMessages = this.pagination.loadedMessages.slice(startIndex);

      if (window.DEBUG_MESSAGE_RENDERER) {
        console.log(
          `[Message Renderer] ...НовоеСообщения: ...${totalMessages}, ...${startIndex}, ...${latestMessages.length}...`,
        );
        console.log(
          '[Message Renderer] НовоеСообщения...:',
          latestMessages.map((msg, i) => ({
            index: i,
            content: msg.content?.substring(0, 30) + '...',
            isLatest: i === latestMessages.length - 1,
          })),
        );
      }

      return latestMessages;
    }

    /**
     * ...Сообщения（...）
     */
    getOlderMessages() {
      const totalMessages = this.pagination.loadedMessages.length;
      const loadedPages = this.pagination.loadedPages || 1;
      const pageSize = this.pagination.pageSize;

      // Сообщения
      const endIndex = totalMessages - loadedPages * pageSize;
      const startIndex = Math.max(0, endIndex - pageSize);

      const olderMessages = this.pagination.loadedMessages.slice(startIndex, endIndex);

      console.log(
        `[Message Renderer] ...Сообщения: ...${totalMessages}, ...${startIndex}-${endIndex}, ...${olderMessages.length}...`,
      );
      console.log(
        '[Message Renderer] ...Сообщения...:',
        olderMessages.map((msg, i) => ({
          index: i,
          content: msg.content?.substring(0, 30) + '...',
          isOldest: i === 0,
        })),
      );

      return olderMessages;
    }

    /**
     * ...Сообщения - ...DOM...
     */
        /**
     * ...Сообщения - ...，... DOM ...
     */
    renderMessagesBatch(messages) {
      const cacheKey = this.generateCacheKey(messages);
      if (this.renderCache.has(cacheKey)) {
        return this.renderCache.get(cacheKey);
      }

      // （messages Время）
      const htmlArray = [];
      for (let i = 0; i < messages.length; i++) {
        htmlArray.push(this.renderSingleMessage(messages[i]));
      }
      const result = htmlArray.join('');

      this.renderCache.set(cacheKey, result);
      if (this.renderCache.size > 50) {
        const firstKey = this.renderCache.keys().next().value;
        this.renderCache.delete(firstKey);
      }
      return result;
    }

    // Сообщенияkey（）
    getMessageKey(message) {
      if (!message) return 'null';
      if (message.id !== undefined && message.id !== null) return `id:${message.id}`;
      if (message.messageIndex !== undefined && message.messageIndex !== null) return `mi:${message.messageIndex}`;
      if (message.globalIndex !== undefined && message.globalIndex !== null) return `gi:${message.globalIndex}`;
      if (message.textPosition !== undefined && message.textPosition !== null) return `tp:${message.textPosition}`;
      if (message.contextOrder !== undefined && message.contextOrder !== null) return `co:${message.contextOrder}`;
      if (message.fullMatch) return `fm:${this.simpleHash(String(message.fullMatch))}`;
      const raw = [message.messageType || '', message.sender || '', message.number || '', message.msgType || ''].join('|');
      return `h:${this.simpleHash(raw)}`;
    }

    // СообщенияПодпись（hash）
    getMessageRenderHash(message) {
      try {
        const raw = [
          message.messageType || '',
          message.sender || '',
          message.number || '',
          message.msgType || '',
          message.content || '',
          message.detailedContent || '',
          message.extra ? JSON.stringify(message.extra) : ''
        ].join('|');
        return String(this.simpleHash(raw));
      } catch (e) {
        return String(Date.now());
      }
    }

    // /（）
    incrementalUpdateMessages(container, newMessages) {
      if (!container) return;
      const oldLen = Array.isArray(this._lastRenderedMessageKeys) ? this._lastRenderedMessageKeys.length : 0;
      const newKeys = (newMessages || []).map(m => this.getMessageKey(m));
      const newHashes = (newMessages || []).map(m => this.getMessageRenderHash(m));

      // Если（Сообщения），
      const childrenLen = container.children ? container.children.length : 0;
      if (oldLen !== childrenLen) {
        container.innerHTML = this.renderMessagesBatch(newMessages);
        this._lastRenderedMessageKeys = newKeys;
        this._lastRenderedMessageHashes = newHashes;
        this.initLazyLoadingForNewMessages();
        return;
      }

      // （+）
      let prefix = 0;
      const minLen = Math.min(oldLen, newKeys.length);
      while (
        prefix < minLen &&
        this._lastRenderedMessageKeys[prefix] === newKeys[prefix] &&
        this._lastRenderedMessageHashes[prefix] === newHashes[prefix]
      ) {
        prefix++;
      }

      // ，
      if (prefix === oldLen && prefix === newKeys.length) return;

      let suffix = 0;
      while (
        suffix < (oldLen - prefix) &&
        suffix < (newKeys.length - prefix) &&
        this._lastRenderedMessageKeys[oldLen - 1 - suffix] === newKeys[newKeys.length - 1 - suffix] &&
        this._lastRenderedMessageHashes[oldLen - 1 - suffix] === newHashes[newHashes.length - 1 - suffix]
      ) {
        suffix++;
      }

      const mustRemove = oldLen - prefix - suffix; // ...
      const mustInsert = newKeys.length - prefix - suffix; // ...

      // Удалить（ prefix oldLen - suffix - 1）
      for (let r = 0; r < mustRemove; r++) {
        const nodeToRemove = container.children[prefix];
        if (nodeToRemove) container.removeChild(nodeToRemove);
      }

      // ：（），
      const anchorNode = suffix > 0 ? container.children[prefix] : null;
      if (mustInsert > 0) {
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.renderMessagesBatch(newMessages.slice(prefix, prefix + mustInsert));
        while (tempDiv.firstChild) fragment.appendChild(tempDiv.firstChild);
        if (anchorNode) {
          container.insertBefore(fragment, anchorNode);
        } else {
          container.appendChild(fragment);
        }
      }

      this._lastRenderedMessageKeys = newKeys;
      this._lastRenderedMessageHashes = newHashes;
      this.initLazyLoadingForNewMessages();

    // Сообщенияkey（）
    }
        generateCacheKey(messages) {
      if (!messages || messages.length === 0) return 'empty';
      const first = messages[0] || {};
      const last = messages[messages.length - 1] || {};
      const idPart = `${messages.length}_${first.messageIndex || 0}_${last.messageIndex || 0}`;
      // ，/
      const sig = this.simpleHash(
        messages
          .map(m => `${this.getMessageKey(m)}:${this.getMessageRenderHash(m)}`)
          .join('|')
      );
      return `${idPart}_${sig}`;
    }

    /**
     * ...Ещё...（...Сообщения）
     */
    renderLoadMoreButton() {
      if (this.pagination.currentPage >= this.pagination.totalPages - 1) {
        return ''; // ...ЕщёСообщения
      }

      return `
            <div class="load-more-container" style="text-align: center; padding: 20px;">
                <button id="load-more-messages-btn"
                        class="load-more-btn"
                        style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 20px; background: #f8f9fa; color: #333; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                    ...ЕщёСообщения (${this.pagination.currentPage + 1}/${this.pagination.totalPages})
                </button>
            </div>
        `;
    }

    /**
     * ...Сообщения...（...Сообщения）
     */
    renderLoadOlderButton() {
      const remainingPages = this.pagination.totalPages - (this.pagination.loadedPages || 1);

      if (remainingPages <= 0) {
        return ''; // ...Ещё...Сообщения
      }

      return `
            <div class="load-older-container" style="text-align: center; padding: 20px; background: linear-gradient(180deg, #f8f9fa 0%, rgba(248, 249, 250, 0.8) 50%, transparent 100%);">
                <button id="load-older-messages-btn"
                        class="load-older-btn"
                        style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 20px; background: #f8f9fa; color: #333; cursor: pointer; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    📜 ...Сообщения (...${remainingPages}...)
                </button>
            </div>
        `;
    }

    /**
     * ...Сообщения
     */
    renderSingleMessage(message) {
      // Сообщения
      const isMine = message.fullMatch && message.fullMatch.startsWith('[...Сообщения');
      const isGroupMessage =
        message.fullMatch &&
        (message.fullMatch.startsWith('[...Сообщения') || message.fullMatch.startsWith('[...Сообщения'));
      const isMyGroupMessage = message.fullMatch && message.fullMatch.startsWith('[...Сообщения');

      let messageClass = '';
      let senderName = '';

      if (isGroupMessage) {
        if (isMyGroupMessage) {
          // Сообщения
          messageClass = 'message-sent group-message';
          senderName = '...';
        } else {
          // Сообщения：
          // sender
          const senderInMessage = message.sender || '';
          const isMyGroupMessage = senderInMessage === '...';

          messageClass = isMyGroupMessage ? 'message-sent group-message' : 'message-received group-message';
          senderName = senderInMessage;
        }
      } else {
        // Сообщения
        messageClass = isMine ? 'message-sent' : 'message-received';
        senderName = message.character || '';
      }

      // 🔥 ： message.number ，Настройки
      // Сообщения，number ID
      // Сообщения，number ДрузьяID
      let friendId = message.number || '';
      const messageType = message.messageType || '';
      const content = message.content || '';

      // 🔥 ：ID
      if (!friendId && senderName) {
        if (this.friendNameToIdMap.size === 0 && this.groupNameToIdMap.size === 0) {
          this.buildFriendNameToIdMapping();
        }

        // Сообщения（），ID
        const mappedId = this.friendNameToIdMap.get(senderName);
        if (mappedId) {
          friendId = mappedId;
          console.log(`[Message Renderer] ... "${senderName}" ...ID: ${friendId}`);
        } else if (isGroupMessage) {
          // ЕслиСообщенияID，ID
          friendId = this.currentFriendId || '';
          console.log(`[Message Renderer] ...Сообщения... "${senderName}" ...ID，...ID: ${friendId}`);
        }
      }

      // 🔥 ：Сообщения，IDID
      if (isGroupMessage && senderName && senderName !== '...') {
        if (this.friendNameToIdMap.size === 0 && this.groupNameToIdMap.size === 0) {
          this.buildFriendNameToIdMapping();
        }

        const senderPersonalId = this.friendNameToIdMap.get(senderName);
        if (senderPersonalId) {
          friendId = senderPersonalId;
          if (window.DEBUG_MESSAGE_RENDERER) {
            console.log(`[Message Renderer] ...Сообщения... "${senderName}" ...ID: ${friendId}`);
          }
        } else {
          // ЕслиID，ID
          friendId = this.generateUserIdFromName(senderName);
          console.log(`[Message Renderer] ... "${senderName}" ...ID: ${friendId}`);
        }
      }

      // 🌟 ：Сообщения（）
      if (
        messageType === '...' ||
        content.includes('[...:') ||
        (message.detailedContent && message.detailedContent.includes('<img'))
      ) {
        const imageContent = message.detailedContent || content;

        // Сообщения
        if (!isMine && !isMyGroupMessage) {
          return `
                <div class="message-detail ${messageClass}" title="...Сообщения" data-friend-id="${friendId}">
                    <span class="message-sender">${senderName}</span>
                    <div class="message-body">
                        <div class="message-avatar" id="message-avatar-${friendId}">
                            ${this.getMessageAvatar(isMine || isMyGroupMessage, senderName)}
                        </div>
                        <div class="message-content">
                        <div class="message-meta">
                            <span class="message-type">...</span>
                            ${isGroupMessage ? '<span class="group-badge">...</span>' : ''}
                        </div>
                            <div class="image-message-content">
                                ${imageContent}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Сообщения
        return `
                <div class="message-detail ${messageClass}" title="...Сообщения" data-friend-id="${friendId}">
                    <div class="message-avatar" id="message-avatar-${friendId}">
                        ${this.getMessageAvatar(isMine || isMyGroupMessage, senderName)}
                    </div>
                    <div class="message-content">
                    <div class="message-meta">
                        <span class="message-sender">${senderName}</span>
                        <span class="message-type">...</span>
                        ${isGroupMessage ? '<span class="group-badge">...</span>' : ''}
                    </div>
                        <div class="image-message-content">
                            ${imageContent}
                        </div>
                    </div>
                </div>
            `;
      }

      // 🌟 ：Сообщения（）
      if (messageType === '...' && content) {
        let processedContent = content;

        // ，，img
        if (content.includes('...:') || message.fullMatch?.includes('...|...:')) {
          // 🌟 ：extra.image
          console.log(`[Message Renderer] 🔍 ...Сообщения:`, {
            content,
            fullMatch: message.fullMatch,
            extra: message.extra,
          });

          let imageUrl = null;

          // 🌟 1：Сообщенияextra.image（）
          if (message.originalMessageExtra && message.originalMessageExtra.image) {
            imageUrl = message.originalMessageExtra.image;
            console.log(`[Message Renderer] ✅ ...originalMessageExtra.image...:`, imageUrl);
          } else if (message.extra && message.extra.image) {
            imageUrl = message.extra.image;
            console.log(`[Message Renderer] ✅ ...extra.image...:`, imageUrl);
          } else {
            // 🌟 2：Сообщения，URL
            const imageRegex = /...:\s*([^|\]]+)/;
            const match = content.match(imageRegex) || (message.fullMatch && message.fullMatch.match(imageRegex));

            if (match) {
              const fileName = match[1].trim();
              console.log(`[Message Renderer] 🔍 ...Сообщения...:`, fileName);

              // Друзья（Сообщения，Друзья）
              let friendName = senderName;
              if (message.fullMatch) {
                const friendMatch = message.fullMatch.match(/\[...Сообщения\|([^|]+)\|/);
                if (friendMatch) {
                  friendName = friendMatch[1];
                }
              }

              // URL
              if (window.attachmentSender && typeof window.attachmentSender.buildImageUrl === 'function') {
                imageUrl = window.attachmentSender.buildImageUrl(friendName, fileName);
              } else {
                // ：，SillyTavern
                imageUrl = `${fileName}`;
              }

              console.log(`[Message Renderer] 🔍 ...URL:`, imageUrl);
            }
          }

          if (imageUrl) {
            // （）
            const displayFileName = imageUrl.split('/').pop() || 'image.png';

            // img - /* Адаптивный дизайн */
            processedContent = `<img src="${imageUrl}" alt="${displayFileName}" class="attachment-image" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px; margin: 4px; cursor: pointer; object-fit: contain;" onclick="this.style.transform=this.style.transform?'':'scale(2)'; setTimeout(()=>this.style.transform='', 3000);" title="...: ${displayFileName}" loading="lazy">`;

            console.log(`[Message Renderer] ✅ ...:`, {
              imageUrl,
              displayFileName,
              processedContent: processedContent.substring(0, 100) + '...',
            });
          } else {
            console.warn(`[Message Renderer] ⚠️ errorURL，error`);
          }
        }

        // Сообщения
        if (!isMine && !isMyGroupMessage) {
          return `
                <div class="message-detail ${messageClass}" title="...Сообщения" data-friend-id="${friendId}">
                    <span class="message-sender">${senderName}</span>
                    <div class="message-body">
                        <div class="message-avatar" id="message-avatar-${friendId}">
                            ${this.getMessageAvatar(isMine || isMyGroupMessage, senderName)}
                        </div>
                        <div class="message-content">
                        <div class="message-meta">
                            <span class="message-type">...</span>
                            ${isGroupMessage ? '<span class="group-badge">...</span>' : ''}
                        </div>
                            <div class="attachment-message-content">
                                ${processedContent}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Сообщения
        return `
                <div class="message-detail ${messageClass}" title="...Сообщения" data-friend-id="${friendId}">
                    <div class="message-avatar" id="message-avatar-${friendId}">
                        ${this.getMessageAvatar(isMine || isMyGroupMessage, senderName)}
                    </div>
                    <div class="message-content">
                    <div class="message-meta">
                        <span class="message-sender">${senderName}</span>
                        <span class="message-type">...</span>
                        ${isGroupMessage ? '<span class="group-badge">...</span>' : ''}
                    </div>
                        <div class="attachment-message-content">
                            ${processedContent}
                        </div>
                    </div>
                </div>
            `;
      }

      // 🌟 ：Сообщения
      if (messageType === '...' && content) {
        // Сообщения
        if (!isMine && !isMyGroupMessage) {
          return `
                <div class="message-detail ${messageClass}" title="..." data-friend-id="${friendId}">
                    <span class="message-sender">${senderName}</span>
                    <div class="message-body">
                        <div class="message-avatar" id="message-avatar-${friendId}">
                            ${this.getMessageAvatar(isMine || isMyGroupMessage, senderName)}
                        </div>
                        <div class="message-content">
                        <div class="message-meta">
                            <span class="message-type">${messageType}</span>
                            ${isGroupMessage ? '<span class="group-badge">...</span>' : ''}
                        </div>
                            <img src="${content}"
                                 data-filename="${content}"
                                 alt="${content}"
                                 class="qq-sticker-image lazy-load"
                                 style="max-width: 150px; max-height: 150px; border-radius: 8px; margin: 4px; cursor: pointer; background: #f0f0f0;"
                                 onclick="this.style.transform='scale(1.5)'; setTimeout(() => this.style.transform='scale(1)', 2000);"
                                 title="${content}"
                                 loading="lazy">
                        </div>
                    </div>
                </div>
            `;
        }

        // Сообщения
        return `
                <div class="message-detail ${messageClass}" title="..." data-friend-id="${friendId}">
                    <div class="message-avatar" id="message-avatar-${friendId}">
                        ${this.getMessageAvatar(isMine || isMyGroupMessage, senderName)}
                    </div>

                    <div class="message-content">
                    <div class="message-meta">
                        <span class="message-sender">${senderName}</span>
                        <span class="message-type">${messageType}</span>
                        ${isGroupMessage ? '<span class="group-badge">...</span>' : ''}
                    </div>
                        <img src="${content}"
                             data-filename="${content}"
                             alt="${content}"
                             class="qq-sticker-image lazy-load"
                             style="max-width: 150px; max-height: 150px; border-radius: 8px; margin: 4px; cursor: pointer; background: #f0f0f0;"
                             onclick="this.style.transform='scale(1.5)'; setTimeout(() => this.style.transform='scale(1)', 2000);"
                             title="${content}"
                             loading="lazy">
                    </div>
                </div>
            `;
      }

      // Сообщения，senderАватар
      if (!isMine && !isMyGroupMessage) {
        return `
            <div class="message-detail ${messageClass}" title="${messageType}" data-friend-id="${friendId}">
                <span class="message-sender">${senderName}</span>
                <div class="message-body">
                    <div class="message-avatar" id="message-avatar-${friendId}">
                        ${this.getMessageAvatar(isMine || isMyGroupMessage, senderName)}
                    </div>
                    <div class="message-content">
                        <div class="message-meta">
                            <span class="message-type">${messageType}</span>
                            ${isGroupMessage ? '<span class="group-badge">...</span>' : ''}
                        </div>
                        <div class="message-text">${content}</div>
                    </div>
                </div>
            </div>
        `;
      }

      // Сообщения
      return `
            <div class="message-detail ${messageClass}" title="${messageType}" data-friend-id="${friendId}">
                <div class="message-avatar" id="message-avatar-${friendId}">
                    ${this.getMessageAvatar(isMine || isMyGroupMessage, senderName)}
                </div>
                <div class="message-content">

                    <div class="message-meta">
                        <span class="message-sender">${senderName}</span>
                        <span class="message-type">${messageType}</span>
                        ${isGroupMessage ? '<span class="group-badge">...</span>' : ''}
                    </div>
                    <div class="message-text">${content}</div>
                </div>
            </div>
        `;
    }

    /**
     * ...Отменить...Аватар
     */
    getMessageAvatar(isMine, character) {
      if (isMine) {
        return ''; // ...Аватар
      } else {
        // Аватар
        const avatars = ['', '', '', '', '', '', '', '', '', '', '', '', ''];
        const index = (character.length + character.charCodeAt(0)) % avatars.length;
        return avatars[index];
      }
    }

    /**
     * ...СообщенияВремя
     */
    formatMessageTime(timestamp) {
      if (!timestamp) return '...Время';

      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

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
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }

    /**
     * ...Сообщения...
     */
    renderEmptyMessageDetail(friendId, friendName) {
      return `
            <div class="message-detail-app">
                <div class="message-detail-content" id="message-detail-content" data-background-id="${friendId}">
                    <div class="empty-messages">
                        <div class="empty-icon">💬</div>
                        <div class="empty-text">...Сообщения...</div>
                        <div class="empty-hint">...Сообщения...</div>
                    </div>
                </div>
                <div class="message-detail-footer">
                    <div class="message-stats">
                        ... 0 ...Сообщения (...: 0, ...: 0, ...: 0)
                    </div>
                    <div class="message-send-area">
                        <div class="send-input-container">
                            <textarea id="message-send-input" placeholder="...Сообщения..." maxlength="1000"></textarea>
                            <div class="send-tools">
                                <button class="send-tool-btn" id="send-emoji-btn" title="..."><i class="fas fa-smile"></i></button>
                                <button class="send-tool-btn" id="send-sticker-btn" title="..."><i class="fas fa-image"></i></button>
                                <button class="send-tool-btn" id="send-voice-btn" title="..."><i class="fas fa-microphone"></i></button>
                                <button class="send-tool-btn" id="send-redpack-btn" title="..."><i class="fas fa-gift"></i></button>
                            </div>
                        </div>
                        <button class="send-message-btn" id="send-message-btn"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * ...
     */
    renderErrorMessageDetail(friendId, friendName, errorMessage) {
      return `
            <div class="message-detail-app">
                <div class="message-detail-content" id="message-detail-content" data-background-id="${friendId}">
                    <div class="error-messages">
                        <div class="error-icon">⚠️</div>
                        <div class="error-text">...Сообщения...</div>
                        <div class="error-details">${errorMessage}</div>
                        <button class="retry-btn" onclick="window.messageRenderer.renderMessageDetail('${friendId}', '${friendName}')">
                            ...
                        </button>
                    </div>
                </div>
                <div class="message-detail-footer">
                    <div class="message-stats">
                        ...，...Сообщения
                    </div>
                    <div class="message-send-area">
                        <div class="send-input-container">
                            <textarea id="message-send-input" placeholder="...Сообщения..." maxlength="1000"></textarea>
                            <div class="send-tools">
                                <button class="send-tool-btn" id="send-emoji-btn" title="..."><i class="fas fa-smile"></i></button>
                                <button class="send-tool-btn" id="send-sticker-btn" title="..."><i class="fas fa-image"></i></button>
                                <button class="send-tool-btn" id="send-voice-btn" title="..."><i class="fas fa-microphone"></i></button>
                                <button class="send-tool-btn" id="send-redpack-btn" title="..."><i class="fas fa-gift"></i></button>
                            </div>
                        </div>
                        <button class="send-message-btn" id="send-message-btn"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * ...Сообщения/* Страница деталей */...
     */
    bindMessageDetailEvents() {
      const appContent = document.getElementById('app-content');
      if (!appContent) return;

      // Назад
      const backBtn = appContent.querySelector('#back-to-message-list');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          // НазадСообщения/* Список */
          if (window.messageApp) {
            window.messageApp.showMessageList();
          }
        });
      }

      // Обновить
      const refreshBtn = appContent.querySelector('#refresh-messages-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
          if (this.currentFriendId) {
            try {
              refreshBtn.innerHTML = '<span>⏳</span>';
              refreshBtn.disabled = true;

              // ДрузьяСообщения
              const friendName = this.getCurrentFriendName();
              const newContent = await this.renderMessageDetail(this.currentFriendId, friendName);
              appContent.innerHTML = newContent;
              this.bindMessageDetailEvents();
            } catch (error) {
              console.error('[Message Renderer] ОбновитьСообщенияerror:', error);
            }
          }
        });
      }

      // Сообщения
      this.bindLoadOlderEvent();

      this.initLazyLoading();

      // Сообщения（НовоеСообщения）
      const messageDetailContent = appContent.querySelector('.message-detail-content');
      if (messageDetailContent) {
        setTimeout(() => {
          messageDetailContent.scrollTop = messageDetailContent.scrollHeight;
          console.log('[Message Renderer] ...НовоеСообщения');
        }, 100);
      }

      this.bindSendEvents();
    }

    /**
     * ...
     */
    bindSendEvents() {
      const appContent = document.getElementById('app-content');
      if (!appContent) return;

      const sendInput = appContent.querySelector('#message-send-input');
      const sendButton = appContent.querySelector('#send-message-btn');
      const emojiBtn = appContent.querySelector('#send-emoji-btn');
      const stickerBtn = appContent.querySelector('#send-sticker-btn');
      const voiceBtn = appContent.querySelector('#send-voice-btn');
      const redpackBtn = appContent.querySelector('#send-redpack-btn');

      // MessageSender
      if (!window.messageSender) {
        console.warn('[Message Renderer] MessageSendererror，error');
        setTimeout(() => this.bindSendEvents(), 1000);
        return;
      }

      // Настройки
      if (this.currentFriendId) {
        const friendName = this.getCurrentFriendName();
        // @ts-ignore
        window.messageSender.setCurrentChat(this.currentFriendId, friendName, false);
      }

      // /* Поле ввода */
      if (sendInput) {
        sendInput.addEventListener('input', () => {
          // @ts-ignore
          window.messageSender.adjustTextareaHeight(sendInput);
        });

        sendInput.addEventListener('keydown', e => {
          // @ts-ignore
          window.messageSender.handleEnterSend(e, sendInput);
        });

        sendInput.addEventListener('input', () => {
          this.updateCharCount(sendInput);
        });
      }

      if (sendButton) {
        sendButton.addEventListener('click', async () => {
          if (sendInput) {
            // @ts-ignore
            const message = sendInput.value ? sendInput.value.trim() : '';
            if (message) {
              // @ts-ignore
              const success = await window.messageSender.sendMessage(message);
              if (success) {
                // @ts-ignore
                if (sendInput.value !== undefined) {
                  // @ts-ignore
                  sendInput.value = '';
                }
                // @ts-ignore
                window.messageSender.adjustTextareaHeight(sendInput);
                this.updateCharCount(sendInput);
                // ОбновитьСообщения/* Список */
                setTimeout(() => this.refreshCurrentMessages(), 1000);
              }
            }
          }
        });
      }

      if (emojiBtn) {
        emojiBtn.addEventListener('click', () => {
          this.showEmojiPanel();
        });
      }

      if (stickerBtn) {
        stickerBtn.addEventListener('click', () => {
          this.showStickerPanel();
        });
      }

      if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
          this.showVoicePanel();
        });
      }

      if (redpackBtn) {
        redpackBtn.addEventListener('click', () => {
          this.showRedpackPanel();
        });
      }
    }

    /**
     * ...
     */
    updateCharCount(inputElement) {
      const appContent = document.getElementById('app-content');
      if (!appContent) return;

      let charCountElement = appContent.querySelector('.char-count');
      if (!charCountElement) {
        charCountElement = document.createElement('div');
        charCountElement.className = 'char-count';
        const sendArea = appContent.querySelector('.message-send-area');
        if (sendArea) {
          sendArea.appendChild(charCountElement);
        }
      }

      const currentLength = inputElement.value.length;
      const maxLength = inputElement.maxLength || 1000;

      charCountElement.textContent = `${currentLength}/${maxLength}`;

      // Настройки
      if (currentLength > maxLength * 0.9) {
        charCountElement.className = 'char-count error';
      } else if (currentLength > maxLength * 0.7) {
        charCountElement.className = 'char-count warning';
      } else {
        charCountElement.className = 'char-count';
      }
    }

    /**
     * ...
     */
    showEmojiPanel() {
      const emojis = [
        '😀',
        '😃',
        '😄',
        '😁',
        '😆',
        '😅',
        '😂',
        '🤣',
        '😊',
        '😇',
        '🙂',
        '🙃',
        '😉',
        '😌',
        '😍',
        '🥰',
        '😘',
        '😗',
        '😙',
        '😚',
        '😋',
        '😛',
        '😝',
        '😜',
        '🤪',
        '🤨',
        '🧐',
        '🤓',
        '😎',
        '🤩',
        '🥳',
        '😏',
        '😒',
        '😞',
        '😔',
        '😟',
        '😕',
        '🙁',
        '☹️',
        '😣',
        '😖',
        '😫',
        '😩',
        '🥺',
        '😢',
        '😭',
        '😤',
        '😠',
        '😡',
        '🤬',
        '🤯',
        '😳',
        '🥵',
        '🥶',
        '😱',
        '😨',
        '😰',
        '😥',
        '😓',
        '🤗',
        '🤔',
        '🤭',
        '🤫',
        '🤥',
        '😶',
        '😐',
        '😑',
        '😬',
        '🙄',
        '😯',
        '😦',
        '😧',
        '😮',
        '😲',
        '🥱',
        '😴',
        '🤤',
        '😪',
        '😵',
        '🤐',
        '🥴',
        '🤢',
        '🤮',
        '🤧',
        '😷',
        '🤒',
        '🤕',
        '🤑',
        '🤠',
        '😈',
        '👿',
        '👹',
        '👺',
        '🤡',
        '💩',
        '👻',
        '💀',
        '☠️',
        '👽',
        '👾',
      ];

      const panel = document.createElement('div');
      panel.className = 'special-panel';
      panel.innerHTML = `
            <div class="special-panel-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3>...</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer;">✕</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 10px; max-height: 200px; overflow-y: auto;">
                    ${emojis
                      .map(
                        emoji => `
                        <button onclick="window.messageSender.insertSpecialFormat('emoji', {emoji: '${emoji}'}); this.parentElement.parentElement.parentElement.remove();"
                                style="background: none; border: 1px solid #ddd; border-radius: 8px; padding: 8px; cursor: pointer; font-size: 20px;">
                            ${emoji}
                        </button>
                    `,
                      )
                      .join('')}
                </div>
            </div>
        `;

      document.body.appendChild(panel);

      // 🔥 ：，
      console.log(`[Message Renderer] ...，... ${stickerImages.length} ...`);
      if (stickerImages.length > 0 && stickerImages[0].fullPath) {
        console.log('[Message Renderer] ...');
      } else {
        console.log('[Message Renderer] ...');
      }
    }

    /**
     * ...
     */
    async showStickerPanel() {
      console.log('[Message Renderer] ...');

      const existingPanel = document.getElementById('sticker-input-panel');
      if (existingPanel) {
        existingPanel.remove();
      }

      // 🔥 ：，
      const stickerImages = this.getCachedStickerImages();

      const panel = document.createElement('div');
      panel.id = 'sticker-input-panel';
      panel.className = 'special-panel';

      // 🔥 ：
      const stickerGrid = this.generateStickerGrid(stickerImages);

      panel.innerHTML = `
            <div class="special-panel-content" style="max-width: 500px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0; color: #333; font-size: 18px;">😄 ...</h3>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button id="refresh-sticker-btn" onclick="window.messageRenderer.refreshStickerConfig()"
                                style="background: #667eea; color: white; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px;"
                                title="...">
                            <i class="fas fa-sync-alt"></i> Обновить
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()"
                                style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 5px;">✕</button>
                    </div>
                </div>

                <div class="sticker-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); gap: 8px; max-height: 300px; overflow-y: auto; padding: 10px; background: #f8f9fa; border-radius: 12px;">
                    ${stickerGrid}
                </div>

                <div style="margin-top: 15px; text-align: center; font-size: 12px; color: #666;">
                    ...Сообщения...
                    <br><span class="sticker-status">
                        ${stickerImages.length > 0 && stickerImages[0].fullPath && stickerImages[0].fullPath !== stickerImages[0].filename ?
                          '<small style="color: #999;">✓ ...</small>' :
                          '<small style="color: #999;">...</small>'}
                    </span>
                </div>
            </div>
        `;

      document.body.appendChild(panel);

      // Закрыть
      panel.addEventListener('click', e => {
        if (e.target === panel) {
          panel.remove();
        }
      });
    }

    /**
     * ...
     */
    showVoicePanel() {
      const existingPanel = document.getElementById('voice-input-panel');
      if (existingPanel) {
        existingPanel.remove();
      }

      const panel = document.createElement('div');
      panel.id = 'voice-input-panel';
      panel.className = 'special-panel';
      panel.innerHTML = `
            <div class="special-panel-content" style="max-width: 400px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0; color: #333; font-size: 18px;">🎤 ...Сообщения</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 5px;">✕</button>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #555; font-weight: 500;">...：</label>
                    <textarea id="voice-content-input"
                             placeholder="...，...：..."
                             style="width: 100%; min-height: 80px; max-height: 150px; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical; font-family: inherit; line-height: 1.4; outline: none; transition: border-color 0.3s ease;"
                             maxlength="200"></textarea>
                    <div style="text-align: right; margin-top: 5px; font-size: 12px; color: #999;">
                        <span id="voice-char-count">0</span>/200 ...
                    </div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 6px; background: #f8f9fa; color: #333; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                        Отменить
                    </button>
                    <button id="voice-send-confirm-btn"
                            style="padding: 10px 20px; border: none; border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">
                        ...
                    </button>
                </div>
            </div>
        `;

      document.body.appendChild(panel);

      const input = document.getElementById('voice-content-input');
      const charCount = document.getElementById('voice-char-count');
      const sendBtn = document.getElementById('voice-send-confirm-btn');

      if (input && charCount) {
        input.addEventListener('input', () => {
          const count = input.value.length;
          charCount.textContent = count;

          if (count > 180) {
            charCount.style.color = '#dc3545';
          } else if (count > 140) {
            charCount.style.color = '#ffc107';
          } else {
            charCount.style.color = '#999';
          }
        });

        // （Ctrl+EnterShift+Enter）
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            sendBtn.click();
          }
        });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          this.insertVoiceMessage();
        });
      }

      // /* Поле ввода */
      setTimeout(() => {
        if (input) {
          input.focus();
        }
      }, 100);

      // Закрыть
      panel.addEventListener('click', e => {
        if (e.target === panel) {
          panel.remove();
        }
      });
    }

    /**
     * ...Сообщения.../* Поле ввода */
     */
    insertVoiceMessage() {
      const input = document.getElementById('voice-content-input');
      const panel = document.getElementById('voice-input-panel');

      if (!input) {
        console.error('error/* Поле ввода */');
        return;
      }

      const voiceContent = input.value.trim();
      if (!voiceContent) {
        // /* Поле ввода */
        input.style.borderColor = '#dc3545';
        input.placeholder = '...';
        setTimeout(() => {
          input.style.borderColor = '#ddd';
          input.placeholder = '...，...：...';
        }, 2000);
        return;
      }

      // /* Поле ввода */
      const appContent = document.getElementById('app-content');
      let targetInput = null;

      if (appContent) {
        // Сообщения/* Страница деталей *//* Поле ввода */
        targetInput =
          appContent.querySelector('#message-detail-input') || appContent.querySelector('#message-send-input');
      }

      if (!targetInput) {
        console.error('error/* Поле ввода */');
        this.showToast('.../* Поле ввода */，...Открыть...', 'error');
        return;
      }

      // Сообщения [Сообщения||ДрузьяID||]
      // IDСтатус
      let targetId = null;
      let isGroup = false;
      let groupName = '';

      // MessageSender ДрузьяIDСтатус
      if (window.messageSender && window.messageSender.currentFriendId) {
        targetId = window.messageSender.currentFriendId;
        isGroup = window.messageSender.isGroup || false;
        groupName = window.messageSender.currentFriendName || '';
      }

      // Если，
      if (!targetId) {
        // MessageApp
        if (window.messageApp && window.messageApp.currentFriendId) {
          targetId = window.messageApp.currentFriendId;
          isGroup = window.messageApp.isGroup || false;
          groupName = window.messageApp.currentFriendName || '';
        }
      }

      // Если，
      if (!targetId) {
        targetId = '223456'; // ...ДрузьяID
        console.warn('[Message Renderer] errorДрузьяID，error:', targetId);
      }

      // Сообщения -
      let voiceMessage;
      if (isGroup) {
        voiceMessage = `[...Сообщения|${targetId}|...|...|${voiceContent}]`;
      } else {
        voiceMessage = `[...Сообщения|...|${targetId}|...|${voiceContent}]`;
      }

      // /* Поле ввода */
      const currentValue = targetInput.value || '';
      const separator = currentValue ? '\n' : '';
      targetInput.value = currentValue + separator + voiceMessage;

      // ，
      const inputEvent = new Event('input', { bubbles: true });
      targetInput.dispatchEvent(inputEvent);

      // /* Поле ввода */
      targetInput.focus();

      // Закрыть
      if (panel) {
        panel.remove();
      }

      this.showToast('...Сообщения.../* Поле ввода */', 'success');

      console.log('...Сообщения...:', voiceMessage);
    }

    /**
     * 🔥 ...：...Сообщения.../* Поле ввода */ - ...
     */
    insertStickerMessage(filename, fullPath = null) {
      if (!filename) {
        console.error('error');
        return;
      }

      // 🔥 ：，
      if (!fullPath) {
        // Если，
        try {
          const stickerImages = this.getCachedStickerImages();
          const stickerData = stickerImages.find(sticker =>
            (sticker.filename === filename) ||
            (typeof sticker === 'string' && sticker === filename)
          );

          if (stickerData && stickerData.fullPath) {
            fullPath = stickerData.fullPath;
            console.log(`[Message Renderer] ...: ${filename} -> ${fullPath}`);
          } else {
            fullPath = filename;
            console.log(`[Message Renderer] ...，...: ${filename}`);
          }
        } catch (error) {
          console.warn('[Message Renderer] error，error:', error);
          fullPath = filename;
        }
      } else {
        console.log(`[Message Renderer] ...: ${filename} -> ${fullPath}`);
      }

      // /* Поле ввода */
      const appContent = document.getElementById('app-content');
      let targetInput = null;

      if (appContent) {
        // Сообщения/* Страница деталей *//* Поле ввода */
        targetInput =
          appContent.querySelector('#message-detail-input') || appContent.querySelector('#message-send-input');
      }

      if (!targetInput) {
        console.error('error/* Поле ввода */');
        this.showToast('.../* Поле ввода */，...Открыть...', 'error');
        return;
      }

      // IDСтатус
      let targetId = null;
      let isGroup = false;
      let groupName = '';

      // MessageSender ДрузьяIDСтатус
      if (window.messageSender && window.messageSender.currentFriendId) {
        targetId = window.messageSender.currentFriendId;
        isGroup = window.messageSender.isGroup || false;
        groupName = window.messageSender.currentFriendName || '';
      }

      // Если，
      if (!targetId) {
        // MessageApp
        if (window.messageApp && window.messageApp.currentFriendId) {
          targetId = window.messageApp.currentFriendId;
          isGroup = window.messageApp.isGroup || false;
          groupName = window.messageApp.currentFriendName || '';
        }
      }

      // Если，
      if (!targetId) {
        targetId = '223456'; // ...ДрузьяID
        console.warn('[Message Renderer] errorДрузьяID，error:', targetId);
      }

      // 🔥 ：Сообщения -
      let stickerMessage;
      if (isGroup) {
        stickerMessage = `[...Сообщения|${targetId}|...|...|${fullPath}]`;
      } else {
        stickerMessage = `[...Сообщения|...|${targetId}|...|${fullPath}]`;
      }

      console.log(`[Message Renderer] ...Сообщения: ${filename} -> ${fullPath}`);

      // /* Поле ввода */
      const currentValue = targetInput.value || '';
      const separator = currentValue ? '\n' : '';
      targetInput.value = currentValue + separator + stickerMessage;

      // ，
      const inputEvent = new Event('input', { bubbles: true });
      targetInput.dispatchEvent(inputEvent);

      // /* Поле ввода */
      targetInput.focus();

      // Закрыть
      const panel = document.getElementById('sticker-input-panel');
      if (panel) {
        panel.remove();
      }

      this.showToast('.../* Поле ввода */', 'success');

      console.log('...Сообщения...:', stickerMessage);
    }

    /**
     * 🔥 ...：...
     * ..."..."...，...，...
     */
    async getStickerImagesFromWorldInfo() {
      console.log('[Message Renderer] ...');

      try {
        // （）
        const allEntries = await this.getAllWorldInfoEntries();

        // 🔥 ：""
        const stickerDetailEntries = [];

        // 🔥 1：""
        const commentEntries = allEntries.filter(entry => {
          return entry.comment && entry.comment.includes('...');
        });
        stickerDetailEntries.push(...commentEntries);

        // 🔥 2：""（）
        const keywordEntries = allEntries.filter(entry => {
          if (stickerDetailEntries.includes(entry)) return false; // ...
          if (entry.key && Array.isArray(entry.key)) {
            return entry.key.some(k => k.includes('...'));
          }
          return false;
        });
        stickerDetailEntries.push(...keywordEntries);

        // 🔥 3：""（）
        const contentEntries = allEntries.filter(entry => {
          if (stickerDetailEntries.includes(entry)) return false; // ...
          return entry.content && entry.content.trim().startsWith('...');
        });
        stickerDetailEntries.push(...contentEntries);

        console.log(`[Message Renderer] ... ${stickerDetailEntries.length} ...:`);
        stickerDetailEntries.forEach((entry, index) => {
          console.log(`${index + 1}. "${entry.comment}" (...: ${entry.world})`);
        });

        if (stickerDetailEntries.length === 0) {
          console.warn('[Message Renderer] error"error"error，error/* Список */');
          console.log('[Message Renderer] Поиск...:', allEntries.length);
          console.log('[Message Renderer] ...:', allEntries.slice(0, 3).map(e => ({
            comment: e.comment,
            key: e.key,
            content: e.content ? e.content.substring(0, 50) + '...' : ''
          })));
          return this.getDefaultStickerImages();
        }

        // 🔥 ：
        const allStickerImages = [];

        for (let i = 0; i < stickerDetailEntries.length; i++) {
          const entry = stickerDetailEntries[i];
          console.log(`[Message Renderer] ... ${i + 1} ...: "${entry.comment}" (...: ${entry.world})`);

          try {
            const stickerImages = this.parseStickerDetails(entry.content);
            if (stickerImages.length > 0) {
              const imagesWithSource = stickerImages.map(img => ({
                ...img,
                source: entry.comment,
                world: entry.world
              }));
              allStickerImages.push(...imagesWithSource);
              console.log(`[Message Renderer] ..."${entry.comment}"... ${stickerImages.length} ...`);
            } else {
              console.warn(`[Message Renderer] error"${entry.comment}"error，error`);
            }
          } catch (error) {
            console.error(`[Message Renderer] error"${entry.comment}"error:`, error);
          }
        }

        if (allStickerImages.length === 0) {
          console.warn('[Message Renderer] error，error/* Список */');
          return this.getDefaultStickerImages();
        }

        console.log(`[Message Renderer] ... ${stickerDetailEntries.length} ... ${allStickerImages.length} ...`);
        return allStickerImages;

      } catch (error) {
        console.error('[Message Renderer] error:', error);
        return this.getDefaultStickerImages();
      }
    }

    /**
     * 🔥 ...：...
     */
    async getAllWorldInfoEntries() {
      const allEntries = [];

      try {
        // 🔥 ：SillyTavernAPI
        // 1. SillyTaverngetSortedEntries（）
        if (typeof window.getSortedEntries === 'function') {
          try {
            const entries = await window.getSortedEntries();
            allEntries.push(...entries);
            console.log(`[Message Renderer] ...getSortedEntries... ${entries.length} ...`);
            return allEntries; // Если...，...Назад
          } catch (error) {
            console.warn('[Message Renderer] getSortedEntrieserror:', error);
          }
        }

        // 2. ：
        console.log('[Message Renderer] ...');

        // 🔥 ： - DOM
        console.log('[Message Renderer] ......');
        console.log('[Message Renderer] window.selected_world_info:', window.selected_world_info);
        console.log('[Message Renderer] window.world_names:', window.world_names);

        // 🔥 ：1 - DOM
        const worldInfoSelect = document.getElementById('world_info');
        if (worldInfoSelect) {
          console.log('[Message Renderer] ...');

          const selectedOptions = Array.from(worldInfoSelect.selectedOptions);
          console.log(`[Message Renderer] ... ${selectedOptions.length} ...:`, selectedOptions.map(opt => opt.text));

          for (const option of selectedOptions) {
            const worldName = option.text;
            const worldIndex = option.value;

            try {
              console.log(`[Message Renderer] ...: ${worldName} (...: ${worldIndex})`);
              const worldData = await this.loadWorldInfoByName(worldName);
              if (worldData && worldData.entries) {
                const entries = Object.values(worldData.entries).map(entry => ({
                  ...entry,
                  world: worldName
                }));
                allEntries.push(...entries);
                console.log(`[Message Renderer] ..."${worldName}"... ${entries.length} ...`);
              } else {
                console.warn(`[Message Renderer] error"${worldName}"error`);
              }
            } catch (error) {
              console.warn(`[Message Renderer] error"${worldName}"error:`, error);
            }
          }
        } else {
          console.log('[Message Renderer] ... #world_info');
        }

        // 2： selected_world_info （）
        if (allEntries.length === 0 && typeof window.selected_world_info !== 'undefined' && Array.isArray(window.selected_world_info) && window.selected_world_info.length > 0) {
          console.log(`[Message Renderer] ...：... ${window.selected_world_info.length} ...:`, window.selected_world_info);

          for (const worldName of window.selected_world_info) {
            try {
              console.log(`[Message Renderer] ...: ${worldName}`);
              const worldData = await this.loadWorldInfoByName(worldName);
              if (worldData && worldData.entries) {
                const entries = Object.values(worldData.entries).map(entry => ({
                  ...entry,
                  world: worldName
                }));
                allEntries.push(...entries);
                console.log(`[Message Renderer] ..."${worldName}"... ${entries.length} ...`);
              }
            } catch (error) {
              console.warn(`[Message Renderer] error"${worldName}"error:`, error);
            }
          }
        }

        // 3： world_info.globalSelect （）
        if (allEntries.length === 0 && typeof window.world_info !== 'undefined' && window.world_info.globalSelect) {
          console.log('[Message Renderer] ...：... world_info.globalSelect ...:', window.world_info.globalSelect);

          for (const worldName of window.world_info.globalSelect) {
            try {
              const worldData = await this.loadWorldInfoByName(worldName);
              if (worldData && worldData.entries) {
                const entries = Object.values(worldData.entries).map(entry => ({
                  ...entry,
                  world: worldName
                }));
                allEntries.push(...entries);
                console.log(`[Message Renderer] ...world_info.globalSelect..."${worldName}"... ${entries.length} ...`);
              }
            } catch (error) {
              console.warn(`[Message Renderer] errorworld_info.globalSelecterror"${worldName}"error:`, error);
            }
          }
        }

        try {
          const characterEntries = await this.getCharacterWorldInfoEntries();
          allEntries.push(...characterEntries);
        } catch (error) {
          console.warn('[Message Renderer] error:', error);
        }

      } catch (error) {
        console.error('[Message Renderer] error:', error);
      }

      console.log(`[Message Renderer] ... ${allEntries.length} ...`);

      // 🔥 ：
      if (allEntries.length > 0) {
        console.log('[Message Renderer] ...:', allEntries.slice(0, 3).map(entry => ({
          comment: entry.comment,
          key: Array.isArray(entry.key) ? entry.key.join(', ') : entry.key,
          contentPreview: entry.content ? entry.content.substring(0, 50) + '...' : '...',
          world: entry.world || '...'
        })));
      }

      return allEntries;
    }

    /**
     * 🔥 ...：...
     */
    async loadWorldInfoByName(worldName) {
      try {
        // 🔥 ：SillyTavernloadWorldInfo
        if (typeof window.loadWorldInfo === 'function') {
          console.log(`[Message Renderer] ...loadWorldInfo...: ${worldName}`);
          return await window.loadWorldInfo(worldName);
        }

        // ：API（）
        console.log(`[Message Renderer] ...API...: ${worldName}`);

        const headers = {
          'Content-Type': 'application/json',
        };

        // ЕслиgetRequestHeaders，
        if (typeof window.getRequestHeaders === 'function') {
          Object.assign(headers, window.getRequestHeaders());
        }

        const response = await fetch('/api/worldinfo/get', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ name: worldName }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`[Message Renderer] ... "${worldName}":`, data);
          return data;
        } else {
          console.error(`[Message Renderer] error "${worldName}" error: ${response.status} ${response.statusText}`);
        }

      } catch (error) {
        console.error(`[Message Renderer] error "${worldName}" error:`, error);
      }

      return null;
    }

    /**
     * 🔥 ...：...
     */
    async getCharacterWorldInfoEntries() {
      const entries = [];

      try {
        // 🔥 ：SillyTavern
        let character = null;
        let characterId = null;

        // 1：SillyTavern.getContext()
        if (window.SillyTavern && typeof window.SillyTavern.getContext === 'function') {
          const context = window.SillyTavern.getContext();
          if (context && context.characters && context.characterId !== undefined) {
            character = context.characters[context.characterId];
            characterId = context.characterId;
          }
        }

        // 2：
        if (!character && typeof window.characters !== 'undefined' && typeof window.this_chid !== 'undefined') {
          character = window.characters[window.this_chid];
          characterId = window.this_chid;
        }

        if (!character) {
          console.log('[Message Renderer] ...');
          return entries;
        }

        console.log(`[Message Renderer] ...: ${character.name} (ID: ${characterId})`);

        const worldName = character.data?.extensions?.world;
        if (worldName) {
          console.log(`[Message Renderer] ...: ${worldName}`);
          const worldData = await this.loadWorldInfoByName(worldName);
          if (worldData && worldData.entries) {
            const worldEntries = Object.values(worldData.entries).map(entry => ({
              ...entry,
              world: worldName
            }));
            entries.push(...worldEntries);
            console.log(`[Message Renderer] ... ${worldEntries.length} ...`);
          }
        }

        // 🔥 ：
        if (typeof window.world_info !== 'undefined' && window.world_info.charLore) {
          const fileName = character.avatar || `${character.name}.png`;
          const extraCharLore = window.world_info.charLore.find(e => e.name === fileName);

          if (extraCharLore && Array.isArray(extraCharLore.extraBooks)) {
            console.log(`[Message Renderer] ...: ${extraCharLore.extraBooks.join(', ')}`);

            for (const extraWorldName of extraCharLore.extraBooks) {
              try {
                const worldData = await this.loadWorldInfoByName(extraWorldName);
                if (worldData && worldData.entries) {
                  const worldEntries = Object.values(worldData.entries).map(entry => ({
                    ...entry,
                    world: extraWorldName
                  }));
                  entries.push(...worldEntries);
                  console.log(`[Message Renderer] ..."${extraWorldName}"... ${worldEntries.length} ...`);
                }
              } catch (error) {
                console.warn(`[Message Renderer] error"${extraWorldName}"error:`, error);
              }
            }
          }
        }

      } catch (error) {
        console.error('[Message Renderer] error:', error);
      }

      return entries;
    }

    /**
     * 🔥 ...：...
     * ...：
     * 1. ...|...|...1,...2,...3
     * 2. JSON...：{"prefix": "...", "suffix": "...", "files": ["...1", "...2"]}
     * 3. .../* Список */：...1,...2,...3（...）
     */
    parseStickerDetails(content) {
      const stickerImages = [];

      try {
        console.log('[Message Renderer] ...:', content);

        // JSON
        if (content.trim().startsWith('{')) {
          const jsonData = JSON.parse(content);
          const prefix = jsonData.prefix || '';
          const suffix = jsonData.suffix || '';
          const files = jsonData.files || [];

          for (const filename of files) {
            const fullPath = prefix + filename + suffix;
            // 🔥 ：
            const fallbackPath = `data/default-user/extensions/mobile/images/${filename}`;

            stickerImages.push({
              filename: filename,
              fullPath: fullPath,
              displayName: filename,
              fallbackPath: fallbackPath,
              prefix: prefix,
              suffix: suffix
            });
          }

          console.log(`[Message Renderer] JSON...，... ${stickerImages.length} ...`);
          return stickerImages;
        }

        // ：||1,2,3
        if (content.includes('|')) {
          const parts = content.split('|');
          if (parts.length >= 3) {
            const prefix = parts[0].trim();
            const suffix = parts[1].trim();
            const filesStr = parts[2].trim();

            const files = filesStr.split(',').map(f => f.trim()).filter(f => f);

            for (const filename of files) {
              const fullPath = prefix + filename + suffix;
              // 🔥 ：
              const fallbackPath = `data/default-user/extensions/mobile/images/${filename}`;

              stickerImages.push({
                filename: filename,
                fullPath: fullPath,
                displayName: filename,
                fallbackPath: fallbackPath,
                prefix: prefix,
                suffix: suffix
              });
            }

            console.log(`[Message Renderer] ...，...: "${prefix}", ...: "${suffix}", ... ${stickerImages.length} ...`);
            return stickerImages;
          }
        }

        if (content.includes(',')) {
          const files = content.split(',').map(f => f.trim()).filter(f => f);
          const defaultPrefix = 'data/default-user/extensions/mobile/images/';
          const defaultSuffix = '';

          for (const filename of files) {
            const fullPath = defaultPrefix + filename + defaultSuffix;
            stickerImages.push({
              filename: filename,
              fullPath: fullPath,
              displayName: filename
            });
          }

          console.log(`[Message Renderer] ...，...，... ${stickerImages.length} ...`);
          return stickerImages;
        }

        // （）
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length > 0) {
          const defaultPrefix = 'data/default-user/extensions/mobile/images/';
          const defaultSuffix = '';

          for (const filename of lines) {
            const fullPath = defaultPrefix + filename + defaultSuffix;
            stickerImages.push({
              filename: filename,
              fullPath: fullPath,
              displayName: filename
            });
          }

          console.log(`[Message Renderer] ...，... ${stickerImages.length} ...`);
          return stickerImages;
        }

      } catch (error) {
        console.error('[Message Renderer] error:', error);
      }

      console.warn('[Message Renderer] error，Назадerror/* Список */');
      return stickerImages;
    }

    // /**
    // * 🔥 ：/* Список */
    //  */
    // getDefaultStickerImages() {
    //   const defaultFiles = [
    //     'zjlr8e.jpg',
    //     'emzckz.jpg',
    //     'ivtswg.jpg',
    //     'lgply8.jpg',
    //     'au4ay5.jpg',
    //     'qasebg.jpg',
    //     '5kqdkh.jpg',
    //     '8kvr4u.jpg',
    //     'aotnxp.jpg',
    //     'xigzwa.jpg',
    //     'y7px4h.jpg',
    //     'z2sxmv.jpg',
    //     's10h5m.jpg',
    //     'hoghwb.jpg',
    //     'kin0oj.jpg',
    //     'l9nqv0.jpg',
    //     'kv2ubl.gif',
    //     '6eyt6n.jpg',
    //   ];

    //   const defaultPrefix = 'data/default-user/extensions/mobile/images/';
    //   const defaultSuffix = '';

    //   return defaultFiles.map(filename => ({
    //     filename: filename,
    //     fullPath: defaultPrefix + filename + defaultSuffix,
    //     displayName: filename
    //   }));
    // }

    /**
     * 🔥 ...：...
     * ... window.messageRenderer.testStickerConfig() ...
     */
    async testStickerConfig() {
      console.log('=== ... ===');

      try {
        const allEntries = await this.getAllWorldInfoEntries();
        console.log(`✓ ... ${allEntries.length} ...`);

        const stickerDetailEntry = allEntries.find(entry => {
          if (entry.comment && entry.comment.includes('...')) return true;
          if (entry.key && Array.isArray(entry.key)) {
            if (entry.key.some(k => k.includes('...'))) return true;
          }
          if (entry.content && entry.content.trim().startsWith('...')) return true;
          return false;
        });

        if (stickerDetailEntry) {
          console.log('✓ ...:', {
            comment: stickerDetailEntry.comment,
            key: stickerDetailEntry.key,
            world: stickerDetailEntry.world
          });

          const stickerImages = this.parseStickerDetails(stickerDetailEntry.content);
          console.log(`✓ ... ${stickerImages.length} ...:`);
          stickerImages.forEach((sticker, index) => {
            console.log(`  ${index + 1}. ${sticker.displayName} -> ${sticker.fullPath}`);
          });

          if (stickerImages.length > 0) {
            console.log('✅ ...！');
            return { success: true, count: stickerImages.length, stickers: stickerImages };
          } else {
            console.log('❌ ...，...');
            return { success: false, error: '...' };
          }
        } else {
          console.log('❌ ...');
          console.log('💡 ..."..."..."sticker"');
          return { success: false, error: '...' };
        }

      } catch (error) {
        console.error('❌ error:', error);
        return { success: false, error: error.message };
      } finally {
        console.log('=== ... ===');
      }
    }

    /**
     * ...Сообщения
     */
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `send-status-toast ${type}`;
      toast.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                ${type === 'success' ? '...' : type === 'error' ? '...' : '...'}
            </div>
            <div style="font-size: 12px; opacity: 0.9;">
                ${message}
            </div>
        `;

      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }

    /**
     * ...
     */
    showRedpackPanel() {
      const existingPanel = document.getElementById('redpack-input-panel');
      if (existingPanel) {
        existingPanel.remove();
      }

      const panel = document.createElement('div');
      panel.id = 'redpack-input-panel';
      panel.className = 'special-panel';
      panel.innerHTML = `
            <div class="special-panel-content" style="max-width: 400px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0; color: #333; font-size: 18px;">🧧 ...</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 5px;">✕</button>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #555; font-weight: 500;">...：</label>
                    <input type="number" id="redpack-amount-input"
                           placeholder="...，...：88.88"
                           step="0.01" min="0.01" max="9999999"
                           style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.3s ease;" />
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px; font-size: 12px; color: #999;">
                        <span>...：0.01 - 9999999.00 ...</span>
                        <span id="redpack-amount-display">￥0.00</span>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #555; font-weight: 500;">...（...）：</label>
                    <input type="text" id="redpack-message-input"
                           placeholder="...，..."
                           maxlength="20"
                           style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.3s ease;" />
                    <div style="text-align: right; margin-top: 5px; font-size: 12px; color: #999;">
                        <span id="redpack-message-count">0</span>/20 ...
                    </div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()"
                            style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 6px; background: #f8f9fa; color: #333; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                        Отменить
                    </button>
                    <button id="redpack-send-confirm-btn"
                            style="padding: 10px 20px; border: none; border-radius: 6px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">
                        ...
                    </button>
                </div>
            </div>
        `;

      document.body.appendChild(panel);

      const amountInput = document.getElementById('redpack-amount-input');
      const messageInput = document.getElementById('redpack-message-input');
      const amountDisplay = document.getElementById('redpack-amount-display');
      const messageCount = document.getElementById('redpack-message-count');
      const sendBtn = document.getElementById('redpack-send-confirm-btn');

      if (amountInput && amountDisplay) {
        amountInput.addEventListener('input', () => {
          const amount = parseFloat(amountInput.value) || 0;
          amountDisplay.textContent = `￥${amount.toFixed(2)}`;

          if (amount > 9999999) {
            amountInput.style.borderColor = '#dc3545';
            amountDisplay.style.color = '#dc3545';
          } else if (amount < 0.01 && amount > 0) {
            amountInput.style.borderColor = '#ffc107';
            amountDisplay.style.color = '#ffc107';
          } else {
            amountInput.style.borderColor = '#ddd';
            amountDisplay.style.color = '#28a745';
          }
        });
      }

      if (messageInput && messageCount) {
        messageInput.addEventListener('input', () => {
          const count = messageInput.value.length;
          messageCount.textContent = count;

          if (count > 18) {
            messageCount.style.color = '#dc3545';
          } else if (count > 15) {
            messageCount.style.color = '#ffc107';
          } else {
            messageCount.style.color = '#999';
          }
        });
      }

      if (amountInput) {
        amountInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendBtn.click();
          }
        });
      }

      if (messageInput) {
        messageInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendBtn.click();
          }
        });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          this.insertRedpackMessage();
        });
      }

      // /* Поле ввода */
      setTimeout(() => {
        if (amountInput) {
          amountInput.focus();
        }
      }, 100);

      // Закрыть
      panel.addEventListener('click', e => {
        if (e.target === panel) {
          panel.remove();
        }
      });
    }

    /**
     * ...Сообщения.../* Поле ввода */
     */
    insertRedpackMessage() {
      const amountInput = document.getElementById('redpack-amount-input');
      const messageInput = document.getElementById('redpack-message-input');
      const panel = document.getElementById('redpack-input-panel');

      if (!amountInput) {
        console.error('error/* Поле ввода */');
        return;
      }

      const amount = parseFloat(amountInput.value);
      if (!amount || amount < 0.01 || amount > 9999999) {
        // /* Поле ввода */
        amountInput.style.borderColor = '#dc3545';
        amountInput.placeholder = '...0.01-9999999.00...';
        setTimeout(() => {
          amountInput.style.borderColor = '#ddd';
          amountInput.placeholder = '...，...：88.88';
        }, 2000);
        return;
      }

      const message = messageInput ? messageInput.value.trim() : '';
      const blessing = message || '...，...';

      // /* Поле ввода */
      const appContent = document.getElementById('app-content');
      let targetInput = null;

      if (appContent) {
        // Сообщения/* Страница деталей *//* Поле ввода */
        targetInput =
          appContent.querySelector('#message-detail-input') || appContent.querySelector('#message-send-input');
      }

      if (!targetInput) {
        console.error('error/* Поле ввода */');
        this.showToast('.../* Поле ввода */，...Открыть...', 'error');
        return;
      }

      // IDСтатус
      let targetId = null;
      let isGroup = false;
      let groupName = '';

      // MessageSender ДрузьяIDСтатус
      if (window.messageSender && window.messageSender.currentFriendId) {
        targetId = window.messageSender.currentFriendId;
        isGroup = window.messageSender.isGroup || false;
        groupName = window.messageSender.currentFriendName || '';
      }

      // Если，
      if (!targetId) {
        // MessageApp
        if (window.messageApp && window.messageApp.currentFriendId) {
          targetId = window.messageApp.currentFriendId;
          isGroup = window.messageApp.isGroup || false;
          groupName = window.messageApp.currentFriendName || '';
        }
      }

      // Если，
      if (!targetId) {
        targetId = '223456'; // ...ДрузьяID
        console.warn('[Message Renderer] errorДрузьяID，error:', targetId);
      }

      // Сообщения -
      let redpackMessage;
      if (isGroup) {
        redpackMessage = `[...Сообщения|${targetId}|...|...|${amount.toFixed(2)}]`;
      } else {
        redpackMessage = `[...Сообщения|...|${targetId}|...|${amount.toFixed(2)}]`;
      }

      // /* Поле ввода */
      const currentValue = targetInput.value || '';
      const separator = currentValue ? '\n' : '';
      targetInput.value = currentValue + separator + redpackMessage;

      // ，
      const inputEvent = new Event('input', { bubbles: true });
      targetInput.dispatchEvent(inputEvent);

      // /* Поле ввода */
      targetInput.focus();

      // Закрыть
      if (panel) {
        panel.remove();
      }

      this.showToast(`.../* Поле ввода */：￥${amount.toFixed(2)}`, 'success');

      console.log('...Сообщения...:', redpackMessage);
    }

    /**
     * ...ЕщёСообщения（...，...）
     */
    async loadMoreMessages() {
      if (this.pagination.isLoading || this.pagination.currentPage >= this.pagination.totalPages - 1) {
        return;
      }

      this.pagination.isLoading = true;
      const loadMoreBtn = document.getElementById('load-more-messages-btn');

      if (loadMoreBtn) {
        loadMoreBtn.textContent = 'Загрузка......';
        loadMoreBtn.disabled = true;
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 300));

        this.pagination.currentPage++;
        const newMessages = this.getPageMessages(this.pagination.currentPage);

        // СообщенияDOM
        await this.appendMessagesToContainer(newMessages);

        // Ещё
        this.updateLoadMoreButton();
      } catch (error) {
        console.error('[Message Renderer] errorЕщёСообщенияerror:', error);
      } finally {
        this.pagination.isLoading = false;
      }
    }

    /**
     * ...Сообщения（...）
     */
    async loadOlderMessages() {
      if (this.pagination.isLoading) {
        return;
      }

      // Сообщения
      const remainingPages = this.pagination.totalPages - (this.pagination.loadedPages || 1);
      if (remainingPages <= 0) {
        return;
      }

      this.pagination.isLoading = true;
      const loadOlderBtn = document.getElementById('load-older-messages-btn');
      const messageDetailContent = document.querySelector('.message-detail-content');
      const messagesContainer = document.getElementById('messages-container');

      if (loadOlderBtn) {
        loadOlderBtn.textContent = '⏳ Загрузка......';
        loadOlderBtn.disabled = true;
      }

      // Сообщения
      const oldScrollHeight = messageDetailContent ? messageDetailContent.scrollHeight : 0;
      const firstMessage = messagesContainer ? messagesContainer.firstElementChild : null;

      try {
        await new Promise(resolve => setTimeout(resolve, 300));

        // 🔥 ：Сообщения
        const olderMessages = this.getOlderMessages();

        if (olderMessages.length > 0) {
          // Сообщения
          await this.prependMessagesToContainer(olderMessages);

          this.pagination.loadedPages = (this.pagination.loadedPages || 1) + 1;

          // Сообщения
          this.updateLoadOlderButton();

          // （：）
          if (messageDetailContent && firstMessage) {
            const newScrollHeight = messageDetailContent.scrollHeight;
            const scrollOffset = newScrollHeight - oldScrollHeight;
            messageDetailContent.scrollTop = scrollOffset;
          }
        } else {
          console.log('[Message Renderer] ...Ещё...Сообщения...');
        }
      } catch (error) {
        console.error('[Message Renderer] errorСообщенияerror:', error);
      } finally {
        this.pagination.isLoading = false;
      }
    }

    /**
     * ...Сообщения...
     */
    async appendMessagesToContainer(newMessages) {
      const container = document.getElementById('messages-container');
      if (!container || newMessages.length === 0) return;

      // DocumentFragmentDOM
      const fragment = document.createDocumentFragment();
      const tempDiv = document.createElement('div');

      tempDiv.innerHTML = this.renderMessagesBatch(newMessages);

      // Сообщенияfragment
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }

      // DOM
      container.appendChild(fragment);

      this.initLazyLoadingForNewMessages();

      console.log(`[Message Renderer] ... ${newMessages.length} ...Сообщения...`);
    }

    /**
     * ...Сообщения...
     */
    async prependMessagesToContainer(olderMessages) {
      const container = document.getElementById('messages-container');
      if (!container || olderMessages.length === 0) return;

      // DocumentFragmentDOM
      const fragment = document.createDocumentFragment();
      const tempDiv = document.createElement('div');

      tempDiv.innerHTML = this.renderMessagesBatch(olderMessages);

      // Сообщенияfragment
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }

      // DOM
      container.insertBefore(fragment, container.firstChild);

      this.initLazyLoadingForNewMessages();

      console.log(`[Message Renderer] ... ${olderMessages.length} ...Сообщения...`);
    }

    /**
     * ...Ещё...
     */
    updateLoadMoreButton() {
      const loadMoreContainer = document.querySelector('.load-more-container');
      if (!loadMoreContainer) return;

      if (this.pagination.currentPage >= this.pagination.totalPages - 1) {
        // ЕщёСообщения，
        loadMoreContainer.innerHTML = `
                <div style="text-align: center; padding: 10px; color: #999; font-size: 12px;">
                    ...Сообщения
                </div>
            `;
      } else {
        loadMoreContainer.innerHTML = `
                <button id="load-more-messages-btn"
                        class="load-more-btn"
                        style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 20px; background: #f8f9fa; color: #333; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                    ...ЕщёСообщения (${this.pagination.currentPage + 1}/${this.pagination.totalPages})
                </button>
            `;

        this.bindLoadMoreEvent();
      }
    }

    /**
     * ...Сообщения...
     */
    updateLoadOlderButton() {
      const loadOlderContainer = document.querySelector('.load-older-container');
      if (!loadOlderContainer) return;

      const remainingPages = this.pagination.totalPages - (this.pagination.loadedPages || 1);

      if (remainingPages <= 0) {
        // ЕщёСообщения，
        loadOlderContainer.innerHTML = `
                <div style="text-align: center; padding: 10px; color: #999; font-size: 12px; background: linear-gradient(180deg, #f8f9fa 0%, rgba(248, 249, 250, 0.8) 50%, transparent 100%);">
                    📚 ...Сообщения
                </div>
            `;
      } else {
        loadOlderContainer.innerHTML = `
                <button id="load-older-messages-btn"
                        class="load-older-btn"
                        style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 20px; background: #f8f9fa; color: #333; cursor: pointer; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    📜 ...Сообщения (...${remainingPages}...)
                </button>
            `;

        this.bindLoadOlderEvent();
      }
    }

    /**
     * ...Ещё...
     */
    bindLoadMoreEvent() {
      const loadMoreBtn = document.getElementById('load-more-messages-btn');
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
          this.loadMoreMessages();
        });
      }
    }

    /**
     * ...Сообщения...
     */
    bindLoadOlderEvent() {
      const loadOlderBtn = document.getElementById('load-older-messages-btn');
      if (loadOlderBtn) {
        loadOlderBtn.addEventListener('click', () => {
          this.loadOlderMessages();
        });
      }
    }

    /**
     * ...
     */
    initLazyLoading() {
      // Intersection Observer
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                observer.unobserve(img);
              }
            });
          },
          {
            rootMargin: '50px 0px', // ...50px...
            threshold: 0.1,
          },
        );

        const lazyImages = document.querySelectorAll('.lazy-load');
        lazyImages.forEach(img => {
          imageObserver.observe(img);
        });

        // Сохранитьobserver
        this.imageObserver = imageObserver;
      } else {
        // ：
        const lazyImages = document.querySelectorAll('.lazy-load');
        lazyImages.forEach(img => this.loadImage(img));
      }
    }

    /**
     * 🔥 ...：... - ...
     */
    async loadImage(img) {
      let src = img.getAttribute('src');
      const filename = img.getAttribute('data-filename');

      if (!src) return;

      // 🔥 ：，
      if (filename && img.classList.contains('qq-sticker-image')) {
        const fullPath = await this.getStickerFullPath(filename);
        if (fullPath && fullPath !== filename) {
          src = fullPath;
          console.log(`[Message Renderer] ...: ${filename} -> ${src}`);
        }
      }

      // Статус
      img.classList.add('loading');

      const imageLoader = new Image();

      imageLoader.onload = () => {
        img.src = src;
        img.classList.remove('loading');
        img.classList.add('loaded');
        img.removeAttribute('src');
      };

      imageLoader.onerror = async () => {
        // 🔥 ：，
        img.classList.remove('loading');
        img.classList.add('error');

        // Если，
        if (filename && img.classList.contains('qq-sticker-image')) {
          const fallbackPath = await this.getStickerFallbackPath(filename);
          if (fallbackPath && fallbackPath !== src) {
            console.log(`[Message Renderer] ...: ${fallbackPath}`);

            const fallbackLoader = new Image();
            fallbackLoader.onload = () => {
              img.src = fallbackPath;
              img.classList.remove('error');
              img.classList.add('loaded');
              console.log(`[Message Renderer] ...: ${fallbackPath}`);
            };
            fallbackLoader.onerror = () => {
              img.style.background = '#f8d7da';
              img.alt = '...';
              console.warn(`[Message Renderer] error: ${filename}`);
            };
            fallbackLoader.src = fallbackPath;
            return;
          }
        }

        img.style.background = '#f8d7da';
        img.alt = '...';
      };

      imageLoader.src = src;
    }

    /**
     * 🔥 ...：...
     */
    async getStickerFullPath(filename) {
      try {
        // 🔥 ：
        if (!this._stickerConfigCache) {
          this._stickerConfigCache = await this.getStickerImagesFromWorldInfo();
          // НастройкиВремя（30）
          setTimeout(() => {
            this._stickerConfigCache = null;
          }, 30000);
        }

        const stickerImages = this._stickerConfigCache;

        const stickerData = stickerImages.find(sticker =>
          (sticker.filename === filename) ||
          (typeof sticker === 'string' && sticker === filename)
        );

        if (stickerData && stickerData.fullPath) {
          console.log(`[Message Renderer] ...: ${filename} -> ${stickerData.fullPath}`);
          return stickerData.fullPath;
        }

        // Если，
        const defaultPath = `data/default-user/extensions/mobile/images/${filename}`;
        console.log(`[Message Renderer] ...: ${filename} -> ${defaultPath}`);
        return defaultPath;

      } catch (error) {
        console.warn('[Message Renderer] error:', error);
        return `data/default-user/extensions/mobile/images/${filename}`;
      }
    }

    /**
     * 🔥 ...：...
     */
    async getStickerFallbackPath(filename) {
      try {
        // 🔥 ：
        if (!this._stickerConfigCache) {
          this._stickerConfigCache = await this.getStickerImagesFromWorldInfo();
          // НастройкиВремя（30）
          setTimeout(() => {
            this._stickerConfigCache = null;
          }, 30000);
        }

        const stickerImages = this._stickerConfigCache;

        const stickerData = stickerImages.find(sticker =>
          (sticker.filename === filename) ||
          (typeof sticker === 'string' && sticker === filename)
        );

        if (stickerData) {
          // 🔥 ：+
          if (stickerData.prefix && stickerData.suffix !== undefined) {
            const worldBookPath = stickerData.prefix + filename + stickerData.suffix;
            console.log(`[Message Renderer] ...: ${filename} -> ${worldBookPath}`);
            return worldBookPath;
          }

          // Если
          if (stickerData.fallbackPath) {
            return stickerData.fallbackPath;
          }
        }

        const defaultPath = `data/default-user/extensions/mobile/images/${filename}`;
        console.log(`[Message Renderer] ...: ${filename} -> ${defaultPath}`);
        return defaultPath;

      } catch (error) {
        console.warn('[Message Renderer] error:', error);
        return `data/default-user/extensions/mobile/images/${filename}`;
      }
    }

    /**
     * 🔥 ...：...
     */
    getCachedStickerImages() {
      try {
        // localStorage
        const cached = localStorage.getItem('stickerConfig_cache');
        if (cached) {
          const cacheData = JSON.parse(cached);
          const now = Date.now();

          // （30）
          if (cacheData.timestamp && (now - cacheData.timestamp) < 30 * 60 * 1000) {
            console.log(`[Message Renderer] ...，... ${cacheData.data.length} ...`);
            return cacheData.data;
          } else {
            console.log('[Message Renderer] ...');
            localStorage.removeItem('stickerConfig_cache');
          }
        }
      } catch (error) {
        console.warn('[Message Renderer] error:', error);
        localStorage.removeItem('stickerConfig_cache');
      }

      // ，Назад
      console.log('[Message Renderer] ...，...');
      return this.getDefaultStickerImages();
    }

    /**
     * 🔥 ...：...localStorage
     */
    cacheStickerImages(stickerImages) {
      try {
        const cacheData = {
          data: stickerImages,
          timestamp: Date.now()
        };
        localStorage.setItem('stickerConfig_cache', JSON.stringify(cacheData));
        console.log(`[Message Renderer] ...，... ${stickerImages.length} ...`);
      } catch (error) {
        console.warn('[Message Renderer] error:', error);
      }
    }

    /**
     * 🔥 ...：Обновить...（...）
     */
    async refreshStickerConfig() {
      console.log('[Message Renderer] ...Обновить......');

      // Статус
      const refreshBtn = document.getElementById('refresh-sticker-btn');
      const originalText = refreshBtn ? refreshBtn.innerHTML : '';
      if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка......';
        refreshBtn.disabled = true;
      }

      try {
        localStorage.removeItem('stickerConfig_cache');
        this._stickerConfigCache = null; // ...

        const stickerImages = await this.getStickerImagesFromWorldInfo();

        this.cacheStickerImages(stickerImages);

        this.updateStickerPanel(stickerImages);

        this.showToast('...Обновить', 'success');

      } catch (error) {
        console.error('[Message Renderer] Обновитьerror:', error);
        this.showToast('Обновить...，...', 'error');
      } finally {
        // Статус
        if (refreshBtn) {
          refreshBtn.innerHTML = originalText;
          refreshBtn.disabled = false;
        }
      }
    }

    /**
     * 🔥 ...：...
     */
    updateStickerPanel(stickerImages) {
      const panel = document.getElementById('sticker-input-panel');
      if (!panel) return;

      const stickerGrid = this.generateStickerGrid(stickerImages);

      const gridContainer = panel.querySelector('.sticker-grid-container');
      if (gridContainer) {
        gridContainer.innerHTML = stickerGrid;
      }

      // Статус
      const statusElement = panel.querySelector('.sticker-status');
      if (statusElement) {
        const statusText = stickerImages.length > 0 && stickerImages[0].fullPath && stickerImages[0].fullPath !== stickerImages[0].filename ?
          '✓ ...' : '...';
        statusElement.innerHTML = `<small style="color: #999;">${statusText}</small>`;
      }

      console.log(`[Message Renderer] ...，... ${stickerImages.length} ...`);
    }

    /**
     * 🔥 ...：...HTML
     */
    generateStickerGrid(stickerImages) {
      return stickerImages
        .map(
          stickerData => {
            // 🔥 ：，
            let fallbackPath;
            if (stickerData.fallbackPath) {
              // Если，
              fallbackPath = stickerData.fallbackPath;
            } else if (stickerData.prefix && stickerData.suffix !== undefined) {
              // Если，
              fallbackPath = stickerData.prefix + (stickerData.filename || stickerData) + stickerData.suffix;
            } else {
              fallbackPath = `data/default-user/extensions/mobile/images/${stickerData.filename || stickerData}`;
            }

            return `
            <div class="sticker-item" onclick="window.messageRenderer.insertStickerMessage('${stickerData.filename || stickerData}', '${stickerData.fullPath || stickerData}')"
                 style="cursor: pointer; padding: 4px; border: 2px solid transparent; border-radius: 8px; transition: all 0.3s ease;width:25%"
                 onmouseover="this.style.borderColor='#667eea'; this.style.transform='scale(1.1)'"
                 onmouseout="this.style.borderColor='transparent'; this.style.transform='scale(1)'"
                 title="${stickerData.displayName || stickerData}">
                <img src="${stickerData.fullPath || stickerData}"
                     alt="${stickerData.displayName || stickerData}"
                     style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px; display: block;"
                     loading="lazy"
                     >
            </div>
        `;
          }
        )
        .join('');
    }

    /**
     * ...Сообщения...
     */
    initLazyLoadingForNewMessages() {
      if (this.imageObserver) {
        const newLazyImages = document.querySelectorAll('.lazy-load:not(.loaded):not(.loading):not(.error)');
        newLazyImages.forEach(img => {
          this.imageObserver.observe(img);
        });
      }
    }

    /**
     * Обновить...Сообщения - ...
     */
    async refreshCurrentMessages() {
      if (!this.currentFriendId) return;

      try {
        const appContent = document.getElementById('app-content');
        if (!appContent) return;

        // НовоеСообщения
        const messageData = await this.extractMessagesForFriend(this.currentFriendId);

        this.initReversePagination(messageData.allMessages);

        // Сообщения，
        const messagesContainer = appContent.querySelector('.messages-container');
        if (messagesContainer && messageData.allMessages.length > 0) {
          // НовоеСообщения（）
          const latestMessages = this.getLatestMessages();
          this.incrementalUpdateMessages(messagesContainer, latestMessages);

          // Сообщения
          const loadOlderContainer = appContent.querySelector('.load-older-container');
          if (loadOlderContainer) {
            loadOlderContainer.innerHTML = this.renderLoadOlderButton();
            this.bindLoadOlderEvent();
          }

          // НовоеСообщения
          setTimeout(() => {
            const messageDetailContent = document.querySelector('.message-detail-content');
            if (messageDetailContent) {
              messageDetailContent.scrollTop = messageDetailContent.scrollHeight;
              console.log('[Message Renderer] ...НовоеСообщения');
            }
          }, 100);
        }

        const statsElement = appContent.querySelector('.message-stats');
        if (statsElement) {
          const totalCount = messageData.allMessages.length;
          const latestMessages = this.getLatestMessages();
          statsElement.textContent = `...Новое ${latestMessages.length}/${totalCount} ...Сообщения (...: ${messageData.myMessages.length}, ...: ${messageData.otherMessages.length}, ...: ${messageData.groupMessages.length})`;
        }
      } catch (error) {
        console.error('[Message Renderer] ОбновитьСообщенияerror:', error);
      }
    }

    /**
     * ...Друзья...
     */
    getCurrentFriendName() {
      if (window.friendRenderer && this.currentFriendId) {
        const friend = window.friendRenderer.getFriendById(this.currentFriendId);
        return friend ? friend.name : null;
      }
      return null;
    }

    /**
     * ...Отменить...
     */
    getMessageStats(friendId = null) {
      const targetId = friendId || this.currentFriendId;
      if (!targetId) return null;

      return {
        friendId: targetId,
        myMessagesCount: this.myMessages.length,
        otherMessagesCount: this.otherMessages.length,
        groupMessagesCount: this.groupMessages.length,
        totalCount: this.allMessages.length,
        lastMessageTime:
          this.allMessages.length > 0 ? this.allMessages[this.allMessages.length - 1].messageTimestamp : null,
      };
    }

    /**
     * ...
     */
    showPerformanceIndicator(message, duration = 2000) {
      let indicator = document.querySelector('.performance-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'performance-indicator';
        document.body.appendChild(indicator);
      }

      indicator.textContent = message;
      indicator.classList.add('show');

      setTimeout(() => {
        indicator.classList.remove('show');
      }, duration);
    }

    /**
     * ...
     */
    getPerformanceStats() {
      return {
        totalMessages: this.allMessages.length,
        loadedPages: this.pagination.currentPage + 1,
        totalPages: this.pagination.totalPages,
        cacheSize: this.renderCache.size,
        currentPageSize: this.pagination.pageSize,
        virtualScrolling: this.virtualScrolling,
        memoryUsage: performance.memory
          ? {
              used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
              total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB',
            }
          : '...',
      };
    }

    /**
     * ...
     */
    clearCache() {
      this.renderCache.clear();
      this.messageCache.clear();
      console.log('[Message Renderer] ...');
      this.showPerformanceIndicator('...', 1500);
    }

    /**
     * ...
     */
    debug() {
      console.group('[Message Renderer] ...');
      console.log('...ДрузьяID:', this.currentFriendId);
      console.log('...Сообщения...:', this.myMessages.length);
      console.log('...Сообщения...:', this.otherMessages.length);
      console.log('...Сообщения...:', this.groupMessages.length);
      console.log('...Сообщения...:', this.allMessages.length);
      console.log('...Статус:', !!this.contextMonitor);
      console.log('Друзья...:', this.friendNameToIdMap ? this.friendNameToIdMap.size : 0);
      console.log('...:', this.groupNameToIdMap ? this.groupNameToIdMap.size : 0);
      console.log('...:', this.getPerformanceStats());
      if (this.allMessages.length > 0) {
        console.log('Сообщения...:', this.allMessages[0]);
      }
      if (this.friendNameToIdMap && this.friendNameToIdMap.size > 0) {
        console.log('Друзья...:', Array.from(this.friendNameToIdMap.entries()));
      }
      if (this.groupNameToIdMap && this.groupNameToIdMap.size > 0) {
        console.log('...:', Array.from(this.groupNameToIdMap.entries()));
      }
      console.groupEnd();
    }
  };

  window.MessageRenderer = MessageRenderer;
  window.messageRenderer = new MessageRenderer();

  // message-app
  window.renderMessageDetailForFriend = async function (friendId, friendName) {
    if (!window.messageRenderer) {
      console.error('[Message Renderer] Сообщенияerror');
      return '<div>Сообщения...</div>';
    }

    return await window.messageRenderer.renderMessageDetail(friendId, friendName);
  };

  window.bindMessageDetailEvents = function () {
    if (window.messageRenderer) {
      window.messageRenderer.bindMessageDetailEvents();
    }
  };

  console.log('[Message Renderer] Сообщения...');
} // ... if (typeof window.MessageRenderer === 'undefined') ...
