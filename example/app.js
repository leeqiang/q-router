const Koa = require('koa')
const Router = require('../index')
const path = require('path')
const router = new Router({})
router.addApis(path.resolve(__dirname, './apis'), '/api')

const app = new Koa()

app.use(router.routes)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listen on ${port}`)
  console.log(`Open: http://localhost:${port}/api/test`)
})
