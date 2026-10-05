/* ============================================================
   app.js — 主题切换、导航、页面渲染
   所有项目页从 projects.js 的 PROJECTS 动态生成,单一数据源。
   ============================================================ */

/* ---------- 主题:light / dark / system 三态 ---------- */
const THEME_KEY = "showcase-theme";
const Theme = {
  get() {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : "system";
  },
  effective(mode = this.get()) {
    if (mode === "system") {
      return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return mode;
  },
  set(mode) {
    localStorage.setItem(THEME_KEY, mode);
    this.apply(mode);
  },
  apply(mode = this.get()) {
    const eff = this.effective(mode);
    if (eff === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    this.syncButtons(mode);
  },
  syncButtons(mode) {
    document.querySelectorAll(".theme-toggle button").forEach(b => {
      b.setAttribute("aria-pressed", String(b.dataset.mode === mode));
    });
  }
};

/* 提前应用主题,避免首屏闪白 */
Theme.apply();

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (Theme.get() === "system") Theme.apply();
});

/* ---------- 通用工具 ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const statusTag = p => {
  const map = {
    active: ["tag-live", "● 活跃"],
    done: ["", "已交付"],
    archived: ["", "已归档"]
  };
  const [cls, label] = map[p.status] || ["", p.statusLabel || ""];
  return `<span class="tag ${cls}">${esc(label)}</span>`;
};

/* 浏览器边框容器。real=true 时是实拍截图,mock 时按 kind 区分标注 */
function shotFrame(src, cap, real, kind) {
  if (kind === "mock" || kind === "interactive") {
    const note = kind === "interactive"
      ? `<div class="shot-note">
           <strong>结构示意</strong>
           <span>本项目是<strong>可交互 HTML 源文件</strong>,不是桌面应用,也未留存截图。
           上图按其分镜表的真实结构示意(幕 → 镜头 → 时长),源文件双击即可在浏览器打开交互。</span>
         </div>`
      : `<div class="shot-note mock">
           <strong>界面示意</strong>
           <span>本项目为桌面应用,尚未留存实拍截图。此处按其真实界面结构与配色程序化绘制,布局与文案以 README 描述为准。</span>
         </div>`;
    return `<div class="mock">${MOCKS[src]()}</div>${note}`;
  }
  return `
    <div class="browser-frame">
      <div class="browser-frame-bar">
        <span class="browser-frame-dot"></span>
        <span class="browser-frame-dot"></span>
        <span class="browser-frame-dot"></span>
        <span class="browser-frame-url">${esc(cap || "应用界面")}</span>
      </div>
      <img src="${esc(src)}" alt="${esc(cap || "应用界面")}" loading="lazy">
    </div>
    <div class="shot-note real">
      <strong>实拍截图</strong>
      <span>${esc(cap || "来自项目实际运行界面")}</span>
    </div>`;
}

/* 程序化 UI 示意图 —— 按各项目 README 描述的真实界面结构绘制 */
const MOCKS = {
  workbench: () => `
    <div class="mock-bar"><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="t">桌面工作台 v1.9.1</span></div>
    <div class="mock-body">
      <div class="mock-side">
        <div class="row on">📌 快速添加</div>
        <div class="row">📋 剪贴板历史</div>
        <div class="row">📁 文件整理</div>
        <div class="row">✅ 待办 / 便签</div>
        <div class="row">⏱ 打卡统计</div>
        <div class="row">🤖 AI 余额</div>
      </div>
      <div class="mock-main">
        <div class="mock-pane">
          <div class="mock-h">快速添加</div>
          <div class="mock-input">随手记一句…（支持拖入图片、截图 OCR）</div>
          <span class="mock-btn">保存</span><span class="mock-btn ghost">粘贴截图</span>
        </div>
        <div class="mock-cards">
          <div class="mock-card"><div class="n">12</div><div class="l">待办事项</div></div>
          <div class="mock-card"><div class="n">48</div><div class="l">剪贴板条目</div></div>
          <div class="mock-card"><div class="n">6</div><div class="l">本周打卡</div></div>
        </div>
      </div>
    </div>`,

  lottery: () => `
    <div class="mock-bar"><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="t">抽签点名</span></div>
    <div class="mock-body">
      <div class="mock-main" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px">
        <div style="width:100%;max-width:340px;background:var(--bg-subtle);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center">
          <div class="mock-line" style="height:20px;background:var(--border)"></div>
          <div style="background:var(--accent-light);border-radius:6px;padding:7px;margin:5px 0"><b>◀ 王小明 ▶</b></div>
          <div class="mock-line" style="height:20px;background:var(--border)"></div>
          <div class="mock-line" style="height:20px;background:var(--border)"></div>
        </div>
        <span class="mock-btn">开始 / 停止（空格）</span>
      </div>
    </div>`,

  captcha: () => `
    <div class="mock-bar"><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="t">jAccount 验证码识别</span></div>
    <div class="mock-body">
      <div class="mock-main">
        <div class="mock-pane" style="text-align:center">
          <div class="mock-h">识别结果</div>
          <div style="font-size:2rem;letter-spacing:.5rem;font-weight:800;font-family:var(--mono);color:var(--primary)">7 4 2 9</div>
          <div class="muted" style="font-size:.72rem;margin-top:6px">ResNet-20 · ONNX Runtime Web · 全本地推理</div>
        </div>
        <div class="mock-cards">
          <div class="mock-card"><div class="n">98.0%</div><div class="l">留出集准确率</div></div>
          <div class="mock-card"><div class="n">520</div><div class="l">张统一真值集</div></div>
          <div class="mock-card"><div class="n">0</div><div class="l">次上报</div></div>
        </div>
      </div>
    </div>`,

  "sjtu-link": () => `
    <div class="mock-bar"><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="t">交我导 v2.6.0</span></div>
    <div class="mock-body">
      <div class="mock-side">
        <div class="row on">⭐ 收藏</div>
        <div class="row">🌐 网站</div>
        <div class="row">📢 公众号</div>
        <div class="row">🎓 社团</div>
        <div class="row">⏰ 日程</div>
      </div>
      <div class="mock-main">
        <div class="mock-input">搜索拼音 / 首字母 / 缩写…（Ctrl+K）</div>
        <div class="mock-cards" style="grid-template-columns:repeat(3,1fr)">
          <div class="mock-card"><div class="n" style="font-size:.86rem">教务系统</div><div class="l">本科生选课</div></div>
          <div class="mock-card"><div class="n" style="font-size:.86rem">jAccount</div><div class="l">统一身份认证</div></div>
          <div class="mock-card"><div class="n" style="font-size:.86rem">交我办</div><div class="l">校园事务服务</div></div>
        </div>
      </div>
    </div>`,

  md2word: () => `
    <div class="mock-bar"><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="t">Markdown → Word v1.4.1</span></div>
    <div class="mock-body" style="flex-direction:column">
      <div style="display:flex;gap:8px;padding:10px 14px;border-bottom:1px solid var(--border);flex-wrap:wrap">
        <span class="mock-btn">导出 .docx</span><span class="mock-btn ghost">.doc</span><span class="mock-btn ghost">.tex</span>
      </div>
      <div style="display:flex;flex:1">
        <div class="mock-main" style="border-right:1px solid var(--border)">
          <div class="mock-h">Markdown 输入</div>
          <div class="mock-line" style="width:80%"></div>
          <div class="mock-line" style="width:65%"></div>
          <div class="mock-line" style="width:45%"></div>
        </div>
        <div class="mock-main">
          <div class="mock-h">转换预览</div>
          <div class="mock-line" style="width:70%;height:12px;background:var(--primary-light)"></div>
          <div class="mock-line" style="width:85%"></div>
          <div class="mock-line" style="width:55%"></div>
        </div>
      </div>
    </div>`,

  token: () => `
    <div class="mock-bar"><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="t">Token 领取助手</span></div>
    <div class="mock-body" style="flex-direction:column">
      <div class="mock-main">
        <div class="mock-pane">
          <div class="mock-h">① 应用</div>
          <div class="mock-line" style="width:90%">WorkBuddy<span class="muted"> — 每天 ▾</span></div>
          <div class="mock-line" style="width:90%">TraeWork CN<span class="muted"> — 仅工作日 ▾</span></div>
          <div class="mock-line" style="width:75%">ZCode<span class="muted"> — 每天 ▾</span></div>
        </div>
        <div class="mock-pane">
          <div class="mock-h">② 定时计划</div>
          <span class="mock-btn">08:00</span><span class="mock-btn ghost">12:00</span><span class="mock-btn ghost">20:00</span>
        </div>
      </div>
    </div>`,

  /* 09 军训视频脚本:分镜表是交互 HTML,此处示意其镜头时间轴结构 */
  storyboard: () => `
    <div class="mock-bar"><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="t">拍摄分镜表 · 淬火青春(两幕版)</span></div>
    <div class="mock-body" style="flex-direction:column">
      <div class="mock-main">
        <div class="mock-pane">
          <div class="mock-h">第一幕 · 淬火</div>
          <div class="mock-line" style="width:88%">镜头 01 · 03s · 晨光扫过空荡的训练场</div>
          <div class="mock-line" style="width:72%">镜头 02 · 05s · 列队方阵俯拍</div>
          <div class="mock-line" style="width:80%">镜头 03 · 04s · 教官口令特写</div>
        </div>
        <div class="mock-pane">
          <div class="mock-h">第二幕 · 淬炼成钢</div>
          <div class="mock-line" style="width:78%">镜头 04 · 06s · 正步行进跟拍</div>
          <div class="mock-line" style="width:85%">镜头 05 · 04s · 汗水与口号</div>
        </div>
        <div class="mock-cards">
          <div class="mock-card"><div class="n">2</div><div class="l">幕</div></div>
          <div class="mock-card"><div class="n">39s</div><div class="l">封面版时长</div></div>
          <div class="mock-card"><div class="n">2</div><div class="l">套 HTML 页面</div></div>
        </div>
      </div>
    </div>`,


  audio: () => `
    <div class="mock-bar"><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="t">音频转写工具 — 本地推理</span></div>
    <div class="mock-body">
      <div class="mock-main">
        <div class="mock-pane" style="text-align:center;border-style:dashed">
          <div class="mock-h">把音频文件或整个文件夹拖进这里</div>
          <div class="muted" style="font-size:.74rem">faster-whisper · CPU int8 · 音频不出本机</div>
        </div>
        <div class="mock-cards">
          <div class="mock-card"><div class="n">4</div><div class="l">输出格式</div></div>
          <div class="mock-card"><div class="n">int8</div><div class="l">量化等级</div></div>
          <div class="mock-card"><div class="n">0</div><div class="l">次上传</div></div>
        </div>
      </div>
    </div>`,

  update: () => `
    <div class="mock-bar"><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="browser-frame-dot"></span><span class="t">更新检查工具 — 只读</span></div>
    <div class="mock-body">
      <div class="mock-main">
        <div class="mock-pane">
          <div class="mock-h">SJTU Canvas Helper</div>
          <div class="mock-line" style="width:60%">本地 3.0.11 → 最新 3.0.12　<span style="color:#f59e0b">有更新</span></div>
        </div>
        <div class="mock-pane">
          <div class="mock-h">j-aide（交我汇）</div>
          <div class="mock-line" style="width:60%">官方源暂无信息（HTTP 404）</div>
        </div>
      </div>
    </div>`
};

/* ---------- 导航 ---------- */
function renderNav(active) {
  const links = [
    ["index.html", "首页"],
    ["projects/index.html", "全部项目"],
    ["how-it-works.html", "工作流"],
    ["about.html", "关于"]
  ];
  return `
    <nav class="nav">
      <div class="nav-inner">
        <a class="nav-brand" href="../index.html">
          <span class="nav-logo">工</span>
          <span>个人项目工作室</span>
        </a>
        <button class="nav-burger" aria-label="打开菜单" aria-expanded="false">☰</button>
        <div class="nav-links">
          ${links.map(([href, label]) =>
            `<a href="${href}"${active === href ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
          <span class="theme-toggle" role="group" aria-label="主题">
            <button data-mode="light" aria-pressed="false">亮</button>
            <button data-mode="dark" aria-pressed="false">暗</button>
            <button data-mode="system" aria-pressed="false">跟随</button>
          </span>
        </div>
      </div>
    </nav>`;
}

function renderFooter(depth = 0) {
  const up = depth ? "../" : "";
  return `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <strong>个人项目工作室</strong><br>
          13 个自用桌面工具与作品 · 内容为个人项目记录,非商业用途
        </div>
        <div class="footer-links">
          <a href="${up}index.html">首页</a>
          <a href="${up}projects/index.html">全部项目</a>
          <a href="${up}how-it-works.html">工作流</a>
          <a href="${up}about.html">关于</a>
        </div>
      </div>
    </footer>`;
}

/* ---------- 项目卡片(用于首页与总览页) ---------- */
function projectCard(p, opts = {}) {
  const href = `${opts.base || ""}${p.slug}.html`;
  const cover = p.shots && p.shots.length
    ? `<div class="card-shot"><img src="${opts.imgBase || ""}screenshots/projects/${esc(p.shots[0].src)}" alt="${esc(p.name)}界面" loading="lazy"></div>`
    : "";
  return `
    <a class="card reveal" href="${href}">
      <span class="card-num">${esc(p.id)}</span>
      ${cover}
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.lede)}</p>
      <div class="card-tags">
        ${statusTag(p)}
        ${p.shots && p.shots.length
          ? `<span class="tag">${p.shots.length} 张实拍</span>`
          : `<span class="tag">桌面应用</span>`}
        <span class="tag">${esc(p.version)}</span>
      </div>
    </a>`;
}

/* ---------- 详情页渲染 ---------- */
function renderProjectPage(slug) {
  const p = BY_SLUG[slug];
  if (!p) return null;

  const idx = PROJECTS.findIndex(x => x.slug === slug);
  const prev = PROJECTS[idx - 1];
  const next = PROJECTS[idx + 1];

  /* 视觉区:有实拍用实拍,无实拍用程序化示意图 */
  let visual;
  if (p.shots && p.shots.length) {
    visual = shotFrame(`../screenshots/projects/${p.shots[0].src}`, p.shots[0].cap, true);
  } else if (p.mock) {
    visual = shotFrame(p.mock, null, false, p.mockKind || "mock");
  } else {
    visual = "";
  }

  const gallery = p.shots && p.shots.length > 1
    ? `<div class="shot-grid">${p.shots.slice(1).map(s =>
        `<figure>${shotFrame(`../screenshots/projects/${s.src}`, s.cap, true)}</figure>`).join("")}</div>`
    : "";

  const gifBlock = p.gif
    ? `<div class="shot-grid"><figure>${shotFrame(`../screenshots/projects/${p.gif.src}`, p.gif.cap, true)}</figure></div>`
    : "";

  const liveBlock = p.liveDemo
    ? `<div class="callout callout-warn">
         <strong>可交互预览:</strong>${esc(p.liveDemo.note)}——
         源文件在 <code>${esc(p.dir)}/${esc(p.liveDemo.file)}</code>,双击即可在浏览器打开。
       </div>`
    : "";

  return `
<nav class="nav">
  <div class="nav-inner">
    <a class="nav-brand" href="../index.html"><span class="nav-logo">工</span><span>个人项目工作室</span></a>
    <button class="nav-burger" aria-label="打开菜单" aria-expanded="false">☰</button>
    <div class="nav-links">
      <a href="../index.html">首页</a>
      <a href="index.html" aria-current="page">全部项目</a>
      <a href="../how-it-works.html">工作流</a>
      <a href="../about.html">关于</a>
      <span class="theme-toggle" role="group" aria-label="主题">
        <button data-mode="light" aria-pressed="false">亮</button>
        <button data-mode="dark" aria-pressed="false">暗</button>
        <button data-mode="system" aria-pressed="false">跟随</button>
      </span>
    </div>
  </div>
</nav>

<main>
  <section class="project-hero">
    <div class="wrap">
      <div class="crumbs"><a href="../index.html">首页</a> / <a href="index.html">全部项目</a> / ${esc(p.name)}</div>
      <h1>${esc(p.id)} · ${esc(p.name)}</h1>
      <p class="project-lede">${esc(p.lede)}</p>
      <div class="project-meta">
        <div class="meta-item"><span class="meta-label">版本</span><span class="meta-value">${esc(p.version)}</span></div>
        <div class="meta-item"><span class="meta-label">状态</span><span class="meta-value">${esc(p.statusLabel)}</span></div>
        <div class="meta-item"><span class="meta-label">源码目录</span><span class="meta-value mono">${esc(p.dir)}</span></div>
        <div class="meta-item"><span class="meta-label">技术栈</span><span class="meta-value">${p.stack.map(s => `<span class="tag">${esc(s)}</span>`).join(" ")}</span></div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap">
      ${visual}
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="prose">
        <h2>它解决什么</h2>
        <p>${esc(p.problem)}</p>
        <h2>怎么做的</h2>
        <p>${esc(p.solution)}</p>
        ${liveBlock}
        ${p.metrics && p.metrics.length ? `
        <h2 class="anchor-target">关键数字</h2>
        <div class="metrics">
          ${p.metrics.map(m => `
            <div class="metric">
              <div class="metric-num">${esc(m.n)}</div>
              <div class="metric-label">${esc(m.l)}</div>
              ${m.note ? `<div class="metric-note">${esc(m.note)}</div>` : ""}
            </div>`).join("")}
        </div>` : ""}
        <h2 class="anchor-target">功能</h2>
        <ul>
          ${p.features.map(f => `<li><strong>${esc(f.t)}</strong> —— ${esc(f.d)}</li>`).join("")}
        </ul>
        ${gallery}
        ${gifBlock}
        ${p.notes && p.notes.length ? `
        <h2>工程细节</h2>
        ${p.notes.map(n => `<div class="callout">${esc(n)}</div>`).join("")}` : ""}
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap">
      <div class="pager">
        ${prev ? `<a href="${prev.slug}.html"><span class="dir">← 上一个</span><span class="name">${esc(prev.id)} ${esc(prev.name)}</span></a>` : "<span></span>"}
        ${next ? `<a class="next" href="${next.slug}.html"><span class="dir">下一个 →</span><span class="name">${esc(next.id)} ${esc(next.name)}</span></a>` : ""}
      </div>
    </div>
  </section>
</main>

${renderFooter(1)}`;
}

/* ---------- 交互绑定 ---------- */
function bindInteractions() {
  /* 主题按钮 */
  document.querySelectorAll(".theme-toggle button").forEach(btn => {
    btn.addEventListener("click", () => Theme.set(btn.dataset.mode));
  });

  /* 移动端菜单 */
  const burger = document.querySelector(".nav-burger");
  const links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }

  /* 键盘快捷键:1/2/3 切主题 */
  document.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "1") Theme.set("light");
    if (e.key === "2") Theme.set("dark");
    if (e.key === "3") Theme.set("system");
  });
}

document.addEventListener("DOMContentLoaded", bindInteractions);
