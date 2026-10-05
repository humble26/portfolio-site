/* verify-site.js — 用真实 Chromium 渲染每个页面,截图 + 收集控制台错误
   用法:NODE_PATH=<workspace>/node_modules node verify-site.js <baseUrl> <outDir> */
const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

const BASE = process.argv[2] || "http://127.0.0.1:8123";
const OUT = process.argv[3] || path.join(__dirname, "_verify");

const PAGES = [
  ["index.html", "首页", true],
  ["projects/index.html", "项目总览", true],
  ["how-it-works.html", "工作流", true],
  ["about.html", "关于", true],
  ["projects/desktop-workbench.html", "01 桌面工作台", false],
  ["projects/bili-forgotten-curve.html", "05 遗忘曲线", true],
  ["projects/dormgrid.html", "11 宿舍超算", false],
  ["projects/geo-captcha.html", "15 几何验证码", false],
  ["projects/military-training-script.html", "09 军训脚本", false]
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    channel: undefined
  });

  let problems = 0;
  const report = [];

  for (const [url, name, full] of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const errors = [];

    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));
    page.on("requestfailed", r => errors.push("REQFAIL: " + r.url().split("/").slice(-2).join("/")));

    await page.goto(`${BASE}/${url}`, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(900);

    /* 关键结构断言 */
    const checks = await page.evaluate(async () => {
      /* 强制加载所有 lazy 图,避免把"未进视口"误判为坏图 */
      document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = "eager");
      await Promise.all([...document.querySelectorAll("img")].map(i => i.complete
        ? Promise.resolve()
        : new Promise(res => { i.addEventListener("load", res, { once: true });
                               i.addEventListener("error", res, { once: true });
                               setTimeout(res, 4000); })));
      const imgs = [...document.querySelectorAll("img")];
      return {
        nav: !!document.querySelector(".nav"),
        main: !!document.querySelector("main"),
        footer: !!document.querySelector(".footer"),
        h1: (document.querySelector("h1") || {}).textContent || "",
        imgsTotal: imgs.length,
        /* 真正的坏图:加载完成且宽度为 0 */
        imgsBroken: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src")),
        imgsNotLoaded: imgs.filter(i => !i.complete).length,
        mockCount: document.querySelectorAll(".mock").length,
        shotNoteReal: document.querySelectorAll(".shot-note.real").length,
        shotNoteMock: document.querySelectorAll(".shot-note.mock").length,
        bodyLen: document.body.innerText.length,
        /* 空 section 检测:有 class 但高度近 0 */
        emptySections: [...document.querySelectorAll("section")]
          .filter(s => s.offsetHeight < 40).length
      };
    });

    const bad = [];
    if (!checks.nav) bad.push("缺导航");
    if (!checks.main) bad.push("缺 main");
    if (!checks.footer) bad.push("缺页脚");
    if (!checks.h1.trim()) bad.push("缺 H1");
    if (checks.imgsBroken.length) bad.push("坏图: " + checks.imgsBroken.join(", "));
    if (checks.imgsNotLoaded) bad.push(checks.imgsNotLoaded + " 张图未加载");
    if (checks.bodyLen < 500) bad.push("正文过短 " + checks.bodyLen);
    if (errors.length) bad.push("JS错误: " + errors.slice(0, 3).join(" | "));

    const shot = path.join(OUT, url.replace(/[\/\\]/g, "_") + ".png");
    await page.screenshot({ path: shot, fullPage: !!full });

    report.push({ url, name, checks, bad, errors: errors.length });
    if (bad.length) problems += bad.length;

    console.log(
      `${bad.length ? "✗" : "✓"} ${name.padEnd(14)} ` +
      `图 ${checks.imgsTotal}(坏${checks.imgsBroken.length}) ` +
      `示意${checks.mockCount} 实拍标${checks.shotNoteReal} 空段${checks.emptySections} ` +
      `正文${checks.bodyLen}字` +
      (bad.length ? "  → " + bad.join("; ") : "")
    );

    await ctx.close();
  }

  /* 深色模式抽检 */
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: "dark"
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
  await page.waitForTimeout(700);
  const darkOk = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme") === "dark");
  await page.screenshot({ path: path.join(OUT, "dark_index.png"), fullPage: false });
  console.log(`${darkOk ? "✓" : "✗"} 深色模式 data-theme=${darkOk ? "dark" : "(未生效)"}`);
  if (!darkOk) problems++;
  await ctx.close();

  /* 移动端抽检 */
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true, hasTouch: true
  });
  const mp = await mctx.newPage();
  await mp.goto(`${BASE}/index.html`, { waitUntil: "load" });
  await mp.waitForTimeout(600);
  const overflow = await mp.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await mp.screenshot({ path: path.join(OUT, "mobile_index.png"), fullPage: false });
  console.log(`${overflow <= 2 ? "✓" : "✗"} 移动端横向溢出 ${overflow}px`);
  if (overflow > 2) problems++;
  await mctx.close();

  await browser.close();

  console.log(`\n截图输出: ${OUT}`);
  console.log(problems === 0 ? "✓ 全部检查通过" : `✗ 共 ${problems} 个问题`);
  process.exit(problems === 0 ? 0 : 1);
})();
