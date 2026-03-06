/**
 * Friends Circle - Лента VK...
 * ...mobile-phone.js...Лента VK...，...QQ...Лента VK...
 */

if (typeof window.FriendsCircle === 'undefined') {
  /**
   * Лента VK...
   * ...Лента VK...、...
   */
  class FriendsCircleManager {
    constructor() {
      this.friendsCircleData = new Map(); // ...Лента VK...
      this.likesData = new Map(); // ...Лайк...
      this.lastProcessedMessageId = null;
      this.lastProcessedMessageIndex = -1; // ...Сообщения...

      // Лента VK - ，
      this.patterns = {
        // Лента VK：[Лента VK||ДрузьяID|wID|]
        textCircle: /\[Лента VK\|([^|\]]+)\|([^|\]]+)\|(w\d+)\|([^\]]+?)\]/g,
        // Лента VK（）：[Лента VK||ДрузьяID|sID||]
        visualCircle: /\[Лента VK\|([^|\]]+)\|([^|\]]+)\|(s\d+)\|([^|]+?)\|([^\]]+?)\]/g,
        // Лента VK（）：[Лента VK||ДрузьяID|sID|]
        visualCircleNoText: /\[Лента VK\|([^|\]]+)\|([^|\]]+)\|(s\d+)\|([^\]]+?)\]/g,
        // 🌟 ：ПользовательЛента VK（6）：[Лента VK||ДрузьяID|sID||]
        userVisualCircle: /\[Лента VK\|([^|\]]+)\|([^|\]]+)\|(s\d+)\|...:\s*([^|]+?)\|([^\]]+?)\]/g,
        // Лента VKОтветить
        circleReply: /\[Лента VKОтветить\|([^|\]]+)\|([^|\]]+)\|([ws]\d+)\|([^\]]+?)\]/g,
      };

      console.log('[Friends Circle] Лента VK...');
    }

    /**
     * ...Лента VK...
     * @param {string} content - ...
     * @returns {boolean} ...Лента VK...
     */
    isValidCircleContent(content) {
      if (!content || typeof content !== 'string') {
        return false;
      }

      // Лента VK
      const invalidPatterns = [
        /^\s*-\s*...:/, // ...
        /^\s*\|\s*...\s*\|/, // ...
        /^\s*\|\s*[^|]+\s*\|\s*[^|]+\s*\|/, // ...
        /...:/, // ...
        /^\s*<[^>]+>/, // HTML...
        /^\s*\[Друзьяid\|/, // ДрузьяID...
        /^\s*<UpdateVariable>/, // ...
        /^\s*<content>/, // content...
        /^\s*<apple>/, // apple...
      ];

      // Если，Назадfalse
      for (const pattern of invalidPatterns) {
        if (pattern.test(content)) {
          console.log(`[Friends Circle] ❌ ...，...: ${pattern}`, content.substring(0, 100));
          return false;
        }
      }

      // （）
      if (content.length > 1000) {
        console.log(`[Friends Circle] ❌ ...，...: ${content.length} ...`);
        return false;
      }

      return true;
    }

    /**
     * ...Лента VK...
     * @param {string} chatContent - ...
     * @param {number} startIndex - ...Сообщения...（...）
     * @returns {Map} ...Лента VK...
     */
    parseFriendsCircleData(chatContent, startIndex = 0) {
      const circles = new Map();

      if (!chatContent || typeof chatContent !== 'string') {
        return circles;
      }

      // Сообщения，Сообщения
      const messages = chatContent.split('\n');

      // Лента VK
      let match;
      this.patterns.textCircle.lastIndex = 0;
      while ((match = this.patterns.textCircle.exec(chatContent)) !== null) {
        const [, author, friendId, floorId, content] = match;

        // （）
        if (this.isValidCircleContent(content) && !circles.has(floorId)) {
          // Сообщения
          const messageIndex = this.findMessageIndex(messages, match[0], startIndex);

          const circleData = {
            id: floorId,
            author: author,
            friendId: friendId,
            type: 'text',
            content: content,
            messageIndex: messageIndex,
            latestActivityIndex: messageIndex,
            replies: [],
            likes: this.getLikeCount(floorId),
            isLiked: this.isLiked(floorId),
          };

          circles.set(floorId, circleData);
        }
      }

      // Лента VK（）
      this.patterns.visualCircle.lastIndex = 0;
      while ((match = this.patterns.visualCircle.exec(chatContent)) !== null) {
        const [, author, friendId, floorId, imageDescription, textContent] = match;

        if (
          this.isValidCircleContent(imageDescription) &&
          this.isValidCircleContent(textContent) &&
          !circles.has(floorId)
        ) {
          // Сообщения
          const messageIndex = this.findMessageIndex(messages, match[0], startIndex);

          // 🌟 1：SillyTavernСообщения
          const imageInfo = this.extractImageFromMessage(match[0], imageDescription, author);

          const circleData = {
            id: floorId,
            author: author,
            friendId: friendId,
            type: 'visual',
            imageDescription: imageDescription,
            imageUrl: imageInfo.imageUrl, // 🌟 ...URL
            imageFileName: imageInfo.fileName, // 🌟 ...
            content: textContent,
            messageIndex: messageIndex,
            latestActivityIndex: messageIndex,
            replies: [],
            likes: this.getLikeCount(floorId),
            isLiked: this.isLiked(floorId),
          };

          circles.set(floorId, circleData);
        }
      }

      // Лента VK（）
      this.patterns.visualCircleNoText.lastIndex = 0;
      while ((match = this.patterns.visualCircleNoText.exec(chatContent)) !== null) {
        const [, author, friendId, floorId, imageDescription] = match;

        // ，
        if (this.isValidCircleContent(imageDescription) && !circles.has(floorId)) {
          // Сообщения
          const messageIndex = this.findMessageIndex(messages, match[0], startIndex);

          // 🌟 1：SillyTavernСообщения
          const imageInfo = this.extractImageFromMessage(match[0], imageDescription, author);

          const circleData = {
            id: floorId,
            author: author,
            friendId: friendId,
            type: 'visual',
            imageDescription: imageDescription,
            imageUrl: imageInfo.imageUrl, // 🌟 ...URL
            imageFileName: imageInfo.fileName, // 🌟 ...
            content: '', // ...
            messageIndex: messageIndex,
            latestActivityIndex: messageIndex,
            replies: [],
            likes: this.getLikeCount(floorId),
            isLiked: this.isLiked(floorId),
          };

          circles.set(floorId, circleData);
        }
      }

      // 🌟 ：ПользовательЛента VK
      this.patterns.userVisualCircle.lastIndex = 0;
      while ((match = this.patterns.userVisualCircle.exec(chatContent)) !== null) {
        const [, author, friendId, floorId, fileName, textContent] = match;

        // ，
        if (this.isValidCircleContent(textContent) && !circles.has(floorId)) {
          // Сообщения
          const messageIndex = this.findMessageIndex(messages, match[0], startIndex);

          // 🌟 1：SillyTavernСообщения
          const imageInfo = this.extractImageFromMessage(match[0], fileName, author);

          const circleData = {
            id: floorId,
            author: author,
            friendId: friendId,
            type: 'visual',
            imageDescription: `...: ${fileName}`, // ...
            imageUrl: imageInfo.imageUrl, // 🌟 ...URL
            imageFileName: imageInfo.fileName || fileName, // 🌟 ...
            content: textContent,
            messageIndex: messageIndex,
            latestActivityIndex: messageIndex,
            replies: [],
            likes: this.getLikeCount(floorId),
            isLiked: this.isLiked(floorId),
          };

          circles.set(floorId, circleData);
        }
      }

      // Ответить
      this.patterns.circleReply.lastIndex = 0;
      while ((match = this.patterns.circleReply.exec(chatContent)) !== null) {
        const [, replyAuthor, replyFriendId, floorId, replyContent] = match;

        if (circles.has(floorId)) {
          const circle = circles.get(floorId);

          // Ответить（）
          const existingReply = circle.replies.find(r => r.author === replyAuthor && r.content === replyContent);

          if (!existingReply) {
            // ОтветитьСообщения
            const replyMessageIndex = this.findMessageIndex(messages, match[0], startIndex);

            circle.replies.push({
              id: `reply_${replyMessageIndex}_${Math.random().toString(36).substring(2, 11)}`,
              author: replyAuthor,
              friendId: replyFriendId,
              content: replyContent,
              messageIndex: replyMessageIndex,
              likes: 0,
              isLiked: false,
            });

            // Лента VKНовое（Ответить）
            circle.latestActivityIndex = Math.max(circle.latestActivityIndex, replyMessageIndex);

            console.log(`[Friends Circle] ✅ ...Ответить: ${replyAuthor} -> ${floorId} at index ${replyMessageIndex}`);
          }
        }
      }

      console.log(`[Friends Circle] ... ${circles.size} ...Лента VK`);
      return circles;
    }

    /**
     * 🌟 ...1：...SillyTavernСообщения...
     * @param {string} circleContent - Лента VK...
     * @param {string} fileName - ...
     * @param {string} author - ...
     * @returns {Object} ... {imageUrl, fileName}
     */
    extractImageFromMessage(circleContent, fileName, author) {
      try {
        // SillyTavern
        let chatMessages = null;

        // SillyTavern.getContext().chat
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            chatMessages = context.chat;
          }
        }

        // ：
        if (!chatMessages && window.chat && Array.isArray(window.chat)) {
          chatMessages = window.chat;
        }

        if (!chatMessages) {
          console.warn('[Friends Circle] errorSillyTavernerror');
          return { imageUrl: null, fileName: fileName };
        }

        // 🌟 ：Лента VKСообщения
        const targetMessage = chatMessages.find(message => {
          const content = message.mes || message.content || '';
          return content.includes(circleContent.trim());
        });

        if (!targetMessage) {
          console.warn('[Friends Circle] errorSillyTavernСообщения');
          return { imageUrl: null, fileName: fileName };
        }

        // 🌟 1：message.extra.imageURL
        if (targetMessage.extra && targetMessage.extra.image) {
          const imageUrl = targetMessage.extra.image;
          const realFileName = imageUrl.split('/').pop();

          return { imageUrl: imageUrl, fileName: realFileName };
        }

        // 🌟 2：detailedContent<img>
        if (targetMessage.detailedContent) {
          const imgMatch = targetMessage.detailedContent.match(/<img[^>]+src="([^"]+)"/);
          if (imgMatch) {
            const imageUrl = imgMatch[1];
            const realFileName = imageUrl.split('/').pop();

            return { imageUrl: imageUrl, fileName: realFileName };
          }
        }

        // 🌟 3：AttachmentSenderURL
        if (window.attachmentSender && typeof window.attachmentSender.buildImageUrl === 'function') {
          const imageUrl = window.attachmentSender.buildImageUrl(author, fileName);

          return { imageUrl: imageUrl, fileName: fileName };
        }

        console.warn('[Friends Circle] errorURL，error');
        return { imageUrl: null, fileName: fileName };
      } catch (error) {
        console.error('[Friends Circle] error:', error);
        return { imageUrl: null, fileName: fileName };
      }
    }

    /**
     * ...Сообщения...
     * @param {Array} messages - Сообщения...
     * @param {string} targetMessage - ...Сообщения...
     * @param {number} startIndex - ...Поиск...
     * @returns {number} Сообщения...
     */
    findMessageIndex(messages, targetMessage, startIndex = 0) {
      // Поиск，Сообщения
      for (let i = startIndex; i < messages.length; i++) {
        if (messages[i].includes(targetMessage)) {
          return i;
        }
      }

      // Если，Поиск（）
      for (let i = 0; i < startIndex; i++) {
        if (messages[i].includes(targetMessage)) {
          return i;
        }
      }

      // Если，НазадВремя
      return messages.length + (Math.floor(Date.now() / 1000) % 1000);
    }

    /**
     * ...Лента VK...（...）
     * @param {string} fullChatContent - ...
     * @param {number} lastProcessedIndex - ...Сообщения...
     * @returns {Map} ...Лента VK...
     */
    parseIncrementalData(fullChatContent, lastProcessedIndex) {
      const circles = new Map();
      const messages = fullChatContent.split('\n');

      console.log(`[Friends Circle] ...：...Сообщения... ${messages.length}，... ${lastProcessedIndex}`);

      // СообщенияЛента VK（Лента VKОпубликовать）
      for (let i = lastProcessedIndex; i < messages.length; i++) {
        const message = messages[i];

        // Лента VKОпубликовать
        const textMatch = this.patterns.textCircle.exec(message);
        if (textMatch) {
          const [, author, friendId, floorId, content] = textMatch;
          if (this.isValidCircleContent(content) && !circles.has(floorId)) {
            circles.set(floorId, {
              id: floorId,
              author: author,
              friendId: friendId,
              type: 'text',
              content: content,
              messageIndex: i,
              latestActivityIndex: i,
              replies: [],
              likes: this.getLikeCount(floorId),
              isLiked: this.isLiked(floorId),
            });
            console.log(`[Friends Circle] ...Лента VK: ${author} (${floorId}) at index ${i}`);
          }
        }

        this.patterns.textCircle.lastIndex = 0;

        // Лента VK（）
        const visualMatch = this.patterns.visualCircle.exec(message);
        if (visualMatch) {
          const [, author, friendId, floorId, imageDescription, textContent] = visualMatch;
          if (
            this.isValidCircleContent(imageDescription) &&
            this.isValidCircleContent(textContent) &&
            !circles.has(floorId)
          ) {
            circles.set(floorId, {
              id: floorId,
              author: author,
              friendId: friendId,
              type: 'visual',
              imageDescription: imageDescription,
              content: textContent,
              messageIndex: i,
              latestActivityIndex: i,
              replies: [],
              likes: this.getLikeCount(floorId),
              isLiked: this.isLiked(floorId),
            });
            console.log(`[Friends Circle] ...Лента VK: ${author} (${floorId}) at index ${i}`);
          }
        }

        this.patterns.visualCircle.lastIndex = 0;

        // Лента VK（）
        const visualNoTextMatch = this.patterns.visualCircleNoText.exec(message);
        if (visualNoTextMatch) {
          const [, author, friendId, floorId, imageDescription] = visualNoTextMatch;
          if (this.isValidCircleContent(imageDescription) && !circles.has(floorId)) {
            circles.set(floorId, {
              id: floorId,
              author: author,
              friendId: friendId,
              type: 'visual',
              imageDescription: imageDescription,
              content: '',
              messageIndex: i,
              latestActivityIndex: i,
              replies: [],
              likes: this.getLikeCount(floorId),
              isLiked: this.isLiked(floorId),
            });
            console.log(`[Friends Circle] ...Лента VK(...): ${author} (${floorId}) at index ${i}`);
          }
        }

        this.patterns.visualCircleNoText.lastIndex = 0;

        // 🌟 ：ПользовательЛента VK
        const userVisualMatch = this.patterns.userVisualCircle.exec(message);
        if (userVisualMatch) {
          const [, author, friendId, floorId, fileName, textContent] = userVisualMatch;
          if (this.isValidCircleContent(textContent) && !circles.has(floorId)) {
            circles.set(floorId, {
              id: floorId,
              author: author,
              friendId: friendId,
              type: 'visual',
              imageDescription: `...: ${fileName}`,
              content: textContent,
              messageIndex: i,
              latestActivityIndex: i,
              replies: [],
              likes: this.getLikeCount(floorId),
              isLiked: this.isLiked(floorId),
            });
            console.log(
              `[Friends Circle] ...Пользователь...Лента VK: ${author} (${floorId}) - ${fileName} at index ${i}`,
            );
          }
        }

        this.patterns.userVisualCircle.lastIndex = 0;
      }

      // Ответить（Лента VKОтветить）
      this.patterns.circleReply.lastIndex = 0;
      let replyMatch;
      while ((replyMatch = this.patterns.circleReply.exec(fullChatContent)) !== null) {
        const [, replyAuthor, replyFriendId, floorId, replyContent] = replyMatch;

        // ОтветитьСообщения
        const replyMessageIndex = this.findMessageIndex(messages, replyMatch[0], 0);

        // СообщенияОтветить
        if (replyMessageIndex >= lastProcessedIndex) {
          // Лента VKОтветить
          if (circles.has(floorId)) {
            const circle = circles.get(floorId);
            const existingReply = circle.replies.find(r => r.author === replyAuthor && r.content === replyContent);

            if (!existingReply) {
              circle.replies.push({
                id: `reply_${replyMessageIndex}_${Math.random().toString(36).substring(2, 11)}`,
                author: replyAuthor,
                friendId: replyFriendId,
                content: replyContent,
                messageIndex: replyMessageIndex,
                likes: 0,
                isLiked: false,
              });

              circle.latestActivityIndex = Math.max(circle.latestActivityIndex, replyMessageIndex);
              console.log(
                `[Friends Circle] ...Ответить: ${replyAuthor} -> ${floorId} at index ${replyMessageIndex}`,
              );
            }
          } else {
            // Лента VKОтветить，
            const updateKey = `update_${floorId}`;
            if (!circles.has(updateKey)) {
              circles.set(updateKey, {
                id: floorId,
                isUpdate: true, // ...
                newReplies: [],
                latestActivityIndex: replyMessageIndex,
              });
            }

            const updateEntry = circles.get(updateKey);
            updateEntry.newReplies.push({
              id: `reply_${replyMessageIndex}_${Math.random().toString(36).substring(2, 11)}`,
              author: replyAuthor,
              friendId: replyFriendId,
              content: replyContent,
              messageIndex: replyMessageIndex,
              likes: 0,
              isLiked: false,
            });

            updateEntry.latestActivityIndex = Math.max(updateEntry.latestActivityIndex, replyMessageIndex);
            console.log(
              `[Friends Circle] ...Лента VK...Ответить: ${replyAuthor} -> ${floorId} at index ${replyMessageIndex}`,
            );
          }
        }
      }

      console.log(`[Friends Circle] ...，... ${circles.size} .../...`);
      return circles;
    }

    /**
     * ...Лента VK...
     * @param {string} testContent - ...
     */
    testVisualCircleParsing(testContent) {
      console.log('[Friends Circle] ...Лента VK......');
      console.log('...:', testContent);

      // Лента VK
      this.patterns.textCircle.lastIndex = 0;
      let match;
      while ((match = this.patterns.textCircle.exec(testContent)) !== null) {
        const [, author, friendId, floorId, content] = match;
        console.log('...Лента VK...:', { author, friendId, floorId, content });
      }

      // Лента VK（）
      this.patterns.visualCircle.lastIndex = 0;
      while ((match = this.patterns.visualCircle.exec(testContent)) !== null) {
        const [, author, friendId, floorId, imageDescription, textContent] = match;
        console.log('...Лента VK...:', { author, friendId, floorId, imageDescription, textContent });
      }

      // Лента VK（）
      this.patterns.visualCircleNoText.lastIndex = 0;
      while ((match = this.patterns.visualCircleNoText.exec(testContent)) !== null) {
        const [, author, friendId, floorId, imageDescription] = match;
        console.log('...Лента VK(...)...:', { author, friendId, floorId, imageDescription });
      }

      // Ответить
      this.patterns.circleReply.lastIndex = 0;
      while ((match = this.patterns.circleReply.exec(testContent)) !== null) {
        const [, replyAuthor, replyFriendId, floorId, replyContent] = match;
        console.log('Лента VKОтветить...:', { replyAuthor, replyFriendId, floorId, replyContent });
      }
    }

    /**
     * ...Лента VK/* Список */
     * @returns {Array} ...Новое...Лента VK...
     */
    getSortedFriendsCircles() {
      const circles = Array.from(this.friendsCircleData.values());

      // Лента VKНовое（Ответить）
      const circlesWithActivity = circles.map(circle => {
        let latestActivityIndex = circle.latestActivityIndex || circle.messageIndex || 0;

        // Ответить，Новое
        if (circle.replies && circle.replies.length > 0) {
          circle.replies.forEach(reply => {
            if (reply.messageIndex && reply.messageIndex > latestActivityIndex) {
              latestActivityIndex = reply.messageIndex;
            }
          });
        }

        return {
          ...circle,
          latestActivityIndex: latestActivityIndex,
        };
      });

      // Новое（，）
      return circlesWithActivity.sort((a, b) => b.latestActivityIndex - a.latestActivityIndex);
    }

    /**
     * ...ЛайкСтатус
     * @param {string} circleId - Лента VKID
     * @returns {Object} Лайк...
     */
    toggleLike(circleId) {
      const currentLikes = this.getLikeCount(circleId);
      const isCurrentlyLiked = this.isLiked(circleId);

      if (isCurrentlyLiked) {
        this.likesData.set(circleId, { likes: currentLikes - 1, isLiked: false });
      } else {
        this.likesData.set(circleId, { likes: currentLikes + 1, isLiked: true });
      }

      // Лента VKЛайк
      if (this.friendsCircleData.has(circleId)) {
        const circle = this.friendsCircleData.get(circleId);
        const likeData = this.likesData.get(circleId);
        circle.likes = likeData.likes;
        circle.isLiked = likeData.isLiked;
      }

      return this.likesData.get(circleId);
    }

    /**
     * ...Лайк...
     * @param {string} circleId - Лента VKID
     * @returns {number} Лайк...
     */
    getLikeCount(circleId) {
      if (this.likesData.has(circleId)) {
        return this.likesData.get(circleId).likes;
      }
      // Лайк
      const initialLikes = Math.floor(Math.random() * 20) + 5;
      this.likesData.set(circleId, { likes: initialLikes, isLiked: false });
      return initialLikes;
    }

    /**
     * ...Лайк
     * @param {string} circleId - Лента VKID
     * @returns {boolean} ...Лайк
     */
    isLiked(circleId) {
      return this.likesData.get(circleId)?.isLiked || false;
    }

    /**
     * ...Лента VK...（...）
     * @param {Map} newCircles - ...Лента VK...
     * @param {boolean} isIncremental - ...
     */
    updateFriendsCircleData(newCircles, isIncremental = false) {
      if (isIncremental) {
        // ：
        let addedCount = 0;
        let updatedCount = 0;

        for (const [key, newData] of newCircles) {
          if (newData.isUpdate) {
            // ，Лента VKОтветить
            const circleId = newData.id;
            if (this.friendsCircleData.has(circleId)) {
              const existingCircle = this.friendsCircleData.get(circleId);
              const existingReplies = existingCircle.replies || [];

              // Ответить（）
              for (const newReply of newData.newReplies) {
                const exists = existingReplies.some(
                  r => r.author === newReply.author && r.content === newReply.content,
                );
                if (!exists) {
                  existingReplies.push(newReply);
                }
              }

              // Новое
              existingCircle.replies = existingReplies;
              existingCircle.latestActivityIndex = Math.max(
                existingCircle.latestActivityIndex || existingCircle.messageIndex,
                newData.latestActivityIndex,
              );

              updatedCount++;
              console.log(
                `[Friends Circle] ...Лента VK ${circleId} ...Ответить，... ${newData.newReplies.length} ...Ответить`,
              );
            }
          } else {
            // Лента VKЛента VKОтветить
            const circleId = newData.id;
            if (this.friendsCircleData.has(circleId)) {
              // Лента VK，Ответить
              const existingCircle = this.friendsCircleData.get(circleId);
              const existingReplies = existingCircle.replies || [];
              const newReplies = newData.replies || [];

              for (const newReply of newReplies) {
                const exists = existingReplies.some(
                  r => r.author === newReply.author && r.content === newReply.content,
                );
                if (!exists) {
                  existingReplies.push(newReply);
                }
              }

              // Новое
              existingCircle.replies = existingReplies;
              existingCircle.latestActivityIndex = Math.max(
                existingCircle.latestActivityIndex || existingCircle.messageIndex,
                newData.latestActivityIndex || newData.messageIndex,
              );

              updatedCount++;
            } else {
              // Лента VK，
              this.friendsCircleData.set(circleId, newData);
              addedCount++;
            }
          }
        }

        console.log(
          `[Friends Circle] ...：... ${addedCount} ...，... ${updatedCount} ...，... ${this.friendsCircleData.size} ...`,
        );
      } else {
        // ：
        this.friendsCircleData = newCircles;
        console.log(`[Friends Circle] ...，... ${newCircles.size} ...`);
      }
    }

    /**
     * ОбновитьЛента VK...（...）
     * @param {boolean} forceFullRefresh - ...Обновить
     */
    async refreshData(forceFullRefresh = false) {
      try {
        const chatContent = await this.getChatContent();

        if (!chatContent) {
          console.log('[Friends Circle] ...，...Обновить');
          return;
        }

        const messages = chatContent.split('\n');
        const currentMessageCount = messages.length;

        const shouldUseIncremental =
          !forceFullRefresh &&
          this.lastProcessedMessageIndex >= 0 &&
          currentMessageCount > this.lastProcessedMessageIndex &&
          this.friendsCircleData.size > 0; // ...

        if (shouldUseIncremental) {
          // ：Сообщения
          console.log(
            `[Friends Circle] ...：...Сообщения... ${this.lastProcessedMessageIndex} ... ${currentMessageCount}`,
          );

          const newCircles = this.parseIncrementalData(chatContent, this.lastProcessedMessageIndex);

          if (newCircles.size > 0) {
            this.updateFriendsCircleData(newCircles, true);
            console.log(`[Friends Circle] ...，... ${newCircles.size} .../...`);
          } else {
            console.log('[Friends Circle] ...：...Лента VK...');
          }
        } else {
          // ：Сообщения
          console.log('[Friends Circle] ...');

          // Лента VK
          const newCircles = this.parseFriendsCircleData(chatContent, 0);

          this.updateFriendsCircleData(newCircles, false);
        }

        // Сообщения
        this.lastProcessedMessageIndex = currentMessageCount;

        console.log('[Friends Circle] ...Обновить...');
      } catch (error) {
        console.error('[Friends Circle] Обновитьerror:', error);
      }
    }

    /**
     * ...（...Обновить）
     */
    async getChatContent() {
      try {
        // 1: SillyTavern.getContext
        if (window.SillyTavern?.getContext) {
          const context = window.SillyTavern.getContext();
          if (context?.chat && Array.isArray(context.chat)) {
            return context.chat.map(msg => msg.mes || '').join('\n');
          }
        }

        // 2: chat
        if (window.parent?.chat && Array.isArray(window.parent.chat)) {
          return window.parent.chat.map(msg => msg.mes || '').join('\n');
        }

        // 3: contextMonitor
        if (window.contextMonitor?.getCurrentChatMessages) {
          const chatData = await window.contextMonitor.getCurrentChatMessages();
          if (chatData?.messages) {
            return chatData.messages.map(msg => msg.mes || '').join('\n');
          }
        }

        return '';
      } catch (error) {
        console.error('[Friends Circle] error:', error);
        return '';
      }
    }
  }

  /**
   * Лента VK...
   * ...live-app...
   */
  class FriendsCircleEventListener {
    constructor(friendsCircle) {
      this.friendsCircle = friendsCircle;
      this.isListening = false;
      this.lastMessageCount = 0;
      this.pollingInterval = null;
      this.messageReceivedHandler = this.onMessageReceived.bind(this);
    }

    /**
     * ...SillyTavern...
     */
    startListening() {
      if (this.isListening) {
        console.log('[Friends Circle] ...');
        return;
      }

      console.log('[Friends Circle] ...Настройки......');
      let eventListenerSet = false;

      try {
        // 1: SillyTavern.getContext().eventSource（iframeРекомендации）
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.eventSource && typeof context.eventSource.on === 'function' && context.event_types) {
            console.log('[Friends Circle] ...SillyTavern.getContext().eventSource...MESSAGE_RECEIVED...');
            context.eventSource.on(context.event_types.MESSAGE_RECEIVED, this.messageReceivedHandler);
            this.isListening = true;
            eventListenerSet = true;
            console.log('[Friends Circle] ✅ ...SillyTavernСообщения... (context.eventSource)');
            this.updateMessageCount();
            return;
          }
        }

        // 2: eventOn（）
        if (typeof eventOn === 'function' && typeof tavern_events !== 'undefined' && tavern_events.MESSAGE_RECEIVED) {
          console.log('[Friends Circle] ...eventOn...MESSAGE_RECEIVED...');
          eventOn(tavern_events.MESSAGE_RECEIVED, this.messageReceivedHandler);
          this.isListening = true;
          eventListenerSet = true;
          console.log('[Friends Circle] ✅ ...SillyTavernСообщения... (eventOn)');
          this.updateMessageCount();
          return;
        }

        // 3:
        if (typeof window.parent !== 'undefined' && window.parent !== window) {
          try {
            const parentEventSource = window.parent.eventSource;
            const parentEventTypes = window.parent.event_types;
            if (parentEventSource && parentEventTypes && parentEventTypes.MESSAGE_RECEIVED) {
              console.log('[Friends Circle] ...MESSAGE_RECEIVED...');
              parentEventSource.on(parentEventTypes.MESSAGE_RECEIVED, this.messageReceivedHandler);
              this.isListening = true;
              eventListenerSet = true;
              console.log('[Friends Circle] ✅ ...SillyTavernСообщения... (parent)');
              this.updateMessageCount();
              return;
            }
          } catch (parentError) {
            console.warn('[Friends Circle] error:', parentError);
          }
        }

        // 4: window.eventSource
        if (typeof window.eventSource !== 'undefined' && typeof window.event_types !== 'undefined') {
          try {
            if (window.eventSource.on && window.event_types.MESSAGE_RECEIVED) {
              console.log('[Friends Circle] ...window.eventSource...MESSAGE_RECEIVED...');
              window.eventSource.on(window.event_types.MESSAGE_RECEIVED, this.messageReceivedHandler);
              this.isListening = true;
              eventListenerSet = true;
              console.log('[Friends Circle] ✅ ...SillyTavernСообщения... (window.eventSource)');
              this.updateMessageCount();
              return;
            }
          } catch (windowError) {
            console.warn('[Friends Circle] errorwindow.eventSource:', windowError);
          }
        }
      } catch (error) {
        console.error('[Friends Circle] Настройкиerror:', error);
      }

      // Если，
      if (!eventListenerSet) {
        console.warn('[Friends Circle] errorSillyTavernerror，error');
        this.startPolling();
      }
    }

    /**
     * ...Сообщения...
     * @param {number} messageId - СообщенияID
     */
    async onMessageReceived(messageId) {
      try {
        console.log(`[Friends Circle] ...MESSAGE_RECEIVED...: ${messageId}`);

        // Сообщения
        const currentMessageCount = this.getCurrentMessageCount();
        console.log(
          `[Friends Circle] Сообщения...: ...=${currentMessageCount}, ...=${this.lastMessageCount}, messageId=${messageId}`,
        );

        if (currentMessageCount <= this.lastMessageCount) {
          console.log('[Friends Circle] Сообщения...，...');
          console.log('[Friends Circle] ...: ...Сообщения...Назад...');

          // Сообщения
          if (window.SillyTavern?.getContext) {
            const context = window.SillyTavern.getContext();
            console.log('[Friends Circle] SillyTavern context.chat.length:', context?.chat?.length);
          }

          // Сообщения，Обновить（）
          console.log('[Friends Circle] ...Обновить...');
          if (this.friendsCircle) {
            await this.friendsCircle.manager.refreshData();

            // ЕслиОбновить，Сообщения
            const newCount = this.getCurrentMessageCount();
            if (newCount > this.lastMessageCount) {
              console.log(`[Friends Circle] ...Обновить...Сообщения: ${this.lastMessageCount} → ${newCount}`);
              this.lastMessageCount = newCount;
            }
          }
          return;
        }

        console.log(
          `[Friends Circle] ✅ ...Сообщения，Сообщения... ${this.lastMessageCount} ... ${currentMessageCount}`,
        );
        this.lastMessageCount = currentMessageCount;

        // Лента VK
        if (this.friendsCircle) {
          console.log('[Friends Circle] ...Лента VK......');
          await this.friendsCircle.manager.refreshData();

          // ЕслиЛента VKСтатус，
          if (this.friendsCircle.isActive) {
            console.log('[Friends Circle] Лента VK...Статус，...');
            this.friendsCircle.updateDisplay();
          } else {
            console.log('[Friends Circle] Лента VK...，...，...Открыть...');
          }
        }
      } catch (error) {
        console.error('[Friends Circle] errorСообщенияerror:', error);
      }
    }

    /**
     * ...Сообщения...
     * @returns {number} Сообщения...
     */
    getCurrentMessageCount() {
      try {
        // 1: SillyTavern.getContext().chat
        if (window.SillyTavern?.getContext) {
          const context = window.SillyTavern.getContext();
          if (context?.chat && Array.isArray(context.chat)) {
            return context.chat.length;
          }
        }

        // 2: mobileContextEditor
        if (window.mobileContextEditor?.getCurrentChatData) {
          const chatData = window.mobileContextEditor.getCurrentChatData();
          if (chatData?.messages && Array.isArray(chatData.messages)) {
            return chatData.messages.length;
          }
        }

        // 3: chat
        if (window.parent?.chat && Array.isArray(window.parent.chat)) {
          return window.parent.chat.length;
        }

        return 0;
      } catch (error) {
        console.warn('[Friends Circle] errorОтменитьerror:', error);
        return 0;
      }
    }

    /**
     * ...Сообщения...
     */
    updateMessageCount() {
      this.lastMessageCount = this.getCurrentMessageCount();
      console.log(`[Friends Circle] ...Сообщения...: ${this.lastMessageCount}`);
    }

    /**
     * ...
     */
    startPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }

      this.updateMessageCount();
      this.pollingInterval = setInterval(() => {
        this.checkForNewMessages();
      }, 1000); // ...1...，...

      this.isListening = true;
      console.log('[Friends Circle] ✅ ... (...1...)');
    }

    /**
     * ...Сообщения
     */
    async checkForNewMessages() {
      try {
        const currentMessageCount = this.getCurrentMessageCount();
        console.log(`[Friends Circle Debug] ...Сообщения: ...=${currentMessageCount}, ...=${this.lastMessageCount}`);

        if (currentMessageCount > this.lastMessageCount) {
          console.log(`[Friends Circle] ...Сообщения: ${this.lastMessageCount} → ${currentMessageCount}`);
          await this.onMessageReceived(currentMessageCount);
        } else {
          console.log(`[Friends Circle Debug] ...Сообщения`);
        }
      } catch (error) {
        console.error('[Friends Circle] errorСообщенияerror:', error);
      }
    }

    /**
     * ...Сообщения...（...）
     */
    triggerTestMessage() {
      console.log('[Friends Circle Debug] ...Сообщения......');
      const fakeMessageId = Date.now();
      this.onMessageReceived(fakeMessageId);
    }

    /**
     * ...
     */
    stopListening() {
      if (!this.isListening) return;

      try {
        if (window.SillyTavern?.getContext) {
          const context = window.SillyTavern.getContext();
          if (context?.eventSource?.off && context.event_types) {
            context.eventSource.off(context.event_types.MESSAGE_RECEIVED, this.messageReceivedHandler);
          }
        }

        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }

        this.isListening = false;
        console.log('[Friends Circle] ...');
      } catch (error) {
        console.error('[Friends Circle] error:', error);
      }
    }
  }

  /**
   * Лента VKUI...
   * ...Лента VK...
   */
  class FriendsCircleRenderer {
    constructor(friendsCircle) {
      this.friendsCircle = friendsCircle;
      this.publishModal = null;
    }

    /**
     * ...Лента VK...
     * @returns {string} Лента VK...HTML
     */
    renderFriendsCirclePage() {
      const userInfo = this.renderUserInfo();
      const circlesList = this.renderCirclesList();

      return `
        <div class="friends-circle-page">
          <div class="friends-circle-content">
            ${userInfo}
            <div class="circles-container">
              ${circlesList}
            </div>
          </div>
        </div>
      `;
    }

    /**
     * ...Пользователь...
     * @returns {string} Пользователь...HTML
     */
    renderUserInfo() {
      const userName = this.getCurrentUserName();
      const userAvatar = this.getCurrentUserAvatar();
      const userSignature = this.friendsCircle.getUserSignature();

      return `
        <div class="user-info-section">
          <div class="user-cover">
            <div class="user-avatar">
              <img src="${userAvatar}" alt="${userName}" />
            </div>
            <div class="user-details">
              <div class="user-name">${userName}</div>
              <div class="user-signature" onclick="window.friendsCircle?.editUserSignature()">
                <span class="signature-text">${userSignature}</span>
                <i class="fas fa-edit signature-edit-icon"></i>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * 🌟 ...B+C：...Лента VK/* Список */（...）
     * @returns {string} Лента VK/* Список */HTML
     */
    renderCirclesList() {
      if (!this.friendsCircle.manager) {
        return '<div class="empty-circles"><i class="fas fa-heart"></i><span>...Лента VK</span></div>';
      }

      const circles = this.friendsCircle.manager.getSortedFriendsCircles();

      if (circles.length === 0) {
        return '<div class="empty-circles"><i class="fas fa-heart"></i><span>...Лента VK</span></div>';
      }

      // 🌟 B：，
      try {
        // ，
        this.friendsCircle.batchGetBasicInfo();
      } catch (error) {
        console.warn('[Friends Circle] error，error:', error);
      }

      // 🌟 C： - 10Лента VK
      const visibleCircles = circles.slice(0, 10);
      const remainingCount = circles.length - 10;

      let html = visibleCircles.map(circle => this.renderSingleCircle(circle)).join('');

      // ЕслиЕщёЛента VK，Ещё
      if (remainingCount > 0) {
        html += `
          <div class="load-more-container" data-remaining="${remainingCount}" style="text-align: center; padding: 20px;">
            <button class="load-more-btn" onclick="window.friendsCircle.loadMoreCircles()"
                    style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-size: 14px;">
              <i class="fas fa-chevron-down" style="margin-right: 5px;"></i>
              ...Ещё (...${remainingCount}...)
            </button>
          </div>
        `;
      }

      return html;
    }

    /**
     * ...Лента VK
     * @param {Object} circle - Лента VK...
     * @returns {string} ...Лента VKHTML
     */
    renderSingleCircle(circle) {
      // 🌟 B：，
      let friendAvatar;
      const cache = this.friendsCircle.batchCache;
      const currentUserName = cache.userName || this.getCurrentUserName();

      if (circle.author === currentUserName || circle.friendId === '483920') {
        // ПользовательЛента VK，ПользовательАватар
        friendAvatar = cache.userAvatar || this.getCurrentUserAvatar();
      } else {
        // ДрузьяЛента VK，ДрузьяАватар
        friendAvatar = cache.friendAvatars.get(circle.friendId) || this.getFriendAvatar(circle.friendId);
      }

      const timeStr = this.formatTime(circle.messageIndex || 0);
      const contentHtml = this.renderCircleContent(circle);
      const repliesHtml = this.renderCircleReplies(circle.replies, circle.id);
      const actionsHtml = this.renderCircleActions(circle);

      return `
        <div class="circle-item" data-circle-id="${circle.id}">
          <div class="circle-header">
            <div class="friend-avatar">
              <img src="${friendAvatar}" alt="${circle.author}" />
            </div>
            <div class="friend-info">
              <div class="friend-name">${circle.author}</div>
              <div class="circle-time">${timeStr}</div>
            </div>
          </div>

          <div class="circle-content">
            ${contentHtml}
          </div>

          <div class="circle-actions">
            ${actionsHtml}
          </div>

          ${repliesHtml}

          <div class="reply-input-container" id="reply-input-${circle.id}" style="display: none;">
            <input type="text" class="reply-input" placeholder="......" />
            <button class="reply-send-btn" onclick="window.friendsCircle?.sendCircleReply('${circle.id}')">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      `;
    }

    /**
     * ...Лента VK...
     * @param {Object} circle - Лента VK...
     * @returns {string} Лента VK...HTML
     */
    renderCircleContent(circle) {
      if (circle.type === 'visual') {
        // URL
        const hasRealImage = circle.imageUrl && circle.imageUrl.trim();

        let imageHtml;
        if (hasRealImage) {
          imageHtml = `
            <div class="circle-image-container">
              <img src="${circle.imageUrl}"
                   alt="${circle.imageDescription || 'Лента VK...'}"
                   class="circle-image"
                   onclick="this.style.transform=this.style.transform?'':'scale(2)'; setTimeout(()=>this.style.transform='', 3000);"
                   loading="lazy"
                   onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><i class=\\'fas fa-image\\'></i><span class=\\'image-description\\'>${
                     circle.imageDescription || '...'
                   }</span></div>'">
            </div>
          `;
        } else {
          imageHtml = `
            <div class="image-placeholder">
              <i class="fas fa-image"></i>
              <span class="image-description">${circle.imageDescription || '...'}</span>
            </div>
          `;
        }

        const visualHtml = `
          <div class="visual-circle-content">
            ${circle.content ? `<div class="text-content">${circle.content}</div>` : ''}
            ${imageHtml}
          </div>
        `;
        return visualHtml;
      } else {
        const textHtml = `<div class="text-circle-content">${circle.content}</div>`;
        return textHtml;
      }
    }

    /**
     * ...Лента VK...
     * @param {Object} circle - Лента VK...
     * @returns {string} ...HTML
     */
    renderCircleActions(circle) {
      const likeIcon = circle.isLiked ? 'fas fa-heart liked' : 'far fa-heart';

      return `
        <div class="actions-bar">
          <button class="action-btn like-btn" onclick="window.friendsCircle?.toggleCircleLike('${circle.id}')">
            <i class="${likeIcon}"></i>
            <span class="like-count">${circle.likes}</span>
          </button>
          <button class="action-btn reply-btn" onclick="window.friendsCircle?.toggleReplyInput('${circle.id}')">
            <i class="fas fa-comment"></i>
            <span>Ответить</span>
          </button>
        </div>
      `;
    }

    /**
     * ...Лента VKОтветить
     * @param {Array} replies - Ответить...
     * @param {string} circleId - Лента VKID
     * @returns {string} ОтветитьHTML
     */
    renderCircleReplies(replies, circleId) {
      if (!replies || replies.length === 0) {
        return '';
      }

      const repliesHtml = replies
        .map(reply => {
          // 🔧 ПользовательОтветитьАватар +
          let replyAvatar;
          const cache = this.friendsCircle.batchCache;
          const currentUserName = cache.userName || this.getCurrentUserName();

          if (reply.author === currentUserName || reply.friendId === '483920') {
            // ПользовательОтветить，ПользовательАватар
            replyAvatar = cache.userAvatar || this.getCurrentUserAvatar();
          } else {
            // ДрузьяОтветить，ДрузьяАватар
            replyAvatar = cache.friendAvatars.get(reply.friendId) || this.getFriendAvatar(reply.friendId);
          }

          const timeStr = this.formatTime(reply.messageIndex || 0);

          return `
          <div class="circle-reply" data-reply-id="${reply.id}" data-reply-author="${reply.author}">
            <div class="reply-avatar">
              <img src="${replyAvatar}" alt="${reply.author}" />
            </div>
            <div class="reply-content">
              <div class="reply-header">
                <span class="reply-author">${reply.author}</span>
                <span class="reply-time">${timeStr}</span>
                <button class="reply-to-comment-btn" onclick="window.friendsCircle?.showReplyToComment('${circleId}', '${reply.id}', '${reply.author}')">
                  <i class="fas fa-reply"></i>
                </button>
              </div>
              <div class="reply-text">${reply.content}</div>
            </div>
          </div>
        `;
        })
        .join('');

      return `
        <div class="replies-section">
          <div class="replies-list">
            ${repliesHtml}
          </div>
        </div>
      `;
    }

    /**
     * ...ДрузьяАватар
     * @param {string} friendId - ДрузьяID
     * @returns {string} АватарURL
     */
    getFriendAvatar(friendId) {
      // StyleConfigManagerАватар
      if (window.styleConfigManager) {
        try {
          const config = window.styleConfigManager.getConfig();
          if (config && config.messageReceivedAvatars) {
            // ДрузьяАватар
            const avatarConfig = config.messageReceivedAvatars.find(avatar => avatar.friendId === friendId);

            if (avatarConfig) {
              const imageUrl = avatarConfig.backgroundImage || avatarConfig.backgroundImageUrl;
              if (imageUrl) {
                return imageUrl;
              }
            }
          }
        } catch (error) {
          console.warn('[Friends Circle] errorАватарerror:', error);
        }
      }

      // ：Аватар
      return this.getDefaultAvatar(friendId);
    }

    /**
     * ...Аватар
     * @param {string} friendId - ДрузьяID
     * @returns {string} ...АватарURL
     */
    getDefaultAvatar(friendId) {
      // ДрузьяIDАватар
      const colors = [
        '#FF6B9D',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FFEAA7',
        '#DDA0DD',
        '#98D8C8',
        '#F7DC6F',
        '#BB8FCE',
        '#85C1E9',
      ];

      const colorIndex = friendId
        ? friendId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length
        : 0;
      const color = colors[colorIndex];

      // SVGАватар
      const svg = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="${color}"/>
          <circle cx="20" cy="16" r="6" fill="white" opacity="0.9"/>
          <path d="M10 32C10 26.4771 14.4771 22 19 22H21C25.5229 22 30 26.4771 30 32V34H10V32Z" fill="white" opacity="0.9"/>
        </svg>
      `;

      return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    /**
     * ...Пользователь...
     * @returns {string} Пользователь...
     */
    getCurrentUserName() {
      try {
        // 1: SillyTavernpersonaПользователь
        const selectedPersona = this.getSelectedPersonaName();
        if (selectedPersona && selectedPersona !== '{{user}}' && selectedPersona !== 'User') {
          return selectedPersona;
        }

        // 2: SillyTavern
        if (typeof window.name1 !== 'undefined' && window.name1 && window.name1.trim() && window.name1 !== '{{user}}') {
          return window.name1.trim();
        }

        // 3: power_user
        if (
          window.power_user &&
          window.power_user.name &&
          window.power_user.name.trim() &&
          window.power_user.name !== '{{user}}'
        ) {
          console.log('[Friends Circle] ...power_user...Пользователь...:', window.power_user.name);
          return window.power_user.name.trim();
        }

        // 4: SillyTaverngetContext
        if (window.SillyTavern && typeof window.SillyTavern.getContext === 'function') {
          const context = window.SillyTavern.getContext();
          if (context && context.name1 && context.name1.trim() && context.name1 !== '{{user}}') {
            console.log('[Friends Circle] ...SillyTavern context...Пользователь...:', context.name1);
            return context.name1.trim();
          }
        }

        // 5: localStorage
        const storedName = localStorage.getItem('name1');
        if (storedName && storedName.trim() && storedName !== '{{user}}') {
          console.log('[Friends Circle] ...localStorage...Пользователь...:', storedName);
          return storedName.trim();
        }

        console.log('[Friends Circle] ...Пользователь...，...');
        console.log('[Friends Circle] ...:');
        console.log('- window.name1:', window.name1);
        console.log('- window.power_user:', window.power_user);
        console.log('- localStorage name1:', localStorage.getItem('name1'));
      } catch (error) {
        console.warn('[Friends Circle] errorПользовательerror:', error);
      }

      return '...';
    }

    /**
     * ...persona...
     * @returns {string|null} persona...
     */
    getSelectedPersonaName() {
      try {
        console.log('[Friends Circle] ...persona......');

        // 1: DOMpersona
        const selectedPersonaElement = document.querySelector('#user_avatar_block .avatar-container.selected .ch_name');
        if (selectedPersonaElement) {
          const personaName = selectedPersonaElement.textContent?.trim();
          if (personaName && personaName !== '{{user}}' && personaName !== 'User') {
            console.log('[Friends Circle] ...DOM...persona...:', personaName);
            return personaName;
          }
        }

        // 2: SillyTavernpersona
        if (window.user_avatar && window.user_avatar.name) {
          const personaName = window.user_avatar.name.trim();
          if (personaName && personaName !== '{{user}}' && personaName !== 'User') {
            console.log('[Friends Circle] ...user_avatar...persona...:', personaName);
            return personaName;
          }
        }

        // 3: power_userpersonaНастройки
        if (window.power_user && window.power_user.persona_description) {
          // persona（）
          const personaDesc = window.power_user.persona_description;
          const nameMatch = personaDesc.match(/^([^\n\r]+)/);
          if (nameMatch) {
            const personaName = nameMatch[1].trim();
            if (personaName && personaName !== '{{user}}' && personaName !== 'User') {
              console.log('[Friends Circle] ...persona...:', personaName);
              return personaName;
            }
          }
        }

        // 4:
        const possibleVars = ['persona_name', 'current_persona', 'selected_persona'];
        for (const varName of possibleVars) {
          if (window[varName] && typeof window[varName] === 'string') {
            const personaName = window[varName].trim();
            if (personaName && personaName !== '{{user}}' && personaName !== 'User') {
              console.log(`[Friends Circle] ...${varName}...persona...:`, personaName);
              return personaName;
            }
          }
        }

        // 5: DOM
        const alternativeSelectors = [
          '.avatar-container.selected .character_name_block .ch_name',
          '.avatar-container.selected span.ch_name',
          '#user_avatar_block .selected .ch_name',
          '.persona_management_left_column .selected .ch_name',
        ];

        for (const selector of alternativeSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            const personaName = element.textContent?.trim();
            if (personaName && personaName !== '{{user}}' && personaName !== 'User') {
              console.log(`[Friends Circle] ...DOM... ${selector} ...persona...:`, personaName);
              return personaName;
            }
          }
        }

        // 6: SillyTavernpersonas
        if (window.personas && Array.isArray(window.personas)) {
          const selectedPersona = window.personas.find(p => p.selected || p.active);
          if (selectedPersona && selectedPersona.name) {
            const personaName = selectedPersona.name.trim();
            if (personaName && personaName !== '{{user}}' && personaName !== 'User') {
              console.log('[Friends Circle] ...personas...persona...:', personaName);
              return personaName;
            }
          }
        }

        console.log('[Friends Circle] ...persona...');
        console.log('[Friends Circle] ...:');
        console.log('- DOM...:', document.querySelector('#user_avatar_block .avatar-container.selected'));
        console.log('- window.user_avatar:', window.user_avatar);
        console.log('- window.personas:', window.personas);
        console.log('- window.power_user.persona_description:', window.power_user?.persona_description);

        return null;
      } catch (error) {
        console.warn('[Friends Circle] errorpersonaerror:', error);
        return null;
      }
    }

    /**
     * ...：...Пользователь...
     * ... window.friendsCircle.debugUserNameMethods() ...
     */
    debugUserNameMethods() {
      console.log('=== ...Пользователь... ===');

      // DOM
      console.log('\n1. DOM...:');
      const domSelectors = [
        '#user_avatar_block .avatar-container.selected .ch_name',
        '.avatar-container.selected .character_name_block .ch_name',
        '.avatar-container.selected span.ch_name',
        '#user_avatar_block .selected .ch_name',
        '.persona_management_left_column .selected .ch_name',
      ];

      domSelectors.forEach(selector => {
        const element = document.querySelector(selector);
        console.log(`  ${selector}:`, element ? element.textContent?.trim() : 'null');
      });

      console.log('\n2. ...:');
      const globalVars = ['name1', 'user_name', 'persona_name', 'current_persona', 'selected_persona', 'user_persona'];

      globalVars.forEach(varName => {
        console.log(`  window.${varName}:`, window[varName]);
      });

      console.log('\n3. ...:');
      console.log('  window.power_user:', window.power_user);
      console.log('  window.user_avatar:', window.user_avatar);
      console.log('  window.personas:', window.personas);

      // SillyTavern context
      console.log('\n4. SillyTavern Context...:');
      if (window.SillyTavern && typeof window.SillyTavern.getContext === 'function') {
        const context = window.SillyTavern.getContext();
        console.log('  SillyTavern context:', context);
        console.log('  context.name1:', context?.name1);
      } else {
        console.log('  SillyTavern.getContext ...');
      }

      // localStorage
      console.log('\n5. LocalStorage...:');
      console.log('  localStorage.name1:', localStorage.getItem('name1'));
      console.log('  localStorage.persona_name:', localStorage.getItem('persona_name'));

      console.log('\n=== ... ===');

      // Пользователь
      console.log('\n6. ...:');
      console.log('  getCurrentUserName():', this.getCurrentUserName());
      console.log('  getSelectedPersonaName():', this.getSelectedPersonaName());
    }

    /**
     * ...ПользовательАватар
     * @returns {string} ПользовательАватарURL
     */
    getCurrentUserAvatar() {
      // StyleConfigManagerПользовательАватар
      if (window.styleConfigManager) {
        try {
          const config = window.styleConfigManager.getConfig();
          if (config && config.messageSentAvatar) {
            const imageUrl = config.messageSentAvatar.backgroundImage || config.messageSentAvatar.backgroundImageUrl;
            if (imageUrl) {
              return imageUrl;
            }
          }
        } catch (error) {
          console.warn('[Friends Circle] errorПользовательАватарerror:', error);
        }
      }

      // ：ПользовательАватар
      const svg = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#74B9FF"/>
          <circle cx="20" cy="16" r="6" fill="white" opacity="0.9"/>
          <path d="M10 32C10 26.4771 14.4771 22 19 22H21C25.5229 22 30 26.4771 30 32V34H10V32Z" fill="white" opacity="0.9"/>
        </svg>
      `;

      return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    /**
     * ...Время（...Сообщения...Время）
     * @param {number} messageIndex - Сообщения...
     * @param {number} totalMessages - ...Сообщения...
     * @returns {string} ...Время
     */
    formatTime(messageIndex, totalMessages = null) {
      // ЕслиВремя，
      if (messageIndex > 1000000000000) {
        // Время，
        const date = new Date(messageIndex);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) {
          return 'только что';
        } else if (diffMins < 60) {
          return `${diffMins}мин. назад`;
        } else {
          return '...';
        }
      }

      // СообщенияВремя
      if (totalMessages === null) {
        // Сообщения
        totalMessages = this.friendsCircle?.manager?.lastProcessedMessageIndex || 1000;
      }

      const positionFromEnd = totalMessages - messageIndex;

      if (positionFromEnd <= 1) {
        return 'только что';
      } else if (positionFromEnd <= 5) {
        return '...мин. назад';
      } else if (positionFromEnd <= 20) {
        return '...ч. назад';
      } else if (positionFromEnd <= 50) {
        return '1ч. назад';
      } else if (positionFromEnd <= 100) {
        return '...ч. назад';
      } else if (positionFromEnd <= 200) {
        return 'Сегодня';
      } else if (positionFromEnd <= 500) {
        return 'Вчера';
      } else {
        return '...';
      }
    }

    /**
     * ...Опубликовать...
     */
    showPublishModal() {
      if (this.publishModal) {
        this.publishModal.remove();
      }

      this.publishModal = document.createElement('div');
      this.publishModal.className = 'friends-circle-publish-modal';
      this.publishModal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>ОпубликоватьЛента VK</h3>
            <button class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="publish-options">
            <button class="publish-option-btn text-btn">
              <i class="fas fa-font"></i>
              <span>...</span>
            </button>
            <button class="publish-option-btn image-btn">
              <i class="fas fa-image"></i>
              <span>...</span>
            </button>
          </div>
        </div>
      `;

      const overlay = this.publishModal.querySelector('.modal-overlay');
      const closeBtn = this.publishModal.querySelector('.modal-close');
      const textBtn = this.publishModal.querySelector('.text-btn');
      const imageBtn = this.publishModal.querySelector('.image-btn');

      console.log('[Friends Circle Debug] ...:', {
        overlay: !!overlay,
        closeBtn: !!closeBtn,
        textBtn: !!textBtn,
        imageBtn: !!imageBtn,
      });

      if (overlay) {
        overlay.addEventListener('click', () => {
          console.log('[Friends Circle Debug] ...');
          this.hidePublishModal();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          console.log('[Friends Circle Debug] ...Закрыть...');
          this.hidePublishModal();
        });
      }

      if (textBtn) {
        textBtn.addEventListener('click', () => {
          console.log('[Friends Circle Debug] ...');
          this.showTextPublishModal();
        });
      }

      if (imageBtn) {
        imageBtn.addEventListener('click', () => {
          console.log('[Friends Circle Debug] ...');
          this.showImagePublishModal();
        });
      }

      const mobileContainer = document.querySelector('.mobile-phone-container');
      console.log('[Friends Circle Debug] ...:', !!mobileContainer);

      if (mobileContainer) {
        mobileContainer.appendChild(this.publishModal);
        console.log('[Friends Circle Debug] ...');
      } else {
        document.body.appendChild(this.publishModal);
        console.log('[Friends Circle Debug] ...body');
      }

      setTimeout(() => {
        if (!this.publishModal) {
          console.log('[Friends Circle Debug] ...，...');
          return;
        }

        const modalRect = this.publishModal.getBoundingClientRect();
        const modalStyle = window.getComputedStyle(this.publishModal);
        console.log('[Friends Circle Debug] ...:', modalRect);
        console.log('[Friends Circle Debug] ...:', {
          display: modalStyle.display,
          position: modalStyle.position,
          zIndex: modalStyle.zIndex,
          visibility: modalStyle.visibility,
          opacity: modalStyle.opacity,
          pointerEvents: modalStyle.pointerEvents,
        });

        const overlay = this.publishModal.querySelector('.modal-overlay');
        const content = this.publishModal.querySelector('.modal-content');
        const buttons = this.publishModal.querySelectorAll('button');

        console.log('[Friends Circle Debug] ...:', {
          overlay: !!overlay,
          overlayRect: overlay?.getBoundingClientRect(),
          content: !!content,
          contentRect: content?.getBoundingClientRect(),
          buttonsCount: buttons.length,
        });

        buttons.forEach((btn, index) => {
          console.log(`[Friends Circle Debug] ... ${index}:`, {
            className: btn.className,
            rect: btn.getBoundingClientRect(),
            style: {
              pointerEvents: window.getComputedStyle(btn).pointerEvents,
              zIndex: window.getComputedStyle(btn).zIndex,
            },
          });
        });
      }, 100);

      console.log('[Friends Circle Debug] Опубликовать...');
    }

    /**
     * ...Опубликовать...
     */
    hidePublishModal() {
      if (this.publishModal) {
        this.publishModal.remove();
        this.publishModal = null;
      }
    }

    /**
     * ...Опубликовать...
     */
    showTextPublishModal() {
      this.hidePublishModal();

      const modal = document.createElement('div');
      modal.className = 'friends-circle-text-publish-modal';
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>Опубликовать...Лента VK</h3>
            <button class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <textarea class="text-input" placeholder="Поделиться......" maxlength="500"></textarea>
            <div class="char-count">0/500</div>
          </div>
          <div class="modal-footer">
            <button class="cancel-btn">Отменить</button>
            <button class="send-btn">Опубликовать</button>
          </div>
        </div>
      `;

      const overlay = modal.querySelector('.modal-overlay');
      const closeBtn = modal.querySelector('.modal-close');
      const cancelBtn = modal.querySelector('.cancel-btn');
      const sendBtn = modal.querySelector('.send-btn');

      const closeModal = () => modal.remove();

      overlay.addEventListener('click', closeModal);
      closeBtn.addEventListener('click', closeModal);
      cancelBtn.addEventListener('click', closeModal);
      sendBtn.addEventListener('click', () => {
        console.log('[Friends Circle] ...Опубликовать...');
        console.log('[Friends Circle] this...:', {
          thisExists: !!this,
          thisConstructorName: this?.constructor?.name,
          hasHandleTextPublish: typeof this?.handleTextPublish === 'function',
        });

        if (this && typeof this.handleTextPublish === 'function') {
          this.handleTextPublish(modal);
        } else {
          console.error('[Friends Circle] handleTextPublisherrorthiserror');
          // ：Опубликовать
          const textInput = modal.querySelector('.text-input');
          if (textInput) {
            const content = textInput.value.trim();
            if (content) {
              // Лента VK
              if (window.friendsCircle && typeof window.friendsCircle.sendTextCircle === 'function') {
                window.friendsCircle.sendTextCircle(content);
                modal.remove();
              } else {
                console.error('[Friends Circle] errorЛента VKerror');
              }
            }
          }
        }
      });

      const mobileContainer = document.querySelector('.mobile-phone-container');
      if (mobileContainer) {
        mobileContainer.appendChild(modal);
      } else {
        document.body.appendChild(modal);
      }

      const textInput = modal.querySelector('.text-input');
      const charCount = modal.querySelector('.char-count');
      if (textInput && charCount) {
        textInput.addEventListener('input', () => {
          const count = textInput.value.length;
          charCount.textContent = `${count}/500`;
          if (count > 450) {
            charCount.style.color = '#ff6b9d';
          } else {
            charCount.style.color = '#999';
          }
        });
        textInput.focus();
      }

      console.log('[Friends Circle] ...Опубликовать...，...');
    }

    /**
     * ...Опубликовать...
     */
    showImagePublishModal() {
      this.hidePublishModal();

      const modal = document.createElement('div');
      modal.className = 'friends-circle-image-publish-modal';
      modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>Опубликовать...Лента VK</h3>
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>...</label>
              <textarea class="image-desc-input" placeholder="......" maxlength="200"></textarea>
              <div class="char-count">0/200</div>
            </div>
            <div class="form-group">
              <label>...（...！！！）</label>
              <textarea class="text-input" placeholder="......" maxlength="300"></textarea>
              <div class="char-count">0/300</div>
            </div>
            <div class="form-group">
              <label>Загрузить...</label>
              <div class="attachment-upload-area">
                <div class="file-drop-zone" id="friends-circle-drop-zone">
                  <div class="drop-zone-content">
                    <i class="fas fa-image"></i>
                    <div class="upload-text">...</div>
                    <div class="upload-hint">...jpg、png、gif、webp...，...10MB</div>
                  </div>
                  <input type="file" class="hidden-file-input" accept="image/*" id="friends-circle-file-input">
                </div>
                <div class="image-preview-area" id="friends-circle-preview-area" style="display: none;">
                  <div class="preview-image-container">
                    <img class="preview-image" alt="..." id="friends-circle-preview-image">
                    <button class="remove-image-btn" id="friends-circle-remove-image">×</button>
                    <div class="image-info">
                      <span class="image-name" id="friends-circle-image-name"></span>
                      <span class="image-size" id="friends-circle-image-size"></span>
                    </div>
                  </div>
                </div>
                <div class="upload-status" id="friends-circle-upload-status" style="display: none;">
                  <div class="upload-progress">
                    <div class="progress-bar" id="friends-circle-progress-bar"></div>
                  </div>
                  <div class="upload-text" id="friends-circle-upload-text">Загрузить......</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="cancel-btn" onclick="this.parentElement.parentElement.parentElement.remove()">Отменить</button>
            <button class="send-btn" id="friends-circle-publish-btn">Опубликовать</button>
          </div>
        </div>
      `;

      const mobileContainer = document.querySelector('.mobile-phone-container');
      if (mobileContainer) {
        mobileContainer.appendChild(modal);
      } else {
        document.body.appendChild(modal);
      }

      const imageDescInput = modal.querySelector('.image-desc-input');
      const textInput = modal.querySelector('.text-input');
      const charCounts = modal.querySelectorAll('.char-count');

      if (imageDescInput && charCounts[0]) {
        imageDescInput.addEventListener('input', () => {
          const count = imageDescInput.value.length;
          charCounts[0].textContent = `${count}/200`;
          if (count > 180) {
            charCounts[0].style.color = '#ff6b9d';
          } else {
            charCounts[0].style.color = '#999';
          }
        });
      }

      if (textInput && charCounts[1]) {
        textInput.addEventListener('input', () => {
          const count = textInput.value.length;
          charCounts[1].textContent = `${count}/300`;
          if (count > 270) {
            charCounts[1].style.color = '#ff6b9d';
          } else {
            charCounts[1].style.color = '#999';
          }
        });
      }

      // Загрузить
      this.bindImageUploadEvents(modal);

      if (imageDescInput) {
        imageDescInput.focus();
      }
    }

    /**
     * ...Загрузить...
     */
    bindImageUploadEvents(modal) {
      const dropZone = modal.querySelector('#friends-circle-drop-zone');
      const fileInput = modal.querySelector('#friends-circle-file-input');
      const previewArea = modal.querySelector('#friends-circle-preview-area');
      const previewImage = modal.querySelector('#friends-circle-preview-image');
      const removeBtn = modal.querySelector('#friends-circle-remove-image');
      const imageName = modal.querySelector('#friends-circle-image-name');
      const imageSize = modal.querySelector('#friends-circle-image-size');
      const uploadStatus = modal.querySelector('#friends-circle-upload-status');
      const publishBtn = modal.querySelector('#friends-circle-publish-btn');

      if (!dropZone || !fileInput) {
        console.warn('[Friends Circle] Загрузитьerror');
        return;
      }

      // Загрузить
      dropZone.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
          this.handleImageFileSelection(file, {
            previewArea,
            previewImage,
            imageName,
            imageSize,
            uploadStatus,
            publishBtn,
            dropZone,
          });
        }
      });

      dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });

      dropZone.addEventListener('dragleave', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
      });

      dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const file = files[0];
          this.handleImageFileSelection(file, {
            previewArea,
            previewImage,
            imageName,
            imageSize,
            uploadStatus,
            publishBtn,
            dropZone,
          });
        }
      });

      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          this.clearImageSelection({
            previewArea,
            uploadStatus,
            publishBtn,
            dropZone,
            fileInput,
          });
        });
      }

      // Опубликовать -
      if (publishBtn) {
        publishBtn.addEventListener('click', () => {
          console.log('[Friends Circle] Опубликовать...');
          console.log('[Friends Circle] ...Лента VK...:', !!window.friendsCircle);
          console.log('[Friends Circle] ...handleImagePublish...:', typeof window.friendsCircle?.handleImagePublish);

          if (window.friendsCircle && typeof window.friendsCircle.handleImagePublish === 'function') {
            window.friendsCircle.handleImagePublish();
          } else {
            console.error('[Friends Circle] errorhandleImagePublisherror');
          }
        });
        console.log('[Friends Circle] Опубликовать...');
      } else {
        console.warn('[Friends Circle] Опубликоватьerror，error');
      }
    }

    /**
     * ...
     */
    async handleImageFileSelection(file, elements) {
      console.log('[Friends Circle] ...:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        elementsProvided: !!elements,
      });

      // AttachmentSender
      if (!window.attachmentSender) {
        console.error('[Friends Circle] AttachmentSendererror');
        this.showToast('...Загрузить...', 'error');
        return;
      }

      console.log('[Friends Circle] ......');
      const validation = window.attachmentSender.validateFile(file);
      console.log('[Friends Circle] ...:', validation);

      if (!validation.isValid) {
        console.warn('[Friends Circle] error:', validation.errors);
        this.showToast(validation.errors.join(', '), 'error');
        return;
      }

      console.log('[Friends Circle] ...，......');

      this.showImagePreview(file, elements);

      // Загрузить
      this.selectedImageFile = file;
      this.selectedImageElements = elements;

      console.log('[Friends Circle] ...:', {
        selectedImageFile: !!this.selectedImageFile,
        selectedImageFileName: this.selectedImageFile ? this.selectedImageFile.name : 'none',
        thisInstanceId: this.constructor.name,
        globalInstanceExists: !!window.friendsCircle,
        globalInstanceSame: window.friendsCircle === this,
      });

      // ，
      if (window.friendsCircle && window.friendsCircle !== this) {
        console.warn('[Friends Circle] error，error');
        window.friendsCircle.selectedImageFile = file;
        window.friendsCircle.selectedImageElements = elements;
      }

      // ОпубликоватьСтатус
      if (elements.publishBtn) {
        elements.publishBtn.disabled = false;
        elements.publishBtn.textContent = 'Опубликовать';
        console.log('[Friends Circle] Опубликовать...');
      } else {
        console.warn('[Friends Circle] Опубликоватьerror');
      }

      console.log('[Friends Circle] ...');
    }

    /**
     * ...
     */
    showImagePreview(file, elements) {
      console.log('[Friends Circle] ...:', file.name);

      const { previewArea, previewImage, imageName, imageSize, dropZone } = elements;

      console.log('[Friends Circle] ...:', {
        previewArea: !!previewArea,
        previewImage: !!previewImage,
        imageName: !!imageName,
        imageSize: !!imageSize,
        dropZone: !!dropZone,
      });

      if (!previewArea || !previewImage) {
        console.warn('[Friends Circle] error');
        return;
      }

      // URL
      const previewUrl = URL.createObjectURL(file);
      console.log('[Friends Circle] ...URL:', previewUrl);

      // Настройки
      previewImage.src = previewUrl;
      previewImage.onload = () => {
        console.log('[Friends Circle] ...');
        URL.revokeObjectURL(previewUrl); // ...
      };

      // Настройки
      if (imageName) {
        imageName.textContent = file.name;
        console.log('[Friends Circle] Настройки...:', file.name);
      }
      if (imageSize) {
        const sizeText = this.formatFileSize(file.size);
        imageSize.textContent = sizeText;
        console.log('[Friends Circle] Настройки...:', sizeText);
      }

      // ，Загрузить
      previewArea.style.display = 'block';
      if (dropZone) {
        dropZone.style.display = 'none';
      }

      console.log('[Friends Circle] ...');
    }

    /**
     * ...
     */
    clearImageSelection(elements) {
      const { previewArea, uploadStatus, publishBtn, dropZone, fileInput } = elements;

      // ЗагрузитьСтатус
      if (previewArea) previewArea.style.display = 'none';
      if (uploadStatus) uploadStatus.style.display = 'none';

      // Загрузить
      if (dropZone) dropZone.style.display = 'block';

      if (fileInput) fileInput.value = '';

      // Статус
      if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.textContent = 'Опубликовать';
      }

      this.selectedImageFile = null;
      this.selectedImageElements = null;
    }

    /**
     * ...
     */
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }

  /**
   * Лента VK...
   * ...Лента VK...
   */
  class FriendsCircle {
    constructor() {
      this.manager = new FriendsCircleManager();
      this.eventListener = new FriendsCircleEventListener(this);
      this.renderer = new FriendsCircleRenderer(this);
      this.isActive = false;

      // 🌟 B：
      this.batchCache = {
        userName: null,
        userAvatar: null,
        friendAvatars: new Map(),
        lastCacheTime: 0,
        cacheTimeout: 30000, // 30...
      };
      this.userSignature = localStorage.getItem('friendsCircle_userSignature') || '...，...';

      // AttachmentSenderЗагрузить
      this.initializeAttachmentSender();

      this.selectedImageFile = null;
      this.selectedImageElements = null;

      console.log('[Friends Circle] Лента VK...');
    }

    /**
     * 🌟 ...B：...
     * ...Пользователь...、ПользовательАватар...ДрузьяАватар，...
     */
    batchGetBasicInfo() {
      const now = Date.now();

      if (this.batchCache.lastCacheTime && now - this.batchCache.lastCacheTime < this.batchCache.cacheTimeout) {
        return this.batchCache;
      }

      try {
        // Пользователь
        if (!this.batchCache.userName) {
          this.batchCache.userName = this.renderer.getCurrentUserName();
        }
        if (!this.batchCache.userAvatar) {
          this.batchCache.userAvatar = this.renderer.getCurrentUserAvatar();
        }

        // ДрузьяАватар（Лента VKДрузьяID）
        const friendIds = new Set();
        for (const circle of this.manager.friendsCircleData.values()) {
          if (circle.friendId && circle.friendId !== '483920') {
            // ПользовательID
            friendIds.add(circle.friendId);
          }
        }

        // ДрузьяАватар
        for (const friendId of friendIds) {
          if (!this.batchCache.friendAvatars.has(friendId)) {
            const avatar = this.renderer.getFriendAvatar(friendId);
            if (avatar) {
              this.batchCache.friendAvatars.set(friendId, avatar);
            }
          }
        }

        this.batchCache.lastCacheTime = now;
        return this.batchCache;
      } catch (error) {
        console.error('[Friends Circle] error:', error);
        // НазадСтатус，
        return this.batchCache;
      }
    }

    /**
     * 🌟 ...B：...（Пользователь...）
     */
    clearBatchCache() {
      this.batchCache.userName = null;
      this.batchCache.userAvatar = null;
      this.batchCache.friendAvatars.clear();
      this.batchCache.lastCacheTime = 0;
    }

    /**
     * 🌟 ...C：...ЕщёЛента VK（...）
     */
    loadMoreCircles() {
      try {
        const loadMoreContainer = document.querySelector('.load-more-container');
        if (!loadMoreContainer) return;

        const remaining = parseInt(loadMoreContainer.dataset.remaining) || 0;
        if (remaining <= 0) return;

        const circlesContainer = document.querySelector('.circles-container');
        if (!circlesContainer) return;

        // Лента VK
        const allCircles = this.manager.getSortedFriendsCircles();
        const currentCount = circlesContainer.querySelectorAll('.circle-item').length; // ...Лента VK...

        // （10）
        const nextBatch = allCircles.slice(currentCount, currentCount + 10);
        const newRemaining = remaining - nextBatch.length;

        // Лента VK
        const newHtml = nextBatch.map(circle => this.renderer.renderSingleCircle(circle)).join('');

        // Ещё
        loadMoreContainer.insertAdjacentHTML('beforebegin', newHtml);

        // Ещё
        if (newRemaining > 0) {
          loadMoreContainer.dataset.remaining = newRemaining;
          loadMoreContainer.querySelector('.load-more-btn').innerHTML = `
            <i class="fas fa-chevron-down"></i>
            ...Ещё (...${newRemaining}...)
          `;
        } else {
          loadMoreContainer.remove();
        }
      } catch (error) {
        console.error('[Friends Circle] errorЕщёЛента VKerror:', error);
      }
    }

    /**
     * ...Пользователь...
     * @returns {string} Пользователь...
     */
    getCurrentUserName() {
      // renderer
      if (this.renderer && typeof this.renderer.getCurrentUserName === 'function') {
        return this.renderer.getCurrentUserName();
      }

      // ：
      try {
        // 1: persona
        if (typeof getSelectedPersona === 'function') {
          const persona = getSelectedPersona();
          if (persona && persona.name && persona.name.trim() && persona.name !== '{{user}}') {
            return persona.name.trim();
          }
        }

        // 2: DOMpersona
        const personaSelect = document.querySelector('#persona-management-block .persona_name_block .menu_button');
        if (
          personaSelect &&
          personaSelect.textContent &&
          personaSelect.textContent.trim() &&
          personaSelect.textContent.trim() !== '{{user}}'
        ) {
          return personaSelect.textContent.trim();
        }

        // 3: SillyTavern
        if (typeof window.name1 !== 'undefined' && window.name1 && window.name1.trim() && window.name1 !== '{{user}}') {
          return window.name1.trim();
        }
      } catch (error) {
        console.warn('[Friends Circle] errorПользовательerror:', error);
      }

      // Назад
      return 'Пользователь';
    }

    /**
     * ...AttachmentSender
     */
    initializeAttachmentSender() {
      try {
        if (window.attachmentSender) {
          // НастройкиЛента VK
          window.attachmentSender.setCurrentChat('friends_circle', 'Лента VK', false);
          console.log('[Friends Circle] AttachmentSender...Лента VK...');
        } else {
          console.warn('[Friends Circle] AttachmentSendererror，errorЗагрузитьerror');
        }
      } catch (error) {
        console.error('[Friends Circle] errorAttachmentSendererror:', error);
      }
    }

    /**
     * ...Лента VK...
     */
    activate() {
      console.log('[Friends Circle] ...Лента VK......');

      this.isActive = true;
      console.log('[Friends Circle] Лента VKСтатус...Настройки...');

      if (this.eventListener) {
        this.eventListener.startListening();
        console.log('[Friends Circle] ...');
      } else {
        console.error('[Friends Circle] error！');
      }

      // header
      this.updateHeader();

      // ОбновитьЛента VK
      this.refreshFriendsCircle();
      console.log('[Friends Circle] Лента VK...');
    }

    /**
     * ...Лента VK...
     */
    deactivate() {
      this.isActive = false;
      this.eventListener.stopListening();
      console.log('[Friends Circle] Лента VK...');
    }

    /**
     * ...Лента VKheader
     */
    updateHeader() {
      console.log('[Friends Circle] ...Лента VKheader...');

      // Уведомление/* Приложение */Статус
      if (window.mobilePhone) {
        const friendsCircleState = {
          app: 'messages',
          view: 'friendsCircle',
          title: 'Лента VK',
          showBackButton: false,
          showAddButton: true,
          addButtonIcon: 'fas fa-plus',
          addButtonAction: () => {
            if (window.friendsCircle) {
              window.friendsCircle.showPublishModal();
            }
          },
        };

        window.mobilePhone.currentAppState = friendsCircleState;
        window.mobilePhone.updateAppHeader(friendsCircleState);
        console.log('[Friends Circle] Header...');
      } else {
        console.warn('[Friends Circle] mobilePhoneerror，errorheader');
      }
    }

    /**
     * ОбновитьЛента VK...
     */
    async refreshFriendsCircle() {
      try {
        console.log('[Friends Circle] ...ОбновитьЛента VK......');
        console.log('[Friends Circle] ...Статус:', this.isActive);

        // refreshData，Обновить
        const forceFullRefresh = this.manager.lastProcessedMessageIndex < 0;
        await this.manager.refreshData(forceFullRefresh);

        // Статус
        if (this.isActive) {
          console.log('[Friends Circle] Лента VK...，...');
          this.dispatchUpdateEvent();
        } else {
          console.log('[Friends Circle] Лента VK...，...');
        }
      } catch (error) {
        console.error('[Friends Circle] ОбновитьЛента VKerror:', error);
      }
    }

    /**
     * ...Лента VK...
     */
    updateDisplay() {
      try {
        console.log('[Friends Circle] ...Лента VK......');

        this.dispatchUpdateEvent();

        console.log('[Friends Circle] Лента VK...');
      } catch (error) {
        console.error('[Friends Circle] error:', error);
      }
    }

    /**
     * ...
     * @returns {Promise<string>} ...
     */
    async getChatContent() {
      try {
        // 1: contextMonitor
        if (window.contextMonitor?.getCurrentChatMessages) {
          const chatData = await window.contextMonitor.getCurrentChatMessages();
          if (chatData?.messages) {
            return chatData.messages.map(msg => msg.mes || '').join('\n');
          }
        }

        // 2: SillyTavern.getContext
        if (window.SillyTavern?.getContext) {
          const context = window.SillyTavern.getContext();
          if (context?.chat && Array.isArray(context.chat)) {
            return context.chat.map(msg => msg.mes || '').join('\n');
          }
        }

        // 3: chat
        if (window.parent?.chat && Array.isArray(window.parent.chat)) {
          return window.parent.chat.map(msg => msg.mes || '').join('\n');
        }

        return '';
      } catch (error) {
        console.error('[Friends Circle] error:', error);
        return '';
      }
    }

    /**
     * ...ПользовательПодпись
     * @returns {string} ПользовательПодпись
     */
    getUserSignature() {
      return this.userSignature;
    }

    /**
     * НастройкиПользовательПодпись
     * @param {string} signature - ...Подпись
     */
    setUserSignature(signature) {
      this.userSignature = signature;
      localStorage.setItem('friendsCircle_userSignature', signature);
      this.dispatchUpdateEvent();
    }

    /**
     * РедактироватьПользовательПодпись
     */
    editUserSignature() {
      const newSignature = prompt('...Подпись:', this.userSignature);
      if (newSignature !== null && newSignature.trim() !== '') {
        this.setUserSignature(newSignature.trim());
      }
    }

    /**
     * ...Лента VKЛайк
     * @param {string} circleId - Лента VKID
     */
    toggleCircleLike(circleId) {
      const likeData = this.manager.toggleLike(circleId);

      // DOM，
      this.updateLikeButtonUI(circleId, likeData);

      // dispatchUpdateEvent()，
      console.log(
        `[Friends Circle] ЛайкСтатус...: ${circleId}, Лайк...: ${likeData.likes}, ...Лайк: ${likeData.isLiked}`,
      );
    }

    /**
     * ...Лайк...UI
     * @param {string} circleId - Лента VKID
     * @param {Object} likeData - Лайк...
     */
    updateLikeButtonUI(circleId, likeData) {
      // Лайк
      const circleElement = document.querySelector(`[data-circle-id="${circleId}"]`);
      if (!circleElement) return;

      const likeBtn = circleElement.querySelector('.like-btn');
      const likeIcon = likeBtn?.querySelector('i');
      const likeCount = likeBtn?.querySelector('.like-count');

      if (likeBtn && likeIcon && likeCount) {
        if (likeData.isLiked) {
          likeIcon.className = 'fas fa-heart liked';
          likeBtn.classList.add('liked');

          // Лайк/* Анимации */
          likeBtn.classList.add('liked-animation');
          setTimeout(() => {
            likeBtn.classList.remove('liked-animation');
          }, 300);
        } else {
          likeIcon.className = 'far fa-heart';
          likeBtn.classList.remove('liked');
        }

        // Лайк
        likeCount.textContent = likeData.likes;
      }
    }

    /**
     * ...Ответить/* Поле ввода */
     * @param {string} circleId - Лента VKID
     */
    toggleReplyInput(circleId) {
      const inputContainer = document.getElementById(`reply-input-${circleId}`);
      if (inputContainer) {
        const isVisible = inputContainer.style.display !== 'none';

        // Ответить/* Поле ввода */
        document.querySelectorAll('.reply-input-container').forEach(container => {
          container.style.display = 'none';
        });

        // /* Поле ввода */
        if (!isVisible) {
          inputContainer.style.display = 'flex';
          const input = inputContainer.querySelector('.reply-input');
          if (input) {
            input.focus();
          }
        }
      }
    }

    /**
     * ...Лента VKОтветить
     * @param {string} circleId - Лента VKID
     */
    async sendCircleReply(circleId) {
      const inputContainer = document.getElementById(`reply-input-${circleId}`);
      if (!inputContainer) return;

      const input = inputContainer.querySelector('.reply-input');
      if (!input) return;

      const content = input.value.trim();
      if (!content) {
        alert('...Ответить...');
        return;
      }

      try {
        // ОтветитьКомментарий
        const replyToAuthor = input.dataset.replyToAuthor;

        if (replyToAuthor) {
          // ОтветитьКомментарий
          await this.sendReplyToComment(circleId, content, replyToAuthor);
        } else {
          // Ответить
          const replyFormat = `[Лента VKОтветить|{{user}}|483920|${circleId}|${content}]`;

          // ОтправитьAI
          await this.sendToAI(
            `Пользователь...ОтветитьЛента VK。...Пользователь...Ответить...1-3...Ответить，...Ответить，...Пост，...Пользователь...Ответить，ПользовательОтветитьВыполнено。\n${replyFormat}`,
          );

          this.showToast('Ответить...', 'success');
        }

        // /* Поле ввода */
        input.value = '';
        input.placeholder = '......';
        input.removeAttribute('data-reply-to-author');
        input.removeAttribute('data-reply-to-id');
        inputContainer.style.display = 'none';
      } catch (error) {
        console.error('[Friends Circle] errorОтветитьerror:', error);
        this.showToast('...，...', 'error');
      }
    }

    /**
     * ...ОтветитьКомментарий/* Поле ввода */
     * @param {string} circleId - Лента VKID
     * @param {string} replyId - ...Ответить...КомментарийID
     * @param {string} replyAuthor - ...Ответить...Комментарий...
     */
    showReplyToComment(circleId, replyId, replyAuthor) {
      // Ответить/* Поле ввода */
      document.querySelectorAll('.reply-input-container').forEach(container => {
        container.style.display = 'none';
      });

      // Ответить/* Поле ввода */
      const inputContainer = document.getElementById(`reply-input-${circleId}`);
      if (inputContainer) {
        inputContainer.style.display = 'flex';
        const input = inputContainer.querySelector('.reply-input');
        if (input) {
          // НастройкиОтветить
          input.placeholder = `Ответить ${replyAuthor}...`;
          input.focus();

          // Ответить
          input.dataset.replyToAuthor = replyAuthor;
          input.dataset.replyToId = replyId;
        }
      }
    }

    /**
     * ...ОтветитьКомментарий
     * @param {string} circleId - Лента VKID
     * @param {string} content - Ответить...
     * @param {string} replyToAuthor - ...Ответить...Комментарий...
     */
    async sendReplyToComment(circleId, content, replyToAuthor) {
      try {
        // ОтветитьКомментарий
        const replyFormat = `[Лента VKОтветить|{{user}}|483920|${circleId}|Ответить${replyToAuthor}：${content}]`;

        // ОтправитьAI
        await this.sendToAI(
          `Пользователь...ОтветитьЛента VK...Комментарий。...Пользователь...Ответить...1-3...Ответить，...Ответить，...Пост，...Пользователь...Ответить，ПользовательОтветитьВыполнено。\n${replyFormat}`,
        );

        this.showToast('Ответить...', 'success');
      } catch (error) {
        console.error('[Friends Circle] errorОтветитьКомментарийerror:', error);
        this.showToast('...，...', 'error');
      }
    }

    /**
     * ...Сообщения...AI
     * @param {string} message - Сообщения...
     */
    async sendToAI(message) {
      try {
        console.log('[Friends Circle] ...Сообщения...AI:', message);

        const chatMessage = {
          role: 'user',
          message: message,
          send_date: '',
        };

        try {
          window.parent.document.querySelector('#send_textarea').value = message;
          window.parent.document.querySelector('#send_but').click();

          this.showToast('Сообщения...，...', 'success');
        } catch (error) {
          console.error('[Friends Circle] error:', error);
          console.error('[Friends Circle] error。');
          console.log('[Friends Circle] ...Сообщения:', message);
          this.showToast('...。Сообщения...，...。', 'warning');
        }
      } catch (error) {
        console.error('[Friends Circle] errorСообщенияerror:', error);
        this.showToast('...，...', 'error');
        throw error;
      }
    }

    /**
     * ...Сообщения
     * @param {string} message - ...Сообщения
     * @param {string} type - Сообщения...
     */
    showToast(message, type = 'info') {
      if (window.showMobileToast) {
        window.showMobileToast(message, type);
      } else {
        alert(message);
      }
    }

    /**
     * ...Опубликовать...
     */
    showPublishModal() {
      if (this.renderer) {
        this.renderer.showPublishModal();
      }
    }

    /**
     * ...Опубликовать...
     */
    hidePublishModal() {
      if (this.renderer) {
        this.renderer.hidePublishModal();
      }
    }

    /**
     * ...Опубликовать...
     */
    showTextPublish() {
      if (this.renderer) {
        this.renderer.showTextPublishModal();
      }
    }

    /**
     * ...Опубликовать...
     */
    showTextPublishModal() {
      if (this.renderer) {
        this.renderer.showTextPublishModal();
      }
    }

    /**
     * ...Опубликовать...
     */
    showImagePublish() {
      if (this.renderer) {
        this.renderer.showImagePublishModal();
      }
    }

    /**
     * ...Опубликовать...
     */
    showImagePublishModal() {
      if (this.renderer) {
        this.renderer.showImagePublishModal();
      }
    }

    /**
     * ...Лента VK
     * @param {string} content - Лента VK...
     */
    async sendTextCircle(content) {
      try {
        // ID
        const floorId = 'w' + Math.floor(Math.random() * 900 + 100);

        // 🌟 Лента VK
        const currentUserName = this.getCurrentUserName();
        const circleData = {
          id: floorId,
          author: currentUserName, // ...Пользователь...，...{{user}}
          friendId: '483920',
          type: 'text',
          content: content,
          messageIndex: -1,
          latestActivityIndex: -1,
          replies: [],
          likes: 0,
          isLiked: false,
          timestamp: new Date().toISOString(),
        };

        this.manager.friendsCircleData.set(floorId, circleData);
        console.log('[Friends Circle] ...Лента VK...:', circleData);

        this.dispatchUpdateEvent();

        // Лента VK
        const circleFormat = `[Лента VK|{{user}}|483920|${floorId}|${content}]`;

        // ОтправитьAI
        await this.sendToAI(
          `Пользователь...Лента VK，...Лента VKОтветить...3-5...ДрузьяОтветить，...Друзьяid...Друзья...Лента VKОтветить。...，...ПользовательЛента VK...Ответить，...Ответить，...Пользователь...Лента VK...。\n${circleFormat}`,
        );

        // 🌟 Лента VK，ПользовательЛента VK
        setTimeout(async () => {
          try {
            console.log('[Friends Circle] ...Лента VK...，...Пользователь......');
            await this.manager.refreshData(false); // ...Обновить
            if (this.isActive) {
              this.dispatchUpdateEvent();
            }
          } catch (error) {
            console.warn('[Friends Circle] error:', error);
          }
        }, 500); // ...500ms...SillyTavern...Сообщения

        this.showToast('Лента VK...', 'success');
        this.hidePublishModal();
      } catch (error) {
        console.error('[Friends Circle] errorЛента VKerror:', error);
        this.showToast('...，...', 'error');
      }
    }

    /**
     * ...Лента VK
     * @param {string} imageDescription - ...
     * @param {string} textContent - ...
     * @param {File} imageFile - ...（...）
     */
    async sendImageCircle(imageDescription, textContent, imageFile) {
      try {
        // ID
        const floorId = 's' + Math.floor(Math.random() * 900 + 100);

        let finalImageDesc = imageDescription;

        // Если，Загрузить
        if (imageFile && window.mobileUploadManager) {
          try {
            const uploadResult = await window.mobileUploadManager.uploadFile(imageFile);
            if (uploadResult && uploadResult.success) {
              finalImageDesc = '...';
            }
          } catch (uploadError) {
            console.warn('[Friends Circle] errorЗагрузитьerror，error:', uploadError);
          }
        }

        // Лента VK
        let circleFormat;
        if (textContent && textContent.trim()) {
          circleFormat = `[Лента VK|{{user}}|483920|${floorId}|${finalImageDesc}|${textContent}]`;
        } else {
          circleFormat = `[Лента VK|{{user}}|483920|${floorId}|${finalImageDesc}]`;
        }

        // ОтправитьAI
        await this.sendToAI(
          `Пользователь...Лента VK，...Лента VKОтветить...3-5...ДрузьяОтветить，...Друзьяid...Друзья...Лента VKОтветить。...，...ПользовательЛента VK...Ответить，...Ответить，...Пользователь...Лента VK...。\n${circleFormat}`,
        );

        this.showToast('Лента VK...', 'success');
        this.hidePublishModal();
      } catch (error) {
        console.error('[Friends Circle] errorЛента VKerror:', error);
        this.showToast('...，...', 'error');
      }
    }

    /**
     * ...Опубликовать
     * @param {HTMLElement} modal - ...
     */
    handleTextPublish(modal = null) {
      if (!modal) {
        modal = document.querySelector('.friends-circle-text-publish-modal');
      }
      if (!modal) return;

      const textInput = modal.querySelector('.text-input');
      if (!textInput) return;

      const content = textInput.value.trim();
      if (!content) {
        this.showToast('...Лента VK...', 'error');
        return;
      }

      // Лента VK
      this.sendTextCircle(content);
      modal.remove();
    }

    /**
     * ...Опубликовать
     */
    async handleImagePublish() {
      console.log('[Friends Circle] ...Опубликовать...');
      console.log('[Friends Circle] this...:', {
        thisExists: !!this,
        thisConstructorName: this?.constructor?.name,
        hasSelectedImageFile: !!this?.selectedImageFile,
        selectedImageFileName: this?.selectedImageFile?.name,
        globalInstanceExists: !!window.friendsCircle,
        globalInstanceSame: window.friendsCircle === this,
        globalHasSelectedFile: !!window.friendsCircle?.selectedImageFile,
        globalSelectedFileName: window.friendsCircle?.selectedImageFile?.name,
      });

      // Если，，
      if (!this.selectedImageFile && window.friendsCircle?.selectedImageFile) {
        console.log('[Friends Circle] ...');
        this.selectedImageFile = window.friendsCircle.selectedImageFile;
        this.selectedImageElements = window.friendsCircle.selectedImageElements;
      }

      const modal = document.querySelector('.friends-circle-image-publish-modal');
      if (!modal) {
        console.error('[Friends Circle] errorОпубликоватьerror');
        return;
      }

      const imageDescInput = modal.querySelector('.image-desc-input');
      const textInput = modal.querySelector('.text-input');
      const publishBtn = modal.querySelector('#friends-circle-publish-btn');
      const uploadStatus = modal.querySelector('#friends-circle-upload-status');
      const uploadText = modal.querySelector('#friends-circle-upload-text');
      const progressBar = modal.querySelector('#friends-circle-progress-bar');

      console.log('[Friends Circle] ...:', {
        imageDescInput: !!imageDescInput,
        textInput: !!textInput,
        publishBtn: !!publishBtn,
        uploadStatus: !!uploadStatus,
        uploadText: !!uploadText,
        progressBar: !!progressBar,
      });

      if (!imageDescInput) {
        console.error('[Friends Circle] error/* Поле ввода */error');
        return;
      }

      const imageDescription = imageDescInput.value.trim();
      const textContent = textInput ? textInput.value.trim() : '';
      const imageFile = this.selectedImageFile;

      console.log('[Friends Circle] Опубликовать...:', {
        imageDescription: imageDescription,
        textContent: textContent,
        hasImageFile: !!imageFile,
        imageFileName: imageFile ? imageFile.name : 'none',
        selectedImageFileExists: !!this.selectedImageFile,
      });

      // -
      if (!imageDescription && !imageFile) {
        console.warn('[Friends Circle] error - error');
        this.showToast('...Загрузить...', 'error');
        return;
      }

      console.log('[Friends Circle] Опубликовать...:', {
        hasDescription: !!imageDescription,
        hasImageFile: !!imageFile,
        imageFileName: imageFile ? imageFile.name : 'none',
      });

      try {
        // Опубликовать，ЗагрузитьСтатус
        if (publishBtn) {
          publishBtn.disabled = true;
          publishBtn.textContent = 'Опубликовать......';
        }

        let uploadResult = null;
        let finalImageDescription = imageDescription || '...';

        // Если，Загрузить
        if (imageFile) {
          console.log('[Friends Circle] ...Загрузить...:', imageFile.name);

          // ЗагрузитьСтатус
          if (uploadStatus) {
            uploadStatus.style.display = 'block';
            if (uploadText) uploadText.textContent = '...Загрузить......';
            if (progressBar) progressBar.style.width = '30%';
          }

          // SillyTavern
          if (!window.attachmentSender) {
            throw new Error('errorЗагрузитьerror');
          }

          // simulateFileInputUpload，SillyTavern
          uploadResult = await window.attachmentSender.simulateFileInputUpload(imageFile);

          if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'errorЗагрузитьerror');
          }

          console.log('[Friends Circle] ...SillyTavern:', uploadResult);

          if (progressBar) progressBar.style.width = '70%';
          if (uploadText) uploadText.textContent = '...，...Опубликовать...';

          // Если，
          if (!imageDescription) {
            finalImageDescription = `...: ${uploadResult.fileName}`;
          }
        }

        if (progressBar) progressBar.style.width = '90%';
        if (uploadText) uploadText.textContent = '...ОпубликоватьЛента VK...';

        // Лента VK
        await this.sendImageCircleWithUpload(finalImageDescription, textContent, uploadResult);

        if (progressBar) progressBar.style.width = '100%';
        if (uploadText) uploadText.textContent = 'Опубликовать...！';

        // SillyTavernСтатус，SillyTavernСообщения
        // this.clearSillyTavernAttachment();

        // Закрыть
        setTimeout(() => {
          modal.remove();
          this.showToast('Лента VKОпубликовать...！', 'success');
        }, 1000);
      } catch (error) {
        console.error('[Friends Circle] errorЛента VKОпубликоватьerror:', error);

        // Статус
        if (publishBtn) {
          publishBtn.disabled = false;
          publishBtn.textContent = 'Опубликовать';
        }

        // ЗагрузитьСтатус
        if (uploadStatus) {
          uploadStatus.style.display = 'none';
        }

        this.showToast(error.message || 'Опубликовать...，...', 'error');
      }
    }

    /**
     * ...Загрузить...Лента VK
     */
    async sendImageCircleWithUpload(imageDescription, textContent, uploadResult) {
      try {
        // ID
        const floorId = 's' + Math.floor(Math.random() * 900 + 100);

        // uploadResult
        const fileName = uploadResult?.file?.name || uploadResult?.fileName || '...';

        // Лента VK
        let circleFormat;
        if (textContent && textContent.trim()) {
          circleFormat = `[Лента VK|{{user}}|483920|${floorId}|...: ${fileName}|${textContent}]`;
        } else {
          circleFormat = `[Лента VK|{{user}}|483920|${floorId}|...: ${fileName}]`;
        }

        console.log('[Friends Circle] ...Лента VK...:', circleFormat);

        // 🌟 Лента VK，SillyTavern
        const currentUserName = this.getCurrentUserName();

        // URL（）
        let imageUrl = null;
        try {
          // ЗагрузитьURL
          if (uploadResult && uploadResult.fileUrl && uploadResult.fileUrl !== 'attached_to_sillytavern') {
            imageUrl = uploadResult.fileUrl;
            console.log('[Friends Circle] ...Загрузить...URL:', imageUrl);
          } else {
            // SillyTavernНовоеURL
            const recentImageUrl = await this.tryGetRecentImageUrl();
            if (recentImageUrl) {
              imageUrl = recentImageUrl;
              console.log('[Friends Circle] ...Новое...URL:', imageUrl);
            }
          }
        } catch (error) {
          console.warn('[Friends Circle] errorURLerror，error:', error);
        }

        const circleData = {
          id: floorId,
          author: currentUserName, // ...Пользователь...，...{{user}}
          friendId: '483920',
          type: 'visual',
          imageDescription: `...: ${fileName}`,
          imageUrl: imageUrl, // ...URL...
          content: textContent || '',
          messageIndex: -1,
          latestActivityIndex: -1,
          replies: [],
          likes: 0,
          isLiked: false,
          timestamp: new Date().toISOString(),
        };

        this.manager.friendsCircleData.set(floorId, circleData);
        console.log('[Friends Circle] ...Лента VK...:', circleData);

        this.dispatchUpdateEvent();

        // Сообщения，
        const fullMessage = `Пользователь...Лента VK，...Лента VKОтветить...3-5...ДрузьяОтветить，...Друзьяid...Друзья...Лента VKОтветить。...，...ПользовательЛента VK...Ответить，...Ответить，...Пользователь...Лента VK...。\n${circleFormat}`;

        // Лента VKСообщения，SillyTavern
        await this.sendToAI(fullMessage);

        // 🌟 Лента VK，ПользовательЛента VK
        setTimeout(async () => {
          try {
            console.log('[Friends Circle] ...Лента VK...，...Пользователь......');
            await this.manager.refreshData(false); // ...Обновить
            if (this.isActive) {
              this.dispatchUpdateEvent();
            }
          } catch (error) {
            console.warn('[Friends Circle] error:', error);
          }
        }, 500); // ...500ms...SillyTavern...Сообщения

        // SillyTavernСообщения
        if (uploadResult && uploadResult.success) {
          console.log('[Friends Circle] ...SillyTavern...Сообщения...');

          // ，SillyTavernВремя
          setTimeout(async () => {
            try {
              // SillyTavernURL
              await this.extractImageFromSillyTavern(floorId, fileName, textContent);
            } catch (error) {
              console.warn('[Friends Circle] error:', error);
              // ，Лента VK
            } finally {
              // SillyTavernСтатус
              this.clearSillyTavernAttachment();
            }
          }, 2000); // ...2...SillyTavern...
        }

        console.log('[Friends Circle] ...Лента VK...');
      } catch (error) {
        console.error('[Friends Circle] errorЛента VKerror:', error);
        throw error;
      }
    }

    /**
     * ...Новое...URL
     * @returns {Promise<string|null>} ...URL...null
     */
    async tryGetRecentImageUrl() {
      try {
        // SillyTavern.getContext()
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            const chatMessages = context.chat;

            // Сообщения
            const recentMessages = chatMessages.slice(-3); // ...3...Сообщения
            for (const message of recentMessages.reverse()) {
              if (message.extra && message.extra.image) {
                console.log('[Friends Circle] ...Новое...URL:', message.extra.image);
                return message.extra.image;
              }
            }
          }
        }

        return null;
      } catch (error) {
        console.warn('[Friends Circle] errorНовоеerrorURLerror:', error);
        return null;
      }
    }

    /**
     * ...SillyTavern...
     */
    async extractImageFromSillyTavern(floorId, imageDescription, textContent) {
      try {
        console.log('[Friends Circle] ...SillyTavern......');

        // SillyTavern（message-app.js）
        let chatMessages = null;

        // SillyTavern.getContext().chat
        if (
          typeof window !== 'undefined' &&
          window.SillyTavern &&
          typeof window.SillyTavern.getContext === 'function'
        ) {
          const context = window.SillyTavern.getContext();
          if (context && context.chat && Array.isArray(context.chat)) {
            chatMessages = context.chat;
            console.log('[Friends Circle] ...SillyTavern.getContext()...:', chatMessages.length, '...Сообщения');
          }
        }

        // ：
        if (!chatMessages) {
          const chat = window['chat'];
          if (chat && Array.isArray(chat)) {
            chatMessages = chat;
            console.log('[Friends Circle] ...:', chatMessages.length, '...Сообщения');
          }
        }

        if (!chatMessages || !Array.isArray(chatMessages)) {
          throw new Error('errorSillyTavernerror');
        }

        // Сообщения
        const recentMessages = chatMessages.slice(-5); // ...5...Сообщения
        let imageUrl = null;
        let fileName = null;

        console.log(
          '[Friends Circle] ...Сообщения:',
          recentMessages.map(m => ({
            content: m.mes || m.content,
            extra: m.extra,
            hasImage: !!(m.extra && m.extra.image),
          })),
        );

        for (const message of recentMessages.reverse()) {
          if (message.extra && message.extra.image) {
            imageUrl = message.extra.image;
            fileName = imageUrl.split('/').pop();
            console.log('[Friends Circle] ...:', { imageUrl, fileName });
            break;
          }
        }

        // Если，Сообщения（message-renderer.js）
        if (!imageUrl) {
          console.log('[Friends Circle] ...extra...，...Сообщения......');

          for (const message of recentMessages.reverse()) {
            const content = message.mes || message.content || '';

            // Лента VK
            if (content.includes('...:') || content.includes('[Лента VK|')) {
              const imageRegex = /...:\s*([^|\]]+)/;
              const match = content.match(imageRegex);

              if (match) {
                fileName = match[1].trim();
                console.log('[Friends Circle] ...Сообщения...:', fileName);

                // AttachmentSenderURL（message-renderer.js）
                if (window.attachmentSender && typeof window.attachmentSender.buildImageUrl === 'function') {
                  // Пользователь
                  const userName = this.getCurrentUserName();
                  imageUrl = window.attachmentSender.buildImageUrl(userName, fileName);
                } else {
                  // ：，SillyTavern
                  const userName = this.getCurrentUserName();
                  imageUrl = `/user/images/${userName}/${fileName}`;
                }

                console.log('[Friends Circle] ...URL:', imageUrl);
                break;
              }
            }
          }
        }

        if (imageUrl) {
          // URL
          const fullImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

          // 🌟 Лента VK，
          const existingData = this.manager.friendsCircleData.get(floorId);
          if (existingData) {
            existingData.imageUrl = fullImageUrl;
            existingData.imageFileName = fileName;
            if (imageDescription && imageDescription !== existingData.imageDescription) {
              existingData.imageDescription = imageDescription;
            }

            console.log('[Friends Circle] ...Лента VK...:', {
              id: floorId,
              imageUrl: fullImageUrl,
              imageFileName: fileName,
            });
          } else {
            // Если（），
            const currentUserName = this.getCurrentUserName();
            const circleData = {
              id: floorId,
              author: currentUserName, // ...Пользователь...
              friendId: '483920',
              type: 'visual',
              imageDescription: imageDescription,
              imageUrl: fullImageUrl,
              imageFileName: fileName,
              content: textContent || '',
              messageIndex: -1,
              latestActivityIndex: -1,
              replies: [],
              likes: 0,
              isLiked: false,
              timestamp: new Date().toISOString(),
            };

            this.manager.friendsCircleData.set(floorId, circleData);
            console.log('[Friends Circle] ...Лента VK...:', circleData);
          }

          this.dispatchUpdateEvent();
        } else {
          console.warn('[Friends Circle] error，error');
        }
      } catch (error) {
        console.error('[Friends Circle] error:', error);
        throw error;
      }
    }

    /**
     * ...SillyTavern...Статус
     */
    clearSillyTavernAttachment() {
      try {
        console.log('[Friends Circle] ...SillyTavern...Статус...');

        // SillyTavern
        const resetButton = document.getElementById('file_form_reset');
        if (resetButton) {
          console.log('[Friends Circle] ...SillyTavern...，...');
          resetButton.click();
          console.log('[Friends Circle] SillyTavern...');
        } else {
          console.log('[Friends Circle] ...SillyTavern...');

          // ：/* Поле ввода */
          const fileInput = document.getElementById('file_form_input');
          if (fileInput) {
            fileInput.value = '';
            console.log('[Friends Circle] .../* Поле ввода */...（...）');
          }
        }
      } catch (error) {
        console.error('[Friends Circle] errorСтатусerror:', error);
      }
    }

    /**
     * ...
     */
    dispatchUpdateEvent() {
      const event = new CustomEvent('friendsCircleUpdate', {
        detail: {
          timestamp: Date.now(),
          circles: this.manager.getSortedFriendsCircles(),
        },
      });
      window.dispatchEvent(event);
    }

    /**
     * ...Лента VK...
     */
    testVisualCircleParsing() {
      console.log('[Friends Circle] ...Лента VK......');

      const correctFormats = [
        '[Лента VK|...|200005|s102|...。...，...。...、...，...。|Сегодня...！]',
        '[Лента VK|...|500002|w101|...，...？]',
        '[Лента VKОтветить|...|300004|w101|...，...，...？]',
      ];

      // （）
      const incorrectFormats = [
        '- ...: 001 - Время: 2025...8...22...',
        '| ... | ... | ... | ...Статус | ... | ... |',
        '| ... | ... | ...，... | ...，... | ... | ... |',
        '...:...Лента VK，...、...、...Опубликовать...',
      ];

      console.log('=== ... ===');
      correctFormats.forEach((content, index) => {
        console.log(`... ${index + 1}: ${content}`);
        this.manager.testVisualCircleParsing(content);
      });

      console.log('=== ...（...） ===');
      incorrectFormats.forEach((content, index) => {
        console.log(`... ${index + 1}: ${content}`);
        this.manager.testVisualCircleParsing(content);
      });
    }

    /**
     * ...
     */
    async debugChatContent() {
      console.log('=== ... ===');

      try {
        const chatContent = await this.getChatContent();
        console.log('...:', chatContent.length);
        console.log('...500...:', chatContent.substring(0, 500));

        // Лента VK
        const friendsCircleMatches = chatContent.match(/\[Лента VK[^\]]*\]/g);
        console.log('...Лента VK...:', friendsCircleMatches?.length || 0);
        if (friendsCircleMatches) {
          console.log('Лента VK...:', friendsCircleMatches);
        }

        const tableMatches = chatContent.match(/\|[^|]*\|/g);
        console.log('...:', tableMatches?.length || 0);
        if (tableMatches && tableMatches.length > 0) {
          console.log('...:', tableMatches.slice(0, 5));
        }

        console.log('=== ... ===');
        const circles = this.manager.parseFriendsCircleData(chatContent);
        console.log('...Лента VK...:', circles.size);

        circles.forEach((circle, id) => {
          console.log(`Лента VK ${id}:`, {
            author: circle.author,
            type: circle.type,
            content: circle.content?.substring(0, 100) + '...',
            imageDescription: circle.imageDescription?.substring(0, 100) + '...',
          });
        });
      } catch (error) {
        console.error('error:', error);
      }
    }

    /**
     * ...Статус
     */
    debugListenerStatus() {
      console.log('=== Лента VK... ===');
      console.log('...Статус:', this.eventListener?.isListening);
      console.log('Лента VK...Статус:', this.isActive);
      console.log('...Сообщения...:', this.eventListener?.getCurrentMessageCount());
      console.log('...Сообщения...:', this.eventListener?.lastMessageCount);

      console.log('...:');
      console.log('- window.SillyTavern:', !!window.SillyTavern);
      console.log('- window.SillyTavern.getContext:', !!window.SillyTavern?.getContext);

      if (window.SillyTavern?.getContext) {
        const context = window.SillyTavern.getContext();
        console.log('- context:', !!context);
        console.log('- context.eventSource:', !!context?.eventSource);
        console.log('- context.event_types:', !!context?.event_types);
        console.log('- context.event_types.MESSAGE_RECEIVED:', context?.event_types?.MESSAGE_RECEIVED);
      }

      console.log('- eventOn...:', typeof eventOn);
      console.log('- tavern_events:', typeof tavern_events);
      console.log('- window.parent.eventSource:', !!window.parent?.eventSource);
      console.log('- window.eventSource:', typeof window.eventSource);

      console.log('=== ... ===');
      this.testChatDataAccess();

      if (this.eventListener) {
        console.log('...Сообщения......');
        this.eventListener.checkForNewMessages();
      }
    }

    /**
     * ...
     */
    async testChatDataAccess() {
      console.log('[Debug] ......');

      // 1: SillyTavern.getContext
      if (window.SillyTavern?.getContext) {
        try {
          const context = window.SillyTavern.getContext();
          console.log('[Debug] SillyTavern.getContext():', !!context);
          if (context?.chat) {
            console.log('[Debug] context.chat ...:', context.chat.length);
            console.log('[Debug] ...Сообщения:', context.chat[context.chat.length - 1]?.mes?.substring(0, 100));
          }
        } catch (error) {
          console.log('[Debug] SillyTavern.getContext ...:', error);
        }
      }

      // 2: contextMonitor
      if (window.contextMonitor?.getCurrentChatMessages) {
        try {
          const chatData = await window.contextMonitor.getCurrentChatMessages();
          console.log('[Debug] contextMonitor ...:', !!chatData);
          if (chatData?.messages) {
            console.log('[Debug] contextMonitor Сообщения...:', chatData.messages.length);
          }
        } catch (error) {
          console.log('[Debug] contextMonitor ...:', error);
        }
      }

      // 3:
      if (window.parent?.chat) {
        try {
          console.log('[Debug] window.parent.chat ...:', window.parent.chat.length);
        } catch (error) {
          console.log('[Debug] window.parent.chat ...:', error);
        }
      }
    }

    /**
     * ...
     */
    restartListener() {
      console.log('[Friends Circle] ......');
      if (this.eventListener) {
        this.eventListener.stopListening();
        setTimeout(() => {
          this.eventListener.startListening();
        }, 1000);
      }
    }

    /**
     * ...Лента VK...
     */
    debugAll() {
      console.log('=== Лента VK... ===');

      // 1. Статус
      console.log('1. ...Статус:');
      console.log('- Лента VK...:', !!this);
      console.log('- ...:', !!this.manager);
      console.log('- ...:', !!this.renderer);
      console.log('- ...:', !!this.eventListener);
      console.log('- Лента VK...Статус:', this.isActive);

      // 2. Статус
      console.log('2. ...Статус:');
      const circles = this.manager?.getSortedFriendsCircles() || [];
      console.log('- Лента VK...:', circles.length);
      circles.forEach((circle, index) => {
        console.log(`- Лента VK ${index + 1}:`, {
          id: circle.id,
          type: circle.type,
          author: circle.author,
          hasImageDescription: !!circle.imageDescription,
          hasContent: !!circle.content,
        });
      });

      // 3. DOMСтатус
      console.log('3. DOMСтатус:');
      const circleElements = document.querySelectorAll('.circle-item');
      console.log('- ...Лента VK...:', circleElements.length);

      // 4. ОпубликоватьСтатус
      console.log('4. Опубликовать...Статус:');
      const publishModal = document.querySelector('.friends-circle-publish-modal');
      console.log('- Опубликовать...:', !!publishModal);
      if (publishModal) {
        console.log('- ...:', window.getComputedStyle(publishModal).display);
        console.log('- ...:', publishModal.getBoundingClientRect());
      }

      // 5. Статус
      this.debugListenerStatus();

      // 6. Опубликовать
      console.log('5. ...Опубликовать...:');
      if (this.renderer) {
        console.log('- ...Опубликовать......');
        this.renderer.showPublishModal();
      }
    }

    /**
     * ...Лента VK（...）
     */
    async forceActivate() {
      console.log('[Friends Circle] ...Лента VK...');

      // 1. НастройкиСтатус
      this.isActive = true;
      console.log('[Friends Circle] ...Статус...Настройки... true');

      // 2. header
      this.updateHeader();

      // 3. Обновить
      await this.refreshFriendsCircle();

      // 4.
      if (this.eventListener) {
        this.eventListener.startListening();
        console.log('[Friends Circle] ...');
      }

      // 5.
      const circles = this.manager?.getSortedFriendsCircles() || [];
      console.log('[Friends Circle] ...，Лента VK...:', circles.length);

      return circles.length > 0;
    }

    /**
     * ...
     */
    testNewSortingSystem() {
      console.log('=== ...Сообщения... ===');

      // Лента VK
      const circles = this.manager.getSortedFriendsCircles();

      console.log('Лента VK...:');
      circles.forEach((circle, index) => {
        console.log(`${index + 1}. ${circle.author} (${circle.id}):`, {
          messageIndex: circle.messageIndex,
          latestActivityIndex: circle.latestActivityIndex,
          repliesCount: circle.replies?.length || 0,
          content: circle.content?.substring(0, 30) + '...',
        });
      });

      let isCorrectlySorted = true;
      for (let i = 1; i < circles.length; i++) {
        if (circles[i - 1].latestActivityIndex < circles[i].latestActivityIndex) {
          isCorrectlySorted = false;
          console.error(
            `...: ... ${i - 1} ...Лента VK... (${
              circles[i - 1].latestActivityIndex
            }) ... ${i} ...Лента VK... (${circles[i].latestActivityIndex})`,
          );
        }
      }

      if (isCorrectlySorted) {
        console.log('✅ ...：Лента VK...Новое...');
      } else {
        console.error('❌ error：error');
      }

      console.log('=== ... ===');
      return { circles, isCorrectlySorted };
    }

    /**
     * ...
     */
    testIncrementalUpdate() {
      console.log('=== ... ===');

      console.log('...Статус:');
      console.log('- Лента VK...:', this.manager.friendsCircleData.size);
      console.log('- ...Сообщения...:', this.manager.lastProcessedMessageIndex);

      console.log('......');
      this.manager.refreshData(false);

      console.log('=== ... ===');
    }

    /**
     * ...
     */
    verifyDataPersistence() {
      console.log('=== ...Лента VK... ===');

      const manager = this.manager;
      console.log('...ID:', manager.constructor.name);
      console.log('Лента VK...:', manager.friendsCircleData.size);
      console.log('...:', manager.lastProcessedMessageIndex);

      console.log('...:', !!window.friendsCircle);
      console.log('...:', window.friendsCircle === this);

      if (window.messageApp) {
        console.log('MessageAppЛента VK...:', !!window.messageApp.friendsCircle);
        console.log('MessageApp...:', window.messageApp.friendsCircle === window.friendsCircle);
      }

      // Лента VK
      const circles = manager.getSortedFriendsCircles();
      console.log('Лента VK/* Список */:');
      circles.forEach((circle, index) => {
        console.log(`${index + 1}. ${circle.author} (${circle.id}): ${circle.replies?.length || 0} ...Ответить`);
      });

      console.log('=== ... ===');
    }

    /**
     * ...ОбновитьЛента VK...（...）
     */
    async forceRefresh() {
      console.log('=== ...ОбновитьЛента VK... ===');

      try {
        // Обновить
        await this.manager.refreshData(true);

        if (this.isActive) {
          this.dispatchUpdateEvent();
        }

        console.log('...Обновить...，Лента VK...:', this.manager.friendsCircleData.size);
      } catch (error) {
        console.error('errorОбновитьerror:', error);
      }

      console.log('=== ...Обновить... ===');
    }

    /**
     * ...Статус
     */
    checkPageStatus() {
      console.log('=== ...Статус... ===');

      // message-appСтатус
      if (window.messageApp) {
        console.log('- messageApp...:', true);
        console.log('- currentMainTab:', window.messageApp.currentMainTab);
        console.log('- currentView:', window.messageApp.currentView);
        console.log('- friendsCircle...:', !!window.messageApp.friendsCircle);
        console.log('- friendsCircle...Статус:', window.messageApp.friendsCircle?.isActive);
      } else {
        console.log('- messageApp...:', false);
      }

      // Лента VK
      console.log('- window.friendsCircle...:', !!window.friendsCircle);
      console.log('- window.friendsCircle...Статус:', window.friendsCircle?.isActive);

      // DOMСтатус
      const friendsCirclePage = document.querySelector('.friends-circle-page');
      console.log('- Лента VK...DOM...:', !!friendsCirclePage);

      return {
        messageAppExists: !!window.messageApp,
        currentTab: window.messageApp?.currentMainTab,
        friendsCircleActive: window.friendsCircle?.isActive,
        domExists: !!friendsCirclePage,
      };
    }

    /**
     * ...
     */
    testModalInteraction() {
      console.log('[Friends Circle Debug] ......');

      const modal = document.querySelector('.friends-circle-publish-modal');
      if (!modal) {
        console.log('[Friends Circle Debug] ...，...');
        this.showPublishModal();
        setTimeout(() => this.testModalInteraction(), 200);
        return;
      }

      console.log('[Friends Circle Debug] ...，......');

      const textBtn = modal.querySelector('.text-btn');
      const imageBtn = modal.querySelector('.image-btn');
      const closeBtn = modal.querySelector('.modal-close');
      const overlay = modal.querySelector('.modal-overlay');

      if (textBtn) {
        console.log('[Friends Circle Debug] ...');
        textBtn.click();

        setTimeout(() => {
          console.log('[Friends Circle Debug] ...showTextPublishModal...');
          this.renderer.showTextPublishModal();
        }, 1000);
      }

      if (closeBtn) {
        setTimeout(() => {
          console.log('[Friends Circle Debug] ...Закрыть...');
          closeBtn.click();
        }, 2000);
      }
    }

    /**
     * ...Опубликовать...
     */
    testTextPublishModal() {
      console.log('[Friends Circle Debug] ...Опубликовать......');

      const modal = document.querySelector('.friends-circle-text-publish-modal');
      if (!modal) {
        console.log('[Friends Circle Debug] ...Опубликовать...');
        return;
      }

      console.log('[Friends Circle Debug] ...Опубликовать...');

      const modalStyle = window.getComputedStyle(modal);
      console.log('[Friends Circle Debug] ...:', {
        display: modalStyle.display,
        position: modalStyle.position,
        zIndex: modalStyle.zIndex,
        visibility: modalStyle.visibility,
        opacity: modalStyle.opacity,
        pointerEvents: modalStyle.pointerEvents,
      });

      const cancelBtn = modal.querySelector('.cancel-btn');
      const sendBtn = modal.querySelector('.send-btn');
      const closeBtn = modal.querySelector('.modal-close');
      const textInput = modal.querySelector('.text-input');

      console.log('[Friends Circle Debug] ...:', {
        cancelBtn: !!cancelBtn,
        sendBtn: !!sendBtn,
        closeBtn: !!closeBtn,
        textInput: !!textInput,
      });

      // /* Поле ввода */
      if (textInput) {
        console.log('[Friends Circle Debug] .../* Поле ввода */...');
        textInput.value = '...';
        textInput.dispatchEvent(new Event('input'));
        console.log('[Friends Circle Debug] /* Поле ввода */...:', textInput.value);
      }

      if (cancelBtn) {
        setTimeout(() => {
          console.log('[Friends Circle Debug] ...Отменить...');
          cancelBtn.click();
        }, 1000);
      }
    }

    /**
     * ...
     */
    fixModalInteraction() {
      console.log('[Friends Circle Debug] ......');

      const publishModal = document.querySelector('.friends-circle-publish-modal');
      const textModal = document.querySelector('.friends-circle-text-publish-modal');

      [publishModal, textModal].forEach((modal, index) => {
        if (!modal) return;

        const modalType = index === 0 ? 'Опубликовать...' : '...Опубликовать';
        console.log(`[Friends Circle Debug] ...${modalType}......`);

        // Настройки
        modal.style.zIndex = '99999';
        modal.style.pointerEvents = 'auto';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.right = '0';
        modal.style.bottom = '0';

        const content = modal.querySelector('.modal-content');
        if (content) {
          content.style.pointerEvents = 'auto';
          content.style.zIndex = '100000';
          content.style.position = 'relative';
        }

        const buttons = modal.querySelectorAll('button');
        buttons.forEach(btn => {
          btn.style.pointerEvents = 'auto';
          btn.style.zIndex = '100001';
          btn.style.position = 'relative';

          btn.addEventListener(
            'click',
            e => {
              console.log(`[Friends Circle Debug] ...:`, btn.className, e);
            },
            true,
          );
        });

        // /* Поле ввода */
        const inputs = modal.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.style.pointerEvents = 'auto';
          input.style.zIndex = '100001';
        });

        console.log(`[Friends Circle Debug] ${modalType}...`);
      });
    }
  }

  // Экспорт класса
  window.FriendsCircleManager = FriendsCircleManager;
  window.FriendsCircleEventListener = FriendsCircleEventListener;
  window.FriendsCircleRenderer = FriendsCircleRenderer;
  window.FriendsCircle = FriendsCircle;

  console.log('[Friends Circle] Лента VK...');
}
