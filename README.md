Q-Router for Koa2
========

这是一个快速编写接口代码的工具 Router 库.

### 如何使用

```
// app.js
const app = new Koa()
const Router = require('q-router')
const router = new Router()

router.addApis('/path/to/apis', '/prefix/api')

app.use(router.routes())
```

// path/to/apis 这是一个目录, q-router 会检测目录下的文件, 只有符合 [Q-API](q-api.md) 格式要求即可.

### Lisence
MIT
