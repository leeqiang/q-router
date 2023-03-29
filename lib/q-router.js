const _ = require('lodash')
const reuqireDir = require('require-dir')
const KoaRouter = require('koa-router')
const ajv = require('./ajv')

class QRouter {
  constructor ({ errorHandle, router, before, pathMapValueField }) {
    this.router = router || KoaRouter()
    this.addErrorHandler(errorHandle)
    this.before = before || []
    this.pathMapValueField = pathMapValueField
    this.pathMap = {}
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

  reduceApis (ele) {
    let _values = _.values(ele)
    for (let value of _values) {
      if (typeof value === 'object') {
        value = this.reduceApis(value)
      }
      if (_.isFunction(value)) continue
      _values = _.concat(_values, value)
    }
    return _values
  }

  addApis (dirPath, prefixes = []) {
    const self = this
    if (typeof prefixes === 'string') prefixes = [prefixes]
    let files = _.map(reuqireDir(dirPath, { recurse: true }), (ele) => {
      if (typeof ele === 'function') return ele
      return this.reduceApis(ele)
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
            prefixes.forEach(prefix => {
              if (self.pathMapValueField && func[self.pathMapValueField]) {
                self.pathMap[`${prefix}${rt}`] = func[self.pathMapValueField]
              }
              self.router[method].apply(self.router, [`${prefix}${rt}`].concat(args))
            })
          })
        } else if (typeof route === 'string') {
          prefixes.forEach(prefix => {
            if (self.pathMapValueField && func[self.pathMapValueField]) {
              self.pathMap[`${prefix}${route}`] = func[self.pathMapValueField]
            }
            self.router[method].apply(self.router, [`${prefix}${route}`].concat(args))
          })
        }
      }
    })
  }
}

module.exports = QRouter
