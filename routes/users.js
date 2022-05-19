const router = require('koa-router')()
const accountController = require('../controller/Account')
const userController = require('../controller/User')
const getValidateParams = require('../middlewares/validateParams')
const { addUserSchema } = require('../validator/user')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = {
    code: 10001,
    success: false,
    message: 'Login failure, please check form-data type.'
  }
})

router.get('/name/:id', function (ctx, next) {
  const id = ctx.params.id
  if (id === '1') {
    ctx.response.body = {
      code: 200,
      data: [{
        name: '彭新宇'
      }],
      message: '访问成功'
    }
    return
  }
  ctx.body = 'this is a users/bar response'
})

router.post('/get', accountController.getAccount)
router.put('/add', accountController.addAccount)
router.patch('/update/:id', accountController.updateAccount)
router.delete('/del/:id', accountController.deletAccount)
router.post('/list', accountController.getAllAccountList)
router.post('/register', userController.register)
router.post('/login', getValidateParams('post', addUserSchema), userController.login)
router.get('/getSession', async (ctx, next) => {
  try {
    if (ctx.session.userInfo) {
      ctx.body = {
        status: 0,
        msg: '已经登录'
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '未登录'
      }
    }
  } catch(e) {
    throw new Error(e)
  }
})
router.post('/logout', async (ctx, next) => {
  try {
    ctx.session = null
    ctx.body = {
      status: 0,
      msg: '退出成功'
    }
  } catch(e) {
    throw new Error(e)
  }
})

router.post('/user/logout', userController.logout)

// 获取用户信息
router.get('/getUserInfo', userController.getUserInfo)
router.post('/addRole', userController.addRole)
router.get('/getUser', userController.getUser)
router.post('/addPhone', userController.addPhone)
router.get('/getPhone', userController.getPhone)
router.post('/addArticle', userController.addArticle)
router.post('/addTag', userController.addTag)
router.get('/getArticle/:id', userController.getArticle)
router.get('/getTag/:id', userController.getTag)
module.exports = router
