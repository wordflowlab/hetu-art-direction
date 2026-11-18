# 河图美术设定台

> 围绕固定图片维护参考板、色板、角色服装与场景设计方案，按区域保留审阅意见。

## 简介

美术设定台是独立TypeScript／React河图插件。外部Agent通过河图稳定CLI/MCP发现并调用，作者在工作面阅读、比较、反馈；作品正文和正式决定由宿主管理。

## 快速上手

安装河图插件中心提供的固定运行包，再向当前Agent说明本次作品与目标。先发现当前安装版能力，再读取包内`hetu-art-direction`方法和已有工程。

读取当前作品实体与固定图片→建立参考板与图像职责→整理色板与造型要求→实际渲染并按区域提意见→比较设计方案→外部工具制作候选→按固定素材接续。

## 开发

Node.js 25，固定依赖见`package-lock.json`。

```bash
npm ci
npm run build
npm run check
npm run test:unit
npm run test:machine
npm run test:ui
npm run package
```

机器与界面验收使用`acceptance-lock.json`固定的正式宿主；完整步骤见[开发与发布](docs/07-开发发布与维护.md)。

## 边界

宿主拥有图片原字节、来源、人物身份及正式选用。本包selected仅为专业方案偏好，不选用宿主素材；不能由色板对比度证明审美、人物一致性或素材权利。使用实际PNG/JPEG，完整解码由界面验收证明；不自动联网抓图或付费生成。

## 文档

[功能清单](CAPABILITIES.md) · [产品与开发文档](docs/README.md) · [验收记录](docs/08-实施计划与验收记录.md)。

从[GitHub v0.1.0开发预览](https://github.com/wordflowlab/hetu-art-direction/releases/tag/v0.1.0)获取固定运行包；[发行验收](docs/research/release-acceptance.json)说明正式宿主、平台及证据边界。
