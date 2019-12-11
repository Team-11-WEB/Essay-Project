module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'essay',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      bookName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'book_name'
      },
      bookAuthor: {
        type: DataTypes.STRING(255),
        field: 'book_author'
      },
      essayAuthor: {
        type: DataTypes.STRING(255),
        field: 'essay_author'
      },
      title: {
        type: DataTypes.STRING(200)
      },
      content: {
        type: DataTypes.TEXT
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
