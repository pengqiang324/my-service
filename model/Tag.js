const moment = require('moment')
module.exports = (sequelize, Sequelize) => {
    const Article = sequelize.define('Article', {
        name: {
            type: Sequelize.STRING
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

    const Tag = sequelize.define('Tag', {
        name: {
            type: Sequelize.STRING
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

    const ArticleTag = sequelize.define('ArticleTag', {
        articleId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        tagId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })

    Article.belongsToMany(Tag, { through: ArticleTag, foreignKey: 'articleId' })
    Tag.belongsToMany(Article, { through: ArticleTag, foreignKey:　'tagId' })

    return {
        Article,
        Tag,
        ArticleTag
    }
}