const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const Sticker = sequelize.define('Sticker', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    packId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'sticker_packs',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    code: {
        // chat alias, i.e. :pepe_sad:
        type: DataTypes.STRING(32),
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    thumbUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    width: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: true,
    },
    height: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: true,
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: -1,
    },
}, {
    tableName: 'stickers',
    timestamps: true,
});

module.exports = Sticker;