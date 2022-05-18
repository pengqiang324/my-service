const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { crypto: cryptoConfig, bcrypt: bcryptConfig } = require('../config')

// md5 加密
function md5(v) {
    const { JOINSTR } = cryptoConfig
    return crypto.createHash('md5').update(v + JOINSTR).digest('hex')
}

// 密码加盐
function encryptPassword(password) {
    const { saltRounds } = bcryptConfig
    const pwdEncode = md5(password)
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(pwdEncode, salt)
}

// 密码验证
function verifyPassword(inputPwd, userPwd ) {
    const pwdEncode = md5(inputPwd)
    return bcrypt.compareSync(pwdEncode, userPwd)
}

module.exports = {
    encryptPassword,
    verifyPassword
}