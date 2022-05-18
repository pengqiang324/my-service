
const Sequelize = require('sequelize');
const { Users, UserJwt, Role, Phone, Article, Tag } = require('../model/index')
class UserService {
    async login(data) {
        return Users.findOne({
            where: {
                account: data.account
            }
        })
    }

    // 注册用户
    async regiter(data) {
        return Users.create(data)
    }

    async registerUserJwt(data) {
        return UserJwt.create(data)
    }

    async getUserJwt(data) {
        return UserJwt.findOne({
            where: {
                userId: data.id
            }
        })
    }

    async logOut(data) {
        const User = await UserJwt.findOne({
            where: {
                userId: data.userId
            }
        })
        if (User) {
            return User.update(data)
        } else {
            throw new Error('user is no exist')
        }
    }

    async addRole(data) {
        return Role.create(data)
    }

    async getUser(id) {
        return Users.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Role,
                    as: 'roles'
                },
                {
                    model: Phone
                }
            ]
        })
    }

    async addPhone(data) {
        return Phone.bulkCreate(data)
    }

    async getPhone(id) {
        return Phone.findOne({
            where: {
                id
            },
            include: [{
                attributes: ['id', 'account', 'updatedAt'],
                model: Users
            }]
        })
    }

    async addArticle(data) {
        try {
            let newArticle = await Article.create({ name: data.name })
            let tags = await Tag.findAll({ where: { id: data['tagsId'] } })
            console.log(tags)
            await newArticle.setTags(tags)
            Promise.resolve()
        } catch(e) {
            Promise.reject(e)
        }
    }

    async addTag(data) {
        return Tag.create(data)
    }

    async getArticle(id) {
        return Article.findOne({
            where: {
                id: id
            },
            include: {
                model: Tag,
                attributes: ['id', 'name']
            }
        })
    }

    async getTag(id) {
        return Tag.findOne({
            where: {
                id
            },
            include: {
                model: Article
            }
        })
    }
}

module.exports = new UserService()
