const UserService = require('../service/Users')
const jwt = require('jsonwebtoken')
const { encryptPassword, verifyPassword } = require('../utils/user')
const { jwt: tokenConfig } = require('../config')
const { v4: uuidv4 } = require('uuid')

module.exports = {
    login: async (ctx, next) => {
        const data = ctx.request.body
        ctx.type = 'json'
        try {
            const account = await UserService.login(data)
            if (account) {
                // 验证密码
                if (verifyPassword(data.password, account.password)) {
                    // const userInfo = { account: data.account }
                    // ctx.session.userInfo = userInfo
                    // const token = jwt.sign(userInfo, tokenConfig.privateKey, { expiresIn: '1h' })
                    const userJwt = await UserService.getUserJwt(account)
                    const userInfo = { account: data.account, userId: account.id }
                    let token = null
                    if (userJwt.token === '0') {
                        token = jwt.sign(userInfo, tokenConfig.privateKey, { expiresIn: '1h' })
                    } else {
                        try {
                            jwt.verify(userJwt.token, tokenConfig.privateKey)
                            token = userJwt.token
                        } catch(e) {
                            token = jwt.sign(userInfo, tokenConfig.privateKey, { expiresIn: '1h' })
                        }
                    }
                    const sqlData = {
                        userId: userInfo.userId,
                        token
                    }
                    await UserService.logOut(sqlData)
                    ctx.body = {
                        status: 0,
                        msg: '登录成功',
                        data: { token: 'Bearer ' + token }
                    }
                } else {
                    ctx.body = {
                        status: 1,
                        msg: '密码错误'
                    }
                }
            } else {
                ctx.body = {
                    status: 1,
                    msg: '账号不存在'
                }
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    },

    register: async (ctx, next) => {
        const data = ctx.request.body
        try {
            data.password = encryptPassword(data.password) // 密码加密
            await UserService.regiter(data)
            const user = await UserService.login(data)
            // const uuid = uuidv4()
            const userInfo = { account: data.account, userId: user.id }
            const token = jwt.sign(userInfo, tokenConfig.privateKey, { expiresIn: '1h' })
            await UserService.registerUserJwt({ userId: user.id,  token })
            ctx.body = {
                status: 0,
                msg: 'success'
            }
        } catch(e) {
            console.log(e)
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    },

    getUserInfo: async (ctx, next) => {
        const token = ctx.get('Authorization')
        const parts = token.split(' ');
        let userInfo = {}
        if (!token) {
            ctx.body = {
            status: 0,
            msg: '未登录'
            }
        } else {
            try {
                userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
                const time = parseInt((new Date().getTime()) / 1000)
                console.log('剩余时间：', userInfo.exp - time + 's', userInfo)
                const userJwt = await UserService.getUserJwt({ id: userInfo.userId })
                if (parts[1] !== userJwt.token) {
                    ctx.status = 401
                    if (userJwt.token === '0') {
                        ctx.body = {
                            status: 1,
                            msg: '登录失效'
                        }
                    } else {
                        ctx.body = {
                            status: 1,
                            msg: '强制下线'
                        }
                    }
                    return
                }
                ctx.session.msg = '登录了'
                ctx.body = {
                    status: 0,
                    msg: '已登录',
                    data: { userInfo: userInfo.account, loginStatus: true }
                }
            } catch(e) {
                console.log(e.name, '错误1')
                ctx.status = 403
                switch(e.name) {
                    case 'JsonWebTokenError':
                        ctx.body = {
                            status: 1,
                            msg: '无效的token'
                        }
                        return
                    case 'TokenExpiredError':
                        ctx.body = {
                            status: 1,
                            msg: 'token 已过期'
                        }
                        return
                }
            }
        }
    },

    // 退出登录
    logout: async (ctx, next) => {
        const data = ctx.request.body
        try {
            const sqlData = {
                userId: data.userId,
                token: '0'
            }
            await UserService.logOut(sqlData)
            ctx.body = {
                status: 0,
                msg: '退出成功'
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    },

    addRole: async (ctx, next) => {
        const data = ctx.request.body

        try {
            await UserService.addRole(data)
            ctx.body = {
                status: 0,
                msg: '创建成功'
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    },

    getUser: async (ctx, next) => {
        const { id } = ctx.request.query
        console.log(`query参数：${id}`)
        try {
            const user = await UserService.getUser(id)
            ctx.body = {
                status: 0,
                data: user
            }
        } catch(e) {
            console.log(e)
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    },

    addPhone: async (ctx, next) => {
        const data = ctx.request.body
        console.log(data.data)
        try {
            await UserService.addPhone(data.data)
            ctx.body = {
                status: 1,
                msg: '创建成功'
            }
        } catch(e) {
            ctx.body = {
                status: 0
            }
        }
    },

    getPhone: async (ctx, next) => {
        const { id } = ctx.request.query
        try {
            const Phone = await UserService.getPhone(id)
            ctx.body = {
                status: 0,
                data: Phone
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    },

    addArticle: async (ctx, next) => {
        const data = ctx.request.body
        try {
            await UserService.addArticle(data)
            ctx.body = {
                status: 0,
                msg: '创建成功'
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    },

    addTag: async (ctx, next) => {
        const data = ctx.request.body
        try {
            await UserService.addTag(data)
            ctx.body = {
                status: 0,
                msg: '创建成功'
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    },

    getArticle: async (ctx, next) => {
        const { id } = ctx.params
        try {
            const data = await UserService.getArticle(id)
            ctx.body = {
                status: 0,
                data
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    },

    getTag: async(ctx, next) => {
        try {
            const { id } = ctx.params
            const Tags = await UserService.getTag(id)
            ctx.body = {
                status: 1,
                data: Tags
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '系统繁忙'
            }
        }
    }
}