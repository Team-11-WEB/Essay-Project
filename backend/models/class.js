module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'class',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      classData: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'class_data'
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT
      },
      classImg: {
        type: DataTypes.STRING(225),
        field: 'class_img'
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
