# China Trending Viewer

中国各大平台热搜展示网页

## 功能特点

- 展示微博、知乎、B站、抖音、贴吧五大平台热搜
- 赛博朋克风格界面
- 响应式设计，支持桌面、平板、手机
- GitHub Actions 自动更新数据
- 点击热搜可直接跳转原平台

## 部署

项目已配置 GitHub Pages，直接 push 到 master 分支即可自动部署。

访问地址: https://lppzc.github.io/china-trending/

## 本地运行

```bash
# 使用任意静态服务器
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## GitHub Actions

数据抓取工作流配置在 `.github/workflows/fetch-trending.yml`

- 定时任务: 每天 6:00, 12:00, 18:00, 22:00 UTC
- 可手动触发: workflow_dispatch
