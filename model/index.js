const Sequelize = require('sequelize')
const config = require('../config/dbInfo.js')
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 1,
        idle: 1000
    },
    timezone: '+08:00'
})

const Account = sequelize.define('Account', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.STRING,
        allowNull: false
    }
})



const UserJwt = sequelize.define('UserJwt', {
    // uuid: {
    //     type: Sequelize.NUMBER,
    //     // defaultValue: Sequelize.UUIDV1,
    //     allowNull: false
    //     // primaryKey: true
    // },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

const { Users, Role, Phone } = require('./User')(sequelize, Sequelize)
const { Article, Tag } = require('./Tag')(sequelize, Sequelize)
sequelize.sync({ force: false })

// User表 关联 Role表
Users.hasOne(Role, {
    foreignKey: 'uid',
    sorceKey: 'id',
    as: 'roles'
})
// Role.belongsTo(Users,{
//     foreignKey: 'uid',
//     targetKey: 'id'
// })
module.exports = {
    Account,
    Users,
    UserJwt,
    Role,
    Phone,
    Article,
    Tag
}