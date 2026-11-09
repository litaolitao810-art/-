# 野舟 AI 数字商店

当前为公开商品展示页，支持搜索、分类与详情。暂未开放下单、收款与交付；所有商品与价格均为示例。

## Vercel 部署

导入 litaolitao810-art/- 仓库，Root Directory 为仓库根目录，Framework Preset 选择 Other。vercel.json 已设置构建命令 npm run build 和输出目录 dist，无须环境变量。

已有项目可在 Settings → Git 连接本仓库，生产分支选择 main，然后部署最新提交。

## 本地预览

```sh
npm run build
python3 -m http.server 3000 --directory dist
```

仓库仅包含公开静态展示资源及构建配置，不包含后台、订单数据或交付内容。正式交易功能需要后续接入数据库、支付、交付及后台鉴权。
