import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const script=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const content=readFileSync(new URL('../dist/content.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../dist/styles.css',import.meta.url),'utf8');
const doc=[html,script,content].join('\n');

test('discipline navigation stays open-ended and includes health',()=>{
  for(const key of ['pharm','health','research','writing','tech']){
    assert.match(html,new RegExp(`id="tab-${key}"`));
    assert.match(html,new RegExp(`data-focus="${key}"`));
    assert.match(script,new RegExp(`\\b${key}: \\{`));
  }
  assert.doesNotMatch(html,/FOUR FIELDS|OUR FIELDS|001—004|GL\s*\/\s*VISUAL STUDY/i);
});

test('company contact and no temporary notes',()=>{
  assert.match(html,/mailto:georgeseguya@yahoo\.com/);
  assert.match(html,/tel:\+2567770447726/);
  assert.doesNotMatch(html,/personal contact details are used for now|domain email addresses may be introduced/i);
});

test('team is tabbed and member roster can grow',()=>{
  assert.match(html,/class="team-roster"/);
  for(const view of ['profile','experience','projects']){
    assert.match(html,new RegExp(`id="team-tab-${view}"`));
    assert.match(script,new RegExp(`\\b${view}: \\{`));
  }
  assert.match(script,/team-view-panel/);
  assert.match(script,/ArrowRight/);
});

test('book link preserved and no imitated book cover is embedded',()=>{
  assert.match(html,/https:\/\/amzn\.eu\/d\/06k6AIZ5/);
  assert.match(html,/id="amazon-book-cover"/);
  assert.match(script,/loadPublishedCover/);
  assert.doesNotMatch(html,/The illustration is not its official cover|fictional cover/i);
});

test('unneeded numerals and vanity captions removed from public copy',()=>{
  assert.doesNotMatch(html,/An independent studio\s*<span>|ONE IDENTITY|GL \/ VISUAL STUDY|FIELD \/ 0[1-9]|\b0[1-9] \/ THE PRACTICE/i);
  assert.doesNotMatch(html,/<div class="micro-tags">/);
  assert.doesNotMatch(html,/<p class="small-contact-note">/);
  assert.doesNotMatch(html,/<a class="editor-link"/);
  assert.match(css,/\.team-workspace\{/);
});
