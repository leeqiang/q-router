Q-API 格式说明
==========

## 原则
- 一个接口一个文件
- 一个接口包含 6 个部分内容
  - swagger 注释
  - 接口函数
  - 接口路由定义
  - 接口参数校验
  - 接口 before 中间件
  - 接口 after 中间件

## Swagger 注释
```
/**
 * @swagger
 * /path/to/route:
 *  post:
 *    summary: 接口描述
 *    description: 接口描述
 *    tags: [接口分类]
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: param1
 *        type: string
 *        required: true
 *        in: formData
 *        description: 参数描述
 *    responses:
 *      200:
 *        description: '{ msg: "接口返回" }'
*/
```

## 接口定义
```
const thisIsApi = async (ctx) => {
  ctx.body = 'hello world'
}

thisIsApi.route = ['get', '/path/to/route']
thisIsApi.validator = {
  type: 'object',
  properties: {
    param1: { type: 'string' }
  },
  required: ['param1'],
  target: 'query'
}
thisIsApi.before = [
  auth('teacher')
]
thisIsApi.after = [
  afterFunc()
]
module.exports = thisIsApi
```
