const { Account } = require('../model/index.js')

class AccountService {
    // 通过 id 查询
    async getAccountById(id) {
        return Account.findOne({
            where: {
                id: id
            }
        })
    }

    // 通过 username 查询
    async getAccountByUserName(name) {
        return Account.findAll({
            where: {
                name: name
            }
        })
    }

    // 分页查询
    async getAccountList(data) {
        let query = {}
        if (data.name) {
            query.name = data.name
        }
        return Account.findAndCountAll({
            where: query,
            offset: (data.page - 1) * data.pageSize,
            limit: data.pageSize
        })
    }

    // 创建一条数据
    async addAccount(account) {
        return Account.create(account)
    }

    // 更新数据
    async updateAccount(id, account) {
        const accountById = await this.getAccountById(id)
        if (accountById) {
            return accountById.update(account)
        } else {
            throw new Error('the account with id is not exist!')
        }
        // return Account.update(account, {
        //     where: {
        //         id: id
        //     }
        // })
    }

    // 删除数据
    async deletAccount(id) {
        return Account.destroy({
            where: {
                id: id
            }
        })
    }
}

module.exports = new AccountService()

