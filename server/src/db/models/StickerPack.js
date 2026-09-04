const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const StickerPack = sequelize.define('StickerPack', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    iconUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'sticker_packs',
    timestamps: true,
});

module.exports = StickerPack;