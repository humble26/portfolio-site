# 个人项目工作室 · 产品展示站(多页版)

`E:\harness` 工作区 13 个自用项目的展示站点。纯静态,零外部依赖。

> 本目录是 `10-作品集站点` 下的**多页增强版**,与同级的 `web/`(2026-09 的单页版)并存。
> 两版互不影响,各自可独立打开。
> 注意:上一级目录的 `.个人项目工作室 · 桌面工具作品集.qoder.site` 描述符由工具维护,不可移动、改名或手改。

## 快速开始

```bash
cd E:/harness/10-作品集站点/site
python -m http.server 8000
# 打开 http://localhost:8000
```

或直接双击 `index.html`(所有路径均为相对路径,`file://` 下也能打开)。

## 页面结构

| 文件 | 内容 |
|---|---|
| `index.html` | 首页:hero(05 真实界面)、精选 4 个、五步工作流摘要、13 个项目一览、素材说明 |
| `projects/index.html` | 13 个项目总览 + 技术栈分布 + 形态与依赖对照表 |
| `projects/*.html` | 13 个详情页,**由脚本生成,不要手改** |
| `how-it-works.html` | 工作流页:05 五步全链路 + 11 算力链路,全部实拍截图 |
| `about.html` | 素材标注规则、数字出处、工程共性、使用说明 |

## 架构:单一数据源

```
projects.js        ← 唯一数据源:13 个项目的元数据、文案、指标、截图引用
   ↓
build-pages.js     ← node build-pages.js → 生成 13 个详情页
   ↓
projects/*.html

app.js             ← 主题切换、导航、组件渲染、程序化示意图(MOCKS)
styles.css         ← 设计令牌、深色模式、响应式
verify-site.js     ← Playwright 渲染验证(截图 + 控制台错误 + 移动端溢出)
```

**改内容只改 `projects.js`**,然后跑 `node build-pages.js`。不要手改详情页 HTML,下次生成会覆盖。

新增项目:在 `projects.js` 加一条 → `node build-pages.js` → 首页与总览页自动跟上。

## 素材标注规则(重要)

页面上的图分三类,**逐张标注,不合并、不含糊**:

| 类型 | 数量 | 标注 | 说明 |
|---|---|---|---|
| 实拍截图 | 14 张 + 1 GIF | 绿色 `.shot-note.real` | 4 个项目实际运行界面:05(7)、06(2+1 GIF)、11(3)、15(1) |
| 界面示意 | 9 个项目 | 橙色 `.shot-note.mock` | 按 README 描述的界面结构程序化绘制,**不代表截图原貌** |
| 结构示意 | 1 个项目(09) | 中性 `.shot-note` | 可交互 HTML 源文件,非桌面应用也非截图 |

示意图定义在 `app.js` 的 `MOCKS` 对象里,新增项目时在同处添加。

## 数字出处

站内每个数字都能对账,只有三类来源:**实际界面截图**、**项目 README 自述**、**自动化测试产物**。

- 541 / 539 / 529 —— 05 首页实拍
- 32/32 瓦片、2 节点 —— 11 仪表盘实拍 + `e2e-result.json`
- 几何验证码四题型 —— `geo_captcha run --n 200 --seed 20261003`,800 例可复现
- 98.0% —— jAccount 留出集,README 注明已确认为该字体数据密度边界

## 为什么是 13 个而不是 15 个

工作区编号 `01`、`03`–`09`、`11`–`15` 是 13 个项目本体(编号 02 未列入展示)。`10-作品集站点` 是站点本身(不是被展示的产品),`90`–`95` 是归档区与副产物,`_工作区索引` 是整理脚本与报告。

## 验证

```bash
# 先起服务
python -m http.server 8123 --bind 127.0.0.1

# 再跑验证(需 playwright-core 与 Chromium)
NODE_PATH=<workspace>/node_modules \
CHROMIUM_PATH="$LOCALAPPDATA/ms-playwright/chromium-1243/chrome-win64/chrome.exe" \
node verify-site.js http://127.0.0.1:8123
```

检查项:9 个代表页面 × (导航/main/页脚/H1/坏图/JS 错误/空 section)+ 深色模式 + 移动端横向溢出。截图输出到 `_verify/`。

## 设计

- 亮 / 暗 / 跟随系统三态,`localStorage` 记忆,键盘 `1` `2` `3` 切换
- 靛蓝主色取自 05 界面深蓝与 11 仪表盘
- 截图统一套 CSS 浏览器边框组件(`.browser-frame`),不截浏览器工具栏
- `prefers-reduced-motion` 下关闭 hero 浮动与所有动画
- 移动端 620px 断点:`.step` 与 `.mock` 转单列,避免内嵌截图撑破视口

## 说明

内容为个人项目记录,非商业用途。涉及第三方服务的项目(05 需自带 LLM API Key、07 同步网页版数据)可用性取决于对应服务方。
