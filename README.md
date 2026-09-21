# Nathan Shen — 个人网站

纯 HTML / CSS / JS，无构建、无依赖、无框架。整站可以只靠双击 `index.html` 打开，也可以直接推到 GitHub Pages / Netlify / Vercel。

**定位**：Principal R&D Engineer @ BYD（EV 电池高压配电箱，深圳），方向偏**新能源**与**具身智能机器人**。博士期间的生物材料研究作为履历保留在论文页与 CV 里，首页以「现在做什么、下一步往哪走」为主。

**视觉参考**：你指定的 [dracoxu.com](https://dracoxu.com/)。我采用它的设计语言——正文 + 等宽结构字、冷调纸面、1px 细线网格、无圆角无阴影、单一强调色——但版式细节与配色按你的内容重做，字体是从开源字体自托管。**全站非衬线**：正文与标题用 IBM Plex Sans，年份、期刊、编号、导航等结构信息用 IBM Plex Mono（等宽也是无衬线体）。

> **保密红线**：BYD 的具体项目细节（平台电压、电流等级、内部代号、验证数据）我一律没有编造，需要你确认能否公开的地方留成了 `[方括号]`。搜索 `[` 可找到全部待填点。

```
personal-site/
├── index.html          首页：身份区 / Research 三条线 / 项目 / 5 篇论文 / 奖项 / 教育 / 引言 / 联系
├── projects.html       项目页（9 个：1 工业界 + 1 方向 + 7 博士研究，可按方向筛选）
├── publications.html   论文页（20 篇 + 4 项专利，按状态筛选、可搜索、每篇一键复制 BibTeX）
├── cv.html             CV 页：内嵌你的原始 4 页简历 PDF + 下载链接
├── 404.html
├── assets/
│   ├── css/style.css   全部样式（配色在顶部 tokens，字体在 @font-face）
│   ├── js/boot.js      首屏脚本：主题、JS 标记、兜底
│   ├── js/site.js      交互：主题切换、筛选、搜索、复制 BibTeX
│   ├── fonts/          IBM Plex Sans（含斜体）+ IBM Plex Mono（SIL OFL 开源字体，自托管）
│   ├── img/favicon.svg 图标：钴蓝闪电
│   └── cv.pdf          你的原始简历 PDF（4 页，含推荐人邮箱）
└── README.md
```

## 一、本地预览

直接双击 `index.html`；或起本地服务器：

```powershell
cd outputs\personal-site
python -m http.server 8000
```

## 二、页面结构（为什么这样排）

- **身份区**：左栏是视觉块（现在是「电池包 → 高压配电 → 逆变器/电机」的拓扑图），中间是姓名、职位、一句话定位、链接行和三段简介，右栏是 Status 注记。这是参考站的结构，也是工程个人站最耐看的排法。
- **Research**：先一句总述，再三栏（高压配电 / 具身智能 / 材料与可靠性），最后一句斜体点题。
- **项目**：每行左侧一枚 84×56 的深色小图（line drawing，按条目内容自动生成，同一项目永远是同一张），右侧标题+描述+规格，最右是年份与领域。
- **论文**：只放 5 篇；完整列表在论文页。
- **奖项 / 教育**：用「年份 | 内容 | 出处」的 dated 行。
- **引言（monolith）**：整幅深色块，一句把新能源与机器人串起来的话。可替换或删除。

## 三、需要你补的内容

1. **邮箱**：全站 5 处是 `you@example.com` 占位。
2. **BYD 可公开细节**：`projects.html#hvbox` 与首页对应条目里的 `[architecture definition, component selection, validation plan]`、`[platform or program name you can share]`、`[validation status you can share]`。
3. **具身智能方向**：`projects.html#embodied` 现在明确标注为"方向（moving into）"，不含虚假成果，带三条占位；你实际在做的事（复现某篇 manipulation/VLA 工作、开源贡献、机器人侧项目）给我，我改成真实项目。
4. **照片**（可选）：把 `index.html` 里 `<div class="rail">…</div>` 内的 `<span class="plate plate-portrait">…</span>` 换成：

```html
<img src="assets/img/portrait.jpg" alt="Nathan Shen" width="800" height="1000" style="width:100%;height:auto;filter:grayscale(.12)">
```

5. **DOI**：论文标题与 [Scholar] 现在指向 Google Scholar 搜索链接（因为本机拿不到 DOI），有 DOI 后替换即可。
6. **Scholar 最新列表**：见第七节。

## 四、改内容

几个常改的位置：左上角返回主页的按钮在每个 HTML 里的 `<a class="mark" href="index.html">Nathan Shen's Profile</a>`；首页姓名是 `<h1 class="wordmark">Nathan Shen, PhD</h1>`；Education 每条是 `<div class="dated dated--edu">`，里面只有「时间」和「学校 + 学位 + 专业」两栏，学校名用 `<span class="school">` 加粗。

**加一篇论文**：在 `publications.html` 的对应分组里复制一条 `<article class="pub">`：

```html
<article class="pub" id="p21" data-type="published">
  <span class="plate" aria-hidden="true"><svg viewBox="0 0 84 56"><path d="M4 28h76"/></svg></span>
  <div>
    <p class="cite-line"><span class="num">[21]</span> Shen, Y. <span class="yr">(2026). </span><a class="ttl" href="https://doi.org/...">标题</a>. <em class="ven">期刊</em><span class="vol">, 卷, 页码</span>.</p>
    <p class="desig">Published</p>
    <p class="lnks"><a href="https://doi.org/...">[DOI]</a><span class="sep"> · </span><button class="cite js-cite" type="button" data-bib="p21">[BibTeX]</button></p>
  </div>
</article>
```

`data-type` 只能是 `published` / `accepted` / `under-review` / `in-preparation`。再到文件底部的 BibTeX 区加同名块（`<script type="text/plain" data-bib="p21">…</script>`，内容无需转义），标题与按钮的 `data-bib` 一致即可。

**加一个项目**：复制 `projects.html` 里任意 `<article class="project row">`，改 `id`、`data-tags`（`energy` / `robotics` / `neurovascular` / `additive` / `undergrad`，决定归属哪个分组与筛选）、标题、描述和 `<dl class="specs">` 四项。小图会自动按标题重新生成；想固定用某种图案，把 `plate(...)` 换成想要的 `<span class="plate">` SVG 即可。

## 五、配色与字体

都在 `assets/css/style.css` 顶部（深色主题在 `html[data-theme="dark"]`）：

```css
--paper:   #F5F8F9;   /* 浅色主题底色：冷调，比上一版更淡 */
--shoal:   #EBF0F2;   /* 行悬停底色 */
--kei:     #DCE4E8;   /* 1px 细线 */
--sea:     #5A6E7A;   /* 次级文字（对比度 5.0:1，达 AA） */
--contour: #22303A;   /* 正文 */
--sumi:    #101B23;   /* 标题 */
--line:    #12405C;   /* 分隔线 / 侧脊线 / 当前导航 */
--wave:    #23607F;   /* 链接 */
--oxide:   #B45309;   /* 唯一强调色：7px 方点、焦点框、状态标签 */
--plate-bg: #0B1620;  /* 项目/论文小图的底色（深墨蓝） */
--plate-ink:#DCE3E7;  /* 小图线条 */
--plate-ice:#8FB6D4;  /* 小图强调元素 */
```

底色想再淡一点就直接把 `--paper` 往上提（例如 `#F8FAFB`），同时把 `--kei` 调浅（`#E4EAED`）、`--shoal` 调浅（`#F0F4F6`），否则细线会显得比底色还重。想回到之前稍深一档的冷灰，用 `--paper: #EEF1F2` / `--kei: #C9D2D7` / `--shoal: #E4E9EB` 即可。

深色主题（`html[data-theme="dark"]`）保持冷蓝深色（`--paper: #0E1720`），与浅色主题同温。

字体：`--sans` = **IBM Plex Sans**（正文、标题、姓名、按钮），`--mono` = **IBM Plex Mono**（年份、期刊、编号、导航、状态）。两者同属 IBM Plex 字族、都是 SIL Open Font License，文件在 `assets/fonts/`，**自托管、不依赖 Google Fonts**（访客不需要翻墙也能正常显示）。正文 16.5px / 行高 1.66，移动端 16px。

`assets/fonts/` 里还留着几个已经用不到的文件（`newsreader-normal.woff2`、`newsreader-italic.woff2`，以及和 `plexsans-400.woff2` 字节完全相同的 `plexsans-500/600/700.woff2`）——当前沙箱不允许我删除文件，你手动删掉它们即可，不影响任何东西。

间距刻度 `--ma-1` … `--ma-8` = 4 / 8 / 14 / 24 / 40 / 68 / 112 / 184 px，改一处即可整体调松紧。

## 六、部署到 GitHub Pages

1. 新建仓库；想要网址就是 `https://你的用户名.github.io`，仓库名必须写 `你的用户名.github.io`，否则地址是 `https://你的用户名.github.io/仓库名/`。
2. 把 `personal-site` 里的全部文件（不是文件夹本身）推到仓库根目录。
3. Settings → Pages → Source 选 `Deploy from a branch`，分支 `main`、目录 `/ (root)`，保存。
4. 自定义域名：根目录加 `CNAME` 文件（一行域名），再去域名商配 DNS。

## 七、已知限制

- **Google Scholar 列表未同步**：这台机器能访问普通网站（我用它读了参考站），但 Google 全域被网络层屏蔽（`scholar.google.com`、`www.google.com` 直接超时）。论文列表目前依据你的 CV PDF 整理。把 Scholar 页面另存为 HTML/PDF 放进 `Downloads`，或把列表文字/截图给我，我就能替换。
- BYD 与具身智能方向的细节待你提供（见第三节），当前是通用描述 + `[占位]`。
- 论文链接为 Scholar 搜索链接，待 DOI 替换。

## 八、已验证的部分

在 1440×900、1920×1080、390×844 三种视口实测：

- 横向溢出 0、文字截断 0；桌面首屏能完整容纳身份区（姓名、职位、定位句、链接行、三段简介、右侧状态）。
- 字体正常加载：正文 16.5px IBM Plex Sans、结构字 IBM Plex Mono（`document.fonts.check` 均为 true），全站无衬线。
- 网格：左栏 152×190、正文列 656px、右注记 192px；移动端收成单列，左栏缩到 152px。
- 对比度：次级文字 5.0:1（浅色主题）/ 6.3:1（深色主题），达 WCAG AA。
- 交互：论文筛选（Published → 11 篇）、搜索（`molybdenum` → 5 篇）、空结果提示、分组自动隐藏；项目筛选（New energy 1 / Embodied AI 1 / 全部 9）；主题切换；BibTeX 复制（剪贴板被拦时自动在行内展开原文并选中）。
- 无 JavaScript 时全部内容可见（正文 opacity 1、12 枚小图、11 行条目）。
- 打印：导航、页脚、侧脊线、内嵌 PDF 全部隐藏，按 A4 排版。
