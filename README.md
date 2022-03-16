Q-Router for Koa2
========

这是一个快速编写接口代码的工具 Router 库.

### 如何使用

```
npm i @anxing131/q-router
```

```
// app.js
const app = new Koa()
const Router = require('q-router')
const router = new Router()

router.addApis('/path/to/apis', '/prefix/api')
// add prefixes
// router.addApis('/path/to/apis', ['/api', ''])

app.use(router.routes)
```

// path/to/apis 这是一个目录, q-router 会检测目录下的文件, 只有符合 [Q-API](q-api.md) 格式要求即可.

### 事例
进入项目下 `example` 文件夹
```
> npm i
> node app
```

### Fork 后较原版改动
1. 新增 ajv createAjvErr 自定义函数支持
2. fixed package.json libs version

### Lisence
MIT
