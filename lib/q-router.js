const _ = require('lodash')
const requireDir = require('require-dir')
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

  loadApi(target) {
    let apis = []
    if (typeof target === 'function') {
      apis.push(target)
    } else {
      for (const key in target) {
        const subApis = this.loadApi(target[key])
        apis = apis.concat(subApis)
      }
    }

    return apis
  }

  addApis (dirPath, prefixes = []) {
    const self = this
    if (typeof prefixes === 'string') prefixes = [prefixes]
    const targets = requireDir(dirPath, { recurse: true })
    let files = []
    for (const key in targets) {
      const apis = this.loadApi(targets[key])
      files = files.concat(apis)
    }

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
            prefixes.forEach(prefix => {
              self.router[method].apply(self.router, [`${prefix}${rt}`].concat(args))
              // mount custom variables to stack
              if (_.has(func, '__custom')) {
                self.router.stack[self.router.stack.length - 1] = func.__custom
              }
            })
          })
        } else if (typeof route === 'string') {
          prefixes.forEach(prefix => {
            self.router[method].apply(self.router, [`${prefix}${route}`].concat(args))
            // mount custom variables to stack
            if (_.has(func, '__custom')) {
              self.router.stack[self.router.stack.length - 1] = func.__custom
            }
          })
        }
      }
    })
  }
}

module.exports = QRouter
