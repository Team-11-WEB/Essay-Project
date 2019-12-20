module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'schedule',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      classData: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'class_data'
      },
      location: {
        type: DataTypes.TEXT
      },
      attachTitle: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'attach_title'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'create_at'
      }
    },
    {
      timestamps: false
    }
  );
};
