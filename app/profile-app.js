// ==SillyTavern Profile Archive App==
// @name         Profile Archive App for Mobile Extension
// @version      1.0.0
// @description Досье/* Приложение */，Досье、
// @author       Assistant

/**
 * Досье.../* Приложение */...
 * ...Досье...、...、...
 */
class RuApp_profile {
    constructor() {
        this.isInitialized = false;
        this.currentProfile = null;
        this.profileList = [];
        this.config = {
            floorCount: 5, // ...
            customPrefix: '', // ...
            targetPerson: '', // ...
        };

        this.profileCache = new Map(); // ...Досье...
        this.loadCachedProfiles(); // ...Досье

        this.promptTemplate = `...

...【...】...
【...】...，...
【...】...，...
【...】

...：..."..."，..."..."..."..."

...：..."...18..."...Донаты

...：..."..."..."..."

...：...，..."..."..."..."

【...】
• "...PPT..."
• "...Поделиться...，..."
• "...'...'...，...Подтвердить...：..."

【...】...，...

<Important_Rule>
...，...，...<Student_Profile>。
...<Student_Profile></Student_Profile>...，...，...。...，...。
Досье...：
  The text inside "()" is for explanatory notes only and should not be part of the main text to output.
  ...<Student_Profile></Student_Profile>...，...。
</Important_Rule>

<Student_Profile>
{{student_name}}｜{{gender}}｜{{age}}｜{{measurements}}｜{{...}}｜{{background_info}}｜{{...}}｜{{video_interview_result}}｜{{...user...}}｜{{...}}｜{{target_goals}}｜{{special_notes}}｜{{master_evaluation}}｜{{...Статус}}｜{{...}}｜{{...}}｜{{...}}｜{{...}}｜{{...}}
</Student_Profile>

...，...：
<Student_Profile>
...｜...｜24｜B85/W58/H88｜...，...，...，...。｜...KTV...，...，...3...。...。｜...，...，...。｜...，...，...，...Подтвердить...，...。｜...user...，...，...user...。｜...：...，...，...。｜...，...，...。｜...，...。...，...。｜...：...，...，...。...，...。...，...，...。｜...，...。｜...，...，...。｜...，...，...。｜...，...，...。｜...，...。｜...，...。
</Student_Profile>`;

        this.init();
    }

    init() {
        console.log('[Профиль] Досье.../* Приложение */...');
        this.loadConfig();
        this.loadProfileList();
    }

    /**
     * ...Досье
     */
    loadCachedProfiles() {
        try {
            const cachedData = localStorage.getItem('profile-app-cache');
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                this.profileCache = new Map(parsed);
                console.log('[Профиль] ...Досье...:', this.profileCache.size);
            }
        } catch (error) {
            console.error('[Профиль] errorДосьеerror:', error);
            this.profileCache = new Map();
        }
    }

    /**
     * СохранитьДосье...
     */
    saveCachedProfile(personName, profileData, fullContent) {
        try {
            const cacheEntry = {
                profileData: profileData,
                fullContent: fullContent,
                timestamp: new Date().toISOString(),
                personName: personName
            };

            this.profileCache.set(personName, cacheEntry);

            // localStorage
            const cacheArray = Array.from(this.profileCache.entries());
            localStorage.setItem('profile-app-cache', JSON.stringify(cacheArray));

            console.log('[Профиль] Досье...:', personName);
        } catch (error) {
            console.error('[Профиль] СохранитьerrorДосьеerror:', error);
        }
    }

    /**
     * ...Досье
     */
    getCachedProfile(personName) {
        return this.profileCache.get(personName) || null;
    }

    /**
     * ...（...）
     */
    clearCache() {
        this.profileCache.clear();
        localStorage.removeItem('profile-app-cache');
        console.log('[Профиль] ...');
    }

    /**
     * ...
     */
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem('profile-app-config');
            if (savedConfig) {
                this.config = { ...this.config, ...JSON.parse(savedConfig) };
            }
        } catch (error) {
            console.error('[Профиль] error:', error);
        }
    }

    /**
     * Сохранить...
     */
    saveConfig() {
        try {
            localStorage.setItem('profile-app-config', JSON.stringify(this.config));
        } catch (error) {
            console.error('[Профиль] Сохранитьerror:', error);
        }
    }

    /**
     * ...Досье/* Список */（...message-app...）
     */
    async loadProfileList() {
        try {
            console.log('[Профиль] ...Досье/* Список */');

            // （message-app）
            const allEntries = await this.getAllWorldInfoEntries();
            this.profileList = [];

            // 【Досье】
            console.log('[Профиль] ...ПоискДосье...，...:', allEntries.length);

            // /* Структура */
            if (allEntries.length > 0) {
                console.log('[Профиль] .../* Структура */...:', {
                    first: allEntries[0],
                    possibleFields: Object.keys(allEntries[0] || {})
                });
            }

            for (const entry of allEntries) {
                let entryName = entry.comment || entry.title || entry.name || '';

                console.log('[Профиль] ...:', {
                    comment: entry.comment,
                    title: entry.title,
                    name: entry.name,
                    entryName: entryName,
                    startsWithProfile: entryName.startsWith('【Досье】')
                });

                if (entryName && entryName.startsWith('【Досье】')) {
                    const profileName = entryName.replace('【Досье】', '');
                    if (profileName) {
                        this.profileList.push({
                            name: profileName,
                            entryId: entry.uid || entry.id,
                            worldbookName: entry.world || '...',
                            content: entry.content
                        });
                        console.log('[Профиль] ...Досье:', profileName);
                    }
                }
            }

            console.log('[Профиль] Досье/* Список */...，...', this.profileList.length, '...Досье');
            console.log('[Профиль] ...Досье:', this.profileList.map(p => p.name));
        } catch (error) {
            console.error('[Профиль] errorДосье/* Список */error:', error);
        }
    }

    /**
     * ...（...message-app...）
     */
    async getAllWorldInfoEntries() {
        const allEntries = [];

        try {
            // 1. SillyTaverngetSortedEntries
            if (typeof window.getSortedEntries === 'function') {
                try {
                    const entries = await window.getSortedEntries();
                    allEntries.push(...entries);
                    console.log(`[Профиль] ...getSortedEntries... ${entries.length} ...`);
                    return allEntries;
                } catch (error) {
                    console.warn('[Профиль] getSortedEntrieserror:', error);
                }
            }

            // 2. ：
            console.log('[Профиль] ...');

            // DOM
            const worldInfoSelect = document.getElementById('world_info');
            if (worldInfoSelect) {
                console.log('[Профиль] ...');

                const selectedOptions = Array.from(worldInfoSelect.selectedOptions);
                console.log(`[Профиль] ... ${selectedOptions.length} ...:`, selectedOptions.map(opt => opt.text));

                for (const option of selectedOptions) {
                    const worldName = option.text;

                    try {
                        console.log(`[Профиль] ...: ${worldName}`);
                        const worldData = await this.loadWorldInfoByName(worldName);
                        if (worldData && worldData.entries) {
                            const entries = Object.values(worldData.entries).map(entry => ({
                                ...entry,
                                world: worldName
                            }));
                            allEntries.push(...entries);
                            console.log(`[Профиль] ..."${worldName}"... ${entries.length} ...`);
                        }
                    } catch (error) {
                        console.warn(`[Профиль] error"${worldName}"error:`, error);
                    }
                }
            }

            // 2：（）
            if (allEntries.length === 0 && typeof window.selected_world_info !== 'undefined' && Array.isArray(window.selected_world_info)) {
                console.log(`[Профиль] ...：... ${window.selected_world_info.length} ...`);

                for (const worldName of window.selected_world_info) {
                    try {
                        const worldData = await this.loadWorldInfoByName(worldName);
                        if (worldData && worldData.entries) {
                            const entries = Object.values(worldData.entries).map(entry => ({
                                ...entry,
                                world: worldName
                            }));
                            allEntries.push(...entries);
                            console.log(`[Профиль] ..."${worldName}"... ${entries.length} ...`);
                        }
                    } catch (error) {
                        console.warn(`[Профиль] error"${worldName}"error:`, error);
                    }
                }
            }

            console.log(`[Профиль] ... ${allEntries.length} ...`);
            return allEntries;

        } catch (error) {
            console.error('[Профиль] error:', error);
            return [];
        }
    }

    /**
     * ...API...
     */
    async loadWorldInfoByName(worldName) {
        try {
            console.log(`[Профиль] ...API...: ${worldName}`);

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
                console.log(`[Профиль] ... "${worldName}"`);
                return data;
            } else {
                console.error(`[Профиль] error "${worldName}" error: ${response.status} ${response.statusText}`);
            }

        } catch (error) {
            console.error(`[Профиль] error "${worldName}" error:`, error);
        }

        return null;
    }

    /**
     * .../* Приложение */HTML...
     */
    getAppContent() {
        return `
      <div class="profile-app">
        <div class="profile-header">
          <h2>Досье... by ...</h2>
          <div class="header-actions">
            <button class="btn-refresh" onclick="window.profileApp.refreshProfileList()">
              <i class="fas fa-sync-alt"></i> Обновить
            </button>
            <button class="btn-generate" onclick="window.profileApp.showGenerateDialog()">
              <i class="fas fa-plus"></i> Создать досье
            </button>
            <button style="display: none;" class="btn-debug" onclick="window.profileApp.showDebugInfo()" style="background: #6c757d;">
              <i class="fas fa-bug"></i> ...
            </button>
          </div>
        </div>

        <div class="profile-content">
          <div class="profile-list" id="profile-list">
            ${this.renderProfileList()}
          </div>
        </div>
      </div>
    `;
    }

    /**
     * ...Досье/* Список */
     */
    renderProfileList() {
        // ДосьеДосье
        const allProfiles = this.getMergedProfileList();

        if (allProfiles.length === 0) {
            return `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-text">...Досье</div>
          <div class="empty-subtitle">..."Создать досье"...Досье</div>
        </div>
      `;
        }

        return allProfiles.map(profile => `
      <div class="profile-item" onclick="window.profileApp.viewProfile('${profile.name}')">
        <div class="profile-avatar">
          <div class="avatar-circle">${profile.name.charAt(0)}</div>
        </div>
        <div class="profile-info">
          <div class="profile-name">${profile.name}</div>
          <div class="profile-summary">${profile.source === 'cache' ? '...Досье - ...' : '...Досье - ...'}</div>
        </div>
        <div class="profile-arrow">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    `).join('');
    }

    /**
     * ...Досье/* Список */（... + ...）
     */
    getMergedProfileList() {
        const mergedProfiles = [];
        const addedNames = new Set();

        // Досье
        for (const profile of this.profileList) {
            mergedProfiles.push({
                ...profile,
                source: 'worldbook'
            });
            addedNames.add(profile.name);
        }

        // Досье
        for (const [name, cachedData] of this.profileCache) {
            if (!addedNames.has(name)) {
                mergedProfiles.push({
                    name: name,
                    source: 'cache',
                    timestamp: cachedData.timestamp
                });
            }
        }

        return mergedProfiles.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * ОбновитьДосье/* Список */
     */
    async refreshProfileList() {
        console.log('[Профиль] ОбновитьДосье/* Список */');
        // Новое
        this.clearCache();
        await this.loadProfileList();
        this.updateProfileListDisplay();
        this.showToast('Досье/* Список */...Обновить（...）', 'success');
    }

    /**
     * ...ОбновитьДосье/* Список */（...Сохранить...Досье）
     */
    async refreshProfileListWithRetry(expectedProfileName, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            console.log(`[Профиль] ОбновитьДосье/* Список */ (... ${i + 1}/${maxRetries})`);

            // Новое
            this.clearCache();
            await this.loadProfileList();

            // Досье
            const foundProfile = this.profileList.find(p => p.name === expectedProfileName);
            if (foundProfile) {
                console.log(`[Профиль] ...Досье: ${expectedProfileName}`);
                this.updateProfileListDisplay();
                return;
            }

            // Если，
            if (i < maxRetries - 1) {
                console.log(`[Профиль] ...Досье "${expectedProfileName}"，......`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // ...1...
            }
        }

        console.warn(`[Профиль] error${maxRetries}errorДосье: ${expectedProfileName}`);
        this.updateProfileListDisplay();
    }

    /**
     * ...Досье/* Список */...
     */
    updateProfileListDisplay() {
        const listContainer = document.getElementById('profile-list');
        if (listContainer) {
            listContainer.innerHTML = this.renderProfileList();
        }
    }

    /**
     * ...Создать досье/* Диалог */
     */
    showGenerateDialog() {
        console.log('[Профиль] ...Создать досье/* Диалог */');
        const dialogHTML = `
      <div class="profile-dialog-overlay">
        <div class="profile-dialog">
          <div class="dialog-header">
            <h3>Создать досье</h3>
            <button class="close-btn" onclick="window.profileApp.closeDialog()">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="dialog-content">
            <div class="form-group">
              <label>...</label>
              <input type="text" id="target-person" placeholder="..." value="${this.config.targetPerson}">
            </div>

            <div class="form-group">
              <label>...</label>
              <input type="number" id="floor-count" min="1" max="50" value="${this.config.floorCount}">
              <small>...</small>
            </div>

            <div class="form-group">
              <label>...</label>
              <textarea id="custom-prefix" rows="3" placeholder="...">${this.config.customPrefix}</textarea>
            </div>
          </div>

          <div class="dialog-footer">
            <button class="cancel-btn" onclick="window.profileApp.closeDialog()">
              Отменить
            </button>
            <button class="confirm-btn" onclick="window.profileApp.generateProfile()">
              Создать досье
            </button>
          </div>
        </div>
      </div>
    `;

        this.showDialog(dialogHTML);
    }

    /**
     * Создать досье
     */
    async generateProfile() {
        const targetPerson = document.getElementById('target-person')?.value?.trim();
        const floorCount = parseInt(document.getElementById('floor-count')?.value) || 5;
        const customPrefix = document.getElementById('custom-prefix')?.value?.trim() || '';

        if (!targetPerson) {
            this.showToast('...', 'error');
            return;
        }

        // Сохранить
        this.config.targetPerson = targetPerson;
        this.config.floorCount = floorCount;
        this.config.customPrefix = customPrefix;
        this.saveConfig();

        try {
            this.showToast('...Создать досье...', 'info');
            this.closeDialog();

            const requestContent = await this.buildRequestContent(targetPerson, floorCount, customPrefix);

            // API
            const result = await this.callCustomAPI(requestContent);

            if (result) {
                // Досье/* Страница деталей */，ПользовательПодтвердитьСохранить
                this.showProfileDetail(targetPerson, result);
            }
        } catch (error) {
            console.error('[Профиль] Создать досьеerror:', error);
            this.showToast(`Создать досье...: ${error.message}`, 'error');
        }
    }

    /**
     * ...API...
     */
    async buildRequestContent(targetPerson, floorCount, customPrefix) {
        console.log('[Профиль] ...');
        console.log('[Профиль] ...:', { targetPerson, floorCount, customPrefix });

        let recentContent = '';

        try {
            console.log('[Профиль] ...:', {
                chat: typeof chat !== 'undefined' ? `...: ${chat.length}` : '...',
                'window.chat': typeof window.chat !== 'undefined' ? `...: ${window.chat.length}` : '...',
                'window.messages': typeof window.messages !== 'undefined' ? `...: ${window.messages.length}` : '...',
                'window.contextMonitor': typeof window.contextMonitor !== 'undefined' ? '...' : '...',
                'contextMonitor.getCurrentChatMessages': typeof window.contextMonitor?.getCurrentChatMessages === 'function' ? '...' : '...'
            });

            let chatData = null;
            let dataSource = '';

            // contextMonitor（Рекомендации）
            if (window.contextMonitor && typeof window.contextMonitor.getCurrentChatMessages === 'function') {
                try {
                    console.log('[Профиль] ...contextMonitor......');
                    const contextData = await window.contextMonitor.getCurrentChatMessages();
                    if (contextData && contextData.messages && Array.isArray(contextData.messages) && contextData.messages.length > 0) {
                        chatData = contextData.messages;
                        dataSource = 'contextMonitor';
                        console.log('[Профиль] contextMonitor...，Сообщения...:', chatData.length);
                    } else {
                        console.warn('[Профиль] contextMonitorНазадerror:', contextData);
                    }
                } catch (error) {
                    console.warn('[Профиль] contextMonitorerror:', error);
                }
            }

            // ：chat
            if (!chatData) {
                if (typeof chat !== 'undefined' && Array.isArray(chat) && chat.length > 0) {
                    chatData = chat;
                    dataSource = 'chat';
                } else if (typeof window.chat !== 'undefined' && Array.isArray(window.chat) && window.chat.length > 0) {
                    chatData = window.chat;
                    dataSource = 'window.chat';
                } else if (typeof window.messages !== 'undefined' && Array.isArray(window.messages) && window.messages.length > 0) {
                    chatData = window.messages;
                    dataSource = 'window.messages';
                }
            }

            if (chatData) {
                console.log(`[Профиль] ...: ${dataSource}, ...Сообщения...: ${chatData.length}`);

                // /* Структура */
                if (chatData.length > 0) {
                    console.log('[Профиль] Сообщения.../* Структура */...:', {
                        messageFields: Object.keys(chatData[0] || {}),
                        firstMessage: chatData[0]
                    });
                }

                // Сообщения
                const recentMessages = chatData.slice(-floorCount);
                console.log('[Профиль] ...Сообщения...:', recentMessages.length);

                // Сообщения
                recentMessages.forEach((msg, index) => {
                    console.log(`[Профиль] Сообщения ${index + 1}:`, {
                        is_user: msg.is_user,
                        name: msg.name,
                        mes_preview: (msg.mes || '').substring(0, 100) + '...',
                        send_date: msg.send_date
                    });
                });

                recentContent = recentMessages.map((msg, index) => {
                    const speaker = msg.is_user ? 'Пользователь' : (msg.name || 'AI');
                    return `${speaker}: ${msg.mes}`;
                }).join('\n\n');

                console.log('[Профиль] ...:', recentContent.length);
                console.log('[Профиль] ...:', recentContent.substring(0, 300) + '...');
            } else {
                console.warn('[Профиль] error！');
                console.log('[Профиль] ...:', {
                    'typeof chat': typeof chat,
                    'chat value': chat,
                    'window.chat': window.chat,
                    'window.messages': window.messages,
                    'contextMonitor': window.contextMonitor
                });
            }
        } catch (error) {
            console.error('[Профиль] error:', error);
        }

        let fullContent = '';

        if (customPrefix) {
            fullContent += customPrefix + '\n\n';
            console.log('[Профиль] ...，...:', customPrefix.length);
        }

        fullContent += `...：${targetPerson}（...）\n\n`;

        if (recentContent) {
            fullContent += `...${floorCount}...：\n${recentContent}\n\n`;
            console.log('[Профиль] ...，...:', recentContent.length);
        } else {
            console.warn('[Профиль] error！');
        }

        fullContent += this.promptTemplate;

        console.log('[Профиль] ...:', fullContent.length);
        console.log('[Профиль] ...:', fullContent.substring(0, 500) + '...');
        console.log('[Профиль] ========== ... ==========');
        console.log(fullContent);
        console.log('[Профиль] ========== ... ==========');

        return fullContent;
    }

    /**
     * ...API
     */
    async callCustomAPI(content) {
        try {
            console.log('[Профиль] ...APIСоздать досье...');
            console.log('[Профиль] ...:', content.length);

            // mobileAPI
            if (window.mobileCustomAPIConfig && typeof window.mobileCustomAPIConfig.callAPI === 'function') {
                console.log('[Профиль] ...mobile...API...');

                // APIСообщения
                const messages = [
                    {
                        role: 'system',
                        content: '...，...Пользователь...Досье。'
                    },
                    {
                        role: 'user',
                        content: content
                    }
                ];

                console.log('[Профиль] ========== ...API...Сообщения ==========');
                console.log('SystemСообщения:', messages[0].content);
                console.log('UserСообщения...:', messages[1].content.length);
                console.log('UserСообщения...:', messages[1].content);
                console.log('[Профиль] ========== API...Сообщения... ==========');

                const apiOptions = {
                    temperature: 0.8,
                    max_tokens: 80000,
                };

                console.log('[Профиль] API...:', apiOptions);

                const response = await window.mobileCustomAPIConfig.callAPI(messages, apiOptions);

                console.log('[Профиль] ========== API... ==========');
                console.log('[Профиль] APIНазад...:', typeof response);
                console.log('[Профиль] APIНазад...:', response);
                console.log('[Профиль] ========== API... ==========');

                if (response && response.content) {
                    console.log('[Профиль] ...API...，...:', response.content.length);
                    return response.content;
                } else {
                    throw new Error('APIНазадerror');
                }
            }
            // ：SillyTavernAPI
            else if (typeof generateRaw !== 'undefined') {
                console.log('[Профиль] ...SillyTavern...API');
                const result = await generateRaw(content);
                return result;
            }
            // ：API
            else if (window.customApiConfig && typeof window.customApiConfig.callAPI === 'function') {
                console.log('[Профиль] ...API...');
                const result = await window.customApiConfig.callAPI(content);
                return result;
            }
            else {
                throw new Error('errorAPIerror，errorMobileerrorAPIНастройкиerrorAPI');
            }

        } catch (error) {
            console.error('[Профиль] APIerror:', error);
            throw error;
        }
    }

    /**
     * ...Досье...
     */
    showProfileDetail(personName, apiResponse) {
        // APIStudent_Profile
        const profileContent = this.extractStudentProfile(apiResponse);

        if (!profileContent) {
            this.showToast('...Досье...', 'error');
            return;
        }

        // Досье
        const profileData = this.parseStudentProfile(profileContent);

        // Сохранить
        this.saveCachedProfile(personName, profileData, profileContent);

        // Досье（message.html）
        this.showProfileDetailView(personName, profileData, profileContent);
    }

    /**
     * ...Student_Profile...
     */
    extractStudentProfile(content) {
        const startTag = '<Student_Profile>';
        const endTag = '</Student_Profile>';

        const lastEndTagIndex = content.lastIndexOf(endTag);
        const lastStartTagIndex = lastEndTagIndex !== -1 ? content.lastIndexOf(startTag, lastEndTagIndex) : -1;

        if (lastStartTagIndex !== -1 && lastEndTagIndex !== -1) {
            return content.substring(lastStartTagIndex, lastEndTagIndex + endTag.length).trim();
        }

        return null;
    }

    /**
     * ...Досье...
     */
    parseStudentProfile(profileContent) {
        const content = profileContent.replace(/<Student_Profile>|<\/Student_Profile>/g, '').trim();
        const fields = content.split('｜');

        return {
            student_name: fields[0] || "",
            gender: fields[1] || "",
            age: fields[2] || "",
            measurements: fields[3] || "",
            business_type: fields[4] || "",
            background_info: fields[5] || "",
            referral_source: fields[6] || "",
            video_interview_result: fields[7] || "",
            payment_status: fields[8] || "",
            current_condition: fields[9] || "",
            target_goals: fields[10] || "",
            special_notes: fields[11] || "",
            master_evaluation: fields[12] || "",
            psychological_state: fields[13] || "",
            personality_traits: fields[14] || "",
            main_weaknesses: fields[15] || "",
            main_advantages: fields[16] || "",
            resistance_points: fields[17] || "",
            favorite_positions: fields[18] || ""
        };
    }

    /**
     * ...Досье...
     */
    showProfileDetailView(personName, profileData, fullProfileContent) {
        const detailHTML = this.generateProfileDetailHTML(profileData, fullProfileContent);

        // /* Приложение */
        const appContent = document.querySelector('.app-content');
        if (appContent) {
            appContent.innerHTML = detailHTML;

            this.bindProfileDetailEvents(personName, fullProfileContent);
        }
    }

    /**
     * Создать досье...HTML（...message.html）
     */
    generateProfileDetailHTML(profileData, fullProfileContent) {
        return `
      <div class="profile-detail-app">
        <div class="profile-detail-header">
          <div class="header-left">
            <button class="back-btn" onclick="window.profileApp.goBackToList()">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2>${profileData.student_name || 'Досье...'}</h2>
          </div>
          <div class="header-right">
            <button class="refresh-btn" onclick="window.profileApp.refreshCurrentProfile('${profileData.student_name}')" title="...ОбновитьДосье">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>

        <div class="profile-detail-content">
          ${this.generateMessageHTMLContent(profileData)}
        </div>
      </div>
    `;
    }

    /**
     * ...message.html...
     */
    generateMessageHTMLContent(profileData) {
        // message.html/* Структура */，JS
        return `
      <div class="container" style="display: flex; flex-direction: column; width: 100%; padding: 0; gap: 15px; font-family: Arial, sans-serif; box-sizing: border-box;">
        <!-- ... -->
        <div class="card-area" style="position: relative; width: 100%;">
          <div style="position: relative; width: 100%; height: 100%;">
            <!-- ... -->
            <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 20px; box-sizing: border-box; overflow-y: auto;">
              <div style="font-size: 18px; color: #2c3e50; font-weight: bold; text-align: center; margin-bottom: 15px; border-bottom: 2px solid #6c757d; padding-bottom: 10px;">...</div>
              <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">

                <div style="flex: 2; min-width: 200px;">
                  <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                    <span style="font-size: 14px; color: #666; width: 80px; font-weight: bold;">...：</span>
                    <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.student_name}</span>
                  </div>
                  <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                    <span style="font-size: 14px; color: #666; width: 80px; font-weight: bold;">...：</span>
                    <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.gender}</span>
                  </div>
                  <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                    <span style="font-size: 14px; color: #666; width: 80px; font-weight: bold;">...：</span>
                    <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.age}</span>
                  </div>
                  <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                    <span style="font-size: 14px; color: #666; width: 80px; font-weight: bold;">...：</span>
                    <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.measurements}</span>
                  </div>
                  <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                    <span style="font-size: 14px; color: #666; width: 80px; font-weight: bold;">...：</span>
                    <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.business_type}</span>
                  </div>
                </div>
              </div>
              <div style="border-top: 1px solid #ddd; padding-top: 15px;">
                <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                  <span style="font-size: 14px; color: #666; width: 100px; font-weight: bold;">...：</span>
                  <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.referral_source}</span>
                </div>
                <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                  <span style="font-size: 14px; color: #666; width: 100px; font-weight: bold;">...：</span>
                  <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.payment_status}</span>
                </div>
                <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                  <span style="font-size: 14px; color: #666; width: 100px; font-weight: bold;">...：</span>
                  <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.current_condition}</span>
                </div>
              </div>

              <!-- ... -->
              <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;">
                <div style="font-size: 16px; color: #2c3e50; font-weight: bold; text-align: center; margin-bottom: 15px; border-bottom: 2px solid #6c757d; padding-bottom: 8px;">...</div>

                <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                  <span style="font-size: 14px; color: #666; width: 100px; font-weight: bold;">...Статус：</span>
                  <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.psychological_state}</span>
                </div>

                <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                  <span style="font-size: 14px; color: #666; width: 100px; font-weight: bold;">...：</span>
                  <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.personality_traits}</span>
                </div>

                <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                  <span style="font-size: 14px; color: #666; width: 100px; font-weight: bold;">...：</span>
                  <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.main_weaknesses}</span>
                </div>

                <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                  <span style="font-size: 14px; color: #666; width: 100px; font-weight: bold;">...：</span>
                  <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.main_advantages}</span>
                </div>

                <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                  <span style="font-size: 14px; color: #666; width: 100px; font-weight: bold;">...：</span>
                  <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.resistance_points}</span>
                </div>

                <div style="display: flex
;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-direction: column;">
                  <span style="font-size: 14px; color: #666; width: 100px; font-weight: bold;">...：</span>
                  <span style="font-size: 14px; color: #2c3e50; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; flex: 1; background: #fff;">${profileData.favorite_positions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ... -->
        <div style="width: 100%; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 15px; box-sizing: border-box; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 10px; width: 100%; flex-wrap: wrap;">
            <button id="saveProfileBtn" style="flex: 1; min-width: 120px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; font-size: clamp(12px, 2vw, 16px); font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">Сохранить...Досье</button>
          </div>
        </div>
      </div>

      <style>

        #saveProfileBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        #saveProfileBtn:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
        }
      </style>
    `;
    }

    /**
     * ...Досье...
     */
    bindProfileDetailEvents(personName, fullProfileContent) {
        const saveBtn = document.getElementById('saveProfileBtn');
        if (saveBtn) {
            saveBtn.onclick = () => this.saveProfileToWorldbook(personName, fullProfileContent);
        }
    }

    /**
     * СохранитьДосье...（...）
     */
    async saveProfileToWorldbook(personName, profileContent) {
        try {
            console.log('[Профиль] ...СохранитьДосье...');

            // ""
            let targetWorldbookName = null;

            // 1：""
            const worldInfoSelect = document.getElementById('world_info');
            if (worldInfoSelect && worldInfoSelect.selectedOptions.length > 0) {
                // ""
                const mobileWorldbook = Array.from(worldInfoSelect.selectedOptions).find(option =>
                    option.text === '...' || option.text.includes('...') || option.text.includes('mobile')
                );

                if (mobileWorldbook) {
                    targetWorldbookName = mobileWorldbook.text;
                    console.log(`[Профиль] ...: ${targetWorldbookName}`);
                } else {
                    // Если，
                    targetWorldbookName = worldInfoSelect.selectedOptions[0].text;
                    console.log(`[Профиль] ...: ${targetWorldbookName}`);
                }
            } else if (typeof window.selected_world_info !== 'undefined' && Array.isArray(window.selected_world_info) && window.selected_world_info.length > 0) {
                // 2：
                const mobileWorldbook = window.selected_world_info.find(name =>
                    name === '...' || name.includes('...') || name.includes('mobile')
                );

                if (mobileWorldbook) {
                    targetWorldbookName = mobileWorldbook;
                    console.log(`[Профиль] ...: ${targetWorldbookName}`);
                } else {
                    targetWorldbookName = window.selected_world_info[0];
                    console.log(`[Профиль] ...: ${targetWorldbookName}`);
                }
            } else {
                throw new Error('error，errorSillyTavernerror（error"error"error）');
            }

            const entryName = `【Досье】${personName}`;

            console.log('[Профиль] ...API...:', {
                createWorldInfoEntry: typeof createWorldInfoEntry,
                saveWorldInfo: typeof saveWorldInfo,
                TavernHelper: typeof TavernHelper,
                getWorldbook: typeof getWorldbook
            });

            // Сохранить
            let saveSuccess = false;
            let lastError = null;



            // 4：REST API
            if (!saveSuccess) {
                try {
                    console.log('[Профиль] ...4：REST API');

                    const success = await this.saveToWorldbookViaAPI(targetWorldbookName, {
                        comment: entryName,
                        content: profileContent,
                        key: [personName],
                        keysecondary: [],
                        constant: false,
                        selective: true,
                        sticky: 0,
                        cooldown: 0,
                        delay: 0,
                        depth: 4,
                        out_depth: 0,
                        position: 0,
                        role: 0,
                        disable: true  // Настройки...Статус
                    });

                    if (success) {
                        saveSuccess = true;
                        console.log('[Профиль] ...4Сохранить...');
                    }
                } catch (error) {
                    console.warn('[Профиль] error4error:', error);
                    lastError = error;
                }
            }

            // 5：，СохранитьПользователь/* Импорт */
            if (!saveSuccess) {
                try {
                    console.log('[Профиль] ...5：...');

                    // Сохранить
                    const backupKey = `profile-backup-${personName}-${Date.now()}`;
                    const backupData = {
                        worldbookName: targetWorldbookName,
                        entryName: entryName,
                        entryData: {
                            comment: entryName,
                            content: profileContent,
                            key: [personName],
                            keysecondary: [],
                            constant: false,
                            selective: true,
                            sticky: 0,
                            cooldown: 0,
                            delay: 0,
                            depth: 4,
                            out_depth: 0,
                            position: 0,
                            role: 0,
                            disable: true  // Настройки...Статус
                        },
                        timestamp: new Date().toISOString()
                    };

                    localStorage.setItem(backupKey, JSON.stringify(backupData));

                    saveSuccess = true;
                    console.log('[Профиль] ...4：...Сохранить...');

                    this.showToast(`Досье...Сохранить...。...API...，Досье...。`, 'warning');
                } catch (error) {
                    console.warn('[Профиль] error4error:', error);
                    lastError = error;
                }
            }

            if (saveSuccess) {
                if (lastError) {
                    console.log(`[Профиль] ДосьеСохранить...（...）`);
                } else {
                    this.showToast(`Досье"${entryName}"Сохранить...！`, 'success');
                }

                // СохранитьНазад/* Список */，ПользовательОбновить
                this.goBackToList();
            } else {
                throw lastError || new Error('errorСохранитьerror');
            }

        } catch (error) {
            console.error('[Профиль] СохранитьДосьеerror:', error);
            this.showToast(`Сохранить...: ${error.message}`, 'error');
        }
    }

    /**
     * ...REST APIСохранить...（...）
     */
    async saveToWorldbookViaAPI(worldName, entryData) {
        try {
            const existingWorldData = await this.loadWorldInfoByName(worldName);

            if (!existingWorldData) {
                throw new Error(`error "${worldName}" error`);
            }

            // ID（）
            const entryId = Date.now();

            // （SillyTavern）
            const newEntryTemplate = {
                uid: entryId,
                key: entryData.key || [],
                keysecondary: entryData.keysecondary || [],
                comment: entryData.comment,
                content: entryData.content,
                constant: entryData.constant || false,
                vectorized: false,
                selective: entryData.selective || false,
                selectiveLogic: 0, // AND_ANY
                addMemo: true,
                order: 100,
                position: entryData.position || 0,
                disable: true,  // Настройки...Статус
                ignoreBudget: false,
                excludeRecursion: false,
                preventRecursion: false,
                matchPersonaDescription: false,
                matchCharacterDescription: false,
                matchCharacterPersonality: false,
                matchCharacterDepthPrompt: false,
                matchScenario: false,
                matchCreatorNotes: false,
                delayUntilRecursion: 0,
                probability: 100,
                useProbability: true,
                depth: entryData.depth || 4,
                group: '',
                groupOverride: false,
                groupWeight: 100,
                scanDepth: null,
                caseSensitive: null,
                matchWholeWords: null,
                useGroupScoring: null,
                automationId: '',
                role: entryData.role || 0,
                sticky: entryData.sticky || null,
                cooldown: entryData.cooldown || null,
                delay: entryData.delay || null,
                triggers: [],
                characterFilter: {
                    isExclude: false,
                    names: [],
                    tags: []
                }
            };

            const updatedWorldData = {
                ...existingWorldData,
                entries: {
                    ...existingWorldData.entries,
                    [entryId]: newEntryTemplate
                }
            };

            const headers = {
                'Content-Type': 'application/json',
            };

            // ЕслиgetRequestHeaders，
            if (typeof window.getRequestHeaders === 'function') {
                Object.assign(headers, window.getRequestHeaders());
            }

            const response = await fetch('/api/worldinfo/edit', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: worldName,
                    data: updatedWorldData
                }),
            });

            if (response.ok) {
                console.log(`[Профиль] APIНазад...，...Сохранить......`);

                // Сохранить
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Сохранить
                const verifyData = await this.loadWorldInfoByName(worldName);
                const savedEntry = Object.values(verifyData.entries || {}).find(entry => entry.comment === entryData.comment);

                if (savedEntry) {
                    console.log(`[Профиль] REST APIСохранить...，...`);
                    return true;
                } else {
                    console.error(`[Профиль] REST APIСохранитьerror，error`);
                    return false;
                }
            } else {
                const errorText = await response.text();
                console.error(`[Профиль] APIСохранитьerror: ${response.status} ${response.statusText}`, errorText);
                return false;
            }

        } catch (error) {
            console.error('[Профиль] REST APIСохранитьerror:', error);
            return false;
        }
    }

    /**
     * ...Досье
     */
    async viewProfile(profileName) {
        try {
            const cachedProfile = this.getCachedProfile(profileName);
            if (cachedProfile) {
                console.log('[Профиль] ...Досье:', profileName);
                this.showProfileDetailView(profileName, cachedProfile.profileData, cachedProfile.fullContent);
                return;
            }

            // ，
            const profile = this.profileList.find(p => p.name === profileName);
            if (!profile) {
                this.showToast('Досье...', 'error');
                return;
            }

            console.log('[Профиль] ...Досье:', profileName);
            // Досье
            const profileContent = this.extractStudentProfile(profile.content);
            if (profileContent) {
                const profileData = this.parseStudentProfile(profileContent);

                // Сохранить
                this.saveCachedProfile(profileName, profileData, profileContent);

                this.showProfileDetailView(profileName, profileData, profileContent);
            } else {
                this.showToast('Досье...', 'error');
            }
        } catch (error) {
            console.error('[Профиль] errorДосьеerror:', error);
            this.showToast('...Досье...', 'error');
        }
    }

    /**
     * ...Обновить...Досье
     */
    async refreshCurrentProfile(profileName) {
        try {
            console.log('[Профиль] ...ОбновитьДосье:', profileName);

            // Досье
            this.profileCache.delete(profileName);

            // Досье
            await this.loadProfileList();

            // Досье
            await this.viewProfile(profileName);

            this.showToast('Досье...Обновить', 'success');
        } catch (error) {
            console.error('[Профиль] ОбновитьДосьеerror:', error);
            this.showToast('ОбновитьДосье...', 'error');
        }
    }

    /**
     * НазадДосье/* Список */
     */
    goBackToList() {
        const appContent = document.querySelector('.app-content');
        if (appContent) {
            appContent.innerHTML = this.getAppContent();
        }
    }

    /**
     * .../* Диалог */
     */
    showDialog(html) {
        let container = document.getElementById('profile-dialog-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'profile-dialog-container';
            container.className = 'profile-dialog-container';

            // body，
            document.body.appendChild(container);
        }

        container.innerHTML = html;
        container.style.display = 'block';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '99999';

        // /* Анимации */
        setTimeout(() => {
            const dialog = container.querySelector('.profile-dialog');
            if (dialog) {
                dialog.classList.add('show');
            }
        }, 10);

        document.body.style.overflow = 'hidden';

        console.log('[Профиль] /* Диалог */...');
    }

    /**
     * Закрыть/* Диалог */
     */
    closeDialog() {
        const container = document.getElementById('profile-dialog-container');
        if (!container) return;

        const dialog = container.querySelector('.profile-dialog');
        if (dialog) {
            dialog.classList.remove('show');
        }

        setTimeout(() => {
            container.style.display = 'none';
            container.innerHTML = '';

            document.body.style.overflow = '';
        }, 200);
    }

    /**
     * ...
     */
    showDebugInfo() {
        const debugInfo = {
            // API
            apis: {
                TavernHelper: typeof TavernHelper !== 'undefined',
                getWorldbook: typeof getWorldbook !== 'undefined',
                createWorldbookEntries: typeof createWorldbookEntries !== 'undefined',
                createWorldInfoEntry: typeof createWorldInfoEntry !== 'undefined',
                saveWorldInfo: typeof saveWorldInfo !== 'undefined',
                mobileCustomAPIConfig: typeof window.mobileCustomAPIConfig !== 'undefined',
                getSortedEntries: typeof window.getSortedEntries !== 'undefined'
            },

            worldbooks: {
                selected_world_info: window.selected_world_info || 'undefined',
                world_info_globalSelect: window.world_info?.globalSelect || 'undefined',
                dom_selection: this.getSelectedWorldbooksFromDOM()
            },

            cache: {
                profileCacheSize: this.profileCache.size,
                cachedProfiles: Array.from(this.profileCache.keys())
            },

            config: this.config
        };

        const debugHTML = `
      <div class="profile-dialog-overlay">
        <div class="profile-dialog" style="max-width: 600px;">
          <div class="dialog-header">
            <h3>...</h3>
            <button class="close-btn" onclick="window.profileApp.closeDialog()">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="dialog-content">
            <div style="font-family: monospace; font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 4px; max-height: 400px; overflow-y: auto;">
              <pre>${JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
            <div style="margin-top: 10px; text-align: center;">
              <button onclick="navigator.clipboard.writeText('${JSON.stringify(debugInfo, null, 2).replace(/'/g, "\\'")}').then(() => alert('...'))">...</button>
            </div>
          </div>

          <div class="dialog-footer">
            <button class="confirm-btn" onclick="window.profileApp.closeDialog()">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    `;

        this.showDialog(debugHTML);
        console.log('[Профиль] ...:', debugInfo);
    }

    /**
     * ...DOM...
     */
    getSelectedWorldbooksFromDOM() {
        const worldInfoSelect = document.getElementById('world_info');
        if (worldInfoSelect) {
            return Array.from(worldInfoSelect.selectedOptions).map(opt => ({
                text: opt.text,
                value: opt.value
            }));
        }
        return 'DOM...';
    }

    /**
     * ...Сообщения
     */
    showToast(message, type = 'info') {
        // Еслиtoast，
        if (window.showMobileToast) {
            window.showMobileToast(message, type);
            return;
        }

        const toast = document.createElement('div');
        toast.className = `profile-toast profile-toast-${type}`;
        toast.textContent = message;

        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            borderRadius: '20px',
            color: 'white',
            fontSize: '14px',
            zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.3s ease',
        });

        // Настройки
        switch (type) {
            case 'success':
                toast.style.background = '#52c41a';
                break;
            case 'error':
                toast.style.background = '#ff4d4f';
                break;
            default:
                toast.style.background = '#1890ff';
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

if (typeof window !== 'undefined') {
    window.ProfileApp = ProfileApp;
    window.profileApp = new ProfileApp();
    console.log('[Профиль] ✅ Досье.../* Приложение */...');
}
