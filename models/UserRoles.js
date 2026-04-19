const { Model, DataTypes } = require('sequelize');

class UserRoles extends Model {}

UserRoles.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // assuming you have a Users model
            key: 'id'
        }
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Roles', // assuming you have a Roles model
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
},{
    sequelize,
    modelName: 'UserRoles',
    tableName: 'user_roles',
});

module.exports = UserRoles;