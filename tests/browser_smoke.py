from pathlib import Path
import base64, re, json, traceback
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).parent.parent/'dist'
html=(root/'index.html').read_text()
css=(root/'styles.css').read_text()
css=re.sub(r'^@import[^\n]+\n', '',css, count=1)
tokens=(root/'brand-tokens.css').read_text()
for f in ['styles.css','brand-tokens.css']:
 html=html.replace(f'<link rel="stylesheet" href="{f}">','')
html=html.replace('</head>',f'<style>{tokens}\n{css}</style></head>')
for f in ['config.js','content.js','app.js']:
 html=html.replace(f'<script defer src="{f}"></script>','')
for f in ['config.js','content.js','app.js']:
 js=(root/f).read_text()
 html=html.replace('</body>',f'<script>{js}</script></body>')
for f in ['favicon.svg','spiral-g.svg','spiral-g-light.svg','assets/beyond-the-goal-cover.webp']:
 p=root/f; mime='image/webp' if f.endswith('webp') else 'image/svg+xml'
 data='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
 html=html.replace(f'src="{f}"',f'src="{data}"')

out=Path(__file__).parent.parent/'previews';out.mkdir(exist_ok=True)
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(1440,900),(390,844),(320,740)]:
  page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda err: errors.append(str(err)))
  page.set_content(html,wait_until='load',timeout=30000)
  page.wait_for_timeout(180)
  def check(name, assertion):
   try:
    assert assertion(),name
    results.append({'width':width,'check':name,'pass':True})
   except Exception as err:
    results.append({'width':width,'check':name,'pass':False,'error':str(err)})
  check('no errors on load',lambda:not errors)
  check('correct tagline',lambda:'A curious mind.' in page.locator('h1').inner_text() and 'possibilities.' in page.locator('h1').inner_text())
  check('book cover embedded and loaded',lambda:page.locator('.book-cover').evaluate('(img) => img.complete && img.naturalWidth === 943'))
  check('no horizontal overflow',lambda:page.evaluate('document.documentElement.scrollWidth <= innerWidth + 2'))
  check('book cover links to Amazon',lambda:page.locator('.book-cover-wrap').get_attribute('href')=='https://amzn.eu/d/06k6AIZ5')
  check('navigation anchor targets exist',lambda:page.evaluate('''()=>[...document.querySelectorAll('a[href^=\"#\"]')].every(x => ['#','#top'].includes(x.getAttribute('href')) || !!document.querySelector(x.getAttribute('href')))'''))
  page.locator('.book-cover').scroll_into_view_if_needed()
  page.wait_for_timeout(200)
  page.screenshot(path=str(out/f'home_{width}.png'),full_page=True)
  # Five discipline buttons both pointer and key, and details display
  for key,name in [('tech','Technology'),('pharm','Pharmaceutics'),('health','Health'),('research','Research'),('writing','Writing')]:
   page.locator(f'[data-discipline="{key}"]').click()
   check(f'discipline {name}',lambda key=key,name=name:page.locator('#discipline-eyebrow').text_content()==name and page.locator(f'[data-discipline="{key}"]').get_attribute('aria-selected')=='true')
  page.locator('[data-discipline="pharm"]').focus()
  page.keyboard.press('ArrowDown')
  check('keyboard discipline navigation',lambda:page.locator('[data-discipline="tech"]').get_attribute('aria-selected')=='true')
  # Archive filter
  page.locator('[data-filter="technology"]').click()
  check('archive technology filter',lambda:page.locator('.archive-entry').count()==1 and 'VybaCash' in page.locator('.archive-entry').inner_text())
  page.locator('[data-filter="all"]').click()
  page.locator('#search').fill('football')
  check('archive search',lambda:page.locator('.archive-entry').count()==1 and 'Beyond the Goal' in page.locator('.archive-entry').inner_text())
  page.locator('.archive-entry button').click()
  check('archive detail modal',lambda:page.locator('#detail').evaluate('(x)=>x.open') and 'Beyond the Goal' in page.locator('#detail-title').inner_text())
  page.locator('.dialog-close').click()
  check('dialog closes',lambda:not page.locator('#detail').evaluate('(x)=>x.open'))
  page.locator('#search').fill('')
  page.locator('[data-project="health"]').click()
  check('health project modal',lambda:page.locator('#detail').evaluate('(x)=>x.open') and 'Health data' in page.locator('#detail-title').inner_text())
  page.keyboard.press('Escape')
  check('modal escape closes',lambda:not page.locator('#detail').evaluate('(x)=>x.open'))
  page.locator('[data-project="pharm"]').click()
  check('pharm project modal',lambda:page.locator('#detail').evaluate('(x)=>x.open') and 'Materials' in page.locator('#detail-title').inner_text())
  page.locator('.dialog-close').click()
  page.locator('[data-select-discipline="health"]').click()
  check('hero rail opens Health',lambda:page.locator('#discipline-eyebrow').text_content()=='Health')
  page.locator('#copy-email').click()
  check('copy email gives feedback',lambda:bool(page.locator('#copy-status').text_content().strip()))
  # Team tabs
  for key in ['technology','pharma','work','overview']:
   page.locator(f'[data-member-view="{key}"]').click()
   check(f'team {key} tab',lambda key=key:page.locator(f'[data-member-view="{key}"]').get_attribute('aria-selected')=='true' and len(page.locator('#member-detail').inner_text())>75)
  page.locator('[data-member-view="overview"]').focus();page.keyboard.press('ArrowRight')
  check('team keyboard navigation',lambda:page.locator('[data-member-view="technology"]').get_attribute('aria-selected')=='true')
  if width<980:
   page.locator('#menu-toggle').click()
   check('mobile menu opens',lambda:page.locator('#nav').get_attribute('class').find('is-open')>=0)
   page.locator('#nav a[href="#team"]').click()
   check('mobile menu closes on link',lambda:'is-open' not in page.locator('#nav').get_attribute('class'))
  else:
   check('desktop navigation visible',lambda:page.locator('#nav').is_visible())
  check('no javascript errors after interactions',lambda:not errors)
  page.close()
 browser.close()
(out/'browser_results.json').write_text(json.dumps(results,indent=2))
fail=[r for r in results if not r['pass']]
print('BROWSER RESULTS',len(results),'checks;',len(fail),'failures')
for r in fail:print(r)
raise SystemExit(1 if fail else 0)
