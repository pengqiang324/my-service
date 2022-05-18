const AccountService = require('../service/Account')

module.exports = {
    getAccount: async (ctx, next) => {
        const { name } = ctx.request.body
        ctx.type = 'json'
        const account = await AccountService.getAccountByUserName(name)
        ctx.response.body = {
            status: 0,
            data: account
        }
    },

    addAccount: async (ctx, next) => {
        const body = ctx.request.body
        const account = await AccountService.getAccountByUserName(body.name)
        ctx.type = 'json'
        if (account[0]) {
            ctx.body = {
                status: 1,
                msg: '账号已经存在'
            }
        } else {
            ctx.type = 'json'
            try {
                await AccountService.addAccount(body)
                ctx.body = {
                    status: 0,
                    msg: '账号创建成功'
                }
            } catch(e) {
                ctx.body = {
                    status: 1,
                    msg: '系统繁忙'
                }
            }
        }
    },

    updateAccount: async (ctx, next) => {
        const id = ctx.params.id
        const account = ctx.request.body
        try {
            await AccountService.updateAccount(id, account)
            ctx.type = 'json'
            ctx.body = {
                status: 0,
                msg: '更新成功'
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '账号不存在'
            }
        }
    },

    deletAccount: async (ctx, next) => {
        const id = ctx.params.id
        try {
            await AccountService.deletAccount(id)
            ctx.type = 'json'
            ctx.body = {
                status: 0,
                msg: '删除成功'
            }
        } catch(e) {
            ctx.body = {
                status: 1,
                msg: '删除失败'
            }
        }
    },

    getAllAccountList: async (ctx, next) => {
        const data = ctx.request.body
        const res = await AccountService.getAccountList(data)
        ctx.type = 'json'
        ctx.body = {
            status: 0,
            ...res
        }
    }
}