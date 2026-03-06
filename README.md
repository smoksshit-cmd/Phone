# 📱 RU Mobile Phone — SillyTavern плагин

Симулятор смартфона с русскими сервисами для SillyTavern.

---

## 🗂️ Структура файлов

```
ru-mobile/
├── manifest.json               ← Конфиг плагина SillyTavern
├── index.js                    ← Точка входа, загружает все модули
├── mobile-phone.js             ← Ядро UI телефона
├── mobile-phone.css            ← Все стили
├── drag-helper.js              ← Перетаскивание телефона
└── app/
    ├── telegram/
    │   └── telegram-app.js     ← Telegram мессенджер
    ├── vk/
    │   └── vk-app.js           ← ВКонтакте
    ├── tiktok/
    │   └── tiktok-app.js       ← TikTok (свайп видео)
    ├── avito/
    │   └── avito-app.js        ← Авито (объявления)
    ├── twitch/
    │   └── twitch-app.js       ← Twitch (стримы + чат)
    ├── reddit/
    │   └── reddit-app.js       ← Reddit (треды)
    ├── dvach/
    │   └── dvach-app.js        ← 2ch.hk (доски и треды)
    ├── backpack/
    │   └── backpack-app.js     ← Рюкзак / инвентарь
    ├── diary/
    │   └── diary-app.js        ← Личный дневник
    └── settings-app.js         ← Настройки
```

---

## 🚀 Установка

### Способ 1 — Как расширение SillyTavern (рекомендуется)

1. Скопируй папку `ru-mobile` в:
   ```
   SillyTavern/public/scripts/extensions/third-party/ru-mobile/
   ```
2. Перезагрузи SillyTavern
3. Кнопка 📱 появится справа внизу

### Способ 2 — Через консоль браузера (быстрый тест)

```javascript
// Сначала добавь CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/scripts/extensions/third-party/ru-mobile/mobile-phone.css';
document.head.appendChild(link);

// Потом загрузи скрипты по очереди
const scripts = [
  '/scripts/extensions/third-party/ru-mobile/drag-helper.js',
  '/scripts/extensions/third-party/ru-mobile/app/telegram/telegram-app.js',
  '/scripts/extensions/third-party/ru-mobile/app/vk/vk-app.js',
  '/scripts/extensions/third-party/ru-mobile/app/tiktok/tiktok-app.js',
  '/scripts/extensions/third-party/ru-mobile/app/avito/avito-app.js',
  '/scripts/extensions/third-party/ru-mobile/app/twitch/twitch-app.js',
  '/scripts/extensions/third-party/ru-mobile/app/reddit/reddit-app.js',
  '/scripts/extensions/third-party/ru-mobile/app/dvach/dvach-app.js',
  '/scripts/extensions/third-party/ru-mobile/app/backpack/backpack-app.js',
  '/scripts/extensions/third-party/ru-mobile/app/diary/diary-app.js',
  '/scripts/extensions/third-party/ru-mobile/app/settings-app.js',
  '/scripts/extensions/third-party/ru-mobile/mobile-phone.js',
];

for (const src of scripts) {
  const s = document.createElement('script');
  s.src = src; document.head.appendChild(s);
  await new Promise(r => s.onload = r);
}
```

---

## 📱 Приложения

| Иконка | Приложение | Функции |
|--------|-----------|---------|
| ✈️ | **Telegram** | Чаты, группы, каналы, отправка сообщений в ST |
| 💙 | **ВКонтакте** | Лента, лайки/репосты, друзья, группы |
| 🎵 | **TikTok** | Видео-лента, свайп вверх/вниз |
| 🏷️ | **Авито** | Объявления по категориям, детальный просмотр |
| 🎮 | **Twitch** | Стримы + живой чат |
| 👽 | **Reddit** | Сабреддиты, треды, комментарии |
| 💬 | **2ch** | Доски, треды, ответы в тред |
| 🎒 | **Рюкзак** | Инвентарь с категориями, использование предметов |
| 📖 | **Дневник** | Записи с настроением и тегами |
| ⚙️ | **Настройки** | Язык RU/EN, очистка данных |

---

## 🤖 Форматы данных для ИИ

Вставь в **карточку персонажа** или **системный промпт**:

```
Используй эти форматы чтобы обновлять данные на телефоне персонажа:

Telegram сообщение:
[Telegram|Имя контакта|Текст сообщения]

Пост ВКонтакте:
[ВКонтакте|Автор|Текст поста]

Предмет в рюкзак:
[Рюкзак|Название|Тип|Описание|Количество]

Использование предмета:
[Использовать|Название|Количество]

Объявление на Авито:
[Авито|Название|Цена|Описание|Город]

Запись в дневник:
[Дневник|Текст записи]

Стрим на Twitch:
[Twitch|Название стрима|Ник стримера|Категория|Зрители]

Пост на Reddit:
[Reddit|Сабреддит|Заголовок|Тег1,Тег2]
```

---

## 🎮 Управление

| Действие | Описание |
|----------|---------|
| Клик на кнопку 📱 | Открыть телефон |
| `Esc` | Закрыть приложение / телефон |
| Перетащить за статус-бар | Переместить телефон |
| Свайп в TikTok | Следующее/предыдущее видео |

---

## 🛠️ API для разработчиков

```javascript
// Телефон
window.RuMobilePhone.open()
window.RuMobilePhone.close()
window.RuMobilePhone.openApp('telegram')
window.RuMobilePhone.closeApp()

// Уведомления
window.RuMobilePhone.showToast('Текст')
window.RuMobilePhone.setBadge('telegram', 3)

// Язык
window.RuMobilePhone.setLang('ru') // или 'en'

// Парсинг данных вручную
window.RuMobilePhone.parseAIMessage('[Telegram|Алиса|Привет!]')

// Прямой доступ к данным
window.RuMobileData.telegramChats
window.RuMobileData.vkPosts
window.RuMobileData.backpackItems
window.RuMobileData.diaryEntries
window.RuMobileData.avitoListings
window.RuMobileData.twitchStreams
window.RuMobileData.redditPosts
```

---

## 🐛 Отладка

```javascript
// Включить детальные логи
window.DEBUG_RU_MOBILE = true;

// Проверить состояние
console.log(window.RuMobileData);
console.log(window.RuMobileLang);
```

---

*RU Mobile Phone v1.0.0 — русская версия плагина телефона для SillyTavern*
