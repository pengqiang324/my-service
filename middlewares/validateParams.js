
/**
 * @description 参数校验中间件
 */

const { ErrorModel } = require('../utils/Resmodel')

function getValidateParamas(method, schema) {
    async function validateParams(ctx, next) {
        let data
        if (method === 'get') {
            data = ctx.request.query
        } else {
            data = ctx.request.body
        }

        const { error } = schema.validate(data)
        console.log(error, '发生了错误')
        if (error) {
            ctx.body = new ErrorModel(error.message)
            return
        }

        await next()
    }
    return validateParams
}

module.exports = getValidateParamas