const _ = require('lodash')
const reuqireDir = require('require-dir')
const KoaRouter = require('koa-router')
const ajv = require('./ajv')

class QRouter {
  constructor ({ errorHandle, router, before }) {
    this.router = router || KoaRouter()
    this.addErrorHandler(errorHandle)
    this.before = before || []
  }

  get routes () {
    return this.router.routes()
  }

  /**
   * 设置错误处理
   */
  addErrorHandler (errorHandle) {
    if (typeof errorHandle === 'function') {
      this.router.all('*', errorHandle())
    }
  }

  addApis (dirPath, prefix = '') {
    const self = this
    let files = _.map(reuqireDir(dirPath, { recurse: true }), (ele) => {
      if (typeof ele === 'function') return ele
      return _.values(ele)
    })

    _.flattenDeep(files).forEach(function (func) {
      if (func.route) {
        let [method, route] = func.route
        let before = func.before || []
        before = self.before.concat(before)
        let after = func.after || []
        let validator = (func.validator && [ajv(func.validator)]) || []
        let args = _.concat(validator, before, [func], after)
        if (route instanceof Array) {
          route.forEach((rt) => {
            self.router[method].apply(self.router, [`${prefix}${rt}`].concat(args))
          })
        } else if (typeof route === 'string') {
          self.router[method].apply(self.router, [`${prefix}${route}`].concat(args))
        }
      }
    })
  }
}

module.exports = QRouter
