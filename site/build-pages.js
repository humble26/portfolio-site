/* build-pages.js — 从 projects.js + app.js 批量生成 15 个项目详情页
   单一数据源,避免手写 15 份重复 HTML 造成文案与截图路径漂移。
   用法:node build-pages.js                                                  */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const OUT = path.join(ROOT, "projects");

/* 读取数据层与应用层 */
const dataSrc = fs.readFileSync(path.join(ROOT, "projects.js"), "utf8");
const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

/* 在沙箱里执行两段脚本,拿到 PROJECTS / BY_SLUG / renderProjectPage */
const sandbox = {};
const fn = new Function("window", "document", "localStorage", "matchMedia", `
  ${dataSrc}
  ${appSrc}
  return { PROJECTS, renderProjectPage };
`);
/* app.js 顶层会调 Theme.apply() 并绑定 DOMContentLoaded,
   这里提供最小 stub 让其不抛错 —— 渲染函数本身不依赖这些。 */
const stubEl = () => ({
  setAttribute() {}, removeAttribute() {},
  querySelectorAll: () => [], addEventListener() {},
  classList: { toggle: () => false, add() {} },
  get innerHTML() { return ""; }, set innerHTML(_) {},
  matches: () => false, dataset: {}
});
const fakeMatchMedia = Object.assign(() => ({ matches: false, addEventListener() {} }), {
  matches: false, addEventListener() {}
});

const { PROJECTS, renderProjectPage } = fn(
  {},
  { documentElement: stubEl(), getElementById: stubEl, querySelectorAll: () => [], addEventListener() {} },
  { getItem: () => null, setItem() {} },
  fakeMatchMedia
);

/* 生成 */
let n = 0;
for (const p of PROJECTS) {
  const html = renderProjectPage(p.slug);
  if (!html) {
    console.error(`✗ 未知 slug: ${p.slug}`);
    process.exit(1);
  }
  const file = path.join(OUT, `${p.slug}.html`);
  fs.writeFileSync(file, `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.id} ${p.name} — 个人项目工作室</title>
<meta name="description" content="${p.lede.replace(/"/g, "&quot;")}">
<meta property="og:title" content="${p.id} ${p.name} — 个人项目工作室">
<meta property="og:description" content="${p.lede.replace(/"/g, "&quot;")}">
${p.shots && p.shots.length ? `<meta property="og:image" content="../screenshots/projects/${p.shots[0].src}">` : ""}
<meta name="theme-color" content="#3d5afe">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../styles.css">
</head>
<body>
${html}
<script src="../projects.js"></script>
<script src="../app.js"></script>
</body>
</html>
`, "utf8");
  n++;
  console.log(`✓ ${p.id} ${p.name} → projects/${p.slug}.html`);
}
console.log(`\n共生成 ${n} 个详情页`);
