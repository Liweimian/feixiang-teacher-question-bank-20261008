(() => {
  const coursewarePrompt =
    '生成小学5年级 正方体和长方体的互动课件，人教版，包含棱长计算和表面积推导，支持拖拽拼接演示'
  const examPrompt = '帮我出一份北京市西城区小学数学5年级上期末考试试卷'

  const QUESTION_BANK = [
    {
      bankId: 1,
      title: '长方体的 6 个面中最多有（　）个面是正方形。',
      type: '选择',
      options: ['A. 1', 'B. 2', 'C. 3', 'D. 4'],
      tag: '基础',
      tagClass: 'tag-easy',
      knowledge: '长方体特征',
      minutes: 1,
      source: '题目资源',
    },
    {
      bankId: 2,
      title: '一个长方体的棱长之和是 180 cm，相交于一个顶点的三条棱的长度和是（　）。',
      type: '选择',
      options: ['A. 45 cm', 'B. 30 cm', 'C. 90 cm', 'D. 60 cm'],
      tag: '基础',
      tagClass: 'tag-easy',
      knowledge: '棱长总和',
      minutes: 1,
      source: '题目资源',
    },
    {
      bankId: 5,
      title:
        '如图是一个（　）体框架，它正面的形状是（　），长是（　）cm，宽是（　）cm。与它相对的面的面积是（　）cm²。左侧面的形状是（　），长是（　）cm，宽是（　）cm。左面的面积是（　）cm²。它的上面是（　），长是（　）cm，宽是（　）cm。',
      type: '填空',
      tag: '基础',
      tagClass: 'tag-easy',
      knowledge: '长方体框架',
      minutes: 1,
      source: '题目资源',
      figure: 'prism-534',
    },
    {
      bankId: 6,
      title: '一个长方体最多可以有（　）条棱长度相等，最多有（　）个面面积相等。',
      type: '选择',
      options: ['A. 2', 'B. 4', 'C. 6', 'D. 8'],
      tag: '易错',
      tagClass: 'tag-hard',
      knowledge: '棱与面的关系',
      minutes: 1,
      source: '题目资源',
    },
    {
      bankId: 7,
      title: '做一个底面周长是 18 cm，高是 4 cm 的长方体铁丝框架。至少需要多少厘米的铁丝？',
      type: '解答',
      tag: '巩固',
      tagClass: '',
      knowledge: '棱长总和应用',
      minutes: 3,
      source: '题目资源',
      score: 6,
    },
    {
      bankId: 8,
      title: '优优给妈妈买了一个蛋糕。现在要用彩带将蛋糕盒捆扎起来，打结处需要 20 cm，一共需要多少厘米彩带？',
      type: '解答',
      tag: '易错',
      tagClass: 'tag-hard',
      knowledge: '表面积应用',
      minutes: 3,
      source: '题目资源',
      figure: 'cake-box',
      score: 6,
    },
    {
      bankId: 9,
      title:
        '小明家有一个长方体形状的蚊帐（如图），蚊帐四周由钢管固定（地面的四边没有钢管）。固定这样一个蚊帐至少需要多长的钢管？',
      type: '解答',
      tag: '易错',
      tagClass: 'tag-hard',
      knowledge: '棱长总和应用',
      minutes: 3,
      source: '题目资源',
      figure: 'mosquito-net',
      score: 6,
    },
  ]

  const EXAM_BANK = [
    {
      bankId: 101,
      title: '下面算式中，与 42.8 × 1.4 结果相同的算式是（　）。',
      type: '选择',
      options: ['A. 42.8 × 0.14', 'B. 4.28 × 14', 'C. 4.28 × 1.4', 'D. 4.28 × 0.14'],
      tag: '较易',
      tagClass: 'tag-easy',
      knowledge: '小数乘法中积的变化规律',
      minutes: 2,
      score: 2,
      source: '【黄冈小状元作业本】2025-2026学年人教版五年级上册：数学',
    },
    {
      bankId: 102,
      title: 'x = 8 是下列方程（　）的解。',
      type: '选择',
      options: ['A. 8x = 40', 'B. 70 + 2x = 86', 'C. 5x − 3×2 = 74', 'D. 6x + 0.9 = 4.5'],
      tag: '较易',
      tagClass: 'tag-easy',
      knowledge: '方程的检验',
      minutes: 2,
      score: 2,
      source: '【全品学练考】2025-2026学年人教版五年级上册：数学',
    },
    {
      bankId: 103,
      title: '右面平行四边形的面积是（　）cm²。',
      type: '选择',
      options: ['A. 45', 'B. 54', 'C. 64.8', 'D. 67.5'],
      tag: '较易',
      tagClass: 'tag-easy',
      knowledge: '平行四边形面积公式',
      minutes: 2,
      score: 2,
      source: '2023-2024学年北京市西城区五年级上期末试卷：数学',
      figure: 'parallelogram-96',
    },
    {
      bankId: 104,
      title: '当 m = 1.5，n = 3 时，10m − n² = （　）。',
      type: '选择',
      options: ['A. 6', 'B. 9', 'C. 12', 'D. 15'],
      tag: '较易',
      tagClass: 'tag-easy',
      knowledge: '求含有字母的式子的值，平方与平方运算',
      minutes: 2,
      score: 2,
      source: '2023-2024学年北京市西城区五年级上期末试卷：数学',
    },
    {
      bankId: 105,
      title:
        '路口的信号灯每次绿灯亮 25 秒，黄灯亮 5 秒，红灯亮 30 秒。小明走到路口时，遇到（　）的可能性最大。',
      type: '选择',
      options: ['A. 绿灯', 'B. 黄灯', 'C. 红灯', 'D. 三种一样大'],
      tag: '较易',
      tagClass: 'tag-easy',
      knowledge: '判断事件发生的可能性的大小',
      minutes: 2,
      score: 2,
      source: '【学习探究诊断】2025-2026学年人教版五年级上册：数学',
    },
    {
      bankId: 106,
      title: '右图是一扇古窗的图案（每个小方格表示 1 cm²）。用数方格的方法估算，图案的面积大约是（　）cm²。',
      type: '选择',
      options: ['A. 12', 'B. 18', 'C. 24', 'D. 30'],
      tag: '较易',
      tagClass: 'tag-easy',
      knowledge: '数方格法估算图形面积',
      minutes: 2,
      score: 2,
      source: '2025-2026学年北京市西城区五年级上册期末考试：数学',
      figure: 'grid-window',
    },
    {
      bankId: 107,
      title: '一批货物共 8.5 t，每辆货车最多运 3 t。要把这批货物全部运完，至少需要（　）辆货车。',
      type: '选择',
      options: ['A. 2', 'B. 2.8', 'C. 3', 'D. 4'],
      tag: '易错',
      tagClass: 'tag-hard',
      knowledge: '小数除法用“进一法”解决实际问题',
      minutes: 2,
      score: 2,
      source: '【黄冈小状元达标卷】2024-2025学年人教版五年级上册：数学',
    },
    {
      bankId: 108,
      title: '一个三角形的面积是 24 cm²，底是 8 cm，这条底边上的高是（　）cm。',
      type: '填空',
      tag: '较易',
      tagClass: 'tag-easy',
      knowledge: '逆用三角形面积公式',
      minutes: 2,
      score: 3,
      source: '2023-2024学年北京市西城区五年级上期末试卷：数学',
    },
    {
      bankId: 109,
      title: '一个梯形的上底是 4 cm，下底是 6 cm，高是 3 cm，它的面积是（　）cm²。',
      type: '填空',
      tag: '较易',
      tagClass: 'tag-easy',
      knowledge: '梯形面积公式',
      minutes: 2,
      score: 3,
      source: '【学习探究诊断】2025-2026学年人教版五年级上册：数学',
    },
    {
      bankId: 110,
      title:
        '某快递公司收费标准：首重 1 kg 收 12 元，续重每 1 kg 收 8 元（不足 1 kg 按 1 kg 计）。李阿姨寄一件 4.6 kg 的包裹，需要付多少元？如果她一共付了 44 元，包裹最重不超过多少千克？',
      type: '解答',
      tag: '中档',
      tagClass: 'tag-hard',
      knowledge: '分段计费与取整',
      minutes: 6,
      score: 6,
      source: '2025-2026学年北京市西城区五年级上册期末考试：数学',
    },
  ]

  const ALL_BANKS = [...QUESTION_BANK, ...EXAM_BANK]

  const PAPERS = {
    practice: {
      id: 'practice',
      fileName: '长方体和正方体的认识 · 课后练一练',
      fileLabel: '题单 · 可编辑',
      title: '长方体和正方体的认识 · 课后练一练',
      docTitle: '长方体和正方体的认识 · 课后练一练',
      school: '五年级（下）· 数学 · 课后练习',
      meta: '人教版五下 · 第三单元',
      sections: false,
      showSource: false,
    },
    exam: {
      id: 'exam',
      fileName: '北京市西城区五年级上学期数学期末试卷',
      fileLabel: '试卷 · 可编辑',
      title: '北京市西城区五年级上学期数学期末试卷',
      docTitle: '北京市西城区五年级上学期数学期末试卷',
      school: '2025—2026学年 · 北京市西城区 · 五年级上学期',
      meta: '人教版五上 · 期末 · 参考附件风格',
      sections: true,
      showSource: true,
    },
    blank: {
      id: 'blank',
      fileName: '未命名练习',
      fileLabel: '练习 · 可编辑',
      title: '未命名练习',
      docTitle: '未命名练习',
      school: '练习与试卷',
      meta: '手动组卷 · 可继续编辑',
      sections: false,
      showSource: false,
    },
  }

  const SECTION_ORDER = ['选择', '填空', '计算', '操作', '解答']
  const SECTION_LABEL = {
    选择: '选择题',
    填空: '填空题',
    计算: '按要求计算',
    操作: '按要求做',
    解答: '解决问题',
  }
  const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八']

  function cloneBankQuestion(bankId, id = bankId) {
    const item = ALL_BANKS.find((q) => q.bankId === bankId)
    if (!item) return null
    return { ...item, id, options: item.options ? [...item.options] : undefined }
  }

  const initialQuestionIds = [1, 2, 6, 7]

  let deps = null
  let paper = PAPERS.practice
  let questions = []
  let saved = false
  let delivered = false
  let activeSlide = 1
  let highlightId = null
  let sheetView = 'word'
  let paperActive = false
  let composeEntryMode = false
  let coursewareContextLabel = '长方体和正方体的认识｜互动课件'
  let uploadInput = null

  function getUploadInput() {
    if (!uploadInput) {
      uploadInput = document.createElement('input')
      uploadInput.type = 'file'
      uploadInput.hidden = true
      uploadInput.accept = '.doc,.docx,.pdf,.png,.jpg,.jpeg'
      uploadInput.addEventListener('change', () => {
        const file = uploadInput.files?.[0]
        if (file) processLocalUpload(file.name)
        uploadInput.value = ''
      })
      document.body.appendChild(uploadInput)
    }
    return uploadInput
  }

  function promptLocalUpload() {
    getUploadInput().click()
  }

  function revealSheetPreview() {
    composeEntryMode = false
    useSheetFile()
    deps.renderPracticePreview('practice-sheet')
  }

  function composeEntryAssistantHtml() {
    return `<b>开始组题</b><p>先选一种方式加入题目。题单生成后会出现在右侧，你可以继续对话改题，或直接编辑。</p><div class="compose-entry-actions"><button type="button" class="compose-entry-action" data-entry-action="chat"><b>直接对话</b><small>说一句话，AI 帮你出题</small></button><button type="button" class="compose-entry-action" data-entry-action="upload"><b>上传文件</b><small>本地试卷 / Word / PDF</small></button><button type="button" class="compose-entry-action" data-entry-action="bank"><b>从题库挑题</b><small>100 万+ 已校验题目</small></button><button type="button" class="compose-entry-action" data-entry-action="knowledge"><b>从知识库挑题</b><small>复用已沉淀的练习</small></button></div>`
  }

  function bindComposeEntryActions(root = deps.messageColumn) {
    root.querySelector('[data-entry-action="chat"]')?.addEventListener('click', () => {
      deps.composerInput.focus()
      deps.composerInput.placeholder = '例如：帮我出一份西城区五上数学期末卷；或「加两道小数乘法基础题」'
      toast('直接在下方输入你的组题要求')
    })
    root.querySelector('[data-entry-action="upload"]')?.addEventListener('click', () => promptLocalUpload())
    root.querySelector('[data-entry-action="bank"]')?.addEventListener('click', () => beginAddQuestions(null, 'bank'))
    root.querySelector('[data-entry-action="knowledge"]')?.addEventListener('click', () => beginAddQuestions(null, 'knowledge'))
  }

  function processLocalUpload(fileName) {
    if (!paperActive) return
    appendUser(`上传本地文件：${fileName}`)
    appendAssistant(`<b>正在解析「${esc(fileName)}」</b><p>识别试卷结构、拆分题目并按考点归档…</p>`)
    deps.scrollToBottom()
    window.setTimeout(() => {
      const bankIds = paper.id === 'exam' ? [105, 106, 107] : [5, 6, 7]
      const picked = bankIds
        .map((bankId, index) => {
          const item = cloneBankQuestion(bankId, Date.now() + index)
          if (!item) return null
          item.tag = '本地上传'
          item.source = '本地试卷'
          return item
        })
        .filter(Boolean)
      const { list, placement } = insertQuestions(picked)
      revealSheetPreview()
      deps.taskHeader.querySelector('h1').textContent = '组题 · 未命名练习'
      appendAssistant(
        `<b>已从「${esc(fileName)}」拆出 ${list.length} 道题</b><p>题目已加入题单。你可以继续上传更多页面，或告诉我「按同考点再出一遍」。</p>`
      )
      if (list[0]) syncSheet(null, list[0].id)
      recordPanelAction('pick-bank', { count: list.length, placement })
      showComposerQuickChips()
      deps.composerInput.placeholder = '例如：第 3 题太难了换一道；再加两道易错题'
      deps.scrollToBottom()
    }, 900)
  }

  let selectedQuestionId = null
  let insertAnchorId = null

  const QUICK_COMMANDS = [
    '帮我出一份西城区五上数学期末卷',
    '加两道小数乘法基础题',
    '整份控制在 15 分钟',
    '全部改成基础难度',
  ]

  const EMPTY_QUICK_COMMANDS = [
    '帮我出一份西城区五上数学期末卷',
    '加两道小数乘法基础题',
    '上传一份本地试卷，按同考点重组',
    '从知识库挑几道同单元题',
  ]

  const ADAPT_QUICK_COMMANDS = [
    '换成更基础的数值',
    '改成填空题',
    '同考点换一组数据',
    '降低难度，保留考点',
  ]

  let currentHintMode = 'default'

  const paperHistory = [
    {
      id: 'exam',
      title: '北京市西城区五年级上学期数学期末试卷',
      meta: '10 题 · 26 分 · 五年级上 · 数学',
      origin: 'AI 生成 · 题库检索',
      time: '今天 18:53',
      status: '编辑中',
    },
    {
      id: 'practice',
      title: '长方体和正方体的认识 · 课后练一练',
      meta: '4 题 · 15 分 · 五年级下 · 数学',
      origin: '来自互动课件《长方体和正方体的认识》',
      time: '今天 14:20',
      status: '已发布 · 28/36 已提交',
    },
    {
      id: 'locked',
      title: '分数除法单元检测 · A / B 卷',
      meta: '18 题 · 100 分 · 六年级下 · 数学',
      origin: '来自本地试卷《分数除法单元测》同考点重组',
      time: '3 天前',
      status: '已存知识库',
    },
  ]

  const studentStats = [
    { name: '张晨', q3: 'A. 2', ok: false },
    { name: '李雨桐', q3: 'C. 6', ok: true },
    { name: '王浩', q3: 'A. 2', ok: false },
    { name: '赵一诺', q3: 'D. 8', ok: false },
    { name: '刘子涵', q3: 'C. 6', ok: true },
    { name: '陈可心', q3: 'B. 4', ok: false },
  ]

  let coursewareTimer = null
  let composeTimer = null
  let highlightTimer = null

  function clearCoursewareTimer() {
    if (coursewareTimer) clearInterval(coursewareTimer)
    coursewareTimer = null
  }

  function clearComposeTimer() {
    if (composeTimer) clearInterval(composeTimer)
    composeTimer = null
  }

  function esc(value) {
    return deps.escapeHtml(value)
  }

  function questionScore(q) {
    if (q.score) return q.score
    if (q.type === '解答') return 6
    if (q.type === '选择') return 3
    return 2
  }

  function totalScore() {
    return questions.reduce((sum, q) => sum + questionScore(q), 0)
  }

  function estimateMinutes() {
    return Math.max(
      5,
      Math.round(
        questions.reduce((sum, q) => sum + (q.minutes || (q.type === '解答' ? 3 : q.type === '选择' ? 1 : 1.5)), 0)
      )
    )
  }

  function useSheetFile() {
    deps.setSheetMeta?.(paper.fileName, paper.fileLabel)
  }

  function sheetSummary() {
    return `${questions.length} 题 · ${totalScore()} 分 · 约 ${estimateMinutes()} 分钟`
  }

  function questionIndexById(id) {
    return questions.findIndex((item) => item.id === id) + 1
  }

  function truncateTitle(title, max = 28) {
    const text = String(title || '').replace(/\s+/g, ' ').trim()
    if (text.length <= max) return text
    return `${text.slice(0, max)}…`
  }

  function mapPickerType(type = '') {
    if (type.includes('选择')) return '选择'
    if (type.includes('填空')) return '填空'
    if (type.includes('计算')) return '计算'
    if (type.includes('操作')) return '操作'
    if (type.includes('解答')) return '解答'
    return '解答'
  }

  function mapPickerDifficulty(difficulty = '') {
    if (/易|简单|基础/.test(difficulty)) return { tag: '基础', tagClass: 'tag-easy' }
    if (/难|提高|挑战|较难/.test(difficulty)) return { tag: '较难', tagClass: 'tag-hard' }
    return { tag: '中等', tagClass: '' }
  }

  const PRISM_BANK_IDS = [1, 2, 5, 6, 7, 8, 9]

  function isPlaceholderPickerEntry(entry) {
    const stem = String(entry?.question?.stem || '').trim()
    const key = String(entry?.selectionKey || '')
    return key.startsWith('pending-') || /^已选题目 \d+$/.test(stem)
  }

  function resolveSheetQuestionsFromPicker(selection = [], count = 0, idBase = Date.now()) {
    const total = Math.max(Number(count) || 0, selection.length, 1)
    const realEntries = selection.filter((entry) => entry && !isPlaceholderPickerEntry(entry))
    if (realEntries.length) {
      return realEntries.map((entry, index) => pickerEntryToSheetQuestion(entry, index, idBase + index * 10))
    }
    const bankIds = paper.id === 'exam' ? [105, 106, 107, 108] : PRISM_BANK_IDS
    const picked = []
    for (let i = 0; i < total; i += 1) {
      const item = cloneBankQuestion(bankIds[i % bankIds.length], idBase + i)
      if (item) picked.push(item)
    }
    return picked
  }

  function buildPickerCompositionAdvice(questions = []) {
    const count = questions.length
    if (!count) return ''

    const tally = { 基础: 0, 中等: 0, 易错: 0, 较难: 0, 提高: 0, 巩固: 0 }
    questions.forEach((q) => {
      const tag = q.tag || '中等'
      tally[tag] = (tally[tag] || 0) + 1
    })
    const basicLike = (tally['基础'] || 0) + (tally['巩固'] || 0)
    const mediumLike = tally['中等'] || 0
    const hardLike = (tally['易错'] || 0) + (tally['较难'] || 0) + (tally['提高'] || 0)
    const basicRatio = basicLike / count
    const hardRatio = hardLike / count
    const types = [...new Set(questions.map((q) => q.type).filter(Boolean))]
    const solveCount = questions.filter((q) => q.type === '解答').length

    const parts = []
    parts.push(`<p>已把你选的 ${count} 道题同步到右侧题单。</p>`)

    if (hardRatio >= 0.45) {
      parts.push(
        '<p>整体难度偏高，对基础薄弱的学生会有一定挑战；优等生能较好地覆盖考查点。建议先确认班级整体水平，再决定是否保留全部拔高题。</p>'
      )
    } else if (basicRatio >= 0.55 && hardRatio < 0.2) {
      parts.push(
        '<p>整体难度适中偏基础，适合大多数学生完成；对优等生来说会偏向简单，可考虑再加 1～2 道拓展或易错题。</p>'
      )
    } else if (hardRatio >= 0.2) {
      parts.push(
        '<p>整体难度适中，基础题与提高题搭配较均衡，适合大多数学生；优等生可能仍觉得拔高部分略少。</p>'
      )
    } else {
      parts.push(
        '<p>整体难度适中，适合大多数学生完成；对优等生来说偏向简单，可按班级学情再补 1～2 道提高题。</p>'
      )
    }

    if (types.length === 1 && count >= 3) {
      parts.push(`<p>目前以「${esc(types[0])}」为主，题型略单一，建议加 1 道其他题型题平衡结构。</p>`)
    }
    if (solveCount >= Math.ceil(count * 0.5) && count >= 4) {
      parts.push('<p>解答题占比较多，建议用时可能偏长，布置前可以再估一下时间。</p>')
    }

    return parts.join('')
  }

  function buildPickerAdjustmentSuggestions(questions = [], countOverride) {
    const count = countOverride ?? questions.length
    if (!count) {
      return ['帮我再补几道同考点基础题', '整份控制在 15 分钟']
    }
    const suggestions = []
    const swapIndex = Math.min(Math.max(2, Math.ceil(count / 2)), count)
    suggestions.push(`第 ${swapIndex} 题太难了，换一道更基础的`)
    if (count < 8) suggestions.push('再加两道易错题')
    const totalMinutes = questions.length
      ? questions.reduce((sum, q) => sum + (Number(q.minutes) || 2), 0)
      : count * 2
    const targetMinutes = Math.max(15, Math.ceil(totalMinutes / 5) * 5)
    suggestions.push(`整份控制在 ${targetMinutes} 分钟`)
    if (questions.length >= 3) {
      const types = new Set(questions.map((q) => q.type).filter(Boolean))
      if (types.size <= 1) suggestions.push('加一道不同题型的题')
    }
    return suggestions.slice(0, 3)
  }

  function buildPickerSuggestionsMarkup(suggestions = []) {
    if (!suggestions.length) return ''
    const chips = suggestions
      .map(
        (text) =>
          `<button type="button" class="compose-pick-suggest" data-hint-command="${esc(text)}">${esc(text)}</button>`
      )
      .join('')
    return `<div class="compose-pick-suggest-block"><span>接下来你可以：</span><div class="compose-pick-suggest-list">${chips}</div></div>`
  }

  function buildPickerUserMessageFromQuestions(questions = []) {
    const count = questions.length
    if (!count) return '从题库挑题'
    if (count === 1) return `从题库挑题：${truncateTitle(questions[0].title, 48)}`
    const previews = questions
      .slice(0, 3)
      .map((q, index) => `${index + 1}. ${truncateTitle(q.title, 24)}`)
      .join('；')
    return count > 3 ? `从题库挑题：${previews}；等 ${count} 道题` : `从题库挑题：${previews}`
  }

  function buildPickerAssistantHtmlFromQuestions(questions = []) {
    const count = questions.length
    if (!count) {
      return '<b>已从题目资源创建题单</b><p>选中的题目会加入右侧。你可以继续选题，或直接告诉我怎么调整。</p>'
    }
    const base = `<b>已加入 ${count} 道选题</b>${buildPickerCompositionAdvice(questions)}`
    return base + buildPickerSuggestionsMarkup(buildPickerAdjustmentSuggestions(questions))
  }

  function pickerEntryToSheetQuestion(entry, index, idBase = Date.now()) {
    const q = entry?.question || {}
    const { tag, tagClass } = mapPickerDifficulty(q.difficulty)
    const type = mapPickerType(q.type)
    return {
      id: idBase + index,
      pickerKey: entry?.selectionKey || '',
      title: q.stem || `第 ${index + 1} 题`,
      type,
      options: q.options?.length ? [...q.options] : undefined,
      tag,
      tagClass,
      knowledge: q.knowledge || '',
      minutes: Number(q.minutes) || (type === '选择' ? 1 : 3),
      score: Number(q.score) || (type === '选择' ? 2 : 5),
      source: entry?.sourceTitle ? `题目资源 · ${entry.sourceTitle}` : '题目资源',
    }
  }

  function buildPickerUserMessage(selection = []) {
    const count = selection.length
    if (!count) return '从题库挑题'
    if (count === 1) {
      const stem = selection[0]?.question?.stem
      return stem ? `从题库挑题：${truncateTitle(stem, 48)}` : '从题库挑题：1 道题'
    }
    const previews = selection
      .slice(0, 3)
      .map((entry, index) => {
        const stem = entry?.question?.stem
        return stem ? `${index + 1}. ${truncateTitle(stem, 24)}` : `${index + 1}. 第 ${entry?.question?.num || index + 1} 题`
      })
      .join('；')
    return count > 3 ? `从题库挑题：${previews}；等 ${count} 道题` : `从题库挑题：${previews}`
  }

  function buildPickerAssistantHtml(selection = []) {
    const count = selection.length
    if (!count) {
      return '<b>已从题目资源创建题单</b><p>选中的题目会加入右侧。你可以继续选题，或直接告诉我怎么调整。</p>'
    }
    const questions = selection.map((entry, index) => pickerEntryToSheetQuestion(entry, index, index))
    const base = `<b>已加入 ${count} 道选题</b>${buildPickerCompositionAdvice(questions)}`
    return base + buildPickerSuggestionsMarkup(buildPickerAdjustmentSuggestions(questions, count))
  }

  function setSelectedQuestion(id) {
    selectedQuestionId = id || null
    deps.setQuestionFocus?.(selectedQuestionId ? questionIndexById(selectedQuestionId) : null)
    if (!selectedQuestionId && currentHintMode === 'adapt') showComposerQuickChips('default')
    deps.renderPracticePreview('practice-sheet')
  }

  function showComposerQuickChips(mode = 'default') {
    if (!deps.conversationView?.classList.contains('home-screen')) {
      hideComposerQuickChips()
      return
    }
    if (mode === true) mode = 'empty'
    if (mode === false) mode = 'default'
    currentHintMode = mode
    const commands =
      mode === 'adapt' ? ADAPT_QUICK_COMMANDS : mode === 'empty' ? EMPTY_QUICK_COMMANDS : QUICK_COMMANDS
    deps.showPaperHints?.(
      commands.map(
        (text) => `<button type="button" class="paper-hint-chip" data-hint-command="${esc(text)}">${esc(text)}</button>`
      ).join('')
    )
  }

  function hideComposerQuickChips() {
    deps.hidePaperHints?.()
  }

  function getInsertPlacement(count = 1) {
    if (insertAnchorId == null) {
      return { type: 'end', afterIndex: Math.max(1, questions.length - count + 1) }
    }
    return { type: 'after', afterIndex: questionIndexById(insertAnchorId) }
  }

  function insertQuestions(items) {
    const list = items.filter(Boolean)
    if (!list.length) return { list: [], placement: null }
    const placement = getInsertPlacement(list.length)
    if (insertAnchorId != null) {
      const anchorIndex = questions.findIndex((q) => q.id === insertAnchorId)
      if (anchorIndex >= 0) questions.splice(anchorIndex + 1, 0, ...list)
      else questions.push(...list)
    } else {
      questions.push(...list)
    }
    insertAnchorId = null
    return { list, placement }
  }

  function beginAddQuestions(anchorId, source) {
    insertAnchorId = anchorId ?? null
    if (source === 'bank') {
      deps.openQuestionPicker('sheet')
      return
    }
    if (composeEntryMode) {
      appendUser('从知识库挑题，帮我组一份练习')
      deps.taskHeader.querySelector('h1').textContent = '组题 · 未命名练习'
    }
    const bankId = paper.id === 'exam' ? 109 : 7
    const item = cloneBankQuestion(bankId, Date.now())
    if (!item) return
    item.tag = '知识库引用'
    item.source = '我的知识库'
    const { list, placement } = insertQuestions([item])
    revealSheetPreview()
    syncSheet(null, list[0]?.id)
    recordPanelAction('insert-after', { count: 1, placement })
  }

  if (!document.documentElement.dataset.practiceSheetMenuBound) {
    document.documentElement.dataset.practiceSheetMenuBound = 'true'
    document.addEventListener('click', () => closeAddMenus())
  }

  function closeAddMenus(root = document) {
    root.querySelectorAll('.practice-sheet-add.open, .practice-q-add-wrap.open').forEach((node) => node.classList.remove('open'))
  }

  function recordPanelAction(action, meta = {}) {
    const index = meta.index || (meta.id ? questionIndexById(meta.id) : 0)
    const q = meta.q || questions.find((item) => item.id === meta.id)
    const summary = sheetSummary()
    let html = ''
    if (action === 'remove' && q) {
      const knowledge = q.knowledge || '该考点'
      html = `<b>已删除第 ${index} 题</b><p>「${esc(truncateTitle(q.title))}」已从题单移除。当前 ${summary}。</p><p class="panel-suggestion">这道考查「${esc(
        knowledge
      )}」。要我补一道同考点题吗？</p>`
    } else if (action === 'replace' && q) {
      html = `<b>已替换第 ${index} 题</b><p>新题已写入右侧题单，其余题目保持不变。当前 ${summary}。</p>`
    } else if (action === 'adapt-prompt' && q) {
      html = `<b>已选中第 ${index} 题</b><p>你可以直接在下方输入框说怎么改编，例如「换成更基础的数值」或「改成填空题」。</p>`
    } else if (action === 'insert-after') {
      if (meta.placement?.type === 'end') {
        html = `<b>已在题单末尾加入 ${meta.count || 1} 道题</b><p>当前 ${summary}。如需指定位置，把鼠标移到右侧两道题之间，点「＋ 在此处插入题目」。</p>`
      } else {
        html = `<b>已在第 ${meta.placement?.afterIndex || meta.index || ''} 题后加入 ${meta.count || 1} 道题</b><p>当前 ${summary}。你可以继续在这道题后面加题，或告诉我怎么调整。</p>`
      }
    } else if (action === 'pick-bank') {
      if (meta.placement?.type === 'end') {
        html = `<b>已在题单末尾加入 ${meta.count || 1} 道题</b><p>题单已更新。当前 ${summary}。你可以继续选题，或直接告诉我怎么调整。</p>`
      } else if (meta.placement?.type === 'after') {
        html = `<b>已在第 ${meta.placement.afterIndex} 题后加入 ${meta.count || 1} 道题</b><p>当前 ${summary}。你可以继续在这道题后面加题，或直接告诉我怎么调整。</p>`
      } else {
        html = `<b>已从题目资源加入 ${meta.count || 1} 道题</b><p>题单已自动创建并打开。当前 ${summary}。你可以继续选题，或直接告诉我怎么调整。</p>`
      }
    } else if (action === 'empty-created') {
      html = `<b>开始组题</b><p>先选一种方式加入题目。题单生成后会出现在右侧。</p>`
    }
    if (html) appendAssistant(html)
    deps.scrollToBottom()
  }

  function wordFigureMarkup(key) {
    if (key === 'prism-534') {
      return `<figure class="practice-word-figure"><svg viewBox="0 0 140 110" aria-hidden="true"><path d="M28 58 L68 38 L108 58 L108 88 L68 108 L28 88 Z" fill="none" stroke="#6b8f7d" stroke-width="1.5"/><path d="M28 58 L28 88 M68 38 L68 108 M108 58 L108 88" fill="none" stroke="#6b8f7d" stroke-width="1.5"/><path d="M28 58 L68 38 L108 58" fill="none" stroke="#94b5a4" stroke-width="1.2"/><text x="72" y="118" font-size="10" fill="#66766f">5 cm</text><text x="8" y="76" font-size="10" fill="#66766f">3 cm</text><text x="88" y="52" font-size="10" fill="#66766f">4 cm</text></svg><figcaption>长方体框架示意图</figcaption></figure>`
    }
    if (key === 'cake-box') {
      return `<figure class="practice-word-figure"><svg viewBox="0 0 150 110" aria-hidden="true"><rect x="24" y="36" width="92" height="42" fill="#fff7ed" stroke="#d4a574" stroke-width="1.5"/><path d="M24 36 L70 18 L116 36" fill="none" stroke="#d4a574" stroke-width="1.5"/><path d="M70 18 L70 78" fill="none" stroke="#ec8aa0" stroke-width="2"/><path d="M24 57 L116 57" fill="none" stroke="#ec8aa0" stroke-width="2"/><text x="62" y="92" font-size="10" fill="#66766f">40 cm</text><text x="8" y="62" font-size="10" fill="#66766f">15 cm</text><text x="98" y="30" font-size="10" fill="#66766f">20 cm</text></svg><figcaption>蛋糕盒捆扎示意图</figcaption></figure>`
    }
    if (key === 'mosquito-net') {
      return `<figure class="practice-word-figure"><svg viewBox="0 0 150 110" aria-hidden="true"><rect x="30" y="48" width="90" height="34" fill="none" stroke="#8aa3b8" stroke-width="1.2"/><path d="M30 48 L45 28 L105 28 L120 48" fill="none" stroke="#8aa3b8" stroke-width="1.5"/><path d="M45 28 L45 82 M105 28 L105 82" fill="none" stroke="#8aa3b8" stroke-width="1.5"/><text x="62" y="98" font-size="10" fill="#66766f">1.9 m</text><text x="8" y="68" font-size="10" fill="#66766f">1.6 m</text><text x="98" y="24" font-size="10" fill="#66766f">1.5 m</text></svg><figcaption>蚊帐钢管固定示意图</figcaption></figure>`
    }
    if (key === 'parallelogram-96') {
      return `<figure class="practice-word-figure"><svg viewBox="0 0 160 110" aria-hidden="true"><polygon points="16,84 116,84 142,26 42,26" fill="none" stroke="#4d5f77" stroke-width="1.6"/><path d="M42 26 L42 84" fill="none" stroke="#4d5f77" stroke-width="1.1" stroke-dasharray="4 3"/><path d="M42 76 L50 76 L50 84" fill="none" stroke="#4d5f77" stroke-width="1"/><text x="2" y="56" font-size="10" fill="#3f4f63">7.5 cm</text><text x="118" y="20" font-size="10" fill="#3f4f63">7.2 cm</text><text x="47" y="58" font-size="10" fill="#3f4f63">6 cm</text><text x="58" y="98" font-size="10" fill="#3f4f63">9 cm</text></svg></figure>`
    }
    if (key === 'grid-window') {
      const cells = []
      for (let x = 0; x < 6; x += 1) {
        for (let y = 0; y < 5; y += 1) {
          cells.push(`<rect x="${16 + x * 20}" y="${12 + y * 20}" width="20" height="20" fill="none" stroke="#d8dee6" stroke-width="0.8"/>`)
        }
      }
      return `<figure class="practice-word-figure"><svg viewBox="0 0 152 122" aria-hidden="true">${cells.join(
        ''
      )}<path d="M56 112 L56 62 A20 20 0 0 1 96 62 L96 112 Z" fill="#eef3f8" stroke="#4d5f77" stroke-width="1.6"/><path d="M76 62 L76 112 M56 82 L96 82" fill="none" stroke="#4d5f77" stroke-width="1"/></svg><figcaption>古窗图案（每格 1 cm²）</figcaption></figure>`
    }
    return ''
  }

  function questionOptionsMarkup(q) {
    if (!q.options?.length) return ''
    return `<div class="practice-card-options">${q.options.map((opt) => `<span>${esc(opt)}</span>`).join('')}</div>`
  }

  function questionCardsMarkup() {
    return questions
      .map(
        (q, index) => `<article class="practice-card" data-qid="${q.id}" ${
          highlightId === q.id ? 'data-highlight' : ''
        }><span class="drag">${index + 1}</span><div><h4>${esc(q.title)}</h4>${questionOptionsMarkup(
          q
        )}<div class="practice-card-tags"><span>${esc(q.type)}</span><span class="${q.tagClass}">${esc(
          q.tag
        )}</span><span>${esc(q.knowledge)}</span><span>${questionScore(q)} 分</span>${
          q.source ? `<span class="src">${esc(q.source)}</span>` : ''
        }</div></div><div class="practice-card-actions"><button data-replace="${q.id}">换题</button><button data-adapt="${q.id}">AI改编</button><button data-remove="${q.id}">删除</button></div></article>`
      )
      .join('')
  }

  function wordQuestionBody(q) {
    if (q.type === '选择' && q.options?.length) {
      return `<div class="practice-word-options">${q.options.map((opt, optionIndex) => `<span contenteditable="true" data-direct-option="${optionIndex}">${esc(opt)}</span>`).join('')}</div>`
    }
    if (q.type === '解答') {
      return `<div class="practice-word-lines"><span></span><span></span><span></span></div>`
    }
    return `<div class="practice-word-blank"></div><div class="practice-word-blank short"></div>`
  }

  function wordQuestionMarkup(q, index) {
    const score = questionScore(q)
    const hl = highlightId === q.id ? ' data-highlight' : ''
    const selected = selectedQuestionId === q.id ? ' is-selected' : ''
    const figure = q.figure ? wordFigureMarkup(q.figure) : ''
    const body = wordQuestionBody(q)
    const sourceTag = paper.showSource && q.source ? `<div class="practice-word-src">${esc(q.source)}</div>` : ''
    const head = `<div class="practice-word-q-head"><b><span class="practice-q-prefix">${index + 1}.（${score} 分）</span><span contenteditable="true" data-direct-title>${esc(q.title)}</span></b></div>`
    const layout = figure
      ? `<div class="practice-word-q-layout"><div>${head}${body}</div>${figure}</div>`
      : `${head}${body}`
    const actions = `<div class="practice-word-actions" aria-label="第 ${index + 1} 题操作"><div class="practice-q-add-wrap"><button type="button" data-q-add-toggle="${q.id}">加题</button><div class="practice-q-add-menu" role="menu"><button type="button" data-q-add="bank" data-after-id="${q.id}">从题目资源选择</button><button type="button" data-q-add="knowledge" data-after-id="${q.id}">从我的知识库引用</button></div></div><button data-replace="${q.id}">换题</button><button data-adapt="${q.id}">AI改编</button><button data-remove="${q.id}">删除</button></div>`
    return `<section class="practice-word-q${hl}${selected}" data-qid="${q.id}" draggable="true"><span class="practice-drag-handle" title="拖动调整题目顺序" aria-label="拖动调整题目顺序">⠿</span>${actions}${sourceTag}${layout}</section>`
  }

  function toast(text) {
    let node = document.getElementById('practiceToast')
    if (!node) {
      node = document.createElement('div')
      node.id = 'practiceToast'
      node.className = 'toast'
      document.body.appendChild(node)
    }
    node.textContent = text
    node.classList.add('show')
    clearTimeout(node._timer)
    node._timer = setTimeout(() => node.classList.remove('show'), 2200)
  }

  function markSaved() {
    saved = true
    const tip = document.getElementById('practiceSavedTip')
    if (tip) tip.hidden = false
    const badge = document.querySelector('.practice-sheet-head .saved-badge')
    if (badge) badge.textContent = '已存 · 我的知识库 / 练习与试卷'
  }

  function flashHighlight(id) {
    highlightId = id
    deps.renderPracticePreview('practice-sheet')
    clearTimeout(highlightTimer)
    highlightTimer = setTimeout(() => {
      highlightId = null
      deps.renderPracticePreview('practice-sheet')
    }, 2600)
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-qid="${id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  function syncSheet(message, id) {
    if (id) flashHighlight(id)
    else deps.renderPracticePreview('practice-sheet')
    if (message) appendAssistant(message)
  }

  // 把题目按题型编排成「一、选择题 / 二、填空题 / …」的试卷结构，
  // 老师增删题目后小节题量与分值会跟着变。
  function documentFlow() {
    const flow = []
    if (!paper.sections) {
      questions.forEach((q, index) => flow.push({ kind: 'question', q, index }))
      return flow
    }
    let sectionIndex = 0
    let globalIndex = 0
    const used = new Set()
    SECTION_ORDER.forEach((type) => {
      const items = questions.filter((q) => q.type === type)
      if (!items.length) return
      items.forEach((q) => used.add(q.id))
      const score = items.reduce((sum, q) => sum + questionScore(q), 0)
      flow.push({
        kind: 'section',
        label: `${CN_NUM[sectionIndex]}、${SECTION_LABEL[type]}`,
        note: `共 ${items.length} 题，共 ${score} 分`,
      })
      sectionIndex += 1
      items.forEach((q) => {
        flow.push({ kind: 'question', q, index: globalIndex })
        globalIndex += 1
      })
    })
    const rest = questions.filter((q) => !used.has(q.id))
    if (rest.length) {
      const score = rest.reduce((sum, q) => sum + questionScore(q), 0)
      flow.push({ kind: 'section', label: `${CN_NUM[sectionIndex]}、其他题目`, note: `共 ${rest.length} 题，共 ${score} 分` })
      rest.forEach((q) => {
        flow.push({ kind: 'question', q, index: globalIndex })
        globalIndex += 1
      })
    }
    return flow
  }

  function paginateFlow(flow) {
    const limit = 5.2
    const pages = []
    let current = []
    let cost = 0
    flow.forEach((item) => {
      const weight = item.kind === 'section' ? 0.6 : item.q.figure ? 1.4 : 1
      if (cost + weight > limit && current.length) {
        pages.push(current)
        current = []
        cost = 0
      }
      current.push(item)
      cost += weight
    })
    if (current.length) pages.push(current)
    if (!pages.length) pages.push([])
    return pages
  }

  function wordPageMarkup(items, pageIndex, pageCount) {
    const minutes = estimateMinutes()
    const header =
      pageIndex === 0
        ? `<header class="practice-word-header"><p class="practice-word-meta">姓名：<u></u>　班级：<u></u>　学号：<u></u>　建议用时：${minutes} 分钟　满分：${totalScore()} 分</p><h1>${esc(paper.docTitle)}</h1></header>`
        : `<header class="practice-word-header practice-word-header--sub"><div class="practice-word-school">${esc(
            paper.docTitle
          )}（续）</div></header>`
    const body = items
      .map((item) =>
        item.kind === 'section'
          ? `<div class="practice-word-section"><b>${esc(item.label)}</b><span>${esc(item.note)}</span></div>`
          : wordQuestionMarkup(item.q, item.index)
      )
      .join('')
    return `<article class="practice-word-page"><div class="practice-word-page-inner">${header}<div class="practice-word-body">${body}</div></div></article>`
  }

  function emptyWordMarkup() {
    return `<article class="practice-word-page practice-word-page--empty"><div class="practice-word-page-inner"><div class="practice-word-empty"><p>题单将在这里显示</p></div></div></article>`
  }

  function wordDocumentMarkup() {
    if (!questions.length) return `<div class="practice-word-stack">${emptyWordMarkup()}</div>`
    const pages = paginateFlow(documentFlow())
    return `<div class="practice-word-stack">${pages
      .map((items, index) => wordPageMarkup(items, index, pages.length))
      .join('')}</div>`
  }

  function practiceSheetMarkup() {
    const minutes = estimateMinutes()
    const score = totalScore()
    const isEmpty = !questions.length
    const body =
      sheetView === 'word'
        ? `<div class="practice-word-scroll">${wordDocumentMarkup()}</div>`
        : `<div class="practice-card-list" id="practiceCardList">${questionCardsMarkup()}</div>`
    const toolbar = isEmpty
      ? ''
      : `<div class="practice-sheet-toolbar"><span class="practice-sheet-meta">${questions.length}题 · ${score}分 · 约${minutes}分钟</span><button class="practice-tool-button" data-open-workbench-edit title="进入飞象题库编辑"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/></svg><b>编辑</b></button><button class="practice-tool-button" data-export-student title="下载"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m-4-4 4 4 4-4M5 19h14"/></svg><b>下载</b></button></div>`
    return `<div class="practice-sheet-shell${isEmpty ? ' practice-sheet-shell--empty' : ''}">${toolbar}${body}</div>`
  }

  function coursewareMarkup() {
    const slides = [1, 2]
    return `<div class="practice-courseware-shell"><div class="slide-thumbs">${slides
      .map(
        (n) =>
          `<button class="slide-thumb ${n === activeSlide ? 'active' : ''}" data-practice-slide="${n}"><img src="./assets/previews/courseware/slide-${n}.png" alt="第 ${n} 页"></button>`
      )
      .join('')}</div><div><div class="slide-canvas"><img src="./assets/previews/courseware/slide-${activeSlide}.png" alt="课件第 ${activeSlide} 页"></div><div class="practice-courseware-meta"><span>40 分钟互动课件</span><span>观察 · 推理 · 计算</span><span>人教版五下 · 第三单元</span></div></div></div>`
  }

  function dashboardMarkup() {
    const submitted = 28
    const total = 36
    const accuracy = '71%'
    const q3Rate = '43%'
    return `<div class="practice-dashboard-shell"><div class="practice-kpi-row"><article class="practice-kpi"><b>${submitted}/${total}</b><span>已提交</span></article><article class="practice-kpi"><b>${accuracy}</b><span>整体正确率</span></article><article class="practice-kpi"><b class="warn">${q3Rate}</b><span>第 3 题正确率</span></article><article class="practice-kpi"><b>A. 2</b><span>高频错选项</span></article></div><table class="practice-table"><thead><tr><th>学生</th><th>第 3 题作答</th><th>判断</th></tr></thead><tbody>${studentStats
      .map(
        (row) =>
          `<tr><td>${esc(row.name)}</td><td>${esc(row.q3)}</td><td class="${row.ok ? 'good' : 'warn'}">${row.ok ? '正确' : '错误'}</td></tr>`
      )
      .join('')}<tr><td colspan="3" class="warn">还有 ${total - submitted} 人未提交 · 不依赖班级花名册，链接即班级</td></tr></tbody></table><div class="practice-dash-actions"><button class="primary" data-retry-wrong>按错题再出一份</button><button data-export-excel>导出 Excel</button><button data-back-sheet>返回题单</button></div></div>`
  }

  function renderPreviewKind(kind, previewBody) {
    if (kind === 'practice-courseware') {
      previewBody.innerHTML = coursewareMarkup()
      previewBody.querySelectorAll('[data-practice-slide]').forEach((button) => {
        button.addEventListener('click', () => {
          activeSlide = Number(button.dataset.practiceSlide)
          renderPreviewKind('practice-courseware', previewBody)
        })
      })
      return
    }
    if (kind === 'practice-sheet') {
      previewBody.innerHTML = practiceSheetMarkup()
      previewBody.classList.add('practice-preview')
      bindSheetActions(previewBody)
      return
    }
    if (kind === 'practice-dashboard') {
      previewBody.innerHTML = dashboardMarkup()
      bindDashboardActions(previewBody)
    }
  }

  function bindQuestionAction(id, action) {
    const q = questions.find((item) => item.id === id)
    if (!q) return
    const index = questionIndexById(id)
    if (action === 'replace') {
      if (id === 6) {
        Object.assign(q, cloneBankQuestion(5, id))
        q.tag = '中等'
        q.tagClass = ''
      } else if (id === 2) {
        q.title = '一个长方体的棱长之和是 240 cm，相交于一个顶点的三条棱的长度和是（　）。'
        q.options = ['A. 60 cm', 'B. 40 cm', 'C. 120 cm', 'D. 80 cm']
        q.tag = '中等'
      } else {
        q.title = q.title.replace(/\d+/g, (n) => String(Number(n) + 1))
      }
      syncSheet(null, id)
      recordPanelAction('replace', { id, q, index })
      return
    }
    if (action === 'adapt') {
      setSelectedQuestion(id)
      showComposerQuickChips('adapt')
      deps.composerInput.placeholder = '描述你想怎么改编这道题'
      deps.composerInput.value = ''
      deps.composerInput.focus()
      deps.sendButton?.classList.remove('ready')
      recordPanelAction('adapt-prompt', { id, q, index })
      return
    }
    if (action === 'edit') {
      sheetView = 'edit'
      setSelectedQuestion(id)
      showComposerQuickChips('adapt')
      deps.composerInput.placeholder = '描述你想怎么改编这道题'
      recordPanelAction('adapt-prompt', { id, q, index })
      return
    }
    if (action === 'remove') {
      const removed = { ...q }
      questions = questions.filter((item) => item.id !== id)
      if (selectedQuestionId === id) setSelectedQuestion(null)
      deps.renderPracticePreview('practice-sheet')
      recordPanelAction('remove', { id, q: removed, index })
    }
  }

  function bindSheetActions(root) {
    const addWrap = root.querySelector('.practice-sheet-add')
    root.querySelector('[data-open-workbench-edit]')?.addEventListener('click', () => {
      const draftId = `draft-ai-record-${Date.now()}`
      const now = Date.now()
      const draft = {
        id: draftId,
        title: paper?.title || paper?.docTitle || 'AI录题试卷',
        subject: '五年级 · 数学',
        curriculumKey: '小学数学',
        source: 'ai-record-edit',
        createdAt: now,
        updatedAt: now,
        questions: questions.map((question, index) => ({
          id: `sheet-ai-record-${now}-${index + 1}`,
          sourceId: `ai-record-${question.bankId || question.id || index + 1}`,
          status: 'confirmed',
          source: 'ai-record',
          curriculum: '小学数学',
          hasAnswer: Boolean(question.answer || question.analysis),
          type: question.type?.endsWith('题') ? question.type : `${question.type || '解答'}题`,
          knowledge: question.knowledge || '综合应用',
          difficulty: question.tag === '基础' ? '较易' : question.tag === '易错' ? '提高' : '中等',
          score: Number(question.score || (question.type === '解答' ? 3 : 2)),
          text: question.title || question.text || '',
          options: question.options ? [...question.options] : undefined,
          answer: question.answer || '',
          analysis: question.analysis || '',
        })),
      }
      try {
        const storageKey = 'feixiang-question-workbench-v3-drafts'
        const drafts = JSON.parse(localStorage.getItem(storageKey) || '[]').filter((item) => item.id !== draftId)
        drafts.unshift(draft)
        localStorage.setItem(storageKey, JSON.stringify(drafts.slice(0, 20)))
        localStorage.setItem('feixiang-question-workbench-v3-active-draft', draftId)
        sessionStorage.setItem(`feixiang-question-workbench-v3-ai-handoff:${draftId}`, JSON.stringify({
          title: draft.title,
          prompt: examPrompt,
          createdAt: '刚刚',
          plan: {
            count: draft.questions.length,
            types: '选择、填空、计算、解答',
            difficulty: '基础为主，难度递进',
            knowledge: '五年级上学期数学核心知识点',
            minutes: estimateMinutes(),
          },
        }))
      } catch { /* 页面仍可跳转，由工作台创建空白草稿兜底 */ }
      window.location.href = `./workbench.html?draft=${encodeURIComponent(draftId)}&source=ai-compose`
    })
    root.querySelector('[data-sheet-add-toggle]')?.addEventListener('click', (event) => {
      event.stopPropagation()
      closeAddMenus(root)
      addWrap?.classList.toggle('open')
    })
    root.querySelectorAll('[data-sheet-add]').forEach((button) =>
      button.addEventListener('click', (event) => {
        event.stopPropagation()
        addWrap?.classList.remove('open')
        beginAddQuestions(null, button.dataset.sheetAdd)
      })
    )
    root.querySelectorAll('[data-q-add-toggle]').forEach((button) =>
      button.addEventListener('click', (event) => {
        event.stopPropagation()
        const wrap = button.closest('.practice-q-add-wrap')
        closeAddMenus(root)
        wrap?.classList.toggle('open')
      })
    )
    root.querySelectorAll('[data-q-add]').forEach((button) =>
      button.addEventListener('click', (event) => {
        event.stopPropagation()
        closeAddMenus(root)
        beginAddQuestions(Number(button.dataset.afterId), button.dataset.qAdd)
      })
    )
    root.querySelector('[data-empty-pick-bank]')?.addEventListener('click', () => beginAddQuestions(null, 'bank'))
    root.querySelector('[data-edit-doc-title]')?.addEventListener('blur', (event) => {
      paper.docTitle = event.target.textContent.trim() || paper.docTitle
      paper.title = paper.docTitle
      paper.fileName = paper.docTitle
      useSheetFile()
      toast('标题已更新')
    })
    root.querySelectorAll('.practice-word-q').forEach((questionNode) => {
      const q = questions.find((item) => item.id === Number(questionNode.dataset.qid))
      if (!q) return
      questionNode.addEventListener('click', (event) => {
        if (event.target.closest('button, [contenteditable], .practice-word-actions, .practice-q-add-menu')) return
        setSelectedQuestion(q.id)
      })
      questionNode.querySelector('[data-direct-title]')?.addEventListener('blur', (event) => {
        q.title = event.target.textContent.trim() || q.title
        recordPanelAction('edit-title', { id: q.id, q, index: questionIndexById(q.id) })
      })
      questionNode.querySelectorAll('[data-direct-option]').forEach((option) =>
        option.addEventListener('blur', (event) => {
          q.options[Number(option.dataset.directOption)] = event.target.textContent.trim()
          toast('选项已自动保存')
        })
      )
      questionNode.addEventListener('dragstart', (event) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', String(q.id))
        questionNode.classList.add('dragging')
      })
      questionNode.addEventListener('dragend', () => questionNode.classList.remove('dragging'))
      questionNode.addEventListener('dragover', (event) => {
        event.preventDefault()
        questionNode.classList.add('drag-over')
      })
      questionNode.addEventListener('dragleave', () => questionNode.classList.remove('drag-over'))
      questionNode.addEventListener('drop', (event) => {
        event.preventDefault()
        questionNode.classList.remove('drag-over')
        const sourceId = Number(event.dataTransfer.getData('text/plain'))
        const sourceIndex = questions.findIndex((item) => item.id === sourceId)
        const targetIndex = questions.findIndex((item) => item.id === q.id)
        if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return
        const [moved] = questions.splice(sourceIndex, 1)
        questions.splice(targetIndex, 0, moved)
        renderPreviewKind('practice-sheet', root)
        recordPanelAction('reorder')
      })
    })
    root.querySelector('[data-save-knowledge]')?.addEventListener('click', () => {
      markSaved()
      toast('已保存到「我的知识库 / 练习与试卷」')
      appendAssistant('<b>已保存到知识库</b><p>这份练习已进入「我的知识库 / 练习与试卷」，可随时复用或继续编辑。</p>')
      renderPreviewKind('practice-sheet', root)
    })
    root.querySelector('[data-export-student]')?.addEventListener('click', () => {
      toast('已下载 Word（演示）')
      appendAssistant('<b>已开始下载</b><p>Word 学生版正在导出（演示）。如需答案解析，也可以直接告诉我。</p>')
    })
    ;['replace', 'adapt', 'remove'].forEach((action) => {
      root.querySelectorAll(`[data-${action}]`).forEach((button) => {
        button.addEventListener('click', (event) => {
          event.stopPropagation()
          bindQuestionAction(Number(button.dataset[action]), action)
        })
      })
    })
  }

  function bindDashboardActions(root) {
    root.querySelector('[data-export-excel]')?.addEventListener('click', () => toast('已导出 Excel（演示）'))
    root.querySelector('[data-back-sheet]')?.addEventListener('click', () => deps.openPreview('practiceSheet'))
    root.querySelector('[data-retry-wrong]')?.addEventListener('click', () => {
      paper = PAPERS.practice
      useSheetFile()
      questions = [
        cloneBankQuestion(6, 31),
        cloneBankQuestion(8, 32),
        cloneBankQuestion(9, 33),
      ].filter(Boolean)
      sheetView = 'word'
      saved = false
      delivered = false
      deps.openPreview('practiceSheet')
      syncSheet('已按第 3 题（棱与面的关系）错题，从题目资源重组 3 题巩固卷。', 31)
      showSourceRow()
    })
  }

  function appendAssistant(html) {
    deps.messageColumn.insertAdjacentHTML(
      'beforeend',
      `<div class="assistant-message compact"><span class="assistant-mark">象</span><div>${html}</div></div>`
    )
    deps.scrollToBottom()
  }

  function appendUser(text) {
    deps.messageColumn.insertAdjacentHTML('beforeend', `<div class="user-message">${esc(text)}</div>`)
    deps.scrollToBottom()
  }

  function bindAddQuestionMenu() {
    const wrap = document.getElementById('practiceSourceRow')
    if (!wrap || wrap.dataset.bound) return
    wrap.dataset.bound = 'true'
    const trigger = wrap.querySelector('[data-toggle-add-menu]')
    const menu = wrap.querySelector('.practice-add-menu')
    const closeMenu = () => {
      wrap.classList.remove('open')
      trigger?.setAttribute('aria-expanded', 'false')
    }
    const openMenu = () => {
      wrap.classList.add('open')
      trigger?.setAttribute('aria-expanded', 'true')
    }

    trigger?.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (wrap.classList.contains('open')) closeMenu()
      else openMenu()
    })

    menu?.addEventListener('click', (event) => {
      event.stopPropagation()
    })

    wrap.querySelector('[data-practice-bank]')?.addEventListener('click', () => {
      closeMenu()
      deps.openQuestionPicker('sheet')
    })
    wrap.querySelector('[data-practice-upload]')?.addEventListener('click', () => {
      closeMenu()
      promptLocalUpload()
    })
    wrap.querySelector('[data-practice-knowledge]')?.addEventListener('click', () => {
      closeMenu()
      toast('已从知识库引用同单元题目')
      const item = cloneBankQuestion(paper.id === 'exam' ? 109 : 7, Date.now() + 1)
      if (!item) return
      item.tag = '引用'
      questions.push(item)
      syncSheet('已从「我的知识库」引用 1 道同类题并加入题单。', item.id)
    })
    wrap.querySelector('[data-practice-ai]')?.addEventListener('click', () => {
      closeMenu()
      const id = Date.now() + 2
      questions.push(
        paper.id === 'exam'
          ? {
              id,
              title:
                '（AI 生成）学校用一块长 9.6 m、宽 4.5 m 的空地铺草坪，每平方米草坪 28 元。铺满这块空地一共需要多少元？',
              type: '解答',
              tag: 'AI生成',
              tagClass: 'tag-easy',
              knowledge: '小数乘法解决实际问题',
              minutes: 5,
              source: 'AI 生成 · 同考点新题',
              score: 6,
            }
          : {
              id,
              title: '（AI 生成）用 12 个棱长 1 cm 的小正方体拼成长方体，表面积最小是多少 cm²？',
              type: '解答',
              tag: 'AI生成',
              tagClass: 'tag-easy',
              knowledge: '表面积应用',
              minutes: 3,
              source: 'AI 生成',
              score: 6,
            }
      )
      syncSheet('已按当前题单的知识点 AI 生成 1 道新题，并加入题单。', id)
    })

    if (!document.documentElement.dataset.practiceAddMenuBound) {
      document.documentElement.dataset.practiceAddMenuBound = 'true'
      const closeAll = () => {
        document.querySelectorAll('.practice-add-wrap.open').forEach((node) => {
          node.classList.remove('open')
          node.querySelector('[data-toggle-add-menu]')?.setAttribute('aria-expanded', 'false')
        })
      }
      document.addEventListener('click', closeAll)
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeAll()
      })
    }
  }

  function showSourceRow() {
    return
    if (document.getElementById('practiceSourceRow')) return
    deps.messageColumn.insertAdjacentHTML(
      'beforeend',
      `<div class="practice-add-wrap" id="practiceSourceRow"><button type="button" class="practice-add-trigger" data-toggle-add-menu aria-expanded="false" aria-haspopup="menu">＋ 添加题目</button><div class="practice-add-menu" role="menu"><button type="button" role="menuitem" data-practice-bank>从题目资源选择</button><button type="button" role="menuitem" data-practice-upload>上传本地试卷</button><button type="button" role="menuitem" data-practice-knowledge>从我的知识库引用</button><button type="button" role="menuitem" data-practice-ai>AI 生成新题</button></div></div>`
    )
    bindAddQuestionMenu()
    deps.scrollToBottom()
  }

  function showChatHint() {
    if (document.getElementById('practiceChatHint')) return
    deps.messageColumn.insertAdjacentHTML(
      'beforeend',
      `<div class="chat-hint" id="practiceChatHint"><b>左侧对话会直接改右侧题单：</b>试试说「第 3 题太难了，换一道」「再加两道表面积易错题」「整份控制在 15 分钟」「选择题减少一道」「全部改成基础难度」。</div>`
    )
    deps.scrollToBottom()
  }

  function startSheetSession({ title, userText, assistantHtml, emptyHints = false, skipPreview = false } = {}) {
    document.body.classList.add('composition-mode')
    deps.setActiveTask('question-composition')
    deps.conversationView.classList.remove('home-screen')
    hideComposerQuickChips()
    deps.taskHeader.querySelector('h1').textContent = title || '组题 · 未命名练习'
    deps.taskHeader.querySelector(':scope > div > span').textContent = 'demo演示 · 左侧记录过程，右侧直接改题'
    deps.replayButton.hidden = true
    if (!deps.skillRow?.querySelector('[data-context="组题"]')) deps.addContext('组题')
    deps.composerInput.placeholder = emptyHints
      ? '例如：帮我出一份西城区五上数学期末卷；或描述你想加的题'
      : '例如：第 3 题太难了换一道；再加两道易错题'
    if (userText) {
      deps.messageColumn.insertAdjacentHTML(
        'beforeend',
        `<div class="user-message">${esc(userText)}</div><div class="assistant-message"><span class="assistant-mark">象</span><div>${assistantHtml || '<b>题单已就绪</b><p>右侧可直接编辑；你说的话和右侧操作都会留在这条对话里。</p>'}</div></div>`
      )
    } else if (assistantHtml) {
      appendAssistant(assistantHtml)
    }
    paperActive = true
    showComposerQuickChips(emptyHints)
    if (!emptyHints && !skipPreview) deps.openPreview('practiceSheet')
    deps.scrollToBottom()
  }

  function startComposeWithAttachments({ text = '', selection = [], fileName = '', contextFile = null } = {}) {
    // 带着课件/教案上下文来的，接着当前任务往下做，不另起一段对话。
    if (contextFile) {
      buildPracticeFromContext({ text, selection, contextFile })
      return
    }

    const onDetail = !deps.conversationView.classList.contains('home-screen')

    if (onDetail && (paperActive || composeEntryMode)) {
      if (selection.length) {
        startSheetFromPicker({ selection, count: selection.length })
        if (text) {
          if (!handleComposer(text)) appendUser(text)
        }
        deps.scrollToBottom()
        return
      }
      if (fileName) {
        if (composeEntryMode) composeEntryMode = false
        processLocalUpload(fileName)
        if (text) appendUser(text)
        return
      }
    }

    deps.stopPlayback?.()
    clearCoursewareTimer()
    clearComposeTimer()
    document.body.classList.add('composition-mode')
    deps.setActiveTask('question-composition')
    deps.conversationView.classList.remove('home-screen')
    deps.replayButton.hidden = true
    hideComposerQuickChips()
    if (!deps.skillRow?.querySelector('[data-context="组题"]')) deps.addContext('组题')

    if (selection.length) {
      deps.messageColumn.innerHTML = ''
      startSheetFromPicker({ selection, count: selection.length })
      if (text) appendUser(text)
      showComposerQuickChips()
      deps.scrollToBottom()
      return
    }

    if (fileName) {
      deps.messageColumn.innerHTML = ''
      paper = { ...PAPERS.blank }
      useSheetFile()
      questions = []
      saved = false
      delivered = false
      selectedQuestionId = null
      sheetView = 'word'
      composeEntryMode = false
      paperActive = true
      document.body.classList.add('composition-mode')
      deps.setActiveTask('question-composition')
      deps.conversationView.classList.remove('home-screen')
      deps.taskHeader.querySelector('h1').textContent = '组题 · 未命名练习'
      deps.taskHeader.querySelector(':scope > div > span').textContent = 'demo演示 · 左侧记录过程，右侧直接改题'
      deps.replayButton.hidden = true
      deps.resetPreview()
      showComposerQuickChips()
      processLocalUpload(fileName)
      if (text) appendUser(text)
      return
    }
  }

  function startComposeEntry(fromComposer = false) {
    if (composeEntryMode) return
    deps.stopPlayback?.()
    clearCoursewareTimer()
    clearComposeTimer()
    paper = { ...PAPERS.blank }
    useSheetFile()
    questions = []
    saved = false
    delivered = false
    selectedQuestionId = null
    sheetView = 'word'
    composeEntryMode = true
    paperActive = true
    document.body.classList.add('composition-mode')
    deps.setActiveTask('question-composition')
    deps.conversationView.classList.remove('home-screen')
    deps.taskHeader.querySelector('h1').textContent = '组题'
    deps.taskHeader.querySelector(':scope > div > span').textContent = 'demo演示 · 左侧选方式或对话，题单生成后在右侧编辑'
    deps.replayButton.hidden = true
    hideComposerQuickChips()
    if (!deps.skillRow?.querySelector('[data-context="组题"]')) deps.addContext('组题')
    enterAiComposeWorkspace()
    deps.resetPreview()
    deps.composerInput.placeholder = '例如：帮我出一份西城区五上数学期末卷；或描述你想加的题'
    deps.messageColumn.innerHTML = ''
    appendAssistant(composeEntryAssistantHtml())
    bindComposeEntryActions()
    deps.scrollToBottom()
  }

  function startEmptySheet(fromComposer = false) {
    startComposeEntry(fromComposer)
  }

  function startSheetFromPicker(payload) {
    const selection = Array.isArray(payload?.selection) ? payload.selection : Array.isArray(payload) ? payload : []
    const count = selection.length || Number(payload?.count ?? payload) || 0
    if (!count) return

    const idBase = Date.now()
    const pickedQuestions = resolveSheetQuestionsFromPicker(selection, count, idBase)
    const userText = buildPickerUserMessageFromQuestions(pickedQuestions)
    const assistantHtml = buildPickerAssistantHtmlFromQuestions(pickedQuestions)

    const fromEntry = composeEntryMode
    const creating = fromEntry || !paperActive

    if (fromEntry) {
      composeEntryMode = false
      appendUser(userText)
      appendAssistant(assistantHtml)
    } else if (creating) {
      paper = { ...PAPERS.blank }
      useSheetFile()
      questions = []
      saved = false
      delivered = false
      selectedQuestionId = null
      sheetView = 'word'
      deps.resetPreview()
      deps.messageColumn.innerHTML = ''
      startSheetSession({
        title: '组题 · 未命名练习',
        userText,
        assistantHtml,
        skipPreview: true,
      })
    } else {
      appendUser(userText)
      appendAssistant(assistantHtml)
    }

    const { list, placement } = insertQuestions(pickedQuestions)
    revealSheetPreview()
    deps.taskHeader.querySelector('h1').textContent = '组题 · 未命名练习'
    const suggestions = buildPickerAdjustmentSuggestions(pickedQuestions)
    deps.composerInput.placeholder = suggestions.length
      ? `例如：${suggestions.join('；')}`
      : '例如：第 3 题太难了换一道；再加两道易错题'
    if (list[0]) syncSheet(null, list[0].id)
    deps.scrollToBottom()
  }

  function showDeliverCard() {
    if (document.getElementById('practiceDeliverCard')) return
    deps.messageColumn.insertAdjacentHTML(
      'beforeend',
      `<section class="practice-deliver-card" id="practiceDeliverCard"><h3>学生链接与教师看板已生成</h3><p>复制链接或投屏二维码发给学生。学生自填姓名即可作答，不需要班级花名册。</p><div class="practice-link-box"><input readonly value="https://fx-practice.demo/5b-unit3-practice-a1b2"><button data-copy-link>复制链接</button><button class="primary" data-open-dashboard-chat>查看回收看板</button></div><div class="practice-qr"><div class="practice-qr-box" aria-hidden="true"></div><small>学生扫码即可作答<br>客观题提交后即时判分</small></div></section>`
    )
    document.querySelector('[data-copy-link]')?.addEventListener('click', () => toast('链接已复制'))
    document.querySelector('[data-open-dashboard-chat]')?.addEventListener('click', () => deps.openPreview('practiceDash'))
    deps.scrollToBottom()
  }

  /* ---------------- 我的题单：列表页，替代原来的空白工作台 ---------------- */

  function paperListMarkup() {
    const sourceCards = [
      ['AI 直接生成', '说一句话，AI 检索题库并按细目表命题', 'ai'],
      ['从题目资源选择', '100 万+ 已校验题目，按知识点筛选', 'bank'],
      ['上传本地试卷', '拆出题目，或按同考点重组新卷', 'upload'],
      ['从我的知识库引用', '复用自己沉淀过的题目和试卷', 'knowledge'],
    ]
    return `<div class="paper-list-page">
      <section class="paper-list-hero">
        <h2>我的题单</h2>
        <p>飞象的每一份教学成果，都可以一键长出一份配套题单。教学动画生成观看任务单，互动课件生成课后练习，教案生成课堂检测，本地试卷生成同考点新卷。</p>
      </section>
      <section class="paper-new">
        <h3>新建一份题单</h3>
        <form class="paper-new-input" id="paperNewForm">
          <input id="paperNewInput" placeholder="例如：帮我出一份北京市西城区小学数学5年级上期末考试试卷" autocomplete="off">
          <button type="submit" disabled>生成</button>
        </form>
        <div class="paper-new-sources">${sourceCards
          .map(
            (item) =>
              `<button type="button" class="paper-source-card" data-paper-source="${item[2]}"><b>${item[0]}</b><small>${item[1]}</small></button>`
          )
          .join('')}</div>
        <p class="paper-new-note">也可以在任何一份教学成果（课件、教案、动画）下面点「组一份配套练习」，这份成果会作为组题依据带进来。</p>
      </section>
      <section class="paper-history">
        <h3>历史题单</h3>
        <div class="paper-history-list">${paperHistory
          .map(
            (item) =>
              `<button type="button" class="paper-history-card" data-paper-open="${item.id}"><span class="paper-history-mark">练</span><span class="paper-history-copy"><b>${esc(
                item.title
              )}</b><small>${esc(item.meta)}</small><em>${esc(item.origin)}</em></span><span class="paper-history-meta"><i>${esc(
                item.status
              )}</i><small>${esc(item.time)}</small></span></button>`
          )
          .join('')}</div>
      </section>
    </div>`
  }

  function showPaperList() {
    deps.stopPlayback()
    clearCoursewareTimer()
    clearComposeTimer()
    paperActive = false
    deps.setActiveTask('question-composition')
    deps.conversationView.classList.remove('home-screen')
    deps.taskHeader.querySelector('h1').textContent = '我的题单'
    deps.taskHeader.querySelector(':scope > div > span').textContent = 'demo演示 · 题单是对话的产物，不是独立工作台'
    deps.replayButton.hidden = true
    deps.resetPreview()
    deps.clearComposerContext?.()
    deps.composerInput.value = ''
    deps.composerInput.placeholder = '描述你要出的题单，例如：帮我出一份西城区五上数学期末卷'
    deps.messageColumn.innerHTML = paperListMarkup()

    const form = document.getElementById('paperNewForm')
    const paperInput = document.getElementById('paperNewInput')
    const paperSubmit = form?.querySelector('button[type="submit"]')
    const syncPaperSubmit = () => {
      if (paperSubmit) paperSubmit.disabled = !(paperInput?.value || '').trim()
    }
    paperInput?.addEventListener('input', syncPaperSubmit)
    syncPaperSubmit()
    form?.addEventListener('submit', (event) => {
      event.preventDefault()
      const value = (paperInput?.value || '').trim()
      if (!value) return
      startPaperComposition(value)
    })
    deps.messageColumn.querySelectorAll('[data-paper-source]').forEach((button) => {
      button.addEventListener('click', () => {
        const source = button.dataset.paperSource
        if (source === 'ai') {
          document.getElementById('paperNewInput').focus()
          return
        }
        if (source === 'bank') {
          deps.openQuestionPicker('sheet')
          return
        }
        startPaperComposition(
          source === 'upload'
            ? '我上传一份本地试卷，帮我按同样的考点重新出一份新卷'
            : '从我的知识库里挑同单元的题，组一份新的练习'
        )
      })
    })
    deps.messageColumn.querySelectorAll('[data-paper-open]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.paperOpen
        if (id === 'practice') startCoursewareDemo(true, true)
        else startPaperComposition(examPrompt, true)
      })
    })
    deps.scrollToBottom()
  }

  /* ---------------- AI 组题：推理链在对话里，产物是可编辑题单 ---------------- */

  const linkIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.2 1.2M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.2-1.2"/></svg>'

  const composeSteps = [
    {
      title: '命题参数定义与模型构建',
      body: `<p class="compose-kv"><span>场景：</span><span class="compose-inline-edit" contenteditable="true" data-edit-scene>2025-2026学年北京市西城区五年级上学期期末试卷：数学（参考附件风格）</span></p><div class="compose-kv compose-structure-row"><span>题目结构：</span><div class="compose-inline-edit compose-structure-edit" contenteditable="true" data-edit-structure>一、选择题（10题）｜二、填空题（6题）｜三、计算题（2题）｜四、操作题（2题）｜五、解答题（6题）</div><button type="button" data-apply-structure>应用到右侧题单</button></div>`,
    },
    {
      title: '题库检索与初筛',
      body: `<div class="compose-chips">${[
        '2023-2024学年北京市西城区五年级上期末试卷：数学',
        '2025-2026学年北京市西城区五年级上册期末考试：数学',
        '2024-2025学年北京市东城区五年级上册期末考试：数学',
        '《【黄冈小状元作业本】2025-2026学年人教版五年级上册：数学》',
        '《【学习探究诊断】2025-2026学年人教版五年级上册：数学》',
        '《【黄冈小状元达标卷】2024-2025学年人教版五年级上册：数学》',
      ]
        .map((name) => `<span class="compose-chip">${linkIcon}${name}</span>`)
        .join('')}</div>`,
    },
    {
      title: '命题双向细目表',
      body: `<table class="compose-table"><thead><tr><th>题号</th><th>题型</th><th>知识点</th><th>难度</th><th>能力层级</th></tr></thead><tbody>${[
        [1, '选择题', '小数乘法中积的变化规律', '较易', 'II级（理解）'],
        [2, '选择题', '方程的检验', '较易', 'II级（理解）'],
        [3, '选择题', '平行四边形面积公式', '较易', 'III级（应用）'],
        [4, '选择题', '求含有字母的式子的值，平方与平方运算', '较易', 'II级（理解）'],
        [5, '选择题', '判断事件发生的可能性的大小', '较易', 'III级（应用）'],
        [6, '选择题', '数方格法估算图形面积', '较易', 'III级（应用）'],
        [7, '选择题', '小数除法用“进一法”解决实际问题', '较易', 'III级（应用）'],
        [8, '填空题', '逆用三角形面积公式，梯形面积公式', '较易', 'III级（应用）'],
      ]
        .map((row, rowIndex) => `<tr>${row.map((cell, colIndex) => `<td ${colIndex ? `contenteditable="true" data-blueprint-row="${rowIndex}" data-blueprint-col="${colIndex}"` : ''}>${cell}</td>`).join('')}</tr>`)
        .join('')}<tr class="compose-table-more"><td colspan="5">… 其余 18 题细目已生成，可在右侧题单中逐题查看</td></tr></tbody></table>`,
    },
    {
      title: '试题多维校验',
      body: `<table class="compose-table"><thead><tr><th>题号</th><th>选题原因</th></tr></thead><tbody>${[
        [1, '通过算式变形考查小数乘法中积的变化规律，侧重于因数扩大与缩小对积的影响，有利于培养学生的观察与推理能力'],
        [2, '以方程的检验为考查核心，帮助学生掌握将特定数值代入方程进行验证的基本方法，巩固基础概念'],
        [3, '借助直观图形考查平行四边形面积公式的应用，要求学生准确识别对应的底和高，提升空间观念'],
        [4, '考查含有字母式子的求值问题，同时融入了平方运算，有助于学生规范代入与计算的书写格式'],
        [5, '结合生活中的红绿灯实际情境，考查学生对事件发生可能性大小的判断能力，贴近学生生活经验'],
        [6, '采用富有生活气息的古窗图案，考查利用数方格方法估算不规则图形面积的技能，发展几何直观'],
        [7, '以货物运输为实际背景，考查小数除法在实际生活中的应用，重点突出“进一法”的合理性判断'],
      ]
        .map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`)
        .join('')}</tbody></table>`,
    },
    {
      title: '试题结构平衡性复核',
      body: `<p class="compose-kv"><span>难度分布：</span>基础题（20题），中档题（6题）</p><p class="compose-kv"><span>重点知识（节选）：</span>小数乘法中积的变化规律，方程的检验，平行四边形面积公式，求含有字母的式子的值，平方与平方运算，判断事件发生的可能性的大小，数方格法估算图形面积，小数除法用“进一法”解决实际问题，逆用三角形面积公式，梯形面积公式</p><p class="compose-kv"><span>题型分布：</span>选择题（10题），填空题（7题），竖式计算（1题），脱式计算（1题），操作题（1题），解答题（6题）</p>`,
    },
    {
      title: 'AI 试题模拟与质量验收',
      body: `<p><b>命题质量：</b>本卷紧扣课标，涵盖小数乘除法、简易方程、多边形面积等核心板块，素材融入“出入相补”与“园林漏窗”，文化浸润与数学建模并重。</p><p><b>难度梯度：</b>由浅入深，既有基础达标，也有如题目 26 这类分段计费的深度应用。</p><p><b>易错难点：</b>题目 7，易错原因进一法应用，学生易受四舍五入干扰，忽略“全部运完”需向上取整；题目 26，涉及分段计费与“不足 1 kg 按 1 kg 计”的特殊规则，逆向推算时极易漏掉取整环节。</p>`,
    },
  ]

  function composeChainMarkup() {
    return `<div class="compose-chain" id="composeChain">${composeSteps
      .map(
        (step, index) =>
          `<section class="compose-step" data-step="${index}" hidden><button class="compose-step-head" type="button" aria-expanded="true"><span class="compose-step-mark">✓</span><b>${step.title}</b><em>⌃</em></button><div class="compose-step-body">${step.body}</div></section>`
      )
      .join('')}</div>`
  }

  function loadExamPaper() {
    paper = PAPERS.exam
    useSheetFile()
    questions = EXAM_BANK.map((item) => cloneBankQuestion(item.bankId)).filter(Boolean)
    saved = false
    delivered = false
    highlightId = null
    sheetView = 'word'
    paperActive = true
  }

  function enterAiComposeWorkspace() {
    document.body.classList.add('ai-compose-workspace')
    const subtitle = deps.taskHeader.querySelector(':scope > div > span')
    if (subtitle) subtitle.textContent = ''
    let back = document.getElementById('aiComposeBackButton')
    if (!back) {
      back = document.createElement('button')
      back.id = 'aiComposeBackButton'
      back.className = 'ai-compose-back'
      back.type = 'button'
      back.setAttribute('aria-label', '返回')
      back.innerHTML = '<span aria-hidden="true">←</span> 返回'
      back.addEventListener('click', () => deps.showBlankTask?.())
      deps.taskHeader.prepend(back)
    }
  }

  function startPaperComposition(text, instant = false) {
    deps.stopPlayback()
    clearCoursewareTimer()
    clearComposeTimer()
    composeEntryMode = false
    document.body.classList.add('composition-mode')
    deps.setActiveTask('question-composition')
    deps.conversationView.classList.remove('home-screen')
    deps.taskHeader.querySelector('h1').textContent = '组题 · 西城区五上数学期末卷'
    deps.taskHeader.querySelector(':scope > div > span').textContent = 'demo演示 · 推理过程在对话里，题单在右侧可编辑'
    deps.replayButton.hidden = true
    deps.resetPreview()
    deps.clearComposerContext?.()
    deps.addContext('组题')
    enterAiComposeWorkspace()

    loadExamPaper()

    const lead = `<div class="assistant-message"><span class="assistant-mark">象</span><div><b>正在按西城区五上期末卷的结构命题</b><p>我会先定义命题参数，再检索题库、生成双向细目表，逐题校验后交付一份可编辑的题单。</p></div></div>`
    deps.messageColumn.innerHTML = `<div class="user-message">${esc(text || examPrompt)}</div>${lead}${composeChainMarkup()}<div id="composeOutput"></div>`

    const chain = document.getElementById('composeChain')
    chain.addEventListener('click', (event) => {
      const head = event.target.closest('.compose-step-head')
      if (!head) return
      const step = head.parentElement
      const open = step.classList.toggle('collapsed')
      head.setAttribute('aria-expanded', String(!open))
    })
    chain.addEventListener('blur', (event) => {
      const cell = event.target.closest('[data-blueprint-row]')
      if (!cell) return
      const q = questions[Number(cell.dataset.blueprintRow)]
      if (!q) return
      const value = cell.textContent.trim()
      const col = Number(cell.dataset.blueprintCol)
      if (col === 1) q.type = value.replace(/题$/, '')
      if (col === 2) q.knowledge = value
      if (col === 3) { q.tag = value; q.tagClass = value.includes('易') ? 'tag-easy' : value.includes('难') ? 'tag-hard' : '' }
      deps.renderPracticePreview('practice-sheet')
      toast(`第 ${Number(cell.dataset.blueprintRow) + 1} 题细目已更新`)
    }, true)
    chain.querySelector('[data-apply-structure]')?.addEventListener('click', () => {
      const structure = chain.querySelector('[data-edit-structure]')?.textContent.trim() || ''
      const requested = [...structure.matchAll(/（(\d+)题）/g)].reduce((sum, match) => sum + Number(match[1]), 0)
      if (requested && requested < questions.length) questions = questions.slice(0, requested)
      while (requested && questions.length < requested) {
        const source = EXAM_BANK[questions.length % EXAM_BANK.length]
        questions.push(cloneBankQuestion(source.bankId, Date.now() + questions.length))
      }
      deps.renderPracticePreview('practice-sheet')
      toast(requested ? `题目结构已应用，共 ${requested} 题` : '题目结构已保存')
    })

    const steps = [...chain.querySelectorAll('.compose-step')]
    const finish = () => {
      const output = document.getElementById('composeOutput')
      if (!output) return
      output.innerHTML = `<div class="assistant-message courseware-finish visible" id="examResult"><span class="assistant-mark">象</span><div><p><b>试卷已生成，右侧可直接编辑</b></p><ul class="courseware-bullets"><li>AI 已结合你的要求、题目资源和已有资料完成编排。</li><li>右侧题目可直接修改、拖动排序，并支持换题、AI 改编和删除。</li><li>确认后可以下载完整题单。</li></ul><div class="courseware-artifact-row"><button type="button" class="courseware-file-trigger" data-file="practiceSheet"><span class="file-mark word">练</span><span class="courseware-file-copy"><b>北京市西城区五年级上学期数学期末试卷</b></span></button><div class="courseware-artifact-actions"><button type="button" class="courseware-action ghost" data-view-sheet>查看</button><button type="button" class="courseware-action ghost" data-export-sheet>下载</button></div></div><p class="courseware-result-note">任务历史会保留本次生成和修改过程。</p></div></div>`
      output.querySelector('[data-file]')?.addEventListener('click', () => deps.openPreview('practiceSheet'))
      output.querySelector('[data-view-sheet]')?.addEventListener('click', () => deps.openPreview('practiceSheet'))
      output.querySelector('[data-export-sheet]')?.addEventListener('click', () => toast('已下载 Word（演示）'))
      deps.openPreview('practiceSheet')
      showComposerQuickChips()
      deps.composerInput.placeholder = '例如：第 3 题太难了换一道；再加两道易错题；整份控制在 60 分钟'
      deps.scrollToBottom()
    }

    if (instant) {
      steps.forEach((step) => {
        step.hidden = false
      })
      finish()
      return
    }
    let index = 0
    composeTimer = setInterval(() => {
      if (index >= steps.length) {
        clearComposeTimer()
        finish()
        return
      }
      steps[index].hidden = false
      index += 1
      deps.scrollToBottom()
    }, 720)
    deps.scrollToBottom()
  }

  function coursewareNextStepsMarkup() {
    return `<div class="courseware-next-steps"><span class="courseware-next-label">接下来可以</span><button type="button" class="courseware-next-action" data-start-practice><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M4 6h16M4 12h10M4 18h7"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M15 15l5 5M15 21h6v-6"/></svg>组一份配套练习</button></div>`
  }

  // 配套练习本质就是 AI组题，所以这里只负责「带着课件上下文进入组题态」，
  // 具体组多少题、从哪些资料里组，交给老师在输入框里决定。
  function startPracticeFromCourseware() {
    // 课件和题单同属一个任务，两个技能 chip 都保留：组题高亮、互动课件置灰。
    deps.addContext('互动课件')
    deps.addContext('组题')
    deps.setActiveSkillChip?.('组题')
    deps.setPendingContextFile?.(coursewareContextLabel, 'courseware')
    deps.composerInput.value = ''
    deps.composerInput.placeholder = '想配多少题？侧重哪些考点？'
    appendAssistant(
      '<b>好，来组一份配套练习</b><p>已把这份课件作为组题依据放进下方输入框。直接发送我就按课件的知识点组题；也可以先点「＋」从题库选题、引用知识库资料或上传你自己的卷子，再告诉我题量和难度。</p>'
    )
    deps.composerInput.focus()
    deps.scrollToBottom()
  }

  // 老师在组题态发送后，才真正生成配套题单。
  function buildPracticeFromContext({ text = '', selection = [], contextFile = null } = {}) {
    const label = contextFile?.label || coursewareContextLabel
    appendUser(text || `根据《${label}》组一份配套练习`)
    paper = PAPERS.practice
    useSheetFile()
    saved = false
    delivered = false
    highlightId = null
    sheetView = 'word'
    paperActive = true

    const base = initialQuestionIds.map((bankId) => cloneBankQuestion(bankId)).filter(Boolean)
    const picked = selection.length ? resolveSheetQuestionsFromPicker(selection, selection.length, Date.now()) : []
    questions = [...base, ...picked]

    // 两个成果同时在手：题单高亮、课件置灰，随时可切回课件。
    deps.addContext('互动课件')
    deps.addContext('组题')
    deps.setActiveSkillChip?.('组题')
    const sourceNote = picked.length
      ? `<p>已把课件知识点和你选的 ${picked.length} 道题合并成一份题单。</p>`
      : `<p>题目按课件里的面/棱/顶点、棱长总和、表面积三块知识点组的。</p>`
    appendAssistant(
      `<b>已按《${esc(label)}》配好配套练习</b>${sourceNote}<p>右侧现在有「课件.html」和「配套练习」两个标签。当前在改题单；想改课件就点上方「课件.html」标签，或点输入框里置灰的「互动课件」。</p>`
    )
    showComposerQuickChips()
    deps.composerInput.placeholder = '例如：第 3 题太难了换一道；再加两道表面积易错题'
    deps.openPreview('practiceSheet')
    deps.renderPreviewBase?.()
    deps.scrollToBottom()
  }

  // 双成果任务里对课件的追加修改：只更新课件、切回课件预览，题单保持不变。
  function applyCoursewareEdit(text) {
    appendUser(text)
    deps.openPreview('courseware')
    deps.setActiveSkillChip?.('互动课件')
    appendAssistant(
      '<b>已更新互动课件</b><p>已按你的要求调整这份课件（右侧「课件.html」）。配套练习不受影响，点上方「配套练习」标签即可继续改题。</p>'
    )
    deps.scrollToBottom()
  }

  function resolveTargetQuestion(text = '') {
    if (selectedQuestionId) {
      const q = questions.find((item) => item.id === selectedQuestionId)
      if (q) return { q, index: questionIndexById(selectedQuestionId) }
    }
    const match = String(text).match(/第\s*(\d+)\s*题/)
    if (match) {
      const index = Number(match[1])
      const q = questions[index - 1]
      if (q) return { q, index }
    }
    return { q: null, index: 0 }
  }

  function handleComposer(text) {
    if (composeEntryMode) {
      startPaperComposition(text)
      return true
    }
    appendUser(text)
    if (/先.*空|空白题单|建.*空|新建.*题单|开始组题/.test(text)) {
      startComposeEntry(true)
      return true
    }
    const target = resolveTargetQuestion(text)
    if (/换.*3|第\s*3.*难/.test(text) || (target.q && /换|太难/.test(text))) {
      const q = target.q || questions[2]
      if (q) {
        Object.assign(q, cloneBankQuestion(paper.id === 'exam' ? 106 : 5, q.id))
        q.tag = '中等'
        q.tagClass = ''
        syncSheet(
          paper.id === 'exam'
            ? `<b>已替换第 ${target.index || 3} 题</b><p>换成同考点的数方格估算面积题，难度下调。当前 ${sheetSummary()}。</p>`
            : `<b>已替换第 ${target.index || 3} 题</b><p>换成带图框架题，难度下调。当前 ${sheetSummary()}。</p>`,
          q.id
        )
      }
      return true
    }
    if (/加.*(两|2).*易错|易错.*两|表面积.*易错/.test(text)) {
      const pairs = paper.id === 'exam' ? [107, 110] : [8, 9]
      const added = pairs.map((bankId, i) => cloneBankQuestion(bankId, Date.now() + i)).filter(Boolean)
      added.forEach((item) => {
        item.tag = '易错'
        item.tagClass = 'tag-hard'
        questions.push(item)
      })
      syncSheet(
        paper.id === 'exam'
          ? '已追加 2 道易错题：“进一法”货物运输题与分段计费快递题，都命中细目表标注的易错点。'
          : '已追加 2 道表面积易错题：题目资源 #8 蛋糕盒捆扎、#9 蚊帐钢管。',
        added.at(-1)?.id
      )
      return true
    }
    if (/(\d+)\s*分钟|控制在/.test(text)) {
      const target = Number(text.match(/(\d+)\s*分钟/)?.[1] || 15)
      while (questions.length > 1 && estimateMinutes() > target) {
        const index = questions.findIndex((q) => q.type === '解答')
        questions.splice(index >= 0 ? index : questions.length - 1, 1)
      }
      sheetView = 'word'
      syncSheet(
        `已按 ${target} 分钟调整：保留 ${questions.length} 题，总分 ${totalScore()} 分，建议用时 ${estimateMinutes()} 分钟。`,
        questions.at(-1)?.id
      )
      return true
    }
    if (/选择.*少|减少.*选择|选择题减少/.test(text)) {
      const index = questions.findIndex((q) => q.type === '选择')
      if (index >= 0) {
        questions.splice(index, 1)
        syncSheet(`已删除原第 ${index + 1} 道选择题，题单现为 ${questions.length} 题、${totalScore()} 分。`)
        toast(`已移除第 ${index + 1} 题`)
      } else {
        appendAssistant('当前题单里没有选择题可删。')
      }
      return true
    }
    if (/全部.*基础|改成基础|基础难度/.test(text)) {
      questions.forEach((q) => {
        q.tag = '基础'
        q.tagClass = 'tag-easy'
      })
      syncSheet('已将全部题目调整为基础难度，右侧试卷预览已同步更新。', questions[0]?.id)
      return true
    }
    if (/改成填空|改.*填空/.test(text)) {
      const q = questions[0]
      if (q) {
        q.type = '填空'
        q.options = undefined
        q.title =
          paper.id === 'exam'
            ? '42.8 × 1.4 = 59.92，那么 4.28 × 14 = （　），428 × 0.14 = （　）。'
            : '长方体有 ____ 个面，____ 条棱，____ 个顶点。'
        syncSheet('已把第 1 题改成填空题，考点和答案保持不变。', q.id)
      }
      return true
    }
    if (/数字|同构|改编|换数值/.test(text)) {
      const q = target.q || questions[1]
      if (q) {
        if (paper.id === 'exam') {
          q.title = 'x = 12 是下列方程（　）的解。'
          q.options = ['A. 8x = 40', 'B. 70 + 2x = 94', 'C. 5x − 3×2 = 74', 'D. 6x + 0.9 = 4.5']
        } else {
          q.title = '一个长方体的棱长之和是 240 cm，相交于一个顶点的三条棱的长度和是（　）。'
          q.options = ['A. 60 cm', 'B. 40 cm', 'C. 120 cm', 'D. 80 cm']
        }
        q.knowledge += ' · 同构改编'
        q.tag = '改编'
        syncSheet(`<b>已同构改编第 ${questionIndexById(q.id)} 题</b><p>数值更换，考点不变。当前 ${sheetSummary()}。</p>`, q.id)
      }
      return true
    }
    if (/发给学生|布置|链接/.test(text)) {
      markSaved()
      deps.openPreview('practiceSheet')
      appendAssistant('当前组题功能先完成内容创作与下载。我已把这份试卷保存到「我的知识库 / 练习与试卷」，你可以下载后按现有方式使用。')
      return true
    }
    if (/看板|回收|数据/.test(text)) {
      appendAssistant('当前版本不接入班级、作答和回收数据，先专注于组题、编辑、复用与下载。')
      return true
    }
    if (/错题|再出/.test(text)) {
      paper = PAPERS.practice
      useSheetFile()
      questions = [cloneBankQuestion(6, 31), cloneBankQuestion(8, 32), cloneBankQuestion(9, 33)].filter(Boolean)
      sheetView = 'word'
      saved = false
      delivered = false
      deps.openPreview('practiceSheet')
      syncSheet('已按第 3 题错题，从题目资源重组 3 题巩固卷（#6 / #8 / #9）。', 31)
      showSourceRow()
      return true
    }
    if (/AI.*生成|生成.*新题/.test(text)) {
      const id = Date.now()
      questions.push({
        id,
        title:
          paper.id === 'exam'
            ? '（AI 生成）一块梯形菜地，上底 12 m，下底 18 m，高 8 m。每平方米收白菜 4.5 kg，这块地一共可以收白菜多少千克？'
            : '（AI 生成）一个长方体纸盒，去掉上盖后还剩几个面？请说明理由。',
        type: '解答',
        tag: 'AI生成',
        tagClass: 'tag-easy',
        knowledge: paper.id === 'exam' ? '梯形面积应用' : '表面积应用',
        minutes: 5,
        score: 6,
        source: 'AI 生成 · 同考点新题',
      })
      syncSheet('已 AI 生成 1 道新题并加入题单。', id)
      return true
    }
    if (text.includes('题库') || text.includes('加题')) {
      deps.openQuestionPicker('sheet')
      appendAssistant('已打开题目资源选择器。选完题会加入当前题单。')
      return true
    }
    if (/补.*(一道|1|同考点)|同类题/.test(text)) {
      const item = cloneBankQuestion(paper.id === 'exam' ? 108 : 5, Date.now())
      if (item) {
        questions.push(item)
        syncSheet(`<b>已补入 1 道同考点题</b><p>当前 ${sheetSummary()}。</p>`, item.id)
      }
      return true
    }
    appendAssistant('<b>收到</b><p>你可以继续告诉我：换题、加题、改编、调整难度或控制用时；右侧直接改题也会同步记录在这里。</p>')
    return true
  }

  function startCoursewareDemo(instant = false, jumpToPractice = false, requestText = coursewarePrompt, fromNewTask = false) {
    deps.stopPlayback()
    clearCoursewareTimer()
    clearComposeTimer()
    paperActive = false
    deps.setActiveTask(fromNewTask ? 'blank' : 'courseware-demo')
    deps.conversationView.classList.remove('home-screen')
    deps.taskHeader.querySelector('h1').textContent = fromNewTask ? '生成新的互动课件' : '生成小学5年级 正方体和长方体的互动课件'
    deps.taskHeader.querySelector(':scope > div > span').textContent = fromNewTask ? '新任务 · 根据当前输入生成' : 'demo演示 · 基于真实任务还原 · 不调用 API'
    deps.replayButton.hidden = fromNewTask
    deps.resetPreview()
    deps.clearComposerContext?.()
    deps.addContext('互动课件')
    deps.setActiveSkillChip?.('互动课件')
    const topicLabel = fromNewTask ? ((requestText.match(/《([^》]+)》/) || [])[1] || requestText.replace(/[，。].*$/, '').slice(0, 24) || '新课题') : '长方体和正方体的认识'
    coursewareContextLabel = fromNewTask ? `${topicLabel}｜互动课件` : '长方体和正方体的认识｜五年级下册'

    const attachment = fromNewTask ? '' : `<div class="attachment-pill"><i>W</i><span><b>《长方体和正方体的认识》完整教案.docx</b><small>7.89 KB · 本地资料</small></span></div>`
    const user = `<div class="user-message">${attachment}${esc(requestText || coursewarePrompt)}</div>`
    const lead = `<div class="assistant-message"><span class="assistant-mark">象</span><div><b>${fromNewTask ? '正在根据你的要求生成互动课件' : '正在生成长方体和正方体的互动课件'}</b><p>${fromNewTask ? '我会理解年级、学科、课题和互动要求，在当前新任务中完成课件。' : '我会先检索教材内容，再按 40 分钟课堂结构设计可拖拽演示的 HTML 课件。'}</p></div></div>`
    const search = fromNewTask
      ? `<section class="question-source"><h3>正在理解本次课件需求</h3><p>${esc(requestText)}</p><ul><li>识别年级、学科与课题</li><li>梳理核心知识和教学目标</li><li>设计适合本课的讲解与互动环节</li></ul></section>`
      : `<section class="question-source"><h3>教材内容检索</h3><p>人教版 · 五年级下册 · 第三单元 长方体和正方体</p><ul><li>单元 3：长方体和正方体 · 第 1 课时</li><li>长方体/正方体的面、棱、顶点及其特征</li><li>棱长总和、表面积推导与应用</li></ul></section>`
    const stages = [
      ['理解教学目标', fromNewTask ? topicLabel : '五年级 · 长方体和正方体 · 40 分钟'],
      ['检索教材与例题', fromNewTask ? '匹配本次输入的教材内容' : '人教版五下 · 第三单元'],
      ['设计互动结构', fromNewTask ? '情境导入 · 互动探究 · 课堂练习' : '拖拽拼接 · 棱长计算 · 表面积推导'],
      ['生成 HTML 课件', '共 16 页 · 可演示 · 可下载'],
    ]
    const stageMarkup = `<div class="stage-list">${stages
      .map(
        (stage, index) =>
          `<div class="stage-row" data-stage="${index}"><span class="stage-state">${index + 1}</span><span><b>${stage[0]}</b><small>${stage[1]}</small></span></div>`
      )
      .join('')}</div>`
    const result = fromNewTask
      ? `<div class="assistant-message courseware-finish" id="coursewareResult"><span class="assistant-mark">象</span><div><p><b>${esc(topicLabel)} · 互动课件</b></p><ul class="courseware-bullets"><li>已根据本次输入梳理教学目标与知识结构。</li><li>包含情境导入、互动探究、分步讲解和课堂练习。</li><li>当前成果属于本次新任务，不会覆盖或跳入任何历史任务。</li></ul><div class="courseware-artifact-row"><button type="button" class="courseware-file-trigger" data-file="courseware"><span class="file-mark html">⌁</span><span class="courseware-file-copy"><b>${esc(topicLabel)}｜互动课件.html</b></span></button><div class="courseware-artifact-actions"><button type="button" class="courseware-action ghost" data-view-courseware>查看</button><button type="button" class="courseware-action ghost">下载</button></div></div><p class="courseware-result-note">本次生成过程已保留在当前新任务中，可继续输入要求修改课件。</p>${coursewareNextStepsMarkup()}</div></div>`
      : `<div class="assistant-message courseware-finish" id="coursewareResult"><span class="assistant-mark">象</span><div><p><b>1.1 长方体</b></p><ul class="courseware-bullets"><li>面、棱和顶点的概念：围成长方体的长方形叫作长方体的面，两条棱相交的点叫作顶点。</li><li>长方体有 6 个面，相对的面完全相同；12 条棱，相对的棱长度相等；8 个顶点。</li><li>正方体是特殊的长方体，6 个面都是完全相同的正方形。</li></ul><div class="courseware-artifact-row"><button type="button" class="courseware-file-trigger" data-file="courseware"><span class="file-mark html">⌁</span><span class="courseware-file-copy"><b>长方体和正方体的认识｜五年级下册.html</b></span></button><div class="courseware-artifact-actions"><button type="button" class="courseware-action ghost" data-view-courseware>查看</button><button type="button" class="courseware-action ghost">下载</button></div></div><p class="courseware-result-note">课件已发布，支持学生互动和教师点评。共 16 页，覆盖面/棱/顶点、棱长总和、表面积推导与拖拽演示练习，适合 40 分钟课堂使用。</p><p class="practice-saved-tip" id="practiceSavedTip" hidden>题单会自动存入「我的知识库」</p>${coursewareNextStepsMarkup()}</div></div>`

    deps.messageColumn.innerHTML = user + lead + search + stageMarkup + result
    deps.messageColumn.querySelectorAll('[data-file]').forEach((button) => {
      button.addEventListener('click', () => deps.openPreview(button.dataset.file))
    })
    document.querySelector('[data-view-courseware]')?.addEventListener('click', () => deps.openPreview('courseware'))
    document.querySelector('[data-start-practice]')?.addEventListener('click', startPracticeFromCourseware)

    const rows = deps.messageColumn.querySelectorAll('.stage-row')
    const resultBlock = document.getElementById('coursewareResult')
    const finish = () => {
      resultBlock?.classList.add('visible')
      deps.composerInput.placeholder = '输入修改意见或继续追问'
      deps.openPreview('courseware')
      deps.setActiveSkillChip?.('互动课件')
      deps.renderAddMenu?.()
      deps.scrollToBottom()
      if (jumpToPractice) startPracticeFromCourseware()
    }
    if (instant) {
      rows.forEach((row) => {
        row.classList.add('done')
        row.querySelector('.stage-state').textContent = '✓'
      })
      finish()
      return
    }
    let index = 0
    rows[0]?.classList.add('active')
    deps.scrollToBottom()
    coursewareTimer = setInterval(() => {
      if (index < rows.length) {
        rows[index].classList.remove('active')
        rows[index].classList.add('done')
        rows[index].querySelector('.stage-state').textContent = '✓'
        index += 1
        if (index < rows.length) rows[index].classList.add('active')
        else {
          clearCoursewareTimer()
          finish()
        }
        deps.scrollToBottom()
      }
    }, 700)
  }

  window.FxPracticeDemo = {
    init(api) {
      deps = api
    },
    isPracticePreview(kind) {
      return String(kind || '').startsWith('practice-')
    },
    renderPreviewKind,
    startCoursewareDemo,
    applyCoursewareEdit,
    startPaperComposition,
    showPaperList,
    resetPaperState() {
      paperActive = false
      composeEntryMode = false
      selectedQuestionId = null
      insertAnchorId = null
      document.body.classList.remove('composition-mode')
      document.body.classList.remove('ai-compose-workspace')
      document.getElementById('aiComposeBackButton')?.remove()
      hideComposerQuickChips()
      deps.setQuestionFocus?.(null)
      clearComposeTimer()
      clearCoursewareTimer()
    },
    hasActivePaper() {
      return paperActive
    },
    isComposeEntry() {
      return composeEntryMode
    },
    handleComposer,
    onQuestionsPicked(payload) {
      if (!payload) return
      startSheetFromPicker(payload)
    },
    startComposeEntry,
    startComposeWithAttachments,
    startEmptySheet: startComposeEntry,
    clearQuestionFocus() {
      selectedQuestionId = null
      if (currentHintMode === 'adapt') showComposerQuickChips('default')
      deps.renderPracticePreview('practice-sheet')
    },
  }
})()
