(() => {
  'use strict';

  const MODULE_KEY = 'janitor_script_importer';

  const defaultSettings = Object.freeze({
    enabled: true,
    namePrefix: 'Janitor - ',

    // 1) сначала пытаемся напрямую (самый приватный вариант)
    tryDirectFetch: true,

    // 2) если CORS мешает — используем браузерный прокси (НЕ требует config.yaml)
    useJinaProxyFallback: true,

    // 3) если включено — можно попытаться /api/assets/download (но у многих будет 403 без whitelist)
    useServerDownloadFallback: false,

    // какой прокси использовать (можно расширять списком)
    jinaBase: 'https://r.jina.ai/',
  });

  function ctx() { return SillyTavern.getContext(); }

  function getSettings() {
    const { extensionSettings } = ctx();
    if (!extensionSettings[MODULE_KEY]) extensionSettings[MODULE_KEY] = structuredClone(defaultSettings);
    for (const k of Object.keys(defaultSettings)) {
      if (!Object.hasOwn(extensionSettings[MODULE_KEY], k)) extensionSettings[MODULE_KEY][k] = defaultSettings[k];
    }
    return extensionSettings[MODULE_KEY];
  }

  // ---------- UI ----------

  async function mountSettingsUi() {
    const target = $('#extensions_settings2').length ? '#extensions_settings2' : '#extensions_settings';
    if (!$(target).length) return;
    if ($('#jsi_settings_block').length) return;

    const s = getSettings();

    $(target).append(`
      <div id="jsi_settings_block">
        <div class="jsi_title">📥 Janitor /scripts → World Info</div>

        <div class="jsi_row">
          <input type="text" id="jsi_url"
            placeholder="https://janitorai.com/scripts/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          <button class="menu_button" id="jsi_import_btn">Импорт</button>
        </div>

        <div class="jsi_row">
          <label class="jsi_ck">
            <input type="checkbox" id="jsi_enabled" ${s.enabled ? 'checked' : ''}>
            <span>Включено</span>
          </label>

          <label class="jsi_ck" style="margin-left:10px">
            <input type="checkbox" id="jsi_direct" ${s.tryDirectFetch ? 'checked' : ''}>
            <span>Сначала прямой fetch</span>
          </label>

          <label class="jsi_ck" style="margin-left:10px">
            <input type="checkbox" id="jsi_jina" ${s.useJinaProxyFallback ? 'checked' : ''}>
            <span>Fallback через r.jina.ai (без config)</span>
          </label>

          <label class="jsi_ck" style="margin-left:10px">
            <input type="checkbox" id="jsi_server" ${s.useServerDownloadFallback ? 'checked' : ''}>
            <span>Fallback через сервер ST (/api/assets/download)</span>
          </label>
        </div>

        <div class="jsi_warn">
          ⚠️ r.jina.ai — сторонний “reader”-прокси. Если включён, ссылка/контент будут проходить через него.
          Если это не ок — выключи галку и используй прямой fetch (если работает).
        </div>

        <div class="jsi_help">
          Поддерживает ссылки вида <code>janitorai.com/scripts/UUID</code>.<br>
          Импорт создаёт новый World Info и переносит entries (ключи/контент/приоритет).
        </div>

        <div class="jsi_status" id="jsi_status"></div>
      </div>
    `);

    $('#jsi_enabled').on('change', () => { getSettings().enabled = $('#jsi_enabled').prop('checked'); ctx().saveSettingsDebounced(); });
    $('#jsi_direct').on('change',  () => { getSettings().tryDirectFetch = $('#jsi_direct').prop('checked'); ctx().saveSettingsDebounced(); });
    $('#jsi_jina').on('change',    () => { getSettings().useJinaProxyFallback = $('#jsi_jina').prop('checked'); ctx().saveSettingsDebounced(); });
    $('#jsi_server').on('change',  () => { getSettings().useServerDownloadFallback = $('#jsi_server').prop('checked'); ctx().saveSettingsDebounced(); });

    $('#jsi_import_btn').on('click', async () => {
      const url = String($('#jsi_url').val() ?? '').trim();
      await importFromUrlFlow(url);
    });

    $('#jsi_url').on('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const url = String($('#jsi_url').val() ?? '').trim();
        await importFromUrlFlow(url);
      }
    });
  }

  function setStatus(t) { $('#jsi_status').text(t ? String(t) : ''); }

  // ---------- URL helpers ----------

  function isJanitorScriptsUrl(url) {
    return typeof url === 'string'
      && /https?:\/\/(www\.)?janitorai\.com\/scripts\/[a-f0-9\-]{36}/i.test(url);
  }

  function extractUuidFromUrl(url) {
    const m = String(url).match(/\/scripts\/([a-f0-9\-]{36})/i);
    return m ? m[1] : null;
  }

  function normalizeKeys(v) {
    if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
    const s = String(v ?? '').trim();
    if (!s) return [];
    return s.split(/[,;|\n]/g).map(x => x.trim()).filter(Boolean);
  }

  // ---------- Fetch methods ----------

  async function fetchTextDirect(url) {
    const r = await fetch(url, { method: 'GET' });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
    return await r.text();
  }

  async function fetchTextViaJina(url) {
    const s = getSettings();
    const base = String(s.jinaBase || 'https://r.jina.ai/').replace(/\/+$/, '/') ;
    // r.jina.ai принимает полный URL прямо после /
    // пример: https://r.jina.ai/https://janitorai.com/scripts/...
    const proxyUrl = base + url;
    const r = await fetch(proxyUrl, { method: 'GET' });
    if (!r.ok) throw new Error(`Jina HTTP ${r.status} ${r.statusText}`);
    return await r.text();
  }

  async function fetchTextViaServer(url) {
    const resp = await fetch('/api/assets/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, category: 'world', filename: `janitor_${Date.now()}.txt` }),
    });
    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      throw new Error(`Server fallback failed: ${resp.status} ${resp.statusText} ${t}`.trim());
    }
    return await resp.text();
  }

  async function fetchTextSmart(url) {
    const s = getSettings();
    const errors = [];

    if (s.tryDirectFetch) {
      try { return await fetchTextDirect(url); }
      catch (e) { errors.push(`direct: ${e?.message || e}`); }
    }

    if (s.useJinaProxyFallback) {
      try { return await fetchTextViaJina(url); }
      catch (e) { errors.push(`jina: ${e?.message || e}`); }
    }

    if (s.useServerDownloadFallback) {
      try { return await fetchTextViaServer(url); }
      catch (e) { errors.push(`server: ${e?.message || e}`); }
    }

    throw new Error(`Не удалось скачать. Причины: ${errors.join(' | ')}`);
  }

  async function fetchJsonSmart(url) {
    const text = await fetchTextSmart(url);
    try { return JSON.parse(text); } catch {}

    // если это HTML (страница), попробуем __NEXT_DATA__
    const next = extractNextData(text);
    if (next) return next;

    // последняя попытка — выдернуть JSON-объект
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);

    throw new Error('Не смог распарсить JSON/NextData');
  }

  function extractNextData(html) {
    const m = String(html).match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch { return null; }
  }

  function deepFindLikelyScript(obj) {
    const stack = [obj];
    const seen = new Set();
    while (stack.length) {
      const cur = stack.pop();
      if (!cur || typeof cur !== 'object') continue;
      if (seen.has(cur)) continue;
      seen.add(cur);

      const entries =
        cur.entries ||
        cur.lorebook?.entries ||
        cur.script?.entries ||
        cur.data?.entries;

      const title =
        cur.name || cur.title || cur.script?.name || cur.script?.title || cur.data?.name || cur.data?.title;

      if (title && Array.isArray(entries)) return cur;
      for (const v of Object.values(cur)) if (v && typeof v === 'object') stack.push(v);
    }
    return null;
  }

  async function fetchJanitorScript(uuid36, pageUrl) {
    // пробуем JSON endpoint’ы, потом страницу
    const candidates = [
      `https://janitorai.com/api/scripts/${uuid36}`,
      `https://janitorai.com/api/script/${uuid36}`,
      pageUrl,
    ];

    // 1) api
    for (const u of candidates.slice(0, 2)) {
      try {
        const j = await fetchJsonSmart(u);
        if (j && typeof j === 'object') return j;
      } catch {}
    }

    // 2) страница
    const pageObj = await fetchJsonSmart(pageUrl);
    if (pageObj && typeof pageObj === 'object') return pageObj;

    throw new Error('Не смог получить данные ни через API, ни через страницу');
  }

  // ---------- Convert Janitor → ST World Info ----------

  function normalizeJanitor(raw, uuid36) {
    const root = deepFindLikelyScript(raw) || raw;

    const title =
      root.name || root.title ||
      root.script?.name || root.script?.title ||
      root.data?.name || root.data?.title ||
      `Script ${uuid36.slice(0, 8)}`;

    const sourceEntries =
      (Array.isArray(root.entries) && root.entries) ||
      (Array.isArray(root.script?.entries) && root.script.entries) ||
      (Array.isArray(root.lorebook?.entries) && root.lorebook.entries) ||
      (Array.isArray(root.data?.entries) && root.data.entries) ||
      [];

    const entries = [];
    for (const e of sourceEntries) {
      if (!e || typeof e !== 'object') continue;

      const keys = normalizeKeys(e.keywords ?? e.keys ?? e.triggers ?? e.trigger ?? e.triggerWords ?? []);
      const content = String(e.content ?? e.text ?? e.body ?? e.description ?? '').trim();
      const comment = String(e.name ?? e.title ?? e.comment ?? '').trim();

      if (!content && !keys.length) continue;

      entries.push({
        key: keys.length ? keys : ['*'],
        comment,
        content,
        order: Number.isFinite(+e.order) ? +e.order : (Number.isFinite(+e.priority) ? +e.priority : 100),
        constant: !!e.constant,
        disable: !!e.disable,
      });
    }

    return { title, entries };
  }

  // ---------- Save to World Info (через internal world-info.js) ----------

  async function worldInfoApi() {
    return await import('../../world-info.js');
  }

  function sanitizeName(name) {
    return String(name)
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80) || `Janitor - ${Date.now()}`;
  }

  async function createAndFillWorldInfo(title, entries) {
    const s = getSettings();
    const wi = await worldInfoApi();

    const baseName = sanitizeName(`${s.namePrefix || ''}${title}`);

    const existing = new Set((wi.world_names || []).map(x => String(x).toLowerCase()));
    let finalName = baseName;
    if (existing.has(baseName.toLowerCase())) {
      for (let i = 2; i < 999; i++) {
        const cand = `${baseName} (${i})`;
        if (!existing.has(cand.toLowerCase())) { finalName = cand; break; }
      }
    }

    await wi.createNewWorldInfo(finalName, { interactive: false });
    const book = await wi.loadWorldInfo(finalName);

    for (const e of entries) {
      const dst = wi.createWorldInfoEntry(null, book);
      dst.key = e.key;
      dst.comment = e.comment || '';
      dst.content = e.content || '';
      dst.order = Number.isFinite(+e.order) ? +e.order : 100;
      dst.constant = !!e.constant;
      dst.disable = !!e.disable;
    }

    await wi.saveWorldInfo(finalName, book, true);
    return finalName;
  }

  // ---------- Main flow ----------

  async function importFromUrlFlow(url) {
    const s = getSettings();
    if (!s.enabled) { toastr.warning('[JSI] Отключено'); return; }

    if (!isJanitorScriptsUrl(url)) {
      toastr.error('[JSI] Нужна ссылка вида https://janitorai.com/scripts/<UUID>');
      return;
    }

    const id = extractUuidFromUrl(url);
    if (!id) { toastr.error('[JSI] Не смог вытащить UUID'); return; }

    try {
      setStatus('Скачиваю…');
      const raw = await fetchJanitorScript(id, url);

      setStatus('Конвертирую…');
      const norm = normalizeJanitor(raw, id);
      if (!norm.entries.length) throw new Error('Entries не найдены (формат изменился или пусто)');

      setStatus('Сохраняю в World Info…');
      const name = await createAndFillWorldInfo(norm.title, norm.entries);

      setStatus(`Готово: ${name} (${norm.entries.length})`);
      toastr.success(`✅ Импортировано: ${name} (${norm.entries.length})`);
    } catch (e) {
      console.error('[JSI] import failed', e);
      setStatus('Ошибка');
      toastr.error(`[JSI] ${e?.message || e}`);
    }
  }

  // ---------- Init ----------
  jQuery(async () => {
    try {
      getSettings();
      await mountSettingsUi();
      console.log('[JSI] Loaded');
    } catch (e) {
      console.error('[JSI] init failed', e);
    }
  });

})();
