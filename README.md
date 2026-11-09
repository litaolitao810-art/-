# 野舟 AI 数字商店

当前线上版本是商品展示页，支持搜索、分类与商品详情，尚未开放购买、支付或自动发货。

## Vercel 部署

导入本仓库，Root Directory 留空（仓库根目录），Framework Preset 选择 Other。仓库中的 vercel.json 已指定构建命令 npm run build 和输出目录 dist。无须环境变量或安装依赖。

已有 Vercel Drop 项目：在 Settings → Git 连接本仓库，生产分支选择 main，然后部署最新提交。若无法连接，可新建项目导入本仓库；域名需要在对应项目中重新确认绑定。

## 本地检查展示页

```sh
npm run build
python3 -m http.server 3000 --directory dist
```

## 本地交易演示

原始演示完整保存在 local-demo/。执行 npm start 启动。本地 JSON 数据不会提交，不能当作 Vercel 的持久化数据库。请参阅 local-demo/README.md。

## 正式营业前

需接入持久化数据库、正式支付与回调校验、商品交付和后台鉴权。当前公开部署仅包含 public/ 的静态资源，不发布本地演示 API 或交付卡密。
