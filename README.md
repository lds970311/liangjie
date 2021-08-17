# 凉介租房项目

## 1. 使用的技术栈

### 1.1 前端

- React
- React-router-dom
- ant design mobile
- jsx
- 百度地图API
- scss

### 1.2 服务端

- NodeJS
- Mysql

## 2. 目录结构

```html
node_modules    nodejs模块依赖
public          公共资源文件
/src
    /assets       资源文件，比如：图片、字体等
    /components   公共组件，多个页面中都需要用到的组件
    /pages        页面组件
    /utils        工具函数、方法
    App.js        根组件（用来配置路由等）
    index.js      整个项目的入口文件
.env.development  开发环境环境变量配置
.env.production   生产环境环境变量配置
```

## 3. 启动该项目

1. `npm install` 安装node依赖模块
2. `yarn start` 或者`npm start启动项目`
3. 或者使用 `npm build` 打包该项目, 把打包生成的dist文件夹下面的文件上传到web服务器中即可运行
