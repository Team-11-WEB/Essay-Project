'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Attach = require('./attach')(sequelize, Sequelize);
db.Classstory = require('./classstory')(sequelize, Sequelize);
db.Essay = require('./essay')(sequelize, Sequelize);
db.Qna = require('./qna')(sequelize, Sequelize);
db.Schedule = require('./schedule')(sequelize, Sequelize);
db.New = require('./new')(sequelize, Sequelize);

db.User.hasMany(db.Qna, {
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
});
db.Qna.belongsTo(db.User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
});

db.User.hasMany(db.Essay, {
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
});
db.Essay.belongsTo(db.User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
});

module.exports = db;
