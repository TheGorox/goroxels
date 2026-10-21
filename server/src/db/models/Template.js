const Sequelize = require('sequelize');

const { sequelize } = require('../index');
const { User } = require('./User');

const Template = sequelize.define('template', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    x: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    y: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    name: {
        primaryKey: false,
        type: Sequelize.STRING(32),
        allowNull: false
    },
    // шаблоны заливаются теперь только
    // в виде оригиналов
    file: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    // в узоры конвертируются уже на стороне сервера
    filePatterns: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    thumb: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    public: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    width: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    height: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = Template;