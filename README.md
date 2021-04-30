# vue-node-editor

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/cambridgejames/vue-node-editor)
![GitHub last commit](https://img.shields.io/github/last-commit/cambridgejames/vue-node-editor)
![GitHub](https://img.shields.io/github/license/cambridgejames/vue-node-editor)
![GitHub package.json version](https://img.shields.io/github/package-json/v/cambridgejames/vue-node-editor)
![npm bundle size](https://img.shields.io/bundlephobia/min/vue-node-editor)

> 基于Vue.js的可视化节点编辑器组件

## 安装

```$xslt
# 执行以下命令在当前项目中安装vue-node-editor
npm install vue-node-editor --save
```

## 构建

### 环境依赖

1. NodeJs v10.12.0 (npm 6.4.1)
2. Vue 2.9.6

### 构建步骤

```$xslt
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 目录结构

```$xslt
vue-node-editor
    ├ build
    ├ config
    ├ src
    │   ├ components
    │   │   └ HelloWorld.vue - 用于演示组件而做的封装组件
    │   ├ lib
    │   │   ├ components
    │   │   │   └ 自定义组件
    │   │   ├ js
    │   │   │   └ JavaScript脚本目录
    │   │   ├ nodes
    │   │   │   └ 节点组件
    │   │   ├ scss
    │   │   │   └ 公共样式表
    │   │   ├ index.js - 组件的入口文件
    │   │   └ ne-panel.vue - 主要组件
    │   ├ router
    │   │   └ index.js - 路由文件，用于演示
    │   ├ App.vue
    │   └ main.js
    ├ index.html
    ├ LICENSE
    ├ package.json
    ├ package-lock.json
    └ README.md
```

## 版权说明

该项目签署了MIT授权许可，详情请参阅 LICENSE 文件
