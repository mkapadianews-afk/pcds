import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Cpu, CircuitBoard, MemoryStick, HardDrive, Power, Box, Fan, MonitorPlay,
  Gamepad2, Clapperboard, Radio, Boxes, BrainCircuit, Briefcase,
  Sparkles, Save, Plus, Trash2, Check, X, AlertTriangle, ChevronRight,
  ChevronLeft, Zap, DollarSign, RotateCcw, ShieldCheck, ShieldAlert, Repeat2, Wrench, Send, Bot, MessageCircle, Maximize, Minimize, Settings, Sun, Moon, Search
} from "lucide-react";
import { MEDIA, MEDIA_NE } from "../data/part-media.js";
import { myId as netId, makeCode as netCode, roomChannel as netRoom, lobbyChannel as netLobby, leave as netLeave, signUp as netSignUp, logIn as netLogIn, fetchElo as netFetchElo, fetchUser as netFetchUser, saveElo as netSaveElo, eloGain as netEloGain, leaderboard as netLeaderboard, listBuilds as netListBuilds, syncBuild as netSyncBuild, deleteBuildCloud as netDeleteBuild, allUsers as netAllUsers, deleteUser as netDeleteUser, setElo as netSetElo, resetPassword as netResetPassword, setCustomRank as netSetCustomRank } from "./moggerNet.js";
/* ----------------------------- i18n ----------------------------- */
const LANGS = [{"code": "en", "name": "English"}, {"code": "es", "name": "Español"}, {"code": "zh", "name": "中文"}, {"code": "hi", "name": "हिन्दी"}, {"code": "ar", "name": "العربية"}, {"code": "pt", "name": "Português"}, {"code": "fr", "name": "Français"}, {"code": "ru", "name": "Русский"}, {"code": "ja", "name": "日本語"}, {"code": "de", "name": "Deutsch"}];
const I18N = {"en": {"myRigs": "My Rigs", "settings": "Settings", "appearance": "Appearance", "language": "Language", "theme": "Theme", "dark": "Dark", "light": "Light", "back": "Back", "saveRig": "Save rig", "select": "Select", "selected": "Selected", "moreInfo": "More info", "hideInfo": "Hide info", "autoForge": "Auto-Forge", "buildYourself": "Build It Yourself", "yourBuild": "Your build", "budgetQ": "What's your budget?", "useCaseQ": "What will this PC be for?", "livePrices": "Live prices", "samplePrices": "sample prices", "updated": "updated", "componentsDb": "components in the database", "overBudgetCat": "Over your {x} budget", "performance": "PERFORMANCE", "pricePerf": "PRICE / PERF", "pros": "PROS", "cons": "CONS"}, "es": {"myRigs": "Mis Equipos", "settings": "Ajustes", "appearance": "Apariencia", "language": "Idioma", "theme": "Tema", "dark": "Oscuro", "light": "Claro", "back": "Atrás", "saveRig": "Guardar", "select": "Elegir", "selected": "Elegido", "moreInfo": "Más info", "hideInfo": "Ocultar", "autoForge": "Auto-Forjar", "buildYourself": "Hazlo tú mismo", "yourBuild": "Tu equipo", "budgetQ": "¿Cuál es tu presupuesto?", "useCaseQ": "¿Para qué será este PC?", "livePrices": "Precios en vivo", "samplePrices": "precios de muestra", "updated": "actualizado", "componentsDb": "componentes en la base de datos", "overBudgetCat": "Supera tu presupuesto de {x}", "performance": "RENDIMIENTO", "pricePerf": "PRECIO / REND", "pros": "PROS", "cons": "CONTRAS"}, "zh": {"myRigs": "我的配置", "settings": "设置", "appearance": "外观", "language": "语言", "theme": "主题", "dark": "深色", "light": "浅色", "back": "返回", "saveRig": "保存配置", "select": "选择", "selected": "已选", "moreInfo": "更多信息", "hideInfo": "隐藏", "autoForge": "自动配置", "buildYourself": "自己组装", "yourBuild": "你的配置", "budgetQ": "你的预算是多少？", "useCaseQ": "这台电脑用来做什么？", "livePrices": "实时价格", "samplePrices": "示例价格", "updated": "更新于", "componentsDb": "个组件已入库", "overBudgetCat": "超出{x}预算", "performance": "性能", "pricePerf": "性价比", "pros": "优点", "cons": "缺点"}, "hi": {"myRigs": "मेरे रिग", "settings": "सेटिंग्स", "appearance": "रूप", "language": "भाषा", "theme": "थीम", "dark": "गहरा", "light": "हल्का", "back": "वापस", "saveRig": "सहेजें", "select": "चुनें", "selected": "चयनित", "moreInfo": "और जानकारी", "hideInfo": "छिपाएं", "autoForge": "ऑटो-फोर्ज", "buildYourself": "खुद बनाएं", "yourBuild": "आपका बिल्ड", "budgetQ": "आपका बजट क्या है?", "useCaseQ": "यह पीसी किसलिए होगा?", "livePrices": "लाइव कीमतें", "samplePrices": "नमूना कीमतें", "updated": "अपडेट", "componentsDb": "घटक डेटाबेस में", "overBudgetCat": "{x} बजट से अधिक", "performance": "प्रदर्शन", "pricePerf": "मूल्य/प्रदर्शन", "pros": "फायदे", "cons": "नुकसान"}, "ar": {"myRigs": "أجهزتي", "settings": "الإعدادات", "appearance": "المظهر", "language": "اللغة", "theme": "السمة", "dark": "داكن", "light": "فاتح", "back": "رجوع", "saveRig": "حفظ", "select": "اختيار", "selected": "محدد", "moreInfo": "المزيد", "hideInfo": "إخفاء", "autoForge": "تجميع تلقائي", "buildYourself": "اصنعه بنفسك", "yourBuild": "تجميعتك", "budgetQ": "ما هي ميزانيتك؟", "useCaseQ": "لأي غرض هذا الحاسوب؟", "livePrices": "أسعار حية", "samplePrices": "أسعار تجريبية", "updated": "محدّث", "componentsDb": "مكوّن في قاعدة البيانات", "overBudgetCat": "يتجاوز ميزانية {x}", "performance": "الأداء", "pricePerf": "السعر/الأداء", "pros": "الإيجابيات", "cons": "السلبيات"}, "pt": {"myRigs": "Meus PCs", "settings": "Configurações", "appearance": "Aparência", "language": "Idioma", "theme": "Tema", "dark": "Escuro", "light": "Claro", "back": "Voltar", "saveRig": "Salvar", "select": "Selecionar", "selected": "Selecionado", "moreInfo": "Mais info", "hideInfo": "Ocultar", "autoForge": "Auto-Forjar", "buildYourself": "Faça você mesmo", "yourBuild": "Sua build", "budgetQ": "Qual é o seu orçamento?", "useCaseQ": "Para que será este PC?", "livePrices": "Preços ao vivo", "samplePrices": "preços de exemplo", "updated": "atualizado", "componentsDb": "componentes no banco de dados", "overBudgetCat": "Acima do orçamento de {x}", "performance": "DESEMPENHO", "pricePerf": "PREÇO / DESEMP", "pros": "PRÓS", "cons": "CONTRAS"}, "fr": {"myRigs": "Mes Configs", "settings": "Réglages", "appearance": "Apparence", "language": "Langue", "theme": "Thème", "dark": "Sombre", "light": "Clair", "back": "Retour", "saveRig": "Enregistrer", "select": "Choisir", "selected": "Choisi", "moreInfo": "Plus d'infos", "hideInfo": "Masquer", "autoForge": "Auto-Forge", "buildYourself": "Faites-le vous-même", "yourBuild": "Votre config", "budgetQ": "Quel est votre budget ?", "useCaseQ": "À quoi servira ce PC ?", "livePrices": "Prix en direct", "samplePrices": "prix indicatifs", "updated": "mis à jour", "componentsDb": "composants dans la base", "overBudgetCat": "Au-dessus du budget {x}", "performance": "PERFORMANCE", "pricePerf": "PRIX / PERF", "pros": "ATOUTS", "cons": "INCONVÉNIENTS"}, "ru": {"myRigs": "Мои сборки", "settings": "Настройки", "appearance": "Вид", "language": "Язык", "theme": "Тема", "dark": "Тёмная", "light": "Светлая", "back": "Назад", "saveRig": "Сохранить", "select": "Выбрать", "selected": "Выбрано", "moreInfo": "Подробнее", "hideInfo": "Скрыть", "autoForge": "Авто-сборка", "buildYourself": "Собрать самому", "yourBuild": "Ваша сборка", "budgetQ": "Каков ваш бюджет?", "useCaseQ": "Для чего этот ПК?", "livePrices": "Цены в реальном времени", "samplePrices": "примерные цены", "updated": "обновлено", "componentsDb": "компонентов в базе", "overBudgetCat": "Сверх бюджета на {x}", "performance": "ПРОИЗВОДИТ.", "pricePerf": "ЦЕНА/КАЧ.", "pros": "ПЛЮСЫ", "cons": "МИНУСЫ"}, "ja": {"myRigs": "マイ構成", "settings": "設定", "appearance": "外観", "language": "言語", "theme": "テーマ", "dark": "ダーク", "light": "ライト", "back": "戻る", "saveRig": "保存", "select": "選択", "selected": "選択済", "moreInfo": "詳細", "hideInfo": "隠す", "autoForge": "自動構成", "buildYourself": "自分で組む", "yourBuild": "あなたの構成", "budgetQ": "予算はいくらですか？", "useCaseQ": "このPCの用途は？", "livePrices": "ライブ価格", "samplePrices": "サンプル価格", "updated": "更新", "componentsDb": "個のパーツを収録", "overBudgetCat": "{x}予算オーバー", "performance": "性能", "pricePerf": "価格性能", "pros": "長所", "cons": "短所"}, "de": {"myRigs": "Meine Builds", "settings": "Einstellungen", "appearance": "Darstellung", "language": "Sprache", "theme": "Thema", "dark": "Dunkel", "light": "Hell", "back": "Zurück", "saveRig": "Speichern", "select": "Wählen", "selected": "Gewählt", "moreInfo": "Mehr Info", "hideInfo": "Verbergen", "autoForge": "Auto-Forge", "buildYourself": "Selbst bauen", "yourBuild": "Dein Build", "budgetQ": "Wie hoch ist dein Budget?", "useCaseQ": "Wofür ist dieser PC?", "livePrices": "Live-Preise", "samplePrices": "Beispielpreise", "updated": "aktualisiert", "componentsDb": "Komponenten in der Datenbank", "overBudgetCat": "Über dem {x}-Budget", "performance": "LEISTUNG", "pricePerf": "PREIS / LEIST", "pros": "VORTEILE", "cons": "NACHTEILE"}};
let CUR_LANG = "en";

const I18N_X = {"en": {"budget": "budget", "startBuild": "Start a new build", "savedWord": "saved", "loadingRigs": "Loading your rigs…", "noRigs": "No rigs yet. Build one and save it here.", "chooseA": "CHOOSE A", "outOfStock": "Out of stock"}, "es": {"budget": "presupuesto", "startBuild": "Crear nueva build", "savedWord": "guardados", "loadingRigs": "Cargando tus equipos…", "noRigs": "Aún no hay equipos. Crea uno y guárdalo aquí.", "chooseA": "ELIGE", "outOfStock": "Agotado"}, "zh": {"budget": "预算", "startBuild": "开始新配置", "savedWord": "已保存", "loadingRigs": "正在加载…", "noRigs": "还没有配置。创建并保存在这里。", "chooseA": "选择", "outOfStock": "缺货"}, "hi": {"budget": "बजट", "startBuild": "नया बिल्ड शुरू करें", "savedWord": "सहेजे गए", "loadingRigs": "आपके रिग लोड हो रहे हैं…", "noRigs": "अभी कोई रिग नहीं। एक बनाएं और सहेजें।", "chooseA": "चुनें", "outOfStock": "स्टॉक ख़त्म"}, "ar": {"budget": "ميزانية", "startBuild": "ابدأ بناءً جديدًا", "savedWord": "محفوظ", "loadingRigs": "جارٍ التحميل…", "noRigs": "لا أجهزة بعد. أنشئ واحداً واحفظه هنا.", "chooseA": "اختر", "outOfStock": "نفد المخزون"}, "pt": {"budget": "orçamento", "startBuild": "Iniciar nova build", "savedWord": "salvos", "loadingRigs": "Carregando…", "noRigs": "Nenhum PC ainda. Crie e salve aqui.", "chooseA": "ESCOLHA", "outOfStock": "Esgotado"}, "fr": {"budget": "budget", "startBuild": "Nouvelle config", "savedWord": "enregistrés", "loadingRigs": "Chargement…", "noRigs": "Aucune config. Créez-en une et enregistrez-la.", "chooseA": "CHOISIR", "outOfStock": "Rupture de stock"}, "ru": {"budget": "бюджет", "startBuild": "Новая сборка", "savedWord": "сохранено", "loadingRigs": "Загрузка…", "noRigs": "Сборок пока нет. Создайте и сохраните.", "chooseA": "ВЫБЕРИТЕ", "outOfStock": "Нет в наличии"}, "ja": {"budget": "予算", "startBuild": "新しい構成を始める", "savedWord": "保存済み", "loadingRigs": "読み込み中…", "noRigs": "まだ構成がありません。作成して保存しましょう。", "chooseA": "選択", "outOfStock": "在庫切れ"}, "de": {"budget": "Budget", "startBuild": "Neuen Build starten", "savedWord": "gespeichert", "loadingRigs": "Wird geladen…", "noRigs": "Noch keine Builds. Erstelle und speichere einen.", "chooseA": "WÄHLE", "outOfStock": "Nicht verfügbar"}};
const _UCL = {"en": {"gaming": "Gaming", "content": "Content Creation", "streaming": "Streaming", "workstation": "3D / Workstation", "ai": "AI / ML", "office": "Office / Everyday"}, "es": {"gaming": "Juegos", "content": "Creación de Contenido", "streaming": "Streaming", "workstation": "3D / Estación", "ai": "IA / ML", "office": "Oficina / Diario"}, "zh": {"gaming": "游戏", "content": "内容创作", "streaming": "直播", "workstation": "3D 工作站", "ai": "AI / 机器学习", "office": "办公 / 日常"}, "hi": {"gaming": "गेमिंग", "content": "कंटेंट क्रिएशन", "streaming": "स्ट्रीमिंग", "workstation": "3D / वर्कस्टेशन", "ai": "एआई / एमएल", "office": "ऑफिस / रोज़"}, "ar": {"gaming": "الألعاب", "content": "صناعة المحتوى", "streaming": "البث", "workstation": "3D / محطة عمل", "ai": "ذكاء اصطناعي", "office": "مكتب / يومي"}, "pt": {"gaming": "Jogos", "content": "Criação de Conteúdo", "streaming": "Streaming", "workstation": "3D / Workstation", "ai": "IA / ML", "office": "Escritório / Diário"}, "fr": {"gaming": "Jeux", "content": "Création de Contenu", "streaming": "Streaming", "workstation": "3D / Station", "ai": "IA / ML", "office": "Bureau / Quotidien"}, "ru": {"gaming": "Игры", "content": "Контент", "streaming": "Стриминг", "workstation": "3D / Рабочая станция", "ai": "ИИ / МО", "office": "Офис / Повседневный"}, "ja": {"gaming": "ゲーム", "content": "コンテンツ制作", "streaming": "配信", "workstation": "3D / ワークステーション", "ai": "AI / ML", "office": "オフィス / 日常"}, "de": {"gaming": "Gaming", "content": "Content-Erstellung", "streaming": "Streaming", "workstation": "3D / Workstation", "ai": "KI / ML", "office": "Büro / Alltag"}};
const _UCT = {"en": {"gaming": "Max FPS", "content": "Video & Photo", "streaming": "Play & Broadcast", "workstation": "Render & CAD", "ai": "VRAM Hungry", "office": "Snappy & Cheap"}, "es": {"gaming": "Máx FPS", "content": "Vídeo y Foto", "streaming": "Jugar y Transmitir", "workstation": "Renderizado y CAD", "ai": "Hambriento de VRAM", "office": "Rápido y Barato"}, "zh": {"gaming": "最高帧率", "content": "视频与照片", "streaming": "边玩边播", "workstation": "渲染与CAD", "ai": "显存需求高", "office": "流畅又便宜"}, "hi": {"gaming": "अधिकतम FPS", "content": "वीडियो और फोटो", "streaming": "खेलें और प्रसारित करें", "workstation": "रेंडर और CAD", "ai": "अधिक VRAM", "office": "तेज़ और सस्ता"}, "ar": {"gaming": "أقصى إطارات", "content": "فيديو وصور", "streaming": "لعب وبث", "workstation": "تصيير وCAD", "ai": "نهم للذاكرة", "office": "سريع ورخيص"}, "pt": {"gaming": "Máx FPS", "content": "Vídeo e Foto", "streaming": "Jogar e Transmitir", "workstation": "Renderização e CAD", "ai": "Faminto por VRAM", "office": "Rápido e Barato"}, "fr": {"gaming": "FPS max", "content": "Vidéo & Photo", "streaming": "Jouer & Diffuser", "workstation": "Rendu & CAO", "ai": "Gourmand en VRAM", "office": "Rapide & Abordable"}, "ru": {"gaming": "Макс FPS", "content": "Видео и фото", "streaming": "Игра и трансляция", "workstation": "Рендер и CAD", "ai": "Нужен VRAM", "office": "Быстро и дёшево"}, "ja": {"gaming": "最大FPS", "content": "動画と写真", "streaming": "プレイ＆配信", "workstation": "レンダー＆CAD", "ai": "VRAM大食い", "office": "軽快＆安価"}, "de": {"gaming": "Max FPS", "content": "Video & Foto", "streaming": "Spielen & Senden", "workstation": "Rendern & CAD", "ai": "VRAM-hungrig", "office": "Flott & Günstig"}};
const _CATL = {"en": {"cpu": "CPU", "gpu": "Graphics Card", "mobo": "Motherboard", "ram": "Memory", "storage": "Storage", "psu": "Power Supply", "case": "Case", "cooler": "CPU Cooler"}, "es": {"cpu": "CPU", "gpu": "Tarjeta Gráfica", "mobo": "Placa Base", "ram": "Memoria", "storage": "Almacenamiento", "psu": "Fuente", "case": "Caja", "cooler": "Disipador"}, "zh": {"cpu": "处理器", "gpu": "显卡", "mobo": "主板", "ram": "内存", "storage": "存储", "psu": "电源", "case": "机箱", "cooler": "散热器"}, "hi": {"cpu": "सीपीयू", "gpu": "ग्राफिक्स कार्ड", "mobo": "मदरबोर्ड", "ram": "मेमोरी", "storage": "स्टोरेज", "psu": "बिजली आपूर्ति", "case": "केस", "cooler": "कूलर"}, "ar": {"cpu": "معالج", "gpu": "بطاقة رسومات", "mobo": "اللوحة الأم", "ram": "الذاكرة", "storage": "التخزين", "psu": "مزود الطاقة", "case": "الصندوق", "cooler": "مبرد"}, "pt": {"cpu": "CPU", "gpu": "Placa de Vídeo", "mobo": "Placa-Mãe", "ram": "Memória", "storage": "Armazenamento", "psu": "Fonte", "case": "Gabinete", "cooler": "Cooler"}, "fr": {"cpu": "Processeur", "gpu": "Carte Graphique", "mobo": "Carte Mère", "ram": "Mémoire", "storage": "Stockage", "psu": "Alimentation", "case": "Boîtier", "cooler": "Refroidisseur"}, "ru": {"cpu": "Процессор", "gpu": "Видеокарта", "mobo": "Материнская плата", "ram": "Память", "storage": "Накопитель", "psu": "Блок питания", "case": "Корпус", "cooler": "Охлаждение"}, "ja": {"cpu": "CPU", "gpu": "グラフィックカード", "mobo": "マザーボード", "ram": "メモリ", "storage": "ストレージ", "psu": "電源", "case": "ケース", "cooler": "クーラー"}, "de": {"cpu": "Prozessor", "gpu": "Grafikkarte", "mobo": "Hauptplatine", "ram": "Arbeitsspeicher", "storage": "Speicher", "psu": "Netzteil", "case": "Gehäuse", "cooler": "Kühler"}};
const _pick = (mp, k) => (mp[CUR_LANG] && mp[CUR_LANG][k]) || mp.en[k] || k;
const tUC = (k) => (_UCL[CUR_LANG] && _UCL[CUR_LANG][k]) || _UCL.en[k] || (USE_CASES[k] && USE_CASES[k].label) || k;
const tUCtag = (k) => (_UCT[CUR_LANG] && _UCT[CUR_LANG][k]) || _UCT.en[k] || (USE_CASES[k] && USE_CASES[k].tag) || k;
const tCat = (k) => _pick(_CATL, k);
function t(key, vars) {
  const d = I18N[CUR_LANG] || I18N.en, x = I18N_X[CUR_LANG] || I18N_X.en;
  let str = (d && d[key]) || (x && x[key]) || I18N.en[key] || I18N_X.en[key] || key;
  if (vars) for (const k in vars) str = str.split('{'+k+'}').join(vars[k]);
  return str;
}


// Live-pricing endpoint (your deployed serverless function). When reachable it
// overrides the built-in sample prices; when not (e.g. inside Claude or offline)
// the app silently keeps the sample prices below.
const PRICES_URL = "/api/prices";

/* =========================================================================
   RIGFORGE — PC part picker w/ scoring, compatibility & saved builds
   Mock data stands in for the Best Buy API. Architecture is unchanged:
   a catalog + benchmark layer feeds a deterministic scoring/compat engine;
   the build score uses HYBRID mode (engine computes the number, a verdict
   generator narrates it — swap generateVerdict() for a live Claude call).
   ========================================================================= */

/* ----------------------------- MOCK CATALOG ----------------------------- */
const CATALOG = {
  /* Real models with accurate specs. GPUs include real board-partner VARIANTS grouped by `model`.
     Older parts (RX 580, GTX 1080 Ti, i3-10100, etc.) included for budget builds; Best Buy may not
     stock these new, so their live price can fall back to the sample value. */
  cpu: [
    {id:"cpu1",brand:"AMD",name:"Ryzen 5 4500",model:"Ryzen 5 4500",variantLabel:"AMD",price:78,perf:44,socket:"AM4",tdp:65,cores:6,igpu:false},
    {id:"cpu2",brand:"AMD",name:"Ryzen 5 5500",model:"Ryzen 5 5500",variantLabel:"AMD",price:84,perf:46,socket:"AM4",tdp:65,cores:6,igpu:false},
    {id:"cpu3",brand:"AMD",name:"Ryzen 5 5600",model:"Ryzen 5 5600",variantLabel:"AMD",price:105,perf:50,socket:"AM4",tdp:65,cores:6,igpu:false},
    {id:"cpu4",brand:"AMD",name:"Ryzen 5 5600G",model:"Ryzen 5 5600G",variantLabel:"AMD",price:155,perf:56,socket:"AM4",tdp:65,cores:6,igpu:true},
    {id:"cpu5",brand:"AMD",name:"Ryzen 5 5600X",model:"Ryzen 5 5600X",variantLabel:"AMD",price:115,perf:54,socket:"AM4",tdp:65,cores:6,igpu:false},
    {id:"cpu6",brand:"AMD",name:"Ryzen 7 5700X",model:"Ryzen 7 5700X",variantLabel:"AMD",price:140,perf:64,socket:"AM4",tdp:65,cores:8,igpu:false},
    {id:"cpu7",brand:"AMD",name:"Ryzen 7 5700X3D",model:"Ryzen 7 5700X3D",variantLabel:"AMD",price:195,perf:72,socket:"AM4",tdp:105,cores:8,igpu:false},
    {id:"cpu8",brand:"AMD",name:"Ryzen 9 5900X",model:"Ryzen 9 5900X",variantLabel:"AMD",price:195,perf:76,socket:"AM4",tdp:105,cores:12,igpu:false},
    {id:"cpu9",brand:"Intel",name:"Core i3-10100",model:"Core i3-10100",variantLabel:"Intel",price:70,perf:40,socket:"LGA1200",tdp:65,cores:4,igpu:true},
    {id:"cpu10",brand:"Intel",name:"Core i3-10105",model:"Core i3-10105",variantLabel:"Intel",price:80,perf:42,socket:"LGA1200",tdp:65,cores:4,igpu:true},
    {id:"cpu11",brand:"Intel",name:"Core i5-10400F",model:"Core i5-10400F",variantLabel:"Intel",price:95,perf:52,socket:"LGA1200",tdp:65,cores:6,igpu:false},
    {id:"cpu12",brand:"Intel",name:"Core i5-11400F",model:"Core i5-11400F",variantLabel:"Intel",price:110,perf:58,socket:"LGA1200",tdp:65,cores:6,igpu:false},
    {id:"cpu13",brand:"Intel",name:"Core i3-14100F",model:"Core i3-14100F",variantLabel:"Intel",price:100,perf:44,socket:"LGA1700",tdp:58,cores:4,igpu:false},
    {id:"cpu14",brand:"Intel",name:"Core i5-12400F",model:"Core i5-12400F",variantLabel:"Intel",price:100,perf:52,socket:"LGA1700",tdp:65,cores:6,igpu:false},
    {id:"cpu15",brand:"Intel",name:"Core i5-13400F",model:"Core i5-13400F",variantLabel:"Intel",price:130,perf:58,socket:"LGA1700",tdp:65,cores:10,igpu:false},
    {id:"cpu16",brand:"Intel",name:"Core i5-14400F",model:"Core i5-14400F",variantLabel:"Intel",price:150,perf:60,socket:"LGA1700",tdp:65,cores:10,igpu:false},
    {id:"cpu17",brand:"Intel",name:"Core i5-14600K",model:"Core i5-14600K",variantLabel:"Intel",price:210,perf:72,socket:"LGA1700",tdp:125,cores:14,igpu:true},
    {id:"cpu18",brand:"Intel",name:"Core i7-14700K",model:"Core i7-14700K",variantLabel:"Intel",price:290,perf:82,socket:"LGA1700",tdp:125,cores:20,igpu:true},
    {id:"cpu19",brand:"Intel",name:"Core i9-14900K",model:"Core i9-14900K",variantLabel:"Intel",price:380,perf:86,socket:"LGA1700",tdp:125,cores:24,igpu:true},
    {id:"cpu20",brand:"AMD",name:"Ryzen 5 7500F",model:"Ryzen 5 7500F",variantLabel:"AMD",price:155,perf:62,socket:"AM5",tdp:65,cores:6,igpu:false},
    {id:"cpu21",brand:"AMD",name:"Ryzen 5 7600",model:"Ryzen 5 7600",variantLabel:"AMD",price:180,perf:66,socket:"AM5",tdp:65,cores:6,igpu:true},
    {id:"cpu22",brand:"AMD",name:"Ryzen 5 7600X",model:"Ryzen 5 7600X",variantLabel:"AMD",price:167,perf:70,socket:"AM5",tdp:105,cores:6,igpu:true},
    {id:"cpu23",brand:"AMD",name:"Ryzen 7 7700",model:"Ryzen 7 7700",variantLabel:"AMD",price:240,perf:78,socket:"AM5",tdp:65,cores:8,igpu:true},
    {id:"cpu24",brand:"AMD",name:"Ryzen 7 7800X3D",model:"Ryzen 7 7800X3D",variantLabel:"AMD",price:305,perf:90,socket:"AM5",tdp:120,cores:8,igpu:true},
    {id:"cpu25",brand:"AMD",name:"Ryzen 9 7900X",model:"Ryzen 9 7900X",variantLabel:"AMD",price:300,perf:84,socket:"AM5",tdp:170,cores:12,igpu:true},
    {id:"cpu26",brand:"AMD",name:"Ryzen 9 7950X3D",model:"Ryzen 9 7950X3D",variantLabel:"AMD",price:500,perf:95,socket:"AM5",tdp:120,cores:16,igpu:true},
    {id:"cpu27",brand:"AMD",name:"Ryzen 5 9600X",model:"Ryzen 5 9600X",variantLabel:"AMD",price:176,perf:72,socket:"AM5",tdp:65,cores:6,igpu:true},
    {id:"cpu28",brand:"AMD",name:"Ryzen 7 9700X",model:"Ryzen 7 9700X",variantLabel:"AMD",price:290,perf:82,socket:"AM5",tdp:65,cores:8,igpu:true},
    {id:"cpu29",brand:"AMD",name:"Ryzen 7 9800X3D",model:"Ryzen 7 9800X3D",variantLabel:"AMD",price:433,perf:96,socket:"AM5",tdp:120,cores:8,igpu:true},
    {id:"cpu30",brand:"AMD",name:"Ryzen 9 9900X",model:"Ryzen 9 9900X",variantLabel:"AMD",price:350,perf:86,socket:"AM5",tdp:120,cores:12,igpu:true},
    {id:"cpu31",brand:"AMD",name:"Ryzen 9 9950X",model:"Ryzen 9 9950X",variantLabel:"AMD",price:540,perf:92,socket:"AM5",tdp:170,cores:16,igpu:true},
    {id:"cpu32",brand:"AMD",name:"Ryzen 9 9950X3D",model:"Ryzen 9 9950X3D",variantLabel:"AMD",price:620,perf:99,socket:"AM5",tdp:170,cores:16,igpu:true},
    {id:"cpu33",brand:"Intel",name:"Core Ultra 5 245K",model:"Core Ultra 5 245K",variantLabel:"Intel",price:185,perf:80,socket:"LGA1851",tdp:125,cores:14,igpu:true},
    {id:"cpu34",brand:"Intel",name:"Core Ultra 7 265K",model:"Core Ultra 7 265K",variantLabel:"Intel",price:315,perf:84,socket:"LGA1851",tdp:125,cores:20,igpu:true},
    {id:"cpu35",brand:"Intel",name:"Core Ultra 9 285K",model:"Core Ultra 9 285K",variantLabel:"Intel",price:540,perf:88,socket:"LGA1851",tdp:125,cores:24,igpu:true},
    {id:"cpu36",brand:"AMD",name:"Ryzen 9 9900X3D",model:"Ryzen 9 9900X3D",variantLabel:"AMD",price:470,perf:93,socket:"AM5",tdp:120,cores:12,igpu:true},
    {id:"cpu37",brand:"AMD",name:"Ryzen 5 7600X3D",model:"Ryzen 5 7600X3D",variantLabel:"AMD",price:246,perf:76,socket:"AM5",tdp:65,cores:6,igpu:true},
    {id:"cpu38",brand:"Intel",name:"Core i5-14500",model:"Core i5-14500",variantLabel:"Intel",price:190,perf:64,socket:"LGA1700",tdp:65,cores:14,igpu:true},
    {id:"cpu39",brand:"Intel",name:"Core i5-14400",model:"Core i5-14400",variantLabel:"Intel",price:180,perf:60,socket:"LGA1700",tdp:65,cores:10,igpu:true},
    {id:"cpu40",brand:"Intel",name:"Core i5-12500",model:"Core i5-12500",variantLabel:"Intel",price:150,perf:54,socket:"LGA1700",tdp:65,cores:6,igpu:true},
    {id:"cpu41",brand:"Intel",name:"Core i5-12600",model:"Core i5-12600",variantLabel:"Intel",price:165,perf:56,socket:"LGA1700",tdp:65,cores:6,igpu:true},
    {id:"cpu42",brand:"Intel",name:"Core i5-14600KF",model:"Core i5-14600KF",variantLabel:"Intel",price:200,perf:72,socket:"LGA1700",tdp:125,cores:14,igpu:false},
    {id:"cpu43",brand:"Intel",name:"Core i9-14900KF",model:"Core i9-14900KF",variantLabel:"Intel",price:370,perf:86,socket:"LGA1700",tdp:125,cores:24,igpu:false},
    {id:"cpu44",brand:"Intel",name:"Core i3-12100F",model:"Core i3-12100F",variantLabel:"Intel",price:80,perf:44,socket:"LGA1700",tdp:58,cores:4,igpu:false},
    {id:"cpu45",brand:"Intel",name:"Core i3-13100F",model:"Core i3-13100F",variantLabel:"Intel",price:90,perf:46,socket:"LGA1700",tdp:58,cores:4,igpu:false},
    {id:"cpu46",brand:"AMD",name:"Ryzen 9 9950X3D2",model:"Ryzen 9 9950X3D2",variantLabel:"AMD",price:950,perf:100,socket:"AM5",tdp:200,cores:16,igpu:true},
  ],
  gpu: [
    {id:"gpu_1",name:"Intel Limited Edition Intel Arc B570",brand:"Intel",model:"Intel Arc B570",variantLabel:"Intel Limited Edition",price:220,perf:24,vram:10,tdp:150,len:250},
    {id:"gpu_2",name:"ASRock Challenger Intel Arc B570",brand:"ASRock",model:"Intel Arc B570",variantLabel:"ASRock Challenger",price:225,perf:24,vram:10,tdp:150,len:255},
    {id:"gpu_3",name:"Sparkle Titan OC Intel Arc B570",brand:"Sparkle",model:"Intel Arc B570",variantLabel:"Sparkle Titan OC",price:230,perf:24,vram:10,tdp:150,len:258},
    {id:"gpu_4",name:"Gunnir Photon Intel Arc B570",brand:"Gunnir",model:"Intel Arc B570",variantLabel:"Gunnir Photon",price:235,perf:24,vram:10,tdp:150,len:260},
    {id:"gpu_5",name:"Intel Limited Edition Intel Arc B580",brand:"Intel",model:"Intel Arc B580",variantLabel:"Intel Limited Edition",price:260,perf:28,vram:12,tdp:190,len:272},
    {id:"gpu_6",name:"ASRock Challenger Intel Arc B580",brand:"ASRock",model:"Intel Arc B580",variantLabel:"ASRock Challenger",price:270,perf:28,vram:12,tdp:190,len:277},
    {id:"gpu_7",name:"Sparkle Titan OC Intel Arc B580",brand:"Sparkle",model:"Intel Arc B580",variantLabel:"Sparkle Titan OC",price:275,perf:28,vram:12,tdp:190,len:280},
    {id:"gpu_8",name:"Gunnir Photon Intel Arc B580",brand:"Gunnir",model:"Intel Arc B580",variantLabel:"Gunnir Photon",price:275,perf:28,vram:12,tdp:190,len:282},
    {id:"gpu_9",name:"Acer Predator BiFrost Intel Arc B580",brand:"Acer",model:"Intel Arc B580",variantLabel:"Acer Predator BiFrost",price:285,perf:28,vram:12,tdp:190,len:287},
    {id:"gpu_10",name:"Founders Edition GTX 1660 Super",brand:"Founders",model:"GTX 1660 Super",variantLabel:"Founders Edition",price:180,perf:18,vram:6,tdp:125,len:230},
    {id:"gpu_11",name:"EVGA GTX 1660 Super",brand:"EVGA",model:"GTX 1660 Super",variantLabel:"EVGA",price:190,perf:18,vram:6,tdp:125,len:240},
    {id:"gpu_12",name:"ASUS GTX 1660 Super",brand:"ASUS",model:"GTX 1660 Super",variantLabel:"ASUS",price:195,perf:18,vram:6,tdp:125,len:245},
    {id:"gpu_13",name:"Founders Edition GTX 1080 Ti",brand:"Founders",model:"GTX 1080 Ti",variantLabel:"Founders Edition",price:350,perf:27,vram:11,tdp:250,len:280},
    {id:"gpu_14",name:"EVGA GTX 1080 Ti",brand:"EVGA",model:"GTX 1080 Ti",variantLabel:"EVGA",price:370,perf:27,vram:11,tdp:250,len:290},
    {id:"gpu_15",name:"ASUS GTX 1080 Ti",brand:"ASUS",model:"GTX 1080 Ti",variantLabel:"ASUS",price:375,perf:27,vram:11,tdp:250,len:295},
    {id:"gpu_16",name:"MSI Gaming GTX 1080 Ti",brand:"MSI",model:"GTX 1080 Ti",variantLabel:"MSI Gaming",price:380,perf:27,vram:11,tdp:250,len:300},
    {id:"gpu_17",name:"Founders Edition RTX 3060",brand:"Founders",model:"RTX 3060",variantLabel:"Founders Edition",price:280,perf:26,vram:12,tdp:170,len:245},
    {id:"gpu_18",name:"EVGA RTX 3060",brand:"EVGA",model:"RTX 3060",variantLabel:"EVGA",price:295,perf:26,vram:12,tdp:170,len:255},
    {id:"gpu_19",name:"ASUS RTX 3060",brand:"ASUS",model:"RTX 3060",variantLabel:"ASUS",price:300,perf:26,vram:12,tdp:170,len:260},
    {id:"gpu_20",name:"MSI Gaming RTX 3060",brand:"MSI",model:"RTX 3060",variantLabel:"MSI Gaming",price:300,perf:26,vram:12,tdp:170,len:265},
    {id:"gpu_21",name:"Gigabyte RTX 3060",brand:"Gigabyte",model:"RTX 3060",variantLabel:"Gigabyte",price:295,perf:26,vram:12,tdp:170,len:260},
    {id:"gpu_22",name:"Founders Edition RTX 3060 Ti",brand:"Founders",model:"RTX 3060 Ti",variantLabel:"Founders Edition",price:340,perf:31,vram:8,tdp:200,len:245},
    {id:"gpu_23",name:"EVGA RTX 3060 Ti",brand:"EVGA",model:"RTX 3060 Ti",variantLabel:"EVGA",price:355,perf:31,vram:8,tdp:200,len:255},
    {id:"gpu_24",name:"ASUS RTX 3060 Ti",brand:"ASUS",model:"RTX 3060 Ti",variantLabel:"ASUS",price:365,perf:31,vram:8,tdp:200,len:260},
    {id:"gpu_25",name:"MSI Gaming RTX 3060 Ti",brand:"MSI",model:"RTX 3060 Ti",variantLabel:"MSI Gaming",price:365,perf:31,vram:8,tdp:200,len:265},
    {id:"gpu_26",name:"Founders Edition RTX 3070",brand:"Founders",model:"RTX 3070",variantLabel:"Founders Edition",price:420,perf:35,vram:8,tdp:220,len:270},
    {id:"gpu_27",name:"EVGA RTX 3070",brand:"EVGA",model:"RTX 3070",variantLabel:"EVGA",price:440,perf:35,vram:8,tdp:220,len:280},
    {id:"gpu_28",name:"ASUS RTX 3070",brand:"ASUS",model:"RTX 3070",variantLabel:"ASUS",price:450,perf:35,vram:8,tdp:220,len:285},
    {id:"gpu_29",name:"MSI Gaming RTX 3070",brand:"MSI",model:"RTX 3070",variantLabel:"MSI Gaming",price:455,perf:35,vram:8,tdp:220,len:290},
    {id:"gpu_30",name:"Sapphire RX 580 8GB",brand:"Sapphire",model:"RX 580 8GB",variantLabel:"Sapphire",price:150,perf:13,vram:8,tdp:185,len:240},
    {id:"gpu_31",name:"XFX RX 580 8GB",brand:"XFX",model:"RX 580 8GB",variantLabel:"XFX",price:155,perf:13,vram:8,tdp:185,len:245},
    {id:"gpu_32",name:"PowerColor RX 580 8GB",brand:"PowerColor",model:"RX 580 8GB",variantLabel:"PowerColor",price:160,perf:13,vram:8,tdp:185,len:250},
    {id:"gpu_33",name:"ASUS RX 580 8GB",brand:"ASUS",model:"RX 580 8GB",variantLabel:"ASUS",price:160,perf:13,vram:8,tdp:185,len:255},
    {id:"gpu_34",name:"Sapphire RX 6600",brand:"Sapphire",model:"RX 6600",variantLabel:"Sapphire",price:200,perf:23,vram:8,tdp:132,len:200},
    {id:"gpu_35",name:"XFX RX 6600",brand:"XFX",model:"RX 6600",variantLabel:"XFX",price:205,perf:23,vram:8,tdp:132,len:205},
    {id:"gpu_36",name:"PowerColor RX 6600",brand:"PowerColor",model:"RX 6600",variantLabel:"PowerColor",price:210,perf:23,vram:8,tdp:132,len:210},
    {id:"gpu_37",name:"ASUS RX 6600",brand:"ASUS",model:"RX 6600",variantLabel:"ASUS",price:215,perf:23,vram:8,tdp:132,len:215},
    {id:"gpu_38",name:"Sapphire RX 6600 XT",brand:"Sapphire",model:"RX 6600 XT",variantLabel:"Sapphire",price:250,perf:26,vram:8,tdp:160,len:230},
    {id:"gpu_39",name:"XFX RX 6600 XT",brand:"XFX",model:"RX 6600 XT",variantLabel:"XFX",price:260,perf:26,vram:8,tdp:160,len:235},
    {id:"gpu_40",name:"PowerColor RX 6600 XT",brand:"PowerColor",model:"RX 6600 XT",variantLabel:"PowerColor",price:265,perf:26,vram:8,tdp:160,len:240},
    {id:"gpu_41",name:"Sapphire RX 6750 XT",brand:"Sapphire",model:"RX 6750 XT",variantLabel:"Sapphire",price:330,perf:35,vram:12,tdp:250,len:280},
    {id:"gpu_42",name:"XFX RX 6750 XT",brand:"XFX",model:"RX 6750 XT",variantLabel:"XFX",price:340,perf:35,vram:12,tdp:250,len:285},
    {id:"gpu_43",name:"PowerColor RX 6750 XT",brand:"PowerColor",model:"RX 6750 XT",variantLabel:"PowerColor",price:345,perf:35,vram:12,tdp:250,len:290},
    {id:"gpu_44",name:"Sapphire RX 6800 XT",brand:"Sapphire",model:"RX 6800 XT",variantLabel:"Sapphire",price:480,perf:41,vram:16,tdp:300,len:290},
    {id:"gpu_45",name:"XFX RX 6800 XT",brand:"XFX",model:"RX 6800 XT",variantLabel:"XFX",price:495,perf:41,vram:16,tdp:300,len:295},
    {id:"gpu_46",name:"PowerColor RX 6800 XT",brand:"PowerColor",model:"RX 6800 XT",variantLabel:"PowerColor",price:505,perf:41,vram:16,tdp:300,len:300},
    {id:"gpu_47",name:"PNY Verto RTX 4060",brand:"PNY",model:"RTX 4060",variantLabel:"PNY Verto",price:250,perf:29,vram:8,tdp:115,len:245},
    {id:"gpu_48",name:"Zotac Twin Edge RTX 4060",brand:"Zotac",model:"RTX 4060",variantLabel:"Zotac Twin Edge",price:255,perf:29,vram:8,tdp:115,len:250},
    {id:"gpu_49",name:"Gigabyte Windforce RTX 4060",brand:"Gigabyte",model:"RTX 4060",variantLabel:"Gigabyte Windforce",price:260,perf:29,vram:8,tdp:115,len:260},
    {id:"gpu_50",name:"MSI Ventus 2X RTX 4060",brand:"MSI",model:"RTX 4060",variantLabel:"MSI Ventus 2X",price:265,perf:29,vram:8,tdp:115,len:255},
    {id:"gpu_51",name:"ASUS Dual RTX 4060",brand:"ASUS",model:"RTX 4060",variantLabel:"ASUS Dual",price:265,perf:29,vram:8,tdp:115,len:257},
    {id:"gpu_52",name:"Gigabyte Eagle RTX 4060",brand:"Gigabyte",model:"RTX 4060",variantLabel:"Gigabyte Eagle",price:270,perf:29,vram:8,tdp:115,len:260},
    {id:"gpu_53",name:"MSI Ventus 3X RTX 4060",brand:"MSI",model:"RTX 4060",variantLabel:"MSI Ventus 3X",price:275,perf:29,vram:8,tdp:115,len:265},
    {id:"gpu_54",name:"Gigabyte Gaming OC RTX 4060",brand:"Gigabyte",model:"RTX 4060",variantLabel:"Gigabyte Gaming OC",price:280,perf:29,vram:8,tdp:115,len:270},
    {id:"gpu_55",name:"PNY Verto RTX 4060 Ti 8GB",brand:"PNY",model:"RTX 4060 Ti 8GB",variantLabel:"PNY Verto",price:335,perf:32,vram:8,tdp:160,len:245},
    {id:"gpu_56",name:"Zotac Twin Edge RTX 4060 Ti 8GB",brand:"Zotac",model:"RTX 4060 Ti 8GB",variantLabel:"Zotac Twin Edge",price:340,perf:32,vram:8,tdp:160,len:250},
    {id:"gpu_57",name:"Gigabyte Windforce RTX 4060 Ti 8GB",brand:"Gigabyte",model:"RTX 4060 Ti 8GB",variantLabel:"Gigabyte Windforce",price:350,perf:32,vram:8,tdp:160,len:260},
    {id:"gpu_58",name:"MSI Ventus 2X RTX 4060 Ti 8GB",brand:"MSI",model:"RTX 4060 Ti 8GB",variantLabel:"MSI Ventus 2X",price:355,perf:32,vram:8,tdp:160,len:255},
    {id:"gpu_59",name:"ASUS Dual RTX 4060 Ti 8GB",brand:"ASUS",model:"RTX 4060 Ti 8GB",variantLabel:"ASUS Dual",price:355,perf:32,vram:8,tdp:160,len:257},
    {id:"gpu_60",name:"Gigabyte Eagle RTX 4060 Ti 8GB",brand:"Gigabyte",model:"RTX 4060 Ti 8GB",variantLabel:"Gigabyte Eagle",price:360,perf:32,vram:8,tdp:160,len:260},
    {id:"gpu_61",name:"MSI Ventus 3X RTX 4060 Ti 8GB",brand:"MSI",model:"RTX 4060 Ti 8GB",variantLabel:"MSI Ventus 3X",price:365,perf:32,vram:8,tdp:160,len:265},
    {id:"gpu_62",name:"PNY Verto RTX 4060 Ti 16GB",brand:"PNY",model:"RTX 4060 Ti 16GB",variantLabel:"PNY Verto",price:375,perf:33,vram:16,tdp:165,len:250},
    {id:"gpu_63",name:"Zotac Twin Edge RTX 4060 Ti 16GB",brand:"Zotac",model:"RTX 4060 Ti 16GB",variantLabel:"Zotac Twin Edge",price:385,perf:33,vram:16,tdp:165,len:255},
    {id:"gpu_64",name:"Gigabyte Windforce RTX 4060 Ti 16GB",brand:"Gigabyte",model:"RTX 4060 Ti 16GB",variantLabel:"Gigabyte Windforce",price:385,perf:33,vram:16,tdp:165,len:265},
    {id:"gpu_65",name:"MSI Ventus 2X RTX 4060 Ti 16GB",brand:"MSI",model:"RTX 4060 Ti 16GB",variantLabel:"MSI Ventus 2X",price:390,perf:33,vram:16,tdp:165,len:260},
    {id:"gpu_66",name:"ASUS Dual RTX 4060 Ti 16GB",brand:"ASUS",model:"RTX 4060 Ti 16GB",variantLabel:"ASUS Dual",price:395,perf:33,vram:16,tdp:165,len:262},
    {id:"gpu_67",name:"Gigabyte Eagle RTX 4060 Ti 16GB",brand:"Gigabyte",model:"RTX 4060 Ti 16GB",variantLabel:"Gigabyte Eagle",price:400,perf:33,vram:16,tdp:165,len:265},
    {id:"gpu_68",name:"MSI Ventus 3X RTX 4060 Ti 16GB",brand:"MSI",model:"RTX 4060 Ti 16GB",variantLabel:"MSI Ventus 3X",price:405,perf:33,vram:16,tdp:165,len:270},
    {id:"gpu_69",name:"PNY Verto RTX 4070 Super",brand:"PNY",model:"RTX 4070 Super",variantLabel:"PNY Verto",price:500,perf:47,vram:12,tdp:220,len:285},
    {id:"gpu_70",name:"Zotac Twin Edge RTX 4070 Super",brand:"Zotac",model:"RTX 4070 Super",variantLabel:"Zotac Twin Edge",price:505,perf:47,vram:12,tdp:220,len:290},
    {id:"gpu_71",name:"Gigabyte Windforce RTX 4070 Super",brand:"Gigabyte",model:"RTX 4070 Super",variantLabel:"Gigabyte Windforce",price:520,perf:47,vram:12,tdp:220,len:300},
    {id:"gpu_72",name:"MSI Ventus 2X RTX 4070 Super",brand:"MSI",model:"RTX 4070 Super",variantLabel:"MSI Ventus 2X",price:525,perf:47,vram:12,tdp:220,len:295},
    {id:"gpu_73",name:"ASUS Dual RTX 4070 Super",brand:"ASUS",model:"RTX 4070 Super",variantLabel:"ASUS Dual",price:525,perf:47,vram:12,tdp:220,len:297},
    {id:"gpu_74",name:"Gigabyte Eagle RTX 4070 Super",brand:"Gigabyte",model:"RTX 4070 Super",variantLabel:"Gigabyte Eagle",price:530,perf:47,vram:12,tdp:220,len:300},
    {id:"gpu_75",name:"MSI Ventus 3X RTX 4070 Super",brand:"MSI",model:"RTX 4070 Super",variantLabel:"MSI Ventus 3X",price:540,perf:47,vram:12,tdp:220,len:305},
    {id:"gpu_76",name:"Gigabyte Gaming OC RTX 4070 Super",brand:"Gigabyte",model:"RTX 4070 Super",variantLabel:"Gigabyte Gaming OC",price:550,perf:47,vram:12,tdp:220,len:310},
    {id:"gpu_77",name:"PNY Verto RTX 4070 Ti Super",brand:"PNY",model:"RTX 4070 Ti Super",variantLabel:"PNY Verto",price:705,perf:56,vram:16,tdp:285,len:305},
    {id:"gpu_78",name:"Zotac Twin Edge RTX 4070 Ti Super",brand:"Zotac",model:"RTX 4070 Ti Super",variantLabel:"Zotac Twin Edge",price:715,perf:56,vram:16,tdp:285,len:310},
    {id:"gpu_79",name:"Gigabyte Windforce RTX 4070 Ti Super",brand:"Gigabyte",model:"RTX 4070 Ti Super",variantLabel:"Gigabyte Windforce",price:730,perf:56,vram:16,tdp:285,len:320},
    {id:"gpu_80",name:"MSI Ventus 2X RTX 4070 Ti Super",brand:"MSI",model:"RTX 4070 Ti Super",variantLabel:"MSI Ventus 2X",price:740,perf:56,vram:16,tdp:285,len:315},
    {id:"gpu_81",name:"ASUS Dual RTX 4070 Ti Super",brand:"ASUS",model:"RTX 4070 Ti Super",variantLabel:"ASUS Dual",price:750,perf:56,vram:16,tdp:285,len:317},
    {id:"gpu_82",name:"Gigabyte Eagle RTX 4070 Ti Super",brand:"Gigabyte",model:"RTX 4070 Ti Super",variantLabel:"Gigabyte Eagle",price:750,perf:56,vram:16,tdp:285,len:320},
    {id:"gpu_83",name:"MSI Ventus 3X RTX 4070 Ti Super",brand:"MSI",model:"RTX 4070 Ti Super",variantLabel:"MSI Ventus 3X",price:760,perf:56,vram:16,tdp:285,len:325},
    {id:"gpu_84",name:"PNY Verto RTX 5050",brand:"PNY",model:"RTX 5050",variantLabel:"PNY Verto",price:255,perf:22,vram:8,tdp:130,len:244},
    {id:"gpu_85",name:"Zotac Twin Edge RTX 5050",brand:"Zotac",model:"RTX 5050",variantLabel:"Zotac Twin Edge",price:260,perf:22,vram:8,tdp:130,len:249},
    {id:"gpu_86",name:"Gigabyte Windforce RTX 5050",brand:"Gigabyte",model:"RTX 5050",variantLabel:"Gigabyte Windforce",price:265,perf:22,vram:8,tdp:130,len:259},
    {id:"gpu_87",name:"MSI Ventus 2X RTX 5050",brand:"MSI",model:"RTX 5050",variantLabel:"MSI Ventus 2X",price:270,perf:22,vram:8,tdp:130,len:254},
    {id:"gpu_88",name:"ASUS Dual RTX 5050",brand:"ASUS",model:"RTX 5050",variantLabel:"ASUS Dual",price:270,perf:22,vram:8,tdp:130,len:256},
    {id:"gpu_89",name:"Gigabyte Eagle RTX 5050",brand:"Gigabyte",model:"RTX 5050",variantLabel:"Gigabyte Eagle",price:275,perf:22,vram:8,tdp:130,len:259},
    {id:"gpu_90",name:"PNY Verto RTX 5060",brand:"PNY",model:"RTX 5060",variantLabel:"PNY Verto",price:300,perf:30,vram:8,tdp:145,len:245},
    {id:"gpu_91",name:"Zotac Twin Edge RTX 5060",brand:"Zotac",model:"RTX 5060",variantLabel:"Zotac Twin Edge",price:305,perf:30,vram:8,tdp:145,len:250},
    {id:"gpu_92",name:"Gigabyte Windforce RTX 5060",brand:"Gigabyte",model:"RTX 5060",variantLabel:"Gigabyte Windforce",price:310,perf:30,vram:8,tdp:145,len:260},
    {id:"gpu_93",name:"MSI Ventus 2X RTX 5060",brand:"MSI",model:"RTX 5060",variantLabel:"MSI Ventus 2X",price:315,perf:30,vram:8,tdp:145,len:255},
    {id:"gpu_94",name:"ASUS Dual RTX 5060",brand:"ASUS",model:"RTX 5060",variantLabel:"ASUS Dual",price:320,perf:30,vram:8,tdp:145,len:257},
    {id:"gpu_95",name:"Gigabyte Eagle RTX 5060",brand:"Gigabyte",model:"RTX 5060",variantLabel:"Gigabyte Eagle",price:320,perf:30,vram:8,tdp:145,len:260},
    {id:"gpu_96",name:"MSI Ventus 3X RTX 5060",brand:"MSI",model:"RTX 5060",variantLabel:"MSI Ventus 3X",price:325,perf:30,vram:8,tdp:145,len:265},
    {id:"gpu_97",name:"Gigabyte Gaming OC RTX 5060",brand:"Gigabyte",model:"RTX 5060",variantLabel:"Gigabyte Gaming OC",price:330,perf:30,vram:8,tdp:145,len:270},
    {id:"gpu_98",name:"Zotac Trinity RTX 5060",brand:"Zotac",model:"RTX 5060",variantLabel:"Zotac Trinity",price:335,perf:30,vram:8,tdp:145,len:270},
    {id:"gpu_99",name:"MSI Gaming Trio RTX 5060",brand:"MSI",model:"RTX 5060",variantLabel:"MSI Gaming Trio",price:340,perf:30,vram:8,tdp:145,len:275},
    {id:"gpu_100",name:"PNY Verto RTX 5060 Ti 8GB",brand:"PNY",model:"RTX 5060 Ti 8GB",variantLabel:"PNY Verto",price:370,perf:33,vram:8,tdp:180,len:245},
    {id:"gpu_101",name:"Zotac Twin Edge RTX 5060 Ti 8GB",brand:"Zotac",model:"RTX 5060 Ti 8GB",variantLabel:"Zotac Twin Edge",price:380,perf:33,vram:8,tdp:180,len:250},
    {id:"gpu_102",name:"Gigabyte Windforce RTX 5060 Ti 8GB",brand:"Gigabyte",model:"RTX 5060 Ti 8GB",variantLabel:"Gigabyte Windforce",price:385,perf:33,vram:8,tdp:180,len:260},
    {id:"gpu_103",name:"MSI Ventus 2X RTX 5060 Ti 8GB",brand:"MSI",model:"RTX 5060 Ti 8GB",variantLabel:"MSI Ventus 2X",price:390,perf:33,vram:8,tdp:180,len:255},
    {id:"gpu_104",name:"ASUS Dual RTX 5060 Ti 8GB",brand:"ASUS",model:"RTX 5060 Ti 8GB",variantLabel:"ASUS Dual",price:395,perf:33,vram:8,tdp:180,len:257},
    {id:"gpu_105",name:"Gigabyte Eagle RTX 5060 Ti 8GB",brand:"Gigabyte",model:"RTX 5060 Ti 8GB",variantLabel:"Gigabyte Eagle",price:395,perf:33,vram:8,tdp:180,len:260},
    {id:"gpu_106",name:"MSI Ventus 3X RTX 5060 Ti 8GB",brand:"MSI",model:"RTX 5060 Ti 8GB",variantLabel:"MSI Ventus 3X",price:400,perf:33,vram:8,tdp:180,len:265},
    {id:"gpu_107",name:"Gigabyte Gaming OC RTX 5060 Ti 8GB",brand:"Gigabyte",model:"RTX 5060 Ti 8GB",variantLabel:"Gigabyte Gaming OC",price:405,perf:33,vram:8,tdp:180,len:270},
    {id:"gpu_108",name:"PNY Verto RTX 5060 Ti 16GB",brand:"PNY",model:"RTX 5060 Ti 16GB",variantLabel:"PNY Verto",price:555,perf:35,vram:16,tdp:180,len:250},
    {id:"gpu_109",name:"Zotac Twin Edge RTX 5060 Ti 16GB",brand:"Zotac",model:"RTX 5060 Ti 16GB",variantLabel:"Zotac Twin Edge",price:570,perf:35,vram:16,tdp:180,len:255},
    {id:"gpu_110",name:"Gigabyte Windforce RTX 5060 Ti 16GB",brand:"Gigabyte",model:"RTX 5060 Ti 16GB",variantLabel:"Gigabyte Windforce",price:575,perf:35,vram:16,tdp:180,len:265},
    {id:"gpu_111",name:"MSI Ventus 2X RTX 5060 Ti 16GB",brand:"MSI",model:"RTX 5060 Ti 16GB",variantLabel:"MSI Ventus 2X",price:580,perf:35,vram:16,tdp:180,len:260},
    {id:"gpu_112",name:"ASUS Dual RTX 5060 Ti 16GB",brand:"ASUS",model:"RTX 5060 Ti 16GB",variantLabel:"ASUS Dual",price:585,perf:35,vram:16,tdp:180,len:262},
    {id:"gpu_113",name:"Gigabyte Eagle RTX 5060 Ti 16GB",brand:"Gigabyte",model:"RTX 5060 Ti 16GB",variantLabel:"Gigabyte Eagle",price:595,perf:35,vram:16,tdp:180,len:265},
    {id:"gpu_114",name:"MSI Ventus 3X RTX 5060 Ti 16GB",brand:"MSI",model:"RTX 5060 Ti 16GB",variantLabel:"MSI Ventus 3X",price:600,perf:35,vram:16,tdp:180,len:270},
    {id:"gpu_115",name:"Gigabyte Gaming OC RTX 5060 Ti 16GB",brand:"Gigabyte",model:"RTX 5060 Ti 16GB",variantLabel:"Gigabyte Gaming OC",price:615,perf:35,vram:16,tdp:180,len:275},
    {id:"gpu_116",name:"Zotac Trinity RTX 5060 Ti 16GB",brand:"Zotac",model:"RTX 5060 Ti 16GB",variantLabel:"Zotac Trinity",price:615,perf:35,vram:16,tdp:180,len:275},
    {id:"gpu_117",name:"MSI Gaming Trio RTX 5060 Ti 16GB",brand:"MSI",model:"RTX 5060 Ti 16GB",variantLabel:"MSI Gaming Trio",price:625,perf:35,vram:16,tdp:180,len:280},
    {id:"gpu_118",name:"PNY Verto RTX 5070",brand:"PNY",model:"RTX 5070",variantLabel:"PNY Verto",price:615,perf:43,vram:12,tdp:250,len:280},
    {id:"gpu_119",name:"Zotac Twin Edge RTX 5070",brand:"Zotac",model:"RTX 5070",variantLabel:"Zotac Twin Edge",price:630,perf:43,vram:12,tdp:250,len:285},
    {id:"gpu_120",name:"Gigabyte Windforce RTX 5070",brand:"Gigabyte",model:"RTX 5070",variantLabel:"Gigabyte Windforce",price:640,perf:43,vram:12,tdp:250,len:295},
    {id:"gpu_121",name:"MSI Ventus 2X RTX 5070",brand:"MSI",model:"RTX 5070",variantLabel:"MSI Ventus 2X",price:645,perf:43,vram:12,tdp:250,len:290},
    {id:"gpu_122",name:"ASUS Dual RTX 5070",brand:"ASUS",model:"RTX 5070",variantLabel:"ASUS Dual",price:655,perf:43,vram:12,tdp:250,len:292},
    {id:"gpu_123",name:"Gigabyte Eagle RTX 5070",brand:"Gigabyte",model:"RTX 5070",variantLabel:"Gigabyte Eagle",price:660,perf:43,vram:12,tdp:250,len:295},
    {id:"gpu_124",name:"MSI Ventus 3X RTX 5070",brand:"MSI",model:"RTX 5070",variantLabel:"MSI Ventus 3X",price:665,perf:43,vram:12,tdp:250,len:300},
    {id:"gpu_125",name:"Gigabyte Gaming OC RTX 5070",brand:"Gigabyte",model:"RTX 5070",variantLabel:"Gigabyte Gaming OC",price:680,perf:43,vram:12,tdp:250,len:305},
    {id:"gpu_126",name:"Zotac Trinity RTX 5070",brand:"Zotac",model:"RTX 5070",variantLabel:"Zotac Trinity",price:685,perf:43,vram:12,tdp:250,len:305},
    {id:"gpu_127",name:"MSI Gaming Trio RTX 5070",brand:"MSI",model:"RTX 5070",variantLabel:"MSI Gaming Trio",price:700,perf:43,vram:12,tdp:250,len:310},
    {id:"gpu_128",name:"ASUS TUF OC RTX 5070",brand:"ASUS",model:"RTX 5070",variantLabel:"ASUS TUF OC",price:710,perf:43,vram:12,tdp:250,len:315},
    {id:"gpu_129",name:"ASUS ROG Strix RTX 5070",brand:"ASUS",model:"RTX 5070",variantLabel:"ASUS ROG Strix",price:750,perf:43,vram:12,tdp:250,len:320},
    {id:"gpu_130",name:"PNY Verto RTX 5070 Ti",brand:"PNY",model:"RTX 5070 Ti",variantLabel:"PNY Verto",price:940,perf:57,vram:16,tdp:300,len:300},
    {id:"gpu_131",name:"Zotac Twin Edge RTX 5070 Ti",brand:"Zotac",model:"RTX 5070 Ti",variantLabel:"Zotac Twin Edge",price:960,perf:57,vram:16,tdp:300,len:305},
    {id:"gpu_132",name:"Gigabyte Windforce RTX 5070 Ti",brand:"Gigabyte",model:"RTX 5070 Ti",variantLabel:"Gigabyte Windforce",price:980,perf:57,vram:16,tdp:300,len:315},
    {id:"gpu_133",name:"MSI Ventus 2X RTX 5070 Ti",brand:"MSI",model:"RTX 5070 Ti",variantLabel:"MSI Ventus 2X",price:985,perf:57,vram:16,tdp:300,len:310},
    {id:"gpu_134",name:"ASUS Dual RTX 5070 Ti",brand:"ASUS",model:"RTX 5070 Ti",variantLabel:"ASUS Dual",price:995,perf:57,vram:16,tdp:300,len:312},
    {id:"gpu_135",name:"Gigabyte Eagle RTX 5070 Ti",brand:"Gigabyte",model:"RTX 5070 Ti",variantLabel:"Gigabyte Eagle",price:1005,perf:57,vram:16,tdp:300,len:315},
    {id:"gpu_136",name:"MSI Ventus 3X RTX 5070 Ti",brand:"MSI",model:"RTX 5070 Ti",variantLabel:"MSI Ventus 3X",price:1015,perf:57,vram:16,tdp:300,len:320},
    {id:"gpu_137",name:"Gigabyte Gaming OC RTX 5070 Ti",brand:"Gigabyte",model:"RTX 5070 Ti",variantLabel:"Gigabyte Gaming OC",price:1035,perf:57,vram:16,tdp:300,len:325},
    {id:"gpu_138",name:"Zotac Trinity RTX 5070 Ti",brand:"Zotac",model:"RTX 5070 Ti",variantLabel:"Zotac Trinity",price:1045,perf:57,vram:16,tdp:300,len:325},
    {id:"gpu_139",name:"MSI Gaming Trio RTX 5070 Ti",brand:"MSI",model:"RTX 5070 Ti",variantLabel:"MSI Gaming Trio",price:1060,perf:57,vram:16,tdp:300,len:330},
    {id:"gpu_140",name:"PNY Verto RTX 5080",brand:"PNY",model:"RTX 5080",variantLabel:"PNY Verto",price:1090,perf:72,vram:16,tdp:360,len:330},
    {id:"gpu_141",name:"Zotac Twin Edge RTX 5080",brand:"Zotac",model:"RTX 5080",variantLabel:"Zotac Twin Edge",price:1110,perf:72,vram:16,tdp:360,len:335},
    {id:"gpu_142",name:"Gigabyte Windforce RTX 5080",brand:"Gigabyte",model:"RTX 5080",variantLabel:"Gigabyte Windforce",price:1130,perf:72,vram:16,tdp:360,len:345},
    {id:"gpu_143",name:"MSI Ventus 2X RTX 5080",brand:"MSI",model:"RTX 5080",variantLabel:"MSI Ventus 2X",price:1145,perf:72,vram:16,tdp:360,len:340},
    {id:"gpu_144",name:"ASUS Dual RTX 5080",brand:"ASUS",model:"RTX 5080",variantLabel:"ASUS Dual",price:1155,perf:72,vram:16,tdp:360,len:342},
    {id:"gpu_145",name:"Gigabyte Eagle RTX 5080",brand:"Gigabyte",model:"RTX 5080",variantLabel:"Gigabyte Eagle",price:1165,perf:72,vram:16,tdp:360,len:345},
    {id:"gpu_146",name:"MSI Ventus 3X RTX 5080",brand:"MSI",model:"RTX 5080",variantLabel:"MSI Ventus 3X",price:1175,perf:72,vram:16,tdp:360,len:350},
    {id:"gpu_147",name:"Gigabyte Gaming OC RTX 5080",brand:"Gigabyte",model:"RTX 5080",variantLabel:"Gigabyte Gaming OC",price:1195,perf:72,vram:16,tdp:360,len:355},
    {id:"gpu_148",name:"Zotac Trinity RTX 5080",brand:"Zotac",model:"RTX 5080",variantLabel:"Zotac Trinity",price:1210,perf:72,vram:16,tdp:360,len:355},
    {id:"gpu_149",name:"PNY Verto RTX 5090",brand:"PNY",model:"RTX 5090",variantLabel:"PNY Verto",price:2430,perf:100,vram:32,tdp:575,len:358},
    {id:"gpu_150",name:"Zotac Twin Edge RTX 5090",brand:"Zotac",model:"RTX 5090",variantLabel:"Zotac Twin Edge",price:2480,perf:100,vram:32,tdp:575,len:363},
    {id:"gpu_151",name:"Gigabyte Windforce RTX 5090",brand:"Gigabyte",model:"RTX 5090",variantLabel:"Gigabyte Windforce",price:2525,perf:100,vram:32,tdp:575,len:373},
    {id:"gpu_152",name:"MSI Ventus 2X RTX 5090",brand:"MSI",model:"RTX 5090",variantLabel:"MSI Ventus 2X",price:2550,perf:100,vram:32,tdp:575,len:368},
    {id:"gpu_153",name:"ASUS Dual RTX 5090",brand:"ASUS",model:"RTX 5090",variantLabel:"ASUS Dual",price:2575,perf:100,vram:32,tdp:575,len:370},
    {id:"gpu_154",name:"Gigabyte Eagle RTX 5090",brand:"Gigabyte",model:"RTX 5090",variantLabel:"Gigabyte Eagle",price:2600,perf:100,vram:32,tdp:575,len:373},
    {id:"gpu_155",name:"PowerColor Reaper RX 7600",brand:"PowerColor",model:"RX 7600",variantLabel:"PowerColor Reaper",price:225,perf:27,vram:8,tdp:165,len:245},
    {id:"gpu_156",name:"XFX Swift RX 7600",brand:"XFX",model:"RX 7600",variantLabel:"XFX Swift",price:230,perf:27,vram:8,tdp:165,len:250},
    {id:"gpu_157",name:"ASRock Challenger RX 7600",brand:"ASRock",model:"RX 7600",variantLabel:"ASRock Challenger",price:230,perf:27,vram:8,tdp:165,len:253},
    {id:"gpu_158",name:"Acer Nitro RX 7600",brand:"Acer",model:"RX 7600",variantLabel:"Acer Nitro",price:235,perf:27,vram:8,tdp:165,len:255},
    {id:"gpu_159",name:"Gigabyte Gaming OC RX 7600",brand:"Gigabyte",model:"RX 7600",variantLabel:"Gigabyte Gaming OC",price:235,perf:27,vram:8,tdp:165,len:260},
    {id:"gpu_160",name:"Sapphire Pulse RX 7600",brand:"Sapphire",model:"RX 7600",variantLabel:"Sapphire Pulse",price:240,perf:27,vram:8,tdp:165,len:257},
    {id:"gpu_161",name:"PowerColor Reaper RX 7600 XT",brand:"PowerColor",model:"RX 7600 XT",variantLabel:"PowerColor Reaper",price:285,perf:28,vram:16,tdp:190,len:250},
    {id:"gpu_162",name:"XFX Swift RX 7600 XT",brand:"XFX",model:"RX 7600 XT",variantLabel:"XFX Swift",price:290,perf:28,vram:16,tdp:190,len:255},
    {id:"gpu_163",name:"ASRock Challenger RX 7600 XT",brand:"ASRock",model:"RX 7600 XT",variantLabel:"ASRock Challenger",price:300,perf:28,vram:16,tdp:190,len:258},
    {id:"gpu_164",name:"Acer Nitro RX 7600 XT",brand:"Acer",model:"RX 7600 XT",variantLabel:"Acer Nitro",price:300,perf:28,vram:16,tdp:190,len:260},
    {id:"gpu_165",name:"Gigabyte Gaming OC RX 7600 XT",brand:"Gigabyte",model:"RX 7600 XT",variantLabel:"Gigabyte Gaming OC",price:305,perf:28,vram:16,tdp:190,len:265},
    {id:"gpu_166",name:"Sapphire Pulse RX 7600 XT",brand:"Sapphire",model:"RX 7600 XT",variantLabel:"Sapphire Pulse",price:310,perf:28,vram:16,tdp:190,len:262},
    {id:"gpu_167",name:"PowerColor Reaper RX 7700 XT",brand:"PowerColor",model:"RX 7700 XT",variantLabel:"PowerColor Reaper",price:355,perf:37,vram:12,tdp:245,len:280},
    {id:"gpu_168",name:"XFX Swift RX 7700 XT",brand:"XFX",model:"RX 7700 XT",variantLabel:"XFX Swift",price:365,perf:37,vram:12,tdp:245,len:285},
    {id:"gpu_169",name:"ASRock Challenger RX 7700 XT",brand:"ASRock",model:"RX 7700 XT",variantLabel:"ASRock Challenger",price:370,perf:37,vram:12,tdp:245,len:288},
    {id:"gpu_170",name:"Acer Nitro RX 7700 XT",brand:"Acer",model:"RX 7700 XT",variantLabel:"Acer Nitro",price:375,perf:37,vram:12,tdp:245,len:290},
    {id:"gpu_171",name:"Gigabyte Gaming OC RX 7700 XT",brand:"Gigabyte",model:"RX 7700 XT",variantLabel:"Gigabyte Gaming OC",price:380,perf:37,vram:12,tdp:245,len:295},
    {id:"gpu_172",name:"Sapphire Pulse RX 7700 XT",brand:"Sapphire",model:"RX 7700 XT",variantLabel:"Sapphire Pulse",price:380,perf:37,vram:12,tdp:245,len:292},
    {id:"gpu_173",name:"PowerColor Hellhound RX 7700 XT",brand:"PowerColor",model:"RX 7700 XT",variantLabel:"PowerColor Hellhound",price:395,perf:37,vram:12,tdp:245,len:300},
    {id:"gpu_174",name:"PowerColor Reaper RX 7800 XT",brand:"PowerColor",model:"RX 7800 XT",variantLabel:"PowerColor Reaper",price:395,perf:42,vram:16,tdp:263,len:285},
    {id:"gpu_175",name:"XFX Swift RX 7800 XT",brand:"XFX",model:"RX 7800 XT",variantLabel:"XFX Swift",price:405,perf:42,vram:16,tdp:263,len:290},
    {id:"gpu_176",name:"ASRock Challenger RX 7800 XT",brand:"ASRock",model:"RX 7800 XT",variantLabel:"ASRock Challenger",price:410,perf:42,vram:16,tdp:263,len:293},
    {id:"gpu_177",name:"Acer Nitro RX 7800 XT",brand:"Acer",model:"RX 7800 XT",variantLabel:"Acer Nitro",price:415,perf:42,vram:16,tdp:263,len:295},
    {id:"gpu_178",name:"Gigabyte Gaming OC RX 7800 XT",brand:"Gigabyte",model:"RX 7800 XT",variantLabel:"Gigabyte Gaming OC",price:420,perf:42,vram:16,tdp:263,len:300},
    {id:"gpu_179",name:"Sapphire Pulse RX 7800 XT",brand:"Sapphire",model:"RX 7800 XT",variantLabel:"Sapphire Pulse",price:425,perf:42,vram:16,tdp:263,len:297},
    {id:"gpu_180",name:"PowerColor Hellhound RX 7800 XT",brand:"PowerColor",model:"RX 7800 XT",variantLabel:"PowerColor Hellhound",price:435,perf:42,vram:16,tdp:263,len:305},
    {id:"gpu_181",name:"XFX Merc 310 RX 7800 XT",brand:"XFX",model:"RX 7800 XT",variantLabel:"XFX Merc 310",price:450,perf:42,vram:16,tdp:263,len:315},
    {id:"gpu_182",name:"PowerColor Reaper RX 7900 GRE",brand:"PowerColor",model:"RX 7900 GRE",variantLabel:"PowerColor Reaper",price:455,perf:45,vram:16,tdp:260,len:285},
    {id:"gpu_183",name:"XFX Swift RX 7900 GRE",brand:"XFX",model:"RX 7900 GRE",variantLabel:"XFX Swift",price:465,perf:45,vram:16,tdp:260,len:290},
    {id:"gpu_184",name:"ASRock Challenger RX 7900 GRE",brand:"ASRock",model:"RX 7900 GRE",variantLabel:"ASRock Challenger",price:475,perf:45,vram:16,tdp:260,len:293},
    {id:"gpu_185",name:"Acer Nitro RX 7900 GRE",brand:"Acer",model:"RX 7900 GRE",variantLabel:"Acer Nitro",price:480,perf:45,vram:16,tdp:260,len:295},
    {id:"gpu_186",name:"Gigabyte Gaming OC RX 7900 GRE",brand:"Gigabyte",model:"RX 7900 GRE",variantLabel:"Gigabyte Gaming OC",price:485,perf:45,vram:16,tdp:260,len:300},
    {id:"gpu_187",name:"Sapphire Pulse RX 7900 GRE",brand:"Sapphire",model:"RX 7900 GRE",variantLabel:"Sapphire Pulse",price:490,perf:45,vram:16,tdp:260,len:297},
    {id:"gpu_188",name:"PowerColor Reaper RX 7900 XT",brand:"PowerColor",model:"RX 7900 XT",variantLabel:"PowerColor Reaper",price:560,perf:48,vram:20,tdp:315,len:300},
    {id:"gpu_189",name:"XFX Swift RX 7900 XT",brand:"XFX",model:"RX 7900 XT",variantLabel:"XFX Swift",price:570,perf:48,vram:20,tdp:315,len:305},
    {id:"gpu_190",name:"ASRock Challenger RX 7900 XT",brand:"ASRock",model:"RX 7900 XT",variantLabel:"ASRock Challenger",price:580,perf:48,vram:20,tdp:315,len:308},
    {id:"gpu_191",name:"Acer Nitro RX 7900 XT",brand:"Acer",model:"RX 7900 XT",variantLabel:"Acer Nitro",price:585,perf:48,vram:20,tdp:315,len:310},
    {id:"gpu_192",name:"Gigabyte Gaming OC RX 7900 XT",brand:"Gigabyte",model:"RX 7900 XT",variantLabel:"Gigabyte Gaming OC",price:590,perf:48,vram:20,tdp:315,len:315},
    {id:"gpu_193",name:"Sapphire Pulse RX 7900 XT",brand:"Sapphire",model:"RX 7900 XT",variantLabel:"Sapphire Pulse",price:600,perf:48,vram:20,tdp:315,len:312},
    {id:"gpu_194",name:"PowerColor Hellhound RX 7900 XT",brand:"PowerColor",model:"RX 7900 XT",variantLabel:"PowerColor Hellhound",price:615,perf:48,vram:20,tdp:315,len:320},
    {id:"gpu_195",name:"PowerColor Reaper RX 7900 XTX",brand:"PowerColor",model:"RX 7900 XTX",variantLabel:"PowerColor Reaper",price:695,perf:58,vram:24,tdp:355,len:320},
    {id:"gpu_196",name:"XFX Swift RX 7900 XTX",brand:"XFX",model:"RX 7900 XTX",variantLabel:"XFX Swift",price:710,perf:58,vram:24,tdp:355,len:325},
    {id:"gpu_197",name:"ASRock Challenger RX 7900 XTX",brand:"ASRock",model:"RX 7900 XTX",variantLabel:"ASRock Challenger",price:720,perf:58,vram:24,tdp:355,len:328},
    {id:"gpu_198",name:"Acer Nitro RX 7900 XTX",brand:"Acer",model:"RX 7900 XTX",variantLabel:"Acer Nitro",price:730,perf:58,vram:24,tdp:355,len:330},
    {id:"gpu_199",name:"Gigabyte Gaming OC RX 7900 XTX",brand:"Gigabyte",model:"RX 7900 XTX",variantLabel:"Gigabyte Gaming OC",price:735,perf:58,vram:24,tdp:355,len:335},
    {id:"gpu_200",name:"Sapphire Pulse RX 7900 XTX",brand:"Sapphire",model:"RX 7900 XTX",variantLabel:"Sapphire Pulse",price:745,perf:58,vram:24,tdp:355,len:332},
    {id:"gpu_201",name:"PowerColor Hellhound RX 7900 XTX",brand:"PowerColor",model:"RX 7900 XTX",variantLabel:"PowerColor Hellhound",price:760,perf:58,vram:24,tdp:355,len:340},
    {id:"gpu_202",name:"PowerColor Reaper RX 9060 XT 8GB",brand:"PowerColor",model:"RX 9060 XT 8GB",variantLabel:"PowerColor Reaper",price:320,perf:35,vram:8,tdp:150,len:240},
    {id:"gpu_203",name:"XFX Swift RX 9060 XT 8GB",brand:"XFX",model:"RX 9060 XT 8GB",variantLabel:"XFX Swift",price:325,perf:35,vram:8,tdp:150,len:245},
    {id:"gpu_204",name:"ASRock Challenger RX 9060 XT 8GB",brand:"ASRock",model:"RX 9060 XT 8GB",variantLabel:"ASRock Challenger",price:335,perf:35,vram:8,tdp:150,len:248},
    {id:"gpu_205",name:"Acer Nitro RX 9060 XT 8GB",brand:"Acer",model:"RX 9060 XT 8GB",variantLabel:"Acer Nitro",price:335,perf:35,vram:8,tdp:150,len:250},
    {id:"gpu_206",name:"Gigabyte Gaming OC RX 9060 XT 8GB",brand:"Gigabyte",model:"RX 9060 XT 8GB",variantLabel:"Gigabyte Gaming OC",price:340,perf:35,vram:8,tdp:150,len:255},
    {id:"gpu_207",name:"Sapphire Pulse RX 9060 XT 8GB",brand:"Sapphire",model:"RX 9060 XT 8GB",variantLabel:"Sapphire Pulse",price:345,perf:35,vram:8,tdp:150,len:252},
    {id:"gpu_208",name:"PowerColor Reaper RX 9060 XT 16GB",brand:"PowerColor",model:"RX 9060 XT 16GB",variantLabel:"PowerColor Reaper",price:350,perf:37,vram:16,tdp:160,len:245},
    {id:"gpu_209",name:"XFX Swift RX 9060 XT 16GB",brand:"XFX",model:"RX 9060 XT 16GB",variantLabel:"XFX Swift",price:355,perf:37,vram:16,tdp:160,len:250},
    {id:"gpu_210",name:"ASRock Challenger RX 9060 XT 16GB",brand:"ASRock",model:"RX 9060 XT 16GB",variantLabel:"ASRock Challenger",price:365,perf:37,vram:16,tdp:160,len:253},
    {id:"gpu_211",name:"Acer Nitro RX 9060 XT 16GB",brand:"Acer",model:"RX 9060 XT 16GB",variantLabel:"Acer Nitro",price:370,perf:37,vram:16,tdp:160,len:255},
    {id:"gpu_212",name:"Gigabyte Gaming OC RX 9060 XT 16GB",brand:"Gigabyte",model:"RX 9060 XT 16GB",variantLabel:"Gigabyte Gaming OC",price:370,perf:37,vram:16,tdp:160,len:260},
    {id:"gpu_213",name:"Sapphire Pulse RX 9060 XT 16GB",brand:"Sapphire",model:"RX 9060 XT 16GB",variantLabel:"Sapphire Pulse",price:375,perf:37,vram:16,tdp:160,len:257},
    {id:"gpu_214",name:"PowerColor Hellhound RX 9060 XT 16GB",brand:"PowerColor",model:"RX 9060 XT 16GB",variantLabel:"PowerColor Hellhound",price:385,perf:37,vram:16,tdp:160,len:265},
    {id:"gpu_215",name:"XFX Merc 310 RX 9060 XT 16GB",brand:"XFX",model:"RX 9060 XT 16GB",variantLabel:"XFX Merc 310",price:400,perf:37,vram:16,tdp:160,len:275},
    {id:"gpu_216",name:"ASUS TUF OC RX 9060 XT 16GB",brand:"ASUS",model:"RX 9060 XT 16GB",variantLabel:"ASUS TUF OC",price:405,perf:37,vram:16,tdp:160,len:275},
    {id:"gpu_217",name:"PowerColor Reaper RX 9070",brand:"PowerColor",model:"RX 9070",variantLabel:"PowerColor Reaper",price:500,perf:49,vram:16,tdp:220,len:280},
    {id:"gpu_218",name:"XFX Swift RX 9070",brand:"XFX",model:"RX 9070",variantLabel:"XFX Swift",price:505,perf:49,vram:16,tdp:220,len:285},
    {id:"gpu_219",name:"ASRock Challenger RX 9070",brand:"ASRock",model:"RX 9070",variantLabel:"ASRock Challenger",price:520,perf:49,vram:16,tdp:220,len:288},
    {id:"gpu_220",name:"Acer Nitro RX 9070",brand:"Acer",model:"RX 9070",variantLabel:"Acer Nitro",price:525,perf:49,vram:16,tdp:220,len:290},
    {id:"gpu_221",name:"Gigabyte Gaming OC RX 9070",brand:"Gigabyte",model:"RX 9070",variantLabel:"Gigabyte Gaming OC",price:525,perf:49,vram:16,tdp:220,len:295},
    {id:"gpu_222",name:"Sapphire Pulse RX 9070",brand:"Sapphire",model:"RX 9070",variantLabel:"Sapphire Pulse",price:530,perf:49,vram:16,tdp:220,len:292},
    {id:"gpu_223",name:"PowerColor Hellhound RX 9070",brand:"PowerColor",model:"RX 9070",variantLabel:"PowerColor Hellhound",price:550,perf:49,vram:16,tdp:220,len:300},
    {id:"gpu_224",name:"XFX Merc 310 RX 9070",brand:"XFX",model:"RX 9070",variantLabel:"XFX Merc 310",price:570,perf:49,vram:16,tdp:220,len:310},
    {id:"gpu_225",name:"ASUS TUF OC RX 9070",brand:"ASUS",model:"RX 9070",variantLabel:"ASUS TUF OC",price:575,perf:49,vram:16,tdp:220,len:310},
    {id:"gpu_226",name:"PowerColor Reaper RX 9070 XT",brand:"PowerColor",model:"RX 9070 XT",variantLabel:"PowerColor Reaper",price:580,perf:54,vram:16,tdp:304,len:290},
    {id:"gpu_227",name:"XFX Swift RX 9070 XT",brand:"XFX",model:"RX 9070 XT",variantLabel:"XFX Swift",price:595,perf:54,vram:16,tdp:304,len:295},
    {id:"gpu_228",name:"ASRock Challenger RX 9070 XT",brand:"ASRock",model:"RX 9070 XT",variantLabel:"ASRock Challenger",price:605,perf:54,vram:16,tdp:304,len:298},
    {id:"gpu_229",name:"Acer Nitro RX 9070 XT",brand:"Acer",model:"RX 9070 XT",variantLabel:"Acer Nitro",price:610,perf:54,vram:16,tdp:304,len:300},
    {id:"gpu_230",name:"Gigabyte Gaming OC RX 9070 XT",brand:"Gigabyte",model:"RX 9070 XT",variantLabel:"Gigabyte Gaming OC",price:620,perf:54,vram:16,tdp:304,len:305},
    {id:"gpu_231",name:"Sapphire Pulse RX 9070 XT",brand:"Sapphire",model:"RX 9070 XT",variantLabel:"Sapphire Pulse",price:625,perf:54,vram:16,tdp:304,len:302},
    {id:"gpu_232",name:"PowerColor Hellhound RX 9070 XT",brand:"PowerColor",model:"RX 9070 XT",variantLabel:"PowerColor Hellhound",price:640,perf:54,vram:16,tdp:304,len:310},
    {id:"gpu_233",name:"XFX Merc 310 RX 9070 XT",brand:"XFX",model:"RX 9070 XT",variantLabel:"XFX Merc 310",price:665,perf:54,vram:16,tdp:304,len:320},
    {id:"gpu_234",name:"ASUS TUF OC RX 9070 XT",brand:"ASUS",model:"RX 9070 XT",variantLabel:"ASUS TUF OC",price:670,perf:54,vram:16,tdp:304,len:320},
    {id:"gpu_235",name:"PowerColor Red Devil RX 9070 XT",brand:"PowerColor",model:"RX 9070 XT",variantLabel:"PowerColor Red Devil",price:680,perf:54,vram:16,tdp:304,len:322},
    {id:"gpu_236",name:"Sapphire Nitro+ RX 9070 XT",brand:"Sapphire",model:"RX 9070 XT",variantLabel:"Sapphire Nitro+",price:695,perf:54,vram:16,tdp:304,len:325},
    {id:"gpu_237",name:"ASRock Taichi RX 9070 XT",brand:"ASRock",model:"RX 9070 XT",variantLabel:"ASRock Taichi",price:705,perf:54,vram:16,tdp:304,len:325},
    {id:"gpu_238",name:"Founders Edition RTX 4090",brand:"Founders",model:"RTX 4090",variantLabel:"Founders Edition",price:1480,perf:80,vram:24,tdp:450,len:304},
    {id:"gpu_239",name:"ASUS TUF RTX 4090",brand:"ASUS",model:"RTX 4090",variantLabel:"ASUS TUF",price:1565,perf:80,vram:24,tdp:450,len:348},
    {id:"gpu_240",name:"MSI Suprim X RTX 4090",brand:"MSI",model:"RTX 4090",variantLabel:"MSI Suprim X",price:1610,perf:80,vram:24,tdp:450,len:358},
    {id:"gpu_241",name:"Founders Edition RTX 4080 Super",brand:"Founders",model:"RTX 4080 Super",variantLabel:"Founders Edition",price:900,perf:64,vram:16,tdp:320,len:304},
    {id:"gpu_242",name:"Gigabyte Gaming OC RTX 4080 Super",brand:"Gigabyte",model:"RTX 4080 Super",variantLabel:"Gigabyte Gaming OC",price:945,perf:64,vram:16,tdp:320,len:340},
    {id:"gpu_243",name:"MSI Ventus 3X RTX 4080 Super",brand:"MSI",model:"RTX 4080 Super",variantLabel:"MSI Ventus 3X",price:920,perf:64,vram:16,tdp:320,len:338},
    {id:"gpu_244",name:"ASUS TUF RTX 4070 Ti",brand:"ASUS",model:"RTX 4070 Ti",variantLabel:"ASUS TUF",price:680,perf:52,vram:12,tdp:285,len:305},
    {id:"gpu_245",name:"Gigabyte Gaming OC RTX 4070 Ti",brand:"Gigabyte",model:"RTX 4070 Ti",variantLabel:"Gigabyte Gaming OC",price:670,perf:52,vram:12,tdp:285,len:336},
    {id:"gpu_246",name:"MSI Ventus 3X RTX 4070 Ti",brand:"MSI",model:"RTX 4070 Ti",variantLabel:"MSI Ventus 3X",price:665,perf:52,vram:12,tdp:285,len:338},
    {id:"gpu_247",name:"Founders Edition RTX 4070",brand:"Founders",model:"RTX 4070",variantLabel:"Founders Edition",price:460,perf:42,vram:12,tdp:200,len:244},
    {id:"gpu_248",name:"Gigabyte Windforce RTX 4070",brand:"Gigabyte",model:"RTX 4070",variantLabel:"Gigabyte Windforce",price:470,perf:42,vram:12,tdp:200,len:261},
    {id:"gpu_249",name:"MSI Ventus 2X RTX 4070",brand:"MSI",model:"RTX 4070",variantLabel:"MSI Ventus 2X",price:465,perf:42,vram:12,tdp:200,len:250},
    {id:"gpu_250",name:"ASUS Dual RTX 3050",brand:"ASUS",model:"RTX 3050",variantLabel:"ASUS Dual",price:175,perf:17,vram:8,tdp:130,len:200},
    {id:"gpu_251",name:"MSI Ventus 2X RTX 3050",brand:"MSI",model:"RTX 3050",variantLabel:"MSI Ventus 2X",price:165,perf:17,vram:8,tdp:130,len:200},
    {id:"gpu_252",name:"Gigabyte Eagle RTX 3050",brand:"Gigabyte",model:"RTX 3050",variantLabel:"Gigabyte Eagle",price:170,perf:17,vram:8,tdp:130,len:212},
    {id:"gpu_253",name:"Sapphire Pulse RX 9070 GRE",brand:"Sapphire",model:"RX 9070 GRE",variantLabel:"Sapphire Pulse",price:490,perf:44,vram:12,tdp:220,len:280},
    {id:"gpu_254",name:"PowerColor Reaper RX 9070 GRE",brand:"PowerColor",model:"RX 9070 GRE",variantLabel:"PowerColor Reaper",price:485,perf:44,vram:12,tdp:220,len:270},
    {id:"gpu_255",name:"ASRock Challenger RX 9070 GRE",brand:"ASRock",model:"RX 9070 GRE",variantLabel:"ASRock Challenger",price:480,perf:44,vram:12,tdp:220,len:270},
    {id:"gpu_256",name:"Sapphire Pulse RX 6700 XT",brand:"Sapphire",model:"RX 6700 XT",variantLabel:"Sapphire Pulse",price:225,perf:33,vram:12,tdp:230,len:280},
    {id:"gpu_257",name:"PowerColor Hellhound RX 6700 XT",brand:"PowerColor",model:"RX 6700 XT",variantLabel:"PowerColor Hellhound",price:230,perf:33,vram:12,tdp:230,len:320},
    {id:"gpu_258",name:"XFX Speedster RX 6700 XT",brand:"XFX",model:"RX 6700 XT",variantLabel:"XFX Speedster",price:220,perf:33,vram:12,tdp:230,len:300},
    {id:"gpu_259",name:"Sapphire Pulse RX 6650 XT",brand:"Sapphire",model:"RX 6650 XT",variantLabel:"Sapphire Pulse",price:175,perf:28,vram:8,tdp:180,len:240},
    {id:"gpu_260",name:"ASRock Challenger RX 6650 XT",brand:"ASRock",model:"RX 6650 XT",variantLabel:"ASRock Challenger",price:170,perf:28,vram:8,tdp:180,len:245},
    {id:"gpu_261",name:"XFX Speedster RX 6650 XT",brand:"XFX",model:"RX 6650 XT",variantLabel:"XFX Speedster",price:170,perf:28,vram:8,tdp:180,len:240},
    {id:"gpu_262",name:"Sapphire Pulse RX 6800",brand:"Sapphire",model:"RX 6800",variantLabel:"Sapphire Pulse",price:265,perf:38,vram:16,tdp:250,len:267},
    {id:"gpu_263",name:"XFX Speedster RX 6800",brand:"XFX",model:"RX 6800",variantLabel:"XFX Speedster",price:260,perf:38,vram:16,tdp:250,len:320},
    {id:"gpu_264",name:"ASRock Challenger RX 6800",brand:"ASRock",model:"RX 6800",variantLabel:"ASRock Challenger",price:260,perf:38,vram:16,tdp:250,len:267},
    {id:"gpu_265",name:"Sapphire Nitro+ RX 6900 XT",brand:"Sapphire",model:"RX 6900 XT",variantLabel:"Sapphire Nitro+",price:370,perf:43,vram:16,tdp:300,len:310},
    {id:"gpu_266",name:"PowerColor Red Devil RX 6900 XT",brand:"PowerColor",model:"RX 6900 XT",variantLabel:"PowerColor Red Devil",price:375,perf:43,vram:16,tdp:300,len:320},
    {id:"gpu_267",name:"ASRock Phantom Gaming RX 6900 XT",brand:"ASRock",model:"RX 6900 XT",variantLabel:"ASRock Phantom Gaming",price:365,perf:43,vram:16,tdp:300,len:300},
    {id:"gpu_268",name:"Sapphire Nitro+ RX 6950 XT",brand:"Sapphire",model:"RX 6950 XT",variantLabel:"Sapphire Nitro+",price:420,perf:46,vram:16,tdp:335,len:320},
    {id:"gpu_269",name:"PowerColor Red Devil RX 6950 XT",brand:"PowerColor",model:"RX 6950 XT",variantLabel:"PowerColor Red Devil",price:425,perf:46,vram:16,tdp:335,len:324},
    {id:"gpu_270",name:"XFX Speedster RX 6950 XT",brand:"XFX",model:"RX 6950 XT",variantLabel:"XFX Speedster",price:415,perf:46,vram:16,tdp:335,len:340},
    {id:"gpu_271",name:"Intel Limited Edition Intel Arc A750",brand:"Intel",model:"Intel Arc A750",variantLabel:"Intel Limited Edition",price:170,perf:24,vram:8,tdp:225,len:270},
    {id:"gpu_272",name:"ASRock Challenger Intel Arc A750",brand:"ASRock",model:"Intel Arc A750",variantLabel:"ASRock Challenger",price:180,perf:24,vram:8,tdp:225,len:270},
    {id:"gpu_273",name:"Sparkle Orc Intel Arc A750",brand:"Sparkle",model:"Intel Arc A750",variantLabel:"Sparkle Orc",price:175,perf:24,vram:8,tdp:225,len:260},
  ],
  mobo: [
    {id:"mb1",brand:"MSI",name:"MSI B450 Tomahawk Max II",model:"MSI B450 Tomahawk Max II",variantLabel:"MSI",price:90,perf:46,socket:"AM4",ramType:"DDR4",form:"ATX",m2:2,maxRam:128},
    {id:"mb2",brand:"ASRock",name:"ASRock B550 Pro RS",model:"ASRock B550 Pro RS",variantLabel:"ASRock",price:115,perf:54,socket:"AM4",ramType:"DDR4",form:"mATX",m2:2,maxRam:128},
    {id:"mb3",brand:"MSI",name:"MSI B550 Tomahawk",model:"MSI B550 Tomahawk",variantLabel:"MSI",price:130,perf:54,socket:"AM4",ramType:"DDR4",form:"ATX",m2:2,maxRam:128},
    {id:"mb4",brand:"ASUS",name:"ASUS B550 TUF Gaming Plus",model:"ASUS B550 TUF Gaming Plus",variantLabel:"ASUS",price:130,perf:54,socket:"AM4",ramType:"DDR4",form:"ATX",m2:2,maxRam:128},
    {id:"mb5",brand:"Gigabyte",name:"Gigabyte X570 Aorus Elite",model:"Gigabyte X570 Aorus Elite",variantLabel:"Gigabyte",price:180,perf:62,socket:"AM4",ramType:"DDR4",form:"ATX",m2:3,maxRam:128},
    {id:"mb6",brand:"ASUS",name:"ASUS H510 Prime M-E",model:"ASUS H510 Prime M-E",variantLabel:"ASUS",price:70,perf:42,socket:"LGA1200",ramType:"DDR4",form:"mATX",m2:2,maxRam:128},
    {id:"mb7",brand:"MSI",name:"MSI B560 Tomahawk WiFi",model:"MSI B560 Tomahawk WiFi",variantLabel:"MSI",price:110,perf:52,socket:"LGA1200",ramType:"DDR4",form:"ATX",m2:2,maxRam:128},
    {id:"mb8",brand:"Gigabyte",name:"Gigabyte B560 DS3H",model:"Gigabyte B560 DS3H",variantLabel:"Gigabyte",price:110,perf:52,socket:"LGA1200",ramType:"DDR4",form:"ATX",m2:2,maxRam:128},
    {id:"mb9",brand:"ASRock",name:"ASRock B560 Steel Legend",model:"ASRock B560 Steel Legend",variantLabel:"ASRock",price:110,perf:52,socket:"LGA1200",ramType:"DDR4",form:"ATX",m2:2,maxRam:128},
    {id:"mb10",brand:"ASRock",name:"ASRock B650 PG Lightning",model:"ASRock B650 PG Lightning",variantLabel:"ASRock",price:150,perf:58,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb11",brand:"MSI",name:"MSI B650 Gaming Plus WiFi",model:"MSI B650 Gaming Plus WiFi",variantLabel:"MSI",price:150,perf:58,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb12",brand:"ASUS",name:"ASUS B650 TUF Gaming Plus",model:"ASUS B650 TUF Gaming Plus",variantLabel:"ASUS",price:150,perf:58,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb13",brand:"Gigabyte",name:"Gigabyte B650 Aorus Elite AX",model:"Gigabyte B650 Aorus Elite AX",variantLabel:"Gigabyte",price:150,perf:58,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb14",brand:"ASRock",name:"ASRock B650E Taichi Lite",model:"ASRock B650E Taichi Lite",variantLabel:"ASRock",price:200,perf:66,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb15",brand:"MSI",name:"MSI B850 Tomahawk",model:"MSI B850 Tomahawk",variantLabel:"MSI",price:200,perf:66,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb16",brand:"ASUS",name:"ASUS B850 TUF Gaming Plus",model:"ASUS B850 TUF Gaming Plus",variantLabel:"ASUS",price:200,perf:66,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb17",brand:"Gigabyte",name:"Gigabyte B850 Aorus Elite",model:"Gigabyte B850 Aorus Elite",variantLabel:"Gigabyte",price:200,perf:66,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb18",brand:"ASRock",name:"ASRock B850 Steel Legend",model:"ASRock B850 Steel Legend",variantLabel:"ASRock",price:200,perf:66,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb19",brand:"Gigabyte",name:"Gigabyte X670E Aorus Master",model:"Gigabyte X670E Aorus Master",variantLabel:"Gigabyte",price:330,perf:80,socket:"AM5",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb20",brand:"ASUS",name:"ASUS X870 ROG Strix-A",model:"ASUS X870 ROG Strix-A",variantLabel:"ASUS",price:260,perf:76,socket:"AM5",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb21",brand:"MSI",name:"MSI X870 Tomahawk WiFi",model:"MSI X870 Tomahawk WiFi",variantLabel:"MSI",price:260,perf:76,socket:"AM5",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb22",brand:"Gigabyte",name:"Gigabyte X870E Aorus Master",model:"Gigabyte X870E Aorus Master",variantLabel:"Gigabyte",price:430,perf:86,socket:"AM5",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb23",brand:"ASUS",name:"ASUS X870E ROG Hero",model:"ASUS X870E ROG Hero",variantLabel:"ASUS",price:430,perf:86,socket:"AM5",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb24",brand:"MSI",name:"MSI B760 Gaming Plus WiFi",model:"MSI B760 Gaming Plus WiFi",variantLabel:"MSI",price:150,perf:56,socket:"LGA1700",ramType:"DDR5",form:"ATX",m2:2,maxRam:192},
    {id:"mb25",brand:"Gigabyte",name:"Gigabyte B760 DS3H",model:"Gigabyte B760 DS3H",variantLabel:"Gigabyte",price:150,perf:56,socket:"LGA1700",ramType:"DDR5",form:"ATX",m2:2,maxRam:192},
    {id:"mb26",brand:"ASUS",name:"ASUS Z790 ROG Strix-F",model:"ASUS Z790 ROG Strix-F",variantLabel:"ASUS",price:300,perf:78,socket:"LGA1700",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb27",brand:"MSI",name:"MSI Z790 Tomahawk",model:"MSI Z790 Tomahawk",variantLabel:"MSI",price:300,perf:78,socket:"LGA1700",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb28",brand:"MSI",name:"MSI B860 Tomahawk WiFi",model:"MSI B860 Tomahawk WiFi",variantLabel:"MSI",price:200,perf:64,socket:"LGA1851",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb29",brand:"ASUS",name:"ASUS B860 TUF Gaming Plus",model:"ASUS B860 TUF Gaming Plus",variantLabel:"ASUS",price:200,perf:64,socket:"LGA1851",ramType:"DDR5",form:"ATX",m2:3,maxRam:192},
    {id:"mb30",brand:"Gigabyte",name:"Gigabyte Z890 Aorus Elite",model:"Gigabyte Z890 Aorus Elite",variantLabel:"Gigabyte",price:360,perf:84,socket:"LGA1851",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb31",brand:"ASUS",name:"ASUS Z890 ROG Strix-E",model:"ASUS Z890 ROG Strix-E",variantLabel:"ASUS",price:360,perf:84,socket:"LGA1851",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb32",brand:"MSI",name:"MSI Z890 MEG Ace",model:"MSI Z890 MEG Ace",variantLabel:"MSI",price:360,perf:84,socket:"LGA1851",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
    {id:"mb33",brand:"ASRock",name:"ASRock B650 ITX",model:"ASRock B650 ITX",variantLabel:"ASRock",price:175,perf:60,socket:"AM5",ramType:"DDR5",form:"ITX",m2:2,maxRam:96},
    {id:"mb34",brand:"ASUS",name:"ASUS B850 ROG Strix-I ITX",model:"ASUS B850 ROG Strix-I ITX",variantLabel:"ASUS",price:230,perf:68,socket:"AM5",ramType:"DDR5",form:"ITX",m2:2,maxRam:96},
    {id:"mb35",brand:"Gigabyte",name:"Gigabyte Z890 Aorus ITX",model:"Gigabyte Z890 Aorus ITX",variantLabel:"Gigabyte",price:415,perf:86,socket:"LGA1851",ramType:"DDR5",form:"ITX",m2:2,maxRam:96},
    {id:"mb36",brand:"MSI",name:"MSI B760M Mortar mATX",model:"MSI B760M Mortar mATX",variantLabel:"MSI",price:135,perf:56,socket:"LGA1700",ramType:"DDR5",form:"mATX",m2:2,maxRam:192},
    {id:"mb37",brand:"ASRock",name:"ASRock B860M Pro mATX",model:"ASRock B860M Pro mATX",variantLabel:"ASRock",price:180,perf:64,socket:"LGA1851",ramType:"DDR5",form:"mATX",m2:3,maxRam:192},
    {id:"mb38",brand:"ASRock",name:"ASRock B550M ITX",model:"ASRock B550M ITX",variantLabel:"ASRock",price:150,perf:56,socket:"AM4",ramType:"DDR4",form:"ITX",m2:2,maxRam:96},
    {id:"mb39",brand:"ASRock",name:"ASRock B860 Challenger WiFi",model:"ASRock B860 Challenger WiFi",variantLabel:"ASRock",price:180,perf:62,socket:"LGA1851",ramType:"DDR5",form:"ATX",m2:3,maxRam:256},
    {id:"mb40",brand:"MSI",name:"MSI MAG B850 Tomahawk Max WiFi",model:"MSI MAG B850 Tomahawk Max WiFi",variantLabel:"MSI",price:220,perf:66,socket:"AM5",ramType:"DDR5",form:"ATX",m2:3,maxRam:256},
    {id:"mb41",brand:"ASUS",name:"ASUS ROG Maximus Z890 Hero",model:"ASUS ROG Maximus Z890 Hero",variantLabel:"ASUS",price:600,perf:82,socket:"LGA1851",ramType:"DDR5",form:"ATX",m2:5,maxRam:256},
    {id:"mb42",brand:"ASRock",name:"ASRock X870E Taichi Lite",model:"ASRock X870E Taichi Lite",variantLabel:"ASRock",price:300,perf:78,socket:"AM5",ramType:"DDR5",form:"ATX",m2:4,maxRam:256},
  ],
  ram: [
    {id:"ram1",brand:"Corsair",name:"Corsair Vengeance LPX 16GB DDR4-3200",model:"Corsair Vengeance LPX 16GB DDR4-3200",variantLabel:"Corsair",price:150,perf:41,ramType:"DDR4",cap:16,speed:3200},
    {id:"ram2",brand:"G.Skill",name:"G.Skill Ripjaws V 16GB DDR4-3200",model:"G.Skill Ripjaws V 16GB DDR4-3200",variantLabel:"G.Skill",price:150,perf:41,ramType:"DDR4",cap:16,speed:3200},
    {id:"ram3",brand:"Kingston",name:"Kingston Fury Beast 16GB DDR4-3200",model:"Kingston Fury Beast 16GB DDR4-3200",variantLabel:"Kingston",price:155,perf:41,ramType:"DDR4",cap:16,speed:3200},
    {id:"ram4",brand:"TeamGroup",name:"TeamGroup T-Force Vulcan 16GB DDR4-3200",model:"TeamGroup T-Force Vulcan 16GB DDR4-3200",variantLabel:"TeamGroup",price:155,perf:41,ramType:"DDR4",cap:16,speed:3200},
    {id:"ram5",brand:"Patriot",name:"Patriot Viper Steel 16GB DDR4-3200",model:"Patriot Viper Steel 16GB DDR4-3200",variantLabel:"Patriot",price:155,perf:41,ramType:"DDR4",cap:16,speed:3200},
    {id:"ram6",brand:"ADATA",name:"ADATA XPG Gammix 16GB DDR4-3200",model:"ADATA XPG Gammix 16GB DDR4-3200",variantLabel:"ADATA",price:160,perf:41,ramType:"DDR4",cap:16,speed:3200},
    {id:"ram7",brand:"Corsair",name:"Corsair Vengeance LPX 16GB DDR4-3600",model:"Corsair Vengeance LPX 16GB DDR4-3600",variantLabel:"Corsair",price:155,perf:41,ramType:"DDR4",cap:16,speed:3600},
    {id:"ram8",brand:"G.Skill",name:"G.Skill Ripjaws V 16GB DDR4-3600",model:"G.Skill Ripjaws V 16GB DDR4-3600",variantLabel:"G.Skill",price:155,perf:41,ramType:"DDR4",cap:16,speed:3600},
    {id:"ram9",brand:"Kingston",name:"Kingston Fury Beast 16GB DDR4-3600",model:"Kingston Fury Beast 16GB DDR4-3600",variantLabel:"Kingston",price:160,perf:41,ramType:"DDR4",cap:16,speed:3600},
    {id:"ram10",brand:"TeamGroup",name:"TeamGroup T-Force Vulcan 16GB DDR4-3600",model:"TeamGroup T-Force Vulcan 16GB DDR4-3600",variantLabel:"TeamGroup",price:160,perf:41,ramType:"DDR4",cap:16,speed:3600},
    {id:"ram11",brand:"Patriot",name:"Patriot Viper Steel 16GB DDR4-3600",model:"Patriot Viper Steel 16GB DDR4-3600",variantLabel:"Patriot",price:165,perf:41,ramType:"DDR4",cap:16,speed:3600},
    {id:"ram12",brand:"ADATA",name:"ADATA XPG Gammix 16GB DDR4-3600",model:"ADATA XPG Gammix 16GB DDR4-3600",variantLabel:"ADATA",price:165,perf:41,ramType:"DDR4",cap:16,speed:3600},
    {id:"ram13",brand:"Corsair",name:"Corsair Vengeance LPX 32GB DDR4-3200",model:"Corsair Vengeance LPX 32GB DDR4-3200",variantLabel:"Corsair",price:205,perf:65,ramType:"DDR4",cap:32,speed:3200},
    {id:"ram14",brand:"G.Skill",name:"G.Skill Ripjaws V 32GB DDR4-3200",model:"G.Skill Ripjaws V 32GB DDR4-3200",variantLabel:"G.Skill",price:210,perf:65,ramType:"DDR4",cap:32,speed:3200},
    {id:"ram15",brand:"Kingston",name:"Kingston Fury Beast 32GB DDR4-3200",model:"Kingston Fury Beast 32GB DDR4-3200",variantLabel:"Kingston",price:210,perf:65,ramType:"DDR4",cap:32,speed:3200},
    {id:"ram16",brand:"TeamGroup",name:"TeamGroup T-Force Vulcan 32GB DDR4-3200",model:"TeamGroup T-Force Vulcan 32GB DDR4-3200",variantLabel:"TeamGroup",price:215,perf:65,ramType:"DDR4",cap:32,speed:3200},
    {id:"ram17",brand:"Patriot",name:"Patriot Viper Steel 32GB DDR4-3200",model:"Patriot Viper Steel 32GB DDR4-3200",variantLabel:"Patriot",price:215,perf:65,ramType:"DDR4",cap:32,speed:3200},
    {id:"ram18",brand:"ADATA",name:"ADATA XPG Gammix 32GB DDR4-3200",model:"ADATA XPG Gammix 32GB DDR4-3200",variantLabel:"ADATA",price:220,perf:65,ramType:"DDR4",cap:32,speed:3200},
    {id:"ram19",brand:"Corsair",name:"Corsair Vengeance LPX 32GB DDR4-3600",model:"Corsair Vengeance LPX 32GB DDR4-3600",variantLabel:"Corsair",price:215,perf:65,ramType:"DDR4",cap:32,speed:3600},
    {id:"ram20",brand:"G.Skill",name:"G.Skill Ripjaws V 32GB DDR4-3600",model:"G.Skill Ripjaws V 32GB DDR4-3600",variantLabel:"G.Skill",price:220,perf:65,ramType:"DDR4",cap:32,speed:3600},
    {id:"ram21",brand:"Kingston",name:"Kingston Fury Beast 32GB DDR4-3600",model:"Kingston Fury Beast 32GB DDR4-3600",variantLabel:"Kingston",price:220,perf:65,ramType:"DDR4",cap:32,speed:3600},
    {id:"ram22",brand:"TeamGroup",name:"TeamGroup T-Force Vulcan 32GB DDR4-3600",model:"TeamGroup T-Force Vulcan 32GB DDR4-3600",variantLabel:"TeamGroup",price:225,perf:65,ramType:"DDR4",cap:32,speed:3600},
    {id:"ram23",brand:"Patriot",name:"Patriot Viper Steel 32GB DDR4-3600",model:"Patriot Viper Steel 32GB DDR4-3600",variantLabel:"Patriot",price:230,perf:65,ramType:"DDR4",cap:32,speed:3600},
    {id:"ram24",brand:"ADATA",name:"ADATA XPG Gammix 32GB DDR4-3600",model:"ADATA XPG Gammix 32GB DDR4-3600",variantLabel:"ADATA",price:235,perf:65,ramType:"DDR4",cap:32,speed:3600},
    {id:"ram25",brand:"Corsair",name:"Corsair Vengeance 16GB DDR5-5600",model:"Corsair Vengeance 16GB DDR5-5600",variantLabel:"Corsair",price:230,perf:50,ramType:"DDR5",cap:16,speed:5600},
    {id:"ram26",brand:"G.Skill",name:"G.Skill Flare X5 16GB DDR5-5600",model:"G.Skill Flare X5 16GB DDR5-5600",variantLabel:"G.Skill",price:235,perf:50,ramType:"DDR5",cap:16,speed:5600},
    {id:"ram27",brand:"G.Skill",name:"G.Skill Trident Z5 16GB DDR5-5600",model:"G.Skill Trident Z5 16GB DDR5-5600",variantLabel:"G.Skill",price:235,perf:50,ramType:"DDR5",cap:16,speed:5600},
    {id:"ram28",brand:"Kingston",name:"Kingston Fury Beast 16GB DDR5-5600",model:"Kingston Fury Beast 16GB DDR5-5600",variantLabel:"Kingston",price:240,perf:50,ramType:"DDR5",cap:16,speed:5600},
    {id:"ram29",brand:"TeamGroup",name:"TeamGroup T-Force Delta 16GB DDR5-5600",model:"TeamGroup T-Force Delta 16GB DDR5-5600",variantLabel:"TeamGroup",price:245,perf:50,ramType:"DDR5",cap:16,speed:5600},
    {id:"ram30",brand:"Crucial",name:"Crucial Pro 16GB DDR5-5600",model:"Crucial Pro 16GB DDR5-5600",variantLabel:"Crucial",price:250,perf:50,ramType:"DDR5",cap:16,speed:5600},
    {id:"ram31",brand:"ADATA",name:"ADATA XPG Lancer 16GB DDR5-5600",model:"ADATA XPG Lancer 16GB DDR5-5600",variantLabel:"ADATA",price:250,perf:50,ramType:"DDR5",cap:16,speed:5600},
    {id:"ram32",brand:"Patriot",name:"Patriot Viper Venom 16GB DDR5-5600",model:"Patriot Viper Venom 16GB DDR5-5600",variantLabel:"Patriot",price:255,perf:50,ramType:"DDR5",cap:16,speed:5600},
    {id:"ram33",brand:"Corsair",name:"Corsair Vengeance 16GB DDR5-6000",model:"Corsair Vengeance 16GB DDR5-6000",variantLabel:"Corsair",price:240,perf:53,ramType:"DDR5",cap:16,speed:6000},
    {id:"ram34",brand:"G.Skill",name:"G.Skill Flare X5 16GB DDR5-6000",model:"G.Skill Flare X5 16GB DDR5-6000",variantLabel:"G.Skill",price:245,perf:53,ramType:"DDR5",cap:16,speed:6000},
    {id:"ram35",brand:"G.Skill",name:"G.Skill Trident Z5 16GB DDR5-6000",model:"G.Skill Trident Z5 16GB DDR5-6000",variantLabel:"G.Skill",price:250,perf:53,ramType:"DDR5",cap:16,speed:6000},
    {id:"ram36",brand:"Kingston",name:"Kingston Fury Beast 16GB DDR5-6000",model:"Kingston Fury Beast 16GB DDR5-6000",variantLabel:"Kingston",price:250,perf:53,ramType:"DDR5",cap:16,speed:6000},
    {id:"ram37",brand:"TeamGroup",name:"TeamGroup T-Force Delta 16GB DDR5-6000",model:"TeamGroup T-Force Delta 16GB DDR5-6000",variantLabel:"TeamGroup",price:255,perf:53,ramType:"DDR5",cap:16,speed:6000},
    {id:"ram38",brand:"Crucial",name:"Crucial Pro 16GB DDR5-6000",model:"Crucial Pro 16GB DDR5-6000",variantLabel:"Crucial",price:260,perf:53,ramType:"DDR5",cap:16,speed:6000},
    {id:"ram39",brand:"ADATA",name:"ADATA XPG Lancer 16GB DDR5-6000",model:"ADATA XPG Lancer 16GB DDR5-6000",variantLabel:"ADATA",price:265,perf:53,ramType:"DDR5",cap:16,speed:6000},
    {id:"ram40",brand:"Patriot",name:"Patriot Viper Venom 16GB DDR5-6000",model:"Patriot Viper Venom 16GB DDR5-6000",variantLabel:"Patriot",price:265,perf:53,ramType:"DDR5",cap:16,speed:6000},
    {id:"ram41",brand:"Corsair",name:"Corsair Vengeance 32GB DDR5-5600",model:"Corsair Vengeance 32GB DDR5-5600",variantLabel:"Corsair",price:330,perf:74,ramType:"DDR5",cap:32,speed:5600},
    {id:"ram42",brand:"G.Skill",name:"G.Skill Flare X5 32GB DDR5-5600",model:"G.Skill Flare X5 32GB DDR5-5600",variantLabel:"G.Skill",price:340,perf:74,ramType:"DDR5",cap:32,speed:5600},
    {id:"ram43",brand:"G.Skill",name:"G.Skill Trident Z5 32GB DDR5-5600",model:"G.Skill Trident Z5 32GB DDR5-5600",variantLabel:"G.Skill",price:350,perf:74,ramType:"DDR5",cap:32,speed:5600},
    {id:"ram44",brand:"Kingston",name:"Kingston Fury Beast 32GB DDR5-5600",model:"Kingston Fury Beast 32GB DDR5-5600",variantLabel:"Kingston",price:355,perf:74,ramType:"DDR5",cap:32,speed:5600},
    {id:"ram45",brand:"TeamGroup",name:"TeamGroup T-Force Delta 32GB DDR5-5600",model:"TeamGroup T-Force Delta 32GB DDR5-5600",variantLabel:"TeamGroup",price:365,perf:74,ramType:"DDR5",cap:32,speed:5600},
    {id:"ram46",brand:"Crucial",name:"Crucial Pro 32GB DDR5-5600",model:"Crucial Pro 32GB DDR5-5600",variantLabel:"Crucial",price:375,perf:74,ramType:"DDR5",cap:32,speed:5600},
    {id:"ram47",brand:"ADATA",name:"ADATA XPG Lancer 32GB DDR5-5600",model:"ADATA XPG Lancer 32GB DDR5-5600",variantLabel:"ADATA",price:385,perf:74,ramType:"DDR5",cap:32,speed:5600},
    {id:"ram48",brand:"Patriot",name:"Patriot Viper Venom 32GB DDR5-5600",model:"Patriot Viper Venom 32GB DDR5-5600",variantLabel:"Patriot",price:395,perf:74,ramType:"DDR5",cap:32,speed:5600},
    {id:"ram49",brand:"Corsair",name:"Corsair Vengeance 32GB DDR5-6000",model:"Corsair Vengeance 32GB DDR5-6000",variantLabel:"Corsair",price:360,perf:77,ramType:"DDR5",cap:32,speed:6000},
    {id:"ram50",brand:"G.Skill",name:"G.Skill Flare X5 32GB DDR5-6000",model:"G.Skill Flare X5 32GB DDR5-6000",variantLabel:"G.Skill",price:370,perf:77,ramType:"DDR5",cap:32,speed:6000},
    {id:"ram51",brand:"G.Skill",name:"G.Skill Trident Z5 32GB DDR5-6000",model:"G.Skill Trident Z5 32GB DDR5-6000",variantLabel:"G.Skill",price:380,perf:77,ramType:"DDR5",cap:32,speed:6000},
    {id:"ram52",brand:"Kingston",name:"Kingston Fury Beast 32GB DDR5-6000",model:"Kingston Fury Beast 32GB DDR5-6000",variantLabel:"Kingston",price:390,perf:77,ramType:"DDR5",cap:32,speed:6000},
    {id:"ram53",brand:"TeamGroup",name:"TeamGroup T-Force Delta 32GB DDR5-6000",model:"TeamGroup T-Force Delta 32GB DDR5-6000",variantLabel:"TeamGroup",price:395,perf:77,ramType:"DDR5",cap:32,speed:6000},
    {id:"ram54",brand:"Crucial",name:"Crucial Pro 32GB DDR5-6000",model:"Crucial Pro 32GB DDR5-6000",variantLabel:"Crucial",price:400,perf:77,ramType:"DDR5",cap:32,speed:6000},
    {id:"ram55",brand:"ADATA",name:"ADATA XPG Lancer 32GB DDR5-6000",model:"ADATA XPG Lancer 32GB DDR5-6000",variantLabel:"ADATA",price:415,perf:77,ramType:"DDR5",cap:32,speed:6000},
    {id:"ram56",brand:"Patriot",name:"Patriot Viper Venom 32GB DDR5-6000",model:"Patriot Viper Venom 32GB DDR5-6000",variantLabel:"Patriot",price:425,perf:77,ramType:"DDR5",cap:32,speed:6000},
    {id:"ram57",brand:"Corsair",name:"Corsair Vengeance 32GB DDR5-6400",model:"Corsair Vengeance 32GB DDR5-6400",variantLabel:"Corsair",price:420,perf:76,ramType:"DDR5",cap:32,speed:6400},
    {id:"ram58",brand:"G.Skill",name:"G.Skill Flare X5 32GB DDR5-6400",model:"G.Skill Flare X5 32GB DDR5-6400",variantLabel:"G.Skill",price:430,perf:76,ramType:"DDR5",cap:32,speed:6400},
    {id:"ram59",brand:"G.Skill",name:"G.Skill Trident Z5 32GB DDR5-6400",model:"G.Skill Trident Z5 32GB DDR5-6400",variantLabel:"G.Skill",price:440,perf:76,ramType:"DDR5",cap:32,speed:6400},
    {id:"ram60",brand:"Kingston",name:"Kingston Fury Beast 32GB DDR5-6400",model:"Kingston Fury Beast 32GB DDR5-6400",variantLabel:"Kingston",price:450,perf:76,ramType:"DDR5",cap:32,speed:6400},
    {id:"ram61",brand:"TeamGroup",name:"TeamGroup T-Force Delta 32GB DDR5-6400",model:"TeamGroup T-Force Delta 32GB DDR5-6400",variantLabel:"TeamGroup",price:460,perf:76,ramType:"DDR5",cap:32,speed:6400},
    {id:"ram62",brand:"Crucial",name:"Crucial Pro 32GB DDR5-6400",model:"Crucial Pro 32GB DDR5-6400",variantLabel:"Crucial",price:465,perf:76,ramType:"DDR5",cap:32,speed:6400},
    {id:"ram63",brand:"ADATA",name:"ADATA XPG Lancer 32GB DDR5-6400",model:"ADATA XPG Lancer 32GB DDR5-6400",variantLabel:"ADATA",price:475,perf:76,ramType:"DDR5",cap:32,speed:6400},
    {id:"ram64",brand:"Patriot",name:"Patriot Viper Venom 32GB DDR5-6400",model:"Patriot Viper Venom 32GB DDR5-6400",variantLabel:"Patriot",price:485,perf:76,ramType:"DDR5",cap:32,speed:6400},
    {id:"ram65",brand:"Corsair",name:"Corsair Vengeance 32GB DDR5-7200",model:"Corsair Vengeance 32GB DDR5-7200",variantLabel:"Corsair",price:470,perf:76,ramType:"DDR5",cap:32,speed:7200},
    {id:"ram66",brand:"G.Skill",name:"G.Skill Flare X5 32GB DDR5-7200",model:"G.Skill Flare X5 32GB DDR5-7200",variantLabel:"G.Skill",price:480,perf:76,ramType:"DDR5",cap:32,speed:7200},
    {id:"ram67",brand:"G.Skill",name:"G.Skill Trident Z5 32GB DDR5-7200",model:"G.Skill Trident Z5 32GB DDR5-7200",variantLabel:"G.Skill",price:490,perf:76,ramType:"DDR5",cap:32,speed:7200},
    {id:"ram68",brand:"Kingston",name:"Kingston Fury Renegade 32GB DDR5-7200",model:"Kingston Fury Renegade 32GB DDR5-7200",variantLabel:"Kingston",price:500,perf:76,ramType:"DDR5",cap:32,speed:7200},
    {id:"ram69",brand:"TeamGroup",name:"TeamGroup T-Force Delta 32GB DDR5-7200",model:"TeamGroup T-Force Delta 32GB DDR5-7200",variantLabel:"TeamGroup",price:510,perf:76,ramType:"DDR5",cap:32,speed:7200},
    {id:"ram70",brand:"Crucial",name:"Crucial Pro 32GB DDR5-7200",model:"Crucial Pro 32GB DDR5-7200",variantLabel:"Crucial",price:520,perf:76,ramType:"DDR5",cap:32,speed:7200},
    {id:"ram71",brand:"ADATA",name:"ADATA XPG Lancer 32GB DDR5-7200",model:"ADATA XPG Lancer 32GB DDR5-7200",variantLabel:"ADATA",price:530,perf:76,ramType:"DDR5",cap:32,speed:7200},
    {id:"ram72",brand:"Patriot",name:"Patriot Viper Venom 32GB DDR5-7200",model:"Patriot Viper Venom 32GB DDR5-7200",variantLabel:"Patriot",price:545,perf:76,ramType:"DDR5",cap:32,speed:7200},
    {id:"ram73",brand:"Corsair",name:"Corsair Vengeance 48GB DDR5-6400",model:"Corsair Vengeance 48GB DDR5-6400",variantLabel:"Corsair",price:580,perf:82,ramType:"DDR5",cap:48,speed:6400},
    {id:"ram74",brand:"G.Skill",name:"G.Skill Flare X5 48GB DDR5-6400",model:"G.Skill Flare X5 48GB DDR5-6400",variantLabel:"G.Skill",price:595,perf:82,ramType:"DDR5",cap:48,speed:6400},
    {id:"ram75",brand:"G.Skill",name:"G.Skill Trident Z5 48GB DDR5-6400",model:"G.Skill Trident Z5 48GB DDR5-6400",variantLabel:"G.Skill",price:610,perf:82,ramType:"DDR5",cap:48,speed:6400},
    {id:"ram76",brand:"Kingston",name:"Kingston Fury Renegade 48GB DDR5-6400",model:"Kingston Fury Renegade 48GB DDR5-6400",variantLabel:"Kingston",price:625,perf:82,ramType:"DDR5",cap:48,speed:6400},
    {id:"ram77",brand:"TeamGroup",name:"TeamGroup T-Force Delta 48GB DDR5-6400",model:"TeamGroup T-Force Delta 48GB DDR5-6400",variantLabel:"TeamGroup",price:635,perf:82,ramType:"DDR5",cap:48,speed:6400},
    {id:"ram78",brand:"Crucial",name:"Crucial Pro 48GB DDR5-6400",model:"Crucial Pro 48GB DDR5-6400",variantLabel:"Crucial",price:645,perf:82,ramType:"DDR5",cap:48,speed:6400},
    {id:"ram79",brand:"ADATA",name:"ADATA XPG Lancer 48GB DDR5-6400",model:"ADATA XPG Lancer 48GB DDR5-6400",variantLabel:"ADATA",price:655,perf:82,ramType:"DDR5",cap:48,speed:6400},
    {id:"ram80",brand:"Patriot",name:"Patriot Viper Venom 48GB DDR5-6400",model:"Patriot Viper Venom 48GB DDR5-6400",variantLabel:"Patriot",price:665,perf:82,ramType:"DDR5",cap:48,speed:6400},
    {id:"ram81",brand:"Corsair",name:"Corsair Vengeance 64GB DDR5-6000",model:"Corsair Vengeance 64GB DDR5-6000",variantLabel:"Corsair",price:520,perf:91,ramType:"DDR5",cap:64,speed:6000},
    {id:"ram82",brand:"G.Skill",name:"G.Skill Flare X5 64GB DDR5-6000",model:"G.Skill Flare X5 64GB DDR5-6000",variantLabel:"G.Skill",price:535,perf:91,ramType:"DDR5",cap:64,speed:6000},
    {id:"ram83",brand:"G.Skill",name:"G.Skill Trident Z5 64GB DDR5-6000",model:"G.Skill Trident Z5 64GB DDR5-6000",variantLabel:"G.Skill",price:550,perf:91,ramType:"DDR5",cap:64,speed:6000},
    {id:"ram84",brand:"TeamGroup",name:"TeamGroup T-Force Delta 64GB DDR5-6000",model:"TeamGroup T-Force Delta 64GB DDR5-6000",variantLabel:"TeamGroup",price:575,perf:91,ramType:"DDR5",cap:64,speed:6000},
    {id:"ram85",brand:"Corsair",name:"Corsair Vengeance 96GB DDR5-6400",model:"Corsair Vengeance 96GB DDR5-6400",variantLabel:"Corsair",price:660,perf:96,ramType:"DDR5",cap:96,speed:6400},
    {id:"ram86",brand:"G.Skill",name:"G.Skill Flare X5 96GB DDR5-6400",model:"G.Skill Flare X5 96GB DDR5-6400",variantLabel:"G.Skill",price:675,perf:96,ramType:"DDR5",cap:96,speed:6400},
    {id:"ram87",brand:"G.Skill",name:"G.Skill Trident Z5 96GB DDR5-6400",model:"G.Skill Trident Z5 96GB DDR5-6400",variantLabel:"G.Skill",price:695,perf:96,ramType:"DDR5",cap:96,speed:6400},
    {id:"ram88",brand:"TeamGroup",name:"TeamGroup T-Force Delta 96GB DDR5-6400",model:"TeamGroup T-Force Delta 96GB DDR5-6400",variantLabel:"TeamGroup",price:735,perf:96,ramType:"DDR5",cap:96,speed:6400},
  ],
  storage: [
    {id:"ssd1",brand:"Crucial",name:"Crucial BX500 1TB",model:"Crucial BX500 1TB",variantLabel:"Crucial",price:170,perf:35,kind:"SATA",cap:1000,iface:"SATA"},
    {id:"ssd2",brand:"Crucial",name:"Crucial BX500 2TB",model:"Crucial BX500 2TB",variantLabel:"Crucial",price:330,perf:46,kind:"SATA",cap:2000,iface:"SATA"},
    {id:"ssd3",brand:"WD",name:"WD Blue SA510 1TB",model:"WD Blue SA510 1TB",variantLabel:"WD",price:165,perf:36,kind:"SATA",cap:1000,iface:"SATA"},
    {id:"ssd4",brand:"WD",name:"WD Blue SA510 2TB",model:"WD Blue SA510 2TB",variantLabel:"WD",price:310,perf:47,kind:"SATA",cap:2000,iface:"SATA"},
    {id:"ssd5",brand:"Samsung",name:"Samsung 870 EVO 1TB",model:"Samsung 870 EVO 1TB",variantLabel:"Samsung",price:185,perf:40,kind:"SATA",cap:1000,iface:"SATA"},
    {id:"ssd6",brand:"Samsung",name:"Samsung 870 EVO 2TB",model:"Samsung 870 EVO 2TB",variantLabel:"Samsung",price:360,perf:48,kind:"SATA",cap:2000,iface:"SATA"},
    {id:"ssd7",brand:"Samsung",name:"Samsung 870 EVO 4TB",model:"Samsung 870 EVO 4TB",variantLabel:"Samsung",price:760,perf:52,kind:"SATA",cap:4000,iface:"SATA"},
    {id:"ssd8",brand:"Crucial",name:"Crucial P3 Plus 1TB",model:"Crucial P3 Plus 1TB",variantLabel:"Crucial",price:165,perf:55,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd9",brand:"Crucial",name:"Crucial P3 Plus 2TB",model:"Crucial P3 Plus 2TB",variantLabel:"Crucial",price:295,perf:66,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd10",brand:"Crucial",name:"Crucial P3 Plus 4TB",model:"Crucial P3 Plus 4TB",variantLabel:"Crucial",price:690,perf:82,kind:"NVMe",cap:4000,iface:"M.2"},
    {id:"ssd11",brand:"WD",name:"WD Black SN770 1TB",model:"WD Black SN770 1TB",variantLabel:"WD",price:180,perf:62,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd12",brand:"WD",name:"WD Black SN770 2TB",model:"WD Black SN770 2TB",variantLabel:"WD",price:330,perf:72,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd13",brand:"Samsung",name:"Samsung 990 EVO 1TB",model:"Samsung 990 EVO 1TB",variantLabel:"Samsung",price:215,perf:60,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd14",brand:"Samsung",name:"Samsung 990 EVO 2TB",model:"Samsung 990 EVO 2TB",variantLabel:"Samsung",price:360,perf:70,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd15",brand:"Kingston",name:"Kingston NV3 1TB",model:"Kingston NV3 1TB",variantLabel:"Kingston",price:165,perf:58,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd16",brand:"Kingston",name:"Kingston NV3 2TB",model:"Kingston NV3 2TB",variantLabel:"Kingston",price:295,perf:68,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd17",brand:"Lexar",name:"Lexar NM790 1TB",model:"Lexar NM790 1TB",variantLabel:"Lexar",price:185,perf:64,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd18",brand:"Lexar",name:"Lexar NM790 2TB",model:"Lexar NM790 2TB",variantLabel:"Lexar",price:340,perf:76,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd19",brand:"Lexar",name:"Lexar NM790 4TB",model:"Lexar NM790 4TB",variantLabel:"Lexar",price:760,perf:86,kind:"NVMe",cap:4000,iface:"M.2"},
    {id:"ssd20",brand:"TeamGroup",name:"TeamGroup MP44 1TB",model:"TeamGroup MP44 1TB",variantLabel:"TeamGroup",price:175,perf:62,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd21",brand:"TeamGroup",name:"TeamGroup MP44 2TB",model:"TeamGroup MP44 2TB",variantLabel:"TeamGroup",price:315,perf:74,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd22",brand:"Crucial",name:"Crucial T500 1TB",model:"Crucial T500 1TB",variantLabel:"Crucial",price:205,perf:72,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd23",brand:"Crucial",name:"Crucial T500 2TB",model:"Crucial T500 2TB",variantLabel:"Crucial",price:360,perf:80,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd24",brand:"Crucial",name:"Crucial T500 4TB",model:"Crucial T500 4TB",variantLabel:"Crucial",price:810,perf:88,kind:"NVMe",cap:4000,iface:"M.2"},
    {id:"ssd25",brand:"Samsung",name:"Samsung 990 Pro 1TB",model:"Samsung 990 Pro 1TB",variantLabel:"Samsung",price:254,perf:78,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd26",brand:"Samsung",name:"Samsung 990 Pro 2TB",model:"Samsung 990 Pro 2TB",variantLabel:"Samsung",price:388,perf:84,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd27",brand:"Samsung",name:"Samsung 990 Pro 4TB",model:"Samsung 990 Pro 4TB",variantLabel:"Samsung",price:820,perf:92,kind:"NVMe",cap:4000,iface:"M.2"},
    {id:"ssd28",brand:"WD",name:"WD Black SN850X 1TB",model:"WD Black SN850X 1TB",variantLabel:"WD",price:215,perf:80,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd29",brand:"WD",name:"WD Black SN850X 2TB",model:"WD Black SN850X 2TB",variantLabel:"WD",price:390,perf:86,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd30",brand:"WD",name:"WD Black SN850X 4TB",model:"WD Black SN850X 4TB",variantLabel:"WD",price:820,perf:93,kind:"NVMe",cap:4000,iface:"M.2"},
    {id:"ssd31",brand:"Kingston",name:"Kingston KC3000 1TB",model:"Kingston KC3000 1TB",variantLabel:"Kingston",price:215,perf:78,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd32",brand:"Kingston",name:"Kingston KC3000 2TB",model:"Kingston KC3000 2TB",variantLabel:"Kingston",price:375,perf:85,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd33",brand:"Corsair",name:"Corsair MP600 GS 1TB",model:"Corsair MP600 GS 1TB",variantLabel:"Corsair",price:205,perf:76,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd34",brand:"Corsair",name:"Corsair MP600 GS 2TB",model:"Corsair MP600 GS 2TB",variantLabel:"Corsair",price:365,perf:84,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd35",brand:"Seagate",name:"Seagate FireCuda 530 1TB",model:"Seagate FireCuda 530 1TB",variantLabel:"Seagate",price:225,perf:80,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd36",brand:"Seagate",name:"Seagate FireCuda 530 2TB",model:"Seagate FireCuda 530 2TB",variantLabel:"Seagate",price:415,perf:87,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd37",brand:"Seagate",name:"Seagate FireCuda 530 4TB",model:"Seagate FireCuda 530 4TB",variantLabel:"Seagate",price:870,perf:93,kind:"NVMe",cap:4000,iface:"M.2"},
    {id:"ssd38",brand:"Sabrent",name:"Sabrent Rocket 4 Plus 1TB",model:"Sabrent Rocket 4 Plus 1TB",variantLabel:"Sabrent",price:215,perf:79,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd39",brand:"Sabrent",name:"Sabrent Rocket 4 Plus 2TB",model:"Sabrent Rocket 4 Plus 2TB",variantLabel:"Sabrent",price:385,perf:86,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd40",brand:"Crucial",name:"Crucial T705 Gen5 1TB",model:"Crucial T705 Gen5 1TB",variantLabel:"Crucial",price:285,perf:86,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd41",brand:"Crucial",name:"Crucial T705 Gen5 2TB",model:"Crucial T705 Gen5 2TB",variantLabel:"Crucial",price:545,perf:93,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd42",brand:"Crucial",name:"Crucial T705 Gen5 4TB",model:"Crucial T705 Gen5 4TB",variantLabel:"Crucial",price:1100,perf:97,kind:"NVMe",cap:4000,iface:"M.2"},
    {id:"ssd43",brand:"Samsung",name:"Samsung 9100 Pro Gen5 1TB",model:"Samsung 9100 Pro Gen5 1TB",variantLabel:"Samsung",price:315,perf:88,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd44",brand:"Samsung",name:"Samsung 9100 Pro Gen5 2TB",model:"Samsung 9100 Pro Gen5 2TB",variantLabel:"Samsung",price:580,perf:94,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd45",brand:"Samsung",name:"Samsung 9100 Pro Gen5 4TB",model:"Samsung 9100 Pro Gen5 4TB",variantLabel:"Samsung",price:1160,perf:98,kind:"NVMe",cap:4000,iface:"M.2"},
    {id:"ssd46",brand:"Sabrent",name:"Sabrent Rocket 5 Gen5 1TB",model:"Sabrent Rocket 5 Gen5 1TB",variantLabel:"Sabrent",price:295,perf:87,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd47",brand:"Sabrent",name:"Sabrent Rocket 5 Gen5 2TB",model:"Sabrent Rocket 5 Gen5 2TB",variantLabel:"Sabrent",price:555,perf:93,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd48",brand:"Corsair",name:"Corsair MP700 Gen5 1TB",model:"Corsair MP700 Gen5 1TB",variantLabel:"Corsair",price:290,perf:87,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd49",brand:"Corsair",name:"Corsair MP700 Gen5 2TB",model:"Corsair MP700 Gen5 2TB",variantLabel:"Corsair",price:565,perf:94,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd50",brand:"Crucial",name:"Crucial P310 1TB",model:"Crucial P310 1TB",variantLabel:"Crucial",price:180,perf:68,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd51",brand:"Crucial",name:"Crucial P310 2TB",model:"Crucial P310 2TB",variantLabel:"Crucial",price:305,perf:70,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd52",brand:"WD",name:"WD Blue SN5000 1TB",model:"WD Blue SN5000 1TB",variantLabel:"WD",price:165,perf:72,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd53",brand:"WD",name:"WD Blue SN5000 2TB",model:"WD Blue SN5000 2TB",variantLabel:"WD",price:295,perf:74,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd54",brand:"WD",name:"WD Green SN3000 1TB",model:"WD Green SN3000 1TB",variantLabel:"WD",price:145,perf:60,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd55",brand:"Samsung",name:"Samsung 980 Pro 1TB",model:"Samsung 980 Pro 1TB",variantLabel:"Samsung",price:210,perf:82,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd56",brand:"Samsung",name:"Samsung 980 Pro 2TB",model:"Samsung 980 Pro 2TB",variantLabel:"Samsung",price:390,perf:84,kind:"NVMe",cap:2000,iface:"M.2"},
    {id:"ssd57",brand:"Samsung",name:"Samsung 990 EVO Plus 1TB",model:"Samsung 990 EVO Plus 1TB",variantLabel:"Samsung",price:200,perf:78,kind:"NVMe",cap:1000,iface:"M.2"},
    {id:"ssd58",brand:"Samsung",name:"Samsung 990 EVO Plus 2TB",model:"Samsung 990 EVO Plus 2TB",variantLabel:"Samsung",price:320,perf:80,kind:"NVMe",cap:2000,iface:"M.2"},
  ],
  psu: [
    {id:"psu1",brand:"EVGA",name:"EVGA BR 500W",model:"EVGA BR 500W",variantLabel:"EVGA",price:60,perf:40,watt:500,eff:"Bronze"},
    {id:"psu2",brand:"EVGA",name:"EVGA BR 600W",model:"EVGA BR 600W",variantLabel:"EVGA",price:70,perf:44,watt:600,eff:"Bronze"},
    {id:"psu3",brand:"EVGA",name:"EVGA BR 700W",model:"EVGA BR 700W",variantLabel:"EVGA",price:80,perf:48,watt:700,eff:"Bronze"},
    {id:"psu4",brand:"MSI",name:"MSI MAG A-BN 550W",model:"MSI MAG A-BN 550W",variantLabel:"MSI",price:60,perf:44,watt:550,eff:"Bronze"},
    {id:"psu5",brand:"MSI",name:"MSI MAG A-BN 650W",model:"MSI MAG A-BN 650W",variantLabel:"MSI",price:70,perf:48,watt:650,eff:"Bronze"},
    {id:"psu6",brand:"MSI",name:"MSI MAG A-BN 750W",model:"MSI MAG A-BN 750W",variantLabel:"MSI",price:85,perf:52,watt:750,eff:"Bronze"},
    {id:"psu7",brand:"Corsair",name:"Corsair CX 650W",model:"Corsair CX 650W",variantLabel:"Corsair",price:75,perf:50,watt:650,eff:"Bronze"},
    {id:"psu8",brand:"Corsair",name:"Corsair CX 750W",model:"Corsair CX 750W",variantLabel:"Corsair",price:90,perf:54,watt:750,eff:"Bronze"},
    {id:"psu9",brand:"Thermaltake",name:"Thermaltake Smart BX1 600W",model:"Thermaltake Smart BX1 600W",variantLabel:"Thermaltake",price:65,perf:44,watt:600,eff:"Bronze"},
    {id:"psu10",brand:"Thermaltake",name:"Thermaltake Smart BX1 700W",model:"Thermaltake Smart BX1 700W",variantLabel:"Thermaltake",price:78,perf:48,watt:700,eff:"Bronze"},
    {id:"psu11",brand:"Cooler",name:"Cooler Master MWE Bronze 650W",model:"Cooler Master MWE Bronze 650W",variantLabel:"Cooler",price:70,perf:48,watt:650,eff:"Bronze"},
    {id:"psu12",brand:"Cooler",name:"Cooler Master MWE Bronze 750W",model:"Cooler Master MWE Bronze 750W",variantLabel:"Cooler",price:82,perf:52,watt:750,eff:"Bronze"},
    {id:"psu13",brand:"Corsair",name:"Corsair RMe 750W",model:"Corsair RMe 750W",variantLabel:"Corsair",price:110,perf:74,watt:750,eff:"Gold"},
    {id:"psu14",brand:"Corsair",name:"Corsair RMe 850W",model:"Corsair RMe 850W",variantLabel:"Corsair",price:130,perf:78,watt:850,eff:"Gold"},
    {id:"psu15",brand:"Corsair",name:"Corsair RMe 1000W",model:"Corsair RMe 1000W",variantLabel:"Corsair",price:180,perf:82,watt:1000,eff:"Gold"},
    {id:"psu16",brand:"Corsair",name:"Corsair RMx 850W",model:"Corsair RMx 850W",variantLabel:"Corsair",price:150,perf:82,watt:850,eff:"Gold"},
    {id:"psu17",brand:"Corsair",name:"Corsair RMx 1000W",model:"Corsair RMx 1000W",variantLabel:"Corsair",price:200,perf:84,watt:1000,eff:"Gold"},
    {id:"psu18",brand:"Seasonic",name:"Seasonic Focus GX 750W",model:"Seasonic Focus GX 750W",variantLabel:"Seasonic",price:120,perf:76,watt:750,eff:"Gold"},
    {id:"psu19",brand:"Seasonic",name:"Seasonic Focus GX 850W",model:"Seasonic Focus GX 850W",variantLabel:"Seasonic",price:140,perf:80,watt:850,eff:"Gold"},
    {id:"psu20",brand:"Seasonic",name:"Seasonic Focus GX 1000W",model:"Seasonic Focus GX 1000W",variantLabel:"Seasonic",price:190,perf:84,watt:1000,eff:"Gold"},
    {id:"psu21",brand:"MSI",name:"MSI MAG A-GL 750W",model:"MSI MAG A-GL 750W",variantLabel:"MSI",price:110,perf:74,watt:750,eff:"Gold"},
    {id:"psu22",brand:"MSI",name:"MSI MAG A-GL 850W",model:"MSI MAG A-GL 850W",variantLabel:"MSI",price:125,perf:78,watt:850,eff:"Gold"},
    {id:"psu23",brand:"be",name:"be quiet! Pure Power 12 750W",model:"be quiet! Pure Power 12 750W",variantLabel:"be",price:115,perf:76,watt:750,eff:"Gold"},
    {id:"psu24",brand:"be",name:"be quiet! Pure Power 12 850W",model:"be quiet! Pure Power 12 850W",variantLabel:"be",price:135,perf:80,watt:850,eff:"Gold"},
    {id:"psu25",brand:"Cooler",name:"Cooler Master V Gold 750W",model:"Cooler Master V Gold 750W",variantLabel:"Cooler",price:120,perf:78,watt:750,eff:"Gold"},
    {id:"psu26",brand:"Cooler",name:"Cooler Master V Gold 850W",model:"Cooler Master V Gold 850W",variantLabel:"Cooler",price:140,perf:82,watt:850,eff:"Gold"},
    {id:"psu27",brand:"NZXT",name:"NZXT C 750W",model:"NZXT C 750W",variantLabel:"NZXT",price:115,perf:76,watt:750,eff:"Gold"},
    {id:"psu28",brand:"NZXT",name:"NZXT C 850W",model:"NZXT C 850W",variantLabel:"NZXT",price:135,perf:80,watt:850,eff:"Gold"},
    {id:"psu29",brand:"ASUS",name:"ASUS TUF Gaming 750W",model:"ASUS TUF Gaming 750W",variantLabel:"ASUS",price:120,perf:78,watt:750,eff:"Gold"},
    {id:"psu30",brand:"ASUS",name:"ASUS TUF Gaming 850W",model:"ASUS TUF Gaming 850W",variantLabel:"ASUS",price:145,perf:82,watt:850,eff:"Gold"},
    {id:"psu31",brand:"Thermaltake",name:"Thermaltake Toughpower GF 850W",model:"Thermaltake Toughpower GF 850W",variantLabel:"Thermaltake",price:140,perf:80,watt:850,eff:"Gold"},
    {id:"psu32",brand:"Thermaltake",name:"Thermaltake Toughpower GF 1000W",model:"Thermaltake Toughpower GF 1000W",variantLabel:"Thermaltake",price:195,perf:84,watt:1000,eff:"Gold"},
    {id:"psu33",brand:"Corsair",name:"Corsair SF 750W",model:"Corsair SF 750W",variantLabel:"Corsair",price:150,perf:86,watt:750,eff:"Gold"},
    {id:"psu34",brand:"Corsair",name:"Corsair SF 850W",model:"Corsair SF 850W",variantLabel:"Corsair",price:170,perf:88,watt:850,eff:"Gold"},
    {id:"psu35",brand:"be",name:"be quiet! Straight Power 12 850W",model:"be quiet! Straight Power 12 850W",variantLabel:"be",price:180,perf:90,watt:850,eff:"Platinum"},
    {id:"psu36",brand:"be",name:"be quiet! Straight Power 12 1000W",model:"be quiet! Straight Power 12 1000W",variantLabel:"be",price:210,perf:92,watt:1000,eff:"Platinum"},
    {id:"psu37",brand:"be",name:"be quiet! Straight Power 12 1200W",model:"be quiet! Straight Power 12 1200W",variantLabel:"be",price:280,perf:94,watt:1200,eff:"Platinum"},
    {id:"psu38",brand:"Corsair",name:"Corsair HX 1000W",model:"Corsair HX 1000W",variantLabel:"Corsair",price:230,perf:93,watt:1000,eff:"Platinum"},
    {id:"psu39",brand:"Corsair",name:"Corsair HX 1200W",model:"Corsair HX 1200W",variantLabel:"Corsair",price:290,perf:95,watt:1200,eff:"Platinum"},
    {id:"psu40",brand:"Seasonic",name:"Seasonic Vertex GX 1000W",model:"Seasonic Vertex GX 1000W",variantLabel:"Seasonic",price:200,perf:91,watt:1000,eff:"Platinum"},
    {id:"psu41",brand:"Seasonic",name:"Seasonic Vertex GX 1200W",model:"Seasonic Vertex GX 1200W",variantLabel:"Seasonic",price:270,perf:94,watt:1200,eff:"Platinum"},
    {id:"psu42",brand:"ASUS",name:"ASUS ROG Strix 1000W",model:"ASUS ROG Strix 1000W",variantLabel:"ASUS",price:250,perf:93,watt:1000,eff:"Platinum"},
    {id:"psu43",brand:"Seasonic",name:"Seasonic Prime TX 1000W",model:"Seasonic Prime TX 1000W",variantLabel:"Seasonic",price:300,perf:97,watt:1000,eff:"Titanium"},
    {id:"psu44",brand:"Seasonic",name:"Seasonic Prime TX 1300W",model:"Seasonic Prime TX 1300W",variantLabel:"Seasonic",price:400,perf:99,watt:1300,eff:"Titanium"},
    {id:"psu45",brand:"Corsair",name:"Corsair AX 1200W",model:"Corsair AX 1200W",variantLabel:"Corsair",price:360,perf:98,watt:1200,eff:"Titanium"},
    {id:"psu46",brand:"Corsair",name:"Corsair AX 1600W",model:"Corsair AX 1600W",variantLabel:"Corsair",price:500,perf:99,watt:1600,eff:"Titanium"},
    {id:"psu47",brand:"be quiet!",name:"be quiet! Pure Power 13 M 750W",model:"be quiet! Pure Power 13 M 750W",variantLabel:"be quiet!",price:110,perf:64,watt:750,eff:"Gold"},
    {id:"psu48",brand:"be quiet!",name:"be quiet! Pure Power 13 M 850W",model:"be quiet! Pure Power 13 M 850W",variantLabel:"be quiet!",price:130,perf:66,watt:850,eff:"Gold"},
    {id:"psu49",brand:"be quiet!",name:"be quiet! Pure Power 13 M 1000W",model:"be quiet! Pure Power 13 M 1000W",variantLabel:"be quiet!",price:160,perf:70,watt:1000,eff:"Gold"},
    {id:"psu50",brand:"be quiet!",name:"be quiet! Pure Power 13 M 1200W",model:"be quiet! Pure Power 13 M 1200W",variantLabel:"be quiet!",price:190,perf:73,watt:1200,eff:"Gold"},
    {id:"psu51",brand:"be quiet!",name:"be quiet! Dark Power 13 850W",model:"be quiet! Dark Power 13 850W",variantLabel:"be quiet!",price:230,perf:88,watt:850,eff:"Titanium"},
    {id:"psu52",brand:"be quiet!",name:"be quiet! Power Zone 2 850W",model:"be quiet! Power Zone 2 850W",variantLabel:"be quiet!",price:150,perf:66,watt:850,eff:"Gold"},
    {id:"psu53",brand:"EVGA",name:"EVGA SuperNOVA 750 GM",model:"EVGA SuperNOVA 750 GM",variantLabel:"EVGA",price:110,perf:74,watt:750,eff:"Gold"},
    {id:"psu54",brand:"Seasonic",name:"Seasonic Vertex PX 1000W",model:"Seasonic Vertex PX 1000W",variantLabel:"Seasonic",price:230,perf:90,watt:1000,eff:"Platinum"},
    {id:"psu55",brand:"Seasonic",name:"Seasonic Prime TX 1600W",model:"Seasonic Prime TX 1600W",variantLabel:"Seasonic",price:550,perf:99,watt:1600,eff:"Titanium"},
    {id:"psu56",brand:"Seasonic",name:"Seasonic Core GX 850W",model:"Seasonic Core GX 850W",variantLabel:"Seasonic",price:120,perf:72,watt:850,eff:"Gold"},
    {id:"psu57",brand:"Gigabyte",name:"Gigabyte UD750GM PG5",model:"Gigabyte UD750GM PG5",variantLabel:"Gigabyte",price:110,perf:72,watt:750,eff:"Gold"},
    {id:"psu58",brand:"Gigabyte",name:"Gigabyte UD1000GM",model:"Gigabyte UD1000GM",variantLabel:"Gigabyte",price:150,perf:78,watt:1000,eff:"Gold"},
    {id:"psu59",brand:"Corsair",name:"Corsair AX860",model:"Corsair AX860",variantLabel:"Corsair",price:250,perf:88,watt:860,eff:"Platinum"},
    {id:"psu60",brand:"ASUS",name:"ASUS Prime 750W Gold",model:"ASUS Prime 750W Gold",variantLabel:"ASUS",price:100,perf:72,watt:750,eff:"Gold"},
    {id:"psu61",brand:"be quiet!",name:"be quiet! Dark Power 13 750W",model:"be quiet! Dark Power 13 750W",variantLabel:"be quiet!",price:200,perf:86,watt:750,eff:"Titanium"},
  ],
  case: [
    {id:"cs1",brand:"Cooler Master",name:"Cooler Master Q300L V2",model:"Q300L V2",variantLabel:"Cooler Master",price:55,perf:52,forms:["ITX","mATX"],maxGpu:360,maxCool:159},
    {id:"cs2",brand:"Cooler Master",name:"Cooler Master NR200P",model:"NR200P",variantLabel:"Cooler Master",price:90,perf:60,forms:["ITX"],maxGpu:330,maxCool:155},
    {id:"cs3",brand:"Cooler Master",name:"Cooler Master MasterBox TD500",model:"MasterBox TD500",variantLabel:"Cooler Master",price:100,perf:72,forms:["ITX","mATX","ATX"],maxGpu:410,maxCool:165},
    {id:"cs4",brand:"Montech",name:"Montech AIR 903 MAX",model:"AIR 903 MAX",variantLabel:"Montech",price:75,perf:66,forms:["ITX","mATX","ATX"],maxGpu:400,maxCool:175},
    {id:"cs5",brand:"Montech",name:"Montech XR",model:"XR",variantLabel:"Montech",price:90,perf:70,forms:["ITX","mATX","ATX"],maxGpu:400,maxCool:170},
    {id:"cs6",brand:"Lian Li",name:"Lian Li Lancool 207",model:"Lancool 207",variantLabel:"Lian Li",price:100,perf:74,forms:["ITX","mATX","ATX"],maxGpu:380,maxCool:175},
    {id:"cs7",brand:"Lian Li",name:"Lian Li Lancool 216",model:"Lancool 216",variantLabel:"Lian Li",price:110,perf:78,forms:["ITX","mATX","ATX"],maxGpu:392,maxCool:180},
    {id:"cs8",brand:"Lian Li",name:"Lian Li O11 Dynamic EVO",model:"O11 Dynamic EVO",variantLabel:"Lian Li",price:170,perf:85,forms:["ITX","mATX","ATX"],maxGpu:420,maxCool:167},
    {id:"cs9",brand:"Lian Li",name:"Lian Li O11 Vision",model:"O11 Vision",variantLabel:"Lian Li",price:190,perf:86,forms:["ITX","mATX","ATX"],maxGpu:452,maxCool:167},
    {id:"cs10",brand:"Corsair",name:"Corsair 4000D Airflow",model:"4000D Airflow",variantLabel:"Corsair",price:105,perf:76,forms:["ITX","mATX","ATX"],maxGpu:360,maxCool:170},
    {id:"cs11",brand:"Corsair",name:"Corsair 3500X",model:"3500X",variantLabel:"Corsair",price:115,perf:80,forms:["ITX","mATX","ATX"],maxGpu:400,maxCool:170},
    {id:"cs12",brand:"NZXT",name:"NZXT H6 Flow",model:"H6 Flow",variantLabel:"NZXT",price:110,perf:74,forms:["ITX","mATX","ATX"],maxGpu:365,maxCool:163},
    {id:"cs13",brand:"NZXT",name:"NZXT H7 Flow",model:"H7 Flow",variantLabel:"NZXT",price:130,perf:80,forms:["ITX","mATX","ATX"],maxGpu:400,maxCool:185},
    {id:"cs14",brand:"be quiet!",name:"be quiet! Pure Base 500DX",model:"Pure Base 500DX",variantLabel:"be quiet!",price:110,perf:78,forms:["ITX","mATX","ATX"],maxGpu:369,maxCool:190},
    {id:"cs15",brand:"Fractal",name:"Fractal Pop Air",model:"Pop Air",variantLabel:"Fractal",price:100,perf:72,forms:["ITX","mATX","ATX"],maxGpu:380,maxCool:170},
    {id:"cs16",brand:"Fractal",name:"Fractal North",model:"North",variantLabel:"Fractal",price:150,perf:82,forms:["ITX","mATX","ATX"],maxGpu:355,maxCool:170},
    {id:"cs17",brand:"Fractal",name:"Fractal Ridge ITX",model:"Ridge ITX",variantLabel:"Fractal",price:130,perf:64,forms:["ITX"],maxGpu:325,maxCool:70},
    {id:"cs18",brand:"Fractal",name:"Fractal Meshify 2",model:"Meshify 2",variantLabel:"Fractal",price:160,perf:84,forms:["ITX","mATX","ATX"],maxGpu:460,maxCool:185},
    {id:"cs19",brand:"Hyte",name:"Hyte Y70",model:"Y70",variantLabel:"Hyte",price:200,perf:88,forms:["ITX","mATX","ATX"],maxGpu:422,maxCool:180},
    {id:"cs20",brand:"Phanteks",name:"Phanteks NV7",model:"NV7",variantLabel:"Phanteks",price:190,perf:86,forms:["ITX","mATX","ATX"],maxGpu:440,maxCool:185},
    {id:"cs21",brand:"Phanteks",name:"Phanteks Eclipse G360A",model:"Eclipse G360A",variantLabel:"Phanteks",price:100,perf:74,forms:["ITX","mATX","ATX"],maxGpu:400,maxCool:162},
    {id:"cs22",brand:"Thermaltake",name:"Thermaltake Tower 300 mATX",model:"Tower 300 mATX",variantLabel:"Thermaltake",price:140,perf:76,forms:["ITX","mATX"],maxGpu:380,maxCool:180},
    {id:"cs23",brand:"Lian Li",name:"Lian Li Lancool 217",model:"Lancool 217",variantLabel:"Lian Li",price:110,perf:72,forms:["ATX","mATX","ITX"],maxGpu:392,maxCool:176},
    {id:"cs24",brand:"be quiet!",name:"be quiet! Pure Base 501",model:"Pure Base 501",variantLabel:"be quiet!",price:100,perf:66,forms:["ATX","mATX","ITX"],maxGpu:430,maxCool:190},
    {id:"cs25",brand:"Phanteks",name:"Phanteks Eclipse G400A",model:"Eclipse G400A",variantLabel:"Phanteks",price:90,perf:64,forms:["ATX","mATX","ITX"],maxGpu:420,maxCool:185},
  ],
  cooler: [
    {id:"cl1",brand:"AMD",name:"AMD Wraith Stealth",model:"Wraith Stealth",variantLabel:"AMD",price:20,perf:30,sockets:["AM4","AM5"],height:65,tdpRating:65,type:"air"},
    {id:"cl2",brand:"Intel",name:"Intel Laminar RM1",model:"Laminar RM1",variantLabel:"Intel",price:20,perf:28,sockets:["LGA1700","LGA1851","LGA1200"],height:47,tdpRating:65,type:"air"},
    {id:"cl3",brand:"Cooler Master",name:"Cooler Master Hyper 212 Black",model:"Hyper 212 Black",variantLabel:"Cooler Master",price:40,perf:55,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:159,tdpRating:150,type:"air"},
    {id:"cl4",brand:"be quiet!",name:"be quiet! Pure Rock 2",model:"Pure Rock 2",variantLabel:"be quiet!",price:45,perf:60,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:155,tdpRating:150,type:"air"},
    {id:"cl5",brand:"ID-Cooling",name:"ID-Cooling SE-214 XT",model:"SE-214 XT",variantLabel:"ID-Cooling",price:20,perf:45,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:150,tdpRating:150,type:"air"},
    {id:"cl6",brand:"Thermalright",name:"Thermalright Assassin X120 R SE",model:"Assassin X120 R SE",variantLabel:"Thermalright",price:25,perf:55,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:155,tdpRating:160,type:"air"},
    {id:"cl7",brand:"Thermalright",name:"Thermalright Peerless Assassin 120 SE",model:"Peerless Assassin 120 SE",variantLabel:"Thermalright",price:40,perf:78,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:155,tdpRating:245,type:"air"},
    {id:"cl8",brand:"Thermalright",name:"Thermalright Phantom Spirit 120 SE",model:"Phantom Spirit 120 SE",variantLabel:"Thermalright",price:45,perf:82,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:157,tdpRating:245,type:"air"},
    {id:"cl9",brand:"DeepCool",name:"DeepCool AK400",model:"AK400",variantLabel:"DeepCool",price:40,perf:72,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:155,tdpRating:220,type:"air"},
    {id:"cl10",brand:"DeepCool",name:"DeepCool AK620",model:"AK620",variantLabel:"DeepCool",price:65,perf:82,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:160,tdpRating:260,type:"air"},
    {id:"cl11",brand:"Noctua",name:"Noctua NH-U12S redux",model:"NH-U12S redux",variantLabel:"Noctua",price:55,perf:80,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:158,tdpRating:180,type:"air"},
    {id:"cl12",brand:"Noctua",name:"Noctua NH-D15 G2",model:"NH-D15 G2",variantLabel:"Noctua",price:150,perf:92,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:168,tdpRating:290,type:"air"},
    {id:"cl13",brand:"Noctua",name:"Noctua NH-L9i low-profile",model:"NH-L9i low-profile",variantLabel:"Noctua",price:55,perf:50,sockets:["LGA1700","LGA1851","LGA1200"],height:37,tdpRating:95,type:"air"},
    {id:"cl14",brand:"be quiet!",name:"be quiet! Dark Rock Pro 5",model:"Dark Rock Pro 5",variantLabel:"be quiet!",price:100,perf:90,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:168,tdpRating:270,type:"air"},
    {id:"cl15",brand:"Arctic",name:"Arctic Liquid Freezer III 240",model:"Liquid Freezer III 240",variantLabel:"Arctic",price:95,perf:85,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:280,type:"aio"},
    {id:"cl16",brand:"Arctic",name:"Arctic Liquid Freezer III 280",model:"Liquid Freezer III 280",variantLabel:"Arctic",price:110,perf:88,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:300,type:"aio"},
    {id:"cl17",brand:"Arctic",name:"Arctic Liquid Freezer III 360",model:"Liquid Freezer III 360",variantLabel:"Arctic",price:120,perf:95,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:360,type:"aio"},
    {id:"cl18",brand:"Corsair",name:"Corsair iCUE H100i",model:"iCUE H100i",variantLabel:"Corsair",price:130,perf:82,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:250,type:"aio"},
    {id:"cl19",brand:"Corsair",name:"Corsair iCUE H150i",model:"iCUE H150i",variantLabel:"Corsair",price:180,perf:90,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:350,type:"aio"},
    {id:"cl20",brand:"NZXT",name:"NZXT Kraken 240",model:"Kraken 240",variantLabel:"NZXT",price:150,perf:86,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:280,type:"aio"},
    {id:"cl21",brand:"NZXT",name:"NZXT Kraken 360",model:"Kraken 360",variantLabel:"NZXT",price:200,perf:92,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:350,type:"aio"},
    {id:"cl22",brand:"Lian Li",name:"Lian Li Galahad II 360",model:"Galahad II 360",variantLabel:"Lian Li",price:190,perf:93,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:350,type:"aio"},
    {id:"cl23",brand:"DeepCool",name:"DeepCool LS520",model:"LS520",variantLabel:"DeepCool",price:100,perf:85,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:280,type:"aio"},
    {id:"cl24",brand:"Thermalright",name:"Thermalright Frozen Notte 360",model:"Frozen Notte 360",variantLabel:"Thermalright",price:90,perf:90,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:55,tdpRating:350,type:"aio"},
    {id:"cl25",brand:"be quiet!",name:"be quiet! Pure Rock Pro 3",model:"Pure Rock Pro 3",variantLabel:"be quiet!",price:55,perf:72,sockets:["AM4","AM5","LGA1700","LGA1851","LGA1200"],height:162,tdpRating:190,type:"air"},
    {id:"cl26",brand:"AMD",name:"AMD Wraith Prism",model:"Wraith Prism",variantLabel:"AMD",price:35,perf:40,sockets:["AM4"],height:75,tdpRating:105,type:"air"},
  ],
};

const CATEGORY_ORDER = ["cpu", "gpu", "mobo", "ram", "storage", "psu", "case", "cooler"];
const CAT_META = {
  cpu:     { label: "CPU",          Icon: Cpu },
  gpu:     { label: "Graphics Card",Icon: MonitorPlay },
  mobo:    { label: "Motherboard",  Icon: CircuitBoard },
  ram:     { label: "Memory",       Icon: MemoryStick },
  storage: { label: "Storage",      Icon: HardDrive },
  psu:     { label: "Power Supply", Icon: Power },
  case:    { label: "Case",         Icon: Box },
  cooler:  { label: "CPU Cooler",   Icon: Fan },
};

/* The allocation table — the "secret sauce". % of budget per category. */
const USE_CASES = {
  gaming:      { label: "Gaming",          tag: "Max FPS",            Icon: Gamepad2,    alloc: { gpu:30, cpu:15, mobo:9, ram:18, storage:10, psu:7, case:6, cooler:5 } },
  content:     { label: "Content Creation",tag: "Video & Photo",      Icon: Clapperboard,alloc: { gpu:18, cpu:22, mobo:10, ram:22, storage:15, psu:6, case:4, cooler:3 } },
  streaming:   { label: "Streaming",       tag: "Play & Broadcast",   Icon: Radio,       alloc: { gpu:26, cpu:19, mobo:10, ram:18, storage:10, psu:7, case:5, cooler:5 } },
  workstation: { label: "3D / Workstation",tag: "Render & CAD",       Icon: Boxes,       alloc: { gpu:22, cpu:24, mobo:9, ram:24, storage:10, psu:5, case:3, cooler:3 } },
  ai:          { label: "AI / ML",         tag: "VRAM Hungry",        Icon: BrainCircuit,alloc: { gpu:38, cpu:13, mobo:8, ram:20, storage:8, psu:6, case:4, cooler:3 } },
  office:      { label: "Office / Everyday",tag: "Snappy & Cheap",    Icon: Briefcase,   alloc: { gpu:0, cpu:24, mobo:13, ram:26, storage:20, psu:8, case:6, cooler:3 } },
};

// The six selectable use cases (captured before any blended keys are registered).
const BASE_UC_KEYS = Object.keys(USE_CASES);

// Register (and cache) a blended use case from multiple base keys. The blend gets an
// averaged budget allocation and a `blend` list; ucPerf() averages the picks across
// the listed base cases. Returns the single key (real or blended) to use everywhere.
function makeUseCase(keys) {
  keys = (keys || []).filter((k) => BASE_UC_KEYS.includes(k));
  if (keys.length <= 1) return keys[0] || "gaming";
  const key = [...keys].sort().join("+");
  if (!USE_CASES[key]) {
    const alloc = {};
    for (const c of CATEGORY_ORDER) alloc[c] = Math.round(keys.reduce((s, k) => s + (USE_CASES[k].alloc[c] || 0), 0) / keys.length);
    USE_CASES[key] = {
      label: keys.map((k) => USE_CASES[k].label).join(" + "),
      tag: "Multi-purpose",
      Icon: USE_CASES[keys[0]].Icon,
      alloc,
      blend: keys,
    };
  }
  return key;
}
// Re-register a blended key (e.g. from a saved build) if it isn't present yet.
function ensureUseCase(key) {
  if (!key || USE_CASES[key]) return key;
  return key.indexOf("+") >= 0 ? makeUseCase(key.split("+")) : key;
}

const MAX_PERF = Object.fromEntries(
  CATEGORY_ORDER.map((c) => [c, Math.max(...CATALOG[c].map((p) => p.perf))])
);
const CATALOG_COUNT = Object.values(CATALOG).reduce((s, a) => s + a.length, 0);

// Attach product image + link to each part (refreshed live by /api/prices when available).
for (const _c in CATALOG) for (const _p of CATALOG[_c]) { const _m = MEDIA[_p.id]; if (_m) { _p.img = _m.img; _p.url = _m.url; } }

let PRICE_LIVE = false; // set true once live pricing has loaded
const partOOS = (p) => PRICE_LIVE && p && p._live === false; // out of stock = no live price
const fmt = (n) => "$" + (Number.isInteger(Number(n)) ? Number(n).toLocaleString() : Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ----------------------------- SCORING ----------------------------- */
// Use-case-aware performance: the same part is worth more or less depending on
// what you're building for. Gaming leans on the base (gaming-weighted) score;
// productivity rewards CPU cores; AI/content reward GPU VRAM; workstation/AI/
// content reward RAM & storage capacity; gaming treats 32GB RAM as the sweet spot.
function ucPerf(cat, part, uc) {
  const U = USE_CASES[uc];
  if (U && U.blend) { // blended use case: average the picks across its base cases
    let s = 0; for (const k of U.blend) s += ucPerf(cat, part, k); return s / U.blend.length;
  }
  const heavyRam = uc === "workstation" || uc === "ai" || uc === "content";
  switch (cat) {
    case "cpu":
      if (uc === "content" || uc === "workstation" || uc === "ai")
        return part.perf * 0.6 + (Math.min(part.cores, 16) / 16) * 100 * 0.4;
      // gaming / streaming: large-cache X3D chips punch far above their base rating —
      // a 7600X3D out-games a Core Ultra 5 / non-X3D Ryzen despite a lower MT score.
      // No 100 cap here, so a 9800X3D still edges out a 7800X3D at the very top.
      if ((uc === "gaming" || uc === "streaming") && /X3D/i.test(part.name || part.model || ""))
        return part.perf + 10;
      return part.perf;
    case "gpu":
      if (uc === "ai") return part.perf * 0.5 + (Math.min(part.vram, 32) / 32) * 100 * 0.5;
      if (uc === "content") return part.perf * 0.7 + (Math.min(part.vram, 32) / 32) * 100 * 0.3;
      return part.perf;
    case "ram": {
      // value-aware speed: peaks at DDR5-6000 (the CL30 sweet spot). Faster kits
      // (6400/7200) cost more for no real-world gain, so they score LOWER; slower dips too.
      const sp = part.speed <= 6000
        ? (part.speed / 6000) * 50
        : Math.max(20, 50 - ((part.speed - 6000) / 100) * 1.5);
      if (heavyRam) return sp * 0.4 + (Math.min(part.cap, 96) / 96) * 100 * 0.6; // capacity-led
      return sp + (part.cap >= 32 ? 50 : (part.cap / 32) * 50); // 32GB is the sweet spot
    }
    case "storage":
      if (uc === "content" || uc === "workstation")
        return part.perf * 0.5 + (Math.min(part.cap, 4000) / 4000) * 100 * 0.5;
      // gaming / streaming / office: reward capacity up to 2TB (so roomy budgets pick 2TB)
      return part.perf * 0.6 + (Math.min(part.cap, 2000) / 2000) * 100 * 0.4;
    default:
      return part.perf; // mobo, psu, case, cooler: use-case agnostic
  }
}
const _ucMax = {};
function ucMaxPerf(cat, uc) {
  const k = cat + "|" + uc;
  if (_ucMax[k] == null) _ucMax[k] = Math.max(...CATALOG[cat].map((p) => ucPerf(cat, p, uc)));
  return _ucMax[k];
}

// Best use-case performance among parts that actually FIT the category's budget band
// (with a little stretch). Part scores are normalized against THIS, not the global
// 5090-tier ceiling — so the best part you can afford in a slot scores ~100, and a
// budget pick only looks weak in a build where you could have afforded much more.
const _affMax = {};
function affordableMaxPerf(cat, band, useCase) {
  const k = cat + "|" + Math.round(band) + "|" + useCase;
  if (_affMax[k] == null) {
    const cap = band > 0 ? band * 1.1 : Infinity;
    let mx = 0;
    for (const p of CATALOG[cat]) if (p.price <= cap) { const v = ucPerf(cat, p, useCase); if (v > mx) mx = v; }
    _affMax[k] = mx || ucMaxPerf(cat, useCase); // fall back to global if nothing fits
  }
  return _affMax[k];
}

// Diminishing-returns ceilings: spending past these on a category is poor value,
// so the part's score is reduced (but it is NOT flagged over budget).
const VALUE_CEILING = { mobo: 250 };

// Newer GPUs are preferred — older cards are often out of stock or used-only.
function modernityFactor(part) {
  if (part.cat !== "gpu") return 1;
  const m = part.model || part.name || "";
  if (/RTX\s?50|RX\s?90|Arc\s?B/i.test(m)) return 1;      // current gen, in stock
  if (/RTX\s?40|RX\s?7[6-9]00/i.test(m)) return 0.9;      // last gen, still available
  return 0.78;                                            // older — often out of stock / used
}

// Per-part score: within the category budget band, more (use-case-relevant)
// performance is better; going over the band lowers the score gradually (a little
// over barely hurts), and current-gen GPUs get a preference for availability.
function partScore(part, band, useCase) {
  const norm =
    part.cat && useCase
      ? clamp(ucPerf(part.cat, part, useCase) / affordableMaxPerf(part.cat, band, useCase), 0, 1.15)
      : part.cat
      ? part.perf / MAX_PERF[part.cat]
      : part.perf / 100;
  // value ceiling: spending past it (e.g. >$250 on a motherboard) just lowers the
  // score for poor value — it does NOT flag the part as "over budget".
  let vmult = 1;
  const ceil = part.cat ? VALUE_CEILING[part.cat] : undefined;
  if (ceil && part.price > ceil) vmult = Math.max(0.45, 1 - (part.price / ceil - 1) * 0.45);
  let mult = 1;
  if (band > 0) {
    const r = part.price / band;
    if (r > 1) mult = Math.max(0.3, 1 - (r - 1) * 0.3); // gentle, gradual — a little over barely dents it
  } else if (part.price > 0) {
    mult = 0.4; // category isn't budgeted for at all (e.g. discrete GPU on an office build)
  }
  return Math.round(clamp(norm * 100 * mult * vmult * modernityFactor(part), 0, 100));
}
function budgetStatus(price, band) {
  if (band <= 0) return price > 0 ? "over" : "within";
  const r = price / band;
  if (r <= 1) return "within";
  if (r <= 1.25) return "tight";
  return "over";
}

/* ----------------------------- COMPATIBILITY ----------------------------- */
function requiredWatts(parts) {
  const cpu = parts.cpu?.tdp || 0;
  const gpu = parts.gpu?.tdp || 0;
  return cpu + gpu + 100; // ~100W system overhead
}
function checkCompat(parts) {
  const issues = [];
  const ok = [];
  const { cpu, gpu, mobo, ram, storage, psu, cooler } = parts;
  const cse = parts.case;

  if (cpu && mobo) {
    (cpu.socket === mobo.socket ? ok : issues).push(
      cpu.socket === mobo.socket
        ? `CPU socket ${cpu.socket} matches the motherboard`
        : `CPU socket ${cpu.socket} does not fit the ${mobo.socket} motherboard`
    );
  }
  if (ram && mobo) {
    (ram.ramType === mobo.ramType ? ok : issues).push(
      ram.ramType === mobo.ramType
        ? `${ram.ramType} memory matches the motherboard`
        : `${ram.ramType} memory won't work in a ${mobo.ramType} motherboard`
    );
    if (ram.cap > mobo.maxRam) issues.push(`Memory (${ram.cap}GB) exceeds the board's ${mobo.maxRam}GB limit`);
  }
  if (cooler && cpu) {
    (cooler.sockets.includes(cpu.socket) ? ok : issues).push(
      cooler.sockets.includes(cpu.socket)
        ? `Cooler supports the ${cpu.socket} socket`
        : `Cooler doesn't support the ${cpu.socket} socket`
    );
    (cooler.tdpRating >= cpu.tdp ? ok : issues).push(
      cooler.tdpRating >= cpu.tdp
        ? `Cooler handles the CPU's ${cpu.tdp}W heat output`
        : `Cooler is rated ${cooler.tdpRating}W — under the CPU's ${cpu.tdp}W`
    );
  }
  if (mobo && cse) {
    (cse.forms.includes(mobo.form) ? ok : issues).push(
      cse.forms.includes(mobo.form)
        ? `Case fits a ${mobo.form} motherboard`
        : `Case can't fit a ${mobo.form} motherboard`
    );
  }
  if (gpu && cse) {
    (gpu.len <= cse.maxGpu ? ok : issues).push(
      gpu.len <= cse.maxGpu
        ? `GPU (${gpu.len}mm) fits the case`
        : `GPU is ${gpu.len}mm — too long for this case (${cse.maxGpu}mm max)`
    );
  }
  if (cooler && cse && cooler.type === "air") {
    (cooler.height <= cse.maxCool ? ok : issues).push(
      cooler.height <= cse.maxCool
        ? `Air cooler clears the case`
        : `Cooler is ${cooler.height}mm tall — case allows ${cse.maxCool}mm`
    );
  }
  if (storage && mobo && storage.iface === "M.2") {
    (mobo.m2 >= 1 ? ok : issues).push(
      mobo.m2 >= 1 ? `M.2 slot available for the NVMe drive` : `No M.2 slot on this motherboard`
    );
  }
  if (psu) {
    const need = requiredWatts(parts);
    const safe = Math.ceil((need * 1.25) / 50) * 50;
    (psu.watt >= need * 1.25 ? ok : issues).push(
      psu.watt >= need * 1.25
        ? `${psu.watt}W PSU comfortably powers the build (~${need}W draw)`
        : `${psu.watt}W PSU is light — this build wants ~${safe}W`
    );
  }
  return { issues, ok, pass: issues.length === 0 };
}

// True if the part in `cat` introduces no compatibility issue beyond what the
// rest of the build already has. Used to zero out the score of incompatible parts.
function isPartCompatible(parts, cat) {
  if (!parts[cat]) return true;
  const withIssues = checkCompat(parts).issues.length;
  const rest = { ...parts };
  delete rest[cat];
  const withoutIssues = checkCompat(rest).issues.length;
  return withIssues <= withoutIssues;
}

/* ----------------------------- BUILD ANALYSIS ----------------------------- */
function buildPerfNorm(parts, alloc, useCase) {
  // weighted, normalized (use-case-relevant) performance of the whole build
  let sum = 0, wsum = 0;
  for (const c of CATEGORY_ORDER) {
    const w = alloc[c] || 0;
    if (w === 0) continue;
    const p = parts[c];
    const norm = p ? ucPerf(c, p, useCase) / ucMaxPerf(c, useCase) : 0;
    sum += w * norm;
    wsum += w;
  }
  return wsum ? sum / wsum : 0; // 0..1
}
function analyzeBuild(parts, useCaseKey, budget) {
  const uc = USE_CASES[useCaseKey];
  const alloc = uc.alloc;
  const compat = checkCompat(parts);
  const total = CATEGORY_ORDER.reduce((s, c) => s + (parts[c]?.price || 0), 0);
  const fitNorm = buildPerfNorm(parts, alloc, useCaseKey); // 0..1

  // balance / bottleneck (only where both GPU & CPU are weighted)
  const cpuNorm = parts.cpu ? ucPerf("cpu", parts.cpu, useCaseKey) / ucMaxPerf("cpu", useCaseKey) : 0;
  const gpuNorm = parts.gpu ? ucPerf("gpu", parts.gpu, useCaseKey) / ucMaxPerf("gpu", useCaseKey) : 0;
  let balance = 100;
  if (alloc.gpu > 0 && alloc.cpu > 0) {
    // CPU and GPU are normalized against very different ranges (a mid GPU is ~half
    // of a 5090, while a cheap X3D is near the CPU ceiling), so judge balance by a
    // tolerant gap rather than a strict ratio — only real mismatches are penalized.
    const gap = Math.abs(gpuNorm - cpuNorm);
    balance = Math.round(clamp(100 - gap * 85, 50, 100));
  }

  // budget adherence
  let budgetAdh;
  if (total <= budget) budgetAdh = Math.round(70 + 30 * (total / budget)); // reward using the budget
  else budgetAdh = Math.round(clamp(100 - ((total - budget) / budget) * 180, 0, 100));

  // completeness (office legitimately skips a discrete GPU)
  const need = CATEGORY_ORDER.filter((c) => !(c === "gpu" && alloc.gpu === 0));
  const have = need.filter((c) => parts[c]).length;
  const completeness = Math.round((have / need.length) * 100);
  const missing = need.filter((c) => !parts[c]);
  const complete = missing.length === 0;

  // ---- PERFORMANCE: use-case performance of the parts, scored out of 1000 ----
  // An incompatible build won't run, so its performance is 0.
  const score = compat.pass ? Math.round(clamp(fitNorm * 1000, 0, 1000)) : 0;

  // ---- PRICE / PERFORMANCE: how much performance you get per dollar (value) ----
  const pp = total > 0 ? (fitNorm / total) * 100000 : 0;
  const ppScore = compat.pass ? Math.round(clamp(pp * 1.2, 0, 100)) : 0;

  const bottleneck =
    alloc.gpu > 0 && alloc.cpu > 0
      ? gpuNorm - cpuNorm > 0.42
        ? "cpu"
        : cpuNorm - gpuNorm > 0.42
        ? "gpu"
        : null
      : null;

  return { compat, total, fitNorm, balance, budgetAdh, completeness, missing, complete, score, ppScore, bottleneck };
}

/* HYBRID verdict: the engine owns the number, this narrates it.
   Drop-in point for a live Claude API call — keep it cached/frozen on save
   so a saved build's number never drifts. */
function generateVerdict(parts, a, useCaseKey, budget) {
  const uc = USE_CASES[useCaseKey].label.toLowerCase();
  const out = [];
  if (a.missing && a.missing.length) {
    if (a.missing.length >= 5)
      return `Pick your parts to forge this ${uc} build — scores and compatibility update live as you add them.`;
    out.push(`Still to add: ${a.missing.map((c) => CAT_META[c].label).join(", ")}.`);
  }
  if (!a.compat.pass) {
    out.push(`This build won't run as-is — ${a.compat.issues.length} compatibility ${a.compat.issues.length === 1 ? "problem needs" : "problems need"} fixing before anything else matters.`);
  } else if (a.balance >= 82 && a.complete) {
    out.push(`A well-rounded ${uc} build — the parts are matched and the money landed where it counts.`);
  } else if (a.balance >= 62) {
    out.push(`A solid ${uc} build with a sensible balance of parts for the budget.`);
  } else if (a.balance >= 45) {
    out.push(`A decent ${uc} build, though the part balance could be tightened.`);
  } else {
    out.push(`The parts are a little mismatched for ${uc} — worth rebalancing the big-ticket parts.`);
  }
  if (a.bottleneck === "cpu") out.push(`The CPU is lagging the GPU and will bottleneck it in CPU-heavy moments — consider trading some GPU down for a stronger CPU.`);
  else if (a.bottleneck === "gpu") out.push(`The GPU is the weak link here — for ${uc} you'd usually push more budget toward it.`);
  if (a.total > budget) out.push(`It's ${fmt(a.total - budget)} over your ${fmt(budget)} budget.`);
  else if (budget - a.total > budget * 0.12) out.push(`You've left ${fmt(budget - a.total)} on the table — that headroom could upgrade the highest-impact part.`);
  if (a.compat.pass && a.total <= budget && a.budgetAdh >= 92) out.push(`It uses almost all of your budget — the money is well allocated.`);
  else if (a.compat.pass && a.complete && a.total <= budget * 0.8) out.push(`It comes in well under budget — there's room to push a key part higher.`);
  return out.join(" ");
}

/* ----------------------------- AUTO-ASSEMBLE ----------------------------- */
// Greedy, compatibility-aware, budget-aware. Picks in dependency order.
function assembleBuild(useCaseKey, budget) {
  const alloc = USE_CASES[useCaseKey].alloc;
  const target = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, (budget * (alloc[c] || 0)) / 100]));
  const parts = {};
  let spent = 0;
  // Auto-Forge only uses in-stock parts (those with a live price). If a whole
  // category has nothing live, fall back to the full pool so a build still completes.
  const inStock = (pool) => { const f = pool.filter((p) => !partOOS(p)); return f.length ? f : pool; };

  const pick = (cat, pool, band) => {
    const remaining = budget - spent;
    const cheapest = Math.min(...pool.map((p) => p.price));
    const cap = Math.max(band * 1.15, Math.min(remaining, band * 1.15), cheapest);
    let affordable = pool.filter((p) => p.price <= Math.max(cap, cheapest));
    if (affordable.length === 0) affordable = pool.filter((p) => p.price === cheapest);
    // best (use-case-aware) score; tie -> cheaper (better value); then higher perf
    affordable.sort((x, y) => {
      const sx = partScore({ ...x, cat }, band, useCaseKey);
      const sy = partScore({ ...y, cat }, band, useCaseKey);
      return sy - sx || x.price - y.price || ucPerf(cat, y, useCaseKey) - ucPerf(cat, x, useCaseKey);
    });
    let chosen;
    if (cat === "cpu" || cat === "gpu") {
      // CPU & GPU matter most — take the highest match score the budget allows.
      chosen = affordable[0];
    } else {
      // Supporting parts: value knee — among options within ~7% of the best
      // performance in range, take the cheapest (don't overpay for a marginal gain).
      const topUc = Math.max(...affordable.map((p) => ucPerf(cat, p, useCaseKey)));
      const near = affordable.filter((p) => ucPerf(cat, p, useCaseKey) >= topUc * 0.93);
      near.sort((a, b) => a.price - b.price);
      chosen = near[0] || affordable[0];
    }
    parts[cat] = chosen;
    spent += chosen.price;
    return chosen;
  };

  const cpu = pick("cpu", inStock(CATALOG.cpu), target.cpu);
  pick("mobo", inStock(CATALOG.mobo.filter((m) => m.socket === cpu.socket)), target.mobo);
  const mobo = parts.mobo;
  pick("ram", inStock(CATALOG.ram.filter((r) => r.ramType === mobo.ramType && r.cap <= mobo.maxRam)), target.ram);
  pick("cooler", inStock(CATALOG.cooler.filter((c) => c.sockets.includes(cpu.socket) && c.tdpRating >= cpu.tdp)), target.cooler);
  pick("storage", inStock(CATALOG.storage.filter((s) => (s.iface === "M.2" ? mobo.m2 >= 1 : true))), target.storage);
  if (alloc.gpu > 0) pick("gpu", inStock(CATALOG.gpu), target.gpu);

  // PSU sized to the build
  const need = requiredWatts(parts);
  let psuPool = inStock(CATALOG.psu.filter((p) => p.watt >= need * 1.25));
  if (psuPool.length === 0) psuPool = inStock(CATALOG.psu);
  pick("psu", psuPool, target.psu);

  // Case fitting the chosen mobo / gpu / air cooler
  let casePool = inStock(CATALOG.case.filter(
    (cs) =>
      cs.forms.includes(mobo.form) &&
      (!parts.gpu || parts.gpu.len <= cs.maxGpu) &&
      (parts.cooler.type !== "air" || parts.cooler.height <= cs.maxCool)
  ));
  if (casePool.length === 0) casePool = inStock(CATALOG.case.filter((cs) => cs.forms.includes(mobo.form)));
  if (casePool.length === 0) casePool = inStock(CATALOG.case);
  pick("case", casePool, target.case);

  // ---- reallocate leftover budget to the highest build-impact upgrades ----
  // After buying value parts, spend what's left where it helps the build most per
  // dollar (usually the CPU/GPU/RAM) instead of leaving money on the table.
  const totalCost = () => Object.values(parts).reduce((s, p) => s + (p ? p.price : 0), 0);
  const upgradeOnce = () => {
    let best = null;
    for (const cat of CATEGORY_ORDER) {
      const cur = parts[cat];
      if (!cur) continue;
      const w = (alloc[cat] || 0) / 100; // how much this category matters for the use case
      if (w <= 0) continue;
      const maxp = ucMaxPerf(cat, useCaseKey) || 1;
      for (const cand of inStock(CATALOG[cat])) {
        const extra = cand.price - cur.price;
        if (extra <= 0) continue;
        const rawGain = ucPerf(cat, cand, useCaseKey) - ucPerf(cat, cur, useCaseKey);
        if (rawGain <= 0) continue;
        if (totalCost() - cur.price + cand.price > budget) continue;
        if (checkCompat({ ...parts, [cat]: cand }).issues.length > 0) continue;
        const gain = (rawGain / maxp) * w; // contribution to overall performance
        const eff = gain / extra;          // build-impact per dollar
        if (!best || eff > best.eff || (Math.abs(eff - best.eff) < 1e-9 && gain > best.gain)) best = { cat, cand, eff, gain };
      }
    }
    if (best) { parts[best.cat] = best.cand; return true; }
    return false;
  };
  let guard = 0;
  while (upgradeOnce() && guard++ < 60) {}

  return parts;
}

/* ----------------------------- STORAGE WRAPPER ----------------------------- */
// Uses the artifact persistent storage API when present; falls back to an
// in-memory object so the app never crashes in a preview.
const memStore = {};
const LS = () => { try { return typeof localStorage !== "undefined" ? localStorage : null; } catch (e) { return null; } };
async function sSet(key, val) {
  try { if (typeof window !== "undefined" && window.storage) { await window.storage.set(key, JSON.stringify(val)); return; } } catch (e) {}
  try { const ls = LS(); if (ls) { ls.setItem(key, JSON.stringify(val)); return; } } catch (e) {}
  memStore[key] = JSON.stringify(val);
}
async function sDel(key) {
  try { if (typeof window !== "undefined" && window.storage) { await window.storage.delete(key); return; } } catch (e) {}
  try { const ls = LS(); if (ls) { ls.removeItem(key); return; } } catch (e) {}
  delete memStore[key];
}
async function sList(prefix) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const r = await window.storage.list(prefix);
      const keys = (r && r.keys) || [];
      return keys.map((k) => (typeof k === "string" ? k : k.key));
    }
  } catch (e) {}
  try { const ls = LS(); if (ls) return Object.keys(ls).filter((k) => k.startsWith(prefix)); } catch (e) {}
  return Object.keys(memStore).filter((k) => k.startsWith(prefix));
}
async function sGet(key) {
  try { if (typeof window !== "undefined" && window.storage) { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } } catch (e) {}
  try { const ls = LS(); if (ls) { const v = ls.getItem(key); return v ? JSON.parse(v) : null; } } catch (e) {}
  return memStore[key] ? JSON.parse(memStore[key]) : null;
}

/* ----------------------------- HOOKS / SMALL UI ----------------------------- */
function useCountUp(target, duration = 900) {
  const [v, setV] = useState(0);
  const raf = useRef();
  useEffect(() => {
    let start;
    cancelAnimationFrame(raf.current);
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setV(target);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return v;
}

function Gauge({ value, max = 100, size = 132, label, accent = "var(--c-accent)", delay = 0 }) {
  const v = useCountUp(value, 1100);
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - clamp(v / max, 0, 1));
  return (
    <div className="rf-gauge" style={{ width: size, height: size, animationDelay: delay + "ms" }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--c-track)" strokeWidth="10" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={accent} strokeWidth="10" fill="none"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.2s linear", filter: `drop-shadow(0 0 8px ${accent})` }}
        />
      </svg>
      <div className="rf-gauge-center">
        <div className="rf-gauge-num" style={{ color: accent, fontSize: String(Math.round(v)).length >= 4 ? "26px" : undefined }}>{Math.round(v)}</div>
        <div className="rf-gauge-label">{label}</div>
      </div>
    </div>
  );
}

const scoreColor = (s) => (s >= 80 ? "var(--c-good)" : s >= 60 ? "var(--c-accent)" : s >= 40 ? "var(--c-warn)" : "var(--c-bad)");

/* Rich, labeled spec sheet per part so the AI reasons from real data (with units). */
function describePart(cat, p) {
  const d = { name: p.name, brand: p.brand, ratingOutOf100: p.perf };
  if (cat === "cpu") Object.assign(d, { cores: p.cores, tdpWatts: p.tdp, socket: p.socket, integratedGraphics: !!p.igpu });
  else if (cat === "gpu") Object.assign(d, { vramGB: p.vram, tdpWatts: p.tdp, lengthMm: p.len });
  else if (cat === "ram") Object.assign(d, { type: p.ramType, capacityGB: p.cap, speedMHz: p.speed });
  else if (cat === "storage") Object.assign(d, { driveType: p.kind, capacityGB: p.cap, interface: p.iface });
  else if (cat === "psu") Object.assign(d, { wattage: p.watt, efficiencyRating: p.eff });
  else if (cat === "cooler") Object.assign(d, { coolerType: p.type, ratedForTdpWatts: p.tdpRating, heightMm: p.height, fitsSockets: p.sockets });
  else if (cat === "mobo") Object.assign(d, { socket: p.socket, memoryType: p.ramType, formFactor: p.form, m2Slots: p.m2, maxMemoryGB: p.maxRam });
  else if (cat === "case") Object.assign(d, { supportsFormFactors: p.forms, maxGpuLengthMm: p.maxGpu, maxAirCoolerHeightMm: p.maxCool });
  return d;
}

/* ----------------------------- MAIN APP ----------------------------- */
// Lightweight animated particle field — drifting cyan/purple motes behind the UI.
function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, raf = 0, parts = [];
    const COLORS = ["25,232,219", "124,92,255"]; // cyan, purple
    const spawn = () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.9 + 0.5,
      vx: (Math.random() - 0.5) * 0.13,
      vy: (Math.random() - 0.5) * 0.13 - 0.03,
      a: Math.random() * 0.5 + 0.15,
      c: COLORS[Math.random() < 0.72 ? 0 : 1],
      tw: Math.random() * Math.PI * 2,
    });
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(72, (w * h) / 22000));
      parts = Array.from({ length: target }, spawn);
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.tw += 0.014;
        if (p.x < -12) p.x = w + 12; else if (p.x > w + 12) p.x = -12;
        if (p.y < -12) p.y = h + 12; else if (p.y > h + 12) p.y = -12;
        const a = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(3) + ")";
        ctx.shadowBlur = 9; ctx.shadowColor = "rgba(" + p.c + "," + a.toFixed(3) + ")";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="rf-particles" aria-hidden="true" />;
}

function OfflineBanner({ offlinePriceStatus, priceInfo }) {
  const fmtTs = (ts) => {
    if (!ts) return null;
    const d = new Date(Number(ts));
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " at " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  };
  const cached = offlinePriceStatus === "cached";
  const sample = offlinePriceStatus === "sample" || (!offlinePriceStatus && !priceInfo);
  const ts = priceInfo && priceInfo.cacheTs ? fmtTs(priceInfo.cacheTs) : null;
  return (
    <div className="rf-offline-banner" role="alert">
      <span className="rf-offline-dot" />
      <span className="rf-offline-label">OFFLINE</span>
      <span className="rf-offline-sep">·</span>
      {cached && ts ? <span>Prices from {ts}</span> : cached ? <span>Showing last known prices</span> : sample ? <span>No cached prices — showing sample data</span> : <span>Prices may be outdated</span>}
      <span className="rf-offline-sep">·</span>
      <span>AI unavailable</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// STRIPE — no config needed in the app. The serverless function holds the keys
// (set STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY in Vercel) and returns the
// publishable key with each session, so checkout "just works" once those two
// env vars are set. See api/create-checkout-session.js.
// Load Stripe.js once (no npm dependency — just the official script tag).
// ---------------------------------------------------------------------------
let _stripeJsPromise = null;
function loadStripeJs() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.Stripe) return Promise.resolve(window.Stripe);
  if (!_stripeJsPromise) {
    _stripeJsPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://js.stripe.com/v3/";
      s.async = true;
      s.onload = () => resolve(window.Stripe);
      s.onerror = () => reject(new Error("Could not load Stripe.js"));
      document.head.appendChild(s);
    });
  }
  return _stripeJsPromise;
}

export default function RigForge() {
  const [view, setView] = useState(() => { try { if (typeof window !== "undefined") { const h = window.location.hostname.split(".")[0]; const p = window.location.pathname.replace(/\/+$/, "").split("/").pop(); if (h === "pcmogger" || p === "admin" || p === "coadmin") return "mogger"; } } catch (e) {} return "home"; }); // home | survey | budget | results | mogger
  const [useCase, setUseCase] = useState(null);
  const [budget, setBudget] = useState(1200);
  const [parts, setParts] = useState(null);
  const [autoGen, setAutoGen] = useState(false); // true while showing an Auto-Forge build (regenerates on price changes)
  const [picker, setPicker] = useState(null); // category being swapped
  const [expanded, setExpanded] = useState({});
  const [saved, setSaved] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [nameDraft, setNameDraft] = useState("");
  const [savingOpen, setSavingOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const [priceInfo, setPriceInfo] = useState(null);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [offlinePriceStatus, setOfflinePriceStatus] = useState(null); // null | "cached" | "sample"
  useEffect(() => {
    const up = () => setIsOnline(true);
    const dn = () => setIsOnline(false);
    window.addEventListener("online", up); window.addEventListener("offline", dn);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", dn); };
  }, []);
  const [theme, setTheme] = useState("dark"); // default dark mode
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("appearance");
  const [hdrUser, setHdrUser] = useState(() => { try { const s = localStorage.getItem("mogger_user"); return s ? JSON.parse(s) : null; } catch (e) { return null; } });
  const [hdrAuth, setHdrAuth] = useState(false);
  const [hdrLogoutAsk, setHdrLogoutAsk] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState(null); // the tier object being purchased
  const [checkoutErr, setCheckoutErr] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const checkoutInstanceRef = useRef(null);
  const [payBanner, setPayBanner] = useState(null); // { ok, text }
  const [lang, setLang] = useState("en");
  CUR_LANG = lang;

  useEffect(() => {
    (async () => {
      const t = await sGet("rf:theme");
      if (t === "light" || t === "dark") setTheme(t);
    })();
  }, []);
  const changeTheme = (t) => { setTheme(t); sSet("rf:theme", t); setSettingsOpen(false); };
  useEffect(() => { (async () => { const l = await sGet("rf:lang"); if (l && LANGS.some((x) => x.code === l)) setLang(l); })(); }, []);
  const changeLang = (l) => { setLang(l); sSet("rf:lang", l); };

  useEffect(() => {
    if (!settingsOpen) return;
    const h = () => setSettingsOpen(false);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [settingsOpen]);

  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // Pull live prices and override the built-in sample prices. Fails silently
  // (keeps sample prices) when the endpoint isn't reachable, e.g. inside Claude.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(PRICES_URL + "?t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) throw new Error("not ok");
        const data = await res.json();
        if (cancelled || !data || !data.prices) return;
        let n = 0;
        for (const c of CATEGORY_ORDER) {
          for (const part of CATALOG[c]) {
            const entry = data.prices[part.id];
            // lowest price AND which store it came from.
            // Guard: ignore any scraped price wildly off the catalog baseline — that
            // means a wrong product got matched to this part (e.g. a $160 hit on a ~$400 GPU).
            const baseline = part.price;
            // Only guard the LOW side: reject prices well below baseline (a wrong, cheaper product
            // matched to this part). No upper cap — prices can legitimately spike (e.g. RAM shortage).
            const plausible = (v) => typeof v === "number" && v > 0 && (!baseline || v >= baseline * 0.5);
            let best = null, bestSrc = null;
            if (entry) {
              for (const [src, v] of Object.entries(entry)) {
                if (plausible(v) && (best == null || v < best)) { best = v; bestSrc = src; }
              }
            }
            if (best != null) { part.price = best; part._live = true; part._source = bestSrc; n++; }
            else { part._live = false; part._source = null; } // not in latest live data => out of stock
            // image + link must match the store of the displayed price.
            // Prefer the live scrape's media for that store; fall back to baked per-source media.
            const lm = (data.media && data.media[part.id]) || {};
            const pickSrc = (src) => {
              if (src === "newegg") {
                const live = lm.newegg && lm.newegg.url ? lm.newegg : null;
                return live || (MEDIA_NE && MEDIA_NE[part.id]) || null;
              }
              if (src === "amazon") {
                const live = lm.amazon && lm.amazon.url ? lm.amazon : null;
                return live || MEDIA[part.id] || null;
              }
              return null; // best buy etc. has no own product listing here
            };
            // chosen store = the price's store; if that store has no listing (e.g. best buy), fall back to amazon then newegg
            let chosen = pickSrc(bestSrc) || pickSrc("amazon") || pickSrc("newegg");
            if (chosen) { if (chosen.img) part.img = chosen.img; if (chosen.url) part.url = chosen.url; }
          }
        }
        PRICE_LIVE = n > 0; // only go "live" if we actually got real prices; empty feed => keep baseline, nothing marked out of stock
        setPriceInfo({ updatedAt: data.updatedAt, count: n });
        // Cache for offline use
        const ls = LS();
        if (ls && n > 0) {
          try { ls.setItem("forgeapc-price-cache", JSON.stringify(data)); ls.setItem("forgeapc-price-ts", Date.now().toString()); ls.setItem("forgeapc-ever-online", "1"); } catch (e) {}
        }
        setOfflinePriceStatus(null);
      } catch (e) {
        if (cancelled) return;
        // Offline or unreachable — try the most recent cached prices
        const ls = LS();
        const raw = ls && ls.getItem("forgeapc-price-cache");
        const everOnline = ls && ls.getItem("forgeapc-ever-online");
        if (raw) {
          try {
            const data = JSON.parse(raw);
            if (data && data.prices) {
              let n = 0;
              for (const c of CATEGORY_ORDER) {
                for (const part of CATALOG[c]) {
                  const entry = data.prices[part.id];
                  const baseline = part.price;
                  const plausible = (v) => typeof v === "number" && v > 0 && (!baseline || v >= baseline * 0.5);
                  let best = null, bestSrc = null;
                  if (entry) { for (const [src, v] of Object.entries(entry)) { if (plausible(v) && (best == null || v < best)) { best = v; bestSrc = src; } } }
                  if (best != null) { part.price = best; part._live = true; part._source = bestSrc; n++; }
                  else { part._live = false; part._source = null; }
                  const lm = (data.media && data.media[part.id]) || {};
                  const pickSrc = (src) => { if (src === "newegg") { const live = lm.newegg && lm.newegg.url ? lm.newegg : null; return live || (MEDIA_NE && MEDIA_NE[part.id]) || null; } if (src === "amazon") { const live = lm.amazon && lm.amazon.url ? lm.amazon : null; return live || MEDIA[part.id] || null; } return null; };
                  let chosen = pickSrc(bestSrc) || pickSrc("amazon") || pickSrc("newegg");
                  if (chosen) { if (chosen.img) part.img = chosen.img; if (chosen.url) part.url = chosen.url; }
                }
              }
              PRICE_LIVE = n > 0;
              const ts = ls && ls.getItem("forgeapc-price-ts");
              setPriceInfo({ updatedAt: data.updatedAt, count: n, fromCache: true, cacheTs: ts ? Number(ts) : null });
              setOfflinePriceStatus("cached");
            }
          } catch (e2) { setOfflinePriceStatus(everOnline ? "cached" : "sample"); }
        } else {
          setOfflinePriceStatus(everOnline ? "cached" : "sample");
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);
  const toggleFs = () => {
    try {
      if (!document.fullscreenElement) {
        const el = document.documentElement;
        const p = (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
        if (p && p.catch) p.catch(() => {});
      } else {
        (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      }
    } catch (e) {}
  };

  const acct = () => { try { const s = localStorage.getItem("mogger_user"); return s ? JSON.parse(s) : null; } catch (e) { return null; } };
  useEffect(() => { setHdrUser(acct()); }, [view]);
  const hdrLogout = () => { try { localStorage.removeItem("mogger_user"); } catch (e) {} setHdrUser(null); };

  // Mount Stripe's embedded checkout box inside the Plans popup.
  useEffect(() => {
    if (!checkoutPlan) return;
    let cancelled = false;
    setCheckoutErr(""); setCheckoutLoading(true);
    (async () => {
      try {
        const u = acct();
        const r = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ tier: checkoutPlan.key, email: u && u.email ? u.email : undefined }),
        });
        const data = await r.json();
        if (!r.ok || !data.clientSecret || !data.publishableKey) throw new Error(data.error || "Could not start checkout.");
        if (cancelled) return;
        const Stripe = await loadStripeJs();
        if (cancelled) return;
        const stripe = Stripe(data.publishableKey);
        const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret });
        if (cancelled) { try { checkout.destroy(); } catch (e) {} return; }
        checkoutInstanceRef.current = checkout;
        checkout.mount("#rf-embedded-checkout");
        setCheckoutLoading(false);
      } catch (e) {
        if (!cancelled) { setCheckoutErr((e && e.message) || "Checkout failed."); setCheckoutLoading(false); }
      }
    })();
    return () => {
      cancelled = true;
      if (checkoutInstanceRef.current) { try { checkoutInstanceRef.current.destroy(); } catch (e) {} checkoutInstanceRef.current = null; }
    };
  }, [checkoutPlan]);

  const closePlans = () => { setCheckoutPlan(null); setCheckoutErr(""); setPlansOpen(false); };

  // After the box completes, the customer returns to /?checkout=return&session_id=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") !== "return") return;
      const sid = params.get("session_id");
      window.history.replaceState(null, "", window.location.pathname);
      if (!sid) return;
      (async () => {
        try {
          const r = await fetch("/api/create-checkout-session?session_id=" + encodeURIComponent(sid));
          const d = await r.json();
          if (r.ok && d.status === "complete") setPayBanner({ ok: true, text: "Payment successful — your plan is active. Thank you!" });
          else if (r.ok && d.status === "open") setPayBanner({ ok: false, text: "Checkout wasn't completed. You can try again anytime." });
          else setPayBanner({ ok: false, text: "We couldn't confirm the payment. If you were charged, contact support." });
        } catch (e) {
          setPayBanner({ ok: true, text: "Thanks! If your payment went through, your plan is now active." });
        }
      })();
    } catch (e) {}
  }, []);
  const refreshSaved = useCallback(async () => {
    setLoadingSaved(true);
    const keys = await sList("build:");
    let list = (await Promise.all(keys.map((k) => sGet(k)))).filter(Boolean);
    const u = acct();
    if (u && u.id) {
      try {
        const cloud = await netListBuilds(u.id);
        const byId = {};
        for (const b of list) byId[b.id] = b;
        for (const b of cloud) if (b && b.id && !byId[b.id]) byId[b.id] = b; // cloud-only builds appear too
        list = Object.values(byId);
      } catch (e) { /* offline: just local */ }
    }
    list.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
    setSaved(list);
    setLoadingSaved(false);
  }, []);
  useEffect(() => { refreshSaved(); }, [refreshSaved]);
  useEffect(() => { if (view === "home") refreshSaved(); }, [view, refreshSaved]);

  const analysis = useMemo(
    () => (parts && useCase ? analyzeBuild(parts, useCase, budget) : null),
    [parts, useCase, budget]
  );
  const verdict = useMemo(
    () => (parts && analysis ? generateVerdict(parts, analysis, useCase, budget) : ""),
    [parts, analysis, useCase, budget]
  );

  // AI scoring + verdict: a single /api/chat call returns the BUILD SCORE, the
  // PRICE/PERFORMANCE score AND the written verdict as JSON. It fires automatically
  // (debounced) once per finished, compatible build — the engine's numbers show
  // instantly as a fallback while it runs or if the API can't be reached.
  const [aiVerdict, setAiVerdict] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  useEffect(() => { setAiVerdict(null); setAiBusy(false); }, [parts, useCase, budget, view]);
  const runVerdict = useCallback(async () => {
    if (!parts || !parts.cpu || !useCase || !analysis || aiBusy) return;
    if (!isOnline) { setAiVerdict("__offline__"); return; }
    setAiBusy(true); setAiVerdict(null);
    const summary = {
      useCase: USE_CASES[useCase].label,
      budget,
      buildTotal: analysis.total,
      withinBudget: analysis.total <= budget,
      performanceScore_of1000: analysis.score,
      pricePerformanceScore_of100: analysis.ppScore,
      compatible: analysis.compat.pass,
      parts: CATEGORY_ORDER.filter((c) => parts[c]).map((c) => {
        const band = (budget * USE_CASES[useCase].alloc[c]) / 100;
        const dp = describePart(c, parts[c]);
        const rawPower = dp.ratingOutOf100; delete dp.ratingOutOf100;
        return {
          slot: c,
          priceUSD: partOOS(parts[c]) ? "out of stock" : parts[c].price,
          matchScore_0to100: partScore({ ...parts[c], cat: c }, band, useCase),
          rawPowerVsBest_0to100: rawPower,
          ...dp,
        };
      }),
      compatibilityIssues: analysis.compat.issues && analysis.compat.issues.length ? analysis.compat.issues : "none",
    };
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          system: "You are a sharp PC-building advisor. You're given a build as JSON. For each part: matchScore_0to100 = how good a pick that part is for THIS build's budget and use case — this is the score shown to the user, where higher means a better choice; rawPowerVsBest_0to100 = its absolute power versus the most powerful possible part (a flagship ≈ 100), so a budget part naturally has a low number here and that is NOT a weakness. Also given: labeled specs, current prices, the build's performanceScore_of1000 (use-case-weighted real performance) and pricePerformanceScore_of100, budget, use case, and compatibility issues. When you describe how good a part is, use its matchScore — NEVER call a part low-scoring or weak because its rawPowerVsBest is low (e.g. a 9060 XT with matchScore 92 is an excellent pick even though its rawPowerVsBest is ~35). Write about 3 sentences (~55-70 words): how well the build fits the use case and budget, its main strength, and the genuine weakest link or bottleneck. Judge by real-world fit for the use case, NOT by raw spec numbers — do NOT call a normal mainstream spec (e.g. an 8GB GPU, 16GB RAM, a 1TB SSD) a flaw unless it truly bottlenecks the use case at this budget. Use ONLY the specs given — never invent a spec (e.g. read driveType for SATA vs NVMe). When judging the cooler, weigh coolerType and ratedForTdpWatts against the CPU's tdpWatts and cores: high-TDP or high-core chips (X3D, Ryzen 9, i7/i9, ~120W+) genuinely benefit from a strong air cooler or AIO — never call an AIO 'overkill' for those. Be specific; reference key parts by name. Plain prose only — no markdown, no lists, no preamble.",
          messages: [{ role: "user", content: "Here is the build as JSON:\n" + JSON.stringify(summary, null, 1) + "\n\nWrite the verdict." }],
        }),
      });
      if (res.ok) { const data = await res.json(); if (data && data.text) setAiVerdict(String(data.text).trim()); }
    } catch (e) { /* leave unset; button stays available to retry */ }
    finally { setAiBusy(false); }
  }, [parts, useCase, budget, analysis, aiBusy]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const startSurvey = () => { setUseCase(null); setView("survey"); };
  const chooseUseCase = (sel) => { setUseCase(makeUseCase(Array.isArray(sel) ? sel : [sel])); setView("budget"); };
  const generateAuto = () => { setAutoGen(true); setParts(assembleBuild(useCase, budget)); setExpanded({}); setView("results"); };
  const startManual = () => { setAutoGen(false); setParts({}); setExpanded({}); setView("results"); };

  // Auto-Forge is never cached: whenever live prices arrive/refresh (or budget/use-case
  // change), rebuild on the spot from current prices, skipping out-of-stock parts.
  // Stops as soon as the user manually edits the build, so their picks aren't overwritten.
  useEffect(() => {
    if (autoGen && useCase) setParts(assembleBuild(useCase, budget));
  }, [priceInfo, autoGen, useCase, budget]);

  const swapPart = (cat, part) => {
    setAutoGen(false);
    setParts((p) => ({ ...p, [cat]: part }));
    setPicker(null);
  };
  const removePart = (cat) => { setAutoGen(false); setParts((p) => { const n = { ...p }; delete n[cat]; return n; }); };

  const saveBuild = async () => {
    const a = analyzeBuild(parts, useCase, budget);
    const build = {
      id: "b" + Date.now(),
      name: nameDraft.trim() || `${USE_CASES[useCase].label} Build`,
      useCase, budget, parts,
      total: a.total, overallScore: a.score, ppScore: a.ppScore, // frozen on save
      verdict: generateVerdict(parts, a, useCase, budget),
      compatPass: a.compat.pass,
      savedAt: Date.now(),
    };
    await sSet("build:" + build.id, build);
    const u = acct(); if (u && u.id) await netSyncBuild(u.id, build);
    setSavingOpen(false); setNameDraft("");
    await refreshSaved();
    flash(u ? "Build saved to your account" : "Build saved to your rigs");
    setView("home");
  };
  const deleteBuild = async (id) => { await sDel("build:" + id); const u = acct(); if (u && u.id) await netDeleteBuild(u.id, id); await refreshSaved(); };
  // Save a build that came from somewhere else (e.g. a PC Mogger match) into My Rigs.
  const saveExternalBuild = async (partsMap, ucKey, bud, name) => {
    const uc = ensureUseCase(ucKey);
    const a = analyzeBuild(partsMap, uc, bud);
    const build = {
      id: "b" + Date.now() + Math.floor(Math.random() * 1000),
      name: name || `${USE_CASES[uc].label} Build`,
      useCase: uc, budget: bud, parts: partsMap,
      total: a.total, overallScore: a.score, ppScore: a.ppScore,
      verdict: generateVerdict(partsMap, a, uc, bud),
      compatPass: a.compat.pass, savedAt: Date.now(),
    };
    await sSet("build:" + build.id, build);
    const u = acct(); if (u && u.id) await netSyncBuild(u.id, build);
    await refreshSaved();
    return true;
  };
  const openSaved = (b) => { setAutoGen(false); setUseCase(ensureUseCase(b.useCase)); setBudget(b.budget); setParts(b.parts); setView("results"); };

  return (
    <div className={"rf-root" + (theme === "light" ? " rf-light" : "")} dir={lang === "ar" ? "rtl" : "ltr"}>
      <StyleBlock />
      <div className="rf-bg" />
      <div className="rf-grid" />
      <ParticleField />
      {!isOnline && <OfflineBanner offlinePriceStatus={offlinePriceStatus} priceInfo={priceInfo} />}
      {!isOnline && <div style={{height:"38px"}} />}

      <header className="rf-header">
        <div className="rf-brand" onClick={() => setView("home")}>
          <div className="rf-logo"><Zap size={18} /></div>
          <span>FORGE<span className="rf-accent">APC</span></span>
        </div>
        <div className="rf-header-right">
          {view !== "home" && (
            <button className="rf-ghost" onClick={() => setView("home")}>
              <ChevronLeft size={16} /> {t("myRigs")}
            </button>
          )}
          <button className="rf-ghost rf-plans-btn" onClick={() => setPlansOpen(true)}><Sparkles size={15} /> Plans</button>
          {hdrUser ? (
            <>
              {hdrUser.name === "Rayaan" && (
                <button className="rf-ghost rf-admin-btn" onClick={() => setView("mogger-admin")} title="Admin panel">⚙️ Admin</button>
              )}
              <div className="rf-acct-chip">
                <span className="rf-acct-name">{hdrUser.name}</span>
                <RankBadge rank={moggerRank(hdrUser.elo, hdrUser.crank)} />
                <button className="rf-acct-out" onClick={() => setHdrLogoutAsk(true)} title="Log out"><X size={13} /></button>
              </div>
            </>
          ) : (
            <button className="rf-ghost rf-login-btn" onClick={() => setHdrAuth(true)}>Log in</button>
          )}
          <div className="rf-settings-wrap">
            <button className="rf-ghost rf-fs-btn" onClick={(e) => { e.stopPropagation(); setSettingsOpen((o) => !o); }} title="Settings"><Settings size={16} /></button>
            {settingsOpen && (
              <div className="rf-settings-menu" onClick={(e) => e.stopPropagation()}>
                <div className="rf-settings-tabs">
                  <button className={"rf-settings-tab" + (settingsTab === "appearance" ? " active" : "")} onClick={() => setSettingsTab("appearance")}>{t("appearance")}</button>
                  <button className={"rf-settings-tab" + (settingsTab === "language" ? " active" : "")} onClick={() => setSettingsTab("language")}>{t("language")}</button>
                </div>
                {settingsTab === "appearance" ? (
                  <div className="rf-settings-pane">
                    <div className="rf-settings-title">{t("theme")}</div>
                    <div className="rf-theme-toggle">
                      <button className={"rf-theme-opt" + (theme === "dark" ? " active" : "")} onClick={() => changeTheme("dark")}><Moon size={14} /> {t("dark")}</button>
                      <button className={"rf-theme-opt" + (theme === "light" ? " active" : "")} onClick={() => changeTheme("light")}><Sun size={14} /> {t("light")}</button>
                    </div>
                  </div>
                ) : (
                  <div className="rf-settings-pane">
                    <div className="rf-settings-title">{t("language")}</div>
                    <div className="rf-lang-list">
                      {LANGS.map((L) => (
                        <button key={L.code} className={"rf-lang-opt" + (lang === L.code ? " active" : "")} onClick={() => changeLang(L.code)}>
                          <span>{L.name}</span>{lang === L.code && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="rf-ghost rf-fs-btn" onClick={toggleFs} title={isFs ? "Exit full screen" : "Full screen"}>
            {isFs ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </header>

      {hdrAuth && <MoggerAuth onClose={() => setHdrAuth(false)} onAuth={(u) => { try { localStorage.setItem("mogger_user", JSON.stringify(u)); } catch (e) {} setHdrUser(u); setHdrAuth(false); }} />}
      {payBanner && (
        <div className="rf-pay-banner" style={payBanner.ok ? {} : { background: "linear-gradient(135deg,#ff8a5c,#e23a52)", color: "#fff" }}>
          {payBanner.ok ? <Check size={18} /> : <AlertTriangle size={18} />} {payBanner.text}
          <button onClick={() => setPayBanner(null)} title="Dismiss"><X size={14} /></button>
        </div>
      )}
      {plansOpen && (
        <div className="rf-modal-overlay" onClick={closePlans}>
          <div className="rf-plans" onClick={(e) => e.stopPropagation()}>
            <button className="rf-plans-x" onClick={closePlans} title="Close"><X size={18} /></button>
            {checkoutPlan ? (
              <div className="rf-checkout">
                <button className="rf-checkout-back" onClick={() => { setCheckoutPlan(null); setCheckoutErr(""); }}><ChevronLeft size={16} /> Back to plans</button>
                <h2 className="rf-plans-title"><span className="rf-hero-grad">{checkoutPlan.name} — ${checkoutPlan.price}/mo</span></h2>
                {checkoutLoading && <div className="rf-checkout-loading"><div className="pm-spinner" /> Loading secure checkout…</div>}
                {checkoutErr && <div className="rf-checkout-err">{checkoutErr}</div>}
                <div className="rf-embedded-box"><div id="rf-embedded-checkout" /></div>
                <p className="rf-checkout-fine">🔒 Secured by Stripe · cancel anytime</p>
              </div>
            ) : (<>
              <h2 className="rf-plans-title"><span className="rf-hero-grad">Choose your plan</span></h2>
              <p className="rf-plans-sub">Upgrade for more power. Cancel anytime.</p>
              <div className="rf-plans-grid">
                {[
                  { key: "free", name: "Free", price: 0, tag: "", perks: ["Unlimited PC builds", "Full PC Mogger access", "Save rigs to this device"] },
                  { key: "plus", name: "Plus", price: 2, tag: "", perks: ["Everything in Free", "Ad-free experience", "Cloud-synced saves", "Custom rank color"] },
                  { key: "pro", name: "Pro", price: 5, tag: "Popular", perks: ["Everything in Plus", "Custom rank icon", "Priority price updates", "Early access to features"] },
                  { key: "max", name: "Max", price: 8, tag: "", perks: ["Everything in Pro", "Exclusive supporter badge", "Beta features first", "Support the developer"] },
                ].map((p) => (
                  <div key={p.key} className={"rf-plan" + (p.tag ? " rf-plan-feat" : "")}>
                    {p.tag && <span className="rf-plan-tag">{p.tag}</span>}
                    <div className="rf-plan-name">{p.name}</div>
                    <div className="rf-plan-price"><span className="rf-plan-amt">${p.price}</span><span className="rf-plan-per">/mo</span></div>
                    <ul className="rf-plan-perks">
                      {p.perks.map((x, i) => (<li key={i}><Check size={14} /> {x}</li>))}
                    </ul>
                    <button className={"rf-plan-cta" + (p.price === 0 ? " rf-plan-cta-free" : "")} disabled={p.price === 0} onClick={() => { if (p.price !== 0) { setCheckoutErr(""); setCheckoutPlan(p); } }}>{p.price === 0 ? "Current plan" : "Get " + p.name}</button>
                  </div>
                ))}
              </div>
            </>)}
          </div>
        </div>
      )}
      {hdrLogoutAsk && (
        <div className="rf-modal-overlay" onClick={() => setHdrLogoutAsk(false)}>
          <div className="rf-confirm" onClick={(e) => e.stopPropagation()}>
            <h3 className="rf-confirm-title">Log out?</h3>
            <p className="rf-confirm-msg">Are you sure you want to log out?</p>
            <div className="rf-confirm-btns">
              <button className="rf-confirm-yes" onClick={() => { hdrLogout(); setHdrLogoutAsk(false); }}>Yes, log out</button>
              <button className="rf-confirm-no" onClick={() => setHdrLogoutAsk(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      <main className="rf-main">
        {view === "home" && (
          <Home saved={saved} loading={loadingSaved} onNew={startSurvey} onOpen={openSaved} onDelete={deleteBuild} priceInfo={priceInfo} onMogger={() => setView("mogger")} />
        )}
        {view === "mogger" && <MoggerGame onExit={() => setView("home")} onSaveBuild={saveExternalBuild} />}
        {view === "mogger-admin" && <MoggerAdmin onBack={() => setView("home")} user={hdrUser} />}
        {view === "survey" && <Survey onPick={chooseUseCase} />}
        {view === "budget" && (
          <BudgetStep useCase={useCase} budget={budget} setBudget={setBudget} onBack={() => setView("survey")} onAuto={generateAuto} onManual={startManual} />
        )}
        {view === "results" && parts && analysis && (
          <Results
            useCase={useCase} budget={budget} parts={parts} analysis={analysis} verdict={aiVerdict} aiBusy={aiBusy} onGenerate={runVerdict} isOnline={isOnline}
            expanded={expanded} setExpanded={setExpanded}
            onSwap={(c) => setPicker(c)} onRemove={removePart}
            onRegen={generateAuto} onSave={() => setSavingOpen(true)}
          />
        )}
      </main>

      {picker && (
        <Picker
          cat={picker} current={parts[picker]} useCase={useCase} budget={budget} parts={parts}
          onClose={() => setPicker(null)} onPick={(p) => swapPart(picker, p)}
        />
      )}

      {savingOpen && (
        <div className="rf-modal-wrap" onClick={() => setSavingOpen(false)}>
          <div className="rf-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Name this rig</h3>
            <p className="rf-muted">It'll show up on your front page with its frozen scores.</p>
            <input
              className="rf-input" autoFocus value={nameDraft}
              placeholder={`${USE_CASES[useCase].label} Build`}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveBuild()}
            />
            <div className="rf-modal-actions">
              <button className="rf-ghost" onClick={() => setSavingOpen(false)}>Cancel</button>
              <button className="rf-btn" onClick={saveBuild}><Save size={16} /> {t("saveRig")}</button>
            </div>
          </div>
        </div>
      )}

      {!assistantOpen && view !== "mogger" && (
        <button className="rf-fab" onClick={() => setAssistantOpen(true)}>
          <Sparkles size={18} /> Ask AI
        </button>
      )}
      {view !== "mogger" && <Assistant open={assistantOpen} onClose={() => setAssistantOpen(false)} useCase={useCase} budget={budget} parts={parts} isOnline={isOnline} />}

      {toast && <div className="rf-toast"><Check size={15} /> {toast}</div>}
    </div>
  );
}

/* ----------------------------- HOME ----------------------------- */
/* ============================================================
   PC MOGGER — build-off mini-game (add-on). Reuses the live CATALOG,
   USE_CASES, CAT_META, prices and images from FORGEAPC.
   ============================================================ */
const MOGGER_BUDGETS = [800, 1000, 1200, 1500, 1800, 2200, 2800, 3500];
const MOGGER_UCS = ["gaming", "content", "streaming", "workstation", "ai", "office"];
const mRand = (a) => a[Math.floor(Math.random() * a.length)];

// deduped, cheapest-per-model options for a category (uses live prices)
function moggerOptions(cat) {
  const pool = CATALOG[cat];
  // Only parts with REAL (live) prices are stocked. Sample-priced parts are out of stock —
  // unless the whole category has zero live prices, then fall back to sample so the game stays playable.
  const live = PRICE_LIVE ? pool.filter((p) => p._live === true) : pool;
  const usable = live.length ? live : pool;
  const byModel = {};
  for (const p of usable) {
    const k = p.model || p.name;
    if (!byModel[k] || p.price < byModel[k].price) byModel[k] = p;
  }
  return Object.values(byModel).sort((a, b) => a.price - b.price);
}
// Picker display list: includes out-of-stock models (flagged _oos) so the player sees them greyed out.
function moggerOptionsAll(cat) {
  const byModel = {};
  for (const p of CATALOG[cat]) {
    const oos = partOOS(p);
    const k = p.model || p.name;
    const cur = byModel[k];
    if (!cur) { byModel[k] = { p, oos }; continue; }
    if (cur.oos && !oos) { byModel[k] = { p, oos }; continue; } // in-stock beats out-of-stock
    if (cur.oos === oos && p.price < cur.p.price) byModel[k] = { p, oos };
  }
  const list = Object.values(byModel);
  const allOOS = list.length > 0 && list.every((e) => e.oos);
  // whole category out of stock => sample fallback (matches moggerOptions)
  return list.map((e) => ({ ...e.p, _oos: allOOS ? false : e.oos })).sort((a, b) => a.price - b.price);
}
function mEstDraw(b) { let d = 90; if (b.cpu) d += b.cpu.tdp || 65; if (b.gpu) d += b.gpu.tdp || 0; return d; }

function moggerScore(build, ucKey, budget) {
  // Runs on the same engine FORGEAPC uses: checkCompat + use-case-normalized
  // performance (analyzeBuild). Mogger rule on top: any issue OR missing part = 0.
  const a = analyzeBuild(build, ucKey, budget);
  const filled = CATEGORY_ORDER.filter((c) => build[c]).length;
  const issues = [...a.compat.issues];
  if (filled < CATEGORY_ORDER.length) issues.push("Build is incomplete — missing parts");
  const spend = a.total, over = spend > budget, overBy = Math.max(0, spend - budget);
  const perfPct = Math.round(a.fitNorm * 100);
  if (issues.length > 0) return { total: 0, perf: perfPct, value: 0, compat: 0, completeness: Math.round((filled / CATEGORY_ORDER.length) * 100), spend, over, overBy, issues, dead: true };
  // Engine composite: performance + price/perf value + budget use + cpu/gpu balance
  const raw = (a.score / 1000) * 0.6 + (a.ppScore / 100) * 0.2 + (a.budgetAdh / 100) * 0.15 + (a.balance / 100) * 0.05;
  return { total: Math.round(clamp(raw, 0, 1) * 1000), perf: perfPct, value: a.ppScore, compat: 100, completeness: 100, spend, over, overBy, issues: [] };
}

// elo-driven AI. Higher elo => stronger, more consistent builds.
//  - mistake chance curve: ~13% at low elo -> ~0.05% at 3000 (a mistake = a weaker but still COMPATIBLE pick)
//  - only the lowest levels (elo < 400) can build something incompatible, at 5%
function moggerAI(ucKey, budget, elo) {
  elo = (typeof elo === "number" && isFinite(elo)) ? clamp(elo, 0, 3000) : 600;
  const pMistake = Math.max(0.0005, 0.13 * Math.pow(1 - elo / 3000, 2));
  const pIncompat = elo < 400 ? 0.05 : 0;
  const W = USE_CASES[ucKey].alloc;
  const build = {};
  const order = [...CATEGORY_ORDER].sort((a, b) => (W[b] || 0) - (W[a] || 0));
  const draw = () => mEstDraw(build);
  const ok = (c, o) => {
    if (c === "mobo" && build.cpu && o.socket !== build.cpu.socket) return false;
    if (c === "cpu" && build.mobo && o.socket !== build.mobo.socket) return false;
    if (c === "cooler") { if (build.cpu && o.sockets && !o.sockets.includes(build.cpu.socket)) return false; if (build.cpu && o.tdpRating && o.tdpRating < build.cpu.tdp) return false; }
    if (c === "psu" && o.watt && o.watt < requiredWatts(build) * 1.25) return false;
    return true;
  };
  const spent = () => CATEGORY_ORDER.reduce((s, c) => s + (build[c] ? build[c].price : 0), 0);
  const up = (c, o) => ucPerf(c, o, ucKey); // engine's use-case-adjusted perf — the thing that's actually scored

  // lowest-level fumble: deliberately incompatible build (scores 0)
  if (Math.random() < pIncompat) {
    for (const c of order) { const opts = [...moggerOptions(c)].sort((a, b) => a.price - b.price); build[c] = opts[0]; }
    if (build.cpu) { const wrong = moggerOptions("mobo").find((m) => m.socket !== build.cpu.socket); if (wrong) build.mobo = wrong; }
    return build;
  }

  // 1) Valid, complete, cheap base.
  for (const c of order) { const opts = [...moggerOptions(c)].sort((a, b) => a.price - b.price); build[c] = opts.find((o) => ok(c, o)) || opts[0]; }

  // 2) Quality scales with elo: weak players aim lower, strong players use the full budget optimally.
  const cap = budget * (elo >= 2800 ? 0.94 : clamp(0.5 + (elo / 3000) * 0.5, 0.5, 0.94));
  const cheapestMobo = (sock) => moggerOptions("mobo").filter((m) => m.socket === sock).sort((a, b) => a.price - b.price)[0];
  const cheapestCooler = (cpu) => moggerOptions("cooler").filter((cl) => (!cl.sockets || cl.sockets.includes(cpu.socket)) && (!cl.tdpRating || cl.tdpRating >= cpu.tdp)).sort((a, b) => a.price - b.price)[0];

  // 3) Greedy upgrade pass: best weighted perf-per-extra-dollar upgrade that still fits.
  let guard = 0, improved = true;
  while (improved && guard++ < 500) {
    improved = false;
    let best = null;
    for (const c of order) {
      const w = W[c] || 0.02, cur = build[c];
      for (const o of moggerOptions(c)) {
        if (!ok(c, o) || !cur || up(c, o) <= up(c, cur)) continue;
        const delta = o.price - cur.price; if (delta <= 0) continue;
        if (spent() - cur.price + o.price > cap) continue;
        const gain = (up(c, o) - up(c, cur)) * w / delta;
        if (!best || gain > best.gain) best = { kind: "one", c, part: o, gain };
      }
    }
    if (build.cpu) {
      for (const cpu of moggerOptions("cpu")) {
        if (up("cpu", cpu) <= up("cpu", build.cpu)) continue;
        const mobo = cheapestMobo(cpu.socket), cooler = cheapestCooler(cpu);
        if (!mobo || !cooler) continue;
        const oldCost = build.cpu.price + (build.mobo ? build.mobo.price : 0) + (build.cooler ? build.cooler.price : 0);
        const newCost = cpu.price + mobo.price + cooler.price, delta = newCost - oldCost;
        if (delta <= 0) continue;
        if (spent() - oldCost + newCost > cap) continue;
        const gain = (up("cpu", cpu) - up("cpu", build.cpu)) * (W.cpu || 0.1) / delta;
        if (!best || gain > best.gain) best = { kind: "platform", cpu, mobo, cooler, gain };
      }
    }
    if (best) { improved = true; if (best.kind === "one") build[best.c] = best.part; else { build.cpu = best.cpu; build.mobo = best.mobo; build.cooler = best.cooler; } }
  }

  // 4) Ensure cooler/PSU adequate, then trim under budget.
  const fixValid = () => {
    if (build.cpu) { const cl = cheapestCooler(build.cpu); if (cl && (!build.cooler || (build.cooler.tdpRating && build.cooler.tdpRating < build.cpu.tdp) || (build.cooler.sockets && !build.cooler.sockets.includes(build.cpu.socket)))) build.cooler = cl; }
    const d = requiredWatts(build) * 1.25; const psu = moggerOptions("psu").filter((p) => p.watt && p.watt >= d).sort((a, b) => a.price - b.price)[0];
    if (psu && (!build.psu || (build.psu.watt && build.psu.watt < d))) build.psu = psu;
  };
  fixValid();

  // 4b) Coerce RAM type + case fit so the build is never incompatible on those axes.
  const fixCompat = () => {
    // RAM must match the motherboard's type and capacity limit
    if (build.mobo) {
      const need = build.mobo.ramType, maxR = build.mobo.maxRam;
      const ramOk = (r) => (!need || !r.ramType || r.ramType === need) && (!maxR || !r.cap || r.cap <= maxR);
      if (!build.ram || !ramOk(build.ram)) {
        const cands = moggerOptions("ram").filter(ramOk).sort((a, b) => up("ram", b) - up("ram", a) || a.price - b.price);
        if (cands.length) { const within = cands.filter((r) => spent() - (build.ram ? build.ram.price : 0) + r.price <= budget); build.ram = within[0] || cands[cands.length - 1]; }
      }
    }
    // Case must fit the motherboard form, the GPU length, and the cooler height
    const caseFits = (cs) => (!build.mobo || !cs.forms || !build.mobo.form || cs.forms.includes(build.mobo.form))
      && (!build.gpu || !cs.maxGpu || !build.gpu.len || build.gpu.len <= cs.maxGpu)
      && (!build.cooler || !cs.maxCool || !build.cooler.height || build.cooler.height <= cs.maxCool);
    if (build.case && !caseFits(build.case)) {
      const cands = moggerOptions("case").filter(caseFits).sort((a, b) => a.price - b.price);
      if (cands.length) { const within = cands.filter((cs) => spent() - build.case.price + cs.price <= budget); build.case = within[0] || cands[0]; }
      else if (build.gpu) { // no case fits the GPU — take the roomiest case and shrink the GPU to fit
        const roomy = [...moggerOptions("case")].sort((a, b) => (b.maxGpu || 0) - (a.maxGpu || 0))[0];
        if (roomy) { build.case = roomy; const g = moggerOptions("gpu").filter((x) => !roomy.maxGpu || !x.len || x.len <= roomy.maxGpu).sort((a, b) => up("gpu", b) - up("gpu", a))[0]; if (g) build.gpu = g; }
      }
    }
  };
  fixCompat();

  // stricter check that also respects RAM/case fit — used once mobo/gpu/cooler are settled
  const fullOk = (c, o) => {
    if (!ok(c, o)) return false;
    if (c === "ram" && build.mobo) { if (build.mobo.ramType && o.ramType && o.ramType !== build.mobo.ramType) return false; if (build.mobo.maxRam && o.cap && o.cap > build.mobo.maxRam) return false; }
    if (c === "mobo") { if (build.ram && build.ram.ramType && o.ramType && o.ramType !== build.ram.ramType) return false; if (build.case && build.case.forms && o.form && !build.case.forms.includes(o.form)) return false; }
    if (c === "case") { if (build.mobo && build.mobo.form && o.forms && !o.forms.includes(build.mobo.form)) return false; if (build.gpu && build.gpu.len && o.maxGpu && build.gpu.len > o.maxGpu) return false; if (build.cooler && build.cooler.height && o.maxCool && build.cooler.height > o.maxCool) return false; }
    if (c === "gpu" && build.case && build.case.maxGpu && o.len && o.len > build.case.maxGpu) return false;
    if (c === "cooler" && build.case && build.case.maxCool && o.height && o.height > build.case.maxCool) return false;
    return true;
  };

  let tg = 0;
  while (spent() > budget && tg++ < 200) {
    let bestSwap = null;
    for (const c of order) {
      const cur = build[c]; if (!cur) continue;
      const cheaper = moggerOptions(c).filter((o) => fullOk(c, o) && o.price < cur.price).sort((a, b) => up(c, b) - up(c, a))[0];
      if (!cheaper) continue;
      const save = cur.price - cheaper.price; if (save <= 0) continue;
      const loss = (up(c, cur) - up(c, cheaper)) * (W[c] || 0.02) / save;
      if (!bestSwap || loss < bestSwap.loss) bestSwap = { c, part: cheaper, loss };
    }
    if (!bestSwap) break;
    build[bestSwap.c] = bestSwap.part;
  }

  // 5) Mistake (compatible downgrade only — never makes it incompatible).
  if (Math.random() < pMistake) {
    const n = 1 + (Math.random() < 0.4 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const c = order[Math.floor(Math.random() * order.length)];
      const cur = build[c];
      const cheaper = moggerOptions(c).filter((o) => fullOk(c, o) && cur && up(c, o) < up(c, cur)).sort((a, b) => up(c, b) - up(c, a))[0];
      if (cheaper) build[c] = cheaper;
    }
  }
  return build;
}
// Custom rank can be plain text (legacy) or JSON {name,color,icon}.
function parseCrank(c) {
  if (!c) return null;
  let s = String(c).trim(); if (!s) return null;
  const Q = String.fromCharCode(34); // a double-quote char, without writing one in code
  // try JSON (and unwrap a double-encoded string once)
  for (let i = 0; i < 2; i++) {
    if (s.charCodeAt(0) === 123) {
      try {
        const o = JSON.parse(s);
        if (o && typeof o === "object" && o.name) return { name: String(o.name), color: o.color || "#ff7ae0", icon: o.icon || "\u2B50" };
        if (typeof o === "string") { s = o.trim(); continue; }
      } catch (e) {}
    }
    break;
  }
  // malformed-but-recognizable JSON: pull fields out manually so raw braces never show
  if (s.indexOf(Q + "name" + Q) >= 0) {
    const grab = (key) => {
      const t = s.indexOf(Q + key + Q); if (t < 0) return null;
      const colon = s.indexOf(":", t); if (colon < 0) return null;
      const q1 = s.indexOf(Q, colon + 1); if (q1 < 0) return null;
      const q2 = s.indexOf(Q, q1 + 1); if (q2 < 0) return null;
      return s.slice(q1 + 1, q2);
    };
    const nm = grab("name");
    if (nm) return { name: nm, color: grab("color") || "#ff7ae0", icon: grab("icon") || "\u2B50" };
  }
  // plain text legacy rank
  if (s.charCodeAt(0) === 123) return null; // looked like JSON but unreadable — fall back to elo rank
  return { name: s, color: "#ff7ae0", icon: "\u2B50" };
}
function hexToRgba(hex, a) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h, 16); if (isNaN(n) || h.length !== 6) return "rgba(255,122,224," + a + ")";
  return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}
// Player rank from elo, or a custom override (set by admin).
function moggerRank(elo, custom) {
  const cr = parseCrank(custom);
  if (cr) return { name: cr.name, cls: "custom", icon: cr.icon, color: cr.color, custom: true };
  const e = typeof elo === "number" && isFinite(elo) ? elo : 0;
  if (e >= 2500) return { name: "God Tier", cls: "god", icon: "👑", color: "#ffc24b" };
  if (e >= 1500) return { name: "Elite Tier", cls: "elite", icon: "💎", color: "#7c5cff" };
  if (e >= 1300) return { name: "Slightly High Tier", cls: "shigh", icon: "🔷", color: "#5ec8ff" };
  if (e >= 950) return { name: "High Tier", cls: "high", icon: "⚡", color: "#19e8db" };
  if (e >= 650) return { name: "Mid Tier", cls: "mid", icon: "🔧", color: "#46e0a0" };
  return { name: "Low Tier", cls: "low", icon: "🔩", color: "#8aa0b4" };
}
function RankBadge({ rank }) {
  if (!rank) return null;
  const style = rank.custom ? { color: "#fff", background: hexToRgba(rank.color, 0.2), borderColor: rank.color, boxShadow: "0 0 12px " + hexToRgba(rank.color, 0.45) } : undefined;
  return <span className={"pm-rank pm-rank-" + rank.cls} style={style}>{rank.icon} {rank.name}</span>;
}
// Searchable icon set (system emoji, rendered crisp/pixelated via CSS).
const MOGGER_EMOJI = [
  ["🖥️", "pc computer desktop monitor"], ["💻", "laptop computer"], ["🕹️", "joystick game arcade"], ["🎮", "controller gamepad game"], ["⌨️", "keyboard"], ["🖱️", "mouse"], ["💾", "save floppy disk"], ["💿", "disc cd"], ["🧠", "brain smart ai"], ["⚙️", "gear settings cog"], ["🔧", "wrench tool fix"], ["🔩", "bolt nut screw"], ["🔌", "plug power"], ["🔋", "battery power"], ["⚡", "bolt lightning power fast"], ["🛠️", "tools build"],
  ["👑", "crown king queen royal"], ["💎", "diamond gem rare"], ["🏆", "trophy win champion"], ["🥇", "gold medal first"], ["🥈", "silver medal second"], ["🥉", "bronze medal third"], ["🎖️", "medal honor"], ["🏅", "medal sports"], ["⭐", "star fav"], ["🌟", "star glowing"], ["✨", "sparkles shiny"], ["💫", "dizzy star"], ["🔥", "fire hot flame lit"], ["💥", "boom explosion"], ["☄️", "comet meteor"], ["🌈", "rainbow"],
  ["😀", "happy smile grin face"], ["😎", "cool sunglasses"], ["🤓", "nerd geek glasses"], ["🤖", "robot bot ai"], ["👽", "alien ufo"], ["👾", "alien monster game invader"], ["💀", "skull dead"], ["☠️", "skull crossbones pirate"], ["🤡", "clown"], ["👻", "ghost boo"], ["🎃", "pumpkin halloween"], ["😈", "devil evil"], ["🤠", "cowboy"], ["🥶", "cold freeze"], ["🤯", "mind blown"], ["😤", "angry steam"],
  ["🐉", "dragon mythical"], ["🦖", "dinosaur trex"], ["🦄", "unicorn"], ["🐺", "wolf"], ["🦁", "lion"], ["🐯", "tiger"], ["🐸", "frog"], ["🐢", "turtle slow"], ["🦈", "shark"], ["🐍", "snake"], ["🦅", "eagle bird"], ["🐝", "bee"], ["🦂", "scorpion"], ["🕷️", "spider"], ["🐙", "octopus"], ["🦀", "crab"],
  ["⚔️", "swords battle fight"], ["🛡️", "shield defense"], ["🏹", "bow arrow archer"], ["🗡️", "dagger sword"], ["🔫", "gun"], ["💣", "bomb"], ["🧨", "dynamite"], ["🎯", "target dart bullseye"], ["🚀", "rocket launch fast"], ["🛸", "ufo spaceship"], ["✈️", "plane"], ["🏎️", "race car fast"], ["🏍️", "motorcycle"], ["⛵", "boat sail"], ["🚂", "train"], ["🛹", "skateboard"],
  ["❤️", "heart love red"], ["🧡", "orange heart"], ["💛", "yellow heart"], ["💚", "green heart"], ["💙", "blue heart"], ["💜", "purple heart"], ["🖤", "black heart"], ["🤍", "white heart"], ["💯", "hundred perfect score"], ["✅", "check done ok"], ["❌", "x cross no"], ["⛔", "no stop forbidden"], ["⚠️", "warning caution"], ["🚩", "flag red"], ["🏁", "checkered flag finish race"], ["🎌", "flags"],
  ["🎵", "music note"], ["🎧", "headphones audio"], ["🎸", "guitar rock"], ["🥁", "drums"], ["🎹", "piano keys"], ["🎤", "mic sing"], ["📷", "camera photo"], ["🎬", "movie film clapper"], ["📺", "tv"], ["💡", "idea light bulb"], ["🔦", "flashlight"], ["🕯️", "candle"], ["🪙", "coin money"], ["💰", "money bag rich"], ["💵", "cash dollar"], ["💳", "card"],
  ["🌌", "galaxy space stars milky way"], ["🌙", "moon crescent night"], ["☀️", "sun"], ["⛈️", "storm thunder"], ["❄️", "snow ice cold"], ["🌊", "wave water ocean"], ["🍀", "clover luck"], ["🌹", "rose flower"], ["🌵", "cactus"], ["🍕", "pizza food"], ["🍔", "burger food"], ["🍩", "donut"], ["🍺", "beer"], ["☕", "coffee"], ["🧊", "ice cube cold"], ["🧃", "juice"],
  ["👊", "fist punch"], ["✊", "fist raised"], ["🤛", "fist bump"], ["👍", "thumbs up like"], ["👎", "thumbs down"], ["🙌", "raise hands celebrate"], ["👀", "eyes look"], ["🫡", "salute"], ["🤙", "call shaka"], ["✌️", "peace victory"], ["🤘", "rock horns metal"], ["🫶", "heart hands"], ["💪", "muscle strong flex"], ["🦾", "robot arm cyborg"], ["🧿", "evil eye"], ["♾️", "infinity forever"],
];
function MoggerEmojiPicker({ onPick }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => { const t = q.trim().toLowerCase(); return t ? MOGGER_EMOJI.filter(([e, k]) => k.includes(t)) : MOGGER_EMOJI; }, [q]);
  return (
    <div className="pm-emoji-pick">
      <div className="pm-emoji-search"><Search size={13} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search icons…" autoFocus /></div>
      <div className="pm-emoji-grid">
        {list.map(([e], i) => <button key={i} className="pm-emoji-btn" title={e} onClick={() => onPick(e)}>{e}</button>)}
        {list.length === 0 && <span className="pm-emoji-none">No icons match</span>}
      </div>
    </div>
  );
}
function moggerRollTier() { const r = Math.random(); return r < 0.62 ? "elite" : r < 0.93 ? "normal" : "fail"; }
// AI difficulty by elo: higher elo -> stronger, more consistent builds.
function moggerTierFromElo(elo) {
  const pFail = clamp(0.6 - elo / 2000, 0.02, 0.7);
  const pElite = clamp(elo / 2500, 0.05, 0.95);
  const r = Math.random();
  if (r < pElite) return "elite";
  if (r < pElite + pFail) return "fail";
  return "normal";
}

function moggerSpecs(p, cat) {
  const s = [];
  if (cat === "cpu") { if (p.socket) s.push(["Socket", p.socket]); if (p.cores) s.push(["Cores", p.cores]); if (p.tdp) s.push(["TDP", p.tdp + "W"]); if (p.igpu) s.push(["iGPU", "Yes"]); }
  else if (cat === "gpu") { if (p.vram) s.push(["VRAM", p.vram + "GB"]); if (p.tdp) s.push(["TDP", p.tdp + "W"]); if (p.len) s.push(["Length", p.len + "mm"]); }
  else if (cat === "ram") { if (p.cap) s.push(["Capacity", p.cap + "GB"]); if (p.ramType) s.push(["Type", p.ramType]); if (p.speed) s.push(["Speed", p.speed + " MT/s"]); }
  else if (cat === "storage") { if (p.cap) s.push(["Capacity", p.cap >= 1000 ? (p.cap / 1000) + "TB" : p.cap + "GB"]); if (p.iface || p.kind) s.push(["Interface", p.iface || p.kind]); }
  else if (cat === "mobo") { if (p.socket) s.push(["Socket", p.socket]); if (p.ramType) s.push(["RAM", p.ramType]); if (p.form) s.push(["Form", p.form]); if (p.m2 != null) s.push(["M.2 slots", p.m2]); }
  else if (cat === "psu") { if (p.watt) s.push(["Wattage", p.watt + "W"]); if (p.eff) s.push(["Rating", "80+ " + p.eff]); }
  else if (cat === "cooler") { if (p.sockets) s.push(["Sockets", p.sockets.join("/")]); if (p.tdpRating) s.push(["Cools", "up to " + p.tdpRating + "W"]); if (p.type) s.push(["Type", p.type]); if (p.height) s.push(["Height", p.height + "mm"]); }
  return s;
}

const MOGGER_FILTERS = {
  cpu: [{ k: "socket", label: "Socket" }],
  gpu: [{ k: "vram", label: "VRAM", fmt: (v) => v + "GB" }],
  mobo: [{ k: "socket", label: "Socket" }, { k: "ramType", label: "RAM" }, { k: "form", label: "Form" }],
  ram: [{ k: "ramType", label: "Type" }, { k: "cap", label: "Size", fmt: (v) => v + "GB" }],
  storage: [{ k: "kind", label: "Type" }, { k: "cap", label: "Size", fmt: (v) => (v >= 1000 ? v / 1000 + "TB" : v + "GB") }],
  psu: [{ k: "watt", label: "Watts", fmt: (v) => v + "W" }, { k: "eff", label: "Rating" }],
  case: [{ k: "forms", label: "Fits", arr: true }],
  cooler: [{ k: "sockets", label: "Socket", arr: true }, { k: "type", label: "Type", fmt: (v) => (v === "aio" ? "AIO liquid" : "Air") }],
};
const MOGGER_SORTS = [
  { k: "price-asc", label: "Price ↑" },
  { k: "price-desc", label: "Price ↓" },
  { k: "perf-desc", label: "Performance" },
  { k: "name-asc", label: "Name A–Z" },
];

function MoggerPicker({ cat, current, budget, spent, onPick, onClose }) {
  const all = useMemo(() => moggerOptionsAll(cat), [cat]);
  const [q, setQ] = useState("");
  const [info, setInfo] = useState(null);
  const [sort, setSort] = useState("price-asc");
  const [flt, setFlt] = useState({});
  const filters = MOGGER_FILTERS[cat] || [];
  const filterVals = useMemo(() => {
    const out = {};
    for (const f of filters) {
      const set = new Set();
      for (const o of all) { const v = o[f.k]; if (v == null) continue; if (f.arr) { for (const x of v) set.add(x); } else set.add(v); }
      out[f.k] = [...set].sort((a, b) => (typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b))));
    }
    return out;
  }, [all, cat]);
  const opts = useMemo(() => {
    const t = q.trim().toLowerCase();
    let list = !t ? all : all.filter((o) => ((o.model || "") + " " + (o.name || "") + " " + (o.brand || "")).toLowerCase().includes(t));
    for (const f of filters) {
      const sel = flt[f.k];
      if (sel == null || sel === "") continue;
      list = list.filter((o) => { const v = o[f.k]; if (v == null) return false; return f.arr ? v.map(String).includes(sel) : String(v) === sel; });
    }
    const arr = [...list];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "perf-desc") arr.sort((a, b) => (b.perf || 0) - (a.perf || 0));
    else if (sort === "name-asc") arr.sort((a, b) => (a.model || a.name || "").localeCompare(b.model || b.name || ""));
    return arr;
  }, [all, q, sort, flt, cat]);
  const cap = budget + 50; // hard limit: cannot go more than $50 over budget
  const Icon = CAT_META[cat].Icon;
  return (
    <div className="pm-drawer-wrap" onClick={onClose}>
      <div className="pm-drawer rf-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="pm-drawer-head"><span>Choose {CAT_META[cat].label}</span><button className="pm-x" onClick={onClose}><X size={18} /></button></div>
        <div className="pm-search"><Search size={15} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={"Search " + CAT_META[cat].label.toLowerCase() + "…"} />{q && <button className="pm-search-x" onClick={() => setQ("")}><X size={13} /></button>}</div>
        <div className="pm-filters">
          <select className="pm-fsel" value={sort} onChange={(e) => setSort(e.target.value)}>{MOGGER_SORTS.map((s) => <option key={s.k} value={s.k}>{s.label}</option>)}</select>
          {filters.map((f) => (
            <select key={f.k} className={"pm-fsel" + (flt[f.k] ? " on" : "")} value={flt[f.k] || ""} onChange={(e) => setFlt((p) => ({ ...p, [f.k]: e.target.value }))}>
              <option value="">{f.label}: all</option>
              {(filterVals[f.k] || []).map((v) => <option key={String(v)} value={String(v)}>{f.fmt ? f.fmt(v) : String(v)}</option>)}
            </select>
          ))}
          {(Object.values(flt).some(Boolean)) && <button className="pm-fclear" onClick={() => setFlt({})}>Clear</button>}
        </div>
        <div className="pm-opts">
          {opts.map((o) => {
            const sel = current && current.id === o.id;
            const oos = !!o._oos;
            const wouldBe = spent - (current ? current.price : 0) + o.price;
            const blocked = (oos || wouldBe > cap) && !sel;
            const showSpecs = info === o.id;
            const specs = showSpecs ? moggerSpecs(o, cat) : null;
            return (
              <div key={o.id} className="pm-optwrap">
                <div className={"pm-opt" + (sel ? " sel" : "") + (blocked ? " blocked" : "") + (oos ? " oos" : "")}>
                  <button className="pm-opt-pick" disabled={blocked} onClick={() => { if (!blocked) onPick(o); }}>
                    <span className="pm-opt-img">{o.img ? <img src={o.img} alt="" loading="lazy" /> : <Icon size={18} />}</span>
                    <span className="pm-opt-main"><span className="pm-opt-name">{o.model || o.name}</span><span className="pm-opt-brand">{o.brand}</span></span>
                    <span className="pm-opt-right">{oos ? <span className="pm-opt-oos">Out of stock</span> : <><span className="pm-opt-price">{o.price === 0 ? "Free" : fmt(o.price)}</span>{blocked ? <span className="pm-opt-block">over limit</span> : <span className={"pm-opt-bar" + (wouldBe > budget ? " over" : "")}><i style={{ width: clamp(o.perf, 4, 100) + "%" }} /></span>}</>}</span>
                  </button>
                  <button className="pm-opt-info" onClick={() => setInfo(showSpecs ? null : o.id)}>{showSpecs ? "Hide" : "Specs"}</button>
                </div>
                {showSpecs && <div className="pm-specs">{specs.length ? specs.map(([k, v], i) => <span key={i}><i>{k}</i>{v}</span>) : <span className="pm-specs-none">No specs listed</span>}</div>}
              </div>
            );
          })}
          {opts.length === 0 && <div className="pm-empty">No matches</div>}
        </div>
      </div>
    </div>
  );
}

function MoggerBuild({ round, player, oppLabel, oppBuild, oppLocked, oppIsAI, liveOpp, oppLiveScore, oppLiveDone, onMyScore, myElo, oppElo, onDone }) {
  const oppFinal = useMemo(() => (oppBuild ? moggerScore(oppBuild, round.useCase, round.budget).total : null), []);
  const [build, setBuild] = useState({});
  const [open, setOpen] = useState(null);
  const [left, setLeft] = useState(round.secs);
  const [oppShown, setOppShown] = useState(oppFinal == null ? null : (oppLocked ? oppFinal : 0));
  const [oppDone, setOppDone] = useState(!!oppLocked);
  const ref = useRef(build); ref.current = build;
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => { if (l <= 1) { clearInterval(t); onDone(ref.current); return 0; } return l - 1; }), 1000);
    return () => clearInterval(t);
  }, []);
  const hasOpp = oppIsAI || !!oppBuild || !!liveOpp;
  const mkDecoy = () => { const d = {}; for (const c of CATEGORY_ORDER) { const o = moggerOptions(c); d[c] = o[Math.floor(Math.random() * o.length)]; } return d; };
  const [decoy, setDecoy] = useState(mkDecoy);
  const swapOneDecoy = () => setDecoy((prev) => { const c = CATEGORY_ORDER[Math.floor(Math.random() * CATEGORY_ORDER.length)]; const o = moggerOptions(c); return { ...prev, [c]: o[Math.floor(Math.random() * o.length)] }; });
  // my live score (broadcast to opponent online); shown as "?" locally
  const myScore = useMemo(() => moggerScore(build, round.useCase, round.budget).total, [build]);
  useEffect(() => { if (onMyScore) onMyScore(myScore); }, [myScore]);
  // live online opponent: flicker one part each time their score updates
  useEffect(() => { if (liveOpp) swapOneDecoy(); }, [oppLiveScore]);
  // AI opponent: score fluctuates upward (chunky +50-120, occasional -50-120), then locks in.
  // Each score tick swaps exactly ONE part in its (blurred) build — not all at once.
  useEffect(() => {
    if (oppFinal == null || oppLocked) return;
    const lockAt = round.secs * (0.55 + Math.random() * 0.3); // seconds elapsed when AI locks
    const ceiling = Math.max(0, oppFinal); // climb toward the AI's real score (0 if its build is incompatible)
    const t0 = Date.now();
    let cur = 0;
    let iv;
    const step = () => {
      const elapsed = (Date.now() - t0) / 1000;
      if (elapsed >= lockAt) { setOppShown(oppFinal); setOppDone(true); return; }
      const roll = Math.random();
      let d;
      if (roll < 0.18) d = -(50 + Math.random() * 70);
      else if (roll < 0.30) d = (120 + Math.random() * 80);
      else d = (50 + Math.random() * 70);
      cur = Math.max(0, Math.min(ceiling, cur + d));
      setOppShown(Math.round(cur));
      swapOneDecoy(); // one part changes, in sync with the score
      iv = setTimeout(step, 1700 + Math.random() * 1100);
    };
    iv = setTimeout(step, 900);
    return () => clearTimeout(iv);
  }, []);
  const spent = CATEGORY_ORDER.reduce((s, c) => s + (build[c] ? build[c].price : 0), 0);
  const over = spent > round.budget;
  const filled = CATEGORY_ORDER.filter((c) => build[c]).length;
  const shownOpp = oppIsAI ? oppShown : oppLocked ? oppFinal : liveOpp ? (oppLiveScore == null ? null : oppLiveScore) : null;
  const shownDone = oppIsAI ? oppDone : oppLocked ? true : liveOpp ? !!oppLiveDone : false;
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, "0");
  const low = left <= 15;
  const UC = USE_CASES[round.useCase];
  return (
    <div className="pm-game rf-fade">
      <div className="pm-vs">
        <div className="pm-board you">
          <div className="pm-board-name">{player && player.startsWith("Player") ? player : "YOU"}</div>
          {myElo != null && <div className="pm-board-elo">{myElo} elo</div>}
          <div className="pm-board-score">?</div>
          <div className="pm-board-sub">{filled}/{CATEGORY_ORDER.length} parts</div>
        </div>
        <div className="pm-vs-mid">
          <div className="pm-vs-word">VS</div>
          <div className={"pm-timer" + (low ? " low" : "")}>{mm}:{ss}</div>
        </div>
        <div className="pm-board opp">
          <div className="pm-board-name">{oppLabel}</div>
          {oppElo != null && <div className="pm-board-elo">{oppElo === "?" ? "? elo" : oppElo + " elo"}</div>}
          <div className="pm-board-score opp">{shownOpp == null ? "—" : shownOpp}</div>
          <div className={"pm-board-sub" + (shownDone ? " locked" : "")}>{shownOpp == null ? "waiting" : shownDone ? "🔒 locked in — waiting for you" : "building…"}</div>
        </div>
      </div>
      <div className="pm-challenge-row"><span className="pm-uc"><UC.Icon size={16} /> {UC.label}</span><span className="pm-budget">Budget {fmt(round.budget)}</span></div>
      <div className={"pm-spend" + (over ? " over" : "")}>Spent {fmt(spent)} / {fmt(round.budget)}{over && <b> · OVER BUDGET (penalized)</b>} · hard cap {fmt(round.budget + 50)}</div>
      <div className="pm-arena">
        <div className="pm-col you">
          <div className="pm-col-h">YOUR BUILD</div>
          {CATEGORY_ORDER.map((c) => { const Icon = CAT_META[c].Icon; const p = build[c]; return (
            <button key={c} className={"pm-ctile" + (p ? " filled" : "")} onClick={() => setOpen(c)}>
              <span className="pm-ctile-img">{p && p.img ? <img src={p.img} alt="" /> : <Icon size={17} />}</span>
              <span className="pm-ctile-body"><span className="pm-ctile-cat">{CAT_META[c].label}</span>{p ? <span className="pm-ctile-name">{p.model || p.name}</span> : <span className="pm-ctile-add">+ Add part</span>}</span>
              {p && <span className="pm-ctile-price">{p.price === 0 ? "Free" : fmt(p.price)}</span>}
            </button>
          ); })}
        </div>
        <div className="pm-col opp">
          <div className="pm-col-h">{oppLabel}{oppLocked ? " · locked in" : oppIsAI ? " · building" : ""}</div>
          <div className={"pm-col-parts" + (hasOpp ? " blur" : "")}>
            {CATEGORY_ORDER.map((c) => { const Icon = CAT_META[c].Icon; const p = hasOpp ? decoy[c] : null; return (
              <div key={c} className="pm-ctile opp">
                <span className="pm-ctile-img">{p && p.img ? <img src={p.img} alt="" /> : <Icon size={17} />}</span>
                <span className="pm-ctile-body"><span className="pm-ctile-cat">{CAT_META[c].label}</span><span className="pm-ctile-name">{p ? (p.model || p.name) : "waiting…"}</span></span>
              </div>
            ); })}
          </div>
        </div>
      </div>
      <button className="rf-btn rf-btn-lg pm-lockin" onClick={() => onDone(build)}><Check size={16} /> Lock in build</button>
      {open && <MoggerPicker cat={open} current={build[open]} budget={round.budget} spent={spent} onPick={(o) => { setBuild((b) => ({ ...b, [open]: o })); setOpen(null); }} onClose={() => setOpen(null)} />}
    </div>
  );
}

function MoggerScoreCol({ title, build, s, win, shown, rank }) {
  const big = shown == null ? s.total : shown;
  return (
    <div className={"pm-scorecol" + (win ? " win" : "")}>
      <div className="pm-scorecol-head"><span className="pm-scorecol-title">{title}</span>{win && <span className="pm-crown">WINNER</span>}</div>
      {rank && <div className={"pm-rank pm-rank-" + rank.cls + " pm-rank-col"} style={rank.custom ? { color: "#fff", background: hexToRgba(rank.color, 0.2), borderColor: rank.color, boxShadow: "0 0 12px " + hexToRgba(rank.color, 0.45) } : undefined}>{rank.icon} {rank.name}</div>}
      <div className="pm-bigscore" style={rank ? { color: rank.color } : undefined}>{big}<small>/1000</small></div>
      <div className="pm-metrics"><span>Performance <b>{s.perf}</b></span><span>Value <b>{s.value}</b></span><span>Compatibility <b>{s.compat}</b></span><span>Spent <b className={s.over ? "pm-red" : ""}>{fmt(s.spend)}</b></span></div>
      {s.issues.length > 0 && <div className="pm-issues">{s.issues.map((i, n) => <span key={n}><AlertTriangle size={11} /> {i}</span>)}</div>}
      <div className="pm-buildlist">{CATEGORY_ORDER.map((c) => <span key={c}><i>{CAT_META[c].label}</i>{build[c] ? (build[c].model || build[c].name) : "—"}</span>)}</div>
    </div>
  );
}

function MoggerResult({ round, you, opp, oppName, oppElo, myElo, myCrank, eloMsg, onAgain, onMenu, onSaveBuild }) {
  const sy = useMemo(() => moggerScore(you, round.useCase, round.budget), []);
  const so = useMemo(() => moggerScore(opp, round.useCase, round.budget), []);
  const myRank = myElo != null ? moggerRank(myElo, myCrank) : null;
  const oppRank = oppElo != null ? moggerRank(oppElo) : null;
  const youWin = sy.total >= so.total;
  const [phase, setPhase] = useState("loading"); // loading -> reveal
  const [ay, setAy] = useState(0);
  const [ao, setAo] = useState(0);
  const [verdict, setVerdict] = useState("");
  const [busy, setBusy] = useState(true);
  const [savedYou, setSavedYou] = useState(false);
  const [savedOpp, setSavedOpp] = useState(false);
  const saveSide = async (which) => {
    if (!onSaveBuild) return;
    const ucLabel = USE_CASES[round.useCase].label;
    if (which === "you") { await onSaveBuild(you, round.useCase, round.budget, ucLabel + " — Mogger"); setSavedYou(true); }
    else { await onSaveBuild(opp, round.useCase, round.budget, oppName + "'s " + ucLabel); setSavedOpp(true); }
  };
  useEffect(() => {
    let dead = false;
    let raf;
    const loadT = setTimeout(() => {
      if (dead) return;
      setPhase("reveal");
      // smooth count-up over 0.8s (easeOutCubic)
      const dur = 800, t0 = performance.now();
      const tick = (now) => {
        const f = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - f, 3);
        setAy(Math.round(sy.total * e));
        setAo(Math.round(so.total * e));
        if (f < 1 && !dead) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      // verdict
      const sum = (label, b, s) => `${label}: ${CATEGORY_ORDER.map((c) => CAT_META[c].label + "=" + (b[c] ? (b[c].model || b[c].name) : "none")).join(", ")}. Score ${s.total}/1000 (perf ${s.perf}, value ${s.value}, compat ${s.compat}, spent ${fmt(s.spend)}${s.over ? " OVER BUDGET" : ""}${s.dead ? " INCOMPATIBLE-DEAD" : ""}).`;
      const system = "You are the judge of a PC-building battle in an app called PC Mogger. Write a short, punchy, entertaining verdict (2-3 sentences) saying why the winner won — call out the smartest pick and the biggest mistake, like a hype commentator. If a build scored 0 it had incompatible parts; roast that. Do not contradict the stated winner. No preamble.";
      const prompt = `Challenge: ${USE_CASES[round.useCase].label} build, budget ${fmt(round.budget)}.\n\n${sum("PLAYER (You)", you, sy)}\n${sum(oppName, opp, so)}\n\nWinner by score: ${youWin ? "You" : oppName}. Write the verdict.`;
      const fallback = () => { const w = youWin ? "You" : oppName; const d = Math.abs(sy.total - so.total); const loser = youWin ? so : sy; return `${w} take${youWin ? "" : "s"} it${d < 30 ? " in a photo finish" : d > 150 ? " in a blowout" : ""} — better balance for a ${USE_CASES[round.useCase].label} on ${fmt(round.budget)}. ${loser.dead ? "The other rig had incompatible parts and flatlined at zero." : loser.over ? "The other rig busted the budget." : "It came down to part-for-part value."}`; };
      (async () => {
        try { await streamChat({ system, messages: [{ role: "user", content: prompt }] }, (full) => { if (!dead) setVerdict(full); }); }
        catch (e) { if (!dead) setVerdict(fallback()); }
        finally { if (!dead) setBusy(false); }
      })();
    }, 1000);
    return () => { dead = true; clearTimeout(loadT); if (raf) cancelAnimationFrame(raf); };
  }, []);
  if (phase === "loading") {
    return (
      <div className="pm-result rf-fade">
        <div className="pm-loading">
          <div className="pm-spinner" />
          <div className="pm-loading-text">Scoring both builds…</div>
        </div>
      </div>
    );
  }
  return (
    <div className="pm-result rf-fade">
      <h2 className={"pm-verdict-title " + (youWin ? "win" : "lose")}>{youWin ? "🏆 YOU WIN" : "💀 YOU LOSE"}</h2>
      <div className="pm-verdict-box"><span className="pm-verdict-tag"><Sparkles size={12} /> AI JUDGE</span>{busy && !verdict ? <p className="pm-dim">Writing the verdict…</p> : <p>{verdict}</p>}</div>
      {eloMsg && <div className={"pm-elo-result " + (eloMsg.delta > 0 ? "up" : eloMsg.delta < 0 ? "down" : "")}>{eloMsg.delta > 0 ? "+" : ""}{eloMsg.delta} elo · now {eloMsg.newElo}</div>}
      <div className="pm-scorecols">
        <MoggerScoreCol title="You" build={you} s={sy} win={youWin} shown={ay} rank={myRank} />
        <MoggerScoreCol title={oppName} build={opp} s={so} win={!youWin} shown={ao} rank={oppRank} />
      </div>
      {onSaveBuild && phase === "reveal" && (
        <div className="pm-save-row">
          <span className="pm-save-label">Like a build? Save it to My Rigs:</span>
          <div className="pm-save-btns">
            <button className={"pm-save-btn" + (savedYou ? " done" : "")} disabled={savedYou} onClick={() => saveSide("you")}>{savedYou ? <><Check size={14} /> Saved your build</> : <><Save size={14} /> Save your build</>}</button>
            <button className={"pm-save-btn" + (savedOpp ? " done" : "")} disabled={savedOpp} onClick={() => saveSide("opp")}>{savedOpp ? <><Check size={14} /> Saved {oppName}'s</> : <><Save size={14} /> Save {oppName}'s build</>}</button>
          </div>
        </div>
      )}
      <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onMenu}>Menu</button><button className="rf-btn" onClick={onAgain}><Repeat2 size={16} /> Play again</button></div>
    </div>
  );
}

function MoggerLobby({ mode, onStart, onBack }) {
  const [pick, setPick] = useState(false);
  const [uc, setUc] = useState(MOGGER_UCS[0]);
  const [budget, setBudget] = useState(1500);
  const [timer, setTimer] = useState(0);
  const host = mode === "local";
  const begin = () => {
    const useCase = (host && pick) ? uc : mRand(MOGGER_UCS);
    const bud = (host && pick) ? budget : mRand(MOGGER_BUDGETS);
    const secs = (host && timer) ? timer : (50 + Math.floor(Math.random() * 370));
    onStart({ useCase, budget: bud, secs });
  };
  return (
    <div className="pm-card rf-fade">
      <h2 className="pm-h2">{mode === "ai" ? <><Bot size={20} /> vs AI</> : <><Gamepad2 size={20} /> Pass &amp; Play</>}</h2>
      {host && <label className="pm-toggle"><input type="checkbox" checked={pick} onChange={(e) => setPick(e.target.checked)} /><span>Host picks the challenge (off = random)</span></label>}
      {host && pick ? (
        <div className="pm-setup">
          <div className="pm-field"><span className="pm-field-l">Use case</span><div className="pm-chips">{MOGGER_UCS.map((k) => <button key={k} className={"pm-chip" + (uc === k ? " on" : "")} onClick={() => setUc(k)}>{USE_CASES[k].label}</button>)}</div></div>
          <div className="pm-field"><span className="pm-field-l">Budget: {fmt(budget)}</span><input type="range" min="600" max="4000" step="100" value={budget} onChange={(e) => setBudget(+e.target.value)} className="pm-range" /></div>
          <div className="pm-field"><span className="pm-field-l">Timer: {timer ? timer + "s" : "random (50s–7m)"}</span><input type="range" min="0" max="420" step="10" value={timer} onChange={(e) => setTimer(+e.target.value)} className="pm-range" /></div>
        </div>
      ) : <p className="pm-p">The challenge — use case, budget, and a random 50s–7m timer — is revealed when the round starts. Same parts and live prices as the builder. Build fast.</p>}
      <div className="pm-row"><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={begin}>Start round <ChevronRight size={16} /></button></div>
    </div>
  );
}

function MoggerIntro({ round, player, onGo }) {
  const [n, setN] = useState(3);
  const UC = USE_CASES[round.useCase];
  useEffect(() => {
    if (n <= 0) { const t = setTimeout(onGo, 650); return () => clearTimeout(t); }
    const t = setTimeout(() => setN(n - 1), 850);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div className="pm-intro">
      {player && <div className="pm-intro-player">{player}</div>}
      <div className="pm-intro-label">YOUR CHALLENGE</div>
      <div className="pm-intro-uc" key={"uc"}><UC.Icon size={36} /> {UC.label}</div>
      <div className="pm-intro-budget">{fmt(round.budget)} budget</div>
      <div className="pm-intro-count" key={n}>{n > 0 ? n : "BUILD!"}</div>
    </div>
  );
}

function tourNextPow2(n) { let s = 2; while (s < n) s *= 2; return s; }
function tourIsAI(id) { return typeof id === "string" && id.indexOf("AI#") === 0; }

function MoggerTournament({ onExit }) {
  const [phase, setPhase] = useState("entry"); // entry|joinentry|lobby|intro|build|waiting|roundresult|eliminated|champion
  const [code, setCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [myOpp, setMyOpp] = useState(null);
  const [results, setResults] = useState(null);
  const [champion, setChampion] = useState(null);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [names, setNames] = useState({});
  const [liveScores, setLiveScores] = useState({});
  const [roundMatches, setRoundMatches] = useState([]);
  const chRef = useRef(null), challengeRef = useRef(null), myBuildRef = useRef(null), cosmeticRef = useRef(null), namesRef = useRef({}), liveScoresRef = useRef({});
  const isHostRef = useRef(false), slotsRef = useRef([]), matchesRef = useRef([]), reportsRef = useRef({}), resolvedRef = useRef(false), roundNumRef = useRef(0), resolveTimer = useRef(null), aiTimersRef = useRef([]);

  const cleanup = () => { if (resolveTimer.current) clearTimeout(resolveTimer.current); aiTimersRef.current.forEach(clearTimeout); aiTimersRef.current = []; netLeave(chRef.current); chRef.current = null; };
  useEffect(() => () => cleanup(), []);

  const label = (id) => id === netId ? (name ? name + " (you)" : "You") : tourIsAI(id) ? "AI" : (namesRef.current[id] || ("Player " + String(id).slice(0, 4)));

  const handleRound = (payload) => {
    setResults(null);
    setRoundMatches(payload.matches);
    liveScoresRef.current = {}; setLiveScores({});
    const secsLeft = Math.max(8, Math.round(payload.challenge.secs - (Date.now() - payload.challenge.startAt) / 1000));
    const ch = { ...payload.challenge, secs: secsLeft };
    challengeRef.current = ch; setChallenge(ch); setRound(payload.round);
    const m = payload.matches.find((x) => x.a === netId || x.b === netId);
    if (m) {
      const opp = m.a === netId ? m.b : m.a;
      setMyOpp(opp);
      cosmeticRef.current = moggerAI(ch.useCase, ch.budget, 400 + Math.random() * 1100);
      myBuildRef.current = null;
      setPhase("intro");
    } else { setMyOpp(null); setPhase("eliminated"); }
  };

  // ---- host bracket engine ----
  const runRound = () => {
    resolvedRef.current = false; reportsRef.current = {};
    const slots = slotsRef.current;
    const matches = [];
    for (let i = 0; i < slots.length; i += 2) matches.push({ a: slots[i], b: slots[i + 1] });
    matchesRef.current = matches;
    const useCase = mRand(MOGGER_UCS), budget = mRand(MOGGER_BUDGETS), secs = 50 + Math.floor(Math.random() * 370);
    const challengePayload = { useCase, budget, secs, startAt: Date.now() };
    chRef.current.send({ type: "broadcast", event: "tour_round", payload: { round: roundNumRef.current, matches, challenge: challengePayload, slots } });
    handleRound({ round: roundNumRef.current, matches, challenge: challengePayload, slots });
    // simulate climbing scores for AI seats so spectators see them tick like real players
    aiTimersRef.current.forEach(clearTimeout); aiTimersRef.current = [];
    matches.flatMap((m) => [m.a, m.b]).filter(tourIsAI).forEach((aid) => {
      const ceiling = 500 + Math.random() * 350, lockAt = secs * (0.55 + Math.random() * 0.3), t0 = Date.now();
      let cur = 0;
      const stepFn = () => {
        if ((Date.now() - t0) / 1000 >= lockAt) return;
        const roll = Math.random();
        const d = roll < 0.18 ? -(50 + Math.random() * 70) : roll < 0.30 ? (120 + Math.random() * 80) : (50 + Math.random() * 70);
        cur = Math.max(0, Math.min(ceiling, cur + d));
        const sc = Math.round(cur);
        liveScoresRef.current = { ...liveScoresRef.current, [aid]: sc }; setLiveScores(liveScoresRef.current);
        try { chRef.current && chRef.current.send({ type: "broadcast", event: "tour_live", payload: { id: aid, score: sc } }); } catch (e) { /* ignore */ }
        aiTimersRef.current.push(setTimeout(stepFn, 1800 + Math.random() * 1000));
      };
      aiTimersRef.current.push(setTimeout(stepFn, 700 + Math.random() * 800));
    });
    if (resolveTimer.current) clearTimeout(resolveTimer.current);
    resolveTimer.current = setTimeout(() => resolveRound(), (secs + 12) * 1000);
  };
  const tryResolve = () => {
    if (resolvedRef.current) return;
    const need = matchesRef.current.flatMap((m) => [m.a, m.b]).filter((id) => !tourIsAI(id));
    if (need.every((id) => reportsRef.current[id])) resolveRound();
  };
  const resolveRound = () => {
    if (resolvedRef.current) return; resolvedRef.current = true;
    if (resolveTimer.current) { clearTimeout(resolveTimer.current); resolveTimer.current = null; }
    aiTimersRef.current.forEach(clearTimeout); aiTimersRef.current = [];
    const ch = challengeRef.current || {};
    const scoreOf = (id) => { if (tourIsAI(id)) { const b = moggerAI(ch.useCase, ch.budget, 400 + Math.random() * 1100); return moggerScore(b, ch.useCase, ch.budget).total; } const r = reportsRef.current[id]; return r ? r.score : 0; };
    const res = matchesRef.current.map((m) => { const a = scoreOf(m.a), b = scoreOf(m.b); return { a: m.a, b: m.b, aScore: a, bScore: b, winner: a >= b ? m.a : m.b }; });
    const winners = res.map((r) => r.winner);
    chRef.current.send({ type: "broadcast", event: "tour_results", payload: { round: roundNumRef.current, results: res, winners } });
    setResults({ round: roundNumRef.current, results: res, winners }); setPhase((p) => p === "champion" ? p : "roundresult");
    if (winners.length === 1) {
      setTimeout(() => { try { chRef.current.send({ type: "broadcast", event: "tour_done", payload: { champion: winners[0] } }); } catch (e) {} setChampion(winners[0]); setPhase("champion"); }, 3500);
    } else { slotsRef.current = winners; roundNumRef.current += 1; setTimeout(() => runRound(), 5000); }
  };

  const wire = (ch) => {
    ch.on("broadcast", { event: "tour_round" }, ({ payload }) => handleRound(payload));
    ch.on("broadcast", { event: "tour_results" }, ({ payload }) => { setResults(payload); setPhase((p) => p === "champion" ? p : "roundresult"); });
    ch.on("broadcast", { event: "tour_done" }, ({ payload }) => { setChampion(payload.champion); setPhase("champion"); });
    ch.on("broadcast", { event: "tour_report" }, ({ payload }) => { if (isHostRef.current) { reportsRef.current[payload.id] = { score: payload.score }; tryResolve(); } });
    ch.on("broadcast", { event: "tour_live" }, ({ payload }) => { liveScoresRef.current = { ...liveScoresRef.current, [payload.id]: payload.score }; setLiveScores(liveScoresRef.current); });
    ch.on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      setPlayers(Object.keys(st));
      const nm = {}; for (const k of Object.keys(st)) { const m = st[k] && st[k][0]; if (m && m.name) nm[k] = m.name; }
      namesRef.current = nm; setNames(nm);
    });
  };
  const broadcastLive = (s) => { try { chRef.current && chRef.current.send({ type: "broadcast", event: "tour_live", payload: { id: netId, score: s } }); } catch (e) { /* ignore */ } };

  const doHost = () => {
    isHostRef.current = true; const c = netCode(); setCode(c);
    const ch = netRoom("tour-" + c); chRef.current = ch; wire(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, name: name.trim() || "Player", joinedAt: Date.now() }); });
    setPhase("lobby");
  };
  const doJoin = () => {
    const c = joinCode.trim().toUpperCase(); if (c.length < 4) return; setCode(c);
    const ch = netRoom("tour-" + c); chRef.current = ch; wire(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, name: name.trim() || "Player", joinedAt: Date.now() }); });
    setStatus("Joined — waiting for the host to start the tournament…"); setPhase("lobby");
  };
  const startTournament = () => {
    const humans = players.slice().sort();
    const size = tourNextPow2(Math.max(2, humans.length));
    const seats = humans.slice(); let k = 1; while (seats.length < size) seats.push("AI#" + (k++));
    slotsRef.current = seats; roundNumRef.current = 1; runRound();
  };

  const onBuildDone = (b) => {
    myBuildRef.current = b;
    const ch = challengeRef.current || {};
    const score = moggerScore(b, ch.useCase, ch.budget).total;
    if (isHostRef.current) { reportsRef.current[netId] = { score }; setPhase("waiting"); tryResolve(); }
    else { try { chRef.current.send({ type: "broadcast", event: "tour_report", payload: { id: netId, score } }); } catch (e) {} setPhase("waiting"); }
  };
  const quit = () => { cleanup(); onExit(); };

  if (phase === "intro" && challenge) return <MoggerIntro round={challenge} player={null} onGo={() => setPhase("build")} />;
  if (phase === "build" && challenge) return <MoggerBuild round={challenge} player="You" oppLabel={tourIsAI(myOpp) ? "AI Opponent" : (myOpp ? label(myOpp) : "Opponent")} oppBuild={cosmeticRef.current} oppIsAI={true} oppLocked={false} onMyScore={broadcastLive} onDone={onBuildDone} />;

  const ResultsList = () => results ? (
    <div className="pm-tour-list">
      {results.results.map((r, i) => (
        <div key={i} className={"pm-tour-match" + ((r.winner === netId) ? " mine-win" : (r.a === netId || r.b === netId) ? " mine-lose" : "")}>
          <span className={r.winner === r.a ? "pm-tour-win" : ""}>{label(r.a)} <b>{r.aScore}</b></span>
          <span className="pm-tour-vs">vs</span>
          <span className={r.winner === r.b ? "pm-tour-win" : ""}>{label(r.b)} <b>{r.bScore}</b></span>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <div className="pm-card pm-center rf-fade">
      {phase === "entry" && (<>
        <h2 className="pm-h2">🏆 Tournament</h2>
        <div className="pm-unranked-tag">Unranked — ranked isn't allowed for tournaments</div>
        <p className="pm-p">A live bracket — winners advance through consecutive rounds until one champion remains. Empty seats are filled by AI.</p>
        <input className="pm-namein" value={name} maxLength={14} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
        <div className="pm-mode-grid">
          <button className="pm-mode" disabled={!name.trim()} onClick={doHost}><span className="pm-mode-icon"><Plus size={22} /></span><span className="pm-mode-name">Host tournament</span><span className="pm-mode-sub">Get a code, gather players</span></button>
          <button className="pm-mode" disabled={!name.trim()} onClick={() => setPhase("joinentry")}><span className="pm-mode-icon"><ChevronRight size={22} /></span><span className="pm-mode-name">Join tournament</span><span className="pm-mode-sub">Enter a code</span></button>
        </div>
        {!name.trim() && <p className="pm-tour-count">Enter a name to continue</p>}
        <button className="rf-ghost pm-exit" onClick={quit}><ChevronLeft size={15} /> Back</button>
      </>)}
      {phase === "joinentry" && (<>
        <h2 className="pm-h2">Join tournament</h2>
        <input className="pm-codein" value={joinCode} maxLength={5} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="CODE" />
        <div className="pm-row"><button className="rf-btn rf-ghost-btn" onClick={() => setPhase("entry")}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={doJoin}>Join <ChevronRight size={16} /></button></div>
      </>)}
      {phase === "lobby" && (<>
        <h2 className="pm-h2">Tournament lobby</h2>
        {isHostRef.current && <div className="pm-code">{code}</div>}
        <p className="pm-p">{isHostRef.current ? "Share this code. Start when everyone has joined." : status}</p>
        <div className="pm-tour-players">{players.map((p) => <span key={p} className={"pm-tour-chip" + (p === netId ? " me" : "")}>{label(p)}</span>)}</div>
        <p className="pm-tour-count">{players.length} player{players.length === 1 ? "" : "s"}{players.length > 1 ? " · bracket of " + tourNextPow2(Math.max(2, players.length)) + (tourNextPow2(Math.max(2, players.length)) > players.length ? " (rest AI)" : "") : ""}</p>
        {isHostRef.current
          ? <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={quit}>Cancel</button><button className="rf-btn" disabled={players.length < 2} onClick={startTournament}>Start tournament <ChevronRight size={16} /></button></div>
          : <><div className="pm-spinner" /><button className="rf-btn rf-ghost-btn" onClick={quit}>Leave</button></>}
      </>)}
      {phase === "waiting" && (<><h2 className="pm-h2">🔒 Locked in · Round {round}</h2><div className="pm-spinner" /><p className="pm-p">Waiting for the round to finish…</p></>)}
      {phase === "roundresult" && (<><h2 className="pm-h2">Round {results ? results.round : round} results</h2><ResultsList /><p className="pm-p">{results && results.winners && results.winners.length > 1 ? "Next round starting…" : "Final result coming up…"}</p></>)}
      {phase === "eliminated" && (<>
        <h2 className="pm-h2">👀 Spectating · Round {round}</h2>
        <p className="pm-p">You were knocked out — watch the live matches below.</p>
        <div className="pm-spec-list">
          {roundMatches.map((m, i) => (
            <div key={i} className="pm-spec-match">
              <div className="pm-spec-side"><span className="pm-spec-name">{label(m.a)}</span><span className="pm-spec-score">{liveScores[m.a] != null ? liveScores[m.a] : "…"}</span></div>
              <span className="pm-vs-word">VS</span>
              <div className="pm-spec-side"><span className="pm-spec-name">{label(m.b)}</span><span className="pm-spec-score">{liveScores[m.b] != null ? liveScores[m.b] : "…"}</span></div>
            </div>
          ))}
        </div>
        {results && <ResultsList />}
        <button className="rf-btn rf-ghost-btn" onClick={quit}>Quit</button>
      </>)}
      {phase === "champion" && (<>
        <h2 className={"pm-verdict-title " + (champion === netId ? "win" : "lose")}>{champion === netId ? "🏆 CHAMPION!" : "🏆 " + label(champion) + " wins"}</h2>
        <p className="pm-p">{champion === netId ? "You won the whole tournament. Mogged everyone." : "Tournament over."}</p>
        <div className="pm-row pm-center-row"><button className="rf-btn" onClick={quit}>Back to menu</button></div>
      </>)}
    </div>
  );
}

function MoggerOnline({ onExit, user, setUser, onNeedAuth, onSaveBuild }) {
  const [phase, setPhase] = useState("menu"); // menu|joinentry|host|join|search|starting|intro|build|waiting|result|left
  const [onlineRanked, setOnlineRanked] = useState(true);
  const [code, setCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [round, setRound] = useState(null);
  const [oppPresent, setOppPresent] = useState(false);
  const [oppBuild, setOppBuild] = useState(null);
  const [aiOpp, setAiOpp] = useState(null);
  const [status, setStatus] = useState("");
  const [oppLiveScore, setOppLiveScore] = useState(null);
  const [oppElo, setOppElo] = useState(null);
  const [aiOppElo, setAiOppElo] = useState(0);
  const [eloMsg, setEloMsg] = useState(null);
  const chRef = useRef(null), lobbyRef = useRef(null), myBuildRef = useRef(null), oppRef = useRef(null), startedRef = useRef(false), pairedRef = useRef(false), roundRef = useRef(null), rankedRef = useRef(false), eloAppliedRef = useRef(false);
  // host settings
  const [pick, setPick] = useState(false);
  const [uc, setUc] = useState(MOGGER_UCS[0]);
  const [budget, setBudget] = useState(1500);
  const [timer, setTimer] = useState(0);
  const myElo = user ? user.elo : null;

  const cleanup = () => { netLeave(chRef.current); netLeave(lobbyRef.current); chRef.current = null; lobbyRef.current = null; };
  useEffect(() => () => cleanup(), []);
  useEffect(() => { if (phase === "waiting" && oppBuild) setPhase("result"); }, [oppBuild, phase]);
  // apply elo after a ranked (Find-a-match) game
  useEffect(() => {
    if (phase !== "result" || !rankedRef.current || !user || eloAppliedRef.current) return;
    if (!myBuildRef.current || !(aiOpp || oppBuild)) return;
    eloAppliedRef.current = true;
    const r = roundRef.current, oppB = aiOpp || oppBuild;
    const sy = moggerScore(myBuildRef.current, r.useCase, r.budget).total;
    const so = moggerScore(oppB, r.useCase, r.budget).total;
    const oElo = aiOpp ? aiOppElo : (oppElo != null ? oppElo : 100);
    let delta = 0;
    if (sy > so) delta = netEloGain(user.elo, oElo);
    else if (sy < so) delta = -netEloGain(oElo, user.elo);
    const newElo = Math.max(0, user.elo + delta);
    setUser({ ...user, elo: newElo }); netSaveElo(user.id, newElo);
    setEloMsg({ delta, newElo });
  }, [phase]);

  const wireRoom = (ch) => {
    ch.on("broadcast", { event: "round_start" }, ({ payload }) => {
      const secsLeft = Math.max(8, Math.round(payload.secs - (Date.now() - payload.startAt) / 1000));
      startedRef.current = true;
      roundRef.current = { ...payload.round, secs: secsLeft };
      setRound({ ...payload.round, secs: secsLeft });
      setPhase("intro");
    });
    ch.on("broadcast", { event: "score" }, ({ payload }) => { setOppLiveScore(payload.score); });
    ch.on("broadcast", { event: "lock_in" }, ({ payload }) => {
      oppRef.current = payload.build || {};
      setOppBuild(payload.build || {});
      const r = roundRef.current; if (r) setOppLiveScore(moggerScore(payload.build || {}, r.useCase, r.budget).total);
    });
    ch.on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      const others = Object.keys(st).filter((k) => k !== netId);
      setOppPresent(others.length > 0);
      const om = others[0] && st[others[0]] && st[others[0]][0];
      if (om && typeof om.elo === "number") setOppElo(om.elo);
      if (startedRef.current && others.length === 0) setPhase((p) => (p === "result" ? p : "left"));
    });
  };
  const broadcastScore = (s) => { try { chRef.current && chRef.current.send({ type: "broadcast", event: "score", payload: { score: s } }); } catch (e) { /* ignore */ } };

  const beginRound = (manual) => {
    const useCase = (manual && pick) ? uc : mRand(MOGGER_UCS);
    const bud = (manual && pick) ? budget : mRand(MOGGER_BUDGETS);
    const secs = (manual && pick && timer) ? timer : (50 + Math.floor(Math.random() * 370));
    const r = { useCase, budget: bud, secs };
    chRef.current.send({ type: "broadcast", event: "round_start", payload: { round: r, startAt: Date.now(), secs } });
    startedRef.current = true; roundRef.current = r; setRound(r); setPhase("intro");
  };

  const doHost = () => {
    rankedRef.current = false;
    const c = netCode(); setCode(c);
    const ch = netRoom(c); chRef.current = ch; wireRoom(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, role: "host", elo: myElo }); });
    setPhase("host");
  };
  const doJoin = () => {
    rankedRef.current = false;
    const c = joinCode.trim().toUpperCase(); if (c.length < 4) return;
    setCode(c);
    const ch = netRoom(c); chRef.current = ch; wireRoom(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, role: "guest", elo: myElo }); });
    setStatus("Joined — waiting for the host to start…"); setPhase("join");
  };

  const joinMatchRoom = (c, role) => {
    setCode(c);
    const ch = netRoom(c); chRef.current = ch; wireRoom(ch);
    ch.subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ id: netId, role, elo: myElo }); });
    setStatus("Matched! Starting…"); setPhase("starting");
    if (role === "host") setTimeout(() => beginRound(false), 1600);
  };
  const startAIFallback = () => {
    const useCase = mRand(MOGGER_UCS), bud = mRand(MOGGER_BUDGETS), secs = 50 + Math.floor(Math.random() * 370);
    const aiElo = 400 + Math.random() * 1100;
    setAiOppElo(aiElo);
    setAiOpp(moggerAI(useCase, bud, aiElo));
    roundRef.current = { useCase, budget: bud, secs };
    setRound({ useCase, budget: bud, secs }); startedRef.current = true; setPhase("intro");
  };
  const doRandom = () => {
    rankedRef.current = onlineRanked;
    pairedRef.current = false;
    const lob = netLobby(); lobbyRef.current = lob;
    lob.on("broadcast", { event: "match" }, ({ payload }) => {
      if (pairedRef.current) return;
      if (payload.a === netId || payload.b === netId) {
        pairedRef.current = true;
        const role = payload.a === netId ? "host" : "guest";
        netLeave(lobbyRef.current); lobbyRef.current = null;
        joinMatchRoom(payload.code, role);
      }
    });
    lob.on("presence", { event: "sync" }, () => {
      if (pairedRef.current) return;
      const st = lob.presenceState();
      const arr = Object.entries(st).map(([k, m]) => ({ id: k, t: (m[0] && m[0].joinedAt) || 0 })).sort((a, b) => a.t - b.t || (a.id < b.id ? -1 : 1));
      if (arr.length >= 2 && arr[0].id === netId) {
        pairedRef.current = true;
        const partner = arr[1], c = netCode();
        lob.send({ type: "broadcast", event: "match", payload: { a: netId, b: partner.id, code: c } });
        netLeave(lobbyRef.current); lobbyRef.current = null;
        joinMatchRoom(c, "host");
      }
    });
    lob.subscribe((s) => { if (s === "SUBSCRIBED") lob.track({ id: netId, joinedAt: Date.now() }); });
    setStatus("Searching for an opponent…"); setPhase("search");
    setTimeout(() => { if (pairedRef.current || startedRef.current) return; pairedRef.current = true; netLeave(lobbyRef.current); lobbyRef.current = null; startAIFallback(); }, 12000);
  };

  const onBuildDone = (b) => {
    myBuildRef.current = b;
    if (aiOpp) { setPhase("result"); return; }
    try { chRef.current && chRef.current.send({ type: "broadcast", event: "lock_in", payload: { build: b } }); } catch (e) { /* ignore */ }
    if (oppRef.current) setPhase("result"); else setPhase("waiting");
  };
  const reset = () => { cleanup(); startedRef.current = false; pairedRef.current = false; rankedRef.current = false; eloAppliedRef.current = false; oppRef.current = null; roundRef.current = null; myBuildRef.current = null; setOppBuild(null); setOppLiveScore(null); setOppElo(null); setEloMsg(null); setAiOpp(null); setRound(null); setOppPresent(false); setCode(""); setJoinCode(""); setPhase("menu"); };

  const oppName = aiOpp ? "AI Opponent" : "Opponent";
  if (phase === "tournament") return <MoggerTournament onExit={() => setPhase("menu")} />;
  if (phase === "intro" && round) return <MoggerIntro round={round} player={null} onGo={() => setPhase("build")} />;
  if (phase === "build" && round) return <MoggerBuild round={round} player="You" oppLabel={oppName} oppBuild={aiOpp || null} oppIsAI={!!aiOpp} oppLocked={false} liveOpp={!aiOpp} oppLiveScore={oppLiveScore} oppLiveDone={!!oppBuild} onMyScore={aiOpp ? undefined : broadcastScore} myElo={myElo} oppElo={aiOpp ? aiOppElo : oppElo} onDone={onBuildDone} />;
  if (phase === "result" && round && myBuildRef.current && (aiOpp || oppBuild)) return <MoggerResult round={round} you={myBuildRef.current} opp={aiOpp || oppBuild} oppName={oppName} oppElo={aiOpp ? aiOppElo : oppElo} myElo={myElo} myCrank={user ? user.crank : null} eloMsg={eloMsg} onAgain={reset} onMenu={() => { cleanup(); onExit(); }} onSaveBuild={onSaveBuild} />;

  return (
    <div className="pm-card pm-center rf-fade">
      {phase === "menu" && (<>
        <h2 className="pm-h2">🌐 Online Multiplayer</h2>
        <div className="pm-seg">
          <button className={onlineRanked ? "on" : ""} onClick={() => setOnlineRanked(true)}>Ranked</button>
          <button className={!onlineRanked ? "on" : ""} onClick={() => setOnlineRanked(false)}>Unranked</button>
        </div>
        <p className="pm-seg-note">{onlineRanked ? "Ranked — Find a match puts your elo on the line." : "Unranked — play casually, your elo won't change."}</p>
        <div className="pm-mode-grid pm-mode-grid-top">
          <button className="pm-mode" onClick={doRandom}><span className="pm-mode-icon"><Radio size={22} /></span><span className="pm-mode-name">Find a match</span><span className="pm-mode-sub">{onlineRanked ? "Ranked · random opponent" : "Casual · random opponent"}</span></button>
        </div>
        <div className={"pm-extra-modes" + (onlineRanked ? " collapsed" : "")}>
          <button className="pm-mode" onClick={doHost}><span className="pm-mode-icon"><Plus size={22} /></span><span className="pm-mode-name">Host a room</span><span className="pm-mode-sub">Get a code, play a friend · Unranked</span></button>
          <button className="pm-mode" onClick={() => setPhase("joinentry")}><span className="pm-mode-icon"><ChevronRight size={22} /></span><span className="pm-mode-name">Join a room</span><span className="pm-mode-sub">Enter a friend's code · Unranked</span></button>
          <button className="pm-mode" onClick={() => setPhase("tournament")}><span className="pm-mode-icon">🏆</span><span className="pm-mode-name">Tournament</span><span className="pm-mode-sub">Bracket · 3+ players, AI fills seats · Unranked</span></button>
        </div>
        <button className="rf-ghost pm-exit" onClick={() => { cleanup(); onExit(); }}><ChevronLeft size={15} /> Back</button>
      </>)}

      {phase === "joinentry" && (<>
        <h2 className="pm-h2">Join a room</h2>
        <div className="pm-unranked-tag">Unranked — ranked isn't allowed for private rooms</div>
        <input className="pm-codein" value={joinCode} maxLength={5} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="CODE" />
        <div className="pm-row"><button className="rf-btn rf-ghost-btn" onClick={reset}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={doJoin}>Join <ChevronRight size={16} /></button></div>
      </>)}

      {phase === "host" && (<>
        <h2 className="pm-h2">Your room code</h2>
        <div className="pm-unranked-tag">Unranked — ranked isn't allowed for private rooms</div>
        <div className="pm-code">{code}</div>
        <p className="pm-p">{oppPresent ? "A player joined! Set it up and start." : "Share this code with a friend. Waiting for them to join…"}</p>
        <label className="pm-toggle"><input type="checkbox" checked={pick} onChange={(e) => setPick(e.target.checked)} /><span>Pick the challenge (off = random)</span></label>
        {pick && (<div className="pm-setup">
          <div className="pm-field"><span className="pm-field-l">Use case</span><div className="pm-chips">{MOGGER_UCS.map((k) => <button key={k} className={"pm-chip" + (uc === k ? " on" : "")} onClick={() => setUc(k)}>{USE_CASES[k].label}</button>)}</div></div>
          <div className="pm-field"><span className="pm-field-l">Budget: {fmt(budget)}</span><input type="range" min="600" max="4000" step="100" value={budget} onChange={(e) => setBudget(+e.target.value)} className="pm-range" /></div>
          <div className="pm-field"><span className="pm-field-l">Timer: {timer ? timer + "s" : "random"}</span><input type="range" min="0" max="420" step="10" value={timer} onChange={(e) => setTimer(+e.target.value)} className="pm-range" /></div>
        </div>)}
        <div className="pm-row"><button className="rf-btn rf-ghost-btn" onClick={reset}><ChevronLeft size={16} /> Cancel</button><button className="rf-btn" disabled={!oppPresent} onClick={() => beginRound(true)}>Start round <ChevronRight size={16} /></button></div>
      </>)}

      {phase === "join" && (<><h2 className="pm-h2">🔗 Joined room {code}</h2><div className="pm-spinner" /><p className="pm-p">{status}</p><button className="rf-btn rf-ghost-btn" onClick={reset}>Cancel</button></>)}
      {phase === "search" && (<><h2 className="pm-h2">Finding a match…</h2><div className="pm-spinner" /><p className="pm-p">Looking for another player. If nobody shows up, you will face the AI.</p><button className="rf-btn rf-ghost-btn" onClick={reset}>Cancel</button></>)}
      {phase === "starting" && (<><h2 className="pm-h2">Matched!</h2><div className="pm-spinner" /><p className="pm-p">{status}</p></>)}
      {phase === "waiting" && (<><h2 className="pm-h2">🔒 Locked in</h2><div className="pm-spinner" /><p className="pm-p">Waiting for your opponent to finish…</p></>)}
      {phase === "left" && (<><h2 className="pm-verdict-title win">🏆 YOU WIN</h2><p className="pm-p">Your opponent left the match.</p><div className="pm-row pm-center-row"><button className="rf-btn" onClick={reset}>Back to online menu</button></div></>)}
    </div>
  );
}

function MoggerAuth({ onClose, onAuth }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const submit = async () => {
    if (busy) return;
    setBusy(true); setErr("");
    try {
      const res = await (tab === "login" ? netLogIn : netSignUp)(name, pw);
      if (res && res.error) { setErr(res.error); setBusy(false); return; }
      if (res && res.user) { onAuth(res.user); return; }
      setErr("Something went wrong — try again.");
    } catch (e) { setErr("Error: " + (e && e.message ? e.message : "try again")); }
    setBusy(false);
  };
  return (
    <div className="pm-modal-wrap" onClick={onClose}>
      <div className="pm-card pm-auth" onClick={(e) => e.stopPropagation()}>
        <div className="pm-auth-tabs"><button className={tab === "login" ? "on" : ""} onClick={() => { setTab("login"); setErr(""); }}>Log in</button><button className={tab === "signup" ? "on" : ""} onClick={() => { setTab("signup"); setErr(""); }}>Sign up</button></div>
        <input className="pm-namein" value={name} maxLength={14} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input className="pm-namein" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" />
        {tab === "signup" && <p className="pm-auth-hint">8+ characters, at least one number, letters & numbers only.</p>}
        {err && <p className="pm-auth-err">{err}</p>}
        <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onClose}>Cancel</button><button className="rf-btn" disabled={busy} onClick={submit}>{busy ? "…" : tab === "login" ? "Log in" : "Create account"}</button></div>
        <p className="pm-auth-note">Casual accounts, for elo only — not real security, so don't reuse an important password.</p>
      </div>
    </div>
  );
}

const DIFFS = [{ k: "easy", label: "Easy", elo: 250 }, { k: "medium", label: "Medium", elo: 550 }, { k: "hard", label: "Hard", elo: 1000 }, { k: "random", label: "Random", elo: 0 }, { k: "custom", label: "Custom", elo: 1500 }];

const ADMIN_PASS = "Admin2014"; // change this to your own secret
const COADMIN_PASS = "Coadmin2014"; // co-admin password — limited access

function MoggerCoAdmin({ onBack }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const tryAuth = () => { if (pw === COADMIN_PASS) { setAuthed(true); } else setErr("Wrong co-admin password."); };

  if (!authed) {
    return (
      <div className="pm-card pm-center rf-fade">
        <h2 className="pm-h2">🔒 Co-Admin</h2>
        <p className="pm-p">Enter the co-admin password to manage accounts.</p>
        <input className="pm-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") tryAuth(); }} placeholder="Co-admin password" />
        {err && <div className="pm-auth-err">{err}</div>}
        <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={tryAuth}>Unlock</button></div>
      </div>
    );
  }

  return <MoggerAdmin onBack={onBack} user={null} isCoadmin={true} />;
}

function MoggerAdmin({ onBack, user, isCoadmin }) {
  const [authed, setAuthed] = useState((user && user.name === "Rayaan") || isCoadmin ? true : false);
  const [pw, setPw] = useState("");
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [eloDraft, setEloDraft] = useState("");
  const [pwDraft, setPwDraft] = useState("");
  const [rankDraft, setRankDraft] = useState("");
  const [colorDraft, setColorDraft] = useState("#ff7ae0");
  const [iconDraft, setIconDraft] = useState("⭐");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const load = async () => { setRows(null); const r = await netAllUsers(); if (r.error) { setErr(r.error); setRows([]); } else { setErr(""); setRows(r.rows); } };
  useEffect(() => { if (authed) load(); }, [authed]);
  const tryAuth = () => { if (pw === ADMIN_PASS) { setAuthed(true); load(); } else setErr("Wrong admin password."); };
  const del = async (id) => {
    setBusyId(id);
    const r = await netDeleteUser(id);
    setBusyId(null); setConfirmId(null);
    if (!r.ok) { setErr(r.error || "Delete failed — did you run the delete-permission SQL?"); return; }
    setRows((prev) => (prev || []).filter((u) => u.id !== id));
  };
  const openRow = (u) => { if (expanded === u.id) { setExpanded(null); return; } setExpanded(u.id); setEloDraft(String(u.elo)); setPwDraft(""); const cr = parseCrank(u.crank); setRankDraft(cr ? cr.name : ""); setColorDraft(cr ? cr.color : "#ff7ae0"); setIconDraft(cr ? cr.icon : "⭐"); setEmojiOpen(false); setMsg(""); setErr(""); };
  const saveElo = async (u) => {
    const v = parseInt(eloDraft, 10);
    if (isNaN(v) || v < 0 || v > 100000) { setErr("Enter a whole number between 0 and 100000."); return; }
    setBusyId(u.id); const r = await netSetElo(u.id, v); setBusyId(null);
    if (!r.ok) { setErr(r.error || "Could not update elo."); return; }
    setRows((prev) => (prev || []).map((x) => x.id === u.id ? { ...x, elo: v } : x).sort((a, b) => b.elo - a.elo));
    setMsg("Elo updated.");
  };
  const resetPw = async (u) => {
    setMsg(""); setErr("");
    setBusyId(u.id); const r = await netResetPassword(u.id, u.name, pwDraft); setBusyId(null);
    if (!r.ok) { setErr(r.error || "Could not reset password."); return; }
    setRows((prev) => (prev || []).map((x) => x.id === u.id ? { ...x, hash: "(updated)" } : x));
    setPwDraft(""); setMsg("Password reset. Tell the user their new password: " + pwDraft);
  };
  const saveRank = async (u) => {
    setMsg(""); setErr("");
    const nm = rankDraft.trim().slice(0, 24);
    const payload = nm ? JSON.stringify({ name: nm, color: colorDraft, icon: iconDraft || "⭐" }) : "";
    setBusyId(u.id); const r = await netSetCustomRank(u.id, payload); setBusyId(null);
    if (!r.ok) { setErr(r.error || "Could not set rank."); return; }
    const stored = nm ? payload : null;
    setRows((prev) => (prev || []).map((x) => x.id === u.id ? { ...x, crank: stored } : x));
    setMsg(nm ? "Custom rank set to “" + nm + "”." : "Custom rank cleared — back to elo rank.");
  };
  if (!authed) {
    return (
      <div className="pm-card pm-center rf-fade">
        <h2 className="pm-h2">🔒 Admin</h2>
        <p className="pm-p">Enter the admin password to manage accounts.</p>
        <input className="pm-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") tryAuth(); }} placeholder="Admin password" />
        {err && <div className="pm-auth-err">{err}</div>}
        <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={tryAuth}>Unlock</button></div>
      </div>
    );
  }
  return (
    <div className="pm-card pm-center rf-fade">
      <h2 className="pm-h2">🔒 {isCoadmin ? "Co-Admin" : "Admin"} · Accounts</h2>
      {err && <div className="pm-auth-err">{err}</div>}
      {msg && <div className="pm-admin-msg">{msg}</div>}
      {rows == null ? <div className="pm-spinner" /> : rows.length === 0 ? <p className="pm-p">No accounts found.</p> : (
        <div className="pm-lb pm-admin-list">
          {rows.map((u) => (
            <div key={u.id} className="pm-admin-item">
              <div className="pm-lb-row pm-admin-row">
                <button className="pm-admin-open" onClick={() => openRow(u)}><span className="pm-lb-name">{u.name}<RankBadge rank={moggerRank(u.elo, u.crank)} /></span></button>
                <span className="pm-lb-elo">{u.elo}</span>
                {isCoadmin ? (
                  <button className="pm-del-btn" disabled title="Co-admins can't delete accounts" style={{opacity:0.35,cursor:"not-allowed"}}><X size={14} /></button>
                ) : confirmId === u.id ? (
                  <span className="pm-admin-confirm"><button className="pm-del-yes" disabled={busyId === u.id} onClick={() => del(u.id)}>{busyId === u.id ? "…" : "Delete"}</button><button className="pm-del-no" onClick={() => setConfirmId(null)}>Cancel</button></span>
                ) : (
                  <button className="pm-del-btn" onClick={() => { setErr(""); setConfirmId(u.id); }}><X size={14} /></button>
                )}
              </div>
              {expanded === u.id && (
                <div className="pm-admin-edit">
                  <div className="pm-admin-line" style={isCoadmin ? {opacity:0.5} : {}}><span className="pm-admin-l">Elo</span><input className="pm-admin-in" value={eloDraft} onChange={(e) => setEloDraft(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" disabled={isCoadmin} /><button className="pm-admin-save" disabled={busyId === u.id || isCoadmin} onClick={() => saveElo(u)}>Save</button></div>
                  <div className="pm-admin-line"><span className="pm-admin-l">Custom rank</span><input className="pm-admin-in" value={rankDraft} maxLength={24} onChange={(e) => setRankDraft(e.target.value)} placeholder="blank = elo rank" /></div>
                  <div className="pm-admin-line"><span className="pm-admin-l">Color & icon</span><input className="pm-admin-color" type="color" value={colorDraft} onChange={(e) => setColorDraft(e.target.value)} /><button className="pm-emoji-cur" onClick={() => setEmojiOpen((o) => !o)}>{iconDraft || "⭐"} ▾</button><button className="pm-admin-save" disabled={busyId === u.id} onClick={() => saveRank(u)}>{rankDraft.trim() ? "Set" : "Clear"}</button></div>
                  {emojiOpen && <MoggerEmojiPicker onPick={(e) => { setIconDraft(e); setEmojiOpen(false); }} />}
                  <div className="pm-admin-line"><span className="pm-admin-l">Preview</span><RankBadge rank={{ name: rankDraft.trim() || "(elo rank)", cls: "custom", icon: iconDraft || "⭐", color: colorDraft, custom: true }} /></div>
                  <div className="pm-admin-line"><span className="pm-admin-l">New password</span><input className="pm-admin-in" value={pwDraft} onChange={(e) => setPwDraft(e.target.value)} placeholder="set a new one" /><button className="pm-admin-save" disabled={busyId === u.id || !pwDraft} onClick={() => resetPw(u)}>Reset</button></div>
                  <div className="pm-admin-hash"><span className="pm-admin-l">Stored hash</span><code>{u.hash}</code></div>
                  <p className="pm-admin-hint">Passwords aren't stored — only this one-way hash, so the real password can't be shown. Use “Reset” to set a new one.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button><button className="rf-btn rf-ghost-btn" onClick={load}>Refresh</button></div>
    </div>
  );
}

function MoggerLeaderboard({ onBack, meName }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { netLeaderboard(100).then((r) => setRows(r)); }, []);
  return (
    <div className="pm-card pm-center rf-fade">
      <h2 className="pm-h2">🏆 Global Leaderboard</h2>
      {rows == null ? <div className="pm-spinner" /> : rows.length === 0 ? <p className="pm-p">No ranked players yet — be the first.</p> : (
        <div className="pm-lb">
          {rows.map((r, i) => (
            <div key={i} className={"pm-lb-row" + (r.name === meName ? " me" : "")}>
              <span className="pm-lb-rank">{i + 1}</span>
              <span className="pm-lb-name">{r.name}<RankBadge rank={moggerRank(r.elo, r.crank)} /></span>
              <span className="pm-lb-elo">{r.elo}</span>
            </div>
          ))}
        </div>
      )}
      <button className="rf-btn rf-ghost-btn" onClick={onBack}><ChevronLeft size={16} /> Back</button>
    </div>
  );
}

function MoggerGame({ onExit, onSaveBuild }) {
  const [screen, setScreen] = useState(() => { try { const p = window.location.pathname.replace(/\/+$/, "").split("/").pop(); if (p === "admin") return "admin"; if (p === "coadmin") return "coadmin"; } catch (e) {} return "menu"; });
  const [mode, setMode] = useState("ai");
  const [round, setRound] = useState(null);
  const [you, setYou] = useState(null);
  const [opp, setOpp] = useState(null);
  const [user, setUser] = useState(() => { try { const s = localStorage.getItem("mogger_user"); return s ? JSON.parse(s) : null; } catch (e) { return null; } });
  const [showAuth, setShowAuth] = useState(false);
  const [aiElo, setAiElo] = useState(550);
  const [aiHidden, setAiHidden] = useState(false);
  const [practice, setPractice] = useState(false);
  const [rankedAsk, setRankedAsk] = useState(false);
  const [custom, setCustom] = useState(1500);
  const [eloMsg, setEloMsg] = useState(null);
  const eloAppliedRef = useRef(false);

  const persist = (u) => { setUser(u); try { if (u) localStorage.setItem("mogger_user", JSON.stringify(u)); else localStorage.removeItem("mogger_user"); } catch (e) {} };
  const refreshMe = useCallback(() => {
    const u = (() => { try { const s = localStorage.getItem("mogger_user"); return s ? JSON.parse(s) : null; } catch (e) { return null; } })();
    if (!u || !u.id) return;
    netFetchUser(u.id).then((srv) => { if (srv && (srv.elo !== u.elo || (srv.crank || null) !== (u.crank || null) || srv.name !== u.name)) persist({ id: srv.id, name: srv.name, elo: srv.elo, crank: srv.crank || null }); });
  }, []);
  useEffect(() => { refreshMe(); }, [refreshMe]);
  useEffect(() => { if (screen === "menu") refreshMe(); }, [screen, refreshMe]);

  const chooseDiff = (d) => {
    if (d.k === "custom") { setAiElo(custom); setAiHidden(false); }
    else if (d.k === "random") { setAiElo(100 + Math.floor(Math.random() * 2900)); setAiHidden(true); }
    else { setAiElo(d.elo); setAiHidden(false); }
    setScreen("lobby");
  };
  const start = (r) => { setRound(r); eloAppliedRef.current = false; setEloMsg(null); if (mode === "ai") setOpp(moggerAI(r.useCase, r.budget, aiElo)); setScreen("intro"); };
  const finishP1 = (b) => { setYou(b); if (mode === "ai") setScreen("result"); else setScreen("handoff"); };
  const finishP2 = (b) => { setOpp(b); setScreen("result"); };
  const again = () => { setYou(null); setOpp(null); setEloMsg(null); eloAppliedRef.current = false; setScreen(mode === "ai" ? "diff" : "lobby"); };
  const menu = () => { setYou(null); setOpp(null); setRound(null); setEloMsg(null); setScreen("menu"); };
  const exitToRoot = () => {
    try { if (typeof window !== "undefined" && window.history) { const p = window.location.pathname.replace(/\/+$/, "").split("/").pop(); if (p === "admin" || p === "coadmin") window.history.replaceState(null, "", "/"); } } catch (e) {}
    onExit();
  };

  // apply elo after a vs-AI result
  useEffect(() => {
    if (screen !== "result" || mode !== "ai" || practice || !user || !you || !opp || eloAppliedRef.current) return;
    eloAppliedRef.current = true;
    const sy = moggerScore(you, round.useCase, round.budget).total;
    const so = moggerScore(opp, round.useCase, round.budget).total;
    let delta = 0;
    if (sy > so) delta = netEloGain(user.elo, aiElo);
    else if (sy < so) delta = -netEloGain(aiElo, user.elo);
    const newElo = Math.max(0, user.elo + delta);
    persist({ ...user, elo: newElo });
    netSaveElo(user.id, newElo);
    setEloMsg({ delta, newElo });
  }, [screen]);

  return (
    <div className="pm-mogger rf-fade">
      {screen === "menu" && (
        <div className="pm-menu">
          <div className="pm-account">{user ? <><span className="pm-acct-name">{user.name}</span><RankBadge rank={moggerRank(user.elo, user.crank)} /><span className="pm-acct-elo">{user.elo} elo</span><button className="pm-acct-btn" onClick={() => persist(null)}>Log out</button></> : <button className="pm-acct-btn" onClick={() => setShowAuth(true)}>Log in / Sign up</button>}</div>
          <div className="pm-mtitle">PC <span className="rf-accent">MOGGER</span></div>
          <p className="pm-tag">Build the best PC for the challenge. AI judges. One winner.</p>
          <div className="pm-mode-grid">
            <button className="pm-mode" onClick={() => { setMode("ai"); setScreen("diff"); }}><span className="pm-mode-icon"><Bot size={24} /></span><span className="pm-mode-name">Play vs AI</span><span className="pm-mode-sub">Ranked or practice</span></button>
            <button className="pm-mode" onClick={() => { setMode("local"); setScreen("lobby"); }}><span className="pm-mode-icon"><Gamepad2 size={24} /></span><span className="pm-mode-name">Pass &amp; Play</span><span className="pm-mode-sub">2 players, one device</span></button>
            <button className="pm-mode" onClick={() => setScreen("online")}><span className="pm-mode-icon">🌐</span><span className="pm-mode-name">Online Multiplayer</span><span className="pm-mode-sub">Play friends or random people</span></button>
            <button className="pm-mode" onClick={() => setScreen("leaderboard")}><span className="pm-mode-icon">🏆</span><span className="pm-mode-name">Leaderboard</span><span className="pm-mode-sub">Global elo rankings</span></button>
          </div>
          <button className="rf-ghost pm-exit" onClick={onExit}><ChevronLeft size={15} /> Back to builder</button>
        </div>
      )}
      {showAuth && <MoggerAuth onClose={() => setShowAuth(false)} onAuth={(u) => { persist(u); setShowAuth(false); }} />}
      {screen === "diff" && (
        <div className="pm-card pm-center rf-fade">
          <h2 className="pm-h2"><Bot size={20} /> Choose AI difficulty</h2>
          <div className="pm-seg">
            <button className={(!practice && user ? "on" : "") + (!user ? " pm-seg-disabled" : "")} onClick={() => { if (!user) { setRankedAsk(true); } else { setPractice(false); setRankedAsk(false); } }}>Ranked</button>
            <button className={(practice || !user) ? "on" : ""} onClick={() => { setPractice(true); setRankedAsk(false); }}>Practice</button>
          </div>
          {!user ? (
            rankedAsk ? (
              <div className="pm-seg-note pm-ranked-prompt">
                <span>To play ranked you have to log in / sign up.</span>
                <button className="rf-btn" onClick={() => setShowAuth(true)}>Log in / Sign up</button>
              </div>
            ) : (
              <p className="pm-seg-note">Practice — your elo never changes. Log in to play Ranked.</p>
            )
          ) : (
            <p className="pm-seg-note">{practice ? "Practice — your elo never changes, win or lose." : "Ranked — win to gain elo, lose to drop it."}</p>
          )}
          <div className="pm-diff-grid">
            {DIFFS.map((d) => <button key={d.k} className="pm-diff" onClick={() => chooseDiff(d)}><span className="pm-diff-name">{d.label}</span><span className="pm-diff-elo">{d.k === "random" ? "? elo" : d.k === "custom" ? custom + " elo" : d.elo + " elo"}</span></button>)}
          </div>
          <div className="pm-field"><span className="pm-field-l">Custom elo: {custom}</span><input type="range" min="100" max="3000" step="50" value={custom} onChange={(e) => setCustom(+e.target.value)} className="pm-range" /></div>
          <button className="rf-btn rf-ghost-btn" onClick={menu}><ChevronLeft size={16} /> Back</button>
        </div>
      )}
      {screen === "admin" && <MoggerAdmin onBack={exitToRoot} user={user} />}
      {screen === "coadmin" && <MoggerCoAdmin onBack={exitToRoot} />}
      {screen === "leaderboard" && <MoggerLeaderboard onBack={menu} meName={user ? user.name : null} />}
      {screen === "online" && (user ? <MoggerOnline onExit={menu} user={user} setUser={persist} onNeedAuth={() => setShowAuth(true)} onSaveBuild={onSaveBuild} /> : (
        <div className="pm-card pm-center rf-fade">
          <h2 className="pm-h2">🌐 Online Multiplayer</h2>
          <p className="pm-p">Playing with real people needs an account (so elo and names work). It's quick and free.</p>
          <div className="pm-row pm-center-row"><button className="rf-btn rf-ghost-btn" onClick={menu}><ChevronLeft size={16} /> Back</button><button className="rf-btn" onClick={() => setShowAuth(true)}>Log in / Sign up</button></div>
        </div>
      ))}
      {screen === "lobby" && <MoggerLobby mode={mode} onStart={start} onBack={menu} />}
      {screen === "intro" && round && <MoggerIntro round={round} player={mode === "local" ? "Player 1" : null} onGo={() => setScreen("p1")} />}
      {screen === "p1" && round && <MoggerBuild round={round} player={mode === "local" ? "Player 1" : "You"} oppLabel={mode === "ai" ? "AI Opponent" : "Player 2"} oppBuild={mode === "ai" ? opp : null} oppIsAI={mode === "ai"} oppLocked={false} myElo={mode === "ai" && user ? user.elo : null} oppElo={mode === "ai" ? aiElo : null} onDone={finishP1} />}
      {screen === "handoff" && <div className="pm-card pm-center rf-fade"><h2 className="pm-h2"><Repeat2 size={20} /> Pass the device</h2><p className="pm-p">Player 1 is locked in. Hand the device to <b>Player 2</b> — same challenge, same clock. No peeking.</p><button className="rf-btn" onClick={() => setScreen("intro2")}>I am Player 2 — start <ChevronRight size={16} /></button></div>}
      {screen === "intro2" && round && <MoggerIntro round={round} player="Player 2" onGo={() => setScreen("p2")} />}
      {screen === "p2" && round && <MoggerBuild round={round} player="Player 2" oppLabel="Player 1" oppBuild={you} oppIsAI={false} oppLocked={true} onDone={finishP2} />}
      {screen === "result" && round && you && opp && <MoggerResult round={round} you={you} opp={opp} oppName={mode === "ai" ? "AI Opponent" : "Player 2"} oppElo={mode === "ai" ? aiElo : null} myElo={mode === "ai" && user ? user.elo : null} myCrank={user ? user.crank : null} eloMsg={eloMsg} onAgain={again} onMenu={menu} onSaveBuild={onSaveBuild} />}
    </div>
  );
}

function ForgeArt() {
  return (
    <div className="rf-forge-art" aria-hidden="true">
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="faGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#19e8db" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#7c5cff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="faEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#19e8db" /><stop offset="100%" stopColor="#7c5cff" />
          </linearGradient>
          <linearGradient id="faRGB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#19e8db" /><stop offset="50%" stopColor="#7c5cff" /><stop offset="100%" stopColor="#ff7ae0" />
          </linearGradient>
        </defs>
        <circle className="fa-coreglow" cx="200" cy="200" r="155" fill="url(#faGlow)" />
        <g className="fa-ring"><circle cx="200" cy="200" r="128" fill="none" stroke="#19e8db" strokeOpacity="0.25" strokeWidth="1.2" strokeDasharray="5 12" /></g>
        <g className="fa-ring2"><circle cx="200" cy="200" r="152" fill="none" stroke="#7c5cff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 16" /></g>
        {/* glowing ingot on the anvil, waiting to be forged */}
        <g className="fa-ingot">
          <ellipse cx="200" cy="214" rx="40" ry="9" fill="#000" fillOpacity="0.4" />
          <rect x="172" y="188" width="56" height="26" rx="8" fill="url(#faEdge)" />
          <rect x="172" y="188" width="56" height="26" rx="8" fill="#fff" fillOpacity="0.15" />
        </g>

        {/* ===== assembled FISH-TANK gaming PC (wide glass box) ===== */}
        <g className="fa-pc">
          <rect x="120" y="128" width="160" height="148" rx="14" fill="none" stroke="#19e8db" strokeOpacity="0.3" strokeWidth="8" className="fa-caseglow" />
          <rect x="120" y="128" width="160" height="148" rx="14" fill="#0b1018" stroke="url(#faEdge)" strokeWidth="2.5" />
          {/* glass front panel */}
          <rect x="128" y="136" width="144" height="132" rx="9" fill="#0e1626" stroke="#7c5cff" strokeOpacity="0.3" strokeWidth="1" />
          <rect x="128" y="136" width="60" height="132" rx="9" fill="#19e8db" fillOpacity="0.04" />
          {/* top-mounted RGB radiator fans */}
          <g className="fa-fan"><circle cx="155" cy="152" r="13" fill="none" stroke="#19e8db" strokeWidth="1.4" /><g className="fa-blades"><path d="M155 152 L155 142 M155 152 L163 158 M155 152 L147 158" stroke="#19e8db" strokeWidth="1.3" /></g><circle cx="155" cy="152" r="1.8" fill="#19e8db" /></g>
          <g className="fa-fan2"><circle cx="186" cy="152" r="13" fill="none" stroke="#7c5cff" strokeWidth="1.4" /><g className="fa-blades"><path d="M186 152 L186 142 M186 152 L194 158 M186 152 L178 158" stroke="#7c5cff" strokeWidth="1.3" /></g><circle cx="186" cy="152" r="1.8" fill="#7c5cff" /></g>
          <g className="fa-fan3"><circle cx="217" cy="152" r="13" fill="none" stroke="#ff7ae0" strokeWidth="1.4" /><g className="fa-blades"><path d="M217 152 L217 142 M217 152 L225 158 M217 152 L209 158" stroke="#ff7ae0" strokeWidth="1.3" /></g><circle cx="217" cy="152" r="1.8" fill="#ff7ae0" /></g>
          {/* vertical GPU showcased behind the glass, twin RGB fans facing out */}
          <rect x="140" y="180" width="32" height="80" rx="5" fill="#121a2b" stroke="#19e8db" strokeOpacity="0.7" strokeWidth="1.5" />
          <g className="fa-fan2"><circle cx="156" cy="200" r="11" fill="none" stroke="#19e8db" strokeWidth="1.4" /><g className="fa-blades"><path d="M156 200 L156 191 M156 200 L164 205 M156 200 L148 205" stroke="#19e8db" strokeWidth="1.3" /></g><circle cx="156" cy="200" r="1.8" fill="#19e8db" /></g>
          <g className="fa-fan"><circle cx="156" cy="232" r="11" fill="none" stroke="#7c5cff" strokeWidth="1.4" /><g className="fa-blades"><path d="M156 232 L156 223 M156 232 L164 237 M156 232 L148 237" stroke="#7c5cff" strokeWidth="1.3" /></g><circle cx="156" cy="232" r="1.8" fill="#7c5cff" /></g>
          {/* RAM sticks with RGB tops */}
          <rect x="196" y="180" width="5" height="34" rx="1.5" fill="#121a2b" stroke="#7c5cff" strokeOpacity="0.7" />
          <rect x="204" y="180" width="5" height="34" rx="1.5" fill="#121a2b" stroke="#7c5cff" strokeOpacity="0.7" />
          <rect x="195" y="177" width="15" height="4" rx="2" fill="#ff7ae0" className="fa-rgb" />
          {/* water-cooling reservoir tube with rising bubbles */}
          <rect x="224" y="178" width="12" height="80" rx="6" fill="#0c1320" stroke="#19e8db" strokeOpacity="0.5" />
          <rect x="226" y="180" width="8" height="76" rx="4" fill="url(#faRGB)" fillOpacity="0.4" className="fa-rgb" />
          <circle className="fa-bubble fa-b1" cx="230" cy="248" r="1.6" fill="#9be0ff" />
          <circle className="fa-bubble fa-b2" cx="231" cy="252" r="1.2" fill="#9be0ff" />
          <circle className="fa-bubble fa-b3" cx="229" cy="244" r="1.3" fill="#9be0ff" />
          {/* PSU / bottom shroud + RGB strip */}
          <rect x="132" y="252" width="136" height="14" rx="4" fill="#0c1320" stroke="#19e8db" strokeOpacity="0.3" />
          <rect x="252" y="178" width="12" height="68" rx="4" fill="url(#faRGB)" className="fa-rgb" />
          <circle cx="260" cy="142" r="2.2" fill="#46e0a0" className="fa-rgb" />
        </g>

        {/* flash when it snaps together */}
        <circle className="fa-flash" cx="200" cy="200" r="74" fill="url(#faGlow)" />

        {/* sparks bursting from the strike point */}
        <g className="fa-sparks" stroke="#ffd24a" strokeWidth="2.4" strokeLinecap="round" fill="#ffd24a">
          <line x1="200" y1="190" x2="200" y2="168" />
          <line x1="200" y1="190" x2="222" y2="176" />
          <line x1="200" y1="190" x2="178" y2="176" />
          <line x1="200" y1="190" x2="232" y2="192" />
          <line x1="200" y1="190" x2="168" y2="192" />
          <line x1="200" y1="190" x2="216" y2="206" />
          <line x1="200" y1="190" x2="184" y2="206" />
          <circle cx="238" cy="170" r="2.2" /><circle cx="162" cy="172" r="2" /><circle cx="226" cy="208" r="1.8" />
        </g>

        {/* ===== the pickaxe that forges it ===== */}
        <g className="fa-pick">
          <line x1="252" y1="96" x2="194" y2="152" stroke="#c98a4b" strokeWidth="6.5" strokeLinecap="round" />
          <line x1="252" y1="96" x2="194" y2="152" stroke="#8a5a2b" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M166 152 Q194 130 222 152 Q210 158 194 153 Q178 158 166 152 Z" fill="#cdd7e6" stroke="#19e8db" strokeWidth="1.8" />
          <path d="M166 152 Q194 137 222 152" fill="none" stroke="#9fb0c4" strokeWidth="1" />
          <circle cx="194" cy="152" r="3" fill="#8a5a2b" />
        </g>
      </svg>
    </div>
  );
}
function Home({ saved, loading, onNew, onOpen, onDelete, priceInfo, onMogger }) {
  return (
    <div className="rf-fade">
      <div className="rf-hero rf-hero-flash">
        <div className="rf-hero-text">
          <div className="rf-eyebrow">PART PICKER · COMPATIBILITY · SCORING</div>
          <h1 className="rf-hero-title">How to forge the<br /><span className="rf-accent rf-hero-grad">perfect computer.</span></h1>
          <p className="rf-muted rf-hero-sub">
            Tell us your use case and budget. We score every part, auto-assemble a balanced build,
            check full compatibility, and grade the result out of 100.
          </p>
          <div className="rf-cta-grid">
            <div className="rf-cta-card">
              <button className="rf-btn rf-btn-lg" onClick={onNew}><Plus size={18} /> {t("startBuild")}</button>
              <span className="rf-cta-desc">Answer two quick questions — we auto-pick balanced, compatible parts for your budget and grade the result out of 100.</span>
            </div>
            {onMogger && (
              <div className="rf-cta-card">
                <button className="rf-btn rf-btn-lg rf-mogger-cta" onClick={onMogger}><Gamepad2 size={18} /> Play PC Mogger</button>
                <span className="rf-cta-desc">A head-to-head build-off game — assemble the best PC for a budget and use case, then beat players or AI to climb the elo leaderboard.</span>
              </div>
            )}
          </div>
          <div className="rf-price-status">
            <span className="rf-db-count"><Boxes size={13} /> {CATALOG_COUNT} {t("componentsDb")}</span>
            <span className="rf-dot-sep">·</span>
            <span className="rf-live-ind"><span className="rf-live-dot" /> {t("livePrices")}</span>
            {priceInfo && <> · {t("updated")} {new Date(priceInfo.updatedAt).toLocaleDateString()}</>}
          </div>
        </div>
        <ForgeArt />
      </div>

      <div className="rf-section-head">
        <h2>{t("myRigs")}</h2>
        <span className="rf-muted">{saved.length} {t("savedWord")}</span>
      </div>

      {loading ? (
        <div className="rf-muted rf-pad">{t("loadingRigs")}</div>
      ) : saved.length === 0 ? (
        <div className="rf-empty">
          <Boxes size={30} className="rf-muted" />
          <p className="rf-muted">{t("noRigs")}</p>
        </div>
      ) : (
        <div className="rf-saved-grid">
          {saved.map((b, i) => {
            const UC = USE_CASES[b.useCase];
            return (
              <div key={b.id} className="rf-saved-card rf-pop" style={{ animationDelay: i * 60 + "ms" }} onClick={() => onOpen(b)}>
                <div className="rf-saved-top">
                  <div className="rf-saved-uc"><UC.Icon size={15} /> {tUC(b.useCase)}</div>
                  <button className="rf-icon-btn" onClick={(e) => { e.stopPropagation(); onDelete(b.id); }}>
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="rf-saved-name">{b.name}</div>
                <div className="rf-saved-scores">
                  <div className="rf-mini-score">
                    <span className="rf-mini-num" style={{ color: scoreColor(b.overallScore / 10) }}>{b.overallScore}</span>
                    <span className="rf-mini-lbl">Perf</span>
                  </div>
                  <div className="rf-mini-score">
                    <span className="rf-mini-num" style={{ color: scoreColor(b.ppScore) }}>{b.ppScore}</span>
                    <span className="rf-mini-lbl">Price/Perf</span>
                  </div>
                  <div className="rf-saved-price">{fmt(b.total)}</div>
                </div>
                <div className="rf-saved-parts">
                  {CATEGORY_ORDER.map((c) => {
                    const pt = b.parts[c];
                    const noGpu = c === "gpu" && !pt && USE_CASES[b.useCase].alloc.gpu === 0;
                    if (!pt && !noGpu) return null;
                    return (
                      <div key={c} className="rf-saved-part">
                        <span className="rf-saved-part-cat">{tCat(c)}</span>
                        <span className="rf-saved-part-name">{pt ? pt.name : "Integrated graphics"}</span>
                      </div>
                    );
                  })}
                </div>
                {!b.compatPass && <div className="rf-incompat"><ShieldAlert size={13} /> Has compatibility issues</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- SURVEY ----------------------------- */
function Survey({ onPick }) {
  const [sel, setSel] = useState([]);
  const toggle = (k) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  return (
    <div className="rf-fade rf-step">
      <div className="rf-step-head">
        <div className="rf-eyebrow">STEP 1 OF 2</div>
        <h2>{t("useCaseQ")}</h2>
        <p className="rf-muted">Pick one or more — this sets which parts matter most and how your budget gets split.</p>
      </div>
      <div className="rf-uc-grid">
        {BASE_UC_KEYS.map((k, i) => {
          const uc = USE_CASES[k];
          const on = sel.includes(k);
          return (
            <button key={k} className={"rf-uc-card rf-pop" + (on ? " sel" : "")} style={{ animationDelay: i * 55 + "ms" }} onClick={() => toggle(k)}>
              <div className="rf-uc-icon"><uc.Icon size={24} /></div>
              <div className="rf-uc-label">{tUC(k)}</div>
              <div className="rf-uc-tag">{tUCtag(k)}</div>
              <div className={"rf-uc-check" + (on ? " on" : "")}>{on && <Check size={14} />}</div>
            </button>
          );
        })}
      </div>
      <div className="rf-step-foot">
        <span className="rf-muted rf-sm">{sel.length ? sel.map(tUC).join(" + ") : "Select at least one"}</span>
        <button className="rf-btn rf-btn-lg" disabled={!sel.length} onClick={() => onPick(sel)}>Next <ChevronRight size={18} /></button>
      </div>
    </div>
  );
}

/* ----------------------------- BUDGET ----------------------------- */
function BudgetStep({ useCase, budget, setBudget, onBack, onAuto, onManual }) {
  const UC = USE_CASES[useCase];
  const MIN = 500, MAX = 4000;
  const pct = ((budget - MIN) / (MAX - MIN)) * 100;
  const presets = [700, 1200, 2000, 3000];
  return (
    <div className="rf-fade rf-step">
      <div className="rf-step-head">
        <div className="rf-eyebrow">STEP 2 OF 2 · {tUC(useCase).toUpperCase()}</div>
        <h2>{t("budgetQ")}</h2>
        <p className="rf-muted">Drag to set your total spend. We reserve the essentials first, then spend the rest where it counts.</p>
      </div>

      <div className="rf-budget-display">{fmt(budget)}</div>

      <div className="rf-slider-wrap">
        <input
          type="range" min={MIN} max={MAX} step={50} value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="rf-slider"
          style={{ background: `linear-gradient(90deg, var(--c-accent) ${pct}%, var(--c-track) ${pct}%)` }}
        />
        <div className="rf-slider-ends"><span>{fmt(MIN)}</span><span>{fmt(MAX)}</span></div>
      </div>

      <div className="rf-presets">
        {presets.map((p) => (
          <button key={p} className={"rf-preset" + (budget === p ? " active" : "")} onClick={() => setBudget(p)}>{fmt(p)}</button>
        ))}
      </div>

      {/* live allocation preview */}
      <div className="rf-alloc">
        <div className="rf-alloc-title">How your {fmt(budget)} splits for {tUC(useCase)}</div>
        <div className="rf-alloc-bars">
          {CATEGORY_ORDER.filter((c) => UC.alloc[c] > 0).map((c) => (
            <div key={c} className="rf-alloc-row">
              <span className="rf-alloc-lbl">{tCat(c)}</span>
              <div className="rf-alloc-track"><div className="rf-alloc-fill" style={{ width: UC.alloc[c] * 2.4 + "%" }} /></div>
              <span className="rf-alloc-val">{fmt((budget * UC.alloc[c]) / 100)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rf-forge-btns">
        <button type="button" className="rf-forge-btn primary" onClick={onAuto}>
          <Sparkles size={15} /> {t("autoForge")}
        </button>
        <button type="button" className="rf-forge-btn outline" onClick={onManual}>
          <Wrench size={15} /> {t("buildYourself")}
        </button>
      </div>

      <div className="rf-step-actions center">
        <button type="button" className="rf-ghost" onClick={onBack}><ChevronLeft size={16} /> {t("back")}</button>
      </div>
    </div>
  );
}

/* ----------------------------- RESULTS ----------------------------- */
function Results({ useCase, budget, parts, analysis, verdict, aiBusy, onGenerate, expanded, setExpanded, onSwap, onRemove, onRegen, onSave, isOnline }) {
  const UC = USE_CASES[useCase];
  const a = analysis;
  // Total counts only parts with a live price, so a hidden (out-of-stock) part never adds a made-up number.
  const shownTotal = CATEGORY_ORDER.reduce((s, c) => { const p = parts[c]; return s + (p && !partOOS(p) ? p.price : 0); }, 0);
  const overBudget = shownTotal > budget;
  return (
    <div className="rf-fade">
      <div className="rf-results-head">
        <div>
          <div className="rf-eyebrow"><UC.Icon size={13} /> {tUC(useCase)} · {fmt(budget)} {t("budget")}</div>
          <h2>{t("yourBuild")}</h2>
        </div>
        <div className="rf-results-actions">
          <button className="rf-ghost" onClick={onRegen}><Sparkles size={15} /> Auto-forge</button>
          <button className="rf-btn" onClick={onSave}><Save size={16} /> {t("saveRig")}</button>
        </div>
      </div>

      {/* scorecard */}
      <div className="rf-scorecard rf-pop">
        <div className="rf-gauges">
          <Gauge value={a.score} max={1000} label={t("performance")} accent={scoreColor(a.score / 10)} />
          <Gauge value={a.ppScore} label={t("pricePerf")} accent={scoreColor(a.ppScore)} delay={120} />
        </div>
        <div className="rf-verdict">
          <div className="rf-verdict-tag"><Sparkles size={13} /> AI verdict <span className="rf-hybrid">Opus 4.8</span>{aiBusy && <span className="rf-verdict-state"> · thinking…</span>}</div>
          {verdict === "__offline__" ? (
            <p className="rf-offline-msg">AI unavailable — connect to the internet to generate a verdict.</p>
          ) : verdict ? (
            <p>{verdict}</p>
          ) : aiBusy ? (
            <p className="rf-verdict-busy">Analyzing your build with current prices…</p>
          ) : isOnline === false ? (
            <p className="rf-offline-msg">AI unavailable offline — connect to generate a verdict.</p>
          ) : (
            <button className="rf-forge-btn outline rf-verdict-btn" onClick={onGenerate}><Sparkles size={14} /> Generate AI verdict</button>
          )}
          <div className="rf-total-row">
            <span className="rf-muted">Total</span>
            <span className={"rf-total" + (overBudget ? " over" : "")}>{fmt(shownTotal)}</span>
            <div className="rf-budget-bar">
              <div className="rf-budget-fill" style={{ width: clamp((shownTotal / budget) * 100, 0, 100) + "%", background: overBudget ? "var(--c-bad)" : "var(--c-accent)" }} />
            </div>
            <span className="rf-muted">{fmt(budget)}</span>
          </div>
        </div>
      </div>

      {/* compatibility banner */}
      <div className={"rf-compat " + (!a.compat.pass ? "bad" : !a.complete ? "warn" : "ok")}>
        {!a.compat.pass ? <ShieldAlert size={18} /> : !a.complete ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
        <div>
          <strong>
            {!a.compat.pass
              ? `${a.compat.issues.length} compatibility issue${a.compat.issues.length > 1 ? "s" : ""}`
              : !a.complete
              ? `${a.missing.length} part${a.missing.length > 1 ? "s" : ""} still to add`
              : "All compatibility checks passed"}
          </strong>
          {!a.compat.pass && <ul>{a.compat.issues.map((m, i) => <li key={i}>{m}</li>)}</ul>}
          {a.compat.pass && !a.complete && (
            <span className="rf-compat-sub">{a.missing.map((c) => tCat(c)).join(", ")}</span>
          )}
        </div>
      </div>

      {/* part list */}
      <div className="rf-parts">
        {CATEGORY_ORDER.map((cat, i) => {
          const part = parts[cat];
          const skip = UC.alloc[cat] === 0 && !part;
          const band = (budget * UC.alloc[cat]) / 100;
          const Meta = CAT_META[cat];
          const status = part ? budgetStatus(part.price, band) : "within";
          const compatible = part ? isPartCompatible(parts, cat) : true;
          const sc = part ? (compatible ? partScore({ ...part, cat }, band, useCase) : 0) : 0;
          const isOpen = expanded[cat];
          return (
            <div key={cat} className="rf-part rf-pop" style={{ animationDelay: i * 45 + "ms" }}>
              <div className="rf-part-top">
                <div className="rf-part-media">
                {part && part.img ? (
                  <a href={part.url || "#"} target="_blank" rel="noopener noreferrer" className="rf-part-img-link" onClick={(e) => e.stopPropagation()} title="View product page">
                    <img src={part.img} alt={part.name} className="rf-part-img" loading="lazy" />
                  </a>
                ) : (
                  <div className="rf-part-icon"><Meta.Icon size={20} /></div>
                )}
                {part && part._source && <span className={"rf-part-src " + part._source}>{({ amazon: "Amazon", newegg: "Newegg", bestbuy: "Best Buy" })[part._source] || ""}</span>}
                </div>
                <div className="rf-part-info">
                  <div className="rf-part-cat">{tCat(cat)}</div>
                  {part ? (
                    <div className="rf-part-name">{part.name}</div>
                  ) : skip ? (
                    <div className="rf-part-name rf-muted">Integrated graphics — no discrete GPU</div>
                  ) : (
                    <div className="rf-part-name rf-muted">Empty</div>
                  )}
                </div>

                {part && (
                  <>
                    <div className="rf-part-price-col">
                      {partOOS(part) ? (
                        <div className="rf-part-price rf-oos-price">{t("outOfStock")}</div>
                      ) : (
                        <>
                          <div className={"rf-part-price " + status}>{fmt(part.price)}</div>
                          {status === "over" && <div className="rf-flag over">OVER BUDGET</div>}
                          {status === "tight" && <div className="rf-flag tight">A bit over</div>}
                        </>
                      )}
                    </div>
                    <div className="rf-part-score" style={{ borderColor: scoreColor(sc), color: scoreColor(sc) }}>{sc}</div>
                  </>
                )}
              </div>

              <div className="rf-part-actions">
                {part && (
                  <button className="rf-chip-btn" onClick={() => setExpanded((e) => ({ ...e, [cat]: !e[cat] }))}>
                    {isOpen ? <ChevronLeft size={13} style={{ transform: "rotate(90deg)" }} /> : <Sparkles size={13} />}
                    {isOpen ? t("hideInfo") : t("moreInfo")}
                  </button>
                )}
                <button className="rf-chip-btn primary" onClick={() => onSwap(cat)}><Repeat2 size={13} /> {part ? "Swap" : "Add"}</button>
              </div>

              {part && isOpen && <InfoPanel cat={cat} part={part} band={band} status={status} useCase={useCase} incompatible={!compatible} enableAsk budget={budget} parts={parts} isOnline={isOnline} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------- General facts + a personalized "for you" note ------- */
function partFacts(cat, part) {
  switch (cat) {
    case "cpu": return [`${part.cores} cores`, `${part.socket} socket`, `${part.tdp}W TDP`, part.igpu ? "Integrated graphics" : "Needs a GPU"];
    case "gpu": return [`${part.vram}GB VRAM`, `${part.tdp}W draw`, `${part.len}mm long`];
    case "mobo": return [`${part.socket}`, `${part.ramType}`, `${part.form}`, `${part.m2} M.2 slot${part.m2 > 1 ? "s" : ""}`];
    case "ram": return [`${part.cap}GB`, `${part.ramType}`, `${part.speed} MT/s`];
    case "storage": return [`${part.cap >= 1000 ? part.cap / 1000 + "TB" : part.cap + "GB"}`, `${part.kind}`, `${part.iface}`];
    case "psu": return [`${part.watt}W`, `80+ ${part.eff}`];
    case "case": return [`Fits ${part.forms.join("/")}`, `GPU ≤ ${part.maxGpu}mm`, `Cooler ≤ ${part.maxCool}mm`];
    case "cooler": return [`${part.type.toUpperCase()}`, `${part.tdpRating}W rated`, part.type === "air" ? `${part.height}mm tall` : "Liquid"];
    default: return [];
  }
}
function partProsCons(cat, part, band, status, useCase) {
  const pros = [];
  const cons = [];
  const ratio = ucPerf(cat, part, useCase) / ucMaxPerf(cat, useCase);
  const high = ratio >= 0.8;
  const mid = ratio >= 0.5 && ratio < 0.8;
  const low = ratio < 0.4;
  const uc = USE_CASES[useCase];
  const ucLabel = uc.label.toLowerCase();

  // budget — requested behaviour: over budget shows up as a con
  if (status === "over") cons.push("Over budget");
  else if (status === "tight") cons.push(`Slightly over your ${fmt(band)} budget slice`);
  else pros.push(`Fits your ${fmt(band)} budget slice`);

  // performance tier
  if (high) pros.push("Top-tier performance in its class");
  else if (mid) pros.push("Solid mid-range performance");
  if (low) cons.push("Entry-level performance");

  switch (cat) {
    case "cpu":
      if (part.cores >= 12) pros.push(`${part.cores} cores — great for multitasking & productivity`);
      if (part.igpu) pros.push("Integrated graphics — runs without a GPU");
      else cons.push("No integrated graphics — needs a discrete GPU");
      if (part.tdp >= 150) cons.push(`High ${part.tdp}W power draw — wants strong cooling`);
      if (uc.alloc.gpu === 0 && !part.igpu) cons.push("No iGPU — unsuitable for a GPU-less office build");
      break;
    case "gpu":
      if (part.vram >= 16) pros.push(`${part.vram}GB VRAM — strong for high-res & AI work`);
      if (part.vram <= 8) cons.push(`Only ${part.vram}GB VRAM — limiting at 1440p+ and for AI`);
      if (part.tdp >= 280) cons.push(`High ${part.tdp}W draw — needs a beefy PSU & airflow`);
      if (part.len >= 320) cons.push(`${part.len}mm long — check case clearance`);
      if (["gaming", "ai"].includes(useCase) && high) pros.push(`Excellent match for ${ucLabel}`);
      if (uc.alloc.gpu === 0) cons.push("Unnecessary for office use — integrated graphics suffice");
      break;
    case "mobo":
      if (part.m2 >= 3) pros.push(`${part.m2} M.2 slots — room for multiple fast drives`);
      if (part.maxRam >= 192) pros.push(`Supports up to ${part.maxRam}GB RAM`);
      if (part.form === "ITX") cons.push("ITX — limited expansion & RAM slots");
      pros.push(`${part.ramType} platform`);
      break;
    case "ram":
      if (part.cap >= 32) pros.push(`${part.cap}GB — comfortable for demanding workloads`);
      if (part.cap <= 16) cons.push(`${part.cap}GB — tight for heavy multitasking`);
      if (part.ramType === "DDR5" && part.speed >= 6000) pros.push(`Fast ${part.speed} MT/s DDR5`);
      if (part.ramType === "DDR4") cons.push("Older DDR4 standard (end-of-life platform)");
      if (part.price >= 600) cons.push("Expensive — memory-shortage premium");
      break;
    case "storage":
      if (part.kind === "NVMe") pros.push("Fast NVMe (M.2)");
      if (part.kind === "SATA") cons.push("Slower SATA interface");
      if (part.cap >= 2000) pros.push(`${part.cap / 1000}TB — plenty of space`);
      if (part.cap <= 1000) cons.push("1TB — can fill up fast with large games");
      break;
    case "psu":
      if (["Gold", "Platinum", "Titanium"].includes(part.eff)) pros.push(`Efficient 80+ ${part.eff}`);
      if (part.eff === "Bronze") cons.push("Basic 80+ Bronze efficiency");
      if (part.watt >= 1000) pros.push(`${part.watt}W — ample headroom for top GPUs`);
      if (part.watt <= 550) cons.push(`${part.watt}W — limited headroom for big builds`);
      break;
    case "case":
      if (part.maxGpu >= 380) pros.push("Fits very long GPUs");
      if (part.maxCool >= 170) pros.push("Room for tall coolers / big radiators");
      if (part.forms.length === 1 && part.forms[0] === "ITX") cons.push("ITX-only — tight build, limited clearance");
      break;
    case "cooler":
      if (part.type === "aio") pros.push("AIO liquid — strong, quiet cooling");
      if (part.tdpRating >= 250) pros.push(`Handles up to ${part.tdpRating}W CPUs`);
      if (part.type === "air" && part.tdpRating <= 95) cons.push("Limited cooling — not for hot CPUs");
      if (part.type === "air" && part.height >= 160) cons.push(`${part.height}mm tall — check case clearance`);
      break;
    default:
      break;
  }

  if (pros.length === 0) pros.push("Gets the job done for the price");
  if (cons.length === 0) cons.push("No notable downsides for this build");
  return { pros, cons };
}

function PartAsk({ part, cat, useCase, budget, parts, isOnline }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // { role:'user'|'assistant', text, err? }
  const [loading, setLoading] = useState(false);
  const ask = async () => {
    const q = input.trim();
    if (!q || loading) return;
    const history = [...messages, { role: "user", text: q }];
    setMessages([...history, { role: "assistant", text: "" }]);
    setInput("");
    setLoading(true);
    const ucLabel = useCase ? tUC(useCase) : "unspecified";
    const buildLines = parts ? CATEGORY_ORDER.filter((c) => parts[c]).map((c) => `${CAT_META[c].label}: ${parts[c].name} ($${parts[c].price})`).join("; ") : "";
    const system =
      "You are the built-in AI assistant for FORGEAPC, a PC-part-picker app. " +
      "Your name and model identity is \"Opus 4.8\" by Anthropic (Claude). If anyone asks what model or AI you are, always say you are Opus 4.8 by Anthropic. Never mention Haiku, Sonnet, or any other model name. " +
      "Answer the user's question about ONE specific part, in the context of their full build, use case and budget. The conversation may have follow-up questions — keep your earlier answers in mind. " +
      "Keep answers short and practical — usually 2-4 sentences. Use a short bullet list only if it genuinely helps. No fluff or filler. " +
      "Context: as of mid-2026 a severe AI-driven memory/storage shortage makes RAM and SSDs very expensive (64GB DDR5 ~$850, 32GB ~$470, 1TB SSD ~$165). DDR5-6000 CL30 is the value sweet spot; motherboards above ~$250 are usually overkill.\n\n" +
      `The part in question: ${CAT_META[cat].label} — ${part.name} ($${part.price}). Use case: ${ucLabel}. Budget: ${fmt(budget)}. Full build: ${buildLines || "not assembled yet"}.`;
    const payload = history.map((m) => ({ role: m.role, content: m.text }));
    try {
      await streamChat({ system, messages: payload }, (full) => {
        setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", text: full }; return c; });
      });
    } catch (e) {
      setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", text: "Could not reach the assistant — please try again.", err: true }; return c; });
    } finally {
      setLoading(false);
    }
  };
  if (!open) {
    return (
      <button className="rf-ask-part-btn" onClick={() => setOpen(true)}>
        <Sparkles size={13} /> Ask AI about this part
      </button>
    );
  }
  if (!isOnline) {
    return (
      <div className="rf-ask-inline">
        <div className="rf-offline-msg" style={{marginTop:"6px"}}>AI is unavailable offline. Connect to the internet to ask questions about this part.</div>
      </div>
    );
  }
  return (
    <div className="rf-ask-inline">
      {messages.length > 0 && (
        <div className="rf-ask-thread">
          {messages.map((m, i) => {
            const thinking = m.role === "assistant" && !m.text && loading && i === messages.length - 1;
            return (
              <div key={i} className={"rf-ask-msg " + m.role + (m.err ? " rf-ask-err" : "") + (thinking ? " rf-ask-think" : "")}>
                {m.text || (thinking ? "Thinking…" : "")}
              </div>
            );
          })}
        </div>
      )}
      <div className="rf-ask-row">
        <input className="rf-ask-input" value={input} autoFocus placeholder="Ask anything about this part…"
          onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ask(); }} />
        <button className="rf-ask-send" onClick={ask} disabled={loading || !input.trim()}>{loading ? "…" : "Ask"}</button>
      </div>
    </div>
  );
}

function InfoPanel({ cat, part, band, status, useCase, compact, incompatible, enableAsk, budget, parts, isOnline }) {
  const facts = partFacts(cat, part);
  const { pros, cons } = partProsCons(cat, part, band, status, useCase);
  const allCons = incompatible ? ["Not compatible with your current build", ...cons] : cons;
  const strong = (c) => c === "Over budget" || c === "Not compatible with your current build";
  return (
    <div className={"rf-info rf-slidein" + (compact ? " compact" : "")}>
      <div className="rf-info-specs">
        <div className="rf-info-h">SPECS</div>
        <div className="rf-info-facts">{facts.map((f, i) => <span key={i} className="rf-fact">{f}</span>)}</div>
      </div>
      <div className="rf-pc-head"><Sparkles size={12} /> AI PROS &amp; CONS <span className="rf-hybrid">auto</span></div>
      <div className="rf-pc-grid">
        <div>
          <div className="rf-pc-h pros">{t("pros")}</div>
          <ul className="rf-pc-list">
            {pros.map((p, i) => <li key={i} className="rf-pc pro"><Check size={13} /> {p}</li>)}
          </ul>
        </div>
        <div>
          <div className="rf-pc-h cons">{t("cons")}</div>
          <ul className="rf-pc-list">
            {allCons.map((c, i) => (
              <li key={i} className={"rf-pc con" + (strong(c) ? " strong" : "")}><X size={13} /> {c}</li>
            ))}
          </ul>
        </div>
      </div>
      {enableAsk && <PartAsk part={part} cat={cat} useCase={useCase} budget={budget} parts={parts} isOnline={isOnline} />}
    </div>
  );
}

/* ----------------------------- PART PICKER DRAWER ----------------------------- */
function Picker({ cat, current, useCase, budget, parts, onClose, onPick }) {
  const Meta = CAT_META[cat];
  const band = (budget * USE_CASES[useCase].alloc[cat]) / 100;
  const [openId, setOpenId] = useState(null);      // variant id with "More info" open
  const [openModel, setOpenModel] = useState(null); // model group expanded to variants
  const [q, setQ] = useState(""); // search filter

  const models = useMemo(() => {
    const rest = { ...parts };
    delete rest[cat];
    const baseIssues = checkCompat(rest).issues.length;
    const scored = CATALOG[cat].map((p) => {
      const res = checkCompat({ ...rest, [cat]: p });
      const adds = res.issues.length > baseIssues;
      return {
        ...p,
        _score: adds ? 0 : partScore({ ...p, cat }, band, useCase),
        _status: budgetStatus(p.price, band),
        _compat: !adds,
        _issues: res.issues,
      };
    });
    const groups = {};
    for (const v of scored) {
      const key = v.model || v.name;
      (groups[key] = groups[key] || []).push(v);
    }
    const list = Object.entries(groups).map(([model, variants]) => {
      variants.sort((a, b) => (a._status === "over" ? 1 : 0) - (b._status === "over" ? 1 : 0) || b._score - a._score || a.price - b.price);
      const prices = variants.map((v) => v.price);
      const rep = variants[0];
      return {
        model,
        variants,
        rep,
        single: variants.length === 1,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        score: rep._score,
        _over: budgetStatus(Math.min(...prices), band) === "over",
        compat: variants.some((v) => v._compat),
        hasCurrent: current && variants.some((v) => v.id === current.id),
      };
    });
    list.sort((a, b) => (a._over ? 1 : 0) - (b._over ? 1 : 0) || b.score - a.score || a.minPrice - b.minPrice);
    return list;
  }, [cat, parts, band, useCase, current]);

  // search filter: match model, brand, or any variant name/label
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return models;
    const toks = s.split(/\s+/);
    return models.filter((g) => {
      const hay = (g.model + " " + g.variants.map((v) => `${v.brand} ${v.name} ${v.variantLabel || ""} ${v.model || ""}`).join(" ")).toLowerCase();
      return toks.every((tk) => hay.includes(tk));
    });
  }, [models, q]);

  const VariantActions = ({ v }) => {
    const open = openId === v.id;
    const isCur = current && current.id === v.id;
    const oos = partOOS(v);
    return (
      <>
        <div className="rf-pick-actions">
          <button className="rf-chip-btn" onClick={() => setOpenId(open ? null : v.id)}>
            {open ? <ChevronLeft size={13} style={{ transform: "rotate(90deg)" }} /> : <Sparkles size={13} />}
            {open ? t("hideInfo") : t("moreInfo")}
          </button>
          {oos ? (
            <button className="rf-chip-btn oos" disabled>{t("outOfStock")}</button>
          ) : (
            <button className="rf-chip-btn primary" onClick={() => onPick(v)}>{isCur ? t("selected") : t("select")}</button>
          )}
        </div>
        {open && <InfoPanel cat={cat} part={v} band={band} status={v._status} useCase={useCase} compact incompatible={!v._compat} />}
      </>
    );
  };

  return (
    <div className="rf-drawer-wrap" onClick={onClose}>
      <div className="rf-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="rf-drawer-head">
          <div>
            <div className="rf-eyebrow"><Meta.Icon size={13} /> {t("chooseA")} {tCat(cat).toUpperCase()}</div>
            <div className="rf-muted rf-sm">{q.trim() ? `${shown.length} of ${CATALOG[cat].length}` : CATALOG[cat].length} options · sorted by your match score · budget slice {fmt(band)}</div>
          </div>
          <button className="rf-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="rf-drawer-search">
          <Search size={15} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${tCat(cat).toLowerCase()}…`} spellCheck={false} />
          {q && <button className="rf-search-clear" onClick={() => setQ("")} aria-label="Clear"><X size={14} /></button>}
        </div>
        <div className="rf-drawer-list">
          {shown.length === 0 && <div className="rf-pick-empty">No {tCat(cat).toLowerCase()} matches “{q}”.</div>}
          {shown.map((g, gi) => {
            const expanded = openModel === g.model;
            const _lp = g.variants.filter((v) => !partOOS(v)).map((v) => v.price);
            const priceLabel = _lp.length ? (Math.min(..._lp) === Math.max(..._lp) ? fmt(Math.min(..._lp)) : `${fmt(Math.min(..._lp))}–${fmt(Math.max(..._lp))}`) : t("outOfStock");
            const showDivider = gi > 0 && g._over && !shown[gi - 1]._over;
            return (
              <React.Fragment key={g.model}>
                {showDivider && <div className="rf-pick-divider"><span>{t("overBudgetCat", { x: tCat(cat).toLowerCase() })}</span></div>}
              <div className={"rf-pick" + (g.hasCurrent ? " current" : "") + (g._over ? " over" : "")}>
                <div
                  className={"rf-pick-row" + (g.single ? "" : " rf-clickable")}
                  onClick={g.single ? undefined : () => setOpenModel(expanded ? null : g.model)}
                >
                  <div className="rf-pick-score" style={{ borderColor: scoreColor(g.score), color: scoreColor(g.score) }}>{g.score}</div>
                  {g.rep.img && (
                    <a href={g.rep.url || "#"} target="_blank" rel="noopener noreferrer" className="rf-pick-img-link" onClick={(e) => e.stopPropagation()} title="View product page">
                      <img src={g.rep.img} alt={g.model} className="rf-pick-img" loading="lazy" />
                    </a>
                  )}
                  <div className="rf-pick-info">
                    <div className="rf-pick-name">
                      {g.model}
                      {!g.single && <span className="rf-variant-count">{g.variants.length} models</span>}
                      {g.hasCurrent && <span className="rf-cur-tag">current</span>}
                    </div>
                    <div className="rf-pick-facts">{partFacts(cat, g.rep).slice(0, 3).join(" · ")}</div>
                    {!g.compat && <div className="rf-pick-warn"><AlertTriangle size={12} /> {g.rep._issues[0]}</div>}
                  </div>
                  <div className="rf-pick-right">
                    <div className={"rf-part-price " + (g.single ? g.rep._status : "")}>{priceLabel}</div>
                    {g.compat ? <ShieldCheck size={14} className="rf-compat-ok" /> : <ShieldAlert size={14} className="rf-compat-bad" />}
                  </div>
                </div>

                {g.single ? (
                  <VariantActions v={g.rep} />
                ) : (
                  <div className="rf-pick-actions">
                    <button className="rf-chip-btn" onClick={() => setOpenModel(expanded ? null : g.model)}>
                      <ChevronLeft size={13} style={{ transform: expanded ? "rotate(90deg)" : "rotate(-90deg)" }} />
                      {expanded ? "Hide models" : `Show ${g.variants.length} models`}
                    </button>
                  </div>
                )}

                {!g.single && expanded && (
                  <div className="rf-variants">
                    {g.variants.map((v) => (
                      <div key={v.id} className={"rf-variant" + (current && current.id === v.id ? " current" : "")}>
                        <div className="rf-variant-row">
                          <div className="rf-pick-score sm" style={{ borderColor: scoreColor(v._score), color: scoreColor(v._score) }}>{v._score}</div>
                          {v.img && (
                            <a href={v.url || "#"} target="_blank" rel="noopener noreferrer" className="rf-pick-img-link" onClick={(e) => e.stopPropagation()} title="View product page">
                              <img src={v.img} alt={v.variantLabel || v.brand} className="rf-pick-img sm" loading="lazy" />
                            </a>
                          )}
                          <div className="rf-variant-name">{v.variantLabel || v.brand}</div>
                          <div className="rf-variant-right">
                            <span className={"rf-part-price " + v._status}>{partOOS(v) ? "—" : fmt(v.price)}</span>
                            {v._status === "over" && <span className="rf-flag over">OVER</span>}
                            {!v._compat && <ShieldAlert size={13} className="rf-compat-bad" />}
                          </div>
                        </div>
                        <VariantActions v={v} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- AI ASSISTANT ----------------------------- */
const SUGGESTIONS = [
  "Is my build balanced?",
  "What should I upgrade first?",
  "Best value GPU for my budget?",
  "Why is RAM so expensive right now?",
];

// Try the strongest model first; fall back if the environment doesn't allow it.
const ASSISTANT_MODELS = ["claude-opus-4-8", "claude-sonnet-4-6", "claude-sonnet-4-20250514"];
const CHAT_URL = "/api/chat"; // your serverless function that holds the Anthropic key

async function streamChat({ system, messages }, onDelta) {
  // 1) Deployed site: our own backend answers and keeps the API key server-side.
  try {
    const res = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, messages }),
    });
    if (res.ok) {
      const data = await res.json();
      const text = (data && data.text ? data.text : "").trim();
      if (text) { onDelta(text); return text; } // smooth typewriter reveals it
    }
  } catch (e) {
    /* no backend reachable (e.g. the Claude preview) — fall through to the direct call */
  }

  // 2) Fallback: call Anthropic directly (works inside the Claude preview).
  let lastErr;
  for (const model of ASSISTANT_MODELS) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, max_tokens: 600, system, stream: true, messages }),
      });
      if (!res.ok || !res.body) throw new Error("status " + res.status);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "", raw = "", acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        raw += chunk; buf += chunk;
        const lines = buf.split("\n");
        buf = lines.pop();
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const p = t.slice(5).trim();
          if (!p || p === "[DONE]") continue;
          try {
            const evt = JSON.parse(p);
            if (evt.type === "content_block_delta" && evt.delta && evt.delta.type === "text_delta") {
              acc += evt.delta.text;
              onDelta(acc);
            }
          } catch (e) {}
        }
      }
      if (!acc) {
        try {
          const data = JSON.parse(raw);
          const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
          if (text) { acc = text; onDelta(acc); }
        } catch (e) {}
      }
      if (acc) return acc;
      lastErr = new Error("empty response");
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("request failed");
}

function Assistant({ open, onClose, useCase, budget, parts, isOnline }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const targetRef = useRef("");   // full text received from the stream so far
  const shownRef = useRef(0);     // chars currently revealed
  const doneRef = useRef(false);  // network stream finished
  const rafRef = useRef(0);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Reveal buffered text at a steady, smooth pace regardless of network bursts.
  const tick = () => {
    const target = targetRef.current;
    if (shownRef.current < target.length) {
      const remaining = target.length - shownRef.current;
      const step = Math.max(2, Math.min(4, Math.ceil(remaining / 25))); // steady, smooth cadence
      shownRef.current = Math.min(target.length, shownRef.current + step);
      const shown = target.slice(0, shownRef.current);
      setMessages((m) => {
        const c = [...m];
        c[c.length - 1] = { role: "assistant", text: shown };
        return c;
      });
    }
    if (doneRef.current && shownRef.current >= target.length) {
      setStreaming(false);
      rafRef.current = 0;
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const buildContext = () => {
    const hasBuild = parts && Object.keys(parts).some((k) => parts[k]);
    if (!hasBuild) return "The user hasn't assembled a build yet.";
    const ucLabel = useCase ? USE_CASES[useCase].label : "unspecified";
    const lines = CATEGORY_ORDER.filter((c) => parts[c]).map(
      (c) => `- ${CAT_META[c].label}: ${parts[c].name} ($${parts[c].price})`
    );
    const total = CATEGORY_ORDER.reduce((s, c) => s + (parts[c]?.price || 0), 0);
    let extra = "";
    if (useCase) {
      const a = analyzeBuild(parts, useCase, budget);
      extra =
        `Performance score ${a.score}/1000, price-to-performance ${a.ppScore}/100. ` +
        `Total $${total} of a $${budget} budget. ` +
        `Compatibility: ${a.compat.pass ? "all checks pass" : a.compat.issues.join("; ")}.`;
    }
    return `Use case: ${ucLabel}. Budget: $${budget}.\nParts:\n${lines.join("\n")}\n${extra}`;
  };

  const send = async (preset) => {
    const q = (preset ?? input).trim();
    if (!q || loading || streaming) return;
    const next = [...messages, { role: "user", text: q }];
    const payload = next.map((m) => ({ role: m.role, content: m.text }));
    setMessages([...next, { role: "assistant", text: "" }]);
    setInput("");
    setLoading(true);
    setStreaming(true);
    setError(null);
    targetRef.current = "";
    shownRef.current = 0;
    doneRef.current = false;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    const system =
      "You are the built-in AI assistant for FORGEAPC, a PC-part-picker app. " +
      "Your name and model identity is \"Opus 4.8\" by Anthropic (Claude). If anyone asks what model or AI you are, always say you are Opus 4.8 by Anthropic. Never mention Haiku, Sonnet, or any other model name. " +
      "Help with the user's build: components, compatibility, bottlenecks, and which parts fit their needs and budget. " +
      "Keep answers short and practical — usually 2-4 sentences. Use a short bullet list only if it genuinely helps. No fluff or filler. " +
      "Context: as of mid-2026 a severe AI-driven memory/storage shortage makes RAM and SSDs very expensive (64GB DDR5 ~$850, 32GB ~$470, 1TB SSD ~$165). " +
      "DDR5-6000 CL30 is the value sweet spot; 6400/7200 is poor value; motherboards above ~$250 are usually overkill. Factor this in.\n\n" +
      "The user's current build:\n" +
      buildContext();
    try {
      await streamChat({ system, messages: payload }, (full) => { targetRef.current = full; });
      doneRef.current = true; // reveal loop will finish the remaining buffered text, then stop
    } catch (e) {
      doneRef.current = true;
      cancelAnimationFrame(rafRef.current);
      setStreaming(false);
      setError("Couldn't reach the assistant. Please try again.");
      setMessages((m) => (m.length && m[m.length - 1].role === "assistant" && !m[m.length - 1].text ? m.slice(0, -1) : m));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="rf-assistant">
      <div className="rf-asst-head">
        <div className="rf-asst-title">
          <div className="rf-asst-avatar"><Bot size={16} /></div>
          <span>AI Assistant <span className="rf-asst-model">Opus 4.8</span></span>
        </div>
        <button className="rf-icon-btn" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="rf-asst-list" ref={listRef}>
        {messages.length === 0 && (
          <div className="rf-asst-welcome">
            <div className="rf-asst-avatar big"><Sparkles size={20} /></div>
            <p>Ask me anything about your build or PC parts in general — I can see your current rig.</p>
            <div className="rf-asst-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="rf-asst-chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => {
          const isStreamingMsg = streaming && i === messages.length - 1 && m.role === "assistant";
          return (
            <div key={i} className={"rf-msg " + m.role}>
              {m.role === "assistant" && <div className="rf-asst-avatar sm"><Bot size={13} /></div>}
              <div className="rf-bubble">
                {m.text ? (
                  <>{m.text}{isStreamingMsg && <span className="rf-cursor" />}</>
                ) : isStreamingMsg ? (
                  <span className="rf-typing"><span></span><span></span><span></span></span>
                ) : null}
              </div>
            </div>
          );
        })}
        {error && <div className="rf-asst-error">{error}</div>}
        {!isOnline && <div className="rf-asst-offline">You are offline — AI is unavailable. Reconnect to use the assistant.</div>}
      </div>

      <div className="rf-asst-input">
        <input
          value={input}
          placeholder={isOnline ? "Ask about your build…" : "Offline — AI unavailable"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isOnline && send()}
          disabled={!isOnline}
        />
        <button className="rf-asst-send" onClick={() => send()} disabled={loading || streaming || !input.trim() || !isOnline}><Send size={16} /></button>
      </div>
    </div>
  );
}

/* ----------------------------- STYLES ----------------------------- */
function StyleBlock() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

.rf-root{--c-bg:#070a0f;--c-panel:rgba(255,255,255,0.045);--c-panel-2:rgba(255,255,255,0.075);
--c-border:rgba(255,255,255,0.1);--c-text:#e8edf4;--c-muted:#7c8798;
--c-accent:#19e8db;--c-accent2:#7c5cff;--c-good:#46e0a0;--c-warn:#ffc24b;--c-bad:#ff5c72;
--c-track:rgba(255,255,255,0.08);--c-hover:rgba(255,255,255,0.22);--c-grid:rgba(255,255,255,0.05);
--ease:cubic-bezier(.16,1,.3,1);--ease-spring:cubic-bezier(.22,1,.36,1);--ease-soft:cubic-bezier(.45,0,.15,1);
position:relative;min-height:100vh;width:100%;background:var(--c-bg);color:var(--c-text);
font-family:'Sora',system-ui,sans-serif;overflow-x:hidden;}
.rf-root.rf-light{--c-bg:#eef1f6;--c-panel:rgba(15,28,50,0.05);--c-panel-2:rgba(15,28,50,0.09);
--c-border:rgba(15,28,50,0.14);--c-text:#101826;--c-muted:#566273;
--c-accent:#06b6ab;--c-accent2:#6a4cf0;--c-good:#12a06a;--c-warn:#b8770a;--c-bad:#e23a52;
--c-track:rgba(15,28,50,0.12);--c-hover:rgba(15,28,50,0.24);--c-grid:rgba(15,28,50,0.05);}
.rf-root *{box-sizing:border-box;}
.rf-bg{position:fixed;inset:-10%;pointer-events:none;z-index:0;
background:radial-gradient(900px 620px at 78% -8%,rgba(124,92,255,0.22),transparent 60%),
radial-gradient(820px 620px at 8% 6%,rgba(25,232,219,0.17),transparent 55%),
radial-gradient(700px 700px at 92% 88%,rgba(124,92,255,0.12),transparent 60%);
animation:rfDrift 26s ease-in-out infinite alternate;}
@keyframes rfDrift{0%{transform:translate3d(0,0,0) scale(1);}50%{transform:translate3d(2%,1.5%,0) scale(1.06);}100%{transform:translate3d(-2%,-1%,0) scale(1.03);}}
.rf-particles{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;}
/* frosted glass on the main boxes so the particles diffuse through */
.rf-scorecard,.rf-part,.rf-pick,.rf-saved-card,.rf-compat,.rf-drawer,.rf-settings-menu,.rf-uc-card,.rf-asst-panel,.rf-modal,.rf-info{
  backdrop-filter:blur(20px) saturate(1.6) brightness(1.05);-webkit-backdrop-filter:blur(20px) saturate(1.6) brightness(1.05);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.02), 0 10px 36px rgba(0,0,0,0.32);}
.rf-scorecard,.rf-part,.rf-pick,.rf-saved-card,.rf-uc-card{transition:border-color .25s var(--ease-spring),transform .25s var(--ease-spring),box-shadow .25s var(--ease-spring),background .25s var(--ease);}
.rf-grid{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.5;
background-image:linear-gradient(var(--c-grid) 1px,transparent 1px),linear-gradient(90deg,var(--c-grid) 1px,transparent 1px);
background-size:46px 46px;
mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,0.62) 55%,rgba(0,0,0,0.4) 100%);
-webkit-mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,0.62) 55%,rgba(0,0,0,0.4) 100%);}
.rf-header{position:relative;z-index:30;display:flex;align-items:center;justify-content:space-between;
padding:20px 26px;max-width:1080px;margin:0 auto;}
.rf-header-right{display:flex;align-items:center;gap:10px;}
.rf-settings-wrap{position:relative;z-index:60;}
.rf-settings-menu{position:absolute;right:0;top:calc(100% + 8px);z-index:300;background:var(--c-bg);
border:1px solid var(--c-border);border-radius:14px;padding:14px;min-width:180px;
box-shadow:0 18px 50px rgba(0,0,0,0.45);}
.rf-settings-title{font-family:'JetBrains Mono';font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
color:var(--c-muted);margin-bottom:10px;}
.rf-theme-toggle{display:flex;gap:6px;background:var(--c-panel);border:1px solid var(--c-border);border-radius:10px;padding:4px;}
.rf-theme-opt{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;
background:transparent;border:none;color:var(--c-muted);font-family:'Sora';font-size:13px;font-weight:600;
padding:8px 10px;border-radius:8px;cursor:pointer;transition:.15s;}
.rf-theme-opt.active{background:var(--c-accent);color:#04110f;}
.rf-theme-opt:not(.active):hover{color:var(--c-text);background:var(--c-panel-2);}
.rf-settings-menu{min-width:212px;animation:rfPop .26s var(--ease) backwards;}
.rf-settings-tabs{display:flex;gap:4px;margin-bottom:12px;background:var(--c-panel);border:1px solid var(--c-border);border-radius:10px;padding:3px;}
.rf-settings-tab{flex:1;background:transparent;border:none;color:var(--c-muted);font-family:'Sora';font-weight:600;font-size:12.5px;padding:7px 8px;border-radius:8px;cursor:pointer;transition:background .2s var(--ease),color .2s var(--ease);}
.rf-settings-tab.active{background:var(--c-accent);color:#04110f;}
.rf-settings-tab:not(.active):hover{color:var(--c-text);}
.rf-settings-pane{animation:rfFade .22s var(--ease);}
.rf-lang-list{display:flex;flex-direction:column;gap:3px;max-height:248px;overflow-y:auto;margin:0 -4px;padding:0 4px;}
.rf-lang-opt{display:flex;align-items:center;justify-content:space-between;gap:8px;background:transparent;border:1px solid transparent;color:var(--c-text);font-family:'Sora';font-size:13.5px;padding:8px 10px;border-radius:8px;cursor:pointer;text-align:left;transition:background .16s var(--ease),color .16s var(--ease),border-color .16s var(--ease);}
.rf-lang-opt:hover{background:var(--c-panel-2);}
.rf-lang-opt.active{color:var(--c-accent);border-color:rgba(25,232,219,0.3);background:rgba(25,232,219,0.08);}
.rf-root[dir="rtl"] .rf-lang-opt,.rf-root[dir="rtl"] .rf-settings-title{text-align:right;}
.rf-fs-btn{padding:9px 11px;}
.rf-brand{display:flex;align-items:center;gap:10px;font-family:'Chakra Petch';font-weight:700;
font-size:20px;letter-spacing:1px;cursor:pointer;}
.rf-logo{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;color:#04110f;
background:linear-gradient(135deg,var(--c-accent),#19b89f);box-shadow:0 0 18px rgba(25,232,219,0.5);animation:rfLogoGlow 3.4s ease-in-out infinite;}
@keyframes rfLogoGlow{0%,100%{box-shadow:0 0 16px rgba(25,232,219,0.45);}50%{box-shadow:0 0 26px rgba(25,232,219,0.85),0 0 40px rgba(124,92,255,0.35);}}
/* extra flash: animated sheen sweep across primary buttons */
.rf-btn{position:relative;overflow:hidden;}
.rf-btn::after{content:"";position:absolute;top:0;left:-60%;width:45%;height:100%;background:linear-gradient(105deg,transparent,rgba(255,255,255,0.55),transparent);transform:skewX(-18deg);animation:rfSheen 4.5s ease-in-out infinite;pointer-events:none;}
@keyframes rfSheen{0%,72%{left:-60%;}86%{left:130%;}100%{left:130%;}}
.rf-btn:hover{filter:brightness(1.08) saturate(1.1);}
@media (prefers-reduced-motion:reduce){.rf-logo,.rf-btn::after{animation:none;}.rf-btn::after{display:none;}}
.rf-accent{color:var(--c-accent);}
.rf-login-btn{font-weight:600;}
.rf-admin-btn{font-weight:600;font-size:13px;}
.rf-acct-chip{display:inline-flex;align-items:center;gap:8px;padding:5px 8px 5px 12px;border-radius:11px;background:rgba(255,255,255,0.05);border:1px solid var(--c-border);}
.rf-acct-name{font-family:'Chakra Petch';font-weight:600;font-size:13.5px;color:var(--c-text);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.rf-acct-out{display:grid;place-items:center;width:22px;height:22px;border-radius:7px;border:none;cursor:pointer;background:rgba(255,255,255,0.06);color:var(--c-muted);transition:background .15s,color .15s;}
.rf-acct-out:hover{background:rgba(255,92,114,0.18);color:var(--c-bad);}
.rf-main{position:relative;z-index:2;max-width:1080px;margin:0 auto;padding:8px 26px 90px;}
.rf-muted{color:var(--c-muted);}
.rf-sm{font-size:12.5px;}
.rf-pad{padding:30px 0;}

.rf-btn{display:inline-flex;align-items:center;gap:8px;border:none;cursor:pointer;
background:linear-gradient(135deg,var(--c-accent),#19b89f);color:#04110f;font-weight:600;
font-family:'Sora';font-size:14px;padding:11px 18px;border-radius:11px;
box-shadow:0 6px 22px rgba(25,232,219,0.28);transition:transform .25s var(--ease),box-shadow .25s var(--ease),filter .25s var(--ease);}
.rf-btn:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(25,232,219,0.42);filter:brightness(1.05);}
.rf-btn:active{transform:translateY(0);}
.rf-btn-lg{font-size:15.5px;padding:14px 26px;border-radius:13px;}
.rf-ghost{display:inline-flex;align-items:center;gap:6px;background:var(--c-panel);border:1px solid var(--c-border);
color:var(--c-text);font-family:'Sora';font-size:13.5px;padding:9px 15px;border-radius:10px;cursor:pointer;transition:.18s;}
.rf-ghost:hover{background:var(--c-panel-2);border-color:rgba(25,232,219,0.45);transform:translateY(-1px);box-shadow:0 6px 18px -8px rgba(25,232,219,0.5);}
.rf-icon-btn{background:transparent;border:none;color:var(--c-muted);cursor:pointer;padding:6px;border-radius:8px;transition:.15s;display:grid;place-items:center;}
.rf-icon-btn:hover{color:var(--c-bad);background:rgba(255,92,114,0.1);}

.rf-eyebrow{display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono';font-size:11px;
letter-spacing:2px;color:var(--c-accent);margin-bottom:12px;}
h1{font-family:'Chakra Petch';font-weight:700;font-size:clamp(30px,5vw,46px);line-height:1.08;margin:0 0 16px;letter-spacing:-0.5px;}
h2{font-family:'Chakra Petch';font-weight:600;font-size:25px;margin:0;letter-spacing:0.3px;}
h3{font-family:'Chakra Petch';font-weight:600;font-size:18px;margin:0 0 6px;}

/* HERO */
.rf-hero{padding:34px 0 14px;}
.rf-hero-flash{position:relative;}
.rf-hero-flash::before{content:"";position:absolute;left:-10%;top:-40px;width:120%;height:340px;z-index:-1;pointer-events:none;background:radial-gradient(620px 300px at 28% 30%,rgba(25,232,219,0.16),transparent 70%),radial-gradient(520px 260px at 75% 10%,rgba(124,92,255,0.16),transparent 70%);filter:blur(6px);animation:rfBreathe 6s ease-in-out infinite;}
.rf-hero-flash{position:relative;display:flex;align-items:center;gap:24px;}
.rf-hero-text{flex:1;min-width:0;}
.rf-forge-art{flex-shrink:0;width:min(40vw,420px);max-width:420px;align-self:center;}
.rf-forge-art svg{width:100%;height:auto;display:block;overflow:visible;}
@media (max-width:860px){.rf-forge-art{display:none;}}
.fa-core,.fa-piece,.fa-coreglow,.fa-ring,.fa-ring2,.fa-flash,.fa-pc,.fa-blades,.fa-sparks,.fa-ingot{transform-box:fill-box;transform-origin:center;}
.fa-coreglow{animation:faPulse 5s ease-in-out infinite;}
@keyframes faPulse{0%,100%{opacity:0.6;transform:scale(0.95);}50%{opacity:0.95;transform:scale(1.08);}}
.fa-ring{animation:faSpin 30s linear infinite;}
.fa-ring2{animation:faSpin 22s linear infinite reverse;}
@keyframes faSpin{to{transform:rotate(360deg);}}
/* the forge plays through ONCE on load, then the finished PC just stays */
.fa-flash{opacity:0;animation:faBurst 3.6s ease-out 1 both;}
@keyframes faBurst{0%,55%{opacity:0;transform:scale(0.25);}64%{opacity:1;transform:scale(1.15);}88%{opacity:0;transform:scale(1.6);}100%{opacity:0;transform:scale(1.6);}}
/* the glowing ingot, consumed at the moment of the strike */
.fa-ingot{animation:faIngot 3.6s ease-in-out 1 both;}
@keyframes faIngot{0%,42%{opacity:0.9;transform:scale(1);}60%{opacity:1;transform:scale(1.12);}70%,100%{opacity:0;transform:scale(0.6);}}
/* sparks fly outward on impact */
.fa-sparks{opacity:0;transform-origin:200px 190px;animation:faSparks 3.6s ease-out 1 both;}
@keyframes faSparks{0%,55%{opacity:0;transform:scale(0.15);}63%{opacity:1;transform:scale(0.6);}78%{opacity:0.7;transform:scale(1.15);}96%,100%{opacity:0;transform:scale(1.4);}}
/* the pickaxe winds up, strikes, recoils, then disappears for good */
.fa-pick{transform-box:view-box;transform-origin:252px 96px;animation:faSwing 3.6s 1 both;}
@keyframes faSwing{
  0%{transform:rotate(-50deg);opacity:1;animation-timing-function:cubic-bezier(.4,0,.2,1);}
  38%{transform:rotate(-62deg);opacity:1;animation-timing-function:cubic-bezier(.7,0,.95,.3);}
  60%{transform:rotate(7deg);opacity:1;animation-timing-function:cubic-bezier(.2,0,.3,1);}
  68%{transform:rotate(-6deg);opacity:1;animation-timing-function:cubic-bezier(.3,0,.4,1);}
  82%,100%{transform:rotate(-44deg);opacity:0;}
}
/* the fish-tank PC is forged into being at the strike, grows a touch, then just stays */
.fa-pc{opacity:0;animation:faAssemble 3.6s 1 both;}
@keyframes faAssemble{
  0%,55%{opacity:0;transform:scale(0.5);animation-timing-function:cubic-bezier(.34,1.56,.64,1);}
  74%{opacity:1;transform:scale(1.08);animation-timing-function:cubic-bezier(.4,0,.6,1);}
  84%{opacity:1;transform:scale(1);animation-timing-function:cubic-bezier(.35,0,.4,1);}
  100%{opacity:1;transform:scale(1.06);}
}
.fa-caseglow{animation:faCaseGlow 2.4s ease-in-out infinite;}
@keyframes faCaseGlow{0%,100%{stroke:#19e8db;stroke-opacity:0.25;}50%{stroke:#7c5cff;stroke-opacity:0.55;}}
.fa-blades{animation:faSpin 2.2s linear infinite;}
.fa-fan2 .fa-blades{animation-duration:1.5s;}
.fa-fan3 .fa-blades{animation-duration:1.9s;}
.fa-rgb{animation:faRgbPulse 3s ease-in-out infinite;}
@keyframes faRgbPulse{0%,100%{opacity:0.55;}50%{opacity:1;}}
.fa-bubble{animation:faBubble 2.6s ease-in infinite;}
.fa-b2{animation-delay:.9s;}.fa-b3{animation-delay:1.7s;}
@keyframes faBubble{0%{transform:translateY(0);opacity:0;}15%{opacity:0.9;}85%{opacity:0.9;}100%{transform:translateY(-70px);opacity:0;}}
@media (prefers-reduced-motion:reduce){.fa-coreglow,.fa-ring,.fa-ring2,.fa-flash,.fa-pc,.fa-blades,.fa-caseglow,.fa-rgb,.fa-bubble,.fa-pick,.fa-sparks,.fa-ingot{animation:none;}.fa-pc{opacity:1;}.fa-sparks,.fa-ingot{opacity:0;}.fa-pick{transform:rotate(-50deg);transform-box:view-box;transform-origin:252px 96px;}}
.rf-hero-title{font-size:clamp(34px,6vw,60px);line-height:1.04;letter-spacing:-0.01em;margin:6px 0 16px;font-family:'Chakra Petch';font-weight:700;}
.rf-hero-grad{background:linear-gradient(100deg,var(--c-accent) 0%,#7ad8ff 40%,var(--c-accent2) 80%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;background-size:220% auto;animation:rfShine 6s linear infinite,rfTitleGlow 4.5s ease-in-out infinite;}
@keyframes rfShine{to{background-position:220% center;}}
@keyframes rfTitleGlow{0%,100%{filter:drop-shadow(0 0 14px rgba(25,232,219,0.3));}50%{filter:drop-shadow(0 0 26px rgba(124,92,255,0.55));}}
/* ===== flashy treatment shared across the other pages ===== */
.rf-step-head h2,.rf-results-head h2{background:linear-gradient(100deg,var(--c-accent) 0%,#7ad8ff 45%,var(--c-accent2) 85%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;background-size:220% auto;animation:rfShine 6s linear infinite,rfTitleGlow 4.5s ease-in-out infinite;}
.pm-mtitle{animation:rfTitleGlow 4.5s ease-in-out infinite;}
.pm-mtitle .rf-accent{background:linear-gradient(100deg,var(--c-accent) 0%,#7ad8ff 45%,var(--c-accent2) 85%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;background-size:220% auto;animation:rfShine 6s linear infinite;}
.rf-step,.pm-menu,.rf-results-head{position:relative;}
.rf-step::before{content:"";position:absolute;left:50%;top:-20px;transform:translateX(-50%);width:120%;max-width:760px;height:300px;z-index:-1;pointer-events:none;background:radial-gradient(500px 240px at 50% 18%,rgba(25,232,219,0.13),transparent 70%),radial-gradient(440px 220px at 72% 0%,rgba(124,92,255,0.13),transparent 70%);filter:blur(8px);animation:rfBreathe 6s ease-in-out infinite;}
.pm-menu::before{content:"";position:absolute;left:50%;top:-6px;transform:translateX(-50%);width:120%;max-width:680px;height:260px;z-index:-1;pointer-events:none;background:radial-gradient(440px 220px at 50% 18%,rgba(124,92,255,0.15),transparent 70%),radial-gradient(380px 200px at 34% 0%,rgba(25,232,219,0.12),transparent 70%);filter:blur(8px);animation:rfBreathe 6.5s ease-in-out infinite;}
.rf-results-head::before{content:"";position:absolute;left:-6%;top:-18px;width:60%;height:120px;z-index:-1;pointer-events:none;background:radial-gradient(360px 150px at 20% 40%,rgba(25,232,219,0.12),transparent 72%);filter:blur(6px);animation:rfBreathe 6s ease-in-out infinite;}
.rf-budget-display{text-shadow:0 0 30px rgba(25,232,219,0.45);}
.rf-uc-card,.pm-mode{transition:border-color .2s,transform .2s,box-shadow .2s;}
.rf-uc-card:hover,.pm-mode:hover{transform:translateY(-3px);border-color:rgba(25,232,219,0.5);box-shadow:0 0 0 1px rgba(25,232,219,0.25),0 12px 34px -10px rgba(25,232,219,0.45);}
.rf-uc-card.sel{box-shadow:0 0 0 1px rgba(25,232,219,0.5),0 0 30px -8px rgba(25,232,219,0.5);}
@media (prefers-reduced-motion:reduce){.rf-step-head h2,.rf-results-head h2,.pm-mtitle,.pm-mtitle .rf-accent,.rf-step::before,.pm-menu::before,.rf-results-head::before{animation:none;}}
.rf-hero-sub{max-width:560px;font-size:15px;line-height:1.6;margin:0 0 26px;}
.rf-cta-grid{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:6px;}
.rf-cta-card{display:flex;flex-direction:column;align-items:flex-start;gap:10px;flex:1;min-width:240px;max-width:340px;padding:16px;border-radius:16px;background:rgba(255,255,255,0.03);border:1px solid var(--c-border);backdrop-filter:blur(8px);transition:border-color .2s,transform .2s;}
.rf-cta-card:hover{border-color:rgba(25,232,219,0.5);transform:translateY(-2px);}
.rf-cta-card:first-child{box-shadow:0 0 0 1px rgba(25,232,219,0.15),0 0 30px -8px rgba(25,232,219,0.4);animation:rfCtaGlow 4.5s ease-in-out infinite;}
@keyframes rfCtaGlow{0%,100%{box-shadow:0 0 0 1px rgba(25,232,219,0.12),0 0 24px -10px rgba(25,232,219,0.35);}50%{box-shadow:0 0 0 1px rgba(25,232,219,0.3),0 0 40px -6px rgba(25,232,219,0.6);}}
.rf-cta-card .rf-btn-lg{width:100%;justify-content:center;}
.rf-cta-desc{font-size:13px;line-height:1.5;color:var(--c-muted);}
.rf-price-status{display:flex;align-items:center;gap:8px;margin-top:16px;font-size:12px;color:var(--c-muted);font-family:'JetBrains Mono';letter-spacing:0.3px;flex-wrap:wrap;}
.rf-db-count{display:inline-flex;align-items:center;gap:6px;color:var(--c-accent);}
.rf-dot-sep{opacity:0.5;}
.rf-live-dot{width:9px;height:9px;border-radius:50%;background:#22c55e;flex-shrink:0;animation:rfPulseDot 2.6s ease-in-out infinite;}
.rf-live-ind{animation:rfBreathe 2.8s ease-in-out infinite;}
@keyframes rfPulseDot{0%,100%{transform:scale(0.9);box-shadow:0 0 5px 1px rgba(34,197,94,.55)}50%{transform:scale(1.32);box-shadow:0 0 15px 5px rgba(34,197,94,.4)}}
@keyframes rfBreathe{0%,100%{opacity:1}50%{opacity:0.76}}
.rf-section-head{display:flex;align-items:baseline;justify-content:space-between;margin:38px 0 16px;border-top:1px solid var(--c-border);padding-top:24px;}
.rf-empty{display:flex;flex-direction:column;align-items:center;gap:12px;padding:46px;border:1px dashed var(--c-border);border-radius:16px;text-align:center;}

/* SAVED */
.rf-saved-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:16px;}
.rf-saved-card{background:var(--c-panel);border:1px solid var(--c-border);border-radius:16px;padding:20px;cursor:pointer;transition:transform .2s,border-color .2s,background .2s,box-shadow .2s;}
.rf-saved-card:hover{transform:translateY(-3px);border-color:rgba(25,232,219,0.45);box-shadow:0 0 0 1px rgba(25,232,219,0.2),0 14px 36px -12px rgba(25,232,219,0.45);}
.rf-saved-card:hover{transform:translateY(-2px);border-color:rgba(25,232,219,0.4);background:var(--c-panel-2);}
.rf-saved-parts{margin-top:15px;padding-top:14px;border-top:1px solid var(--c-border);display:flex;flex-direction:column;gap:6px;}
.rf-saved-part{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-size:12.5px;}
.rf-saved-part-cat{color:var(--c-muted);font-family:'JetBrains Mono';font-size:10px;letter-spacing:0.5px;text-transform:uppercase;flex-shrink:0;}
.rf-saved-part-name{color:var(--c-text);text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.rf-saved-top{display:flex;align-items:center;justify-content:space-between;}
.rf-saved-uc{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--c-accent);font-family:'JetBrains Mono';letter-spacing:0.5px;}
.rf-saved-name{font-family:'Chakra Petch';font-weight:600;font-size:18px;margin:10px 0 14px;}
.rf-saved-scores{display:flex;align-items:center;gap:18px;}
.rf-mini-score{display:flex;flex-direction:column;}
.rf-mini-num{font-family:'JetBrains Mono';font-weight:700;font-size:22px;line-height:1;}
.rf-mini-lbl{font-size:10px;color:var(--c-muted);letter-spacing:1px;margin-top:2px;}
.rf-saved-price{margin-left:auto;font-family:'JetBrains Mono';font-weight:700;font-size:16px;}
.rf-incompat{display:flex;align-items:center;gap:6px;color:var(--c-bad);font-size:12px;margin-top:12px;}

/* STEPS */
.rf-step{max-width:760px;margin:0 auto;}
.rf-step-head{text-align:center;padding:26px 0 30px;}
.rf-step-head p{margin:10px auto 0;max-width:480px;font-size:14.5px;}
.rf-step-head .rf-eyebrow{justify-content:center;display:flex;}
.rf-uc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;}
.rf-uc-card{position:relative;text-align:left;background:var(--c-panel);border:1px solid var(--c-border);border-radius:16px;
padding:22px;cursor:pointer;transition:transform .2s,border-color .2s,background .2s;color:var(--c-text);overflow:hidden;}
.rf-uc-card:hover{transform:translateY(-2px);border-color:rgba(25,232,219,0.45);background:var(--c-panel-2);}
.rf-uc-icon{width:48px;height:48px;border-radius:13px;display:grid;place-items:center;color:var(--c-accent);
background:rgba(25,232,219,0.1);border:1px solid rgba(25,232,219,0.2);margin-bottom:14px;}
.rf-uc-label{font-family:'Chakra Petch';font-weight:600;font-size:17px;}
.rf-uc-tag{color:var(--c-muted);font-size:13px;margin-top:3px;}
.rf-uc-check{position:absolute;top:18px;right:18px;width:22px;height:22px;border-radius:50%;border:1.5px solid var(--c-border);display:grid;place-items:center;color:#04140f;background:transparent;transition:.18s var(--ease-spring);}
.rf-uc-check.on{background:var(--c-accent);border-color:var(--c-accent);box-shadow:0 0 14px rgba(25,232,219,0.5);}
.rf-uc-card.sel{border-color:var(--c-accent);background:rgba(25,232,219,0.08);box-shadow:0 0 0 1px var(--c-accent) inset;}
.rf-step-foot{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:26px;flex-wrap:wrap;}
.rf-btn:disabled{opacity:0.45;cursor:not-allowed;}

/* BUDGET */
.rf-budget-display{font-family:'JetBrains Mono';font-weight:700;font-size:58px;text-align:center;
color:var(--c-accent);text-shadow:0 0 30px rgba(25,232,219,0.4);letter-spacing:-1px;}
.rf-slider-wrap{max-width:560px;margin:22px auto 0;}
.rf-slider{-webkit-appearance:none;appearance:none;width:100%;height:8px;border-radius:6px;outline:none;cursor:pointer;}
.rf-slider::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;
background:var(--c-accent);border:3px solid #04110f;box-shadow:0 0 16px rgba(25,232,219,0.8);cursor:grab;transition:transform .15s;}
.rf-slider::-webkit-slider-thumb:hover{transform:scale(1.08);}
.rf-slider::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:var(--c-accent);border:3px solid #04110f;box-shadow:0 0 16px rgba(25,232,219,0.8);cursor:grab;}
.rf-slider-ends{display:flex;justify-content:space-between;margin-top:9px;font-size:12px;color:var(--c-muted);font-family:'JetBrains Mono';}
.rf-presets{display:flex;gap:9px;justify-content:center;margin:22px 0;flex-wrap:wrap;}
.rf-preset{background:var(--c-panel);border:1px solid var(--c-border);color:var(--c-text);font-family:'JetBrains Mono';
font-size:13px;padding:8px 16px;border-radius:9px;cursor:pointer;transition:.16s;}
.rf-preset:hover{border-color:rgba(25,232,219,0.4);}
.rf-preset.active{background:rgba(25,232,219,0.15);border-color:var(--c-accent);color:var(--c-accent);}

.rf-alloc{max-width:560px;margin:24px auto 0;background:var(--c-panel);border:1px solid var(--c-border);border-radius:15px;padding:18px 20px;}
.rf-alloc-title{font-family:'Chakra Petch';font-size:14px;margin-bottom:14px;color:var(--c-muted);}
.rf-alloc-row{display:grid;grid-template-columns:96px 1fr 60px;align-items:center;gap:12px;margin-bottom:9px;}
.rf-alloc-lbl{font-size:12.5px;color:var(--c-muted);}
.rf-alloc-track{height:7px;background:var(--c-track);border-radius:5px;overflow:hidden;}
.rf-alloc-fill{height:100%;border-radius:5px;background:linear-gradient(90deg,var(--c-accent),var(--c-accent2));transition:width .7s var(--ease);}
.rf-alloc-val{font-family:'JetBrains Mono';font-size:12.5px;text-align:right;}
.rf-step-actions{display:flex;justify-content:space-between;align-items:center;max-width:560px;margin:30px auto 0;}

/* RESULTS */
.rf-results-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin:18px 0 18px;flex-wrap:wrap;}
.rf-results-actions{display:flex;gap:10px;}
.rf-scorecard{display:grid;grid-template-columns:auto 1fr;gap:32px;align-items:center;
background:var(--c-panel);border:1px solid var(--c-border);border-radius:20px;padding:30px;margin-bottom:18px;}
.rf-gauges{display:flex;gap:20px;}
.rf-gauge{position:relative;display:grid;place-items:center;}
.rf-gauge svg{transform:rotate(0);}
.rf-gauge-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.rf-gauge-num{font-family:'JetBrains Mono';font-weight:700;font-size:34px;line-height:1;text-shadow:0 0 18px currentColor;}
.rf-gauge-label{font-size:9.5px;letter-spacing:1.8px;color:var(--c-muted);margin-top:5px;}
.rf-verdict-tag{display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono';font-size:11px;letter-spacing:1px;color:var(--c-accent2);margin-bottom:9px;}
.rf-hybrid{font-size:9px;background:rgba(124,92,255,0.16);border:1px solid rgba(124,92,255,0.3);color:var(--c-accent2);padding:1px 6px;border-radius:20px;letter-spacing:1px;}
.rf-verdict p{margin:0 0 16px;font-size:15px;line-height:1.66;color:var(--c-text);}
.rf-verdict-busy{opacity:.62;transition:opacity .4s var(--ease);}
.rf-forge-btn.rf-verdict-btn{display:flex;width:fit-content;margin:2px 0 14px auto;padding:6px 12px;font-family:'Chakra Petch';font-weight:600;font-size:12px;border-radius:9px;}
.rf-total-row{display:flex;align-items:center;gap:12px;font-size:13px;}
.rf-total{font-family:'JetBrains Mono';font-weight:700;font-size:18px;}
.rf-total.over{color:var(--c-bad);}
.rf-budget-bar{flex:1;height:7px;background:var(--c-track);border-radius:5px;overflow:hidden;min-width:80px;}
.rf-budget-fill{height:100%;border-radius:5px;transition:width .8s var(--ease);}

.rf-compat{display:flex;gap:12px;align-items:flex-start;border-radius:14px;padding:15px 18px;margin-bottom:18px;font-size:14px;}
.rf-compat.ok{background:rgba(70,224,160,0.08);border:1px solid rgba(70,224,160,0.28);color:var(--c-good);}
.rf-compat.bad{background:rgba(255,92,114,0.08);border:1px solid rgba(255,92,114,0.3);color:var(--c-bad);}
.rf-compat ul{margin:8px 0 0;padding-left:18px;color:var(--c-bad);font-size:13px;line-height:1.7;}
.rf-compat strong{font-family:'Chakra Petch';font-weight:600;}

.rf-parts{display:flex;flex-direction:column;gap:12px;}
.rf-part{background:var(--c-panel);border:1px solid var(--c-border);border-radius:16px;overflow:hidden;transition:border-color .2s,transform .2s,box-shadow .2s;}
.rf-part:hover{border-color:var(--c-hover);transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,0.22);}
.rf-part-top{display:flex;align-items:center;gap:14px;padding:16px 18px 0;}
.rf-part-actions{display:flex;gap:8px;justify-content:flex-end;padding:13px 18px 16px;}
.rf-part-icon{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;color:var(--c-accent);background:rgba(25,232,219,0.08);border:1px solid rgba(25,232,219,0.16);flex-shrink:0;}
.rf-part-media{display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0;}
.rf-part-src{font-size:9px;letter-spacing:0.6px;text-transform:uppercase;font-family:'JetBrains Mono';line-height:1;color:var(--c-muted);}
.rf-part-src.amazon{color:var(--c-warn);}
.rf-part-src.newegg{color:var(--c-accent2);}
.rf-part-src.bestbuy{color:var(--c-accent);}
.rf-part-img-link{flex-shrink:0;display:block;}
.rf-part-img{width:42px;height:42px;border-radius:11px;object-fit:contain;background:#fff;border:1px solid var(--c-border);padding:2px;cursor:pointer;transition:transform .12s ease;}
.rf-part-img:hover{transform:scale(1.03);}
.rf-pick-img-link{flex-shrink:0;display:block;}
.rf-pick-img{width:34px;height:34px;border-radius:8px;object-fit:contain;background:#fff;border:1px solid var(--c-border);padding:2px;cursor:pointer;transition:transform .12s ease;}
.rf-pick-img.sm{width:28px;height:28px;border-radius:7px;}
.rf-pick-img:hover{transform:scale(1.04);}
.rf-part-info{flex:1;min-width:0;}
.rf-part-cat{font-size:11px;letter-spacing:1px;color:var(--c-muted);text-transform:uppercase;font-family:'JetBrains Mono';}
.rf-part-name{font-family:'Chakra Petch';font-weight:600;font-size:16px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.rf-part-price-col{text-align:right;flex-shrink:0;}
.rf-part-price{font-family:'JetBrains Mono';font-weight:700;font-size:16px;}
.rf-oos-price{color:var(--c-muted);font-weight:600;font-size:13px;}
.rf-part-price.within{color:var(--c-text);}
.rf-part-price.tight{color:var(--c-warn);}
.rf-part-price.over{color:var(--c-bad);}
.rf-flag{font-size:9px;font-family:'JetBrains Mono';letter-spacing:1px;margin-top:3px;padding:1px 5px;border-radius:4px;display:inline-block;}
.rf-flag.over{color:var(--c-bad);background:rgba(255,92,114,0.14);border:1px solid rgba(255,92,114,0.35);}
.rf-flag.tight{color:var(--c-warn);background:rgba(255,194,75,0.12);}
.rf-part-score{width:40px;height:40px;border-radius:11px;border:2px solid;display:grid;place-items:center;font-family:'JetBrains Mono';font-weight:700;font-size:16px;flex-shrink:0;}
.rf-part-btns{display:flex;gap:7px;flex-shrink:0;}
.rf-chip-btn{display:inline-flex;align-items:center;gap:5px;background:var(--c-panel-2);border:1px solid var(--c-border);color:var(--c-text);
font-family:'Sora';font-size:12.5px;padding:7px 12px;border-radius:9px;cursor:pointer;transition:.16s;}
.rf-chip-btn:hover{border-color:var(--c-hover);}
.rf-chip-btn.primary{color:var(--c-accent);border-color:rgba(25,232,219,0.3);}
.rf-chip-btn.oos{background:var(--c-panel);color:var(--c-muted);border-color:var(--c-border);cursor:not-allowed;opacity:.7;}
.rf-chip-btn.primary:hover{background:rgba(25,232,219,0.1);}

.rf-info{padding:14px 16px 16px 72px;border-top:1px solid var(--c-border);}
.rf-ask-part-btn{margin-top:14px;display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:10px;cursor:pointer;
  font-family:'Chakra Petch';font-weight:600;font-size:12px;letter-spacing:0.4px;color:var(--c-accent);
  background:rgba(25,232,219,0.08);border:1px solid rgba(25,232,219,0.28);transition:background .15s ease,transform .12s ease,box-shadow .15s ease;}
.rf-ask-part-btn:hover{background:rgba(25,232,219,0.15);transform:translateY(-1px);box-shadow:0 6px 18px rgba(25,232,219,0.18);}
.rf-ask-part-btn:active{transform:translateY(0);}
.rf-ask-inline{margin-top:14px;display:flex;flex-direction:column;gap:10px;}
.rf-ask-row{display:flex;gap:8px;align-items:center;}
.rf-ask-input{flex:1;min-width:0;background:rgba(255,255,255,0.03);border:1px solid var(--c-border);border-radius:10px;padding:9px 12px;color:var(--c-text);font-family:'Sora';font-size:13px;outline:none;transition:border-color .15s ease,box-shadow .15s ease;}
.rf-ask-input:focus{border-color:var(--c-accent);}
.rf-ask-send{flex-shrink:0;display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:10px;cursor:pointer;font-family:'Chakra Petch';font-weight:600;font-size:12px;letter-spacing:0.4px;color:#04201e;background:var(--c-accent);border:1px solid var(--c-accent);transition:transform .12s ease,box-shadow .15s ease,opacity .15s ease;}
.rf-ask-send:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 18px rgba(25,232,219,0.3);}
.rf-ask-send:disabled{opacity:0.45;cursor:not-allowed;}
.rf-ask-thread{display:flex;flex-direction:column;gap:8px;}
.rf-ask-msg{max-width:92%;border-radius:12px;padding:10px 13px;color:var(--c-text);font-family:'Sora';font-size:13px;line-height:1.6;white-space:pre-wrap;}
.rf-ask-msg.user{align-self:flex-end;background:rgba(25,232,219,0.10);border:1px solid rgba(25,232,219,0.28);}
.rf-ask-msg.assistant{align-self:flex-start;background:rgba(124,92,255,0.06);border:1px solid rgba(124,92,255,0.22);}
.rf-ask-think{color:var(--c-muted);font-style:italic;}
.rf-ask-err{border-color:rgba(255,90,90,0.4)!important;background:rgba(255,90,90,0.08)!important;color:var(--c-bad);}
/* ---- Offline banner ---- */
.rf-offline-banner{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;gap:10px;padding:9px 20px;
  background:rgba(220,30,50,0.93);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  font-family:'Chakra Petch',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.5px;color:#fff;
  box-shadow:0 4px 24px rgba(220,30,50,0.45);}
.rf-offline-dot{width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:0 0 8px #fff;animation:rprPulse 1.4s ease-in-out infinite;flex-shrink:0;}
.rf-offline-label{font-size:13px;font-weight:700;letter-spacing:1.5px;}
.rf-offline-sep{opacity:0.55;}
/* inline offline message in verdict / chat / part ask */
.rf-offline-msg{color:var(--c-bad);font-size:13px;font-style:italic;margin:4px 0;}
.rf-asst-offline{margin:8px 14px;padding:10px 13px;border-radius:10px;background:rgba(220,30,50,0.12);border:1px solid rgba(220,30,50,0.35);color:var(--c-bad);font-family:'Sora',sans-serif;font-size:13px;line-height:1.5;}
.rf-asst-input input:disabled{opacity:0.45;cursor:not-allowed;}
.rf-info-specs{margin-bottom:16px;}
.rf-pc-head{display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono';font-size:10px;letter-spacing:2px;color:var(--c-accent2);margin-bottom:11px;}
.rf-pc-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
.rf-pc-h{font-family:'JetBrains Mono';font-size:10px;letter-spacing:2px;margin-bottom:9px;}
.rf-pc-h.pros{color:var(--c-good);}
.rf-pc-h.cons{color:var(--c-bad);}
.rf-pc-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;}
.rf-pc{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;line-height:1.45;color:var(--c-text);}
.rf-pc svg{flex-shrink:0;margin-top:2px;}
.rf-pc.pro svg{color:var(--c-good);}
.rf-pc.con svg{color:var(--c-bad);}
.rf-pc.con.strong{color:var(--c-bad);font-weight:600;}
.rf-info-h{font-family:'JetBrains Mono';font-size:10px;letter-spacing:2px;color:var(--c-muted);margin-bottom:9px;}
.rf-info-facts{display:flex;flex-wrap:wrap;gap:6px;}
.rf-fact{font-size:12px;background:var(--c-panel-2);border:1px solid var(--c-border);padding:4px 9px;border-radius:7px;color:var(--c-text);font-family:'JetBrains Mono';}
.rf-foryou{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px;}
.rf-fy{display:flex;gap:7px;align-items:flex-start;font-size:12.5px;line-height:1.45;}
.rf-fy svg{flex-shrink:0;margin-top:2px;}
.rf-fy.good{color:var(--c-good);}
.rf-fy.bad{color:var(--c-bad);}
.rf-fy.warn{color:var(--c-warn);}

/* DRAWER */
.rf-drawer-wrap{position:fixed;inset:0;z-index:40;background:rgba(2,4,8,0.66);backdrop-filter:blur(4px);display:flex;justify-content:flex-end;animation:rfFade .28s var(--ease);}
.rf-drawer{width:min(460px,100%);height:100%;background:rgba(11,15,22,0.72);border-left:1px solid var(--c-border);
display:flex;flex-direction:column;animation:rfSlideR .42s var(--ease);will-change:transform,opacity;}
.rf-drawer-head{display:flex;align-items:flex-start;justify-content:space-between;padding:20px;border-bottom:1px solid var(--c-border);}
.rf-drawer-list{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:9px;}
.rf-drawer-search{display:flex;align-items:center;gap:9px;margin:10px 16px 2px;padding:8px 2px;background:transparent;border:none;border-bottom:1px solid var(--c-border);border-radius:0;color:var(--c-muted);transition:border-color .16s,color .16s;}
.rf-drawer-search:focus-within{border-bottom-color:var(--c-accent);color:var(--c-accent);box-shadow:none;}
.rf-drawer-search input{flex:1;background:transparent;border:none;outline:none;color:var(--c-text);font-family:'Sora';font-size:14px;}
.rf-drawer-search input::placeholder{color:var(--c-muted);}
.rf-search-clear{background:transparent;border:none;color:var(--c-muted);cursor:pointer;display:grid;place-items:center;padding:2px;border-radius:6px;transition:.15s;}
.rf-search-clear:hover{color:var(--c-text);background:var(--c-panel-2);}
.rf-pick-empty{text-align:center;color:var(--c-muted);font-size:13.5px;padding:34px 12px;}
.rf-pick{display:flex;flex-direction:column;background:var(--c-panel);border:1px solid var(--c-border);
border-radius:12px;padding:12px;color:var(--c-text);transition:border-color .16s,background .16s;}
.rf-pick:hover{border-color:rgba(25,232,219,0.3);}
.rf-pick.current{border-color:rgba(25,232,219,0.5);background:rgba(25,232,219,0.06);}
.rf-pick.over{opacity:.6;}
.rf-pick.over:hover{opacity:1;}
.rf-pick-divider{display:flex;align-items:center;gap:10px;margin:8px 2px 2px;font-family:'JetBrains Mono';font-size:9.5px;letter-spacing:1.5px;text-transform:uppercase;color:var(--c-muted);}
.rf-pick-divider span{flex:0 0 auto;}
.rf-pick-divider::before,.rf-pick-divider::after{content:'';flex:1;height:1px;background:var(--c-border);}
.rf-pick-row{display:flex;align-items:center;gap:13px;}
.rf-pick-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:11px;}
.rf-clickable{cursor:pointer;}
.rf-variant-count{font-size:9px;background:rgba(124,92,255,0.16);border:1px solid rgba(124,92,255,0.3);color:var(--c-accent2);
padding:1px 7px;border-radius:20px;font-family:'JetBrains Mono';letter-spacing:0.5px;margin-left:8px;vertical-align:middle;}
.rf-variants{margin-top:11px;padding-top:11px;border-top:1px dashed var(--c-border);display:flex;flex-direction:column;gap:9px;}
.rf-variant{background:var(--c-panel);border:1px solid var(--c-border);border-radius:10px;padding:10px;}
.rf-variant.current{border-color:rgba(25,232,219,0.5);background:rgba(25,232,219,0.06);}
.rf-variant-row{display:flex;align-items:center;gap:11px;}
.rf-pick-score.sm{width:32px;height:32px;border-radius:9px;font-size:13px;}
.rf-variant-name{flex:1;font-family:'Chakra Petch';font-weight:600;font-size:13.5px;min-width:0;}
.rf-variant-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.rf-info.compact{padding:12px 2px 2px;}
.rf-info.compact .rf-info-specs{margin-bottom:12px;}
.rf-info.compact .rf-pc-grid{grid-template-columns:1fr;gap:14px;}
.rf-pick-score{width:38px;height:38px;border-radius:10px;border:2px solid;display:grid;place-items:center;font-family:'JetBrains Mono';font-weight:700;font-size:15px;flex-shrink:0;}
.rf-pick-info{flex:1;min-width:0;}
.rf-pick-name{font-family:'Chakra Petch';font-weight:600;font-size:14.5px;}
.rf-cur-tag{font-size:9px;background:rgba(25,232,219,0.15);color:var(--c-accent);padding:1px 6px;border-radius:10px;font-family:'JetBrains Mono';margin-left:6px;}
.rf-pick-facts{font-size:11.5px;color:var(--c-muted);font-family:'JetBrains Mono';margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.rf-pick-warn{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--c-warn);margin-top:4px;}
.rf-pick-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;}
.rf-compat-ok{color:var(--c-good);}
.rf-compat-bad{color:var(--c-bad);}

/* MODAL */
.rf-modal-wrap{position:fixed;inset:0;z-index:50;background:rgba(2,4,8,0.7);backdrop-filter:blur(4px);display:grid;place-items:center;animation:rfFade .28s var(--ease);padding:20px;}
.rf-modal{width:min(420px,100%);background:#0c1119;border:1px solid var(--c-border);border-radius:18px;padding:26px;animation:rfPop .52s var(--ease);will-change:transform,opacity;}
.rf-input{width:100%;background:var(--c-panel);border:1px solid var(--c-border);color:var(--c-text);font-family:'Sora';
font-size:15px;padding:12px 14px;border-radius:11px;margin:14px 0 18px;outline:none;transition:.16s;}
.rf-input:focus{border-color:var(--c-accent);box-shadow:0 0 0 3px rgba(25,232,219,0.12);}
.rf-modal-actions{display:flex;justify-content:flex-end;gap:10px;}

/* TOAST */
.rf-toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:60;display:flex;align-items:center;gap:8px;
background:#0d1620;border:1px solid rgba(70,224,160,0.4);color:var(--c-good);padding:12px 20px;border-radius:12px;
font-size:14px;box-shadow:0 10px 40px rgba(0,0,0,0.5);animation:rfToast .5s var(--ease);}

/* ANIMATIONS */
@keyframes rfFade{from{opacity:0;transform:translateY(12px) scale(0.995);}to{opacity:1;transform:translateY(0) scale(1);}}
@keyframes rfUp{from{opacity:0;transform:translateY(14px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes rfPop{from{opacity:0;transform:scale(.99) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes rfSlideR{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes rfSlideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@keyframes rfToast{from{opacity:0;transform:translateX(-50%) translateY(14px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.rf-fade{animation:rfFade .5s var(--ease-spring) both;}
.rf-pop{animation:rfUp .66s var(--ease-spring) backwards;will-change:transform,opacity;}
.rf-slidein{animation:rfSlideDown .28s cubic-bezier(.2,.8,.2,1);}
@media (prefers-reduced-motion:reduce){.rf-fade,.rf-pop{animation:rfFadeRM .3s ease both;}@keyframes rfFadeRM{from{opacity:0}to{opacity:1}}.rf-ghost:hover{transform:none;}}

/* FORGE MODE BUTTONS */
.rf-forge-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:24px auto 0;}
.rf-forge-btn{display:inline-flex;align-items:center;gap:7px;cursor:pointer;border-radius:10px;
padding:9px 16px;font-family:'Chakra Petch';font-weight:700;font-size:13px;letter-spacing:.3px;
transition:transform .16s,box-shadow .16s,filter .16s,background .16s,border-color .16s;}
.rf-forge-btn:active{transform:translateY(-1px) scale(.99);}
.rf-forge-btn.primary{border:none;background:linear-gradient(135deg,var(--c-accent),#19b89f);color:#04110f;
box-shadow:0 5px 16px rgba(25,232,219,0.26);}
.rf-forge-btn.primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(25,232,219,0.4);filter:brightness(1.05);}
.rf-forge-btn.outline{background:var(--c-panel);border:1.5px solid rgba(124,92,255,0.45);color:var(--c-text);}
.rf-forge-btn.outline svg{color:var(--c-accent2);}
.rf-forge-btn.outline:hover{transform:translateY(-1px);border-color:var(--c-accent2);background:var(--c-panel-2);box-shadow:0 8px 24px rgba(124,92,255,0.2);}
.rf-step-actions.center{justify-content:center;}
.rf-compat.warn{background:rgba(255,194,75,0.08);border:1px solid rgba(255,194,75,0.3);color:var(--c-warn);}
.rf-compat-sub{display:block;margin-top:5px;font-size:12.5px;color:var(--c-warn);}

/* AI ASSISTANT */
.rf-fab{position:fixed;bottom:22px;right:22px;z-index:44;display:inline-flex;align-items:center;gap:8px;
border:none;cursor:pointer;background:linear-gradient(135deg,var(--c-accent2),#5b3fd6);color:#fff;
font-family:'Chakra Petch';font-weight:700;font-size:14px;padding:12px 18px;border-radius:30px;
box-shadow:0 8px 28px rgba(124,92,255,0.45);transition:transform .18s,box-shadow .18s;}
.rf-fab:hover{transform:translateY(-2px);box-shadow:0 12px 34px rgba(124,92,255,0.6);}
.rf-assistant{position:fixed;top:0;right:0;height:100vh;width:min(390px,100%);z-index:46;
background:#0b0f16;border-left:1px solid var(--c-border);display:flex;flex-direction:column;
box-shadow:-12px 0 40px rgba(0,0,0,0.5);animation:rfSlideR .42s var(--ease);will-change:transform,opacity;}
.rf-asst-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--c-border);}
.rf-asst-title{display:flex;align-items:center;gap:10px;font-family:'Chakra Petch';font-weight:600;font-size:16px;}
.rf-asst-model{display:inline-block;font-family:'JetBrains Mono';font-weight:500;font-size:10.5px;letter-spacing:.3px;color:var(--c-accent);background:rgba(25,232,219,0.1);border:1px solid rgba(25,232,219,0.25);padding:1px 7px;border-radius:20px;margin-left:6px;vertical-align:middle;}
.rf-asst-avatar{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#fff;
background:linear-gradient(135deg,var(--c-accent2),#5b3fd6);flex-shrink:0;}
.rf-asst-avatar.sm{width:24px;height:24px;border-radius:7px;}
.rf-asst-avatar.big{width:46px;height:46px;border-radius:13px;margin:0 auto 6px;}
.rf-asst-list{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px;}
.rf-asst-welcome{text-align:center;color:var(--c-muted);margin:auto 0;}
.rf-asst-welcome p{font-size:13.5px;line-height:1.5;margin:0 0 16px;}
.rf-asst-suggest{display:flex;flex-direction:column;gap:8px;}
.rf-asst-chip{background:var(--c-panel);border:1px solid var(--c-border);color:var(--c-text);
font-family:'Sora';font-size:13px;padding:10px 14px;border-radius:10px;cursor:pointer;text-align:left;transition:.16s;}
.rf-asst-chip:hover{border-color:var(--c-accent2);background:var(--c-panel-2);}
.rf-msg{display:flex;gap:9px;align-items:flex-start;}
.rf-msg.user{justify-content:flex-end;}
.rf-bubble{max-width:80%;padding:11px 14px;border-radius:14px;font-size:13.5px;line-height:1.55;white-space:pre-wrap;word-wrap:break-word;}
.rf-msg.user .rf-bubble{background:linear-gradient(135deg,var(--c-accent2),#5b3fd6);color:#fff;border-bottom-right-radius:4px;}
.rf-msg.assistant .rf-bubble{background:var(--c-panel-2);border:1px solid var(--c-border);color:var(--c-text);border-bottom-left-radius:4px;}
.rf-typing{display:flex;gap:4px;align-items:center;}
.rf-typing span{width:6px;height:6px;border-radius:50%;background:var(--c-muted);animation:rfBlink 1.2s infinite;}
.rf-typing span:nth-child(2){animation-delay:.2s;}
.rf-typing span:nth-child(3){animation-delay:.4s;}
.rf-asst-error{color:var(--c-bad);font-size:13px;text-align:center;}
.rf-asst-input{display:flex;gap:9px;padding:14px;border-top:1px solid var(--c-border);}
.rf-asst-input input{flex:1;background:var(--c-panel);border:1px solid var(--c-border);color:var(--c-text);
font-family:'Sora';font-size:14px;padding:11px 14px;border-radius:11px;outline:none;transition:.16s;}
.rf-asst-input input:focus{border-color:var(--c-accent2);box-shadow:0 0 0 3px rgba(124,92,255,0.12);}
.rf-asst-send{border:none;cursor:pointer;background:linear-gradient(135deg,var(--c-accent2),#5b3fd6);color:#fff;
width:44px;border-radius:11px;display:grid;place-items:center;transition:.16s;}
.rf-asst-send:disabled{opacity:0.4;cursor:default;}
@keyframes rfBlink{0%,60%,100%{opacity:0.25}30%{opacity:1}}
.rf-cursor{display:inline-block;width:7px;height:14px;margin-left:2px;border-radius:1px;
background:var(--c-accent2);vertical-align:text-bottom;animation:rfCursor 1s steps(2,start) infinite;}
@keyframes rfCursor{0%,100%{opacity:1}50%{opacity:0}}

@media(max-width:680px){
.rf-fab{bottom:16px;right:16px;}
.rf-scorecard{grid-template-columns:1fr;}
.rf-gauges{justify-content:center;}
.rf-info{padding-left:16px;}
.rf-pc-grid{grid-template-columns:1fr;gap:16px;}
.rf-part-actions .rf-chip-btn{flex:1;justify-content:center;}
.rf-part-name{font-size:14px;}
}

/* ---------- POLISH: scrollbars, focus, smoothing, reduced-motion ---------- */
.rf-root *::-webkit-scrollbar{width:10px;height:10px;}
.rf-root *::-webkit-scrollbar-track{background:transparent;}
.rf-root *::-webkit-scrollbar-thumb{background:var(--c-border);border-radius:8px;border:2px solid transparent;background-clip:padding-box;}
.rf-root *::-webkit-scrollbar-thumb:hover{background:var(--c-hover);background-clip:padding-box;}
.rf-root{scrollbar-width:thin;scrollbar-color:var(--c-border) transparent;}

.rf-root :focus-visible{outline:2px solid var(--c-accent);outline-offset:2px;border-radius:8px;}
.rf-slider:focus-visible{outline:none;}

/* consistent, springy easing across interactive surfaces */
.rf-saved-card,.rf-uc-card,.rf-part,.rf-pick,.rf-variant{transition:transform .45s var(--ease),border-color .45s var(--ease),background .45s var(--ease),box-shadow .45s var(--ease),opacity .45s var(--ease);}
.rf-saved-card:hover,.rf-uc-card:hover{box-shadow:0 14px 32px rgba(0,0,0,0.28);}
.rf-part:hover{box-shadow:0 6px 20px rgba(0,0,0,0.18);}
.rf-chip-btn,.rf-ghost,.rf-preset,.rf-asst-chip,.rf-theme-opt,.rf-icon-btn{transition:transform .32s var(--ease),background .32s var(--ease),border-color .32s var(--ease),color .32s var(--ease),box-shadow .32s var(--ease);}
.rf-chip-btn:active,.rf-ghost:active,.rf-preset:active,.rf-asst-chip:active{transform:translateY(1px);}
.rf-fab:active{transform:translateY(0) scale(.97);}
.rf-asst-send:not(:disabled):hover{filter:brightness(1.08);transform:translateY(-1px);}
.rf-asst-send:not(:disabled):active{transform:translateY(0);}

/* crisper image rendering for product thumbnails */
.rf-part-img,.rf-pick-img{image-rendering:auto;}
.rf-part-img-link:focus-visible,.rf-pick-img-link:focus-visible{outline:2px solid var(--c-accent);outline-offset:2px;border-radius:11px;}

@media (prefers-reduced-motion: reduce){
  .rf-root *,.rf-root *::before,.rf-root *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important;}
}
/* ===== PC MOGGER ===== */
.rf-mogger-cta{margin-left:10px;background:linear-gradient(135deg,var(--c-accent),var(--c-accent2))!important;color:#04201e!important;border:none!important;}
.pm-mogger{max-width:820px;margin:0 auto;}
.pm-menu{text-align:center;padding-top:18px;}
.pm-mtitle{font-family:'Chakra Petch';font-weight:700;font-size:40px;letter-spacing:1px;}
.pm-tag{color:var(--c-muted);margin:8px 0 26px;}
.pm-mode-grid{display:flex;flex-direction:column;gap:13px;max-width:430px;margin:0 auto 22px;}
.pm-mode-grid-top{margin:0 auto 13px;}
.pm-extra-modes{display:flex;flex-direction:column;gap:13px;max-width:430px;margin:0 auto 22px;overflow:hidden;max-height:440px;opacity:1;transition:max-height .45s var(--ease),opacity .35s ease,margin .4s var(--ease);}
.pm-extra-modes.collapsed{max-height:0;opacity:0;margin-top:0;margin-bottom:0;pointer-events:none;}
.pm-seg button{transition:background .25s,border-color .25s,color .25s;}
.pm-mode{display:flex;flex-direction:column;align-items:flex-start;gap:3px;padding:18px 20px;border-radius:16px;cursor:pointer;text-align:left;color:var(--c-text);
  background:var(--c-panel);border:1px solid var(--c-border);backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 10px 30px rgba(0,0,0,0.3);transition:transform .15s,border-color .15s,box-shadow .15s;}
.pm-mode:hover{transform:translateY(-2px);border-color:var(--c-accent);box-shadow:inset 0 1px 0 rgba(255,255,255,0.12),0 14px 40px rgba(25,232,219,0.18);}
.pm-mode-icon{font-size:24px;color:var(--c-accent);}
.pm-mode-name{font-family:'Chakra Petch';font-weight:600;font-size:17px;}
.pm-mode-sub{color:var(--c-muted);font-size:13px;}
.pm-soon{opacity:0.82;}
.pm-exit{margin-top:6px;}
.pm-card{background:var(--c-panel);border:1px solid var(--c-border);border-radius:20px;padding:28px;max-width:560px;margin:10px auto;backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 12px 36px rgba(0,0,0,0.32);}
.pm-center{text-align:center;}
.pm-h2{font-family:'Chakra Petch';font-weight:600;font-size:23px;margin:0 0 14px;display:flex;align-items:center;gap:9px;}
.pm-center .pm-h2{justify-content:center;}
.pm-p{color:var(--c-muted);line-height:1.6;font-size:14px;margin:0 0 16px;}
.pm-row{display:flex;gap:12px;justify-content:space-between;margin-top:6px;}
.pm-center-row{justify-content:center;}
.pm-toggle{display:flex;align-items:center;gap:10px;font-size:14px;margin-bottom:16px;cursor:pointer;}
.pm-toggle input{width:18px;height:18px;accent-color:var(--c-accent);}
.pm-setup{display:flex;flex-direction:column;gap:18px;margin-bottom:18px;}
.pm-field-l{display:block;font-size:13px;color:var(--c-muted);margin-bottom:8px;font-family:'JetBrains Mono';}
.pm-chips{display:flex;flex-wrap:wrap;gap:8px;}
.pm-chip{padding:8px 12px;border-radius:10px;font-size:13px;cursor:pointer;background:rgba(255,255,255,0.04);border:1px solid var(--c-border);color:var(--c-text);}
.pm-chip.on{background:rgba(25,232,219,0.14);border-color:var(--c-accent);color:var(--c-accent);}
.pm-range{width:100%;accent-color:var(--c-accent);}
.pm-game-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.pm-vs{display:grid;grid-template-columns:1fr auto 1fr;align-items:stretch;gap:10px;margin-bottom:16px;}
.pm-board{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:16px 12px;border-radius:16px;background:var(--c-panel);border:1px solid var(--c-border);backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);box-shadow:inset 0 1px 0 rgba(255,255,255,0.08);}
.pm-board.you{border-color:rgba(25,232,219,0.35);}
.pm-board.opp{border-color:rgba(124,92,255,0.35);}
.pm-board-name{font-family:'Chakra Petch';font-weight:600;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;}
.pm-board.you .pm-board-name{color:var(--c-accent);}
.pm-board.opp .pm-board-name{color:var(--c-accent2);}
.pm-board-score{font-family:'JetBrains Mono';font-weight:700;font-size:40px;line-height:1;color:var(--c-accent);}
.pm-board-score.opp{color:var(--c-accent2);}
.pm-board-sub{font-family:'JetBrains Mono';font-size:11px;color:var(--c-muted);}
.pm-board-elo{font-family:'JetBrains Mono';font-size:11px;color:var(--c-warn);}
.pm-account{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;font-size:13px;}
.pm-acct-name{font-family:'Chakra Petch';font-weight:600;color:var(--c-text);}
.pm-acct-elo{font-family:'JetBrains Mono';color:var(--c-warn);}
.pm-acct-btn{background:rgba(255,255,255,0.05);border:1px solid var(--c-border);color:var(--c-muted);border-radius:999px;padding:5px 12px;font-size:12px;cursor:pointer;}
.pm-acct-btn:hover{color:var(--c-accent);border-color:var(--c-accent);}
.pm-auth{max-width:380px;}
.pm-modal-wrap{position:fixed;inset:0;z-index:130;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;padding:16px;}
.pm-modal-wrap .pm-auth{margin:0;width:100%;}
.pm-auth-tabs{display:flex;gap:8px;margin-bottom:16px;}
.pm-auth-tabs button{flex:1;padding:10px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid var(--c-border);color:var(--c-muted);font-family:'Chakra Petch';font-weight:600;cursor:pointer;}
.pm-auth-tabs button.on{background:rgba(25,232,219,0.12);border-color:var(--c-accent);color:var(--c-accent);}
.pm-seg{display:flex;gap:8px;margin:4px auto 8px;max-width:300px;}
.pm-seg button{flex:1;padding:9px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid var(--c-border);color:var(--c-muted);font-family:'Chakra Petch';font-weight:600;cursor:pointer;}
.pm-seg button.on{background:rgba(25,232,219,0.12);border-color:var(--c-accent);color:var(--c-accent);}
.pm-seg-note{font-size:13px;color:var(--c-muted);margin:0 0 14px;text-align:center;}
.pm-seg-disabled{opacity:0.45;cursor:not-allowed;filter:grayscale(0.6);}
.pm-unranked-tag{display:inline-block;margin:0 auto 16px;padding:5px 12px;border-radius:999px;font-family:'JetBrains Mono';font-size:11px;letter-spacing:0.4px;color:var(--c-muted);background:rgba(255,255,255,0.05);border:1px solid var(--c-border);}
.pm-save-row{display:flex;flex-direction:column;align-items:center;gap:10px;margin:6px auto 14px;}
.pm-save-label{font-size:13px;color:var(--c-muted);}
.pm-save-btns{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;}
.pm-save-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 14px;border-radius:11px;cursor:pointer;font-family:'Sora';font-weight:600;font-size:13px;color:var(--c-text);background:rgba(255,255,255,0.05);border:1px solid var(--c-border);transition:background .18s,border-color .18s,transform .18s;}
.pm-save-btn:hover{background:rgba(25,232,219,0.12);border-color:var(--c-accent);color:var(--c-accent);transform:translateY(-1px);}
.pm-save-btn.done{color:var(--c-good);border-color:rgba(70,224,160,0.5);background:rgba(70,224,160,0.1);cursor:default;}
.pm-ranked-prompt{display:flex;flex-direction:column;align-items:center;gap:12px;margin:4px auto 16px;padding:14px 16px;max-width:320px;border-radius:14px;background:rgba(124,92,255,0.08);border:1px solid rgba(124,92,255,0.3);}
.pm-ranked-prompt span{color:var(--c-text);font-size:13.5px;}
.rf-modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(2,4,8,0.72);backdrop-filter:blur(5px);display:grid;place-items:center;padding:20px;animation:rfFade .22s var(--ease);}
.rf-confirm{width:min(360px,100%);background:#0c1119;border:1px solid var(--c-border);border-radius:18px;padding:24px;text-align:center;animation:rfPop .4s var(--ease);}
.rf-confirm-title{font-family:'Chakra Petch';font-size:20px;font-weight:700;margin:0 0 8px;color:var(--c-text);}
.rf-confirm-msg{font-size:14px;color:var(--c-muted);margin:0 0 20px;}
.rf-confirm-btns{display:flex;gap:10px;justify-content:center;}
.rf-confirm-yes{flex:1;padding:11px 16px;border-radius:11px;border:none;cursor:pointer;font-family:'Sora';font-weight:600;font-size:14px;color:#fff;background:linear-gradient(135deg,#ff5c72,#e23a52);box-shadow:0 6px 20px rgba(226,58,82,0.35);transition:filter .18s,transform .18s;}
.rf-confirm-yes:hover{filter:brightness(1.08);transform:translateY(-1px);}
.rf-confirm-no{flex:1;padding:11px 16px;border-radius:11px;cursor:pointer;font-family:'Sora';font-weight:600;font-size:14px;color:var(--c-text);background:#161c26;border:1px solid var(--c-border);transition:background .18s,transform .18s;}
.rf-confirm-no:hover{background:#1e2632;transform:translateY(-1px);}
.rf-plans-btn{font-weight:600;}
.rf-plans{position:relative;width:min(940px,100%);max-height:90vh;overflow-y:auto;background:#0c1119;border:1px solid var(--c-border);border-radius:22px;padding:30px 28px 32px;animation:rfPop .45s var(--ease-spring);}
.rf-plans-x{position:absolute;top:16px;right:16px;display:grid;place-items:center;width:34px;height:34px;border-radius:10px;border:1px solid var(--c-border);background:rgba(255,255,255,0.04);color:var(--c-muted);cursor:pointer;transition:.15s;}
.rf-plans-x:hover{background:rgba(255,255,255,0.09);color:var(--c-text);}
.rf-plans-title{font-family:'Chakra Petch';font-size:30px;font-weight:800;text-align:center;margin:0 0 4px;}
.rf-plans-sub{text-align:center;color:var(--c-muted);font-size:14px;margin:0 0 26px;}
.rf-plans-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.rf-plan{position:relative;display:flex;flex-direction:column;background:rgba(255,255,255,0.03);border:1px solid var(--c-border);border-radius:16px;padding:22px 18px;transition:transform .2s,border-color .2s,box-shadow .2s;}
.rf-plan:hover{transform:translateY(-4px);border-color:rgba(25,232,219,0.4);box-shadow:0 16px 40px -16px rgba(25,232,219,0.4);}
.rf-plan-feat{border-color:var(--c-accent);background:linear-gradient(180deg,rgba(25,232,219,0.08),rgba(124,92,255,0.05));box-shadow:0 0 0 1px rgba(25,232,219,0.25),0 0 40px -10px rgba(25,232,219,0.45);}
.rf-plan-tag{position:absolute;top:-11px;left:50%;transform:translateX(-50%);padding:3px 12px;border-radius:999px;font-family:'JetBrains Mono';font-size:10.5px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#04110f;background:linear-gradient(135deg,var(--c-accent),#19b89f);box-shadow:0 4px 14px rgba(25,232,219,0.5);}
.rf-plan-name{font-family:'Chakra Petch';font-size:18px;font-weight:700;color:var(--c-text);}
.rf-plan-price{display:flex;align-items:baseline;gap:3px;margin:8px 0 16px;}
.rf-plan-amt{font-family:'JetBrains Mono';font-size:34px;font-weight:800;color:var(--c-text);text-shadow:0 0 20px rgba(25,232,219,0.3);}
.rf-plan-per{color:var(--c-muted);font-size:14px;}
.rf-plan-perks{list-style:none;padding:0;margin:0 0 18px;display:flex;flex-direction:column;gap:9px;flex:1;}
.rf-plan-perks li{display:flex;align-items:flex-start;gap:7px;font-size:13px;color:var(--c-text);line-height:1.35;}
.rf-plan-perks li svg{color:var(--c-accent);flex-shrink:0;margin-top:2px;}
.rf-plan-cta{padding:11px;border-radius:11px;border:none;cursor:pointer;font-family:'Sora';font-weight:600;font-size:14px;color:#04110f;background:linear-gradient(135deg,var(--c-accent),#19b89f);box-shadow:0 6px 18px -6px rgba(25,232,219,0.6);transition:filter .18s,transform .18s;}
.rf-plan-cta:hover{filter:brightness(1.08);transform:translateY(-1px);}
.rf-plan-cta-free{background:#161c26;color:var(--c-muted);box-shadow:none;border:1px solid var(--c-border);cursor:default;}
.rf-plan-cta-free:hover{filter:none;transform:none;}
@media (max-width:820px){.rf-plans-grid{grid-template-columns:repeat(2,1fr);}}
@media (max-width:460px){.rf-plans-grid{grid-template-columns:1fr;}}
.rf-checkout-back{display:inline-flex;align-items:center;gap:5px;background:none;border:none;color:var(--c-muted);cursor:pointer;font-family:'Sora';font-size:13.5px;padding:0;margin-bottom:10px;transition:color .15s;}
.rf-checkout-back:hover{color:var(--c-accent);}
.rf-embedded-box{margin-top:14px;min-height:120px;background:#fff;border:1px solid var(--c-border);border-radius:14px;padding:6px;overflow:hidden;box-shadow:0 10px 30px -12px rgba(0,0,0,0.6);}
.rf-checkout-fine{text-align:center;color:var(--c-muted);font-size:11.5px;margin:12px 0 0;}
.rf-checkout-loading{display:flex;align-items:center;gap:10px;justify-content:center;color:var(--c-muted);font-size:14px;padding:24px 0;}
.rf-checkout-err{margin:8px 0 0;padding:12px 14px;border-radius:12px;background:rgba(255,92,114,0.1);border:1px solid rgba(255,92,114,0.4);color:var(--c-bad);font-size:13.5px;text-align:center;}
.rf-pay-banner{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:300;display:flex;align-items:center;gap:10px;padding:13px 20px;border-radius:14px;background:linear-gradient(135deg,rgba(70,224,160,0.95),rgba(25,232,219,0.92));color:#04110f;font-family:'Sora';font-weight:600;font-size:14px;box-shadow:0 12px 40px -10px rgba(25,232,219,0.7);animation:rfToast .4s var(--ease-spring);}
.rf-pay-banner button{background:rgba(4,17,15,0.16);border:none;border-radius:8px;color:#04110f;cursor:pointer;display:grid;place-items:center;width:24px;height:24px;}
.pm-rank{display:inline-block;font-family:'Chakra Petch';font-weight:700;font-size:11px;letter-spacing:0.02em;padding:2px 8px;border-radius:999px;border:1px solid currentColor;line-height:1.3;white-space:nowrap;}
.pm-rank-low{color:#8aa0b4;}
.pm-rank-mid{color:#46e0a0;}
.pm-rank-high{color:#19e8db;}
.pm-rank-shigh{color:#5ec8ff;}
.pm-rank-elite{color:#7c5cff;}
.pm-rank-god{color:#ffc24b;background:rgba(255,194,75,0.1);box-shadow:0 0 12px rgba(255,194,75,0.35);}
.pm-rank-custom{color:#ff7ae0;background:rgba(255,122,224,0.12);box-shadow:0 0 12px rgba(255,122,224,0.35);}
.pm-lb-name{display:flex;align-items:center;gap:8px;}
.pm-lb-name .pm-rank{font-size:10px;padding:1px 6px;}
.pm-rank-col{margin:0 auto 4px;width:fit-content;}
.pm-mtitle{cursor:default;}
.pm-admin-list .pm-admin-row{grid-template-columns:1fr auto auto;}
.pm-del-btn{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;background:rgba(255,92,114,0.12);border:1px solid rgba(255,92,114,0.4);color:var(--c-bad);cursor:pointer;}
.pm-del-btn:hover{background:rgba(255,92,114,0.22);}
.pm-admin-confirm{display:flex;gap:6px;}
.pm-del-yes{padding:5px 10px;border-radius:8px;background:var(--c-bad);border:none;color:#fff;font-family:'Chakra Petch';font-weight:600;cursor:pointer;}
.pm-del-no{padding:5px 10px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid var(--c-border);color:var(--c-text);font-family:'Chakra Petch';cursor:pointer;}
.pm-admin-item{border-radius:10px;overflow:hidden;}
.pm-admin-open{flex:1;min-width:0;text-align:left;background:none;border:none;cursor:pointer;padding:0;color:var(--c-text);font-family:'Chakra Petch';}
.pm-admin-msg{background:rgba(70,224,160,0.12);border:1px solid var(--c-good);color:var(--c-good);border-radius:10px;padding:9px 12px;font-size:13px;margin-bottom:10px;word-break:break-word;}
.pm-admin-edit{background:rgba(255,255,255,0.03);border:1px solid var(--c-border);border-top:none;border-radius:0 0 10px 10px;padding:12px;display:flex;flex-direction:column;gap:9px;margin-top:-4px;}
.pm-admin-line{display:flex;align-items:center;gap:8px;}
.pm-admin-l{font-family:'Chakra Petch';font-size:12px;color:var(--c-muted);min-width:96px;}
.pm-admin-in{flex:1;min-width:0;padding:7px 10px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid var(--c-border);color:var(--c-text);font-family:'Chakra Petch';font-size:13px;}
.pm-admin-color{width:42px;height:34px;padding:2px;border-radius:8px;border:1px solid var(--c-border);background:rgba(255,255,255,0.05);cursor:pointer;}
.pm-emoji-cur{flex:1;min-width:0;padding:7px 10px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid var(--c-border);color:var(--c-text);font-family:'Chakra Petch';font-size:15px;cursor:pointer;text-align:left;}
.pm-emoji-pick{background:rgba(0,0,0,0.25);border:1px solid var(--c-border);border-radius:10px;padding:8px;}
.pm-emoji-search{display:flex;align-items:center;gap:6px;color:var(--c-muted);border-bottom:1px solid var(--c-border);padding-bottom:6px;margin-bottom:6px;}
.pm-emoji-search input{flex:1;background:none;border:none;color:var(--c-text);font-family:'Chakra Petch';font-size:13px;outline:none;}
.pm-emoji-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:3px;max-height:170px;overflow-y:auto;}
.pm-emoji-btn{aspect-ratio:1;border:1px solid transparent;border-radius:8px;background:rgba(255,255,255,0.04);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;image-rendering:pixelated;}
.pm-emoji-btn:hover{border-color:var(--c-accent);background:rgba(25,232,219,0.12);}
.pm-emoji-none{grid-column:1/-1;color:var(--c-muted);font-size:12px;padding:8px;text-align:center;}
.pm-admin-save{padding:7px 14px;border-radius:8px;background:var(--c-accent);border:none;color:#04141a;font-family:'Chakra Petch';font-weight:700;cursor:pointer;}
.pm-admin-save:disabled{opacity:0.5;cursor:default;}
.pm-admin-hash{display:flex;align-items:flex-start;gap:8px;}
.pm-admin-hash code{flex:1;min-width:0;font-family:'JetBrains Mono';font-size:10.5px;color:var(--c-muted);word-break:break-all;background:rgba(0,0,0,0.3);padding:6px 8px;border-radius:6px;}
.pm-admin-hint{font-size:11.5px;color:var(--c-muted);margin:2px 0 0;}
.pm-auth-hint{font-size:12px;color:var(--c-muted);margin:0 0 10px;}
.pm-auth-err{font-size:13px;color:var(--c-bad);margin:0 0 10px;}
.pm-auth-note{font-size:11px;color:var(--c-muted);margin:14px 0 0;opacity:.8;}
.pm-inline-link{background:none;border:none;color:var(--c-accent);cursor:pointer;text-decoration:underline;font:inherit;padding:0;}
.pm-diff-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:6px 0 16px;}
.pm-diff{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 10px;border-radius:14px;background:var(--c-panel);border:1px solid var(--c-border);color:var(--c-text);cursor:pointer;transition:border-color .15s,transform .12s;}
.pm-diff:hover{border-color:var(--c-accent);transform:translateY(-2px);}
.pm-diff-name{font-family:'Chakra Petch';font-weight:600;font-size:15px;}
.pm-diff-elo{font-family:'JetBrains Mono';font-size:12px;color:var(--c-warn);}
.pm-elo-result{text-align:center;font-family:'JetBrains Mono';font-size:15px;margin:-8px 0 16px;color:var(--c-muted);}
.pm-elo-result.up{color:var(--c-good);}
.pm-elo-result.down{color:var(--c-bad);}
.pm-lb{display:flex;flex-direction:column;gap:4px;margin:8px 0 16px;max-height:50vh;overflow-y:auto;}
.pm-lb-row{display:grid;grid-template-columns:36px 1fr auto;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid var(--c-border);}
.pm-lb-row.me{border-color:var(--c-accent);background:rgba(25,232,219,0.1);}
.pm-lb-rank{font-family:'JetBrains Mono';color:var(--c-muted);font-size:13px;text-align:center;}
.pm-lb-name{font-family:'Chakra Petch';font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pm-lb-elo{font-family:'JetBrains Mono';font-weight:600;color:var(--c-warn);}
.pm-board-sub.locked{color:var(--c-good);}
.pm-buildside{margin-bottom:14px;}
.pm-arena{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;align-items:start;}
.pm-col{display:flex;flex-direction:column;gap:8px;min-width:0;}
.pm-col-h{font-family:'JetBrains Mono';font-size:11px;letter-spacing:1.3px;text-transform:uppercase;color:var(--c-muted);margin:0 0 2px 2px;}
.pm-col.you .pm-col-h{color:var(--c-accent);}
.pm-col.opp .pm-col-h{color:var(--c-accent2);}
.pm-col-parts{display:flex;flex-direction:column;gap:8px;}
.pm-col-parts.blur{filter:blur(5px);opacity:.78;pointer-events:none;}
.pm-ctile{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:11px;cursor:pointer;text-align:left;color:var(--c-text);background:var(--c-panel);border:1px solid var(--c-border);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:border-color .14s,transform .12s;min-width:0;}
.pm-ctile.opp{cursor:default;}
.pm-ctile:not(.opp):hover{border-color:var(--c-accent);transform:translateX(2px);}
.pm-ctile.filled{border-color:rgba(25,232,219,0.3);}
.pm-ctile-img{width:38px;height:38px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,0.05);color:var(--c-accent);overflow:hidden;flex-shrink:0;}
.pm-ctile-img img{width:100%;height:100%;object-fit:contain;}
.pm-ctile.opp .pm-ctile-img{color:var(--c-accent2);}
.pm-ctile-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.pm-ctile-cat{font-size:9px;letter-spacing:.6px;text-transform:uppercase;color:var(--c-muted);font-family:'JetBrains Mono';}
.pm-ctile-name{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pm-ctile-add{font-size:12px;color:var(--c-muted);}
.pm-ctile-price{font-size:11px;color:var(--c-accent);font-family:'JetBrains Mono';flex-shrink:0;}
@media(max-width:480px){.pm-arena{grid-template-columns:1fr;}}
.pm-side-h{font-family:'JetBrains Mono';font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--c-muted);margin:0 0 8px 2px;}
.pm-partrow{display:flex;flex-wrap:nowrap;gap:8px;overflow-x:auto;padding-bottom:6px;scrollbar-width:thin;}
.pm-partrow.blur{filter:blur(5px);opacity:.78;pointer-events:none;}
.pm-tile{flex:0 0 96px;width:96px;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 6px;border-radius:12px;cursor:pointer;text-align:center;color:var(--c-text);background:var(--c-panel);border:1px solid var(--c-border);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:border-color .15s,transform .12s;}
.pm-tile.opp{cursor:default;}
.pm-tile:not(.opp):hover{border-color:var(--c-accent);transform:translateY(-2px);}
.pm-tile.filled{border-color:rgba(25,232,219,0.3);}
.pm-tile-img{width:40px;height:40px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,0.05);color:var(--c-accent);overflow:hidden;}
.pm-tile-img img{width:100%;height:100%;object-fit:contain;}
.pm-tile.opp .pm-tile-img{color:var(--c-accent2);}
.pm-tile-cat{font-size:9px;letter-spacing:.6px;text-transform:uppercase;color:var(--c-muted);font-family:'JetBrains Mono';}
.pm-tile-name{font-size:10px;line-height:1.2;max-height:24px;overflow:hidden;}
.pm-tile-add{font-size:11px;color:var(--c-muted);}
.pm-tile-price{font-size:10px;color:var(--c-accent);font-family:'JetBrains Mono';}
.pm-loading{min-height:50vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;}
.pm-spinner{width:46px;height:46px;border-radius:50%;border:4px solid rgba(25,232,219,0.18);border-top-color:var(--c-accent);animation:pmSpin .8s linear infinite;}
@keyframes pmSpin{to{transform:rotate(360deg);}}
.pm-loading-text{font-family:'Chakra Petch';font-size:16px;color:var(--c-muted);}
.pm-code{font-family:'JetBrains Mono';font-weight:700;font-size:48px;letter-spacing:10px;color:var(--c-accent);text-shadow:0 0 24px rgba(25,232,219,0.4);margin:6px 0 4px;padding-left:10px;}
.pm-codein{width:100%;text-align:center;font-family:'JetBrains Mono';font-weight:700;font-size:34px;letter-spacing:8px;text-transform:uppercase;padding:14px;margin-bottom:16px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid var(--c-border);color:var(--c-text);outline:none;}
.pm-codein:focus{border-color:var(--c-accent);}
.pm-tour-count{font-family:'JetBrains Mono';font-size:12px;color:var(--c-muted);margin:0 0 16px;}
.pm-tour-list{display:flex;flex-direction:column;gap:8px;margin:6px 0 16px;}
.pm-tour-match{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid var(--c-border);font-size:13px;}
.pm-tour-match.mine-win{border-color:var(--c-good);background:rgba(70,224,160,0.08);}
.pm-tour-match.mine-lose{border-color:var(--c-bad);background:rgba(255,92,114,0.08);}
.pm-tour-match span{display:flex;align-items:center;gap:6px;}
.pm-tour-match b{font-family:'JetBrains Mono';color:var(--c-text);}
.pm-tour-win{color:var(--c-good);font-weight:600;}
.pm-tour-vs{color:var(--c-muted);font-family:'Chakra Petch';font-size:12px;}
.pm-namein{width:100%;text-align:center;font-family:'Sora',sans-serif;font-size:18px;padding:13px;margin-bottom:16px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid var(--c-border);color:var(--c-text);outline:none;}
.pm-input{width:100%;max-width:320px;text-align:center;font-family:'Chakra Petch';font-size:16px;padding:12px 14px;margin:4px auto 16px;display:block;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid var(--c-border);color:var(--c-text);outline:none;}
.pm-input::placeholder{color:var(--c-muted);}
.pm-input::-ms-reveal,.pm-input::-ms-clear,.pm-namein::-ms-reveal,.pm-admin-in::-ms-reveal{filter:invert(1) brightness(0.7);}
.pm-input:focus{border-color:var(--c-accent);box-shadow:0 0 0 2px rgba(25,232,219,0.18);}
.pm-namein:focus{border-color:var(--c-accent);}
.pm-mode:disabled{opacity:.4;cursor:not-allowed;}
.pm-tour-players{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:4px 0 8px;}
.pm-tour-chip{font-size:12px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,0.05);border:1px solid var(--c-border);color:var(--c-text);}
.pm-tour-chip.me{border-color:var(--c-accent);color:var(--c-accent);}
.pm-spec-list{display:flex;flex-direction:column;gap:8px;margin:8px 0 16px;}
.pm-spec-match{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid var(--c-border);}
.pm-spec-side{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:0;}
.pm-spec-name{font-size:12px;color:var(--c-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
.pm-spec-score{font-family:'JetBrains Mono';font-weight:600;font-size:22px;color:var(--c-accent);}
.pm-vs-mid{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;}
.pm-vs-word{font-family:'Chakra Petch';font-weight:700;font-size:20px;color:var(--c-text);opacity:.5;}
.pm-challenge-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.pm-search{display:flex;align-items:center;gap:8px;padding:9px 12px;margin-bottom:8px;border-bottom:1px solid var(--c-border);color:var(--c-muted);}
.pm-filters{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 10px;border-bottom:1px solid var(--c-border);margin-bottom:10px;}
.pm-fsel{appearance:none;-webkit-appearance:none;padding:6px 22px 6px 10px;border-radius:8px;background:rgba(255,255,255,0.05) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%238aa0b4' stroke-width='1.6' fill='none' stroke-linecap='round'/></svg>") no-repeat right 8px center;border:1px solid var(--c-border);color:var(--c-text);font-family:'Chakra Petch';font-size:12px;cursor:pointer;max-width:46%;}
.pm-fsel.on{border-color:var(--c-accent);color:var(--c-accent);}
.pm-fsel option{background:#0d1320;color:var(--c-text);}
.pm-fclear{padding:6px 10px;border-radius:8px;background:transparent;border:1px solid var(--c-border);color:var(--c-muted);font-family:'Chakra Petch';font-size:12px;cursor:pointer;}
.pm-opt.oos{opacity:0.55;}
.pm-opt.oos .pm-opt-img{filter:grayscale(1);}
.pm-opt-oos{font-family:'Chakra Petch';font-weight:600;font-size:11.5px;color:var(--c-bad);white-space:nowrap;}
.pm-search input{flex:1;background:transparent;border:none;outline:none;color:var(--c-text);font-family:'Sora',sans-serif;font-size:14px;}
.pm-search-x{background:none;border:none;color:var(--c-muted);cursor:pointer;display:flex;}
.pm-opt.blocked{opacity:.4;cursor:not-allowed;filter:grayscale(.6);}
.pm-opt-block{display:block;font-family:'JetBrains Mono';font-size:10px;color:var(--c-bad);letter-spacing:.5px;}
.pm-empty{text-align:center;color:var(--c-muted);padding:30px 0;font-size:14px;}
@media(max-width:560px){
  .pm-slots{grid-template-columns:1fr;}
  .pm-scorecols{grid-template-columns:1fr;}
  .pm-verdict-title{font-size:30px;}
  .rf-mogger-cta{margin-left:0;margin-top:10px;}
  .pm-mtitle{font-size:32px;}
  .pm-intro-uc{font-size:28px;}
  .pm-intro-count{font-size:56px;}
  .pm-vs{gap:6px;}
  .pm-board{padding:12px 8px;}
  .pm-board-score{font-size:30px;}
  .pm-board-name{font-size:11px;letter-spacing:1px;}
  .pm-vs-word{font-size:16px;}
  .pm-timer{font-size:26px;}
  .pm-card{padding:20px;}
  .pm-uc{font-size:16px;}
  .pm-drawer{width:100%;}
  .pm-partrow{flex-wrap:wrap;overflow-x:visible;justify-content:center;}
  .pm-partrow .pm-tile{flex:0 0 calc(33.333% - 6px);width:auto;}
}
@media(max-width:380px){
  .pm-board-name{font-size:10px;letter-spacing:.5px;}
  .pm-board-score{font-size:26px;}
  .pm-spend{font-size:12px;}
}
.pm-challenge{display:flex;flex-direction:column;gap:3px;}
.pm-uc{font-family:'Chakra Petch';font-weight:600;font-size:19px;display:flex;align-items:center;gap:8px;}
.pm-budget{color:var(--c-muted);font-size:13px;font-family:'JetBrains Mono';}
.pm-timer{font-family:'JetBrains Mono';font-weight:600;font-size:32px;color:var(--c-accent);text-shadow:0 0 16px rgba(25,232,219,0.4);}
.pm-timer.low{color:var(--c-bad);text-shadow:0 0 16px rgba(255,92,114,0.5);animation:pmpulse .7s infinite;}
@keyframes pmpulse{50%{opacity:.5;}}
.pm-turn{text-align:center;color:var(--c-accent2);font-family:'Chakra Petch';margin-bottom:10px;}
.pm-spend{font-size:13px;color:var(--c-muted);font-family:'JetBrains Mono';margin-bottom:14px;}
.pm-spend.over{color:var(--c-bad);}
.pm-slots{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
.pm-slot{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;cursor:pointer;text-align:left;color:var(--c-text);background:var(--c-panel);border:1px solid var(--c-border);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transition:border-color .15s,transform .12s;}
.pm-slot:hover{border-color:var(--c-accent);transform:translateY(-1px);}
.pm-slot.filled{border-color:rgba(25,232,219,0.3);}
.pm-slot-img{width:40px;height:40px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,0.05);color:var(--c-accent);flex-shrink:0;overflow:hidden;}
.pm-slot-img img{width:100%;height:100%;object-fit:contain;}
.pm-slot-body{display:flex;flex-direction:column;gap:3px;min-width:0;}
.pm-slot-cat{font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:var(--c-muted);font-family:'JetBrains Mono';}
.pm-slot-part{font-size:13px;font-weight:500;display:flex;flex-direction:column;gap:1px;overflow:hidden;}
.pm-slot-part{white-space:nowrap;text-overflow:ellipsis;}
.pm-slot-part i{font-style:normal;color:var(--c-accent);font-family:'JetBrains Mono';font-size:12px;}
.pm-slot-empty{color:var(--c-muted);font-size:13px;}
.pm-lockin{display:block;width:100%;margin-top:16px;justify-content:center;}
.pm-drawer-wrap{position:fixed;inset:0;z-index:120;background:rgba(0,0,0,0.55);display:flex;justify-content:flex-end;}
.pm-drawer{width:min(420px,100%);height:100%;padding:20px;overflow-y:auto;background:rgba(11,15,22,0.85);border-left:1px solid var(--c-border);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}
.pm-drawer-head{display:flex;justify-content:space-between;align-items:center;font-family:'Chakra Petch';font-size:18px;margin-bottom:16px;}
.pm-x{background:none;border:none;color:var(--c-muted);cursor:pointer;}
.pm-opts{display:flex;flex-direction:column;gap:8px;}
.pm-optwrap{display:flex;flex-direction:column;}
.pm-opt{display:flex;align-items:stretch;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid var(--c-border);overflow:hidden;transition:border-color .12s;}
.pm-opt.sel{border-color:var(--c-accent);background:rgba(25,232,219,0.1);}
.pm-opt.blocked{opacity:.4;filter:grayscale(.6);}
.pm-opt-pick{flex:1;min-width:0;display:flex;align-items:center;gap:11px;padding:10px 12px;background:none;border:none;cursor:pointer;text-align:left;color:var(--c-text);}
.pm-opt-pick:disabled{cursor:not-allowed;}
.pm-opt:not(.blocked):hover{border-color:var(--c-accent);}
.pm-opt-info{flex-shrink:0;padding:0 12px;background:rgba(255,255,255,0.04);border:none;border-left:1px solid var(--c-border);color:var(--c-muted);font-family:'JetBrains Mono';font-size:11px;letter-spacing:.5px;cursor:pointer;transition:color .12s,background .12s;}
.pm-opt-info:hover{color:var(--c-accent);background:rgba(25,232,219,0.08);}
.pm-opt-img{width:36px;height:36px;border-radius:8px;display:grid;place-items:center;background:rgba(255,255,255,0.05);color:var(--c-accent);flex-shrink:0;overflow:hidden;}
.pm-opt-img img{width:100%;height:100%;object-fit:contain;}
.pm-opt-main{flex:1;min-width:0;}
.pm-opt-name{display:block;font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pm-opt-brand{font-size:11px;color:var(--c-muted);}
.pm-opt-right{text-align:right;min-width:84px;}
.pm-opt-price{display:block;font-family:'JetBrains Mono';font-size:13px;color:var(--c-accent);margin-bottom:5px;}
.pm-opt-bar{display:block;height:5px;border-radius:3px;background:rgba(255,255,255,0.08);overflow:hidden;}
.pm-opt-bar i{display:block;height:100%;background:var(--c-accent);}
.pm-opt-bar.over i{background:var(--c-warn);}
.pm-specs{display:flex;flex-wrap:wrap;gap:6px;padding:8px 4px 12px;}
.pm-specs span{font-family:'JetBrains Mono';font-size:11px;color:var(--c-text);background:rgba(255,255,255,0.04);border:1px solid var(--c-border);border-radius:8px;padding:4px 9px;}
.pm-specs span i{font-style:normal;color:var(--c-muted);margin-right:6px;}
.pm-specs-none{color:var(--c-muted);}
.pm-verdict-title{text-align:center;font-family:'Chakra Petch';font-weight:700;font-size:38px;margin:6px 0 18px;}
.pm-verdict-title.win{color:var(--c-good);text-shadow:0 0 24px rgba(70,224,160,0.4);}
.pm-verdict-title.lose{color:var(--c-bad);text-shadow:0 0 24px rgba(255,92,114,0.4);}
.pm-verdict-box{background:var(--c-panel);border:1px solid var(--c-border);border-radius:16px;padding:16px 18px;margin-bottom:18px;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}
.pm-verdict-tag{display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono';font-size:11px;letter-spacing:1.5px;color:var(--c-accent2);margin-bottom:8px;}
.pm-verdict-box p{margin:0;line-height:1.6;font-size:15px;white-space:pre-wrap;}
.pm-dim{color:var(--c-muted);font-style:italic;}
.pm-scorecols{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.pm-scorecol{background:var(--c-panel);border:1px solid var(--c-border);border-radius:16px;padding:18px;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}
.pm-scorecol.win{border-color:var(--c-good);box-shadow:0 0 30px rgba(70,224,160,0.15);}
.pm-scorecol-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
.pm-scorecol-title{font-family:'Chakra Petch';font-weight:600;font-size:17px;}
.pm-crown{font-size:10px;color:var(--c-good);font-family:'JetBrains Mono';letter-spacing:1px;}
.pm-bigscore{font-family:'JetBrains Mono';font-weight:600;font-size:34px;color:var(--c-accent);}
.pm-bigscore small{font-size:14px;color:var(--c-muted);}
.pm-metrics{display:flex;flex-direction:column;gap:4px;margin:10px 0;font-size:13px;color:var(--c-muted);font-family:'JetBrains Mono';}
.pm-metrics b{color:var(--c-text);float:right;}
.pm-red{color:var(--c-bad)!important;}
.pm-issues{display:flex;flex-direction:column;gap:3px;margin:8px 0;font-size:12px;color:var(--c-warn);}
.pm-issues span{display:flex;align-items:center;gap:5px;}
.pm-buildlist{display:flex;flex-direction:column;gap:3px;margin-top:10px;padding-top:10px;border-top:1px solid var(--c-border);font-size:12px;}
.pm-buildlist span i{font-style:normal;color:var(--c-muted);display:inline-block;width:96px;font-family:'JetBrains Mono';font-size:11px;}
.pm-reveal-zone{position:relative;}
.pm-blur{filter:blur(11px);pointer-events:none;user-select:none;opacity:.6;transition:filter .5s ease,opacity .5s ease;}
.pm-reveal-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;}
.pm-reveal-text{font-family:'Chakra Petch';font-size:16px;color:var(--c-text);margin:0;}
.pm-intro{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:8px;}
.pm-intro-player{font-family:'Chakra Petch';font-weight:600;font-size:18px;color:var(--c-accent2);margin-bottom:6px;}
.pm-intro-label{font-family:'JetBrains Mono';font-size:12px;letter-spacing:4px;color:var(--c-muted);}
.pm-intro-uc{font-family:'Chakra Petch';font-weight:700;font-size:38px;display:flex;align-items:center;gap:14px;color:var(--c-text);animation:pmPop .5s var(--ease) both;}
.pm-intro-uc svg{color:var(--c-accent);}
.pm-intro-budget{font-family:'JetBrains Mono';font-size:20px;color:var(--c-accent);margin-bottom:18px;animation:pmPop .5s .1s var(--ease) both;}
.pm-intro-count{font-family:'Chakra Petch';font-weight:700;font-size:72px;color:var(--c-accent);text-shadow:0 0 30px rgba(25,232,219,0.5);animation:pmCount .85s ease both;}
@keyframes pmPop{from{opacity:0;transform:translateY(10px) scale(.96);}to{opacity:1;transform:none;}}
@keyframes pmCount{0%{opacity:0;transform:scale(1.6);}30%{opacity:1;transform:scale(1);}100%{opacity:.5;transform:scale(.9);}}
@media(max-width:560px){.pm-slots{grid-template-columns:1fr;}.pm-scorecols{grid-template-columns:1fr;}.pm-verdict-title{font-size:30px;}.rf-mogger-cta{margin-left:0;margin-top:10px;}}
`}</style>
  );
}