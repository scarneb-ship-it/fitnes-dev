document.addEventListener('DOMContentLoaded', function() {

    /* ========== DATA ========== */
    const DAYS = {
        A: {
            title: 'День A · Силовая база',
            subtitle: 'Низ · тяга · грудь · кор · гантели + турник',
            exercises: [
                { num: '15',    name: 'Гоблет-присед (гантель у груди)',        sets: 3, mode: 'reps', repsLabel: '8–12',              rest: 90, restLabel: '90 сек', note: 'Колени мягко в стороны, спина ровная' },
                { num: '30',    name: 'Румынская тяга с гантелями',             sets: 3, mode: 'reps', repsLabel: '10–12',             rest: 90, restLabel: '90 сек', note: 'Таз назад, чувствуем заднюю поверхность бедра' },
                { num: '14',    name: 'Отжимания от стены / дивана',            sets: 3, mode: 'reps', repsLabel: '6–10',              rest: 75, restLabel: '75 сек', note: 'Если легко — ниже опору. Потом колени, потом пол' },
                { num: '179',   name: 'Тяга гантели в наклоне (л / п)',         sets: 3, mode: 'reps', repsLabel: '10–12 на руку',     sides: true, rest: 75, restLabel: '75 сек', note: 'Локоть к поясу, лопатка сводится' },
                { num: '39',    name: 'Ягодичный мост с блином',                sets: 3, mode: 'reps', repsLabel: '12–15',             rest: 60, restLabel: '60 сек', note: 'Вверху сжать ягодицы на 1–2 сек' },
                { num: '238',   name: 'Вис на турнике + лопаточные',            sets: 3, mode: 'time', duration: 30, durationLabel: '15–30 сек + 6–8 лопат.', rest: 60, restLabel: '60 сек', note: 'Без сгибания рук, только лопатки' },
                { num: '4',     name: 'Планка',                                  sets: 3, mode: 'time', duration: 30, durationLabel: '20–40 сек',     rest: 45, restLabel: '45 сек', note: 'Можно с колен. Таз не заваливать' }
            ]
        },
        B: {
            title: 'День B · Попа + спина + кор',
            subtitle: 'Ягодицы · задняя цепь · осанка · кор',
            exercises: [
                { num: '58 / 66', name: 'Болгарский сплит-присед (л / п)',        sets: 3, mode: 'reps', repsLabel: '8–10 на ногу',     sides: true, rest: 90, restLabel: '90 сек', note: 'Если тяжело — просто выпады на месте' },
                { num: '75 / 74', name: 'Ягодичный мост одной ногой (л / п)',     sets: 3, mode: 'reps', repsLabel: '10–12 на ногу',     sides: true, rest: 75, restLabel: '75 сек', note: 'Таз не заваливать, сжатие вверху' },
                { num: '178',     name: 'Жим гантелей стоя / сидя',               sets: 3, mode: 'reps', repsLabel: '8–12',              rest: 75, restLabel: '75 сек', note: 'Лёгкий вес. Держим кор' },
                { num: '182',     name: 'Разведения в наклоне (reverse fly)',     sets: 3, mode: 'reps', repsLabel: '12–15',             rest: 60, restLabel: '60 сек', note: 'Ключевое для осанки и большой груди' },
                { num: '241',     name: 'Негативы подтягиваний',                  sets: 3, mode: 'reps', repsLabel: '3–5',               rest: 90, restLabel: '90 сек', note: 'Опускаемся медленно 3–5 сек, нога на стуле' },
                { num: '90 / 91', name: 'Разведение коленей лёжа (л / п)',        sets: 3, mode: 'reps', repsLabel: '15 на сторону',     sides: true, rest: 45, restLabel: '45 сек', note: 'Clamshell. Средняя ягодичная' },
                { num: '95 / 96', name: 'Dead bug / птица-собака (л / п)',        sets: 3, mode: 'reps', repsLabel: '8–10 на сторону',   sides: true, rest: 45, restLabel: '45 сек', note: 'Медленно, без прогиба в пояснице' }
            ]
        }
    };

    // Картинки (если файла нет — карточка просто покажет номер)
    const exerciseImages = {
        'Гоблет-присед (гантель у груди)':        'icons/prisedansgantel.jpg',
        'Румынская тяга с гантелями':             'icons/rumynskatyaga.jpg',
        'Отжимания от стены / дивана':            'icons/otchimania.jpg',
        'Тяга гантели в наклоне (л / п)':         'icons/greblavnaklon.jpg',
        'Ягодичный мост с блином':                'icons/godicnmostik.jpg',
        'Вис на турнике + лопаточные':            'icons/podtiagivaniechirokim.jpg',
        'Планка':                                  'icons/planka.jpg',
        'Болгарский сплит-присед (л / п)':        'icons/bolgarskisplitpris.jpg',
        'Ягодичный мост одной ногой (л / п)':     'icons/mostiknaodnounage.jpg',
        'Жим гантелей стоя / сидя':               'icons/chimgantelnadgolov.jpg',
        'Разведения в наклоне (reverse fly)':     'icons/podemgantelvstoronu.jpg',
        'Негативы подтягиваний':                  'icons/podtiagivaniaobratnimhvat.jpg',
        'Разведение коленей лёжа (л / п)':        'icons/clamshell.jpg',
        'Dead bug / птица-собака (л / п)':        'icons/csuknaspine.jpg'
    };

    /* ========== STORAGE ========== */
    const LOG_KEY = 'ironplan_log_v2';
    const AI_KEY_STORAGE = 'openrouter_api_key';
    const AI_HISTORY_STORAGE = 'ai_chat_history';
    const FREE_MODELS = ['nex-agi/nex-n2.5-pro:free'];

    function getApiKey() { return (localStorage.getItem(AI_KEY_STORAGE) || '').trim(); }
    function setApiKey(key) {
        const clean = (key || '').trim();
        if (clean) localStorage.setItem(AI_KEY_STORAGE, clean);
        else localStorage.removeItem(AI_KEY_STORAGE);
    }

    function getLog() { try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch(e) { return []; } }
    function saveLogEntry(dayKey, quality, weight) {
        const log = getLog();
        log.unshift({ day: dayKey, date: new Date().toISOString(), quality: !!quality, weight: weight || null });
        localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, 200)));
    }
    function dayLabel(k) { if (k==='A') return 'База'; if (k==='B') return 'Попа + спина'; return k; }
    function fmtDate(iso) { const d = new Date(iso); return d.toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}); }

    function getAiHistory() { try { return JSON.parse(localStorage.getItem(AI_HISTORY_STORAGE)) || []; } catch(e) { return []; } }
    function saveAiHistory(history) { localStorage.setItem(AI_HISTORY_STORAGE, JSON.stringify(history)); }

    function buildProgramDescription() {
        const parts = [];
        parts.push('== ПРОГРАММА ТРЕНИРОВОК (2 дня в неделю) ==');
        Object.keys(DAYS).forEach(dayKey => {
            const day = DAYS[dayKey];
            parts.push(`День ${dayKey}: ${day.title}`);
            parts.push(day.subtitle);
            day.exercises.forEach(ex => {
                const params = ex.mode==='time' ? `${ex.durationLabel || ex.duration+' сек'}` : ex.repsLabel;
                const sides = ex.sides ? ' (на каждую сторону)' : '';
                parts.push(`- ${ex.name}${sides}: ${ex.sets} подход(а) × ${params}, отдых ${ex.restLabel}${ex.note ? ' | ' + ex.note : ''}`);
            });
            parts.push('');
        });
        return parts.join('\n');
    }

    function buildWorkoutHistoryDescription() {
        const log = getLog();
        if (!log.length) return 'История тренировок пока пуста.';
        const lines = log.slice(0, 10).map(e => {
            const date = new Date(e.date);
            const dateStr = date.toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'2-digit' });
            const weight = e.weight ? `, вес гантелей: ${e.weight} кг` : '';
            return `${dateStr} — День ${e.day} (${dayLabel(e.day)}), качество: ${e.quality?'максимум':'не максимум'}${weight}`;
        });
        return 'Последние тренировки:\n' + lines.join('\n');
    }

    /* ========== DOM ========== */
    const $ = sel => document.querySelector(sel);
    const app = $('#appContainer');
    const dayTabs = $('#dayTabs');
    const mainContent = $('#mainContent');
    const player = $('#player');
    const playerCrumbs = $('#playerCrumbs');
    const playerName = $('#playerName');
    const playerMeta = $('#playerMeta');
    const playerNote = $('#playerNote');
    const ring = $('#ring');
    const ringOuter = $('#ringOuter');
    const ringTime = $('#ringTime');
    const ringPhase = $('#ringPhase');
    const mainActionBtn = $('#mainActionBtn');
    const skipBtn = $('#skipBtn');
    const qualityModal = $('#qualityModal');
    const logList = $('#logList');
    const playerImageContainer = $('#playerImageContainer');
    const playerImage = $('#playerImage');
    const restAdjust = $('#restAdjust');
    const restMinus = $('#restMinus');
    const restPlus = $('#restPlus');
    const themeSelect = $('#themeSelect');
    const voiceToggleCheckbox = $('#voiceToggle');
    const openaiKeyInput = $('#openaiKey');
    const saveKeyBtn = $('#saveKeyBtn');
    const aiMessages = $('#aiMessages');
    const aiForm = $('#aiForm');
    const aiInput = $('#aiInput');
    const bottomNav = $('#bottomNav');
    const aiScreenEl = $('#screenAi');
    const screens = document.querySelectorAll('.screen');

    /* ========== PLATE HELPER (картинка с fallback на номер) ========== */
    function plateHTML(src, num) {
        if (!src) return `<span class="plate">${num}</span>`;
        // Если картинка не загрузится — заменяем на span с номером
        return `<img src="${src}" alt="" class="plate" loading="lazy"
            onerror="this.onerror=null;var s=document.createElement('span');s.className='plate';s.textContent='${num}';this.replaceWith(s);">`;
    }

    /* ========== SCREEN ROUTER ========== */
    let currentScreen = 'home';

    function showScreen(name, options = {}) {
        if (!name) name = 'home';
        currentScreen = name;

        screens.forEach(s => {
            const isMatch = s.dataset.screen === name;
            s.classList.toggle('is-active', isMatch);
            s.hidden = !isMatch;
        });

        if (bottomNav) {
            bottomNav.querySelectorAll('.bottom-nav__item').forEach(b => {
                b.classList.toggle('is-active', b.dataset.action === name);
            });
        }

        if (!options.keepScroll) {
            window.scrollTo({ top: 0, behavior: 'auto' });
            if (name === 'ai') {
                requestAnimationFrame(() => {
                    aiMessages.scrollTop = aiMessages.scrollHeight;
                    if (typeof window.__updateAiViewport === 'function') window.__updateAiViewport();
                });
            }
            if (name === 'log') renderLog();
        }

        if (name !== 'home') {
            try { history.pushState({ screen: name }, ''); } catch(_) {}
        }
    }

    if (bottomNav) {
        bottomNav.addEventListener('click', (e) => {
            const item = e.target.closest('.bottom-nav__item');
            if (!item) return;
            const action = item.dataset.action;
            if (navigator.vibrate) { try { navigator.vibrate(8); } catch(_){} }

            if (action === currentScreen) {
                if (action === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
                if (action === 'log') window.scrollTo({ top: 0, behavior: 'smooth' });
                if (action === 'ai') aiMessages.scrollTo({ top: aiMessages.scrollHeight, behavior: 'smooth' });
                if (action === 'settings') window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            showScreen(action);
        });
    }

    /* ========== THEME ========== */
    function applyTheme(mode) {
        if (mode === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else if (mode === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');

        const isLight = mode === 'light' ||
            (mode !== 'dark' && window.matchMedia('(prefers-color-scheme: light)').matches);

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', isLight ? '#FFFFFF' : '#0A0A0A');
    }

    /* ========== VOICE ========== */
    let voiceEnabled = localStorage.getItem('voiceEnabled') !== 'false';
    const synth = window.speechSynthesis;
    let selectedVoice = null;

    function pickVoice() {
        if (!synth) return;
        const voices = synth.getVoices();
        if (!voices || !voices.length) return;
        const priorities = [
            v => v.lang === 'ru-RU' && /google/i.test(v.name) && /female|женский/i.test(v.name),
            v => v.lang === 'ru-RU' && /google/i.test(v.name),
            v => v.lang === 'ru-RU' && /(milena|alena|alyona|katya|yuri|dmitri)/i.test(v.name),
            v => v.lang === 'ru-RU' && !v.localService,
            v => v.lang === 'ru-RU',
            v => v.lang && v.lang.toLowerCase().startsWith('ru'),
            v => v.default
        ];
        for (const test of priorities) {
            const found = voices.find(test);
            if (found) { selectedVoice = found; return; }
        }
    }
    if (synth) {
        pickVoice();
        synth.onvoiceschanged = pickVoice;
        setTimeout(pickVoice, 200);
        setTimeout(pickVoice, 1000);
    }

    function speak(text, priority = false) {
        if (!voiceEnabled || !synth || !text) return;
        if (synth.speaking && !priority) return;
        if (synth.speaking && priority) synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ru-RU';
        if (selectedVoice) utter.voice = selectedVoice;
        utter.rate = 0.98; utter.pitch = 1.05; utter.volume = 1.0;
        synth.speak(utter);
    }
    function announceCountdown(seconds) {
        if (!voiceEnabled || seconds > 5 || seconds < 1) return;
        speak(String(seconds), true);
    }

    if (voiceToggleCheckbox) voiceToggleCheckbox.checked = voiceEnabled;
    if (themeSelect) {
        themeSelect.value = localStorage.getItem('theme') || 'system';
        applyTheme(themeSelect.value);
    }
    if (openaiKeyInput) openaiKeyInput.value = getApiKey();

    /* ========== AI TRAINER ========== */
    let aiHistory = getAiHistory();
    let aiBusy = false;

    function renderAiHistory() {
        aiMessages.innerHTML = '';
        if (aiHistory.length === 0) {
            addMessageToDOM('assistant', 'Привет! Я твой фитнес-помощник. Спроси про технику, вес гантелей, отдых, питание или про то, как прогрессировать.');
        } else {
            aiHistory.forEach(msg => addMessageToDOM(msg.role, msg.content));
        }
    }

    function addMessageToDOM(role, content) {
        const div = document.createElement('div');
        div.classList.add('ai-message');
        div.classList.add(role === 'user' ? 'ai-message--user' : 'ai-message--bot');
        div.textContent = content;
        aiMessages.appendChild(div);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        return div;
    }

    function addMessage(role, content) {
        aiHistory.push({ role, content });
        saveAiHistory(aiHistory);
        addMessageToDOM(role, content);
    }

    function showTypingIndicator() {
        removeTypingIndicator();
        const div = document.createElement('div');
        div.id = 'typingIndicator';
        div.classList.add('ai-message', 'ai-message--bot', 'ai-message--typing');
        div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        aiMessages.appendChild(div);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    function removeTypingIndicator() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    async function sendToAI(userMessage) {
        if (aiBusy) return;
        const apiKey = getApiKey();
        if (!apiKey) {
            addMessage('assistant', 'API-ключ не указан. Откройте «Ещё → Настройки» и вставьте ключ с openrouter.ai/keys.');
            return;
        }
        addMessage('user', userMessage);
        aiBusy = true;
        showTypingIndicator();

        const systemPrompt = `Ты — персональный фитнес-тренер в приложении "Домашний фитнес".
Отвечай кратко, полезно и мотивирующе на русском языке.

КОНТЕКСТ КЛИЕНТА:
- Девушка, 25 лет, рост 165 см, вес 68 кг, % жира ~24%.
- Дома есть: турник, 2 гантели, 8 блинов по 3 кг.
- Никогда не занималась силовыми. Отжаться и подтянуться не может ни разу — используем негативы и отжимания от опоры.
- Жир скапливается в зоне от пупка до коленей, есть целлюлит.
- Цели: снизить % жира, округлить ягодицы, подтянуть кор, улучшить осанку (большая грудь, плечи слегка выпирают вперёд — нужен акцент на спину и заднюю дельту).
- Тренировки 2 раза в неделю, график смен плавающий (12 ч и 6 ч), поэтому тренировки должны быть компактными (45–60 мин, при 12-часовой смене 30–40 мин).
- Дефицит калорий 300–500 ккал, белок 110–135 г/день, шаги 7–10к.
- Точечно убрать жир с живота/бёдер/коленей нельзя — говори об этом корректно.

${buildProgramDescription()}

${buildWorkoutHistoryDescription()}

Учитывай эти данные при ответах: давай советы по технике, отдыху, прогрессии веса, питанию, осанке.
Если пользователь спрашивает о конкретном упражнении — уточняй его параметры из программы.
Если просят список упражнений — перечисляй их по дням, кратко и структурированно.`;

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': location.origin || 'https://localhost'
                },
                body: JSON.stringify({
                    model: FREE_MODELS[0],
                    messages: [{ role: 'system', content: systemPrompt }, ...aiHistory],
                    max_tokens: 2000,
                    temperature: 0.7
                })
            });
            let data = null;
            try { data = await response.json(); } catch (e) { data = null; }

            removeTypingIndicator();

            if (response.ok && data) {
                const choice = data.choices && data.choices[0];
                const message = choice && choice.message;
                let botReply = '';
                if (message) {
                    if (typeof message.content === 'string' && message.content.length) botReply = message.content;
                    else if (typeof message.reasoning === 'string' && message.reasoning.length) botReply = message.reasoning;
                }
                botReply = String(botReply || '').trim();
                if (!botReply) botReply = 'Модель вернула пустой ответ. Попробуйте переформулировать запрос.';
                addMessage('assistant', botReply);
            } else {
                const errorMsg = (data && (data.error?.message || data.error)) || `HTTP ${response.status}`;
                addMessage('assistant', `Ошибка API: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
            }
        } catch (error) {
            removeTypingIndicator();
            addMessage('assistant', `Ошибка сети: ${error.message}.`);
        } finally {
            aiBusy = false;
        }
    }

    if (aiForm) aiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = aiInput.value.trim();
        if (!text || aiBusy) return;
        aiInput.value = '';
        aiInput.style.height = '';
        sendToAI(text);
    });

    if (saveKeyBtn) {
        saveKeyBtn.addEventListener('click', () => {
            if (!openaiKeyInput) return;
            const val = openaiKeyInput.value.trim();
            setApiKey(val);
            if (navigator.vibrate) { try { navigator.vibrate(20); } catch(_){} }
            alert(val ? 'Ключ сохранён.' : 'Ключ удалён.');
        });
    }

    /* ========== KEYBOARD / VISUAL VIEWPORT ========== */
    function setupAiKeyboard() {
        const vv = window.visualViewport;
        if (!vv || !aiScreenEl) return;

        function update() {
            if (currentScreen !== 'ai') {
                aiScreenEl.classList.remove('is-keyboard-open');
                aiScreenEl.style.height = '';
                aiScreenEl.style.top = '';
                return;
            }
            const keyboardOpen = (window.innerHeight - vv.height) > 120;
            if (keyboardOpen) {
                aiScreenEl.classList.add('is-keyboard-open');
                aiScreenEl.style.height = vv.height + 'px';
                aiScreenEl.style.top = vv.offsetTop + 'px';
                aiMessages.scrollTop = aiMessages.scrollHeight;
            } else {
                aiScreenEl.classList.remove('is-keyboard-open');
                aiScreenEl.style.height = '';
                aiScreenEl.style.top = '';
            }
        }
        vv.addEventListener('resize', update);
        vv.addEventListener('scroll', update);
        window.__updateAiViewport = update;

        aiInput.addEventListener('focus', () => setTimeout(update, 120));
        aiInput.addEventListener('blur', () => setTimeout(update, 120));
    }
    setupAiKeyboard();

    /* ========== STATE ========== */
    let currentView = 'A';
    const sessionDone = { A: new Set(), B: new Set() };
    let steps = [], stepIdx = 0, sessionType = null, timeLeft = 0, totalTime = 0, ticking = false, intervalId = null;
    let currentPhase = 'idle';
    const dayOrder = ['A', 'B'];

    /* ========== AUDIO / HAPTICS ========== */
    let audioCtx = null;
    function beep(freq=880, dur=0.12) {
        try {
            audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
            const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
            osc.type='sine'; osc.frequency.value=freq;
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+dur);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime+dur);
        } catch(e) {}
    }
    function haptic(ms) { if (navigator.vibrate) { try { navigator.vibrate(ms); } catch(_){} } }

    /* ========== STEP GENERATION ========== */
    function enrichStep(step, ex) { if (ex && exerciseImages[ex.name]) step.image = exerciseImages[ex.name]; return step; }
    function makeWorkStep(ex, exIdx, totalEx, setNum, totalSets, side) {
        return {
            kind:'work', exNum:ex.num, exName:ex.name, exIdx, totalEx,
            setLabel:`Подход ${setNum} из ${totalSets}`+(side?` · ${side}`:''),
            duration: ex.mode==='time'?ex.duration:null,
            repsLabel: ex.mode==='time'?(ex.durationLabel||`${ex.duration} сек`):ex.repsLabel,
            note: ex.note || null
        };
    }
    function makeRestStep(ex, exIdx, totalEx, label, duration, restLabel) {
        return { kind:'rest', exNum:ex.num, exName:'Отдых', exIdx, totalEx, setLabel:label, duration, repsLabel:restLabel, note:null };
    }

    function buildDaySteps(dayKey, fromExerciseIdx=0) {
        const day = DAYS[dayKey]; const list = [];
        day.exercises.forEach((ex,exIdx)=>{
            if (exIdx < fromExerciseIdx) return;
            for (let s=1; s<=ex.sets; s++) {
                if (ex.sides) {
                    ['левая','правая'].forEach(side=>list.push(enrichStep(makeWorkStep(ex,exIdx,day.exercises.length,s,ex.sets,side),ex)));
                } else {
                    list.push(enrichStep(makeWorkStep(ex,exIdx,day.exercises.length,s,ex.sets,null),ex));
                }
                const lastSet = s===ex.sets, lastEx = exIdx===day.exercises.length-1;
                if (!lastSet) list.push(makeRestStep(ex,exIdx,day.exercises.length,`Подход ${s} из ${ex.sets}`,ex.rest,ex.restLabel));
                else if (!lastEx) list.push(makeRestStep(ex,exIdx,day.exercises.length,`Перед следующим упражнением`,ex.rest,ex.restLabel));
            }
        });
        return list;
    }

    /* ========== SESSION ENGINE ========== */
    function startSession(type, steplist, startIdx=0) {
        sessionType=type; steps=steplist; stepIdx=startIdx;
        player.hidden=false;
        document.body.style.overflow='hidden';
        haptic(15);
        setupStep();
    }

    function startTimer() {
        ticking = true;
        intervalId = setInterval(() => {
            timeLeft--;
            const step = steps[stepIdx];

            if (step.kind === 'rest' && !step.halfAnnounced && totalTime >= 20 &&
                timeLeft > 0 && timeLeft <= Math.floor(totalTime / 2)) {
                step.halfAnnounced = true;
                speak('Осталась половина отдыха', true);
            }
            if (timeLeft <= 5 && timeLeft > 0) {
                beep(440,0.06);
                if (step.kind !== 'rest') announceCountdown(timeLeft);
            }
            if (timeLeft <= 0) {
                clearInterval(intervalId); ticking=false;
                beep(880,0.18); haptic([120,60,120]);
                markExerciseProgress(step);
                nextStep();
                return;
            }
            updateRing();
        },1000);
    }

    function setupStep() {
        clearInterval(intervalId); ticking=false;
        const step = steps[stepIdx];
        if (!step) { finishSession(); return; }

        ring.classList.remove('is-rest','is-go','pulse');
        ring.classList.add(step.kind==='rest'?'is-rest':'is-go');
        playerCrumbs.textContent = `${sessionTitle()} · ${stepIdx+1}/${steps.length}`;
        playerName.textContent = step.exName;
        playerMeta.textContent = step.setLabel+(step.repsLabel?` · ${step.repsLabel}`:'');
        if (step.note) { playerNote.hidden=false; playerNote.textContent=step.note; }
        else { playerNote.hidden=true; }
        if (step.image) {
            playerImage.onerror = function(){ playerImageContainer.hidden = true; };
            playerImage.src = step.image;
            playerImage.alt = step.exName;
            playerImageContainer.hidden = false;
        } else {
            playerImageContainer.hidden = true;
        }

        const nextExerciseBlock = document.getElementById('nextExercise');
        const nextExerciseName = document.getElementById('nextExerciseName');
        if (step.kind === 'rest') {
            let nextWorkStep = null;
            for (let i = stepIdx + 1; i < steps.length; i++) {
                if (steps[i].kind === 'work') { nextWorkStep = steps[i]; break; }
            }
            if (nextWorkStep) { nextExerciseBlock.hidden = false; nextExerciseName.textContent = nextWorkStep.exName; }
            else { nextExerciseBlock.hidden = true; }
        } else {
            nextExerciseBlock.hidden = true;
        }

        if (step.kind === 'work') {
            if (shouldPrep(step)) startPrep(step); else beginWork(step);
        } else {
            startRest(step);
        }
    }

    function shouldPrep(step) {
        if (stepIdx === 0) return true;
        const prev = steps[stepIdx - 1];
        if (!prev) return true;
        if (prev.kind === 'work' && prev.exName === step.exName) return false;
        return true;
    }

    function startPrep(step) {
        currentPhase = 'prep';
        let prepLeft = 5;
        timeLeft = prepLeft; totalTime = prepLeft;
        ringPhase.textContent = 'ПРИГОТОВЬСЯ';
        ringTime.textContent = String(prepLeft);
        ringOuter.style.setProperty('--progress', '360deg');
        mainActionBtn.textContent = 'Начать сейчас';
        skipBtn.hidden = false; skipBtn.textContent = 'Пропустить';
        restAdjust.hidden = true;
        speak(`Приготовься. ${step.exName}.`, true);
        haptic(20);

        ticking = true;
        intervalId = setInterval(() => {
            prepLeft--;
            if (prepLeft > 0) {
                ringTime.textContent = String(prepLeft);
                ringOuter.style.setProperty('--progress', `${(prepLeft/5)*360}deg`);
                speak(String(prepLeft), true);
            } else {
                clearInterval(intervalId); ticking = false;
                speak('Начали!', true);
                beep(880, 0.15); haptic([80, 40, 80]);
                beginWork(step);
            }
        }, 1000);
    }

    function beginWork(step) {
        currentPhase = 'work';
        ring.classList.remove('is-rest','pulse');
        ring.classList.add('is-go');
        if (step.duration) {
            ringPhase.textContent = 'РАБОТА';
            timeLeft = step.duration; totalTime = step.duration;
            updateRing();
            mainActionBtn.textContent = 'Пауза';
            skipBtn.hidden = false; skipBtn.textContent = 'Пропустить';
            restAdjust.hidden = true;
            startTimer();
        } else {
            ringPhase.textContent = 'РАБОТА';
            ringTime.textContent = '✓';
            ringOuter.style.setProperty('--progress', '360deg');
            mainActionBtn.textContent = 'Готово';
            skipBtn.hidden = false; skipBtn.textContent = 'Пропустить';
            restAdjust.hidden = true;
        }
    }

    function startRest(step) {
        currentPhase = 'rest';
        ringPhase.textContent = 'ОТДЫХ';
        if (step.duration) {
            timeLeft = step.duration; totalTime = step.duration;
            step.halfAnnounced = false;
            updateRing();
            mainActionBtn.textContent = 'Пауза';
            skipBtn.hidden = false; skipBtn.textContent = 'Пропустить';
            restAdjust.hidden = false;
            announceRest(step);
            startTimer();
        } else {
            ringTime.textContent = '✓';
            ringOuter.style.setProperty('--progress', '360deg');
            mainActionBtn.textContent = 'Готово';
            skipBtn.hidden = false;
            restAdjust.hidden = true;
        }
    }

    function announceRest(step) {
        if (!voiceEnabled) return;
        let message = `Отдых ${step.repsLabel}. `;
        const prevWork = [...steps.slice(0, stepIdx)].reverse().find(s => s.kind === 'work');
        for (let i = stepIdx + 1; i < steps.length; i++) {
            if (steps[i].kind === 'work') {
                if (!prevWork || steps[i].exName !== prevWork.exName) {
                    message += `Следующее упражнение: ${steps[i].exName}.`;
                }
                break;
            }
        }
        speak(message, true);
    }

    function sessionTitle() { return DAYS[sessionType].title; }

    function updateRing() {
        const mins = Math.floor(timeLeft/60), secs = timeLeft%60;
        ringTime.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        const progress = totalTime>0 ? (timeLeft/totalTime)*360 : 0;
        ringOuter.style.setProperty('--progress',`${progress}deg`);
        if (timeLeft <= 3 && timeLeft > 0 && steps[stepIdx].kind !== 'rest') ring.classList.add('pulse');
        else ring.classList.remove('pulse');
    }
    function adjustRest(amount) {
        if (steps[stepIdx].kind !== 'rest' || !ticking) return;
        const newTime = timeLeft + amount;
        if (newTime < 0 || newTime > 600) return;
        timeLeft = newTime;
        totalTime = totalTime + amount;
        haptic(10);
        updateRing();
    }
    function toggleTimer() {
        const step = steps[stepIdx];
        haptic(12);
        if (currentPhase === 'prep') {
            clearInterval(intervalId); ticking = false;
            if (synth) synth.cancel();
            beep(880, 0.15);
            beginWork(step);
            return;
        }
        if (!step.duration) {
            markExerciseProgress(step); beep(660,0.08); nextStep(); return;
        }
        if (ticking) { clearInterval(intervalId); ticking=false; mainActionBtn.textContent='Продолжить'; }
        else { mainActionBtn.textContent='Пауза'; startTimer(); }
    }
    function skipStep() { haptic(15); clearInterval(intervalId); ticking=false; nextStep(); }
    function nextStep() {
        stepIdx++;
        if (stepIdx >= steps.length) { finishSession(); return; }
        setupStep();
    }
    function markExerciseProgress(step) {
        if (step.kind!=='work') return;
        if (sessionType==='A'||sessionType==='B') sessionDone[sessionType].add(step.exIdx);
    }
    function closePlayer() {
        clearInterval(intervalId); ticking=false;
        player.hidden=true; document.body.style.overflow='';
        restAdjust.hidden=true;
        if (synth && synth.speaking) synth.cancel();
    }
    function finishSession() {
        speak('Тренировка завершена. Отличная работа!', true);
        haptic([100, 60, 100, 60, 100]);
        closePlayer();
        if (sessionType==='A'||sessionType==='B') {
            qualityModal.hidden=false;
            qualityModal.dataset.day=sessionType;
            document.getElementById('workoutWeight').value = '';
        }
        renderView();
    }

    /* ========== RENDERING ========== */
    function scrollToTab(view) {
        const activeTab = [...dayTabs.children].find(t=>t.dataset.view===view);
        if (activeTab) activeTab.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
    }
    function renderTabs() {
        [...dayTabs.querySelectorAll('.tab')].forEach(t=>t.classList.toggle('is-active', t.dataset.view===currentView));
        scrollToTab(currentView);
    }
    function exerciseCard(ex, exIdx, dayKey) {
        const done = sessionDone[dayKey].has(exIdx);
        const repsText = ex.mode==='time'?(ex.durationLabel||`${ex.duration} сек`):ex.repsLabel;
        const imgSrc = exerciseImages[ex.name];
        const plateContent = plateHTML(imgSrc, ex.num);
        return `<div class="card ${done?'is-done':''}" data-day="${dayKey}" data-ex="${exIdx}" style="animation-delay:${exIdx*0.04}s">
            ${plateContent}
            <div class="card__body">
                <p class="card__name">${ex.name}</p>
                <div class="card__stats"><span>${ex.sets} подх.</span><span>${repsText}</span><span>отдых ${ex.restLabel}</span></div>
                ${ex.note?`<span class="card__alt">${ex.note}</span>`:''}
            </div>
            <button class="card__go" aria-label="Начать"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M8 5v14l11-7z"/></svg></button>
        </div>`;
    }
    function renderDay(dayKey) {
        const day = DAYS[dayKey];
        const cards = day.exercises.map((ex,i)=>exerciseCard(ex,i,dayKey)).join('');
        mainContent.innerHTML = `<div class="section-head"><div><h2>${day.title}</h2><p>${day.subtitle}</p></div></div>${cards}`;
        mainContent.querySelectorAll('.card').forEach(card=>{
            card.addEventListener('click', e=>{
                if (!e.target.closest('.card__go')) return;
                const idx = Number(card.dataset.ex);
                startSession(dayKey, buildDaySteps(dayKey, idx));
            });
        });
    }
    function renderView() { renderTabs(); renderDay(currentView); }
    function renderLog() {
        const log = getLog();
        if (!log.length) { logList.innerHTML=`<p class="log-empty">Пока пусто. Заверши первую тренировку — запись появится здесь.</p>`; return; }
        logList.innerHTML = log.map(e=>{
            const weightText = e.weight ? ` · ${e.weight} кг` : '';
            return `<div class="log-item">
                <span><b>${e.day}</b> · ${dayLabel(e.day)}${weightText}</span>
                <span>${fmtDate(e.date)}</span>
                <span>${e.quality?'макс.':'норм'}</span>
            </div>`;
        }).join('');
    }

    /* ========== GESTURES (свайп A/B на главном экране) ========== */
    let touchStartX=0, touchStartY=0;
    app.addEventListener('touchstart', e=>{
        if (player.hidden && currentScreen === 'home') {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }, {passive:true});
    app.addEventListener('touchend', e=>{
        if (!player.hidden || currentScreen !== 'home') return;
        const dx = (e.changedTouches[0].clientX - touchStartX);
        const dy = (e.changedTouches[0].clientY - touchStartY);
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
            const dir = dx > 0 ? -1 : 1;
            const curIdx = dayOrder.indexOf(currentView);
            const newIdx = Math.min(Math.max(curIdx+dir, 0), dayOrder.length-1);
            if (newIdx !== curIdx) {
                currentView = dayOrder[newIdx];
                haptic(8);
                renderView();
            }
        }
    }, {passive:true});

    player.addEventListener('touchstart', e=>{ touchStartY = e.touches[0].clientY; }, {passive:true});
    player.addEventListener('touchend', e=>{
        const dy = (e.changedTouches[0].clientY - touchStartY);
        if (dy < -50 && !e.target.closest('button')) {
            closePlayer(); renderView();
        }
    });

    /* ========== EVENTS ========== */
    dayTabs.addEventListener('click', e=>{
        const tab = e.target.closest('.tab');
        if (!tab) return;
        currentView = tab.dataset.view;
        haptic(8);
        renderView();
    });
    document.getElementById('playerClose').addEventListener('click', ()=>{ closePlayer(); renderView(); });
    mainActionBtn.addEventListener('click', toggleTimer);
    skipBtn.addEventListener('click', skipStep);
    restMinus.addEventListener('click', ()=>adjustRest(-5));
    restPlus.addEventListener('click', ()=>adjustRest(5));
    document.getElementById('qualityYes').addEventListener('click', ()=>{
        const weight = parseFloat(document.getElementById('workoutWeight').value) || null;
        saveLogEntry(qualityModal.dataset.day, true, weight);
        qualityModal.hidden = true;
        renderView();
    });
    document.getElementById('qualityNo').addEventListener('click', ()=>{
        const weight = parseFloat(document.getElementById('workoutWeight').value) || null;
        saveLogEntry(qualityModal.dataset.day, false, weight);
        qualityModal.hidden = true;
        renderView();
    });

    if (themeSelect) themeSelect.addEventListener('change', e=>{
        localStorage.setItem('theme', e.target.value);
        applyTheme(e.target.value);
    });
    if (voiceToggleCheckbox) voiceToggleCheckbox.addEventListener('change', e=>{
        voiceEnabled = e.target.checked;
        localStorage.setItem('voiceEnabled', voiceEnabled);
        haptic(10);
        if (!voiceEnabled && synth && synth.speaking) synth.cancel();
        else if (voiceEnabled) speak('Голосовые подсказки включены', true);
    });

    /* ========== КНОПКА "НАЗАД" ANDROID ========== */
    window.addEventListener('popstate', () => {
        if (!player.hidden) {
            closePlayer(); renderView();
            history.pushState({ screen: currentScreen }, '');
            return;
        }
        if (!qualityModal.hidden) {
            qualityModal.hidden = true;
            history.pushState({ screen: currentScreen }, '');
            return;
        }
        if (currentScreen !== 'home') {
            showScreen('home');
            return;
        }
    });

    history.replaceState({ screen: 'home' }, '');

    /* ========== INIT ========== */
    renderView();
    renderAiHistory();
});
