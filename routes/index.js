const router = require('koa-router')()
const Redis = require('koa-redis')
const Store = new Redis().client

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/test-session', async (ctx, next) => {
  if (ctx.session.count == null) {
    ctx.session.count = 0
  }
  ctx.session.count ++
  ctx.body = {
    status: 0,
    data: ctx.session.count
  }
})

router.get('/session', async (ctx, next) => {
  const name = ctx.request.query.name
  await Store.hset('fix', 'name', JSON.stringify({ name: name }))
  const sName = await Store.hget('fix', 'name')
  ctx.body = {
    status: 0,
    data: JSON.parse(sName)
  }
})
module.exports = router
