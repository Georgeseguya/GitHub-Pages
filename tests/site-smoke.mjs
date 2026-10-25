import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
const file=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=file('dist/index.html');
const script=file('dist/app.js');
const css=file('dist/styles.css');
const content=file('dist/content.js');

test('hero presents the intended copy',()=>{
  assert.match(html,/A curious mind\./);
  assert.match(html,/A world of<br><em>possibilities\.<\/em>/);
});

test('the five disciplines are open-ended and ordered correctly',()=>{
  const keys=['pharm','tech','health','research','writing'];
  const positions=keys.map(key=>html.indexOf(`id="disc-tab-${key}"`));
  assert.ok(positions.every(pos=>pos>=0),'every discipline is present');
  assert.deepEqual([...positions].sort((a,b)=>a-b),positions);
  for(const key of keys){assert.match(script,new RegExp('\\b'+key+': \\{'));}
  assert.doesNotMatch(html,/OUR FIELDS|VISUAL STUDY|001—004/i);
});

test('the actual supplied book cover is bundled with the website',()=>{
  const cover=new URL('../dist/assets/beyond-the-goal-cover.webp',import.meta.url);
  assert.ok(statSync(cover).size>100000,'the book cover contains actual image data');
  assert.match(html,/src="assets\/beyond-the-goal-cover.webp"/);
  assert.match(html,/https:\/\/amzn.eu\/d\/06k6AIZ5/);
  assert.doesNotMatch(script,/loadPublishedCover|api\.microlink\.io/);
});

test('all interactive areas have functional application handlers',()=>{
  for(const pattern of [/selectDiscipline\(/,/selectMemberView\(/,/renderArchive\(/,/showDetail\(/,/menu\.addEventListener\('click'/,/\#copy-email'\)\.addEventListener\('click'/]) assert.match(script,pattern);
  for(const key of ['overview','technology','pharma','work'])assert.match(html,new RegExp(`id="member-tab-${key}"`));
  for(const key of ['research','technology','health','writing'])assert.match(html,new RegExp(`data-filter="${key}"`));
});

test('team covers software skills and pharmaceutical experience',()=>{
  assert.match(script,/JavaScript, HTML, CSS, databases and hosted services/);
  assert.match(script,/Supabase and PostgreSQL/);
  assert.match(script,/GMP manufacturing/);
  assert.match(html,/Founder &amp; Head of Development/);
  assert.doesNotMatch(html,/university|school|college/i);
});

test('neutral brand palette and contact links remain',()=>{
  assert.match(css,/#34363B/i);
  assert.match(css,/#F6F6F4/i);
  assert.match(css,/#A8ADB4/i);
  assert.match(html,/mailto:georgeseguya@yahoo\.com/);
  assert.match(html,/tel:\+2567770447726/);
});

test('public source contains no retired material or tool attribution',()=>{
  const publicText=html+'\n'+content+'\n'+script;
  assert.doesNotMatch(publicText,/ChatGPT|OpenAI|Oxygonum sinuatum|Whispers of the Mystic Realms/i);
  assert.doesNotMatch(html,/Personal contact details|domain email addresses|An independent studio \/ Kampala/i);
});

test('editor and backend remain separate from the public website',()=>{
  assert.match(file('dist/admin.html'),/id="editor"/);
  assert.match(file('dist/config.js'),/supabaseUrl:\s*''/);
  assert.match(file('vercel.json'),/"outputDirectory": "dist"/);
});
