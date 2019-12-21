module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'new',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      phoneNum: {
        type: DataTypes.STRING(30),
        allowNull: false,
        field: 'phone_num'
      },
      age: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT
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
    }
  );
};
