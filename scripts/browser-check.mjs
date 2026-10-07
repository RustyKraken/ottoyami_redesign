import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({channel:process.env.TEST_BROWSER || 'chrome',headless:true});
const context=await browser.newContext();
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400 && r.url().startsWith('http://127.0.0.1'))errors.push(`${r.status()} ${r.url()}`)});
const results=[];
for(const width of [375,390,430,768,1024,1280,1440,1920]){
 await page.setViewportSize({width,height:width<768?844:1000});
 await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 assert(!overflow,`No page overflow at ${width}`);
 assert.equal(await page.locator('h1').count(),1);
 // Scroll through the actual experience to load images and trigger one-time reveals.
 for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(70)}
 await page.waitForTimeout(1000);
 const broken=await page.locator('main img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
 assert.deepEqual(broken,[],`Images load at ${width}`);
 await page.locator('main img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
 await page.evaluate(()=>scrollTo(0,0));
 await page.waitForTimeout(500);
 if([390,1440].includes(width))await page.screenshot({path:`test-results/site-${width}.png`,fullPage:true});
 if(width<=1024){
  await page.locator('.menu-toggle').click();
  await page.locator('#main-navigation').waitFor({state:'visible'});
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  await page.locator('.menu-toggle').click();
  await page.locator('#main-navigation a[href="#kontakt"]').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 }
 results.push({width,overflow,brokenImages:broken.length});
 console.log(`Passed viewport ${width}px`);
}
await page.setViewportSize({width:1440,height:1000});
await page.locator('.gallery-open').first().click();
assert(await page.locator('dialog').evaluate(el=>el.open));
await page.keyboard.press('ArrowRight');
assert.equal(await page.locator('.lightbox-count').textContent(),'2 / 4');
await page.keyboard.press('Escape');
assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);
assert(await page.locator('.gallery-open').first().evaluate(el=>el===document.activeElement));
await page.emulateMedia({reducedMotion:'reduce'});
await page.reload({waitUntil:'networkidle'});
assert.equal(await page.locator('.petals').evaluate(el=>getComputedStyle(el).display),'none');
assert.equal(await page.locator('.tree-petals>span').first().evaluate(el=>getComputedStyle(el).animationName),'none');
const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
await writeFile('test-results/accessibility.json',JSON.stringify(a11y.violations,null,2));
await writeFile('test-results/browser.json',JSON.stringify({results,errors,accessibilityViolations:a11y.violations.length},null,2));
console.log(JSON.stringify({results,errors,accessibility:a11y.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))},null,2));
await browser.close();
assert.deepEqual(errors,[],'No runtime/network errors');
assert.equal(a11y.violations.length,0,'No automated WCAG A/AA violations');
