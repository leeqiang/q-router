const testApi = async (ctx) => {
  ctx.body = { ok: 1, msg: 'Hello World.' }
}
testApi.route = ['get', '/test']
module.exports = testApi
