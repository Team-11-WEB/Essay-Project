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
      classId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'class_id'
      },
      classDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'class_date'
      },
      location: {
        type: DataTypes.TEXT
      },
      attachUrl: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'attach_url'
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
