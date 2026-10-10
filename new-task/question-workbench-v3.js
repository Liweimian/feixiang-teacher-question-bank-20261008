(() => {
  const STORAGE_KEY = 'feixiang-question-workbench-v3-drafts'
  const ACTIVE_DRAFT_KEY = 'feixiang-question-workbench-v3-active-draft'
  const SUSPENDED_DRAFT_SESSION_KEY = 'feixiang-wb-suspended-draft-id'
  const PLUS_BLANK_SESSION_KEY = 'feixiang-wb-plus-creates-new'
  const BANK_SEARCH_KEY = 'feixiang-question-workbench-v3-bank-search'
  const TEACHER_CONTEXT_KEY = 'feixiang-question-workbench-v3-teacher-context'
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  const svg = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`
  const icons = {
    back: svg('<path d="m14.5 5-7 7 7 7"/>'),
    search: svg('<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 4.5 4.5"/>'),
    upload: svg('<path d="M5 4h14v16H5z"/><path d="m9 11 3-3 3 3M12 8v7M8 17h8"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    check: svg('<path d="m5 12 4 4L19 6"/>'),
    sparkle: svg('<path d="m12 3 1.3 4.2L17.5 8.5l-4.2 1.3L12 14l-1.3-4.2-4.2-1.3 4.2-1.3L12 3Z"/>'),
    up: svg('<path d="m7 14 5-5 5 5"/>'),
    blank: svg('<path d="M6 3.5h9l3 3V20H6z"/><path d="M15 3.5V7h3M9 11h6M9 14h6M9 17h4"/>'),
    chevron: svg('<path d="m9 6 6 6-6 6"/>'),
    knowledge: svg('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
    image: svg('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m5.5 17 4-4 3 3 2.5-2.5 3.5 3.5"/>'),
    eye: svg('<path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.5"/>'),
    download: svg('<path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M5 20h14"/>'),
    workbench: svg('<rect x="4" y="5" width="7" height="6" rx="1.5"/><rect x="13" y="5" width="7" height="6" rx="1.5"/><rect x="4" y="13" width="7" height="6" rx="1.5"/><path d="M16.5 13v6M13.5 16h6"/>'),
    elephant: svg('<path d="M7 8.5c0-2.2 1.8-4 4-4 1.2 0 2.3.5 3.1 1.4.8-.9 1.9-1.4 3.1-1.4 2.2 0 4 1.8 4 4 0 1.1-.4 2.1-1.1 2.9 1.4.8 2.4 2.3 2.4 4.1 0 2.5-2 4.5-4.5 4.5H8.5C6 19.5 4 17.5 4 15c0-1.8 1-3.3 2.4-4.1-.7-.8-1.1-1.8-1.1-2.9Z"/><circle cx="9.5" cy="9" r="1"/><circle cx="14.5" cy="9" r="1"/><path d="M10 13.5c.8.6 1.7.9 2.7.9s1.9-.3 2.6-.9"/>'),
    trash: svg('<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>'),
    tag: svg('<path d="M20 13 13 20 4 11V4h7z"/><circle cx="8.5" cy="8.5" r="1.5"/>'),
    grip: svg('<circle cx="9" cy="5" r="1.35"/><circle cx="9" cy="12" r="1.35"/><circle cx="9" cy="19" r="1.35"/><circle cx="15" cy="5" r="1.35"/><circle cx="15" cy="12" r="1.35"/><circle cx="15" cy="19" r="1.35"/>'),
    save: svg('<path d="M5 4h12l2 2v14H5z"/><path d="M8 4v5h8V4M8 18h8"/>'),
  }

  const defaultPaperFormat = { fontSize: 13, lineHeight: 1.65, answerHeight: 28, questionGap: 8 }

  function paperFormat() {
    activeDraft.format = { ...defaultPaperFormat, ...(activeDraft.format || {}) }
    if (!activeDraft.format.questionGapVersion) {
      activeDraft.format.questionGap = 8
      activeDraft.format.questionGapVersion = 2
    }
    return activeDraft.format
  }

  function paperToolbarMarkup() {
    const format = paperFormat()
    return `<div class="wb3-paper-toolbar" role="toolbar" aria-label="题单排版工具">
      <label class="wb3-tool-select" data-tooltip="字号"><span class="wb3-tool-icon font-size-icon">T</span><select data-paper-format="fontSize" aria-label="字号"><option value="12" ${format.fontSize === 12 ? 'selected' : ''}>小五</option><option value="13" ${format.fontSize === 13 ? 'selected' : ''}>五号</option><option value="14" ${format.fontSize === 14 ? 'selected' : ''}>小四</option><option value="16" ${format.fontSize === 16 ? 'selected' : ''}>四号</option></select></label>
      <i class="wb3-tool-separator"></i>
      <label class="wb3-tool-select" data-tooltip="行间距"><span class="wb3-tool-icon line-height-icon"><i>↕</i><b>≡</b></span><select data-paper-format="lineHeight" aria-label="行间距"><option value="1.4" ${format.lineHeight === 1.4 ? 'selected' : ''}>1.0</option><option value="1.65" ${format.lineHeight === 1.65 ? 'selected' : ''}>1.5</option><option value="2" ${format.lineHeight === 2 ? 'selected' : ''}>2.0</option></select></label>
      <label class="wb3-tool-select" data-tooltip="作答区行高"><span class="wb3-tool-icon answer-height-icon"><i>↕</i><b></b></span><select data-paper-format="answerHeight" aria-label="作答区行高"><option value="20" ${format.answerHeight === 20 ? 'selected' : ''}>1.0</option><option value="28" ${format.answerHeight === 28 ? 'selected' : ''}>1.5</option><option value="40" ${format.answerHeight === 40 ? 'selected' : ''}>2.0</option></select></label>
      <label class="wb3-tool-select" data-tooltip="题间距"><span class="wb3-tool-icon question-gap-icon"><i>↕</i><b>H</b></span><select data-paper-format="questionGap" aria-label="题间距"><option value="8" ${format.questionGap === 8 ? 'selected' : ''}>0.5</option><option value="12" ${format.questionGap === 12 ? 'selected' : ''}>1.0</option><option value="20" ${format.questionGap === 20 ? 'selected' : ''}>1.5</option></select></label>
    </div>`
  }

  const bankQuestions = [
    { id: 'b1', type: '填空题', knowledge: '部分合作问题', difficulty: '较易', score: 1, text: '用无人机喷洒农药、施肥等，可以极大地提高农业生产效率。农场给一片农田喷洒农药，一架小型无人机8小时能完成这片农田的喷洒任务。使用这架无人机喷洒1小时后，随即又调来了一架中型无人机加入到喷洒农药工作中，已知这架中型无人机每小时喷洒的农田面积是小型无人机的2倍。请你算一算，还需（　　）小时就能完成这片农田的农药喷洒工作。' },
    { id: 'b2', type: '填空题', knowledge: '长方形', difficulty: '较易', score: 1, text: '将一张长40厘米、宽24厘米的长方形纸对折后，变成两个同样大的小长方形，小长方形的长是（　　）厘米，宽是（　　）厘米或长是（　　）厘米，宽是（　　）厘米。' },
    { id: 'b3', type: '选择题', knowledge: '直线、射线和线段', difficulty: '较易', score: 1, text: '“有始有终”常常被用来形容一个人做事能够坚持到底，在数学上可以用这个成语来形容（　）。', options: ['A. 射线', 'B. 直线', 'C. 线段', 'D. 以上都可以'] },
    { id: 'b4', type: '选择题', knowledge: '线段', difficulty: '较易', score: 1, text: '把一条长3厘米的线段向两端各延长3厘米，得到一条（　）。', options: ['A. 直线', 'B. 线段', 'C. 射线', 'D. 无法确定'] },
    { id: 'b5', type: '选择题', knowledge: '三位数乘两位数', difficulty: '较易', score: 1, text: '要使256×□的积是一个四位数，□里最大可以填（　）。', options: ['A. 37', 'B. 38', 'C. 39', 'D. 40'] },
    { id: 'b6', type: '填空题', knowledge: '因数末尾有0', difficulty: '较易', score: 1, text: '12×13×14×15×16×17×18×19×20，积的末尾有（　　）个0。' },
    { id: 'b7', type: '解答题', knowledge: '同向追及问题', difficulty: '中等', score: 3, text: '共享单车作为一种低碳、绿色的出行方式，俨然成为市民出行的“新宠”。甲、乙两人骑共享单车环岛行，他们来到同一地点，甲先去买水花费了3分钟，甲去买水的同时，乙开始以每分钟340米骑行，甲骑行了12分钟追上乙，那么甲的速度是多少？' },
    { id: 'b8', type: '选择题', knowledge: '钟面上的角', difficulty: '较易', score: 1, text: '从早上6：00到早上6：30钟面上分针旋转了（　）。', options: ['A. 180°', 'B. 90°', 'C. 30°'] },
    { id: 'b9', type: '解答题', knowledge: '长方体体积', difficulty: '中等', score: 3, text: '一个长方体盒子的底面积是4/9平方分米，高是1/2分米。一个正方体盒子的体积是1/8立方分米。长方体盒子的体积比正方体盒子的体积多多少立方分米？' },
    { id: 'b10', type: '选择题', knowledge: '折痕关系', difficulty: '较易', score: 1, text: '把一张正方形纸对折两次后展开，折痕（　）。', options: ['A. 相交', 'B. 互相平行', 'C. 互相垂直', 'D. 可能互相平行，也可能互相垂直'] },
    { id: 'b11', type: '填空题', knowledge: '三位数乘两位数', difficulty: '中等', score: 2, text: '某工厂每天生产零件 186 个，照这样计算，25 天一共生产零件____个。' },
    { id: 'b12', type: '选择题', knowledge: '三位数乘两位数', difficulty: '较易', score: 1, text: '计算 405×32 时，其中“405×2”表示（　）。', options: ['A. 2 个 405 相加', 'B. 20 个 405 相加', 'C. 405 个 2 相加', 'D. 405 个 20 相加'] },
    { id: 'b13', type: '填空题', knowledge: '因数末尾有0', difficulty: '中等', score: 2, text: '25×16×125，积的末尾有____个 0。' },
    { id: 'b14', type: '解答题', knowledge: '部分合作问题', difficulty: '中等', score: 4, text: '一项工程，甲队单独做 12 天完成，乙队单独做 18 天完成。两队合作 4 天后，还剩多少工程没有完成？' },
    { id: 'b15', type: '填空题', knowledge: '同向追及问题', difficulty: '较易', score: 2, text: '哥哥每分钟走 80 米，弟弟每分钟走 60 米。哥哥在弟弟后面 100 米处同时同向出发，____分钟后哥哥追上弟弟。' },
    { id: 'b16', type: '选择题', knowledge: '长方形', difficulty: '较易', score: 1, text: '一个长方形的长是 8 厘米，宽是 5 厘米，它的周长是（　）厘米。', options: ['A. 13', 'B. 26', 'C. 40', 'D. 80'] },
    { id: 'b17', type: '填空题', knowledge: '长方形', difficulty: '中等', score: 2, text: '用两根同样长的铁丝分别围成一个正方形和一个长方形，正方形边长 6 厘米，长方形长 7 厘米，长方形的宽是____厘米。' },
    { id: 'b18', type: '选择题', knowledge: '直线、射线和线段', difficulty: '较易', score: 1, text: '下列说法正确的是（　）。', options: ['A. 射线比直线短', 'B. 线段可以测量长度', 'C. 直线有两个端点', 'D. 射线没有端点'] },
    { id: 'b19', type: '填空题', knowledge: '线段', difficulty: '较易', score: 1, text: '过平面上一点，可以向两个方向各画一条射线，所组成的图形是____。' },
    { id: 'b20', type: '选择题', knowledge: '钟面上的角', difficulty: '中等', score: 2, text: '下午 3 时 30 分，钟面上时针与分针所成的较小角是（　）。', options: ['A. 75°', 'B. 90°', 'C. 105°', 'D. 120°'] },
    { id: 'b21', type: '解答题', knowledge: '长方体体积', difficulty: '中等', score: 4, text: '一个无盖长方体鱼缸，长 40 厘米、宽 25 厘米、高 30 厘米，在鱼缸内注入 15 厘米深的水，水的体积是多少立方厘米？' },
    { id: 'b22', type: '选择题', knowledge: '折痕关系', difficulty: '较易', score: 1, text: '把一张圆形纸对折一次，折痕是（　）。', options: ['A. 线段', 'B. 射线', 'C. 直线', 'D. 曲线'] },
    { id: 'b23', type: '填空题', knowledge: '因数末尾有0', difficulty: '较易', score: 1, text: '450×120 的积末尾有____个 0。' },
    { id: 'b24', type: '解答题', knowledge: '同向追及问题', difficulty: '提高', score: 5, text: '环形跑道周长 400 米，小红每分钟跑 200 米，小华每分钟跑 150 米，两人从同一地点同时同向出发，至少多少分钟后小红第一次追上小华？' },
    { id: 'b25', type: '选择题', knowledge: '长方体体积', difficulty: '较易', score: 1, text: '一个长方体木块长 10 cm、宽 4 cm、高 3 cm，它的体积是（　）cm³。', options: ['A. 17', 'B. 34', 'C. 120', 'D. 240'] },
    { id: 'b26', type: '填空题', knowledge: '部分合作问题', difficulty: '较易', score: 2, text: '修一条路，甲队单独修 10 天完成，乙队单独修 15 天完成。两队合作，每天完成这条路的____。' },
    { id: 'b27', type: '选择题', knowledge: '直线、射线和线段', difficulty: '中等', score: 2, text: '经过两点可以画（　）条直线。', options: ['A. 1', 'B. 2', 'C. 无数', 'D. 0'] },
    { id: 'b28', type: '填空题', knowledge: '线段', difficulty: '中等', score: 2, text: '把 5 厘米长的线段向一端延长 100 米，得到的图形是____。' },
    { id: 'b29', type: '选择题', knowledge: '亿以内数的认识', difficulty: '较易', score: 1, text: '10001000 读作（　）。', options: ['A. 一千万零一千', 'B. 一千零一万', 'C. 一百零一万', 'D. 一千万一千'] },
    { id: 'b30', type: '填空题', knowledge: '亿以内数的认识', difficulty: '较易', score: 1, text: '一个数由 3 个亿、5 个万和 8 个一组成，这个数是____。' },
    { id: 'b31', type: '选择题', knowledge: '亿以内数的认识', difficulty: '中等', score: 2, text: '在 38050000 中，数字 8 在（　）上。', options: ['A. 百万位', 'B. 千万位', 'C. 万位', 'D. 十万位'] },
    { id: 'b32', type: '填空题', knowledge: '亿以上数的认识', difficulty: '较易', score: 1, text: '10 个一亿是____。' },
    { id: 'b33', type: '选择题', knowledge: '亿以上数的认识', difficulty: '较易', score: 1, text: '1000000000 读作（　）。', options: ['A. 一亿', 'B. 十亿', 'C. 一百亿', 'D. 一千亿'] },
    { id: 'b34', type: '选择题', knowledge: '数的大小比较', difficulty: '较易', score: 1, text: '下面四个数中最大的是（　）。', options: ['A. 98000000', 'B. 100000000', 'C. 99999999', 'D. 10100000'] },
    { id: 'b35', type: '填空题', knowledge: '数的大小比较', difficulty: '中等', score: 2, text: '在○里填“>”“<”或“=”。  80990000 ○ 81000000' },
    { id: 'b36', type: '选择题', knowledge: '数的改写和求近似数', difficulty: '较易', score: 1, text: '把 3800000 改写成用“万”作单位的数，正确的是（　）。', options: ['A. 38 万', 'B. 380 万', 'C. 3800 万', 'D. 3.8 万'] },
    { id: 'b37', type: '填空题', knowledge: '数的改写和求近似数', difficulty: '中等', score: 2, text: '把 3846200 省略万后面的尾数，约是____万。' },
    { id: 'b38', type: '选择题', knowledge: '整理和复习', difficulty: '较易', score: 1, text: '一个数的最高位是千万位，这个数是（　）位数。', options: ['A. 7', 'B. 8', 'C. 9', 'D. 10'] },
    { id: 'b39', type: '填空题', knowledge: '整理和复习', difficulty: '中等', score: 2, text: '比 99990000 大 10000 的数是____。' },
    { id: 'b40', type: '选择题', knowledge: '☆ 1亿有多大', difficulty: '较易', score: 1, text: '如果一张纸厚 0.1 毫米，1 亿张这样的纸叠起来大约高（　）。', options: ['A. 10 米', 'B. 100 米', 'C. 1000 米', 'D. 10000 米'] },
    { id: 'b41', type: '解答题', knowledge: '☆ 1亿有多大', difficulty: '中等', score: 3, text: '体育场有 5 万人，照这样计算，大约多少个这样的体育场才能坐满 1 亿人？' },
  ].map((question, index) => ({ ...question, curriculum: '小学数学', hasAnswer: true, onlineAt: Date.now() - index * 3600_000 })).concat([
    { id: 'cn1', curriculum: '小学语文', hasAnswer: true, type: '选择题', knowledge: '词语运用', difficulty: '基础', score: 3, text: '下列词语使用恰当的一项是（　）。', options: ['A. 津津有味', 'B. 迫不及待', 'C. 理所当然', 'D. 难以置信'] },
    { id: 'cn2', curriculum: '小学语文', hasAnswer: true, type: '选择题', knowledge: '病句修改', difficulty: '中等', score: 3, text: '下列句子中没有语病的一项是（　）。' },
    { id: 'cn3', curriculum: '小学语文', hasAnswer: true, type: '解答题', knowledge: '现代文阅读', difficulty: '中等', score: 8, text: '阅读短文，概括主人公的性格特点并说明理由。' },
    { id: 'cn4', curriculum: '小学语文', hasAnswer: false, type: '解答题', knowledge: '习作', difficulty: '提高', score: 20, text: '以“一次难忘的尝试”为题，完成一篇习作。' },
    { id: 'en1', curriculum: '小学英语', hasAnswer: true, type: '选择题', knowledge: '词汇', difficulty: '基础', score: 2, text: 'Choose the different word from the group.', options: ['A. Monday', 'B. Tuesday', 'C. weekend', 'D. Friday'] },
    { id: 'en2', curriculum: '小学英语', hasAnswer: true, type: '填空题', knowledge: '一般现在时', difficulty: '中等', score: 3, text: 'She ____ (go) to school by bus every day.' },
    { id: 'en3', curriculum: '小学英语', hasAnswer: true, type: '解答题', knowledge: '阅读理解', difficulty: '中等', score: 6, text: 'Read the passage and answer the questions.' },
    { id: 'en4', curriculum: '小学英语', hasAnswer: false, type: '解答题', knowledge: '书面表达', difficulty: '提高', score: 10, text: 'Write five sentences about your weekend.' },
    { id: 'jm1', curriculum: '初中数学', hasAnswer: true, type: '选择题', knowledge: '有理数', difficulty: '基础', score: 3, text: '−3 的相反数是（　）。', options: ['A. −3', 'B. 3', 'C. 1/3', 'D. −1/3'] },
    { id: 'jm2', curriculum: '初中数学', hasAnswer: true, type: '填空题', knowledge: '一元一次方程', difficulty: '中等', score: 3, text: '方程 3x−2＝10 的解为____。' },
    { id: 'jm3', curriculum: '初中数学', hasAnswer: true, type: '解答题', knowledge: '三角形', difficulty: '中等', score: 8, text: '已知三角形两内角分别为 45°、65°，求第三个内角。' },
    { id: 'jm4', curriculum: '初中数学', hasAnswer: false, type: '解答题', knowledge: '数据分析', difficulty: '提高', score: 8, text: '根据一组调查数据绘制统计图并分析变化趋势。' },
    { id: 'hm1', curriculum: '高中数学', hasAnswer: true, type: '选择题', knowledge: '集合', difficulty: '基础', score: 5, text: '已知集合 A＝{1,2,3}，B＝{2,3,4}，则 A∩B＝（　）。' },
    { id: 'hm2', curriculum: '高中数学', hasAnswer: true, type: '填空题', knowledge: '函数性质', difficulty: '中等', score: 5, text: '函数 f(x)＝x²−2x 的对称轴为____。' },
    { id: 'hm3', curriculum: '高中数学', hasAnswer: true, type: '解答题', knowledge: '立体几何', difficulty: '提高', score: 12, text: '证明直线与平面垂直，并求相关几何量。' },
    { id: 'hm4', curriculum: '高中数学', hasAnswer: false, type: '解答题', knowledge: '概率统计', difficulty: '提高', score: 12, text: '利用样本数据估计总体特征并说明结论。' },
    { id: 'jcn1', curriculum: '初中语文', hasAnswer: true, type: '选择题', knowledge: '文言文实词', difficulty: '中等', score: 3, text: '下列加点词解释正确的一项是（　）。' },
    { id: 'jen1', curriculum: '初中英语', hasAnswer: true, type: '填空题', knowledge: '一般过去时', difficulty: '基础', score: 2, text: 'He ____ (visit) the museum last Sunday.' },
    { id: 'jp1', curriculum: '初中物理', hasAnswer: true, type: '选择题', knowledge: '力和运动', difficulty: '中等', score: 3, text: '关于惯性，下列说法正确的是（　）。' },
    { id: 'jc1', curriculum: '初中化学', hasAnswer: true, type: '选择题', knowledge: '物质的变化', difficulty: '基础', score: 3, text: '下列变化属于化学变化的是（　）。' },
    { id: 'jb1', curriculum: '初中生物', hasAnswer: true, type: '选择题', knowledge: '细胞的结构', difficulty: '基础', score: 3, text: '植物细胞特有的结构是（　）。', options: ['A. 细胞壁', 'B. 细胞膜', 'C. 细胞质', 'D. 细胞核'] },
    { id: 'hcn1', curriculum: '高中语文', hasAnswer: true, type: '选择题', knowledge: '古代诗歌鉴赏', difficulty: '中等', score: 3, text: '对本诗意象理解正确的一项是（　）。' },
    { id: 'hen1', curriculum: '高中英语', hasAnswer: true, type: '填空题', knowledge: '非谓语动词', difficulty: '中等', score: 3, text: 'The problem ____ (discuss) yesterday is still unsolved.' },
    { id: 'hp1', curriculum: '高中物理', hasAnswer: true, type: '解答题', knowledge: '牛顿运动定律', difficulty: '提高', score: 8, text: '光滑水平面上质量为 m 的物块受恒力 F 作用，求加速度。' },
    { id: 'hc1', curriculum: '高中化学', hasAnswer: true, type: '选择题', knowledge: '氧化还原反应', difficulty: '中等', score: 4, text: '下列反应中氯元素化合价升高的是（　）。' },
    { id: 'hb1', curriculum: '高中生物', hasAnswer: true, type: '选择题', knowledge: '细胞代谢', difficulty: '中等', score: 4, text: '有氧呼吸的主要场所是（　）。', options: ['A. 细胞核', 'B. 线粒体', 'C. 叶绿体', 'D. 核糖体'] },
    { id: 'hh1', curriculum: '高中历史', hasAnswer: true, type: '选择题', knowledge: '中国古代史', difficulty: '中等', score: 4, text: '秦统一六国后在全国推行的制度是（　）。' },
    { id: 'hg1', curriculum: '高中地理', hasAnswer: true, type: '选择题', knowledge: '自然地理', difficulty: '中等', score: 4, text: '下列地貌类型主要由流水侵蚀作用形成的是（　）。' },
    { id: 'hpol1', curriculum: '高中政治', hasAnswer: true, type: '选择题', knowledge: '经济生活', difficulty: '基础', score: 4, text: '市场在资源配置中起决定性作用，主要体现的是（　）。' },
  ])

  const bankPapers = [
    { id: 'paper-1', curriculum: '小学数学', edition: '人教版', volume: '四年级上册', title: '四年级数学综合练习', subject: '数学', grade: '四年级', paperType: '综合练习', meta: '精选真题 · 5题 · 15分钟', questions: bankQuestions.slice(0, 5) },
    { id: 'paper-2', curriculum: '小学数学', edition: '人教版', volume: '四年级上册', title: '四年级数学期中基础练习', subject: '数学', grade: '四年级', paperType: '期中', meta: '校级题库 · 5题 · 15分钟', questions: bankQuestions.slice(0, 5) },
    { id: 'paper-3', curriculum: '小学数学', edition: '人教版', volume: '四年级上册', title: '四年级易错题专项卷', subject: '数学', grade: '四年级', paperType: '专项练习', meta: '精选题单 · 4题 · 12分钟', questions: [bankQuestions[0], bankQuestions[1], bankQuestions[3], bankQuestions[4]] },
    { id: 'paper-4', curriculum: '小学数学', edition: '北师大版', volume: '四年级上册', title: '北师大版四年级上册单元卷', subject: '数学', grade: '四年级', paperType: '综合练习', meta: '北师大版配套 · 4题 · 12分钟', questions: [bankQuestions[1], bankQuestions[4], bankQuestions[10], bankQuestions[11]] },
    { id: 'paper-5', curriculum: '初中数学', edition: '人教版', volume: '七年级上册', title: '七年级上册有理数单元练习', subject: '数学', grade: '七年级', paperType: '专项练习', meta: '人教版配套 · 3题 · 12分钟', questions: bankQuestions.filter((question) => question.curriculum === '初中数学').slice(0, 3) },
  ]

  const KNOWLEDGE_COMPOSE_FOLDER = '我的知识库 / 我的云盘 / 我的题单'
  const knowledgePapers = [
    { id: 'k1', title: '四年级数学错题集', type: '我的题单', meta: '3 题 · 4月12日更新', questions: [bankQuestions[0], bankQuestions[1], bankQuestions[3]] },
    { id: 'k2', title: '四年级数学期末卷', type: '我的题单', meta: '2 题 · 4月8日更新', questions: [bankQuestions[2], bankQuestions[4]] },
    { id: 'k3', title: '长方体单元练习', type: '我的题单', meta: '2 题 · 4月5日更新', questions: [bankQuestions[2], bankQuestions[4]] },
    { id: 'k4', title: '四年级计算每日练', type: '我的题单', meta: '3 题 · 4月1日更新', questions: [bankQuestions[0], bankQuestions[2], bankQuestions[4]] },
  ]

  const aiHistoryQuestions = bankQuestions.slice(5, 10).map((question) => ({
    ...question,
    id: `ai-history-${question.id}`,
    originId: question.id,
    source: 'ai-record',
  }))

  let personalQuestions = aiHistoryQuestions.map((question, index) => ({
    ...question,
    curriculumTags: [question.curriculum],
    typeTags: index === 0 ? [question.type, '计算题'] : [question.type],
    difficultyTags: [question.difficulty],
    knowledgeTags: index === 0
      ? [question.knowledge, '三位数乘两位数']
      : index === 1
        ? [question.knowledge, '数量关系']
        : [question.knowledge],
    customTags: index % 2 === 0 ? ['重点复习'] : ['计算专项'],
    recordedAt: Date.parse('2026-09-06T16:27:00+08:00'),
  }))
  let personalTagCatalog = ['重点复习', '计算专项']
  let aiImportRecords = [
    { id: 'record-complete', filename: '四年级数学综合练习.pdf', status: 'completed', stage: '解析完成', submittedAt: '09-06 16:20', completedAt: '09-06 16:27', questions: aiHistoryQuestions },
    { id: 'record-processing', filename: '四年级上册期末复习.docx', status: 'processing', stage: '正在提取题目与答案', submittedAt: '今天 10:28', eta: '预计还需 4–10 分钟', questions: [] },
    { id: 'record-failed', filename: '单元练习扫描-第3页.jpg', status: 'failed', stage: '解析失败，可重新解析', submittedAt: '09-05 11:20', questions: [] },
  ]
  function formatAiComposeHistoryDate(value = Date.now()) {
    const date = new Date(value)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  function seedAiComposeHistoryRecord(id, prompt, historyAt, questionCount = 5) {
    const historyDate = formatAiComposeHistoryDate(historyAt)
    return {
      id,
      conversationId: id,
      turnIndex: 1,
      title: prompt.length > 22 ? `${prompt.slice(0, 22)}…` : prompt,
      prompt,
      mode: 'generate',
      status: 'completed',
      createdAt: historyDate,
      historyDate,
      historyAt,
      plan: { count: questionCount, types: '选择、填空、解答', difficulty: '基础为主，适量中等', knowledge: '覆盖当前学科核心知识点', minutes: 15 },
      questions: bankQuestions.slice(0, questionCount).map((question, index) => ({
        ...question,
        id: `${id}-q${index + 1}`,
        originId: question.id,
        source: 'ai-compose',
      })),
    }
  }

  let aiComposeRecords = [
    seedAiComposeHistoryRecord('compose-h-1', '从题库组一份七年级上册数学期末模拟题单', Date.parse('2026-08-03T10:00:00')),
    seedAiComposeHistoryRecord('compose-h-2', '从题库组一份北京市西城区小学五年级上期末试卷', Date.parse('2026-08-03T09:00:00')),
    seedAiComposeHistoryRecord('compose-h-3', '从题库挑 3 道初中七年级英语听力题', Date.parse('2026-05-27T10:00:00'), 3),
    seedAiComposeHistoryRecord('compose-h-4', '组一份北京市西城区小学五年级上期末试卷', Date.parse('2026-05-21T10:00:00')),
    seedAiComposeHistoryRecord('compose-h-5', '组一份小学五年级数学期末基础题单', Date.parse('2026-04-16T10:00:00')),
  ]

  const curriculumCatalog = {
    '小学数学': { subject: '四年级 · 数学', groups: [['全部知识点',28],['数与运算',4],['三位数乘两位数',2],['因数末尾有0',2],['数量关系',6],['部分合作问题',2],['同向追及问题',2],['图形与几何',14],['长方形',2],['直线、射线和线段',2],['线段',2],['钟面上的角',1],['长方体体积',2],['折痕关系',2]], parents: { '数与运算':['三位数乘两位数','因数末尾有0'], '数量关系':['部分合作问题','同向追及问题'], '图形与几何':['长方形','直线、射线和线段','线段','钟面上的角','长方体体积','折痕关系'] } },
    '小学语文': { subject: '五年级 · 语文', groups: [['全部知识点',4],['语言文字积累',2],['词语运用',1],['病句修改',1],['阅读与鉴赏',1],['现代文阅读',1],['表达与交流',1],['习作',1]], parents: { '语言文字积累':['词语运用','病句修改'], '阅读与鉴赏':['现代文阅读'], '表达与交流':['习作'] } },
    '小学英语': { subject: '五年级 · 英语', groups: [['全部知识点',4],['语言知识',2],['词汇',1],['一般现在时',1],['阅读',1],['阅读理解',1],['表达',1],['书面表达',1]], parents: { '语言知识':['词汇','一般现在时'], '阅读':['阅读理解'], '表达':['书面表达'] } },
    '初中语文': { subject: '八年级 · 语文', groups: [['全部知识点',1],['古诗文阅读',1],['文言文实词',1]], parents: { '古诗文阅读':['文言文实词'] } },
    '初中数学': { subject: '七年级 · 数学', groups: [['全部知识点',4],['数与式',1],['有理数',1],['方程与不等式',1],['一元一次方程',1],['图形与几何',1],['三角形',1],['统计与概率',1],['数据分析',1]], parents: { '数与式':['有理数'], '方程与不等式':['一元一次方程'], '图形与几何':['三角形'], '统计与概率':['数据分析'] } },
    '初中英语': { subject: '八年级 · 英语', groups: [['全部知识点',1],['语法',1],['一般过去时',1]], parents: { '语法':['一般过去时'] } },
    '初中物理': { subject: '八年级 · 物理', groups: [['全部知识点',1],['力学',1],['力和运动',1]], parents: { '力学':['力和运动'] } },
    '初中化学': { subject: '九年级 · 化学', groups: [['全部知识点',1],['身边的化学物质',1],['物质的变化',1]], parents: { '身边的化学物质':['物质的变化'] } },
    '初中生物': { subject: '七年级 · 生物', groups: [['全部知识点',1],['细胞',1],['细胞的结构',1]], parents: { '细胞':['细胞的结构'] } },
    '高中语文': { subject: '高一 · 语文', groups: [['全部知识点',1],['文学鉴赏',1],['古代诗歌鉴赏',1]], parents: { '文学鉴赏':['古代诗歌鉴赏'] } },
    '高中数学': { subject: '高一 · 数学', groups: [['全部知识点',4],['预备知识',1],['集合',1],['函数',1],['函数性质',1],['几何',1],['立体几何',1],['统计与概率',1],['概率统计',1]], parents: { '预备知识':['集合'], '函数':['函数性质'], '几何':['立体几何'], '统计与概率':['概率统计'] } },
    '高中英语': { subject: '高一 · 英语', groups: [['全部知识点',1],['语法',1],['非谓语动词',1]], parents: { '语法':['非谓语动词'] } },
    '高中物理': { subject: '高一 · 物理', groups: [['全部知识点',1],['力学',1],['牛顿运动定律',1]], parents: { '力学':['牛顿运动定律'] } },
    '高中化学': { subject: '高一 · 化学', groups: [['全部知识点',1],['化学反应原理',1],['氧化还原反应',1]], parents: { '化学反应原理':['氧化还原反应'] } },
    '高中生物': { subject: '高一 · 生物', groups: [['全部知识点',1],['分子与细胞',1],['细胞代谢',1]], parents: { '分子与细胞':['细胞代谢'] } },
    '高中历史': { subject: '高一 · 历史', groups: [['全部知识点',1],['中国古代史',1],['秦汉时期',1]], parents: { '中国古代史':['秦汉时期'] } },
    '高中地理': { subject: '高一 · 地理', groups: [['全部知识点',1],['自然地理',1],['地貌',1]], parents: { '自然地理':['地貌'] } },
    '高中政治': { subject: '高一 · 政治', groups: [['全部知识点',1],['经济生活',1],['市场经济',1]], parents: { '经济生活':['市场经济'] } },
  }

  const SYSTEM_QUESTION_TYPE_TAGS = ['选择题', '填空题', '判断题', '解答题', '计算题']

  function tagList(value, fallback = '') {
    const source = Array.isArray(value) && value.length
      ? value
      : Array.isArray(fallback)
        ? fallback
        : fallback ? [fallback] : []
    return [...new Set(source.map((item) => String(item || '').trim()).filter(Boolean))]
  }

  function questionCurriculumTags(question) {
    return tagList(question.curriculumTags, question.curriculum)
  }

  function questionTypeTags(question) {
    return tagList(question.typeTags, question.type)
  }

  function questionDifficultyTags(question) {
    return tagList(question.difficultyTags, question.difficulty)
  }

  function questionKnowledgeTags(question) {
    return tagList(question.knowledgeTags, question.knowledge)
  }

  function curriculumTagLabel(value) {
    const match = String(value || '').match(/^(小学|初中|高中)(.+)$/)
    return match ? `${match[1]} · ${match[2]}` : String(value || '')
  }

  function knowledgeOptionsForCurriculums(curriculums = []) {
    return [...new Set(curriculums.flatMap((key) => (curriculumCatalog[key]?.groups || [])
      .map(([name]) => name)
      .filter((name) => name !== '全部知识点')))]
  }

  const PRIMARY_VOLUME_LABELS = ['一年级上册', '一年级下册', '二年级上册', '二年级下册', '三年级上册', '三年级下册', '四年级上册', '四年级下册', '五年级上册', '五年级下册', '六年级上册', '六年级下册']
  const JUNIOR_VOLUME_LABELS = ['七年级上册', '七年级下册', '八年级上册', '八年级下册', '九年级上册', '九年级下册']
  const SENIOR_VOLUME_LABELS = ['必修第一册', '必修第二册', '选择性必修第一册', '选择性必修第二册']
  const withYearVolumes = (labels, years = [2024, 2019]) => labels.flatMap((label) => years.map((year) => ({ label, year, isNew: year === 2024 })))
  const textbookBook = (edition, volume, year, editionNames, volumeLabels) => ({
    edition,
    volume,
    year,
    editions: editionNames.map((name) => ({ name, volumes: withYearVolumes(volumeLabels) })),
  })
  const textbookCatalog = {
    '小学数学': textbookBook('人教版', '四年级上册', 2024, ['人教版', '北师大版', '苏教版', '沪教版', '浙教版', '北京版'], PRIMARY_VOLUME_LABELS),
    '小学语文': textbookBook('部编版', '五年级上册', 2024, ['部编版', '人教版', '苏教版'], PRIMARY_VOLUME_LABELS),
    '小学英语': textbookBook('人教PEP', '五年级上册', 2024, ['人教PEP', '外研版', '译林版'], PRIMARY_VOLUME_LABELS),
    '初中语文': textbookBook('部编版', '八年级上册', 2024, ['部编版', '人教版'], JUNIOR_VOLUME_LABELS),
    '初中数学': textbookBook('人教版', '七年级上册', 2024, ['人教版', '北师大版', '沪教版', '浙教版', '北京版', '苏科版', '华东师大版', '沪教版(五四制)'], JUNIOR_VOLUME_LABELS),
    '初中英语': textbookBook('人教版', '八年级上册', 2024, ['人教版', '外研版'], JUNIOR_VOLUME_LABELS),
    '初中物理': textbookBook('人教版', '八年级上册', 2024, ['人教版', '沪科版', '苏科版'], ['八年级上册', '八年级下册', '九年级上册', '九年级下册']),
    '初中化学': textbookBook('人教版', '九年级上册', 2024, ['人教版', '沪教版'], ['九年级上册', '九年级下册']),
    '初中生物': textbookBook('人教版', '七年级上册', 2024, ['人教版', '北师大版'], ['七年级上册', '七年级下册', '八年级上册', '八年级下册']),
    '高中语文': textbookBook('统编版', '必修第一册', 2024, ['统编版', '人教版'], SENIOR_VOLUME_LABELS),
    '高中数学': textbookBook('人教A版', '必修第一册', 2024, ['人教A版', '人教B版', '北师大版'], SENIOR_VOLUME_LABELS),
    '高中英语': textbookBook('人教版', '必修第一册', 2024, ['人教版', '外研版'], SENIOR_VOLUME_LABELS),
    '高中物理': textbookBook('人教版', '必修第一册', 2024, ['人教版', '粤教版'], SENIOR_VOLUME_LABELS),
    '高中化学': textbookBook('人教版', '必修第一册', 2024, ['人教版', '鲁科版', '苏教版'], SENIOR_VOLUME_LABELS),
    '高中生物': textbookBook('人教版', '必修第一册', 2024, ['人教版', '北师大版'], SENIOR_VOLUME_LABELS),
    '高中历史': textbookBook('统编版', '必修第一册', 2024, ['统编版', '人教版'], SENIOR_VOLUME_LABELS),
    '高中地理': textbookBook('人教版', '必修第一册', 2024, ['人教版', '中图版'], SENIOR_VOLUME_LABELS),
    '高中政治': textbookBook('统编版', '必修第一册', 2024, ['统编版', '人教版'], SENIOR_VOLUME_LABELS),
  }

  const RENJIAO_GRADE4_UP_CHAPTERS = {
    groups: [
      ['一 万以上数的认识', 0],
      ['亿以内数的认识', 0],
      ['亿以上数的认识', 0],
      ['数的大小比较', 0],
      ['数的改写和求近似数', 0],
      ['整理和复习', 0],
      ['☆ 1亿有多大', 0],
      ['二 角的度量', 0],
      ['直线、射线和角', 0],
      ['角的分类', 0],
      ['角的度量', 0],
      ['画角', 0],
      ['三 多位数乘两位数', 0],
      ['口算乘法', 0],
      ['笔算乘法', 0],
      ['速度、时间与路程', 0],
    ],
    parents: {
      '一 万以上数的认识': ['亿以内数的认识', '亿以上数的认识', '数的大小比较', '数的改写和求近似数', '整理和复习', '☆ 1亿有多大'],
      '二 角的度量': ['直线、射线和角', '角的分类', '角的度量', '画角'],
      '三 多位数乘两位数': ['口算乘法', '笔算乘法', '速度、时间与路程'],
    },
    aliases: {
      '一 万以上数的认识': [],
      '二 角的度量': ['钟面上的角', '直线、射线和线段', '线段'],
      '直线、射线和角': ['直线、射线和线段', '线段'],
      '角的度量': ['钟面上的角'],
      '三 多位数乘两位数': ['三位数乘两位数', '因数末尾有0'],
      '口算乘法': ['因数末尾有0'],
      '笔算乘法': ['三位数乘两位数'],
      '速度、时间与路程': ['同向追及问题', '部分合作问题'],
    },
  }
  const chapterTreeCatalog = {
    '小学数学|人教版|四年级上册': RENJIAO_GRADE4_UP_CHAPTERS,
  }

  let root
  let activeDraft
  let questionSource = 'official'
  const OFFICIAL_PAGE_SIZE = 20
  const OFFICIAL_MAX_PAGES = 3
  let officialPage = 1
  let officialMoreUnlocked = false
  let officialUnlockPromptOpen = false
  let curriculumKey = '小学数学'
  let textbookSelection = {}
  let textbookPickerOpen = false
  let textbookPickerEdition = ''
  let expandedChapterParents = new Set()
  let chapterBrowseMode = 'chapter'
  let previewBankPaperId = ''
  let treeSearchQuery = ''
  let personalPaperSearchQuery = ''
  let activeKnowledge = '全部知识点'
  let filterType = '全部题型'
  let filterDifficulty = '全部难度'
  let selectedQuestionId = ''
  let answerEditorQuestionId = ''
  let revealedAnswerIds = new Set()
  let uploadParsing = false
  let aiGenerating = false
  let importMenuOpen = false
  let knowledgeModalOpen = false
  let importWorkspaceView = 'library'
  let activeImportRecordId = ''
  let activeAiComposeRecordId = ''
  let aiComposeResultViewId = ''
  let aiComposeReturnScrollTop = 0
  let previewKnowledgePaperId = ''
  let personalPaperReturnScrollTop = 0
  let personalLibraryMode = 'questions'
  let personalCollection = 'all'
  let personalCurriculumFilter = 'all'
  let personalKnowledgeFilter = 'all'
  let selectedPersonalQuestionIds = new Set()
  let personalBatchMode = false
  let aiRecordingDrawerOpen = false
  let personalImportRecordViewId = ''
  let personalImportReturnScrollTop = 0
  let personalTagEditorQuestionIds = []
  let bulkSetKnowledgeEnabled = false
  let bulkSetCustomEnabled = false
  let bulkKnowledgeValues = new Set()
  let bulkCustomValues = new Set()
  let bulkKnowledgeQuery = ''
  let questionLabelEditorId = ''
  let questionLabelEditorFocus = 'curriculum'
  let questionLabelDraft = null
  let questionLabelCurriculumSnapshots = new Map()
  let questionLabelDropdownOpen = ''
  let questionLabelDropdownQuery = ''
  let adaptRequest = null
  let adaptPicker = null
  let sheetDragId = ''
  let adaptThinkingTimer = null
  const ADAPT_THINKING_LINES = [
    '理解原题考点与题型结构',
    '按改编要求调整情境与数据',
    '生成 2–3 道候选变式',
    '校验难度与作答区格式',
  ]

  function stopAdaptThinkingTimer() {
    if (adaptThinkingTimer !== null) {
      window.clearInterval(adaptThinkingTimer)
      adaptThinkingTimer = null
    }
  }
  let personalDeletePromptId = ''
  let pendingPersonalTagDelete = ''
  let pendingPaperEditId = ''
  let pendingPaperDeleteId = ''
  let downloadDialogOpen = false
  let saveBeforeNewDialogOpen = false
  let suspendedDraftIdForNewButton = ''
  let plusCreatesBlankOnNew = false
  let aiCreateInputDraft = ''
  let aiCreateAttachments = []
  let aiCreateListening = false
  let aiCreateSpeechRecognition = null

  const DEFAULT_DRAFT_TITLE = '未命名题单'
  const PAPER_EXPORT_SCHOOL_HEADER = '学校：____________________　班级：________　姓名：________'
  let mathEditorOpen = false
  let mathEditorPreview = 'S = πr²'
  let mathEditorLatex = 'S=\\pi r^2'
  let symbolModalOpen = false
  let symbolModalTab = 'math'
  let activeRichEditorQuestionId = ''
  let activeRichEditorField = ''
  let richFloatEl = null
  let lastPointerX = 0
  let lastPointerY = 0

  const SUBJECT_FORMULA_PRESETS = [
    { name: '圆面积', display: 'S = πr²', latex: 'S=\\pi r^2' },
    { name: '梯形面积', display: 'S = ½(a+b)×h', latex: 'S=\\frac{1}{2}(a+b)h' },
    { name: '三角形面积', display: 'S = √[p(p-a)(p-b)(p-c)]', latex: 'S=\\sqrt{p(p-a)(p-b)(p-c)}' },
    { name: '圆柱体积', display: 'V = πr²h', latex: 'V=\\pi r^2 h' },
    { name: '圆锥体积', display: 'V = ⅓πr²h', latex: 'V=\\frac{1}{3}\\pi r^2 h' },
  ]

  const SYMBOL_TABS = [
    { id: 'math', label: '数学' },
    { id: 'serial', label: '序号' },
    { id: 'bracket', label: '括号' },
    { id: 'latin', label: '拉丁' },
    { id: 'pinyin', label: '拼音' },
    { id: 'special', label: '特殊字符' },
  ]

  const SYMBOL_GRID = {
    math: ['+', '−', '×', '÷', '±', '=', '≠', '≈', '≤', '≥', '<', '>', '∈', '∉', '⊂', '⊃', '∪', '∩', '∞', '∠', '⊥', '∥', '°', 'π', 'α', 'β', 'γ', 'Δ', 'θ', 'λ', 'μ', 'σ', '∑', '∏', '∫', '√', '‰', '%', 'mg', 'kg', 'mm', 'cm', 'km', 'm²', 'ml', 'L'],
    serial: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑴', '⑵', '⑶', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ'],
    bracket: ['(', ')', '[', ']', '{', '}', '（', '）', '【', '】', '《', '》', '「', '」'],
    latin: ['À', 'Á', 'Â', 'Ã', 'Ä', 'à', 'á', 'â', 'ã', 'ä', 'È', 'É', 'Ê', 'Ë', 'è', 'é', 'ê', 'ë', 'Ñ', 'ñ', 'Ö', 'ö', 'Ü', 'ü'],
    pinyin: ['ā', 'á', 'ǎ', 'à', 'ō', 'ó', 'ǒ', 'ò', 'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì', 'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
    special: ['…', '—', '–', '·', '※', '★', '☆', '→', '←', '↑', '↓', '↔', '✓', '✗', '©', '®', '™', '℃', '℉'],
  }

  const MATH_STRUCTURE_BUTTONS = [
    { label: 'a/b', insert: '()/()' },
    { label: '√', insert: '√()' },
    { label: 'x²', insert: '()²' },
    { label: 'xₙ', insert: '()ₙ' },
    { label: 'Σ', insert: 'Σ' },
    { label: '∫', insert: '∫' },
  ]

  function makeId(prefix = 'q') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  }

  function bankSearchStorageKey() {
    return `${curriculumKey}|${questionSource}`
  }

  function applyBankSearchFromStorage() {
    try {
      const map = JSON.parse(localStorage.getItem(BANK_SEARCH_KEY) || '{}')
      const entry = map[bankSearchStorageKey()]
      treeSearchQuery = typeof entry?.treeSearchQuery === 'string' ? entry.treeSearchQuery : ''
    } catch {
      treeSearchQuery = ''
    }
  }

  function saveBankSearchToStorage() {
    try {
      const map = JSON.parse(localStorage.getItem(BANK_SEARCH_KEY) || '{}')
      map[bankSearchStorageKey()] = { treeSearchQuery, savedAt: Date.now() }
      localStorage.setItem(BANK_SEARCH_KEY, JSON.stringify(map))
    } catch { /* ignore */ }
  }

  function applyTeacherContextFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem(TEACHER_CONTEXT_KEY) || '{}')
      if (saved.curriculumKey && curriculumCatalog[saved.curriculumKey]) curriculumKey = saved.curriculumKey
      if (saved.textbooks && typeof saved.textbooks === 'object') textbookSelection = { ...saved.textbooks }
    } catch { /* ignore */ }
  }

  function saveTeacherContextToStorage() {
    try {
      localStorage.setItem(TEACHER_CONTEXT_KEY, JSON.stringify({
        curriculumKey,
        textbooks: textbookSelection,
        savedAt: Date.now(),
      }))
    } catch { /* ignore */ }
  }

  function personalBankTotalCount() {
    return personalQuestions.length
  }

  function isUntitledDraftTitle(title = '') {
    const t = String(title).trim()
    return !t || t === DEFAULT_DRAFT_TITLE || /^未命名题单 \d+$/.test(t)
  }

  function nextUntitledDraftName() {
    let drafts = []
    try { drafts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { drafts = [] }
    const used = new Set()
    drafts.forEach((draft) => {
      const t = (draft.title || DEFAULT_DRAFT_TITLE).trim()
      if (t === DEFAULT_DRAFT_TITLE) { used.add(1); return }
      const match = /^未命名题单 (\d+)$/.exec(t)
      if (match) used.add(Number(match[1]))
    })
    if (!used.size) return DEFAULT_DRAFT_TITLE
    let n = 1
    while (used.has(n)) n += 1
    return n === 1 ? DEFAULT_DRAFT_TITLE : `未命名题单 ${n}`
  }

  function createBlankDraft() {
    return { id: makeId('draft'), title: nextUntitledDraftName(), subject: currentCurriculum().subject, curriculumKey, questions: [], createdAt: Date.now(), updatedAt: Date.now(), savedAt: 0 }
  }

  function formatManualSavedLabel(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const yy = String(date.getFullYear()).slice(-2)
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mi = String(date.getMinutes()).padStart(2, '0')
    return `${yy}/${mm}/${dd} ${hh}:${mi}已保存`
  }

  function isDraftDirty(draft) {
    if (!draft) return false
    const savedAt = Number(draft.savedAt || 0)
    const updatedAt = Number(draft.updatedAt || 0)
    if (!savedAt) return updatedAt > Number(draft.createdAt || 0)
    return updatedAt > savedAt
  }

  function hasUnsavedCanvasChanges() {
    return isDraftDirty(activeDraft)
  }

  function captureDraftSnapshot(draft) {
    return {
      title: draft.title,
      curriculumKey: draft.curriculumKey,
      subject: draft.subject,
      questions: JSON.parse(JSON.stringify(draft.questions || [])),
    }
  }

  function applyDraftSnapshot(draft, snapshot) {
    if (!draft || !snapshot) return
    draft.title = snapshot.title
    draft.curriculumKey = snapshot.curriculumKey
    draft.subject = snapshot.subject
    draft.questions = JSON.parse(JSON.stringify(snapshot.questions || []))
  }

  function ensureDraftSavedSnapshot(draft) {
    if (!draft?.savedAt || draft.savedSnapshot || isDraftDirty(draft)) return
    draft.savedSnapshot = captureDraftSnapshot(draft)
  }

  /** @returns {'clean'|'reverted'|'discarded'} */
  function discardUnsavedDraftChanges(draft) {
    if (!draft || !isDraftDirty(draft)) return 'clean'
    ensureDraftSavedSnapshot(draft)
    if (Number(draft.savedAt || 0) > 0 && draft.savedSnapshot) {
      applyDraftSnapshot(draft, draft.savedSnapshot)
      draft.updatedAt = draft.savedAt
      return 'reverted'
    }
    return 'discarded'
  }

  function canvasSaveStatusMarkup() {
    const savedAt = Number(activeDraft?.savedAt || 0)
    const dirty = hasUnsavedCanvasChanges()
    if (dirty) return '<span class="wb3-canvas-save-status dirty">未保存</span>'
    if (!savedAt) return ''
    return `<span class="wb3-canvas-save-status">${escapeHtml(formatManualSavedLabel(savedAt))}</span>`
  }

  function canvasSaveButtonTitle() {
    if (!hasUnsavedCanvasChanges()) return '已保存，暂无新的更改'
    return Number(activeDraft?.savedAt || 0) > 0 ? '有未保存的更改，点击保存到「我的题单」' : '保存到「我的题单」'
  }

  function canvasHasQuestions() {
    return confirmedSheetQuestions().length > 0
  }

  function newDraftButtonTitle() {
    if (!canvasHasQuestions()) return '画布为空，请先添加题目'
    if (hasUnsavedCanvasChanges()) return '请先保存当前题单'
    if (suspendedDraftIdForNewButton && !plusCreatesBlankOnNew) return '切回上一题单'
    return '新建组题'
  }

  function loadActiveDraft() {
    try {
      const activeId = localStorage.getItem(ACTIVE_DRAFT_KEY)
      if (!activeId) return null
      const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').find((item) => item.id === activeId) || null
      if (draft?.questions) draft.questions = draft.questions.filter((question) => question.status !== 'draft')
      return draft
    } catch { return null }
  }

  function savedDraftPapers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').filter((draft) => draft.savedAt && draft.questions?.some((question) => question.status === 'confirmed')).map((draft) => {
        const questions = draft.questions.filter((question) => question.status === 'confirmed')
        const savedLabel = formatManualSavedLabel(draft.savedAt).replace(/已保存$/, '').trim()
        return { id: `saved-${draft.id}`, draftId: draft.id, title: draft.title || '未命名题单', type: '我的题单', meta: `${savedLabel} · ${questions.length} 题`, questions }
      })
    } catch { return [] }
  }

  function allKnowledgePapers() {
    const saved = savedDraftPapers()
    const demos = knowledgePapers.filter((paper) => !saved.some((item) => item.id === paper.id))
    return [...saved, ...demos].map((paper) => ({ ...paper, folderPath: KNOWLEDGE_COMPOSE_FOLDER, type: '我的题单' }))
  }

  function cloneQuestion(question, extra = {}) {
    return {
      ...question,
      curriculumTags: [...questionCurriculumTags(question)],
      typeTags: [...questionTypeTags(question)],
      difficulty: questionDifficultyTags(question)[0] || '中等',
      knowledgeTags: [...questionKnowledgeTags(question)],
      customTags: [...(question.customTags || [])],
      id: makeId('sheet'),
      sourceId: question.id,
      sourceSnapshot: { text: question.text || '', options: [...(question.options || [])] },
      status: 'confirmed',
      source: question.source || 'bank',
      ...extra,
    }
  }

  function confirmedSheetQuestions() {
    return (activeDraft?.questions || []).filter((q) => q.status === 'confirmed')
  }

  function confirmedSheetIndex(questionId) {
    const index = confirmedSheetQuestions().findIndex((q) => q.id === questionId)
    return index >= 0 ? index + 1 : 0
  }

  function getAddedMap() {
    const map = new Map()
    confirmedSheetQuestions().forEach((q, index) => {
      if (q.sourceId) map.set(q.sourceId, index + 1)
    })
    return map
  }

  function reorderSheetQuestions(dragId, targetId, insertBefore) {
    if (!activeDraft || !dragId || !targetId || dragId === targetId) return false
    const questions = activeDraft.questions
    const fromIndex = questions.findIndex((q) => q.id === dragId)
    const targetIndex = questions.findIndex((q) => q.id === targetId)
    if (fromIndex < 0 || targetIndex < 0) return false
    if (questions[fromIndex].status !== 'confirmed' || questions[targetIndex].status !== 'confirmed') return false
    const [moved] = questions.splice(fromIndex, 1)
    let insertIndex = questions.findIndex((q) => q.id === targetId)
    if (insertIndex < 0) return false
    if (!insertBefore) insertIndex += 1
    questions.splice(insertIndex, 0, moved)
    if (answerEditorQuestionId) answerEditorQuestionId = ''
    persistDraft()
    return true
  }

  function rewireSheetQuestionId(question, prevId) {
    question.id = makeId('sheet')
    if (selectedQuestionId === prevId) selectedQuestionId = question.id
    if (answerEditorQuestionId === prevId) answerEditorQuestionId = question.id
    if (activeRichEditorQuestionId === prevId) activeRichEditorQuestionId = question.id
    if (revealedAnswerIds.has(prevId)) {
      revealedAnswerIds.delete(prevId)
      revealedAnswerIds.add(question.id)
    }
  }

  function breaksSourceLink(question, { text, options, answer, analysis } = {}) {
    const snapshot = question.sourceSnapshot
    if (text !== undefined && snapshot && text !== snapshot.text) return true
    if (options !== undefined && snapshot && JSON.stringify(options) !== JSON.stringify(snapshot.options || [])) return true
    if (answer !== undefined || analysis !== undefined) {
      if (question.sourceId || snapshot) return true
    }
    if (text !== undefined && !snapshot && question.sourceId && text !== (question.text || '')) return true
    if (options !== undefined && !snapshot && question.sourceId) return true
    return false
  }

  function applySheetQuestionContentEdit(question, nextText, nextHtml) {
    const prevText = question.text || ''
    const prevHtml = question.textHtml || ''
    if (nextText === prevText && nextHtml === prevHtml) return false
    question.text = nextText
    question.textHtml = nextHtml
    const breaksSource = breaksSourceLink(question, { text: nextText })
      || (nextHtml !== prevHtml && Boolean(question.sourceId || question.sourceSnapshot))
    if (breaksSource) delete question.sourceId
    const prevId = question.id
    rewireSheetQuestionId(question, prevId)
    return true
  }

  function sheetEditableField(el) {
    if (!el?.classList) return ''
    if (el.classList.contains('wb3-sheet-q-text')) return 'stem'
    if (el.classList.contains('wb3-sheet-q-options')) return 'options'
    if (el.classList.contains('wb3-sheet-q-answer-text')) return el.dataset.answerField || 'answer'
    return ''
  }

  function syncSheetEditableFromDom(question, field, el) {
    if (field === 'stem') {
      const nextHtml = el.innerHTML
      const nextText = el.innerText.replace(/\u00a0/g, ' ').trim()
      if (!nextText && !nextHtml.includes('wb3-formula')) return 'empty-stem'
      return applySheetQuestionContentEdit(question, nextText, nextHtml) ? 'changed' : 'same'
    }
    if (field === 'options') {
      const lines = el.innerText.replace(/\u00a0/g, ' ').split(/\n/).map((line) => line.trim()).filter(Boolean)
      const nextOptions = lines
      const prevJson = JSON.stringify(question.options || [])
      const nextJson = JSON.stringify(nextOptions)
      if (prevJson === nextJson) {
        if ((question.optionsHtml || '') === el.innerHTML) return 'same'
        question.optionsHtml = el.innerHTML
        return 'format'
      }
      question.options = nextOptions
      question.optionsHtml = el.innerHTML
      if (breaksSourceLink(question, { options: nextOptions })) delete question.sourceId
      const prevId = question.id
      rewireSheetQuestionId(question, prevId)
      return 'changed'
    }
    if (field === 'answer' || field === 'analysis') {
      const nextValue = el.innerText.replace(/\u00a0/g, ' ').trim()
      const key = field === 'analysis' ? 'analysis' : 'answer'
      const prevValue = question[key] || ''
      if (nextValue === prevValue) {
        if ((question[`${key}Html`] || '') === el.innerHTML) return 'same'
        question[`${key}Html`] = el.innerHTML
        return 'format'
      }
      question[key] = nextValue
      question[`${key}Html`] = el.innerHTML
      if (breaksSourceLink(question, { [key]: nextValue })) delete question.sourceId
      const prevId = question.id
      rewireSheetQuestionId(question, prevId)
      return 'changed'
    }
    return 'same'
  }

  function sheetQuestionHtml(question) {
    if (question.textHtml) return question.textHtml
    return escapeHtml(question.text || '')
  }

  function saveEditorSelection() {
    const sel = window.getSelection()
    if (sel && sel.rangeCount) return sel.getRangeAt(0).cloneRange()
    return null
  }

  function activeRichEditorEl() {
    if (!activeRichEditorQuestionId || !root) return null
    const card = $(`[data-sheet-id="${activeRichEditorQuestionId}"]`, root)
    if (!card) return null
    if (activeRichEditorField === 'options') return $('.wb3-sheet-q-options', card)
    if (activeRichEditorField === 'answer') return $('.wb3-sheet-q-answer-text[data-answer-field="answer"]', card)
    if (activeRichEditorField === 'analysis') return $('.wb3-sheet-q-answer-text[data-answer-field="analysis"]', card)
    return $('.wb3-sheet-q-text', card)
  }

  function insertIntoRichEditor(content, asHtml = false) {
    const el = activeRichEditorEl()
    if (!el) return
    el.focus()
    const sel = window.getSelection()
    if (!sel) return
    if (sel.rangeCount === 0) {
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    }
    if (asHtml) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      const tpl = document.createElement('template')
      tpl.innerHTML = content
      range.insertNode(tpl.content)
      range.collapse(false)
    } else {
      document.execCommand('insertText', false, content)
    }
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }

  function ensureRichFloat() {
    if (richFloatEl) return richFloatEl
    richFloatEl = document.createElement('div')
    richFloatEl.className = 'wb3-rich-float'
    richFloatEl.setAttribute('aria-hidden', 'true')
    richFloatEl.innerHTML = `<button type="button" data-rich-command="bold" aria-label="加粗"><b>B</b></button><button type="button" data-rich-command="italic" aria-label="斜体"><i>I</i></button><button type="button" data-rich-command="underline" aria-label="下划线"><u>U</u></button><i class="wb3-rich-float-sep"></i><button type="button" data-open-math-editor aria-label="公式编辑器"><span>f</span><sub>x</sub></button><button type="button" data-open-symbol-modal aria-label="插入符号">Ω</button>`
    document.body.appendChild(richFloatEl)
    richFloatEl.addEventListener('mousedown', (event) => {
      if (event.target.closest('[data-rich-command], [data-open-math-editor], [data-open-symbol-modal]')) event.preventDefault()
    })
    richFloatEl.addEventListener('mouseleave', (event) => {
      const related = event.relatedTarget
      if (related?.closest?.('.wb3-rich-editable, .wb3-math-modal, .wb3-symbol-modal, .wb3-math-overlay, .wb3-symbol-overlay')) return
      hideRichFloatBar()
    })
    richFloatEl.addEventListener('click', (event) => {
      if (!root || root.hidden) return
      const richCommand = event.target.closest('[data-rich-command]')
      if (richCommand) {
        const el = activeRichEditorEl()
        el?.focus()
        document.execCommand(richCommand.dataset.richCommand, false, null)
        return
      }
      if (event.target.closest('[data-open-math-editor]')) {
        mathEditorPreview = 'S = πr²'
        mathEditorLatex = 'S=\\pi r^2'
        mathEditorOpen = true
        render()
        return
      }
      if (event.target.closest('[data-open-symbol-modal]')) {
        symbolModalOpen = true
        symbolModalTab = 'math'
        render()
      }
    })
    return richFloatEl
  }

  function computeRichFloatPlacement(target) {
    const rect = target.getBoundingClientRect()
    const left = Math.min(window.innerWidth - 280, Math.max(12, rect.left))
    const top = Math.max(12, rect.top - 44)
    return { left, top }
  }

  function showRichFloatBar(target) {
    const bar = ensureRichFloat()
    if (!target) { hideRichFloatBar(); return }
    const { left, top } = computeRichFloatPlacement(target)
    bar.style.left = `${left}px`
    bar.style.top = `${top}px`
    bar.classList.add('is-visible')
    bar.removeAttribute('aria-hidden')
  }

  function hideRichFloatBar() {
    if (!richFloatEl) return
    richFloatEl.classList.remove('is-visible')
    richFloatEl.setAttribute('aria-hidden', 'true')
  }

  function richFloatBarVisible() {
    return Boolean(richFloatEl?.classList.contains('is-visible'))
  }

  function hideRichFloat() {
    hideRichFloatBar()
    activeRichEditorQuestionId = ''
    activeRichEditorField = ''
  }

  function pointerInRichFloatHotZone(clientX, clientY) {
    const el = activeRichEditorEl()
    if (!el) return false
    const pad = 4
    const inRect = (r) => (
      clientX >= r.left - pad
      && clientX <= r.right + pad
      && clientY >= r.top - pad
      && clientY <= r.bottom + pad
    )
    if (inRect(el.getBoundingClientRect())) return true
    const { left, top } = computeRichFloatPlacement(el)
    const floatW = richFloatEl?.offsetWidth || 248
    const floatH = richFloatEl?.offsetHeight || 40
    if (inRect({ left, top, right: left + floatW, bottom: top + floatH })) return true
    if (richFloatBarVisible() && richFloatEl && inRect(richFloatEl.getBoundingClientRect())) return true
    return false
  }

  function refreshRichFloatVisibility(event) {
    if (mathEditorOpen || symbolModalOpen) return
    const clientX = event?.clientX ?? lastPointerX
    const clientY = event?.clientY ?? lastPointerY
    if (!activeRichEditorQuestionId) {
      hideRichFloatBar()
      return
    }
    const el = activeRichEditorEl()
    if (!el) {
      hideRichFloatBar()
      return
    }
    if (pointerInRichFloatHotZone(clientX, clientY)) {
      showRichFloatBar(el)
      return
    }
    hideRichFloatBar()
  }

  let richFloatPointerBound = false
  function bindRichFloatPointerTracking() {
    if (richFloatPointerBound) return
    richFloatPointerBound = true
    document.addEventListener('pointermove', (event) => {
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      refreshRichFloatVisibility(event)
    }, true)
    document.addEventListener('pointerdown', (event) => {
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      refreshRichFloatVisibility(event)
    }, true)
  }

  function sheetOptionsMarkup(question) {
    if (!question.options?.length && question.type !== '选择题') return ''
    const body = question.optionsHtml || escapeHtml((question.options || []).join('\n'))
    return `<div class="wb3-sheet-q-options wb3-rich-editable" contenteditable="true">${body}</div>`
  }

  function sheetAnswerBodyMarkup(question) {
    const answerText = question.answer ?? questionAnswerText(question)
    const analysisText = question.analysis ?? questionAnalysisText(question)
    const answerBody = question.answerHtml || escapeHtml(answerText)
    const analysisBody = question.analysisHtml || escapeHtml(analysisText)
    return `<div class="wb3-sheet-q-answer"><p class="wb3-answer-row"><b>答案</b><span class="wb3-sheet-q-answer-text wb3-rich-editable" contenteditable="true" data-answer-field="answer">${answerBody}</span></p><p class="wb3-answer-row"><b>解析</b><span class="wb3-sheet-q-answer-text wb3-rich-editable" contenteditable="true" data-answer-field="analysis">${analysisBody}</span></p></div>`
  }

  function mathEditorModalMarkup() {
    if (!mathEditorOpen) return ''
    return `<div class="wb3-overlay wb3-math-overlay" data-close-math-editor><div class="wb3-math-modal" role="dialog" aria-label="公式编辑器"><header><b>公式编辑器</b><button type="button" data-close-math-editor aria-label="关闭">×</button></header><div class="wb3-math-tabs"><button type="button" class="active">可视化编辑</button><button type="button" disabled title="后续支持">表格模式</button></div><div class="wb3-math-toolbar">${MATH_STRUCTURE_BUTTONS.map((item) => `<button type="button" data-math-insert="${escapeHtml(item.insert)}">${escapeHtml(item.label)}</button>`).join('')}</div><div class="wb3-math-body"><div class="wb3-math-preview" id="wb3MathPreview">${escapeHtml(mathEditorPreview)}</div><aside class="wb3-math-presets"><b>学科公式 · 数学</b>${SUBJECT_FORMULA_PRESETS.map((item) => `<button type="button" data-math-preset="${escapeHtml(item.latex)}" data-math-display="${escapeHtml(item.display)}"><span>${escapeHtml(item.name)}</span><em>${escapeHtml(item.display)}</em></button>`).join('')}</aside></div><footer><button type="button" data-close-math-editor>取消</button><button type="button" class="primary" data-math-confirm>确认</button></footer></div></div>`
  }

  function symbolModalMarkup() {
    if (!symbolModalOpen) return ''
    const symbols = SYMBOL_GRID[symbolModalTab] || []
    return `<div class="wb3-overlay wb3-symbol-overlay" data-close-symbol-modal><div class="wb3-symbol-modal" role="dialog" aria-label="插入符号"><header><b>插入符号</b><button type="button" data-close-symbol-modal aria-label="关闭">×</button></header><nav class="wb3-symbol-tabs">${SYMBOL_TABS.map((tab) => `<button type="button" class="${symbolModalTab === tab.id ? 'active' : ''}" data-symbol-tab="${tab.id}">${tab.label}</button>`).join('')}</nav><div class="wb3-symbol-grid">${symbols.map((sym) => `<button type="button" data-symbol-char="${escapeHtml(sym)}">${escapeHtml(sym)}</button>`).join('')}</div></div></div>`
  }

  function removeSheetQuestionById(sheetId) {
    activeDraft.questions = activeDraft.questions.filter((q) => q.id !== sheetId)
    if (selectedQuestionId === sheetId) selectedQuestionId = ''
    if (answerEditorQuestionId === sheetId) answerEditorQuestionId = ''
    revealedAnswerIds.delete(sheetId)
    persistDraft()
    showToast('已删除题目')
    render()
  }

  function draftMeta() {
    const confirmed = (activeDraft?.questions || []).filter((q) => q.status === 'confirmed')
    const pending = (activeDraft?.questions || []).filter((q) => q.status === 'adapt')
    const score = confirmed.reduce((sum, q) => sum + Number(q.score || 0), 0)
    const pendingScore = pending.reduce((sum, q) => sum + Number(q.score || 0), 0)
    const minutes = Math.max(5, Math.round(confirmed.length * 1.8))
    const typeCount = {}
    const diffCount = {}
    const knowledgeSet = new Set()
    confirmed.forEach((q) => {
      typeCount[q.type] = (typeCount[q.type] || 0) + 1
      diffCount[q.difficulty] = (diffCount[q.difficulty] || 0) + 1
      if (q.knowledge) knowledgeSet.add(q.knowledge)
    })
    return { count: confirmed.length, score, minutes, pendingCount: pending.length, pendingScore, typeCount, diffCount, knowledgeCount: knowledgeSet.size }
  }

  function saveDraftToLocalStorage() {
    if (!activeDraft) return
    activeDraft.curriculumKey = curriculumKey
    try {
      const drafts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').filter((d) => d.id !== activeDraft.id)
      drafts.unshift(activeDraft)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts.slice(0, 20)))
      localStorage.setItem(ACTIVE_DRAFT_KEY, activeDraft.id)
    } catch { /* ignore */ }
  }

  function persistDraft() {
    if (!activeDraft) return
    activeDraft.updatedAt = Date.now()
    saveDraftToLocalStorage()
  }

  function saveDraftManually(options = {}) {
    const { silent = false } = options
    if (!activeDraft || !hasUnsavedCanvasChanges()) return false
    const isResave = Number(activeDraft.savedAt || 0) > 0
    activeDraft.savedAt = Date.now()
    activeDraft.updatedAt = activeDraft.savedAt
    activeDraft.savedSnapshot = captureDraftSnapshot(activeDraft)
    saveDraftToLocalStorage()
    render()
    if (!silent) showToast(isResave ? '已更新保存到「我的题单」' : '已保存到「我的题单」')
    return true
  }

  function saveDraftManuallyIfDirty(options = {}) {
    if (!hasUnsavedCanvasChanges()) return false
    return saveDraftManually(options)
  }

  function syncNewDraftNavigationStateFromSession() {
    try {
      suspendedDraftIdForNewButton = sessionStorage.getItem(SUSPENDED_DRAFT_SESSION_KEY) || ''
      plusCreatesBlankOnNew = sessionStorage.getItem(PLUS_BLANK_SESSION_KEY) === '1'
    } catch {
      suspendedDraftIdForNewButton = ''
      plusCreatesBlankOnNew = false
    }
  }

  function clearNewDraftNavigationState() {
    suspendedDraftIdForNewButton = ''
    plusCreatesBlankOnNew = false
    try {
      sessionStorage.removeItem(SUSPENDED_DRAFT_SESSION_KEY)
      sessionStorage.removeItem(PLUS_BLANK_SESSION_KEY)
    } catch { /* ignore */ }
  }

  function confirmedQuestionCount(draft) {
    return (draft?.questions || []).filter((q) => q.status === 'confirmed').length
  }

  function loadDraftById(draftId) {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').find((item) => item.id === draftId) || null
    } catch {
      return null
    }
  }

  function activateDraft(draft) {
    if (!draft) return false
    activeDraft = draft
    if (draft.curriculumKey && curriculumCatalog[draft.curriculumKey]) curriculumKey = draft.curriculumKey
    activeDraft.subject = activeDraft.subject || currentCurriculum().subject
    if (!activeDraft.savedAt) activeDraft.savedAt = 0
    selectedQuestionId = ''
    revealedAnswerIds = new Set()
    adaptRequest = null
    adaptPicker = null
    answerEditorQuestionId = ''
    localStorage.setItem(ACTIVE_DRAFT_KEY, draft.id)
    return true
  }

  function prepareKnowledgeEditSwitch(targetDraftId) {
    let drafts = []
    try { drafts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { drafts = [] }
    const previousActiveId = localStorage.getItem(ACTIVE_DRAFT_KEY)
    const previousDraft = previousActiveId ? drafts.find((item) => item.id === previousActiveId) : null

    clearNewDraftNavigationState()

    if (previousActiveId && previousActiveId !== targetDraftId && previousDraft) {
      const discardOutcome = discardUnsavedDraftChanges(previousDraft)

      if (discardOutcome === 'discarded') {
        drafts = drafts.filter((item) => item.id !== previousActiveId)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts.slice(0, 20)))
      } else if (discardOutcome === 'reverted') {
        drafts = [previousDraft, ...drafts.filter((item) => item.id !== previousActiveId)]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts.slice(0, 20)))
      } else {
        const previousCount = confirmedQuestionCount(previousDraft)
        if (previousCount > 0) {
          previousDraft.updatedAt = Date.now()
          drafts = [previousDraft, ...drafts.filter((item) => item.id !== previousActiveId)]
          localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts.slice(0, 20)))
          suspendedDraftIdForNewButton = previousActiveId
          plusCreatesBlankOnNew = false
          try { sessionStorage.setItem(SUSPENDED_DRAFT_SESSION_KEY, previousActiveId) } catch { /* ignore */ }
        } else {
          plusCreatesBlankOnNew = true
          try { sessionStorage.setItem(PLUS_BLANK_SESSION_KEY, '1') } catch { /* ignore */ }
        }
      }
    } else if (previousActiveId !== targetDraftId) {
      plusCreatesBlankOnNew = true
      try { sessionStorage.setItem(PLUS_BLANK_SESSION_KEY, '1') } catch { /* ignore */ }
    }

    localStorage.setItem(ACTIVE_DRAFT_KEY, targetDraftId)
  }

  function startNewDraft() {
    if (!canvasHasQuestions()) return
    syncNewDraftNavigationStateFromSession()

    if (hasUnsavedCanvasChanges()) {
      saveBeforeNewDialogOpen = true
      render()
      return
    }

    saveDraftToLocalStorage()

    if (suspendedDraftIdForNewButton && !plusCreatesBlankOnNew) {
      const suspended = loadDraftById(suspendedDraftIdForNewButton)
      if (suspended && suspended.id !== activeDraft?.id) {
        activateDraft(suspended)
        clearNewDraftNavigationState()
        importWorkspaceView = 'library'
        activeImportRecordId = ''
        activeAiComposeRecordId = ''
        previewKnowledgePaperId = ''
        persistDraft()
        render()
        showToast(`已打开「${suspended.title || DEFAULT_DRAFT_TITLE}」`)
        return
      }
    }

    clearNewDraftNavigationState()
    activeDraft = createBlankDraft()
    selectedQuestionId = ''
    revealedAnswerIds = new Set()
    adaptRequest = null
    adaptPicker = null
    importWorkspaceView = 'library'
    activeImportRecordId = ''
    activeAiComposeRecordId = ''
    previewKnowledgePaperId = ''
    persistDraft()
    render()
    showToast('已新建空白题单')
  }

  function showToast(text) {
    const toast = $('#wb3Toast', root)
    if (!toast) return
    toast.textContent = text
    toast.classList.add('show')
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200)
  }

  function currentCurriculum() {
    return curriculumCatalog[curriculumKey] || curriculumCatalog['小学数学']
  }

  function currentTextbookSpec() {
    return textbookCatalog[curriculumKey] || textbookCatalog['小学数学']
  }

  function currentTextbook() {
    const spec = currentTextbookSpec()
    const saved = textbookSelection[curriculumKey]
    const editionName = spec.editions.some((item) => item.name === saved?.edition) ? saved.edition : spec.edition
    const edition = spec.editions.find((item) => item.name === editionName) || spec.editions[0]
    const year = Number(saved?.year || spec.year)
    const volume = edition.volumes.find((item) => item.label === (saved?.volume || spec.volume) && item.year === year)
      || edition.volumes.find((item) => item.label === spec.volume)
      || edition.volumes[0]
    return { edition: edition.name, volume: volume.label, year: volume.year, isNew: volume.isNew, editions: spec.editions, editionObj: edition }
  }

  function setCurrentTextbook(edition, volume, year) {
    const spec = currentTextbookSpec()
    const editionObj = spec.editions.find((item) => item.name === edition) || spec.editions[0]
    const picked = editionObj.volumes.find((item) => item.label === volume && item.year === Number(year))
      || editionObj.volumes.find((item) => item.label === volume)
      || editionObj.volumes[0]
    textbookSelection[curriculumKey] = { edition: editionObj.name, volume: picked.label, year: picked.year }
    saveTeacherContextToStorage()
  }

  function shortVolumeLabel(volume) {
    const grade = String(volume || '').match(/^([一二三四五六七八九十]+)年级([上下])册/)
    if (grade) return `${grade[1]}${grade[2]}`
    const required = String(volume || '').match(/^必修第([一二三四])册/)
    if (required) return `必修${required[1]}`
    const optional = String(volume || '').match(/^选择性必修第([一二三四])册/)
    if (optional) return `选必${optional[1]}`
    return volume
  }

  function textbookLabel(textbook = currentTextbook()) {
    return `${textbook.edition}/${shortVolumeLabel(textbook.volume)}（${textbook.year}）`
  }

  function currentChapterTree() {
    const textbook = currentTextbook()
    return chapterTreeCatalog[`${curriculumKey}|${textbook.edition}|${textbook.volume}`]
      || {
        groups: currentCurriculum().groups,
        parents: currentCurriculum().parents,
        aliases: {},
      }
  }

  function activeTree() {
    if (questionSource === 'official' && chapterBrowseMode === 'chapter') return currentChapterTree()
    return { ...currentCurriculum(), aliases: currentCurriculum().aliases || {} }
  }

  function questionMatchesTreeNode(question, name, tree = activeTree()) {
    if (!name || name === '全部知识点') return true
    const aliases = [name, ...(tree.aliases?.[name] || [])]
    const knowledgeTags = questionKnowledgeTags(question)
    if (tree.parents[name]) {
      return aliases.some((alias) => knowledgeTags.includes(alias)) || tree.parents[name].some((child) => questionMatchesTreeNode(question, child, tree))
    }
    return aliases.some((alias) => knowledgeTags.includes(alias))
  }

  function expandDefaultChapters() {
    const first = Object.keys(currentChapterTree().parents)[0]
    expandedChapterParents = new Set(first ? [first] : [])
    if (first && (chapterBrowseMode === 'chapter')) activeKnowledge = first
  }

  function textbookPickerMarkup() {
    const current = currentTextbook()
    const previewEditionName = current.editions.some((item) => item.name === textbookPickerEdition) ? textbookPickerEdition : current.edition
    const previewEdition = current.editions.find((item) => item.name === previewEditionName) || current.editions[0]
    return `<div class="wb3-textbook-picker ${textbookPickerOpen ? 'open' : ''}">
      <button type="button" data-toggle-textbook-picker aria-expanded="${textbookPickerOpen}" aria-label="教材版本"><span>${escapeHtml(textbookLabel(current))}</span><em>${textbookPickerOpen ? '⌃' : '⌄'}</em></button>
      ${textbookPickerOpen ? `<div class="wb3-textbook-panel" role="listbox" aria-label="选择教材版本">
        <div class="wb3-textbook-editions">${current.editions.map((item) => `<button type="button" class="${item.name === previewEdition.name ? 'active' : ''}" data-textbook-edition="${escapeHtml(item.name)}">${escapeHtml(item.name)}<i>›</i></button>`).join('')}</div>
        <div class="wb3-textbook-volumes">${previewEdition.volumes.map((item) => `<button type="button" class="${item.label === current.volume && item.year === current.year && previewEdition.name === current.edition ? 'active' : ''}" data-textbook-pick="${escapeHtml(`${previewEdition.name}|${item.label}|${item.year}`)}">${escapeHtml(`${item.label}(${item.year})`)}${item.isNew ? '<em>新</em>' : ''}</button>`).join('')}</div>
      </div>` : ''}
    </div>`
  }

  function currentBankPapers() {
    const current = currentTextbook()
    const query = treeSearchQuery.trim().toLowerCase()
    return bankPapers.filter((paper) => {
      if ((paper.curriculum || '小学数学') !== curriculumKey) return false
      if (paper.edition && paper.edition !== current.edition) return false
      if (paper.volume && paper.volume !== current.volume) return false
      if (!query) return true
      return paper.title.toLowerCase().includes(query) || paper.meta.toLowerCase().includes(query) || paper.paperType.toLowerCase().includes(query)
    })
  }

  function switchToLibraryTab(source) {
    saveBankSearchToStorage()
    aiRecordingDrawerOpen = false
    aiComposeResultViewId = ''
    aiComposeReturnScrollTop = 0
    personalImportRecordViewId = ''
    personalImportReturnScrollTop = 0
    importWorkspaceView = 'library'
    questionSource = source === 'personal' ? 'personal' : 'official'
    selectedPersonalQuestionIds = new Set()
    personalBatchMode = false
    if (questionSource === 'official') {
      previewBankPaperId = ''
      previewKnowledgePaperId = ''
    } else if (personalLibraryMode !== 'papers') {
      personalLibraryMode = 'questions'
      previewKnowledgePaperId = ''
    }
    applyBankSearchFromStorage()
    officialPage = 1
  }

  function openPersonalPapersLibrary(paperId = '') {
    saveBankSearchToStorage()
    personalImportRecordViewId = ''
    personalImportReturnScrollTop = 0
    importWorkspaceView = 'library'
    questionSource = 'personal'
    selectedPersonalQuestionIds = new Set()
    personalBatchMode = false
    personalLibraryMode = 'papers'
    previewKnowledgePaperId = paperId
    personalPaperReturnScrollTop = 0
    previewBankPaperId = ''
    applyBankSearchFromStorage()
    officialPage = 1
  }

  function openAiRecording() {
    if (importWorkspaceView !== 'library' || questionSource !== 'personal') {
      switchToLibraryTab('personal')
      personalLibraryMode = 'questions'
      importWorkspaceView = 'library'
    }
    aiRecordingDrawerOpen = true
  }

  function knowledgePapersPageMarkup() {
    const papers = allKnowledgePapers()
    return `<div class="wb3-knowledge-page"><div class="wb3-import-page-title"><div><h2>我的题单</h2><p class="wb3-knowledge-path">${escapeHtml(KNOWLEDGE_COMPOSE_FOLDER)}</p><small>这里展示你已保存的题单，可整份或逐题加入当前题单。</small></div></div>${papers.length ? `<div class="wb3-knowledge-grid">${papers.map((paper) => `<article><span>${icons.blank}</span><div><b>${escapeHtml(paper.title)}</b><small>${escapeHtml(paper.meta)}</small></div><div><button type="button" data-preview-knowledge="${paper.id}">查看</button></div></article>`).join('')}</div>` : personalPapersEmptyMarkup()}</div>`
  }

  function personalPapersEmptyMarkup() {
    return `<div class="wb3-empty-results wb3-empty-papers"><b>还没有题单</b><p>从右侧「当前题单」开始组题，组好后点击保存，就会出现在这里。</p></div>`
  }

  function personalLibrarySubtabsMarkup() {
    const processingCount = aiImportRecords.filter((record) => record.status === 'processing').length
    const statusText = processingCount ? `，${processingCount}个文件正在AI录题` : ''
    const importAction = personalLibraryMode === 'questions'
      ? `<div class="wb3-personal-import-action"><span class="wb3-personal-import-hint">上传试卷，AI 自动识别并录入题库</span><button type="button" class="wb3-personal-header-import wb3-personal-subtab-import ${aiRecordingDrawerOpen ? 'is-open' : ''}" data-open-personal-import aria-label="上传文件${statusText}" aria-expanded="${aiRecordingDrawerOpen}">${icons.upload}<span>上传文件</span>${processingCount ? `<em class="wb3-ai-recording-badge processing">${Math.min(processingCount, 99)}</em>` : ''}</button></div>`
      : ''
    return `<div class="wb3-personal-subtabs"><div class="wb3-personal-tabs" role="tablist" aria-label="我的题库内容"><button type="button" role="tab" data-personal-library="questions" aria-selected="${personalLibraryMode === 'questions'}" class="${personalLibraryMode === 'questions' ? 'active' : ''}">试题</button><button type="button" role="tab" data-personal-library="papers" aria-selected="${personalLibraryMode === 'papers'}" class="${personalLibraryMode === 'papers' ? 'active' : ''}">题单</button></div>${importAction}</div>`
  }

  function personalQuestionMatchesCollection(question, collection = personalCollection) {
    if (collection === 'all') return true
    if (collection.startsWith('tag:')) return (question.customTags || []).includes(collection.slice(4))
    return true
  }

  function personalCollectionCount(collection) {
    return personalQuestions.filter((question) => personalQuestionMatchesCollection(question, collection)).length
  }

  function personalTagOptions() {
    return [...new Set([...personalTagCatalog, ...personalQuestions.flatMap((question) => question.customTags || [])])]
  }

  function personalCurriculumOptions() {
    return [...new Set(personalQuestions.flatMap((question) => questionCurriculumTags(question)))]
  }

  function personalKnowledgeOptions() {
    if (personalCurriculumFilter === 'all') return []
    return [...new Set(personalQuestions
      .filter((question) => questionCurriculumTags(question).includes(personalCurriculumFilter))
      .flatMap((question) => questionKnowledgeTags(question))
      .filter(Boolean))]
  }

  function personalKnowledgeFilterLabel(name) {
    const catalog = curriculumCatalog[personalCurriculumFilter]
    const parent = Object.entries(catalog?.parents || {}).find(([, children]) => children.includes(name))?.[0]
    return [parent, name].filter(Boolean).join(' / ')
  }

  function personalPapersListMarkup(papers) {
    if (!papers.length) return personalPapersEmptyMarkup()
    return `<div class="wb3-bank-paper-list">${papers.map((paper) => `<article class="wb3-bank-paper-card"><span class="wb3-paper-card-icon">${icons.blank}</span><div><b>${escapeHtml(paper.title)}</b><small>${escapeHtml(paper.meta)}</small></div><div><button type="button" data-edit-knowledge-paper="${paper.id}">编辑</button><button type="button" data-preview-knowledge="${paper.id}">查看</button><button type="button" data-delete-knowledge-paper="${paper.id}">删除</button></div></article>`).join('')}</div>`
  }

  function knowledgePaperPreviewMarkup(previewPaper, addedMap, { showBack = false } = {}) {
    const back = showBack ? `<button type="button" data-back-knowledge>返回题单列表</button>` : ''
    return `<div class="wb3-record-detail"><div class="wb3-import-page-title">${back}<div><h2>${escapeHtml(previewPaper.title)}</h2><p>${escapeHtml(previewPaper.meta)}</p></div><button type="button" class="primary" data-import-knowledge-all="${previewPaper.id}">全部选用</button></div><div class="wb3-import-question-list">${previewPaper.questions.map((question) => questionCardMarkup(question, addedMap)).join('')}</div></div>`
  }

  function bankPaperListMarkup(addedMap) {
    if (previewBankPaperId) {
      const paper = bankPapers.find((item) => item.id === previewBankPaperId)
      if (!paper) return '<div class="wb3-empty-results">暂无试卷</div>'
      return `<div class="wb3-paper-preview-head"><button type="button" data-back-bank-paper>返回试卷列表</button><div><b>${escapeHtml(paper.title)}</b><small>${escapeHtml(paper.meta)}</small></div><button type="button" class="primary" data-import-bank-paper="${paper.id}">全部选用</button></div><div class="wb3-import-question-list">${paper.questions.map((question) => questionCardMarkup(question, addedMap)).join('')}</div>`
    }
    const papers = currentBankPapers()
    if (!papers.length) return '<div class="wb3-empty-results"><b>该教材版本下暂无试卷</b><p>可切换教材版本，或回到教材章节选题。</p></div>'
    return `<div class="wb3-bank-paper-list">${papers.map((paper) => `<article class="wb3-bank-paper-card"><div><b>${escapeHtml(paper.title)}</b><small>${escapeHtml(paper.meta)}</small></div><div><button type="button" data-preview-bank-paper="${paper.id}">查看题目</button><button type="button" class="primary" data-import-bank-paper="${paper.id}">全部选用</button></div></article>`).join('')}</div>`
  }

  function currentPersonalImportRecord() {
    return aiImportRecords.find((record) => record.id === personalImportRecordViewId && record.status === 'completed') || null
  }

  function currentBankQuestions() {
    if (questionSource === 'personal') {
      const byLatestRecording = (questions) => [...questions].sort((left, right) => (Number(right.recordedAt) || 0) - (Number(left.recordedAt) || 0))
      const importRecord = currentPersonalImportRecord()
      if (importRecord) {
        const importedIds = new Set((importRecord.questions || []).map((question) => question.id))
        return byLatestRecording(personalQuestions.filter((question) => importedIds.has(question.id)))
      }
      return byLatestRecording(personalQuestions.filter((question) => personalQuestionMatchesCollection(question)))
    }
    return bankQuestions.filter((question) => question.curriculum === curriculumKey)
  }

  function findQuestionById(id) {
    return currentBankQuestions().find((question) => question.id === id)
      || bankQuestions.find((question) => question.id === id)
      || personalQuestions.find((question) => question.id === id)
      || allKnowledgePapers().flatMap((paper) => paper.questions || []).find((question) => question.id === id)
      || aiImportRecords.flatMap((record) => record.questions || []).find((question) => question.id === id)
      || aiComposeRecords.flatMap((record) => record.questions || []).find((question) => question.id === id)
  }

  function knowledgeCount(name) {
    const tree = activeTree()
    const questions = currentBankQuestions()
    if (name === '全部知识点') return questions.length
    return questions.filter((question) => questionMatchesTreeNode(question, name, tree)).length
  }

  function questionsInTreeScope() {
    const tree = activeTree()
    const treeQuery = treeSearchQuery.trim().toLowerCase()
    return currentBankQuestions().filter((question) => {
      if (questionSource === 'personal') {
        if (!treeQuery) return true
        return questionKnowledgeTags(question).some((tag) => tag.toLowerCase().includes(treeQuery))
          || questionCurriculumTags(question).some((tag) => curriculumTagLabel(tag).toLowerCase().includes(treeQuery))
          || questionTypeTags(question).some((tag) => tag.toLowerCase().includes(treeQuery))
          || question.text.toLowerCase().includes(treeQuery)
          || (question.customTags || []).some((tag) => tag.toLowerCase().includes(treeQuery))
          || (question.options || []).some((option) => option.toLowerCase().includes(treeQuery))
      }
      if (treeQuery) {
        return question.knowledge.toLowerCase().includes(treeQuery)
          || question.text.toLowerCase().includes(treeQuery)
          || (question.options || []).some((option) => option.toLowerCase().includes(treeQuery))
          || Object.entries(tree.parents).some(([parent, children]) => parent.toLowerCase().includes(treeQuery) && children.includes(question.knowledge))
          || questionMatchesTreeNode(question, treeQuery, tree)
      }
      return questionMatchesTreeNode(question, activeKnowledge, tree)
    })
  }

  function filterBankQuestions() {
    const tree = activeTree()
    const treeQuery = treeSearchQuery.trim().toLowerCase()
    const scoped = currentBankQuestions().filter((question) => {
      const scopeMatch = questionSource === 'personal'
        ? !treeQuery
          || questionKnowledgeTags(question).some((tag) => tag.toLowerCase().includes(treeQuery))
          || questionCurriculumTags(question).some((tag) => curriculumTagLabel(tag).toLowerCase().includes(treeQuery))
          || questionTypeTags(question).some((tag) => tag.toLowerCase().includes(treeQuery))
          || question.text.toLowerCase().includes(treeQuery)
          || (question.customTags || []).some((tag) => tag.toLowerCase().includes(treeQuery))
          || (question.options || []).some((option) => option.toLowerCase().includes(treeQuery))
        : treeQuery
        ? question.knowledge.toLowerCase().includes(treeQuery)
          || question.text.toLowerCase().includes(treeQuery)
          || (question.options || []).some((option) => option.toLowerCase().includes(treeQuery))
          || Object.entries(tree.parents).some(([parent, children]) => parent.toLowerCase().includes(treeQuery) && children.includes(question.knowledge))
        : questionMatchesTreeNode(question, activeKnowledge, tree)
      const typeMatch = filterType === '全部题型' || (questionSource === 'personal' ? questionTypeTags(question).includes(filterType) : question.type === filterType)
      const difficultyMatch = filterDifficulty === '全部难度' || (questionSource === 'personal' ? questionDifficultyTags(question).includes(filterDifficulty) : question.difficulty === filterDifficulty)
      const curriculumMatch = questionSource !== 'personal' || personalCurriculumFilter === 'all' || questionCurriculumTags(question).includes(personalCurriculumFilter)
      const knowledgeMatch = questionSource !== 'personal' || personalKnowledgeFilter === 'all' || questionKnowledgeTags(question).includes(personalKnowledgeFilter)
      return scopeMatch && curriculumMatch && knowledgeMatch && typeMatch && difficultyMatch
    })
    if (questionSource === 'official') {
      return scoped.sort((a, b) => (Number(b.onlineAt || 0) - Number(a.onlineAt || 0)) || String(a.id).localeCompare(String(b.id)))
    }
    return scoped
  }

  function emptyResultsMarkup(filteredCount, treeScopedCount) {
    if (questionSource === 'personal' && personalQuestions.length === 0) {
      return `<div class="wb3-empty-results wb3-empty-personal"><b>还没有题目</b><p>上传 Word、PDF 或图片，AI 自动识别题目和答案并录入我的题库</p><button type="button" class="wb3-empty-upload-btn primary" data-empty-import="upload">${icons.upload}上传文件</button></div>`
    }
    if (questionSource === 'personal') {
      return `<div class="wb3-empty-results"><b>未找到符合条件的题目</b><button type="button" class="wb3-empty-upload-btn" data-clear-bank-filters>清除筛选</button></div>`
    }
    if (treeScopedCount === 0 && !treeSearchQuery.trim()) {
      return `<div class="wb3-empty-results">暂无题目</div>`
    }
    return `<div class="wb3-empty-results"><b>未找到符合条件的题目</b><button type="button" class="wb3-empty-upload-btn" data-clear-bank-filters>清除筛选</button></div>`
  }

  function firstKnowledgeName(tree = activeTree()) {
    return tree.groups.find(([name]) => name !== '全部知识点')?.[0] || ''
  }

  function visibleTreeGroups() {
    const tree = activeTree()
    const query = treeSearchQuery.trim().toLowerCase()
    const browseByChapter = questionSource === 'official' && chapterBrowseMode === 'chapter'
    const groups = tree.groups.filter(([name]) => name !== '全部知识点')
    const visible = !query
      ? groups
      : groups.filter(([name]) => (
        name.toLowerCase().includes(query)
        || tree.parents[name]?.some((child) => child.toLowerCase().includes(query))
        || Object.entries(tree.parents).some(([parent, children]) => children.includes(name) && parent.toLowerCase().includes(query))
      ))
    return browseByChapter
      ? visible.filter(([name]) => tree.parents[name] || Object.entries(tree.parents).some(([parent, children]) => children.includes(name) && expandedChapterParents.has(parent)))
      : visible
  }

  function questionAnswerText(question) {
    if (question.answer) return question.answer
    return {
      b1: '2又1/3小时。', b2: '24；20；40；12。', b3: 'C. 线段', b4: 'B. 线段', b5: 'C. 39', b6: '2个。', b7: '425米/分。', b8: 'A. 180°', b9: '7/72立方分米。', b10: 'D. 可能互相平行，也可能互相垂直',
      b29: 'A. 一千万零一千', b30: '300050008', b31: 'B. 千万位', b32: '十亿', b33: 'B. 十亿', b34: 'B. 100000000', b35: '<', b36: 'B. 380 万', b37: '385', b38: 'B. 8', b39: '100000000', b40: 'D. 10000 米', b41: '2000 个。',
      cn1: '结合具体语境判断。', cn2: '依据句子成分与搭配判断。', cn3: '抓住人物的语言、动作和心理描写概括。', cn4: '开放性答案。',
      en1: 'C. weekend', en2: 'goes', en3: 'According to the passage.', en4: '开放性答案。',
      jm1: 'B. 3', jm2: 'x＝4', jm3: '70°', jm4: '开放性答案。', hm1: '{2,3}', hm2: 'x＝1', hm3: '见标准证明过程。', hm4: '开放性答案。',
    }[question.originId || question.sourceId || question.id] || question.answer || '请查看题库答案。'
  }

  function questionAnalysisText(question) {
    if (question.analysis) return question.analysis
    const id = question.originId || question.sourceId || question.id
    return {
      b1: '先分别计算两种无人机每小时完成的工作量，再用剩余工作量除以两架无人机的效率和。',
      b2: '沿不同方向对折时，对折方向的边长减半，另一条边保持不变。',
      b3: '线段有两个端点，符合“有始有终”的含义。',
      b4: '延长后仍有两个确定端点，所以所得图形仍是线段。',
      b5: '积为四位数需满足256×□≤9999，据此求出方框内的最大整数。',
      b6: '将各因数分解质因数，统计2和5能够配成多少组10。',
      b7: '先求乙领先的路程，再用领先路程除以追及时间求速度差。',
      b8: '30分钟内分针转过半圈，即180°。',
      b9: '先用底面积乘高求长方体体积，再与正方体体积作差。',
      b10: '两次对折的方向不同，得到的折痕关系也会不同。',
      b29: '从高位读起，万级是 1000 万，个级是 1000，中间用“零”连接。',
      b30: '3 个亿是 300000000，5 个万是 50000，再加 8，合起来是 300050008。',
      b31: '从右边起第 8 位是千万位，38050000 中的 8 在千万位。',
      b32: '计数单位“亿”的相邻更高单位是“十亿”，10 个一亿是 1 个十亿。',
      b33: '1 后面有 9 个 0，是十亿。',
      b34: '位数多的数更大，1 亿是 9 位数，其余是 8 位数。',
      b35: '两个数位数相同，从最高位比起，千万位都是 8，百万位 0＜1。',
      b36: '3800000＝380×10000，所以改写成 380 万。',
      b37: '看千位是 6，满 5 向前一位进 1，3846200≈385 万。',
      b38: '千万位是从右边数第 8 位，所以是 8 位数。',
      b39: '99990000＋10000＝100000000。',
      b40: '1 亿张 × 0.1 毫米＝10000000 毫米＝10000 米。',
      b41: '1 亿÷5 万＝100000000÷50000＝2000。',
    }[id] || `围绕“${question.knowledge || '本题考点'}”提取条件，选择对应公式或关系，分步推理并核对结果。`
  }

  function personalQuestionLabelGroupMarkup(question, group, title, values, { formatter = (value) => value, emptyText = '待完善' } = {}) {
    const labels = values.map(formatter).filter(Boolean)
    const displayText = labels.length ? labels.join('，') : emptyText
    const tooltip = `${title}：${displayText}`
    return `<span class="wb3-question-label-group group-${group}"><button type="button" class="wb3-question-label-chip ${labels.length ? '' : 'empty'}" data-open-question-label-editor="${escapeHtml(question.id)}" data-label-editor-focus="${group}" aria-label="编辑${escapeHtml(tooltip)}" title="${escapeHtml(tooltip)}">${escapeHtml(displayText)}</button></span>`
  }

  function personalQuestionLabelsMarkup(question, actionsMarkup) {
    const curriculumGroup = personalQuestionLabelGroupMarkup(question, 'curriculum', '阶段·科目', questionCurriculumTags(question), { formatter: curriculumTagLabel })
    const typeGroup = personalQuestionLabelGroupMarkup(question, 'type', '题型', questionTypeTags(question))
    const difficultyGroup = personalQuestionLabelGroupMarkup(question, 'difficulty', '难度', questionDifficultyTags(question))
    const knowledgeGroup = personalQuestionLabelGroupMarkup(question, 'knowledge', '知识点', questionKnowledgeTags(question))
    const customGroup = personalQuestionLabelGroupMarkup(question, 'custom', '自定义标签', question.customTags || [], { emptyText: '+ 标签' })
    return `<div class="wb3-question-labels"><div class="wb3-question-label-stream">${curriculumGroup}${typeGroup}${difficultyGroup}${knowledgeGroup}${customGroup}</div><button type="button" class="wb3-question-label-edit" data-open-question-label-editor="${escapeHtml(question.id)}" data-label-editor-focus="" aria-label="编辑题目标签" title="编辑题目标签">${icons.tag}</button>${actionsMarkup}</div>`
  }

  function questionCardMarkup(question, addedMap) {
    const addedIndex = addedMap.get(question.id)
    const answerShown = revealedAnswerIds.has(question.id)
    const answerText = questionAnswerText(question)
    const adapting = (adaptRequest?.inline && adaptRequest.source.id === question.id) || adaptPicker?.source.id === question.id
    const canManagePersonal = importWorkspaceView === 'library' && questionSource === 'personal' && personalQuestions.some((item) => item.id === question.id)
    const selectedForTags = selectedPersonalQuestionIds.has(question.id)
    const cardActions = `<span class="wb3-qcard-actions">
      ${canManagePersonal ? `<button type="button" class="delete" data-delete-personal-question="${question.id}" title="从我的题库删除" aria-label="从我的题库删除">${icons.trash}</button>` : ''}
      <button type="button" class="answer" data-quick-answer="${question.id}" title="${answerShown ? '收起答案' : '显示答案'}" aria-label="${answerShown ? '收起答案' : '显示答案'}">答</button>
      <button type="button" class="adapt" data-quick-adapt="${question.id}" title="AI 改编" aria-label="AI 改编">${icons.sparkle}</button>
      <button type="button" data-quick-add="${question.id}" title="${addedIndex ? '取消选用' : '选用题目'}" aria-label="${addedIndex ? '取消选用' : '选用题目'}">${addedIndex ? icons.check : icons.plus}</button>
    </span>`
    const personalLabels = canManagePersonal ? personalQuestionLabelsMarkup(question, cardActions) : ''
    const defaultTags = canManagePersonal ? '' : `<span class="wb3-qcard-tags"><span>${escapeHtml(question.type)}</span><span>${escapeHtml(question.difficulty)}</span><span>${escapeHtml(question.knowledge)}</span></span>`
    return `<article class="wb3-qcard ${addedIndex ? 'added' : ''} ${answerShown ? 'answer-open' : ''} ${adapting ? 'adapting' : ''} ${canManagePersonal ? 'wb3-qcard--personal' : ''} ${canManagePersonal && personalBatchMode ? 'is-batch-mode' : ''} ${selectedForTags ? 'selected-for-tags' : ''}" data-qid="${question.id}">
      ${addedIndex ? `<span class="wb3-added-status">已加入 · 第 ${addedIndex} 题</span>` : ''}
      <div class="wb3-qcard-main">
        ${defaultTags}
        <p>${escapeHtml(question.text)}</p>
        ${question.options?.length ? `<span class="wb3-qcard-options">${question.options.map((option) => `<span>${escapeHtml(option)}</span>`).join('')}</span>` : ''}
        ${personalLabels}
        ${answerShown ? `<span class="wb3-qcard-answer"><span><b>答案</b>${escapeHtml(answerText)}</span><span><b>解析</b>${escapeHtml(questionAnalysisText(question))}</span></span>` : ''}
      </div>
      ${canManagePersonal ? '' : cardActions}
      ${inlineAdaptMarkup(question)}
      ${canManagePersonal && personalBatchMode ? `<label class="wb3-personal-question-select" title="选择该题"><input type="checkbox" data-select-personal-question="${question.id}" ${selectedForTags ? 'checked' : ''}><span aria-hidden="true"></span><i class="sr-only">选择该题</i></label>` : ''}
    </article>`
  }

  function inlineAdaptThinkingMarkup() {
    const step = Math.min(adaptPicker?.thinkingStep ?? 0, ADAPT_THINKING_LINES.length - 1)
    const body = ADAPT_THINKING_LINES.map((line, index) => {
      if (index > step) return ''
      const state = index === step && adaptPicker?.loading ? 'current' : 'done'
      return `<p class="${state}">${escapeHtml(line)}${state === 'current' ? '…' : ''}</p>`
    }).join('')
    return `<div class="wb3-inline-adapt-thinking"><div class="wb3-inline-adapt-thinking-head"><i></i><b>生成进度</b><span>生成完成后自动收起</span></div><div class="wb3-inline-adapt-thinking-body">${body}</div></div>`
  }

  function inlineAdaptCandidateMarkup(candidate, index) {
    return `<article><div><span>AI 改编 ${index + 1}</span></div><p>${escapeHtml(candidate.text)}</p>${candidate.options?.length ? `<small>${candidate.options.map((option) => escapeHtml(option)).join('　')}</small>` : ''}<button type="button" class="wb3-inline-adapt-add" data-use-adapt-candidate="${candidate.id}" title="选用题目" aria-label="选用题目">${icons.plus}</button></article>`
  }

  function inlineAdaptMarkup(question) {
    const isRequesting = adaptRequest?.inline && adaptRequest.source.id === question.id
    const isGenerating = adaptPicker?.source.id === question.id
    if (!isRequesting && !isGenerating) return ''
    if (isRequesting) return `<section class="wb3-inline-adapt"><header><span>${icons.sparkle}</span><b>AI 改编</b><div class="wb3-inline-adapt-prompts"><button type="button" data-inline-adapt-prompt="换成生活情境，保持知识点和难度不变">换情境</button><button type="button" data-inline-adapt-prompt="降低难度，保持知识点不变">降低难度</button><button type="button" data-inline-adapt-prompt="生成同考点、不同数据的变式题">同考点变式</button></div><button type="button" data-close-inline-adapt aria-label="关闭AI改编" title="关闭">×</button></header><div class="wb3-inline-adapt-input"><textarea id="wb3InlineAdaptInput" rows="1" placeholder="描述改编要求"></textarea><button type="button" data-inline-adapt-submit>生成</button></div></section>`
    const candidates = adaptPicker.loading
      ? inlineAdaptThinkingMarkup()
      : `<div class="wb3-inline-adapt-options">${adaptPicker.candidates.map((candidate, index) => inlineAdaptCandidateMarkup(candidate, index)).join('')}</div>`
    return `<section class="wb3-inline-adapt results"><header><span>${icons.sparkle}</span><b>改编结果</b><button type="button" data-close-inline-adapt aria-label="关闭AI改编" title="关闭">×</button></header>${candidates}</section>`
  }

  function importMenuMarkup() {
    if (!importMenuOpen) return ''
    return `<div class="wb3-import-menu" role="menu">
      <button type="button" data-import="upload" role="menuitem">${icons.upload}<span><b>上传文件</b><small>上传试卷，AI 自动识别并录入我的题库</small></span></button>
      <button type="button" data-import="history" role="menuitem">${icons.blank}<span><b>AI录题记录</b><small>${aiImportRecords.filter((record) => record.status === 'processing').length} 个解析中 · 可复用历史结果</small></span></button>
      <button type="button" data-import="knowledge" role="menuitem">${icons.knowledge}<span><b>我的知识库</b><small>按整份题单预览或导入</small></span></button>
      <button type="button" data-import="ai-compose" role="menuitem">${icons.sparkle}<span><b>AI组题记录</b><small>查看 AI 从题库匹配的题单</small></span></button>
    </div>`
  }

  function knowledgeModalMarkup() {
    if (!knowledgeModalOpen) return ''
    return `<div class="wb3-overlay" data-close-overlay>
      <div class="wb3-modal" role="dialog" aria-labelledby="wb3KnowledgeTitle">
        <header><div><h2 id="wb3KnowledgeTitle">从知识库导入题单</h2><p>选择一份历史题单，选用后将直接加入右侧画布</p></div><button type="button" data-close-knowledge aria-label="关闭">×</button></header>
        <div class="wb3-modal-body">${allKnowledgePapers().map((p) => `<button class="wb3-knowledge-row" type="button" data-import-paper="${p.id}"><span>${icons.blank}</span><span><b>${escapeHtml(p.title)}</b><small>${escapeHtml(p.type)} · ${escapeHtml(p.meta)} · ${p.questions.length} 题</small></span>${icons.chevron}</button>`).join('')}</div>
      </div>
    </div>`
  }

  function buildAdaptCandidates(source, requirement = '') {
    const replaceNumbers = (text, offset) => text.replace(/\d+(?:\.\d+)?/g, (value) => {
      const number = Number(value)
      if (!Number.isFinite(number)) return value
      return String(Number.isInteger(number) ? Math.max(1, number + offset) : Math.max(0.1, Number((number + offset / 10).toFixed(1))))
    })
    return [
      { ...source, id: makeId('adapt-option'), originId: source.originId || source.id, source: 'ai-adapt', variant: '方案一', text: replaceNumbers(source.text, 2), adaptRequirement: requirement },
      { ...source, id: makeId('adapt-option'), originId: source.originId || source.id, source: 'ai-adapt', variant: '方案二', text: `学校开展数学实践活动，请运用“${source.knowledge}”解决下面的问题：${source.text}`, adaptRequirement: requirement },
      { ...source, id: makeId('adapt-option'), originId: source.originId || source.id, source: 'ai-adapt', variant: '方案三', difficulty: /降低|简单|基础/.test(requirement) ? '较易' : source.difficulty === '较易' ? '中等' : source.difficulty, score: Number(source.score || 1) + (/降低|简单|基础/.test(requirement) ? 0 : 1), text: `${source.text.replace(/。?$/, '')}，并说明你的思考过程。`, adaptRequirement: requirement },
    ]
  }

  function adaptPickerMarkup() {
    if (!adaptPicker) return ''
    const source = adaptPicker.source
    const pickerBody = adaptPicker.loading
      ? inlineAdaptThinkingMarkup()
      : adaptPicker.candidates.map((question, index) => `<article class="wb3-adapt-option"><div><span>方案 ${index + 1}</span></div><p>${escapeHtml(question.text)}</p>${question.options?.length ? `<small>${question.options.map((option) => escapeHtml(option)).join('　')}</small>` : ''}<button type="button" class="wb3-inline-adapt-add" data-use-adapt-candidate="${question.id}" title="${adaptPicker.targetId ? '选用并替换原题' : '选用题目'}" aria-label="${adaptPicker.targetId ? '选用并替换原题' : '选用题目'}">${icons.plus}</button></article>`).join('')
    return `<div class="wb3-adapt-side-mask" data-close-adapt-picker><section class="wb3-adapt-picker" role="dialog" aria-label="AI改编候选题"><header><div><span>${icons.sparkle} AI改编</span><h2>选择一道改编题</h2><p>按照“${escapeHtml(adaptPicker.requirement)}”生成 · 原题不会加入题单。</p></div><button type="button" data-close-adapt-picker aria-label="关闭">×</button></header><div class="wb3-adapt-picker-original"><b>原题</b><p>${escapeHtml(source.text)}</p></div><div class="wb3-adapt-picker-body">${pickerBody}</div></section></div>`
  }

  function openAdaptPicker(source, targetId = '', requirement = '') {
    if (!source) return
    stopAdaptThinkingTimer()
    adaptRequest = null
    adaptPicker = { source: { ...source }, targetId, requirement, loading: true, candidates: [], thinkingStep: 0 }
    render()
    adaptThinkingTimer = window.setInterval(() => {
      if (!adaptPicker || adaptPicker.source.id !== source.id || !adaptPicker.loading) return
      if (adaptPicker.thinkingStep < ADAPT_THINKING_LINES.length - 1) {
        adaptPicker.thinkingStep += 1
        render()
      }
    }, 850)
    window.setTimeout(() => {
      stopAdaptThinkingTimer()
      if (!adaptPicker || adaptPicker.source.id !== source.id) return
      adaptPicker.loading = false
      adaptPicker.candidates = buildAdaptCandidates(source, requirement)
      render()
    }, 3400)
  }

  const workspaceTabCatalog = {
    'ai-create': { label: 'AI组题', view: 'ai-entry' },
    upload: { label: '上传文件', view: 'ai-upload' },
    knowledge: { label: '复用我的题单', view: 'knowledge' },
    'ai-compose': { label: '历史AI组题', view: 'ai-compose' },
  }

  function workspaceTabInfo(id) {
    if (workspaceTabCatalog[id]) return workspaceTabCatalog[id]
    if (id.startsWith('paper:')) {
      const paper = allKnowledgePapers().find((item) => item.id === id.slice(6))
      return paper ? { label: paper.title, view: 'knowledge' } : null
    }
    if (id.startsWith('record:')) {
      const record = aiImportRecords.find((item) => item.id === id.slice(7))
      return record ? { label: record.filename.replace(/\.[^.]+$/, ''), view: 'ai-record' } : null
    }
    if (id.startsWith('compose:')) {
      const record = aiComposeRecords.find((item) => item.id === id.slice(8))
      return record ? { label: record.title, view: 'ai-compose-record' } : null
    }
    return null
  }

  function workspaceTabsMarkup() {
    const aiComposeViews = ['ai-entry', 'add-more', 'ai-compose', 'ai-compose-record']
    const active = aiComposeViews.includes(importWorkspaceView) ? 'ai-create' : questionSource === 'personal' ? 'personal' : 'library'
    return `<nav class="wb3-workspace-tabs" aria-label="题库与组题导航"><span class="wb3-workspace-brand"><button type="button" data-action="exit" aria-label="退出工作台" title="退出工作台">${icons.back}</button><i class="wb3-brand-elephant" title="飞象" aria-label="飞象">${icons.elephant}</i></span><button type="button" class="${active === 'library' ? 'active' : ''}" data-workspace-tab="library">飞象题库</button><button type="button" class="${active === 'personal' ? 'active' : ''}" data-workspace-tab="personal">我的题库</button><button type="button" class="${active === 'ai-create' ? 'active' : ''}" data-workspace-tab="ai-create">AI组题</button></nav>`
  }

  function openWorkspaceTab(id) {
    aiRecordingDrawerOpen = false
    aiComposeResultViewId = ''
    aiComposeReturnScrollTop = 0
    if (id === 'ai-create') {
      adaptRequest = null
      adaptPicker = null
      importWorkspaceView = 'ai-entry'
      render()
      window.requestAnimationFrame(() => $('#wb3AiCreateInput', root)?.focus())
      return
    }
    if (id === 'knowledge') {
      openPersonalPapersLibrary()
      render()
      return
    }
    const tab = workspaceTabInfo(id)
    if (!tab) return
    importWorkspaceView = tab.view
    activeImportRecordId = id.startsWith('record:') ? id.slice(7) : ''
    previewKnowledgePaperId = id.startsWith('paper:') ? id.slice(6) : ''
    activeAiComposeRecordId = id.startsWith('compose:') ? id.slice(8) : ''
    render()
  }

  function composePlanMarkup(record) {
    const plan = record.plan || { count: record.questions?.length || 5, types: '选择、填空、解答', difficulty: '基础与中等搭配', knowledge: '结合当前学段学科', minutes: 15 }
    const steps = record.status === 'completed'
      ? [['组题条件理解', `识别组题场景，规划 ${plan.count} 道题、${plan.minutes} 分钟的题单结构`, true], ['题库检索与初筛', `围绕“${plan.knowledge}”检索并去除重复、超纲题目`, true], ['双向细目表', `按 ${plan.types} 配置题型，并建立题目与知识点的对应关系`, true], ['试题多维校验', '逐题检查题干、选项、答案、知识点和能力层级', true], ['题单结构平衡性复核', `复核难度分布：${plan.difficulty}`, true], ['整卷模拟与质量验收', '完成整卷模拟作答、分值与结构一致性检查', true], ['标准化文档输出', '生成题单、答案解析和组题说明', true]]
      : [['组题条件理解', `正在识别组题场景并规划 ${plan.count} 道题`, true], ['题库检索与初筛', `正在围绕“${plan.knowledge}”检索候选题`, true], ['双向细目表', '等待建立题目、知识点与能力层级对应关系', false], ['试题多维校验', '等待检查题干、选项和答案', false], ['题单结构平衡性复核', '等待复核题型与难度结构', false], ['整卷模拟与质量验收', '等待整卷模拟验收', false], ['标准化文档输出', '等待生成标准文档', false]]
    return `<section class="wb3-compose-thinking"><header><div><b>专业组题过程</b><span>${record.status === 'completed' ? '已完成质量检查' : 'AI 正在执行组题方案'}</span></div><em>${record.mode === 'append' ? '补充题目' : record.mode === 'adapt' ? '改编单题' : '新建题单'}</em></header><div class="wb3-compose-steps">${steps.map(([label, description, done], index) => `<article class="${done ? 'done' : index === 2 && record.status !== 'completed' ? 'current' : ''}"><i>${done ? '✓' : index + 1}</i><div><b>${label}</b><p>${escapeHtml(description)}</p></div></article>`).join('')}</div><details ${record.status === 'completed' ? '' : 'open'}><summary>查看组题蓝图</summary><div class="wb3-compose-plan"><span><b>${plan.count}</b>题目数量</span><span><b>${escapeHtml(plan.types)}</b>题型结构</span><span><b>${escapeHtml(plan.difficulty)}</b>难度分布</span><span><b>${escapeHtml(plan.knowledge)}</b>知识点覆盖</span><span><b>${plan.minutes} 分钟</b>建议用时</span></div></details></section>`
  }

  function aiOutputMarkup(record) {
    if (record.status !== 'completed' || record.mode !== 'generate') return ''
    return `<section class="wb3-ai-outputs"><header><div><b>AI 输出</b><span>组题说明已生成</span></div></header><div class="wb3-ai-output-files"><details class="wb3-brief-file"><summary><span class="pdf">PDF</span><div><b>组题说明.pdf</b><small>包含双向细目表、选题依据、难度结构与质量校验</small></div><span class="wb3-brief-actions"><em>查看</em><button type="button" data-download-brief>下载</button></span></summary><div class="wb3-brief-preview"><header><b>组题说明</b><button type="button" data-download-brief>下载 PDF</button></header><section><h4>组题参数与结构</h4><p>题目数量：${record.plan?.count || record.questions.length} 题　题型：${escapeHtml(record.plan?.types || '选择、填空、解答')}　建议用时：${record.plan?.minutes || 15} 分钟</p></section><section><h4>双向细目表</h4>${record.questions.slice(0, 5).map((question, index) => `<p>${index + 1}. ${escapeHtml(question.type)}　${escapeHtml(question.knowledge)}　${escapeHtml(question.difficulty)}</p>`).join('')}</section><section><h4>质量校验结论</h4><p>题型、知识点与难度结构符合组题要求；已完成重复题、答案完整性和整卷结构检查。</p></section></div></details></div></section>`
  }

  function aiGeneratedQuestionsMarkup(record, addedMap) {
    return `<details class="wb3-ai-generated" open><summary><span>${icons.sparkle}<b>AI 匹配题目</b><em>${record.questions.length} 道</em></span><small>点击折叠 / 展开</small></summary><div class="wb3-ai-generated-toolbar"><span>可以逐题选用，也可以一次全部加入当前题单</span><button type="button" data-compose-record-all="${record.id}">${record.allAdded ? '已全部加入' : '全部加入当前题单'}</button></div><div class="wb3-import-question-list">${record.questions.map((question) => questionCardMarkup(question, addedMap)).join('')}</div></details>`
  }

  function composeConversationHistoryMarkup(record, addedMap) {
    const conversationId = record.conversationId || record.id
    let turns = aiComposeRecords
      .filter((item) => (item.conversationId || item.id) === conversationId)
      .sort((a, b) => (a.turnIndex || 1) - (b.turnIndex || 1))
    // 兼容旧记录：首次续聊前没有 conversationId 时仍可沿父链恢复历史。
    if (turns.length === 1 && record.parentRecordId) {
      const parents = []
      let parentId = record.parentRecordId
      while (parentId) {
        const parent = aiComposeRecords.find((item) => item.id === parentId)
        if (!parent) break
        parents.unshift(parent)
        parentId = parent.parentRecordId
      }
      turns = [...parents, record]
    }
    const history = turns.filter((item) => item.id !== record.id)
    return `${history.map((item, index) => `<section class="wb3-chat-turn history"><div class="wb3-chat-user"><span>我</span><p>${escapeHtml(item.prompt)}</p></div><div class="wb3-chat-ai"><span>${icons.sparkle}</span><div><b>第 ${index + 1} 轮 · AI 已完成组题</b><p>从题库匹配 ${item.questions.length} 道题，本轮记录已保留。</p><button type="button" class="wb3-chat-result-link" data-view-compose-result="${item.id}">查看本轮题目</button></div></div></section>`).join('')}<section class="wb3-chat-turn current"><div class="wb3-chat-user"><span>我</span><p>${escapeHtml(record.prompt)}</p></div><div class="wb3-chat-ai"><span>${icons.sparkle}</span><div><b>第 ${history.length + 1} 轮 · ${record.status === 'completed' ? 'AI 已完成组题' : 'AI 正在组题'}</b><p>${record.status === 'completed' ? `已匹配 ${record.questions.length} 道题，可在下方查看和选用。` : '正在理解要求并检索飞象题库与我的题库…'}</p></div></div></section>`
  }

  function resultViewHeadMarkup({ backAttribute, backLabel, title, description, action = '' }) {
    return `<div class="wb3-results-head wb3-paper-results-head"><div class="wb3-import-result-head"><button type="button" ${backAttribute}>${icons.back}<span>${escapeHtml(backLabel)}</span></button><div><b title="${escapeHtml(title)}">${escapeHtml(title)}</b><span>${escapeHtml(description)}</span></div>${action}</div></div>`
  }

  function openAiComposeResult(recordId) {
    const record = aiComposeRecords.find((item) => item.id === recordId && item.status === 'completed')
    if (!record || !record.questions.length) {
      showToast(record ? '本轮没有可查看的题目' : '未找到这次组题记录')
      return
    }
    aiComposeReturnScrollTop = root?.querySelector('.wb3-import-center-body')?.scrollTop || 0
    aiComposeResultViewId = record.id
    render()
  }

  function appendAssistMarkup(record) {
    if (record.status !== 'completed') return `<section class="wb3-append-assist processing"><span>${icons.sparkle}</span><div><b>正在分析当前题单</b><p>我已看到画布中有 ${record.existingCount || 0} 道题，正在检查知识点、题型和难度缺口，并匹配不重复的补充题目…</p></div></section>`
    if (record.autoAdded) return `<section class="wb3-append-assist added"><span>${icons.check}</span><div><b>${record.questions.length} 道补充题已加入当前题单</b><p>已补充当前题单的知识点与难度梯度，你可以继续在右侧调整或删除题目。</p></div></section>`
    return `<section class="wb3-append-assist"><span>${icons.sparkle}</span><div><b>已为当前题单准备好 ${record.questions.length} 道补充题</b><p>这些题目补充了当前题单的知识点与难度梯度，并尽量避开已有题目。你可以全部加入，也可以在下方逐题选用。</p><div class="wb3-append-confirm"><strong>是否将这 ${record.questions.length} 道题直接加入当前题单？</strong><button type="button" data-compose-record-all="${record.id}">全部加入当前题单</button></div></div></section>`
  }

  function importRecordActionMarkup(record, inDrawer = false) {
    if (record.status === 'completed') return `<button type="button" ${inDrawer ? 'data-view-imported-record' : 'data-open-record'}="${record.id}">${record.unread ? '查看新题' : inDrawer ? '查看本次题目' : '查看题目'}</button>`
    if (record.status === 'failed') return `<button type="button" data-reparse-record="${record.id}">重新解析</button>`
    return ''
  }

  function importRecordRowMarkup(record, inDrawer = false) {
    return `<article class="wb3-record-row ${record.status} ${record.unread ? 'unread' : ''}"><span class="wb3-record-file">${record.status === 'completed' ? icons.check : icons.blank}</span><div><span class="wb3-record-status">${record.status === 'completed' ? '录题完成' : record.status === 'failed' ? '录题失败' : '正在AI录题'}</span><b title="${escapeHtml(record.filename)}">${escapeHtml(record.filename)}</b><small>提交于 ${escapeHtml(record.submittedAt)}${record.completedAt ? ` · 完成于 ${escapeHtml(record.completedAt)}` : ''}${record.questions?.length ? ` · 已录入 ${record.questions.length} 题` : ''}</small><em>${escapeHtml(record.stage)}${record.eta ? ` · ${escapeHtml(record.eta)}` : ''}</em></div>${importRecordActionMarkup(record, inDrawer)}</article>`
  }

  function importRecordListMarkup(inDrawer = false) {
    return aiImportRecords.length
      ? aiImportRecords.map((record) => importRecordRowMarkup(record, inDrawer)).join('')
      : '<p class="wb3-record-empty">暂无记录</p>'
  }

  function aiRecordingDrawerMarkup() {
    if (!aiRecordingDrawerOpen || importWorkspaceView !== 'library' || questionSource !== 'personal' || personalLibraryMode !== 'questions') return ''
    const processingCount = aiImportRecords.filter((record) => record.status === 'processing').length
    return `<div class="wb3-ai-recording-layer">
      <button type="button" class="wb3-ai-recording-mask" data-close-ai-recording aria-label="关闭上传文件"></button>
      <aside class="wb3-ai-recording-drawer" role="dialog" aria-modal="false" aria-labelledby="wb3AiRecordingTitle">
        <header><div><span>${icons.upload}</span><div><h2 id="wb3AiRecordingTitle">上传文件</h2><p>AI 自动识别题目、答案和标签，完成后进入我的题库</p></div></div><button type="button" data-close-ai-recording aria-label="关闭上传文件" title="关闭">×</button></header>
        <div class="wb3-ai-recording-body">
          <button type="button" class="wb3-ai-dropzone wb3-ai-recording-dropzone" data-start-upload>${icons.upload}<b>点击选择或拖入文件</b><span>支持 PNG、JPG、PDF、DOC、DOCX，单个文件不超过 20 MB</span></button>
          <section class="wb3-ai-recording-tasks"><header><div><b>录题任务</b><span>${processingCount ? `${processingCount} 个处理中，可关闭抽屉继续其他操作` : '完成后直接进入我的题库'}</span></div></header><div class="wb3-ai-recording-task-list wb3-record-list">${importRecordListMarkup(true)}</div></section>
        </div>
      </aside>
    </div>`
  }

  function importCompletionNoticeMarkup() {
    if (aiRecordingDrawerOpen || personalImportRecordViewId || questionSource !== 'personal' || personalLibraryMode !== 'questions') return ''
    const unreadRecords = aiImportRecords.filter((record) => record.status === 'completed' && record.unread)
    if (!unreadRecords.length) return ''
    const questionCount = unreadRecords.reduce((sum, record) => sum + (record.questions?.length || 0), 0)
    return `<div class="wb3-ai-recording-notice">${icons.check}<div><b>AI录题完成，新增 ${questionCount} 道题</b><span>已自动添加阶段科目、题型、难度和知识点标签</span></div><button type="button" data-view-imported-questions>查看新题</button><button type="button" class="close" data-dismiss-import-notice aria-label="关闭提示">×</button></div>`
  }

  function viewImportedQuestions(recordId = '') {
    const records = recordId
      ? aiImportRecords.filter((record) => record.id === recordId && record.status === 'completed')
      : aiImportRecords.filter((record) => record.status === 'completed' && record.unread)
    const personalQuestionIds = new Set(personalQuestions.map((question) => question.id))
    const questionIds = records.flatMap((record) => record.questions || []).map((question) => question.id).filter((id) => personalQuestionIds.has(id))
    if (!questionIds.length) {
      records.forEach((record) => { record.unread = false })
      showToast('本次录入的题目已被删除')
      renderPreservingResultScroll()
      return
    }
    records.forEach((record) => { record.unread = false })
    personalImportReturnScrollTop = root?.querySelector('.wb3-result-scroll')?.scrollTop || 0
    aiRecordingDrawerOpen = false
    personalImportRecordViewId = records.length === 1 ? records[0].id : ''
    importWorkspaceView = 'library'
    questionSource = 'personal'
    personalLibraryMode = 'questions'
    selectedPersonalQuestionIds = new Set()
    personalBatchMode = false
    render()
    window.requestAnimationFrame(() => {
      const cards = questionIds.map((id) => root?.querySelector(`.wb3-qcard[data-qid="${id}"]`)).filter(Boolean)
      cards[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      cards.forEach((card) => card.classList.add('wb3-question-just-added'))
      window.setTimeout(() => cards.forEach((card) => card.classList.remove('wb3-question-just-added')), 1400)
    })
  }

  function aiComposeHistoryForEntry() {
    return aiComposeRecords
      .filter((record) => record.mode === 'generate' && record.status === 'completed')
      .slice()
      .sort((a, b) => (b.historyAt || 0) - (a.historyAt || 0))
  }

  function aiComposeHistoryListMarkup() {
    const items = aiComposeHistoryForEntry()
    if (!items.length) return ''
    return `<section class="wb3-ai-compose-history" aria-label="历史记录"><h3>历史记录</h3><div class="wb3-ai-history-list">${items.map((record) => `<button type="button" class="wb3-ai-history-row" data-open-compose-record="${record.id}"><span class="wb3-ai-history-text"><b>${escapeHtml(record.prompt)}</b><small>${escapeHtml(record.historyDate || record.createdAt)}</small></span><span class="wb3-ai-history-arrow" aria-hidden="true">${icons.chevron}</span></button>`).join('')}</div></section>`
  }

  function aiCreateAttachmentsMarkup() {
    return aiCreateAttachments.map((file) => `<span class="wb3-ai-create-file"><button type="button" class="wb3-ai-create-file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</button><button type="button" data-remove-ai-create-file="${file.id}" aria-label="移除附件">×</button></span>`).join('')
  }

  function aiCreateInputBlockMarkup() {
    return `<div class="wb3-ai-create-input"><textarea id="wb3AiCreateInput" rows="4" placeholder="描述学段学科、题量、知识点和难度">${escapeHtml(aiCreateInputDraft)}</textarea><div class="wb3-ai-create-toolbar"><button type="button" class="wb3-ai-create-voice ${aiCreateListening ? 'listening' : ''}" data-ai-create-voice aria-label="语音输入" title="语音输入"><span aria-hidden="true">♩</span></button><span class="wb3-ai-source-note">题源：飞象题库＋我的题库</span><button type="button" class="wb3-ai-create-send" data-ai-create-send>${icons.sparkle}开始组题</button></div></div>`
  }

  function captureAiCreateInputDraft() {
    const input = root && $('#wb3AiCreateInput', root)
    if (input) aiCreateInputDraft = input.value
  }

  function stopAiCreateVoice() {
    aiCreateListening = false
    aiCreateSpeechRecognition?.stop?.()
    aiCreateSpeechRecognition = null
  }

  function toggleAiCreateVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (aiCreateListening) {
      stopAiCreateVoice()
      render()
      return
    }
    if (!SpeechRecognition) {
      aiCreateInputDraft = aiCreateInputDraft.trim()
        ? `${aiCreateInputDraft.trim()} 从题库组一份五年级小数乘法练习，共 10 题`
        : '从题库组一份五年级小数乘法练习，共 10 题'
      showToast('浏览器不支持语音识别，已填入演示文案')
      render()
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.interimResults = true
    recognition.continuous = false
    aiCreateSpeechRecognition = recognition
    aiCreateListening = true
    render()
    recognition.onresult = (event) => {
      const transcript = [...event.results].map((result) => result[0].transcript).join('')
      aiCreateInputDraft = transcript
      const input = root && $('#wb3AiCreateInput', root)
      if (input) input.value = transcript
    }
    recognition.onerror = () => {
      stopAiCreateVoice()
      showToast('语音识别失败，请重试或使用文字输入')
      render()
    }
    recognition.onend = () => {
      if (!aiCreateListening) return
      stopAiCreateVoice()
      showToast(aiCreateInputDraft.trim() ? '语音识别完成' : '未识别到内容')
      render()
    }
    recognition.start()
  }

  function buildAiCreatePrompt() {
    const text = aiCreateInputDraft.trim()
    if (text) return text
    if (aiCreateAttachments.length) {
      const names = aiCreateAttachments.map((file) => file.name).join('、')
      return `请根据附件「${names}」中的内容帮我组题`
    }
    return ''
  }

  function resetAiCreateInput() {
    aiCreateInputDraft = ''
    aiCreateAttachments = []
    stopAiCreateVoice()
  }

  function completeImportRecord(recordId) {
    const record = aiImportRecords.find((item) => item.id === recordId)
    if (!record || record.status !== 'processing') return
    const recordedAt = Date.now()
    record.questions = bankQuestions.slice(0, 5).map((question, index) => ({
      ...question,
      id: `${recordId}-q${index + 1}`,
      originId: question.id,
      source: 'ai-record',
      curriculumTags: [question.curriculum],
      typeTags: [question.type],
      difficultyTags: [question.difficulty],
      knowledgeTags: [question.knowledge],
      customTags: [],
      recordedAt,
    }))
    record.status = 'completed'
    record.stage = '解析完成'
    record.completedAt = '刚刚'
    record.unread = true
    delete record.eta
    const newQuestions = record.questions.filter((question) => !personalQuestions.some((item) => item.id === question.id))
    personalQuestions = [...newQuestions, ...personalQuestions]
    if (root && !root.hidden) renderPreservingResultScroll()
    showToast(`AI录题完成，新增 ${record.questions.length} 道题`)
  }

  function restartImportRecord(recordId) {
    const record = aiImportRecords.find((item) => item.id === recordId)
    if (!record || record.status !== 'failed') return
    record.status = 'processing'
    record.stage = '正在重新识别题目'
    record.eta = '预计还需 4–10 分钟'
    record.questions = []
    delete record.completedAt
    renderPreservingResultScroll()
    showToast('已开始重新解析')
    scheduleImportRecordProgress(recordId)
  }

  function importWorkspaceContextMarkup(activeRecord, activeComposeRecord, previewPaper) {
    let parentLabel = questionSource === 'personal' ? '我的题库' : '飞象题库'
    let sectionLabel = ''
    let detailLabel = ''
    let backLabel = `返回${parentLabel}`
    let backAttribute = 'data-return-library'

    if (['ai-upload', 'ai-history', 'ai-record'].includes(importWorkspaceView)) {
      parentLabel = '我的题库'
      sectionLabel = '上传文件'
      if (importWorkspaceView === 'ai-history') detailLabel = '录题记录'
      if (importWorkspaceView === 'ai-record') detailLabel = activeRecord?.filename || '录题详情'
      if (importWorkspaceView !== 'ai-upload') {
        backLabel = '返回上传文件'
        backAttribute = 'data-import-view="ai-upload"'
      } else {
        backLabel = '返回我的题库'
      }
    } else if (['ai-entry', 'add-more'].includes(importWorkspaceView)) {
      return ''
    } else if (['ai-compose', 'ai-compose-record'].includes(importWorkspaceView)) {
      parentLabel = 'AI组题'
      sectionLabel = importWorkspaceView === 'ai-compose' ? '组题记录' : activeComposeRecord?.title || '组题详情'
      backLabel = '返回AI组题'
      backAttribute = 'data-import-view="ai-entry"'
    } else if (importWorkspaceView === 'knowledge') {
      parentLabel = '我的题库'
      sectionLabel = '题单'
      detailLabel = previewPaper?.title || ''
      backLabel = '返回我的题库'
    }

    if (!sectionLabel) return ''
    return `<nav class="wb3-import-center-head wb3-import-breadcrumb" aria-label="当前位置"><button type="button" ${backAttribute} aria-label="${escapeHtml(backLabel)}">${escapeHtml(parentLabel)}</button><i>/</i><span>${escapeHtml(sectionLabel)}</span>${detailLabel ? `<i>/</i><b title="${escapeHtml(detailLabel)}">${escapeHtml(detailLabel)}</b>` : ''}</nav>`
  }

  function importWorkspaceMarkup() {
    const addedMap = getAddedMap()
    const activeRecord = aiImportRecords.find((record) => record.id === activeImportRecordId)
    const activeComposeRecord = aiComposeRecords.find((record) => record.id === activeAiComposeRecordId)
    const previewPaper = allKnowledgePapers().find((paper) => paper.id === previewKnowledgePaperId)
    const composeResultRecord = aiComposeRecords.find((record) => record.id === aiComposeResultViewId && record.status === 'completed')
    let content = ''

    if (composeResultRecord) {
      content = `<div class="wb3-ai-compose-result-view">${resultViewHeadMarkup({
        backAttribute: 'data-close-compose-result',
        backLabel: importWorkspaceView === 'ai-compose-record' ? '返回历史对话' : '返回AI组题',
        title: composeResultRecord.title,
        description: `第 ${composeResultRecord.turnIndex || 1} 轮组题 · 共 ${composeResultRecord.questions.length} 道题 · ${composeResultRecord.prompt}`,
        action: `<button type="button" class="primary" data-compose-record-all="${composeResultRecord.id}">${composeResultRecord.allAdded ? '已全部加入' : '全部加入当前题单'}</button>`,
      })}<div class="wb3-result-scroll wb3-import-question-list">${composeResultRecord.questions.map((question) => questionCardMarkup(question, addedMap)).join('')}</div></div>`
    } else if (importWorkspaceView === 'ai-entry') {
      content = `<div class="wb3-ai-create-page"><div class="wb3-import-page-title"><div><h2>AI组题</h2><p>描述题量、知识点和难度，AI 会从飞象题库和我的题库中检索匹配，结果将进入当前题单。</p></div></div><div class="wb3-ai-create-prompts"><button type="button" data-ai-create-suggestion="从题库匹配 10 道基础练习题">10 道基础题</button><button type="button" data-ai-create-suggestion="从题库组一份难度递进的综合练习">难度递进</button><button type="button" data-ai-create-suggestion="从题库补 3 道中等题，避免与现有题目重复">补充中等题</button></div>${aiCreateInputBlockMarkup()}${aiComposeHistoryListMarkup()}</div>`
    } else if (importWorkspaceView === 'add-more') {
      content = `<div class="wb3-ai-create-page"><div class="wb3-import-page-title"><div><h2>AI组题</h2><p>描述题量、知识点和难度，AI 会从飞象题库和我的题库中检索匹配。</p></div></div>${aiCreateInputBlockMarkup()}${aiComposeHistoryListMarkup()}</div>`
    } else if (importWorkspaceView === 'ai-upload') {
      content = `<div class="wb3-upload-page"><button type="button" class="wb3-ai-dropzone" data-start-upload>${icons.upload}<b>从电脑选择文件，或把文件拖到这里</b><span>把本地试卷、图片或 Word 上传后，AI 会自动录题。支持 PNG、JPG、PDF、DOCX，单个文件不超过 20 MB</span></button><section class="wb3-upload-history"><div class="wb3-import-page-title"><div><h2>AI录题进度</h2><p>解析完成后，题目会自动进入“我的题库”；解析中无需操作，失败可重新解析。</p></div></div><div class="wb3-record-list">${importRecordListMarkup()}</div></section></div>`
    } else if (importWorkspaceView === 'ai-history') {
      content = `<div class="wb3-record-page"><div class="wb3-import-page-title"><div><h2>AI录题记录</h2><p>解析中任务可以离开页面，已完成结果可随时重新选题。</p></div></div>
        <div class="wb3-record-list">${importRecordListMarkup()}</div></div>`
    } else if (importWorkspaceView === 'ai-record' && activeRecord) {
      content = `<div class="wb3-record-detail"><div class="wb3-import-page-title"><div><h2>${escapeHtml(activeRecord.filename)}</h2><p>${activeRecord.status === 'completed' ? `${activeRecord.questions.length} 道题 · 已进入“我的题库”` : `${escapeHtml(activeRecord.stage)} · ${escapeHtml(activeRecord.eta || '')}`}</p></div>${activeRecord.status === 'completed' ? `<button type="button" class="primary" data-import-record-all="${activeRecord.id}">全部选用</button>` : ''}</div>
        ${activeRecord.status === 'completed' ? `<div class="wb3-library-sync-note compact">${icons.check}<span><b>已进入“我的题库”</b><small>下方卡片与普通题库一致，可逐题显示答案、AI改编或选用。</small></span></div><div class="wb3-import-question-list">${activeRecord.questions.map((question) => questionCardMarkup(question, addedMap)).join('')}</div>` : `<div class="wb3-processing-card"><i></i><b>${escapeHtml(activeRecord.stage)}</b><p>${escapeHtml(activeRecord.eta || '预计需要 4–10 分钟')}。可以返回飞象题库继续组题。</p><span>上传完成　→　识别题目　→　提取答案　→　自动打标　→　存入我的题库</span></div>`}
      </div>`
    } else if (importWorkspaceView === 'ai-compose-record' && activeComposeRecord) {
      const isAdaptRecord = activeComposeRecord.mode === 'adapt'
      const isAppendRecord = activeComposeRecord.mode === 'append' && activeComposeRecord.needsCanvasConfirmation
      content = `<div class="wb3-record-detail"><div class="wb3-import-page-title"><div><h2>${escapeHtml(activeComposeRecord.title)}</h2><p>${activeComposeRecord.status === 'completed' ? `${activeComposeRecord.questions.length} 道候选题 · ${escapeHtml(activeComposeRecord.prompt)}` : 'AI 正在根据要求检索题库'}</p></div></div>
        ${composeConversationHistoryMarkup(activeComposeRecord, addedMap)}
        ${isAppendRecord ? appendAssistMarkup(activeComposeRecord) : composePlanMarkup(activeComposeRecord)}
        ${aiOutputMarkup(activeComposeRecord)}
        ${activeComposeRecord.status === 'completed' ? `${isAdaptRecord && activeComposeRecord.original ? `<div class="wb3-adapt-original"><b>原题</b><p>${escapeHtml(activeComposeRecord.original.text)}</p></div><div class="wb3-import-question-list">${activeComposeRecord.questions.map((question) => `${questionCardMarkup(question, addedMap)}<div class="wb3-adapt-result-actions"><button type="button" data-adapt-result-replace="${question.id}" data-compose-id="${activeComposeRecord.id}">替换原题</button><button type="button" class="primary" data-quick-add="${question.id}">另加为新题</button></div>`).join('')}</div>` : isAppendRecord ? (activeComposeRecord.autoAdded ? '' : `<div class="wb3-import-question-list">${activeComposeRecord.questions.map((question) => questionCardMarkup(question, addedMap)).join('')}</div>`) : aiGeneratedQuestionsMarkup(activeComposeRecord, addedMap)}` : isAppendRecord ? '' : `<div class="wb3-processing-card"><i></i><b>${isAdaptRecord ? '正在生成改编方案' : '正在检索匹配题目'}</b><p>AI 正在分析题量、题型、难度和知识点，并从题库筛选候选题。</p></div>`}
        ${activeComposeRecord.status === 'completed' && !isAdaptRecord ? `<div class="wb3-ai-continue"><div><b>${icons.sparkle}继续调整这份题单</b><span><button type="button" data-ai-followup-suggestion="再补 3 道中等题">补 3 道中等题</button><button type="button" data-ai-followup-suggestion="增加应用题，避免重复">增加应用题</button></span></div><div><textarea id="wb3AiFollowupInput" rows="1" placeholder="继续描述补题或调整要求"></textarea><button type="button" data-ai-followup-send aria-label="发送" title="发送">${icons.up}</button></div></div>` : ''}
      </div>`
    } else if (importWorkspaceView === 'ai-compose') {
      content = `<div class="wb3-record-page"><div class="wb3-import-page-title"><div><h2>AI组题记录</h2><p>保留每次 AI 从题库匹配的题单，可再次整份或逐题选用。</p></div></div>
        <div class="wb3-record-list">${aiComposeRecords.map((record) => `<article class="wb3-record-row ${record.status}"><span class="wb3-record-file">${icons.sparkle}</span><div><span class="wb3-record-status">${record.status === 'completed' ? '匹配完成' : '匹配中'}</span><b>${escapeHtml(record.title)}</b><small>${record.mode === 'append' ? '补充题目' : record.mode === 'adapt' ? '改编单题' : '新建题单'} · ${escapeHtml(record.createdAt)} · ${record.questions.length} 题</small><em>${escapeHtml(record.prompt)}</em></div><button type="button" data-open-compose-record="${record.id}">${record.status === 'completed' ? '查看题目' : '查看进度'}</button></article>`).join('')}</div></div>`
    } else if (importWorkspaceView === 'knowledge' && previewPaper) {
      content = knowledgePaperPreviewMarkup(previewPaper, addedMap)
    } else if (importWorkspaceView === 'knowledge') {
      content = knowledgePapersPageMarkup()
    }

    return `<section class="wb3-library wb3-import-workspace">${workspaceTabsMarkup()}${importWorkspaceContextMarkup(activeRecord, activeComposeRecord, previewPaper)}<div class="wb3-import-center-body">${content}</div></section>`
  }

  function leftPanelMarkup() {
    if (importWorkspaceView !== 'library') return importWorkspaceMarkup()
    const addedMap = getAddedMap()
    if (questionSource === 'personal' && personalLibraryMode === 'papers') {
      const papers = allKnowledgePapers()
      const paperQuery = personalPaperSearchQuery.trim().toLowerCase()
      const filteredPapers = paperQuery
        ? papers.filter((paper) => `${paper.title} ${paper.meta}`.toLowerCase().includes(paperQuery))
        : papers
      const previewPaper = previewKnowledgePaperId ? allKnowledgePapers().find((item) => item.id === previewKnowledgePaperId) : null
      const papersBody = previewPaper
        ? `${resultViewHeadMarkup({ backAttribute: 'data-back-knowledge', backLabel: '返回题单列表', title: previewPaper.title, description: `${previewPaper.meta} · 共 ${previewPaper.questions.length} 道题`, action: `<button type="button" class="primary" data-import-knowledge-all="${previewPaper.id}">全部选用</button>` })}<div class="wb3-result-scroll wb3-import-question-list">${previewPaper.questions.map((question) => questionCardMarkup(question, addedMap)).join('')}</div>`
        : !papers.length
          ? `<div class="wb3-result-scroll">${personalPapersEmptyMarkup()}</div>`
          : `<div class="wb3-paper-list-toolbar"><span>${paperQuery ? `找到 ${filteredPapers.length} 份题单` : `共 ${papers.length} 份题单`}</span><label class="wb3-paper-search">${icons.search}<input id="wb3PersonalPaperSearch" type="search" value="${escapeHtml(personalPaperSearchQuery)}" placeholder="搜索题单名称"></label></div><div class="wb3-result-scroll">${filteredPapers.length ? personalPapersListMarkup(filteredPapers) : '<div class="wb3-empty-results"><b>未找到相关题单</b><p>换个关键词试试。</p></div>'}</div>`
      return `<section class="wb3-library wb3-library-personal-papers">
        ${workspaceTabsMarkup()}
        ${personalLibrarySubtabsMarkup()}
        <div class="wb3-personal-paper-stage wb3-results">${papersBody}${aiRecordingDrawerMarkup()}</div>
      </section>`
    }
    const tree = activeTree()
    const importResultRecord = questionSource === 'personal' ? currentPersonalImportRecord() : null
    const questions = importResultRecord ? currentBankQuestions() : filterBankQuestions()
    const totalPages = Math.min(OFFICIAL_MAX_PAGES, Math.max(1, Math.ceil(questions.length / OFFICIAL_PAGE_SIZE)))
    if (officialPage > totalPages) officialPage = totalPages
    const visibleQuestions = questionSource === 'official' ? questions.slice((officialPage - 1) * OFFICIAL_PAGE_SIZE, officialPage * OFFICIAL_PAGE_SIZE) : questions
    const treeGroups = visibleTreeGroups()
    const parentNames = Object.keys(tree.parents)
    const typeOptions = [...new Set(currentBankQuestions().flatMap((question) => questionSource === 'personal' ? questionTypeTags(question) : [question.type]).filter(Boolean))]
    const difficultyOptions = [...new Set(currentBankQuestions().flatMap((question) => questionSource === 'personal' ? questionDifficultyTags(question) : [question.difficulty]).filter(Boolean))]
    const curriculumOptions = personalCurriculumOptions()
    const knowledgeOptions = personalKnowledgeOptions()
    const selectedPersonalTag = personalCollection.startsWith('tag:') ? personalCollection.slice(4) : ''
    const showOfficialUnlock = questionSource === 'official' && questions.length > OFFICIAL_PAGE_SIZE
    const remainingOfficialCount = Math.max(0, questions.length - OFFICIAL_PAGE_SIZE)
    const remainingOfficialPages = Math.max(0, totalPages - 1)
    const paging = !showOfficialUnlock ? '' : officialMoreUnlocked
      ? `<footer class="wb3-bank-pagination"><button type="button" data-official-page="${officialPage - 1}" ${officialPage === 1 ? 'disabled' : ''}>上一页</button><span>第 ${officialPage} / ${totalPages} 页 · 每页 20 题</span><button type="button" data-official-page="${officialPage + 1}" ${officialPage === totalPages ? 'disabled' : ''}>下一页</button></footer>`
      : `<footer class="wb3-bank-unlock"><span>还有 ${remainingOfficialCount} 道题，消耗 20 积分可解锁</span><button type="button" data-official-unlock>解锁更多</button></footer>`
    const unlockPrompt = officialUnlockPromptOpen ? `<div class="wb3-overlay" data-official-unlock-overlay><div class="wb3-unlock-dialog" role="dialog"><span>${icons.sparkle}</span><h3>解锁更多题目</h3><p>本次将消耗 <b>20 积分</b>，解锁当前知识点后续 ${remainingOfficialPages} 页、共 ${remainingOfficialCount} 道题。</p><div><button type="button" data-official-unlock-cancel>暂不解锁</button><button type="button" class="primary" data-official-unlock-confirm>确认解锁</button></div></div></div>` : ''
    const treeScopedCount = questionsInTreeScope().length
    const isLibraryTab = questionSource === 'official'
    const hasPersonalFilters = !isLibraryTab && (
      personalCurriculumFilter !== 'all' ||
      personalKnowledgeFilter !== 'all' ||
      filterType !== '全部题型' ||
      filterDifficulty !== '全部难度' ||
      personalCollection !== 'all' ||
      Boolean(treeSearchQuery.trim())
    )
    const browseByChapter = isLibraryTab && chapterBrowseMode === 'chapter'
    const personalSubtabs = questionSource === 'personal' ? personalLibrarySubtabsMarkup() : ''
    const textbookSwitcher = browseByChapter ? textbookPickerMarkup() : ''
    const chapterSubtabs = isLibraryTab
      ? `<div class="wb3-chapter-subtabs" role="tablist" aria-label="飞象题库选题方式"><button type="button" role="tab" data-chapter-browse="chapter" aria-selected="${chapterBrowseMode === 'chapter'}" class="${chapterBrowseMode === 'chapter' ? 'active' : ''}">教材章节</button><button type="button" role="tab" data-chapter-browse="knowledge" aria-selected="${chapterBrowseMode === 'knowledge'}" class="${chapterBrowseMode === 'knowledge' ? 'active' : ''}">知识点</button></div>`
      : ''
    const resultsBody = visibleQuestions.length
      ? visibleQuestions.map((question) => questionCardMarkup(question, addedMap)).join('') + paging
      : importResultRecord
        ? `<div class="wb3-empty-results"><b>该文件录入的题目已全部删除</b><p>这些题目已不在我的题库中。</p><button type="button" class="wb3-empty-upload-btn" data-close-import-result>返回题目列表</button></div>`
      : emptyResultsMarkup(questions.length, treeScopedCount)
    const officialSidebar = `<aside class="wb3-tree">
      <label class="wb3-tree-subject"><select class="wb3-subject-switch" aria-label="飞象题库学段和学科">${Object.keys(curriculumCatalog).map((key) => `<option ${curriculumKey === key ? 'selected' : ''}>${key}</option>`).join('')}</select></label>
      ${chapterSubtabs}
      ${textbookSwitcher}
      <div class="wb3-tree-list">${treeGroups.length ? treeGroups.map(([name]) => {
        const isParent = parentNames.includes(name)
        const expanded = expandedChapterParents.has(name)
        const icon = browseByChapter && isParent
          ? `<i data-toggle-chapter="${escapeHtml(name)}">${expanded ? '▾' : '▸'}</i>`
          : isParent ? '⌄ ' : ''
        return `<button type="button" class="${activeKnowledge === name ? 'active' : ''} ${isParent ? 'group' : ''} ${name.startsWith('☆') ? 'activity' : ''}" data-knowledge="${escapeHtml(name)}" data-tree-name="${escapeHtml(name.toLowerCase())}"><span>${icon}${escapeHtml(name)}</span></button>`
      }).join('') : ''}</div>
    </aside>`
    const personalKnowledgeOptionMarkup = knowledgeOptions.map((name) => `<option value="${escapeHtml(name)}" ${personalKnowledgeFilter === name ? 'selected' : ''}>${escapeHtml(personalKnowledgeFilterLabel(name))}</option>`).join('')
    const personalTagOptionsList = personalTagOptions()
    const personalTagFilterMarkup = personalTagOptionsList.length
      ? `<div class="wb3-personal-tag-filter-wrap"><label class="wb3-personal-tag-filter ${selectedPersonalTag ? 'is-active' : ''}"><select id="wb3PersonalTagFilter" aria-label="自定义标签"><option value="">自定义标签</option>${personalTagOptionsList.map((tag) => `<option value="${escapeHtml(tag)}" ${selectedPersonalTag === tag ? 'selected' : ''}>${escapeHtml(tag)}（${personalCollectionCount(`tag:${tag}`)}）</option>`).join('')}</select></label>${selectedPersonalTag ? `<button type="button" class="wb3-delete-personal-tag" data-delete-personal-tag="${escapeHtml(selectedPersonalTag)}" aria-label="删除自定义标签${escapeHtml(selectedPersonalTag)}" title="删除该自定义标签">${icons.trash}</button>` : ''}</div>`
      : ''
    const filtersMarkup = importResultRecord
      ? `<div class="wb3-import-result-head"><button type="button" data-close-import-result>${icons.back}<span>返回题目列表</span></button><div><b title="${escapeHtml(importResultRecord.filename)}">${escapeHtml(importResultRecord.filename)}</b><span>AI录题完成 · 共 ${questions.length} 道题 · 已自动添加题目标签</span></div></div>`
      : isLibraryTab
      ? `<div class="wb3-results-filters"><label><select id="wb3FilterType" aria-label="题型"><option value="全部题型" ${filterType === '全部题型' ? 'selected' : ''}>全部题型</option>${typeOptions.map((name) => `<option value="${escapeHtml(name)}" ${filterType === name ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')}</select></label><label><select id="wb3FilterDifficulty" aria-label="难度"><option value="全部难度" ${filterDifficulty === '全部难度' ? 'selected' : ''}>全部难度</option>${difficultyOptions.map((name) => `<option ${filterDifficulty === name ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')}</select></label><label class="wb3-filter-search"><span class="wb3-main-search">${icons.search}<input id="wb3TreeSearch" type="search" value="${escapeHtml(treeSearchQuery)}" placeholder="${browseByChapter ? '搜索教材章节或题干关键词' : '搜索知识点或题干关键词'}"></span></label></div>`
      : `<div class="wb3-results-filters wb3-personal-filter-bar"><label class="wb3-personal-scope-filter ${personalCurriculumFilter !== 'all' ? 'is-active' : ''}"><select id="wb3PersonalCurriculumFilter" aria-label="阶段和科目"><option value="all">阶段·科目</option>${curriculumOptions.map((name) => `<option value="${escapeHtml(name)}" ${personalCurriculumFilter === name ? 'selected' : ''}>${escapeHtml(curriculumTagLabel(name))}</option>`).join('')}</select></label><label class="wb3-personal-type-filter ${filterType !== '全部题型' ? 'is-active' : ''}"><select id="wb3FilterType" aria-label="题型"><option value="全部题型" ${filterType === '全部题型' ? 'selected' : ''}>题型</option>${typeOptions.map((name) => `<option value="${escapeHtml(name)}" ${filterType === name ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')}</select></label><label class="wb3-personal-difficulty-filter ${filterDifficulty !== '全部难度' ? 'is-active' : ''}"><select id="wb3FilterDifficulty" aria-label="难度"><option value="全部难度" ${filterDifficulty === '全部难度' ? 'selected' : ''}>难度</option>${difficultyOptions.map((name) => `<option ${filterDifficulty === name ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')}</select></label><label class="wb3-personal-knowledge-filter ${personalKnowledgeFilter !== 'all' ? 'is-active' : ''}" title="${personalCurriculumFilter === 'all' ? '请先选择阶段·科目' : ''}"><select id="wb3PersonalKnowledgeFilter" aria-label="知识点" ${personalCurriculumFilter === 'all' ? 'disabled' : ''}><option value="all">知识点</option>${personalKnowledgeOptionMarkup}</select></label>${personalTagFilterMarkup}<label class="wb3-filter-search"><span class="wb3-main-search">${icons.search}<input id="wb3TreeSearch" type="search" value="${escapeHtml(treeSearchQuery)}" placeholder="搜索题干或标签" aria-label="搜索题干或标签"></span></label>${hasPersonalFilters ? '<button type="button" class="wb3-filter-reset" data-clear-bank-filters>重置</button>' : ''}</div>`
    return `<section class="wb3-library">
      ${workspaceTabsMarkup()}
      ${personalSubtabs}
      <div class="wb3-library-body ${isLibraryTab ? '' : 'wb3-library-body-personal'}">
        ${isLibraryTab ? officialSidebar : ''}
        <div class="wb3-results">
          <header class="wb3-results-head">
            ${filtersMarkup}
          </header>
          ${personalBulkTagToolbarMarkup(questions.length, Boolean(importResultRecord))}
          ${importCompletionNoticeMarkup()}
          ${uploadParsing ? `<div class="wb3-upload-status"><i></i>AI 录题正在解析，完成后题目进入「我的题库」…</div>` : ''}
          <div class="wb3-result-scroll">${resultsBody}</div>${unlockPrompt}
        </div>
        ${questionSource === 'personal' ? aiRecordingDrawerMarkup() : ''}
      </div>
    </section>`
  }

  function sheetQuestionMarkup(question, index) {
    if (question.status === 'adapt') {
      return `<article class="wb3-adapt-card" data-sheet-id="${question.id}">
        <b>第 ${index + 1} 题 · AI 改编待确认</b>
        <div class="wb3-adapt-before">原题：${escapeHtml(question.originalText || '')}</div>
        <div class="wb3-adapt-after">变式：${escapeHtml(question.text || '')}</div>
        <div class="wb3-adapt-actions">
          <button type="button" class="primary" data-adapt-accept="${question.id}">替换原题</button>
          <button type="button" data-adapt-as-new="${question.id}">另加为新题</button>
          <button type="button" data-adapt-reject="${question.id}">不要</button>
        </div>
      </article>`
    }
    const answerShown = revealedAnswerIds.has(question.id)
    const answerLines = Number(question.answerLines || 0)
    const answerStyle = question.answerStyle === 'lined' ? 'lined' : 'blank'
    const answerEditorOpen = answerEditorQuestionId === question.id
    const answerControl = `<span class="wb3-answer-control-wrap">
      <button type="button" class="wb3-answer-trigger ${answerLines ? 'has-area' : ''}" data-answer-editor="${question.id}" title="设置作答区" aria-label="设置作答区"><span>▤</span>${answerLines ? `<em>${answerLines}行</em>` : ''}</button>
      ${answerEditorOpen ? `<div class="wb3-answer-editor-popover">
        <header><b>作答区</b>${answerLines ? `<button type="button" data-answer-space-clear="${question.id}">清除</button>` : '<span>选择一种样式</span>'}</header>
        <div class="wb3-answer-style-options">
          <button type="button" class="${answerLines && answerStyle === 'blank' ? 'active' : ''}" data-answer-style-set="blank" data-question="${question.id}"><i class="blank"></i><span><b>空白区</b><small>适合计算、画图</small></span></button>
          <button type="button" class="${answerLines && answerStyle === 'lined' ? 'active' : ''}" data-answer-style-set="lined" data-question="${question.id}"><i class="lined"></i><span><b>横线区</b><small>适合文字作答</small></span></button>
        </div>
        <footer><span>行数</span><button type="button" data-answer-line-remove="${question.id}" ${answerLines < 1 ? 'disabled' : ''}>−</button><em>${answerLines || 2} 行</em><button type="button" data-answer-line-add="${question.id}">＋</button></footer>
      </div>` : ''}
    </span>`
    const displayIndex = confirmedSheetIndex(question.id) || index + 1
    return `<article class="wb3-sheet-q ${selectedQuestionId === question.id ? 'selected' : ''} ${answerShown ? 'answer-open' : ''} ${answerEditorOpen ? 'answer-editor-open' : ''}" data-sheet-id="${question.id}" data-question-id="${question.id}">
      <button type="button" class="wb3-sheet-q-drag" data-sheet-drag-handle="${question.id}" title="拖动排序" aria-label="拖动排序">${icons.grip}</button>
      <span class="wb3-sheet-q-num">${displayIndex}</span>
      <div class="wb3-sheet-q-main">
        <div class="wb3-sheet-q-tags"><span>${escapeHtml(question.type)}</span><span>${escapeHtml(question.knowledge)}</span><span>${escapeHtml(question.difficulty)}</span><span>${Number(question.score || 0)} 分</span></div>
        <div class="wb3-sheet-q-text wb3-rich-editable" contenteditable="true">${sheetQuestionHtml(question)}</div>
        ${sheetOptionsMarkup(question)}
        ${answerLines > 0 ? `<div class="wb3-answer-space ${answerStyle}" style="--wb3-answer-lines:${answerLines}" aria-label="${answerLines} 行${answerStyle === 'lined' ? '横线' : '空白'}作答区"></div>` : ''}
        ${answerShown ? sheetAnswerBodyMarkup(question) : ''}
        <div class="wb3-sheet-q-tools">
          ${answerControl}
          <button type="button" data-sheet-answer="${question.id}" title="${answerShown ? '收起答案' : '显示答案'}" aria-label="${answerShown ? '收起答案' : '显示答案'}">答</button>
          <button type="button" class="danger" data-delete-question="${question.id}" title="删除题目" aria-label="删除题目">${icons.trash}</button>
        </div>
      </div>
    </article>`
  }

  function rightPanelMarkup() {
    const meta = draftMeta()
    const questions = activeDraft?.questions || []
    const confirmed = questions.filter((q) => q.status === 'confirmed')
    const selectedIndex = questions.findIndex((q) => q.id === selectedQuestionId && q.status === 'confirmed')
    const saveDirty = hasUnsavedCanvasChanges()
    const newDraftDisabled = !canvasHasQuestions()

    const sheetQuestions = questions.filter((q) => q.status === 'confirmed' || q.status === 'adapt')
    const sheetBody = sheetQuestions.length
      ? sheetQuestions.map(sheetQuestionMarkup).join('')
      : `<div class="wb3-empty-sheet">
          <span class="wb3-empty-icon">${icons.blank}</span>
          <b>当前题单还没有题目</b>
          <p>可以从飞象题库或我的题库选题，也可以让 AI 组题；要导入自有试题，请前往「我的题库 → 上传文件」。</p>
          <div class="wb3-empty-actions">
            <button type="button" data-empty-import="library">${icons.knowledge}去飞象题库</button>
            <button type="button" data-empty-import="ai-create">${icons.sparkle}AI组题</button>
          </div>
        </div>`

    return `<aside class="wb3-sheet">
      <header class="wb3-sheet-head">
        <div class="wb3-sheet-head-top">
          <div><b>当前题单</b>${canvasSaveStatusMarkup()}</div>
          <div class="wb3-sheet-head-right"><div class="wb3-sheet-stats">
              <strong>共 ${meta.count} 题</strong>
            </div><button type="button" class="wb3-new-draft" data-new-draft aria-label="${escapeHtml(newDraftButtonTitle())}" title="${escapeHtml(newDraftButtonTitle())}" ${newDraftDisabled ? 'disabled' : ''}>${icons.plus}</button><button type="button" class="wb3-new-draft wb3-save-btn ${saveDirty ? 'dirty' : 'saved'}" data-action="save" aria-label="保存题单" title="${escapeHtml(canvasSaveButtonTitle())}" ${saveDirty ? '' : 'disabled'}>${icons.save}</button><button type="button" class="wb3-new-draft" data-action="download" aria-label="下载题单" title="下载题单">${icons.download}</button>
          </div>
        </div>
      </header>
      ${paperToolbarMarkup()}
      <div class="wb3-sheet-scroll">
        <div class="wb3-paper" style="--wb3-paper-font-size:${paperFormat().fontSize}px;--wb3-paper-line-height:${paperFormat().lineHeight};--wb3-answer-height:${paperFormat().answerHeight}px;--wb3-question-gap:${paperFormat().questionGap}px">
          <input class="wb3-paper-title" id="wb3PaperTitle" value="${escapeHtml(activeDraft?.title || DEFAULT_DRAFT_TITLE)}" placeholder="${escapeHtml(DEFAULT_DRAFT_TITLE)}">
          <div class="wb3-sheet-q-list">${sheetBody}</div>
        </div>
      </div>
    </aside>`
  }

  function personalQuestionOnCanvas(id) {
    return (activeDraft?.questions || []).some((q) => q.status === 'confirmed' && q.sourceId === id)
  }

  function saveBeforeNewDialogMarkup() {
    if (!saveBeforeNewDialogOpen) return ''
    return `<div class="wb3-overlay" data-save-before-new-overlay><div class="wb3-unlock-dialog wb3-confirm-dialog" role="dialog" aria-labelledby="wb3SaveBeforeNewTitle"><span>${icons.blank}</span><h3 id="wb3SaveBeforeNewTitle">无法新建</h3><p>请先保存当前题单，以防数据丢失。</p><div><button type="button" data-save-before-new-cancel>取消</button><button type="button" class="primary" data-save-before-new-save>保存</button></div></div></div>`
  }

  function closeSaveBeforeNewDialog() {
    saveBeforeNewDialogOpen = false
    render()
  }

  function downloadDialogMarkup() {
    if (!downloadDialogOpen) return ''
    const title = escapeHtml(activeDraft?.title || DEFAULT_DRAFT_TITLE)
    const count = confirmedSheetQuestions().length
    return `<div class="wb3-overlay" data-download-dialog-overlay><div class="wb3-unlock-dialog wb3-confirm-dialog wb3-download-dialog" role="dialog" aria-labelledby="wb3DownloadDialogTitle"><span>${icons.download}</span><h3 id="wb3DownloadDialogTitle">下载题单</h3><p>将先保存当前题单，再下载 Word 文档。<strong>题目、答案和解析</strong>将合并在同一文档中；卷首包含学校、班级和姓名栏。</p><p class="wb3-download-dialog-meta"><b>${title}</b><small>共 ${count} 题</small></p><div><button type="button" data-download-dialog-cancel>取消</button><button type="button" class="primary" data-download-dialog-confirm>下载 Word</button></div></div></div>`
  }

  function personalDeletePromptMarkup() {
    if (!personalDeletePromptId) return ''
    const onCanvas = personalQuestionOnCanvas(personalDeletePromptId)
    const hint = onCanvas
      ? '该题已加入右侧当前题单，确认删除后将从<strong>我的题库与当前画布</strong>中一并移除。'
      : '删除后无法再从「我的题库」选用。'
    return `<div class="wb3-overlay" data-personal-delete-overlay><div class="wb3-unlock-dialog wb3-confirm-dialog" role="dialog" aria-labelledby="wb3PersonalDeleteTitle"><span>${icons.trash}</span><h3 id="wb3PersonalDeleteTitle">从我的题库删除？</h3><p>${hint}</p><div><button type="button" data-personal-delete-cancel>取消</button><button type="button" class="primary danger" data-personal-delete-confirm>确认删除</button></div></div></div>`
  }

  function personalTagDeletePromptMarkup() {
    if (!pendingPersonalTagDelete) return ''
    const affectedCount = personalCollectionCount(`tag:${pendingPersonalTagDelete}`)
    return `<div class="wb3-overlay" data-personal-tag-delete-overlay><div class="wb3-unlock-dialog wb3-confirm-dialog" role="dialog" aria-labelledby="wb3PersonalTagDeleteTitle"><span>${icons.trash}</span><h3 id="wb3PersonalTagDeleteTitle">删除自定义标签？</h3><p>删除“${escapeHtml(pendingPersonalTagDelete)}”后，将同时从关联的 ${affectedCount} 道题目中移除该标签。</p><div><button type="button" data-personal-tag-delete-cancel>取消</button><button type="button" class="primary danger" data-personal-tag-delete-confirm>确认删除</button></div></div></div>`
  }

  function deletePersonalTagGlobally(tag) {
    if (!tag) return
    personalQuestions.forEach((question) => {
      question.customTags = (question.customTags || []).filter((item) => item !== tag)
    })
    ;(activeDraft?.questions || []).forEach((question) => {
      if (question.status === 'confirmed' && question.sourceId) question.customTags = (question.customTags || []).filter((item) => item !== tag)
    })
    personalTagCatalog = personalTagCatalog.filter((item) => item !== tag)
    if (personalCollection === `tag:${tag}`) personalCollection = 'all'
    if (questionLabelDraft) questionLabelDraft.customTags = (questionLabelDraft.customTags || []).filter((item) => item !== tag)
    bulkCustomValues.delete(tag)
    pendingPersonalTagDelete = ''
    persistDraft()
    render()
    showToast(`已删除自定义标签“${tag}”`)
  }

  function renderPreservingResultScroll() {
    const scrollTop = root?.querySelector('.wb3-result-scroll')?.scrollTop || 0
    const labelEditorScrollTop = root?.querySelector('.wb3-question-label-editor-body')?.scrollTop || 0
    const bulkLabelEditorScrollTop = root?.querySelector('.wb3-bulk-label-editor-body')?.scrollTop || 0
    const recordingDrawerScrollTop = root?.querySelector('.wb3-ai-recording-task-list')?.scrollTop || 0
    render()
    window.requestAnimationFrame(() => {
      const scroller = root?.querySelector('.wb3-result-scroll')
      if (scroller) scroller.scrollTop = scrollTop
      const labelEditorScroller = root?.querySelector('.wb3-question-label-editor-body')
      if (labelEditorScroller) labelEditorScroller.scrollTop = labelEditorScrollTop
      const bulkLabelEditorScroller = root?.querySelector('.wb3-bulk-label-editor-body')
      if (bulkLabelEditorScroller) bulkLabelEditorScroller.scrollTop = bulkLabelEditorScrollTop
      const recordingDrawerScroller = root?.querySelector('.wb3-ai-recording-task-list')
      if (recordingDrawerScroller) recordingDrawerScroller.scrollTop = recordingDrawerScrollTop
    })
  }

  function openQuestionLabelEditor(questionId, focus = '') {
    const question = personalQuestions.find((item) => item.id === questionId)
    if (!question) return
    questionLabelEditorId = question.id
    questionLabelEditorFocus = ['curriculum', 'type', 'difficulty', 'knowledge', 'custom'].includes(focus) ? focus : ''
    questionLabelDropdownOpen = questionLabelEditorFocus && questionLabelEditorFocus !== 'custom' ? questionLabelEditorFocus : ''
    questionLabelDropdownQuery = ''
    questionLabelDraft = {
      curriculumTags: [...questionCurriculumTags(question)],
      typeTags: [...questionTypeTags(question)],
      difficultyTags: [...questionDifficultyTags(question)],
      knowledgeTags: [...questionKnowledgeTags(question)],
      customTags: [...(question.customTags || [])],
    }
    questionLabelCurriculumSnapshots = new Map([[questionLabelDraft.curriculumTags[0], {
      typeTags: [...questionLabelDraft.typeTags],
      knowledgeTags: [...questionLabelDraft.knowledgeTags],
    }]])
    renderPreservingResultScroll()
    window.requestAnimationFrame(() => {
      if (questionLabelEditorFocus) root?.querySelector(`[data-question-label-group="${questionLabelEditorFocus}"]`)?.scrollIntoView({ block: 'nearest' })
    })
  }

  function closeQuestionLabelEditor() {
    questionLabelEditorId = ''
    questionLabelEditorFocus = 'curriculum'
    questionLabelDraft = null
    questionLabelCurriculumSnapshots = new Map()
    questionLabelDropdownOpen = ''
    questionLabelDropdownQuery = ''
    renderPreservingResultScroll()
  }

  function saveQuestionLabels() {
    const question = personalQuestions.find((item) => item.id === questionLabelEditorId)
    if (!question || !questionLabelDraft) return
    if (!questionLabelDraft.curriculumTags.length) { showToast('至少保留一个阶段·科目标签'); return }
    if (!questionLabelDraft.typeTags.length) { showToast('至少保留一个题型标签'); return }
    const allowedKnowledge = knowledgeOptionsForCurriculums(questionLabelDraft.curriculumTags)
    const nextKnowledgeTags = questionLabelDraft.knowledgeTags.filter((tag) => allowedKnowledge.includes(tag))
    const updates = {
      curriculumTags: [...questionLabelDraft.curriculumTags],
      typeTags: [...questionLabelDraft.typeTags],
      difficultyTags: [questionLabelDraft.difficulty],
      knowledgeTags: [...nextKnowledgeTags],
      customTags: [...questionLabelDraft.customTags],
      curriculum: questionLabelDraft.curriculumTags[0],
      type: questionLabelDraft.typeTags[0],
      difficulty: questionLabelDraft.difficulty,
      knowledge: nextKnowledgeTags[0] || '',
      labelsManuallyEdited: true,
    }
    Object.assign(question, updates)
    let syncedCanvas = false
    activeDraft.questions.forEach((item) => {
      if (item.status !== 'confirmed' || item.sourceId !== question.id) return
      Object.assign(item, {
        ...updates,
        curriculumTags: [...updates.curriculumTags],
        typeTags: [...updates.typeTags],
        difficultyTags: [...updates.difficultyTags],
        knowledgeTags: [...updates.knowledgeTags],
        customTags: [...updates.customTags],
      })
      syncedCanvas = true
    })
    if (syncedCanvas) persistDraft()
    personalTagCatalog = [...new Set([...personalTagCatalog, ...updates.customTags])]
    if (personalCurriculumFilter !== 'all' && !personalCurriculumOptions().includes(personalCurriculumFilter)) personalCurriculumFilter = 'all'
    if (personalKnowledgeFilter !== 'all' && !personalKnowledgeOptions().includes(personalKnowledgeFilter)) personalKnowledgeFilter = 'all'
    if (filterType !== '全部题型' && !personalQuestions.some((item) => questionTypeTags(item).includes(filterType))) filterType = '全部题型'
    if (filterDifficulty !== '全部难度' && !personalQuestions.some((item) => questionDifficultyTags(item).includes(filterDifficulty))) filterDifficulty = '全部难度'
    if (personalCollection.startsWith('tag:') && personalCollectionCount(personalCollection) === 0) personalCollection = 'all'
    questionLabelEditorId = ''
    questionLabelEditorFocus = 'curriculum'
    questionLabelDraft = null
    questionLabelCurriculumSnapshots = new Map()
    questionLabelDropdownOpen = ''
    questionLabelDropdownQuery = ''
    renderPreservingResultScroll()
    showToast(syncedCanvas ? '题目标签已更新，并同步到当前题单' : '题目标签已更新')
  }

  function questionLabelOptionMarkup(group, value, selected, label = value) {
    return `<button type="button" class="${selected ? 'selected' : ''}" data-toggle-question-label="${escapeHtml(value)}" data-question-label-kind="${group}" data-question-label-option-text="${escapeHtml(String(label).toLowerCase())}" aria-pressed="${selected}"><span>${escapeHtml(label)}</span>${selected ? icons.check : ''}</button>`
  }

  function questionCustomTagOptionMarkup(value, selected) {
    return `<span class="wb3-question-custom-tag-option"><button type="button" class="${selected ? 'selected' : ''}" data-toggle-question-label="${escapeHtml(value)}" data-question-label-kind="custom" aria-pressed="${selected}"><span>${escapeHtml(value)}</span>${selected ? icons.check : ''}</button><button type="button" class="wb3-question-custom-tag-delete" data-delete-personal-tag="${escapeHtml(value)}" aria-label="删除自定义标签${escapeHtml(value)}" title="删除后将从所有题目移除">×</button></span>`
  }

  function questionLabelDropdownMarkup(group, title, options, selectedValues, { multiple = true, searchable = true, formatter = (value) => value } = {}) {
    const isOpen = questionLabelDropdownOpen === group
    const selectedLabels = selectedValues.map(formatter)
    const selectedSummary = selectedLabels.length
      ? `${selectedLabels.slice(0, 2).join('、')}${selectedLabels.length > 2 ? ` +${selectedLabels.length - 2}` : ''}`
      : `请选择${title}`
    const query = isOpen && searchable ? questionLabelDropdownQuery.trim().toLowerCase() : ''
    const matchedOptions = query ? options.filter((value) => String(formatter(value)).toLowerCase().includes(query)) : options
    const visibleOptions = matchedOptions.slice(0, 80)
    const optionMarkup = visibleOptions.map((value) => questionLabelOptionMarkup(group, value, selectedValues.includes(value), formatter(value))).join('')
    const resultHint = matchedOptions.length > visibleOptions.length
      ? `<p class="wb3-question-label-dropdown-hint">还有 ${matchedOptions.length - visibleOptions.length} 项，请继续输入关键词</p>`
      : ''
    return `<section class="wb3-question-label-editor-field ${questionLabelEditorFocus === group ? 'focused' : ''}" data-question-label-group="${group}">
      <header><b>${title}</b><span>${multiple ? '可多选' : '单选'}</span></header>
      <div class="wb3-question-label-select ${isOpen ? 'open' : ''}">
        <button type="button" class="wb3-question-label-select-trigger" data-toggle-question-label-dropdown="${group}" aria-expanded="${isOpen}"><span class="${selectedLabels.length ? '' : 'placeholder'}">${escapeHtml(selectedSummary)}</span><i aria-hidden="true">⌄</i></button>
        ${isOpen ? `<div class="wb3-question-label-dropdown">${searchable ? `<label>${icons.search}<input type="search" value="${escapeHtml(questionLabelDropdownQuery)}" data-question-label-dropdown-search="${group}" placeholder="搜索${title}" autocomplete="off"></label>` : ''}<div class="wb3-question-label-dropdown-meta">已选 ${selectedValues.length} 项 · 共 ${options.length} 项</div><div class="wb3-question-label-dropdown-options" role="listbox" aria-multiselectable="${multiple}">${optionMarkup || '<p class="wb3-question-label-dropdown-empty">没有匹配项</p>'}</div>${resultHint}</div>` : ''}
      </div>
    </section>`
  }

  function createQuestionCustomTag() {
    if (!questionLabelDraft) return
    const input = $('#wb3NewQuestionCustomTag', root)
    const tag = (input?.value || '').trim().replace(/\s+/g, ' ')
    if (!tag) { showToast('请输入自定义标签'); input?.focus(); return }
    if (questionLabelDraft.customTags.includes(tag)) { showToast('当前题目已添加该标签'); input?.focus(); return }
    questionLabelDraft.customTags = [...questionLabelDraft.customTags, tag]
    questionLabelEditorFocus = 'custom'
    renderPreservingResultScroll()
    window.requestAnimationFrame(() => $('#wb3NewQuestionCustomTag', root)?.focus())
  }

  function questionLabelEditorMarkup() {
    const question = personalQuestions.find((item) => item.id === questionLabelEditorId)
    if (!question || !questionLabelDraft) return ''
    const activeCurriculum = questionLabelDraft.curriculumTags[0]
    const curriculumTypeOptions = bankQuestions.filter((item) => item.curriculum === activeCurriculum).map((item) => item.type).filter(Boolean)
    const typeOptions = [...new Set([...curriculumTypeOptions, ...questionLabelDraft.typeTags])]
    const difficultyOptions = [...new Set([...bankQuestions.map((item) => item.difficulty).filter(Boolean), questionLabelDraft.difficulty])]
    const knowledgeOptions = [...new Set([
      ...knowledgeOptionsForCurriculums(questionLabelDraft.curriculumTags),
      ...questionLabelDraft.knowledgeTags,
    ])]
    const customOptions = [...new Set([...personalTagOptions(), ...questionLabelDraft.customTags])]
    return `<div class="wb3-overlay wb3-question-label-overlay" data-question-label-overlay><section class="wb3-question-label-dialog" role="dialog" aria-modal="true" aria-labelledby="wb3QuestionLabelTitle">
      <header><span>${icons.tag}</span><div><h3 id="wb3QuestionLabelTitle">编辑题目标签</h3><p>系统标签从飞象标签库选择，自定义标签由你自由创建</p></div><button type="button" data-close-question-label-editor aria-label="关闭">×</button></header>
      <div class="wb3-question-label-editor-body">
        ${questionLabelDropdownMarkup('curriculum', '阶段·科目', Object.keys(curriculumCatalog), questionLabelDraft.curriculumTags, { multiple: false, searchable: false, formatter: curriculumTagLabel })}
        ${questionLabelDropdownMarkup('type', '题型', typeOptions, questionLabelDraft.typeTags)}
        ${questionLabelDropdownMarkup('difficulty', '难度', difficultyOptions, [questionLabelDraft.difficulty], { multiple: false })}
        ${questionLabelDropdownMarkup('knowledge', '知识点', knowledgeOptions, questionLabelDraft.knowledgeTags)}
        <section class="wb3-question-label-editor-group ${questionLabelEditorFocus === 'custom' ? 'focused' : ''} custom" data-question-label-group="custom"><header><b>自定义标签</b><span>自由创建，删除后同步解除所有题目关联</span></header><div>${customOptions.map((value) => questionCustomTagOptionMarkup(value, questionLabelDraft.customTags.includes(value))).join('')}<label class="wb3-custom-tag-compose"><span aria-hidden="true">${icons.plus}</span><input id="wb3NewQuestionCustomTag" maxlength="12" placeholder="新建标签，回车添加" aria-label="新建自定义标签"></label></div></section>
      </div>
      <footer><span>人工修改后，AI 不再自动覆盖这些标签</span><button type="button" data-close-question-label-editor>取消</button><button type="button" class="primary" data-save-question-labels>保存</button></footer>
    </section></div>`
  }

  function resetBulkLabelEditorState() {
    bulkSetKnowledgeEnabled = false
    bulkSetCustomEnabled = false
    bulkKnowledgeValues = new Set()
    bulkCustomValues = new Set()
    bulkKnowledgeQuery = ''
  }

  function openPersonalTagEditor(questionIds) {
    personalTagEditorQuestionIds = [...new Set(questionIds)].filter((id) => personalQuestions.some((question) => question.id === id))
    resetBulkLabelEditorState()
    renderPreservingResultScroll()
  }

  function closePersonalTagEditor() {
    personalTagEditorQuestionIds = []
    resetBulkLabelEditorState()
    renderPreservingResultScroll()
  }

  function createBulkCustomTag() {
    if (!bulkSetCustomEnabled) return
    const input = $('#wb3NewPersonalTag', root)
    const tag = (input?.value || '').trim().replace(/\s+/g, ' ')
    if (!tag) { showToast('请输入标签名称'); input?.focus(); return }
    if (bulkCustomValues.has(tag)) { showToast('该标签已选择'); input?.focus(); return }
    bulkCustomValues.add(tag)
    renderPreservingResultScroll()
    window.requestAnimationFrame(() => $('#wb3NewPersonalTag', root)?.focus())
  }

  function applyPersonalTags() {
    if (!personalTagEditorQuestionIds.length) return
    const hasEnabledScope = bulkSetKnowledgeEnabled || bulkSetCustomEnabled
    const selectionValid = hasEnabledScope
      && (!bulkSetKnowledgeEnabled || bulkKnowledgeValues.size > 0)
      && (!bulkSetCustomEnabled || bulkCustomValues.size > 0)
    if (!selectionValid) {
      showToast(hasEnabledScope ? '请先选择要统一设置的标签' : '请先选择要设置的标签类型')
      return
    }
    const knowledgeTags = [...bulkKnowledgeValues]
    const customTags = [...bulkCustomValues]
    const updatedKinds = []
    if (bulkSetKnowledgeEnabled) updatedKinds.push('知识点')
    if (bulkSetCustomEnabled) updatedKinds.push('自定义标签')
    let syncedCanvas = false
    personalQuestions.forEach((question) => {
      if (!personalTagEditorQuestionIds.includes(question.id)) return
      if (bulkSetKnowledgeEnabled) {
        question.knowledgeTags = [...knowledgeTags]
        question.knowledge = knowledgeTags[0] || ''
      }
      if (bulkSetCustomEnabled) question.customTags = [...customTags]
      question.labelsManuallyEdited = true
      activeDraft.questions.forEach((item) => {
        if (item.status !== 'confirmed' || item.sourceId !== question.id) return
        if (bulkSetKnowledgeEnabled) {
          item.knowledgeTags = [...knowledgeTags]
          item.knowledge = knowledgeTags[0] || ''
        }
        if (bulkSetCustomEnabled) item.customTags = [...customTags]
        item.labelsManuallyEdited = true
        syncedCanvas = true
      })
    })
    if (bulkSetCustomEnabled) personalTagCatalog = [...new Set([...personalTagCatalog, ...customTags])]
    const count = personalTagEditorQuestionIds.length
    personalTagEditorQuestionIds = []
    resetBulkLabelEditorState()
    if (syncedCanvas) persistDraft()
    if (personalKnowledgeFilter !== 'all' && !personalKnowledgeOptions().includes(personalKnowledgeFilter)) personalKnowledgeFilter = 'all'
    if (personalCollection.startsWith('tag:') && personalCollectionCount(personalCollection) === 0) personalCollection = 'all'
    renderPreservingResultScroll()
    const summary = updatedKinds.join('和')
    showToast(syncedCanvas ? `已统一设置 ${count} 道题的${summary}，并同步到当前题单` : `已统一设置 ${count} 道题的${summary}`)
  }

  function removePersonalTag(questionId, tag) {
    const question = personalQuestions.find((item) => item.id === questionId)
    if (!question) return
    question.customTags = (question.customTags || []).filter((item) => item !== tag)
    renderPreservingResultScroll()
    showToast(`已移除自定义标签“${tag}”`)
  }

  function personalTagEditorMarkup() {
    const targetQuestions = personalTagEditorQuestionIds.map((id) => personalQuestions.find((question) => question.id === id)).filter(Boolean)
    if (!targetQuestions.length) return ''
    const targetCount = targetQuestions.length
    const curriculumSignatures = new Set(targetQuestions.map((question) => questionCurriculumTags(question).slice().sort().join('|')))
    const targetCurriculums = curriculumSignatures.size === 1 ? questionCurriculumTags(targetQuestions[0]) : []
    const canSetKnowledge = curriculumSignatures.size === 1 && targetCurriculums.length > 0
    const knowledgeOptions = knowledgeOptionsForCurriculums(targetCurriculums)
    const query = bulkKnowledgeQuery.trim().toLowerCase()
    const knowledgeMatches = query
      ? knowledgeOptions.filter((tag) => tag.toLowerCase().includes(query) && !bulkKnowledgeValues.has(tag)).slice(0, 8)
      : []
    const availableCustomTags = personalTagOptions().filter((tag) => !bulkCustomValues.has(tag))
    const selectedValueMarkup = (kind, values) => values.length
      ? values.map((tag) => `<span class="wb3-bulk-overwrite-value">${escapeHtml(tag)}<button type="button" data-remove-bulk-value="${escapeHtml(tag)}" data-bulk-label-kind="${kind}" aria-label="移除${escapeHtml(tag)}">×</button></span>`).join('')
      : '<p>暂未选择</p>'
    const hasEnabledScope = bulkSetKnowledgeEnabled || bulkSetCustomEnabled
    const selectionValid = hasEnabledScope
      && (!bulkSetKnowledgeEnabled || bulkKnowledgeValues.size > 0)
      && (!bulkSetCustomEnabled || bulkCustomValues.size > 0)
    const enabledKinds = [bulkSetKnowledgeEnabled ? '知识点' : '', bulkSetCustomEnabled ? '自定义标签' : ''].filter(Boolean)
    const footerText = selectionValid
      ? `将统一覆盖所选题目的${enabledKinds.join('和')}`
      : hasEnabledScope ? '请为已勾选的类型选择至少一个标签' : '请勾选要统一设置的标签类型；未勾选的保持不变'
    return `<div class="wb3-overlay wb3-personal-tag-overlay" data-personal-tag-overlay><section class="wb3-personal-tag-dialog" role="dialog" aria-modal="true" aria-labelledby="wb3PersonalTagTitle">
      <header><span>${icons.tag}</span><div><h3 id="wb3PersonalTagTitle">批量设置标签</h3><p>已选择 ${targetCount} 道题。仅勾选的标签类型会被统一设置，未勾选的保持不变。</p></div><button type="button" data-close-personal-tag aria-label="关闭">×</button></header>
      <div class="wb3-bulk-label-editor-body">
        <div class="wb3-bulk-overwrite-modes" role="group" aria-label="选择要设置的标签类型">
          <label class="wb3-bulk-overwrite-card ${bulkSetKnowledgeEnabled ? 'active' : ''} ${canSetKnowledge ? '' : 'disabled'}"><input type="checkbox" data-bulk-label-scope="knowledge" ${bulkSetKnowledgeEnabled ? 'checked' : ''} ${canSetKnowledge ? '' : 'disabled'}><span><b>设置知识点</b><small>${canSetKnowledge ? '勾选后，统一覆盖所选题目的原知识点' : '所选题目阶段·科目不一致，请分批设置'}</small></span></label>
          <label class="wb3-bulk-overwrite-card ${bulkSetCustomEnabled ? 'active' : ''}"><input type="checkbox" data-bulk-label-scope="custom" ${bulkSetCustomEnabled ? 'checked' : ''}><span><b>设置自定义标签</b><small>勾选后，统一覆盖所选题目的原自定义标签</small></span></label>
        </div>
        <div class="wb3-bulk-overwrite-fields">
          ${bulkSetKnowledgeEnabled ? `<section class="wb3-bulk-overwrite-field"><header><div><b>选择知识点</b><span>可多选，仅使用飞象标签库</span></div><em>将覆盖原知识点</em></header><div class="wb3-bulk-overwrite-selected">${selectedValueMarkup('knowledge', [...bulkKnowledgeValues])}</div><label class="wb3-bulk-overwrite-search">${icons.search}<input id="wb3BulkKnowledgeSearch" value="${escapeHtml(bulkKnowledgeQuery)}" placeholder="搜索知识点" autocomplete="off"></label>${query ? `<div class="wb3-bulk-overwrite-options">${knowledgeMatches.length ? knowledgeMatches.map((tag) => `<button type="button" data-add-bulk-value="${escapeHtml(tag)}" data-bulk-label-kind="knowledge"><span>${escapeHtml(tag)}</span><em>选择</em></button>`).join('') : '<p>没有匹配的知识点</p>'}</div>` : '<small class="wb3-bulk-overwrite-hint">知识点较多，请输入关键词搜索后选择</small>'}${bulkKnowledgeValues.size ? '' : '<p class="wb3-bulk-overwrite-error">至少选择一个知识点后才能保存</p>'}</section>` : ''}
          ${bulkSetCustomEnabled ? `<section class="wb3-bulk-overwrite-field"><header><div><b>选择自定义标签</b><span>可选择已有标签，也可自由创建</span></div><em>将覆盖原自定义标签</em></header><div class="wb3-bulk-overwrite-selected">${selectedValueMarkup('custom', [...bulkCustomValues])}</div><div class="wb3-bulk-overwrite-custom-options">${availableCustomTags.map((tag) => `<button type="button" data-add-bulk-value="${escapeHtml(tag)}" data-bulk-label-kind="custom">＋ ${escapeHtml(tag)}</button>`).join('')}<label class="wb3-custom-tag-compose"><span aria-hidden="true">${icons.plus}</span><input id="wb3NewPersonalTag" maxlength="12" placeholder="输入后回车新建" aria-label="新建自定义标签"></label></div>${bulkCustomValues.size ? '' : '<p class="wb3-bulk-overwrite-error">至少选择一个自定义标签后才能保存</p>'}</section>` : ''}
        </div>
      </div>
      <footer><span>${footerText}</span><button type="button" data-close-personal-tag>取消</button><button type="button" class="primary" data-confirm-personal-tag ${selectionValid ? '' : 'disabled'}>保存</button></footer>
    </section></div>`
  }

  function personalBulkTagToolbarMarkup(resultCount = 0, inImportResult = false) {
    const count = [...selectedPersonalQuestionIds].filter((id) => personalQuestions.some((question) => question.id === id)).length
    if (questionSource !== 'personal' || importWorkspaceView !== 'library' || personalLibraryMode !== 'questions' || inImportResult) return ''
    if (!personalBatchMode) return `<div class="wb3-personal-bulk-toolbar wb3-personal-list-toolbar"><span>共 ${resultCount} 道题</span><button type="button" data-toggle-personal-batch ${resultCount ? '' : 'disabled'}>${icons.tag}批量操作</button></div>`
    return `<div class="wb3-personal-bulk-toolbar active" role="toolbar" aria-label="批量操作题目"><span>${count ? `已选 <b>${count}</b> 道题` : '请选择要批量编辑标签的题目'}</span><button type="button" data-clear-personal-selection ${count ? '' : 'disabled'}>清空选择</button><button type="button" class="primary" data-open-bulk-personal-tag ${count ? '' : 'disabled'}>${icons.tag}批量编辑标签</button><button type="button" data-toggle-personal-batch>退出</button></div>`
  }

  function paperActionPromptMarkup() {
    if (pendingPaperEditId) {
      const paper = allKnowledgePapers().find((item) => item.id === pendingPaperEditId)
      return `<div class="wb3-overlay" data-paper-edit-overlay><div class="wb3-unlock-dialog wb3-confirm-dialog" role="dialog" aria-labelledby="wb3PaperEditTitle"><span>${icons.blank}</span><h3 id="wb3PaperEditTitle">当前题单尚未保存</h3><p>直接打开“${escapeHtml(paper?.title || '该题单')}”将会丢失当前题单中未保存的编辑内容，是否继续？</p><div><button type="button" data-paper-edit-cancel>取消</button><button type="button" class="primary danger" data-paper-edit-confirm>直接打开</button></div></div></div>`
    }
    if (pendingPaperDeleteId) {
      const paper = allKnowledgePapers().find((item) => item.id === pendingPaperDeleteId)
      return `<div class="wb3-overlay" data-paper-delete-overlay><div class="wb3-unlock-dialog wb3-confirm-dialog" role="dialog" aria-labelledby="wb3PaperDeleteTitle"><span>${icons.trash}</span><h3 id="wb3PaperDeleteTitle">删除题单？</h3><p>确认删除“${escapeHtml(paper?.title || '该题单')}”？删除后无法恢复。</p><div><button type="button" data-paper-delete-cancel>取消</button><button type="button" class="primary danger" data-paper-delete-confirm>确认删除</button></div></div></div>`
    }
    return ''
  }

  function editKnowledgePaper(id) {
    const paper = allKnowledgePapers().find((item) => item.id === id)
    if (!paper) return
    let targetDraft = paper.draftId ? loadDraftById(paper.draftId) : null
    if (!targetDraft) {
      targetDraft = {
        id: makeId('draft'), title: paper.title || DEFAULT_DRAFT_TITLE,
        subject: currentCurriculum().subject, curriculumKey,
        questions: (paper.questions || []).map((question) => cloneQuestion(question)),
        createdAt: Date.now(), updatedAt: Date.now(), savedAt: Date.now(),
      }
      targetDraft.savedSnapshot = captureDraftSnapshot(targetDraft)
      try {
        const drafts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').filter((draft) => draft.id !== targetDraft.id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify([targetDraft, ...drafts].slice(0, 20)))
      } catch { /* ignore */ }
    }
    prepareKnowledgeEditSwitch(targetDraft.id)
    activateDraft(targetDraft)
    importWorkspaceView = 'library'
    questionSource = 'personal'
    personalLibraryMode = 'papers'
    previewKnowledgePaperId = ''
    render()
    showToast(`已打开「${paper.title}」进行编辑`)
  }

  function deleteKnowledgePaper(id) {
    const paper = allKnowledgePapers().find((item) => item.id === id)
    if (!paper) return
    if (paper.draftId) {
      try {
        const drafts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').filter((draft) => draft.id !== paper.draftId)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts.slice(0, 20)))
        if (activeDraft?.id === paper.draftId) {
          activeDraft.savedAt = 0
          activeDraft.savedSnapshot = null
          activeDraft.updatedAt = Date.now()
        }
      } catch { /* ignore */ }
    } else {
      const index = knowledgePapers.findIndex((item) => item.id === id)
      if (index >= 0) knowledgePapers.splice(index, 1)
    }
    pendingPaperDeleteId = ''
    render()
    showToast(`已删除「${paper.title}」`)
  }

  function removePersonalQuestion(id) {
    const removedFromCanvas = personalQuestionOnCanvas(id)
    if (removedFromCanvas) {
      activeDraft.questions = activeDraft.questions.filter((q) => !(q.status === 'confirmed' && q.sourceId === id))
      if (selectedQuestionId && !activeDraft.questions.some((q) => q.id === selectedQuestionId)) selectedQuestionId = ''
      persistDraft()
    }
    personalQuestions = personalQuestions.filter((question) => question.id !== id)
    selectedPersonalQuestionIds.delete(id)
    personalTagEditorQuestionIds = personalTagEditorQuestionIds.filter((questionId) => questionId !== id)
    revealedAnswerIds.delete(id)
    if (adaptRequest?.source?.id === id) adaptRequest = null
    if (adaptPicker?.source?.id === id) adaptPicker = null
    personalDeletePromptId = ''
    render()
    showToast(removedFromCanvas ? '已从我的题库删除，并同步移出当前题单' : '已从“我的题库”删除')
  }

  function render() {
    if (!root || !activeDraft) return
    captureAiCreateInputDraft()
    root.innerHTML = `<div class="wb3-shell">${leftPanelMarkup()}${rightPanelMarkup()}</div>
    ${knowledgeModalMarkup()}
    ${questionLabelEditorMarkup()}
    ${personalTagEditorMarkup()}
    ${personalDeletePromptMarkup()}
    ${personalTagDeletePromptMarkup()}
    ${paperActionPromptMarkup()}
    ${saveBeforeNewDialogMarkup()}
    ${downloadDialogMarkup()}
    ${mathEditorModalMarkup()}
    ${symbolModalMarkup()}
    <input id="wb3FileInput" type="file" accept=".doc,.docx,.pdf,.png,.jpg,.jpeg,image/*" multiple hidden>
    <input id="wb3AiCreateFileInput" type="file" accept=".doc,.docx,.pdf,.png,.jpg,.jpeg,.webp,image/*" multiple hidden>
    <div class="wb3-toast" id="wb3Toast" role="status"></div>`
    if (activeRichEditorQuestionId) activeRichEditorEl()?.focus()
  }

  function toggleQuestionFromBank(id) {
    const existing = activeDraft.questions.findIndex((q) => q.sourceId === id && q.status === 'confirmed')
    if (existing >= 0) {
      if (selectedQuestionId === activeDraft.questions[existing].id) selectedQuestionId = ''
      activeDraft.questions.splice(existing, 1)
      persistDraft()
      showToast('已从题单移除')
      render()
      return
    }
    const source = findQuestionById(id)
    if (!source) return
    activeDraft.questions.push(cloneQuestion(source))
    persistDraft()
    showToast('已加入题单')
    highlightAdded(id)
    render()
  }

  function addConfirmedQuestionsFromSources(list, message) {
    const addedMap = getAddedMap()
    const newItems = list.filter((question) => !addedMap.has(question.id))
    newItems.forEach((question) => activeDraft.questions.push(cloneQuestion(question)))
    if (!newItems.length) { showToast('这些题目已经在当前题单中'); return }
    persistDraft()
    render()
    showToast(message || `已加入 ${newItems.length} 道题`)
    highlightLastAdded()
  }

  function sanitizeExportFilename(title = '') {
    const safe = String(title).replace(/[/\\?%*:|"<>]/g, '_').trim()
    return safe || DEFAULT_DRAFT_TITLE
  }

  function exportAnswerAreaMarkup(question) {
    const lines = Number(question.answerLines || 0)
    if (!lines) return ''
    if (question.answerStyle === 'lined') {
      return `<div class="answer-area lined">${Array.from({ length: lines }, () => '<div class="answer-line"></div>').join('')}</div>`
    }
    return `<div class="answer-area blank" style="height:${Math.max(28, lines * 28)}px"></div>`
  }

  function buildPaperExportHtml(includeAnswers) {
    const title = sanitizeExportFilename(activeDraft?.title || DEFAULT_DRAFT_TITLE)
    const fmt = paperFormat()
    const questionsHtml = confirmedSheetQuestions().map((question, index) => {
      const stem = question.textHtml || escapeHtml(question.text || '')
      const options = question.options?.length || question.optionsHtml
        ? `<p class="options">${question.optionsHtml || escapeHtml((question.options || []).join('　'))}</p>`
        : ''
      const keys = includeAnswers
        ? `<div class="answer-keys"><p><b>答案：</b>${escapeHtml(questionAnswerText(question))}</p><p><b>解析：</b>${escapeHtml(questionAnalysisText(question))}</p></div>`
        : ''
      return `<section class="question"><p class="stem"><span class="num">${index + 1}.</span> ${stem}</p>${options}${exportAnswerAreaMarkup(question)}${keys}</section>`
    }).join('')
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
      body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;font-size:${fmt.fontSize}px;line-height:${fmt.lineHeight};color:#111;padding:32px 40px;}
      .school-header{text-align:center;font-size:12px;color:#555;margin:0 0 20px;letter-spacing:.02em;}
      h1{text-align:center;font-size:20px;margin:0 0 24px;font-weight:700;}
      .question{margin-bottom:${Math.round(fmt.questionGap * 16)}px;}
      .stem{margin:0 0 8px;}
      .num{font-weight:700;margin-right:4px;}
      .options{margin:6px 0 0;font-size:${Math.max(11, fmt.fontSize - 1)}px;color:#333;}
      .answer-area.lined{margin-top:10px;}
      .answer-line{border-bottom:1px solid #333;height:${Math.round(fmt.answerHeight * 18)}px;margin-bottom:6px;}
      .answer-area.blank{margin-top:10px;border:1px solid #ccc;background:#fafafa;}
      .answer-keys{margin-top:10px;padding:10px 12px;background:#f5f8f6;font-size:${Math.max(11, fmt.fontSize - 1)}px;}
      .formula,.wb3-formula{font-family:"Times New Roman",serif;font-style:italic;background:#eef5f1;padding:0 4px;border-radius:3px;}
      @media print{body{padding:24px 32px;}}
    </style></head><body>
      <p class="school-header">${escapeHtml(PAPER_EXPORT_SCHOOL_HEADER)}</p>
      <h1>${escapeHtml(title)}</h1>
      ${questionsHtml}
    </body></html>`
  }

  function downloadExportBlob(filename, html, mimeType) {
    const blob = new Blob(['\ufeff', html], { type: mimeType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  function downloadPaperPdf(html) {
    const printWin = window.open('', '_blank', 'noopener,noreferrer')
    if (!printWin) {
      showToast('请允许弹出窗口，以便导出 PDF')
      return false
    }
    printWin.document.open()
    printWin.document.write(html)
    printWin.document.close()
    printWin.focus()
    window.setTimeout(() => {
      try { printWin.print() } catch { /* ignore */ }
    }, 300)
    return true
  }

  function openDownloadDialog() {
    if (!confirmedSheetQuestions().length) {
      showToast('题单还没有题目，无法下载')
      return
    }
    saveDraftManuallyIfDirty({ silent: true })
    downloadDialogOpen = true
    render()
  }

  function closeDownloadDialog() {
    downloadDialogOpen = false
    render()
  }

  function downloadPaperWordWithAnswers() {
    saveDraftManuallyIfDirty({ silent: true })
    const html = buildPaperExportHtml(true)
    const baseName = sanitizeExportFilename(activeDraft?.title || DEFAULT_DRAFT_TITLE)
    downloadExportBlob(`${baseName}.doc`, html, 'application/msword')
    downloadDialogOpen = false
    render()
    showToast('已下载 Word（题目与答案解析在同一文件中）')
  }

  function highlightAdded(sourceId) {
    window.requestAnimationFrame(() => {
      const target = $(`[data-question-id="${activeDraft.questions.find((q) => q.sourceId === sourceId)?.id}"]`, root)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target?.classList.add('wb3-question-just-added')
      window.setTimeout(() => target?.classList.remove('wb3-question-just-added'), 1200)
    })
  }

  function highlightLastAdded() {
    window.requestAnimationFrame(() => {
      const confirmed = activeDraft.questions.filter((q) => q.status === 'confirmed')
      const target = confirmed.length ? $(`[data-sheet-id="${confirmed[confirmed.length - 1].id}"]`, root) : null
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target?.classList.add('wb3-question-just-added')
      window.setTimeout(() => target?.classList.remove('wb3-question-just-added'), 1200)
    })
  }

  function startImportRecord(file) {
    if (!file) return
    const recordId = makeId('record')
    aiImportRecords.unshift({ id: recordId, filename: file.name, status: 'processing', stage: '正在识别题目', submittedAt: '刚刚', eta: '预计还需 4–10 分钟', questions: [] })
    scheduleImportRecordProgress(recordId)
    return recordId
  }

  function scheduleImportRecordProgress(recordId) {
    const phases = [
      [1700, '正在提取答案与解析'],
      [3400, '正在添加题目标签'],
      [5000, '正在存入我的题库'],
    ]
    phases.forEach(([delay, stage]) => window.setTimeout(() => {
      const record = aiImportRecords.find((item) => item.id === recordId)
      if (!record || record.status !== 'processing') return
      record.stage = stage
      if (root && !root.hidden) renderPreservingResultScroll()
    }, delay))
    window.setTimeout(() => completeImportRecord(recordId), 6500)
  }

  function handleUploadFiles(fileList) {
    const candidates = [...(fileList || [])].filter(Boolean)
    if (!candidates.length) return
    const supportedFilePattern = /\.(doc|docx|pdf|png|jpe?g)$/i
    const files = candidates.filter((file) => supportedFilePattern.test(file.name || '') && Number(file.size || 0) <= 20 * 1024 * 1024)
    const rejectedCount = candidates.length - files.length
    if (!files.length) {
      showToast('请选择 20 MB 以内的 PNG、JPG、PDF、DOC 或 DOCX 文件')
      return
    }
    importMenuOpen = false
    openAiRecording()
    files.forEach((file) => startImportRecord(file))
    renderPreservingResultScroll()
    showToast(rejectedCount ? `已开始 ${files.length} 个任务，${rejectedCount} 个文件格式或大小不符合要求` : files.length > 1 ? `已上传 ${files.length} 个文件，正在 AI 解析` : '文件已上传，正在 AI 解析')
  }

  function importKnowledgePaper(paperId) {
    const paper = allKnowledgePapers().find((p) => p.id === paperId)
    if (!paper) return
    knowledgeModalOpen = false
    addConfirmedQuestionsFromSources(paper.questions, `已从「${paper.title}」选用 ${paper.questions.length} 道题`)
  }

  function aiModeFromPrompt() {
    if (adaptRequest) return 'adapt'
    return activeDraft.questions.some((q) => q.status === 'confirmed') ? 'append' : 'generate'
  }

  function generateAiDrafts(prompt, mode = 'append') {
    if (aiGenerating) return
    aiGenerating = true
    const selected = activeDraft.questions.find((q) => q.id === selectedQuestionId && q.status === 'confirmed')
    if (mode === 'adapt' && !selected) { aiGenerating = false; showToast('请先选择要改编的题目'); return }
    const requestedCount = Number(/(\d+)\s*道/.exec(prompt)?.[1] || (mode === 'adapt' ? 2 : 5))
    const activeConversationRecord = importWorkspaceView === 'ai-compose-record' ? aiComposeRecords.find((record) => record.id === activeAiComposeRecordId) : null
    const previousComposeRecord = activeConversationRecord || aiComposeRecords.find((record) => record.autoAdded)
    const continuesConversation = mode === 'append' && Boolean(activeConversationRecord)
    const composeId = makeId('compose')
    const conversationId = activeConversationRecord?.conversationId || activeConversationRecord?.id || composeId
    const conversationTurns = aiComposeRecords.filter((item) => (item.conversationId || item.id) === conversationId)
    const composeRecord = {
      id: composeId,
      conversationId,
      turnIndex: conversationTurns.length + 1,
      title: mode === 'adapt' ? `改编：${selected.text.slice(0, 16)}…` : prompt.length > 22 ? `${prompt.slice(0, 22)}…` : prompt,
      prompt,
      mode,
      status: 'processing',
      createdAt: '刚刚',
      historyAt: Date.now(),
      historyDate: formatAiComposeHistoryDate(Date.now()),
      questions: [],
      original: selected ? { ...selected } : null,
      originalQuestionId: activeDraft.questions.some((item) => item.id === selected?.id) ? selected.id : '',
      needsCanvasConfirmation: activeDraft.questions.some((item) => item.status === 'confirmed'),
      existingCount: activeDraft.questions.filter((item) => item.status === 'confirmed').length,
      parentRecordId: continuesConversation ? previousComposeRecord.id : '',
      plan: {
        count: mode === 'adapt' ? 2 : Math.min(requestedCount, 10),
        types: mode === 'adapt' ? selected.type : '选择、填空、解答',
        difficulty: mode === 'adapt' ? `${selected.difficulty}，按要求调整` : mode === 'append' ? '结合当前题单补足梯度' : '基础为主，难度递进',
        knowledge: mode === 'adapt' ? selected.knowledge : activeKnowledge === '全部知识点' ? '覆盖当前学科核心知识点' : activeKnowledge,
        minutes: mode === 'adapt' ? Number(selected.score || 1) : Math.max(10, Math.min(requestedCount, 10) * 3),
      },
    }
    aiComposeRecords.unshift(composeRecord)
    activeAiComposeRecordId = composeRecord.id
    importWorkspaceView = 'ai-compose-record'
    render()

    window.setTimeout(() => {
      aiGenerating = false
      const confirmed = activeDraft.questions.filter((q) => q.status === 'confirmed')
      if (mode === 'adapt' && selected) {
        composeRecord.questions = [
          { ...selected, id: `${composeRecord.id}-q1`, source: 'ai-compose', text: `${selected.text.replace(/。?$/, '')}（变式一：结合校园生活情境重新表述。）` },
          { ...selected, id: `${composeRecord.id}-q2`, source: 'ai-compose', text: `${selected.text.replace(/。?$/, '')}（变式二：保持知识点不变，调整数据与设问。）` },
        ]
        composeRecord.status = 'completed'
        render()
        showToast('AI 已生成 2 个改编方案，可替换原题或另加新题')
        return
      }

      const templates = bankQuestions.filter((question) => (question.curriculum || '小学数学') === curriculumKey)
      const list = templates.slice(0, Math.min(requestedCount, templates.length))
      composeRecord.questions = list.map((question, index) => ({ ...question, id: `${composeRecord.id}-q${index + 1}`, source: 'ai-compose' }))
      composeRecord.status = 'completed'
      render()
      showToast(`AI 已生成 ${list.length} 道题，可逐题选用或全部加入当前题单`)
    }, 1200)
  }

  function acceptAdapt(id) {
    const adapt = activeDraft.questions.find((item) => item.id === id)
    if (!adapt) return
    const original = activeDraft.questions.find((q) => q.id === adapt.adaptTargetId)
    if (original) {
      original.text = adapt.text
      original.options = adapt.options
    }
    activeDraft.questions = activeDraft.questions.filter((item) => item.id !== id)
    persistDraft()
    showToast('已替换原题')
    render()
  }

  function acceptAdaptAsNew(id) {
    const q = activeDraft.questions.find((item) => item.id === id)
    if (!q) return
    q.status = 'confirmed'
    q.id = makeId('sheet')
    delete q.originalText
    persistDraft()
    showToast('已另加为新题')
    render()
  }

  function rejectAdapt(id) {
    activeDraft.questions = activeDraft.questions.filter((item) => item.id !== id)
    persistDraft()
    showToast('已放弃本次改编')
    render()
  }

  function ensureRoot() {
    if (root) return
    root = document.createElement('section')
    root.className = 'fx-question-workbench-v3'
    root.hidden = true
    root.setAttribute('role', 'dialog')
    root.setAttribute('aria-modal', 'true')
    root.setAttribute('aria-label', '飞象题库')
    document.body.appendChild(root)
    bindRichFloatPointerTracking()

    root.addEventListener('click', (event) => {
      if (textbookPickerOpen && !event.target.closest('.wb3-textbook-picker')) {
        textbookPickerOpen = false
        render()
        return
      }
      if (event.target.closest('[data-toggle-textbook-picker]')) {
        textbookPickerOpen = !textbookPickerOpen
        if (textbookPickerOpen) textbookPickerEdition = currentTextbook().edition
        render()
        return
      }
      const textbookEdition = event.target.closest('[data-textbook-edition]')
      if (textbookEdition) {
        textbookPickerEdition = textbookEdition.dataset.textbookEdition
        render()
        return
      }
      const textbookPick = event.target.closest('[data-textbook-pick]')
      if (textbookPick) {
        const [edition, volume, year] = String(textbookPick.dataset.textbookPick || '').split('|')
        setCurrentTextbook(edition, volume, year)
        textbookPickerOpen = false
        expandDefaultChapters()
        previewBankPaperId = ''
        officialPage = 1
        render()
        showToast(`已切换到${textbookLabel()}`)
        return
      }
      if (event.target.classList.contains('wb3-math-overlay') || event.target.closest('button[data-close-math-editor]')) {
        mathEditorOpen = false
        render()
        return
      }
      if (event.target.closest('[data-math-insert]')) {
        mathEditorPreview = event.target.closest('[data-math-insert]').dataset.mathInsert
        mathEditorLatex = mathEditorPreview
        const preview = $('#wb3MathPreview', root)
        if (preview) preview.textContent = mathEditorPreview
        return
      }
      const mathPreset = event.target.closest('[data-math-preset]')
      if (mathPreset) {
        mathEditorPreview = mathPreset.dataset.mathDisplay || mathPreset.dataset.mathPreset
        mathEditorLatex = mathPreset.dataset.mathPreset
        const preview = $('#wb3MathPreview', root)
        if (preview) preview.textContent = mathEditorPreview
        return
      }
      if (event.target.closest('[data-math-confirm]')) {
        const question = activeDraft?.questions.find((item) => item.id === activeRichEditorQuestionId)
        const formulaHtml = `<span class="wb3-formula" contenteditable="false" data-latex="${escapeHtml(mathEditorLatex)}">${escapeHtml(mathEditorPreview)}</span>`
        insertIntoRichEditor(formulaHtml, true)
        const el = activeRichEditorEl()
        if (question && el) {
          applySheetQuestionContentEdit(question, el.innerText.replace(/\u00a0/g, ' ').trim(), el.innerHTML)
          activeRichEditorQuestionId = question.id
        }
        mathEditorOpen = false
        persistDraft()
        render()
        showToast('公式已插入')
        return
      }
      if (event.target.classList.contains('wb3-symbol-overlay') || event.target.closest('[data-close-symbol-modal]')) {
        if (!event.target.closest('[data-symbol-char]') && !event.target.closest('[data-symbol-tab]')) {
          symbolModalOpen = false
          render()
          return
        }
      }
      const symbolTabBtn = event.target.closest('[data-symbol-tab]')
      if (symbolTabBtn) {
        symbolModalTab = symbolTabBtn.dataset.symbolTab
        render()
        return
      }
      const symbolChar = event.target.closest('[data-symbol-char]')
      if (symbolChar) {
        const question = activeDraft?.questions.find((item) => item.id === activeRichEditorQuestionId)
        insertIntoRichEditor(symbolChar.dataset.symbolChar, false)
        const el = activeRichEditorEl()
        if (question && el) {
          applySheetQuestionContentEdit(question, el.innerText.replace(/\u00a0/g, ' ').trim(), el.innerHTML)
          activeRichEditorQuestionId = question.id
        }
        symbolModalOpen = false
        persistDraft()
        render()
        return
      }

      const workspaceTab = event.target.closest('[data-workspace-tab]')
      if (workspaceTab) {
        const id = workspaceTab.dataset.workspaceTab
        if (id === 'library' || id === 'chapter') { switchToLibraryTab('official'); render(); return }
        if (id === 'personal') {
          switchToLibraryTab('personal')
          personalLibraryMode = 'questions'
          personalCollection = 'all'
          selectedPersonalQuestionIds = new Set()
          previewKnowledgePaperId = ''
          render()
          return
        }
        if (id === 'ai-create') { openWorkspaceTab('ai-create'); return }
        if (id === 'add-more') { openWorkspaceTab('ai-create'); return }
        openWorkspaceTab(id)
        return
      }

      if (event.target.closest('[data-toggle-personal-batch]')) {
        personalBatchMode = !personalBatchMode
        selectedPersonalQuestionIds = new Set()
        renderPreservingResultScroll()
        return
      }

      const deletePersonalTag = event.target.closest('[data-delete-personal-tag]')
      if (deletePersonalTag) {
        pendingPersonalTagDelete = deletePersonalTag.dataset.deletePersonalTag
        render()
        return
      }
      if (event.target.closest('[data-personal-tag-delete-confirm]')) {
        deletePersonalTagGlobally(pendingPersonalTagDelete)
        return
      }
      if (event.target.closest('[data-personal-tag-delete-cancel]') || (event.target.closest('[data-personal-tag-delete-overlay]') && !event.target.closest('.wb3-confirm-dialog'))) {
        pendingPersonalTagDelete = ''
        render()
        return
      }

      const openQuestionLabels = event.target.closest('[data-open-question-label-editor]')
      if (openQuestionLabels) {
        openQuestionLabelEditor(openQuestionLabels.dataset.openQuestionLabelEditor, openQuestionLabels.dataset.labelEditorFocus)
        return
      }

      const toggleQuestionLabelDropdown = event.target.closest('[data-toggle-question-label-dropdown]')
      if (toggleQuestionLabelDropdown && questionLabelDraft) {
        const kind = toggleQuestionLabelDropdown.dataset.toggleQuestionLabelDropdown
        questionLabelEditorFocus = kind
        questionLabelDropdownOpen = questionLabelDropdownOpen === kind ? '' : kind
        questionLabelDropdownQuery = ''
        renderPreservingResultScroll()
        if (questionLabelDropdownOpen) window.requestAnimationFrame(() => root?.querySelector(`[data-question-label-dropdown-search="${kind}"]`)?.focus())
        return
      }

      const toggleQuestionLabel = event.target.closest('[data-toggle-question-label]')
      if (toggleQuestionLabel && questionLabelDraft) {
        const kind = toggleQuestionLabel.dataset.questionLabelKind
        const value = toggleQuestionLabel.dataset.toggleQuestionLabel
        let tagFeedback = ''
        questionLabelEditorFocus = kind || questionLabelEditorFocus
        if (kind === 'difficulty') {
          questionLabelDraft.difficulty = value
          questionLabelDropdownOpen = ''
          questionLabelDropdownQuery = ''
        } else if (kind === 'curriculum') {
          const previousCurriculum = questionLabelDraft.curriculumTags[0]
          if (previousCurriculum) {
            questionLabelCurriculumSnapshots.set(previousCurriculum, {
              typeTags: [...questionLabelDraft.typeTags],
              knowledgeTags: [...questionLabelDraft.knowledgeTags],
            })
          }
          questionLabelDraft.curriculumTags = [value]
          const savedLabels = questionLabelCurriculumSnapshots.get(value)
          if (savedLabels) {
            questionLabelDraft.typeTags = [...savedLabels.typeTags]
            questionLabelDraft.knowledgeTags = [...savedLabels.knowledgeTags]
            tagFeedback = '已恢复该阶段·科目上次选择的题型和知识点'
          } else {
            const availableTypes = [...new Set(bankQuestions.filter((item) => item.curriculum === value).map((item) => item.type).filter(Boolean))]
            const compatibleTypes = questionLabelDraft.typeTags.filter((tag) => availableTypes.includes(tag))
            questionLabelDraft.typeTags = compatibleTypes.length ? compatibleTypes : availableTypes.slice(0, 1)
            questionLabelDraft.knowledgeTags = []
            tagFeedback = '已切换对应题型和知识点，请按需调整'
          }
          questionLabelDropdownOpen = ''
          questionLabelDropdownQuery = ''
        } else {
          const key = kind === 'curriculum' ? 'curriculumTags' : kind === 'type' ? 'typeTags' : kind === 'knowledge' ? 'knowledgeTags' : kind === 'custom' ? 'customTags' : ''
          if (!key) return
          const current = [...questionLabelDraft[key]]
          const selected = current.includes(value)
          if (selected && key === 'typeTags' && current.length === 1) {
            showToast('至少保留一个题型标签')
            return
          }
          questionLabelDraft[key] = selected ? current.filter((item) => item !== value) : [...current, value]
        }
        renderPreservingResultScroll()
        if (questionLabelDropdownOpen) window.requestAnimationFrame(() => {
          const input = root?.querySelector(`[data-question-label-dropdown-search="${questionLabelDropdownOpen}"]`)
          input?.focus()
          input?.setSelectionRange(questionLabelDropdownQuery.length, questionLabelDropdownQuery.length)
        })
        if (tagFeedback) showToast(tagFeedback)
        return
      }

      if (event.target.closest('[data-save-question-labels]')) {
        saveQuestionLabels()
        return
      }

      if (event.target.closest('[data-close-question-label-editor]') || event.target.matches('[data-question-label-overlay]')) {
        closeQuestionLabelEditor()
        return
      }

      const removePersonalTagButton = event.target.closest('[data-remove-personal-tag]')
      if (removePersonalTagButton) {
        removePersonalTag(removePersonalTagButton.dataset.personalQuestionId, removePersonalTagButton.dataset.removePersonalTag)
        return
      }

      const openPersonalTagButton = event.target.closest('[data-open-personal-tag]')
      if (openPersonalTagButton) {
        openPersonalTagEditor([openPersonalTagButton.dataset.openPersonalTag])
        return
      }

      if (event.target.closest('[data-open-bulk-personal-tag]')) {
        const visibleIds = new Set(filterBankQuestions().map((question) => question.id))
        openPersonalTagEditor([...selectedPersonalQuestionIds].filter((id) => visibleIds.has(id)))
        return
      }

      const addBulkValue = event.target.closest('[data-add-bulk-value]')
      if (addBulkValue) {
        const kind = addBulkValue.dataset.bulkLabelKind
        const tag = addBulkValue.dataset.addBulkValue
        const values = kind === 'knowledge' ? bulkKnowledgeValues : bulkCustomValues
        values.add(tag)
        if (kind === 'knowledge') bulkKnowledgeQuery = ''
        renderPreservingResultScroll()
        return
      }

      const removeBulkValue = event.target.closest('[data-remove-bulk-value]')
      if (removeBulkValue) {
        const values = removeBulkValue.dataset.bulkLabelKind === 'knowledge' ? bulkKnowledgeValues : bulkCustomValues
        values.delete(removeBulkValue.dataset.removeBulkValue)
        renderPreservingResultScroll()
        return
      }

      if (event.target.closest('[data-confirm-personal-tag]')) {
        applyPersonalTags()
        return
      }

      if (event.target.closest('[data-close-personal-tag]') || event.target.matches('[data-personal-tag-overlay]')) {
        closePersonalTagEditor()
        return
      }

      if (event.target.closest('[data-clear-personal-selection]')) {
        selectedPersonalQuestionIds = new Set()
        renderPreservingResultScroll()
        return
      }

      if (event.target.closest('[data-open-personal-import]')) {
        openAiRecording()
        renderPreservingResultScroll()
        window.requestAnimationFrame(() => root?.querySelector('.wb3-ai-recording-drawer [data-close-ai-recording]')?.focus())
        return
      }

      if (event.target.closest('[data-close-ai-recording]')) {
        aiRecordingDrawerOpen = false
        renderPreservingResultScroll()
        window.requestAnimationFrame(() => root?.querySelector('[data-open-personal-import]')?.focus())
        return
      }

      const viewImportedRecord = event.target.closest('[data-view-imported-record]')
      if (viewImportedRecord) {
        viewImportedQuestions(viewImportedRecord.dataset.viewImportedRecord)
        return
      }

      if (event.target.closest('[data-view-imported-questions]')) {
        viewImportedQuestions()
        return
      }

      if (event.target.closest('[data-close-import-result]')) {
        const returnScrollTop = personalImportReturnScrollTop
        personalImportRecordViewId = ''
        personalImportReturnScrollTop = 0
        render()
        window.requestAnimationFrame(() => {
          const scrollArea = root?.querySelector('.wb3-result-scroll')
          if (scrollArea) scrollArea.scrollTop = returnScrollTop
        })
        return
      }

      if (event.target.closest('[data-dismiss-import-notice]')) {
        aiImportRecords.forEach((record) => { if (record.status === 'completed') record.unread = false })
        renderPreservingResultScroll()
        return
      }

      const openSource = event.target.closest('[data-open-source]')
      if (openSource) {
        openWorkspaceTab(openSource.dataset.openSource)
        return
      }

      if (event.target.closest('[data-start-ai-entry]')) {
        adaptRequest = null
        adaptPicker = null
        openWorkspaceTab('ai-create')
        window.requestAnimationFrame(() => $('#wb3AiCreateInput', root)?.focus())
        return
      }

      const inlineAdaptPrompt = event.target.closest('[data-inline-adapt-prompt]')
      if (inlineAdaptPrompt) {
        const input = $('#wb3InlineAdaptInput', root)
        if (input) { input.value = inlineAdaptPrompt.dataset.inlineAdaptPrompt; input.focus() }
        return
      }

      const aiCreateSuggestion = event.target.closest('[data-ai-create-suggestion]')
      if (aiCreateSuggestion) {
        aiCreateInputDraft = aiCreateSuggestion.dataset.aiCreateSuggestion
        render()
        window.requestAnimationFrame(() => $('#wb3AiCreateInput', root)?.focus())
        return
      }

      if (event.target.closest('[data-ai-create-add-file]')) {
        captureAiCreateInputDraft()
        $('#wb3AiCreateFileInput', root)?.click()
        return
      }

      const removeAiCreateFile = event.target.closest('[data-remove-ai-create-file]')
      if (removeAiCreateFile) {
        aiCreateAttachments = aiCreateAttachments.filter((file) => file.id !== removeAiCreateFile.dataset.removeAiCreateFile)
        render()
        return
      }

      if (event.target.closest('[data-ai-create-voice]')) {
        captureAiCreateInputDraft()
        toggleAiCreateVoice()
        return
      }

      if (event.target.closest('[data-ai-create-send]')) {
        captureAiCreateInputDraft()
        const prompt = buildAiCreatePrompt()
        if (!prompt) { showToast('请输入组题要求，或添加附件'); return }
        resetAiCreateInput()
        generateAiDrafts(prompt, 'generate')
        return
      }

      const followupSuggestion = event.target.closest('[data-ai-followup-suggestion]')
      if (followupSuggestion) {
        const input = $('#wb3AiFollowupInput', root)
        if (input) { input.value = followupSuggestion.dataset.aiFollowupSuggestion; input.focus() }
        return
      }

      if (event.target.closest('[data-ai-followup-send]')) {
        const prompt = ($('#wb3AiFollowupInput', root)?.value || '').trim()
        if (!prompt) { showToast('请输入补题或调整要求'); return }
        generateAiDrafts(prompt, 'append')
        return
      }

      if (event.target.closest('[data-inline-adapt-submit]')) {
        const requirement = ($('#wb3InlineAdaptInput', root)?.value || '').trim()
        if (!requirement) { showToast('请输入改编要求'); return }
        if (adaptRequest?.inline) openAdaptPicker(adaptRequest.source, '', requirement)
        return
      }

      if (event.target.closest('[data-close-inline-adapt]')) {
        stopAdaptThinkingTimer()
        adaptRequest = null
        adaptPicker = null
        render()
        return
      }

      const useAdaptCandidate = event.target.closest('[data-use-adapt-candidate]')
      if (useAdaptCandidate && adaptPicker) {
        const candidate = adaptPicker.candidates.find((item) => item.id === useAdaptCandidate.dataset.useAdaptCandidate)
        if (!candidate) return
        let selectedSheetId = ''
        if (adaptPicker.targetId) {
          const target = activeDraft.questions.find((item) => item.id === adaptPicker.targetId)
          if (!target) { showToast('原题已不在题单中，请重新选择'); return }
          selectedSheetId = target.id
          Object.assign(target, { ...candidate, id: target.id, sourceId: candidate.id, status: 'confirmed' })
        } else {
          const newQuestion = cloneQuestion(candidate)
          selectedSheetId = newQuestion.id
          activeDraft.questions.push(newQuestion)
        }
        adaptPicker = null
        selectedQuestionId = ''
        persistDraft()
        render()
        window.requestAnimationFrame(() => {
          const target = $(`[data-sheet-id="${selectedSheetId}"]`, root)
          target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          target?.classList.add('wb3-question-just-added')
          window.setTimeout(() => target?.classList.remove('wb3-question-just-added'), 1200)
        })
        showToast('已选用改编题并加入右侧题单')
        return
      }

      if (event.target.matches('[data-close-adapt-picker]') || event.target.closest('button[data-close-adapt-picker]')) {
        adaptPicker = null
        render()
        return
      }

      if (event.target.closest('[data-new-draft]')) {
        const newDraftBtn = event.target.closest('[data-new-draft]')
        if (newDraftBtn?.disabled) return
        startNewDraft()
        return
      }

      if (event.target.closest('[data-save-before-new-cancel]') || (event.target.closest('[data-save-before-new-overlay]') && !event.target.closest('.wb3-confirm-dialog'))) {
        closeSaveBeforeNewDialog()
        return
      }
      if (event.target.closest('[data-save-before-new-save]')) {
        closeSaveBeforeNewDialog()
        saveDraftManually()
        return
      }

      if (event.target.closest('[data-toggle-import]')) {
        importMenuOpen = !importMenuOpen
        render()
        return
      }

      const importAction = event.target.closest('[data-import]')
      if (importAction) {
        importMenuOpen = false
        if (importAction.dataset.import === 'upload' || importAction.dataset.import === 'history') openAiRecording()
        if (importAction.dataset.import === 'knowledge') openPersonalPapersLibrary()
        if (importAction.dataset.import === 'ai-compose') importWorkspaceView = 'ai-compose'
        render()
        return
      }

      if (event.target.closest('[data-return-library]')) {
        importWorkspaceView = 'library'
        activeImportRecordId = ''
        activeAiComposeRecordId = ''
        previewKnowledgePaperId = ''
        render()
        return
      }

      const importView = event.target.closest('[data-import-view]')
      if (importView) {
        importWorkspaceView = importView.dataset.importView
        if (importWorkspaceView !== 'ai-record') activeImportRecordId = ''
        if (importWorkspaceView !== 'ai-compose-record') activeAiComposeRecordId = ''
        if (importWorkspaceView !== 'knowledge') previewKnowledgePaperId = ''
        render()
        return
      }

      if (event.target.closest('[data-start-upload]')) { $('#wb3FileInput', root)?.click(); return }

      const reparseRecord = event.target.closest('[data-reparse-record]')
      if (reparseRecord) {
        restartImportRecord(reparseRecord.dataset.reparseRecord)
        return
      }

      const openRecord = event.target.closest('[data-open-record]')
      if (openRecord) {
        openWorkspaceTab(`record:${openRecord.dataset.openRecord}`)
        return
      }

      const importRecordAll = event.target.closest('[data-import-record-all]')
      if (importRecordAll) {
        const record = aiImportRecords.find((item) => item.id === importRecordAll.dataset.importRecordAll)
        if (record?.status === 'completed') addConfirmedQuestionsFromSources(record.questions, `已从 AI录题记录加入 ${record.questions.length} 道题`)
        return
      }

      const importKnowledgeAll = event.target.closest('[data-import-knowledge-all]')
      if (importKnowledgeAll) {
        const paper = allKnowledgePapers().find((item) => item.id === importKnowledgeAll.dataset.importKnowledgeAll)
        if (paper) addConfirmedQuestionsFromSources(paper.questions, `已从「${paper.title}」选用 ${paper.questions.length} 道题`)
        return
      }

      const openComposeRecord = event.target.closest('[data-open-compose-record]')
      if (openComposeRecord) {
        const record = aiComposeRecords.find((item) => item.id === openComposeRecord.dataset.openComposeRecord)
        if (record?.status === 'completed') openAiComposeResult(record.id)
        else openWorkspaceTab(`compose:${openComposeRecord.dataset.openComposeRecord}`)
        return
      }

      const viewComposeResult = event.target.closest('[data-view-compose-result]')
      if (viewComposeResult) {
        openAiComposeResult(viewComposeResult.dataset.viewComposeResult)
        return
      }

      if (event.target.closest('[data-close-compose-result]')) {
        aiComposeResultViewId = ''
        render()
        window.requestAnimationFrame(() => {
          const scroller = root?.querySelector('.wb3-import-center-body')
          if (scroller) scroller.scrollTop = aiComposeReturnScrollTop
          aiComposeReturnScrollTop = 0
        })
        return
      }

      const composeRecordAll = event.target.closest('[data-compose-record-all]')
      if (composeRecordAll) {
        const record = aiComposeRecords.find((item) => item.id === composeRecordAll.dataset.composeRecordAll)
        if (record?.status === 'completed') {
          if (record.mode === 'append') record.autoAdded = true
          else record.allAdded = true
          addConfirmedQuestionsFromSources(record.questions, `已将 ${record.questions.length} 道题加入当前题单`)
        }
        return
      }

      if (event.target.closest('[data-download-paper-bundle]')) { openDownloadDialog(); return }
      if (event.target.closest('[data-download-dialog-cancel]') || (event.target.closest('[data-download-dialog-overlay]') && !event.target.closest('.wb3-download-dialog'))) {
        closeDownloadDialog()
        return
      }
      if (event.target.closest('[data-download-dialog-confirm]')) {
        downloadPaperWordWithAnswers()
        return
      }
      if (event.target.closest('[data-download-brief]')) { event.preventDefault(); showToast('正在下载组题说明 PDF'); return }

      const personalLibraryTab = event.target.closest('[data-personal-library]')
      if (personalLibraryTab) {
        personalImportRecordViewId = ''
        personalImportReturnScrollTop = 0
        personalLibraryMode = personalLibraryTab.dataset.personalLibrary === 'papers' ? 'papers' : 'questions'
        if (personalLibraryMode === 'papers') aiRecordingDrawerOpen = false
        previewKnowledgePaperId = ''
        render()
        return
      }

      const editKnowledge = event.target.closest('[data-edit-knowledge-paper]')
      if (editKnowledge) {
        const id = editKnowledge.dataset.editKnowledgePaper
        if (hasUnsavedCanvasChanges()) {
          pendingPaperEditId = id
          render()
        } else editKnowledgePaper(id)
        return
      }

      if (event.target.closest('[data-paper-edit-cancel]') || (event.target.closest('[data-paper-edit-overlay]') && !event.target.closest('.wb3-confirm-dialog'))) {
        pendingPaperEditId = ''
        render()
        return
      }
      if (event.target.closest('[data-paper-edit-confirm]')) {
        const id = pendingPaperEditId
        pendingPaperEditId = ''
        editKnowledgePaper(id)
        return
      }

      const deleteKnowledge = event.target.closest('[data-delete-knowledge-paper]')
      if (deleteKnowledge) {
        pendingPaperDeleteId = deleteKnowledge.dataset.deleteKnowledgePaper
        render()
        return
      }
      if (event.target.closest('[data-paper-delete-cancel]') || (event.target.closest('[data-paper-delete-overlay]') && !event.target.closest('.wb3-confirm-dialog'))) {
        pendingPaperDeleteId = ''
        render()
        return
      }
      if (event.target.closest('[data-paper-delete-confirm]')) {
        deleteKnowledgePaper(pendingPaperDeleteId)
        return
      }

      const previewKnowledge = event.target.closest('[data-preview-knowledge]')
      if (previewKnowledge) {
        const paper = allKnowledgePapers().find((item) => item.id === previewKnowledge.dataset.previewKnowledge)
        if (!paper) { showToast('未找到这份题单'); return }
        personalPaperReturnScrollTop = root?.querySelector('.wb3-result-scroll')?.scrollTop || 0
        previewKnowledgePaperId = paper.id
        render()
        return
      }

      if (event.target.closest('[data-back-knowledge]')) {
        previewKnowledgePaperId = ''
        render()
        window.requestAnimationFrame(() => {
          const scroller = root?.querySelector('.wb3-result-scroll')
          if (scroller) scroller.scrollTop = personalPaperReturnScrollTop
          personalPaperReturnScrollTop = 0
        })
        return
      }

      if (event.target.closest('[data-close-knowledge]') || (event.target.closest('[data-close-overlay]') && !event.target.closest('.wb3-modal'))) {
        knowledgeModalOpen = false
        render()
        return
      }

      const importPaper = event.target.closest('[data-import-paper]')
      if (importPaper) { importKnowledgePaper(importPaper.dataset.importPaper); return }

      const emptyImport = event.target.closest('[data-empty-import]')
      if (emptyImport) {
        if (emptyImport.dataset.emptyImport === 'library') { switchToLibraryTab('official'); render(); return }
        if (emptyImport.dataset.emptyImport === 'add-more' || emptyImport.dataset.emptyImport === 'ai-create') { openWorkspaceTab('ai-create'); return }
        if (emptyImport.dataset.emptyImport === 'upload') {
          openAiRecording()
          renderPreservingResultScroll()
          return
        }
        return
      }

      const sourceTab = event.target.closest('[data-question-source]')
      if (sourceTab) {
        switchToLibraryTab(sourceTab.dataset.questionSource)
        activeKnowledge = firstKnowledgeName()
        filterType = '全部题型'
        filterDifficulty = '全部难度'
        render()
        return
      }

      const chapterBrowse = event.target.closest('[data-chapter-browse]')
      if (chapterBrowse) {
        chapterBrowseMode = chapterBrowse.dataset.chapterBrowse === 'knowledge' ? 'knowledge' : 'chapter'
        previewBankPaperId = ''
        textbookPickerOpen = false
        if (chapterBrowseMode === 'knowledge') activeKnowledge = firstKnowledgeName()
        else expandDefaultChapters()
        officialPage = 1
        render()
        return
      }

      const previewBankPaper = event.target.closest('[data-preview-bank-paper]')
      if (previewBankPaper) {
        previewBankPaperId = previewBankPaper.dataset.previewBankPaper
        render()
        return
      }

      if (event.target.closest('[data-back-bank-paper]')) {
        previewBankPaperId = ''
        render()
        return
      }

      const importBankPaper = event.target.closest('[data-import-bank-paper]')
      if (importBankPaper) {
        const paper = bankPapers.find((item) => item.id === importBankPaper.dataset.importBankPaper)
        if (paper) addConfirmedQuestionsFromSources(paper.questions, `已从「${paper.title}」选用 ${paper.questions.length} 道题`)
        return
      }

      const toggleChapter = event.target.closest('[data-toggle-chapter]')
      if (toggleChapter) {
        const name = toggleChapter.dataset.toggleChapter
        if (expandedChapterParents.has(name)) expandedChapterParents.delete(name)
        else expandedChapterParents.add(name)
        render()
        return
      }

      const knowledge = event.target.closest('[data-knowledge]')
      if (knowledge) {
        activeKnowledge = knowledge.dataset.knowledge
        if (chapterBrowseMode === 'chapter' && activeTree().parents[activeKnowledge]) expandedChapterParents.add(activeKnowledge)
        officialPage = 1
        render()
        return
      }

      const officialPageButton = event.target.closest('[data-official-page]')
      if (officialPageButton && !officialPageButton.disabled) {
        officialPage = Math.max(1, Math.min(OFFICIAL_MAX_PAGES, Number(officialPageButton.dataset.officialPage)))
        render()
        root.querySelector('.wb3-result-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (event.target.closest('[data-official-unlock]')) { officialUnlockPromptOpen = true; render(); return }
      if (event.target.closest('[data-official-unlock-confirm]')) { officialMoreUnlocked = true; officialUnlockPromptOpen = false; officialPage = 2; render(); return }
      if (event.target.closest('[data-official-unlock-cancel]')) { officialUnlockPromptOpen = false; render(); return }
      if (event.target.matches('[data-official-unlock-overlay]')) { officialUnlockPromptOpen = false; render(); return }

      if (event.target.closest('[data-clear-bank-filters]')) {
        treeSearchQuery = ''
        filterType = '全部题型'
        filterDifficulty = '全部难度'
        personalCurriculumFilter = 'all'
        personalKnowledgeFilter = 'all'
        personalCollection = 'all'
        activeKnowledge = chapterBrowseMode === 'chapter' && questionSource === 'official'
          ? (Object.keys(currentChapterTree().parents)[0] || firstKnowledgeName())
          : firstKnowledgeName()
        officialPage = 1
        saveBankSearchToStorage()
        render()
        return
      }

      const quickAdd = event.target.closest('[data-quick-add]')
      if (quickAdd) { toggleQuestionFromBank(quickAdd.dataset.quickAdd); return }

      const deletePersonal = event.target.closest('[data-delete-personal-question]')
      if (deletePersonal) {
        personalDeletePromptId = deletePersonal.dataset.deletePersonalQuestion
        render()
        return
      }

      if (event.target.closest('[data-personal-delete-confirm]')) {
        if (personalDeletePromptId) removePersonalQuestion(personalDeletePromptId)
        return
      }
      if (event.target.closest('[data-personal-delete-cancel]')) {
        personalDeletePromptId = ''
        render()
        return
      }
      if (event.target.matches('[data-personal-delete-overlay]')) {
        personalDeletePromptId = ''
        render()
        return
      }

      const quickAnswer = event.target.closest('[data-quick-answer]')
      if (quickAnswer) {
        const id = quickAnswer.dataset.quickAnswer
        if (revealedAnswerIds.has(id)) revealedAnswerIds.delete(id)
        else revealedAnswerIds.add(id)
        render()
        return
      }

      const quickAdapt = event.target.closest('[data-quick-adapt]')
      if (quickAdapt) {
        const source = findQuestionById(quickAdapt.dataset.quickAdapt)
        if (source) {
          adaptPicker = null
          adaptRequest = { source: { ...source }, targetId: '', inline: true }
          render()
          window.requestAnimationFrame(() => $('#wb3InlineAdaptInput', root)?.focus())
        }
        return
      }

      const sheetAnswer = event.target.closest('[data-sheet-answer]')
      if (sheetAnswer) {
        const id = sheetAnswer.dataset.sheetAnswer
        if (revealedAnswerIds.has(id)) revealedAnswerIds.delete(id)
        else revealedAnswerIds.add(id)
        render()
        return
      }

      const answerLineAdd = event.target.closest('[data-answer-line-add]')
      if (answerLineAdd) {
        const question = activeDraft.questions.find((item) => item.id === answerLineAdd.dataset.answerLineAdd)
        if (question) {
          question.answerLines = Math.min(12, Number(question.answerLines || 0) + 1)
          question.answerStyle ||= 'blank'
          answerEditorQuestionId = question.id
        }
        persistDraft()
        render()
        return
      }

      const answerEditor = event.target.closest('[data-answer-editor]')
      if (answerEditor) {
        answerEditorQuestionId = answerEditorQuestionId === answerEditor.dataset.answerEditor ? '' : answerEditor.dataset.answerEditor
        render()
        return
      }

      const answerStyleSet = event.target.closest('[data-answer-style-set]')
      if (answerStyleSet) {
        const question = activeDraft.questions.find((item) => item.id === answerStyleSet.dataset.question)
        if (question) {
          question.answerLines = Number(question.answerLines || 0) || 2
          question.answerStyle = answerStyleSet.dataset.answerStyleSet === 'lined' ? 'lined' : 'blank'
          answerEditorQuestionId = question.id
        }
        persistDraft()
        render()
        return
      }

      const answerSpaceClear = event.target.closest('[data-answer-space-clear]')
      if (answerSpaceClear) {
        const question = activeDraft.questions.find((item) => item.id === answerSpaceClear.dataset.answerSpaceClear)
        if (question) question.answerLines = 0
        persistDraft()
        render()
        return
      }

      const answerLineRemove = event.target.closest('[data-answer-line-remove]')
      if (answerLineRemove) {
        const question = activeDraft.questions.find((item) => item.id === answerLineRemove.dataset.answerLineRemove)
        if (question) {
          question.answerLines = Math.max(0, Number(question.answerLines || 0) - 1)
          answerEditorQuestionId = question.id
        }
        persistDraft()
        render()
        return
      }

      const adaptResultReplace = event.target.closest('[data-adapt-result-replace]')
      if (adaptResultReplace) {
        const record = aiComposeRecords.find((item) => item.id === adaptResultReplace.dataset.composeId)
        const candidate = record?.questions.find((item) => item.id === adaptResultReplace.dataset.adaptResultReplace)
        const target = activeDraft.questions.find((item) => item.id === record?.originalQuestionId)
        if (candidate && target) {
          Object.assign(target, { ...candidate, id: target.id, sourceId: candidate.id, status: 'confirmed' })
          persistDraft()
          render()
          showToast('已用改编题替换原题')
        } else showToast('原题已不在当前题单，可选择另加为新题')
        return
      }

      const deleteQ = event.target.closest('[data-delete-question]')
      if (deleteQ) {
        activeDraft.questions = activeDraft.questions.filter((q) => q.id !== deleteQ.dataset.deleteQuestion)
        if (selectedQuestionId === deleteQ.dataset.deleteQuestion) selectedQuestionId = ''
        persistDraft()
        showToast('已删除题目')
        render()
        return
      }

      const adaptAccept = event.target.closest('[data-adapt-accept]')
      if (adaptAccept) { acceptAdapt(adaptAccept.dataset.adaptAccept); return }
      const adaptAsNew = event.target.closest('[data-adapt-as-new]')
      if (adaptAsNew) { acceptAdaptAsNew(adaptAsNew.dataset.adaptAsNew); return }
      const adaptReject = event.target.closest('[data-adapt-reject]')
      if (adaptReject) { rejectAdapt(adaptReject.dataset.adaptReject); return }

      if (event.target.closest('[data-ai-send]')) {
        const prompt = ($('#wb3AiInput', root)?.value || '').trim()
        if (!prompt) { showToast('请输入 AI 要求'); return }
        if (adaptRequest) {
          openAdaptPicker(adaptRequest.source, adaptRequest.targetId, prompt)
          return
        }
        generateAiDrafts(prompt, aiModeFromPrompt(prompt))
        const input = $('#wb3AiInput', root)
        if (input) input.value = ''
        return
      }

      const aiSuggestion = event.target.closest('[data-ai-suggestion]')
      if (aiSuggestion) {
        const input = $('#wb3AiInput', root)
        if (input) { input.value = aiSuggestion.dataset.aiSuggestion; input.focus() }
        return
      }

      if (event.target.closest('[data-clear-context]')) { adaptRequest = null; render(); return }

      if (!event.target.closest('.wb3-import-wrap')) importMenuOpen = false

      const action = event.target.closest('[data-action]')?.dataset.action
      if (action === 'exit') {
        if (standalone) { window.location.href = './index.html'; return }
        api.close()
        window.dispatchEvent(new CustomEvent('fx-question-workbench-v3-exit'))
        return
      }
      if (action === 'save') {
        saveDraftManually()
        return
      }
      if (action === 'download') {
        const adaptPending = activeDraft.questions.some((q) => q.status === 'adapt')
        if (adaptPending) showToast('请先处理画布中的 AI 改编待确认项后再下载')
        else openDownloadDialog()
        return
      }

    })

    root.addEventListener('input', (event) => {
      if (event.target.id === 'wb3BulkKnowledgeSearch') {
        bulkKnowledgeQuery = event.target.value
        const caret = bulkKnowledgeQuery.length
        renderPreservingResultScroll()
        window.requestAnimationFrame(() => {
          const input = $('#wb3BulkKnowledgeSearch', root)
          input?.focus()
          input?.setSelectionRange(caret, caret)
        })
        return
      }
      if (event.target.matches('[data-question-label-dropdown-search]')) {
        questionLabelDropdownOpen = event.target.dataset.questionLabelDropdownSearch
        questionLabelDropdownQuery = event.target.value
        const caret = questionLabelDropdownQuery.length
        renderPreservingResultScroll()
        window.requestAnimationFrame(() => {
          const input = root?.querySelector(`[data-question-label-dropdown-search="${questionLabelDropdownOpen}"]`)
          input?.focus()
          input?.setSelectionRange(caret, caret)
        })
        return
      }
      if (event.target.id === 'wb3PersonalPaperSearch') {
        personalPaperSearchQuery = event.target.value
        const caret = personalPaperSearchQuery.length
        render()
        window.requestAnimationFrame(() => {
          const input = $('#wb3PersonalPaperSearch', root)
          input?.focus()
          input?.setSelectionRange(caret, caret)
        })
        return
      }
      if (event.target.id === 'wb3TreeSearch') {
        treeSearchQuery = event.target.value
        if (questionSource === 'personal' && personalBatchMode) selectedPersonalQuestionIds = new Set()
        saveBankSearchToStorage()
        officialPage = 1
        const caret = treeSearchQuery.length
        render()
        window.requestAnimationFrame(() => {
          const input = $('#wb3TreeSearch', root)
          input?.focus()
          input?.setSelectionRange(caret, caret)
        })
        return
      }
      if (event.target.id === 'wb3FilterType') {
        filterType = event.target.value
        if (questionSource === 'personal' && personalBatchMode) selectedPersonalQuestionIds = new Set()
        officialPage = 1
        render()
        return
      }
      if (event.target.id === 'wb3FilterDifficulty') {
        filterDifficulty = event.target.value
        if (questionSource === 'personal' && personalBatchMode) selectedPersonalQuestionIds = new Set()
        officialPage = 1
        render()
        return
      }
      if (event.target.id === 'wb3PersonalCurriculumFilter') {
        personalCurriculumFilter = event.target.value
        personalKnowledgeFilter = 'all'
        selectedPersonalQuestionIds = new Set()
        render()
        return
      }
      if (event.target.id === 'wb3PersonalKnowledgeFilter') {
        personalKnowledgeFilter = event.target.value
        selectedPersonalQuestionIds = new Set()
        render()
        return
      }
      if (event.target.id === 'wb3PersonalTagFilter') {
        personalCollection = event.target.value ? `tag:${event.target.value}` : 'all'
        selectedPersonalQuestionIds = new Set()
        render()
        return
      }
      if (event.target.id === 'wb3DraftTitle' || event.target.id === 'wb3PaperTitle') {
        activeDraft.title = event.target.value
        persistDraft()
      }
      if (event.target.matches('[data-paper-format]')) {
        const key = event.target.dataset.paperFormat
        const raw = event.target.value
        paperFormat()[key] = Number(raw)
        persistDraft()
        render()
      }
    })

    root.addEventListener('keydown', (event) => {
      if (event.target.id === 'wb3NewPersonalTag' && event.key === 'Enter') {
        event.preventDefault()
        createBulkCustomTag()
      }
      if (event.target.id === 'wb3NewQuestionCustomTag' && event.key === 'Enter') {
        event.preventDefault()
        createQuestionCustomTag()
      }
      if (event.key === 'Escape' && questionLabelEditorId) {
        event.preventDefault()
        closeQuestionLabelEditor()
        return
      }
      if (event.key === 'Escape' && personalTagEditorQuestionIds.length) {
        event.preventDefault()
        closePersonalTagEditor()
        return
      }
      if (event.key === 'Escape' && aiRecordingDrawerOpen) {
        event.preventDefault()
        aiRecordingDrawerOpen = false
        renderPreservingResultScroll()
      }
    })

    root.addEventListener('mousedown', (event) => {
      if (event.target.closest('.wb3-paper-toolbar button')) event.preventDefault()
    })

    root.addEventListener('pointerout', (event) => {
      const questionCard = event.target.closest('.wb3-sheet-q.answer-editor-open')
      if (!questionCard || questionCard.contains(event.relatedTarget)) return
      answerEditorQuestionId = ''
      render()
    })

    root.addEventListener('focusin', (event) => {
      const field = sheetEditableField(event.target)
      if (!field) return
      activeRichEditorQuestionId = event.target.closest('[data-sheet-id]')?.dataset.sheetId || ''
      activeRichEditorField = field
      refreshRichFloatVisibility(event)
    })

    root.addEventListener('focusout', (event) => {
      if (event.target.id === 'wb3PaperTitle') {
        activeDraft.title = event.target.value
        persistDraft()
        render()
        return
      }
      const field = sheetEditableField(event.target)
      if (!field) return
      const related = event.relatedTarget
      if (related?.closest?.('.wb3-rich-float, .wb3-math-modal, .wb3-symbol-modal, .wb3-rich-editable')) return
      const sheetId = event.target.closest('[data-sheet-id]')?.dataset.sheetId
      const question = activeDraft?.questions.find((item) => item.id === sheetId)
      if (!question || question.status !== 'confirmed') return
      const result = syncSheetEditableFromDom(question, field, event.target)
      if (result === 'empty-stem') {
        hideRichFloat()
        removeSheetQuestionById(sheetId)
        return
      }
      if (result === 'changed' || result === 'format') {
        if (result === 'changed') activeRichEditorQuestionId = question.id
        persistDraft()
      }
      hideRichFloat()
      render()
    })

    root.addEventListener('change', (event) => {
      if (event.target.matches('[data-bulk-label-scope]')) {
        if (event.target.dataset.bulkLabelScope === 'knowledge') bulkSetKnowledgeEnabled = event.target.checked
        else bulkSetCustomEnabled = event.target.checked
        renderPreservingResultScroll()
        return
      }
      if (event.target.matches('[data-select-personal-question]')) {
        const id = event.target.dataset.selectPersonalQuestion
        if (event.target.checked) selectedPersonalQuestionIds.add(id)
        else selectedPersonalQuestionIds.delete(id)
        renderPreservingResultScroll()
        return
      }
      if (event.target.classList.contains('wb3-subject-switch')) {
        saveBankSearchToStorage()
        curriculumKey = event.target.value
        activeDraft.subject = currentCurriculum().subject
        activeDraft.curriculumKey = curriculumKey
        saveTeacherContextToStorage()
        textbookPickerOpen = false
        if (chapterBrowseMode === 'chapter' && questionSource === 'official') expandDefaultChapters()
        else activeKnowledge = firstKnowledgeName()
        previewBankPaperId = ''
        applyBankSearchFromStorage()
        filterType = '全部题型'
        filterDifficulty = '全部难度'
        officialPage = 1
        persistDraft()
        render()
        showToast(`已切换到${event.target.value}`)
        return
      }
      if (event.target.id === 'wb3FileInput') {
        handleUploadFiles(event.target.files)
        event.target.value = ''
      }
      if (event.target.id === 'wb3AiCreateFileInput') {
        captureAiCreateInputDraft()
        ;[...(event.target.files || [])].forEach((file) => {
          aiCreateAttachments.push({ id: makeId('aif'), name: file.name })
        })
        event.target.value = ''
        render()
      }
    })

    root.addEventListener('input', (event) => {
      if (event.target.id === 'wb3AiCreateInput') aiCreateInputDraft = event.target.value
    })

    root.addEventListener('mousedown', (event) => {
      const handle = event.target.closest('[data-sheet-drag-handle]')
      if (!handle) return
      const article = handle.closest('.wb3-sheet-q')
      if (article) article.draggable = true
    })

    root.addEventListener('dragstart', (event) => {
      const article = event.target.closest('.wb3-sheet-q')
      if (!article?.draggable) {
        event.preventDefault()
        return
      }
      sheetDragId = article.dataset.sheetId || ''
      if (!sheetDragId) {
        event.preventDefault()
        return
      }
      if (answerEditorQuestionId) answerEditorQuestionId = ''
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', sheetDragId)
      window.requestAnimationFrame(() => article.classList.add('wb3-sheet-q-dragging'))
    })

    root.addEventListener('dragend', (event) => {
      const article = event.target.closest('.wb3-sheet-q')
      if (article) article.draggable = false
      $$('.wb3-sheet-q', root).forEach((el) => el.classList.remove('wb3-sheet-q-dragging', 'wb3-sheet-q-drop-before', 'wb3-sheet-q-drop-after'))
      sheetDragId = ''
    })

    root.addEventListener('dragover', (event) => {
      const recordingDropzone = event.target.closest('.wb3-ai-recording-dropzone')
      if (recordingDropzone && aiRecordingDrawerOpen) {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
        recordingDropzone.classList.add('is-dragging')
        return
      }
      if (!sheetDragId) return
      const article = event.target.closest('.wb3-sheet-q')
      if (!article || article.dataset.sheetId === sheetDragId) return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      const before = event.clientY < article.getBoundingClientRect().top + article.offsetHeight / 2
      $$('.wb3-sheet-q', root).forEach((el) => el.classList.remove('wb3-sheet-q-drop-before', 'wb3-sheet-q-drop-after'))
      article.classList.add(before ? 'wb3-sheet-q-drop-before' : 'wb3-sheet-q-drop-after')
    })

    root.addEventListener('dragleave', (event) => {
      const recordingDropzone = event.target.closest('.wb3-ai-recording-dropzone')
      if (recordingDropzone) {
        const related = event.relatedTarget
        if (!related || !recordingDropzone.contains(related)) recordingDropzone.classList.remove('is-dragging')
        return
      }
      const article = event.target.closest('.wb3-sheet-q')
      if (!article) return
      const related = event.relatedTarget
      if (related && article.contains(related)) return
      article.classList.remove('wb3-sheet-q-drop-before', 'wb3-sheet-q-drop-after')
    })

    root.addEventListener('drop', (event) => {
      const recordingDropzone = event.target.closest('.wb3-ai-recording-dropzone')
      if (recordingDropzone && aiRecordingDrawerOpen) {
        event.preventDefault()
        recordingDropzone.classList.remove('is-dragging')
        handleUploadFiles(event.dataTransfer?.files)
        return
      }
      if (!sheetDragId) return
      const article = event.target.closest('.wb3-sheet-q')
      if (!article) return
      event.preventDefault()
      const targetId = article.dataset.sheetId
      const before = event.clientY < article.getBoundingClientRect().top + article.offsetHeight / 2
      reorderSheetQuestions(sheetDragId, targetId, before)
      sheetDragId = ''
      render()
    })

    document.addEventListener('click', (event) => {
      if (!root || root.hidden || !importMenuOpen) return
      if (!event.target.closest('.wb3-import-wrap')) {
        importMenuOpen = false
        render()
      }
    })
  }

  let standalone = false

  function restoreAiConversationHandoff() {
    const params = new URLSearchParams(window.location.search)
    const draftId = params.get('draft') || ''
    if (params.get('source') !== 'ai-compose' || !draftId || activeDraft?.id !== draftId) return false
    let handoff = null
    try {
      handoff = JSON.parse(sessionStorage.getItem(`feixiang-question-workbench-v3-ai-handoff:${draftId}`) || 'null')
    } catch { handoff = null }
    const composeId = `compose-handoff-${draftId}`
    let record = aiComposeRecords.find((item) => item.id === composeId)
    if (!record) {
      record = {
        id: composeId,
        conversationId: composeId,
        turnIndex: 1,
        title: handoff?.title || activeDraft.title || 'AI组题',
        prompt: handoff?.prompt || `继续编辑「${activeDraft.title || '这份题单'}」`,
        mode: 'generate',
        status: 'completed',
        createdAt: handoff?.createdAt || '刚刚',
        plan: handoff?.plan || {
          count: activeDraft.questions.length,
          types: '选择、填空、解答',
          difficulty: '基础为主，难度递进',
          knowledge: '当前题单知识点',
          minutes: Math.max(5, Math.round(activeDraft.questions.length * 1.8)),
        },
        questions: activeDraft.questions.filter((item) => item.status === 'confirmed').map((question) => ({
          ...question,
          id: question.sourceId || `handoff-${question.id}`,
          originId: question.id,
          source: 'ai-compose',
        })),
      }
      aiComposeRecords.unshift(record)
    }
    activeAiComposeRecordId = composeId
    importWorkspaceView = 'ai-compose-record'
    return true
  }

  const api = {
    prepareKnowledgeEditSwitch,
    open(options = {}) {
      ensureRoot()
      standalone = Boolean(options.standalone)
      questionSource = 'official'
      curriculumKey = '小学数学'
      applyTeacherContextFromStorage()
      syncNewDraftNavigationStateFromSession()
      const restoredDraft = options.newDraft ? null : loadActiveDraft()
      if (!localStorage.getItem(TEACHER_CONTEXT_KEY) && restoredDraft?.curriculumKey && curriculumCatalog[restoredDraft.curriculumKey]) {
        curriculumKey = restoredDraft.curriculumKey
      }
      activeDraft = restoredDraft || createBlankDraft()
      if (activeDraft) {
        activeDraft.curriculumKey = curriculumKey
        activeDraft.subject = currentCurriculum().subject
      }
      if (activeDraft && !activeDraft.savedAt) activeDraft.savedAt = 0
      activeKnowledge = '全部知识点'
      applyBankSearchFromStorage()
      filterType = '全部题型'
      filterDifficulty = '全部难度'
      selectedQuestionId = ''
      revealedAnswerIds = new Set()
      uploadParsing = false
      aiGenerating = false
      importMenuOpen = false
      knowledgeModalOpen = false
      importWorkspaceView = 'library'
      chapterBrowseMode = 'chapter'
      textbookPickerOpen = false
      expandDefaultChapters()
      previewBankPaperId = ''
      activeImportRecordId = ''
      activeAiComposeRecordId = ''
      aiComposeResultViewId = ''
      aiComposeReturnScrollTop = 0
      previewKnowledgePaperId = ''
      personalPaperReturnScrollTop = 0
      selectedPersonalQuestionIds = new Set()
      personalBatchMode = false
      aiRecordingDrawerOpen = false
      personalImportRecordViewId = ''
      personalImportReturnScrollTop = 0
      personalTagEditorQuestionIds = []
      pendingPersonalTagDelete = ''
      resetBulkLabelEditorState()
      questionLabelEditorId = ''
      questionLabelEditorFocus = 'curriculum'
      questionLabelDraft = null
      adaptRequest = null
      adaptPicker = null
      restoreAiConversationHandoff()
      const requestedPaperId = sessionStorage.getItem('feixiang-question-workbench-open-paper')
      if (requestedPaperId && savedDraftPapers().some((paper) => paper.draftId === requestedPaperId)) {
        sessionStorage.removeItem('feixiang-question-workbench-open-paper')
        openPersonalPapersLibrary(`saved-${requestedPaperId}`)
      }
      document.body.classList.add('fx-question-workbench-v3-open')
      root.hidden = false
      render()
    },
    close() {
      if (!root) return
      root.hidden = true
      importMenuOpen = false
      knowledgeModalOpen = false
      importWorkspaceView = 'library'
      activeAiComposeRecordId = ''
      aiComposeResultViewId = ''
      aiComposeReturnScrollTop = 0
      selectedPersonalQuestionIds = new Set()
      personalBatchMode = false
      aiRecordingDrawerOpen = false
      personalImportRecordViewId = ''
      personalImportReturnScrollTop = 0
      personalPaperReturnScrollTop = 0
      personalTagEditorQuestionIds = []
      pendingPersonalTagDelete = ''
      resetBulkLabelEditorState()
      questionLabelEditorId = ''
      questionLabelEditorFocus = 'curriculum'
      questionLabelDraft = null
      adaptRequest = null
      adaptPicker = null
      document.body.classList.remove('fx-question-workbench-v3-open')
    },
    isOpen() {
      return Boolean(root && !root.hidden)
    },
  }

  window.FxQuestionWorkbenchV3 = api
})()
