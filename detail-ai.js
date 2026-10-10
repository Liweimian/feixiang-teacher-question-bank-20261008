(() => {
const QUESTION_PICKER_MODE = new URLSearchParams(location.search).get("picker") === "1";
const paperCatalog = {
  t2: {
    title: "2026 北京市朝阳区初一上期末数学真题",
    shortTitle: "朝阳区期末卷",
    focus: "北京市朝阳区七年级上学期期末数学真题",
    reason: "朝阳区级真题",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期末",
    questionCount: 7,
    difficulty: "中等",
    usage: 1206
  },
  t14: {
    title: "2026 北京市朝阳区初一上期中数学真题",
    shortTitle: "朝阳区期中卷",
    focus: "北京市朝阳区七年级上学期期中数学真题",
    reason: "朝阳区级真题",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期中",
    questionCount: 6,
    difficulty: "中等",
    usage: 984
  },
  t25: {
    title: "2026 北京市朝阳区初一上期末数学真题",
    shortTitle: "朝阳区期末卷",
    focus: "北京市朝阳区七年级上学期期末数学真题",
    reason: "朝阳区级真题",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期末",
    questionCount: 4,
    difficulty: "中等",
    usage: 1458
  },
  t4: {
    title: "2024—2026 朝阳区期末真题汇编：轴对称",
    shortTitle: "轴对称汇编",
    focus: "把分散试题整理成可直接使用的课内专题",
    reason: "真题汇编",
    region: "朝阳区",
    grade: "七年级下册",
    examType: "期末",
    questionCount: 6,
    difficulty: "较难",
    usage: 1532
  },
  t6: {
    title: "初一期末高频易错周测题单",
    shortTitle: "期末易错周测",
    focus: "名校周测，适合分层选题与命题参考",
    reason: "名校资源",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "周测",
    questionCount: 7,
    difficulty: "较难",
    usage: 1089
  },
  t27: {
    title: "期末选择题高频考法：审题与快速提分",
    shortTitle: "期末选择题",
    focus: "高频选择题与排除方法",
    reason: "本周热门",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期末",
    questionCount: 7,
    difficulty: "中等",
    usage: 1328
  },
  t33: {
    title: "期中压轴题：关键步骤分层拆解",
    shortTitle: "期中压轴题",
    focus: "按关键步骤拆解综合题",
    reason: "名校共建",
    region: "朝阳区",
    grade: "七年级上册",
    examType: "期中",
    questionCount: 6,
    difficulty: "较难",
    usage: 1036
  }
};

function normalizeWorkspaceCatalogCopy(value, preserveZhongkao = false) {
  let text = String(value || "")
    .replaceAll("2025-2026学年", "2026-2027学年")
    .replace(/^2026\s+/, "2026-2027学年 ");
  if (preserveZhongkao) return text;
  return text
    .replaceAll("真题整理", "考题整理")
    .replaceAll("真题汇编", "历年试题汇编")
    .replaceAll("真题库", "试题库")
    .replaceAll("真题", "试题");
}

Object.values(paperCatalog).forEach(meta => {
  const preserveZhongkao = /中考/.test(`${meta.title || ""}${meta.focus || ""}${meta.reason || ""}`);
  ["title", "shortTitle", "focus", "reason", "source"].forEach(key => {
    if (meta[key]) meta[key] = normalizeWorkspaceCatalogCopy(meta[key], preserveZhongkao);
  });
  if (!preserveZhongkao && /卷$/.test(meta.shortTitle || "")) {
    meta.shortTitle = `${meta.shortTitle} · 2026-2027学年`;
  }
});

const sidebarPaperList = Object.entries(paperCatalog).map(([id, meta]) => ({
  id,
  ...meta,
  recommendScore: Number(meta.usage || 0),
  latestScore: id === "t14" ? 100 : id === "t25" ? 95 : id === "t2" ? 90 : 80
}));

const paperListState = {
  query: "",
  examType: "all"
};

const rightPanelSectionState = {
  selectedCollapsed: true,
  browseCollapsed: false
};

const HOME_FRAME_SRC = "./new-task/index.html";
const QUESTION_DRAG_MIME = "application/x-aiq-questions";
const CANVAS_DRAG_MIME = "application/x-aiq-canvas";
const BROWSE_FILTER_META = {
  chapter: { filter: "chapter", label: "同步练习", icon: "ri-book-open-line" },
  special: { filter: "special", label: "专题", icon: "ri-focus-3-line" },
  paper: { filter: "paper", label: "试卷", icon: "ri-file-list-3-line" },
  workbook: {
    filter: "workbook",
    label: "练习册",
    icon: "ri-book-shelf-line",
    options: { view: "album", albumId: "", query: "", keepAlbumState: false }
  },
  compilation: { filter: "compilation", label: "试题汇编", icon: "ri-book-marked-line" }
};
const WORKBOOK_BROWSE_KEY_PREFIX = "workbook:";
const WORKBOOK_ALBUM_TAB_LABELS = {
  duowei: "朝阳新目标检测",
  quanpin: "西城学习探究诊断",
  yuanchuang: "海淀名师伴你学",
  tiyou: "真题圈北京版",
  yicuo: "易错方法系列"
};
const BROWSE_OPTION_KEYS = [
  "origin", "examType", "year", "grade", "authority", "source", "sort", "query",
  "view", "albumId", "textbook", "keepAlbumState", "category", "difficulty", "signal"
];
const mobileLayoutQuery = window.matchMedia("(max-width: 980px)");
const expandedAnalysisIds = new Set();
const selectedExpandedAnalysisKeys = new Set();
const dragPickIds = new Set();
const collapsedCanvasGroupIds = new Set();
let questionDragActive = false;
let questionDragGhost = null;
let canvasDragKey = null;
let canvasHoverTimer = null;
let canvasFocusKey = null;
let canvasOrderByType = false;

let selectedPreviewTypeFilter = null;
let selectedPanelEnlarged = false;
let selectedShowAnswers = false;
let aiAssistantOpen = false;
// 题目浏览区在「我的」中收起时，记住应恢复的右侧视图。
let collapsedAssistantView = false;
let aiAssistantTabOpen = false;
let aiAssistantMessages = [];
let aiAssistantAttachment = null;
let aiAssistantTyping = false;
let courseCenterQuery = "";
let courseCenterPage = 1;
let pendingQuestionDraftCloseId = null;
let aiGroupHistoryExpanded = false;
let tabAddMenuOpen = false;

const paperQuestions = {
  t2: [
    { id:"1", num:1, section:"一、单项选择题", type:"选择题", difficulty:"较易", knowledge:"正负数意义", minutes:1, competency:"运算能力", badges:["AI 批改","AI 赋分"], stem:"如果向东走 3 米记作 +3 米，那么向西走 5 米应记作（　　）。", options:["A. +5 米","B. −5 米","C. +3 米","D. −3 米"], answer:"B", analysis:"向西与向东相反，应记作负数。" },
    { id:"2", num:2, section:"一、单项选择题", type:"选择题", difficulty:"较易", knowledge:"相反意义的量", minutes:1, competency:"抽象能力", badges:["创新题"], stem:"下列各组量中，具有相反意义的量是（　　）。", options:["A. 上升 5 米与向东 5 米","B. 收入 80 元与支出 50 元","C. 长大 2 岁与减少 2 千克","D. 购进 10 件与卖出 8 元"], answer:"B", analysis:"收入与支出具有相反意义。" },
    { id:"3", num:3, section:"一、单项选择题", type:"选择题", difficulty:"中等", knowledge:"负数概念", stem:"在 −3、0、2.5、−1/2 四个数中，负数共有（　　）。", options:["A. 1 个","B. 2 个","C. 3 个","D. 4 个"], answer:"B", analysis:"−3 和 −1/2 为负数。" },
    { id:"4", num:4, section:"一、单项选择题", type:"选择题", difficulty:"简单", knowledge:"温差计算", stem:"某天北京的最高气温为 18 ℃，最低气温为 7 ℃，这一天的温差是（　　）。", options:["A. 25 ℃","B. −25 ℃","C. 11 ℃","D. −11 ℃"], answer:"C", analysis:"温差 = 最高温 − 最低温 = 11 ℃。" },
    { id:"5", num:5, section:"二、填空题", type:"填空题", difficulty:"简单", knowledge:"正负数应用", stem:"如果水库水位上升 0.8 米记作 +0.8 米，那么水位下降 0.5 米记作 ______ 米。", options:[], answer:"−0.5", analysis:"下降记为负。" },
    { id:"6", num:6, section:"二、填空题", type:"填空题", difficulty:"中等", knowledge:"数轴", stem:"数轴上与原点距离为 4 个单位长度的点表示的数是 ______。", options:[], answer:"4 或 −4", analysis:"距离原点 4 个单位长度有两个点。" },
    { id:"7", num:7, section:"三、解答题", type:"解答题", difficulty:"中等", knowledge:"正负数应用", stem:"某食品包装袋上标有“净含量 500±5 g”。抽检 5 袋食品的质量分别为 497 g、503 g、506 g、500 g、495 g。请用正负数表示它们相对于标准质量的偏差，并判断哪些产品合格。", options:[], answer:"497→−3，503→+3，506→+6，500→0，495→−5；497/503/500/495 合格", analysis:"合格范围为 −5 到 +5。" }
  ],
  t14: [
    { id:"1", num:1, section:"一、单项选择题", type:"选择题", difficulty:"中等", knowledge:"整式运算", stem:"下列运算正确的是（　　）。", options:["A. 3a + 2a = 5a²","B. −(−2) = 2","C. 2³ = 6","D. |−3| = −3"], answer:"B", analysis:"−(−2)=2。" },
    { id:"2", num:2, section:"一、单项选择题", type:"选择题", difficulty:"简单", knowledge:"代数式求值", stem:"若 x = −1，则 2x − 3 的值是（　　）。", options:["A. −5","B. −1","C. 1","D. 5"], answer:"A", analysis:"代入 x=−1 得 −5。" },
    { id:"3", num:3, section:"一、单项选择题", type:"选择题", difficulty:"简单", knowledge:"一元一次方程", stem:"下列方程中，是一元一次方程的是（　　）。", options:["A. x² = 4","B. 2x + 1 = 0","C. 1/x = 2","D. x + y = 1"], answer:"B", analysis:"2x+1=0 符合定义。" },
    { id:"4", num:4, section:"二、填空题", type:"填空题", difficulty:"简单", knowledge:"合并同类项", stem:"合并同类项：3x − 2x + 5 = ______。", options:[], answer:"x + 5", analysis:"3x−2x=x。" },
    { id:"5", num:5, section:"二、填空题", type:"填空题", difficulty:"中等", knowledge:"解方程", stem:"若 2x + 5 = 11，则 x = ______。", options:[], answer:"3", analysis:"2x=6，x=3。" },
    { id:"6", num:6, section:"三、解答题", type:"解答题", difficulty:"中等", knowledge:"解方程", stem:"解方程：3(x − 2) = 2x + 1，并写出检验过程。", options:[], answer:"x = 7", analysis:"展开移项求解。" }
  ],
  t25: [
    { id:"1", num:1, section:"一、单项选择题", type:"选择题", difficulty:"简单", knowledge:"轴对称", stem:"下列图形中，是轴对称图形的是（　　）。", options:["A. 平行四边形","B. 等腰三角形","C. 直角梯形","D. 任意三角形"], answer:"B", analysis:"等腰三角形是轴对称图形。" },
    { id:"2", num:2, section:"一、单项选择题", type:"选择题", difficulty:"中等", knowledge:"不等式性质", stem:"若 a < b，则下列结论一定正确的是（　　）。", options:["A. a + 1 > b + 1","B. −a > −b","C. 2a > 2b","D. a − 2 < b − 2"], answer:"D", analysis:"同减 2 不等号方向不变。" },
    { id:"3", num:3, section:"二、填空题", type:"填空题", difficulty:"简单", knowledge:"余角", stem:"一个角的余角是 35°，则这个角是 ______。", options:[], answer:"55°", analysis:"90°−35°=55°。" },
    { id:"4", num:4, section:"三、解答题", type:"解答题", difficulty:"中等", knowledge:"角平分线", stem:"如图，已知 ∠AOB = 80°，OC 平分 ∠AOB，求 ∠AOC 的度数，并说明理由。", options:[], answer:"40°", analysis:"角平分线将角分成两个相等的角。" }
  ]
};

const params = new URLSearchParams(location.search);
const contextName = params.get("context") || "paper";
const isComposeMode = params.get("mode") === "compose";
const isRecordMode = params.get("mode") === "record";
const isWorkbenchMode = params.get("mode") === "workbench";
const requestedWorkspaceView = String(params.get("workspaceView") || "");
const requestedBrowseFilter = String(params.get("browse") || "");
const composePrompt = String(params.get("prompt") || "").trim();
if (isComposeMode || isWorkbenchMode) {
  document.querySelectorAll(".fx-c-primary-nav a").forEach(link => {
    const isCompositionEntry = link.getAttribute("href")?.includes("mode=workbench");
    link.classList.toggle("active", isCompositionEntry);
    if (isCompositionEntry) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}
const recordFileName = String(params.get("fileName") || "待录入试卷.pdf").trim();
const isWorkbook = contextName === "series";
const isCanvasShell = Boolean(document.querySelector("#aiSelectedPanel")) && !document.querySelector("#questionCardBoard");
const isHomeShell = isCanvasShell;
const isEmbeddedCanvasShell = isCanvasShell && document.body.classList.contains("is-embedded");
const initialTopicId = params.get("topic") || (isWorkbook ? "t9" : "t2");
// 试卷 / 专项 / 同步等共用同一工作台，避免从首页点不同类型资源时 tab 互相隔离
const STORAGE_KEY = "feixiang-ai-workspace-v5";
const CANVAS_COLLAPSE_KEY = "feixiang-ai-canvas-panel-v2";
const PENDING_TOAST_KEY = "feixiang-ai-pending-toast";
const NEW_CANVAS_DISPLAY_TITLE = "未命名题单";
const LEGACY_CANVAS_DISPLAY_TITLE = "新题单（尚未创建）";
const LEGACY_STORAGE_KEYS = [
  "feixiang-ai-workspace-v4-paper",
  "feixiang-ai-workspace-v4-special",
  "feixiang-ai-workspace-v4-chapter",
  "feixiang-ai-workspace-v4-series",
  "feixiang-ai-workspace-v2",
  "feixiang-ai-workspace-v1"
];
try {
  sessionStorage.removeItem("feixiang-ai-workspace-v3");
} catch {}

const workbookCatalog = {
  t9: {
    title: "有理数运算基础过关配套题单",
    shortTitle: "有理数过关",
    source: "多维导学案",
    difficulty: "中等",
    questionCount: 20,
    usage: 1143
  },
  t7: {
    title: "整式运算高频易错巩固题单",
    shortTitle: "整式易错",
    source: "全品学练考",
    difficulty: "中等",
    questionCount: 14,
    usage: 522
  },
  t19: {
    title: "课内基础到探究题：进阶提升题单",
    shortTitle: "进阶提升",
    source: "常用提优训练系列",
    difficulty: "中等",
    questionCount: 18,
    usage: 831
  }
};

const workbookDirectory = {
  kicker: "练习册目录",
  title: "多维导学案 · 七年级上册",
  summary: "共 6 章 · 36 课时",
  breadcrumb: ["多维导学案", "第一章 丰富的图形世界"],
  chapters: [
    {
      id: "407962",
      title: "第一章 丰富的图形世界",
      expanded: false,
      lessons: [
        { title: "第 1 课时 生活中的立体图形（1）" },
        { title: "第 2 课时 生活中的立体图形（2）" },
        { title: "第 3 课时 从立体图形到平面图形（1）——正方体的展开与折叠" },
        { title: "第 4 课时 从立体图形到平面图形（2）——柱体、锥体的展开与折叠", active: true },
        { title: "第 5 课时 从立体图形到平面图形（3）——截一个几何体" },
        { title: "第 6 课时 从三个方向看物体的形状" }
      ]
    },
    { id: "407963", title: "第二章 有理数及其运算", expanded: false, lessons: [] },
    { id: "407964", title: "第三章 整式及其加减", expanded: false, lessons: [] },
    { id: "407965", title: "第四章 基本平面图形", expanded: false, lessons: [] },
    { id: "407966", title: "第五章 一元一次方程", expanded: false, lessons: [] },
    { id: "407967", title: "第六章 数据的收集与整理", expanded: false, lessons: [] }
  ]
};

let workspace = loadWorkspace();
aiAssistantTabOpen = Boolean(workspace.courseCenterTabOpen);
let applyingRemoteWorkspace = false;
let canvasSyncChannel = null;
let tabCounter = workspace.tabs.reduce((max, tab) => {
  const n = Number.parseInt(String(tab.id).replace("tab-", ""), 10);
  return Number.isFinite(n) ? Math.max(max, n) : max;
}, 0);
let basketCount = workspace.basketCount || 0;

function getBaseTopicId(topicId) {
  return String(topicId || "").replace(/-q\d+$/, "");
}

function tabIsWorkbook(tab) {
  return (tab?.context || contextName) === "series";
}

function tabIsSpecial(tab) {
  return (tab?.context || contextName) === "special";
}

function tabContextLabel(tab) {
  const ctx = tab?.context || contextName;
  if (ctx === "series") return "练习册";
  if (ctx === "special") return "专题";
  if (ctx === "chapter") return "同步练习";
  return "试卷";
}

function isUserEditableTab(tab) {
  return Boolean(tab
    && !tab.fromQuestionId
    && (tab.kind === "editor" || (!tab.aiGenerated && (tab.isQuestionList || tab.myResourceId))));
}

function isTabTitleEditable(tab) {
  return Boolean(isUserEditableTab(tab) && tab.kind !== "editor");
}

function tabDocIcon(tab) {
  if (isUserEditableTab(tab)) return "ri-edit-box-line";
  if (tabIsWorkbook(tab)) return "ri-book-open-line";
  if (tabIsSpecial(tab)) return "ri-focus-3-line";
  if ((tab?.context || "") === "chapter") return "ri-book-open-line";
  return "ri-file-list-3-line";
}

function shortenTabTitle(title, max = 12) {
  const text = String(title || "").trim();
  if (!text) return "题单";
  if (text.length <= max) return text;
  const cut = text.split(/[：:·—-]/)[0].trim();
  if (cut && cut.length <= max) return cut;
  return `${text.slice(0, max)}…`;
}

function getTabBaseTitle(tab) {
  if (tab?.meta?.title) return tab.meta.title;
  return String(tab?.title || "")
    .replace(/\s*·\s*第 \d+ 题(?:\s*·\s*第 \d+ 题)*$/g, "")
    .trim();
}

function defaultWorkspace() {
  return {
    tabs: [],
    activeTabId: null,
    homeActive: false,
    browseTabs: [],
    activeBrowseFilter: null,
    basketCount: 0,
    showAnswers: false,
    paperFavorited: false,
    globalSelectedQuestions: [],
    favoriteQuestions: [],
    canvasTitle: "",
    canvasScores: {},
    canvasResourceId: null,
    canvasSavedSignature: "",
    canvasDraftClosed: false,
    paperEditSession: null,
    canvasManuallyCollapsed: false,
    myQuestionLists: [],
    favoriteResources: [],
    downloadRecords: [],
    courseCenterTabOpen: false,
    courseCenterView: "resources",
    activeQuestionDraftTabId: null,
    addQuestionTargetTabId: null,
    addQuestionPickingActive: false,
    paperSaveSignatures: {}
  };
}

function parseWorkspaceRaw(saved) {
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return null;
    delete parsed.aiPanelHidden;
    if (Array.isArray(parsed.tabs)) {
      parsed.tabs = parsed.tabs.map(tab => {
        const normalized = {
          ...tab,
          context: tab.context || contextName,
          topicId: tab.fromQuestionId ? tab.topicId : getBaseTopicId(tab.topicId)
        };
        if (normalized.kind !== "editor" && !normalized.isQuestionList && !normalized.fromQuestionId) {
          const preserveZhongkao = /中考/.test(`${normalized.title || ""}${normalized.meta?.title || ""}`);
          normalized.title = normalizeWorkspaceCatalogCopy(normalized.title, preserveZhongkao);
          normalized.shortTitle = normalizeWorkspaceCatalogCopy(normalized.shortTitle, preserveZhongkao);
          if (!preserveZhongkao && /卷$/.test(normalized.shortTitle || "")) {
            normalized.shortTitle = `${normalized.shortTitle} · 2026-2027学年`;
          }
          normalized.meta = {
            ...(normalized.meta || {}),
            title: normalizeWorkspaceCatalogCopy(normalized.meta?.title, preserveZhongkao),
            shortTitle: normalizeWorkspaceCatalogCopy(normalized.meta?.shortTitle, preserveZhongkao),
            focus: normalizeWorkspaceCatalogCopy(normalized.meta?.focus, preserveZhongkao),
            reason: normalizeWorkspaceCatalogCopy(normalized.meta?.reason, preserveZhongkao),
            source: normalizeWorkspaceCatalogCopy(normalized.meta?.source, preserveZhongkao)
          };
        }
        return normalized;
      });
      parsed.tabs.forEach(tab => {
        if (tab.kind !== "editor" || !tab.editorDraft) return;
        const sourceTab = parsed.tabs.find(item => item.id === tab.sourceTabId);
        if (!String(tab.editorDraft.sourceTitle || "").trim()) {
          tab.editorDraft.sourceTitle = String(sourceTab?.title || tab.editorDraft.title || "").trim();
        }
        const normalizedDraftTitle = stripEditorTitlePrefix(tab.editorDraft.title);
        const normalizedSourceTitle = stripEditorTitlePrefix(tab.editorDraft.sourceTitle);
        if (typeof tab.editorDraft.titleCustomized !== "boolean") {
          tab.editorDraft.titleCustomized = tab.editorSource === "whole-paper"
            ? Boolean(normalizedDraftTitle && normalizedSourceTitle && normalizedDraftTitle !== normalizedSourceTitle)
            : false;
        }
        tab.editorDraft.title = normalizedDraftTitle
          || (tab.editorSource === "whole-paper" ? normalizedSourceTitle : "");
        syncEditorTabTitle(tab);
      });
      const legacyActiveEditor = parsed.tabs.find(tab => tab.id === parsed.activeTabId && tab.kind === "editor");
      if (legacyActiveEditor) {
        parsed.activeQuestionDraftTabId = legacyActiveEditor.id;
        const sourceTab = parsed.tabs.find(tab => tab.id === legacyActiveEditor.sourceTabId && tab.kind !== "editor");
        parsed.activeTabId = sourceTab?.id || parsed.tabs.find(tab => tab.kind !== "editor")?.id || null;
      }
    }
    return {
      ...defaultWorkspace(),
      ...parsed,
      browseTabs: Array.isArray(parsed.browseTabs) ? parsed.browseTabs : [],
      activeBrowseFilter: parsed.activeBrowseFilter || null,
      globalSelectedQuestions: Array.isArray(parsed.globalSelectedQuestions) ? parsed.globalSelectedQuestions : [],
      favoriteQuestions: Array.isArray(parsed.favoriteQuestions) ? parsed.favoriteQuestions : [],
      myQuestionLists: Array.isArray(parsed.myQuestionLists) ? parsed.myQuestionLists : [],
      favoriteResources: Array.isArray(parsed.favoriteResources) ? parsed.favoriteResources : [],
      downloadRecords: Array.isArray(parsed.downloadRecords) ? parsed.downloadRecords : [],
      courseCenterTabOpen: Boolean(parsed.courseCenterTabOpen),
      courseCenterView: ["resources", "favorites", "downloads"].includes(parsed.courseCenterView)
        ? parsed.courseCenterView
        : "resources",
      canvasScores: parsed.canvasScores && typeof parsed.canvasScores === "object" ? parsed.canvasScores : {},
      paperEditSession: parsed.paperEditSession && typeof parsed.paperEditSession === "object"
        ? parsed.paperEditSession
        : null,
      paperSaveSignatures: parsed.paperSaveSignatures && typeof parsed.paperSaveSignatures === "object"
        ? parsed.paperSaveSignatures
        : {}
    };
  } catch {
    return null;
  }
}

function canvasQuestionCount(ws) {
  return Array.isArray(ws?.globalSelectedQuestions) ? ws.globalSelectedQuestions.length : 0;
}

function mergeWorkspaceRecords(first = [], second = [], timeKey = "updatedAt") {
  const records = new Map();
  [...first, ...second].forEach(record => {
    if (!record?.id) return;
    const current = records.get(record.id);
    if (!current || String(record[timeKey] || "") >= String(current[timeKey] || "")) {
      records.set(record.id, record);
    }
  });
  return [...records.values()].sort((a, b) => String(b[timeKey] || "").localeCompare(String(a[timeKey] || "")));
}

function mergeWorkspaces(localWs, sessionWs) {
  if (!localWs) return sessionWs;
  if (!sessionWs) return localWs;
  const canvasSource = canvasQuestionCount(sessionWs) > canvasQuestionCount(localWs) ? sessionWs : localWs;
  const favoriteSource = (sessionWs.favoriteQuestions?.length || 0) > (localWs.favoriteQuestions?.length || 0) ? sessionWs : localWs;
  const resourceMap = new Map();
  [...(sessionWs.myQuestionLists || []), ...(localWs.myQuestionLists || [])].forEach(resource => {
    if (!resource?.id) return;
    const current = resourceMap.get(resource.id);
    if (!current || String(resource.updatedAt || "") >= String(current.updatedAt || "")) resourceMap.set(resource.id, resource);
  });
  return {
    ...sessionWs,
    ...localWs,
    tabs: (localWs.tabs?.length || 0) >= (sessionWs.tabs?.length || 0) ? localWs.tabs : sessionWs.tabs,
    globalSelectedQuestions: canvasSource.globalSelectedQuestions,
    canvasTitle: canvasSource.canvasTitle || localWs.canvasTitle || sessionWs.canvasTitle || "",
    canvasScores: {
      ...(sessionWs.canvasScores || {}),
      ...(localWs.canvasScores || {})
    },
    favoriteQuestions: favoriteSource.favoriteQuestions,
    canvasManuallyCollapsed: Boolean(localWs.canvasManuallyCollapsed || sessionWs.canvasManuallyCollapsed),
    myQuestionLists: [...resourceMap.values()].sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))),
    favoriteResources: mergeWorkspaceRecords(
      sessionWs.favoriteResources,
      localWs.favoriteResources,
      "favoritedAt"
    ),
    downloadRecords: mergeWorkspaceRecords(
      sessionWs.downloadRecords,
      localWs.downloadRecords,
      "downloadedAt"
    ),
    courseCenterTabOpen: Boolean(localWs.courseCenterTabOpen || sessionWs.courseCenterTabOpen),
    courseCenterView: localWs.courseCenterView || sessionWs.courseCenterView || "resources",
    paperSaveSignatures: {
      ...(sessionWs.paperSaveSignatures || {}),
      ...(localWs.paperSaveSignatures || {})
    }
  };
}

function loadWorkspace() {
  try {
    let localWs = null;
    let sessionWs = null;
    try {
      sessionWs = parseWorkspaceRaw(sessionStorage.getItem(STORAGE_KEY));
    } catch {}
    try {
      localWs = parseWorkspaceRaw(localStorage.getItem(STORAGE_KEY));
    } catch {}
    const merged = mergeWorkspaces(localWs, sessionWs);
    if (merged) return merged;
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacy = parseWorkspaceRaw(sessionStorage.getItem(legacyKey) || localStorage.getItem(legacyKey));
      if (legacy) {
        try { sessionStorage.removeItem(legacyKey); } catch {}
        return legacy;
      }
    }
  } catch {}
  return defaultWorkspace();
}

function saveWorkspace() {
  if (applyingRemoteWorkspace) return;
  const json = JSON.stringify(workspace);
  sessionStorage.setItem(STORAGE_KEY, json);
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch {}
  broadcastCanvasSync();
}

function cloneWorkspaceValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function captureCanvasStateForPaperEdit() {
  return {
    globalSelectedQuestions: cloneWorkspaceValue(Array.isArray(workspace.globalSelectedQuestions)
      ? workspace.globalSelectedQuestions
      : []),
    canvasTitle: workspace.canvasTitle || "",
    canvasScores: cloneWorkspaceValue(workspace.canvasScores && typeof workspace.canvasScores === "object"
      ? workspace.canvasScores
      : {}),
    canvasManuallyCollapsed: Boolean(workspace.canvasManuallyCollapsed),
    selectedQuestionIdsByTab: Object.fromEntries((workspace.tabs || []).map(tab => [
      tab.id,
      cloneWorkspaceValue(Array.isArray(tab.selectedQuestionIds) ? tab.selectedQuestionIds : [])
    ]))
  };
}

function restoreCanvasStateAfterPaperEdit(session) {
  const snapshot = session?.canvasSnapshot;
  if (!snapshot || typeof snapshot !== "object") return;
  workspace.globalSelectedQuestions = cloneWorkspaceValue(Array.isArray(snapshot.globalSelectedQuestions)
    ? snapshot.globalSelectedQuestions
    : []);
  workspace.canvasTitle = snapshot.canvasTitle || "";
  workspace.canvasScores = cloneWorkspaceValue(snapshot.canvasScores && typeof snapshot.canvasScores === "object"
    ? snapshot.canvasScores
    : {});
  workspace.canvasManuallyCollapsed = Boolean(snapshot.canvasManuallyCollapsed);
  const selectedByTab = snapshot.selectedQuestionIdsByTab || {};
  (workspace.tabs || []).forEach(tab => {
    if (Object.prototype.hasOwnProperty.call(selectedByTab, tab.id)) {
      tab.selectedQuestionIds = cloneWorkspaceValue(Array.isArray(selectedByTab[tab.id]) ? selectedByTab[tab.id] : []);
    }
  });
}

function paperSaveKey(tab) {
  return `paper-copy:${tab?.id || `${tab?.context || contextName}:${getBaseTopicId(tab?.topicId || initialTopicId)}`}`;
}

function paperCopySignature(tab) {
  if (!tab) return "";
  const questions = (tab.questions || [])
    .filter(question => !(tab.removedQuestionIds || []).includes(question.id))
    .map(question => {
      const resolved = resolveTabQuestion(tab, question);
      return {
        id: question.id,
        stem: resolved.stem,
        options: resolved.options,
        answer: resolved.answer,
        analysis: resolved.analysis,
        knowledge: resolved.knowledge
      };
    });
  return JSON.stringify({ title: String(tab.title || "").trim(), questions });
}

function isCurrentPaperCopySaved(tab) {
  if (!tab || tab.isQuestionList) return false;
  return workspace.paperSaveSignatures?.[paperSaveKey(tab)] === paperCopySignature(tab);
}

function formatResourceTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "刚刚创建";
  const pad = number => String(number).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function registerMyQuestionList(tab) {
  if (!tab) return null;
  const now = new Date().toISOString();
  const resourceId = tab.myResourceId || `resource-${Date.now()}-${tabCounter}`;
  tab.myResourceId = resourceId;
  const snapshot = cloneWorkspaceValue(tab);
  const existing = (workspace.myQuestionLists || []).find(item => item.id === resourceId);
  const resource = {
    id: resourceId,
    title: String(tab.title || "未命名题单").trim() || "未命名题单",
    questionCount: (tab.questions || []).filter(question => !(tab.removedQuestionIds || []).includes(question.id)).length,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    tab: snapshot
  };
  workspace.myQuestionLists = [resource, ...(workspace.myQuestionLists || []).filter(item => item.id !== resourceId)];
  renderMyResources();
  return resource;
}

function syncMyQuestionListResourceTitle(tab) {
  if (!tab?.myResourceId) return;
  const resource = (workspace.myQuestionLists || []).find(item => item.id === tab.myResourceId);
  if (!resource) return;
  const title = String(tab.title || "未命名题单").trim() || "未命名题单";
  const shortTitle = shortenTabTitle(title);
  resource.title = title;
  resource.updatedAt = new Date().toISOString();
  resource.tab = {
    ...(resource.tab || cloneWorkspaceValue(tab)),
    title,
    shortTitle,
    customTitle: true,
    meta: {
      ...(resource.tab?.meta || tab.meta || {}),
      title,
      shortTitle
    }
  };
  renderMyResources();
  renderCourseCenter();
}

function openMyQuestionList(resourceId, options = {}) {
  const resource = (workspace.myQuestionLists || []).find(item => item.id === resourceId);
  if (!resource?.tab) return;
  let draftTab = workspace.tabs.find(item => item.kind === "editor" && item.editorDraft?.savedResourceId === resource.id);
  if (!draftTab) {
    const sourceTab = cloneWorkspaceValue(resource.tab);
    const items = (sourceTab.questions || [])
      .filter(question => !(sourceTab.removedQuestionIds || []).includes(question.id))
      .map(question => buildGlobalSelectedEntry(sourceTab, question));
    draftTab = createEditorTab({
      editorSource: "resource",
      sourceTab: getActiveTab(),
      title: resource.title || sourceTab.title || NEW_CANVAS_DISPLAY_TITLE,
      items,
      scores: {},
      expand: options.expand !== false,
      preserveRight: Boolean(options.preserveRight),
      forceNew: true
    });
    if (draftTab?.editorDraft) {
      draftTab.editorDraft.savedResourceId = resource.id;
      draftTab.editorDraft.saved = true;
      draftTab.editorDraft.dirty = false;
      draftTab.editorDraft.titleCustomized = true;
      draftTab.myResourceId = resource.id;
      syncEditorTabTitle(draftTab);
    }
  } else {
    activateEditorTab(draftTab, {
      expand: options.expand !== false,
      preserveRight: Boolean(options.preserveRight)
    });
  }
  closeMyResources();
  saveWorkspace();
  renderAll();
}

function renderMyResources() {
  const list = document.querySelector("#myResourcesList");
  const count = document.querySelector("#myResourcesCount");
  const resources = workspace.myQuestionLists || [];
  if (count) {
    count.hidden = resources.length === 0;
    count.textContent = String(resources.length);
  }
  if (!list) return;
  if (!resources.length) {
    list.innerHTML = `<div class="my-resources-empty"><i class="ri-folder-open-line"></i><strong>还没有题单</strong><span>创建或保存题单后，会显示在「我的-我的创建」</span></div>`;
    return;
  }
  list.innerHTML = resources.map(resource => `
    <button type="button" class="my-resource-card" data-resource-id="${escapeHtml(resource.id)}">
      <span class="my-resource-icon"><i class="ri-file-list-3-line"></i></span>
      <span class="my-resource-main">
        <strong>${escapeHtml(resource.title || "未命名题单")}</strong>
        <small>${Number(resource.questionCount || 0)} 题 · ${escapeHtml(formatResourceTime(resource.updatedAt))}</small>
      </span>
      <i class="ri-arrow-right-s-line my-resource-arrow"></i>
    </button>`).join("");
  list.querySelectorAll("[data-resource-id]").forEach(button => {
    button.addEventListener("click", () => openMyQuestionList(button.dataset.resourceId));
  });
}

function syncMyResourcesChrome(open) {
  const panel = document.querySelector("#myResourcesPanel");
  const button = document.querySelector("#myResourcesButton");
  if (panel) panel.hidden = !open;
  if (button) {
    button.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }
}

function openMyResources() {
  renderMyResources();
  syncMyResourcesChrome(true);
}

function closeMyResources() {
  syncMyResourcesChrome(false);
}

function toggleMyResources() {
  const panel = document.querySelector("#myResourcesPanel");
  if (panel?.hidden) openMyResources();
  else closeMyResources();
}

function visibleTabQuestions(tab) {
  if (!tab) return [];
  return (tab.questions || [])
    .filter(question => !(tab.removedQuestionIds || []).includes(question.id))
    .map(question => resolveTabQuestion(tab, question));
}

function courseResourceKey(tab) {
  if (!tab) return "";
  if (tab.myResourceId) return `resource:${tab.myResourceId}`;
  const topicId = getBaseTopicId(tab.topicId);
  const lessonKey = String(tab.lessonKey || tab.title || "").trim();
  return `${tab.context || contextName}:${topicId}:${lessonKey}`;
}

function snapshotCourseTab(tab) {
  if (!tab) return null;
  const snapshot = cloneWorkspaceValue(tab);
  snapshot.questions = visibleTabQuestions(tab);
  snapshot.removedQuestionIds = [];
  snapshot.modifiedQuestions = {};
  snapshot.selectedQuestionIds = [];
  return snapshot;
}

function ensureFavoriteResources() {
  if (!Array.isArray(workspace.favoriteResources)) workspace.favoriteResources = [];
  return workspace.favoriteResources;
}

function ensureDownloadRecords() {
  if (!Array.isArray(workspace.downloadRecords)) workspace.downloadRecords = [];
  return workspace.downloadRecords;
}

function isTabFavorited(tab) {
  const key = courseResourceKey(tab);
  return Boolean(key && ensureFavoriteResources().some(record => record.resourceKey === key));
}

function toggleTabFavorite(tab) {
  if (!tab) return false;
  const resourceKey = courseResourceKey(tab);
  if (!resourceKey) return false;
  const records = ensureFavoriteResources();
  const index = records.findIndex(record => record.resourceKey === resourceKey);
  if (index >= 0) {
    records.splice(index, 1);
    workspace.paperFavorited = false;
    saveWorkspace();
    return false;
  }
  records.unshift({
    id: `favorite:${resourceKey}`,
    resourceKey,
    title: String(tab.title || "未命名资源"),
    questionCount: visibleTabQuestions(tab).length,
    favoritedAt: new Date().toISOString(),
    tab: snapshotCourseTab(tab)
  });
  workspace.paperFavorited = true;
  saveWorkspace();
  return true;
}

function registerDownload(tab, format = "Word") {
  if (!tab) return null;
  const resourceKey = courseResourceKey(tab);
  if (!resourceKey) return null;
  const record = {
    id: `download:${resourceKey}:${String(format).toLowerCase()}`,
    resourceKey,
    title: String(tab.title || "未命名资源"),
    questionCount: visibleTabQuestions(tab).length,
    format,
    downloadedAt: new Date().toISOString(),
    tab: snapshotCourseTab(tab)
  };
  workspace.downloadRecords = [
    record,
    ...ensureDownloadRecords().filter(item => item.id !== record.id)
  ].slice(0, 30);
  saveWorkspace();
  return record;
}

function findFavoriteQuestionEntry(selectionKey) {
  const selected = (workspace.globalSelectedQuestions || []).find(item => item.selectionKey === selectionKey);
  if (selected?.question) return cloneWorkspaceValue(selected);
  const candidates = [
    ...(workspace.tabs || []),
    ...(workspace.myQuestionLists || []).map(resource => resource.tab).filter(Boolean)
  ];
  for (const tab of candidates) {
    const question = (tab.questions || []).find(item => getQuestionSelectionKey(tab.topicId, item.id) === selectionKey);
    if (question) return buildGlobalSelectedEntry(tab, question);
  }
  return null;
}

function courseCenterItems(view) {
  if (view === "resources") {
    return (workspace.myQuestionLists || []).map(resource => {
      const questions = visibleTabQuestions(resource.tab);
      return {
        id: resource.id,
        source: "resource",
        kind: "resource",
        title: resource.title || "未命名题单",
        questionCount: questions.length || Number(resource.questionCount || 0),
        minutes: questions.reduce((sum, question) => sum + canvasQuestionMinutes(question), 0),
        createdAt: resource.createdAt || resource.updatedAt,
        tab: resource.tab
      };
    });
  }
  if (view === "recordings") {
    return (workspace.tabs || []).filter(tab => tab.recordSession).map(tab => ({
      id: tab.id,
      source: "recording",
      kind: "recording",
      title: tab.recordFileName?.replace(/\.[^.]+$/, "") || tab.title || "AI录题",
      questionCount: visibleTabQuestions(tab).length,
      time: tab.meta?.createdAt || "",
      note: "AI录题",
      tab
    }));
  }
  if (view === "downloads") {
    return ensureDownloadRecords().map(record => ({
      ...record,
      source: "download",
      kind: "resource",
      time: record.downloadedAt,
      note: `${record.format || "文件"} · 最近下载`
    }));
  }
  const resourceFavorites = ensureFavoriteResources().map(record => ({
    ...record,
    source: "favorite",
    kind: "resource",
    time: record.favoritedAt,
    note: "收藏的资源"
  }));
  const questionFavorites = ensureFavoriteQuestions().flatMap(selectionKey => {
    const entry = findFavoriteQuestionEntry(selectionKey);
    if (!entry?.question) return [];
    return [{
      id: `favorite-question:${selectionKey}`,
      source: "favorite-question",
      kind: "question",
      selectionKey,
      title: entry.question.stem || `第 ${entry.question.num || ""} 题`,
      questionCount: 1,
      time: "",
      note: `${entry.sourceTitle || "收藏题目"} · ${entry.question.knowledge || entry.question.type || "题目"}`,
      entry
    }];
  });
  return [...resourceFavorites, ...questionFavorites];
}

function courseCenterEmptyHtml(view) {
  const copy = view === "favorites"
    ? { icon: "ri-star-line", title: "还没有可用的收藏", note: "在试卷或题目中点击收藏后，会显示在这里。" }
    : view === "downloads"
      ? { icon: "ri-download-cloud-2-line", title: "还没有下载记录", note: "下载过的题单和试卷会显示在这里。" }
      : view === "recordings"
        ? { icon: "ri-scan-2-line", title: "还没有录题记录", note: "上传图片、PDF 或 Word，开始第一次 AI 录题。" }
        : { icon: "ri-folder-open-line", title: "还没有我的创建", note: "保存题单或编辑副本后，会显示在这里。" };
  return `<div class="course-center-empty"><i class="${copy.icon}"></i><strong>${copy.title}</strong><span>${copy.note}</span></div>`;
}

function courseCenterItemHtml(item) {
  const selected = item.kind === "question"
    ? getGlobalSelectedQuestions().some(entry => entry.selectionKey === item.selectionKey)
    : false;
  const icon = item.kind === "question" ? "ri-question-line" : item.source === "recording" ? "ri-scan-2-line" : item.source === "download" ? "ri-download-cloud-2-line" : item.source === "favorite" ? "ri-star-line" : "ri-file-list-3-line";
  const time = item.time ? formatResourceTime(item.time) : "";
  const resourceMeta = item.source === "resource"
    ? `<p class="course-center-resource-meta">
        <span title="用时" aria-label="用时 ${Number(item.minutes || 0)} 分钟"><i class="ri-time-line" aria-hidden="true"></i>${Number(item.minutes || 0)} 分钟</span>
        <span title="题量" aria-label="题量 ${Number(item.questionCount || 0)} 题"><i class="ri-file-list-3-line" aria-hidden="true"></i>${Number(item.questionCount || 0)} 题</span>
        ${item.createdAt ? `<span title="创建日期" aria-label="创建日期 ${escapeHtml(formatResourceTime(item.createdAt))}"><i class="ri-calendar-line" aria-hidden="true"></i>${escapeHtml(formatResourceTime(item.createdAt))}</span>` : ""}
      </p>`
    : `<p>${escapeHtml(`${item.note || "题单"}${item.questionCount ? ` · ${item.questionCount} 题` : ""}${time ? ` · ${time}` : ""}`)}</p>`;
  return `<article class="course-center-card" data-course-source="${escapeHtml(item.source)}" data-course-id="${escapeHtml(item.id)}">
    <span class="course-center-card-icon"><i class="${icon}"></i></span>
    <div class="course-center-card-copy">
      <strong>${escapeHtml(item.title)}</strong>
      ${resourceMeta}
    </div>
    <div class="course-center-card-actions">
      ${item.source === "recording"
    ? `<button type="button" class="is-primary" data-course-action="open"><i class="ri-eye-line"></i>查看</button>`
    : item.source === "resource"
    ? `<button type="button" data-course-action="edit"><i class="ri-edit-box-line"></i>编辑</button>
         <button type="button" class="is-primary" data-course-action="open"><i class="ri-eye-line"></i>查看</button>`
    : `${item.kind === "resource" ? `<button type="button" data-course-action="open">查看</button>` : ""}
         <button type="button" class="is-primary ${selected ? "is-selected" : ""}" data-course-action="add">
           <i class="${selected ? "ri-check-line" : "ri-add-line"}"></i>${selected ? "已选用" : item.kind === "resource" ? "整份选用" : "选用"}
         </button>`}
    </div>
  </article>`;
}

function renderCourseCenter() {
  const list = document.querySelector("#courseCenterList");
  if (!list) return;
  const view = ["resources", "favorites", "downloads"].includes(workspace.courseCenterView)
    ? workspace.courseCenterView
    : "resources";
  const allItems = courseCenterItems(view);
  const query = courseCenterQuery.trim().toLowerCase();
  const filteredItems = allItems.filter(item => !query || `${item.title} ${item.note || ""}`.toLowerCase().includes(query));
  const pageSize = 5;
  const pageCount = view === "resources" ? Math.max(1, Math.ceil(filteredItems.length / pageSize)) : 1;
  courseCenterPage = Math.min(Math.max(1, courseCenterPage), pageCount);
  const items = view === "resources"
    ? filteredItems.slice((courseCenterPage - 1) * pageSize, courseCenterPage * pageSize)
    : filteredItems;
  const counts = {
    resources: courseCenterItems("resources").length,
    recordings: courseCenterItems("recordings").length,
    favorites: courseCenterItems("favorites").length,
    downloads: courseCenterItems("downloads").length
  };
  const targetTab = (workspace.tabs || []).find(tab => tab.id === workspace.addQuestionTargetTabId && tab.kind === "editor");
  const target = document.querySelector("#courseCenterTarget");
  if (target) target.textContent = targetTab?.editorDraft ? questionDraftTabLabel(targetTab) : questionDraftTabLabel();
  document.querySelector("#courseResourceCount") && (document.querySelector("#courseResourceCount").textContent = String(counts.resources));
  document.querySelector("#courseRecordingCount") && (document.querySelector("#courseRecordingCount").textContent = String(counts.recordings));
  document.querySelector("#courseFavoriteCount") && (document.querySelector("#courseFavoriteCount").textContent = String(counts.favorites));
  document.querySelector("#courseDownloadCount") && (document.querySelector("#courseDownloadCount").textContent = String(counts.downloads));
  document.querySelectorAll("[data-course-view]").forEach(button => {
    button.classList.toggle("is-active", button.dataset.courseView === view);
  });
  const recordingTools = document.querySelector("#courseRecordingTools");
  if (recordingTools) recordingTools.hidden = view !== "recordings";
  list.innerHTML = items.length ? items.map(courseCenterItemHtml).join("") : courseCenterEmptyHtml(view);
  const pagination = document.querySelector("#courseCenterPagination");
  if (pagination) {
    pagination.hidden = view !== "resources" || pageCount <= 1;
    pagination.innerHTML = pageCount > 1 ? `
      <button type="button" data-course-page="prev" ${courseCenterPage <= 1 ? "disabled" : ""}><i class="ri-arrow-left-s-line"></i>上一页</button>
      <span>第 ${courseCenterPage} / ${pageCount} 页</span>
      <button type="button" data-course-page="next" ${courseCenterPage >= pageCount ? "disabled" : ""}>下一页<i class="ri-arrow-right-s-line"></i></button>` : "";
  }
  renderAiGroupHistory();
}

function resolveCourseCenterItem(source, id) {
  return courseCenterItems(source === "resource" ? "resources" : source === "recording" ? "recordings" : source === "download" ? "downloads" : "favorites")
    .find(item => item.source === source && item.id === id);
}

function openCourseCenterResource(item) {
  if (!item?.tab) return;
  if (item.source === "recording") {
    aiAssistantOpen = false;
    workspace.courseCenterTabOpen = true;
    saveWorkspace();
    switchTab(item.tab.id);
    return;
  }
  const sourceKey = item.source === "resource"
    ? `my-resource:${item.id}`
    : item.resourceKey || courseResourceKey(item.tab);
  let tab = workspace.tabs.find(candidate => candidate.kind !== "editor"
    && (candidate.courseSourceKey === sourceKey || courseResourceKey(candidate) === sourceKey));
  if (!tab) {
    tabCounter += 1;
    tab = {
      ...cloneWorkspaceValue(item.tab),
      id: `tab-${tabCounter}`,
      courseSourceKey: sourceKey,
      selectedQuestionIds: [],
      // 「查看」属于右侧题目浏览，不把个人资源误当成左侧编辑草稿。
      kind: undefined,
      editorDraft: undefined,
      isQuestionList: false,
      myResourceId: null,
      resourcePreview: item.source === "resource"
    };
    workspace.tabs.push(tab);
  }
  selectedPanelEnlarged = false;
  rightPanelSectionState.selectedCollapsed = false;
  rightPanelSectionState.browseCollapsed = false;
  workspace.courseCenterView = item.source === "resource" ? "resources" : workspace.courseCenterView;
  workspace.courseCenterTabOpen = true;
  aiAssistantTabOpen = true;
  aiAssistantOpen = false;
  workspace.activeTabId = tab.id;
  workspace.homeActive = false;
  workspace.activeBrowseFilter = null;
  saveWorkspace();
  renderAll();
  applySelectedPanelState();
}

function aiGroupHistoryItems() {
  const items = [];
  const seen = new Set();
  (workspace.tabs || []).filter(tab => tab.aiGenerated && !tab.recordSession).forEach(tab => {
    const key = tab.topicId || tab.id;
    if (seen.has(key)) return;
    seen.add(key);
    items.push({ id: tab.id, source: "tab", title: tab.title || "AI组题", prompt: tab.meta?.aiPrompt || "AI生成题单", questionCount: visibleTabQuestions(tab).length, time: tab.meta?.createdAt || "" });
  });
  (workspace.myQuestionLists || []).filter(resource => resource.tab?.aiGenerated && !resource.tab?.recordSession).forEach(resource => {
    const key = resource.tab?.topicId || resource.id;
    if (seen.has(key)) return;
    seen.add(key);
    items.push({ id: resource.id, source: "resource", title: resource.title || "AI组题", prompt: resource.tab?.meta?.aiPrompt || "已保存到我的创建", questionCount: visibleTabQuestions(resource.tab).length, time: resource.updatedAt || resource.createdAt || "" });
  });
  return items.reverse();
}

function renderAiGroupHistory() {
  const list = document.querySelector("#courseAiHistoryList");
  if (!list) return;
  const items = aiGroupHistoryItems();
  const visibleItems = aiGroupHistoryExpanded ? items : items.slice(0, 2);
  const more = document.querySelector("#courseAiHistoryMore");
  if (more) {
    more.hidden = items.length <= 2;
    more.innerHTML = aiGroupHistoryExpanded ? `收起 <i class="ri-arrow-up-s-line"></i>` : `查看更多 <i class="ri-arrow-down-s-line"></i>`;
  }
  list.classList.toggle("is-expanded", aiGroupHistoryExpanded);
  list.innerHTML = visibleItems.length ? visibleItems.map(item => `<article class="course-center-history-item" data-ai-history-source="${item.source}" data-ai-history-id="${escapeHtml(item.id)}">
    <span><i class="ri-sparkling-2-line"></i></span>
    <div><strong title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</strong><p>${escapeHtml(item.prompt)} · ${item.questionCount} 题${item.time ? ` · ${escapeHtml(formatResourceTime(item.time))}` : ""}</p></div>
    <button type="button">查看</button>
  </article>`).join("") : `<div class="course-center-history-empty">完成一次 AI 组题后，历史记录会显示在这里</div>`;
}

function addCourseCenterItemToCanvas(item) {
  if (!item) return;
  if (item.kind === "question") {
    const added = toggleExternalCanvasQuestion(cloneWorkspaceValue(item.entry));
    showToast(added ? "已选用" : "已取消选用");
    renderCourseCenter();
    return;
  }
  const tab = item.tab;
  if (!tab) return;
  const selectedItems = [...getGlobalSelectedQuestions()];
  const wasEmpty = selectedItems.length === 0;
  let added = 0;
  (tab.questions || []).forEach(question => {
    if ((tab.removedQuestionIds || []).includes(question.id)) return;
    const entry = buildGlobalSelectedEntry(tab, question);
    if (selectedItems.some(current => current.selectionKey === entry.selectionKey)) return;
    selectedItems.push(entry);
    added += 1;
  });
  if (!added) {
    showToast("这份内容已在本次组题中");
    return;
  }
  setActiveSelectedQuestions(selectedItems);
  markQuestionDestinationDirty();
  if (!workspace.canvasTitle) workspace.canvasTitle = formatQuestionListTitle();
  saveWorkspace();
  maybeOpenCanvasOnFirstAdd(wasEmpty);
  renderSelectedContext();
  renderCourseCenter();
  showToast(`已选用 ${added} 道题`);
}

function getCanvasSyncSnapshot() {
  return {
    globalSelectedQuestions: Array.isArray(workspace.globalSelectedQuestions) ? workspace.globalSelectedQuestions : [],
    canvasTitle: workspace.canvasTitle || "",
    canvasManuallyCollapsed: Boolean(workspace.canvasManuallyCollapsed),
    favoriteQuestions: Array.isArray(workspace.favoriteQuestions) ? workspace.favoriteQuestions : []
  };
}

function applyRemoteCanvasState(parsed) {
  if (!parsed || typeof parsed !== "object") return;
  const incoming = Array.isArray(parsed.globalSelectedQuestions) ? parsed.globalSelectedQuestions : [];
  const current = Array.isArray(workspace.globalSelectedQuestions) ? workspace.globalSelectedQuestions : [];
  if (!incoming.length && current.length) {
    try {
      const stored = parseWorkspaceRaw(localStorage.getItem(STORAGE_KEY));
      if (canvasQuestionCount(stored) > 0) return;
    } catch {}
  }
  applyingRemoteWorkspace = true;
  workspace.globalSelectedQuestions = incoming;
  workspace.canvasTitle = parsed.canvasTitle || "";
  workspace.canvasManuallyCollapsed = Boolean(parsed.canvasManuallyCollapsed);
  if (Array.isArray(parsed.favoriteQuestions)) workspace.favoriteQuestions = parsed.favoriteQuestions;
  rightPanelSectionState.selectedCollapsed = getActiveEditorTab() ? false : shouldCanvasStartCollapsed();
  applySelectedPanelState();
  renderQuestionCards();
  window.dispatchEvent(new CustomEvent("aiq-canvas-change"));
  applyingRemoteWorkspace = false;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  } catch {}
}

function broadcastCanvasSync() {
  try {
    canvasSyncChannel?.postMessage({ type: "canvas-sync", payload: getCanvasSyncSnapshot() });
  } catch {}
}

function bindCanvasSync() {
  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        applyRemoteCanvasState(JSON.parse(event.newValue));
      } catch {}
      return;
    }
    if (event.key === CANVAS_COLLAPSE_KEY) {
      workspace.canvasManuallyCollapsed = event.newValue === "1";
      rightPanelSectionState.selectedCollapsed = shouldCanvasStartCollapsed();
      applySelectedPanelState();
    }
  });
  try {
    canvasSyncChannel = new BroadcastChannel("feixiang-ai-canvas-sync");
    canvasSyncChannel.addEventListener("message", event => {
      if (event.data?.type === "canvas-sync") applyRemoteCanvasState(event.data.payload);
    });
  } catch {}
}

function getQuestionSelectionKey(topicId, qId) {
  return `${getBaseTopicId(topicId)}::${qId}`;
}

function ensureGlobalSelected() {
  if (!Array.isArray(workspace.globalSelectedQuestions)) {
    workspace.globalSelectedQuestions = [];
  }
  if (workspace.globalSelectedQuestions.length) return;
  workspace.tabs.forEach(tab => {
    if (tab.isQuestionList || tab.fromQuestionId) return;
    (tab.selectedQuestionIds || []).forEach(qId => {
      const q = tab.questions.find(item => item.id === qId);
      if (!q) return;
      const entry = buildGlobalSelectedEntry(tab, q);
      if (!workspace.globalSelectedQuestions.some(item => item.selectionKey === entry.selectionKey)) {
        workspace.globalSelectedQuestions.push(entry);
      }
    });
  });
}

function getQuestionDestinationEditorTab() {
  const active = getActiveEditorTab();
  if (active) return active;
  if (!workspace.addQuestionPickingActive) return null;
  return (workspace.tabs || []).find(tab => tab.id === workspace.addQuestionTargetTabId && tab.kind === "editor" && tab.editorDraft) || null;
}

function getQuestionDestinationDraft() {
  const tab = getQuestionDestinationEditorTab();
  if (!tab) return null;
  tab.editorDraft.questions = Array.isArray(tab.editorDraft.questions) ? tab.editorDraft.questions : [];
  return tab.editorDraft;
}

function markQuestionDestinationDirty() {
  const tab = getQuestionDestinationEditorTab();
  if (!tab?.editorDraft) return;
  tab.editorDraft.dirty = true;
  tab.editorDraft.saved = false;
  syncEditorTabTitle(tab);
  renderTabs();
}

function getGlobalSelectedQuestions() {
  const draft = getQuestionDestinationDraft();
  if (draft) return draft.questions;
  ensureGlobalSelected();
  return workspace.globalSelectedQuestions;
}

function getActiveEditorTab() {
  const tab = (workspace.tabs || []).find(item => item.id === workspace.activeQuestionDraftTabId);
  return tab?.kind === "editor" && tab.editorDraft ? tab : null;
}

function getActiveEditorDraft() {
  const tab = getActiveEditorTab();
  if (!tab) return null;
  tab.editorDraft.questions = Array.isArray(tab.editorDraft.questions) ? tab.editorDraft.questions : [];
  tab.editorDraft.scores = tab.editorDraft.scores && typeof tab.editorDraft.scores === "object" ? tab.editorDraft.scores : {};
  return tab.editorDraft;
}

function isWholePaperEditActive() {
  return Boolean(getActiveEditorDraft());
}

function setActiveSelectedQuestions(items) {
  const draft = getQuestionDestinationDraft();
  if (draft) {
    draft.questions = items;
    draft.dirty = true;
    draft.saved = false;
  }
  else workspace.globalSelectedQuestions = items;
}

function markWholePaperEditDirty() {
  const draft = getActiveEditorDraft();
  if (!draft) return;
  draft.dirty = true;
  draft.saved = false;
  renderSelectedFooter(getGlobalSelectedQuestions().length);
  renderTabs();
}

function getActiveCanvasScores() {
  const draft = getActiveEditorDraft();
  if (draft) {
    draft.scores = draft.scores || {};
    return draft.scores;
  }
  workspace.canvasScores = workspace.canvasScores || {};
  return workspace.canvasScores;
}

function isQuestionGloballySelected(topicId, qId) {
  const key = getQuestionSelectionKey(topicId, qId);
  return getGlobalSelectedQuestions().some(item => item.selectionKey === key);
}

function ensureFavoriteQuestions() {
  if (!Array.isArray(workspace.favoriteQuestions)) workspace.favoriteQuestions = [];
  return workspace.favoriteQuestions;
}

function isQuestionFavorited(topicId, qId) {
  return ensureFavoriteQuestions().includes(getQuestionSelectionKey(topicId, qId));
}

function toggleQuestionFavorite(qId, topicId) {
  const resolvedTopicId = topicId || getActiveTab()?.topicId;
  if (!resolvedTopicId) return false;
  const key = getQuestionSelectionKey(resolvedTopicId, qId);
  const list = ensureFavoriteQuestions();
  const index = list.indexOf(key);
  if (index >= 0) list.splice(index, 1);
  else list.push(key);
  saveWorkspace();
  renderQuestionCards();
  renderCourseCenter();
  return index < 0;
}

function buildGlobalSelectedEntry(tab, q) {
  const topicId = getBaseTopicId(tab.topicId);
  const resolved = resolveTabQuestion(tab, q);
  return {
    selectionKey: getQuestionSelectionKey(topicId, q.id),
    topicId,
    sourceTitle: getTabBaseTitle(tab),
    sourceShortTitle: tab.shortTitle || getTabBaseTitle(tab),
    sourceContext: tab.context || "paper",
    sourceLessonKey: tab.lessonKey || "",
    question: { ...resolved }
  };
}

function matchesSelectedType(questionType, filterKey) {
  const type = questionType || "";
  if (filterKey === "选择") return type.includes("选择");
  if (filterKey === "填空") return type.includes("填空");
  if (filterKey === "解答") return type.includes("解答");
  return true;
}

function countSelectedTypes(items) {
  const counts = { 选择: 0, 填空: 0, 解答: 0 };
  items.forEach(item => {
    const type = item.question?.type || "";
    if (type.includes("选择")) counts.选择 += 1;
    else if (type.includes("填空")) counts.填空 += 1;
    else if (type.includes("解答")) counts.解答 += 1;
  });
  return counts;
}

function renderSelectedTypeSummaryHtml(items) {
  const counts = countSelectedTypes(items);
  return ["选择", "填空", "解答"]
    .filter(key => counts[key] > 0)
    .map(key => `<button type="button" class="ai-selected-summary-count ${selectedPreviewTypeFilter === key ? "active" : ""}" data-selected-type="${key}">${counts[key]}</button>道${key}`)
    .join(" ");
}

function getSelectableQuestions(tab) {
  if (!tab) return [];
  return tab.questions.filter(q => !(tab.removedQuestionIds || []).includes(q.id));
}

function getPaperSelectionState(tab) {
  const selectable = getSelectableQuestions(tab);
  if (!selectable.length) return "empty";
  const selectedCount = selectable.filter(q => isQuestionGloballySelected(tab.topicId, q.id)).length;
  if (selectedCount === 0) return "none";
  if (selectedCount === selectable.length) return "all";
  return "partial";
}

function getCanvasSourceLabel(item) {
  const meta = paperCatalog[item.topicId] || workbookCatalog[item.topicId];
  return meta?.shortTitle || item.sourceTitle || "未分组试卷";
}

function getCanvasGroups(items = getGlobalSelectedQuestions()) {
  const groups = [];
  const map = new Map();
  items.forEach(item => {
    const topicId = item.topicId || "unknown";
    if (!map.has(topicId)) {
      const group = {
        topicId,
        title: getCanvasSourceLabel(item),
        items: []
      };
      map.set(topicId, group);
      groups.push(group);
    }
    map.get(topicId).items.push(item);
  });
  return groups;
}

function canvasQuestionMinutes(q) {
  return Number(q?.minutes) || (q?.type === "解答题" ? 5 : q?.type === "填空题" ? 2 : 1);
}

function canvasDifficultyRank(label) {
  const text = String(label || "");
  if (/较难|困难/.test(text)) return 3;
  if (/较易|简单/.test(text)) return 1;
  return 2;
}

function canvasDifficultyLabel(rank) {
  if (rank <= 1.4) return "较易";
  if (rank >= 2.6) return "较难";
  return "中等";
}

function summarizeCanvasSelection(items = getGlobalSelectedQuestions()) {
  const count = items.length;
  if (!count) return { count: 0, difficulty: "", minutes: 0 };
  const labels = items.map(item => item.question?.difficulty).filter(Boolean);
  const unique = [...new Set(labels)];
  const avg = items.reduce((sum, item) => sum + canvasDifficultyRank(item.question?.difficulty), 0) / count;
  return {
    count,
    difficulty: unique.length === 1 ? unique[0] : canvasDifficultyLabel(avg),
    minutes: items.reduce((sum, item) => sum + canvasQuestionMinutes(item.question), 0)
  };
}

function renderCanvasStatsText(items = getGlobalSelectedQuestions()) {
  const { count, difficulty, minutes } = summarizeCanvasSelection(items);
  if (!count) return "";
  return [`${count}道`, difficulty || "中等", `${minutes}分钟`].join(" · ");
}

function findTabForTopic(topicId) {
  const baseId = getBaseTopicId(topicId);
  return workspace.tabs.find(tab =>
    getBaseTopicId(tab.topicId) === baseId && !tab.isQuestionList && !tab.fromQuestionId
  ) || workspace.tabs.find(tab => getBaseTopicId(tab.topicId) === baseId);
}

function syncCanvasEntry(topicId, qId) {
  const key = getQuestionSelectionKey(topicId, qId);
  const entry = getGlobalSelectedQuestions().find(item => item.selectionKey === key);
  const tab = findTabForTopic(topicId);
  if (!entry || !tab) return;
  const q = tab.questions.find(item => item.id === qId);
  if (!q) return;
  entry.question = { ...resolveTabQuestion(tab, q) };
  entry.sourceTitle = getTabBaseTitle(tab);
}

function syncTabSelectedQuestionIds(tab) {
  if (!tab) return;
  tab.selectedQuestionIds = tab.questions
    .filter(q => isQuestionGloballySelected(tab.topicId, q.id))
    .map(q => q.id);
}

function removeGlobalSelectedByKey(selectionKey) {
  setActiveSelectedQuestions(getGlobalSelectedQuestions().filter(item => item.selectionKey !== selectionKey));
  if (!isWholePaperEditActive()) syncTabSelectedQuestionIds(getActiveTab());
  saveWorkspace();
  renderQuestionCards();
  collapseCanvasIfEmpty();
}

function getActiveTab() {
  return workspace.tabs.find(tab => tab.id === workspace.activeTabId) || workspace.tabs[0];
}

function getQuestions(topicId) {
  const baseId = getBaseTopicId(topicId);
  const questions = paperQuestions[baseId] || paperQuestions.t2;
  return questions.map(q => ({ ...q }));
}

function resolveTopicMeta(topicId, tabContext = contextName, overrides = {}) {
  const baseId = getBaseTopicId(topicId);
  let meta;
  if (tabContext === "series") {
    const catalog = workbookCatalog[baseId];
    meta = catalog
      ? { ...catalog }
      : {
        title: params.get("title") || "练习册题单",
        shortTitle: shortenTabTitle(params.get("title") || "题单"),
        source: params.get("source") || "系列题单",
        difficulty: params.get("difficulty") || "中等",
        questionCount: Number(params.get("questions") || 0),
        usage: Number(params.get("usage") || 0)
      };
  } else if (paperCatalog[baseId]) {
    meta = { ...paperCatalog[baseId] };
  } else {
    const fallbackTitle = params.get("title") || (tabContext === "special" ? "专题题单" : tabContext === "chapter" ? "同步练习" : "未命名试卷");
    meta = {
      title: fallbackTitle,
      shortTitle: shortenTabTitle(params.get("shortTitle") || fallbackTitle),
      focus: params.get("focus") || "",
      reason: params.get("reason") || (tabContext === "special" ? "专题" : tabContext === "chapter" ? "同步练习" : "试卷"),
      region: "朝阳区",
      grade: "七年级",
      examType: tabContext === "special" ? "专题" : tabContext === "chapter" ? "同步" : "试卷",
      questionCount: Number(params.get("questions") || 0),
      difficulty: params.get("difficulty") || "中等",
      usage: Number(params.get("usage") || 0),
      source: params.get("source") || ""
    };
  }

  if (overrides.title) {
    meta.title = overrides.title;
    meta.shortTitle = overrides.shortTitle || shortenTabTitle(overrides.title);
  } else if (overrides.shortTitle) {
    meta.shortTitle = overrides.shortTitle;
  } else if (!meta.shortTitle) {
    meta.shortTitle = shortenTabTitle(meta.title);
  }
  if (overrides.source) meta.source = overrides.source;
  if (overrides.difficulty) meta.difficulty = overrides.difficulty;
  if (overrides.reason) meta.reason = overrides.reason;
  if (overrides.focus) meta.focus = overrides.focus;
  if (overrides.questionCount != null) meta.questionCount = Number(overrides.questionCount);
  if (overrides.usage != null) meta.usage = Number(overrides.usage);
  return meta;
}

function favoriteResourceLabel(saved = false) {
  if (saved) return `<i class="ri-star-fill"></i><span id="favoritePaperLabel">已收藏</span>`;
  return `<i class="ri-star-line"></i><span id="favoritePaperLabel">收藏</span>`;
}

function createTab(topicId, tabContext = contextName, overrides = {}) {
  tabCounter += 1;
  const meta = resolveTopicMeta(topicId, tabContext, overrides);
  const questions = getQuestions(topicId).map(q => ({ ...q }));
  return {
    id: `tab-${tabCounter}`,
    topicId: getBaseTopicId(topicId),
    context: tabContext,
    title: meta.title,
    shortTitle: meta.shortTitle || meta.title.slice(0, 12),
    lessonKey: overrides.lessonKey || "",
    meta,
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions
  };
}

function refreshMainTabFromSource(tab) {
  if (!tab || tab.fromQuestionId || tab.isQuestionList) return;
  const baseId = getBaseTopicId(tab.topicId);
  const fresh = getQuestions(baseId);
  const meta = resolveTopicMeta(baseId, tab.context);
  const customTitle = tab.customTitle ? tab.title : "";
  const modifiedQuestions = tab.modifiedQuestions || {};
  tab.questions = fresh.map(q => ({ ...q }));
  tab.removedQuestionIds = (tab.removedQuestionIds || []).filter(id => fresh.some(q => q.id === id));
  tab.modifiedQuestions = Object.fromEntries(Object.entries(modifiedQuestions).filter(([id]) => fresh.some(q => q.id === id)));
  tab.meta = meta;
  tab.title = customTitle || meta.title;
  tab.shortTitle = customTitle ? shortenTabTitle(customTitle) : (meta.shortTitle || meta.title.slice(0, 10));
  if (customTitle) {
    tab.meta.title = customTitle;
    tab.meta.shortTitle = shortenTabTitle(customTitle);
  }
  tab.selectedQuestionIds = tab.selectedQuestionIds.filter(id => fresh.some(q => q.id === id));
}

function hasSingleChoiceSection(tab) {
  if (!tab) return false;
  return tab.questions.some(q =>
    !tab.removedQuestionIds.includes(q.id) && String(q.section || "").includes("单项选择")
  );
}

function formatQuestionListTitle() {
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}组题`;
}

function formatQuestionListShortTitle() {
  return formatQuestionListTitle();
}

function isAutoCanvasTitle(title) {
  return /^\d{4}[./-]\d{1,2}[./-]\d{1,2}(题单|组题)$/.test(String(title || "").trim());
}

function isUserCanvasTitle(title) {
  const text = String(title || "").trim();
  return Boolean(text
    && text !== NEW_CANVAS_DISPLAY_TITLE
    && text !== LEGACY_CANVAS_DISPLAY_TITLE
    && !isAutoCanvasTitle(text));
}

function stripEditorTitlePrefix(title) {
  return String(title || "")
    .trim()
    .replace(/^编辑\s*[：:·]\s*/, "")
    .trim();
}

function getEditorDisplayTitle(tab = getActiveEditorTab()) {
  if (tab?.kind !== "editor" || !tab.editorDraft) return "";
  const draftTitle = stripEditorTitlePrefix(tab.editorDraft.title);
  const sourceTitle = stripEditorTitlePrefix(tab.editorDraft.sourceTitle);
  const baseTitle = tab.editorSource === "canvas" && (!draftTitle || isAutoCanvasTitle(draftTitle))
    ? NEW_CANVAS_DISPLAY_TITLE
    : draftTitle || sourceTitle || "未命名题单";
  if (tab.editorDraft.titleCustomized) return baseTitle;
  if (tab.editorSource === "whole-paper") return `复制：${baseTitle}`;
  return editorTabLabel("编辑", baseTitle);
}

function getCanvasListTitle() {
  const editorTitle = getEditorDisplayTitle();
  if (editorTitle) return editorTitle;
  const title = String(workspace.canvasTitle ?? "").trim();
  if (isUserCanvasTitle(title)) return title;
  return formatQuestionListTitle();
}

function getCanvasDisplayTitle() {
  const draft = getActiveEditorDraft();
  const editorTitle = getEditorDisplayTitle();
  if (draft && editorTitle) return editorTitle;
  const title = String(workspace.canvasTitle ?? "").trim();
  return isUserCanvasTitle(title) ? title : NEW_CANVAS_DISPLAY_TITLE;
}

function setCanvasListTitle(next) {
  const title = String(next || "").trim();
  const currentDisplayTitle = getCanvasDisplayTitle();
  if (title === currentDisplayTitle) return currentDisplayTitle;
  const value = !title || title === NEW_CANVAS_DISPLAY_TITLE || title === LEGACY_CANVAS_DISPLAY_TITLE ? "" : title;
  const draft = getActiveEditorDraft();
  if (draft) {
    const editorTab = getActiveEditorTab();
    const sourceTitle = String(draft.sourceTitle || "").trim();
    const renamedTitle = stripEditorTitlePrefix(value);
    draft.title = renamedTitle || (editorTab?.editorSource === "whole-paper" ? sourceTitle : "");
    draft.titleCustomized = Boolean(renamedTitle);
    syncEditorTabTitle(editorTab);
    markWholePaperEditDirty();
  }
  else workspace.canvasTitle = value;
  saveWorkspace();
  return getCanvasDisplayTitle();
}

function applyCanvasTitleToUi() {
  const title = getCanvasDisplayTitle();
  const head = document.querySelector("#canvasHeadTitle");
  const paper = document.querySelector("#canvasPaperTitle");
  const draftTitle = document.querySelector("[data-question-draft-title]");
  const rail = document.querySelector("#canvasRailTitle");
  const expandBtn = document.querySelector("#aiSelectedExpand");
  const panel = document.querySelector("#aiSelectedPanel");
  if (head) {
    head.setAttribute("title", title);
    if (document.activeElement !== head) head.textContent = title;
  }
  if (paper && document.activeElement !== paper) paper.textContent = title;
  if (draftTitle && document.activeElement !== draftTitle) {
    draftTitle.textContent = title;
    draftTitle.setAttribute("title", title);
  }
  if (rail) rail.textContent = QUESTION_PICKER_MODE ? "已选题目" : "组题编辑区";
  if (expandBtn) expandBtn.setAttribute("aria-label", `展开组题编辑区，当前题单：${title}`);
  if (panel) panel.setAttribute("aria-label", getActiveEditorDraft() ? title : "正在组题");
}

function bindCanvasTitleEditor(node) {
  if (!node || node.dataset.bound) return;
  node.dataset.bound = "1";
  node.addEventListener("blur", () => {
    const next = setCanvasListTitle(node.textContent);
    node.textContent = next;
    applyCanvasTitleToUi();
  });
  node.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      node.blur();
    }
  });
}

function ensureInitialTab() {
  if (isComposeMode) {
    ensureComposeTab();
    workspace.homeActive = false;
    workspace.activeBrowseFilter = null;
    saveWorkspace();
    return;
  }
  if (isRecordMode) {
    ensureRecordTab();
    workspace.homeActive = false;
    workspace.activeBrowseFilter = null;
    saveWorkspace();
    return;
  }
  const baseId = getBaseTopicId(initialTopicId);
  const urlTitle = String(params.get("title") || "").trim();
  const urlLessonKey = String(params.get("lessonKey") || urlTitle || "").trim();
  const shellOnlyEntry = Boolean(requestedWorkspaceView && !params.get("topic") && !params.get("tabId"));
  let mainTab = shellOnlyEntry ? null : workspace.tabs.find(tab =>
    getBaseTopicId(tab.topicId) === baseId
    && !tab.fromQuestionId
    && !tab.isQuestionList
    && (!urlLessonKey || tab.lessonKey === urlLessonKey || tab.title === urlLessonKey)
  );

  const freshCatalogEntry = Boolean(params.get("topic") && !params.get("tabId"));
  if (!shellOnlyEntry && !mainTab) {
    mainTab = createTab(initialTopicId, contextName, {
      title: urlTitle || undefined,
      shortTitle: params.get("shortTitle") || urlTitle || undefined,
      lessonKey: urlLessonKey || undefined,
      source: params.get("source") || undefined,
      difficulty: params.get("difficulty") || undefined,
      reason: params.get("reason") || undefined,
      focus: params.get("focus") || undefined,
      questionCount: params.get("questions") || undefined,
      usage: params.get("usage") || undefined
    });
    workspace.tabs.push(mainTab);
  } else if (!shellOnlyEntry && freshCatalogEntry) {
    mainTab.customTitle = false;
    mainTab.removedQuestionIds = [];
    mainTab.modifiedQuestions = {};
    refreshMainTabFromSource(mainTab);
    if (urlTitle) {
      mainTab.title = urlTitle;
      mainTab.shortTitle = params.get("shortTitle") || urlTitle;
      mainTab.lessonKey = urlLessonKey || mainTab.lessonKey;
      mainTab.meta = {
        ...(mainTab.meta || {}),
        title: urlTitle,
        shortTitle: mainTab.shortTitle
      };
    }
  } else if (!shellOnlyEntry && mainTab?.kind !== "editor" && !hasSingleChoiceSection(mainTab)) {
    refreshMainTabFromSource(mainTab);
  }

  workspace.homeActive = false;
  workspace.activeBrowseFilter = null;
  if (params.get("tabId")) {
    const urlTab = workspace.tabs.find(tab => tab.id === params.get("tabId"));
    if (urlTab?.kind === "editor") {
      workspace.activeQuestionDraftTabId = urlTab.id;
      workspace.activeTabId = workspace.tabs.find(tab => tab.id === urlTab.sourceTabId && tab.kind !== "editor")?.id
        || mainTab?.id
        || workspace.tabs.find(tab => tab.kind !== "editor")?.id
        || null;
    } else {
      workspace.activeTabId = urlTab?.id || mainTab?.id || workspace.activeTabId || null;
    }
  } else if (params.get("topic") || !workspace.activeTabId || !workspace.tabs.some(tab => tab.id === workspace.activeTabId)) {
    workspace.activeTabId = mainTab?.id || null;
  }

  workspace.tabs = workspace.tabs.filter(tab => {
    if (tab.composeSession || tab.recordSession) return true;
    if (tab.isQuestionList || tab.fromQuestionId) {
      if (tab.myResourceId) return true;
      return workspace.tabs.some(parent => parent.id === tab.fromTabId);
    }
    return true;
  });

  if (requestedWorkspaceView === "home") {
    workspace.homeActive = true;
    workspace.activeBrowseFilter = null;
  } else if (requestedWorkspaceView === "browse" && getBrowseMeta(requestedBrowseFilter)) {
    ensureBrowseTabs();
    if (!workspace.browseTabs.includes(requestedBrowseFilter)) workspace.browseTabs.push(requestedBrowseFilter);
    workspace.homeActive = false;
    workspace.activeBrowseFilter = requestedBrowseFilter;
    pendingBrowseOptions = normalizeBrowseOptions(
      browseOptionsForKey(requestedBrowseFilter, browseOptionsFromParams())
    );
  } else if (requestedWorkspaceView === "course") {
    aiAssistantTabOpen = true;
    aiAssistantOpen = true;
    workspace.courseCenterTabOpen = true;
    workspace.homeActive = false;
    workspace.activeBrowseFilter = null;
  }

  saveWorkspace();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function resolveTabQuestion(tab, q) {
  const modified = tab.modifiedQuestions?.[q.id] || {};
  return {
    ...q,
    stem: modified.stem ?? q.stem,
    type: modified.type ?? q.type,
    difficulty: modified.difficulty ?? q.difficulty,
    options: modified.options ?? q.options ?? [],
    answer: modified.answer ?? q.answer,
    analysis: modified.analysis ?? q.analysis,
    knowledge: modified.knowledge ?? q.knowledge
  };
}

function buildEditorPayload(tab) {
  const visible = tab.questions
    .filter(q => !tab.removedQuestionIds.includes(q.id))
    .sort((a, b) => (a.num || 0) - (b.num || 0));

  return {
    tabId: tab.id,
    title: tab.title,
    isQuestionList: Boolean(tab.isQuestionList),
    context: tab.context || contextName,
    topicId: getBaseTopicId(tab.topicId),
    updatedAt: Date.now(),
    questions: visible.map((q, index) => {
      const resolved = resolveTabQuestion(tab, q);
      const meta = questionDefaults(resolved);
      return {
        id: String(resolved.id || `q-${index + 1}`),
        num: index + 1,
        section: resolved.section || (tab.isQuestionList ? "题单题目" : "试卷题目"),
        text: resolved.stem || "",
        options: [...(resolved.options || [])],
        answer: resolved.answer || "",
        path: `初中 / 数学 / ${resolved.type || "选择题"} / ${resolved.difficulty || "中等"} / ${meta.minutes} 分钟`,
        tags: [
          tab.meta?.source || "平台题库",
          resolved.knowledge
        ].filter(Boolean),
        competency: resolved.competency || meta.competency || "运算能力",
        explanation: resolved.analysis || ""
      };
    })
  };
}

function encodePayloadHash(payload) {
  const json = JSON.stringify(payload);
  return `p=${encodeURIComponent(btoa(unescape(encodeURIComponent(json))))}`;
}

function saveEditorPayload(payload) {
  const json = JSON.stringify(payload);
  sessionStorage.setItem("feixiang-editor-payload", json);
  if (payload.tabId) {
    sessionStorage.setItem(`feixiang-editor-payload-${payload.tabId}`, json);
  }
  try {
    localStorage.setItem("feixiang-editor-payload", json);
    if (payload.tabId) {
      localStorage.setItem(`feixiang-editor-payload-${payload.tabId}`, json);
    }
  } catch {}
  return encodePayloadHash(payload);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.classList.remove("toast-action");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function showActionToast(message, actionLabel, href) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  const messageNode = document.createElement("span");
  const actionLink = document.createElement("a");
  messageNode.textContent = message;
  actionLink.className = "toast-action-link";
  actionLink.href = href;
  actionLink.textContent = actionLabel;
  toast.replaceChildren(messageNode, actionLink);
  toast.classList.add("toast-action", "show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show", "toast-action");
  }, 8000);
}

function showActionButtonsToast(message, actions = [], duration = 8000) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  const messageNode = document.createElement("span");
  messageNode.textContent = message;
  const nodes = [messageNode];
  actions.forEach(action => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "toast-action-button";
    button.textContent = action.label;
    button.addEventListener("click", () => {
      action.onClick?.();
      toast.classList.remove("show", "toast-action");
    });
    nodes.push(button);
  });
  toast.replaceChildren(...nodes);
  toast.classList.add("toast-action", "show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show", "toast-action"), duration);
}

function queueToastAfterNavigation(message) {
  try {
    sessionStorage.setItem(PENDING_TOAST_KEY, String(message || ""));
  } catch {}
}

function showPendingToast() {
  let message = "";
  try {
    message = sessionStorage.getItem(PENDING_TOAST_KEY) || "";
    sessionStorage.removeItem(PENDING_TOAST_KEY);
  } catch {}
  if (message) setTimeout(() => showToast(message), 120);
}

function buildPaperFacts(tab) {
  const meta = tab.meta || {};
  const visibleCount = tab.questions.filter(q => !tab.removedQuestionIds.includes(q.id)).length;
  if (tab.isQuestionList) {
    return [meta.source || "我的创建", `${visibleCount} 题`, meta.createdAt ? `创建于 ${meta.createdAt}` : ""].filter(Boolean);
  }
  if (tabIsWorkbook(tab)) {
    return [
      meta.source || "练习册",
      "章节练习",
      `${visibleCount} 题`,
      meta.difficulty ? `难度 ${meta.difficulty}` : "",
      meta.usage ? `${meta.usage} 人使用` : ""
    ].filter(Boolean);
  }
  if (tabIsSpecial(tab)) {
    return [
      meta.reason || "专题",
      meta.source,
      `${visibleCount} 题`,
      meta.difficulty ? `难度 ${meta.difficulty}` : "",
      meta.usage ? `${meta.usage} 人使用` : ""
    ].filter(Boolean);
  }
  return [
    meta.reason || meta.source,
    meta.region,
    meta.grade,
    meta.examType,
    `${visibleCount} 题`,
    meta.difficulty ? `难度 ${meta.difficulty}` : "",
    meta.usage ? `${meta.usage} 次下载` : ""
  ].filter(Boolean);
}

function renderMeta(tab) {
  const displayTitle = tab.fromQuestionId
    ? `${getTabBaseTitle(tab)} · 第 ${tab.questions[0]?.num || ""} 题`
    : tab.title;
  const titleNode = document.querySelector("#topicTitle");
  const titleRow = titleNode?.closest(".paper-title-edit-row");
  const editButton = document.querySelector("#editPaperTitle");
  const titleEditable = isTabTitleEditable(tab);
  if (titleNode && document.activeElement !== titleNode) titleNode.textContent = displayTitle;
  if (titleNode) {
    titleNode.contentEditable = titleEditable ? "true" : "false";
    titleNode.setAttribute("aria-label", tab.fromQuestionId
      ? "题目标题"
      : titleEditable ? "个人题单标题，可直接编辑" : "试卷标题");
  }
  titleRow?.classList.toggle("is-editable", titleEditable);
  titleRow?.classList.toggle("is-readonly", !titleEditable);
  if (editButton) editButton.hidden = !titleEditable;

  const facts = document.querySelector("#paperMetaFacts");
  if (facts) {
    facts.innerHTML = buildPaperFacts(tab).map(text => `<span>${escapeHtml(text)}</span>`).join("");
  }

  if (!isComposeMode && !isShellFrameActive() && !isAiAssistantViewActive()) {
    renderDetailBreadcrumb(tab, selectedPanelEnlarged ? getCanvasDisplayTitle() : displayTitle);
  }
}

function renderDetailBreadcrumb(tab, displayTitle) {
  if (isComposeMode || isRecordMode) return;
  const trail = document.querySelector(".ai-detail-topbar .breadcrumb");
  if (!trail || !tab) return;
  if (selectedPanelEnlarged) {
    trail.innerHTML = `
      <span>组题编辑区</span>
      <strong id="breadcrumbLeaf" hidden>编辑</strong>`;
    return;
  }
  if (tab.myResourceId || tab.isQuestionList) {
    trail.innerHTML = `
      <span>题目浏览区：<a href="./index.html">题库首页</a></span>
      <i class="ri-arrow-right-s-line"></i>
      <button type="button" class="breadcrumb-resource-link" data-open-my-resources>我的</button>
      <i class="ri-arrow-right-s-line"></i>
      <strong id="breadcrumbLeaf">题单详情</strong>`;
    return;
  }
  const contextLabel = tabContextLabel(tab);
  const detailLabel = tabIsWorkbook(tab)
    ? "练习详情"
    : tabIsSpecial(tab) ? "专题详情" : tab.fromQuestionId ? "题目详情" : "试卷详情";
  trail.innerHTML = `
    <span>题目浏览区：<a href="./index.html">题库首页</a></span>
    <i class="ri-arrow-right-s-line"></i>
    <span id="breadcrumbContext">${escapeHtml(contextLabel)}</span>
    <i class="ri-arrow-right-s-line"></i>
    <strong id="breadcrumbLeaf">${detailLabel}</strong>`;
}

function bindPaperTitleEditor() {
  const titleNode = document.querySelector("#topicTitle");
  const editButton = document.querySelector("#editPaperTitle");
  if (!titleNode || titleNode.dataset.bound) return;
  titleNode.dataset.bound = "1";
  let titleBeforeEdit = "";

  const beginEdit = () => {
    const tab = getActiveTab();
    if (!isTabTitleEditable(tab)) {
      renderMeta(tab);
      return;
    }
    titleBeforeEdit = titleNode.textContent.trim();
    titleNode.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(titleNode);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const commitTitle = () => {
    const tab = getActiveTab();
    if (!isTabTitleEditable(tab)) {
      renderMeta(tab);
      return;
    }
    const fallback = titleBeforeEdit || tab.title || tab.meta?.title || "未命名题单";
    const nextTitle = titleNode.textContent.replace(/\s+/g, " ").trim() || fallback;
    titleNode.textContent = nextTitle;
    if (nextTitle === tab.title) return;
    tab.title = nextTitle;
    tab.customTitle = true;
    tab.shortTitle = shortenTabTitle(nextTitle);
    tab.meta = {
      ...(tab.meta || {}),
      title: nextTitle,
      shortTitle: shortenTabTitle(nextTitle)
    };
    syncMyQuestionListResourceTitle(tab);
    saveWorkspace();
    renderMeta(tab);
    renderPaperActionButtons(tab);
    renderTabs();
    document.title = `${nextTitle} · AI 试卷工作台`;
  };

  titleNode.addEventListener("focus", () => {
    if (!isTabTitleEditable(getActiveTab())) {
      titleNode.blur();
      return;
    }
    titleBeforeEdit = titleNode.textContent.trim();
    titleNode.closest(".paper-title-edit-row")?.classList.add("is-editing");
  });
  titleNode.addEventListener("blur", () => {
    titleNode.closest(".paper-title-edit-row")?.classList.remove("is-editing");
    commitTitle();
  });
  titleNode.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      titleNode.blur();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      titleNode.textContent = titleBeforeEdit;
      titleNode.blur();
    }
  });
  titleNode.addEventListener("paste", event => {
    if (!isTabTitleEditable(getActiveTab())) return;
    event.preventDefault();
    document.execCommand("insertText", false, event.clipboardData?.getData("text/plain") || "");
  });
  editButton?.addEventListener("click", beginEdit);
}

function renderWorkbookDirectory() {
  const tree = document.querySelector("#directoryTree");
  if (!tree) return;
  tree.innerHTML = workbookDirectory.chapters.map(chapter => `
    <section class="tree-group workbook-chapter ${chapter.expanded ? "open" : ""}">
      <button type="button" class="chapter-row">
        <i class="ri-arrow-${chapter.expanded ? "down" : "right"}-s-line"></i>
        <span>${escapeHtml(chapter.title)}</span>
      </button>
      <div class="tree-leaves"${chapter.expanded ? "" : " hidden"}>
        ${chapter.lessons.map(lesson => `
          <button class="tree-lesson ${lesson.active ? "active" : ""}" type="button">
            <span class="lesson-title">${escapeHtml(lesson.title)}</span>
          </button>`).join("")}
      </div>
    </section>`).join("");
}

function setDirectoryOpen(open, mobile = false) {
  const directoryPanel = document.querySelector("#directoryPanel");
  const workspace = document.querySelector("#aiWorkspace");
  const directoryToggle = document.querySelector("#directoryToggle");
  const directoryMask = document.querySelector("#directoryMask");
  if (!directoryPanel || !workspace) return;
  directoryPanel.classList.toggle("open", open);
  workspace.classList.toggle("directory-open", open && !mobile);
  directoryToggle?.setAttribute("aria-expanded", String(open));
  if (directoryMask) directoryMask.hidden = !open || !mobile;
}

function bindDirectoryEvents() {
  if (!isWorkbook) return;

  document.querySelector("#directoryToggle")?.addEventListener("click", () => {
    const directoryPanel = document.querySelector("#directoryPanel");
    setDirectoryOpen(!directoryPanel?.classList.contains("open"));
  });

  document.querySelector("#mobileDirectory")?.addEventListener("click", () => {
    setDirectoryOpen(true, true);
  });

  document.querySelector("#directoryMask")?.addEventListener("click", () => {
    setDirectoryOpen(false, true);
  });

  document.querySelectorAll(".workbook-chapter > .chapter-row").forEach(button => {
    button.addEventListener("click", () => {
      const icon = button.querySelector("i");
      const leaves = button.nextElementSibling;
      if (!leaves) return;
      const open = leaves.hidden;
      leaves.hidden = !open;
      button.closest(".workbook-chapter")?.classList.toggle("open", open);
      if (icon) icon.className = open ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line";
    });
  });

  document.querySelectorAll(".tree-lesson").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tree-lesson").forEach(item => item.classList.toggle("active", item === button));
      const label = button.querySelector(".lesson-title")?.textContent.trim() || button.textContent.trim();
      document.querySelector("#breadcrumbLeaf").textContent = label;
      showToast(`已切换到「${label}」`);
    });
  });
}

function applyPageMode() {
  const workspace = document.querySelector("#aiWorkspace");
  const directoryPanel = document.querySelector("#directoryPanel");
  const mobileDirectory = document.querySelector("#mobileDirectory");
  const docTabs = document.querySelector("#docTabs");
  const favoriteLabel = document.querySelector("#favoritePaperLabel");

  // 练习册与试卷共用详情布局，不再展示左侧目录
  document.body.classList.remove("ai-workbook-page");
  workspace?.classList.remove("workbook-mode", "directory-open");
  directoryPanel?.setAttribute("hidden", "");
  mobileDirectory?.setAttribute("hidden", "");
  document.querySelector("#directoryMask")?.setAttribute("hidden", "");
  applyComposeMode();
  applyRecordMode();
  if (!isComposeMode && !isRecordMode) {
    document.querySelector("#breadcrumbContext") && (document.querySelector("#breadcrumbContext").textContent = isWorkbook ? "练习册" : "试卷");
    document.querySelector("#breadcrumbLeaf") && (document.querySelector("#breadcrumbLeaf").textContent = isWorkbook ? "章节练习" : "试卷详情");
  }
  if (favoriteLabel) favoriteLabel.textContent = "收藏";
  if (docTabs) docTabs.setAttribute("aria-label", "已打开的题单");
}

function composePaperTitle(prompt) {
  const text = String(prompt || "");
  if (/期中/.test(text)) return "北京市朝阳区七年级上学期数学期中试卷";
  if (/月考/.test(text)) return "北京市朝阳区七年级上学期数学月考试卷";
  if (/单元/.test(text)) return "北京市朝阳区七年级上学期数学单元检测卷";
  return "北京市朝阳区七年级上学期数学期末试卷";
}

function openComposePage(prompt) {
  const text = String(prompt || "").trim();
  if (!text) return false;
  location.href = `./detail-ai.html?mode=compose&prompt=${encodeURIComponent(text)}&context=paper`;
  return true;
}

function openRecordPage(fileName) {
  const name = String(fileName || "待录入试卷.pdf").trim() || "待录入试卷.pdf";
  location.href = `./detail-ai.html?mode=record&fileName=${encodeURIComponent(name)}&context=paper`;
  return true;
}

function ensureRecordTab() {
  const existing = workspace.tabs.find(tab => tab.recordSession && tab.recordFileName === recordFileName);
  if (existing) {
    workspace.activeTabId = existing.id;
    saveWorkspace();
    return existing;
  }
  const cleanName = recordFileName.replace(/\.[^.]+$/, "").trim() || "AI 录入试卷";
  const title = `${cleanName} · AI录题`;
  const questions = (paperQuestions.t2 || []).map((question, index) => ({
    ...question,
    id: `record-${Date.now()}-${question.id}`,
    num: index + 1,
    badges: [index === 0 ? "飞象原题" : "AI识别"]
  }));
  tabCounter += 1;
  const tab = {
    id: `tab-${tabCounter}`,
    topicId: `record-${Date.now()}`,
    context: "paper",
    title,
    shortTitle: shortenTabTitle(cleanName),
    meta: {
      title,
      shortTitle: shortenTabTitle(cleanName),
      source: "AI 录题",
      region: "上传文件",
      grade: "七年级",
      examType: "试卷",
      difficulty: "中等",
      questionCount: questions.length,
      usage: 0,
      createdAt: new Date().toISOString()
    },
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions,
    recordSession: true,
    recordFileName,
    isQuestionList: false
  };
  workspace.tabs.push(tab);
  workspace.activeTabId = tab.id;
  saveWorkspace();
  return tab;
}

function ensureComposeTab() {
  const title = composePaperTitle(composePrompt);
  const existing = workspace.tabs.find(tab => tab.composeSession && tab.meta?.aiPrompt === composePrompt);
  if (existing) {
    existing.title = "AI组题";
    existing.shortTitle = "AI组题";
    existing.meta = { ...(existing.meta || {}), title: "AI组题", shortTitle: "AI组题", paperTitle: title };
    workspace.activeTabId = existing.id;
    saveWorkspace();
    return existing;
  }
  const sources = [
    "全品学练考 · 2026-2027学年人教版七年级上册",
    "多维导学案 · 2026-2027学年人教版七年级上册",
    "朝阳区期末试题 · 2026-2027学年七年级上学期"
  ];
  const questions = (paperQuestions.t2 || []).map((q, index) => ({
    ...q,
    id: `compose-${q.id}`,
    num: index + 1,
    sourceLabel: sources[index % sources.length]
  }));
  tabCounter += 1;
  const tab = {
    id: `tab-${tabCounter}`,
    topicId: `compose-${Date.now()}`,
    context: "paper",
    title: "AI组题",
    shortTitle: "AI组题",
    meta: {
      title: "AI组题",
      shortTitle: "AI组题",
      paperTitle: title,
      source: "AI 组卷",
      difficulty: "中等",
      questionCount: questions.length,
      usage: 0,
      aiPrompt: composePrompt,
      createdAt: new Date().toISOString()
    },
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions,
    isQuestionList: true,
    aiGenerated: true,
    composeSession: true
  };
  workspace.tabs.push(tab);
  workspace.activeTabId = tab.id;
  saveWorkspace();
  return tab;
}

function applyComposeMode() {
  const root = document.querySelector("#aiWorkspace");
  const chat = document.querySelector("#aiComposeChat");
  if (!isComposeMode) {
    root?.classList.remove("compose-mode");
    document.body.classList.remove("compose-mode");
    return;
  }
  root?.classList.add("compose-mode");
  document.body.classList.add("compose-mode");
  if (chat) chat.hidden = false;
  const title = composePaperTitle(composePrompt);
  const trail = document.querySelector(".ai-detail-topbar .breadcrumb");
  if (trail) {
    trail.innerHTML = `<span>题目浏览区：<a href="./index.html">题库首页</a></span><i class="ri-arrow-right-s-line"></i><span>我的</span><i class="ri-arrow-right-s-line"></i><strong>AI组题</strong>`;
  }
  document.title = `${title} · AI组题`;
  renderComposeThread();
  startComposeFlow();
  aiAssistantOpen = false;
  syncAiAssistantChrome();
}

function ensureComposeDraft() {
  if (!isComposeMode) return null;
  const sourceTab = getActiveTab();
  if (!sourceTab?.composeSession) return null;
  const existing = workspace.tabs.find(tab => tab.kind === "editor"
    && tab.editorSource === "ai-compose"
    && tab.sourceTabId === sourceTab.id);
  if (existing) {
    workspace.activeQuestionDraftTabId = existing.id;
    workspace.addQuestionTargetTabId = existing.id;
    return existing;
  }
  const items = (sourceTab.questions || []).map(question => buildGlobalSelectedEntry(sourceTab, question));
  const draft = createEditorTab({
    editorSource: "ai-compose",
    sourceTab,
    title: composePaperTitle(composePrompt),
    items,
    expand: false,
    preserveRight: true
  });
  if (draft?.editorDraft) {
    draft.editorDraft.aiPrompt = composePrompt;
    draft.editorDraft.commandSpecReady = true;
    draft.meta = { ...(draft.meta || {}), source: "AI组题", aiPrompt: composePrompt };
    syncEditorTabTitle(draft);
    saveWorkspace();
  }
  return draft;
}

function recordSourceHtml() {
  return `
    <header class="ai-record-source-head">
      <div><i class="ri-file-pdf-2-fill"></i><strong>${escapeHtml(recordFileName)}</strong></div>
      <div class="ai-record-source-tools" aria-label="源文件工具">
        <button type="button" title="OCR 识别范围"><i class="ri-scan-2-line"></i></button>
        <button type="button" title="拖动页面"><i class="ri-hand"></i></button>
        <button type="button" title="缩小"><i class="ri-subtract-line"></i></button>
        <span>100%</span>
        <button type="button" title="放大"><i class="ri-add-line"></i></button>
      </div>
    </header>
    <div class="ai-record-source-scroll">
      <article class="ai-record-pdf-page">
        <h2>七年级数学试卷</h2>
        <p class="ai-record-paper-note">一、选择题：本题包括 4 小题，每小题只有一个正确答案。</p>
        <section class="ai-record-source-question is-matched"><em>Q1</em><p>1．如果向东走 3 米记作 +3 米，那么向西走 5 米应记作（　　）。</p><div>A．+5 米　　B．−5 米　　C．+3 米　　D．−3 米</div></section>
        <section class="ai-record-source-question"><em>Q2</em><p>2．下列各组量中，具有相反意义的量是（　　）。</p><div>A．上升与向东　 B．收入与支出　 C．长大与减少　 D．购进与卖出</div></section>
        <section class="ai-record-source-question"><em>Q3</em><p>3．在 −3、0、2.5、−1/2 四个数中，负数共有（　　）。</p><div>A．1 个　　B．2 个　　C．3 个　　D．4 个</div></section>
        <section class="ai-record-source-question"><em>Q4</em><p>4．某天最高气温 18 ℃，最低气温 7 ℃，温差是（　　）。</p><div>A．25 ℃　 B．−25 ℃　 C．11 ℃　 D．−11 ℃</div></section>
        <footer>第 1 页 / 共 2 页</footer>
      </article>
    </div>`;
}

function applyRecordMode() {
  const root = document.querySelector("#aiWorkspace");
  const sourcePanel = document.querySelector("#aiComposeChat");
  if (!isRecordMode) {
    root?.classList.remove("record-mode");
    document.body.classList.remove("record-mode");
    return;
  }
  root?.classList.add("record-mode");
  document.body.classList.add("record-mode");
  if (sourcePanel) {
    sourcePanel.hidden = false;
    sourcePanel.innerHTML = recordSourceHtml();
  }
  const tab = getActiveTab();
  const progress = document.querySelector("#aiRecordProgress");
  const preview = document.querySelector("#docPreviewScroll");
  if (progress) progress.hidden = false;
  if (preview) preview.hidden = true;
  const count = document.querySelector("#aiRecordQuestionCount");
  if (count) count.textContent = `（共 ${tab?.questions?.length || 0} 道题）`;
  const resultHead = document.querySelector("#aiRecordResultHead");
  if (resultHead) resultHead.hidden = false;
  const trail = document.querySelector(".ai-detail-topbar .breadcrumb");
  if (trail) {
    trail.innerHTML = `<span>题目浏览区：<a href="./index.html">题库首页</a></span><i class="ri-arrow-right-s-line"></i><span>我的</span><i class="ri-arrow-right-s-line"></i><strong>AI录题</strong>`;
  }
  document.title = `${recordFileName} · AI录题`;
  aiAssistantOpen = false;
  syncAiAssistantChrome();
}

function showRecordResults() {
  if (!isRecordMode) return;
  const progress = document.querySelector("#aiRecordProgress");
  const preview = document.querySelector("#docPreviewScroll");
  if (progress) progress.hidden = true;
  if (preview) preview.hidden = false;
  preview?.classList.add("is-record-revealed");
  window.setTimeout(() => preview?.classList.remove("is-record-revealed"), 520);
}

let composeFlowStage = 0;
let composeFlowTimer = null;

function composeStageClass(index) {
  if (index < composeFlowStage) return "is-complete is-open";
  if (index === composeFlowStage) return "is-running is-open";
  return "is-pending";
}

function composeStageIcon(index) {
  if (index < composeFlowStage) return "ri-checkbox-circle-fill";
  if (index === composeFlowStage) return "ri-loader-4-line";
  return "ri-checkbox-blank-circle-line";
}

function composeDetailTableHtml() {
  const rows = [
    ["1", "选择题", "正负数的意义", "较易", "Ⅱ级（理解）"], ["2", "选择题", "相反意义的量", "较易", "Ⅱ级（理解）"],
    ["3", "选择题", "负数的识别", "中等", "Ⅲ级（应用）"], ["4", "选择题", "温差的计算", "较易", "Ⅲ级（应用）"],
    ["5", "填空题", "数轴与点的距离", "中等", "Ⅲ级（应用）"], ["6", "填空题", "水位变化与正负数", "中等", "Ⅲ级（应用）"],
    ["7", "解答题", "标准质量与偏差", "较难", "Ⅳ级（综合）"]
  ];
  return `<div class="ai-compose-table-wrap"><table class="ai-compose-table"><thead><tr><th>题号</th><th>题型</th><th>知识点</th><th>难度</th><th>能力层级</th></tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function composeValidationTableHtml() {
  const reasons = ["通过生活方向情境考查正负数意义，兼顾概念理解与表达规范。", "以相反意义的量为核心，检验学生对抽象数学语言的迁移能力。", "通过数的分类辨析夯实基础，为后续数轴与运算学习建立支点。", "将温差计算置于真实情境中，考查运算能力和应用意识。", "结合数轴距离与水位变化，形成从直观到建模的能力梯度。", "综合题聚焦质量偏差，检验信息提取、计算与规范表达。"];
  return `<div class="ai-compose-table-wrap"><table class="ai-compose-table is-reason"><thead><tr><th>题号</th><th>选题原因</th></tr></thead><tbody>${reasons.map((reason, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(reason)}</td></tr>`).join("")}</tbody></table></div>`;
}

function composeOutputFilesHtml() {
  return `<div class="ai-compose-output-files"><button type="button" data-compose-output="paper"><span class="is-word"><i class="ri-file-list-3-line"></i></span><span><strong>试卷</strong><small>已生成到组题编辑区</small></span><i class="ri-arrow-left-line"></i></button><button type="button" data-compose-output="spec"><span class="is-pdf"><i class="ri-file-pdf-2-fill"></i></span><span><strong>命题说明书</strong><small>PDF · 命题依据与质量验收</small></span><i class="ri-eye-line"></i></button></div>`;
}

function openComposeGeneratedPaper(showFeedback = true) {
  const draft = ensureComposeDraft();
  if (!draft) return;
  const root = document.querySelector("#aiWorkspace");
  root?.classList.remove("compose-draft-open");
  root?.classList.add("compose-paper-open");
  activateEditorTab(draft, { expand: true });
  if (showFeedback) showToast("已定位到左侧生成的试卷");
}

function revealComposeDraftPanel() {
  const draft = ensureComposeDraft();
  if (!draft) return;
  const root = document.querySelector("#aiWorkspace");
  root?.classList.remove("compose-paper-open");
  root?.classList.add("compose-draft-open");
  rightPanelSectionState.browseCollapsed = false;
  activateEditorTab(draft, { expand: false, preserveRight: true });
}

function composeStepSection(index, title, body) {
  const statusText = index < composeFlowStage ? "已完成" : (index === composeFlowStage ? "生成中" : "等待中");
  return `<section class="ai-compose-step ${composeStageClass(index)}"><button type="button" data-compose-step><i class="${composeStageIcon(index)}"></i><span>${escapeHtml(title)}</span><em>${statusText}</em><i class="ri-arrow-${index <= composeFlowStage ? "down" : "right"}-s-line"></i></button><div class="ai-compose-step-body"${index <= composeFlowStage ? "" : " hidden"}>${body}</div></section>`;
}

function composeStepHtml() {
  const title = composePaperTitle(composePrompt);
  const sections = [
    ["命题参数定义与模型构建", `<div class="ai-compose-facts"><p><b>场景</b>2026-2027学年北京市朝阳区七年级上学期期末考试 · 数学</p><p><b>题目结构</b>选择题 4 题 · 填空题 2 题 · 解答题 1 题</p><p><b>目标</b>45 分钟 · 中等难度 · 覆盖理解、应用与综合能力</p></div>`],
    ["题库检索与初筛", `<p>已从区级试卷、校考卷与同步教辅中完成语义检索、去重和初筛。</p><div class="ai-compose-source-list"><a class="ai-compose-source-link" href="./detail-ai.html?topic=t2&context=paper"><i class="ri-link"></i>${escapeHtml(title)}</a><a class="ai-compose-source-link" href="./detail-ai.html?topic=t59&context=paper"><i class="ri-link"></i>朝阳区七年级上学期月考试卷</a><a class="ai-compose-source-link" href="./detail-ai.html?topic=t71&context=paper"><i class="ri-link"></i>北京四中七年级上学期期中试卷</a></div>`],
    ["命题双向细目表", composeDetailTableHtml()], ["试题多维校验", composeValidationTableHtml()],
    ["试题结构平衡性复核", `<div class="ai-compose-review-grid"><article><span>难度分布</span><strong>较易 43% · 中等 43% · 较难 14%</strong></article><article><span>题型分布</span><strong>选择 4 · 填空 2 · 解答 1</strong></article><article><span>知识覆盖</span><strong>正负数 · 数轴 · 实际应用</strong></article><article><span>预计用时</span><strong>45 分钟</strong></article></div>`],
    ["AI 试题模拟与质量验收", `<p>已完成逐题作答模拟、答案一致性检查、表述歧义检测与重复度检查。</p><div class="ai-compose-quality"><span><i class="ri-shield-check-line"></i><b>答案一致性</b><strong>100%</strong></span><span><i class="ri-scales-3-line"></i><b>结构合理性</b><strong>通过</strong></span><span><i class="ri-focus-2-line"></i><b>重复度</b><strong>低</strong></span></div>`],
    ["标准化文档输出", `<p>题单已写入左侧组题编辑区，并同步生成可下载文档与命题说明书。</p>${composeOutputFilesHtml()}`]
  ];
  return `
    <div class="ai-compose-job">
      <div class="ai-compose-job-head"><span><i class="ri-sparkling-2-line"></i></span><div><strong>AI 命题流程</strong><small>生成过程与命题依据</small></div><em>${Math.min(composeFlowStage, sections.length)}/${sections.length}</em></div>
      <div class="ai-compose-timeline">${sections.map((section, index) => composeStepSection(index, section[0], section[1])).join("")}</div>
    </div>`;
}

function startComposeFlow() {
  if (!isComposeMode || composeFlowTimer || composeFlowStage >= 7) return;
  composeFlowTimer = window.setInterval(() => {
    composeFlowStage += 1;
    renderComposeThread(composeFollowups);
    if (composeFlowStage >= 7) {
      window.clearInterval(composeFlowTimer);
      composeFlowTimer = null;
      revealComposeDraftPanel();
      showToast("AI 组题完成，已打开左侧题单");
    }
  }, 520);
}

function renderComposeThread(extraMessages = []) {
  const thread = document.querySelector("#aiComposeThread");
  if (!thread) return;
  const prompt = composePrompt || "帮我出一份北京市朝阳区七年级上期末考试试卷";
  const extras = extraMessages.map(item => (
    item.role === "user"
      ? `<article class="ai-compose-msg is-user">${escapeHtml(item.text)}</article>`
      : `<article class="ai-compose-msg is-ai">${escapeHtml(item.text)}</article>`
  )).join("");
  thread.innerHTML = `<p class="ai-compose-user">${escapeHtml(prompt)}</p>${composeStepHtml()}${extras}`;
  thread.scrollTop = thread.scrollHeight;
}

let composeFollowups = [];

function bindComposeControls() {
  if (!isComposeMode) return;
  document.querySelector("#aiComposeSend")?.addEventListener("click", () => sendComposeFollowup());
  document.querySelector("#aiComposeInput")?.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendComposeFollowup();
    }
  });
  document.querySelector("#aiComposeThread")?.addEventListener("click", event => {
    const output = event.target.closest("[data-compose-output]");
    if (output) {
      const type = output.dataset.composeOutput;
      if (type === "spec") openComposeSpecModal();
      else if (type === "paper") openComposeGeneratedPaper();
      return;
    }
    const toggle = event.target.closest("[data-compose-step]");
    if (!toggle) return;
    const step = toggle.closest(".ai-compose-step");
    const body = step?.querySelector(".ai-compose-step-body");
    const arrow = toggle.querySelector(".ri-arrow-down-s-line, .ri-arrow-right-s-line");
    if (!body) return;
    const open = body.hidden;
    body.hidden = !open;
    if (arrow) arrow.className = open ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line";
  });
  document.querySelectorAll("[data-compose-spec-close]").forEach(node => node.addEventListener("click", closeComposeSpecModal));
  document.querySelector("#composeSpecDownload")?.addEventListener("click", () => showToast("正在下载命题说明书 PDF"));
  document.querySelector("#aiComposeEdit")?.addEventListener("click", () => {
    showToast("已进入编辑，可从试卷中继续选用题目");
  });
  document.querySelector("#aiComposeDownload")?.addEventListener("click", () => {
    registerDownload(getActiveTab());
    showToast("正在准备下载 Word");
  });
  document.querySelector("#aiComposeCloseDoc")?.addEventListener("click", () => {
    if (window.history.length > 1) window.history.back();
    else location.href = "./index.html";
  });
  document.querySelectorAll("[data-compose-file]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-compose-file]").forEach(node => node.classList.toggle("is-active", node === button));
      const showAnswer = button.dataset.composeFile === "answer";
      workspace.showAnswers = showAnswer;
      const board = document.querySelector("#questionCardBoard");
      board?.classList.toggle("show-answers", showAnswer);
      const ansBtn = document.querySelector("#toggleShowAnswer");
      if (ansBtn) {
        ansBtn.innerHTML = showAnswer
          ? '<i class="ri-eye-off-line"></i><span>隐藏答案</span>'
          : '<i class="ri-eye-line"></i><span>显示答案</span>';
      }
    });
  });
}

function openComposeSpecModal() {
  const modal = document.querySelector("#composeSpecModal");
  if (modal) modal.hidden = false;
}

function closeComposeSpecModal() {
  const modal = document.querySelector("#composeSpecModal");
  if (modal) modal.hidden = true;
}

function bindRecordControls() {
  if (!isRecordMode) return;
  document.querySelector("#aiRecordProgress")?.addEventListener("click", showRecordResults);
  document.querySelector("#aiRecordProgress")?.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showRecordResults();
    }
  });
  document.querySelector("#showAiRecordResult")?.addEventListener("click", event => {
    event.stopPropagation();
    showRecordResults();
  });
  document.querySelectorAll(".ai-record-source-tools button").forEach(button => {
    button.addEventListener("click", () => showToast(button.title || "源文件工具"));
  });
}

function sendComposeFollowup() {
  const input = document.querySelector("#aiComposeInput");
  const text = String(input?.value || "").trim();
  if (!text) return;
  if (input) input.value = "";
  composeFollowups.push({ role: "user", text });
  composeFollowups.push({ role: "assistant", text: "已收到调整需求。你可以在右侧试卷中继续选用题目。" });
  renderComposeThread(composeFollowups);
}

function questionDefaults(q) {
  return {
    minutes: q.minutes || (q.type === "解答题" ? 5 : q.type === "填空题" ? 2 : 1),
    competency: q.competency || "运算能力",
    badges: q.badges || []
  };
}

function questionCardHtml(q, tab) {
  const skipped = tab.removedQuestionIds.includes(q.id);
  const selected = isQuestionGloballySelected(tab.topicId, q.id);
  const answerOpen = expandedAnalysisIds.has(q.id);
  const modified = tab.modifiedQuestions[q.id];
  const stem = modified?.stem || q.stem;
  const optionList = modified?.options || q.options || [];
  // 长选项并排会互相错位，超过阈值改单列排版
  const singleColumn = optionList.some(opt => String(opt).length > 20);
  const options = optionList.length
    ? `<div class="q-options ${singleColumn ? "q-options-single" : ""}">${optionList.map(opt => `<span>${escapeHtml(opt)}</span>`).join("")}</div>`
    : "";
  const picked = dragPickIds.has(q.id);
  const sourceLine = isComposeMode && q.sourceLabel
    ? `<p class="q-compose-source">${escapeHtml(q.sourceLabel)}</p>`
    : "";
  return `
    <article class="question-item ${skipped ? "is-skipped" : ""} ${selected ? "selected" : ""} ${picked ? "drag-picked" : ""} ${modified ? "modified" : ""} ${answerOpen ? "answer-open" : ""}"
      data-q="${q.id}" data-question-type="${escapeHtml(q.type || "")}" data-question-difficulty="${escapeHtml(q.difficulty || "")}" data-topic-id="${escapeHtml(getBaseTopicId(tab.topicId))}" tabindex="0" aria-label="第 ${q.num} 题" draggable="${skipped ? "false" : "true"}" title="点「选用」可用于跨资源组题">
      <div class="q-body">
        <p class="q-stem">
          <button type="button" class="q-ai-adapt-btn" data-card-action="adapt" data-q="${q.id}" title="AI改编当前题目">
            <i class="ri-sparkling-2-line"></i><span>AI改编</span>
          </button>
          <span class="q-num-mark">${q.num}</span>
          <span class="q-stem-text">${escapeHtml(stem)}</span>
        </p>
        ${options}
        ${sourceLine}
      </div>
      <div class="q-answer-panel">
        <div class="q-inline-answer"><em>答案</em>${escapeHtml(modified?.answer || q.answer)}</div>
        <div class="q-inline-analysis"><em>解析</em>${escapeHtml(modified?.analysis || q.analysis)}</div>
      </div>
      <div class="q-card-bar">
        <div class="q-card-actions">
          <button type="button" class="q-action-ghost ${answerOpen ? "active" : ""}" data-card-action="analysis" data-q="${q.id}" aria-pressed="${answerOpen}">
            <i class="ri-file-text-line"></i><span>${answerOpen ? "收起答案" : "答案"}</span>
          </button>
          ${selected
    ? `<button type="button" class="q-remove-btn" data-card-action="select" data-q="${q.id}" title="取消选用"><i class="ri-check-line"></i><span>取消选用</span></button>`
    : `<button type="button" class="q-add-btn" data-card-action="select" data-q="${q.id}" title="选用到本次组题"><i class="ri-add-line"></i><span>选用</span></button>`}
        </div>
      </div>
    </article>`;
}

function renderPaperActionButtons(tab) {
  const batchButton = document.querySelector("#batchAddAllQuestions");
  const saveButton = document.querySelector("#savePaperCopy");
  const saveLabel = document.querySelector("#savePaperCopyLabel");
  const copyNote = document.querySelector("#paperCopyNote");
  if (!tab) return;
  const selectable = getSelectableQuestions(tab);
  const selectedCount = selectable.filter(q => isQuestionGloballySelected(tab.topicId, q.id)).length;
  const missingCount = Math.max(0, selectable.length - selectedCount);
  const destinationTab = getQuestionDestinationEditorTab() || getActiveEditorTab();
  const destinationTitle = stripEditorTitlePrefix(getEditorDisplayTitle(destinationTab))
    || stripEditorTitlePrefix(getCanvasDisplayTitle())
    || "当前题单";
  if (batchButton) {
    batchButton.disabled = selectable.length === 0 || missingCount === 0;
    batchButton.innerHTML = missingCount === 0
      ? `<i class="ri-checkbox-circle-fill"></i><span>已加入题单</span>`
      : `<i class="ri-layout-left-line"></i><span>加入题单</span>`;
    batchButton.title = missingCount === 0
      ? `当前整卷已加入「${destinationTitle}」`
      : `将当前整卷加入「${destinationTitle}」，自动去重`;
  }
  const isEditableQuestionList = Boolean(tab.isQuestionList && !tab.aiGenerated);
  if (saveButton) {
    saveButton.disabled = selectable.length === 0;
    saveButton.classList.remove("is-saved");
    saveButton.title = isEditableQuestionList ? "保存当前题单" : "复制整卷到左侧新题单并展开编辑，原卷不变";
    const icon = saveButton.querySelector("i");
    if (icon) icon.className = isEditableQuestionList ? "ri-save-3-line" : "ri-file-copy-2-line";
  }
  if (saveLabel) {
    saveLabel.textContent = isEditableQuestionList ? "保存题单" : "编辑";
  }
  if (copyNote) {
    copyNote.textContent = isEditableQuestionList
      ? "修改将保存到当前题单"
      : `在左侧创建包含整套 ${selectable.length} 题的新题单，原卷不变`;
  }
}

function renderQuestionCards() {
  const board = document.querySelector("#questionCardBoard");
  if (!board) {
    renderSelectedContext();
    return;
  }
  const tab = getActiveTab();
  if (!tab) return;
  syncTabSelectedQuestionIds(tab);
  if (!isComposeMode && !isRecordMode && !isShellFrameActive() && !isAiAssistantViewActive()) {
    document.title = `${tab.title} · AI 试卷工作台`;
  }
  renderMeta(tab);
  renderPaperActionButtons(tab);

  const sections = [...new Set(tab.questions.map(q => q.section))];
  board.classList.toggle("show-answers", workspace.showAnswers);
  board.innerHTML = sections.map(section => {
    const items = tab.questions.filter(q => q.section === section);
    const selectable = items.filter(q => !tab.removedQuestionIds.includes(q.id));
    const qIds = selectable.map(q => q.id).join(",");
    return `
      <section class="question-section" data-section="${escapeHtml(section)}">
        <header class="question-section-head" draggable="true" data-section="${escapeHtml(section)}" data-q-ids="${qIds}" title="拖到左侧，可整组选用本大题">
          <div class="question-section-head-main">
            <i class="ri-draggable question-section-drag" aria-hidden="true"></i>
            <h3>${escapeHtml(section)}</h3>
          </div>
        </header>
        <div class="paper-sheet">
          <div class="question-list-flow">${items.map(q => questionCardHtml(q, tab)).join("")}</div>
        </div>
      </section>`;
  }).join("");

  renderSelectedContext();
  bindQuestionCardEvents();
}

function renderSelectedFooter(count) {
  const button = document.querySelector("#createQuestionList");
  const label = document.querySelector("#createQuestionListLabel");
  const hint = document.querySelector("#aiSelectedHint");
  const railBadge = document.querySelector("#aiSelectedExpandCount");
  const stats = document.querySelector("#aiCanvasStats");
  const previewBtn = document.querySelector("#previewQuestionList");
  const previewLabel = document.querySelector("#previewQuestionListLabel");
  const scoreBtn = document.querySelector("#scoreQuestionList");
  const extraBtns = document.querySelectorAll(".ai-canvas-wide-btn");
  const selected = getGlobalSelectedQuestions();
  const activeDraft = getActiveEditorDraft();
  const paperEditSaved = Boolean(activeDraft?.saved && !activeDraft.dirty);
  if (button) {
    button.disabled = count === 0 || paperEditSaved;
    button.classList.toggle("is-saved", paperEditSaved);
  }
  if (label) label.textContent = "保存";
  if (button) {
    button.title = activeDraft ? "保存到我的创建" : "保存到我的-我的创建";
    const icon = button.querySelector("i");
    if (icon) icon.className = "ri-save-3-line";
  }
  applyCanvasTitleToUi();
  bindCanvasTitleEditor(document.querySelector("#canvasHeadTitle"));
  bindCanvasTitleEditor(document.querySelector("#canvasPaperTitle"));
  if (hint) {
    if (selectedPanelEnlarged) {
      hint.hidden = true;
      hint.classList.remove("is-count");
    } else if (count > 0) {
      hint.hidden = false;
      hint.textContent = `组题中 · 已选 ${count} 题`;
      hint.classList.add("is-count");
    } else {
      hint.hidden = false;
      hint.textContent = "组题中 · 已选 0 题";
      hint.classList.add("is-count");
    }
  }
  if (railBadge) {
    railBadge.textContent = count > 99 ? "99+" : String(count);
    railBadge.hidden = count === 0;
  }
  if (stats) {
    stats.hidden = true;
  }
  if (previewBtn) {
    previewBtn.disabled = count === 0;
    previewBtn.hidden = !selectedPanelEnlarged;
  }
  if (previewLabel) previewLabel.textContent = "预览";
  if (scoreBtn) {
    scoreBtn.disabled = true;
    scoreBtn.hidden = true;
  }
  extraBtns.forEach(btn => {
    btn.disabled = count === 0;
    btn.hidden = !["assign", "download"].includes(btn.dataset.canvasAction) && !selectedPanelEnlarged;
  });
  if (scoreBtn) scoreBtn.hidden = true;
}

function syncSelectedPanelChrome() {
  const root = document.querySelector("#aiWorkspace");
  const wholePaperEditor = !isCanvasShell && selectedPanelEnlarged;
  root?.classList.toggle("selected-panel-enlarged", selectedPanelEnlarged);
  root?.classList.toggle("whole-paper-editor", wholePaperEditor);
  document.querySelector("#aiSelectedPanel")?.classList.toggle("is-enlarged", selectedPanelEnlarged);
  const enlargeBtn = document.querySelector("#enlargeSelectedPanel");
  const answerBtn = document.querySelector("#toggleSelectedAnswers");
  const preview = document.querySelector("#aiSelectedPreview");
  if (enlargeBtn) {
    enlargeBtn.innerHTML = '<i class="ri-expand-diagonal-line" aria-hidden="true"></i><span>展开编辑</span>';
    enlargeBtn.hidden = selectedPanelEnlarged;
    enlargeBtn.setAttribute("aria-pressed", selectedPanelEnlarged ? "true" : "false");
    enlargeBtn.title = "展开编辑当前题单";
  }
  const compactCollapse = document.querySelector("#collapseSelectedPanel");
  const topbarCollapse = document.querySelector("#topbarCollapseCanvas");
  const topbarAddQuestions = document.querySelector("#docTabAiAssistant");
  if (compactCollapse) compactCollapse.hidden = false;
  if (topbarCollapse) topbarCollapse.hidden = !wholePaperEditor;
  if (topbarAddQuestions) topbarAddQuestions.style.display = selectedPanelEnlarged ? "none" : "";
  const leaf = document.querySelector("#breadcrumbLeaf");
  if (selectedPanelEnlarged && leaf) leaf.textContent = wholePaperEditor ? "编辑" : getCanvasDisplayTitle();
  const selectedPanel = document.querySelector("#aiSelectedPanel");
  if (selectedPanel && wholePaperEditor) selectedPanel.setAttribute("aria-label", "编辑题单");
  if (answerBtn) {
    answerBtn.hidden = true;
  }
  preview?.classList.toggle("show-answers", selectedPanelEnlarged && selectedShowAnswers);
  preview?.classList.toggle("is-enlarged", selectedPanelEnlarged);
  const studio = document.querySelector("#aiCanvasStudio");
  if (studio) studio.hidden = !selectedPanelEnlarged;
  const footer = document.querySelector("#aiSelectedFooter");
  const collapseBtn = document.querySelector("#collapseSelectedPanel");
  const panelBody = document.querySelector(".ai-selected-body");
  if (footer && panelBody) {
    panelBody.appendChild(footer);
  }
  mountQuestionDraftToolbarActions(document.querySelector("#questionDraftTabs"));
}

function setSelectedPanelEnlarged(next) {
  selectedPanelEnlarged = Boolean(next);
  if (selectedPanelEnlarged) {
    rightPanelSectionState.selectedCollapsed = false;
    rightPanelSectionState.browseCollapsed = true;
    applySelectedPanelState();
  } else {
    selectedShowAnswers = false;
    selectedExpandedAnalysisKeys.clear();
  }
  syncSelectedPanelChrome();
  const activeTab = getActiveTab();
  if (activeTab) renderMeta(activeTab);
  renderSelectedContext();
}

function restoreSplitWorkspaceView() {
  const root = document.querySelector("#aiWorkspace");
  if (isComposeMode) {
    root?.classList.remove("compose-paper-open");
    root?.classList.add("compose-draft-open");
  }
  rightPanelSectionState.selectedCollapsed = false;
  rightPanelSectionState.browseCollapsed = false;
  setCanvasManuallyCollapsed(false);
  setSelectedPanelEnlarged(false);
  applySelectedPanelState();
  const activeTab = getActiveTab();
  if (activeTab) renderMeta(activeTab);
  saveWorkspace();
}

function toggleSelectedPanelEnlarge() {
  setSelectedPanelEnlarged(!selectedPanelEnlarged);
}

function toggleSelectedShowAnswers() {
  if (!selectedPanelEnlarged) return;
  selectedShowAnswers = !selectedShowAnswers;
  syncSelectedPanelChrome();
  renderSelectedContext();
}

function toggleSelectedQuestionAnalysis(selectionKey) {
  if (selectedExpandedAnalysisKeys.has(selectionKey)) selectedExpandedAnalysisKeys.delete(selectionKey);
  else selectedExpandedAnalysisKeys.add(selectionKey);
  renderSelectedContext();
}

function selectedPreviewCompactHtml(item, index) {
  const q = item.question || {};
  const optionList = q.options || [];
  const singleColumn = optionList.some(option => String(option).length > 20);
  const options = optionList.length
    ? `<div class="ai-canvas-options ${singleColumn ? "is-single" : ""}">${optionList.map(option => `<span>${escapeHtml(option)}</span>`).join("")}</div>`
    : "";
  const sourceTitle = item.sourceTitle || "来源试卷";
  return `
    <article class="ai-canvas-item" draggable="true" data-selection-key="${item.selectionKey}" data-topic-id="${escapeHtml(item.topicId)}" data-q="${escapeHtml(item.question.id)}" tabindex="0">
      <i class="ri-draggable ai-canvas-drag" aria-hidden="true" title="拖动排序"></i>
      <span class="ai-canvas-index">${index + 1}</span>
      <div class="ai-canvas-content">
        <p class="ai-canvas-stem" data-canvas-stem>${escapeHtml(q.stem)}</p>
        ${options}
        <div class="ai-canvas-hover-meta" aria-label="题目信息">
          <button type="button" class="ai-canvas-source" data-selected-action="locate-source" data-selection-key="${item.selectionKey}" title="在右侧定位：${escapeHtml(sourceTitle)}">
            <i class="ri-links-line"></i><span>来源：${escapeHtml(sourceTitle)}</span>
          </button>
        </div>
      </div>
      <button type="button" class="ai-canvas-minus" data-selected-action="remove" data-selection-key="${item.selectionKey}" aria-label="移出" title="移出">
        <i class="ri-subtract-line"></i>
      </button>
    </article>`;
}

function compactQuestionSectionTitle(item) {
  const type = String(item?.question?.type || "");
  if (type.includes("选择")) return "一、单项选择题";
  if (type.includes("填空")) return "二、填空题";
  if (type.includes("解答")) return "三、解答题";
  const section = String(item?.question?.section || "").trim();
  if (section) return section;
  return "其他题型";
}

function renderCompactQuestionSections(items) {
  const sectionOrder = ["一、单项选择题", "二、填空题", "三、解答题", "其他题型"];
  const sections = [];
  const sectionMap = new Map();
  items.forEach(item => {
    const title = compactQuestionSectionTitle(item);
    if (!sectionMap.has(title)) {
      const section = { title, items: [] };
      sections.push(section);
      sectionMap.set(title, section);
    }
    sectionMap.get(title).items.push(item);
  });
  sections.sort((a, b) => {
    const aIndex = sectionOrder.indexOf(a.title);
    const bIndex = sectionOrder.indexOf(b.title);
    return (aIndex < 0 ? sectionOrder.length : aIndex) - (bIndex < 0 ? sectionOrder.length : bIndex);
  });
  let questionIndex = 0;
  const content = sections.map(section => {
    const rows = section.items.map(item => selectedPreviewCompactHtml(item, questionIndex++)).join("");
    return `<section class="ai-live-question-section">
      <h3>${escapeHtml(section.title)}</h3>
      <div class="ai-live-question-list">${rows}</div>
    </section>`;
  }).join("");
  return content;
}

function selectedPreviewEnlargedHtml(item, index) {
  const q = item.question;
  const answerOpen = selectedExpandedAnalysisKeys.has(item.selectionKey);
  const optionList = q.options || [];
  const singleColumn = optionList.some(opt => String(opt).length > 20);
  const options = optionList.length
    ? `<div class="q-options ${singleColumn ? "q-options-single" : ""}">${optionList.map(opt => `<span>${escapeHtml(opt)}</span>`).join("")}</div>`
    : "";
  const displayNum = q.num || index + 1;
  return `
    <article class="question-item ai-selected-enlarged-item ${answerOpen ? "answer-open" : ""}"
      data-selection-key="${item.selectionKey}" data-topic-id="${escapeHtml(item.topicId)}" data-q="${escapeHtml(q.id)}" tabindex="0"
      aria-label="已选第 ${displayNum} 题">
      <div class="q-body">
        <p class="q-stem"><b>${displayNum}.</b> ${escapeHtml(q.stem)}</p>
        ${options}
      </div>
      <div class="q-answer-panel">
        <div class="q-inline-answer"><em>答案</em>${escapeHtml(q.answer || "暂无")}</div>
        <div class="q-inline-analysis"><em>解析</em>${escapeHtml(q.analysis || "暂无")}</div>
      </div>
      <div class="q-card-bar">
        <div class="q-card-actions">
          <button type="button" class="q-action-ghost ${answerOpen ? "active" : ""}" data-selected-action="analysis" data-selection-key="${item.selectionKey}" aria-pressed="${answerOpen}">
            <i class="ri-file-text-line"></i><span>${answerOpen ? "收起答案" : "答案"}</span>
          </button>
          <button type="button" class="q-remove-btn" data-selected-action="remove" data-selection-key="${item.selectionKey}" title="移出已选题目">
            <i class="ri-close-line"></i><span>移出</span>
          </button>
        </div>
      </div>
    </article>`;
}

function renderCanvasGroupHtml(group, startIndex) {
  const collapsed = collapsedCanvasGroupIds.has(group.topicId);
  const itemsHtml = selectedPanelEnlarged
    ? group.items.map((item, index) => selectedPreviewEnlargedHtml(item, startIndex + index)).join("")
    : group.items.map((item, index) => selectedPreviewCompactHtml(item, startIndex + index)).join("");
  return `
    <section class="ai-canvas-group ${collapsed ? "is-collapsed" : ""}" data-canvas-group="${escapeHtml(group.topicId)}">
      <header class="ai-canvas-group-head">
        <button type="button" class="ai-canvas-group-toggle" data-selected-action="toggle-group" data-topic-id="${escapeHtml(group.topicId)}">
          <i class="${collapsed ? "ri-arrow-right-s-line" : "ri-arrow-down-s-line"}"></i>
          <span>${escapeHtml(group.title)}</span>
          <span class="ai-canvas-group-count">(${group.items.length})</span>
        </button>
        <button type="button" class="ai-canvas-group-delete" data-selected-action="remove-group" data-topic-id="${escapeHtml(group.topicId)}">整组删</button>
      </header>
      <div class="ai-canvas-group-body">${itemsHtml}</div>
    </section>`;
}

function flashQuestionNode(node) {
  if (!node) return;
  node.classList.remove("focus-flash");
  void node.offsetWidth;
  node.classList.add("focus-flash");
  window.setTimeout(() => node.classList.remove("focus-flash"), 1200);
}

function locateCanvasQuestion(item, options = {}) {
  const { switchTabIfNeeded = false } = options;
  if (!item) return;
  const active = getActiveTab();
  const samePaper = !workspace.homeActive
    && !workspace.activeBrowseFilter
    && active
    && getBaseTopicId(active.topicId) === getBaseTopicId(item.topicId)
    && !active.isQuestionList;
  if (!samePaper) {
    if (!switchTabIfNeeded) return;
    workspace.homeActive = false;
    workspace.activeBrowseFilter = null;
    const existing = findTabForTopic(item.topicId);
    if (existing) workspace.activeTabId = existing.id;
    else openTab(item.topicId, {
      context: item.sourceContext || "paper",
      title: item.sourceTitle || undefined,
      shortTitle: item.sourceShortTitle || item.sourceTitle || undefined,
      lessonKey: item.sourceLessonKey || item.sourceTitle || undefined
    });
    saveWorkspace();
    renderAll();
  }
  const reveal = () => {
    const node = document.querySelector(`#questionCardBoard .question-item[data-q="${item.question.id}"]`);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    flashQuestionNode(node);
  };
  window.requestAnimationFrame(() => window.requestAnimationFrame(reveal));
}

function reorderCanvasItem(fromKey, targetKey, place = "before") {
  if (!fromKey || fromKey === targetKey) return;
  const list = [...getGlobalSelectedQuestions()];
  const fromIdx = list.findIndex(item => item.selectionKey === fromKey);
  if (fromIdx < 0) return;
  const [moved] = list.splice(fromIdx, 1);
  let toIdx = list.findIndex(item => item.selectionKey === targetKey);
  if (toIdx < 0) list.push(moved);
  else {
    if (place === "after") toIdx += 1;
    list.splice(toIdx, 0, moved);
  }
  setActiveSelectedQuestions(list);
  saveWorkspace();
  renderSelectedContext();
}

function removeCanvasGroup(topicId) {
  setActiveSelectedQuestions(getGlobalSelectedQuestions().filter(item => item.topicId !== topicId));
  collapsedCanvasGroupIds.delete(topicId);
  if (!isWholePaperEditActive()) syncTabSelectedQuestionIds(getActiveTab());
  saveWorkspace();
  renderQuestionCards();
}

function persistCanvasStemEdit(item, nextStem) {
  const stem = String(nextStem || "").trim();
  if (!item || !stem || stem === item.question.stem) return false;
  item.question.stem = stem;
  const tab = findTabForTopic(item.topicId);
  if (tab && !isWholePaperEditActive()) {
    tab.modifiedQuestions = tab.modifiedQuestions || {};
    tab.modifiedQuestions[item.question.id] = {
      ...(tab.modifiedQuestions[item.question.id] || {}),
      stem
    };
  }
  if (isWholePaperEditActive()) markWholePaperEditDirty();
  saveWorkspace();
  return true;
}

function startCanvasStemEdit(selectionKey) {
  const preview = document.querySelector("#aiSelectedPreview");
  const itemNode = preview?.querySelector(`[data-selection-key="${selectionKey}"]`);
  const stemNode = itemNode?.querySelector("[data-canvas-stem], .q-stem-text, .q-stem");
  const item = getGlobalSelectedQuestions().find(entry => entry.selectionKey === selectionKey);
  if (!stemNode || !item) return;
  stemNode.contentEditable = "true";
  stemNode.classList.add("is-editing");
  stemNode.focus();
  const range = document.createRange();
  range.selectNodeContents(stemNode);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  const finish = () => {
    stemNode.contentEditable = "false";
    stemNode.classList.remove("is-editing");
    const changed = persistCanvasStemEdit(item, stemNode.textContent);
    renderQuestionCards();
    if (changed) showToast("已修改本次组题中的题目");
  };
  stemNode.addEventListener("blur", finish, { once: true });
  stemNode.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      stemNode.blur();
    }
    if (event.key === "Escape") {
      stemNode.textContent = item.question.stem;
      stemNode.blur();
    }
  }, { once: true });
}

function bindCanvasItemInteractions(preview) {
  preview.querySelectorAll(".ai-canvas-item, .ai-selected-enlarged-item").forEach(node => {
    const selectionKey = node.dataset.selectionKey;
    const item = getGlobalSelectedQuestions().find(entry => entry.selectionKey === selectionKey);
    if (!item) return;

    node.addEventListener("mouseenter", () => {
      if (selectedPanelEnlarged) return;
      clearTimeout(canvasHoverTimer);
      canvasHoverTimer = window.setTimeout(() => locateCanvasQuestion(item), 280);
    });
    node.addEventListener("mouseleave", () => clearTimeout(canvasHoverTimer));
    node.addEventListener("click", event => {
      if (event.target.closest("[data-selected-action], [contenteditable='true']")) return;
      locateCanvasQuestion(item, { switchTabIfNeeded: true });
    });

    if (!node.matches(".ai-canvas-item")) return;
    node.addEventListener("dragstart", event => {
      if (event.target.closest("button, [contenteditable='true']")) {
        event.preventDefault();
        return;
      }
      canvasDragKey = selectionKey;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(CANVAS_DRAG_MIME, selectionKey);
      event.dataTransfer.setData("text/plain", selectionKey);
      node.classList.add("is-dragging");
    });
    node.addEventListener("dragend", () => {
      canvasDragKey = null;
      node.classList.remove("is-dragging");
      preview.querySelectorAll(".is-drop-before, .is-drop-after").forEach(el => el.classList.remove("is-drop-before", "is-drop-after"));
    });
    node.addEventListener("dragover", event => {
      if (!canvasDragKey || canvasDragKey === selectionKey) return;
      event.preventDefault();
      const rect = node.getBoundingClientRect();
      const place = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
      node.classList.toggle("is-drop-before", place === "before");
      node.classList.toggle("is-drop-after", place === "after");
    });
    node.addEventListener("dragleave", () => node.classList.remove("is-drop-before", "is-drop-after"));
    node.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      const fromKey = event.dataTransfer.getData(CANVAS_DRAG_MIME) || canvasDragKey;
      const rect = node.getBoundingClientRect();
      const place = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
      node.classList.remove("is-drop-before", "is-drop-after");
      reorderCanvasItem(fromKey, selectionKey, place);
    });
  });
}

function bindSelectedPreviewEvents() {
  const preview = document.querySelector("#aiSelectedPreview");
  if (!preview) return;
  preview.querySelector("[data-open-add-questions]")?.addEventListener("click", event => {
    event.stopPropagation();
    openAddQuestions();
  });
  preview.querySelectorAll("[data-selected-action]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      button.closest("details")?.removeAttribute("open");
      const action = button.dataset.selectedAction;
      const selectionKey = button.dataset.selectionKey;
      const topicId = button.dataset.topicId;
      const qId = button.dataset.q;
      const item = getGlobalSelectedQuestions().find(entry => entry.selectionKey === selectionKey);
      const q = item?.question;

      if (action === "remove" && selectionKey) {
        removeGlobalSelectedByKey(selectionKey);
        return;
      }
      if (action === "remove-group" && topicId) {
        removeCanvasGroup(topicId);
        showToast("已删除该卷在本次组题中的题目");
        return;
      }
      if (action === "toggle-group" && topicId) {
        if (collapsedCanvasGroupIds.has(topicId)) collapsedCanvasGroupIds.delete(topicId);
        else collapsedCanvasGroupIds.add(topicId);
        renderSelectedContext();
        return;
      }
      if (action === "edit" && selectionKey) {
        startCanvasStemEdit(selectionKey);
        return;
      }
      if (action === "analysis" && selectionKey) {
        toggleSelectedQuestionAnalysis(selectionKey);
        return;
      }
      if (action === "locate-source" && item) {
        locateCanvasQuestion(item, { switchTabIfNeeded: true });
        return;
      }
      if (action === "favorite" && topicId && qId) {
        const added = toggleQuestionFavorite(qId, topicId);
        showToast(added ? `已收藏第 ${q?.num || ""} 题` : `已取消收藏第 ${q?.num || ""} 题`);
        return;
      }
      if (action === "similar") showToast(`正在查找第 ${q?.num || ""} 题的相似题…`);
      if (action === "adapt") showToast(`正在生成第 ${q?.num || ""} 题的 AI 改编题…`);
      if (action === "fix") showToast(`已记录第 ${q?.num || ""} 题的纠错反馈，教研会尽快核对`);
    });
  });
  bindCanvasItemInteractions(preview);
}

function getCanvasOrderedItems() {
  const items = getGlobalSelectedQuestions();
  if (!canvasOrderByType) return items;
  const rank = type => (String(type).includes("选择") ? 0 : String(type).includes("填空") ? 1 : 2);
  return [...items].sort((a, b) => rank(a.question?.type) - rank(b.question?.type));
}

function ensureCanvasFocus() {
  const items = getCanvasOrderedItems();
  if (!items.length) {
    canvasFocusKey = null;
    return null;
  }
  if (!items.some(item => item.selectionKey === canvasFocusKey)) {
    canvasFocusKey = items[0].selectionKey;
  }
  return items.find(item => item.selectionKey === canvasFocusKey) || items[0];
}

function canvasPaperItemHtml(item, index) {
  const q = item.question;
  const optionList = q.options || [];
  const options = optionList.length
    ? `<div class="q-options">${optionList.map(opt => `<span>${escapeHtml(opt)}</span>`).join("")}</div>`
    : "";
  return `
    <article class="canvas-paper-item ${item.selectionKey === canvasFocusKey ? "is-active" : ""}" draggable="true" data-selection-key="${item.selectionKey}" data-topic-id="${escapeHtml(item.topicId)}" data-q="${escapeHtml(q.id)}">
      <i class="ri-draggable canvas-paper-drag" aria-hidden="true" title="拖动排序"></i>
      <p class="q-stem"><b>${index + 1}.</b> ${escapeHtml(q.stem)}</p>
      ${options}
      <button type="button" class="canvas-paper-item-remove" data-selected-action="remove" data-selection-key="${item.selectionKey}" aria-label="移出" title="移出"><i class="ri-subtract-line"></i></button>
    </article>`;
}

function renderCanvasOrderList(items) {
  const wrap = document.querySelector("#aiCanvasOrderList");
  if (!wrap) return;
  if (!items.length) {
    wrap.innerHTML = `<p class="ai-canvas-info-empty">还没有选用题目</p>`;
    return;
  }
  const sections = canvasOrderByType
    ? [...new Set(items.map(item => item.question.type || "题目"))].map(type => ({
      title: type,
      items: items.filter(item => (item.question.type || "题目") === type)
    }))
    : [{ title: "画布题目", items }];
  let offset = 0;
  wrap.innerHTML = sections.map(section => {
    const chips = section.items.map((item, index) => {
      const num = offset + index + 1;
      return `<button type="button" class="ai-canvas-order-item ${item.selectionKey === canvasFocusKey ? "is-active" : ""}" data-canvas-focus="${item.selectionKey}">${num}</button>`;
    }).join("");
    offset += section.items.length;
    return `<section class="ai-canvas-order-section"><h3>${escapeHtml(section.title)}</h3><div class="ai-canvas-order-items">${chips}</div></section>`;
  }).join("");
}

function renderCanvasInfo(item) {
  const wrap = document.querySelector("#aiCanvasInfo");
  if (!wrap) return;
  if (!item) {
    wrap.innerHTML = isWholePaperEditActive()
      ? `<p class="ai-canvas-info-empty">当前草稿还没有题目。</p>`
      : `<p class="ai-canvas-info-empty">选用题目后，这里会显示答案、解析和知识点。</p>`;
    return;
  }
  const q = item.question;
  const meta = questionDefaults(q);
  const displayType = q.type === "选择题" ? "单项选择题" : (q.type || "题目");
  wrap.innerHTML = `
    <div class="ai-canvas-info-source">${escapeHtml(getCanvasSourceLabel(item))}</div>
    <p class="ai-canvas-info-trail">初中 / 数学 / ${escapeHtml(displayType)} / ${escapeHtml(q.difficulty || "中等")} / ${meta.minutes} 分钟</p>
    <div class="ai-canvas-info-fact"><i class="ri-book-2-line"></i><span>知识点：${escapeHtml(q.knowledge || "未标注")}</span></div>
    <div class="ai-canvas-info-fact"><i class="ri-lightbulb-line"></i><span>核心素养：${escapeHtml(meta.competency)}</span></div>
    <section class="ai-canvas-info-section">
      <h4>答案</h4>
      <p>${escapeHtml(q.answer || "暂无")}</p>
    </section>
    <section class="ai-canvas-info-section">
      <h4>解析</h4>
      <p>${escapeHtml(q.analysis || "暂无")}</p>
    </section>`;
}

function editorQuestionBank() {
  return Object.entries(paperQuestions).flatMap(([topicId, questions]) =>
    questions.map(question => ({ topicId, question })));
}

function applyEditorQuestionForm(form, item, settings = {}) {
  if (!form || !item?.question) return false;
  const data = new FormData(form);
  const stem = String(data.get("stem") || "").trim();
  if (!stem && settings.requireStem) {
    showToast("题干不能为空");
    form.querySelector("[name='stem']")?.focus();
    return false;
  }
  const options = String(data.get("options") || "")
    .split(/\r?\n/)
    .map(option => option.trim())
    .filter(Boolean);
  Object.assign(item.question, {
    type: String(data.get("type") || "题目"),
    difficulty: String(data.get("difficulty") || "中等"),
    knowledge: String(data.get("knowledge") || "").trim(),
    stem,
    options,
    answer: String(data.get("answer") || "").trim(),
    analysis: String(data.get("analysis") || "").trim()
  });
  markWholePaperEditDirty();
  saveWorkspace();
  return true;
}

function replaceEditorQuestion(item) {
  if (!item || !isWholePaperEditActive()) return;
  const currentStems = new Set(getGlobalSelectedQuestions().map(entry => String(entry.question?.stem || "")));
  const candidates = editorQuestionBank().filter(candidate =>
    !currentStems.has(String(candidate.question.stem)) && candidate.question.type === item.question.type);
  const fallback = editorQuestionBank().filter(candidate => !currentStems.has(String(candidate.question.stem)));
  const picked = candidates[0] || fallback[0];
  if (!picked) {
    showToast("暂无可替换的题目");
    return;
  }
  const stableId = String(item.question.id || `draft-${Date.now()}`);
  item.topicId = picked.topicId;
  item.sourceTitle = "智能题库推荐";
  item.question = { ...cloneWorkspaceValue(picked.question), id: stableId, num: item.question.num };
  markWholePaperEditDirty();
  saveWorkspace();
  renderSelectedContext();
  showToast("已替换题目，原试卷不受影响");
}

function addEditorQuestion() {
  const draft = getActiveEditorDraft();
  if (!draft) return;
  const usedStems = new Set(draft.questions.map(item => item.question?.stem));
  const picked = editorQuestionBank().find(candidate => !usedStems.has(candidate.question.stem));
  if (!picked) {
    showToast("暂无更多可添加的题目");
    return;
  }
  const id = `draft-${Date.now()}-${draft.questions.length + 1}`;
  const question = { ...cloneWorkspaceValue(picked.question), id, num: draft.questions.length + 1 };
  const entry = {
    selectionKey: `editor::${getActiveEditorTab().id}::${id}`,
    topicId: picked.topicId,
    sourceTitle: "智能题库推荐",
    question
  };
  draft.questions.push(entry);
  canvasFocusKey = entry.selectionKey;
  markWholePaperEditDirty();
  saveWorkspace();
  renderSelectedContext();
}

function bindCanvasStudioEvents() {
  const studio = document.querySelector("#aiCanvasStudio");
  if (!studio) return;

  studio.querySelectorAll("[data-canvas-order]").forEach(button => {
    button.classList.toggle("is-active", button.dataset.canvasOrder === (canvasOrderByType ? "type" : "drag"));
    button.onclick = () => {
      canvasOrderByType = button.dataset.canvasOrder === "type";
      renderCanvasStudio();
    };
  });

  studio.querySelectorAll("[data-canvas-focus]").forEach(button => {
    button.addEventListener("click", () => {
      canvasFocusKey = button.dataset.canvasFocus;
      renderCanvasStudio();
    });
  });

  studio.querySelectorAll(".canvas-paper-item").forEach(node => {
    const selectionKey = node.dataset.selectionKey;
    node.addEventListener("click", event => {
      if (event.target.closest("[data-selected-action]")) return;
      canvasFocusKey = selectionKey;
      renderCanvasStudio();
    });
    node.addEventListener("dragstart", event => {
      if (event.target.closest("button, [contenteditable='true']")) {
        event.preventDefault();
        return;
      }
      canvasDragKey = selectionKey;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(CANVAS_DRAG_MIME, selectionKey);
      event.dataTransfer.setData("text/plain", selectionKey);
      node.classList.add("is-dragging");
    });
    node.addEventListener("dragend", () => {
      canvasDragKey = null;
      node.classList.remove("is-dragging");
      studio.querySelectorAll(".is-drop-before, .is-drop-after").forEach(el => el.classList.remove("is-drop-before", "is-drop-after"));
    });
    node.addEventListener("dragover", event => {
      if (!canvasDragKey || canvasDragKey === selectionKey) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const rect = node.getBoundingClientRect();
      const place = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
      node.classList.toggle("is-drop-before", place === "before");
      node.classList.toggle("is-drop-after", place === "after");
    });
    node.addEventListener("dragleave", () => node.classList.remove("is-drop-before", "is-drop-after"));
    node.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      const fromKey = event.dataTransfer.getData(CANVAS_DRAG_MIME) || canvasDragKey;
      const rect = node.getBoundingClientRect();
      const place = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
      node.classList.remove("is-drop-before", "is-drop-after");
      reorderCanvasItem(fromKey, selectionKey, place);
    });
  });

  studio.querySelectorAll("[data-selected-action='remove']").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      removeGlobalSelectedByKey(button.dataset.selectionKey);
    });
  });

  bindCanvasTitleEditor(document.querySelector("#canvasPaperTitle"));

  studio.querySelectorAll("[data-editor-add-question]").forEach(button => {
    button.addEventListener("click", addEditorQuestion);
  });
  const editorForm = studio.querySelector("[data-editor-question-form]");
  if (editorForm) {
    const item = getGlobalSelectedQuestions().find(entry => entry.selectionKey === editorForm.dataset.selectionKey);
    editorForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!applyEditorQuestionForm(editorForm, item, { requireStem: true })) return;
      renderSelectedContext();
      showToast("题目内容已保存到当前草稿");
    });
    let autoSaveTimer = 0;
    editorForm.querySelectorAll("input, select, textarea").forEach(field => {
      field.addEventListener("input", () => {
        window.clearTimeout(autoSaveTimer);
        autoSaveTimer = window.setTimeout(() => applyEditorQuestionForm(editorForm, item), 280);
      });
      field.addEventListener("change", () => applyEditorQuestionForm(editorForm, item));
    });
    editorForm.querySelector("[data-editor-replace-question]")?.addEventListener("click", () => replaceEditorQuestion(item));
  }

  if (!studio.dataset.toolBound) {
    studio.dataset.toolBound = "1";
    studio.querySelectorAll("[data-canvas-action]").forEach(button => {
      button.addEventListener("click", () => handleCanvasFooterAction(button.dataset.canvasAction));
    });
  }
}

function renderCanvasStudio() {
  const studio = document.querySelector("#aiCanvasStudio");
  if (!studio) return;
  const items = getCanvasOrderedItems();
  ensureCanvasFocus();
  applyCanvasTitleToUi();
  renderCanvasOrderList(items);
  const paper = document.querySelector("#aiCanvasPaperList");
  if (paper) {
    paper.innerHTML = items.length
      ? items.map((item, index) => canvasPaperItemHtml(item, index)).join("")
      : `<div class="ai-canvas-info-empty ai-canvas-paper-empty">
          <span>画布还是空的，现在去右侧选题</span>
          <button type="button" data-open-add-questions><i class="ri-add-line" aria-hidden="true"></i>添加题目</button>
        </div>`;
  }
  renderCanvasInfo(items.find(item => item.selectionKey === canvasFocusKey) || null);
  bindCanvasStudioEvents();
}

function previewCanvas() {
  if (!getGlobalSelectedQuestions().length) {
    showToast("请先选用题目");
    return;
  }
  openPrintPreview();
}

function canvasPrintPageHtml() {
  const items = getCanvasOrderedItems();
  const questions = items.map((item, index) => {
    const q = item.question;
    const options = (q.options || []).length
      ? `<div class="q-options">${q.options.map(opt => `<span>${escapeHtml(opt)}</span>`).join("")}</div>`
      : "";
    return `<article class="canvas-print-item"><p class="q-stem"><b>${index + 1}.</b> ${escapeHtml(q.stem)}</p>${options}</article>`;
  }).join("");
  return `<h1>${escapeHtml(getCanvasListTitle())}</h1>${questions || "<p>还没有选用题目</p>"}`;
}

function openPrintPreview() {
  const modal = document.querySelector("#canvasPrintPreview");
  const page = document.querySelector("#canvasPrintPage");
  if (!modal || !page) return;
  page.innerHTML = canvasPrintPageHtml();
  modal.hidden = false;
}

function closePrintPreview() {
  const modal = document.querySelector("#canvasPrintPreview");
  if (modal) modal.hidden = true;
}

function printCanvasPreview() {
  const modal = document.querySelector("#canvasPrintPreview");
  if (!modal || modal.hidden) openPrintPreview();
  document.body.classList.add("is-canvas-printing");
  window.print();
  window.setTimeout(() => document.body.classList.remove("is-canvas-printing"), 300);
}

function scoreSettingsInputs() {
  return [...document.querySelectorAll("#scoreSettingsList [data-score-key]")];
}

function updateScoreSettingsTotal() {
  const inputs = scoreSettingsInputs();
  const values = inputs
    .map(input => String(input.value || "").trim())
    .filter(Boolean)
    .map(Number)
    .filter(Number.isFinite);
  const total = values.reduce((sum, value) => sum + value, 0);
  const output = document.querySelector("#scoreSettingsTotal");
  if (output) output.textContent = values.length ? String(Number(total.toFixed(2))) : "--";
}

function renderScoreSettingsModal() {
  const items = getGlobalSelectedQuestions();
  const list = document.querySelector("#scoreSettingsList");
  const count = document.querySelector("#scoreSettingsCount");
  if (count) count.textContent = String(items.length);
  if (!list) return;
  list.innerHTML = items.map((item, index) => {
    const q = item.question || {};
    const savedScore = getActiveCanvasScores()[item.selectionKey];
    const prefix = String(q.type || "").includes("填空") ? "每空" : "本题";
    return `
      <article class="score-settings-item">
        <div class="score-settings-item-copy">
          <strong>题${index + 1}</strong>
          <span>${escapeHtml(q.type || "试题")}</span>
          <p>${escapeHtml(q.stem || "")}</p>
        </div>
        <label class="score-settings-input">
          <span>${prefix}</span>
          <input type="number" min="0" step="0.5" inputmode="decimal" data-score-key="${escapeHtml(item.selectionKey)}" value="${savedScore ?? ""}" placeholder="输入分数" />
        </label>
      </article>`;
  }).join("");
  scoreSettingsInputs().forEach(input => input.addEventListener("input", updateScoreSettingsTotal));
  updateScoreSettingsTotal();
}

function openScoreSettingsModal() {
  if (!getGlobalSelectedQuestions().length) {
    showToast("请先加入题目");
    return;
  }
  renderScoreSettingsModal();
  const modal = document.querySelector("#scoreSettingsModal");
  if (modal) modal.hidden = false;
}

function closeScoreSettingsModal() {
  const modal = document.querySelector("#scoreSettingsModal");
  if (modal) modal.hidden = true;
}

function saveScoreSettings() {
  const nextScores = { ...getActiveCanvasScores() };
  scoreSettingsInputs().forEach(input => {
    const key = input.dataset.scoreKey;
    const value = String(input.value || "").trim();
    if (!key) return;
    if (!value) delete nextScores[key];
    else nextScores[key] = Number(value);
  });
  if (isWholePaperEditActive()) getActiveEditorDraft().scores = nextScores;
  else workspace.canvasScores = nextScores;
  if (isWholePaperEditActive()) markWholePaperEditDirty();
  saveWorkspace();
  const total = document.querySelector("#scoreSettingsTotal")?.textContent || "--";
  closeScoreSettingsModal();
  showToast(total === "--" ? "分数设置已保存" : `分数设置已保存，试卷总分 ${total} 分`);
}

function handleCanvasFooterAction(action) {
  if (action === "assign") {
    const title = stripEditorTitlePrefix(getCanvasDisplayTitle()) || "当前题单";
    openAiAssistant();
    setAiAssistantAttachment({ name: title });
    showToast("已将当前题单发送到对话");
  }
  else if (action === "print") printCanvasPreview();
  else if (action === "download") {
    showToast("正在生成可下载文件…");
  }
  else if (action === "paper-settings") showToast("卷参设置即将开放");
  else if (action === "score-settings") openScoreSettingsModal();
  else if (action === "analyze") showToast("试卷分析即将开放");
}

function renderSelectedContext() {
  const wrap = document.querySelector("#aiSelectedContext");
  const summary = document.querySelector("#aiSelectedSummary");
  const preview = document.querySelector("#aiSelectedPreview");
  const empty = document.querySelector("#aiSelectedEmpty");
  if (!wrap || !preview) return;
  const selected = getGlobalSelectedQuestions();
  if (QUESTION_PICKER_MODE && window.parent !== window) {
    window.parent.postMessage({ type: "feixiang-question-picker-count", count: selected.length }, "*");
  }
  const fixedAdd = document.querySelector(".ai-selected-fixed-add");
  if (fixedAdd) fixedAdd.hidden = selected.length === 0;
  renderQuestionDraftTabs();
  const visible = selectedPreviewTypeFilter
    ? selected.filter(item => matchesSelectedType(item.question.type, selectedPreviewTypeFilter))
    : selected;
  wrap.classList.toggle("has-selection", selected.length > 0);
  document.querySelector("#aiSelectedPanel")?.classList.toggle("has-selection", selected.length > 0);
  if (selected.length === 0) wrap.scrollTop = 0;
  renderSelectedFooter(selected.length);
  syncSelectedPanelChrome();
  if (summary) {
    summary.hidden = true;
  }
  if (empty) empty.hidden = selected.length > 0;
  preview.innerHTML = selectedPanelEnlarged
    ? visible.map((item, index) => selectedPreviewEnlargedHtml(item, index)).join("")
    : (visible.length ? renderCompactQuestionSections(visible) : "");
  bindSelectedPreviewEvents();
  if (selectedPanelEnlarged) renderCanvasStudio();
  window.dispatchEvent(new CustomEvent("aiq-canvas-change"));
}

function questionDraftTabLabel(tab) {
  if (!tab) return isUserCanvasTitle(workspace.canvasTitle) ? workspace.canvasTitle : NEW_CANVAS_DISPLAY_TITLE;
  if (tab.editorSource === "whole-paper" && !tab.editorDraft.titleCustomized) {
    const sourceTitle = stripEditorTitlePrefix(tab.editorDraft.sourceTitle || tab.editorDraft.title);
    return `复制：${sourceTitle || NEW_CANVAS_DISPLAY_TITLE}`;
  }
  return stripEditorTitlePrefix(getEditorDisplayTitle(tab)) || NEW_CANVAS_DISPLAY_TITLE;
}

function defaultQuestionDraftSignature() {
  return JSON.stringify({
    title: String(workspace.canvasTitle || "").trim(),
    questions: (workspace.globalSelectedQuestions || []).map(item => item.question || item),
    scores: workspace.canvasScores || {}
  });
}

function isDefaultQuestionDraftSaved() {
  return Boolean(workspace.canvasResourceId)
    && workspace.canvasSavedSignature === defaultQuestionDraftSignature();
}

function ensureQuestionDraftCloseModal() {
  let modal = document.querySelector("#questionDraftCloseModal");
  if (modal) return modal;
  document.body.insertAdjacentHTML("beforeend", `
    <div id="questionDraftCloseModal" class="ai-create-modal" hidden>
      <div class="ai-create-mask" data-question-draft-close-modal></div>
      <section class="ai-create-panel ai-confirm-panel" role="dialog" aria-modal="true" aria-labelledby="questionDraftCloseTitle">
        <header class="ai-create-head">
          <strong id="questionDraftCloseTitle"><i class="ri-error-warning-line"></i>关闭未保存的题单？</strong>
          <button type="button" class="ai-create-close" data-question-draft-close-modal aria-label="关闭弹窗"><i class="ri-close-line"></i></button>
        </header>
        <div class="ai-create-body">
          <p class="ai-confirm-copy">题单“<strong id="questionDraftCloseName">未命名题单</strong>”尚未保存，关闭后本次编辑内容将不保留。</p>
        </div>
        <footer class="ai-create-foot">
          <button type="button" class="ai-create-cancel" data-question-draft-close-modal>继续编辑</button>
          <button type="button" class="ai-confirm-danger" id="confirmQuestionDraftClose">确认关闭</button>
        </footer>
      </section>
    </div>`);
  modal = document.querySelector("#questionDraftCloseModal");
  modal?.querySelectorAll("[data-question-draft-close-modal]").forEach(node => {
    node.addEventListener("click", closeQuestionDraftCloseModal);
  });
  modal?.querySelector("#confirmQuestionDraftClose")?.addEventListener("click", confirmQuestionDraftClose);
  return modal;
}

function resetDefaultQuestionDraft(options = {}) {
  workspace.globalSelectedQuestions = [];
  workspace.canvasTitle = "";
  workspace.canvasScores = {};
  workspace.canvasResourceId = null;
  workspace.canvasSavedSignature = "";
  workspace.canvasDraftClosed = Boolean(options.closed);
  workspace.tabs.forEach(tab => { tab.selectedQuestionIds = []; });
  selectedPreviewTypeFilter = null;
  canvasFocusKey = null;
}

function clearQuestionDraftAfterSave() {
  const editorTab = getActiveEditorTab();
  if (!editorTab?.editorDraft) {
    resetDefaultQuestionDraft({ closed: false });
    return;
  }

  editorTab.editorDraft.questions = [];
  editorTab.editorDraft.scores = {};
  editorTab.editorDraft.title = "";
  editorTab.editorDraft.sourceTitle = "";
  editorTab.editorDraft.titleCustomized = true;
  editorTab.editorDraft.savedResourceId = null;
  editorTab.editorDraft.saved = false;
  editorTab.editorDraft.dirty = false;
  editorTab.editorDraft.savedAt = null;
  editorTab.questions = [];
  editorTab.selectedQuestionIds = [];
  editorTab.removedQuestionIds = [];
  editorTab.modifiedQuestions = {};
  editorTab.myResourceId = null;
  editorTab.meta = {
    ...(editorTab.meta || {}),
    title: NEW_CANVAS_DISPLAY_TITLE,
    shortTitle: NEW_CANVAS_DISPLAY_TITLE,
    questionCount: 0
  };
  selectedPreviewTypeFilter = null;
  canvasFocusKey = null;
  syncEditorTabTitle(editorTab);
}

function openQuestionDraftCloseModal(tabId, title) {
  pendingQuestionDraftCloseId = tabId;
  const modal = ensureQuestionDraftCloseModal();
  const name = modal?.querySelector("#questionDraftCloseName");
  if (name) name.textContent = title || "未命名题单";
  if (modal) modal.hidden = false;
  window.setTimeout(() => document.querySelector("#confirmQuestionDraftClose")?.focus(), 0);
}

function closeQuestionDraftCloseModal() {
  pendingQuestionDraftCloseId = null;
  const modal = document.querySelector("#questionDraftCloseModal");
  if (modal) modal.hidden = true;
}

function confirmQuestionDraftClose() {
  const tabId = pendingQuestionDraftCloseId;
  if (!tabId) return;
  closeQuestionDraftCloseModal();
  closeQuestionDraft(tabId, { force: true });
}

function closeQuestionDraft(tabId, options = {}) {
  if (tabId === "default") {
    const hasQuestions = (workspace.globalSelectedQuestions || []).length > 0;
    if (!options.force && hasQuestions && !isDefaultQuestionDraftSaved()) {
      openQuestionDraftCloseModal("default", questionDraftTabLabel());
      return;
    }
    const drafts = (workspace.tabs || []).filter(tab => tab.kind === "editor" && tab.editorDraft);
    resetDefaultQuestionDraft({ closed: drafts.length > 0 });
    if (drafts.length) {
      workspace.activeQuestionDraftTabId = drafts[0].id;
      workspace.addQuestionTargetTabId = drafts[0].id;
    } else {
      workspace.activeQuestionDraftTabId = null;
      workspace.addQuestionTargetTabId = null;
      workspace.canvasDraftClosed = false;
    }
    saveWorkspace();
    if (hasQuestions) renderAll();
    else {
      renderSelectedContext();
      renderQuestionCards();
      renderCourseCenter();
    }
    applySelectedPanelState();
    return;
  }
  const index = workspace.tabs.findIndex(tab => tab.id === tabId && tab.kind === "editor");
  if (index < 0) return;
  const tab = workspace.tabs[index];
  const hasQuestions = (tab.editorDraft?.questions || []).length > 0;
  if (!options.force && hasQuestions && tab.editorDraft?.dirty) {
    openQuestionDraftCloseModal(tabId, questionDraftTabLabel(tab));
    return;
  }
  const wasActive = workspace.activeQuestionDraftTabId === tabId;
  workspace.tabs.splice(index, 1);
  const remainingDrafts = (workspace.tabs || []).filter(item => item.kind === "editor" && item.editorDraft);
  if (wasActive) {
    const nextDraft = remainingDrafts[Math.min(index, remainingDrafts.length - 1)] || null;
    workspace.activeQuestionDraftTabId = nextDraft?.id || null;
    workspace.addQuestionTargetTabId = nextDraft?.id || null;
  }
  workspace.addQuestionTargetTabId = workspace.addQuestionTargetTabId === tabId ? null : workspace.addQuestionTargetTabId;
  if (!remainingDrafts.length && workspace.canvasDraftClosed) {
    resetDefaultQuestionDraft({ closed: false });
    workspace.activeQuestionDraftTabId = null;
    workspace.addQuestionTargetTabId = null;
  }
  saveWorkspace();
  if (hasQuestions) renderAll();
  else {
    renderSelectedContext();
    renderQuestionCards();
    renderCourseCenter();
  }
  applySelectedPanelState();
}

function renderQuestionDraftTabs() {
  const bar = document.querySelector("#questionDraftTabs");
  if (!bar) return;
  const drafts = (workspace.tabs || []).filter(tab => tab.kind === "editor" && tab.editorDraft);
  if (!drafts.length && workspace.canvasDraftClosed) workspace.canvasDraftClosed = false;
  const showDefault = !workspace.canvasDraftClosed;
  const entries = [
    ...(showDefault ? [{
      value: "default",
      label: questionDraftTabLabel(),
      count: workspace.globalSelectedQuestions?.length || 0,
      saved: isDefaultQuestionDraftSaved()
    }] : []),
    ...drafts.map(tab => ({
      value: tab.id,
      label: questionDraftTabLabel(tab),
      count: tab.editorDraft.questions?.length || 0,
      saved: !tab.editorDraft.dirty
    }))
  ];
  const activeValue = workspace.activeQuestionDraftTabId || "default";
  const activeEntry = entries.find(entry => entry.value === activeValue) || entries[0];
  bar.hidden = false;
  bar.classList.remove("is-flat");
  const activeTitle = QUESTION_PICKER_MODE ? "已选题目" : (getCanvasDisplayTitle() || activeEntry?.label || "未命名题单");
  bar.innerHTML = `
    <div class="question-draft-single" title="${escapeHtml(activeTitle)}">
      <i class="ri-file-edit-line" aria-hidden="true"></i>
      <span contenteditable="${QUESTION_PICKER_MODE ? "false" : "true"}" spellcheck="false" data-question-draft-title aria-label="${QUESTION_PICKER_MODE ? "已选题目" : "编辑题单名称"}">${escapeHtml(activeTitle)}</span>
    </div>`;
  if (!QUESTION_PICKER_MODE) bindCanvasTitleEditor(bar.querySelector("[data-question-draft-title]"));
  mountQuestionDraftToolbarActions(bar);
}

function bindQuestionDraftCloseButtons(bar) {
  bar?.querySelectorAll("[data-close-question-draft]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      button.closest("details")?.removeAttribute("open");
      closeQuestionDraft(button.dataset.closeQuestionDraft);
    });
  });
}

function mountQuestionDraftToolbarActions(bar) {
  if (!bar) return;
  bar.querySelector(".question-draft-toolbar-actions")?.remove();
  const actions = document.createElement("div");
  actions.className = "question-draft-toolbar-actions";
  actions.innerHTML = `
    <button type="button" class="panel-action-btn panel-action-btn-compact question-draft-collapse-action" data-question-draft-toolbar-action="collapse" aria-label="收起组题编辑区" title="收起组题编辑区"><i class="ri-arrow-right-double-line" aria-hidden="true"></i></button>`;
  bar.appendChild(actions);
}

function getFilteredSidebarPapers() {
  const query = paperListState.query.trim().toLowerCase();
  let list = sidebarPaperList.filter(paper => {
    if (query && !`${paper.title} ${paper.region} ${paper.grade} ${paper.examType}`.toLowerCase().includes(query)) {
      return false;
    }
    if (paperListState.examType !== "all" && paper.examType !== paperListState.examType) return false;
    return true;
  });

  list = [...list].sort((a, b) => b.recommendScore - a.recommendScore);
  return list;
}

function renderPaperList() {
  const scroll = document.querySelector("#paperListScroll");
  if (!scroll || isWorkbook) return;

  const activeTopicId = getBaseTopicId(getActiveTab()?.topicId);
  const list = getFilteredSidebarPapers();

  if (!list.length) {
    scroll.innerHTML = `<p class="paper-list-empty">没有找到匹配的试卷，试试调整筛选条件。</p>`;
    return;
  }

  scroll.innerHTML = list.map(paper => `
      <button type="button" class="paper-list-card ${paper.id === activeTopicId ? "active" : ""}" data-paper-id="${paper.id}">
        <p class="paper-list-card-title"><span class="paper-list-card-tag">${escapeHtml(paper.examType)}</span>${escapeHtml(paper.title)}</p>
      </button>`).join("");

  scroll.querySelectorAll("[data-paper-id]").forEach(button => {
    button.addEventListener("click", () => {
      openTab(button.dataset.paperId);
      if (isMobileLayout()) setMobileDrawer("paper", false);
    });
  });
}

function bindPaperListControls() {
  if (isWorkbook) return;

  const workspace = document.querySelector("#aiWorkspace");
  const panel = document.querySelector("#paperListPanel");
  const collapseBtn = document.querySelector("#collapsePaperList");
  const expandBtn = document.querySelector("#paperListExpand");
  const topbarExpandBtn = document.querySelector("#topbarExpandPaperList");
  const searchInput = document.querySelector("#paperListSearch");
  const typeBtn = document.querySelector("#paperListTypeBtn");
  const filterBtn = document.querySelector("#paperListFilterBtn");

  const typeOptions = ["all", "期末", "期中", "周测"];

  const setCollapsed = collapsed => {
    workspace?.classList.toggle("paper-list-collapsed", collapsed);
    applyResponsiveChrome();
  };

  const expandPanel = () => {
    if (isMobileLayout()) setMobileDrawer("paper", true);
    else setCollapsed(false);
  };

  collapseBtn?.addEventListener("click", () => {
    if (isMobileLayout()) setMobileDrawer("paper", false);
    else setCollapsed(true);
  });
  expandBtn?.addEventListener("click", expandPanel);
  topbarExpandBtn?.addEventListener("click", expandPanel);
  panel?.addEventListener("click", event => {
    if (isMobileLayout()) return;
    if (!workspace?.classList.contains("paper-list-collapsed")) return;
    if (event.target.closest(".paper-list-expand") || event.target === panel) expandPanel();
  });

  searchInput?.addEventListener("input", () => {
    paperListState.query = searchInput.value;
    renderPaperList();
  });

  typeBtn?.addEventListener("click", () => {
    const index = typeOptions.indexOf(paperListState.examType);
    paperListState.examType = typeOptions[(index + 1) % typeOptions.length];
    document.querySelector("#paperListTypeLabel").textContent =
      paperListState.examType === "all" ? "类型" : paperListState.examType;
    renderPaperList();
  });

  filterBtn?.addEventListener("click", () => showToast("更多筛选即将开放"));
}

function isMobileLayout() {
  return mobileLayoutQuery.matches;
}

function setMobileDrawer(name, open) {
  const root = document.querySelector("#aiWorkspace");
  if (!root) return;
  if (name === "selected") root.classList.toggle("mobile-selected-open", open);
  const anyOpen = root.classList.contains("mobile-selected-open");
  const mask = document.querySelector("#panelMask");
  if (mask) mask.hidden = !anyOpen;
}

function closeMobileDrawers() {
  setMobileDrawer("selected", false);
}

function applyResponsiveChrome() {
  const selectedBtn = document.querySelector("#topbarExpandSelected");
  if (isMobileLayout()) {
    if (selectedBtn) selectedBtn.hidden = false;
    return;
  }
  closeMobileDrawers();
  if (selectedBtn) selectedBtn.hidden = true;
}

function applySelectedPanelState() {
  const root = document.querySelector("#aiWorkspace");
  root?.classList.toggle("selected-panel-collapsed", rightPanelSectionState.selectedCollapsed);
  root?.classList.toggle("browse-panel-collapsed", rightPanelSectionState.browseCollapsed);
  const browseRail = document.querySelector("#browsePanelRail");
  if (browseRail) browseRail.hidden = !rightPanelSectionState.browseCollapsed;
  const browseCollapse = document.querySelector("#collapseBrowsePanel");
  // 浏览区收起入口固定在页签栏；保留此按钮仅作为统一的程序化控制器。
  if (browseCollapse) browseCollapse.hidden = true;
  if (rightPanelSectionState.selectedCollapsed && selectedPanelEnlarged) {
    selectedPanelEnlarged = false;
    selectedShowAnswers = false;
    selectedExpandedAnalysisKeys.clear();
  }
  syncSelectedPanelChrome();
  applyResponsiveChrome();
}

function collapseBrowsePanelToEditor() {
  collapsedAssistantView = isAiAssistantViewActive();
  if (collapsedAssistantView) aiAssistantOpen = false;
  rightPanelSectionState.browseCollapsed = true;
  rightPanelSectionState.selectedCollapsed = false;
  setCanvasManuallyCollapsed(false);
  setSelectedPanelEnlarged(true);
  applySelectedPanelState();
  renderAll();
  saveWorkspace();
}

function restoreCollapsedBrowsePanel() {
  rightPanelSectionState.browseCollapsed = false;
  if (selectedPanelEnlarged) setSelectedPanelEnlarged(false);
  if (collapsedAssistantView && aiAssistantTabOpen) aiAssistantOpen = true;
  collapsedAssistantView = false;
  applySelectedPanelState();
  renderAll();
  saveWorkspace();
}

function bindSelectedPanelControls() {
  const panel = document.querySelector("#aiSelectedPanel");
  const collapseBtn = document.querySelector("#collapseSelectedPanel");
  const expandBtn = document.querySelector("#aiSelectedExpand");
  const topbarExpandBtn = document.querySelector("#topbarExpandSelected");
  const browseCollapseBtn = document.querySelector("#collapseBrowsePanel");
  const browseRail = document.querySelector("#browsePanelRail");

  // 首次进入默认收起；用户手动展开或收起后记住其选择
  rightPanelSectionState.selectedCollapsed = shouldCanvasStartCollapsed();
  if (QUESTION_PICKER_MODE) {
    rightPanelSectionState.selectedCollapsed = true;
    rightPanelSectionState.browseCollapsed = false;
    selectedPanelEnlarged = false;
    const rail = document.querySelector("#canvasRailTitle");
    if (rail) rail.textContent = "已选题目";
    applySelectedPanelState();
  }

  collapseBtn?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    if (selectedPanelEnlarged) {
      restoreSplitWorkspaceView();
      return;
    }
    if (isMobileLayout()) {
      setMobileDrawer("selected", false);
      collapseSelectedPanel({ manual: true });
      return;
    }
    collapseSelectedPanel({ manual: true });
    renderSelectedContext();
  });

  document.querySelector("#enlargeSelectedPanel")?.addEventListener("click", event => {
    event.stopPropagation();
    openCanvasEditorTab();
  });

  document.querySelector("#topbarCollapseCanvas")?.addEventListener("click", event => {
    event.stopPropagation();
    restoreSplitWorkspaceView();
  });

  document.querySelector("#toggleSelectedAnswers")?.addEventListener("click", event => {
    event.stopPropagation();
    toggleSelectedShowAnswers();
  });

  const openPanel = event => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (isMobileLayout()) setMobileDrawer("selected", true);
    expandSelectedPanel({ focus: false, persist: false });
  };

  expandBtn?.addEventListener("click", openPanel);
  topbarExpandBtn?.addEventListener("click", openPanel);
  document.querySelector("#selectedSectionHead")?.addEventListener("click", event => {
    if (!QUESTION_PICKER_MODE) return;
    if (event.target.closest("#collapseSelectedPanel, #enlargeSelectedPanel, #toggleSelectedAnswers")) return;
    if (!rightPanelSectionState.selectedCollapsed) return;
    openPanel(event);
  });
  panel?.addEventListener("click", event => {
    if (!document.querySelector("#aiWorkspace")?.classList.contains("selected-panel-collapsed")) return;
    openPanel(event);
  });
  document.addEventListener("click", event => {
    if (!event.target.closest("#aiSelectedExpand, #aiSelectedPanel")) return;
    if (!document.querySelector("#aiWorkspace")?.classList.contains("selected-panel-collapsed")) return;
    if (event.target.closest("#collapseSelectedPanel, #enlargeSelectedPanel, #topbarCollapseCanvas")) return;
    openPanel(event);
  });

  browseCollapseBtn?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    collapseBrowsePanelToEditor();
  });

  browseRail?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    restoreCollapsedBrowsePanel();
  });

  applySelectedPanelState();
}

function editorTabLabel(prefix, title) {
  const cleanPrefix = String(prefix || "编辑").trim() || "编辑";
  const cleanTitle = stripEditorTitlePrefix(title);
  return `${cleanPrefix}：${cleanTitle || "未命名题单"}`;
}

function syncEditorTabTitle(tab) {
  if (tab?.kind !== "editor" || !tab.editorDraft) return "";
  const label = getEditorDisplayTitle(tab);
  tab.title = label;
  tab.shortTitle = label;
  tab.meta = {
    ...(tab.meta || {}),
    title: label,
    shortTitle: label
  };
  return label;
}

function createEditorTab(options = {}) {
  const sourceTab = options.sourceTab || getActiveTab();
  const editorSource = options.editorSource || "canvas";
  const existing = !options.forceNew && workspace.tabs.find(tab => tab.kind === "editor"
    && !tab.isEditorCopy
    && tab.editorSource === editorSource
    && (editorSource === "canvas" || tab.sourceTabId === sourceTab?.id));
  if (existing) {
    activateEditorTab(existing, { message: editorSource === "canvas" ? "已切换到组题草稿" : "已切换到当前试卷的编辑副本" });
    return existing;
  }

  const sourceItems = cloneWorkspaceValue(options.items || []);
  if (!sourceItems.length && !options.allowEmpty) {
    showToast(editorSource === "canvas" ? "请先选择题目" : "当前试卷没有可编辑的题目");
    return null;
  }
  tabCounter += 1;
  const draftTitle = String(options.title || sourceTab?.title || getCanvasListTitle()).trim() || formatQuestionListTitle();
  const tab = {
    id: `tab-${tabCounter}`,
    kind: "editor",
    editorSource,
    sourceTabId: sourceTab?.id || null,
    sourceTopicId: getBaseTopicId(sourceTab?.topicId || initialTopicId),
    topicId: `editor-${Date.now()}-${tabCounter}`,
    context: sourceTab?.context || contextName,
    title: "",
    shortTitle: "",
    meta: {
      ...(sourceTab?.meta || {}),
      source: editorSource === "whole-paper" ? "整卷编辑草稿" : "组题草稿",
      questionCount: sourceItems.length,
      createdAt: new Date().toISOString()
    },
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions: sourceItems.map(item => cloneWorkspaceValue(item.question)),
    editorDraft: {
      title: draftTitle,
      sourceTitle: String(sourceTab?.title || draftTitle).trim(),
      titleCustomized: false,
      questions: sourceItems,
      scores: cloneWorkspaceValue(options.scores || {}),
      paperSettings: {},
      dirty: true,
      saved: false,
      savedResourceId: null,
      savedAt: null
    }
  };
  syncEditorTabTitle(tab);
  const sourceIndex = sourceTab ? workspace.tabs.findIndex(item => item.id === sourceTab.id) : -1;
  if (options.appendEditor) workspace.tabs.push(tab);
  else if (sourceIndex >= 0) workspace.tabs.splice(sourceIndex + 1, 0, tab);
  else workspace.tabs.push(tab);
  activateEditorTab(tab, {
    expand: options.expand !== false,
    preserveRight: Boolean(options.preserveRight)
  });
  return tab;
}

function activateEditorTab(tab, options = {}) {
  if (!tab?.editorDraft) return;
  if (!options.preserveRight) aiAssistantOpen = false;
  workspace.activeQuestionDraftTabId = tab.id;
  workspace.addQuestionTargetTabId = tab.id;
  selectedPanelEnlarged = options.expand !== false;
  rightPanelSectionState.selectedCollapsed = false;
  if (selectedPanelEnlarged) rightPanelSectionState.browseCollapsed = true;
  saveWorkspace();
  if (selectedPanelEnlarged) renderAll();
  else {
    renderSelectedContext();
    renderQuestionCards();
    renderCourseCenter();
  }
  // 左侧题单切换后，整卷操作必须按“当前题单”重新计算，
  // 不能沿用上一个题单的已加入/禁用状态。
  renderPaperActionButtons(getActiveTab());
  applySelectedPanelState();
  if (options.message) showToast(options.message);
}

function openWholePaperEditorTab() {
  const sourceTab = getActiveTab();
  if (!sourceTab || sourceTab.kind === "editor") return sourceTab;
  const visibleQuestions = (sourceTab.questions || [])
    .filter(question => !(sourceTab.removedQuestionIds || []).includes(question.id));
  return createEditorTab({
    editorSource: "whole-paper",
    sourceTab,
    title: String(sourceTab.title || "").trim() || formatQuestionListTitle(),
    items: visibleQuestions.map(question => buildGlobalSelectedEntry(sourceTab, question)),
    scores: {},
    forceNew: true
  });
}

let wholePaperCopyAnimating = false;

function animateWholePaperIntoDraft(onComplete) {
  const complete = () => {
    wholePaperCopyAnimating = false;
    onComplete?.();
  };
  if (wholePaperCopyAnimating) return;
  wholePaperCopyAnimating = true;
  const source = document.querySelector(".paper-meta-bar") || document.querySelector("#savePaperCopy");
  const target = document.querySelector("#canvasHeadTitle") || document.querySelector("#aiSelectedPanel");
  if (!source || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    complete();
    return;
  }
  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const title = String(getActiveTab()?.title || "当前试卷");
  const flight = document.createElement("div");
  flight.className = "whole-paper-copy-flight";
  flight.innerHTML = `<i class="ri-file-copy-2-line"></i><strong>${escapeHtml(title)}</strong><span>复制到组题编辑区</span>`;
  Object.assign(flight.style, {
    left: `${sourceRect.left}px`,
    top: `${sourceRect.top}px`,
    width: `${Math.min(sourceRect.width, 520)}px`
  });
  document.body.appendChild(flight);
  const targetX = targetRect.left + Math.min(28, targetRect.width / 4);
  const targetY = targetRect.top + Math.min(18, targetRect.height / 3);
  const animation = flight.animate([
    { transform: "translate3d(0,0,0) scale(1)", opacity: 0 },
    { transform: "translate3d(0,-6px,0) scale(1)", opacity: 1, offset: 0.16 },
    { transform: `translate3d(${targetX - sourceRect.left}px,${targetY - sourceRect.top}px,0) scale(.28)`, opacity: .88, offset: .82 },
    { transform: `translate3d(${targetX - sourceRect.left}px,${targetY - sourceRect.top}px,0) scale(.18)`, opacity: 0 }
  ], { duration: 560, easing: "cubic-bezier(.22,.8,.25,1)", fill: "forwards" });
  animation.finished.catch(() => {}).finally(() => {
    flight.remove();
    complete();
  });
}

function openCanvasEditorTab() {
  const root = document.querySelector("#aiWorkspace");
  if (isComposeMode) {
    root?.classList.remove("compose-draft-open");
    root?.classList.add("compose-paper-open");
  }
  setCanvasManuallyCollapsed(false);
  setSelectedPanelEnlarged(true);
  saveWorkspace();
  applySelectedPanelState();
  return getActiveEditorTab();
}

function activateDefaultQuestionDraft(options = {}) {
  workspace.canvasDraftClosed = false;
  workspace.activeQuestionDraftTabId = null;
  workspace.addQuestionTargetTabId = null;
  if (options.expand) selectedPanelEnlarged = true;
  rightPanelSectionState.selectedCollapsed = false;
  if (selectedPanelEnlarged) rightPanelSectionState.browseCollapsed = true;
  saveWorkspace();
  if (selectedPanelEnlarged) renderAll();
  else {
    renderSelectedContext();
    renderQuestionCards();
    renderCourseCenter();
  }
  renderPaperActionButtons(getActiveTab());
  applySelectedPanelState();
}

function nextBlankQuestionDraftTitle() {
  const used = new Set((workspace.tabs || [])
    .filter(tab => tab.kind === "editor" && tab.editorDraft)
    .map(tab => stripEditorTitlePrefix(tab.editorDraft.title))
    .map(title => String(title || "").match(/^未命名组题(\d+)$/))
    .filter(Boolean)
    .map(match => Number(match[1])));
  let index = 1;
  while (used.has(index)) index += 1;
  return `未命名组题${index}`;
}

function createBlankQuestionDraft(options = {}) {
  return createEditorTab({
    editorSource: "blank",
    sourceTab: getActiveTab(),
    title: nextBlankQuestionDraftTitle(),
    items: [],
    scores: {},
    allowEmpty: true,
    expand: Boolean(options.expand),
    preserveRight: true,
    appendEditor: Boolean(options.appendEditor),
    forceNew: true
  });
}

function migrateLegacyEditorSession() {
  const legacy = workspace.paperEditSession;
  if (!legacy || !Array.isArray(legacy.questions) || !legacy.questions.length) return null;
  const sourceTab = workspace.tabs.find(tab => tab.id === legacy.sourceTabId) || getActiveTab();
  const tab = createEditorTab({
    editorSource: legacy.origin === "whole-paper-edit" ? "whole-paper" : "canvas",
    sourceTab,
    title: legacy.title || sourceTab?.title || formatQuestionListTitle(),
    items: legacy.questions,
    scores: legacy.scores || {}
  });
  if (tab?.editorDraft) {
    tab.editorDraft.savedResourceId = legacy.savedResourceId || null;
    tab.editorDraft.saved = Boolean(legacy.saved);
    tab.editorDraft.dirty = !legacy.saved;
    tab.editorDraft.savedAt = legacy.savedAt || null;
  }
  workspace.paperEditSession = null;
  saveWorkspace();
  return tab;
}

function saveWholePaperEditAsQuestionList() {
  const editorTab = getActiveEditorTab();
  const session = getActiveEditorDraft();
  const selectedItems = getGlobalSelectedQuestions();
  if (!editorTab || !session || !selectedItems.length) {
    showToast("当前试卷没有可保存的题目");
    return;
  }
  if (selectedItems.some(item => !String(item.question?.stem || "").trim())) {
    showToast("请先补全题干再保存到我的资源");
    return;
  }

  const sourceTab = workspace.tabs.find(tab => tab.id === editorTab.sourceTabId) || null;
  const title = getEditorDisplayTitle(editorTab)
    || String(session.title || sourceTab?.title || "").trim()
    || formatQuestionListTitle();
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  const createdAt = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const questions = selectedItems.map((item, index) => ({
    ...cloneWorkspaceValue(item.question),
    id: String(item.question.id || `editor-question-${index + 1}`),
    num: index + 1,
    score: session.scores?.[item.selectionKey] ?? item.question.score
  }));
  const resourceTab = {
    id: `resource-tab-${editorTab.id}`,
    topicId: `list-${editorTab.id}`,
    context: editorTab.context || sourceTab?.context || contextName,
    title,
    shortTitle: shortenTabTitle(title),
    meta: {
      ...(sourceTab?.meta || {}),
      title,
      shortTitle: shortenTabTitle(title),
      source: "我的创建",
      questionCount: questions.length,
      createdAt: session.createdAt || createdAt
    },
    selectedQuestionIds: questions.map(question => question.id),
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions,
    fromTabId: sourceTab?.id || null,
    sourceTopicId: editorTab.sourceTopicId,
    isQuestionList: true,
    myResourceId: session.savedResourceId || undefined
  };

  const resource = registerMyQuestionList(resourceTab);
  clearQuestionDraftAfterSave();
  workspace.addQuestionPickingActive = false;
  workspace.addQuestionTargetTabId = null;
  saveWorkspace();
  renderAll();
  applySelectedPanelState();
  renderSelectedContext();
  const viewResource = () => {
    workspace.courseCenterView = "resources";
    courseCenterQuery = "";
    openAiAssistant();
  };
  showActionButtonsToast("已保存到我的资源", [
    { label: "查看资源", onClick: viewResource }
  ]);
}

function openSelectedAsQuestionList() {
  if (isWholePaperEditActive()) {
    saveWholePaperEditAsQuestionList();
    return;
  }
  const selectedItems = getGlobalSelectedQuestions();
  if (!selectedItems.length) {
    showToast("请先选择题目");
    return;
  }

  const selectedQuestions = getCanvasGroups(selectedItems).flatMap(group => group.items).map(item => ({ ...item.question }));
  if (!selectedQuestions.length) return;

  tabCounter += 1;
  const title = getCanvasListTitle();
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  const createdAt = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const questions = selectedQuestions.map((q, index) => ({
    ...q,
    id: `${q.id}-list-${tabCounter}-${index}`,
    num: index + 1
  }));

  const newTab = {
    id: `tab-${tabCounter}`,
    topicId: `list-${Date.now()}`,
    context: getActiveTab()?.context || contextName,
    title,
    shortTitle: formatQuestionListShortTitle(),
    meta: {
      title,
      shortTitle: formatQuestionListShortTitle(),
      source: "自定义题单",
      difficulty: "中等",
      questionCount: questions.length,
      usage: 0,
      createdAt
    },
    selectedQuestionIds: questions.map(q => q.id),
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions,
    fromTabId: getActiveTab()?.id || null,
    isQuestionList: true,
    myResourceId: workspace.canvasResourceId || undefined,
    selectionKey: selectedItems.map(item => item.selectionKey).sort().join(",")
  };

  registerMyQuestionList(newTab);
  clearQuestionDraftAfterSave();
  workspace.addQuestionPickingActive = false;
  workspace.addQuestionTargetTabId = null;
  saveWorkspace();
  renderAll();
  applySelectedPanelState();
  renderSelectedContext();
  showActionButtonsToast("已保存到我的资源", [
    {
      label: "查看资源",
      onClick: () => {
        workspace.courseCenterView = "resources";
        courseCenterQuery = "";
        openAiAssistant();
      }
    }
  ]);
}

function savePaperCopyAsQuestionList() {
  const tab = getActiveTab();
  if (!tab) return;
  if (tab.kind === "editor") {
    saveWholePaperEditAsQuestionList();
    return;
  }
  if (tab.isQuestionList && !tab.aiGenerated) {
    registerMyQuestionList(tab);
    saveWorkspace();
    renderPaperActionButtons(tab);
    showToast("修改已保存至「我的-我的创建」");
    return;
  }

  if (wholePaperCopyAnimating) return;
  const button = document.querySelector("#savePaperCopy");
  if (button) button.disabled = true;
  animateWholePaperIntoDraft(() => openWholePaperEditorTab());
}

function animateSaveToMyResources() {
  const source = document.querySelector("#savePaperCopy");
  const target = document.querySelector("#myResourcesButton");
  if (!source || !target) return;

  const finish = () => {
    target.classList.remove("is-receiving");
    void target.offsetWidth;
    target.classList.add("is-receiving");
    window.setTimeout(() => target.classList.remove("is-receiving"), 720);
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finish();
    return;
  }

  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const flight = document.createElement("div");
  flight.className = "resource-save-flight";
  flight.setAttribute("aria-hidden", "true");
  flight.innerHTML = '<i class="ri-file-list-3-line"></i><span>已另存</span>';
  flight.style.left = `${sourceRect.left + sourceRect.width / 2}px`;
  flight.style.top = `${sourceRect.top + sourceRect.height / 2}px`;
  flight.style.setProperty("--resource-flight-x", `${targetRect.left + targetRect.width / 2 - sourceRect.left - sourceRect.width / 2}px`);
  flight.style.setProperty("--resource-flight-y", `${targetRect.top + targetRect.height / 2 - sourceRect.top - sourceRect.height / 2}px`);
  document.body.appendChild(flight);
  flight.addEventListener("animationend", () => {
    flight.remove();
    finish();
  }, { once: true });
}

const AI_CREATE_CHIPS_WITH_BASE = ["再补 5 道同类型", "补 2 道压轴题", "删掉太简单的", "总共控制在 10 题"];
const AI_CREATE_CHIPS_EMPTY = ["七上有理数易错题 15 题", "期末选择题专练 12 题", "中等难度综合练习 20 题"];
const AI_TOPIC_KEYWORDS = ["有理数", "整式", "一元一次方程", "轴对称", "数轴", "正负数", "不等式", "角平分线", "几何"];

function aiCreateUsesSelected() {
  const checkbox = document.querySelector("#aiCreateUseSelected");
  return Boolean(checkbox && !checkbox.disabled && checkbox.checked);
}

function renderAiCreateChips() {
  const wrap = document.querySelector("#aiCreateChips");
  if (!wrap) return;
  const chips = aiCreateUsesSelected() ? AI_CREATE_CHIPS_WITH_BASE : AI_CREATE_CHIPS_EMPTY;
  wrap.innerHTML = chips
    .map(text => `<button type="button" class="ai-create-chip" data-ai-chip="${escapeHtml(text)}">${escapeHtml(text)}</button>`)
    .join("");
  wrap.querySelectorAll("[data-ai-chip]").forEach(chip => {
    chip.addEventListener("click", () => {
      const input = document.querySelector("#aiCreatePrompt");
      if (!input) return;
      const value = input.value.trim();
      input.value = value ? `${value}，${chip.dataset.aiChip}` : chip.dataset.aiChip;
      input.focus();
    });
  });
}

function openAiCreateModal() {
  const modal = document.querySelector("#aiCreateModal");
  if (!modal) return;
  const selected = getGlobalSelectedQuestions();
  const context = document.querySelector("#aiCreateContext");
  const checkbox = document.querySelector("#aiCreateUseSelected");
  const countNode = document.querySelector("#aiCreateSelectedCount");
  const summary = document.querySelector("#aiCreateContextSummary");

  if (context) context.hidden = selected.length === 0;
  if (checkbox) {
    checkbox.disabled = selected.length === 0;
    checkbox.checked = selected.length > 0;
  }
  if (countNode) countNode.textContent = String(selected.length);
  if (summary) {
    const counts = { 选择: 0, 填空: 0, 解答: 0 };
    selected.forEach(item => {
      const type = item.question?.type || "";
      if (type.includes("选择")) counts.选择 += 1;
      else if (type.includes("填空")) counts.填空 += 1;
      else if (type.includes("解答")) counts.解答 += 1;
    });
    const parts = ["选择", "填空", "解答"].filter(key => counts[key] > 0).map(key => `${counts[key]} 道${key}`);
    summary.textContent = parts.length ? parts.join(" · ") : "";
  }

  renderAiCreateChips();
  modal.hidden = false;
  document.querySelector("#aiCreatePrompt")?.focus();
}

function closeAiCreateModal() {
  const modal = document.querySelector("#aiCreateModal");
  if (!modal) return;
  modal.hidden = true;
  const input = document.querySelector("#aiCreatePrompt");
  if (input) input.value = "";
}

function collectAiCandidateQuestions(excludeKeys) {
  const pool = [];
  Object.entries(paperQuestions).forEach(([topicId, list]) => {
    list.forEach(q => {
      const key = getQuestionSelectionKey(topicId, q.id);
      if (excludeKeys.has(key)) return;
      pool.push({ ...q, sourceTopicId: topicId });
    });
  });
  return pool;
}

function rankAiCandidates(pool, prompt) {
  const wantsHard = /难|压轴|提高|拔高|挑战/.test(prompt);
  const wantsEasy = /简单|基础|容易|入门/.test(prompt);
  const topic = AI_TOPIC_KEYWORDS.find(word => prompt.includes(word));
  const typeHint = ["选择", "填空", "解答"].find(word => prompt.includes(word));

  return [...pool].sort((a, b) => aiCandidateScore(b) - aiCandidateScore(a));

  function aiCandidateScore(q) {
    let score = 0;
    if (topic && `${q.knowledge || ""}${q.stem || ""}`.includes(topic)) score += 6;
    if (typeHint && String(q.type || "").includes(typeHint)) score += 3;
    if (wantsHard && /较难|中等/.test(q.difficulty || "")) score += 2;
    if (wantsEasy && /简单|较易/.test(q.difficulty || "")) score += 2;
    return score;
  }
}

function resolveAiTargetCount(prompt, baseCount) {
  const total = prompt.match(/(?:控制在|总共|一共|共)\s*(\d+)/);
  if (total) return Math.max(1, Number(total[1]));
  const append = prompt.match(/(?:补|加|增|再来)\s*(\d+)/);
  if (append) return baseCount + Math.max(1, Number(append[1]));
  const plain = prompt.match(/(\d+)\s*(?:道|题)/);
  if (plain) return Math.max(1, Number(plain[1]));
  return baseCount ? baseCount + 4 : 8;
}

function buildAiListTitle(prompt, baseCount) {
  const topic = AI_TOPIC_KEYWORDS.find(word => prompt.includes(word));
  const now = new Date();
  const stamp = `${now.getMonth() + 1}.${now.getDate()}`;
  if (topic) return `七上${topic}专项巩固题单`;
  if (baseCount) return `精选巩固题单 · ${stamp}`;
  return `AI 生成题单 · ${stamp}`;
}

function generateAiQuestionList() {
  const promptInput = document.querySelector("#aiCreatePrompt");
  const prompt = (promptInput?.value || "").trim();
  const useSelected = aiCreateUsesSelected();
  const selected = useSelected ? getGlobalSelectedQuestions() : [];

  if (!prompt && !selected.length) {
    showToast("先描述一下想要什么样的题单");
    promptInput?.focus();
    return;
  }

  const baseQuestions = selected.map(item => ({ ...item.question }));
  const excludeKeys = new Set(selected.map(item => item.selectionKey));
  const targetCount = resolveAiTargetCount(prompt, baseQuestions.length);

  let questions = baseQuestions;
  if (targetCount < baseQuestions.length) {
    questions = baseQuestions.slice(0, targetCount);
  } else if (targetCount > baseQuestions.length) {
    const need = targetCount - baseQuestions.length;
    const supplement = rankAiCandidates(collectAiCandidateQuestions(excludeKeys), prompt)
      .slice(0, need)
      .map(q => ({ ...q, badges: ["AI 补充"] }));
    questions = [...baseQuestions, ...supplement];
  }

  if (!questions.length) {
    showToast("没有找到合适的题目，换个描述试试");
    return;
  }

  tabCounter += 1;
  const title = buildAiListTitle(prompt, baseQuestions.length);
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  const createdAt = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const aiCount = questions.filter(q => (q.badges || []).includes("AI 补充")).length;
  const listQuestions = questions.map((q, index) => ({
    ...q,
    id: `${q.id}-ai-${tabCounter}-${index}`,
    num: index + 1
  }));

  const newTab = {
    id: `tab-${tabCounter}`,
    topicId: `list-${Date.now()}`,
    context: getActiveTab()?.context || contextName,
    title,
    shortTitle: title.length > 8 ? `${title.slice(0, 8)}…` : title,
    meta: {
      title,
      shortTitle: title,
      source: "AI 生成题单",
      difficulty: "中等",
      questionCount: listQuestions.length,
      usage: 0,
      createdAt,
      aiPrompt: prompt
    },
    selectedQuestionIds: [],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions: listQuestions,
    fromTabId: getActiveTab()?.id || null,
    isQuestionList: true,
    aiGenerated: true
  };

  const targetDraft = getActiveEditorTab();
  if (targetDraft?.editorDraft) {
    const generatedItems = listQuestions.map(question => buildGlobalSelectedEntry(newTab, question));
    targetDraft.editorDraft.questions = generatedItems;
    targetDraft.editorDraft.title = title;
    targetDraft.editorDraft.titleCustomized = true;
    targetDraft.editorDraft.dirty = true;
    targetDraft.editorDraft.saved = false;
    targetDraft.questions = listQuestions.map(question => cloneWorkspaceValue(question));
    targetDraft.meta = { ...targetDraft.meta, source: "AI 生成 / 改编", aiPrompt: prompt, questionCount: listQuestions.length };
    syncEditorTabTitle(targetDraft);
    workspace.activeQuestionDraftTabId = targetDraft.id;
    workspace.addQuestionTargetTabId = targetDraft.id;
    selectedPanelEnlarged = true;
    rightPanelSectionState.selectedCollapsed = false;
    rightPanelSectionState.browseCollapsed = true;
    saveWorkspace();
    closeAiCreateModal();
    renderAll();
    applySelectedPanelState();
    showToast(selected.length ? "AI 已按要求改编当前题单" : "AI 已生成题目并写入当前题单");
    return;
  }

  registerMyQuestionList(newTab);
  workspace.tabs.push(newTab);
  workspace.activeTabId = newTab.id;
  saveWorkspace();
  closeAiCreateModal();
  if (isMobileLayout()) setMobileDrawer("selected", false);
  location.href = `./detail-ai.html?tabId=${encodeURIComponent(newTab.id)}&context=${encodeURIComponent(newTab.context || contextName)}`;
}

function fillAiAssistantPrompt(text) {
  const input = document.querySelector("#aiAssistantInput");
  if (!input) return;
  input.value = String(text || "");
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function syncAiAssistantChrome() {
  const panel = document.querySelector("#aiAssistantPanel");
  const btn = document.querySelector("#docTabAiAssistant");
  const active = isAiAssistantViewActive();
  if (panel) panel.hidden = !active;
  if (btn) {
    btn.classList.toggle("is-open", active);
    btn.setAttribute("aria-expanded", active ? "true" : "false");
  }
}

function openAiAssistant(initialPrompt = "") {
  if (isComposeMode || isRecordMode) {
    aiAssistantTabOpen = true;
    workspace.courseCenterTabOpen = true;
    saveWorkspace();
    navigateToWorkspaceView("course");
    return;
  }
  closeMyResources();
  const activeEditor = isShellFrameActive() ? null : getActiveEditorTab();
  if (activeEditor) workspace.addQuestionTargetTabId = activeEditor.id;
  else if (!isComposeMode && !isRecordMode) workspace.addQuestionTargetTabId = null;
  workspace.addQuestionPickingActive = true;
  aiAssistantTabOpen = true;
  aiAssistantOpen = true;
  workspace.courseCenterTabOpen = true;
  saveWorkspace();
  renderAll();
  renderCourseCenter();
  if (initialPrompt) fillAiAssistantPrompt(initialPrompt);
  document.querySelector("#aiAssistantInput")?.focus();
}

function openAddQuestions() {
  if (isEmbeddedCanvasShell && window.parent !== window) {
    window.parent.postMessage({ type: "aiq-open-ai", prompt: "" }, location.origin);
    return;
  }
  if (!document.querySelector("#aiAssistantPanel")) {
    location.href = "./detail-ai.html?workspaceView=course&context=paper";
    return;
  }
  selectedPanelEnlarged = false;
  rightPanelSectionState.selectedCollapsed = false;
  rightPanelSectionState.browseCollapsed = false;
  setCanvasManuallyCollapsed(false);
  applySelectedPanelState();
  openAiAssistant();
}

function closeAiAssistant() {
  const changed = aiAssistantTabOpen || aiAssistantOpen;
  aiAssistantTabOpen = false;
  aiAssistantOpen = false;
  workspace.courseCenterTabOpen = false;
  workspace.addQuestionPickingActive = false;
  workspace.addQuestionTargetTabId = null;
  if (!workspace.tabs.length) workspace.homeActive = true;
  syncAiAssistantChrome();
  if (changed) {
    saveWorkspace();
    const activeTab = getActiveTab();
    if (activeTab && requiresPageModeNavigation(activeTab)) {
      openDetailPage(tabPageUrl(activeTab));
      return;
    }
    renderAll();
  }
}

function toggleAiAssistant() {
  if (aiAssistantOpen) closeAiAssistant();
  else openAiAssistant();
}

function setAiAssistantAttachment(file) {
  aiAssistantAttachment = file || null;
  const chip = document.querySelector("#aiAssistantFileChip");
  if (!chip) return;
  if (!aiAssistantAttachment) {
    chip.hidden = true;
    chip.textContent = "";
    return;
  }
  chip.hidden = false;
  chip.textContent = aiAssistantAttachment.name;
}

function aiAssistantEmptyHtml() {
  return `
    <div class="ai-assistant-empty">
      <article class="ai-assistant-msg is-ai">
        <div class="ai-assistant-author"><i class="ri-sparkling-2-line"></i>飞象题库AI</div>
        <div class="ai-assistant-bubble">
          <p>你好，我是飞象题库AI。</p>
          <p>可以直接告诉我你想组什么题、组什么卷，或把试卷发给我录入。</p>
        </div>
      </article>
    </div>`;
}

function aiAssistantMessageHtml(item) {
  if (item.role === "user") {
    const file = item.fileName ? `<span class="ai-assistant-msg-file"><i class="ri-attachment-2"></i>${escapeHtml(item.fileName)}</span>` : "";
    return `<article class="ai-assistant-msg is-user"><div class="ai-assistant-bubble">${file}${escapeHtml(item.text || "")}</div></article>`;
  }
  return `<article class="ai-assistant-msg is-ai">
    <div class="ai-assistant-author"><i class="ri-sparkling-2-line"></i>AI 助手</div>
    <div class="ai-assistant-bubble">${escapeHtml(item.text || "")}</div>
  </article>`;
}

function renderAiAssistantThread() {
  const thread = document.querySelector("#aiAssistantThread");
  if (!thread) return;
  if (!aiAssistantMessages.length && !aiAssistantTyping) {
    thread.innerHTML = aiAssistantEmptyHtml();
    bindAiAssistantEmptyEvents();
    return;
  }
  const typing = aiAssistantTyping
    ? `<article class="ai-assistant-msg is-ai is-typing"><div class="ai-assistant-author"><i class="ri-sparkling-2-line"></i>AI 助手</div><div class="ai-assistant-bubble">正在思考…</div></article>`
    : "";
  thread.innerHTML = aiAssistantMessages.map(aiAssistantMessageHtml).join("") + typing;
  thread.scrollTop = thread.scrollHeight;
}

function bindAiAssistantEmptyEvents() {}

function mockAiAssistantReply(text, fileName) {
  if (fileName) {
    return `已收到附件「${fileName}」。我会按录题流程识别题目、拆分题干和选项，识别完成后可以直接选用。`;
  }
  if (/找卷|试卷/.test(text) && !/组/.test(text)) {
    return "正在帮你检索匹配的试卷。找到后可以在标签页打开，也可以整卷加入组题。";
  }
  if (/找题|帮我找/.test(text)) {
    return "正在按知识点、题型和难度检索题目。找到后可以直接选用。";
  }
  if (/组试卷|组卷/.test(text)) {
    return "可以按年级、题型和难度帮你组一套试卷。确认要求后，我会生成可预览、可打印的试卷草稿。";
  }
  if (/组题单/.test(text)) {
    return "会按专项和题量帮你组一份题单，保存后会出现在标签栏，也能继续展开编辑。";
  }
  if (/组题|出\d+道/.test(text)) {
    return "收到组题需求。我会按知识点生成题目，并支持选用后继续调整。";
  }
  if (/录题|上传/.test(text)) {
    return "可以把试卷图片、PDF 或 Word 发给我。点左侧附件按钮上传，我会帮你拆题入库。";
  }
  return "已收到。点下方「AI组题 / AI组卷 / AI录题」可把指令填进输入框，也可以直接输入需求。";
}

function sendAiAssistantMessage(rawText) {
  const input = document.querySelector("#aiAssistantInput");
  const text = String(rawText ?? input?.value ?? "").trim();
  const fileName = aiAssistantAttachment?.name || "";
  if (!text && !fileName) return;
  if (!isComposeMode) {
    openComposePage(text || `请根据附件「${fileName}」录题`);
    return;
  }
  aiAssistantMessages.push({
    role: "user",
    text: text || "请根据附件录题",
    fileName
  });
  if (input) input.value = "";
  setAiAssistantAttachment(null);
  aiAssistantTyping = true;
  renderAiAssistantThread();
  const reply = mockAiAssistantReply(text, fileName);
  window.setTimeout(() => {
    aiAssistantTyping = false;
    aiAssistantMessages.push({ role: "assistant", text: reply });
    renderAiAssistantThread();
  }, 420);
}

function bindAiAssistantControls() {
  document.querySelector("#aiAssistantClose")?.addEventListener("click", closeAiAssistant);
  document.querySelector("#aiAssistantSend")?.addEventListener("click", () => sendAiAssistantMessage());
  document.querySelector("#aiAssistantAttach")?.addEventListener("click", () => {
    document.querySelector("#aiAssistantFile")?.click();
  });
  document.querySelector("#aiAssistantFile")?.addEventListener("change", event => {
    const file = event.target.files && event.target.files[0];
    if (file && !isComposeMode && !isRecordMode) {
      openRecordPage(file.name);
      return;
    }
    setAiAssistantAttachment(file || null);
    event.target.value = "";
  });
  document.querySelector("#aiAssistantInput")?.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendAiAssistantMessage();
    }
  });
  document.querySelectorAll("[data-ai-fill]").forEach(node => {
    node.addEventListener("click", () => fillAiAssistantPrompt(node.dataset.aiFill));
  });
  document.querySelector("#courseAiHistoryList")?.addEventListener("click", event => {
    const item = event.target.closest("[data-ai-history-source][data-ai-history-id]");
    if (!item) return;
    if (item.dataset.aiHistorySource === "tab") switchTab(item.dataset.aiHistoryId);
    else {
      const resource = courseCenterItems("resources").find(entry => entry.id === item.dataset.aiHistoryId);
      if (resource) openCourseCenterResource(resource);
    }
  });
  document.querySelector("#courseAiHistoryMore")?.addEventListener("click", () => {
    aiGroupHistoryExpanded = !aiGroupHistoryExpanded;
    renderAiGroupHistory();
  });
  document.querySelectorAll("[data-add-library]").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.addLibrary === "home") setHomeView(true);
      else openBrowseTab(button.dataset.addLibrary);
    });
  });
  document.querySelectorAll("[data-course-view]").forEach(button => {
    button.addEventListener("click", () => {
      workspace.courseCenterView = button.dataset.courseView;
      courseCenterQuery = "";
      courseCenterPage = 1;
      const search = document.querySelector("#courseCenterSearch");
      if (search) search.value = "";
      saveWorkspace();
      renderCourseCenter();
    });
  });
  document.querySelector("#courseCenterSearch")?.addEventListener("input", event => {
    courseCenterQuery = event.target.value || "";
    courseCenterPage = 1;
    renderCourseCenter();
  });
  document.querySelector("#courseCenterPagination")?.addEventListener("click", event => {
    const button = event.target.closest("[data-course-page]");
    if (!button || button.disabled) return;
    courseCenterPage += button.dataset.coursePage === "next" ? 1 : -1;
    renderCourseCenter();
    document.querySelector("#courseCenterList")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  document.querySelector("#courseCenterList")?.addEventListener("click", event => {
    const actionButton = event.target.closest("[data-course-action]");
    const card = event.target.closest("[data-course-source][data-course-id]");
    if (!actionButton || !card) return;
    const item = resolveCourseCenterItem(card.dataset.courseSource, card.dataset.courseId);
    if (!item) return;
    if (actionButton.dataset.courseAction === "edit" && item.source === "resource") {
      openMyQuestionList(item.id, { expand: false, preserveRight: true });
    }
    if (actionButton.dataset.courseAction === "open") openCourseCenterResource(item);
    if (actionButton.dataset.courseAction === "add") addCourseCenterItemToCanvas(item);
  });
  renderCourseCenter();
}

function bindMyResourcesControls() {
  document.querySelector("#myResourcesButton")?.addEventListener("click", event => {
    event.stopPropagation();
    openMyResources();
  });
  document.querySelector("#myResourcesClose")?.addEventListener("click", closeMyResources);
  document.querySelector("#myResourcesPanel")?.addEventListener("click", event => event.stopPropagation());
  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-open-my-resources]");
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    openMyResources();
  });
  document.addEventListener("click", event => {
    if (!event.target.closest("#myResourcesButton, #myResourcesPanel")) closeMyResources();
  });
  renderMyResources();
}

function bindAiCreateControls() {
  document.querySelector("#openAiCreate")?.addEventListener("click", openAiCreateModal);
  document.querySelector("#aiCreateSubmit")?.addEventListener("click", generateAiQuestionList);
  document.querySelector("#aiCreateUseSelected")?.addEventListener("change", renderAiCreateChips);
  document.querySelectorAll("[data-ai-create-close]").forEach(node => {
    node.addEventListener("click", closeAiCreateModal);
  });
  document.querySelector("#aiCreatePrompt")?.addEventListener("keydown", event => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) generateAiQuestionList();
  });
}

function openQuestionInNewTab(qId) {
  const sourceTab = getActiveTab();
  if (!sourceTab) return;
  const q = sourceTab.questions.find(item => item.id === qId);
  if (!q) return;

  const existing = workspace.tabs.find(tab => tab.fromTabId === sourceTab.id && tab.fromQuestionId === qId);
  if (existing) {
    switchTab(existing.id);
    showToast(`已切换到第 ${q.num} 题标签页`);
    focusQuestionInView(existing.questions[0]?.id);
    return;
  }

  tabCounter += 1;
  const questionCopy = { ...q, id: `${q.id}-view-${tabCounter}` };
  const baseTitle = getTabBaseTitle(sourceTab);
  const newTab = {
    id: `tab-${tabCounter}`,
    topicId: `${getBaseTopicId(sourceTab.topicId)}-q${q.num}`,
    context: sourceTab.context || contextName,
    title: `${baseTitle} · 第 ${q.num} 题`,
    shortTitle: `第 ${q.num} 题`,
    meta: { ...sourceTab.meta, title: baseTitle, questionCount: 1 },
    selectedQuestionIds: [questionCopy.id],
    removedQuestionIds: [],
    modifiedQuestions: {},
    questions: [questionCopy],
    fromTabId: sourceTab.id,
    fromQuestionId: qId
  };

  workspace.tabs.push(newTab);
  workspace.activeTabId = newTab.id;
  saveWorkspace();
  renderAll();
  showToast(`已在新标签页打开第 ${q.num} 题`);
  focusQuestionInView(questionCopy.id);
}

function focusQuestionInView(qId) {
  if (!qId) return;
  requestAnimationFrame(() => {
    const node = document.querySelector(`.question-item[data-q="${qId}"]`);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
    node?.classList.add("focus-flash");
    setTimeout(() => node?.classList.remove("focus-flash"), 1200);
  });
}

function getCanvasCollapsePref() {
  try {
    const saved = localStorage.getItem(CANVAS_COLLAPSE_KEY) ?? sessionStorage.getItem(CANVAS_COLLAPSE_KEY);
    if (saved === "1") return true;
    if (saved === "0") return false;
  } catch {}
  return null;
}

function isCanvasManuallyCollapsed() {
  return getCanvasCollapsePref() === true;
}

function setCanvasManuallyCollapsed(value) {
  const next = Boolean(value);
  workspace.canvasManuallyCollapsed = next;
  try {
    localStorage.setItem(CANVAS_COLLAPSE_KEY, next ? "1" : "0");
  } catch {}
  try {
    sessionStorage.setItem(CANVAS_COLLAPSE_KEY, next ? "1" : "0");
  } catch {}
}

function shouldCanvasStartCollapsed() {
  if (QUESTION_PICKER_MODE) return true;
  if (document.body.classList.contains("index-page")) return true;
  return getCanvasCollapsePref() !== false;
}

function expandSelectedPanel(options = {}) {
  const persist = options.persist !== false && !QUESTION_PICKER_MODE;
  if (persist) setCanvasManuallyCollapsed(false);
  rightPanelSectionState.selectedCollapsed = false;
  if (options.focus === true) rightPanelSectionState.browseCollapsed = true;
  applySelectedPanelState();
  if (persist) saveWorkspace();
}

function collapseSelectedPanel(options = {}) {
  const persist = options.manual !== false && options.persist !== false && !QUESTION_PICKER_MODE;
  selectedPanelEnlarged = false;
  selectedShowAnswers = false;
  selectedExpandedAnalysisKeys.clear();
  rightPanelSectionState.selectedCollapsed = true;
  rightPanelSectionState.browseCollapsed = false;
  if (persist) setCanvasManuallyCollapsed(true);
  applySelectedPanelState();
  if (persist) saveWorkspace();
}

function collapseCanvasIfEmpty() {
  if (getGlobalSelectedQuestions().length) return;
  if (getCanvasCollapsePref() !== true) return;
  collapseSelectedPanel({ manual: false, persist: false });
}

function maybeOpenCanvasOnFirstAdd(wasEmpty) {
  if (QUESTION_PICKER_MODE) return false;
  if (getCanvasCollapsePref() === true) return false;
  if (!wasEmpty && getCanvasCollapsePref() !== null) return false;
  expandSelectedPanel({ persist: false });
  if (isMobileLayout()) setMobileDrawer("selected", true);
  return true;
}

function snapshotQuestionEnterSource(sourceEl) {
  const source = sourceEl?.closest?.(".question-item") || sourceEl;
  if (!source?.getBoundingClientRect) return null;
  const rect = source.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    rect: {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: Math.min(rect.height, 88)
    },
    num: source.querySelector(".q-num-mark")?.textContent?.trim() || "",
    stem: source.querySelector(".q-stem-text")?.textContent?.trim()
      || source.querySelector(".q-stem")?.textContent?.trim()
      || ""
  };
}

function findCanvasEnterItem(qId, selectionKey) {
  const preview = document.querySelector("#aiSelectedPreview");
  if (!preview) return null;
  const attr = value => String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  if (selectionKey) {
    const byKey = preview.querySelector(`.ai-canvas-item[data-selection-key="${attr(selectionKey)}"]`);
    if (byKey) return byKey;
  }
  if (qId) {
    const byId = preview.querySelector(`.ai-canvas-item[data-q="${attr(qId)}"]`);
    if (byId) return byId;
  }
  return preview.querySelector(".ai-canvas-item:last-child");
}

function getCanvasEnterTarget(qId, selectionKey) {
  const collapsed = document.querySelector("#aiWorkspace")?.classList.contains("selected-panel-collapsed");
  if (collapsed) {
    return document.querySelector("#aiSelectedExpand") || document.querySelector("#aiSelectedPanel");
  }
  return findCanvasEnterItem(qId, selectionKey)
    || document.querySelector("#aiSelectedExpand")
    || document.querySelector("#aiSelectedPanel");
}

function settleCanvasArrival(target, collapsed) {
  if (collapsed) {
    const rail = document.querySelector("#aiSelectedExpand");
    const count = document.querySelector("#aiSelectedExpandCount");
    rail?.classList.add("is-receiving");
    count?.classList.add("is-receiving");
    window.setTimeout(() => {
      rail?.classList.remove("is-receiving");
      count?.classList.remove("is-receiving");
    }, 420);
    return;
  }
  const item = target?.classList?.contains("ai-canvas-item") ? target : target?.closest?.(".ai-canvas-item");
  if (!item) return;
  item.classList.remove("is-entering");
  item.classList.remove("is-arriving");
  void item.offsetWidth;
  item.classList.add("is-arriving");
  item.scrollIntoView({ block: "nearest", inline: "nearest" });
  window.setTimeout(() => item.classList.remove("is-arriving"), 480);
}

function playQuestionEnterCanvas(snapshot, meta = {}) {
  const collapsed = document.querySelector("#aiWorkspace")?.classList.contains("selected-panel-collapsed");
  const target = getCanvasEnterTarget(meta.qId, meta.selectionKey);
  if (target?.classList?.contains("ai-canvas-item") && !collapsed) {
    target.classList.add("is-entering");
  }
  const finish = () => settleCanvasArrival(target, collapsed);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!snapshot?.rect || reduced) {
    finish();
    return;
  }
  const from = snapshot.rect;
  const to = target?.getBoundingClientRect();
  if (!to?.width) {
    finish();
    return;
  }

  const ghost = document.createElement("div");
  ghost.className = "q-enter-canvas-ghost";
  ghost.innerHTML = `<span class="q-enter-canvas-num">${escapeHtml(snapshot.num || "")}</span><span class="q-enter-canvas-stem">${escapeHtml(snapshot.stem || "")}</span>`;
  const startH = Math.max(36, from.height);
  Object.assign(ghost.style, {
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${startH}px`
  });
  document.body.appendChild(ghost);

  const destW = collapsed ? Math.min(to.width, 44) : Math.min(Math.max(to.width, 140), from.width);
  const destH = collapsed ? Math.min(to.height, 44) : Math.min(Math.max(to.height, 34), 48);
  const destX = collapsed ? to.left + (to.width - destW) / 2 : to.left;
  const destY = collapsed ? to.top + (to.height - destH) / 2 : to.top;
  const dx = destX - from.left;
  const dy = destY - from.top;
  const sx = destW / from.width;
  const sy = destH / startH;
  const midX = dx * 0.48;
  const midY = dy * 0.36 - 18;

  const done = () => {
    ghost.remove();
    finish();
  };
  try {
    const anim = ghost.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${midX}px, ${midY}px) scale(${Math.min(0.92, Math.max(sx, 0.46) + 0.12)})`, opacity: 0.96 },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.12 }
      ],
      { duration: 540, easing: "cubic-bezier(.22,.72,.16,1)", fill: "forwards" }
    );
    if (!anim) {
      done();
      return;
    }
    anim.addEventListener("finish", done);
    anim.addEventListener("cancel", done);
  } catch {
    done();
  }
}

function clearDragPicks() {
  if (!dragPickIds.size) return;
  dragPickIds.clear();
  document.querySelectorAll(".question-item.drag-picked").forEach(node => node.classList.remove("drag-picked"));
}

function toggleDragPick(qId) {
  if (!qId) return;
  if (dragPickIds.has(qId)) dragPickIds.delete(qId);
  else dragPickIds.add(qId);
  document.querySelector(`.question-item[data-q="${qId}"]`)?.classList.toggle("drag-picked", dragPickIds.has(qId));
}

function getDragPayloadQuestionIds(primaryQId) {
  if (primaryQId && dragPickIds.has(primaryQId) && dragPickIds.size > 1) {
    return [...dragPickIds];
  }
  return primaryQId ? [primaryQId] : [];
}

function destroyQuestionDragGhost() {
  questionDragGhost?.remove();
  questionDragGhost = null;
}

function createQuestionDragGhost(qIds, label = "") {
  destroyQuestionDragGhost();
  const tab = getActiveTab();
  const first = tab?.questions.find(item => item.id === qIds[0]);
  const ghost = document.createElement("div");
  ghost.className = "question-drag-ghost";
  if (label && qIds.length > 1) {
    ghost.innerHTML = `<strong>${escapeHtml(label)}</strong><span>整组拖入 ${qIds.length} 题</span>`;
  } else if (qIds.length > 1) {
    ghost.innerHTML = `<strong>拖入 ${qIds.length} 题</strong><span>到左侧已选题目</span>`;
  } else {
    ghost.innerHTML = `<strong>第 ${first?.num || ""} 题</strong><span>拖到左侧已选题目</span>`;
  }
  document.body.appendChild(ghost);
  questionDragGhost = ghost;
  return ghost;
}

function setQuestionDropTargetActive(active) {
  document.querySelector("#aiSelectedPanel")?.classList.toggle("is-drop-target", active);
  document.body.classList.toggle("is-question-dragging", questionDragActive);
}

function startQuestionDrag(event, qIds, options = {}) {
  const ids = [...new Set((qIds || []).map(String).filter(Boolean))];
  if (!ids.length) {
    event.preventDefault();
    return false;
  }
  questionDragActive = true;
  const payload = JSON.stringify({ qIds: ids, section: options.section || "" });
  event.dataTransfer.effectAllowed = "copy";
  event.dataTransfer.setData(QUESTION_DRAG_MIME, payload);
  event.dataTransfer.setData("text/plain", payload);
  const ghost = createQuestionDragGhost(ids, options.label || "");
  event.dataTransfer.setDragImage(ghost, 24, 18);
  ids.forEach(id => document.querySelector(`.question-item[data-q="${id}"]`)?.classList.add("is-drag-group"));
  if (options.sourceEl) options.sourceEl.classList.add("is-dragging");
  setQuestionDropTargetActive(true);
  return true;
}

function endQuestionDrag() {
  questionDragActive = false;
  destroyQuestionDragGhost();
  setQuestionDropTargetActive(false);
  document.querySelectorAll(".question-item.is-dragging, .question-item.is-drag-group, .question-section-head.is-dragging").forEach(node => {
    node.classList.remove("is-dragging", "is-drag-group");
  });
  if (isCanvasManuallyCollapsed()) {
    rightPanelSectionState.selectedCollapsed = true;
    applySelectedPanelState();
  }
}

function addQuestionsToSelected(qIds, options = {}) {
  const tab = getActiveTab();
  if (!tab || !Array.isArray(qIds) || !qIds.length) return 0;
  const selectedItems = [...getGlobalSelectedQuestions()];
  const wasEmpty = !selectedItems.length;
  const snapshot = options.animate === false ? null : snapshotQuestionEnterSource(options.sourceEl);
  let added = 0;
  let lastEntry = null;
  qIds.forEach(qId => {
    const q = tab.questions.find(item => item.id === qId);
    if (!q) return;
    if (isQuestionGloballySelected(tab.topicId, qId)) return;
    if (!workspace.canvasTitle) workspace.canvasTitle = formatQuestionListTitle();
    lastEntry = buildGlobalSelectedEntry(tab, q);
    selectedItems.push(lastEntry);
    added += 1;
  });
  if (!added) return 0;
  setActiveSelectedQuestions(selectedItems);
  markQuestionDestinationDirty();
  syncTabSelectedQuestionIds(tab);
  saveWorkspace();
  clearDragPicks();
  maybeOpenCanvasOnFirstAdd(wasEmpty);
  renderQuestionCards();
  if (snapshot && added === 1 && lastEntry) {
    playQuestionEnterCanvas(snapshot, { qId: lastEntry.question.id, selectionKey: lastEntry.selectionKey });
  }
  return added;
}

function addQuestionToSelected(qId, options = {}) {
  const added = addQuestionsToSelected([qId], options);
  const q = getActiveTab()?.questions.find(item => item.id === qId);
  if (!added) {
    showToast(`第 ${q?.num || ""} 题已选用`);
    return;
  }
  showToast(`已选用第 ${q?.num || ""} 题`);
}

function bindQuestionDragEvents() {
  document.querySelectorAll(".question-item[draggable='true']").forEach(card => {
    card.addEventListener("dragstart", event => {
      if (event.target.closest("button, a, input, textarea, [data-card-action]")) {
        event.preventDefault();
        return;
      }
      const qId = card.dataset.q;
      const qIds = getDragPayloadQuestionIds(qId);
      startQuestionDrag(event, qIds, { sourceEl: card });
    });
    card.addEventListener("dragend", endQuestionDrag);
  });

  document.querySelectorAll(".question-section-head[draggable='true']").forEach(head => {
    head.addEventListener("dragstart", event => {
      if (event.target.closest("[data-section-action]")) {
        event.preventDefault();
        return;
      }
      const qIds = String(head.dataset.qIds || "").split(",").filter(Boolean);
      const section = head.dataset.section || "本模块";
      startQuestionDrag(event, qIds, {
        sourceEl: head,
        section,
        label: section
      });
      head.closest(".question-section")?.classList.add("is-section-dragging");
    });
    head.addEventListener("dragend", () => {
      document.querySelectorAll(".question-section.is-section-dragging").forEach(node => {
        node.classList.remove("is-section-dragging");
      });
      endQuestionDrag();
    });
  });
}

function bindSelectedDropZone() {
  const panel = document.querySelector("#aiSelectedPanel");
  if (!panel || panel.dataset.dropBound === "1") return;
  panel.dataset.dropBound = "1";

  const onDragOver = event => {
    if ([...event.dataTransfer.types].includes(CANVAS_DRAG_MIME)) return;
    if (!questionDragActive && ![...event.dataTransfer.types].includes(QUESTION_DRAG_MIME) && ![...event.dataTransfer.types].includes("text/plain")) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    panel.classList.add("is-drag-over");
  };

  const onDragLeave = event => {
    if (panel.contains(event.relatedTarget)) return;
    panel.classList.remove("is-drag-over");
  };

  const onDrop = event => {
    if ([...event.dataTransfer.types].includes(CANVAS_DRAG_MIME) || canvasDragKey) return;
    event.preventDefault();
    panel.classList.remove("is-drag-over");
    let qIds = [];
    let section = "";
    try {
      const raw = event.dataTransfer.getData(QUESTION_DRAG_MIME) || event.dataTransfer.getData("text/plain");
      const parsed = JSON.parse(raw || "{}");
      qIds = Array.isArray(parsed.qIds) ? parsed.qIds.map(String) : [];
      section = String(parsed.section || "");
    } catch {
      qIds = [];
    }
    if (!qIds.length) return;
    const added = addQuestionsToSelected(qIds);
    if (!added) showToast("这些题目已在已选题目中");
    else if (section) showToast(`已拖入「${section}」${added} 题到已选题目`);
    else showToast(added === 1 ? "已拖入 1 题到已选题目" : `已拖入 ${added} 题到已选题目`);
  };

  panel.addEventListener("dragenter", onDragOver);
  panel.addEventListener("dragover", onDragOver);
  panel.addEventListener("dragleave", onDragLeave);
  panel.addEventListener("drop", onDrop);
}

function restoreSkippedQuestion(qId, options = {}) {
  const tab = getActiveTab();
  if (!tab) return false;
  const index = tab.removedQuestionIds.indexOf(qId);
  if (index < 0) return false;
  tab.removedQuestionIds.splice(index, 1);
  if (!options.silent) {
    saveWorkspace();
    renderQuestionCards();
  }
  return true;
}

function togglePaperCopyQuestion(qId) {
  const tab = getActiveTab();
  if (!tab) return;
  const q = tab.questions.find(item => item.id === qId);
  if (!q) return;
  const removed = tab.removedQuestionIds.includes(qId);
  if (removed) {
    restoreSkippedQuestion(qId, { silent: true });
    saveWorkspace();
    renderQuestionCards();
    showToast(tab.isQuestionList ? `第 ${q.num} 题已恢复到题单` : `第 ${q.num} 题已恢复到本卷副本`);
    return;
  }
  tab.removedQuestionIds.push(qId);
  saveWorkspace();
  renderQuestionCards();
  showToast(tab.isQuestionList
    ? `第 ${q.num} 题已从题单移除`
    : `第 ${q.num} 题已从本卷副本移除，原卷和本次组题不受影响`);
}

function toggleSelectWholePaper() {
  const tab = getActiveTab();
  if (!tab) return;
  const selectable = getSelectableQuestions(tab);
  if (!selectable.length) {
    showToast("当前本卷没有可加入的题目");
    return;
  }
  const added = addQuestionsToSelected(selectable.map(q => q.id));
  showToast(added ? `已选用 ${added} 题` : "当前本卷内容已全部选用");
}

function batchAddAllQuestionsToSelected() {
  toggleSelectWholePaper();
}

function removeQuestionFromSelected(qId) {
  const tab = getActiveTab();
  if (!tab) return;
  removeGlobalSelectedByKey(getQuestionSelectionKey(tab.topicId, qId));
  const q = tab.questions.find(item => item.id === qId);
  showToast(`第 ${q?.num || ""} 题已移出已选题目`);
}

function toggleQuestionSelection(qId, force, options = {}) {
  const tab = getActiveTab();
  if (!tab) return;
  const q = tab.questions.find(item => item.id === qId);
  if (!q) return;
  const key = getQuestionSelectionKey(tab.topicId, qId);
  const has = isQuestionGloballySelected(tab.topicId, qId);
  const next = typeof force === "boolean" ? force : !has;
  if (next && !has) {
    const selectedItems = [...getGlobalSelectedQuestions()];
    const wasEmpty = !selectedItems.length;
    const snapshot = snapshotQuestionEnterSource(options.sourceEl);
    if (!workspace.canvasTitle) workspace.canvasTitle = formatQuestionListTitle();
    selectedItems.push(buildGlobalSelectedEntry(tab, q));
    setActiveSelectedQuestions(selectedItems);
    markQuestionDestinationDirty();
    syncTabSelectedQuestionIds(tab);
    saveWorkspace();
    maybeOpenCanvasOnFirstAdd(wasEmpty);
    renderQuestionCards();
    playQuestionEnterCanvas(snapshot, { qId, selectionKey: key });
    showToast(`已选用第 ${q.num} 题`);
    return;
  }
  if (!next) {
    setActiveSelectedQuestions(getGlobalSelectedQuestions().filter(item => item.selectionKey !== key));
    markQuestionDestinationDirty();
  }
  syncTabSelectedQuestionIds(tab);
  saveWorkspace();
  renderQuestionCards();
  collapseCanvasIfEmpty();
  showToast(`已取消选用第 ${q.num} 题`);
}

function addToBasket(qId) {
  basketCount += 1;
  workspace.basketCount = basketCount;
  saveWorkspace();
  const q = getActiveTab()?.questions.find(item => item.id === qId);
  showToast(`第 ${q?.num || ""} 题已加入组卷（${basketCount}）`);
}

function toggleShowAnswers() {
  workspace.showAnswers = !workspace.showAnswers;
  saveWorkspace();
  const btn = document.querySelector("#toggleShowAnswer");
  if (btn) {
    btn.innerHTML = workspace.showAnswers
      ? '<i class="ri-eye-off-line"></i><span>隐藏答案</span>'
      : '<i class="ri-eye-line"></i><span>显示答案</span>';
  }
  renderQuestionCards();
}

function isHomeViewActive() {
  return Boolean(workspace.homeActive) && !aiAssistantOpen;
}

function isBrowseViewActive() {
  return Boolean(workspace.activeBrowseFilter) && !workspace.homeActive && !aiAssistantOpen;
}

function isShellFrameActive() {
  return isHomeViewActive() || isBrowseViewActive();
}

function isAiAssistantViewActive() {
  return aiAssistantTabOpen && aiAssistantOpen;
}

function decodeBrowseKeyPart(value) {
  try {
    return decodeURIComponent(String(value || ""));
  } catch {
    return String(value || "");
  }
}

function workbookBrowseKey(albumId) {
  return `${WORKBOOK_BROWSE_KEY_PREFIX}${encodeURIComponent(String(albumId || ""))}`;
}

function browseKeyFor(filter, options = {}) {
  const baseFilter = String(filter || "");
  const albumId = String(options.albumId || "");
  if (baseFilter === "workbook" && WORKBOOK_ALBUM_TAB_LABELS[albumId]) {
    return workbookBrowseKey(albumId);
  }
  return baseFilter;
}

function getBrowseMeta(browseKey) {
  const key = String(browseKey || "");
  if (key.startsWith(WORKBOOK_BROWSE_KEY_PREFIX)) {
    const albumId = decodeBrowseKeyPart(key.slice(WORKBOOK_BROWSE_KEY_PREFIX.length));
    const label = WORKBOOK_ALBUM_TAB_LABELS[albumId];
    if (!label) return null;
    return {
      ...BROWSE_FILTER_META.workbook,
      label,
      browseKey: key,
      options: { view: "catalog", albumId, query: "", keepAlbumState: true }
    };
  }
  const meta = BROWSE_FILTER_META[key];
  return meta ? { ...meta, browseKey: key, options: { ...(meta.options || {}) } } : null;
}

function browseOptionsForKey(browseKey, overrides = {}) {
  const meta = getBrowseMeta(browseKey);
  return { ...(meta?.options || {}), ...overrides };
}

function ensureBrowseTabs() {
  if (!Array.isArray(workspace.browseTabs)) workspace.browseTabs = [];
  workspace.browseTabs = workspace.browseTabs.filter(filter => getBrowseMeta(filter));
  if (workspace.activeBrowseFilter && !getBrowseMeta(workspace.activeBrowseFilter)) {
    workspace.activeBrowseFilter = null;
  }
}

let pendingBrowseOptions = {};

function normalizeBrowseOptions(options = {}) {
  return Object.fromEntries(BROWSE_OPTION_KEYS.flatMap(key => {
    const value = options[key];
    if (value === undefined || value === null) return [];
    if (key === "keepAlbumState") return [[key, value === true || value === "true"]];
    return [[key, String(value)]];
  }));
}

function browseOptionsFromParams(searchParams = params) {
  return normalizeBrowseOptions(Object.fromEntries(BROWSE_OPTION_KEYS.flatMap(key => {
    if (!searchParams.has(key)) return [];
    return [[key, searchParams.get(key)]];
  })));
}

function applyBrowseOptionsToUrl(url, options = {}) {
  Object.entries(normalizeBrowseOptions(options)).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
}

function syncHomeFrameFilter(filter, options = {}) {
  const frame = document.querySelector("#homeFrame");
  if (!frame?.contentWindow || frame.dataset.loaded !== "1" || frame.dataset.ready !== "1") return;
  if (frame.dataset.shell !== "index") {
    pendingBrowseOptions = {};
    return;
  }
  const payload = {
    type: "aiq-set-filter",
    filter: filter || "all",
    ...normalizeBrowseOptions(Object.keys(options).length ? options : pendingBrowseOptions)
  };
  pendingBrowseOptions = {};
  frame.contentWindow.postMessage(payload, "*");
}

function renderWorkspaceBreadcrumb(contextLabel, leafLabel) {
  const trail = document.querySelector(".ai-detail-topbar .breadcrumb");
  if (!trail) return;
  trail.innerHTML = `
    <span>题目浏览区：<a href="./index.html">题库首页</a></span>
    ${leafLabel
      ? `<i class="ri-arrow-right-s-line"></i><strong id="breadcrumbLeaf">${escapeHtml(leafLabel)}</strong>`
      : ""}`;
}

// 首页 / 分类浏览共用 iframe；分类 tab 紧挨在「首页」后
function applyHomeView() {
  ensureBrowseTabs();
  const root = document.querySelector("#aiWorkspace");
  const homeView = document.querySelector("#homeView");
  const frame = document.querySelector("#homeFrame");
  const shellActive = isShellFrameActive();
  const assistantActive = isAiAssistantViewActive();
  const activeBrowseKey = isBrowseViewActive() ? workspace.activeBrowseFilter : null;
  const browseMeta = activeBrowseKey ? getBrowseMeta(activeBrowseKey) : null;
  const browseFilter = browseMeta?.filter || activeBrowseKey;
  const browseOptions = browseOptionsForKey(activeBrowseKey, pendingBrowseOptions);
  const desiredFrameSrc = browseMeta?.frameSrc || HOME_FRAME_SRC;
  const desiredFrameShell = browseMeta?.frameSrc ? activeBrowseKey : "index";

  root?.classList.toggle("home-view", shellActive);
  root?.classList.toggle("ai-assistant-view", assistantActive);
  if (homeView) homeView.hidden = !shellActive;
  if (shellActive && frame && (frame.dataset.loaded !== "1" || frame.dataset.shell !== desiredFrameShell)) {
    const srcFilter = browseFilter || "all";
    const url = new URL(desiredFrameSrc, location.href);
    if (desiredFrameShell === "index" && srcFilter !== "all") url.searchParams.set("filter", srcFilter);
    if (desiredFrameShell === "index") applyBrowseOptionsToUrl(url, browseOptions);
    frame.src = `${url.pathname}${url.search}`;
    frame.dataset.loaded = "1";
    frame.dataset.ready = "0";
    frame.dataset.filter = srcFilter;
    frame.dataset.browseKey = activeBrowseKey || "home";
    frame.dataset.shell = desiredFrameShell;
    pendingBrowseOptions = {};
  } else if (shellActive && frame?.dataset.loaded === "1") {
    const nextFilter = browseFilter || "all";
    const nextBrowseKey = activeBrowseKey || "home";
    if (frame.dataset.filter !== nextFilter || frame.dataset.browseKey !== nextBrowseKey || Object.keys(pendingBrowseOptions).length) {
      frame.dataset.filter = nextFilter;
      frame.dataset.browseKey = nextBrowseKey;
      syncHomeFrameFilter(nextFilter, browseOptions);
    }
  }
  if (shellActive) {
    renderWorkspaceBreadcrumb("题目浏览区", browseMeta?.label || "题库首页");
    document.title = `${browseMeta?.label || "题库首页"} · AI 试卷工作台`;
  } else if (assistantActive) {
    renderWorkspaceBreadcrumb("题目浏览区", "我的");
    document.title = "我的 · AI 试卷工作台";
  }
  syncAiAssistantChrome();
  applyResponsiveChrome();
}

function setHomeView(active) {
  const next = Boolean(active);
  if (next && (isComposeMode || isRecordMode)) {
    navigateToWorkspaceView("home");
    return;
  }
  if (next) {
    aiAssistantOpen = false;
    pendingBrowseOptions = {};
    workspace.homeActive = true;
    workspace.activeBrowseFilter = null;
  } else if (workspace.homeActive) {
    workspace.homeActive = false;
  } else {
    applyHomeView();
    return;
  }
  saveWorkspace();
  if (!next && !isBrowseViewActive()) syncPageChromeForTab(getActiveTab());
  renderAll();
}

function openBrowseTab(filter, options = {}) {
  const browseKey = browseKeyFor(filter, options);
  const meta = getBrowseMeta(browseKey);
  if (!meta) return;
  const browseOptions = browseOptionsForKey(browseKey, options);
  if (isComposeMode || isRecordMode) {
    navigateToWorkspaceView("browse", browseKey, browseOptions);
    return;
  }
  ensureBrowseTabs();
  if (!workspace.browseTabs.includes(browseKey)) workspace.browseTabs.push(browseKey);
  aiAssistantOpen = false;
  workspace.homeActive = false;
  workspace.activeBrowseFilter = browseKey;
  pendingBrowseOptions = normalizeBrowseOptions(browseOptions);
  saveWorkspace();
  renderAll();
  showToast(`已打开「${meta.label}」`);
}

function closeBrowseTab(filter) {
  ensureBrowseTabs();
  workspace.browseTabs = workspace.browseTabs.filter(item => item !== filter);
  if (workspace.activeBrowseFilter === filter) {
    pendingBrowseOptions = {};
    workspace.activeBrowseFilter = null;
    workspace.homeActive = true;
  }
  saveWorkspace();
  renderAll();
}

function setBrowseView(filter) {
  const meta = getBrowseMeta(filter);
  if (!meta) return;
  const browseOptions = browseOptionsForKey(filter);
  if (isComposeMode || isRecordMode) {
    navigateToWorkspaceView("browse", filter, browseOptions);
    return;
  }
  ensureBrowseTabs();
  if (!workspace.browseTabs.includes(filter)) workspace.browseTabs.push(filter);
  aiAssistantOpen = false;
  pendingBrowseOptions = normalizeBrowseOptions(browseOptions);
  workspace.homeActive = false;
  workspace.activeBrowseFilter = filter;
  saveWorkspace();
  renderAll();
}

function bindHomeFrameBridge() {
  const homeFrame = document.querySelector("#homeFrame");
  homeFrame?.addEventListener("load", () => {
    homeFrame.dataset.ready = "1";
    if (!isShellFrameActive()) return;
    const browseKey = isBrowseViewActive() ? workspace.activeBrowseFilter : null;
    const meta = browseKey ? getBrowseMeta(browseKey) : null;
    const filter = meta?.filter || browseKey || "all";
    homeFrame.dataset.filter = filter;
    homeFrame.dataset.browseKey = browseKey || "home";
    syncHomeFrameFilter(filter, browseOptionsForKey(browseKey, pendingBrowseOptions));
  });

  window.addEventListener("message", event => {
    const frame = document.querySelector("#homeFrame");
    if (!frame || event.source !== frame.contentWindow) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;

    if (data.type === "aiq-open-ai") {
      openAiAssistant(String(data.prompt || ""));
      return;
    }

    if (data.type === "aiq-open-filter") {
      const filter = String(data.filter || "");
      if (filter === "all") setHomeView(true);
      else openBrowseTab(filter, data);
      return;
    }

    if (data.type === "aiq-toggle-external-question") {
      const item = data.item;
      const selectionKey = String(item?.selectionKey || "");
      if (!selectionKey.startsWith("school::") || !item?.question) return;
      const added = toggleExternalCanvasQuestion(item);
      frame.contentWindow?.postMessage({
        type: "aiq-external-question-result",
        selectionKey,
        added
      }, "*");
      return;
    }

    if (data.type !== "aiq-open-topic") return;

    const topicId = getBaseTopicId(String(data.topicId || ""));
    if (!topicId) return;

    const query = new URLSearchParams(data.query || "");
    const title = String(data.title || query.get("title") || "").trim();
    const shortTitle = String(data.shortTitle || query.get("shortTitle") || title).trim();
    const tabContext = String(data.context || query.get("context") || "paper");
    const lessonKey = String(data.lessonKey || query.get("lessonKey") || title || topicId);

    openTab(topicId, {
      context: tabContext,
      title: title || undefined,
      shortTitle: shortTitle || undefined,
      lessonKey,
      source: query.get("source") || undefined,
      difficulty: query.get("difficulty") || undefined,
      reason: query.get("reason") || undefined,
      focus: query.get("focus") || undefined,
      questionCount: query.get("questions") || undefined,
      usage: query.get("usage") || undefined
    });
  });
}

function revealActiveDocTab(bar) {
  requestAnimationFrame(() => {
    const scroller = bar?.querySelector(".doc-tabs-scroll");
    const activeTab = scroller?.querySelector(".doc-tab.active");
    if (!scroller || !activeTab) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const activeRect = activeTab.getBoundingClientRect();
    let delta = 0;
    if (activeRect.left < scrollerRect.left + 8) {
      delta = activeRect.left - scrollerRect.left - 8;
    } else if (activeRect.right > scrollerRect.right - 8) {
      delta = activeRect.right - scrollerRect.right + 8;
    }
    if (!delta) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({
      left: scroller.scrollLeft + delta,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });
}

function setTabAddMenuOpen(open) {
  tabAddMenuOpen = Boolean(open);
  const button = document.querySelector("#docTabAdd");
  const menu = document.querySelector("#docTabAddMenu");
  if (button) button.setAttribute("aria-expanded", String(tabAddMenuOpen));
  if (menu) menu.hidden = !tabAddMenuOpen;
  if (tabAddMenuOpen) window.setTimeout(() => menu?.querySelector("[data-tab-add-ai-input]")?.focus(), 0);
}

function openTabAddDestination(destination) {
  setTabAddMenuOpen(false);
  if (destination === "home") setHomeView(true);
  else if (destination === "paper") openBrowseTab("paper");
  else if (destination === "chapter") openBrowseTab("chapter");
  else if (destination === "workbook") openBrowseTab("workbook");
  else if (destination === "school") openBrowseTab("school");
}

function renderTabs() {
  const bar = document.querySelector("#docTabs");
  if (!bar) return;
  bar.hidden = false;
  ensureBrowseTabs();
  const homeActive = isHomeViewActive();
  const browseActive = isBrowseViewActive();
  const assistantActive = isAiAssistantViewActive();
  const activeBrowse = workspace.activeBrowseFilter;
  bar.innerHTML = `
    <button class="doc-tab doc-tab-home doc-tab-pinned-home ${homeActive ? "active" : ""}" type="button" data-home-tab aria-label="题库首页">
      <i class="ri-home-4-line doc-tab-icon" aria-hidden="true"></i>
      <span class="doc-tab-label">题库首页</span>
    </button>
    <div class="doc-tabs-scroll">
      ${workspace.browseTabs.map(filter => {
        const meta = getBrowseMeta(filter);
        if (!meta) return "";
        return `
        <button class="doc-tab doc-tab-browse ${browseActive && activeBrowse === filter ? "active" : ""}" type="button" data-browse-filter="${filter}">
          <i class="${meta.icon} doc-tab-icon" aria-hidden="true"></i>
          <span class="doc-tab-label">${escapeHtml(meta.label)}</span>
          <span class="doc-tab-close" role="button" tabindex="0" data-close-browse="${filter}" aria-label="关闭 ${escapeHtml(meta.label)}"><i class="ri-close-line"></i></span>
        </button>`;
      }).join("")}
      ${workspace.tabs.filter(tab => tab.kind !== "editor").map(tab => `
        <button class="doc-tab ${tab.kind === "editor" ? "doc-tab-editor" : ""} ${isUserEditableTab(tab) ? "doc-tab-editable" : "doc-tab-readonly"} ${!homeActive && !browseActive && !assistantActive && tab.id === workspace.activeTabId ? "active" : ""}" type="button" data-tab-id="${tab.id}" title="${escapeHtml(tab.title || tab.shortTitle)}${isUserEditableTab(tab) ? "（可编辑）" : "（只读）"}">
          <i class="${tabDocIcon(tab)} doc-tab-icon" aria-hidden="true"></i>
          <span class="doc-tab-label">${escapeHtml(tab.shortTitle)}</span>
          ${tab.kind === "editor" && tab.editorDraft?.dirty ? `<span class="doc-tab-dirty" aria-label="有未保存修改" title="有未保存修改"></span>` : ""}
          <span class="doc-tab-close" role="button" tabindex="0" data-close-tab="${tab.id}" aria-label="关闭 ${escapeHtml(tab.shortTitle)}"><i class="ri-close-line"></i></span>
        </button>`).join("")}
    </div>
    <button class="doc-tab doc-tab-assistant doc-tab-pinned-more ${assistantActive ? "active" : ""}" id="docTabAiAssistant" type="button" data-ai-assistant-tab aria-label="我的" aria-expanded="${assistantActive}">
      <i class="ri-user-3-line doc-tab-icon" aria-hidden="true"></i>
      <span class="doc-tab-label">我的</span>
    </button>
    `;

  bar.querySelector("[data-home-tab]")?.addEventListener("click", () => {
    setHomeView(true);
  });
  bar.querySelectorAll("[data-browse-filter]").forEach(button => {
    button.addEventListener("click", event => {
      if (event.target.closest("[data-close-browse]")) return;
      setBrowseView(button.dataset.browseFilter);
    });
  });
  bar.querySelectorAll("[data-close-browse]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      closeBrowseTab(button.dataset.closeBrowse);
    });
  });
  bar.querySelectorAll("[data-tab-id]").forEach(button => {
    button.addEventListener("click", event => {
      if (event.target.closest("[data-close-tab]")) return;
      switchTab(button.dataset.tabId);
    });
  });
  bar.querySelectorAll("[data-close-tab]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      closeTab(button.dataset.closeTab);
    });
  });
  bar.querySelector("[data-ai-assistant-tab]")?.addEventListener("click", event => {
    event.stopPropagation();
    toggleAiAssistant();
  });
  bar.querySelector("[data-collapse-browse-tab]")?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    collapseBrowsePanelToEditor();
  });
  bar.querySelectorAll("[data-tab-add-destination]").forEach(button => {
    button.addEventListener("click", () => openTabAddDestination(button.dataset.tabAddDestination));
  });
  bar.querySelector("[data-tab-add-ai-form]")?.addEventListener("submit", event => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("[data-tab-add-ai-input]");
    const prompt = String(input?.value || "").trim();
    if (!prompt) {
      input?.focus();
      showToast("请先描述组题要求");
      return;
    }
    setTabAddMenuOpen(false);
    workspace.addQuestionTargetTabId = null;
    workspace.addQuestionPickingActive = false;
    saveWorkspace();
    openComposePage(prompt);
  });
  bar.querySelector("[data-tab-add-record]")?.addEventListener("click", () => {
    setTabAddMenuOpen(false);
    workspace.addQuestionTargetTabId = null;
    workspace.addQuestionPickingActive = false;
    saveWorkspace();
    document.querySelector("#aiAssistantFile")?.click();
  });
  revealActiveDocTab(bar);
}

function buildDetailPageUrl(topicId, options = {}) {
  const qs = new URLSearchParams({
    topic: getBaseTopicId(topicId),
    context: options.context || contextName
  });
  if (options.tabId) qs.set("tabId", options.tabId);
  if (options.title) qs.set("title", options.title);
  if (options.shortTitle) qs.set("shortTitle", options.shortTitle);
  if (options.lessonKey) qs.set("lessonKey", options.lessonKey);
  if (options.focus) qs.set("focus", options.focus);
  if (options.reason) qs.set("reason", options.reason);
  if (options.source) qs.set("source", options.source);
  if (options.difficulty) qs.set("difficulty", options.difficulty);
  if (options.questionCount) qs.set("questions", String(options.questionCount));
  if (options.usage) qs.set("usage", String(options.usage));
  return `./detail-ai.html?${qs.toString()}`;
}

function openDetailPage(url) {
  location.href = url;
}

function tabPageUrl(tab) {
  if (tab?.composeSession) {
    return `./detail-ai.html?mode=compose&prompt=${encodeURIComponent(tab.meta?.aiPrompt || tab.title || "AI 组卷")}&context=paper`;
  }
  if (tab?.recordSession) {
    return `./detail-ai.html?mode=record&fileName=${encodeURIComponent(tab.recordFileName || tab.title || "待录入试卷.pdf")}&context=paper`;
  }
  if (tab?.isQuestionList) {
    return `./detail-ai.html?tabId=${encodeURIComponent(tab.id)}&context=${encodeURIComponent(tab.context || contextName)}`;
  }
  return buildDetailPageUrl(tab.topicId, {
    tabId: tab.id,
    context: tab.context,
    title: tab.title,
    shortTitle: tab.shortTitle,
    lessonKey: tab.lessonKey
  });
}

function requiresPageModeNavigation(tab) {
  if (!tab) return false;
  if (tab.composeSession) {
    return !isComposeMode || String(tab.meta?.aiPrompt || "") !== composePrompt;
  }
  if (tab.recordSession) {
    return !isRecordMode || String(tab.recordFileName || "") !== recordFileName;
  }
  return isComposeMode || isRecordMode;
}

function workspaceViewPageUrl(view, filter = "", options = {}) {
  const current = getActiveTab();
  const normalTab = current && !current.composeSession && !current.recordSession
    ? current
    : workspace.tabs.find(tab => !tab.composeSession && !tab.recordSession);
  const url = new URL(normalTab ? tabPageUrl(normalTab) : "./detail-ai.html?context=paper", location.href);
  url.searchParams.delete("mode");
  url.searchParams.delete("prompt");
  url.searchParams.delete("fileName");
  url.searchParams.set("workspaceView", view);
  if (view === "browse" && filter) url.searchParams.set("browse", filter);
  else url.searchParams.delete("browse");
  applyBrowseOptionsToUrl(url, options);
  return `${url.pathname}${url.search}`;
}

function navigateToWorkspaceView(view, filter = "", options = {}) {
  aiAssistantOpen = false;
  if (view === "home") {
    pendingBrowseOptions = {};
    workspace.homeActive = true;
    workspace.activeBrowseFilter = null;
  } else if (view === "course") {
    aiAssistantTabOpen = true;
    workspace.courseCenterTabOpen = true;
    workspace.homeActive = false;
    workspace.activeBrowseFilter = null;
  } else {
    ensureBrowseTabs();
    if (getBrowseMeta(filter) && !workspace.browseTabs.includes(filter)) workspace.browseTabs.push(filter);
    workspace.homeActive = false;
    workspace.activeBrowseFilter = getBrowseMeta(filter) ? filter : null;
    pendingBrowseOptions = normalizeBrowseOptions(options);
  }
  saveWorkspace();
  openDetailPage(workspaceViewPageUrl(view, filter, options));
}

function switchTab(tabId) {
  const tab = workspace.tabs.find(item => item.id === tabId);
  if (!tab) return;
  if (workspace.activeTabId === tabId && !isHomeViewActive() && !isBrowseViewActive() && !isAiAssistantViewActive()) return;
  aiAssistantOpen = false;
  pendingBrowseOptions = {};
  workspace.homeActive = false;
  workspace.activeBrowseFilter = null;
  workspace.activeTabId = tabId;
  selectedPanelEnlarged = false;
  saveWorkspace();
  if (requiresPageModeNavigation(tab)) {
    openDetailPage(tabPageUrl(tab));
    return;
  }
  history.replaceState(null, "", tabPageUrl(tab));
  syncPageChromeForTab(tab);
  renderAll();
  applySelectedPanelState();
}

function syncPageChromeForTab(tab) {
  const favoriteLabel = document.querySelector("#favoritePaperLabel");
  if (!tab || !favoriteLabel) return;
  favoriteLabel.textContent = "收藏";
}

function closeTab(tabId) {
  const index = workspace.tabs.findIndex(tab => tab.id === tabId);
  if (index < 0) return;
  const closingTab = workspace.tabs[index];
  if ((isComposeMode || isRecordMode) && workspace.tabs.length === 1) {
    showToast("当前 AI 任务完成后可返回首页");
    return;
  }
  const wasActive = workspace.activeTabId === tabId;
  const wasViewActive = wasActive && !isHomeViewActive() && !isBrowseViewActive() && !isAiAssistantViewActive();
  workspace.tabs.splice(index, 1);
  if (wasActive) {
    const nextTab = workspace.tabs[Math.max(0, index - 1)] || workspace.tabs[0] || null;
    workspace.activeTabId = nextTab?.id || null;
    if (!nextTab && !isAiAssistantViewActive()) workspace.homeActive = true;
  }
  const nextActiveTab = getActiveTab();
  if (wasActive) {
    selectedPanelEnlarged = false;
  }
  saveWorkspace();
  if (wasViewActive && nextActiveTab && requiresPageModeNavigation(nextActiveTab)) {
    openDetailPage(tabPageUrl(nextActiveTab));
    return;
  }
  renderAll();
  applySelectedPanelState();
}

function openTab(topicId, options = {}) {
  const baseId = getBaseTopicId(topicId);
  const tabContext = options.context || contextName;
  const lessonKey = options.lessonKey || options.title || "";
  const existing = workspace.tabs.find(tab =>
    tab.kind !== "editor"
    &&
    getBaseTopicId(tab.topicId) === baseId
    && !tab.fromQuestionId
    && !tab.isQuestionList
    && (tab.context || contextName) === tabContext
    && (!lessonKey || tab.lessonKey === lessonKey || tab.title === lessonKey)
  );
  if (existing) {
    switchTab(existing.id);
    showToast(`已切换到「${existing.shortTitle || existing.title}」`);
    return existing;
  }
  const tab = createTab(baseId, tabContext, options);
  workspace.tabs.push(tab);
  workspace.activeTabId = tab.id;
  workspace.homeActive = false;
  workspace.activeBrowseFilter = null;
  aiAssistantOpen = false;
  pendingBrowseOptions = {};
  // Opening a source resource always returns to the right-side browsing area.
  // The active question draft remains selected in the left workspace, but its
  // full-screen editor must not cover the newly opened resource.
  selectedPanelEnlarged = false;
  saveWorkspace();
  if (isComposeMode || isRecordMode) openDetailPage(tabPageUrl(tab));
  else {
    history.replaceState(null, "", tabPageUrl(tab));
    renderAll();
  }
  showToast(`已打开「${tab.shortTitle || tab.title}」`);
  return tab;
}

function openPaperPicker() {
  const activeTab = getActiveTab();
  const currentId = getBaseTopicId(activeTab?.topicId);
  const activeContext = activeTab?.context || contextName;
  if (tabIsWorkbook(activeTab)) {
    const nextId = ["t9", "t7", "t19"].find(id => id !== currentId) || "t9";
    openTab(nextId, { context: "series" });
    return;
  }
  const nextId = ["t14", "t25", "t2"].find(id => id !== currentId) || "t14";
  openTab(nextId, { context: activeContext });
}

function deleteQuestionById(qId) {
  const tab = getActiveTab();
  if (!tab) return;
  const q = tab.questions.find(item => item.id === qId);
  if (!q || tab.removedQuestionIds.includes(qId)) return;
  tab.removedQuestionIds.push(qId);
  removeGlobalSelectedByKey(getQuestionSelectionKey(tab.topicId, qId));
  saveWorkspace();
  renderQuestionCards();
  showToast(`已删除第 ${q.num} 题`);
}

function insertQuestionAfter(qId) {
  const tab = getActiveTab();
  if (!tab) return;
  const idx = tab.questions.findIndex(item => item.id === qId);
  if (idx < 0) return;
  const ref = tab.questions[idx];
  const newQ = {
    id: `new-${Date.now()}`,
    num: ref.num + 1,
    section: ref.section,
    type: ref.type,
    difficulty: ref.difficulty || "中等",
    knowledge: ref.knowledge || "待补充",
    minutes: ref.minutes || 2,
    competency: ref.competency || "运算能力",
    badges: [],
    stem: "（新增）请在此补充题目内容。",
    options: ref.type === "选择题" ? ["A. 待补充", "B. 待补充", "C. 待补充", "D. 待补充"] : [],
    answer: "待补充",
    analysis: "待补充"
  };
  tab.questions.splice(idx + 1, 0, newQ);
  tab.questions.forEach((item, i) => { item.num = i + 1; });
  saveWorkspace();
  renderQuestionCards();
  showToast(`已在第 ${ref.num} 题后新增加题`);
}

function toggleQuestionAnalysis(qId) {
  if (expandedAnalysisIds.has(qId)) expandedAnalysisIds.delete(qId);
  else expandedAnalysisIds.add(qId);
  renderQuestionCards();
}

function bindQuestionCardEvents() {
  document.querySelectorAll("#questionCardBoard .question-item").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("[data-card-action], .q-card-actions, .q-num-mark")) return;
      if (window.getSelection()?.toString()) return;
      if (event.shiftKey || event.metaKey || event.ctrlKey) {
        event.preventDefault();
        toggleDragPick(card.dataset.q);
        return;
      }
      if (card.classList.contains("is-skipped")) return;
    });
  });

  document.querySelectorAll("#questionCardBoard [data-card-action]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      button.closest("details")?.removeAttribute("open");
      const qId = button.dataset.q;
      const action = button.dataset.cardAction;
      const q = getActiveTab()?.questions.find(item => item.id === qId);

      if (action === "fix") showToast(`已记录第 ${q?.num} 题的纠错反馈，教研会尽快核对`);
      if (action === "favorite") {
        const added = toggleQuestionFavorite(qId);
        showToast(added ? `已收藏第 ${q?.num} 题` : `已取消收藏第 ${q?.num} 题`);
      }
      if (action === "similar") showToast(`正在查找第 ${q?.num} 题的相似题…`);
      if (action === "adapt") showToast(`正在生成第 ${q?.num} 题的 AI 改编题…`);
      if (action === "paper-copy-remove") togglePaperCopyQuestion(qId);
      if (action === "select") toggleQuestionSelection(qId, undefined, { sourceEl: button.closest(".question-item") || button });
      if (action === "add-selected") addQuestionToSelected(qId, { sourceEl: button.closest(".question-item") || button });
      if (action === "remove-selected") removeQuestionFromSelected(qId);
      if (action === "analysis") toggleQuestionAnalysis(qId);
    });
  });

  bindQuestionDragEvents();
}

function renderAll() {
  renderQuestionCards();
  renderTabs();
  renderMyResources();
  renderCourseCenter();
  const favBtn = document.querySelector("#favoritePaper");
  if (favBtn) {
    const saved = isTabFavorited(getActiveTab());
    workspace.paperFavorited = saved;
    favBtn.classList.toggle("saved", saved);
    favBtn.innerHTML = favoriteResourceLabel(saved);
  }
  syncPageChromeForTab(getActiveTab());
  const ansBtn = document.querySelector("#toggleShowAnswer");
  if (ansBtn && workspace.showAnswers) {
    ansBtn.innerHTML = '<i class="ri-eye-off-line"></i><span>隐藏答案</span>';
  }
  applyHomeView();
}

function initQuestionPickerLibrary() {
  if (!QUESTION_PICKER_MODE) return;
  const main = document.querySelector("#aiMainColumn");
  const shell = document.querySelector("#aiContentShell");
  if (!main || !shell || document.querySelector("#pickerLibraryNav")) return;

  const groups = {
    paper: {
      label: "试卷",
      filters: [["学年", ["全部学年", "2026-2027学年", "2025-2026学年"]], ["地区", ["北京市朝阳区", "北京市海淀区", "北京市西城区"]], ["年级", ["七年级上", "七年级下", "八年级上"]]],
      items: [
        ["t2", "2026-2027学年北京市朝阳区七年级上学期期末数学试卷", "区统考 · 7题"],
        ["t14", "中国人民大学附属中学七年级上学期期中数学试卷", "名校 · 6题"],
        ["t25", "北京市第四中学七年级上学期期中数学试卷", "名校 · 4题"]
      ]
    },
    chapter: {
      label: "同步练习",
      filters: [["教材", ["人教版/七年级上册（2024）", "北师大版/七年级上册"]], ["章节", ["第一章 有理数", "第二章 有理数的运算", "第三章 代数式"]], ["课时", ["1.1 正数和负数", "1.2 有理数及其大小比较", "本章小结"]]],
      items: [
        ["t9", "有理数概念课时过关：数轴、相反数与绝对值", "同步练习 · 16题"],
        ["t7", "七上正负数与数轴：概念理解过关题单", "基础巩固 · 16题"],
        ["t19", "第一章有理数单元同步提升练习", "进阶提升 · 18题"]
      ]
    },
    special: {
      label: "专题",
      filters: [["知识模块", ["全部模块", "数与式", "方程与不等式", "几何初步"]], ["专题", ["全部专题", "计算专练", "易错突破", "期末高频"]], ["难度", ["全部难度", "基础", "中等", "较难"]]],
      items: [
        ["t27", "期末选择题高频考法：审题与快速提分", "专题 · 16题"],
        ["t33", "期中压轴题：关键步骤分层拆解", "培优突破 · 12题"],
        ["t6", "初一期末高频易错周测题单", "易错专题 · 18题"]
      ]
    },
    knowledge: {
      label: "章节知识点选题",
      filters: [["教材", ["人教版/七年级上册（2024）", "北师大版/七年级上册"]], ["章节", ["第一章 有理数", "第二章 有理数的运算", "第三章 代数式"]], ["知识点", ["正数和负数", "数轴", "相反数", "绝对值"]]],
      items: [
        ["t2", "2024-2025学年北京市朝阳区七年级上册期末考试：数学", "期末考试 · 7题"],
        ["t14", "2026年北京市朝阳区二模试卷：数学", "模拟考试 · 6题"],
        ["t25", "2025-2026学年北京市朝阳区九年级上册期末考试：数学", "期末考试 · 4题"],
        ["t6", "2025-2026学年北京市朝阳区八年级上册期末考试：数学", "期末考试 · 7题"]
      ]
    }
  };
  let activeGroup = "knowledge";
  const pickerModes = [
    ["knowledge", "单题"],
    ["paper", "试卷"]
  ];

  main.insertAdjacentHTML("afterbegin", `<nav class="picker-library-nav" id="pickerLibraryNav" aria-label="选题方式">${pickerModes.map(([key, label]) => `<button type="button" data-picker-group="${key}" class="${key === activeGroup ? "is-active" : ""}>${label}</button>`).join("")}</nav>`);
  shell.insertAdjacentHTML("afterbegin", `<aside class="picker-library-panel" id="pickerLibraryPanel" aria-label="查找套题"></aside>`);
  const panel = document.querySelector("#pickerLibraryPanel");
  const previewScroll = document.querySelector("#docPreviewScroll");
  previewScroll?.insertAdjacentHTML("afterbegin", `<div class="picker-question-filters" id="pickerQuestionFilters"><label><span>题型</span><select><option value="">全部题型</option><option value="选择题">选择题</option><option value="填空题">填空题</option><option value="解答题">解答题</option></select><i class="ri-arrow-down-s-line"></i></label><label><span>难度</span><select><option value="">全部难度</option><option value="简单">简单</option><option value="较易">较易</option><option value="中等">中等</option><option value="较难">较难</option></select><i class="ri-arrow-down-s-line"></i></label></div>`);
  const questionFilters = document.querySelector("#pickerQuestionFilters");
  function applyPickerQuestionFilters() {
    const [type, difficulty] = [...(questionFilters?.querySelectorAll("select") || [])].map(select => select.value);
    document.querySelectorAll("#questionCardBoard .question-item").forEach(card => {
      card.hidden = Boolean((type && card.dataset.questionType !== type) || (difficulty && card.dataset.questionDifficulty !== difficulty));
    });
  }
  questionFilters?.querySelectorAll("select").forEach(select => select.addEventListener("change", applyPickerQuestionFilters));
  const pickerQuestionBoard = document.querySelector("#questionCardBoard");
  if (pickerQuestionBoard) new MutationObserver(applyPickerQuestionFilters).observe(pickerQuestionBoard, { childList: true });

  const contextFor = key => key === "chapter" ? "series" : key === "special" ? "special" : key === "knowledge" ? "chapter" : "paper";
  function openPickerResource(item) {
    panel.querySelectorAll("[data-picker-resource]").forEach(node => node.classList.toggle("is-active", node.dataset.pickerResource === item[0]));
    openTab(item[0], { context: contextFor(activeGroup), title: item[1], shortTitle: item[1], reason: groups[activeGroup].label });
  }
  function openPickerSingleQuestion(item, questionIndex = 0) {
    const sourceQuestions = getQuestions(item[0]);
    const question = sourceQuestions[questionIndex % sourceQuestions.length];
    const topicId = `single-${item[0]}-${question.id}`;
    let tab = workspace.tabs.find(entry => entry.topicId === topicId && entry.pickerSingleQuestion);
    if (!tab) {
      tab = createTab(topicId, "chapter", { title: question.knowledge || item[1], shortTitle: question.knowledge || "单题", reason: "知识点选题" });
      tab.questions = sourceQuestions.map((entry, index) => ({ ...entry, num: index + 1, section: "单题筛选结果" }));
      tab.pickerSingleQuestion = true;
      workspace.tabs.push(tab);
    }
    workspace.activeTabId = tab.id;
    workspace.homeActive = false;
    workspace.activeBrowseFilter = null;
    selectedPanelEnlarged = false;
    saveWorkspace();
    renderAll();
    applyPickerQuestionFilters();
  }
  function renderPickerPanel() {
    const group = groups[activeGroup];
    const singleMode = activeGroup === "knowledge";
    panel.innerHTML = `${singleMode ? `<div class="picker-single-switch" role="tablist"><button type="button" class="is-active">按套题</button><button type="button">按单题</button></div>` : ""}${singleMode ? "" : `<div class="picker-filter-stack">${group.filters.map(([label, options]) => `<label><span>${label}</span><select>${options.map(option => `<option>${option}</option>`).join("")}</select></label>`).join("")}<label class="picker-resource-search"><i class="ri-search-line"></i><input type="search" placeholder="搜索试卷" /></label></div>`}${singleMode ? `<div class="picker-knowledge-tree" hidden><label><i class="ri-search-line"></i><input type="search" placeholder="搜索知识点" /></label><button type="button" class="picker-tree-root is-active">全部知识点</button><details open><summary>数与代数</summary><details open><summary>数与式</summary><button type="button" data-tree-resource="0">正数和负数</button><button type="button" data-tree-resource="1">有理数</button><button type="button" data-tree-resource="2">数轴与相反数</button><button type="button" data-tree-resource="0">绝对值</button></details><details><summary>方程与不等式</summary><button type="button" data-tree-resource="1">一元一次方程</button><button type="button" data-tree-resource="2">不等式基础</button></details></details><details><summary>图形与几何</summary><button type="button" data-tree-resource="2">几何图形初步</button><button type="button" data-tree-resource="1">角与线段</button></details><details><summary>统计与概率</summary><button type="button" data-tree-resource="0">数据的收集与整理</button></details></div>` : ""}<div class="picker-resource-heading"><strong>${singleMode ? "推荐题目" : "推荐试卷"}</strong><span>${group.items.length} ${singleMode ? "组" : "份"}</span></div><div class="picker-resource-list">${group.items.map((item, index) => `<button type="button" data-picker-resource="${item[0]}" class="${index === 0 ? "is-active" : ""}"><i class="${activeGroup === "paper" ? "ri-file-list-3-line" : "ri-question-line"}"></i><span><b title="${escapeHtml(item[1])}">${escapeHtml(item[1])}</b><small>${escapeHtml(item[2])}</small></span><i class="ri-arrow-right-s-line"></i></button>`).join("")}</div>`;
    if (singleMode) {
      panel.querySelector(".picker-single-switch")?.insertAdjacentHTML("afterend", `<label class="picker-suite-search"><i class="ri-search-line"></i><input type="search" placeholder="搜索套题名称" /></label>`);
      panel.querySelector(".picker-resource-heading")?.remove();
      const list = panel.querySelector(".picker-resource-list");
      list?.classList.add("picker-suite-cards");
      const suiteTags = ["期末", "模拟", "期末", "期末"];
      list?.querySelectorAll("[data-picker-resource]").forEach((button, index) => {
        const item = group.items[index];
        button.innerHTML = `<span class="picker-suite-line"><em>${suiteTags[index] || "套题"}</em><b title="${escapeHtml(item[1])}">${escapeHtml(item[1])}</b></span><small>${escapeHtml(item[2])}</small>`;
      });
    }
    panel.querySelectorAll("[data-picker-resource]").forEach((button, index) => button.addEventListener("click", () => openPickerResource(group.items[index])));
    const search = panel.querySelector(".picker-suite-search input, .picker-filter-stack input");
    search?.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      panel.querySelectorAll("[data-picker-resource]").forEach(button => { button.hidden = Boolean(query) && !button.textContent.toLowerCase().includes(query); });
    });
    panel.querySelectorAll(".picker-single-switch button").forEach(button => button.addEventListener("click", () => {
      panel.querySelectorAll(".picker-single-switch button").forEach(node => node.classList.toggle("is-active", node === button));
      const knowledgeOpen = button.textContent === "按单题";
      document.documentElement.classList.toggle("picker-single-question-mode", knowledgeOpen);
      const filterStack = panel.querySelector(".picker-filter-stack");
      if (filterStack) filterStack.hidden = knowledgeOpen;
      panel.querySelector(".picker-knowledge-tree").hidden = !knowledgeOpen;
      const resourceHeading = panel.querySelector(".picker-resource-heading");
      if (resourceHeading) resourceHeading.hidden = knowledgeOpen;
      panel.querySelector(".picker-resource-list").hidden = knowledgeOpen;
      const suiteSearch = panel.querySelector(".picker-suite-search");
      if (suiteSearch) suiteSearch.hidden = knowledgeOpen;
      if (knowledgeOpen) openPickerSingleQuestion(group.items[0], 0);
    }));
    panel.querySelectorAll("[data-tree-resource]").forEach(button => button.addEventListener("click", () => {
      panel.querySelectorAll(".picker-knowledge-tree button").forEach(node => node.classList.toggle("is-active", node === button));
      const itemIndex = Number(button.dataset.treeResource) || 0;
      openPickerSingleQuestion(group.items[itemIndex], itemIndex);
    }));
    openPickerResource(group.items[0]);
  }
  document.querySelectorAll("[data-picker-group]").forEach(button => button.addEventListener("click", () => {
    activeGroup = button.dataset.pickerGroup;
    document.documentElement.classList.remove("picker-single-question-mode");
    document.querySelectorAll("[data-picker-group]").forEach(node => node.classList.toggle("is-active", node === button));
    renderPickerPanel();
  }));
  renderPickerPanel();
}

function bindEvents() {
  document.addEventListener("click", event => {
    const workbenchSource = event.target.closest("[data-workbench-source]");
    if (workbenchSource) {
      event.preventDefault();
      event.stopPropagation();
      const source = workbenchSource.dataset.workbenchSource;
      if (source === "bank") {
        restoreSplitWorkspaceView();
        navigateToWorkspaceView("home");
      } else if (source === "upload") {
        document.querySelector("#workbenchLocalFile")?.click();
      } else if (source === "ai") {
        openAiCreateModal();
      }
      return;
    }
    const toolbarAction = event.target.closest("[data-question-draft-toolbar-action]");
    if (toolbarAction) {
      event.preventDefault();
      event.stopPropagation();
      const action = toolbarAction.dataset.questionDraftToolbarAction;
      if (action === "new") {
        createBlankQuestionDraft({
          appendEditor: selectedPanelEnlarged,
          expand: selectedPanelEnlarged
        });
      } else if (action === "expand") {
        if (selectedPanelEnlarged) {
          restoreSplitWorkspaceView();
        } else {
          rightPanelSectionState.selectedCollapsed = false;
          rightPanelSectionState.browseCollapsed = true;
          openCanvasEditorTab();
          renderSelectedContext();
        }
      } else if (action === "collapse") {
        if (selectedPanelEnlarged) {
          restoreSplitWorkspaceView();
        } else {
          if (isMobileLayout()) setMobileDrawer("selected", false);
          collapseSelectedPanel({ manual: true });
          renderSelectedContext();
        }
      }
      return;
    }
    if (event.target.closest("[data-open-add-questions]")) {
      event.preventDefault();
      event.stopPropagation();
      openAddQuestions();
      return;
    }
    const closeDraft = event.target.closest("[data-close-question-draft]");
    if (closeDraft) {
      event.preventDefault();
      event.stopPropagation();
      closeQuestionDraft(closeDraft.dataset.closeQuestionDraft);
      return;
    }
    if (event.target.closest("[data-new-question-draft]")) {
      event.preventDefault();
      event.stopPropagation();
      createBlankQuestionDraft();
      return;
    }
    if (event.target.closest("[data-question-draft-default]")) {
      event.preventDefault();
      event.stopPropagation();
      activateDefaultQuestionDraft({ expand: selectedPanelEnlarged });
      return;
    }
    const draftButton = event.target.closest("[data-question-draft-id]");
    if (draftButton) {
      event.preventDefault();
      event.stopPropagation();
      const tab = workspace.tabs.find(item => item.id === draftButton.dataset.questionDraftId);
      if (tab) activateEditorTab(tab, { expand: selectedPanelEnlarged });
    }
  });
  document.querySelector("#createQuestionList")?.addEventListener("click", openSelectedAsQuestionList);
  document.querySelector("#workbenchLocalFile")?.addEventListener("change", event => {
    const file = event.target.files?.[0];
    if (!file) return;
    startAiRecordFromFile(file);
    event.target.value = "";
  });
  document.querySelector("#savePaperCopy")?.addEventListener("click", savePaperCopyAsQuestionList);
  document.querySelector("#previewQuestionList")?.addEventListener("click", previewCanvas);
  document.querySelector("#scoreQuestionList")?.addEventListener("click", () => {
    if (!getGlobalSelectedQuestions().length) return;
    showToast("赋分功能即将开放");
  });
  document.querySelectorAll(".ai-selected-footer [data-canvas-action]").forEach(button => {
    button.addEventListener("click", () => handleCanvasFooterAction(button.dataset.canvasAction));
  });
  document.querySelectorAll("[data-print-preview-close]").forEach(node => {
    node.addEventListener("click", closePrintPreview);
  });
  document.querySelector("#canvasPrintConfirm")?.addEventListener("click", printCanvasPreview);
  document.querySelectorAll("[data-score-settings-close]").forEach(node => {
    node.addEventListener("click", closeScoreSettingsModal);
  });
  document.querySelector("#saveScoreSettings")?.addEventListener("click", saveScoreSettings);
  document.querySelectorAll("[data-question-draft-close-modal]").forEach(node => {
    node.addEventListener("click", closeQuestionDraftCloseModal);
  });
  document.querySelector("#confirmQuestionDraftClose")?.addEventListener("click", confirmQuestionDraftClose);

  document.querySelector("#batchAddAllQuestions")?.addEventListener("click", batchAddAllQuestionsToSelected);
  document.querySelector("#addPaperToConversation")?.addEventListener("click", () => {
    const tab = getActiveTab();
    const title = tab?.meta?.title || tab?.title || document.querySelector("#topicTitle")?.textContent?.trim() || "当前试卷";
    openAiAssistant();
    setAiAssistantAttachment({ name: title });
    showToast(`已将《${title}》加入对话`);
  });

  const paperMoreButton = document.querySelector("#paperMoreActions");
  const paperMoreMenu = document.querySelector("#paperMoreMenu");
  const setPaperMoreOpen = open => {
    if (!paperMoreButton || !paperMoreMenu) return;
    paperMoreMenu.hidden = !open;
    paperMoreButton.setAttribute("aria-expanded", String(open));
  };
  paperMoreButton?.addEventListener("click", event => {
    event.stopPropagation();
    setPaperMoreOpen(paperMoreMenu?.hidden !== false);
  });
  paperMoreMenu?.addEventListener("click", () => setPaperMoreOpen(false));

  document.querySelector("#toggleShowAnswer")?.addEventListener("click", toggleShowAnswers);

  document.querySelector("#favoritePaper")?.addEventListener("click", event => {
    const saved = toggleTabFavorite(getActiveTab());
    const btn = event.currentTarget;
    btn.classList.toggle("saved", saved);
    btn.innerHTML = saved
      ? favoriteResourceLabel(true)
      : favoriteResourceLabel(false);
    renderCourseCenter();
    showToast(saved ? "已收藏，可在我的收藏中查看" : "已取消收藏");
  });

  document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "download") {
        registerDownload(getActiveTab());
        renderCourseCenter();
        showToast("正在生成可打印文件…");
      }
    });
  });

  document.querySelector("#panelMask")?.addEventListener("click", closeMobileDrawers);

  document.addEventListener("click", event => {
    if (!event.target.closest(".doc-tab-add-wrap")) setTabAddMenuOpen(false);
    if (!event.target.closest(".paper-action-more")) setPaperMoreOpen(false);
    document.querySelectorAll("#questionCardBoard .q-more-actions[open]").forEach(menu => {
      if (!menu.contains(event.target)) menu.removeAttribute("open");
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      setTabAddMenuOpen(false);
      clearDragPicks();
      closeAiCreateModal();
      closeComposeSpecModal();
      closeQuestionDraftCloseModal();
      closePrintPreview();
      closeScoreSettingsModal();
      closeAiAssistant();
      closeMyResources();
      closeMobileDrawers();
      setPaperMoreOpen(false);
      document.querySelectorAll("#questionCardBoard .q-more-actions[open]").forEach(menu => menu.removeAttribute("open"));
      return;
    }
  });

  bindSelectedDropZone();

  const handleLayoutChange = () => applyResponsiveChrome();
  if (typeof mobileLayoutQuery.addEventListener === "function") {
    mobileLayoutQuery.addEventListener("change", handleLayoutChange);
  } else {
    mobileLayoutQuery.addListener(handleLayoutChange);
  }
}

window.AiqDrafts = {
  switchDraft(tabId) {
    if (!tabId) {
      activateDefaultQuestionDraft({ expand: selectedPanelEnlarged });
      return;
    }
    const tab = workspace.tabs.find(item => item.id === tabId && item.kind === "editor");
    if (tab) activateEditorTab(tab, { expand: selectedPanelEnlarged });
  },
  newDraft: createBlankQuestionDraft,
  closeDraft: closeQuestionDraft
};

if (isHomeShell) {
  bindEvents();
  bindSelectedPanelControls();
  bindAiCreateControls();
  renderSelectedContext();
  if (!isEmbeddedCanvasShell) bindCanvasSync();
  initQuestionPickerLibrary();
} else {
  applyPageMode();
  ensureInitialTab();
  if (isComposeMode) ensureComposeDraft();
  if (!isComposeMode && !isRecordMode) migrateLegacyEditorSession();
  if (isRecordMode) applyRecordMode();
  bindHomeFrameBridge();
  renderAll();
  bindEvents();
  bindPaperTitleEditor();
  bindSelectedPanelControls();
  bindAiAssistantControls();
  bindMyResourcesControls();
  bindComposeControls();
  bindRecordControls();
  bindAiCreateControls();
  bindDirectoryEvents();
  bindCanvasSync();
  if (isWorkbenchMode) {
    createBlankQuestionDraft({ expand: true, appendEditor: true });
    document.title = "飞象题库｜飞象老师";
  }
}
initQuestionPickerLibrary();
showPendingToast();

function toggleExternalCanvasQuestion(item) {
  const key = item?.selectionKey;
  if (!key) return false;
  const selectedItems = [...getGlobalSelectedQuestions()];
  const has = selectedItems.some(entry => entry.selectionKey === key);
  if (has) {
    setActiveSelectedQuestions(selectedItems.filter(entry => entry.selectionKey !== key));
    markQuestionDestinationDirty();
    saveWorkspace();
    renderSelectedContext();
    collapseCanvasIfEmpty();
    return false;
  }
  if (!workspace.canvasTitle) workspace.canvasTitle = formatQuestionListTitle();
  const wasEmpty = selectedItems.length === 0;
  selectedItems.push(item);
  setActiveSelectedQuestions(selectedItems);
  markQuestionDestinationDirty();
  saveWorkspace();
  maybeOpenCanvasOnFirstAdd(wasEmpty);
  renderSelectedContext();
  return true;
}

window.AiqCanvas = {
  toggleQuestion: toggleExternalCanvasQuestion,
  expand: expandSelectedPanel,
  collapse(manual = true) {
    if (selectedPanelEnlarged) {
      setSelectedPanelEnlarged(false);
      return;
    }
    collapseSelectedPanel({ manual });
  },
  has(key) {
    return getGlobalSelectedQuestions().some(entry => entry.selectionKey === key);
  },
  keys() {
    return getGlobalSelectedQuestions().map(entry => entry.selectionKey);
  },
  exportSelected() {
    return getGlobalSelectedQuestions().map(item => ({
      selectionKey: item.selectionKey,
      topicId: item.topicId,
      sourceTitle: item.sourceTitle || item.sourceShortTitle || "",
      sourceShortTitle: item.sourceShortTitle || "",
      question: {
        id: item.question?.id,
        num: item.question?.num,
        section: item.question?.section,
        stem: item.question?.stem || "",
        type: item.question?.type || "",
        difficulty: item.question?.difficulty || "",
        knowledge: item.question?.knowledge || "",
        options: Array.isArray(item.question?.options) ? [...item.question.options] : [],
        answer: item.question?.answer || "",
        analysis: item.question?.analysis || "",
        minutes: item.question?.minutes,
        score: item.question?.score
      }
    }));
  },
  switchDraft(tabId) {
    if (!tabId) {
      activateDefaultQuestionDraft({ expand: selectedPanelEnlarged });
      return;
    }
    const tab = workspace.tabs.find(item => item.id === tabId && item.kind === "editor");
    if (tab) activateEditorTab(tab, { expand: selectedPanelEnlarged });
  },
  newDraft: createBlankQuestionDraft,
  closeDraft: closeQuestionDraft
};
window.dispatchEvent(new Event("aiq-canvas-ready"));

document.querySelectorAll("[data-open-new-task]").forEach(button => {
  button.addEventListener("click", () => {
    location.href = "./new-task/index.html";
  });
});
})();
