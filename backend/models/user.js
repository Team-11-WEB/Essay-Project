module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      classId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'class_id'
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      token: {
        type: DataTypes.STRING(255)
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'email'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      }
    },
    {
      timestamps: false
    },
    {
      indexes: [
        {
          unique: true,
          field: ['email']
        }
      ]
    }
  );
};
