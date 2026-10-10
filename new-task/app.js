(() => {
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]

  const prompt = '我是五年级二班班主任，周五要召开期中家长会。请做一个36人班级的真实学情数据，并基于同一组数据生成四份精美材料：教师内部使用的Excel学情数据表、Word学情分析与改进计划、家长会现场使用的PPT，以及会后发给家长的PDF家校共育指南。'
  const questionPrompt1 = '帮我为七年级上册数学“有理数”组一份12题、15分钟的随堂练习，基础为主，加入2道易错题。请先给出候选题，我确认后再完成组题和导出。'
  const questionPrompt2 = '打开AI组题命题工作台'
  const stages = [
    ['读取附件', '识别 36 名模拟学生、三科成绩、作业完成率和课堂表现'],
    ['校验同源数据', '检查人数、字段完整性和模拟数据标记'],
    ['计算统计指标', '计算三科均分、达标率和学生分层'],
    ['生成图表与分析', '整理成绩分布、学科差异和两周改进建议'],
    ['编排办公材料', '分别生成 Excel、Word、PPT 和 PDF'],
    ['完成质量检查', '核对四份材料中的人数、结论和行动建议一致']
  ]
  const files = {
    excel: { id:'excel', name:'五年级二班-期中学情分析.xlsx', label:'Excel 学情数据表', mark:'X', className:'excel', url:'./assets/files/analysis.xlsx', pages:6, preview:'excel' },
    word: { id:'word', name:'五年级二班-期中学情分析与改进计划.docx', label:'Word 分析与改进计划', mark:'W', className:'word', url:'./assets/files/improvement-plan.docx', pages:3, preview:'word' },
    ppt: { id:'ppt', name:'五年级二班-期中家长会.pptx', label:'PPT 家长会现场材料', mark:'P', className:'ppt', url:'./assets/files/parent-meeting.pptx', pages:10, preview:'ppt' },
    pdf: { id:'pdf', name:'五年级二班-期中家校共育指南.pdf', label:'PDF 家校共育指南', mark:'D', className:'pdf', url:'./assets/files/family-guide.pdf', pages:3, preview:'pdf' },
    qpaper: { id:'qpaper', name:'七年级上册有理数随堂练习-学生版.docx', label:'学生试卷 · Word', mark:'W', className:'word', url:'./assets/files/question-composition/student.docx', pages:1, preview:'question-paper' },
    qanswers: { id:'qanswers', name:'七年级上册有理数随堂练习-答案解析.docx', label:'教师答案与解析 · Word', mark:'W', className:'word', url:'./assets/files/question-composition/answers.docx', pages:1, preview:'question-answers' },
    qspec: { id:'qspec', name:'七年级上册有理数随堂练习-命题说明书.pdf', label:'命题依据与质量验收 · PDF', mark:'D', className:'pdf', url:'./assets/files/question-composition/spec.pdf', pages:1, preview:'question-spec' },
    gradeReport: { id:'gradeReport', name:'六年级2班-分数除法批改与讲评报告.pdf', label:'AI智批结果 · PDF', mark:'D', className:'pdf', url:'./assets/files/ai-learning/grading-report.pdf', pages:1, preview:'learning-grading' },
    diagnosisReport: { id:'diagnosisReport', name:'六年级2班-分数乘除法阶段错因诊断报告.pdf', label:'AI错因诊断 · PDF', mark:'D', className:'pdf', url:'./assets/files/ai-learning/diagnosis-report.pdf', pages:1, preview:'learning-diagnosis' },
    practiceReport: { id:'practiceReport', name:'六年级2班-分数乘除法个性化练习包.pdf', label:'AI个性化练习 · PDF', mark:'D', className:'pdf', url:'./assets/files/ai-learning/practice-report.pdf', pages:1, preview:'learning-practice' },
    questionWorkbench: { id:'questionWorkbench', name:'AI题库工作台', label:'外部交互 Demo', mark:'A', className:'word', url:'https://liweimian.github.io/feixiang-ai-question-workbench/', pages:1, preview:'external-question-workbench' },
    courseware: { id:'courseware', name:'长方体和正方体的认识｜五年级下册.html', label:'互动课件 · HTML', mark:'H', className:'ppt', url:'#', pages:16, preview:'practice-courseware' },
    practiceSheet: { id:'practiceSheet', name:'长方体和正方体的认识 · 课后练一练', label:'题单 · 可编辑', mark:'练', className:'word', url:'#', pages:1, preview:'practice-sheet' },
    practiceDash: { id:'practiceDash', name:'课后练一练 · 教师看板', label:'数据回收 · 实时', mark:'板', className:'excel', url:'#', pages:1, preview:'practice-dashboard' }
  }
  const teachingSkills = [
    { name:'组题', description:'100万+题目资源，题库与原创题专业组卷', cover:'question', category:'组题与练习' },
    { name:'AI智批', description:'任意作业智能批改，原卷留痕并汇总结果', cover:'grading', category:'批改与学情' },
    { name:'AI错因诊断', description:'班级、小组、个人三级诊断，精准定位错因', cover:'diagnosis', category:'批改与学情' },
    { name:'AI个性化练习', description:'基于学情生成分层练习，强化薄弱知识点', cover:'practice', category:'组题与练习' },
    { name:'教学设计', description:'目标、活动、评价3环贯通，生成完整教学方案', cover:'lesson', category:'备课与课件' },
    { name:'互动课件', description:'支持PPT与HTML双形态，生成可讲、可练、可互动课件', cover:'courseware', category:'备课与课件' },
    { name:'家长会材料', description:'一次生成数据表、报告、PPT和家校指南4类材料', cover:'meeting', category:'教学办公' },
    { name:'教学资料整理', description:'整合教材、教案、课件、试卷和成绩等5类资料', cover:'organize', category:'教学办公' }
  ]
  const teachingSkillDetails = {
    '组题':{
      eyebrow:'组题与练习',
      title:'AI组题',
      description:'用自然语言说出年级、学科、考点、题量和难度，AI 按「专家级命题6步法」模拟命题专家思路，把关试卷结构、考点覆盖、难度梯度和内容质量，几分钟生成一套高质量试卷。',
      points:['真题智选：依托100万+专业题库，从真实试卷中甄选优质题目','命题专家思路：按专家级命题6步法组卷，把关结构、难度与质量','一键成卷：几分钟组完，支持导出 Word、答案解析和命题说明书'],
      exampleTitle:'七年级数学 · 分数的运算练习题',
      exampleMeta:'12题 · 60分钟 · 学生版试卷',
      image:'./assets/home-covers/question.png'
    },
    'AI智批':{
      eyebrow:'批改与学情',
      title:'AI智批',
      description:'识别学生手写作答与解题步骤，自动完成客观判定、过程评分和批改标记，并将存疑内容交给教师确认。',
      points:['保留原作业版式与学生手写痕迹','标记错题、扣分点和教师评语','汇总班级正确率与共性问题'],
      exampleTitle:'三年级数学作业 · 批改示例',
      exampleMeta:'红笔批注 · 步骤扣分 · 总评反馈',
      image:'./assets/home-covers/grading.png'
    },
    'AI错因诊断':{
      eyebrow:'批改与学情', title:'AI错因诊断',
      description:'汇总作业与考试数据，从班级、小组和个人三个层级定位错误表现、知识漏洞与形成原因。',
      points:['自动聚类知识理解、计算方法与审题习惯问题','标记共性错因与重点关注学生','生成教学干预优先级和阶段诊断报告'],
      exampleTitle:'六年级数学 · 阶段错因诊断', exampleMeta:'3次作业 · 46名学生 · 三级诊断', image:'./assets/home-covers/diagnosis.png'
    },
    'AI个性化练习':{
      eyebrow:'组题与练习', title:'AI个性化练习',
      description:'基于学生错因与掌握水平，生成基础巩固、进阶提升和挑战拓展三层练习。',
      points:['每位学生匹配首要错因与练习目标','自动组合基础题、变式题和迁移题','支持班级分组预览及练习包导出'],
      exampleTitle:'分数乘除法 · 个性化练习包', exampleMeta:'12名重点学生 · 3层练习 · 含答案', image:'./assets/home-covers/practice.png'
    },
    '教学设计':{
      eyebrow:'备课与课件', title:'教学设计',
      description:'结合教材版本、课程标准和班级学情，贯通教学目标、课堂活动与评价任务。',
      points:['提炼单元目标、重点难点与学情起点','生成完整教学流程和师生活动','同步设计课堂评价与课后作业'],
      exampleTitle:'分数除法 · 单元教学设计', exampleMeta:'目标—活动—评价一致性 · 完整教案', image:'./assets/home-covers/lesson.png'
    },
    '互动课件':{
      eyebrow:'备课与课件', title:'互动课件',
      description:'把教材知识转化为可讲解、可练习、可互动的课堂课件，支持PPT与HTML双形态。',
      points:['生成情境导入、探究过程与课堂练习','支持动画、问答和数据回收等互动','产出适合课堂投屏的完整课件'],
      exampleTitle:'圆锥体积公式推导 · 互动课件', exampleMeta:'HTML互动 · 课堂探究 · 即时练习', image:'./assets/home-covers/courseware.png'
    },
    '家长会材料':{
      eyebrow:'教学办公', title:'家长会材料',
      description:'基于同一组真实学情数据，一次生成教师分析、家长会演示和会后沟通材料。',
      points:['自动完成成绩统计、学生分层与问题诊断','生成Excel、Word、PPT和PDF四类成果','保证不同材料的数据与结论一致'],
      exampleTitle:'五年级二班 · 期中家长会办公包', exampleMeta:'36名学生 · 4份材料 · 同源数据', image:'./assets/home-covers/meeting.png'
    },
    '教学资料整理':{
      eyebrow:'教学办公', title:'教学资料整理',
      description:'将教材、教案、课件、试卷和成绩等资料统一归档，提炼为可检索、可复用的教学知识。',
      points:['按章节、知识点、课时或资料类型分类','提炼重点难点与可复用素材','生成资料目录、知识清单和备课摘要'],
      exampleTitle:'单元教学资料 · 结构化知识清单', exampleMeta:'5类资料 · 自动归类 · 可检索索引', image:'./assets/home-covers/organize.png'
    }
  }
  const plazaContent = {
    resource:[
      {title:'飞象老师“教育应用”新手指南',meta:'教育应用 · 新手入门',image:'./assets/plaza/guide.png',url:'https://www.feixianglaoshi.com/#/chat?share=1&communityContentId=132A5734140295228AE7113E0154D654&featureId=20&si=undefined&suid=1116359499'},
      {title:'飞象老师AI工作坊直播预约与作品提交',meta:'AI工作坊 · 教师成长',image:'./assets/plaza/workshop.jpg',url:'https://www.feixianglaoshi.com/#/chat?share=1&communityContentId=4119F4AD6219916A036EC6EE4C40720F&featureId=20&si=undefined&suid=618170147'},
      {title:'【玩转互动课件】必看小技巧',meta:'互动课件 · 实用技巧',image:'./assets/plaza/courseware-tips.png',url:'https://www.feixianglaoshi.com/#/chat?share=1&communityContentId=2EF18529160DEC32C73EAB85073138E9&featureId=20&si=undefined&suid=261485376'},
      {title:'【数据回收】新手指引',meta:'数据回收 · 教学反馈',image:'./assets/plaza/data-guide.png',url:'https://www.feixianglaoshi.com/#/chat?share=1&communityContentId=2CC023EE35FDDCB1D282EAB677C74BFB&featureId=20&si=undefined&suid=261485376'}
    ],
    app:[
      {title:'AI组题命题工作台',meta:'选题 · 组卷 · 导出',image:'./assets/home-covers/question.png',url:'https://liweimian.github.io/feixiang-ai-question-workbench/'},
      {title:'飞象老师作业能力 Demo',meta:'智批 · 诊断 · 个性化练习',image:'./assets/home-covers/grading.png',url:'https://djl430.github.io/fx-homepage-1/'},
      {title:'飞象老师资源社区',meta:'优质资源 · 教师共创',image:'./assets/home-covers/courseware.png',url:'https://djxky.github.io/fx-community/'}
    ]
  }
  const fixedPracticeCases = [
    { title:'期中家长会办公包', image:'./assets/home-covers/meeting.png', tone:'meeting' },
    { title:'教材到互动课件', image:'./assets/home-covers/courseware.png', tone:'courseware' },
    { title:'错因到个性化练习', image:'./assets/home-covers/practice.png', tone:'practice' }
  ]
  const defaultPracticeCases = [
    { title:'有理数15分钟随堂练习', image:'./assets/home-covers/question.png', tone:'question' },
    { title:'分数除法作业智能批改', image:'./assets/home-covers/grading.png', tone:'grading' },
    ...fixedPracticeCases
  ]
  const practiceCasesBySkill = {
    '组题':[
      { title:'有理数15分钟随堂练习', image:'./assets/home-covers/question.png', tone:'question' },
      { title:'分数除法单元检测组卷', image:'./assets/home-covers/question-spec.png', tone:'question' }
    ],
    'AI智批':[
      { title:'分数除法作业智能批改', image:'./assets/home-covers/grading.png', tone:'grading' },
      { title:'计算题步骤批改复核', image:'./assets/home-covers/grading.png', tone:'grading' }
    ],
    'AI错因诊断':[
      { title:'分数乘除法阶段错因诊断', image:'./assets/home-covers/diagnosis.png', tone:'diagnosis' },
      { title:'期中学情分析与改进', image:'./assets/previews/excel/page-1.png', tone:'analysis' }
    ],
    'AI个性化练习':[
      { title:'首要错因个性化练习包', image:'./assets/home-covers/practice.png', tone:'practice' },
      { title:'学生分层巩固与提升', image:'./assets/home-covers/practice.png', tone:'practice' }
    ],
    '教学设计':[
      { title:'用小棒认识11～20各数', image:'./assets/previews/word/page-1.png', tone:'lesson' },
      { title:'分数除法单元教学设计', image:'./assets/previews/word/page-2.png', tone:'lesson' }
    ],
    '互动课件':[
      { title:'圆锥体积公式推导', image:'./assets/previews/ppt/slide-5.png', tone:'courseware' },
      { title:'认识11～20各数互动课件', image:'./assets/previews/ppt/slide-3.png', tone:'courseware' }
    ],
    '家长会材料':[
      { title:'期中学情分析家长会', image:'./assets/previews/ppt/slide-1.png', tone:'meeting' },
      { title:'班级学情沟通指南', image:'./assets/previews/pdf/page-1.png', tone:'meeting' }
    ],
    '教学资料整理':[
      { title:'教材内容到知识清单', image:'./assets/previews/word/page-3.png', tone:'organize' },
      { title:'多份教学资料归档整理', image:'./assets/previews/excel/page-2.png', tone:'organize' }
    ]
  }
  const taskCopy = {
    intro: ['飞象老师功能简介','我可以协助完成教学设计、资料整理、数据分析和多格式办公材料生成。'],
    geography: ['分析地理和互动课件内容','已读取模拟教学资料，整理出知识结构、课堂互动建议和可预览课件。']
  }
  const questionCandidates = [
    ['在 -3、0、2、-1.5 中，最小的数是（　）。','选择题','正负数','基础','朝阳区精选题库',2],
    ['-5 的相反数是（　）。','选择题','相反数','基础','同步练习',2],
    ['下列关于绝对值的说法正确的是（　）。','选择题','绝对值','易错','高频错题',2],
    ['数轴上表示 -2 的点向右移动 5 个单位后表示的数是____。','填空题','数轴','基础','本地教材资源',3],
    ['计算：(-7)+12=____。','填空题','有理数加法','基础','同步练习',3],
    ['若 |x|=4，则 x=____。','填空题','绝对值','易错','高频错题',3],
    ['计算：18-(-6)+(-9)。','计算题','有理数运算','基础','教材配套题库',5],
    ['计算：-2³+(-3)×4-(-5)。','计算题','混合运算','中等','区级优质题',5],
    ['在数轴上标出 -4、-1、2，并求 -4 与 2 之间的距离。','解答题','数轴与距离','中等','区级优质题',6],
    ['某冷库温度从 -6℃ 上升 9℃，随后下降 4℃。求最终温度。','解答题','实际应用','中等','生活情境题库',6],
    ['计算：1-2+3-4+…+19-20，并说明分组方法。','解答题','规律探究','提高','AI变式题',8],
    ['非遗市集上午收入260元、支出85元，下午收入180元、支出55元，求全天净收入。','解答题','有理数应用','提高','AI原创题',8]
  ].map((item,index)=>({id:index+1,title:item[0],type:item[1],knowledge:item[2],difficulty:item[3],source:item[4],score:item[5],selected:true}))
  const learningDemoPrompts = {
    'AI智批':'请批改六年级2班《分数除法基础练习》的92页扫描作业。先让我确认识别到的样卷，再处理有疑问的作答，最后生成班级批改结果和讲评建议。',
    'AI错因诊断':'分析六年级2班最近三次“分数乘除法”作业，重点诊断班级共性错因和需要关注的学生。先给出错因聚类，我确认后生成诊断报告。',
    'AI个性化练习':'根据刚才的错因诊断，为六年级2班生成一份个性化练习：每位学生8题，基础巩固为主，针对各自首要错因安排2道变式题。先给我分组预览，确认后导出。'
  }
  const teachingSkillPrompts = {
    '组题':'我是小学五年级数学老师，请帮我组一份北京市西城区五年级上学期期末考试试卷。',
    'AI智批':'请批改【班级或学生】的【作业/试卷名称】（可上传文件），重点检查【答案正确性/解题步骤/书写规范】，评分标准为【】（未填写时按题目分值和常规教学标准）。请先确认识别到的样卷和存疑作答，再生成批改结果、班级统计和讲评建议。',
    'AI错因诊断':'请分析【班级或学生】在【时间范围/最近几次】【作业或考试】中的错误，重点诊断【知识理解/计算方法/审题习惯/表达规范】。请先给出错因聚类和重点关注学生，我确认后再生成诊断报告、教学建议和后续干预计划。',
    'AI个性化练习':'请根据【错因诊断结果/上传的作业或试卷】，为【班级或学生】生成个性化练习。每人【】题，难度以【基础巩固/均衡/提高】为主，并针对首要错因安排【】道变式题。请先展示学生分组和题目样例，确认后再导出练习包和答案。',
    '教学设计':'请为【年级】【学科】的《【课题名称】》设计一节【】分钟的课程。结合【教材版本】和【班级学情】，梳理教学目标、重点难点、教学流程、师生活动和课堂评价（可补充作业设计）。请先生成教学框架，确认后再整理成完整教案。',
    '互动课件':'请为【年级】【学科】的《【课题名称】》制作一份【PPT/HTML互动课件】。重点讲解【核心知识点】，加入【情境导入/互动问答/实验探究/课堂练习】（未填写时由 AI 按课程内容搭配），适用于【】分钟课堂。请先给出页面结构和互动设计，确认后再生成课件。',
    '家长会材料':'我是【年级班级】班主任，将在【日期】召开【期中/期末/专题】家长会。请根据【上传的成绩、作业和课堂表现数据】，生成班级学情分析、学生分层、问题诊断和家校行动建议，并制作【数据表/分析报告/家长会PPT/家校指南】（默认生成完整材料包）。',
    '教学资料整理':'请整理我上传的【教材/教案/课件/试卷/成绩表等资料】，按照【章节/知识点/课时/资料类型】进行归类，提炼核心内容、重点难点和可复用素材，并生成【资料目录/知识清单/备课摘要】（未填写时生成一份结构化教学资料索引）。'
  }
  let playbackTimer
  let openFiles = []
  let activeFile = null
  let activeSlide = 1
  let zoom = 100
  let annotationMode = false
  let libraryMode = 'all'
  let libraryCategory = '全部'
  let libraryQuery = ''
  const annotations = []

  const appShell = $('#appShell')
  const messageColumn = $('#messageColumn')
  const messageScroll = $('#messageScroll')
  const previewPane = $('#previewPane')
  const previewTabs = $('#previewTabs')
  const previewBody = $('#previewBody')
  const annotateButton = $('#annotateButton')
  const zoomButton = $('#zoomButton')
  const zoomLabel = $('.preview-zoom-label', zoomButton)
  const downloadButton = $('#downloadButton')
  const openButton = $('#openButton')
  const composerInput = $('#composerInput')
  const sendButton = $('#sendButton')
  const skillRow = $('#skillRow')
  const attachmentRow = $('#attachmentRow')
  const composerAttachmentsRowTop = $('#composerAttachmentsRowTop')
  const composerAttachmentsRowActions = $('#composerAttachmentsRowActions')
  const composerWrap = $('.composer-wrap')
  const conversationView = $('#conversationView')

  const SKILL_LABELS = { 组题: 'AI组题', AI错因诊断: 'AI错题诊断' }
  function skillLabel(name) {
    return SKILL_LABELS[name] || name
  }
  function isComposeSkillActive() {
    return Boolean(skillRow?.querySelector('[data-context="组题"]'))
  }

  function getActiveEditingSkill() {
    const artifactChips = $$('[data-context]', skillRow).filter((node) =>
      ['组题', '互动课件'].includes(node.dataset.context)
    )
    // 双成果时以右侧当前打开的标签为准，避免 chip 高亮与预览不同步。
    if (artifactChips.length >= 2) {
      if (activeFile === 'practiceSheet') return '组题'
      if (activeFile === 'courseware') return '互动课件'
    }
    const activeChip = skillRow?.querySelector('[data-context].skill-chip--active')
    if (activeChip && ['组题', '互动课件'].includes(activeChip.dataset.context)) {
      return activeChip.dataset.context
    }
    if (artifactChips.length === 1) return artifactChips[0].dataset.context
    if (isComposeSkillActive()) return '组题'
    if (skillRow?.querySelector('[data-context="互动课件"]')) return '互动课件'
    return null
  }

  function shouldShowComposeAddMenu() {
    const skill = getActiveEditingSkill()
    return skill === '组题' || skill === '互动课件'
  }

  function syncAddButtonForSkill() {
    const addButton = $('#addButton')
    if (!addButton) return
    addButton.hidden = false
  }

  const SKILL_CONTEXTS = new Set([
    '组题',
    '互动课件',
    'AI组题命题 Demo 1',
    'AI组题命题 Demo 2',
    ...Object.keys(learningDemoPrompts),
  ])
  const ATTACHMENT_SOURCE_CONTEXTS = new Set(['题目资源', '我的知识库', '文件和文件夹', '练一练'])

  let pendingPickerSelection = []
  let pendingUploadFile = null
  // 由上一个教学成果（课件、教案等）带进组题的上下文，形如 { label, fileKey }
  let pendingContextFile = null
  let composerUploadInput = null
  let questionPickerIntent = 'composer'

  function isHomeComposeFocus() {
    return Boolean(conversationView?.classList.contains('home-screen') && isComposeSkillActive())
  }

  const COMPOSE_PLACEHOLDER =
    '找专题练习｜从北京市朝阳区近3年六年级上下册数学期末试卷中，找出推导公式相关的题目'

  function syncHomeComposeFocus() {
    conversationView?.classList.toggle('home-compose-focus', isHomeComposeFocus())
    syncComposerReserve()
  }

  function exitHomeComposeFocus() {
    if (!conversationView?.classList.contains('home-screen')) return
    composerInput.placeholder = '描述你要完成的教学任务'
    composerInput.value = ''
    clearPendingAttachments()
    renderHomeCases(null)
    $('#conversationView').classList.remove('has-home-cases')
    syncHomeComposeFocus()
    syncSendReady()
  }
  function truncateComposerText(text, max = 24) {
    const plain = String(text || '').replace(/\s+/g, ' ').trim()
    return plain.length > max ? `${plain.slice(0, max)}…` : plain
  }

  function syncSendReady() {
    const hasText = Boolean(composerInput.value.trim())
    const hasPending = pendingPickerSelection.length > 0 || Boolean(pendingUploadFile) || Boolean(pendingContextFile)
    const canSend = hasText || hasPending
    sendButton.classList.toggle('ready', canSend)
    sendButton.disabled = !canSend
  }

  function clearPendingAttachments() {
    pendingPickerSelection = []
    pendingUploadFile = null
    pendingContextFile = null
    renderComposerAttachments()
    syncSendReady()
  }

  function normalizePickerSelection(selection = [], count = 0) {
    if (Array.isArray(selection) && selection.length) return selection
    const total = Math.max(0, Number(count) || 0)
    if (!total) return []
    return Array.from({ length: total }, (_, index) => ({
      selectionKey: `pending-${Date.now()}-${index}`,
      question: { stem: `已选题目 ${index + 1}` },
    }))
  }

  function getComposerAttachmentsRow() {
    return conversationView?.classList.contains('home-screen')
      ? composerAttachmentsRowTop
      : composerAttachmentsRowActions
  }

  function clearComposerAttachmentRows() {
    ;[composerAttachmentsRowTop, composerAttachmentsRowActions].forEach((row) => {
      if (!row) return
      row.hidden = true
      row.innerHTML = ''
    })
  }

  function bindComposerAttachmentEvents(row) {
    if (!row) return
    $('[data-attachment-kind="question"] .composer-attachment-text', row)?.addEventListener('click', () =>
      openQuestionPicker('composer')
    )
    $('[data-remove-attachment="file"]', row)?.addEventListener('click', () => {
      pendingUploadFile = null
      renderComposerAttachments()
      syncSendReady()
      syncComposerReserve()
    })
    $('[data-remove-attachment="question"]', row)?.addEventListener('click', () => {
      pendingPickerSelection = []
      renderComposerAttachments()
      syncSendReady()
      syncComposerReserve()
    })
    $('[data-attachment-kind="context"] .composer-attachment-text', row)?.addEventListener('click', () => {
      if (pendingContextFile?.fileKey) openPreview(pendingContextFile.fileKey)
    })
    $('[data-remove-attachment="context"]', row)?.addEventListener('click', () => {
      pendingContextFile = null
      renderComposerAttachments()
      syncSendReady()
      syncComposerReserve()
    })
  }

  function renderComposerAttachments() {
    const parts = []
    if (pendingContextFile) {
      parts.push(
        `<span class="composer-attachment-link" data-attachment-kind="context"><button type="button" class="composer-attachment-text" aria-label="查看${escapeHtml(
          pendingContextFile.label
        )}">${escapeHtml(
          truncateComposerText(pendingContextFile.label, 42)
        )}</button><button type="button" class="composer-attachment-remove" data-remove-attachment="context" aria-label="移除上下文">×</button></span>`
      )
    }
    if (pendingUploadFile) {
      parts.push(
        `<span class="composer-attachment-link" data-attachment-kind="file"><button type="button" class="composer-attachment-text" aria-label="查看文件">${escapeHtml(
          truncateComposerText(pendingUploadFile, 42)
        )}</button><button type="button" class="composer-attachment-remove" data-remove-attachment="file" aria-label="移除文件">×</button></span>`
      )
    }
    if (pendingPickerSelection.length) {
      const count = pendingPickerSelection.length
      parts.push(
        `<span class="composer-attachment-link" data-attachment-kind="question"><button type="button" class="composer-attachment-text" aria-label="继续选择题目">已选${count}道题</button><button type="button" class="composer-attachment-remove" data-remove-attachment="question" aria-label="移除已选题目">×</button></span>`
      )
    }
    clearComposerAttachmentRows()
    if (!parts.length) return
    const target = getComposerAttachmentsRow()
    if (!target) return
    target.hidden = false
    target.innerHTML = parts.join('')
    bindComposerAttachmentEvents(target)
  }

  function renderComposerQuestionPreview() {
    renderComposerAttachments()
  }

  function renderComposerFilePreview() {
    renderComposerAttachments()
  }

  function getPendingAttachments() {
    return {
      selection: pendingPickerSelection.map((item) => ({
        ...item,
        question: item.question ? { ...item.question, options: item.question.options ? [...item.question.options] : [] } : undefined,
      })),
      fileName: pendingUploadFile || '',
      contextFile: pendingContextFile ? { ...pendingContextFile } : null,
    }
  }

  function setPendingContextFile(label, fileKey = '') {
    pendingContextFile = label ? { label, fileKey } : null
    renderComposerAttachments()
    syncSendReady()
    syncComposerReserve()
  }

  function renderPendingQuestionChip() {
    renderComposerQuestionPreview()
  }

  function setPendingQuestionSelection(selection = []) {
    pendingPickerSelection = Array.isArray(selection) ? selection : []
    renderPendingQuestionChip()
    syncSendReady()
    syncComposerReserve()
    composerInput.focus()
  }

  function setPendingFileAttachment(fileName) {
    pendingUploadFile = fileName || null
    renderComposerFilePreview()
    syncSendReady()
    syncComposerReserve()
    composerInput.focus()
  }

  function getComposerUploadInput() {
    if (!composerUploadInput) {
      composerUploadInput = document.createElement('input')
      composerUploadInput.type = 'file'
      composerUploadInput.hidden = true
      composerUploadInput.accept = '.doc,.docx,.pdf,.png,.jpg,.jpeg'
      composerUploadInput.addEventListener('change', () => {
        const file = composerUploadInput.files?.[0]
        if (file) setPendingFileAttachment(file.name)
        composerUploadInput.value = ''
      })
      document.body.appendChild(composerUploadInput)
    }
    return composerUploadInput
  }

  function clearComposerContext({ keepSkills = false } = {}) {
    if (!keepSkills) skillRow.innerHTML = ''
    attachmentRow.innerHTML = ''
    pendingPickerSelection = []
    pendingUploadFile = null
    renderComposerAttachments()
    $$('[data-question-focus]', document).forEach((node) => node.remove())
    syncSendReady()
    renderAddMenu()
  }

  function addSkillChip(label, isHomeSkill = false) {
    if ($$('[data-context]', skillRow).some((node) => node.dataset.context === label)) return
    const chip = document.createElement('span')
    chip.className = `context-chip skill-chip${label === '组题' ? ' skill-chip--compose' : ''}`
    chip.dataset.context = label
    if (isHomeSkill) chip.dataset.homeSkillContext = 'true'
    chip.innerHTML = `${escapeHtml(skillLabel(label))} <button aria-label="移除">×</button>`
    $('button', chip).addEventListener('click', () => {
      const wasCompose = label === '组题'
      chip.remove()
      if (wasCompose && conversationView?.classList.contains('home-screen')) {
        exitHomeComposeFocus()
        return
      }
      syncComposerReserve()
      syncSendReady()
      renderAddMenu()
      if (isHomeSkill) {
        renderHomeCases(null)
        $$('[data-skill-card]', messageColumn).forEach((card) => card.classList.remove('selected'))
      }
      syncHomeComposeFocus()
    })
    skillRow.appendChild(chip)
    syncComposerReserve()
    syncSendReady()
    renderAddMenu()
    if (label === '组题') {
      composerInput.placeholder = COMPOSE_PLACEHOLDER
      syncHomeComposeFocus()
    }
  }

  function addAttachmentChip(label, kind = 'source') {
    if ($$('[data-context]', attachmentRow).some((node) => node.dataset.context === label)) return
    const chip = document.createElement('span')
    chip.className = `context-chip attachment-chip${kind === 'source' ? ' attachment-chip--source' : ''}`
    chip.dataset.context = label
    chip.innerHTML = `${kind === 'source' ? '▣' : '•'} ${escapeHtml(label)} <button aria-label="移除">×</button>`
    $('button', chip).addEventListener('click', () => {
      chip.remove()
      if (label === '题目资源') clearPendingAttachments()
      if (label === '文件和文件夹') {
        pendingUploadFile = null
        $$('[data-file-attachment]', attachmentRow).forEach((node) => node.remove())
      }
      syncComposerReserve()
      syncSendReady()
    })
    attachmentRow.appendChild(chip)
    syncComposerReserve()
    syncSendReady()
  }

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))
  function syncComposerTextareaHeight() {
    if (!composerInput) return
    composerInput.style.height = '0px'
    const onHome = conversationView?.classList.contains('home-screen')
    const min = onHome ? 60 : 52
    const max = onHome ? 140 : 108
    composerInput.style.height = `${Math.min(max, Math.max(min, composerInput.scrollHeight))}px`
  }
  const syncComposerReserve = () => {
    if (!messageColumn || !messageScroll) return
    syncComposerTextareaHeight()
    const composerHeight = composerWrap?.offsetHeight || 0
    if (conversationView?.classList.contains('home-screen')) {
      const space = document.querySelector('.home-composer-space')
      if (space) space.style.height = `${Math.max(composerHeight + 24, 120)}px`
      messageColumn.style.paddingBottom = ''
      messageScroll.style.scrollPaddingBottom = ''
      renderComposerAttachments()
      syncSendReady()
      return
    }
    if (conversationView?.classList.contains('skill-library-screen')) {
      messageColumn.style.paddingBottom = ''
      messageScroll.style.scrollPaddingBottom = ''
      return
    }
    const reserve = composerHeight + 56
    messageColumn.style.paddingBottom = `${reserve}px`
    messageScroll.style.scrollPaddingBottom = `${Math.max(reserve - 28, 220)}px`
    syncSendReady()
  }
  const scrollToBottom = () => requestAnimationFrame(() => {
    syncComposerReserve()
    requestAnimationFrame(() => {
      messageScroll.scrollTop = messageScroll.scrollHeight
    })
  })
  const stopPlayback = () => { if (playbackTimer) clearInterval(playbackTimer); playbackTimer = undefined }

  function userMessage() {
    return `<div class="user-message"><div class="attachment-pill"><i>X</i><span><b>五年级二班-期中原始学情数据（模拟）.xlsx</b><small>模拟数据附件 · 36 名学生</small></span></div>${escapeHtml(prompt)}</div>`
  }

  function assistantLead() {
    return `<div class="assistant-message"><span class="assistant-mark">象</span><div><b>正在整理期中家长会办公材料</b><p>我会先校验同一组班级数据，再分别制作四种用途不同、结论一致的文件。</p></div></div>`
  }

  function stageMarkup() {
    return `<div class="stage-list">${stages.map((stage,index) => `<div class="stage-row" data-stage="${index}"><span class="stage-state">${index+1}</span><span><b>${stage[0]}</b><small>${stage[1]}</small></span></div>`).join('')}</div>`
  }

  function resultMarkup() {
    return `<section class="result-block" id="resultBlock"><h3>四份材料已生成</h3><p>全部基于同一组 36 人模拟数据，可点击文件在右侧预览。</p><div class="artifact-grid">${['excel','word','ppt','pdf'].map(id => files[id]).map(file => `<button class="artifact-card" data-file="${file.id}"><span class="file-mark ${file.className}">${file.mark}</span><span><b>${file.name}</b><small>${file.label}</small></span><em>›</em></button>`).join('')}</div></section>`
  }

  function bindArtifactCards() {
    $$('[data-file]', messageColumn).forEach(button => button.addEventListener('click', () => openPreview(button.dataset.file)))
  }

  function startMeetingPlayback(instant = false) {
    window.FxPracticeDemo?.resetPaperState?.()
    stopPlayback()
    $('#conversationView').classList.remove('home-screen')
    setActiveTask('meeting')
    $('#taskHeader h1').textContent = '生成期中家长会材料'
    $('#taskHeader span').textContent = 'demo演示 · 模拟数据 · 不调用 API'
    $('#replayButton').hidden = false
    messageColumn.innerHTML = userMessage() + assistantLead() + stageMarkup() + resultMarkup()
    bindArtifactCards()
    const rows = $$('.stage-row', messageColumn)
    const result = $('#resultBlock')
    if (instant) {
      rows.forEach(row => { row.classList.add('done'); $('.stage-state',row).textContent = '✓' })
      result.classList.add('visible')
      scrollToBottom()
      return
    }
    let index = 0
    rows[0].classList.add('active')
    scrollToBottom()
    playbackTimer = setInterval(() => {
      if (index < rows.length) {
        rows[index].classList.remove('active'); rows[index].classList.add('done'); $('.stage-state',rows[index]).textContent = '✓'
        index += 1
        if (index < rows.length) rows[index].classList.add('active')
        else { clearInterval(playbackTimer); playbackTimer = undefined; result.classList.add('visible') }
        scrollToBottom()
      }
    }, 620)
  }

  function setActiveTask(task) {
    $('#knowledgePanel').hidden=true
    $('#knowledgePanel').classList.remove('loaded')
    $('#knowledgePanel').classList.remove('plain-panel')
    if(task!=='question-workbench')window.FxQuestionWorkbenchV3?.close()
    $$('.product-entry').forEach(item=>{
      item.classList.remove('active')
    })
    $('#conversationView').classList.remove('skill-library-screen')
    $('#conversationView').classList.remove('teaching-skills-screen')
    $('#conversationView').classList.remove('has-home-cases')
    $('.skill-detail-overlay')?.remove()
    $('.practice-case-overlay')?.remove()
    $$('.task-item,.recent-demo').forEach(item => item.classList.toggle('active', item.dataset.task === task))
  }

  function homeSkillCover(skill){
    const coverImages={
      question:'./assets/home-covers/question.png', grading:'./assets/home-covers/grading.png', diagnosis:'./assets/home-covers/diagnosis.png',
      practice:'./assets/home-covers/practice.png', lesson:'./assets/home-covers/lesson.png', courseware:'./assets/home-covers/courseware.png',
      meeting:'./assets/home-covers/meeting.png', organize:'./assets/home-covers/organize.png'
    }
    return coverImages[skill.cover]
  }

  function teachingSkillIcon(skill){
    const icons={
      question:'<path d="M6 4.5h9l3 3V20H6z"/><path d="M15 4.5V8h3M9 11h6M9 14h6M9 17h4"/>',
      grading:'<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 3h6v3H9zM8.5 12l2 2 4-5M8.5 17h7"/>',
      diagnosis:'<circle cx="11" cy="11" r="6"/><path d="m15.5 15.5 4 4M11 8v6M8 11h6"/>',
      practice:'<path d="M4 5.5h6a3 3 0 0 1 3 3V20a3 3 0 0 0-3-3H4zM20 5.5h-4a3 3 0 0 0-3 3V20a3 3 0 0 1 3-3h4z"/><path d="M8 9h2M16 9h1.5"/>',
      lesson:'<path d="M4 5h7a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3H4zM20 5h-3a3 3 0 0 0-3 3v12a3 3 0 0 1 3-3h3z"/>',
      courseware:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M8 8h8M8 11h5"/>',
      meeting:'<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2"/><path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13a5.5 5.5 0 0 1 5.5 5.5V20M14.5 15a4 4 0 0 1 6 3.5V20"/>',
      organize:'<path d="M3.5 7h6l2-2h9v14h-17z"/><path d="M8 11h8M8 14h8"/>'
    }
    return `<span class="teaching-skill-icon ${skill.cover}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[skill.cover]||icons.question}</svg></span>`
  }

  function renderHomeCases(skill){
    const section=$('#homeCases')
    if(!section)return
    const cases=skill?[...(practiceCasesBySkill[skill]||[]),...fixedPracticeCases]:defaultPracticeCases
    const unique=cases.filter((item,index,list)=>list.findIndex(candidate=>candidate.title===item.title)===index).slice(0,5)
    section.hidden=false
    $('#conversationView').classList.add('has-home-cases')
    section.innerHTML=`<div class="home-section-head"><h3>灵感推荐<small>试试这些最佳实践案例，找找灵感</small></h3><div><button type="button" aria-label="换一批案例"><span>↻</span></button><button type="button" aria-label="去广场"><span>↗</span></button></div></div><div class="practice-case-grid">${unique.map(item=>`<button class="practice-case" type="button" aria-label="${escapeHtml(item.title)}"><span class="practice-case-cover ${item.tone}"><img src="${item.image}" alt="" loading="lazy"></span><b>${escapeHtml(item.title)}</b></button>`).join('')}</div>`
    $$('.practice-case',section).forEach((button,index)=>button.addEventListener('click',()=>showPracticeCaseDetail(unique[index])))
  }

  const practiceSkillByTone={question:'组题',grading:'AI智批',diagnosis:'AI错因诊断',analysis:'AI错因诊断',practice:'AI个性化练习',lesson:'教学设计',courseware:'互动课件',meeting:'家长会材料',organize:'教学资料整理'}
  const practiceDescriptions={
    '有理数15分钟随堂练习':'围绕有理数核心知识点，组合基础题、易错题和变式题，形成一份可直接用于课堂检测的随堂练习。',
    '分数除法作业智能批改':'识别学生手写答案与解题步骤，标记错误、扣分点和教师评语，并汇总班级整体表现。',
    '期中家长会办公包':'基于同一组班级学情数据，生成分析表、改进计划、家长会演示和家校共育指南。',
    '教材到互动课件':'提炼教材重点和教学流程，将知识内容转化为可演示、可操作的课堂互动课件。',
    '错因到个性化练习':'根据学生的首要错因完成分组，并生成基础巩固题与针对性变式题。'
  }
  function practiceCaseSkill(item){return practiceSkillByTone[item.tone]||'教学资料整理'}
  function practiceCasePrompt(item){const skill=practiceCaseSkill(item);return `请参考最佳实践案例《${item.title}》，为【年级或班级】【学科与课题】制作一份同类型成果。请保留案例的核心结构和呈现方式，并结合【我的资料或具体要求】进行调整。\n\n${teachingSkillPrompts[skill]||''}`}
  function showPracticeCaseDetail(item){
    if(!item)return
    $('.practice-case-overlay')?.remove()
    const skill=practiceCaseSkill(item),overlay=document.createElement('section')
    overlay.className='practice-case-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label',`${item.title}案例详情`)
    overlay.innerHTML=`<article class="practice-detail-card"><header><div><span class="practice-detail-title"><h2>${escapeHtml(item.title)}</h2><button type="button" data-case-favorite aria-label="收藏案例">♡</button></span><p>${escapeHtml(practiceDescriptions[item.title]||`这是由「${skill}」生成的教学最佳实践案例，可参考其内容结构和视觉呈现快速制作同类成果。`)}</p><span class="practice-detail-skill">✦ ${escapeHtml(skill)}</span></div><button class="practice-detail-close" type="button" data-close-case aria-label="关闭">×</button></header><div class="practice-detail-preview"><div class="practice-preview-head"><span>${escapeHtml(item.title)}</span><small>Demo案例 · 模拟数据</small></div><div class="practice-preview-canvas"><img src="${item.image}" alt="${escapeHtml(item.title)}案例预览"></div></div><footer><button class="practice-maximize" type="button" data-maximize-case aria-label="最大化预览">↗</button><button class="practice-same" type="button" data-make-same>一键做同款 <span>↗</span></button></footer></article>`
    document.body.appendChild(overlay)
    $('[data-close-case]',overlay).addEventListener('click',()=>overlay.remove())
    $('[data-case-favorite]',overlay).addEventListener('click',event=>{const button=event.currentTarget;button.classList.toggle('active');button.textContent=button.classList.contains('active')?'♥':'♡'})
    $('[data-maximize-case]',overlay).addEventListener('click',event=>{overlay.classList.toggle('maximized');const button=event.currentTarget,active=overlay.classList.contains('maximized');button.textContent=active?'↙':'↗';button.setAttribute('aria-label',active?'退出最大化':'最大化预览')})
    $('[data-make-same]',overlay).addEventListener('click',()=>{overlay.remove();showBlankTask();activateSkill(skill);composerInput.value=practiceCasePrompt(item);syncSendReady();composerInput.focus()})
    overlay.addEventListener('click',event=>{if(event.target===overlay)overlay.remove()})
  }

  const teachingFavoriteKey='feixiang-teaching-skill-favorites'
  // 只记录当前页面会话：刷新后再次视为首次点击。
  let aiComposeIntroSeen=false
  const readTeachingFavorites=()=>{try{const value=JSON.parse(localStorage.getItem(teachingFavoriteKey)||'[]');return Array.isArray(value)?value.filter(name=>teachingSkills.some(skill=>skill.name===name)):[]}catch{return[]}}
  const saveTeachingFavorites=names=>localStorage.setItem(teachingFavoriteKey,JSON.stringify(names))
  const teachingSkillCardMarkup=(skill,compact=false)=>`<article class="teaching-skill-card${compact?' compact':''}" data-skill-card="${escapeHtml(skill.name)}"><button class="teaching-skill-main" type="button" data-open-skill="${escapeHtml(skill.name)}" aria-label="查看${escapeHtml(skillLabel(skill.name))}技能详情">${teachingSkillIcon(skill)}<span class="teaching-skill-copy"><b class="teaching-skill-title">${escapeHtml(skillLabel(skill.name))}</b><small>${escapeHtml(skill.description)}</small></span></button><button class="teaching-skill-favorite" type="button" data-favorite-skill="${escapeHtml(skill.name)}" aria-label="收藏 ${escapeHtml(skillLabel(skill.name))}">☆</button></article>`
  const orderedTeachingSkills=()=>{const favorites=readTeachingFavorites();return [...teachingSkills].sort((a,b)=>{const ai=favorites.indexOf(a.name),bi=favorites.indexOf(b.name),af=ai>=0,bf=bi>=0;return af!==bf?(af?-1:1):af?ai-bi:teachingSkills.indexOf(a)-teachingSkills.indexOf(b)})}

  function syncTeachingFavoriteButtons(){
    const favorites=readTeachingFavorites()
    $$('[data-favorite-skill]').forEach(button=>{const active=favorites.includes(button.dataset.favoriteSkill);button.textContent=active?'★':'☆';button.classList.toggle('active',active);button.setAttribute('aria-label',`${active?'取消收藏':'收藏'} ${button.dataset.favoriteSkill}`)})
  }

  function toggleTeachingFavorite(name){
    const favorites=readTeachingFavorites(),index=favorites.indexOf(name)
    if(index>=0)favorites.splice(index,1);else favorites.push(name)
    saveTeachingFavorites(favorites)
    renderHomeSkillStrip()
    if($('#skillLibraryGrid'))renderSkillLibraryCards()
    syncTeachingFavoriteButtons()
  }

  function bindTeachingFavoriteButtons(root=document){
    $$('[data-favorite-skill]',root).forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();toggleTeachingFavorite(button.dataset.favoriteSkill)}))
    syncTeachingFavoriteButtons()
  }

  function openQuestionWorkbench(){
    activateSkill('组题')
  }

  function openQuestionWorkbenchPage(){
    window.FxPracticeDemo?.resetPaperState?.()
    stopPlayback()
    setActiveTask('question-workbench')
    openFiles=[]
    activeFile=null
    renderPreview()
    window.FxQuestionWorkbenchV3?.open()
  }

  function openTeachingSkill(skillName){
    if(skillName==='组题'){
      if(!aiComposeIntroSeen){
        aiComposeIntroSeen=true
        showSkillDetail(skillName)
        return
      }
      openQuestionWorkbench()
      return
    }
    showSkillDetail(skillName)
  }

  function bindHomeSkillCards(){
    $$('[data-open-skill]',messageColumn).forEach(button=>button.addEventListener('click',()=>openTeachingSkill(button.dataset.openSkill)))
    bindTeachingFavoriteButtons(messageColumn)
  }

  function renderHomeSkillStrip(){
    const strip=$('#homeSkillStrip')
    if(!strip)return
    strip.innerHTML=orderedTeachingSkills().slice(0,5).map(skill=>teachingSkillCardMarkup(skill)).join('')
    bindHomeSkillCards()
  }

  function renderPlaza(mode='resource'){
    const grid=$('#plazaGrid')
    if(!grid)return
    const items=plazaContent[mode]||plazaContent.resource
    grid.innerHTML=items.map(item=>`<a class="plaza-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"><span class="plaza-card-cover"><img src="${escapeHtml(item.image)}" alt="" loading="lazy"></span><span class="plaza-card-copy"><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.meta)}</small></span><span class="plaza-card-arrow">↗</span></a>`).join('')
  }

  function renderHome(){
    messageColumn.innerHTML=`<div class="home-page"><section class="home-welcome"><h2>Joyce老师，今天想从哪项教学工作开始？</h2><div class="teacher-memory"><span>教师记忆</span><button type="button">五年级二班</button><button type="button">数学</button><button type="button">人教版</button></div></section><div class="home-composer-space" aria-hidden="true"></div><section class="home-plaza"><div class="plaza-tabs"><button class="active" type="button" data-plaza="resource">资源广场</button><button type="button" data-plaza="app">应用广场</button></div><div class="plaza-grid" id="plazaGrid"></div></section></div>`
    renderPlaza('resource')
    $$('[data-plaza]',messageColumn).forEach(button=>button.addEventListener('click',()=>{$$('[data-plaza]',messageColumn).forEach(item=>item.classList.toggle('active',item===button));renderPlaza(button.dataset.plaza)}))
  }

  function showBlankTask() {
    stopPlayback(); setActiveTask('blank')
    window.FxPracticeDemo?.resetPaperState?.()
    document.body.classList.remove('ai-compose-workspace')
    $('#aiComposeBackButton')?.remove()
    $('#conversationView').classList.remove('skill-library-screen')
    $('.skill-detail-overlay')?.remove()
    $('#knowledgePanel').hidden=true;$('#knowledgeEntry').classList.remove('active')
    openFiles=[]; activeFile=null; renderPreview()
    $('#conversationView').classList.add('home-screen')
    $('#conversationView').classList.remove('home-compose-focus')
    $('#taskHeader h1').textContent = '新任务'; $('#taskHeader span').textContent = 'demo演示 · 不连接 API'; $('#replayButton').hidden = true
    skillRow.innerHTML = ''
    attachmentRow.innerHTML = ''
    pendingPickerSelection = []
    pendingUploadFile = null
    clearComposerAttachmentRows()
    composerInput.value = ''
    composerInput.placeholder = '描述你要完成的教学任务'
    sendButton.classList.remove('ready')
    renderAddMenu()
    renderHome()
  }
  function showSkillDetail(skillName){
    const detail=teachingSkillDetails[skillName]
    if(!detail)return
    $('.skill-detail-overlay')?.remove()
    const overlay=document.createElement('section')
    overlay.className='skill-detail-overlay'
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label',`${skillName}技能详情`)
    const isAiCompose=skillName==='组题'
    const previewMarkup=isAiCompose?`<aside class="skill-detail-preview ai-compose-tour" data-ai-compose-tour>
      <div class="ai-tour-heading"><span>动态演示</span><button type="button" data-ai-tour-replay aria-label="重新播放演示">↻ <span>重播</span></button></div>
      <div class="ai-tour-stage">
        <section class="ai-tour-scene active" data-ai-tour-scene="process" aria-label="AI组题过程演示">
          <div class="ai-tour-visual ai-tour-visual-process"><img class="ai-tour-frame" src="./assets/ai-compose-intro/process-latest.png" alt="AI检索试卷并生成可下载文档"><div class="ai-tour-callout"><span></span>正在检索并生成试卷</div></div>
        </section>
        <section class="ai-tour-scene" data-ai-tour-scene="result" aria-label="AI组题结果演示">
          <div class="ai-tour-visual ai-tour-visual-result"><img class="ai-tour-frame" src="./assets/ai-compose-intro/result-latest.png" alt="生成后的完整数学试卷预览"><div class="ai-tour-callout">◎ 查看完整试卷内容</div></div>
        </section>
      </div>
    </aside>`:`<aside class="skill-detail-preview"><div class="skill-detail-preview-head"><span>示例</span><div><b>${escapeHtml(detail.exampleTitle)}</b><small>${escapeHtml(detail.exampleMeta)}</small></div></div><div class="skill-detail-image"><img src="${detail.image}" alt="${escapeHtml(detail.title)}产出示例"></div></aside>`
    const skillNavTitle=detail.navTitle||detail.title
    overlay.innerHTML=`<div class="skill-detail-card${isAiCompose?' ai-compose-detail':''}"><header><button type="button" data-close-skill-detail aria-label="返回教学技能">←</button><span>教学技能 / ${escapeHtml(skillNavTitle)}</span><button type="button" data-close-skill-detail aria-label="关闭">×</button></header><div class="skill-detail-layout"><section class="skill-detail-copy"><span class="skill-detail-eyebrow">${escapeHtml(detail.eyebrow)}</span><h2>${escapeHtml(detail.title)}</h2><p>${escapeHtml(detail.description)}</p><div class="skill-detail-points">${detail.points.map(point=>`<div><span>✓</span>${escapeHtml(point)}</div>`).join('')}</div><button class="skill-generate-button" type="button" data-go-generate>${isAiCompose?'开始使用':'去生成'} <span>→</span></button><small>${isAiCompose?'点击后在当前页面加入 AI组题标签和示例请求。':'点击后返回新任务，并在首页输入框中预填引导提示词。'}</small></section>${previewMarkup}</div></div>`
    $('#conversationView').appendChild(overlay)
    let tourTimer
    const closeDetail=()=>{clearTimeout(tourTimer);overlay.remove()}
    const setTourStep=(step,autoAdvance=false)=>{
      const tour=$('[data-ai-compose-tour]',overlay)
      if(!tour)return
      clearTimeout(tourTimer)
      $$('[data-ai-tour-step]',tour).forEach(button=>{const active=button.dataset.aiTourStep===step;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))})
      $$('[data-ai-tour-scene]',tour).forEach(scene=>scene.classList.toggle('active',scene.dataset.aiTourScene===step))
      tour.classList.remove('is-playing')
      void tour.offsetWidth
      tour.classList.add('is-playing')
      if(autoAdvance&&step==='process'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)tourTimer=setTimeout(()=>setTourStep('result'),5200)
    }
    $$('[data-close-skill-detail]',overlay).forEach(button=>button.addEventListener('click',closeDetail))
    $$('[data-ai-tour-step]',overlay).forEach(button=>button.addEventListener('click',()=>setTourStep(button.dataset.aiTourStep)))
    $('[data-ai-tour-replay]',overlay)?.addEventListener('click',()=>setTourStep('process',true))
    if(isAiCompose)requestAnimationFrame(()=>setTourStep('process',true))
    $('[data-go-generate]',overlay).addEventListener('click',()=>{
      closeDetail()
      if(skillName==='组题')activateSkill(skillName)
      else{showBlankTask();activateSkill(skillName)}
    })
    overlay.addEventListener('click',event=>{if(event.target===overlay)closeDetail()})
  }

  function showKnowledgeBase(){
    window.FxPracticeDemo?.resetPaperState?.()
    stopPlayback()
    setActiveTask('knowledgeEntry')
    const panel = $('#knowledgePanel')
    panel.hidden = false
    panel.classList.remove('plain-panel', 'loaded')
    $('#knowledgeEntry').classList.add('active')
    openFiles = []
    activeFile = null
    renderPreview()
    const savedComposePapers=()=>{
      let drafts=[]
      try{drafts=JSON.parse(localStorage.getItem('feixiang-question-workbench-v3-drafts')||'[]')}catch{}
      const saved=drafts.filter(item=>item?.questions?.some(question=>question.status==='confirmed')).map(item=>({
        id:item.id,
        title:item.title||'未命名题单',
        meta:`${item.subject||'数学'} · ${item.questions.filter(question=>question.status==='confirmed').length}题`,
        time:new Date(item.updatedAt||Date.now()).toLocaleDateString('zh-CN').replaceAll('/','.')
      }))
      const demos=[
        {id:'knowledge-ai-compose-1',title:'五年级小数乘除法基础练习',meta:'五年级 · 数学 · 5题',time:'2026.09.09'},
        {id:'knowledge-ai-compose-2',title:'四年级数学综合练习题单',meta:'四年级 · 数学 · 13题',time:'2026.09.08'},
        {id:'knowledge-ai-compose-3',title:'七年级有理数随堂练习',meta:'七年级 · 数学 · 12题',time:'2026.09.07'}
      ]
      let deleted=[]
      try{deleted=JSON.parse(localStorage.getItem('feixiang-knowledge-deleted-compose-papers')||'[]')}catch{}
      return [...saved,...demos.filter(demo=>!saved.some(item=>item.title===demo.title))].filter(item=>!deleted.includes(item.id))
    }
    const folderIcon='<span class="kb-folder-icon"><svg viewBox="0 0 32 28" aria-hidden="true"><path d="M2 7.5A3.5 3.5 0 0 1 5.5 4h7l3 3h11A3.5 3.5 0 0 1 30 10.5v11A4.5 4.5 0 0 1 25.5 26h-19A4.5 4.5 0 0 1 2 21.5v-14Z"/><path d="M2 10h28"/></svg><i>↻</i></span>'
    const renderCloud=()=>{
      panel.innerHTML=`<div class="kb-page"><nav class="kb-tabs"><button>我的生成</button><button>我的收藏</button><button class="active">我的云盘 <span>♙</span></button><label><span>⌕</span><input type="search" placeholder="搜索知识库"></label></nav><header class="kb-cloud-head"><div><b>我的云盘</b><span>（7.9KB/5.00GB）</span></div><div><button>▦ 管理</button><button>▣ 新建文件夹</button><button class="primary">↥ 上传文件</button></div></header><div class="kb-table-head"><span>文件名</span><span>更新时间</span><span>大小</span><span>操作</span></div><div class="kb-folder-list"><button type="button">${folderIcon}<b>我的工作成果</b><time>2026.09.05</time><em>–</em><i>···</i></button><button type="button" data-open-compose-folder>${folderIcon}<b>我的题单</b><time>2026.09.09</time><em>–</em><i>···</i></button><button type="button">${folderIcon}<b>对话中上传的文件</b><time>2026.09.05</time><em>–</em><i>···</i></button></div></div>`
      $('[data-open-compose-folder]',panel)?.addEventListener('click',renderComposeFolder)
    }
    const renderComposeFolder=()=>{
      const papers=savedComposePapers()
      panel.innerHTML=`<div class="kb-page"><nav class="kb-tabs"><button>我的生成</button><button>我的收藏</button><button class="active">我的云盘 <span>♙</span></button><label><span>⌕</span><input type="search" placeholder="搜索组题文件"></label></nav><header class="kb-folder-head"><div><button type="button" data-back-cloud>←</button><span>我的云盘</span><i>/</i><b>我的题单</b></div><span>共 ${papers.length} 份题单</span></header><div class="kb-table-head kb-paper-columns"><span>题单名称</span><span>更新时间</span><span>操作</span></div><div class="kb-paper-list">${papers.map(paper=>`<article><span class="kb-paper-icon">题</span><div><b>${escapeHtml(paper.title)}</b><small>${escapeHtml(paper.meta)}</small></div><time>${escapeHtml(paper.time)}</time><div><button type="button" data-open-compose-paper="${escapeHtml(paper.id)}">查看</button><button type="button" data-edit-compose-paper="${escapeHtml(paper.id)}">编辑</button><button type="button" class="delete" data-delete-compose-paper="${escapeHtml(paper.id)}">删除</button></div></article>`).join('')}</div></div>`
      $('[data-back-cloud]',panel)?.addEventListener('click',renderCloud)
      const ensureComposeDraft=id=>{
        let drafts=[]
        try{drafts=JSON.parse(localStorage.getItem('feixiang-question-workbench-v3-drafts')||'[]')}catch{}
        if(!drafts.some(item=>item.id===id)){
          const paper=papers.find(item=>item.id===id)
          const count=Math.max(1,Number(paper?.meta.match(/(\d+)题/)?.[1]||5))
          drafts.push({id,title:paper?.title||'AI组题题单',subject:'五年级 · 数学',curriculumKey:'小学数学',createdAt:Date.now(),updatedAt:Date.now(),questions:Array.from({length:count},(_,index)=>({id:`${id}-q${index+1}`,sourceId:`b${index%10+1}`,status:'confirmed',source:'ai-compose',type:index%3===0?'填空题':'选择题',knowledge:'数与运算',difficulty:'较易',score:1,text:`${paper?.title||'AI组题'}示例题 ${index+1}。`}))})
          localStorage.setItem('feixiang-question-workbench-v3-drafts',JSON.stringify(drafts))
        }
      }
      const editComposePaper=id=>{
        ensureComposeDraft(id)
        sessionStorage.removeItem('feixiang-question-workbench-open-paper')
        if(window.FxQuestionWorkbenchV3?.prepareKnowledgeEditSwitch){
          window.FxQuestionWorkbenchV3.prepareKnowledgeEditSwitch(id)
        }else{
          let drafts=[]
          try{drafts=JSON.parse(localStorage.getItem('feixiang-question-workbench-v3-drafts')||'[]')}catch{}
          const prevId=localStorage.getItem('feixiang-question-workbench-v3-active-draft')
          const prev=drafts.find(item=>item.id===prevId)
          const prevCount=(prev?.questions||[]).filter(q=>q.status==='confirmed').length
          sessionStorage.removeItem('feixiang-wb-suspended-draft-id')
          sessionStorage.removeItem('feixiang-wb-plus-creates-new')
          if(prevId&&prevId!==id&&prevCount>0){
            if(prev){prev.updatedAt=Date.now();drafts=[prev,...drafts.filter(item=>item.id!==prevId)];localStorage.setItem('feixiang-question-workbench-v3-drafts',JSON.stringify(drafts.slice(0,20)))}
            sessionStorage.setItem('feixiang-wb-suspended-draft-id',prevId)
          }else if(prevId!==id){
            sessionStorage.setItem('feixiang-wb-plus-creates-new','1')
          }
          localStorage.setItem('feixiang-question-workbench-v3-active-draft',id)
        }
        window.location.href='./workbench.html'
      }
      const currentComposeDraftHasUnsavedChanges=targetId=>{
        let drafts=[]
        try{drafts=JSON.parse(localStorage.getItem('feixiang-question-workbench-v3-drafts')||'[]')}catch{}
        const activeId=localStorage.getItem('feixiang-question-workbench-v3-active-draft')
        if(!activeId||activeId===targetId)return false
        const active=drafts.find(item=>item.id===activeId)
        if(!active)return false
        const savedAt=Number(active.savedAt||0)
        const updatedAt=Number(active.updatedAt||0)
        return savedAt?updatedAt>savedAt:updatedAt>Number(active.createdAt||0)
      }
      const requestEditComposePaper=id=>{
        if(!currentComposeDraftHasUnsavedChanges(id)){editComposePaper(id);return}
        const paper=papers.find(item=>item.id===id)
        panel.insertAdjacentHTML('beforeend',`<div class="kb-edit-warning-overlay" data-kb-edit-warning-overlay><div class="kb-edit-warning" role="dialog" aria-labelledby="kbEditWarningTitle"><span class="kb-edit-warning-icon">!</span><h3 id="kbEditWarningTitle">当前题单尚未保存</h3><p>直接打开“${escapeHtml(paper?.title||'该题单')}”将会丢失当前题单中未保存的编辑内容，是否继续？</p><div><button type="button" data-kb-edit-cancel>取消</button><button type="button" class="primary" data-kb-edit-confirm>直接打开</button></div></div></div>`)
        const overlay=$('[data-kb-edit-warning-overlay]',panel)
        $('[data-kb-edit-cancel]',overlay)?.addEventListener('click',()=>overlay.remove())
        $('[data-kb-edit-confirm]',overlay)?.addEventListener('click',()=>editComposePaper(id))
        overlay?.addEventListener('click',event=>{if(event.target===overlay)overlay.remove()})
      }
      const renderComposePreview=id=>{
        ensureComposeDraft(id)
        let drafts=[]
        try{drafts=JSON.parse(localStorage.getItem('feixiang-question-workbench-v3-drafts')||'[]')}catch{}
        const draft=drafts.find(item=>item.id===id)
        if(!draft)return
        const questions=(draft.questions||[]).filter(question=>question.status==='confirmed')
        panel.innerHTML=`<div class="kb-preview-page"><header class="kb-preview-top"><div class="kb-preview-path"><button type="button" data-back-compose-folder>‹</button><span>我的云盘</span><i>›</i><span>我的题单</span><i>›</i><b>${escapeHtml(draft.title||'未命名题单')}</b></div><div class="kb-preview-actions"><label><span>⌕</span><input type="search" placeholder="搜索知识库"></label><button type="button" class="edit" data-preview-edit>✎ 编辑</button><button type="button">↗ 分享</button><button type="button">↓ 下载</button></div></header><section class="kb-preview-meta"><span>DOCX · 题单</span><h1>${escapeHtml(draft.title||'未命名题单')}.docx</h1><div><em>${questions.length} 道题</em><em>更新于 ${new Date(draft.updatedAt||Date.now()).toLocaleDateString('zh-CN').replaceAll('/','.')}</em></div></section><div class="kb-document-stage"><article class="kb-document-paper"><div class="kb-doc-school">学校：____________　班级：________　姓名：________</div><h2>${escapeHtml(draft.title||'未命名题单')}</h2><p class="kb-doc-summary">${escapeHtml(draft.subject||'数学')}　共 ${questions.length} 题</p><div class="kb-doc-questions">${questions.map((question,index)=>`<section><b>${index+1}</b><div><p>${escapeHtml(question.text||`示例题 ${index+1}`)}</p>${question.options?.length?`<small>${question.options.map(option=>escapeHtml(option)).join('　')}</small>`:''}</div></section>`).join('')}</div></article></div></div>`
        $('[data-back-compose-folder]',panel)?.addEventListener('click',renderComposeFolder)
        $('[data-preview-edit]',panel)?.addEventListener('click',()=>requestEditComposePaper(id))
      }
      $$('[data-open-compose-paper]',panel).forEach(button=>button.addEventListener('click',()=>{
        const id=button.dataset.openComposePaper
        renderComposePreview(id)
      }))
      $$('[data-edit-compose-paper]',panel).forEach(button=>button.addEventListener('click',()=>{
        requestEditComposePaper(button.dataset.editComposePaper)
      }))
      $$('[data-delete-compose-paper]',panel).forEach(button=>button.addEventListener('click',()=>{
        const id=button.dataset.deleteComposePaper
        let drafts=[]
        try{drafts=JSON.parse(localStorage.getItem('feixiang-question-workbench-v3-drafts')||'[]')}catch{}
        localStorage.setItem('feixiang-question-workbench-v3-drafts',JSON.stringify(drafts.filter(item=>item.id!==id)))
        let deleted=[]
        try{deleted=JSON.parse(localStorage.getItem('feixiang-knowledge-deleted-compose-papers')||'[]')}catch{}
        if(!deleted.includes(id))deleted.push(id)
        localStorage.setItem('feixiang-knowledge-deleted-compose-papers',JSON.stringify(deleted))
        renderComposeFolder()
      }))
    }
    renderCloud()
  }
  function renderSkillLibraryCards(){
    const grid=$('#skillLibraryGrid')
    if(!grid)return
    const favorites=readTeachingFavorites()
    const filtered=orderedTeachingSkills().filter(skill=>(libraryMode!=='favorites'||favorites.includes(skill.name))&&(libraryCategory==='全部'||skill.category===libraryCategory)&&(!libraryQuery||`${skill.name}${skill.description}`.toLowerCase().includes(libraryQuery.toLowerCase())))
    grid.innerHTML=filtered.length?filtered.map(skill=>teachingSkillCardMarkup(skill,true)).join(''):'<div class="skill-library-empty"><b>没有找到匹配的教学技能</b><span>试试其他关键词或筛选条件</span></div>'
    $$('[data-open-skill]',grid).forEach(button=>button.addEventListener('click',()=>openTeachingSkill(button.dataset.openSkill)))
    bindTeachingFavoriteButtons(grid)
  }
  function showTeachingSkillsPage(){
    window.FxPracticeDemo?.resetPaperState?.()
    stopPlayback();setActiveTask('teachingSkillsEntry')
    $('#teachingSkillsEntry').classList.add('active')
    openFiles=[];activeFile=null;renderPreview()
    const view=$('#conversationView')
    view.classList.remove('skill-library-screen','has-home-cases','home-compose-focus')
    view.classList.add('home-screen','teaching-skills-screen')
    skillRow.innerHTML=''
    attachmentRow.innerHTML=''
    clearPendingAttachments()
    composerInput.value=''
    composerInput.placeholder='描述你要完成的教学任务'
    syncSendReady()
    const featured=teachingSkills.slice(0,4)
    messageColumn.innerHTML=`<div class="teaching-skills-home"><header><h1>Joyce老师，今天想从哪项教学工作开始？</h1></header><section><div class="home-section-head"><h2>教学技能<small>为你推荐</small></h2><button type="button" class="teaching-more">更多 <span>→</span></button></div><div class="teaching-skill-grid teaching-skill-featured">${featured.map(skill=>teachingSkillCardMarkup(skill)).join('')}</div></section><section class="home-plaza teaching-plaza"><div class="plaza-tabs"><button class="active" type="button" data-plaza="resource">资源广场</button><button type="button" data-plaza="app">应用广场</button></div><div class="plaza-grid" id="plazaGrid"></div></section></div>`
    bindHomeSkillCards()
    renderPlaza('resource')
    $$('[data-plaza]',messageColumn).forEach(button=>button.addEventListener('click',()=>{$$('[data-plaza]',messageColumn).forEach(item=>item.classList.toggle('active',item===button));renderPlaza(button.dataset.plaza)}))
    syncComposerReserve()
  }
  function showSimpleTask(id) {
    window.FxPracticeDemo?.resetPaperState?.()
    stopPlayback(); setActiveTask(id)
    $('#conversationView').classList.remove('home-screen')
    const copy = taskCopy[id]
    $('#taskHeader h1').textContent = copy[0]; $('#taskHeader span').textContent = 'demo演示 · 模拟对话'; $('#replayButton').hidden = true
    messageColumn.innerHTML = `<div class="user-message">${escapeHtml(copy[0])}</div><div class="assistant-message"><span class="assistant-mark">象</span><div><b>任务已完成</b><p>${escapeHtml(copy[1])}</p></div></div>`
  }

  function startQuestionComposition(text) {
    stopPlayback()
    $('#conversationView').classList.remove('home-screen')
    setActiveTask('question-composition')
    $('#taskHeader h1').textContent = 'AI组题命题 Demo 1'
    $('#taskHeader span').textContent = 'Demo演示 · 模拟题库与生成过程'
    $('#replayButton').hidden = true
    openFiles=[]; activeFile=null; renderPreview()
    const questions=questionCandidates.map(question=>({...question}))
    messageColumn.innerHTML=`<div class="user-message">${escapeHtml(text||questionPrompt1)}</div><div class="assistant-message"><span class="assistant-mark">象</span><div><b>正在准备候选题</b><p>我会先理解题量、知识点和难度，再检索题库并检查重复度。</p></div></div><div class="question-steps">${[['理解组题要求','七年级上册 · 有理数 · 12题 · 15分钟'],['检索优质题库','同步练习、区级优质题和高频错题'],['检查知识覆盖','正负数、数轴、绝对值和有理数运算']].map((step,index)=>`<div class="question-step"><span>${index+1}</span><span><b>${step[0]}</b><small>${step[1]}</small></span></div>`).join('')}</div><div id="questionFlow"></div>`
    const flow=$('#questionFlow',messageColumn)
    const selected=()=>questions.filter(question=>question.selected)
    const stats=level=>questions.filter(question=>question.selected&&question.difficulty===level).length
    const renderCandidates=()=>{
      $('.question-source',flow)?.remove();$('.question-generator',flow)?.remove();$('.question-review',flow)?.remove()
      flow.insertAdjacentHTML('beforeend',`<section class="question-generator"><h3>候选题已生成</h3><p>已按你的题量需求生成12道候选题，可选择、换题或继续生成变式题。</p><div class="question-summary"><span>基础 ${stats('基础')}</span><span>易错 ${stats('易错')}</span><span>中等 ${stats('中等')}</span><span>提高 ${stats('提高')}</span><strong>已选 ${selected().length}/12题</strong></div><div class="question-list">${questions.map(question=>`<article class="question-card" data-question="${question.id}" ${question.selected?'data-selected':''}><button class="question-check" data-toggle="${question.id}">${question.selected?'✓':''}</button><div><h4>${question.id}. ${escapeHtml(question.title)}</h4><div class="question-tags"><span>${question.type}</span><span>${question.knowledge}</span><span>${question.difficulty}</span><span>${question.source}</span></div></div><div class="question-card-actions"><button data-replace="${question.id}">换一道</button><button data-variant="${question.id}">生成变式</button></div></article>`).join('')}</div><div class="question-footer"><span>AI会先自动编排顺序与分值</span><button class="question-primary" data-review ${selected().length?'':'disabled'}>完成选题</button></div></section>`)
      scrollToBottom()
    }
    const renderReview=()=>{
      $('.question-generator',flow)?.remove();$('.question-review',flow)?.remove();$('.assistant-message.compact',flow)?.remove()
      const chosen=selected()
      flow.insertAdjacentHTML('beforeend',`<div class="assistant-message compact"><span class="assistant-mark">象</span><div><b>已完成默认编排</b><p>我按题型和难度排好了顺序并设置建议分值，你可以继续调整。</p></div></div><section class="question-review"><h3>题单编排与分值</h3><p>${chosen.length}题 · 建议15分钟 · 当前总分 ${chosen.reduce((sum,item)=>sum+item.score,0)}分</p><div class="question-order-list">${chosen.map((question,index)=>`<div class="question-order"><span>${index+1}</span><b>${escapeHtml(question.title)}</b><select data-score="${question.id}">${[2,3,4,5,6,8,10].map(score=>`<option value="${score}" ${score===question.score?'selected':''}>${score}分</option>`).join('')}</select><div><button data-up="${question.id}" ${index===0?'disabled':''}>↑</button><button data-down="${question.id}" ${index===chosen.length-1?'disabled':''}>↓</button></div></div>`).join('')}</div><div class="question-footer"><button class="question-secondary" data-back-candidates>返回选题</button><button class="question-primary" data-export>确认并导出</button></div></section>`)
      scrollToBottom()
    }
    const renderResult=()=>{
      if(!flow.isConnected)return
      flow.insertAdjacentHTML('beforeend',`<section class="question-result"><h3>题单与命题材料已生成</h3><p>已生成学生试卷、教师答案解析和命题说明书。点击文件后在右侧原工作台预览。</p><div class="question-files">${['qpaper','qanswers','qspec'].map(id=>{const file=files[id];return `<button class="question-file" data-question-file="${id}"><span class="file-mark ${file.className}">${file.mark}</span><span><b>${file.name}</b><small>${file.label}</small></span><em>›</em></button>`}).join('')}</div></section>`)
      scrollToBottom()
    }
    window.setTimeout(()=>{
      if(!flow.isConnected)return
      $$('.question-step>span:first-child',messageColumn).forEach(node=>node.textContent='✓')
      flow.innerHTML=`<section class="question-source"><h3>是否需要加入原创题或变式题？</h3><p>需求中没有限定题目来源，你可以选择一种组合方式。</p><div class="question-choice-row"><button data-source="bank"><b>仅从题库选题</b><small>全部使用已校验题库资源</small></button><button data-source="original"><b>加入原创题</b><small>按当前要求生成新情境题</small></button><button data-source="variant"><b>加入相似变式题</b><small>保持考点，调整数据与情境</small></button><button data-source="auto"><b>由 AI 自动搭配</b><small>题库10题＋原创1题＋变式1题</small></button></div></section>`
      scrollToBottom()
    },1100)
    flow.addEventListener('click',event=>{
      const target=event.target.closest('button');if(!target)return
      if(target.dataset.source){renderCandidates();return}
      const id=Number(target.dataset.toggle||target.dataset.replace||target.dataset.variant||target.dataset.up||target.dataset.down)
      const question=questions.find(item=>item.id===id)
      if(target.dataset.toggle&&question){question.selected=!question.selected;renderCandidates();return}
      if(target.dataset.replace&&question){question.title='在数轴上，点 A 表示 -3，且 AB=5，则点 B 表示的数可能是____。';question.source='智能换题';renderCandidates();return}
      if(target.dataset.variant&&question){question.title=question.title.replace(/-?\d+/,'-8');question.source='AI变式题';renderCandidates();return}
      if(target.dataset.review!==undefined){renderReview();return}
      if(target.dataset.backCandidates!==undefined){$('.assistant-message.compact',flow)?.remove();renderCandidates();return}
      if((target.dataset.up||target.dataset.down)&&question){const chosen=selected(),from=questions.indexOf(question),current=chosen.indexOf(question),other=chosen[current+(target.dataset.up? -1:1)];if(other){const to=questions.indexOf(other);[questions[from],questions[to]]=[questions[to],questions[from]]}renderReview();return}
      if(target.dataset.export!==undefined){$('.question-review',flow)?.remove();flow.insertAdjacentHTML('beforeend','<div class="assistant-message compact"><span class="assistant-mark">象</span><div><b>正在完成组题与导出</b><p>检查重复题与答案一致性，并生成学生版、答案解析和命题说明书。</p></div></div>');scrollToBottom();window.setTimeout(renderResult,900);return}
      if(target.dataset.questionFile){openPreview(target.dataset.questionFile)}
    })
    flow.addEventListener('change',event=>{const select=event.target.closest('[data-score]');if(!select)return;const question=questions.find(item=>item.id===Number(select.dataset.score));if(question)question.score=Number(select.value)})
    scrollToBottom()
  }

  function startQuestionWorkbenchDemo(text){
    stopPlayback();$('#conversationView').classList.remove('home-screen');setActiveTask('question-workbench')
    $('#taskHeader h1').textContent='AI组题命题 Demo 2';$('#taskHeader span').textContent='AI题库工作台 · 浏览与组题';$('#replayButton').hidden=true
    openFiles=[];activeFile=null;renderPreview();openPreview('questionWorkbench')
    messageColumn.innerHTML=`<div class="user-message">${escapeHtml(text||questionPrompt2)}</div><div class="assistant-message"><span class="assistant-mark">象</span><div><b>AI组题命题工作台已打开</b><p>你可以在右侧浏览题库、筛选题目并完成组卷。如需我协助设置知识点、题量或难度，直接告诉我即可。</p></div></div>`
    scrollToBottom()
  }

  function startAiLearningDemo(skill,text){
    stopPlayback();$('#conversationView').classList.remove('home-screen');setActiveTask(`learning-${skill}`)
    $('#taskHeader h1').textContent=skill;$('#taskHeader span').textContent='Demo演示 · 模拟数据与生成过程';$('#replayButton').hidden=true
    openFiles=[];activeFile=null;renderPreview()
    const configs={
      'AI智批':{lead:'正在读取扫描作业并识别样卷',description:'我会先整理扫描页、识别样卷结构，再开始批改；存疑作答会交给你确认。',stages:[['读取扫描作业','92页 · 六年级2班 · 数学'],['识别样卷结构','检测题目顺序、分值和答案区域'],['匹配学生作答','识别46名已提交学生与414处作答']],file:'gradeReport'},
      'AI错因诊断':{lead:'正在汇总阶段学情数据',description:'我会结合三次作业表现，区分知识性、方法性和习惯性错因，再给出可执行的干预建议。',stages:[['确认诊断范围','六年级2班 · 阶段诊断'],['关联作业数据','最近3次分数乘除法作业'],['追踪重复错误','46名学生 · 414处作答 · 3个时间点']],file:'diagnosisReport'},
      'AI个性化练习':{lead:'正在读取已确认的错因诊断',description:'我会先按首要错因分组，再为每位学生匹配基础巩固题和变式题。',stages:[['读取诊断结果','4类主要错因 · 12名重点学生'],['建立练习分组','概念、运算、建模、巩固提升'],['检查题目重复','避开最近3次作业原题']],file:'practiceReport'}
    }
    const config=configs[skill],decisions=new Map()
    messageColumn.innerHTML=`<div class="user-message">${escapeHtml(text||learningDemoPrompts[skill])}</div><div class="assistant-message"><span class="assistant-mark">象</span><div><b>${config.lead}</b><p>${config.description}</p></div></div><div class="learning-steps">${config.stages.map((stage,index)=>`<div class="learning-step"><span>${index+1}</span><span><b>${stage[0]}</b><small>${stage[1]}</small></span></div>`).join('')}</div><div id="learningFlow"></div>`
    const flow=$('#learningFlow',messageColumn)
    const finish=()=>{flow.innerHTML='<div class="assistant-message"><span class="assistant-mark">象</span><div><b>正在生成可交付文件</b><p>已完成一致性检查和教师确认，正在整理最终材料。</p></div></div>';scrollToBottom();window.setTimeout(()=>{if(!flow.isConnected)return;const file=files[config.file];flow.insertAdjacentHTML('beforeend',`<section class="learning-panel"><h3>任务已完成</h3><p>点击文件后在右侧工作台预览。</p><button class="learning-file" data-learning-file="${file.id}"><span class="file-mark pdf">D</span><span><b>${file.name}</b><small>${file.label}</small></span><em>›</em></button></section>`);scrollToBottom()},850)}
    const renderSamples=()=>{flow.innerHTML=`<section class="learning-panel"><h3>请先确认识别到的样卷</h3><p>本批共92页，识别为2种样卷版式；确认后再批量分析学生作答。</p><div class="learning-grid"><article class="learning-card selected"><header><b>A卷 · 基础练习</b><span>48页</span></header><small>作业 · 9题 · 每份2页<br>题序与答案区域识别完整</small></article><article class="learning-card selected"><header><b>B卷 · 巩固练习</b><span>44页</span></header><small>作业 · 9题 · 每份2页<br>检测到2处手写答案存疑</small></article></div><div class="learning-actions"><button class="secondary" data-adjust-samples>调整样卷</button><button class="primary" data-confirm-samples>确认无误并开始批改</button></div></section>`;scrollToBottom()}
    const renderGrading=()=>{flow.innerHTML=`<div class="assistant-message"><span class="assistant-mark">象</span><div><b>批改完成，发现2处存疑作答</b><p>其余412处作答已完成判定。请确认下面两项，再生成班级统计。</p></div></div><section class="learning-panel"><h3>教师确认</h3><div class="learning-summary"><span>46/48 已提交</span><span>整体正确率 78.6%</span><span>待确认 ${2-decisions.size}</span></div><div class="learning-review"><article><i>7</i><span><b>陈晨 · 第7题</b><small>手写识别为 3/5 · AI建议：判错</small></span><div><button data-grade="g1" data-value="ai" ${decisions.get('g1')==='ai'?'class="picked"':''}>确认AI判断</button><button data-grade="g1" data-value="correct" ${decisions.get('g1')==='correct'?'class="picked"':''}>改为正确</button></div></article><article><i>9</i><span><b>林悦 · 第9题</b><small>结果正确但遗漏单位 · AI建议：扣1分</small></span><div><button data-grade="g2" data-value="ai" ${decisions.get('g2')==='ai'?'class="picked"':''}>确认扣1分</button><button data-grade="g2" data-value="full" ${decisions.get('g2')==='full'?'class="picked"':''}>给满分</button></div></article></div><div class="learning-actions"><button class="primary" data-learning-finish ${decisions.size<2?'disabled':''}>完成确认并生成报告</button></div></section>`;scrollToBottom()}
    const renderScope=()=>{flow.innerHTML=`<section class="learning-panel"><h3>确认诊断范围</h3><p>已根据你的需求预选“班级 + 阶段 + 作业”，可以直接开始。</p><div class="learning-grid"><article class="learning-card selected"><header><b>诊断对象</b><span>班级</span></header><small>六年级2班 · 46名有作答数据的学生</small></article><article class="learning-card selected"><header><b>时间范围</b><span>阶段</span></header><small>最近3次分数乘除法作业</small></article><article class="learning-card selected"><header><b>任务类型</b><span>作业</span></header><small>基础练习、巩固练习、单元检测</small></article><article class="learning-card selected"><header><b>诊断重点</b><span>共性+个人</span></header><small>错因聚类、趋势和重点学生</small></article></div><div class="learning-actions"><button class="primary" data-run-diagnosis>开始诊断</button></div></section>`;scrollToBottom()}
    const renderClusters=()=>{flow.innerHTML=`<div class="assistant-message"><span class="assistant-mark">象</span><div><b>已形成4类主要错因</b><p>结合错误内容、重复次数和相邻步骤进行了归因，你可以调整干预方式。</p></div></div><section class="learning-panel"><h3>错因聚类</h3><div class="learning-summary"><span>46名学生</span><span>3次作业</span><span>12名重点关注</span></div><div class="learning-grid">${[['概念混淆','14人 · 30.4%','除法意义与倒数转化','全班讲评'],['计算规范','11人 · 23.9%','约分、符号和跳步','小组干预'],['关系建模','9人 · 19.6%','单位1与数量关系','小组干预'],['审题遗漏','5人 · 10.9%','漏单位或答语','个别跟进']].map(item=>`<article class="learning-card cluster selected"><header><b>${item[0]}</b><span>${item[1]}</span></header><small>${item[2]}</small><select><option>${item[3]}</option><option>调整干预方式</option></select></article>`).join('')}</div><div class="learning-actions"><button class="primary" data-learning-finish>确认归因并生成报告</button></div></section>`;scrollToBottom()}
    const renderPracticeSetup=()=>{flow.innerHTML=`<section class="learning-panel"><h3>分组与生成参数</h3><p>系统已按首要错因分为4组，题量与变式题数量可调整。</p><div class="learning-grid">${[['A组 · 概念重建','14人','倒数与除法意义 · 林悦等'],['B组 · 运算规范','11人','约分与分步计算 · 周嘉等'],['C组 · 应用建模','9人','单位1与数量关系 · 陈晨等'],['D组 · 巩固提升','12人','综合迁移与稳定提升']].map(item=>`<article class="learning-card selected"><header><b>${item[0]}</b><span>${item[1]}</span></header><small>${item[2]}</small></article>`).join('')}</div><div class="learning-controls"><label>每人题量<select><option>6题</option><option selected>8题</option><option>10题</option></select></label><label>变式题<select><option>1题</option><option selected>2题</option><option>3题</option></select></label><label>难度<select><option selected>基础为主</option><option>均衡</option><option>提高为主</option></select></label></div><div class="learning-actions"><button class="primary" data-preview-practice>生成分组预览</button></div></section>`;scrollToBottom()}
    const renderPractice=()=>{const questions=['写出3/5的倒数，并说明0为什么没有倒数。','计算：4/7 ÷ 2/3。','计算：5/6 ÷ 10。','比较：2/3 ÷ 4/5（ ）2/3。','一根绳子长3/4米，每段长1/8米，可以剪成几段？','判断并改错：7/9 ÷ 2/3 = 7/9 × 2/3。','一个数的3/5是18，求这个数。','结合线段图解释2/3 ÷ 4的意义。'];flow.innerHTML=`<div class="assistant-message"><span class="assistant-mark">象</span><div><b>练习预览已生成</b><p>下面是A组林悦的8题样例；每名学生会依据自己的首要错因获得不同题目。</p></div></div><section class="learning-panel"><h3>A组样例 · 林悦</h3><div class="learning-summary"><span>8题</span><span>建议12分钟</span><span>2道变式题</span></div><div class="learning-questions">${questions.map((q,i)=>`<div><span>${i+1}</span><b>${q}</b><em>${i>5?'变式题':'基础巩固'}</em></div>`).join('')}</div><div class="learning-actions"><button class="secondary" data-preview-practice>重新生成</button><button class="primary" data-learning-finish>确认并导出练习包</button></div></section>`;scrollToBottom()}
    window.setTimeout(()=>{if(!flow.isConnected)return;$$('.learning-step>span:first-child',messageColumn).forEach(node=>node.textContent='✓');skill==='AI智批'?renderSamples():skill==='AI错因诊断'?renderScope():renderPracticeSetup()},1100)
    flow.addEventListener('click',event=>{const target=event.target.closest('button');if(!target)return;if(target.dataset.confirmSamples!==undefined){flow.innerHTML='<div class="assistant-message"><span class="assistant-mark">象</span><div><b>正在批改46份作业</b><p>识别答案、核对步骤得分，并标记需要教师确认的作答。</p></div></div>';scrollToBottom();window.setTimeout(renderGrading,850);return}if(target.dataset.adjustSamples!==undefined){target.textContent='样卷顺序已校正';return}if(target.dataset.grade){decisions.set(target.dataset.grade,target.dataset.value);renderGrading();return}if(target.dataset.runDiagnosis!==undefined){flow.innerHTML='<div class="assistant-message"><span class="assistant-mark">象</span><div><b>正在聚类错因并追踪趋势</b><p>比对三次作业中的重复错误、步骤断点和学生变化。</p></div></div>';scrollToBottom();window.setTimeout(renderClusters,850);return}if(target.dataset.previewPractice!==undefined){renderPractice();return}if(target.dataset.learningFinish!==undefined){finish();return}if(target.dataset.learningFile){openPreview(target.dataset.learningFile)}})
    scrollToBottom()
  }

  function markerMarkup(fileId,page) { return annotations.filter(item=>item.fileId===fileId&&item.page===page).map((item,index)=>`<button class="annotation-marker" style="left:${item.x}%;top:${item.y}%" title="${escapeHtml(item.note)}">${index+1}</button>`).join('') }
  function pageImages(file) {
    return Array.from({length:file.pages},(_,index) => `<div class="annotatable" data-page="${index+1}"><img src="./assets/previews/${file.preview}/page-${index+1}.png" alt="${escapeHtml(file.name)} 第 ${index+1} 页" loading="${index > 1 ? 'lazy' : 'eager'}">${markerMarkup(file.id,index+1)}</div>`).join('')
  }
  function questionPreviewMarkup(kind){
    const chosen=questionCandidates
    if(kind==='question-paper')return `<div class="question-preview-page annotatable" data-page="1"><header><span>七年级数学 · 随堂练习</span><b>15 分钟　满分 53 分</b></header><h1>有理数随堂练习</h1><p class="question-preview-meta">姓名：________　班级：________　日期：________</p><section><h2>一、选择与填空</h2>${chosen.slice(0,6).map((q,i)=>`<p><b>${i+1}.</b> ${escapeHtml(q.title)}</p>`).join('')}<h2>二、计算与解答</h2>${chosen.slice(6).map((q,i)=>`<p><b>${i+7}.</b> ${escapeHtml(q.title)}</p>`).join('')}</section>${markerMarkup(activeFile,1)}</div>`
    if(kind==='question-answers')return `<div class="question-preview-page annotatable" data-page="1"><header><span>教师使用</span><b>答案与解析</b></header><h1>有理数随堂练习 · 答案解析</h1><section class="answer-grid">${chosen.map((q,i)=>`<article><b>第 ${i+1} 题</b><span>答案：${['-3','5','D','3','5','±4','9','-15','6','-1℃','-10','300元'][i]}</span><small>考查：${q.knowledge} · ${q.difficulty}</small></article>`).join('')}</section>${markerMarkup(activeFile,1)}</div>`
    return `<div class="question-preview-page annotatable" data-page="1"><header><span>AI组题命题</span><b>命题说明书</b></header><h1>有理数随堂练习 · 命题与质量说明</h1><div class="spec-cards"><article><b>12 题</b><span>目标题量</span></article><article><b>15 分钟</b><span>建议用时</span></article><article><b>2 题</b><span>重点易错</span></article></div><h2>命题结构</h2><table><tr><th>内容</th><th>题量</th><th>目标</th></tr><tr><td>正负数、相反数、绝对值</td><td>6</td><td>巩固基础概念</td></tr><tr><td>有理数运算</td><td>3</td><td>检查计算规范</td></tr><tr><td>数轴、情境与探究</td><td>3</td><td>迁移与综合应用</td></tr></table><h2>质量检查</h2><ul><li>知识点覆盖完整，基础题为主。</li><li>包含 2 道高频易错题，答案与题干一致。</li><li>题库题、原创题和变式题均保留来源标记。</li></ul>${markerMarkup(activeFile,1)}</div>`
  }
  function learningPreviewMarkup(kind){
    const shell=(tag,title,subtitle,kpis,body)=>`<div class="learning-preview-page annotatable" data-page="1"><header><span>${tag}</span><b>Demo模拟数据</b></header><h1>${title}</h1><p class="learning-preview-meta">${subtitle}</p><div class="learning-preview-kpis">${kpis.map(item=>`<article><b>${item[0]}</b><span>${item[1]}</span></article>`).join('')}</div>${body}${markerMarkup(activeFile,1)}</div>`
    if(kind==='learning-grading')return shell('AI智批','分数除法基础练习 - 批改与讲评报告','六年级2班 · 扫描批改 · 教师确认完成',[['46/48','已提交'],['78.6%','整体正确率'],['2','教师确认项'],['3','高频易错题']],`<h2>批改概览</h2><table><tr><th>题号</th><th>知识点</th><th>正确率</th><th>AI判断</th><th>状态</th></tr><tr><td>1</td><td>分数除法意义</td><td>91%</td><td>稳定</td><td>已完成</td></tr><tr><td>4</td><td>倒数与转化</td><td>63%</td><td>重点关注</td><td>已完成</td></tr><tr><td>7</td><td>数量关系</td><td>58%</td><td>高频错误</td><td>已确认</td></tr><tr><td>9</td><td>综合应用</td><td>52%</td><td>需讲评</td><td>已确认</td></tr></table><h2>讲评建议</h2><ul><li>优先讲解除以分数转乘倒数的算理。</li><li>对9名单位1判断错误学生进行小组干预。</li><li>次日回收订正结果并重新统计。</li></ul>`)
    if(kind==='learning-diagnosis')return shell('AI错因诊断','分数乘除法 - 阶段错因诊断','六年级2班 · 最近3次作业 · 46名学生',[['3','诊断任务'],['46','覆盖学生'],['4','主要错因'],['12','重点关注']],`<h2>错因聚类</h2><table><tr><th>错因</th><th>人数</th><th>占比</th><th>主要表现</th></tr><tr><td>概念混淆</td><td>14</td><td>30.4%</td><td>除法意义与倒数转化</td></tr><tr><td>计算规范</td><td>11</td><td>23.9%</td><td>约分、符号和跳步</td></tr><tr><td>关系建模</td><td>9</td><td>19.6%</td><td>单位1与数量关系</td></tr><tr><td>审题遗漏</td><td>5</td><td>10.9%</td><td>漏单位或答语</td></tr></table><h2>阶段结论</h2><ul><li>概念混淆从19人下降到14人，但仍是首要问题。</li><li>7名学生连续两次出现同类错误。</li><li>建议按概念、运算、建模三类组织10分钟微练习。</li></ul>`)
    return shell('AI个性化练习','分数乘除法 - 个性化练习包','六年级2班 · 每人8题 · 依据阶段错因生成',[['46','学生'],['4','练习分组'],['8','每人题量'],['2','每人变式题']],`<h2>分组方案</h2><table><tr><th>分组</th><th>人数</th><th>训练重点</th><th>难度结构</th></tr><tr><td>A 概念重建</td><td>14</td><td>倒数与除法意义</td><td>6基础+2中等</td></tr><tr><td>B 运算规范</td><td>11</td><td>约分与分步计算</td><td>5基础+3中等</td></tr><tr><td>C 应用建模</td><td>9</td><td>单位1与数量关系</td><td>4基础+4中等</td></tr><tr><td>D 巩固提升</td><td>12</td><td>综合迁移</td><td>3基础+3中等+2提高</td></tr></table><h2>林悦练习样例</h2><ol><li>写出3/5的倒数，并说明0为什么没有倒数。</li><li>计算：4/7 ÷ 2/3。</li><li>判断并改错：7/9 ÷ 2/3 = 7/9 × 2/3。</li><li>变式：一个数的3/5是18，求这个数。</li></ol>`)
  }
  function syncAnnotationReference(){
    const existing = $('[data-annotation-reference]', attachmentRow)
    existing?.remove()
    if (!annotations.length) return
    const chip = document.createElement('span')
    chip.className = 'context-chip annotation-reference'
    chip.dataset.annotationReference = 'true'
    chip.title = annotations.map((item, index) => `${index + 1}. ${item.note}`).join('\n')
    chip.innerHTML = `▣ ${annotations.length} 条注释 <button aria-label="移除全部注释">×</button>`
    $('button', chip).addEventListener('click', () => {
      annotations.length = 0
      syncAnnotationReference()
      renderPreview()
    })
    attachmentRow.prepend(chip)
  }
  function bindAnnotationTargets(){
    $$('.annotatable',previewBody).forEach(target=>target.addEventListener('click',event=>{if(!annotationMode||event.target.closest('.annotation-marker,.annotation-editor'))return;const rect=target.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width*100,y=(event.clientY-rect.top)/rect.height*100;$('.annotation-editor',previewBody)?.remove();const editor=document.createElement('form');editor.className='annotation-editor';editor.style.left=`${Math.min(72,Math.max(2,x))}%`;editor.style.top=`${Math.min(82,Math.max(2,y))}%`;editor.innerHTML='<textarea autofocus placeholder="描述更改或提出问题"></textarea><button type="submit">保存</button><button type="button" data-cancel>×</button>';target.appendChild(editor);$('textarea',editor).focus();$('[data-cancel]',editor).addEventListener('click',e=>{e.stopPropagation();editor.remove()});editor.addEventListener('submit',e=>{e.preventDefault();e.stopPropagation();const note=$('textarea',editor).value.trim();if(!note)return;annotations.push({fileId:activeFile,page:Number(target.dataset.page),x,y,note});syncAnnotationReference();renderPreview()})}))
  }

  function renderPreview() {
    if (!activeFile || !openFiles.length) {
      appShell.classList.remove('preview-open')
      previewPane.classList.remove('preview-pane--sheet', 'preview-pane--courseware')
      return
    }
    const file = files[activeFile]
    appShell.classList.add('preview-open')
    previewTabs.innerHTML = openFiles.map(id => { const item=files[id]; return `<button class="preview-tab ${id===activeFile?'active':''}" data-tab="${id}"><span class="file-mark ${item.className}" style="width:19px;height:22px;font-size:8px">${item.mark}</span><span class="tab-name">${item.name}</span><span class="tab-close" data-close-tab="${id}">×</span></button>` }).join('')
    downloadButton.href = file.url; downloadButton.download = file.name
    openButton.href = file.url; openButton.target = '_blank'
    const externalPreview=file.preview==='external-question-workbench'
    const practicePreview=window.FxPracticeDemo?.isPracticePreview(file.preview)
    const isSheetPreview = file.preview === 'practice-sheet'
    const isCoursewarePreview = file.preview === 'practice-courseware'
    previewBody.classList.toggle('external-preview',externalPreview)
    previewBody.classList.toggle('practice-preview',practicePreview)
    previewPane.classList.toggle('preview-pane--sheet', isSheetPreview)
    previewPane.classList.toggle('preview-pane--courseware', isCoursewarePreview)
    previewPane.classList.toggle('preview-pane--multi', openFiles.length > 1)
    downloadButton.hidden = externalPreview || isSheetPreview
    annotateButton.hidden = externalPreview || isSheetPreview || isCoursewarePreview
    zoomButton.hidden = externalPreview || isSheetPreview || isCoursewarePreview
    openButton.hidden = isSheetPreview
    zoom = 100
    if (zoomLabel) zoomLabel.textContent = '100%'
    zoomButton.title = '100%'
    previewBody.style.zoom = '1'
    annotateButton.classList.toggle('is-active', annotationMode)
    annotateButton.setAttribute('aria-pressed', String(annotationMode))
    annotateButton.title = annotationMode ? '退出注释' : '注释'
    if (externalPreview) {
      previewBody.innerHTML = `<iframe class="external-workbench-frame" src="${file.url}" title="AI题库 Demo"></iframe>`
    } else if (file.id === 'ppt') {
      previewBody.innerHTML = `<div class="ppt-layout"><div class="slide-thumbs">${Array.from({length:file.pages},(_,index)=>`<button class="slide-thumb ${index+1===activeSlide?'active':''}" data-slide="${index+1}"><img src="./assets/previews/ppt/slide-${index+1}.png" alt="第 ${index+1} 页"></button>`).join('')}</div><div class="slide-canvas"><div class="annotatable" data-page="${activeSlide}"><img id="activeSlideImage" src="./assets/previews/ppt/slide-${activeSlide}.png" alt="${escapeHtml(file.name)} 第 ${activeSlide} 页">${markerMarkup(file.id,activeSlide)}</div></div></div>`
      $$('[data-slide]', previewBody).forEach(button => button.addEventListener('click', () => { activeSlide=Number(button.dataset.slide); renderPreview() }))
    } else if (file.preview.startsWith('question-')) {
      previewBody.innerHTML = `<div class="page-stack">${questionPreviewMarkup(file.preview)}</div>`
    } else if (file.preview.startsWith('learning-')) {
      previewBody.innerHTML = `<div class="page-stack">${learningPreviewMarkup(file.preview)}</div>`
    } else if (window.FxPracticeDemo?.isPracticePreview(file.preview)) {
      previewBody.innerHTML = ''
      window.FxPracticeDemo.renderPreviewKind(file.preview, previewBody)
    } else {
      previewBody.innerHTML = `<div class="page-stack">${pageImages(file)}</div>`
    }
    bindAnnotationTargets()
    $$('[data-tab]', previewTabs).forEach(tab => tab.addEventListener('click', event => {
      const close = event.target.closest('[data-close-tab]')
      if (close) { event.stopPropagation(); closePreviewTab(close.dataset.closeTab) }
      else { activeFile = tab.dataset.tab; activeSlide = 1; renderPreview(); syncComposerSkillToPreview(activeFile) }
    }))
  }

  function openPreview(id) {
    if (!files[id]) return
    if (!openFiles.includes(id)) openFiles.push(id)
    activeFile = id; activeSlide = 1; renderPreview()
    syncComposerSkillToPreview(id)
  }

  // 一个任务里可能有两个成果（互动课件 + 配套题单）。下面这组函数负责：
  // 让 composer 的两个技能 chip 一亮一灰，并跟随右侧当前打开的成果切换「正在编辑谁」。
  const ARTIFACT_SKILLS = ['组题', '互动课件']
  const SKILL_PREVIEW_FILE = { 组题: 'practiceSheet', 互动课件: 'courseware' }
  const PREVIEW_FILE_SKILL = { practiceSheet: '组题', courseware: '互动课件' }
  const SKILL_PLACEHOLDER = {
    组题: '例如：第 3 题太难了换一道；再加两道表面积易错题',
    互动课件: '继续修改这份课件，例如：把导入换成生活情境',
  }

  function artifactSkillChips() {
    return $$('[data-context]', skillRow).filter((node) => ARTIFACT_SKILLS.includes(node.dataset.context))
  }

  function isDualArtifact() {
    const chips = artifactSkillChips()
    return chips.some((c) => c.dataset.context === '组题') && chips.some((c) => c.dataset.context === '互动课件')
  }

  function setActiveSkillChip(label) {
    const chips = artifactSkillChips()
    if (chips.length < 2) {
      chips.forEach((c) => {
        c.classList.remove('skill-chip--active', 'skill-chip--dim')
        if (chips.length === 1 && c.dataset.context === label) c.classList.add('skill-chip--active')
      })
      renderAddMenu()
      return
    }
    chips.forEach((chip) => {
      const active = chip.dataset.context === label
      chip.classList.toggle('skill-chip--active', active)
      chip.classList.toggle('skill-chip--dim', !active)
    })
    renderAddMenu()
  }

  function syncComposerSkillToPreview(fileId) {
    const skill = PREVIEW_FILE_SKILL[fileId]
    if (!skill) return
    setActiveSkillChip(skill)
    if (isDualArtifact() && SKILL_PLACEHOLDER[skill]) composerInput.placeholder = SKILL_PLACEHOLDER[skill]
  }
  function closePreviewTab(id) {
    const index = openFiles.indexOf(id)
    openFiles = openFiles.filter(item => item !== id)
    if (activeFile === id) activeFile = openFiles[Math.max(0,index-1)] || openFiles[0] || null
    renderPreview()
  }

  function positionPopover(menu, anchor, align = 'left') {
    const rect = anchor.getBoundingClientRect(); menu.hidden = false
    const width = menu.offsetWidth
    menu.style.left = `${align === 'right' ? Math.max(8,rect.right-width) : Math.min(rect.left,window.innerWidth-width-8)}px`
    menu.style.top = `${Math.max(8,rect.top-menu.offsetHeight-7)}px`
  }
  function closePopovers(except) { $$('.popover').forEach(menu => { if (menu !== except) menu.hidden = true }) }

  function activateSkill(skill){
    if(skill==='组题'){
      $$('[data-home-skill-context]',skillRow).forEach(node=>node.remove())
      addContext(skill,true)
      composerInput.placeholder=COMPOSE_PLACEHOLDER
      composerInput.value=teachingSkillPrompts['组题']
      $('#conversationView').classList.remove('has-home-cases')
      $('#homeCases')?.setAttribute('hidden','')
      syncSendReady()
      syncHomeComposeFocus()
      composerInput.focus()
      addMenu.hidden=true
      return
    }
    $$('[data-home-skill-context]',skillRow).forEach(node=>node.remove())
    addContext(skill,true)
    renderHomeCases(skill)
    const preset=teachingSkillPrompts[skill]||(skill==='AI组题命题 Demo 1'?questionPrompt1:skill==='AI组题命题 Demo 2'?questionPrompt2:learningDemoPrompts[skill])
    composerInput.placeholder='描述你要完成的教学任务'
    if(preset){composerInput.value=preset;syncSendReady();composerInput.focus()}
    addMenu.hidden=true
  }

  const addMenu = $('#addMenu')
  function renderAddMenu() {
    syncAddButtonForSkill()
    if ($('#addButton')?.hidden) {
      addMenu.innerHTML = ''
      addMenu.hidden = true
      return
    }
    const composeActive = shouldShowComposeAddMenu()
    const sourceButtons = composeActive
      ? `<button data-add-question-source><span class="menu-icon">▤</span><span><b>从题库中添加</b><small>按教材章节或知识点选题</small></span></button><button data-add-knowledge-source><span class="menu-icon">▱</span><span><b>从知识库添加</b><small>复用已有练习、试卷和个人资料</small></span></button><button data-add-file><span class="menu-icon">↥</span><span><b>上传文件</b><small>Word、PDF、图片或文件夹</small></span></button>`
      : `<button data-add-file><span class="menu-icon">↥</span><span><b>上传文件</b><small>Word、PDF、图片或文件夹</small></span></button><button data-add-question-source><span class="menu-icon">▤</span><span><b>从题库中添加</b><small>按教材章节或知识点选题</small></span></button><button data-add-knowledge-source><span class="menu-icon">▱</span><span><b>从知识库添加</b><small>复用已有练习、试卷和个人资料</small></span></button>`
    const skillsSection = composeActive
      ? ''
      : `<div class="menu-section-title">教学技能</div>${teachingSkills.map(skill=>`<button data-add-skill="${escapeHtml(skill.name)}"><span class="menu-icon">✦</span><span><b>${escapeHtml(skill.name === '组题' ? 'AI组题' : skill.name)}</b><small>${escapeHtml(skill.description)}</small></span></button>`).join('')}`
    addMenu.innerHTML = composeActive
      ? `<div class="add-menu-body add-menu-body--compose">${sourceButtons}</div>`
      : `<div class="menu-title">添加</div><label class="menu-search"><span>⌕</span><input type="search" placeholder="搜索…"></label><div class="menu-section-title">资料来源</div>${sourceButtons}${skillsSection}`
    bindAddMenuEvents()
  }
  function bindAddMenuEvents() {
    $('[data-add-file]',addMenu)?.addEventListener('click', () => { addMenu.hidden=true; getComposerUploadInput().click() })
    $('[data-add-question-source]',addMenu)?.addEventListener('click', () => { addMenu.hidden=true; openQuestionPicker() })
    $('[data-add-knowledge-source]',addMenu)?.addEventListener('click', () => { addMenu.hidden=true; openQuestionPicker('knowledge') })
    $$('[data-add-skill]',addMenu).forEach(button=>button.addEventListener('click',()=>activateSkill(button.dataset.addSkill)))
    $('.menu-search input',addMenu)?.addEventListener('input',event=>{
      const query=event.target.value.trim().toLowerCase()
      $$('button',addMenu).forEach(button=>button.hidden=Boolean(query)&&!button.textContent.toLowerCase().includes(query))
    })
  }
  renderAddMenu()

  const questionPicker=$('#questionPicker')
  const questionPickerFrame=$('#questionPickerFrame')
  const questionPickerCount=$('#questionPickerCount')
  const questionPickerConfirm=$('#questionPickerConfirm')
  let questionPickerTimer=0
  let pickerSelectedCount=0
  window.addEventListener('message',event=>{
    if(event.source!==questionPickerFrame.contentWindow||event.data?.type!=='feixiang-question-picker-count')return
    pickerSelectedCount=Math.max(0,Number(event.data.count)||0)
    refreshQuestionPickerCount()
  })
  function selectedQuestionCount(){
    try{
      const apiCount=questionPickerFrame.contentWindow?.AiqCanvas?.keys?.().length||0
      const preview=questionPickerFrame.contentDocument?.querySelector('.ai-selected-panel')
      const keys=new Set([...(preview?.querySelectorAll('[data-selection-key]')||[])].map(node=>node.dataset.selectionKey).filter(Boolean))
      const renderedCount=keys.size||preview?.querySelectorAll('.question-item,.ai-canvas-item,.canvas-paper-item').length||0
      return Math.max(apiCount,renderedCount,pickerSelectedCount)
    }catch(error){return pickerSelectedCount}
  }
  function refreshQuestionPickerCount(){
    const count=selectedQuestionCount()
    questionPickerCount.textContent=questionPickerIntent==='knowledge'?`已选${count}项`:`已选${count}道题`
    questionPickerConfirm.disabled=!count
  }
  function collectPickerSelection(){
    try{
      const exported=questionPickerFrame.contentWindow?.AiqCanvas?.exportSelected?.()
      if(Array.isArray(exported)&&exported.length)return exported
    }catch(error){}
    return []
  }
  function clearQuestionPickerSelection(){
    try{
      const selected=questionPickerFrame.contentWindow?.AiqCanvas?.exportSelected?.()||[]
      selected.forEach(item=>questionPickerFrame.contentWindow?.AiqCanvas?.toggleQuestion?.(item))
    }catch(error){}
    pickerSelectedCount=0
    refreshQuestionPickerCount()
  }
  function openQuestionPicker(intent = 'composer'){
    questionPickerIntent = intent
    addMenu.hidden=true
    const pickerSrc=intent==='knowledge'?'./knowledge-picker.html?v=20260914knowledge1':'./question-picker.html?v=20260914picker9'
    if(!questionPickerFrame.src||!questionPickerFrame.src.endsWith(pickerSrc.replace('./','')))questionPickerFrame.src=pickerSrc
    questionPicker.classList.remove('question-picker--workbench-v2','question-picker--knowledge')
    questionPicker.classList.toggle('question-picker--knowledge',intent==='knowledge')
    $('#questionPickerTitle').textContent=intent==='knowledge'?'从知识库添加':'从题库添加'
    $('.question-picker-header p').textContent=intent==='knowledge'?'选择个人资料或题单，加入当前对话':'按教材章节或知识点选题，加入当前对话'
    questionPickerConfirm.textContent='加入对话'
    questionPicker.hidden=false
    document.body.classList.add('question-picker-open')
    clearInterval(questionPickerTimer)
    questionPickerTimer=setInterval(refreshQuestionPickerCount,400)
    questionPickerFrame.addEventListener('load',()=>refreshQuestionPickerCount(),{once:true})
  }
  function closeQuestionPicker(){
    questionPicker.hidden=true
    document.body.classList.remove('question-picker-open')
    clearInterval(questionPickerTimer)
  }
  $('#questionPickerCancel').addEventListener('click',()=>closeQuestionPicker())
  questionPickerConfirm.addEventListener('click',()=>{
    const rawSelection=collectPickerSelection()
    const count=rawSelection.length||selectedQuestionCount()
    if(!count){closeQuestionPicker();composerInput.focus();return}
    const selection=normalizePickerSelection(rawSelection,count)
    if(questionPickerIntent==='knowledge'){
      selection.forEach(item=>addAttachmentChip(item.title||item.name||'知识库资料'))
      closeQuestionPicker()
      composerInput.focus()
      return
    }
    if (questionPickerIntent === 'sheet') {
      window.FxPracticeDemo.onQuestionsPicked({ selection, count })
      closeQuestionPicker()
      composerInput.focus()
      return
    }
    setPendingQuestionSelection(selection)
    syncHomeComposeFocus()
    closeQuestionPicker()
    composerInput.focus()
  })
  function addContext(label,isHomeSkill=false) {
    if (isHomeSkill || SKILL_CONTEXTS.has(label)) {
      addSkillChip(label, isHomeSkill)
      return
    }
    if (ATTACHMENT_SOURCE_CONTEXTS.has(label)) {
      addAttachmentChip(label)
      return
    }
    addAttachmentChip(label)
  }

  function setQuestionFocus(index) {
    $$('[data-question-focus]', document).forEach(node => node.remove())
    if (!index) { syncComposerReserve(); return }
    const chip = document.createElement('span')
    chip.className = 'context-chip question-focus'
    chip.dataset.questionFocus = String(index)
    chip.innerHTML = `第 ${index} 题 <button aria-label="取消选中题目">×</button>`
    $('button', chip).addEventListener('click', () => {
      chip.remove()
      window.FxPracticeDemo?.clearQuestionFocus?.()
      syncComposerReserve()
    })
    const composeSkill = skillRow.querySelector('[data-context="组题"]')
    if (composeSkill?.nextSibling) {
      skillRow.insertBefore(chip, composeSkill.nextSibling)
    } else {
      skillRow.appendChild(chip)
    }
    syncComposerReserve()
  }

  function showPaperHints(markup) {
    let row = $('#paperHintRow')
    if (!row) {
      row = document.createElement('div')
      row.id = 'paperHintRow'
      row.className = 'paper-hint-row'
      row.innerHTML = '<span class="paper-hint-label">提示</span><div class="paper-hint-list"></div>'
      const inlineRow = $('.composer-inline-row')
      inlineRow?.insertAdjacentElement('afterend', row)
    }
    const list = $('.paper-hint-list', row)
    if (list) list.innerHTML = markup
    row.hidden = false
    syncComposerReserve()
  }

  function hidePaperHints() {
    $('#paperHintRow')?.remove()
    syncComposerReserve()
  }

  const modes = [['⚡','快速模式','适合问答、整理和简单修改'],['◉','均衡模式','适合一般教学与办公任务'],['✦','深度模式','适合复杂分析与多文件处理']]
  const modeMenu = $('#modeMenu')
  modeMenu.innerHTML = `<div>选择任务模式</div>${modes.map(mode=>`<button data-mode="${mode[1]}"><span class="menu-icon">${mode[0]}</span><span><b>${mode[1]}</b><small>${mode[2]}</small></span></button>`).join('')}`
  $$('[data-mode]',modeMenu).forEach(button=>button.addEventListener('click',()=>{ $('#modeButton').textContent=`${$('b',button).previousElementSibling?'◉':'◉'} ${button.dataset.mode}⌄`; modeMenu.hidden=true }))

  $('#addButton').addEventListener('click',event=>{
    if($('#addButton').hidden)return
    event.stopPropagation()
    renderAddMenu()
    if(!addMenu.innerHTML.trim())return
    if(!addMenu.hidden){addMenu.hidden=true;return}
    closePopovers(addMenu)
    positionPopover(addMenu,$('#addButton'))
  })
  $('#modeButton').addEventListener('click',event=>{event.stopPropagation();closePopovers(modeMenu);positionPopover(modeMenu,$('#modeButton'),'right')})
  $('#accountTrigger').addEventListener('click',event=>{event.stopPropagation();const menu=$('#accountMenu'),wasOpen=!menu.hidden;closePopovers();if(!wasOpen)positionPopover(menu,$('#accountTrigger'))})
  document.addEventListener('click',event=>{if(!event.target.closest('.popover'))closePopovers()})
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closePopovers();$('.practice-case-overlay')?.remove();$('.skill-detail-overlay')?.remove()}})

  $('#replayButton').addEventListener('click',()=>{
    const activeTask=$('.task-item.active')?.dataset.task
    if(activeTask==='courseware-demo')window.FxPracticeDemo?.startCoursewareDemo(false)
    else startMeetingPlayback(false)
  })
  $('#newTaskButton').addEventListener('click',showBlankTask)
  $$('[data-composer-skill]').forEach(button=>button.addEventListener('click',()=>activateSkill(button.dataset.composerSkill)))
  // 双成果任务下，点击被置灰的技能 chip = 切到它对应的成果，并把「正在编辑」交给它。
  skillRow.addEventListener('click',event=>{
    if(event.target.closest('button'))return
    const chip=event.target.closest('[data-context]')
    if(!chip||!ARTIFACT_SKILLS.includes(chip.dataset.context)||!isDualArtifact())return
    const fileId=SKILL_PREVIEW_FILE[chip.dataset.context]
    if(fileId&&files[fileId]){openPreview(fileId);syncComposerSkillToPreview(fileId)}
    else setActiveSkillChip(chip.dataset.context)
  })
  $('#knowledgeEntry').addEventListener('click',showKnowledgeBase)
  $('#teachingSkillsEntry').addEventListener('click',showTeachingSkillsPage)
  window.addEventListener('fx-question-workbench-v3-exit',showBlankTask)
  const workbenchHash=location.hash.replace('#','')
  if(workbenchHash==='workbench'||workbenchHash==='workbench-v3')openQuestionWorkbenchPage()
  $$('.task-item,.recent-demo').forEach(item=>item.addEventListener('click',()=>{const id=item.dataset.task;if(id==='meeting')startMeetingPlayback(false);else if(id==='courseware-demo')window.FxPracticeDemo?.startCoursewareDemo(false);else if(id==='blank')showBlankTask();else showSimpleTask(id)}))
  composerInput.addEventListener('input',()=>{
    syncSendReady()
    syncComposerReserve()
  })
  sendButton.addEventListener('click',()=>{
    const text=composerInput.value.trim()
    const pending=getPendingAttachments()
    if(!text && !pending.selection.length && !pending.fileName && !pending.contextFile)return
    const demoSkills=$$('[data-context]',skillRow).map(node=>node.dataset.context).filter(skill=>skill==='组题'||skill==='互动课件'||skill==='AI组题命题 Demo 1'||skill==='AI组题命题 Demo 2'||learningDemoPrompts[skill])
    let activeDemoSkill=demoSkills[demoSkills.length-1]
    const activeSkillChip=$$('[data-context]',skillRow).find(node=>node.classList.contains('skill-chip--active'))
    // 发送跟输入框里高亮的技能走；带着课件上下文组练习时一定走组题。
    if(pending.contextFile){
      activeDemoSkill='组题'
    }else if(activeSkillChip&&['组题','互动课件'].includes(activeSkillChip.dataset.context)){
      activeDemoSkill=activeSkillChip.dataset.context
    }else{
      const editingSkill=getActiveEditingSkill()
      if(editingSkill)activeDemoSkill=editingSkill
      else if(activeSkillChip)activeDemoSkill=activeSkillChip.dataset.context
    }
    if(activeDemoSkill==='组题'){
      if(!text && !pending.selection.length && !pending.fileName && !pending.contextFile)return
      composerInput.value=''
      sendButton.classList.remove('ready')
      sendButton.disabled=true
      if(pending.selection.length || pending.fileName || pending.contextFile){
        window.FxPracticeDemo?.startComposeWithAttachments({ text, ...pending })
        clearPendingAttachments()
        return
      }
      if(window.FxPracticeDemo?.isComposeEntry?.()){
        window.FxPracticeDemo.startPaperComposition(text)
        return
      }
      if(window.FxPracticeDemo?.hasActivePaper() && window.FxPracticeDemo.handleComposer(text)){
        return
      }
      window.FxPracticeDemo?.startPaperComposition(text)
      return
    }
    if(!text)return
    if(activeDemoSkill==='互动课件'){
      composerInput.value='';sendButton.classList.remove('ready')
      if(isDualArtifact())window.FxPracticeDemo?.applyCoursewareEdit?.(text)
      else window.FxPracticeDemo?.startCoursewareDemo(false,false,text,true)
      return
    }
    if (window.FxPracticeDemo?.hasActivePaper() && window.FxPracticeDemo.handleComposer(text)) {
      composerInput.value='';sendButton.classList.remove('ready');return
    }
    if(activeDemoSkill==='AI组题命题 Demo 1'){composerInput.value='';sendButton.classList.remove('ready');startQuestionComposition(text);return}
    if(activeDemoSkill==='AI组题命题 Demo 2'){composerInput.value='';sendButton.classList.remove('ready');startQuestionWorkbenchDemo(text);return}
    if(learningDemoPrompts[activeDemoSkill]){composerInput.value='';sendButton.classList.remove('ready');startAiLearningDemo(activeDemoSkill,text);return}
    messageColumn.insertAdjacentHTML('beforeend',`<div class="user-message">${escapeHtml(text)}</div><div class="assistant-message"><span class="assistant-mark">象</span><div><b>这是网页模拟演示</b><p>已收到你的要求。可继续体验界面交互；真实生成能力请使用飞象老师本地端。</p></div></div>`)
    composerInput.value='';sendButton.classList.remove('ready');scrollToBottom()
  })
  composerInput.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendButton.click()}})
  $('#closePreview').addEventListener('click',()=>{openFiles=[];activeFile=null;renderPreview()})
  $('#annotateButton').addEventListener('click',()=>{annotationMode=!annotationMode;renderPreview()})
  $('#zoomButton').addEventListener('click',()=>{zoom=zoom===100?125:zoom===125?75:100;previewBody.style.zoom=String(zoom/100);if(zoomLabel)zoomLabel.textContent=`${zoom}%`;zoomButton.title=`${zoom}%`})
  window.addEventListener('resize',closePopovers)

  window.FxPracticeDemo?.init({
    $,
    $$,
    escapeHtml,
    scrollToBottom,
    stopPlayback,
    setActiveTask,
    openPreview,
    renderPreviewBase: renderPreview,
    resetPreview() {
      openFiles = []
      activeFile = null
      renderPreview()
    },
    renderPracticePreview() {
      if (!openFiles.includes('practiceSheet')) openFiles.push('practiceSheet')
      activeFile = 'practiceSheet'
      renderPreview()
    },
    setSheetMeta(name, label) {
      files.practiceSheet.name = name
      files.practiceSheet.label = label
    },
    openQuestionPicker,
    addContext,
    addSkillChip,
    addAttachmentChip,
    clearComposerContext,
    setQuestionFocus,
    showPaperHints,
    hidePaperHints,
    getPendingAttachments,
    clearPendingAttachments,
    setPendingContextFile,
    setActiveSkillChip,
    syncComposerSkillToPreview,
    renderAddMenu,
    showBlankTask,
    sendButton,
    messageColumn,
    conversationView: $('#conversationView'),
    taskHeader: $('#taskHeader'),
    replayButton: $('#replayButton'),
    composerInput,
    skillRow,
    attachmentRow,
    composerAttachmentsRowTop,
    composerAttachmentsRowActions,
  })

  showBlankTask()
  syncComposerReserve()
  window.addEventListener('resize', syncComposerReserve)
  if (composerWrap && 'ResizeObserver' in window) {
    new ResizeObserver(syncComposerReserve).observe(composerWrap)
  }
  composerWrap?.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-hint-command]')
    if (!chip) return
    composerInput.value = chip.dataset.hintCommand
    syncSendReady()
    composerInput.focus()
  })
  messageColumn?.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-hint-command]')
    if (!chip || chip.closest('.composer-wrap')) return
    composerInput.value = chip.dataset.hintCommand
    syncSendReady()
    composerInput.focus()
  })
})()
