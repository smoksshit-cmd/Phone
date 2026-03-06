/**
 * Task App - Задание/* Приложение */
 * ...shop-app.js...，...mobile-phone.js...Задание...
 */

// @ts-nocheck
if (typeof window.RuApp_tasks === 'undefined') {
  class RuApp_tasks {
    constructor() {
      this.currentView = 'taskList'; // 'taskList', 'inProgress', 'completed'
      this.tasks = [];
      this.acceptedTasks = [];
      this.completedTasks = [];
      this.contextMonitor = null;
      this.lastTaskCount = 0;
      this.isAutoRenderEnabled = true;
      this.lastRenderTime = 0;
      this.renderCooldown = 1000;
      this.eventListenersSetup = false;
      this.contextCheckInterval = null;

      this.init();
    }

    init() {
      console.log('[Задания] Задание/* Приложение */... - ... 3.0 (... + ...)');

      this.parseTasksFromContext();

      // ，
      setTimeout(() => {
        this.setupContextMonitor();
      }, 100);

      console.log('[Задания] Задание/* Приложение */... - ... 3.0');
    }

    // Настройка мониторинга контекста
    setupContextMonitor() {
      console.log('[Задания] Настройки......');

      // ，
      // SillyTavern（MESSAGE_RECEIVED CHAT_CHANGED）
      this.setupSillyTavernEventListeners();
    }

    // ОбновитьЗадание（）
    refreshTasksData() {
      console.log('[Задания] 🔄 ...ОбновитьЗадание......');
                this.parseTasksFromContext();
    }

    // НастройкиSillyTavern
    setupSillyTavernEventListeners() {
      // Настройки
      if (this.eventListenersSetup) {
        return;
      }

      try {
        // SillyTavern
        const eventSource = window['eventSource'];
        const event_types = window['event_types'];

        if (eventSource && event_types) {
          this.eventListenersSetup = true;

          // Обновить（СообщенияОбновить）
          const handleMessageReceived = () => {
            console.log('[Задания] 📨 ... MESSAGE_RECEIVED ...，ОбновитьЗадание......');
            setTimeout(() => {
              this.parseTasksFromContext();

              // Если/* Приложение */Статус，ОбновитьUI
              const appContent = document.getElementById('app-content');
              if (appContent && appContent.querySelector('.task-list')) {
                console.log('[Задания] 🔄 ...ОбновитьЗадание/* Приложение */UI...');
                appContent.innerHTML = this.getAppContent();
                this.bindEvents();
              }
            }, 500);
          };

          // Сообщения（AIОтветить）
          if (event_types.MESSAGE_RECEIVED) {
            eventSource.on(event_types.MESSAGE_RECEIVED, handleMessageReceived);
            console.log('[Задания] ✅ ... MESSAGE_RECEIVED ...');
          }

          // （）
          if (event_types.CHAT_CHANGED) {
            eventSource.on(event_types.CHAT_CHANGED, () => {
              console.log('[Задания] 📨 ...，ОбновитьЗадание......');
              setTimeout(() => {
                this.parseTasksFromContext();
              }, 500);
            });
            console.log('[Задания] ✅ ... CHAT_CHANGED ...');
          }

          // Сохранить
          this.messageReceivedHandler = handleMessageReceived;
        } else {
          // ，25
          setTimeout(() => {
            this.setupSillyTavernEventListeners();
          }, 5000);
        }
      } catch (error) {
        console.warn('[Задания] НастройкиSillyTavernerror:', error);
      }
    }

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Задание
    parseTasksFromContext() {
      try {
        // Задание
        const taskData = this.getCurrentTaskData();

        // Проверка изменений статуса
        const tasksChanged = taskData.tasks.length !== this.tasks.length || this.hasTasksChanged(taskData.tasks);
        const acceptedChanged =
          JSON.stringify(taskData.acceptedTasks.sort()) !== JSON.stringify(this.acceptedTasks.sort());
        const completedChanged =
          JSON.stringify(taskData.completedTasks.sort()) !== JSON.stringify(this.completedTasks.sort());

        // Если，
        if (tasksChanged || acceptedChanged || completedChanged) {
          console.log('[Задания] ...ЗаданиеСтатус...:', {
            tasksChanged,
            acceptedChanged,
            completedChanged,
            oldAccepted: this.acceptedTasks,
            newAccepted: taskData.acceptedTasks,
            oldCompleted: this.completedTasks,
            newCompleted: taskData.completedTasks,
          });

          this.tasks = taskData.tasks;
          this.acceptedTasks = taskData.acceptedTasks;
          this.completedTasks = taskData.completedTasks;
          console.log('[Задания] 📋 Задание...');

          // Задание/* Приложение */UI
          if (this.isCurrentlyActive()) {
            console.log('[Задания] 🎨 Задание/* Приложение */...Статус，...UI...');
          this.updateTaskList();
          } else {
            console.log('[Задания] 💤 Задание/* Приложение */...，...UI...');
          }
        }
      } catch (error) {
        console.error('[Задания] errorЗаданиеerror:', error);
      }
    }

    // Задание/* Приложение */
    isCurrentlyActive() {
      const appContent = document.getElementById('app-content');
      if (!appContent) return false;

      // Задание/* Приложение */
      return appContent.querySelector('.task-tabs') !== null || appContent.querySelector('.task-list') !== null;
    }

    /**
     * ...Задание...（... Mvu ... + ...）
     */
    getCurrentTaskData() {
      try {
        // 1: Mvu （shop-app：）
        if (window.Mvu && typeof window.Mvu.getMvuData === 'function') {
          // СообщенияID（AIСообщения）
          let targetMessageId = 'latest';

          if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
            let currentId = window.getLastMessageId();

            // AIСообщения（ПользовательСообщения）
            while (currentId >= 0) {
              const message = window.getChatMessages(currentId).at(-1);
              if (message && message.role !== 'user') {
                targetMessageId = currentId;
                if (currentId !== window.getLastMessageId()) {
                  console.log(`[Задания] 📝 ... ${currentId} ...AIСообщения`);
                }
                break;
              }
              currentId--;
            }

            if (currentId < 0) {
              targetMessageId = 'latest';
              console.warn('[Задания] ⚠️ errorAIСообщения，error');
            }
          }

          console.log('[Задания] ...СообщенияID:', targetMessageId);

          const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
          console.log('[Задания] ... Mvu ...:', mvuData);
          console.log('[Задания] stat_data ...:', !!mvuData?.stat_data);
          if (mvuData?.stat_data) {
            console.log('[Задания] stat_data ...:', Object.keys(mvuData.stat_data));
            console.log('[Задания] Задание...:', !!mvuData.stat_data['Задание']);
            if (mvuData.stat_data['Задание']) {
              console.log('[Задания] Задание...:', mvuData.stat_data['Задание']);
            }
          }

          // stat_data
          if (mvuData && mvuData.stat_data && mvuData.stat_data['Задание']) {
            const taskData = mvuData.stat_data['Задание'];
            console.log('[Задания] ✅ ... stat_data ...Задание...:', taskData);
            return this.parseTaskData(taskData);
          }

          // （ stat_data ）
          if (mvuData && mvuData['Задание']) {
            const taskData = mvuData['Задание'];
            console.log('[Задания] ✅ ...Задание...:', taskData);
            return this.parseTaskData(taskData);
          }

          // Если stat_data variables ， variables
          if (mvuData && !mvuData.stat_data && window.SillyTavern) {
            const context = window.SillyTavern.getContext ? window.SillyTavern.getContext() : window.SillyTavern;
            if (context && context.chatMetadata && context.chatMetadata.variables) {
              const stat_data = context.chatMetadata.variables['stat_data'];
              if (stat_data && stat_data['Задание']) {
                console.log('[Задания] ... variables.stat_data ...Задание...');
                return this.parseTaskData(stat_data['Задание']);
              }
            }
          }
        }

        // 2: SillyTavern （）
        if (window.SillyTavern) {
          const context = window.SillyTavern.getContext ? window.SillyTavern.getContext() : window.SillyTavern;
          if (context && context.chatMetadata && context.chatMetadata.variables) {
            // variables.stat_data
            const stat_data = context.chatMetadata.variables['stat_data'];
            if (stat_data && stat_data['Задание']) {
              console.log('[Задания] ... context.chatMetadata.variables.stat_data ...Задание...');
              return this.parseTaskData(stat_data['Задание']);
            }

            // variables
            const taskData = context.chatMetadata.variables['Задание'];
            if (taskData && typeof taskData === 'object') {
              console.log('[Задания] ... context.chatMetadata.variables ...Задание...');
              return this.parseTaskData(taskData);
            }
          }
        }

        console.log('[Задания] ...Задание...');
      } catch (error) {
        console.warn('[Задания] errorЗаданиеerror:', error);
      }

      return { tasks: [], acceptedTasks: [], completedTasks: [] };
    }

    /**
     * ...Задание...
     * Задание/* Структура */：{ t001: {Задание...: [..., ''], ЗаданиеСтатус: [..., ''], Задание...: [..., ''], Награда: [..., '']}, ... }
     * ЗаданиеСтатус：.../В процессе/Выполнено
     */
    parseTaskData(taskData) {
      const tasks = [];
      const acceptedTaskIds = [];
      const completedTaskIds = [];

      try {
        // ЗаданиеЗадание
        Object.keys(taskData).forEach(taskKey => {
          if (taskKey === '$meta') return;

          const task = taskData[taskKey];
          if (!task || typeof task !== 'object') return;

          // Задание（：[, ]）
          const getValue = (field) => task[field] && Array.isArray(task[field]) ? task[field][0] : '';

          const taskName = getValue('Задание...') || taskKey;
          const taskDescription = getValue('Задание...') || '';
          const taskStatus = getValue('ЗаданиеСтатус') || '...';
          const taskReward = getValue('Награда') || '';

          if (!taskName) return;

          // СтатусОКЗаданиеСтатус
          let status = 'available';
          if (taskStatus === 'В процессе') {
            status = 'inProgress';
            acceptedTaskIds.push(taskKey);
          } else if (taskStatus === 'Выполнено') {
            status = 'completed';
            completedTaskIds.push(taskKey);
          }

          tasks.push({
            id: taskKey,
            name: taskName,
            description: taskDescription,
            publisher: '...',
            reward: taskReward,
            status: status,
            timestamp: new Date().toLocaleString(),
          });
        });

        console.log('[Задания] ...Задание...，Задание...:', tasks.length);
        console.log('[Задания] ...:', tasks.filter(t => t.status === 'available').length);
        console.log('[Задания] В процессе:', acceptedTaskIds.length);
        console.log('[Задания] Выполнено:', completedTaskIds.length);
      } catch (error) {
        console.error('[Задания] errorЗаданиеerror:', error);
      }

      return { tasks, acceptedTasks: acceptedTaskIds, completedTasks: completedTaskIds };
    }

    // Задание
    hasTasksChanged(newTasks) {
      if (newTasks.length !== this.tasks.length) {
        return true;
      }

      for (let i = 0; i < newTasks.length; i++) {
        const newTask = newTasks[i];
        const oldTask = this.tasks[i];

        if (
          !oldTask ||
          newTask.id !== oldTask.id ||
          newTask.name !== oldTask.name ||
          newTask.description !== oldTask.description ||
          newTask.publisher !== oldTask.publisher ||
          newTask.reward !== oldTask.reward
        ) {
          return true;
        }
      }

      return false;
    }

    // Задание
    getTaskIcon(status) {
      const iconMap = {
        available: '📋',
        inProgress: '⏳',
        completed: '✅',
      };
      return iconMap[status] || iconMap['available'];
    }

    getChatData() {
      try {
        // mobileContextEditor
        const mobileContextEditor = window['mobileContextEditor'];
        if (mobileContextEditor) {
          const chatData = mobileContextEditor.getCurrentChatData();
          if (chatData && chatData.messages && chatData.messages.length > 0) {
            return chatData.messages;
          }
        }

        const chat = window['chat'];
        if (chat && Array.isArray(chat)) {
          return chat;
        }

        const SillyTavern = window['SillyTavern'];
        if (SillyTavern && SillyTavern.chat) {
          return SillyTavern.chat;
        }

        return [];
      } catch (error) {
        console.error('[Задания] error:', error);
        return [];
      }
    }

    // /* Приложение */
    getAppContent() {
      // Открыть/* Приложение */（Новое）
      const taskData = this.getCurrentTaskData();
      if (taskData.tasks.length !== this.tasks.length || this.hasTasksChanged(taskData.tasks)) {
        this.tasks = taskData.tasks;
        console.log('[Задания] 📋 Открыть/* Приложение */...Задание...，Задание...:', this.tasks.length);
      }

      switch (this.currentView) {
        case 'taskList':
          return this.renderTaskList();
        case 'inProgress':
          return this.renderInProgress();
        case 'completed':
          return this.renderCompleted();
        default:
          return this.renderTaskList();
      }
    }

    // Список заданий
    renderTaskList() {
      console.log('[Задания] ...Список заданий...');

      const availableTasks = this.tasks.filter(
        task => !this.acceptedTasks.includes(task.id) && !this.completedTasks.includes(task.id),
      );

      const inProgressTasks = this.tasks.filter(
        task => this.acceptedTasks.includes(task.id) && !this.completedTasks.includes(task.id),
      );

      const completedTasks = this.tasks.filter(task => this.completedTasks.includes(task.id));

      const taskItems = availableTasks
        .map(
          task => `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-info">
                    <div class="task-header-row">
                        <div class="task-name">${task.name}</div>
                        <button class="accept-task-btn" data-task-id="${task.id}">
                            ...Задание
                        </button>
                    </div>
                    <div class="task-id">ЗаданиеID: ${task.id}</div>
                    <div class="task-description">${task.description}</div>
                    <div class="task-reward">Награда: ${task.reward}</div>
                    <div class="task-publisher">Опубликовать...: ${task.publisher}</div>
                </div>
            </div>
        `,
        )
        .join('');

      const emptyState = `
            <div class="task-empty-state">
                <div class="empty-icon">📋</div>
                <div class="empty-title">...Задание</div>
            </div>
        `;

      return `
            <div class="task-app">
                <!-- ... -->
                <div class="task-tabs">
                    <button class="task-tab ${this.currentView === 'taskList' ? 'active' : ''}" data-view="taskList">
                        Задание (${availableTasks.length})
                    </button>
                    <button class="task-tab ${
                      this.currentView === 'inProgress' ? 'active' : ''
                    }" data-view="inProgress">
                        В процессе (${inProgressTasks.length})
                    </button>
                    <button class="task-tab ${this.currentView === 'completed' ? 'active' : ''}" data-view="completed">
                        Выполнено (${completedTasks.length})
                    </button>
                </div>

                <!-- Задание... -->
                <div class="task-list">
                    <div class="task-grid">
                        ${availableTasks.length > 0 ? taskItems : emptyState}
                    </div>
                </div>
            </div>
        `;
    }

    // В процессеЗадание
    renderInProgress() {
      console.log('[Задания] ...В процессеЗадание...');

      const availableTasks = this.tasks.filter(
        task => !this.acceptedTasks.includes(task.id) && !this.completedTasks.includes(task.id),
      );

      const inProgressTasks = this.tasks.filter(
        task => this.acceptedTasks.includes(task.id) && !this.completedTasks.includes(task.id),
      );

      const completedTasks = this.tasks.filter(task => this.completedTasks.includes(task.id));

      const taskItems = inProgressTasks
        .map(
          task => `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-info">
                    <div class="task-header-row">
                        <div class="task-name">${task.name}</div>
                        <div class="task-status">В процессе</div>
                    </div>
                    <div class="task-id">ЗаданиеID: ${task.id}</div>
                    <div class="task-description">${task.description}</div>
                    <div class="task-reward">Награда: ${task.reward}</div>
                    <div class="task-publisher">Опубликовать...: ${task.publisher}</div>
                </div>
            </div>
        `,
        )
        .join('');

      const emptyState = `
            <div class="task-empty-state">
                <div class="empty-icon">⏳</div>
                <div class="empty-title">...В процессеЗадание</div>
                <div class="empty-subtitle">...Задание...</div>
                <button class="back-to-tasks-btn">...Задание</button>
            </div>
        `;

      return `
            <div class="task-app">
                <!-- ... -->
                <div class="task-tabs">
                    <button class="task-tab ${this.currentView === 'taskList' ? 'active' : ''}" data-view="taskList">
                        Задание (${availableTasks.length})
                    </button>
                    <button class="task-tab ${
                      this.currentView === 'inProgress' ? 'active' : ''
                    }" data-view="inProgress">
                        В процессе (${inProgressTasks.length})
                    </button>
                    <button class="task-tab ${this.currentView === 'completed' ? 'active' : ''}" data-view="completed">
                        Выполнено (${completedTasks.length})
                    </button>
                </div>

                <!-- Задание... -->
                <div class="task-list">
                    <div class="task-grid">
                        ${inProgressTasks.length > 0 ? taskItems : emptyState}
                    </div>
                </div>
            </div>
        `;
    }

    // ВыполненоЗадание
    renderCompleted() {
      console.log('[Задания] ...ВыполненоЗадание...');

      const availableTasks = this.tasks.filter(
        task => !this.acceptedTasks.includes(task.id) && !this.completedTasks.includes(task.id),
      );

      const inProgressTasks = this.tasks.filter(
        task => this.acceptedTasks.includes(task.id) && !this.completedTasks.includes(task.id),
      );

      const completedTasks = this.tasks.filter(task => this.completedTasks.includes(task.id));

      const taskItems = completedTasks
        .map(
          task => `
            <div class="task-item completed" data-task-id="${task.id}">
                <div class="task-info">
                    <div class="task-header-row">
                        <div class="task-name">${task.name}</div>
                        <div class="task-status">Выполнено</div>
                    </div>
                    <div class="task-id">ЗаданиеID: ${task.id}</div>
                    <div class="task-description">${task.description}</div>
                    <div class="task-reward">Награда: ${task.reward}</div>
                    <div class="task-publisher">Опубликовать...: ${task.publisher}</div>
                </div>
            </div>
        `,
        )
        .join('');

      const emptyState = `
            <div class="task-empty-state">
                <div class="empty-icon">✅</div>
                <div class="empty-title">...ВыполненоЗадание</div>
                <div class="empty-subtitle">Выполнить задание...</div>
                <button class="back-to-tasks-btn">...Задание</button>
            </div>
        `;

      return `
            <div class="task-app">
                <!-- ... -->
                <div class="task-tabs">
                    <button class="task-tab ${this.currentView === 'taskList' ? 'active' : ''}" data-view="taskList">
                        Задание (${availableTasks.length})
                    </button>
                    <button class="task-tab ${
                      this.currentView === 'inProgress' ? 'active' : ''
                    }" data-view="inProgress">
                        В процессе (${inProgressTasks.length})
                    </button>
                    <button class="task-tab ${this.currentView === 'completed' ? 'active' : ''}" data-view="completed">
                        Выполнено (${completedTasks.length})
                    </button>
                </div>

                <!-- Задание... -->
                <div class="task-list">
                    <div class="task-grid">
                        ${completedTasks.length > 0 ? taskItems : emptyState}
                    </div>
                </div>
            </div>
        `;
    }

    // Список заданий
    updateTaskList() {
      console.log('[Задания] ...Список заданий...');
      this.updateAppContent();
    }

    // /* Приложение */
    updateAppContent() {
      const content = this.getAppContent();
      const appElement = document.getElementById('app-content');
      if (appElement) {
        appElement.innerHTML = content;
        // ，DOM
        setTimeout(() => {
          this.bindEvents();
        }, 50);
      }
    }

    bindEvents() {
      console.log('[Задания] ......');

      // /* Приложение */，/* Приложение */
      const appContainer = document.getElementById('app-content');
      if (!appContainer) {
        console.error('[Задания] /* Приложение */error');
        return;
      }

      // Принять задание
      appContainer.querySelectorAll('.accept-task-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const taskId = e.target.dataset.taskId;
          console.log('[Задания] ...Принять задание...:', taskId);
          this.acceptTask(taskId);
        });
      });

      // НазадСписок заданий
      appContainer.querySelectorAll('.back-to-tasks-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          console.log('[Задания] ...НазадСписок заданий...');
          this.showTaskList();
        });
      });

      appContainer.querySelectorAll('.task-tab').forEach(tab => {
        tab.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const view = e.target.dataset.view;
          console.log('[Задания] ...:', view);
          this.switchView(view);
        });
      });

      // ОбновитьЗадание
      appContainer.querySelectorAll('.refresh-tasks-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          console.log('[Задания] ...ОбновитьЗадание...');
          this.refreshTaskList();
          this.showToast('...ОбновитьЗаданиеСтатус...', 'info');
        });
      });

      console.log(
        '[Задания] ... - ...:',
        appContainer.querySelectorAll('.task-tab').length,
        '..., Обновить...:',
        appContainer.querySelectorAll('.refresh-tasks-btn').length,
        '...',
      );
    }

    // Принять задание（）
    async acceptTask(taskId) {
      console.log('[Задания] Принять задание:', taskId);

      const task = this.tasks.find(t => t.id === taskId && t.status === 'available');
      if (!task) {
        this.showToast('Задание...', 'warning');
        return;
      }

      try {
        // Mvu
        await this.acceptTaskDirectly(task);

        this.showToast('Задание...！', 'success');

        // ОбновитьСписок заданий
        this.refreshTasksData();
      } catch (error) {
        console.error('[Задания] Принять заданиеerror:', error);
        this.showToast('Принять задание...: ' + error.message, 'error');
      }
    }

    // MvuПринять задание（ЗаданиеСтатус）
    async acceptTaskDirectly(task) {
      try {
        console.log('[Задания] ......');

        // СообщенияID
        let targetMessageId = 'latest';
        if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
          let currentId = window.getLastMessageId();
          while (currentId >= 0) {
            const message = window.getChatMessages(currentId).at(-1);
            if (message && message.role !== 'user') {
              targetMessageId = currentId;
              break;
            }
            currentId--;
          }
        }

        // Mvu
        const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
        if (!mvuData || !mvuData.stat_data) {
          throw new Error('errorMvuerror');
        }

        // Задание
        if (!mvuData.stat_data['Задание']) {
          throw new Error('Заданиеerror');
        }

        const taskKey = task.id;

        // 1. ЗаданиеСтатус"В процессе"
        await window.Mvu.setMvuVariable(mvuData, `Задание.${taskKey}.ЗаданиеСтатус[0]`, 'В процессе', {
          reason: `Принять задание：${task.name}`,
          is_recursive: false
        });
        console.log(`[Задания] ✅ ЗаданиеСтатус...: ${taskKey} -> В процессе`);

        // 2. （AI）
        // Принять заданиеAIОтветить

        // Сохранить
        await window.Mvu.replaceMvuData(mvuData, { type: 'message', message_id: targetMessageId });

        console.log('[Задания] ✅ ...');
      } catch (error) {
        console.error('[Задания] error:', error);
        throw error;
      }
    }

    // Время（AIСообщения）
    getCurrentGameTime() {
      try {
        // Mvu （AIСообщения）
        if (window.Mvu && typeof window.Mvu.getMvuData === 'function') {
          let targetMessageId = 'latest';

          if (typeof window.getLastMessageId === 'function' && typeof window.getChatMessages === 'function') {
            let currentId = window.getLastMessageId();
            while (currentId >= 0) {
              const message = window.getChatMessages(currentId).at(-1);
              if (message && message.role !== 'user') {
                targetMessageId = currentId;
                break;
              }
              currentId--;
            }
          }

          const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: targetMessageId });
          if (mvuData && mvuData.stat_data && mvuData.stat_data['...']) {
            const familyInfo = mvuData.stat_data['...'];
            if (familyInfo....Время && Array.isArray(familyInfo....Время)) {
              const timeValue = familyInfo....Время[0];
              if (timeValue) return timeValue;
            }
          }
        }

        // ： SillyTavern context
        if (window.SillyTavern) {
          const context = window.SillyTavern.getContext ? window.SillyTavern.getContext() : window.SillyTavern;
          if (context && context.chatMetadata && context.chatMetadata.variables) {
            const familyInfo = context.chatMetadata.variables['...'];
            if (familyInfo && familyInfo....Время && Array.isArray(familyInfo....Время)) {
              const timeValue = familyInfo....Время[0];
              if (timeValue) return timeValue;
            }
          }
        }
      } catch (error) {
        console.warn('[Задания] errorВремяerror:', error);
      }
      return '...Время';
    }

    switchView(view) {
      console.log('[Задания] ...:', view);
      this.currentView = view;
      this.updateAppContent();
      this.updateHeader();
    }

    // Список заданий
    showTaskList() {
      this.switchView('taskList');
    }

    // В процессеЗадание
    showInProgress() {
      this.switchView('inProgress');
    }

    // ВыполненоЗадание
    showCompleted() {
      this.switchView('completed');
    }

    // ЗаданиеСообщения
    sendViewTasksMessage() {
      try {
        console.log('[Задания] ...ЗаданиеСообщения');

        const message = '<Request:Meta-instructions：...，...，...3...Задание,...,...Задание，...Задание...>...Задание';

        // Сообщенияapp
        this.sendToSillyTavern(message);
      } catch (error) {
        console.error('[Задания] errorЗаданиеСообщенияerror:', error);
      }
    }

    // СообщенияSillyTavern
    async sendToSillyTavern(message) {
      try {
        console.log('[Задания] ...Сообщения...SillyTavern:', message);

        // /* Поле ввода */
        const textarea = document.querySelector('#send_textarea');
        if (!textarea) {
          console.error('[Задания] errorСообщения/* Поле ввода */');
          return this.sendToSillyTavernBackup(message);
        }

        // НастройкиСообщения
        textarea.value = message;
        textarea.focus();

        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        const sendButton = document.querySelector('#send_but');
        if (sendButton) {
          sendButton.click();
          console.log('[Задания] ...');
          return true;
        }

        return this.sendToSillyTavernBackup(message);
      } catch (error) {
        console.error('[Задания] errorСообщенияerror:', error);
        return this.sendToSillyTavernBackup(message);
      }
    }

    async sendToSillyTavernBackup(message) {
      try {
        console.log('[Задания] ...:', message);

        const textareas = document.querySelectorAll('textarea');
        if (textareas.length > 0) {
          const textarea = textareas[0];
          textarea.value = message;
          textarea.focus();

          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          return true;
        }

        return false;
      } catch (error) {
        console.error('[Задания] error:', error);
        return false;
      }
    }

    // ОбновитьСписок заданий
    refreshTaskList() {
      console.log('[Задания] ...ОбновитьСписок заданий');

      // Задание
      this.parseTasksFromContext();

      this.updateAppContent();

      // Обновить
      setTimeout(() => {
        this.showToast('ЗаданиеСтатус...', 'success');
      }, 500);
    }

    // /* Приложение */，
    destroy() {
      console.log('[Задания] .../* Приложение */，...');

      if (this.eventListenersSetup && this.messageReceivedHandler) {
        const eventSource = window['eventSource'];
        if (eventSource && eventSource.removeListener) {
          eventSource.removeListener('MESSAGE_RECEIVED', this.messageReceivedHandler);
          console.log('[Задания] 🗑️ ... MESSAGE_RECEIVED ...');
        }
      }

      // Статус
      this.eventListenersSetup = false;
      this.isAutoRenderEnabled = false;

      this.tasks = [];
      this.acceptedTasks = [];
      this.completedTasks = [];
    }

    // header
    updateHeader() {
      // Уведомлениеmobile-phoneheader
      if (window.mobilePhone && window.mobilePhone.updateAppHeader) {
        const state = {
          app: 'task',
          title: this.getViewTitle(),
          view: this.currentView,
        };
        window.mobilePhone.updateAppHeader(state);
      }
    }

    getViewTitle() {
      switch (this.currentView) {
        case 'taskList':
          return 'Задание...';
        case 'inProgress':
          return 'В процессе';
        case 'completed':
          return 'Выполнено';
        default:
          return 'Задание...';
      }
    }

    // Сообщения
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `task-toast ${type}`;
      toast.textContent = message;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('show');
      }, 100);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 3000);
    }
  }

  window.RuApp_tasks = TaskApp;
  window.taskApp = new TaskApp();
} // ...

window.getTaskAppContent = function () {
  console.log('[Задания] ...Задание/* Приложение */...');

  if (!window.taskApp) {
    console.error('[Задания] taskApperror');
    return '<div class="error-message">Задание/* Приложение */...</div>';
  }

  try {
    return window.taskApp.getAppContent();
  } catch (error) {
    console.error('[Задания] error/* Приложение */error:', error);
    return '<div class="error-message">Задание/* Приложение */...</div>';
  }
};

window.bindTaskAppEvents = function () {
  console.log('[Задания] ...Задание/* Приложение */...');

  if (!window.taskApp) {
    console.error('[Задания] taskApperror');
    return;
  }

  try {
    // ，DOM
    setTimeout(() => {
      window.taskApp.bindEvents();
    }, 100);
  } catch (error) {
    console.error('[Задания] error:', error);
  }
};

window.taskAppShowInProgress = function () {
  if (window.taskApp) {
    window.taskApp.showInProgress();
  }
};

window.taskAppShowCompleted = function () {
  if (window.taskApp) {
    window.taskApp.showCompleted();
  }
};

window.taskAppRefresh = function () {
  if (window.taskApp) {
    window.taskApp.refreshTaskList();
  }
};

window.taskAppSendViewMessage = function () {
  if (window.taskApp) {
    window.taskApp.sendViewTasksMessage();
  }
};

window.taskAppDebugInfo = function () {
  if (window.taskApp) {
    console.log('[Task App Debug] ...Задание...:', window.taskApp.tasks.length);
    console.log('[Task App Debug] Список заданий:', window.taskApp.tasks);
    console.log('[Task App Debug] ...Принять задание:', window.taskApp.acceptedTasks);
    console.log('[Task App Debug] ВыполненоЗадание:', window.taskApp.completedTasks);
    console.log('[Task App Debug] ...:', window.taskApp.currentView);
    console.log('[Task App Debug] ...Настройки:', window.taskApp.eventListenersSetup);
    console.log('[Task App Debug] ...:', window.taskApp.isAutoRenderEnabled);
  }
};

window.taskAppDestroy = function () {
  if (window.taskApp) {
    window.taskApp.destroy();
    console.log('[Задания] /* Приложение */...');
  }
};

window.taskAppForceReload = function () {
  console.log('[Задания] 🔄 .../* Приложение */...');

  if (window.taskApp) {
    window.taskApp.destroy();
  }

  window.taskApp = new TaskApp();
  console.log('[Задания] ✅ /* Приложение */... - ... 3.0');
};

window.taskAppForceRefresh = function () {
  console.log('[Задания] 🔄 ...ОбновитьЗаданиеСтатус...');

  if (window.taskApp) {
    window.taskApp.parseTasksFromContext();
    window.taskApp.updateAppContent();
    window.taskApp.showToast('...Обновить...', 'success');
  } else {
    console.error('[Задания] taskApperror');
  }
};

window.taskAppTestTabs = function () {
  console.log('[Задания] 🧪 ......');

  const tabs = document.querySelectorAll('.task-tab');
  console.log('[Задания] ...:', tabs.length);

  tabs.forEach((tab, index) => {
    console.log(`[Задания] ... ${index + 1}:`, {
      text: tab.textContent.trim(),
      view: tab.dataset.view,
      active: tab.classList.contains('active'),
    });
  });

  if (tabs.length > 0) {
    console.log('[Задания] ......');
    const secondTab = tabs[1];
    if (secondTab) {
      secondTab.click();
      console.log('[Задания] ...');
    }
  }
};

console.log('[Задания] Задание/* Приложение */... - ... 3.0 (... + ... + ...)');
