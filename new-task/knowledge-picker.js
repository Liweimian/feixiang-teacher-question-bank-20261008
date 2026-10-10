(() => {
  const STORAGE_KEY='feixiang-question-workbench-v3-drafts'
  const DELETED_KEY='feixiang-knowledge-deleted-compose-papers'
  const esc=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
  const selected=new Map()
  const demoPapers=[
    {id:'knowledge-ai-compose-1',title:'五年级小数乘除法基础练习',count:5,updated:'2026.09.09'},
    {id:'knowledge-ai-compose-2',title:'四年级数学综合练习题单',count:13,updated:'2026.09.08'},
    {id:'knowledge-ai-compose-3',title:'七年级有理数随堂练习',count:12,updated:'2026.09.07'},
  ]
  function personalPapers(){
    let drafts=[],deleted=[]
    try{drafts=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{}
    try{deleted=JSON.parse(localStorage.getItem(DELETED_KEY)||'[]')}catch{}
    const saved=drafts.filter(draft=>draft.savedAt&&draft.questions?.some(question=>question.status==='confirmed')).map(draft=>({id:draft.id,title:draft.title||'未命名题单',count:draft.questions.filter(question=>question.status==='confirmed').length,updated:new Date(draft.savedAt).toLocaleDateString('zh-CN').replaceAll('/','.')}))
    return [...saved,...demoPapers.filter(demo=>!saved.some(item=>item.title===demo.title))].filter(item=>!deleted.includes(item.id))
  }
  const folders=[
    {id:'works',title:'我的工作成果',open:false,items:[]},
    {id:'papers',title:'我的题单',open:false,items:personalPapers()},
    {id:'uploads',title:'对话中上传的文件',open:true,items:[{id:'upload-1',title:'解答题修改前.docx',meta:'Word 文档'},{id:'upload-2',title:'《长方体和正方体的认识》完整课件.docx',meta:'Word 文档'}]},
  ]
  const root=document.querySelector('#knowledgeFolders')
  function notify(){window.parent.postMessage({type:'feixiang-question-picker-count',count:selected.size},'*')}
  function itemMarkup(item,folder){
    const meta=folder.id==='papers'?`${item.count} 题 · ${item.updated} 更新`:item.meta
    return `<label class="knowledge-item" data-search-text="${esc(item.title.toLowerCase())}"><input type="checkbox" data-item="${esc(item.id)}" ${selected.has(item.id)?'checked':''}><span><b>${esc(item.title)}</b><small>${esc(meta)}</small></span><span>${folder.id==='papers'?'题单':'DOCX'}</span></label>`
  }
  function render(){
    root.innerHTML=folders.map(folder=>`<article class="knowledge-folder" data-folder="${folder.id}"><button type="button" data-toggle-folder="${folder.id}" aria-expanded="${folder.open}"><i>${folder.open?'⌄':'›'}</i><span class="folder-icon">▱</span><b>${folder.title}</b><em>${folder.items.length?`${folder.items.length} 项`:''}</em></button><div class="folder-items" ${folder.open?'':'hidden'}>${folder.items.length?folder.items.map(item=>itemMarkup(item,folder)).join(''):'<p class="folder-empty">暂无内容</p>'}</div></article>`).join('')
  }
  root.addEventListener('click',event=>{const button=event.target.closest('[data-toggle-folder]');if(!button)return;const folder=folders.find(item=>item.id===button.dataset.toggleFolder);if(folder){folder.open=!folder.open;render()}})
  root.addEventListener('change',event=>{const input=event.target.closest('[data-item]');if(!input)return;const item=folders.flatMap(folder=>folder.items).find(entry=>entry.id===input.dataset.item);if(input.checked)selected.set(item.id,{id:item.id,title:item.title,name:item.title,type:'knowledge'});else selected.delete(item.id);notify()})
  document.querySelector('#knowledgeSearch').addEventListener('input',event=>{const query=event.target.value.trim().toLowerCase();folders.forEach(folder=>{if(query)folder.open=true});render();if(query)document.querySelectorAll('.knowledge-item').forEach(item=>item.classList.toggle('hidden-by-search',!item.dataset.searchText.includes(query)))})
  window.AiqCanvas={keys:()=>[...selected.keys()],exportSelected:()=>[...selected.values()],toggleQuestion:item=>{selected.delete(item.id);render();notify()}}
  render();notify()
})()
