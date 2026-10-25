'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const validUrl = value => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };

  // Navigation
  const menu = $('#menu-toggle');
  const nav = $('#nav');
  const setMenuOpen = open => {
    nav.classList.toggle('is-open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close menu':'Open menu');
  };
  menu.addEventListener('click', () => setMenuOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenuOpen(false); });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { setMenuOpen(false); menu.focus(); }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 980) setMenuOpen(false); });

  // Disciplines: clickable, keyboard accessible tabs with matching illustration and destinations.
  const disciplines = {
    pharm: {label:'Pharmaceutics',title:'From formulation to manufacture.',description:'Dosage-form development, manufacturing processes, technology transfer and the science of product quality.',note:'Formulation · Manufacturing',link:'#projects',linkLabel:'View related work'},
    tech: {label:'Technology',title:'Software built for actual use.',description:'Web applications, product design, databases and data tools. Current work includes personal finance software and health information systems.',note:'Web applications · Data tools',link:'#projects',linkLabel:'Explore software projects'},
    health: {label:'Health',title:'Better information for healthcare.',description:'Healthcare services, medicine-use data, digital records and information systems that support planning and decisions.',note:'Healthcare · Information systems',link:'#projects',linkLabel:'Explore health projects'},
    research: {label:'Research',title:'Questions worth investigating.',description:'Scientific studies, literature reviews, technical analysis and applied research across pharmaceutical and health sciences.',note:'Scientific studies · Analysis',link:'#research',linkLabel:'Browse research'},
    writing: {label:'Writing',title:'Books and published work.',description:'Nonfiction, technical communication and creative writing, including a published football guide and a fantasy manuscript.',note:'Books · Manuscripts',link:'#writing',linkLabel:'Go to writing'}
  };
  const discTabs = $$('[data-discipline]');
  function selectDiscipline(key, focus = false) {
    const item = disciplines[key]; if (!item) return;
    for (const button of discTabs) {
      const active = button.dataset.discipline === key;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-selected',String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    }
    $('#discipline-panel').setAttribute('aria-labelledby','disc-tab-'+key);
    $('#discipline-eyebrow').textContent=item.label;
    $('#discipline-title').textContent=item.title;
    $('#discipline-description').textContent=item.description;
    $('#discipline-art-caption').textContent=item.note;
    const link = $('#discipline-link'); link.href=item.link;
    link.replaceChildren(document.createTextNode(item.linkLabel+' '));
    const mark=document.createElement('span');mark.textContent='↗';mark.setAttribute('aria-hidden','true');link.append(mark);
    for (const graphic of $$('[data-art]')) graphic.hidden = graphic.dataset.art !== key;
  }
  for (const button of discTabs) {
    button.addEventListener('click', () => selectDiscipline(button.dataset.discipline));
    button.addEventListener('keydown', event => {
      if (!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const index = discTabs.indexOf(button);
      const next = event.key==='Home'?0:event.key==='End'?discTabs.length-1:
        (index + (['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+discTabs.length)%discTabs.length;
      selectDiscipline(discTabs[next].dataset.discipline,true);
    });
  }
  for (const link of $$('[data-select-discipline]')) {
    link.addEventListener('click',() => selectDiscipline(link.dataset.selectDiscipline));
  }

  // Team roster and profile tabs.
  const memberViews = {
    overview: {
      lead:'Pharmaceutical scientist and developer working across medicines, software and research.',
      detail:'An interest in how things work has led to projects ranging from manufacturing investigations to VybaCash and healthcare data tools.',
      tags:['Product development','Pharmaceutical science','Software']
    },
    technology: {
      lead:'Builds web tools using JavaScript, HTML, CSS, databases and hosted services.',
      detail:'Experience developing web-based products and working with HTML, CSS, JavaScript, GitHub, Vercel, Supabase and PostgreSQL. Projects include VybaCash, website systems and ideas for healthcare data applications.',
      tags:['JavaScript','Web applications','Supabase & PostgreSQL','Product design']
    },
    pharma: {
      lead:'Pharmaceutical scientist with experience in formulation development and manufacturing technology transfer.',
      detail:'GMP manufacturing, process validation, material and process assessments, technical investigations, change control and quality systems. Interests include medicine development and practical scientific research.',
      tags:['Formulation development','Technology transfer','GMP','Process validation']
    },
    work: {
      lead:'Projects connecting scientific work, software and independent writing.',
      detail:'Development work includes the VybaCash finance application, Greylad, research on oral dosage-form manufacturing and a healthcare information platform concept. Also the author of Beyond the Goal.',
      tags:['VybaCash','Greylad','Health data','Research & writing']
    }
  };
  const memberTabs=$$('[data-member-view]');
  function selectMemberView(key,focus=false){
    const item=memberViews[key];if(!item)return;
    for(const button of memberTabs){const active=button.dataset.memberView===key;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus();}
    $('#member-panel').setAttribute('aria-labelledby','member-tab-'+key);
    $('#member-lead').textContent=item.lead;
    $('#member-detail').textContent=item.detail;
    $('#member-tags').replaceChildren(...item.tags.map(label=>{const tag=document.createElement('span');tag.textContent=label;return tag;}));
  }
  for(const button of memberTabs){
    button.addEventListener('click',()=>selectMemberView(button.dataset.memberView));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();const i=memberTabs.indexOf(button);
      const next=event.key==='Home'?0:event.key==='End'?memberTabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+memberTabs.length)%memberTabs.length;
      selectMemberView(memberTabs[next].dataset.memberView,true);
    });
  }
  for(const person of $$('[data-team-member]'))person.addEventListener('click',()=>selectMemberView('overview'));

  // Shared accessible detail dialog for cards and archive entries.
  const dialog=$('#detail');
  let returnFocus=null;
  const closeDialog=()=>{if(dialog.open)dialog.close();};
  function showDetail(data){
    if(!data)return;
    returnFocus=document.activeElement;
    $('#detail-category').textContent=data.category || '';
    $('#detail-title').textContent=data.title || '';
    $('#detail-body').textContent=data.body || data.summary || '';
    const link=$('#detail-link');const url=validUrl(data.resource_url || '');
    link.hidden=!url;if(url)link.href=url;else link.removeAttribute('href');
    if(typeof dialog.showModal==='function') dialog.showModal(); else dialog.setAttribute('open','');
  }
  $('.dialog-close').addEventListener('click',closeDialog);
  dialog.addEventListener('close',()=>{if(returnFocus?.focus)returnFocus.focus();});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();});
  const projectDetails = {
    health:{category:'Health · Technology',title:'Health data systems',body:'A proposed health-information platform for records, facility reporting, medicine-use trends and aggregate indicators to support health planning.'},
    pharm:{category:'Pharmaceutics · Research',title:'Materials and medicine',body:'Research on excipient choices and manufacturing processes for immediate-release oral dosage forms, including how material attributes and process settings influence finished-product performance.'}
  };
  for(const button of $$('[data-project]'))button.addEventListener('click',()=>showDetail(projectDetails[button.dataset.project]));

  // Public archive: all controls manipulate real results, never decorative filters.
  const bundled=Array.isArray(window.GREYLAD_CONTENT)?window.GREYLAD_CONTENT:[];
  let entries=[...bundled];let activeFilter='all';
  const readable=e=>[e.title,e.summary,e.body].filter(Boolean).join(' ').toLocaleLowerCase();
  const shouldDisplay=e=>{
    const s=readable(e);return e.published!==false&&!/oxy\s*gonum|whispers.{0,45}mystic/i.test(s);
  };
  function renderArchive(){
    const q=$('#search').value.trim().toLocaleLowerCase();
    const current=entries.filter(e=>shouldDisplay(e)&&(activeFilter==='all'||e.category===activeFilter)&&(!q||readable(e).includes(q)));
    const host=$('#entries');host.replaceChildren();
    if(!current.length){const empty=document.createElement('p');empty.className='archive-empty';empty.textContent='No results for that search.';host.append(empty);}
    for(const entry of current){
      const card=document.createElement('article');card.className='archive-entry';
      const meta=document.createElement('p');meta.className='archive-entry-meta';meta.textContent=`${entry.category||'Work'} · ${entry.status||'Notes'}`;
      const title=document.createElement('h3');title.textContent=entry.title||'Untitled';
      const summary=document.createElement('p');summary.textContent=entry.summary||'';
      const action=document.createElement('button');action.type='button';action.textContent='View details ↗';action.addEventListener('click',()=>showDetail(entry));
      card.append(meta,title,summary,action);host.append(card);
    }
    $('#archive-status').textContent=`${current.length} ${current.length===1?'entry':'entries'}`;
  }
  const filters=$$('[data-filter]');
  for(const button of filters)button.addEventListener('click',()=>{
    activeFilter=button.dataset.filter;
    for(const other of filters){const chosen=other===button;other.classList.toggle('is-active',chosen);other.setAttribute('aria-pressed',String(chosen));}
    renderArchive();
  });
  $('#search').addEventListener('input',renderArchive);
  renderArchive();

  // Optional remote entries; the local archive works without a backend.
  const config=window.GREYLAD_CONFIG||{};
  if(config.supabaseUrl&&config.supabasePublishableKey){
    (async()=>{try{
      const url=config.supabaseUrl.replace(/\/$/,'')+'/rest/v1/greylad_entries?select=*&published=eq.true&order=created_at.desc';
      const res=await fetch(url,{headers:{apikey:config.supabasePublishableKey}});
      if(!res.ok)throw Error('Unable to load entries');
      const remote=await res.json();if(!Array.isArray(remote))throw Error('Unexpected entries');
      const merged=new Map(bundled.map(e=>[String(e.id),e]));
      for(const entry of remote)if(entry&&typeof entry==='object'&&entry.published)merged.set(String(entry.id),entry);
      entries=[...merged.values()];renderArchive();
    }catch{ /* Bundled content remains available. */ }})();
  }

  // Copy address works in secure contexts; mailto is always available.
  $('#copy-email').addEventListener('click',async()=>{
    const button=$('#copy-email');const value=button.dataset.email;let copied=false;
    try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(value);copied=true;}}
    catch{}
    if(!copied){
      try{const input=document.createElement('textarea');input.value=value;input.style.position='fixed';input.style.left='-9999px';document.body.append(input);input.select();copied=document.execCommand('copy');input.remove();}
      catch{}
    }
    $('#copy-status').textContent=copied?'Email address copied.':'Use the email link above to compose a message.';
    button.firstChild.textContent=copied?'Copied ':'Copy email ';
    window.setTimeout(()=>{button.firstChild.textContent='Copy email ';},1800);
  });

  const progress=$('#scroll-progress');
  function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?Math.min(100,window.scrollY/max*100):0)+'%';}
  window.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
  $('#year').textContent=new Date().getFullYear();
  const heroArt=$('#hero-art');
  if(window.matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
    heroArt.addEventListener('pointermove',event=>{const r=heroArt.getBoundingClientRect();heroArt.style.setProperty('--px',((event.clientX-r.left)/r.width-.5)*18+'px');heroArt.style.setProperty('--py',((event.clientY-r.top)/r.height-.5)*18+'px');},{passive:true});
    heroArt.addEventListener('pointerleave',()=>{heroArt.style.setProperty('--px','0px');heroArt.style.setProperty('--py','0px');});
  }
})();
