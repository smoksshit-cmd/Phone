/**
 * ... - ...Загрузить...
 * ...、...Загрузить...
 */

// @ts-check
// TypeScript
/**
 * @typedef {Object} UploadResult
 * @property {boolean} success
 * @property {string} fileUrl
 * @property {string} fileName
 * @property {number} fileSize
 * @property {string} fileType
 * @property {string} uploadMethod
 */

/**
 * @typedef {Object} AttachmentSenderGlobal
 * @property {Object} attachmentSender
 * @property {Function} testAttachmentSender
 * @property {Function} checkAttachmentEnvironment
 * @property {Function} testSillyTavernUpload
 * @property {Function} testImageMessageFlow
 * @property {Function} testImageMessageParsing
 * @property {Function} testMultipleImageFormats
 * @property {Function} checkSillyTavernMessages
 */

// Window
// @ts-ignore
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.AttachmentSender = window.AttachmentSender || undefined;
  // @ts-ignore
  window.attachmentSender = window.attachmentSender || undefined;
}

(function (window) {
  'use strict';

  class AttachmentSender {
    constructor() {
      this.currentChatTarget = null;
      this.currentChatName = null;
      this.isCurrentChatGroup = false;

      this.supportedTypes = {
        images: [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/bmp',
          'image/tiff',
          'image/svg+xml',
        ],
        documents: [
          'application/pdf',
          'text/plain',
          'text/csv',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ],
        archives: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
        audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
        video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
      };

      // (10MB)
      this.maxFileSize = 10 * 1024 * 1024;

      console.log('[AttachmentSender] ...');
    }

    // Настройки
    setCurrentChat(targetId, targetName, isGroup = false) {
      console.log(`[AttachmentSender] 🔍 Настройки...: ${targetName} (${targetId}), ...: ${isGroup}`);
      this.currentChatTarget = targetId;
      this.currentChatName = targetName;
      this.isCurrentChatGroup = isGroup;

      console.log(`[AttachmentSender] ✅ ...Настройки...:`, {
        target: this.currentChatTarget,
        name: this.currentChatName,
        isGroup: this.isCurrentChatGroup,
      });
    }

    isFileTypeSupported(file) {
      const allSupportedTypes = [
        ...this.supportedTypes.images,
        ...this.supportedTypes.documents,
        ...this.supportedTypes.archives,
        ...this.supportedTypes.audio,
        ...this.supportedTypes.video,
      ];

      return allSupportedTypes.includes(file.type);
    }

    getFileCategory(file) {
      if (this.supportedTypes.images.includes(file.type)) return 'image';
      if (this.supportedTypes.documents.includes(file.type)) return 'document';
      if (this.supportedTypes.archives.includes(file.type)) return 'archive';
      if (this.supportedTypes.audio.includes(file.type)) return 'audio';
      if (this.supportedTypes.video.includes(file.type)) return 'video';
      return 'unknown';
    }

    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    validateFile(file) {
      const errors = [];

      if (file.size > this.maxFileSize) {
        errors.push(`... (... ${this.formatFileSize(this.maxFileSize)})`);
      }

      if (!this.isFileTypeSupported(file)) {
        errors.push('...');
      }

      if (!file.name || file.name.trim() === '') {
        errors.push('...');
      }

      return {
        isValid: errors.length === 0,
        errors: errors,
      };
    }

    createFilePreview(file) {
      const category = this.getFileCategory(file);
      const fileSize = this.formatFileSize(file.size);

      let previewContent = '';
      let icon = '📄';

      switch (category) {
        case 'image':
          icon = '🖼️';
          // ，
          const imageUrl = URL.createObjectURL(file);
          previewContent = `
                        <div class="file-preview-image">
                            <img src="${imageUrl}" alt="${file.name}" style="max-width: 100px; max-height: 100px; border-radius: 4px;">
                        </div>
                    `;
          break;
        case 'document':
          icon = '📄';
          break;
        case 'archive':
          icon = '📦';
          break;
        case 'audio':
          icon = '🎵';
          break;
        case 'video':
          icon = '🎬';
          break;
        default:
          icon = '📎';
      }

      return {
        icon,
        category,
        previewContent,
        fileName: file.name,
        fileSize,
        file,
      };
    }

    // ЗагрузитьSillyTavern
    async uploadFileToSillyTavern(file) {
      try {
        console.log(`[AttachmentSender] 🔍 ...Загрузить...SillyTavern: ${file.name}`);
        console.log(`[AttachmentSender] 🔍 ...:`, {
          name: file.name,
          size: file.size,
          type: file.type,
        });

        // 1: SillyTavernuploadFileAttachmentToServer
        if (window.uploadFileAttachmentToServer) {
          console.log(`[AttachmentSender] 🔍 ...uploadFileAttachmentToServerЗагрузить`);

          try {
            const uploadedUrl = await window.uploadFileAttachmentToServer(file, 'chat');
            console.log(`[AttachmentSender] ✅ uploadFileAttachmentToServerЗагрузить...:`, uploadedUrl);

            return {
              success: true,
              fileUrl: uploadedUrl,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              uploadMethod: 'uploadFileAttachmentToServer',
            };
          } catch (error) {
            console.warn(`[AttachmentSender] ⚠️ uploadFileAttachmentToServererror:`, error);
          }
        }

        // 2: SillyTavernЗагрузитьAPI
        console.log(`[AttachmentSender] 🔍 .../api/files/upload API`);

        try {
          // base64
          const base64Data = await this.fileToBase64(file);

          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substring(2, 8);
          const fileExtension = file.name.split('.').pop() || 'txt';
          const uniqueFileName = `mobile_attachment_${timestamp}_${randomId}.${fileExtension}`;

          console.log(`[AttachmentSender] 🔍 ...:`, uniqueFileName);

          const response = await fetch('/api/files/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: uniqueFileName,
              data: base64Data,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`[AttachmentSender] ✅ APIЗагрузить...:`, result);

            return {
              success: true,
              fileUrl: result.path || result.url || uniqueFileName,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              uploadMethod: 'api',
              uploadResult: result,
            };
          } else {
            console.warn(`[AttachmentSender] ⚠️ APIЗагрузитьerror:`, response.status, response.statusText);
          }
        } catch (error) {
          console.warn(`[AttachmentSender] ⚠️ APIЗагрузитьerror:`, error);
        }

        // 3: SillyTavernЗагрузить
        console.log(`[AttachmentSender] 🔍 ...Загрузить`);

        try {
          const result = await this.simulateFileInputUpload(file);
          if (result.success) {
            return result;
          }
        } catch (error) {
          console.warn(`[AttachmentSender] ⚠️ errorЗагрузитьerror:`, error);
        }

        // ：URL（ЗагрузитьSillyTavern）
        console.log(`[AttachmentSender] ⚠️ ...Загрузить...，...URL...`);
        const fileUrl = URL.createObjectURL(file);

        return {
          success: true,
          fileUrl: fileUrl,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          isLocalFile: true,
          uploadMethod: 'local',
        };
      } catch (error) {
        console.error(`[AttachmentSender] ❌ errorЗагрузитьerror:`, error);
        return {
          success: false,
          error: error.message,
        };
      }
    }

    // base64
    async fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // data:，base64
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // SillyTavernЗагрузить
    async simulateFileInputUpload(file) {
      try {
        console.log(`[AttachmentSender] 🔍 ...Загрузить`);

        // SillyTavern
        const fileInput = document.getElementById('file_form_input');
        if (!fileInput) {
          throw new Error('errorSillyTavernerror');
        }

        console.log(`[AttachmentSender] 🔍 ...，...Настройки...`);

        // DataTransfer
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        // Настройки
        fileInput.files = dataTransfer.files;

        // change
        const changeEvent = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(changeEvent);

        console.log(`[AttachmentSender] 🔍 ...change...`);

        // SillyTavern
        await new Promise(resolve => setTimeout(resolve, 1000));

        const fileAttached = document.querySelector('.file_attached');
        if (fileAttached) {
          console.log(`[AttachmentSender] ✅ ...SillyTavern...`);

          return {
            success: true,
            fileUrl: 'attached_to_sillytavern',
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadMethod: 'simulate',
          };
        } else {
          throw new Error('errorSillyTavernerror');
        }
      } catch (error) {
        console.error(`[AttachmentSender] ❌ errorЗагрузитьerror:`, error);
        return {
          success: false,
          error: error.message,
        };
      }
    }

    // СообщенияSillyTavern
    async sendAttachmentMessage(uploadResult, additionalMessages = '') {
      console.log('[AttachmentSender] 🔍 ...Сообщения');
      console.log('[AttachmentSender] 🔍 ...:', {
        target: this.currentChatTarget,
        name: this.currentChatName,
        isGroup: this.isCurrentChatGroup,
      });

      try {
        if (!this.currentChatTarget || !this.currentChatName) {
          throw new Error('errorНастройкиerror');
        }

        const category = this.getFileCategory({ type: uploadResult.fileType });
        const fileSize = this.formatFileSize(uploadResult.fileSize);

        console.log('[AttachmentSender] 🔍 ...:', {
          category,
          fileSize,
          fileName: uploadResult.fileName,
          fileType: uploadResult.fileType,
        });

        // Сообщения - message-app
        let messageContent = '';

        if (this.isCurrentChatGroup) {
          messageContent = `...${this.currentChatName}（${this.currentChatTarget}）...Сообщения\n\n`;
          messageContent += `...Сообщения...Ответить，Ответить...\n\n`;
        } else {
          messageContent = `...${this.currentChatName}（${this.currentChatTarget}）...Сообщения\n\n`;
          messageContent += `...Сообщения...Ответить，Ответить...\n\n`;
        }

        // ПользовательСообщения
        if (additionalMessages && additionalMessages.trim()) {
          console.log('[AttachmentSender] 🔍 ...Сообщения:', additionalMessages);
          const messageLines = additionalMessages.split('\n').filter(line => line.trim());

          for (const line of messageLines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
              messageContent += `[...Сообщения|${this.currentChatName}|${this.currentChatTarget}|...|${trimmedLine}]\n`;
            }
          }
          messageContent += '\n';
        }

        // Сообщения - message-app
        if (category === 'image') {
          messageContent += `[...Сообщения|${this.currentChatName}|${this.currentChatTarget}|...|...: ${uploadResult.fileName}]`;
        } else {
          messageContent += `[...Сообщения|${this.currentChatName}|${this.currentChatTarget}|...|...: ${uploadResult.fileName} (${fileSize})]`;
        }

        console.log('[AttachmentSender] 🔍 ...Сообщения...:', messageContent);

        // СообщенияSillyTavern
        const success = await this.sendToSillyTavern(messageContent, uploadResult);

        if (success) {
          console.log(`[AttachmentSender] ✅ ...Сообщения...`);

          // 🌟 ：SillyTavernСообщения，
          if (category === 'image') {
            console.log(`[AttachmentSender] 🔍 ...SillyTavern...Сообщения...`);
            setTimeout(async () => {
              await this.extractImageFromSillyTavern(uploadResult);
            }, 2000); // ...2...SillyTavern...Сообщения
          }

          return true;
        } else {
          throw new Error('errorСообщенияerrorSillyTavernerror');
        }
      } catch (error) {
        console.error(`[AttachmentSender] ❌ errorСообщенияerror:`, error);
        return false;
      }
    }

    // СообщенияSillyTavern
    async sendToSillyTavern(messageContent, uploadResult) {
      console.log('[AttachmentSender] 🔍 ...Сообщения...SillyTavern');
      console.log('[AttachmentSender] 🔍 Сообщения...:', messageContent);
      console.log('[AttachmentSender] 🔍 Загрузить...:', uploadResult);

      try {
        // SillyTavern
        console.log('[AttachmentSender] 🔍 ...SillyTavern...:');
        console.log('  - send_textarea...:', !!document.getElementById('send_textarea'));
        console.log('  - send_but...:', !!document.getElementById('send_but'));
        console.log('  - window.Generate...:', typeof window.Generate === 'function');
        console.log('  - window.messageSender...:', !!window.messageSender);
        console.log('  - window.sendMessageAsUser...:', typeof window.sendMessageAsUser === 'function');

        // 1: DOM（app）
        const messageTextarea = document.getElementById('send_textarea');
        const sendButton = document.getElementById('send_but');

        if (messageTextarea && sendButton) {
          console.log('[AttachmentSender] 🔍 ...1: DOM...');

          // Статус
          console.log('[AttachmentSender] 🔍 /* Поле ввода */Статус:', {
            disabled: messageTextarea.disabled,
            value: messageTextarea.value,
          });
          console.log('[AttachmentSender] 🔍 ...Статус:', {
            disabled: sendButton.disabled,
            classList: Array.from(sendButton.classList),
          });

          // Сохранить
          const originalContent = messageTextarea.value;
          console.log('[AttachmentSender] 🔍 .../* Поле ввода */...:', originalContent);

          // /* Поле ввода */
          if (messageTextarea.disabled) {
            console.warn('[AttachmentSender] ⚠️ /* Поле ввода */error');
            return false;
          }

          if (sendButton.disabled || sendButton.classList.contains('disabled')) {
            console.warn('[AttachmentSender] ⚠️ error');
            return false;
          }

          // НастройкиСообщения
          messageTextarea.value = messageContent;
          console.log('[AttachmentSender] 🔍 ...Настройки/* Поле ввода */...:', messageTextarea.value);

          messageTextarea.dispatchEvent(new Event('input', { bubbles: true }));
          messageTextarea.dispatchEvent(new Event('change', { bubbles: true }));
          console.log('[AttachmentSender] 🔍 ...');

          await new Promise(resolve => setTimeout(resolve, 300));
          sendButton.click();
          console.log('[AttachmentSender] 🔍 ...');

          setTimeout(() => {
            if (messageTextarea.value === messageContent) {
              messageTextarea.value = originalContent;
              console.log('[AttachmentSender] 🔍 .../* Поле ввода */...');
            }
          }, 1000);

          return true;
        } else {
          console.warn('[AttachmentSender] ⚠️ errorsend_textareaerrorsend_buterror');
        }

        // 2: messageSender（）
        if (window.messageSender && typeof window.messageSender.sendToChat === 'function') {
          console.log('[AttachmentSender] 🔍 ...2: messageSender.sendToChat');
          const result = await window.messageSender.sendToChat(messageContent);
          console.log('[AttachmentSender] 🔍 messageSender...:', result);
          return result;
        }

        // 3: SillyTavernAPI
        if (window.sendMessageAsUser) {
          console.log('[AttachmentSender] 🔍 ...3: sendMessageAsUser');
          await window.sendMessageAsUser(messageContent);
          return true;
        }

        // 4: Generate（）
        if (typeof window.Generate === 'function') {
          console.log('[AttachmentSender] 🔍 ...4: Generate...');
          if (messageTextarea) {
            const originalContent = messageTextarea.value;
            messageTextarea.value = messageContent;
            window.Generate('normal');
            setTimeout(() => {
              if (messageTextarea.value === messageContent) {
                messageTextarea.value = originalContent;
              }
            }, 1000);
            return true;
          }
        }

        console.warn('[AttachmentSender] ❌ error');
        return false;
      } catch (error) {
        console.error(`[AttachmentSender] errorSillyTavernerror:`, error);
        return false;
      }
    }

    // Время
    getCurrentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    // 🌟 ：
    getCurrentCharacterName() {
      try {
        console.log(`[AttachmentSender] 🔍 ......`);

        // 1: Сообщения
        const chatMessages = document.querySelectorAll('#chat .mes');
        if (chatMessages.length > 0) {
          // AIСообщения，
          for (let i = chatMessages.length - 1; i >= 0; i--) {
            const message = chatMessages[i];
            const isUser = message.getAttribute('is_user') === 'true';
            if (!isUser) {
              const charName = message.getAttribute('ch_name');
              if (charName && charName.trim()) {
                console.log(`[AttachmentSender] ✅ ...Сообщения...:`, charName);
                return charName.trim();
              }
            }
          }
        }

        // 2: （）
        if (this.currentChatName && this.currentChatName !== '...') {
          console.log(`[AttachmentSender] ✅ ...:`, this.currentChatName);
          return this.currentChatName;
        }

        // 3: URL
        const urlParams = new URLSearchParams(window.location.search);
        const charFromUrl = urlParams.get('char') || urlParams.get('character');
        if (charFromUrl) {
          console.log(`[AttachmentSender] ✅ ...URL...:`, charFromUrl);
          return charFromUrl;
        }

        // 4: localStorage
        try {
          const recentChar =
            localStorage.getItem('selected_character') ||
            localStorage.getItem('character_name') ||
            localStorage.getItem('current_character');
          if (recentChar) {
            console.log(`[AttachmentSender] ✅ ...localStorage...:`, recentChar);
            return recentChar;
          }
        } catch (e) {
          console.warn(`[AttachmentSender] ⚠️ errorlocalStorage:`, e);
        }

        // 5:
        console.warn(`[AttachmentSender] ⚠️ error，error`);
        return 'default';
      } catch (error) {
        console.error(`[AttachmentSender] ❌ error:`, error);
        return 'default';
      }
    }

    // 🌟 ：SillyTavern
    async extractImageFromSillyTavern(uploadResult) {
      try {
        console.log(`[AttachmentSender] 🔍 ...SillyTavern DOM...`);

        // DOMНовоеСообщения
        const chatMessages = document.querySelectorAll('#chat .mes');
        console.log(`[AttachmentSender] 🔍 ...${chatMessages.length}...DOMСообщения`);

        if (chatMessages.length === 0) {
          console.warn(`[AttachmentSender] ⚠️ errorСообщенияDOMerror`);
          return null;
        }

        // Сообщения
        const messagesToCheck = Math.min(3, chatMessages.length); // ...3...Сообщения
        console.log(`[AttachmentSender] 🔍 ...${messagesToCheck}...Сообщения...`);

        for (let i = chatMessages.length - messagesToCheck; i < chatMessages.length; i++) {
          const messageElement = chatMessages[i];
          console.log(`[AttachmentSender] 🔍 ...Сообщения${i + 1}:`, messageElement);

          const imgElements = messageElement.querySelectorAll('img.mes_img');
          console.log(`[AttachmentSender] 🔍 Сообщения${i + 1}...:`, imgElements.length);

          if (imgElements.length > 0) {
            // ，（Новое）
            const latestImg = imgElements[imgElements.length - 1];
            let imageSrc = latestImg.src;

            console.log(`[AttachmentSender] 🔍 ...URL:`, imageSrc);
            console.log(`[AttachmentSender] 🔍 ...:`, {
              src: latestImg.src,
              alt: latestImg.alt,
              className: latestImg.className,
              width: latestImg.width,
              height: latestImg.height,
            });

            // 🌟 ：URL，
            if (imageSrc === 'http://127.0.0.1:8000/' || imageSrc.endsWith('/')) {
              console.log(`[AttachmentSender] ⚠️ ...URL...，......`);

              const characterName = this.getCurrentCharacterName();
              console.log(`[AttachmentSender] 🔍 ...:`, characterName);

              // 🌟
              const workingImages = document.querySelectorAll('img.mes_img');
              let actualFileName = null;

              console.log(`[AttachmentSender] 🔍 ...:`, workingImages.length);

              for (let img of workingImages) {
                if (img.src && img.src.includes('/user/images/') && img.naturalWidth > 0) {
                  const urlParts = img.src.split('/');
                  const fileName = urlParts[urlParts.length - 1];
                  console.log(`[AttachmentSender] 🔍 ...:`, img.src);
                  console.log(`[AttachmentSender] 🔍 ...:`, fileName);

                  // ЕслиНовое（Время）
                  if (fileName && fileName.length > 10) {
                    actualFileName = fileName;
                    break;
                  }
                }
              }

              if (actualFileName) {
                const encodedCharacterName = encodeURIComponent(characterName);
                const correctPath = `/user/images/${encodedCharacterName}/${actualFileName}`;
                const correctUrl = `http://127.0.0.1:8000${correctPath}`;

                console.log(`[AttachmentSender] 🔍 ...:`, actualFileName);
                console.log(`[AttachmentSender] 🔍 ...:`, correctPath);
                console.log(`[AttachmentSender] 🔍 ...URL:`, correctUrl);

                imageSrc = correctUrl;
                console.log(`[AttachmentSender] ✅ ...:`, imageSrc);
              } else {
                // ：
                const encodedCharacterName = encodeURIComponent(characterName);
                const encodedFileName = encodeURIComponent(uploadResult.fileName);
                const correctPath = `/user/images/${encodedCharacterName}/${encodedFileName}`;
                const correctUrl = `http://127.0.0.1:8000${correctPath}`;

                console.log(`[AttachmentSender] ⚠️ ...，...:`, uploadResult.fileName);
                console.log(`[AttachmentSender] 🔍 ...URL:`, correctUrl);

                imageSrc = correctUrl;
                console.log(`[AttachmentSender] ⚠️ ...:`, imageSrc);
              }
            }

            console.log(`[AttachmentSender] ✅ ...URL:`, imageSrc);

            // Уведомлениеmessage-appСообщения
            this.notifyMessageAppNewImage({
              imagePath: imageSrc,
              fileName: uploadResult.fileName,
              fileSize: uploadResult.fileSize,
              fileType: uploadResult.fileType,
              chatTarget: this.currentChatTarget,
              chatName: this.currentChatName,
              isGroup: this.isCurrentChatGroup,
              time: this.getCurrentTime(),
            });

            return imageSrc;
          }
        }

        console.warn(`[AttachmentSender] ⚠️ errorСообщенияerror`);
        return null;
      } catch (error) {
        console.error(`[AttachmentSender] ❌ error:`, error);
        return null;
      }
    }

    // 🌟 ：SillyTavernСообщения
    getSillyTavernMessages() {
      try {
        console.log(`[AttachmentSender] 🔍 ...SillyTavernСообщения......`);

        // Сообщения
        console.log(`[AttachmentSender] 🔍 ...:`, {
          'window.chat': !!window.chat,
          'window.chat.length': window.chat ? window.chat.length : 'N/A',
          'window.context': !!window.context,
          'window.context.chat': !!(window.context && window.context.chat),
          'window.messages': !!window.messages,
        });

        // SillyTavernСообщения
        if (window.chat && Array.isArray(window.chat)) {
          console.log(`[AttachmentSender] ✅ ...window.chat，Сообщения...:`, window.chat.length);
          return window.chat;
        }

        if (window.context && window.context.chat && Array.isArray(window.context.chat)) {
          console.log(`[AttachmentSender] ✅ ...window.context.chat，Сообщения...:`, window.context.chat.length);
          return window.context.chat;
        }

        if (window.messages && Array.isArray(window.messages)) {
          console.log(`[AttachmentSender] ✅ ...window.messages，Сообщения...:`, window.messages.length);
          return window.messages;
        }

        // DOM
        const chatContainer = document.querySelector('#chat');
        if (chatContainer && chatContainer.messages) {
          console.log(`[AttachmentSender] ✅ ...DOM chatContainer.messages`);
          return chatContainer.messages;
        }

        console.warn(`[AttachmentSender] ⚠️ errorSillyTavernСообщенияerror`);
        return null;
      } catch (error) {
        console.error(`[AttachmentSender] ❌ errorSillyTavernСообщенияerror:`, error);
        return null;
      }
    }

    // 🌟 ：Уведомлениеmessage-appСообщения
    notifyMessageAppNewImage(imageInfo) {
      try {
        console.log(`[AttachmentSender] 🔍 Уведомлениеmessage-app...Сообщения:`, imageInfo);

        // message-app
        if (!window.messageApp) {
          console.warn(`[AttachmentSender] ⚠️ message-apperror`);
          return;
        }

        // message-app
        if (typeof window.messageApp.handleNewImageMessage === 'function') {
          window.messageApp.handleNewImageMessage(imageInfo);
        } else {
          console.warn(`[AttachmentSender] ⚠️ message-app.handleNewImageMessageerror`);

          // ：СообщенияОбновить
          if (typeof window.messageApp.refreshCurrentMessages === 'function') {
            console.log(`[AttachmentSender] 🔍 ...：ОбновитьСообщения/* Список */`);
            setTimeout(() => {
              window.messageApp.refreshCurrentMessages();
            }, 1000);
          }
        }
      } catch (error) {
        console.error(`[AttachmentSender] ❌ Уведомлениеmessage-apperror:`, error);
      }
    }

    // 🌟 ：SillyTavernАдрес，
    getSillyTavernServerUrl() {
      try {
        // 🌟 ，SillyTavern
        console.log(`[AttachmentSender] 🔍 ...（Рекомендации）`);
        return ''; // Назад...

        // ：URL，
        /*
        const currentUrl = window.location;
        if (currentUrl.hostname && currentUrl.port) {
          const serverUrl = `${currentUrl.protocol}//${currentUrl.hostname}:${currentUrl.port}`;
          console.log(`[AttachmentSender] 🔍 ...URL...Адрес:`, serverUrl);
          return serverUrl;
        }

        // 2:
        if (window.api_server_url) {
          console.log(`[AttachmentSender] 🔍 ...window.api_server_url...Адрес:`, window.api_server_url);
          return window.api_server_url;
        }

        // 3: Адрес（）
        const defaultUrl = 'http://127.0.0.1:8000';
        console.warn(`[AttachmentSender] ⚠️ errorАдрес，errorАдрес:`, defaultUrl);
        return defaultUrl;
        */
      } catch (error) {
        console.error(`[AttachmentSender] ❌ errorАдресerror:`, error);
        return '';
      }
    }

    // 🌟 ：Сообщения，
    parseImageMessageFormat(messageContent) {
      try {
        console.log(`[AttachmentSender] 🔍 ...Сообщения...:`, messageContent);

        // Сообщения：[Сообщения||555555||: 760e7464a688a0bb.png]
        const imageMessageRegex = /\[...Сообщения\|([^|]+)\|([^|]+)\|...\|...:\s*([^|\]]+)\]/g;

        // Сообщения
        const matches = [...messageContent.matchAll(imageMessageRegex)];

        if (matches.length === 0) {
          console.log(`[AttachmentSender] 🔍 ...Сообщения...`);
          return null;
        }

        const parsedImages = [];
        const serverUrl = this.getSillyTavernServerUrl();

        for (const match of matches) {
          const [fullMatch, friendName, friendId, fileName] = match;
          console.log(`[AttachmentSender] 🔍 ...Сообщения:`, {
            friendName,
            friendId,
            fileName,
            fullMatch,
          });

          // URL
          const encodedFriendName = encodeURIComponent(friendName);

          // 🌟 -
          let actualFileName = fileName.trim();

          // ЕслиID（），
          if (actualFileName.length < 20 && !actualFileName.includes('.')) {
            console.log(`[AttachmentSender] 🔍 ...ID，......`);
            actualFileName = this.findActualImageFileName(friendName, actualFileName);
          }

          const imageUrl = `${serverUrl}/user/images/${encodedFriendName}/${actualFileName}`;

          parsedImages.push({
            fullMatch,
            friendName,
            friendId,
            fileName,
            actualFileName,
            imageUrl,
          });
        }

        return parsedImages;
      } catch (error) {
        console.error(`[AttachmentSender] ❌ errorСообщенияerror:`, error);
        return null;
      }
    }

    // 🌟 ：URL，SillyTavern
    buildImageUrl(friendName, fileName) {
      try {
        console.log(`[AttachmentSender] 🔍 ...URL: ${friendName}, ${fileName}`);

        // 🌟
        let actualFileName = fileName.trim();

        // ЕслиID，
        if (actualFileName.length < 30 && !actualFileName.includes('_')) {
          console.log(`[AttachmentSender] 🔍 ...，......`);
          const foundFileName = this.findActualImageFileName(friendName, actualFileName);
          if (foundFileName && foundFileName !== actualFileName) {
            actualFileName = foundFileName;
            console.log(`[AttachmentSender] ✅ ...:`, actualFileName);
          }
        }

        // 🌟 ，SillyTavern
        const relativePath = `/user/images/${friendName}/${actualFileName}`;
        console.log(`[AttachmentSender] ✅ ...:`, relativePath);

        return relativePath;
      } catch (error) {
        console.error(`[AttachmentSender] ❌ errorURLerror:`, error);
        return `/user/images/${friendName}/${fileName}`;
      }
    }

    // 🌟 ：，
    findActualImageFileName(friendName, fileId) {
      try {
        console.log(`[AttachmentSender] 🔍 ...: ${friendName}, ${fileId}`);

        // 1: （）
        const existingImages = document.querySelectorAll('img.mes_img, img[src*="/user/images/"]');
        console.log(`[AttachmentSender] 🔍 ...${existingImages.length}...`);

        for (const img of existingImages) {
          const src = img.src;
          console.log(`[AttachmentSender] 🔍 ...:`, src);

          // Друзья
          if (
            src.includes(`/user/images/${encodeURIComponent(friendName)}/`) ||
            src.includes(`/user/images/${friendName}/`)
          ) {
            const urlParts = src.split('/');
            const fileName = urlParts[urlParts.length - 1];

            console.log(`[AttachmentSender] 🔍 ...${friendName}...:`, fileName);

            // 🌟 ：Назад（Новое）
            // ЕслиВремя，Время
            if (fileName && fileName.length > 10) {
              console.log(`[AttachmentSender] ✅ ...:`, fileName);
              return fileName;
            }
          }
        }

        // 2: SillyTavernСообщения
        if (window.chat && Array.isArray(window.chat)) {
          console.log(`[AttachmentSender] 🔍 ...SillyTavern......`);
          for (const message of window.chat.slice(-10)) {
            // 10Сообщения
            if (message.extra && message.extra.image) {
              const imagePath = message.extra.image;
              console.log(`[AttachmentSender] 🔍 ...Сообщения...:`, imagePath);

              if (imagePath.includes(friendName)) {
                const fileName = imagePath.split('/').pop();
                console.log(`[AttachmentSender] ✅ ...:`, fileName);
                return fileName;
              }
            }
          }
        }

        // 3: Новое（Время）
        const allImages = Array.from(existingImages)
          .map(img => {
            const src = img.src;
            const fileName = src.split('/').pop();
            const timestampMatch = fileName.match(/(\d{13})/); // ...13...Время...
            return {
              src,
              fileName,
              timestamp: timestampMatch ? parseInt(timestampMatch[1]) : 0,
            };
          })
          .filter(
            item =>
              item.src.includes(`/user/images/${encodeURIComponent(friendName)}/`) ||
              item.src.includes(`/user/images/${friendName}/`),
          )
          .sort((a, b) => b.timestamp - a.timestamp); // ...Время...

        if (allImages.length > 0) {
          const newestImage = allImages[0];
          console.log(`[AttachmentSender] ✅ ...Новое...:`, newestImage.fileName);
          return newestImage.fileName;
        }

        // ：
        console.warn(`[AttachmentSender] ⚠️ error，errorID:`, fileId);
        return fileId.includes('.') ? fileId : `${fileId}.png`;
      } catch (error) {
        console.error(`[AttachmentSender] ❌ error:`, error);
        return fileId.includes('.') ? fileId : `${fileId}.png`;
      }
    }

    async handleFileSelection(files, additionalMessages = '') {
      console.log('[AttachmentSender] 🔍 ...，...:', files.length);
      console.log('[AttachmentSender] 🔍 ...Сообщения:', additionalMessages);
      const results = [];

      for (const file of files) {
        console.log('[AttachmentSender] 🔍 ...:', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        });

        const validation = this.validateFile(file);
        console.log('[AttachmentSender] 🔍 ...:', validation);

        if (!validation.isValid) {
          console.warn('[AttachmentSender] ❌ error:', validation.errors);
          results.push({
            file,
            success: false,
            errors: validation.errors,
          });
          continue;
        }

        // Загрузить
        console.log('[AttachmentSender] 🔍 ...Загрузить......');
        const uploadResult = await this.uploadFileToSillyTavern(file);
        console.log('[AttachmentSender] 🔍 ...Загрузить...:', uploadResult);

        if (uploadResult.success) {
          // Сообщения
          console.log('[AttachmentSender] 🔍 ...Сообщения...');
          const sendSuccess = await this.sendAttachmentMessage(uploadResult, additionalMessages);
          console.log('[AttachmentSender] 🔍 Сообщения...:', sendSuccess);

          results.push({
            file,
            success: sendSuccess,
            uploadResult,
            errors: sendSuccess ? [] : ['...Сообщения...'],
          });
        } else {
          console.error('[AttachmentSender] ❌ errorЗагрузитьerror:', uploadResult.error);
          results.push({
            file,
            success: false,
            errors: [uploadResult.error],
          });
        }
      }

      console.log('[AttachmentSender] 🔍 ...，...:', results);
      return results;
    }
  }

  window.AttachmentSender = AttachmentSender;

  if (!window.attachmentSender) {
    window.attachmentSender = new AttachmentSender();
  }

  // ，
  window.testAttachmentSender = async function (testMessage = '...') {
    console.log('[AttachmentSender] 🧪 ......');

    if (!window.attachmentSender) {
      console.error('[AttachmentSender] ❌ attachmentSendererror');
      return false;
    }

    // Загрузить
    const mockUploadResult = {
      success: true,
      fileUrl: 'test://mock-file-url',
      fileName: 'test-file.png',
      fileSize: 12345,
      fileType: 'image/png',
    };

    try {
      const result = await window.attachmentSender.sendToSillyTavern(testMessage, mockUploadResult);
      console.log('[AttachmentSender] 🧪 ...:', result);
      return result;
    } catch (error) {
      console.error('[AttachmentSender] 🧪 error:', error);
      return false;
    }
  };

  window.checkAttachmentEnvironment = function () {
    console.log('[AttachmentSender] 🔍 ...:');
    console.log('  - send_textarea...:', !!document.getElementById('send_textarea'));
    console.log('  - send_but...:', !!document.getElementById('send_but'));
    console.log('  - window.Generate...:', typeof window.Generate === 'function');
    console.log('  - window.messageSender...:', !!window.messageSender);
    console.log(
      '  - window.messageSender.sendToChat...:',
      !!(window.messageSender && typeof window.messageSender.sendToChat === 'function'),
    );
    console.log('  - window.sendMessageAsUser...:', typeof window.sendMessageAsUser === 'function');
    console.log('  - window.attachmentSender...:', !!window.attachmentSender);

    // SillyTavernЗагрузить
    console.log(
      '  - window.uploadFileAttachmentToServer...:',
      typeof window.uploadFileAttachmentToServer === 'function',
    );
    console.log('  - #file_form_input...:', !!document.getElementById('file_form_input'));
    console.log('  - #attachFile...:', !!document.getElementById('attachFile'));
    console.log('  - .file_attached...:', !!document.querySelector('.file_attached'));

    // Статус
    const textarea = document.getElementById('send_textarea');
    const sendBtn = document.getElementById('send_but');

    if (textarea) {
      console.log('  - /* Поле ввода */Статус:', {
        disabled: textarea.disabled,
        value: textarea.value,
        placeholder: textarea.placeholder,
      });
    }

    if (sendBtn) {
      console.log('  - ...Статус:', {
        disabled: sendBtn.disabled,
        classList: Array.from(sendBtn.classList),
        textContent: sendBtn.textContent,
      });
    }

    const fileAttached = document.querySelector('.file_attached');
    if (fileAttached) {
      const fileName = fileAttached.querySelector('.file_name');
      const fileSize = fileAttached.querySelector('.file_size');
      console.log('  - ...:', {
        fileName: fileName ? fileName.textContent : '...',
        fileSize: fileSize ? fileSize.textContent : '...',
      });
    }
  };

  // Загрузить
  window.testSillyTavernUpload = async function () {
    console.log('[AttachmentSender] 🧪 ...SillyTavernЗагрузить......');

    const testContent = 'This is a test file for attachment upload';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test-attachment.txt', { type: 'text/plain' });

    console.log('[AttachmentSender] 🧪 ...:', {
      name: testFile.name,
      size: testFile.size,
      type: testFile.type,
    });

    if (!window.attachmentSender) {
      console.error('[AttachmentSender] ❌ attachmentSendererror');
      return false;
    }

    try {
      const result = await window.attachmentSender.uploadFileToSillyTavern(testFile);
      console.log('[AttachmentSender] 🧪 Загрузить...:', result);
      return result;
    } catch (error) {
      console.error('[AttachmentSender] 🧪 Загрузитьerror:', error);
      return false;
    }
  };

  window.testImageMessageFlow = async function () {
    console.log('[AttachmentSender] 🧪 ...Сообщения......');

    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('TEST', 30, 55);

    // blob
    return new Promise(resolve => {
      canvas.toBlob(async blob => {
        const testFile = new File([blob], 'test-image.png', { type: 'image/png' });

        console.log('[AttachmentSender] 🧪 ...:', {
          name: testFile.name,
          size: testFile.size,
          type: testFile.type,
        });

        if (!window.attachmentSender) {
          console.error('[AttachmentSender] ❌ attachmentSendererror');
          resolve(false);
          return;
        }

        // Настройки
        window.attachmentSender.setCurrentChat('test123', '...Друзья', false);

        try {
          const results = await window.attachmentSender.handleFileSelection([testFile]);
          console.log('[AttachmentSender] 🧪 ...:', results);
          resolve(results);
        } catch (error) {
          console.error('[AttachmentSender] 🧪 error:', error);
          resolve(false);
        }
      }, 'image/png');
    });
  };

  console.log('[AttachmentSender] ...');
  // SillyTavernСообщения
  window.checkSillyTavernMessages = function () {
    console.log('[AttachmentSender] 🔍 ...SillyTavernСообщения.../* Структура */...');

    // window.chat
    if (window.chat) {
      console.log('[AttachmentSender] 🔍 window.chat...，...:', typeof window.chat);
      console.log('[AttachmentSender] 🔍 window.chat...:', Array.isArray(window.chat));
      if (Array.isArray(window.chat)) {
        console.log('[AttachmentSender] 🔍 window.chat...:', window.chat.length);
        if (window.chat.length > 0) {
          const lastMessage = window.chat[window.chat.length - 1];
          console.log('[AttachmentSender] 🔍 ...Сообщения:', lastMessage);
          console.log('[AttachmentSender] 🔍 ...Сообщения...extra:', lastMessage.extra);
          if (lastMessage.extra) {
            console.log('[AttachmentSender] 🔍 extra.image:', lastMessage.extra.image);
            console.log('[AttachmentSender] 🔍 extra.file:', lastMessage.extra.file);
          }
        }
      }
    } else {
      console.log('[AttachmentSender] ⚠️ window.chat...');
    }

    console.log('[AttachmentSender] 🔍 ...:');
    console.log('  - window.context:', !!window.context);
    console.log('  - window.context.chat:', !!(window.context && window.context.chat));

    // DOMСообщения
    const chatMessages = document.querySelectorAll('#chat .mes');
    console.log('[AttachmentSender] 🔍 DOM...Сообщения...:', chatMessages.length);

    if (chatMessages.length > 0) {
      const lastMsgElement = chatMessages[chatMessages.length - 1];
      console.log('[AttachmentSender] 🔍 ...СообщенияDOM...:', lastMsgElement);

      const imgElements = lastMsgElement.querySelectorAll('img');
      console.log('[AttachmentSender] 🔍 ...Сообщения...:', imgElements.length);
      if (imgElements.length > 0) {
        imgElements.forEach((img, index) => {
          console.log(`[AttachmentSender] 🔍 ...${index + 1}:`, {
            src: img.src,
            alt: img.alt,
            className: img.className,
          });
        });
      }
    }
  };

  console.log('[AttachmentSender] 💡 ...:');
  console.log('  - checkAttachmentEnvironment() - ...Статус');
  console.log('  - testAttachmentSender("...Сообщения") - ...');
  console.log('  - testSillyTavernUpload() - ...SillyTavernЗагрузить...');
  console.log('  - testImageMessageFlow() - ...Сообщения...');
  console.log('  - checkSillyTavernMessages() - ...SillyTavernСообщения.../* Структура */');
  console.log('  - testImageMessageParsing() - ...Сообщения...');

  // 🌟 ：Сообщения
  window.testImageMessageParsing = function (testMessage = '[...Сообщения|...|555555|...|...: 760e7464a688a0bb.png]') {
    console.log('[AttachmentSender] 🧪 ...Сообщения......');

    if (!window.attachmentSender) {
      console.error('[AttachmentSender] ❌ attachmentSendererror');
      return false;
    }

    try {
      console.log('[AttachmentSender] 🧪 ...:', testMessage);

      const result = window.attachmentSender.parseImageMessageFormat(testMessage);
      console.log('[AttachmentSender] 🧪 ...:', result);

      // Адрес
      const serverUrl = window.attachmentSender.getSillyTavernServerUrl();
      console.log('[AttachmentSender] 🧪 ...Адрес:', serverUrl);

      // URL
      const imageUrl = window.attachmentSender.buildImageUrl('...', '-_3.png');
      console.log('[AttachmentSender] 🧪 ...URL:', imageUrl);

      return {
        success: true,
        originalMessage: testMessage,
        parsedResult: result,
        serverUrl: serverUrl,
        imageUrl: imageUrl,
      };
    } catch (error) {
      console.error('[AttachmentSender] 🧪 error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // 🌟 ：Сообщения
  window.testMultipleImageFormats = function () {
    console.log('[AttachmentSender] 🧪 ...Сообщения......');

    const testCases = [
      '[...Сообщения|...|555555|...|...: 760e7464a688a0bb.png]',
      '[...Сообщения|Alice|123456|...|...: image123.jpg]',
      '[...Сообщения|...Пользователь|999999|...|...: test_image_2024.png]',
      '... [...Сообщения|Пользователь1|111|...|...: pic1.png] ... [...Сообщения|Пользователь2|222|...|...: pic2.jpg] ...Сообщения',
    ];

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`[AttachmentSender] 🧪 ... ${i + 1}:`, testCase);

      const result = window.testImageMessageParsing(testCase);
      results.push({
        testCase: i + 1,
        input: testCase,
        result: result,
      });
    }

    console.log('[AttachmentSender] 🧪 ...，...:', results);
    return results;
  };
})(window);
