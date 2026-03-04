(() => {
  'use strict';

  const MODULE_KEY = 'janitor_importer';

  const defaultSettings = Object.freeze({
    enabled: true,
    showWidget: true,
    namePrefix: 'Janitor - ',
  });

  function ctx() { return SillyTavern.getContext(); }

  function getSettings() {
    const { extensionSettings } = ctx();
    if (!extensionSettings[MODULE_KEY])
      extensionSettings[MODULE_KEY] = structuredClone(defaultSettings);
    for (const k of Object.keys(defaultSettings)) {
      if (!Object.hasOwn(extensionSettings[MODULE_KEY], k))
        extensionSettings[MODULE_KEY][k] = defaultSettings[k];
    }
    return extensionSettings[MODULE_KEY];
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replaceAll('&','&amp;').replaceAll('<','&lt;')
      .replaceAll('>','&gt;').replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  // ── Стили ──────────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('ji_styles')) return;
    const s = document.createElement('style');
    s.id = 'ji_styles';
    s.textContent = `
      #ji_fab {
        position:fixed; z-index:9998; display:flex;
        flex-direction:column; width:150px;
        border-radius:10px; overflow:hidden;
        box-shadow:0 4px 20px rgba(0,0,0,.5);
        border:1px solid rgba(255,255,255,.1);
        right:14px; bottom:120px;
      }
      #ji_fab_btn {
        background:linear-gradient(135deg,#2a2a3e,#1a1a2e);
        border:none; color:#e0e0ff; padding:10px 12px;
        cursor:pointer; text-align:left; font-family:inherit;
        line-height:1.3; user-select:none;
      }
      #ji_fab_btn:hover { background:linear-gradient(135deg,#3a3a5e,#2a2a4e); }
      #ji_fab_btn .ji_big   { font-size:13px; font-weight:bold; }
      #ji_fab_btn .ji_small { font-size:10px; opacity:.6; margin-top:2px; }
      #ji_fab_hide {
        background:rgba(0,0,0,.4); border:none;
        border-top:1px solid rgba(255,255,255,.08);
        color:#888; font-size:11px; padding:4px;
        cursor:pointer; font-family:inherit;
      }
      #ji_fab_hide:hover { color:#fff; background:rgba(255,50,50,.3); }

      #ji_overlay {
        display:none; position:fixed; inset:0;
        background:rgba(0,0,0,.55); z-index:9999;
        backdrop-filter:blur(2px);
      }

      #ji_drawer {
        position:fixed; top:0; right:0;
        width:420px; max-width:100vw; height:100vh;
        background:#1a1a2e;
        border-left:1px solid rgba(255,255,255,.12);
        z-index:10000; transform:translateX(100%);
        transition:transform .25s ease;
        display:flex; flex-direction:column;
        box-shadow:-4px 0 30px rgba(0,0,0,.6);
        overflow:hidden;
      }
      #ji_drawer.ji-open { transform:translateX(0); }

      #ji_drawer header {
        padding:16px 18px 12px;
        border-bottom:1px solid rgba(255,255,255,.08);
        background:rgba(0,0,0,.2); flex-shrink:0;
      }
      .ji_topline { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
      .ji_title   { font-size:16px; font-weight:bold; color:#e0e0ff; }
      #ji_close {
        background:none; border:none; color:#888;
        font-size:18px; cursor:pointer; padding:0 4px;
        line-height:1; font-family:inherit;
      }
      #ji_close:hover { color:#fff; }
      .ji_subtitle { font-size:11px; color:#888; line-height:1.6; }

      #ji_drawer .ji_content {
        padding:16px 18px; display:flex;
        flex-direction:column; gap:10px;
        overflow-y:auto; flex:1;
      }
      .ji_label { font-size:12px; color:#999; margin-bottom:3px; }

      #ji_name_input, #ji_json_area {
        width:100%; box-sizing:border-box;
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.15);
        border-radius:6px; color:#e0e0ff;
        padding:8px 10px; font-size:12px;
        font-family:inherit; outline:none; resize:vertical;
      }
      #ji_name_input:focus, #ji_json_area:focus {
        border-color:rgba(120,120,255,.5);
        background:rgba(255,255,255,.09);
      }
      #ji_json_area { height:220px; font-family:monospace; font-size:11px; }

      .ji_row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

      #ji_status {
        font-size:12px; white-space:pre-line; line-height:1.6;
        min-height:20px; padding:8px 10px;
        background:rgba(0,0,0,.25); border-radius:6px; color:#ccc;
        border:1px solid rgba(255,255,255,.06);
      }

      .ji_hint {
        font-size:11px; color:#666; line-height:1.7;
        border-top:1px solid rgba(255,255,255,.06);
        padding-top:10px;
      }
      .ji_hint code {
        background:rgba(255,255,255,.07); padding:1px 5px;
        border-radius:3px; font-size:10px; color:#aaa;
      }
      .ji_step { display:flex; gap:8px; align-items:flex-start; margin-bottom:6px; }
      .ji_step_num {
        background:rgba(120,120,255,.25); color:#aaf;
        border-radius:50%; width:18px; height:18px; flex-shrink:0;
        display:flex; align-items:center; justify-content:center;
        font-size:10px; font-weight:bold; margin-top:1px;
      }
      .ji_step_txt { font-size:11px; color:#888; line-height:1.6; }

      #ji_settings_block {
        margin:10px 0; padding:12px;
        background:rgba(255,255,255,.03);
        border:1px solid rgba(255,255,255,.08);
        border-radius:8px;
      }
      .ji_s_title { font-weight:bold; font-size:14px; margin-bottom:8px; }
      .ji_ck { display:flex; align-items:center; gap:5px; font-size:12px; cursor:pointer; }
    `;
    document.head.appendChild(s);
  }

  // ── Settings UI ────────────────────────────────────────────────────────────
  async function mountSettingsUi() {
    const target = $('#extensions_settings2').length ? '#extensions_settings2' : '#extensions_settings';
    if (!$(target).length || $('#ji_settings_block').length) return;
    const s = getSettings();
    $(target).append(`
      <div id="ji_settings_block">
        <div class="ji_s_title">🧩 Janitor Importer</div>
        <div class="ji_row">
          <label class="ji_ck">
            <input type="checkbox" id="ji_enabled" ${s.enabled?'checked':''}>
            <span>Включено</span>
          </label>
          <label class="ji_ck" style="margin-left:8px">
            <input type="checkbox" id="ji_show_widget" ${s.showWidget?'checked':''}>
            <span>Показывать кнопку</span>
          </label>
        </div>
        <div style="margin-top:8px">
          <button class="menu_button" id="ji_open_btn">📂 Открыть панель</button>
        </div>
      </div>
    `);
    $('#ji_enabled').on('change', () => { getSettings().enabled = $('#ji_enabled').prop('checked'); ctx().saveSettingsDebounced(); renderFab(); });
    $('#ji_show_widget').on('change', () => { getSettings().showWidget = $('#ji_show_widget').prop('checked'); ctx().saveSettingsDebounced(); renderFab(); });
    $('#ji_open_btn').on('click', () => openDrawer(true));
  }

  // ── FAB ────────────────────────────────────────────────────────────────────
  function renderFab() {
    if (!document.getElementById('ji_fab')) {
      $('body').append(`
        <div id="ji_fab">
          <button type="button" id="ji_fab_btn">
            <div class="ji_big">🧩 Janitor</div>
            <div class="ji_small">Вставить лорбук</div>
          </button>
          <button type="button" id="ji_fab_hide">✕ скрыть</button>
        </div>
      `);
      $('#ji_fab_btn').on('click', () => openDrawer(true));
      $('#ji_fab_hide').on('click', () => {
        getSettings().showWidget = false;
        ctx().saveSettingsDebounced();
        renderFab();
        toastr.info('Кнопка скрыта. Включи в настройках расширения.');
      });
    }
    const s = getSettings();
    document.getElementById('ji_fab').style.display =
      s.enabled && s.showWidget ? 'flex' : 'none';
  }

  // ── Drawer ─────────────────────────────────────────────────────────────────
  function ensureDrawer() {
    if (document.getElementById('ji_drawer')) return;

    $('body').append(`<div id="ji_overlay"></div>`);
    $('body').append(`
      <aside id="ji_drawer" aria-hidden="true">
        <header>
          <div class="ji_topline">
            <div class="ji_title">🧩 Janitor → World Info</div>
            <button id="ji_close" type="button">✕</button>
          </div>
          <div class="ji_subtitle">Скопируй JSON с Janitor и вставь сюда — создастся World Info в ST.</div>
        </header>
        <div class="ji_content">
          <div>
            <div class="ji_label">Название World Info:</div>
            <input id="ji_name_input" type="text" placeholder="Оставь пустым — определится автоматически" />
          </div>
          <div>
            <div class="ji_label">JSON из Janitor (Ctrl+V):</div>
            <textarea id="ji_json_area" placeholder='[ { "key": [...], "content": "...", "comment": "...", ... } ]'></textarea>
          </div>
          <div class="ji_row">
            <button class="menu_button" id="ji_import_btn">⬇ Импортировать</button>
            <button class="menu_button" id="ji_clear_btn">✕ Очистить</button>
          </div>
          <div id="ji_status"></div>
          <div class="ji_hint">
            <div class="ji_step">
              <div class="ji_step_num">1</div>
              <div class="ji_step_txt">Открой страницу скрипта на Janitor</div>
            </div>
            <div class="ji_step">
              <div class="ji_step_num">2</div>
              <div class="ji_step_txt">Нажми кнопку <b>View script</b> → откроется окно <b>View Lorebook</b></div>
            </div>
            <div class="ji_step">
              <div class="ji_step_num">3</div>
              <div class="ji_step_txt">Кликни в область с кодом → <b>Ctrl+A</b> → <b>Ctrl+C</b></div>
            </div>
            <div class="ji_step">
              <div class="ji_step_num">4</div>
              <div class="ji_step_txt">Вернись сюда, вставь <b>Ctrl+V</b> в поле выше → <b>Импортировать</b></div>
            </div>
          </div>
        </div>
      </aside>
    `);

    $('#ji_overlay').on('click', () => openDrawer(false));
    $('#ji_close').on('click',   () => openDrawer(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('ji_drawer')?.classList.contains('ji-open'))
        openDrawer(false);
    });

    $('#ji_import_btn').on('click', doImport);
    $('#ji_clear_btn').on('click', () => {
      $('#ji_json_area').val('');
      $('#ji_name_input').val('');
      setStatus('');
    });

    // Авто-имя при вставке
    $('#ji_json_area').on('input paste', () => {
      setTimeout(() => {
        if ($('#ji_name_input').val().trim()) return;
        const name = guessName(String($('#ji_json_area').val()).trim());
        if (name) $('#ji_name_input').val(name);
      }, 120);
    });
  }

  function openDrawer(open) {
    ensureDrawer();
    const drawer  = document.getElementById('ji_drawer');
    const overlay = document.getElementById('ji_overlay');
    if (!drawer || !overlay) return;
    if (open) {
      overlay.style.display = 'block';
      drawer.classList.add('ji-open');
      drawer.setAttribute('aria-hidden','false');
      setStatus('');
      setTimeout(() => document.getElementById('ji_json_area')?.focus(), 50);
    } else {
      overlay.style.display = 'none';
      drawer.classList.remove('ji-open');
      drawer.setAttribute('aria-hidden','true');
    }
  }

  function setStatus(text, color) {
    const el = document.getElementById('ji_status');
    if (!el) return;
    el.textContent = text || '';
    el.style.color = color || '#ccc';
  }

  // ── Угадать название ───────────────────────────────────────────────────────
  function guessName(raw) {
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) {
        // Берём comment первого entry как базу для имени
        const first = p[0];
        if (first?.comment) return String(first.comment).split(/[\n\/]/)[0].trim().slice(0,60);
        return '';
      }
      return String(p.title || p.name || p.script_name || '').trim().slice(0,60);
    } catch { return ''; }
  }

  // ── Import ─────────────────────────────────────────────────────────────────
  async function doImport() {
    const s = getSettings();
    if (!s.enabled) { toastr.warning('Расширение отключено'); return; }

    const raw       = String($('#ji_json_area').val() || '').trim();
    const nameInput = String($('#ji_name_input').val() || '').trim();

    if (!raw) { setStatus('❌ Вставь JSON из Janitor', '#f88'); return; }

    setStatus('⏳ Парсинг…');

    let parsed;
    try { parsed = JSON.parse(raw); }
    catch (e) { setStatus(`❌ Неверный JSON:\n${e.message}`, '#f88'); return; }

    const entries = normalizeEntries(parsed);
    if (!entries.length) {
      setStatus('❌ Не найдено ни одного entry.\nПроверь что скопировал весь JSON.', '#f88');
      return;
    }

    const title = sanitizeName(`${s.namePrefix || ''}${nameInput || guessName(raw) || 'Lorebook'}`);
    setStatus(`⏳ Создаю World Info…\nEntries: ${entries.length}`);

    try {
      const worldName = await createWorldInfo(title, entries);
      setStatus(`✅ Готово!\nWorld Info: "${worldName}"\nEntries: ${entries.length}`, '#8f8');
      toastr.success(`Импортировано: ${worldName} (${entries.length} entries)`);
    } catch (e) {
      console.error('[JI]', e);
      setStatus(`❌ Ошибка:\n${e.message}`, '#f88');
      toastr.error(e.message);
    }
  }

  function normalizeEntries(parsed) {
    const raw = Array.isArray(parsed)               ? parsed
      : Array.isArray(parsed.entries)               ? parsed.entries
      : Array.isArray(parsed.script?.entries)       ? parsed.script.entries
      : [];

    return raw.map((e, i) => {
      const keys = normalizeKeys(e.key ?? e.keys ?? e.keywords ?? e.activation_keywords ?? e.triggers ?? []);
      const content = String(e.content ?? e.text ?? '').trim();
      const comment = String(e.comment ?? e.name ?? e.title ?? '').trim();
      return {
        key:      keys.length ? keys : ['*'],
        content,
        comment,
        order:    Number.isFinite(+e.insertion_order) ? +e.insertion_order
                : Number.isFinite(+e.order) ? +e.order : (i + 1) * 10,
        constant: !!e.constant,
        disable:  !(e.enabled !== false) || !!e.disable,
      };
    }).filter(e => e.content || e.key[0] !== '*');
  }

  function normalizeKeys(v) {
    if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
    const s = String(v ?? '').trim();
    if (!s) return [];
    return s.split(/[,;|\n]/g).map(x => x.trim()).filter(Boolean);
  }

  // ── World Info ─────────────────────────────────────────────────────────────
  async function createWorldInfo(name, entries) {
    const wi = await import('../../world-info.js');
    const existing = new Set((wi.world_names || []).map(x => String(x).toLowerCase()));

    let finalName = name;
    if (existing.has(name.toLowerCase())) {
      for (let i = 2; i < 999; i++) {
        const c = `${name} (${i})`;
        if (!existing.has(c.toLowerCase())) { finalName = c; break; }
      }
    }

    await wi.createNewWorldInfo(finalName, { interactive: false });
    const book = await wi.loadWorldInfo(finalName);

    for (const e of entries) {
      const dst = wi.createWorldInfoEntry(null, book);
      dst.key      = e.key;
      dst.comment  = e.comment  || '';
      dst.content  = e.content  || '';
      dst.order    = e.order;
      dst.constant = e.constant;
      dst.disable  = e.disable;
    }

    await wi.saveWorldInfo(finalName, book, true);
    return finalName;
  }

  function sanitizeName(name) {
    return String(name).replace(/[\\/:*?"<>|]/g,'').replace(/\s+/g,' ').trim().slice(0,80)
      || `Janitor - ${Date.now()}`;
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  jQuery(async () => {
    try {
      injectStyles();
      getSettings();
      await mountSettingsUi();
      ensureDrawer();
      renderFab();
      console.log('[JI] Loaded ✓');
    } catch (e) {
      console.error('[JI] init error', e);
    }
  });

})();
