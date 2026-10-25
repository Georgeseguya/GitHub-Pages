'use strict';
const config = window.GREYLAD_CONFIG || {};
const connected = Boolean(config.supabaseUrl && config.supabasePublishableKey);
const bundledEntries = Array.isArray(window.GREYLAD_CONTENT) ? window.GREYLAD_CONTENT : [];
let entries = [...bundledEntries];
let selected = 'all';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const dialog = $('#detail');
const safeUrl = (value) => {try {const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null;} catch {return null;}};

// Keyboard-accessible navigation across disciplines.
const discipline = {
  pharm: {code:'PHARMACEUTICS',subtitle:'PHARMACEUTICAL DEVELOPMENT',title:'Dosage forms and manufacturing.',description:'Technical work spanning formulation development, process evaluation, manufacturing transfer and product quality.',link:'#projects',linkLabel:'Related projects'},
  health: {code:'HEALTH',subtitle:'HEALTH SYSTEMS',title:'Health data and services.',description:'Digital records, health service reporting and information systems for healthcare planning.',link:'#projects',linkLabel:'Health projects'},
  research: {code:'RESEARCH',subtitle:'SCIENTIFIC RESEARCH',title:'Studies and publications.',description:'Literature reviews, scientific research, technical assessment and research communication.',link:'#research',linkLabel:'Browse research'},
  writing: {code:'WRITING',subtitle:'BOOKS AND MANUSCRIPTS',title:'Books and publishing.',description:'Published nonfiction, manuscripts and technical writing.',link:'#writing',linkLabel:'Browse writing'},
  tech: {code:'TECHNOLOGY',subtitle:'SOFTWARE AND DIGITAL PRODUCTS',title:'Digital tools and systems.',description:'Software, web applications and data tools developed for practical use.',link:'#projects',linkLabel:'View projects'}
};
function showFocus(key, focus = false) {
  if (!Object.prototype.hasOwnProperty.call(discipline, key)) return;
  const current = discipline[key];
  for (const tab of $$('.practice-tab')) {
    const active = tab.dataset.focus === key;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  }
  $('#focus-panel').setAttribute('aria-labelledby', 'tab-' + key);
  $('#focus-code').textContent = current.code;
  $('#focus-subtitle').textContent = current.subtitle;
  $('#focus-title').textContent = current.title;
  $('#focus-description').textContent = current.description;
  $('#focus-link').href = current.link;
  $('#focus-link').innerHTML = '';
  $('#focus-link').append(document.createTextNode(current.linkLabel + ' '));
  const mark = document.createElement('span');
  mark.textContent = '↗'; mark.setAttribute('aria-hidden','true');
  $('#focus-link').append(mark);
  for (const visual of $$('[data-visual]')) visual.hidden = visual.dataset.visual !== key;
}
const focusTabs = $$('.practice-tab');
for (const tab of focusTabs) {
  tab.addEventListener('click', () => showFocus(tab.dataset.focus));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = focusTabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? focusTabs.length - 1 : (index + (['ArrowDown','ArrowRight'].includes(event.key)?1:-1) + focusTabs.length) % focusTabs.length;
    showFocus(focusTabs[next].dataset.focus, true);
  });
}

// The member list and profile views allow the roster to expand without changing the layout.
const teamViews = {
  profile: {
    lead: 'Pharmaceutical scientist working in formulation development, manufacturing technology transfer and pharmaceutical quality systems.',
    detail: 'Work across pharmaceutical science, research, technical writing and digital product development.'
  },
  experience: {
    lead: 'Experience in GMP-regulated pharmaceutical manufacturing, process validation, quality investigations and site transfer.',
    detail: 'Technical contributions include manufacturing documentation, change control, risk assessment and formulation-development activities.'
  },
  projects: {
    lead: 'Greylad, VybaCash and research-related digital projects.',
    detail: 'Current interests include pharmaceutical research, publishing and healthcare information systems.'
  }
};
const teamTabs = $$('.team-view-tab');
function showTeamView(key, shouldFocus=false){
  if(!Object.prototype.hasOwnProperty.call(teamViews,key))return;
  for(const tab of teamTabs){
    const active=tab.dataset.teamView===key;
    tab.classList.toggle('active',active);
    tab.setAttribute('aria-selected',String(active));
    tab.tabIndex=active?0:-1;
    if(active&&shouldFocus)tab.focus();
  }
  $('#team-view-panel').setAttribute('aria-labelledby','team-tab-'+key);
  $('#team-view-lead').textContent=teamViews[key].lead;
  $('#team-view-detail').textContent=teamViews[key].detail;
}
for(const tab of teamTabs){
  tab.addEventListener('click',()=>showTeamView(tab.dataset.teamView));
  tab.addEventListener('keydown',event=>{
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
    event.preventDefault();
    const index=teamTabs.indexOf(tab);
    const next=event.key==='Home'?0:event.key==='End'?teamTabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+teamTabs.length)%teamTabs.length;
    showTeamView(teamTabs[next].dataset.teamView,true);
  });
}
// Linked editorial navigation can open a specific discipline directly.
for(const link of $$('[data-open-focus]'))link.addEventListener('click',()=>showFocus(link.dataset.openFocus));

// The book image comes from the publisher listing metadata rather than a recreated cover.
// If the listing does not expose an image, the neutral text treatment remains visible.
async function loadPublishedCover(){
  const cover = $('#amazon-book-cover'), fallback = $('#book-cover-fallback');
  if (!cover || !fallback) return;
  const bookLink = $('.book-copy a[href^="https://amzn.eu/"]');
  if (!bookLink) return;
  try {
    const api = 'https://api.microlink.io?url='+encodeURIComponent(bookLink.href);
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(),6000);
    let response;
    try { response=await fetch(api,{signal:controller.signal,mode:'cors'}); }
    finally { clearTimeout(timeout); }
    if(!response.ok) return;
    const json=await response.json();
    const image=json?.data?.image;
    const url=safeUrl(typeof image==='string'?image:image?.url||'');
    if(!url || !/^https:\/\//.test(url))return;
    const picture = new Image();
    picture.onload=()=>{
      // Generic site logos are not substitutes for a book cover.
      const ratio=picture.naturalWidth/picture.naturalHeight;
      if(picture.naturalHeight<200 || ratio<.48 || ratio>.9)return;
      cover.src=url;
      cover.hidden=false;
      fallback.hidden=true;
      $('#book-cover-frame').classList.add('has-cover');
    };
    picture.src=url;
  } catch {/* Keep text fallback. */}
}
loadPublishedCover();

function showDetail(entry) {
  $('#detail-category').textContent = entry.category || 'Note';
  $('#detail-title').textContent = entry.title || 'Project details';
  $('#detail-status').textContent = entry.status || '';
  $('#detail-body').textContent = entry.body || entry.summary || '';
  const link = $('#detail-link');
  const url = safeUrl(entry.resource_url || '');
  link.hidden = !url;
  if (url) link.href = url; else link.removeAttribute('href');
  dialog.showModal();
}

function entryVisible(entry){
  // Prevent old starter material from resurfacing if a database still contains it.
  // Keep superseded starter research and manuscript entries out of the public archive.
  const retiredPattern = /oxy\s*gonum|whispers.{0,45}mystic/i;
  const bodyText = [entry.title,entry.summary,entry.body].join(' ');
  return entry.published !== false && !['oxy','realms'].includes(String(entry.id)) && !retiredPattern.test(bodyText);
}
function render() {
  const query = $('#search').value.toLocaleLowerCase().trim();
  const filtered = entries.filter(e => entryVisible(e) && (selected === 'all' || e.category === selected) && [e.title,e.summary,e.body].join(' ').toLocaleLowerCase().includes(query));
  const grid = $('#entries'); grid.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement('p'); empty.className = 'empty';
    empty.textContent = query ? 'No matching entries. Try a different search.' : 'No entries in this category yet.';
    grid.append(empty); return;
  }
  for (const entry of filtered) {
    const card = document.createElement('article'); card.className = 'entry';
    const category = document.createElement('span'); category.className = 'entry-category';
    category.textContent = entry.category + ' / ' + (entry.status || 'Note');
    const title = document.createElement('h3'); title.textContent = entry.title;
    const summary = document.createElement('p'); summary.textContent = entry.summary || '';
    const button = document.createElement('button'); button.className = 'arrow-link'; button.type = 'button';
    button.append(document.createTextNode('View details ')); const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');button.append(arrow);
    button.addEventListener('click', () => showDetail(entry));
    card.append(category,title,summary,button);grid.append(card);
  }
}
for (const button of $$('[data-filter]')) button.addEventListener('click', () => {
  selected = button.dataset.filter;
  for (const other of $$('[data-filter]')) {
    other.classList.toggle('active', other === button);
    other.setAttribute('aria-pressed', String(other === button));
  }
  render();
});
$('#search').addEventListener('input',render);
$('#menu').addEventListener('click', () => {
  const menu = $('#navigation');const open = menu.classList.toggle('open');
  $('#menu').setAttribute('aria-expanded',String(open));
});
$('#navigation').addEventListener('click', event => {
  if (event.target.closest('a')) {
    $('#navigation').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');
  }
});
window.addEventListener('keydown', event => {
  if(event.key==='Escape' && $('#navigation').classList.contains('open')) {
    $('#navigation').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');$('#menu').focus();
  }
});
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}
});
$('[data-project="health"]').addEventListener('click',()=>showDetail({
  category:'Health technology',title:'Health information systems',status:'Concept',
  body:'A proposed information system for health facilities, with service records, medicine-use reporting and aggregate health indicators. Access control and patient-data protection are central design requirements.'
}));
$('#year').textContent = new Date().getFullYear();

$('#copy-email').addEventListener('click',async event=>{
  const target=event.currentTarget;const oldText=target.firstChild?.textContent;
  try {
    if (!navigator.clipboard?.writeText) throw Error('Clipboard unavailable');
    await navigator.clipboard.writeText(target.dataset.email);
    $('#copy-status').textContent='Email address copied.';
    target.firstChild.textContent='Email copied ';
  } catch {
    $('#copy-status').textContent='Could not copy automatically. Select the email address above instead.';
  }
  if(oldText)window.setTimeout(()=>{target.firstChild.textContent=oldText;},1700);
});

function updateProgress(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  $('#reading-progress').style.width=(max>0?Math.min(100,window.scrollY/max*100):0)+'%';
}
window.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
if('IntersectionObserver' in window){
  document.documentElement.classList.add('js');
  const observer=new IntersectionObserver((items)=>{for(const item of items){if(item.isIntersecting){item.target.classList.add('in-view');observer.unobserve(item.target);}}},{rootMargin:'0px 0px -60px 0px',threshold:.07});
  for(const item of $$('.reveal'))observer.observe(item);
}else{for(const item of $$('.reveal'))item.classList.add('in-view');}

// Subtle pointer response for the brand mark.
const heroArt=$('#hero-aside');
if(window.matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
  heroArt.addEventListener('pointermove', event=>{
    const r=heroArt.getBoundingClientRect();
    heroArt.style.setProperty('--gx',((event.clientX-r.left)/r.width-.5)*24+'px');
    heroArt.style.setProperty('--gy',((event.clientY-r.top)/r.height-.5)*24+'px');
  },{passive:true});
  heroArt.addEventListener('pointerleave',()=>{heroArt.style.setProperty('--gx','0px');heroArt.style.setProperty('--gy','0px');});
}

render();
async function loadCloudEntries(){
  if(!connected)return;
  try {
    const url=config.supabaseUrl.replace(/\/$/,'')+'/rest/v1/greylad_entries?select=*&published=eq.true&order=created_at.desc';
    const response=await fetch(url,{headers:{apikey:config.supabasePublishableKey}});
    if(!response.ok)throw Error('Could not load cloud entries');
    const remote=await response.json();
    if(!Array.isArray(remote))throw Error('Unexpected cloud data');
    // Editorial records are always present even if the remote database has no matching posts.
    // Remote entries may override bundled entries by ID; otherwise both collections remain visible.
    const merged=new Map(bundledEntries.map(e=>[String(e.id),e]));
    for(const entry of remote){if(entry&&typeof entry==='object'&&entry.published)merged.set(String(entry.id),entry);}
    entries=[...merged.values()];render();
  } catch {
    $('#library-status').textContent='Live updates are temporarily unavailable. Showing the current editorial archive.';
  }
}
loadCloudEntries();
