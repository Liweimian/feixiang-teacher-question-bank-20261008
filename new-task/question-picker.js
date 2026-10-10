(() => {
  const TEACHER_CONTEXT_KEY = 'feixiang-question-workbench-v3-teacher-context'
  const PAGE_SIZE = 20
  const MAX_PAGES = 3
  const esc = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

  const curriculumCatalog = {
    '小学数学': { groups: [['数与运算'],['三位数乘两位数'],['因数末尾有0'],['数量关系'],['部分合作问题'],['同向追及问题'],['图形与几何'],['长方形'],['直线、射线和线段'],['线段'],['钟面上的角'],['长方体体积'],['折痕关系']], parents: { '数与运算':['三位数乘两位数','因数末尾有0'], '数量关系':['部分合作问题','同向追及问题'], '图形与几何':['长方形','直线、射线和线段','线段','钟面上的角','长方体体积','折痕关系'] } },
    '小学语文': { groups: [['语言文字积累'],['词语运用'],['病句修改'],['阅读与鉴赏'],['现代文阅读'],['表达与交流'],['习作']], parents: { '语言文字积累':['词语运用','病句修改'], '阅读与鉴赏':['现代文阅读'], '表达与交流':['习作'] } },
    '小学英语': { groups: [['语言知识'],['词汇'],['一般现在时'],['阅读'],['阅读理解'],['表达'],['书面表达']], parents: { '语言知识':['词汇','一般现在时'], '阅读':['阅读理解'], '表达':['书面表达'] } },
    '初中语文': { groups: [['古诗文阅读'],['文言文实词']], parents: { '古诗文阅读':['文言文实词'] } },
    '初中数学': { groups: [['数与式'],['有理数'],['方程与不等式'],['一元一次方程'],['图形与几何'],['三角形'],['统计与概率'],['数据分析']], parents: { '数与式':['有理数'], '方程与不等式':['一元一次方程'], '图形与几何':['三角形'], '统计与概率':['数据分析'] } },
    '初中英语': { groups: [['语法'],['一般过去时']], parents: { '语法':['一般过去时'] } },
    '初中物理': { groups: [['力学'],['力和运动']], parents: { '力学':['力和运动'] } },
    '初中化学': { groups: [['身边的化学物质'],['物质的变化']], parents: { '身边的化学物质':['物质的变化'] } },
    '初中生物': { groups: [['细胞'],['细胞的结构']], parents: { '细胞':['细胞的结构'] } },
    '高中语文': { groups: [['文学鉴赏'],['古代诗歌鉴赏']], parents: { '文学鉴赏':['古代诗歌鉴赏'] } },
    '高中数学': { groups: [['预备知识'],['集合'],['函数'],['函数性质'],['几何'],['立体几何'],['统计与概率'],['概率统计']], parents: { '预备知识':['集合'], '函数':['函数性质'], '几何':['立体几何'], '统计与概率':['概率统计'] } },
    '高中英语': { groups: [['语法'],['非谓语动词']], parents: { '语法':['非谓语动词'] } },
    '高中物理': { groups: [['力学'],['牛顿运动定律']], parents: { '力学':['牛顿运动定律'] } },
    '高中化学': { groups: [['化学反应原理'],['氧化还原反应']], parents: { '化学反应原理':['氧化还原反应'] } },
    '高中生物': { groups: [['分子与细胞'],['细胞代谢']], parents: { '分子与细胞':['细胞代谢'] } },
    '高中历史': { groups: [['中国古代史'],['秦汉时期']], parents: { '中国古代史':['秦汉时期'] } },
    '高中地理': { groups: [['自然地理'],['地貌']], parents: { '自然地理':['地貌'] } },
    '高中政治': { groups: [['经济生活'],['市场经济']], parents: { '经济生活':['市场经济'] } },
  }

  const PRIMARY_VOLUME_LABELS = ['一年级上册','一年级下册','二年级上册','二年级下册','三年级上册','三年级下册','四年级上册','四年级下册','五年级上册','五年级下册','六年级上册','六年级下册']
  const JUNIOR_VOLUME_LABELS = ['七年级上册','七年级下册','八年级上册','八年级下册','九年级上册','九年级下册']
  const SENIOR_VOLUME_LABELS = ['必修第一册','必修第二册','选择性必修第一册','选择性必修第二册']
  const withYearVolumes = (labels, years = [2024, 2019]) => labels.flatMap(label => years.map(year => ({ label, year, isNew: year === 2024 })))
  const textbookBook = (edition, volume, year, editionNames, volumeLabels) => ({
    edition, volume, year,
    editions: editionNames.map(name => ({ name, volumes: withYearVolumes(volumeLabels) })),
  })
  const textbookCatalog = {
    '小学数学': textbookBook('人教版','四年级上册',2024,['人教版','北师大版','苏教版','沪教版','浙教版','北京版'], PRIMARY_VOLUME_LABELS),
    '小学语文': textbookBook('部编版','五年级上册',2024,['部编版','人教版','苏教版'], PRIMARY_VOLUME_LABELS),
    '小学英语': textbookBook('人教PEP','五年级上册',2024,['人教PEP','外研版','译林版'], PRIMARY_VOLUME_LABELS),
    '初中语文': textbookBook('部编版','八年级上册',2024,['部编版','人教版'], JUNIOR_VOLUME_LABELS),
    '初中数学': textbookBook('人教版','七年级上册',2024,['人教版','北师大版','沪教版','浙教版','北京版','苏科版','华东师大版','沪教版(五四制)'], JUNIOR_VOLUME_LABELS),
    '初中英语': textbookBook('人教版','八年级上册',2024,['人教版','外研版'], JUNIOR_VOLUME_LABELS),
    '初中物理': textbookBook('人教版','八年级上册',2024,['人教版','沪科版','苏科版'], ['八年级上册','八年级下册','九年级上册','九年级下册']),
    '初中化学': textbookBook('人教版','九年级上册',2024,['人教版','沪教版'], ['九年级上册','九年级下册']),
    '初中生物': textbookBook('人教版','七年级上册',2024,['人教版','北师大版'], ['七年级上册','七年级下册','八年级上册','八年级下册']),
    '高中语文': textbookBook('统编版','必修第一册',2024,['统编版','人教版'], SENIOR_VOLUME_LABELS),
    '高中数学': textbookBook('人教A版','必修第一册',2024,['人教A版','人教B版','北师大版'], SENIOR_VOLUME_LABELS),
    '高中英语': textbookBook('人教版','必修第一册',2024,['人教版','外研版'], SENIOR_VOLUME_LABELS),
    '高中物理': textbookBook('人教版','必修第一册',2024,['人教版','粤教版'], SENIOR_VOLUME_LABELS),
    '高中化学': textbookBook('人教版','必修第一册',2024,['人教版','鲁科版','苏教版'], SENIOR_VOLUME_LABELS),
    '高中生物': textbookBook('人教版','必修第一册',2024,['人教版','北师大版'], SENIOR_VOLUME_LABELS),
    '高中历史': textbookBook('统编版','必修第一册',2024,['统编版','人教版'], SENIOR_VOLUME_LABELS),
    '高中地理': textbookBook('人教版','必修第一册',2024,['人教版','中图版'], SENIOR_VOLUME_LABELS),
    '高中政治': textbookBook('统编版','必修第一册',2024,['统编版','人教版'], SENIOR_VOLUME_LABELS),
  }

  const RENJIAO_GRADE4_UP_CHAPTERS = {
    groups: [
      ['一 万以上数的认识'],['亿以内数的认识'],['亿以上数的认识'],['数的大小比较'],['数的改写和求近似数'],['整理和复习'],['☆ 1亿有多大'],
      ['二 角的度量'],['直线、射线和角'],['角的分类'],['角的度量'],['画角'],
      ['三 多位数乘两位数'],['口算乘法'],['笔算乘法'],['速度、时间与路程'],
    ],
    parents: {
      '一 万以上数的认识': ['亿以内数的认识','亿以上数的认识','数的大小比较','数的改写和求近似数','整理和复习','☆ 1亿有多大'],
      '二 角的度量': ['直线、射线和角','角的分类','角的度量','画角'],
      '三 多位数乘两位数': ['口算乘法','笔算乘法','速度、时间与路程'],
    },
    aliases: {
      '一 万以上数的认识': [],
      '二 角的度量': ['钟面上的角','直线、射线和线段','线段'],
      '直线、射线和角': ['直线、射线和线段','线段'],
      '角的度量': ['钟面上的角'],
      '三 多位数乘两位数': ['三位数乘两位数','因数末尾有0'],
      '口算乘法': ['因数末尾有0'],
      '笔算乘法': ['三位数乘两位数'],
      '速度、时间与路程': ['同向追及问题','部分合作问题'],
    },
  }
  const chapterTreeCatalog = {
    '小学数学|人教版|四年级上册': RENJIAO_GRADE4_UP_CHAPTERS,
  }

  const templates = [
    {id:'b1',curriculum:'小学数学',type:'填空题',knowledge:'部分合作问题',difficulty:'较易',text:'用无人机喷洒农药、施肥等，可以极大地提高农业生产效率。农场给一片农田喷洒农药，一架小型无人机8小时能完成这片农田的喷洒任务。使用这架无人机喷洒1小时后，随即又调来了一架中型无人机加入到喷洒农药工作中，已知这架中型无人机每小时喷洒的农田面积是小型无人机的2倍。请你算一算，还需（　　）小时就能完成这片农田的农药喷洒工作。'},
    {id:'b2',curriculum:'小学数学',type:'填空题',knowledge:'长方形',difficulty:'较易',text:'将一张长40厘米、宽24厘米的长方形纸对折后，变成两个同样大的小长方形，小长方形的长是（　）厘米，宽是（　）厘米或长是（　）厘米，宽是（　）厘米。'},
    {id:'b3',curriculum:'小学数学',type:'选择题',knowledge:'直线、射线和线段',difficulty:'较易',text:'“有始有终”常常被用来形容一个人做事能够坚持到底，在数学上可以用这个成语来形容（　）。',options:['A. 射线','B. 直线','C. 线段','D. 以上都可以']},
    {id:'b4',curriculum:'小学数学',type:'选择题',knowledge:'线段',difficulty:'较易',text:'把一条长3厘米的线段向两端各延长3厘米，得到一条（　）。',options:['A. 直线','B. 线段','C. 射线','D. 无法确定']},
    {id:'b5',curriculum:'小学数学',type:'选择题',knowledge:'三位数乘两位数',difficulty:'较易',text:'要使256×□的积是一个四位数，□里最大可以填（　）。',options:['A. 37','B. 38','C. 39','D. 40']},
    {id:'b6',curriculum:'小学数学',type:'填空题',knowledge:'因数末尾有0',difficulty:'中等',text:'12×13×14×15×16×17×18×19×20，积的末尾有（　　）个0。'},
    {id:'b7',curriculum:'小学数学',type:'解答题',knowledge:'同向追及问题',difficulty:'中等',text:'共享单车作为一种低碳、绿色的出行方式，俨然成为市民出行的“新宠”。甲、乙两人骑共享单车环岛行，甲骑行了12分钟追上乙，那么甲的速度是多少？'},
    {id:'b8',curriculum:'小学数学',type:'选择题',knowledge:'钟面上的角',difficulty:'较易',text:'从早上6：00到早上6：30钟面上分针旋转了（　）。',options:['A. 180°','B. 90°','C. 30°','D. 60°']},
    {id:'b9',curriculum:'小学数学',type:'解答题',knowledge:'长方体体积',difficulty:'中等',text:'一个长方体盒子的底面积是4/9平方分米，高是1/2分米。长方体盒子的体积是多少立方分米？'},
    {id:'b10',curriculum:'小学数学',type:'选择题',knowledge:'折痕关系',difficulty:'较难',text:'把一张正方形纸对折两次后展开，折痕（　）。',options:['A. 相交','B. 互相平行','C. 互相垂直','D. 可能互相平行，也可能互相垂直']},
    {id:'b11',curriculum:'小学数学',type:'填空题',knowledge:'三位数乘两位数',difficulty:'中等',text:'某工厂每天生产零件 186 个，照这样计算，25 天一共生产零件____个。'},
    {id:'b12',curriculum:'小学数学',type:'选择题',knowledge:'三位数乘两位数',difficulty:'较易',text:'计算 405×32 时，其中“405×2”表示（　）。',options:['A. 2 个 405 相加','B. 20 个 405 相加','C. 405 个 2 相加','D. 405 个 20 相加']},
    {id:'b13',curriculum:'小学数学',type:'填空题',knowledge:'因数末尾有0',difficulty:'中等',text:'25×16×125，积的末尾有____个 0。'},
    {id:'b14',curriculum:'小学数学',type:'解答题',knowledge:'部分合作问题',difficulty:'中等',text:'一项工程，甲队单独做 12 天完成，乙队单独做 18 天完成。两队合作 4 天后，还剩多少工程没有完成？'},
    {id:'b15',curriculum:'小学数学',type:'填空题',knowledge:'同向追及问题',difficulty:'较易',text:'哥哥每分钟走 80 米，弟弟每分钟走 60 米。哥哥在弟弟后面 100 米处同时同向出发，____分钟后哥哥追上弟弟。'},
    {id:'b16',curriculum:'小学数学',type:'选择题',knowledge:'长方形',difficulty:'较易',text:'一个长方形的长是 8 厘米，宽是 5 厘米，它的周长是（　）厘米。',options:['A. 13','B. 26','C. 40','D. 80']},
    {id:'b17',curriculum:'小学数学',type:'填空题',knowledge:'长方形',difficulty:'中等',text:'用两根同样长的铁丝分别围成一个正方形和一个长方形，正方形边长 6 厘米，长方形长 7 厘米，长方形的宽是____厘米。'},
    {id:'b18',curriculum:'小学数学',type:'选择题',knowledge:'直线、射线和线段',difficulty:'较易',text:'下列说法正确的是（　）。',options:['A. 射线比直线短','B. 线段可以测量长度','C. 直线有两个端点','D. 射线没有端点']},
    {id:'b19',curriculum:'小学数学',type:'填空题',knowledge:'线段',difficulty:'较易',text:'过平面上一点，可以向两个方向各画一条射线，所组成的图形是____。'},
    {id:'b20',curriculum:'小学数学',type:'选择题',knowledge:'钟面上的角',difficulty:'中等',text:'下午 3 时 30 分，钟面上时针与分针所成的较小角是（　）。',options:['A. 75°','B. 90°','C. 105°','D. 120°']},
    {id:'b21',curriculum:'小学数学',type:'解答题',knowledge:'长方体体积',difficulty:'中等',text:'一个无盖长方体鱼缸，长 40 厘米、宽 25 厘米、高 30 厘米，在鱼缸内注入 15 厘米深的水，水的体积是多少立方厘米？'},
    {id:'b22',curriculum:'小学数学',type:'选择题',knowledge:'折痕关系',difficulty:'较易',text:'把一张圆形纸对折一次，折痕是（　）。',options:['A. 线段','B. 射线','C. 直线','D. 曲线']},
    {id:'b23',curriculum:'小学数学',type:'填空题',knowledge:'因数末尾有0',difficulty:'较易',text:'450×120 的积末尾有____个 0。'},
    {id:'b24',curriculum:'小学数学',type:'解答题',knowledge:'同向追及问题',difficulty:'提高',text:'环形跑道周长 400 米，小红每分钟跑 200 米，小华每分钟跑 150 米，两人从同一地点同时同向出发，至少多少分钟后小红第一次追上小华？'},
    {id:'b25',curriculum:'小学数学',type:'选择题',knowledge:'长方体体积',difficulty:'较易',text:'一个长方体木块长 10 cm、宽 4 cm、高 3 cm，它的体积是（　）cm³。',options:['A. 17','B. 34','C. 120','D. 240']},
    {id:'b26',curriculum:'小学数学',type:'填空题',knowledge:'部分合作问题',difficulty:'较易',text:'修一条路，甲队单独修 10 天完成，乙队单独修 15 天完成。两队合作，每天完成这条路的____。'},
    {id:'b27',curriculum:'小学数学',type:'选择题',knowledge:'直线、射线和线段',difficulty:'中等',text:'经过两点可以画（　）条直线。',options:['A. 1','B. 2','C. 无数','D. 0']},
    {id:'b28',curriculum:'小学数学',type:'填空题',knowledge:'线段',difficulty:'中等',text:'把 5 厘米长的线段向一端延长 100 米，得到的图形是____。'},
    {id:'b29',curriculum:'小学数学',type:'选择题',knowledge:'亿以内数的认识',difficulty:'较易',text:'10001000 读作（　）。',options:['A. 一千万零一千','B. 一千零一万','C. 一百零一万','D. 一千万一千']},
    {id:'b30',curriculum:'小学数学',type:'填空题',knowledge:'亿以内数的认识',difficulty:'较易',text:'一个数由 3 个亿、5 个万和 8 个一组成，这个数是____。'},
    {id:'b31',curriculum:'小学数学',type:'选择题',knowledge:'亿以内数的认识',difficulty:'中等',text:'在 38050000 中，数字 8 在（　）上。',options:['A. 百万位','B. 千万位','C. 万位','D. 十万位']},
    {id:'b32',curriculum:'小学数学',type:'填空题',knowledge:'亿以上数的认识',difficulty:'较易',text:'10 个一亿是____。'},
    {id:'b33',curriculum:'小学数学',type:'选择题',knowledge:'亿以上数的认识',difficulty:'较易',text:'1000000000 读作（　）。',options:['A. 一亿','B. 十亿','C. 一百亿','D. 一千亿']},
    {id:'b34',curriculum:'小学数学',type:'选择题',knowledge:'数的大小比较',difficulty:'较易',text:'下面四个数中最大的是（　）。',options:['A. 98000000','B. 100000000','C. 99999999','D. 10100000']},
    {id:'b35',curriculum:'小学数学',type:'填空题',knowledge:'数的大小比较',difficulty:'中等',text:'在○里填“>”“<”或“=”。  80990000 ○ 81000000'},
    {id:'b36',curriculum:'小学数学',type:'选择题',knowledge:'数的改写和求近似数',difficulty:'较易',text:'把 3800000 改写成用“万”作单位的数，正确的是（　）。',options:['A. 38 万','B. 380 万','C. 3800 万','D. 3.8 万']},
    {id:'b37',curriculum:'小学数学',type:'填空题',knowledge:'数的改写和求近似数',difficulty:'中等',text:'把 3846200 省略万后面的尾数，约是____万。'},
    {id:'b38',curriculum:'小学数学',type:'选择题',knowledge:'整理和复习',difficulty:'较易',text:'一个数的最高位是千万位，这个数是（　）位数。',options:['A. 7','B. 8','C. 9','D. 10']},
    {id:'b39',curriculum:'小学数学',type:'填空题',knowledge:'整理和复习',difficulty:'中等',text:'比 99990000 大 10000 的数是____。'},
    {id:'b40',curriculum:'小学数学',type:'选择题',knowledge:'☆ 1亿有多大',difficulty:'较易',text:'如果一张纸厚 0.1 毫米，1 亿张这样的纸叠起来大约高（　）。',options:['A. 10 米','B. 100 米','C. 1000 米','D. 10000 米']},
    {id:'b41',curriculum:'小学数学',type:'解答题',knowledge:'☆ 1亿有多大',difficulty:'中等',text:'体育场有 5 万人，照这样计算，大约多少个这样的体育场才能坐满 1 亿人？'},
    {id:'cn1',curriculum:'小学语文',type:'选择题',knowledge:'词语运用',difficulty:'基础',text:'下列词语使用恰当的一项是（　）。',options:['A. 津津有味','B. 迫不及待','C. 理所当然','D. 难以置信']},
    {id:'cn2',curriculum:'小学语文',type:'选择题',knowledge:'病句修改',difficulty:'中等',text:'下列句子中没有语病的一项是（　）。'},
    {id:'cn3',curriculum:'小学语文',type:'解答题',knowledge:'现代文阅读',difficulty:'中等',text:'阅读短文，概括主人公的性格特点并说明理由。'},
    {id:'cn4',curriculum:'小学语文',type:'解答题',knowledge:'习作',difficulty:'提高',text:'以“一次难忘的尝试”为题，完成一篇习作。'},
    {id:'en1',curriculum:'小学英语',type:'选择题',knowledge:'词汇',difficulty:'基础',text:'Choose the different word from the group.',options:['A. Monday','B. Tuesday','C. weekend','D. Friday']},
    {id:'en2',curriculum:'小学英语',type:'填空题',knowledge:'一般现在时',difficulty:'中等',text:'She ____ (go) to school by bus every day.'},
    {id:'en3',curriculum:'小学英语',type:'解答题',knowledge:'阅读理解',difficulty:'中等',text:'Read the passage and answer the questions.'},
    {id:'en4',curriculum:'小学英语',type:'解答题',knowledge:'书面表达',difficulty:'提高',text:'Write five sentences about your weekend.'},
    {id:'jm1',curriculum:'初中数学',type:'选择题',knowledge:'有理数',difficulty:'基础',text:'−3 的相反数是（　）。',options:['A. −3','B. 3','C. 1/3','D. −1/3']},
    {id:'jm2',curriculum:'初中数学',type:'填空题',knowledge:'一元一次方程',difficulty:'中等',text:'方程 3x−2＝10 的解为____。'},
    {id:'jm3',curriculum:'初中数学',type:'解答题',knowledge:'三角形',difficulty:'中等',text:'已知三角形两内角分别为 45°、65°，求第三个内角。'},
    {id:'jm4',curriculum:'初中数学',type:'解答题',knowledge:'数据分析',difficulty:'提高',text:'根据一组调查数据绘制统计图并分析变化趋势。'},
    {id:'hm1',curriculum:'高中数学',type:'选择题',knowledge:'集合',difficulty:'基础',text:'已知集合 A＝{1,2,3}，B＝{2,3,4}，则 A∩B＝（　）。'},
    {id:'hm2',curriculum:'高中数学',type:'填空题',knowledge:'函数性质',difficulty:'中等',text:'函数 f(x)＝x²−2x 的对称轴为____。'},
    {id:'hm3',curriculum:'高中数学',type:'解答题',knowledge:'立体几何',difficulty:'提高',text:'证明直线与平面垂直，并求相关几何量。'},
    {id:'hm4',curriculum:'高中数学',type:'解答题',knowledge:'概率统计',difficulty:'提高',text:'利用样本数据估计总体特征并说明结论。'},
    {id:'jcn1',curriculum:'初中语文',type:'选择题',knowledge:'文言文实词',difficulty:'中等',text:'下列加点词解释正确的一项是（　）。'},
    {id:'jen1',curriculum:'初中英语',type:'填空题',knowledge:'一般过去时',difficulty:'基础',text:'He ____ (visit) the museum last Sunday.'},
    {id:'jp1',curriculum:'初中物理',type:'选择题',knowledge:'力和运动',difficulty:'中等',text:'关于惯性，下列说法正确的是（　）。'},
    {id:'jc1',curriculum:'初中化学',type:'选择题',knowledge:'物质的变化',difficulty:'基础',text:'下列变化属于化学变化的是（　）。'},
    {id:'jb1',curriculum:'初中生物',type:'选择题',knowledge:'细胞的结构',difficulty:'基础',text:'植物细胞特有的结构是（　）。',options:['A. 细胞壁','B. 细胞膜','C. 细胞质','D. 细胞核']},
    {id:'hcn1',curriculum:'高中语文',type:'选择题',knowledge:'古代诗歌鉴赏',difficulty:'中等',text:'对本诗意象理解正确的一项是（　）。'},
    {id:'hen1',curriculum:'高中英语',type:'填空题',knowledge:'非谓语动词',difficulty:'中等',text:'The problem ____ (discuss) yesterday is still unsolved.'},
    {id:'hp1',curriculum:'高中物理',type:'解答题',knowledge:'牛顿运动定律',difficulty:'提高',text:'光滑水平面上质量为 m 的物块受恒力 F 作用，求加速度。'},
    {id:'hc1',curriculum:'高中化学',type:'选择题',knowledge:'氧化还原反应',difficulty:'中等',text:'下列反应中氯元素化合价升高的是（　）。'},
    {id:'hb1',curriculum:'高中生物',type:'选择题',knowledge:'细胞代谢',difficulty:'中等',text:'有氧呼吸的主要场所是（　）。',options:['A. 细胞核','B. 线粒体','C. 叶绿体','D. 核糖体']},
    {id:'hh1',curriculum:'高中历史',type:'选择题',knowledge:'中国古代史',difficulty:'中等',text:'秦统一六国后在全国推行的制度是（　）。'},
    {id:'hg1',curriculum:'高中地理',type:'选择题',knowledge:'自然地理',difficulty:'中等',text:'下列地貌类型主要由流水侵蚀作用形成的是（　）。'},
    {id:'hpol1',curriculum:'高中政治',type:'选择题',knowledge:'经济生活',difficulty:'基础',text:'市场在资源配置中起决定性作用，主要体现的是（　）。'},
  ]

  const makeVariantText = (text, offset) => offset === 0 ? text : text.replace(/\d+(?:\.\d+)?/g, value => {
    const number = Number(value)
    return Number.isFinite(number) ? String(Number.isInteger(number) ? number + offset : Number((number + offset / 10).toFixed(1))) : value
  })
  const officialQuestions = Array.from({length:60}, (_, index) => templates.map(question => ({
    ...question,
    id: `${question.id}-official-${index + 1}`,
    originId: question.id,
    text: makeVariantText(question.text, index),
  }))).flat()
  const personalQuestions = templates.map(question => ({...question, id:`${question.id}-mine`, originId: question.id}))

  const selected = new Map()
  const answersOpen = new Set()
  const adaptOpen = new Set()
  let curriculumKey = '小学数学'
  let textbookSelection = {}
  let textbookPickerOpen = false
  let textbookPickerEdition = ''
  let expandedChapterParents = new Set()
  let browseMode = 'chapter'
  let knowledge = ''
  let currentSource = 'official'
  let currentPage = 1
  let moreUnlocked = false
  let unlockPromptOpen = false

  const tree = document.querySelector('#knowledgeTree')
  const list = document.querySelector('#questionList')
  const chapterSubtabs = document.querySelector('#chapterSubtabs')
  const textbookPicker = document.querySelector('#textbookPicker')
  const curriculumSelect = document.querySelector('#curriculum')
  const searchInput = document.querySelector('#questionSearch')

  function currentCurriculum() {
    return curriculumCatalog[curriculumKey] || curriculumCatalog['小学数学']
  }
  function currentTextbookSpec() {
    return textbookCatalog[curriculumKey] || textbookCatalog['小学数学']
  }
  function currentTextbook() {
    const spec = currentTextbookSpec()
    const saved = textbookSelection[curriculumKey]
    const editionName = spec.editions.some(item => item.name === saved?.edition) ? saved.edition : spec.edition
    const edition = spec.editions.find(item => item.name === editionName) || spec.editions[0]
    const year = Number(saved?.year || spec.year)
    const volume = edition.volumes.find(item => item.label === (saved?.volume || spec.volume) && item.year === year)
      || edition.volumes.find(item => item.label === spec.volume)
      || edition.volumes[0]
    return { edition: edition.name, volume: volume.label, year: volume.year, isNew: volume.isNew, editions: spec.editions }
  }
  function setCurrentTextbook(edition, volume, year) {
    const spec = currentTextbookSpec()
    const editionObj = spec.editions.find(item => item.name === edition) || spec.editions[0]
    const picked = editionObj.volumes.find(item => item.label === volume && item.year === Number(year))
      || editionObj.volumes.find(item => item.label === volume)
      || editionObj.volumes[0]
    textbookSelection[curriculumKey] = { edition: editionObj.name, volume: picked.label, year: picked.year }
    saveTeacherContext()
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
    return chapterTreeCatalog[`${curriculumKey}|${textbook.edition}|${textbook.volume}`] || {
      groups: currentCurriculum().groups,
      parents: currentCurriculum().parents,
      aliases: {},
    }
  }
  function browseByChapter() {
    return currentSource === 'official' && browseMode === 'chapter'
  }
  function activeTree() {
    if (browseByChapter()) return currentChapterTree()
    return { ...currentCurriculum(), aliases: currentCurriculum().aliases || {} }
  }
  function questionMatchesTreeNode(question, name, treeSpec = activeTree()) {
    if (!name) return true
    const aliases = [name, ...(treeSpec.aliases?.[name] || [])]
    if (treeSpec.parents[name]) {
      return aliases.includes(question.knowledge) || treeSpec.parents[name].some(child => questionMatchesTreeNode(question, child, treeSpec))
    }
    return aliases.includes(question.knowledge)
  }
  function firstKnowledgeName(treeSpec = activeTree()) {
    return treeSpec.groups[0]?.[0] || ''
  }
  function expandDefaultChapters() {
    const first = Object.keys(currentChapterTree().parents)[0]
    expandedChapterParents = new Set(first ? [first] : [])
    if (browseByChapter()) knowledge = first || firstKnowledgeName()
  }
  function visibleTreeGroups() {
    const treeSpec = activeTree()
    const groups = treeSpec.groups
    if (!browseByChapter()) return groups
    return groups.filter(([name]) => treeSpec.parents[name] || Object.entries(treeSpec.parents).some(([parent, children]) => children.includes(name) && expandedChapterParents.has(parent)))
  }

  function applyTeacherContext() {
    try {
      const saved = JSON.parse(localStorage.getItem(TEACHER_CONTEXT_KEY) || '{}')
      if (saved.curriculumKey && curriculumCatalog[saved.curriculumKey]) curriculumKey = saved.curriculumKey
      if (saved.textbooks && typeof saved.textbooks === 'object') textbookSelection = { ...saved.textbooks }
    } catch { /* ignore */ }
  }
  function saveTeacherContext() {
    try {
      localStorage.setItem(TEACHER_CONTEXT_KEY, JSON.stringify({
        curriculumKey,
        textbooks: textbookSelection,
        savedAt: Date.now(),
      }))
    } catch { /* ignore */ }
  }

  function notify(){ parent.postMessage({type:'feixiang-question-picker-count',count:selected.size},'*') }
  function sourcePool(){
    const pool = currentSource === 'official' ? officialQuestions : personalQuestions
    return pool.filter(question => (question.curriculum || '小学数学') === curriculumKey)
  }
  function filtered(){
    const type = document.querySelector('#typeFilter').value
    const diff = document.querySelector('#difficultyFilter').value
    const query = searchInput.value.trim().toLowerCase()
    const treeSpec = activeTree()
    return sourcePool().filter(q =>
      questionMatchesTreeNode(q, knowledge, treeSpec)
      && (type === '全部题型' || q.type === type)
      && (diff === '全部难度' || q.difficulty === diff)
      && (!query || `${q.text}${q.knowledge}`.toLowerCase().includes(query))
    )
  }
  const ANSWERS = {
    b1:'2又1/3小时', b2:'24、20；40、12', b3:'C. 线段', b4:'B. 线段', b5:'C. 39', b6:'2个', b7:'425米/分', b8:'A. 180°', b9:'2/9立方分米', b10:'D',
    b11:'4650', b12:'B. 20 个 405 相加', b13:'4个', b14:'还剩 1/3', b15:'5', b16:'B. 26', b17:'5', b18:'B. 线段可以测量长度', b19:'直线', b20:'C. 105°',
    b21:'15000立方厘米', b22:'A. 线段', b23:'3个', b24:'8分钟', b25:'C. 120', b26:'1/6', b27:'A. 1', b28:'射线',
    b29:'A. 一千万零一千', b30:'300050008', b31:'B. 千万位', b32:'十亿', b33:'B. 十亿', b34:'B. 100000000', b35:'<', b36:'B. 380 万', b37:'385', b38:'B. 8', b39:'100000000', b40:'D. 10000 米', b41:'2000 个。',
    cn1:'结合具体语境判断。', cn2:'依据句子成分与搭配判断。', cn3:'抓住人物的语言、动作和心理描写概括。', cn4:'开放性答案。',
    en1:'C. weekend', en2:'goes', en3:'According to the passage.', en4:'开放性答案。',
    jm1:'B. 3', jm2:'x＝4', jm3:'70°', jm4:'开放性答案。', hm1:'{2,3}', hm2:'x＝1', hm3:'见标准证明过程。', hm4:'开放性答案。',
  }
  const ANALYSIS = {
    b1:'先计算两种无人机每小时完成的工作量，再用剩余工作量除以效率和。',
    b2:'沿不同方向对折时，对折方向的边长减半，另一边不变。',
    b3:'线段有两个端点，符合“有始有终”的含义。',
    b4:'延长后仍有两个确定端点，所以仍是线段。',
    b5:'用9999除以256并取不超过结果的最大整数。',
    b6:'将各因数分解质因数，统计2和5能够配成多少组10。',
    b7:'先求乙领先的路程，再利用追及路程除以追及时间求速度差。',
    b8:'分针30分钟旋转半圈，即180°。',
    b9:'长方体体积等于底面积乘高。',
    b10:'两次对折的方向不同，折痕关系也会不同。',
    b29:'从高位读起，万级是 1000 万，个级是 1000，中间用“零”连接。',
    b30:'3 个亿是 300000000，5 个万是 50000，再加 8，合起来是 300050008。',
    b31:'从右边起第 8 位是千万位，38050000 中的 8 在千万位。',
    b32:'计数单位“亿”的相邻更高单位是“十亿”，10 个一亿是 1 个十亿。',
    b33:'1 后面有 9 个 0，是十亿。',
    b34:'位数多的数更大，1 亿是 9 位数，其余是 8 位数。',
    b35:'两个数位数相同，从最高位比起，千万位都是 8，百万位 0＜1。',
    b36:'3800000＝380×10000，所以改写成 380 万。',
    b37:'看千位是 6，满 5 向前一位进 1，3846200≈385 万。',
    b38:'千万位是从右边数第 8 位，所以是 8 位数。',
    b39:'99990000＋10000＝100000000。',
    b40:'1 亿张 × 0.1 毫米＝10000000 毫米＝10000 米。',
    b41:'1 亿÷5 万＝100000000÷50000＝2000。',
  }
  function answerFor(q){ const id = q.originId || q.id; return ANSWERS[id] || q.answer || '请查看题库答案。' }
  function analysisFor(q){ const id = q.originId || q.id; return ANALYSIS[id] || `围绕“${q.knowledge}”提取条件，选择对应公式或关系进行推理。` }

  function textbookPickerMarkup() {
    const current = currentTextbook()
    const previewEditionName = current.editions.some(item => item.name === textbookPickerEdition) ? textbookPickerEdition : current.edition
    const previewEdition = current.editions.find(item => item.name === previewEditionName) || current.editions[0]
    return `<div class="picker-textbook-picker ${textbookPickerOpen ? 'open' : ''}">
      <button type="button" data-toggle-textbook-picker aria-expanded="${textbookPickerOpen}" aria-label="教材版本"><span>${esc(textbookLabel(current))}</span><em>${textbookPickerOpen ? '⌃' : '⌄'}</em></button>
      ${textbookPickerOpen ? `<div class="picker-textbook-panel" role="listbox" aria-label="选择教材版本">
        <div class="picker-textbook-editions">${current.editions.map(item => `<button type="button" class="${item.name === previewEdition.name ? 'active' : ''}" data-textbook-edition="${esc(item.name)}">${esc(item.name)}<i>›</i></button>`).join('')}</div>
        <div class="picker-textbook-volumes">${previewEdition.volumes.map(item => `<button type="button" class="${item.label === current.volume && item.year === current.year && previewEdition.name === current.edition ? 'active' : ''}" data-textbook-pick="${esc(`${previewEdition.name}|${item.label}|${item.year}`)}">${esc(`${item.label}(${item.year})`)}${item.isNew ? '<em>新</em>' : ''}</button>`).join('')}</div>
      </div>` : ''}
    </div>`
  }

  function renderChrome() {
    chapterSubtabs.querySelectorAll('[data-browse]').forEach(button => {
      const on = button.dataset.browse === browseMode
      button.classList.toggle('active', on)
      button.setAttribute('aria-selected', String(on))
    })
    textbookPicker.hidden = !browseByChapter()
    textbookPicker.innerHTML = browseByChapter() ? textbookPickerMarkup() : ''
    searchInput.placeholder = browseByChapter() ? '搜索教材章节或题干关键词' : '搜索知识点或题干关键词'
    if (curriculumSelect.value !== curriculumKey) curriculumSelect.value = curriculumKey
  }

  function renderTree() {
    const treeSpec = activeTree()
    const parentNames = Object.keys(treeSpec.parents)
    tree.innerHTML = visibleTreeGroups().map(([name]) => {
      const isParent = parentNames.includes(name)
      const expanded = expandedChapterParents.has(name)
      const icon = browseByChapter() && isParent
        ? `<i data-toggle-chapter="${esc(name)}">${expanded ? '▾' : '▸'}</i>`
        : isParent ? '<i>⌄</i>' : ''
      const indent = !isParent && browseByChapter() ? ' child' : isParent ? ' group' : ' child'
      const activity = name.startsWith('☆') ? ' activity' : ''
      return `<button type="button" class="tree-node${indent}${activity}${knowledge === name ? ' active' : ''}" data-knowledge="${esc(name)}"><span>${icon}${esc(name)}</span></button>`
    }).join('')
  }

  function render() {
    renderChrome()
    renderTree()
    const allRows = filtered()
    const totalPages = currentSource === 'official' ? Math.min(MAX_PAGES, Math.max(1, Math.ceil(allRows.length / PAGE_SIZE))) : 1
    currentPage = Math.min(currentPage, totalPages)
    const rows = currentSource === 'official' ? allRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) : allRows
    const cards = rows.length ? rows.map(q => `<article class="question-card ${selected.has(q.id)?'selected':''} ${answersOpen.has(q.id)||adaptOpen.has(q.id)?'panel-open':''}" data-id="${q.id}"><div class="question-meta"><span>${q.type}</span><span>${q.difficulty}</span><span>${esc(q.knowledge)}</span></div><p>${esc(q.text)}</p>${q.options?`<div class="question-options">${q.options.map(esc).map(x=>`<span>${x}</span>`).join('')}</div>`:''}<div class="question-actions"><button type="button" data-answer="${q.id}" title="${answersOpen.has(q.id)?'收起答案':'显示答案和解析'}" aria-label="${answersOpen.has(q.id)?'收起答案':'显示答案和解析'}">答</button><button type="button" class="adapt" data-adapt="${q.id}" title="AI改编" aria-label="AI改编">✧</button><button type="button" class="add ${selected.has(q.id)?'added':''}" data-add="${q.id}" title="${selected.has(q.id)?'从已选题目移除':'添加题目'}" aria-label="${selected.has(q.id)?'从已选题目移除':'添加题目'}">${selected.has(q.id)?'✓':'＋'}</button></div>${answersOpen.has(q.id)?`<div class="answer-panel"><p><b>答案</b>${esc(answerFor(q))}</p><p><b>解析</b>${esc(analysisFor(q))}</p></div>`:''}${adaptOpen.has(q.id)?`<div class="adapt-panel"><b>AI改编</b><span>保持考点，调整数据与情境</span><button type="button" data-run-adapt="${q.id}">生成变式题</button></div>`:''}</article>`).join('') : '<div class="empty">没有找到符合条件的题目</div>'
    const remaining = Math.max(0, allRows.length - PAGE_SIZE)
    const remainingPages = Math.max(0, totalPages - 1)
    const footer = currentSource !== 'official' || allRows.length <= PAGE_SIZE ? '' : moreUnlocked
      ? `<footer class="picker-pagination"><button data-page="${currentPage-1}" ${currentPage===1?'disabled':''}>上一页</button><span>第 ${currentPage} / ${totalPages} 页 · 每页20题</span><button data-page="${currentPage+1}" ${currentPage===totalPages?'disabled':''}>下一页</button></footer>`
      : `<footer class="picker-unlock"><span>消耗20积分，可继续查看后${remainingPages}页，共${Math.min(allRows.length, PAGE_SIZE * MAX_PAGES)}道题</span><button type="button" data-unlock-more>解锁更多</button></footer>`
    const prompt = unlockPromptOpen ? `<div class="unlock-overlay"><div class="unlock-dialog"><span>✦</span><h3>解锁更多题目</h3><p>本次将消耗 <b>20积分</b>，解锁当前范围后续 ${remainingPages} 页、共 ${remaining} 道题。</p><div><button type="button" data-unlock-cancel>暂不解锁</button><button type="button" class="primary" data-unlock-confirm>确认解锁</button></div></div></div>` : ''
    const sourceLabel = browseByChapter() ? '教材章节' : '知识点'
    const pageInfo = rows.length ? `<div class="picker-page-info"><span>${sourceLabel}</span><b>本页 ${rows.length} 道题</b><em>第 ${currentPage} / ${totalPages} 页</em></div>` : ''
    list.innerHTML = pageInfo + cards + footer + prompt
  }

  function resetPaging() {
    currentPage = 1
    unlockPromptOpen = false
  }

  function fillCurriculumSelect() {
    curriculumSelect.innerHTML = Object.keys(curriculumCatalog).map(name => `<option value="${esc(name)}">${esc(name)}</option>`).join('')
    curriculumSelect.value = curriculumKey
  }

  tree.addEventListener('click', e => {
    const toggle = e.target.closest('[data-toggle-chapter]')
    if (toggle) {
      e.stopPropagation()
      const name = toggle.dataset.toggleChapter
      if (expandedChapterParents.has(name)) expandedChapterParents.delete(name)
      else expandedChapterParents.add(name)
      render()
      return
    }
    const button = e.target.closest('[data-knowledge]')
    if (!button) return
    knowledge = button.dataset.knowledge
    if (browseByChapter() && activeTree().parents[knowledge]) expandedChapterParents.add(knowledge)
    resetPaging()
    render()
  })

  textbookPicker.addEventListener('click', e => {
    e.stopPropagation()
    if (e.target.closest('[data-toggle-textbook-picker]')) {
      textbookPickerOpen = !textbookPickerOpen
      if (textbookPickerOpen) textbookPickerEdition = currentTextbook().edition
      render()
      return
    }
    const edition = e.target.closest('[data-textbook-edition]')
    if (edition) {
      textbookPickerEdition = edition.dataset.textbookEdition
      render()
      return
    }
    const pick = e.target.closest('[data-textbook-pick]')
    if (pick) {
      const [editionName, volume, year] = String(pick.dataset.textbookPick || '').split('|')
      setCurrentTextbook(editionName, volume, year)
      textbookPickerOpen = false
      expandDefaultChapters()
      resetPaging()
      render()
    }
  })

  document.addEventListener('click', e => {
    if (textbookPickerOpen && !e.target.closest('.picker-textbook-picker')) {
      textbookPickerOpen = false
      render()
    }
  })

  list.addEventListener('click', e => {
    const page = e.target.closest('[data-page]')
    const unlock = e.target.closest('[data-unlock-more]')
    const confirm = e.target.closest('[data-unlock-confirm]')
    const cancel = e.target.closest('[data-unlock-cancel]')
    if (page && !page.disabled) { currentPage = Math.max(1, Math.min(MAX_PAGES, Number(page.dataset.page) || 1)); list.scrollTop = 0; render(); return }
    if (unlock) { unlockPromptOpen = true; render(); return }
    if (cancel) { unlockPromptOpen = false; render(); return }
    if (confirm) { moreUnlocked = true; unlockPromptOpen = false; currentPage = 2; list.scrollTop = 0; render(); return }
    const add = e.target.closest('[data-add]')
    const answer = e.target.closest('[data-answer]')
    const adapt = e.target.closest('[data-adapt]')
    const run = e.target.closest('[data-run-adapt]')
    if (add) {
      const q = sourcePool().find(item => item.id === add.dataset.add)
      if (!q) return
      selected.has(q.id) ? selected.delete(q.id) : selected.set(q.id, q)
      render(); notify(); return
    }
    if (answer) { answersOpen.has(answer.dataset.answer) ? answersOpen.delete(answer.dataset.answer) : answersOpen.add(answer.dataset.answer); adaptOpen.delete(answer.dataset.answer); render(); return }
    if (adapt) { adaptOpen.has(adapt.dataset.adapt) ? adaptOpen.delete(adapt.dataset.adapt) : adaptOpen.add(adapt.dataset.adapt); answersOpen.delete(adapt.dataset.adapt); render(); return }
    if (run) {
      const q = sourcePool().find(item => item.id === run.dataset.runAdapt)
      if (!q) return
      q.text = `${q.text}（AI变式：已调整题目数据）`
      adaptOpen.delete(q.id)
      render()
    }
  })

  ;['typeFilter','difficultyFilter','questionSearch'].forEach(id => {
    document.querySelector(`#${id}`).addEventListener(id === 'questionSearch' ? 'input' : 'change', () => { resetPaging(); render() })
  })

  chapterSubtabs.addEventListener('click', e => {
    const button = e.target.closest('[data-browse]')
    if (!button) return
    browseMode = button.dataset.browse === 'knowledge' ? 'knowledge' : 'chapter'
    textbookPickerOpen = false
    if (browseMode === 'knowledge') knowledge = firstKnowledgeName()
    else expandDefaultChapters()
    resetPaging()
    render()
  })

  curriculumSelect.addEventListener('change', () => {
    curriculumKey = curriculumSelect.value
    saveTeacherContext()
    textbookPickerOpen = false
    if (browseMode === 'chapter') expandDefaultChapters()
    else knowledge = firstKnowledgeName()
    resetPaging()
    render()
  })

  window.AiqCanvas = {
    keys: () => [...selected.keys()],
    exportSelected: () => [...selected.values()].map(q => ({selectionKey: q.id, question: {...q, stem: q.text}})),
    toggleQuestion: item => {
      const id = item.selectionKey || item.id || item.question?.id
      if (selected.has(id)) selected.delete(id)
      render(); notify()
    },
  }

  applyTeacherContext()
  fillCurriculumSelect()
  expandDefaultChapters()
  if (!knowledge) knowledge = firstKnowledgeName()
  render()
  notify()
})()
