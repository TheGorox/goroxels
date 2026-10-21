module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('templates', 'id', {
            type: Sequelize.INTEGER,
            allowNull: true
        });

        await queryInterface.addColumn('templates', 'x', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: true
        });

        await queryInterface.addColumn('templates', 'y', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: true
        });

        const templates = await queryInterface.sequelize.query(
            'SELECT name FROM templates',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        for (let i = 0; i < templates.length; i++) {
            await queryInterface.sequelize.query(
                'UPDATE templates SET id = :id WHERE name = :name',
                {
                    replacements: { id: i + 1, name: templates[i].name },
                    type: queryInterface.sequelize.QueryTypes.UPDATE
                }
            );
        }

        await queryInterface.changeColumn('templates', 'id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        });

        await queryInterface.removeConstraint('templates', 'templates_pkey');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('templates', 'templates_name_unique');
        
        await queryInterface.removeColumn('templates', 'id');
        
        await queryInterface.changeColumn('templates', 'name', {
            type: Sequelize.STRING(32),
            allowNull: false,
            primaryKey: true
        });
    }
};