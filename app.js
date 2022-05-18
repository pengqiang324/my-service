const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const Koa2Cors = require('koa2-cors')
const Session = require('koa-generic-session')
const Redis = require('koa-redis')
const KoaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken')
const { jwt: tokenConfig } = require('./config')

const index = require('./routes/index')
const users = require('./routes/users')

// const UserService = require('../service/Users')

// error handler
onerror(app)

app.keys = ['abs', 'abssba'] // session 数据加密处理
// middlewares
app.use(Session({
  key: 'zy',
  prefix: 'zl',
  store: new Redis() // 链接本地 redis
}))
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(Koa2Cors()) // 跨域
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
})



app.use(async (ctx, next) => {
  if (ctx.header && ctx.header.authorization) {
    const parts = ctx.header.authorization.split(' ');
    if (parts.length === 2) {
      //取出token
      const scheme = parts[0];
      const token = parts[1];
      
      if (/^Bearer$/i.test(scheme)) {
        try {
          //jwt.verify方法验证token是否有效
          const user = jwt.verify(token, tokenConfig.privateKey, {
            complete: true
          })
          console.log(user, ctx.session)
          // const userJwt = await UserService.getUserJwt(user.payload)
          // if (token !== userJwt.token) {
          //   // ctx.status = 401
          //   ctx.body = {
          //     status: 1,
          //     msg: '未授权'
          //   }
          // }
        } catch (error) {
          //token过期 生成新的token
          console.log('即将过期', ctx.session)
          
          // const newToken = jwt.sign(ctx.session.userInfo,  tokenConfig.privateKey, { expiresIn: '1h' });

          //将新token放入Authorization中返回给前端
          // ctx.res.setHeader('Authorization', newToken);
        }
      }
    }
  }
  return next().catch(e => {
    if (e.status === 401) {
      e.status = 401
      ctx.body = {
        status: 1,
        msg: '未授权，请重新登录'
      }
    }
  })
 })

//路由权限控制 除了path里的路径不需要验证token 其他都要
app.use(KoaJwt({
  secret: tokenConfig.privateKey,
  debug: true
}).unless({
  path: [/\/users\/login/, /\/users\/register/, /\/user\/logout/, /\/test-session/]
}))
 
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
