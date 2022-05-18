const moment = require('moment')
module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('User', {
        account: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            get() {
                return moment(this.getDataValue('updateTimestamp')).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    }, {
        freezeTableName: false // 告诉 sequelize 不需要自动将表名变成复数
    })
    
    const Role = sequelize.define('Role', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        uid: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
            timestamps: true,
            createdAt: false,
            updatedAt: 'updateTimestamp'
    })

    const Phone = sequelize.define('Phone', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true // 唯一
        },
        uid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        model: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        updatedAt: {
            type: Sequelize.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    })

    // const UserPhone = sequelize.define('UserPhone', {
    //     uid: {
    //         type: Sequelize.INTEGER,
    //         references: {
    //             model: Users,
    //             key: 'id'
    //         }
    //     },

    //     phoneId: {
    //         type: Sequelize.INTEGER,
    //         references: {
    //             model: Phone,
    //             key: 'id'
    //         }
    //     }
    // })

    // 一对多关联
    Users.hasMany(Phone, {
        foreignKey: 'uid',
        sorceKey: 'id'
    })

    Phone.belongsTo(Users, {
        foreignKey: 'uid',
        targetKey: 'id'
    })
    // Users.belongsToMany(Phone, { through: 'UserPhone', foreignKey: 'uid' })
    // Phone.belongsToMany(Users, { through: 'UserPhone', foreignKey: 'phoneId' })

    return {
        Users,
        Role,
        Phone
    }
}