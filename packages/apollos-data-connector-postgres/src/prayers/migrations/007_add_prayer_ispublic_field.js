import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('prayer_request', 'isPublic', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('prayer_request', 'isPublic');
}

const name = '005-add-prayer-approved-field';

module.exports = { up, down, name, order: 7 };
