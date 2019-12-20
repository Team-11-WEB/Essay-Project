module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'classstory',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      classDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'class_date'
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
      key: {
        type: DataTypes.STRING(255),
        allowNull: false
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
