/* ============================================================
   projects.js — 13 个项目的唯一数据源
   所有页面(首页/总览/详情/工作流)都从这里读取,避免文案与截图路径分散。
   数据全部来自各项目 README、package.json、e2e-result.json 等实际来源。
   ============================================================ */

const PROJECTS = [
  {
    id: "01",
    slug: "desktop-workbench",
    name: "桌面工作台",
    dir: "01-桌面工作台",
    version: "v1.9.1",
    status: "active",
    statusLabel: "持续迭代",
    stack: ["Electron", "Node.js", "Tesseract.js", "原生 JS"],
    lede: "把散落在剪贴板、文件夹、便签和 AI 额度里的碎片,收进一个常驻桌面的工作台。",
    problem:
      "日常真正耗神的不是某一件大事,而是几十件小事:临时记一句、临时存一张图、临时查个路径、临时看还有多少额度。每一件单看都不值得开一个软件,但堆在一起就是持续的打断。",
    solution:
      "桌面覆盖层常驻在所有程序之上,快速添加 + 剪贴板历史 + 文件整理 + 打卡统计把这些碎片收进同一个数据仓库。主进程领域逻辑拆成 10 个可脱离 Electron 单测的模块,数据只落在本机。",
    features: [
      { t: "桌面覆盖层,随手可达", d: "不切换窗口就能记录,避免为了记一句话而打断手头的事。" },
      { t: "剪贴板历史 + 离线 OCR", d: "内置 chi_sim + eng 语言模型,截图文字直接转成可搜索文本。" },
      { t: "AI 额度监测", d: "多家 AI 客户端余额集中在一处,不用逐个点开确认还剩多少。" },
      { t: "数据仓库与迁移可测", d: "10 个领域模块均可脱离 Electron 单测,升级不丢用户数据。" }
    ],
    metrics: [
      { n: "10", l: "主进程领域模块", note: "均可脱离 Electron 单测" },
      { n: "123", l: "项回归测试", note: "node --test 覆盖" },
      { n: "27", l: "个渲染层脚本", note: "原 app.js 已按视图拆分" },
      { n: "MIT", l: "开源许可", note: "GitHub 公开发布" }
    ],
    shots: [],
    mock: "workbench",
    notes: [
      "v1.8.2 / v1.8.3 启动后界面全空白 —— IPC 来源校验依赖了 Electron 内部实现细节,把自身请求全部拒掉。v1.8.4 起改为显式契约校验。",
      "用户数据保存在 %APPDATA%\\桌面工作台,覆盖安装不丢数据。"
    ]
  },
  {
    id: "03",
    slug: "lottery-rollcall",
    name: "抽签点名",
    dir: "03-抽签点名",
    version: "双平台",
    status: "done",
    statusLabel: "Windows + 麒麟",
    stack: ["Python 3", "tkinter", "零第三方依赖"],
    lede: "课堂上点一下开始滚名字,再点一下减速,最后停在中奖的人身上。",
    problem:
      "随机点名用现成软件有两个常见问题:名字长短不一时字号忽大忽小,窗口一缩放就排版错乱;换个名单要重新配置半天。",
    solution:
      "纯 Python 重写,零第三方依赖,只要有 Python 3 + tkinter 就能跑。字号恒定不随名字长短缩放,窗口缩放时滚轮行数自动增减但字号始终不变。改名单只需编辑 num.txt,或把任意 txt 拖到程序上。",
    features: [
      { t: "字号恒定", d: "所有名字同一字号,不会因为名字长短而忽大忽小。" },
      { t: "窗口随意缩放", d: "滚轮行数随窗口高度自动增减,缩小时自动减少行数。" },
      { t: "中奖高亮", d: "抽中的人行有金色高亮带与两侧三角指示。" },
      { t: "双平台", d: "银河麒麟 / 中标麒麟与 Windows 同一份源码,跨平台适配。" },
      { t: "防重复(增强版)", d: "读 num.txt + award.ini,支持防重复、速度调节、背景更换。" },
      { t: "键盘操作", d: "空格/回车开始与停止,双击或 F11 最大化,Esc 退出。" }
    ],
    metrics: [
      { n: "0", l: "第三方依赖", note: "Python 3 + tkinter 即可" },
      { n: "969", l: "行(增强版)", note: "award_app.py" },
      { n: "500", l: "行(滚轮版)", note: "Windows / 麒麟同一份" },
      { n: "108", l: "行缩放回归测试", note: "真实 App 实例跑平台分支" }
    ],
    shots: [],
    mock: "lottery",
    notes: [
      "本仓库是纯 Python 重写版,代码、界面、打包脚本均为本人所写,与上游 VB6 程序无代码继承关系。",
      "抽签记录每抽中一人追加写入 result_linux.txt,不改动历史记录文件。"
    ]
  },
  {
    id: "04",
    slug: "jaccount-captcha",
    name: "jAccount 验证码识别",
    dir: "04-jAccount验证码识别",
    version: "v4.5.2 / v1.0.8",
    status: "done",
    statusLabel: "已归档",
    stack: ["ResNet-20", "ONNX Runtime Web", "浏览器扩展 MV3"],
    lede: "把登录时那张四位数字验证码,变成一次安静的后台识别。",
    problem:
      "浏览器扩展要能自动填验证码,就不能把识别放在云端 —— 那等于把每次登录的凭据都交出去。模型必须完全跑在本地。",
    solution:
      "ResNet-20 + ONNX Runtime Web,模型与 wasm 全在本地,零上报。分油猴脚本(v4.5.2)与浏览器扩展(MV3,v1.0.8)两种形态。在线准确率 98.0%(留出集),并确认已触及该字体数据密度的边界。",
    features: [
      { t: "全本地推理", d: "模型 + wasm 全部本地,不上传任何图像,零上报。" },
      { t: "两种交付形态", d: "油猴脚本与 MV3 浏览器扩展,覆盖不同使用习惯。" },
      { t: "统一真值集评估", d: "构建 520 张真值集,任意 ONNX 模型可一键评估。" },
      { t: "可嵌入", d: "求解库可被宿主程序直接嵌入调用。" }
    ],
    metrics: [
      { n: "98.0%", l: "在线准确率", note: "留出集验证" },
      { n: "520", l: "张统一真值集", note: "可复现评估" },
      { n: "ResNet-20", l: "网络结构", note: "第 4 位瓶颈攻坚" },
      { n: "0", l: "次上报", note: "模型与 wasm 全本地" }
    ],
    shots: [],
    mock: "captcha",
    notes: [
      "98.0% 是留出集成绩,已确认为该字体数据密度的边界 —— 再往上需要的是新的数据来源,不是调参。",
      "归档于 2026-09-22,含独立复审报告与一键全量检验脚本。"
    ]
  },
  {
    id: "05",
    slug: "bili-forgotten-curve",
    name: "收藏夹遗忘曲线",
    dir: "05-B站收藏夹遗忘曲线",
    version: "v0.4.1",
    status: "active",
    statusLabel: "自用主力",
    stack: ["Python", "SQLite + FTS5", "LLM 摘要", "SM-2 算法"],
    lede: "把 B 站收藏夹变成一个会主动找你复习的知识库 —— 收藏不是学会,复习才是。",
    problem:
      "点收藏只制造了「我学过了」的错觉。真正形成记忆的是主动回忆加间隔重复,但收藏夹只是个越攒越长的列表,从不会提醒你该回来看。",
    solution:
      "同步收藏夹 → 拉取字幕 → LLM 生成复习卡片 → 遗忘曲线到期提醒 → 主动回忆评分 → 全文检索。用 SM-2 简化算法为每张卡片排复习时间:记得牢就隔久一点,忘了就明天再见。",
    features: [
      { t: "遗忘曲线复习", d: "新卡先读内容后评估,复习卡先回忆再看答案,按忘了/模糊/记得自动排下次时间。" },
      { t: "摘要三档全覆盖", d: "有字幕精摘 / 无字幕批量轻摘(8 条/次合并调用)/ 无信息零 AI 兜底。" },
      { t: "增量同步不重复", d: "三段式断点续跑,单视频失败不炸全程,增量永不重复生成。" },
      { t: "卡片库与统计", d: "全部卡片的书架,状态徽章 + 筛选;未来 7 天到期分布 + 近 14 天活跃度。" },
      { t: "全文检索", d: "FTS5 trigram 中文子串搜索标题/简介/字幕/摘要,LIKE 兜底。" },
      { t: "Anki 导出", d: "一键导出 .apkg 牌组,按 BV 号稳定去重,可反复导入。" },
      { t: "键盘快捷键", d: "空格显示答案 / 1-2-3 评分 / S 跳过,支持评分撤销。" },
      { t: "演示模式", d: "demo 内置 4 张卡片,不登录不花钱即可体验全流程。" }
    ],
    metrics: [
      { n: "541", l: "已同步收藏视频", note: "来自真实使用截图" },
      { n: "539", l: "今日待复习卡片", note: "新卡 530 / 复习 9" },
      { n: "529", l: "已生成卡片", note: "摘要在跑" },
      { n: "8 条/次", l: "批量摘要合并调用", note: "省请求省成本" }
    ],
    shots: [
      { src: "05-01-home.png", cap: "首页 —— 今日待复习数量与四步上手引导", real: true },
      { src: "05-02-review.png", cap: "复习页 —— 新卡先自读内容再评估", real: true },
      { src: "05-04-library.png", cap: "卡片库 —— 全部卡片的书架,状态徽章与筛选", real: true },
      { src: "05-06-stats.png", cap: "学习统计 —— 到期分布与复习活跃度", real: true },
      { src: "05-05-search.png", cap: "搜索 —— FTS5 trigram 中文子串全文检索", real: true },
      { src: "05-07-login.png", cap: "扫码登录 —— cookie 只存本机", real: true }
    ],
    mock: null,
    notes: [
      "界面已重构为本地 WebUI + 独立 exe 分发,无需 Python,安装器一键升级。",
      "Windows Toast + 可选 Server酱微信推送;每日首次使用自动备份数据库,保留最近 7 份。"
    ]
  },
  {
    id: "06",
    slug: "habit-pet",
    name: "桌面宠物 · 鲸鱼娘",
    dir: "06-桌面宠物",
    version: "v0.8",
    status: "active",
    statusLabel: "版本最多",
    stack: ["Python", "PyQt", "LLM", "GitHub API"],
    lede: "一只养在桌面上的鲸鱼娘:饱食度由你的 git commit 喂养,久坐掉血,熬夜掉寿命上限。",
    problem:
      "commit、久坐、熬夜这些事,做的时候完全没有痛感,一周后才从身体上找回来。硬性的番茄钟容易被无脑关掉。",
    solution:
      "把这三件事变成一只桌面上会说话的鲸鱼娘。LLM 负责针对你的行为说风凉话,而不是播报固定文案。v0.4 起形象从程序化绘制的橘猫升级为鲸鱼娘,v0.8 打通了 Qoder 与 WorkBuddy 的真实额度接口。",
    features: [
      { t: "commit 喂养", d: "每个新 commit +14 饱食度,随时间自然衰减 4/小时。0 也不会死,但会饿得说你。" },
      { t: "久坐掉血", d: "连续伏案 45 分钟 -8,起身活动 10 分钟 +5,专注期间豁免。归零则出海散心 3 天。" },
      { t: "熬夜有代价", d: "凌晨 0-6 点仍活跃每小时 -3 寿命上限,不可逆。" },
      { t: "远程投喂", d: "连 GitHub 后,别的机器上的推送也会顺着洋流喂到她嘴里。" },
      { t: "真实额度接口", d: "Qoder 直读官方配额端点,WorkBuddy 走服务端实时额度,两家都保留本地降级。" },
      { t: "Q 弹手感", d: "按压有回弹与音效,rua 动图,拖拽吸附镜像。" }
    ],
    metrics: [
      { n: "+14", l: "每 commit 饱食度", note: "随时间衰减 4/小时" },
      { n: "45", l: "分钟久坐阈值", note: "久坐 -8 / 起身 +5" },
      { n: "6", l: "家 AI 客户端额度", note: "v0.5 起并入" },
      { n: "不可逆", l: "熬夜代价", note: "寿命上限 -3/小时" }
    ],
    shots: [
      { src: "06-pet.png", cap: "桌面上常驻的鲸鱼娘,带状态面板与气泡", real: true },
      { src: "06-pet-github.png", cap: "连上 GitHub 后的远程投喂与云端成就", real: true }
    ],
    gif: { src: "06-pet-rua.gif", cap: "rua 互动动图" },
    mock: null,
    notes: [
      "v0.7 是体验优化轮:气泡升级为独立圆角卡片(智能避让 + 点击穿透)、右键菜单收纳设置子菜单、渲染提速(增量平移)。",
      "修掉一批云端投喂可靠性问题:断网重试、补喂可分次、离家期间不消费事件。"
    ]
  },
  {
    id: "07",
    slug: "sjtu-link",
    name: "交我导",
    dir: "07-交我导",
    version: "v2.6.0",
    status: "active",
    statusLabel: "服务日常",
    stack: ["pywebview", "Edge 应用模式", "离线数据"],
    lede: "上海交大 303 条常用网站、公众号、社团导航,离线可用,拖到桌面当应用开。",
    problem:
      "查学校办事入口总要翻十几个群消息和网页收藏。网页版导航站很好,但每次都要开浏览器找。",
    solution:
      "UI 仿网页版导航站风格做成桌面应用,303 条内置数据离线可用,启动自动同步网页版数据。三种运行方式:单文件 exe(免 Python)/ Edge 应用模式(免安装)/ Python 版。",
    features: [
      { t: "303 条内置数据", d: "网站 / 公众号 / 社团三类,完全离线可用。" },
      { t: "拼音与缩写搜索", d: "支持拼音/首字母/英文缩写搜索,输入联想,Ctrl+K 快捷键。" },
      { t: "数据在线更新", d: "启动自动同步网页版数据,页头也可手动更新,带更新日志。" },
      { t: "个人化", d: "收藏侧边栏、自定义链接、使用统计排序、日程倒计时(考试周/假期)。" },
      { t: "拖拽排序", d: "主网格与收藏侧栏均可拖拽手动排序。" },
      { t: "分享", d: "右键卡片生成二维码,含名称与链接文字。" },
      { t: "SJTU 红金配色", d: "深色模式与中英文切换,页头常驻免责声明入口。" }
    ],
    metrics: [
      { n: "303", l: "条内置导航数据", note: "网站/公众号/社团" },
      { n: "3", l: "种运行方式", note: "exe / Edge 模式 / Python" },
      { n: "v2.6.0", l: "当前版本", note: "2026-09-09" },
      { n: "离线", l: "可用性", note: "不依赖网络" }
    ],
    shots: [],
    mock: "sjtu-link",
    notes: [
      "内置一只可拖拽互动的小宠物「导导」。",
      "UI 风格参考网页版 sjtu-links.pages.dev,SJTU 红金配色。"
    ]
  },
  {
    id: "08",
    slug: "markdown-to-word",
    name: "Markdown 转 Word",
    dir: "08-Markdown转Word",
    version: "v1.4.1",
    status: "active",
    statusLabel: "桌面版 + 网页版",
    stack: ["Electron", "原生解析器", "零第三方依赖"],
    lede: "把 AI 回复的 Markdown 一键转成带格式富文本,粘到 Word 里标题、加粗、列表、表格全都在。",
    problem:
      "从 AI 拿到的 Markdown 答案,粘进 Word 就散成一堆纯文本行 —— 标题不分级、表格塌成一行、代码块和正文混在一起。",
    solution:
      "内置轻量 Markdown 解析器与 docx 生成器,离线解析无需联网。支持导出 .docx / .doc / .tex,公式渲染为 MathML 并可导出为 Word 原生可编辑公式,还能反向把 .docx 解析回 Markdown。",
    features: [
      { t: "导出 .docx 原生格式", d: "标准 OOXML,Word 直接可编辑,标题进入导航窗格。" },
      { t: "数学公式", d: "$..$ / $$..$$ 预览渲染为 MathML,导出为 Word 原生可编辑公式。" },
      { t: "反向导入", d: "拖入 .docx 自动解析回 Markdown,含标题、列表、表格、超链接、OMML 公式。" },
      { t: "拖入互补推荐", d: "拖入 .md 自动选 .tex,拖入 .tex 自动选 .docx,仍可手动改。" },
      { t: "多级列表", d: "按缩进还原嵌套 ul/ol,最多支持 9 级。" },
      { t: "实时预览", d: "左侧输入 Markdown,右侧即时显示转换效果。" },
      { t: "导出 LaTeX", d: "中文默认 ctexart,可直接 xelatex 编译。" }
    ],
    metrics: [
      { n: "9", l: "级嵌套列表", note: "按缩进还原" },
      { n: "4", l: "种导出格式", note: "docx/doc/tex/富文本" },
      { n: "0", l: "第三方依赖", note: "内置解析器与生成器" },
      { n: "2", l: "种形态", note: "Electron + 单文件网页" }
    ],
    shots: [],
    mock: "md2word",
    notes: [
      "网页版是单文件 HTML,双击即用,导出时浏览器直接下载。",
      "MIT 许可,GitHub 公开发布。"
    ]
  },
  {
    id: "09",
    slug: "military-training-script",
    name: "军训视频脚本",
    dir: "09-军训视频脚本",
    version: "两幕版",
    status: "done",
    statusLabel: "已交付",
    stack: ["HTML", "Python 素材脚本", "分镜表"],
    lede: "《淬火青春》两幕军训微电影 —— 从拍摄分镜表到成片素材的完整脚本工程。",
    problem:
      "拍一条有节奏的短视频,分镜、素材、封面要能对上。单靠一份文档,改一处就得通篇重排。",
    solution:
      "把分镜表做成可交互 HTML,镜头时间轴、拍摄要点、画面素材一一对应。素材与封面由 Python 脚本批量生成,拍摄分镜表与成片脚本两套页面互为参照。",
    features: [
      { t: "可交互分镜表", d: "拍摄分镜表做成交互 HTML,镜头时长与要点可点开查看。" },
      { t: "成片脚本页", d: "junxun-video-script.html 承载成片脚本,与分镜表对照。" },
      { t: "素材批量生成", d: "make_sheets.py 批量产出画面素材与题字版封面。" },
      { t: "素材归档", d: "frames / cover / 封面素材 / 分享包 分目录归档。" }
    ],
    metrics: [
      { n: "2", l: "幕", note: "《淬火青春》两幕版" },
      { n: "39", l: "秒封面版", note: "cover_39s.jpg" },
      { n: "HTML", l: "交付形态", note: "双击即开,零安装" }
    ],
    shots: [],
    mock: "storyboard",
    mockKind: "interactive",
    liveDemo: {
      label: "打开拍摄分镜表",
      file: "拍摄分镜表.html",
      note: "本页可直接交互预览分镜表"
    },
    notes: [
      "封面与画面素材由 add_title.py / make_sheets.py 生成,可重跑。"
    ]
  },
  {
    id: "11",
    slug: "dormgrid",
    name: "宿舍超算 DormGrid",
    dir: "11-宿舍超算",
    version: "v0.2.0",
    status: "active",
    statusLabel: "全链路已验证",
    stack: ["Node.js ≥18", "Electron", "Web 仪表盘", "UDP 自动发现"],
    lede: "宿舍和实验室里闲着的电脑,用一条命令组成一台临时超算 —— 协调器切任务,节点自动领活。",
    problem:
      "实验室那几台跑不动的机器,闲着就是闲着。想用它们算点东西,却要挨个装环境、手动分任务、手工收结果。",
    solution:
      "只要机器上有 Node,把文件夹拷过去就能入网。协调器切分任务分发给工作节点,节点自动领活交卷,结果自动汇总。三种形态:CLI、Web 仪表盘、Electron 桌面端。",
    features: [
      { t: "一条命令入网", d: "只要 Node ≥18,拷文件夹过去就能加入网格,零依赖。" },
      { t: "UDP 广播自动发现", d: "留空地址即自动发现同网段节点,不用手填 IP。" },
      { t: "免装 Node 单文件 exe", d: "工作节点可打包成单文件 exe,拷一个文件就能加入。" },
      { t: "Blender 农场", d: "桌面端里选 .blend + 填帧范围即可提交,无需命令行。" },
      { t: "日志分级降噪", d: "普通事件弱化、里程碑高亮、错误红显,可一键只看重要。" },
      { t: "内核侧降噪", d: "逐瓦片日志合并为四分位进度,秒级小任务不刷屏。" },
      { t: "无人值守验证", d: "npm run e2e 自动起协调器+2 节点全新渲染,截图并写结果后退出。" }
    ],
    metrics: [
      { n: "32/32", l: "瓦片渲染完成", note: "来自 e2e 实测结果" },
      { n: "2", l: "个在线节点", note: "e2e 场景" },
      { n: "3", l: "种形态", note: "CLI/仪表盘/桌面端" },
      { n: "1", l: "个文件即可入网", note: "免装 Node 的 exe" }
    ],
    shots: [
      { src: "11-dashboard.png", cap: "Web 仪表盘 —— 瓦片分工可视化,32/32 已完成", real: true },
      { src: "11-control.png", cap: "Electron 桌面端 —— 协调器与节点角色管理", real: true },
      { src: "11-mandelbrot.png", cap: "Mandelbrot 分布式渲染成品 —— 两台节点协同出的图", real: true }
    ],
    mock: null,
    notes: [
      "e2e 是无人值守的:自动起协调器 + 2 节点做全新渲染,截图并写 e2e-result.json 后退出。",
      "首个负载是 Mandelbrot 分布式渲染,用于验证全链路 —— 32 块瓦片由 2 个节点各完成 16 块。"
    ]
  },
  {
    id: "12",
    slug: "token-claimer",
    name: "Token 领取助手",
    dir: "12-Token领取助手",
    version: "v1.x",
    status: "active",
    statusLabel: "日常运行中",
    stack: ["Python 3.8+", "tkinter", "comtypes", "UIAutomation"],
    lede: "到点自动启动 AI 客户端领取每日 token —— 三个客户端,八个时间点,一次不用管。",
    problem:
      "每天要在固定时间点开几个客户端点领取,错一个就少一天额度。手动记时间点、点按钮,这事烦但不难,所以永远被拖到忘记。",
    solution:
      "按应用分别设定领取日(每天/仅周末/仅工作日)以错开频率,添加多个每日时间点自动启动并完成 UI 自动化点击。核心只需标准库,装 comtypes 后解锁智能点击增强层。",
    features: [
      { t: "三客户端覆盖", d: "ZCode、WorkBuddy、TraeWork CN,可改成任何其他 EXE。" },
      { t: "领取日错峰", d: "每个应用单独设定:每天 / 仅周末 / 仅工作日。" },
      { t: "多时间点计划", d: "默认 08:00、12:00、20:00,界面改动停手 2 秒即自动保存。" },
      { t: "智能点击增强", d: "装 comtypes 后解锁 UIAutomation 点击,不依赖坐标。" },
      { t: "滑块验证码", d: "内置滑块识别,直接从 15-几何验证码 嵌入调用。" },
      { t: "不静默失败", d: "启动阶段任何崩溃都写进 logs 并弹框告知,不留无痕迹。" }
    ],
    metrics: [
      { n: "3", l: "个客户端", note: "ZCode/WorkBuddy/TraeWork" },
      { n: "3", l: "个默认时间点", note: "08:00 / 12:00 / 20:00" },
      { n: "2", l: "秒自动保存", note: "停手即存,不怕忘点" },
      { n: "标准库", l: "核心依赖", note: "comtypes 可选" }
    ],
    shots: [],
    mock: "token",
    notes: [
      "Trae CN 是编码 IDE,没有每日积分入口,列表里默认不勾选。它和 TraeWork CN 是两个不同产品 —— 后者安装目录至今沿用旧名 TRAE SOLO CN。",
      "启动脚本会先挑解释器:依次试 %LOCALAPPDATA%\\Python\\bin\\pythonw.exe、pythonw、pyw,只有能 import tkinter 的才会被采用 —— 缺 tcl/tk 的 Python 在 import 阶段就死了,用户看到的正是「双击一下窗口一闪就没了」。一个都不可用时会停住并给出安装提示。"
    ]
  },
  {
    id: "13",
    slug: "audio-transcribe",
    name: "音频转写工具",
    dir: "13-音频转写工具",
    version: "v1.x",
    status: "active",
    statusLabel: "本地推理",
    stack: ["faster-whisper", "PySide6", "int8 量化", "python-docx"],
    lede: "把音频丢进去,拿回带时间戳的文字 —— 全程本地推理,音频不出本机。",
    problem:
      "会议录音、课程音频、访谈、播客都需要文字稿。上传云端转写意味着把未公开的音频交给第三方,而这些内容往往正是最不该外流的。",
    solution:
      "faster-whisper 在 CPU 上跑 int8 量化推理,音频不出本机。桌面端拖入文件或整个文件夹即自动开始,完成后在音频所在目录产出 TXT 与 Word。",
    features: [
      { t: "全程本地推理", d: "faster-whisper 在 CPU 上跑 int8,音频不上传。" },
      { t: "拖入即用", d: "拖入文件或整个文件夹,自动开始转写。" },
      { t: "带时间戳", d: "输出带时间戳的转写结果。" },
      { t: "四种产出", d: "TXT / 纯文本 / SRT 字幕 / Word 文档。" },
      { t: "模型缓存复用", d: "首次加载 large-v3 约 10-30 秒,之后同模型缓存复用不再重复加载。" }
    ],
    metrics: [
      { n: "0", l: "次上传", note: "音频不出本机" },
      { n: "4", l: "种输出格式", note: "TXT/SRT/Word/纯文本" },
      { n: "int8", l: "量化等级", note: "CPU 上可跑" },
      { n: "10-30", l: "秒首启加载", note: "large-v3 之后走缓存" }
    ],
    shots: [],
    mock: "audio",
    notes: [
      "首次转写要先加载模型,large-v3 约需 10-30 秒,之后同一模型会缓存复用。",
      "转写经验与运行手册见 TRANSCRIPTION_EXPERIENCE_GUIDE.md 与 TRANSCRIPTION_RUNBOOK.md。"
    ]
  },
  {
    id: "14",
    slug: "update-checker",
    name: "更新检查工具",
    dir: "14-更新检查工具",
    version: "v1.x",
    status: "active",
    statusLabel: "只读探查",
    stack: ["Python", "JSON / YAML 解析", "版本号比较"],
    lede: "只读探查本机两个 SJTU 应用的更新情况 —— 不下载,不安装,只告诉你有没有新版。",
    problem:
      "两个应用各自检查更新要分别点开,更麻烦的是不知道它们各自的官方更新源到底是哪个 URL。",
    solution:
      "从两个应用各自的官方更新源取最新版本号,与本地 Uninstall DisplayVersion 做数字段比较。只读承诺:不下载不安装不修改。更新源不是猜的 —— 一个内嵌在官方 EXE 二进制里,另一个来自应用自身日志中的实际请求地址。",
    features: [
      { t: "更新源有依据", d: "Tauri 清单 URL 内嵌在 EXE 中,electron-updater 订阅源来自应用日志。" },
      { t: "只读承诺", d: "只探查和比较,不下载不安装不修改任何内容。" },
      { t: "数字段比较", d: "按数字段比版本号,3.0.11 < 3.0.12,不用字符串比较。" },
      { t: "如实显示未知", d: "官方源 404 时显示「暂无信息」,不谎报已是最新。" },
      { t: "无黑窗口启动", d: "pythonw 启动,窗口自动开始检查。" }
    ],
    metrics: [
      { n: "2", l: "个应用", note: "Canvas Helper / j-aide" },
      { n: "只读", l: "操作承诺", note: "不下载不安装" },
      { n: "0/1", l: "CLI 退出码", note: "1 表示有检查项网络失败" }
    ],
    shots: [],
    mock: "update",
    notes: [
      "截至 2026-10-01,j-aide 的 latest.yml 一直返回 HTTP 404,其自身启动自检也得到同样结果。工具如实显示此状态 —— 这表示官方尚未在该渠道发布新版信息,不代表已确认没有新版。",
      "等官方发布后无需任何修改即可自动识别。"
    ]
  },
  {
    id: "15",
    slug: "geo-captcha",
    name: "几何验证码工具集",
    dir: "15-几何验证码",
    version: "4×200 实测",
    status: "active",
    statusLabel: "有成绩单",
    stack: ["OpenCV", "NumPy ResNet20", "ONNX", "可插拔页面驱动"],
    lede: "一个仓库、两个顶层包:滑块缺口定位 + 四题型统一评测框架,逐例种子可复现。",
    problem:
      "验证码求解的难处不在于解出某一个,而在于可信地知道「解得有多好、失败在哪」。没有逐例可复现的评测,所有优化都是盲改。",
    solution:
      "slider_captcha 是求解库(OpenCV 缺口定位 + 拟人轨迹 + 可插拔页面驱动,可被宿主程序直接嵌入);geo_captcha 是统一评测框架:滑块/点选/旋转/空间推理四题型三件套解耦,合成数据逐例种子可复现。",
    features: [
      { t: "逐例可复现", d: "合成数据带种子,任何一次成绩都能原样复现。" },
      { t: "三件套解耦", d: "数据生成、求解器、评测相互独立,可单独替换。" },
      { t: "可嵌入求解库", d: "12-Token领取助手 直接嵌入 slider_captcha.find_gap。" },
      { t: "可插拔页面驱动", d: "换目标站点不用改求解逻辑。" },
      { t: "失败案例留档", d: "逐例数据与失败案例图在 runs/,可事后分析失败模式。" }
    ],
    metrics: [
      { n: "100%", l: "滑块通过率", note: "200/200,误差 0.285px" },
      { n: "91.0%", l: "点选语序全对率", note: "n=200" },
      { n: "98.0%", l: "旋转 ±3° 通过率", note: "MAE 1.14°" },
      { n: "97.0%", l: "空间完全还原率", note: "n=200" }
    ],
    shots: [
      { src: "15-demo.png", cap: "几何验证码求解 demo 实拍", real: true }
    ],
    mock: null,
    notes: [
      "正式成绩单由 python -m geo_captcha run --types slider,click,rotation,spatial --n 200 --seed 20261003 产出。",
      "滑块定位误差均值 0.285px,验收线是 ≤0.5px —— 复现并超越了原基线(原独立 demo:100%、0.456px)。",
      "点选失败模式:漏识 11(低置信主动放弃)、点错位置 7;旋转失败 4 例为歧义图案,margin 可事前识别;空间失败 6 例为低纹理场景。",
      "仅供学习研究,以及对与你拥有或已获授权测试的系统使用。"
    ]
  }
];

/* 供页面使用的派生数据 */
const BY_SLUG = Object.fromEntries(PROJECTS.map(p => [p.slug, p]));
const BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));

/* 技术栈去重统计 */
const ALL_STACK = [...new Set(PROJECTS.flatMap(p => p.stack))].sort();
