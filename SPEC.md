# 中国热搜展示网页 - 项目规范

## 1. 项目概述

- **项目名称**: China Trending Viewer (中国热搜展示)
- **项目类型**: 单页前端应用 + GitHub Actions 自动化
- **核心功能**: 展示中国各大平台实时热搜，支持自动更新，点击跳转原平台
- **目标用户**: 希望快速浏览中国各大平台热门话题的用户

## 2. 技术栈

- **前端**: 纯 HTML + CSS + JavaScript (无需框架)
- **数据存储**: JSON 文件存储热搜数据
- **自动化**: GitHub Actions 定时抓取热搜数据
- **部署**: GitHub Pages

## 3. UI/UX 规范

### 3.1 布局结构

```
┌─────────────────────────────────────────────────┐
│  Header: Logo + 标题 + 刷新按钮                  │
├─────────────────────────────────────────────────┤
│  Platform Tabs: 微博 | 知乎 | B站 | 抖音 | 贴吧  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Trending Card                          │   │
│  │  #1 热搜标题              热度: 1234567  │   │
│  │     平台图标              更新时间        │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Trending Card                          │   │
│  │  #2 热搜标题              热度: 987654   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│  Footer: 数据来源 | 最后更新 | GitHub 链接      │
└─────────────────────────────────────────────────┘
```

### 3.2 响应式断点

- **桌面**: >= 1024px (3列网格)
- **平板**: 768px - 1023px (2列网格)
- **手机**: < 768px (1列网格)

### 3.3 视觉设计

#### 配色方案 (深色主题 - 赛博朋克风格)

```css
--bg-primary: #0a0a0f;        /* 深黑底色 */
--bg-secondary: #12121a;     /* 卡片背景 */
--bg-tertiary: #1a1a25;      /* 悬停背景 */
--accent-cyan: #00f0ff;      /* 青色主强调 */
--accent-pink: #ff00aa;      /* 粉色次强调 */
--accent-yellow: #ffd700;    /* 金色排名 */
--text-primary: #ffffff;     /* 主文字 */
--text-secondary: #8888aa;   /* 次文字 */
--border-glow: rgba(0, 240, 255, 0.3); /* 发光边框 */
```

#### 字体

- **标题**: "Orbitron", sans-serif (Google Fonts - 科技感)
- **正文**: "Noto Sans SC", sans-serif (中文)
- **数字**: "JetBrains Mono", monospace (等宽)

#### 间距系统

- 基础单位: 8px
- 卡片内边距: 16px
- 卡片间距: 12px
- 区域间距: 24px

#### 视觉效果

- 卡片: 微妙发光边框 (box-shadow)
- 悬停: 左边框高亮 + 轻微上移 + 背景变亮
- 排名 1-3: 金色/银色/铜色徽章
- 数字: 渐变文字 (cyan -> pink)

### 3.4 组件

#### Header
- Logo: 简约几何图标
- 标题: "热搜榜" 带霓虹发光效果
- 刷新按钮: 旋转图标动画

#### Platform Tabs
- 平台图标 + 名称
- 激活状态: 底部发光线条
- 悬停: 文字发光

#### Trending Card
- 排名徽章 (#1, #2, #3 有特殊样式)
- 热搜标题 (可点击)
- 热度数字 (带 K/W 单位)
- 平台图标
- 相对时间 (如 "2小时前")

#### Footer
- 数据来源说明
- 最后更新时间
- GitHub 仓库链接

## 4. 功能规范

### 4.1 核心功能

1. **多平台热搜展示**
   - 微博热搜
   - 知乎热榜
   - B站热门
   - 抖音热榜
   - 百度贴吧热议

2. **数据展示**
   - 热搜排名
   - 热搜标题
   - 热度值
   - 更新时间

3. **交互功能**
   - 平台切换 (Tab)
   - 手动刷新
   - 点击跳转原平台
   - 主题切换 (深色/浅色) - 可选

4. **GitHub Actions 自动化**
   - 定时抓取 (每天 6, 12, 18, 22 点)
   - 自动更新 JSON 数据
   - 自动提交推送

### 4.2 数据结构

```json
{
  "weibo": [
    {
      "rank": 1,
      "title": "热搜标题",
      "hot": 1234567,
      "url": "https://...",
      "time": "2026-03-13T12:00:00Z"
    }
  ],
  "zhihu": [...],
  "bilibili": [...],
  "douyin": [...],
  "tieba": [...],
  "lastUpdate": "2026-03-13T12:00:00Z"
}
```

### 4.3 GitHub Actions 工作流

```yaml
# 定时抓取热搜数据
name: Fetch Trending
on:
  schedule:
    - cron: '0 6,12,18,22 * * *'
  workflow_dispatch:

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fetch trending data
        run: python fetch_trending.py
      - name: Commit and push
        run: |
          git config user-name "GitHub Action"
          git add data/trending.json
          git commit -m "Update trending data"
          git push
```

## 5. 文件结构

```
D:\123\project4/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 逻辑脚本
├── data/
│   └── trending.json   # 热搜数据
├── .github/
│   └── workflows/
│       └── fetch-trending.yml  # GitHub Actions
├── fetch_trending.py    # 数据抓取脚本
└── README.md           # 项目说明
```

## 6. 验收标准

### 视觉检查点
- [ ] 深色主题正确显示
- [ ] 赛博朋克发光效果可见
- [ ] 响应式布局在三种尺寸下正常
- [ ] 平台切换 Tab 正常工作

### 功能检查点
- [ ] 页面加载显示热搜数据
- [ ] 点击热搜可跳转对应平台
- [ ] 刷新按钮可更新数据
- [ ] GitHub Actions 可手动触发

### 阶段划分

**阶段 1**: 基础框架搭建
- 项目结构创建
- HTML 骨架
- 基础样式

**阶段 2**: UI 实现
- 完整视觉设计
- 响应式布局
- 动画效果

**阶段 3**: 交互功能
- Tab 切换
- 刷新功能
- 点击跳转

**阶段 4**: 自动化
- GitHub Actions 配置
- 数据抓取脚本
- 自动推送

**阶段 5**: 测试与优化
- 功能测试
- 性能优化
- 部署验证
