(() => {
  const requirementsDocument = `
    <section class="prd-section">
      <h3>本次调整范围</h3>
      <p>本次只调整「我的题库」和「AI组题」。飞象题库、右侧当前题单及其他未说明部分，均同现有规则。</p>
    </section>

    <section class="prd-section">
      <h3>一、我的题库</h3>

      <h4>1. 页面结构</h4>
      <ul>
        <li>「我的题库」与「飞象题库」「AI组题」平级。页内保留「试题 / 题单」，其中题单页同现有规则。</li>
        <li>点击「试题」后，直接展示老师通过上传文件、由 AI 录入的全部题目，并按 AI 录题时间由近及远排序。</li>
        <li>「上传文件」只放在「试题」页签右侧，旁边固定说明「上传试卷，AI 自动识别并录入题库」；切换到「题单」后不显示上传入口。</li>
        <li>老师首次进入且题库为空时，展示上传文件空状态，引导老师上传试卷并由 AI 录入。</li>
      </ul>

      <h4>2. 筛选与题目标签</h4>
      <ul>
        <li>筛选顺序固定为：阶段·科目、题型、难度、知识点、自定义标签、搜索。默认只显示字段名，不重复写“全部”；难度筛选支持多选，题目命中任一已选难度即展示。有筛选条件时提供重置。</li>
        <li>筛选项根据我的题库中已有题目生成。只有存在对应题目时，才显示该阶段·科目、题型和难度；例如题库中只有小学数学题目，阶段·科目中只显示「小学·数学」。</li>
        <li>知识点跟随阶段·科目联动。未选择阶段·科目时，知识点不可点击且不展示候选；选择后，只展示该阶段·科目下、末级节点且已有题目的知识点，不展示整棵知识点树，也不在知识点名称前重复显示阶段·科目。搜索覆盖题干、选项和标签。</li>
        <li>题卡标签按「阶段·科目 → 题型 → 难度 → 知识点 → 自定义标签」排列。同一类有多个值时放在一个标签块里，用逗号隔开，不再重复显示类别名称。</li>
        <li>单道题的阶段·科目和难度只有一个；题型、知识点可以有多个，均从飞象标签库中选择。自定义标签默认为空，老师创建后才在题目和筛选项中出现，可添加多个。</li>
        <li>上传文件完成 AI 录题后，系统自动为题目生成并应用标签。老师修改过标签时，以老师最后保存的结果为准，后续 AI 不再覆盖。</li>
        <li>修改阶段·科目后，自动移除不再适用的知识点。标签保存后，同步更新当前题单中仍与该题保持关联的题目。</li>
        <li>在「自定义标签」筛选下拉中进入「管理自定义标签」。管理弹窗展示标签名称和关联题目数；删除前需二次确认。确认后，该标签从标签列表中删除，并解除我的题库所有关联题目及当前题单同源题的关联。</li>
      </ul>

      <h4>3. 编辑单个题目标签</h4>
      <ul>
        <li>点击题卡上的标签或标签编辑图标，打开「编辑题目标签」弹窗，可修改阶段·科目、题型、难度、知识点和自定义标签。</li>
        <li>点击标签编辑图标时，仅打开弹窗，不默认展开任何下拉；点击某个具体标签时，直接展开对应标签的编辑项。</li>
        <li>AI 录题完成后自动标注阶段·科目、题型、难度和知识点。阶段·科目、题型和难度为必填项；知识点为非必填项，老师可以删除全部知识点后保存。</li>
        <li>阶段·科目和难度为单选；题型、知识点和自定义标签支持多选。阶段·科目、题型、难度和知识点从飞象标签库中选择，自定义标签可自由创建。</li>
        <li>阶段·科目变化后，题型和知识点同步切换到对应范围。首次切换到新的阶段·科目时，保留仍适用的题型，清空不适用的知识点；切回之前选择过的阶段·科目时，恢复老师在该阶段·科目下上次选择的题型和知识点。</li>
        <li>单题编辑弹窗内取消选中某个自定义标签，只解除当前题目与该标签的关联，不删除标签。全局删除统一从「自定义标签 → 管理自定义标签」进入。</li>
        <li>保存后，本题标签立即更新；题目已加入当前题单时，同步更新当前题单中的同源题。此后以老师最后保存的标签为准，后续 AI 不再覆盖。</li>
      </ul>

      <h4>4. 批量设置标签</h4>
      <ul>
        <li>题卡默认不显示复选框。点击筛选区下方的「批量操作」后，再勾选要处理的题目。</li>
        <li>批量操作支持统一设置阶段·科目、题型、难度、知识点和自定义标签。打开「批量编辑标签」后，先勾选本次要设置的标签类型，再显示对应的选择区。</li>
        <li>阶段·科目和难度为单选，题型、知识点和自定义标签支持多选。</li>
        <li>勾选的类型用本次选择结果统一覆盖；未勾选的类型保持原样。弹窗不展示各题原标签，也不再区分添加、移除或替换。</li>
        <li>批量选择区与单题标签编辑保持一致，阶段·科目、题型、难度和知识点均使用下拉框；单选项选择后收起，多选项可连续选择。自定义标签仍支持选择已有标签或自由创建。</li>
        <li>题型和知识点跟随阶段·科目联动。所选题目的阶段·科目一致时，可单独设置题型或知识点，并直接显示该范围下的候选。</li>
        <li>所选题目的阶段·科目不一致时，勾选阶段·科目、题型或知识点中的任意一项，系统自动同时勾选这三项；需先选择统一的阶段·科目，再设置对应题型和知识点，三项必须一起保存。</li>
        <li>主动批量修改阶段·科目时，无论原阶段·科目是否一致，题型和知识点都必须一起设置。切换阶段·科目后，清空尚未保存的题型和知识点选择，并展示新范围下的候选。</li>
        <li>已勾选但没有选择任何值时不能保存。</li>
        <li>进入批量操作后，如果切换筛选条件或重新搜索，清空已经勾选的题目，避免修改到当前看不见的内容。</li>
      </ul>

      <h4>5. 上传文件</h4>
      <ul>
        <li>点击「上传文件」后，从我的题库右侧打开抽屉，不跳转页面，也不新增 Tab。</li>
        <li>「上传文件」按钮上的数字只统计正在 AI 录题解析中的文件数量。例如同时有 2 个文件正在解析，则显示「2」；没有解析中的文件时不显示数字。</li>
        <li>录题完成后，点击任务中的「查看题目」，关闭上传抽屉，并在「我的题库－试题」中进入本次录入题目的临时结果页。页面只展示该文件录入且仍然存在的题目，顶部显示文件名、题数和「返回题目列表」。点击返回后回到原来的试题列表，并恢复进入前的筛选条件和滚动位置。</li>
        <li>其他规则同现有规则。</li>
      </ul>
    </section>

    <section class="prd-section">
      <h3>二、AI组题</h3>
      <ul>
        <li>「AI组题」是固定一级 Tab，与飞象题库、我的题库平级。组题过程、历史记录和结果都在该 Tab 内完成，不再新增动态 Tab。</li>
        <li>老师可以直接描述学段学科、题量、题型、难度和知识点，也可以使用快捷示例或语音输入。没有输入组题要求时不能开始。</li>
        <li>题源为飞象题库和我的题库。本期只从题库中匹配已有题目，不增加 AI命题。</li>
        <li>提交后在当前页面展示组题过程和候选题目。结果支持逐题选用，也支持一次全部加入当前题单；未选用的题目不会自动加入。</li>
        <li>一次组题完成后，可以继续输入补题或调整要求。每轮结果保留在同一段对话中，不为每一轮新开页面或 Tab。</li>
        <li>AI组题首页保留历史记录。点击历史记录进入对应对话，可继续调整，也可查看某一轮结果。</li>
        <li>点击「查看题目」或「查看本轮题目」后，在主内容区进入临时结果视图；顶部展示返回入口、结果名称、题数和整份选用操作。返回后恢复原来的历史列表或对话位置。</li>
      </ul>
    </section>

    <section class="prd-section">
      <h3>其他</h3>
      <p>飞象题库、右侧当前题单、题目通用操作、保存下载，以及本文未提及的功能，均同现有规则。</p>
    </section>`

  const TRIGGER_POS_KEY = 'feixiang-prd-trigger-pos'
  const DRAWER_POS_KEY = 'feixiang-prd-drawer-pos'

  function readPos(key) {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const pos = JSON.parse(raw)
      if (typeof pos.left === 'number' && typeof pos.top === 'number') return pos
    } catch (_) { /* ignore */ }
    return null
  }

  function writePos(key, left, top) {
    try { localStorage.setItem(key, JSON.stringify({ left, top })) } catch (_) { /* ignore */ }
  }

  function clampEl(el, left, top) {
    const rect = el.getBoundingClientRect()
    const w = rect.width || el.offsetWidth || 120
    const h = rect.height || el.offsetHeight || 40
    const maxLeft = Math.max(8, window.innerWidth - w - 8)
    const maxTop = Math.max(8, window.innerHeight - h - 8)
    return {
      left: Math.min(maxLeft, Math.max(8, left)),
      top: Math.min(maxTop, Math.max(8, top)),
    }
  }

  function applyFixedPos(el, pos) {
    if (!pos) return false
    const next = clampEl(el, pos.left, pos.top)
    el.style.right = 'auto'
    el.style.bottom = 'auto'
    el.style.left = `${next.left}px`
    el.style.top = `${next.top}px`
    return true
  }

  function bindDrag({ handle, target, storageKey, onTap, ignore }) {
    let startX = 0
    let startY = 0
    let originLeft = 0
    let originTop = 0
    let pointerId = null
    let moved = false

    const onMove = (event) => {
      if (event.pointerId !== pointerId) return
      const dx = event.clientX - startX
      const dy = event.clientY - startY
      if (!moved && Math.hypot(dx, dy) < 5) return
      moved = true
      event.preventDefault()
      const next = clampEl(target, originLeft + dx, originTop + dy)
      target.style.right = 'auto'
      target.style.bottom = 'auto'
      target.style.left = `${next.left}px`
      target.style.top = `${next.top}px`
      target.classList.add('is-dragging')
    }

    const end = (event) => {
      if (event.pointerId !== pointerId) return
      handle.releasePointerCapture?.(pointerId)
      handle.removeEventListener('pointermove', onMove)
      handle.removeEventListener('pointerup', end)
      handle.removeEventListener('pointercancel', end)
      target.classList.remove('is-dragging')
      if (moved) {
        const left = parseFloat(target.style.left) || 0
        const top = parseFloat(target.style.top) || 0
        writePos(storageKey, left, top)
      } else if (onTap) {
        onTap(event)
      }
      pointerId = null
    }

    handle.addEventListener('pointerdown', (event) => {
      if (ignore?.(event.target)) return
      if (event.button !== 0) return
      const rect = target.getBoundingClientRect()
      target.style.right = 'auto'
      target.style.bottom = 'auto'
      target.style.left = `${rect.left}px`
      target.style.top = `${rect.top}px`
      startX = event.clientX
      startY = event.clientY
      originLeft = rect.left
      originTop = rect.top
      moved = false
      pointerId = event.pointerId
      handle.setPointerCapture(pointerId)
      handle.addEventListener('pointermove', onMove)
      handle.addEventListener('pointerup', end)
      handle.addEventListener('pointercancel', end)
    })
  }

  function mount() {
    if (document.querySelector('.prd-trigger')) return
    const trigger = document.createElement('button')
    trigger.type = 'button'
    trigger.className = 'prd-trigger'
    trigger.setAttribute('aria-haspopup', 'dialog')
    trigger.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h9l3 3V20H6z"/><path d="M15 3.5V7h3M9 11h6M9 14h6M9 17h4"/></svg><span>需求说明</span>'

    const drawer = document.createElement('aside')
    drawer.className = 'prd-drawer'
    drawer.setAttribute('role', 'dialog')
    drawer.setAttribute('aria-modal', 'false')
    drawer.setAttribute('aria-label', '产品需求说明')
    drawer.innerHTML = `<header class="prd-drawer-head prd-drawer-head-compact"><div class="prd-drawer-title"><div><small>需求说明</small><h2>我的题库与 AI组题</h2><p>本次调整内容</p></div><button type="button" class="prd-close" aria-label="关闭需求说明">×</button></div></header><div class="prd-body"></div>`
    document.body.append(trigger, drawer)

    applyFixedPos(trigger, readPos(TRIGGER_POS_KEY))
    applyFixedPos(drawer, readPos(DRAWER_POS_KEY))

    const drawerHead = drawer.querySelector('.prd-drawer-head')
    const alignDrawerNearTrigger = () => {
      const tr = trigger.getBoundingClientRect()
      const w = drawer.offsetWidth || 560
      let left = tr.right - w
      let top = tr.bottom + 8
      if (left < 8) left = 8
      if (top + 320 > window.innerHeight) top = Math.max(8, tr.top - Math.min(drawer.offsetHeight || 480, window.innerHeight - 16))
      applyFixedPos(drawer, clampEl(drawer, left, top))
    }

    const body = drawer.querySelector('.prd-body')
    const close = () => {
      drawer.classList.remove('open')
      trigger.classList.remove('is-open')
      trigger.setAttribute('aria-expanded', 'false')
      trigger.focus()
    }
    const open = () => {
      body.innerHTML = requirementsDocument
      body.scrollTop = 0
      drawer.classList.add('open')
      trigger.classList.add('is-open')
      trigger.setAttribute('aria-expanded', 'true')
      if (!readPos(DRAWER_POS_KEY)) window.requestAnimationFrame(() => alignDrawerNearTrigger())
      drawer.querySelector('.prd-close')?.focus()
    }

    bindDrag({
      handle: trigger,
      target: trigger,
      storageKey: TRIGGER_POS_KEY,
      onTap: open,
    })

    bindDrag({
      handle: drawerHead,
      target: drawer,
      storageKey: DRAWER_POS_KEY,
      ignore: (target) => Boolean(target.closest('.prd-close')),
    })

    drawer.querySelector('.prd-close').addEventListener('click', close)
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && drawer.classList.contains('open')) close() })
    window.addEventListener('resize', () => {
      applyFixedPos(trigger, readPos(TRIGGER_POS_KEY) || { left: trigger.getBoundingClientRect().left, top: trigger.getBoundingClientRect().top })
      if (drawer.classList.contains('open')) {
        applyFixedPos(drawer, readPos(DRAWER_POS_KEY) || { left: drawer.getBoundingClientRect().left, top: drawer.getBoundingClientRect().top })
      }
    })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true })
  else mount()
})()
