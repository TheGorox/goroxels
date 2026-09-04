const { sequelize } = require('../index');

const { User, Badge } = require('./User');
const Template = require('./Template');
const Whitelist = require('./Whitelist');
const Blacklist = require('./Blacklist');
const ChatMessages = require('./ChatMessages');
const Pixel = require('./Pixel');
const Song = require('./Song');
const StickerPack = require('./StickerPack');
const Sticker = require('./Sticker');

Template.belongsTo(User);
User.hasMany(Template);

User.belongsToMany(Badge, { through: 'UserBadges' });
Badge.belongsToMany(User, { through: 'UserBadges' });

Whitelist.belongsTo(User, { foreignKey: 'addedBy' });
Blacklist.belongsTo(User, { foreignKey: 'addedBy' });

User.hasMany(Pixel);
Pixel.belongsTo(User, { primaryKey: true });

StickerPack.hasMany(Sticker, { foreignKey: 'packId', as: 'stickers' });
Sticker.belongsTo(StickerPack, { foreignKey: 'packId', as: 'pack' });

async function initModels() {
    if (sequelize.getDialect() === 'sqlite') {
        await sequelize.query('PRAGMA foreign_keys = OFF;');
        await sequelize.sync({ force: true });
        await sequelize.query('PRAGMA foreign_keys = ON;');
    }else{
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await sequelize.sync();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    }

    await StickerPack.findOrCreate({
        where: { title: 'General' },
        defaults: { title: 'General', isPublic: true }
    });
}

module.exports = {
    sequelize,
    initModels
};